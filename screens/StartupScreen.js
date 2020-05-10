import React, { useEffect, useState } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => 
    {

        const tryLogin = async () =>
        {
            //disabled for testing, enable again after testing
            try
            {
                const bioData = await AsyncStorage.getItem('biometrics');

                console.log(bioData);

                if(bioData)
                {
                    const parseData = JSON.parse(bioData);
                    const { biometrics } = parseData;

                    console.log(biometrics);

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
                            
                            console.log(compatible);

                            if (compatible)
                            {
                                let result = await LocalAuthentication.authenticateAsync(AuthOptions);

                                if (result.success)
                                {
                                    //setError(null);
                                    //setIsLoading(true);

                                    console.log('success');

                                    try 
                                    {
                                        await dispatch(authActions.login(credentials.username, credentials.password));

                                        console.log('navigating to tab');
                                        props.navigation.navigate('Tab');  
                                    
                                    } 
                                    catch (err) 
                                    {
                                        //setError(err.message);
                                        //setIsLoading(false);
                                    }

                                    // dispatch(authActions.login(credentials.email, credentials.password));
                                    // props.navigation.navigate('Tab');
                                }
                                else
                                {
                                    props.navigation.navigate('Auth');
                                    return;
                                }
                            
                            }
                            else
                            {
                                props.navigation.navigate('Auth');
                                return;
                            }
 
                        }
                        else
                        {
                            props.navigation.navigate('Auth');
                            return;
                        }
                    
                    }
                    else
                    {
                        props.navigation.navigate('Auth');
                        return;
                    }
                    
                }
                else
                {
                    props.navigation.navigate('Auth');
                    return;
                }

                // props.navigation.navigate('Auth');
                // return;
            }
            catch(err)
            {
                console.log(err)
            }

            //props.navigation.navigate('Auth');
            
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