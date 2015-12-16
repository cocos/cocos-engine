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

//asyncTest('invoke using name', function () {
//    var cb = new Callback().setDisabledMessage('method should not invokes in this frame');
//    var cb2 = new Callback().disable('method should not being called after destroyed');
//
//    var MyComp = Fire.Class({
//        extends: Component,
//        onLoad: function () {
//            this.invoke('myCallback', 0.001);
//        },
//        myCallback: cb,
//        callback2: cb2
//    });
//    cc.executeInEditMode(MyComp);
//
//    var ent = new cc.Node();
//    var comp = ent.addComponent(MyComp);
//
//    cb.enable();
//    setTimeout(function () {
//        cb.once('method should being invoked');
//
//        comp.invoke('callback2', 0);
//        comp.destroy();
//        FO._deferredDestroy();
//
//        setTimeout(function () {
//            start();
//        }, 1);
//    }, 0.001 * 1000);
//});
//
//asyncTest('cancel invoke using name', 0, function () {
//    var cb1 = new Callback().disable('method 1 should not invoked if canceled');
//
//    var MyComp = Fire.Class({
//        extends: Component,
//        myCallback1: cb1,
//    });
//    cc.executeInEditMode(MyComp);
//    var ent = new cc.Node();
//    var comp = ent.addComponent(MyComp);
//
//    comp.invoke('myCallback1', 0.001);
//    comp.invoke('myCallback1', 0.001);
//
//    comp.cancelInvoke('myCallback1');
//
//    setTimeout(start, 0.001 * 1000);
//});
//
//asyncTest('invoke using function', function () {
//    var cb = new Callback().setDisabledMessage('method should not invokes in this frame');
//    var cb2 = new Callback().disable('method should not being called after destroyed');
//
//    var MyComp = Fire.Class({
//        extends: Component,
//        onLoad: function () {
//            this.invoke(this.myCallback, 0.001);
//        },
//        myCallback: cb,
//        callback2: cb2
//    });
//    cc.executeInEditMode(MyComp);
//
//    var ent = new cc.Node();
//    var comp = ent.addComponent(MyComp);
//
//    cb.enable();
//    setTimeout(function () {
//        cb.once('method should being invoked');
//
//        comp.invoke(comp.callback2, 0);
//        comp.destroy();
//        FO._deferredDestroy();
//
//        setTimeout(function () {
//            start();
//        }, 1);
//    }, 0.001 * 1000);
//});
//
//asyncTest('cancel invoke using id', 0, function () {
//    var cb1 = new Callback().disable('method 1 should not invoked if canceled');
//
//    var MyComp = Fire.Class({
//        extends: Component,
//        myCallback1: cb1,
//    });
//    cc.executeInEditMode(MyComp);
//    var ent = new cc.Node();
//    var comp = ent.addComponent(MyComp);
//
//    var id1 = comp.invoke(comp.myCallback1, 0.001);
//    comp.cancelInvoke(id1);
//
//    setTimeout(start, 0.001 * 1000);
//});
//
//asyncTest('repeat using name', function () {
//    var cb = new Callback(function () {
//        if (cb.calledCount > 1) {
//            ok(true, 'method should being invoked repeatedly');
//            cb.disable();
//            comp.cancelRepeat('myCallback');
//            clearTimeout(stopId);
//            start();
//        }
//    }).enable();
//
//    var MyComp = Fire.Class({
//        extends: Component,
//        myCallback: cb,
//    });
//    cc.executeInEditMode(MyComp);
//
//    var ent = new cc.Node();
//    var comp = ent.addComponent(MyComp);
//
//    comp.repeat('myCallback', 0);
//
//    var stopId = setTimeout(function () {
//        ok(false, 'Timeout: method should being invoked repeatedly');
//        start();
//    }, 100);
//});
//
//asyncTest('repeat using function', function () {
//    var cb = new Callback(function () {
//        if (cb.calledCount > 1) {
//            ok(true, 'method should being invoked repeatedly');
//            cb.disable();
//            comp.cancelRepeat(repeatId);
//            clearTimeout(stopId);
//            start();
//        }
//    }).enable();
//
//    var MyComp = Fire.Class({
//        extends: Component,
//        myCallback: cb,
//    });
//    cc.executeInEditMode(MyComp);
//
//    var ent = new cc.Node();
//    var comp = ent.addComponent(MyComp);
//
//    var repeatId = comp.repeat(cb, 0);
//
//    var stopId = setTimeout(function () {
//        ok(false, 'Timeout: method should being invoked repeatedly');
//        start();
//    }, 100);
//});
