exports.template = `
<section class="asset-video-clip">
</section>
`;

exports.style = `
.asset-video-clip .video {
    width: 100%;
    outline: none;
    width: 100%;
    margin-bottom: 16px;
}
`;

exports.$ = {
    constainer: '.asset-video-clip',
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

        html += `<video class="video" controls="controls" src="${asset.file}"></video>`;
    });

    this.$.constainer.innerHTML = html;
};
