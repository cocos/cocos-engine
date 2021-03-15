exports.template = `
<section class="asset-audioclip">
    <div class="content">
      <audio class="audio" controls="controls"
        id="audio"
      ></audio>
    </div>
</section>
`;
exports.style = `
:host > .asset-audioclip > .content > .audio {
    outline: none;
    width: 100%;
    height: 40px;
}
`;
exports.$ = {
    audio: '#audio',
};
exports.ready = function () {
    this.audio = this.$.audio;
};
exports.update = function (assetList, metaList) {
    this.info = assetList[0];
    this.audio.setAttribute('src', this.info.file);
    this.audio.hidden = !(this.info && this.info.file);
};
