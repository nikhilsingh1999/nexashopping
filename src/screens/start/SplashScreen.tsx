import React, { useEffect } from 'react';
import { View, Image, Animated } from 'react-native';
import { useNavigation , NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigations/RootStackParamList';

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]).start(() => {
      navigation.replace('Welcome');
    });
  }, []);

  return (
    <View className="flex-1 bg-yellow-400 dark:bg-gray-900 justify-center items-center">
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../../assets/logo.png')}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;