'use strict';

exports.template = /* html */`
<section class="asset-render-pipeline">
    <ui-prop class="dump-prop" type="dump"></ui-prop>
    <ui-label class="multiple-warn-tip" value="i18n:ENGINE.assets.multipleWarning"></ui-label>  
</section>
`;

exports.style = /* css */`
.asset-render-pipeline {
    padding-right: 4px;
}

.asset-render-pipeline[multiple-invalid] > *:not(.multiple-warn-tip) {
    display: none!important;
}

 .asset-render-pipeline[multiple-invalid] > .multiple-warn-tip {
    display: block;
}

.asset-render-pipeline .multiple-warn-tip {
    display: none;
    text-align: center;
    color: var(--color-focus-contrast-weakest);
    margin-top: 8px;
}
`;

exports.$ = {
    container: '.asset-render-pipeline',
    prop: '.dump-prop',
};

exports.methods = {
    record() {
        return JSON.stringify(this.pipeline);
    },

    async restore(record) {
        record = JSON.parse(record);
        if (!record || typeof record !== 'object') {
            return false;
        }

        this.pipeline = record;
        await this.change();

        return true;
    },

    async query(uuid) {
        return await Editor.Message.request('scene', 'query-render-pipeline', uuid);
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-render-pipeline', this.asset.uuid, this.pipeline);
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
        this.pipeline = await Editor.Message.request('scene', 'change-render-pipeline', this.pipeline);

        this.updateInterface();
        this.setDirtyData();
        this.dispatch('change');
    },

    snapshot() {
        this.dispatch('snapshot');
    },

    updateInterface() {
        this.LoopUpdateReadonly(this.pipeline);
        this.$.prop.render(this.pipeline);
    },

    LoopUpdateReadonly(obj) {
        if (this.asset.readonly) {
            if (obj && 'readonly' in obj && 'value' in obj) {
                obj.readonly = true;

                if (typeof obj.value === 'object') {
                    for (const key in obj.value) {
                        this.LoopUpdateReadonly(obj.value[key]);
                    }
                }
            }
        }
    },

    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify(this.pipeline);

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
    this.$.container.addEventListener('change-dump', this.change.bind(this));
    this.$.container.addEventListener('confirm-dump', this.snapshot.bind(this));

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
    this.meta = this.metaList[0];
    this.asset = this.assetList[0];

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

    this.pipeline = await this.query(this.asset.uuid);

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
