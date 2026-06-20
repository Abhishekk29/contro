// src/utils/controStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@contro/list";

// ─── Read all saved contros ────────────────────────────────────────────────────
export const getAllContros = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("getAllContros error:", err);
    return [];
  }
};

// ─── Get a single contro by id ─────────────────────────────────────────────────
export const getContro = async (id) => {
  try {
    const list = await getAllContros();
    return list.find((c) => c.id === id) || null;
  } catch (err) {
    console.error("getContro error:", err);
    return null;
  }
};

// ─── Save (create or update) a contro ─────────────────────────────────────────
// Pass the full contro object. If id exists it updates, else it creates.
export const saveContro = async (contro) => {
  try {
    const list = await getAllContros();
    const now = Date.now();

    if (contro.id) {
      // Update existing
      const idx = list.findIndex((c) => c.id === contro.id);
      if (idx !== -1) {
        list[idx] = { ...contro, updatedAt: now };
      } else {
        list.unshift({ ...contro, updatedAt: now });
      }
    } else {
      // New contro — generate id
      const newContro = {
        ...contro,
        id: `contro_${now}`,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      };
      list.unshift(newContro);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return newContro.id;
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return contro.id;
  } catch (err) {
    console.error("saveContro error:", err);
    return null;
  }
};

// ─── Mark a contro as completed ────────────────────────────────────────────────
export const markCompleted = async (id) => {
  try {
    const list = await getAllContros();
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx].status = "completed";
      list[idx].updatedAt = Date.now();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch (err) {
    console.error("markCompleted error:", err);
  }
};

// ─── Delete a contro by id ─────────────────────────────────────────────────────
export const deleteContro = async (id) => {
  try {
    const list = await getAllContros();
    const filtered = list.filter((c) => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("deleteContro error:", err);
  }
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const calcTotal = (expenses = []) =>
  expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
