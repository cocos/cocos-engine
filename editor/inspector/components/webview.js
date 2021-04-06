/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = [
    'url', 'opacity', 'webviewEvents',
];

exports.template = `
<div class="web-view-component">

    <ui-prop key="url" class="customProp" type="dump">
        <ui-label id="label" slot="label"></ui-label>
        <ui-input slot="content" id="content" placeholder="https://www.cocos.com/"></ui-input>
    </ui-prop>

    <ui-prop type="dump" key="opacity"></ui-prop>

    <ui-prop type="dump" key="webviewEvents"></ui-prop>

    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;

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
const uiElements = {
    baseProps: {
        ready () {
            this.$.baseProps = this.$this.querySelectorAll('ui-prop:not(.customProp)');
            
        },
        update () {
            this.$.baseProps = this.$.baseProps || this.$this.querySelectorAll('ui-prop:not(.customProp)');
            this.$.baseProps.forEach((element) => {
                const dump = this.dump.value[element.getAttribute('key')];
                let isVisible = dump && dump.visible;
                if (element.hasAttribute('showflag')) {
                    const showflag = element.getAttribute('showflag');
                    isVisible = isVisible && this.dump.value.transition.value == showflag && (this.dump.values.length === 1 || this.dump.values.every((item) => item.value.transition.value == showflag));
                }
                element.style = isVisible ? '' : 'display:none;';
                if (isVisible) {
                    element.render(dump);
                }
            });
        },
    },
    label: {
        update () {
            this.$.label.setAttribute('tooltip',this.dump.value.url.tooltip);
            this.$.label.setAttribute('value',this.dump.value.url.name);
        },
    },
    content: {
        ready () {
            this.$.content.addEventListener('change', (event) => {
                this.dump.value.url.value = event.target.value;
                this.$.url.dispatch('change-dump');
            });
        },
        update () {
            this.$.content.value = this.dump.value.url.value;
        },
    },
    customProps: {
        update () {
            this.$.customProps.replaceChildren(...propUtils.getCustomPropElements(excludeList, this.dump, (element, prop) => {
                element.className = 'customProp';
                const isShow = prop.dump.visible;
                if (isShow) {
                    element.render(prop.dump);
                }
                element.style = isShow ? '' : 'display: none';
            }));
        },
    },
    url: {
        update(){
            this.$.url.dump = this.dump;
        }
    }
};
exports.$ = {
    customProps: '#customProps',
    label: '#label',
    content: '#content',
    url: 'ui-prop[key="url"]'
};
