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

const AuthOptions = 
{

    promptMessage : 'Scan Biometrics',
    fallbackLabel : 'Please enter your passcode'

}

const UserAccountScreen = props =>
{
    
    //useSelector to view stored user email
    const userEmail = useSelector(state => state.auth.email);

    return (

        <View>
            <View>
                <ListItem
                    onPress={() => {props.navigation.navigate('ChangePassword')}}
                    title='Change Master Password'
                    titleStyle={{color : '#45B0FF'}}
                    bottomDivider
                    chevron
                />
            </View>
            <View>
                <ListItem
                    onPress={() => {props.navigation.navigate('DeleteAcc')}}
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