import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomModal from "../../components/CustomModal";
import { useNavigation } from "@react-navigation/native";

const CheckoutScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const navigation = useNavigation();

  const renderPaymentInputs = () => {
    switch (selectedPaymentMethod) {
      case "card":
        return (
          <View className="mt-3">
            <TextInput
              placeholder="Card Number"
              keyboardType="numeric"
              className="border border-gray-300 p-2 rounded-md mb-2"
            />
            <TextInput
              placeholder="Expiry Date (MM/YY)"
              className="border border-gray-300 p-2 rounded-md mb-2"
            />
            <TextInput
              placeholder="CVV"
              secureTextEntry
              className="border border-gray-300 p-2 rounded-md"
            />
          </View>
        );
      case "upi":
        return (
          <TextInput
            placeholder="Enter UPI ID"
            className="border border-gray-300 p-2 rounded-md mt-3"
          />
        );
      case "wallet":
        return (
          <Text className="text-gray-500 mt-3">Wallet balance will be used at checkout.</Text>
        );
      case "cash":
        return (
          <Text className="text-gray-500 mt-3">You’ll pay with cash upon delivery.</Text>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4 pt-12">
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
            <Text className="text-gray-500">
              925 S Chugach St #APT 10, Alaska 99645
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Address")}>
            <Text className="text-blue-500 font-semibold">Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Method */}
      <View className="mt-5">
        <Text className="text-lg font-semibold">Payment Method</Text>
        <View className="flex-row gap-2 mt-2 flex-wrap">
          {[
            { key: "card", label: "Card", icon: "credit-card" },
            { key: "upi", label: "UPI", icon: "account-balance-wallet" },
            { key: "wallet", label: "Wallet", icon: "account-balance" },
            { key: "cash", label: "Cash", icon: "money" },
          ].map((method) => (
            <TouchableOpacity
              key={method.key}
              className={`px-4 py-2 rounded-lg flex-row items-center mb-2 ${
                selectedPaymentMethod === method.key
                  ? "bg-orange-600"
                  : "border border-gray-400"
              }`}
              onPress={() => setSelectedPaymentMethod(method.key)}
            >
              <MaterialIcons
                name={method.icon}
                size={18}
                color={selectedPaymentMethod === method.key ? "white" : "black"}
              />
              <Text
                className={`ml-1 ${
                  selectedPaymentMethod === method.key
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Input Fields */}
        {renderPaymentInputs()}
      </View>

      {/* Order Summary */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Order Summary</Text>
        <View className="mt-3 space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Sub-total</Text>
            <Text className="text-gray-700">$170.75</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Delivery Fee</Text>
            <Text className="text-gray-700">$20.00</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Discount</Text>
            <Text className="text-green-600">- $10.00</Text>
          </View>
          <View className="border-t border-gray-300 pt-2 flex-row justify-between">
            <Text className="font-bold text-lg">Total</Text>
            <Text className="font-bold text-lg">$180.75</Text>
          </View>
        </View>
      </View>

      {/* Promo Code */}
      <View className="flex-row items-center mt-6 border border-gray-300 rounded-lg p-2">
        <TextInput placeholder="Enter promo code" className="flex-1" />
        <TouchableOpacity className="bg-orange-600 px-4 py-2 rounded-lg flex-row items-center ml-2">
          <MaterialIcons name="add" size={20} color="white" />
          <Text className="text-white ml-1">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Place Order */}
      <TouchableOpacity
        className="mt-6 bg-orange-600 py-3 rounded-lg flex-row justify-center items-center"
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialIcons name="shopping-cart" size={24} color="white" />
        <Text className="text-white font-semibold text-lg ml-2">
          Place Order
        </Text>
      </TouchableOpacity>

      {/* Success Modal */}
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
