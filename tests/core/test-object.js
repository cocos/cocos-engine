largeModule('fobject');

var CCObject = cc.Object;

test('basic test', function () {
    var obj = new CCObject();
    strictEqual(obj.__classname__, 'cc.Object', 'class name');
    strictEqual(obj.isValid, true, 'valid');
});

test('destroyImmediate', 2, function () {
    var obj = new CCObject();

    obj._onPreDestroy = function () {
        ok(true, 'destroy callback called');
    };

    obj._destroyImmediate();

    strictEqual(obj.isValid, false, 'destroyed');

    obj._onPreDestroy = function () {
        ok(false, 'can only destroyed once');
    };
});

test('cc.isValid', function () {
    var obj = new CCObject();
    strictEqual(cc.isValid(obj), true, 'valid');
    strictEqual(cc.isValid(0), true, '0 is valid');

    obj._destroyImmediate();

    strictEqual(cc.isValid(obj), false, 'destroyed');

    obj = undefined;

    strictEqual(cc.isValid(), false, 'undefined return false 1');
    strictEqual(cc.isValid(obj), false, 'undefined return false 2');
    strictEqual(cc.isValid(null), false, 'null return false');

    var obj2 = new CCObject();
    obj2.destroy();
    strictEqual(cc.isValid(obj2), true, 'still valid in this frame');
    strictEqual(cc.isValid(obj2, true), false, 'indicates whether it will be destroyed');
});

test('deferred destroy', function () {
    var obj = new CCObject();

    obj._onPreDestroy = function () {
        ok(false, 'should not callback');
    };

    obj.destroy();

    // frame 1

    strictEqual(obj.isValid, true, 'still available in frame 1');
    strictEqual(cc.isValid(obj), true, 'still available in frame 1');

    obj._onPreDestroy = function () {
        ok(true, 'should callback');
    };

    CCObject._deferredDestroy();

    strictEqual(obj.isValid, false, 'deleted at the end of frame 1');
    strictEqual(cc.isValid(obj), false, 'deleted at the end of frame 1');

    obj._onPreDestroy = function () {
        ok(false, 'should not callback anymore');
    };

    // frame 2

    var obj2 = new CCObject();
    obj2.destroy();

    strictEqual(obj2.isValid, true, 'still available in frame 2');

    CCObject._deferredDestroy();

    strictEqual(obj2.isValid, false, 'deleted at the end of frame 2');
});

test('realDestroyInEditor', function () {
    var isEditor = CC_EDITOR;
    var isUpdating = cc.engine._isUpdating;
    cc.engine._isUpdating = false;
    CC_EDITOR = true;

    var obj = new CCObject();
    obj.name = 'wocou';
    obj.destroy();
    CCObject._deferredDestroy();

    strictEqual(obj.name, 'wocou', 'should not destroyed really');
    strictEqual(obj.isRealValid, true, 'isRealValid should be true');

    obj.realDestroyInEditor();

    strictEqual(obj.name, '', 'should be destroyed really');
    strictEqual(obj.isRealValid, false, 'isRealValid should be false');

    CC_EDITOR = isEditor;
    cc.engine._isUpdating = isUpdating;
});

test('multiply deferred destroy', function () {
    var obj1 = new CCObject();
    var obj2 = new CCObject();

    obj1.destroy();
    obj2.destroy();

    strictEqual(obj1.isValid, true, 'still available in this frame');
    strictEqual(obj2.isValid, true, 'still available in this frame');

    obj2._onPreDestroy = function () {
        ok(true, 'should callback');
    };

    CCObject._deferredDestroy();

    strictEqual(obj1.isValid, false, 'deleted at the end of frame');
    strictEqual(obj2.isValid, false, 'deleted at the end of frame');
});

test('destroy other at destroy callback', 3, function () {
    var obj1 = new CCObject();
    var obj2 = new CCObject();

    obj1.destroy();

    obj2._onPreDestroy = function () {
        ok(false, 'other should not destroyed this frame');
    };

    obj1._onPreDestroy = function () {
        obj2.destroy();
        strictEqual(obj2.isValid, true, 'other is valid until the end of next frame');
    };

    CCObject._deferredDestroy();

    obj1._onPreDestroy = function () {
        ok(false, 'should not destroyed again');
    };
    obj2._onPreDestroy = function () {
        ok(true, "should called other's destroy callback at the end of next frame");
    };

    CCObject._deferredDestroy();

    strictEqual(obj2.isValid, false, 'other should destroyed at the end of next frame');
});

test('destruct', function () {
    CCObject.__destruct__ = null;   // allow to parse dynamic properties

    var obj1 = new CCObject();

    // add dynamic value to instance
    obj1.function_value = function () {return 342};
    obj1.string_value = 'test string';
    obj1.object_value = [];

    obj1._destroyImmediate();
    equal(obj1.string_value, false, 'string value in instance will be null');
    equal(obj1.function_value, null, 'method in instance will be null');
    equal(obj1.object_value, null, 'object in instance will be null');
    ok(obj1._destruct, 'should not effect prototype method');

    // 原型继承测试
    var Sub = function () {
        CCObject.call(this);
        this.array = [];
    };
    cc.js.extend(Sub, CCObject);
    Sub.prototype.test_function = function () {return 342};
    Sub.prototype.test_boolean = true;
    Sub.prototype.test_string = 'test string';
    var inherited1 = new Sub();
    inherited1.object_value = [1,2];
    inherited1.function_value = {};
    inherited1.string_value = 'test string';

    var inherited2 = new Sub();

    inherited1._destroyImmediate();
    ok(!inherited1.object_value &&
       !inherited1.string_value &&
       !inherited1.function_value, 'should remove instance value');
    ok(inherited1._destruct, 'will not effect prototype method');
    ok(inherited2.array, 'should not effect other instance value');

    // CCClass test
    var Class = cc.Class({
        extends: CCObject,
        ctor: function () {
            this.dynamicProp = null;
        },
        properties: {
            object_value_by_default: null
        }
    });
    var previousObj = new Class();
    previousObj.object_value_by_default = true; // change to boolean
    previousObj._destroyImmediate();

    var newObj = new Class();
    newObj.object_value_by_default = [];
    newObj.dynamicProp = [];
    newObj._destroyImmediate();

    ok(!newObj.object_value_by_default , 'should always reset properties event if type changed on-the-fly');
    ok(!newObj.dynamicProp , 'should remove instance value even if defined in ctor');
});