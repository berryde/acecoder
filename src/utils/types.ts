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
 * Data to send to the submission server in order to generate a result.
 */
export type ServerRequest = {
	projectID: string;
	exerciseID: string;
	userID: string;
};

/**
 * Response from the submission server.
 */
export type ServerResponse = Record<
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

export type ServerError = {
	status: 403 | 404 | 500;
	message: string;
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
	previous?: number;
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
	 * The spec name of the test that evaluates this chapter.
	 */
	spec?: string;
};

export type ProjectSettings = {
	progress: number;
	language: string;
};
