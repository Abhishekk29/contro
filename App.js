import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { BillsProvider } from './src/context/BillsContext';

export default function App() {
  return (
    <BillsProvider>
      <AppNavigator />
    </BillsProvider>
  );
}
