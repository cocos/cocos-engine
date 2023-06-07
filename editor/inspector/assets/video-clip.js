'use strict';

exports.template = /* html */`
<section class="asset-video-clip">
</section>
`;

exports.style = /* css */`
.asset-video-clip {
    margin-top: 4px;
    margin-right: 4px;
}

.asset-video-clip .video {
    width: 100%;
    outline: none;
    width: 100%;
    margin-bottom: 4px;
}
`;

exports.$ = {
    container: '.asset-video-clip',
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

        html += `<video class="video" controls="controls" src="${asset.file}?v=${Date.now()}"></video>`;
    });

    this.$.container.innerHTML = html;
};
