import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { router } from "expo-router";

export default function Setting() {
  return (
    <View
      style={{
        flex: 1,
        // margin: 20,
        marginTop: 30,
        width: "100%",
        height: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            color: "black",
            fontFamily: "outfit-SemiBold",
            fontSize: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Help Section
        </Text>
      </View>
    </View>
  );
}
