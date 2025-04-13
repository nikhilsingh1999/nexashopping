import React, { useEffect, useRef } from 'react';
import { View, Image, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigations/RootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]).start(
      async () => {
        try {
          const persistedState = await AsyncStorage.getItem('persist:root');
          if (persistedState) {
            const parsedRoot = JSON.parse(persistedState);
            const authState = JSON.parse(parsedRoot.auth); // 'auth' is your slice key
            const token = authState.idToken;
    
            if (token) {
              navigation.replace('MainTab');
            } else {
              navigation.replace('Welcome');
            }
          } else {
            navigation.replace('Welcome');
          }
        } catch (error) {
          console.log('Error checking token:', error);
          navigation.replace('Welcome');
        }
      });
  }, [fadeAnim, navigation]);

  return (
    <View className="flex-1 bg-slate-200 dark:bg-slate-400 justify-center items-center">
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../../assets/logo.png')}
          className="w-52 h-52"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
