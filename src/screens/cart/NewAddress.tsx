import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomModal from "../../components/CustomModal";

const NewAddress = () => {
  const navigation = useNavigation();
  const [addressNickname, setAddressNickname] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddAddress = () => {
    if (addressNickname && fullAddress) {
      setIsSuccess(true);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-2xl font-bold text-gray-900 text-center">New Address</Text>

      {/* Map Placeholder */}
      <View className="h-48 bg-gray-200 mt-4 rounded-lg flex items-center justify-center">
        <Text className="text-gray-600">[Map Integration Here]</Text>
      </View>

      {/* Address Fields */}
      <View className="mt-6">
        <Text className="text-gray-700 font-semibold">Address Nickname</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded-lg mt-2"
          placeholder="Choose one (e.g. Home, Work)"
          value={addressNickname}
          onChangeText={setAddressNickname}
        />

        <Text className="text-gray-700 font-semibold mt-4">Full Address</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded-lg mt-2"
          placeholder="Enter your full address"
          value={fullAddress}
          onChangeText={setFullAddress}
        />

        {/* Default Address Checkbox */}
        <TouchableOpacity
          className="flex-row items-center mt-4"
          onPress={() => setIsDefault(!isDefault)}
        >
          <MaterialIcons
            name={isDefault ? "check-box" : "check-box-outline-blank"}
            size={24}
            color="orange"
          />
          <Text className="ml-2">Make this as a default address</Text>
        </TouchableOpacity>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        className="bg-orange-500 py-4 rounded-full mt-6 shadow-lg"
        onPress={handleAddAddress}
      >
        <Text className="text-center text-white font-semibold text-lg">Add</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <CustomModal
        isVisible={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          navigation.goBack();
        }}
        title="Congratulations!"
        message="Your new address has been added."
        buttonText="Thanks"
        iconName="check-circle"
      />
    </View>
  );
};

export default NewAddress;
