import * as functions from 'firebase-functions';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import type { DocumentReference } from 'firebase-admin/firestore';
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
		// Check that the user is authenticated
		if (!context.auth) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				'The function must be called while authenticated.'
			);
		}

		// Initialize relevant variables
		const { projectID, exerciseID } = data;

		const uid = context.auth.uid;

		// Fetch the project metadata
		const project = await getProject(projectID);

		// Check if the index is within the range of the project
		const index = parseInt(exerciseID);
		if (index >= project.exerciseCount) {
			throw new functions.https.HttpsError('failed-precondition', `The exercise must exist.`);
		}

		// Fetch the user's settings
		const settings = await getSettings(projectID, uid);
		const progress = parseInt(settings.progress);

		if (progress != index) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				`Cannot increment a non-current exercise. Trying to increment ${exerciseID} with progress ${settings.progress}.`
			);
		}

		// Get the exercise metadata to check if the exercise is assessed.
		const snapshot = await getExerciseRef(projectID, exerciseID).get();
		if (!snapshot.exists) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				`Exercise ${exerciseID} does not exist in project ${projectID}`
			);
		}

		const exercise = snapshot.data() as Exercise;
		let passed = !exercise.assessed;
		if (exercise.assessed) {
			// Fetch the user's results to check if they have passed all of the chapters.
			const results = getResults(projectID, exerciseID, uid);
			passed = Object.values(results).every((result) => result.passed);
		}

		if (!passed) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				`The current exercise must be completed`
			);
		}

		return getProjectRef(projectID)
			.collection('settings')
			.doc(uid)
			.update({
				progress: (progress + 1).toString()
			});
	});

const getProjectRef = (projectID: string): DocumentReference => {
	return getFirestore().collection('projects').doc(projectID);
};

const getExerciseRef = (projectID: string, exerciseID: string): DocumentReference => {
	return getProjectRef(projectID).collection('exercises').doc(exerciseID);
};

const getProject = async (projectID: string): Promise<Project> => {
	const snapshot = await getProjectRef(projectID).get();
	if (!snapshot.exists) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			`Project ${projectID} does not exist.`
		);
	}
	return snapshot.data() as Project;
};

const getResults = async (
	projectID: string,
	exerciseID: string,
	uid: string
): Promise<Record<number, { passed: boolean }>> => {
	const snapshot = await getExerciseRef(projectID, exerciseID).collection('results').doc(uid).get();
	if (!snapshot.exists) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			`The user does not have any results for that exercise.`
		);
	}
	return snapshot.data() as Record<number, { passed: boolean }>;
};

const getSettings = async (projectID: string, uid: string): Promise<Settings> => {
	const snapshot = await getProjectRef(projectID).collection('settings').doc(uid).get();
	if (!snapshot.exists) {
		throw new functions.https.HttpsError(
			'failed-precondition',
			`The user does not have any settings for that project.`
		);
	}
	return snapshot.data() as Settings;
};

/**
 *
 * @param store The firestore instance
 * @param uid
 * @returns
 */
const getStats = async (uid: string): Promise<UserStats> => {
	return getFirestore()
		.collection('stats')
		.doc(uid)
		.get()
		.then((snapshot) => {
			if (snapshot.exists) {
				return snapshot.data() as UserStats;
			}
			return {
				react: 0,
				svelte: 0,
				completed: 0
			};
		});
};

export const startProject = functions
	.region('europe-west2')
	.https.onCall((data: { projectID: string; language: string }, context) => {
		// Check that the user is authenticated
		if (!context.auth) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				'The function must be called while authenticated.'
			);
		}

		// Initialize relevant variables
		const { projectID, language } = data;
		const uid = context.auth.uid;

		// Initialize the project settings for this user
		return getProjectRef(projectID).collection('settings').doc(uid).set({
			progress: 0,
			language: language
		});
	});

export const completeProject = functions.region('europe-west2').https.onCall(
	async (
		data: { projectID: string; name: string },
		context
	): Promise<{
		badges: Record<string, Badge>;
		certificateID: string;
	}> => {
		// Check that the user is authenticated
		if (!context.auth) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				'The function must be called while authenticated.'
			);
		}

		// Initialize relevant variables
		const { projectID, name } = data;
		const uid = context.auth.uid;

		// Fetch the user's settings
		const settings = await getSettings(projectID, uid);
		if (settings.completed) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				'The project must not be already completed'
			);
		}

		// Fetch the project metadata
		const project = await getProject(projectID);
		const progress = parseInt(settings.progress);
		if (progress != project.exerciseCount - 1) {
			throw new functions.https.HttpsError(
				'failed-precondition',
				'All exercises must be completed to finish the project.'
			);
		}

		// Update the user's stats
		const stats = await getStats(context.auth.uid);
		stats[settings.language] += 1;
		stats['completed'] += 1;

		// Create the certificate
		const certificate: Certificate = {
			issued: Timestamp.now(),
			project: project.name,
			name: name
		};

		// Issue the badge
		const badgeData: UserBadge = {
			timestamp: Timestamp.now(),
			projectID: projectID
		};

		// Issue the certificate
		const userCertificate: UserCertificate = {
			projectID: projectID,
			projectName: project.name
		};

		const store = getFirestore();
		return store.runTransaction(async (transaction) => {
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
			transaction.create(
				store.collection('stats').doc(uid).collection('certificates').doc(certificateRef.id),
				userCertificate
			);

			// Mark this project as completed so that this method doesn't run again if they resubmit
			transaction.update(getProjectRef(projectID).collection('settings').doc(uid), {
				completed: true
			});

			// Set the new stats
			transaction.set(store.collection('stats').doc(uid), stats);

			// Return the unlocked badges
			return { badges: badges, certificateID: certificateRef.id };
		});
	}
);
