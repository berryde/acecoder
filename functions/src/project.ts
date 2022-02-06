import functions = require('firebase-functions');
import admin = require('firebase-admin');
import type { Badge, Exercise, Project, Settings, UserBadge, UserStats } from './types';
import { calculateBadges } from './badges';
import { store } from './index';

export const incrementProgress = functions
	.region('europe-west2')
	.https.onCall(async (data: { projectID: string; exerciseID: string }, context) => {
		if (context.auth) {
			const { projectID, exerciseID } = data;
			const uid = context.auth.uid;
			const store = admin.firestore();
			try {
				await store.runTransaction(async (transaction) => {
					// Fetch the project metadata
					const project = await getProject(transaction, projectID);

					// Check if the index is within the range of the project
					const index = parseInt(exerciseID);
					if (index >= project.exerciseCount) throw 'That exercise does not exist';

					// Fetch the user's settings
					const settings = await getSettings(transaction, projectID, uid);
					const progress = parseInt(settings.progress);

					if (progress != index)
						throw `Cannot increment a non-current exercise. Trying to increment ${exerciseID} with progress ${settings.progress}`;

					// Get the exercise metadata to check if the exercise is assessed.
					const exercise = await getExercise(transaction, projectID, exerciseID);
					let passed = !exercise.assessed;

					if (exercise.assessed) {
						// Fetch the user's results to check if they have passed all of the chapters.
						const results = getResults(transaction, projectID, exerciseID, uid);
						passed = Object.values(results).every((result) => result.passed);
					}

					if (passed) {
						console.log(
							`Incrementing progress from ${settings.progress} for user ${uid} to ${index + 1}`
						);
						transaction.update(getProjectRef(projectID).collection('settings').doc(uid), {
							progress: (progress + 1).toString()
						});
					}
				});
			} catch (err) {
				console.error(err);
			}
		}
	});

const getProjectRef = (projectID: string): admin.firestore.DocumentReference => {
	return store.collection('projects').doc(projectID);
};

const getExerciseRef = (
	projectID: string,
	exerciseID: string
): admin.firestore.DocumentReference => {
	return getProjectRef(projectID).collection('exercises').doc(exerciseID);
};

const getExercise = async (
	transaction: admin.firestore.Transaction,
	projectID: string,
	exerciseID: string
): Promise<Exercise> => {
	const snapshot = await transaction.get(getExerciseRef(projectID, exerciseID));
	if (!snapshot.exists) throw `Exercise ${exerciseID} does not exist in project ${projectID}`;
	return snapshot.data() as Exercise;
};

const getProject = async (
	transaction: admin.firestore.Transaction,
	projectID: string
): Promise<Project> => {
	const snapshot = await transaction.get(getProjectRef(projectID));
	if (!snapshot.exists) throw `Project ${projectID} does not exist`;
	return snapshot.data() as Project;
};

const getResults = async (
	transaction: admin.firestore.Transaction,
	projectID: string,
	exerciseID: string,
	uid: string
): Promise<Record<number, { passed: boolean }>> => {
	const snapshot = await transaction.get(
		getExerciseRef(projectID, exerciseID).collection('results').doc(uid)
	);
	if (!snapshot.exists) throw 'No results could be found for that user';
	return snapshot.data() as Record<number, { passed: boolean }>;
};

const getSettings = async (
	transaction: admin.firestore.Transaction,
	projectID: string,
	uid: string
): Promise<Settings> => {
	const snapshot = await transaction.get(getProjectRef(projectID).collection('settings').doc(uid));
	if (!snapshot.exists) throw 'No settings could be found for that user';
	return snapshot.data() as Settings;
};

const getStats = async (
	transaction: admin.firestore.Transaction,
	uid: string
): Promise<UserStats> => {
	const statsSnapshot = await transaction.get(store.collection('stats').doc(uid));
	if (statsSnapshot.exists) return statsSnapshot.data() as UserStats;
	return {
		react: 0,
		svelte: 0,
		completed: 0,
		points: 0
	};
};

export const startProject = functions
	.region('europe-west2')
	.https.onCall(async (data: { projectID: string; language: string }, context) => {
		if (context.auth) {
			const { projectID, language } = data;
			const uid = context.auth.uid;

			// Initialize the project settings for this user
			try {
				await getProjectRef(projectID).collection('settings').doc(uid).set({
					progress: 0,
					language: language
				});
			} catch (err) {
				console.error(err);
			}
		}
	});

export const completeProject = functions
	.region('europe-west2')
	.https.onCall(async (data: { projectID: string }, context) => {
		if (context.auth) {
			const { projectID } = data;
			const uid = context.auth.uid;
			try {
				return await store.runTransaction(async (transaction) => {
					// Fetch the user's settings
					const settings = await getSettings(transaction, projectID, uid);
					if (settings.completed) throw 'Project already completed';

					// Fetch the project metadata
					const project = await getProject(transaction, projectID);
					const progress = parseInt(settings.progress);
					if (progress != project.exerciseCount - 1)
						throw 'Some exercises have not been completed yet';

					// Get the user's stats
					const stats = await getStats(transaction, context.auth.uid);

					// Increment the relevant stats
					stats[settings.language] += 1;
					stats['completed'] += 1;

					// Add any awarded badges to the user's stats
					const badges: Record<string, Badge> = await calculateBadges(
						transaction,
						stats,
						projectID,
						settings.language
					);
					Object.keys(badges).forEach((id) => {
						try {
							// Add the badge to the user's profile
							const data: UserBadge = {
								timestamp: admin.firestore.Timestamp.now(),
								projectID: projectID
							};
							transaction.create(
								store.collection('stats').doc(uid).collection('badges').doc(id),
								data
							);
							stats.points += badges[id].reward;
						} catch (err) {
							console.error('The user already has that badge');
						}
					});

					// Mark this project as completed so that this method doesn't run again if they resubmit
					transaction.update(getProjectRef(projectID).collection('settings').doc(uid), {
						completed: true
					});

					// Set the new stats
					transaction.set(store.collection('stats').doc(uid), stats);

					// Return the unlocked badges
					return badges;
				});
			} catch (err) {
				console.error(err);
			}
		}
	});
