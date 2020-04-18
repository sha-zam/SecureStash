import React from 'react';
import { 

    View,
    Alert 

} from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

//constants import
import Colors from '../../constants/Colors';

import { useSelector, useDispatch } from 'react-redux';
import * as LocalAuthentication from 'expo-local-authentication';

import * as userActions from '../../store/actions/user.js';

const UserAccountScreen = props =>
{
    const dispatch = useDispatch();

    const pwdChangeHandler = async() => 
    {
        //check device biometrics
        const compatible = await LocalAuthentication.hasHardwareAsync();
        
        //if device has biometric capabilities
        if (compatible)
        {
            //test 
            let result = await LocalAuthentication.authenticateAsync(AuthOptions);

            if (result.success)
            {
                //send password change email
            } 
        
        }

    };

    const deleteAccountHandler = () =>
    {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account",
            [

                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { 
                    text: "Yes", 
                    onPress: () => console.log("OK Pressed") 
                }
            ],

            // { cancelable: false }
          );
    }

    //useSelector to view stored user email
    const userEmail = useSelector(state => state.auth.email);

    return (

        <View>
            <View>
                <ListItem
                    onPress={pwdChangeHandler}
                    title='Change Master Password'
                    titleStyle={{color : '#45B0FF'}}
                    bottomDivider
                    chevron
                />
            </View>
            <View>
                <ListItem
                    onPress={deleteAccountHandler}
                    title='Delete Account'
                    titleStyle={{color : '#45B0FF'}}
                    bottomDivider
                    chevron
                />
            </View>
        </View>

    );
        
};

export default UserAccountScreen;