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
import * as bankActions from '../../../store/actions/bank.js';

const BankDetailScreen = props => {

    const dispatch = useDispatch();

    //extract param for Bank id 
    const bankID = props.navigation.getParam('bankID');

    //the use useSelector to retrieve bank`                                                                                                                                                                  
    const selectedBank = useSelector(state => state.storedBanks.userBanks.find(bank => bank.id === bankID));

    const [favState, setFavState] = useState(selectedBank.favorite);

    const toggleFavoriteHandler = useCallback(() => 
    {
        let newFavstate = !selectedBank.favorite;
        setFavState(newFavstate);

        dispatch(bankActions.updateBankFav(bankID, newFavstate));
    }, [dispatch, bankID]);
    
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
    //     props.navigation.navigate('EditBankDetail', {bankID : id})
    // };

    // const deleteHandler = id =>
    // {
        
    //     Alert.alert('Are you sure?', 'Do you really want to delete this bank account?', 
    //     [
    //         { text: 'No', style: 'default' },

    //         {
    //             text: 'Yes',
    //             style: 'destructive',
    //             onPress: () => 
    //             {
    //                 props.navigation.goBack();
    //                 dispatch(bankActions.deleteBanks(id));                   
    //             }
    //         }

    //     ]);
    // };

    if(selectedBank)
    {
        return (
            <Card style={styles.bankContainer}>
                <Text style={styles.titleText}>{selectedBank.bankName}</Text>
                <View>
                    {/* <Button
                        color = {Colors.primary}
                        title = "Copy Account Number"
                        onPress = {() => {
                            copyHandler(selectedBank.accNum)
                        }}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Copy PIN"
                        onPress = {() => {
                            copyHandler(selectedBank.pin)
                        }}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Copy Branch Address"
                        onPress = {() => {
                            copyHandler(selectedBank.branchAddr)
                        }}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Copy Branch Phone Number"
                        onPress = {() => {
                            copyHandler(selectedBank.branchPhone)
                        }}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Edit"
                        onPress = {() => {editHandler(bankID)}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Delete"
                        onPress = {deleteHandler.bind(this, bankID)}    
                    /> */}

                    <ListItem
                        title='Folder'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedBank.folder}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Bank Name'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedBank.bankName}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Account Number'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedBank.accNum}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Account Type'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedBank.accType}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Account PIN'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedBank.pin}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Branch Address'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedBank.branchAddr}
                        subtitleStyle={styles.listSub}
                    />
                    <ListItem
                        title='Branch Phone Number'
                        titleStyle={styles.listTitle}
                        //leftIcon={{name : 'person-outline'}}
                        bottomDivider
                        //chevron
                        subtitle={selectedBank.branchPhone}
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

BankDetailScreen.navigationOptions = navigationData => {
    
    const toggleFavorite = navigationData.navigation.getParam('toggleFav');
    const isFavorite = navigationData.navigation.getParam('isFav');
    
    return {
        headerTitle : 'Bank',

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

export default BankDetailScreen;