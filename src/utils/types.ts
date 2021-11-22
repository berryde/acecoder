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

export type ReloadMessage = {
	compiled: WorkerResponse;
	type: 'reload';
};

export type UrlMessage = {
	type: 'url';
};

export type TestMessage = {
	compiled: WorkerResponse;
	type: 'test';
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

export type PreviewMessage = {
	type: 'system' | 'warn' | 'log' | 'error';
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
	 * The charater position of the error.
	 */
	pos: number;
	/**
	 * The file where the error occured.
	 */
	location: string;
};

export type AuthError = {
	errorCode: string;
	errorMessage: string;
};

export type SidebarTab = {
	name: string;
	icon: any;
	component: any;
};
