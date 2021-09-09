import { SpriteFrame } from "../../cocos/2d/assets/sprite-frame";
import { AssetManager, assetManager, loader, resources } from "../../cocos/core/asset-manager";
import { Texture2D } from "../../cocos/core/assets/texture-2d";
import { js } from "../../cocos/core/utils/js";
import { TestSprite } from "./common-class";

describe('asset-manager', function () {
    const assetDir = '../fixtures/library';
    //_resetGame();
    assetManager.init({
        importBase: libPath, 
        nativeBase: libPath,
    });
    resources.init({
        name: AssetManager.BuiltinBundleName.RESOURCES,
        importBase: libPath, 
        nativeBase: libPath, 
        paths: {
            '0000001': ['grossini/grossini', js._getClassId(Texture2D)],
            '123201':  ['grossini/grossini', js._getClassId(TestSprite), 1],
            '0000000': ['grossini', js._getClassId(Texture2D)],
            '1232218': ['grossini', js._getClassId(TestSprite), 1],   // sprite in texture
            '123200':  ['grossini', js._getClassId(TestSprite), 1],   // sprite in plist
        },
        uuids: [
            '0000001',
            '123201',
            '0000000',
            '1232218',
            '123200'
        ],
        base: '',
        deps: [],
        scenes: {},
        packs: {},
        versions: { import: [], native: []},
        redirect: [],
        debug: false,
        types: [],
        extensionMap: {},
    });

    var libPath = assetDir + '/library';
    var grossini_uuid = '748321';
    var grossiniSprite_uuid = '1232218';
    var selfReferenced_uuid = '123200';
    var circleReferenced_uuid = '65535';

    test.concurrent('Load', function () {
        var image1 = assetDir + '/button.png';
        var json1 = assetDir + '/library/12/123200.json';
        var json2 = assetDir + '/library/deferred-loading/74/748321.json';
        var resources = [
            image1,
            json1,
            json2,
        ];

        return new Promise<void>((resolve, reject) => {
            assetManager.loadAny(resources, { __requestType__: 'url'}, function (finish, total, item) {
                if (item.uuid === image1) {
                    expect(item.content instanceof Image).toBeTruthy();
                }
                else if (item.uuid === json1) {
                    expect(item.content.width).toBe(89);
                }
                else if (item.uuid === json2) {
                    expect(item.content._native).toBe('YouKnowEverything');
                }
                else {
                    fail('should not load an unknown url');
                }
            }, function (err, assets) {
                expect(assets.length).toBe(3);
                expect(assets[0] instanceof Image).toBeTruthy();
                expect(assets[1].width).toBe(89);
                expect(assets[2]._native).toBe('YouKnowEverything');
                expect(assetManager.assets.has(image1)).toBeTruthy();
                expect(assetManager.assets.has(json1)).toBeTruthy();
                expect(assetManager.assets.has(json2)).toBeTruthy();
                resolve();
            });
        });
    });

    test.concurrent('Load single file', function () {
        var image1 = assetDir + '/button.png';

        return new Promise<void>((resolve, reject) => {
            assetManager.loadAny({ url: image1 }, function (completedCount, totalCount, item) {
                if (item.uuid === image1) {
                    expect(item.content instanceof Image).toBeTruthy();
                }
                else {
                    fail('should not load an unknown url');
                }
            }, function (error, image) {
                expect(error).toBeFalsy();
                expect(image instanceof Image).toBeTruthy();
                expect(assetManager.assets.has(image1)).toBeFalsy();
                resolve();
            });
        });
    });

    test.concurrent('Loading font', function () {
        var image = assetDir + '/button.png';
        var font = {
            url: assetDir + '/Thonburi.ttf',
            ext: '.ttf',
        };
        var resources = [
            image,
            font
        ];
        var total = resources.length;

        var progressCallback = jest.fn(function (completedCount, totalCount, item) {
            if (item.uuid === image) {
                expect(item.content instanceof Image).toBeTruthy();
            }
            else if (item.uuid === font.url) {
                expect(item.content).toBe('Thonburi_LABEL');
            }
            else {
                fail('should not load an unknown url');
            }
        });

        return new Promise<void>((resolve, reject) => {
            assetManager.loadAny(resources, { __requestType__: 'url' }, progressCallback, function (error, assets) {
                expect(assets.length).toBe(2);
                expect(assets[0] instanceof Image).toBeTruthy();
                expect(assets[1]).toBe('Thonburi_LABEL');
                expect(progressCallback).toBeCalledTimes(total);
                resolve();
            });
        });
    });

    test('Loading texture with query', function () {
        var image1 = assetDir + '/button.png?url=http://.../1';
        var image2 = assetDir + '/button.png?url=http://.../2';
        assetManager.loadAny({url: image1, ext: '.png' }, function (error, image1) {
            assetManager.loadAny({url: image2, ext: '.png' }, function (error, image2) {
                expect(image1 instanceof Image).toBeTruthy();
                expect(image2 instanceof Image).toBeTruthy();
                expect(image1 !== image2).toBeTruthy();
                
            });
        });
    });

    test('Loading remote image', function () {
        var image = assetDir + '/button.png';
        assetManager.loadRemote(image, function (error, texture) {
            expect(texture instanceof Texture2D).toBeTruthy();
            expect(texture._nativeAsset instanceof Image).toBeTruthy();
            expect(texture.refCount === 0).toBeTruthy();
            
        });
    });

    test('load asset with depends asset', function () {
        assetManager.loadAny(grossiniSprite_uuid, function (err, asset) {
            if (err) {
                fail(err.message);
            }
            expect((asset as SpriteFrame).texture).toBeTruthy();
            expect((asset as SpriteFrame).texture.refCount).toBe(1);
            expect((asset as SpriteFrame).refCount).toBe(0);
            expect((asset as SpriteFrame).texture.height).toBe(123);
            
        });
    }, 2000);

    test('load asset with depends asset recursively if no cache', function () {
        assetManager.loadAny(selfReferenced_uuid, function (err, asset) {
            if (err) {
                fail(err.message);
            }
            
            expect((asset as SpriteFrame).texture).toBe(asset);
            expect((asset as SpriteFrame).refCount).toBe(1);
        });
    }, 200);

    test('load asset with circle referenced dependencies', function () {
        assetManager.loadAny(circleReferenced_uuid, function (err, asset) {
            if (err) {
                fail(err.message);
            }
            expect((asset as any).dependency).toBeTruthy();
            expect((asset as any).dependency.refCount).toBe(1);
            expect(asset.refCount).toBe(1);
            expect((asset as any).dependency.dependency).toBe(asset);
            
        });
    }, 200);

    test('matching rules - 1', function () {
        resources.load('grossini', TestSprite, function (err, sprite) {
            expect(sprite._uuid === '1232218' || sprite._uuid === '123200').toBeTruthy();
            if (sprite._uuid === '123200') {
                expect(sprite.refCount).toBe(1);
                expect((sprite as any).texture.refCount).toBe(1);
            }
            else {
                expect(sprite.refCount).toBe(0);
                expect((sprite as any).texture.refCount).toBe(1);
            }
            resources.loadDir('grossini', TestSprite, function (err, array) {
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
        //loader.loadRes('grossini/grossini.png', function (err, texture) {
        //    expect(!texture, 'could not load texture with file extname');

            resources.load('grossini/grossini', function (err, texture) {
                expect(texture instanceof Texture2D).toBeTruthy();
                expect(texture.refCount).toBe(0);
                
            });
        //});
    });

    test('load single by type', function () {
        resources.load('grossini', TestSprite, function (err, sprite) {
            expect(sprite instanceof TestSprite).toBeTruthy();

            resources.load('grossini', Texture2D, function (err, texture) {
                expect(texture instanceof Texture2D).toBeTruthy();
                
            });
        });
    });

    test('load main asset and sub asset by loadResDir', function () {
        resources.loadDir('grossini', function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            ['123200', '1232218', '123201', '0000000', '0000001'].forEach(function (uuid) {
                expect(results.some(function (item) {
                    return item._uuid === uuid;
                })).toBeTruthy();
            });
            
        });
    });

    test('loadResDir by type', function () {
        resources.loadDir('grossini', TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            var sprite = results[0];
            expect(sprite instanceof TestSprite).toBeTruthy();
        });
    });

    test('load all resources by loadResDir', function () {
        resources.loadDir('', function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            expect(results.length).toBe(5);
        });
    });

    test('url dict of loadResDir', function () {
        resources.loadDir('', Texture2D, function (err, results) {
            expect(results.length).toBe(2);

            resources.load('grossini', Texture2D, function (err, result) {
                expect(result).toBe(results[0]);
            });
        });
    });

    test('loadResArray', function () {
        var urls = [
            'grossini/grossini',
            'grossini'
        ];
        resources.load(urls, TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            var expectCount = urls.length;
            expect(results.length).toBe(expectCount);
        });
    });

    test('loader.onProgress', function () {
        loader.onProgress = jest.fn(function (completedCount, totalCount, item) {
        });
        resources.loadDir('', Texture2D, function (err, results) {
            expect(loader.onProgress).toBeCalledTimes(3);
            loader.onProgress = null;
            
        });
    });
});