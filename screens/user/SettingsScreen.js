import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { useDispatch } from 'react-redux';

//actions import 
import * as authActions from '../../store/actions/auth.js';

const SettingsScreen = props =>
{
  const dispatch = useDispatch();

  const logoutHandler = () =>
  {
    dispatch(authActions.logout());
    props.navigation.navigate('Auth');
  };

  const securityHandler = async() =>
  {
    const bioData = await AsyncStorage.getItem('biometrics');

    if(bioData)
    {
      const parseData = JSON.parse(bioData);
      const { biometrics } = parseData;

      console.log("passing : " + biometrics);

      props.navigation.navigate({
        routeName: 'Security',
        params: {
          bioState : biometrics
        }
      });
    }
    else
    {
      props.navigation.navigate({
        routeName: 'Security',
        params: {
          bioState : false
        }
      });
    }

  }

  return (

    <View>
      <View>
        <ListItem
          title='Your Account'
          leftIcon={{name : 'person-outline'}}
          bottomDivider
          chevron
          onPress = {() => {props.navigation.navigate('UserAccount')}}
        />
        <ListItem
          title='Security'
          leftIcon={{name : 'lock-outline'}}
          bottomDivider
          chevron
          onPress = {securityHandler}
        />
        <ListItem
          title='Support'
          leftIcon={{name : 'lock-outline'}}
          bottomDivider
          chevron
          onPress = {() => {props.navigation.navigate('Support')}}
        />
      </View>
      <View style={{marginTop : 20}}>
        <ListItem
          title='Log Out'
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