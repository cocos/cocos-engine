import { AssetLibrary, loader, resources } from "../../cocos/core/asset-manager";
import { parseLoadResArgs } from "../../cocos/core/asset-manager/utilities";
import { Texture2D } from "../../cocos/core/assets/texture-2d";
import { path } from "../../cocos/core/utils";
import { js } from "../../cocos/core/utils/js";
import { TestSprite } from "./common-class";

describe('asset', function () {

    var Assets;

    Assets = {
        '0000001': ['grossini/grossini', js._getClassId(Texture2D)],
        '123201':  ['grossini/grossini', js._getClassId(TestSprite), 1],
        '0000000': ['grossini', js._getClassId(Texture2D)],
        '1232218': ['grossini', js._getClassId(TestSprite), 1],   // sprite in texture
        '123200':  ['grossini', js._getClassId(TestSprite), 1],   // sprite in plist
    };
    var options = {
        libraryPath: './tests/fixtures/library',
        rawAssetsBase: path.dirname(path.stripSep('./tests/fixtures/library') + '.dummyExtForDirname') + '/',
        rawAssets: {
            assets: Assets
        }
    };
    AssetLibrary.init(options);
    loader.releaseAll();

    test('matching rules - 1', function () {
        loader.loadRes('grossini', TestSprite, function (err, sprite) {
            expect(sprite._uuid === '1232218' || sprite._uuid === '123200').toBeTruthy();

            loader.loadResDir('grossini', TestSprite, function (err, array) {
                expect(array.length).toBe(3);
                ['123200', '1232218', '123201'].forEach(function (uuid) {
                    expect(array.some(function (item) {
                        return item._uuid === uuid;
                    })).toBeTruthy();
                });
                
            });
        });
    });

    test('load single', function () {
        loader.loadRes('grossini/grossini', function (err, texture) {
            expect(texture instanceof Texture2D).toBeTruthy();
        });
    });

    test('load single by type', function () {
        loader.loadRes('grossini', TestSprite, function (err, sprite) {
            expect(sprite instanceof TestSprite).toBeTruthy();

            loader.loadRes('grossini', Texture2D, function (err, texture) {
                expect(texture instanceof Texture2D).toBeTruthy();
            });
        });
    });

    test('load main asset and sub asset by loadResDir', function () {
        loader.loadResDir('grossini', function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            ['123200', '1232218', '123201', '0000000', '0000001'].forEach(function (uuid) {
                expect(results.some(function (item) {
                    return item._uuid === uuid;
                })).toBeTruthy();
            });
            
        });
    });

    test('loadResDir by type', function () {
        loader.loadResDir('grossini', TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            var sprite = results[0];
            expect(sprite instanceof TestSprite).toBeTruthy();
        });
    });

    test('load all resources by loadResDir', function () {
        loader.loadResDir('', function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            var expectCount = Object.keys(Assets).length;
            expect(results.length).toBe(expectCount);
        });
    });

    test('url dict of loadResDir', function () {
        loader.loadResDir('', Texture2D, function (err, results, urls) {
            expect(results.length).toBe(urls.length);

            var url = urls[0];
            resources.load(url, Texture2D, null, function (err, result) {
                expect(result).toBe(results[0]);
            });
        });
    });

    test('loadResArray', function () {
        var urls = [
            'grossini/grossini',
            'grossini'
        ];
        loader.loadResArray(urls, TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            var expectCount = urls.length;
            expect(results.length).toBe(expectCount);
        });
    });

    test('parse loadRes arguments', function () {
        var args;
        function onProgress () {}
        function onComplete () {}

        function assert (args, type, onProgress, onComplete, testName) {
            expect(args.type).toBe(type);
            expect(args.onProgress).toBe(onProgress);
            expect(args.onComplete).toBe(onComplete);
        }

        args = parseLoadResArgs(TestSprite, onProgress, onComplete);
        assert(args, TestSprite, onProgress, onComplete, 'case 1');
        args = parseLoadResArgs(TestSprite, onProgress, null);
        assert(args, TestSprite, onProgress, null, 'case 2');
        args = parseLoadResArgs(TestSprite, null, onComplete);
        assert(args, TestSprite, null, onComplete, 'case 3');
        args = parseLoadResArgs(TestSprite, onComplete, undefined);
        assert(args, TestSprite, null, onComplete, 'case 4');
        args = parseLoadResArgs(TestSprite, undefined, undefined);
        assert(args, TestSprite, null, null, 'case 5');
        args = parseLoadResArgs(onProgress, onComplete, undefined);
        assert(args, null, onProgress, onComplete, 'case 6');
        args = parseLoadResArgs(null, onComplete, undefined);
        assert(args, null, null, onComplete, 'case 7');
        args = parseLoadResArgs(onProgress, null, undefined);
        assert(args, null, onProgress, null, 'case 8');
        args = parseLoadResArgs(onComplete, undefined, undefined);
        assert(args, null, null, onComplete, 'case 9');
    });
});