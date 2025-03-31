import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../screens/home/HomeScreen";
import ProductDetails from "../screens/home/ProductDetails";
import NotificationScreen from "../screens/home/NotificationScreen";



const stack = createStackNavigator();

const Homestack = () => {
    return (
        <stack.Navigator
            screenOptions={{ headerShown: false, gestureEnabled: true, ...TransitionPresets.SlideFromRightIOS }}
            initialRouteName="HomeScreen" >
            <stack.Screen name="HomeScreen" component={HomeScreen} />
            <stack.Screen name="ProductDetails" component={ProductDetails} />
            <stack.Screen name="Notifications" component={NotificationScreen} />
        
            {/* <stack.Screen name="SearchResults" component={SearchResultScreen} /> */}
        </stack.Navigator>
    )
}

export default Homestack;