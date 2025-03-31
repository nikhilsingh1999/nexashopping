import React from "react";
import { createBottomTabNavigator , TransitionPresets } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import Homestack from "./Homestack";
import CartStack from "./Cartstack";
import AccountStack from "./AccountStack";


const Tab = createBottomTabNavigator();

const getIconName = (routeName: string, focused: boolean): string => {
  switch (routeName) {
    case "Home":
      return focused ? "home" : "home";
    case "Cart":
      return focused ? "shopping-cart" : "shopping-cart";
    case "Saved":
      return focused ? "favorite" : "favorite-border";
    case "Account":
      return focused ? "person" : "person-outline";
    default:
      return "help-outline";
  }
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "orange",
        tabBarInactiveTintColor: "black",
        TransitonPresets: TransitionPresets.ShiftTransition,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getIconName(route.name, focused);
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          elevation: 5,
          backgroundColor: "white",
          height: 60,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 3 },
        },
      })}
    >
      <Tab.Screen name="Home" component={Homestack} />
      <Tab.Screen name="Cart" component={CartStack} />
      {/* <Tab.Screen name="Saved" component={SavedScreen} /> */}
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
