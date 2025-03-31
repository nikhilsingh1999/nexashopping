import React from "react";
import { View, Text, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const notifications = [
  {
    id: 1,
    title: "30% Special Discount!",
    description: "Special promotion only valid today.",
    date: "Today",
  },
  {
    id: 2,
    title: "Top Up E-wallet Successfully!",
    description: "You have top up your e-wallet.",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "New Service Available!",
    description: "Now you can track order in real-time.",
    date: "Yesterday",
  },
];

export default function NotificationScreen() {
  if (notifications.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Icon name="notifications-none" size={48} color="gray" className="mb-4" />
        <Text className="text-xl font-semibold mb-2">You haven't gotten any notifications yet!</Text>
        <Text className="text-gray-500 text-center">We'll alert you when something cool happens...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          {(index === 0 || notifications[index - 1].date !== notification.date) && (
            <Text className="px-4 py-2 font-medium bg-gray-50">{notification.date}</Text>
          )}
          <View className="p-4 border-b border-gray-100">
            <Text className="font-medium mb-1">{notification.title}</Text>
            <Text className="text-gray-500">{notification.description}</Text>
          </View>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

