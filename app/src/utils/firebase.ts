import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore';
import type { Badge } from '~shared/types';
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
export const db = initializeFirestore(app, { experimentalForceLongPolling: import.meta.env.DEV });

/**
 * The Firebase authentication instance.
 */
export const auth = getAuth(app);

/**
 * The Firebase storage instance
 */
export const storage = getStorage(app, 'gs://folio-8b029.appspot.com');

/**
 * The Firebase functions instance.
 */
const functions = getFunctions(app, 'europe-west2');

// Use the emulator in the development environment
if (import.meta.env.DEV) {
	connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
	connectFirestoreEmulator(db, 'localhost', 8080);
	connectFunctionsEmulator(functions, 'localhost', 5001);
	connectStorageEmulator(storage, 'localhost', 9199);
}

/**
 *  Invoke the 'incrementProgress' cloud function to set the claim for a user
 *
 * @param claim A JSON document
 * @returns Whether the claim was set successfully
 */
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

/**
 * Invoke the 'incrementProgress' cloud function to move on to the next exercise
 *
 * @param projectID The project being completed
 * @param name The name of the user completing the project as it will appear on the certificate
 */
export const completeProject = async (
	projectID: string,
	name: string
): Promise<{
	badges: Record<string, Badge>;
	certificateID: string;
}> => {
	return (
		await httpsCallable<
			Record<string, unknown>,
			{
				badges: Record<string, Badge>;
				certificateID: string;
			}
		>(
			functions,
			'completeProject'
		)({
			projectID: projectID,
			name: name
		})
	).data;
};

/**
 * Invoke the 'incrementProgress' cloud function to move on to the next exercise
 *
 * @param projectID The project being completed
 * @param exerciseID The exercise that has been completed
 */
export const incrementProgress = async (projectID: string, exerciseID: string): Promise<void> => {
	await httpsCallable<Record<string, unknown>, boolean>(
		functions,
		'incrementProgress'
	)({
		projectID: projectID,
		exerciseID: exerciseID
	});
};

/**
 * Invoke the 'startProject' cloud function to start a project
 *
 * @param projectID The project to start
 * @param language The language to start the project in
 */
export const startProject = async (projectID: string, language: string): Promise<void> => {
	await httpsCallable<Record<string, unknown>, void>(
		functions,
		'startProject'
	)({
		projectID: projectID,
		language: language
	});
};

/**
 * Retrieves an image URL from its Firebase URI
 *
 * @param uri The image URI
 * @returns The image URL
 */
export const getImage = async (uri: string): Promise<string> => {
	return await getDownloadURL(ref(storage, uri));
};

/**
 * Uploads a file to Firebase Filestore
 *
 * @param folder The folder name
 * @param file The file name
 * @returns The URI of the uploaded image
 */
export const uploadImage = async (folder: string, file: File): Promise<string> => {
	const name = `${folder}/${file.name}`;
	const location = ref(storage, name);
	await uploadBytes(location, file);
	return `gs://folio-8b029.appspot.com/${name}`;
};
