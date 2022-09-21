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
    <!--ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.bakeOfflineMipmaps" tooltip="i18n:ENGINE.assets.image.bakeOfflineMipmapsTip"></ui-label>
        <ui-checkbox slot="content" class="bakeOfflineMipmaps-checkbox"></ui-checkbox>
    </ui-prop-->
    <ui-prop  class="fixATAProp">
        <ui-label slot="label" value="i18n:ENGINE.assets.image.fixAlphaTransparencyArtifacts" tooltip="i18n:ENGINE.assets.image.fixAlphaTransparencyArtifactsTip"></ui-label>
        <ui-checkbox slot="content" class="fixAlphaTransparencyArtifacts-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop class="isRGBE-prop">
        <ui-label slot="label" value="i18n:ENGINE.assets.image.isRGBE" tooltip="i18n:ENGINE.assets.image.isRGBETip"></ui-label>
        <ui-checkbox slot="content" class="isRGBE-checkbox"></ui-checkbox>
    </ui-prop>

    <ui-section expand class="sub-panel-section" cache-expand="image-sub-panel-section">
        <ui-label slot="header"></ui-label>
        <ui-panel></ui-panel>
    </ui-section>

    <ui-section expand class="sub-texture-panel-section" cache-expand="image-sub-panel-section" hidden>
        <ui-label slot="header"></ui-label>
        <ui-panel></ui-panel>
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
    panelSection: '.sub-panel-section',
    texturePanelSection: '.sub-texture-panel-section',

    container: '.asset-image',
    typeSelect: '.type-select',
    flipVerticalCheckbox: '.flipVertical-checkbox',
    fixAlphaTransparencyArtifactsCheckbox: '.fixAlphaTransparencyArtifacts-checkbox',
    fixATAProp: '.fixATAProp',
    isRGBEProp: '.isRGBE-prop',
    isRGBECheckbox: '.isRGBE-checkbox',

    // bakeOfflineMipmapsCheckbox: '.bakeOfflineMipmaps-checkbox',
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    type: {
        ready() {
            const panel = this;

            panel.$.typeSelect.addEventListener('change', (event) => {
                // metaList take the type of the first asset selected to solve
                let spriteFrameChange;
                if (panel.meta.userData.type === 'sprite-frame') {
                    spriteFrameChange = 'spriteFrameToOthers';
                } else if (event.target.value === 'sprite-frame') {
                    spriteFrameChange = 'othersToSpriteFrame';
                }

                panel.metaList.forEach((meta) => {
                    meta.userData.type = event.target.value;
                });

                // There are other properties whose updates depend on its changes attribute corresponds to the edit element
                Elements.isRGBE.update.call(panel);
                Elements.fixAlphaTransparencyArtifacts.update.call(panel);
                // imageAssets type change to spriteFrame, update mipmaps
                panel.updatePanel(spriteFrameChange);
                // need to be dispatched after updatePanel
                panel.dispatch('change');
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

            panel.$.typeSelect.value = panel.meta.userData.type;

            panel.updateInvalid(panel.$.typeSelect, 'type');
            panel.updateReadonly(panel.$.typeSelect);
        },
    },
    flipVertical: {
        ready() {
            const panel = this;

            panel.$.flipVerticalCheckbox.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.flipVertical = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.flipVerticalCheckbox.value = panel.meta.userData.flipVertical;

            panel.updateInvalid(panel.$.flipVerticalCheckbox, 'flipVertical');
            panel.updateReadonly(panel.$.flipVerticalCheckbox);
        },
    },
    // bakeOfflineMipmaps: {
    //     ready() {
    //         const panel = this;

    //         panel.$.bakeOfflineMipmapsCheckbox.addEventListener('change', (event) => {
    //             panel.metaList.forEach((meta) => {
    //                 meta.userData.bakeOfflineMipmaps = event.target.value;
    //             });
    //             panel.dispatch('change');
    //         });
    //     },
    //     update() {
    //         const panel = this;

    //         panel.$.bakeOfflineMipmapsCheckbox.value = panel.meta.userData.bakeOfflineMipmaps;

    //         panel.updateInvalid(panel.$.bakeOfflineMipmapsCheckbox, 'bakeOfflineMipmaps');
    //         panel.updateReadonly(panel.$.bakeOfflineMipmapsCheckbox);
    //     },
    // },

    fixAlphaTransparencyArtifacts: {
        ready() {
            const panel = this;
            panel.$.fixAlphaTransparencyArtifactsCheckbox.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.fixAlphaTransparencyArtifacts = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            /** @type {HTMLElement} */
            const fixAlphaTransparencyArtifactsCheckbox = panel.$.fixAlphaTransparencyArtifactsCheckbox;
            /** @type {HTMLElement} */
            const fixATAProp = panel.$.fixATAProp;
            fixAlphaTransparencyArtifactsCheckbox.value = panel.meta.userData.fixAlphaTransparencyArtifacts;
            const bannedTypes = ['normal map'];
            const isCapableToFixAlphaTransparencyArtifacts = !bannedTypes.includes(panel.meta.userData.type);
            if (isCapableToFixAlphaTransparencyArtifacts) {
                fixATAProp.style.display = 'block';
                panel.updateInvalid(panel.$.fixAlphaTransparencyArtifactsCheckbox, 'fixAlphaTransparencyArtifacts');
                panel.updateReadonly(panel.$.fixAlphaTransparencyArtifactsCheckbox);
            } else {
                fixATAProp.style.display = 'none';
            }
        },
    },
    isRGBE: {
        ready() {
            const panel = this;

            panel.$.isRGBECheckbox.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.isRGBE = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            if (panel.meta.userData.type === 'texture cube') {
                panel.$.isRGBEProp.style.display = 'block';

                panel.$.isRGBECheckbox.value = panel.meta.userData.isRGBE;

                panel.updateInvalid(panel.$.isRGBECheckbox, 'isRGBE');
                panel.updateReadonly(panel.$.isRGBECheckbox);
            } else {
                panel.$.isRGBEProp.style.display = 'none';
            }
        },
    },
};

/**
 * Methods for automatic rendering of components
 * @param assetList
 * @param metaList
 */
exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }

    this.updatePanel();
};

/**
 * Method of initializing the panel
 */
exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
    this.$.panelSection.addEventListener('change', () => {
        this.dispatch('change');
    });
    this.$.texturePanelSection.addEventListener('change', () => {
        this.dispatch('change');
    });
};

exports.methods = {
    /**
     * Update whether a data is editable in multi-select state
     */
    updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
    },
    /**
     * Update read-only status
     */
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },

    _updatePanel($section, type, spriteFrameChange) {
        const assetList = [];
        const metaList = [];

        const imageTypeToImporter = {
            raw: '',
            texture: 'texture',
            'normal map': 'texture',
            'sprite-frame': 'sprite-frame',
            'texture cube': 'erp-texture-cube',
        };

        const imageImporter = imageTypeToImporter[type];

        this.assetList.forEach((asset) => {
            if (!asset) {
                return;
            }

            for (const subUuid in asset.subAssets) {
                const subAsset = asset.subAssets[subUuid];

                if (!subAsset || subAsset.importer === '*') {
                    continue;
                }

                if (subAsset.importer === imageImporter) {
                    assetList.push(subAsset);
                    break;
                }
            }
        });

        this.metaList.forEach((meta) => {
            if (!meta) {
                return;
            }

            for (const subUuid in meta.subMetas) {
                const subMeta = meta.subMetas[subUuid];

                if (!subMeta || subMeta.importer === '*') {
                    continue;
                }

                if (subMeta.importer === imageImporter) {
                    if (spriteFrameChange === 'othersToSpriteFrame') {
                        // imageAsset 类型切换到 spriteFrame，禁用 mipmaps
                        subMeta.userData.mipfilter = 'none';
                    } else if (spriteFrameChange === 'spriteFrameToOthers' && subMeta.userData.mipfilter === 'none') {
                        // imageAsset 类型从 spriteFrame 切换到其他，原来没启用的话 mipmaps 默认 nearest
                        subMeta.userData.mipfilter = 'nearest';
                    }
                    metaList.push(subMeta);
                    break;
                }
            }
        });

        if (!assetList.length || !metaList.length) {
            $section.style.display = 'none';
            return;
        } else {
            $section.style.display = 'block';
        }

        const asset = assetList[0];
        const $label = $section.querySelector('ui-label');
        $label.setAttribute('value', type);
        const $panel = $section.querySelector('ui-panel');
        $panel.setAttribute('src', path.join(__dirname, `./${asset.importer}.js`));
        $panel.update(assetList, metaList);
    },

    /**
     * 更新属性 panel
     * @param {*} spriteFrameChange imageAsset 类型是否切换和 spriteFrame 是否有关
     */
    updatePanel(spriteFrameChange) {
        this._updatePanel(this.$.panelSection, this.meta.userData.type, spriteFrameChange);
        if (this.meta.userData.type === 'sprite-frame') {
            this._updatePanel(this.$.texturePanelSection, 'texture', spriteFrameChange);
        } else {
            this.$.texturePanelSection.style.display = 'none';
        }
    },
};
