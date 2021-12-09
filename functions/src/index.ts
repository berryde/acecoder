const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setClaim = functions.region('europe-west2').https.onCall(async (data, context) => {
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
