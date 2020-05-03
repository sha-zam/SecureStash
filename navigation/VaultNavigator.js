import React from 'react';
import { Platform } from 'react-native';

//navigator imports
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer, createSwitchNavigator, NavigationEvents } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';

//screens import
import StartupScreen from '../screens/StartupScreen.js';
import VaultScreen from '../screens/vault/VaultScreen.js';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen.js';
import FavoritesScreen from '../screens/vault/FavoritesScreen.js';

//Passwords
import PasswordFoldersScreen from '../screens/vault/passwords/PasswordFoldersScreen.js';
import UserPasswordScreen from '../screens/vault/passwords/UserPasswordScreen.js';
import EditPasswordDetailScreen from '../screens/vault/passwords/EditPasswordDetailScreen';
import PasswordDetailScreen from '../screens/vault/passwords/PasswordDetailScreen.js';

//Payment Cards
import UserCardScreen from '../screens/vault/credit_cards/UserCardScreen.js';
import CardDetailScreen from '../screens/vault/credit_cards/CardDetailScreen.js';
import EditCardDetailScreen from '../screens/vault/credit_cards/EditCardDetailScreen.js';
import CardFoldersScreen from '../screens/vault/credit_cards/CardFoldersScreen.js';

//Secure Notes
import UserNotesScreen from '../screens/vault/notes/UserNotesScreen.js';
import NoteDetailScreen from '../screens/vault/notes/NoteDetailScreen.js';
import EditNoteDetailScreen from '../screens/vault/notes/EditNoteDetail.js';
import NotesFoldersScreen from '../screens/vault/notes/NotesFoldersScreen.js';

//Bank Account
import BankFoldersScreen from '../screens/vault/bank/BankFoldersScreen.js';


//auth screens
import SignupScreen from '../screens/SignupScreen.js';
import LoginScreen from '../screens/LoginScreen.js';

//settings screens
import SettingsScreen from '../screens/user/SettingsScreen.js';
import UserAccountScreen from '../screens/user/UserAccountScreen.js';
import SecuritySettingsScreen from '../screens/user/SecuritySettingsScreen.js';
import SupportScreen from '../screens/user/SupportScreen.js';
import DeleteAccountScreen from '../screens/user/DeleteAccountScreen';
import AutoLogoutSettingsScreen from '../screens/user/AutoLogoutSettingsScreen.js';

//components import 
import HeaderButton from '../components/HeaderButton.js';

//constants import 
import Colors from '../constants/Colors.js';
import UserBankScreen from '../screens/vault/bank/UserBankScreen.js';
import BankDetailScreen from '../screens/vault/bank/BankDetailScreen.js';
import EditBankDetailScreen from '../screens/vault/bank/EditBankDetailScreen.js';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen.js';

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

    PasswordFolders : PasswordFoldersScreen,
    UserPassword : UserPasswordScreen,
    PasswordDetail : PasswordDetailScreen,
    EditPasswordDetail : EditPasswordDetailScreen
},
{
    defaultNavigationOptions : defaultStackNavOpt, 

});


const BankAccNavigator = createStackNavigator({

    BankFolders : BankFoldersScreen,
    UserBank : UserBankScreen,
    BankDetail : BankDetailScreen,
    EditBankDetail : EditBankDetailScreen
    
},
{
    defaultNavigationOptions : defaultStackNavOpt
});

const NotesNavigator = createStackNavigator({

    NotesFolders : NotesFoldersScreen,
    UserNotes : UserNotesScreen,
    NoteDetail : NoteDetailScreen,
    EditNoteDetail : EditNoteDetailScreen
},
{
    defaultNavigationOptions : defaultStackNavOpt, 

});

const CardsNavigator = createStackNavigator({

    CardFolders : CardFoldersScreen,
    UserCard : UserCardScreen,
    CardDetail : CardDetailScreen,
    EditCardDetail : EditCardDetailScreen
},
{
    defaultNavigationOptions : defaultStackNavOpt, 

});

const VaultNavigator = createStackNavigator({

    //shortcut
    Vault : VaultScreen,

    //long way -> can set up additional config, e.g. defalt options etc.
    UserPassword : {
        //change later
        screen : UserPasswordNavigator,
        navigationOptions : 
        {

            headerShown : false
        }
    },

    PaymentCards : {
        screen : CardsNavigator,
        navigationOptions :
        {
            headerShown : false
        }
    },

    BankAcc : {
        screen : BankAccNavigator,
        navigationOptions :
        {
            headerShown : false
        }
    },

    SecureNotes : {
       //change later
       screen : NotesNavigator,
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

    Favorites : 
    {
        screen : FavoritesScreen,
        // navigationOptions : 
        // {
        //     // title : 'Passwords',
        //     // headerRight : (navigation) =>
        //     // <HeaderButtons HeaderButtonComponent={HeaderButton}>
        //     //     <Item
        //     //     title = "Save"
        //     //     iconName = "ios-checkmark"
        //     //     onPress = {() => navigation.navigate('EditPasswordDetail')}
        //     //     />
        //     // </HeaderButtons>

        //     headerShown : false
        // }
    }

},
{
    defaultNavigationOptions : defaultStackNavOpt, 

});

const UserAccountNavigator = createStackNavigator({

    UserAccount : 
    {
        screen : UserAccountScreen,
        navigationOptions : 
        {
            headerShown : false
        }
    },

    ChangePassword :
    {
        screen : ChangePasswordScreen,
        navigationOptions : 
        {
            headerShown : false
        }
    },
    
    DeleteAcc :
    {
        screen : DeleteAccountScreen,
        navigationOptions : 
        {
            headerShown : false
        }
    } 
})

const SettingsNavigator = createStackNavigator({

    Settings : SettingsScreen,
    UserAccount : UserAccountNavigator,
    Security : SecuritySettingsScreen,
    AutoLogout : AutoLogoutSettingsScreen,
    Support : SupportScreen
    
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