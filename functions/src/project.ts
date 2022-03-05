import * as functions from 'firebase-functions';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import type { DocumentReference } from 'firebase-admin/firestore';
import type {
	Badge,
	Certificate,
	Project,
	ProjectSettings,
	UserBadge,
	UserCertificate,
	UserStats
} from '~shared/types';
import { calculateBadges } from './badges';
import { FAILED_PRECONDITION, REGION, REQUIRE_AUTH } from './constants';

const getProjectRef = (projectID: string): DocumentReference => {
	return getFirestore().collection('projects').doc(projectID);
};

const getProject = async (projectID: string): Promise<Project> => {
	const snapshot = await getProjectRef(projectID).get();
	if (!snapshot.exists) {
		throw new functions.https.HttpsError(
			FAILED_PRECONDITION,
			`Project ${projectID} does not exist.`
		);
	}
	return snapshot.data() as Project;
};

const getSettings = async (projectID: string, uid: string): Promise<ProjectSettings> => {
	const snapshot = await getProjectRef(projectID).collection('settings').doc(uid).get();
	if (!snapshot.exists) {
		throw new functions.https.HttpsError(
			FAILED_PRECONDITION,
			`The user does not have any settings for that project.`
		);
	}
	return snapshot.data() as ProjectSettings;
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

export const completeProject = functions.region(REGION).https.onCall(
	async (
		data: { projectID: string },
		context
	): Promise<{
		badges: Record<string, Badge>;
		certificateID: string;
	}> => {
		// Check that the user is authenticated
		if (!context.auth) {
			throw new functions.https.HttpsError(FAILED_PRECONDITION, REQUIRE_AUTH);
		}

		// Initialize relevant variables
		const { projectID } = data;
		const uid = context.auth.uid;

		// Fetch the user's settings
		const settings = await getSettings(projectID, uid);
		if (settings.completed) {
			throw new functions.https.HttpsError(
				FAILED_PRECONDITION,
				'The project must not be already completed'
			);
		}

		// Fetch the project metadata
		const project = await getProject(projectID);
		const progress = settings.progress;
		if (progress != project.exerciseCount - 1) {
			throw new functions.https.HttpsError(
				FAILED_PRECONDITION,
				'All exercises must be completed to finish the project.'
			);
		}

		// Update the user's stats
		const stats = await getStats(uid);
		stats[settings.language] += 1;
		stats['completed'] += 1;

		// Create the certificate
		const certificate: Certificate = {
			issued: Timestamp.now(),
			projectName: project.name,
			projectID: projectID,
			uid: uid
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

			// Mark this project as completed so that this method doesn't run again if they resubmit
			transaction.update(getProjectRef(projectID).collection('settings').doc(uid), {
				completed: true
			});

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

			// Add a reference to the certificate to the user's profile
			transaction.create(
				store.collection('stats').doc(uid).collection('certificates').doc(certificateRef.id),
				userCertificate
			);

			// Set the new stats
			transaction.set(store.collection('stats').doc(uid), stats);

			// Return the unlocked badges
			return { badges: badges, certificateID: certificateRef.id };
		});
	}
);
