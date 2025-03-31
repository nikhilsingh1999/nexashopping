import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const categories = [
  { id: 1, name: "Fashion", icon: "👕" },
  { id: 2, name: "Fitness", icon: "💪" },
  { id: 3, name: "Living", icon: "🏠" },
  { id: 5, name: "Stationery", icon: "📚" },
  { id: 6, name: "Fashion", icon: "👕" },
  { id: 7, name: "Stationery", icon: "📚" },
  { id: 8, name: "Games", icon: "🎮" },
  { id: 9, name: "Stationery", icon: "📚" },
];

const products = [
  { id: 1, name: "Portable Neck Fan", price: 40, originalPrice: 60, rating: 4.8, reviews: 120, image: "https://example.com/fan.jpg" },
  { id: 2, name: "Refurbished Echo Dot", price: 40, originalPrice: 60, rating: 4.8, reviews: 120, image: "https://example.com/echo.jpg" },
  { id: 3, name: "Smart LED Bulb", price: 25, originalPrice: 40, rating: 4.5, reviews: 200, image: "https://example.com/bulb.jpg" },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim().length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 flex-row items-center justify-between">
        <View>
          <Text className="text-gray-500">Location</Text>
          <Text className="font-semibold">Tikamgarh , India</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Icon name="notifications" size={24} className="text-gray-700" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-4 flex-row items-center bg-gray-100 p-3 rounded-lg">
        <Icon name="search" size={20} className="text-gray-400 mr-2" />
        <TextInput
          placeholder="Find your favorite items"
          value={searchText}
          onChangeText={handleSearch}
          className="flex-1 text-gray-700"
        />
      </View>

      {/* Categories */}
      <View className="mb-4">
        <View className="px-4 flex-row justify-between items-center">
          <Text className="font-semibold text-lg">Categories</Text>
          <TouchableOpacity>
            <Text className="text-blue-600">View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 px-4">
          {categories.map((category) => (
            <TouchableOpacity key={category.id} className="mr-6 items-center">
              <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-1">
                <Text className="text-2xl">{category.icon}</Text>
              </View>
              <Text className="text-sm">{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Banner */}
      <View className="mb-4 px-4">
        <Image source={{ uri: "https://example.com/banner.jpg" }} className="w-full h-40 rounded-lg" resizeMode="cover" />
      </View>

      {/* Search Results / Hot Deals */}
      <View>
        <View className="px-4 mb-3">
          <Text className="font-semibold text-lg">
            {searchText.length > 0 ? "Search Results" : "Hot Deals"}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="mr-4 w-40"
                onPress={() => navigation.navigate("ProductDetails", { product })}
              >
                <Image source={{ uri: product.image }} className="w-full h-40 rounded-lg mb-2" resizeMode="cover" />
                <Text className="font-medium">{product.name}</Text>
                <View className="flex-row items-center mt-1">
                  <Text className="font-semibold">${product.price}</Text>
                  <Text className="ml-2 text-gray-500 line-through">${product.originalPrice}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Text className="text-yellow-500">★</Text>
                  <Text className="ml-1">{product.rating}</Text>
                  <Text className="text-gray-500 ml-1">({product.reviews})</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-gray-500 px-4">No results found</Text>
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
