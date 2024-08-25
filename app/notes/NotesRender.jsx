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
import { db, auth } from "../../configs/FirebaseConfigs";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/screenwrapper";
import { Colors } from "../../constants/Colors";

export default function NotesRender() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const noteId = params.noteId; // Get noteId from query params
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notecreatedat, setNotecreatedat] = useState("");
  const [loading, setLoading] = useState(true);
  const richText = useRef();
  const scrollViewRef = useRef(); // Ref for ScrollView
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
      const userId = auth.currentUser?.uid; // Get the authenticated user ID
      if (userId) {
        let note;
        if (noteId) {
          // Check local storage first
          const localNote = await AsyncStorage.getItem(`note_${noteId}`);
          if (localNote) {
            note = JSON.parse(localNote);
          } else {
            // Fetch from Firebase if not in local storage
            const noteRef = doc(db, `users/${userId}/notes`, noteId);
            const noteSnap = await getDoc(noteRef);
            if (noteSnap.exists()) {
              note = noteSnap.data();
              // Save to local storage for offline access
              await AsyncStorage.setItem(
                `note_${noteId}`,
                JSON.stringify(note)
              );
            } else {
              console.error("No such note!");
            }
          }

          if (note) {
            setNoteTitle(note.title);
            setNoteContent(note.content);
            setNotecreatedat(
              note.updatedAt
                ? new Date(note.updatedAt.seconds * 1000).toLocaleString()
                : "No date"
            );
          }
        }
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
      const userId = auth.currentUser?.uid; // Get the authenticated user ID
      if (userId) {
        if (noteId) {
          // Update existing note in Firebase
          const noteRef = doc(db, `users/${userId}/notes`, noteId);
          await updateDoc(noteRef, {
            title: titleToSave,
            content: contentToSave,
            updatedAt: new Date(),
          });
          ToastAndroid.show("Note updated successfully", ToastAndroid.SHORT);

          // Update note locally
          await AsyncStorage.setItem(
            `note_${noteId}`,
            JSON.stringify({ title: titleToSave, content: contentToSave })
          );
          router.push("../(tabs)/notestab");
        } else {
          // Add new note in Firebase
          const docRef = await addDoc(collection(db, `users/${userId}/notes`), {
            title: titleToSave,
            content: contentToSave,
            createdAt: new Date(),
          });

          // Save new note locally
          await AsyncStorage.setItem(
            `note_${docRef.id}`,
            JSON.stringify({ title: titleToSave, content: contentToSave })
          );

          ToastAndroid.show("Note added successfully", ToastAndroid.SHORT);
          router.push("../(tabs)/notestab");
        }
      } else {
        console.error("No user is authenticated");
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }, [noteId, noteTitle, richText, router]);

  const handleDeleteNote = useCallback(async () => {
    if (noteId) {
      try {
        const userId = auth.currentUser?.uid; // Get the authenticated user ID
        if (userId) {
          await deleteDoc(doc(db, `users/${userId}/notes`, noteId));
          await AsyncStorage.removeItem(`note_${noteId}`);
          ToastAndroid.show("Note deleted successfully", ToastAndroid.SHORT);
          router.push("../(tabs)/notestab");
        } else {
          console.error("No user is authenticated");
        }
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  }, [noteId, router]);

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color={Colors.dark.text}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={24}
              color={Colors.dark.text}
            />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveNote}
            >
              <Ionicons
                name="save-outline"
                size={24}
                color={Colors.dark.text}
              />
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
            placeholderTextColor={Colors.dark.icon}
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
            ]}
            style={styles.toolbar}
          />
        </View>
        <Text style={styles.date}>{notecreatedat}</Text>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={{
            minHeight: scrollViewHeight,
            paddingBottom: 200,
          }}
          showsVerticalScrollIndicator={false}
        >
          <RichEditor
            ref={richText}
            initialContentHTML={noteContent}
            editorStyle={styles.richEditor}
            style={styles.richEditor}
            onBlur={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
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
    color: Colors.dark.text,
  },
  toolbar: {
    backgroundColor: "transparent",
    color: Colors.dark.text,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: Colors.dark.content_text,
    marginBottom: 10,
    marginLeft: 10,
  },
  richEditor: {
    minHeight: 600,
    backgroundColor: "transparent",
    color: Colors.dark.content_text,
  },
});
