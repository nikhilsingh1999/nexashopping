import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomModal from "../../components/CustomModal";
import { useDispatch } from "react-redux"; // Assuming you have a Redux store set up
import { login } from "../../redux/slices/authSlice";

const FillProfile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {  phone , idToken , refreshToken } = route.params as {
    // uid: string;
    phone: string;
    idToken: string;
    refreshToken: string;
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const dispatch = useDispatch(); // Assuming you have a Redux store set up

  const handleSubmit = async () => {
    try {
      console.log("Token data:", { idToken});
      const response = await fetch("https://nexa-shopping-user-service.onrender.com/api/v1/user/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        const res = dispatch(login({
          user: data.user,
          refreshToken: refreshToken,
        }));
        console.log('Res:', res);
        setSuccessModalVisible(true);
      } 
      else {
      Alert.alert("Error", data.message || "Submission failed");
            }
    } catch (err) {
      console.error("Profile update error:", err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTab" }],
    });
  };

  return (
    <SafeAreaView className="flex-1 pt-12">
      <View className="flex-1 p-6 bg-gray-900">
        <Text className="text-white text-2xl font-semibold mb-6">Complete your Profile</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          className="bg-gray-800 text-white p-4 rounded mb-4"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          className="bg-gray-800 text-white p-4 rounded mb-4"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Phone"
          editable={false}
          value={phone}
          className="bg-gray-700 text-white p-4 rounded mb-4"
        />
        <TextInput
          placeholder="Referral Code (Optional)" // New field for referral code
          placeholderTextColor="#aaa"
          className="bg-gray-800 text-white p-4 rounded mb-4"
          value={referralCode}
          onChangeText={setReferralCode}
        />

        <TouchableOpacity onPress={handleSubmit} className="bg-orange-500 py-4 rounded-full mt-4">
          <Text className="text-center text-white font-bold text-lg">Submit</Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        isVisible={isSuccessModalVisible}
        onClose={handleSuccessModalClose}
        title="Profile Updated"
        message="Your profile has been successfully updated."
        iconName="check-circle"
        buttonText="OK"
      />

    </SafeAreaView>
  );
};

export default FillProfile;