/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = [
    'target', 'interactable', 'transition',
    'normalColor', 'pressedColor', 'hoverColor', 'disabledColor',
    'normalSprite', 'pressedSprite', 'hoverSprite', 'disabledSprite',
    'zoomScale', 'duration', 'isChecked', 'checkMark', 'toggleGroup', 'checkEvents',
];

exports.template = `
<div class="toggle-component">
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

    <ui-prop type="dump" showflag="3" key="zoomScale"></ui-prop>
    <ui-prop type="dump" showflag="3" key="duration"></ui-prop>

    <ui-prop type="dump" key="isChecked"></ui-prop>
    <ui-prop type="dump" key="checkMark"></ui-prop>
    <ui-prop type="dump" key="toggleGroup"></ui-prop>
    <ui-prop type="dump" key="checkEvents"></ui-prop>

    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;
exports.$ = {
    customProp: '#customProps',
};
const uiElements = {
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                const key = element.key;
                if (key === 'transition') {
                    element.addEventListener('change-dump', (event) => {
                        uiElements.baseProps.update.call(this);
                    });
                }
            });
        },
        update () {
            this.$.baseProps = this.$.baseProps || this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                const dump = this.dump.value[element.getAttribute('key')];
                let isVisible = dump && dump.visible;
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
            this.$.customProp.replaceChildren(...propUtils.getCustomPropElements(excludeList, this.dump, (element, prop) => {
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

exports.update = function (dump) {
    for (const key in dump.value) {
        const info = dump.value[key];
        if (!info.visible) {
            continue;
        }
        info.displayName = info.displayName || key;
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
exports.ready = function () {
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.ready === 'function') {
            element.ready.call(this);
        }
    }
};
