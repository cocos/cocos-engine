'use strict';
const pkg = require('../../../package.json');

/** 地址跳转资源类别标签 */
const DOC_LABEL = 'creator-element';

/** 短地址链接固定地址 */
const DOC_DOMAIN = 'https://api.cocos.com/resolve-url/v1/creator-docs';

/** 提取组件名称 */
const EDITOR_HELP_REG = /^.*?cc\.(\w+)\s*$/ig;

exports.getDocResolveUrl = function(editor) {
    if (!editor || !editor.help) {
        return '';
    }

    const help = editor.help;

    if (!help.startsWith('i18n:')) {
        return help;
    }

    // 获取组件名称
    const element = help.replace(EDITOR_HELP_REG, '$1');

    const docParams = {
        editor: pkg.version,  // 编辑器版本

        lang: Editor.I18n.getLanguage(),  // 语言

        label: DOC_LABEL,  // 类别标签

        name: element, // 组件名称
    };

    const originLink = `${DOC_DOMAIN}?${new URLSearchParams(docParams).toString()}`;

    return decodeURIComponent(originLink);
};
