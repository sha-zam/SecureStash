import React, {useState, useEffect, useCallback} from 'react';
import {

    View, 
    StyleSheet,
    Text,
    Switch,
    Platform,
    AsyncStorage

} from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

//constants import
import Colors from '../../constants/Colors.js';

const SecuritySettingsScreen = props =>
{
    //states
    const [isBiometric, setIsBiometric] = useState(props.navigation.getParam('bioState'));

    useEffect(() =>{

        const saveDatatoStorage = async() => 
        {

            try
            {
                await AsyncStorage.setItem(
                    'biometrics',
                    JSON.stringify({
                        biometrics : isBiometric
                    })
                );
        
            }
            catch(err)
            {

            }
            
        };

        saveDatatoStorage();

    }, [isBiometric]);

    return (
        <View>
            <ListItem
                title = 'Enable Biometric Login'
                bottomDivider
                switch =
                {{
                    trackColor : { true: Colors.primaryColor },
                    thumbColor : Colors.primaryColor,
                    value : isBiometric,
                    onValueChange: (value) => {
                        setIsBiometric(previousState => !previousState);
                    }
                    //onPress : (value) => {saveDatatoStorage(value)}
                }}
            />
            <ListItem
                onPress = {()=>{props.navigation.navigate('AutoLogout')}}
                title = 'Auto Logout'
                bottomDivider
            />
    
        </View>
    );


};

SecuritySettingsScreen.navigationOptions = navData => 
{
    // return {

    //     headerLeft: () => 
    //         <HeaderBackButton tintColor={Colors.accent} onPress={saveDatatoStorage} />,
    
    //     };

}

const styles = StyleSheet.create({


});

export default SecuritySettingsScreen;