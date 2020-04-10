import { useSelector } from 'react-redux';

export const sendPwdReset = (email) =>
{
    return async () =>
    {
        
        console.log(email)

        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDQrqU62NsHJbA5vVcSf-UCPPwtIH6Fwr4',{
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