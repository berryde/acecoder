import { addDoc, collection, doc, DocumentReference, getDoc, onSnapshot } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { format } from '../codemirror/codemirror';
import { createFile, getAllFiles, getExtension } from '../filesystem/filesystem';
import { db } from '../firebase';
import { get } from '../network/network';
import type { Exercise, Filesystem, Template, TestResult } from '../types';

export const exercise = writable<Exercise>();
const exerciseRef = writable<DocumentReference>();
const submissionId = writable<string>();
export const result = writable<TestResult>();

export const loadExercise = async (name: string): Promise<void> => {
	// Load the exercise
	const exerciseSnapshot = await getDoc(doc(db, 'exercises', name));
	if (!exerciseSnapshot.exists()) {
		console.error('Exercise ' + name + ' does not exist');
		return;
	}

	const ex = exerciseSnapshot.data() as Exercise;
	exercise.set(ex);
	exerciseRef.set(exerciseSnapshot.ref);

	// Load the template from the exercise
	const templateSnapshot = await getDoc(ex.template);
	if (!templateSnapshot.exists()) {
		console.error('Template for exercise ' + ex + ' does not exist');
		return;
	}
	const template = templateSnapshot.data() as Template;

	// eslint-disable-next-line prefer-const
	for (let [path, value] of Object.entries(template.files)) {
		// Remove the devdependencies as these are only used for testing.
		if (path == 'package.json') {
			value = value.replace(/(,?)(\s)*("?)devDependencies("?):(\s*)\{([^}]*)\}/, '');
		}
		// Format the values as whitespace is not preserved by firebase.
		createFile(path, format(value, getExtension(path)));
	}
};

export const submit = async (filesystem: Filesystem): Promise<void> => {
	let exRef: DocumentReference;
	let ex: Exercise;
	exerciseRef.subscribe((exerciseRef) => {
		exerciseRef && (exRef = exerciseRef);
	});
	exercise.subscribe((exercise) => {
		exercise && (ex = exercise);
	});

	if (!exRef || !ex) return;
	const files = getAllFiles('', filesystem);
	const submission = {
		files: {},
		exercise: exRef
	};
	files.forEach((file) => (submission.files[file.name] = file.code));

	const sub = await addDoc(collection(db, 'submissions'), submission);
	submissionId.set(sub.id);

	get('http://localhost:9123/submissions/' + sub.id);
};

export const getResults = async (): Promise<void> => {
	let id: string;
	submissionId.subscribe((submissionId) => (id = submissionId));

	const unsubscribe = onSnapshot(doc(db, 'results', id), (doc) => {
		if (doc.data()) {
			result.set(doc.data() as TestResult);
			unsubscribe();
		}
	});
};
