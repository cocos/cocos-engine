(function () {

    module('Texture');

    if (TestEditorExtends) {

        function serializedAs (obj, expect, info) {
            deepEqual(JSON.parse(Editor.serialize(obj)), expect, info);
        }

        test('nativeUrl', function () {
            var tex = new cc.Texture2D();
            tex._uuid = '555AC';
            tex._setRawAsset('.png');
            ok(tex.nativeUrl.endsWith('.png'), 'nativeUrl should contains extname');
        });

        test('(de)serialize empty texture', function () {
            var tex = new cc.Texture2D();
            var expected = {
                __type__: 'cc.Texture2D',
                content: ''
            };
            serializedAs(tex, expected, 'should be serialized');

            var deserialized = cc.deserialize(expected);
            strictEqual(deserialized.nativeUrl, '', 'nativeUrl should be empty string by default');
            strictEqual(deserialized.url, '', 'url should be empty string by default');
        });

        function testSerializationOfUrl (extname) {
            test('(de)serialize ' + extname + ' texture asset', function () {
                var tex = new cc.Texture2D();

                tex._uuid = '555AC';
                tex._setRawAsset('.png');
                tex.url = tex.nativeUrl;
                ok(tex.url.endsWith('.png'), 'url should contains extname');

                var expected = {
                    __type__: 'cc.Texture2D',
                    content: '0'
                };
                serializedAs(tex, expected, 'should be serialized');

                var deserialized = cc.deserialize(expected, null, {
                    customEnv: { uuid: tex._uuid }
                });
                deserialized._uuid = tex._uuid;
                strictEqual(deserialized.nativeUrl, tex.nativeUrl, 'nativeUrl should be deserialized');
                strictEqual(deserialized.url, tex.url, 'url should be deserialized');
            });
        }
        testSerializationOfUrl('.png');
        testSerializationOfUrl('.jareguo');
    }

})();