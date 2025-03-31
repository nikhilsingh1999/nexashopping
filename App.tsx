import "./global.css";
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from "./src/navigations/MainStack";

const App = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
