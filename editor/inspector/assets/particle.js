'use strict';

exports.template = /* html */`
<section class="asset-particle">
    <div class="content"
        id="content"
    >
        <ui-prop ui="asset">
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.particle.spriteFrameTip"
                value="i18n:ENGINE.assets.particle.spriteFrame"
            ></ui-label>
            <ui-asset disabled
                id="asset"
                slot="content" 
                droppable="cc.SpriteFrame" 
            ></ui-asset>
        </ui-prop>
    </div> 
    <ui-label class="multiple-warn-tip" value="i18n:ENGINE.assets.multipleWarning"></ui-label>
</section>
`;

exports.style = /* css */`
.asset-particle[multiple-invalid] > *:not(.multiple-warn-tip) {
    display: none!important;
 }

 .asset-particle[multiple-invalid] > .multiple-warn-tip {
    display: block;
 }

.asset-particle .multiple-warn-tip {
    display: none;
    text-align: center;
    color: var(--color-focus-contrast-weakest);
    margin-top: 8px;
}
`;

exports.$ = {
    container: '.asset-particle',
    content: '#content',
    asset: '#asset',
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    if (assetList.length > 1) {
        this.$.container.setAttribute('multiple-invalid', '');
        return;
    } else {
        this.$.container.removeAttribute('multiple-invalid');
    }

    this.$.asset.value = this.meta.userData.spriteFrameUuid;
};
