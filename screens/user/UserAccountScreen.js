import React from 'react';
import { View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';

import * as userActions from '../../store/actions/user.js';

const UserAccountScreen = props =>
{
    const dispatch = useDispatch();

    //useSelector to view stored user email
    const userEmail = useSelector(state => state.auth.email);

    return (
        <View>
            <ListItem
                onPress={() => {}}
                title='Change Master Password'
                titleStyle={{color : '#45B0FF'}}
                bottomDivider
                chevron
            />
        </View>
    );  
};

export default UserAccountScreen;