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
import HeaderButton from '../../../components/HeaderButton.js';
import CategoryGridTile from '../../../components/CategoryGridTile.js';

//constants import
import Colors from '../../../constants/Colors.js';

//actions
import * as cardActions from '../../../store/actions/card.js';
  
const CardFoldersScreen = props => 
{
  //states 
  const [isLoading, setIsLoading] = useState(false);
  const [value, setIsValue] = useState();
  
  const dispatch = useDispatch();
  let userCards;
  //let folders;

  // useEffect(() => 
  // {
  //   setIsLoading(true);

  //   dispatch(cardActions.fetchCards()).then(() => 
  //   {
  //     setIsLoading(false);
  //   });

  // }, [dispatch]);

  //   //userCards = useSelector(state => state.storedCards.userCards);
  //   //folders = [...new Set(userCards.map(acc => acc.folder))]

  // }, [dispatch]);

  userCards = useSelector(state => state.storedCards.userCards);

  const folders = [...new Set(userCards.map(card => card.folder))]
  console.log(folders);

  const [data, setData] = useState(folders);

  //grid item function
  const renderGridItem = (itemData) =>
  {

    return (

      <CategoryGridTile 
        title = {itemData.item}

        onSelect={() => {props.navigation.navigate('UserCard', {folder : itemData.item})}}

        color = {Colors.accent}
      />

    );

  };

  const searchFilterFunction = text => 
  {
    setIsValue(text);

    const newData = folders.filter(item => 
    {
      const itemData = `${item.toUpperCase()}`;
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

  //check if there's any available cards
  if(userCards.length === 0)
  {
    return (
      
      <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
        <Text>No Cards Found</Text>
      </View>

    );
  }
  else
  {

    return (
      
      <FlatList
        data = {data}
        keyExtractor = {(item, index) => index.toString()}
        renderItem = {renderGridItem}
        ListHeaderComponent={renderHeader}
      />

    );
  }

};

//dynamic navigation
CardFoldersScreen.navigationOptions = navigationData => {

  return {
    headerTitle : 'Payment Cards',

    headerLeft: () => 
      <HeaderBackButton title="Vault" tintColor={Colors.accent} onPress={() => navigationData.navigation.goBack(null)} />,

    headerRight : () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
          title = "Add"
          iconName = "ios-add"
          iSize = {40}
          onPress = {() => navigationData.navigation.navigate('EditCardDetail')}
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

export default CardFoldersScreen;