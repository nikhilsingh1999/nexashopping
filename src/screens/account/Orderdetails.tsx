import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getOrderById, cancelOrder } from "../../redux/slices/orderSlice";


const Orderdetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  // Add fallback if route.params is undefined
  const orderId = route.params?.orderId;
  const [cancelling, setCancelling] = useState(false);

  // Get Redux state
  const orderState = useSelector((state) => state.orders) || {};
  
  // Safely extract values from order state
  const loading = orderState?.loading || false;
  const error = orderState?.error || null;
  const orderDetails = orderState?.currentOrder || null;

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid Date";
    }
  };

  // Get appropriate status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-500';
    
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'delivered':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle order cancellation
  const handleCancelOrder = () => {
    if (!orderId) {
      Alert.alert("Error", "Order ID is missing");
      return;
    }
    
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              await dispatch(cancelOrder(orderId)).unwrap();
              Alert.alert("Success", "Order cancelled successfully");
              // Refresh order details to show updated status
              dispatch(getOrderById(orderId));
            } catch (err) {
              Alert.alert("Error", err?.message || "Failed to cancel order");
            } finally {
              setCancelling(false);
            }
          }
        }
      ]
    );
  };

  // Calculate order summary
  const calculateSummary = () => {
    if (!orderDetails) return { subtotal: 0, tax: 0, total: 0, itemCount: 0 };
    
    const items = orderDetails.items || [];
    
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item?.price_at_purchase || 0);
      const quantity = item?.quantity || 0;
      return sum + (price * quantity);
    }, 0);
    
    const tax = parseFloat(orderDetails?.tax_amount || 0);
    const total = parseFloat(orderDetails?.total_amount || 0);
    const itemCount = items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
    
    return { subtotal, tax, total, itemCount };
  };

  const { subtotal, tax, total, itemCount } = calculateSummary();

  if (loading && !orderDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-4 text-gray-500">Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <MaterialIcons name="error-outline" size={60} color="#ef4444" />
        <Text className="mt-4 text-gray-800 text-lg font-medium">Oops! Something went wrong</Text>
        <Text className="mt-2 text-gray-500 text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-6 bg-orange-600 py-2 px-4 rounded-lg"
          onPress={() => orderId && dispatch(getOrderById(orderId))}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <MaterialIcons name="inbox" size={60} color="#d1d5db" />
        <Text className="mt-4 text-gray-500">Order not found</Text>
        <TouchableOpacity 
          className="mt-6 bg-orange-600 py-2 px-4 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 pt-8 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 p-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Order Details</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Order Summary Card */}
        <View className="bg-white m-4 rounded-lg shadow-sm overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-medium text-lg text-gray-800">Order #{" ORD-ID-15224-455 "}</Text>
              <View className={`py-1 px-3 rounded-full ${getStatusColor(orderDetails?.status)}`}>
                <Text className="text-white text-xs font-medium capitalize">{orderDetails?.status || 'Unknown'}</Text>
              </View>
            </View>
            <Text className="text-gray-500">Placed on {formatDate(orderDetails?.created_at)}</Text>
          </View>
          
          {/* Payment Status */}
          <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <MaterialIcons 
                name={(orderDetails?.payment_status || '').toLowerCase() === 'paid' ? "payment" : "money-off"} 
                size={20} 
                color={(orderDetails?.payment_status || '').toLowerCase() === 'paid' ? "#16a34a" : "#dc2626"} 
              />
              <Text className="ml-2 font-medium">Payment Status</Text>
            </View>
            <Text className={`font-medium ${
              (orderDetails?.payment_status || '').toLowerCase() === 'paid' ? "text-green-600" : "text-red-600"
            }`}>
              {orderDetails?.payment_status || 'Unknown'}
            </Text>
          </View>

          {/* Order Items */}
          <View className="p-4">
            <Text className="font-medium text-gray-800 mb-3">Items ({itemCount})</Text>
            {(orderDetails?.items || []).map((item, index) => (
              <View key={item?.id || index} className={`flex-row mb-4 ${
                index < (orderDetails?.items?.length || 0) - 1 ? "border-b border-gray-100 pb-4" : ""
              }`}>
                <Image 
                  source={{ uri: item?.image_url?.[0] }} 
                  className="w-20 h-20 rounded-md bg-gray-100"
                  defaultSource={require('../../assets/logo2.png')}
                />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-800" numberOfLines={2}>{item?.name || 'Product'}</Text>
                  <View className="flex-row justify-between mt-1">
                    <Text className="text-gray-500">₹{parseFloat(item?.price_at_purchase || 0).toFixed(2)} x {item?.quantity || 0}</Text>
                    <Text className="font-medium">₹{(parseFloat(item?.price_at_purchase || 0) * (item?.quantity || 0)).toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Shipping Address */}
        <View className="bg-white m-4 mt-0 rounded-lg shadow-sm overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <MaterialIcons name="location-on" size={20} color="#f97316" />
              <Text className="font-medium text-gray-800 ml-1">Shipping Address</Text>
            </View>
          </View>
          <View className="p-4">
            <Text className="text-gray-700 mb-1">{orderDetails?.shipping_address?.address_line1 || 'N/A'}</Text>
            {orderDetails?.shipping_address?.address_line2 && (
              <Text className="text-gray-700 mb-1">{orderDetails.shipping_address.address_line2}</Text>
            )}
            <Text className="text-gray-700 mb-1">
              {orderDetails?.shipping_address?.city || 'N/A'}, {orderDetails?.shipping_address?.state || 'N/A'} {orderDetails?.shipping_address?.zip_code || 'N/A'}
            </Text>
            <Text className="text-gray-700">{orderDetails?.shipping_address?.country || 'N/A'}</Text>
          </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white m-4 mt-0 rounded-lg shadow-sm overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="font-medium text-gray-800">Payment Summary</Text>
          </View>
          <View className="p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Subtotal</Text>
              <Text className="text-gray-600">₹{subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tax</Text>
              <Text className="text-gray-600">₹{tax.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between pt-3 border-t border-gray-100 mt-2">
              <Text className="font-medium text-lg">Total</Text>
              <Text className="font-bold text-lg">₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Order Status History */}
        <View className="bg-white m-4 mt-0 rounded-lg shadow-sm overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="font-medium text-gray-800">Status History</Text>
          </View>
          <View className="p-4">
            {(orderDetails?.status_history || []).map((statusItem, index) => (
              <View key={statusItem?.id || index} className={`flex-row ${
                index < (orderDetails?.status_history?.length || 0) - 1 ? "mb-4" : ""
              }`}>
                <View className="mr-3 items-center">
                  <View className={`w-3 h-3 rounded-full ${getStatusColor(statusItem?.status)}`} />
                  {index < (orderDetails?.status_history?.length || 0) - 1 && (
                    <View className="w-0.5 h-10 bg-gray-200 mt-1" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-medium capitalize text-gray-800">{statusItem?.status || 'Unknown'}</Text>
                  <Text className="text-gray-500 text-sm">{formatDate(statusItem?.changed_at)}</Text>
                  {statusItem?.notes && (
                    <Text className="text-gray-600 mt-1">{statusItem.notes}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="m-4 mb-8">
          {(orderDetails?.status || '').toLowerCase() === 'pending' && (
            <TouchableOpacity 
              className="bg-red-600 py-3 rounded-lg flex-row justify-center items-center"
              onPress={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="cancel" size={20} color="#fff" />
                  <Text className="ml-2 text-white font-medium">Cancel Order</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {(orderDetails?.status || '').toLowerCase() === 'delivered' && (
            <TouchableOpacity 
              className="bg-indigo-600 py-3 rounded-lg flex-row justify-center items-center"
              onPress={() => navigation.navigate("RefundReturn", { orderId: orderDetails?.id })}
            >
              <MaterialIcons name="assignment-return" size={20} color="#fff" />
              <Text className="ml-2 text-white font-medium">Request Return/Refund</Text>
            </TouchableOpacity>
          )}

          {(orderDetails?.status || '').toLowerCase() !== 'cancelled' && (
            <TouchableOpacity 
              className="mt-3 border border-orange-600 py-3 rounded-lg flex-row justify-center items-center"
              onPress={() => navigation.navigate("Home")}
            >
              <MaterialIcons name="shopping-cart" size={20} color="#f97316" />
              <Text className="ml-2 text-orange-600 font-medium">Continue Shopping</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Orderdetails;