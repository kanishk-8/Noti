import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "expo-dev-client";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    outfitSemiBold: require("../assets/fonts/Outfit-SemiBold.ttf"),
    outfitMedium: require("../assets/fonts/Outfit-Medium.ttf"),
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{ headerShown: false }}
        style={{ flex: 1, backgroundColor: "black" }}
      >
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="notestab" /> */}
        <Stack.Screen name="notes" />
      </Stack>
    </GestureHandlerRootView>
  );
}
