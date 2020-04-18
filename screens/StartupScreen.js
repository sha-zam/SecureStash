import React, { useEffect } from 'react';
import {

    View,
    ActivityIndicator,
    StyleSheet,
    Alert,
    AsyncStorage

} from 'react-native';

import { useDispatch } from 'react-redux';
import * as LocalAuthentication from 'expo-local-authentication';

//constants import
import Colors from '../constants/Colors.js';

import * as authActions from '../store/actions/auth.js';
import * as Keychain from 'react-native-keychain';

const AuthOptions = 
{

    promptMessage : 'Scan Biometrics',
    fallbackLabel : 'Please enter your passcode'

}

const StartupScreen = props =>
{
    const dispatch = useDispatch();

    useEffect(() => {

        const checkCredentials = async () =>
        {
            try 
            {
                // Retrieve the credentials
                let credentials = await Keychain.getGenericPassword();
                return credentials;
            } 
            catch (error) 
            {
                console.log("Keychain couldn't be accessed!", error);
            }
        }


        const biometricLogin = async () =>
        {
            const compatible = await LocalAuthentication.hasHardwareAsync();

            if (compatible)
            {
                let result = await LocalAuthentication.authenticateAsync(AuthOptions);

                return result;
            
            }
        }
        
        const tryLogin = async () =>
        {   
            try
            {
                const bioData = await AsyncStorage.getItem('biometrics');

                if(bioData)
                {
                    const parseData = JSON.parse(bioData);
                    const { biometrics } = parseData;

                    if(biometrics)
                    {
                         // Retrieve the credentials
                         let credentials = await Keychain.getGenericPassword();
                        
                         if (credentials) 
                         {
 
                            console.log(
                                'Credentials successfully loaded for user ' + credentials.username
                            );

                            const compatible = await LocalAuthentication.hasHardwareAsync();

                            if (compatible)
                            {
                                let result = await LocalAuthentication.authenticateAsync(AuthOptions);

                                if (result.success)
                                {
                                    dispatch(authActions.login(credentials.email, credentials.password));
                                    props.navigation.navigate('Tab');
                                } 
                            
                            }
 
                         } 
                    
                    }
                    
                }

                props.navigation.navigate('Auth');
                return;
            }
            catch(err)
            {
                console.log(err)
            }
            
        }
        
        tryLogin();

    }, []);

    return (

        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>

    );
    
};

const styles = StyleSheet.create({

    screen :
    {
        flex : 1,
        justifyContent : 'center',
        alignContent : 'center'
    }

});

export default StartupScreen;