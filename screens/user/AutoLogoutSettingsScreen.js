import React, { useState } from 'react'
import { 

    View, 
    StyleSheet, 
    Text,
    AsyncStorage,
    FlatList

} from 'react-native';

import { ListItem, Icon } from 'react-native-elements';

//actions
import * as authActions from '../../store/actions/auth.js';
import { useDispatch } from 'react-redux';

const timerList = 
[
    {
        label : '3 Minutes',
        value : '3'
    },
    {
        label : '5 Minutes',
        value : '5'
    },
    {
        label : '10 Minutes',
        value : '10'
    },
    {
        label : '15 Minutes',
        value : '15'
    },
    {
        label : '30 Minutes',
        value : '30'
    },
    {
        label : 'Never',
        value : 'Never'
    },
];

const AutoLogoutSettingsScreen = props =>
{
    const dispatch = useDispatch();

    const timerHandler = async(time) =>
    {
        try
        {
            if(time != 'Never')
            {
                await AsyncStorage.setItem(
                    'autologout',
                    JSON.stringify({
                        autologout : time
                    })
                );
                
                const timer = parseInt(time) * 60000;
                console.log(timer);
    
                await dispatch(authActions.setLogoutTimer(timer));
            }
            else
            {
                console.log('never');
                await dispatch(authActions.clearLogoutTimer());
            }
            

            // const timer = await AsyncStorage.getItem('autologout');

            // if(timer)
            // {
            //     const parseData = JSON.parse(timer);
            //     const { autologout } = parseData;

                

            // }
    
        }
        catch(err)
        {

        }
    };

    const renderListItem = ({item}) =>
    {
        return (

            <ListItem
                title={item.label}
                bottomDivider
                onPress = {() => timerHandler(item.value)}
            />

        );
    }

    return (

        <FlatList
            data = {timerList}
            keyExtractor = {(item, index) => index.toString()}
            renderItem = {renderListItem}
        />

    );
};

const styles = StyleSheet.create({
    
});

export default AutoLogoutSettingsScreen;