/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR, TEST, DEV, BUILD, JSB, PREVIEW, SUPPORT_JIT } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { warnID } from '../platform/debug';
import * as js from '../utils/js';
import * as misc from '../utils/misc';
import { CCClass } from './class';
import * as Attr from './utils/attribute';
import MissingScript from '../components/missing-script';
import { Details } from './deserialize';
import { Platform } from '../../../pal/system-info/enum-type';
import { sys } from '../platform/sys';

// TODO remove default support

// IMPLEMENT OF DESERIALIZATION

function _dereference (self) {
    // 这里不采用遍历反序列化结果的方式，因为反序列化的结果如果引用到复杂的外部库，很容易堆栈溢出。
    const deserializedList = self.deserializedList;
    const idPropList = self._idPropList;
    const idList = self._idList;
    const idObjList = self._idObjList;
    const onDereferenced = self._classFinder && self._classFinder.onDereferenced;
    let i;
    let propName;
    let id;
    if (EDITOR && onDereferenced) {
        for (i = 0; i < idList.length; i++) {
            propName = idPropList[i];
            id = idList[i];
            idObjList[i][propName] = deserializedList[id];
            onDereferenced(deserializedList, id, idObjList[i], propName);
        }
    } else {
        for (i = 0; i < idList.length; i++) {
            propName = idPropList[i];
            id = idList[i];
            idObjList[i][propName] = deserializedList[id];
        }
    }
}

function compileObjectTypeJit (sources, defaultValue, accessorToSet, propNameLiteralToSet, assumeHavePropIfIsValue) {
    if (defaultValue instanceof legacyCC.ValueType) {
        // fast case
        if (!assumeHavePropIfIsValue) {
            sources.push('if(prop){');
        }
        const ctorCode = js.getClassName(defaultValue);
        sources.push(`s._deserializeTypedObject(o${accessorToSet},prop,${ctorCode});`);
        if (!assumeHavePropIfIsValue) {
            sources.push(`}else o${accessorToSet}=null;`);
        }
    } else {
        sources.push('if(prop){');
        sources.push(`s._deserializeObjField(o,prop,${propNameLiteralToSet});`);
        sources.push(`}else o${accessorToSet}=null;`);
    }
}

const compileDeserialize = SUPPORT_JIT ? (self, klass) => {
    const TYPE = `${Attr.DELIMETER}type`;
    const EDITOR_ONLY = `${Attr.DELIMETER}editorOnly`;
    const DEFAULT = `${Attr.DELIMETER}default`;
    const FORMERLY_SERIALIZED_AS = `${Attr.DELIMETER}formerlySerializedAs`;
    const attrs = Attr.getClassAttrs(klass);

    const props = klass.__values__;
    // self, obj, serializedData, klass
    const sources = [
        'var prop;',
    ];
    const fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass));
    // sources.push('var vb,vn,vs,vo,vu,vf;');    // boolean, number, string, object, undefined, function

    for (let p = 0; p < props.length; p++) {
        const propName = props[p];
        if ((PREVIEW || (EDITOR && self._ignoreEditorOnly)) && attrs[propName + EDITOR_ONLY]) {
            continue;   // skip editor only if in preview
        }

        let accessorToSet;
        let propNameLiteralToSet;
        if (CCClass.IDENTIFIER_RE.test(propName)) {
            propNameLiteralToSet = `"${propName}"`;
            accessorToSet = `.${propName}`;
        } else {
            propNameLiteralToSet = CCClass.escapeForJS(propName);
            accessorToSet = `[${propNameLiteralToSet}]`;
        }

        let accessorToGet = accessorToSet;
        if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
            const propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];
            if (CCClass.IDENTIFIER_RE.test(propNameToRead)) {
                accessorToGet = `.${propNameToRead}`;
            } else {
                accessorToGet = `[${CCClass.escapeForJS(propNameToRead)}]`;
            }
        }

        sources.push(`prop=d${accessorToGet};`);
        sources.push(`if(typeof ${JSB ? '(prop)' : 'prop'}!=="undefined"){`);

        // function undefined object(null) string boolean number
        const defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);
        if (fastMode) {
            let isPrimitiveType;
            const userType = attrs[propName + TYPE];
            if (defaultValue === undefined && userType) {
                isPrimitiveType = userType instanceof Attr.PrimitiveType;
            } else {
                const defaultType = typeof defaultValue;
                isPrimitiveType = defaultType === 'string'
                                  || defaultType === 'number'
                                  || defaultType === 'boolean';
            }

            if (isPrimitiveType) {
                sources.push(`o${accessorToSet}=prop;`);
            } else {
                compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, true);
            }
        } else {
            sources.push(`${`if(typeof ${JSB ? '(prop)' : 'prop'}!=="object"){`
                             + 'o'}${accessorToSet}=prop;`
                         + `}else{`);
            compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, false);
            sources.push('}');
        }
        sources.push('}');
    }
    if (legacyCC.js.isChildClassOf(klass, legacyCC._BaseNode) || legacyCC.js.isChildClassOf(klass, legacyCC.Component)) {
        if (PREVIEW || (EDITOR && self._ignoreEditorOnly)) {
            const mayUsedInPersistRoot = js.isChildClassOf(klass, legacyCC.Node);
            if (mayUsedInPersistRoot) {
                sources.push('d._id&&(o._id=d._id);');
            }
        } else {
            sources.push('d._id&&(o._id=d._id);');
        }
    }
    if (props[props.length - 1] === '_$erialized') {
        // deep copy original serialized data
        sources.push('o._$erialized=JSON.parse(JSON.stringify(d));');
        // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced
        sources.push('s._deserializePrimitiveObject(o._$erialized,d);');
    }
    return Function('s', 'o', 'd', 'k', sources.join(''));
} : (self, klass) => {
    const fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass));
    const shouldCopyId = legacyCC.js.isChildClassOf(klass, legacyCC._BaseNode) || legacyCC.js.isChildClassOf(klass, legacyCC.Component);
    let shouldCopyRawData;

    const simpleProps: any = [];
    let simplePropsToRead = simpleProps;
    const advancedProps: any = [];
    let advancedPropsToRead = advancedProps;
    const advancedPropsValueType: any = [];

    (() => {
        const props = klass.__values__;
        shouldCopyRawData = props[props.length - 1] === '_$erialized';

        const attrs = Attr.getClassAttrs(klass);
        const TYPE = `${Attr.DELIMETER}type`;
        const DEFAULT = `${Attr.DELIMETER}default`;
        const FORMERLY_SERIALIZED_AS = `${Attr.DELIMETER}formerlySerializedAs`;

        for (let p = 0; p < props.length; p++) {
            const propName = props[p];
            let propNameToRead = propName;
            if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
                propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];
            }
            // function undefined object(null) string boolean number
            const defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);
            let isPrimitiveType = false;
            if (fastMode) {
                const userType = attrs[propName + TYPE];
                if (defaultValue === undefined && userType) {
                    isPrimitiveType = userType instanceof Attr.PrimitiveType;
                } else {
                    const defaultType = typeof defaultValue;
                    isPrimitiveType = defaultType === 'string'
                                      || defaultType === 'number'
                                      || defaultType === 'boolean';
                }
            }
            if (fastMode && isPrimitiveType) {
                if (propNameToRead !== propName && simplePropsToRead === simpleProps) {
                    simplePropsToRead = simpleProps.slice();
                }
                simpleProps.push(propName);
                if (simplePropsToRead !== simpleProps) {
                    simplePropsToRead.push(propNameToRead);
                }
            } else {
                if (propNameToRead !== propName && advancedPropsToRead === advancedProps) {
                    advancedPropsToRead = advancedProps.slice();
                }
                advancedProps.push(propName);
                if (advancedPropsToRead !== advancedProps) {
                    advancedPropsToRead.push(propNameToRead);
                }
                advancedPropsValueType.push((defaultValue instanceof legacyCC.ValueType) && defaultValue.constructor);
            }
        }
    })();

    return (s, o, d, k) => {
        for (let i = 0; i < simpleProps.length; ++i) {
            const prop = d[simplePropsToRead[i]];
            if (prop !== undefined) {
                o[simpleProps[i]] = prop;
            }
        }
        for (let i = 0; i < advancedProps.length; ++i) {
            const propName = advancedProps[i];
            const prop = d[advancedPropsToRead[i]];
            if (prop === undefined) {
                continue;
            }
            if (!fastMode && typeof prop !== 'object') {
                o[propName] = prop;
            } else {
                // fastMode (so will not simpleProp) or object
                const valueTypeCtor = advancedPropsValueType[i];
                if (valueTypeCtor) {
                    if (fastMode || prop) {
                        s._deserializeTypedObject(o[propName], prop, valueTypeCtor);
                    } else {
                        o[propName] = null;
                    }
                } else if (prop) {
                    s._deserializeObjField(o, prop, propName);
                } else {
                    o[propName] = null;
                }
            }
        }
        if (shouldCopyId && d._id) {
            o._id = d._id;
        }
        if (shouldCopyRawData) {
            // deep copy original serialized data
            o._$erialized = JSON.parse(JSON.stringify(d));
            // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced
            s._deserializePrimitiveObject(o._$erialized, d);
        }
    };
};

function unlinkUnusedPrefab (self, serialized, obj) {
    const uuid = serialized.asset && serialized.asset.__uuid__;
    if (uuid) {
        const last = self.result.uuidList.length - 1;
        if (self.result.uuidList[last] === uuid
            && self.result.uuidObjList[last] === obj
            && self.result.uuidPropList[last] === 'asset') {
            self.result.uuidList.pop();
            self.result.uuidObjList.pop();
            self.result.uuidPropList.pop();
            self.result.uuidTypeList.pop();
        } else {
            warnID(4935);
        }
    }
}

function _deserializeFireClass (self, obj, serialized, klass) {
    let deserialize;
    if (klass.hasOwnProperty('__deserialize__')) {
        deserialize = klass.__deserialize__;
    } else {
        deserialize = compileDeserialize(self, klass);
        // if (TEST && !isPhantomJS) {
        //     log(deserialize);
        // }
        js.value(klass, '__deserialize__', deserialize, true);
    }
    deserialize(self, obj, serialized, klass);
}

// function _compileTypedObject (accessor, klass, ctorCode) {
//     if (klass === cc.Vec2) {
//         return `{` +
//                     `o${accessor}.x=prop.x||0;` +
//                     `o${accessor}.y=prop.y||0;` +
//                `}`;
//     }
//     else if (klass === cc.Color) {
//         return `{` +
//                    `o${accessor}.r=prop.r||0;` +
//                    `o${accessor}.g=prop.g||0;` +
//                    `o${accessor}.b=prop.b||0;` +
//                    `o${accessor}.a=(prop.a===undefined?255:prop.a);` +
//                `}`;
//     }
//     else if (klass === cc.Size) {
//         return `{` +
//                    `o${accessor}.width=prop.width||0;` +
//                    `o${accessor}.height=prop.height||0;` +
//                `}`;
//     }
//     else {
//         return `s._deserializeTypedObject(o${accessor},prop,${ctorCode});`;
//     }
// }

class _Deserializer {
    public static pool: js.Pool<{}>;
    public result: any;
    public customEnv: any;
    public deserializedList: any[];
    public deserializedData: any;
    private _classFinder: any;
    private _ignoreEditorOnly: any;
    private _idList: any[];
    private _idObjList: any[];
    private _idPropList: any[];

    constructor (result, classFinder, customEnv, ignoreEditorOnly) {
        this.result = result;
        this.customEnv = customEnv;
        this.deserializedList = [];
        this.deserializedData = null;
        this._classFinder = classFinder;
        if (DEV) {
            this._ignoreEditorOnly = ignoreEditorOnly;
        }
        this._idList = [];
        this._idObjList = [];
        this._idPropList = [];
    }

    public deserialize (jsonObj) {
        if (Array.isArray(jsonObj)) {
            const jsonArray = jsonObj;
            const refCount = jsonArray.length;
            this.deserializedList.length = refCount;
            // deserialize
            for (let i = 0; i < refCount; i++) {
                if (jsonArray[i]) {
                    if (EDITOR || TEST) {
                        this.deserializedList[i] = this._deserializeObject(jsonArray[i], this.deserializedList, `${i}`);
                    } else {
                        this.deserializedList[i] = this._deserializeObject(jsonArray[i]);
                    }
                }
            }
            this.deserializedData = refCount > 0 ? this.deserializedList[0] : [];

            // dereference
            _dereference(this);

            if (JSB) {
                // invoke hooks
                for (let i = 0; i < refCount; i++) {
                    this.deserializedList[i]?.onAfterDeserialize_JSB?.();
                }
            }
        } else {
            let deserializedData;
            this.deserializedList.length = 1;
            if (EDITOR || TEST) {
                deserializedData = jsonObj ? this._deserializeObject(jsonObj, this.deserializedList, '0') : null;
            } else {
                deserializedData = jsonObj ? this._deserializeObject(jsonObj) : null;
            }

            // dereference
            _dereference(this);

            if (JSB) {
                // invoke hooks
                if (deserializedData.onAfterDeserialize_JSB) {
                    deserializedData.onAfterDeserialize_JSB();
                }
            }

            this.deserializedList[0] = deserializedData;
            this.deserializedData = deserializedData;
        }
        return this.deserializedData;
    }

    /**
     * @param {Object} serialized - The obj to deserialize, must be non-nil
     * @param {Object} [owner] - debug only
     * @param {String} [propName] - debug only
     */
    private _deserializeObject (serialized, owner?: Object, propName?: string) {
        let prop;
        let obj: any = null;     // the obj to return
        let klass: any = null;
        const type = serialized.__type__;
        if (type === 'TypedArray') {
            const array = serialized.array;
            // @ts-expect-error
            obj = new window[serialized.ctor](array.length);
            for (let i = 0; i < array.length; ++i) {
                obj[i] = array[i];
            }
            return obj;
        } else if (type) {
            // Type Object (including CCClass)

            klass = this._classFinder(type, serialized, owner, propName);
            if (!klass) {
                const notReported = this._classFinder === js._getClassById;
                if (notReported) {
                    legacyCC.deserialize.reportMissingClass(type);
                }
                return null;
            }
            const self = this;
            function deserializeByType () {
                // instantiate a new object
                obj = new klass();

                if (obj._deserialize) {
                    obj._deserialize(serialized.content, self);
                    return;
                }
                if (legacyCC.Class._isCCClass(klass)) {
                    _deserializeFireClass(self, obj, serialized, klass);
                } else {
                    self._deserializeTypedObject(obj, serialized, klass);
                }
            }

            function checkDeserializeByType () {
                try {
                    deserializeByType();
                } catch (e) {
                    console.error(`deserialize ${klass.name} failed, ${e.stack}`);
                    klass = MissingScript;
                    legacyCC.deserialize.reportMissingClass(type);
                    deserializeByType();
                }
            }

            if (EDITOR && legacyCC.js.isChildClassOf(klass, legacyCC.Component)) {
                checkDeserializeByType();
            } else {
                deserializeByType();
            }
        } else if (!Array.isArray(serialized)) {
            // embedded primitive javascript object

            obj = {};
            this._deserializePrimitiveObject(obj, serialized);
        } else {
            // Array

            obj = new Array(serialized.length);

            for (let i = 0; i < serialized.length; i++) {
                prop = serialized[i];
                if (typeof prop === 'object' && prop) {
                    const isAssetType = this._deserializeObjField(obj, prop, `${i}`);
                    if (isAssetType) {
                        // fill default value for primitive objects (no constructor)
                        obj[i] = null;
                    }
                } else {
                    obj[i] = prop;
                }
            }
        }
        return obj;
    }

    // 和 _deserializeObject 不同的地方在于会判断 id 和 uuid
    private _deserializeObjField (obj, jsonObj, propName): boolean {
        const id = jsonObj.__id__;
        if (id === undefined) {
            const uuid = jsonObj.__uuid__;
            if (uuid) {
                this.result.push(obj, propName, uuid, jsonObj.__expectedType__);
                return true;
            } else if (EDITOR || TEST) {
                obj[propName] = this._deserializeObject(jsonObj, obj, propName);
            } else {
                obj[propName] = this._deserializeObject(jsonObj);
            }
        } else {
            const dObj = this.deserializedList[id];
            if (dObj) {
                obj[propName] = dObj;
            } else {
                this._idList.push(id);
                this._idObjList.push(obj);
                this._idPropList.push(propName);
            }
        }
        return false;
    }

    private _deserializePrimitiveObject (instance, serialized) {
        for (const propName in serialized) {
            if (serialized.hasOwnProperty(propName)) {
                const prop = serialized[propName];
                if (typeof prop !== 'object') {
                    if (propName !== '__type__'/* && k != '__id__' */) {
                        instance[propName] = prop;
                    }
                } else if (prop) {
                    const isAssetType = this._deserializeObjField(instance, prop, propName);
                    if (isAssetType) {
                        // fill default value for primitive objects (no constructor)
                        instance[propName] = null;
                    }
                } else {
                    instance[propName] = null;
                }
            }
        }
    }

    private _deserializeTypedObject (instance, serialized, klass) {
        if (klass === legacyCC.Vec2) {
            instance.x = serialized.x || 0;
            instance.y = serialized.y || 0;
            return;
        } else if (klass === legacyCC.Vec3) {
            instance.x = serialized.x || 0;
            instance.y = serialized.y || 0;
            instance.z = serialized.z || 0;
            return;
        } else if (klass === legacyCC.Color) {
            instance.r = serialized.r || 0;
            instance.g = serialized.g || 0;
            instance.b = serialized.b || 0;
            const a = serialized.a;
            instance.a = (a === undefined ? 255 : a);
            return;
        } else if (klass === legacyCC.Size) {
            instance.width = serialized.width || 0;
            instance.height = serialized.height || 0;
            return;
        }

        const DEFAULT = `${Attr.DELIMETER}default`;
        const attrs = Attr.getClassAttrs(klass);
        const fastDefinedProps = klass.__props__ || Object.keys(instance);    // 遍历 instance，如果具有类型，才不会把 __type__ 也读进来

        for (let i = 0; i < fastDefinedProps.length; i++) {
            const propName = fastDefinedProps[i];
            let value = serialized[propName];
            if (value === undefined || !serialized.hasOwnProperty(propName)) {
                // not serialized,
                // recover to default value in ValueType, because eliminated properties equals to
                // its default value in ValueType, not default value in user class
                value = CCClass.getDefault(attrs[propName + DEFAULT]);
            }

            if (typeof value !== 'object') {
                instance[propName] = value;
            } else if (value) {
                this._deserializeObjField(instance, value, propName);
            } else {
                instance[propName] = null;
            }
        }
    }
}

_Deserializer.pool = new js.Pool((obj: any) => {
    obj.result = null;
    obj.customEnv = null;
    obj.deserializedList.length = 0;
    obj.deserializedData = null;
    obj._classFinder = null;
    obj._idList.length = 0;
    obj._idObjList.length = 0;
    obj._idPropList.length = 0;
}, 1);
// @ts-expect-error
_Deserializer.pool.get = function (result, classFinder, customEnv, ignoreEditorOnly) {
    const cache: any = this._get();
    if (cache) {
        cache.result = result;
        cache.customEnv = customEnv;
        cache._classFinder = classFinder;
        if (DEV) {
            cache._ignoreEditorOnly = ignoreEditorOnly;
        }
        return cache;
    } else {
        return new _Deserializer(result, classFinder, customEnv, ignoreEditorOnly);
    }
};

export function deserializeDynamic (data, details: Details, options) {
    options = options || {};
    const classFinder = options.classFinder || js._getClassById;
    const createAssetRefs = options.createAssetRefs || sys.platform === Platform.EDITOR_CORE;
    const customEnv = options.customEnv;
    const ignoreEditorOnly = options.ignoreEditorOnly;

    // var oldJson = JSON.stringify(data, null, 2);

    details.init();

    // @ts-expect-error
    const deserializer: _Deserializer = _Deserializer.pool.get(details, classFinder, customEnv, ignoreEditorOnly);

    legacyCC.game._isCloning = true;
    const res = deserializer.deserialize(data);
    legacyCC.game._isCloning = false;

    _Deserializer.pool.put(deserializer);
    if (createAssetRefs) {
        details.assignAssetsBy(EditorExtends.serialize.asAsset);
    }

    // var afterJson = JSON.stringify(data, null, 2);
    // if (oldJson !== afterJson) {
    //     throw new Error('JSON SHOULD not changed');
    // }

    return res;
}

export function parseUuidDependenciesDynamic (serialized: unknown) {
    const depends = [];
    const parseDependRecursively = (data: any, out: string[]) => {
        if (!data || typeof data !== 'object' || data.__id__) { return; }
        const uuid = data.__uuid__;
        if (Array.isArray(data)) {
            for (let i = 0, l = data.length; i < l; i++) {
                parseDependRecursively(data[i], out);
            }
        } else if (uuid) {
            out.push(uuid);
        } else {
            for (const prop in data) {
                parseDependRecursively(data[prop], out);
            }
        }
    };
    parseDependRecursively(serialized, depends);
    return depends;
}
