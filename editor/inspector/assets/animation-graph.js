'use strict';

const { updateElementReadonly } = require('../utils/assets');

exports.template = /* html */`
<section class="asset-animation-graph">
    <ui-button class="open" size="medium">
        <ui-label value="i18n:ENGINE.assets.animationGraph.edit"></ui-label>
    </ui-button>
    <ui-label class="multiple-warn-tip" value="i18n:ENGINE.assets.multipleWarning"></ui-label>
</section>
`;

exports.style = /* css */`
.asset-animation-graph {
   padding-top: 10px;
   text-align: center;
}

.asset-animation-graph[multiple-invalid] > *:not(.multiple-warn-tip) {
    display: none!important;
 }

 .asset-animation-graph[multiple-invalid] > .multiple-warn-tip {
    display: block;
 }

.asset-animation-graph .multiple-warn-tip {
    display: none;
    text-align: center;
    color: var(--color-focus-contrast-weakest);
    margin-top: 8px;
}
`;

exports.$ = {
    container: '.asset-animation-graph',
    button: '.open',
    tip: '.tip',
};

exports.ready = function() {
    this.$.button.addEventListener('click', () => {
        Editor.Message.request('asset-db', 'open-asset', this.asset.uuid);
    });
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.meta = this.metaList[0];
    this.asset = this.assetList[0];

    if (assetList.length > 1) {
        this.$.container.setAttribute('multiple-invalid', '');
        return;
    } else {
        this.$.container.removeAttribute('multiple-invalid');
    }

    updateElementReadonly.call(this, this.$.button);
};

