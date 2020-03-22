import { 
    CREATE_ACCOUNT, 
    DELETE_ACCOUNT, 
    UPDATE_ACCOUNT,
    SET_ACCOUNT
} from '../actions/account.js';

//models import
import Account from '../../models/account.js';

const initialState = {
    userAccounts : []
};

export default (state = initialState, action) => {

    switch(action.type)
    {
        //fetch accounts 
        case SET_ACCOUNT :
            return {
                userAccounts : action.userAccounts
            }

        //create accounts
        case CREATE_ACCOUNT :
            const newAccount = new Account(
                action.accountData.id, 
                action.accountData.userID, 
                action.accountData.title, 
                action.accountData.URL, 
                action.accountData.username, 
                action.accountData.password
            );

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userAccounts : state.userAccounts.concat(newAccount)
            };
        
        //update accounts
        case UPDATE_ACCOUNT :
            //find the account index in the existing state
            const accountIndex = state.userAccounts.findIndex(acc => acc.id === action.aid);

            //create new Account
            const updatedAccount = new Account (
                action.aid, 
                state.userAccounts[accountIndex].userId, 
                action.accountData.title, 
                action.accountData.URL, 
                action.accountData.username, 
                action.accountData.password
            )

            //replace
            const updatedUserAccounts = [...state.userAccounts];
            updatedUserAccounts[accountIndex] = updatedAccount;

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userAccounts : updatedUserAccounts
            };
            
        //delete accounts
        case DELETE_ACCOUNT :
            return {

                //copy existing state
                ...state,

                //take out the deleted account
                userAccounts : state.userAccounts.filter(acc => acc.id != action.aid)
            };
 
    }

    return state; 

}