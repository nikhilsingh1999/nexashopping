// import React, { useEffect, useState } from 'react';
// import { Animated, TouchableOpacity, View, Text, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const CARD_WIDTH = 180; // Customize as needed

// const getDiscountPercentage = (original, discounted) => {
//   if (!original || !discounted) return 0;
//   return Math.round(((original - discounted) / original) * 100);
// };

// const ProductCard = ({ product, index, navigation }) => {
//   const isEven = index % 2 === 0;

//   const imageUrl = product.imageUrls?.[0] || 'https://via.placeholder.com/300';
//   const price = product.discountPrice;
//   const originalPrice = product.price;
//   const stock = product.availableStock ?? 0;

//   const [cardAnim] = useState(new Animated.Value(0));

//   useEffect(() => {
//     Animated.timing(cardAnim, {
//       toValue: 1,
//       duration: 400,
//       delay: 150 * index,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   return (
//     <Animated.View
//       style={{
//         opacity: cardAnim,
//         transform: [
//           {
//             scale: cardAnim.interpolate({
//               inputRange: [0, 1],
//               outputRange: [0.9, 1],
//             }),
//           },
//         ],
//       }}
//     >
//       <TouchableOpacity
//         className={`mb-4 ${isEven ? 'mr-4' : ''}`}
//         style={{ width: CARD_WIDTH }}
//         onPress={() => navigation.navigate("ProductDetails", { product })}
//       >
//         <View className="relative">
//           <Image
//             source={{ uri: imageUrl }}
//             className="w-full h-48 rounded-2xl"
//             resizeMode="cover"
//           />
//           <View className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full">
//             <Text className="text-xs font-bold text-amber-500">
//               {getDiscountPercentage(originalPrice, price)}% OFF
//             </Text>
//           </View>

//           {product.isNew && (
//             <View className="absolute top-2 left-2 bg-green-500 px-2 py-1 rounded-full">
//               <Text className="text-xs font-bold text-white">NEW</Text>
//             </View>
//           )}

//           {stock < 20 && stock > 0 && (
//             <View className="absolute bottom-2 left-2 bg-red-500 px-2 py-1 rounded-full">
//               <Text className="text-xs font-bold text-white">LOW STOCK</Text>
//             </View>
//           )}

//           {stock === 0 && (
//             <View className="absolute bottom-2 left-2 bg-gray-600 px-2 py-1 rounded-full">
//               <Text className="text-xs font-bold text-white">OUT OF STOCK</Text>
//             </View>
//           )}
//         </View>

//         <View className="mt-2 px-1">
//           <Text className="font-medium text-base" numberOfLines={1}>
//             {product.name}
//           </Text>
//           <Text className="text-gray-500 text-xs" numberOfLines={2}>
//             {product.shortDescription}
//           </Text>

//           <View className="flex-row items-center mt-1">
//             <Text className="font-bold text-base">₹{price}</Text>
//             <Text className="ml-2 text-gray-400 line-through text-xs">
//               ₹{originalPrice}
//             </Text>
//           </View>

//           <View className="flex-row items-center justify-between mt-1">
//             <View className="flex-row bg-amber-50 px-2 py-1 rounded-full items-center">
//               <Icon name="star" size={12} color="#F59E0B" />
//               <Text className="ml-1 text-xs font-medium">
//                 {product.rating ?? '4.5'}
//               </Text>
//             </View>
//             <Text className="text-gray-500 text-xs">
//               Stock: {stock}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// export default ProductCard;
