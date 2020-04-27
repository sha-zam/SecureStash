import { 
    CREATE_CARD, 
    DELETE_CARD, 
    UPDATE_CARD,
    SET_CARD,
    UPDATE_CARD_FAV
} from '../actions/card.js';

//models import
import Card from '../../models/card.js';

const initialState = {
    userCards : []
};

export default (state = initialState, action) => {

    switch(action.type)
    {
        //fetch cards 
        case SET_CARD :
            return {
                userCards : action.userCards
            }

        //create cards
        case CREATE_CARD :
            const newCard = new Card(
                action.cardData.id, 
                action.cardData.userID, 
                action.cardData.title, 
                action.cardData.nameOnCard, 
                action.cardData.type, 
                action.cardData.number,
                action.cardData.cvv,
                action.cardData.expDate,
                action.cardData.folder,
                action.cardData.favorite
            );

            return {

                //copy existing state
                ...state, 

                //add to user cards
                userCards : state.userCards.concat(newCard)
            };
        
        //update cards
        case UPDATE_CARD :
            //find the card index in the existing state
            const cardIndex = state.userCards.findIndex(card => card.id === action.cid);

            //create new Card
            const updatedCard = new Card (
                action.aid, 
                state.userCards[cardIndex].userId, 
                action.cardData.title, 
                action.cardData.nameOnCard, 
                action.cardData.type, 
                action.cardData.number,
                action.cardData.cvv,
                action.cardData.expDate,
                action.cardData.folder,
                state.userCards[cardIndex].favorite
            )

            //replace
            const updatedUserCards = [...state.userCards];
            updatedUserCards[cardIndex] = updatedCard;

            return {

                //copy existing state
                ...state, 

                //add to user cards
                userCards : updatedUserCards
            };
        
        case UPDATE_CARD_FAV :
            //find the account index in the existing state
            const cIndex = state.userCards.findIndex(card => card.id === action.cid);

            //update the account's favorite value
            const updatedUserCs = [...state.userCard];
            updatedUserCs[cIndex].favorite = action.cardData.favorite;

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userCards : updatedUserCs
            };
            
        //delete cards
        case DELETE_CARD:
            return {

                //copy existing state
                ...state,

                //take out the deleted card
                userCards : state.userCards.filter(card => card.id != action.cid)
            };
 
    }

    return state; 

}