import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import qs from 'qs';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import firebase from 'firebase';

import Input from '../components/Input';
import Card from '../components/Card';
import Colors from '../constants/Colors';

//actions
import * as accountsActions from '../store/actions/account.js';
import * as authActions from '../store/actions/auth';

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

const AuthScreen = props => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
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

  // const sendEmail = async (to, subject, body, options = {}) =>
  // {
  //   const { cc, bcc } = options;

  //   let url = `mailto:${to}`;

  //   // Create email link query
  //   const query = qs.stringify ({

  //       subject: subject,
  //       body: body,
  //       cc: cc,
  //       bcc: bcc

  //   });

  //   if (query.length) 
  //   {
  //       url += `?${query}`;
  //   }

  //   // check if we can use this link
  //   const canOpen = await Linking.canOpenURL(url);

  //   if (!canOpen) 
  //   {
  //       throw new Error('Provided URL can not be handled');
  //   }

  //   return Linking.openURL(url);

  // }

  // const verifyEmail = () =>
  // {
  //     var user = firebase.auth().currentUser;
  
  //     user.sendEmailVerification().then(() => {
  //       // Email sent.
  
  //     }).catch(function (error) {
  //       // An error happened.
  //     });
  
    
  // }

  const authHandler = async () => {

    let action;

    if (isSignup) 
    {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } 
    else 
    {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }

    setError(null);
    setIsLoading(true);

    try 
    {
      await dispatch(action);
      //fetchUserAccounts();

      if(isSignup)
      {

        //await dispatch(authActions.verifyEmail());

        Alert.alert('Sign up successful!', 'Please log in with your new account to continue', [{ text: 'Okay' }]);
        
        //verifyEmail();

        // sendEmail(formState.inputValues.email, 'Confirmation Email', 'Welcome to SecureStash, Your Registration was succesful!', {})
        // .then(() => {
        //   console.log('Email sent successfully')
        // });

        setIsLoading(false);
      }
      else
      {
        props.navigation.navigate('Tab');
      }
     
    } catch (err) 
    {
      setError(err.message);
      setIsLoading(false);
    }

  };

  const inputChangeHandler = useCallback(

    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
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
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={8}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? 'Sign Up' : 'Login'}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title= {isSignup ? 'Login' : 'Sign Up'}
                color={Colors.primary}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>

  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'SecureStash'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default AuthScreen;
