if (TestEditorExtends) {

    largeModule('Serialize');

    function match (obj, expect, info) {
        deepEqual(JSON.parse(Editor.serialize(obj)), expect, info);
        //deepEqual(Editor.serialize(obj, {stringify: false}), expect, info);
    }

    test('basic test', function() {
        match({}, {}, 'smoke test1');
        match([], [[]], 'smoke test2');

        var BaseAsset = function () {
            this.inheritProp = 321;
        };

        var MyAsset = (function () {
            var _super = BaseAsset;

            function MyAsset () {
                _super.call(this);

                this.emptyArray = [];
                this.array = [1, '2', {a:3}, [4, [5]], true];
                this.string = 'unknown';
                this.number = 1;
                this.boolean = true;
                this.emptyObj = {};
                this.obj = {};
            }
            cc.js.extend(MyAsset, _super);
            cc.js.setClassName('MyAsset', MyAsset);

            // should not serialize ----------------------------
            MyAsset.staticFunc = function () { };
            MyAsset.staticProp = cc.Enum({
                UseBest: -1,
                Ascending: -1,
                Descending: -1
            });
            MyAsset.prototype.protoFunc = function () { };
            MyAsset.prototype.protoProp = 123;
            // -------------------------------------------------

            return MyAsset;
        })();
        var asset = new MyAsset();
        asset.dynamicProp = false;

        var expect = {
            __type__: 'MyAsset',
            emptyArray: [],
            array: [1, '2',  {a:3}, [4, [5]], true],
            string: 'unknown',
            number: 1,
            boolean: true,
            emptyObj: {},
            obj: {},
            dynamicProp: false,
            inheritProp: 321
        };

        match(asset, expect, 'type test');
        match(asset, expect, 'test re-serialize again');

        cc.js.unregisterClass(MyAsset);
    });

    test('nil', function () {
        var obj = {
            'null': null,
            'undefined': undefined,
        };
        var expect = {
            'null': null
        };
        match(obj, expect);
    });

    test('test inherited CCClass', function() {
        var MyAsset = cc.Class({
            name: 'MyAsset',
            extends: cc.Asset,
            ctor: function () {
                this.array = [1, '2', {a: 3}, [4, [5]], true];
            },
            properties: {
                emptyArray: [],
                array: null,
                string: 'unknown',
                number: 1,
                boolean: true,
                emptyObj: {
                    default: {}
                },
                obj: {
                    default: {}
                }
            }
        });

        // should not serialize ----------------------------
        MyAsset.staticFunc = function () { };
        MyAsset.staticProp = cc.Enum({
            UseBest: -1,
            Ascending: -1,
            Descending: -1
        });
        MyAsset.prototype.protoFunc = function () { };
        MyAsset.prototype.protoProp = 123;
        // -------------------------------------------------

        var asset = new MyAsset();
        asset.dynamicProp = false;  // should not serialize
        asset._objFlags |= cc.Object.Flags.Destroying;   // should not serialize

        var expect = {
            __type__: 'MyAsset',
            _name: '',
            _objFlags: 0,
            _native: "",
            emptyArray: [],
            array: [1, '2',  {a:3}, [4, [5]], true],
            string: 'unknown',
            number: 1,
            boolean: true,
            emptyObj: {},
            obj: {}
        };

        match(asset, expect, 'test');

        cc.js.unregisterClass(MyAsset);
    });

    test('test CCClass', function () {
        var Sprite = cc.Class({
            name: 'Sprite',
            ctor: function () {
                this.image = 'sprite.png';
            },
            properties: {
                size: new cc.Vec2(128, 128)
            }
        });

        var sprite = new Sprite();
        var actual = JSON.parse(Editor.serialize(sprite));

        strictEqual(actual.image, undefined, 'should not serialize variable which not defined by property');

        var expected = {
            __type__: 'Sprite',
            size: {
                __type__: "cc.Vec2",
                x: 128,
                y: 128
            }
        };

        deepEqual(actual, expected, 'can serialize');

        cc.js.unregisterClass(Sprite);
    });

    test('CCClass which inherited from CCObject', function () {
        var type = cc.Class({
            name: 'cc.MyType',
            extends: CCObject
        });

        var obj = new type();
        obj.name = '阿加西';

        var json = JSON.parse(Editor.serialize(obj));
        var expected = { "__type__": "cc.MyType", "_name": "阿加西", "_objFlags": 0 };

        deepEqual(json, expected, 'can serialize CCObject.name');

        cc.js.unregisterClass(type);
    });

    test('test circular reference', function () {
        function MyAsset () {
            this.array1 = [1];
            this.array2 = [this.array1, 2];
            this.array1.push(this.array2);
            // array1 = [1, array2]
            // array2 = [array1, 2]

            this.dict1 = {num: 1};
            this.dict2 = {num: 2, other: this.dict1};
            this.dict1.other = this.dict2;
        }
        var asset = new MyAsset();

        var expect = [
            {
                array1: { __id__: 1 },
                array2: [ { __id__: 1 },  2 ],
                dict1: { __id__: 2 },
                dict2: { /*__id__: 4,*/ num:2, other: {__id__: 2} },
            },
            [ 1,  [{ __id__: 1 }, 2] ],  // You'll get two copies of array2
            { /*__id__: 2,*/ num:1, other: {num:2, other: {__id__: 2}} },  // You'll get two copies of dict2
        ];
        match(asset, expect, 'arrays and dicts can circular reference each other');
        match(asset, expect, 'test re-serialize again');
    });

    test('test serializable attributes', function () {
        var Sprite = cc.Class({
            name: 'Sprite',
            properties: {
                trimThreshold: {
                    default: 2,
                    editorOnly: true
                },
                _isValid: {
                    default: true,
                    serializable: false
                }
            }
        });

        var sprite = new Sprite();
        var resultInEditor = JSON.parse(Editor.serialize(sprite));
        var resultInPlayer = JSON.parse(Editor.serialize(sprite, { exporting: true }));

        strictEqual(resultInEditor.trimThreshold, 2, 'serialize editor only in editor');

        strictEqual(resultInPlayer.trimThreshold, undefined, 'should not serialize editor only in player');

        strictEqual(resultInEditor._isValid, undefined, 'should not serialize non-serialized in editor');
        strictEqual(resultInPlayer._isValid, undefined, 'should not serialize non-serialized in player');

        cc.js.unregisterClass(Sprite);
    });

    test('fast defined property', function () {
        function Vec3 (x, y, z) {
            this.data = [x, y, z];
        }
        cc.Class._fastDefine('Vec3', Vec3, { x: 0, y: 0, z: 0, });

        Object.defineProperties(Vec3.prototype, {
            x: {
                get: function () {
                    return this.data[0];
                },
                set: function (value) {
                    this.data[0] = value;
                },
            },
            y: {
                get: function () {
                    return this.data[1];
                },
                set: function (value) {
                    this.data[1] = value;
                },
            },
            z: {
                get: function () {
                    return this.data[2];
                },
                set: function (value) {
                    this.data[2] = value;
                },
            }
        });

        var obj = new Vec3(2, 3 ,1);
        var expected = {
            __type__: 'Vec3',
            x: 2,
            y: 3,
            z: 1,
        };
        match(obj, expected, 'should be able to serialize');

        cc.js.unregisterClass(Vec3);
    });

    test('test asset property', function () {
        var sprite = new TestSprite();
        sprite.texture = new TestTexture();
        var uuid = '541020432560';
        sprite.texture._uuid = uuid;

        var result = JSON.parse(Editor.serialize(sprite));

        deepEqual(result.texture, {__uuid__: uuid}, 'serialize asset as uuid reference');
    });

    test('test CCObject reference', function () {
        var fobj = new cc.Object();
        var asset = { ref1: fobj, ref2: fobj };
        var expected = [
            {
                "ref1": { "__id__": 1 },
                "ref2": { "__id__": 1 }
            },
            { "__type__": "cc.Object", "_objFlags": 0, "_name": "" },
        ];
        match(asset, expected, 'references should the same');
    });

    test('main asset', function () {
        var Scene = cc.Class({
            name: "Scene",
            properties: {
                entities: [],
            }
        });

        var Entity = cc.Class({
            name: "Entity"
        });

        var scene = new Scene();
        scene.entities.push(new Entity());

        var expected = [
            {
                "__type__": "Scene",
                "entities": [
                    {
                        "__id__": 1
                    }
                ]
            },
            {
                "__type__": "Entity",
            }
        ];

        match(scene, expected, 'main asset should listed first');

        cc.js.unregisterClass(Scene, Entity);
    });

    test('nicify ', function () {
        var data = [
          {
              "ref1": [1, 2, 3, { "__id__": 1 }, { "a": 1, "b": 2, "c": { "__id__": 2 } }],
              "ref2": { "__id__": 1 },
              "ref3": { "__id__": 3 },
              "ref4": { "__id__": 3 },
              "ref5": [{ "__id__": 4 }, { "__id__": 4 }]
          },
          { "__type__": "cc.Object", "_name": "test_1", "_objFlags": 0 },
          { "__type__": "cc.Object", "_name": "test_2", "_objFlags": 0 },
          { "__type__": "cc.Object", "_name": "test_3", "_objFlags": 0 },
          { "__type__": "cc.Object", "_name": "test_4", "_objFlags": 0 }
        ];
        var expected = [
              {
                  "ref1": [1, 2, 3, { "__id__": 1 }, { "a": 1, "b": 2, "c": { "__type__": "cc.Object", "_name": "test_2", "_objFlags": 0 } }],
                  "ref2": { "__id__": 1 },
                  "ref3": { "__id__": 2 },
                  "ref4": { "__id__": 2 },
                  "ref5": [{ "__id__": 3 }, { "__id__": 3 }]
              },
              { "__type__": "cc.Object", "_name": "test_1", "_objFlags": 0 },
              { "__type__": "cc.Object", "_name": "test_3", "_objFlags": 0 },
              { "__type__": "cc.Object", "_name": "test_4", "_objFlags": 0 }
        ];

        cc._Test.nicifySerialized(data);
        deepEqual(data, expected, 'nicify success');

    });

    test('nicify 1 ', function () {
        var data = [
                {
                    "ref1": { "__id__": 1 }
                },
                {
                    "ref2": { "__id__": 2 },
                },
                {
                    "ref3": { "__id__": 3 },
                },
                {
                    "123": 1,
                },
        ];

        var expected = [
           {
               "ref1": { "ref2": { "ref3": { "123": 1 } }}
           },
        ];

        cc._Test.nicifySerialized(data);
        deepEqual(data, expected, 'nicify success');

    });

    test('nicify 2 ', function () {
        var data = [
            {
                "ref1": { "__id__": 1 }
            },
            {
                "ref0": { "__id__": 0 },
            },
        ];

        var expected = [
           {
               "ref1": { "ref0": { "__id__": 0 } }
           },
        ];

        cc._Test.nicifySerialized(data);
        deepEqual(data, expected, 'nicify success');
    });

    test('url array', function () {
        var Data = cc.Class({
            name: 'data',
            properties: {
                textures: {
                    default: [],
                    url: [cc.Texture2D]
                }
            }
        });
        var restore = Editor.Utils.UuidCache.urlToUuid;
        Editor.Utils.UuidCache.urlToUuid = function (url) {
            return {
                foo: '01',
                bar: '02'
            }[url];
        };

        var data = new Data();
        data.textures = ['foo', 'bar'];

        var actual = JSON.parse(Editor.serialize(data));
        strictEqual(actual.image, undefined, 'should not serialize variable which not defined by property');

        var expected = {
            __type__: 'data',
            textures: [
                {
                    __uuid__: '01'
                },
                {
                    __uuid__: '02'
                }
            ]
        };
        deepEqual(actual, expected, 'could be serialized');

        Editor.Utils.UuidCache.urlToUuid = restore;
        cc.js.unregisterClass(Data);
    });

    test('node array', function () {
        var Data = cc.Class({
            name: 'data',
            properties: {
                nodes: {
                    default: [],
                    type: [cc.Node]
                }
            }
        });

        var data = new Data();
        var node1 = new cc.Node();
        var node2 = new cc.Node();
        data.nodes = [node1, node2];

        var actual = JSON.parse(Editor.serialize(data));

        ok(Array.isArray(actual), 'checking');
        deepEqual(actual[0], {
            __type__: 'data',
            nodes: [
                {
                    "__id__": 1
                },
                {
                    "__id__": 2
                }
            ],
        }, 'checking');

        ok(actual[1].constructor === Object, 'checking');
        strictEqual(actual[1].__type__, "cc.Node", 'checking');

        ok(actual[2].constructor === Object, 'checking');
        strictEqual(actual[2].__type__, "cc.Node", 'checking');

        cc.js.unregisterClass(Data);
    });

    test('formerlySerializedAs attribute', function () {
        var MyAsset = cc.Class({
            name: 'MyAsset',
            properties: {
                newRefSelf: {
                    default: null,
                    formerlySerializedAs: 'oldRefSelf'
                },
            }
        });
        var asset = new MyAsset();
        asset.newRefSelf = asset;

        var expect = {
            __type__: 'MyAsset',
            newRefSelf: {
                __id__: 0
            },
            oldRefSelf: {
                __id__: 0
            },
        };

        match(asset, expect, 'test');

        cc.js.unregisterClass(MyAsset);
    });

    test('eliminate default property', function () {
        var MyAsset = cc.Class({
            name: 'MyAsset',
            properties: {
                scale0: cc.v3(0, 0, 0),
                scale1: cc.v3(1, 1, 1),
                scale00: cc.v3(0, 1, 0),
                scale01: cc.v3(0, 0, 0),
                scale10: cc.v3(1, 1, 1),
            }
        });
        var asset = new MyAsset();
        asset.scale00.y = 0;
        asset.scale01.y = 1;
        asset.scale10.y = 0;

        var expectedDefaultScaleResult = {
            __type__: 'MyAsset',
            scale00: {
                __type__: "cc.Vec3",
            },
            scale01: {
                __type__: 'cc.Vec3',
                y: 1,
            },
            scale10: {
                __type__: 'cc.Vec3',
                x: 1,
                z: 1,
            },
        };

        var actualDefaultScaled = JSON.parse(Editor.serialize(asset, { exporting: true, dontStripDefault: false }));

        // to read default value from ValueType instead of constructor of user class
        deepEqual(actualDefaultScaled.scale00, expectedDefaultScaleResult.scale00, 'should leave a empty type declaration if equal to default value defined in ValueType');

        // to make the deserialization for ValueTypes more unique and simplify
        ok(actualDefaultScaled.scale10.x === 1 && actualDefaultScaled.scale10.z === 1, 'should serialize non-zero sub properties even if they equal to default values defined in user class');

        ok(actualDefaultScaled.scale0 === undefined && actualDefaultScaled.scale1 === undefined, 'should eliminate entire property if equals to the default value defined in user class');

        deepEqual(actualDefaultScaled, expectedDefaultScaleResult, 'test all serialized result');

        cc.js.unregisterClass(MyAsset);
    });

}