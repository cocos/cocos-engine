/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = ['fillCenter', 'fillRange', 'fillStart', 'fillType', 'type'];
exports.template = `
<div class="sprite-component">
    <ui-prop type="dump" key="type"></ui-prop>

    <ui-prop type="dump" showflag="type3" key="fillType"></ui-prop>
    <ui-prop type="dump" readonlyflag="fillTypeNot2" showflag="type3" key="fillCenter"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="fillStart"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="fillRange"></ui-prop>
    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;
// dump.value.type.value == 3 && (!dumps || dumps.every(item => item.value.type.value == 3))

exports.$ = {
    customProps: '#customProps',
    fillType: 'ui-prop[key="fillType"]',
    fillCenter: 'ui-prop[key="fillCenter"]',
};
const uiElements = {
    fillType: {
        ready () {
            this.$.fillType.addEventListener('change-dump', () => {
                this.$.fillCenter.setAttribute('readonly', this.dump.value.fillType.value != 2);
            });
        },
    },
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
                let isShow = this.dump.value[key].visible;
                if (isShow) {
                    element.render(this.dump.value[key]);
                }
                if (element.hasAttribute('showflag')) {
                    const showflag = element.getAttribute('showflag');
                    if (showflag === 'type3') {
                        isShow = isShow && this.dump.value.type.value == 3 && (!this.dump.values || this.dump.values.length === 1 || this.dump.values.every((item) => item.value.type.value == 3));
                    }
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
