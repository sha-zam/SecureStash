import React, {useState, useEffect} from 'react';
import { 
  
  StyleSheet, 
  Text, 
  View, 
  FlatList,
  KeyboardAvoidingView,
  Button,
  Clipboard,
  Alert 

} from 'react-native';

import { HeaderBackButton } from 'react-navigation-stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';

//components import
import HeaderButton from '../../../components/HeaderButton.js';
import CategoryGridTile from '../../../components/CategoryGridTile.js';
import BottomCard from '../../../components/BottomCard.js';

//constants import
import Colors from '../../../constants/Colors.js';

//actions
import * as cardActions from '../../../store/actions/card.js';
  
const UserCardScreen = props => 
{
  //states 
  const [isLoading, setIsLoading] = useState(false);
  const [value, setIsValue] = useState();
  const [bottomCardVisibility, setBottomCardVisibility] = useState(false);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const dispatch = useDispatch();
  // let userCards;

  // useEffect(() => 
  // {
  //   setIsLoading(true);

  //   dispatch(cardActions.fetchCards()).then(() => 
  //   {
  //     setIsLoading(false);
  //   });

  // }, [dispatch]);

  // userCards = useSelector(state => state.storedCards.userCards);

  const folderName = props.navigation.getParam('folder')
  const userCards = useSelector(state => state.storedCards.userCards.filter(card => card.folder === folderName));
  const [data, setData] = useState(userCards);

  const check = (itemData) => 
  {
    //selectedAcc = itemData.item;
    console.log(itemData.item);
    // setSelect(prevState => {
    //   prevState.id= itemData.item.id;
    //   prevState.title = itemData.item.title;
    //   prevState.username = itemData.item.username;
    //   prevState.password = itemData.item.password;
    // });

    setId(itemData.item.id);
    setTitle(itemData.item.title);
    setName(itemData.item.nameOnCard);
    setNumber(itemData.item.number);
    setExpDate(itemData.item.expDate);
    setCvv(itemData.item.cvv);
    
    setBottomCardVisibility(true);
  }

  //grid item function
  const renderGridItem = (itemData) =>
  {

    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        icon="credit-card"
        onSelect={check.bind(this,itemData)}
        color = {Colors.accent}
      />

    );

  };

  const searchFilterFunction = text => 
  {
    setIsValue(text);

    const newData = userCards.filter(item => 
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

  const copyHandler = async (value) => 
  {
      await Clipboard.setString(value);
      // Alert.alert('An Error Occurred!', 'Fail', [{ text: 'Okay' }]);
  };

  const deleteHandler = async (ID) =>
  {
      console.log(ID);

      Alert.alert('Are you sure?', 'Do you really want to delete this card from your vault?', 
      [
          { text: 'No', style: 'default' },

          {
              text: 'Yes',
              style: 'destructive',
              onPress: () => 
              {
                  props.navigation.navigate('Vault');  
                  try
                  {
                    dispatch(cardActions.deleteCards(ID));
                  }
                  catch(err)
                  {

                  }
                           
              }
          }

      ]);
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
        <Text>No Payment Cards Found</Text>
      </View>

    );
  }
  else
  {

    return (

      <KeyboardAvoidingView
        style={{flex : 1}}
        behavior="padding"
        keyboardVerticalOffset={100}
      >

        <SearchBar
          placeholder="Search"
          lightTheme
          round
          onChangeText={text => searchFilterFunction(text)}
          autoCorrect={false}
          value={value}
        />

        <FlatList
          data = {data}
          keyExtractor = {(item) => item.id}
          renderItem = {renderGridItem}
        />

        <BottomCard 
          show={bottomCardVisibility} 
          onExit={() => setBottomCardVisibility(false)}
        > 
          <Text style={styles.titleText}>{title}</Text>
          <View>
              <Button
                  color = {Colors.primary}
                  title = "Copy Name On Card"
                  onPress = {() => {copyHandler(name);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Copy Card Number"
                  onPress = {() => {copyHandler(number);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Copy Card Expiry Date"
                  onPress = {() => {copyHandler(expDate);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Copy Card Security Code"
                  onPress = {() => {copyHandler(cvv);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "View"
                  onPress = {() => {
                    props.navigation.navigate('CardDetail', {cardID : id})
                  }}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Edit"
                  onPress = {() => {
                    props.navigation.navigate('EditCardDetail', {cardID : id})
                  }}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Delete"
                  onPress = {deleteHandler.bind(this, id)} 
              />
          </View> 
        </BottomCard> 

      </KeyboardAvoidingView>
      
     

    );
  }

};

//dynamic navigation
UserCardScreen.navigationOptions = navigationData => {

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
  },

  titleText : 
  {
      fontSize: 20,
      color: '#888',
      textAlign: 'center',
      marginVertical: 20,
  },

});

export default UserCardScreen;