'use strict';

const { updateElementReadonly } = require('../../utils/assets');
const { extname } = require('path');
const { ParseAtlasFile } = require('./parse-atlas');

exports.template = /* html */`
<div class="asset-texture">
    <!-- dont delete, for insert -->
    <div class="content">
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.anisotropy" tooltip="i18n:ENGINE.assets.texture.anisotropyTip"></ui-label>
            <ui-num-input slot="content" class="anisotropy-input"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.filterMode" tooltip="i18n:ENGINE.assets.texture.filterModeTip"></ui-label>
            <ui-select slot="content" class="filterMode-select"></ui-select>
        </ui-prop>
        <section class="filter-advanced-section">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.texture.minfilter" tooltip="i18n:ENGINE.assets.texture.minfilterTip"></ui-label>
                <ui-select slot="content" class="minfilter-select"></ui-select>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.texture.magfilter" tooltip="i18n:ENGINE.assets.texture.magfilterTip"></ui-label>
                <ui-select slot="content" class="magfilter-select"></ui-select>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.texture.generateMipmaps" tooltip="i18n:ENGINE.assets.texture.generateMipmapsTip"></ui-label>
                <ui-checkbox slot="content" class="generate-mipmaps-checkbox"></ui-checkbox>
            </ui-prop>
            <section class="generate-mipmaps-section">
                <ui-prop>
                    <ui-label slot="label" value="i18n:ENGINE.assets.texture.mipfilter" tooltip="i18n:ENGINE.assets.texture.mipfilterTip"></ui-label>
                    <ui-select slot="content" class="mipfilter-select"></ui-select>
                </ui-prop>
            </section>
        </section>
        <ui-prop class="filter-different">
            <div slot="content">
                <div class="atlas-file-name"></div>
            </div>
        </ui-prop>
        <ui-prop class="wrapMode-prop">
            <ui-label slot="label" value="i18n:ENGINE.assets.texture.wrapMode" tooltip="i18n:ENGINE.assets.texture.wrapModeTip"></ui-label>
            <ui-select slot="content" class="wrapMode-select"></ui-select>
        </ui-prop>
        <section class="wrap-advanced-section">
            <ui-prop class="wrapModeS-prop">
                <ui-label slot="label" value="i18n:ENGINE.assets.texture.wrapModeS" tooltip="i18n:ENGINE.assets.texture.wrapModeSTip"></ui-label>
                <ui-select slot="content" class="wrapModeS-select"></ui-select>
            </ui-prop>
            <ui-prop class="wrapModeT-prop">
                <ui-label slot="label" value="i18n:ENGINE.assets.texture.wrapModeT" tooltip="i18n:ENGINE.assets.texture.wrapModeTTip"></ui-label>
                <ui-select slot="content" class="wrapModeT-select"></ui-select>
            </ui-prop>
        </section>
        <ui-prop class="warn-words">
            <ui-label value="i18n:ENGINE.assets.texture.modeWarn"></ui-label>
        </ui-prop>
    </div>
</div>
`;

exports.style = /* css */`
.asset-texture {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-right: 4px;
}
.asset-texture > .content {
    flex: 1;
}

.asset-texture > .content .filter-advanced-section,
.asset-texture > .content .wrap-advanced-section,
.asset-texture > .content .generate-mipmaps-section {
    margin-left: 1.2em;
    display: none;
}
.asset-texture > .content ui-prop.warn {
    color: var(--color-warn-fill);
}
.asset-texture > .content > ui-prop.warn ui-select {
    border-color: var(--color-warn-fill);
}
.asset-texture > .content > .warn-words {
    display: none;
    margin-top: 4px;
    color: var(--color-warn-fill);
}
.asset-texture > .preview {
    position: relative;
    height: 200px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: var(--color-normal-fill-emphasis);
    border: 1px solid var(--color-normal-border-emphasis);
}
.asset-texture > .preview:hover {
    border-color: var(--color-warn-fill);
}
.filter-different {
    color: var(--color-warn-fill);
    display: none;
}
.filter-different .atlas-file-name span {
    cursor: pointer;
    text-decoration: underline;
}
`;

exports.$ = {
    container: '.asset-texture',
    anisotropyInput: '.anisotropy-input',
    filterModeSelect: '.filterMode-select',
    filterAdvancedSection: '.filter-advanced-section',
    minfilterSelect: '.minfilter-select',
    magfilterSelect: '.magfilter-select',
    generateMipmapsSection: '.generate-mipmaps-section',
    generateMipmapsCheckbox: '.generate-mipmaps-checkbox',
    mipfilterSelect: '.mipfilter-select',
    wrapModeProp: '.wrapMode-prop',
    wrapModeSelect: '.wrapMode-select',
    wrapAdvancedSection: '.wrap-advanced-section',
    wrapModeSProp: '.wrapModeS-prop',
    wrapModeSSelect: '.wrapModeS-select',
    wrapModeTProp: '.wrapModeT-prop',
    wrapModeTSelect: '.wrapModeT-select',
    warnWords: '.warn-words',
    filterDifferent: '.filter-different',
    atlasFileName: '.filter-different .atlas-file-name',
};

const ModeMap = {
    filter: {
        'Nearest (None)': {
            minfilter: 'nearest',
            magfilter: 'nearest',
            mipfilter: 'none',
        },
        Bilinear: {
            minfilter: 'linear',
            magfilter: 'linear',
            mipfilter: 'none',
        },
        'Bilinear with Mipmaps': {
            minfilter: 'linear',
            magfilter: 'linear',
            mipfilter: 'nearest',
        },
        'Trilinear with Mipmaps': {
            minfilter: 'linear',
            magfilter: 'linear',
            mipfilter: 'linear',
        },
    },
    wrap: {
        Repeat: {
            wrapModeS: 'repeat',
            wrapModeT: 'repeat',
        },
        Clamp: {
            wrapModeS: 'clamp-to-edge',
            wrapModeT: 'clamp-to-edge',
        },
        Mirror: {
            wrapModeS: 'mirrored-repeat',
            wrapModeT: 'mirrored-repeat',
        },
    },
};
exports.ModeMap = ModeMap;
const Elements = {
    anisotropy: {
        ready() {
            const panel = this;

            panel.$.anisotropyInput.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.anisotropy = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.anisotropyInput.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.anisotropyInput.value = panel.userData.anisotropy;

            panel.updateInvalid(panel.$.anisotropyInput, 'anisotropy');
            updateElementReadonly.call(panel, panel.$.anisotropyInput);
        },
    },
    filterMode: {
        ready() {
            const panel = this;

            panel.$.filterModeSelect.addEventListener('change', (event) => {
                // 根据 filterModeSelect 组合值同步相应的 min/mag/mip 到 userData
                const value = event.target.value;
                if (ModeMap.filter[value]) {
                    panel.userDataList.forEach((userData) => {
                        const data = ModeMap.filter[value];
                        for (const key of Object.keys(data)) {
                            userData[key] = data[key];
                        }
                    });
                    // 选择 filterMode 组合选项，不显示自定义项
                    panel.$.filterAdvancedSection.style.display = 'none';
                } else {
                    // 选择 advanced 显示自定义项
                    panel.$.filterAdvancedSection.style.display = 'block';
                }
                panel.dispatch('change');
            });

            panel.$.filterModeSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            // FilterMode 选项
            const types = Object.keys(ModeMap.filter).concat('Advanced');
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.filterModeSelect.innerHTML = optionsHtml;

            // 匹配 filterModeSelect 值，没有匹配到组合，则为自定义 Advanced
            let value = 'Advanced';
            for (const filterKey of Object.keys(ModeMap.filter)) {
                const filterItem = ModeMap.filter[filterKey];
                let flag = true;
                for (const key of Object.keys(filterItem)) {
                    if (panel.userData[key] !== filterItem[key]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    value = filterKey;
                    break;
                }
            }
            panel.$.filterModeSelect.value = value;

            // 更新时判断是否显示自定义项
            value === 'Advanced'
                ? (panel.$.filterAdvancedSection.style.display = 'block')
                : (panel.$.filterAdvancedSection.style.display = 'none');

            panel.updateInvalid(panel.$.filterModeSelect, 'filterMode');
            updateElementReadonly.call(panel, panel.$.filterModeSelect);
        },
    },
    minfilter: {
        ready() {
            const panel = this;

            panel.$.minfilterSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.minfilter = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.minfilterSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type.toUpperCase()}</option>`;
            });
            panel.$.minfilterSelect.innerHTML = optionsHtml;

            panel.$.minfilterSelect.value = panel.userData.minfilter || 'nearest';

            panel.updateInvalid(panel.$.minfilterSelect, 'minfilter');
            updateElementReadonly.call(panel, panel.$.minfilterSelect);
        },
    },
    magfilter: {
        ready() {
            const panel = this;

            panel.$.magfilterSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.magfilter = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.magfilterSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type.toUpperCase()}</option>`;
            });
            panel.$.magfilterSelect.innerHTML = optionsHtml;

            panel.$.magfilterSelect.value = panel.userData.magfilter || 'nearest';

            panel.updateInvalid(panel.$.magfilterSelect, 'magfilter');
            updateElementReadonly.call(panel, panel.$.magfilterSelect);
        },
    },
    generateMipmaps: {
        ready() {
            const panel = this;

            panel.$.generateMipmapsCheckbox.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    const value = event.target.value;
                    if (!value) {
                        // 没勾选 生成 mipmaps，不显示 mipfilter 选项
                        userData.mipfilter = 'none';
                        panel.$.generateMipmapsSection.style.display = 'none';
                    } else {
                        panel.$.generateMipmapsSection.style.display = 'block';
                        // 为空的话默认 nearest
                        if (panel.$.mipfilterSelect.value === 'none') {
                            panel.$.mipfilterSelect.value = 'nearest';
                            // TODO: 目前 ui-select 通过 .value 修改组件值后没有触发 change 事件，需要手动提交
                            panel.$.mipfilterSelect.dispatch('change');
                        }
                    }
                });
                panel.dispatch('change');
            });

            panel.$.generateMipmapsCheckbox.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            panel.$.generateMipmapsCheckbox.value = panel.userData.mipfilter ? panel.userData.mipfilter !== 'none' : false;

            // 更新时判断是否显示 mipfilter 选项
            panel.$.generateMipmapsCheckbox.value
                ? (panel.$.generateMipmapsSection.style.display = 'block')
                : (panel.$.generateMipmapsSection.style.display = 'none');

            panel.updateInvalid(panel.$.generateMipmapsCheckbox, 'generateMipmaps');
            updateElementReadonly.call(panel, panel.$.generateMipmapsCheckbox);
        },
    },
    mipfilter: {
        ready() {
            const panel = this;

            panel.$.mipfilterSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.mipfilter = event.target.value;
                });
                panel.dispatch('change');
            });

            panel.$.mipfilterSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type.toUpperCase()}</option>`;
            });
            panel.$.mipfilterSelect.innerHTML = optionsHtml;

            panel.$.mipfilterSelect.value = panel.userData.mipfilter || 'nearest';
            panel.metaList && panel.metaList.forEach((meta) => {
                Editor.Profile.setTemp('inspector', `${meta.uuid}.texture.mipfilter`, panel.userData.mipfilter);
            });
            panel.updateInvalid(panel.$.mipfilterSelect, 'mipfilter');
            updateElementReadonly.call(panel, panel.$.mipfilterSelect);
        },
    },
    wrapMode: {
        ready() {
            const panel = this;

            panel.$.wrapModeSelect.addEventListener('change', (event) => {
                // 根据 wrapModeSelect 组合值同步相应的 wrapModeS/wrapModeT 到 userData
                const value = event.target.value;
                // 临时记录用户的修改配置
                Editor.Profile.setTemp('inspector', `${this.meta.uuid}.texture.wrapMode`, value, 'default');
                if (ModeMap.wrap[value]) {
                    panel.userDataList.forEach((userData) => {
                        const data = ModeMap.wrap[value];
                        for (const key of Object.keys(data)) {
                            userData[key] = data[key];
                        }
                    });
                    panel.$.wrapAdvancedSection.style.display = 'none';
                } else {
                    // 选择 advanced 显示自定义项
                    panel.$.wrapAdvancedSection.style.display = 'block';
                }
                // 校验是否显示警告提示
                Elements.warnWords.update.call(panel);
                panel.dispatch('change');
            });

            panel.$.wrapModeSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            // WrapMode 选项
            const types = Object.keys(ModeMap.wrap).concat('Advanced');
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            panel.$.wrapModeSelect.innerHTML = optionsHtml;

            // 匹配 wrapModeSelect 值，没有匹配到组合，则为自定义 Advanced
            let value = 'Advanced';
            for (const wrapKey of Object.keys(ModeMap.wrap)) {
                const wrapItem = ModeMap.wrap[wrapKey];
                let flag = true;
                for (const key of Object.keys(wrapItem)) {
                    if (panel.userData[key] !== wrapItem[key]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    value = wrapKey;
                    break;
                }
            }
            panel.$.wrapModeSelect.value = value;

            // 更新时需要判断是否显示自定义项
            value === 'Advanced'
                ? (panel.$.wrapAdvancedSection.style.display = 'block')
                : (panel.$.wrapAdvancedSection.style.display = 'none');

            // 校验是否显示警告提示
            panel.updateInvalid(panel.$.wrapModeSelect, 'wrapMode');
            updateElementReadonly.call(panel, panel.$.wrapModeSelect);
        },
    },
    wrapModeS: {
        ready() {
            const panel = this;

            panel.$.wrapModeSSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.wrapModeS = event.target.value;
                });
                Elements.warnWords.update.call(panel);
                panel.dispatch('change');
            });

            panel.$.wrapModeSSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = {
                Repeat: 'repeat',
                Clamp: 'clamp-to-edge',
                Mirror: 'mirrored-repeat',
            };
            for (const type in types) {
                optionsHtml += `<option value="${types[type]}">${type}</option>`;
            }
            panel.$.wrapModeSSelect.innerHTML = optionsHtml;

            panel.$.wrapModeSSelect.value = panel.userData.wrapModeS || 'repeat';

            panel.updateInvalid(panel.$.wrapModeSSelect, 'wrapModeS');
            updateElementReadonly.call(panel, panel.$.wrapModeSSelect);
        },
    },
    wrapModeT: {
        ready() {
            const panel = this;

            panel.$.wrapModeTSelect.addEventListener('change', (event) => {
                panel.userDataList.forEach((userData) => {
                    userData.wrapModeT = event.target.value;
                });
                Elements.warnWords.update.call(panel);
                panel.dispatch('change');
            });

            panel.$.wrapModeTSelect.addEventListener('confirm', () => {
                panel.dispatch('snapshot');
            });
        },
        update() {
            const panel = this;

            let optionsHtml = '';
            const types = {
                Repeat: 'repeat',
                Clamp: 'clamp-to-edge',
                Mirror: 'mirrored-repeat',
            };
            for (const type in types) {
                optionsHtml += `<option value="${types[type]}">${type}</option>`;
            }
            panel.$.wrapModeTSelect.innerHTML = optionsHtml;

            panel.$.wrapModeTSelect.value = panel.userData.wrapModeT || 'repeat';

            panel.updateInvalid(panel.$.wrapModeTSelect, 'wrapModeT');
            updateElementReadonly.call(panel, panel.$.wrapModeTSelect);
        },
    },
    /**
     * Condition check: whether the width and height of the image is a power of 2
     * A warning message is required if the wrap mode value is repeat.
     */
    warnWords: {
        ready() {
            this.$.image = document.createElement('ui-image');

            this.$.image.$img.addEventListener('load', () => {
                Elements.warnWords.update.call(this);
            });
        },
        update() {
            const panel = this;

            this.$.image.value = panel.asset.uuid;

            let isUnlegalWrapModeT = false;
            let isUnlegalWrapModeS = false;

            if (panel.$.image.$img.src) {
                const { naturalWidth, naturalHeight } = panel.$.image.$img;
                const { wrapModeT, wrapModeS } = panel.userData;

                // Determine the power of 2 algorithm: (number & number - 1) === 0
                const isUnlegal = naturalWidth & (naturalWidth - 1) || naturalHeight & (naturalHeight - 1);

                isUnlegalWrapModeT = isUnlegal && wrapModeT === 'repeat';
                isUnlegalWrapModeS = isUnlegal && wrapModeS === 'repeat';
            }

            if (isUnlegalWrapModeT || isUnlegalWrapModeS) {
                this.$.warnWords.style.display = 'block';
                this.$.wrapModeSProp.classList.add('warn');
                this.$.wrapModeTProp.classList.add('warn');
                this.$.wrapModeProp.classList.add('warn');
            } else {
                this.$.warnWords.style.display = 'none';
                this.$.wrapModeSProp.classList.remove('warn');
                this.$.wrapModeTProp.classList.remove('warn');
                this.$.wrapModeProp.classList.remove('warn');
            }
        },
    },
    checkAtlasFileConfig: {
        async ready() {
            this.$.atlasFileName.addEventListener('click', () => {
                Editor.Message.send('assets', 'twinkle', this.$.atlasFileName.getAttribute('data-uuid'));
            }, false);
        },
        async update() {
            try {
                if (!Array.isArray(this.parentAssetList)) {
                    this.$.filterDifferent.style.display = 'none';
                    return;
                }
                const parentPath = this.parentAssetList[0].path.replace(/\/[^/]+$/, '/*');
                let assets = await Editor.Message.request(
                    'asset-db',
                    'query-assets',
                    { pattern: parentPath, ccType: "cc.Asset" }
                );
                assets = assets.filter(v => extname(v.file) === '.atlas');

                let matchedAsset;
                let matchedAtlasJson;
                for (const asset of assets) {
                    const json = await (new ParseAtlasFile()).parse(asset.file);

                    // the asset.displayName is not a full name, miss the extname
                    // so, we should use RegExp to get the extname
                    const regStr = `${this.asset.displayName}(.*?)/`;
                    const match = this.asset.url.match(new RegExp(regStr));
                    const imageExtname = match ? match[1] : '.png';
                    const imageFullName = this.asset.displayName + imageExtname;

                    if (json[imageFullName]) {
                        matchedAsset = asset;
                        matchedAtlasJson = json[imageFullName];
                        break;
                    }
                }
                if (matchedAsset) {

                    let atlasFileFilter = matchedAtlasJson.filter;
                    if (Array.isArray(atlasFileFilter)) {
                        atlasFileFilter = atlasFileFilter.join();
                    } else if (atlasFileFilter) {
                        atlasFileFilter = `${atlasFileFilter},${atlasFileFilter}`;
                    }
                    const userDataFilter = `${this.meta.userData.minfilter},${this.meta.userData.magfilter}`;

                    if (atlasFileFilter.toLowerCase() !== userDataFilter.toLowerCase()) {
                        this.$.filterDifferent.style.display = 'block';
                        const tipHtml = Editor.I18n.t('ENGINE.assets.texture.filterDiffenent').replace('{atlasFile}', `<span>${matchedAsset.name}</span>`);
                        this.$.atlasFileName.innerHTML = tipHtml;
                        this.$.atlasFileName.setAttribute('data-uuid', matchedAsset.uuid);
                    } else {
                        this.$.filterDifferent.style.display = 'none';
                    }
                }
            } catch (error) {
                this.$.filterDifferent.style.display = 'none';
                console.warn('parse atlas file error:', error);
            }
        },
    },
};

exports.Elements = Elements;

exports.methods = {
    /**
     * Update whether a data is editable in multi-select state
     * 多选时候，以选中的第一个作为标准，如果选中其中有一个数据不一致，则该选项无效，需要重新选择
     */
    updateInvalid(element, prop) {
        // filterMode、 wrapMode 和 generateMipmaps 需要拆解进行判断
        let invalid;
        switch (prop) {
            case 'filterMode':
                invalid = this.userDataList.some((userData) => {
                    for (const key of Object.keys(ModeMap.filter.Bilinear)) {
                        if (userData[key] !== this.userData[key]) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 'wrapMode':
                invalid = this.userDataList.some((userData) => {
                    for (const key of Object.keys(ModeMap.wrap.Repeat)) {
                        if (userData[key] !== this.userData[key]) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 'generateMipmaps':
                invalid = this.userDataList.some((userData) => {
                    return userData['mipfilter'] !== this.userData['mipfilter'];
                });
                break;
            default:
                invalid = this.userDataList.some((userData) => {
                    return userData[prop] !== this.userData[prop];
                });
                break;
        }
        element.invalid = invalid;
    },
};

exports.ready = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};
