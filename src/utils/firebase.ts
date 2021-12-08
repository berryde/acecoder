import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

/**
 * The firebase client access credentials. This is publicly exposed as it only provides client access.
 */
const firebaseConfig = {
	apiKey: 'AIzaSyC7h00ztN3AKGS79h7vHFECuPKCTiKianw',
	authDomain: 'folio-8b029.firebaseapp.com',
	projectId: 'folio-8b029',
	storageBucket: 'folio-8b029.appspot.com',
	messagingSenderId: '724755977367',
	appId: '724755977367:web:fb7a98653fc82a388b85d2',
	measurementId: 'G-519JV5VKEV'
};

/**
 * The firebase app.
 */
const app = initializeApp(firebaseConfig);

/**
 * The Firebase firestore instance.
 */
const db = getFirestore(app);

/**
 * The Firebase authentication instance.
 */
const auth = getAuth(app);

if (import.meta.env.DEV) {
	connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
	connectFirestoreEmulator(db, 'localhost', 8080);
}

export { app, db, auth };
