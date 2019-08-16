/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * @category core/data
 */

import * as js from '../utils/js';
import * as misc from '../utils/misc';
import CCClass from './class';
import * as Attr from './utils/attribute';

// HELPERS

// tslint:disable: no-shadowed-variable

/**
 * @en Contains information collected during deserialization
 * @zh 包含反序列化时的一些信息。
 * @class Details
 *
 */
class Details {

    public static pool: js.Pool<{}>;

    public assignAssetsBy!: Function;
    public uuidList: string[];
    public uuidObjList: object[];
    public uuidPropList: string[];
    private _stillUseUrl: any;

    constructor () {
        /**
         * list of the depends assets' uuid
         * @property {String[]} uuidList
         */
        this.uuidList = [];
        /**
         * the obj list whose field needs to load asset by uuid
         * @property {Object[]} uuidObjList
         */
        this.uuidObjList = [];
        /**
         * the corresponding field name which referenced to the asset
         * @property {String[]} uuidPropList
         */
        this.uuidPropList = [];

        // TODO - DELME since 2.0
        this._stillUseUrl = js.createMap(true);

        if (CC_EDITOR || CC_TEST) {
            this.assignAssetsBy = (getter) => {
                // ignore this._stillUseUrl
                for (let i = 0, len = this.uuidList.length; i < len; i++) {
                    const uuid = this.uuidList[i];
                    const obj = this.uuidObjList[i];
                    const prop = this.uuidPropList[i];
                    obj[prop] = getter(uuid);
                }
            };
        }
    }

    /**
     * @zh
     * 重置。
     * @method reset
     */
    public reset () {
        this.uuidList.length = 0;
        this.uuidObjList.length = 0;
        this.uuidPropList.length = 0;
        js.clear(this._stillUseUrl);
    }

    // /**
    //  * @method getUuidOf
    //  * @param {Object} obj
    //  * @param {String} propName
    //  * @return {String}
    //  */
    // getUuidOf (obj, propName) {
    //     for (var i = 0; i < this.uuidObjList.length; i++) {
    //         if (this.uuidObjList[i] === obj && this.uuidPropList[i] === propName) {
    //             return this.uuidList[i];
    //         }
    //     }
    //     return "";
    // }
    /**
     * @method push
     * @param {Object} obj
     * @param {String} propName
     * @param {String} uuid
     */
    public push (obj: Object, propName: string, uuid: string, _stillUseUrl: any) {
        if (_stillUseUrl) {
            this._stillUseUrl[this.uuidList.length] = true;
        }
        this.uuidList.push(uuid);
        this.uuidObjList.push(obj);
        this.uuidPropList.push(propName);
    }
}

Details.pool = new js.Pool((obj: any) => {
    obj.reset();
}, 10);

Details.pool.get = function () {
    return this._get() || new Details();
};

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
    if (CC_EDITOR && onDereferenced) {
        for (i = 0; i < idList.length; i++) {
            propName = idPropList[i];
            id = idList[i];
            idObjList[i][propName] = deserializedList[id];
            onDereferenced(deserializedList, id, idObjList[i], propName);
        }
    }
    else {
        for (i = 0; i < idList.length; i++) {
            propName = idPropList[i];
            id = idList[i];
            idObjList[i][propName] = deserializedList[id];
        }
    }
}

function compileObjectTypeJit (sources, defaultValue, accessorToSet, propNameLiteralToSet, assumeHavePropIfIsValue, stillUseUrl) {
    if (defaultValue instanceof cc.ValueType) {
        // fast case
        if (!assumeHavePropIfIsValue) {
            sources.push('if(prop){');
        }
        const ctorCode = js.getClassName(defaultValue);
        sources.push(`s._deserializeTypedObject(o${accessorToSet},prop,${ctorCode});`);
        if (!assumeHavePropIfIsValue) {
            sources.push('}else o' + accessorToSet + '=null;');
        }
    }
    else {
        sources.push('if(prop){');
        sources.push('s._deserializeObjField(o,prop,' +
                             propNameLiteralToSet +
                             ((CC_EDITOR || CC_TEST) ? ',t&&o,' : ',null,') +
                             !!stillUseUrl +
                         ');');
        sources.push('}else o' + accessorToSet + '=null;');
    }
}

const compileDeserialize = CC_SUPPORT_JIT ? (self, klass) => {
    const TYPE = Attr.DELIMETER + 'type';
    const EDITOR_ONLY = Attr.DELIMETER + 'editorOnly';
    const DEFAULT = Attr.DELIMETER + 'default';
    const SAVE_URL_AS_ASSET = Attr.DELIMETER + 'saveUrlAsAsset';
    const FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs';
    const attrs = Attr.getClassAttrs(klass);

    const props = klass.__values__;
    // self, obj, serializedData, klass, target
    const sources = [
        'var prop;',
    ];
    const fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass));
    // sources.push('var vb,vn,vs,vo,vu,vf;');    // boolean, number, string, object, undefined, function
    // tslint:disable-next-line: prefer-for-of
    for (let p = 0; p < props.length; p++) {
        const propName = props[p];
        if ((CC_PREVIEW || (CC_EDITOR && self._ignoreEditorOnly)) && attrs[propName + EDITOR_ONLY]) {
            continue;   // skip editor only if in preview
        }

        let accessorToSet;
        let propNameLiteralToSet;
        if (CCClass.IDENTIFIER_RE.test(propName)) {
            propNameLiteralToSet = '"' + propName + '"';
            accessorToSet = '.' + propName;
        }
        else {
            propNameLiteralToSet = CCClass.escapeForJS(propName);
            accessorToSet = '[' + propNameLiteralToSet + ']';
        }

        let accessorToGet = accessorToSet;
        if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
            const propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];
            if (CCClass.IDENTIFIER_RE.test(propNameToRead)) {
                accessorToGet = '.' + propNameToRead;
            }
            else {
                accessorToGet = '[' + CCClass.escapeForJS(propNameToRead) + ']';
            }
        }

        sources.push('prop=d' + accessorToGet + ';');
        sources.push(`if(typeof ${CC_JSB ? '(prop)' : 'prop'}!=="undefined"){`);

        const stillUseUrl = attrs[propName + SAVE_URL_AS_ASSET];
        // function undefined object(null) string boolean number
        const defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);
        if (fastMode) {
            let isPrimitiveType;
            const userType = attrs[propName + TYPE];
            if (defaultValue === undefined && userType) {
                isPrimitiveType = userType === cc.String ||
                                  userType === cc.Integer ||
                                  userType === cc.Float ||
                                  userType === cc.Boolean;
            }
            else {
                const defaultType = typeof defaultValue;
                isPrimitiveType = (defaultType === 'string' && !stillUseUrl) ||
                                  defaultType === 'number' ||
                                  defaultType === 'boolean';
            }

            if (isPrimitiveType) {
                sources.push(`o${accessorToSet}=prop;`);
            }
            else {
                compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, true, stillUseUrl);
            }
        }
        else {
            sources.push(`if(typeof ${CC_JSB ? '(prop)' : 'prop'}!=="object"){` +
                             'o' + accessorToSet + '=prop;' +
                         '}else{');
            compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, false, stillUseUrl);
            sources.push('}');
        }
        sources.push('}');
    }
    if (cc.js.isChildClassOf(klass, cc._BaseNode) || cc.js.isChildClassOf(klass, cc.Component)) {
        if (CC_PREVIEW || (CC_EDITOR && self._ignoreEditorOnly)) {
            const mayUsedInPersistRoot = js.isChildClassOf(klass, cc.Node);
            if (mayUsedInPersistRoot) {
                sources.push('d._id&&(o._id=d._id);');
            }
        }
        else {
            sources.push('d._id&&(o._id=d._id);');
        }
    }
    if (props[props.length - 1] === '_$erialized') {
        // deep copy original serialized data
        sources.push('o._$erialized=JSON.parse(JSON.stringify(d));');
        // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced
        sources.push('s._deserializePrimitiveObject(o._$erialized,d);');
    }
    return Function('s', 'o', 'd', 'k', 't', sources.join(''));
} : (self, klass) => {
    const fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass));
    const shouldCopyId = cc.js.isChildClassOf(klass, cc._BaseNode) || cc.js.isChildClassOf(klass, cc.Component);
    let shouldCopyRawData;

    const simpleProps: any = [];
    let simplePropsToRead = simpleProps;
    const advancedProps: any = [];
    let advancedPropsToRead = advancedProps;
    const advancedPropsUseUrl: any = [];
    const advancedPropsValueType: any = [];

    (() => {
        const props = klass.__values__;
        shouldCopyRawData = props[props.length - 1] === '_$erialized';

        const attrs = Attr.getClassAttrs(klass);
        const TYPE = Attr.DELIMETER + 'type';
        const DEFAULT = Attr.DELIMETER + 'default';
        const SAVE_URL_AS_ASSET = Attr.DELIMETER + 'saveUrlAsAsset';
        const FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs';

        // tslint:disable-next-line: prefer-for-of
        for (let p = 0; p < props.length; p++) {
            const propName = props[p];
            let propNameToRead = propName;
            if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
                propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];
            }
            const stillUseUrl = attrs[propName + SAVE_URL_AS_ASSET];
            // function undefined object(null) string boolean number
            const defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);
            let isPrimitiveType = false;
            if (fastMode) {
                const userType = attrs[propName + TYPE];
                if (defaultValue === undefined && userType) {
                    isPrimitiveType = userType === cc.String ||
                                      userType === cc.Integer ||
                                      userType === cc.Float ||
                                      userType === cc.Boolean;
                }
                else {
                    const defaultType = typeof defaultValue;
                    isPrimitiveType = (defaultType === 'string' && !stillUseUrl) ||
                                      defaultType === 'number' ||
                                      defaultType === 'boolean';
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
            }
            else {
                if (propNameToRead !== propName && advancedPropsToRead === advancedProps) {
                    advancedPropsToRead = advancedProps.slice();
                }
                advancedProps.push(propName);
                if (advancedPropsToRead !== advancedProps) {
                    advancedPropsToRead.push(propNameToRead);
                }
                advancedPropsUseUrl.push(stillUseUrl);
                advancedPropsValueType.push((defaultValue instanceof cc.ValueType) && defaultValue.constructor);
            }
        }
    })();

    return (s, o, d, k, t) => {
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
            }
            else {
                // fastMode (so will not simpleProp) or object
                const valueTypeCtor = advancedPropsValueType[i];
                if (valueTypeCtor) {
                    if (fastMode || prop) {
                        s._deserializeTypedObject(o[propName], prop, valueTypeCtor);
                    }
                    else {
                        o[propName] = null;
                    }
                }
                else {
                    if (prop) {
                        s._deserializeObjField(
                            o,
                            prop,
                            propName,
                            (CC_EDITOR || CC_TEST) ? (t && o) : null,
                            advancedPropsUseUrl[i],
                        );
                    }
                    else {
                        o[propName] = null;
                    }
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
        if (self.result.uuidList[last] === uuid &&
            self.result.uuidObjList[last] === obj &&
            self.result.uuidPropList[last] === 'asset') {
            self.result.uuidList.pop();
            self.result.uuidObjList.pop();
            self.result.uuidPropList.pop();
        }
        else {
            const debugEnvOnlyInfo = 'Failed to skip prefab asset while deserializing PrefabInfo';
            cc.warn(debugEnvOnlyInfo);
        }
    }
}

function _deserializeFireClass (self, obj, serialized, klass, target) {
    let deserialize;
    if (klass.hasOwnProperty('__deserialize__')) {
        deserialize = klass.__deserialize__;
    }
    else {
        deserialize = compileDeserialize(self, klass);
        // if (CC_TEST && !isPhantomJS) {
        //     cc.log(deserialize);
        // }
        js.value(klass, '__deserialize__', deserialize, true);
    }
    deserialize(self, obj, serialized, klass, target);
    // if preview or build worker
    if (CC_PREVIEW || (CC_EDITOR && self._ignoreEditorOnly)) {
        if (klass === cc._PrefabInfo && !obj.sync) {
            unlinkUnusedPrefab(self, serialized, obj);
        }
    }
    if (obj.__postDeserialize) {
        obj.__postDeserialize();
    }
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

// tslint:disable-next-line: class-name
class _Deserializer {

    public static pool: js.Pool<{}>;
    public result: any;
    public customEnv: any;
    public deserializedList: any[];
    public deserializedData: null;
    private _classFinder: any;
    private _target: any;
    private _ignoreEditorOnly: any;
    private _idList: any[];
    private _idObjList: any[];
    private _idPropList: any[];

    constructor (result, target, classFinder, customEnv, ignoreEditorOnly) {
        this.result = result;
        this.customEnv = customEnv;
        this.deserializedList = [];
        this.deserializedData = null;
        this._classFinder = classFinder;
        if (CC_DEV) {
            this._target = target;
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
                    if (CC_EDITOR || CC_TEST) {
                        const mainTarget = (i === 0 && this._target);
                        this.deserializedList[i] = this._deserializeObject(jsonArray[i], false, mainTarget, this.deserializedList, '' + i);
                    }
                    else {
                        this.deserializedList[i] = this._deserializeObject(jsonArray[i], false);
                    }
                }
            }
            this.deserializedData = refCount > 0 ? this.deserializedList[0] : [];

            //// callback
            // for (var j = 0; j < refCount; j++) {
            //    if (referencedList[j].onAfterDeserialize) {
            //        referencedList[j].onAfterDeserialize();
            //    }
            // }
        }
        else {
            this.deserializedList.length = 1;
            if (CC_EDITOR || CC_TEST) {
                this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, false, this._target, this.deserializedList, '0') : null;
            }
            else {
                this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, false) : null;
            }
            this.deserializedList[0] = this.deserializedData;

            //// callback
            // if (deserializedData.onAfterDeserialize) {
            //    deserializedData.onAfterDeserialize();
            // }
        }

        // dereference
        _dereference(this);

        return this.deserializedData;
    }

    /**
     * @param {Object} serialized - The obj to deserialize, must be non-nil
     * @param {Boolean} _stillUseUrl
     * @param {Object} [target=null] - editor only
     * @param {Object} [owner] - debug only
     * @param {String} [propName] - debug only
     */
    private _deserializeObject (serialized, _stillUseUrl: Boolean, target?, owner?: Object, propName?: String) {
        let prop;
        let obj: any = null;     // the obj to return
        let klass: any = null;
        const type = serialized.__type__;
        if (type === 'TypedArray') {
            const array = serialized.array;
            // @ts-ignore
            obj = new window[serialized.ctor](array.length);
            for (let i = 0; i < array.length; ++i) {
                obj[i] = array[i];
            }
            return obj;
        }
        else if (type) {

            // Type Object (including CCClass)

            klass = this._classFinder(type, serialized, owner, propName);
            if (!klass) {
                const notReported = this._classFinder === js._getClassById;
                if (notReported) {
                    cc.deserialize.reportMissingClass(type);
                }
                return null;
            }
            const self = this;
            // @ts-ignore
            function deserializeByType () {
                if ((CC_EDITOR || CC_TEST) && target) {
                    // use target
                    if ( !(target instanceof klass) ) {
                        cc.warnID(5300, js.getClassName(target), klass);
                    }
                    obj = target;
                }
                else {
                    // instantiate a new object
                    obj = new klass();
                }

                if (obj._deserialize) {
                    obj._deserialize(serialized.content, self);
                    return;
                }
                if (cc.Class._isCCClass(klass)) {
                    _deserializeFireClass(self, obj, serialized, klass, target);
                }
                else {
                    self._deserializeTypedObject(obj, serialized, klass);
                }
            }

            // @ts-ignore
            function checkDeserializeByType () {
                try {
                    deserializeByType();
                }
                catch (e) {
                    console.error('deserialize ' + klass.name + ' failed, ' + e.stack);
                    obj = null;
                }
            }

            if (CC_EDITOR && cc.js.isChildClassOf(klass, cc.Component)) {
                checkDeserializeByType();
            }
            else {
                deserializeByType();
            }
        }
        else if ( !Array.isArray(serialized) ) {

            // embedded primitive javascript object

            obj = ((CC_EDITOR || CC_TEST) && target) || {};
            this._deserializePrimitiveObject(obj, serialized);
        }
        else {

            // Array

            if ((CC_EDITOR || CC_TEST) && target) {
                target.length = serialized.length;
                obj = target;
            }
            else {
                obj = new Array(serialized.length);
            }

            for (let i = 0; i < serialized.length; i++) {
                prop = serialized[i];
                if (typeof prop === 'object' && prop) {
                    if (CC_EDITOR || CC_TEST) {
                        this._deserializeObjField(obj, prop, '' + i, target && obj, _stillUseUrl);
                    }
                    else {
                        this._deserializeObjField(obj, prop, '' + i, null, _stillUseUrl);
                    }
                }
                else {
                    obj[i] = prop;
                }
            }
        }
        return obj;
    }

    // 和 _deserializeObject 不同的地方在于会判断 id 和 uuid
    private _deserializeObjField (obj, jsonObj, propName, target?, _stillUseUrl?) {
        const id = jsonObj.__id__;
        if (id === undefined) {
            const uuid = jsonObj.__uuid__;
            if (uuid) {
                // if (ENABLE_TARGET) {
                    // 这里不做任何操作，因为有可能调用者需要知道依赖哪些 asset。
                    // 调用者使用 uuidList 时，可以判断 obj[propName] 是否为空，为空则表示待进一步加载，
                    // 不为空则只是表明依赖关系。
                //    if (target && target[propName] && target[propName]._uuid === uuid) {
                //        console.assert(obj[propName] === target[propName]);
                //        return;
                //    }
                // }
                this.result.push(obj, propName, uuid, _stillUseUrl);
            }
            else {
                if (CC_EDITOR || CC_TEST) {
                    obj[propName] = this._deserializeObject(jsonObj, _stillUseUrl, target && target[propName], obj, propName);
                }
                else {
                    obj[propName] = this._deserializeObject(jsonObj, _stillUseUrl);
                }
            }
        }
        else {
            const dObj = this.deserializedList[id];
            if (dObj) {
                obj[propName] = dObj;
            }
            else {
                this._idList.push(id);
                this._idObjList.push(obj);
                this._idPropList.push(propName);
            }
        }
    }

    private _deserializePrimitiveObject (instance, serialized) {
        const self = this;
        for (const propName in serialized) {
            if (serialized.hasOwnProperty(propName)) {
                const prop = serialized[propName];
                if (typeof prop !== 'object') {
                    if (propName !== '__type__'/* && k != '__id__'*/) {
                        instance[propName] = prop;
                    }
                }
                else {
                    if (prop) {
                        if (CC_EDITOR || CC_TEST) {
                            self._deserializeObjField(instance, prop, propName, self._target && instance);
                        }
                        else {
                            self._deserializeObjField(instance, prop, propName);
                        }
                    }
                    else {
                        instance[propName] = null;
                    }
                }

            }
        }
    }

    private _deserializeTypedObject (instance, serialized, klass) {
        if (klass === cc.Vec2) {
            instance.x = serialized.x || 0;
            instance.y = serialized.y || 0;
            return;
        } else if (klass === cc.Vec3) {
            instance.x = serialized.x || 0;
            instance.y = serialized.y || 0;
            instance.z = serialized.z || 0;
            return;
        } else if (klass === cc.Color) {
            instance.r = serialized.r || 0;
            instance.g = serialized.g || 0;
            instance.b = serialized.b || 0;
            const a = serialized.a;
            instance.a = (a === undefined ? 255 : a);
            return;
        } else if (klass === cc.Size) {
            instance.width = serialized.width || 0;
            instance.height = serialized.height || 0;
            return;
        }

        const DEFAULT = Attr.DELIMETER + 'default';
        const attrs = Attr.getClassAttrs(klass);
        const fastDefinedProps = klass.__props__ || Object.keys(instance);    // 遍历 instance，如果具有类型，才不会把 __type__ 也读进来
        // tslint:disable-next-line: prefer-for-of
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
                if (CC_EDITOR || CC_TEST) {
                    this._deserializeObjField(instance, value, propName, this._target && instance);
                } else {
                    this._deserializeObjField(instance, value, propName);
                }
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
    if (CC_DEV) {
        obj._target = null;
    }
    obj._idList.length = 0;
    obj._idObjList.length = 0;
    obj._idPropList.length = 0;
}, 1);
// @ts-ignore
_Deserializer.pool.get = function (result, target, classFinder, customEnv, ignoreEditorOnly) {
    const cache: any = this._get();
    if (cache) {
        cache.result = result;
        cache.customEnv = customEnv;
        cache._classFinder = classFinder;
        if (CC_DEV) {
            cache._target = target;
            cache._ignoreEditorOnly = ignoreEditorOnly;
        }
        return cache;
    }
    else {
        return new _Deserializer(result, target, classFinder, customEnv, ignoreEditorOnly);
    }
};

/**
 * @module cc
 */

/**
 * @en Deserialize json to cc.Asset
 * @zh 将 JSON 反序列化为对象实例。
 *
 * 当指定了 target 选项时，如果 target 引用的其它 asset 的 uuid 不变，则不会改变 target 对 asset 的引用，
 * 也不会将 uuid 保存到 result 对象中。
 *
 * @method deserialize
 * @param {String|Object} data - the serialized cc.Asset json string or json object.
 * @param {Details} [details] - additional loading result
 * @param {Object} [options]
 * @return {object} the main data(asset)
 */
export default function deserialize (data, details, options) {
    options = options || {};
    const classFinder = options.classFinder || js._getClassById;
    // 启用 createAssetRefs 后，如果有 url 属性则会被统一强制设置为 { uuid: 'xxx' }，必须后面再特殊处理
    const createAssetRefs = options.createAssetRefs || cc.sys.platform === cc.sys.EDITOR_CORE;
    const target = (CC_EDITOR || CC_TEST) && options.target;
    const customEnv = options.customEnv;
    const ignoreEditorOnly = options.ignoreEditorOnly;

    if (CC_EDITOR && Buffer.isBuffer(data)) {
        data = data.toString();
    }

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    // var oldJson = JSON.stringify(data, null, 2);

    const tempDetails = !details;
    details = details || Details.pool.get!();
    // @ts-ignore
    const deserializer: any = _Deserializer.pool.get(details, target, classFinder, customEnv, ignoreEditorOnly);

    cc.game._isCloning = true;
    const res = deserializer.deserialize(data);
    cc.game._isCloning = false;

    _Deserializer.pool.put(deserializer);
    if (createAssetRefs) {
        details.assignAssetsBy(Editor.serialize.asAsset);
    }
    if (tempDetails) {
        Details.pool.put(details);
    }

    // var afterJson = JSON.stringify(data, null, 2);
    // if (oldJson !== afterJson) {
    //     throw new Error('JSON SHOULD not changed');
    // }

    return res;
}
(deserialize as any).Details = Details;
deserialize.reportMissingClass = (id) => {
    if (CC_EDITOR && Editor.Utils.UuidUtils.isUuid(id)) {
        id = Editor.Utils.UuidUtils.decompressUuid(id);
        cc.warnID(5301, id);
    }
    else {
        cc.warnID(5302, id);
    }
};
cc.deserialize = deserialize;
