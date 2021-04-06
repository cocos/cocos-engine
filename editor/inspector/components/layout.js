/* eslint-disable @typescript-eslint/restrict-template-expressions */
const propUtils = require('../utils/prop');
/* eslint-disable @typescript-eslint/no-unsafe-return */
const excludeList = [
    'type', 'resizeMode', 'cellSize', 'alignHorizontal',
    'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'spacingX', 'spacingY',
    'horizontalDirection', 'verticalDirection',
    'alignVertical', 'paddingTop', 'paddingBottom',
    'startAxis', 'constraint', 'constraintNum', 'affectedByScale',
];
exports.template = `
<div class="layout-component">
    <ui-prop type="dump" key="type"></ui-prop>
    <ui-prop type="dump" key="resizeMode"></ui-prop>
    <ui-prop type="dump" key="cellSize" showflag="resizeMode2"></ui-prop>
    <ui-prop type="dump" showflag="type1" key="alignHorizontal"></ui-prop>
    <ui-prop type="dump" showflag="type1" key="paddingLeft"></ui-prop>
    <ui-prop type="dump" showflag="type1" key="paddingRight"></ui-prop>
    <ui-prop type="dump" showflag="type1" key="spacingX"></ui-prop>
    <ui-prop type="dump" showflag="type1" key="horizontalDirection"></ui-prop>

    <ui-prop type="dump" showflag="type2" key="alignVertical"></ui-prop>
    <ui-prop type="dump" showflag="type2" key="paddingTop"></ui-prop>
    <ui-prop type="dump" showflag="type2" key="paddingBottom"></ui-prop>
    <ui-prop type="dump" showflag="type2" key="spacingY"></ui-prop>
    <ui-prop type="dump" showflag="type2" key="verticalDirection"></ui-prop>

    <ui-prop type="dump" showflag="type3" key="startAxis"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="paddingTop"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="paddingBottom"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="paddingLeft"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="paddingRight"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="spacingX"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="spacingY"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="verticalDirection"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="horizontalDirection"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="constraint"></ui-prop>
    <ui-prop type="dump" showflag="type3" key="constraintNum"></ui-prop>

    <ui-prop type="dump" showflag="typeNot0" key="affectedByScale"></ui-prop>

    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;
const uiElements = {
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                element.addEventListener('change-dump', () => {
                    uiElements.baseProps.update.call(this);
                });
            });
        },
        update () {
            if (!this.$.baseProps) {
                uiElements.baseProps.ready.call(this);
            }
            const judge = (lvalue, rvalue, isequal = true) => {
                if (!isequal) {
                    return this.dump.value[lvalue].value != rvalue && (!this.dump.values || this.dump.values.length === 1 || this.dump.values.every((item) => item.value[lvalue].value != rvalue));
                } else {
                    return this.dump.value[lvalue].value == rvalue && (!this.dump.values || this.dump.values.length === 1 || this.dump.values.every((item) => item.value[lvalue].value == rvalue));
                }
            };
            this.$.baseProps.forEach((element) => {
                const key = element.getAttribute('key');

                let isShow = this.dump.value[key].visible;

                if (element.hasAttribute('showflag')) {
                    const str = element.getAttribute('showflag');
                    switch (str) {
                    case 'resizeMode2':
                        isShow = isShow && judge('resizeMode', 2);
                        break;
                    case 'type1':
                        isShow = isShow && judge('type', 1);
                        break;
                    case 'type2':
                        isShow = isShow && judge('type', 2);
                        break;
                    case 'type3':
                        isShow = isShow && judge('type', 3);
                        break;
                    case 'typeNot0':
                        isShow = isShow && judge('type', 0, false);
                        break;
                    default:
                        break;
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
            }));
        },
    },
};
exports.$ = {
    customProps: '#customProps',
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
