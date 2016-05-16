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

var EDITOR = CC_DEV;
var ENABLE_TARGET = EDITOR;

// HELPERS

/**
 * !#en Contains information collected during deserialization
 * !#zh 包含反序列化时的一些信息
 * @class Details
 * @constructor
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

    if (EDITOR) {
        /**
         * 用户可以指定一个在反序列化结束时会被触发的回调，该回调会传回反序列化时统计到的所有解析过的字段。
         * NOTE:
         * - 会被传回的字段仅限于非 Asset 类型，并且如果字段值为 null 或 undefined，则可能不会被传回。
         * - 该回调在 DeserializeInfo 第一次调用 reset 时就会被清空。
         * @callback visitorInEditor
         * @param {Object[]} objs
         * @param {String[]} propNames
         * @param {Object} _Deserializer
         * @private
         */
        this.visitorInEditor = null;

        this.visitObjList = [];
        this.visitPropList = [];
    }
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

    if (EDITOR) {
        this.visitorInEditor = null;
        this.visitObjList.length = 0;
        this.visitPropList.length = 0;
    }
};
if (EDITOR) {
    Details.prototype.visitLater = function (obj, propName) {
        this.visitObjList.push(obj);
        this.visitPropList.push(propName);
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
 * @method assignAssetsBy
 * @param {Function} getter
 * @return {Boolean} success
 */
Details.prototype.assignAssetsBy = function (getter) {
    var success = true;
    for (var i = 0, len = this.uuidList.length; i < len; i++) {
        var uuid = this.uuidList[i];
        var asset = getter(uuid);
        if (asset) {
            var obj = this.uuidObjList[i];
            var prop = this.uuidPropList[i];
            obj[prop] = asset;
        }
        else {
            cc.error('Failed to assign asset: ' + uuid);
            success = false;
        }
    }
    return success;
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

// IMPLEMENT OF DESERIALIZATION

var _Deserializer = (function () {
    ///**
    // * @param {Boolean} isEditor - if false, "editorOnly" properties will be discarded
    // */
    function _Deserializer(jsonObj, result, target, classFinder) {
        this._classFinder = classFinder;
        if (ENABLE_TARGET) {
            this._target = target;
        }
        this._idList = [];
        this._idObjList = [];
        this._idPropList = [];
        this.result = result || new Details();

        if (Array.isArray(jsonObj)) {
            var jsonArray = jsonObj;
            var refCount = jsonArray.length;
            this.deserializedList = new Array(refCount);
            // deserialize
            for (var i = 0; i < refCount; i++) {
                if (jsonArray[i]) {
                    var mainTarget;
                    if (ENABLE_TARGET) {
                        mainTarget = (i === 0 && target);
                    }
                    this.deserializedList[i] = _deserializeObject(this, jsonArray[i], mainTarget);
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
            this.deserializedList = [null];
            this.deserializedData = jsonObj ? _deserializeObject(this, jsonObj, target) : null;
            this.deserializedList[0] = this.deserializedData;

            //// callback
            //if (deserializedData.onAfterDeserialize) {
            //    deserializedData.onAfterDeserialize();
            //}
        }

        // dereference
        _dereference(this);

        // call visitor after all properties initialized
        if (EDITOR) {
            this._callVisitorInEditor();
        }
    }

    var _dereference = function (self) {
        // 这里不采用遍历反序列化结果的方式，因为反序列化的结果如果引用到复杂的外部库，很容易堆栈溢出。
        var deserializedList = self.deserializedList;
        for (var i = 0, len = self._idList.length; i < len; i++) {
            var propName = self._idPropList[i];
            var id = self._idList[i];
            self._idObjList[i][propName] = deserializedList[id];
        }
    };

    if (EDITOR) {
        _Deserializer.prototype._callVisitorInEditor = function () {
            var result = this.result;
            if (result.visitorInEditor) {
                result.visitorInEditor(result.visitObjList, result.visitPropList, this);
            }
        };
    }

        // 和 _deserializeObject 不同的地方在于会判断 id 和 uuid
    _Deserializer.prototype._deserializeObjField = function (obj, jsonObj, propName, target) {
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
                if (ENABLE_TARGET) {
                    obj[propName] = _deserializeObject(this, jsonObj, target && target[propName]);
                }
                else {
                    obj[propName] = _deserializeObject(this, jsonObj);
                }
                if (this.result.visitorInEditor && EDITOR) {
                    this.result.visitLater(obj, propName);
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
            if (this.result.visitorInEditor && EDITOR) {
                this.result.visitLater(obj, propName);
            }
        }
    };

    function _deserializePrimitiveObject (self, instance, serialized) {
        for (var propName in serialized) {
            if (serialized.hasOwnProperty(propName)) {
                var prop = serialized[propName];
                if (typeof prop !== 'object') {
                    if (propName !== '__type__'/* && k != '__id__'*/) {
                        instance[propName] = prop;
                        if (self.result.visitorInEditor && EDITOR) {
                            self.result.visitLater(instance, propName);
                        }
                    }
                }
                else {
                    if (prop) {
                        if (ENABLE_TARGET) {
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

    function _deserializeTypedObject (self, instance, serialized) {
        //++self.stackCounter;
        //if (self.stackCounter === 100) {
        //    debugger;
        //}
        for (var propName in instance) {    // 遍历 instance，如果具有类型，才不会把 __type__ 也读进来
            var prop = serialized[propName];
            if (typeof prop !== 'undefined' && serialized.hasOwnProperty(propName)) {
                if (typeof prop !== 'object') {
                    instance[propName] = prop;
                }
                else {
                    if (prop) {
                        if (ENABLE_TARGET) {
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
        //--self.stackCounter;
    }

    function _deserializeFireClass(self, obj, serialized, klass, target) {
        var props = klass.__props__;
        for (var p = 0; p < props.length; p++) {
            var propName = props[p];
            var attrs = cc.Class.attr(klass, propName);
            // assume all prop in __props__ must have attr
            var rawType = attrs.rawType;
            if (!rawType) {
                if (!EDITOR && attrs.editorOnly) {
                    var mayUsedInPersistRoot = (obj instanceof cc.Node && propName === '_id');
                    if ( !mayUsedInPersistRoot ) {
                        continue;   // skip editor only if not editor
                    }
                }
                if (attrs.serializable === false) {
                    continue;   // skip nonSerialized
                }
                var prop = serialized[propName];
                if (typeof prop === 'undefined') {
                    continue;
                }
                if (typeof prop !== 'object') {
                    obj[propName] = prop;
                }
                else {
                    if (prop) {
                        if (ENABLE_TARGET) {
                            self._deserializeObjField(obj, prop, propName, target && obj);
                        }
                        else {
                            self._deserializeObjField(obj, prop, propName);
                        }
                    }
                    else {
                        obj[propName] = null;
                    }
                }
            }
            else {
                // always load raw objects even if property not serialized
                if (self.result.rawProp) {
                    cc.error('not support multi raw object in a file');
                    // 这里假定每个asset都有uuid，每个json只能包含一个asset，只能包含一个rawProp
                }
                self.result.rawProp = propName;
            }
        }
        if (props[props.length - 1] === '_$erialized') {
            // save original serialized data
            obj._$erialized = serialized;
            // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced
            _deserializePrimitiveObject(self, obj._$erialized, serialized);
        }
    }

    ///**
    // * @param {Object} serialized - The obj to deserialize, must be non-nil
    // * @param {Object} [target=null]
    // */
    var _deserializeObject = function (self, serialized, target) {
        var propName, prop;
        var obj = null;     // the obj to return
        var klass = null;
        if (serialized.__type__) {

            // Type Object (including CCClass)

            var type = serialized.__type__;
            klass = self._classFinder(type);
            if (!klass) {
                if (CC_EDITOR && Editor.UuidUtils.isUuid(type)) {
                    type = Editor.UuidUtils.decompressUuid(type);
                    cc.warn('Can not find script "%s"', type);
                    return null;
                }
                cc.warn('Can not find class "%s"', type);
                return null;
            }

            if (ENABLE_TARGET && target) {
                // use target
                if ( !(target instanceof klass) ) {
                    cc.warn('Type of target to deserialize not matched with data: target is %s, data is %s',
                        JS.getClassName(target), klass);
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
                obj._deserialize(serialized.content, self);
                return obj;
            }
            if ( cc.Class._isCCClass(klass) ) {
                _deserializeFireClass(self, obj, serialized, klass, target);
            }
            else {
                _deserializeTypedObject(self, obj, serialized);
            }
        }
        else if ( !Array.isArray(serialized) ) {

            // embedded primitive javascript object

            obj = (ENABLE_TARGET && target) || {};
            _deserializePrimitiveObject(self, obj, serialized);
        }
        else {

            // Array

            if (ENABLE_TARGET && target) {
                target.length = serialized.length;
                obj = target;
            }
            else {
                obj = new Array(serialized.length);
            }

            for (var i = 0; i < serialized.length; i++) {
                prop = serialized[i];
                if (typeof prop === 'object' && prop) {
                    if (ENABLE_TARGET) {
                        self._deserializeObjField(obj, prop, '' + i, target && obj);
                    }
                    else {
                        self._deserializeObjField(obj, prop, '' + i);
                    }
                }
                else {
                    obj[i] = prop;

                    if (self.result.visitorInEditor && EDITOR) {
                        self.result.visitLater(obj, '' + i);
                    }
                }
            }
        }
        return obj;
    };

    return _Deserializer;
})();

// FACADE

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
 * @param {Details} [result] - additional loading result
 * @param {Object} [options]
 * @return {object} the main data(asset)
 */
cc.deserialize = function (data, result, options) {
    var classFinder = (options && options.classFinder) || JS._getClassById;
    // 启用 createAssetRefs 后，如果有 url 属性则会被统一强制设置为 { uuid: 'xxx' }，必须后面再特殊处理
    var createAssetRefs = (options && options.createAssetRefs) || cc.sys.platform === cc.sys.EDITOR_CORE;
    var target = ENABLE_TARGET && (options && options.target);

    if (CC_EDITOR && Buffer.isBuffer(data)) {
        data = data.toString();
    }

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    if (createAssetRefs && !result) {
        result = new Details();
    }
    cc.game._isCloning = true;
    var deserializer = new _Deserializer(data, result, target, classFinder);
    cc.game._isCloning = false;

    if (createAssetRefs) {
        result.assignAssetsBy(Editor.serialize.asAsset);
    }

    return deserializer.deserializedData;
};

cc.deserialize.Details = Details;
