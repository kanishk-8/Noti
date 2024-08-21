import { Ionicons } from "@expo/vector-icons";
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
} from "react-native";

export default function Todo() {
  const [notes, setNotes] = useState([]); // State for fetched notes

  const renderNote = ({ item }) => (
    <TouchableOpacity onPress={() => loadNote(item)}>
      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteContent} numberOfLines={1}>
          {item.content}
        </Text>{" "}
        {/* Displaying content without stripping HTML */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo</Text>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={60} color={"black"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50,
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
  addButton: {
    position: "absolute",
    bottom: 70,
    right: 30,
  },
  list: {
    marginTop: 20,
  },
});
