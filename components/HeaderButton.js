import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderButton } from 'react-navigation-header-buttons';
 
//Constants import
import Colors from '../constants/Colors.js';

const CustomHeaderButton = props =>
{
    return (
        <HeaderButton
            {...props}
            color = {Colors.accent}
            IconComponent = {Ionicons}
            iconSize = {23}
        />
    );
};

export default CustomHeaderButton;