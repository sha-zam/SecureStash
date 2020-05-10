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
import * as bankActions from '../../../store/actions/bank.js';
  
const UserBankScreen = props => 
{
  //states 
  const [isLoading, setIsLoading] = useState(false);
  const [value, setIsValue] = useState();
  const [bottomCardVisibility, setBottomCardVisibility] = useState(false);
  const [id, setId] = useState('');
  const [bankName, setBankName] = useState('');
  const [number, setNumber] = useState('');
  const [pin, setPin] = useState('');
  const [branchAddr, setBranchAddr] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  
  const dispatch = useDispatch();
  // let userBanks;

  // useEffect(() => 
  // {
  //   setIsLoading(true);

  //   dispatch(bankActions.fetchBanks()).then(() => 
  //   {
  //     setIsLoading(false);
  //   });

  // }, [dispatch]);

  // userBanks = useSelector(state => state.storedBanks.userBanks);

  const folderName = props.navigation.getParam('folder')
  const userBanks = useSelector(state => state.storedBanks.userBanks.filter(acc => acc.folder === folderName));
  const [data, setData] = useState(userBanks);

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
    setBankName(itemData.item.bankName);
    setNumber(itemData.item.accNum);
    setPin(itemData.item.pin);
    setBranchAddr(itemData.item.branchAddr);
    setBranchPhone(itemData.item.branchPhone);
    
    setBottomCardVisibility(true);
  }

  //grid item function
  const renderGridItem = (itemData) =>
  {

    return (

      <CategoryGridTile 
        title = {itemData.item.bankName}
        icon = "bank"
        onSelect={check.bind(this,itemData)}
        color = {Colors.accent}
      />

    );

  };

  const searchFilterFunction = text => 
  {
    setIsValue(text);

    const newData = userBanks.filter(item => 
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

      Alert.alert('Are you sure?', 'Do you really want to delete this bank account from your vault?', 
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
                    dispatch(bankActions.deleteBanks(ID));
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

  //check if there's any available banks
  if(userBanks.length === 0)
  {
    return (
      
      <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
        <Text>No Bank Accounts Found</Text>
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
          numColumns={2}
          data = {data}
          keyExtractor = {(item) => item.id}
          renderItem = {renderGridItem}
        />

        <BottomCard 
          show={bottomCardVisibility} 
          onExit={() => setBottomCardVisibility(false)}
        > 
          <Text style={styles.titleText}>{bankName}</Text>
          <View>
              <Button
                  color = {Colors.primary}
                  title = "Copy Account Number"
                  onPress = {() => {copyHandler(number);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Copy PIN"
                  onPress = {() => {copyHandler(pin);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Copy Branch Phone Number"
                  onPress = {() => {copyHandler(branchPhone);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Copy Branch Address"
                  onPress = {() => {copyHandler(branchAddr);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "View"
                  onPress = {() => {
                    props.navigation.navigate('BankDetail', {bankID : id})
                  }}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Edit"
                  onPress = {() => {
                    props.navigation.navigate('EditBankDetail', {bankID : id})
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
UserBankScreen.navigationOptions = navigationData => {

  return {
    headerTitle : 'Bank Accounts',

    headerLeft: () => 
      <HeaderBackButton title="Vault" tintColor={Colors.accent} onPress={() => navigationData.navigation.goBack(null)} />,

    headerRight : () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
          title = "Add"
          iconName = "ios-add"
          iSize = {40}
          onPress = {() => navigationData.navigation.navigate('EditBankDetail')}
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

export default UserBankScreen;