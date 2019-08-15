(function () {

    var Assets;

    module('load resources', {
        setup: function () {
            _resetGame();
            Assets = {
                '0000001': ['grossini/grossini', cc.js._getClassId(cc.Texture2D)],
                '123201':  ['grossini/grossini', cc.js._getClassId(TestSprite), 1],
                '0000000': ['grossini', cc.js._getClassId(cc.Texture2D)],
                '1232218': ['grossini', cc.js._getClassId(TestSprite), 1],   // sprite in texture
                '123200':  ['grossini', cc.js._getClassId(TestSprite), 1],   // sprite in plist
            };
            var options = {
                libraryPath: assetDir + '/library',
                rawAssetsBase: cc.path.dirname(cc.path.stripSep(assetDir) + '.dummyExtForDirname') + '/',
                rawAssets: {
                    assets: Assets
                }
            };
            AssetLibrary.init(options);
            cc.loader.releaseAll();
        },
    });

    asyncTest('matching rules - 1', function () {
        cc.loader.loadRes('grossini', TestSprite, function (err, sprite) {
            ok(sprite._uuid === '1232218' || sprite._uuid === '123200', 'loadRes - checking uuid');

            cc.loader.loadResDir('grossini', TestSprite, function (err, array) {
                strictEqual(array.length, 3, 'loadResDir - checking count');
                ['123200', '1232218', '123201'].forEach(function (uuid) {
                    ok(array.some(function (item) {
                        return item._uuid === uuid;
                    }), 'loadResDir - checking uuid ' + uuid);
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
                start();
            });
        //});
    });

    asyncTest('load single by type', function () {
        cc.loader.loadRes('grossini', TestSprite, function (err, sprite) {
            ok(sprite instanceof TestSprite, 'should be able to load asset by type');

            cc.loader.loadRes('grossini', cc.Texture2D, function (err, texture) {
                ok(texture instanceof cc.Texture2D, 'should be able to load asset by type');
                start();
            });
        });
    });

    asyncTest('load main asset and sub asset by loadResDir', function () {
        cc.loader.loadResDir('grossini', function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            ['123200', '1232218', '123201', '0000000', '0000001'].forEach(function (uuid) {
                ok(results.some(function (item) {
                    return item._uuid === uuid;
                }), 'checking uuid ' + uuid);
            });
            start();
        });
    });

    asyncTest('loadResDir by type', function () {
        cc.loader.loadResDir('grossini', TestSprite, function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var sprite = results[0];
            ok(sprite instanceof TestSprite, 'should be able to load test sprite');

            start();
        });
    });

    asyncTest('load all resources by loadResDir', function () {
        cc.loader.loadResDir('', function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var expectCount = Object.keys(Assets).length;
            strictEqual(results.length, expectCount, 'should load ' + expectCount + ' assets');

            start();
        });
    });

    asyncTest('url dict of loadResDir', function () {
        cc.loader.loadResDir('', cc.Texture2D, function (err, results, urls) {
            strictEqual(results.length, urls.length, 'url dict should contains the same count with array');

            var url = urls[0];
            cc.assetManager.loadRes(url, cc.Texture2D, null, function (err, result) {
                strictEqual(result, results[0], 'url is correct');
                start();
            });
        });
    });

    asyncTest('loadResArray', function () {
        var urls = [
            'grossini/grossini',
            'grossini'
        ];
        cc.loader.loadResArray(urls, TestSprite, function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var expectCount = urls.length;
            strictEqual(results.length, expectCount, 'should load ' + expectCount + ' assets');

            start();
        });
    });

    test('parse loadRes arguments', function () {
        var args;
        function onProgress () {}
        function onComplete () {}

        function assert (args, type, onProgress, onComplete, testName) {
            strictEqual(args.type, type, 'type of ' + testName + ' should be correct');
            equal(args.onProgress, onProgress, 'progress of ' + testName + ' should be correct');
            equal(args.onComplete, onComplete, 'complete of ' + testName + ' should be correct');
        }

        args = cc.loader._parseLoadResArgs(TestSprite, onProgress, onComplete);
        assert(args, TestSprite, onProgress, onComplete, 'case 1');
        args = cc.loader._parseLoadResArgs(TestSprite, onProgress, null);
        assert(args, TestSprite, onProgress, null, 'case 2');
        args = cc.loader._parseLoadResArgs(TestSprite, null, onComplete);
        assert(args, TestSprite, null, onComplete, 'case 3');
        args = cc.loader._parseLoadResArgs(TestSprite, onComplete);
        assert(args, TestSprite, null, onComplete, 'case 4');
        args = cc.loader._parseLoadResArgs(TestSprite);
        assert(args, TestSprite, null, null, 'case 5');
        args = cc.loader._parseLoadResArgs(onProgress, onComplete);
        assert(args, null, onProgress, onComplete, 'case 6');
        args = cc.loader._parseLoadResArgs(null, onComplete);
        assert(args, null, null, onComplete, 'case 7');
        args = cc.loader._parseLoadResArgs(onProgress, null);
        assert(args, null, onProgress, null, 'case 8');
        args = cc.loader._parseLoadResArgs(onComplete);
        assert(args, null, null, onComplete, 'case 9');
    });
})();
