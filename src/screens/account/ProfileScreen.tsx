import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("Cody Fisher");
  const [email, setEmail] = useState("cody.fisher45@example.com");
  const [dob, setDob] = useState("12/07/1990");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("+91 234 453 31 06");

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-2xl font-bold text-gray-900 text-center">My Profile</Text>

      <View className="mt-6">
        <Text className="text-gray-500 mb-1">Full Name</Text>
        <TextInput className="border border-gray-300 p-3 rounded-lg" value={fullName} onChangeText={setFullName} />

        <Text className="text-gray-500 mt-4 mb-1">Email Address</Text>
        <TextInput className="border border-gray-300 p-3 rounded-lg" value={email} keyboardType="email-address" onChangeText={setEmail} />

        <Text className="text-gray-500 mt-4 mb-1">Date of Birth</Text>
        <TouchableOpacity className="border border-gray-300 p-3 rounded-lg flex-row justify-between">
          <Text>{dob}</Text>
          <MaterialIcons name="calendar-today" size={20} color="gray" />
        </TouchableOpacity>

        <Text className="text-gray-500 mt-4 mb-1">Gender</Text>
        <TouchableOpacity className="border border-gray-300 p-3 rounded-lg flex-row justify-between">
          <Text>{gender}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="gray" />
        </TouchableOpacity>

        <Text className="text-gray-500 mt-4 mb-1">Phone Number</Text>
        <TextInput className="border border-gray-300 p-3 rounded-lg" value={phone} keyboardType="phone-pad" onChangeText={setPhone} />
      </View>

      <TouchableOpacity className="bg-orange-600 py-4 rounded-full mt-6 shadow-lg">
        <Text className="text-center text-white font-semibold text-lg">Saved</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
