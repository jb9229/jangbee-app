import { AsyncStorage } from 'react-native';

// Variables
export const STORAGE_KEY = {
  STOREKEY_ISSCAN_BLACKLIST: 'STOREKEY_ISSCAN_BLACKLIST',
};

// Utils Method
export async function retrieve(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    return undefined;
  }
}

export async function store(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}
