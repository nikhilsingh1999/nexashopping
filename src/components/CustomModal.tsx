import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  iconName: string;
  buttonText: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  iconName,
  buttonText,
}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-6 rounded-xl w-80 items-center shadow-lg">
          <MaterialIcons name={iconName} size={50} color="green" />
          <Text className="text-xl font-semibold mt-3">{title}</Text>
          <Text className="text-gray-500 mt-1 text-center">{message}</Text>

          <TouchableOpacity
            onPress={onClose}
            className="mt-5 bg-purple-600 px-6 py-3 rounded-lg flex-row items-center"
          >
            <MaterialIcons name="arrow-forward" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
