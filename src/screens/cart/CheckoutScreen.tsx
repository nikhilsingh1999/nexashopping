import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomModal from "../../components/CustomModal";
import { useNavigation } from "@react-navigation/native";

const CheckoutScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <TouchableOpacity>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Checkout</Text>
        <TouchableOpacity>
          <MaterialIcons name="notifications-none" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Delivery Address */}
      <View className="mt-5">
        <Text className="text-lg font-semibold">Delivery Address</Text>
        <View className="flex-row items-center justify-between mt-2 p-3 border border-gray-300 rounded-lg">
          <View>
            <Text className="font-semibold">Home</Text>
            <Text className="text-gray-500">925 S Chugach St #APT 10, Alaska 99645</Text>
          </View>
          <TouchableOpacity onPress={()=> navigation.navigate("Address")}>
            <Text className="text-blue-500 font-semibold">Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Method */}
      <View className="mt-5">
        <Text className="text-lg font-semibold">Payment Method</Text>
        <View className="flex-row gap-2 mt-2">
          <TouchableOpacity className="px-4 py-2 bg-orange-600 rounded-lg flex-row items-center">
            <MaterialIcons name="credit-card" size={18} color="white" />
            <Text className="text-white ml-1">Card</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 py-2 border border-gray-400 rounded-lg flex-row items-center">
            <MaterialIcons name="money" size={18} color="black" />
            <Text className="ml-1">Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-4 py-2 border border-gray-400 rounded-lg flex-row items-center">
            <MaterialIcons name="account-balance-wallet" size={18} color="black" />
            <Text className="ml-1">Apple Pay</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg mt-2">
          <Text className="font-semibold">VISA **** **** **** 2512</Text>
          <TouchableOpacity>
            <MaterialIcons name="edit" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Summary */}
      <View className="mt-5">
        <Text className="text-lg font-semibold">Order Summary</Text>
        <View className="mt-2">
          <Text className="flex-row justify-between">
            <Text>Sub-total</Text> <Text>$170.75</Text>
          </Text>
          <Text className="flex-row justify-between">
            <Text>Delivery Fee</Text> <Text>$20.00</Text>
          </Text>
          <Text className="flex-row justify-between">
            <Text>Discount</Text> <Text>-$10</Text>
          </Text>
          <Text className="flex-row justify-between font-bold mt-2">
            <Text>Total</Text> <Text>$180.99</Text>
          </Text>
        </View>
      </View>

      {/* Promo Code */}
      <View className="flex-row items-center mt-4 border border-gray-300 rounded-lg p-2">
        <TextInput placeholder="Enter promo code" className="flex-1" />
        <TouchableOpacity className="bg-orange-600 px-4 py-2 rounded-lg flex-row items-center">
          <MaterialIcons name="add" size={20} color="white" />
          <Text className="text-white ml-1">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        className="mt-5 bg-orange-600 py-3 rounded-lg flex-row justify-center items-center"
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="shopping-cart" size={24} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">Place Order</Text>
      </TouchableOpacity>

      {/* Reusable Success Modal */}
      <CustomModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Congratulations!"
        message="Your order has been placed."
        iconName="check-circle"
        buttonText="Track Your Order"
      />
    </ScrollView>
  );
};

export default CheckoutScreen;
