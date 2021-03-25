exports.style = `
.asset-video-clip .video {
    width: 100%;
    outline: none;
}
`;

exports.template = `
<section class="asset-video-clip">
    <div class="content">
        <video class="video" controls="controls"
        id="video"        
        ></video>
    </div>
</section>
`;
exports.$ = {
    video: '#video',
};
exports.update = function (assetList, metaList) {
    this.metas = metaList;
    this.meta = metaList[0];
    this.assetInfo = assetList[0];
    this.assetInfos = assetList;
    this.$.video.src = this.assetInfo.file;
};
