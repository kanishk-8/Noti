import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { BlurView } from "expo-blur";
import { auth, db } from "../configs/FirebaseConfigs";

export default function AddTodoModal({ visible, onClose, onAddTodo }) {
  const [newTodo, setNewTodo] = useState("");

  const handleAdd = () => {
    if (newTodo.trim()) {
      onAddTodo(newTodo);
      setNewTodo(""); // Clear input after adding
      onClose(); // Close modal
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Todo</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={24}
                color={Colors.dark.text}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="Enter new todo"
            placeholderTextColor={Colors.dark.content_text}
            multiline
            numberOfLines={2}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: Dimensions.get("window").width * 0.9,
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    backgroundColor: Colors.dark.background,
    borderColor: Colors.dark.content_text,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "outfit-Bold",
    color: Colors.dark.text,
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.dark.text,
    width: "100%",
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    color: Colors.dark.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addButton: {
    backgroundColor: Colors.Themecolor,
    padding: 10,
    width: "100%",
    borderRadius: 30,
    alignItems: "center",
  },
  cancelButton: {
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
