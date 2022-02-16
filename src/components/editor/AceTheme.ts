import ace from 'brace';
import css from './ace.css';

const brace = ace as unknown as {
	define: (
		name: string,
		keywords: string[],
		callback: (
			_: unknown,
			exports: { isDark: boolean; cssClass: string; cssText: string }
		) => unknown
	) => void;
};
brace['define'](
	'ace/theme/folio',
	['require', 'exports', 'module', 'ace/lib/dom'],
	(_, exports) => {
		exports.isDark = true;
		exports.cssClass = 'ace-one-dark';
		exports.cssText = css;
		const dom = ace.acequire('ace/lib/dom');
		dom.importCssString(exports.cssText, exports.cssClass);
	}
);
