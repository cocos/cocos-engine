
largeModule('Deserialize Compiled');

test('dereference', function () {

    let dereference = cc._Test.deserializeCompiled.dereference;

    // smoke test
    dereference([0], [], []);

    // only object
    var owner = {};
    var target = {};
    var strings = ['foo'];
    var instances = [target];
    var refs = [owner, 0, 0, 1];
    dereference(refs, instances, strings);
    strictEqual(owner.foo, target, 'should success if only object supplied');

    // only instance index
    var owner = {};
    var target = {};
    var strings = ['foo'];
    var instances = [owner, target];
    var refs = [0, 0, 1, 0];
    dereference(refs, instances, strings);
    strictEqual(owner.foo, target, 'should success if only instance index supplied');

    // both
    var owner1 = [null];
    var target = {};
    var strings = ['foo'];
    var instances = [target];
    var refs = [owner1, ~0, 0, 0, 0, 0, 1];
    dereference(refs, instances, strings);
    strictEqual(owner1[0], target, 'array should reference to target if has both kinds of reference');
    strictEqual(target.foo, target, 'indexed object could reference to itself if has both kinds of reference');
});

{
    let { deserializeCCObject, File, DataTypeID, dereference, BuiltinValueTypes, cacheMasks } = cc._Test.deserializeCompiled;

    let Ctor = function () {
    };

    let rapidDeserialize = function (options) {
        let { dataType, value, strings, instances, refs, dependObjs, ctor, prop, classes, masks } = options;
        let key = prop || 'rapidDeserialize';
        let simpleCount = dataType === DataTypeID.SimpleType ? 1 : 0;
        let klass = [ctor || Ctor, [key], 3 - simpleCount, dataType];
        let mask = [ 0, 0, simpleCount];
        let objectData = [0, value];
        if (classes) {
            classes.push(klass);
            mask[0] = classes.length - 1;
        }
        else {
            classes = [ klass ];
        }
        if (masks) {
            masks.push(mask);
            objectData[0] = masks.length - 1;
        }
        else {
            masks = [mask];
        }
        let fileData = {
            [File.SharedClasses]: classes,
            [File.SharedMasks]: masks,
            [File.Instances]: instances,
            [File.Refs]: refs,
            [File.DependObjs]: dependObjs,
        };
        cacheMasks(fileData);
        let obj = deserializeCCObject(fileData, objectData);
        if (refs) {
            dereference(fileData[File.Refs], instances, strings);
        }
        options.out_obj = obj;
        return obj[key];
    };

    test('deserializeCCObject', function () {
        let obj1 = {};
        let obj2 = {};

        let data = {
            [File.SharedClasses]: [[
                Ctor,
                ['x', 'data', 'obj1', 'refByInnerObj', 'comps', 'meta', 'metas'],
                3 - 2,  // offset
                DataTypeID.InstanceRef,
                DataTypeID.InstanceRef,
                DataTypeID.Array_InstanceRef,
                DataTypeID.Class,
                DataTypeID.Array_Class,
            ]],
            [File.SharedMasks]: [[
                0,  // class
                1   // offset
            ], [
                0,  // class
                0, 1,
                3   // offset
            ], [
                0,  // class
                2,
                1   // offset
            ], [
                0,  // class
                2, 3,
                1   // offset
            ], [
                0,  // class
                4,  // comps
                1   // offset
            ], [
                0,  // class
                5,
                1   // offset
            ], [
                0,  // class
                6,
                1   // offset
            ]],
            [File.Instances]: [
                obj1,
            ],
            [File.Refs]:[
                0, 0, 1
            ],
        };
        cacheMasks(data);
        let obj = deserializeCCObject(data, [0]);
        strictEqual(obj instanceof Ctor, true, 'object should instance of the class');
        let jsonObj = [1, {}, null];
        obj = deserializeCCObject(data, [1, 2, jsonObj]);
        strictEqual(obj.x, 2, 'simple type should deserizlied correctly');
        deepEqual(obj.data, jsonObj, 'simple type should deserizlied correctly even if it is json object');

        obj = deserializeCCObject(data, [2, 0]);
        strictEqual(obj.obj1, obj1, 'ref type should ref to obj1');

        obj = deserializeCCObject(data, [3, 0, ~0]);
        dereference(data[File.Refs], [null, obj2],['refByInnerObj']);
        strictEqual(obj.refByInnerObj, obj2, 'inner ref type should ref to obj2');

        obj = deserializeCCObject(data, [4, [0, 0]]);
        deepEqual(obj.comps, [obj1, obj1], 'array of ref types should deserialized correctly');

        // Class
        obj = deserializeCCObject(data, [5, [4, [0, 0]]]);
        deepEqual(obj.meta.comps, [obj1, obj1], 'embedded object should deserialized correctly');

        // Array_Class
        obj = deserializeCCObject(data, [6,  [[4, [0, 0]], [4, [0, 0]]]]);
        deepEqual(obj.metas[0].comps, [obj1, obj1], 'array of embedded object should deserialized correctly 1');
        deepEqual(obj.metas[1].comps, [obj1, obj1], 'array of embedded object should deserialized correctly 2');

        {
            let depends = [NaN];
            let options = {
                dataType: DataTypeID.AssetRefByInnerObj,
                value: 0,
                dependObjs: depends
            };
            let val = rapidDeserialize(options);
            deepEqual(val, null, 'array of assets should inited as null');
            strictEqual(depends[0], options.out_obj, 'asset refs should registered correctly');
        }

        {
            let depends = [NaN, NaN];
            let array = [0, 1];
            let val = rapidDeserialize({
                dataType: DataTypeID.Array_AssetRefByInnerObj,
                value: array,
                dependObjs: depends
            });
            deepEqual(val, [null, null], 'array of assets should inited as null');
            deepEqual(depends, [array, array], 'array of asset refs should registered correctly');
        }
        // ASSIGNMENTS[DataTypeID.AssetRefByInnerObj] = parseAssetRefByInnerObj;

        // Value Type Created
        {
            let rapidTestValueTypeCreated = function (valueTypeCtor, subsequentData) {
                const PROP = 'vt';
                const simpleCount = 0;
                function Ctor () {
                    this.vt = new valueTypeCtor();
                }
                let klass = [Ctor, [PROP], 3 - simpleCount, DataTypeID.ValueTypeCreated];
                let mask = [ 0, 0, simpleCount];
                let fileData = {
                    [File.SharedClasses]: [ klass ],
                    [File.SharedMasks]: [ mask ],
                };
                let objectData = [0, [BuiltinValueTypes.indexOf(valueTypeCtor)].concat(subsequentData)];
                cacheMasks(fileData);
                let obj = deserializeCCObject(fileData, objectData);
                return obj[PROP];
            };
            let val = rapidTestValueTypeCreated(cc.Vec2, [0.5, 0.9]);
            ok(val.equals(new cc.Vec2(0.5, 0.9)), 'created Vec2 should deserialized correctly');
            val = rapidTestValueTypeCreated(cc.Vec3, [0, 0.9, -3]);
            ok(val.equals(new cc.Vec3(0, 0.9, -3)), 'created Vec3 should deserialized correctly');
            val = rapidTestValueTypeCreated(cc.Vec4, [0.5, 0, -3, 0.5]);
            ok(val.equals(new cc.Vec4(0.5, 0, -3, 0.5)), 'created Vec4 should deserialized correctly');
            val = rapidTestValueTypeCreated(cc.Quat, [0.5, 0, -3, 0.5]);
            ok(val.equals(new cc.Quat(0.5, 0, -3, 0.5)), 'created Quat should deserialized correctly');

            val = rapidTestValueTypeCreated(cc.Color, new cc.Color(0, 1, 255, 127)._val);
            ok(val.equals(new cc.Color(0, 1, 255, 127)), 'created Color should deserialized correctly');
            val = rapidTestValueTypeCreated(cc.Size, [0.5, 0.9]);
            ok(val.equals(new cc.Size(0.5, 0.9)), 'created Size should deserialized correctly');
            val = rapidTestValueTypeCreated(cc.Rect, [0.5, 0, -3, 0.5]);
            ok(val.equals(new cc.Rect(0.5, 0, -3, 0.5)), 'created Rect should deserialized correctly');

            val = rapidTestValueTypeCreated(cc.Mat4, [0.5, 0.9, 0.5, 0,  -3, 0.5, 0.5, 0,  -3, -3, 0.5, 0.5,  0.5, 0.9, 0.5, 10]);
            ok(val.equals(new cc.Mat4(0.5, 0.9, 0.5, 0,  -3, 0.5, 0.5, 0,  -3, -3, 0.5, 0.5,  0.5, 0.9, 0.5, 10)), 'created Mat4 should deserialized correctly');
        }

        // Value Type
        {
            let rapidTestValueType = function (valueTypeCtor, subsequentData) {
                const PROP = 'vt';
                const simpleCount = 0;
                function Ctor () { }
                let klass = [Ctor, [PROP], 3 - simpleCount, DataTypeID.ValueType];
                let mask = [0, 0, simpleCount];
                let fileData = {
                    [File.SharedClasses]: [ klass ],
                    [File.SharedMasks]: [ mask ],
                };
                let objectData = [0, [BuiltinValueTypes.indexOf(valueTypeCtor)].concat(subsequentData)];
                cacheMasks(fileData);
                let obj = deserializeCCObject(fileData, objectData);
                return obj[PROP];
            };
            let val = rapidTestValueType(cc.Vec2, [0.5, 0.9]);
            ok(val.equals(new cc.Vec2(0.5, 0.9)), 'Vec2 should deserialized correctly');
            val = rapidTestValueType(cc.Vec3, [0, 0.9, -3]);
            ok(val.equals(new cc.Vec3(0, 0.9, -3)), 'Vec3 should deserialized correctly');
            val = rapidTestValueType(cc.Vec4, [0.5, 0, -3, 0.5]);
            ok(val.equals(new cc.Vec4(0.5, 0, -3, 0.5)), 'Vec4 should deserialized correctly');
            val = rapidTestValueType(cc.Quat, [0.5, 0, -3, 0.5]);
            ok(val.equals(new cc.Quat(0.5, 0, -3, 0.5)), 'Quat should deserialized correctly');

            val = rapidTestValueType(cc.Color, new cc.Color(0, 1, 255, 127)._val);
            ok(val.equals(new cc.Color(0, 1, 255, 127)), 'Color should deserialized correctly');
            val = rapidTestValueType(cc.Size, [0.5, 0.9]);
            ok(val.equals(new cc.Size(0.5, 0.9)), 'Size should deserialized correctly');
            val = rapidTestValueType(cc.Rect, [0.5, 0, -3, 0.5]);
            ok(val.equals(new cc.Rect(0.5, 0, -3, 0.5)), 'Rect should deserialized correctly');

            val = rapidTestValueType(cc.Mat4, [0.5, 0.9, 0.5, 0,  -3, 0.5, 0.5, 0,  -3, -3, 0.5, 0.5,  0.5, 0.9, 0.5, 10]);
            ok(val.equals(new cc.Mat4(0.5, 0.9, 0.5, 0,  -3, 0.5, 0.5, 0,  -3, -3, 0.5, 0.5,  0.5, 0.9, 0.5, 10)), 'Mat4 should deserialized correctly');
        }

        // TRS
        {
            let trs = [
                175,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                1,
                1
            ];
            let val = rapidDeserialize({
                ctor: cc.Node,
                prop: '_trs',
                dataType: DataTypeID.TRS,
                value: trs,
            });
            deepEqual(Array.from(val), trs, 'TRS should deserialized correctly');
        }

        // Custom Value Type serialized as common Class
        {
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
            cc.Class.fastDefine('my_vec', Vec5, { z: 0, w: 0 });

            let vec = new Vec5();
            vec.z = 2333;
            vec.w = 666;

            let res = rapidDeserialize({
                dataType: DataTypeID.Class,
                classes: [[
                    Vec5,
                    ['z', 'w'],
                    3 - 2,  // offset
                    DataTypeID.SimpleType,
                    DataTypeID.SimpleType,
                ]],
                masks: [[0, 0, 1, 3]],
                value: [0, 2333, 666],
            });

            ok(res instanceof Vec5, 'Custom ValueType should deserialized correctly');
            ok(res.equals(vec), 'Custom ValueType should deserialized correctly');

            cc.js.unregisterClass(Vec5);
        }
    });

    test('deserializeCCObject + Dict/Array', function () {
        let obj = {};

        let dictDataInArray = [
            { asset: null },
            'asset', DataTypeID.AssetRefByInnerObj, 1
        ];
        let arrayData = [
            [123, [0, [0, 0]], dictDataInArray, 0],
            DataTypeID.SimpleType, DataTypeID.Class, DataTypeID.Dict, DataTypeID.AssetRefByInnerObj
        ];
        let rawDict = {
            name: 'jier',
            ref: null,
            elements: null,
        };
        let depends = [NaN, NaN];
        let val = rapidDeserialize({
            dataType: DataTypeID.Dict,
            value: [
                rawDict,
                'ref', DataTypeID.InstanceRef, 0,
                'elements', DataTypeID.Array, arrayData,
            ],
            instances: [obj],
            dependObjs: depends,
            classes: [[
                Ctor,
                ['comps'],
                3 - 0,  // offset
                DataTypeID.Array_InstanceRef,
            ]],
            masks: [[0, 0, 1]],
            // refs: [NaN, 0, 0]
        });
        deepEqual(Object.keys(val), ['name', 'ref', 'elements'], 'Dict keys should be deserialized correctly');
        strictEqual(val.name, rawDict.name, 'Simple value in dict should be deserialized directly');
        strictEqual(val.ref, obj, 'Advanced value in dict should be deserialized correctly');
        ok(Array.isArray(val.elements), 'Array in dict should be deserialized correctly');
        strictEqual(val.elements.length, arrayData[0].length, 'Array length in dict should be deserialized correctly');
        strictEqual(val.elements[0], arrayData[0][0], 'Simple value in array should be deserialized correctly');
        ok(val.elements[1] instanceof Ctor, 'Class in sub array should be deserialized correctly 1');
        strictEqual(val.elements[1].comps[0], obj, 'Class in sub array should be deserialized correctly 2');
        strictEqual(val.elements[1].comps[1], obj, 'Class in sub array should be deserialized correctly 3');
        strictEqual(typeof val.elements[2], 'object', 'Dict in sub array should be deserialized correctly');
        strictEqual(depends[0], val.elements, 'Asset ref in sub array should be deserialized correctly');
        strictEqual(depends[1], val.elements[2], 'Asset ref in sub dict should be deserialized correctly');
    });
}

test('deserializeCustomCCObject', function () {
    let { File, DataTypeID, parseInstances, parseResult, deserialize: deserializeCompiled, cacheMasks } = cc._Test.deserializeCompiled;

    var MyClass = cc.Class({
        name: 'a a b b',
        extend: cc.Object,
        properties: {
            prop1: 1,
        },
        _serialize: function () {
            return [this.prop1];
        },
        _deserialize: function (data, handle) {
            this.prop1 = data[0];
            handle.result.push(this, 'asset', data[1]);
        }
    });

    let Ctor = function () {
    };

    let details = new cc._deserializeCompiled.Details();
    let data = {
        [File.Context]: { result: details },
        [File.SharedUuids]: ['outer-uuid-233'],
        [File.SharedStrings]: ['ref'],
        [File.SharedClasses]: [[
            Ctor,
            ['obj'],
            3 - 0,  // offset
            DataTypeID.CustomizedClass,
        ], MyClass],
        [File.SharedMasks]: [[0, 0, 1]],
        [File.Instances]: [
            [0, [1, ['inner prop1', 'inner-uuid-123']]], [23333, 'outer-uuid-123'], 0
        ],
        [File.InstanceTypes]: [1],
        [File.DependObjs]: [1],
        [File.DependKeys]: [0],
        [File.DependUuidIndices]: [0],
    };
    details.init(data);

    cacheMasks(data);
    parseInstances(data);
    parseResult(data);
    let instances = data[File.Instances];
    ok(instances[0].obj instanceof MyClass, 'embedded custom class should be created');
    strictEqual(instances[0].obj.prop1, 'inner prop1', 'embedded custom class should be deserialized correctly');
    ok(instances[1] instanceof MyClass, 'indexed custom class should be created');
    strictEqual(instances[1].prop1, 23333, 'indexed custom class should be deserialized correctly');

    deepEqual(details.uuidObjList, [instances[1], instances[0].obj, instances[1]], 'uuid objects should be deserialized correctly');
    deepEqual(details.uuidPropList, ['ref', 'asset', 'asset'], 'uuid keys should be deserialized correctly');
    deepEqual(details.uuidList, ['outer-uuid-233', 'inner-uuid-123', 'outer-uuid-123'], 'uuids should be deserialized correctly');

    cc.js.unregisterClass(MyClass);
});

if (TestEditorExtends) { (function () {

    let { deserialize: deserializeCompiled } = cc._Test.deserializeCompiled;
    let match = function (obj, info) {
        // 有些属性无法被保存到 JSON 中，所以 JSON.stringify 一次比较准确
        deepEqual(obj, deserializeCompiled(Editor.serializeCompiled(obj, {stringify: true})), info);
    };

    test('basic deserialize test', function () {
        var MyAsset = (function () {
            function MyAsset () {
                this.emptyArray = [];
                this.array = [1, '2', {a:3}, [4, [5]], true];
                this.string = 'jier';
                this.emptyString = '';
                this.number = 250;
                this.boolean = false;
                this.emptyObj = {};
                this.valueType = new cc.Vec2(1, 2.1);
            }
            cc.Class._fastDefine('MyAsset', MyAsset,
                {'emptyArray': [], 'array': [], 'string': 'unknown', 'emptyString': 'unknown', 'number': 1, 'boolean': true, 'emptyObj': null, 'valueType': new cc.Vec2()});
            return MyAsset;
        })();

        var asset = new MyAsset();
        var serializedAsset = Editor.serializeCompiled(asset);
        var deserializedAsset = deserializeCompiled(serializedAsset);

        deepEqual(deserializedAsset, asset, 'test deserialize');

        cc.js.unregisterClass(MyAsset);
    });

    test('deserialize simple objects', function () {
        match([], 'can deserialize empty array');
        match({}, 'can deserialize empty dict');
        match({ 'null': null }, 'can deserialize null');
    });

    test('deserialize basic objects', function () {
        var MyAsset = cc.Class({
            name: 'MyAsset',
            ctor: function () {
                this.foo = 'bar';
            },
            properties: {
                nil: 1234
            }
        });

        let obj = new MyAsset();
        match(obj, 'use default value');

        obj = new MyAsset();
        obj.nil = null;
        match(obj, 'can override as null');

        cc.js.unregisterClass(MyAsset);
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

        let obj = new Vec3(1, 2, 3);
        match(obj, 'pass');

        cc.js.unregisterClass(Vec3);
    });

    test('reference to main asset', function () {
        var asset = {};
        asset.refSelf = asset;

        var serializedAsset = Editor.serializeCompiled(asset);
        var deserializedAsset = deserializeCompiled(serializedAsset);

        ok(deserializedAsset.refSelf === deserializedAsset, 'should ref to self');
    });

    // test('reference to main asset with formerlySerializedAs', function () {
    //     var MyAsset = cc.Class({
    //         name: 'MyAsset',
    //         properties: {
    //             newRefSelf: {
    //                 default: null,
    //                 formerlySerializedAs: 'oldRefSelf'
    //             },
    //         }
    //     });
    //     var asset = new MyAsset();
    //     asset.newRefSelf = asset;
    //
    //     var serializedAsset = Editor.serializeCompiled(asset);
    //     serializedAsset = serializedAsset.replace(/newRefSelf/g, 'oldRefSelf');
    //     var deserializedAsset = deserializeCompiled(serializedAsset);
    //
    //     ok(deserializedAsset.newRefSelf === deserializedAsset, 'should ref to self');
    //
    //     cc.js.unregisterClass(MyAsset);
    // });

    test('custom serialization - deserialization', function () {
        var MyClass = cc.Class({
            name: 'a a b b',
            extend: cc.Object,
            properties: {
                prop1: 1,
                prop2: 2
            },
            _serialize: function () {
                return [this.prop1, this.prop2];
            },
            _deserialize: function (data) {
                this.prop1 = data[0];
                this.prop2 = data[1];
            }
        });
        var a = new MyClass();
        a.prop1 = 2333;
        a.prop2 = 666;
        match(a, 'pass');

        cc.js.unregisterClass(MyClass);
    });

    test('eliminated default property for unknown value type', function () {
        function Vec3 (x, y, z) {
            this.x = x || 1;
            this.y = y || 0;
            this.z = z || 0;
        }
        cc.js.extend(Vec3, cc.ValueType);
        cc.Class.fastDefine('Vector3', Vec3, { x: 1, y: 0, z: 0 });
        window.Vector3 = Vec3;

        Vec3.prototype.clone = function () {
            return new Vec3(this.x, this.y, this.z);
        };
        Vec3.prototype.equals = function (other) {
            return this.x === other.x && this.y === other.y && this.z === other.z;
        };

        var MyAsset = cc.Class({
            name: 'MyAsset',
            properties: {
                scale1: new Vec3(1, 0, 0),      //  'should load eliminated entire property'
                scale10: new Vec3(1, 99, 0),
            }
        });
        var asset = new MyAsset();
        asset.scale10.y = 0;                    // 'should load eliminated sub property'

        match(asset, 'pass');

        cc.js.unregisterClass(Vec3, MyAsset);
        delete window.Vector3;
    });
})();
}
