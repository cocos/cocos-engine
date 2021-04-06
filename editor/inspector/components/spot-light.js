/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = [
    'color', 'useColorTemperature', 'colorTemperature', 'size', 'range',
    'spotAngle', 'term', 'luminance', 'luminousPower', 'staticSettings',
];

exports.template = `
<div class="spot-light-component">
    <ui-prop type="dump" key="color"></ui-prop>

    <ui-prop type="dump" key="useColorTemperature"></ui-prop>

    <ui-prop type="dump" key="colorTemperature"></ui-prop>

    <ui-prop type="dump" key="size"></ui-prop>

    <ui-prop type="dump" key="range"></ui-prop>

    <ui-prop type="dump" key="spotAngle"></ui-prop>

    <ui-prop type="dump" key="term"></ui-prop>

    <ui-prop type="dump" showflag="term" key="luminance"></ui-prop>

    <ui-prop type="dump" showflag="notTerm" key="luminousPower"></ui-prop>

    <ui-prop type="dump" key="staticSettings"></ui-prop>

    <!-- 渲染其他没有接管的数据 -->
    <div id="customProps"></div>
</div>
`;

exports.$ = {
    customProps: '#customProps',
    term: 'ui-prop[key="term"]',
};
const uiElements = {
    term: {
        ready () {
            this.$.term.addEventListener('change-dump', () => {
                uiElements.baseProps.update.call(this);
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
                    if (showflag === 'term') {
                        isShow = isShow && this.dump.value.term.value && (!this.dump.values || this.dump.values.length === 1 || this.dump.values.every((item) => item.value.term.value));
                    } else if (showflag === 'notTerm') {
                        isShow = isShow && !this.dump.value.term.value && (!this.dump.values || this.dump.values.length === 1 || this.dump.values.every((item) => !item.value.term.value));
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
