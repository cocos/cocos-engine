/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
const propUtils = require('../utils/prop');

const EXCLUDE_PROPLIST = [
    'target', 'interactable', 'transition', 'disabledColor',
    'normalColor', 'pressedColor', 'hoverColor', 'disabledSprite',
    'normalSprite', 'pressedSprite', 'hoverSprite', 'disabledSprite',
    'zoomScale', 'duration', 'clickEvents',
];
const ELEMENTS = {
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                if (key === 'transition') {
                    element.addEventListener('change-dump', (event) => {
                        ELEMENTS.baseProps.update.call(this);
                    });
                }
            });
        },
        update () {
            this.$.baseProps = this.$.baseProps || this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                const dump = this.dump.value[key];
                let isVisible = dump.visible;
                if (element.hasAttribute('showflag')) {
                    const showflag = element.getAttribute('showflag');
                    isVisible = isVisible && this.dump.value.transition.value == showflag && (!this.dump.values || this.dump.values.length === 1 || this.dump.values.every((item) => item.value.transition.value == showflag));
                }
                element.style = isVisible ? '' : 'display:none;';
                if (isVisible) {
                    element.render(dump);
                }
            });
        },
    },
    customProp: {
        update () {
            this.$.customProp.replaceChildren(...propUtils.getCustomPropElements(EXCLUDE_PROPLIST, this.dump, (element, prop) => {
                element.className = 'customProp';
                const isShow = prop.dump.visible;
                if (isShow) {
                    element.render(prop.dump);
                }
                element.style = isShow ? '' : 'display: none';
            }));
        },
    },
};
exports.$ = {
    customProp: '#customProp',
};

exports.template = `
<div class="button-component">
    <ui-prop type="dump" key="target"></ui-prop>
    <ui-prop type="dump" key="interactable"></ui-prop>
    <ui-prop type="dump" key="transition"></ui-prop>
    <ui-prop type="dump" key="normalColor" showflag="1"></ui-prop>
    <ui-prop type="dump" key="pressedColor" showflag="1"></ui-prop>
    <ui-prop type="dump" key="hoverColor" showflag="1"></ui-prop>
    <ui-prop type="dump" key="disabledColor" showflag="1"></ui-prop>
    <ui-prop type="dump" key="normalSprite" showflag="2"></ui-prop>
    <ui-prop type="dump" key="pressedSprite" showflag="2"></ui-prop>
    <ui-prop type="dump" key="hoverSprite" showflag="2"></ui-prop>
    <ui-prop type="dump" key="disabledSprite" showflag="2"></ui-prop>
    <ui-prop type="dump" key="zoomScale" showflag="3"></ui-prop>
    <ui-prop type="dump" key="duration" showflag="3"></ui-prop>
    <ui-prop type="dump" key="clickEvents"></ui-prop>

    <!-- Render other data that is not taken over -->
    <div id="customProp"></div>
</div>
`;

exports.update = function (dump) {
    for (const key in dump.value) {
        const info = dump.value[key];
        if (!info.visible) {
            continue;
        }
        if (dump.values) {
            info.values = dump.values.map((value) => value[key].value);
        }
    }
    this.dump = dump;
    for (const key in ELEMENTS) {
        const element = ELEMENTS[key];
        if (typeof element.update === 'function') {
            element.update.call(this);
        }
    }
};
exports.ready = function () {
    for (const key in ELEMENTS) {
        const element = ELEMENTS[key];
        if (typeof element.ready === 'function') {
            element.ready.call(this);
        }
    }
};
