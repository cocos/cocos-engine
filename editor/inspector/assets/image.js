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
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.bakeOfflineMipmaps" tooltip="i18n:ENGINE.assets.image.bakeOfflineMipmapsTip"></ui-label>
        <ui-checkbox slot="content" class="bakeOfflineMipmaps-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop  class="fixATAProp">
        <ui-label slot="label" value="i18n:ENGINE.assets.image.fixAlphaTransparencyArtifacts" tooltip="i18n:ENGINE.assets.image.fixAlphaTransparencyArtifactsTip"></ui-label>
        <ui-checkbox slot="content" class="fixAlphaTransparencyArtifacts-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop class="isRGBE-prop">
        <ui-label slot="label" value="i18n:ENGINE.assets.image.isRGBE" tooltip="i18n:ENGINE.assets.image.isRGBETip"></ui-label>
        <ui-checkbox slot="content" class="isRGBE-checkbox"></ui-checkbox>
    </ui-prop>

    <ui-section expand class="sub-panel-section" cache-expand="image-sub-panel-section">
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
    panelSection: '.sub-panel-section',
    panelName: '.sub-panel-name',

    container: '.asset-image',
    typeSelect: '.type-select',
    flipVerticalCheckbox: '.flipVertical-checkbox',
    fixAlphaTransparencyArtifactsCheckbox: '.fixAlphaTransparencyArtifacts-checkbox',
    fixATAProp: '.fixATAProp',
    isRGBEProp: '.isRGBE-prop',
    isRGBECheckbox: '.isRGBE-checkbox',

    bakeOfflineMipmapsCheckbox: '.bakeOfflineMipmaps-checkbox',
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    type: {
        ready() {
            const panel = this;

            panel.$.typeSelect.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.type = event.target.value;
                });
                panel.dispatch('change');

                // There are other properties whose updates depend on its changes attribute corresponds to the edit element
                Elements.isRGBE.update.call(panel);
                Elements.fixAlphaTransparencyArtifacts.update.call(panel);
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
    bakeOfflineMipmaps: {
        ready() {
            const panel = this;

            panel.$.bakeOfflineMipmapsCheckbox.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.bakeOfflineMipmaps = event.target.value;
                });
                panel.dispatch('change');
            });
        },
        update() {
            const panel = this;

            panel.$.bakeOfflineMipmapsCheckbox.value = panel.meta.userData.bakeOfflineMipmaps;
        },
    },

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
            const bannedTypes = ['normal map', 'texture cube'];
            const hasAlpha = panel.meta.userData.hasAlpha;
            const isCapableToFixAlphaTransparencyArtifacts = hasAlpha && !bannedTypes.includes(panel.meta.userData.type) && !panel.meta.userData.isRGBE;
            if (isCapableToFixAlphaTransparencyArtifacts) {
                fixATAProp.hidden = false;
                panel.updateInvalid(panel.$.fixAlphaTransparencyArtifactsCheckbox, 'fixAlphaTransparencyArtifacts');
                panel.updateReadonly(panel.$.fixAlphaTransparencyArtifactsCheckbox);
            } else {
                fixATAProp.hidden = true;
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
                panel.$.isRGBEProp.hidden = false;

                panel.$.isRGBECheckbox.value = panel.meta.userData.isRGBE;

                panel.updateInvalid(panel.$.isRGBECheckbox, 'isRGBE');
                panel.updateReadonly(panel.$.isRGBECheckbox);
            } else {
                panel.$.isRGBEProp.hidden = true;
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
    this.$.panel.addEventListener('change', () => {
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

    async updatePanel() {
        const assetList = [];
        const metaList = [];

        const imageTypeToImporter = {
            raw: '',
            texture: 'texture',
            'normal map': 'texture',
            'sprite-frame': 'sprite-frame',
            'texture cube': 'erp-texture-cube',
        };

        const imageImporter = imageTypeToImporter[this.meta.userData.type];

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
                    metaList.push(subMeta);
                    break;
                }
            }
        });

        if (!assetList.length || !metaList.length) {
            this.$.panelSection.hidden = true;
            return;
        } else {
            this.$.panelSection.hidden = false;
        }

        const asset = assetList[0];
        this.$.panelName.setAttribute('value', this.meta.userData.type);
        this.$.panel.setAttribute('src', path.join(__dirname, `./${asset.importer}.js`));
        this.$.panel.update(assetList, metaList);
    },
};
