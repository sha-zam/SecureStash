import React, { useCallback, useEffect, useState } from 'react';
import {

    View,
    Text, 
    Button, 
    StyleSheet,
    Alert,
    Clipboard

} from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ListItem, Icon } from 'react-native-elements';

//components import 
import Card from '../../../components/Card.js';
import HeaderButton  from '../../../components/HeaderButton.js';

import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../../constants/Colors.js';

//actions import
import * as accountActions from '../../../store/actions/account.js';

const PasswordDetailScreen = props => 
{
    const dispatch = useDispatch();
    
    //extract param for Account id 
    const accID = props.navigation.getParam('accountID');

    //the use useSelector to retrieve account                                                                                                                                                                 
    let selectedAccount = useSelector(state => state.storedAccounts.userAccounts.find(acc => acc.id === accID)); 

    const [favState, setFavState] = useState(selectedAccount.favorite);

    // useEffect (() => {

    //     selectedAccount = useSelector(state => state.storedAccounts.userAccounts.find(acc => acc.id === accID));
    //     setFavState(selectedAccount.favorite);
    // }, [dispatch]);

    const toggleFavoriteHandler = useCallback(() => 
    {

        let newFavstate = !selectedAccount.favorite;
        setFavState(newFavstate);

        dispatch(accountActions.updateAccountFav(accID, newFavstate));
    }, [dispatch, accID]);
    
    useEffect(() => 
    {    

        props.navigation.setParams({ toggleFav: toggleFavoriteHandler });

    }, [toggleFavoriteHandler]);

    useEffect(() => 
    {

        props.navigation.setParams({ isFav: favState });

    }, [favState]);

    // const copyHandler = async (value) => 
    // {
    //     await Clipboard.setString(value);
    //     // Alert.alert('An Error Occurred!', 'Fail', [{ text: 'Okay' }]);
    // };

    // const editHandler = id =>
    // {
    //     props.navigation.navigate('EditPasswordDetail', {accountID : id})
    // };

    // const deleteHandler = id =>
    // {
    //     console.log(id);

    //     Alert.alert('Are you sure?', 'Do you really want to delete this account?', 
    //     [
    //         { text: 'No', style: 'default' },

    //         {
    //             text: 'Yes',
    //             style: 'destructive',
    //             onPress: () => 
    //             {
    //                 props.navigation.navigate('Vault');  
    //                 dispatch(accountActions.deleteAccounts(id));              
    //             }
    //         }

    //     ]);
    // };

    if(selectedAccount)
    {
        return (
            <Card style={styles.accContainer}>
                <Text style={styles.titleText}>{selectedAccount.title}</Text>
                <View>
                    {/* <Button
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
                    /> */}

                    {/* <Text style={styles.text}>Username : {selectedAccount.username}</Text>
                    <Text style={styles.text}>Password : {selectedAccount.password}</Text>
                    <Text style={styles.text}>URL : {selectedAccount.URL}</Text> */}

                    <ListItem
                        title='Folder'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedAccount.folder}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='URL'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedAccount.URL}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Username'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedAccount.username}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Password'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedAccount.password}
                        subtitleStyle={styles.listSub}
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

PasswordDetailScreen.navigationOptions = navigationData => {
    
    const toggleFavorite = navigationData.navigation.getParam('toggleFav');
    const isFavorite = navigationData.navigation.getParam('isFav');
    
    return {
        headerTitle : 'Password',

        headerRight : () =>
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title = "Favorite"
                iconName = {isFavorite ? "ios-star" : "ios-star-outline"}
                iSize = {20}
                onPress = {toggleFavorite}
            />
        </HeaderButtons>     
    };
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
        marginHorizontal: 20,
        marginVertical : 10
    },

    listTitle : 
    {
        fontSize : 15,
        color : '#929390'
    },

    listSub :
    {
        fontSize : 15 , 
    }

});

export default PasswordDetailScreen;