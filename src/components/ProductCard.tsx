// import React, { useState, useEffect } from 'react';
// import { Animated, TouchableOpacity, View, Text, Image , Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// // import { width } from '../constants'; // adjust your width import

// const ProductCard = ({ product, index, navigation, isHotDeal = false }) => {
//   const [cardAnim] = useState(new Animated.Value(0));
  
//   const { width } = Dimensions.get('window'); // Get the device width

//   useEffect(() => {
//     if (!isHotDeal) {   // Only animate normal product cards
//       Animated.timing(cardAnim, {
//         toValue: 1,
//         duration: 3000,
//         delay: 100 * index,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, []);

//   const imageUrl = product.imageUrls?.[0] || "https://via.placeholder.com/300";
//   const discount = getDiscountPercentage(product.price, product.discountPrice);

//   const animatedStyle = isHotDeal
//     ? {} // No animation for hot deals inside card
//     : {
//         opacity: cardAnim,
//         transform: [
//           {
//             scale: cardAnim.interpolate({
//               inputRange: [0, 1],
//               outputRange: [0.95, 1],
//             }),
//           },
//         ],
//       };

//   return (
//     <Animated.View style={animatedStyle}>
//       <TouchableOpacity
//         style={{
//           width: isHotDeal ? width * 0.9 : CARD_WIDTH,
//           marginBottom: 16,
//           marginRight: isHotDeal ? 0 : (index % 2 === 0 ? 12 : 0),
//         }}
//         onPress={() => handleNavigateToProduct(product._id)}
//       >
//         <View className={`relative ${isHotDeal ? 'flex-row bg-orange-50 p-2 rounded-2xl' : ''}`}>
//           <Image
//             source={{ uri: imageUrl }}
//             className={`${isHotDeal ? 'w-1/3 h-32' : 'w-full h-48'} rounded-2xl`}
//             resizeMode="cover"
//           />

//           {isHotDeal ? (
//             <View className="p-3 flex-1">
//               <View className="flex-row justify-between items-start">
//                 <Text className="font-medium text-base" numberOfLines={2}>
//                   {product.name}
//                 </Text>
//                 <View className="bg-amber-500 px-2 py-1 rounded-full">
//                   <Text className="text-xs font-bold text-white">
//                     {discount}% OFF
//                   </Text>
//                 </View>
//               </View>

//               <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
//                 {product.description || "High-quality lighting product for your home"}
//               </Text>

//               <View className="flex-row items-center mt-2">
//                 <Text className="font-bold text-base">₹{product.discountprice}</Text>
//                 <Text className="ml-2 text-gray-400 line-through text-xs">
//                   ₹{product.price}
//                 </Text>
//               </View>

//               <View className="flex-row items-center justify-between mt-2">
//                 <View className="flex-row bg-amber-50 px-2 py-1 rounded-full items-center">
//                   <Icon name="star" size={12} color="#F59E0B" />
//                   <Text className="ml-1 text-xs font-medium">{product.rating || "4.5"}</Text>
//                 </View>

//                 <TouchableOpacity
//                   className="bg-amber-500 px-3 py-1 rounded-full"
//                   onPress={() => handleNavigateToProduct(product._id)}
//                 >
//                   <Text className="text-white text-xs font-medium">Buy Now</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           ) : (
//             <>
//               <View className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full">
//                 <Text className="text-xs font-bold text-amber-500">
//                   {discount}% OFF
//                 </Text>
//               </View>

//               {product.isNew && (
//                 <View className="absolute top-2 left-2 bg-green-500 px-2 py-1 rounded-full">
//                   <Text className="text-xs font-bold text-white">NEW</Text>
//                 </View>
//               )}

//               {product.stock < 20 && (
//                 <View className="absolute bottom-2 left-2 bg-red-500 px-2 py-1 rounded-full">
//                   <Text className="text-xs font-bold text-white">LOW STOCK</Text>
//                 </View>
//               )}

//               <View className="mt-2 px-1">
//                 <Text className="font-medium text-base" numberOfLines={1}>
//                   {product.name}
//                 </Text>
//                 <Text className="text-gray-500 text-xs" numberOfLines={1}>
//                   {product.description || "High-quality lighting product"}
//                 </Text>

//                 <View className="flex-row items-center mt-1">
//                   <Text className="font-bold text-base">₹{product.price}</Text>
//                   <Text className="ml-2 text-gray-400 line-through text-xs">
//                     ₹{product.originalPrice}
//                   </Text>
//                 </View>

//                 <View className="flex-row items-center justify-between mt-1">
//                   <View className="flex-row bg-amber-50 px-2 py-1 rounded-full items-center">
//                     <Icon name="star" size={12} color="#F59E0B" />
//                     <Text className="ml-1 text-xs font-medium">{product.rating || "4.5"}</Text>
//                   </View>
//                   <Text className="text-gray-500 text-xs">Stock: {product.stock || "50+"}</Text>
//                 </View>
//               </View>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// export default ProductCard;
