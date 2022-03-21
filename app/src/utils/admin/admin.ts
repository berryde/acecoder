import { collection, doc, getDocs, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import type { Badge, Exercise, FSFile, ExerciseMetadata } from '~shared/types';

/**
 * Get all badges from Firebase
 *
 * @returns A map of badge ID to badge data
 */
export const getAllBadges = async (): Promise<Record<string, Badge>> => {
	const snapshot = await getDocs(collection(db, 'badges'));
	return Object.fromEntries(snapshot.docs.map((doc) => [doc.id, doc.data() as Badge]));
};

/**
 * Fetches an exercise along with all of its files
 *
 * @param projectID The project the exercise belongs to
 * @param index The index of the exercise within the project
 * @param languages The languages to retrieve files for
 * @returns The retrieved exercise
 */
export const getExercise = async (
	projectID: string,
	index: string,
	languages: string[]
): Promise<Exercise> => {
	return await runTransaction(db, async (transaction) => {
		// Get the exercise metadata
		const metadata = (
			await transaction.get(doc(db, 'projects', projectID, 'exercises', index))
		).data() as ExerciseMetadata;

		// Get the exercise files
		const files: Record<string, Record<string, FSFile>> = {};
		for (const language of languages) {
			files[language] = (
				await transaction.get(doc(db, 'projects', projectID, 'exercises', index, 'files', language))
			).data() as Record<string, FSFile>;
		}
		return {
			...metadata,
			files: files
		};
	});
};
