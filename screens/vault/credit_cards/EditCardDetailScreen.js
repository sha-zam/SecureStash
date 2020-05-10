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

import { ActivityIndicator } from 'react-native-paper';

//redux
import { useSelector, useDispatch } from 'react-redux';

//components import 
import Input from '../../../components/Input.js';
import HeaderButton from '../../../components/HeaderButton.js';

//constants import
import Colors from '../../../constants/Colors.js';

//actions import
import * as cardActions from '../../../store/actions/card.js';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

const EditCardDetailScreen = props =>
{

  //states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isFav, setIsFav] = useState(false);

  const dispatch = useDispatch();

  //get card ID (if in edit mode)
  const cardID = props.navigation.getParam('cardID');

  const editedCard = useSelector(state => state.storedCards.userCards.find(card => card.id === cardID));

  const [formState, dispatchFormState] = useReducer(formReducer, {

    inputValues : 
    {
      title : editedCard ? editedCard.title : '',
      nameOnCard : editedCard ? editedCard.nameOnCard : '',
      type : editedCard ? editedCard.type : '',
      number : editedCard ? editedCard.number : '',
      cvv : editedCard ? editedCard.cvv : '',
      expDate : editedCard ? editedCard.expdate : '',
      folder : editedCard ? editedCard.folder : '',
    },

    inputValidities : 
    {

        title : editedCard ? true : false,
        nameOnCard : editedCard ? true : false,
        type : editedCard ? true : false,
        number : editedCard ? true : false,
        cvv : editedCard ? true : false,
        expDate : editedCard ? true : false,
    },

    formIsValid : editedCard ? true : false

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
      if(editedCard)
      {

        await dispatch (
          cardActions.updateCards (
            cardID,
            formState.inputValues.title,
            formState.inputValues.nameOnCard,
            formState.inputValues.type,
            formState.inputValues.number,
            formState.inputValues.cvv,
            formState.inputValues.expDate,
            formState.inputValues.folder,
          )

        );

      }
      else //add mode
      { 

        await dispatch (
          cardActions.createCards (
            formState.inputValues.title,
            formState.inputValues.nameOnCard,
            formState.inputValues.type,
            formState.inputValues.number,
            formState.inputValues.cvv,
            formState.inputValues.expDate,
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

  }, [dispatch, cardID, formState]);

  useEffect(() => {
    
      props.navigation.setParams({submit : submitHandler});

  }, [submitHandler]);

  //input change handler function
  const inputChangeHandler = useCallback( (inputIdentifier, inputValue, inputValidity) => 
  {

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
                initialValue={editedCard ? editedCard.title : ''}
                initiallyValid={!!editedCard}
            />
            <Input
                id="nameOnCard"
                label="Name On Card"
                keyboardType="default"
                required
                returnKeyType = "next"
                errorText="Please enter a valid name"
                onInputChange={inputChangeHandler}
                initialValue={editedCard ? editedCard.nameOnCard : ''}
                initiallyValid={!!editedCard}
            />
           
            <Input
                id="type"
                label="Type"
                keyboardType="default"
                required
                returnKeyType = "next"
                errorText="Please enter a valid card type"
                onInputChange={inputChangeHandler}
                initialValue={editedCard ? editedCard.type : ''}
                initiallyValid={!!editedCard}
            />
            <Input
                id="number"
                label="Card Number"
                keyboardType="decimal-pad"
                required
                errorText="Please enter a valid card number"
                onInputChange={inputChangeHandler}
                initialValue={editedCard ? editedCard.number : ''}
                initiallyValid={!!editedCard}
            />
            <Input
                id="cvv"
                label="Security Code"
                keyboardType="decimal-pad"
                required
                errorText="Please enter a valid security code"
                onInputChange={inputChangeHandler}
                initialValue={editedCard ? editedCard.cvv : ''}
                initiallyValid={!!editedCard}
            />
            <Input
                id="expDate"
                label="Expiration Date (MM/YYYY)"
                keyboardType="default"
                required
                expDate
                errorText="Please enter a valid expiration date"
                onInputChange={inputChangeHandler}
                initialValue={editedCard ? editedCard.expDate : ''}
                initiallyValid={!!editedCard}
            />
            <Input
                id="folder"
                label="Folder"
                keyboardType="default"
                required
                errorText="Please enter a valid folder"
                onInputChange={inputChangeHandler}
                initialValue={editedCard ? editedCard.folder : ''}
                initiallyValid={!!editedCard}
            />
            
            {editedCard ? 
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

EditCardDetailScreen.navigationOptions = navData => {
  
  //const submitFn = navData.navigation.getParam('submit');

  return {

    //check whether to display edit or add text
    headerTitle : navData.navigation.getParam('cardID') ? "Edit" : "Add",
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
  
export default EditCardDetailScreen;