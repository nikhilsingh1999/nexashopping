import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {  useRoute } from "@react-navigation/native";

export default function CategoryScreen() {
  const route = useRoute();
  const { categoryName } = route.params;

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Text className="text-xl font-semibold mb-2">{categoryName}</Text>
      <Text className="text-gray-600 text-center">
        Right now we don't have any products in this category.{"\n"}We're sorry, products are coming soon.
      </Text>
    </View>
  );
}
