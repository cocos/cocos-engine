(function () {

    var libPath = assetDir + '/library';

    var grossini_uuid = '748321';
    var grossiniSprite_uuid = '1232218';
    var selfReferenced_uuid = '123200';
    var circleReferenced_uuid = '65535';

    largeModule('AssetLibrary', {
        setup: function () {
            _resetGame();
            AssetLibrary.init({libraryPath: libPath});
        }
    });

    var TestHostFile = false;

    if (TestHostFile) {
        asyncTest('load asset with raw', function () {
            //var texture = new TestTexture();
            //texture.height = 123;
            //texture.width = 321;
            //cc.log(Editor.serialize(texture));

            AssetLibrary.loadAsset(grossini_uuid, function (err, asset) {
                clearTimeout(timerId);
                ok(asset, 'can load asset by uuid');
                strictEqual(asset.width, 321, 'can get width');
                strictEqual(asset.height, 123, 'can get height');
                ok(asset.image, 'can get image');
                start();
            });
            var timerId = setTimeout(function () {
                ok(false, 'time out!');
                start();
            }, 1000);
        });
    }

    asyncTest('load asset with depends asset', function () {
        //var sprite = new cc.SpriteFrame();
        //sprite.texture = new TestTexture();
        //sprite.texture._uuid = grossini_uuid;
        //cc.log(Editor.serialize(sprite));

        AssetLibrary.loadAsset(grossiniSprite_uuid, function (err, asset) {
            if (err) {
                ok(false, err.errorMessage);
                return start();
            }
            clearTimeout(timerId);
            ok(asset.texture, 'can load depends asset');
            strictEqual(asset.texture.height, 123, 'can get height');
            if (TestHostFile) {
                ok(asset.texture.image, 'can load depends asset\'s host');
            }
            start();
        });
        var timerId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 2000);
    });

    asyncTest('load asset with depends asset recursively if no cache', function () {
        AssetLibrary.loadAsset(selfReferenced_uuid, function (err, asset) {
            if (err) {
                ok(false, err.errorMessage);
                return start();
            }
            clearTimeout(timerId);
            
            ok(asset.texture === asset, 'asset could reference to itself');
            start();
        }, {
            readMainCache: false,
            writeMainCache: false,
        });
        var timerId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 200);
    });

    asyncTest('load asset with circle referenced dependencies', function () {
        AssetLibrary.loadAsset(circleReferenced_uuid, function (err, asset) {
            if (err) {
                ok(false, err.errorMessage);
                return start();
            }
            clearTimeout(timerId);
            ok(asset.dependency, 'can load circle referenced asset');
            strictEqual(asset.dependency.dependency, asset, 'circle referenced asset should have dependency which equal to self');
            start();
        });
        var timerId = setTimeout(function () {
            ok(false, 'time out!');
            start();
        }, 200);
    });

})();
