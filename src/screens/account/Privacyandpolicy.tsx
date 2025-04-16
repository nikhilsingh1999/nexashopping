// PrivacyPolicy.tsx
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

const privacyPolicyData = [
  {
    title: "Introduction",
    content: `Welcome to Nexashopping ("we," "our," "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and protect your information when you use our eCommerce platform.`,
  },
  {
    title: "Information We Collect",
    content: [
      "Personal Data: Name, email, phone number, address, and payment details.",
      "Distributor & User Data: Credit history, transaction records, and referral information.",
      "Device & Usage Data: IP address, browser type, app usage behavior, and interaction logs.",
    ],
  },
  {
    title: "How We Use Your Data",
    content: [
      "To process orders, payments, and manage credit-based transactions.",
      "To verify distributor and user identities, especially for referrals.",
      "To improve user experience and platform functionality.",
      "To comply with legal, regulatory, and auditing obligations.",
    ],
  },
  {
    title: "Data Sharing & Security",
    content: [
      "Data may be shared with trusted third parties like payment gateways, shipping partners, and authorized distributors.",
      "We implement encryption, secure storage, and access controls to protect your information.",
      "We do not sell or rent personal data to any third parties.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "Request access, correction, or deletion of your personal data.",
      "Withdraw consent or object to certain data processing activities.",
      "Opt out of receiving marketing or promotional communications.",
      "Report data misuse or lodge a complaint by contacting us.",
    ],
  },
  {
    title: "Data Retention",
    content: `We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.`,
  },
  {
    title: "Children's Privacy",
    content: `Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware of such data, we will take immediate steps to delete it.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date. Continued use of our platform after changes indicates acceptance of the revised policy.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy, please contact us at support@nexashopping.com.`,
  },
];

const PrivacyPolicy = () => {
  return (
    <SafeAreaView className="flex pt-12">
    <ScrollView className="p-5 bg-white">
      {/* Privacy Policy Title */}
      <Text className="text-center text-2xl font-bold text-black mb-4">
        Privacy Policy
      </Text>

      {/* Last Updated Section */}
      <Text className="text-gray-600 text-sm mb-4">Last Updated: 20-04-2025</Text>

      {/* Policy Sections */}
      {privacyPolicyData.map((section, index) => (
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

export default PrivacyPolicy;
