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

const LoginScreen = props => {

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

    action = authActions.login(
    formState.inputValues.email,
    formState.inputValues.password
    );
    
    setError(null);
    setIsLoading(true);

    try 
    {
        await dispatch(action);
        props.navigation.navigate('Tab');  
     
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
                  title='Login'
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer2}>
                <Text 
                    style={{color : Colors.primary}}
                    onPress={() => {
                        
                    }}
                >
                    Forgot Password?
                </Text>
            </View>
            <View style={styles.buttonContainer2}>
                <Text>Don't have an account? </Text>
                <Text 
                    style={{color : Colors.primary}}
                    onPress={() => {
                        props.navigation.navigate('Signup')
                    }}
                >
                    Sign Up
                </Text>
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>

  );
};

LoginScreen.navigationOptions = {
  headerTitle: 'SecureStash'
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

export default LoginScreen;
