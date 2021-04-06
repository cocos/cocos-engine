/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

exports.template = `
<div class="batched-skinning-component">
    <ui-prop>
        <ui-label slot="label" value="Operation"></ui-label>
        <ui-button id="button" class="green" slot="content">Cook</ui-button>
    </ui-prop>
    <div id="customProps"></div>
</div>
`;

exports.methods = {
    _onApplyClick () {
        Editor.Message.send('scene', 'execute-component-method', {
            uuid: this.dump.value.uuid.value,
            name: 'cook',
            args: [],
        });

        this.dump.values && this.dump.values.forEach((dump) => {
            Editor.Message.send('scene', 'execute-component-method', {
                uuid: dump.value.uuid.value,
                name: 'combine',
                args: [],
            });
        });
    },
};

const uiElements = {
    button: {
        ready () {
            this.$.button.addEventListener('confirm', (event) => {
                this._onApplyClick();
            });
        },
    },
    customProps: {
        update () {
            this.$.customProps.replaceChildren(...propUtils.getCustomPropElements([], this.dump, (element, prop) => {
                element.className = 'customProp';
                const isShow = prop.dump.visible;
                if (isShow) {
                    element.render(prop.dump);
                }
                element.style = isShow ? '' : 'display:none;';
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
exports.$ = {
    customProps: '#customProps',
    button: '#button',
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
