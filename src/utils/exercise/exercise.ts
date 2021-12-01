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
export const isStandalone = writable<boolean>();

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

export const loadStandalone = async (uid: string): Promise<void> => {
	const standalone = (await getDoc('standalone', uid)) as Template;
	if (standalone) {
		initTemplate(standalone);
	} else {
		loadTemplate('react');
	}
};

export const loadTemplate = async (id: string): Promise<void> => {
	const _template = (await getDoc('templates', id)) as Template;
	initTemplate(_template);
};

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
 * Submits the files to generate a mark.
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
	httpGet('https://submission-server-rly7tdzvgq-ew.a.run.app/submissions/' + sub.id);

	pending.set(true);
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
 * Subscribes to the expected location of the submission results, updating the state when retrieved.
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
				}
			}
		});
	}
};
