import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import CustomModal from "../../components/CustomModal";
import { storeAuthData } from "../../utils/Storage";
import { OtplessHeadlessModule } from "otpless-headless-rn";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";


const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const headlessModule = useRef(new OtplessHeadlessModule()).current;

  const [verificationError, setVerificationError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loader

  const inputRefs = useRef([]);

  const params = route.params as {
    phone: string;
    resendOtp: () => Promise<void>;
  };

  const phoneNumber = params?.phone || "";

  const handleOtpResponse = (result: any) => {
    console.log('OTPLESS Response:', result);

    switch (result.responseType) {
      case 'OTP_AUTO_READ':
        if (Platform.OS === 'android') {
          const autoOtp = result.response.otp;
          setOtp(autoOtp.split(''));
        }
        break;


      case 'VERIFY':
        if (result.statusCode === 200) {
          console.log('From verify case Verification Success:', result.response);
          setIsSuccessModal(true);
        } else {
          handleVerifyError(result);
        }
        break;



      case 'INITIATE':
        if (result.statusCode === 200) {
          console.log('Session ID:', result.response);

          // setSessionId(result.response.sessionId);

        }
        break;
      case "DELIVERY_STATUS": {
        // This function is called when delivery is successful for your authType.
        console.log('Delivery Status:', result.response);
      }
        break;

      case 'FAILED':
        handleVerifyError(result);
        break;

      case "ONETAP": {
        if (result.statusCode !== 200) {

          console.error('OneTap Error:', result);
          return;
        }
        else {
          const token = result.response.data.token;
          const info = result.response
          console.log('OneTap Response:', result.response);
          console.log('OneTap Info:', info);

          console.log('OneTap Token:', token);
          if (token != null) {
            console.log(`OneTap Data: ${token}`);
            handleVerificationSuccess(info);
          } else {
            console.error('OneTap Token is null or undefined');
          }
        }
        break;
      }
      default:
        console.warn('Unhandled response type:', result.responseType);
    }
  };


  useEffect(() => {
    const initializeModule = async () => {
      try {
        await headlessModule.initialize("j0yx9cghgo3eny815go1");
        headlessModule.setResponseCallback(handleOtpResponse);
        console.log('OTPLess initialized successfully');
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('Error', 'Failed to initialize OTP service');
      }
    };

    initializeModule();

    return () => {
      headlessModule.clearListener();
      headlessModule.cleanup();
    };
  }, []);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1); // Use functional update
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer])


  const handleOTPSubmit = async () => {
    const enteredOTP = otp.join('');

    if (!/^\d{6}$/.test(enteredOTP)) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    console.log('Route params:', route.params);
    console.log('Phone number from params:', phoneNumber);

    try {
      setIsLoading(true); // Show loader
      const verifyRequest = {
        phone: phoneNumber,
        countryCode: '91',
        otp: enteredOTP
      };

      console.log('Verification Request:', verifyRequest);
      const result = await headlessModule.start(verifyRequest);
      console.log('Verification Result:', result);

      setIsLoading(false); // Hide loader
    } catch (error) {
      console.error('Verification Error:', error);
      setVerificationError('Failed to verify OTP');
      setIsErrorModal(true);
      setIsLoading(false); // Hide loader
    }
  };

  const handleVerifyError = (response: any) => {
    const errorCode = response?.errorCode;
    switch (errorCode) {
      case '7118':
        setVerificationError('Incorrect OTP entered');
        break;
      case '7303':
        setVerificationError('OTP has expired');
        break;
      case '7112':
        setVerificationError('Please enter the OTP');
        break;
      default:
        setVerificationError(response?.errorMessage || 'Verification failed');
    }
    setIsErrorModal(true);
  };


  const handleResendOtp = async () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    setVerificationError('');

    try {
      console.log('Attempting resend...');
      await params.resendOtp(); // Use params.resendOtp directly
      Alert.alert("OTP Resent", "New OTP has been sent");
    } catch (error) {
      console.error('Resend Error:', error);
      Alert.alert("Error", error.message || "Failed to resend OTP");
    }
  };



  const handleVerificationSuccess = async (info: any) => {
    setIsLoading(true); // Show loader
    try {
      console.log('Final Verification info:', info);

      const idToken = info?.data?.idToken;
    //  const userId = info?.data?.userId;
      const refreshToken = info?.sessionInfo?.refreshToken;
      
      // console.log('ID Token:', idToken);
      // console.log('User ID:', userId);
      // console.log('Refresh Token:', refreshToken);

      // if (!idToken || !userId || !refreshToken) {
        // throw new Error("Missing token data");
      // }

      // ✅ Store tokens in AsyncStorage
      // await storeAuthData(idToken, userId, refreshToken);

      
      const phoneWithCode = `+91${phoneNumber}`;
      // const uid = info.userId; // assuming uid is part of the response
      const response = await fetch("https://nexa-shopping-user-service.onrender.com/api/v1/user/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneWithCode }),
      });

      const data = await response.json();
      console.log('Data:', data);

      if (data.success == false) {
        // New user: redirect to profile fill screen with token and phone
        navigation.navigate("FillProfile", {
          phone: phoneWithCode,
          idToken: idToken,
          refreshToken: refreshToken,});

      } else {
        const response1 = await fetch("https://nexa-shopping-user-service.onrender.com/api/v1/user/store-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             "authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({ }),
        });
        console.log('Response1:', response1);
        const data1 = await response1.json();
        console.log('Data1:', data1);
        if (data1.success == true) {
          const res = dispatch(login({
            user: data1.user,
            idToken: idToken,
            refreshToken: refreshToken,
          }));
          console.log('Res:', res);
          handleSuccess()
          
          return;
        }
      }
    } catch (err) {
      console.error("Post-verify error:", err);
      Alert.alert("Error", "Something went wrong during login.");
    }
  };

  const handleSuccess = () => {
    setIsSuccessModal(false);

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTab' }],
    });
  };

  return (
    <View className="flex-1  px-6 pt-12 bg-gray-900 ">
      <Text className="text-2xl font-bold text-gray-900 text-center">OTP Verification</Text>
      <Text className="text-gray-500 text-center mt-2">
        Enter the code sent to <Text className="font-bold">+91 {phoneNumber}</Text>
      </Text>

      <Text className="text-center text-orange-500 font-semibold text-lg mt-4">
        {timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : "Resend OTP"}
      </Text>

      <View className="flex-row justify-center gap-3 mt-6 space-x-3">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="w-12 h-12 border-b  border-gray-300 text-center text-xl text-slate-100 shadow-md"
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
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>

      {verificationError ? (
        <Text className="text-red-500 text-center mt-4">{verificationError}</Text>
      ) : null}

      <TouchableOpacity
        className="bg-orange-500 py-4 rounded-full mt-8 shadow-lg flex justify-center items-center"
        onPress={handleOTPSubmit}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show loader
        ) : (
          <Text className="text-center text-white font-semibold text-lg">
            Submit
          </Text>
        )}
      </TouchableOpacity>

      {timer === 0 && (
        <TouchableOpacity onPress={handleResendOtp}>
          <Text className="text-center text-orange-500 font-semibold mt-4">
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}

      <CustomModal
        isVisible={isSuccessModal}
        onClose={handleSuccess}
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
