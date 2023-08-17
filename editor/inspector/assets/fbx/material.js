'use strict';

const { updateElementReadonly, updateElementInvalid } = require('../../utils/assets');

const { join, dirname } = require('path');

exports.template = /* html */`
<div class="container">
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.dumpMaterials.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.dumpMaterials.title"></ui-label>
        <ui-checkbox slot="content" class="dumpMaterials-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop class="materialDumpDir-prop">
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.materialDumpDir.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.materialDumpDir.title"></ui-label>
        <ui-file slot="content" class="materialDumpDir-file" type="directory"></ui-file>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.useVertexColors.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.useVertexColors.title"></ui-label>
        <ui-checkbox slot="content" class="useVertexColors-checkbox"></ui-checkbox>
    </ui-prop>
    <ui-prop>
        <ui-label slot="label" value="i18n:ENGINE.assets.fbx.GlTFUserData.depthWriteInAlphaModeBlend.name" tooltip="i18n:ENGINE.assets.fbx.GlTFUserData.depthWriteInAlphaModeBlend.title"></ui-label>
        <ui-checkbox slot="content" class="depthWriteInAlphaModeBlend-checkbox"></ui-checkbox>
    </ui-prop>
    <div class="images"></div>
</div>
`;

exports.style = /* css */`
ui-prop { margin-right: 4px; }
ui-section.config { margin-right: 0; }

.images {
    margin: 4px 0;
}

.images > ui-section > .sub-item {
    padding-top: 10px;
    padding-left: 10px;
}

.images > ui-section > .sub-item ui-prop {
    --left-width: calc(35% - 10px);
}

.images > ui-section > .sub-item ui-asset {
    width: 100%;
}
.images > ui-section > .sub-item .img {
    max-width: 100px;
    max-height: 100px;
    min-width: 14px;
}
.images > ui-section > .sub-item .image {
    margin-top: 5px;
    max-height: 400px;
}
`;

exports.$ = {
    container: '.container',
    dumpMaterialsCheckbox: '.dumpMaterials-checkbox',
    materialDumpDirProp: '.materialDumpDir-prop',
    materialDumpDirFile: '.materialDumpDir-file',
    useVertexColorsCheckbox: '.useVertexColors-checkbox',
    depthWriteInAlphaModeBlendCheckbox: '.depthWriteInAlphaModeBlend-checkbox',
    images: '.images',
};

const Elements = {
    dumpMaterials: {
        ready() {
            const panel = this;

            panel.$.dumpMaterialsCheckbox.addEventListener('change', (event) => {
                panel.setProp('dumpMaterials', event);

                Elements.materialDumpDir.update.bind(panel)();
            });
            panel.$.dumpMaterialsCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.dumpMaterialsCheckbox.value = panel.getDefault(panel.meta.userData.dumpMaterials, false);

            updateElementInvalid.call(panel, panel.$.dumpMaterialsCheckbox, 'dumpMaterials');
            updateElementReadonly.call(panel, panel.$.dumpMaterialsCheckbox);
        },
    },
    materialDumpDir: {
        ready() {
            const panel = this;

            panel.$.materialDumpDirFile.addEventListener('change', async (event) => {
                const value = event.target.value;
                panel.materialDumpDir = value;

                // Restricted values are in the assets directory
                const projectAssets = join(Editor.Project.path, 'assets');
                if (!Editor.Utils.Path.contains(projectAssets, value)) {
                    await Editor.Dialog.warn(Editor.I18n.t('ENGINE.assets.fbx.limitMaterialDumpDir'), {
                        title: Editor.I18n.t('scene.messages.warning'),
                    });

                    panel.materialDumpDir = panel.materialDumpDirDefault;
                    Elements.materialDumpDir.update.bind(panel)();
                    return;
                }

                const dir = await Editor.Message.request('asset-db', 'query-url', panel.materialDumpDir);
                panel.metaList.forEach((meta) => {
                    meta.userData.materialDumpDir = dir;
                });

                panel.dispatch('change');
            });
        },
        async update() {
            const panel = this;

            panel.$.materialDumpDirProp.style.display = panel.$.dumpMaterialsCheckbox.value ? 'block' : 'none';
            if (!panel.$.dumpMaterialsCheckbox.value) {
                return;
            }

            // Same resource in a parent folder
            const filePath = (await Editor.Message.request('asset-db', 'query-path', panel.asset.path)) || '';
            panel.materialDumpDirDefault = dirname(filePath);

            // Same resource in a parent folder
            let materialDumpDir = panel.materialDumpDirDefault;

            if (panel.meta.userData.materialDumpDir) {
                const dataDir = await Editor.Message.request('asset-db', 'query-path', panel.meta.userData.materialDumpDir);
                if (dataDir) {
                    materialDumpDir = dataDir;
                }
            }

            panel.$.materialDumpDirFile.value = materialDumpDir;

            updateElementInvalid.call(panel, panel.$.materialDumpDirFile, 'materialDumpDir');
            updateElementReadonly.call(panel, panel.$.materialDumpDirFile);
        },
    },
    useVertexColors: {
        ready() {
            const panel = this;

            panel.$.useVertexColorsCheckbox.addEventListener('change', panel.setProp.bind(panel, 'useVertexColors'));
            panel.$.useVertexColorsCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.useVertexColorsCheckbox.value = panel.getDefault(panel.meta.userData.useVertexColors, false);

            updateElementInvalid.call(panel, panel.$.useVertexColorsCheckbox, 'useVertexColors');
            updateElementReadonly.call(panel, panel.$.useVertexColorsCheckbox);
        },
    },
    depthWriteInAlphaModeBlend: {
        ready() {
            const panel = this;

            panel.$.depthWriteInAlphaModeBlendCheckbox.addEventListener('change', panel.setProp.bind(panel, 'depthWriteInAlphaModeBlend'));
            panel.$.depthWriteInAlphaModeBlendCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.depthWriteInAlphaModeBlendCheckbox.value = panel.getDefault(panel.meta.userData.depthWriteInAlphaModeBlend, false);

            updateElementInvalid.call(panel, panel.$.depthWriteInAlphaModeBlendCheckbox, 'depthWriteInAlphaModeBlend');
            updateElementReadonly.call(panel, panel.$.depthWriteInAlphaModeBlendCheckbox);
        },
    },
    images: {
        async update() {
            const panel = this;

            panel.$.images.innerText = '';

            if (panel.assetList.length !== 1) {
                return;
            }

            if (!panel.meta || !panel.meta.userData || !panel.meta.userData.imageMetas) {
                return;
            }

            const images = [];
            const subNames = Object.keys(panel.meta.userData.imageMetas);
            for (let index = 0; index < subNames.length; index++) {
                const name = subNames[index];
                const item = panel.meta.userData.imageMetas[name];
                const imageUuid = item.uri;

                // Processing image display
                let src = '';
                // may be base64 images.
                if (item.uri.startsWith('data:')) {
                    src = item.uri;
                } else {
                    // Handling the case of uuid
                    const imageAsset = await Editor.Message.request('asset-db', 'query-asset-info', imageUuid);
                    if (imageAsset && imageAsset.library) {
                        const key = Object.keys(imageAsset.library).find((key) => key !== '.json');
                        if (key) {
                            src = imageAsset.library[key];
                        }
                    }
                }

                let remapUuid = '';
                // URL format
                if (item.remap) {
                    remapUuid = await Editor.Message.request('asset-db', 'query-uuid', item.remap);
                }

                images.push({
                    name: item.name || name,
                    src,
                    imageUuid,
                    remapUuid,
                    remap: item.remap,
                    index,
                });
            }

            // Generate dom
            images.forEach((image, index) => {
                const section = document.createElement('ui-section');
                section.setAttribute('expand', '');
                panel.$.images.appendChild(section);

                const header = document.createElement('div');
                header.setAttribute('slot', 'header');
                header.innerText = image.name;
                section.appendChild(header);

                const content = document.createElement('div');
                content.setAttribute('class', 'sub-item');
                section.appendChild(content);

                const remapAsProp = document.createElement('ui-prop');
                content.appendChild(remapAsProp);

                const remapAsPropLabel = document.createElement('ui-label');
                remapAsPropLabel.setAttribute('slot', 'label');
                remapAsPropLabel.setAttribute('value', 'i18n:ENGINE.assets.fbx.ImageRemap.remapAs');
                remapAsProp.appendChild(remapAsPropLabel);

                const remapAsPropContent = document.createElement('div');
                remapAsPropContent.setAttribute('slot', 'content');
                remapAsProp.appendChild(remapAsPropContent);

                const remapAsPropContentAsset = document.createElement('ui-asset');
                remapAsPropContentAsset.setAttribute('droppable', 'cc.ImageAsset');
                remapAsPropContent.appendChild(remapAsPropContentAsset);

                remapAsPropContentAsset.addEventListener('confirm', async (event) => {
                    const uuid = event.target.value;
                    let url = '';

                    if (uuid) {
                        const asset = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
                        if (!asset) {
                            return;
                        }
                        url = asset.source;
                    }
                    image.remapUuid = uuid;
                    image.remap = url;
                    panel.meta.userData.imageMetas[index].remap = uuid;

                    const remapAsPropContentImg = remapAsPropContent.querySelector('.image');

                    if (remapAsPropContentImg) {
                        remapAsPropContentImg.setAttribute('value', image.remap);
                    } else {
                        panel.appendImage(remapAsPropContent, image.remap);
                    }

                    this.dispatch('change');
                    this.dispatch('snapshot');
                });

                if (image.remap) {
                    remapAsPropContentAsset.setAttribute('value', image.remap);
                    panel.appendImage(remapAsPropContent, image.remap);
                }

                //
                const originalProp = document.createElement('ui-prop');
                content.appendChild(originalProp);

                const originalPropLabel = document.createElement('ui-label');
                originalPropLabel.setAttribute('slot', 'label');
                originalPropLabel.setAttribute('value', 'i18n:ENGINE.assets.fbx.ImageRemap.original');
                originalProp.appendChild(originalPropLabel);

                const originalPropContent = document.createElement('div');
                originalPropContent.setAttribute('slot', 'content');
                originalProp.appendChild(originalPropContent);

                if (image.src) {
                    const originalPropContentImg = document.createElement('img');
                    originalPropContentImg.setAttribute('src', image.src);
                    originalPropContentImg.setAttribute('title', image.imageUuid);
                    originalPropContentImg.setAttribute('class', 'img');
                    originalPropContent.appendChild(originalPropContentImg);
                } else {
                    originalPropContent.innerText = `<span>${image.imageUuid}</span>`;
                }
            });
        },
    },
};

exports.methods = {
    setProp(prop, event) {
        this.metaList.forEach((meta) => {
            meta.userData[prop] = event.target.value;
        });

        this.dispatch('change');
        this.dispatch('track', { tab: 'material', prop, value: event.target.value });
    },
    getDefault(value, def, prop) {
        if (value === undefined) {
            return def;
        }

        if (prop) {
            value = value[prop];
        }

        if (value === undefined) {
            return def;
        }
        return value;
    },
    appendImage(parent, value) {
        const image = document.createElement('ui-image');
        image.setAttribute('class', 'image');
        image.setAttribute('value', value);
        image.setAttribute('slot', 'content');
        parent.appendChild(image);
    },
};

exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

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
};

exports.close = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};
