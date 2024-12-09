// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to AsyncStorage
export const saveUserData = async (userId: string, userData: object) => {
  try {
    await AsyncStorage.setItem(`userData:${userId}`, JSON.stringify(userData));
  } catch (e) {
    console.error("Error saving user data", e);
  }
};

// Retrieve data from AsyncStorage
export const getUserData = async (userId: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(`userData:${userId}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error reading user data", e);
    return null;
  }
};

// Clear user data from AsyncStorage
export const clearUserData = async (userId: string) => {
  try {
    await AsyncStorage.removeItem(`userData:${userId}`);
  } catch (e) {
    console.error("Error clearing user data", e);
  }
};
