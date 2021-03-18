const downloader = cc.assetManager.downloader;
const parser = cc.assetManager.parser;

function loadInnerAudioContext(url) {
    return new Promise((resolve, reject) => {
        const nativeAudio = ral.createInnerAudioContext();

        let timer = setTimeout(() => {
            clearEvent();
            resolve(nativeAudio);
        }, 8000);
        function clearEvent() {
            nativeAudio.offCanplay(success);
            nativeAudio.offError(fail);
        }
        function success() {
            clearEvent();
            clearTimeout(timer);
            resolve(nativeAudio);
        }
        function fail() {
            clearEvent();
            clearTimeout(timer);
            reject('failed to load innerAudioContext: ' + err);
        }
        nativeAudio.onCanplay(success);
        nativeAudio.onError(fail);
        nativeAudio.src = url;
    });
}
function downloadAudio(url, options, onComplete) {
    loadInnerAudioContext(url).then(nativeAudio => {
        onComplete(null, nativeAudio);
    }, err => {
        onComplete(new Error(err));
    });
}

parser.register({
    // Audio
    '.mp3': downloadAudio,
    '.ogg': downloadAudio,
    '.wav': downloadAudio,
    '.m4a': downloadAudio,
});

module.exports = {
    loadInnerAudioContext
};
