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

    useEffect(() => 
    {

        const tryLogin = async () =>
        {
            // disabled for testing, enable again after testing
            // try
            // {
            //     const bioData = await AsyncStorage.getItem('biometrics');

            //     if(bioData)
            //     {
            //         const parseData = JSON.parse(bioData);
            //         const { biometrics } = parseData;

            //         if(biometrics)
            //         {
            //              // Retrieve the credentials
            //              let credentials = await Keychain.getGenericPassword();
                        
            //              if (credentials) 
            //              {
 
            //                 console.log(
            //                     'Credentials successfully loaded for user ' + credentials.username
            //                 );

            //                 const compatible = await LocalAuthentication.hasHardwareAsync();

            //                 if (compatible)
            //                 {
            //                     let result = await LocalAuthentication.authenticateAsync(AuthOptions);

            //                     if (result.success)
            //                     {
            //                         dispatch(authActions.login(credentials.email, credentials.password));
            //                         props.navigation.navigate('Tab');
            //                     } 
                            
            //                 }
 
            //              } 
                    
            //         }
                    
            //     }

            //     props.navigation.navigate('Auth');
            //     return;
            // }
            // catch(err)
            // {
            //     console.log(err)
            // }

            props.navigation.navigate('Auth');
            
        }
        
        tryLogin();

    }, [dispatch]);

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