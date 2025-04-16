// ShippingPolicy.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const shippingPolicyData = [
  {
    title: "Shipping Methods",
    content: [
      "We provide both Standard and Express delivery services.",
      "In select regions, our verified distributors may manage deliveries for orders placed by referred users.",
    ],
  },
  {
    title: "Delivery Timeframe",
    content: [
      "All orders are processed within 1–3 business days (excluding weekends and holidays) after receiving your order confirmation.",
      "You will receive another notification when your order has shipped.",
      "In case of delays due to high demand or unforeseen circumstances, we will inform you promptly.",
    ],
  },
  {
    title: "Order Tracking & Support",
    content: [
      "You can track your order by contacting our support team with your order ID.",
      "If your order was placed through a distributor, please reach out to them for delivery updates.",
      "For any other queries, our support team is happy to assist.",
    ],
  },
  {
    title: "Shipping Fees",
    content: [
      "Shipping charges are calculated at checkout based on your location and order value.",
      "Free shipping may be available on eligible orders or during promotional periods.",
    ],
  },
  {
    title: "Shipping Locations",
    content: [
      "We currently ship within India. Certain remote areas may have limited delivery options.",
      "If your address is outside our serviceable area, we will contact you before processing the order.",
    ],
  },
  {
    title: "Contact Us",
    content: "For any shipping-related inquiries, please contact us at support@example.com or call +91-XXXXXXXXXX.",
  },
];

const ShippingPolicy = () => {
  return (
    <ScrollView className="p-5 bg-white">
      {/* Title */}
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Shipping & Delivery Policy
      </Text>

      {/* Last Updated */}
      <Text className="text-gray-600 text-sm mb-4">Last Updated: 20-04-2025</Text>

      {/* Policy Content */}
      {shippingPolicyData.map((section, index) => (
        <View key={index} className="mb-6">
          <Text className="text-lg font-semibold text-black mb-2">
            {index + 1}. {section.title}
          </Text>

          {Array.isArray(section.content) ? (
            section.content.map((point, i) => (
              <Text key={i} className="text-base text-gray-700 ml-4 mb-1">• {point}</Text>
            ))
          ) : (
            <Text className="text-base text-gray-700">{section.content}</Text>
          )}

          <View className="border-b border-gray-300 mt-4" />
        </View>
      ))}
    </ScrollView>
  );
};

export default ShippingPolicy;
