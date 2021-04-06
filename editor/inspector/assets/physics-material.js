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
        await Editor.Message.request('scene', 'apply-physics-material', this.asset.uuid, this.physicsMaterial);
    },
    async dataChange() {
        await Editor.Message.request('scene', 'change-physics-material', this.physicsMaterial);
        this.dispatch('change');
    },
};
exports.$ = {
    container: '.asset-physics-material',
};

exports.update = async function (assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    if (assetList.length !== 1) {
        this.$.container.innerText = '';
        return;
    }

    this.physicsMaterial = await this.query(this.asset.uuid);

    for (const key in this.physicsMaterial) {
        const dump = this.physicsMaterial[key];

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
