// // utils/authStorage.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const storeAuthData = async (idToken: string, userId: string, refreshToken: string) => {
//   try {
//     await AsyncStorage.setItem('idToken', idToken);
//     await AsyncStorage.setItem('userId', userId);
//     await AsyncStorage.setItem('refreshToken', refreshToken);
//   } catch (error) {
//     console.error('Error saving auth data:', error);
//   }
// };

// export const getAuthData = async () => {
//   try {
//     const idToken = await AsyncStorage.getItem('idToken');
//     const userId = await AsyncStorage.getItem('userId');
//     const refreshToken = await AsyncStorage.getItem('refreshToken');
//     return { idToken, userId, refreshToken };
//   } catch (error) {
//     console.error('Error reading auth data:', error);
//     return null;
//   }
// };

// export const clearAuthData = async () => {
//   try {
//     await AsyncStorage.multiRemove(['idToken', 'userId', 'refreshToken']);
//   } catch (error) {
//     console.error('Error clearing auth data:', error);
//   }
// };
