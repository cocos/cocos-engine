exports.template = `
<section>
    <div class="content"
        id="content"
    >
        <ui-prop asset>
            <ui-label slot="label" tooltip="i18n:ENGINE.assets.particle.spriteFrameTip"> SpriteFrame </ui-label>
            <ui-asset
                id="asset"
                slot="content" 
                droppable="cc.SpriteFrame" 
            ></ui-asset>
        </ui-prop>
    </div> 
</section>
`;

exports.$ = {
    content: '#content',
    asset: '#asset',
};
exports.ready = function () {
    this.$.asset.addEventListener('change', this._onDataChanged.bind(this, 'spriteFrameUuid'));
};

exports.update = function (assetList, metaList) {
    this.metas = metaList;
    this.meta = this.metas[0];
    this.$.content.hidden = this.metas.length !== 1;
    this.$.asset.value = this.meta.userData.spriteFrameUuid;
};
exports.methods = {
    _onDataChanged (key, event) {
        this.metas.forEach((meta) => {
            meta.userData[key] = event.target.value;
        });
        this.dispatch('change');
    },
};
