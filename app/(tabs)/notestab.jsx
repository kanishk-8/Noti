import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  BackHandler,
  Alert,
  Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import ScreenWrapper from "../../components/screenwrapper";
import { BlurView } from "expo-blur";
import { Colors } from "../../constants/Colors";
import CustomModal from "../../components/modal";
import { useRouter } from "expo-router";
import { useNotes } from "../../context/context";

export default function Notes() {
  const { notes, loading, deleteNote, toggleFavorite, fetchNotes } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalConfirmAction, setModalConfirmAction] = useState(null);
  const router = useRouter();
  const vibrationPattern = 100; // Duration in milliseconds

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

  const handleBackPress = useCallback(() => {
    if (selectedNoteId) {
      setSelectedNoteId(null); // Deselect the note
      return true; // Prevent default back behavior
    }
    return false; // Allow default back behavior
  }, [selectedNoteId]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [handleBackPress]);

  const showConfirmationModal = (message, confirmAction) => {
    setModalMessage(message);
    setModalConfirmAction(() => confirmAction);
    setModalVisible(true);
  };

  const handleDeletePress = () => {
    if (selectedNoteId) {
      showConfirmationModal("Are you sure you want to delete this note?", () =>
        deleteNote(selectedNoteId)
      );
    }
  };

  const handleModalConfirm = () => {
    if (modalConfirmAction) {
      modalConfirmAction();
      Vibration.vibrate(vibrationPattern);
      setSelectedNoteId(null);
      setModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setSelectedNoteId(null);
    setModalVisible(false);
  };
  const favoriteNotes = notes.filter((note) => note.isFavorite);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="white"
          />
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Notes</Text>

              {selectedNoteId ? (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={handleDeletePress}
                  >
                    <Ionicons name="trash-outline" size={30} color="#b53740" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => toggleFavorite(selectedNoteId)}
                  >
                    <Ionicons
                      name={
                        notes.find((note) => note.id === selectedNoteId)
                          ?.isFavorite
                          ? "heart"
                          : "heart-outline"
                      }
                      size={30}
                      color="#b53740"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleModalCancel}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={30}
                      color={Colors.dark.content_text}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.headerRight}>
                  <TouchableOpacity
                    style={styles.profileImage}
                    onPress={fetchNotes}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={30}
                      color={Colors.dark.text}
                    />
                  </TouchableOpacity>
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
              )}
            </View>
            {notes.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={notes}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleModalCancel();
                      Vibration.vibrate(vibrationPattern);
                      router.push(`../notes/NotesRender?noteId=${item.id}`);
                    }}
                    onLongPress={() => {
                      setSelectedNoteId(item.id), (selectedNote = item);
                      Vibration.vibrate(vibrationPattern);
                    }}
                  >
                    <BlurView
                      intensity={20}
                      style={[
                        styles.cardContainer,
                        selectedNoteId === item.id && styles.selectedCard,
                      ]}
                    >
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
              !loading && (
                <View style={styles.noNotesContainer}>
                  <Text style={styles.noNotesText}>No notes available</Text>
                </View>
              )
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                Vibration.vibrate(vibrationPattern);
                router.push("../notes/NotesRender");
              }}
            >
              <Ionicons name="add-circle-sharp" size={70} color="#b53740" />
            </TouchableOpacity>
          </>
        )}
        <CustomModal
          visible={modalVisible}
          onConfirm={handleModalConfirm}
          onClose={handleModalCancel}
          message={modalMessage}
        />
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 50,
    marginBottom: 10,
    fontFamily: "outfit-Bold",
    color: Colors.dark.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    marginLeft: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  optionButton: {
    padding: 10,
  },
  cancelButton: {
    paddingLeft: 10,
    paddingTop: 10,
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
  selectedCard: {
    borderWidth: 2,
    borderColor: "#b53740",
  },
  noteTitle: {
    fontSize: 25,
    fontFamily: "outfit-Bold",
    marginBottom: 5,
    color: Colors.dark.text,
  },
  list: {
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 18,
    right: 10,
  },
});
