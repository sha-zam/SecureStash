import React from 'react';
import { Platform } from 'react-native';

//navigator imports
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator, NavigationEvents } from 'react-navigation';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';

//screens import
import VaultScreen from '../screens/VaultScreen.js';
import BankAccScreen from '../screens/vault/BankAccScreen.js';
import CreditCardScreen from '../screens/vault/CreditCardScreen.js';
import NotesScreen from '../screens/vault/NotesScreen.js';
import UserPasswordScreen from '../screens/vault/UserPasswordScreen.js';
import FavoritesScreen from '../screens/vault/FavoritesScreen.js';
import SettingsScreen from '../screens/user/SettingsScreen.js';
import SignupScreen from '../screens/SignupScreen.js';
import LoginScreen from '../screens/LoginScreen.js';
import EditPasswordDetailScreen from '../screens/vault/EditPasswordDetailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen.js';

//components import 
import HeaderButton from '../components/HeaderButton.js';

//constants import 
import Colors from '../constants/Colors.js';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import PasswordDetailScreen from '../screens/vault/PasswordDetailScreen.js';
import UserAccountScreen from '../screens/user/UserAccountScreen.js';
import SecuritySettingsScreen from '../screens/user/SecuritySettingsScreen.js';
import StartupScreen from '../screens/StartupScreen.js';


//some default navigation options
const defaultStackNavOpt = 
{
    headerStyle : 
    {
        backgroundColor : Colors.primary
    },

    // headerTitleStyle :
    // {
    //     fontFamily : 'open-sans-bold',
    // },

    headerTintColor : Colors.accent,

};

const UserPasswordNavigator = createStackNavigator({

    UserPassword : UserPasswordScreen,
    PasswordDetail : PasswordDetailScreen,
    EditPasswordDetail : EditPasswordDetailScreen
},
{
    defaultNavigationOptions : defaultStackNavOpt, 

})

const VaultNavigator = createStackNavigator({

    //shortcut
    Vault : VaultScreen,

    //long way -> can set up additional config, e.g. defalt options etc.
    UserPassword : {
        //change later
        screen : UserPasswordNavigator,
        navigationOptions : 
        {
            // title : 'Passwords',
            // headerRight : (navigation) =>
            // <HeaderButtons HeaderButtonComponent={HeaderButton}>
            //     <Item
            //     title = "Save"
            //     iconName = "ios-checkmark"
            //     onPress = {() => navigation.navigate('EditPasswordDetail')}
            //     />
            // </HeaderButtons>

            headerShown : false
        }
    },

    PaymentCards : {
        screen : CreditCardScreen
    },

    BankAcc : {
        screen : BankAccScreen
    },

    SecureNotes : {
        screen : NotesScreen
    },

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

    Settings : SettingsScreen,
    UserAccount : UserAccountScreen,
    Security : SecuritySettingsScreen
    
},
{
    defaultNavigationOptions : defaultStackNavOpt
});

//bottom tab 
const tabScreenConfig = 
{
    Vault : 
    {
        screen : VaultNavigator,
        navigationOptions : 
        {
            title : "Vault",
            tabBarIcon : (tabInfo) => {
                return <MaterialCommunityIcons name='safe' size={25} color={tabInfo.tintColor}/>;
            }
        }
    },

    // PaymentCards : 
    // {
    //     screen : CreditCardNavigator,
    //     navigationOptions : 
    //     {
    //         title : 'Payment Cards',
    //         tabBarIcon : (tabInfo) => {
    //             return <MaterialCommunityIcons name='credit-card' size={25} color={tabInfo.tintColor}/>;
    //         }
    //     }
    // },

    // BankAcc : 
    // {
    //     screen : BankAccNavigator,
    //     navigationOptions : 
    //     {
    //         title : 'Bank Accounts',
    //         tabBarIcon : (tabInfo) => {
    //             return <MaterialCommunityIcons name='bank' size={25} color={tabInfo.tintColor}/>;
    //         }
    //     }
    // },

    
    // Notes : 
    // {
    //     screen : NotesNavigator,
    //     navigationOptions : 
    //     {
    //         title : 'Secure Notes',
    //         tabBarIcon : (tabInfo) => {
    //             return <SimpleLineIcons name='note' size={25} color={tabInfo.tintColor}/>;
    //         }
    //     }
    // },

    Settings : 
    {
        screen : SettingsNavigator,
        navigationOptions : 
        {
            headerTitle : 'Settings',
            tabBarIcon : (tabInfo) => 
            {
                return <Ionicons name='ios-settings' size={25} color={tabInfo.tintColor}/>;
            }
        }
    }
};

const TabNavigator = Platform.OS  === 'android' ? 
    
createMaterialBottomTabNavigator( tabScreenConfig,
{
    activeColor : Colors.accent,
    inactiveColor: Colors.accent,
    barStyle : {backgroundColor: Colors.primary},
    shifting : true,
    backBehavior : 'history'
}) 

:

createBottomTabNavigator( tabScreenConfig,
{
    tabBarOptions :
    {
        activeTintColor : Colors.primary,
    },
    backBehavior : 'history',
});

//Favorites navigator
//tabInfo -> tabBarOptions
//materialbottomtab is for android only

//stack navigator for favorites tab
const FavStackNavigator = createStackNavigator({

    Favorites : FavoritesScreen,
    UserPassword : UserPasswordScreen
},
{
    defaultNavigationOptions : defaultStackNavOpt
});

const LoginNavigator = createStackNavigator({

    Login : LoginScreen,
    ForgotPwd : ForgotPasswordScreen

},
{
    defaultNavigationOptions : defaultStackNavOpt
});

const AuthNavigator = createSwitchNavigator({

    Login : LoginNavigator,
    Signup : SignupScreen,
    
});

const MainNavigator = createSwitchNavigator({
    Startup : StartupScreen,
    Auth : AuthNavigator,
    Tab : TabNavigator
});

export default createAppContainer(MainNavigator);