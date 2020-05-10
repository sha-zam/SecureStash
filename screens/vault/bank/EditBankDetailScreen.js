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
import * as bankActions from '../../../store/actions/bank.js';
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

const EditBankDetailScreen = props =>
{

  //states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isFav, setIsFav] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() =>{

  //     const saveDatatoStorage = async() => 
  //     {

  //         try
  //         {
  //             await AsyncStorage.setItem(
  //                 'favorites',
  //                 JSON.stringify({
  //                     favorites : isFav
  //                 })
  //             );
      
  //         }
  //         catch(err)
  //         {

  //         }
          
  //     };

  //     saveDatatoStorage();

  // }, [isFav]);

  
  //get bank ID (if in edit mode)
  const bankID = props.navigation.getParam('bankID');

  const editedBank = useSelector(state => state.storedBanks.userBanks.find(bank => bank.id === bankID));

  const [formState, dispatchFormState] = useReducer(formReducer, {

    inputValues : 
    {
      bankName : editedBank ? editedBank.bankName : '',
      accType : editedBank ? editedBank.accType : '',
      accNum : editedBank ? editedBank.accNum : '',
      pin : editedBank ? editedBank.pin : '',
      branchAddr : editedBank ? editedBank.branchAddr : '',
      branchPhone : editedBank ? editedBank.branchPhone : '',
      folder : editedBank ? editedBank.folder : '',
    },

    inputValidities : 
    {
      bankName : editedBank ? true : false,
      accType : editedBank ? true : false,
      accNum : editedBank ? true : false,
      pin : editedBank ? true : false,
      branchAddr : editedBank ? true : false,
      branchPhone : editedBank ? true : false,
      folder : editedBank ? true : false,
    },

    formIsValid : editedBank ? true : false

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
      if(editedBank)
      {

        await dispatch (
          bankActions.updateBanks (
            bankID,
            formState.inputValues.bankName,
            formState.inputValues.accType,
            formState.inputValues.accNum,
            formState.inputValues.pin,
            formState.inputValues.branchAddr,
            formState.inputValues.branchPhone,
            formState.inputValues.folder,
          )

        );

      }
      else //add mode
      { 

        await dispatch (
          bankActions.createBanks (
            formState.inputValues.bankName,
            formState.inputValues.accType,
            formState.inputValues.accNum,
            formState.inputValues.pin,
            formState.inputValues.branchAddr,
            formState.inputValues.branchPhone,
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

  }, [dispatch, bankID, formState]);

  useEffect(() => {
    
      props.navigation.setParams({submit : submitHandler});

  }, [submitHandler]);

  //input change handler function
  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {

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
              id="bankName"
              label="Bank Name"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter bank name"
              onInputChange={inputChangeHandler}
              initialValue={editedBank ? editedBank.bankName : ''}
              initiallyValid={!!editedBank}
            />
            <Input
              id="accType"
              label="Account Type"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter account type"
              onInputChange={inputChangeHandler}
              initialValue={editedBank ? editedBank.accType : ''}
              initiallyValid={!!editedBank}
            />
            <Input
              id="accNum"
              label="Account Number"
              keyboardType="default"
              required
              returnKeyType = "next"
              errorText="Please enter account number"
              onInputChange={inputChangeHandler}
              initialValue={editedBank ? editedBank.accNum : ''}
              initiallyValid={!!editedBank}
            />
            <Input
              id="pin"
              label="PIN"
              keyboardType="decimal-pad"
              required
              errorText="Please enter PIN"
              onInputChange={inputChangeHandler}
              initialValue={editedBank ? editedBank.pin : ''}
              initiallyValid={!!editedBank}
            />
            <Input
              id="branchAddr"
              label="Branch Address"
              keyboardType="default"
              errorText="Please enter the bank's branch address"
              onInputChange={inputChangeHandler}
              initialValue={editedBank ? editedBank.branchAddr : ''}
              initiallyValid={!!editedBank}
            />
            <Input
              id="branchPhone"
              label="Branch Phone Number"
              keyboardType="decimal-pad"
              errorText="Please enter the bank's branch phone number"
              onInputChange={inputChangeHandler}
              initialValue={editedBank ? editedBank.branchPhone : ''}
              initiallyValid={!!editedBank}
            />
            <Input
              id="folder"
              label="Folder"
              keyboardType="default"
              required
              errorText="Please enter the folder to put this data in"
              onInputChange={inputChangeHandler}
              initialValue={editedBank ? editedBank.folder : ''}
              initiallyValid={!!editedBank}
            />

            {editedBank ? 
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

EditBankDetailScreen.navigationOptions = navData => {
  
  //const submitFn = navData.navigation.getParam('submit');

  return {

    //check whether to display edit or add text
    headerbankName : navData.navigation.getParam('bankID') ? "Edit" : "Add",
    // headerRight : () =>

    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       bankName = "Save"
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
  
export default EditBankDetailScreen;