import React, {useState} from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import {PASSWORDFOLDER} from '../dummy_data/dummy.js';

//components import
import CategoryGridTile from '../components/CategoryGridTile.js';

const VaultScreen = props =>
{

  const renderGridItem = (itemData) =>
  {
    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        onSelect={() => (props.navigation.navigate('UserPassword'))}
        color = {"#4a148c"}
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default VaultScreen;