import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../../configs/FirebaseConfigs";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";

export default function NotesRender() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const noteId = params.noteId; // Get noteId from query params
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(true);
  const richText = useRef();
  const [scrollViewHeight, setScrollViewHeight] = useState(
    Dimensions.get("window").height - 150
  );

  useEffect(() => {
    const onKeyboardShow = () => {
      setScrollViewHeight(Dimensions.get("window").height - 150);
    };
    const onKeyboardHide = () => {
      setScrollViewHeight(Dimensions.get("window").height - 150);
    };

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (noteId) {
      fetchNote();
    } else {
      setLoading(false); // No need to fetch if creating a new note
    }
  }, [noteId]);

  const fetchNote = async () => {
    setLoading(true);
    try {
      const noteRef = doc(db, "notes", noteId);
      const noteSnap = await getDoc(noteRef);
      if (noteSnap.exists()) {
        const note = noteSnap.data();
        setNoteTitle(note.title);
        setNoteContent(note.content);
      } else {
        console.error("No such note!");
      }
    } catch (error) {
      console.error("Error fetching note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = useCallback(async () => {
    const titleToSave = noteTitle.trim() ? noteTitle : "Untitled";
    const contentToSave =
      (await richText.current?.getContentHtml())?.trim() || "";

    try {
      if (noteId) {
        // Update existing note
        const noteRef = doc(db, "notes", noteId);
        await updateDoc(noteRef, {
          title: titleToSave,
          content: contentToSave,
          updatedAt: new Date(),
        });
        ToastAndroid.show("Note updated successfully", ToastAndroid.SHORT);
        router.push("../(tabs)/notestab"); // Redirect to notes tab after updating
      } else {
        // Add new note
        const docRef = await addDoc(collection(db, "notes"), {
          title: titleToSave,
          content: contentToSave,
          createdAt: new Date(),
        });
        ToastAndroid.show("Note added successfully", ToastAndroid.SHORT);
        router.back(); // Navigate to the newly created note
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }, [noteId, noteTitle, richText, router]);

  const handleDeleteNote = useCallback(async () => {
    if (noteId) {
      try {
        await deleteDoc(doc(db, "notes", noteId));
        ToastAndroid.show("Note deleted successfully", ToastAndroid.SHORT);
        router.push("../(tabs)/notestab");
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  }, [noteId, router]);

  if (loading) {
    return (
      <ActivityIndicator style={styles.loading} size="large" color="black" />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
            <Ionicons name="save-outline" size={24} color="black" />
          </TouchableOpacity>
          {noteId && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteNote}
            >
              <Ionicons name="trash-outline" size={24} color="#b53740" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Untitled"
          value={noteTitle}
          onChangeText={setNoteTitle}
        />
        <RichToolbar
          editor={richText}
          actions={[
            actions.undo,
            actions.redo,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.checkboxList,
          ]}
          style={styles.toolbar}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ minHeight: scrollViewHeight }}
        showsVerticalScrollIndicator={false}
      >
        <RichEditor
          ref={richText}
          initialContentHTML={noteContent}
          editorStyle={styles.richEditor}
          style={styles.richEditor}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  closeButton: {
    padding: 10,
  },
  saveButton: {
    padding: 10,
  },
  deleteButton: {
    padding: 10,
  },
  titleInput: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 8,
  },
  toolbar: {
    backgroundColor: "transparent",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    // marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  richEditor: {
    minHeight: 600,
    backgroundColor: "transparent",
  },
});
