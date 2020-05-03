import { 
    CREATE_BANK, 
    DELETE_BANK, 
    UPDATE_BANK,
    UPDATE_BANK_FAV,
    SET_BANK
} from '../actions/bank.js';

//models import
import Bank from '../../models/bank.js';

const initialState = {
    userBanks : []
};

export default (state = initialState, action) => {

    switch(action.type)
    {
        //fetch banks 
        case SET_BANK :
            return {
                userBanks : action.userBanks
            }

        //create banks
        case CREATE_BANK :
            const newBank = new Bank(
                action.bankData.id, 
                action.bankData.userID, 
                action.bankData.bankName, 
                action.bankData.accType, 
                action.bankData.accNum, 
                action.bankData.pin, 
                action.bankData.branchAddr,
                action.bankData.branchPhone,
                action.bankData.folder,
                action.bankData.favorite
            );

            return {

                //copy existing state
                ...state, 

                //add to user banks
                userBanks : state.userBanks.concat(newBank)
            };
        
        //update banks
        case UPDATE_BANK :
            //find the bank index in the existing state
            const bankIndex = state.userBanks.findIndex(bank => bank.id === action.bid);

            //create new Bank
            const updatedBank = new Bank (
                action.bid, 
                state.userBanks[bankIndex].userId, 
                action.bankData.bankName, 
                action.bankData.accType, 
                action.bankData.accNum, 
                action.bankData.pin, 
                action.bankData.branchAddr,
                action.bankData.branchPhone,
                action.bankData.folder,
                state.userBanks[bankIndex].favorite
            )

            //replace
            const updatedUserBanks = [...state.userBanks];
            updatedUserBanks[bankIndex] = updatedBank;

            return {

                //copy existing state
                ...state, 

                //add to user banks
                userBanks : updatedUserBanks
            };
        
        case UPDATE_BANK_FAV :
            //find the account index in the existing state
            const bIndex = state.userBanks.findIndex(bank => bank.id === action.bid);

            //update the account's favorite value
            const updatedUserBs = [...state.userBanks];
            updatedUserBs[bIndex].favorite = action.bankData.favorite;

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userBanks : updatedUserBs
            };
            
        //delete banks
        case DELETE_BANK:
            return {

                //copy existing state
                ...state,

                //take out the deleted bank
                userBanks : state.userBanks.filter(bank => bank.id != action.bid)
            };
 
    }

    return state; 

}