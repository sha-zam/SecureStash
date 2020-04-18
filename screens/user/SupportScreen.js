import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Linking,
    Button
} from 'react-native';

import qs from 'qs';
import { openInbox, openComposer } from 'react-native-email-link'

const SupportScreen = props =>
{
    const handleEmail = async() => {
        try
        {
            await openComposer({
                to: 'support@example.com',
                subject: 'I have a question',
                body: 'Hi, can you help me with...'
             })
        }
        catch(err)
        {
            console.log(err)
        }
        
    }

    return (
        <View >
            <Button title="Send Mail" onPress={handleEmail} />
        </View>
    );

}

export default SupportScreen;