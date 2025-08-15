import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BillsContext } from '../context/BillsContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { bills } = useContext(BillsContext);

  const renderBill = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('BillDetails', { bill: item })}
    >
      <Card.Title
        title={item.title}
        subtitle={`Due: ${item.date}`}
      />
      <Card.Content>
        <Text style={styles.amount}>₹ {item.amount}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Bills</Text>
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={renderBill}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Bill"
        onPress={() => navigation.navigate('AddBill')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 20,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200EE',
  },
});
