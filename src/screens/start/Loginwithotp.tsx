import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import CustomModal from "../../components/CustomModal";
import { OtplessHeadlessModule } from "otpless-headless-rn";


const Loginwithotp = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneNumberRef = useRef(phoneNumber);

  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const headlessModule = useRef(new OtplessHeadlessModule()).current;


  useEffect(() => {
    phoneNumberRef.current = phoneNumber;
  }, [phoneNumber]);

  useEffect(() => {
    headlessModule.initialize("j0yx9cghgo3eny815go1");
    headlessModule.setResponseCallback(handleOtpLessResponse);

    return () => {
      headlessModule.clearListener();
      headlessModule.cleanup();
    };
  }, []);


  const handleOtpLessResponse = (result: any) => {
    console.log('OTPLESS Response from loginotp :', result); // Add debug logging

    switch (result.responseType) {
      case "INITIATE": {
        // Notify that headless authentication has been initiated
        if (result.statusCode == 200) {
          console.log("Headless authentication initiated");
          console.log(result.response);
          console.log(phoneNumberRef.current);

          const authType = result.response.authType; // This is the authentication type
          if (authType === "OTP") {
            navigation.navigate("OTPVerification", {
              phone: phoneNumberRef.current,
              // requestId: result.response.requestId,
              resendOtp: () => headlessModule.start({
                phone: phoneNumberRef.current,
                countryCode: '91',
                authType: "OTP"
              })
            });
          }
        }

        break;
      }
      case 'FAILED':
        setLoading(false);
        handleInitiateError(result);
        break;
    }


  }


  const sendOtp = async () => {
    console.log("Sending OTP...to", phoneNumber);

    if (phoneNumber.length !== 10) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    if (!phoneNumberRef.current) {
      Alert.alert("Error", "Phone number not set");
      return;
    }

    setLoading(true);


    // const currentPhoneNumber = phoneNumber;  // ADD THIS LINE

    try {
      // ✅ Step 1: Validate number with API
      // const fullPhone = `+91${phoneNumber}`; // API expects +91
      // const validateResponse = await fetch("https://nexa-shopping-user-service.onrender.com/api/v1/user/validate-user", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({ phone: fullPhone })
      // });
      
      // console.log("Validation Response:", validateResponse); // Debug logging
      // const result = await validateResponse.json();
      // console.log("Validation Response:", result); // Debug logging

      // if (!validateResponse.ok || !result.success) {
      //   setLoading(false);
      //   Alert.alert("Validation Failed", result.message || "Phone number is not valid.");
      //   return;
      // }
      // 
      // 
      // 
      // ✅ Step 2: Send OTP to validated number

      const request = {
        phone: phoneNumber,
        countryCode: '91',
        authType: "OTP",
      };
      await headlessModule.start(request);
      setPhoneNumber(phoneNumber);
      console.log("OTP sent successfully", phoneNumber);
    }
    catch (error) {
      console.error("Error sending OTP:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to send OTP. Please try again later.");
    }
  };

  const handleInitiateError = (response: any) => {
    const errorCode = response?.errorCode;
    switch (errorCode) {
      case '7102':
        Alert.alert('Error', 'Invalid phone number format');
        break;
      case '7025':
        Alert.alert('Error', 'This country is not supported');
        break;
      case '7020':
        Alert.alert('Error', 'Too many attempts. Please try later after some time');
        break;
      case "9100":
      case "9104":
      case "9103":
        Alert.alert("Network connectivity error -", "Please check your internet connection and try again.");
        break;
      default:
        Alert.alert('Error', response?.errorMessage || 'Failed to send OTP');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">

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
        {/* Illustration Section */}
        <View className="items-center justify-center my-8">
          <View className="bg-gray-800/50 w-64 h-64 rounded-full items-center justify-center mb-6">
            <View className="relative">
              <View className="absolute -left-20 -top-10">
                <MaterialIcons name="message" size={48} color="#f97316" />
              </View>
              <View className="bg-orange-500/20 rounded-full p-6">
                <MaterialIcons name="smartphone" size={80} color="#f97316" />
              </View>
              <View className="absolute -right-16 top-10">
                <MaterialIcons name="security" size={40} color="#f97316" />
              </View>
              <View className="absolute -bottom-12 left-4">
                <MaterialIcons name="lock" size={36} color="#f97316" />
              </View>
            </View>
          </View>
        </View>

        <View className="p-5 flex gap-2">
          <Text className="text-gray-300 text-sm mb-1">Enter your mobile number</Text>

          <View className="flex-row items-center bg-gray-900 p-3 border border-slate-200 rounded-3xl">
            <Text className="text-white text-lg font-semibold mr-2">+91</Text>
            <TextInput
              className="flex-1 text-white text-lg tracking-widest"
              placeholder="9123456789"
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