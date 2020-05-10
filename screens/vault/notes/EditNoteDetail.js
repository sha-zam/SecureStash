import React, { useState, useCallback, useReducer, useEffect} from 'react';
import { 

  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView, 
  ScrollView, 
  Alert,
  Button,
  Switch

} from 'react-native';

//redux
import { useSelector, useDispatch } from 'react-redux';

//components import 
import Input from '../../../components/Input.js';
import HeaderButton from '../../../components/HeaderButton.js';

//constants import
import Colors from '../../../constants/Colors.js';

//actions import
import * as noteActions from '../../../store/actions/notes.js';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ActivityIndicator } from 'react-native-paper';

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

//form reducer
const formReducer = (state, action) =>
{
  if(action.type === FORM_INPUT_UPDATE)
  {
    //check
    let updatedFormValid = true;

    const updatedValues = 
    {
      ...state.inputValues,
      [action.input] : action.value
    };

    const updatedValidities = 
    {
      ...state.inputValidities,
      [action.input] : action.isValid
    };

    for (const key in updatedValidities)
    {
      updatedFormValid = updatedFormValid && updatedValidities[key];
    }

    return {
      formIsValid : updatedFormValid,
      inputValidities : updatedValidities,
      inputValues : updatedValues
    };

  }

  return state;
}

const EditNoteDetailScreen = props =>
{
  //states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isFav, setIsFav] = useState(false);

  const dispatch = useDispatch();

  //get account ID (if in edit mode)
  const noteID = props.navigation.getParam('noteID');

  const editedNote = useSelector(state => state.storedNotes.userNotes.find(note => note.id === noteID));

  const [formState, dispatchFormState] = useReducer(formReducer, {

    inputValues : 
    {
      title : editedNote ? editedNote.title : '',
      note : editedNote ? editedNote.description : '',
      folder : editedNote ? editedNote.folder : '',
    },

    inputValidities : 
    {
      title : editedNote ? true : false,
      note : editedNote ? true : false,
      folder : editedNote ? true : false,
    },

    formIsValid : editedNote ? true : false

  });

  useEffect(() => {

    if(error)
    {
      Alert.alert('an error occured!', error, [{text : 'OK'}]);
    }

  }, [error]);

  //submit handler function
  const submitHandler = useCallback(async() => {

    //check form validity
    if(!formState.formIsValid)
    {
      Alert.alert('Invalid Inputs!', 'Please check again!');

      return;
    }

    setError(null);
    setIsLoading(true);

    try
    {
      //edit mode
      if(editedNote)
      {

        await dispatch (
          noteActions.updateNotes (
            noteID,
            formState.inputValues.title,
            formState.inputValues.note,
            formState.inputValues.folder,
            isFav
          )

        );

      }
      else //add mode
      { 

        await dispatch (
          noteActions.createNotes (
            formState.inputValues.title,
            formState.inputValues.note,
            formState.inputValues.folder,
            isFav
          )

        );

      }

      //go back
      props.navigation.navigate('Vault');

    }
    catch(err)
    {
      setError(err.message);
    }

    setIsLoading(false);

  }, [dispatch, noteID, formState]);

  useEffect(() => {
    
      props.navigation.setParams({submit : submitHandler});

  }, [submitHandler]);

  //input change handler function
  const inputChangeHandler = useCallback( (inputIdentifier, inputValue, inputValidity) => {

    dispatchFormState({
      type : FORM_INPUT_UPDATE,
      value : inputValue,
      isValid : inputValidity,
      input : inputIdentifier
    });

  }, [dispatchFormState]);

  //check if is loading, display loading icon
  if(isLoading)
  {
    return (

      <View>
        <ActivityIndicator style={styles.centered} size="large" color={Colors.primary}/>
      </View>
      
    );
  }

  return (

      <KeyboardAvoidingView
        style={{flex : 1}}
        behavior="padding"
        keyboardVerticalOffset={100}
      >

        <ScrollView>

          <View style={styles.form}>
            <Input
              id="title"
              label="Title"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter a valid title"
              onInputChange={inputChangeHandler}
              initialValue={editedNote ? editedNote.title : ''}
              initiallyValid={!!editedNote}
            />
            <Input
              id="note"
              label="Note"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter a note description"
              onInputChange={inputChangeHandler}
              initialValue={editedNote ? editedNote.description : ''}
              initiallyValid={!!editedNote}
            />
            <Input
              id="folder"
              label="Folder"
              keyboardType="default"
              required
              errorText="Please enter a valid folder"
              onInputChange={inputChangeHandler}
              initialValue={editedNote ? editedNote.folder : ''}
              initiallyValid={!!editedNote}
            />

            {editedNote ? 
              (
                <View style={styles.switchContainer}>
                </View>
              ) : 
              (
                <View style={styles.switchContainer}>
                  <Text>Add to Favorites</Text>
                  <Switch
                    trackColor={{ false: Colors.accent, true: Colors.primary }}
                    thumbColor={Colors.accent}
                    onValueChange={(value) => {
                      setIsFav(previousState => !previousState)
                    }}
                    value={isFav}
                  />
                </View>
              )
            }

            <Button
                color = {Colors.primary}
                title = "Save"
                onPress = {submitHandler}    
            />
          </View>

        </ScrollView>

      </KeyboardAvoidingView>

  );
};

EditNoteDetailScreen.navigationOptions = navData => {
  
  //const submitFn = navData.navigation.getParam('submit');

  return {

    //check whether to display edit or add text
    headerTitle : navData.navigation.getParam('noteID') ? "Edit" : "Add",
    // headerRight : () =>

    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       title = "Save"
    //       iconName = "ios-checkmark"
    //       onPress = {submitFn}
    //     />
    //   </HeaderButtons>

  };

};

const styles = StyleSheet.create({

  form :
  {
    margin : 20
  },

  centered : 
  {
    flex : 1,
    justifyContent: 'center',
    alignItems : 'center'
  },

  switchContainer :
  {
    //flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center',
    width: '80%',
    marginVertical: 20
  }

});
  
export default EditNoteDetailScreen;