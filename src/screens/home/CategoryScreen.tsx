import  React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { fetchProducts } from "../../redux/slices/productSlice";
import { useNavigation } from "@react-navigation/native";

export default function CategoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName } = route.params;
  const dispatch = useAppDispatch();
  
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);

  const handleNavigateToProduct = (productId) => {
    navigation.navigate("ProductDetails", { productId });
  };
  
  // Fetch products if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, []);

  // Filter products by category ID
  console.log("Category ID:", categoryId);
  const filteredProducts = products.filter(product => product.category === categoryId);
  console.log("Filtered Products:", filteredProducts);

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
      style={{ width: '48%' }}
      onPress={() => {
        // Navigate to the product detail screen
        handleNavigateToProduct(item._id);
      }}
    >
      <Image 
        source={{ uri: item?.imageUrls?.[0] || "https://via.placeholder.com/150" }} 
        className="w-full h-36"
        resizeMode="contain"
      />
      <View className="p-2">
        <Text className="text-base font-medium" numberOfLines={1}>{item?.name}</Text>
        <Text className="text-orange-600 mb-1">₹{item?.price.toFixed(2)}</Text>
        <Text className="text-gray-500 text-xs" numberOfLines={2}>{item?.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
  <SafeAreaView className="flex-1 pt-10">  
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-xl font-semibold">{categoryName}</Text>
      </View>

      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item?.id?.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 8 }}
          contentContainerStyle={{ padding: 8 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-gray-600 text-center">
            No products found in this category.{"\n"}We're sorry, products are coming soon.
          </Text>
          {products.length === 0 && (
            <TouchableOpacity 
              className="bg-blue-500 py-2 px-4 rounded-lg mt-4"
              onPress={() => dispatch(fetchProducts())}
            >
              <Text className="text-white font-medium">Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  </SafeAreaView>
  );
}