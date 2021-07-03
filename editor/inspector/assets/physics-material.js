exports.template = `
<section class="asset-physics-material">
</section>
`;

exports.methods = {
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
    async query(uuid) {
        return await Editor.Message.request('scene', 'query-physics-material', uuid);
    },
    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-physics-material', this.asset.uuid, this.physicsMaterial);
    },
    reset() {
        this.dirtyData.origin = this.dirtyData.realtime;
        this.dirtyData.uuid = '';
    },
    async dataChange() {
        await Editor.Message.request('scene', 'change-physics-material', this.physicsMaterial);
        this.setDirtyData();
        this.dispatch('change');
    },

    /**
     * Detection of data changes only determines the currently selected technique
     */
    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify(this.physicsMaterial);

        if (!this.dirtyData.origin) {
            this.dirtyData.origin = this.dirtyData.realtime;
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
        this.$.container.innerText = '';
        return;
    }

    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
    }

    this.physicsMaterial = await this.query(this.asset.uuid);

    for (const key in this.physicsMaterial) {
        const dump = this.physicsMaterial[key];

        if (!dump.visible) {
            continue;
        }

        // reuse
        if (!this.$[key]) {
            this.$[key] = document.createElement('ui-prop');
            this.$[key].setAttribute('type', 'dump');
            this.$[key].addEventListener('change-dump', this.dataChange.bind(this));
        }

        this.$.container.appendChild(this.$[key]);
        this.updateReadonly(this.$[key]);
        this.$[key].render(dump);
    }

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
