import React, {useState, useEffect} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList,
} from 'react-native';

import { HeaderBackButton } from 'react-navigation-stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';

//components import
import HeaderButton from '../../../components/HeaderButton.js';
import CategoryGridTile from '../../../components/CategoryGridTile.js';

//constants import
import Colors from '../../../constants/Colors.js';

//actions
import * as accountsActions from '../../../store/actions/account.js';
  
const UserPasswordScreen = props => 
{
  //states 
  const [isLoading, setIsLoading] = useState(false);
  const [value, setIsValue] = useState();
  
  const dispatch = useDispatch();
  // let userAccounts;

  // useEffect(() => 
  // {
  //   setIsLoading(true);

  //   dispatch(accountsActions.fetchAccounts()).then(() => 
  //   {
  //     setIsLoading(false);
  //   });

  // }, [dispatch]);

  // userAccounts = useSelector(state => state.storedAccounts.userAccounts);

  const folderName = props.navigation.getParam('folder')
  const userAccounts = useSelector(state => state.storedAccounts.userAccounts.filter(acc => acc.folder === folderName));
  const [data, setData] = useState(userAccounts);

  //grid item function
  const renderGridItem = (itemData) =>
  {

    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        icon = "textbox-password"
        onSelect={() => {
          props.navigation.navigate('PasswordDetail', {accountID : itemData.item.id})
        }}
        color = {Colors.accent}
      />

    );

  };

  const searchFilterFunction = text => 
  {
    setIsValue(text);

    const newData = userAccounts.filter(item => 
    {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;

    });

    setData(newData);
    console.log(data);

  };

  const renderHeader = () => 
  {

    return (

      <SearchBar
        placeholder="Search"
        lightTheme
        round
        onChangeText={text => searchFilterFunction(text)}
        autoCorrect={false}
        value={value}
      />

    );

  };

  if (isLoading) 
  {

    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  }

  //check if there's any available passwords
  if(userAccounts.length === 0)
  {
    return (
      
      <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
        <Text>No Accounts Found</Text>
      </View>

    );
  }
  else
  {

    return (
      
      <FlatList
        numColumns={2}
        data = {data}
        keyExtractor = {(item) => item.id}
        renderItem = {renderGridItem}
        ListHeaderComponent={renderHeader}
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
            iSize = {40}
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