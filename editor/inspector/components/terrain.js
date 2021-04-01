/* eslint-disable @typescript-eslint/no-unsafe-return */

const propUtils = require('../utils/prop');

exports.template = `
<div class="terrain">
    <div class="content">
        <ui-prop type="dump" key="_asset"></ui-prop>
    </div>
    <!-- Render other data that is not taken over -->
    <div id="customProps"></div>
</div>
`;

exports.methods = {
    handleAddAsset (assetUuid = '') {
        Editor.Message.request('scene', 'execute-component-method', {
            uuid: this.dump.value.uuid.value,
            name: 'manager.addAssetToComp',
            args: [assetUuid],
        });
    },
};

exports.$ = {
    _asset: 'ui-prop[key="_asset"]',
    customProps: '#customProps',
};

const uiElements = {
    _asset: {
        ready () {
            this.$._asset.addEventListener('change-dump', (event) => {
                this.handleAddAsset(event.target.dump.value);
            });
        },
        update () {
            const element =  this.$._asset;
            const key = element.getAttribute('key');
            const isShow = this.dump.value[key].visible;
            if (isShow) {
                element.render(this.dump.value[key]);
            }
            element.style = isShow ? '' : 'display: none;';
        },
    },
    customProps: {
        update () {
            this.$.customProps.replaceChildren(...propUtils.getCustomPropElements(['_asset', '_lightmapInfos', 'info', '_blockInfos', '_layers'], this.dump, (element, prop) => {
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
