import React, { useState, useEffect, useRef , useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Dimensions,
  Animated,
  FlatList,
  ActivityIndicator,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";
import axios from "axios";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.42;
const BANNER_WIDTH = width;

// Banner carousel data
const banners = [
  { id: 1, image: "https://iili.io/378xbSt.jpg", title: "Smart Lighting Sale" },
  { id: 2, image: "https://iili.io/378xDlI.webp", title: "Energy Efficient Solutions" },
  { id: 3, image: "https://iili.io/378xtKN.jpg", title: "New Collection Arrived" },
  { id: 4, image: "https://iili.io/378xbSt.jpg", title: "Special Discount Week" },
];

// Default icon mapping - will use these if we don't have a specific icon for a category
const defaultIcons = {
  "Electronics": "devices",
  "Fashion": "checkroom",
  "Home & Furniture": "chair",
  "Grocery & Essentials": "local-grocery-store",
  "Beauty & Personal Care": "spa",
  "Sports & Fitness": "fitness-center",
  "Books & Stationery": "menu-book",
  "Automobiles & Accessories": "directions-car",
  // Default fallback
  "default": "category"
};

// Customer reviews
const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://iili.io/37eGE9R.jpg",
    rating: 5,
    comment: "The smart bulbs are amazing! They've completely transformed my living room atmosphere.",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://iili.io/37eGGup.webp",
    rating: 4,
    comment: "Great products and fast delivery. The motion sensor works perfectly in my hallway.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Priya Sharma",
    avatar: "https://iili.io/37eG08v.webp",
    rating: 5,
    comment: "Energy efficient and easy to install. Highly recommend the RGB bulbs!",
    date: "2 weeks ago"
  }
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const scrollY = new Animated.Value(0);
  const flatListRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));

  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.items);
  const { loading, error } = useSelector((state: RootState) => state.products);

  const handleNavigateToProduct = (productId) => {
    navigation.navigate("ProductDetails", { productId });
  };

  // Deal countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45
  });

  // trim text 
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };


  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("https://nexa-shopping-user-service.onrender.com/api/v1/base/categories");
        console.log("API Response for categories:", response.data);
        if (response.data && response.data.success && response.data.category) {
          setCategories(response.data.category);
          // Set the first category as active by default
          if (response.data.category.length > 0) {
            setActiveCategory(response.data.category[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, []);

  // Auto scroll banner carousel
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      if (currentBannerIndex < banners.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentBannerIndex + 1,
          animated: true
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true
        });
      }
    }, 3000);

    return () => clearInterval(bannerInterval);
  }, [currentBannerIndex]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Search functionality
  // const handleSearch = (text) => {
  //   setSearchText(text);
  
  //   if (!text || text.trim().length <= 1) {
  //     setSearchResults([]);
  //     return;
  //   }
  
  //   setIsSearching(true);
  
  //   const filteredProducts = products.filter(product =>
  //     product.name.toLowerCase().includes(text.toLowerCase()) ||
  //     (product.description && product.description.toLowerCase().includes(text.toLowerCase()))
  //   );
  
  //   setSearchResults(filteredProducts);
  
  //   setTimeout(() => {
  //     setIsSearching(false);
  //   }, 300);
  // };
  
  

  // const onSearchSubmit = () => {
  //   if (searchText.trim().length > 0) {
  //     // Navigate to search results screen with the filtered results
  //     navigation.navigate("SearchResultsScreen", {
  //       query: searchText,
  //       results: searchResults
  //     });
  //     setShowSearchModal(false);
  //   }
  // };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const onSearchSubmit = () => {
    if (searchText.trim().length > 0) {
      navigation.navigate("SearchResultsScreen", { query: searchText });
    }
  };

  // Get icon for category based on name
  const getCategoryIcon = (categoryName) => {
    return defaultIcons[categoryName] || defaultIcons.default;
  };

  // Featured product - first product marked as featured
  const featuredProduct = useMemo(() => {
    if (products.length > 0) {
      return products[Math.floor(Math.random() * products.length)];
    }
    return null;
  }, [products]);
  

  // New arrivals
  const newArrivals = products.length > 0
    ? products.slice(0, 5)
    : [];

  // Calculate discount percentage
  const getDiscountPercentage = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };
  
 
  
  // console.log(products)
  // Hot deals - filter products with at least 15% discount
  const hotDeals = useMemo(() => {
    if (products.length > 0) {
      return products
        .filter(product => getDiscountPercentage(product?.price, product?.discountPrice) >= 15)
        .slice(0, 6);
    }
    return [];
  }, [products]);
  

    console.log("Hot Deals:", hotDeals);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Banner carousel item
  const renderBannerItem = ({ item, index }) => (
    <TouchableOpacity className="relative">
      <Image
        source={{ uri: item.image }}
        style={{ width: BANNER_WIDTH, height: 180 }}
        className="rounded-xl"
        resizeMode="contain"
      />
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 rounded-b-xl">
        <Text className="text-white font-bold text-lg">{item.title}</Text>
        <Text className="text-white/80 text-xs">Tap to explore special offers</Text>
      </View>
    </TouchableOpacity>
  );

  // Banner pagination indicator
  const renderPaginationDots = () => {
    return (
      <View className="flex-row justify-center items-center mt-2">
        {banners.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${currentBannerIndex === index ? 'bg-amber-500 w-4' : 'bg-gray-300'
              }`}
          />
        ))}
      </View>
    );
  };

  const CategoryItem = ({ category, isActive, onPress }) => (
    <TouchableOpacity
      onPress={() => {
        onPress();
        navigation.navigate("CategoryScreen", {
          categoryId: category._id,
          categoryName: category.name
        });
      }}
      className="items-center mb-4 w-1/4"
    >
      <View className={`w-16 h-16 rounded-2xl items-center justify-center mb-2 ${isActive ? 'bg-amber-500' : 'bg-gray-100'}`}>
        <Icon name={getCategoryIcon(category.name)} size={28} color={isActive ? "#ffffff" : "#666666"} />
      </View>
      <Text className={`text-sm text-center ${isActive ? 'font-bold' : 'font-normal'}`} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  // const ProductCard = ({ product, index, navigation, isHotDeal = false }) => {
  //   const [cardAnim] = useState(new Animated.Value(0));

  //   useEffect(() => {
  //     Animated.timing(cardAnim, {
  //       toValue: 1,
  //       duration: 1000,
  //       delay: 100 * index, // smoother delay
  //       useNativeDriver: true,
  //     }).start();
  //   }, []);

  //   const imageUrl = product.imageUrls?.[0] || "https://via.placeholder.com/300";
  //   const discount = getDiscountPercentage(product.price, product.discountPrice);

  //   return (
  //     <Animated.View
  //       style={{
  //         opacity: cardAnim,
  //         transform: [
  //           {
  //             scale: cardAnim.interpolate({
  //               inputRange: [0, 1],
  //               outputRange: [0.95, 1],
  //             }),
  //           },
  //         ],
  //       }}
  //     >
  //       <TouchableOpacity
  //         style={{
  //           width: isHotDeal ? width * 0.9 : CARD_WIDTH,
  //           marginBottom: 16,
  //           marginRight: isHotDeal ? 0 : (index % 2 === 0 ? 12 : 0)
  //         }}
  //         onPress={() => {
  //           handleNavigateToProduct(product._id);
  //         }}
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
  //                 <Text className="font-bold text-base">₹{product.discountPrice}</Text>
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

  const ReviewCard = ({ review }) => (
    <View className="bg-white mr-4 p-4 rounded-xl shadow-sm border border-gray-100" style={{ width: width * 0.75 }}>
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: review.avatar }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-2">
          <Text className="font-medium">{review.name}</Text>
          <Text className="text-gray-500 text-xs">{review.date}</Text>
        </View>
      </View>

      <View className="flex-row mb-2">
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name="star"
            size={14}
            color={i < review.rating ? "#F59E0B" : "#E5E7EB"}
          />
        ))}
      </View>

      <Text className="text-gray-700 text-sm">{review.comment}</Text>
    </View>
  );

  const DealOfTheDay = () => (
    <View className="mx-4 mb-6 bg-orange-400 p-4 rounded-2xl">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white font-bold text-lg">Deal of the Day</Text>
        <View className="bg-white/20 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">ENDS IN</Text>
        </View>
      </View>

      <View className="flex-row justify-center mb-3">
        <View className="bg-white/20 px-3 py-2 rounded-lg mx-1">
          <Text className="text-white font-bold text-xl">{String(timeLeft.hours).padStart(2, '0')}</Text>
          <Text className="text-white/70 text-xs text-center">Hours</Text>
        </View>
        <Text className="text-white self-center font-bold text-xl">:</Text>
        <View className="bg-white/20 px-3 py-2 rounded-lg mx-1">
          <Text className="text-white font-bold text-xl">{String(timeLeft.minutes).padStart(2, '0')}</Text>
          <Text className="text-white/70 text-xs text-center">Mins</Text>
        </View>
        <Text className="text-white self-center font-bold text-xl">:</Text>
        <View className="bg-white/20 px-3 py-2 rounded-lg mx-1">
          <Text className="text-white font-bold text-xl">{String(timeLeft.seconds).padStart(2, '0')}</Text>
          <Text className="text-white/70 text-xs text-center">Secs</Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-white py-3 rounded-xl flex-row justify-center items-center"
        onPress={() => navigation.navigate("SpecialOffer")}
      >
        <Text className="font-bold text-indigo-600 mr-2">Shop Now</Text>
        <Icon name="arrow-forward" size={16} color="#4F46E5" />
      </TouchableOpacity>
    </View>
  );

  const StatsBar = () => (
    <View className="flex-row justify-between mx-4 mb-6 bg-gray-50 p-3 rounded-xl">
      <View className="items-center">
        <Text className="font-bold text-base text-amber-500">{formatNumber(10000)}+</Text>
        <Text className="text-xs text-gray-500">Products</Text>
      </View>
      <View className="h-full w-px bg-gray-200" />
      <View className="items-center">
        <Text className="font-bold text-base text-amber-500">{formatNumber(5000)}+</Text>
        <Text className="text-xs text-gray-500">Customers</Text>
      </View>
      <View className="h-full w-px bg-gray-200" />
      <View className="items-center">
        <Text className="font-bold text-base text-amber-500">{formatNumber(15000)}+</Text>
        <Text className="text-xs text-gray-500">Orders</Text>
      </View>
    </View>
  );

  // Trending section component
  const TrendingSection = () => (
    <View className="mb-6">
      <View className="px-4 flex-row justify-between items-center mb-4">
        <Text className="font-bold text-lg">Trending Now</Text>
        <TouchableOpacity>
          <Text className="text-amber-500 font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 flex-row">
        <View className="flex-1 mr-2">
          <TouchableOpacity
            className="bg-blue-100 rounded-2xl p-3 items-center justify-center mb-2"
            style={{ height: 120 }}
            onPress={() => navigation.navigate("CategoryScreen", { categoryName: "Smart Lighting" })}
          >
            <Icon name="lightbulb" size={36} color="#3B82F6" />
            <Text className="font-medium mt-2 text-blue-800">Smart Lighting</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-purple-100 rounded-2xl p-3 items-center justify-center"
            style={{ height: 80 }}
            onPress={() => navigation.navigate("CategoryScreen", { categoryName: "Security" })}
          >
            <Text className="font-medium text-purple-800">Security Cameras</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 ml-2">
          <TouchableOpacity
            className="bg-green-100 rounded-2xl p-3 items-center justify-center mb-2"
            style={{ height: 80 }}
            onPress={() => navigation.navigate("CategoryScreen", { categoryName: "Energy Saving" })}
          >
            <Text className="font-medium text-green-800">Energy Saving</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-amber-100 rounded-2xl p-3 items-center justify-center"
            style={{ height: 120 }}
            onPress={() => navigation.navigate("CategoryScreen", { categoryName: "Decorative Lighting" })}
          >
            <Icon name="emoji-objects" size={36} color="#F59E0B" />
            <Text className="font-medium mt-2 text-amber-800">Decorative Lights</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white pt-12">
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header with logo and icons */}
        <View className="px-4 pb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={require("../../../src/assets/logopng22.png")}
              className="w-28 h-10"
              resizeMode="contain"
            />
          </View>

          <View className="flex-row">
            <TouchableOpacity className="mr-4" onPress={() => navigation.navigate("Cart")}>
              <View className="relative">
                <Icon name="shopping-cart" size={24} color="#333" />
                <View className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <View className="relative">
                <Icon name="notifications" size={24} color="#333" />
                <View className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-4 h-4 items-center justify-center">
                  <Text className="text-white text-xs font-bold">3</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome message */}
        <View className="px-4 mb-4">
          <Text className="text-2xl font-bold">Find your perfect light</Text>
          <Text className="text-gray-500">Brighten your space with our collection</Text>
        </View>

        {/* Search Bar */}
          <View className="px-4 mb-6">
              <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl">
                <Icon name="search" size={20} color="#666" />
                <TextInput
                  placeholder="Search for bulbs, lamps and more..."
                  placeholderTextColor="#999"
                  value={searchText}
                  onSubmitEditing={onSearchSubmit}
                  onChangeText={handleSearch}
                  className="flex-1 ml-2 text-base"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText("")}>
                    <Icon name="close" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

        {/* Banner Carousel */}
        <View className="mb-6">
          <View className="px-4">
            <FlatList
              ref={flatListRef}
              data={banners}
              renderItem={renderBannerItem}
              keyExtractor={item => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const slideIndex = Math.floor(
                  event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
                );
                setCurrentBannerIndex(slideIndex);
              }}
            />
            {renderPaginationDots()}
          </View>
        </View>

        {/* Stats Bar */}
        <StatsBar />

        {/* Trending Section (New) */}
        <TrendingSection />

        {/* Categories Grid */}
        <View className="mb-6">
          <View className="px-4 mb-4">
            <Text className="font-bold text-lg">Categories</Text>
          </View>

          {loadingCategories ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="large" color="#F59E0B" />
            </View>
          ) : (
            <View className="px-4 flex-row flex-wrap">
              {categories.map((category) => (
                <CategoryItem
                  key={category._id}
                  category={category}
                  isActive={activeCategory === category._id}
                  onPress={() => setActiveCategory(category._id)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Deal of the Day */}
        <DealOfTheDay />

        {/* Featured Product */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <Text className="font-bold text-lg">Featured Product</Text>
          </View>

          {featuredProduct ? (
            <TouchableOpacity
              className="mx-4 mb-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl overflow-hidden"
              onPress={() => {
                handleNavigateToProduct(featuredProduct._id);
              }}
            >
              <View className="flex-row">
                <Image
                  source={{ uri: featuredProduct.imageUrls?.[0] || "https://via.placeholder.com/150" }}
                  className="w-1/2 h-40"
                  resizeMode="contain"
                />
                <View className="p-4 flex-1 justify-center">
                  <View className="bg-amber-500 self-start px-2 py-1 rounded-full mb-2">
                    <Text className="text-white text-xs font-bold">FEATURED</Text>
                  </View>
                  <Text className="font-bold text-base">{truncateText(featuredProduct.name, 15)}</Text>
                  <Text className="text-gray-500 text-xs mb-1">
                    {truncateText(featuredProduct.shortDescription || "High-quality lighting solution for your home", 50)}
                  </Text>

                  <View className="flex-row items-center">
                    <Text className="font-bold text-base">₹{featuredProduct.price}</Text>
                    <Text className="ml-2 text-gray-400 line-through text-xs">₹{featuredProduct.originalPrice}</Text>
                  </View>

                  <TouchableOpacity
                    className="bg-amber-500 mt-2 px-3 py-1 self-start rounded-full"
                    onPress={() => handleNavigateToProduct(featuredProduct._id)}
                  >
                    <Text className="text-white text-xs font-medium">Buy Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View className="items-center justify-center">
              <ActivityIndicator size="large" color="#F59E0B" />
            </View>
          )}
        </View>

        {/* Hot Deals Section - Redesigned
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Icon name="local-fire-department" size={24} color="#F59E0B" />
              <Text className="font-bold text-lg ml-2">Hot Deals</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-amber-500 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          {hotDeals.length > 0 ? (
            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
              className="px-4"
            >
              {hotDeals.map((product, index) => (
                <ProductCard
                  key={product._id || index}
                  product={product}
                  index={index}
                  navigation={navigation}
                  isHotDeal={true}
                />
              ))}
            </ScrollView>
          ) : (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="large" color="#F59E0B" />
            </View>
          )}
        </View> */}

        {/* New Arrivals */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Icon name="fiber-new" size={24} color="#10B981" />
              <Text className="font-bold text-lg ml-2">New Arrivals</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-amber-500 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {newArrivals.map((product, index) => (
              <View key={product.id || index} style={{ width: width * 0.4 }} className="mr-4">
                <TouchableOpacity
                  onPress={() => handleNavigateToProduct(product._id)}
                  className="relative"
                >
                  <Image
                    source={{ uri: product.imageUrls?.[0] || "https://via.placeholder.com/300" }}
                    className="w-full h-48 rounded-2xl"
                    resizeMode="cover"
                  />
                  <View className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded-full">
                    <Text className="text-xs font-bold text-white">NEW</Text>
                  </View>
                </TouchableOpacity>

                <View className="mt-2">
                  <Text className="font-medium" numberOfLines={1}>{product.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="font-bold">₹{product.price}</Text>
                    <Text className="ml-2 text-gray-400 line-through text-xs">₹{product.originalPrice}</Text>
                  </View>

                  <View className="mt-1">
                    <TouchableOpacity
                      className="bg-gray-100 py-1 rounded-full flex-row justify-center items-center"
                      onPress={() => {
                        // Add to cart functionality
                        // For now, just navigate to product
                        handleNavigateToProduct(product._id);
                      }}
                    >
                      <Icon name="add-shopping-cart" size={14} color="#333" />
                      <Text className="text-xs ml-1">Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Customer Reviews */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Icon name="rate-review" size={24} color="#8B5CF6" />
              <Text className="font-bold text-lg ml-2">Customer Reviews</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-amber-500 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </ScrollView>
        </View>

        {/* Recently Viewed */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Icon name="history" size={24} color="#6B7280" />
              <Text className="font-bold text-lg ml-2">Recently Viewed</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-amber-500 font-medium">Clear</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {products.slice(3, 8).map((product, index) => (
              <View key={product.id || index} style={{ width: width * 0.3 }} className="mr-4">
                <TouchableOpacity
                  onPress={() => handleNavigateToProduct(product._id)}
                  className="relative"
                >
                  <Image
                    source={{ uri: product.imageUrls?.[0] || "https://via.placeholder.com/300" }}
                    className="w-full h-32 rounded-xl"
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <View className="mt-1">
                  <Text className="font-medium text-xs" numberOfLines={1}>{product.name}</Text>
                  <Text className="text-amber-500 text-xs font-medium">₹{product.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Final Banner */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-orange-400 p-4 rounded-2xl"
            onPress={() => navigation.navigate("SpecialOffer")}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-1">Special Offer!</Text>
                <Text className="text-white/80 text-sm mb-2">Get 20% off on your first purchase</Text>
                <View className="bg-white/20 self-start px-3 py-1 rounded-full">
                  <Text className="text-white font-medium">SHOP NOW</Text>
                </View>
              </View>
              <View className="bg-white/20 h-16 w-16 rounded-full items-center justify-center">
                <Text className="text-white font-bold text-xl">20%</Text>
                <Text className="text-white text-xs">OFF</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Features */}
        <View className="px-4 mb-6">
          <Text className="font-bold text-lg mb-4">Why Choose Us</Text>

          <View className="flex-row flex-wrap justify-between">
            <View className="w-1/2 pr-2 mb-4">
              <View className="bg-blue-50 p-3 rounded-xl flex-row items-center">
                <View className="bg-blue-100 p-2 rounded-lg">
                  <Icon name="local-shipping" size={20} color="#3B82F6" />
                </View>
                <View className="ml-2">
                  <Text className="font-medium text-sm">Free Shipping</Text>
                  <Text className="text-gray-500 text-xs">On orders over ₹500</Text>
                </View>
              </View>
            </View>

            <View className="w-1/2 pl-2 mb-4">
              <View className="bg-green-50 p-3 rounded-xl flex-row items-center">
                <View className="bg-green-100 p-2 rounded-lg">
                  <Icon name="verified" size={20} color="#10B981" />
                </View>
                <View className="ml-2">
                  <Text className="font-medium text-sm">Quality Assured</Text>
                  <Text className="text-gray-500 text-xs">100% authentic products</Text>
                </View>
              </View>
            </View>

            <View className="w-1/2 pr-2">
              <View className="bg-purple-50 p-3 rounded-xl flex-row items-center">
                <View className="bg-purple-100 p-2 rounded-lg">
                  <Icon name="support-agent" size={20} color="#8B5CF6" />
                </View>
                <View className="ml-2">
                  <Text className="font-medium text-sm">24/7 Support</Text>
                  <Text className="text-gray-500 text-xs">Dedicated help center</Text>
                </View>
              </View>
            </View>

            <View className="w-1/2 pl-2">
              <View className="bg-amber-50 p-3 rounded-xl flex-row items-center">
                <View className="bg-amber-100 p-2 rounded-lg">
                  <Icon name="repeat" size={20} color="#F59E0B" />
                </View>
                <View className="ml-2">
                  <Text className="font-medium text-sm">Easy Returns</Text>
                  <Text className="text-gray-500 text-xs">30-day return policy</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-6" />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}