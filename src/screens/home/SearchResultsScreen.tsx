import React, { useState, useLayoutEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

const products = [
  { id: 1, name: "BIG LED bulb", price: 400, originalPrice: 600, rating: 4.8, reviews: 120, image: "https://iili.io/37eGE9R.jpg" },
  { id: 2, name: "Smart LED bulb", price: 400, originalPrice: 600, rating: 4.8, reviews: 120, image: "https://iili.io/37eGGup.webp" },
  { id: 3, name: "Smart LED Bulb", price: 250, originalPrice: 400, rating: 4.5, reviews: 200, image: "https://iili.io/37eG08v.webp" },
  { id: 4, name: "LED 12W Bulb", price: 250, originalPrice: 400, rating: 4.5, reviews: 200, image: "https://iili.io/37eGcFa.webp" },
  { id: 5, name: "Smart LED Bulb", price: 250, originalPrice: 400, rating: 4.5, reviews: 200, image: "https://iili.io/37eGE9R.jpg" },
];

export default function SearchResultsScreen() {
  const route = useRoute();
  const { query } = route.params;
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState(query);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: { display: "flex" },
      });
    };
  }, [navigation]);

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-4">
      {/* Search Bar */}
     
      <View className="px-4 mb-4 flex-row items-center bg-gray-100 p-3 rounded-lg">
              <Icon name="search" size={20} className="text-gray-400 mr-2" />
              <TextInput
                placeholder="Find your favorite items"
                value={searchText}
                // onSubmitEditing={onSearchSubmit}
                onChangeText={setSearchText}
                className="flex-1 text-gray-700"
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
              onPress={() => navigation.navigate("ProductDetails", { product })}
            >
              <Image
                source={{ uri: product.image }}
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
  );
}
