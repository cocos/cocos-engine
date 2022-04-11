const { setDisabled, loopSetAssetDumpDataReadonly } = require('../utils/prop');

exports.template = `
<section class="asset-render-pipeline">
</section>
`;

exports.$ = {
    container: '.asset-render-pipeline',
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

exports.ready = function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};

exports.close = function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};

exports.methods = {
    record() {
        return JSON.stringify(this.pipeline);
    },
    async restore(record) {
        // TODO: renderPipeline 编辑机制需要重新优化，目前有点乱, undo 后的数据无法正确还原
        // record = JSON.parse(record);
        // if (!record || typeof record !== 'object') {
        //     return;
        // }

        // this.pipeline = await Editor.Message.request('scene', 'change-render-pipeline', record);

        // Elements.pipeline.update.call(this);

        // this.setDirtyData();
        // this.dispatch('change');
    },

    async query(uuid) {
        return await Editor.Message.request('scene', 'query-render-pipeline', uuid);
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-render-pipeline', this.asset.uuid, this.pipeline);
    },

    reset() {
        this.dirtyData.origin = this.dirtyData.realtime;
        this.dirtyData.uuid = '';
    },

    async change() {
        await Editor.Message.request('scene', 'change-render-pipeline', this.pipeline);

        this.setDirtyData();
        this.dispatch('change');
    },

    updateInterface() {
        for (const key in this.physicsMaterial) {
            const dump = this.physicsMaterial[key];

            if (!dump.visible) {
                continue;
            }

            // reuse
            if (!this.$[key]) {
                this.$[key] = document.createElement('ui-prop');
                this.$[key].setAttribute('type', 'dump');
                this.$[key].addEventListener('change-dump', this.change.bind(this));
            }

            this.$.container.appendChild(this.$[key]);
            this.updateReadonly(this.$[key]);
            this.$[key].render(dump);
        }
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
