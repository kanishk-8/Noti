// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this line
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_Firebase_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_Firebase_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_Firebase_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_Firebase_storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_Firebase_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_Firebase_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { app, auth, db, storage };
