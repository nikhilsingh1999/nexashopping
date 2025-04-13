// // src/utils/refreshToken.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// export const refreshAuthToken = async () => {
//   const refreshToken = await AsyncStorage.getItem('refreshToken');

//   if (!refreshToken) return null;

//   try {
//     const response = await axios.post('https://your-api.com/auth/refresh', {
//       refreshToken,
//     });

//     const newIdToken = response.data.idToken;
//     const userId = response.data.userId;

//     // Store new idToken
//     await AsyncStorage.setItem('idToken', newIdToken);

//     return { idToken: newIdToken, userId };
//   } catch (err) {
//     console.error("Refresh failed:", err);
//     return null;
//   }
// };
