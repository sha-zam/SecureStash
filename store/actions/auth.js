//storage
import { AsyncStorage } from 'react-native' 

//cryptography
import { RNSimpleCrypto } from 'react-native-simple-crypto';
import { RSA } from 'react-native-rsa-native';
import * as Crypto from 'expo-crypto'; //SHA256
import SimpleCrypto from "simple-crypto-js"; //AES CBC
//import { virgilCrypto } from 'react-native-virgil-crypto';
//import RNSimpleCrypto from 'react-native-simple-crypto';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const saveDatatoStorage = (userId, token) => 
{
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      userId : userId,
      token : token
    })
  );
}

//signup
export const signup = (email, password) => 
{

  return async dispatch => {

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

  return async dispatch => {

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
    //console.log(resData);
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

  return {
    type : LOGOUT
  };
  
};


