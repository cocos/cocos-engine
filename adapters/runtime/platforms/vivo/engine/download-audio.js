const downloader = cc.assetManager.downloader;
const parser = cc.assetManager.parser;

function loadInnerAudioContext (url) {
    return new Promise((resolve, reject) => {
        console.error('pptest1', url)
        const nativeAudio = qg.createInnerAudioContext();
        console.error('pptest2')
        
        let timer = setTimeout(() => {
            console.error('pptest3')
            clearEvent();
            resolve(nativeAudio);
        }, 8000);
        function clearEvent () {
            nativeAudio.offCanplay(success);
            nativeAudio.offError(fail);
        }
        function success () {
            console.error('pptest4')
            clearEvent();
            clearTimeout(timer);
            resolve(nativeAudio);
        }
        function fail () {
            console.error('pptest5')
            clearEvent();
            clearTimeout(timer);
            reject('failed to load innerAudioContext: ' + err);
        }
        console.error('pptest6')
        nativeAudio.onCanplay(success);
        nativeAudio.onError(fail);
        console.error('pptest7')
        nativeAudio.src = url;
    });
}
function downloadAudio (url, options, onComplete) {
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
