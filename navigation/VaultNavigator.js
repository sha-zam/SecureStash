import React from 'react';
import { Platform } from 'react-native';

import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';

//screens import
import VaultScreen from '../screens/VaultScreen.js';
import BankAccScreen from '../screens/BankAccScreen.js';
import CreditCardScreen from '../screens/CreditCardScreen.js';
import NotesScreen from '../screens/NotesScreen.js';
import UserPasswordScreen from '../screens/UserPasswordScreen.js';
import FavoritesScreen from '../screens/FavoritesScreen.js';
import SettingsScreen from '../screens/SettingsScreen.js';

//components import 
import HeaderButton from '../components/HeaderButton.js';

//constants import 
import Colors from '../constants/Colors.js';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

//some default navigation options
const defaultStackNavOpt = 
{
    headerStyle : 
    {
        backgroundColor : Colors.primary
    },

    headerTitleStyle :
    {
        fontFamily : 'open-sans-bold',
    },

    headerTintColor : Colors.accent,

};

const VaultNavigator = createStackNavigator({

    //shortcut
    Vault : VaultScreen,

    //long way -> can set up additional config, e.g. defalt options etc.
    UserPassword : {
        screen : UserPasswordScreen
    }

},
{
    defaultNavigationOptions : defaultStackNavOpt, 

});

//screens to be added later on
const CreditCardNavigator = createStackNavigator({

    CreditCard : CreditCardScreen

},
{
    defaultNavigationOptions : defaultStackNavOpt
});

const BankAccNavigator = createStackNavigator({

    BankAcc : BankAccScreen
    
},
{
    defaultNavigationOptions : defaultStackNavOpt
});

const NotesNavigator = createStackNavigator({

    SecureNotes : NotesScreen
    
},
{
    defaultNavigationOptions : defaultStackNavOpt
});

const SettingsNavigator = createStackNavigator({

    Settings : SettingsScreen
    
},
{
    defaultNavigationOptions : defaultStackNavOpt
});

//Favorites navigator
//tabInfo -> tabBarOptions
//materialbottomtab is for android only

const tabScreenConfig = 
{
    Vault : 
    {
        screen : VaultNavigator,
        navigationOptions : 
        {
            title : "Passwords",
            tabBarIcon : (tabInfo) => {
                return <MaterialCommunityIcons name='textbox-password' size={25} color={tabInfo.tintColor}/>;
            }
        }
    },

    PaymentCards : 
    {
        screen : CreditCardNavigator,
        navigationOptions : 
        {
            title : 'Payment Cards',
            tabBarIcon : (tabInfo) => {
                return <MaterialCommunityIcons name='credit-card' size={25} color={tabInfo.tintColor}/>;
            }
        }
    },

    BankAcc : 
    {
        screen : BankAccNavigator,
        navigationOptions : 
        {
            title : 'Bank Accounts',
            tabBarIcon : (tabInfo) => {
                return <MaterialCommunityIcons name='bank' size={25} color={tabInfo.tintColor}/>;
            }
        }
    },

    
    Notes : 
    {
        screen : NotesNavigator,
        navigationOptions : 
        {
            title : 'Secure Notes',
            tabBarIcon : (tabInfo) => {
                return <SimpleLineIcons name='note' size={25} color={tabInfo.tintColor}/>;
            }
        }
    },

    // Settings : 
    // {
    //     screen : SettingsScreen,
    //     navigationOptions : 
    //     {
    //         tabBarIcon : (tabInfo) => {
    //             return <Ionicons name='ios-settings' size={25} color={tabInfo.tintColor}/>;
    //         }
    //     }
    // }
};

const TabNavigator = Platform.OS  === 'android' ? 
    
createMaterialBottomTabNavigator( tabScreenConfig,
{
    activeColor : Colors.accent,
    inactiveColor: Colors.accent,
    barStyle : {backgroundColor: Colors.primary},
    shifting : true
}) 

:

createBottomTabNavigator( tabScreenConfig,
{
    tabBarOptions :
    {
        activeTintColor : Colors.primary,
    }
});


//stack navigator for favorites tab
const FavStackNavigator = createStackNavigator({

    Favorites : FavoritesScreen,
    UserPassword : UserPasswordScreen
},
{
    defaultNavigationOptions : defaultStackNavOpt
});

const allDrawerOptions = {
    Vault : 
    { 
        screen : TabNavigator, 
        navigationOptions: () => 
        ({
            title: 'Vault'
        })
    }, 

    Settings : 
    {
        screen : SettingsNavigator, 
        navigationOptions: () => 
        ({
            title: 'Settings'
        })
    }, 

    // PaymentCards : 
    // {
    //     screen : TabNavigator, 
    //     navigationOptions: () => 
    //     ({
    //         title: 'Payment Cards'
    //     })
    // }, 

    // BankAcc : 
    // {
    //     screen : BankAccNavigator, 
    //     navigationOptions: () => 
    //     ({
    //         title: 'Bank Accounts'
    //     })
    // }, 

    // SecureNotes : 
    // {
    //     screen : NotesNavigator, 
    //     navigationOptions: () => 
    //     ({
    //         title: 'Secure Notes'
    //     })
    // }, 
};

const MainNavigator = createDrawerNavigator(allDrawerOptions,{

    
    initialRouteName: 'Vault'
    // Passwords : FavTabNavigator,
    // PaymentCards : CreditCardNavigator,
    // BankAcc : BankAccNavigator,
    // SecureNotes : NotesNavigator

});

export default createAppContainer(MainNavigator);