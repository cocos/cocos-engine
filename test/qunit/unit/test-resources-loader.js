(function () {

    module('load resources', {
        setup: function () {
            _resetGame();
            AssetLibrary.init({
                libraryPath: assetDir + '/library',
                rawAssetsBase: cc.path.dirname(cc.path._setEndWithSep(assetDir, false) + '.dummyExtForDirname') + '/',
                rawAssets: {
                    assets: {
                        '748321': ['resources/grossini.png', cc.js._getClassId(cc.Texture2D)],
                        '1232218': ['resources/grossini.png/grossini', cc.js._getClassId(TestSprite)]
                    }
                }
            });
            cc.loader.releaseAll();
        },
    });

    asyncTest('load single', function () {
        cc.loader.loadRes('grossini.png', function (err, texture) {
            ok(texture instanceof cc.Texture2D, 'should be able to load texture with file extname');
            clearTimeout(timeoutId);
            start();
        });

        var timeoutId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 5000);
    });

    asyncTest('load single by type', function () {
        cc.loader.loadRes('grossini', TestSprite, function (err, sprite) {
            ok(sprite instanceof TestSprite, 'should be able to load asset by type');
            clearTimeout(timeoutId);
            start();
        });

        var timeoutId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 5000);
    });

    asyncTest('load main asset and sub asset by loadAll', function () {
        cc.loader.loadResAll('grossini.png', function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var texture = results[0] instanceof cc.Texture2D ? results[0] : results[1];
            var sprite = results[0] instanceof TestSprite ? results[0] : results[1];
            ok(texture instanceof cc.Texture2D, 'should be able to load texture');
            ok(sprite instanceof TestSprite, 'should be able to load test sprite');

            clearTimeout(timeoutId);
            start();
        });

        var timeoutId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 5000);
    });

    asyncTest('loadResAll by type', function () {
        cc.loader.loadResAll('grossini', TestSprite, function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var sprite = results[0];
            ok(sprite instanceof TestSprite, 'should be able to load test sprite');

            clearTimeout(timeoutId);
            start();
        });

        var timeoutId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 5000);
    });
})();
