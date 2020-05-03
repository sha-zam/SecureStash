//models 
import Card from '../../models/card.js';

export const CREATE_CARD = 'CREATE_CARD';
export const DELETE_CARD = 'DELETE_CARD';
export const UPDATE_CARD = 'UPDATE_CARD';
export const UPDATE_CARD_FAV = 'UPDATE_CARD_FAV';
export const SET_CARD = 'SET_CARD';

//read
export const fetchCards = () =>
{

    return async (dispatch, getState) => {

        //get userID
        const userID = getState().auth.userId;

        try
        {
            //fetch from database 
            const response = await fetch ('https://fyp-s3curest4sh.firebaseio.com/Cards.json');

            if (!response.ok)
            {
                throw new Error('Something went wrong!');
            }
            
            //get response
            const resData = await response.json();

            const loadedCards = [];
            
            for (const key in resData)
            {
                loadedCards.push(
                    new Card(
                        key, 
                        resData[key].userID, 
                        resData[key].title, 
                        resData[key].nameOnCard, 
                        resData[key].type, 
                        resData[key].number,
                        resData[key].cvv,
                        resData[key].expDate,
                        resData[key].folder,
                        resData[key].favorite,
                    )
                );
            }

            //dispatch action
            dispatch({
                type : SET_CARD,
                userCards : loadedCards.filter(card => card.userID === userID)
            });
        }
        catch (err)
        {
            throw err;
        }

    };

};

//create 
export const createCards = (title, nameOnCard, type, number, cvv, expDate, folder, favorite) => 
{
    return async (dispatch, getState) => { 

        const token = getState().auth.token;
        const userID = getState().auth.userId;

        console.log(userID);

        //await response
        const response = await fetch(

            `https://fyp-s3curest4sh.firebaseio.com/Cards.json?auth=${token}`,
            {
                method : 'POST',
                headers : 
                {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    userID,
                    title, 
                    nameOnCard,
                    type,
                    number,
                    cvv,
                    expDate,
                    folder,
                    favorite
                })
            }

        );

        const resData = await response.json();

        dispatch({
            type : CREATE_CARD, 
            cardData : 
            {
                id : resData.name,
                userID,
                title, 
                nameOnCard,
                type,
                number,
                cvv,
                expDate,
                folder,
                favorite     
            }
        });
    };
};

//update
export const updateCards = (id, title, nameOnCard, type, number, cvv, expDate, folder) => 
{

    return async (dispatch, getState) => {

      const token = getState().auth.token;

      const response = await fetch(

        `https://fyp-s3curest4sh.firebaseio.com/Cards/${id}.json?auth=${token}`,
        {
            method: 'PATCH',

            headers: 
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                title, 
                nameOnCard,
                type,
                number,
                cvv,
                expDate,
                folder  
            })
        }

      );
  
      if (!response.ok) 
      {
        throw new Error('Something went wrong!');
      }
  
      dispatch({
        type: UPDATE_CARD,
        cid: id,

        cardData: {
            title, 
            nameOnCard,
            type,
            number,
            cvv,
            expDate,
            folder  
        }

      });

    };
};

//update favorites
export const updateCardFav = (id, favorite) => 
{

    return async (dispatch, getState) => {

      const token = getState().auth.token;

      const response = await fetch(

        `https://fyp-s3curest4sh.firebaseio.com/Cards/${id}.json?auth=${token}`,
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
        type: UPDATE_CARD_FAV,
        cid: id,

        cardData: {
          favorite
        }

      });

    };
};

//delete
export const deleteCards = cardID => 
{

    return async (dispatch, getState) =>
    {
        //get token
        const token = getState().auth.token;

        //await response
        const response = await fetch (
            `https://fyp-s3curest4sh.firebaseio.com/Cards/${cardID}.json?auth=${token}`,
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
            
            type : DELETE_CARD,
            cid : cardID

        });

    };

};
