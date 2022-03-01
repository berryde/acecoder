import { reset, write } from './files';
import { db } from './firebase';
import type { FSFile } from '~shared/types';

export const setupTests = async (
	projectID: string,
	exerciseID: string,
	uid: string,
	dir: string
): Promise<void> => {
	reset(dir);
	const files: Record<string, string> = await db.runTransaction(async (transaction) => {
		const projectRef = db.collection('projects').doc(projectID);
		const exerciseRef = projectRef.collection('exercises').doc(exerciseID);

		// Fetch the user's settings
		const settingsSnapshot = await transaction.get(projectRef.collection('settings').doc(uid));
		if (!settingsSnapshot.exists) {
			throw 'No settings could be found for that user';
		}
		const settings = settingsSnapshot.data() as {
			language: string;
			progress: number;
		};

		if (settings.progress < parseInt(exerciseID)) {
			throw 'This exercise has not been unlocked yet';
		}

		// Fetch the exercise files
		const filesSnapshot = await transaction.get(
			exerciseRef.collection('files').doc(settings.language)
		);
		if (!filesSnapshot.exists) {
			throw "That exercise doesn't exist";
		}
		const exerciseFiles = filesSnapshot.data() as Record<string, FSFile>;

		// Fetch the submission
		const submissionSnapshot = await transaction.get(projectRef.collection('submissions').doc(uid));
		if (!submissionSnapshot.exists) {
			throw "That submission doesn't exist";
		}
		const submission = submissionSnapshot.data() as Record<string, string>;

		const files: Record<string, string> = {};
		Object.keys(exerciseFiles).forEach((name) => (files[name] = exerciseFiles[name].value));
		Object.keys(submission).forEach((name) => (files[name] = submission[name]));
		return files;
	});

	for (const [name, value] of Object.entries(files)) {
		const path = dir + '/' + name;

		// Write the file to the filesystem
		const result = write(path, value);
		if (!result) {
			throw 'Unable to write file ' + path;
		}
	}
};
