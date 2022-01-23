import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Project, Exercise, ExerciseMetadata, ExerciseFile, ExerciseChapter } from "../types";

export const getExerciseChapters = async (exerciseID: string): Promise<ExerciseChapter[]> => {
    const snapshot = await getDoc(doc(db, 'exercise_chapters', exerciseID));
    if (snapshot.exists) {
        return Object.values(snapshot.data())
    } else {
        throw (`Exercise ${exerciseID} does not exist`);
    }
}

export const getAllExerciseFiles = async (exerciseID: string): Promise<Record<string, Record<string, ExerciseFile>>> => {
    const snapshot = await getDocs(collection(db, 'exercise_files', exerciseID, 'languages'));
    const result: Record<string, Record<string, ExerciseFile>> = {}
    if (!snapshot.empty) {
        snapshot.forEach((doc) => {
            result[doc.id] = doc.data() as Record<string, ExerciseFile>
        })
        return result
    } else {
        throw (`Exercise ${exerciseID} does not exist`);
    }
}

export const getExerciseFiles = async (exerciseID: string, language: string): Promise<Record<string, ExerciseFile>> => {
    const snapshot = await getDoc(doc(db, 'exercise_files', exerciseID, 'languages', language));
    if (snapshot.exists) {
        return snapshot.data()
    } else {
        throw (`Exercise ${exerciseID} does not exist`);
    }
}

export const getExercise = async (projectID: string, exerciseID: string): Promise<ExerciseMetadata> => {
    const snapshot = await getDoc(doc(db, 'projects', projectID, 'exercises', exerciseID));
    if (snapshot.exists) {
        return snapshot.data() as Exercise
    } else {
        throw (`Exercise ${exerciseID} in project ${projectID} does not exist`);
    }
}

export const getExercises = async (projectID: string): Promise<Record<string, ExerciseMetadata>> => {
    const snapshot = await getDocs(collection(db, 'projects', projectID, 'exercises'));
    const result: Record<string, ExerciseMetadata> = {}
    if (!snapshot.empty) {
        snapshot.forEach((doc) => {
            result[doc.id] = doc.data() as ExerciseMetadata
        })
        return result
    } else {
        throw (`Project ${projectID} has no exercises`);
    }
}

export const getProject = async (projectID: string): Promise<Project> => {
    const snapshot = await getDoc(doc(db, 'projects', projectID));
    if (snapshot.exists()) {
        return snapshot.data() as Project
    } else {
        throw ('Project ' + projectID + ' does not exist');
    }
}