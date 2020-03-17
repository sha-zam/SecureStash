import React from 'react';
import {

    FlatList, 
    View,
    Text, 
    Button, 
    StyleSheet

} from 'react-native';

import { useSelector } from 'react-redux';

const PasswordDetailScreen = props => {

    //extract param from folder id later
    //the use useSelector and folder id to retrieve passwords
    const userPasswords = useSelector(state => state.storedAccounts.userAccounts);
    
    return (
        <View>
            <Text>Password Detail Screen</Text>
        </View>
    );

};

const styles = StyleSheet.create({

});

export default PasswordDetailScreen;