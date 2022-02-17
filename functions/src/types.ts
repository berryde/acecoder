import type admin = require('firebase-admin');

export type Settings = { language: string; progress: string; completed: boolean };

/**
 * A project consists of multiple exercises and represents a single, long task resulting in a final submission that can be downloaded
 */
export type Project = {
	/**
	 * The name of the project
	 */
	name: string;
	/**
	 * A detailed description of the project
	 */
	description: string;
	/**
	 * The total number of exercises within this project
	 */
	exerciseCount: number;
	/**
	 * The languages this project can be completed with
	 */
	languages: string[];
	/**
	 * The preview image to use for this project
	 */
	thumbnail: string;
	/**
	 * A brief sentence describing the project
	 */
	overview: string;
};

export type UserCertificate = {
	/**
	 * The timestamp at which the badge was awarded
	 */
	timestamp: admin.firestore.Timestamp;
	/**
	 * The id of the project for which this badge was awarded
	 */
	projectID: string;
}


export type Exercise = { assessed: boolean };

export type ProjectSettings = {
	progress: number;
	language: string;
	completed: boolean;
};

export type Badge = {
	description: string;
	name: string;
	image: string;
	conditions: Record<string, number>;
};

export type UserBadge = {
	timestamp: admin.firestore.Timestamp;
	projectID: string;
};

export type UserStats = {
	completed: number;
	react: number;
	svelte: number;
};

export type Certificate = {
	issued: admin.firestore.Timestamp;
	name: string;
	project: string;
}