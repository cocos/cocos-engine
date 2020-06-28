if (TestEditorExtends) { (function () {

    let { unpackJSONs, deserialize } = cc._Test.deserializeCompiled;
    let _unregisterClass = cc.js.unregisterClass;

    const serialize = function (obj) {
        return Editor.serializeCompiled(obj, { stringify: false });
    };

    largeModule('Serialize Compiled', {
        setup: function () {
            cc.js.unregisterClass = function () {
                // test packed jsons
                let classes = Array.prototype.slice.call(arguments);
                if (classes.every(x => {
                    // can not re-serialize missing script after deserialize-compiled
                    let props = x.__props__;
                    return !(props && props[props.length - 1] === '_$erialized');
                })) {
                    let writableJsons = JSON.parse(JSON.stringify(matchHistory.jsons));
                    let packed = Editor.serializeCompiled.packJSONs(writableJsons);
                    let unpacked = unpackJSONs(packed, cc._MissingScript.safeFindClass);

                    for (let i = 0; i < unpacked.length; ++i) {
                        let json = unpacked[i];
                        // Some properties cannot be saved to JSON, so it is more accurate to execute JSON.parse once.
                        let detail = new deserialize.Details;
                        let deserialized = deserialize(json, detail);
                        detail.assignAssetsBy(Editor.serialize.asAsset);
                        // reserialize again so we can compare jsons
                        let res = JSON.parse(JSON.stringify(serialize(deserialized)));
                        deepEqual(res, matchHistory.jsons[i], 'Unpacked json of: ' + matchHistory.infos[i]);
                    }
                }

                matchHistory.jsons.length = 0;
                matchHistory.infos.length = 0;

                _unregisterClass.apply(cc.js, arguments);
            };
        },
        teardown: function () {
            cc.js.unregisterClass = _unregisterClass;
        }
    });

    const {
        TraceableDict,
        // Builder,
    } = cc._Test.serialize;
    let { DataTypeID, BuiltinValueTypes } = cc._Test.deserializeCompiled;

    const { ccclass, property } = cc._decorator;

    test('TraceableDict and TraceableItem', function () {
        let sharedObjs = new TraceableDict();
        let tracer1 = [NaN, NaN, NaN];
        let tracer2 = { obj1: NaN, obj2: NaN, number: NaN };
        let obj = {};

        sharedObjs.trace('string', tracer1, 0).result = 'string';
        let item = sharedObjs.trace(obj, tracer1, 1);
        item.result = JSON.stringify(obj);
        // {
        //     ok(!item.isSerialized, 'first time added object should be non-serialized');
        //     item.result = undefined;
        //     ok(item.isSerialized, 'object should be serialized after specifying result even if it is undefined');
        //     item.result = JSON.stringify(obj);
        // }
        sharedObjs.trace(2, tracer1, 2).result = 2;
        sharedObjs.trace(obj, tracer2, 'obj1');
        sharedObjs.trace(obj, tracer2, 'obj2');
        sharedObjs.trace(2, tracer2, 'number');

        let result = sharedObjs.dump();
        deepEqual(result, [JSON.stringify(obj), 2, 'string'], 'dump should get item array');
        deepEqual(tracer1, [2, 0, 1], 'dump sequence should sort by reference count');
        deepEqual(tracer2, { obj1: 0, obj2: 0, number: 1 }, 'should support object');
    });

    // test('RefsBuilder', function () {
    //     let indexObj2 = {};
    //     let array = [indexObj2, null];
    //     let indexObj1 = { ref1: indexObj2, ref2: array, ref3: null };
    //     array[1] = indexObj1;
    //     indexObj1.ref3 = indexObj1;
    //
    //     let ctx = new Builder();
    //     ctx.instances.setRoot(indexObj1);
    //     ctx.instances.get(indexObj1).result = indexObj1;
    //     ctx.refsBuilder.refByIndexed(indexObj1, 'ref1', indexObj2);
    //     ctx.instances.get(indexObj2).result = indexObj2;
    //     let arrayRefIndex0 = ~ctx.refsBuilder.refByInner(0, indexObj2) * 3;
    //     let arrayRefIndex1 = ~ctx.refsBuilder.refByInner(1, indexObj1) * 3;
    //     ctx.refsBuilder.refByIndexed(indexObj1, 'ref3', indexObj1);
    //
    //     let instances = ctx.instances.dump();
    //     let strings = ctx.sharedStrings.dump();
    //
    //     let refs = ctx.refsBuilder.build();
    //     strictEqual(refs[refs.length - 1], 2, 'offset should be 2');
    //     deepEqual(strings, ['ref1', 'ref3'], 'should export property names correctly');
    //
    //     strictEqual(refs[arrayRefIndex0 + 1], ~0, 'for array[0]');
    //     strictEqual(instances[refs[arrayRefIndex0 + 2]], indexObj2, 'array[0] === indexObj2');
    //
    //     strictEqual(refs[arrayRefIndex1 + 1], ~1, 'for array[1]');
    //     strictEqual(instances[refs[arrayRefIndex1 + 2]], indexObj1, 'array[1] === indexObj1');
    //
    //     let dereference = cc._Test.deserialize.dereference;
    //     indexObj1.ref1 = null;
    //     indexObj1.ref3 = null;
    //     array[0] = null;
    //     array[1] = null;
    //     refs[arrayRefIndex0] = array;
    //     refs[arrayRefIndex1] = array;
    //     dereference(refs, instances, strings);
    //     strictEqual(indexObj1.ref1, indexObj2, 'dereferenced property correctly 1');
    //     strictEqual(indexObj1.ref3, indexObj1, 'dereferenced property correctly 2');
    //     strictEqual(array[0], indexObj2, 'dereferenced array correctly 1');
    //     strictEqual(array[1], indexObj1, 'dereferenced array correctly 2');
    // });

    let matchHistory = { jsons: [], infos: [] };
    let match = function (obj, expect, info) {
        // Some properties cannot be saved to JSON, so it is more accurate to execute JSON.parse once.
        let res = JSON.parse(JSON.stringify(serialize(obj)));
        deepEqual(res, expect, info);

        matchHistory.jsons.push(res);
        matchHistory.infos.push(info);
    };

    test('Smoke test', function() {
        match({},[
            1,
            0,
            0,
            [],
            0,
            [{}],
            [~DataTypeID.SimpleType],
            0,
            [], [], []
        ], 'empty dict');

        match([], [
            1,
            0,
            0,
            [],
            0,
            [[]],
            [~DataTypeID.SimpleType],
            0,
            [], [], []
        ], 'empty array');

        @cc._decorator.ccclass('MyClass')
        class MyClass {}
        match(new MyClass(), [
            1,
            0,
            0,
            [['MyClass', [], 3]],
            [[0, 1]],
            [[0]],
            0,
            0,
            [], [], []
        ], 'empty non-primitive object');

        cc.js.unregisterClass(MyClass);
    });

    test('Missing script', function() {
        @ccclass('MyClass')
        class MyClass {
            @property
            _$erialized = {
                __type__: 'Your Class',
            }
        }
        let obj = new MyClass();
        match(obj, [
            1,
            0,
            0,
            [['Your Class', [], 3]],
            [[0, 1]],
            [[0]],
            0,
            0,
            [], [], []
        ], 'empty missing-script object');

        match([obj, obj], [
            1,
            0,
            0,
            [['Your Class', [], 3]],
            [[0, 1]],
            [
                [0],
                [0, 0],
                1
            ],
            [~DataTypeID.Array_InstanceRef],
            0,
            [], [], []
        ], 'missing-script object could be referenced correctly');

        cc.js.unregisterClass(MyClass);
    });

    test('basic test', function() {

        @ccclass
        class BaseAsset {
            @property
            inheritProp = 0;
        }

        var MyAsset = (function () {
            @ccclass('MyAsset')
            class MyAsset extends BaseAsset {
                @property
                emptyArray = null;
                @property
                array = [];
                @property
                string = '';
                @property
                emptyString = 'unknown';
                @property
                number = 1;
                @property
                boolean = true;
                @property
                emptyObj = null;
                @property
                valueType = new cc.Vec2();
            }

            // should not serialize ----------------------------
            MyAsset.staticFunc = function () { };
            MyAsset.staticProp = cc.Enum({
                UseBest: -1,
                Ascending: -1,
                Descending: -1,
            });
            MyAsset.prototype.protoFunc = function () { };
            MyAsset.prototype.protoProp = 123;
            // -------------------------------------------------

            return MyAsset;
        })();

        var asset = new MyAsset();
        asset.inheritProp = 321;
        asset.emptyArray = [];
        asset.array = [1, '2', {a:3}, [4, [5]], true];
        asset.string = 'jier';
        asset.emptyString = '';
        asset.number = 250;
        asset.boolean = false;
        asset.emptyObj = {};
        asset.valueType = new cc.Vec2(1, 2.1);

        asset.dynamicProp = false;

        var expect = [
            1,
            0,
            0,
            [[
                "MyAsset",
                [
                    "inheritProp",
                    "string",
                    "emptyString",
                    "number",
                    "boolean",
                    "emptyObj",
                    "array",
                    "emptyArray",
                    "valueType"
                ],
                3 - 8,
                DataTypeID.ValueTypeCreated
            ]],
            [[
                0,
                0, 1, 2, 3, 4, 5, 6, 7, 8,
                9
            ]],
            [[
                0,
                321,
                "jier",
                "",
                250,
                false,
                {},
                [1, '2', {a:3}, [4, [5]], true],
                [],
                [BuiltinValueTypes.indexOf(cc.Vec2), 1, 2.1]
            ]],
            0,
            0,
            [], [], []
        ];

        match(asset, expect, 'type test');
        match(asset, expect, 'test re-serialize again');

        cc.js.unregisterClass(MyAsset);
    });

    test('nil', function () {
        var obj = {
            'null': null,
            'undefined': undefined,
        };
        var expect = [
            1,
            0,
            0,
            [],
            0,
            [{
                "null": null,
            }],
            [~DataTypeID.SimpleType],
            0,
            [], [], []
        ];
        match(obj, expect);
    });

    test('multi custom classes (not asset)', function () {
        var MyClass1 = cc.Class({
            name: 'a',
            _serialize: function (exporting, ctx) {
                ctx.dependsOn('ref', '2333');
                return ['aaa'];
            },
            _deserialize: function (data) {}
        });
        var MyClass2 = cc.Class({
            name: 'b',
            _serialize: function () {
                return 'bbb';
            },
            _deserialize: function (data) {}
        });
        var a = new MyClass1();
        var b = new MyClass2();
        var obj = [a, b, a, b, new MyClass1()];

        var expect = [
            1, ['2333'], ['ref'],
            ["a", "b"],
            0,
            [['aaa'], 'bbb', ['aaa'], [0, 1, 0, 1, 2], 3],
            [0, 1, 0, -3],
            0, [0, 2], [0, 0], [0, 0]
        ];
        match(obj, expect);

        cc.js.unregisterClass(MyClass1, MyClass2);
    });

    test('test inherited CCAsset', function() {
        var MyAsset = cc.Class({
            name: 'MyAsset',
            extends: cc.Asset,
            properties: {
                emptyArray: [],
                array: null,
                string: 'jier',
                number: 1,
                boolean: true,
                emptyObj: {
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
        asset.array = [1, '2', {a: 3}, [4, [5]], true];
        asset.dynamicProp = false;  // should not serialize
        asset._objFlags |= cc.Object.Flags.Destroying;   // will still serialize if is root object

        var expect = [
            1,
            0,
            0,
            [[
                "MyAsset",
                [
                    "array",
                ],
                3 - 1,
            ]],
            [[
                0,
                0,
                2
            ]],
            [[
                0,
                [1, '2', {a:3}, [4, [5]], true],
            ]],
            0,
            0,
            [], [], []
        ];

        match(asset, expect, 'test');

        cc.js.unregisterClass(MyAsset);
    });

    test('test circular reference + fast define', function () {
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
        cc.Class._fastDefine('MyAsset', MyAsset, { array1: [], array2: [], dict1: {}, dict2: {}});

        var asset = new MyAsset();
        var expect = [
            1,
            0,
            ["dict2", "dict1", "array2", "array1", "other"],
            [[
                "MyAsset",
                [],
                3 - 0,
            ]],
            [[
                0,
                1,
            ]],
            [
                [0],
                [1, null],
                [[1, 2], 1, 0],
                {"num": 1},
                [{ "num": 2 }, "other", 1, 3]
            ],
            [
                ~DataTypeID.SimpleType,
                ~DataTypeID.Array,
                ~DataTypeID.SimpleType,
                ~DataTypeID.Dict,
            ],
            [ 0, 0, 4,
              0, 1, 3,
              0, 2, 2,
              0, 3, 1,
              1, -2, 2,
              3, 4, 4,
              0 ],
            [], [], []
        ];
        match(asset, expect, 'arrays and dicts can circular reference each other');
        match(asset, expect, 'test re-serialize again');

        cc.js.unregisterClass(MyAsset);
    });

    test('Custom Value Type', function () {
        class Vec5 extends cc.ValueType {
            z = 0;
            w = 0;
            equals (other) {
                return other && this.z === other.z && this.w === other.w;
            }
            clone () {
                let res = new Vec5();
                res.z = this.z;
                res.w = this.w;
                return res;
            }
        }
        cc.Class._fastDefine('my_vec', Vec5, { z: 0, w: 0 });

        var obj = new Vec5();
        obj.z = 2333;
        obj.w = 666;

        var expected = [
            1,
            0,
            0,
            [[
                "my_vec",
                ['z', 'w'],
                3 - 2,
            ]],
            [[
                0,
                0, 1,
                3,
            ]],
            [[
                0,
                2333, 666
            ]],
            0,
            0,
            [], [], []
        ];
        match(obj, expected, 'pass');

        cc.js.unregisterClass(Vec5);
    });

    test('test asset property', function () {
        const uuid = '541020432560';
        var sprite = new TestSprite();
        sprite.texture = new TestTexture();
        sprite.texture._uuid = uuid;

        var expected = [
            1,
            [uuid],
            ["texture"],
            [[
                "TestSprite",
                [],
                3 - 0
            ]],
            [[0, 1]],
            [[0]],
            0,
            0,
            [0], [0], [0]
        ];
        match(sprite, expected, 'serialize asset as uuid reference');
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
            1,
            0,
            0,
            [
                [
                    "Scene",
                    ["entities"],
                    3 - 0,
                    DataTypeID.Array_Class
                ],
                [
                    "Entity",
                    [],
                    3 - 0
                ]
            ],
            [
                [0, 0, 1],
                [1, 1]
            ],
            [[
                0,
                [[1]]
            ]],
            0,
            0,
            [], [], []
        ];

        match(scene, expected, 'main asset should listed first');

        cc.js.unregisterClass(Scene, Entity);
    });

    test('node array + class + mask', function () {
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
        var node3 = new cc.Node();
        data.nodes = [node1, node2, node3];
        node1.name = 'Node 1';
        node1.parent = node2;
        node1._anchorPoint = null;    // test multi Class
        node2.name = 'Node 2';
        node2._anchorPoint = new cc.Vec2(2333, 666);    // test multi Class
        node3.name = 'Node 3';
        node3.x = 2333;     // test trs

        var expected = [
            1,
            0,
            ["_parent"],
            [
                [
                    "cc.Node",
                    ["_name", "_anchorPoint", "_trs"],
                    3 - 2,
                    DataTypeID.TRS
                ],
                [
                    "data", ["nodes"], 3 - 0, DataTypeID.Array
                ],
                [
                    "cc.Node",
                    ["_name", "_children", "_anchorPoint"],
                    3 - 1,
                    DataTypeID.Array_InstanceRef, DataTypeID.ValueTypeCreated
                ]
            ],
            [
                [1, 0, 1],
                [0, 0, 1, 3],
                [0, 0, 2, 2],
                [2, 0, 1, 2, 2]
            ],
            [
                [
                    0,
                    [[
                        -1, -2, [ 2, "Node 3", [2333, 0, 0, 0, 0, 0, 1, 1, 1, 1] ]
                    ],
                    DataTypeID.InstanceRef, DataTypeID.InstanceRef, DataTypeID.Class]
                ],
                [1, "Node 1", null],
                [3, "Node 2", [1], [0, 2333, 666]]
            ],
            0,
            [0, -1, 1, 0, -2, 2, 1, 0, 2, 2],
            [], [], []
        ];

        match(data, expected, 'pass');

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

        var expect = [
            1,
            0,
            ["newRefSelf"],
            [["MyAsset", [], 3]],
            [[0, 1]],
            [[0]],
            0,
            [0, 0, 0, 0],
            [], [], []
        ];

        match(asset, expect, 'should not export formerlySerializedAs');

        cc.js.unregisterClass(MyAsset);
    });

    test('eliminate default value type', function () {
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

        var expectedDefaultScaleResult = [
            1,
            0,
            0,
            [[
                "MyAsset",
                [
                    // should eliminate scale0 scale1 entire property if equals to the default value defined in CCClass
                    "scale00", // should export a default ValueType since not equals to default value defined in CCClass
                    "scale01",
                    "scale10"
                ],
                3 - 0,
                DataTypeID.ValueTypeCreated, DataTypeID.ValueTypeCreated, DataTypeID.ValueTypeCreated
            ]],
            [[0, 0, 1, 2, 1]],
            [[
                0,
                [1,
                 0, 0, 0],
                [1,
                 0, 1, 0],
                [1,
                 1, 0, 1]
            ]],
            0,
            0,
            [], [], []
        ];

        match(asset, expectedDefaultScaleResult, 'pass');

        cc.js.unregisterClass(MyAsset);
    });

    function testPacked (objs, expected, info) {
        let res = Editor.serializeCompiled.packJSONs(objs.map(serialize));
        deepEqual(res, expected, info);
    }

    test('pack JSONs - smoke test', function () {
        testPacked([], [1,0,0,[],0,[]], 'no data');
        testPacked([[]], [
            1, 0, 0, [], 0,
            [
                [[[]], [-1], 0, [], [], []]
            ]
        ], 'empty array');
        testPacked([{}], [
            1, 0, 0, [], 0,
            [
                [[{}], [-1], 0, [], [], []]
            ]
        ], 'empty dict');
    });

})();
}
