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
exports.update = function (assetList, metaList) {
    // 支持多选时列表显示，限制显示条数
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
