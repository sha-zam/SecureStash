import React, {useState} from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import {PASSWORDFOLDER} from '../dummy_data/dummy.js';

//components import
import CategoryGridTile from '../components/CategoryGridTile.js';
import HeaderButton from '../components/HeaderButton.js';

//constants import 
import Colors from '../constants/Colors.js';

const CreditCardScreen = props =>
{

  const renderGridItem = (itemData) =>
  {
    return (

      <CategoryGridTile 
        title = {itemData.item.title}

        onSelect={() => {
          props.navigation.navigate({
            routeName : 'UserPassword', 
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
      data={PASSWORDFOLDER}
      renderItem={renderGridItem}
      keyExtractor={(item, index) => item.id}
    />

  );

};

CreditCardScreen.navigationOptions = navData => {

    return {
        headerTitle : "Payment Cards",
        headerLeft : () =>
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='menu' iconName='ios-menu' onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
            </HeaderButtons>
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

export default CreditCardScreen;