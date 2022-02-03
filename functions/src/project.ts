import functions = require('firebase-functions');
import admin = require('firebase-admin');
import type { Badge, Exercise, Project, Settings } from "./types"

const store = admin.firestore()

export const incrementProgress = functions.region('europe-west2').https.onCall(async (data: { projectID: string, exerciseID: string }, context) => {
    if (context.auth) {
        const { projectID, exerciseID } = data
        const uid = context.auth.uid
        const store = admin.firestore()
        try {
            await store.runTransaction(async (transaction) => {
                // Fetch the project metadata
                const project = await getProject(transaction, projectID)

                // Check if the index is within the range of the project
                const index = parseInt(exerciseID)
                if (index >= project.exerciseCount) throw ("That exercise does not exist")

                // Fetch the user's settings
                const settings = await getSettings(transaction, projectID, uid)
                const progress = parseInt(settings.progress)

                if (progress != index) throw (`Cannot increment a non-current exercise. Trying to increment ${exerciseID} with progress ${settings.progress}`)

                // Get the exercise metadata to check if the exercise is assessed.
                const exercise = await getExercise(transaction, projectID, exerciseID)
                let passed = !exercise.assessed

                if (exercise.assessed) {
                    // Fetch the user's results to check if they have passed all of the chapters.
                    const results = getResults(transaction, projectID, exerciseID, uid)
                    passed = Object.values(results).every(result => result.passed)
                }

                if (passed) {
                    console.log(`Incrementing progress from ${settings.progress} for user ${uid} to ${index + 1}`)
                    transaction.update(getProjectRef(projectID).collection('settings').doc(uid), {
                        'progress': (progress + 1).toString()
                    })
                }
            })
        } catch (err) {
            console.error(err)
        }
    }
})

const getProjectRef = (projectID: string): admin.firestore.DocumentReference => {
    return store.collection('projects').doc(projectID)
}

const getExerciseRef = (projectID: string, exerciseID: string): admin.firestore.DocumentReference => {
    return getProjectRef(projectID).collection('exercises').doc(exerciseID)
}

const getExercise = async (transaction: admin.firestore.Transaction, projectID: string, exerciseID: string): Promise<Exercise> => {
    const snapshot = await transaction.get(getExerciseRef(projectID, exerciseID))
    if (!snapshot.exists) throw (`Exercise ${exerciseID} does not exist in project ${projectID}`)
    return snapshot.data() as Exercise
}

const getProject = async (transaction: admin.firestore.Transaction, projectID: string): Promise<Project> => {
    const snapshot = await transaction.get(getProjectRef(projectID))
    if (!snapshot.exists) throw (`Project ${projectID} does not exist`)
    return snapshot.data() as Project
}

const getResults = async (transaction: admin.firestore.Transaction, projectID: string, exerciseID: string, uid: string): Promise<Record<number, { passed: boolean }>> => {
    const snapshot = await transaction.get(getExerciseRef(projectID, exerciseID).collection('results').doc(uid))
    if (!snapshot.exists) throw ("No results could be found for that user")
    return snapshot.data() as Record<number, { passed: boolean }>
}

const getBadge = async (transaction: admin.firestore.Transaction, badgeID: string): Promise<Badge> => {
    const snapshot = await transaction.get(admin.firestore().collection('badges').doc(badgeID));
    if (!snapshot.exists) {
        throw `Badge ${badgeID} does not exist!`
    }
    return snapshot.data() as {
        description: string;
        name: string;
        reward: number;
    }
}

const getSettings = async (transaction: admin.firestore.Transaction, projectID: string, uid: string): Promise<Settings> => {
    const snapshot = await transaction.get(getProjectRef(projectID).collection('settings').doc(uid))
    if (!snapshot.exists) throw ("No settings could be found for that user")
    return snapshot.data() as Settings
}

export const completeProject = functions.region('europe-west2').https.onCall(async (data: { projectID: string }, context) => {
    if (context.auth) {
        const { projectID } = data
        const uid = context.auth.uid
        try {
            return await store.runTransaction(async (transaction) => {
                // Fetch the user's settings
                const settings = await getSettings(transaction, projectID, uid)
                if (settings.completed) throw "Project already completed"
                // Fetch the project metadata
                const project = await getProject(transaction, projectID)
                const progress = parseInt(settings.progress)

                if (progress != project.exerciseCount - 1) throw "Some exercises have not been completed yet"

                // Get the user's stats
                type Stats = { react: number, svelte: number, completed: number, badges: Record<string, boolean>, points: number }
                let stats: Stats = {
                    react: 0,
                    svelte: 0,
                    completed: 0,
                    badges: {},
                    points: 0
                }
                const statsSnapshot = (await transaction.get(store.collection('stats').doc(context.auth.uid)))
                if (statsSnapshot.exists) {
                    stats = statsSnapshot.data() as Stats
                }

                stats[settings.language] += 1
                stats['completed'] += 1

                const badges: Badge[] = []

                //TODO: write a function that calculates the badges to add based on the user stats.
                //TODO: add timestamp to user badges in stats so that they can be sorted.

                // A badge awarded for completing a single exercise
                if (stats.completed == 1) {
                    let badge = await getBadge(transaction, 'completed_1')
                    stats.badges['completed_1'] = true
                    stats.points += badge.reward
                    badges.push(badge)
                }
                // A badge awarded for completing a single exercise in the given language
                if (stats[settings.language] == 1) {
                    let badge = await getBadge(transaction, `${settings.language}_1`)
                    stats.badges[`${settings.language}_1`] = true
                    stats.points += badge.reward
                    badges.push(badge)
                }
                // A badge awarded for completing the project
                let badge = await getBadge(transaction, data.projectID)
                stats.badges[data.projectID] = true
                stats.points += badge.reward
                badges.push(badge)

                transaction.update(store.collection('projects').doc(data.projectID).collection('settings').doc(context.auth.uid), {
                    completed: true
                })

                transaction.set(store.collection('stats').doc(context.auth.uid), stats)

                return badges
            })
        } catch (err) {
            console.error(err)
        }
    }
})

