import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Alert
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../redux/slices/orderSlice";

const PaymentScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  // Get the data passed from checkout screen
  const { orderData, checkoutSummary } = route.params || {};
  
  // Get order state from Redux
  const { loading: orderLoading, error: orderError } = useSelector(state => state.order || {});

  // Fetch payment methods on component mount
  useEffect(() => {
    fetchPaymentMethods();
    
  }, []);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      // Mock response as in your original code
      const mockResponse = {
        success: true,
        active_methods: [
          {
            code: "CREDIT",
            name: "Credit",
            is_active: true
          },
          {
            code: "PHONEPE",
            name: "PhonePe",
            is_active: true
          },
          {
            code: "COD",
            name: "Cash on Delivery",
            is_active: true
          }
        ]
      };

      if (mockResponse.success) {
        setPaymentMethods(mockResponse.active_methods);
        if (mockResponse.active_methods.length > 0) {
          setSelectedMethod(mockResponse.active_methods[0].code);
        }
      } else {
        Alert.alert("Error", "Failed to load payment methods");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      Alert.alert("Error", "Failed to load payment methods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create order and process payment
  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    setProcessingPayment(true);
    try {
      // Add payment method to order data
      const finalOrderData = {
        ...orderData,
        payment_method: selectedMethod
      };
      
      // Create the order
      console.log("Creating order with data:", finalOrderData);
      const resultAction = await dispatch(createOrder(finalOrderData));
      
      if (createOrder.fulfilled.match(resultAction)) {
        const orderResponse = resultAction.payload;
        console.log("Order created successfully:", orderResponse);
        
        // Handle different payment methods
        const orderId = orderResponse.id || orderResponse._id;
        
        switch (selectedMethod) {
          case "PHONEPE":
            handlePhonePePayment(orderId);
            break;
          case "CREDIT":
            handleWalletPayment(orderId);
            break;
          case "COD":
            handleCODPayment(orderId);
            break;
          default:
            throw new Error("Invalid payment method");
        }
      } else {
        console.error("Order creation failed:", resultAction.error);
        Alert.alert("Error", "Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Payment Failed", "Failed to process payment. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePhonePePayment = (orderId) => {
    // Navigate to confirmation with order details
    navigation.navigate("OrderConfirmation", {
      orderDetails: {
        orderId: orderId,
        addressId: checkoutSummary.addressId,
        totalAmount: checkoutSummary.totalAmount,
        subTotal: checkoutSummary.subTotal,
        deliveryFee: checkoutSummary.deliveryFee,
        discount: checkoutSummary.discount,
        items: checkoutSummary.items,
        paymentMethod: "PhonePe",
        status: "PROCESSING"
      }
    });
  };

  const handleWalletPayment = (orderId) => {
    navigation.navigate("OrderConfirmation", {
      orderDetails: {
        orderId: orderId,
        addressId: checkoutSummary.addressId,
        totalAmount: checkoutSummary.totalAmount,
        subTotal: checkoutSummary.subTotal,
        deliveryFee: checkoutSummary.deliveryFee,
        discount: checkoutSummary.discount,
        items: checkoutSummary.items,
        paymentMethod: "Credit Wallet",
        status: "PAID"
      }
    });
  };

  const handleCODPayment = (orderId) => {
    navigation.navigate("OrderConfirmation", {
      orderDetails: {
        orderId: orderId,
        addressId: checkoutSummary.addressId,
        totalAmount: checkoutSummary.totalAmount,
        subTotal: checkoutSummary.subTotal,
        deliveryFee: checkoutSummary.deliveryFee,
        discount: checkoutSummary.discount,
        items: checkoutSummary.items,
        paymentMethod: "Cash on Delivery",
        status: "CONFIRMED"
      }
    });
  };

  // Helper function to get payment method icon
  const getPaymentIcon = (code) => {
    switch (code) {
      case "PHONEPE":
        return "smartphone";
      case "CREDIT":
        return "account-balance-wallet";
      case "COD":
        return "payments";
      default:
        return "payment";
    }
  };

  return (
    <SafeAreaView className="flex-1 pt-8 bg-white">
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold flex-1 text-center">Payment</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Order Summary */}
        <View className="bg-orange-50 p-4 rounded-lg mb-6">
          <Text className="font-semibold text-lg mb-2">Order Summary</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Sub-total:</Text>
            <Text>₹{checkoutSummary?.subTotal?.toFixed(2) || "0.00"}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Delivery Fee:</Text>
            <Text>₹{checkoutSummary?.deliveryFee?.toFixed(2) || "0.00"}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Discount:</Text>
            <Text className="text-green-600">- ₹{checkoutSummary?.discount?.toFixed(2) || "0.00"}</Text>
          </View>
          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-300">
            <Text className="font-bold">Total Amount:</Text>
            <Text className="font-bold text-lg">₹{checkoutSummary?.totalAmount?.toFixed(2) || "0.00"}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View className="mb-6">
          <Text className="font-semibold text-lg mb-3">Select Payment Method</Text>
          
          {isLoading ? (
            <View className="p-8 items-center justify-center">
              <ActivityIndicator size="large" color="#f97316" />
              <Text className="text-gray-500 mt-2">Loading payment methods...</Text>
            </View>
          ) : paymentMethods.length === 0 ? (
            <View className="p-6 border border-gray-200 rounded-lg items-center">
              <MaterialIcons name="error-outline" size={32} color="#9ca3af" />
              <Text className="mt-2 text-gray-500">No payment methods available</Text>
              <TouchableOpacity 
                className="mt-3 p-2 bg-orange-600 rounded-lg"
                onPress={fetchPaymentMethods}
              >
                <Text className="text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-3">
              {paymentMethods.map(method => (
                <TouchableOpacity 
                  key={method.code}
                  className={`flex-row items-center p-4 border rounded-lg ${selectedMethod === method.code ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}
                  onPress={() => setSelectedMethod(method.code)}
                >
                  <MaterialIcons 
                    name={selectedMethod === method.code ? "radio-button-checked" : "radio-button-unchecked"} 
                    size={20} 
                    color={selectedMethod === method.code ? "#f97316" : "#9ca3af"}
                  />
                  <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center ml-3">
                    <MaterialIcons name={getPaymentIcon(method.code)} size={18} color="#4b5563" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium">{method.name}</Text>
                    {method.code === "CREDIT" && (
                      <Text className="text-xs text-gray-500">Pay using your wallet balance</Text>
                    )}
                    {method.code === "PHONEPE" && (
                      <Text className="text-xs text-gray-500">Fast and secure UPI payments</Text>
                    )}
                    {method.code === "COD" && (
                      <Text className="text-xs text-gray-500">Pay at the time of delivery</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Payment Security Information */}
        <View className="flex-row items-center justify-center mb-6 p-3 bg-gray-50 rounded-lg">
          <MaterialIcons name="lock" size={16} color="#9ca3af" />
          <Text className="text-sm text-gray-500 ml-1">
            All transactions are secure and encrypted
          </Text>
        </View>

        {/* Pay Now Button */}
        <TouchableOpacity
          className={`mt-2 mb-6 py-4 rounded-lg flex-row justify-center items-center ${
            selectedMethod ? 'bg-orange-600' : 'bg-gray-300'
          }`}
          onPress={handlePayment}
          disabled={processingPayment || !selectedMethod || orderLoading}
        >
          {processingPayment || orderLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <MaterialIcons name="payment" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                {selectedMethod === "COD" ? "Place Order" : "Pay Now"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;