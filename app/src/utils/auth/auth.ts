/* eslint-disable no-ex-assign */
import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut as _signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	sendPasswordResetEmail
} from 'firebase/auth';
import { browser } from '$app/env';
import type { AuthProvider, AuthError as _AuthError } from 'firebase/auth';
import { auth, db } from '../firebase';
import type { AuthError } from '~shared/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AuthFederation = 'google' | 'github';
const DASHBOARD_URL = '/dashboard';
const LOGIN_URL = '/login';

/**
 * Helper methods for interacting with Firebase authentication.
 * @returns The authentication library
 */

onAuthStateChanged(
	auth,
	(user) => {
		if (
			browser &&
			!user &&
			!window.location.href.match('.+/(login|certificate|profile|register)')
		) {
			window.location.href = LOGIN_URL;
		}
	},
	(err) => console.error(err.message)
);

/**
 * Register a new user to the application.
 *
 * @param email The new user's email
 * @param password The new user's password
 * @returns An auth error if registering failed
 */
export const register = async (
	email: string,
	password: string,
	name: string
): Promise<AuthError | void> => {
	try {
		await createUserWithEmailAndPassword(auth, email, password);
		await saveName(name);
		window.location.href = DASHBOARD_URL;
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

/**
 * Write the user's full name to firebase for certificates
 * @param name The full name of the user
 */
const saveName = async (name: string): Promise<void> => {
	if (!auth.currentUser) throw new Error('You need to be logged in to perform that action');
	if (name.length == 0) throw new Error('Name cannot be empty');
	await setDoc(doc(db, 'names', auth.currentUser.uid), { name: name });
};

/**
 * Perform basic email-password sign in
 *
 * @param email The user's email
 * @param password The user's password
 * @returns An AuthError if authentication fails, else nothing
 */
export const signIn = async (email: string, password: string): Promise<AuthError | void> => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		window.location.href = DASHBOARD_URL;
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

/**
 * Sign the user up or in with a federated login provider
 *
 * @param federation The federation to authenticate
 * @param registering Whether the user is registering or logging in
 * @returns An AuthError if authentication fails, else nothing
 */
export const signInWith = async (federation: AuthFederation): Promise<AuthError | void> => {
	// Get the relevant authentication provider.
	let provider: AuthProvider;
	switch (federation) {
		case 'google':
			provider = new GoogleAuthProvider();
			break;
		case 'github':
			provider = new GithubAuthProvider();
			break;
	}

	// Trigger the federated sign in popup.
	try {
		await signInWithPopup(auth, provider);
		if (auth.currentUser) {
			let name = '';
			if (auth.currentUser.displayName) {
				name = auth.currentUser.displayName;
			} else if (auth.currentUser.email) {
				name = auth.currentUser.email;
			}
			await saveName(name);
			window.location.href = DASHBOARD_URL;
		}
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

/**
 * Sign the user out
 * @returns An AuthError if authentication fails, else nothing
 */
export const signOut = async (): Promise<AuthError | void> => {
	try {
		await _signOut(auth);
		window.location.href = LOGIN_URL;
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

/**
 * Check if the current user is an admin
 *
 * @returns Whether the current user is an admin
 */
export const isAdmin = async (): Promise<boolean> => {
	const user = auth.currentUser;
	if (!user) return false;
	const token = await user.getIdTokenResult();
	return !!token.claims.admin;
};

/**
 * Send a password reset email to the current user
 *
 * @param email The email of the user to reset the password for
 * @returns  An AuthError if it fails, else nothing
 */
export const resetPassword = async (email: string): Promise<AuthError | void> => {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error) {
		const err = error as _AuthError;
		return {
			errorCode: err.code,
			errorMessage: err.message
		};
	}
};

/**
 * Get the name of a user
 *
 * @param uid The ID of the user to get the name for
 * @param full Whether the full name should be retrieved
 * @returns The name of the user
 */
export const getName = async (uid: string, full = false): Promise<string> => {
	const snapshot = await getDoc(doc(db, 'names', uid));
	if (snapshot.exists()) {
		const name = snapshot.data().name;
		return full ? name : name.split(' ')[0];
	}
	return '';
};

/**
 * Parse Firebase errors and show a more user friendly message
 *
 * @param firebaseError The AuthError to parse
 * @returns A neater, more readable error
 */
export const getErrorMessage = (firebaseError: AuthError): AuthError | undefined => {
	switch (firebaseError.errorCode) {
		case 'auth/wrong-password':
			return {
				errorCode: 'Incorrect password',
				errorMessage: 'Please check your password and try again.'
			};
		case 'auth/invalid-email':
			return {
				errorCode: 'Invalid email',
				errorMessage: 'Please provide a valid email address.'
			};
		case 'auth/invalid-password':
			return {
				errorCode: 'Invalid password',
				errorMessage:
					'Please provide a valid password. It must be a string with at least six characters.'
			};
		case 'auth/user-not-found':
			return {
				errorCode: 'Invalid email',
				errorMessage: 'No user could be found with that email address.'
			};
		case 'auth/email-already-in-use':
			return {
				errorCode: 'Email already exists',
				errorMessage: 'The provided email is already in use by an existing user.'
			};
		case 'auth/popup-closed-by-user':
			return;
		default:
			return {
				errorCode: 'Unknown error',
				errorMessage: 'An unknown error occurred. Please try again later.'
			};
	}
};
