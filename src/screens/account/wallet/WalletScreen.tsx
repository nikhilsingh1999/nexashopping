import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Sample transaction data
const transactions = [
  { id: '1', title: 'Led 10', amount: -1500, date: '2025-03-30', status: 'Success' },
  { id: '2', title: 'Credit Deposit', amount: 5000, date: '2025-03-28', status: 'Success' },
  { id: '3', title: 'Led bulb 20', amount: -1500, date: '2025-03-27', status: 'Success' },
  { id: '4', title: 'Led buld 12', amount: -1000, date: '2025-03-26', status: 'Pending' },
  { id: '5', title: 'Refund - Electronics', amount: 7500, date: '2025-03-25', status: 'Success' },
  { id: '6', title: 'Wires', amount: -2500, date: '2025-03-24', status: 'Failed' },
  { id: '7', title: 'repay the credit ', amount: 5000, date: '2025-03-23', status: 'Success' },
];

// Format currency (₹ for Indian Rupees)
const formatCurrency = (amount : any) => `₹${amount.toLocaleString('en-IN')}`;

// Format date
const formatDate = (dateString : any) => {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};

// Status color mapping
const getStatusColor = (status : any) => {
  switch (status) {
    case 'Success': return 'text-green-500';
    case 'Pending': return 'text-yellow-500';
    case 'Failed': return 'text-red-500';
    default: return 'text-black';
  }
};

const WalletScreen = () => {
  // Calculate wallet balance
  const walletBalance = transactions.reduce((total, transaction) => total + transaction.amount, 0);

  // Transaction item renderer
  const renderTransactionItem = ({ item }) => (
    <View className="flex-row items-center py-4 border-b border-gray-100">
      <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-4">
        <MaterialIcons
          name={item.amount > 0 ? 'arrow-downward' : 'arrow-upward'}
          size={24}
          color={item.amount > 0 ? 'green' : 'red'}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-black mb-1">{item.title}</Text>
        <Text className="text-sm text-gray-500">{formatDate(item.date)}</Text>
      </View>
      <View className="items-end">
        <Text className={`text-base font-semibold mb-1 ${item.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(item.amount)}
        </Text>
        <Text className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4">
        <Text className="text-xl font-bold text-black">My Wallet</Text>
        <MaterialIcons name="account-circle" size={28} color="black" />
      </View>

      {/* Wallet Balance Section */}
      <View className="flex-row justify-between items-center px-5 py-5 mb-2 bg-white">
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1">Available Credit</Text>
          <Text className="text-3xl font-bold text-black">{formatCurrency(walletBalance)}</Text>
        </View>
        <TouchableOpacity className="flex-row items-center px-5 py-3 rounded-full"
          style={{ backgroundColor: '#FF8C00' }}>
          <MaterialIcons name="payment" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Payback</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction History Section */}
      <View className="flex-1 px-5">
        <Text className="text-lg font-bold mb-4 text-black">Transaction History</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Download Button */}
      <TouchableOpacity className="flex-row items-center justify-center mx-5 mb-5 py-4 rounded-lg"
        style={{ backgroundColor: '#FF8C00' }}>
        <MaterialIcons name="file-download" size={20} color="white" />
        <Text className="text-white font-bold ml-2">Download Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WalletScreen;
