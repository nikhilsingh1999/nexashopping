import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <View className="flex-row p-4 border-b border-gray-200">
    <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg" resizeMode="cover" />
    <View className="flex-1 ml-4">
      <Text className="font-medium">{item.name}</Text>
      <Text className="text-gray-500 mb-2">Size: {item.size}</Text>
      <Text className="font-semibold">₹{item.price}</Text>
    </View>
    <View className="items-end justify-between">
      <TouchableOpacity className="p-2" onPress={() => onRemove(item.id)}>
        <Icon name="delete" size={18} color="red" />
      </TouchableOpacity>
      <View className="flex-row items-center">
        <TouchableOpacity className="p-1" onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}>
          <Icon name="remove" size={18} />
        </TouchableOpacity>
        <Text className="mx-2 min-w-[20px] text-center">{item.quantity}</Text>
        <TouchableOpacity className="p-1" onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}>
          <Icon name="add" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function CartScreen() {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bluetooth Headphone",
      size: "XL",
      price: 40.5,
      quantity: 1,
      image: "https://example.com/headphone.jpg",
    },
    {
      id: 2,
      name: "Summer Dress",
      size: "XL",
      price: 100.99,
      quantity: 2,
      image: "https://example.com/dress.jpg",
    },
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryFee = 20.0;
  const discount = 10;
  const total = subtotal + deliveryFee - discount;

  if (cartItems.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-20 h-20 mb-4">
          <Icon name="shopping-cart" size={80} color="gray" />
        </View>
        <Text className="text-xl font-semibold mb-2">Your Cart Is Empty!</Text>
        <Text className="text-gray-500 text-center">When you add products, they'll appear here.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black pt-12">
    <View className="flex-1 bg-white pt-4">
      <Text className="text-2xl font-bold text-gray-900 text-center">Cart</Text>
      <ScrollView className="mt-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
        ))}
      </ScrollView>

      <View className=" p-4 border-t border-gray-200">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Sub-total</Text>
          <Text className="font-medium">₹{subtotal.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Delivery Fee</Text>
          <Text className="font-medium">₹{deliveryFee.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-500">Discount</Text>
          <Text className="font-medium text-green-500">-₹{discount.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="font-semibold">Total</Text>
          <Text className="font-semibold">₹{total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Checkout")} className="bg-orange-600 p-4 rounded-lg">
          <Text className="text-white text-center font-semibold">Go To Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

