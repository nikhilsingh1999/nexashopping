// ReturnsPolicy.tsx
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

const returnsPolicyData = [
  {
    title: "Return Eligibility",
    content: [
      "Items must be returned within 7 days of receipt.",
      "Products must be unused, undamaged, and in their original packaging with all tags intact.",
      "Certain items such as perishable goods, personalized or custom products, and final sale items are non-returnable.",
    ],
  },
  {
    title: "Refund Process",
    content: [
      "Refunds are initiated after the returned item is received and inspected.",
      "It may take up to 5–7 business days to process the refund after approval.",
      "Refunds will be credited to the original payment method used during the purchase.",
    ],
  },
  {
    title: "Exchange Policy",
    content: [
      "Exchanges are only applicable for items that are defective or damaged upon delivery.",
      "Customers must contact our support team before initiating an exchange request.",
      "If the requested item for exchange is unavailable, a refund will be issued instead.",
    ],
  },
  {
    title: "Non-Refundable Cases",
    content: [
      "Returned items that are used, damaged, or missing parts due to customer misuse.",
      "Returns initiated after the return window has passed.",
    ],
  },
  {
    title: "Shipping & Responsibility",
    content: [
      "Customers are responsible for return shipping costs unless the product is defective or sent incorrectly.",
      "We recommend using a trackable shipping service or purchasing shipping insurance.",
    ],
  },
  {
    title: "Contact Us",
    content: "If you have any questions or need help with returns or exchanges, please contact us at support@nexashopping.com.",
  },
];

const ReturnsPolicy = () => {
  return (
    < SafeAreaView className=' pt-12'>
    <ScrollView className="p-5 bg-white">
      {/* Title */}
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Returns & Refunds Policy
      </Text>

      {/* Last Updated Section */}
      <Text className="text-gray-600 text-sm mb-4">Last Updated: 20-04-2025</Text>

      {/* Policy Sections */}
      {returnsPolicyData.map((section, index) => (
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

          {/* Bottom Border */}
          <View className="border-b border-gray-300 mt-4" />
        </View>
      ))}
    </ScrollView>
    </ SafeAreaView>
  );
};

export default ReturnsPolicy;
