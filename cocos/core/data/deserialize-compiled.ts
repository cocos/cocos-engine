/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @hidden
 */

import { ValueType } from '../value-types/value-type';
import { Vec2 } from '../math/vec2';
import { Vec3 } from '../math/vec3';
import { Vec4 } from '../math/vec4';
import { Color } from '../math/color';
import { Size } from '../math/size';
import { Rect } from '../math/rect';
import { Quat } from '../math/quat';
import { Mat4 } from '../math/mat4';

import { warnID, errorID, getError } from '../platform/debug';
import * as js from '../utils/js';

import { EDITOR, TEST, PREVIEW, DEBUG } from 'internal:constants';
import { legacyCC } from '../global-exports';

/****************************************************************************
 * BUILT-IN TYPES / CONSTAINTS
 ****************************************************************************/

const SUPPORT_MIN_FORMAT_VERSION = 1;
const EMPTY_PLACEHOLDER = 0;

// Used for Data.ValueType.
// If a value type is not registered in this list, it will be serialized to Data.Class.
const BuiltinValueTypes: (typeof ValueType)[] = [
    Vec2,   // 0
    Vec3,   // 1
    Vec4,   // 2
    Quat,   // 3
    Color,  // 4
    Size,   // 5
    Rect,   // 6
    Mat4,   // 7
];

// Used for Data.ValueTypeCreated.
function BuiltinValueTypeParsers_xyzw (obj: Vec4, data: number[]) {
    obj.x = data[1];
    obj.y = data[2];
    obj.z = data[3];
    obj.w = data[4];
}
const BuiltinValueTypeSetters: ((obj: ValueType, data: number[]) => void)[] = [
    (obj: Vec2, data: number[]) => {
        obj.x = data[1];
        obj.y = data[2];
    },
    (obj: Vec3, data: number[]) => {
        obj.x = data[1];
        obj.y = data[2];
        obj.z = data[3];
    },
    BuiltinValueTypeParsers_xyzw,   // Vec4
    BuiltinValueTypeParsers_xyzw,   // Quat
    (obj: Color, data: number[]) => {
        obj._val = data[1];
    },
    (obj: Size, data: number[]) => {
        obj.width = data[1];
        obj.height = data[2];
    },
    (obj: Rect, data: number[]) => {
        obj.x = data[1];
        obj.y = data[2];
        obj.width = data[3];
        obj.height = data[4];
    },
    (obj: Mat4, data: number[]) => {
        Mat4.fromArray(obj, data, 1);
    }
];

function serializeBuiltinValueTypes (obj: ValueType): IValueTypeData | null {
    const ctor = obj.constructor as typeof ValueType;
    const typeId = BuiltinValueTypes.indexOf(ctor);
    switch (ctor) {
        case Vec2:
            // @ts-ignore
            return [typeId, obj.x, obj.y];
        case Vec3:
            // @ts-ignore
            return [typeId, obj.x, obj.y, obj.z];
        case Vec4:
        case Quat:
            // @ts-ignore
            return [typeId, obj.x, obj.y, obj.z, obj.w];
        case Color:
            // @ts-ignore
            return [typeId, obj._val];
        case Size:
            // @ts-ignore
            return [typeId, obj.width, obj.height];
        case Rect:
            // @ts-ignore
            return [typeId, obj.x, obj.y, obj.width, obj.height];
        case Mat4:
            // @ts-ignore
            const res: IValueTypeData = new Array(1 + 16);
            res[VALUETYPE_SETTER] = typeId;
            Mat4.toArray(res, obj as Mat4, 1);
            return res;
        default:
            return null;
    }
}

// // TODO: Used for Data.TypedArray.
// const TypedArrays = [
//     Float32Array,
//     Float64Array,
//
//     Int8Array,
//     Int16Array,
//     Int32Array,
//
//     Uint8Array,
//     Uint16Array,
//     Uint32Array,
//
//     Uint8ClampedArray,
//     // BigInt64Array,
//     // BigUint64Array,
// ];


/****************************************************************************
 * TYPE DECLARATIONS
 ****************************************************************************/

// Includes Bitwise NOT value.
// Both T and U have non-negative integer ranges.
// When the value >= 0 represents T
// When the value is < 0, it represents ~U. Use ~x to extract the value of U.
export type Bnot<T extends number, U extends number> = T|U;

// Combines a boolean and a number into one value.
// The number must >= 0.
// When the value >= 0, the boolean is true, the number is value.
// When the value < 0, the boolean is false, the number is ~value.
export type BoolAndNum<B extends boolean, N extends number> = Bnot<N, N>;

export type SharedString = string;
export type Empty = typeof EMPTY_PLACEHOLDER;
export type StringIndex = number;
export type InstanceIndex = number;
export type RootInstanceIndex = InstanceIndex;
export type NoNativeDep = boolean;  // Indicates whether the asset depends on a native asset
export type RootInfo = BoolAndNum<NoNativeDep, RootInstanceIndex>;

// When the value >= 0 represents the string index
// When the value is < 0, it just represents non-negative integer. Use ~x to extract the value.
export type StringIndexBnotNumber = Bnot<StringIndex, number>;

// A reverse index used to assign current parsing object to target command buffer so it could be assembled later.
// Should >= REF.OBJ_OFFSET
export type ReverseIndex = number;

// Used to index the current object
export type InstanceBnotReverseIndex = Bnot<InstanceIndex, ReverseIndex>;

/*@__DROP_PURE_EXPORT__*/
export const enum DataTypeID {

    // Fields that can be assigned directly, can be values in any JSON, or even a complex JSON array, object (no type).
    // Contains null, no undefined, JSON does not support serialization of undefined.
    // This is the only type that supports null, and all other advanced fields are forbidden with null values.
    // If the value of an object is likely to be null, it needs to exist as a new class,
    // but the probability of this is very low and will be analyzed below.
    SimpleType = 0,

    // --------------------------------------------------------------------------
    // Except Simple, the rest belong to Advanced Type.

    // Rarely will it be NULL, as NULL will be dropped as the default value.
    InstanceRef,

    // Arrays of exactly equal types.
    // Arrays will have default values that developers will rarely assign to null manually.
    Array_InstanceRef,
    Array_AssetRefByInnerObj,

    // Embedded object
    // Rarely will it be NULL, as NULL will be dropped as the default value.
    Class,

    // Existing ValueType (created by the Class constructor).
    // Developers will rarely manually assign a null.
    ValueTypeCreated,

    // Resource reference for embedded objects (such as arrays), the value is the index of DEPEND_OBJS.
    // (The objects in INSTANCES do not need to dynamically resolve resource reference relationships, so there is no need to have the AssetRef type.)
    AssetRefByInnerObj,

    // Common TypedArray for legacyCC.Node only. Never be null.
    TRS,

    // // From the point of view of simplified implementation,
    // // it is not supported to deserialize TypedArray that is initialized to null in the constructor.
    // // Also, the length of TypedArray cannot be changed.
    // // Developers will rarely manually assign a null.
    // TypedArray,

    // ValueType without default value (in arrays, dictionaries).
    // Developers will rarely manually assign a null.
    ValueType,

    Array_Class,

    // CustomizedClass embedded in Class
    CustomizedClass,

    // Universal dictionary with unlimited types of values (except TypedArray)
    Dict,

    // Universal arrays, of any type (except TypedArray) and can be unequal.
    // (The editor doesn't seem to have a good way of stopping arrays of unequal types either)
    Array,

    ARRAY_LENGTH,
}

export type DataTypes = {
    [DataTypeID.SimpleType]: number | string | boolean | null | object;
    [DataTypeID.InstanceRef]: InstanceBnotReverseIndex;
    [DataTypeID.Array_InstanceRef]: DataTypes[DataTypeID.InstanceRef][];
    [DataTypeID.Array_AssetRefByInnerObj]: DataTypes[DataTypeID.AssetRefByInnerObj][];
    [DataTypeID.Class]: IClassObjectData;
    [DataTypeID.ValueTypeCreated]: IValueTypeData;
    [DataTypeID.AssetRefByInnerObj]: number;
    [DataTypeID.TRS]: ITRSData;
    // [DataTypeID.TypedArray]: Array<InstanceOrReverseIndex>;
    [DataTypeID.ValueType]: IValueTypeData;
    [DataTypeID.Array_Class]: DataTypes[DataTypeID.Class][];
    [DataTypeID.CustomizedClass]: ICustomObjectData;
    [DataTypeID.Dict]: IDictData;
    [DataTypeID.Array]: IArrayData;
};

export type PrimitiveObjectTypeID = (
    DataTypeID.SimpleType | // SimpleType also includes any pure JSON object
    DataTypeID.Array |
    DataTypeID.Array_Class |
    DataTypeID.Array_AssetRefByInnerObj |
    DataTypeID.Array_InstanceRef |
    DataTypeID.Dict
);

export type AdvancedTypeID = Exclude<DataTypeID, DataTypeID.SimpleType>


// Collection of all data types
export type AnyData = DataTypes[keyof DataTypes];

export type AdvancedData = DataTypes[Exclude<keyof DataTypes, DataTypeID.SimpleType>];

export type OtherObjectData = ICustomObjectDataContent | Exclude<DataTypes[PrimitiveObjectTypeID], (number|string|boolean|null)>;

// class Index of DataTypeID.CustomizedClass or PrimitiveObjectTypeID
export type OtherObjectTypeID = Bnot<number, PrimitiveObjectTypeID>;

export type Ctor<T> = new() => T;
// Includes normal CCClass and fast defined class
export interface CCClass<T> extends Ctor<T> {
    __values__: string[]
}
export type AnyCtor = Ctor<Object>;
export type AnyCCClass = CCClass<Object>;

/**
 * If the value type is different, different Classes will be generated
 */
const CLASS_TYPE = 0;
const CLASS_KEYS = 1;
const CLASS_PROP_TYPE_OFFSET = 2;
export type IClass = [
    string|AnyCtor,
    string[],
    // offset - It is used to specify the correspondence between the elements in CLASS_KEYS and their AdvancedType,
    //          which is only valid for AdvancedType.
    // When parsing, the type of IClass[CLASS_KEYS][x] is IClass[x + IClass[CLASS_PROP_TYPE_OFFSET]]
    // When serializing, IClass[CLASS_PROP_TYPE_OFFSET] = CLASS_PROP_TYPE_OFFSET + 1 - (The number of SimpleType)
    number,
    // The AdvancedType type corresponding to the property.
    ...DataTypeID[]
];

/**
 * Mask is used to define the properties and types that need to be deserialized.
 * Instances of the same class may have different Masks due to different default properties removed.
 */
const MASK_CLASS = 0;
export type IMask = [
    // The index of its Class
    number,
    // The indices of the property that needs to be deserialized in IClass, except that the last number represents OFFSET.
    // All properties before OFFSET are SimpleType, and those starting at OFFSET are AdvancedType.
    // default is 1
    ...number[]
];

const OBJ_DATA_MASK = 0;
export type IClassObjectData = [
    // The index of its Mask
    number,
    // Starting from 1, the values corresponding to the properties in the Mask
    ...AnyData[]
];

export type ICustomObjectDataContent = any;

const CUSTOM_OBJ_DATA_CLASS = 0;
const CUSTOM_OBJ_DATA_CONTENT = 1;
export interface ICustomObjectData extends Array<any> {
    // The index of its Class
    [CUSTOM_OBJ_DATA_CLASS]: number;
    // Content
    [CUSTOM_OBJ_DATA_CONTENT]: ICustomObjectDataContent;
}

const VALUETYPE_SETTER = 0;
export type IValueTypeData = [
    // Predefined parsing function index
    number,
    // Starting with 1, the corresponding value in the attributes are followed in order
    ...number[]
];

export type ITRSData = [number, number, number, number, number,
                        number, number, number, number, number];

const DICT_JSON_LAYOUT = 0;
export interface IDictData extends Array<any> {
    // The raw json object
    [DICT_JSON_LAYOUT]: any,
    // key
    // Shared strings are not considered here, can be defined as CCClass if it is required.
    [1]: string;
    // value type
    // Should not be SimpleType, SimpleType is built directly into DICT_JSON_LAYOUT.
    [2]: AdvancedTypeID;
    // value
    [3]: AdvancedData;
    // More repeated key values
    [index: number]: any,
}

const ARRAY_ITEM_VALUES = 0;
export type IArrayData = [
    AnyData[],
    // types
    ...DataTypeID[]
];

// const TYPEDARRAY_TYPE = 0;
// const TYPEDARRAY_ELEMENTS = 1;
// export interface ITypedArrayData extends Array<number|number[]> {
//     [TYPEDARRAY_TYPE]: number,
//     [TYPEDARRAY_ELEMENTS]: number[],
// }

/*@__DROP_PURE_EXPORT__*/
export const enum Refs {
    EACH_RECORD_LENGTH = 3,
    OWNER_OFFSET = 0,
    KEY_OFFSET = 1,
    TARGET_OFFSET = 2,
}

export interface IRefs extends Array<number> {
    // owner
    // The owner of all the objects in the front is of type object, starting from OFFSET * 3 are of type InstanceIndex
    [0]: (object | InstanceIndex),
    // property name
    [1]?: StringIndexBnotNumber;
    // target object
    [2]?: InstanceIndex;
    // All the following objects are arranged in the order of the first three values,
    // except that the last number represents OFFSET.
    [index: number]: any;
}

/*@__DROP_PURE_EXPORT__*/
export const enum File {
    Version = 0,
    Context = 0,

    SharedUuids,
    SharedStrings,
    SharedClasses,
    SharedMasks,

    Instances,
    InstanceTypes,

    Refs,

    DependObjs,
    DependKeys,
    DependUuidIndices,

    ARRAY_LENGTH,
}

// Main file structure
export interface IFileData extends Array<any> {
    // version
    [File.Version]: number | FileInfo | any;

    // Shared data area, the higher the number of references, the higher the position

    [File.SharedUuids]: SharedString[] | Empty; // Shared uuid strings for dependent assets
    [File.SharedStrings]: SharedString[] | Empty;
    [File.SharedClasses]: (IClass|string|AnyCCClass)[];
    [File.SharedMasks]: IMask[] | Empty;  // Shared Object layouts for IClassObjectData

    // Data area

    // A one-dimensional array to represent object datas, layout is [...IClassObjectData[], ...OtherObjectData[], RootInfo]
    // If the last element is not RootInfo(number), the first element will be the root object to return and it doesn't have native asset
    [File.Instances]: (IClassObjectData|OtherObjectData|RootInfo)[];
    [File.InstanceTypes]: OtherObjectTypeID[] | Empty;
    // Object references infomation
    [File.Refs]: IRefs | Empty;

    // Result area

    // Asset-dependent objects that are deserialized and parsed into object arrays
    [File.DependObjs]: (object|InstanceIndex)[];
    // Asset-dependent key name or array index
    [File.DependKeys]: (StringIndexBnotNumber|string)[];
    // UUID of dependent assets
    [File.DependUuidIndices]: (StringIndex|string)[];
}

// type Body = Pick<IFileData, File.Instances | File.InstanceTypes | File.Refs | File.DependObjs | File.DependKeys | File.DependUuidIndices>
type Shared = Pick<IFileData, File.Version | File.SharedUuids | File.SharedStrings | File.SharedClasses | File.SharedMasks>
const PACKED_SECTIONS = File.Instances;
export interface IPackedFileData extends Shared {
    [PACKED_SECTIONS]: IFileData[];
}

interface ICustomHandler {
    result: Details,
    customEnv: any,
}
type ClassFinder = {
    (type: string): AnyCtor;
    // // for editor
    // onDereferenced: (curOwner: object, curPropName: string, newOwner: object, newPropName: string) => void;
};
interface IOptions extends Partial<ICustomHandler> {
    classFinder?: ClassFinder;
    _version?: number;
}
interface ICustomClass {
    _deserialize: (content: any, context: ICustomHandler) => void;
}

/****************************************************************************
 * IMPLEMENTS
 ****************************************************************************/

/**
 * !#en Contains meta information collected during deserialization
 * !#zh 包含反序列化后附带的元信息
 * @class Details
 */
class Details {
    /**
     * the obj list whose field needs to load asset by uuid
     */
    uuidObjList: IFileData[File.DependObjs] | null = null;
    /**
     * the corresponding field name which referenced to the asset
     */
    uuidPropList: IFileData[File.DependKeys] | null = null;
    /**
     * list of the depends assets' uuid
     */
    uuidList: IFileData[File.DependUuidIndices] | null = null;

    static pool = new js.Pool((obj: Details) => {
        obj.reset();
    }, 5);

    /**
     * @method init
     * @param {Object} data
     */
    init (data: IFileData) {
        this.uuidObjList = data[File.DependObjs];
        this.uuidPropList = data[File.DependKeys];
        this.uuidList = data[File.DependUuidIndices];
    }

    /**
     * @method reset
     */
    reset  () {
        this.uuidList = null;
        this.uuidObjList = null;
        this.uuidPropList = null;
    };

    /**
     * @method push
     * @param {Object} obj
     * @param {String} propName
     * @param {String} uuid
     */
    push (obj: object, propName: string, uuid: string) {
        (this.uuidObjList as object[]).push(obj);
        (this.uuidPropList as string[]).push(propName);
        (this.uuidList as string[]).push(uuid);
    };
}
Details.pool.get = function () {
    return this._get() || new Details();
};
if (EDITOR || TEST) {
    // @ts-ignore
    Details.prototype.assignAssetsBy = function (getter: (uuid: string) => any) {
        for (let i = 0, len = (this.uuidList as string[]).length; i < len; i++) {
            const obj = (this.uuidObjList as object)[i];
            const prop = (this.uuidPropList as any[])[i];
            const uuid = (this.uuidList as string[])[i];
            obj[prop] = getter(uuid as string);
        }
    };
}

function dereference (refs: IRefs, instances: IFileData[File.Instances], strings: IFileData[File.SharedStrings]): void {
    const dataLength = refs.length - 1;
    let i = 0;
    // owner is object
    const instanceOffset: number = refs[dataLength] * Refs.EACH_RECORD_LENGTH;
    for (; i < instanceOffset; i += Refs.EACH_RECORD_LENGTH) {
        const owner = refs[i] as any;

        const target = instances[refs[i + Refs.TARGET_OFFSET]];
        const keyIndex = refs[i + Refs.KEY_OFFSET] as StringIndexBnotNumber;
        if (keyIndex >= 0) {
            owner[strings[keyIndex]] = target;
        }
        else {
            owner[~keyIndex] = target;
        }
    }
    // owner is instance index
    for (; i < dataLength; i += Refs.EACH_RECORD_LENGTH) {
        const owner = instances[refs[i]] as any;

        const target = instances[refs[i + Refs.TARGET_OFFSET]];
        const keyIndex = refs[i + Refs.KEY_OFFSET] as StringIndexBnotNumber;
        if (keyIndex >= 0) {
            owner[strings[keyIndex]] = target;
        }
        else {
            owner[~keyIndex] = target;
        }
    }
}

//

function deserializeCCObject (data: IFileData, objectData: IClassObjectData) {
    const mask = data[File.SharedMasks][objectData[OBJ_DATA_MASK]];
    const clazz = mask[MASK_CLASS];
    const ctor = clazz[CLASS_TYPE] as Exclude<AnyCtor, ICustomClass>;
    // if (!ctor) {
    //     return null;
    // }

    const obj = new ctor();

    const keys = clazz[CLASS_KEYS];
    const classTypeOffset = clazz[CLASS_PROP_TYPE_OFFSET];
    const maskTypeOffset = mask[mask.length - 1];

    // parse simple type
    let i = MASK_CLASS + 1;
    for (; i < maskTypeOffset; ++i) {
        const key = keys[mask[i]];
        obj[key] = objectData[i];
    }

    // parse advanced type
    for (; i < objectData.length; ++i) {
        const key = keys[mask[i]];
        const type = clazz[mask[i] + classTypeOffset];
        const op = ASSIGNMENTS[type];
        op(data, obj, key, objectData[i]);
    }

    return obj;
}

function deserializeCustomCCObject (data: IFileData, ctor: Ctor<ICustomClass>, value: ICustomObjectDataContent) {
    const obj = new ctor();
    if (obj._deserialize) {
        obj._deserialize(value, data[File.Context]);
    }
    else {
        errorID(5303, js.getClassName(ctor));
    }
    return obj;
}

// Parse Functions

type ParseFunction = (data: IFileData, owner: any, key: string, value: AnyData) => void;

function assignSimple (data: IFileData, owner: any, key: string, value: DataTypes[DataTypeID.SimpleType]) {
    owner[key] = value;
}

function assignInstanceRef (data: IFileData, owner: any, key: string, value: InstanceBnotReverseIndex) {
    if (value >= 0) {
        owner[key] = data[File.Instances][value];
    }
    else {
        (data[File.Refs] as IRefs)[(~value) * Refs.EACH_RECORD_LENGTH] = owner;
    }
}

function genArrayParser (parser: ParseFunction): ParseFunction {
    return (data: IFileData, owner: any, key: string, value: any[]) => {
        owner[key] = value;
        for (let i = 0; i < value.length; ++i) {
            // @ts-ignore
            parser(data, value, i, value[i]);
        }
    };
}

function parseAssetRefByInnerObj (data: IFileData, owner: any, key: string, value: number) {
    owner[key] = null;
    data[File.DependObjs][value] = owner;
}

function parseClass (data: IFileData, owner: any, key: string, value: IClassObjectData) {
    owner[key] = deserializeCCObject(data, value);
}

function parseCustomClass (data: IFileData, owner: any, key: string, value: ICustomObjectData) {
    const ctor = data[File.SharedClasses][value[CUSTOM_OBJ_DATA_CLASS]] as CCClass<ICustomClass>;
    owner[key] = deserializeCustomCCObject(data, ctor, value[CUSTOM_OBJ_DATA_CONTENT]);
}

function parseValueTypeCreated (data: IFileData, owner: any, key: string, value: IValueTypeData) {
    BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](owner[key], value);
}

function parseValueType (data: IFileData, owner: any, key: string, value: IValueTypeData) {
    const val: ValueType = new BuiltinValueTypes[value[VALUETYPE_SETTER]]();
    BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](val, value);
    owner[key] = val;
}

function parseTRS (data: IFileData, owner: any, key: string, value: ITRSData) {
    const typedArray = owner[key] as (Float32Array | Float64Array);
    typedArray.set(value);
}

function parseDict (data: IFileData, owner: any, key: string, value: IDictData) {
    const dict = value[DICT_JSON_LAYOUT];
    owner[key] = dict;
    for (let i = DICT_JSON_LAYOUT + 1; i < value.length; i += 3) {
        const subKey = value[i] as string;
        const subType = value[i + 1] as DataTypeID;
        const subValue = value[i + 2] as AnyData;
        const op = ASSIGNMENTS[subType];
        op(data, dict, subKey, subValue);
    }
}

function parseArray (data: IFileData, owner: any, key: string, value: IArrayData) {
    const array = value[ARRAY_ITEM_VALUES];
    owner[key] = array;
    for (let i = 0; i < array.length; ++i) {
        const subValue = array[i] as AnyData;
        const type = value[i + 1] as DataTypeID;
        if (type !== DataTypeID.SimpleType) {
            const op = ASSIGNMENTS[type];
            // @ts-ignore
            op(data, array, i, subValue);
        }
    }
}

// function parseTypedArray (data: IFileData, owner: any, key: string, value: ITypedArrayData) {
//     let val: ValueType = new TypedArrays[value[TYPEDARRAY_TYPE]]();
//     BuiltinValueTypeSetters[value[VALUETYPE_SETTER]](val, value);
//     // obj = new window[serialized.ctor](array.length);
//     // for (let i = 0; i < array.length; ++i) {
//     //     obj[i] = array[i];
//     // }
//     // return obj;
//     owner[key] = val;
// }

const ASSIGNMENTS = new Array<ParseFunction>(DataTypeID.ARRAY_LENGTH);
ASSIGNMENTS[DataTypeID.SimpleType] = assignSimple;    // Only be used in the instances array
ASSIGNMENTS[DataTypeID.InstanceRef] = assignInstanceRef;
ASSIGNMENTS[DataTypeID.Array_InstanceRef] = genArrayParser(assignInstanceRef);
ASSIGNMENTS[DataTypeID.Array_AssetRefByInnerObj] = genArrayParser(parseAssetRefByInnerObj);
ASSIGNMENTS[DataTypeID.Class] = parseClass;
ASSIGNMENTS[DataTypeID.ValueTypeCreated] = parseValueTypeCreated;
ASSIGNMENTS[DataTypeID.AssetRefByInnerObj] = parseAssetRefByInnerObj;
ASSIGNMENTS[DataTypeID.TRS] = parseTRS;
ASSIGNMENTS[DataTypeID.ValueType] = parseValueType;
ASSIGNMENTS[DataTypeID.Array_Class] = genArrayParser(parseClass);
ASSIGNMENTS[DataTypeID.CustomizedClass] = parseCustomClass;
ASSIGNMENTS[DataTypeID.Dict] = parseDict;
ASSIGNMENTS[DataTypeID.Array] = parseArray;
// ASSIGNMENTS[DataTypeID.TypedArray] = parseTypedArray;



function parseInstances (data: IFileData): RootInstanceIndex {
    const instances = data[File.Instances];
    const instanceTypes = data[File.InstanceTypes];
    const instanceTypesLen = instanceTypes === EMPTY_PLACEHOLDER ? 0 : (instanceTypes as OtherObjectTypeID[]).length;
    let rootIndex = instances[instances.length - 1];
    let normalObjectCount = instances.length - instanceTypesLen;
    if (typeof rootIndex !== 'number') {
        rootIndex = 0;
    }
    else {
        if (rootIndex < 0) {
            rootIndex = ~rootIndex;
        }
        --normalObjectCount;
    }

    // DataTypeID.Class

    let insIndex = 0;
    for (; insIndex < normalObjectCount; ++insIndex) {
        instances[insIndex] = deserializeCCObject(data, instances[insIndex] as IClassObjectData);
    }

    const classes = data[File.SharedClasses];
    for (let typeIndex = 0; typeIndex < instanceTypesLen; ++typeIndex, ++insIndex) {
        let type = instanceTypes[typeIndex] as OtherObjectTypeID;
        const eachData = instances[insIndex];
        if (type >= 0) {

            // class index for DataTypeID.CustomizedClass

            const ctor = classes[type] as CCClass<ICustomClass>;  // class
            instances[insIndex] = deserializeCustomCCObject(data, ctor, eachData as ICustomObjectDataContent);
        }
        else {

            // Other

            type = (~type) as PrimitiveObjectTypeID;
            const op = ASSIGNMENTS[type];
            // @ts-ignore
            op(data, instances, insIndex, eachData);
        }
    }

    return rootIndex;
}

// const DESERIALIZE_AS = Attr.DELIMETER + 'deserializeAs';
// function deserializeAs(klass: AnyCCClass, klassLayout: IClass) {
//     var attrs = Attr.getClassAttrs(klass);
//     let keys = klassLayout[CLASS_KEYS];
//     for (let i = 0; i < keys.length; ++i) {
//         let newKey = attrs[keys[i] + DESERIALIZE_AS];
//         if (newKey) {
//             // @ts-ignore
//             if (keys.includes(newKey)) {
//                 // %s cannot be deserialized by property %s because %s was also present in the serialized data.
//                 warnID(, newKey, keys[i], newKey);
//             }
//             else {
//                 keys[i] = newKey;
//             }
//         }
//     }
// }

function getMissingClass (hasCustomFinder, type) {
    if (!hasCustomFinder) {
        // @ts-ignore
        deserialize.reportMissingClass(type);
    }
    return Object;
}
function doLookupClass (classFinder, type: string, container: any[], index: number, silent: boolean, hasCustomFinder) {
    let klass = classFinder(type);
    if (!klass) {
        // if (klass.__FSA__) {
        //     deserializeAs(klass, klassLayout as IClass);
        // }
        if (silent) {
            // generate a lazy proxy for ctor
            container[index] = ((c, i, t) => function proxy () {
                const actualClass = classFinder(t) || getMissingClass(hasCustomFinder, t);
                c[i] = actualClass;
                return new actualClass();
            })(container, index, type);
            return;
        }
        else {
            klass = getMissingClass(hasCustomFinder, type);
        }
    }
    container[index] = klass;
}

function lookupClasses (data: IPackedFileData, silent: boolean, customFinder?: ClassFinder) {
    const classFinder = customFinder || js._getClassById;
    const classes = data[File.SharedClasses];
    for (let i = 0; i < classes.length; ++i) {
        const klassLayout = classes[i];
        if (typeof klassLayout !== 'string') {
            if (DEBUG) {
                if (typeof klassLayout[CLASS_TYPE] === 'function') {
                    throw new Error('Can not deserialize the same JSON data again.');
                }
            }
            const type: string = klassLayout[CLASS_TYPE];
            doLookupClass(classFinder, type, klassLayout as IClass, CLASS_TYPE, silent, customFinder);
        }
        else {
            doLookupClass(classFinder, klassLayout, classes, i, silent, customFinder);
        }
    }
}

function cacheMasks (data: IPackedFileData) {
    const masks = data[File.SharedMasks];
    if (masks) {
        const classes = data[File.SharedClasses];
        for (let i = 0; i < masks.length; ++i) {
            const mask = masks[i];
            // @ts-ignore
            mask[MASK_CLASS] = classes[mask[MASK_CLASS]];
        }
    }
}

function parseResult (data: IFileData) {
    const instances = data[File.Instances];
    const sharedStrings = data[File.SharedStrings];
    const dependSharedUuids = data[File.SharedUuids];

    const dependObjs = data[File.DependObjs];
    const dependKeys = data[File.DependKeys];
    const dependUuids = data[File.DependUuidIndices];

    for (let i = 0; i < dependObjs.length; ++i) {
        const obj: any = dependObjs[i];
        if (typeof obj === 'number') {
            dependObjs[i] = instances[obj];
        }
        else {
            // assigned by DataTypeID.AssetRefByInnerObj or added by Details object directly in _deserialize
        }
        let key: any = dependKeys[i];
        if (typeof key === 'number') {
            if (key >= 0) {
                key = sharedStrings[key];
            }
            else {
                key = ~key;
            }
            dependKeys[i] = key;
        }
        else {
            // added by Details object directly in _deserialize
        }
        const uuid = dependUuids[i];
        if (typeof uuid === 'number') {
            dependUuids[i] = (dependSharedUuids as SharedString[])[uuid as StringIndex];
        }
        else {
            // added by Details object directly in _deserialize
        }
    }
}

function deserialize (data: IFileData, details: Details, options?: IOptions): object {
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    const borrowDetails = !details;
    details = details || Details.pool.get();
    details.init(data);
    options = options || {};

    let version = data[File.Version];
    let preprocessed = false;
    if (typeof version === 'object') {
        preprocessed = version.preprocessed;
        version = version.version;
    }
    if (version < SUPPORT_MIN_FORMAT_VERSION) {
        throw new Error(getError(5304, version));
    }
    options._version = version;
    options.result = details;
    data[File.Context] = options;

    if (!preprocessed) {
        lookupClasses(data, false, options.classFinder);
        cacheMasks(data);
    }

    legacyCC.game._isCloning = true;
    const instances = data[File.Instances];
    const rootIndex = parseInstances(data);
    legacyCC.game._isCloning = false;

    if (data[File.Refs]) {
        dereference(data[File.Refs] as IRefs, instances, data[File.SharedStrings]);
    }

    parseResult(data);

    if (borrowDetails) {
        Details.pool.put(details);
    }

    return instances[rootIndex];
}

(deserialize as any).Details = Details;
deserialize.reportMissingClass = (id) => {
    if (EDITOR && EditorExtends.UuidUtils.isUuid(id)) {
        id = EditorExtends.UuidUtils.decompressUuid(id);
        warnID(5301, id);
    }
    else {
        warnID(5302, id);
    }
};

class FileInfo {
    declare version: number;
    preprocessed = true;
    constructor (version: number) {
        this.version = version;
    }
}

export function unpackJSONs (data: IPackedFileData, classFinder?: ClassFinder): IFileData[] {
    if (data[File.Version] < SUPPORT_MIN_FORMAT_VERSION) {
        throw new Error(getError(5304, data[File.Version]));
    }
    lookupClasses(data, true, classFinder);
    cacheMasks(data);

    const version = new FileInfo(data[File.Version]);
    const sharedUuids = data[File.SharedUuids];
    const sharedStrings = data[File.SharedStrings];
    const sharedClasses = data[File.SharedClasses];
    const sharedMasks = data[File.SharedMasks];

    const sections = data[PACKED_SECTIONS];
    for (let i = 0; i < sections.length; ++i) {
        sections[i].unshift(version, sharedUuids, sharedStrings, sharedClasses, sharedMasks);
    }
    return sections;
}

export function packCustomObjData (type: string, data: IClassObjectData|OtherObjectData): IFileData {
    return [
        SUPPORT_MIN_FORMAT_VERSION, EMPTY_PLACEHOLDER, EMPTY_PLACEHOLDER,
        [type],
        EMPTY_PLACEHOLDER,
        [data],
        [0],
        EMPTY_PLACEHOLDER, [], [], []
    ];
}

export function hasNativeDep (data: IFileData): boolean {
    const instances = data[File.Instances];
    const rootInfo = instances[instances.length - 1];
    if (typeof rootInfo !== 'number') {
        return false;
    }
    else {
        return rootInfo < 0;
    }
}

if (PREVIEW) {
    deserialize.isCompiledJson = (json: object): boolean => {
        if (Array.isArray(json)) {
            const version = json[0];
            // array[0] will not be a number in the editor version
            return typeof version === 'number' || version instanceof FileInfo;
        }
        else {
            return false;
        }
    };
}

export function getDependUuidList (json: IFileData): string[] {
    const sharedUuids = json[File.SharedUuids];
    return json[File.DependUuidIndices].map(index => sharedUuids[index]);
}

if (EDITOR || TEST) {
    legacyCC._deserializeCompiled = deserialize;
    deserialize.macros = {
        EMPTY_PLACEHOLDER,
        CUSTOM_OBJ_DATA_CLASS,
        CUSTOM_OBJ_DATA_CONTENT,
        CLASS_TYPE,
        CLASS_KEYS,
        CLASS_PROP_TYPE_OFFSET,
        MASK_CLASS,
        OBJ_DATA_MASK,
        DICT_JSON_LAYOUT,
        ARRAY_ITEM_VALUES,
        PACKED_SECTIONS,
    };
    deserialize._BuiltinValueTypes = BuiltinValueTypes;
    deserialize._serializeBuiltinValueTypes = serializeBuiltinValueTypes;
}

if (TEST) {
    legacyCC._Test.deserializeCompiled = {
        deserialize,
        dereference,
        deserializeCCObject,
        deserializeCustomCCObject,
        parseInstances,
        parseResult,
        cacheMasks,
        File: {
            Version: File.Version,
            Context: File.Context,
            SharedUuids: File.SharedUuids,
            SharedStrings: File.SharedStrings,
            SharedClasses: File.SharedClasses,
            SharedMasks: File.SharedMasks,
            Instances: File.Instances,
            InstanceTypes: File.InstanceTypes,
            Refs: File.Refs,
            DependObjs: File.DependObjs,
            DependKeys: File.DependKeys,
            DependUuidIndices: File.DependUuidIndices,
            // ArrayLength: File.ArrayLength,
        },
        DataTypeID: {
            SimpleType: DataTypeID.SimpleType,
            InstanceRef: DataTypeID.InstanceRef,
            Array_InstanceRef: DataTypeID.Array_InstanceRef,
            Array_AssetRefByInnerObj: DataTypeID.Array_AssetRefByInnerObj,
            Class: DataTypeID.Class,
            ValueTypeCreated: DataTypeID.ValueTypeCreated,
            AssetRefByInnerObj: DataTypeID.AssetRefByInnerObj,
            TRS: DataTypeID.TRS,
            ValueType: DataTypeID.ValueType,
            Array_Class: DataTypeID.Array_Class,
            CustomizedClass: DataTypeID.CustomizedClass,
            Dict: DataTypeID.Dict,
            Array: DataTypeID.Array,
            // TypedArray: DataTypeID.TypedArray,
        },
        BuiltinValueTypes,
        unpackJSONs,
    };
}

export default deserialize;
