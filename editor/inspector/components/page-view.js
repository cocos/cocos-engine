/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop')
const excludeList = [
    'content', 'sizeMode', 'direction', 'scrollThreshold',
    'autoPageTurningThreshold', 'inertia', 'brake', 'elastic', 'bounceDuration',
    'indicator', 'pageTurningSpeed', 'pageTurningEventTiming', 'pageEvents', 'cancelInnerEvents',
];
exports.template = `
<div class="page-view-component">
    <ui-prop type="dump"
        key="content"
    ></ui-prop>
    <ui-prop type="dump"
        key="sizeMode"
    ></ui-prop>
    <ui-prop type="dump"
        key="direction"
    ></ui-prop>
    <ui-prop type="dump"
        key="scrollThreshold"
    ></ui-prop>
    <ui-prop type="dump"
        key="autoPageTurningThreshold"
    ></ui-prop>
    <ui-prop type="dump"
        key="inertia"
    ></ui-prop>
    <ui-prop type="dump"
        key="brake"
    ></ui-prop>
    <ui-prop type="dump"
        key="elastic"
    ></ui-prop>
    <ui-prop type="dump"
        key="bounceDuration"
    ></ui-prop>
    <ui-prop type="dump"
        key="indicator"
    ></ui-prop>
    <ui-prop type="dump"
        key="pageTurningSpeed"
    ></ui-prop>
    <ui-prop type="dump"
        key="pageTurningEventTiming"
    ></ui-prop>
    <ui-prop type="dump"
        key="pageEvents"
    ></ui-prop>
    <ui-prop type="dump"
        key="cancelInnerEvents"
    ></ui-prop>
    <!-- 渲染其他没有接管的数据 -->
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
            }));
        },
    },
};
exports.$ = {
    customProps: '#customProps',
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
