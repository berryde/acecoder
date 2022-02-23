import type { Timestamp } from 'firebase/firestore';

/**
 * A project file.
 */
export interface File {
	/**
	 * The text content of the file.
	 */
	value: string;
	/**
	 * Whether this file can be deleted and renamed.
	 */
	modifiable: boolean;
}

/**
 * The message sent from a worker to the requester with the transpiled sources.
 */
export type WorkerResponse = {
	/**
	 * The bundled javascript source.
	 */
	js: string;
	/**
	 * The bundled css source.
	 */
	css: string;
	/**
	 * Any static files.
	 */
	public?: { [key: string]: string };
	/**
	 * The error message, if present
	 */
	error?: WorkerError;
};

/**
 * The message sent to an iframe prompting a re-render.
 */
export type ReloadMessage = {
	compiled: WorkerResponse;
	type: 'reload';
};

/**
 * The message sent to an iframe telling it to intercept clicks to handle navigation.
 */
export type UrlMessage = {
	type: 'url';
};

/**
 * A single file.
 */
export interface FSFile extends File {
	/**
	 * The type of filesystem object.
	 */
	type: 'file';
}

/**
 * A single recursively defined folder.
 */
export type FSFolder = {
	/**
	 * The type of filesystem object.
	 */
	type: 'folder';
	/**
	 * The folder's children.
	 */
	children: Filesystem;
	/**
	 * Whether this file can be deleted and renamed.
	 */
	modifiable: boolean;
};

/**
 * An in memory filesystem of folders and files.
 */
export type Filesystem = {
	/**
	 * A single filesystem object, either a file or a folder.
	 */
	[key: string]: FSFile | FSFolder;
};

/**
 * A message passed between the preview iframe and the preview pane.
 */
export type PreviewMessage = {
	/**
	 * The level of message. System messages are used for application communication, such as for popups. Everything else goes to the console.
	 */
	type: 'system' | 'warn' | 'log' | 'error';
	/**
	 * The message content.
	 */
	data: string;
};

export type WorkerError = {
	/**
	 * The error name.
	 */
	name: string;
	/**
	 * The error message.
	 */
	message: string;
	/**
	 * The character position of the error.
	 */
	pos: number;
	/**
	 * The file where the error occurred.
	 */
	location: string;
};

/**
 * An error to display when authentication fails.
 */
export type AuthError = {
	/**
	 * The title of the error.
	 */
	errorCode: string;
	/**
	 * A detailed description of the error.
	 */
	errorMessage: string;
};

/**
 * Data to send to the submission server in order to generate a result.
 */
export type ServerRequest = {
	/**
	 * The ID of the project that the exercise belongs to
	 */
	projectID: string;
	/**
	 * The ID of the exercise being submitted
	 */
	exerciseID: string;
	/**
	 * The ID of the user creating this submission
	 */
	userID: string;
	chapter: number;
};

export type Certificate = {
	issued: Timestamp;
	project: string;
	uid: string;
};
/**
 * Response from the submission server.
 */
export type ExerciseResults = Record<
	number,
	{
		/**
		 * Whether this test passed.
		 */
		passed: boolean;
		/**
		 * The name of this test.
		 */
		spec: string;
	}
>;

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

/**
 * Generic information about an exercise, without the exercise files
 */
export type ExerciseMetadata = {
	/**
	 * The name of this exercise
	 */
	name: string;
	/**
	 * A brief introduction to the exercise
	 */
	description: string;
	/**
	 * Whether a submission to this exercise will be tested
	 */
	assessed: boolean;
	/**
	 * The sub-components of this exercise
	 */
	chapters: ExerciseChapter[];
	/**
	 * Whether this exercise loads the pooled submission for the project
	 */
	inherits: boolean;
	/**
	 * Whether the user can save their work for this exercise
	 */
	writable: boolean;
};

/**
 * Exercise metadata and files, for when the exercise actually needs to be loaded
 */
export interface Exercise extends ExerciseMetadata {
	/**
	 * A map of language name to file set for a given exercise
	 */
	files: Record<string, Record<string, FSFile>>;
}

/**
 * A single sub-component of an exercise. {spec} and {hint} should only be provided if the exercise is assessed.
 */
export type ExerciseChapter = {
	/**
	 * The text content to be displayed for this chapter.
	 */
	text: string;
	/**
	 * The spec name of the test that evaluates this chapter.
	 */
	spec?: string;
	/**
	 * A hint to show if the test fails.
	 */
	hint?: string;
};

/**
 * User stats for a single project
 */
export type ProjectSettings = {
	/**
	 * The exercise of the project that the user is currently on
	 */
	progress: number;
	/**
	 * The language the user is completing the project with
	 */
	language: string;
	/**
	 * Whether the user has completed all exercises in the project
	 */
	completed: boolean;
};

/**
 * A single achievement, which can be awarded for meeting various project milestones
 */
export type Badge = {
	/**
	 * Why this achievement was awarded. This usually starts with 'Awarded for...'
	 */
	description: string;
	/**
	 * The name of this achievement
	 */
	name: string;
	/**
	 * The actual achievement icon to show
	 */
	image: string;
	/**
	 * Conditions that must be met to unlock this achievement
	 */
	conditions: Record<string, number>;
};

/**
 * Data on a user's profile that shows when they unlocked a badge, and for which project it was awarded
 */
export type UserBadge = {
	/**
	 * The timestamp at which the badge was awarded
	 */
	timestamp: Timestamp;
	/**
	 * The id of the project for which this badge was awarded
	 */
	projectID: string;
};

export type UserCertificate = {
	/**
	 * The timestamp at which the badge was awarded
	 */
	timestamp: Timestamp;
	/**
	 * The id of the project for which this badge was awarded
	 */
	projectID: string;
	/**
	 *
	 */
	projectName: string;
};

export type ToastMessage = {
	message: string;
	variant: 'success' | 'warning' | 'danger' | 'info';
};

/**
 * Project completion statistics for a user
 */
export type UserStats = {
	/**
	 * The number of projects that they have completed
	 */
	completed: number;
	/**
	 * The number of projects that they have completed with react
	 */
	react: number;
	/**
	 * The number of projects that they have completed with svelte
	 */
	svelte: number;
};
