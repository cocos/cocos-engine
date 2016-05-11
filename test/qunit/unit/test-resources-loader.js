(function () {

    module('load resources', {
        setup: function () {
            _resetGame();
            AssetLibrary.init({
                libraryPath: assetDir + '/library',
                rawAssetsBase: cc.path.dirname(cc.path._setEndWithSep(assetDir, false) + '.dummyExtForDirname') + '/',
                rawAssets: {
                    assets: {
                        '0000001': ['resources/grossini/grossini.png', cc.js._getClassId(cc.Texture2D)],
                        '123201':  ['resources/grossini/grossini', cc.js._getClassId(TestSprite), 1],
                        '0000000': ['resources/grossini.png', cc.js._getClassId(cc.Texture2D)],
                        '1232218': ['resources/grossini', cc.js._getClassId(TestSprite), 1],   // sprite in texture
                        '123200':  ['resources/grossini', cc.js._getClassId(TestSprite), 1],   // sprite in plist
                    }
                }
            });
            cc.loader.releaseAll();
        },
    });

    asyncTest('matching rules - 1', function () {
        cc.loader.loadRes('grossini', TestSprite, function (err, sprite) {
            ok(sprite._uuid === '1232218' || sprite._uuid === '123200', 'loadRes - checking uuid');

            cc.loader.loadResAll('grossini', TestSprite, function (err, array) {
                strictEqual(array.length, 3, 'loadResAll - checking count');
                ['123200', '1232218', '123201'].forEach(function (uuid) {
                    ok(array.some(function (item) {
                        return item._uuid === uuid;
                    }), 'loadResAll - checking uuid ' + uuid);
                });
                start();
            });
        });
    });

    asyncTest('load single', function () {
        //cc.loader.loadRes('grossini/grossini.png', function (err, texture) {
        //    ok(!texture, 'could not load texture with file extname');

            cc.loader.loadRes('grossini/grossini', function (err, texture) {
                ok(texture instanceof cc.Texture2D, 'should be able to load texture without file extname');
                clearTimeout(timeoutId);
                start();
            });
        //});

        var timeoutId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 5000);
    });

    asyncTest('load single by type', function () {
        cc.loader.loadRes('grossini', TestSprite, function (err, sprite) {
            ok(sprite instanceof TestSprite, 'should be able to load asset by type');

            cc.loader.loadRes('grossini', cc.Texture2D, function (err, texture) {
                ok(texture instanceof cc.Texture2D, 'should be able to load asset by type');
                clearTimeout(timeoutId);
                start();
            });
        });

        var timeoutId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 5000);
    });

    asyncTest('load main asset and sub asset by loadAll', function () {
        cc.loader.loadResAll('grossini', function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            ['123200', '1232218', '123201'].forEach(function (uuid) {
                ok(results.some(function (item) {
                    return item._uuid === uuid;
                }), 'checking uuid ' + uuid);
            });
            ['resources/grossini/grossini.png', 'resources/grossini.png',].forEach(function (url) {
                ok(results.some(function (item) {
                    return item.url && item.url.endsWith(url);
                }), 'checking url ' + url);
            });
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
