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
					const settings = settingsSnapshot.data() as { language: string, progress: string }

					const exerciseSnapshot = await transaction.get(store.collection("projects").doc(data.projectID).collection('exercises').doc(data.exerciseID))
					if (!exerciseSnapshot.exists) {
						throw ("That exercise does not exist")
					}
					const exercise = exerciseSnapshot.data() as { assessed: boolean }

					// Fetch the user's results
					let hasPassed = true
					if (exercise.assessed) {
						const resultsSnapshot = await transaction.get(store.collection("projects").doc(data.projectID).collection('exercises').doc(data.exerciseID).collection('results').doc(context.auth.uid))
						if (!resultsSnapshot.exists) {
							throw ("No results could be found for that user")
						}
						const results = resultsSnapshot.data() as Record<number, { passed: boolean }>
						hasPassed = Object.values(results).every(result => result.passed)
					}

					if (hasPassed && settings.progress == data.exerciseID) {
						console.log(`Incrementing progress from ${settings.progress} for user ${context.auth.uid} to ${settings.progress + 1}`)
						transaction.update(store.collection('projects').doc(data.projectID).collection('settings').doc(context.auth.uid), {
							'progress': (parseInt(settings.progress) + 1).toString()
						})
					}
				}
			})
		} catch (err) {
			console.error(err)
		}

	}
})