import {
	collection,
	doc,
	DocumentReference,
	getDoc,
	getDocs,
	limit as _limit,
	query,
	QueryConstraint,
	runTransaction,
	updateDoc,
	where
} from 'firebase/firestore';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { result } from '../exercise/exercise';
import { auth, db } from '../firebase';
import type {
	Project,
	ExerciseMetadata,
	ProjectSettings,
	ExerciseResults,
	Badge,
	UserStats,
	UserBadge,
	Certificate,
	UserCertificate
} from '~shared/types';
import { ERR_NO_AUTH } from 'src/utils/constants';

/**
 * Loads the metadata for all available exercise of a project without loading the files, for use on the project overview page.
 *
 * @param projectID The project ID.
 * @returns Metadata for all of the exercises in a project
 */
export const getProjectExercises = async (
	projectID: string
): Promise<Record<string, ExerciseMetadata>> => {
	const snapshot = await getDocs(collection(db, 'projects', projectID, 'exercises'));
	const result: Record<string, ExerciseMetadata> = {};
	try {
		snapshot.forEach((doc) => {
			result[doc.id] = doc.data() as ExerciseMetadata;
		});
		return result;
	} catch (err) {
		throw `Unable to fetch exercises for project ${projectID}`;
	}
};

/**
 * Fetch a certificate by its ID
 *
 * @param certificateID The ID of the certificate
 * @returns The certificate
 */
export const getCertificate = async (certificateID: string): Promise<Certificate> => {
	const snapshot = await getDoc(doc(db, 'certificates', certificateID));
	if (!snapshot.exists()) throw new Error('No certificate could be found with that ID');
	return snapshot.data() as Certificate;
};

/**
 * Gets the results for the current user, updating the state with the resolved value.
 *
 * @param projectID The project to get the results for
 * @param exerciseID The exercise within the project
 */
export const getResults = async (projectID: string, exerciseID: string): Promise<void> => {
	if (auth.currentUser === null) throw Error(ERR_NO_AUTH);
	const snapshot = await getDoc(
		doc(db, 'projects', projectID, 'exercises', exerciseID, 'results', auth.currentUser.uid)
	);
	if (snapshot.exists()) {
		result.set(snapshot.data() as ExerciseResults);
	}
};

/**
 * Retrieves the metadata for an exercise without fetching the files unnecessarily
 *
 * @param projectID The project id.
 * @param index The index of the exercise within the project.
 * @returns Metadata about the exercise such as the name and description.
 */
export const getExerciseMetadata = async (
	projectID: string,
	index: string
): Promise<ExerciseMetadata> => {
	const snapshot = await getDoc(doc(db, 'projects', projectID, 'exercises', index));
	if (snapshot.exists()) {
		return snapshot.data() as ExerciseMetadata;
	} else {
		throw `Exercise ${index} in project ${projectID} does not exist`;
	}
};

/**
 * Retrieves the project settings for the current user, such as language choice and progress
 *
 * @param projectID The project to get the settings for
 * @param fallback The fallback language to use if no settings can be found
 * @returns The project settings for the current user
 */
export const getProjectSettings = async (
	projectID: string,
	fallback = 'react'
): Promise<ProjectSettings> => {
	if (auth.currentUser === null) throw Error(ERR_NO_AUTH);
	const snapshot = await getDoc(doc(db, 'projects', projectID, 'settings', auth.currentUser.uid));
	if (snapshot.exists()) return snapshot.data() as ProjectSettings;
	return { progress: 0, language: fallback, completed: false };
};

/**
 * Increment the user's progress
 *
 * @param project The project ID to increment
 * @param progress The current progress
 */
export const incrementProgress = async (project: string, progress: number): Promise<void> => {
	if (!auth.currentUser) throw new Error(ERR_NO_AUTH);
	await updateDoc(doc(db, 'projects', project, 'settings', auth.currentUser.uid), {
		progress: progress + 1
	});
};

/**
 * Gets the data associated with a single project.
 * @param projectID The project ID.
 * @returns The project data.
 */
export const getProject = async (projectID: string): Promise<Project> => {
	const snapshot = await getDoc(doc(db, 'projects', projectID));
	if (snapshot.exists()) return snapshot.data() as Project;
	throw 'Project ' + projectID + ' does not exist';
};

/**
 * Fetches a badge by its ID
 *
 * @param badgeID The ID of the badge
 * @returns The badge
 */
export const getBadge = async (badgeID: string): Promise<Badge> => {
	const snapshot = await getDoc(doc(db, 'badges', badgeID));
	if (snapshot.exists()) return snapshot.data() as Badge;
	throw 'Badge ' + badgeID + ' does not exist';
};

/**
 * Fetch the ID of the user's certificate for this project, if it exists
 *
 * @param projectID The project to get the certificate for
 * @returns The ID of the certificate
 */
export const getCertificateForProject = async (projectID: string): Promise<string> => {
	if (!auth.currentUser) throw new Error(ERR_NO_AUTH);
	const snapshot = await getDocs(
		query(
			collection(db, 'stats', auth.currentUser.uid, 'certificates'),
			where('projectID', '==', projectID)
		)
	);
	if (snapshot.empty) throw new Error('No certificate could be found for that project');
	return snapshot.docs[0].id;
};

/**
 * Fetch all of the certificates for a given user
 *
 * @param uid The user ID to get the certificates for
 * @returns A map of certificate ID to certificate metadata
 */
export const getCertificates = async (uid: string): Promise<Record<string, UserCertificate>> => {
	const snapshot = await getDocs(collection(db, 'stats', uid, 'certificates'));

	// Get the user's certificates
	if (snapshot.empty) return {};
	return Object.fromEntries(snapshot.docs.map((doc) => [doc.id, doc.data() as UserCertificate]));
};

/**
 * Fetch the badges for a given user
 *
 * @param uid The user ID to get the badges for
 * @param options Query options
 * @returns The retrieved badges
 */
export const getBadges = async (
	uid: string,
	options: {
		limit?: number;
		projectID?: string;
	} = { limit: undefined, projectID: undefined }
): Promise<Badge[]> => {
	const { limit, projectID } = options;
	const snapshot = await getDocs(collection(db, 'stats', uid, 'badges'));

	// Get the user's badge metadata
	if (snapshot.empty) return [];
	let userBadges = Object.fromEntries(
		snapshot.docs.map((doc) => [doc.id, doc.data() as UserBadge])
	);

	// Only get the badges for the specified project ID
	if (projectID) {
		userBadges = Object.fromEntries(
			Object.entries(userBadges).filter((entry) => entry[1].projectID == projectID)
		);
		if (Object.entries(userBadges).length == 0) return [];
	}

	// Limit the number of results if a limit is provided
	const constraints: QueryConstraint[] = [];
	constraints.push(where('__name__', 'in', Object.keys(userBadges)));
	if (limit) constraints.push(_limit(limit));

	const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
		query(collection(db, 'badges'), ...constraints)
	);

	// Sort the result based on the timestamps
	return querySnapshot.docs
		.sort((a, b) => {
			const aTimestamp = userBadges[a.id].timestamp;
			const bTimestamp = userBadges[b.id].timestamp;
			if (aTimestamp < bTimestamp) return -1;
			if (aTimestamp > bTimestamp) return 1;
			return 0;
		})
		.map((doc) => doc.data() as Badge);
};

/**
 * Fetch the stats for the current user
 *
 * @returns The user's stats
 */
export const getStats = async (): Promise<UserStats> => {
	if (auth.currentUser === null) throw Error(ERR_NO_AUTH);
	const snapshot = await getDoc(doc(db, 'stats', auth.currentUser.uid));
	if (snapshot.exists()) {
		return snapshot.data() as UserStats;
	} else {
		return {
			completed: 0,
			react: 0,
			svelte: 0
		};
	}
};

/**
 * Delete all of the current user's progress for a given project
 *
 * @param projectID The ID of the project to restart
 */
export const restartProject = async (projectID: string): Promise<void> => {
	const project = await getProject(projectID);
	await runTransaction(db, async (transaction) => {
		if (!auth.currentUser) throw Error('You need to be logged in to perform that action');
		const uid = auth.currentUser.uid;

		const results: DocumentReference[] = [];
		for (let i = 0; i < project.exerciseCount; i++) {
			const result = doc(db, 'projects', projectID, 'exercises', i.toString(), 'results', uid);
			if ((await transaction.get(result)).exists()) results.push(result);
		}

		// User needs to be able to delete their own submissions and project settings

		for (const result of results) transaction.delete(result);

		transaction.delete(doc(db, 'projects', projectID, 'submissions', uid));
		transaction.delete(doc(db, 'projects', projectID, 'settings', uid));
	});
};
