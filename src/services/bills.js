import API from './api';

// GET all bills
export const fetchBills = async () => {
  const res = await API.get('/bills');
  return res.data;
};

// POST new bill
export const createBill = async (billData) => {
  const res = await API.post('/bills', billData);
  return res.data;
};
