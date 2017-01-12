module('JSON packer/unpacker');

(function () {

    if (!TestEditorExtends) {
        return;
    }

    var KEY1 = 'amitabha';
    var JSON1 = {
        __born__: 1985,
        $$: 'Amoy'
    };
    var KEY2 = 'hallelujah';
    var JSON2 = [{
        text: 'hallelujah\nalujah\\alujah...\uD83D\uDE02'
    }];

    test('pack nothing', function () {
        var packer = new Editor.JsonPacker();
        var res = packer.pack();
        ok(res.indices, 'should pack empty indices');
        ok(res.data && typeof res.data === 'string', 'should pack empty data');
    });

    test('unpack nothing', function () {
        var unpacker = new cc._Test.JsonUnpacker();
        var res = unpacker.retrieve('non-exists key');
        ok(!res, 'chould not unpack if key is invalid');
    });

    test('pack something', function () {
        var packer = new Editor.JsonPacker();
        packer.add(KEY2, JSON2);
        packer.add(KEY1, JSON1);
        var res = packer.pack();

        ok(res.indices.indexOf(KEY1) !== -1 && res.indices.indexOf(KEY2) !== -1, 'should generate index data when packing');

        var unpacker = new cc._Test.JsonUnpacker();
        unpacker.read(res.indices, res.data);
        deepEqual(unpacker.retrieve(KEY1), JSON1, 'should unpack JSON1');
        deepEqual(unpacker.retrieve(KEY2), JSON2, 'should unpack JSON2');
    });

    //test('unpack speed', function () {
    //    var bigJson = Editor.serialize(new cc.Node());
    //    var packer = new Editor.JsonPacker();
    //    for (var i = 0; i < 100; ++i) {
    //        packer.add('' + i, bigJson);
    //    }
    //    var res = packer.pack();
    //
    //    console.time('unpack time');
    //
    //    var unpacker = new cc._Test.JsonUnpacker();
    //    unpacker.read(res.indices, res.data);
    //    for (var i = 0; i < 100; ++i) {
    //        unpacker.retrieve('' + i);
    //    }
    //
    //    console.timeEnd('unpack time');
    //    ok(true);
    //});
})();
