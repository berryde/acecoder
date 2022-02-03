export type Badge = {
    description: string;
    name: string;
    reward: number;
}

export type Settings = { language: string, progress: string, completed: boolean }

export type Project = {
    exerciseCount: number;
}

export type Exercise = { assessed: boolean }