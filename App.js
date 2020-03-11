import React, {useState} from 'react';
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
    <VaultNavigator/>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', 
  },
});
