import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import type { LanguageSupport } from '@codemirror/language';
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
import { rectangularSelection } from '@codemirror/rectangular-selection';
import { defaultHighlightStyle } from '@codemirror/highlight';
import { Compartment } from '@codemirror/state';
import { lintKeymap } from '@codemirror/lint';
import {
	keymap,
	highlightSpecialChars,
	drawSelection,
	highlightActiveLine
} from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';

/**
 * Supported file extensions.
 */
export const supportedExtensions = ['jsx', 'css', 'js', 'ts', 'html', 'tsx', 'json'];

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
		case 'jsx':
		case 'ts':
		case 'js':
			return javascript();
		case 'json':
			return json();
		default:
			return javascript();
	}
};

/**
 * The list of default extensions to use for the codemirror editor configuration.
 */
export const defaultExtensions = [
	oneDark,
	new Compartment().of(EditorState.tabSize.of(2)),
	lineNumbers(),
	highlightActiveLineGutter(),
	highlightSpecialChars(),
	history(),
	foldGutter(),
	drawSelection(),
	EditorState.allowMultipleSelections.of(true),
	indentOnInput(),
	defaultHighlightStyle.fallback,
	bracketMatching(),
	closeBrackets(),
	autocompletion(),
	rectangularSelection(),
	highlightActiveLine(),
	highlightSelectionMatches(),
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
