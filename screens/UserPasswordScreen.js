import React, {useState, useCallback} from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

//components import
import HeaderButton from '../components/HeaderButton.js';
import CategoryGridTile from '../components/CategoryGridTile.js';

//constants import
import Colors from '../constants/Colors.js';

//actions
import * as accountsActions from '../store/actions/account.js';


const UserPasswordScreen = props => 
{
  
  const dispatch = useDispatch();

  const test = useCallback(async () =>{
    try
    {
      await dispatch(accountsActions.fetchAccounts());
    }
    catch(err)
    {
  
    }
  
  }, [dispatch]);

  test();
  
  //useSelector to view stored passwords
  const userAccounts = useSelector(state => state.storedAccounts.userAccounts);
  
  
  //grid item function
  const renderGridItem = (itemData) =>
  {
    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        //icon = 'ios-star'

        onSelect={() => {}}

        color = {Colors.accent}
      />

    );

  };

  //edit password
  const editProductHandler = (id) =>
  {
    
  };

  //delete password

  //check if there's any available passwords
  if(userAccounts.length === 0)
  {
    return (
      <View style={{flex : 1, justifyContent : 'center', alignItems : 'Center'}}>
        <Text>No Accounts Found</Text>
      </View>
    );
  }
  else
  {
    //userAccounts.then((result)=>{ console.log(result); })
    //console.log(userAccounts);
    return (
    
      // <View style={{flex : 1, justifyContent : 'center', alignItems : 'Center'}}>
      //   <Text>{userAccounts.title}</Text>
      // </View>
        <FlatList
          data = {userAccounts}
          keyExtractor = {(item,index) => item.id}
          renderItem = {renderGridItem}
        />
  
    );
  }

  

};

//dynamic navigation
UserPasswordScreen.navigationOptions = navigationData => {

  return {

    headerTitle : "Passwords",
    headerRight : () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title='add' iconName='ios-add' onPress={() => {navigationData.navigation.navigate('EditPassword')}}/>
      </HeaderButtons>

  };

};

export default UserPasswordScreen;