import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { db, app } from './firebase';

import Nav from './features/nav/Nav';

// import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Warning: ...']);

export default function App() {
	return (
		<NativeBaseProvider>
			<Nav />
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
