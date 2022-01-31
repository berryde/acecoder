import functions = require('firebase-functions');
import admin = require('firebase-admin');

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

exports.incrementProgress = functions.region('europe-west2').https.onCall(async (data: { projectID: string, exerciseID: string }, context) => {
	if (context.auth) {
		const store = admin.firestore()
		try {
			await store.runTransaction(async (transaction) => {
				// Fetch the project metadata
				const projectSnapshot = await transaction.get(store.collection("projects").doc(data.projectID))
				if (!projectSnapshot.exists) {
					throw (`Project ${data.projectID} does not exist`)
				}
				const project = projectSnapshot.data() as {
					exerciseCount: number;
				}

				if (parseInt(data.exerciseID) < project.exerciseCount) {
					// Fetch the user's settings
					const settingsSnapshot = await transaction.get(store.collection("projects").doc(data.projectID).collection('settings').doc(context.auth.uid))
					if (!settingsSnapshot.exists) {
						throw ("No settings could be found for that user")
					}
					const settings = settingsSnapshot.data() as { language: string, progress: number }

					if (settings.progress == parseInt(data.exerciseID)) {
						console.log(`Incrementing progress from ${settings.progress} for user ${context.auth.uid}`)
						transaction.update(store.collection('projects').doc(data.projectID).collection('settings').doc(context.auth.uid), {
							'progress': settings.progress + 1
						})
					}
				}
			})
		} catch (err) {
			console.error(err)
		}

	}
})