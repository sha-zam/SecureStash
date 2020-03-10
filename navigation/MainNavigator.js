import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

//screens import
import VaultScreen from '../screens/VaultScreen.js';
import UserPasswordScreen from '../screens/UserPasswordScreen.js';

const MainNavigator = createStackNavigator({

    //shortcut
    Vault : VaultScreen,

    //long way -> can set up additional config, e.g. defalt options etc.
    UserPassword : {
        screen : UserPasswordScreen
    }

});

export default createAppContainer(MainNavigator);