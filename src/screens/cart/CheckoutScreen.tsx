import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from '../../redux/hooks';
import { fetchAddresses } from '../../redux/slices/addressSlice';
import { useSelector } from 'react-redux';
import { showMessage } from "../../services/AuthService";
import { useRoute } from "@react-navigation/native";
// import { createOrder } from "../../redux/slices/orderSlice"; // You'll need to create this slice
import { createOrder } from "../../redux/slices/orderSlice";

const CheckoutScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const route = useRoute();
  const { checkoutData } = route.params || {};
  const { cartItems = [], summary = {} } = checkoutData || {};

  // Get addresses from Redux store
  const { addresses, loading, error } = useSelector(state => state.address);
  
  // Get order state from Redux if you implement it
  const { loading: orderLoading, error: orderError } = useSelector(state => state.order || {});

  // Fetch addresses on component mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  // Format cart items for API request
  const formatOrderItems = () => {
    return cartItems.map(item => {
      if (!item.productId) return null;
      
      return {
        product_id: item.productId._id,
        quantity: item.quantity,
        price_at_purchase: item.productId.discountPrice || 0
      };
    }).filter(Boolean); // Filter out any null items
  };

  // Handle create order and proceed to payment
  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      Alert.alert("Error", "Please select a delivery address");
      return;
    }
  
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }
  
    setIsLoading(true);
    try {
      // Prepare order data for API
      const orderData = {
        total_amount: summary.total,
        tax_amount: 10, // Calculate tax if needed
        address_id: selectedAddress,
        items: formatOrderItems(),
      };
      
      // Dispatch create order action
      console.log("Creating order with data:", orderData);
      const resultAction = await dispatch(createOrder(orderData));
      
      // Add logs to check the returned data
      console.log("Order action result:", resultAction);
      
      // Check if the action was fulfilled (success)
      if (createOrder.fulfilled.match(resultAction)) {
        const orderResponse = resultAction.payload;
        console.log("Order created successfully:", orderResponse);
        
        // Navigate to payment screen with the order details from API
        navigation.navigate("PaymentScreen", {
          orderDetails: {
            orderId: orderResponse.id || orderResponse._id,
            addressId: selectedAddress,
            totalAmount: summary.total,
            subTotal: summary.subtotal,
            deliveryFee: summary.deliveryFee,
            discount: summary.discount,
            items: cartItems,
            status: orderResponse.status || "PENDING",
            promoCode: promoCode
          }
        });
      } else {
        // If the action was rejected
        console.error("Order creation failed:", resultAction.error);
        Alert.alert("Error", "Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Exception when creating order:", error);
      Alert.alert("Error", "Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Handle promo code application
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      Alert.alert("Error", "Please enter a promo code");
      return;
    }
    
    // Here you would typically validate the promo code with your backend
    // For now, just show a message
    Alert.alert("Success", `Promo code ${promoCode} applied successfully!`);
  };

  return (
    <SafeAreaView className="flex-1 pt-8 bg-white">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center justify-center mb-4">
          <Text className="text-xl font-semibold">Checkout</Text>
        </View>

        {/* Step 1: Delivery Address */}
        <View className="mt-2">
          <View className="flex-row items-center">
            <View className="bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center">
              <Text className="text-white font-bold">1</Text>
            </View>
            <Text className="text-lg font-semibold ml-2">Select Delivery Address</Text>
          </View>
          
          {loading ? (
            <View className="p-4 flex items-center justify-center">
              <ActivityIndicator size="small" color="#f97316" />
              <Text className="mt-2 text-gray-500">Loading addresses...</Text>
            </View>
          ) : error ? (
            <View className="p-4 mt-3 border border-red-200 bg-red-50 rounded-lg">
              <Text className="text-red-600">{error}</Text>
              <TouchableOpacity 
                className="mt-2 flex-row items-center" 
                onPress={() => dispatch(fetchAddresses())}
              >
                <MaterialIcons name="refresh" size={16} color="#f97316" />
                <Text className="text-orange-600 ml-1">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : addresses.length === 0 ? (
            <View className="p-4 mt-3 border border-gray-200 rounded-lg items-center justify-center">
              <MaterialIcons name="location-off" size={40} color="#9ca3af" />
              <Text className="mt-2 text-gray-500">No addresses found</Text>
              <TouchableOpacity 
                className="mt-3 p-2 bg-orange-600 rounded-lg flex-row items-center"
                onPress={() => navigation.navigate("AddressScreen")}
              >
                <MaterialIcons name="add" size={16} color="white" />
                <Text className="text-white ml-1">Add New Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {addresses.map(address => (
                <TouchableOpacity 
                  key={address.id}
                  className={`mt-3 p-3 border rounded-lg ${selectedAddress === address.id ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}
                  onPress={() => setSelectedAddress(address.id)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <MaterialIcons 
                        name={selectedAddress === address.id ? "radio-button-checked" : "radio-button-unchecked"} 
                        size={20} 
                        color={selectedAddress === address.id ? "#f97316" : "#9ca3af"}
                      />
                      <View className="ml-2">
                        <Text className="font-semibold">{address.address_line1}</Text>
                        <Text className="text-gray-500">{address.address_line2}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                className="mt-3 p-3 border border-dashed border-gray-300 rounded-lg flex-row items-center justify-center"
                onPress={() => navigation.navigate("AddressScreen")}
              >
                <MaterialIcons name="add" size={20} color="#f97316" />
                <Text className="text-orange-600 font-semibold ml-1">Add New Address</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Order Summary */}
        <View className="mt-6">
          <View className="flex-row items-center">
            <View className="bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center">
              <Text className="text-white font-bold">2</Text>
            </View>
            <Text className="text-lg font-semibold ml-2">Order Summary</Text>
          </View>
          
          <View className="mt-3 p-4 border border-gray-200 rounded-lg">
            {/* Item list from cart data */}
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => {
                if (!item.productId) return null;
                
                const product = item.productId;
                const itemTotal = (product.discountPrice || 0) * item.quantity;
                
                return (
                  <View 
                    key={`${product._id}-${index}`} 
                    className="flex-row justify-between items-center py-3 border-b border-gray-100"
                  >
                    <View className="flex-row items-center flex-1">
                      <Image 
                        source={{ uri: product.imageUrls?.[0] }} 
                        className="w-12 h-12 bg-gray-100 rounded-md mr-3"
                        defaultSource={require('../../assets/logo2.png')}
                      />
                      <View className="flex-1">
                        <Text className="font-medium" numberOfLines={1}>{product.name}</Text>
                        <Text className="text-gray-500 text-sm">
                          {item.quantity} x ₹{product.discountPrice?.toFixed(2) || '0.00'}
                        </Text>
                      </View>
                    </View>
                    <Text className="ml-2">₹{itemTotal.toFixed(2)}</Text>
                  </View>
                );
              })
            ) : (
              <View className="py-4 items-center">
                <Text className="text-gray-500">No items in cart</Text>
              </View>
            )}
            
            {/* Cost breakdown from summary */}
            <View className="mt-4 space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-700">Sub-total</Text>
                <Text className="text-gray-700">₹{summary.subtotal?.toFixed(2) || '0.00'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">Delivery Fee</Text>
                <Text className="text-gray-700">₹{summary.deliveryFee?.toFixed(2) || '0.00'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">Discount</Text>
                <Text className="text-green-600">- ₹{summary.discount?.toFixed(2) || '0.00'}</Text>
              </View>
              <View className="border-t border-gray-300 pt-2 flex-row justify-between">
                <Text className="font-bold text-lg">Total</Text>
                <Text className="font-bold text-lg">₹{summary.total?.toFixed(2) || '0.00'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Promo Code */}
        <View className="flex-row items-center mt-6 border border-gray-300 rounded-lg p-2">
          <TextInput 
            placeholder="Enter promo code" 
            className="flex-1"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity 
            className="bg-orange-600 px-4 py-2 rounded-lg flex-row items-center ml-2"
            onPress={handleApplyPromoCode}
          >
            <MaterialIcons name="local-offer" size={16} color="white" />
            <Text className="text-white ml-1">Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Order Button */}
        <TouchableOpacity
          className="mt-6 mb-6 bg-orange-600 py-4 rounded-lg flex-row justify-center items-center"
          onPress={handleCreateOrder}
          disabled={isLoading || !cartItems || cartItems.length === 0 || orderLoading}
        >
          {isLoading || orderLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text className="text-white font-semibold text-lg">
                Confirm Order
              </Text>
              <MaterialIcons name="arrow-forward" size={24} color="white" className="ml-1" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;