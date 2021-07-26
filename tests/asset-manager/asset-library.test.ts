
import { AssetLibrary } from "../../cocos/core/asset-manager/deprecated";

describe('asset-library', () => {

    var libPath = '../fixture'                                                                                                                                                                                                                                                                                                                                      'fixtures/library';
    var grossini_uuid = '748321';
    var grossiniSprite_uuid = '1232218';
    var selfReferenced_uuid = '123200';
    var circleReferenced_uuid = '65535';

    //_resetGame();
    AssetLibrary.init({libraryPath: libPath});

    test('load asset with raw', function () {
        //var texture = new TestTexture();
        //texture.height = 123;
        //texture.width = 321;
        //cc.log(EditorExtends.serialize(texture));

        AssetLibrary.loadAsset(grossini_uuid, function (err, asset) {
            expect(asset).toBeTruthy();
            expect(asset.width).toBe(321);
            expect(asset.height).toBe(123);
            expect(asset.image).toBeTruthy();
        });
    }, 1000);

    test('load asset with depends asset', function () {
        //var sprite = new cc.SpriteFrame();
        //sprite.texture = new TestTexture();
        //sprite.texture._uuid = grossini_uuid;
        //cc.log(EditorExtends.serialize(sprite));

        AssetLibrary.loadAsset(grossiniSprite_uuid, function (err, asset) {
            expect(err).toBeNull();
            expect(asset.texture).toBeTruthy();
            expect(asset.texture.height).toBe(123);
            expect(asset.texture.image).toBeTruthy();
        });
    }, 2000);

    test('load asset with depends asset recursively if no cache', function () {
        AssetLibrary.loadAsset(selfReferenced_uuid, function (err, asset) {
            expect(err).toBeNull();
            expect(asset.texture).toBe(asset);
        }, {
            readMainCache: false,
            writeMainCache: false,
        });
    }, 200);

    test('load asset with circle referenced dependencies', function () {
        AssetLibrary.loadAsset(circleReferenced_uuid, function (err, asset) {
            expect(err).toBeNull();
            expect(asset.dependency).toBeTruthy();
            expect(asset.dependency.dependency).toBe(asset);
        });
    }, 200);
});
