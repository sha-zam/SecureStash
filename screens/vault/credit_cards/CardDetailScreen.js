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
import HeaderButton  from '../../../components/HeaderButton.js';

//components import 
import Card from '../../../components/Card.js';

import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../../constants/Colors.js';

//actions import
import * as cardActions from '../../../store/actions/card.js';

const CardDetailScreen = props => {

    const dispatch = useDispatch();

    //extract param for Card id 
    const cardID = props.navigation.getParam('cardID');

    //the use useSelector to retrieve card`                                                                                                                                                                  
    const selectedCard = useSelector(state => state.storedCards.userCards.find(card => card.id === cardID));
    
    const [favState, setFavState] = useState(selectedCard.favorite);

    console.log(favState);
    

    const toggleFavoriteHandler = useCallback(() => 
    {
        let newFavstate = !selectedCard.favorite;
        setFavState(newFavstate);

        dispatch(cardActions.updateCardFav(cardID, newFavstate));
    }, [dispatch, cardID]);
    
    useEffect(() => 
    {
       
        props.navigation.setParams({ toggleFav: toggleFavoriteHandler });
    }, [toggleFavoriteHandler]);

    useEffect(() => 
    {
        props.navigation.setParams({ isFav: favState });
    }, [favState]);

    const copyHandler = async (value) => 
    {
        await Clipboard.setString(value);
        // Alert.alert('An Error Occurred!', 'Fail', [{ text: 'Okay' }]);
    };

    const editHandler = id =>
    {
        props.navigation.navigate('EditCardDetail', {cardID : id})
    };

    const deleteHandler = id =>
    {
        
        Alert.alert('Are you sure?', 'Do you really want to delete this card?', 
        [
            { text: 'No', style: 'default' },

            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => 
                {
                    props.navigation.goBack();
                    dispatch(cardActions.deleteCards(id));
                    
                }
            }

        ]);
    };

    if(selectedCard)
    {
        return (
            <Card style={styles.accContainer}>
                <Text style={styles.titleText}>{selectedCard.title}</Text>
                <View>
                    <Button
                        color = {Colors.primary}
                        title = "Copy Card Number"
                        onPress = {() => {copyHandler(selectedCard.username);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Copy Security Code"
                        onPress = {() => {copyHandler(selectedCard.card);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Copy Expiry Date"
                        onPress = {() => {copyHandler(selectedCard.card);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Edit"
                        onPress = {() => {editHandler(cardID);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Delete"
                        onPress = {deleteHandler.bind(this, cardID)}    
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

CardDetailScreen.navigationOptions = navigationData => {
    
    const toggleFavorite = navigationData.navigation.getParam('toggleFav');
    const isFavorite = navigationData.navigation.getParam('isFav');
    
    return {
        headerTitle : 'Card',

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
        marginHorizontal: 20
    }

});

export default CardDetailScreen;