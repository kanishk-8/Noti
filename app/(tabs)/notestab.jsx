import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../configs/FirebaseConfigs"; // Ensure this path is correct
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const notesCollection = collection(db, "notes");
      const noteSnapshot = await getDocs(notesCollection);
      const notesList = noteSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesList);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      alert("Title and Content cannot be empty");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title: newNoteTitle,
        content: newNoteContent,
        createdAt: new Date(),
      });
      const newNote = {
        id: docRef.id,
        title: newNoteTitle,
        content: newNoteContent,
      };
      setNotes([...notes, newNote]);
      setNewNoteTitle("");
      setNewNoteContent("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const loadNote = (note) => {
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setIsModalVisible(true);
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity onPress={() => loadNote(item)}>
      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteContent} numberOfLines={1}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={60} color="black" />
      </TouchableOpacity>

      {/* Modal for Adding or Viewing a Note */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a New Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Content"
            value={newNoteContent}
            onChangeText={setNewNoteContent}
            multiline
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={addNote}>
              <Text style={styles.buttonText}>Add Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "outfit-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 10,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "black",
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "outfit-Bold",
  },
});
