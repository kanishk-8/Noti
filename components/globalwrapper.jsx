import { View, Text } from "react-native";
import React from "react";
import { Colors } from "../constants/Colors";

const GlobalWrapper = ({ children }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.BACKGROUND }}>
      {children}
    </View>
  );
};

export default GlobalWrapper;
