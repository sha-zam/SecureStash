import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//unlock some optimize screens for both iOS and Android
import { enableScreens } from 'react-native-screens';

//load font
//import * as Font from 'expo-font';

//component that will prolong the splash screen when the app starts
//until fonts are loaded 
//import {AppLoading} from 'expo';

//state management
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import ReduxThunk from 'redux-thunk';

//navigator import
import NavigationContainer from './navigation/NavigationContainer.js';

//reducers
import authReducer from './store/reducers/auth.js';
import accountReducer from './store/reducers/account.js';
import noteReducer from './store/reducers/notes.js';
import cardReducer from './store/reducers/card.js';
import bankReducer from './store/reducers/bank.js';

enableScreens();

const rootReducer = combineReducers({
  auth : authReducer,
  storedNotes : noteReducer,
  storedAccounts : accountReducer,
  storedCards : cardReducer,
  storedBanks : bankReducer
});


const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

//fonts
// const fetchFonts = () =>
// {
//   return Font.loadAsync({
//     'open-sans' : require('./assets/fonts/OpenSans-Regular.ttf'),
//     'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf'),
//   });
// };

export default function App() {

  //false -> initially, fonts have not been loaded
  //const[fontLoaded, setFontLoaded] = useState(false);

  // if(!fontLoaded)
  // {
  //   return (
  //     <AppLoading 
  //       startAsync={fetchFonts} 
  //       onFinish = {() => setFontLoaded(true)}
  //     />
  //   )
  // }

  return (
    
    <Provider store={store}>
      <NavigationContainer/>
    </Provider>
  );

}