import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { orderDetails } = route.params;
  const {
    orderId,
    totalAmount,
    subTotal,
    deliveryFee,
    discount,
    items,
    paymentMethod,
    status
  } = orderDetails;

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Success header */}
        <View className="items-center justify-center py-8 bg-orange-500">
          <MaterialIcons name="check-circle" size={64} color="white" />
          <Text className="mt-4 text-2xl font-bold text-white">Order Confirmed!</Text>
          <Text className="mt-2 text-white text-center px-6">
            Your order #{orderId} has been placed successfully.
          </Text>
        </View>

        {/* Order status */}
        <View className="px-4 py-6 bg-orange-50">
          <Text className="text-lg font-bold text-gray-800">Order Status: {status}</Text>
          <Text className="text-sm text-gray-600 mt-1">
            We'll notify you when your order ships.
          </Text>
        </View>

        {/* Order details */}
        <View className="px-4 py-5">
          <Text className="text-lg font-bold text-gray-800 mb-4">Order Details</Text>
          
          <View className="flex-row items-center py-3 border-b border-gray-200">
            <MaterialIcons name="inventory" size={24} color="#f97316" />
            <View className="ml-3">
              <Text className="text-gray-500">Order Number</Text>
              <Text className="font-bold text-gray-800">#{orderId}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center py-3 border-b border-gray-200">
            <MaterialIcons name="payment" size={24} color="#f97316" />
            <View className="ml-3">
              <Text className="text-gray-500">Payment Method</Text>
              <Text className="font-bold text-gray-800">{paymentMethod}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center py-3 border-b border-gray-200">
            <MaterialIcons name="local-shipping" size={24} color="#f97316" />
            <View className="ml-3">
              <Text className="text-gray-500">Estimated Delivery</Text>
              <Text className="font-bold text-gray-800">3-5 business days</Text>
            </View>
          </View>
          
          <View className="flex-row items-center py-3">
            <MaterialIcons name="location-on" size={24} color="#f97316" />
            <View className="ml-3">
              <Text className="text-gray-500">Shipping Address</Text>
              <Text className="font-bold text-gray-800">Address ID: {orderDetails.addressId}</Text>
            </View>
          </View>
        </View>

        {/* Order items */}
        <View className="px-4 py-5 bg-gray-50">
          <Text className="text-lg font-bold text-gray-800 mb-4">Order Items</Text>
          
          {items && items.map((item, index) => (
            <View key={index} className="flex-row items-center py-3 border-b border-gray-200">
              <View className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                {item.image ? (
                  <Image source={{ uri: item.image }} className="w-full h-full" />
                ) : (
                  <View className="w-full h-full bg-orange-200 items-center justify-center">
                    <Text className="text-orange-500 font-bold">{item.name?.charAt(0) || 'P'}</Text>
                  </View>
                )}
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-bold text-gray-800">{item.name}</Text>
                <Text className="text-gray-500">Qty: {item.quantity}</Text>
              </View>
              <Text className="font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Price details */}
        <View className="px-4 py-5">
          <Text className="text-lg font-bold text-gray-800 mb-4">Price Details</Text>
          
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-800">{formatCurrency(subTotal)}</Text>
          </View>
          
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Delivery Fee</Text>
            <Text className="text-gray-800">{formatCurrency(deliveryFee)}</Text>
          </View>
          
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Discount</Text>
            <Text className="text-green-600">-{formatCurrency(discount)}</Text>
          </View>
          
          <View className="flex-row justify-between py-3 mt-2 border-t border-gray-200">
            <Text className="font-bold text-lg text-gray-800">Total</Text>
            <Text className="font-bold text-lg text-orange-600">{formatCurrency(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue shopping button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity 
          className="bg-orange-500 py-4 rounded-md items-center"
          onPress={() => navigation.navigate('Home')}
        >
          <Text className="text-white font-bold text-lg">Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderConfirmationScreen;