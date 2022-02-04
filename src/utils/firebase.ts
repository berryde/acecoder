import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import type { Badge } from './types';
import { connectStorageEmulator, getDownloadURL, getStorage, ref } from "firebase/storage";

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

const storage = getStorage(app, "gs://folio-8b029.appspot.com");

/**
 * The Firebase functions instance.
 */
const functions = getFunctions(app, 'europe-west2');

if (import.meta.env.DEV) {
	connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
	connectFirestoreEmulator(db, 'localhost', 8080);
	connectFunctionsEmulator(functions, 'localhost', 5001);
	connectStorageEmulator(storage, 'localhost', 9199)
}

const setClaim = async (claim: Record<string, unknown>): Promise<boolean> => {
	try {
		const result = await httpsCallable<Record<string, unknown>, boolean>(
			functions,
			'setClaim'
		)(claim);
		return result.data;
	} catch (err) {
		return false;
	}
};

const completeProject = async (projectID: string): Promise<Record<string, Badge>> => {
	return (await httpsCallable<Record<string, unknown>, Record<string, Badge>>(
		functions,
		'completeProject'
	)({
		projectID: projectID,
	})).data;
}

const incrementProgress = async (projectID: string, exerciseID: string): Promise<void> => {
	await httpsCallable<Record<string, unknown>, boolean>(
		functions,
		'incrementProgress'
	)({
		projectID: projectID,
		exerciseID: exerciseID
	});
};

const startProject = async (projectID: string, language: string): Promise<void> => {
	await httpsCallable<Record<string, unknown>, void>(
		functions,
		'startProject'
	)({
		projectID: projectID,
		language: language
	})
}

const getImage = async (uri: string): Promise<string> => {
	return await getDownloadURL(ref(storage, uri))
}

export { app, db, auth, setClaim, incrementProgress, completeProject, storage, getImage, startProject };
