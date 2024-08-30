import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  FlatList,
  Vibration,
} from "react-native";
import { auth, db } from "../../configs/FirebaseConfigs";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/screenwrapper";
import { Colors } from "../../constants/Colors";
import { generateSuggestions } from "../../configs/GeminiAPI";
import { useNotes } from "../../context/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Markdown from "react-native-markdown-display";
import { BlurView } from "expo-blur";
import RenderHtml from "react-native-render-html";
import { collection, getDocs } from "firebase/firestore";

const SUGGESTIONS_KEY = "suggestions";
const TIMESTAMP_KEY = "suggestions_timestamp";
const TIME_LIMIT = 1000 * 60 * 60; // 1 hour

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(true);
  const { notes, fetchNotes } = useNotes();
  const user = auth.currentUser;
  const vibrationPattern = 100; // Duration in milliseconds
  const userId = auth.currentUser?.uid; // Get the currently logged-in user's ID

  useEffect(() => {
    const fetchTodos = async () => {
      if (!userId) return;

      try {
        // Fetch from AsyncStorage
        const storedTodos = await AsyncStorage.getItem(`todos_${userId}`);
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Error loading todos from local storage: ", error);
      }

      // Fetch from Firestore
      try {
        const querySnapshot = await getDocs(
          collection(db, `users/${userId}/todos`)
        );
        const todosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosList);
      } catch (error) {
        console.error("Error loading todos from Firestore: ", error);
      }
    };

    fetchTodos();
  }, [userId]);

  useEffect(() => {
    fetchNotes();
    console.log(notes);
  }, [router]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const storedTimestamp = await AsyncStorage.getItem(TIMESTAMP_KEY);
      const now = Date.now();

      if (storedTimestamp && now - parseInt(storedTimestamp) < TIME_LIMIT) {
        const storedSuggestions = await AsyncStorage.getItem(SUGGESTIONS_KEY);
        if (storedSuggestions) {
          setSuggestions(storedSuggestions);
          setLoading(false);
          return;
        }
      }

      if (todos.length > 0) {
        setLoading(true);
        try {
          const generatedSuggestions = await generateSuggestions(todos);
          setSuggestions(generatedSuggestions);
          await AsyncStorage.setItem(SUGGESTIONS_KEY, generatedSuggestions);
          await AsyncStorage.setItem(TIMESTAMP_KEY, now.toString());
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
          setSuggestions("Failed to fetch suggestions.");
        } finally {
          setLoading(false);
        }
      }

      setLoading(false);
    };

    fetchSuggestions();
  }, [todos]);

  const favoriteNotes = notes.filter((note) => note.isFavorite);

  const contentWidth = Dimensions.get("window").width;

  const noteStyles = useMemo(
    () => ({
      body: {
        color: Colors.dark.content_text,
        fontSize: 14,
        fontFamily: "outfit-Regular",
        borderBottomColor: Colors.dark.text,
        height: Dimensions.get("window").width / 2 - 95,
        overflow: "hidden",
        alignContent: "center",
      },
      ol: {
        listStyleType: "none",
        padding: 10,
        paddingTop: 0,
      },
      ul: {
        padding: 10,
        paddingTop: 0,
      },
    }),
    [contentWidth]
  );
  console.log(suggestions);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <TouchableOpacity
            style={styles.profileImage}
            onPress={() => router.push("/Profile/profile")}
          >
            <Ionicons
              name="settings-outline"
              size={30}
              color={Colors.dark.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.list}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.dark.text} />
          ) : (
            <View>
              <BlurView intensity={20} style={styles.suggestionsContainer}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.suggestions}
                >
                  <Markdown style={markdownStyles}>{suggestions}</Markdown>
                </ScrollView>
              </BlurView>

              <Text style={styles.favoritesText}>Favorites</Text>
              {favoriteNotes.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={favoriteNotes}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        Vibration.vibrate(vibrationPattern);
                        router.push(`../notes/NotesRender?noteId=${item.id}`);
                      }}
                    >
                      <BlurView intensity={20} style={[styles.cardContainer]}>
                        <Text style={styles.noteTitle}>{item.title}</Text>
                        <RenderHtml
                          tagsStyles={noteStyles}
                          contentWidth={contentWidth}
                          allowFontScaling={false}
                          source={{ html: item.content }}
                        />
                        {item.isFavorite && (
                          <Ionicons
                            name="heart"
                            size={15}
                            color={Colors.Themecolor}
                            style={styles.heartIcon}
                          />
                        )}
                      </BlurView>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                  style={styles.list}
                  numColumns={2}
                />
              ) : (
                <Text>No favorite notes available.</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  suggestions: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    // paddingBottom: 80,
  },
  title: {
    fontSize: 50,
    marginBottom: 10,
    fontFamily: "outfit-Bold",
    color: Colors.dark.text,
  },
  profileImage: {
    width: 30,
    height: 30,
  },
  list: {
    marginTop: 10,
  },
  favoritesText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginTop: 10,
  },
  suggestionsContainer: {
    padding: 10,
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: Dimensions.get("window").height / 2 - 20,
  },
  cardContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 20,
    width: Dimensions.get("window").width / 2 - 20,
    height: Dimensions.get("window").width / 2 - 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    padding: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 5,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  markdown: {
    body: {
      color: Colors.dark.content_text,
      fontSize: 14,
      fontFamily: "outfit-Regular",
      borderBottomColor: Colors.dark.text,
      height: Dimensions.get("window").width / 2 - 95,
      overflow: "hidden",
      alignContent: "center",
    },
  },
});
const markdownStyles = {
  body: {
    color: Colors.dark.content_text,
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  heading2: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  heading3: {
    color: Colors.dark.content_text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  list_item: {
    marginVertical: 4,
  },
};
