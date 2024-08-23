import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { BlurView } from "expo-blur";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import {
  GestureHandlerRootView,
  LongPressGestureHandler,
  State,
} from "react-native-gesture-handler";

// Example function for handling long press
const handleLongPress = (tabName) => {
  console.log(`Long pressed on ${tabName}`);
};

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#b53740",
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
            height: 60,
            overflow: "hidden",
            backgroundColor: "transparent",
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          tabBarBackground: () => (
            <BlurView
              intensity={40}
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
              <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === State.ACTIVE) {
                    handleLongPress("Home");
                  }
                }}
              >
                <View>
                  <Ionicons name="home-outline" size={24} color={color} />
                </View>
              </LongPressGestureHandler>
            ),
          }}
        />
        <Tabs.Screen
          name="notestab"
          options={{
            tabBarLabel: "Notes",
            tabBarIcon: ({ color }) => (
              <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === State.ACTIVE) {
                    handleLongPress("Notes");
                  }
                }}
              >
                <View>
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color={color}
                  />
                </View>
              </LongPressGestureHandler>
            ),
          }}
        />
        <Tabs.Screen
          name="todotab"
          options={{
            tabBarLabel: "Todo",
            tabBarIcon: ({ color }) => (
              <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === State.ACTIVE) {
                    handleLongPress("Todo");
                  }
                }}
              >
                <View>
                  <Ionicons name="checkbox-outline" size={24} color={color} />
                </View>
              </LongPressGestureHandler>
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
