//cryptography
import * as Crypto from 'expo-crypto'; //SHA256
import * as Keychain from 'react-native-keychain'

export const sendPwdReset = (email) =>
{
    return async () =>
    {
        
        console.log(email)

        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
        {
            method : 'POST',

            headers : 
            {
                'Content-type' : 'application/json' ,
            },

            body :JSON.stringify({
                requestType : 'PASSWORD_RESET',
                email : email
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

            console.log(message)
  
            throw new Error(message);
        }

        const resData = await response.json();
        console.log("resData : " + resData.email)
    }
}

export const changePwd = (newPwd, token) =>
{

    return async() =>
    {
        //get token
        //const token = getState().auth.token;

        //hash the encryption
        //var pwdDigest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, newPwd);
        //console.log("pwd digest : " + pwdDigest);

        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',
        {
            method : 'POST',

            headers : 
            {
                'Content-type' : 'application/json' ,
            },

            body :JSON.stringify({
                idToken : token,
                password : newPwd,
                returnSecureToken : true
            })
        });

        console.log(response);

        if (!response.ok) 
        {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;

            let message = 'Something went wrong!';

            if (errorId === 'INVALID_ID_TOKEN') 
            {
                message = 'Invalid ID Token!';
            } 
            else
            {
                message = 'Password is too weak! Please enter a password with more than 8 characters!'
            }

            console.log(message)
  
            throw new Error(message);
        }

        //retrieve keychain
        const credentials = await Keychain.getGenericPassword();

        //reset keychain
        await Keychain.resetGenericPassword();

        //input new password to keychain
        await Keychain.setGenericPassword(credentials.username, newPwd);

        const resData = await response.json();
        console.log("resData : " + resData.email)
    }
   

}

export const deleteAccount = (token) =>
{
    return async() =>
    {
        console.log("dispatching delteete");

        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4', 
        {
            method : 'POST',

            headers :
            {
                'Content-type' : 'application/json'
            },

            body : JSON.stringify({
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
                message = 'Invalid ID token';
            } 
            else
            {
                message = 'User not found';
            }

            throw new Error(message);
        }
    }
    
}