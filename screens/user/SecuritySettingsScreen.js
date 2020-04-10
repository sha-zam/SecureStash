import React, {useState} from 'react';
import {

    View, 
    StyleSheet,
    Text,
    Switch,
    Platform

} from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

//constants import
import Colors from '../../constants/Colors.js';

//switch component
const customSwitch = props => {

    return (
        <View style={styles.switchContainer}>
            <Text>{props.label}</Text>
            <Switch
                trackColor={{ true: Colors.primaryColor }}
                thumbColor={Platform.OS === 'android' ? Colors.primaryColor : ''}
                value={props.state}
                onValueChange={props.onChange}
            />
        </View>
    );

};

const SecuritySettingsScreen = props =>
{
    //states
    const [isBiometric, setIsBiometric] = useState(false);

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
                    onValueChange: (value) => {
                      setIsBiometric(value);
                    },
                }}
            />
        </View>
    );


};

const styles = StyleSheet.create({


});

export default SecuritySettingsScreen;