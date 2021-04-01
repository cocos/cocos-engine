/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = [
    'handle', 'direction', 'progress', 'slideEvents',
];
exports.template = `
<div class="silder-component">
    <ui-prop type="dump" key="handle"></ui-prop>
    <ui-prop type="dump" key="direction"></ui-prop>
    <ui-prop type="dump" key="progress"></ui-prop>
    <ui-prop type="dump" key="slideEvents"></ui-prop>
    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;

exports.$ = {
    customProps: '#customProps',
};

const uiElements = {
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((prop) => {
                prop.addEventListener('change-dump', () => {
                    uiElements.baseProps.update.call(this);
                });
            });
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
            this.$.customProps.replaceChildren(...propUtils.getCustomPropElements(excludeList, this.dump, (element, prop) => {
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
