import functions = require('firebase-functions');
import admin = require('firebase-admin');

export const setClaim = functions.region('europe-west2').https.onCall(async (data, context) => {
	if (context.auth && context.auth.token.admin) {
		try {
			await admin.auth().setCustomUserClaims(context.auth.uid, data);
			return true;
		} catch (e) {
			console.error(e);
		}
	}
	return false;
});
true;
