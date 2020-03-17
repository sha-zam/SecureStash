import React, { useState, useCallback, useReducer, useEffect} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView, 
  ScrollView, 
  Alert
} from 'react-native';

//redux
import { useSelector, useDispatch } from 'react-redux';

//components import 
import Input from '../components/Input.js';
import HeaderButton from '../components/HeaderButton.js';

//constants import
import Colors from '../constants/Colors.js';

//actions import
import * as accountActions from '../store/actions/account.js';
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

const EditPasswordDetailScreen = props =>
{
  //states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  //get account ID (if in edit mode)
  const accID = props.navigation.getParam('accountID');

  const editedAcc = useSelector(state => state.storedAccounts.userAccounts.find(acc => acc.id === accID));

  const [formState, dispatchFormState] = useReducer(formReducer, {

    inputValues : 
    {
      title : editedAcc ? editedAcc.title : '',
      URL : editedAcc ? editedAcc.URL : '',
      username : editedAcc ? editedAcc.username : '',
      password : editedAcc ? editedAcc.password : '',
    },

    inputValidities : 
    {
      title : editedAcc ? true : false,
      URL : editedAcc ? true : false,
      username : editedAcc ? true : false,
      password : editedAcc ? true : false,
    },

    formIsValid : editedAcc ? true : false

  });

  useEffect(() => {

    if(error)
    {
      Alert.alert('an error occured!', error, [{text : 'Okay'}]);
    }

  }, [error]);

  //submit handler function
  const submitHandler = useCallback(async() => {

    //check form validity
    if(!formState.formIsValid)
    {
      Alert.alert('Invalid Inputs! Please check again!', [{text : 'Okay'}]);

      return;
    }

    setError(null);
    setIsLoading(true);

    try
    {
      //edit mode
      if(editedAcc)
      {

        await dispatch (
          accountActions.updateAccounts (
            accID,
            formState.inputValues.title,
            formState.inputValues.URL,
            formState.inputValues.username,
            formState.inputValues.password,
          )

        );

      }
      else //add mode
      { 

        await dispatch (
          accountActions.createAccounts (
            formState.inputValues.title,
            formState.inputValues.URL,
            formState.inputValues.username,
            formState.inputValues.password,
          )

        );

      }

      //go back
      props.navigation.goBack();

    }
    catch(err)
    {
      setError(err.message);
    }

    setIsLoading(false);

  }, [dispatch, accID, formState]);

  useEffect(() => {
    
      props.navigation.setParams({submit : submitHandler});

  }, [submitHandler]);

  //input change handler function
  const inputChangeHandler = useCallback( (inputIdentifier, inputValue, inputValidity) =>{

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
        <ActivityIndicator size="large" color={Colors.primary}/>
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
              initialValue=""
            />
            <Input
              id="URL"
              label="URL"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter a valid URL"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="username"
              label="Username"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter a valid URL"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              required
              errorText="Please enter a valid URL"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
          </View>

        </ScrollView>

      </KeyboardAvoidingView>
  );
};

EditPasswordDetailScreen.navigationOptions = navData => {
  
  const submitFn = navData.navigation.getParam('submit');

  return {

    //check whether to display edit or add text
    headerTitle : navData.navigation.getParam('accountID') ? "Edit" : "Add",
    headerRight : () =>

      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title = "Save"
          iconName = "ios-checkmark"
          onPress = {submitFn}
        />
      </HeaderButtons>


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
    }

  });
  
export default EditPasswordDetailScreen;