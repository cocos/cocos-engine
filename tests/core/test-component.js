largeModule('Component', SetupEngine);

test('Inheritance of editor properties', function () {
    var base = cc.Class({
        extends: cc.Component,
        editor: {
            inspector: 'jare.html',
            icon: 'guo.png',
            executeInEditMode: true,
            playOnFocus: true,
        }
    });
    var child = cc.Class({
        extends: base
    });
    ok(!child._inspector, 'should not inherit inspector from base component');
    ok(!child._icon, 'should not inherit icon from base component');
    strictEqual(child._executeInEditMode, true, 'should inherit executeInEditMode from base component');
    strictEqual(child._playOnFocus, true, 'should inherit playOnFocus from base component');
});

test('_isOnLoadCalled', function () {
    var Comp = cc.Class({
        extends: cc.Component,
        onLoad: function () {
            this.updateSprite();
        },
        updateSprite: function () {
            equal(!!this._isOnLoadCalled, false, 'it should be false during onLoad');
        },
    });

    var node = new cc.Node();
    cc.director.getScene().addChild(node);
    var comp = node.addComponent(Comp);

    equal(!!comp._isOnLoadCalled, true, 'it should be true after onLoad');
});
