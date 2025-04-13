import "./global.css";
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from "./src/navigations/MainStack";
import { navigationRef } from "./src/navigations/navigationService";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { persistor } from "./src/redux/store";
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
    <GestureHandlerRootView className="flex-1">
      <NavigationContainer ref={navigationRef}>
        <MainStack />
      </NavigationContainer>
    </GestureHandlerRootView>
    </PersistGate>
    </Provider>
  );
};

export default App;
