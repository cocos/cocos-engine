/* eslint-disable @typescript-eslint/no-unsafe-return */
const propUtils = require('../utils/prop');

const excludeList = ['threshold'];
exports.template = `
<div class="polygon-collider-2d">
    <style>
        .baseContent {
            display: flex;
        }

        .baseContent>ui-prop {
            flex: 1;
            margin-right: 5px;
        }

        .baseContent>#buttonParent {
            display: flex;
            align-content: center;
            align-items: center;
        }
    </style>
    <div class="baseContent">
        <ui-prop type="dump" key="threshold">
        </ui-prop>
        <div id="buttonParent">
            <ui-button id="button" class="blue tiny">Regenerate Points</ui-button>
        </div>
    </div>
    <div id="customProps"></div>
</div>
`;

exports.methods = {
    regenerate () {
        Editor.Message.request('scene', 'regenerate-polygon-2d-points', this.dump.value.uuid.value);
    },
};
exports.$ = {
    button: '#button',
    customProps: '#customProps',
};
const uiElements = {
    buttton: {
        ready () {
            this.$.button.addEventListener('click', () => { 
                this.regenerate(); 
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
                const isShow = this.dump.value[key].visible;
                if (isShow) {
                    element.render(this.dump.value[key]);
                }
                element.style = isShow ? 'flex: 1;margin-right: 5px' : 'display: none;';
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
