export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

export const createAccount = (title, URL, username, password) => {

    return { 
        type : CREATE_ACCOUNT, 
        accountData : 
        {
            title, 
            URL, 
            username, 
            password
        }
    };

}

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