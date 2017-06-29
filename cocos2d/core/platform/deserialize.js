/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var JS = require('./js');
var CCObject = require('./CCObject');
var Attr = require('./attribute');
var CCClass = require('./CCClass');

// HELPERS

/**
 * !#en Contains information collected during deserialization
 * !#zh 包含反序列化时的一些信息
 * @class Details
 *
 */
var Details = function () {

    //this.urlList = [];
    //this.callbackList = [];

    // uuids(assets) need to load

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

    /**
     * the corresponding field name which referenced to the raw object
     * @property {String} rawProp
     */
    this.rawProp = '';
};
/**
 * @method reset
 */
Details.prototype.reset = function () {
    this.uuidList.length = 0;
    this.uuidObjList.length = 0;
    this.uuidPropList.length = 0;
    this.rawProp = '';
    //this.rawObjList.length = 0;
    //this.rawPropList.length = 0;
};
if (CC_EDITOR) {
    Details.prototype.assignAssetsBy = function (getter) {
        for (var i = 0, len = this.uuidList.length; i < len; i++) {
            var uuid = this.uuidList[i];
            var obj = this.uuidObjList[i];
            var prop = this.uuidPropList[i];
            obj[prop] = getter(uuid);
        }
    };
}
/**
 * @method getUuidOf
 * @param {Object} obj
 * @param {String} propName
 * @return {String}
 */
Details.prototype.getUuidOf = function (obj, propName) {
    for (var i = 0; i < this.uuidObjList.length; i++) {
        if (this.uuidObjList[i] === obj && this.uuidPropList[i] === propName) {
            return this.uuidList[i];
        }
    }
    return "";
};
/**
 * @method push
 * @param {Object} obj
 * @param {String} propName
 * @param {String} uuid
 */
Details.prototype.push = function (obj, propName, uuid) {
    this.uuidList.push(uuid);
    this.uuidObjList.push(obj);
    this.uuidPropList.push(propName);
};

Details.pool = new JS.Pool(function (obj) {
    obj.reset();
}, 10);

Details.pool.get = function () {
    return this._get() || new Details();
};

// IMPLEMENT OF DESERIALIZATION

var _Deserializer = (function () {
    function _Deserializer(result, target, classFinder, customEnv, ignoreEditorOnly) {
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

    function _dereference (self) {
        // 这里不采用遍历反序列化结果的方式，因为反序列化的结果如果引用到复杂的外部库，很容易堆栈溢出。
        var deserializedList = self.deserializedList;
        var idPropList = self._idPropList;
        var idList = self._idList;
        var idObjList = self._idObjList;
        var onDereferenced = self._classFinder && self._classFinder.onDereferenced;
        var i, propName, id;
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

    var prototype = _Deserializer.prototype;

    prototype.deserialize = function (jsonObj) {
        if (Array.isArray(jsonObj)) {
            var jsonArray = jsonObj;
            var refCount = jsonArray.length;
            this.deserializedList.length = refCount;
            // deserialize
            for (var i = 0; i < refCount; i++) {
                if (jsonArray[i]) {
                    if (CC_EDITOR || CC_TEST) {
                        var mainTarget = (i === 0 && this._target);
                        this.deserializedList[i] = this._deserializeObject(jsonArray[i], mainTarget, this.deserializedList, '' + i);
                    }
                    else {
                        this.deserializedList[i] = this._deserializeObject(jsonArray[i]);
                    }
                }
            }
            this.deserializedData = refCount > 0 ? this.deserializedList[0] : [];

            //// callback
            //for (var j = 0; j < refCount; j++) {
            //    if (referencedList[j].onAfterDeserialize) {
            //        referencedList[j].onAfterDeserialize();
            //    }
            //}
        }
        else {
            this.deserializedList.length = 1;
            if (CC_EDITOR || CC_TEST) {
                this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, this._target, this.deserializedList, '0') : null;
            }
            else {
                this.deserializedData = jsonObj ? this._deserializeObject(jsonObj) : null;
            }
            this.deserializedList[0] = this.deserializedData;

            //// callback
            //if (deserializedData.onAfterDeserialize) {
            //    deserializedData.onAfterDeserialize();
            //}
        }

        // dereference
        _dereference(this);

        return this.deserializedData;
    };

    ///**
    // * @param {Object} serialized - The obj to deserialize, must be non-nil
    // * @param {Object} [target=null] - editor only
    // * @param {Object} [owner] - debug only
    // * @param {String} [propName] - debug only
    // */
    prototype._deserializeObject = function (serialized, target, owner, propName) {
        var prop;
        var obj = null;     // the obj to return
        var klass = null;
        if (serialized.__type__) {

            // Type Object (including CCClass)

            var type = serialized.__type__;
            klass = this._classFinder(type, serialized, owner, propName);
            if (!klass) {
                var notReported = this._classFinder === JS._getClassById;
                if (notReported) {
                    cc.deserialize.reportMissingClass(type);
                }
                return null;
            }

            if ((CC_EDITOR || CC_TEST) && target) {
                // use target
                if ( !(target instanceof klass) ) {
                    cc.warnID(5300, JS.getClassName(target), klass);
                }
                obj = target;
            }
            else {
                // instantiate a new object
                obj = new klass();
                // Temporary solution
                if (CC_JSB && klass === cc.SpriteFrame) {
                    obj.retain();
                }
            }

            if (obj._deserialize) {
                obj._deserialize(serialized.content, this);
                return obj;
            }
            if (cc.Class._isCCClass(klass)) {
                _deserializeFireClass(this, obj, serialized, klass, target);
            }
            else {
                this._deserializeTypedObject(obj, serialized, klass);
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

            for (var i = 0; i < serialized.length; i++) {
                prop = serialized[i];
                if (typeof prop === 'object' && prop) {
                    if (CC_EDITOR || CC_TEST) {
                        this._deserializeObjField(obj, prop, '' + i, target && obj);
                    }
                    else {
                        this._deserializeObjField(obj, prop, '' + i);
                    }
                }
                else {
                    obj[i] = prop;
                }
            }
        }
        return obj;
    };

    // 和 _deserializeObject 不同的地方在于会判断 id 和 uuid
    prototype._deserializeObjField = function (obj, jsonObj, propName, target) {
        var id = jsonObj.__id__;
        if (typeof id === 'undefined') {
            var uuid = jsonObj.__uuid__;
            if (uuid) {
                //if (ENABLE_TARGET) {
                    //这里不做任何操作，因为有可能调用者需要知道依赖哪些 asset。
                    //调用者使用 uuidList 时，可以判断 obj[propName] 是否为空，为空则表示待进一步加载，
                    //不为空则只是表明依赖关系。
                //    if (target && target[propName] && target[propName]._uuid === uuid) {
                //        console.assert(obj[propName] === target[propName]);
                //        return;
                //    }
                // }
                this.result.uuidList.push(uuid);
                this.result.uuidObjList.push(obj);
                this.result.uuidPropList.push(propName);
            }
            else {
                if (CC_EDITOR || CC_TEST) {
                    obj[propName] = this._deserializeObject(jsonObj, target && target[propName], obj, propName);
                }
                else {
                    obj[propName] = this._deserializeObject(jsonObj);
                }
            }
        }
        else {
            var dObj = this.deserializedList[id];
            if (dObj) {
                obj[propName] = dObj;
            }
            else {
                this._idList.push(id);
                this._idObjList.push(obj);
                this._idPropList.push(propName);
            }
        }
    };

    prototype._deserializePrimitiveObject = function (instance, serialized) {
        var self = this;
        for (var propName in serialized) {
            if (serialized.hasOwnProperty(propName)) {
                var prop = serialized[propName];
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
    };

    prototype._deserializeTypedObject = function (instance, serialized, klass) {
        if (klass === cc.Vec2) {
            instance.x = serialized.x || 0;
            instance.y = serialized.y || 0;
            return;
        }
        else if (klass === cc.Color) {
            instance.r = serialized.r || 0;
            instance.g = serialized.g || 0;
            instance.b = serialized.b || 0;
            var a = serialized.a;
            instance.a = (a === undefined ? 255 : a);
            return;
        }

        var fastDefinedProps = klass.__props__;
        if (!fastDefinedProps) {
            fastDefinedProps = Object.keys(instance);    // 遍历 instance，如果具有类型，才不会把 __type__ 也读进来
        }
        for (var i = 0; i < fastDefinedProps.length; i++) {
            var propName = fastDefinedProps[i];
            var prop = serialized[propName];
            if (typeof prop !== 'undefined' && serialized.hasOwnProperty(propName)) {
                if (typeof prop !== 'object') {
                    instance[propName] = prop;
                }
                else if (prop) {
                    if (CC_EDITOR || CC_TEST) {
                        this._deserializeObjField(instance, prop, propName, this._target && instance);
                    }
                    else {
                        this._deserializeObjField(instance, prop, propName);
                    }
                }
                else {
                    instance[propName] = null;
                }
            }
        }
    };

    // function _deserializeFireClass(self, obj, serialized, klass, target) {
    //     var RAW_TYPE = Attr.DELIMETER + 'rawType';
    //     var EDITOR_ONLY = Attr.DELIMETER + 'editorOnly';
    //     var SERIALIZABLE = Attr.DELIMETER + 'serializable';
    //     var props = klass.__props__;
    //     var attrs = Attr.getClassAttrs(klass);
    //     for (var p = 0; p < props.length; p++) {
    //         var propName = props[p];
    //         var rawType = attrs[propName + RAW_TYPE];
    //         if (!rawType) {
    //             if (((CC_EDITOR && self._ignoreEditorOnly) || CC_PREVIEW) && attrs[propName + EDITOR_ONLY]) {
    //                 var mayUsedInPersistRoot = (cc.Node.isNode(obj) && propName === '_id');
    //                 if ( !mayUsedInPersistRoot ) {
    //                     continue;   // skip editor only if in preview
    //                 }
    //             }
    //             if (attrs[propName + SERIALIZABLE] === false) {
    //                 continue;   // skip nonSerialized
    //             }
    //             var prop = serialized[propName];
    //             if (typeof prop === 'undefined') {
    //                 continue;
    //             }
    //             if (typeof prop !== 'object') {
    //                 obj[propName] = prop;
    //             }
    //             else {
    //                 if (prop) {
    //                     if (CC_EDITOR || CC_TEST) {
    //                         self._deserializeObjField(obj, prop, propName, target && obj);
    //                     }
    //                     else {
    //                         self._deserializeObjField(obj, prop, propName);
    //                     }
    //                 }
    //                 else {
    //                     obj[propName] = null;
    //                 }
    //             }
    //         }
    //         else {
    //             // always load raw objects even if property not serialized
    //             if (self.result.rawProp) {
    //                 cc.error('not support multi raw object in a file');
    //                 // 这里假定每个asset都有uuid，每个json只能包含一个asset，只能包含一个rawProp
    //             }
    //             self.result.rawProp = propName;
    //         }
    //     }
    //     if (props[props.length - 1] === '_$erialized') {
    //         // deep copy original serialized data
    //         obj._$erialized = JSON.parse(JSON.stringify(serialized));
    //         // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced
    //         self._deserializePrimitiveObject(obj._$erialized, serialized);
    //     }
    // }
    function compileDeserialize (self, klass) {
        var RAW_TYPE = Attr.DELIMETER + 'rawType';
        var EDITOR_ONLY = Attr.DELIMETER + 'editorOnly';
        var SERIALIZABLE = Attr.DELIMETER + 'serializable';
        var DEFAULT = Attr.DELIMETER + 'default';
        var attrs = Attr.getClassAttrs(klass);

        var props = klass.__props__;
        // self, obj, serializedData, klass, target
        var sources = [
            'var prop;'
        ];
        // sources.push('var vb,vn,vs,vo,vu,vf;');    // boolean, number, string, object, undefined, function
        for (var p = 0; p < props.length; p++) {
            var propName = props[p];
            var propNameLiteral;
            var rawType = attrs[propName + RAW_TYPE];
            if (!rawType) {
                if ((CC_PREVIEW || (CC_EDITOR && self._ignoreEditorOnly)) && attrs[propName + EDITOR_ONLY]) {
                    var mayUsedInPersistRoot = (propName === '_id' && cc.isChildClassOf(klass, cc.Node));
                    if (!mayUsedInPersistRoot) {
                        continue;   // skip editor only if in preview
                    }
                }
                if (attrs[propName + SERIALIZABLE] === false) {
                    continue;   // skip nonSerialized
                }

                var accessor;
                if (CCClass.IDENTIFIER_RE.test(propName)) {
                    propNameLiteral = '"' + propName + '"';
                    accessor = '.' + propName;
                }
                else {
                    propNameLiteral = CCClass.escapeForJS(propName);
                    accessor = '[' + propNameLiteral + ']';
                }

                sources.push('prop=d' + accessor + ';');
                sources.push(`if(typeof ${CC_JSB ? '(prop)' : 'prop'}!=="undefined"){`);
                sources.push(    `if(typeof ${CC_JSB ? '(prop)' : 'prop'}!=="object"){` +
                                     'o' + accessor + '=prop;');
                sources.push(    '}else{' +
                                     'if(prop){');

                var defaultValue = CCClass.getDefault(attrs[propName + DEFAULT]);
                if (defaultValue instanceof cc.ValueType) {
                    // fast case
                    var ctorCode = JS.getClassName(defaultValue);
                    if (CC_EDITOR || CC_TEST) {
                        sources.push(    'if(!t)' +    // if has default value
                                             `s._deserializeTypedObject(o${accessor},prop,${ctorCode});`);
                        sources.push(    'else ' +     // slow case
                                             's._deserializeObjField(o,prop,' + propNameLiteral + ',o);');
                    }
                    else {
                        sources.push(    `s._deserializeTypedObject(o${accessor},prop,${ctorCode});`);
                    }
                }
                else {
                    // slow case
                    if (CC_EDITOR || CC_TEST) {
                        sources.push(    's._deserializeObjField(o,prop,' + propNameLiteral + ',t&&o);');
                    }
                    else {
                        sources.push(    's._deserializeObjField(o,prop,' + propNameLiteral + ');');
                    }
                }

                sources.push(        '}else o' + accessor + '=null;' +
                                 '}' +
                             '}');
            }
            else {
                if (CCClass.IDENTIFIER_RE.test(propName)) {
                    propNameLiteral = '"' + propName + '"';
                }
                else {
                    propNameLiteral = CCClass.escapeForJS(propName);
                }
                // always load raw objects even if property not serialized
                // 这里假定每个asset都有uuid，每个json只能包含一个asset，只能包含一个rawProp
                sources.push('if(s.result.rawProp)\n' +
                                'cc.error("not support multi raw object in a file");');
                sources.push('s.result.rawProp=' + propNameLiteral + ';');
            }
        }
        if (props[props.length - 1] === '_$erialized') {
            // deep copy original serialized data
            sources.push('o._$erialized=JSON.parse(JSON.stringify(d));');
            // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced
            sources.push('s._deserializePrimitiveObject(o._$erialized,d);');
        }
        return Function('s', 'o', 'd', 'k', 't', sources.join(''));
    }

    function unlinkUnusedPrefab (self, serialized, obj) {
        var uuid = serialized['asset'] && serialized['asset'].__uuid__;
        if (uuid) {
            var last = self.result.uuidList.length - 1;
            if (self.result.uuidList[last] === uuid &&
                self.result.uuidObjList[last] === obj &&
                self.result.uuidPropList[last] === 'asset') {
                self.result.uuidList.pop();
                self.result.uuidObjList.pop();
                self.result.uuidPropList.pop();
            }
            else {
                var debugEnvOnlyInfo = 'Failed to skip prefab asset while deserializing PrefabInfo';
                cc.warn(debugEnvOnlyInfo);
            }
        }
    }

    function _deserializeFireClass (self, obj, serialized, klass, target) {
        var deserialize = klass.__deserialize__;
        if (!deserialize) {
            deserialize = compileDeserialize(self, klass);
            // if (CC_TEST && !isPhantomJS) {
            //     cc.log(deserialize);
            // }
            JS.value(klass, '__deserialize__', deserialize, true);
        }
        deserialize(self, obj, serialized, klass, target);
        // if preview or build worker
        if (CC_PREVIEW || (CC_EDITOR && self._ignoreEditorOnly)) {
            if (klass === cc._PrefabInfo && !obj.sync) {
                unlinkUnusedPrefab(self, serialized, obj);
            }
        }
    }

    _Deserializer.pool = new JS.Pool(function (obj) {
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

    _Deserializer.pool.get = function (result, target, classFinder, customEnv, ignoreEditorOnly) {
        var cache = this._get();
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

    return _Deserializer;
})();

/**
 * @module cc
 */

/**
 * !#en Deserialize json to cc.Asset
 * !#zh 将 JSON 反序列化为对象实例。
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
cc.deserialize = function (data, details, options) {
    options = options || {};
    var classFinder = options.classFinder || JS._getClassById;
    // 启用 createAssetRefs 后，如果有 url 属性则会被统一强制设置为 { uuid: 'xxx' }，必须后面再特殊处理
    var createAssetRefs = options.createAssetRefs || cc.sys.platform === cc.sys.EDITOR_CORE;
    var target = (CC_EDITOR || CC_TEST) && options.target;
    var customEnv = options.customEnv;
    var ignoreEditorOnly = options.ignoreEditorOnly;

    if (CC_EDITOR && Buffer.isBuffer(data)) {
        data = data.toString();
    }

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    //var oldJson = JSON.stringify(data, null, 2);

    var tempDetails = !details;
    details = details || Details.pool.get();
    var deserializer = _Deserializer.pool.get(details, target, classFinder, customEnv, ignoreEditorOnly);

    cc.game._isCloning = true;
    var res = deserializer.deserialize(data);
    cc.game._isCloning = false;

    _Deserializer.pool.put(deserializer);
    if (createAssetRefs) {
        details.assignAssetsBy(Editor.serialize.asAsset);
    }
    if (tempDetails) {
        Details.pool.put(details);
    }

    //var afterJson = JSON.stringify(data, null, 2);
    //if (oldJson !== afterJson) {
    //    throw new Error('JSON SHOULD not changed');
    //}

    return res;
};

cc.deserialize.Details = Details;
cc.deserialize.reportMissingClass = function (id) {
    if (CC_EDITOR && Editor.Utils.UuidUtils.isUuid(id)) {
        id = Editor.Utils.UuidUtils.decompressUuid(id);
        cc.warnID(5301, id);
    }
    else {
        cc.warnID(5302, id);
    }
};
