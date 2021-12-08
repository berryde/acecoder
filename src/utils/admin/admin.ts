import admin from 'firebase-admin';

// Create the default app if it doesn't exist.
if (admin.apps.length == 0) {
	admin.initializeApp({
		databaseURL: 'https://folio-8b029.firebaseio.com',
		credential: admin.credential.applicationDefault()
	});
}

/**
 * Updates the claim state for this user. Useful for adding admin privileges.
 *
 * @param uid The user to set the claim for.
 * @param claim The new claim state.
 * @returns Whether or not the operation was successful.
 */
export const setClaim = async (uid: string, claim: Record<string, boolean>): Promise<boolean> => {
	try {
		await admin.auth().setCustomUserClaims(uid, claim);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
};
