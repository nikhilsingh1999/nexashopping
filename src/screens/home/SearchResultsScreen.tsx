import React, { useState, useLayoutEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function SearchResultsScreen() {
  // Get products directly from Redux state
  const products = useSelector((state) => state.products.items);
  const route = useRoute();
  const { query } = route.params;
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState(query || "");

  // Make sure tab bar is visible
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: "flex" },
    });

    return () => {
      // No need to do anything on cleanup
    };
  }, [navigation]);

  // Handle search input changes
  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  // Filter products based on search text
  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 pt-12  bg-white">
      <ScrollView className="flex-1 px-4 ">
        {/* Search Bar */}
        <View className="px-4 mb-4 flex-row items-center bg-gray-100 p-3 rounded-lg">
          <Icon name="search" size={20} className="text-gray-400 mr-2" />
          <TextInput
            placeholder="Find your favorite items"
            value={searchText}
            onChangeText={handleSearchChange}
            className="flex-1 text-gray-700"
            autoFocus={false}
            clearButtonMode="while-editing"
            editable={true}
          />
        </View>

        {filtered.length === 0 ? (
          <Text className="text-gray-600 text-center mt-20">
            We don't have anything like this.
          </Text>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {filtered.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="w-[48%] bg-gray-100 mb-4 rounded-xl p-2"
                onPress={() => navigation.navigate("ProductDetails", { productId: product._id })}
              >
                <Image
                  source={{ uri: product.imageUrls[0] || "https://via.placeholder.com/150" }}
                  resizeMode="contain"
                  className="w-full h-28 rounded-lg mb-2"
                />
                <Text className="font-semibold text-sm text-center mb-1">{product.name}</Text>
                <Text className="text-gray-700 text-center text-sm">₹{product.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}