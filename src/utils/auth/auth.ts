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
import type { AuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import type { AuthError } from '../types';
import { goto } from '$app/navigation';

type AuthFederation = 'google' | 'github';

/**
 * Helper methods for interacting with Firebase authentication.
 * @returns The authentication library
 */

onAuthStateChanged(
	auth,
	(user) => {
		if (browser) {
			if (user) {
				if (window.location.href.endsWith('login') || window.location.href.endsWith('register')) {
					goto('/');
				}
			} else {
				goto('login');
			}
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
export const register = async (email: string, password: string): Promise<AuthError | void> => {
	try {
		await createUserWithEmailAndPassword(auth, email, password);
	} catch (error) {
		return {
			errorCode: error.code,
			errorMessage: error.message
		};
	}
};

export const signIn = async (email: string, password: string): Promise<AuthError | void> => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		return {
			errorCode: error.code,
			errorMessage: error.message
		};
	}
};

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
	} catch (error) {
		return {
			errorCode: error.code,
			errorMessage: error.message
		};
	}
};

export const signOut = async (): Promise<AuthError | void> => {
	try {
		await _signOut(auth);
	} catch (error) {
		return {
			errorCode: error.code,
			errorMessage: error.message
		};
	}
};

export const isAdmin = async (): Promise<boolean> => {
	const user = auth.currentUser;
	if (!user) return false;
	const token = await user.getIdTokenResult();
	return !!token.claims.admin;
};

export const resetPassword = async (email: string): Promise<AuthError | void> => {
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error) {
		return {
			errorCode: error.code,
			errorMessage: error.message
		};
	}
};

export const getName = (): string => {
	return auth.currentUser.displayName
		? auth.currentUser.displayName.split(' ')[0]
		: auth.currentUser.email.split('@')[0];
};

export const getErrorMessage = (firebaseError: AuthError): AuthError => {
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
		default:
			return {
				errorCode: 'Unknown error',
				errorMessage: 'An unknown error occurred. Please try again later.'
			};
	}
};
