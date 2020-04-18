//storage
import { AsyncStorage } from 'react-native' 

//cryptography
import * as Crypto from 'expo-crypto'; //SHA256
import * as Keychain from 'react-native-keychain';
import {RSA, RSAKeychain} from 'react-native-rsa-native';
//import RNSmtpMailer from "react-native-smtp-mailer";

import RNSimpleCrypto from "react-native-simple-crypto";
import { Mailer } from 'react-native-mail'
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const keyTag = 'securestash.com';
let timer;

//send email verification
export const sendEmailVerification = async(email) =>
{
  try
  {
    const sendMail = Mailer.mail({
      subject: 'need help',
      recipients: [email],
      ccRecipients: ['supportCC@example.com'],
      bccRecipients: ['supportBCC@example.com'],
      body: '<b>A Bold Body</b>',
      isHTML: true,
      attachment: {
        path: '',  // The absolute path of the file from which to read data.
        type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf, csv
        name: '',   // Optional: Custom filename for attachment
      }
    });

    console.log(sendMail);
  }
  catch(err)
  {
    console.log(err);
  }
  
};

//confirm email verification
export const confirmEmailVerification = () =>
{

  return async dispatch => 
  {

    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
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
    console.log(resData.email);

  };

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
        password: pwdDigest,
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
    //sendEmailVerification(email);

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

    // console.log("login");

    // const secret = password;

    // const ret = await AsyncStorage.getItem('keys2');

    // let key1;
    // let key2;

    // if(!ret)
    // {
    //   const rsaKeys = await RNSimpleCrypto.RSA.generateKeys(1024);
    //   console.log("RSA1024 private key", rsaKeys.private);
    //   console.log("RSA1024 public key", rsaKeys.public);

    //   key1 = rsaKeys.private;
    //   key2 = rsaKeys.public;

    //   AsyncStorage.setItem(
    //     'keys2',
    //     JSON.stringify({
    //       privateKey : rsaKeys.private,
    //       publicKey : rsaKeys.public
    //     })
    //   );
      
    // }
    // else
    // {
    //   const parseData = JSON.parse(ret);
    //   const { privateKey, publicKey } = parseData;

    //   key1 = privateKey;
    //   key2 = publicKey;

    //   console.log('RSA1024 private key', key1) // the private key
    //   console.log('RSA1024 public key', key2) // the public key
    // }

    // const rsaEncryptedMessage = await RNSimpleCrypto.RSA.encrypt(
    //   password,
    //   key2
    // );

    // console.log("rsa Encrypt:", rsaEncryptedMessage);

    
    //hash the encryption
    var pwdDigest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
    console.log("pwd digest : " + pwdDigest);

    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
    {
      method: 'POST',

      headers: 
      {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email: email,
        password: pwdDigest,
        returnSecureToken: true
      })

    });

    if (!response.ok) 
    {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      let message = 'Something went wrong!';

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
    
    let credentials = await Keychain.getGenericPassword();

    console.log(email);

    console.log(credentials.username + " " + credentials.password);

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

