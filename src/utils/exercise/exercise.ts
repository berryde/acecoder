import { doc, runTransaction } from 'firebase/firestore';
import { writable, get } from 'svelte/store';
import { createFile, filesystem, getAllFiles } from '../filesystem/filesystem';
import { auth, db } from '../firebase';
import type { Exercise, ServerRequest, ServerResponse } from '../types';
import type { Project } from 'src/utils/types';
import axios from 'axios';

/**
 * The current exercise being completed
 */
export const exercise = writable<Exercise>(undefined);
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
 * Whether the exercise is currently being loaded for the first time
 */
export const initialising = writable<boolean>(true);
export const points = writable<number>(0);

/**
 * Load the exercise with the given ID into the filesystem.
 */
export const loadExercise = async (exercise: Exercise, language: string): Promise<void> => {
	const source = exercise.files[language];
	// Create the filesystem from the template
	for (const [path, value] of Object.entries(source)) {
		createFile(path, value.value, value.modifiable);
	}

	initialising.set(false);
};

export const reset = async (): Promise<void> => {
	initialising.set(true);
	filesystem.set({});
	loadExercise(get(exercise), get(language));
};

export const write = async (projectID: string): Promise<void> => {
	const files = getAllFiles('', get(filesystem));
	const submission: Record<string, string> = {};
	const editable = Object.keys(get(exercise).files[get(language)]).filter(
		(filename) => get(exercise).files[get(language)][filename].modifiable
	);
	files.forEach((file) => {
		if (editable.includes(file.name)) {
			submission[file.name] = file.code;
		}
	});
	await runTransaction(db, async (transaction) => {
		if (auth.currentUser == null) throw 'You need to be logged in to perform that action';
		const existing = (
			await transaction.get(doc(db, 'projects', projectID, 'submissions', auth.currentUser.uid))
		).data() as Record<string, string>;
		const updated = { ...existing, ...submission };
		transaction.set(doc(db, 'projects', projectID, 'submissions', auth.currentUser.uid), updated);
	});
};

/**
 * Submit the filesystem to generate a mark.
 *
 * @returns A void promise that resolves when the submission request is completed.
 */
export const test = async (projectID: string, exerciseID: string): Promise<ServerResponse> => {
	if (!auth.currentUser) throw 'You need to be logged in to perform that action';
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
		result.set(data);
		return data;
	} else {
		throw 'Submission request failed';
	}
};
