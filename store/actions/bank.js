//models 
import Bank from '../../models/bank.js';

export const CREATE_BANK = 'CREATE_BANK';
export const DELETE_BANK = 'DELETE_BANK';
export const UPDATE_BANK = 'UPDATE_BANK';
export const UPDATE_BANK_FAV = 'UPDATE_BANK_FAV';
export const SET_BANK = 'SET_BANK';

//read
export const fetchBanks = () =>
{

    return async (dispatch, getState) => {

        //get userID
        const userID = getState().auth.userId;

        try
        {
            //fetch from database 
            const response = await fetch ('https://fyp-s3curest4sh.firebaseio.com/Banks.json');

            if (!response.ok)
            {
                throw new Error('Something went wrong!');
            }
            
            //get response
            const resData = await response.json();

            const loadedBanks = [];
            
            for (const key in resData)
            {
                loadedBanks.push(
                    new Bank(
                        key, 
                        resData[key].userID, 
                        resData[key].bankName, 
                        resData[key].accType, 
                        resData[key].accNum, 
                        resData[key].pin, 
                        resData[key].branchAddr,
                        resData[key].branchPhone,
                        resData[key].folder,
                        resData[key].favorite
                    )
                );
            }

            //dispatch action
            dispatch({
                type : SET_BANK,
                userBanks : loadedBanks.filter(bank => bank.userID === userID)
            });
        }
        catch (err)
        {
            throw err;
        }

    };

};

//create 
export const createBanks = (bankName, accType, accNum, pin, branchAddr, branchPhone, folder, favorite) => 
{
    return async (dispatch, getState) => { 

        const token = getState().auth.token;
        const userID = getState().auth.userId;

        console.log(userID);

        //await response
        const response = await fetch(

            `https://fyp-s3curest4sh.firebaseio.com/Banks.json?auth=${token}`,
            {
                method : 'POST',
                headers : 
                {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    userID,
                    bankName, 
                    accType, 
                    accNum, 
                    pin, 
                    branchAddr,
                    branchPhone,
                    folder,
                    favorite
                })
            }

        );

        const resData = await response.json();

        dispatch({
            type : CREATE_BANK, 
            bankData : 
            {
                id : resData.name,
                userID,
                bankName, 
                accType, 
                accNum, 
                pin, 
                branchAddr,
                branchPhone,
                folder,
                favorite
            }
        });
    };
};

//update
export const updateBanks = (id, bankName, accType, accNum, pin, branchAddr, branchPhone, folder) => 
{

    return async (dispatch, getState) => {

      const token = getState().auth.token;

      const response = await fetch(

        `https://fyp-s3curest4sh.firebaseio.com/Banks/${id}.json?auth=${token}`,
        {
            method: 'PATCH',

            headers: 
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                bankName, 
                accType, 
                accNum, 
                pin, 
                branchAddr,
                branchPhone,
                folder,
            })
        }

      );
  
      if (!response.ok) 
      {
        throw new Error('Something went wrong!');
      }
  
      dispatch({
        type: UPDATE_BANK,
        bid: id,

        bankData: {
            bankName, 
            accType, 
            accNum, 
            pin, 
            branchAddr,
            branchPhone,
            folder,
        }

      });

    };
};

//update favorites
export const updateBankFav = (id, favorite) => 
{

    return async (dispatch, getState) => {

      const token = getState().auth.token;

      const response = await fetch(

        `https://fyp-s3curest4sh.firebaseio.com/Banks/${id}.json?auth=${token}`,
        {
            method: 'PATCH',

            headers: 
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                favorite
            })
        }

      );
  
      if (!response.ok) 
      {
        throw new Error('Something went wrong!');
      }
  
      dispatch({
        type: UPDATE_BANK_FAV,
        bid: id,

        bankData: {
          favorite
        }

      });

    };
};

//delete
export const deleteBanks = bankID => 
{

    return async (dispatch, getState) =>
    {
        //get token
        const token = getState().auth.token;

        //await response
        const response = await fetch (
            `https://fyp-s3curest4sh.firebaseio.com/Banks/${bankID}.json?auth=${token}`,
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
            
            type : DELETE_BANK,
            bid : bankID

        });

    };

};
