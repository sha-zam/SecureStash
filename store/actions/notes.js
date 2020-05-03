//models 
import Note from '../../models/note.js';

export const CREATE_NOTE = 'CREATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const UPDATE_NOTE_FAV = 'UPDATE_NOTE_FAV';
export const SET_NOTE = 'SET_NOTE';

//read
export const fetchNotes = () =>
{

    return async (dispatch, getState) => {

        //get userID
        const userID = getState().auth.userId;
        
        try
        {
            //fetch from database 
            const response = await fetch ('https://fyp-s3curest4sh.firebaseio.com/Notes.json');

            if (!response.ok)
            {
                throw new Error('Something went wrong!');
            }
            
            //get response
            const resData = await response.json();

            const loadedNotes = [];
            
            for (const key in resData)
            {
                loadedNotes.push(
                    new Note(
                        key, 
                        resData[key].userID, 
                        resData[key].title, 
                        resData[key].description,  
                        resData[key].folder,
                        resData[key].favorite
                    )
                );
            }

            console.log(loadedNotes[0]);

            //dispatch action
            dispatch({
                type : SET_NOTE,
                userNotes : loadedNotes.filter(note => note.userID === userID)
            });
        }
        catch (err)
        {
            throw err;
        }

    };

};

//create 
export const createNotes = (title, description, folder, favorite) => 
{
    return async (dispatch, getState) => { 

        const token = getState().auth.token;
        const userID = getState().auth.userId;

        //await response
        const response = await fetch(

            `https://fyp-s3curest4sh.firebaseio.com/Notes.json?auth=${token}`,
            {
                method : 'POST',
                headers : 
                {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    title, 
                    description,
                    folder,
                    userID,
                    favorite
                })
            }

        );

        const resData = await response.json();

        dispatch({
            type : CREATE_NOTE, 
            noteData : 
            {
                id : resData.name,
                userID,
                title, 
                description,
                folder,
                favorite     
            }
        });
    };
};

//update
export const updateNotes = (id, title, description, folder) => 
{

    return async (dispatch, getState) => {

      const token = getState().auth.token;

      const response = await fetch(

        `https://fyp-s3curest4sh.firebaseio.com/Notes/${id}.json?auth=${token}`,
        {
            method: 'PATCH',

            headers: 
            {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                title,
                description,
                folder
            })
        }

      );
  
      if (!response.ok) 
      {
        throw new Error('Something went wrong!');
      }
  
      dispatch({
        type: UPDATE_NOTE,
        nid: id,

        noteData: {
          title,
          description,
          folder
        }

      });

    };
};

//update favorites
export const updateNoteFav = (id, favorite) => 
{

    return async (dispatch, getState) => {

      const token = getState().auth.token;

      const response = await fetch(

        `https://fyp-s3curest4sh.firebaseio.com/Notes/${id}.json?auth=${token}`,
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
        type: UPDATE_NOTE_FAV,
        nid: id,

        noteData: {
          favorite
        }

      });

    };
};

//delete
export const deleteNotes = noteID => 
{

    return async (dispatch, getState) =>
    {
        //get token
        const token = getState().auth.token;

        //await response
        const response = await fetch (
            `https://fyp-s3curest4sh.firebaseio.com/Notes/${noteID}.json?auth=${token}`,
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
            
            type : DELETE_NOTE,
            nid : noteID

        });

    };

};
