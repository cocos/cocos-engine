
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
    let { deserializeCCObject, File, DataTypeID, dereference, BuiltinValueTypes } = cc._Test.deserializeCompiled;

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
                    let res = new Vec2();
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

    test('deserializeCCObject - Dict/Array', function () {
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
    let { File, DataTypeID, parseInstances } = cc._Test.deserializeCompiled;

    var Asset = cc.Class({
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

    let details = new cc.deserialize.Details();
    let data = {
        [File.Context]: { result: details },
        [File.SharedClasses]: [[
            Ctor,
            ['obj'],
            3 - 0,  // offset
            DataTypeID.CustomizedClass,
        ], Asset],
        [File.SharedMasks]: [[0, 0, 1]],
        [File.Instances]: [
            [0, [1, ['inner prop1', 'inner-uuid-123']]], [23333, 'outer-uuid-123'], 0
        ],
        [File.Instances_CustomClasses]: [
            1,
        ]
    };

    parseInstances(data);
    let instances = data[File.Instances];
    ok(instances[0].obj instanceof Asset, 'embedded custom class should be created');
    strictEqual(instances[0].obj.prop1, 'inner prop1', 'embedded custom class should be deserialized correctly');
    ok(instances[1] instanceof Asset, 'indexed custom class should be created');
    strictEqual(instances[1].prop1, 23333, 'indexed custom class should be deserialized correctly');

    deepEqual(details.uuidObjList, [instances[0].obj, instances[1]], 'uuid objects should be deserialized correctly');
    deepEqual(details.uuidPropList, ['asset', 'asset'], 'uuid keys should be deserialized correctly');
    deepEqual(details.uuidList, ['inner-uuid-123', 'outer-uuid-123'], 'uuids should be deserialized correctly');

    cc.js.unregisterClass(Asset);
});
