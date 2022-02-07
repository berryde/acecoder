import ace from 'brace';
import css from './ace.css';

ace['define'](
	'ace/theme/folio',
	['require', 'exports', 'module', 'ace/lib/dom'],
	(acequire: unknown, exports: { isDark: boolean; cssClass: string; cssText: string }) => {
		exports.isDark = true;
		exports.cssClass = 'ace-one-dark';
		exports.cssText = css;
		const dom = ace.acequire('ace/lib/dom');
		dom.importCssString(exports.cssText, exports.cssClass);
	}
);
