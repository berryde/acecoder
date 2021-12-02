import { doc, getDoc as _getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { writable, get } from 'svelte/store';
import { format } from '../codemirror/codemirror';
import { createFile, filesystem, getAllFiles, getExtension } from '../filesystem/filesystem';
import { db } from '../firebase';
import { get as httpGet } from '../network/network';
import type { Exercise, Filesystem, Template, TestResult } from '../types';
import type { DocumentData } from 'firebase/firestore';
import { auth } from '../auth/auth';

export const exercise = writable<Exercise>();
export const exerciseID = writable<string>();
export const result = writable<TestResult>();
export const template = writable<Template>();
export const pending = writable<boolean>(false);
export const aborted = writable<boolean>(false);
export const isStandalone = writable<boolean>();

/**
 * A timer callback for determining when to stop listening for submission results.
 */
let timeout: NodeJS.Timeout;

/**
 * Load the exercise with the given ID into the application.
 *
 * @param id The exercise ID
 */
export const loadExercise = async (id: string): Promise<void> => {
	const uid = get(auth).uid;

	const ex = (await getDoc('exercises', id)) as Exercise;
	// Check if the user has made a previous submission
	const submissionID = id + uid;
	const submission = (await getDoc('submissions', submissionID)) as Template;

	if (submission) {
		initTemplate(submission);
	} else {
		const template = (await getDoc('templates', ex.template.id)) as Template;
		initTemplate(template);
	}

	exercise.set(ex);
	exerciseID.set(id);
};

/**
 * Restore the previous standalone editor state for the current user. If there is no previous editor state,
 * the react template is loaded.
 *
 * @param uid The current user's uid
 */
export const loadStandalone = async (uid: string): Promise<void> => {
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
	// eslint-disable-next-line prefer-const
	for (let [path, value] of Object.entries(_template.files)) {
		// Remove the devdependencies as these are only used for testing.
		if (path == 'package.json') {
			value = value.replace(/(,?)(\s)*("?)devDependencies("?):(\s*)\{([^}]*)\}/, '');
		}
		// Format the values as whitespace is not preserved by firebase.
		createFile(path, format(value, getExtension(path)));
	}
	template.set(_template);
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
export const submit = async (
	filesystem: Filesystem,
	userID: string,
	exerciseID: string
): Promise<void> => {
	const files = getAllFiles('', filesystem);
	const submission = {
		files: {},
		exercise: doc(db, 'exercises', exerciseID)
	};
	files.forEach((file) => (submission.files[file.name] = file.code));

	const ID = exerciseID + userID;
	const sub = doc(db, 'submissions', ID);
	await setDoc(sub, submission);

	aborted.set(false);
	pending.set(true);

	// Give up after 120 seconds.
	timeout = setTimeout(() => {
		pending.set(false);
		aborted.set(true);
	}, 120000);

	await httpGet('http://localhost:9080/submissions/' + ID);
};

/**
 * Save the contents of the editor to firebase for standalone editor work.
 */
export const save = async (): Promise<void> => {
	const files = getAllFiles('', get(filesystem));
	const submission = {
		files: {}
	};
	files.forEach((file) => (submission.files[file.name] = file.code));

	await setDoc(doc(db, 'standalone', get(auth).uid), submission);
};

/**
 * Subscribe to the expected location of the submission results, updating the state when retrieved.
 * @param userID The UID of the current user.
 */
export const listen = async (exerciseID: string, userID: string): Promise<void> => {
	if (exerciseID && userID) {
		onSnapshot(doc(db, 'results', exerciseID + userID), (doc) => {
			if (doc.data()) {
				if (!result || pending) {
					const data = doc.data() as TestResult;
					result.set(data);
					pending.set(false);
					clearTimeout(timeout);
				}
			}
		});
	}
};
