import { deleteDoc, doc, getDoc as _getDoc, setDoc } from 'firebase/firestore';
import { writable, get } from 'svelte/store';
import { createFile, filesystem, getAllFiles } from '../filesystem/filesystem';
import { auth, db } from '../firebase';
import { get as httpGet } from '../network/network';
import type { Exercise, TestResult } from '../types';
import type { DocumentData } from 'firebase/firestore';
import { selectedTab, tabs, unsavedTabs } from '../tabs/tabs';
import type { Project } from "src/utils/types"

/**
 * The current exercise being completed
 */
export const exercise = writable<Exercise>();
/**
 * Metadata about the current project
 */
export const project = writable<Project>();

export const language = writable<string>();

/**
 * The result of the latest submission
 */
export const result = writable<TestResult>();


/**
 * Whether a submission is currently pending results
 */
export const pending = writable<boolean>(false);

/**
 * Whether a submission has failed and should be aborted
 */
export const aborted = writable<boolean>(false);

/**
 * Whether the exercise is currently being loaded for the first time
 */
export const initialising = writable<boolean>(true);

/**
 * Whether the user has made a submission yet.
 */
export const submitted = writable<boolean>(false);

/**
 * A timer callback for determining when to stop listening for submission results.
 */
let timeout: NodeJS.Timeout;

/**
 * Load the exercise with the given ID into the application.
 *
 * @param id The exercise ID
 */
export const loadExercise = async (): Promise<void> => {
	const source = get(exercise).files[get(language)]

	// Create the filesystem from the template
	for (const [path, value] of Object.entries(source)) {

		createFile(path, value.contents, value.editable);
	}

	initialising.set(false);
};

export const reset = async (): Promise<void> => {
	initialising.set(true);
	submitted.set(false);
	const submissionID = get(exerciseID) + auth.currentUser.uid;
	const submission = doc(db, 'submissions', submissionID);
	if (submission) {
		await deleteDoc(submission);
	}
	filesystem.set({});
	loadExercise();
};

/**
 * A wrapper method for firestore document retrieval.
 *
 * @param collection The collection to get the doc from
 * @param id The id of the doc in the collection
 * @returns The id of the doc if it exists, otherwise undefined
 */
export const getDoc = async (collection: string, id: string): Promise<DocumentData> => {
	try {
		const ref = doc(db, collection, id);
		const snapshot = await _getDoc(ref);
		return snapshot.data();
	} catch (err) {
		return;
	}
};

export const save = async (): Promise<void> => {
	const files = getAllFiles('', get(filesystem));
	const submission = {
		files: {},
		exercise: doc(db, 'exercises', get(exerciseID))
	};
	files.forEach((file) => (submission.files[file.name] = file.code));

	const id = get(exerciseID) + auth.currentUser.uid;
	const sub = doc(db, 'submissions', id);
	await setDoc(sub, submission);
};


/**
 * Submit the filesystem to generate a mark.
 *
 * @returns A void promise that resolves when the submission request is completed.
 */
export const submit = async (): Promise<string | void> => {
	let message: string;
	save();
	const id = get(exerciseID) + auth.currentUser.uid;
	aborted.set(false);
	pending.set(true);

	// Give up after 120 seconds.
	timeout = setTimeout(() => {
		pending.set(false);
		aborted.set(true);
	}, 120000);

	let endpoint: string;
	if (import.meta.env.DEV) {
		endpoint = 'http://localhost:9080/submissions/' + id;
	} else {
		endpoint = 'https://submission-server-rly7tdzvgq-ew.a.run.app/submissions/' + id;
	}
	try {
		const response = await httpGet(endpoint);
		result.set(response['message'] as TestResult);
		submitted.set(true);
	} catch {
		message = 'Unable to reach the submission server. Please try again later';
	}

	pending.set(false);
	clearTimeout(timeout);
	return message;
};

export const restoreDefaults = (): void => {
	initialising.set(true);
	exercise.set(undefined);
	aborted.set(false);
	exerciseID.set(undefined);
	pending.set(false);
	result.set(undefined);
	filesystem.set({});
	selectedTab.set(undefined);
	tabs.set([]);
	unsavedTabs.set([]);
};
