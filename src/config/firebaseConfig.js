import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXyxYcT3JR5hLiuFXqw2tsQns2rBTGwU0",
  projectId: "contro-8fcc9",
  storageBucket: "contro-8fcc9.firebasestorage.app",
  messagingSenderId: "968767556665",
  appId: "1:968767556665:android:ce9a62ce82eeb1749711e8",
};

// Only initialize once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
export const db = getFirestore(app);
