import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { fetchOrders } from "../../redux/slices/orderSlice";

const OrdersScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Get Redux state with debug logging
  const orderState = useSelector((state) => {
    console.log("Redux Order State:", state.orders);
    return state.orders;
  });

  // Safely extract values from order state
  const orders = orderState?.orders || [];
  const loading = orderState?.loading || false;
  const error = orderState?.error || null;

  // Debug log for orders
  useEffect(() => {
    console.log("Orders state updated:", {
      ordersArray: Array.isArray(orders),
      ordersLength: orders?.length,
      firstOrder: orders?.[0]
    });
  }, [orders]);

  // Load orders on component mount
  useEffect(() => {
    console.log("Dispatching fetchOrders...");
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewOrderDetails = (orderId) => {
    navigation.navigate("OrderDetails", { orderId });
  };

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    console.log("Refreshing orders...");
    await dispatch(fetchOrders());
    setRefreshing(false);
  };

  // Make sure orders is always treated as an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filter orders based on selected tab
  const getFilteredOrders = () => {
    console.log("Filtering orders for tab:", selectedTab);
    console.log("Available orders:", safeOrders.length);

    if (selectedTab === "all") {
      return safeOrders;
    }

    return safeOrders.filter(order => {
      const status = order?.status?.toLowerCase();
      const match = status === selectedTab;
      return match;
    });
  };

  const filteredOrders = getFilteredOrders();
  console.log("Filtered orders count:", filteredOrders.length);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return "Invalid Date";
    }
  };

  // Get appropriate status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-500';

    switch (status.toLowerCase()) {
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

  // Get payment status icon
  const getPaymentIcon = (paymentStatus) => {
    if (!paymentStatus) return <MaterialIcons name="help" size={20} color="#9ca3af" />;

    switch (paymentStatus.toLowerCase()) {
      case 'paid':
        return <MaterialIcons name="payment" size={20} color="#16a34a" />;
      case 'unpaid':
        return <MaterialIcons name="money-off" size={20} color="#dc2626" />;
      default:
        return <MaterialIcons name="help" size={20} color="#9ca3af" />;
    }
  };

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-16">
      <MaterialIcons name="shopping-bag" size={80} color="#d1d5db" />
      <Text className="mt-4 text-gray-500 text-lg">No orders found</Text>
      {selectedTab !== "all" && (
        <Text className="text-gray-400 text-base text-center mt-2">
          Try switching to a different category or place a new order
        </Text>
      )}
      <TouchableOpacity
        className="mt-6 bg-orange-600 py-3 px-6 rounded-lg"
        onPress={() => navigation.navigate("Home")}
      >
        <Text className="text-white font-medium">Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderItem = ({ item }) => {
    // Safety check for item
    if (!item || !item.id) {
      console.warn("Invalid order item:", item);
      return null;
    }

    return (
      <TouchableOpacity
        className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden border border-gray-100"
        onPress={() => navigation.navigate("OrderDetails", { orderId: item.id })}
      >
        <View className="p-4">
          {/* Header with Order ID and Date */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <MaterialIcons name="receipt" size={18} color="#f97316" />
              <Text className="font-medium ml-1 text-gray-700" numberOfLines={1}>
                Order #{item.id ? item.id.slice(0, 8) : "N/A"}...
              </Text>
            </View>
            <Text className="text-gray-500 text-sm">
              {formatDate(item.created_at)}
            </Text>
          </View>

          {/* Order Summary */}
          <View className="mt-3 flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center">
                <MaterialIcons name="shopping-cart" size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-1">
                  Items: {item.item_count || 0} ({item.total_items || 0} units)
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                {getPaymentIcon(item.payment_status)}
                <Text className={`ml-1 ${item.payment_status?.toLowerCase() === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.payment_status || "Unknown"}
                </Text>
              </View>
            </View>
            <View>
              <Text className="font-bold text-lg">₹{parseFloat(item.total_amount || 0).toFixed(2)}</Text>
              <View className={`mt-1 py-1 px-3 rounded-full ${getStatusColor(item.status)}`}>
                <Text className="text-white text-xs font-medium capitalize">{item.status || "Unknown"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer with action buttons */}
        <View className="flex-row border-t border-gray-100">
          <TouchableOpacity
            className="flex-1 py-3 flex-row justify-center items-center"
            onPress={(e) => {
              e.stopPropagation();
              handleViewOrderDetails(item.id);
            }}
          >
            <MaterialIcons name="visibility" size={18} color="#f97316" />
            <Text className="text-orange-600 font-medium ml-1">View Details</Text>
          </TouchableOpacity>

          {item.status?.toLowerCase() === 'pending' && (
            <View className="w-px bg-gray-200" />
          )}

          {item.status?.toLowerCase() === 'pending' && (
            <TouchableOpacity
              className="flex-1 py-3 flex-row justify-center items-center"
              onPress={(e) => {
                e.stopPropagation();
                // Implement track order functionality
                navigation.navigate("TrackOrder", { orderId: item.id });
              }}
            >
              <MaterialIcons name="local-shipping" size={18} color="#4f46e5" />
              <Text className="text-indigo-600 font-medium ml-1">Track Order</Text>
            </TouchableOpacity>
          )}

          {item.status?.toLowerCase() === 'delivered' && (
            <View className="w-px bg-gray-200" />
          )}

          {item.status?.toLowerCase() === 'delivered' && (
            <TouchableOpacity
              className="flex-1 py-3 flex-row justify-center items-center"
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate("RefundReturn", { orderId: item.id });
              }}
            >
              <MaterialIcons name="assignment-return" size={18} color="#f43f5e" />
              <Text className="text-pink-600 font-medium ml-1">Return/Refund</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 pt-6 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">My Orders</Text>
      </View>

      {/* Order Status Tabs */}
      <View className="bg-white">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {["all", "pending", "processing", "delivered", "cancelled"].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-5 py-2 mx-1 rounded-full ${selectedTab === tab
                  ? "bg-orange-600"
                  : "bg-gray-100"
                }`}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                className={`font-medium capitalize ${selectedTab === tab
                    ? "text-white"
                    : "text-gray-700"
                  }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Order List */}
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="mt-4 text-gray-500">Loading your orders...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <MaterialIcons name="error-outline" size={60} color="#ef4444" />
          <Text className="mt-4 text-gray-800 text-lg font-medium">Oops! Something went wrong</Text>
          <Text className="mt-2 text-gray-500 text-center">{error}</Text>
          <TouchableOpacity
            className="mt-6 bg-orange-600 py-2 px-4 rounded-lg"
            onPress={() => dispatch(fetchOrders())}
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#f97316"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;