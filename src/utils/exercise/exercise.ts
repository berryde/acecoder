import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { writable, get } from 'svelte/store';
import { createFile, filesystem, getAllFiles } from '../filesystem/filesystem';
import { auth, db } from '../firebase';
import type { Exercise, ServerRequest, ServerResponse } from '../types';
import { selectedTab, tabs, unsavedTabs } from '../tabs/tabs';
import type { Project } from 'src/utils/types';
import axios from 'axios';

/**
 * The current exercise being completed
 */
export const exercise = writable<Exercise>();
/**
 * Metadata about the current project
 */
export const project = writable<Project>();
export const chapter = writable<number>(0);
export const language = writable<string>();

/**
 * The result of the latest submission
 */
export const result = writable<ServerResponse>();

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
 * Load the exercise with the given ID into the application.
 *
 * @param id The exercise ID
 */
export const loadExercise = async (): Promise<void> => {
	const source = get(exercise).files[get(language)];

	// Create the filesystem from the template
	for (const [path, value] of Object.entries(source)) {
		createFile(path, value.contents, value.editable);
	}

	initialising.set(false);
};

export const reset = async (projectID: string, exerciseID: string): Promise<void> => {
	initialising.set(true);
	submitted.set(false);
	const submission = doc(
		db,
		'projects',
		projectID,
		'exercises',
		exerciseID,
		'submissions',
		auth.currentUser.uid
	);
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
export const submit = async (projectID: string, exerciseID: string): Promise<ServerResponse> => {
	const files = getAllFiles('', get(filesystem));
	const submission = {};
	const editable = Object.keys(get(exercise).files[get(language)]).filter(
		(filename) => get(exercise).files[get(language)][filename].editable
	);
	files.forEach((file) => {
		if (editable.includes(file.name)) {
			submission[file.name] = file.code;
		}
	});
	await setDoc(
		doc(db, 'projects', projectID, 'exercises', exerciseID, 'submissions', auth.currentUser.uid),
		submission
	);

	let endpoint: string;
	if (import.meta.env.DEV) {
		endpoint = 'http://localhost:9080/api/submit';
	} else {
		endpoint = 'https://submission-server-rly7tdzvgq-ew.a.run.app/api/submit';
	}
	const request: ServerRequest = {
		exerciseID: exerciseID,
		projectID: projectID,
		userID: auth.currentUser.uid
	};
	const response = await axios.post(endpoint, request, {
		headers: {
			authorization: `Bearer ${await auth.currentUser.getIdToken()}`
		}
	});
	if (response.status == 200) {
		const data = response.data as ServerResponse;

		if (data[get(chapter)]) {
			chapter.update((chapter) => chapter + 1);
		}

		result.set(data);
		return data;
	} else {
		throw 'Submission request failed';
	}
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
