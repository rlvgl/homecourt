import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../features/main/HomeScreen';
import ProfileScreen from '../../features/profile/ProfileScreen';
import AddLocationScreen from '../../features/pickup/AddLocationScreen';
import LocationDetailScreen from '../../features/pickup/LocationDetailScreen';

const Stack = createNativeStackNavigator()

import React from 'react'

const Nav = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{ title: 'HomeCourt' }}
                />
                <Stack.Screen
                    name='Profile'
                    component={ProfileScreen}
                    options={{ title: 'Profile' }}
                />
                <Stack.Screen
                    name='Add Location'
                    component={AddLocationScreen}
                    options={{ title: 'Add Location' }}
                />
                <Stack.Screen
                    name='Location Detail'
                    component={LocationDetailScreen}
                    options={{ title: 'Location Detail' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Nav

