// screens/FriendsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFriends } from '../storage';

export default function FriendsScreen() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const loadFriends = async () => {
      const data = await getFriends();
      setFriends(data);
    };
    loadFriends();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Friends</Text>
      {friends.length === 0 ? (
        <Text style={styles.empty}>No friends added yet.</Text>
      ) : (
        friends.map(friend => (
          <Text key={friend.id} style={styles.friendItem}>
            👤 {friend.id}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  empty: { color: '#666', fontSize: 16 },
  friendItem: { fontSize: 16, marginVertical: 5 },
});
