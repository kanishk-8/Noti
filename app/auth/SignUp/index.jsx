import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { auth, storage } from "../../../configs/FirebaseConfigs";
import { Colors } from "../../../constants/Colors";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      avoidEmptySpaceAroundImage: true,
      cropperCircularOverlay: true,
      freeStyleCropEnabled: true,
      includeBase64: Platform.OS === "android",
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (userId) => {
    if (!image) return null;

    const blob = await fetch(image).then((res) => res.blob());
    const storageRef = ref(storage, `profileImages/${userId}`);
    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  };

  const onCreateAccount = async () => {
    if (!fullname || !email || !password) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const imageUrl = await uploadImage(user.uid);

      await updateProfile(user, {
        displayName: fullname,
        photoURL: imageUrl,
      });

      await sendEmailVerification(user);
      ToastAndroid.show("Email verification sent", ToastAndroid.SHORT);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Error creating account:", error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            image ? { uri: image } : require("../../../assets/images/user.png")
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        onChangeText={(text) => setFullname(text)}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.signupButton} onPress={onCreateAccount}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.signinPrompt}>
        <Text>Welcome back, please sign in to continue</Text>
        <TouchableOpacity onPress={() => router.replace("/auth/SignIn")}>
          <Text style={styles.signinLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 20,
  },
  input: {
    width: "90%",
    fontFamily: "outfitSemiBold",
    fontSize: 16,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
  signupButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "outfitSemiBold",
  },
  signinPrompt: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  signinLink: {
    color: "lightblue",
  },
});
