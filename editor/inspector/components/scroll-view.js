/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = [
    'content', 'horizontal', 'vertical', 'inertia', 'brake', 'elastic',
    'bounceDuration', 'horizontalScrollBar', 'verticalScrollBar',
    'scrollEvents', 'cancelInnerEvents',
];

exports.template = `
<div class="scroll-view-component">
    <ui-prop type="dump" key="content"></ui-prop>
    <ui-prop type="dump" key="horizontal"></ui-prop>
    <ui-prop type="dump" key="vertical"></ui-prop>
    <ui-prop type="dump" key="inertia"></ui-prop>
    <ui-prop type="dump" showflag="inertia" key="brake"></ui-prop>
    <ui-prop type="dump" key="elastic"></ui-prop>
    <ui-prop type="dump" showflag="elastic" key="bounceDuration"></ui-prop>
    <ui-prop type="dump" showflag="horizontal" key="horizontalScrollBar"></ui-prop>
    <ui-prop type="dump" showflag="vertical" key="verticalScrollBar"></ui-prop>
    <ui-prop type="dump" key="scrollEvents"></ui-prop>
    <ui-prop type="dump" key="cancelInnerEvents"></ui-prop>

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
                let isShow = this.dump.value[key].visible;
                if (isShow) {
                    element.render(this.dump.value[key]);
                }
                if (element.hasAttribute('showflag')) {
                    const showflag = element.getAttribute('showflag');
                    isShow = isShow && this.dump.value[showflag] && this.dump.value[showflag].value;
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
