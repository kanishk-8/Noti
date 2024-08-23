import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { auth } from "../../configs/FirebaseConfigs";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/screenwrapper";

export default function Home() {
  const user = auth.currentUser;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <TouchableOpacity
            style={styles.profileImage}
            onPress={() => router.push("/Profile/profile")}
          >
            <Ionicons name="settings-outline" size={30} />
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          <Text>List of Notes</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 50,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "outfit-Bold",
  },
  noteContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noteContent: {
    color: "#666",
  },
  list: {
    marginTop: 20,
  },
  profileImage: {
    marginRight: 10,
  },
});
