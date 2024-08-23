import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { db } from "../../configs/FirebaseConfigs";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";
import RenderHtml from "react-native-render-html";
import {
  LongPressGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ScreenWrapper from "../../components/screenwrapper";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch notes from Firestore
  const fetchNotes = useCallback(async () => {
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
  }, []);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Handle long press
  const handleLongPress = (id) => {
    Alert.alert("Options", "Choose an option", [
      {
        text: "Delete",
        onPress: () => deleteNote(id),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Set content width for RenderHtml
  const contentWidth = Dimensions.get("window").width;

  return (
    <ScreenWrapper>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <>
              <Text style={styles.title}>Notes</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={notes}
                renderItem={({ item }) => (
                  <LongPressGestureHandler
                    onHandlerStateChange={({ nativeEvent }) => {
                      if (nativeEvent.state === State.ACTIVE) {
                        handleLongPress(item.id);
                      }
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        router.push(`../notes/NotesRender?noteId=${item.id}`)
                      }
                    >
                      <View style={styles.cardContainer}>
                        <Text style={styles.noteTitle}>{item.title}</Text>
                        <RenderHtml
                          contentWidth={contentWidth}
                          allowFontScaling={false}
                          source={{ html: item.content }}
                          contentStyle={{ color: "#333", fontSize: 14 }}
                        />
                      </View>
                    </TouchableOpacity>
                  </LongPressGestureHandler>
                )}
                keyExtractor={(item) => item.id}
                style={styles.list}
                numColumns={2}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("../notes/NotesRender")}
              >
                <Ionicons name="add-circle-sharp" size={60} color="#b53740" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </GestureHandlerRootView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 60,
  },
  title: {
    fontSize: 50,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    fontFamily: "outfit-Bold",
  },
  cardContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: Dimensions.get("window").width / 2 - 20,
    height: Dimensions.get("window").width / 2 - 20,
    overflow: "hidden",
    padding: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontFamily: "outfit-Bold",
    marginBottom: 5,
  },
  list: {
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 18,
    right: 30,
  },
});
