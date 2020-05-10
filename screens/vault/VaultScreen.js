import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import {PASSWORDFOLDER} from '../../dummy_data/dummy.js';
import { OPTIONS } from '../../dummy_data/options_data.js';

//components import
import CategoryGridTile from '../../components/CategoryGridTile.js';
import HeaderButton from '../../components/HeaderButton.js';

import * as accountsActions from '../../store/actions/account.js';
import * as noteActions from '../../store/actions/notes.js';
import * as bankActions from '../../store/actions/bank.js';
import * as cardActions from '../../store/actions/card.js';

import { useSelector, useDispatch } from 'react-redux';


//constants import 
import Colors from '../../constants/Colors.js';

const VaultScreen = props =>
{
  const [error, setError] = useState();
  const dispatch = useDispatch();

  //var RNFS = require('react-native-fs');

  useEffect(() => 
  {

    //console.log(RNFS.DocumentDirectoryPath);

    dispatch(accountsActions.fetchAccounts());
    dispatch(noteActions.fetchNotes());  
    dispatch(bankActions.fetchBanks());
    dispatch(cardActions.fetchCards());

  }, [dispatch]);

  const renderGridItem = (itemData) =>
  {
    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        icon = {itemData.item.icon}

        onSelect={() =>
        {
          let route;

          if(itemData.item.title === 'Passwords')
          {
            route = 'UserPassword';
          }
          else if (itemData.item.title === 'Payment Cards')
          {
            route = 'PaymentCards';
          }
          else if (itemData.item.title === 'Bank Accounts')
          {
            route = 'BankAcc';
          }
          else if (itemData.item.title === 'Secure Notes')
          {
            route = 'SecureNotes';
          }
          else
          {
            route = 'Favorites'
          }

          props.navigation.navigate({

            
            routeName : route, 
            params : 
            {
              vaultType : itemData.item.title
            }
          });
        
        }}

        color = {Colors.accent}
      />

    );

  };

  return (

    <FlatList
      numColumns={2}
      data={OPTIONS}
      renderItem={renderGridItem}
      keyExtractor={(item, index) => item.id}
    />

  );

};

VaultScreen.navigationOptions = navData => {

  return {
    headerTitle : "Vault",
  }
  
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default VaultScreen;