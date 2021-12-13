import { deleteDoc, doc, getDoc as _getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { writable, get } from 'svelte/store';
import { format } from '../codemirror/codemirror';
import { createFile, filesystem, getAllFiles, getExtension } from '../filesystem/filesystem';
import { auth, db } from '../firebase';
import { get as httpGet } from '../network/network';
import type { Exercise, Template, TestResult } from '../types';
import type { DocumentData } from 'firebase/firestore';
import { openTab, selectedTab, tabs, unsavedTabs } from '../tabs/tabs';

/**
 * The current exercise being completed
 */
export const exercise = writable<Exercise>();

/**
 * The ID of the current exercise
 */
export const exerciseID = writable<string>();

/**
 * The result of the latest submission
 */
export const result = writable<TestResult>();

/**
 * The template loaded when the exercise is first opened
 */
export const template = writable<Template>();

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
 * A timer callback for determining when to stop listening for submission results.
 */
let timeout: NodeJS.Timeout;

/**
 * Load the exercise with the given ID into the application.
 *
 * @param id The exercise ID
 */
export const loadExercise = async (): Promise<void> => {
	const ex = (await getDoc('exercises', get(exerciseID))) as Exercise;

	// Check if the user has made a previous submission
	const submissionID = get(exerciseID) + auth.currentUser.uid;
	const submission = (await getDoc('submissions', submissionID)) as Template;

	let source: Record<string, string>;
	if (submission) source = submission.files;
	else {
		const template = (await getDoc('templates', ex.template.id)) as Template;
		source = template.files;
		// Apply the overrides if present
		if (ex.overrides) {
			for (const [path, value] of Object.entries(ex.overrides)) {
				source[path] = value;
			}
		}
	}

	// Create the filesystem from the template
	for (const [path, value] of Object.entries(source)) {
		// Format the values as whitespace is not preserved by firebase.
		createFile(path, format(value, getExtension(path)), false);
	}

	exercise.set(ex);
	initialising.set(false);
};

export const reset = async (): Promise<void> => {
	initialising.set(true);
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
export const submit = async (): Promise<void> => {
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

	const response = await httpGet(endpoint);
	try {
		result.set(response['message'] as TestResult);
	} catch (err) {
		console.error('Unable to parse test results');
	}
	pending.set(false);
	clearTimeout(timeout);
};

export const restoreDefaults = (): void => {
	initialising.set(true);
	exercise.set(undefined);
	aborted.set(false);
	exerciseID.set(undefined);
	pending.set(false);
	result.set(undefined);
	template.set(undefined);
	filesystem.set({});
	selectedTab.set(undefined);
	tabs.set([]);
	unsavedTabs.set([]);
};
