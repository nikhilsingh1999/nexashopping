// src/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from '../redux/slices/authSlice'; // ✅ correct import name
 // ✅ correct import name

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // ✅ key must match reducer name
};

const rootReducer = combineReducers({
  auth: authReducer, // ✅ key is 'auth'
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
