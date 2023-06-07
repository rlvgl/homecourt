import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
