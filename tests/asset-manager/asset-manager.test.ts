import { AssetManager, assetManager } from "../../cocos/core/asset-manager";
import { Texture2D } from "../../cocos/core/assets/texture-2d";
import { js } from "../../cocos/core/utils/js";
import { TestSprite } from "./common-class";

describe('asset-manager', function () {
    const assetDir = '';
    //_resetGame();
    assetManager.init({
        importBase: libPath, 
        nativeBase: libPath,
    });
    var resources = new AssetManager.Bundle();
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

    test('Load', function () {
        var image1 = assetDir + '/button.png';
        var json1 = assetDir + '/library/12/123200.json';
        var json2 = assetDir + '/library/deferred-loading/74/748321.json';
        var resources = [
            image1,
            json1,
            json2,
        ];

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
            
        });
    });

    test('Load single file', function () {
        var image1 = assetDir + '/button.png';

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
        });
    });

    test('Loading font', function () {
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

        assetManager.loadAny(resources, { __requestType__: 'url' }, progressCallback, function (error, assets) {
            expect(assets.length).toBe(2);
            expect(assets[0] instanceof Image).toBeTruthy();
            expect(assets[1]).toBe('Thonburi_LABEL');
            expect(progressCallback).toBeCalledTimes(total);
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
            expect(texture instanceof Texture2D, 'should be texture');
            expect(texture._nativeAsset instanceof ImageBitmapOrImage, 'should be Image');
            expect(texture.refCount === 0, 'reference should be 0');
            
        });
    });

    test('load asset with depends asset', function () {
        var timerId = setTimeout(function () {
            expect(false, 'time out!');
            
        }, 2000);
        assetManager.loadAny(grossiniSprite_uuid, function (err, asset) {
            if (err) {
                expect(false, err.message);
                return 
            }
            clearTimeout(timerId);
            expect(asset.texture, 'can load depends asset');
            expect(asset.texture.refCount === 1, 'should be 1');
            expect(asset.refCount === 0, 'should be 1');
            strictEqual(asset.texture.height, 123, 'can get height');
            
        });
    });

    test('load asset with depends asset recursively if no cache', function () {
        var timerId = setTimeout(function () {
            expect(false, 'time out!');
            
        }, 200);
        assetManager.loadAny(selfReferenced_uuid, function (err, asset) {
            if (err) {
                expect(false, err.message);
                return 
            }
            clearTimeout(timerId);
            
            expect(asset.texture === asset, 'asset could reference to itself');
            expect(asset.refCount === 1, 'should be 1');
            
        });
    });

    test('load asset with circle referenced dependencies', function () {
        var timerId = setTimeout(function () {
            expect(false, 'time out!');
            
        }, 200);
        assetManager.loadAny(circleReferenced_uuid, function (err, asset) {
            if (err) {
                expect(false, err.message);
                return 
            }
            clearTimeout(timerId);
            expect(asset.dependency, 'can load circle referenced asset');
            expect(asset.dependency.refCount === 1, 'should be 1');
            expect(asset.refCount === 1, 'should be 1');
            strictEqual(asset.dependency.dependency, asset, 'circle referenced asset should have dependency which equal to self');
            
        });
    });

    test('matching rules - 1', function () {
        resources.load('grossini', TestSprite, function (err, sprite) {
            expect(sprite._uuid === '1232218' || sprite._uuid === '123200', 'loadRes - checking uuid');
            if (sprite._uuid === '123200') {
                expect(sprite.refCount === 1, 'reference should be 1');
                expect(sprite.texture.refCount === 1, 'reference should be 1');
            }
            else {
                expect(sprite.refCount === 0, 'reference should be 0');
                expect(sprite.texture.refCount === 1, 'reference should be 1');
            }
            resources.loadDir('grossini', TestSprite, function (err, array) {
                strictEqual(array.length, 3, 'loadResDir - checking count');
                ['123200', '1232218', '123201'].forEach(function (uuid) {
                    expect(array.some(function (item) {
                        return item._uuid === uuid;
                    }), 'loadResDir - checking uuid ' + uuid);
                });
                
            });
        });
    });

    test('load single', function () {
        //loader.loadRes('grossini/grossini.png', function (err, texture) {
        //    expect(!texture, 'could not load texture with file extname');

            resources.load('grossini/grossini', function (err, texture) {
                expect(texture instanceof Texture2D, 'should be able to load texture without file extname');
                expect(texture.refCount === 0, 'should be able to load texture without file extname');
                
            });
        //});
    });

    test('load single by type', function () {
        resources.load('grossini', TestSprite, function (err, sprite) {
            expect(sprite instanceof TestSprite, 'should be able to load asset by type');

            resources.load('grossini', Texture2D, function (err, texture) {
                expect(texture instanceof Texture2D, 'should be able to load asset by type');
                
            });
        });
    });

    test('load main asset and sub asset by loadResDir', function () {
        resources.loadDir('grossini', function (err, results) {
            expect(Array.isArray(results), 'result should be an array');
            ['123200', '1232218', '123201', '0000000', '0000001'].forEach(function (uuid) {
                expect(results.some(function (item) {
                    return item._uuid === uuid;
                }), 'checking uuid ' + uuid);
            });
            
        });
    });

    test('loadResDir by type', function () {
        resources.loadDir('grossini', TestSprite, function (err, results) {
            expect(Array.isArray(results), 'result should be an array');
            var sprite = results[0];
            expect(sprite instanceof TestSprite, 'should be able to load test sprite');

            
        });
    });

    test('load all resources by loadResDir', function () {
        resources.loadDir('', function (err, results) {
            expect(Array.isArray(results), 'result should be an array');
            strictEqual(results.length, 5, 'should load ' + 5 + ' assets');

            
        });
    });

    test('url dict of loadResDir', function () {
        resources.loadDir('', Texture2D, function (err, results) {
            strictEqual(results.length, 2, 'url dict should contains the same count with array');

            resources.load('grossini', Texture2D, function (err, result) {
                strictEqual(result, results[0], 'url is correct');
                
            });
        });
    });

    test('loadResArray', function () {
        var urls = [
            'grossini/grossini',
            'grossini'
        ];
        resources.load(urls, TestSprite, function (err, results) {
            expect(Array.isArray(results), 'result should be an array');
            var expectCount = urls.length;
            strictEqual(results.length, expectCount, 'should load ' + expectCount + ' assets');

            
        });
    });

    test('loader.onProgress', function () {
        loader.onProgress = new Callback(function (completedCount, totalCount, item) {
        }).enable();
        resources.loadDir('', Texture2D, function (err, results) {
            expect(loader.onProgress.calledCount > 0, 'should call more than 0 times progress callback');
            loader.onProgress = null;
            
        });
    });
});