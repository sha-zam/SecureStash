import React, {useState} from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { StyleSheet, Text, View } from 'react-native';

//unlock some optimize screens for both iOS and Android
import { enableScreens } from 'react-native-screens';

//load font
import * as Font from 'expo-font';

//component that will prolong the splash screen when the app starts
//until fonts are loaded 
import {AppLoading} from 'expo';

//navigator import
import VaultNavigator from './navigation/VaultNavigator.js';

enableScreens();

//reducers
import authReducer from './store/reducers/auth.js';

const rootReducer = combineReducers({
  auth : authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

//fonts
const fetchFonts = () =>
{
  return Font.loadAsync({
    'open-sans' : require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf'),
  });
};

export default function App() {

  //false -> initially, fonts have not been loaded
  const[fontLoaded, setFontLoaded] = useState(false);

  if(!fontLoaded)
  {
    return (
      <AppLoading 
        startAsync={fetchFonts} 
        onFinish = {() => setFontLoaded(true)}
      />
    )
  }

  return (
    <Provider store={store}>
      <VaultNavigator/>
    </Provider>
  );

}