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
import * as noteActions from '../../../store/actions/notes.js';
  
const UserNotesScreen = props => 
{
  //states 
  const [isLoading, setIsLoading] = useState(false);
  const [value, setIsValue] = useState();
  const [bottomCardVisibility, setBottomCardVisibility] = useState(false);
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  
  const dispatch = useDispatch();
  // let userAccounts;

  // useEffect(() => 
  // {
  //   setIsLoading(true);

  //   dispatch(noteActions.fetchNotes()).then(() => 
  //   {
  //     setIsLoading(false);
  //   });

  // }, [dispatch]);

  // userAccounts = useSelector(state => state.storedAccounts.userAccounts);

  const folderName = props.navigation.getParam('folder')
  const userNotes = useSelector(state => state.storedNotes.userNotes.filter(note => note.folder === folderName));
  const [data, setData] = useState(userNotes);

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
    setDescription(itemData.item.description);
    
    console.log('a : ' + id);
    console.log('b : ' + title);
    console.log('c : ' + description);

    setBottomCardVisibility(true);
  }

  //grid item function
  const renderGridItem = (itemData) =>
  {

    return (

      <CategoryGridTile 
        title = {itemData.item.title}
        icon = "notebook"
        onSelect={check.bind(this,itemData)}
        color = {Colors.accent}
      />

    );

  };

  const searchFilterFunction = text => 
  {
    setIsValue(text);

    const newData = userNotes.filter(item => 
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

      Alert.alert('Are you sure?', 'Do you really want to delete this note from your vault?', 
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
                    dispatch(noteActions.deleteNotes(ID));
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

  //check if there's any available notes
  if(userNotes.length === 0)
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
          numColumns = {2}
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
                  title = "Copy Note"
                  onPress = {() => {copyHandler(description);}}    
              />
              <Button
                  color = {Colors.primary}
                  title = "View"
                  onPress = {() => {
                    props.navigation.navigate('NoteDetail', {noteID : id})
                  }}    
              />
              <Button
                  color = {Colors.primary}
                  title = "Edit"
                  onPress = {() => {
                    props.navigation.navigate('EditNoteDetail', {noteID : id})
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
UserNotesScreen.navigationOptions = navigationData => {

  return {
    headerTitle : 'Secure Notes',

    headerLeft: () => 
      <HeaderBackButton title="Vault" tintColor={Colors.accent} onPress={() => navigationData.navigation.goBack(null)} />,

    headerRight : () =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
          title = "Add"
          iconName = "ios-add"
          iSize={40}
          onPress = {() => navigationData.navigation.navigate('EditNoteDetail')}
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

export default UserNotesScreen;