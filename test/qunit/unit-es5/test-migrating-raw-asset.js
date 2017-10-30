if (TestEditorExtends) {
    (function () {

        module('Migrating Raw Assets');

        test('serialization if declared in the OLD way', function () {
            // setup
            var MyAsset = cc.Class({
                name: 'MyAsset',
                properties: {
                    ref_full: {
                        url: cc.Texture2D,
                        default: "",
                    },
                    ref_brief: cc.Texture2D,
                }
            });
            var asset = new MyAsset();
            asset.ref_full = 'foo';
            asset.ref_brief = 'foo';

            // serialize
            var restore = Editor.Utils.UuidCache.urlToUuid;
            Editor.Utils.UuidCache.urlToUuid = function (url) {
                return {
                    foo: '01',
                }[url];
            };
            var serializedAsset = Editor.serialize(asset);
            Editor.Utils.UuidCache.urlToUuid = restore;

            // deserialize
            var deserializedAsset = cc.deserialize(serializedAsset, null, {createAssetRefs: true});

            // test
            ok(deserializedAsset.ref_full._uuid === '01', 'should support serialization if declared in full form');
            ok(deserializedAsset.ref_brief._uuid === '01', 'should support serialization if declared in brief form');

            //teardown
            cc.js.unregisterClass(MyAsset);
        });

        test('serialization if declared in the NEW way', function () {
            // setup
            var MyAsset = cc.Class({
                name: 'MyAsset',
                properties: {
                    ref_full: {
                        type: cc.Texture2D,
                        default: null,
                    },
                    // TODO - uncomment in 2.0
                    // ref_brief: cc.Texture2D,
                }
            });
            var asset = new MyAsset();
            asset.ref_full = new cc.Texture2D();
            asset.ref_full._uuid = '01';
            // asset.ref_brief = asset.ref_full;

            // serialize
            var restore = Editor.Utils.UuidCache.urlToUuid;
            Editor.Utils.UuidCache.urlToUuid = function (url) {
                return {
                    foo: '01',
                }[url];
            };
            var serializedAsset = Editor.serialize(asset);
            Editor.Utils.UuidCache.urlToUuid = restore;

            // deserialize
            var deserializedAsset = cc.deserialize(serializedAsset, null, {createAssetRefs: true});

            // test
            ok(deserializedAsset.ref_full._uuid === '01', 'should support serialization if declared in full form');
            // ok(deserializedAsset.ref_brief._uuid === '01', 'should support serialization if declared in brief form');

            //teardown
            cc.js.unregisterClass(MyAsset);
        });
    })();
}
