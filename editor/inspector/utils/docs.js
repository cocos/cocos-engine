'use strict';
const pkg = require('../../../package.json');

/** Document Resource Category Label */
const DOC_LABEL = 'creator-element';

/** Fixed address for document resources */
const DOC_DOMAIN = 'https://api.cocos.com/resolve-url/v1/creator-docs';

/** Element Name Matching Regularity */
const EDITOR_HELP_REG = /^.*?cc\.(\w+)\s*$/ig;

exports.getDocResolveUrl = function(editor) {
    if (!editor || !editor.help) {
        return '';
    }

    const help = editor.help;

    if (!help.startsWith('i18n:')) {
        return help;
    }

    // Extract element names
    const element = help.replace(EDITOR_HELP_REG, '$1');

    const docParams = {
        editor: pkg.version,  // Editor version

        lang: Editor.I18n.getLanguage(),  // Language

        label: DOC_LABEL,  // Category Label

        name: element, // Element Name
    };

    const originLink = `${DOC_DOMAIN}?${new URLSearchParams(docParams).toString()}`;

    return decodeURIComponent(originLink);
};
