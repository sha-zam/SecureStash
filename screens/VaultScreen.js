import React, {useState} from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import {PASSWORDFOLDER} from '../dummy_data/dummy.js';
import { OPTIONS } from '../dummy_data/options_data.js';

//components import
import CategoryGridTile from '../components/CategoryGridTile.js';
import HeaderButton from '../components/HeaderButton.js';

//constants import 
import Colors from '../constants/Colors.js';

const VaultScreen = props =>
{

  const renderGridItem = (itemData) =>
  {
    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        icon = {itemData.item.icon}

        onSelect={() => {
          
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
          else 
          {
            route = 'SecureNotes';
          }

          props.navigation.navigate({

            
            routeName : route, 
            params : 
            {
              folderID : itemData.item.id
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
    // headerLeft : () =>
    //     <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //         <Item title='menu' iconName='ios-menu' onPress={() => {
    //             navData.navigation.toggleDrawer();
    //         }}
    //     />
    //     </HeaderButtons>
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