//models 
import Account from '../../models/account.js';

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const SET_ACCOUNT = 'SET_ACCOUNT';

//read
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

            const loadedAccounts = [];
            
            for (const key in resData)
            {
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

//create 
export const createAccounts = (title, URL, username, password) => 
{

    return async (dispatch, getState) => { 

        const token = getState().auth.token;
        const userID = getState().auth.userId;

        console.log(userID);

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

//update
export const updateAccounts = (id, title, URL, username, password) => 
{

    return async (dispatch, getState) => {

      const token = getState().auth.token;

      const response = await fetch(

        `https://fyp-s3curest4sh.firebaseio.com/Passwords/${id}.json?auth=${token}`,
        {
            method: 'PATCH',

            headers: 
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                title,
                URL,
                username,
                password
            })
        }

      );
  
      if (!response.ok) 
      {
        throw new Error('Something went wrong!');
      }
  
      dispatch({
        type: UPDATE_ACCOUNT,
        aid: id,

        accountData: {
          title,
          URL,
          username,
          password
        }

      });

    };
};

//delete
export const deleteAccounts = accountID => 
{

    return async (dispatch, getState) =>
    {
        //get token
        const token = getState().auth.token;

        //await response
        const response = await fetch (
            `https://fyp-s3curest4sh.firebaseio.com/Passwords/${accountID}.json?auth=${token}`,
            {
                method : 'DELETE'
            }
        );

        //check
        if(!response.ok)
        {
            throw new Error('Something went wrong!');
        }

        //dispatch
        dispatch({
            
            type : DELETE_ACCOUNT,
            aid : accountID

        });

    };

};
