import { doc, runTransaction } from 'firebase/firestore';
import { writable, get } from 'svelte/store';
import { createFile, filesystem, getAllFiles, getFile } from '../filesystem/filesystem';
import { auth, db } from '../firebase';
import type { Exercise, ExerciseMetadata, FSFile, ServerRequest, ExerciseResults } from '../types';
import type { Project } from 'src/utils/types';
import axios from 'axios';
import { ERR_NO_AUTH } from '../general';
import { contents } from '../editor/editor';
import { selectedTab } from '../tabs/tabs';

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
export const result = writable<ExerciseResults>();

/**
 * Whether the exercise is currently being loaded for the first time
 */
export const initialising = writable<boolean>(true);

/**
 * Load the exercise with the given ID into the filesystem.
 */
export const loadExercise = async (): Promise<void> => {
	const source = get(exercise).files[get(language)];
	// Create the filesystem from the template
	for (const [path, value] of Object.entries(source)) {
		createFile(path, value.value, value.modifiable);
	}
};

/**
 * Gets exercise metadata and files as an atomic transaction. If a list of languages is provided, the files for each language are provided.
 * @param projectID The ID of the project.
 * @param index The index of the project.
 * @param languages The languages of the project. If not specified, the language is determined based on the user's settings.
 */
export const getExercise = async (
	projectID: string,
	index: string,
	language: string,
	useSubmission = true
): Promise<Exercise> => {
	return await runTransaction(db, async (transaction) => {
		if (auth.currentUser === null) throw Error(ERR_NO_AUTH);

		// Get the exercise metadata
		const metadata = (
			await transaction.get(doc(db, 'projects', projectID, 'exercises', index))
		).data() as ExerciseMetadata;

		// Get the exercise files
		const exerciseFiles: Record<string, FSFile> = (
			await transaction.get(doc(db, 'projects', projectID, 'exercises', index, 'files', language))
		).data() as Record<string, FSFile>;
		const files: Record<string, Record<string, FSFile>> = {
			[language]: exerciseFiles
		};

		if (useSubmission) {
			// Check if the user has made a submission and download it if so.
			const submission = await transaction.get(
				doc(db, 'projects', projectID, 'submissions', auth.currentUser.uid)
			);
			if (submission.exists()) {
				const submissionFiles = submission.data() as Record<string, string>;
				Object.keys(submissionFiles).forEach((name) => {
					if (metadata.inherits || name in files[language]) {
						files[language][name] = {
							type: 'file',
							value: submissionFiles[name],
							modifiable: Object.keys(files[language])
								.filter((name) => files[language][name].modifiable)
								.includes(name)
						};
					}
				});
			}
		}

		return {
			...metadata,
			files: files
		};
	});
};

export const reset = async (projectID: string, index: string): Promise<void> => {
	initialising.set(true);
	exercise.set(await getExercise(projectID, index, get(language), false));
	filesystem.set({});
	await loadExercise();
	contents.set((getFile(get(selectedTab)) as FSFile).value);
	initialising.set(false);
};

export const write = async (projectID: string): Promise<void> => {
	const files = getAllFiles('', get(filesystem));
	const submission: Record<string, string> = {};
	const editable = Object.keys(get(exercise).files[get(language)]).filter(
		(filename) => get(exercise).files[get(language)][filename].modifiable
	);
	Object.keys(files).forEach((name) => {
		if (editable.includes(name)) {
			submission[name] = files[name].value;
		}
	});
	await runTransaction(db, async (transaction) => {
		if (auth.currentUser == null) throw new Error(ERR_NO_AUTH);
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
export const test = async (projectID: string, exerciseID: string): Promise<ExerciseResults> => {
	if (!auth.currentUser) throw new Error(ERR_NO_AUTH);
	let endpoint: string;
	if (import.meta.env.DEV) {
		endpoint = 'http://localhost:9080/api/submit';
	} else {
		endpoint = 'https://submission-server-rly7tdzvgq-ew.a.run.app/api/submit';
	}
	const request: ServerRequest = {
		exerciseID: exerciseID,
		projectID: projectID,
		userID: auth.currentUser.uid,
		chapter: get(chapter)
	};
	const response = await axios.post(endpoint, request, {
		headers: {
			authorization: `Bearer ${await auth.currentUser.getIdToken()}`
		}
	});
	if (response.status == 200) {
		const data = response.data as ExerciseResults;
		result.set(data);
		return data;
	} else {
		throw 'Submission request failed';
	}
};
