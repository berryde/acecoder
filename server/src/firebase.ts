import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import type { Request, Response } from 'express';

if (process.env.NODE_ENV == 'development') {
	process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
	process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
	process.env['FIREBASE_STORAGE_EMULATOR_HOST'] = 'localhost:9199';
}

const app = initializeApp({
	databaseURL: 'https://folio-8b029.firebaseio.com',
	credential: applicationDefault(),
	storageBucket: 'folio-8b029.appspot.com',
	projectId: 'folio-8b029'
});
const auth = getAuth(app);
const db = getFirestore(app);
const bucket = getStorage().bucket();

/**
 * Verify the provided authentication token.
 * 
 * @param req The incoming request
 * @param res The response to send
 * @param next The function to call if authentication is successful.

 */
const authenticate = async (req: Request, res: Response): Promise<Response> => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		try {
			await auth.verifyIdToken(token);
		} catch (err) {
			return res.status(403);
		}
	} else {
		return res.status(401);
	}
	return res;
};

export { app, auth, db, bucket, authenticate };
