// src/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import authReducer from '../redux/slices/authSlice'; 
import productReducer from '../redux/slices/productSlice'
import cartReducer from '../redux/slices/cartSlice'
import addressReducer from '../redux/slices/addressSlice'
import orderReducer from './slices/orderSlice'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // ✅ key must match reducer name
};

const rootReducer = combineReducers({
  auth: authReducer, // ✅ key is 'auth'
  products: productReducer, // ✅ key is 'products'
  cart: cartReducer, // ✅ key is 'cart'
  address: addressReducer, // ✅ key is 'address'
  orders: orderReducer, // ✅ key is 'orders'
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
