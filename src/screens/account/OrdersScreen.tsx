import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ordersData = {
  ongoing: [
    { id: "1", name: "Premium Quality", size: "XL", price: "$70.55", status: "Track Order" },
    { id: "2", name: "Red Blazer", size: "XL", price: "$70.55", status: "Track Order" },
  ],
  completed: [
    { id: "3", name: "Women Sunglasses", size: "XL", price: "$70.55", status: "Delivered" },
    { id: "4", name: "Product Name", size: "XL", price: "$70.55", status: "Delivered" },
  ],
};

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const orders = ordersData[selectedTab];

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-900 text-center">My Orders</Text>

      {/* Tab Navigation */}
      <View className="flex-row justify-around mt-4">
        {["ongoing", "completed"].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`px-4 py-2 rounded-lg ${selectedTab === tab ? "bg-gray-300" : "bg-gray-100"}`}
            onPress={() => setSelectedTab(tab)}
          >
            <Text className="font-semibold capitalize">{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Order List */}
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="p-4 border rounded-lg mt-4 flex-row justify-between items-center">
              <View>
                <Text className="font-bold">{item.name}</Text>
                <Text className="text-gray-500">Size: {item.size}</Text>
                <Text className="font-semibold">{item.price}</Text>
              </View>
              <TouchableOpacity
                className="bg-orange-500 px-3 py-1 rounded-lg"
                onPress={() => selectedTab === "completed" ? navigation.navigate("RefundReturn") : null}
              >
                <Text className="text-white font-semibold">
                  {selectedTab === "completed" ? "Refund/Return" : item.status}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">No {selectedTab === "ongoing" ? "Ongoing" : "Completed"} Orders</Text>
        </View>
      )}
    </View>
  );
};

export default OrdersScreen;
