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
	 * The index.html file.
	 */
	html: string;
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
