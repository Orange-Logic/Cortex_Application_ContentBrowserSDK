/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-fallthrough */

import { StorageType } from '../types/storage';

const DATA_EXPIRE_TIME_POSTFIX = '_valid_until';
const DEFAULT_EXPIRED_DURATION = 1 * 24 * 60 * 60 * 1000; // 1 Day

/**
 * Check the local storage availability
 * @returns True if available, false if not
 */
const isLocalStorageAvailable = () => {
  const mod = 'test-storage';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Create new cookie
 * @param {string} key key name
 * @param {string} value value
 * @param {string} expireDate duration how long to keep the cookie
 */
const createCookie = (
  key: string,
  value: string,
  expireDate: string | null = null,
) => {
  let expires = '';
  if (expireDate) {
    expires = '; expires=' + expireDate;
  }
  document.cookie = key + '=' + value + expires + '; path=/';
};

/**
 * Get cookie with key
 * @param {string} key
 * @returns cookie value
 */
const getCookie = (key: string) => {
  const nameEQ = key + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Get the data from storage
 * @param {string} key
 * @param {StorageType} storageType
 * @returns value associated with the key, return null if not found
 */
export const getData = async (
  key: string,
  storageType?: StorageType,
): Promise<string | null> => {
  // When type is not defined, we will try to get the data from every possible options
  if (storageType == null) {
    return (
      (await getData(key, 'LocalStorage')) ??
      (await getData(key, 'SessionStorage')) ??
      (await getData(key, 'Cookies'))
    );
  }
  switch (storageType) {
    case 'SessionStorage':
      return (await isValueExpired(key, 'SessionStorage'))
        ? null
        : sessionStorage.getItem(key);
    case 'Cookies': // If local storage is not available or user force to save to cookie
      return getCookie(key);
    default: // By default, we will always store data to session storage
    case 'LocalStorage':
      if (isLocalStorageAvailable()) {
        return (await isValueExpired(key, 'LocalStorage'))
          ? null
          : localStorage.getItem(key);
      }
      return null;
  }
};

/**
 * Check if a value associate with key has expired or not. If already expired, delete that value.
 * @param {string} key
 * @param {StorageType} type
 * @returns
 */
const isValueExpired = async (key: string, type?: StorageType) => {
  // The value of expire time will never be expired. It will be delete together with the main value when that value expired.
  if (key.endsWith(DATA_EXPIRE_TIME_POSTFIX)) {
    return false;
  }
  const dataExpireTimeKey = key + DATA_EXPIRE_TIME_POSTFIX;
  const expireDateStr = await getData(dataExpireTimeKey, type);
  // if expireDate wasn't specified, the value is never expire
  if (!!expireDateStr) {
    const expireDate = new Date(expireDateStr).getTime();
    const currentTime = new Date().getTime();
    // If the value is expired, delete it and also the expired value comes with with it.
    if (expireDate < currentTime) {
      deleteData(key);
      deleteData(dataExpireTimeKey);
      return true;
    }
  }
  return false;
};

/**
 * Store data to StorageType.
 * If Type not specified 'UserProperties' type will be used by default
 * If invalid type is specified, it will only store to local storage
 * @param {string} key
 * @param {string} value
 * @param {StorageType} storageType
 * @param {number} ttl Time to live in miliseconds
 */
export const storeData = (
  key: string,
  value: string,
  storageType: StorageType = 'LocalStorage',
  ttl = 0,
) => {
  const dataExpireTimeKey = key + DATA_EXPIRE_TIME_POSTFIX;
  const expireDate = new Date();
  expireDate.setTime(expireDate.getTime() + (ttl || DEFAULT_EXPIRED_DURATION));
  const expireDateStr = expireDate.toUTCString();

  switch (storageType) {
    case 'SessionStorage':
      if (!!ttl) {
        sessionStorage.setItem(dataExpireTimeKey, expireDateStr);
      }
      return sessionStorage.setItem(key, value);
    case 'Cookies': // If local storage is not available or user force to save to cookie
      return createCookie(key, value, !ttl ? undefined : expireDateStr);
    default:
    case 'LocalStorage': // By default, we will always store data to local storage
      if (isLocalStorageAvailable()) {
        if (!!ttl) {
          localStorage.setItem(dataExpireTimeKey, expireDateStr);
        }
        return localStorage.setItem(key, value);
      }
      return null;
  }
};

/**
 * Delete data from all storage
 * @param {string} key
 */
export const deleteData = (key: string) => {
  // Remove from session storage
  sessionStorage.removeItem(key);
  // Remove from local storage
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(key);
  }
  // Remove from cookies
  document.cookie = key + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
