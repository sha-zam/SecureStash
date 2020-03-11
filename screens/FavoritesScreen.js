import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FavoritesScreen = props =>
{
    return (
        <View style={styles.container}>
            <Text>Favorites Screen</Text>
        </View>
    );
};

FavoritesScreen.navigationOptions = 
{
    headerTitle : 'Favorites'
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
export default FavoritesScreen;