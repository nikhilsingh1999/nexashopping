import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import CustomModal from "../../components/CustomModal";

const OTPVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { confirmation , phoneNumber } = route.params; // Get confirmation object

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleOTPSubmit = async () => {
    const enteredOTP = otp.join("");
    
    if (enteredOTP.length < 6) {
      Alert.alert("Invalid OTP", "Please enter a 6-digit OTP.");
      return;
    }

    try {
      await confirmation.confirm(enteredOTP);
      const data = confirmation.confirm(enteredOTP);
      console.log("OTP verified successfully", data );
      setIsSuccessModal(true);
    } catch (error) {
      console.log("OTP verification failed:", error);
      setIsErrorModal(true);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 px-6 pt-12">
      <Text className="text-2xl font-bold text-gray-900 text-center">OTP Verification</Text>
      <Text className="text-gray-500 text-center mt-2">
        Enter the code sent to <Text className="font-bold">+91 {phoneNumber}</Text>
      </Text>

      <Text className="text-center text-orange-500 font-semibold text-lg mt-4">
        {timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : "Resend OTP"}
      </Text>

      <View className="flex-row justify-center mt-6 space-x-3">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="w-12 h-12 border border-gray-300 text-center text-xl rounded-lg bg-white shadow-md"
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(text) => {
              let newOtp = [...otp];
              newOtp[index] = text;
              setOtp(newOtp);

              if (text && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
              }

              if (!text && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
            value={digit}
          />
        ))}
      </View>

      <TouchableOpacity
        className="bg-orange-500 py-4 rounded-full mt-8 shadow-lg"
        onPress={handleOTPSubmit}
      >
        <Text className="text-center text-white font-semibold text-lg">
          Submit
        </Text>
      </TouchableOpacity>

      {timer === 0 && (
        <TouchableOpacity onPress={() => setTimer(30)}>
          <Text className="text-center text-orange-500 font-semibold mt-4">
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}

      <CustomModal
        isVisible={isSuccessModal}
        onClose={() => {
          setIsSuccessModal(false);
          navigation.navigate("MainTab");
        }}
        title="Welcome!"
        message="Your OTP is verified successfully."
        iconName="check-circle"
        buttonText="Proceed"
      />

      <CustomModal
        isVisible={isErrorModal}
        onClose={() => setIsErrorModal(false)}
        title="Invalid OTP"
        message="The OTP you entered is incorrect. Please try again."
        iconName="error-outline"
        buttonText="Retry"
      />
    </View>
  );
};

export default OTPVerification;
