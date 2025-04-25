import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../screens/account/AccountScreen';
import ProfileScreen from '../screens/account/ProfileScreen';
import OrdersScreen from '../screens/account/OrdersScreen';
import WalletScreen from '../screens/account/wallet/WalletScreen';
import Privacyandpolicy from '../screens/account/Privacyandpolicy';
import TermsConditions from '../screens/account/TermsConditions';
import ReturnsPolicy from '../screens/account/ReturnsPolicy';
import AddressScreen from '../screens/account/AddressScreen';
import Orderdetails from '../screens/account/Orderdetails';


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
      <stack.Screen name="OrderDetails" component={Orderdetails} />
      <stack.Screen name="address" component={AddressScreen} />
      <stack.Screen name="Wallet" component={WalletScreen} />
      <stack.Screen name="privacy" component={Privacyandpolicy} />
      <stack.Screen name="terms" component={TermsConditions} />
      <stack.Screen name="return" component={ReturnsPolicy} />


    </stack.Navigator>
  );
}

export default AccountStack;