largeModule('Class ES5');

test('test', function () {

    ok(cc.Class(), 'can define empty class');

    var Animal = cc.Class({
        name: 'Animal',
        properties: {
            myName: {
                default: '...',
                tooltip: 'Float',
                displayName: 'displayName'
            },
            eat: {
                default: function () {
                    return function () {
                        return 'eating';
                    }
                }
            },
            weight: {
                default: -1,
                serializable: false
            },
            weight10: {
                type: 'Integer',
                set: function (value) {
                    this.weight = Math.floor(value / 10);
                },
                get: function () {
                    return this.weight * 10;
                }
            },
            weight5x: {
                type: 'Integer',
                get: function () {
                    return this.weight * 5;
                },
                set: function (value) {
                    this.weight = value / 5;
                },
            },
            nonEmptyObj: {
                default: function () { return [1, 2]; }
            },
            'NeedEscape:\'"\\\n\uD83D': {
                default: 'NeedEscape:\'"\\\n\uD83D'
            }
        }
    });

    strictEqual(cc.js.getClassName(Animal), 'Animal', 'get class name');

    // property

    var instance = new Animal();
    strictEqual(instance.myName, '...', 'get property');
    strictEqual(instance['NeedEscape:\'"\\\n\uD83D'], 'NeedEscape:\'"\\\n\uD83D', 'property name and string value should support escaped');
    strictEqual(instance.eat(), 'eating', 'get chained property');
    strictEqual(instance.weight, -1, 'get partial property');
    deepEqual(instance.nonEmptyObj, [1, 2], 'get non-empty default value from function');
    notEqual(instance.nonEmptyObj, (new Animal()).nonEmptyObj, 'compute non-empty default value for every object instance');

    strictEqual(cc.Class.attr(Animal, 'myName').tooltip, 'Float', 'get name tooltip');
    strictEqual(cc.Class.attr(Animal, 'myName').displayName, 'displayName', 'get name displayName');
    strictEqual(cc.Class.attr(Animal, 'weight').serializable, false, 'get attribute');

    // getter / setter

    strictEqual(instance.weight10, instance.weight * 10, 'define getter');
    instance.weight10 = 40;
    strictEqual(instance.weight10, 40, 'define setter');

    strictEqual(instance.weight5x, instance.weight * 5, 'define getter by getset');
    instance.weight5x = 30;
    strictEqual(instance.weight5x, 30, 'define setter by getset');

    // constructor

    cc.js.unregisterClass(Animal);

    var animalCtor = new Callback();
    Animal = cc.Class({
        name: 'Animal',
        ctor: animalCtor,
        properties: {
            weight: 100
        }
    });
    var labradorConstructor = new Callback();
    var Labrador = Animal.extend({
        ctor: labradorConstructor
    });

    animalCtor.enable();
    var instance1 = new Animal();
    animalCtor.once('call constructor');

    strictEqual(cc.Class.attr(Animal, 'weight').default, 100, 'can get attribute even has constructor');
    strictEqual(instance1.weight, 100, 'property inited even has constructor');

    var instance2 = new Animal();
    instance1.weight = 0;
    strictEqual(instance2.weight, 100, 'is instance property');

    var instance3 = new Animal();
    strictEqual(instance3.weight, 100, 'class define not changed');

    labradorConstructor.enable();
    animalCtor.calledCount = 0;
    var instance4 = new Labrador();
    animalCtor.once('call constructor of parent class');
    labradorConstructor.once('call constructor of child class');

    cc.js.unregisterClass(Animal, Labrador);
});

test('define property in quick way', function () {
    var Class = cc.Class({
        properties: {
            undefinedVal: undefined,
            nullVal: null,
            string: '...',
            array: [],
            node: cc.Node,
            asset: cc.SpriteFrame,
            vec2: cc.Vec2,
            vec2_one: cc.Vec2.ONE,
        }
    });
    var obj = new Class();

    strictEqual(obj.undefinedVal, undefined, 'could define default value of undefined');
    strictEqual(obj.nullVal, null, 'could define default value of null');
    strictEqual(obj.string, '...', 'could define default value of string');
    deepEqual(obj.array, [], 'could define default value of array');
    strictEqual(obj.node, null, 'could define default value of cc.Node');
    strictEqual(obj.asset, null, 'could define default value of asset');
    ok(obj.vec2.equals(cc.Vec2.ZERO), 'could define default value by using cc.Vec2');
    ok(obj.vec2_one.equals(cc.Vec2.ONE), 'could define default value by using cc.Vec2.ONE');
});

test('__values__', function () {
    var Class = cc.Class({
        properties: {
            p1: {
                serializable: false,
                default: null
            },
            p2: null
        }
    });

    deepEqual(Class.__values__, ['p2'], 'should not contain non-serializable properties');
});

test('extends', function () {
    var Animal = cc.Class({
        name: 'cc.Animal',
        properties: {
            myName: 'ann'
        }
    });
    var Dog = cc.Class({
        name: 'cc.Dog',
        extends: Animal,
        properties: {
            myName: {
                default: 'doge',
                tooltip: 'String',
                override: true
            }
        }
    });
    var Husky = cc.Class({
        name: 'cc.Husky',
        extends: Dog,
        properties: {
            weight: 100
        }
    });
    var Labrador = Dog.extend({
        name: 'cc.Labrador',
        properties: {
            clever: true
        }
    });

    strictEqual(cc.js.getClassName(Animal), 'cc.Animal', 'can get class name 1');
    strictEqual(cc.js.getClassName(Dog), 'cc.Dog', 'can get class name 2');
    strictEqual(cc.js.getClassName(Husky), 'cc.Husky', 'can get class name 3');
    strictEqual(cc.js.getClassName(Labrador), 'cc.Labrador', 'can get class name 4');

    strictEqual(Dog.$super, Animal, 'can get super');

    strictEqual(cc.Class.attr(Animal, 'myName').tooltip, undefined, "override should not change attribute of super class");
    strictEqual(cc.Class.attr(Dog, 'myName').tooltip, 'String', 'can modify attribute');
    strictEqual(cc.Class.attr(Dog, 'weight').default, undefined, 'base property not added');

    var husky = new Husky();
    var dog = new Dog();
    var labrador = new Labrador();

    strictEqual(dog.myName, 'doge', 'can override property');
    strictEqual(husky.myName, 'doge', 'can inherit property');
    strictEqual(labrador.myName, 'doge', 'can inherit property with Dog.extend syntax');

    deepEqual(Husky.__props__, /*CCObject.__props__.concat*/(['myName', 'weight']), 'can inherit prop list');
    deepEqual(Husky.__values__, ['myName', 'weight'], 'can inherit serializable list');
    deepEqual(Labrador.__props__, /*CCObject.__props__.concat*/(['myName', 'clever']), 'can inherit prop list with Dog.extend syntax');
    deepEqual(Dog.__props__, /*CCObject.__props__.concat*/(['myName']), 'base prop list not changed');
    deepEqual(Dog.__values__, ['myName'], 'base serializable list not changed');

    strictEqual(husky instanceof Dog, true, 'can pass instanceof check');
    strictEqual(husky instanceof Animal, true, 'can pass instanceof check for deep inheritance');
    strictEqual(labrador instanceof Dog, true, 'can pass instanceof check with Dog.extend syntax');

    cc.js.unregisterClass(Animal, Dog, Husky, Labrador);
});

test('extends + constructor', function () {
    var animalConstructor = Callback();
    var huskyConstructor = Callback();
    var labradorConstructor = Callback();
    var Animal = cc.Class({
        name: 'cc.Animal',
        ctor: animalConstructor,
        properties: {
            myName: 'ann'
        }
    });
    var Dog = cc.Class({
        name: 'cc.Dog',
        extends: Animal,
        properties: {
            myName: {
                default: 'doge',
                override: true
            },
        }
    });
    var Husky = cc.Class({
        name: 'cc.Husky',
        extends: Dog,
        ctor: huskyConstructor
    });
    var Labrador = Dog.extend({
        name: 'cc.Labrador',
        ctor: labradorConstructor
    });

    strictEqual(cc.js.getClassName(Dog), 'cc.Dog', 'can get class name 2');

    animalConstructor.enable();
    huskyConstructor.enable();
    labradorConstructor.enable();
    huskyConstructor.callbackFunction(function () {
        animalConstructor.once('base construct should called automatically');
    });

    var husky = new Husky();
    huskyConstructor.once('call husky constructor');

    var dog = new Dog();
    animalConstructor.once('call anim constructor by dog');

    var labrador = new Labrador();
    labradorConstructor.once('call labrador constructor');
    animalConstructor.once('call anim constructor by labrador');

    strictEqual(dog.myName, 'doge', 'can override property');
    strictEqual(husky.myName, 'doge', 'can inherit property');
    strictEqual(labrador.myName, 'doge', 'can inherit property with Dog.extend syntax');

    cc.js.unregisterClass(Animal, Dog, Husky, Labrador);
});

test('prop initial times', function () {
    var Base = cc.Class({
        properties: {
            foo: 0,
        }
    });
    var fooTester = Callback().enable();
    var instanceMocker = {
        ctor: Base,  // mock constructor of class instance,
    };
    Object.defineProperty(instanceMocker, 'foo', {
        set: fooTester
    });
    Object.defineProperty(instanceMocker, '__initProps__', {
        get: function () {
            return Base.prototype.__initProps__;
        },
        configurable: true
    });
    Base.call(instanceMocker);
    fooTester.once('property should init only once');

    var Sub = cc.Class({
        extends: Base,
        properties: {
            bar: 0,
        }
    });
    var barTester = Callback().enable();
    instanceMocker.constructor = Sub;
    Object.defineProperty(instanceMocker, 'bar', {
        set: barTester
    });
    Object.defineProperty(instanceMocker, '__initProps__', {
        get: function () {
            return Sub.prototype.__initProps__;
        },
        configurable: true
    });
    Sub.call(instanceMocker);
    fooTester.once('foo prop should init once even if inherited');
    barTester.once('bar prop should init once');
});

test('prop reference', function () {
    var type = cc.Class({
        name: 'cc.MyType',
        properties: {
            ary: [],
            vec2: {
                default: new cc.Vec2(10, 20)
            },
            dict: {
                default: {}
            }
        }
    });
    var obj1 = new type();
    var obj2 = new type();

    notStrictEqual(obj1.vec2, obj2.vec2, 'cloneable object reference not equal');
    notStrictEqual(obj1.ary, obj2.ary, 'empty array reference not equal');
    notStrictEqual(obj1.dict, obj2.dict, 'empty dict reference not equal');

    cc.js.unregisterClass(type);
});

test('isChildClassOf', function () {
    strictEqual(cc.js.isChildClassOf(null, null) ||
                cc.js.isChildClassOf(Object, null) ||
                cc.js.isChildClassOf(null, Object),  false, 'nil');

    //strictEqual(cc.js.isChildClassOf(123, Object), false, 'can ignore wrong type');
    //strictEqual(cc.js.isChildClassOf(Object, 123), false, 'can ignore wrong type 2');

    strictEqual(cc.js.isChildClassOf(Object, Object), true, 'any obj is child of itself');

    var Base = function () {};

    strictEqual(cc.js.isChildClassOf(Base, Object) &&
                ! cc.js.isChildClassOf(Object, Base), true, 'any type is child of Object');

    var Sub = function () {};
    cc.js.extend(Sub, Base);

    strictEqual(cc.js.isChildClassOf(Sub, Base) &&
                !cc.js.isChildClassOf(Base, Sub), true, 'Sub is child of Base');

    // fire class

    var Animal = cc.Class({
        name: 'cc.Animal',
        extends: Sub,
        properties: {
            name: 'ann'
        }
    });
    var Dog = cc.Class({
        name: 'cc.Dog',
        extends: Animal,
        properties: {
            name: {
                default: 'doge',
                override: true
            }
        }
    });
    var Husky = cc.Class({
        name: 'cc.Husky',
        extends: Dog,
        properties: {
            weight: 100
        }
    });
    var Labrador = Dog.extend({
        name: 'cc.Labrador',
        properties: {
            clever: true
        }
    });

    strictEqual(cc.js.isChildClassOf( Husky, Husky), true, 'Husky is child of itself');
    strictEqual(cc.js.isChildClassOf( Dog, Animal), true, 'Animal is parent of Dog');
    strictEqual(cc.js.isChildClassOf( Husky, Animal) &&
                ! cc.js.isChildClassOf( Animal, Husky), true, 'Animal is parent of Husky');
    strictEqual(cc.js.isChildClassOf( Dog, Husky), false, 'Dog is not child of Husky');
    strictEqual(cc.js.isChildClassOf( Labrador, Dog), true, 'Labrador is child of Dog');
    strictEqual(cc.js.isChildClassOf( Labrador, Animal), true, 'Labrador is child of Animal');

    strictEqual(cc.js.isChildClassOf( Animal, Sub), true, 'Animal is child of Sub');
    strictEqual(cc.js.isChildClassOf( Animal, Base), true, 'Animal is child of Base');
    strictEqual(cc.js.isChildClassOf( Dog, Base),  true, 'Dog is child of Base');

    cc.js.unregisterClass(Animal, Dog, Husky, Labrador);
});

test('statics', function () {
    var Animal = cc.Class({
        statics: {
            id: "be-bu"
        }
    });
    var Dog = cc.Class({
        extends: Animal
    });
    var Labrador = Dog.extend({
        name: 'cc.Labrador',
        statics: {
            nickName: "niuniu"
        }
    });

    strictEqual(Animal.id, "be-bu", 'can get static prop');
    strictEqual(Dog.id, "be-bu", 'can copy static prop to child class');
    strictEqual(Labrador.id, "be-bu", 'can copy static prop to child class with Dog.extend syntax');
    Animal.id = "duang-duang";
    strictEqual(Animal.id, "duang-duang", 'can set static prop');
    strictEqual(Labrador.nickName, "niuniu", 'can add static prop in child class');
    
    cc.js.unregisterClass(Animal, Dog, Labrador);
});

test('_isCCClass', function () {
    strictEqual(cc.Class._isCCClass(cc.Class({})), true, 'should be CCClass');

    function ctor () {
        this.foo = 0;
    }
    cc.Class.fastDefine('T', ctor, ['foo']);
    strictEqual(cc.Class._isCCClass(ctor), false, 'fastDefined ctor should not recognized as CCClass');

    cc.js.unregisterClass(ctor);
});

if (CC_SUPPORT_JIT) {
    test('try catch', function () {
        var originThrow = cc._throw;

        cc._throw = Callback().enable();
        var Animal = cc.Class({
            ctor: function () {
                null.foo();
            }
        });
        var animal = new Animal();
        ok(animal, 'should create new instance even if an exception occurs');
        cc._throw.once('should throw exception');

        cc._throw = originThrow;
    });
}

test('this._super', function () {
    var play = Callback();
    var getLost = Callback();
    var wagTail = Callback();
    var Dog = cc.Class({
        name: 'cc.Dog',
        play: play,
        getLost: getLost,
        wagTail: wagTail
    });
    var Husky = cc.Class({
        name: 'cc.Husky',
        extends: Dog,
        play: function () {
            this._super();
            this.getLost();
        }
    });
    var Labrador = Dog.extend({
        name: 'cc.Labrador',
        play: function () {
            this._super();
            this.wagTail();
        }
    });

    play.enable();
    getLost.enable();
    wagTail.enable();
    
    var husky = new Husky();
    husky.play();
    play.once("Husky is playing");
    getLost.once("Husky appears to be lost");

    var labrador = new Labrador();
    labrador.play();
    play.once("Labrador is playing");
    wagTail.once("Labrador is wagging its tail");

    cc.js.unregisterClass(Dog, Husky, Labrador);
});

test('property notify', function () {
    var string1 = "";
    var string2 = "";

    var Animal = cc.Class({
        properties: {
            legs: {
                default: 0,
                notify: function (oldValue) {
                    string1 = oldValue + " : " + this.legs;
                }
            },

            eyes: {
                default: 0,
                notify: function (oldValue) {
                    string2 = oldValue + " : " + this.eyes;
                }
            }
        }
    });

    var dogs = new Animal();
    dogs.legs = 4;
    dogs.eyes = 2;

    strictEqual(string1, "0 : 4", 'dogs has 4 legs');
    strictEqual(string2, "0 : 2", 'dogs has 2 eyes');
});

test('__cid__', function () {
    var Dog = cc.Class({
        name: 'cc.Dog'
    });
    var Husky = cc.Class({
        extends: Dog
    });
    var Labrador = Dog.extend({
    });

    ok(cc.js.getClassId(Dog).length > 0, "Dog's cid is not empty");
    ok(cc.js.getClassId(Husky).length > 0, "Husky's cid is not empty");
    ok(cc.js.getClassId(Labrador).length > 0, "Labrador's cid is not empty");
    notEqual(cc.js.getClassId(Dog), cc.js.getClassId(Husky), "Dog and Husky don't have the same cid");
    notEqual(cc.js.getClassId(Dog), cc.js.getClassId(Labrador), "Dog and Labrador don't have the same cid");
    notEqual(cc.js.getClassId(Labrador), cc.js.getClassId(Husky), "Labrador and Husky don't have the same cid");

    cc.js.unregisterClass(Dog, Husky, Labrador);
});

test('simplified properties define', function () {
    var Type = cc.Class({
        properties: {
            bool: true,
            string: "hello",
            number: 2,
            obj: null,
            vec2: cc.Vec2,
            vec2Val: new cc.Vec2(1, 2),
            node: cc.Node,
        }
    });

    var obj = new Type();

    strictEqual(cc.Class.attr(Type, 'vec2').type, 'Object', 'checking vec2 type');
    strictEqual(cc.Class.attr(Type, 'vec2').ctor, cc.Vec2, 'checking vec2 ctor');
    strictEqual(cc.Class.attr(Type, 'node').type, 'Object', 'checking node type');
    strictEqual(cc.Class.attr(Type, 'node').ctor, cc.Node, 'checking node ctor');

    strictEqual(obj.bool, true, 'checking bool');
    strictEqual(obj.string, "hello", 'checking string');
    strictEqual(obj.number, 2, 'checking number');
    strictEqual(obj.obj, null, 'checking obj');
    strictEqual(obj.vec2 instanceof cc.Vec2, true, 'checking vec2');
    deepEqual(obj.vec2Val, new cc.Vec2(1, 2), 'checking vec2 value');
    strictEqual(obj.node, null, 'checking node');

    var ArrayType = cc.Class({
        properties: {
            empty: [],
            bool: [cc.Boolean],
            string: [cc.String],
            float: [cc.Float],
            int: [cc.Integer],
            valueType: [cc.Vec2],
            node: [cc.Node],
            asset: {
                default: [],
                type: cc.Asset
            },
        }
    });

    var arrayObj = new ArrayType();

    strictEqual(cc.Class.attr(ArrayType, 'bool').type, cc.Boolean, 'checking array of bool type');
    strictEqual(cc.Class.attr(ArrayType, 'valueType').type, 'Object', 'checking array of vec2 type');
    strictEqual(cc.Class.attr(ArrayType, 'valueType').ctor, cc.Vec2, 'checking array of vec2 ctor');
    strictEqual(cc.Class.attr(ArrayType, 'node').type, 'Object', 'checking array of node type');
    strictEqual(cc.Class.attr(ArrayType, 'node').ctor, cc.Node, 'checking array of node ctor');

    deepEqual(arrayObj.empty, [], 'checking array of empty');
    deepEqual(arrayObj.bool, [], 'checking array of bool');
    deepEqual(arrayObj.string, [], 'checking array of string');
    deepEqual(arrayObj.valueType, [], 'checking array of valueType');
    deepEqual(arrayObj.node, [], 'checking array of node');
    deepEqual(arrayObj.asset, [], 'checking array of asset');
});

// test('call CCClass', function () {
//     var Husky = cc.Class({
//         properties: {
//             weight: 100
//         }
//     });
//     var target = {};
//     Husky.call(target);
//     strictEqual(target.weight, 100, 'pass');
// });
