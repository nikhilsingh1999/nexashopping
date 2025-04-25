import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Platform,
  AppState,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import {
  fetchCart,
  updateCart,
  removeFromCart,
} from "../../redux/slices/cartSlice";
import debounce from "lodash.debounce";

export default function CartScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const appState = useRef(AppState.currentState);
  
  // Redux state
  const { items: cartData, loading, error } = useSelector((state : any) => state.cart);
  
  // Local UI state
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [optimisticCart, setOptimisticCart] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  // Create a toast/alert message function
  const showMessage = (message : string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Cart', message);
    }
  };

  // Function to refresh cart data
  const refreshCart = useCallback(() => {
    return dispatch(fetchCart())
      .unwrap()
      .then(() => {
        setLastFetchTime(Date.now());
        setIsInitialLoad(false);
      })
      .catch(() => {
        setIsInitialLoad(false);
        showMessage("Failed to refresh cart. Please try again.");
      });
  }, [dispatch]);

  // Initial load
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Refresh cart when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only refresh if it's been more than 1 second since last fetch
      // to prevent excessive calls when navigating quickly
      if (Date.now() - lastFetchTime > 1000) {
        refreshCart();
      }
    }, [refreshCart, lastFetchTime])
  );

  // Listen for app state changes to refresh when app comes back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active' &&
        Date.now() - lastFetchTime > 5000 // Only refresh if it's been 5+ seconds
      ) {
        refreshCart();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [refreshCart, lastFetchTime]);

  // Poll for cart updates every 30 seconds when component is mounted
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Date.now() - lastFetchTime > 30000) { // Only if last refresh was 30+ seconds ago
        refreshCart();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [refreshCart, lastFetchTime]);

  // Update optimistic cart when server cart changes
  useEffect(() => {
    if (cartData) {
      setOptimisticCart(cartData);
    }
  }, [cartData]);

  // Create a debounced update function for quantity changes
  const debouncedUpdate = useCallback(
    debounce((productId, quantity) => {
      dispatch(updateCart({ id: productId, quantity }))
        .unwrap()
        .catch((err) => {
          console.error("Failed to update cart:", err);
          showMessage("Failed to update quantity.");
          
          // Revert optimistic update on error
          if (cartData) {
            setOptimisticCart(cartData);
          }
        });
    }, 4000),
    [dispatch, cartData]
  );

  // Handle quantity change with immediate UI update
  const handleQuantityChange = (productId : string, quantity : number) => {
    if (quantity < 1) return;
    
    // Update optimistic UI immediately
    setOptimisticCart((prevCart) => {
      if (!prevCart || !prevCart.items) return prevCart;
      
      return {
        ...prevCart,
        items: prevCart.items.map((item : any) => {
          if (item.productId && item.productId._id === productId) {
            return { ...item, quantity };
          }
          return item;
        })
      };
    });
    
    // Send update to server (debounced)
    debouncedUpdate(productId, quantity);
  };

  // Handle item removal with confirmation
  const handleRemoveItem = (productId : string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            // Optimistic UI update
            setOptimisticCart((prevCart) => {
              if (!prevCart || !prevCart.items) return prevCart;
              
              return {
                ...prevCart,
                items: prevCart.items.filter(
                  (item) => !(item.productId && item.productId._id === productId)
                )
              };
              
            });
            
            // Send to server
            dispatch(removeFromCart(productId))
              .unwrap()
              .then(() => {
                showMessage("Item removed from cart");
              })
              .catch((err) => {
                console.error("Failed to remove item:", err);
                showMessage("Failed to remove item. Please try again.");
                
                // Revert optimistic update on error
                if (cartData) {
                  setOptimisticCart(cartData);
                }
              });
          }
        }
      ]
    );
  };

  // Calculate cart totals
  const calculateTotals = useCallback(() => {
    const items = optimisticCart?.items || [];
    
    if (items.length === 0) {
      return { subtotal: 0, deliveryFee: 0, discount: 0, total: 0 };
    }
    
    const subtotal = items.reduce((sum, item) => {
      if (!item.productId) return sum;
      const price = item.productId.discountPrice || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    const deliveryFee = 20;
    const discount = 10;
    const total = subtotal + deliveryFee - discount;
    
    return { subtotal, deliveryFee, discount, total };
  }, [optimisticCart]);

  const { subtotal, deliveryFee, discount, total } = calculateTotals();

  // Handle checkout button press
  const handleCheckout = () => {
    // Prepare cart data for checkout
    const checkoutData = {
      cartItems: optimisticCart?.items || [],
      summary: {
        subtotal,
        deliveryFee,
        discount,
        total
      }
    };
    
    // Navigate to checkout with cart data
    navigation.navigate("Checkout", { checkoutData });
  };

  // Manual refresh function for pull-to-refresh
  const handleManualRefresh = () => {
    refreshCart();
  };







  // Initial loading state
  if (isInitialLoad) {
    return (
      <SafeAreaView className="flex-1 bg-black pt-12">
        <View className="flex-1 bg-white pt-4">
          <Text className="text-2xl font-bold text-gray-900 text-center">Cart</Text>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="orange" />
            <Text className="text-lg text-gray-700 mt-4">Loading your cart...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Error state (only if no optimistic data)
  if (error && !optimisticCart?.items?.length) {
    return (
      <SafeAreaView className="flex-1 bg-black pt-12">
        <View className="flex-1 bg-white pt-4">
          <Text className="text-2xl font-bold text-gray-900 text-center">Cart</Text>
          <View className="flex-1 items-center justify-center p-4">
            <Icon name="error-outline" size={60} color="red" />
            <Text className="text-xl font-semibold mt-4 mb-2">Failed to load cart</Text>
            <Text className="text-gray-500 text-center mb-6">
              We couldn't load your cart items. Please try again.
            </Text>
            <TouchableOpacity
              onPress={handleManualRefresh}
              className="bg-orange-600 p-3 rounded-xl px-6"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Empty cart state
  if (!optimisticCart?.items?.length) {
    return (
      <SafeAreaView className="flex-1 bg-black pt-12">
        <View className="flex-1 bg-white pt-4">
          <View className="flex-row justify-between items-center px-4">
            <Text className="text-2xl font-bold text-gray-900">Cart</Text>
            <TouchableOpacity onPress={handleManualRefresh}>
              <Icon name="refresh" size={24} color="#ff6600" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 items-center justify-center p-4">
            <Icon name="shopping-cart" size={80} color="gray" />
            <Text className="text-xl font-semibold mt-4 mb-2">Your Cart Is Empty!</Text>
            <Text className="text-gray-500 text-center mb-6">
              When you add products, they'll appear here.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Shop")}
              className="bg-orange-600 p-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Browse Products</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Filled cart state
  return (
    <SafeAreaView className="flex-1 bg-black pt-12">
      <View className="flex-1 bg-white pt-4">
        <View className="flex-row justify-between items-center px-4">
          <Text className="text-2xl font-bold text-gray-900">Cart</Text>
          <TouchableOpacity onPress={handleManualRefresh}>
            <Icon name="refresh" size={24} color="#ff6600" />
          </TouchableOpacity>
        </View>
        
        <ScrollView className="mt-4">
          {optimisticCart.items.map((item, index) => {
            // Skip invalid items
            if (!item.productId || !item.productId._id) return null;
            
            return (
              <View
                key={item.productId._id}
                className="flex-row p-4 border-b border-gray-200 bg-white"
              >
                <Image
                  source={{ uri: item.productId.imageUrls?.[0] }}
                  className="w-20 h-20 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-4">
                  <Text className="font-medium text-gray-900" numberOfLines={1}>
                    {item.productId.name}
                  </Text>
                  <Text className="text-gray-500 mb-1">
                    Brand: {item.productId.brand}
                  </Text>
                  <Text className="text-gray-700 font-semibold">
                    ₹{item.productId.discountPrice} x {item.quantity}
                  </Text>
                </View>
                <View className="items-end justify-between">
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleRemoveItem(item.productId._id)}
                  >
                    <Icon name="delete" size={18} color="red" />
                  </TouchableOpacity>
                  <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                      className={`p-1 ${item.quantity <= 1 ? "opacity-30" : ""}`}
                      onPress={() => handleQuantityChange(item.productId._id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <Icon name="remove" size={18} />
                    </TouchableOpacity>
                    <View className="mx-2 min-w-[25px] items-center">
                      <Text className="text-center">{item.quantity}</Text>
                    </View>
                    <TouchableOpacity
                      className="p-1"
                      onPress={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                    >
                      <Icon name="add" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View className="p-4 border-t border-gray-200">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Sub-total</Text>
            <Text className="font-medium">₹{subtotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Delivery Fee</Text>
            <Text className="font-medium">₹{deliveryFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-500">Discount</Text>
            <Text className="font-medium text-green-500">-₹{discount.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="font-semibold">Total</Text>
            <Text className="font-semibold">₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={handleCheckout}
            className="p-4 rounded-xl bg-orange-600"
          >
            <Text className="text-white text-center font-semibold">
              Go To Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}