if (TestEditorExtends) {

    largeModule('Serialize');

    test('deserialize missing script', function () {

        var MissingScript = cc.Class({
            name: 'MissingScript',
            properties: {
                _$erialized: null
            },
            statics: {
                safeFindClass: function (id) {
                    return cc.js.getClassById(id) || MissingScript;
                }
            }
        });

        var ToMiss = cc.Class({
            name: 'ToMiss',
            properties: {
                ref: null
            }
        });

        var obj = new ToMiss();
        obj.ref = new cc.Object();

        var lastData = EditorExtends.serialize(obj);
        delete obj.__id__;
        delete obj.ref.__id__;
        cc.js.unregisterClass(ToMiss);

        // deserialize

        var missed = cc.deserialize(lastData, null, {classFinder: MissingScript.safeFindClass});

        var expectBackup = {
            "__type__": "ToMiss",
            "ref": obj.ref,
        };
        deepEqual(missed._$erialized, expectBackup, 'can deserialize missing script');

        // serialize

        reSerialized = EditorExtends.serialize(missed, {stringify: false});
        delete obj.ref.__id__;
        deepEqual(reSerialized, JSON.parse(lastData), 'can serialize missing script as its original data');

        //// re deserialize after fixed, no need to test ;)
        //cc.setClassName('ToMiss', ToMiss);
        //var recovered = cc.deserialize(reSerialized);
        //deepEqual(recovered, obj, 'can deserialize correctly after script fixed');
        //cc.unregisterClass(ToMiss);
    });
}