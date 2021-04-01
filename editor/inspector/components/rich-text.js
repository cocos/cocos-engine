/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = [
    'string', 'horizontalAlign', 'fontSize', 'useSystemFont',
    'fontFamily', 'font', 'cacheMode', 'maxWidth', 'lineHeight',
    'imageAtlas', 'handleTouchEvent',
];

exports.template = `
<div class="rich-text-component">
    <ui-prop type="dump" key="string"></ui-prop>
    <ui-prop type="dump" key="horizontalAlign"></ui-prop>
    <ui-prop type="dump" key="fontSize"></ui-prop>
    <ui-prop type="dump" showflag="useSystemFont" key="fontFamily"></ui-prop>
    <ui-prop type="dump" showflag="notUseSystemFont" key="font"></ui-prop>
    <ui-prop type="dump" key="useSystemFont"></ui-prop>
    <ui-prop type="dump" showflag="useSystemFont" key="cacheMode"></ui-prop>
    <ui-prop type="dump" key="maxWidth"></ui-prop>
    <ui-prop type="dump" key="lineHeight"></ui-prop>
    <ui-prop type="dump" key="imageAtlas"></ui-prop>
    <ui-prop type="dump" key="handleTouchEvent"></ui-prop>
    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;

exports.$ = {
    button: '#button',
    customProps: '#customProps',
    useSystemFont: 'ui-prop[key="useSystemFont"]',
};
const uiElements = {
    useSystemFont: {
        ready () {
            this.$.useSystemFont.addEventListener('change-dump', () => {
                uiElements.baseProps.update.call(this);
            });
        },
    },
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.showflags = [];
        },
        update () {
            if (!this.$.baseProps) {
                uiElements.baseProps.ready.call(this);
            }
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');
                let isShow = this.dump.value[key].visible;
          
                if (element.hasAttribute('showflag')) {
                    const showflag = element.getAttribute('showflag');
                    if (showflag === 'useSystemFont') {
                        isShow = isShow && this.dump.value.useSystemFont.value;
                    } else if (showflag === 'notUseSystemFont') {
                        isShow = isShow && !this.dump.value.useSystemFont.value;
                    }
                }
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
