exports.template = `
<section class="asset-audio-clip">
</section>
`;
exports.style = `
.asset-audio-clip .audio {
    outline: none;
    width: 100%;
    height: 32px;
    margin-bottom: 16px;
}
`;
exports.$ = {
    constainer: '.asset-audio-clip',
};
exports.update = function(assetList, metaList) {
    // Support multi-select list display, limit the number of display
    let html = '';
    const maxShowNumber = 1000;

    assetList.forEach((asset, index) => {
        if (!asset.file || index > maxShowNumber) {
            return;
        }

        if (assetList.length > 1) {
            html += `<div>${asset.name}</div>`;
        }

        html += `<audio class="audio" controls="controls" src="${asset.file}"></audio>`;
    });

    this.$.constainer.innerHTML = html;
};
