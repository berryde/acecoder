import { doc, getDoc as _getDoc, onSnapshot, setDoc } from 'firebase/firestore';
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
 * Whether the user is using the standalone editor
 */
export const standalone = writable<boolean>();

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
	const uid = auth.currentUser.uid;

	const ex = (await getDoc('exercises', get(exerciseID))) as Exercise;
	// Check if the user has made a previous submission
	const submissionID = get(exerciseID) + uid;
	const submission = (await getDoc('submissions', submissionID)) as Template;

	if (submission) {
		initTemplate(submission);
	} else {
		const template = (await getDoc('templates', ex.template.id)) as Template;
		initTemplate(template);
	}

	exercise.set(ex);
};

/**
 * Restore the previous standalone editor state for the current user. If there is no previous editor state,
 * the react template is loaded.
 *
 * @param uid The current user's uid
 */
export const loadStandalone = async (): Promise<void> => {
	const uid = auth.currentUser.uid;
	const standalone = (await getDoc('standalone', uid)) as Template;
	if (standalone) {
		initTemplate(standalone);
	} else {
		loadTemplate('react');
	}
};

/**
 * Retrieve a template from firestore and loads it.
 *
 * @param id The ID of the template in firestore.
 */
export const loadTemplate = async (id: string): Promise<void> => {
	const _template = (await getDoc('templates', id)) as Template;
	initTemplate(_template);
};

/**
 * Load a given template into the filesystem.
 *
 * @param _template The template to initialise
 */
const initTemplate = (_template: Template) => {
	let entry: string;
	// eslint-disable-next-line prefer-const
	for (let [path, value] of Object.entries(_template.files)) {
		// Remove the devdependencies as these are only used for testing.
		try {
			if (path == 'package.json') {
				value = value.replace(/(,?)(\s)*("?)devDependencies("?):(\s*)\{([^}]*)\}/, '');
				const pkg = JSON.parse(value);
				entry = pkg['main'];
			}
		} finally {
			// Format the values as whitespace is not preserved by firebase.
			createFile(path, format(value, getExtension(path)));
		}
	}
	template.set(_template);
	// Open the entry point specified in package.json
	if (entry) openTab(entry);
	initialising.set(false);
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

/**
 * Submit the files to generate a mark.
 *
 * @param filesystem The files of the submission.
 * @returns A void promise that resolves when the submission request is completed.
 */
export const submit = async (): Promise<void> => {
	const files = getAllFiles('', get(filesystem));
	const submission = {
		files: {},
		exercise: doc(db, 'exercises', get(exerciseID))
	};
	files.forEach((file) => (submission.files[file.name] = file.code));

	const id = get(exerciseID) + auth.currentUser.uid;
	const sub = doc(db, 'submissions', id);
	await setDoc(sub, submission);

	aborted.set(false);
	pending.set(true);

	// Give up after 120 seconds.
	timeout = setTimeout(() => {
		pending.set(false);
		aborted.set(true);
	}, 120000);

	if (import.meta.env.DEV) {
		await httpGet('http://localhost:9080/submissions/' + id);
	} else {
		await httpGet('https://submission-server-rly7tdzvgq-ew.a.run.app/submissions/' + id);
	}
};

/**
 * Save the contents of the editor to firebase for standalone editor work.
 */
export const saveStandalone = async (): Promise<void> => {
	const files = getAllFiles('', get(filesystem));
	const submission = {
		files: {}
	};
	files.forEach((file) => (submission.files[file.name] = file.code));
	await setDoc(doc(db, 'standalone', auth.currentUser.uid), submission);
};

export const restoreDefaults = (_standalone: boolean): void => {
	initialising.set(true);
	exercise.set(undefined);
	aborted.set(false);
	exerciseID.set(undefined);
	pending.set(false);
	standalone.set(_standalone);
	result.set(undefined);
	template.set(undefined);
	filesystem.set({});
	selectedTab.set(undefined);
	tabs.set([]);
	unsavedTabs.set([]);
};

/**
 * Subscribe to the expected location of the submission results, updating the state when retrieved.
 * @param userID The UID of the current user.
 */
export const listen = async (): Promise<void> => {
	const uid = auth.currentUser.uid;

	onSnapshot(doc(db, 'results', get(exerciseID) + uid), (doc) => {
		if (doc.data()) {
			if (!result || pending) {
				const data = doc.data() as TestResult;
				result.set(data);
				pending.set(false);
				clearTimeout(timeout);
			}
		}
	});
};
