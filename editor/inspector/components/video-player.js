/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = [
    'resourceType', 'remoteURL', 'clip', 'playOnAwake', 'loop',
    'mute', 'volume', 'playbackRate', 'keepAspectRatio', 'fullScreenOnAwake',
    'stayOnBottom', 'videoPlayerEvent',
];
exports.template = `
<div class="video-player-component">
    <ui-prop
        type="dump"
        key="resourceType"
    ></ui-prop>

    <ui-prop
        type="dump"
        showflag="0"
        key="remoteURL"
    ></ui-prop>

    <ui-prop
        type="dump"
        showflag="1"
        key="clip"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="playOnAwake"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="loop"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="mute"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="volume"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="playbackRate"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="keepAspectRatio"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="fullScreenOnAwake"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="stayOnBottom"
    ></ui-prop>

    <ui-prop
        type="dump"
        key="videoPlayerEvent"
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
                let isShow = this.dump.value[key].visible;
                if (element.hasAttribute('showflag')) {
                    const showflag = element.getAttribute('showflag');
                    isShow = isShow && this.dump.value.resourceType.value == showflag;
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
