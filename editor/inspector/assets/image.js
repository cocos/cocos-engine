'use strict';

const { join } = require('path');
const { updateElementReadonly, updateElementInvalid } = require('../utils/assets');
const { injectionStyle } = require('../utils/prop');

exports.template = /* html */`
<div class="asset-image">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.type" tooltip="i18n:ENGINE.assets.image.typeTip"></ui-label>
        <ui-select slot="content" class="type-select"></ui-select>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.flipVertical" tooltip="i18n:ENGINE.assets.image.flipVerticalTip"></ui-label>
        <ui-checkbox slot="content" class="flipVertical-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop  class="fixATA-prop">
        <ui-label slot="label" value="i18n:ENGINE.assets.image.fixAlphaTransparencyArtifacts" tooltip="i18n:ENGINE.assets.image.fixAlphaTransparencyArtifactsTip"></ui-label>
        <ui-checkbox slot="content" class="fixAlphaTransparencyArtifacts-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.image.flipGreenChannel" tooltip="i18n:ENGINE.assets.image.flipGreenChannelTip"></ui-label>
        <ui-checkbox slot="content" class="flipGreenChannel-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop class="isRGBE-prop">
        <ui-label slot="label" value="i18n:ENGINE.assets.image.isRGBE" tooltip="i18n:ENGINE.assets.image.isRGBETip"></ui-label>
        <ui-checkbox slot="content" class="isRGBE-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-section expand class="sub-panel-section config no-padding" cache-expand="image-sub-panel-section">
        <ui-label slot="header"></ui-label>
        <ui-panel></ui-panel>
    </ui-section>
    <ui-section expand class="sub-texture-panel-section config no-padding" cache-expand="image-sub-panel-section" hidden>
        <ui-label slot="header"></ui-label>
        <ui-panel></ui-panel>
    </ui-section>
</div>
`;

exports.style = /* css */`
:host .asset-image > ui-prop { margin-right: 4px; }
`;

exports.$ = {
    container: '.asset-image',
    typeSelect: '.type-select',
    flipVerticalCheckbox: '.flipVertical-checkbox',
    flipGreenChannel: '.flipGreenChannel-checkbox',
    fixAlphaTransparencyArtifactsCheckbox: '.fixAlphaTransparencyArtifacts-checkbox',
    fixATAProp: '.fixATA-prop',
    isRGBEProp: '.isRGBE-prop',
    isRGBECheckbox: '.isRGBE-checkbox',
    panelSection: '.sub-panel-section',
    texturePanelSection: '.sub-texture-panel-section',
};

const Elements = {
    type: {
        ready() {
            const panel = this;

            panel.$.typeSelect.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.type = event.target.value;
                });

                // There are other properties whose updates depend on its changes attribute corresponds to the edit element
                Elements.isRGBE.update.call(panel);
                Elements.fixAlphaTransparencyArtifacts.update.call(panel);
                // imageAssets type change to spriteFrame, update mipmaps
                panel.updatePanel();
                // need to be dispatched after updatePanel
                panel.dispatch('change');
            });

            panel.$.typeSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
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

            updateElementInvalid.call(panel, panel.$.typeSelect, 'type');
            updateElementReadonly.call(panel, panel.$.typeSelect);
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

            panel.$.flipVerticalCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.flipVerticalCheckbox.value = panel.meta.userData.flipVertical;

            updateElementInvalid.call(panel, panel.$.flipVerticalCheckbox, 'flipVertical');
            updateElementReadonly.call(panel, panel.$.flipVerticalCheckbox);
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

            panel.$.fixAlphaTransparencyArtifactsCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            const fixAlphaTransparencyArtifactsCheckbox = panel.$.fixAlphaTransparencyArtifactsCheckbox;
            const fixATAProp = panel.$.fixATAProp;
            fixAlphaTransparencyArtifactsCheckbox.value = panel.meta.userData.fixAlphaTransparencyArtifacts;
            const bannedTypes = ['normal map'];
            const isCapableToFixAlphaTransparencyArtifacts = !bannedTypes.includes(panel.meta.userData.type);
            if (isCapableToFixAlphaTransparencyArtifacts) {
                fixATAProp.style.display = 'block';
                updateElementInvalid.call(panel, panel.$.fixAlphaTransparencyArtifactsCheckbox, 'fixAlphaTransparencyArtifacts');
                updateElementReadonly.call(panel, panel.$.fixAlphaTransparencyArtifactsCheckbox);
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

            panel.$.isRGBECheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            if (panel.meta.userData.type === 'texture cube') {
                panel.$.isRGBEProp.style.display = 'block';

                panel.$.isRGBECheckbox.value = panel.meta.userData.isRGBE;

                updateElementInvalid.call(panel, panel.$.isRGBECheckbox, 'isRGBE');
                updateElementReadonly.call(panel, panel.$.isRGBECheckbox);
            } else {
                panel.$.isRGBEProp.style.display = 'none';
            }
        },
    },
    flipGreenChannel: {
        ready() {
            const panel = this;

            panel.$.flipGreenChannel.addEventListener('change', (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.flipGreenChannel = event.target.value;
                });
                panel.dispatch('change');
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.flipGreenChannel.value = panel.meta.userData.flipGreenChannel;
            updateElementInvalid.call(panel, panel.$.flipGreenChannel, 'flipGreenChannel');
            updateElementReadonly.call(panel, panel.$.flipGreenChannel);

        },
    },
};

exports.methods = {
    apply() {
        // if the image type changes between sprite-frame
        this.spriteFrameChange = this.checkSpriteFrameChange(this.originImageType, this.meta.userData.type);
    },
    updatePanel() {
        this.setPanel(this.$.panelSection, this.meta.userData.type);

        // sprite-frame 需要多显示 texture 面板
        if (this.meta.userData.type === 'sprite-frame') {
            this.setPanel(this.$.texturePanelSection, 'texture');
        } else {
            this.$.texturePanelSection.style.display = 'none';
        }
    },

    setPanel($section, type) {
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
        $panel.setAttribute('src', join(__dirname, `./${asset.importer}.js`));
        $panel.injectionStyle(injectionStyle);
        $panel.update(assetList, metaList, this.assetList);
    },

    checkSpriteFrameChange(srcType, destType) {
        const changeTypes = ['texture', 'normal map', 'texture cube'];
        // imageAsset type changed contains spriteFrame
        let spriteFrameChange = '';
        if (srcType === 'sprite-frame' && changeTypes.includes(destType)) {
            spriteFrameChange = 'spriteFrameToOthers';
        } else if (destType === 'sprite-frame' && changeTypes.includes(srcType)) {
            spriteFrameChange = 'othersToSpriteFrame';
        }
        return spriteFrameChange;
    },

    handleTypeChange(spriteFrameChange, type) {
        if (!spriteFrameChange || !type) {
            return;
        }

        const imageTypeToImporter = {
            raw: '',
            texture: 'texture',
            'normal map': 'texture',
            'sprite-frame': 'sprite-frame',
            'texture cube': 'erp-texture-cube',
        };
        // change mipFilter
        const imageImporter = imageTypeToImporter[type];
        this.metaList.forEach((meta) => {
            let mipChanged = false;
            if (!meta) {
                return;
            }
            for (const subUuid in meta.subMetas) {
                const subMeta = meta.subMetas[subUuid];
                if (!subMeta || subMeta.importer === '*') {
                    continue;
                }
                if (subMeta.importer === imageImporter) {
                    if (spriteFrameChange === 'othersToSpriteFrame' && imageImporter === 'texture' && subMeta.userData.mipfilter !== 'none') {
                        // imageAsset type change to spriteFrame，disabled mipmaps
                        subMeta.userData.mipfilter = 'none';
                        mipChanged = true;
                    } else if (spriteFrameChange === 'spriteFrameToOthers' && subMeta.userData.mipfilter === 'none') {
                        // imageAsset type change to other type from spriteFrame
                        subMeta.userData.mipfilter = 'nearest';
                        mipChanged = true;
                    }
                    break;
                }
            }

            // sync meta
            if (mipChanged) {
                const content = JSON.stringify(meta);
                Editor.Message.request('asset-db', 'save-asset-meta', meta.uuid, content);
            }
        });
    },
};

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
    this.$.panelSection.addEventListener('snapshot', () => {
        this.dispatch('snapshot');
    });

    this.$.texturePanelSection.addEventListener('change', () => {
        this.dispatch('change');
    });
    this.$.texturePanelSection.addEventListener('snapshot', () => {
        this.dispatch('snapshot');
    });
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    if (this.spriteFrameChange && this.originMetaList && !this.asset.readonly) {
        this.handleTypeChange(this.spriteFrameChange, this.meta.userData.type);
        // same as panel handle
        if (this.meta.userData.type === 'sprite-frame') {
            this.handleTypeChange(this.spriteFrameChange, 'texture');
        }
    }
    this.originImageType = this.meta.userData.type;
    // change originMetaList
    this.originMetaList = JSON.parse(JSON.stringify(this.metaList));

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }

    this.updatePanel();
};
