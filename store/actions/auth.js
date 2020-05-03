//storage
import { AsyncStorage } from 'react-native' 

//cryptography
import * as Crypto from 'expo-crypto'; //SHA256
import * as Keychain from 'react-native-keychain';
import {RSA, RSAKeychain} from 'react-native-rsa-native';
//import RNSmtpMailer from "react-native-smtp-mailer";

import { Mailer } from 'react-native-mail'
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

let timer;

//send email verification
export const sendEmailVerification = async(token) =>
{
  const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
  {
    method: 'POST',

    headers: 
    {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      requestType : 'VERIFY_EMAIL',
      idToken : token
    })

  });

  if (!response.ok) 
  {
    const errorResData = await response.json();
    const errorId = errorResData.error.message;

    let message = 'Something went wrong!';

    if (errorId === 'INVALID_ID_TOKEN') 
    {
      message = 'Invalid ID token!';
    }
    else
    {
      message = 'user not found!';
    }


    throw new Error(message);
  }

  const resData = await response.json();
  
};

//confirm email verification
const confirmEmailVerification = async(token) =>
{
 
  const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
  {
    method: 'POST',

    headers: 
    {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      idToken : token
    })

  });

  if (!response.ok) 
  {
    const errorResData = await response.json();
    const errorId = errorResData.error.message;

    let message = 'Something went wrong!';

    if (errorId === 'INVALID_ID_TOKEN') 
    {
      message = 'Invalid ID token!';
    }
    else
    {
      message = 'user not found!';
    }


    throw new Error(message);
  }

  const resData = await response.json();

  if(resData.users[0].emailVerified === false)
  {
    console.log("returning false")
    return false;
  }
  else
  {
    console.log("returning true")
    return true;
  }

};

//signup
export const signup = (email, password) => 
{

  return async dispatch => 
  {

    console.log("signup");

    //hash the encryption
    var pwdDigest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
    console.log("pwd digest : " + pwdDigest);

    //send encrypted password
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
    {
      method: 'POST',

      headers: 
      {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })

    });

    if (!response.ok) 
    {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      let message = 'Something went wrong!';

      if (errorId === 'EMAIL_EXISTS') 
      {
        message = 'This email exists already!';
      }

      throw new Error(message);
    }

    const resData = await response.json();

    //Send verification email
    sendEmailVerification(resData.idToken);

    dispatch({ 
      type: SIGNUP, 
      token: resData.idToken, 
      userId: resData.localId, 
      email : email 
    });

  };

};

//login
export const login = (email, password) => 
{

  return async dispatch => 
  {

    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
    {
      method: 'POST',

      headers: 
      {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })

    });

    let message = 'Something went wrong!';

    if (!response.ok) 
    {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      if (errorId === 'EMAIL_NOT_FOUND') 
      {
        message = 'This email could not be found!';
      } 
      else if (errorId === 'INVALID_PASSWORD') 
      {
        message = 'This password is not valid!';
      }

      throw new Error(message);
    }

    const resData = await response.json();

    console.log("checking " + confirmEmailVerification(resData.idToken) == false)

    //if user has not performed email verification
    if(confirmEmailVerification(resData.idToken) === false) 
    {
      console.log("throwing error")
      message = 'Please verify email before logging in';

      throw new Error(message);
    }

    const timer = await AsyncStorage.getItem('autologout');

    if(timer)
    {
      const parseData = JSON.parse(timer);
      const { autologout } = parseData;

      if(autologout != 'Never')
      {
        //start timer in milliseconds
        dispatch(setLogoutTimer(parseInt(autologout) * 60000));
      }

    }

    // Store the credentials
    await Keychain.setGenericPassword(email, password);

    dispatch({ 
      type: LOGIN, 
      token: resData.idToken, 
      userId: resData.localId,
      email : email
    });

  };

};

//logout
export const logout = () => 
{
  //clear timer set by the user
  clearLogoutTimer();

  //then, logout
  return {
    type : LOGOUT
  };
  
};

const clearLogoutTimer = () =>
{

  if(timer)
  {
    clearTimeout(timer);
  }

}

export const setLogoutTimer = (logoutTime) =>
{

  return dispatch =>
  {
    timer = setTimeout(() => {
      dispatch(logout());

    }, logoutTime);
  };

}

