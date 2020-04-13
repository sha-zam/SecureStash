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

const retrieveBioSettings = async() =>
{
    const bioData = await AsyncStorage.getItem('biometrics');

    if(bioData)
    {
        const parseData = JSON.parse(bioData);
        const { biometrics } = parseData;
        console.log("biometrics : "+biometrics)
        return biometrics;
    }
    else
    {
        return false;
    }
};

const init = retrieveBioSettings();

const SecuritySettingsScreen = props =>
{
    console.log("nav param :" + props.navigation.getParam('bioState'));


    //states
    const [isBiometric, setIsBiometric] = useState(props.navigation.getParam('bioState'));

    // if(props.navigation.getParam('bioState'))
    // {
    //     setIsBiometric(true);
    // }
    // else
    // {
    //     setIsBiometric(false);
    // }

    console.log("init : " + isBiometric);

    // const saveDatatoStorage = useCallback(async() => 
    // {

    //     try
    //     {
    //         await AsyncStorage.setItem(
    //             'biometrics',
    //             JSON.stringify({
    //                 biometrics : isBiometric
    //             })
    //         );
    
    //         const bioData = await AsyncStorage.getItem('biometrics');
    
    //         console.log("set : " + bioData);
    //     }
    //     catch(err)
    //     {

    //     }
        
    // });

    useEffect(() =>{

    //     retrieveBioSettings();
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
        
                //const bioData = await AsyncStorage.getItem('biometrics');
        
                //console.log("set : " + bioData);
            }
            catch(err)
            {

            }
            
        };

        saveDatatoStorage();

    }, [isBiometric]);

    const check = (value) => 
    {
        setIsBiometric(previousState => !previousState);
        console.log(isBiometric);
    }

    return (
        <View>
            <ListItem
                onPress = {() => {}}
                title = 'Enable Biometric Login'
                bottomDivider
                switch =
                {{
                    trackColor : { true: Colors.primaryColor },
                    thumbColor : Colors.primaryColor,
                    value : isBiometric,
                    onValueChange: (value) => {check(value)}
                    //onPress : (value) => {saveDatatoStorage(value)}
                }}
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