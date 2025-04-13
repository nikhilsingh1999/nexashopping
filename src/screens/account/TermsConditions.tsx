// TermsConditions.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const termsConditionsData = [
  {
    title: "Introduction",
    content: `By using Nexashopping's eCommerce platform, you agree to these terms.`,
  },
  {
    title: "Account Registration",
    content: [
      "Users can register independently or be referred by a distributor.",
      "Distributors must be approved by the admin.",
    ],
  },
  {
    title: "Credit-Based Transactions",
    content: [
      "Admin provides products on credit to distributors.",
      "Distributors can extend credit to users.",
      "Credit limits and repayment terms are determined by the admin.",
    ],
  },
  {
    title: "Order Processing & Payments",
    content: [
      "Users must clear pending dues before placing new credit-based orders.",
      "Non-payment may result in account suspension or legal action.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "We are not responsible for disputes between distributors and users.",
      "Pricing and product availability may change without notice.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We reserve the right to terminate accounts for fraudulent activities.",
      "Users can deactivate their accounts by contacting support.",
    ],
  },
  {
    title: "Contact Us",
    content: "For any legal inquiries, contact [support email].",
  },
];

const TermsConditions = () => {
  return (
    <ScrollView className="p-5 bg-white">
      {/* Terms & Conditions Title */}
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Terms & Conditions
      </Text>

      {/* Last Updated Section */}
      <Text className="text-gray-600 text-sm mb-4">Last Updated: [Date]</Text>

      {/* Terms Sections */}
      {termsConditionsData.map((section, index) => (
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

export default TermsConditions;
