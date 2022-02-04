import type admin = require('firebase-admin')

export type Settings = { language: string, progress: string, completed: boolean }

export type Project = {
    exerciseCount: number;
}

export type Exercise = { assessed: boolean }

export type ProjectSettings = {
    progress: number;
    language: string;
    completed: boolean;
};

export type Badge = {
    description: string;
    name: string;
    reward: number;
    image: string;

}

export type UserBadge = {
    timestamp: admin.firestore.Timestamp;
    projectID: string;
}

export type UserStats = {
    completed: number
    react: number
    svelte: number
    points: number
}
