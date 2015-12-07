if (TestEditorExtends) {

    test('undo destroy', function () {
        var Type = cc.Class({
            extends: cc.Object
        });
        var obj1 = new Type();
        var record = Editor._recordObject(obj1);
        obj1.destroy();
        Editor._restoreObject(obj1, record);
        cc.Object._deferredDestroy();
        ok(obj1.isValid, 'it should be valid if restored before _deferredDestroy');

        obj1.destroy();
        cc.Object._deferredDestroy();
        Editor._restoreObject(obj1, record);
        ok(obj1.isValid, 'it should be valid if restored after _deferredDestroy');
    });

}
