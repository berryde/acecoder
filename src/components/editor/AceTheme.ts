import ace from 'brace';
import { theme } from "src/utils/theme"

ace['define'](
    'ace/theme/folio',
    ['require', 'exports', 'module', 'ace/lib/dom'],
    (acequire: unknown, exports: { isDark: boolean, cssClass: string, cssText: string }) => {
        exports.isDark = true;
        exports.cssClass = 'ace-folio';
        exports.cssText = `
        
        ace-folio .ace_gutter {
        background: ${theme.background};
        color: rgb(144,145,148)
        }
        .ace-folio .ace_print-margin {
        width: 1px;
        background: #e8e8e8
        }
        .ace-folio {
        background-color: ${theme.editor.background};
        color: ${theme.text};
        }
        .ace-folio .ace_cursor {
        color: ${theme.text}
        }
        .ace-folio .ace_marker-layer .ace_selection {
        background: ${theme.editor.highlight}
        }
        .ace-folio.ace_multiselect .ace_selection.ace_start {
        box-shadow: 0 0 3px 0px #282a36;
        border-radius: 2px
        }
        .ace-folio .ace_marker-layer .ace_step {
        background: rgb(198, 219, 174)
        }
        .ace-folio .ace_marker-layer .ace_bracket {
        margin: -1px 0 0 -1px;
        border: 1px solid #3B3A32
        }
        .ace-folio .ace_marker-layer .ace_selected-word {
        border: 1px solid ${theme.editor.highlight}
        }
        .ace-folio .ace_fold {
        background-color: #50fa7b;
        border-color: #f8f8f2
        }
        .ace-folio .ace_keyword {
        color: #ff79c6
        }
        .ace-folio .ace_constant.ace_language {
        color: #bd93f9
        }
        .ace-folio .ace_constant.ace_numeric {
        color: #bd93f9
        }
        .ace-folio .ace_constant.ace_character {
        color: #bd93f9
        }
        .ace-folio .ace_constant.ace_character.ace_escape {
        color: #ff79c6
        }
        .ace-folio .ace_constant.ace_other {
        color: #bd93f9
        }
        .ace-folio .ace_support.ace_function {
        color: #8be9fd
        }
        .ace-folio .ace_support.ace_constant {
        color: #6be5fd
        }
        .ace-folio .ace_support.ace_class {
        
        color: #66d9ef
        }
        .ace-folio .ace_support.ace_type {
        color: #66d9ef
        }
        .ace-folio .ace_storage {
        color: #ff79c6
        }
        .ace-folio .ace_storage.ace_type {
        color: #8be9fd
        }
        .ace-folio .ace_invalid {
        color: #F8F8F0;
        background-color: #ff79c6
        }
        .ace-folio .ace_invalid.ace_deprecated {
        color: #F8F8F0;
        background-color: #bd93f9
        }
        .ace-folio .ace_string {
        color: #f1fa8c
        }
        .ace-folio .ace_comment {
        color: #6272a4
        }
        .ace-folio .ace_variable {
        color: #50fa7b
        }
        .ace-folio .ace_variable.ace_parameter {
        color: #ffb86c
        }
        .ace-folio .ace_entity.ace_other.ace_attribute-name {
        color: #50fa7b
        }
        .ace-folio .ace_entity.ace_name.ace_function {
        color: #50fa7b
        }
        .ace-folio .ace_entity.ace_name.ace_tag {
        color: #ff79c6
        }
`;

        const dom = ace.acequire('ace/lib/dom');
        dom.importCssString(exports.cssText, exports.cssClass);
    }
);