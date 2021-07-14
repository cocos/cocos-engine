import { resources } from "../../cocos/core/asset-manager";
import { Texture2D } from "../../cocos/core/assets/texture-2d";
import { TestSprite } from "./common-class";

(function () {

    var Assets;

    module('load resources', {
        setup: function () {
            _resetGame();
            Assets = {
                '0000001': ['grossini/grossini', js._getClassId(Texture2D)],
                '123201':  ['grossini/grossini', js._getClassId(TestSprite), 1],
                '0000000': ['grossini', js._getClassId(Texture2D)],
                '1232218': ['grossini', js._getClassId(TestSprite), 1],   // sprite in texture
                '123200':  ['grossini', js._getClassId(TestSprite), 1],   // sprite in plist
            };
            var options = {
                libraryPath: assetDir + '/library',
                rawAssetsBase: path.dirname(path.stripSep(assetDir) + '.dummyExtForDirname') + '/',
                rawAssets: {
                    assets: Assets
                }
            };
            AssetLibrary.init(options);
            loader.releaseAll();
        },
    });

    test('matching rules - 1', function () {
        loader.loadRes('grossini', TestSprite, function (err, sprite) {
            ok(sprite._uuid === '1232218' || sprite._uuid === '123200', 'loadRes - checking uuid');

            loader.loadResDir('grossini', TestSprite, function (err, array) {
                strictEqual(array.length, 3, 'loadResDir - checking count');
                ['123200', '1232218', '123201'].forEach(function (uuid) {
                    ok(array.some(function (item) {
                        return item._uuid === uuid;
                    }), 'loadResDir - checking uuid ' + uuid);
                });
                
            });
        });
    });

    test('load single', function () {
        //loader.loadRes('grossini/grossini.png', function (err, texture) {
        //    ok(!texture, 'could not load texture with file extname');

            loader.loadRes('grossini/grossini', function (err, texture) {
                ok(texture instanceof Texture2D, 'should be able to load texture without file extname');
                
            });
        //});
    });

    test('load single by type', function () {
        loader.loadRes('grossini', TestSprite, function (err, sprite) {
            ok(sprite instanceof TestSprite, 'should be able to load asset by type');

            loader.loadRes('grossini', Texture2D, function (err, texture) {
                ok(texture instanceof Texture2D, 'should be able to load asset by type');
                
            });
        });
    });

    test('load main asset and sub asset by loadResDir', function () {
        loader.loadResDir('grossini', function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            ['123200', '1232218', '123201', '0000000', '0000001'].forEach(function (uuid) {
                ok(results.some(function (item) {
                    return item._uuid === uuid;
                }), 'checking uuid ' + uuid);
            });
            
        });
    });

    test('loadResDir by type', function () {
        loader.loadResDir('grossini', TestSprite, function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var sprite = results[0];
            ok(sprite instanceof TestSprite, 'should be able to load test sprite');

            
        });
    });

    test('load all resources by loadResDir', function () {
        loader.loadResDir('', function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var expectCount = Object.keys(Assets).length;
            strictEqual(results.length, expectCount, 'should load ' + expectCount + ' assets');

            
        });
    });

    test('url dict of loadResDir', function () {
        loader.loadResDir('', Texture2D, function (err, results, urls) {
            strictEqual(results.length, urls.length, 'url dict should contains the same count with array');

            var url = urls[0];
            resources.load(url, Texture2D, null, function (err, result) {
                strictEqual(result, results[0], 'url is correct');
                
            });
        });
    });

    test('loadResArray', function () {
        var urls = [
            'grossini/grossini',
            'grossini'
        ];
        loader.loadResArray(urls, TestSprite, function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var expectCount = urls.length;
            strictEqual(results.length, expectCount, 'should load ' + expectCount + ' assets');

            
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

        args = loader._parseLoadResArgs(TestSprite, onProgress, onComplete);
        assert(args, TestSprite, onProgress, onComplete, 'case 1');
        args = loader._parseLoadResArgs(TestSprite, onProgress, null);
        assert(args, TestSprite, onProgress, null, 'case 2');
        args = loader._parseLoadResArgs(TestSprite, null, onComplete);
        assert(args, TestSprite, null, onComplete, 'case 3');
        args = loader._parseLoadResArgs(TestSprite, onComplete);
        assert(args, TestSprite, null, onComplete, 'case 4');
        args = loader._parseLoadResArgs(TestSprite);
        assert(args, TestSprite, null, null, 'case 5');
        args = loader._parseLoadResArgs(onProgress, onComplete);
        assert(args, null, onProgress, onComplete, 'case 6');
        args = loader._parseLoadResArgs(null, onComplete);
        assert(args, null, null, onComplete, 'case 7');
        args = loader._parseLoadResArgs(onProgress, null);
        assert(args, null, onProgress, null, 'case 8');
        args = loader._parseLoadResArgs(onComplete);
        assert(args, null, null, onComplete, 'case 9');
    });
})();