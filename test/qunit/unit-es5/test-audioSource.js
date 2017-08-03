if (!isPhantomJS) {
    largeModule('AudioScource');

    asyncTest('basic test', function () {
        var node = new cc.Node();
        cc.director.getScene().addChild(node);

        var audioSource = node.addComponent(cc.AudioSource);

        audioSource.clip = assetDir + "/background.mp3";

        audioSource.play();

        audioSource.audio.on('load', function () {
            clearTimeout(timerId);
            strictEqual(audioSource.isPlaying, true, 'audio scource play state true after preload');
            start();
        });

        var timerId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 10000);

        //audioSource.volume = 0.5;
        //strictEqual(audioSource.audio.volume, 0.5, 'audio scource volume true');

        //audioSource.loop = true;
        //strictEqual(audioSource.audio.loop, true, 'audio scource loop true');

        //audioSource.mute = true;
        //strictEqual(audioSource.audio.volume, 0, 'audio scource mute true');
    });
}
