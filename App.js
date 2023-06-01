import React from 'react';
import { View } from 'react-native';
import { NativeBaseProvider, Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import AddLocationScreen from './components/AddLocationScreen';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

// firebase config
appConfig = {
	apiKey: 'AIzaSyBUJg_-KkEIQXp1lu8CoRY6M5DXYnPQTK0',
	authDomain: 'homecourt-3960e.firebaseapp.com',
	projectId: 'homecourt-3960e',
	storageBucket: 'homecourt-3960e.appspot.com',
	messagingSenderId: '450989464873',
	appId: '1:450989464873:web:bd9bfaafb5423de3332b38',
	measurementId: 'G-YYET97G37X',
};
export const app = initializeApp(appConfig);
export const db = getFirestore(app);

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
