import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigations/RootStackParamList';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice'
import axiosInstance from '../../utils/axiosInstance';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch(); // Assuming you have a Redux store set up

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]).start(() => {
      const checkSession = async () => {
        try {
          const response = await axiosInstance.get('/api/v1/user/auth/session', {
            withCredentials: true, // Important for cookie-based session management
          });
  
          console.log('Session check response:', response);
          const data = response.data;
          console.log('Session check data:', data);
  
          if (response.status === 200 && data.success ) {

            console.log(dispatch(setUser({user: data.user}))); // 👈 Save user in Redux
            navigation.replace('MainTab');
          } else {
            navigation.replace('Welcome');
          }
        } catch (error) {
          console.log('Session check error:', error);
          navigation.replace('Welcome');
        }
      };
  
      checkSession();
    });
  }, [fadeAnim, navigation]);

  return (
    <View className="flex-1 bg-slate-200 dark:bg-slate-400 justify-center items-center">
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../../assets/logo2.png')}
          className="w-52 h-52"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};


export default SplashScreen;
