import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { BillsContext } from '../context/BillsContext';

export default function HomeScreen({ navigation }) {
  const { bills } = useContext(BillsContext);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {bills.length === 0 ? (
        <Text>No bills yet. Add one!</Text>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('Bill Details', { bill: item })}>
              <Text style={{ fontSize: 18, marginVertical: 8 }}>{item.title} - ₹{item.amount}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
