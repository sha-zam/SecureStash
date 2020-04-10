import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Linking,
  Text
} from 'react-native';

import qs from 'qs';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import firebase from 'firebase';

import Input from '../components/Input';
import Card from '../components/Card';
import Colors from '../constants/Colors';

//actions
import * as userActions from '../store/actions/user.js';

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

const ForgotPasswordScreen = props => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: 
    {
      email: '',
      password: ''
    },

    inputValidities: 
    {
      email: false,
      password: false
    },

    formIsValid: false

  });

  useEffect(() => {

    if (error) 
    {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }

  }, [error]);


  const forgotPwdHandler = async () => 
  {
    let action;

    action = userActions.sendPwdReset(formState.inputValues.email);

    setError(null);
    setIsLoading(true);

    try 
    {
        await dispatch(action);

        Alert.alert('Email Sent', 
            'Please check your email for instructions on how to reset your password', 
            [{ text: 'Okay' }]
        );

        props.navigation.goBack();
        
    } 
    catch (err) 
    {
        setError(err.message);
        setIsLoading(false);
    }

  };

  const inputChangeHandler = useCallback(

    (inputIdentifier, inputValue, inputValidity) => 
    {

      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });

    }, [dispatchFormState]

  );

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
              id="email"
              label="Please enter your registered e-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
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
                  title='Reset Password'
                  color={Colors.primary}
                  onPress={forgotPwdHandler}
                />
              )}
            </View>
            
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>

  );
};

ForgotPasswordScreen.navigationOptions = 
{

  headerTitle: 'SecureStash',
  headerBackTitle : 'Login'

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

  buttonContainer2 :
  {
    flexDirection : 'row',
    //marginLeft : 20,
    //marginTop : 20,
    margin : 10,
    justifyContent : 'center'
  }

});

export default ForgotPasswordScreen;
