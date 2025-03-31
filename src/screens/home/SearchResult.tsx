import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const sampleProducts = [
  { id: 1, name: 'Fitbit Versa 4', price: 40, oldPrice: 60, rating: 4.8, img: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Apple Watch SE (2nd Gen)', price: 40, oldPrice: 60, rating: 4.8, img: 'https://via.placeholder.com/100' },
  { id: 3, name: 'Garmin Vivoactive 5', price: 40, oldPrice: 60, rating: 4.8, img: 'https://via.placeholder.com/100' },
  { id: 4, name: 'AGPTEK Smart Watch', price: 40, oldPrice: 60, rating: 4.8, img: 'https://via.placeholder.com/100' },
];

export default function SearchResult() {
  const route = useRoute();
  const { query } = route.params;

  const filteredProducts = sampleProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-bold">{query}</Text>
      <Text className="text-gray-500 mb-4">{filteredProducts.length} Items</Text>

      <ScrollView>
        <View className="flex-row flex-wrap justify-between">
          {filteredProducts.map((item) => (
            <TouchableOpacity key={item.id} className="w-[48%] bg-gray-100 p-3 rounded-xl mb-4">
              <Image source={{ uri: item.img }} className="w-full h-32 rounded-lg" />
              <Text className="text-gray-800 font-bold mt-2">{item.name}</Text>
              <Text className="text-gray-600">
                ${item.price} <Text className="line-through">${item.oldPrice}</Text>
              </Text>
              <Text className="text-yellow-500">⭐ {item.rating} (120)</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
