import admin from 'firebase-admin';

// Create the default app if it doesn't exist.
if (admin.apps.length == 0) {
	admin.initializeApp({
		databaseURL: 'https://folio-8b029.firebaseio.com',
		credential: admin.credential.applicationDefault()
	});
}

export const setClaim = async (uid: string, claim: Record<string, boolean>): Promise<boolean> => {
	try {
		await admin.auth().setCustomUserClaims(uid, claim);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};
