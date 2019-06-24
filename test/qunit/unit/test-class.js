largeModule('Class ES6');

// most tests are the same as es5

(function () {
    const {ccclass, executeInEditMode, mixins, property, requireComponent, menu, executionOrder} = cc._decorator;

    test('empty class', function () {
        @ccclass
        class Animal {}

        strictEqual(cc.Class._isCCClass(Animal), true, 'should be defined');
        ok((new Animal) instanceof Animal, 'should be instantiated');
    });

    test('class name', function () {

        @ccclass('Animal')
        class Animal {}

        strictEqual(cc.js.getClassName(Animal), 'Animal', 'should be registered');

        cc.js.unregisterClass(Animal);
    });

    test('babel', function () {
        var called = false;

        @ccclass
        class Foo {
            constructor () {
                called = true;
                ok(this instanceof Foo, 'class should be decorated');
            }
        }

        new Foo();

        ok(called, 'constructor should be called');
    });

    test('extends', function () {
        @ccclass('cc.Animal')
        class Animal {}

        @ccclass('cc.Dog')
        class Dog extends Animal {}

        strictEqual(cc.js.isChildClassOf(Dog, Animal), true, 'extends should be supported');
        strictEqual(cc.js.getClassName(Dog), 'cc.Dog', 'child class name should be registered');

        cc.js.unregisterClass(Animal, Dog);
    });

    test('executeInEditMode', function () {
        @ccclass
        class NoExecuteInEditMode extends cc.Component {}

        @ccclass
        @executeInEditMode
        class SimpleStyle extends cc.Component {}

        @ccclass
        @executeInEditMode()
        class CalledStyle extends cc.Component {}

        strictEqual(NoExecuteInEditMode._executeInEditMode, false, 'should not execute in edit mode by default');
        strictEqual(SimpleStyle._executeInEditMode, true, 'should execute in edit mode by default');
        strictEqual(CalledStyle._executeInEditMode, true, 'should execute in edit mode by default even if decorator called');
    });

    test('requireComponent', function () {
        @ccclass
        @requireComponent(cc.Sprite)
        class SpriteCtrl extends cc.Component {}

        strictEqual(SpriteCtrl._requireComponent, cc.Sprite, 'pass');
    });

    // test('menu', function () {
    //     @ccclass
    //     @menu
    //     class SpriteCtrl1 extends cc.Component {}
    //
    //     @ccclass
    //     @menu()
    //     class SpriteCtrl2 extends cc.Component {}
    //
    //     @ccclass
    //     @menu(cc.Sprite)
    //     class SpriteCtrl3 extends cc.Component {}
    //
    //     @ccclass
    //     @menu('cc.Sprite')
    //     class SpriteCtrl4 extends cc.Component {}
    //
    //     expect(0);
    // });

    test('executionOrder', function () {
        @ccclass
        @executionOrder(-1)
        class SpriteCtrl extends cc.Component {}

        strictEqual(SpriteCtrl._executionOrder, -1, 'pass');
    });

    test('test', function () {
        @ccclass('Animal')
        class Animal {
            @property({
                tooltip: 'Float',
                displayName: 'displayName'
            })
            myName = '...';

            @property
            eat = function () {
                return 'eating';
            };

            @property({
                serializable: false
            })
            weight = -1;

            @property({
                type: cc.Integer
            })
            set weight10 (value) {
                this.weight = Math.floor(value / 10);
            }

            @property({
                type: cc.Integer
            })
            get weight5x () {
                return this.weight * 5;
            }

            get weight10 () {
                return this.weight * 10;
            }

            set weight5x (value) {
                this.weight = value / 5;
            }

            @property
            nonEmptyObj = [1, 2];
        }

        strictEqual(cc.js.getClassName(Animal), 'Animal', 'get class name');

        // property

        var instance = new Animal();
        strictEqual(instance.myName, '...', 'get property');
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
        @ccclass('Animal')
        class Animal2 {
            constructor () {
                animalCtor();
            }
            @property
            weight = 100;
        }
        var labradorConstructor = new Callback();
        var Labrador = class extends Animal2 {
            constructor () {
                super();
                labradorConstructor();
            }
        };

        animalCtor.enable();
        var instance1 = new Animal2();
        animalCtor.once('call constructor');

        strictEqual(cc.Class.attr(Animal2, 'weight').default, 100, 'can get attribute even has constructor');
        strictEqual(instance1.weight, 100, 'property inited even has constructor');

        var instance2 = new Animal2();
        instance1.weight = 0;
        strictEqual(instance2.weight, 100, 'is instance property');

        var instance3 = new Animal2();
        strictEqual(instance3.weight, 100, 'class define not changed');

        labradorConstructor.enable();
        animalCtor.calledCount = 0;
        var instance4 = new Labrador();
        animalCtor.once('call constructor of parent class');
        labradorConstructor.once('call constructor of child class');

        cc.js.unregisterClass(Animal2, Labrador);
    });

    test('define property in quick way)', function () {
        @ccclass
        class Class {
            @property undefinedVal = undefined;
            @property nullVal = null;
            @property string = '...';
            @property array = [];
            @property(cc.Node) node = null;
            @property(cc.SpriteFrame) asset = null;
            @property vec2 = cc.Vec2.ZERO;
            @property vec2_one = cc.Vec2.ONE;
        }
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

    test('define property in quick way and save default value', function () {
        var getDefault = cc.Class.getDefault;

        @ccclass
        class Class {
            @property([cc.Vec2])
            vec2 = [];
        }
        var attrs = cc.Class.Attr.getClassAttrs(Class);

        ok(Array.isArray(getDefault(attrs['vec2' + cc.Class.Attr.DELIMETER + 'default'])), 'default is array');
        strictEqual(attrs['vec2' + cc.Class.Attr.DELIMETER + 'ctor'], cc.Vec2, 'ctor is cc.Vec2');
    });

    test('__values__', function () {
        @ccclass
        class Class {
            @property({
                serializable: false
            })
            p1 = null;
            @property
            p2 = null;
            @property({
                type: cc.Asset
            })
            get p3 () {}
            set p3 (value) {}
        }

        deepEqual(Class.__values__, ['p2'], 'should not contain non-serializable properties');
    });

    test('extends', function () {
        @ccclass('cc.Animal')
        class Animal {
            @property myName = 'ann';
        }

        @ccclass('cc.Dog')
        class Dog extends Animal {
            @property({
                tooltip: 'String',
                override: true
            })
            myName = 'doge';
        }

        @ccclass('cc.Husky')
        class Husky extends Dog {
            @property weight = 100;
        }

        @ccclass('cc.Labrador')
        class Labrador extends Dog {
            @property clever = true;
        }

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

        @ccclass('cc.Animal')
        class Animal {
            constructor () {
                animalConstructor();
            }
            @property myName = 'ann';
        }

        @ccclass('cc.Dog')
        class Dog extends Animal {
            @property({
                override: true
            })
            myName = 'doge';
        }

        @ccclass('cc.Husky')
        class Husky extends Dog {
            constructor () {
                super();
                huskyConstructor();
            }
        }

        @ccclass('cc.Labrador')
        class Labrador extends Dog {
            constructor () {
                super();
                labradorConstructor();
            }
        }

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

    test('prop reference', function () {
        @ccclass('cc.MyType')
        class type {
            @property ary = [];
            @property vec2 = new cc.Vec2(10, 20);
            @property dict = {};
        }
        var obj1 = new type();
        var obj2 = new type();

        notStrictEqual(obj1.vec2, obj2.vec2, 'cloneable object reference not equal');
        notStrictEqual(obj1.ary, obj2.ary, 'empty array reference not equal');
        notStrictEqual(obj1.dict, obj2.dict, 'empty dict reference not equal');

        cc.js.unregisterClass(type);
    });

    test('isChildClassOf', function () {

        // constructor

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

        // cc.Class

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

        strictEqual(cc.js.isChildClassOf(Husky, Husky), true, 'Husky is child of itself');
        strictEqual(cc.js.isChildClassOf(Dog, Animal), true, 'Animal is parent of Dog');
        strictEqual(cc.js.isChildClassOf(Husky, Animal) &&
                    ! cc.js.isChildClassOf(Animal, Husky), true, 'Animal is parent of Husky');
        strictEqual(cc.js.isChildClassOf(Dog, Husky), false, 'Dog is not child of Husky');
        strictEqual(cc.js.isChildClassOf(Labrador, Dog), true, 'Labrador is child of Dog');
        strictEqual(cc.js.isChildClassOf(Labrador, Animal), true, 'Labrador is child of Animal');

        strictEqual(cc.js.isChildClassOf(Animal, Sub), true, 'Animal is child of Sub');
        strictEqual(cc.js.isChildClassOf(Animal, Base), true, 'Animal is child of Base');
        strictEqual(cc.js.isChildClassOf(Dog, Base),  true, 'Dog is child of Base');

        // ES6 Classes

        @ccclass
        class Foo extends Labrador {}

        strictEqual(cc.js.isChildClassOf(Foo, Labrador),  true, 'Foo is child of Labrador');
        strictEqual(cc.js.isChildClassOf(Foo, Labrador),  true, 'Foo is child of Dog');

        cc.js.unregisterClass(Animal, Dog, Husky, Labrador);
    });

    test('statics', function () {
        @ccclass
        class Animal {
            static id = "be-bu";
        }

        @ccclass
        class Dog extends Animal {}

        @ccclass
        class Labrador extends Dog {
            static nickName = "niuniu";
        }

        strictEqual(Animal.id, "be-bu", 'can get static prop');
        strictEqual(Dog.id, "be-bu", 'can copy static prop to child class');
        strictEqual(Labrador.id, "be-bu", 'can copy static prop to child class with Dog.extend syntax');
        Animal.id = "duang-duang";
        strictEqual(Animal.id, "duang-duang", 'can set static prop');
        strictEqual(Labrador.nickName, "niuniu", 'can add static prop in child class');

        cc.js.unregisterClass(Animal, Dog, Labrador);
    });

    test('_isCCClass', function () {
        @ccclass
        class Class {}
        strictEqual(cc.Class._isCCClass(Class), true, 'should be CCClass');
        strictEqual(cc.Class._isCCClass(class {}), false, 'non-decorated ES6 Classes is not CCClass');

        function ctor () {
            this.foo = 0;
        }
        cc.Class._fastDefine('T', ctor, ['foo']);
        strictEqual(cc.Class._isCCClass(ctor), false, 'fastDefined ctor should not recognized as CCClass');

        cc.js.unregisterClass(ctor);
    });

    // test('property notify', function () {
    //     var string1 = "";
    //     var string2 = "";
    //
    //     @ccclass
    //     class Animal {
    //         @property({
    //             notify (oldValue) {
    //                 string1 = oldValue + " : " + this.legs;
    //             }
    //         })
    //         legs = 0;
    //
    //         @property({
    //             notify (oldValue) {
    //                 string2 = oldValue + " : " + this.eyes;
    //             }
    //         })
    //         eyes = 0;
    //     }
    //
    //     var dogs = new Animal();
    //     dogs.legs = 4;
    //     dogs.eyes = 2;
    //
    //     strictEqual(string1, "0 : 4", 'dogs has 4 legs');
    //     strictEqual(string2, "0 : 2", 'dogs has 2 eyes');
    // });

    // test('try catch', function () {
    //     var originThrow = cc._throw;
    //
    //     cc._throw = Callback().enable();
    //     var Animal = cc.Class({
    //         ctor: function () {
    //             null.foo();
    //         }
    //     });
    //     var animal = new Animal();
    //     ok(animal, 'should create new instance even if an exception occurs');
    //     cc._throw.once('should throw exception');
    //
    //     cc._throw = originThrow;
    // });

    test('__cid__', function () {
        @ccclass('cc.Dog')
        class Dog {}
        @ccclass
        class Husky extends Dog {}
        @ccclass
        class Labrador extends Dog {}

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
            statics: {
                s1: 'Mixin1',
                s2: 'Mixin1',
                s3: 'Mixin1'
            }
        });
        var Mixin2 = cc.Class({
            properties: {
                p1: 'Defined by Mixin2',
                p2: 'Defined by Mixin2',
            },
            run: function () {},
            stop: function () {},
            statics: {
                s1: 'Mixin2',
                s2: 'Mixin2'
            }
        });

        @ccclass
        class Dog {
            @property
            p3 = 'Defined by Dog';

            play () {}
            drink () {}

            static s1 = 'Dog';
            static s2 = 'Dog';
            static s3 = 'Dog';
            static s4 = 'Dog';
        }

        @ccclass
        @mixins(Mixin1, Mixin2)
        class BigDog extends Dog {
            @property({
                override: true
            })
            p1 = 'Defined by BigDog';
            @property
            p4 = 'Defined by BigDog';

            stop () {}

            static s1 = 'BigDog';
        }

        ok(BigDog.prototype.play === Dog.prototype.play, "should inherit normal function");
        ok(BigDog.prototype.drink === Mixin1.prototype.drink, "mixin's function should override base's");
        ok(BigDog.prototype.run === Mixin2.prototype.run, "last mixin function should override previous");
        ok(BigDog.prototype.stop !== Mixin2.prototype.stop, "should override base functions");

        deepEqual(BigDog.__props__, ['p3', 'p2', 'p1', 'p4'], 'should inherit properties');
        deepEqual(BigDog.__values__, ['p3', 'p2', 'p1', 'p4'], 'should inherit serializable properties');
        strictEqual(cc.Class.attr(BigDog, 'p2').default, 'Defined by Mixin2', 'last mixin property should override previous');
        strictEqual(cc.Class.attr(BigDog, 'p1').default, 'Defined by BigDog', "should override base property");

        strictEqual(BigDog.s1, 'BigDog', "sub class should override all inherited static property");
        strictEqual(BigDog.s2, 'Mixin2', "last mixins should override previous mixins static property");
        strictEqual(BigDog.s3, 'Mixin1', "mixins should override super class\'s static property");
        strictEqual(BigDog.s4, 'Dog',    "sub class should inherit static property from base");
    });

    test('mixins ctor', function () {
        var ctorOfMixin = Callback().enable();

        var Mixin = cc.Class({
            ctor: function () {
                ctorOfMixin();
            },
        });

        @ccclass
        class Dog {}

        @ccclass
        @mixins(Mixin)
        class BigDog extends Dog {
            constructor () {
                super();
                Mixin.call(this);   // expect Mixin will call its own ctor rather than this's
            }
        }

        new BigDog();
        ctorOfMixin.once('ctor of mixin should be called once');
    });

    // asyncTest('instantiate properties in the next frame', function () {
    //     var Dog = cc.Class({
    //         properties: function () {
    //             return {
    //                 like: 'shit'
    //             };
    //         }
    //     });
    //     var Husky = cc.Class({
    //         extends: Dog,
    //         properties: {
    //             weight: 100
    //         }
    //     });
    //
    //     throws(
    //         function () {
    //             Husky.__props__.length;
    //         },
    //         'should raised error if accessing to props via Class'
    //     );
    //
    //     setTimeout(function () {
    //         deepEqual(Husky.__props__, ['like', 'weight'], 'should get properties in the correct order');
    //
    //         start();
    //     }, 0);
    // });

    // test('lazy instantiate properties', function () {
    //     var Dog = cc.Class({
    //         properties: function () {
    //             return {
    //                 like: 'shit'
    //             };
    //         }
    //     });
    //     var Husky = cc.Class({
    //         extends: Dog,
    //         properties: {
    //             weight: 100
    //         }
    //     });
    //
    //     var dog = new Husky();
    //     deepEqual(Husky.__props__, ['like', 'weight'], 'could get properties in the correct order after instantiating');
    // });

    test('simplified properties define', function () {
        @ccclass
        class Type {
            @property
            bool = true;
            @property
            string = "hello";
            @property
            number = 2;
            @property
            obj = null;
            @property
            vec2Val = new cc.Vec2(1, 2);
            @property(cc.Node)
            node = null;
        }

        var obj = new Type();

        strictEqual(cc.Class.attr(Type, 'vec2').type, undefined, 'checking vec2 type');
        strictEqual(cc.Class.attr(Type, 'vec2').ctor, undefined, 'checking vec2 ctor');
        strictEqual(cc.Class.attr(Type, 'node').type, 'Object', 'checking node type');
        strictEqual(cc.Class.attr(Type, 'node').ctor, cc.Node, 'checking node ctor');

        strictEqual(obj.bool, true, 'checking bool');
        strictEqual(obj.string, "hello", 'checking string');
        strictEqual(obj.number, 2, 'checking number');
        strictEqual(obj.obj, null, 'checking obj');
        deepEqual(obj.vec2Val, new cc.Vec2(1, 2), 'checking vec2 value');
        strictEqual(obj.node, null, 'checking node');

        @ccclass
        class ArrayType {
            empty = [];

            @property({
                type: cc.Boolean
            })
            bool = [];

            @property({
                type: cc.String
            })
            string = [];

            @property({
                type: cc.Float
            })
            float = [];

            @property({
                type: cc.Integer
            })
            int = [];

            @property(cc.Vec2)
            valueType = [];

            @property(cc.Node)
            node = [];

            @property(cc.RawAsset)
            rawAsset = [];

            @property({
                type: cc.Asset
            })
            asset = [];
        }

        var arrayObj = new ArrayType();

        strictEqual(cc.Class.attr(ArrayType, 'bool').type, cc.Boolean, 'checking array of bool type');
        strictEqual(cc.Class.attr(ArrayType, 'valueType').type, 'Object', 'checking array of vec2 type');
        strictEqual(cc.Class.attr(ArrayType, 'valueType').ctor, cc.Vec2, 'checking array of vec2 ctor');
        strictEqual(cc.Class.attr(ArrayType, 'node').type, 'Object', 'checking array of node type');
        strictEqual(cc.Class.attr(ArrayType, 'node').ctor, cc.Node, 'checking array of node ctor');
        strictEqual(cc.Class.attr(ArrayType, 'rawAsset').type, 'Object', 'checking array of raw asset type');
        strictEqual(cc.Class.attr(ArrayType, 'rawAsset').ctor, cc.RawAsset, 'checking array of raw asset ctor');

        deepEqual(arrayObj.empty, [], 'checking array of empty');
        deepEqual(arrayObj.bool, [], 'checking array of bool');
        deepEqual(arrayObj.string, [], 'checking array of string');
        deepEqual(arrayObj.valueType, [], 'checking array of valueType');
        deepEqual(arrayObj.node, [], 'checking array of node');
        deepEqual(arrayObj.rawAsset, [], 'checking array of rawAsset');
        deepEqual(arrayObj.asset, [], 'checking array of asset');
    });

    test('simplified properties define using cc.xxxType', function () {
        @ccclass
        class Type {
            @property(cc.String)
            string = '';
            @property(cc.Boolean)
            bool = false;
            @property(cc.Float)
            float = 0;
            @property(cc.Integer)
            int = 0;
        }
        @ccclass
        class ArrayType {
            @property([cc.String])
            string = [];
            @property([cc.Boolean])
            bool = [];
            @property([cc.Float])
            float = [];
            @property([cc.Integer])
            int = [];
        }

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

    // test('property', function () {
    //     @ccclass
    //     class Foo {
    //         constructor () {
    //             this.t = 1;
    //         }
    //
    //         @property
    //         bar = 'bork';
    //
    //         // @property({type: 'Float'})
    //         get bbb () {
    //             return this.bar;
    //         }
    //
    //         @property
    //         baz = () => {
    //             return this.bar;
    //         };
    //
    //         // @property(cc.Integer)
    //         set bbb (value) {
    //             this.bar = value;
    //         }
    //
    //         @property
    //         heihei = 11111;
    //
    //         @property
    //         set Heihei (value) {
    //             this.bar = value;
    //         }
    //     }
    //     expect(0);
    // });

    if (TestEditorExtends) {
        test('deserialization of child class', function () {
            @ccclass('cc.Animal')
            class Animal {}

            @ccclass('cc.Dog')
            class Dog extends Animal {
                @property
                name = '3';
            }

            var ani = new Animal();
            cc.deserialize(Editor.serialize(ani));
            var dog = new Dog();
            dog.name = 'a';
            var cloneDog = cc.deserialize(Editor.serialize(dog));
            strictEqual(dog.name, cloneDog.name, 'property should be deserializable if super class also have been deserialized');

            cc.js.unregisterClass(Animal, Dog);
        });
    }
})();
