exports.template = `
<section class="asset-physics-material">
    <div class="content">
        <div id="content"></div>
    </div>
</section>
`;

exports.methods = {
    /**
     * this function will call after commit apply success
     */
    async apply () {
        await Editor.Message.request('scene', 'apply-physics-material', this.assetInfo.uuid, this.PhysicsMaterial);
    },
    /**
     * call this function when inspector's data change
     */
    async onDataChanged () {
        this.PhysicsMaterial = await Editor.Message.request('scene', 'change-physics-material', this.PhysicsMaterial);
        this.dispatch('change');
    },
};
exports.$ = {
    content: '#content',
};

exports.update = async function (assetList, metaList) {
    this.metas = metaList;
    this.meta = this.metas[0];
    this.assetInfo = assetList[0];
    this.readonly = this.assetInfo.readyonly;
    this.PhysicsMaterial = await Editor.Message.request('scene', 'query-physics-material', this.assetInfo.uuid);
    this.$.content.hidden = this.metas.length !== 1;
    if (this.$.content.hidden) {
        return;
    }
    const children = this.$.content.childNodes;
    let i = 0;
    for (const key in this.PhysicsMaterial) {
        const dump = this.PhysicsMaterial[key];
        if (!dump.visible) {
            continue;
        }
        let node = children[i];
        if (!node) {
            node = document.createElement('ui-prop');
            this.$.content.appendChild(node);
            node.addEventListener('change-dump', this.onDataChanged.bind(this));
            node.setAttribute('type', 'dump');
        }
        node.render(dump);
        i++;
    }
    for (let index = children.length - 1; index > i - 1; index--) {
        const element = children[index];
        element.remove();
    }
};
