(function () {

    module('JSON packer/unpacker');

    test('unpack from empty package', function () {
        cc.assetManager.packManager.unpack([], [1,0,0,[],0,[]], '.json', null, function (err, data) {
            var res = data['non-exists key'];
            ok(!res, 'chould not unpack if key is invalid');
        });
    });

    if (!TestEditorExtends) {
        return;
    }

    test('pack nothing', function () {
        var packer = new Editor.JsonPacker();
        var res = packer.pack();
        ok(res.indices, 'should pack empty indices');
        ok(res.data && typeof res.data === 'string', 'should pack empty data');
    });

    var KEY1 = 'amitabha';
    var JSON1 = Editor.serializeCompiled({
        __born__: 1985,
        $$: 'Amoy'
    }, { stringify: false });

    var KEY2 = 'hallelujah';
    var JSON2 = Editor.serializeCompiled([{
        text: 'hallelujah\nalujah\\alujah...\uD83D\uDE02'
    }], { stringify: false });

    test('pack and unpack something', function () {
        var packer = new Editor.JsonPacker();
        packer.add(KEY2, JSON.parse(JSON.stringify(JSON2)));
        packer.add(KEY1, JSON.parse(JSON.stringify(JSON1)));
        var res = packer.pack();

        ok(res.indices.indexOf(KEY1) !== -1 && res.indices.indexOf(KEY2) !== -1, 'should generate index data when packing');

        cc.assetManager.packManager.unpack(res.indices, JSON.parse(res.data), '.json', null, function (err, data) {
            // ignore headers
            JSON1[0] = data[KEY1 + '@import'][0];
            JSON2[0] = data[KEY2 + '@import'][0];

            deepEqual(data[KEY1 + '@import'], JSON1, 'should unpack JSON1');
            deepEqual(data[KEY2 + '@import'], JSON2, 'should unpack JSON2');
        });
    });

    test('unpack unused script', function () {
        var KEY1 = 'amitafasbha';
        let Class1 = cc.Class({
            name: KEY1
        });
        var KEY2 = 'hallelujafsdh';
        let Class2 = cc.Class({
            name: KEY2
        });
        var JSON1 = Editor.serializeCompiled(new Class1(), { stringify: false });
        var JSON2 = Editor.serializeCompiled(new Class2(), { stringify: false });

        var packer = new Editor.JsonPacker();
        packer.add(KEY1, JSON.parse(JSON.stringify(JSON1)));
        packer.add(KEY2, JSON.parse(JSON.stringify(JSON2)));
        var res = packer.pack();

        cc.js.unregisterClass(Class2);

        cc.assetManager.packManager.unpack(res.indices, JSON.parse(res.data), '.json', null, function (err, data) {
            let json1 = data[KEY1 + '@import'];
            let json2 = data[KEY2 + '@import'];

            let { deserialize: deserializeCompiled } = cc._Test.deserializeCompiled;
            let obj1 = deserializeCompiled(json1);
            ok(obj1 instanceof Class1, 'Could deserialize json1 when other script not loaded');

            cc.js._setClassId(KEY2, Class2);
            let obj2 = deserializeCompiled(json2);
            ok(obj2 instanceof Class2, 'Could deserialize json2 once script loaded lazily');
        });

        cc.js.unregisterClass(Class1, Class2);
    });
})();

(function () {

    module('Texture packer/unpacker');

    test('unpack from empty package', function () {
        cc.assetManager.packManager.unpack([], { type: cc.js._getClassId(cc.Texture2D), data: ''}, '.json', null, function (err, data) {
            var res = data['non-exists key'];
            ok(!res, 'chould not unpack if key is invalid');
        });
    });

    if (!TestEditorExtends) {
        return;
    }

    test('pack nothing', function () {
        var packer = new Editor.TextureAssetPacker();
        var res = packer.pack();
        ok(res.indices, 'should pack empty indices');
        ok(res.data && typeof res.data === 'string', 'should pack empty data');
    });

    var tex1 = new cc.Texture2D();
    tex1._uuid = '555AC';
    tex1._setRawAsset('.png');
    var tex1Json = Editor.serializeCompiled(tex1, { stringify: false, noNativeDep: false });

    var tex2 = new cc.Texture2D();
    tex2._uuid = '08T18';
    tex2._setRawAsset('.jare');
    var tex2Json = Editor.serializeCompiled(tex2, { stringify: false, noNativeDep: false });

    test('pack and unpack something', function () {
        var packer = new Editor.TextureAssetPacker();
        packer.add(tex1._uuid, tex1Json);
        packer.add(tex2._uuid, tex2Json);
        var res = packer.pack();

        ok(res.indices.indexOf(tex1._uuid) !== -1 && res.indices.indexOf(tex2._uuid) !== -1, 'should generate index data when packing');

        cc.assetManager.packManager.unpack(res.indices, JSON.parse(res.data), '.json', null, function (err, data) {
            deepEqual(data[tex1._uuid + '@import'], tex1Json, 'should unpack tex1');
            deepEqual(data[tex2._uuid + '@import'], tex2Json, 'should unpack tex2');
        });
    });
})();
