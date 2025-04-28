import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks"; // adjust path as per your structure
import { addToCart } from "../../redux/slices/cartSlice"; // adjust path as needed
import { showMessage } from "../../services/AuthService";
import { RootState } from "../../redux/store"; // adjust path as needed

export default function ProductDetails({ route, navigation }: any) {
  const { productId } = route.params;
  const screenWidth = Dimensions.get("window").width;
  const products = useSelector((state: RootState) => state.products.items);
  const product = products.find((p) => p._id == productId);
  
  // Initialize selected attributes state
  const [selectedAttributes, setSelectedAttributes] = useState<{[key: string]: any}>({});

  const dispatch = useAppDispatch();

  // Set initial values for attributes when product loads
  React.useEffect(() => {
    if (product?.attributes) {
      const initialAttributes: {[key: string]: any} = {};
      
      // Set first option as default for each attribute type
      if (product.attributes.wattage && Array.isArray(product.attributes.wattage) && product.attributes.wattage.length > 0) {
        initialAttributes.wattage = product.attributes.wattage[0];
      }
      
      if (product.attributes.color && Array.isArray(product.attributes.color) && product.attributes.color.length > 0) {
        initialAttributes.color = product.attributes.color[0];
      }
      
      if (product.attributes.size && Array.isArray(product.attributes.size) && product.attributes.size.length > 0) {
        initialAttributes.size = product.attributes.size[0];
      }
      
      setSelectedAttributes(initialAttributes);
    }
  }, [product]);

  const handleSelectAttribute = (type: string, value: any) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleAddToCart = async () => {
    try {
      console.log("Adding to cart:", product._id, "with attributes:", selectedAttributes);
      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
          attributes: selectedAttributes // Pass selected attributes to cart
        })
      ).unwrap();
      showMessage("Product added to cart successfully!");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      Alert.alert("Error", err?.message || "Failed to add to cart");
    }
  };

  // Helper function to render attribute options
  const renderAttributeOptions = (type: string, options: any[], displayName: string) => {
    if (!options || !Array.isArray(options) || options.length === 0) return null;
    
    return (
      <View className="mb-6">
        <Text className="font-semibold mb-2">Select {displayName}</Text>
        <View className="flex-row flex-wrap gap-2">
          {options.map((option) => (
            <TouchableOpacity
              key={`${type}-${option}`}
              onPress={() => handleSelectAttribute(type, option)}
              className={`px-4 py-2 rounded-lg border ${
                selectedAttributes[type] === option ? "bg-orange-600 border-orange-900" : "border-gray-200"
              }`}
            >
              <Text 
                className={selectedAttributes[type] === option ? "text-white" : "text-gray-700"}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Render color options differently
  const renderColorOptions = (colors: string[]) => {
    if (!colors || !Array.isArray(colors) || colors.length === 0) return null;
    
    return (
      <View className="mb-6">
        <Text className="font-semibold mb-2">Select Color</Text>
        <View className="flex-row gap-2">
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => handleSelectAttribute("color", color)}
              className={`w-8 h-8 rounded-full ${
                selectedAttributes.color === color ? "border-2 border-orange-600" : "border border-gray-200"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </View>
      </View>
    );
  };

  if (!product) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 mt-11">
      <ScrollView className="flex-1 bg-white">
        <View className="relative">
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {product?.imageUrls?.map((url: string, index: number) => (
              <Image
                key={index}
                source={{ uri: url }}
                className="h-96"
                style={{ width: screenWidth }}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          <TouchableOpacity className="absolute top-4 right-4 p-2 bg-white rounded-full z-10">
            <Icon name="favorite-border" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <View className="p-4">
          <Text className="text-2xl font-semibold mb-2">{product?.name}</Text>
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl font-bold">₹{product?.price}</Text>
            {product?.originalPrice && (
              <Text className="ml-2 text-gray-500 line-through">
                ₹{product?.originalPrice}
              </Text>
            )}
          </View>

          {/* Conditionally render wattage options */}
          {product?.attributes?.wattage && Array.isArray(product.attributes.wattage) && 
            renderAttributeOptions("wattage", product.attributes.wattage, "Wattage")}

          {/* Conditionally render color options */}
          {product?.attributes?.color && Array.isArray(product.attributes.color) && 
            renderColorOptions(product.attributes.color)}

          {/* Conditionally render size options */}
          {product?.attributes?.size && Array.isArray(product.attributes.size) && 
            renderAttributeOptions("size", product.attributes.size, "Size")}

          <View className="mb-6">
            <Text className="font-semibold mb-2">Product Details</Text>
            <Text className="text-gray-600 leading-6">
              {product?.description ||
                "Made for work or for the weekends, this plain t-shirt can be dressed up or down and gives any outfit the clean look you want..."}
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
          {product?.availableStock === 0 ? (
            <View className="bg-gray-300 p-4 rounded-lg">
              <Text className="text-white text-center font-semibold">Out of Stock</Text>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-orange-600 p-4 rounded-lg"
              onPress={handleAddToCart}
            >
              <Text className="text-white text-center font-semibold">Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}