import ace from 'brace';
import { theme } from 'src/utils/theme';

ace['define'](
	'ace/theme/folio',
	['require', 'exports', 'module', 'ace/lib/dom'],
	(acequire: unknown, exports: { isDark: boolean; cssClass: string; cssText: string }) => {
		exports.isDark = true;
		exports.cssClass = 'ace-one-dark';
		exports.cssText = `.ace-one-dark .ace_gutter {
            background: ${theme.editor.background};
            color: #474C55;
            padding-right: 10px;
          }
          
          .ace-one-dark .ace_print-margin {
            width: 1px;
            background: #555651
          }
          
          .ace-one-dark {
            background-color: ${theme.editor.background};
            color: #bec5d1
          }
          
          .ace-one-dark .ace_cursor {
            color: #528BFF
          }
          
          .ace-one-dark .ace_marker-layer .ace_selection {
            background: ${theme.editor.highlight}
          }
          
          .ace-one-dark.ace_multiselect .ace_selection.ace_start {
            box-shadow: 0 0 3px 0px #282C34;
          }
          
          .ace-one-dark .ace_marker-layer .ace_step {
            background: rgb(102, 82, 0)
          }
          
          .ace-one-dark .ace_marker-layer .ace_bracket {
            margin: -1px 0 0 -1px;
            border: 1px solid #bec5d1
          }
          
          .ace-one-dark .ace_marker-layer .ace_active-line {
            background: #182238
          }
          
          .ace-one-dark .ace_gutter-active-line {
            background-color: #182238
          }
          
          .ace-one-dark .ace_marker-layer .ace_selected-word {
            border: 1px solid #49483E
          }
          
          .ace-one-dark .ace_invisible {
            color: #3B4048
          }

          .ace-one-dark .ace_entity.ace_name.ace_tag,
          .ace-one-dark .ace_meta.ace_tag,
          .ace-one-dark .ace_constant,
          .ace-one-dark .ace_storage {
            color: #E06C75
          }
          
          .ace-one-dark .ace_keyword{
            color: #C678DD
          }
          
          .ace-one-dark .ace_punctuation,
          .ace-one-dark .ace_punctuation.ace_tag {
            color: #bec5d1
          }
          
          .ace-one-dark .ace_constant.ace_support.ace_fonts,
          .ace-one-dark .ace_constant.ace_character,
          .ace-one-dark .ace_constant.ace_support,
          .ace-one-dark .ace_constant.ace_language,
          .ace-one-dark .ace_constant.ace_numeric,
          .ace-one-dark .ace_constant.ace_other {
            color: #D19A66
          }
          
          .ace-one-dark .ace_invalid {
            color: #F8F8F0;
            background-color: #F92672
          }
          
          .ace-one-dark .ace_invalid.ace_deprecated {
            color: #F8F8F0;
            background-color: #AE81FF
          }
          
          .ace-one-dark .ace_support.ace_type{
              color: #bec5d1
          }
          
          .ace-one-dark .ace_constant.ace_language.ace_escape,
          .ace-one-dark .ace_keyword.ace_operator,
          .ace-one-dark .ace_support.ace_function {
            color: #C678DD
          }
          
          .ace-one-dark .ace_fold {
            background-color: #A6E22E;
            border-color: #bec5d1
          }
          
          .ace-one-dark .ace_storage.ace_type{
              color: #E5C07B;
          }
          
          
          .ace-one-dark .ace_support.ace_class {
            font-style: italic;
            color: #66D9EF
          }
          
          .ace-one-dark .ace_entity.ace_other,
          .ace-one-dark .ace_entity.ace_other.ace_attribute-name,
          .ace-one-dark .ace_variable {
            color: #D19A66
          }
          
          .ace-one-dark .ace_list.ace_markup,
          .ace-one-dark .ace_constant.ace_language.ace_escape .ace_string,
          .ace-one-dark .ace_string.ace_attribute-value {
              color: #98C379
          }

          .ace-one-dark .ace_string {
            color: #bec5d1;
          }
          
          .ace-one-dark .ace_entity.ace_name.ace_function {
            color: #61AFEF
          }

          .ace-one-dark .ace_search {
            background-color: ${theme.accent}
          }
          
          .ace-one-dark .ace_operator {
              color: #bec5d1;
          }
          
          /*.ace-one-dark .ace_string, */
          .ace-one-dark .ace_identifier,
          .ace-one-dark .ace_variable.ace_parameter{
            color: #bec5d1
          }
          
          .ace-one-dark .ace_comment {
            color: #5C6370;
            font-style: italic;
          }
          
          .ace-one-dark .ace_indent-guide {
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y
          }
`;

		const dom = ace.acequire('ace/lib/dom');
		dom.importCssString(exports.cssText, exports.cssClass);
	}
);
