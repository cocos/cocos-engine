exports.template = `
<section class="asset-physics-material">
</section>
`;

exports.methods = {
    record() {
        return JSON.stringify(this.physicsMaterial);
    },

    async restore(record) {
        record = JSON.parse(record);
        if (!record || typeof record !== 'object') {
            return false;
        }

        this.physicsMaterial = record;
        await this.change({ snapshot: false });
        return true;
    },

    async query(uuid) {
        return await Editor.Message.request('scene', 'query-physics-material', uuid);
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-physics-material', this.asset.uuid, this.physicsMaterial);
    },

    reset() {
        /**
         * reset 环节只需把 uuid 清空
         * 会重新进入 panel.update 周期，根据 uuid 为空的条件，把 this.dirtyData.origin 重新填充
         */
        this.dirtyData.uuid = '';
    },

    async change(state) {
        this.physicsMaterial = await Editor.Message.request('scene', 'change-physics-material', this.physicsMaterial);

        this.updateInterface();
        this.setDirtyData();
        this.dispatch('change', state);
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
                this.$.container.appendChild(this.$[key]);
            }

            this.$[key].render(dump);
            this.updateReadonly(this.$[key]);
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
        this.dirtyData.realtime = JSON.stringify(this.physicsMaterial);

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
    container: '.asset-physics-material',
};

exports.ready = function() {
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

    if (assetList.length !== 1) {
        this.$.container.innerText = Editor.I18n.t('ENGINE.assets.multipleWarning');
        return;
    }

    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
    }

    this.physicsMaterial = await this.query(this.asset.uuid);

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
