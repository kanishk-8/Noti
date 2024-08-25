// NotesContext.js
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../configs/FirebaseConfigs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const notesCollection = collection(db, `users/${userId}/notes`);
        const noteSnapshot = await getDocs(notesCollection);
        const notesList = noteSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        await AsyncStorage.setItem("notes", JSON.stringify(notesList));
        setNotes(notesList);
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
      console.log(notes);
    }
  }, []);

  const loadNotesFromLocalStorage = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        fetchNotes();
      }
    } catch (error) {
      console.error("Error loading notes from local storage:", error);
      fetchNotes(); // Fallback to fetching from Firestore
    }
  };

  const deleteNote = async (id) => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const noteDoc = doc(db, `users/${userId}/notes`, id);
        await deleteDoc(noteDoc);

        const updatedNotes = notes.filter((note) => note.id !== id);
        await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const noteDoc = doc(db, `users/${userId}/notes`, id);
        const note = notes.find((note) => note.id === id);
        const newFavoriteStatus = !note.isFavorite;

        await updateDoc(noteDoc, { isFavorite: newFavoriteStatus });

        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, isFavorite: newFavoriteStatus } : note
        );
        await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  useEffect(() => {
    loadNotesFromLocalStorage();
  }, [fetchNotes]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        fetchNotes,
        deleteNote,
        toggleFavorite,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
