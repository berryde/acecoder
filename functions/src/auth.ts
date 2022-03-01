import functions = require('firebase-functions');
import { getAuth } from 'firebase-admin/auth';
import { FAILED_PRECONDITION, REGION, REQUIRE_AUTH } from './constants';

export const setClaim = functions.region(REGION).https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError(FAILED_PRECONDITION, REQUIRE_AUTH);
	}
	if (!context.auth.token.admin) {
		throw new functions.https.HttpsError(FAILED_PRECONDITION, REQUIRE_AUTH);
	}
	const auth = getAuth();
	return auth.setCustomUserClaims(context.auth.uid, data);
});
