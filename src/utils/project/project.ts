import { collection, doc, getDoc, getDocs, runTransaction } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Project, Exercise, ExerciseMetadata, ExerciseFile, ProjectSettings } from "../types";

/**
 * Gets exercise metadata and files as an atomic transaction. If a list of languages is provided, the files for each language are provided.
 * @param projectID The ID of the project.
 * @param index The index of the project.
 * @param languages The languages of the project. If not specified, the language is determined based on the user's settings.
 */
export const getExercise = async (projectID: string, index: string, languages?: string[]): Promise<Exercise> => {
    try {
        return await runTransaction(db, async (transaction) => {
            // Get the exercise metadata
            const metadata = (await transaction.get(doc(db, 'projects', projectID, 'exercises', index))).data() as ExerciseMetadata
            // Get the exercise files
            let files: Record<string, Record<string, ExerciseFile>>;
            if (languages) {
                files = {}
                for (const language of languages) {
                    files[language] = (await transaction.get(doc(db, 'projects', projectID, 'exercises', index, 'files', language))).data() as Record<string, ExerciseFile>
                }
            } else {
                // Determine the language based on the user's settings
                const language = (await transaction.get(doc(db, 'projects', projectID, 'settings', auth.currentUser.uid))).data()['language']
                files = (await transaction.get(doc(db, 'projects', projectID, 'exercises', index, 'files', language))).data()
            }
            return {
                ...metadata,
                files: files
            }
        })
    } catch (e) {
        console.error(`Failed to get exercise ${projectID}[${index}] due to an error`)
        if (import.meta.env.DEV) {
            console.error(e)
        }
    }
}

/**
 * Retrieves the metadata for an exercise without fetching the files unnecessarily.
 * 
 * @param projectID The project id.
 * @param index The index of the exercise within the project.
 * @returns Metadata about the exercise such as the name and description.
 */
export const getExerciseMetadata = async (projectID: string, index?: string): Promise<ExerciseMetadata> => {
    const snapshot = await getDoc(doc(db, 'projects', projectID, 'exercises', index));
    if (snapshot.exists) {
        return snapshot.data() as ExerciseMetadata
    } else {
        throw (`Exercise ${index} in project ${projectID} does not exist`);
    }
}

/**
 * Loads the metadata for all available exercise of a project without loading the files, for use on the project overview page.
 * 
 * @param projectID The project ID.
 * @returns Metadata for all of the exercises in a project
 */
export const getAllExerciseMetadata = async (projectID: string): Promise<Record<string, ExerciseMetadata>> => {
    const snapshot = await getDocs(collection(db, 'projects', projectID, 'exercises'));
    const result: Record<string, ExerciseMetadata> = {}
    try {
        snapshot.forEach((doc) => {
            result[doc.id] = doc.data() as ExerciseMetadata
        })
        return result
    } catch (err) {
        throw (`Unable to fetch exercises for project ${projectID}`);
    }
}


export const getProjectSettings = async (projectID: string): Promise<ProjectSettings> => {
    const snapshot = await getDoc(doc(db, 'projects', projectID, 'settings', auth.currentUser.uid))
    if (snapshot.exists()) {
        return snapshot.data() as ProjectSettings
    } else {
        throw (`User settings on project ${projectID} do not exist for this user`)
    }

}

/**
 * Gets the data associated with a single project.
 * @param projectID The project ID.
 * @returns The project data.
 */
export const getProject = async (projectID: string): Promise<Project> => {
    const snapshot = await getDoc(doc(db, 'projects', projectID));
    if (snapshot.exists()) {
        return snapshot.data() as Project
    } else {
        throw ('Project ' + projectID + ' does not exist');
    }
}