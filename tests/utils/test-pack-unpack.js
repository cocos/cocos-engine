(function () {

    module('JSON packer/unpacker');

    test('unpack from empty package', function () {
        var unpacker = new cc._Test.JsonUnpacker();
        var res = unpacker.retrieve('non-exists key');
        ok(!res, 'chould not unpack if key is invalid');
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
    var JSON1 = {
        __born__: 1985,
        $$: 'Amoy'
    };
    var KEY2 = 'hallelujah';
    var JSON2 = [{
        text: 'hallelujah\nalujah\\alujah...\uD83D\uDE02'
    }];

    test('pack and unpack something', function () {
        var packer = new Editor.JsonPacker();
        packer.add(KEY2, JSON2);
        packer.add(KEY1, JSON1);
        var res = packer.pack();

        ok(res.indices.indexOf(KEY1) !== -1 && res.indices.indexOf(KEY2) !== -1, 'should generate index data when packing');

        var unpacker = new cc._Test.JsonUnpacker();
        unpacker.load(res.indices, JSON.parse(res.data));
        deepEqual(unpacker.retrieve(KEY1), JSON1, 'should unpack JSON1');
        deepEqual(unpacker.retrieve(KEY2), JSON2, 'should unpack JSON2');
    });
})();

(function () {

    module('Texture packer/unpacker');

    test('unpack from empty package', function () {
        var unpacker = new cc._Test.TextureUnpacker();
        var res = unpacker.retrieve('non-exists key');
        ok(!res, 'chould not unpack if key is invalid');
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
    var tex1Json = EditorExtends.serialize(tex1, { stringify: false, noNativeDep: false });

    var tex2 = new cc.Texture2D();
    tex2._uuid = '08T18';
    tex2._setRawAsset('.jare');
    var tex2Json = EditorExtends.serialize(tex2, { stringify: false, noNativeDep: false });

    test('pack and unpack something', function () {
        var packer = new Editor.TextureAssetPacker();
        packer.add(tex1._uuid, tex1Json);
        packer.add(tex2._uuid, tex2Json);
        var res = packer.pack();

        ok(res.indices.indexOf(tex1._uuid) !== -1 && res.indices.indexOf(tex2._uuid) !== -1, 'should generate index data when packing');

        var unpacker = new cc._Test.TextureUnpacker();
        unpacker.load(res.indices, JSON.parse(res.data));
        deepEqual(unpacker.retrieve(tex1._uuid), tex1Json, 'should unpack tex1');
        deepEqual(unpacker.retrieve(tex2._uuid), tex2Json, 'should unpack tex2');
    });
})();
