exports.template = `
<section class="asset-erp-texture-cube">
    <div class="content">
        <ui-prop>
            <span slot="label">
                <ui-label
                    tooltip="i18n:ENGINE.assets.erpTextureCube.anisotropyTip"
                    value="i18n:ENGINE.assets.erpTextureCube.anisotropy"
                ></ui-label>
            </span>
            <ui-num-input slot="content"    
                id="anisotropy"
            ></ui-num-input>
        </ui-prop>
        <ui-prop>
            <span slot="label">
                <ui-label
                    tooltip="i18n:ENGINE.assets.erpTextureCube.faceSize.title"
                    value="i18n:ENGINE.assets.erpTextureCube.faceSize.name"
                ></ui-label>
            </span>
            <ui-num-input slot="content"    
                id="faceSize"
            ></ui-num-input>
        </ui-prop>
        <ui-prop>
            <span slot="label">
                <ui-label
                    tooltip="i18n:ENGINE.assets.erpTextureCube.minFilterTip"
                    value="i18n:ENGINE.assets.erpTextureCube.minFilter"
                ></ui-label>
            </span>
            <ui-select slot="content"
                id="minfilter"
            >
                <option value="nearest">nearest</option>
                <option value="linear">linear</option>
            </ui-select>
        </ui-prop>
        <ui-prop>
            <span slot="label">
                <ui-label
                    tooltip="i18n:ENGINE.assets.erpTextureCube.magFilterTip"
                    value="i18n:ENGINE.assets.erpTextureCube.magFilter"
                ></ui-label>
            </span>
            <ui-select slot="content"
                id="magfilter"
            >
                <option value="nearest">nearest</option>
                <option value="linear">linear</option>
            </ui-select>
        </ui-prop>
        <ui-prop>
            <span slot="label">
                <ui-label
                    tooltip="i18n:ENGINE.assets.erpTextureCube.mipFilterTip"
                    value="i18n:ENGINE.assets.erpTextureCube.mipFilter"
                ></ui-label>
            </span>
            <ui-select slot="content"
                id="mipfilter"
            >
                <option value="none">none</option>
                <option value="nearest">nearest</option>
                <option value="linear">linear</option>
            </ui-select>
        </ui-prop>
        <ui-prop>
            <span slot="label">
                <ui-label
                    tooltip="i18n:ENGINE.assets.erpTextureCube.wrapModeSTip"
                    value="i18n:ENGINE.assets.erpTextureCube.wrapModeS"
                ></ui-label>
            </span>
            <ui-select slot="content"
                id="wrapModeS"
            >
                <option value="repeat">repeat</option>
                <option value="clamp-to-edge">clamp-to-edge</option>
                <option value="mirrored-repeat">mirrored-repeat</option>
            </ui-select>
        </ui-prop>
        <ui-prop>
            <span slot="label">
                <ui-label
                    tooltip="i18n:ENGINE.assets.erpTextureCube.wrapModeTTip"
                    value="i18n:ENGINE.assets.erpTextureCube.wrapModeT"
                ></ui-label>
            </span>
            <ui-select slot="content"
                id="wrapModeT"
            >
                <option value="repeat">repeat</option>
                <option value="clamp-to-edge">clamp-to-edge</option>
                <option value="mirrored-repeat">mirrored-repeat</option>
            </ui-select>
        </ui-prop>
    </div>
</section>
`;

exports.style = `
.asset-erp-texture-cube  ui-prop{
    margin-top: 4px;
}
`;

exports.$ = {
    anisotropy: '#anisotropy',
    faceSize: '#faceSize',
    minfilter: '#minfilter',
    magfilter: '#magfilter',
    mipfilter: '#mipfilter',
    wrapModeS: '#wrapModeS',
    wrapModeT: '#wrapModeT',
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

const Elements = {
    anisotropy: {
        ready() {
            this.$.anisotropy.addEventListener('change', this.dataChange.bind(this, 'anisotropy'));
        },
        update() {
            this.$.anisotropy.value = this.meta.userData.anisotropy;
            this.updateInvalid(this.$.anisotropy, 'anisotropy');
            this.updateReadonly(this.$.anisotropy);
        },
    },
    faceSize: {
        ready() {
            this.$.faceSize.addEventListener('change', this.dataChange.bind(this, 'faceSize'));
        },
        update() {

            this.$.faceSize.value = this.meta.userData.faceSize;
            this.updateInvalid(this.$.faceSize, 'faceSize');
            this.updateReadonly(this.$.faceSize);
        },
    },
    minfilter: {
        ready() {
            this.$.minfilter.addEventListener('change', this.dataChange.bind(this, 'minfilter'));
        },
        update() {
            this.$.minfilter.value = this.meta.userData.minfilter;
            this.updateInvalid(this.$.minfilter, 'minfilter');
            this.updateReadonly(this.$.minfilter);
        },
    },
    magfilter: {
        ready() {
            this.$.magfilter.addEventListener('change', this.dataChange.bind(this, 'magfilter'));
        },
        update() {
            this.$.magfilter.value = this.meta.userData.magfilter;
            this.updateInvalid(this.$.magfilter, 'magfilter');
            this.updateReadonly(this.$.magfilter);
        },
    },
    mipfilter: {
        ready() {
            this.$.mipfilter.addEventListener('change', this.dataChange.bind(this, 'mipfilter'));
        },
        update() {
            this.$.mipfilter.value = this.meta.userData.mipfilter;
            this.updateInvalid(this.$.mipfilter, 'mipfilter');
            this.updateReadonly(this.$.mipfilter);
        },
    },
    wrapModeS: {
        ready() {
            this.$.wrapModeS.addEventListener('change', this.dataChange.bind(this, 'wrapModeS'));
        },
        update() {
            this.$.wrapModeS.value = this.meta.userData.wrapModeS;
            this.updateInvalid(this.$.wrapModeS, 'wrapModeS');
            this.updateReadonly(this.$.wrapModeS);
        },
    },
    wrapModeT: {
        ready() {
            this.$.wrapModeT.addEventListener('change', this.dataChange.bind(this, 'wrapModeT'));
        },
        update() {
            this.$.wrapModeT.value = this.meta.userData.wrapModeT;
            this.updateInvalid(this.$.wrapModeT, 'wrapModeT');
            this.updateReadonly(this.$.wrapModeT);
        },
    },

};

exports.methods = {
    updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
    },
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
    dataChange(key, event) {
        this.metaList.forEach((meta) => {
            meta.userData[key] = event.target.value || undefined;
        });

        this.dispatch('change');
    },
};
