(function () {

    module('Texture');

    if (TestEditorExtends) {

        function serializedAs (obj, expect, info) {
            deepEqual(JSON.parse(Editor.serialize(obj)), expect, info);
        }

        test('rawUrl', function () {
            var tex = new cc.Texture2D();
            tex._uuid = '555AC';
            tex._setRawFiles(['.png']);
            ok(tex.rawUrl.endsWith('.png'), 'rawUrl should contains extname');
        });

        test('(de)serialize empty texture', function () {
            var tex = new cc.Texture2D();
            var expected = {
                __type__: 'cc.Texture2D',
                content: ''
            };
            serializedAs(tex, expected, 'should be serialized');

            var deserialized = cc.deserialize(expected);
            strictEqual(deserialized.rawUrl, '', 'rawUrl should be empty string by default');
            strictEqual(deserialized.url, '', 'url should be empty string by default');
        });

        function testSerializationOfUrl (extname) {
            test('(de)serialize ' + extname + ' texture asset', function () {
                var tex = new cc.Texture2D();

                tex._uuid = '555AC';
                tex._setRawFiles(['.png']);
                tex.url = tex.rawUrl;
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
                strictEqual(deserialized.rawUrl, tex.rawUrl, 'rawUrl should be deserialized');
                strictEqual(deserialized.url, tex.url, 'url should be deserialized');
            });
        }
        testSerializationOfUrl('.png');
        testSerializationOfUrl('.jareguo');
    }

})();