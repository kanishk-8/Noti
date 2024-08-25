import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { Colors } from "../constants/Colors";

const ScreenWrapper = ({ children }) => {
  const { width, height } = Dimensions.get("window");

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.wrapper]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND, // Set a default background color if needed
  },
  wrapper: {
    flex: 1,
    // You can add other styles here if needed
    marginTop: Platform.OS === "android" ? 25 : 0,
    padding: 10,
  },
});

export default ScreenWrapper;
