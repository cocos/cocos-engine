'use strict';

const path = require('path');

exports.template = `
<div class="asset-image">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.type" tooltip="i18n:ENGINE.assets.image.typeTip"></ui-label>
        <ui-select slot="content" class="type-select"></ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.flipVertical" tooltip="i18n:ENGINE.assets.image.flipVerticalTip"></ui-label>
        <ui-checkbox slot="content" class="flipVertical-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop class="isRGBE-prop">
        <ui-label slot="label" value="i18n:ENGINE.assets.image.isRGBE" tooltip="i18n:ENGINE.assets.image.isRGBETip"></ui-label>
        <ui-checkbox slot="content" class="isRGBE-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.useCompressTexture" tooltip="i18n:ENGINE.assets.image.useCompressTextureTip"></ui-label>
        <ui-checkbox slot="content" class="useCompressTexture-checkbox"></ui-checkbox>
    </ui-prop>

    <ui-section expand>
        <ui-label class="sub-panel-name" slot="header"></ui-label>
        <ui-panel class="sub-panel"></ui-panel>
    </ui-section>
</div>
`;

exports.style = `
    .asset-image > ui-prop {
        margin: 4px 0;
    }
    .asset-image > ui-section {
        margin: 4px 0;
    }
    .asset-image > ui-section > ui-panel {
        margin-top: 5px;
    }
`;

exports.$ = {
    panel: '.sub-panel',
    panelName: '.sub-panel-name',

    container: '.asset-image',
    typeSelect: '.type-select',
    flipVerticalCheckbox: '.flipVertical-checkbox',
    isRGBEProp: '.isRGBE-prop',
    isRGBECheckbox: '.isRGBE-checkbox',
    useCompressTextureCheckbox: '.useCompressTexture-checkbox',
};

/**
 * 属性对应的编辑元素
 */
const Elements = {
    type: {
        ready() {
            const panel = this;

            panel.$.typeSelect.addEventListener('change', (event) => {
                panel._metaList.forEach((meta) => {
                    meta.userData.type = event.target.value;
                });
                panel.dispatch('change');

                // 有其他属性的更新依赖它的变动
                Elements.isRGBE.update.bind(panel)();
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['raw', 'texture', 'normal map', 'sprite-frame', 'texture cube'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.typeSelect.innerHTML = optionsHtml;

            panel.$.typeSelect.value = panel._meta.userData.type;

            panel.updateInvalid(panel.$.typeSelect, 'type');
            panel.updateReadonly(panel.$.typeSelect);
        },
    },
    flipVertical: {
        ready() {
            const panel = this;

            panel.$.flipVerticalCheckbox.addEventListener('change', (event) => {
                panel._metaList.forEach((meta) => {
                    meta.userData.flipVertical = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.flipVerticalCheckbox.value = panel._meta.userData.flipVertical;

            panel.updateInvalid(panel.$.flipVerticalCheckbox, 'flipVertical');
            panel.updateReadonly(panel.$.flipVerticalCheckbox);
        },
    },
    isRGBE: {
        ready() {
            const panel = this;

            panel.$.isRGBECheckbox.addEventListener('change', (event) => {
                panel._metaList.forEach((meta) => {
                    meta.userData.isRGBE = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            if (panel._meta.userData.type === 'texture cube') {
                panel.$.isRGBEProp.style.display = 'block';

                panel.$.isRGBECheckbox.value = panel._meta.userData.isRGBE;

                panel.updateInvalid(panel.$.isRGBECheckbox, 'isRGBE');
                panel.updateReadonly(panel.$.isRGBECheckbox);
            } else {
                panel.$.isRGBEProp.style.display = 'none';
            }
        },
    },
    useCompressTexture: {
        ready() {
            const panel = this;

            panel.$.useCompressTextureCheckbox.addEventListener('change', (event) => {
                panel._metaList.forEach((meta) => {
                    meta.userData.useCompressTexture = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.useCompressTextureCheckbox.value = panel._meta.userData.useCompressTexture;

            panel.updateInvalid(panel.$.useCompressTextureCheckbox, 'useCompressTexture');
            panel.updateReadonly(panel.$.useCompressTextureCheckbox);
        },
    },
};

/**
 * 自动渲染组件的方法
 * @param assetList
 * @param metaList
 */
exports.update = function (assetList, metaList) {
    this._assetList = assetList;
    this._metaList = metaList;
    this._asset = assetList[0];
    this._meta = metaList[0];

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }

    this.updatePanel();
};

/**
 * 初始化界面的方法
 */
exports.ready = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.methods = {
    /**
     * 更新多选状态下某个数据是否可编辑
     */
    updateInvalid(element, prop) {
        const invalid = this._metaList.some((meta) => {
            return meta.userData[prop] !== this._meta.userData[prop];
        });
        element.invalid = invalid;
    },
    /**
     * 更新只读状态
     */
    updateReadonly(element) {
        if (this._asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },

    async updatePanel() {
        this._subUUIDList = [];

        this._assetList.forEach((asset) => {
            if (!asset) {
                return;
            }

            let validSUbUuid = null;

            for (const subUuid in asset.subAssets) {
                const subAsset = asset.subAssets[subUuid];

                if (!subAsset || subAsset.importer === '*') {
                    continue;
                }

                if (subAsset.importer === 'sprite-frame') {
                    validSUbUuid = subUuid;
                    break;
                } else {
                    validSUbUuid = subUuid;
                }
            }

            if (validSUbUuid !== null) {
                this._subUUIDList.push(`${asset.uuid}@${validSUbUuid}`);
            }
        });

        if (!this._subUUIDList.length) {
            return;
        }

        const assetList = await Promise.all(
            this._subUUIDList.map((uuid) => {
                return Editor.Message.request('asset-db', 'query-asset-info', uuid);
            }),
        );

        const metaList = await Promise.all(
            this._subUUIDList.map((uuid) => {
                return Editor.Message.request('asset-db', 'query-asset-meta', uuid);
            }),
        );

        const asset = assetList[0];
        this.$.panelName.setAttribute('value', asset.importer);
        this.$.panel.setAttribute('src', path.join(__dirname, `./${asset.importer}.js`));
        this.$.panel.update(assetList, metaList);
        this.$.panel.addEventListener('change', () => {
            this.dispatch('change');
        });
    },
};
