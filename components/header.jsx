import { View, Text } from "react-native";
import React from "react";
import { auth } from "../configs/FirebaseConfigs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Header() {
  const user = auth.currentUser;
  return (
    <BlurView intensity={50} style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} />
          <TextInput
            placeholder="Search your notes here..."
            style={styles.searchInput}
            onChangeText={(value) => console.log(value)}
          />
        </View>
        <TouchableOpacity onPress={() => router.push("/Profile/profile")}>
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require("../assets/images/user.png")}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 20,
    height: 130,
    flexDirection: "row",
    alignItems: "center",
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: "hidden",
    backgroundColor: "black",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    gap: 16,
    borderRadius: 20,
    padding: 10,
    flex: 1, // Ensure it takes up the remaining space
  },
  searchInput: {
    width: "90%",
    fontFamily: "outfitSemiBold",
    fontSize: 16,
  },
});
