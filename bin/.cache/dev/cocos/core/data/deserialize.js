(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "../utils/js.js", "../utils/misc.js", "./class.js", "./utils/attribute.js", "../components/missing-script.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("../utils/js.js"), require("../utils/misc.js"), require("./class.js"), require("./utils/attribute.js"), require("../components/missing-script.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.js, global.misc, global._class, global.attribute, global.missingScript, global.defaultConstants, global.globalExports);
    global.deserialize = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, js, misc, _class, Attr, _missingScript, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.deserialize = deserialize;
  _exports._Deserializer = _exports.Details = void 0;
  js = _interopRequireWildcard(js);
  misc = _interopRequireWildcard(misc);
  Attr = _interopRequireWildcard(Attr);
  _missingScript = _interopRequireDefault(_missingScript);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // HELPERS
  // tslint:disable: no-shadowed-variable

  /**
   * @en Contains information collected during deserialization
   * @zh 包含反序列化时的一些信息。
   * @class Details
   *
   */
  var Details = /*#__PURE__*/function () {
    function Details() {
      var _this = this;

      _classCallCheck(this, Details);

      this.uuidList = void 0;
      this.uuidObjList = void 0;
      this.uuidPropList = void 0;
      this._stillUseUrl = void 0;

      /**
       * list of the depends assets' uuid
       */
      this.uuidList = [];
      /**
       * the obj list whose field needs to load asset by uuid
       */

      this.uuidObjList = [];
      /**
       * the corresponding field name which referenced to the asset
       */

      this.uuidPropList = []; // TODO - DELME since 2.0

      this._stillUseUrl = js.createMap(true);

      if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
        this.assignAssetsBy = function (getter) {
          // ignore this._stillUseUrl
          for (var i = 0, len = _this.uuidList.length; i < len; i++) {
            var uuid = _this.uuidList[i];
            var obj = _this.uuidObjList[i];
            var prop = _this.uuidPropList[i];
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


    _createClass(Details, [{
      key: "reset",
      value: function reset() {
        this.uuidList.length = 0;
        this.uuidObjList.length = 0;
        this.uuidPropList.length = 0;
        js.clear(this._stillUseUrl);
      } // /**
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

    }, {
      key: "push",
      value: function push(obj, propName, uuid, _stillUseUrl) {
        if (_stillUseUrl) {
          this._stillUseUrl[this.uuidList.length] = true;
        }

        this.uuidList.push(uuid);
        this.uuidObjList.push(obj);
        this.uuidPropList.push(propName);
      }
    }]);

    return Details;
  }();

  _exports.Details = Details;
  Details.pool = void 0;
  Details.pool = new js.Pool(function (obj) {
    obj.reset();
  }, 10);

  Details.pool.get = function () {
    return this._get() || new Details();
  }; // IMPLEMENT OF DESERIALIZATION


  function _dereference(self) {
    // 这里不采用遍历反序列化结果的方式，因为反序列化的结果如果引用到复杂的外部库，很容易堆栈溢出。
    var deserializedList = self.deserializedList;
    var idPropList = self._idPropList;
    var idList = self._idList;
    var idObjList = self._idObjList;
    var onDereferenced = self._classFinder && self._classFinder.onDereferenced;
    var i;
    var propName;
    var id;

    if (_defaultConstants.EDITOR && onDereferenced) {
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

  function compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, assumeHavePropIfIsValue, stillUseUrl) {
    if (defaultValue instanceof _globalExports.legacyCC.ValueType) {
      // fast case
      if (!assumeHavePropIfIsValue) {
        sources.push('if(prop){');
      }

      var ctorCode = js.getClassName(defaultValue);
      sources.push("s._deserializeTypedObject(o".concat(accessorToSet, ",prop,").concat(ctorCode, ");"));

      if (!assumeHavePropIfIsValue) {
        sources.push('}else o' + accessorToSet + '=null;');
      }
    } else {
      sources.push('if(prop){');
      sources.push('s._deserializeObjField(o,prop,' + propNameLiteralToSet + (_defaultConstants.EDITOR || _defaultConstants.TEST ? ',t&&o,' : ',null,') + !!stillUseUrl + ');');
      sources.push('}else o' + accessorToSet + '=null;');
    }
  }

  var compileDeserialize = _defaultConstants.SUPPORT_JIT ? function (self, klass) {
    var TYPE = Attr.DELIMETER + 'type';
    var EDITOR_ONLY = Attr.DELIMETER + 'editorOnly';
    var DEFAULT = Attr.DELIMETER + 'default';
    var SAVE_URL_AS_ASSET = Attr.DELIMETER + 'saveUrlAsAsset';
    var FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs';
    var attrs = Attr.getClassAttrs(klass);
    var props = klass.__values__; // self, obj, serializedData, klass, target

    var sources = ['var prop;'];
    var fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass)); // sources.push('var vb,vn,vs,vo,vu,vf;');    // boolean, number, string, object, undefined, function
    // tslint:disable-next-line: prefer-for-of

    for (var p = 0; p < props.length; p++) {
      var propName = props[p];

      if ((_defaultConstants.PREVIEW || _defaultConstants.EDITOR && self._ignoreEditorOnly) && attrs[propName + EDITOR_ONLY]) {
        continue; // skip editor only if in preview
      }

      var accessorToSet = void 0;
      var propNameLiteralToSet = void 0;

      if (_class.CCClass.IDENTIFIER_RE.test(propName)) {
        propNameLiteralToSet = '"' + propName + '"';
        accessorToSet = '.' + propName;
      } else {
        propNameLiteralToSet = _class.CCClass.escapeForJS(propName);
        accessorToSet = '[' + propNameLiteralToSet + ']';
      }

      var accessorToGet = accessorToSet;

      if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
        var propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];

        if (_class.CCClass.IDENTIFIER_RE.test(propNameToRead)) {
          accessorToGet = '.' + propNameToRead;
        } else {
          accessorToGet = '[' + _class.CCClass.escapeForJS(propNameToRead) + ']';
        }
      }

      sources.push('prop=d' + accessorToGet + ';');
      sources.push("if(typeof ".concat(_defaultConstants.JSB ? '(prop)' : 'prop', "!==\"undefined\"){"));
      var stillUseUrl = attrs[propName + SAVE_URL_AS_ASSET]; // function undefined object(null) string boolean number

      var defaultValue = _class.CCClass.getDefault(attrs[propName + DEFAULT]);

      if (fastMode) {
        var isPrimitiveType = void 0;
        var userType = attrs[propName + TYPE];

        if (defaultValue === undefined && userType) {
          isPrimitiveType = userType === _globalExports.legacyCC.String || userType === _globalExports.legacyCC.Integer || userType === _globalExports.legacyCC.Float || userType === _globalExports.legacyCC.Boolean;
        } else {
          var defaultType = _typeof(defaultValue);

          isPrimitiveType = defaultType === 'string' && !stillUseUrl || defaultType === 'number' || defaultType === 'boolean';
        }

        if (isPrimitiveType) {
          sources.push("o".concat(accessorToSet, "=prop;"));
        } else {
          compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, true, stillUseUrl);
        }
      } else {
        sources.push("if(typeof ".concat(_defaultConstants.JSB ? '(prop)' : 'prop', "!==\"object\"){") + 'o' + accessorToSet + '=prop;' + '}else{');
        compileObjectTypeJit(sources, defaultValue, accessorToSet, propNameLiteralToSet, false, stillUseUrl);
        sources.push('}');
      }

      sources.push('}');
    }

    if (_globalExports.legacyCC.js.isChildClassOf(klass, _globalExports.legacyCC._BaseNode) || _globalExports.legacyCC.js.isChildClassOf(klass, _globalExports.legacyCC.Component)) {
      if (_defaultConstants.PREVIEW || _defaultConstants.EDITOR && self._ignoreEditorOnly) {
        var mayUsedInPersistRoot = js.isChildClassOf(klass, _globalExports.legacyCC.Node);

        if (mayUsedInPersistRoot) {
          sources.push('d._id&&(o._id=d._id);');
        }
      } else {
        sources.push('d._id&&(o._id=d._id);');
      }
    }

    if (props[props.length - 1] === '_$erialized') {
      // deep copy original serialized data
      sources.push('o._$erialized=JSON.parse(JSON.stringify(d));'); // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced

      sources.push('s._deserializePrimitiveObject(o._$erialized,d);');
    }

    return Function('s', 'o', 'd', 'k', 't', sources.join(''));
  } : function (self, klass) {
    var fastMode = misc.BUILTIN_CLASSID_RE.test(js._getClassId(klass));

    var shouldCopyId = _globalExports.legacyCC.js.isChildClassOf(klass, _globalExports.legacyCC._BaseNode) || _globalExports.legacyCC.js.isChildClassOf(klass, _globalExports.legacyCC.Component);

    var shouldCopyRawData;
    var simpleProps = [];
    var simplePropsToRead = simpleProps;
    var advancedProps = [];
    var advancedPropsToRead = advancedProps;
    var advancedPropsUseUrl = [];
    var advancedPropsValueType = [];

    (function () {
      var props = klass.__values__;
      shouldCopyRawData = props[props.length - 1] === '_$erialized';
      var attrs = Attr.getClassAttrs(klass);
      var TYPE = Attr.DELIMETER + 'type';
      var DEFAULT = Attr.DELIMETER + 'default';
      var SAVE_URL_AS_ASSET = Attr.DELIMETER + 'saveUrlAsAsset';
      var FORMERLY_SERIALIZED_AS = Attr.DELIMETER + 'formerlySerializedAs'; // tslint:disable-next-line: prefer-for-of

      for (var p = 0; p < props.length; p++) {
        var propName = props[p];
        var propNameToRead = propName;

        if (attrs[propName + FORMERLY_SERIALIZED_AS]) {
          propNameToRead = attrs[propName + FORMERLY_SERIALIZED_AS];
        }

        var stillUseUrl = attrs[propName + SAVE_URL_AS_ASSET]; // function undefined object(null) string boolean number

        var defaultValue = _class.CCClass.getDefault(attrs[propName + DEFAULT]);

        var isPrimitiveType = false;

        if (fastMode) {
          var userType = attrs[propName + TYPE];

          if (defaultValue === undefined && userType) {
            isPrimitiveType = userType === _globalExports.legacyCC.String || userType === _globalExports.legacyCC.Integer || userType === _globalExports.legacyCC.Float || userType === _globalExports.legacyCC.Boolean;
          } else {
            var defaultType = _typeof(defaultValue);

            isPrimitiveType = defaultType === 'string' && !stillUseUrl || defaultType === 'number' || defaultType === 'boolean';
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

          advancedPropsUseUrl.push(stillUseUrl);
          advancedPropsValueType.push(defaultValue instanceof _globalExports.legacyCC.ValueType && defaultValue.constructor);
        }
      }
    })();

    return function (s, o, d, k, t) {
      for (var i = 0; i < simpleProps.length; ++i) {
        var prop = d[simplePropsToRead[i]];

        if (prop !== undefined) {
          o[simpleProps[i]] = prop;
        }
      }

      for (var _i = 0; _i < advancedProps.length; ++_i) {
        var propName = advancedProps[_i];
        var _prop = d[advancedPropsToRead[_i]];

        if (_prop === undefined) {
          continue;
        }

        if (!fastMode && _typeof(_prop) !== 'object') {
          o[propName] = _prop;
        } else {
          // fastMode (so will not simpleProp) or object
          var valueTypeCtor = advancedPropsValueType[_i];

          if (valueTypeCtor) {
            if (fastMode || _prop) {
              s._deserializeTypedObject(o[propName], _prop, valueTypeCtor);
            } else {
              o[propName] = null;
            }
          } else {
            if (_prop) {
              s._deserializeObjField(o, _prop, propName, _defaultConstants.EDITOR || _defaultConstants.TEST ? t && o : null, advancedPropsUseUrl[_i]);
            } else {
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
        o._$erialized = JSON.parse(JSON.stringify(d)); // parse the serialized data as primitive javascript object, so its __id__ will be dereferenced

        s._deserializePrimitiveObject(o._$erialized, d);
      }
    };
  };

  function unlinkUnusedPrefab(self, serialized, obj) {
    var uuid = serialized.asset && serialized.asset.__uuid__;

    if (uuid) {
      var last = self.result.uuidList.length - 1;

      if (self.result.uuidList[last] === uuid && self.result.uuidObjList[last] === obj && self.result.uuidPropList[last] === 'asset') {
        self.result.uuidList.pop();
        self.result.uuidObjList.pop();
        self.result.uuidPropList.pop();
      } else {
        (0, _debug.warnID)(4935);
      }
    }
  }

  function _deserializeFireClass(self, obj, serialized, klass, target) {
    var deserialize;

    if (klass.hasOwnProperty('__deserialize__')) {
      deserialize = klass.__deserialize__;
    } else {
      deserialize = compileDeserialize(self, klass); // if (TEST && !isPhantomJS) {
      //     log(deserialize);
      // }

      js.value(klass, '__deserialize__', deserialize, true);
    }

    deserialize(self, obj, serialized, klass, target); // if preview or build worker

    if (_defaultConstants.PREVIEW || _defaultConstants.EDITOR && self._ignoreEditorOnly) {
      if (klass === _globalExports.legacyCC._PrefabInfo && !obj.sync) {
        unlinkUnusedPrefab(self, serialized, obj);
      }
    }
  } // function _compileTypedObject (accessor, klass, ctorCode) {
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


  var _Deserializer = /*#__PURE__*/function () {
    function _Deserializer(result, target, classFinder, customEnv, ignoreEditorOnly) {
      _classCallCheck(this, _Deserializer);

      this.result = void 0;
      this.customEnv = void 0;
      this.deserializedList = void 0;
      this.deserializedData = void 0;
      this._classFinder = void 0;
      this._target = void 0;
      this._ignoreEditorOnly = void 0;
      this._idList = void 0;
      this._idObjList = void 0;
      this._idPropList = void 0;
      this.result = result;
      this.customEnv = customEnv;
      this.deserializedList = [];
      this.deserializedData = null;
      this._classFinder = classFinder;

      if (_defaultConstants.DEV) {
        this._target = target;
        this._ignoreEditorOnly = ignoreEditorOnly;
      }

      this._idList = [];
      this._idObjList = [];
      this._idPropList = [];
    }

    _createClass(_Deserializer, [{
      key: "deserialize",
      value: function deserialize(jsonObj) {
        if (Array.isArray(jsonObj)) {
          var jsonArray = jsonObj;
          var refCount = jsonArray.length;
          this.deserializedList.length = refCount; // deserialize

          for (var i = 0; i < refCount; i++) {
            if (jsonArray[i]) {
              if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
                var mainTarget = i === 0 && this._target;
                this.deserializedList[i] = this._deserializeObject(jsonArray[i], false, mainTarget, this.deserializedList, '' + i);
              } else {
                this.deserializedList[i] = this._deserializeObject(jsonArray[i], false);
              }
            }
          }

          this.deserializedData = refCount > 0 ? this.deserializedList[0] : []; //// callback
          // for (var j = 0; j < refCount; j++) {
          //    if (referencedList[j].onAfterDeserialize) {
          //        referencedList[j].onAfterDeserialize();
          //    }
          // }
        } else {
          this.deserializedList.length = 1;

          if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
            this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, false, this._target, this.deserializedList, '0') : null;
          } else {
            this.deserializedData = jsonObj ? this._deserializeObject(jsonObj, false) : null;
          }

          this.deserializedList[0] = this.deserializedData; //// callback
          // if (deserializedData.onAfterDeserialize) {
          //    deserializedData.onAfterDeserialize();
          // }
        } // dereference


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

    }, {
      key: "_deserializeObject",
      value: function _deserializeObject(serialized, _stillUseUrl, target, owner, propName) {
        var prop;
        var obj = null; // the obj to return

        var klass = null;
        var type = serialized.__type__;

        if (type === 'TypedArray') {
          var array = serialized.array; // @ts-ignore

          obj = new window[serialized.ctor](array.length);

          for (var i = 0; i < array.length; ++i) {
            obj[i] = array[i];
          }

          return obj;
        } else if (type) {
          // @ts-ignore
          var deserializeByType = function deserializeByType() {
            if ((_defaultConstants.EDITOR || _defaultConstants.TEST) && target) {
              // use target
              if (!(target instanceof klass)) {
                (0, _debug.warnID)(5300, js.getClassName(target), klass);
              }

              obj = target;
            } else {
              // instantiate a new object
              obj = new klass();
            }

            if (obj._deserialize) {
              obj._deserialize(serialized.content, self);

              return;
            }

            if (_globalExports.legacyCC.Class._isCCClass(klass)) {
              _deserializeFireClass(self, obj, serialized, klass, target);
            } else {
              self._deserializeTypedObject(obj, serialized, klass);
            }
          }; // @ts-ignore


          var checkDeserializeByType = function checkDeserializeByType() {
            try {
              deserializeByType();
            } catch (e) {
              console.error('deserialize ' + klass.name + ' failed, ' + e.stack);
              klass = _missingScript.default.getMissingWrapper(type, serialized);

              _globalExports.legacyCC.deserialize.reportMissingClass(type);

              deserializeByType();
            }
          };

          // Type Object (including CCClass)
          klass = this._classFinder(type, serialized, owner, propName);

          if (!klass) {
            var notReported = this._classFinder === js._getClassById;

            if (notReported) {
              _globalExports.legacyCC.deserialize.reportMissingClass(type);
            }

            return null;
          }

          var self = this;

          if (_defaultConstants.EDITOR && _globalExports.legacyCC.js.isChildClassOf(klass, _globalExports.legacyCC.Component)) {
            checkDeserializeByType();
          } else {
            deserializeByType();
          }
        } else if (!Array.isArray(serialized)) {
          // embedded primitive javascript object
          obj = (_defaultConstants.EDITOR || _defaultConstants.TEST) && target || {};

          this._deserializePrimitiveObject(obj, serialized);
        } else {
          // Array
          if ((_defaultConstants.EDITOR || _defaultConstants.TEST) && target) {
            target.length = serialized.length;
            obj = target;
          } else {
            obj = new Array(serialized.length);
          }

          for (var _i2 = 0; _i2 < serialized.length; _i2++) {
            prop = serialized[_i2];

            if (_typeof(prop) === 'object' && prop) {
              if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
                this._deserializeObjField(obj, prop, '' + _i2, target && obj, _stillUseUrl);
              } else {
                this._deserializeObjField(obj, prop, '' + _i2, null, _stillUseUrl);
              }
            } else {
              obj[_i2] = prop;
            }
          }
        }

        return obj;
      } // 和 _deserializeObject 不同的地方在于会判断 id 和 uuid

    }, {
      key: "_deserializeObjField",
      value: function _deserializeObjField(obj, jsonObj, propName, target, _stillUseUrl) {
        var id = jsonObj.__id__;

        if (id === undefined) {
          var uuid = jsonObj.__uuid__;

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
          } else {
            if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
              obj[propName] = this._deserializeObject(jsonObj, _stillUseUrl, target && target[propName], obj, propName);
            } else {
              obj[propName] = this._deserializeObject(jsonObj, _stillUseUrl);
            }
          }
        } else {
          var dObj = this.deserializedList[id];

          if (dObj) {
            obj[propName] = dObj;
          } else {
            this._idList.push(id);

            this._idObjList.push(obj);

            this._idPropList.push(propName);
          }
        }
      }
    }, {
      key: "_deserializePrimitiveObject",
      value: function _deserializePrimitiveObject(instance, serialized) {
        var self = this;

        for (var propName in serialized) {
          if (serialized.hasOwnProperty(propName)) {
            var prop = serialized[propName];

            if (_typeof(prop) !== 'object') {
              if (propName !== '__type__'
              /* && k != '__id__'*/
              ) {
                  instance[propName] = prop;
                }
            } else {
              if (prop) {
                if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
                  self._deserializeObjField(instance, prop, propName, self._target && instance);
                } else {
                  self._deserializeObjField(instance, prop, propName);
                }
              } else {
                instance[propName] = null;
              }
            }
          }
        }
      }
    }, {
      key: "_deserializeTypedObject",
      value: function _deserializeTypedObject(instance, serialized, klass) {
        if (klass === _globalExports.legacyCC.Vec2) {
          instance.x = serialized.x || 0;
          instance.y = serialized.y || 0;
          return;
        } else if (klass === _globalExports.legacyCC.Vec3) {
          instance.x = serialized.x || 0;
          instance.y = serialized.y || 0;
          instance.z = serialized.z || 0;
          return;
        } else if (klass === _globalExports.legacyCC.Color) {
          instance.r = serialized.r || 0;
          instance.g = serialized.g || 0;
          instance.b = serialized.b || 0;
          var a = serialized.a;
          instance.a = a === undefined ? 255 : a;
          return;
        } else if (klass === _globalExports.legacyCC.Size) {
          instance.width = serialized.width || 0;
          instance.height = serialized.height || 0;
          return;
        }

        var DEFAULT = Attr.DELIMETER + 'default';
        var attrs = Attr.getClassAttrs(klass);
        var fastDefinedProps = klass.__props__ || Object.keys(instance); // 遍历 instance，如果具有类型，才不会把 __type__ 也读进来
        // tslint:disable-next-line: prefer-for-of

        for (var i = 0; i < fastDefinedProps.length; i++) {
          var propName = fastDefinedProps[i];
          var value = serialized[propName];

          if (value === undefined || !serialized.hasOwnProperty(propName)) {
            // not serialized,
            // recover to default value in ValueType, because eliminated properties equals to
            // its default value in ValueType, not default value in user class
            value = _class.CCClass.getDefault(attrs[propName + DEFAULT]);
          }

          if (_typeof(value) !== 'object') {
            instance[propName] = value;
          } else if (value) {
            if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
              this._deserializeObjField(instance, value, propName, this._target && instance);
            } else {
              this._deserializeObjField(instance, value, propName);
            }
          } else {
            instance[propName] = null;
          }
        }
      }
    }]);

    return _Deserializer;
  }();

  _exports._Deserializer = _Deserializer;
  _Deserializer.pool = void 0;
  _Deserializer.pool = new js.Pool(function (obj) {
    obj.result = null;
    obj.customEnv = null;
    obj.deserializedList.length = 0;
    obj.deserializedData = null;
    obj._classFinder = null;

    if (_defaultConstants.DEV) {
      obj._target = null;
    }

    obj._idList.length = 0;
    obj._idObjList.length = 0;
    obj._idPropList.length = 0;
  }, 1); // @ts-ignore

  _Deserializer.pool.get = function (result, target, classFinder, customEnv, ignoreEditorOnly) {
    var cache = this._get();

    if (cache) {
      cache.result = result;
      cache.customEnv = customEnv;
      cache._classFinder = classFinder;

      if (_defaultConstants.DEV) {
        cache._target = target;
        cache._ignoreEditorOnly = ignoreEditorOnly;
      }

      return cache;
    } else {
      return new _Deserializer(result, target, classFinder, customEnv, ignoreEditorOnly);
    }
  };
  /**
   * @module cc
   */

  /**
   * @en Deserialize json to `Asset`.
   * @zh 将 JSON 反序列化为对象实例。
   *
   * 当指定了 target 选项时，如果 target 引用的其它 asset 的 uuid 不变，则不会改变 target 对 asset 的引用，
   * 也不会将 uuid 保存到 result 对象中。
   *
   * @method deserialize
   * @param {String|Object} data - the serialized `Asset` json string or json object.
   * @param {Details} [details] - additional loading result
   * @param {Object} [options]
   * @return {object} the main data(asset)
   */


  function deserialize(data, details, options) {
    options = options || {};
    var classFinder = options.classFinder || js._getClassById; // 启用 createAssetRefs 后，如果有 url 属性则会被统一强制设置为 { uuid: 'xxx' }，必须后面再特殊处理

    var createAssetRefs = options.createAssetRefs || _globalExports.legacyCC.sys.platform === _globalExports.legacyCC.sys.EDITOR_CORE;
    var target = (_defaultConstants.EDITOR || _defaultConstants.TEST) && options.target;
    var customEnv = options.customEnv;
    var ignoreEditorOnly = options.ignoreEditorOnly;

    if (typeof data === 'string') {
      data = JSON.parse(data);
    } // var oldJson = JSON.stringify(data, null, 2);


    var tempDetails = !details;
    details = details || Details.pool.get(); // @ts-ignore

    var deserializer = _Deserializer.pool.get(details, target, classFinder, customEnv, ignoreEditorOnly);

    _globalExports.legacyCC.game._isCloning = true;
    var res = deserializer.deserialize(data);
    _globalExports.legacyCC.game._isCloning = false;

    _Deserializer.pool.put(deserializer);

    if (createAssetRefs) {
      details.assignAssetsBy(EditorExtends.serialize.asAsset);
    }

    if (tempDetails) {
      Details.pool.put(details);
    } // var afterJson = JSON.stringify(data, null, 2);
    // if (oldJson !== afterJson) {
    //     throw new Error('JSON SHOULD not changed');
    // }


    return res;
  }

  deserialize.Details = Details;

  deserialize.reportMissingClass = function (id) {
    if (_defaultConstants.EDITOR && EditorExtends.UuidUtils.isUuid(id)) {
      id = EditorExtends.UuidUtils.decompressUuid(id);
      (0, _debug.warnID)(5301, id);
    } else {
      (0, _debug.warnID)(5302, id);
    }
  };

  deserialize._Deserializer = _Deserializer;
  _globalExports.legacyCC.deserialize = deserialize;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZXNlcmlhbGl6ZS50cyJdLCJuYW1lcyI6WyJEZXRhaWxzIiwidXVpZExpc3QiLCJ1dWlkT2JqTGlzdCIsInV1aWRQcm9wTGlzdCIsIl9zdGlsbFVzZVVybCIsImpzIiwiY3JlYXRlTWFwIiwiRURJVE9SIiwiVEVTVCIsImFzc2lnbkFzc2V0c0J5IiwiZ2V0dGVyIiwiaSIsImxlbiIsImxlbmd0aCIsInV1aWQiLCJvYmoiLCJwcm9wIiwiY2xlYXIiLCJwcm9wTmFtZSIsInB1c2giLCJwb29sIiwiUG9vbCIsInJlc2V0IiwiZ2V0IiwiX2dldCIsIl9kZXJlZmVyZW5jZSIsInNlbGYiLCJkZXNlcmlhbGl6ZWRMaXN0IiwiaWRQcm9wTGlzdCIsIl9pZFByb3BMaXN0IiwiaWRMaXN0IiwiX2lkTGlzdCIsImlkT2JqTGlzdCIsIl9pZE9iakxpc3QiLCJvbkRlcmVmZXJlbmNlZCIsIl9jbGFzc0ZpbmRlciIsImlkIiwiY29tcGlsZU9iamVjdFR5cGVKaXQiLCJzb3VyY2VzIiwiZGVmYXVsdFZhbHVlIiwiYWNjZXNzb3JUb1NldCIsInByb3BOYW1lTGl0ZXJhbFRvU2V0IiwiYXNzdW1lSGF2ZVByb3BJZklzVmFsdWUiLCJzdGlsbFVzZVVybCIsImxlZ2FjeUNDIiwiVmFsdWVUeXBlIiwiY3RvckNvZGUiLCJnZXRDbGFzc05hbWUiLCJjb21waWxlRGVzZXJpYWxpemUiLCJTVVBQT1JUX0pJVCIsImtsYXNzIiwiVFlQRSIsIkF0dHIiLCJERUxJTUVURVIiLCJFRElUT1JfT05MWSIsIkRFRkFVTFQiLCJTQVZFX1VSTF9BU19BU1NFVCIsIkZPUk1FUkxZX1NFUklBTElaRURfQVMiLCJhdHRycyIsImdldENsYXNzQXR0cnMiLCJwcm9wcyIsIl9fdmFsdWVzX18iLCJmYXN0TW9kZSIsIm1pc2MiLCJCVUlMVElOX0NMQVNTSURfUkUiLCJ0ZXN0IiwiX2dldENsYXNzSWQiLCJwIiwiUFJFVklFVyIsIl9pZ25vcmVFZGl0b3JPbmx5IiwiQ0NDbGFzcyIsIklERU5USUZJRVJfUkUiLCJlc2NhcGVGb3JKUyIsImFjY2Vzc29yVG9HZXQiLCJwcm9wTmFtZVRvUmVhZCIsIkpTQiIsImdldERlZmF1bHQiLCJpc1ByaW1pdGl2ZVR5cGUiLCJ1c2VyVHlwZSIsInVuZGVmaW5lZCIsIlN0cmluZyIsIkludGVnZXIiLCJGbG9hdCIsIkJvb2xlYW4iLCJkZWZhdWx0VHlwZSIsImlzQ2hpbGRDbGFzc09mIiwiX0Jhc2VOb2RlIiwiQ29tcG9uZW50IiwibWF5VXNlZEluUGVyc2lzdFJvb3QiLCJOb2RlIiwiRnVuY3Rpb24iLCJqb2luIiwic2hvdWxkQ29weUlkIiwic2hvdWxkQ29weVJhd0RhdGEiLCJzaW1wbGVQcm9wcyIsInNpbXBsZVByb3BzVG9SZWFkIiwiYWR2YW5jZWRQcm9wcyIsImFkdmFuY2VkUHJvcHNUb1JlYWQiLCJhZHZhbmNlZFByb3BzVXNlVXJsIiwiYWR2YW5jZWRQcm9wc1ZhbHVlVHlwZSIsInNsaWNlIiwiY29uc3RydWN0b3IiLCJzIiwibyIsImQiLCJrIiwidCIsInZhbHVlVHlwZUN0b3IiLCJfZGVzZXJpYWxpemVUeXBlZE9iamVjdCIsIl9kZXNlcmlhbGl6ZU9iakZpZWxkIiwiX2lkIiwiXyRlcmlhbGl6ZWQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJfZGVzZXJpYWxpemVQcmltaXRpdmVPYmplY3QiLCJ1bmxpbmtVbnVzZWRQcmVmYWIiLCJzZXJpYWxpemVkIiwiYXNzZXQiLCJfX3V1aWRfXyIsImxhc3QiLCJyZXN1bHQiLCJwb3AiLCJfZGVzZXJpYWxpemVGaXJlQ2xhc3MiLCJ0YXJnZXQiLCJkZXNlcmlhbGl6ZSIsImhhc093blByb3BlcnR5IiwiX19kZXNlcmlhbGl6ZV9fIiwidmFsdWUiLCJfUHJlZmFiSW5mbyIsInN5bmMiLCJfRGVzZXJpYWxpemVyIiwiY2xhc3NGaW5kZXIiLCJjdXN0b21FbnYiLCJpZ25vcmVFZGl0b3JPbmx5IiwiZGVzZXJpYWxpemVkRGF0YSIsIl90YXJnZXQiLCJERVYiLCJqc29uT2JqIiwiQXJyYXkiLCJpc0FycmF5IiwianNvbkFycmF5IiwicmVmQ291bnQiLCJtYWluVGFyZ2V0IiwiX2Rlc2VyaWFsaXplT2JqZWN0Iiwib3duZXIiLCJ0eXBlIiwiX190eXBlX18iLCJhcnJheSIsIndpbmRvdyIsImN0b3IiLCJkZXNlcmlhbGl6ZUJ5VHlwZSIsIl9kZXNlcmlhbGl6ZSIsImNvbnRlbnQiLCJDbGFzcyIsIl9pc0NDQ2xhc3MiLCJjaGVja0Rlc2VyaWFsaXplQnlUeXBlIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsIm5hbWUiLCJzdGFjayIsIk1pc3NpbmdTY3JpcHQiLCJnZXRNaXNzaW5nV3JhcHBlciIsInJlcG9ydE1pc3NpbmdDbGFzcyIsIm5vdFJlcG9ydGVkIiwiX2dldENsYXNzQnlJZCIsIl9faWRfXyIsImRPYmoiLCJpbnN0YW5jZSIsIlZlYzIiLCJ4IiwieSIsIlZlYzMiLCJ6IiwiQ29sb3IiLCJyIiwiZyIsImIiLCJhIiwiU2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiZmFzdERlZmluZWRQcm9wcyIsIl9fcHJvcHNfXyIsIk9iamVjdCIsImtleXMiLCJjYWNoZSIsImRhdGEiLCJkZXRhaWxzIiwib3B0aW9ucyIsImNyZWF0ZUFzc2V0UmVmcyIsInN5cyIsInBsYXRmb3JtIiwiRURJVE9SX0NPUkUiLCJ0ZW1wRGV0YWlscyIsImRlc2VyaWFsaXplciIsImdhbWUiLCJfaXNDbG9uaW5nIiwicmVzIiwicHV0IiwiRWRpdG9yRXh0ZW5kcyIsInNlcmlhbGl6ZSIsImFzQXNzZXQiLCJVdWlkVXRpbHMiLCJpc1V1aWQiLCJkZWNvbXByZXNzVXVpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNBO0FBRUE7O0FBRUE7Ozs7OztNQU1hQSxPO0FBVVQsdUJBQWU7QUFBQTs7QUFBQTs7QUFBQSxXQUxSQyxRQUtRO0FBQUEsV0FKUkMsV0FJUTtBQUFBLFdBSFJDLFlBR1E7QUFBQSxXQUZQQyxZQUVP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R0FBaUMsVUFBQ2hJLEVBQUQsRUFBUTtBQUNyQyxRQUFJN0IsNEJBQVVrTSxhQUFhLENBQUNHLFNBQWQsQ0FBd0JDLE1BQXhCLENBQStCekssRUFBL0IsQ0FBZCxFQUFrRDtBQUM5Q0EsTUFBQUEsRUFBRSxHQUFHcUssYUFBYSxDQUFDRyxTQUFkLENBQXdCRSxjQUF4QixDQUF1QzFLLEVBQXZDLENBQUw7QUFDQSx5QkFBTyxJQUFQLEVBQWFBLEVBQWI7QUFDSCxLQUhELE1BSUs7QUFDRCx5QkFBTyxJQUFQLEVBQWFBLEVBQWI7QUFDSDtBQUNKLEdBUkQ7O0FBVUF5RixFQUFBQSxXQUFXLENBQUNNLGFBQVosR0FBNEJBLGFBQTVCO0FBQ0F2RiwwQkFBU2lGLFdBQVQsR0FBdUJBLFdBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyB3YXJuSUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCAqIGFzIGpzIGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0ICogYXMgbWlzYyBmcm9tICcuLi91dGlscy9taXNjJztcclxuaW1wb3J0IHsgQ0NDbGFzcyB9IGZyb20gJy4vY2xhc3MnO1xyXG5pbXBvcnQgKiBhcyBBdHRyIGZyb20gJy4vdXRpbHMvYXR0cmlidXRlJztcclxuaW1wb3J0IE1pc3NpbmdTY3JpcHQgZnJvbSAnLi4vY29tcG9uZW50cy9taXNzaW5nLXNjcmlwdCc7XHJcbmltcG9ydCB7IEVESVRPUiwgVEVTVCwgREVWLCBKU0IsIFBSRVZJRVcsIFNVUFBPUlRfSklUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vLyBIRUxQRVJTXHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcclxuXHJcbi8qKlxyXG4gKiBAZW4gQ29udGFpbnMgaW5mb3JtYXRpb24gY29sbGVjdGVkIGR1cmluZyBkZXNlcmlhbGl6YXRpb25cclxuICogQHpoIOWMheWQq+WPjeW6j+WIl+WMluaXtueahOS4gOS6m+S/oeaBr+OAglxyXG4gKiBAY2xhc3MgRGV0YWlsc1xyXG4gKlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERldGFpbHMge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcG9vbDoganMuUG9vbDx7fT47XHJcblxyXG4gICAgcHVibGljIGFzc2lnbkFzc2V0c0J5ITogRnVuY3Rpb247XHJcbiAgICBwdWJsaWMgdXVpZExpc3Q6IHN0cmluZ1tdO1xyXG4gICAgcHVibGljIHV1aWRPYmpMaXN0OiBvYmplY3RbXTtcclxuICAgIHB1YmxpYyB1dWlkUHJvcExpc3Q6IHN0cmluZ1tdO1xyXG4gICAgcHJpdmF0ZSBfc3RpbGxVc2VVcmw6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogbGlzdCBvZiB0aGUgZGVwZW5kcyBhc3NldHMnIHV1aWRcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnV1aWRMaXN0ID0gW107XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdGhlIG9iaiBsaXN0IHdob3NlIGZpZWxkIG5lZWRzIHRvIGxvYWQgYXNzZXQgYnkgdXVpZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudXVpZE9iakxpc3QgPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0aGUgY29ycmVzcG9uZGluZyBmaWVsZCBuYW1lIHdoaWNoIHJlZmVyZW5jZWQgdG8gdGhlIGFzc2V0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy51dWlkUHJvcExpc3QgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gVE9ETyAtIERFTE1FIHNpbmNlIDIuMFxyXG4gICAgICAgIHRoaXMuX3N0aWxsVXNlVXJsID0ganMuY3JlYXRlTWFwKHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoRURJVE9SIHx8IFRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5hc3NpZ25Bc3NldHNCeSA9IChnZXR0ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZSB0aGlzLl9zdGlsbFVzZVVybFxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMudXVpZExpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1dWlkID0gdGhpcy51dWlkTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvYmogPSB0aGlzLnV1aWRPYmpMaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3AgPSB0aGlzLnV1aWRQcm9wTGlzdFtpXTtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBnZXR0ZXIodXVpZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDph43nva7jgIJcclxuICAgICAqIEBtZXRob2QgcmVzZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0ICgpIHtcclxuICAgICAgICB0aGlzLnV1aWRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy51dWlkT2JqTGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMudXVpZFByb3BMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAganMuY2xlYXIodGhpcy5fc3RpbGxVc2VVcmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC8qKlxyXG4gICAgLy8gICogQG1ldGhvZCBnZXRVdWlkT2ZcclxuICAgIC8vICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICAgIC8vICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wTmFtZVxyXG4gICAgLy8gICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgLy8gICovXHJcbiAgICAvLyBnZXRVdWlkT2YgKG9iaiwgcHJvcE5hbWUpIHtcclxuICAgIC8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudXVpZE9iakxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vICAgICAgICAgaWYgKHRoaXMudXVpZE9iakxpc3RbaV0gPT09IG9iaiAmJiB0aGlzLnV1aWRQcm9wTGlzdFtpXSA9PT0gcHJvcE5hbWUpIHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVybiB0aGlzLnV1aWRMaXN0W2ldO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHJldHVybiBcIlwiO1xyXG4gICAgLy8gfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWV0aG9kIHB1c2hcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wTmFtZVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHV1aWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHB1c2ggKG9iajogT2JqZWN0LCBwcm9wTmFtZTogc3RyaW5nLCB1dWlkOiBzdHJpbmcsIF9zdGlsbFVzZVVybDogYW55KSB7XHJcbiAgICAgICAgaWYgKF9zdGlsbFVzZVVybCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGlsbFVzZVVybFt0aGlzLnV1aWRMaXN0Lmxlbmd0aF0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnV1aWRMaXN0LnB1c2godXVpZCk7XHJcbiAgICAgICAgdGhpcy51dWlkT2JqTGlzdC5wdXNoKG9iaik7XHJcbiAgICAgICAgdGhpcy51dWlkUHJvcExpc3QucHVzaChwcm9wTmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkRldGFpbHMucG9vbCA9IG5ldyBqcy5Qb29sKChvYmo6IGFueSkgPT4ge1xyXG4gICAgb2JqLnJlc2V0KCk7XHJcbn0sIDEwKTtcclxuXHJcbkRldGFpbHMucG9vbC5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZ2V0KCkgfHwgbmV3IERldGFpbHMoKTtcclxufTtcclxuXHJcbi8vIElNUExFTUVOVCBPRiBERVNFUklBTElaQVRJT05cclxuXHJcbmZ1bmN0aW9uIF9kZXJlZmVyZW5jZSAoc2VsZikge1xyXG4gICAgLy8g6L+Z6YeM5LiN6YeH55So6YGN5Y6G5Y+N5bqP5YiX5YyW57uT5p6c55qE5pa55byP77yM5Zug5Li65Y+N5bqP5YiX5YyW55qE57uT5p6c5aaC5p6c5byV55So5Yiw5aSN5p2C55qE5aSW6YOo5bqT77yM5b6I5a655piT5aCG5qCI5rqi5Ye644CCXHJcbiAgICBjb25zdCBkZXNlcmlhbGl6ZWRMaXN0ID0gc2VsZi5kZXNlcmlhbGl6ZWRMaXN0O1xyXG4gICAgY29uc3QgaWRQcm9wTGlzdCA9IHNlbGYuX2lkUHJvcExpc3Q7XHJcbiAgICBjb25zdCBpZExpc3QgPSBzZWxmLl9pZExpc3Q7XHJcbiAgICBjb25zdCBpZE9iakxpc3QgPSBzZWxmLl9pZE9iakxpc3Q7XHJcbiAgICBjb25zdCBvbkRlcmVmZXJlbmNlZCA9IHNlbGYuX2NsYXNzRmluZGVyICYmIHNlbGYuX2NsYXNzRmluZGVyLm9uRGVyZWZlcmVuY2VkO1xyXG4gICAgbGV0IGk7XHJcbiAgICBsZXQgcHJvcE5hbWU7XHJcbiAgICBsZXQgaWQ7XHJcbiAgICBpZiAoRURJVE9SICYmIG9uRGVyZWZlcmVuY2VkKSB7XHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGlkTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwcm9wTmFtZSA9IGlkUHJvcExpc3RbaV07XHJcbiAgICAgICAgICAgIGlkID0gaWRMaXN0W2ldO1xyXG4gICAgICAgICAgICBpZE9iakxpc3RbaV1bcHJvcE5hbWVdID0gZGVzZXJpYWxpemVkTGlzdFtpZF07XHJcbiAgICAgICAgICAgIG9uRGVyZWZlcmVuY2VkKGRlc2VyaWFsaXplZExpc3QsIGlkLCBpZE9iakxpc3RbaV0sIHByb3BOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaWRMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHByb3BOYW1lID0gaWRQcm9wTGlzdFtpXTtcclxuICAgICAgICAgICAgaWQgPSBpZExpc3RbaV07XHJcbiAgICAgICAgICAgIGlkT2JqTGlzdFtpXVtwcm9wTmFtZV0gPSBkZXNlcmlhbGl6ZWRMaXN0W2lkXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbXBpbGVPYmplY3RUeXBlSml0IChzb3VyY2VzLCBkZWZhdWx0VmFsdWUsIGFjY2Vzc29yVG9TZXQsIHByb3BOYW1lTGl0ZXJhbFRvU2V0LCBhc3N1bWVIYXZlUHJvcElmSXNWYWx1ZSwgc3RpbGxVc2VVcmwpIHtcclxuICAgIGlmIChkZWZhdWx0VmFsdWUgaW5zdGFuY2VvZiBsZWdhY3lDQy5WYWx1ZVR5cGUpIHtcclxuICAgICAgICAvLyBmYXN0IGNhc2VcclxuICAgICAgICBpZiAoIWFzc3VtZUhhdmVQcm9wSWZJc1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIHNvdXJjZXMucHVzaCgnaWYocHJvcCl7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGN0b3JDb2RlID0ganMuZ2V0Q2xhc3NOYW1lKGRlZmF1bHRWYWx1ZSk7XHJcbiAgICAgICAgc291cmNlcy5wdXNoKGBzLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0KG8ke2FjY2Vzc29yVG9TZXR9LHByb3AsJHtjdG9yQ29kZX0pO2ApO1xyXG4gICAgICAgIGlmICghYXNzdW1lSGF2ZVByb3BJZklzVmFsdWUpIHtcclxuICAgICAgICAgICAgc291cmNlcy5wdXNoKCd9ZWxzZSBvJyArIGFjY2Vzc29yVG9TZXQgKyAnPW51bGw7Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc291cmNlcy5wdXNoKCdpZihwcm9wKXsnKTtcclxuICAgICAgICBzb3VyY2VzLnB1c2goJ3MuX2Rlc2VyaWFsaXplT2JqRmllbGQobyxwcm9wLCcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BOYW1lTGl0ZXJhbFRvU2V0ICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKEVESVRPUiB8fCBURVNUKSA/ICcsdCYmbywnIDogJyxudWxsLCcpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAhIXN0aWxsVXNlVXJsICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICcpOycpO1xyXG4gICAgICAgIHNvdXJjZXMucHVzaCgnfWVsc2UgbycgKyBhY2Nlc3NvclRvU2V0ICsgJz1udWxsOycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjb21waWxlRGVzZXJpYWxpemUgPSBTVVBQT1JUX0pJVCA/IChzZWxmLCBrbGFzcykgPT4ge1xyXG4gICAgY29uc3QgVFlQRSA9IEF0dHIuREVMSU1FVEVSICsgJ3R5cGUnO1xyXG4gICAgY29uc3QgRURJVE9SX09OTFkgPSBBdHRyLkRFTElNRVRFUiArICdlZGl0b3JPbmx5JztcclxuICAgIGNvbnN0IERFRkFVTFQgPSBBdHRyLkRFTElNRVRFUiArICdkZWZhdWx0JztcclxuICAgIGNvbnN0IFNBVkVfVVJMX0FTX0FTU0VUID0gQXR0ci5ERUxJTUVURVIgKyAnc2F2ZVVybEFzQXNzZXQnO1xyXG4gICAgY29uc3QgRk9STUVSTFlfU0VSSUFMSVpFRF9BUyA9IEF0dHIuREVMSU1FVEVSICsgJ2Zvcm1lcmx5U2VyaWFsaXplZEFzJztcclxuICAgIGNvbnN0IGF0dHJzID0gQXR0ci5nZXRDbGFzc0F0dHJzKGtsYXNzKTtcclxuXHJcbiAgICBjb25zdCBwcm9wcyA9IGtsYXNzLl9fdmFsdWVzX187XHJcbiAgICAvLyBzZWxmLCBvYmosIHNlcmlhbGl6ZWREYXRhLCBrbGFzcywgdGFyZ2V0XHJcbiAgICBjb25zdCBzb3VyY2VzID0gW1xyXG4gICAgICAgICd2YXIgcHJvcDsnLFxyXG4gICAgXTtcclxuICAgIGNvbnN0IGZhc3RNb2RlID0gbWlzYy5CVUlMVElOX0NMQVNTSURfUkUudGVzdChqcy5fZ2V0Q2xhc3NJZChrbGFzcykpO1xyXG4gICAgLy8gc291cmNlcy5wdXNoKCd2YXIgdmIsdm4sdnMsdm8sdnUsdmY7Jyk7ICAgIC8vIGJvb2xlYW4sIG51bWJlciwgc3RyaW5nLCBvYmplY3QsIHVuZGVmaW5lZCwgZnVuY3Rpb25cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxyXG4gICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgIGNvbnN0IHByb3BOYW1lID0gcHJvcHNbcF07XHJcbiAgICAgICAgaWYgKChQUkVWSUVXIHx8IChFRElUT1IgJiYgc2VsZi5faWdub3JlRWRpdG9yT25seSkpICYmIGF0dHJzW3Byb3BOYW1lICsgRURJVE9SX09OTFldKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlOyAgIC8vIHNraXAgZWRpdG9yIG9ubHkgaWYgaW4gcHJldmlld1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGFjY2Vzc29yVG9TZXQ7XHJcbiAgICAgICAgbGV0IHByb3BOYW1lTGl0ZXJhbFRvU2V0O1xyXG4gICAgICAgIGlmIChDQ0NsYXNzLklERU5USUZJRVJfUkUudGVzdChwcm9wTmFtZSkpIHtcclxuICAgICAgICAgICAgcHJvcE5hbWVMaXRlcmFsVG9TZXQgPSAnXCInICsgcHJvcE5hbWUgKyAnXCInO1xyXG4gICAgICAgICAgICBhY2Nlc3NvclRvU2V0ID0gJy4nICsgcHJvcE5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwcm9wTmFtZUxpdGVyYWxUb1NldCA9IENDQ2xhc3MuZXNjYXBlRm9ySlMocHJvcE5hbWUpO1xyXG4gICAgICAgICAgICBhY2Nlc3NvclRvU2V0ID0gJ1snICsgcHJvcE5hbWVMaXRlcmFsVG9TZXQgKyAnXSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYWNjZXNzb3JUb0dldCA9IGFjY2Vzc29yVG9TZXQ7XHJcbiAgICAgICAgaWYgKGF0dHJzW3Byb3BOYW1lICsgRk9STUVSTFlfU0VSSUFMSVpFRF9BU10pIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvcE5hbWVUb1JlYWQgPSBhdHRyc1twcm9wTmFtZSArIEZPUk1FUkxZX1NFUklBTElaRURfQVNdO1xyXG4gICAgICAgICAgICBpZiAoQ0NDbGFzcy5JREVOVElGSUVSX1JFLnRlc3QocHJvcE5hbWVUb1JlYWQpKSB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NvclRvR2V0ID0gJy4nICsgcHJvcE5hbWVUb1JlYWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NvclRvR2V0ID0gJ1snICsgQ0NDbGFzcy5lc2NhcGVGb3JKUyhwcm9wTmFtZVRvUmVhZCkgKyAnXSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNvdXJjZXMucHVzaCgncHJvcD1kJyArIGFjY2Vzc29yVG9HZXQgKyAnOycpO1xyXG4gICAgICAgIHNvdXJjZXMucHVzaChgaWYodHlwZW9mICR7SlNCID8gJyhwcm9wKScgOiAncHJvcCd9IT09XCJ1bmRlZmluZWRcIil7YCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0aWxsVXNlVXJsID0gYXR0cnNbcHJvcE5hbWUgKyBTQVZFX1VSTF9BU19BU1NFVF07XHJcbiAgICAgICAgLy8gZnVuY3Rpb24gdW5kZWZpbmVkIG9iamVjdChudWxsKSBzdHJpbmcgYm9vbGVhbiBudW1iZXJcclxuICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBDQ0NsYXNzLmdldERlZmF1bHQoYXR0cnNbcHJvcE5hbWUgKyBERUZBVUxUXSk7XHJcbiAgICAgICAgaWYgKGZhc3RNb2RlKSB7XHJcbiAgICAgICAgICAgIGxldCBpc1ByaW1pdGl2ZVR5cGU7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJUeXBlID0gYXR0cnNbcHJvcE5hbWUgKyBUWVBFXTtcclxuICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIHVzZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBpc1ByaW1pdGl2ZVR5cGUgPSB1c2VyVHlwZSA9PT0gbGVnYWN5Q0MuU3RyaW5nIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyVHlwZSA9PT0gbGVnYWN5Q0MuSW50ZWdlciB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlclR5cGUgPT09IGxlZ2FjeUNDLkZsb2F0IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyVHlwZSA9PT0gbGVnYWN5Q0MuQm9vbGVhbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRUeXBlID0gdHlwZW9mIGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlzUHJpbWl0aXZlVHlwZSA9IChkZWZhdWx0VHlwZSA9PT0gJ3N0cmluZycgJiYgIXN0aWxsVXNlVXJsKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFR5cGUgPT09ICdudW1iZXInIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VHlwZSA9PT0gJ2Jvb2xlYW4nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNQcmltaXRpdmVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VzLnB1c2goYG8ke2FjY2Vzc29yVG9TZXR9PXByb3A7YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb21waWxlT2JqZWN0VHlwZUppdChzb3VyY2VzLCBkZWZhdWx0VmFsdWUsIGFjY2Vzc29yVG9TZXQsIHByb3BOYW1lTGl0ZXJhbFRvU2V0LCB0cnVlLCBzdGlsbFVzZVVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNvdXJjZXMucHVzaChgaWYodHlwZW9mICR7SlNCID8gJyhwcm9wKScgOiAncHJvcCd9IT09XCJvYmplY3RcIil7YCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ28nICsgYWNjZXNzb3JUb1NldCArICc9cHJvcDsnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICd9ZWxzZXsnKTtcclxuICAgICAgICAgICAgY29tcGlsZU9iamVjdFR5cGVKaXQoc291cmNlcywgZGVmYXVsdFZhbHVlLCBhY2Nlc3NvclRvU2V0LCBwcm9wTmFtZUxpdGVyYWxUb1NldCwgZmFsc2UsIHN0aWxsVXNlVXJsKTtcclxuICAgICAgICAgICAgc291cmNlcy5wdXNoKCd9Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNvdXJjZXMucHVzaCgnfScpO1xyXG4gICAgfVxyXG4gICAgaWYgKGxlZ2FjeUNDLmpzLmlzQ2hpbGRDbGFzc09mKGtsYXNzLCBsZWdhY3lDQy5fQmFzZU5vZGUpIHx8IGxlZ2FjeUNDLmpzLmlzQ2hpbGRDbGFzc09mKGtsYXNzLCBsZWdhY3lDQy5Db21wb25lbnQpKSB7XHJcbiAgICAgICAgaWYgKFBSRVZJRVcgfHwgKEVESVRPUiAmJiBzZWxmLl9pZ25vcmVFZGl0b3JPbmx5KSkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXlVc2VkSW5QZXJzaXN0Um9vdCA9IGpzLmlzQ2hpbGRDbGFzc09mKGtsYXNzLCBsZWdhY3lDQy5Ob2RlKTtcclxuICAgICAgICAgICAgaWYgKG1heVVzZWRJblBlcnNpc3RSb290KSB7XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VzLnB1c2goJ2QuX2lkJiYoby5faWQ9ZC5faWQpOycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goJ2QuX2lkJiYoby5faWQ9ZC5faWQpOycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwcm9wc1twcm9wcy5sZW5ndGggLSAxXSA9PT0gJ18kZXJpYWxpemVkJykge1xyXG4gICAgICAgIC8vIGRlZXAgY29weSBvcmlnaW5hbCBzZXJpYWxpemVkIGRhdGFcclxuICAgICAgICBzb3VyY2VzLnB1c2goJ28uXyRlcmlhbGl6ZWQ9SlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkKSk7Jyk7XHJcbiAgICAgICAgLy8gcGFyc2UgdGhlIHNlcmlhbGl6ZWQgZGF0YSBhcyBwcmltaXRpdmUgamF2YXNjcmlwdCBvYmplY3QsIHNvIGl0cyBfX2lkX18gd2lsbCBiZSBkZXJlZmVyZW5jZWRcclxuICAgICAgICBzb3VyY2VzLnB1c2goJ3MuX2Rlc2VyaWFsaXplUHJpbWl0aXZlT2JqZWN0KG8uXyRlcmlhbGl6ZWQsZCk7Jyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gRnVuY3Rpb24oJ3MnLCAnbycsICdkJywgJ2snLCAndCcsIHNvdXJjZXMuam9pbignJykpO1xyXG59IDogKHNlbGYsIGtsYXNzKSA9PiB7XHJcbiAgICBjb25zdCBmYXN0TW9kZSA9IG1pc2MuQlVJTFRJTl9DTEFTU0lEX1JFLnRlc3QoanMuX2dldENsYXNzSWQoa2xhc3MpKTtcclxuICAgIGNvbnN0IHNob3VsZENvcHlJZCA9IGxlZ2FjeUNDLmpzLmlzQ2hpbGRDbGFzc09mKGtsYXNzLCBsZWdhY3lDQy5fQmFzZU5vZGUpIHx8IGxlZ2FjeUNDLmpzLmlzQ2hpbGRDbGFzc09mKGtsYXNzLCBsZWdhY3lDQy5Db21wb25lbnQpO1xyXG4gICAgbGV0IHNob3VsZENvcHlSYXdEYXRhO1xyXG5cclxuICAgIGNvbnN0IHNpbXBsZVByb3BzOiBhbnkgPSBbXTtcclxuICAgIGxldCBzaW1wbGVQcm9wc1RvUmVhZCA9IHNpbXBsZVByb3BzO1xyXG4gICAgY29uc3QgYWR2YW5jZWRQcm9wczogYW55ID0gW107XHJcbiAgICBsZXQgYWR2YW5jZWRQcm9wc1RvUmVhZCA9IGFkdmFuY2VkUHJvcHM7XHJcbiAgICBjb25zdCBhZHZhbmNlZFByb3BzVXNlVXJsOiBhbnkgPSBbXTtcclxuICAgIGNvbnN0IGFkdmFuY2VkUHJvcHNWYWx1ZVR5cGU6IGFueSA9IFtdO1xyXG5cclxuICAgICgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSBrbGFzcy5fX3ZhbHVlc19fO1xyXG4gICAgICAgIHNob3VsZENvcHlSYXdEYXRhID0gcHJvcHNbcHJvcHMubGVuZ3RoIC0gMV0gPT09ICdfJGVyaWFsaXplZCc7XHJcblxyXG4gICAgICAgIGNvbnN0IGF0dHJzID0gQXR0ci5nZXRDbGFzc0F0dHJzKGtsYXNzKTtcclxuICAgICAgICBjb25zdCBUWVBFID0gQXR0ci5ERUxJTUVURVIgKyAndHlwZSc7XHJcbiAgICAgICAgY29uc3QgREVGQVVMVCA9IEF0dHIuREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xyXG4gICAgICAgIGNvbnN0IFNBVkVfVVJMX0FTX0FTU0VUID0gQXR0ci5ERUxJTUVURVIgKyAnc2F2ZVVybEFzQXNzZXQnO1xyXG4gICAgICAgIGNvbnN0IEZPUk1FUkxZX1NFUklBTElaRURfQVMgPSBBdHRyLkRFTElNRVRFUiArICdmb3JtZXJseVNlcmlhbGl6ZWRBcyc7XHJcblxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxyXG4gICAgICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvcE5hbWUgPSBwcm9wc1twXTtcclxuICAgICAgICAgICAgbGV0IHByb3BOYW1lVG9SZWFkID0gcHJvcE5hbWU7XHJcbiAgICAgICAgICAgIGlmIChhdHRyc1twcm9wTmFtZSArIEZPUk1FUkxZX1NFUklBTElaRURfQVNdKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wTmFtZVRvUmVhZCA9IGF0dHJzW3Byb3BOYW1lICsgRk9STUVSTFlfU0VSSUFMSVpFRF9BU107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc3RpbGxVc2VVcmwgPSBhdHRyc1twcm9wTmFtZSArIFNBVkVfVVJMX0FTX0FTU0VUXTtcclxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gdW5kZWZpbmVkIG9iamVjdChudWxsKSBzdHJpbmcgYm9vbGVhbiBudW1iZXJcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gQ0NDbGFzcy5nZXREZWZhdWx0KGF0dHJzW3Byb3BOYW1lICsgREVGQVVMVF0pO1xyXG4gICAgICAgICAgICBsZXQgaXNQcmltaXRpdmVUeXBlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChmYXN0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlclR5cGUgPSBhdHRyc1twcm9wTmFtZSArIFRZUEVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIHVzZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNQcmltaXRpdmVUeXBlID0gdXNlclR5cGUgPT09IGxlZ2FjeUNDLlN0cmluZyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJUeXBlID09PSBsZWdhY3lDQy5JbnRlZ2VyIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlclR5cGUgPT09IGxlZ2FjeUNDLkZsb2F0IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlclR5cGUgPT09IGxlZ2FjeUNDLkJvb2xlYW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0VHlwZSA9IHR5cGVvZiBkZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNQcmltaXRpdmVUeXBlID0gKGRlZmF1bHRUeXBlID09PSAnc3RyaW5nJyAmJiAhc3RpbGxVc2VVcmwpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFR5cGUgPT09ICdudW1iZXInIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFR5cGUgPT09ICdib29sZWFuJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmFzdE1vZGUgJiYgaXNQcmltaXRpdmVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcE5hbWVUb1JlYWQgIT09IHByb3BOYW1lICYmIHNpbXBsZVByb3BzVG9SZWFkID09PSBzaW1wbGVQcm9wcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbXBsZVByb3BzVG9SZWFkID0gc2ltcGxlUHJvcHMuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNpbXBsZVByb3BzLnB1c2gocHJvcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNpbXBsZVByb3BzVG9SZWFkICE9PSBzaW1wbGVQcm9wcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNpbXBsZVByb3BzVG9SZWFkLnB1c2gocHJvcE5hbWVUb1JlYWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lVG9SZWFkICE9PSBwcm9wTmFtZSAmJiBhZHZhbmNlZFByb3BzVG9SZWFkID09PSBhZHZhbmNlZFByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWRQcm9wc1RvUmVhZCA9IGFkdmFuY2VkUHJvcHMuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGFkdmFuY2VkUHJvcHMucHVzaChwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWR2YW5jZWRQcm9wc1RvUmVhZCAhPT0gYWR2YW5jZWRQcm9wcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VkUHJvcHNUb1JlYWQucHVzaChwcm9wTmFtZVRvUmVhZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhZHZhbmNlZFByb3BzVXNlVXJsLnB1c2goc3RpbGxVc2VVcmwpO1xyXG4gICAgICAgICAgICAgICAgYWR2YW5jZWRQcm9wc1ZhbHVlVHlwZS5wdXNoKChkZWZhdWx0VmFsdWUgaW5zdGFuY2VvZiBsZWdhY3lDQy5WYWx1ZVR5cGUpICYmIGRlZmF1bHRWYWx1ZS5jb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIHJldHVybiAocywgbywgZCwgaywgdCkgPT4ge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltcGxlUHJvcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJvcCA9IGRbc2ltcGxlUHJvcHNUb1JlYWRbaV1dO1xyXG4gICAgICAgICAgICBpZiAocHJvcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBvW3NpbXBsZVByb3BzW2ldXSA9IHByb3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZHZhbmNlZFByb3BzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BOYW1lID0gYWR2YW5jZWRQcm9wc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgcHJvcCA9IGRbYWR2YW5jZWRQcm9wc1RvUmVhZFtpXV07XHJcbiAgICAgICAgICAgIGlmIChwcm9wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghZmFzdE1vZGUgJiYgdHlwZW9mIHByb3AgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBvW3Byb3BOYW1lXSA9IHByb3A7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBmYXN0TW9kZSAoc28gd2lsbCBub3Qgc2ltcGxlUHJvcCkgb3Igb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZVR5cGVDdG9yID0gYWR2YW5jZWRQcm9wc1ZhbHVlVHlwZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVR5cGVDdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZhc3RNb2RlIHx8IHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5fZGVzZXJpYWxpemVUeXBlZE9iamVjdChvW3Byb3BOYW1lXSwgcHJvcCwgdmFsdWVUeXBlQ3Rvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvW3Byb3BOYW1lXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcy5fZGVzZXJpYWxpemVPYmpGaWVsZChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoRURJVE9SIHx8IFRFU1QpID8gKHQgJiYgbykgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWR2YW5jZWRQcm9wc1VzZVVybFtpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9bcHJvcE5hbWVdID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNob3VsZENvcHlJZCAmJiBkLl9pZCkge1xyXG4gICAgICAgICAgICBvLl9pZCA9IGQuX2lkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hvdWxkQ29weVJhd0RhdGEpIHtcclxuICAgICAgICAgICAgLy8gZGVlcCBjb3B5IG9yaWdpbmFsIHNlcmlhbGl6ZWQgZGF0YVxyXG4gICAgICAgICAgICBvLl8kZXJpYWxpemVkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkKSk7XHJcbiAgICAgICAgICAgIC8vIHBhcnNlIHRoZSBzZXJpYWxpemVkIGRhdGEgYXMgcHJpbWl0aXZlIGphdmFzY3JpcHQgb2JqZWN0LCBzbyBpdHMgX19pZF9fIHdpbGwgYmUgZGVyZWZlcmVuY2VkXHJcbiAgICAgICAgICAgIHMuX2Rlc2VyaWFsaXplUHJpbWl0aXZlT2JqZWN0KG8uXyRlcmlhbGl6ZWQsIGQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcblxyXG5mdW5jdGlvbiB1bmxpbmtVbnVzZWRQcmVmYWIgKHNlbGYsIHNlcmlhbGl6ZWQsIG9iaikge1xyXG4gICAgY29uc3QgdXVpZCA9IHNlcmlhbGl6ZWQuYXNzZXQgJiYgc2VyaWFsaXplZC5hc3NldC5fX3V1aWRfXztcclxuICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IHNlbGYucmVzdWx0LnV1aWRMaXN0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgaWYgKHNlbGYucmVzdWx0LnV1aWRMaXN0W2xhc3RdID09PSB1dWlkICYmXHJcbiAgICAgICAgICAgIHNlbGYucmVzdWx0LnV1aWRPYmpMaXN0W2xhc3RdID09PSBvYmogJiZcclxuICAgICAgICAgICAgc2VsZi5yZXN1bHQudXVpZFByb3BMaXN0W2xhc3RdID09PSAnYXNzZXQnKSB7XHJcbiAgICAgICAgICAgIHNlbGYucmVzdWx0LnV1aWRMaXN0LnBvcCgpO1xyXG4gICAgICAgICAgICBzZWxmLnJlc3VsdC51dWlkT2JqTGlzdC5wb3AoKTtcclxuICAgICAgICAgICAgc2VsZi5yZXN1bHQudXVpZFByb3BMaXN0LnBvcCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdhcm5JRCg0OTM1KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9kZXNlcmlhbGl6ZUZpcmVDbGFzcyAoc2VsZiwgb2JqLCBzZXJpYWxpemVkLCBrbGFzcywgdGFyZ2V0KSB7XHJcbiAgICBsZXQgZGVzZXJpYWxpemU7XHJcbiAgICBpZiAoa2xhc3MuaGFzT3duUHJvcGVydHkoJ19fZGVzZXJpYWxpemVfXycpKSB7XHJcbiAgICAgICAgZGVzZXJpYWxpemUgPSBrbGFzcy5fX2Rlc2VyaWFsaXplX187XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkZXNlcmlhbGl6ZSA9IGNvbXBpbGVEZXNlcmlhbGl6ZShzZWxmLCBrbGFzcyk7XHJcbiAgICAgICAgLy8gaWYgKFRFU1QgJiYgIWlzUGhhbnRvbUpTKSB7XHJcbiAgICAgICAgLy8gICAgIGxvZyhkZXNlcmlhbGl6ZSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGpzLnZhbHVlKGtsYXNzLCAnX19kZXNlcmlhbGl6ZV9fJywgZGVzZXJpYWxpemUsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgZGVzZXJpYWxpemUoc2VsZiwgb2JqLCBzZXJpYWxpemVkLCBrbGFzcywgdGFyZ2V0KTtcclxuICAgIC8vIGlmIHByZXZpZXcgb3IgYnVpbGQgd29ya2VyXHJcbiAgICBpZiAoUFJFVklFVyB8fCAoRURJVE9SICYmIHNlbGYuX2lnbm9yZUVkaXRvck9ubHkpKSB7XHJcbiAgICAgICAgaWYgKGtsYXNzID09PSBsZWdhY3lDQy5fUHJlZmFiSW5mbyAmJiAhb2JqLnN5bmMpIHtcclxuICAgICAgICAgICAgdW5saW5rVW51c2VkUHJlZmFiKHNlbGYsIHNlcmlhbGl6ZWQsIG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBmdW5jdGlvbiBfY29tcGlsZVR5cGVkT2JqZWN0IChhY2Nlc3Nvciwga2xhc3MsIGN0b3JDb2RlKSB7XHJcbi8vICAgICBpZiAoa2xhc3MgPT09IGNjLlZlYzIpIHtcclxuLy8gICAgICAgICByZXR1cm4gYHtgICtcclxuLy8gICAgICAgICAgICAgICAgICAgICBgbyR7YWNjZXNzb3J9Lng9cHJvcC54fHwwO2AgK1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0ueT1wcm9wLnl8fDA7YCArXHJcbi8vICAgICAgICAgICAgICAgIGB9YDtcclxuLy8gICAgIH1cclxuLy8gICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5Db2xvcikge1xyXG4vLyAgICAgICAgIHJldHVybiBge2AgK1xyXG4vLyAgICAgICAgICAgICAgICAgICAgYG8ke2FjY2Vzc29yfS5yPXByb3Aucnx8MDtgICtcclxuLy8gICAgICAgICAgICAgICAgICAgIGBvJHthY2Nlc3Nvcn0uZz1wcm9wLmd8fDA7YCArXHJcbi8vICAgICAgICAgICAgICAgICAgICBgbyR7YWNjZXNzb3J9LmI9cHJvcC5ifHwwO2AgK1xyXG4vLyAgICAgICAgICAgICAgICAgICAgYG8ke2FjY2Vzc29yfS5hPShwcm9wLmE9PT11bmRlZmluZWQ/MjU1OnByb3AuYSk7YCArXHJcbi8vICAgICAgICAgICAgICAgIGB9YDtcclxuLy8gICAgIH1cclxuLy8gICAgIGVsc2UgaWYgKGtsYXNzID09PSBjYy5TaXplKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIGB7YCArXHJcbi8vICAgICAgICAgICAgICAgICAgICBgbyR7YWNjZXNzb3J9LndpZHRoPXByb3Aud2lkdGh8fDA7YCArXHJcbi8vICAgICAgICAgICAgICAgICAgICBgbyR7YWNjZXNzb3J9LmhlaWdodD1wcm9wLmhlaWdodHx8MDtgICtcclxuLy8gICAgICAgICAgICAgICAgYH1gO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgZWxzZSB7XHJcbi8vICAgICAgICAgcmV0dXJuIGBzLl9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0KG8ke2FjY2Vzc29yfSxwcm9wLCR7Y3RvckNvZGV9KTtgO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGNsYXNzLW5hbWVcclxuZXhwb3J0IGNsYXNzIF9EZXNlcmlhbGl6ZXIge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcG9vbDoganMuUG9vbDx7fT47XHJcbiAgICBwdWJsaWMgcmVzdWx0OiBhbnk7XHJcbiAgICBwdWJsaWMgY3VzdG9tRW52OiBhbnk7XHJcbiAgICBwdWJsaWMgZGVzZXJpYWxpemVkTGlzdDogYW55W107XHJcbiAgICBwdWJsaWMgZGVzZXJpYWxpemVkRGF0YTogYW55O1xyXG4gICAgcHJpdmF0ZSBfY2xhc3NGaW5kZXI6IGFueTtcclxuICAgIHByaXZhdGUgX3RhcmdldDogYW55O1xyXG4gICAgcHJpdmF0ZSBfaWdub3JlRWRpdG9yT25seTogYW55O1xyXG4gICAgcHJpdmF0ZSBfaWRMaXN0OiBhbnlbXTtcclxuICAgIHByaXZhdGUgX2lkT2JqTGlzdDogYW55W107XHJcbiAgICBwcml2YXRlIF9pZFByb3BMaXN0OiBhbnlbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocmVzdWx0LCB0YXJnZXQsIGNsYXNzRmluZGVyLCBjdXN0b21FbnYsIGlnbm9yZUVkaXRvck9ubHkpIHtcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcclxuICAgICAgICB0aGlzLmN1c3RvbUVudiA9IGN1c3RvbUVudjtcclxuICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLmRlc2VyaWFsaXplZERhdGEgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2NsYXNzRmluZGVyID0gY2xhc3NGaW5kZXI7XHJcbiAgICAgICAgaWYgKERFVikge1xyXG4gICAgICAgICAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZUVkaXRvck9ubHkgPSBpZ25vcmVFZGl0b3JPbmx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pZExpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9pZE9iakxpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9pZFByb3BMaXN0ID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc2VyaWFsaXplIChqc29uT2JqKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbk9iaikpIHtcclxuICAgICAgICAgICAgY29uc3QganNvbkFycmF5ID0ganNvbk9iajtcclxuICAgICAgICAgICAgY29uc3QgcmVmQ291bnQgPSBqc29uQXJyYXkubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3QubGVuZ3RoID0gcmVmQ291bnQ7XHJcbiAgICAgICAgICAgIC8vIGRlc2VyaWFsaXplXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVmQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGpzb25BcnJheVtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYWluVGFyZ2V0ID0gKGkgPT09IDAgJiYgdGhpcy5fdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0W2ldID0gdGhpcy5fZGVzZXJpYWxpemVPYmplY3QoanNvbkFycmF5W2ldLCBmYWxzZSwgbWFpblRhcmdldCwgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0LCAnJyArIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0W2ldID0gdGhpcy5fZGVzZXJpYWxpemVPYmplY3QoanNvbkFycmF5W2ldLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGVzZXJpYWxpemVkRGF0YSA9IHJlZkNvdW50ID4gMCA/IHRoaXMuZGVzZXJpYWxpemVkTGlzdFswXSA6IFtdO1xyXG5cclxuICAgICAgICAgICAgLy8vLyBjYWxsYmFja1xyXG4gICAgICAgICAgICAvLyBmb3IgKHZhciBqID0gMDsgaiA8IHJlZkNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgLy8gICAgaWYgKHJlZmVyZW5jZWRMaXN0W2pdLm9uQWZ0ZXJEZXNlcmlhbGl6ZSkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgcmVmZXJlbmNlZExpc3Rbal0ub25BZnRlckRlc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgIC8vICAgIH1cclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWRMaXN0Lmxlbmd0aCA9IDE7XHJcbiAgICAgICAgICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZWREYXRhID0ganNvbk9iaiA/IHRoaXMuX2Rlc2VyaWFsaXplT2JqZWN0KGpzb25PYmosIGZhbHNlLCB0aGlzLl90YXJnZXQsIHRoaXMuZGVzZXJpYWxpemVkTGlzdCwgJzAnKSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZERhdGEgPSBqc29uT2JqID8gdGhpcy5fZGVzZXJpYWxpemVPYmplY3QoanNvbk9iaiwgZmFsc2UpIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRlc2VyaWFsaXplZExpc3RbMF0gPSB0aGlzLmRlc2VyaWFsaXplZERhdGE7XHJcblxyXG4gICAgICAgICAgICAvLy8vIGNhbGxiYWNrXHJcbiAgICAgICAgICAgIC8vIGlmIChkZXNlcmlhbGl6ZWREYXRhLm9uQWZ0ZXJEZXNlcmlhbGl6ZSkge1xyXG4gICAgICAgICAgICAvLyAgICBkZXNlcmlhbGl6ZWREYXRhLm9uQWZ0ZXJEZXNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBkZXJlZmVyZW5jZVxyXG4gICAgICAgIF9kZXJlZmVyZW5jZSh0aGlzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzZXJpYWxpemVkRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXJpYWxpemVkIC0gVGhlIG9iaiB0byBkZXNlcmlhbGl6ZSwgbXVzdCBiZSBub24tbmlsXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IF9zdGlsbFVzZVVybFxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXQ9bnVsbF0gLSBlZGl0b3Igb25seVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvd25lcl0gLSBkZWJ1ZyBvbmx5XHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3Byb3BOYW1lXSAtIGRlYnVnIG9ubHlcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZGVzZXJpYWxpemVPYmplY3QgKHNlcmlhbGl6ZWQsIF9zdGlsbFVzZVVybDogQm9vbGVhbiwgdGFyZ2V0Pywgb3duZXI/OiBPYmplY3QsIHByb3BOYW1lPzogU3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHByb3A7XHJcbiAgICAgICAgbGV0IG9iajogYW55ID0gbnVsbDsgICAgIC8vIHRoZSBvYmogdG8gcmV0dXJuXHJcbiAgICAgICAgbGV0IGtsYXNzOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBzZXJpYWxpemVkLl9fdHlwZV9fO1xyXG4gICAgICAgIGlmICh0eXBlID09PSAnVHlwZWRBcnJheScpIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBzZXJpYWxpemVkLmFycmF5O1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIG9iaiA9IG5ldyB3aW5kb3dbc2VyaWFsaXplZC5jdG9yXShhcnJheS5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpbaV0gPSBhcnJheVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUeXBlIE9iamVjdCAoaW5jbHVkaW5nIENDQ2xhc3MpXHJcblxyXG4gICAgICAgICAgICBrbGFzcyA9IHRoaXMuX2NsYXNzRmluZGVyKHR5cGUsIHNlcmlhbGl6ZWQsIG93bmVyLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgIGlmICgha2xhc3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vdFJlcG9ydGVkID0gdGhpcy5fY2xhc3NGaW5kZXIgPT09IGpzLl9nZXRDbGFzc0J5SWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAobm90UmVwb3J0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZWdhY3lDQy5kZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3ModHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZXNlcmlhbGl6ZUJ5VHlwZSAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKEVESVRPUiB8fCBURVNUKSAmJiB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB1c2UgdGFyZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhKHRhcmdldCBpbnN0YW5jZW9mIGtsYXNzKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2FybklEKDUzMDAsIGpzLmdldENsYXNzTmFtZSh0YXJnZXQpLCBrbGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHRhcmdldDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluc3RhbnRpYXRlIGEgbmV3IG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IG5ldyBrbGFzcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvYmouX2Rlc2VyaWFsaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLl9kZXNlcmlhbGl6ZShzZXJpYWxpemVkLmNvbnRlbnQsIHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsZWdhY3lDQy5DbGFzcy5faXNDQ0NsYXNzKGtsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9kZXNlcmlhbGl6ZUZpcmVDbGFzcyhzZWxmLCBvYmosIHNlcmlhbGl6ZWQsIGtsYXNzLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fZGVzZXJpYWxpemVUeXBlZE9iamVjdChvYmosIHNlcmlhbGl6ZWQsIGtsYXNzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjaGVja0Rlc2VyaWFsaXplQnlUeXBlICgpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzZXJpYWxpemVCeVR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZGVzZXJpYWxpemUgJyArIGtsYXNzLm5hbWUgKyAnIGZhaWxlZCwgJyArIGUuc3RhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIGtsYXNzID0gTWlzc2luZ1NjcmlwdC5nZXRNaXNzaW5nV3JhcHBlcih0eXBlLCBzZXJpYWxpemVkKTtcclxuICAgICAgICAgICAgICAgICAgICBsZWdhY3lDQy5kZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3ModHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzZXJpYWxpemVCeVR5cGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKEVESVRPUiAmJiBsZWdhY3lDQy5qcy5pc0NoaWxkQ2xhc3NPZihrbGFzcywgbGVnYWN5Q0MuQ29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tEZXNlcmlhbGl6ZUJ5VHlwZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVzZXJpYWxpemVCeVR5cGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICggIUFycmF5LmlzQXJyYXkoc2VyaWFsaXplZCkgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBlbWJlZGRlZCBwcmltaXRpdmUgamF2YXNjcmlwdCBvYmplY3RcclxuXHJcbiAgICAgICAgICAgIG9iaiA9ICgoRURJVE9SIHx8IFRFU1QpICYmIHRhcmdldCkgfHwge307XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2VyaWFsaXplUHJpbWl0aXZlT2JqZWN0KG9iaiwgc2VyaWFsaXplZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gQXJyYXlcclxuXHJcbiAgICAgICAgICAgIGlmICgoRURJVE9SIHx8IFRFU1QpICYmIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Lmxlbmd0aCA9IHNlcmlhbGl6ZWQubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgb2JqID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb2JqID0gbmV3IEFycmF5KHNlcmlhbGl6ZWQubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXJpYWxpemVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wID0gc2VyaWFsaXplZFtpXTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ29iamVjdCcgJiYgcHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZXNlcmlhbGl6ZU9iakZpZWxkKG9iaiwgcHJvcCwgJycgKyBpLCB0YXJnZXQgJiYgb2JqLCBfc3RpbGxVc2VVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVzZXJpYWxpemVPYmpGaWVsZChvYmosIHByb3AsICcnICsgaSwgbnVsbCwgX3N0aWxsVXNlVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbaV0gPSBwcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5ZKMIF9kZXNlcmlhbGl6ZU9iamVjdCDkuI3lkIznmoTlnLDmlrnlnKjkuo7kvJrliKTmlq0gaWQg5ZKMIHV1aWRcclxuICAgIHByaXZhdGUgX2Rlc2VyaWFsaXplT2JqRmllbGQgKG9iaiwganNvbk9iaiwgcHJvcE5hbWUsIHRhcmdldD8sIF9zdGlsbFVzZVVybD8pIHtcclxuICAgICAgICBjb25zdCBpZCA9IGpzb25PYmouX19pZF9fO1xyXG4gICAgICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHV1aWQgPSBqc29uT2JqLl9fdXVpZF9fO1xyXG4gICAgICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgKEVOQUJMRV9UQVJHRVQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDov5nph4zkuI3lgZrku7vkvZXmk43kvZzvvIzlm6DkuLrmnInlj6/og73osIPnlKjogIXpnIDopoHnn6XpgZPkvp3otZblk6rkupsgYXNzZXTjgIJcclxuICAgICAgICAgICAgICAgICAgICAvLyDosIPnlKjogIXkvb/nlKggdXVpZExpc3Qg5pe277yM5Y+v5Lul5Yik5patIG9ialtwcm9wTmFtZV0g5piv5ZCm5Li656m677yM5Li656m65YiZ6KGo56S65b6F6L+b5LiA5q2l5Yqg6L2977yMXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5LiN5Li656m65YiZ5Y+q5piv6KGo5piO5L6d6LWW5YWz57O744CCXHJcbiAgICAgICAgICAgICAgICAvLyAgICBpZiAodGFyZ2V0ICYmIHRhcmdldFtwcm9wTmFtZV0gJiYgdGFyZ2V0W3Byb3BOYW1lXS5fdXVpZCA9PT0gdXVpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIGNvbnNvbGUuYXNzZXJ0KG9ialtwcm9wTmFtZV0gPT09IHRhcmdldFtwcm9wTmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIC8vICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0LnB1c2gob2JqLCBwcm9wTmFtZSwgdXVpZCwgX3N0aWxsVXNlVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtwcm9wTmFtZV0gPSB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uT2JqLCBfc3RpbGxVc2VVcmwsIHRhcmdldCAmJiB0YXJnZXRbcHJvcE5hbWVdLCBvYmosIHByb3BOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtwcm9wTmFtZV0gPSB0aGlzLl9kZXNlcmlhbGl6ZU9iamVjdChqc29uT2JqLCBfc3RpbGxVc2VVcmwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBkT2JqID0gdGhpcy5kZXNlcmlhbGl6ZWRMaXN0W2lkXTtcclxuICAgICAgICAgICAgaWYgKGRPYmopIHtcclxuICAgICAgICAgICAgICAgIG9ialtwcm9wTmFtZV0gPSBkT2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faWRMaXN0LnB1c2goaWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faWRPYmpMaXN0LnB1c2gob2JqKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lkUHJvcExpc3QucHVzaChwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGVzZXJpYWxpemVQcmltaXRpdmVPYmplY3QgKGluc3RhbmNlLCBzZXJpYWxpemVkKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZm9yIChjb25zdCBwcm9wTmFtZSBpbiBzZXJpYWxpemVkKSB7XHJcbiAgICAgICAgICAgIGlmIChzZXJpYWxpemVkLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcCA9IHNlcmlhbGl6ZWRbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wTmFtZSAhPT0gJ19fdHlwZV9fJy8qICYmIGsgIT0gJ19faWRfXycqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtwcm9wTmFtZV0gPSBwcm9wO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5fZGVzZXJpYWxpemVPYmpGaWVsZChpbnN0YW5jZSwgcHJvcCwgcHJvcE5hbWUsIHNlbGYuX3RhcmdldCAmJiBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9kZXNlcmlhbGl6ZU9iakZpZWxkKGluc3RhbmNlLCBwcm9wLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9kZXNlcmlhbGl6ZVR5cGVkT2JqZWN0IChpbnN0YW5jZSwgc2VyaWFsaXplZCwga2xhc3MpIHtcclxuICAgICAgICBpZiAoa2xhc3MgPT09IGxlZ2FjeUNDLlZlYzIpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UueCA9IHNlcmlhbGl6ZWQueCB8fCAwO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS55ID0gc2VyaWFsaXplZC55IHx8IDA7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKGtsYXNzID09PSBsZWdhY3lDQy5WZWMzKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnggPSBzZXJpYWxpemVkLnggfHwgMDtcclxuICAgICAgICAgICAgaW5zdGFuY2UueSA9IHNlcmlhbGl6ZWQueSB8fCAwO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS56ID0gc2VyaWFsaXplZC56IHx8IDA7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKGtsYXNzID09PSBsZWdhY3lDQy5Db2xvcikge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yID0gc2VyaWFsaXplZC5yIHx8IDA7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmcgPSBzZXJpYWxpemVkLmcgfHwgMDtcclxuICAgICAgICAgICAgaW5zdGFuY2UuYiA9IHNlcmlhbGl6ZWQuYiB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBhID0gc2VyaWFsaXplZC5hO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5hID0gKGEgPT09IHVuZGVmaW5lZCA/IDI1NSA6IGEpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmIChrbGFzcyA9PT0gbGVnYWN5Q0MuU2l6ZSkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS53aWR0aCA9IHNlcmlhbGl6ZWQud2lkdGggfHwgMDtcclxuICAgICAgICAgICAgaW5zdGFuY2UuaGVpZ2h0ID0gc2VyaWFsaXplZC5oZWlnaHQgfHwgMDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgREVGQVVMVCA9IEF0dHIuREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xyXG4gICAgICAgIGNvbnN0IGF0dHJzID0gQXR0ci5nZXRDbGFzc0F0dHJzKGtsYXNzKTtcclxuICAgICAgICBjb25zdCBmYXN0RGVmaW5lZFByb3BzID0ga2xhc3MuX19wcm9wc19fIHx8IE9iamVjdC5rZXlzKGluc3RhbmNlKTsgICAgLy8g6YGN5Y6GIGluc3RhbmNl77yM5aaC5p6c5YW35pyJ57G75Z6L77yM5omN5LiN5Lya5oqKIF9fdHlwZV9fIOS5n+ivu+i/m+adpVxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmFzdERlZmluZWRQcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wTmFtZSA9IGZhc3REZWZpbmVkUHJvcHNbaV07XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHNlcmlhbGl6ZWRbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAhc2VyaWFsaXplZC5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vdCBzZXJpYWxpemVkLFxyXG4gICAgICAgICAgICAgICAgLy8gcmVjb3ZlciB0byBkZWZhdWx0IHZhbHVlIGluIFZhbHVlVHlwZSwgYmVjYXVzZSBlbGltaW5hdGVkIHByb3BlcnRpZXMgZXF1YWxzIHRvXHJcbiAgICAgICAgICAgICAgICAvLyBpdHMgZGVmYXVsdCB2YWx1ZSBpbiBWYWx1ZVR5cGUsIG5vdCBkZWZhdWx0IHZhbHVlIGluIHVzZXIgY2xhc3NcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gQ0NDbGFzcy5nZXREZWZhdWx0KGF0dHJzW3Byb3BOYW1lICsgREVGQVVMVF0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VbcHJvcE5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChFRElUT1IgfHwgVEVTVCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rlc2VyaWFsaXplT2JqRmllbGQoaW5zdGFuY2UsIHZhbHVlLCBwcm9wTmFtZSwgdGhpcy5fdGFyZ2V0ICYmIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVzZXJpYWxpemVPYmpGaWVsZChpbnN0YW5jZSwgdmFsdWUsIHByb3BOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlW3Byb3BOYW1lXSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbl9EZXNlcmlhbGl6ZXIucG9vbCA9IG5ldyBqcy5Qb29sKChvYmo6IGFueSkgPT4ge1xyXG4gICAgb2JqLnJlc3VsdCA9IG51bGw7XHJcbiAgICBvYmouY3VzdG9tRW52ID0gbnVsbDtcclxuICAgIG9iai5kZXNlcmlhbGl6ZWRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICBvYmouZGVzZXJpYWxpemVkRGF0YSA9IG51bGw7XHJcbiAgICBvYmouX2NsYXNzRmluZGVyID0gbnVsbDtcclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBvYmouX3RhcmdldCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBvYmouX2lkTGlzdC5sZW5ndGggPSAwO1xyXG4gICAgb2JqLl9pZE9iakxpc3QubGVuZ3RoID0gMDtcclxuICAgIG9iai5faWRQcm9wTGlzdC5sZW5ndGggPSAwO1xyXG59LCAxKTtcclxuLy8gQHRzLWlnbm9yZVxyXG5fRGVzZXJpYWxpemVyLnBvb2wuZ2V0ID0gZnVuY3Rpb24gKHJlc3VsdCwgdGFyZ2V0LCBjbGFzc0ZpbmRlciwgY3VzdG9tRW52LCBpZ25vcmVFZGl0b3JPbmx5KSB7XHJcbiAgICBjb25zdCBjYWNoZTogYW55ID0gdGhpcy5fZ2V0KCk7XHJcbiAgICBpZiAoY2FjaGUpIHtcclxuICAgICAgICBjYWNoZS5yZXN1bHQgPSByZXN1bHQ7XHJcbiAgICAgICAgY2FjaGUuY3VzdG9tRW52ID0gY3VzdG9tRW52O1xyXG4gICAgICAgIGNhY2hlLl9jbGFzc0ZpbmRlciA9IGNsYXNzRmluZGVyO1xyXG4gICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgY2FjaGUuX3RhcmdldCA9IHRhcmdldDtcclxuICAgICAgICAgICAgY2FjaGUuX2lnbm9yZUVkaXRvck9ubHkgPSBpZ25vcmVFZGl0b3JPbmx5O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FjaGU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbmV3IF9EZXNlcmlhbGl6ZXIocmVzdWx0LCB0YXJnZXQsIGNsYXNzRmluZGVyLCBjdXN0b21FbnYsIGlnbm9yZUVkaXRvck9ubHkpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtb2R1bGUgY2NcclxuICovXHJcblxyXG4vKipcclxuICogQGVuIERlc2VyaWFsaXplIGpzb24gdG8gYEFzc2V0YC5cclxuICogQHpoIOWwhiBKU09OIOWPjeW6j+WIl+WMluS4uuWvueixoeWunuS+i+OAglxyXG4gKlxyXG4gKiDlvZPmjIflrprkuoYgdGFyZ2V0IOmAiemhueaXtu+8jOWmguaenCB0YXJnZXQg5byV55So55qE5YW25a6DIGFzc2V0IOeahCB1dWlkIOS4jeWPmO+8jOWImeS4jeS8muaUueWPmCB0YXJnZXQg5a+5IGFzc2V0IOeahOW8leeUqO+8jFxyXG4gKiDkuZ/kuI3kvJrlsIYgdXVpZCDkv53lrZjliLAgcmVzdWx0IOWvueixoeS4reOAglxyXG4gKlxyXG4gKiBAbWV0aG9kIGRlc2VyaWFsaXplXHJcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YSAtIHRoZSBzZXJpYWxpemVkIGBBc3NldGAganNvbiBzdHJpbmcgb3IganNvbiBvYmplY3QuXHJcbiAqIEBwYXJhbSB7RGV0YWlsc30gW2RldGFpbHNdIC0gYWRkaXRpb25hbCBsb2FkaW5nIHJlc3VsdFxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXHJcbiAqIEByZXR1cm4ge29iamVjdH0gdGhlIG1haW4gZGF0YShhc3NldClcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZXNlcmlhbGl6ZSAoZGF0YSwgZGV0YWlscywgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICBjb25zdCBjbGFzc0ZpbmRlciA9IG9wdGlvbnMuY2xhc3NGaW5kZXIgfHwganMuX2dldENsYXNzQnlJZDtcclxuICAgIC8vIOWQr+eUqCBjcmVhdGVBc3NldFJlZnMg5ZCO77yM5aaC5p6c5pyJIHVybCDlsZ7mgKfliJnkvJrooqvnu5/kuIDlvLrliLborr7nva7kuLogeyB1dWlkOiAneHh4JyB977yM5b+F6aG75ZCO6Z2i5YaN54m55q6K5aSE55CGXHJcbiAgICBjb25zdCBjcmVhdGVBc3NldFJlZnMgPSBvcHRpb25zLmNyZWF0ZUFzc2V0UmVmcyB8fCBsZWdhY3lDQy5zeXMucGxhdGZvcm0gPT09IGxlZ2FjeUNDLnN5cy5FRElUT1JfQ09SRTtcclxuICAgIGNvbnN0IHRhcmdldCA9IChFRElUT1IgfHwgVEVTVCkgJiYgb3B0aW9ucy50YXJnZXQ7XHJcbiAgICBjb25zdCBjdXN0b21FbnYgPSBvcHRpb25zLmN1c3RvbUVudjtcclxuICAgIGNvbnN0IGlnbm9yZUVkaXRvck9ubHkgPSBvcHRpb25zLmlnbm9yZUVkaXRvck9ubHk7XHJcbiAgICBcclxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB2YXIgb2xkSnNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpO1xyXG5cclxuICAgIGNvbnN0IHRlbXBEZXRhaWxzID0gIWRldGFpbHM7XHJcbiAgICBkZXRhaWxzID0gZGV0YWlscyB8fCBEZXRhaWxzLnBvb2wuZ2V0ISgpO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgY29uc3QgZGVzZXJpYWxpemVyOiBfRGVzZXJpYWxpemVyID0gX0Rlc2VyaWFsaXplci5wb29sLmdldChkZXRhaWxzLCB0YXJnZXQsIGNsYXNzRmluZGVyLCBjdXN0b21FbnYsIGlnbm9yZUVkaXRvck9ubHkpO1xyXG5cclxuICAgIGxlZ2FjeUNDLmdhbWUuX2lzQ2xvbmluZyA9IHRydWU7XHJcbiAgICBjb25zdCByZXMgPSBkZXNlcmlhbGl6ZXIuZGVzZXJpYWxpemUoZGF0YSk7XHJcbiAgICBsZWdhY3lDQy5nYW1lLl9pc0Nsb25pbmcgPSBmYWxzZTtcclxuXHJcbiAgICBfRGVzZXJpYWxpemVyLnBvb2wucHV0KGRlc2VyaWFsaXplcik7XHJcbiAgICBpZiAoY3JlYXRlQXNzZXRSZWZzKSB7XHJcbiAgICAgICAgZGV0YWlscy5hc3NpZ25Bc3NldHNCeShFZGl0b3JFeHRlbmRzLnNlcmlhbGl6ZS5hc0Fzc2V0KTtcclxuICAgIH1cclxuICAgIGlmICh0ZW1wRGV0YWlscykge1xyXG4gICAgICAgIERldGFpbHMucG9vbC5wdXQoZGV0YWlscyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdmFyIGFmdGVySnNvbiA9IEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpO1xyXG4gICAgLy8gaWYgKG9sZEpzb24gIT09IGFmdGVySnNvbikge1xyXG4gICAgLy8gICAgIHRocm93IG5ldyBFcnJvcignSlNPTiBTSE9VTEQgbm90IGNoYW5nZWQnKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICByZXR1cm4gcmVzO1xyXG59XHJcbmRlc2VyaWFsaXplLkRldGFpbHMgPSBEZXRhaWxzO1xyXG5kZXNlcmlhbGl6ZS5yZXBvcnRNaXNzaW5nQ2xhc3MgPSAoaWQpID0+IHtcclxuICAgIGlmIChFRElUT1IgJiYgRWRpdG9yRXh0ZW5kcy5VdWlkVXRpbHMuaXNVdWlkKGlkKSkge1xyXG4gICAgICAgIGlkID0gRWRpdG9yRXh0ZW5kcy5VdWlkVXRpbHMuZGVjb21wcmVzc1V1aWQoaWQpO1xyXG4gICAgICAgIHdhcm5JRCg1MzAxLCBpZCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB3YXJuSUQoNTMwMiwgaWQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZGVzZXJpYWxpemUuX0Rlc2VyaWFsaXplciA9IF9EZXNlcmlhbGl6ZXI7XHJcbmxlZ2FjeUNDLmRlc2VyaWFsaXplID0gZGVzZXJpYWxpemU7XHJcbiJdfQ==