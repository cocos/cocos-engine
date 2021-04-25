const { setDisabled, loopSetAssetDumpDataReadonly } = require('../utils/prop');

exports.template = `
<section class="asset-render-pipeline">
    <div class="header">
        <ui-prop>
            <ui-label slot="label">Pipelines</ui-label>
            <ui-select slot="content" class="pipelines-select"></ui-select>
        </ui-prop>
    </div>
    <div class="content">
    </div>
</section>
`;

exports.$ = {
    container: '.asset-render-pipeline',
    header: '.header',
    content: '.content',
    pipelinesSelect: '.pipelines-select',
};

exports.style = `
    .asset-render-pipeline > .header {
        padding-bottom: 8px;
        margin-bottom: 4px;
        border-bottom: 1px var(--color-normal-border) dashed;
    }
`;

const Elements = {
    pipelines: {
        ready() {
            const panel = this;

            panel.$.pipelinesSelect.addEventListener('change', async (event) => {
                panel.$.content.removeAttribute('hidden');

                panel.pipelineIndex = event.target.value;

                panel.pipeline = await Editor.Message.request('scene', 'select-render-pipeline', panel.pipelines[panel.pipelineIndex].name);
                Elements.pipeline.update.call(panel);

                panel.setDirtyData();
                panel.dispatch('change');
            });
        },
        async update() {
            const panel = this;

            let optionsHtml = '';
            panel.pipelines.forEach((pipeline, index) => {
                optionsHtml += `<option value="${index}">${pipeline.name}</option>`;
            });
            panel.$.pipelinesSelect.innerHTML = optionsHtml;

            panel.$.pipelinesSelect.value = panel.pipelines.findIndex((one) => one.name === panel.pipeline.name);

            setDisabled(panel.asset.readonly, panel.$.pipelinesSelect);
        },
    },
    pipeline: {
        async update() {
            const panel = this;

            this.$.content.innerText = '';

            if (panel.$.pipelinesSelect.value === '-1') {
                panel.$.content.setAttribute('hidden', '');
                return;
            } else {
                panel.$.content.removeAttribute('hidden');
            }

            for (const key in panel.pipeline.value) {
                const dump = panel.pipeline.value[key];
                if (panel.asset.readonly) {
                    loopSetAssetDumpDataReadonly(dump);
                }

                if (!dump.visible) {
                    continue;
                }

                const prop = document.createElement('ui-prop');
                this.$.content.appendChild(prop);

                prop.setAttribute('type', 'dump');
                prop.render(dump);
                prop.addEventListener('change-dump', this.dataChange.bind(this));
            }
        },
    },
};

exports.update = async function (assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.meta = this.metaList[0];
    this.asset = this.assetList[0];

    if (assetList.length !== 1) {
        this.$.container.setAttribute('hidden', '');
        return;
    } else {
        this.$.container.removeAttribute('hidden');
    }

    if (this.dirtyData.uuid !== this.asset.uuid) {
        this.dirtyData.uuid = this.asset.uuid;
        this.dirtyData.origin = '';
    }

    this.pipeline = await this.query(this.asset.uuid);
    this.pipelines = await Editor.Message.request('scene', 'query-all-render-pipelines');

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            await element.update.call(this);
        }
    }

    this.setDirtyData();
};

exports.ready = function () {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.close = function () {
    // Used to determine whether the material has been modified in isDirty()
    this.dirtyData = {
        uuid: '',
        origin: '',
        realtime: '',
    };
};

exports.methods = {
    async query(uuid) {
        return await Editor.Message.request('scene', 'query-render-pipeline', uuid);
    },

    async apply () {
        this.dirtyData.origin = this.dirtyData.realtime;
        await Editor.Message.request('scene', 'apply-render-pipeline', this.asset.uuid, this.pipeline);
    },

    async dataChange() {
        await Editor.Message.request('scene', 'change-render-pipeline', this.pipeline);
        this.setDirtyData();
        this.dispatch('change');
    },

    /**
     * Detection of data changes only determines the currently selected technique
     */
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
