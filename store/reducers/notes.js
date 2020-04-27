import { 
    CREATE_NOTE, 
    DELETE_NOTE, 
    UPDATE_NOTE,
    UPDATE_NOTE_FAV,
    SET_NOTE
} from '../actions/notes.js';

//models import
import Note from '../../models/note.js';

const initialState = {
    userNotes : []
};

export default (state = initialState, action) => {

    switch(action.type)
    {
        //fetch accounts 
        case SET_NOTE :
            return {
                userNotes : action.userNotes
            }

        //create accounts
        case CREATE_NOTE :
            const newNote = new Note(
                action.noteData.id, 
                action.noteData.userID, 
                action.noteData.title, 
                action.noteData.description,
                action.noteData.folder,
                action.noteData.favorite
            );

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userNotes : state.userNotes.concat(newNote)
            };
        
        //update accounts
        case UPDATE_NOTE :
            //find the account index in the existing state
            const noteIndex = state.userNotes.findIndex(note => note.id === action.nid);

            //create new Account
            const updatedNote = new Note (
                action.nid, 
                state.userNotes[noteIndex].userId, 
                action.noteData.title, 
                action.noteData.description,
                action.noteData.folder,
                state.userNotes[noteIndex].favorite
            )

            //replace
            const updatedUserNotes = [...state.userNotes];
            updatedUserNotes[noteIndex] = updatedNote;

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userNotes : updatedUserNotes
            };

        case UPDATE_NOTE_FAV :
            //find the account index in the existing state
            const nIndex = state.userNotes.findIndex(note => note.id === action.nid);

            //update the note's favorite value
            const updatedUserNs = [...state.userNotes];
            updatedUserNs[nIndex].favorite = action.noteData.favorite;

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userNotes : updatedUserNs
            };
            
        //delete accounts
        case DELETE_NOTE :
            return {

                //copy existing state
                ...state,

                //take out the deleted account
                userNotes : state.userNotes.filter(note => note.id != note.nid)
            };
 
    }

    return state; 

}