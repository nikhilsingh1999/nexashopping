// PrivacyPolicy.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


const privacyPolicyData = [
  {
    title: "Introduction",
    content: `Welcome to Nexashopping ("we," "our," "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share your information when you use our eCommerce platform.`,
  },
  {
    title: "Information We Collect",
    content: [
      "Personal Data: Name, email, phone number, address, and payment details.",
      "Distributor & User Data: Credit history, transaction records, referrals.",
      "Device & Usage Data: IP address, browser type, and interactions with the app.",
    ],
  },
  {
    title: "How We Use Your Data",
    content: [
      "To process orders and manage credit-based transactions.",
      "To verify distributors and users referred through the platform.",
      "To comply with legal and regulatory requirements.",
    ],
  },
  {
    title: "Data Sharing & Security",
    content: [
      " Data is shared with payment gateways, shipping partners, and distributors.",
      "We implement security measures to protect your personal information.",
      "We do not sell or rent user data to third parties",
    ],
  },
  {
    title: " Your Rights",
    content: [
      " Request access, modification, or deletion of your data.",
      "Opt-out of marketing communications",
      "Report data misuse by contacting us.",
    ],
  },
  {
    title: "Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy, please contact us at [Your Contact Information].`,
  }
];

const Privacyandpolicy = () => {
  return (
    <ScrollView className="p-5 bg-white">
      {/* Privacy Policy Title */}
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Privacy Policy
      </Text>

      {/* Last Updated Section */}
      <Text className="text-gray-600 text-sm mb-4">Last Updated: [Date]</Text>

      {/* Privacy Policy Sections */}
      {privacyPolicyData.map((section, index) => (
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

export default Privacyandpolicy;
