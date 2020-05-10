import React, { useRef, useState, useCallback, useReducer, useEffect} from 'react';
import { 

  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView, 
  ScrollView, 
  Alert,
  Button,
  Switch,
  Slider,
  Clipboard
  
} from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

//redux
import { useSelector, useDispatch } from 'react-redux';

//components import 
import Input from '../../../components/Input.js';
import HeaderButton from '../../../components/HeaderButton.js';
import BottomCard from '../../../components/BottomCard.js';

//constants import
import Colors from '../../../constants/Colors.js';

//actions import
import * as accountActions from '../../../store/actions/account.js';
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
  const [isFav, setIsFav] = useState(false);
  const [bottomCardVisibility, setBottomCardVisibility] = useState(false);
  const [genPwd, setGenPwd] = useState();
  const [genLength, setGenLength] = useState();

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
      folder : editedAcc ? editedAcc.folder : '',
    },

    inputValidities : 
    {
      title : editedAcc ? true : false,
      URL : editedAcc ? true : false,
      username : editedAcc ? true : false,
      password : editedAcc ? true : false,
      folder : editedAcc ? true : false,
    },

    formIsValid : editedAcc ? true : false

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
      if(editedAcc)
      {

        await dispatch (
          accountActions.updateAccounts (
            accID,
            formState.inputValues.title,
            formState.inputValues.URL,
            formState.inputValues.username,
            formState.inputValues.password,
            formState.inputValues.folder,
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

  }, [dispatch, accID, formState]);

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

  const getRandomInt = (min, max) =>
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generatePassword = () =>
  {

    let characterList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()<>,.?/[]{}-=_+";

    let password = "";

    for (let i = 0; i < genLength; ++i) 
    {
      password += characterList[getRandomInt(0, characterList.length - 1)];
    }

    setGenPwd(password);
  }

  const copyHandler = async (value) => 
  {
      await Clipboard.setString(value);
      // Alert.alert('An Error Occurred!', 'Fail', [{ text: 'Okay' }]);
  };

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
              initialValue={editedAcc ? editedAcc.title : ''}
              initiallyValid={!!editedAcc}
            />
            <Input
              id="URL"
              label="URL"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter a valid URL"
              onInputChange={inputChangeHandler}
              initialValue={editedAcc ? editedAcc.URL : ''}
              initiallyValid={!!editedAcc}
            />
            <Input
              id="username"
              label="Username"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter a valid username"
              onInputChange={inputChangeHandler}
              initialValue={editedAcc ? editedAcc.username : ''}
              initiallyValid={!!editedAcc}
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              required
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
              initialValue={editedAcc ? editedAcc.password : ''}
              initiallyValid={!!editedAcc}
            />

            <Button 
              color={Colors.primary}
              title="Generate Password" 
              onPress={() => setBottomCardVisibility(true)} 
            />
            
            <Input
              id="folder"
              label="Folder"
              keyboardType="default"
              required
              errorText="Please enter a valid folder"
              onInputChange={inputChangeHandler}
              initialValue={editedAcc ? editedAcc.folder : ''}
              initiallyValid={!!editedAcc}
            />

            {editedAcc ? 
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

        <BottomCard 
          show={bottomCardVisibility} 
          onExit={() => setBottomCardVisibility(false)}
        > 

          <View style={styles.cardView}>
            <Slider
              style={{width: 200, height: 40}}
              minimumValue={10}
              maximumValue={40}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.accent}
              onValueChange={(value) => setGenLength(value)}
              step={1}
            />


            <Text style={{padding : 20}}>Length : {genLength}</Text>

            <Text style={{padding : 20}}>{genPwd}</Text>

            <Button
              color = {Colors.primary}
              title = "Generate Password"
              onPress = {generatePassword}  
              style={{padding : 20}}  
            />
            <Button
              color = {Colors.primary}
              title = "Copy Password"
              onPress = {() => copyHandler(genPwd)}  
              style={{padding : 20}}  
            />
 
          </View>

        </BottomCard> 

      </KeyboardAvoidingView>

  );
};

EditPasswordDetailScreen.navigationOptions = navData => {
  
  //const submitFn = navData.navigation.getParam('submit');

  return {

    //check whether to display edit or add text
    headerTitle : navData.navigation.getParam('accountID') ? "Edit" : "Add",
      
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
  },

  cardView :
  {
    alignItems : 'center',
    margin : 20
  }

});
  
export default EditPasswordDetailScreen;