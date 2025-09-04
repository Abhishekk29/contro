// screens/AddFriend.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFriends, saveFriends } from '../storage';

export default function AddFriend({ navigation }) {
  const [friendId, setFriendId] = useState('');

  const handleAddFriend = async () => {
    if (!friendId.trim()) {
      Alert.alert("Error", "Please enter a valid ID");
      return;
    }
    const existing = await getFriends();
    if (existing.find(f => f.id === friendId)) {
      Alert.alert("Error", "Friend already added!");
      return;
    }
    const newFriend = { id: friendId };
    const updated = [...existing, newFriend];
    await saveFriends(updated);
    Alert.alert("Success", "Friend added!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Friend's ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Friend ID"
        value={friendId}
        onChangeText={setFriendId}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddFriend}>
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 20 },
  button: { backgroundColor: '#6200EE', padding: 12, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
