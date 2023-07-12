exports.template = `
<section class="asset-animation-graph-variant">
    <ui-prop>
        <ui-label slot="label" value="Animation Graph"></ui-label>
        <ui-asset slot="content" droppable="cc.animation.AnimationGraph" class="graph-asset"></ui-asset>
    </ui-prop>
    <ui-section class="clips" expand>
        <ui-label slot="header" value="Clip Overrides"></ui-label>
        <table class="table">
            <thead class="thead">
                <tr>
                    <td>Original</td>
                    <td>Override</td>
                </tr>
            </thead>
            <tbody class="tbody">
            </tbody>
        </table>
    </ui-section>
</section>
`;

exports.$ = {
    container: '.asset-animation-graph-variant',
    graphAsset: '.graph-asset',
    table: '.table',
    tbody: '.tbody',
};

exports.style = `
.asset-animation-graph-variant {
    padding-top: 4px;
    padding-right: 4px;
}

.asset-animation-graph-variant .clips {
    padding-top: 10px;
    padding-bottom: 10px;
}

.asset-animation-graph-variant .table {
    border-collapse: collapse;
    margin-left: -8px;
}

.asset-animation-graph-variant .thead td {
    text-align: center;
    width: 50%;
}

.asset-animation-graph-variant .tbody td {
    padding: 13px 5px 5px 5px;
}

.asset-animation-graph-variant .tbody ui-asset {
    width: 100%;
}
`;

exports.methods = {
    record() {
        return JSON.stringify(this.animationGraphVariant);
    },

    async restore(record) {
        record = JSON.parse(record);
        if (!record || typeof record !== 'object') {
            return false;
        }

        this.animationGraphVariant = record;
        await this.change();
        return true;
    },

    async query(uuid) {
        return await Editor.Message.request('scene', 'query-animation-graph-variant', uuid);
    },

    async apply() {
        this.reset();
        await Editor.Message.request('scene', 'apply-animation-graph-variant', this.asset.uuid, this.animationGraphVariant);
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
        this.animationGraphVariant = await Editor.Message.request('scene', 'change-animation-graph-variant', this.animationGraphVariant);

        this.updateInterface();
        this.setDirtyData();
        this.dispatch('change');
    },

    updateInterface() {
        this.$.graphAsset.value = this.animationGraphVariant.graphUuid;
        this.$.graphAsset.readonly = this.asset.readonly;

        const oldPropKeys = Object.keys(this.$props);
        const newPropKeys = Object.keys(this.animationGraphVariant.clips);

        for (const key in this.animationGraphVariant.clips) {
            // reuse
            if (!this.$props[key]) {
                this.$props[key] = document.createElement('tr');

                const originTd = document.createElement('td');
                this.$props[key].$origin = document.createElement('ui-asset');
                this.$props[key].$origin.setAttribute('disabled', '');
                this.$props[key].$origin.droppable = 'cc.AnimationClip';
                originTd.appendChild(this.$props[key].$origin);

                const overrideTd = document.createElement('td');
                this.$props[key].$override = document.createElement('ui-asset');
                this.$props[key].$override.droppable = 'cc.AnimationClip';
                this.$props[key].$override.addEventListener('confirm', (event) => {
                    this.animationGraphVariant.clips[key] = event.target.value;
                    this.change();
                });
                overrideTd.appendChild(this.$props[key].$override);

                this.$props[key].appendChild(originTd);
                this.$props[key].appendChild(overrideTd);
            }

            this.$.tbody.appendChild(this.$props[key]);

            this.$props[key].$origin.value = key;
            this.$props[key].$override.value = this.animationGraphVariant.clips[key];
            this.$props[key].$override.readonly = this.asset.readonly;
        }

        for (const key of oldPropKeys) {
            if (!newPropKeys.includes(key)) {
                const $prop = this.$props[key];
                if ($prop && $prop.parentElement) {
                    $prop.parentElement.removeChild($prop);
                }
            }
        }
    },

    /**
     * Detection of data changes only determines the currently selected technique
     */
    setDirtyData() {
        this.dirtyData.realtime = JSON.stringify(this.animationGraphVariant);

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

exports.ready = function() {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };

    this.$props = {};

    this.$.graphAsset.addEventListener('confirm', (event) => {
        this.animationGraphVariant.graphUuid = event.target.value;
        this.change();
    });
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

    this.animationGraphVariant = await this.query(this.asset.uuid);

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
