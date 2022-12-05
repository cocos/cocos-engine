import { SpriteFrame } from "../../cocos/2d/assets/sprite-frame";
import { ImageAsset } from "../../cocos/asset/assets";
import { AssetManager, assetManager, loader, resources } from "../../cocos/asset/asset-manager";
import { js } from "../../cocos/core";
import { TestSprite } from "./common-class";

describe('asset-manager', function () {
    const assetDir = './tests/fixtures';
    const libPath = assetDir + '/library';
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
            '0000001': ['grossini/grossini', js.getClassId(ImageAsset)],
            '123201':  ['grossini/grossini', js.getClassId(TestSprite), 1],
            '0000000': ['grossini', js.getClassId(ImageAsset)],
            '1232218': ['grossini', js.getClassId(TestSprite), 1],   // sprite in texture
            '123200':  ['grossini', js.getClassId(TestSprite), 1],   // sprite in plist
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
    const grossini_uuid = '748321';
    const grossiniSprite_uuid = '1232218';
    const selfReferenced_uuid = '123200';
    const circleReferenced_uuid = '65535';

    test('Load', function (done) {
        const image1 = assetDir + '/button.png';
        const json1 = assetDir + '/library/12/123200.json';
        const json2 = assetDir + '/library/deferred-loading/74/748321.json';
        const resources = [
            image1,
            json1,
            json2,
        ];

        assetManager.loadAny(resources, { __requestType__: 'url'}, function (finish, total, item) {
            if (item.uuid === image1) {
                expect(item.content).toBeInstanceOf(Image);
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
            expect(assets[0]).toBeInstanceOf(Image);
            expect(assets[1].width).toBe(89);
            expect(assets[2]._native).toBe('YouKnowEverything');
            expect(assetManager.assets.has(image1)).toBeFalsy();
            expect(assetManager.assets.has(json1)).toBeFalsy();
            expect(assetManager.assets.has(json2)).toBeFalsy();
            done();
        });
    });

    test('Load single file', function (done) {
        const image1 = assetDir + '/button.png';

        assetManager.loadAny({ url: image1 }, function (completedCount, totalCount, item) {
            if (item.uuid === image1) {
                expect(item.content).toBeInstanceOf(Image);
            }
            else {
                fail('should not load an unknown url');
            }
        }, function (error, image) {
            expect(error).toBeFalsy();
            expect(image).toBeInstanceOf(Image);
            expect(assetManager.assets.has(image1)).toBeFalsy();
            done();
        });
    });

    test('Loading font', function (done) {
        const image = assetDir + '/button.png';
        const font = {
            url: assetDir + '/Thonburi.ttf',
            ext: '.ttf',
        };
        const resources = [
            image,
            font
        ];
        const total = resources.length;

        const progressCallback = jest.fn(function (completedCount, totalCount, item) {
            if (item.uuid === image) {
                expect(item.content).toBeInstanceOf(Image);
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
            expect(assets[0]).toBeInstanceOf(Image);
            expect(assets[1]).toBe('Thonburi_LABEL');
            expect(progressCallback).toBeCalledTimes(total);
            done();
        });
    });

    test('Loading texture with query', function (done) {
        const image1 = assetDir + '/button.png?url=http://.../1';
        const image2 = assetDir + '/button.png?url=http://.../2';
        assetManager.loadAny({url: image1, ext: '.png' }, function (error, image1) {
            assetManager.loadAny({url: image2, ext: '.png' }, function (error, image2) {
                expect(image1).toBeInstanceOf(Image);;
                expect(image2).toBeInstanceOf(Image);;
                expect(image1 !== image2).toBeTruthy();
                done();
            });
        });
    });

    test('Loading remote image', function (done) {
        const image = assetDir + '/button.png';
        assetManager.loadRemote(image, function (error, texture) {
            expect(texture).toBeInstanceOf(ImageAsset);;
            expect(texture._nativeAsset).toBeInstanceOf(Image);;
            expect(texture.refCount === 0).toBeTruthy();
            done();
        });
    });

    test('load asset with depends asset', function (done) {
        assetManager.loadAny(grossiniSprite_uuid, function (err, asset) {
            if (err) {
                fail(err.message);
            }
            expect((asset as SpriteFrame).texture).toBeTruthy();
            expect((asset as SpriteFrame).texture.refCount).toBe(1);
            expect((asset as SpriteFrame).refCount).toBe(0);
            expect((asset as SpriteFrame).texture.height).toBe(123);
            done();
        });
    }, 2000);

    test('load asset with depends asset recursively if no cache', function (done) {
        assetManager.loadAny(selfReferenced_uuid, function (err, asset) {
            if (err) {
                fail(err.message);
            }
            
            expect((asset as SpriteFrame).texture).toBe(asset);
            expect((asset as SpriteFrame).refCount).toBe(1);
            done();
        });
    }, 200);

    test('load asset with circle referenced dependencies', function (done) {
        assetManager.loadAny(circleReferenced_uuid, function (err, asset) {
            if (err) {
                fail(err.message);
            }
            expect((asset as any).dependency).toBeTruthy();
            expect((asset as any).dependency.refCount).toBe(1);
            expect(asset.refCount).toBe(1);
            expect((asset as any).dependency.dependency).toBe(asset);
            done();
        });
    }, 200);

    test('matching rules - 1', function (done) {
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
                done()
            });
        });
    });

    test('load single', function (done) {
        //loader.loadRes('grossini/grossini.png', function (err, texture) {
        //    expect(!texture, 'could not load texture with file extname');

            resources.load('grossini/grossini', function (err, imageAsset) {
                expect(imageAsset).toBeInstanceOf(ImageAsset);
                expect(imageAsset.refCount).toBe(0);
                done();
            });
        //});
    });

    test('load single by type', function (done) {
        resources.load('grossini', TestSprite, function (err, sprite) {
            expect(sprite).toBeInstanceOf(TestSprite);

            resources.load('grossini', ImageAsset, function (err, texture) {
                expect(texture).toBeInstanceOf(ImageAsset);
                done();
            });
        });
    });

    test('load main asset and sub asset by loadResDir', function (done) {
        resources.loadDir('grossini', function (err, results) {
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
        resources.loadDir('grossini', TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            const sprite = results[0];
            expect(sprite instanceof TestSprite).toBeTruthy();
            done();
        });
    });

    test('load all resources by loadResDir', function (done) {
        resources.loadDir('', function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            expect(results.length).toBe(5);
            done();
        });
    });

    test('url dict of loadResDir', function (done) {
        resources.loadDir('', ImageAsset, function (err, results) {
            expect(results.length).toBe(2);

            resources.load('grossini', ImageAsset, function (err, result) {
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
        resources.load(urls, TestSprite, function (err, results) {
            expect(Array.isArray(results)).toBeTruthy();
            const expectCount = urls.length;
            expect(results.length).toBe(expectCount);
            done();
        });
    });

    test('loader.onProgress', function (done) {
        const onProgress = jest.fn(function (completedCount, totalCount, item) {
        });
        loader.onProgress = onProgress;
        resources.loadDir('', ImageAsset, function (err, results) {
            expect(onProgress).toBeCalledTimes(2);
            loader.onProgress = null;
            done();
        });
    });
});