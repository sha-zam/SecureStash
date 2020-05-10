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

const ChangePasswordScreen = props => 
{

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
 
    const [formState, dispatchFormState] = useReducer(formReducer, 
    {
        inputValues: 
        {
            password1: '',
            password2: '',
        },

        inputValidities: 
        {
            password1: false,
            password2: false
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

    const changePwdHandler = async() => 
    {

        if(formState.inputValues.password1 === formState.inputValues.password2)
        {

            let action;

            action = userActions.changePwd(formState.inputValues.password1, token);

            setError(null);
            setIsLoading(true);

            try 
            {

                dispatch(action);

                Alert.alert(
                'Master Password Changed', 
                'Your master password has been successfully changed', 
                [{ text: 'Okay' }]
                );
    
                props.navigation.goBack();
                
            } 
            catch (err) 
            {
                setError(err.message);
                setIsLoading(false);
            }

        }
        else
        {
            setError('Passwords do not match!')
        }
        
     
    };

    const showAlert = () =>
    {

      //check form validity
      if(!formState.formIsValid)
      {
        Alert.alert('Invalid Inputs!', 'Please check again!');

        return;
      }

      Alert.alert(
        'Change Master Password',
        'Are you sure you want to change your master password? (This action is irreversible)',
        [

          {
              text: "No",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
          },
          { 
              text: "Yes", 
              onPress: () => {changePwdHandler()}
          }
        ],
      )
    }

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
                        id="password1"
                        label="Please enter your New Master Password"
                        keyboardType="default"
                        secureTextEntry
                        required
                        password
                        minLength={10}
                        autoCapitalize="none"
                        errorText="Please enter a valid password with at least 10 characters in length"
                        onInputChange={inputChangeHandler}
                        initialValue=""
                    />
                    <Input
                        id="password2"
                        label="Please re-enter your New Master Password"
                        keyboardType="default"
                        secureTextEntry
                        required
                        password
                        minLength={10}
                        autoCapitalize="none"
                        errorText="Please enter a valid password with at least 10 characters in length"
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
                            title='Change Password'
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

ChangePasswordScreen.navigationOptions = 
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

export default ChangePasswordScreen;
