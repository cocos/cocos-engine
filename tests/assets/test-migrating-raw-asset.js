if (TestEditorExtends) {
    (function () {

        module('Migrating Raw Assets');

        test('serialization if declared in the OLD way', function () {
            // setup
            var sysWarn = cc.warn;
            cc.warn = Callback().enable();
            var MyAsset = cc.Class({
                name: 'MyAsset',
                properties: {
                    ref_full: {
                        url: cc.Texture2D,
                        default: "",
                    },
                    ref_full_array: {
                        url: cc.Texture2D,
                        default: [],
                    },
                    ref_brief: cc.Texture2D,
                    ref_brief_array: [cc.Texture2D],
                }
            });
            strictEqual(cc.warn.calledCount, 2, 'should trigger warnings if declared in deprecated way');
            cc.warn = sysWarn;

            var asset = new MyAsset();
            asset.ref_full = 'foo';
            asset.ref_full_array = ['foo'];
            asset.ref_brief = 'foo';
            asset.ref_brief_array = ['foo'];

            // serialize
            var sysUrlToUuid = Editor.Utils.UuidCache.urlToUuid;
            Editor.Utils.UuidCache.urlToUuid = function (url) {
                return {
                    foo: '01',
                }[url];
            };
            var serializedAsset = Editor.serialize(asset);
            Editor.Utils.UuidCache.urlToUuid = sysUrlToUuid;

            // deserialize
            var details = new cc.deserialize.Details();
            var deserializedAsset = cc.deserialize(serializedAsset, details, {createAssetRefs: true});

            // test
            ok(details._stillUseUrl[0] &&
               details._stillUseUrl[1] &&
               details._stillUseUrl[2] &&
               details._stillUseUrl[3], 'should deserialize them as url');

            ok(deserializedAsset.ref_full._uuid === '01', 'should support serialization if declared in full form');
            ok(deserializedAsset.ref_full_array[0]._uuid === '01', 'should support serialization if array declared in full form');
            ok(deserializedAsset.ref_brief._uuid === '01', 'should still support serialization if declared in deprecated form');
            ok(deserializedAsset.ref_brief_array[0]._uuid === '01', 'should still support serialization if array declared in deprecated form');

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
                    ref_full_array: {
                        type: cc.Texture2D,
                        default: []
                    },
                    // TODO - uncomment in 2.0
                    // ref_brief: cc.Texture2D,
                    // ref_brief_array: [cc.Texture2D],
                }
            });
            var asset = new MyAsset();
            asset.ref_full = new cc.Texture2D();
            asset.ref_full._uuid = '01';
            asset.ref_full_array.push(asset.ref_full);
            // asset.ref_brief = asset.ref_full;
            // asset.ref_brief_array.push(asset.ref_full);

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
            ok(deserializedAsset.ref_full_array[0]._uuid === '01', 'should support serialization if array declared in full form');
            // ok(deserializedAsset.ref_brief._uuid === '01', 'should support serialization if declared in brief form');
            // ok(deserializedAsset.ref_brief_array[0]._uuid === '01', 'should support serialization if declared in brief form');

            //teardown
            cc.js.unregisterClass(MyAsset);
        });
    })();
}
