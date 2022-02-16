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
	where
} from 'firebase/firestore';
import type { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { result } from '../exercise/exercise';
import { auth, db } from '../firebase';
import type {
	Project,
	ExerciseMetadata,
	ProjectSettings,
	ServerResponse,
	Badge,
	UserStats,
	UserBadge
} from '../types';
import { ERR_NO_AUTH } from '../general';

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

export const getResults = async (projectID: string, exerciseID: string): Promise<void> => {
	if (auth.currentUser === null) throw Error(ERR_NO_AUTH);
	const snapshot = await getDoc(
		doc(db, 'projects', projectID, 'exercises', exerciseID, 'results', auth.currentUser.uid)
	);
	if (snapshot.exists()) {
		result.set(snapshot.data() as ServerResponse);
	}
};

/**
 * Retrieves the metadata for an exercise without fetching the files unnecessarily.
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
 * Gets the data associated with a single project.
 * @param projectID The project ID.
 * @returns The project data.
 */
export const getProject = async (projectID: string): Promise<Project> => {
	const snapshot = await getDoc(doc(db, 'projects', projectID));
	if (snapshot.exists()) return snapshot.data() as Project;
	throw 'Project ' + projectID + ' does not exist';
};

export const getBadge = async (badgeID: string): Promise<Badge> => {
	const snapshot = await getDoc(doc(db, 'badges', badgeID));
	if (snapshot.exists()) return snapshot.data() as Badge;
	throw 'Badge ' + badgeID + ' does not exist';
};

export const getBadges = async (options: {
	limit?: number;
	projectID?: string;
}): Promise<Badge[]> => {
	if (auth.currentUser === null) throw Error(ERR_NO_AUTH);
	const { limit, projectID } = options;
	const snapshot = await getDocs(collection(db, 'stats', auth.currentUser.uid, 'badges'));

	if (snapshot.empty) return [];
	let userBadges = Object.fromEntries(
		snapshot.docs.map((doc) => [doc.id, doc.data() as UserBadge])
	);

	if (projectID) {
		userBadges = Object.fromEntries(
			Object.entries(userBadges).filter((entry) => entry[1].projectID == projectID)
		);
	}

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

		for (const result of results) transaction.delete(result);

		transaction.delete(doc(db, 'projects', projectID, 'submissions', uid));
		transaction.delete(doc(db, 'projects', projectID, 'settings', uid));
	});
};
