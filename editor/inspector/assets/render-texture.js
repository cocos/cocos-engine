exports.template = `
<section class="asset-render-texture">
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
        return await Editor.Message.request('scene', 'query-render-texture', uuid);
    },
    async apply () {
        await Editor.Message.request('scene', 'apply-render-texture', this.asset.uuid, this.renderTexture);
    },

    async dataChange () {
        await Editor.Message.request('scene', 'change-render-texture', this.renderTexture);
        this.dispatch('change');
    },
};

exports.$ = {
    container: '.asset-render-texture',
};

exports.update = async function (assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.meta = this.metaList[0];
    this.asset = this.assetList[0];

    if (assetList.length !== 1) {
        this.$.container.innerText = '';
        return;
    }

    this.renderTexture = await this.query(this.asset.uuid);
    
    for (const key in this.renderTexture) {
        const dump = this.renderTexture[key];

        if (!dump.visible) {
            continue;
        }

        // 复用节点
        if (!this.$[key]) {
            this.$[key] = document.createElement('ui-prop');
            this.$[key].setAttribute('type', 'dump');
            this.$[key].addEventListener('change-dump', this.dataChange.bind(this));
        }

        this.$.container.appendChild(this.$[key]);
        this.updateReadonly(this.$[key]);
        this.$[key].render(dump);

    }
};
