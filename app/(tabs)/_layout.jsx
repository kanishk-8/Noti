import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { BlurView } from "expo-blur";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Touchable,
  TouchableOpacity,
  Vibration,
} from "react-native";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  State,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Colors } from "../../constants/Colors";

const vibrationPattern = 30; // Duration in milliseconds

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    outfit: require("../../assets/fonts/Outfit-Regular.ttf"),
    outfitSemiBold: require("../../assets/fonts/Outfit-SemiBold.ttf"),
    outfitMedium: require("../../assets/fonts/Outfit-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#b53740" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.Themecolor,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: Colors.dark.tint,
        tabBarStyle: {
          position: "absolute",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          height: 65,
          overflow: "hidden",
          backgroundColor: "transparent",
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
        tabBarBackground: () => (
          <BlurView
            intensity={30}
            style={{
              ...StyleSheet.absoluteFillObject,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                Vibration.vibrate(vibrationPattern);
              }}
            >
              <Ionicons name="home-outline" size={28} color={color} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Tabs.Screen
        name="notestab"
        options={{
          tabBarLabel: "Notes",
          tabBarIcon: ({ color }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                Vibration.vibrate(vibrationPattern);
              }}
            >
              <Ionicons name="document-text-outline" size={28} color={color} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Tabs.Screen
        name="todotab"
        options={{
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color }) => (
            <TouchableWithoutFeedback
              onPress={() => {
                Vibration.vibrate(vibrationPattern);
              }}
            >
              <Ionicons name="checkbox-outline" size={28} color={color} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
    </Tabs>
  );
}
