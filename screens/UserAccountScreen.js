import React from 'react';
import { View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Colors from '../constants/Colors';
import { useSelector } from 'react-redux';

import * as userActions from '../store/actions/user.js';

const UserAccountScreen = props =>
{
    const pwdChangeHandler = async () => 
    {
        //useSelector to view stored user email
        const userEmail = useSelector(state => state.auth.email);
        
        let action;

        action = userActions.sendPwdReset(userEmail);

        // setError(null);
        // setIsLoading(true);
        console.log("dispatching")

        try 
        {
            await dispatch(action);
            //fetchUserAccounts();

            // if(isSignup)
            // {

            //await dispatch(authActions.verifyEmail());

            Alert.alert('Email Sent', 'Please check your email', [{ text: 'Okay' }]);
            
            //verifyEmail();

            // sendEmail(formState.inputValues.email, 'Confirmation Email', 'Welcome to SecureStash, Your Registration was succesful!', {})
            // .then(() => {
            //   console.log('Email sent successfully')
            // });

           
            // }
            // else
            // {
            //props.navigation.navigate('Tab');
            //}
            
        } catch (err) 
        {
            // setError(err.message);
            // setIsLoading(false);
        }

    };

    return (
        <View>
            <ListItem
                onPress={pwdChangeHandler}
                title='Change Master Password'
                titleStyle={{color : '#45B0FF'}}
                bottomDivider
                chevron
            />
        </View>
    );  
};

export default UserAccountScreen;