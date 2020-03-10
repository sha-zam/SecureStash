import React, {useState} from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import {PASSWORDFOLDER} from '../dummy_data/dummy.js';

//components import
import CategoryGridTile from '../components/CategoryGridTile.js';

//constants import 
import Colors from '../constants/Colors.js';

const VaultScreen = props =>
{

  const renderGridItem = (itemData) =>
  {
    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        onSelect={() => (props.navigation.navigate('UserPassword'))}
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

VaultScreen.navigationOptions = {

  headerTitle : "Vault",
  
  headerStyle :
  {
    backgroundColor : Colors.primary
  },

  headerTintColor : Colors.accent
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