import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BillsContext = createContext();

export const BillsProvider = ({ children }) => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const stored = await AsyncStorage.getItem('bills');
      if (stored) setBills(JSON.parse(stored));
    } catch (error) {
      console.error(error);
    }
  };

  const saveBills = async (newBills) => {
    try {
      setBills(newBills);
      await AsyncStorage.setItem('bills', JSON.stringify(newBills));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BillsContext.Provider value={{ bills, saveBills }}>
      {children}
    </BillsContext.Provider>
  );
};
