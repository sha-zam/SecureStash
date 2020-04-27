import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {

  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  AsyncStorage

} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';

//comonents import
import Input from '../../components/Input.js';
import Card from '../../components/Card.js';

//constants import
import Colors from '../../constants/Colors';

//actions
import * as userActions from '../../store/actions/user.js';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => 
{

  if (action.type === FORM_INPUT_UPDATE) 
  {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    }; 

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };

    let updatedFormIsValid = true;

    for (const key in updatedValidities) 
    {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };

  }

  return state;

};

const DeleteAccountScreen = props => 
{

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();
  //retrieve token
  const token = useSelector(state => state.auth.token)

    const [formState, dispatchFormState] = useReducer(formReducer, 
    {
        inputValues: 
        {
            password: ''
        },

        inputValidities: 
        {
            password: false
        },

        formIsValid: false

    });

    useEffect(() => 
    {
        if (error) 
        {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }

    }, [error]);

    const showAlert = () =>
    {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? (This action is irreversible)',
        [

          {
              text: "No",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
          },
          { 
              text: "Yes", 
              onPress: () => {deleteAccHandler()}
          }
        ],
      )
    }


    const deleteAccHandler = async () => 
    {

      //retrieve password from keychain
      let key = await Keychain.getGenericPassword();

      //check if user has entered the correct password
      if(formState.inputValues.password == key.password)
      {
        console.log(formState.inputValues.password + " = " + key.password);
        
        //reset keychain
        await Keychain.resetGenericPassword();

        let action = userActions.deleteAccount(token);

        setError(null);
        setIsLoading(true);
  
        try 
        {
            await dispatch(action);

            AsyncStorage.removeItem('biometrics');
  
            Alert.alert(
              'Account Deleted', 
              'Your Account has been successfully deleted', 
              [{ text: 'Okay' }]
            );
  
            props.navigation.navigate('Auth');
            
        } 
        catch (err) 
        {
            setError(err.message);
            setIsLoading(false);
        }
  
      }
      else
      {
        setError('Invalid password');
      }

     
  };

  const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => 
  {

    dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
    });

  }, [dispatchFormState]);

  return (

      <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={50}
          style={styles.screen}
      >
        <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.gradient}>
          <Card style={styles.authContainer}>
            <ScrollView>
                <Input
                    id="password"
                    label="Please enter your Master Password to delete your account"
                    keyboardType="default"
                    secureTextEntry
                    required
                    autoCapitalize="none"
                    errorText="Please enter a valid password."
                    onInputChange={inputChangeHandler}
                    initialValue=""
                />
                <View style={styles.buttonContainer}>
                {isLoading ? 
                (
                    <ActivityIndicator size="small" color={Colors.primary} />
                ) : 
                (
                    <Button
                        title='Delete Account'
                        color={Colors.primary}
                        onPress={showAlert}
                    />
                )}
                </View>
                
            </ScrollView>
          </Card>
        </LinearGradient>
      </KeyboardAvoidingView>

    );
};

DeleteAccountScreen.navigationOptions = 
{

  headerTitle: 'SecureStash',
  headerBackTitle : 'Back'

};

const styles = StyleSheet.create({

  screen: 
  {
    flex: 1
  },

  gradient: 
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  authContainer: 
  {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
    justifyContent : 'center'
  },

  buttonContainer: 
  {
    marginTop: 10
  },

});

export default DeleteAccountScreen;
