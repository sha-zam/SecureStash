import { CREATE_ACCOUNT, DELETE_ACCOUNT, UPDATE_ACCOUNT} from '../actions/account.js';

//models import
import Account from '../../models/account.js';

const initialState = {

    userAccounts : []

};

export default (state = initialState, action) => {

    switch(action.type)
    {
        case CREATE_ACCOUNT :
            const newAccount = new Account(
                new Date().toString(), 
                'u1', 
                action.productData.title, 
                action.productData.URL, 
                action.productData.username, 
                action.productData.password
            );

            return {

                //copy existing state
                ...state, 

                //add to user accounts
                userAccounts : state.userAccounts.concat(newAccount)
            };

        case DELETE_ACCOUNT :

        case UPDATE_ACCOUNT :
    }

    return state; 

}