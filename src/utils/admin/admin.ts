import { collection, doc, getDocs, runTransaction } from "firebase/firestore";
import { db } from "../firebase";
import type { Badge, Exercise, ExerciseFile, ExerciseMetadata } from "../types";

export const getAllBadges = async (): Promise<Record<string, Badge>> => {
    const snapshot = await getDocs(collection(db, 'badges'));
    return Object.fromEntries(snapshot.docs.map(doc => [doc.id, doc.data() as Badge]))
}

export const getExerciseAdmin = async (projectID: string,
    index: string,
    languages: string[]): Promise<Exercise> => {
    return await runTransaction(db, async (transaction) => {
        // Get the exercise metadata
        const metadata = (
            await transaction.get(doc(db, 'projects', projectID, 'exercises', index))
        ).data() as ExerciseMetadata;

        // Get the exercise files
        const files: Record<string, Record<string, ExerciseFile>> = {};
        for (const language of languages) {
            files[language] = (
                await transaction.get(
                    doc(db, 'projects', projectID, 'exercises', index, 'files', language)
                )
            ).data() as Record<string, ExerciseFile>;
        }
        return {
            ...metadata,
            files: files
        };
    })
}