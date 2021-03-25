exports.template = `
<section class="asset-render-texture">
    <div id="content"></div>
</section>
`;

exports.methods = {
    async apply () {
        await Editor.Message.request('scene', 'apply-render-texture', this.assetInfo.uuid, this.renderTexture);
    },

    async onDataChanged () {
        this.renderTexture = await Editor.Message.request('scene', 'change-render-texture', this.renderTexture);
    },
};

exports.$ = {
    content: '#content',
};

exports.update = async function (assetList, metaList) {
    this.metas = metaList;
    this.meta = this.metas[0];
    this.assetInfo = assetList[0];
    this.renderTexture = await Editor.Message.request('scene', 'query-render-texture', this.assetInfo.uuid);
    const children = this.$.content.childNodes;

    let i = 0;
    for (const key in this.renderTexture) {
        const dump = this.renderTexture[key];
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
