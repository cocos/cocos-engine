exports.template = `
<section>
    <div class="content"
        id="content"
    >
        <ui-prop is="asset" readonly>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.particle.spriteFrameTip"
                value="i18n:ENGINE.assets.particle.spriteFrame"
            ></ui-label>
            <ui-asset readonly
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

exports.ready = function() {
    // Note: Currently, the material of 2d particles cannot be changed, ui-asset readonly, so the following is not valid
    this.$.asset.addEventListener('confirm', this.onDataChanged.bind(this, 'spriteFrameUuid'));
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    this.$.asset.value = this.meta.userData.spriteFrameUuid;

    this.updateInvalid(this.$.asset, 'spriteFrameUuid');
    this.updateReadonly(this.$.asset);
};
exports.methods = {
    updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
    },

    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
    onDataChanged(key, event) {
        this.metaList.forEach((meta) => {
            meta.userData[key] = event.target.value;
        });

        this.dispatch('change');
    },
};
