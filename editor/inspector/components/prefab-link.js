/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

export const template = `
<div class="prefab-link">
    <style>
        #prefabTips {
            display: 'block';
            background-color: '#333';
            border: '1px solid #666';
            border-radius: '3px';
            margin: '10px';
            padding: '10px';
        }
    </style>
    <ui-label id="prefabTips" value="i18n:ENGINE.components.prefab_link.brief_help"></ui-label>

    <!-- 渲染其他没有接管的数据 -->
    <div id="customProps"></div>
</div>

`;

exports.$ = {
    customProps: '#customProps',
};
const uiElements = {
    customProps: {
        update () {
            this.$.customProps.replaceChildren(...propUtils.getCustomPropElements([], this.dump, (element, prop) => {
                element.className = 'customProp';
                if (prop.dump.visible) {
                    element.render(prop.dump);
                }
                element.style = prop.dump.visible ? '' : 'display: none;';
            }));
        },
    },
};

exports.ready = function () {
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.ready === 'function') {
            element.ready.call(this);
        }
    }
};
exports.update = function (dump) {
    for (const key in dump.value) {
        const info = dump.value[key];
        if (dump.values) {
            info.values = dump.values.map((value) => value[key].value);
        }
    }
    this.dump = dump;
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.update === 'function') {
            element.update.call(this);
        }
    }
};
