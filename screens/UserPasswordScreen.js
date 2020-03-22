import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { HeaderBackButton } from 'react-navigation-stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';

//components import
import HeaderButton from '../components/HeaderButton.js';
import CategoryGridTile from '../components/CategoryGridTile.js';

//constants import
import Colors from '../constants/Colors.js';

//actions
import * as accountsActions from '../store/actions/account.js';


const UserPasswordScreen = props => 
{
  //states 
  const [isLoading, setIsLoading] = useState(true);

   //grid item function
   const renderGridItem = (itemData) =>
   {
 
     return (
 
       <CategoryGridTile 
         title = {itemData.item.title}
 
         onSelect={() => {props.navigation.navigate('PasswordDetail', {accountID : itemData.item.id})}}
 
         color = {Colors.accent}
       />
 
     );
 
   };
   
  //useSelector to view stored passwords
  const userAccounts = useSelector(state => state.storedAccounts.userAccounts);
  
  const dispatch = useDispatch();

  useEffect(() => 
  {
    setIsLoading(true);

    dispatch(accountsActions.fetchAccounts()).then(() => 
    {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) 
  {

    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  }

  // const fetchUserAccounts = useCallback(async () => {

  //   try
  //   {
  //     await dispatch(accountsActions.fetchAccounts());
  //   }
  //   catch(err)
  //   {
  //     throw (err);
  //   }
    
  //   setIsLoading(false);

  // }, [dispatch]);

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

    return (
    
      <FlatList
        data = {userAccounts}
        keyExtractor = {(item) => item.id}
        renderItem = {renderGridItem}
      />
  
    );
  }

};

//dynamic navigation
UserPasswordScreen.navigationOptions = navigationData => {

  return {
    headerTitle : 'Passwords',

    headerLeft: () => 
      <HeaderBackButton title="Vault" tintColor={Colors.accent} onPress={() => navigationData.navigation.goBack(null)} />,

    headerRight : () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
          title = "Add"
          iconName = "ios-add"
          onPress = {() => navigationData.navigation.navigate('EditPasswordDetail')}
          />
      </HeaderButtons>
  };

};

const styles = StyleSheet.create({

  centered : 
  {
    flex : 1,
    justifyContent: 'center',
    alignItems : 'center'
  }

});

export default UserPasswordScreen;