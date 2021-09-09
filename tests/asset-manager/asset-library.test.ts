
import { AssetLibrary } from "../../cocos/core/asset-manager/deprecated";

describe('asset-library', () => {

    const libPath = './tests/fixtures/library';                                                                                                                                                                                                                                                                                                                                     'fixtures/library';
    var grossini_uuid = '748321';
    var grossiniSprite_uuid = '1232218';
    var selfReferenced_uuid = '123200';
    var circleReferenced_uuid = '65535';

    //_resetGame();
    AssetLibrary.init({libraryPath: libPath});

    test.concurrent('load asset with raw', function () {
        //var texture = new TestTexture();
        //texture.height = 123;
        //texture.width = 321;
        //cc.log(EditorExtends.serialize(texture));
        return new Promise<void>((resolve, reject) => {
            AssetLibrary.loadAsset(grossini_uuid, function (err, asset) {
                expect(asset).toBeTruthy();
                expect(asset.width).toBe(321);
                expect(asset.height).toBe(123);
                expect(asset.image).toBeTruthy();
                resolve();
            });
        });
    }, 1000);

    test.concurrent('load asset with depends asset', function () {
        //var sprite = new cc.SpriteFrame();
        //sprite.texture = new TestTexture();
        //sprite.texture._uuid = grossini_uuid;
        //cc.log(EditorExtends.serialize(sprite));
        return new Promise<void>((resolve, reject) => {
            AssetLibrary.loadAsset(grossiniSprite_uuid, function (err, asset) {
                expect(err).toBeNull();
                expect(asset.texture).toBeTruthy();
                expect(asset.texture.height).toBe(123);
                expect(asset.texture.image).toBeTruthy();
                resolve();
            });
        });
    }, 2000);

    test.concurrent('load asset with depends asset recursively if no cache', function () {
        return new Promise<void>((resolve, reject) => {
            AssetLibrary.loadAsset(selfReferenced_uuid, function (err, asset) {
                expect(err).toBeNull();
                expect(asset.texture).toBe(asset);
                resolve();
            }, {
                readMainCache: false,
                writeMainCache: false,
            });
        });
    }, 200);

    test.concurrent('load asset with circle referenced dependencies', function () {
        return new Promise<void>((resolve, reject) => {
            AssetLibrary.loadAsset(circleReferenced_uuid, function (err, asset) {
                expect(err).toBeNull();
                expect(asset.dependency).toBeTruthy();
                expect(asset.dependency.dependency).toBe(asset);
                resolve();
            });
        });
    }, 200);
});
