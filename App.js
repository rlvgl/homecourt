import React from 'react';
import { View } from 'react-native';
import { NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import AddLocationScreen from './components/AddLocationScreen';
import LocationDetailScreen from './components/LocationDetailScreen';
import { db, app } from './firebase';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

// navigation config
const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NativeBaseProvider>
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
		</NativeBaseProvider>
	);
}

styles = {
	center: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
};
