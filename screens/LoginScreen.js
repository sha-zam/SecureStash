import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {

  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text,
  Platform

} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import * as LocalAuthentication from 'expo-local-authentication';
import * as Keychain from 'react-native-keychain';

import Input from '../components/Input';
import Card from '../components/Card';
import Colors from '../constants/Colors';

//actions
import * as accountsActions from '../store/actions/account.js';
import * as authActions from '../store/actions/auth';
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

const AuthOptions = 
{

  promptMessage : 'Scan Biometrics',
  fallbackLabel : 'Please enter your passcode'
  
}

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

  const scanBiometrics = async () => 
  {
    let result = await LocalAuthentication.authenticateAsync('Biometric Scan');
  };

  const showAndroidAlert = () => 
  {
    Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
    scanBiometrics();
  };
  
  const authHandler = async () => 
  {
    //check device's biometrics capability
    //let compatible = await LocalAuthentication.hasHardwareAsync();

    // try {
    //   // Retrieve the credentials
    //   const credentials = await Keychain.getGenericPassword();
    //   if (credentials) {
    //     console.log(
    //       'Credentials successfully loaded for user ' + credentials.username
    //     );
    //   } else {
    //     console.log('No credentials stored');
    //   }
    // } catch (error) {
    //   console.log("Keychain couldn't be accessed!", error);
    // }
    
    // const credentials = await Keychain.getGenericPassword();

    // if (credentials)
    // {
    //   console.log(
    //           'Credentials successfully loaded for user ' + credentials.username
    //         );
    //   if (compatible)
    //   {
    //       let result = await LocalAuthentication.authenticateAsync(AuthOptions);

    //       if (result.success)
    //       {
    //         props.navigation.navigate('Tab')
    //       } 
    //       else
    //       {
    //         Alert.alert('An Error Occurred!', 'Fail', [{ text: 'Okay' }]);
    //       }
      
    //   }
    // }
    // else //fallback to password
    // {
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
          //const test = await LocalAuthentication.supportedAuthenticationTypesAsync();

          //console.log(test);

          props.navigation.navigate('Tab');  
      
      } 
      catch (err) 
      {
          setError(err.message);
          setIsLoading(false);
      }
    //}

  };

  const inputChangeHandler = useCallback(

    (inputIdentifier, inputValue, inputValidity) => 
    {
      dispatchFormState ({
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
              {isLoading ? 
              (
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
              {isLoading ? 
              (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) 
              : 
              (
                <Text 
                    style={{color : Colors.primary}}
                    onPress={() => {props.navigation.navigate('ForgotPwd')}}
                >
                    Forgot Password?
                </Text>
              )}
            </View>
            <View style={styles.buttonContainer2}>
                <Text>Don't have an account? </Text>
                <Text 
                    style={{color : Colors.primary}}
                    onPress={() => { props.navigation.navigate('Signup')}}
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
