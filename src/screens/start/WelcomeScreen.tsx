import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation , NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../navigations/RootStackParamList';

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className='flex-1 px-2 bg-orange-600'>
    <View className="flex-1 justify-center items-center bg-green-200 relative ">
      {/* Gradient Background */}
      <LinearGradient
        colors={['#ff7b00', '#ff3d00']}
        className="absolute inset-0 w-full h-full px-2 "
      />

      {/* Logo / Illustration */}
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png' }}
        className="w-40 h-40 mb-6"
      />

      {/* Catchy Title */}
      <Text className="text-white text-3xl font-bold text-center leading-9">
        Shop Smart, Shop Easy {"\n"}Connect with Us!
      </Text>

      {/* Subtitle */}
      <Text className="text-gray-300 text-lg text-center mt-3">
        Discover the best deals and seamless shopping experience.
      </Text>

      {/* Buttons Section */}
      <View className="w-full mt-8">
        <TouchableOpacity
          className="border bg-slate-50 border-slate-800 py-4 rounded-full"
          onPress={() => navigation.navigate('Loginotp')}
        >
          <Text className="text-center text-slate-900 font-semibold text-lg">Get starred</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
