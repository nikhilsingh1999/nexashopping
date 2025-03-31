import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AccountScreen = () => {
  const navigation = useNavigation();

  const menuItems = [
    { icon: "person", label: "Your Profile", screen: "Profile" },
    { icon: "shopping-bag", label: "My Order", screen: "Order" },
    { icon: "payment", label: "Payment Methods", screen: "PaymentMethods" },
    { icon: "notifications", label: "Notifications", screen: "Notifications" },
    { icon: "policy", label: "Privacy Policy", screen: "PrivacyPolicy" },
    { icon: "help", label: "Help Center", screen: "HelpCenter" },
    { icon: "group-add", label: "Invite Friends", screen: "InviteFriends" },
  ];

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-2xl font-bold text-gray-900 text-center">Account</Text>
      <ScrollView className="mt-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between py-4 border-b border-gray-200"
            onPress={() => navigation.navigate(item.screen)}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons name={item.icon} size={24} color="black" />
              <Text className="text-lg">{item.label}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="gray" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity className="mt-6 py-3 flex-row items-center justify-center  " onPress={() => console.log("Logout")}>
        <MaterialIcons name="power-settings-new" size={24} color="red" />
        <Text className="text-red-500 font-semibold ml-2">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;
