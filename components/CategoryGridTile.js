import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Platform, TouchableNativeFeedback} from 'react-native';

import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';

const CategoryGridTile = props => 
{
    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === "android" && Platform.Version >= 21) //add ripple effect on Android if supported
    {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.gridItem}>
            <TouchableCmp 
                style={{flex : 1}}
                onPress={props.onSelect}
            >
                <View style={{...styles.container, ...{backgroundColor : props.color}}}>
                    <MaterialCommunityIcons name={props.icon} size={50} color='black'/>
                    <Text style={styles.title} numberOfLines={2}>{props.title}</Text>
                </View>
            </TouchableCmp>
        </View>
    );
};

const styles = StyleSheet.create({
    
    gridItem :
    {
      flex : 1,
      margin : 15,
      height : 150,
      borderRadius : 10,
      overflow : Platform.OS === 'android' && Platform.Version >= 21 ? 'hidden' : 'visible',

      //android
      elevation : 5,
    },

    container : 
    {
        flex : 1,
        borderRadius : 10,

        //Text style
        padding : 15,
        justifyContent : 'flex-end', //move to bottom
        alignItems : 'flex-end', //move to right

        //IOS
        shadowColor : 'black',
        shadowOffset : {width : 0, height : 2},
        shadowOpacity : 0.26,
        shadowRadius : 10,

    },

    title : 
    {
        fontFamily : 'open-sans-bold',
        fontSize : 16,
        textAlign : 'right',
    }

});

export default CategoryGridTile;