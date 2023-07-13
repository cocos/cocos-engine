'use strict';

exports.template = /* html */`
<section class="asset-physics-material">
    <ui-label class="multiple-warn-tip" value="i18n:ENGINE.assets.multipleWarning"></ui-label>  
</section>
`;

exports.style = /* css */`
.asset-physics-material {
    padding-right: 4px;
}

.asset-physics-material[multiple-invalid] > *:not(.multiple-warn-tip) {
    display: none!important;
}

.asset-physics-material[multiple-invalid] > .multiple-warn-tip {
    display: block;
}

.asset-physics-material .multiple-warn-tip {
    display: none;
    text-align: center;
    color: var(--color-focus-contrast-weakest);
    margin-top: 8px;
}
`;

exports.$ = {
    container: '.asset-physics-material',
};

exports.methods = {
    record() {
        return JSON.stringify(this.queryData);
    },

    async restore(record) {
        record = JSON.parse(record);
        if (!record || typeof record !== 'object') {
            return false;
        }

        this.queryData = record;
        await this.change();
        return true;
    },

    async query(uuid) {
        return await Editor.Message.request('scene', 'query-physics-material', uuid);
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-physics-material', this.asset.uuid, this.queryData);
    },

    abort() {
        this.reset();
    },

    reset() {
        /**
         * reset 环节只需把 uuid 清空
         * 会重新进入 panel.update 周期，根据 uuid 为空的条件，把 this.dirtyData.origin 重新填充
         */
        this.dirtyData.uuid = '';
    },

    async change() {
        this.queryData = await Editor.Message.request('scene', 'change-physics-material', this.queryData);
        this.updateInterface();
        this.setDirtyData();
        this.dispatch('change');
    },

    snapshot() {
        this.dispatch('snapshot');
    },

    updateInterface() {
        for (const key in this.queryData) {
            const dump = this.queryData[key];

            if (!dump.visible) {
                continue;
            }

            // reuse
            if (!this.$[key]) {
                this.$[key] = document.createElement('ui-prop');
                this.$[key].setAttribute('type', 'dump');
                this.$.container.appendChild(this.$[key]);
            }

            if (this.asset.readonly) {
                dump.readonly = true;
            }

            this.$[key].render(dump);
        }
    },

    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify(this.queryData);

        if (!this.dirtyData.origin) {
            this.dirtyData.origin = this.dirtyData.realtime;
        }
    },

    isDirty() {
        const isDirty = this.dirtyData.origin !== this.dirtyData.realtime;
        return isDirty;
    },
};

exports.ready = function() {
    this.$.container.addEventListener('change-dump', () => {
        this.change();
    });
    this.$.container.addEventListener('confirm-dump', () => {
        this.snapshot();
    });

    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};

exports.update = async function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    if (assetList.length > 1) {
        this.$.container.setAttribute('multiple-invalid', '');
        return;
    } else {
        this.$.container.removeAttribute('multiple-invalid');
    }

    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
    }

    this.queryData = await this.query(this.asset.uuid);

    this.updateInterface();
    this.setDirtyData();
};

exports.close = function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};
