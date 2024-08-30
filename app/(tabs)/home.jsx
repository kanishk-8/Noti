import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
  Vibration,
} from "react-native";
import { auth } from "../../configs/FirebaseConfigs"; // Removed 'db' as it's not used in this snippet
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/screenwrapper";
import { Colors } from "../../constants/Colors";
import { generateNotes } from "../../configs/GeminiAPI";
import { useNotes } from "../../context/context";
import Clipboard from "expo-clipboard"; // Corrected import
import Markdown from "react-native-markdown-display";
import { BlurView } from "expo-blur";
import RenderHtml from "react-native-render-html";

export default function Home() {
  const [todos, setTodos] = useState([]); // todos is declared but not used in this code snippet
  const [toGenerateAi, setToGenerateAi] = useState("");
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [loading, setLoading] = useState(false); // Initial loading should be false
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const { notes, fetchNotes } = useNotes();
  const userId = auth.currentUser?.uid;
  const vibrationPattern = 100; // Duration in milliseconds

  const copyToClipboard = () => {
    Clipboard.setStringAsync(generatedNotes);
    Vibration.vibrate(50); // Provide feedback when text is copied
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
        router.replace("/auth/SignIn");
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const handlesubmit = async () => {
    if (!toGenerateAi.trim()) return; // Prevent submitting empty input

    try {
      setLoading(true);
      const AInotes = await generateNotes(toGenerateAi);
      setGeneratedNotes(AInotes);
      setToGenerateAi(""); // Clear input after generating notes
      Vibration.vibrate(vibrationPattern);
    } catch (error) {
      console.error("Error generating notes:", error);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

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
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <TouchableOpacity
            style={styles.profileImage}
            onPress={() => router.push("/Profile/Account")}
          >
            <Ionicons
              name="person-circle-sharp"
              size={30}
              color={Colors.dark.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.suggestionsWrapper}>
          <BlurView intensity={20} style={styles.suggestionsContainer}>
            {generatedNotes && (
              <View>
                <View style={styles.generatedtopbar}>
                  <TouchableOpacity onPress={() => setGeneratedNotes("")}>
                    <Ionicons
                      name="close-outline"
                      size={20}
                      color={Colors.dark.text}
                      style={styles.closeIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={copyToClipboard}
                    style={styles.copyButton}
                  >
                    <Ionicons
                      name="copy-outline"
                      size={20}
                      color={Colors.dark.text}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.suggestions}
                >
                  <Markdown style={markdownStyles}>{generatedNotes}</Markdown>
                </ScrollView>
              </View>
            )}
            <View style={styles.searchContainer}>
              {loading ? (
                <ActivityIndicator
                  style={styles.loading}
                  size="small"
                  color="white"
                />
              ) : (
                <TextInput
                  placeholder="Ask Noti any question"
                  placeholderTextColor={Colors.dark.text}
                  style={styles.searchInput}
                  onChangeText={(value) => setToGenerateAi(value)}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  Vibration.vibrate(50);
                  setLoading(true);
                  handlesubmit(toGenerateAi);
                }}
              >
                <Ionicons name="send" size={20} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
        <Text style={styles.favoritesText}>Favorites</Text>
        {favoriteNotes.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={favoriteNotes}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  Vibration.vibrate(vibrationPattern);
                  router.push({
                    pathname: "../notes/NotesRender",
                    params: { noteId: item.id },
                  });
                }}
              >
                <BlurView intensity={20} style={styles.cardContainer}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <RenderHtml
                    tagsStyles={noteStyles}
                    contentWidth={contentWidth}
                    allowFontScaling={false}
                    source={{ html: item.content }}
                  />
                  <Text style={styles.date}>
                    {item.updatedAt
                      ? new Date(item.updatedAt.seconds * 1000).toLocaleString()
                      : "No date"}
                  </Text>
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60, // Adjusted to ensure it doesn't overlap with the tab bar
    // overflow: "hidden",
  },
  generatedtopbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: 10,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  copyText: {
    color: Colors.dark.text,
    marginLeft: 5,
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    // position: "absolute",
    // top: 20,
    // right: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  suggestionsWrapper: {
    // flex: 1,
    marginTop: 10,
  },
  searchInput: {
    width: "80%",
    fontSize: 16,
    color: Colors.dark.text,
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
    paddingBottom: 200,
  },
  title: {
    fontSize: 50,
    marginBottom: 10,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  profileImage: {
    width: 30,
    height: 30,
  },
  list: {
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 80, // Adds extra space to prevent overlap with the tab bar
  },
  favoritesText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginTop: 10,
    marginLeft: 10,
  },
  suggestionsContainer: {
    padding: 10,
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: Dimensions.get("window").height / 2 - 150,
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
  date: {
    fontSize: 12,
    color: Colors.dark.content_text,
    marginTop: 7,
    marginLeft: 2,
  },
});

const markdownStyles = {
  body: {
    color: Colors.dark.content_text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
    userSelect: "text",
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
