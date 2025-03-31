import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/account/AccountScreen';
import ProfileScreen from '../screens/account/ProfileScreen';
import OrdersScreen from '../screens/account/OrdersScreen';


const stack = createStackNavigator();

const AccountStack = () => {
  return (
    <stack.Navigator 
        initialRouteName="AccountScreen" 
        screenOptions={{ headerShown: false }}
        
        >
      <stack.Screen name="AccountScreen" component={AccountScreen} />
      <stack.Screen name="Profile" component={ProfileScreen} />
      <stack.Screen name="Order" component={OrdersScreen} />

    </stack.Navigator>
  );
}

export default AccountStack;