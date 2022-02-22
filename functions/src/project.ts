import functions = require('firebase-functions');
import admin = require('firebase-admin');
import type {
	Badge,
	Certificate,
	Exercise,
	Project,
	Settings,
	UserBadge,
	UserCertificate,
	UserStats
} from './types';
import { calculateBadges } from './badges';

export const incrementProgress = functions
	.region('europe-west2')
	.https.onCall(async (data: { projectID: string; exerciseID: string }, context) => {
		if (context.auth) {
			const { projectID, exerciseID } = data;
			const store = admin.firestore();
			const uid = context.auth.uid;

			// Fetch the project metadata
			const project = await getProject(store, projectID);

			// Check if the index is within the range of the project
			const index = parseInt(exerciseID);
			if (index >= project.exerciseCount) throw new Error('That exercise does not exist');

			// Fetch the user's settings
			const settings = await getSettings(store, projectID, uid);
			const progress = parseInt(settings.progress);

			if (progress != index) {
				throw new Error(
					`Cannot increment a non-current exercise. Trying to increment ${exerciseID} with progress ${settings.progress}`
				);
			}
			// Get the exercise metadata to check if the exercise is assessed.
			const exercise = await getExercise(store, projectID, exerciseID);
			let passed = !exercise.assessed;

			if (exercise.assessed) {
				// Fetch the user's results to check if they have passed all of the chapters.
				const results = getResults(store, projectID, exerciseID, uid);
				passed = Object.values(results).every((result) => result.passed);
			}

			if (passed) {
				console.log(
					`Incrementing progress from ${settings.progress} for user ${uid} to ${index + 1}`
				);
				getProjectRef(store, projectID).collection('settings').doc(uid).update({
					progress: (progress + 1).toString()
				})
			} else {
				console.log(`User has not completed the current exercise yet.`);
			}
		}
	});

const getProjectRef = (
	store: admin.firestore.Firestore,
	projectID: string
): admin.firestore.DocumentReference => {
	return store.collection('projects').doc(projectID);
};

const getExerciseRef = (
	store: admin.firestore.Firestore,
	projectID: string,
	exerciseID: string
): admin.firestore.DocumentReference => {
	return getProjectRef(store, projectID).collection('exercises').doc(exerciseID);
};

const getExercise = async (
	store: admin.firestore.Firestore,
	projectID: string,
	exerciseID: string
): Promise<Exercise> => {
	const snapshot = await getExerciseRef(store, projectID, exerciseID).get();
	if (!snapshot.exists) throw `Exercise ${exerciseID} does not exist in project ${projectID}`;
	return snapshot.data() as Exercise;
};

const getProject = async (
	store: admin.firestore.Firestore,
	projectID: string
): Promise<Project> => {
	const snapshot = await getProjectRef(store, projectID).get();
	if (!snapshot.exists) throw `Project ${projectID} does not exist`;
	return snapshot.data() as Project;
};

const getResults = async (
	store: admin.firestore.Firestore,
	projectID: string,
	exerciseID: string,
	uid: string
): Promise<Record<number, { passed: boolean }>> => {
	const snapshot = await getExerciseRef(store, projectID, exerciseID)
		.collection('results')
		.doc(uid)
		.get();
	if (!snapshot.exists) throw 'No results could be found for that user';
	return snapshot.data() as Record<number, { passed: boolean }>;
};

const getSettings = async (

	store: admin.firestore.Firestore,
	projectID: string,
	uid: string
): Promise<Settings> => {
	const snapshot = await getProjectRef(store, projectID).collection('settings').doc(uid).get();
	if (!snapshot.exists) throw 'No settings could be found for that user';
	return snapshot.data() as Settings;
};

const getStats = async (

	store: admin.firestore.Firestore,
	uid: string
): Promise<UserStats> => {
	const statsSnapshot = await store.collection('stats').doc(uid).get();
	if (statsSnapshot.exists) return statsSnapshot.data() as UserStats;
	return {
		react: 0,
		svelte: 0,
		completed: 0
	};
};

export const startProject = functions
	.region('europe-west2')
	.https.onCall(async (data: { projectID: string; language: string }, context) => {
		if (context.auth) {
			const { projectID, language } = data;
			const uid = context.auth.uid;
			const store = admin.firestore();
			// Initialize the project settings for this user
			try {
				await getProjectRef(store, projectID).collection('settings').doc(uid).set({
					progress: 0,
					language: language
				});
			} catch (err) {
				console.error(err);
			}
		}
	});


export const completeProject = functions.region('europe-west2').https.onCall(
	async (
		data: { projectID: string; name: string },
		context
	): Promise<{
		badges: Record<string, Badge>;
		certificateID: string;
	}> => {
		if (context.auth) {
			const { projectID, name } = data;
			const uid = context.auth.uid;
			const store = admin.firestore();

			// Fetch the user's settings
			const settings = await getSettings(store, projectID, uid);
			if (settings.completed) throw 'Project already completed';

			// Fetch the project metadata
			const project = await getProject(store, projectID);
			const progress = parseInt(settings.progress);
			if (progress != project.exerciseCount - 1) {
				throw 'Some exercises have not been completed yet';
			}

			// Get the user's stats
			const stats = await getStats(store, context.auth.uid);

			// Increment the relevant stats
			stats[settings.language] += 1;
			stats['completed'] += 1;

			// Create the certificate
			const certificate: Certificate = {
				issued: admin.firestore.Timestamp.now(),
				project: project.name,
				name: name
			};

			const badgeData: UserBadge = {
				timestamp: admin.firestore.Timestamp.now(),
				projectID: projectID
			};

			const userCertificate: UserCertificate = {
				projectID: projectID,
				projectName: project.name
			};

			return await store.runTransaction(async (transaction) => {
				// Add any awarded badges to the user's stats
				const badges: Record<string, Badge> = await calculateBadges(transaction, stats);
				Object.keys(badges).forEach((id) => {
					try {
						transaction.create(
							store.collection('stats').doc(uid).collection('badges').doc(id),
							badgeData
						);
					} catch (err) {
						console.error('The user already has that badge');
					}
				});

				// Create the certificate
				const certificateRef = store.collection('certificates').doc();
				transaction.create(certificateRef, certificate);

				// Add a reference to the certificate to the user's profile\
				transaction.create(store
					.collection('stats')
					.doc(uid)
					.collection('certificates')
					.doc(certificateRef.id), userCertificate);

				// Mark this project as completed so that this method doesn't run again if they resubmit
				transaction.update(getProjectRef(store, projectID).collection('settings').doc(uid), {
					completed: true
				});

				// Set the new stats
				transaction.set(store.collection('stats').doc(uid), stats);

				// Return the unlocked badges
				return { badges: badges, certificateID: certificateRef.id };
			});
		}
	}
);
