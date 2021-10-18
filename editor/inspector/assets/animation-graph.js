exports.template = `
<section class="asset-animation-graph">
    <ui-button class="open">
        <ui-label value="i18n:ENGINE.assets.animationGraph.edit"></ui-label>
    </ui-button>
    <ui-label class="tip" value="i18n:ENGINE.assets.multipleWarning"></ui-label>
</section>
`;

exports.style = `
.asset-animation-graph {
   padding-top: 10px;
   text-align: center;
}

.asset-animation-graph .tip {
    color: var(--color-focus-contrast-weakest);
}
`;

exports.$ = {
    constainer: '.asset-animation-graph',
    button: '.open',
    tip: '.tip',
};

exports.ready = function() {
    this.$.button.addEventListener('click', async () => {
        await Editor.Message.request('scene', 'execute-scene-script', {
            name: 'animation-graph',
            method: 'edit',
            args: [this.asset.uuid],
        });

        Editor.Panel.open('animation-graph');
    });
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.meta = this.metaList[0];
    this.asset = this.assetList[0];

    if (assetList.length !== 1) {
        this.$.button.disabled = true;
        this.$.tip.style.display = 'block';
    } else {
        this.$.button.disabled = false;
        this.$.tip.style.display = 'none';
    }
};

