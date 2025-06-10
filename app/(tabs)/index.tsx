import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Array<{ id: string; text: string; completed: boolean; notificationId: string; priority: 'high' | 'medium' | 'low' }>>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const[priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const saved = await AsyncStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  };

  const saveTasks = async (updatedTasks: Array<{ id: string; text: string; completed: boolean; notificationId: string }>) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const scheduleNotification = async (taskText: string) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Task Reminder',
        body: `Time to complete: ${taskText}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10, 
      },
    });
    return id;
  };

  const handleAddTask = async () => {
    if (!task.trim()) return Alert.alert( 'Task cannot be empty');

    const notificationId = await scheduleNotification(task);
    const newTask = {
      id: Date.now().toString(),
      text: task,
      completed: false,
      notificationId,
      priority: priority,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setTask('');
  };

  const arrangeTask = async (id: string) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    const completedTask = updatedTasks.find(t => t.id === id);
    if (completedTask && completedTask.completed) {
      Notifications.cancelScheduledNotificationAsync(completedTask.notificationId);
    }
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    const deletedTask = tasks.find((t) => t.id === id);
    if (deletedTask?.notificationId) {
      Notifications.cancelScheduledNotificationAsync(deletedTask.notificationId);
    }
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const editTask = (id: string) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (taskToEdit) {
      setEditingTaskId(id);
      setEditedText(taskToEdit.text);
    }
  };

  const saveEditTask = async () => {
    if (!editedText.trim()) return Alert.alert('Task cannot be empty');

    const updatedTasks = tasks.map((t) =>
      t.id === editingTaskId ? { ...t, text: editedText } : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditingTaskId(null);
    setEditedText('');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditedText('');
  };

  const renderItem = ({ item }: { item: { id: string; text: string; completed: boolean; notificationId: string; priority: 'high' | 'medium' | 'low' } }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskcheck}>
        <TouchableOpacity onPress={() => arrangeTask(item.id)}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={item.completed ? 'green' : 'gray'}
            style={styles.checkIcon}
          />
        </TouchableOpacity>

        {editingTaskId === item.id ? (
          <>
            <TextInput
              value={editedText}
              onChangeText={setEditedText}
              style={[styles.input, { flex: 1, marginRight: 10 }]}
            />
            <TouchableOpacity onPress={saveEditTask}>
              <Ionicons name="checkmark-sharp" size={24} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEdit}>
              <Ionicons name="close" size={24} color="red" />
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.taskText, item.completed && styles.completedTask]}>
            {item.text}
          </Text>
          
        )}
        <Text style={{ fontSize: 12, color: 'gray' ,padding:20}}>Priority: {item.priority}</Text>

      </View>

      {editingTaskId !== item.id && (
        <>
          <TouchableOpacity onPress={() => editTask(item.id)}>
            <Ionicons name="create-sharp" size={24} color="grey" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Task</Text>
      <TextInput
        value={task}
        onChangeText={setTask}
        placeholder="Enter your task"
        style={styles.input}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
  {['high', 'medium', 'low'].map((p) => (
    <TouchableOpacity
      key={p}
      onPress={() => setPriority(p as 'high' | 'medium' | 'low')}
      style={{
        backgroundColor: priority === p ? '#4CAF50' : '#ddd',
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: priority === p ? 'white' : 'black' }}>{p}</Text>
    </TouchableOpacity>
  ))}
</View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskcheck: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkIcon: {
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    marginVertical: 5,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
