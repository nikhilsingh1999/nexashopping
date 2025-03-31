import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import CustomModal from "../../components/CustomModal";



const Loginwithotp = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const sendOtp = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }
  
    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
      
      setLoading(false);
      navigation.navigate("OTPVerification", { confirmation, phoneNumber });
  
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Invisible reCAPTCHA anchor */}
      <View id="invisible-recaptcha" />

      <View className="mt-16 px-6">
        <Text className="text-orange-500 text-4xl font-extrabold text-center">Welcome Back!</Text>
        <Text className="text-gray-400 text-lg text-center mt-2">
          Login with your mobile number to continue
        </Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1 justify-center px-6"
      >
        <View className="bg-gray-800 p-5 rounded-2xl shadow-lg shadow-black">
          <Text className="text-gray-300 text-sm mb-1">Enter your mobile number</Text>

          <View className="flex-row items-center bg-gray-900 p-3 rounded-lg">
            <Text className="text-white text-lg font-semibold mr-2">+91</Text>
            <TextInput
              className="flex-1 text-white text-lg tracking-widest"
              placeholder="9876543210"
              placeholderTextColor="gray"
              keyboardType="number-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <TouchableOpacity
            className={`mt-6 py-4 rounded-full ${phoneNumber.length === 10 ? "bg-orange-500" : "bg-gray-700"}`}
            disabled={loading || phoneNumber.length !== 10}
            onPress={sendOtp}
          >
            <Text className="text-center text-white text-lg font-semibold">
              {loading ? "Sending OTP..." : "Get OTP"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="OTP Sent!"
        message="Your OTP has been successfully sent. Please check your messages."
        iconName="check-circle"
        buttonText="OK"
      />

      <View className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-gray-900 to-transparent" />
    </SafeAreaView>
  );
};

export default Loginwithotp;