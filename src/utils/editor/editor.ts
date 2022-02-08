import parserBabel from 'prettier/parser-babel.js';
import parserTypescript from 'prettier/parser-typescript.js';
import parserHtml from 'prettier/parser-html.js';
import parserCss from 'prettier/parser-postcss.js';
import type { Parser } from 'prettier';
import prettier from 'prettier';
import { get, writable } from 'svelte/store';
import { updateFile } from '../filesystem/filesystem';
import { selectedTab } from 'src/utils/tabs/tabs';
import { saveTab } from '../tabs/tabs';
import { write } from '../exercise/exercise';

/**
 * Supported file extensions.
 */
export const supportedExtensions = ['jsx', 'css', 'js', 'ts', 'html', 'tsx', 'json', 'svelte'];

export const contents = writable<string>('');

export const format = (value: string, language: string): string => {
	if (isSupported(language)) {
		try {
			if (language == 'json') {
				return JSON.stringify(JSON.parse(value), null, 2);
			} else {
				return prettier.format(value, getParser(language));
			}
		} catch (err) {
			console.error('Auto-formatting failed due to a syntax error.');
		}
	}
	return value;
};

export const getParser = (
	language: string
): { parser: string; plugins: [{ parsers: { [key: string]: Parser<string> } }] } => {
	switch (language) {
		case 'html':
			return {
				parser: 'html',
				plugins: [parserHtml]
			};
		case 'css':
			return {
				parser: 'css',
				plugins: [parserCss]
			};
		case 'tsx':
			return {
				parser: 'babel-ts',
				plugins: [parserBabel]
			};
		case 'ts':
			return {
				parser: 'typescript',
				plugins: [parserTypescript]
			};
		default:
			return {
				parser: 'babel',
				plugins: [parserBabel]
			};
	}
};

/**
 * Check if a given language is supported.
 *
 * @param language The file extension of the language to check.
 * @returns Whether the language is supported.
 */
export const isSupported = (language: string): boolean => {
	return supportedExtensions.includes(language);
};

export const save = async (projectID: string): Promise<void> => {
	const tab: string = get(selectedTab);
	saveTab(tab);
	updateFile(tab, get(contents));
	await write(projectID);
};
