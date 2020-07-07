(function () {
    largeModule('AssetManager',  {
        setup: function () {
            _resetGame();
            cc.assetManager.init({
                importBase: libPath, 
                nativeBase: libPath,
            });
            var resources = new cc.AssetManager.Bundle();
            resources.init({
                name: cc.AssetManager.BuiltinBundleName.RESOURCES,
                importBase: libPath, 
                nativeBase: libPath, 
                paths: {
                    '0000001': ['grossini/grossini', cc.js._getClassId(cc.Texture2D)],
                    '123201':  ['grossini/grossini', cc.js._getClassId(TestSprite), 1],
                    '0000000': ['grossini', cc.js._getClassId(cc.Texture2D)],
                    '1232218': ['grossini', cc.js._getClassId(TestSprite), 1],   // sprite in texture
                    '123200':  ['grossini', cc.js._getClassId(TestSprite), 1],   // sprite in plist
                },
                uuids: [
                    '0000001',
                    '123201',
                    '0000000',
                    '1232218',
                    '123200'
                ]
            })
        }
    });

    var libPath = assetDir + '/library';
    var grossini_uuid = '748321';
    var grossiniSprite_uuid = '1232218';
    var selfReferenced_uuid = '123200';
    var circleReferenced_uuid = '65535';

    asyncTest('Load', function () {
        var image1 = assetDir + '/button.png';
        var json1 = assetDir + '/library/12/123200.json';
        var json2 = assetDir + '/library/deferred-loading/74/748321.json';
        var resources = [
            image1,
            json1,
            json2,
        ];

        cc.assetManager.loadAny(resources, { __requestType__: 'url'}, function (finish, total, item) {
            if (item.uuid === image1) {
                ok(item.content instanceof ImageBitmapOrImage, 'image url\'s result should be Image');
            }
            else if (item.uuid === json1) {
                strictEqual(item.content.width, 89, 'should give correct js object as result of JSON');
            }
            else if (item.uuid === json2) {
                strictEqual(item.content._native, 'YouKnowEverything', 'should give correct js object as result of JSON');
            }
            else {
                ok(false, 'should not load an unknown url');
            }
        }, function (err, assets) {
            strictEqual(assets.length, 3, 'should equal to 3');
            ok(assets[0] instanceof ImageBitmapOrImage, 'image url\'s result should be Image');
            strictEqual(assets[1].width, 89, 'should give correct js object as result of JSON');
            strictEqual(assets[2]._native, 'YouKnowEverything', 'should give correct js object as result of JSON');
            ok(!cc.assetManager.assets.has(image1), 'should not cache');
            ok(!cc.assetManager.assets.has(json1), 'should not cache');
            ok(!cc.assetManager.assets.has(json2), 'should not cache');
            start();
        });
    });

    asyncTest('Load single file', function () {
        var image1 = assetDir + '/button.png';

        cc.assetManager.loadAny({ url: image1 }, function (completedCount, totalCount, item) {
            if (item.uuid === image1) {
                ok(item.content instanceof ImageBitmapOrImage, 'image url\'s result should be Image');
            }
            else {
                ok(false, 'should not load an unknown url');
            }
        }, function (error, image) {
            ok(!error, 'should not return error');
            ok(image instanceof ImageBitmapOrImage, 'the single result should be Image');
            ok(!cc.assetManager.assets.has(image1), 'should not cache');
            start();
        });
    });

    asyncTest('Loading font', function () {
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

        var progressCallback = new Callback(function (completedCount, totalCount, item) {
            if (item.uuid === image) {
                ok(item.content instanceof ImageBitmapOrImage, 'image url\'s result should be Image');
            }
            else if (item.uuid === font.url) {
                strictEqual(item.content, 'Thonburi_LABEL', 'should set family name as content for Font type');
            }
            else {
                ok(false, 'should not load an unknown url');
            }
        }).enable();

        cc.assetManager.loadAny(resources, { __requestType__: 'url' }, progressCallback, function (error, assets) {
            ok(assets.length === 2, 'be able to load all resources');
            ok(assets[0] instanceof ImageBitmapOrImage, 'the single result should be Image');
            strictEqual(assets[1], 'Thonburi_LABEL', 'should give correct js object as result of JSON');
            progressCallback.expect(total, 'should call ' + total + ' times progress callback for ' + total + ' resources');

            start();
        });
    });

    asyncTest('Loading texture with query', function () {
        var image1 = assetDir + '/button.png?url=http://.../1';
        var image2 = assetDir + '/button.png?url=http://.../2';
        cc.assetManager.loadAny({url: image1, ext: '.png' }, function (error, image1) {
            cc.assetManager.loadAny({url: image2, ext: '.png' }, function (error, image2) {
                ok(image1 instanceof ImageBitmapOrImage, 'image1 url\'s result should be Image');
                ok(image2 instanceof ImageBitmapOrImage, 'image2 url\'s result should be Image');
                ok(image1 !== image2, 'should split cache if query is different');
                start();
            });
        });
    });

    asyncTest('Loading remote image', function () {
        var image = assetDir + '/button.png';
        cc.assetManager.loadRemote(image, function (error, texture) {
            ok(texture instanceof cc.Texture2D, 'should be texture');
            ok(texture._nativeAsset instanceof ImageBitmapOrImage, 'should be Image');
            ok(texture.refCount === 0, 'reference should be 0');
            start();
        });
    });

    asyncTest('load asset with depends asset', function () {
        var timerId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 2000);
        cc.assetManager.loadAny(grossiniSprite_uuid, function (err, asset) {
            if (err) {
                ok(false, err.message);
                return start();
            }
            clearTimeout(timerId);
            ok(asset.texture, 'can load depends asset');
            ok(asset.texture.refCount === 1, 'should be 1');
            ok(asset.refCount === 0, 'should be 1');
            strictEqual(asset.texture.height, 123, 'can get height');
            start();
        });
    });

    asyncTest('load asset with depends asset recursively if no cache', function () {
        var timerId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 200);
        cc.assetManager.loadAny(selfReferenced_uuid, function (err, asset) {
            if (err) {
                ok(false, err.message);
                return start();
            }
            clearTimeout(timerId);
            
            ok(asset.texture === asset, 'asset could reference to itself');
            ok(asset.refCount === 1, 'should be 1');
            start();
        });
    });

    asyncTest('load asset with circle referenced dependencies', function () {
        var timerId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 200);
        cc.assetManager.loadAny(circleReferenced_uuid, function (err, asset) {
            if (err) {
                ok(false, err.message);
                return start();
            }
            clearTimeout(timerId);
            ok(asset.dependency, 'can load circle referenced asset');
            ok(asset.dependency.refCount === 1, 'should be 1');
            ok(asset.refCount === 1, 'should be 1');
            strictEqual(asset.dependency.dependency, asset, 'circle referenced asset should have dependency which equal to self');
            start();
        });
    });

    asyncTest('matching rules - 1', function () {
        cc.resources.load('grossini', TestSprite, function (err, sprite) {
            ok(sprite._uuid === '1232218' || sprite._uuid === '123200', 'loadRes - checking uuid');
            if (sprite._uuid === '123200') {
                ok(sprite.refCount === 1, 'reference should be 1');
                ok(sprite.texture.refCount === 1, 'reference should be 1');
            }
            else {
                ok(sprite.refCount === 0, 'reference should be 0');
                ok(sprite.texture.refCount === 1, 'reference should be 1');
            }
            cc.resources.loadDir('grossini', TestSprite, function (err, array) {
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

            cc.resources.load('grossini/grossini', function (err, texture) {
                ok(texture instanceof cc.Texture2D, 'should be able to load texture without file extname');
                ok(texture.refCount === 0, 'should be able to load texture without file extname');
                start();
            });
        //});
    });

    asyncTest('load single by type', function () {
        cc.resources.load('grossini', TestSprite, function (err, sprite) {
            ok(sprite instanceof TestSprite, 'should be able to load asset by type');

            cc.resources.load('grossini', cc.Texture2D, function (err, texture) {
                ok(texture instanceof cc.Texture2D, 'should be able to load asset by type');
                start();
            });
        });
    });

    asyncTest('load main asset and sub asset by loadResDir', function () {
        cc.resources.loadDir('grossini', function (err, results) {
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
        cc.resources.loadDir('grossini', TestSprite, function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var sprite = results[0];
            ok(sprite instanceof TestSprite, 'should be able to load test sprite');

            start();
        });
    });

    asyncTest('load all resources by loadResDir', function () {
        cc.resources.loadDir('', function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            strictEqual(results.length, 5, 'should load ' + 5 + ' assets');

            start();
        });
    });

    asyncTest('url dict of loadResDir', function () {
        cc.resources.loadDir('', cc.Texture2D, function (err, results) {
            strictEqual(results.length, 2, 'url dict should contains the same count with array');

            cc.resources.load('grossini', cc.Texture2D, function (err, result) {
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
        cc.resources.load(urls, TestSprite, function (err, results) {
            ok(Array.isArray(results), 'result should be an array');
            var expectCount = urls.length;
            strictEqual(results.length, expectCount, 'should load ' + expectCount + ' assets');

            start();
        });
    });

    asyncTest('cc.loader.onProgress', function () {
        cc.loader.onProgress = new Callback(function (completedCount, totalCount, item) {
        }).enable();
        cc.resources.loadDir('', cc.Texture2D, function (err, results) {
            ok(cc.loader.onProgress.calledCount > 0, 'should call more than 0 times progress callback');
            cc.loader.onProgress = null;
            start();
        });
    });
})();