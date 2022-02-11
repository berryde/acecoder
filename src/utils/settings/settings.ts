import { get, writable } from 'svelte/store';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ERR_NO_AUTH = 'You need to be logged in to perform that action.';

/**
 * Whether the editor should be formatted on save.
 */
export const formatOnSave = writable(true);
/**
 * Whether the dark mode theme should be used.
 */
export const darkMode = writable(true);

export const toggleFormatOnSave = (): void => {
	formatOnSave.update((value) => !value);
	updateSettings();
};

export const toggleDarkMode = (): void => {
	darkMode.update((value) => !value);
	updateSettings();
};

export const loadSettings = async (): Promise<void> => {
	if (!auth.currentUser) throw ERR_NO_AUTH;
	const docRef = doc(db, 'settings', auth.currentUser.uid);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		formatOnSave.set(docSnap.data()['formatOnSave']);
		darkMode.set(docSnap.data()['darkMode']);
	} else {
		await setDoc(doc(db, 'settings', auth.currentUser.uid), {
			formatOnSave: get(formatOnSave),
			darkMode: get(darkMode)
		});
	}
};

export const updateSettings = async (): Promise<void> => {
	if (!auth.currentUser) throw ERR_NO_AUTH;
	await setDoc(doc(db, 'settings', auth.currentUser.uid), {
		formatOnSave: get(formatOnSave),
		darkMode: get(darkMode)
	});
};
