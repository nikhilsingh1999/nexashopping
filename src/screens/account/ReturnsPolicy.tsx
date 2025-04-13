// ReturnsPolicy.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const returnsPolicyData = [
  {
    title: "Return Eligibility",
    content: [
      "Items must be returned within [X] days of receipt.",
      "Products should be unused and in original packaging.",
      "Certain items (e.g., perishable goods, custom products) are non-returnable.",
    ],
  },
  {
    title: "Refund Process",
    content: [
      "Refunds will be issued once the returned item is inspected.",
      "Processing time for refunds may take [X] business days.",
      "Refunds will be credited to the original payment method.",
    ],
  },
  {
    title: "Exchange Policy",
    content: [
      "Exchanges are available for defective or damaged items.",
      "Users should contact support before sending a replacement request.",
    ],
  },
  {
    title: "Contact Us",
    content: "For return inquiries, contact [your email].",
  },
];

const ReturnsPolicy = () => {
  return (
    <ScrollView className="p-5 bg-white">
      {/* Title */}
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Returns & Refunds Policy
      </Text>

      {/* Last Updated Section */}
      <Text className="text-gray-600 text-sm mb-4">Last Updated: [Date]</Text>

      {/* Policy Sections */}
      {returnsPolicyData.map((section, index) => (
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

export default ReturnsPolicy;
