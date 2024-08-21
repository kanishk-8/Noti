import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Colors } from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../../configs/FirebaseConfigs";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

export default function Header() {
  const user = auth.currentUser;

  return (
    <View style={styles.page}>
      <BlurView intensity={50} style={styles.container}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => router.push("/Profile/Account")}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require("../../assets/images/user.png")}
                style={styles.profileImage}
              />
            )}
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color={Colors.PRIMARY} />
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
              onChangeText={(value) => console.log(value)}
            />
          </View>
        </View>
      </BlurView>
      <View style={styles.notesSection}>
        <Text>Notes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    // backgroundColor: "black",
    flexDirection: "column",
  },
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
    marginRight: 15,
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
  notesSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
});
