import React, {useState, useEffect} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList 
} from 'react-native';

import { HeaderBackButton } from 'react-navigation-stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';

//components import
import HeaderButton from '../../components/HeaderButton.js';
import CategoryGridTile from '../../components/CategoryGridTile.js';

//constants import
import Colors from '../../constants/Colors.js';

import Account from '../../models/account.js';
import Card from '../../models/card.js';
import Bank from '../../models/bank.js';
import Note from '../../models/note.js';

const FavoritesScreen = props => 
{
  //states 
  const [isLoading, setIsLoading] = useState(false);
  const [value, setIsValue] = useState();
  
  const dispatch = useDispatch();

  const accFavs = useSelector(state => state.storedAccounts.userAccounts.filter(acc => acc.favorite === true));
  const cardFavs = useSelector(state => state.storedCards.userCards.filter(card => card.favorite === true));
  const bankFavs = useSelector(state => state.storedBanks. userBanks.filter(bank => bank.favorite === true));
  const noteFavs = useSelector(state => state.storedNotes. userNotes.filter(note => note.favorite === true));
  
  const combined = [...accFavs, ...cardFavs, ...bankFavs, ...noteFavs];

  console.log(combined);

  const [data, setData] = useState(combined);

  //grid item function
  const renderGridItem = (itemData) =>
  {
    console.log(typeof(itemData.item));

    return (

      <CategoryGridTile 
        title = {itemData.item instanceof Bank ? itemData.item.bankName : itemData.item.title}
        icon = {
          itemData.item instanceof Account ? 'textbox-password' : 
          itemData.item instanceof Card ? 'credit-card' :
          itemData.item instanceof Bank ? 'bank' :
          'notebook'
        }       
        onSelect={() => {
          if(itemData.item instanceof Account)
          {
            props.navigation.navigate('PasswordDetail', {accountID : itemData.item.id})
          }
          else if (itemData.item instanceof Card)
          {
            props.navigation.navigate('CardDetail', {cardID : itemData.item.id})
          }
          else if (itemData.item instanceof Bank)
          {
            props.navigation.navigate('BankDetail', {bankID : itemData.item.id})
          }
          else
          {
            props.navigation.navigate('NoteDetail', {noteID : itemData.item.id})
          }
          
        }}
        color = {Colors.accent}
      />

    );

  };

  const searchFilterFunction = text => 
  {
    setIsValue(text);

    const newData = combined.filter(item => 
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
  if(combined.length === 0)
  {
    return (
      
      <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
        <Text>No Favorites Found</Text>
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
FavoritesScreen.navigationOptions = navigationData => {

  return {
    headerTitle : 'Favorites',

    headerLeft: () => 
      <HeaderBackButton title="Vault" tintColor={Colors.accent} onPress={() => navigationData.navigation.goBack(null)} />,

    // headerRight : () =>
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //       <Item
    //       title = "Add"
    //       iconName = "ios-add"
    //       onPress = {() => navigationData.navigation.navigate('EditPasswordDetail')}
    //       />
    //   </HeaderButtons>
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

export default FavoritesScreen;