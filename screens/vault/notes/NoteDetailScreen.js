import React, { useCallback, useEffect, useState } from 'react';
import {

    View,
    Text, 
    Button, 
    StyleSheet,
    Alert,
 
} from 'react-native';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

//components import 
import Card from '../../../components/Card.js';
import HeaderButton  from '../../../components/HeaderButton.js';

import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../../constants/Colors.js';

//actions import
import * as noteActions from '../../../store/actions/notes.js';

const NoteDetailScreen = props => {

    const dispatch = useDispatch();

    //extract param for note id 
    const noteID = props.navigation.getParam('noteID');

    //the use useSelector to retrieve note                                                                                                                                                                
    const selectedNote = useSelector(state => state.storedNotes.userNotes.find(note => note.id === noteID));
    
    const [favState, setFavState] = useState(selectedNote.favorite);

    const toggleFavoriteHandler = useCallback(() => 
    {
        let newFavstate = !selectedNote.favorite;
        setFavState(newFavstate);

        dispatch(noteActions.updateNoteFav(noteID, newFavstate));
    }, [dispatch, noteID]);
    
    useEffect(() => 
    {
       
        props.navigation.setParams({ toggleFav: toggleFavoriteHandler });
    }, [toggleFavoriteHandler]);

    useEffect(() => 
    {
        props.navigation.setParams({ isFav: favState });
    }, [favState]);

    const editHandler = id =>
    {
        props.navigation.navigate('EditNoteDetail', {noteID : id})
    };

    const deleteHandler = id =>
    {
        
        Alert.alert('Are you sure?', 'Do you really want to delete this note?', 
        [
            { 
                text: 'No', 
                style: 'default' 
            },

            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => 
                {
                    props.navigation.goBack();
                    dispatch(noteActions.deleteNotes(id));
                    
                }
            }

        ]);
    };

    if(selectedNote)
    {
        return (
            <Card style={styles.accContainer}>
                <Text style={styles.titleText}>{selectedNote.title}</Text>
                <View>
                    <Button
                        color = {Colors.primary}
                        title = "Edit"
                        onPress = {() => {editHandler(noteID);}}    
                    />
                    <Button
                        color = {Colors.primary}
                        title = "Delete"
                        onPress = {deleteHandler.bind(this, noteID)}    
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


NoteDetailScreen.navigationOptions = navigationData => {
    
    const toggleFavorite = navigationData.navigation.getParam('toggleFav');
    const isFavorite = navigationData.navigation.getParam('isFav');
    
    return {
        headerTitle : 'Note',

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

export default NoteDetailScreen;