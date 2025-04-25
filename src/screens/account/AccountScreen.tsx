import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView , SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { handleGlobalLogout } from "../../services/AuthService";
import CustomModal from "../../components/CustomModal"; // Adjust the path as needed

const AccountScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const menuItems = [
    { icon: "person", label: "Your Profile", screen: "Profile" },
    { icon: "shopping-bag", label: "My Order", screen: "Order" },
    { icon: "pin-drop", label: "Addresses", screen: "address" },
    { icon: "wallet", label: "Wallet", screen: "Wallet" },
    { icon: "policy", label: "Privacy Policy", screen: "privacy" },
    { icon: "gavel", label: "Terms & condition ", screen: "terms" },
    { icon: "restore", label: "Return & refund policy", screen: "return" },
    // { icon: "group-add", label: "Invite Friends", screen: "InviteFriends" },
  ];

  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  const confirmLogout = () => {
    setModalVisible(false);
    handleGlobalLogout();
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  return (
    
  <SafeAreaView className="flex-1  pt-12">
    <View className="flex-1 bg-white px-6 pt-4">
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

      <TouchableOpacity
        className="mt-6 py-3 flex-row items-center justify-center"
        onPress={handleLogoutPress}
      >
        <MaterialIcons name="power-settings-new" size={24} color="red" />
        <Text className="text-red-500 font-semibold ml-2">Log Out</Text>
      </TouchableOpacity>

      <CustomModal
        isVisible={isModalVisible}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        iconName="power-settings-new"
        buttonText="Log Out"
        onCancel={cancelLogout}
        onClose={cancelLogout} 
        onConfirm={confirmLogout}
      />
    </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
