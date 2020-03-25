//cryptography
import { RNSimpleCrypto } from 'react-native-simple-crypto';
import { RSA } from 'react-native-rsa-native';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

//signup
export const signup = (email, password) => {

  // //hash password
  // const testHash = async(password) => 
  // {
  //   try
  //   {
  //     const hashedPwd = await RNSimpleCrypto.SHA.sha256(password);
  //     console.log("sha : ", hashedPwd);
  //   }
  //   catch (err)
  //   {
  //     throw(err);
  //   }
    
  // };

  //testHash(password);
 
  // const test = async() =>
  // { 
    
    
  // } ;
  
  // test();

  return async dispatch => {
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
    {
      method: 'POST',
      headers: {
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
    //console.log(resData);
    dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });

  };
};

//login
export const login = (email, password) => {

  return async dispatch => {
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
    dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });

  };
};

//logout
export const logout = () => 
{

  return {
    type : LOGOUT
  };
  
};
