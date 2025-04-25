import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, SafeAreaView , ActivityIndicator} from 'react-native';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAppDispatch } from '../../redux/hooks';
import { fetchAddresses, addAddress, deleteAddress, updateAddress } from '../../redux/slices/addressSlice';

const AddressScreen = () => {
  const dispatch = useAppDispatch();
  const { addresses, loading } = useSelector(state => state.address);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, []);

  const openModal = (address = null) => {
    setEditingAddress(address);
    setFormData(address ? address : {
      address_line1: '',address_line2:'', city: '', state: '', country: '', zip_code: '',
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (editingAddress) {
      await dispatch(updateAddress({ id: editingAddress.id, data: formData }));
    } else {
      const info = await dispatch(addAddress(formData));
      console.log(info);
    }
    setModalVisible(false);
  };

  const handleDelete = async (id) => {
    const info = await dispatch(deleteAddress(id));
    console.log(info);
    dispatch(fetchAddresses())
  };

  const renderItem = ({ item }) => (
    <View className="bg-white p-4  rounded-lg shadow-md mb-3 flex-row justify-between items-start">
      <View className="flex-1">
        <Text className="font-bold">{item.address_line1}</Text>
        <Text>{item.city}, {item.state}, {item.zip_code}</Text>
        <Text>{item.country}</Text>
      </View>
  
      <View className="flex-row space-x-5 items-center">
        <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.7} >
          <MaterialIcons name="edit" size={22} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} activeOpacity={0.7} >
          <MaterialIcons name="delete" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <SafeAreaView className='flex-1 bg-white pt-12'>
    <View className="flex-1 p-4 bg-gray-100">


    {loading ? (
    <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
    </View>
    ) : addresses.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-gray-500 text-lg">No address found</Text>
        </View>
    ) : (
        <FlatList
          data={addresses}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center items-center bg-black/30 px-4">
          <View className="bg-white w-full p-4 rounded-xl">
            <Text className="text-lg font-bold mb-2">{editingAddress ? 'Edit' : 'Add'} Address</Text>
            <TextInput
              placeholder="Address Line 1"
              value={formData.address_line1}
              onChangeText={text => setFormData({ ...formData, address_line1: text })}
              className=" border-b p-2 mb-2 rounded"
            />
             <TextInput
              placeholder="Address Line 2"
              value={formData.address_line2}
              onChangeText={text => setFormData({ ...formData, address_line2: text })}
              className="border-b p-2 mb-2 rounded"
            />
            <TextInput
              placeholder="City"
              value={formData.city}
              onChangeText={text => setFormData({ ...formData, city: text })}
              className="border-b p-2 mb-2 rounded"
            />
            <TextInput
              placeholder="State"
              value={formData.state}
              onChangeText={text => setFormData({ ...formData, state: text })}
              className="border-b p-2 mb-2 rounded"
            />
            <TextInput
              placeholder="Country"
              value={formData.country}
              onChangeText={text => setFormData({ ...formData, country: text })}
              className="border-b p-2 mb-2 rounded"
            />
            <TextInput
              placeholder="Zip Code"
              value={formData.zip_code}
              onChangeText={text => setFormData({ ...formData, zip_code: text })}
              className="border-b p-2 mb-2 rounded"
              keyboardType="numeric"
            />

            <View className="flex-row justify-end mt-2">
              <TouchableOpacity onPress={() => setModalVisible(false)} className="mr-3">
                <Text className="text-red-500 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit}>
                <Text className="text-green-600 font-bold">{editingAddress ? 'Update' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => openModal()} className="bg-orange-500 flex-row items-center justify-center mt-4 p-5  rounded-lg">
        <MaterialIcons name="add-location-alt" size={20} color="black" />
        <Text className="text-black text-center font-bold">Add New Address</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default AddressScreen;
