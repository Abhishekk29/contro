import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BillsContext = createContext();

export const BillsProvider = ({ children }) => {
  const [bills, setBills] = useState([]);

  // Load bills from AsyncStorage on startup
  useEffect(() => {
    const loadBills = async () => {
      try {
        const storedBills = await AsyncStorage.getItem('@bills');
        if (storedBills) setBills(JSON.parse(storedBills));
      } catch (error) {
        console.log('Error loading bills:', error);
      }
    };
    loadBills();
  }, []);

  // Save bills to AsyncStorage whenever they change
  useEffect(() => {
    const saveBills = async () => {
      try {
        await AsyncStorage.setItem('@bills', JSON.stringify(bills));
      } catch (error) {
        console.log('Error saving bills:', error);
      }
    };
    saveBills();
  }, [bills]);

  const addBill = (bill) => {
    setBills((prev) => [...prev, { ...bill, id: Date.now().toString() }]);
  };

  const updateBill = (updatedBill) => {
    setBills((prev) =>
      prev.map((b) => (b.id === updatedBill.id ? updatedBill : b))
    );
  };

  const deleteBill = (id) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BillsContext.Provider value={{ bills, addBill, updateBill, deleteBill }}>
      {children}
    </BillsContext.Provider>
  );
};
