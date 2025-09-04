import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import { getBills, saveBills } from '../storage';
import { UserContext } from '../context/UserContext';
import * as Clipboard from 'expo-clipboard';

export default function HomeScreen({ navigation }) {
  const { currentUser } = useContext(UserContext);
  const [bills, setBills] = useState([]);

  const loadBills = async () => {
    const data = await getBills();
    setBills(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBills);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    const filtered = bills.filter(b => b.id !== id);
    setBills(filtered);
    await saveBills(filtered);
  };

  const copyToClipboard = async (id) => {
    await Clipboard.setStringAsync(id);
    if (Platform.OS === 'android') {
      ToastAndroid.show('ID copied!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied!', 'ID copied to clipboard');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.billContainer}
      onPress={() => navigation.navigate('EditBill', { billId: item.id })}
    >
      <Text style={styles.billName}>{item.name}</Text>
      <Text style={styles.billAmount}>₹ {item.amount}</Text>
      <Text style={styles.billDue}>
        Due: {new Date(item.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Welcome + User ID */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>Welcome, {currentUser.name}!</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', marginRight: 10 }}>
            Your ID: {currentUser.id}
          </Text>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => copyToClipboard(currentUser.id)}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.navigate('AddFriend')}
          >
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.navigate('AddBill')}
          >
            <Text style={styles.buttonText}>Add Bill</Text>
          </TouchableOpacity>

          {/* My Friends Button */}
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => navigation.navigate('FriendsScreen')}
        >
          <Text style={styles.buttonText}>My Friends</Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Bills List */}
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  welcomeContainer: { padding: 20, backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderColor: '#ccc' },
  welcome: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  topButton: { backgroundColor: '#6200EE', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center' },
  copyButton: { backgroundColor: '#6200EE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  billContainer: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 10 },
  billName: { fontWeight: 'bold', fontSize: 16 },
  billAmount: { fontSize: 14, marginTop: 3 },
  billDue: { fontSize: 12, marginTop: 2, color: '#555' },
  deleteText: { color: 'red', marginTop: 5 },
});
