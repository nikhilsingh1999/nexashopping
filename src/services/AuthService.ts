import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetRootToLogin } from '../navigations/navigationService';
import { Alert , ToastAndroid , Platform } from 'react-native';
import { logout } from '../redux/slices/authSlice';
import store from '../redux/store'; // Adjust the path as needed

const AUTH_TOKEN_KEY = '@auth_token';
const SESSION_EXPIRY_KEY = '@session_expiry';
  
// Store token with expiry
export const saveAuthToken = async (token: string, expiresInSeconds: number = 604800) => {
  try {
    const expiryDate = new Date().getTime() + (expiresInSeconds * 1000);
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, token],
      [SESSION_EXPIRY_KEY, expiryDate.toString()]
    ]);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw new Error('Failed to save session');
  }
};

// Retrieve token with validation
export const getAuthToken = async () => {
  try {
    const [token, expiry] = await AsyncStorage.multiGet([AUTH_TOKEN_KEY, SESSION_EXPIRY_KEY]);
    
    if (!token[1] || !expiry[1]) return null;

    const currentTime = new Date().getTime();
    if (currentTime > parseInt(expiry[1])) {
      await clearAuthToken();
      return null;
    }

    return token[1];
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Clear storage
export const clearAuthToken = async () => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, SESSION_EXPIRY_KEY]);
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

// Check login status
export const isLoggedIn = async () => {
  const token = await getAuthToken();
  return !!token;
};


export const handleGlobalLogout = async () => {
  try {
    
    store.dispatch(logout());

    // 2. Reset navigation to login screen
    resetRootToLogin();


  } catch (error) {
    console.error('Logout failed:', error);
    Alert.alert('Error', 'Failed to log out. Please try again later.');
  }
};


  export const showMessage = (message : string) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.CENTER);
      } else {
        Alert.alert('not working', message);
      }
    };