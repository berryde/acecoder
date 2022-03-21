import ace from 'brace';
import css from './ace.css';

ace['define'](
	'ace/theme/folio',
	['require', 'exports', 'module', 'ace/lib/dom'],
	(_acequire, exports) => {
		exports.isDark = true;
		exports.cssClass = 'ace-one-dark';
		exports.cssText = css;
		const dom = ace.acequire('ace/lib/dom');
		dom.importCssString(exports.cssText, exports.cssClass);
	}
);
