import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  iconName: string;
  buttonText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
  onClose,
  title,
  message,
  iconName,
  buttonText,
}) => {
  const isConfirmModal = !!onConfirm;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-6 rounded-xl w-80 items-center shadow-lg">
          <MaterialIcons name={iconName} size={50} color={iconName === "error-outline" ? "red" : "green"} />
          <Text className="text-xl font-semibold mt-3 text-center">{title}</Text>
          <Text className="text-gray-500 mt-2 text-center">{message}</Text>

          {isConfirmModal ? (
            <View className="flex-row mt-6 space-x-4 gap-3">
              <TouchableOpacity
                onPress={onCancel || onClose}
                className="flex-1 bg-gray-300 py-3 rounded-lg items-center"
              >
                <Text className="text-black font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                className="flex-1 bg-orange-600 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onClose}
              className="mt-5 bg-orange-600 px-6 py-3 rounded-lg flex-row items-center"
            >
              <MaterialIcons name="arrow-forward" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
