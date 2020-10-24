(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "../utils/js.js", "../utils/misc.js", "../value-types/index.js", "../value-types/enum.js", "./utils/attribute.js", "./utils/preprocess-class.js", "./utils/requiring-frame.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("../utils/js.js"), require("../utils/misc.js"), require("../value-types/index.js"), require("../value-types/enum.js"), require("./utils/attribute.js"), require("./utils/preprocess-class.js"), require("./utils/requiring-frame.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.js, global.misc, global.index, global._enum, global.attribute, global.preprocessClass, global.requiringFrame, global.defaultConstants, global.globalExports);
    global._class = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, js, _misc, _index, _enum, attributeUtils, _preprocessClass, RF, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CCClass = CCClass;
  js = _interopRequireWildcard(js);
  attributeUtils = _interopRequireWildcard(attributeUtils);
  RF = _interopRequireWildcard(RF);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var DELIMETER = attributeUtils.DELIMETER;
  var BUILTIN_ENTRIES = ['name', 'extends', 'mixins', 'ctor', '__ctor__', 'properties', 'statics', 'editor', '__ES6__'];
  var INVALID_STATICS_DEV = ['name', '__ctors__', '__props__', 'arguments', 'call', 'apply', 'caller', 'length', 'prototype'];

  function pushUnique(array, item) {
    if (array.indexOf(item) < 0) {
      array.push(item);
    }
  }

  var deferredInitializer = {
    // Configs for classes which needs deferred initialization
    datas: null,
    // register new class
    // data - {cls: cls, cb: properties, mixins: options.mixins}
    push: function push(data) {
      if (this.datas) {
        this.datas.push(data);
      } else {
        this.datas = [data]; // start a new timer to initialize

        var self = this;
        setTimeout(function () {
          self.init();
        }, 0);
      }
    },
    init: function init() {
      var datas = this.datas;

      if (datas) {
        for (var i = 0; i < datas.length; ++i) {
          var data = datas[i];
          var cls = data.cls;
          var properties = data.props;

          if (typeof properties === 'function') {
            properties = properties();
          }

          var _name = js.getClassName(cls);

          if (properties) {
            declareProperties(cls, _name, properties, cls.$super, data.mixins);
          } else {
            (0, _debug.errorID)(3633, _name);
          }
        }

        this.datas = null;
      }
    }
  }; // both getter and prop must register the name into __props__ array

  function appendProp(cls, name) {
    if (_defaultConstants.DEV) {
      // if (!IDENTIFIER_RE.test(name)) {
      //    error('The property name "' + name + '" is not compliant with JavaScript naming standards');
      //    return;
      // }
      if (name.indexOf('.') !== -1) {
        (0, _debug.errorID)(3634);
        return;
      }
    }

    pushUnique(cls.__props__, name);
  }

  var tmpArray = [];

  function defineProp(cls, className, propName, val, es6) {
    var defaultValue = val["default"];

    if (_defaultConstants.DEV) {
      if (!es6) {
        // check default object value
        if (_typeof(defaultValue) === 'object' && defaultValue) {
          if (Array.isArray(defaultValue)) {
            // check array empty
            if (defaultValue.length > 0) {
              (0, _debug.errorID)(3635, className, propName, propName);
              return;
            }
          } else if (!(0, _misc.isPlainEmptyObj_DEV)(defaultValue)) {
            // check cloneable
            if (!(0, _misc.cloneable_DEV)(defaultValue)) {
              (0, _debug.errorID)(3636, className, propName, propName);
              return;
            }
          }
        }
      } // check base prototype to avoid name collision


      if (CCClass.getInheritanceChain(cls).some(function (x) {
        return x.prototype.hasOwnProperty(propName);
      })) {
        (0, _debug.errorID)(3637, className, propName, className);
        return;
      }
    } // set default value


    attributeUtils.setClassAttr(cls, propName, 'default', defaultValue);
    appendProp(cls, propName); // apply attributes

    var attrs = parseAttributes(cls, val, className, propName, false);

    if (attrs) {
      var onAfterProp = tmpArray;

      for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        attributeUtils.attr(cls, propName, attr);

        if (attr.serializable === false) {
          pushUnique(cls.__values__, propName);
        } // register callback


        if (attr._onAfterProp) {
          onAfterProp.push(attr._onAfterProp);
        }
      } // call callback


      for (var c = 0; c < onAfterProp.length; c++) {
        onAfterProp[c](cls, propName);
      }

      tmpArray.length = 0;
      attrs.length = 0;
    }
  }

  function defineGetSet(cls, name, propName, val, es6) {
    var getter = val.get;
    var setter = val.set;
    var proto = cls.prototype;
    var d = Object.getOwnPropertyDescriptor(proto, propName);
    var setterUndefined = !d;

    if (getter) {
      if (_defaultConstants.DEV && !es6 && d && d.get) {
        (0, _debug.errorID)(3638, name, propName);
        return;
      }

      var attrs = parseAttributes(cls, val, name, propName, true);

      for (var i = 0; i < attrs.length; i++) {
        attributeUtils.attr(cls, propName, attrs[i]);
      }

      attrs.length = 0;
      attributeUtils.setClassAttr(cls, propName, 'serializable', false);

      if (_defaultConstants.DEV) {
        // 不论是否 visible 都要添加到 props，否则 asset watcher 不能正常工作
        appendProp(cls, propName);
      }

      if (!es6) {
        js.get(proto, propName, getter, setterUndefined, setterUndefined);
      }

      if (_defaultConstants.EDITOR || _defaultConstants.DEV) {
        attributeUtils.setClassAttr(cls, propName, 'hasGetter', true); // 方便 editor 做判断
      }
    }

    if (setter) {
      if (!es6) {
        if (_defaultConstants.DEV && d && d.set) {
          return (0, _debug.errorID)(3640, name, propName);
        }

        js.set(proto, propName, setter, setterUndefined, setterUndefined);
      }

      if (_defaultConstants.EDITOR || _defaultConstants.DEV) {
        attributeUtils.setClassAttr(cls, propName, 'hasSetter', true); // 方便 editor 做判断
      }
    }
  }

  function getDefault(defaultVal) {
    if (typeof defaultVal === 'function') {
      if (_defaultConstants.EDITOR) {
        try {
          return defaultVal();
        } catch (e) {
          _globalExports.legacyCC._throw(e);

          return undefined;
        }
      } else {
        return defaultVal();
      }
    }

    return defaultVal;
  }

  function mixinWithInherited(dest, src, filter) {
    for (var prop in src) {
      if (!dest.hasOwnProperty(prop) && (!filter || filter(prop))) {
        Object.defineProperty(dest, prop, js.getPropertyDescriptor(src, prop));
      }
    }
  }

  function doDefine(className, baseClass, mixins, options) {
    var shouldAddProtoCtor;
    var __ctor__ = options.__ctor__;
    var ctor = options.ctor;
    var __es6__ = options.__ES6__;

    if (_defaultConstants.DEV) {
      // check ctor
      var ctorToUse = __ctor__ || ctor;

      if (ctorToUse) {
        if (CCClass._isCCClass(ctorToUse)) {
          (0, _debug.errorID)(3618, className);
        } else if (typeof ctorToUse !== 'function') {
          (0, _debug.errorID)(3619, className);
        } else {
          if (baseClass && /\bprototype.ctor\b/.test(ctorToUse)) {
            if (__es6__) {
              (0, _debug.errorID)(3651, className || '');
            } else {
              (0, _debug.warnID)(3600, className || '');
              shouldAddProtoCtor = true;
            }
          }
        }

        if (ctor) {
          if (__ctor__) {
            (0, _debug.errorID)(3649, className);
          } else {
            ctor = options.ctor = _validateCtor_DEV(ctor, baseClass, className, options);
          }
        }
      }
    }

    var ctors;
    var fireClass;

    if (__es6__) {
      ctors = [ctor];
      fireClass = ctor;
    } else {
      ctors = __ctor__ ? [__ctor__] : _getAllCtors(baseClass, mixins, options);
      fireClass = _createCtor(ctors, baseClass, className, options); // extend - Create a new Class that inherits from this Class

      js.value(fireClass, 'extend', function (options) {
        options["extends"] = this;
        return CCClass(options);
      }, true);
    }

    js.value(fireClass, '__ctors__', ctors.length > 0 ? ctors : null, true);
    var prototype = fireClass.prototype;

    if (baseClass) {
      if (!__es6__) {
        js.extend(fireClass, baseClass); // 这里会把父类的 __props__ 复制给子类

        prototype = fireClass.prototype; // get extended prototype
      }

      fireClass.$super = baseClass;

      if (_defaultConstants.DEV && shouldAddProtoCtor) {
        prototype.ctor = function () {};
      }
    }

    if (mixins) {
      var _loop = function _loop(m) {
        var mixin = mixins[m];
        mixinWithInherited(prototype, mixin.prototype); // mixin statics (this will also copy editor attributes for component)

        mixinWithInherited(fireClass, mixin, function (prop) {
          return mixin.hasOwnProperty(prop) && (!_defaultConstants.DEV || INVALID_STATICS_DEV.indexOf(prop) < 0);
        }); // mixin attributes

        if (CCClass._isCCClass(mixin)) {
          mixinWithInherited(attributeUtils.getClassAttrs(fireClass).constructor.prototype, attributeUtils.getClassAttrs(mixin).constructor.prototype);
        }
      };

      for (var m = mixins.length - 1; m >= 0; m--) {
        _loop(m);
      } // restore constuctor overridden by mixin


      prototype.constructor = fireClass;
    }

    if (!__es6__) {
      prototype.__initProps__ = compileProps;
    }

    js.setClassName(className, fireClass);
    return fireClass;
  }

  function define(className, baseClass, mixins, options) {
    var Component = _globalExports.legacyCC.Component;
    var frame = RF.peek();

    if (frame && js.isChildClassOf(baseClass, Component)) {
      // project component
      if (js.isChildClassOf(frame.cls, Component)) {
        (0, _debug.errorID)(3615);
        return null;
      }

      if (_defaultConstants.DEV && frame.uuid && className) {// warnID(3616, className);
      }

      className = className || frame.script;
    }

    if (_defaultConstants.DEV) {
      if (!options.__ES6__) {
        (0, _debug.warnID)(3661, className);
      }
    }

    var cls = doDefine(className, baseClass, mixins, options); // for RenderPipeline, RenderFlow, RenderStage

    var isRenderPipeline = js.isChildClassOf(baseClass, _globalExports.legacyCC.RenderPipeline);
    var isRenderFlow = js.isChildClassOf(baseClass, _globalExports.legacyCC.RenderFlow);
    var isRenderStage = js.isChildClassOf(baseClass, _globalExports.legacyCC.RenderStage);
    var isRender = isRenderPipeline || isRenderFlow || isRenderStage || false;

    if (isRender) {
      var renderName = '';

      if (isRenderPipeline) {
        renderName = 'render_pipeline';
      } else if (isRenderFlow) {
        renderName = 'render_flow';
      } else if (isRenderStage) {
        renderName = 'render_stage';
      }

      if (renderName) {
        js._setClassId(className, cls);

        if (_defaultConstants.EDITOR) {
          // 增加了 hidden: 开头标识，使它最终不会显示在 Editor inspector 的添加组件列表里
          // @ts-ignore
          // tslint:disable-next-line:no-unused-expression
          window.EditorExtends && window.EditorExtends.Component.addMenu(cls, "hidden:".concat(renderName, "/").concat(className), -1);
        }
      }
    }

    if (_defaultConstants.EDITOR) {
      // Note: `options.ctor` should be same as `cls` except if
      // cc-class is defined by `cc.Class({/* ... */})`.
      // In such case, `options.ctor` may be `undefined`.
      // So we can not use `options.ctor`. Instead we should use `cls` which is the "real" registered cc-class.
      EditorExtends.emit('class-registered', cls, frame, className);
    }

    if (frame) {
      // 基础的 ts, js 脚本组件
      if (js.isChildClassOf(baseClass, Component)) {
        var uuid = frame.uuid;

        if (uuid) {
          js._setClassId(uuid, cls);

          if (_defaultConstants.EDITOR) {
            cls.prototype.__scriptUuid = EditorExtends.UuidUtils.decompressUuid(uuid);
          }
        }

        frame.cls = cls;
      } else if (!js.isChildClassOf(frame.cls, Component)) {
        frame.cls = cls;
      }
    }

    return cls;
  }

  function normalizeClassName_DEV(className) {
    var DefaultName = 'CCClass';

    if (className) {
      className = className.replace(/^[^$A-Za-z_]/, '_').replace(/[^0-9A-Za-z_$]/g, '_');

      try {
        // validate name
        Function('function ' + className + '(){}')();
        return className;
      } catch (e) {}
    }

    return DefaultName;
  }

  function getNewValueTypeCodeJit(value) {
    var clsName = js.getClassName(value);
    var type = value.constructor;
    var res = 'new ' + clsName + '(';

    for (var i = 0; i < type.__props__.length; i++) {
      var prop = type.__props__[i];
      var propVal = value[prop];

      if (_defaultConstants.DEV && _typeof(propVal) === 'object') {
        (0, _debug.errorID)(3641, clsName);
        return 'new ' + clsName + '()';
      }

      res += propVal;

      if (i < type.__props__.length - 1) {
        res += ',';
      }
    }

    return res + ')';
  } // TODO - move escapeForJS, IDENTIFIER_RE, getNewValueTypeCodeJit to misc.js or a new source file
  // convert a normal string including newlines, quotes and unicode characters into a string literal
  // ready to use in JavaScript source


  function escapeForJS(s) {
    return JSON.stringify(s). // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }

  function getInitPropsJit(attrs, propList) {
    // functions for generated code
    var F = [];
    var func = '';

    for (var i = 0; i < propList.length; i++) {
      var prop = propList[i];
      var attrKey = prop + DELIMETER + 'default';

      if (attrKey in attrs) {
        // getter does not have default
        var statement = void 0;

        if (IDENTIFIER_RE.test(prop)) {
          statement = 'this.' + prop + '=';
        } else {
          statement = 'this[' + escapeForJS(prop) + ']=';
        }

        var expression = void 0;
        var def = attrs[attrKey];

        if (_typeof(def) === 'object' && def) {
          if (def instanceof _globalExports.legacyCC.ValueType) {
            expression = getNewValueTypeCodeJit(def);
          } else if (Array.isArray(def)) {
            expression = '[]';
          } else {
            expression = '{}';
          }
        } else if (typeof def === 'function') {
          var index = F.length;
          F.push(def);
          expression = 'F[' + index + ']()';

          if (_defaultConstants.EDITOR) {
            func += 'try {\n' + statement + expression + ';\n}\ncatch(e) {\ncc._throw(e);\n' + statement + 'undefined;\n}\n';
            continue;
          }
        } else if (typeof def === 'string') {
          expression = escapeForJS(def);
        } else {
          // number, boolean, null, undefined
          expression = def;
        }

        statement = statement + expression + ';\n';
        func += statement;
      }
    } // if (TEST && !isPhantomJS) {
    //     console.log(func);
    // }


    var initProps;

    if (F.length === 0) {
      initProps = Function(func);
    } else {
      initProps = Function('F', 'return (function(){\n' + func + '})')(F);
    }

    return initProps;
  }

  function getInitProps(attrs, propList) {
    var advancedProps = [];
    var advancedValues = [];
    var simpleProps = [];
    var simpleValues = [];

    for (var i = 0; i < propList.length; ++i) {
      var prop = propList[i];
      var attrKey = prop + DELIMETER + 'default';

      if (attrKey in attrs) {
        // getter does not have default
        var def = attrs[attrKey];

        if (_typeof(def) === 'object' && def || typeof def === 'function') {
          advancedProps.push(prop);
          advancedValues.push(def);
        } else {
          // number, boolean, null, undefined, string
          simpleProps.push(prop);
          simpleValues.push(def);
        }
      }
    }

    return function () {
      for (var _i = 0; _i < simpleProps.length; ++_i) {
        this[simpleProps[_i]] = simpleValues[_i];
      }

      for (var _i2 = 0; _i2 < advancedProps.length; _i2++) {
        var _prop = advancedProps[_i2];
        var expression = void 0;
        var _def = advancedValues[_i2];

        if (_typeof(_def) === 'object') {
          if (_def instanceof _globalExports.legacyCC.ValueType) {
            expression = _def.clone();
          } else if (Array.isArray(_def)) {
            expression = [];
          } else {
            expression = {};
          }
        } else {
          // def is function
          if (_defaultConstants.EDITOR) {
            try {
              expression = _def();
            } catch (err) {
              _globalExports.legacyCC._throw(err);

              continue;
            }
          } else {
            expression = _def();
          }
        }

        this[_prop] = expression;
      }
    };
  } // simple test variable name


  var IDENTIFIER_RE = /^[A-Za-z_$][0-9A-Za-z_$]*$/;

  function compileProps(actualClass) {
    // init deferred properties
    var attrs = attributeUtils.getClassAttrs(actualClass);
    var propList = actualClass.__props__;

    if (propList === null) {
      deferredInitializer.init();
      propList = actualClass.__props__;
    } // Overwite __initProps__ to avoid compile again.


    var initProps = _defaultConstants.SUPPORT_JIT ? getInitPropsJit(attrs, propList) : getInitProps(attrs, propList);
    actualClass.prototype.__initProps__ = initProps; // call instantiateProps immediately, no need to pass actualClass into it anymore
    // (use call to manually bind `this` because `this` may not instanceof actualClass)

    initProps.call(this);
  }

  var _createCtor = _defaultConstants.SUPPORT_JIT ? function (ctors, baseClass, className, options) {
    var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
    var ctorName = _defaultConstants.DEV ? normalizeClassName_DEV(className) : 'CCClass';
    var body = 'return function ' + ctorName + '(){\n';

    if (superCallBounded) {
      body += 'this._super=null;\n';
    } // instantiate props


    body += 'this.__initProps__(' + ctorName + ');\n'; // call user constructors

    var ctorLen = ctors.length;

    if (ctorLen > 0) {
      var useTryCatch = _defaultConstants.DEV && !(className && className.startsWith('cc.'));

      if (useTryCatch) {
        body += 'try{\n';
      }

      var SNIPPET = '].apply(this,arguments);\n';

      if (ctorLen === 1) {
        body += ctorName + '.__ctors__[0' + SNIPPET;
      } else {
        body += 'var cs=' + ctorName + '.__ctors__;\n';

        for (var i = 0; i < ctorLen; i++) {
          body += 'cs[' + i + SNIPPET;
        }
      }

      if (useTryCatch) {
        body += '}catch(e){\n' + 'cc._throw(e);\n' + '}\n';
      }
    }

    body += '}';
    return Function(body)();
  } : function (ctors, baseClass, className, options) {
    var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
    var ctorLen = ctors.length;

    var _Class5;

    if (ctorLen > 0) {
      if (superCallBounded) {
        if (ctorLen === 2) {
          // User Component
          _Class5 = function Class() {
            this._super = null;

            this.__initProps__(_Class5);

            ctors[0].apply(this, arguments);
            ctors[1].apply(this, arguments);
          };
        } else {
          _Class5 = function _Class() {
            this._super = null;

            this.__initProps__(_Class5);

            for (var i = 0; i < ctors.length; ++i) {
              ctors[i].apply(this, arguments);
            }
          };
        }
      } else {
        if (ctorLen === 3) {
          // Node
          _Class5 = function _Class2() {
            this.__initProps__(_Class5);

            ctors[0].apply(this, arguments);
            ctors[1].apply(this, arguments);
            ctors[2].apply(this, arguments);
          };
        } else {
          _Class5 = function _Class3() {
            this.__initProps__(_Class5);

            var ctors = _Class5.__ctors__;

            for (var i = 0; i < ctors.length; ++i) {
              ctors[i].apply(this, arguments);
            }
          };
        }
      }
    } else {
      _Class5 = function _Class4() {
        if (superCallBounded) {
          this._super = null;
        }

        this.__initProps__(_Class5);
      };
    }

    return _Class5;
  };

  function _validateCtor_DEV(ctor, baseClass, className, options) {
    if (_defaultConstants.EDITOR && baseClass) {
      // check super call in constructor
      var originCtor = ctor;

      if (SuperCallReg.test(ctor)) {
        if (options.__ES6__) {
          (0, _debug.errorID)(3651, className);
        } else {
          (0, _debug.warnID)(3600, className); // suppresss super call

          ctor = function ctor() {
            this._super = function () {};

            var ret = originCtor.apply(this, arguments);
            this._super = null;
            return ret;
          };
        }
      }
    } // check ctor


    if (ctor.length > 0 && (!className || !className.startsWith('cc.'))) {
      // To make a unified CCClass serialization process,
      // we don't allow parameters for constructor when creating instances of CCClass.
      // For advanced user, construct arguments can still get from 'arguments'.
      (0, _debug.warnID)(3617, className);
    }

    return ctor;
  }

  function _getAllCtors(baseClass, mixins, options) {
    // get base user constructors
    function getCtors(cls) {
      if (CCClass._isCCClass(cls)) {
        return cls.__ctors__ || [];
      } else {
        return [cls];
      }
    }

    var ctors = []; // if (options.__ES6__) {
    //     if (mixins) {
    //         let baseOrMixins = getCtors(baseClass);
    //         for (let b = 0; b < mixins.length; b++) {
    //             let mixin = mixins[b];
    //             if (mixin) {
    //                 let baseCtors = getCtors(mixin);
    //                 for (let c = 0; c < baseCtors.length; c++) {
    //                     if (baseOrMixins.indexOf(baseCtors[c]) < 0) {
    //                         pushUnique(ctors, baseCtors[c]);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    // else {

    var baseOrMixins = [baseClass].concat(mixins);

    for (var b = 0; b < baseOrMixins.length; b++) {
      var baseOrMixin = baseOrMixins[b];

      if (baseOrMixin) {
        var baseCtors = getCtors(baseOrMixin);

        for (var c = 0; c < baseCtors.length; c++) {
          pushUnique(ctors, baseCtors[c]);
        }
      }
    } // }
    // append subclass user constructors


    var ctor = options.ctor;

    if (ctor) {
      ctors.push(ctor);
    }

    return ctors;
  }

  var superCllRegCondition = /xyz/.test(function () {
    var xyz = 0;
  }.toString());
  var SuperCallReg = superCllRegCondition ? /\b\._super\b/ : /.*/;
  var SuperCallRegStrict = superCllRegCondition ? /this\._super\s*\(/ : /(NONE){99}/;

  function boundSuperCalls(baseClass, options, className) {
    var hasSuperCall = false;

    for (var funcName in options) {
      if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
        continue;
      }

      var func = options[funcName];

      if (typeof func !== 'function') {
        continue;
      }

      var pd = js.getPropertyDescriptor(baseClass.prototype, funcName);

      if (pd) {
        var superFunc = pd.value; // ignore pd.get, assume that function defined by getter is just for warnings

        if (typeof superFunc === 'function') {
          if (SuperCallReg.test(func)) {
            hasSuperCall = true; // boundSuperCall

            options[funcName] = function (superFunc, func) {
              return function () {
                var tmp = this._super; // Add a new ._super() method that is the same method but on the super-Class

                this._super = superFunc;
                var ret = func.apply(this, arguments); // The method only need to be bound temporarily, so we remove it when we're done executing

                this._super = tmp;
                return ret;
              };
            }(superFunc, func);
          }

          continue;
        }
      }

      if (_defaultConstants.DEV && SuperCallRegStrict.test(func)) {
        (0, _debug.warnID)(3620, className, funcName);
      }
    }

    return hasSuperCall;
  }

  function declareProperties(cls, className, properties, baseClass, mixins, es6) {
    cls.__props__ = [];

    if (baseClass && baseClass.__props__) {
      cls.__props__ = baseClass.__props__.slice();
    }

    if (mixins) {
      for (var m = 0; m < mixins.length; ++m) {
        var mixin = mixins[m];

        if (mixin.__props__) {
          cls.__props__ = cls.__props__.concat(mixin.__props__.filter(function (x) {
            return cls.__props__.indexOf(x) < 0;
          }));
        }
      }
    }

    if (properties) {
      // 预处理属性
      (0, _preprocessClass.preprocessAttrs)(properties, className, cls, es6);

      for (var propName in properties) {
        var val = properties[propName];

        if ('default' in val) {
          defineProp(cls, className, propName, val, es6);
        } else {
          defineGetSet(cls, className, propName, val, es6);
        }
      }
    }

    var attrs = attributeUtils.getClassAttrs(cls);
    cls.__values__ = cls.__props__.filter(function (prop) {
      return attrs[prop + DELIMETER + 'serializable'] !== false;
    });
  }

  function CCClass(options) {
    options = options || {};
    var name = options.name;
    var base = options["extends"]
    /* || CCObject*/
    ;
    var mixins = options.mixins; // create constructor

    var cls = define(name, base, mixins, options);

    if (!name) {
      name = _globalExports.legacyCC.js.getClassName(cls);
    }

    cls._sealed = true;

    if (base) {
      base._sealed = false;
    } // define Properties


    var properties = options.properties;

    if (typeof properties === 'function' || base && base.__props__ === null || mixins && mixins.some(function (x) {
      return x.__props__ === null;
    })) {
      if (_defaultConstants.DEV && options.__ES6__) {
        (0, _debug.error)('not yet implement deferred properties for ES6 Classes');
      } else {
        deferredInitializer.push({
          cls: cls,
          props: properties,
          mixins: mixins
        });
        cls.__props__ = cls.__values__ = null;
      }
    } else {
      declareProperties(cls, name, properties, base, options.mixins, options.__ES6__);
    } // define statics


    var statics = options.statics;

    if (statics) {
      var staticPropName;

      if (_defaultConstants.DEV) {
        for (staticPropName in statics) {
          if (INVALID_STATICS_DEV.indexOf(staticPropName) !== -1) {
            (0, _debug.errorID)(3642, name, staticPropName, staticPropName);
          }
        }
      }

      for (staticPropName in statics) {
        cls[staticPropName] = statics[staticPropName];
      }
    } // define functions


    for (var funcName in options) {
      if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
        continue;
      }

      var func = options[funcName];

      if (!(0, _preprocessClass.validateMethodWithProps)(func, funcName, name, cls, base)) {
        continue;
      } // use value to redefine some super method defined as getter


      js.value(cls.prototype, funcName, func, true, true);
    }

    var editor = options.editor;

    if (editor) {
      if (js.isChildClassOf(base, _globalExports.legacyCC.Component)) {
        _globalExports.legacyCC.Component._registerEditorProps(cls, editor);
      } else if (_defaultConstants.DEV) {
        (0, _debug.warnID)(3623, name);
      }
    }

    return cls;
  }
  /**
   * @en
   * Checks whether the constructor is created by `Class`.
   * @zh
   * 检查构造函数是否由 `Class` 创建。
   * @method _isCCClass
   * @param {Function} constructor
   * @return {Boolean}
   * @private
   */


  CCClass._isCCClass = function (constructor) {
    return constructor && constructor.hasOwnProperty && constructor.hasOwnProperty('__ctors__'); // is not inherited __ctors__
  }; //
  // Optimized define function only for internal classes
  //
  // @method fastDefine
  // @param {String} className
  // @param {Function} constructor
  // @param {Object} serializableFields
  // @private
  //


  CCClass.fastDefine = function (className, constructor, serializableFields) {
    js.setClassName(className, constructor); // constructor.__ctors__ = constructor.__ctors__ || null;

    var props = constructor.__props__ = constructor.__values__ = Object.keys(serializableFields);
    var attrProtos = attributeUtils.getClassAttrsProto(constructor);

    for (var i = 0; i < props.length; i++) {
      var key = props[i];
      attrProtos[key + DELIMETER + 'visible'] = false;
      attrProtos[key + DELIMETER + 'default'] = serializableFields[key];
    }
  };

  CCClass.Attr = attributeUtils;
  CCClass.attr = attributeUtils.attr;
  /**
   * Return all super classes.
   * @param constructor The Constructor.
   */

  function getInheritanceChain(constructor) {
    var chain = [];

    for (;;) {
      constructor = (0, js.getSuper)(constructor);

      if (!constructor) {
        break;
      }

      if (constructor !== Object) {
        chain.push(constructor);
      }
    }

    return chain;
  }

  CCClass.getInheritanceChain = getInheritanceChain;
  var PrimitiveTypes = {
    // Specify that the input value must be integer in Properties.
    // Also used to indicates that the type of elements in array or the type of value in dictionary is integer.
    Integer: 'Number',
    // Indicates that the type of elements in array or the type of value in dictionary is double.
    Float: 'Number',
    Boolean: 'Boolean',
    String: 'String'
  };
  var tmpAttrs = [];

  function parseAttributes(constructor, attributes, className, propertyName, usedInGetter) {
    var ERR_Type = _defaultConstants.DEV ? 'The %s of %s must be type %s' : '';
    var attrsProto = null;
    var attrsProtoKey = '';

    function getAttrsProto() {
      attrsProtoKey = propertyName + DELIMETER;
      return attrsProto = attributeUtils.getClassAttrsProto(constructor);
    }

    tmpAttrs.length = 0;
    var result = tmpAttrs;

    if ('type' in attributes && typeof attributes.type === 'undefined') {
      (0, _debug.warnID)(3660, propertyName, className);
    }

    var type = attributes.type;

    if (type) {
      var primitiveType = PrimitiveTypes[type];

      if (primitiveType) {
        result.push({
          type: type,
          _onAfterProp: (_defaultConstants.EDITOR || _defaultConstants.TEST) && !attributes._short ? attributeUtils.getTypeChecker(primitiveType, 'cc.' + type) : undefined
        });
      } else if (type === 'Object') {
        if (_defaultConstants.DEV) {
          (0, _debug.errorID)(3644, className, propertyName);
        }
      } // else if (type === Attr.ScriptUuid) {
      //     result.push({
      //         type: 'Script',
      //         ctor: cc.ScriptAsset,
      //     });
      // }
      else if (_typeof(type) === 'object') {
          if (_enum.Enum.isEnum(type)) {
            result.push({
              type: 'Enum',
              enumList: _enum.Enum.getList(type)
            });
          } else if (_index.BitMask.isBitMask(type)) {
            result.push({
              type: 'BitMask',
              bitmaskList: _index.BitMask.getList(type)
            });
          } else if (_defaultConstants.DEV) {
            (0, _debug.errorID)(3645, className, propertyName, type);
          }
        } else if (typeof type === 'function') {
          var typeChecker;

          if ((_defaultConstants.EDITOR || _defaultConstants.TEST) && !attributes._short) {
            typeChecker = attributes.url ? attributeUtils.getTypeChecker('String', 'cc.String') : attributeUtils.getObjTypeChecker(type);
          }

          result.push({
            type: 'Object',
            ctor: type,
            _onAfterProp: typeChecker
          });
        } else if (_defaultConstants.DEV) {
          (0, _debug.errorID)(3646, className, propertyName, type);
        }
    }

    var parseSimpleAttribute = function parseSimpleAttribute(attributeName, expectType) {
      if (attributeName in attributes) {
        var val = attributes[attributeName];

        if (_typeof(val) === expectType) {
          (attrsProto || getAttrsProto())[attrsProtoKey + attributeName] = val;
        } else if (_defaultConstants.DEV) {
          (0, _debug.error)(ERR_Type, attributeName, className, propertyName, expectType);
        }
      }
    };

    if (attributes.editorOnly) {
      if (_defaultConstants.DEV && usedInGetter) {
        (0, _debug.errorID)(3613, 'editorOnly', name, propertyName);
      } else {
        (attrsProto || getAttrsProto())[attrsProtoKey + 'editorOnly'] = true;
      }
    } // parseSimpleAttr('preventDeferredLoad', 'boolean');


    if (_defaultConstants.DEV) {
      parseSimpleAttribute('displayName', 'string');
      parseSimpleAttribute('displayOrder', 'number');
      parseSimpleAttribute('multiline', 'boolean');
      parseSimpleAttribute('radian', 'boolean');

      if (attributes.readonly) {
        (attrsProto || getAttrsProto())[attrsProtoKey + 'readonly'] = true;
      }

      parseSimpleAttribute('tooltip', 'string');
      parseSimpleAttribute('slide', 'boolean');
      parseSimpleAttribute('unit', 'string');
    }

    if (attributes.url) {
      (attrsProto || getAttrsProto())[attrsProtoKey + 'saveUrlAsAsset'] = true;
    }

    if (attributes.__noImplicit) {
      var _attributes$serializa;

      (attrsProto || getAttrsProto())[attrsProtoKey + 'serializable'] = (_attributes$serializa = attributes.serializable) !== null && _attributes$serializa !== void 0 ? _attributes$serializa : false;
    } else {
      if (attributes.serializable === false) {
        if (_defaultConstants.DEV && usedInGetter) {
          (0, _debug.errorID)(3613, 'serializable', name, propertyName);
        } else {
          (attrsProto || getAttrsProto())[attrsProtoKey + 'serializable'] = false;
        }
      }
    }

    parseSimpleAttribute('formerlySerializedAs', 'string');

    if (_defaultConstants.EDITOR) {
      if ('animatable' in attributes) {
        (attrsProto || getAttrsProto())[attrsProtoKey + 'animatable'] = attributes.animatable;
      }
    }

    if (_defaultConstants.DEV) {
      if (attributes.__noImplicit) {
        var _attributes$visible;

        (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = (_attributes$visible = attributes.visible) !== null && _attributes$visible !== void 0 ? _attributes$visible : false;
      } else {
        var visible = attributes.visible;

        if (typeof visible !== 'undefined') {
          if (!visible) {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = false;
          } else if (typeof visible === 'function') {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = visible;
          }
        } else {
          var startsWithUS = propertyName.charCodeAt(0) === 95;

          if (startsWithUS) {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'visible'] = false;
          }
        }
      }
    }

    var range = attributes.range;

    if (range) {
      if (Array.isArray(range)) {
        if (range.length >= 2) {
          (attrsProto || getAttrsProto())[attrsProtoKey + 'min'] = range[0];
          (attrsProto || getAttrsProto())[attrsProtoKey + 'max'] = range[1];

          if (range.length > 2) {
            (attrsProto || getAttrsProto())[attrsProtoKey + 'step'] = range[2];
          }
        } else if (_defaultConstants.DEV) {
          (0, _debug.errorID)(3647);
        }
      } else if (_defaultConstants.DEV) {
        (0, _debug.error)(ERR_Type, 'range', className, propertyName, 'array');
      }
    }

    parseSimpleAttribute('min', 'number');
    parseSimpleAttribute('max', 'number');
    parseSimpleAttribute('step', 'number');
    return result;
  }

  CCClass.isArray = function (defaultVal) {
    defaultVal = getDefault(defaultVal);
    return Array.isArray(defaultVal);
  };

  CCClass.getDefault = getDefault;
  CCClass.escapeForJS = escapeForJS;
  CCClass.IDENTIFIER_RE = IDENTIFIER_RE;
  CCClass.getNewValueTypeCode = _defaultConstants.SUPPORT_JIT && getNewValueTypeCodeJit;
  _globalExports.legacyCC.Class = CCClass;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9jbGFzcy50cyJdLCJuYW1lcyI6WyJERUxJTUVURVIiLCJhdHRyaWJ1dGVVdGlscyIsIkJVSUxUSU5fRU5UUklFUyIsIklOVkFMSURfU1RBVElDU19ERVYiLCJwdXNoVW5pcXVlIiwiYXJyYXkiLCJpdGVtIiwiaW5kZXhPZiIsInB1c2giLCJkZWZlcnJlZEluaXRpYWxpemVyIiwiZGF0YXMiLCJkYXRhIiwic2VsZiIsInNldFRpbWVvdXQiLCJpbml0IiwiaSIsImxlbmd0aCIsImNscyIsInByb3BlcnRpZXMiLCJwcm9wcyIsIm5hbWUiLCJqcyIsImdldENsYXNzTmFtZSIsImRlY2xhcmVQcm9wZXJ0aWVzIiwiJHN1cGVyIiwibWl4aW5zIiwiYXBwZW5kUHJvcCIsIkRFViIsIl9fcHJvcHNfXyIsInRtcEFycmF5IiwiZGVmaW5lUHJvcCIsImNsYXNzTmFtZSIsInByb3BOYW1lIiwidmFsIiwiZXM2IiwiZGVmYXVsdFZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiQ0NDbGFzcyIsImdldEluaGVyaXRhbmNlQ2hhaW4iLCJzb21lIiwieCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5Iiwic2V0Q2xhc3NBdHRyIiwiYXR0cnMiLCJwYXJzZUF0dHJpYnV0ZXMiLCJvbkFmdGVyUHJvcCIsImF0dHIiLCJzZXJpYWxpemFibGUiLCJfX3ZhbHVlc19fIiwiX29uQWZ0ZXJQcm9wIiwiYyIsImRlZmluZUdldFNldCIsImdldHRlciIsImdldCIsInNldHRlciIsInNldCIsInByb3RvIiwiZCIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInNldHRlclVuZGVmaW5lZCIsIkVESVRPUiIsImdldERlZmF1bHQiLCJkZWZhdWx0VmFsIiwiZSIsImxlZ2FjeUNDIiwiX3Rocm93IiwidW5kZWZpbmVkIiwibWl4aW5XaXRoSW5oZXJpdGVkIiwiZGVzdCIsInNyYyIsImZpbHRlciIsInByb3AiLCJkZWZpbmVQcm9wZXJ0eSIsImdldFByb3BlcnR5RGVzY3JpcHRvciIsImRvRGVmaW5lIiwiYmFzZUNsYXNzIiwib3B0aW9ucyIsInNob3VsZEFkZFByb3RvQ3RvciIsIl9fY3Rvcl9fIiwiY3RvciIsIl9fZXM2X18iLCJfX0VTNl9fIiwiY3RvclRvVXNlIiwiX2lzQ0NDbGFzcyIsInRlc3QiLCJfdmFsaWRhdGVDdG9yX0RFViIsImN0b3JzIiwiZmlyZUNsYXNzIiwiX2dldEFsbEN0b3JzIiwiX2NyZWF0ZUN0b3IiLCJ2YWx1ZSIsImV4dGVuZCIsIm0iLCJtaXhpbiIsImdldENsYXNzQXR0cnMiLCJjb25zdHJ1Y3RvciIsIl9faW5pdFByb3BzX18iLCJjb21waWxlUHJvcHMiLCJzZXRDbGFzc05hbWUiLCJkZWZpbmUiLCJDb21wb25lbnQiLCJmcmFtZSIsIlJGIiwicGVlayIsImlzQ2hpbGRDbGFzc09mIiwidXVpZCIsInNjcmlwdCIsImlzUmVuZGVyUGlwZWxpbmUiLCJSZW5kZXJQaXBlbGluZSIsImlzUmVuZGVyRmxvdyIsIlJlbmRlckZsb3ciLCJpc1JlbmRlclN0YWdlIiwiUmVuZGVyU3RhZ2UiLCJpc1JlbmRlciIsInJlbmRlck5hbWUiLCJfc2V0Q2xhc3NJZCIsIndpbmRvdyIsIkVkaXRvckV4dGVuZHMiLCJhZGRNZW51IiwiZW1pdCIsIl9fc2NyaXB0VXVpZCIsIlV1aWRVdGlscyIsImRlY29tcHJlc3NVdWlkIiwibm9ybWFsaXplQ2xhc3NOYW1lX0RFViIsIkRlZmF1bHROYW1lIiwicmVwbGFjZSIsIkZ1bmN0aW9uIiwiZ2V0TmV3VmFsdWVUeXBlQ29kZUppdCIsImNsc05hbWUiLCJ0eXBlIiwicmVzIiwicHJvcFZhbCIsImVzY2FwZUZvckpTIiwicyIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRJbml0UHJvcHNKaXQiLCJwcm9wTGlzdCIsIkYiLCJmdW5jIiwiYXR0cktleSIsInN0YXRlbWVudCIsIklERU5USUZJRVJfUkUiLCJleHByZXNzaW9uIiwiZGVmIiwiVmFsdWVUeXBlIiwiaW5kZXgiLCJpbml0UHJvcHMiLCJnZXRJbml0UHJvcHMiLCJhZHZhbmNlZFByb3BzIiwiYWR2YW5jZWRWYWx1ZXMiLCJzaW1wbGVQcm9wcyIsInNpbXBsZVZhbHVlcyIsImNsb25lIiwiZXJyIiwiYWN0dWFsQ2xhc3MiLCJTVVBQT1JUX0pJVCIsImNhbGwiLCJzdXBlckNhbGxCb3VuZGVkIiwiYm91bmRTdXBlckNhbGxzIiwiY3Rvck5hbWUiLCJib2R5IiwiY3RvckxlbiIsInVzZVRyeUNhdGNoIiwic3RhcnRzV2l0aCIsIlNOSVBQRVQiLCJDbGFzcyIsIl9zdXBlciIsImFwcGx5IiwiYXJndW1lbnRzIiwiX19jdG9yc19fIiwib3JpZ2luQ3RvciIsIlN1cGVyQ2FsbFJlZyIsInJldCIsImdldEN0b3JzIiwiYmFzZU9yTWl4aW5zIiwiY29uY2F0IiwiYiIsImJhc2VPck1peGluIiwiYmFzZUN0b3JzIiwic3VwZXJDbGxSZWdDb25kaXRpb24iLCJ4eXoiLCJ0b1N0cmluZyIsIlN1cGVyQ2FsbFJlZ1N0cmljdCIsImhhc1N1cGVyQ2FsbCIsImZ1bmNOYW1lIiwicGQiLCJzdXBlckZ1bmMiLCJ0bXAiLCJzbGljZSIsImJhc2UiLCJfc2VhbGVkIiwic3RhdGljcyIsInN0YXRpY1Byb3BOYW1lIiwiZWRpdG9yIiwiX3JlZ2lzdGVyRWRpdG9yUHJvcHMiLCJmYXN0RGVmaW5lIiwic2VyaWFsaXphYmxlRmllbGRzIiwia2V5cyIsImF0dHJQcm90b3MiLCJnZXRDbGFzc0F0dHJzUHJvdG8iLCJrZXkiLCJBdHRyIiwiY2hhaW4iLCJQcmltaXRpdmVUeXBlcyIsIkludGVnZXIiLCJGbG9hdCIsIkJvb2xlYW4iLCJTdHJpbmciLCJ0bXBBdHRycyIsImF0dHJpYnV0ZXMiLCJwcm9wZXJ0eU5hbWUiLCJ1c2VkSW5HZXR0ZXIiLCJFUlJfVHlwZSIsImF0dHJzUHJvdG8iLCJhdHRyc1Byb3RvS2V5IiwiZ2V0QXR0cnNQcm90byIsInJlc3VsdCIsInByaW1pdGl2ZVR5cGUiLCJURVNUIiwiX3Nob3J0IiwiZ2V0VHlwZUNoZWNrZXIiLCJFbnVtIiwiaXNFbnVtIiwiZW51bUxpc3QiLCJnZXRMaXN0IiwiQml0TWFzayIsImlzQml0TWFzayIsImJpdG1hc2tMaXN0IiwidHlwZUNoZWNrZXIiLCJ1cmwiLCJnZXRPYmpUeXBlQ2hlY2tlciIsInBhcnNlU2ltcGxlQXR0cmlidXRlIiwiYXR0cmlidXRlTmFtZSIsImV4cGVjdFR5cGUiLCJlZGl0b3JPbmx5IiwicmVhZG9ubHkiLCJfX25vSW1wbGljaXQiLCJhbmltYXRhYmxlIiwidmlzaWJsZSIsInN0YXJ0c1dpdGhVUyIsImNoYXJDb2RlQXQiLCJyYW5nZSIsImdldE5ld1ZhbHVlVHlwZUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbURBLE1BQU1BLFNBQVMsR0FBR0MsY0FBYyxDQUFDRCxTQUFqQztBQUVBLE1BQU1FLGVBQWUsR0FBRyxDQUFDLE1BQUQsRUFBUyxTQUFULEVBQW9CLFFBQXBCLEVBQThCLE1BQTlCLEVBQXNDLFVBQXRDLEVBQWtELFlBQWxELEVBQWdFLFNBQWhFLEVBQTJFLFFBQTNFLEVBQXFGLFNBQXJGLENBQXhCO0FBQ0EsTUFBTUMsbUJBQW1CLEdBQUcsQ0FBQyxNQUFELEVBQVMsV0FBVCxFQUFzQixXQUF0QixFQUFtQyxXQUFuQyxFQUFnRCxNQUFoRCxFQUF3RCxPQUF4RCxFQUFpRSxRQUFqRSxFQUEyRSxRQUEzRSxFQUFxRixXQUFyRixDQUE1Qjs7QUFFQSxXQUFTQyxVQUFULENBQXFCQyxLQUFyQixFQUE0QkMsSUFBNUIsRUFBa0M7QUFDOUIsUUFBSUQsS0FBSyxDQUFDRSxPQUFOLENBQWNELElBQWQsSUFBc0IsQ0FBMUIsRUFBNkI7QUFDekJELE1BQUFBLEtBQUssQ0FBQ0csSUFBTixDQUFXRixJQUFYO0FBQ0g7QUFDSjs7QUFFRCxNQUFNRyxtQkFBd0IsR0FBRztBQUU3QjtBQUNBQyxJQUFBQSxLQUFLLEVBQUUsSUFIc0I7QUFLN0I7QUFDQTtBQUNBRixJQUFBQSxJQVA2QixnQkFPdkJHLElBUHVCLEVB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QVIsQ0FBcEI7QUFDQUEsSUFBQUEsb0JBQW9CLENBQUMsTUFBRCxFQUFTLFFBQVQsQ0FBcEI7QUFFQSxXQUFPZixNQUFQO0FBQ0g7O0FBRUR0TCxFQUFBQSxPQUFPLENBQUNELE9BQVIsR0FBa0IsVUFBVTRCLFVBQVYsRUFBc0I7QUFDcENBLElBQUFBLFVBQVUsR0FBR0QsVUFBVSxDQUFDQyxVQUFELENBQXZCO0FBQ0EsV0FBTzdCLEtBQUssQ0FBQ0MsT0FBTixDQUFjNEIsVUFBZCxDQUFQO0FBQ0gsR0FIRDs7QUFLQTNCLEVBQUFBLE9BQU8sQ0FBQzBCLFVBQVIsR0FBcUJBLFVBQXJCO0FBQ0ExQixFQUFBQSxPQUFPLENBQUNpRyxXQUFSLEdBQXNCQSxXQUF0QjtBQUNBakcsRUFBQUEsT0FBTyxDQUFDMkcsYUFBUixHQUF3QkEsYUFBeEI7QUFDQTNHLEVBQUFBLE9BQU8sQ0FBQ2dOLG1CQUFSLEdBQStCdkYsaUNBQWU3QixzQkFBOUM7QUFFQS9ELDBCQUFTc0csS0FBVCxHQUFpQm5JLE9BQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvbmx5LWFycm93LWZ1bmN0aW9uc1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpwcmVmZXItZm9yLW9mXHJcbi8vIHRzbGludDpkaXNhYmxlOm5vLXNoYWRvd2VkLXZhcmlhYmxlXHJcbi8vIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aFxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpqc2RvYy1mb3JtYXRcclxuLy8gdHNsaW50OmRpc2FibGU6Zm9yaW5cclxuXHJcbmltcG9ydCB7IGVycm9ySUQsIHdhcm5JRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0ICogYXMganMgZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBnZXRTdXBlciB9IGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgY2xvbmVhYmxlX0RFViwgaXNQbGFpbkVtcHR5T2JqX0RFViB9IGZyb20gJy4uL3V0aWxzL21pc2MnO1xyXG5pbXBvcnQgeyBCaXRNYXNrIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBFbnVtIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCAqIGFzIGF0dHJpYnV0ZVV0aWxzIGZyb20gJy4vdXRpbHMvYXR0cmlidXRlJztcclxuaW1wb3J0IHsgSUFjY2VwdGFibGVBdHRyaWJ1dGVzIH0gZnJvbSAnLi91dGlscy9hdHRyaWJ1dGUtZGVmaW5lcyc7XHJcbmltcG9ydCB7IHByZXByb2Nlc3NBdHRycywgdmFsaWRhdGVNZXRob2RXaXRoUHJvcHMgfSBmcm9tICcuL3V0aWxzL3ByZXByb2Nlc3MtY2xhc3MnO1xyXG5pbXBvcnQgKiBhcyBSRiBmcm9tICcuL3V0aWxzL3JlcXVpcmluZy1mcmFtZSc7XHJcbmltcG9ydCB7IGVycm9yIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBERVYsIEVESVRPUiwgU1VQUE9SVF9KSVQsIFRFU1QgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IERFTElNRVRFUiA9IGF0dHJpYnV0ZVV0aWxzLkRFTElNRVRFUjtcclxuXHJcbmNvbnN0IEJVSUxUSU5fRU5UUklFUyA9IFsnbmFtZScsICdleHRlbmRzJywgJ21peGlucycsICdjdG9yJywgJ19fY3Rvcl9fJywgJ3Byb3BlcnRpZXMnLCAnc3RhdGljcycsICdlZGl0b3InLCAnX19FUzZfXyddO1xyXG5jb25zdCBJTlZBTElEX1NUQVRJQ1NfREVWID0gWyduYW1lJywgJ19fY3RvcnNfXycsICdfX3Byb3BzX18nLCAnYXJndW1lbnRzJywgJ2NhbGwnLCAnYXBwbHknLCAnY2FsbGVyJywgJ2xlbmd0aCcsICdwcm90b3R5cGUnXTtcclxuXHJcbmZ1bmN0aW9uIHB1c2hVbmlxdWUgKGFycmF5LCBpdGVtKSB7XHJcbiAgICBpZiAoYXJyYXkuaW5kZXhPZihpdGVtKSA8IDApIHtcclxuICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBkZWZlcnJlZEluaXRpYWxpemVyOiBhbnkgPSB7XHJcblxyXG4gICAgLy8gQ29uZmlncyBmb3IgY2xhc3NlcyB3aGljaCBuZWVkcyBkZWZlcnJlZCBpbml0aWFsaXphdGlvblxyXG4gICAgZGF0YXM6IG51bGwsXHJcblxyXG4gICAgLy8gcmVnaXN0ZXIgbmV3IGNsYXNzXHJcbiAgICAvLyBkYXRhIC0ge2NsczogY2xzLCBjYjogcHJvcGVydGllcywgbWl4aW5zOiBvcHRpb25zLm1peGluc31cclxuICAgIHB1c2ggKGRhdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhcykge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFzID0gW2RhdGFdO1xyXG4gICAgICAgICAgICAvLyBzdGFydCBhIG5ldyB0aW1lciB0byBpbml0aWFsaXplXHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaW5pdCgpO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQgKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGFzID0gdGhpcy5kYXRhcztcclxuICAgICAgICBpZiAoZGF0YXMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGRhdGFzW2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2xzID0gZGF0YS5jbHM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcGVydGllcyA9IGRhdGEucHJvcHM7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGpzLmdldENsYXNzTmFtZShjbHMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWNsYXJlUHJvcGVydGllcyhjbHMsIG5hbWUsIHByb3BlcnRpZXMsIGNscy4kc3VwZXIsIGRhdGEubWl4aW5zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9ySUQoMzYzMywgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kYXRhcyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxufTtcclxuXHJcbi8vIGJvdGggZ2V0dGVyIGFuZCBwcm9wIG11c3QgcmVnaXN0ZXIgdGhlIG5hbWUgaW50byBfX3Byb3BzX18gYXJyYXlcclxuZnVuY3Rpb24gYXBwZW5kUHJvcCAoY2xzLCBuYW1lKSB7XHJcbiAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgLy8gaWYgKCFJREVOVElGSUVSX1JFLnRlc3QobmFtZSkpIHtcclxuICAgICAgICAvLyAgICBlcnJvcignVGhlIHByb3BlcnR5IG5hbWUgXCInICsgbmFtZSArICdcIiBpcyBub3QgY29tcGxpYW50IHdpdGggSmF2YVNjcmlwdCBuYW1pbmcgc3RhbmRhcmRzJyk7XHJcbiAgICAgICAgLy8gICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBpZiAobmFtZS5pbmRleE9mKCcuJykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzYzNCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdXNoVW5pcXVlKGNscy5fX3Byb3BzX18sIG5hbWUpO1xyXG59XHJcblxyXG5jb25zdCB0bXBBcnJheSA9IFtdO1xyXG5mdW5jdGlvbiBkZWZpbmVQcm9wIChjbHMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KSB7XHJcbiAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSB2YWwuZGVmYXVsdDtcclxuXHJcbiAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgaWYgKCFlczYpIHtcclxuICAgICAgICAgICAgLy8gY2hlY2sgZGVmYXVsdCBvYmplY3QgdmFsdWVcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0VmFsdWUgPT09ICdvYmplY3QnICYmIGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGVmYXVsdFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGFycmF5IGVtcHR5XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ySUQoMzYzNSwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIWlzUGxhaW5FbXB0eU9ial9ERVYoZGVmYXVsdFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGNsb25lYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2xvbmVhYmxlX0RFVihkZWZhdWx0VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ySUQoMzYzNiwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjaGVjayBiYXNlIHByb3RvdHlwZSB0byBhdm9pZCBuYW1lIGNvbGxpc2lvblxyXG4gICAgICAgIGlmIChDQ0NsYXNzLmdldEluaGVyaXRhbmNlQ2hhaW4oY2xzKVxyXG4gICAgICAgICAgICAuc29tZShmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpOyB9KSkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDM2MzcsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2V0IGRlZmF1bHQgdmFsdWVcclxuICAgIGF0dHJpYnV0ZVV0aWxzLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnZGVmYXVsdCcsIGRlZmF1bHRWYWx1ZSk7XHJcblxyXG4gICAgYXBwZW5kUHJvcChjbHMsIHByb3BOYW1lKTtcclxuXHJcbiAgICAvLyBhcHBseSBhdHRyaWJ1dGVzXHJcbiAgICBjb25zdCBhdHRycyA9IHBhcnNlQXR0cmlidXRlcyhjbHMsIHZhbCwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgZmFsc2UpO1xyXG4gICAgaWYgKGF0dHJzKSB7XHJcbiAgICAgICAgY29uc3Qgb25BZnRlclByb3A6IGFueVtdID0gdG1wQXJyYXk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyOiBhbnkgPSBhdHRyc1tpXTtcclxuICAgICAgICAgICAgYXR0cmlidXRlVXRpbHMuYXR0cihjbHMsIHByb3BOYW1lLCBhdHRyKTtcclxuICAgICAgICAgICAgaWYgKGF0dHIuc2VyaWFsaXphYmxlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcHVzaFVuaXF1ZShjbHMuX192YWx1ZXNfXywgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGNhbGxiYWNrXHJcbiAgICAgICAgICAgIGlmIChhdHRyLl9vbkFmdGVyUHJvcCkge1xyXG4gICAgICAgICAgICAgICAgb25BZnRlclByb3AucHVzaChhdHRyLl9vbkFmdGVyUHJvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2FsbCBjYWxsYmFja1xyXG4gICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgb25BZnRlclByb3AubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgb25BZnRlclByb3BbY10oY2xzLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRtcEFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgYXR0cnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmaW5lR2V0U2V0IChjbHMsIG5hbWUsIHByb3BOYW1lLCB2YWwsIGVzNikge1xyXG4gICAgY29uc3QgZ2V0dGVyID0gdmFsLmdldDtcclxuICAgIGNvbnN0IHNldHRlciA9IHZhbC5zZXQ7XHJcbiAgICBjb25zdCBwcm90byA9IGNscy5wcm90b3R5cGU7XHJcbiAgICBjb25zdCBkID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgcHJvcE5hbWUpO1xyXG4gICAgY29uc3Qgc2V0dGVyVW5kZWZpbmVkID0gIWQ7XHJcblxyXG4gICAgaWYgKGdldHRlcikge1xyXG4gICAgICAgIGlmIChERVYgJiYgIWVzNiAmJiBkICYmIGQuZ2V0KSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzYzOCwgbmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhdHRycyA9IHBhcnNlQXR0cmlidXRlcyhjbHMsIHZhbCwgbmFtZSwgcHJvcE5hbWUsIHRydWUpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYXR0cmlidXRlVXRpbHMuYXR0cihjbHMsIHByb3BOYW1lLCBhdHRyc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGF0dHJzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGF0dHJpYnV0ZVV0aWxzLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnc2VyaWFsaXphYmxlJywgZmFsc2UpO1xyXG5cclxuICAgICAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgICAgIC8vIOS4jeiuuuaYr+WQpiB2aXNpYmxlIOmDveimgea3u+WKoOWIsCBwcm9wc++8jOWQpuWImSBhc3NldCB3YXRjaGVyIOS4jeiDveato+W4uOW3peS9nFxyXG4gICAgICAgICAgICBhcHBlbmRQcm9wKGNscywgcHJvcE5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFlczYpIHtcclxuICAgICAgICAgICAganMuZ2V0KHByb3RvLCBwcm9wTmFtZSwgZ2V0dGVyLCBzZXR0ZXJVbmRlZmluZWQsIHNldHRlclVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoRURJVE9SIHx8IERFVikge1xyXG4gICAgICAgICAgICBhdHRyaWJ1dGVVdGlscy5zZXRDbGFzc0F0dHIoY2xzLCBwcm9wTmFtZSwgJ2hhc0dldHRlcicsIHRydWUpOyAvLyDmlrnkvr8gZWRpdG9yIOWBmuWIpOaWrVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2V0dGVyKSB7XHJcbiAgICAgICAgaWYgKCFlczYpIHtcclxuICAgICAgICAgICAgaWYgKERFViAmJiBkICYmIGQuc2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3JJRCgzNjQwLCBuYW1lLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAganMuc2V0KHByb3RvLCBwcm9wTmFtZSwgc2V0dGVyLCBzZXR0ZXJVbmRlZmluZWQsIHNldHRlclVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChFRElUT1IgfHwgREVWKSB7XHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZVV0aWxzLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnaGFzU2V0dGVyJywgdHJ1ZSk7IC8vIOaWueS+vyBlZGl0b3Ig5YGa5Yik5patXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREZWZhdWx0IChkZWZhdWx0VmFsKSB7XHJcbiAgICBpZiAodHlwZW9mIGRlZmF1bHRWYWwgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5fdGhyb3coZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkZWZhdWx0VmFsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtaXhpbldpdGhJbmhlcml0ZWQgKGRlc3QsIHNyYywgZmlsdGVyPykge1xyXG4gICAgZm9yIChjb25zdCBwcm9wIGluIHNyYykge1xyXG4gICAgICAgIGlmICghZGVzdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAoIWZpbHRlciB8fCBmaWx0ZXIocHJvcCkpKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZXN0LCBwcm9wLCBqcy5nZXRQcm9wZXJ0eURlc2NyaXB0b3Ioc3JjLCBwcm9wKSEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZG9EZWZpbmUgKGNsYXNzTmFtZSwgYmFzZUNsYXNzLCBtaXhpbnMsIG9wdGlvbnMpIHtcclxuICAgIGxldCBzaG91bGRBZGRQcm90b0N0b3I7XHJcbiAgICBjb25zdCBfX2N0b3JfXyA9IG9wdGlvbnMuX19jdG9yX187XHJcbiAgICBsZXQgY3RvciA9IG9wdGlvbnMuY3RvcjtcclxuICAgIGNvbnN0IF9fZXM2X18gPSBvcHRpb25zLl9fRVM2X187XHJcblxyXG4gICAgaWYgKERFVikge1xyXG4gICAgICAgIC8vIGNoZWNrIGN0b3JcclxuICAgICAgICBjb25zdCBjdG9yVG9Vc2UgPSBfX2N0b3JfXyB8fCBjdG9yO1xyXG4gICAgICAgIGlmIChjdG9yVG9Vc2UpIHtcclxuICAgICAgICAgICAgaWYgKENDQ2xhc3MuX2lzQ0NDbGFzcyhjdG9yVG9Vc2UpKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDM2MTgsIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGN0b3JUb1VzZSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCgzNjE5LCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhc2VDbGFzcyAmJiAvXFxicHJvdG90eXBlLmN0b3JcXGIvLnRlc3QoY3RvclRvVXNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfX2VzNl9fKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ySUQoMzY1MSwgY2xhc3NOYW1lIHx8ICcnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5JRCgzNjAwLCBjbGFzc05hbWUgfHwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRBZGRQcm90b0N0b3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9fY3Rvcl9fKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JJRCgzNjQ5LCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RvciA9IG9wdGlvbnMuY3RvciA9IF92YWxpZGF0ZUN0b3JfREVWKGN0b3IsIGJhc2VDbGFzcywgY2xhc3NOYW1lLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgY3RvcnM7XHJcbiAgICBsZXQgZmlyZUNsYXNzO1xyXG4gICAgaWYgKF9fZXM2X18pIHtcclxuICAgICAgICBjdG9ycyA9IFtjdG9yXTtcclxuICAgICAgICBmaXJlQ2xhc3MgPSBjdG9yO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY3RvcnMgPSBfX2N0b3JfXyA/IFtfX2N0b3JfX10gOiBfZ2V0QWxsQ3RvcnMoYmFzZUNsYXNzLCBtaXhpbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgIGZpcmVDbGFzcyA9IF9jcmVhdGVDdG9yKGN0b3JzLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIGV4dGVuZCAtIENyZWF0ZSBhIG5ldyBDbGFzcyB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBDbGFzc1xyXG4gICAgICAgIGpzLnZhbHVlKGZpcmVDbGFzcywgJ2V4dGVuZCcsIGZ1bmN0aW9uICh0aGlzOiBhbnksIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5leHRlbmRzID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIENDQ2xhc3Mob3B0aW9ucyk7XHJcbiAgICAgICAgfSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAganMudmFsdWUoZmlyZUNsYXNzLCAnX19jdG9yc19fJywgY3RvcnMubGVuZ3RoID4gMCA/IGN0b3JzIDogbnVsbCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IHByb3RvdHlwZSA9IGZpcmVDbGFzcy5wcm90b3R5cGU7XHJcbiAgICBpZiAoYmFzZUNsYXNzKSB7XHJcbiAgICAgICAgaWYgKCFfX2VzNl9fKSB7XHJcbiAgICAgICAgICAgIGpzLmV4dGVuZChmaXJlQ2xhc3MsIGJhc2VDbGFzcyk7ICAgICAgICAvLyDov5nph4zkvJrmiorniLbnsbvnmoQgX19wcm9wc19fIOWkjeWItue7meWtkOexu1xyXG4gICAgICAgICAgICBwcm90b3R5cGUgPSBmaXJlQ2xhc3MucHJvdG90eXBlOyAgICAgICAgLy8gZ2V0IGV4dGVuZGVkIHByb3RvdHlwZVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaXJlQ2xhc3MuJHN1cGVyID0gYmFzZUNsYXNzO1xyXG4gICAgICAgIGlmIChERVYgJiYgc2hvdWxkQWRkUHJvdG9DdG9yKSB7XHJcbiAgICAgICAgICAgIHByb3RvdHlwZS5jdG9yID0gZnVuY3Rpb24gKCkgeyB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobWl4aW5zKSB7XHJcbiAgICAgICAgZm9yIChsZXQgbSA9IG1peGlucy5sZW5ndGggLSAxOyBtID49IDA7IG0tLSkge1xyXG4gICAgICAgICAgICBjb25zdCBtaXhpbiA9IG1peGluc1ttXTtcclxuICAgICAgICAgICAgbWl4aW5XaXRoSW5oZXJpdGVkKHByb3RvdHlwZSwgbWl4aW4ucHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIG1peGluIHN0YXRpY3MgKHRoaXMgd2lsbCBhbHNvIGNvcHkgZWRpdG9yIGF0dHJpYnV0ZXMgZm9yIGNvbXBvbmVudClcclxuICAgICAgICAgICAgbWl4aW5XaXRoSW5oZXJpdGVkKGZpcmVDbGFzcywgbWl4aW4sIGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWl4aW4uaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFERVYgfHwgSU5WQUxJRF9TVEFUSUNTX0RFVi5pbmRleE9mKHByb3ApIDwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gbWl4aW4gYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBpZiAoQ0NDbGFzcy5faXNDQ0NsYXNzKG1peGluKSkge1xyXG4gICAgICAgICAgICAgICAgbWl4aW5XaXRoSW5oZXJpdGVkKFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZVV0aWxzLmdldENsYXNzQXR0cnMoZmlyZUNsYXNzKS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlVXRpbHMuZ2V0Q2xhc3NBdHRycyhtaXhpbikuY29uc3RydWN0b3IucHJvdG90eXBlLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXN0b3JlIGNvbnN0dWN0b3Igb3ZlcnJpZGRlbiBieSBtaXhpblxyXG4gICAgICAgIHByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGZpcmVDbGFzcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIV9fZXM2X18pIHtcclxuICAgICAgICBwcm90b3R5cGUuX19pbml0UHJvcHNfXyA9IGNvbXBpbGVQcm9wcztcclxuICAgIH1cclxuXHJcbiAgICBqcy5zZXRDbGFzc05hbWUoY2xhc3NOYW1lLCBmaXJlQ2xhc3MpO1xyXG4gICAgcmV0dXJuIGZpcmVDbGFzcztcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmaW5lIChjbGFzc05hbWUsIGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBDb21wb25lbnQgPSBsZWdhY3lDQy5Db21wb25lbnQ7XHJcbiAgICBjb25zdCBmcmFtZSA9IFJGLnBlZWsoKTtcclxuXHJcbiAgICBpZiAoZnJhbWUgJiYganMuaXNDaGlsZENsYXNzT2YoYmFzZUNsYXNzLCBDb21wb25lbnQpKSB7XHJcbiAgICAgICAgLy8gcHJvamVjdCBjb21wb25lbnRcclxuICAgICAgICBpZiAoanMuaXNDaGlsZENsYXNzT2YoZnJhbWUuY2xzLCBDb21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzYxNSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoREVWICYmIGZyYW1lLnV1aWQgJiYgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIC8vIHdhcm5JRCgzNjE2LCBjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUgfHwgZnJhbWUuc2NyaXB0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBpZiAoIW9wdGlvbnMuX19FUzZfXykge1xyXG4gICAgICAgICAgICB3YXJuSUQoMzY2MSwgY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBjbHMgPSBkb0RlZmluZShjbGFzc05hbWUsIGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKTtcclxuXHJcbiAgICAvLyBmb3IgUmVuZGVyUGlwZWxpbmUsIFJlbmRlckZsb3csIFJlbmRlclN0YWdlXHJcbiAgICBjb25zdCBpc1JlbmRlclBpcGVsaW5lID0ganMuaXNDaGlsZENsYXNzT2YoYmFzZUNsYXNzLCBsZWdhY3lDQy5SZW5kZXJQaXBlbGluZSk7XHJcbiAgICBjb25zdCBpc1JlbmRlckZsb3cgPSBqcy5pc0NoaWxkQ2xhc3NPZihiYXNlQ2xhc3MsIGxlZ2FjeUNDLlJlbmRlckZsb3cpO1xyXG4gICAgY29uc3QgaXNSZW5kZXJTdGFnZSA9IGpzLmlzQ2hpbGRDbGFzc09mKGJhc2VDbGFzcywgbGVnYWN5Q0MuUmVuZGVyU3RhZ2UpO1xyXG5cclxuICAgIGNvbnN0IGlzUmVuZGVyID0gaXNSZW5kZXJQaXBlbGluZSB8fCBpc1JlbmRlckZsb3cgfHwgaXNSZW5kZXJTdGFnZSB8fCBmYWxzZTtcclxuXHJcbiAgICBpZiAoaXNSZW5kZXIpIHtcclxuICAgICAgICBsZXQgcmVuZGVyTmFtZSA9ICcnO1xyXG4gICAgICAgIGlmIChpc1JlbmRlclBpcGVsaW5lKSB7XHJcbiAgICAgICAgICAgIHJlbmRlck5hbWUgPSAncmVuZGVyX3BpcGVsaW5lJztcclxuICAgICAgICB9IGVsc2UgaWYgKGlzUmVuZGVyRmxvdykge1xyXG4gICAgICAgICAgICByZW5kZXJOYW1lID0gJ3JlbmRlcl9mbG93JztcclxuICAgICAgICB9IGVsc2UgaWYgKGlzUmVuZGVyU3RhZ2UpIHtcclxuICAgICAgICAgICAgcmVuZGVyTmFtZSA9ICdyZW5kZXJfc3RhZ2UnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlbmRlck5hbWUpIHtcclxuICAgICAgICAgICAganMuX3NldENsYXNzSWQoY2xhc3NOYW1lLCBjbHMpO1xyXG4gICAgICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDlop7liqDkuoYgaGlkZGVuOiDlvIDlpLTmoIfor4bvvIzkvb/lroPmnIDnu4jkuI3kvJrmmL7npLrlnKggRWRpdG9yIGluc3BlY3RvciDnmoTmt7vliqDnu4Tku7bliJfooajph4xcclxuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtZXhwcmVzc2lvblxyXG4gICAgICAgICAgICAgICAgd2luZG93LkVkaXRvckV4dGVuZHMgJiYgd2luZG93LkVkaXRvckV4dGVuZHMuQ29tcG9uZW50LmFkZE1lbnUoY2xzLCBgaGlkZGVuOiR7cmVuZGVyTmFtZX0vJHtjbGFzc05hbWV9YCwgLTEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAvLyBOb3RlOiBgb3B0aW9ucy5jdG9yYCBzaG91bGQgYmUgc2FtZSBhcyBgY2xzYCBleGNlcHQgaWZcclxuICAgICAgICAvLyBjYy1jbGFzcyBpcyBkZWZpbmVkIGJ5IGBjYy5DbGFzcyh7LyogLi4uICovfSlgLlxyXG4gICAgICAgIC8vIEluIHN1Y2ggY2FzZSwgYG9wdGlvbnMuY3RvcmAgbWF5IGJlIGB1bmRlZmluZWRgLlxyXG4gICAgICAgIC8vIFNvIHdlIGNhbiBub3QgdXNlIGBvcHRpb25zLmN0b3JgLiBJbnN0ZWFkIHdlIHNob3VsZCB1c2UgYGNsc2Agd2hpY2ggaXMgdGhlIFwicmVhbFwiIHJlZ2lzdGVyZWQgY2MtY2xhc3MuXHJcbiAgICAgICAgRWRpdG9yRXh0ZW5kcy5lbWl0KCdjbGFzcy1yZWdpc3RlcmVkJywgY2xzLCBmcmFtZSwgY2xhc3NOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZnJhbWUpIHtcclxuICAgICAgICAvLyDln7rnoYDnmoQgdHMsIGpzIOiEmuacrOe7hOS7tlxyXG4gICAgICAgIGlmIChqcy5pc0NoaWxkQ2xhc3NPZihiYXNlQ2xhc3MsIENvbXBvbmVudCkpIHtcclxuICAgICAgICAgICAgY29uc3QgdXVpZCA9IGZyYW1lLnV1aWQ7XHJcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICBqcy5fc2V0Q2xhc3NJZCh1dWlkLCBjbHMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNscy5wcm90b3R5cGUuX19zY3JpcHRVdWlkID0gRWRpdG9yRXh0ZW5kcy5VdWlkVXRpbHMuZGVjb21wcmVzc1V1aWQodXVpZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnJhbWUuY2xzID0gY2xzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghanMuaXNDaGlsZENsYXNzT2YoZnJhbWUuY2xzLCBDb21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgIGZyYW1lLmNscyA9IGNscztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBub3JtYWxpemVDbGFzc05hbWVfREVWIChjbGFzc05hbWUpIHtcclxuICAgIGNvbnN0IERlZmF1bHROYW1lID0gJ0NDQ2xhc3MnO1xyXG4gICAgaWYgKGNsYXNzTmFtZSkge1xyXG4gICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC9eW14kQS1aYS16X10vLCAnXycpLnJlcGxhY2UoL1teMC05QS1aYS16XyRdL2csICdfJyk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gdmFsaWRhdGUgbmFtZVxyXG4gICAgICAgICAgICBGdW5jdGlvbignZnVuY3Rpb24gJyArIGNsYXNzTmFtZSArICcoKXt9JykoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIERlZmF1bHROYW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXROZXdWYWx1ZVR5cGVDb2RlSml0ICh2YWx1ZSkge1xyXG4gICAgY29uc3QgY2xzTmFtZSA9IGpzLmdldENsYXNzTmFtZSh2YWx1ZSk7XHJcbiAgICBjb25zdCB0eXBlID0gdmFsdWUuY29uc3RydWN0b3I7XHJcbiAgICBsZXQgcmVzID0gJ25ldyAnICsgY2xzTmFtZSArICcoJztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZS5fX3Byb3BzX18ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBwcm9wID0gdHlwZS5fX3Byb3BzX19baV07XHJcbiAgICAgICAgY29uc3QgcHJvcFZhbCA9IHZhbHVlW3Byb3BdO1xyXG4gICAgICAgIGlmIChERVYgJiYgdHlwZW9mIHByb3BWYWwgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzY0MSwgY2xzTmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiAnbmV3ICcgKyBjbHNOYW1lICsgJygpJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzICs9IHByb3BWYWw7XHJcbiAgICAgICAgaWYgKGkgPCB0eXBlLl9fcHJvcHNfXy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIHJlcyArPSAnLCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcyArICcpJztcclxufVxyXG5cclxuLy8gVE9ETyAtIG1vdmUgZXNjYXBlRm9ySlMsIElERU5USUZJRVJfUkUsIGdldE5ld1ZhbHVlVHlwZUNvZGVKaXQgdG8gbWlzYy5qcyBvciBhIG5ldyBzb3VyY2UgZmlsZVxyXG5cclxuLy8gY29udmVydCBhIG5vcm1hbCBzdHJpbmcgaW5jbHVkaW5nIG5ld2xpbmVzLCBxdW90ZXMgYW5kIHVuaWNvZGUgY2hhcmFjdGVycyBpbnRvIGEgc3RyaW5nIGxpdGVyYWxcclxuLy8gcmVhZHkgdG8gdXNlIGluIEphdmFTY3JpcHQgc291cmNlXHJcbmZ1bmN0aW9uIGVzY2FwZUZvckpTIChzKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocykuXHJcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0pTT04vc3RyaW5naWZ5XHJcbiAgICAgICAgcmVwbGFjZSgvXFx1MjAyOC9nLCAnXFxcXHUyMDI4JykuXHJcbiAgICAgICAgcmVwbGFjZSgvXFx1MjAyOS9nLCAnXFxcXHUyMDI5Jyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluaXRQcm9wc0ppdCAoYXR0cnMsIHByb3BMaXN0KSB7XHJcbiAgICAvLyBmdW5jdGlvbnMgZm9yIGdlbmVyYXRlZCBjb2RlXHJcbiAgICBjb25zdCBGOiBhbnlbXSA9IFtdO1xyXG4gICAgbGV0IGZ1bmMgPSAnJztcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcCA9IHByb3BMaXN0W2ldO1xyXG4gICAgICAgIGNvbnN0IGF0dHJLZXkgPSBwcm9wICsgREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xyXG4gICAgICAgIGlmIChhdHRyS2V5IGluIGF0dHJzKSB7ICAvLyBnZXR0ZXIgZG9lcyBub3QgaGF2ZSBkZWZhdWx0XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmIChJREVOVElGSUVSX1JFLnRlc3QocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9ICd0aGlzLicgKyBwcm9wICsgJz0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gJ3RoaXNbJyArIGVzY2FwZUZvckpTKHByb3ApICsgJ109JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgY29uc3QgZGVmID0gYXR0cnNbYXR0cktleV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmID09PSAnb2JqZWN0JyAmJiBkZWYpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkZWYgaW5zdGFuY2VvZiBsZWdhY3lDQy5WYWx1ZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZ2V0TmV3VmFsdWVUeXBlQ29kZUppdChkZWYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWYpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9ICdbXSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJ3t9JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IEYubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgRi5wdXNoKGRlZik7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gJ0ZbJyArIGluZGV4ICsgJ10oKSc7XHJcbiAgICAgICAgICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYyArPSAndHJ5IHtcXG4nICsgc3RhdGVtZW50ICsgZXhwcmVzc2lvbiArICc7XFxufVxcbmNhdGNoKGUpIHtcXG5jYy5fdGhyb3coZSk7XFxuJyArIHN0YXRlbWVudCArICd1bmRlZmluZWQ7XFxufVxcbic7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBlc2NhcGVGb3JKUyhkZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gbnVtYmVyLCBib29sZWFuLCBudWxsLCB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBkZWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdGVtZW50ID0gc3RhdGVtZW50ICsgZXhwcmVzc2lvbiArICc7XFxuJztcclxuICAgICAgICAgICAgZnVuYyArPSBzdGF0ZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIChURVNUICYmICFpc1BoYW50b21KUykge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGZ1bmMpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIGxldCBpbml0UHJvcHM7XHJcbiAgICBpZiAoRi5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBpbml0UHJvcHMgPSBGdW5jdGlvbihmdW5jKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGluaXRQcm9wcyA9IEZ1bmN0aW9uKCdGJywgJ3JldHVybiAoZnVuY3Rpb24oKXtcXG4nICsgZnVuYyArICd9KScpKEYpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBpbml0UHJvcHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluaXRQcm9wcyAoYXR0cnMsIHByb3BMaXN0KSB7XHJcbiAgICBjb25zdCBhZHZhbmNlZFByb3BzOiBhbnlbXSA9IFtdO1xyXG4gICAgY29uc3QgYWR2YW5jZWRWYWx1ZXM6IGFueVtdID0gW107XHJcbiAgICBjb25zdCBzaW1wbGVQcm9wczogYW55W10gPSBbXTtcclxuICAgIGNvbnN0IHNpbXBsZVZhbHVlczogYW55W10gPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BMaXN0Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcCA9IHByb3BMaXN0W2ldO1xyXG4gICAgICAgIGNvbnN0IGF0dHJLZXkgPSBwcm9wICsgREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xyXG4gICAgICAgIGlmIChhdHRyS2V5IGluIGF0dHJzKSB7IC8vIGdldHRlciBkb2VzIG5vdCBoYXZlIGRlZmF1bHRcclxuICAgICAgICAgICAgY29uc3QgZGVmID0gYXR0cnNbYXR0cktleV07XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIGRlZiA9PT0gJ29iamVjdCcgJiYgZGVmKSB8fCB0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBhZHZhbmNlZFByb3BzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgICAgICBhZHZhbmNlZFZhbHVlcy5wdXNoKGRlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBudW1iZXIsIGJvb2xlYW4sIG51bGwsIHVuZGVmaW5lZCwgc3RyaW5nXHJcbiAgICAgICAgICAgICAgICBzaW1wbGVQcm9wcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgc2ltcGxlVmFsdWVzLnB1c2goZGVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltcGxlUHJvcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpc1tzaW1wbGVQcm9wc1tpXV0gPSBzaW1wbGVWYWx1ZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWR2YW5jZWRQcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wID0gYWR2YW5jZWRQcm9wc1tpXTtcclxuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb247XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZiA9IGFkdmFuY2VkVmFsdWVzW2ldO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlZiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkZWYgaW5zdGFuY2VvZiBsZWdhY3lDQy5WYWx1ZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZGVmLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRlZikpIHtcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkZWYgaXMgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZGVmKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVnYWN5Q0MuX3Rocm93KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBkZWYoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzW3Byb3BdID0gZXhwcmVzc2lvbjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG4vLyBzaW1wbGUgdGVzdCB2YXJpYWJsZSBuYW1lXHJcbmNvbnN0IElERU5USUZJRVJfUkUgPSAvXltBLVphLXpfJF1bMC05QS1aYS16XyRdKiQvO1xyXG5cclxuZnVuY3Rpb24gY29tcGlsZVByb3BzICh0aGlzOiBhbnksIGFjdHVhbENsYXNzKSB7XHJcbiAgICAvLyBpbml0IGRlZmVycmVkIHByb3BlcnRpZXNcclxuICAgIGNvbnN0IGF0dHJzID0gYXR0cmlidXRlVXRpbHMuZ2V0Q2xhc3NBdHRycyhhY3R1YWxDbGFzcyk7XHJcbiAgICBsZXQgcHJvcExpc3QgPSBhY3R1YWxDbGFzcy5fX3Byb3BzX187XHJcbiAgICBpZiAocHJvcExpc3QgPT09IG51bGwpIHtcclxuICAgICAgICBkZWZlcnJlZEluaXRpYWxpemVyLmluaXQoKTtcclxuICAgICAgICBwcm9wTGlzdCA9IGFjdHVhbENsYXNzLl9fcHJvcHNfXztcclxuICAgIH1cclxuXHJcbiAgICAvLyBPdmVyd2l0ZSBfX2luaXRQcm9wc19fIHRvIGF2b2lkIGNvbXBpbGUgYWdhaW4uXHJcbiAgICBjb25zdCBpbml0UHJvcHMgPSBTVVBQT1JUX0pJVCA/IGdldEluaXRQcm9wc0ppdChhdHRycywgcHJvcExpc3QpIDogZ2V0SW5pdFByb3BzKGF0dHJzLCBwcm9wTGlzdCk7XHJcbiAgICBhY3R1YWxDbGFzcy5wcm90b3R5cGUuX19pbml0UHJvcHNfXyA9IGluaXRQcm9wcztcclxuXHJcbiAgICAvLyBjYWxsIGluc3RhbnRpYXRlUHJvcHMgaW1tZWRpYXRlbHksIG5vIG5lZWQgdG8gcGFzcyBhY3R1YWxDbGFzcyBpbnRvIGl0IGFueW1vcmVcclxuICAgIC8vICh1c2UgY2FsbCB0byBtYW51YWxseSBiaW5kIGB0aGlzYCBiZWNhdXNlIGB0aGlzYCBtYXkgbm90IGluc3RhbmNlb2YgYWN0dWFsQ2xhc3MpXHJcbiAgICBpbml0UHJvcHMuY2FsbCh0aGlzKTtcclxufVxyXG5cclxuY29uc3QgX2NyZWF0ZUN0b3IgPSBTVVBQT1JUX0pJVCA/IGZ1bmN0aW9uIChjdG9ycywgYmFzZUNsYXNzLCBjbGFzc05hbWUsIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHN1cGVyQ2FsbEJvdW5kZWQgPSBiYXNlQ2xhc3MgJiYgYm91bmRTdXBlckNhbGxzKGJhc2VDbGFzcywgb3B0aW9ucywgY2xhc3NOYW1lKTtcclxuXHJcbiAgICBjb25zdCBjdG9yTmFtZSA9IERFViA/IG5vcm1hbGl6ZUNsYXNzTmFtZV9ERVYoY2xhc3NOYW1lKSA6ICdDQ0NsYXNzJztcclxuICAgIGxldCBib2R5ID0gJ3JldHVybiBmdW5jdGlvbiAnICsgY3Rvck5hbWUgKyAnKCl7XFxuJztcclxuXHJcbiAgICBpZiAoc3VwZXJDYWxsQm91bmRlZCkge1xyXG4gICAgICAgIGJvZHkgKz0gJ3RoaXMuX3N1cGVyPW51bGw7XFxuJztcclxuICAgIH1cclxuXHJcbiAgICAvLyBpbnN0YW50aWF0ZSBwcm9wc1xyXG4gICAgYm9keSArPSAndGhpcy5fX2luaXRQcm9wc19fKCcgKyBjdG9yTmFtZSArICcpO1xcbic7XHJcblxyXG4gICAgLy8gY2FsbCB1c2VyIGNvbnN0cnVjdG9yc1xyXG4gICAgY29uc3QgY3RvckxlbiA9IGN0b3JzLmxlbmd0aDtcclxuICAgIGlmIChjdG9yTGVuID4gMCkge1xyXG4gICAgICAgIGNvbnN0IHVzZVRyeUNhdGNoID0gREVWICYmICEoY2xhc3NOYW1lICYmIGNsYXNzTmFtZS5zdGFydHNXaXRoKCdjYy4nKSk7XHJcbiAgICAgICAgaWYgKHVzZVRyeUNhdGNoKSB7XHJcbiAgICAgICAgICAgIGJvZHkgKz0gJ3RyeXtcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBTTklQUEVUID0gJ10uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xcbic7XHJcbiAgICAgICAgaWYgKGN0b3JMZW4gPT09IDEpIHtcclxuICAgICAgICAgICAgYm9keSArPSBjdG9yTmFtZSArICcuX19jdG9yc19fWzAnICsgU05JUFBFVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGJvZHkgKz0gJ3ZhciBjcz0nICsgY3Rvck5hbWUgKyAnLl9fY3RvcnNfXztcXG4nO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0b3JMZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYm9keSArPSAnY3NbJyArIGkgKyBTTklQUEVUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1c2VUcnlDYXRjaCkge1xyXG4gICAgICAgICAgICBib2R5ICs9ICd9Y2F0Y2goZSl7XFxuJyArXHJcbiAgICAgICAgICAgICAgICAnY2MuX3Rocm93KGUpO1xcbicgK1xyXG4gICAgICAgICAgICAgICAgJ31cXG4nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGJvZHkgKz0gJ30nO1xyXG5cclxuICAgIHJldHVybiBGdW5jdGlvbihib2R5KSgpO1xyXG59IDogZnVuY3Rpb24gKGN0b3JzLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3VwZXJDYWxsQm91bmRlZCA9IGJhc2VDbGFzcyAmJiBib3VuZFN1cGVyQ2FsbHMoYmFzZUNsYXNzLCBvcHRpb25zLCBjbGFzc05hbWUpO1xyXG4gICAgY29uc3QgY3RvckxlbiA9IGN0b3JzLmxlbmd0aDtcclxuXHJcbiAgICBsZXQgQ2xhc3M7XHJcblxyXG4gICAgaWYgKGN0b3JMZW4gPiAwKSB7XHJcbiAgICAgICAgaWYgKHN1cGVyQ2FsbEJvdW5kZWQpIHtcclxuICAgICAgICAgICAgaWYgKGN0b3JMZW4gPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFVzZXIgQ29tcG9uZW50XHJcbiAgICAgICAgICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICh0aGlzOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcclxuICAgICAgICAgICAgICAgICAgICBjdG9yc1swXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0b3JzWzFdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAodGhpczogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19pbml0UHJvcHNfXyhDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdG9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdG9yc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChjdG9yTGVuID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBOb2RlXHJcbiAgICAgICAgICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICh0aGlzOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9faW5pdFByb3BzX18oQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0b3JzWzBdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3RvcnNbMV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICBjdG9yc1syXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIENsYXNzID0gZnVuY3Rpb24gKHRoaXM6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19pbml0UHJvcHNfXyhDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3RvcnMgPSBDbGFzcy5fX2N0b3JzX187XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdG9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdG9yc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICh0aGlzOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHN1cGVyQ2FsbEJvdW5kZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9faW5pdFByb3BzX18oQ2xhc3MpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQ2xhc3M7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBfdmFsaWRhdGVDdG9yX0RFViAoY3RvciwgYmFzZUNsYXNzLCBjbGFzc05hbWUsIG9wdGlvbnMpIHtcclxuICAgIGlmIChFRElUT1IgJiYgYmFzZUNsYXNzKSB7XHJcbiAgICAgICAgLy8gY2hlY2sgc3VwZXIgY2FsbCBpbiBjb25zdHJ1Y3RvclxyXG4gICAgICAgIGNvbnN0IG9yaWdpbkN0b3IgPSBjdG9yO1xyXG4gICAgICAgIGlmIChTdXBlckNhbGxSZWcudGVzdChjdG9yKSkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5fX0VTNl9fKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDM2NTEsIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoMzYwMCwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIC8vIHN1cHByZXNzcyBzdXBlciBjYWxsXHJcbiAgICAgICAgICAgICAgICBjdG9yID0gZnVuY3Rpb24gKHRoaXM6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gZnVuY3Rpb24gKCkgeyB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IG9yaWdpbkN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdXBlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2hlY2sgY3RvclxyXG4gICAgaWYgKGN0b3IubGVuZ3RoID4gMCAmJiAoIWNsYXNzTmFtZSB8fCAhY2xhc3NOYW1lLnN0YXJ0c1dpdGgoJ2NjLicpKSkge1xyXG4gICAgICAgIC8vIFRvIG1ha2UgYSB1bmlmaWVkIENDQ2xhc3Mgc2VyaWFsaXphdGlvbiBwcm9jZXNzLFxyXG4gICAgICAgIC8vIHdlIGRvbid0IGFsbG93IHBhcmFtZXRlcnMgZm9yIGNvbnN0cnVjdG9yIHdoZW4gY3JlYXRpbmcgaW5zdGFuY2VzIG9mIENDQ2xhc3MuXHJcbiAgICAgICAgLy8gRm9yIGFkdmFuY2VkIHVzZXIsIGNvbnN0cnVjdCBhcmd1bWVudHMgY2FuIHN0aWxsIGdldCBmcm9tICdhcmd1bWVudHMnLlxyXG4gICAgICAgIHdhcm5JRCgzNjE3LCBjbGFzc05hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjdG9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfZ2V0QWxsQ3RvcnMgKGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKSB7XHJcbiAgICAvLyBnZXQgYmFzZSB1c2VyIGNvbnN0cnVjdG9yc1xyXG4gICAgZnVuY3Rpb24gZ2V0Q3RvcnMgKGNscykge1xyXG4gICAgICAgIGlmIChDQ0NsYXNzLl9pc0NDQ2xhc3MoY2xzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2xzLl9fY3RvcnNfXyB8fCBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBbY2xzXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3RvcnM6IGFueVtdID0gW107XHJcbiAgICAvLyBpZiAob3B0aW9ucy5fX0VTNl9fKSB7XHJcbiAgICAvLyAgICAgaWYgKG1peGlucykge1xyXG4gICAgLy8gICAgICAgICBsZXQgYmFzZU9yTWl4aW5zID0gZ2V0Q3RvcnMoYmFzZUNsYXNzKTtcclxuICAgIC8vICAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCBtaXhpbnMubGVuZ3RoOyBiKyspIHtcclxuICAgIC8vICAgICAgICAgICAgIGxldCBtaXhpbiA9IG1peGluc1tiXTtcclxuICAgIC8vICAgICAgICAgICAgIGlmIChtaXhpbikge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGxldCBiYXNlQ3RvcnMgPSBnZXRDdG9ycyhtaXhpbik7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBiYXNlQ3RvcnMubGVuZ3RoOyBjKyspIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VPck1peGlucy5pbmRleE9mKGJhc2VDdG9yc1tjXSkgPCAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBwdXNoVW5pcXVlKGN0b3JzLCBiYXNlQ3RvcnNbY10pO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgLy8gZWxzZSB7XHJcbiAgICBjb25zdCBiYXNlT3JNaXhpbnMgPSBbYmFzZUNsYXNzXS5jb25jYXQobWl4aW5zKTtcclxuICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYmFzZU9yTWl4aW5zLmxlbmd0aDsgYisrKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZU9yTWl4aW4gPSBiYXNlT3JNaXhpbnNbYl07XHJcbiAgICAgICAgaWYgKGJhc2VPck1peGluKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2VDdG9ycyA9IGdldEN0b3JzKGJhc2VPck1peGluKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBiYXNlQ3RvcnMubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgICAgIHB1c2hVbmlxdWUoY3RvcnMsIGJhc2VDdG9yc1tjXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gYXBwZW5kIHN1YmNsYXNzIHVzZXIgY29uc3RydWN0b3JzXHJcbiAgICBjb25zdCBjdG9yID0gb3B0aW9ucy5jdG9yO1xyXG4gICAgaWYgKGN0b3IpIHtcclxuICAgICAgICBjdG9ycy5wdXNoKGN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjdG9ycztcclxufVxyXG5cclxuY29uc3Qgc3VwZXJDbGxSZWdDb25kaXRpb24gPSAveHl6Ly50ZXN0KGZ1bmN0aW9uICgpIHsgY29uc3QgeHl6ID0gMDsgfS50b1N0cmluZygpKTtcclxuY29uc3QgU3VwZXJDYWxsUmVnID0gc3VwZXJDbGxSZWdDb25kaXRpb24gPyAvXFxiXFwuX3N1cGVyXFxiLyA6IC8uKi87XHJcbmNvbnN0IFN1cGVyQ2FsbFJlZ1N0cmljdCA9IHN1cGVyQ2xsUmVnQ29uZGl0aW9uID8gL3RoaXNcXC5fc3VwZXJcXHMqXFwoLyA6IC8oTk9ORSl7OTl9LztcclxuZnVuY3Rpb24gYm91bmRTdXBlckNhbGxzIChiYXNlQ2xhc3MsIG9wdGlvbnMsIGNsYXNzTmFtZSkge1xyXG4gICAgbGV0IGhhc1N1cGVyQ2FsbCA9IGZhbHNlO1xyXG4gICAgZm9yIChjb25zdCBmdW5jTmFtZSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKEJVSUxUSU5fRU5UUklFUy5pbmRleE9mKGZ1bmNOYW1lKSA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBmdW5jID0gb3B0aW9uc1tmdW5jTmFtZV07XHJcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwZCA9IGpzLmdldFByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ2xhc3MucHJvdG90eXBlLCBmdW5jTmFtZSk7XHJcbiAgICAgICAgaWYgKHBkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1cGVyRnVuYyA9IHBkLnZhbHVlO1xyXG4gICAgICAgICAgICAvLyBpZ25vcmUgcGQuZ2V0LCBhc3N1bWUgdGhhdCBmdW5jdGlvbiBkZWZpbmVkIGJ5IGdldHRlciBpcyBqdXN0IGZvciB3YXJuaW5nc1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHN1cGVyRnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKFN1cGVyQ2FsbFJlZy50ZXN0KGZ1bmMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFzU3VwZXJDYWxsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBib3VuZFN1cGVyQ2FsbFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbZnVuY05hbWVdID0gKGZ1bmN0aW9uIChzdXBlckZ1bmMsIGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRtcCA9IHRoaXMuX3N1cGVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhIG5ldyAuX3N1cGVyKCkgbWV0aG9kIHRoYXQgaXMgdGhlIHNhbWUgbWV0aG9kIGJ1dCBvbiB0aGUgc3VwZXItQ2xhc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gc3VwZXJGdW5jO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbWV0aG9kIG9ubHkgbmVlZCB0byBiZSBib3VuZCB0ZW1wb3JhcmlseSwgc28gd2UgcmVtb3ZlIGl0IHdoZW4gd2UncmUgZG9uZSBleGVjdXRpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gdG1wO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSkoc3VwZXJGdW5jLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChERVYgJiYgU3VwZXJDYWxsUmVnU3RyaWN0LnRlc3QoZnVuYykpIHtcclxuICAgICAgICAgICAgd2FybklEKDM2MjAsIGNsYXNzTmFtZSwgZnVuY05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBoYXNTdXBlckNhbGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlY2xhcmVQcm9wZXJ0aWVzIChjbHMsIGNsYXNzTmFtZSwgcHJvcGVydGllcywgYmFzZUNsYXNzLCBtaXhpbnMsIGVzNj86IGJvb2xlYW4pIHtcclxuICAgIGNscy5fX3Byb3BzX18gPSBbXTtcclxuXHJcbiAgICBpZiAoYmFzZUNsYXNzICYmIGJhc2VDbGFzcy5fX3Byb3BzX18pIHtcclxuICAgICAgICBjbHMuX19wcm9wc19fID0gYmFzZUNsYXNzLl9fcHJvcHNfXy5zbGljZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtaXhpbnMpIHtcclxuICAgICAgICBmb3IgKGxldCBtID0gMDsgbSA8IG1peGlucy5sZW5ndGg7ICsrbSkge1xyXG4gICAgICAgICAgICBjb25zdCBtaXhpbiA9IG1peGluc1ttXTtcclxuICAgICAgICAgICAgaWYgKG1peGluLl9fcHJvcHNfXykge1xyXG4gICAgICAgICAgICAgICAgY2xzLl9fcHJvcHNfXyA9IGNscy5fX3Byb3BzX18uY29uY2F0KG1peGluLl9fcHJvcHNfXy5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2xzLl9fcHJvcHNfXy5pbmRleE9mKHgpIDwgMDtcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgIC8vIOmihOWkhOeQhuWxnuaAp1xyXG4gICAgICAgIHByZXByb2Nlc3NBdHRycyhwcm9wZXJ0aWVzLCBjbGFzc05hbWUsIGNscywgZXM2KTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBwcm9wTmFtZSBpbiBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoJ2RlZmF1bHQnIGluIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcChjbHMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlZmluZUdldFNldChjbHMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhdHRycyA9IGF0dHJpYnV0ZVV0aWxzLmdldENsYXNzQXR0cnMoY2xzKTtcclxuICAgIGNscy5fX3ZhbHVlc19fID0gY2xzLl9fcHJvcHNfXy5maWx0ZXIoZnVuY3Rpb24gKHByb3ApIHtcclxuICAgICAgICByZXR1cm4gYXR0cnNbcHJvcCArIERFTElNRVRFUiArICdzZXJpYWxpemFibGUnXSAhPT0gZmFsc2U7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENDQ2xhc3MgKG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGxldCBuYW1lID0gb3B0aW9ucy5uYW1lO1xyXG4gICAgY29uc3QgYmFzZSA9IG9wdGlvbnMuZXh0ZW5kcy8qIHx8IENDT2JqZWN0Ki87XHJcbiAgICBjb25zdCBtaXhpbnMgPSBvcHRpb25zLm1peGlucztcclxuXHJcbiAgICAvLyBjcmVhdGUgY29uc3RydWN0b3JcclxuICAgIGNvbnN0IGNscyA9IGRlZmluZShuYW1lLCBiYXNlLCBtaXhpbnMsIG9wdGlvbnMpO1xyXG4gICAgaWYgKCFuYW1lKSB7XHJcbiAgICAgICAgbmFtZSA9IGxlZ2FjeUNDLmpzLmdldENsYXNzTmFtZShjbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNscy5fc2VhbGVkID0gdHJ1ZTtcclxuICAgIGlmIChiYXNlKSB7XHJcbiAgICAgICAgYmFzZS5fc2VhbGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGVmaW5lIFByb3BlcnRpZXNcclxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBvcHRpb25zLnByb3BlcnRpZXM7XHJcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicgfHxcclxuICAgICAgICAoYmFzZSAmJiBiYXNlLl9fcHJvcHNfXyA9PT0gbnVsbCkgfHxcclxuICAgICAgICAobWl4aW5zICYmIG1peGlucy5zb21lKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB4Ll9fcHJvcHNfXyA9PT0gbnVsbDtcclxuICAgICAgICB9KSlcclxuICAgICkge1xyXG4gICAgICAgIGlmIChERVYgJiYgb3B0aW9ucy5fX0VTNl9fKSB7XHJcbiAgICAgICAgICAgIGVycm9yKCdub3QgeWV0IGltcGxlbWVudCBkZWZlcnJlZCBwcm9wZXJ0aWVzIGZvciBFUzYgQ2xhc3NlcycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZGVmZXJyZWRJbml0aWFsaXplci5wdXNoKHsgY2xzLCBwcm9wczogcHJvcGVydGllcywgbWl4aW5zIH0pO1xyXG4gICAgICAgICAgICBjbHMuX19wcm9wc19fID0gY2xzLl9fdmFsdWVzX18gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRlY2xhcmVQcm9wZXJ0aWVzKGNscywgbmFtZSwgcHJvcGVydGllcywgYmFzZSwgb3B0aW9ucy5taXhpbnMsIG9wdGlvbnMuX19FUzZfXyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGVmaW5lIHN0YXRpY3NcclxuICAgIGNvbnN0IHN0YXRpY3MgPSBvcHRpb25zLnN0YXRpY3M7XHJcbiAgICBpZiAoc3RhdGljcykge1xyXG4gICAgICAgIGxldCBzdGF0aWNQcm9wTmFtZTtcclxuICAgICAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgICAgIGZvciAoc3RhdGljUHJvcE5hbWUgaW4gc3RhdGljcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKElOVkFMSURfU1RBVElDU19ERVYuaW5kZXhPZihzdGF0aWNQcm9wTmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JJRCgzNjQyLCBuYW1lLCBzdGF0aWNQcm9wTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGljUHJvcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoc3RhdGljUHJvcE5hbWUgaW4gc3RhdGljcykge1xyXG4gICAgICAgICAgICBjbHNbc3RhdGljUHJvcE5hbWVdID0gc3RhdGljc1tzdGF0aWNQcm9wTmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGRlZmluZSBmdW5jdGlvbnNcclxuICAgIGZvciAoY29uc3QgZnVuY05hbWUgaW4gb3B0aW9ucykge1xyXG4gICAgICAgIGlmIChCVUlMVElOX0VOVFJJRVMuaW5kZXhPZihmdW5jTmFtZSkgPj0gMCkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZnVuYyA9IG9wdGlvbnNbZnVuY05hbWVdO1xyXG4gICAgICAgIGlmICghdmFsaWRhdGVNZXRob2RXaXRoUHJvcHMoZnVuYywgZnVuY05hbWUsIG5hbWUsIGNscywgYmFzZSkpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHVzZSB2YWx1ZSB0byByZWRlZmluZSBzb21lIHN1cGVyIG1ldGhvZCBkZWZpbmVkIGFzIGdldHRlclxyXG4gICAgICAgIGpzLnZhbHVlKGNscy5wcm90b3R5cGUsIGZ1bmNOYW1lLCBmdW5jLCB0cnVlLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBlZGl0b3IgPSBvcHRpb25zLmVkaXRvcjtcclxuICAgIGlmIChlZGl0b3IpIHtcclxuICAgICAgICBpZiAoanMuaXNDaGlsZENsYXNzT2YoYmFzZSwgbGVnYWN5Q0MuQ29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5Db21wb25lbnQuX3JlZ2lzdGVyRWRpdG9yUHJvcHMoY2xzLCBlZGl0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChERVYpIHtcclxuICAgICAgICAgICAgd2FybklEKDM2MjMsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2xzO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIENoZWNrcyB3aGV0aGVyIHRoZSBjb25zdHJ1Y3RvciBpcyBjcmVhdGVkIGJ5IGBDbGFzc2AuXHJcbiAqIEB6aFxyXG4gKiDmo4Dmn6XmnoTpgKDlh73mlbDmmK/lkKbnlLEgYENsYXNzYCDliJvlu7rjgIJcclxuICogQG1ldGhvZCBfaXNDQ0NsYXNzXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbnN0cnVjdG9yXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5DQ0NsYXNzLl9pc0NDQ2xhc3MgPSBmdW5jdGlvbiAoY29uc3RydWN0b3IpIHtcclxuICAgIHJldHVybiBjb25zdHJ1Y3RvciAmJiBjb25zdHJ1Y3Rvci5oYXNPd25Qcm9wZXJ0eSAmJlxyXG4gICAgICAgIGNvbnN0cnVjdG9yLmhhc093blByb3BlcnR5KCdfX2N0b3JzX18nKTsgICAgIC8vIGlzIG5vdCBpbmhlcml0ZWQgX19jdG9yc19fXHJcbn07XHJcblxyXG4vL1xyXG4vLyBPcHRpbWl6ZWQgZGVmaW5lIGZ1bmN0aW9uIG9ubHkgZm9yIGludGVybmFsIGNsYXNzZXNcclxuLy9cclxuLy8gQG1ldGhvZCBmYXN0RGVmaW5lXHJcbi8vIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcclxuLy8gQHBhcmFtIHtGdW5jdGlvbn0gY29uc3RydWN0b3JcclxuLy8gQHBhcmFtIHtPYmplY3R9IHNlcmlhbGl6YWJsZUZpZWxkc1xyXG4vLyBAcHJpdmF0ZVxyXG4vL1xyXG5DQ0NsYXNzLmZhc3REZWZpbmUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lLCBjb25zdHJ1Y3Rvciwgc2VyaWFsaXphYmxlRmllbGRzKSB7XHJcbiAgICBqcy5zZXRDbGFzc05hbWUoY2xhc3NOYW1lLCBjb25zdHJ1Y3Rvcik7XHJcbiAgICAvLyBjb25zdHJ1Y3Rvci5fX2N0b3JzX18gPSBjb25zdHJ1Y3Rvci5fX2N0b3JzX18gfHwgbnVsbDtcclxuICAgIGNvbnN0IHByb3BzID0gY29uc3RydWN0b3IuX19wcm9wc19fID0gY29uc3RydWN0b3IuX192YWx1ZXNfXyA9IE9iamVjdC5rZXlzKHNlcmlhbGl6YWJsZUZpZWxkcyk7XHJcbiAgICBjb25zdCBhdHRyUHJvdG9zID0gYXR0cmlidXRlVXRpbHMuZ2V0Q2xhc3NBdHRyc1Byb3RvKGNvbnN0cnVjdG9yKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBwcm9wc1tpXTtcclxuICAgICAgICBhdHRyUHJvdG9zW2tleSArIERFTElNRVRFUiArICd2aXNpYmxlJ10gPSBmYWxzZTtcclxuICAgICAgICBhdHRyUHJvdG9zW2tleSArIERFTElNRVRFUiArICdkZWZhdWx0J10gPSBzZXJpYWxpemFibGVGaWVsZHNba2V5XTtcclxuICAgIH1cclxufTtcclxuQ0NDbGFzcy5BdHRyID0gYXR0cmlidXRlVXRpbHM7XHJcbkNDQ2xhc3MuYXR0ciA9IGF0dHJpYnV0ZVV0aWxzLmF0dHI7XHJcblxyXG4vKipcclxuICogUmV0dXJuIGFsbCBzdXBlciBjbGFzc2VzLlxyXG4gKiBAcGFyYW0gY29uc3RydWN0b3IgVGhlIENvbnN0cnVjdG9yLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5oZXJpdGFuY2VDaGFpbiAoY29uc3RydWN0b3IpIHtcclxuICAgIGNvbnN0IGNoYWluOiBhbnlbXSA9IFtdO1xyXG4gICAgZm9yICg7IDspIHtcclxuICAgICAgICBjb25zdHJ1Y3RvciA9IGdldFN1cGVyKGNvbnN0cnVjdG9yKTtcclxuICAgICAgICBpZiAoIWNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29uc3RydWN0b3IgIT09IE9iamVjdCkge1xyXG4gICAgICAgICAgICBjaGFpbi5wdXNoKGNvbnN0cnVjdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhaW47XHJcbn1cclxuXHJcbkNDQ2xhc3MuZ2V0SW5oZXJpdGFuY2VDaGFpbiA9IGdldEluaGVyaXRhbmNlQ2hhaW47XHJcblxyXG5jb25zdCBQcmltaXRpdmVUeXBlcyA9IHtcclxuICAgIC8vIFNwZWNpZnkgdGhhdCB0aGUgaW5wdXQgdmFsdWUgbXVzdCBiZSBpbnRlZ2VyIGluIFByb3BlcnRpZXMuXHJcbiAgICAvLyBBbHNvIHVzZWQgdG8gaW5kaWNhdGVzIHRoYXQgdGhlIHR5cGUgb2YgZWxlbWVudHMgaW4gYXJyYXkgb3IgdGhlIHR5cGUgb2YgdmFsdWUgaW4gZGljdGlvbmFyeSBpcyBpbnRlZ2VyLlxyXG4gICAgSW50ZWdlcjogJ051bWJlcicsXHJcbiAgICAvLyBJbmRpY2F0ZXMgdGhhdCB0aGUgdHlwZSBvZiBlbGVtZW50cyBpbiBhcnJheSBvciB0aGUgdHlwZSBvZiB2YWx1ZSBpbiBkaWN0aW9uYXJ5IGlzIGRvdWJsZS5cclxuICAgIEZsb2F0OiAnTnVtYmVyJyxcclxuICAgIEJvb2xlYW46ICdCb29sZWFuJyxcclxuICAgIFN0cmluZzogJ1N0cmluZycsXHJcbn07XHJcblxyXG50eXBlIE9uQWZ0ZXJQcm9wID0gKGNvbnN0cnVjdG9yOiBGdW5jdGlvbiwgbWFpblByb3BlcnR5TmFtZTogc3RyaW5nKSA9PiB2b2lkO1xyXG5cclxuaW50ZXJmYWNlIElQYXJzZWRBdHRyaWJ1dGUge1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgX29uQWZ0ZXJQcm9wPzogT25BZnRlclByb3A7XHJcbiAgICBjdG9yPzogRnVuY3Rpb247XHJcbiAgICBlbnVtTGlzdD86IHJlYWRvbmx5IGFueVtdO1xyXG4gICAgYml0bWFza0xpc3Q/OiBhbnlbXTtcclxufVxyXG5jb25zdCB0bXBBdHRycyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gcGFyc2VBdHRyaWJ1dGVzIChjb25zdHJ1Y3RvcjogRnVuY3Rpb24sIGF0dHJpYnV0ZXM6IElBY2NlcHRhYmxlQXR0cmlidXRlcywgY2xhc3NOYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCB1c2VkSW5HZXR0ZXIpIHtcclxuICAgIGNvbnN0IEVSUl9UeXBlID0gREVWID8gJ1RoZSAlcyBvZiAlcyBtdXN0IGJlIHR5cGUgJXMnIDogJyc7XHJcblxyXG4gICAgbGV0IGF0dHJzUHJvdG8gPSBudWxsO1xyXG4gICAgbGV0IGF0dHJzUHJvdG9LZXkgPSAnJztcclxuICAgIGZ1bmN0aW9uIGdldEF0dHJzUHJvdG8gKCkge1xyXG4gICAgICAgIGF0dHJzUHJvdG9LZXkgPSBwcm9wZXJ0eU5hbWUgKyBERUxJTUVURVI7XHJcbiAgICAgICAgcmV0dXJuIGF0dHJzUHJvdG8gPSBhdHRyaWJ1dGVVdGlscy5nZXRDbGFzc0F0dHJzUHJvdG8oY29uc3RydWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHRtcEF0dHJzLmxlbmd0aCA9IDA7XHJcbiAgICBjb25zdCByZXN1bHQ6IElQYXJzZWRBdHRyaWJ1dGVbXSA9IHRtcEF0dHJzO1xyXG5cclxuICAgIGlmICgndHlwZScgaW4gYXR0cmlidXRlcyAmJiB0eXBlb2YgYXR0cmlidXRlcy50eXBlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHdhcm5JRCgzNjYwLCBwcm9wZXJ0eU5hbWUsIGNsYXNzTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHlwZSA9IGF0dHJpYnV0ZXMudHlwZTtcclxuICAgIGlmICh0eXBlKSB7XHJcbiAgICAgICAgY29uc3QgcHJpbWl0aXZlVHlwZSA9IFByaW1pdGl2ZVR5cGVzW3R5cGVdO1xyXG4gICAgICAgIGlmIChwcmltaXRpdmVUeXBlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICBfb25BZnRlclByb3A6IChFRElUT1IgfHwgVEVTVCkgJiYgIWF0dHJpYnV0ZXMuX3Nob3J0ID9cclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVVdGlscy5nZXRUeXBlQ2hlY2tlcihwcmltaXRpdmVUeXBlLCAnY2MuJyArIHR5cGUpIDpcclxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ09iamVjdCcpIHtcclxuICAgICAgICAgICAgaWYgKERFVikge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCgzNjQ0LCBjbGFzc05hbWUsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxzZSBpZiAodHlwZSA9PT0gQXR0ci5TY3JpcHRVdWlkKSB7XHJcbiAgICAgICAgLy8gICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAvLyAgICAgICAgIHR5cGU6ICdTY3JpcHQnLFxyXG4gICAgICAgIC8vICAgICAgICAgY3RvcjogY2MuU2NyaXB0QXNzZXQsXHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgaWYgKEVudW0uaXNFbnVtKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0VudW0nLFxyXG4gICAgICAgICAgICAgICAgICAgIGVudW1MaXN0OiBFbnVtLmdldExpc3QodHlwZSksXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChCaXRNYXNrLmlzQml0TWFzayh0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdCaXRNYXNrJyxcclxuICAgICAgICAgICAgICAgICAgICBiaXRtYXNrTGlzdDogQml0TWFzay5nZXRMaXN0KHR5cGUpLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoREVWKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDM2NDUsIGNsYXNzTmFtZSwgcHJvcGVydHlOYW1lLCB0eXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgbGV0IHR5cGVDaGVja2VyOiBPbkFmdGVyUHJvcCB8IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKChFRElUT1IgfHwgVEVTVCkgJiYgIWF0dHJpYnV0ZXMuX3Nob3J0KSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlQ2hlY2tlciA9IGF0dHJpYnV0ZXMudXJsID9cclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVVdGlscy5nZXRUeXBlQ2hlY2tlcignU3RyaW5nJywgJ2NjLlN0cmluZycpIDpcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVVdGlscy5nZXRPYmpUeXBlQ2hlY2tlcih0eXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnT2JqZWN0JyxcclxuICAgICAgICAgICAgICAgIGN0b3I6IHR5cGUsXHJcbiAgICAgICAgICAgICAgICBfb25BZnRlclByb3A6IHR5cGVDaGVja2VyLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKERFVikge1xyXG4gICAgICAgICAgICBlcnJvcklEKDM2NDYsIGNsYXNzTmFtZSwgcHJvcGVydHlOYW1lLCB0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyc2VTaW1wbGVBdHRyaWJ1dGUgPSAoYXR0cmlidXRlTmFtZToga2V5b2YgSUFjY2VwdGFibGVBdHRyaWJ1dGVzLCBleHBlY3RUeXBlOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBpZiAoYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSBleHBlY3RUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAoYXR0cnNQcm90byB8fCBnZXRBdHRyc1Byb3RvKCkpW2F0dHJzUHJvdG9LZXkgKyBhdHRyaWJ1dGVOYW1lXSA9IHZhbDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChERVYpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKEVSUl9UeXBlLCBhdHRyaWJ1dGVOYW1lLCBjbGFzc05hbWUsIHByb3BlcnR5TmFtZSwgZXhwZWN0VHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChhdHRyaWJ1dGVzLmVkaXRvck9ubHkpIHtcclxuICAgICAgICBpZiAoREVWICYmIHVzZWRJbkdldHRlcikge1xyXG4gICAgICAgICAgICBlcnJvcklEKDM2MTMsICdlZGl0b3JPbmx5JywgbmFtZSwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIChhdHRyc1Byb3RvIHx8IGdldEF0dHJzUHJvdG8oKSlbYXR0cnNQcm90b0tleSArICdlZGl0b3JPbmx5J10gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHBhcnNlU2ltcGxlQXR0cigncHJldmVudERlZmVycmVkTG9hZCcsICdib29sZWFuJyk7XHJcbiAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyaWJ1dGUoJ2Rpc3BsYXlOYW1lJywgJ3N0cmluZycpO1xyXG4gICAgICAgIHBhcnNlU2ltcGxlQXR0cmlidXRlKCdkaXNwbGF5T3JkZXInLCAnbnVtYmVyJyk7XHJcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyaWJ1dGUoJ211bHRpbGluZScsICdib29sZWFuJyk7XHJcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyaWJ1dGUoJ3JhZGlhbicsICdib29sZWFuJyk7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMucmVhZG9ubHkpIHtcclxuICAgICAgICAgICAgKGF0dHJzUHJvdG8gfHwgZ2V0QXR0cnNQcm90bygpKVthdHRyc1Byb3RvS2V5ICsgJ3JlYWRvbmx5J10gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYXJzZVNpbXBsZUF0dHJpYnV0ZSgndG9vbHRpcCcsICdzdHJpbmcnKTtcclxuICAgICAgICBwYXJzZVNpbXBsZUF0dHJpYnV0ZSgnc2xpZGUnLCAnYm9vbGVhbicpO1xyXG4gICAgICAgIHBhcnNlU2ltcGxlQXR0cmlidXRlKCd1bml0JywgJ3N0cmluZycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhdHRyaWJ1dGVzLnVybCkge1xyXG4gICAgICAgIChhdHRyc1Byb3RvIHx8IGdldEF0dHJzUHJvdG8oKSlbYXR0cnNQcm90b0tleSArICdzYXZlVXJsQXNBc3NldCddID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXR0cmlidXRlcy5fX25vSW1wbGljaXQpIHtcclxuICAgICAgICAoYXR0cnNQcm90byB8fCBnZXRBdHRyc1Byb3RvKCkpW2F0dHJzUHJvdG9LZXkgKyAnc2VyaWFsaXphYmxlJ10gPSBhdHRyaWJ1dGVzLnNlcmlhbGl6YWJsZSA/PyBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuc2VyaWFsaXphYmxlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoREVWICYmIHVzZWRJbkdldHRlcikge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCgzNjEzLCAnc2VyaWFsaXphYmxlJywgbmFtZSwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIChhdHRyc1Byb3RvIHx8IGdldEF0dHJzUHJvdG8oKSlbYXR0cnNQcm90b0tleSArICdzZXJpYWxpemFibGUnXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlU2ltcGxlQXR0cmlidXRlKCdmb3JtZXJseVNlcmlhbGl6ZWRBcycsICdzdHJpbmcnKTtcclxuXHJcbiAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgaWYgKCdhbmltYXRhYmxlJyBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgIChhdHRyc1Byb3RvIHx8IGdldEF0dHJzUHJvdG8oKSlbYXR0cnNQcm90b0tleSArICdhbmltYXRhYmxlJ10gPSBhdHRyaWJ1dGVzLmFuaW1hdGFibGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBpZiAoYXR0cmlidXRlcy5fX25vSW1wbGljaXQpIHtcclxuICAgICAgICAgICAgKGF0dHJzUHJvdG8gfHwgZ2V0QXR0cnNQcm90bygpKVthdHRyc1Byb3RvS2V5ICsgJ3Zpc2libGUnXSA9IGF0dHJpYnV0ZXMudmlzaWJsZSA/PyBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2aXNpYmxlID0gYXR0cmlidXRlcy52aXNpYmxlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZpc2libGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZpc2libGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAoYXR0cnNQcm90byB8fCBnZXRBdHRyc1Byb3RvKCkpW2F0dHJzUHJvdG9LZXkgKyAndmlzaWJsZSddID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmlzaWJsZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIChhdHRyc1Byb3RvIHx8IGdldEF0dHJzUHJvdG8oKSlbYXR0cnNQcm90b0tleSArICd2aXNpYmxlJ10gPSB2aXNpYmxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRzV2l0aFVTID0gKHByb3BlcnR5TmFtZS5jaGFyQ29kZUF0KDApID09PSA5NSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRzV2l0aFVTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKGF0dHJzUHJvdG8gfHwgZ2V0QXR0cnNQcm90bygpKVthdHRyc1Byb3RvS2V5ICsgJ3Zpc2libGUnXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJhbmdlID0gYXR0cmlidXRlcy5yYW5nZTtcclxuICAgIGlmIChyYW5nZSkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJhbmdlKSkge1xyXG4gICAgICAgICAgICBpZiAocmFuZ2UubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgIChhdHRyc1Byb3RvIHx8IGdldEF0dHJzUHJvdG8oKSlbYXR0cnNQcm90b0tleSArICdtaW4nXSA9IHJhbmdlWzBdO1xyXG4gICAgICAgICAgICAgICAgKGF0dHJzUHJvdG8gfHwgZ2V0QXR0cnNQcm90bygpKVthdHRyc1Byb3RvS2V5ICsgJ21heCddID0gcmFuZ2VbMV07XHJcbiAgICAgICAgICAgICAgICBpZiAocmFuZ2UubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIChhdHRyc1Byb3RvIHx8IGdldEF0dHJzUHJvdG8oKSlbYXR0cnNQcm90b0tleSArICdzdGVwJ10gPSByYW5nZVsyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChERVYpIHtcclxuICAgICAgICAgICAgICAgIGVycm9ySUQoMzY0Nyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoREVWKSB7XHJcbiAgICAgICAgICAgIGVycm9yKEVSUl9UeXBlLCAncmFuZ2UnLCBjbGFzc05hbWUsIHByb3BlcnR5TmFtZSwgJ2FycmF5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGFyc2VTaW1wbGVBdHRyaWJ1dGUoJ21pbicsICdudW1iZXInKTtcclxuICAgIHBhcnNlU2ltcGxlQXR0cmlidXRlKCdtYXgnLCAnbnVtYmVyJyk7XHJcbiAgICBwYXJzZVNpbXBsZUF0dHJpYnV0ZSgnc3RlcCcsICdudW1iZXInKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5DQ0NsYXNzLmlzQXJyYXkgPSBmdW5jdGlvbiAoZGVmYXVsdFZhbCkge1xyXG4gICAgZGVmYXVsdFZhbCA9IGdldERlZmF1bHQoZGVmYXVsdFZhbCk7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShkZWZhdWx0VmFsKTtcclxufTtcclxuXHJcbkNDQ2xhc3MuZ2V0RGVmYXVsdCA9IGdldERlZmF1bHQ7XHJcbkNDQ2xhc3MuZXNjYXBlRm9ySlMgPSBlc2NhcGVGb3JKUztcclxuQ0NDbGFzcy5JREVOVElGSUVSX1JFID0gSURFTlRJRklFUl9SRTtcclxuQ0NDbGFzcy5nZXROZXdWYWx1ZVR5cGVDb2RlID0gKFNVUFBPUlRfSklUICYmIGdldE5ld1ZhbHVlVHlwZUNvZGVKaXQpIGFzICgodmFsdWU6IGFueSkgPT4gc3RyaW5nKTtcclxuXHJcbmxlZ2FjeUNDLkNsYXNzID0gQ0NDbGFzcztcclxuIl19