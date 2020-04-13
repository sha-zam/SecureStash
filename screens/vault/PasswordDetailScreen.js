import React from 'react';
import {

    View,
    Text, 
    Button, 
    StyleSheet,
    Alert,
    Clipboard

} from 'react-native';

//components import 
import Card from '../../components/Card.js';

import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors.js';

//actions import
import * as accountActions from '../../store/actions/account.js';

const PasswordDetailScreen = props => {

    const dispatch = useDispatch();

    //extract param for Account id 
    const accID = props.navigation.getParam('accountID');

    //the use useSelector to retrieve account`                                                                                                                                                                  
    const selectedAccount = useSelector(state => state.storedAccounts.userAccounts.find(acc => acc.id === accID));
    
    const copyHandler = async (value) => 
    {
        await Clipboard.setString(value);
        // Alert.alert('An Error Occurred!', 'Fail', [{ text: 'Okay' }]);
    };

    const editHandler = id =>
    {
        props.navigation.navigate('EditPasswordDetail', {accountID : id})
    };

    const deleteHandler = id =>
    {
        
        Alert.alert('Are you sure?', 'Do you really want to delete this account?', 
        [
            { text: 'No', style: 'default' },

            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => 
                {
                    props.navigation.goBack();
                    dispatch(accountActions.deleteAccounts(id));
                    
                }
            }

        ]);
    };

    if(selectedAccount)
    {
        return (
            <Card style={styles.accContainer}>
                <Text style={styles.titleText}>{selectedAccount.title}</Text>
                <View>
                    <Button
                        color = {Colors.primary}
                        title = "Copy Username"
                        onPress = {() => {copyHandler(selectedAccount.username);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Copy Password"
                        onPress = {() => {copyHandler(selectedAccount.password);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Edit"
                        onPress = {() => {editHandler(accID);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Delete"
                        onPress = {deleteHandler.bind(this, accID)}    
                    />
                </View>
            </Card>
        );
    }
    else
    {
        return(null);
    }
    

};

const styles = StyleSheet.create({

    titleText : 
    {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },

    text : 
    {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    }

});

export default PasswordDetailScreen;