// ShippingPolicy.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const shippingPolicyData = [
  {
    title: "Shipping Methods",
    content: [
      "We offer standard and express delivery options.",
      "Distributors may manage their own shipping for referred users.",
    ],
  },
  {
    title: "Delivery Timeframe",
    content: [
      "Orders are typically processed within [X] business days.",
      "Shipping delays due to unforeseen events will be communicated.",
    ],
  },
  {
    title: "Tracking & Support",
    content: [
      "Users can track orders via [tracking URL].",
      "Distributors must ensure product delivery to their users.",
    ],
  },
  {
    title: "Shipping Fees",
    content: [
      "Shipping charges depend on location and order value.",
      "Free shipping may be available for bulk orders.",
    ],
  },
  {
    title: "Contact Us",
    content: "Email us at [your email] for shipping inquiries.",
  },
];

const ShippingPolicy = () => {
  return (
    <ScrollView className="p-5 bg-white">
      {/* Title */}
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Shipping & Delivery Policy
      </Text>

      {/* Last Updated Section */}
      <Text className="text-gray-600 text-sm mb-4">Last Updated: [Date]</Text>

      {/* Policy Sections */}
      {shippingPolicyData.map((section, index) => (
        <View key={index} className="mb-6">
          <Text className="text-lg font-semibold text-black mb-2">
            {index + 1}. {section.title}
          </Text>

          {Array.isArray(section.content) ? (
            section.content.map((point, i) => (
              <Text key={i} className="text-base text-gray-700 ml-4">• {point}</Text>
            ))
          ) : (
            <Text className="text-base text-gray-700">{section.content}</Text>
          )}

          {/* Bottom Border */}
          <View className="border-b border-gray-300 mt-4" />
        </View>
      ))}
    </ScrollView>
  );
};

export default ShippingPolicy;
