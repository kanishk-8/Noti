import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "expo-dev-client";

export default function RootLayout() {
  useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    outfitSemiBold: require("../assets/fonts/Outfit-SemiBold.ttf"),
    outfitMedium: require("../assets/fonts/Outfit-Medium.ttf"),
  });
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      style={{ flex: 1, backgroundColor: "black" }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
