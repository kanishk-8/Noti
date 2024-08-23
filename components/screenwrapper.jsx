import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";

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
    backgroundColor: "white", // Set a default background color if needed
  },
  wrapper: {
    flex: 1,
    // You can add other styles here if needed
    marginTop: Platform.OS === "android" ? 25 : 0,
  },
});

export default ScreenWrapper;
