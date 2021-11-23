import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut as _signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	getAuth
} from 'firebase/auth';
import { browser } from '$app/env';
import type { User, AuthProvider } from 'firebase/auth';

import { writable } from 'svelte/store';
import { app } from './firebase';
import type { AuthError } from '../types';
import { goto } from '$app/navigation';

type AuthFederation = 'google' | 'github';

/**
 * Helper methods for interacting with Firebase authentication.
 * @returns The authentication library
 */
const initAuth = () => {
	const { subscribe, set } = writable<User>();

	/**
	 * Listen to auth state changes.
	 */
	const listen = async () => {
		const auth = getAuth(app);
		onAuthStateChanged(
			auth,
			(user) => {
				set(user);
				if (user) {
					goto('/');
				} else {
					goto('login');
				}
			},
			(err) => console.error(err.message)
		);
	};

	if (browser) {
		listen();
	} else {
		set(null);
	}

	const register = async (email: string, password: string): Promise<AuthError | void> => {
		const auth = getAuth(app);
		try {
			await createUserWithEmailAndPassword(auth, email, password);
		} catch (error) {
			return {
				errorCode: error.code,
				errorMessage: error.message
			};
		}
	};

	const signIn = async (email: string, password: string): Promise<AuthError | void> => {
		const auth = getAuth(app);
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			return {
				errorCode: error.code,
				errorMessage: error.message
			};
		}
	};

	const signInWith = async (federation: AuthFederation): Promise<AuthError | void> => {
		const auth = getAuth(app);

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

	const signOut = async (): Promise<AuthError | void> => {
		const auth = getAuth(app);

		try {
			await _signOut(auth);
		} catch (error) {
			return {
				errorCode: error.code,
				errorMessage: error.message
			};
		}
	};

	return {
		register,
		signInWith,
		signIn,
		signOut,
		subscribe
	};
};

export const auth = initAuth();