import { useSelector } from 'react-redux';

export const sendPwdReset = (email) =>
{
    return async () =>
    {
        
        console.log(userEmail)
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=[API_KEY]',{
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

            // let message = 'Something went wrong!';

            // if (errorId === 'EMAIL_NOT_FOUND') 
            // {
            //     message = 'This email could not be found!';
            // } 
            // else if (errorId === 'INVALID_PASSWORD') 
            // {
            //     message = 'This password is not valid!';
            // }
            throw new Error(errorId);
        }

        const resData = await response.json();
        console.log(resData.email)
    }
}