import React, { useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BillsContext } from '../context/BillsContext';

export default function BillDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bill } = route.params;
  const { deleteBill } = useContext(BillsContext);

  const handleDelete = () => {
    Alert.alert('Delete Bill', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteBill(bill.id); navigation.goBack(); } },
    ]);
  };

  const handleEdit = () => navigation.navigate('AddBill', { bill });

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={bill.title}
          subtitle={`Due: ${bill.date}`}
        />
        <Card.Content>
          <Text style={styles.amount}>{bill.amount}</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleEdit}
          style={[styles.button, { backgroundColor: '#6200EE' }]}
        >
          Edit
        </Button>
        <Button
          mode="contained"
          onPress={handleDelete}
          style={[styles.button, { backgroundColor: '#B00020' }]}
        >
          Delete
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  card: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    paddingVertical: 6,
  },
});
