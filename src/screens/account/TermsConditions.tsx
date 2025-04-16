// TermsConditions.tsx
import React from 'react';
import { ScrollView, Text, View , SafeAreaView } from 'react-native';

const termsConditionsData = [
  {
    title: "Introduction",
    content: `By using Nexashopping’s platform, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the service.`,
  },
  {
    title: "Account Registration",
    content: [
      "Users can sign up directly or through referral by an approved distributor.",
      "Distributors must receive approval from the Nexashopping admin team.",
      "You are responsible for maintaining the confidentiality of your account and password.",
    ],
  },
  {
    title: "Credit-Based Transactions",
    content: [
      "Products may be offered to distributors on credit, subject to admin approval.",
      "Distributors can extend credit to their referred users within limits set by the admin.",
      "Repayment timelines and credit limits are at the discretion of the platform.",
    ],
  },
  {
    title: "Order Processing & Payments",
    content: [
      "Orders are processed upon payment confirmation or credit approval.",
      "Users must clear any outstanding dues before placing new credit-based orders.",
      "Failure to repay dues may lead to account suspension and legal recovery action.",
    ],
  },
  {
    title: "User Responsibilities",
    content: [
      "You agree to use the platform only for lawful purposes.",
      "You must not attempt to gain unauthorized access to any other user’s account or data.",
      "You shall not misuse discounts, referrals, or promotional credits.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "We are not liable for any loss or damage caused by third-party services or disputes between distributors and users.",
      "Product availability and prices may change without prior notice.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All logos, designs, text, and content on Nexashopping are our intellectual property.",
      "You may not reproduce, distribute, or exploit any content without permission.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We reserve the right to suspend or terminate your account in case of fraudulent activity, misuse, or violation of these terms.",
      "You may request account deletion by contacting our support team.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms & Conditions are governed by the laws of India.",
      "Any disputes arising will be resolved under the jurisdiction of local courts.",
    ],
  },
  {
    title: "Contact Us",
    content: "If you have any questions or legal concerns, please contact us at support@nexashopping.com.",
  },
];

const TermsConditions = () => {
  return (
    
        <SafeAreaView className="flex pt-12">
    <ScrollView className="p-5 bg-white">
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Terms & Conditions
      </Text>

      <Text className="text-gray-600 text-sm mb-4">Last Updated: 20-04-2025</Text>

      {termsConditionsData.map((section, index) => (
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
    </SafeAreaView>
  );
};

export default TermsConditions;
