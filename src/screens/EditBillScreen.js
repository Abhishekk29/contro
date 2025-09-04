import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditBillScreen({ navigation, route }) {
  const { billId } = route.params;
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadBill = async () => {
      try {
        const storedBills = await AsyncStorage.getItem('bills');
        if (storedBills) {
          const bills = JSON.parse(storedBills);
          const billToEdit = bills.find(bill => bill.id === billId);
          if (billToEdit) {
            setName(billToEdit.name);
            setAmount(billToEdit.amount.toString());
            setDueDate(new Date(billToEdit.dueDate));
          }
        }
      } catch (error) {
        console.error('Error loading bill:', error);
      }
    };
    loadBill();
  }, [billId]);

  const handleUpdateBill = async () => {
    try {
      const storedBills = await AsyncStorage.getItem('bills');
      if (storedBills) {
        let bills = JSON.parse(storedBills);
        bills = bills.map(bill =>
          bill.id === billId
            ? { ...bill, name, amount: parseFloat(amount), dueDate: dueDate.toISOString() }
            : bill
        );
        await AsyncStorage.setItem('bills', JSON.stringify(bills));
      }

      setSnackbarMessage('✅ Bill updated successfully');
      setSnackbarVisible(true);

      setTimeout(() => {
        setSnackbarVisible(false);
        navigation.goBack(); // go back to Home
      }, 1500);
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.label}>Bill Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter bill name"
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
          />

          <Text style={styles.label}>
            Due Date: {dueDate.toDateString()}
          </Text>
          <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <View style={styles.updateButton}>
            <Button title="Update Bill" onPress={handleUpdateBill} />
          </View>

          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={1500}
            style={styles.snackbar}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginTop: 5 },
  updateButton: { marginTop: 20 },
  snackbar: { backgroundColor: '#333', position: 'absolute', top: 50, left: 0, right: 0 },
});
