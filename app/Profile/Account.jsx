import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  ToastAndroid,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { auth, storage } from "../../configs/FirebaseConfigs";
import {
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CustomModal from "../../components/modal";
import ScreenWrapper from "../../components/screenwrapper";

export default function Setting() {
  const [user, setUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmailVerified(user.emailVerified);
        setFullName(user.displayName || "");
        setImageUri(user.photoURL || null);
      } else {
        setUser(null);
        setEmailVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSendVerification = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        Alert.alert("Verification Email Sent", "Please check your email.");
        setVerificationSent(true);

        setTimeout(async () => {
          await user.reload();
          setEmailVerified(user.emailVerified);
          setVerificationSent(false);
        }, 120000);
      } catch (error) {
        console.error("Error sending email verification:", error);
        Alert.alert("Error", "Could not send verification email.");
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: Platform.OS === "android",
      cropperCircleOverlay: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      ToastAndroid.show("Image selected", ToastAndroid.SHORT);
    } else {
      console.log("Image selection was canceled.");
    }
  };

  const uploadImage = async (userId) => {
    if (!imageUri) {
      console.log("No image URI provided.");
      return null;
    }

    try {
      const response = await fetch(imageUri);
      if (!response.ok) throw new Error("Failed to fetch image.");

      const blob = await response.blob();
      console.log("Blob created:", blob);

      const storageRef = ref(storage, `profileImages/${userId}`);
      const snapshot = await uploadBytes(storageRef, blob);
      console.log("Upload snapshot:", snapshot);

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Image URL:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      ToastAndroid.show("Error uploading image", ToastAndroid.SHORT);
    }
  };

  const onUpdateAccount = () => {
    if (!fullName || !email) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      return;
    } else {
      setModalMessage("Are you sure you want to update your profile details?");
      setShowModal(true);
    }
  };

  const handleModalConfirm = async () => {
    setShowModal(false);
    try {
      if (email !== user.email) {
        ToastAndroid.show("Enter correct email", ToastAndroid.SHORT);
        return;
      }

      const imageUrl = await uploadImage(user.uid);
      await updateProfile(user, {
        displayName: fullName,
        photoURL: imageUrl || user.photoURL,
      });

      // Reload user to reflect changes
      await user.reload();
      setUser(auth.currentUser); // Refresh user state

      ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error updating profile:", error);
      ToastAndroid.show("Error updating profile", ToastAndroid.SHORT);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    console.log("Modal canceled");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>User not signed in.</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Account</Text>
        </View>
        {emailVerified ? (
          <View style={styles.statusContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : user.photoURL
                    ? { uri: user.photoURL }
                    : require("../../assets/images/user.png")
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              onChangeText={(text) => setFullName(text)}
              value={fullName}
            />
            <TextInput
              placeholder="Enter your Email"
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
            />

            <TouchableOpacity style={styles.button} onPress={onUpdateAccount}>
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Email Not Verified</Text>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleSendVerification}
              disabled={verificationSent}
            >
              <Text style={styles.verifyButtonText}>
                {verificationSent ? "Verification Sent" : "Verify Email"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <CustomModal
          visible={showModal}
          message={modalMessage}
          onConfirm={handleModalConfirm}
          onClose={handleModalCancel}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 30,
    width: "100%",
    height: "100%",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    color: "black",
    fontFamily: "outfit-SemiBold",
    fontSize: 20,
  },
  statusContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  statusText: {
    color: "black",
    fontFamily: "outfit-SemiBold",
    fontSize: 20,
    margin: 10,
  },
  verifyButton: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop: 10,
  },
  verifyButtonText: {
    fontFamily: "outfit-SemiBold",
    fontSize: 20,
    color: "#007bff",
  },
  text: {
    color: "black",
    fontFamily: "outfit-SemiBold",
    fontSize: 20,
  },
  button: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontFamily: "outfit-SemiBold",
    fontSize: 20,
  },
  input: {
    width: "90%",
    fontFamily: "outfit-SemiBold",
    fontSize: 16,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
});
