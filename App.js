import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BillsProvider } from './src/context/BillsContext';

import HomeScreen from './src/screens/HomeScreen';
import AddBillScreen from './src/screens/AddBillScreen';
import BillDetailsScreen from './src/screens/BillDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BillsProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#6200EE' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddBill" component={AddBillScreen} />
          <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BillsProvider>
  );
}
