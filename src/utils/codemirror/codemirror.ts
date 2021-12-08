import { javascript, jsxLanguage, tsxLanguage } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { LanguageSupport } from '@codemirror/language';
import { history, historyKeymap } from '@codemirror/history';
import { foldGutter, foldKeymap } from '@codemirror/fold';
import { indentOnInput } from '@codemirror/language';
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { commentKeymap } from '@codemirror/comment';
import parserBabel from 'prettier/parser-babel.js';
import parserHtml from 'prettier/parser-html.js';
import parserCss from 'prettier/parser-postcss.js';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { lintKeymap } from '@codemirror/lint';
import {
	keymap,
	highlightSpecialChars,
	drawSelection,
	highlightActiveLine,
	EditorView
} from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import type { Parser } from 'prettier';
import prettier from 'prettier';
import { get, writable } from 'svelte/store';
import { formatOnSave } from '../settings/settings';
import { getExtension, updateFile } from '../filesystem/filesystem';
import { selectedTab } from 'src/utils/tabs/tabs';
import { saveTab } from '../tabs/tabs';

/**
 * Supported file extensions.
 */
export const supportedExtensions = ['jsx', 'css', 'js', 'ts', 'html', 'tsx', 'json'];

export const contents = writable<string>('');

/**
 * Get the codemirror language support for the current language.
 */
export const getLanguageSupport = (language: string): LanguageSupport => {
	switch (language) {
		case 'css':
			return css();
		case 'html':
			return html();
		case 'tsx':
			return new LanguageSupport(tsxLanguage, tsxLanguage.data.of({}));
		case 'jsx':
			return new LanguageSupport(jsxLanguage, jsxLanguage.data.of({}));
		case 'ts':
			return javascript({
				typescript: true
			});
		case 'js':
			return javascript();
		case 'json':
			return json();
		default:
			return javascript();
	}
};

export const format = (value: string, language: string): string => {
	if (isSupported(language)) {
		if (language == 'json') {
			return JSON.stringify(JSON.parse(value), null, 2);
		} else {
			return prettier.format(value, getParser(language));
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
		case 'jsx':
		case 'ts':
		case 'js':
		case 'json':
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
	const result = supportedExtensions.includes(language);
	return result;
};

/**
 * The list of default extensions to use for the codemirror editor configuration.
 */
export const defaultExtensions = [
	lineNumbers(),
	highlightActiveLineGutter(),
	highlightSpecialChars(),
	history(),
	foldGutter(),
	drawSelection(),
	EditorState.allowMultipleSelections.of(true),
	EditorView.lineWrapping,
	indentOnInput(),
	defaultHighlightStyle.fallback,
	bracketMatching(),
	closeBrackets(),
	autocompletion(),
	highlightActiveLine(),
	highlightSelectionMatches(),
	indentOnInput(),
	keymap.of([
		...closeBracketsKeymap,
		...defaultKeymap,
		...searchKeymap,
		...historyKeymap,
		...foldKeymap,
		...commentKeymap,
		...completionKeymap,
		...lintKeymap,
		indentWithTab
	])
];

export const save = (): void => {
	let doc = get(contents);
	const tab: string = get(selectedTab);
	if (get(formatOnSave)) {
		doc = format(doc, getExtension(tab));
	}
	saveTab(tab);
	updateFile(tab, doc);
};
