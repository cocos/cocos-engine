'use strict';

const { join } = require('path');
const { updateElementReadonly, updateElementInvalid } = require('../utils/assets');
const { injectionStyle } = require('../utils/prop');
const { ModeMap } = require('./texture/texture');

const imageTypeToImporter = {
    raw: '',
    texture: 'texture',
    'normal map': 'texture',
    'sprite-frame': 'sprite-frame',
    'texture cube': 'erp-texture-cube',
};

const imageTypeToName = {
    raw: '',
    texture: 'texture',
    'normal map': 'normalMap',
    'sprite-frame': 'spriteFrame',
    'texture cube': 'textureCube',
};

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

            panel.$.typeSelect.addEventListener('change', async (event) => {
                panel.metaList.forEach((meta) => {
                    meta.userData.type = event.target.value;
                });

                await panel.changeSubMetaWithType();

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
        $label.setAttribute('value', asset.name);
        const $panel = $section.querySelector('ui-panel');
        $panel.setAttribute('src', join(__dirname, `./${asset.importer}.js`));
        $panel.injectionStyle(injectionStyle);
        $panel.update(assetList, metaList, this.assetList);
    },

    changeMipFilter(targetSubMetaKey) {
        if (this.originImageType === 'sprite-frame') {
            // spriteFrame -> any 
            this.metaList.forEach(async (meta) => {
                if (!meta.subMetas[targetSubMetaKey]) {
                    meta.subMetas[targetSubMetaKey] = {
                        userData: {},
                    }
                }
                // hack only record the configuration of the type that has been updated, not the accurate configuration of the child resources after import.
                // If targetSubMeta does not have mipfilter or miupfilter is none, set mipfilter to nearest
                const preMipfilter = await Editor.Profile.getTemp('inspector', `${meta.uuid}@${targetSubMetaKey}.texture.mipfilter`, 'default');
                if (!preMipfilter || preMipfilter === 'none') {
                    meta.subMetas[targetSubMetaKey].userData.mipfilter = 'nearest';
                }
            });
        } else if (this.meta.userData.type === 'sprite-frame') {
            // any -> sprite，disabled mipmaps
            this.metaList.forEach((meta) => {
                if (!meta.subMetas[targetSubMetaKey]) {
                    meta.subMetas[targetSubMetaKey] = {
                        userData: {},
                    }
                }
                meta.subMetas[targetSubMetaKey].userData.mipfilter = 'none';
            });
        }
    },
    async changeSubMetaWithType() {
        // any -> texture : texture.wrapMode -> Repeat
        // any -> sprite : texture.wrapMode -> Clamp
        if (['sprite-frame', 'texture'].includes(this.meta.userData.type)) {
            const textureKey = Editor.Utils.UUID.nameToSubId('texture');
            let wrapModeCache;
            if (this.meta.subMetas[textureKey]) {
                const textureUUID = this.meta.subMetas[textureKey].uuid;
                wrapModeCache = await Editor.Profile.getTemp('inspector', `${textureUUID}.texture.wrapMode`);
                if (!wrapModeCache) {
                    // use default wrapMode if not changed
                    const wrapModeName = this.meta.userData.type === 'texture' ? 'Repeat' : 'Clamp';
                    this.metaList.forEach((meta) => {
                        const data = ModeMap.wrap[wrapModeName];
                        if (!meta.subMetas[textureKey]) {
                            meta.subMetas[textureKey] = {
                                userData: {}
                            }
                        }
                        for (const key of Object.keys(data)) {
                            meta.subMetas[textureKey].userData[key] = data[key];
                        }
                    });
                }
            }
            if (this.originImageType === 'sprite-frame' || this.meta.userData.type === 'sprite-frame') {
                const changeTypes = ['texture', 'normal map', 'texture cube', 'sprite-frame'];
                if (!changeTypes.includes(this.meta.userData.type)) {
                    return;
                }
                let targetName = imageTypeToName[this.meta.userData.type];
                if (targetName === 'spriteFrame') {
                    // change texture asset when import as sprite
                    targetName = 'texture';
                }
                const targetSubMetaKey = Editor.Utils.UUID.nameToSubId(targetName);
                targetSubMetaKey && this.changeMipFilter(targetSubMetaKey);
            }
        }
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

    this.originImageType = this.meta.userData.type;

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }

    this.updatePanel();
};
