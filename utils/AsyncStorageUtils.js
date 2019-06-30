import { AsyncStorage } from 'react-native';
import * as api from '../api/api';
import { notifyError } from '../common/ErrorNotice';

const STOREKEY_FAV_EQUIPMENT = 'STOREKEY_FAV_EQUIPMENT_N';

async function retrieve(key) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    return undefined;
  }
}

async function store(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getMyEquipment(accountId) {
  let myEquipment = await retrieve(STOREKEY_FAV_EQUIPMENT);

  if (!myEquipment) {
    myEquipment = await api
      .getFirm(accountId)
      .then((firm) => {
        if (firm) {
          store(STOREKEY_FAV_EQUIPMENT, firm.equiListStr);
          return firm.equiListStr;
        }
        return undefined;
      })
      .catch(error => undefined);
  }

  return myEquipment;
}

export function updateMyEquipment(accountId) {
  api
    .getFirm(accountId)
    .then((firm) => {
      if (firm) {
        store(STOREKEY_FAV_EQUIPMENT, firm.equiListStr);
      }
      return undefined;
    })
    .catch(() => undefined);
}

export function test() {}
