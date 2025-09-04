import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';

export default function SignupScreen({ navigation }) {
  const { addUser, setCurrentUser, users } = useContext(UserContext);
  const [name, setName] = useState('');

  const handleSignup = () => {
    if (!name) return;

    // Create unique ID
    const id = Date.now().toString();
    const newUser = { id, name, friends: [] };

    addUser(newUser);
    setCurrentUser(newUser);

    // Go to main app
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your name to sign up:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  label: { fontWeight:'bold', marginBottom:10 },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:5, padding:8, marginBottom:20 }
});
