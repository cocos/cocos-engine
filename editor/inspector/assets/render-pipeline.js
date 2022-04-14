exports.template = `
<ui-prop type="dump" class="asset-render-pipeline">
</ui-prop>
`;

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
        await this.change({ snapshot: false });

        return true;
    },

    async query(uuid) {
        return await Editor.Message.request('scene', 'query-render-pipeline', uuid);
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-render-pipeline', this.asset.uuid, this.pipeline);
    },

    reset() {
        /**
         * reset 环节只需把 uuid 清空
         * 会重新进入 panel.update 周期，根据 uuid 为空的条件，把 this.dirtyData.origin 重新填充
         */
        this.dirtyData.uuid = '';
    },

    async change(state) {
        this.pipeline = await Editor.Message.request('scene', 'change-render-pipeline', this.pipeline);

        this.updateInterface();
        this.setDirtyData();
        this.dispatch('change', state);
    },

    updateInterface() {
        this.$.container.render(this.pipeline);
        this.updateReadonly(this.$.container);
    },

    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },

    /**
     * Detection of data changes only determines the currently selected technique
     */
    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify(this.pipeline);

        if (!this.dirtyData.origin) {
            this.dirtyData.origin = this.dirtyData.realtime;

            this.dispatch('snapshot');
        }
    },

    isDirty() {
        const isDirty = this.dirtyData.origin !== this.dirtyData.realtime;
        return isDirty;
    },
};

exports.$ = {
    container: '.asset-render-pipeline',
};

exports.ready = function() {
    this.$.container.addEventListener('change-dump', this.change.bind(this));

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

    if (assetList.length !== 1) {
        this.$.container.innerText = Editor.I18n.t('ENGINE.assets.multipleWarning');
        return;
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

