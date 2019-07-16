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
                type: cc.Integer,
                set: function (value) {
                    this.weight = Math.floor(value / 10);
                },
                get: function () {
                    return this.weight * 10;
                }
            },
            weight5x: {
                type: cc.Integer,
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
    cc.Class._fastDefine('T', ctor, ['foo']);
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

    ok(cc.js._getClassId(Dog).length > 0, "Dog's cid is not empty");
    ok(cc.js._getClassId(Husky).length > 0, "Husky's cid is not empty");
    ok(cc.js._getClassId(Labrador).length > 0, "Labrador's cid is not empty");
    notEqual(cc.js._getClassId(Dog), cc.js._getClassId(Husky), "Dog and Husky don't have the same cid");
    notEqual(cc.js._getClassId(Dog), cc.js._getClassId(Labrador), "Dog and Labrador don't have the same cid");
    notEqual(cc.js._getClassId(Labrador), cc.js._getClassId(Husky), "Labrador and Husky don't have the same cid");

    cc.js.unregisterClass(Dog, Husky, Labrador);
});

test('mixins', function () {
    var Mixin1 = cc.Class({
        properties: {
            p2: 'Defined by Mixin1',
            p3: 'Defined by Mixin1',
        },
        eat: function () {},
        drink: function () {},
        run: function () {},
    });
    var Mixin2 = cc.Class({
        properties: {
            p1: 'Defined by Mixin2',
            p2: 'Defined by Mixin2',
        },
        run: function () {},
        stop: function () {},
    });
    var Dog = cc.Class({
        properties: {
            p3: 'Defined by Dog',
        },
        play: function () {},
        drink: function () {},
    });
    var BigDog = cc.Class({
        name: 'BigDog',
        extends: Dog,
        mixins: [Mixin1, Mixin2],
        properties: {
            p1: {
                default: 'Defined by BigDog',
                override: true
            },
            p4: 'Defined by BigDog',
        },
        stop: function () {},
    });

    ok(BigDog.prototype.play === Dog.prototype.play, "should inherit normal function");
    ok(BigDog.prototype.drink === Mixin1.prototype.drink, "mixin's function should override base's");
    ok(BigDog.prototype.run === Mixin2.prototype.run, "last mixin function should override previous");
    ok(BigDog.prototype.stop !== Mixin2.prototype.stop, "should override base functions");

    deepEqual(BigDog.__props__, ['p3', 'p2', 'p1', 'p4'], 'should inherit properties');
    deepEqual(BigDog.__values__, ['p3', 'p2', 'p1', 'p4'], 'should inherit serializable properties');
    strictEqual(cc.Class.attr(BigDog, 'p2').default, 'Defined by Mixin2', 'last mixin property should override previous');
    strictEqual(cc.Class.attr(BigDog, 'p1').default, 'Defined by BigDog', "should override base property");
    strictEqual(cc.js.getClassName(BigDog), 'BigDog', "should not overwrite class name");
    strictEqual(cc.js._getClassId(BigDog), 'BigDog', "should not overwrite class id");

    cc.js.unregisterClass(BigDog);
});

test('mixins ctor', function () {
    var ctorOfMixin = Callback().enable();

    var Mixin = cc.Class({
        ctor: function () {
            ctorOfMixin();
        },
    });
    var Dog = cc.Class({
        mixins: [Mixin],
    });
    var BigDog = cc.Class({
        extends: Dog,
        mixins: [Mixin],
    });

    new BigDog();
    ctorOfMixin.once('ctor of mixin should be called only once');
});

asyncTest('instantiate properties in the next frame', function () {
    var Dog = cc.Class({
        properties: function () {
            return {
                like: 'shit'
            };
        }
    });
    var Husky = cc.Class({
        extends: Dog,
        properties: {
            weight: 100
        }
    });

    throws(
        function () {
            Husky.__props__.length;
        },
        'should raised error if accessing to props via Class'
    );

    throws(
        function () {
            Husky.__values__.length;
        },
        'should raise error if accessing to serializable props via Class'
    );

    setTimeout(function () {
        deepEqual(Husky.__props__, ['like', 'weight'], 'should get properties in the correct order');
        deepEqual(Husky.__values__, ['like', 'weight'], 'should get serializable properties in the correct order');

        start();
    }, 0);
});

test('lazy instantiate properties', function () {
    var Dog = cc.Class({
        properties: function () {
            return {
                like: 'shit'
            };
        }
    });
    var Husky = cc.Class({
        extends: Dog,
        properties: {
            weight: 100
        }
    });

    var dog = new Husky();
    deepEqual(Husky.__props__, ['like', 'weight'], 'could get properties in the correct order after instantiating');
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
            valueType: [cc.Vec2],
            node: [cc.Node],
            rawAsset: [cc.RawAsset],
            asset: {
                default: [],
                type: cc.Asset
            },
        }
    });

    var arrayObj = new ArrayType();

    strictEqual(cc.Class.attr(ArrayType, 'valueType').type, 'Object', 'checking array of vec2 type');
    strictEqual(cc.Class.attr(ArrayType, 'valueType').ctor, cc.Vec2, 'checking array of vec2 ctor');
    strictEqual(cc.Class.attr(ArrayType, 'node').type, 'Object', 'checking array of node type');
    strictEqual(cc.Class.attr(ArrayType, 'node').ctor, cc.Node, 'checking array of node ctor');
    strictEqual(cc.Class.attr(ArrayType, 'rawAsset').type, 'Object', 'checking array of raw asset type');
    strictEqual(cc.Class.attr(ArrayType, 'rawAsset').ctor, cc.RawAsset, 'checking array of raw asset ctor');

    deepEqual(arrayObj.empty, [], 'checking array of empty');
    deepEqual(arrayObj.valueType, [], 'checking array of valueType');
    deepEqual(arrayObj.node, [], 'checking array of node');
    deepEqual(arrayObj.rawAsset, [], 'checking array of rawAsset');
    deepEqual(arrayObj.asset, [], 'checking array of asset');
});

test('simplified properties define using cc.xxxType', function () {
    var Type = cc.Class({
        properties: {
            string: cc.String,
            bool: cc.Boolean,
            float: cc.Float,
            int: cc.Integer,
        }
    });
    var ArrayType = cc.Class({
        properties: {
            string: [cc.String],
            bool: [cc.Boolean],
            float: [cc.Float],
            int: [cc.Integer],
        }
    });

    strictEqual(cc.Class.attr(Type, 'string').type, undefined, 'checking string type');
    strictEqual(cc.Class.attr(Type, 'string').ctor, undefined, 'checking string ctor');
    strictEqual(cc.Class.attr(Type, 'bool').type, undefined, 'checking bool type');
    strictEqual(cc.Class.attr(Type, 'bool').ctor, undefined, 'checking bool ctor');
    strictEqual(cc.Class.attr(Type, 'float').type, undefined, 'checking float type');
    strictEqual(cc.Class.attr(Type, 'float').ctor, undefined, 'checking float ctor');
    strictEqual(cc.Class.attr(Type, 'int').type, undefined, 'checking int type');
    strictEqual(cc.Class.attr(Type, 'int').ctor, undefined, 'checking int ctor');

    strictEqual(cc.Class.attr(ArrayType, 'string').type, cc.String, 'checking array of string type');
    strictEqual(cc.Class.attr(ArrayType, 'string').ctor, undefined, 'checking array of string ctor');
    strictEqual(cc.Class.attr(ArrayType, 'bool').type, cc.Boolean, 'checking array of bool type');
    strictEqual(cc.Class.attr(ArrayType, 'bool').ctor, undefined, 'checking array of bool ctor');
    strictEqual(cc.Class.attr(ArrayType, 'float').type, cc.Float, 'checking array of float type');
    strictEqual(cc.Class.attr(ArrayType, 'float').ctor, undefined, 'checking array of float ctor');
    strictEqual(cc.Class.attr(ArrayType, 'int').type, cc.Integer, 'checking array of int type');
    strictEqual(cc.Class.attr(ArrayType, 'int').ctor, undefined, 'checking array of int ctor');

    var obj = new Type();
    var arrayObj = new ArrayType();

    strictEqual(obj.string, '', 'checking default value of string');
    strictEqual(obj.bool, false, 'checking default value of bool');
    strictEqual(obj.float, 0, 'checking default value of float');
    strictEqual(obj.int, 0, 'checking default value of int');

    deepEqual(arrayObj.bool, [], 'checking array of bool');
    deepEqual(arrayObj.string, [], 'checking array of string');
    deepEqual(arrayObj.float, [], 'checking array of float');
    deepEqual(arrayObj.int, [], 'checking array of int');
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
