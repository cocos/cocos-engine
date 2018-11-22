if (!isPhantomJS) {
    var libPath = assetDir + '/library';
    largeModule('AudioScource', {
        setup: function () {
            _resetGame();
            AssetLibrary.init({libraryPath: libPath});
        }
    });

    var AUDIO_UUID = '1258a1';

    asyncTest('basic test', function () {
        AssetLibrary.loadAsset(AUDIO_UUID, function (err, clip) {
            var node = new cc.Node();
            cc.director.getScene().addChild(node);

            var audioSource = node.addComponent(cc.AudioSource);
            audioSource.clip = clip;

            audioSource.play();
            strictEqual(audioSource.isPlaying, true, 'audio scource play state true after play');

            audioSource.volume = 0.5;
            strictEqual(audioSource.audio._volume, 0.5, 'audio scource volume after play');

            audioSource.loop = true;
            strictEqual(audioSource.audio._loop, true, 'audio scource loop after play');

            audioSource.mute = true;
            strictEqual(audioSource.audio._volume, 0, 'audio scource volume after mute');

            start();
        });
    });
}
