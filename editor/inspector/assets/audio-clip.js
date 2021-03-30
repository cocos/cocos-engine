exports.template = `
<section class="asset-audioclip">
</section>
`;
exports.style = `
.asset-audioclip .audio {
    outline: none;
    width: 100%;
    height: 32px;
    margin-bottom: 16px;
}
`;
exports.$ = {
    constainer: '.asset-audioclip',
};
exports.update = function (assetList, metaList) {
    // 支持多选时列表显示，限制显示条数
    let html = '';
    const maxShowNumber = 5000;

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
