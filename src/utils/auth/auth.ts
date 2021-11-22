import {
	createUserWithEmailAndPassword,
	GithubAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut
} from 'firebase/auth';
import type { User, AuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { writable } from 'svelte/store';
import { GoogleAuthProvider } from 'firebase/auth';
import type { AuthError } from '../types';

export const user = writable<User>();

export const register = async (email: string, password: string): Promise<AuthError | void> => {
	return createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			user.set(userCredential.user);
		})
		.catch((error) => {
			return {
				errorCode: error.code,
				errorMessage: error.message
			};
		});
};

export const login = async (email: string, password: string): Promise<AuthError | void> => {
	return signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			user.set(userCredential.user);
		})
		.catch((error) => {
			return {
				errorCode: error.code,
				errorMessage: error.message
			};
		});
};

type AuthFederation = 'google' | 'github';
export const federatedLogin = async (federation: AuthFederation): Promise<AuthError | void> => {
	let provider: AuthProvider;
	switch (federation) {
		case 'google':
			provider = new GoogleAuthProvider();
			break;
		case 'github':
			provider = new GithubAuthProvider();
			break;
	}
	return signInWithPopup(auth, provider)
		.then((userCredential) => {
			user.set(userCredential.user);
		})
		.catch((error) => {
			return {
				errorCode: error.code,
				errorMessage: error.message
			};
		});
};

export const logout = async (): Promise<AuthError | void> => {
	return signOut(auth)
		.then(() => {
			user.set(undefined);
		})
		.catch((error) => {
			return {
				errorCode: error.code,
				errorMessage: error.message
			};
		});
};
