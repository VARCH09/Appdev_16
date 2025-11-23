import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// --- MAIN COMPONENT ---
const App = () => {
  // State for the list of tasks (just simple strings)
  const [tasks, setTasks] = useState(['Buy Milk', 'Walk Dog', 'Code App']);
  
  // State for the text input field
  const [newTaskText, setNewTaskText] = useState('');

  // 1. Adds a new task
  const handleAddTask = () => {
    if (newTaskText.trim().length > 0) {
      setTasks([...tasks, newTaskText.trim()]);
      setNewTaskText('');
    }
  };

  // 2. Removes a task based on its index
  const handleDeleteTask = (indexToRemove: number) => {
    // Create a new array excluding the task at the given index
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>MINIMAL TO-DO</Text>

      {/* Input Area */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="New Task"
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <View style={styles.list}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={styles.taskText}>{task}</Text>
            <TouchableOpacity onPress={() => handleDeleteTask(index)}>
              <Text style={styles.deleteButton}>[X]</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Space from the top of the screen
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    // Basic container for the list items
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;