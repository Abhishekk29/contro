import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BillDetailsScreen from '../screens/BillDetailsScreen';
import AddBillScreen from '../screens/AddBillScreen';
import FriendsScreen from '../screens/FriendsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BillDetails" component={BillDetailsScreen} options={{ title: 'Bill Details' }} />
        <Stack.Screen name="AddBill" component={AddBillScreen} options={{ title: 'Add Bill' }} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
