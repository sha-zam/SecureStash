import React from 'react';
import { View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';

//actions import 
import * as authActions from '../store/actions/auth.js';

const SettingsScreen = props =>
{
  const dispatch = useDispatch();

  const logoutHandler = () =>
  {
    dispatch(authActions.logout());
    props.navigation.navigate('Auth');
  };

  return (

    <View>
      <View>
        <ListItem
          title='Your Account'
          leftIcon={{name : 'person-outline'}}
          bottomDivider
          chevron
        />
        <ListItem
          title='Security'
          leftIcon={{name : 'lock-outline'}}
          bottomDivider
          chevron
        />
      </View>
      <View style={{marginTop : 20}}>
        <ListItem
          title='Log Out'
          // leftIcon={{name : 'lock-outline'}}
          bottomDivider
          chevron
          onPress = {logoutHandler}
        />
      </View>
    </View>
    
  );

}; 

SettingsScreen.navigationOptions = navData =>
{
  
}

export default SettingsScreen;