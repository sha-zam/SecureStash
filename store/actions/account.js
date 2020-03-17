//models 
import Account from '../../models/account.js';

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const SET_ACCOUNT = 'SET_ACCOUNT';

//fecth passwords
export const fetchAccounts = () =>
{

    return async (dispatch, getState) => {

        //get userID
        const userID = getState().auth.userId;

        try
        {
            //fetch from database 
            const response = await fetch ('https://fyp-s3curest4sh.firebaseio.com/Passwords.json');

            if (!response.ok)
            {
                throw new Error('Something went wrong!');
            }
            
            //get response
            const resData = await response.json();
            //console.log(resData);
            const loadedAccounts = [];
            
            //console.log('check1')
            
            for (const key in resData)
            {
                console.log(resData[key].userID);

                loadedAccounts.push(
                    new Account(
                        key, 
                        resData[key].userID, 
                        resData[key].title, 
                        resData[key].URL, 
                        resData[key].username, 
                        resData[key].password
                    )
                );
            }

            //dispatch action
            dispatch({
                type : SET_ACCOUNT,
                userAccounts : loadedAccounts.filter(acc => acc.userID === userID)
            });
        }
        catch (err)
        {
            throw err;
        }

    };

};

export const createAccounts = (title, URL, username, password) => 
{

    return async (dispatch, getState) => { 

        const token = getState().auth.token;
        const userID = getState().auth.userId;

        //await response
        const response = await fetch(

            `https://fyp-s3curest4sh.firebaseio.com/Passwords.json?auth=${token}`,
            {
                method : 'POST',
                headers : 
                {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    title, 
                    URL, 
                    username, 
                    password,
                    userID
                })
            }

        );

        const resData = await response.json();

        dispatch({
            type : CREATE_ACCOUNT, 
            accountData : 
            {
                id : resData.name,
                userID,
                title, 
                URL, 
                username, 
                password,      
            }
        });
    };
};

export const updateAccount = (id, title, URL, username, password) => {

    return { 
        type : UPDATE_ACCOUNT,
        aid : id, 
        accountData : 
        {
            title, 
            URL, 
            username, 
            password
        }
    };

}