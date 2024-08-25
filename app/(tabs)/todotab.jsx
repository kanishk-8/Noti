import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../components/screenwrapper";
import { Colors } from "../../constants/Colors";
import { BlurView } from "expo-blur";
import AddTodoModal from "../../components/addtodo";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../configs/FirebaseConfigs";

const TODO_ITEM_HEIGHT = 60; // Assuming each todo item has a fixed height

function MyCheckbox({ todo, onDelete }) {
  const [checked, setChecked] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0]; // Animation value
  const textAnim = useState(new Animated.Value(1))[0]; // Text opacity for cut effect

  const handlePress = () => {
    if (!checked) {
      // Start the slide and cut animation
      Animated.timing(slideAnim, {
        toValue: -500, // Adjust the value as needed for sliding out
        duration: 1000, // Increased duration for slower animation
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start(() => onDelete(todo.id)); // Delete after animation

      Animated.timing(textAnim, {
        toValue: 0,
        duration: 1000, // Increased duration for slower animation
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    }
    setChecked(!checked);
  };

  return (
    <Animated.View
      style={[
        styles.checkboxContainer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <Pressable
        style={[styles.checkboxBase, checked && styles.checkboxChecked]}
        onPress={handlePress}
      >
        {checked && <Ionicons name="checkmark" size={14} color="white" />}
      </Pressable>
      <Animated.Text
        style={[
          styles.checkboxLabel,
          {
            textDecorationLine: checked ? "line-through" : "none",
            opacity: textAnim,
          },
        ]}
      >
        {todo.task}
      </Animated.Text>
    </Animated.View>
  );
}

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const userId = auth.currentUser?.uid; // Get the currently logged-in user's ID

  const blurHeight = useRef(
    new Animated.Value(Dimensions.get("window").height) // Start with screen height
  ).current;

  useEffect(() => {
    const loadTodos = async () => {
      if (!userId) return; // Ensure the user is authenticated

      try {
        // Load todos from local storage
        const storedTodos = await AsyncStorage.getItem(`todos_${userId}`);
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Error loading todos from local storage: ", error);
      }

      try {
        // Load todos from Firestore
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

    loadTodos();
  }, [userId]);

  useEffect(() => {
    const saveTodos = async () => {
      if (!userId) return; // Ensure the user is authenticated

      try {
        await AsyncStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
      } catch (error) {
        console.error("Error saving todos to local storage: ", error);
      }
    };

    saveTodos();
  }, [todos, userId]);

  const handleDelete = async (id) => {
    if (!userId) return; // Ensure the user is authenticated

    try {
      // Delete todo from Firestore
      await deleteDoc(doc(db, `users/${userId}/todos`, id));
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo from Firestore: ", error);
    }
  };

  const handleAddTodo = async (newTodo) => {
    if (!userId) return; // Ensure the user is authenticated

    try {
      // Add new todo to Firestore
      const docRef = await addDoc(collection(db, `users/${userId}/todos`), {
        task: newTodo,
      });
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: docRef.id, task: newTodo }, // Use Firestore document ID
      ]);
    } catch (error) {
      console.error("Error adding todo to Firestore: ", error);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tasks</Text>
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

        {todos.length > 0 ? (
          <View style={styles.todoscontainer}>
            <BlurView intensity={20} style={styles.todos}>
              <Text style={styles.todosTitle}>List of Tasks</Text>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {todos.map((todo) => (
                  <MyCheckbox
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDelete}
                  />
                ))}
              </ScrollView>
            </BlurView>
          </View>
        ) : (
          <Text style={styles.noTodosText}>No todos</Text>
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-sharp" size={70} color="#b53740" />
        </TouchableOpacity>

        <AddTodoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddTodo={handleAddTodo}
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
  header: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxBase: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.dark.content_text,
    backgroundColor: "transparent",
    margin: 10,
    marginLeft: 30,
  },
  checkboxChecked: {
    backgroundColor: "coral",
  },
  title: {
    fontSize: 50,
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: "outfit-Bold",
    color: Colors.dark.text,
  },
  profileImage: {
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    width: Dimensions.get("window").width - 120,
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 18,
    color: Colors.dark.content_text,
  },
  todosTitle: {
    fontSize: 30,
    color: Colors.dark.text,
    fontFamily: "outfitSemiBold",
    marginLeft: 20,
    marginTop: 15,
    margin: 10,
  },
  todoscontainer: {
    flex: 1,
    padding: 10,
  },
  todos: {
    color: Colors.dark.text,
    maxHeight: Dimensions.get("window").height - 200,
    width: Dimensions.get("window").width - 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  noTodosText: {
    fontSize: 24,
    color: Colors.dark.text,
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 18,
    right: 10,
  },
});
