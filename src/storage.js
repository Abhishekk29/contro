// storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BILLS_KEY = 'bills';
const FRIENDS_KEY = 'friends';

export const getBills = async () => {
  const data = await AsyncStorage.getItem(BILLS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveBills = async (bills) => {
  await AsyncStorage.setItem(BILLS_KEY, JSON.stringify(bills));
};

export const getFriends = async () => {
  const data = await AsyncStorage.getItem(FRIENDS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFriends = async (friends) => {
  await AsyncStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
};
