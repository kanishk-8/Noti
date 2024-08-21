import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Landingpage() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "red", fontSize: 18, marginBottom: 20 }}>
        Please login to continue
      </Text>
      <TouchableOpacity onPress={() => router.push("/auth/SignIn")}>
        <Image
          source={require("../assets/gif/XOsX.gif")}
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
