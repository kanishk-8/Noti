import { Text, View, ActivityIndicator } from "react-native";
import Landingpage from "../components/Landingpage";
import { auth } from "../configs/FirebaseConfigs";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenwrapper";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, redirect to home
        if (router.pathname !== "/home") {
          router.replace("/home");
        }
      } else {
        // User is not logged in
        setLoading(false); // Set loading to false after checking auth state
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    // Show a loading screen while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show the Landingpage if the user is not authenticated
  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <Landingpage />
      </View>
    </ScreenWrapper>
  );
}
