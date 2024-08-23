import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../configs/FirebaseConfigs";
import { onAuthStateChanged } from "firebase/auth";
import { Colors } from "../../constants/Colors";
import CustomModal from "../../components/modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenWrapper from "../../components/screenwrapper";

export default function Profile() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user is logged in, redirect to the sign-in page
        router.replace("/auth/SignIn");
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = () => {
    setModalMessage("Are you sure you want to sign out?");
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    auth
      .signOut()
      .then(() => {
        console.log("User signed out");
        ToastAndroid.show("User signed out", ToastAndroid.SHORT);
        router.replace("/"); // Redirect to the landing page after signing out
      })
      .catch((error) => {
        console.log("Error signing out:", error);
        ToastAndroid.show("Error signing out", ToastAndroid.SHORT);
      });
  };

  const handleModalCancel = () => {
    setShowModal(false);
    console.log("Modal canceled");
  };

  const user = auth.currentUser;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Section</Text>
        </View>

        <View style={styles.profileSection}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require("../../assets/images/user.png")}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.userName}>{user?.displayName}</Text>
          <Text style={styles.userEmail}>Email: {user?.email}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Profile/Account")}
          >
            <Text style={styles.buttonText}>Edit Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Profile/Setting")}
          >
            <Text style={styles.buttonText}>Setting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/Profile/Help")}
          >
            <Text style={styles.buttonText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Modal */}
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
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    padding: 20,
    width: "100%",
  },
  headerTitle: {
    color: "black",
    fontFamily: "outfit-SemiBold",
    fontSize: 20,
  },

  profileSection: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  userName: {
    color: "black",
    fontFamily: "outfit-bold",
    fontSize: 30,
    marginTop: 10,
  },
  userEmail: {
    color: "black",
    fontFamily: "outfit",
    fontSize: 18,
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    padding: 10,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 5,
  },
  buttonText: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-SemiBold",
    fontSize: 20,
  },
  signOutButton: {
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // backgroundColor: "red",
  },
  signOutButtonText: {
    color: "red",
    fontSize: 20,
    fontFamily: "outfit-semibold",
  },
});
