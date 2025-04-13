import React from 'react';
import { useEffect,useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import WelcomeScreen from '../screens/start/WelcomeScreen';
import SplashScreen from '../screens/start/SplashScreen';
import Loginwithotp from '../screens/start/Loginwithotp';
import OTPVerification from '../screens/start/OTPverification';
import TabNavigator from './TabNavigator';
import FillProfile from '../screens/start/FillProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Stack = createStackNavigator();

const MainStack = () => {
  
  


  return (
      <Stack.Navigator 
        screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS, // Smooth transition effect
      }}
      initialRouteName="SplashScreen"
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Loginotp" component={Loginwithotp} />
        
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="FillProfile" component={FillProfile} />

        <Stack.Screen name="MainTab" component={TabNavigator} />
        

        {/* <Stack.Screen name="OTPVerification" component={OTPVerification} /> */}
        {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
        {/* <Stack.Screen name="MainTabs" component={TabNavigator} /> */}
       
      </Stack.Navigator>
  );
};

export default MainStack ;
