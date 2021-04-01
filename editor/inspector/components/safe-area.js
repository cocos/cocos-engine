/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

exports.template = `
<div class="safe-area">
    <style>
        #safeAreaTips {
            display: block;
            background-color: #333;
            border: 1px solid #666;
            border-radius: 3px;
            margin: 10px;
            padding: 10px;
        }
    </style>
    <ui-label id="safeAreaTips" value="i18n:engine.components.safe_area.brief_help"></ui-label>

    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;

const uiElements = {
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
        },
        update () {
            if (!this.$.baseProps) {
                uiElements.baseProps.ready.call(this);
            }
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                const isShow = this.dump.value[key].visible;
                if (isShow) {
                    element.render(this.dump.value[key]);
                }
                element.style = isShow ? '' : 'display: none;';
            });
        },
    },
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
