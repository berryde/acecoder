import type { Timestamp } from 'firebase/firestore';
import type { SvelteComponentDev } from 'svelte/internal';

/**
 * A project file.
 */
export interface File {
	/**
	 * The file source.
	 */
	code: string;
	/**
	 * The name of the file.
	 */
	name: string;
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
	public: { [key: string]: string };
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
export type FSFile = {
	/**
	 * The type of filesystem object.
	 */
	type: 'file';
	/**
	 * The text content of the file.
	 */
	value: string;
	/**
	 * Whether this file can be deleted and renamed.
	 */
	modifiable: boolean;
};

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
 * A single sidebar tab.
 */
export type SidebarTab = {
	/**
	 * The name of this tab.
	 */
	name: string;
	/**
	 * The sidebar icon to show for this tab.
	 */
	icon: typeof SvelteComponentDev;
	/**
	 * The component to render when the tab is opened.
	 */
	component: typeof SvelteComponentDev;
};

/**
 * A feedback submission for evaluation.
 */
export type Feedback = {
	/**
	 * When this feedback was posted.
	 */
	posted: string;
	/**
	 * The feedback comment.
	 */
	comment: string;
	/**
	 * The component this feedback is about.
	 */
	component: string;
};

/**
 * Response from the submission server.
 */
export type TestResult = {
	/**
	 * The number of tests that passed.
	 */
	passed: number;
	/**
	 * The total number of tests.
	 */
	total: number;
	/**
	 * The test results
	 */
	results: {
		/**
		 * The error message, if any, for this test.
		 */
		message: string;
		/**
		 * Whether this test passed.
		 */
		passed: boolean;
		/**
		 * The name of this test.
		 */
		name: string;
	}[];
	/**
	 * The timestamp of the result.
	 */
	timestamp: Timestamp;
};


export type ExerciseFile = {
	contents: string;
	editable: boolean;
};

export type Project = {
	name: string;
	icon: string;
	description: string;
	exerciseCount: number;
	languages: string[];
};

export type ExerciseMetadata = {
	name: string;
	description: string;
	assessed: boolean;
	chapters: ExerciseChapter[];
};

export interface Exercise extends ExerciseMetadata {
	files: Record<string, Record<string, ExerciseFile>>;
}

export type ExerciseChapter = {
	/**
	 * The text content to be displayed for this chapter.
	 */
	text: string;
	/**
	 * The name of the file containing the test that evaluates this chapter.
	 */
	file?: string;
	/**
	 * The spec name of the test that evaluates this chapter.
	 */
	spec?: string;
};

export type ProjectSettings = {
	progress: number
	language: string
}