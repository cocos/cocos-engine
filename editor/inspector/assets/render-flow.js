exports.template = `
<section class="asset-render-flow">
    <div id="content"></div>
</section>
`;
exports.$ = {
    content: '#content',
};
exports.methods = {
    async apply () {
        await Editor.Message.request('scene', 'apply-render-flow', this.assetInfo.uuid, this.renderFlow);
    },

    async onDataChanged () {
        this.renderFlow = await Editor.Message.request('scene', 'change-render-flow', this.renderFlow);
    },
};

exports.update = function (assetList, metaList) {
    this.metas = metaList;
    this.meta = this.metas[0];
    this.assetInfos = assetList;
    this.assetInfo = assetList[0];
    this.renderFlow = await Editor.Message.request('scene', 'query-render-flow', this.assetInfo.uuid);
    const children = this.$.content.childNodes;

    let i = 0;
    for (const key in this.renderFlow) {
        const dump = this.renderFlow[key];
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
