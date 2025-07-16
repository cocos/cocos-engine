'use strict';

const { updateElementReadonly } = require('../utils/assets');

exports.template = /* html */ `
<section class="asset-erp-texture-cube">
    <div class="content">
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.anisotropy" tooltip="i18n:ENGINE.assets.erpTextureCube.anisotropyTip"></ui-label>
            <ui-num-input slot="content" id="anisotropy"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.faceSize.name" tooltip="i18n:ENGINE.assets.erpTextureCube.faceSize.title"></ui-label>
            <ui-num-input slot="content" id="faceSize"></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.filterMode" tooltip="i18n:ENGINE.assets.erpTextureCube.filterModeTip"></ui-label>
            <ui-select slot="content" id="filterMode"></ui-select>
        </ui-prop>
        <section id="filterAdvancedSection">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.minFilter" tooltip="i18n:ENGINE.assets.erpTextureCube.minFilterTip"></ui-label>
                <ui-select slot="content" id="minfilter"></ui-select>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.magFilter" tooltip="i18n:ENGINE.assets.erpTextureCube.magFilterTip"></ui-label>
                <ui-select slot="content" id="magfilter"></ui-select>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.generateMipmaps" tooltip="i18n:ENGINE.assets.erpTextureCube.generateMipmapsTip"></ui-label>
                <ui-checkbox slot="content" id="generateMipmaps"></ui-checkbox>
            </ui-prop>
            <section id="generateMipmapsSection">
                <ui-prop>
                    <ui-label slot="label" tooltip="i18n:ENGINE.assets.erpTextureCube.mipFilterTip" value="i18n:ENGINE.assets.erpTextureCube.mipFilter"></ui-label>
                    <ui-select slot="content" id="mipfilter"></ui-select>
                </ui-prop>
            </section>
        </section>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.wrapMode" tooltip="i18n:ENGINE.assets.erpTextureCube.wrapModeTip"></ui-label>
            <ui-select slot="content" id="wrapMode"></ui-select>
        </ui-prop>
        <section id="wrapAdvancedSection">
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.wrapModeS" tooltip="i18n:ENGINE.assets.erpTextureCube.wrapModeSTip"></ui-label>
                <ui-select slot="content" id="wrapModeS"></ui-select>
            </ui-prop>
            <ui-prop>
                <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.wrapModeT" tooltip="i18n:ENGINE.assets.erpTextureCube.wrapModeTTip"></ui-label>
                <ui-select slot="content" id="wrapModeT"></ui-select>
            </ui-prop>
        </section>
        <ui-prop>
            <ui-label slot="label" value="i18n:ENGINE.assets.erpTextureCube.bakeReflectionConvolution" tooltip="i18n:ENGINE.assets.erpTextureCube.bakeReflectionConvolution"></ui-label>
            <ui-checkbox id="mipBakeMode" slot="content" value="false"></ui-checkbox>
        </ui-prop>
    </div>
</section>
`;

exports.style = /* css */`
.asset-erp-texture-cube ui-prop{
    margin-right: 4px;
}
.asset-erp-texture-cube #filterAdvancedSection,
.asset-erp-texture-cube #wrapAdvancedSection,
.asset-erp-texture-cube #generateMipmapsSection {
    margin-left: 1em;
    display: none;
}
`;

exports.$ = {
    anisotropy: '#anisotropy',
    faceSize: '#faceSize',
    filterMode: '#filterMode',
    filterAdvancedSection: '#filterAdvancedSection',
    minfilter: '#minfilter',
    magfilter: '#magfilter',
    generateMipmaps: '#generateMipmaps',
    generateMipmapsSection: '#generateMipmapsSection',
    mipfilter: '#mipfilter',
    wrapMode: '#wrapMode',
    wrapAdvancedSection: '#wrapAdvancedSection',
    wrapModeS: '#wrapModeS',
    wrapModeT: '#wrapModeT',
    mipBakeMode: '#mipBakeMode',
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

const Elements = {
    anisotropy: {
        ready() {
            this.$.anisotropy.addEventListener('change', this.change.bind(this, 'anisotropy'));
            this.$.anisotropy.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.anisotropy.value = this.meta.userData.anisotropy;
            this.updateInvalid(this.$.anisotropy, 'anisotropy');
            updateElementReadonly.call(this, this.$.anisotropy);
        },
    },
    faceSize: {
        ready() {
            this.$.faceSize.addEventListener('change', this.change.bind(this, 'faceSize'));
            this.$.faceSize.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.faceSize.value = this.meta.userData.faceSize;
            this.updateInvalid(this.$.faceSize, 'faceSize');
            updateElementReadonly.call(this, this.$.faceSize);
        },
    },
    filterMode: {
        ready() {
            this.$.filterMode.addEventListener('change', this.change.bind(this, 'filterMode'));
            this.$.filterMode.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            let optionsHtml = '';
            // FilterMode 选项
            const types = Object.keys(ModeMap.filter).concat('Advanced');
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            this.$.filterMode.innerHTML = optionsHtml;

            // 匹配 filterMode 值，没有匹配到组合，则为自定义 Advanced
            let value = 'Advanced';
            for (const filterKey of Object.keys(ModeMap.filter)) {
                const filterItem = ModeMap.filter[filterKey];
                let flag = true;
                for (const key of Object.keys(filterItem)) {
                    if (this.meta.userData[key] !== filterItem[key]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    value = filterKey;
                    break;
                }
            }
            this.$.filterMode.value = value;

            // 更新时需要判断是否显示自定义项
            value === 'Advanced'
                ? (this.$.filterAdvancedSection.style.display = 'block')
                : (this.$.filterAdvancedSection.style.display = 'none');

            this.updateInvalid(this.$.filterMode, 'filterMode');
            updateElementReadonly.call(this, this.$.filterMode);
        },
    },
    minfilter: {
        ready() {
            this.$.minfilter.addEventListener('change', this.change.bind(this, 'minfilter'));
            this.$.minfilter.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type.toUpperCase()}</option>`;
            });
            this.$.minfilter.innerHTML = optionsHtml;

            this.$.minfilter.value = this.meta.userData.minfilte || 'nearest';
            this.updateInvalid(this.$.minfilter, 'minfilter');
            updateElementReadonly.call(this, this.$.minfilter);
        },
    },
    magfilter: {
        ready() {
            this.$.magfilter.addEventListener('change', this.change.bind(this, 'magfilter'));
            this.$.magfilter.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type.toUpperCase()}</option>`;
            });
            this.$.magfilter.innerHTML = optionsHtml;

            this.$.magfilter.value = this.meta.userData.magfilter || 'nearest';
            this.updateInvalid(this.$.magfilter, 'magfilter');
            updateElementReadonly.call(this, this.$.magfilter);
        },
    },
    generateMipmaps: {
        ready() {
            this.$.generateMipmaps.addEventListener('change', this.change.bind(this, 'generateMipmaps'));
            this.$.generateMipmaps.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.generateMipmaps.value = this.meta.userData.mipfilter ? this.meta.userData.mipfilter !== 'none' : false;

            // 更新时判断是否显示 mipfilter 选项
            this.$.generateMipmaps.value
                ? (this.$.generateMipmapsSection.style.display = 'block')
                : (this.$.generateMipmapsSection.style.display = 'none');

            this.updateInvalid(this.$.generateMipmaps, 'generateMipmaps');
            updateElementReadonly.call(this, this.$.generateMipmaps);
        },
    },
    mipfilter: {
        ready() {
            this.$.mipfilter.addEventListener('change', this.change.bind(this, 'mipfilter'));
            this.$.mipfilter.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            let optionsHtml = '';
            const types = ['nearest', 'linear'];
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type.toUpperCase()}</option>`;
            });
            this.$.mipfilter.innerHTML = optionsHtml;

            this.$.mipfilter.value = this.meta.userData.mipfilter || 'nearest';
            this.metaList && this.metaList.forEach((meta) => {
                Editor.Profile.setTemp('inspector', `${meta.uuid}.texture.mipfilter`, this.meta.userData.mipfilter);
            });
            this.updateInvalid(this.$.mipfilter, 'mipfilter');
            updateElementReadonly.call(this, this.$.mipfilter);
        },
    },
    wrapMode: {
        ready() {
            this.$.wrapMode.addEventListener('change', this.change.bind(this, 'wrapMode'));
            this.$.wrapMode.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            let optionsHtml = '';
            // WrapMode 选项
            const types = Object.keys(ModeMap.wrap).concat('Advanced');
            types.forEach((type) => {
                optionsHtml += `<option value="${type}">${type}</option>`;
            });
            this.$.wrapMode.innerHTML = optionsHtml;

            // 匹配 wrapMode 值，没有匹配到组合，则为自定义 Advanced
            let value = 'Advanced';
            for (const wrapKey of Object.keys(ModeMap.wrap)) {
                const wrapItem = ModeMap.wrap[wrapKey];
                let flag = true;
                for (const key of Object.keys(wrapItem)) {
                    if (this.meta.userData[key] !== wrapItem[key]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    value = wrapKey;
                    break;
                }
            }
            this.$.wrapMode.value = value;

            // 更新时需要判断是否显示自定义项
            value === 'Advanced'
                ? (this.$.wrapAdvancedSection.style.display = 'block')
                : (this.$.wrapAdvancedSection.style.display = 'none');

            this.updateInvalid(this.$.wrapMode, 'wrapMode');
            updateElementReadonly.call(this, this.$.wrapMode);
        },
    },
    wrapModeS: {
        ready() {
            this.$.wrapModeS.addEventListener('change', this.change.bind(this, 'wrapModeS'));
            this.$.wrapModeS.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            let optionsHtml = '';
            const types = {
                Repeat: 'repeat',
                Clamp: 'clamp-to-edge',
                Mirror: 'mirrored-repeat',
            };
            for (const type in types) {
                optionsHtml += `<option value="${types[type]}">${type}</option>`;
            }
            this.$.wrapModeS.innerHTML = optionsHtml;

            this.$.wrapModeS.value = this.meta.userData.wrapModeS || 'repeat';
            this.updateInvalid(this.$.wrapModeS, 'wrapModeS');
            updateElementReadonly.call(this, this.$.wrapModeS);
        },
    },
    wrapModeT: {
        ready() {
            this.$.wrapModeT.addEventListener('change', this.change.bind(this, 'wrapModeT'));
            this.$.wrapModeT.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            let optionsHtml = '';
            const types = {
                Repeat: 'repeat',
                Clamp: 'clamp-to-edge',
                Mirror: 'mirrored-repeat',
            };
            for (const type in types) {
                optionsHtml += `<option value="${types[type]}">${type}</option>`;
            }
            this.$.wrapModeT.innerHTML = optionsHtml;

            this.$.wrapModeT.value = this.meta.userData.wrapModeT || 'repeat';
            this.updateInvalid(this.$.wrapModeT, 'wrapModeT');
            updateElementReadonly.call(this, this.$.wrapModeT);
        },
    },
    mipBakeMode: {
        ready() {
            this.$.mipBakeMode.addEventListener('change', this.change.bind(this, 'mipBakeMode'));
            this.$.mipBakeMode.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.mipBakeMode.value = this.meta.userData.mipBakeMode === 2 ? true : false;
            this.updateInvalid(this.$.mipBakeMode, 'mipBakeMode');
            updateElementReadonly.call(this, this.$.mipBakeMode);
        },
    },
};

exports.methods = {
    updateInvalid(element, prop) {
        let invalid;
        // filterMode、 wrapMode 和 generateMipmaps 需要拆解进行判断
        switch (prop) {
            case 'filterMode':
                invalid = this.metaList.some((meta) => {
                    for (const key of Object.keys(ModeMap.filter.Bilinear)) {
                        if (meta.userData[key] !== this.meta.userData[key]) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 'wrapMode':
                invalid = this.metaList.some((meta) => {
                    for (const key of Object.keys(ModeMap.wrap.Repeat)) {
                        if (meta.userData[key] !== this.meta.userData[key]) {
                            return true;
                        }
                    }
                    return false;
                });
                break;
            case 'generateMipmaps':
                invalid = this.metaList.some((meta) => {
                    return meta.userData['mipfilter'] !== this.meta.userData['mipfilter'];
                });
                break;
            default:
                invalid = this.metaList.some((meta) => {
                    return meta.userData[prop] !== this.meta.userData[prop];
                });
                break;
        }
        element.invalid = invalid;
    },
    change(key, event) {
        let value = event.target.value;
        if (key === 'mipBakeMode') {
            value = event.target.value ? 2 : 1;
        }
        this.metaList.forEach((meta) => {
            if (key === 'filterMode') {
                if (ModeMap.filter[value]) {
                    const data = ModeMap.filter[value];
                    for (const key of Object.keys(data)) {
                        meta.userData[key] = data[key];
                    }
                    this.$.filterAdvancedSection.style.display = 'none';
                } else {
                    // 选择 advanced 显示自定义项
                    this.$.filterAdvancedSection.style.display = 'block';
                }
            } else if (key === 'generateMipmaps') {
                if (!value) {
                    // 没勾选 生成 mipmaps，不显示 mipfilter 选项
                    meta.userData.mipfilter = 'none';
                    this.$.generateMipmapsSection.style.display = 'none';
                } else {
                    this.$.generateMipmapsSection.style.display = 'block';
                    if (this.$.mipfilter.value === 'none') {
                        this.$.mipfilter.value = 'nearest';
                        // TODO: 目前 ui-select 通过 .value 修改组件值后没有触发 change 事件，需要手动提交
                        this.$.mipfilter.dispatch('change');
                    }
                }
            } else if (key === 'wrapMode') {
                if (ModeMap.wrap[value]) {
                    const data = ModeMap.wrap[value];
                    for (const key of Object.keys(data)) {
                        meta.userData[key] = data[key];
                    }
                    this.$.wrapAdvancedSection.style.display = 'none';
                } else {
                    // 选择 advanced 需要显示自定义项
                    this.$.wrapAdvancedSection.style.display = 'block';
                }
            } else {
                meta.userData[key] = value || undefined;
            }
        });

        this.dispatch('change');
    },
};

exports.ready = function() {
    for (const key in Elements) {
        if (typeof Elements[key].ready === 'function') {
            Elements[key].ready.call(this);
        }
    }
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const key in Elements) {
        if (typeof Elements[key].update === 'function') {
            Elements[key].update.call(this);
        }
    }
};
