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

            panel.$.pipelinesSelect.addEventListener('confirm', (event) => {
                panel.pipelineIndex = event.target.value;
            });
        },
        async update() {
            const panel = this;
            
            panel.pipelines = await Editor.Message.request('scene', 'query-all-render-pipelines');

            let optionsHtml = '';
            panel.pipelines.forEach((pipeline, index) => {
                optionsHtml += `<option value="${index}">${pipeline.name}</option>`;
            });
            panel.$.pipelinesSelect.innerHTML = optionsHtml;

            setDisabled(panel.asset.readonly, panel.$.pipelinesSelect);
        }
    },
    pipeline: {
        async update() {
            const panel = this;
            
            panel.pipeline = await panel.query(panel.asset.uuid);
            panel.$.pipelinesSelect.value = panel.pipelines.findIndex(one => one.name === panel.pipeline.name);

            this.$.content.innerText = '';

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
        }
    }
}

exports.update = async function (assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.meta = this.metaList[0];
    this.asset = this.assetList[0];

    if (assetList.length !== 1) {
        this.$.container.innerText = '';
        return;
    }

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            await element.update.call(this);
        }
    }
};

exports.ready = function () {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
}

exports.methods = {
    async query(uuid) {
        return await Editor.Message.request('scene', 'query-render-pipeline', uuid);

    },
    async apply () {
        await Editor.Message.request('scene', 'apply-render-pipeline', this.asset.uuid, this.pipeline);
    },

    async dataChange () {
        await Editor.Message.request('scene', 'change-render-pipeline', this.pipeline);
        this.dispatch('change');
    },
};
