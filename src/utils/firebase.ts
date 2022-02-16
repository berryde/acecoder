import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import type { Badge } from './types';
import {
	connectStorageEmulator,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes
} from 'firebase/storage';

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
export const app = initializeApp(firebaseConfig);

/**
 * The Firebase firestore instance.
 */
export const db = getFirestore(app);

/**
 * The Firebase authentication instance.
 */
export const auth = getAuth(app);

export const storage = getStorage(app, 'gs://folio-8b029.appspot.com');

/**
 * The Firebase functions instance.
 */
const functions = getFunctions(app, 'europe-west2');

if (import.meta.env.DEV) {
	connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
	connectFirestoreEmulator(db, 'localhost', 8080);
	connectFunctionsEmulator(functions, 'localhost', 5001);
	connectStorageEmulator(storage, 'localhost', 9199);
}

export const setClaim = async (claim: Record<string, unknown>): Promise<boolean> => {
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

export const completeProject = async (projectID: string): Promise<Record<string, Badge>> => {
	return (
		await httpsCallable<Record<string, unknown>, Record<string, Badge>>(
			functions,
			'completeProject'
		)({
			projectID: projectID
		})
	).data;
};

export const incrementProgress = async (projectID: string, exerciseID: string): Promise<void> => {
	await httpsCallable<Record<string, unknown>, boolean>(
		functions,
		'incrementProgress'
	)({
		projectID: projectID,
		exerciseID: exerciseID
	});
};

export const startProject = async (projectID: string, language: string): Promise<void> => {
	await httpsCallable<Record<string, unknown>, void>(
		functions,
		'startProject'
	)({
		projectID: projectID,
		language: language
	});
};

export const getImage = async (uri: string): Promise<string> => {
	return await getDownloadURL(ref(storage, uri));
};

export const uploadImage = async (folder: string, file: File): Promise<string> => {
	const name = `${folder}/${file.name}`;
	const location = ref(storage, name);
	await uploadBytes(location, file);
	return `gs://folio-8b029.appspot.com/${name}`;
};
