import React from "react";
import { View, StyleSheet, TouchableOpacity, Vibration } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../constants/Colors";

const vibrationPattern = 30; // Duration in milliseconds

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const icon = options.tabBarIcon;
        const isFocused = state.index === index;

        const onPress = () => {
          Vibration.vibrate(vibrationPattern);
          navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tabButton}
          >
            {icon({
              color: isFocused ? Colors.dark.tabIconSelected : Colors.dark.tint,
            })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 0,
    paddingTop: 8,
    paddingBottom: 8,
    height: 65,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
});

export default CustomTabBar;
