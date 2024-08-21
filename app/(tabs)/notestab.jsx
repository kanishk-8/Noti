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

export default function Explore() {
  const [title, setTitle] = useState(""); // State for the note title
  const [content, setContent] = useState(""); // State for the note content
  const [notes, setNotes] = useState([]); // State for fetched notes
  const [currentNoteId, setCurrentNoteId] = useState(null); // State for the current note ID

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
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Save Note" />
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50,
  },
  titleInput: {
    fontSize: 20,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  contentInput: {
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    height: 150, // Adjust height as needed
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
});
