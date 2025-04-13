import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const paymentOptions = [
  { id: "upi", label: "UPI", icon: "qrcode-scan" },
  // { id: "phonepe", label: "PhonePe", icon: "phone" },
  // { id: "gpay", label: "Google Pay", icon: "google" },
  // { id: "wallet", label: "Pay with Wallet", icon: "wallet" },
  { id: "credit", label: "Pay with Credit", icon: "credit-card" },
  { id: "card", label: "Debit / Credit Card", icon: "credit-card-outline" },
  { id: "cod", label: "Cash on Delivery", icon: "cash" },
];

interface Props {
  onSelect: (method: string) => void;
  selectedMethod: string;
}

const PaymentMethodSelector: React.FC<Props> = ({ onSelect, selectedMethod }) => {
  const renderItem = ({ item }: any) => {
    const isSelected = selectedMethod === item.id;
    return (
      <TouchableOpacity
        onPress={() => onSelect(item.id)}
        className={`flex-row items-center justify-between bg-white p-4 mb-3 rounded-xl border ${
          isSelected ? "border-orange-500" : "border-gray-300"
        }`}
      >
        <View className="flex-row items-center">
          <MaterialCommunityIcons name={item.icon} size={24} color="black" />
          <Text className="ml-3 text-base">{item.label}</Text>
        </View>
        {isSelected && (
          <MaterialIcons name="check-circle" size={24} color="orange" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="px-4 mt-4">
      <Text className="text-lg font-semibold mb-4">Choose Payment Method</Text>
      <FlatList
        data={paymentOptions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PaymentMethodSelector;
