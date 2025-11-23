import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

// Enable Promise support (optional)
SQLite.enablePromise(true);

// Declare db, but don't assign yet
let db: SQLite.SQLiteDatabase;

// Open database and assign inside success callback
SQLite.openDatabase(
  { name: 'todo.db', location: 'default' },
  (database) => {
    console.log('✅ Database opened');
    db = database; // ✅ Assign the actual db instance
  },
  (error) => {
    console.log('❌ Error opening DB:', error);
  }
);

// Define Task type
interface Task {
  id: number;
  text: string;
}

const App = () => {
  // State for tasks (now with id)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  // Initialize DB and load tasks
  useEffect(() => {
    // Create table
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL);',
        [],
        () => console.log('✅ Table created'),
        (_, error) => {
          console.log('❌ Table creation error:', error);
          return false;
        }
      );
    });

    // Load existing tasks
    loadTasks();
  }, []);

  const loadTasks = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tasks;',
        [],
        (_, resultSet) => {
          const loadedTasks: Task[] = [];
          for (let i = 0; i < resultSet.rows.length; i++) {
            loadedTasks.push(resultSet.rows.item(i) as Task);
          }
          setTasks(loadedTasks);
        },
        (_, error) => {
          console.log('❌ Failed to load tasks:', error);
          return false;
        }
      );
    });
  };

  const handleAddTask = () => {
    const text = newTaskText.trim();
    if (text.length === 0) return;

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO tasks (text) VALUES (?);',
        [text],
        (_, result) => {
          // Optionally: add to state immediately using result.insertId
          // But safer to reload for consistency
          loadTasks();
          setNewTaskText('');
        },
        (_, error) => {
          console.log('❌ Insert error:', error);
          Alert.alert('Error', 'Failed to add task');
          return false;
        }
      );
    });
  };

  const handleDeleteTask = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM tasks WHERE id = ?;',
        [id],
        () => {
          loadTasks(); // Refresh list
        },
        (_, error) => {
          console.log('❌ Delete error:', error);
          Alert.alert('Error', 'Failed to delete task');
          return false;
        }
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>MINIMAL TO-DO</Text>

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

      <View style={styles.list}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Text style={styles.taskText}>{task.text}</Text>
            <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
              <Text style={styles.deleteButton}>[X]</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
  list: {},
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