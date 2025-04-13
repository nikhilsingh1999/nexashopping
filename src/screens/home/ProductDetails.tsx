import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const SIZES = ["10 Watt", "50 Watt", "100 Watt", "500 watt", "550 watt"];
const COLORS = ["#FF0000", "#0000FF", "#000000", "#808080", "#FFD700"];

export default function ProductDetails({ route, navigation }: any) {
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const { product } = route.params;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="relative">
        <Image source={{ uri: product.image }} className="w-full h-96" resizeMode="contain" />
        <TouchableOpacity className="absolute top-4 right-4 p-2 bg-white rounded-full">
          <Icon name="favorite-border" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="text-2xl font-semibold mb-2">{product.name}</Text>
        <View className="flex-row items-center mb-4">
          <Text className="text-2xl font-bold">₹{product.price}</Text>
          {product.originalPrice && (
            <Text className="ml-2 text-gray-500 line-through">${product.originalPrice}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="font-semibold mb-2">Select Option</Text>
          <View className="flex-row flex-wrap gap-2">
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedSize === size ? "bg-orange-600 border-orange-900" : "border-gray-200"
                }`}
              >
                <Text className={`${selectedSize === size ? "text-white" : "text-gray-700"}`}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="font-semibold mb-2">Select Color</Text>
          <View className="flex-row gap-2">
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full ${
                  selectedColor === color ? "border-2 border-orange-600" : "border border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="font-semibold mb-2">Product Details</Text>
          <Text className="text-gray-600 leading-6">
            {product.description ||
              "Made for work or for the weekends, this plain t-shirt can be dressed up or down and gives any outfit the clean look you want. Each top is made from premium cotton that looks good and features short sleeves and a crewneck."}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="font-semibold mb-2">Rating & Reviews</Text>
          <View className="flex-row items-center mb-2">
            <Text className="text-2xl font-bold mr-2">4.8</Text>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="star"
                  size={24}
                  color={star <= 4 ? "#EAB308" : "#E0E0E0"}
                />
              ))}
            </View>
            <Text className="ml-2 text-gray-500">(105 Ratings)</Text>
          </View>
        </View>
      </View>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity className="bg-orange-600 p-4 rounded-lg">
          <Text className="text-white text-center font-semibold">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

