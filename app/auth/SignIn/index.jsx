import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth"; // Importing auth from react-native-firebase
import { Colors } from "../../../constants/Colors";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    if (!email || !password) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password) // Call signInWithEmailAndPassword directly
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user", user);
        router.replace("/home"); // Navigate to the home page
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/invalid-email") {
          ToastAndroid.show("Invalid email", ToastAndroid.SHORT);
        } else if (errorCode === "auth/wrong-password") {
          ToastAndroid.show("Wrong password", ToastAndroid.SHORT); // Updated error code for wrong password
        } else {
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        }
      });
  };

  const ForgetPassword = () => {
    if (!email) {
      ToastAndroid.show("Please enter your email", ToastAndroid.SHORT);
      return;
    }
    auth()
      .sendPasswordResetEmail(email) // Call sendPasswordResetEmail directly
      .then(() => {
        ToastAndroid.show("Password reset email sent", ToastAndroid.SHORT);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/invalid-email") {
          ToastAndroid.show("Invalid email", ToastAndroid.SHORT);
        } else if (errorCode === "auth/user-not-found") {
          ToastAndroid.show("Email not registered", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={onSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ForgetPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          New here? Please sign up to continue
        </Text>
        <TouchableOpacity onPress={() => router.replace("/auth/SignUp")}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
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
  button: {
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
    fontSize: 16,
  },
  forgotPasswordText: {
    color: "red",
    marginTop: 20,
  },
  signupContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "black",
    fontSize: 16,
    fontFamily: "outfitSemiBold",
    marginRight: 10,
  },
  signupLink: {
    color: "lightblue",
  },
});
