import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BillsContext } from '../context/BillsContext';

export default function AddBillScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { addBill, updateBill } = useContext(BillsContext);

  const billToEdit = route.params?.bill;

  const [title, setTitle] = useState(billToEdit?.title || '');
  const [amount, setAmount] = useState(billToEdit?.amount || '');
  const [date, setDate] = useState(billToEdit?.date ? new Date(billToEdit.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (billToEdit) setDate(new Date(billToEdit.date));
  }, [billToEdit]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const saveBill = () => {
    if (!title || !amount) {
      alert('Please fill all fields');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];

    const billData = {
      id: billToEdit?.id || Date.now().toString(),
      title,
      amount,
      date: formattedDate,
    };

    if (billToEdit) {
      updateBill(billData);
      setSnackbarMessage('Bill updated successfully!');
    } else {
      addBill(billData);
      setSnackbarMessage('Bill added successfully!');
    }

    setSnackbarVisible(true);

    setTimeout(() => {
      setSnackbarVisible(false);
      navigation.navigate('Home'); // redirect to Home
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{billToEdit ? 'Edit Bill' : 'Add New Bill'}</Text>

        <TextInput
          label="Bill Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Amount (₹)"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          keyboardType="numeric"
          mode="outlined"
        />

        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
        >
          {`Select Due Date: ${date.toISOString().split('T')[0]}`}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}

        <Button
          mode="contained"
          onPress={saveBill}
          style={styles.saveButton}
        >
          {billToEdit ? 'Update Bill' : 'Save Bill'}
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={1200}
          style={{ bottom: Platform.OS === 'ios' ? 120 : 80 }} // move it above keyboard
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 20,
    borderColor: '#6200EE',
  },
  saveButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 6,
  },
});
