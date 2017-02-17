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

test('should not cause an infinite loops if re-activated in onLoad', function () {
    var Comp = cc.Class({
        extends: cc.Component,
        onLoad: function () {
            this.node.active = false;
            this.node.active = true;
        }
    });

    var node = new cc.Node();
    cc.director.getScene().addChild(node);
    var comp = node.addComponent(Comp);
    ok('done');
});

// Since the modification event-listeners.js will lead to test ‘remove and add again during invoking’ infinite loop
//test('start of the component which created during another start', function () {
//    var TestComp = cc.Class({
//        extends: cc.Component,
//        start: function () {
//            strictEqual(this.inited, true, 'should be called after another start finished');
//        }
//    });
//
//    var node = new cc.Node();
//    cc.director.getScene().addChild(node);
//    var comp = node.addComponent(cc.Component);
//    comp.start = function () {
//        var test = new cc.Node();
//        var testComp = test.addComponent(TestComp);
//        this.node.addChild(test);
//        testComp.inited = true;
//    };
//});

test('start', function () {
    var TestComp = cc.Class({
        extends: cc.Component,
        start: function () {
            this.inited = true;
        },
        update: function (dt) {
            strictEqual(this.inited, true, 'should always invoke before update');
            this.enable = false;
        }
    });

    var node = new cc.Node();
    var comp = node.addComponent(cc.Component);
    comp.start = function () {
        var test = new cc.Node();
        test.addComponent(TestComp);
        this.node.addChild(test);
    };
    comp.update = function () {
        var test = new cc.Node();
        test.addComponent(TestComp);
        this.node.addChild(test);
    };
    cc.director.getScene().addChild(node);
    // run comp
    cc.game.step();
    // run TestComp
    cc.game.step();

    // end test
    node.active = false;
});

test('start should only', function () {
    var TestComp1 = cc.Class({
        extends: cc.Component,
        start: function () {
            this.target = cc.find('node2');
            this.target.active = false;
            this.target.active = true;
        }
    });

    var called = false;
    var TestComp2 = cc.Class({
        extends: cc.Component,
        start: function () {
            strictEqual(called, false, 'start should not been called');
            called = true;
        }
    });

    var node1 = new cc.Node();
    cc.director.getScene().addChild(node1);
    node1.addComponent(TestComp1);

    var node2 = new cc.Node();
    node2.name = 'node2';
    cc.director.getScene().addChild(node2);
    node2.addComponent(TestComp2);
    // run TestComp1
    cc.game.step();
    // run TestComp2
    cc.game.step();
});

test('lateUpdate', function () {
    var TestComp = cc.Class({
        extends: cc.Component,
        update: function () {
            this.updated = true;
        },
        lateUpdate: function (dt) {
            strictEqual(this.updated, true, 'should always invoke before update');
            this.enable = false;
        }
    });

    var node = new cc.Node();
    var comp = node.addComponent(cc.Component);
    comp.update = function () {
        var test = new cc.Node();
        test.addComponent(TestComp);
        this.node.addChild(test);
        this.enabled = false;
    };
    cc.director.getScene().addChild(node);
    // run comp
    cc.game.step();
    // run TestComp
    cc.game.step();
});

//test('should not call lifecycle methods if not executeInEditMode', function () {
//    var Comp = cc.Class({
//        extends: CallbackTester,
//        ctor: function () {
//            this.notExpect(CallbackTester.OnLoad, 'onLoad');
//            this.notExpect(CallbackTester.OnEnable, 'onEnable');
//        }
//    });
//
//    var parent = new cc.Node();
//    cc.director.getScene().addChild(parent);
//    var comp = parent.addComponent(Comp);
//    comp.stopTest();
//});
