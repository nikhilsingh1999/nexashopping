import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AddressSelection = () => {
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const addresses = [
    { id: 1, type: "Home", details: "925 S Chugach St APT 10, Alaska" },
    { id: 2, type: "Office", details: "456 Elm St, Ketchikan, Alaska" },
    { id: 3, type: "Apartment", details: "2561 Vista Dr, Juneau, Alaska" },
    { id: 4, type: "Parent's House", details: "4821 Ridge Top Dr, Anchorage" },
  ];

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-2xl font-bold text-gray-900 text-center">Address</Text>

      {/* Address List */}
      <ScrollView className="mt-4">
        {addresses.map((item) => (
          <TouchableOpacity
            key={item.id}
            className={`flex-row items-center justify-between p-4 border rounded-lg mb-3 ${
              selectedAddress === item.id ? "border-orange-500" : "border-gray-300"
            }`}
            onPress={() => setSelectedAddress(item.id)}
          >
            <View>
              <Text className="font-bold">{item.type}</Text>
              <Text className="text-gray-500">{item.details}</Text>
            </View>
            {selectedAddress === item.id && <MaterialIcons name="check-circle" size={24} color="green" />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add New Address Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center mt-4 py-4 bg-gray-200 rounded-lg"
        onPress={() => navigation.navigate("NewAddress")}
      >
        <MaterialIcons name="add-location-alt" size={20} color="black" />
        <Text className="ml-2 font-semibold">Add New Address</Text>
      </TouchableOpacity>

      {/* Apply Button */}
      <TouchableOpacity className="bg-orange-500 py-4 rounded-full mt-6 shadow-lg">
        <Text className="text-center text-white font-semibold text-lg">Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressSelection;
