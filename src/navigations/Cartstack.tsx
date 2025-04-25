import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen'; // Make sure this import is correct
import AddressSelection from '../screens/cart/AddressSelection';
import NewAddress from '../screens/cart/NewAddress';
import AddressScreen from '../screens/account/AddressScreen';
import PaymentScreen from '../screens/cart/PaymentScreen';

const Stack = createStackNavigator();

const CartStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName='CartScreen'
    >
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="Address" component={AddressSelection} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      

      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

export default CartStack;