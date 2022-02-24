import functions = require('firebase-functions');
import { getAuth } from 'firebase-admin/auth';

export const setClaim = functions.region('europe-west2').https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function must be called while authenticated.'
		);
	}
	if (!context.auth.token.admin) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			'The function can only be called by an admin user.'
		);
	}
	const auth = getAuth();
	return auth.setCustomUserClaims(context.auth.uid, data);
});
