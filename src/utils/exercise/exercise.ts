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

export const reset = async (projectID: string, exerciseID: string): Promise<void> => {
	initialising.set(true);
	submitted.set(false);
	const submission = doc(db, 'projects', projectID, 'exercises', exerciseID, 'submissions', auth.currentUser.uid);
	if (submission) {
		await deleteDoc(submission);
	}
	filesystem.set({});
	loadExercise();
};


/**
 * Submit the filesystem to generate a mark.
 *
 * @returns A void promise that resolves when the submission request is completed.
 */
export const submit = async (projectID: string, exerciseID: string): Promise<string | void> => {
	const files = getAllFiles('', get(filesystem));
	const submission = {};
	files.forEach((file) => (submission[file.name] = file.code));
	await setDoc(doc(db, 'projects', projectID, 'exercises', exerciseID, 'submissions', auth.currentUser.uid), submission);

	let message: string;
	aborted.set(false);
	pending.set(true);
	// Give up after 120 seconds.
	timeout = setTimeout(() => {
		pending.set(false);
		aborted.set(true);
	}, 120000);


	//TODO: Post projectID, exerciseID and UID to the server.
	// let endpoint: string;
	// if (import.meta.env.DEV) {
	// 	endpoint = 'http://localhost:9080/submissions/' + id;
	// } else {
	// 	endpoint = 'https://submission-server-rly7tdzvgq-ew.a.run.app/submissions/' + id;
	// }
	// try {
	// 	const response = await httpGet(endpoint);
	// 	result.set(response['message'] as TestResult);
	// 	submitted.set(true);
	// } catch {
	// 	message = 'Unable to reach the submission server. Please try again later';
	// }

	pending.set(false);
	clearTimeout(timeout);
	return message;
};

export const restoreDefaults = (): void => {
	initialising.set(true);
	exercise.set(undefined);
	aborted.set(false);
	pending.set(false);
	result.set(undefined);
	filesystem.set({});
	selectedTab.set(undefined);
	tabs.set([]);
	unsavedTabs.set([]);
};
