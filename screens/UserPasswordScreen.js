import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

//data import
import {PASSWORDFOLDER} from '../dummy_data/dummy.js';

//components import
import HeaderButton from '../components/HeaderButton.js';

//constants import
import Colors from '../constants/Colors.js';

const UserPasswordScreen = props => 
{
  //get folder ID
  const folderID = props.navigation.getParam('folderID');

  //find selected folder 
  const selectedFolder = PASSWORDFOLDER.find(folder => folder.id === folderID);


  return (
      <View style={styles.container}>
          <Text>{selectedFolder.title}</Text>
      </View>
  );

};

//dynamic navigation
UserPasswordScreen.navigationOptions = navigationData => {

  const folderID = navigationData.navigation.getParam('folderID');

  //find selected folder 
  const selectedFolder = PASSWORDFOLDER.find(folder => folder.id === folderID);

  //headerTitle
  return {

    headerTitle : selectedFolder.title,
    headerRight : () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='favorite' iconName='ios-star' onPress={() => {}}/>
      </HeaderButtons>

  };

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default UserPasswordScreen;