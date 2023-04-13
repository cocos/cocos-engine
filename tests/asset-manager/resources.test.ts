import { AssetLibrary, loader, resources } from "../../cocos/asset/asset-manager";
import { parseLoadResArgs } from "../../cocos/asset/asset-manager/utilities";
import { ImageAsset } from "../../cocos/asset/assets/image-asset";
import { path } from "../../cocos/core/utils";
import { js } from "../../cocos/core";
import { TestSprite } from "./common-class";

describe('asset', function () {

    const Assets = {
        '0000001': ['grossini/grossini', js.getClassId(ImageAsset)],
        '123201':  ['grossini/grossini', js.getClassId(TestSprite), 1],
        '0000000': ['grossini', js.getClassId(ImageAsset)],
        '1232218': ['grossini', js.getClassId(TestSprite), 1],   // sprite in texture
        '123200':  ['grossini', js.getClassId(TestSprite), 1],   // sprite in plist
    };
    const options = {
        libraryPath: './tests/fixtures/library',
        rawAssetsBase: path.dirname(path.stripSep('./tests/fixtures/library') + '.dummyExtForDirname') + '/',
        rawAssets: {
            assets: Assets
        }
    };
    AssetLibrary.init(options);
    loader.releaseAll();

    test('matching rules - 1', function (done) {
        loader.loadRes('grossini', TestSprite, function (err, sprite) {
            expect(sprite._uuid === '1232218' || sprite._uuid === '123200').toBeTruthy();

            loader.loadResDir('grossini', TestSprite, function (err, array) {
                expect(array.length).toBe(3);
                ['123200', '1232218', '123201'].forEach(function (uuid) {
                    expect(array.some(function (item) {
                        return item._uuid === uuid;
                    })).toBeTruthy();
                });
                done();
            });
        });
    });

    test('load single', function (done) {
        loader.loadRes('grossini/grossini', function (err, texture) {
            expect(texture).toBeInstanceOf(ImageAsset);
            done();
        });
    });

    test('load single by type', function (done) {
        loader.loadRes('grossini', TestSprite, function (err, sprite) {
            expect(sprite).toBeInstanceOf(TestSprite);

            loader.loadRes('grossini', ImageAsset, function (err, texture) {
                expect(texture).toBeInstanceOf(ImageAsset);
                done();
            });
        });
    });

    test('load main asset and sub asset by loadResDir', function (done) {
        loader.loadResDir('grossini', function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            ['123200', '1232218', '123201', '0000000', '0000001'].forEach(function (uuid) {
                expect(results.some(function (item) {
                    return item._uuid === uuid;
                })).toBeTruthy();
            });
            done();
        });
    });

    test('loadResDir by type', function (done) {
        loader.loadResDir('grossini', TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            const sprite = results[0];
            expect(sprite).toBeInstanceOf(TestSprite);
            done();
        });
    });

    test('load all resources by loadResDir', function (done) {
        loader.loadResDir('', function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            const expectCount = Object.keys(Assets).length;
            expect(results.length).toBe(expectCount);
            done();
        });
    });

    test('url dict of loadResDir', function (done) {
        loader.loadResDir('', ImageAsset, function (err, results, urls) {
            expect(results.length).toBe(urls.length);

            const url = urls[0];
            resources.load(url, ImageAsset, null, function (err, result) {
                expect(result).toBe(results[0]);
                done();
            });
        });
    });

    test('loadResArray', function (done) {
        const urls = [
            'grossini/grossini',
            'grossini'
        ];
        loader.loadResArray(urls, TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            const expectCount = urls.length;
            expect(results.length).toBe(expectCount);
            done();
        });
    });

    test('parse loadRes arguments', function () {
        let args;
        function onProgress () {}
        function onComplete () {}

        function assert (args, type, onProgress, onComplete, testName) {
            expect(args.type).toBe(type);
            expect(args.onProgress == onProgress).toBeTruthy();
            expect(args.onComplete == onComplete).toBeTruthy();
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