(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "./id-generator.js", "../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("./id-generator.js"), require("../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.idGenerator, global.defaultConstants);
    global.jsTyped = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _idGenerator, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isNumber = isNumber;
  _exports.isString = isString;
  _exports.createMap = createMap;
  _exports.getClassName = getClassName;
  _exports.obsolete = obsolete;
  _exports.obsoletes = obsoletes;
  _exports.formatStr = formatStr;
  _exports.shiftArguments = shiftArguments;
  _exports.getPropertyDescriptor = getPropertyDescriptor;
  _exports.addon = addon;
  _exports.mixin = mixin;
  _exports.extend = extend;
  _exports.getSuper = getSuper;
  _exports.isChildClassOf = isChildClassOf;
  _exports.clear = clear;
  _exports._setClassId = _setClassId;
  _exports.setClassName = setClassName;
  _exports.setClassAlias = setClassAlias;
  _exports.unregisterClass = unregisterClass;
  _exports._getClassById = _getClassById;
  _exports.getClassByName = getClassByName;
  _exports._getClassId = _getClassId;
  _exports._nameToClass = _exports._idToClass = _exports.set = _exports.get = _exports.getset = _exports.value = void 0;
  _idGenerator = _interopRequireDefault(_idGenerator);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var tempCIDGenerator = new _idGenerator.default('TmpCId.');
  var aliasesTag = typeof Symbol === 'undefined' ? '__aliases__' : Symbol('[[Aliases]]');
  var classNameTag = '__classname__';
  var classIdTag = '__cid__';
  /**
   * Check the object whether is number or not
   * If a number is created by using 'new Number(10086)', the typeof it will be "object"...
   * Then you can use this function if you care about this case.
   */

  function isNumber(object) {
    return typeof object === 'number' || object instanceof Number;
  }
  /**
   * Check the object whether is string or not.
   * If a string is created by using 'new String("blabla")', the typeof it will be "object"...
   * Then you can use this function if you care about this case.
   */


  function isString(object) {
    return typeof object === 'string' || object instanceof String;
  }
  /**
   * Define value, just help to call Object.defineProperty.<br>
   * The configurable will be true.
   * @param [writable=false]
   * @param [enumerable=false]
   */


  var value = function () {
    var descriptor = {
      value: undefined,
      enumerable: false,
      writable: false,
      configurable: true
    };
    return function (object, propertyName, value_, writable, enumerable) {
      descriptor.value = value_;
      descriptor.writable = writable;
      descriptor.enumerable = enumerable;
      Object.defineProperty(object, propertyName, descriptor);
      descriptor.value = undefined;
    };
  }();
  /**
   * Define get set accessor, just help to call Object.defineProperty(...).
   * @param [setter=null]
   * @param [enumerable=false]
   * @param [configurable=false]
   */


  _exports.value = value;

  var getset = function () {
    var descriptor = {
      get: undefined,
      set: undefined,
      enumerable: false
    };
    return function (object, propertyName, getter, setter) {
      var enumerable = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var configurable = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

      if (typeof setter === 'boolean') {
        enumerable = setter;
        setter = undefined;
      }

      descriptor.get = getter;
      descriptor.set = setter;
      descriptor.enumerable = enumerable;
      descriptor.configurable = configurable;
      Object.defineProperty(object, propertyName, descriptor);
      descriptor.get = undefined;
      descriptor.set = undefined;
    };
  }();
  /**
   * Define get accessor, just help to call Object.defineProperty(...).
   * @param [enumerable=false]
   * @param [configurable=false]
   */


  _exports.getset = getset;

  var get = function () {
    var descriptor = {
      get: undefined,
      enumerable: false,
      configurable: false
    };
    return function (object, propertyName, getter, enumerable, configurable) {
      descriptor.get = getter;
      descriptor.enumerable = enumerable;
      descriptor.configurable = configurable;
      Object.defineProperty(object, propertyName, descriptor);
      descriptor.get = undefined;
    };
  }();
  /**
   * Define set accessor, just help to call Object.defineProperty(...).
   * @param [enumerable=false]
   * @param [configurable=false]
   */


  _exports.get = get;

  var set = function () {
    var descriptor = {
      set: undefined,
      enumerable: false,
      configurable: false
    };
    return function (object, propertyName, setter, enumerable, configurable) {
      descriptor.set = setter;
      descriptor.enumerable = enumerable;
      descriptor.configurable = configurable;
      Object.defineProperty(object, propertyName, descriptor);
      descriptor.set = undefined;
    };
  }();
  /**
   * @en
   * A simple wrapper of `Object.create(null)` which ensures the return object have no prototype (and thus no inherited members).
   * So we can skip `hasOwnProperty` calls on property lookups.
   * It is a worthwhile optimization than the `{}` literal when `hasOwnProperty` calls are necessary.
   * @zh
   * 该方法是对 `Object.create(null)` 的简单封装。
   * `Object.create(null)` 用于创建无 prototype （也就无继承）的空对象。
   * 这样我们在该对象上查找属性时，就不用进行 `hasOwnProperty` 判断。
   * 在需要频繁判断 `hasOwnProperty` 时，使用这个方法性能会比 `{}` 更高。
   *
   * @param [forceDictMode=false] Apply the delete operator to newly created map object.
   * This causes V8 to put the object in "dictionary mode" and disables creation of hidden classes
   * which are very expensive for objects that are constantly changing shape.
   */


  _exports.set = set;

  function createMap(forceDictMode) {
    var map = Object.create(null);

    if (forceDictMode) {
      var INVALID_IDENTIFIER_1 = '.';
      var INVALID_IDENTIFIER_2 = '/';
      map[INVALID_IDENTIFIER_1] = true;
      map[INVALID_IDENTIFIER_2] = true;
      delete map[INVALID_IDENTIFIER_1];
      delete map[INVALID_IDENTIFIER_2];
    }

    return map;
  }
  /**
   * Get class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
   * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>)
   * @param objOrCtor instance or constructor
   */


  function getClassName(objOrCtor) {
    if (typeof objOrCtor === 'function') {
      var prototype = objOrCtor.prototype;

      if (prototype && prototype.hasOwnProperty(classNameTag) && prototype[classNameTag]) {
        return prototype[classNameTag];
      }

      var retval = ''; //  for browsers which have name property in the constructor of the object, such as chrome

      if (objOrCtor.name) {
        retval = objOrCtor.name;
      }

      if (objOrCtor.toString) {
        var arr;
        var str = objOrCtor.toString();

        if (str.charAt(0) === '[') {
          // str is "[object objectClass]"
          arr = str.match(/\[\w+\s*(\w+)\]/);
        } else {
          // str is function objectClass () {} for IE Firefox
          arr = str.match(/function\s*(\w+)/);
        }

        if (arr && arr.length === 2) {
          retval = arr[1];
        }
      }

      return retval !== 'Object' ? retval : '';
    } else if (objOrCtor && objOrCtor.constructor) {
      return getClassName(objOrCtor.constructor);
    }

    return '';
  }
  /**
   * Defines a polyfill field for obsoleted codes.
   * @param object - YourObject or YourClass.prototype
   * @param obsoleted - "OldParam" or "YourClass.OldParam"
   * @param newExpr - "NewParam" or "YourClass.NewParam"
   * @param  [writable=false]
   */


  function obsolete(object, obsoleted, newExpr, writable) {
    var extractPropName = /([^.]+)$/;
    var oldProp = extractPropName.exec(obsoleted)[0];
    var newProp = extractPropName.exec(newExpr)[0];

    function getter() {
      if (_defaultConstants.DEV) {
        (0, _debug.warnID)(5400, obsoleted, newExpr);
      }

      return this[newProp];
    }

    function setter(value_) {
      if (_defaultConstants.DEV) {
        (0, _debug.warnID)(5401, obsoleted, newExpr);
      }

      this[newProp] = value_;
    }

    if (writable) {
      getset(object, oldProp, getter, setter);
    } else {
      get(object, oldProp, getter);
    }
  }
  /**
   * Defines all polyfill fields for obsoleted codes corresponding to the enumerable properties of props.
   * @method obsoletes
   * @param {any} obj - YourObject or YourClass.prototype
   * @param {any} objName - "YourObject" or "YourClass"
   * @param {Object} props
   * @param {Boolean} [writable=false]
   */


  function obsoletes(obj, objName, props, writable) {
    for (var obsoleted in props) {
      var newName = props[obsoleted];
      obsolete(obj, objName + '.' + obsoleted, newName, writable);
    }
  }

  var REGEXP_NUM_OR_STR = /(%d)|(%s)/;
  var REGEXP_STR = /%s/;
  /**
   * A string tool to construct a string with format string.
   * @param msg - A JavaScript string containing zero or more substitution strings (%s).
   * @param subst - JavaScript objects with which to replace substitution strings within msg.
   * This gives you additional control over the format of the output.
   * @example
   * ```
   * import { js } from 'cc';
   * js.formatStr("a: %s, b: %s", a, b);
   * js.formatStr(a, b, c);
   * ```
   */

  function formatStr(msg) {
    for (var _len = arguments.length, subst = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      subst[_key - 1] = arguments[_key];
    }

    if (arguments.length === 0) {
      return '';
    }

    if (subst.length === 0) {
      return '' + msg;
    }

    var hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);

    if (hasSubstitution) {
      var _iterator = _createForOfIteratorHelper(subst),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var arg = _step.value;
          var regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;

          if (regExpToTest.test(msg)) {
            msg = msg.replace(regExpToTest, arg);
          } else {
            msg += ' ' + arg;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      var _iterator2 = _createForOfIteratorHelper(subst),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _arg = _step2.value;
          msg += ' ' + _arg;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    return msg;
  } // see https://github.com/petkaantonov/bluebird/issues/1389


  function shiftArguments() {
    var len = arguments.length - 1;
    var args = new Array(len);

    for (var i = 0; i < len; ++i) {
      args[i] = arguments[i + 1];
    }

    return args;
  }
  /**
   * Get property descriptor in object and all its ancestors.
   */


  function getPropertyDescriptor(object, propertyName) {
    while (object) {
      var pd = Object.getOwnPropertyDescriptor(object, propertyName);

      if (pd) {
        return pd;
      }

      object = Object.getPrototypeOf(object);
    }

    return null;
  }

  function _copyprop(name, source, target) {
    var pd = getPropertyDescriptor(source, name);

    if (pd) {
      Object.defineProperty(target, name, pd);
    }
  }
  /**
   * Copy all properties not defined in object from arguments[1...n].
   * @param object Object to extend its properties.
   * @param sources Source object to copy properties from.
   * @return The result object.
   */


  function addon(object) {
    object = object || {};

    for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      sources[_key2 - 1] = arguments[_key2];
    }

    for (var _i = 0, _sources = sources; _i < _sources.length; _i++) {
      var source = _sources[_i];

      if (source) {
        if (_typeof(source) !== 'object') {
          (0, _debug.errorID)(5402, source);
          continue;
        }

        for (var name in source) {
          if (!(name in object)) {
            _copyprop(name, source, object);
          }
        }
      }
    }

    return object;
  }
  /**
   * Copy all properties from arguments[1...n] to object.
   * @return The result object.
   */


  function mixin(object) {
    object = object || {};

    for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      sources[_key3 - 1] = arguments[_key3];
    }

    for (var _i2 = 0, _sources2 = sources; _i2 < _sources2.length; _i2++) {
      var source = _sources2[_i2];

      if (source) {
        if (_typeof(source) !== 'object') {
          (0, _debug.errorID)(5403, source);
          continue;
        }

        for (var name in source) {
          _copyprop(name, source, object);
        }
      }
    }

    return object;
  }
  /**
   * Derive the class from the supplied base class.
   * Both classes are just native javascript constructors, not created by `Class`, so
   * usually you will want to inherit using [[Class]] instead.
   * @param base The baseclass to inherit.
   * @return The result class.
   */


  function extend(cls, base) {
    if (_defaultConstants.DEV) {
      if (!base) {
        (0, _debug.errorID)(5404);
        return;
      }

      if (!cls) {
        (0, _debug.errorID)(5405);
        return;
      }

      if (Object.keys(cls.prototype).length > 0) {
        (0, _debug.errorID)(5406);
      }
    }

    for (var p in base) {
      if (base.hasOwnProperty(p)) {
        cls[p] = base[p];
      }
    }

    cls.prototype = Object.create(base.prototype, {
      constructor: {
        value: cls,
        writable: true,
        configurable: true
      }
    });
    return cls;
  }
  /**
   * Get super class.
   * @param constructor The constructor of subclass.
   */


  function getSuper(constructor) {
    var proto = constructor.prototype; // binded function do not have prototype

    var dunderProto = proto && Object.getPrototypeOf(proto);
    return dunderProto && dunderProto.constructor;
  }
  /**
   * Checks whether subclass is child of superclass or equals to superclass.
   */


  function isChildClassOf(subclass, superclass) {
    if (subclass && superclass) {
      if (typeof subclass !== 'function') {
        return false;
      }

      if (typeof superclass !== 'function') {
        if (_defaultConstants.DEV) {
          (0, _debug.warnID)(3625, superclass);
        }

        return false;
      }

      if (subclass === superclass) {
        return true;
      }

      for (;;) {
        subclass = getSuper(subclass);

        if (!subclass) {
          return false;
        }

        if (subclass === superclass) {
          return true;
        }
      }
    }

    return false;
  }
  /**
   * Removes all enumerable properties from object.
   */


  function clear(object) {
    for (var _i3 = 0, _Object$keys = Object.keys(object); _i3 < _Object$keys.length; _i3++) {
      var key = _Object$keys[_i3];
      delete object[key];
    }
  }

  function isTempClassId(id) {
    return typeof id !== 'string' || id.startsWith(tempCIDGenerator.prefix);
  } // id 注册


  var _idToClass = {};
  _exports._idToClass = _idToClass;
  var _nameToClass = {};
  /**
   * Register the class by specified id, if its classname is not defined, the class name will also be set.
   * @method _setClassId
   * @param {String} classId
   * @param {Function} constructor
   * @private
   */

  _exports._nameToClass = _nameToClass;

  function _setClassId(id, constructor) {
    var table = _idToClass; // deregister old

    if (constructor.prototype.hasOwnProperty(classIdTag)) {
      delete table[constructor.prototype[classIdTag]];
    }

    value(constructor.prototype, classIdTag, id); // register class

    if (id) {
      var registered = table[id];

      if (registered && registered !== constructor) {
        var _err = 'A Class already exists with the same ' + classIdTag + ' : "' + id + '".';

        if (_defaultConstants.TEST) {
          _err += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
js.unregisterClass to remove the id of unused class';
        }

        (0, _debug.error)(_err);
      } else {
        table[id] = constructor;
      } // if (id === "") {
      //    console.trace("", table === _nameToClass);
      // }

    }
  }

  function doSetClassName(id, constructor) {
    var table = _nameToClass; // deregister old

    if (constructor.prototype.hasOwnProperty(classNameTag)) {
      delete table[constructor.prototype[classNameTag]];
    }

    value(constructor.prototype, classNameTag, id); // register class

    if (id) {
      var registered = table[id];

      if (registered && registered !== constructor) {
        var _err2 = 'A Class already exists with the same ' + classNameTag + ' : "' + id + '".';

        if (_defaultConstants.TEST) {
          _err2 += ' (This may be caused by error of unit test.) \
If you dont need serialization, you can set class id to "". You can also call \
js.unregisterClass to remove the id of unused class';
        }

        (0, _debug.error)(_err2);
      } else {
        table[id] = constructor;
      } // if (id === "") {
      //    console.trace("", table === _nameToClass);
      // }

    }
  }
  /**
   * Register the class by specified name manually
   * @method setClassName
   * @param {String} className
   * @param {Function} constructor
   */


  function setClassName(className, constructor) {
    doSetClassName(className, constructor); // auto set class id

    if (!constructor.prototype.hasOwnProperty(classIdTag)) {
      var id = className || tempCIDGenerator.getNewId();

      if (id) {
        _setClassId(id, constructor);
      }
    }
  }
  /**
   * @en
   * @zh
   * 为类设置别名。
   * 当 `setClassAlias(target, alias)` 后，
   * `alias` 将作为类 `target`的“单向 ID” 和“单向名称”。
   * 因此，`_getClassById(alias)` 和 `getClassByName(alias)` 都会得到 `target`。
   * 这种映射是单向的，意味着 `getClassName(target)` 和 `_getClassId(target)` 将不会是 `alias`。
   * @param target Constructor of target class.
   * @param alias Alias to set. The name shall not have been set as class name or alias of another class.
   */


  function setClassAlias(target, alias) {
    var nameRegistry = _nameToClass[alias];
    var idRegistry = _idToClass[alias];
    var ok = true;

    if (nameRegistry && nameRegistry !== target) {
      (0, _debug.error)("\"".concat(alias, "\" has already been set as name or alias of another class."));
      ok = false;
    }

    if (idRegistry && idRegistry !== target) {
      (0, _debug.error)("\"".concat(alias, "\" has already been set as id or alias of another class."));
      ok = false;
    }

    if (ok) {
      var classAliases = target[aliasesTag];

      if (!classAliases) {
        classAliases = [];
        target[aliasesTag] = classAliases;
      }

      classAliases.push(alias);
      _nameToClass[alias] = target;
      _idToClass[alias] = target;
    }
  }
  /**
   * Unregister a class from fireball.
   *
   * If you dont need a registered class anymore, you should unregister the class so that Fireball will not keep its reference anymore.
   * Please note that its still your responsibility to free other references to the class.
   *
   * @method unregisterClass
   * @param {Function} ...constructor - the class you will want to unregister, any number of classes can be added
   */


  function unregisterClass() {
    for (var _len4 = arguments.length, constructors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      constructors[_key4] = arguments[_key4];
    }

    for (var _i4 = 0, _constructors = constructors; _i4 < _constructors.length; _i4++) {
      var _constructor = _constructors[_i4];
      var p = _constructor.prototype;
      var classId = p[classIdTag];

      if (classId) {
        delete _idToClass[classId];
      }

      var classname = p[classNameTag];

      if (classname) {
        delete _nameToClass[classname];
      }

      var aliases = p[aliasesTag];

      if (aliases) {
        for (var iAlias = 0; iAlias < aliases.length; ++iAlias) {
          var alias = aliases[iAlias];
          delete _nameToClass[alias];
          delete _idToClass[alias];
        }
      }
    }
  }
  /**
   * Get the registered class by id
   * @method _getClassById
   * @param {String} classId
   * @return {Function} constructor
   * @private
   */


  function _getClassById(classId) {
    return _idToClass[classId];
  }
  /**
   * Get the registered class by name
   * @method getClassByName
   * @param {String} classname
   * @return {Function} constructor
   */


  function getClassByName(classname) {
    return _nameToClass[classname];
  }
  /**
   * Get class id of the object
   * @method _getClassId
   * @param {Object|Function} obj - instance or constructor
   * @param {Boolean} [allowTempId = true]   - can return temp id in editor
   * @return {String}
   * @private
   */


  function _getClassId(obj, allowTempId) {
    allowTempId = typeof allowTempId !== 'undefined' ? allowTempId : true;
    var res;

    if (typeof obj === 'function' && obj.prototype.hasOwnProperty(classIdTag)) {
      res = obj.prototype[classIdTag];

      if (!allowTempId && (_defaultConstants.DEV || _defaultConstants.EDITOR) && isTempClassId(res)) {
        return '';
      }

      return res;
    }

    if (obj && obj.constructor) {
      var prototype = obj.constructor.prototype;

      if (prototype && prototype.hasOwnProperty(classIdTag)) {
        res = obj[classIdTag];

        if (!allowTempId && (_defaultConstants.DEV || _defaultConstants.EDITOR) && isTempClassId(res)) {
          return '';
        }

        return res;
      }
    }

    return '';
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvanMtdHlwZWQudHMiXSwibmFtZXMiOlsidGVtcENJREdlbmVyYXRvciIsIklER2VuZXJhdG9yIiwiYWxpYXNlc1RhZyIsIlN5bWJvbCIsImNsYXNzTmFtZVRhZyIsImNsYXNzSWRUYWciLCJpc051bWJlciIsIm9iamVjdCIsIk51bWJlciIsImlzU3RyaW5nIiwiU3RyaW5nIiwidmFsdWUiLCJkZXNjcmlwdG9yIiwidW5kZWZpbmVkIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwicHJvcGVydHlOYW1lIiwidmFsdWVfIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRzZXQiLCJnZXQiLCJzZXQiLCJnZXR0ZXIiLCJzZXR0ZXIiLCJjcmVhdGVNYXAiLCJmb3JjZURpY3RNb2RlIiwibWFwIiwiY3JlYXRlIiwiSU5WQUxJRF9JREVOVElGSUVSXzEiLCJJTlZBTElEX0lERU5USUZJRVJfMiIsImdldENsYXNzTmFtZSIsIm9iak9yQ3RvciIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwicmV0dmFsIiwibmFtZSIsInRvU3RyaW5nIiwiYXJyIiwic3RyIiwiY2hhckF0IiwibWF0Y2giLCJsZW5ndGgiLCJjb25zdHJ1Y3RvciIsIm9ic29sZXRlIiwib2Jzb2xldGVkIiwibmV3RXhwciIsImV4dHJhY3RQcm9wTmFtZSIsIm9sZFByb3AiLCJleGVjIiwibmV3UHJvcCIsIkRFViIsIm9ic29sZXRlcyIsIm9iaiIsIm9iak5hbWUiLCJwcm9wcyIsIm5ld05hbWUiLCJSRUdFWFBfTlVNX09SX1NUUiIsIlJFR0VYUF9TVFIiLCJmb3JtYXRTdHIiLCJtc2ciLCJzdWJzdCIsImFyZ3VtZW50cyIsImhhc1N1YnN0aXR1dGlvbiIsInRlc3QiLCJhcmciLCJyZWdFeHBUb1Rlc3QiLCJyZXBsYWNlIiwic2hpZnRBcmd1bWVudHMiLCJsZW4iLCJhcmdzIiwiQXJyYXkiLCJpIiwiZ2V0UHJvcGVydHlEZXNjcmlwdG9yIiwicGQiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXRQcm90b3R5cGVPZiIsIl9jb3B5cHJvcCIsInNvdXJjZSIsInRhcmdldCIsImFkZG9uIiwic291cmNlcyIsIm1peGluIiwiZXh0ZW5kIiwiY2xzIiwiYmFzZSIsImtleXMiLCJwIiwiZ2V0U3VwZXIiLCJwcm90byIsImR1bmRlclByb3RvIiwiaXNDaGlsZENsYXNzT2YiLCJzdWJjbGFzcyIsInN1cGVyY2xhc3MiLCJjbGVhciIsImtleSIsImlzVGVtcENsYXNzSWQiLCJpZCIsInN0YXJ0c1dpdGgiLCJwcmVmaXgiLCJfaWRUb0NsYXNzIiwiX25hbWVUb0NsYXNzIiwiX3NldENsYXNzSWQiLCJ0YWJsZSIsInJlZ2lzdGVyZWQiLCJlcnIiLCJURVNUIiwiZG9TZXRDbGFzc05hbWUiLCJzZXRDbGFzc05hbWUiLCJjbGFzc05hbWUiLCJnZXROZXdJZCIsInNldENsYXNzQWxpYXMiLCJhbGlhcyIsIm5hbWVSZWdpc3RyeSIsImlkUmVnaXN0cnkiLCJvayIsImNsYXNzQWxpYXNlcyIsInB1c2giLCJ1bnJlZ2lzdGVyQ2xhc3MiLCJjb25zdHJ1Y3RvcnMiLCJjbGFzc0lkIiwiY2xhc3NuYW1lIiwiYWxpYXNlcyIsImlBbGlhcyIsIl9nZXRDbGFzc0J5SWQiLCJnZXRDbGFzc0J5TmFtZSIsIl9nZXRDbGFzc0lkIiwiYWxsb3dUZW1wSWQiLCJyZXMiLCJFRElUT1IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsTUFBTUEsZ0JBQWdCLEdBQUcsSUFBSUMsb0JBQUosQ0FBZ0IsU0FBaEIsQ0FBekI7QUFFQSxNQUFNQyxVQUFVLEdBQUcsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQyxhQUFoQyxHQUFnREEsTUFBTSxDQUFDLGFBQUQsQ0FBekU7QUFDQSxNQUFNQyxZQUFZLEdBQUcsZUFBckI7QUFDQSxNQUFN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R0FBcUNBLFdBQXJDLEdBQW1ELElBQWxFO0FBRUEsUUFBSUMsR0FBSjs7QUFDQSxRQUFJLE9BQU8zRSxHQUFQLEtBQWUsVUFBZixJQUE2QkEsR0FBRyxDQUFDcEIsU0FBSixDQUFjQyxjQUFkLENBQTZCOUIsVUFBN0IsQ0FBakMsRUFBMkU7QUFDdkU0SCxNQUFBQSxHQUFHLEdBQUczRSxHQUFHLENBQUNwQixTQUFKLENBQWM3QixVQUFkLENBQU47O0FBQ0EsVUFBSSxDQUFDMkgsV0FBRCxLQUFpQjVFLHlCQUFPOEUsd0JBQXhCLEtBQW1DakMsYUFBYSxDQUFDZ0MsR0FBRCxDQUFwRCxFQUEyRDtBQUN2RCxlQUFPLEVBQVA7QUFDSDs7QUFDRCxhQUFPQSxHQUFQO0FBQ0g7O0FBQ0QsUUFBSTNFLEdBQUcsSUFBSUEsR0FBRyxDQUFDVixXQUFmLEVBQTRCO0FBQ3hCLFVBQU1WLFNBQVMsR0FBR29CLEdBQUcsQ0FBQ1YsV0FBSixDQUFnQlYsU0FBbEM7O0FBQ0EsVUFBSUEsU0FBUyxJQUFJQSxTQUFTLENBQUNDLGNBQVYsQ0FBeUI5QixVQUF6QixDQUFqQixFQUF1RDtBQUNuRDRILFFBQUFBLEdBQUcsR0FBRzNFLEdBQUcsQ0FBQ2pELFVBQUQsQ0FBVDs7QUFDQSxZQUFJLENBQUMySCxXQUFELEtBQWlCNUUseUJBQU84RSx3QkFBeEIsS0FBbUNqQyxhQUFhLENBQUNnQyxHQUFELENBQXBELEVBQTJEO0FBQ3ZELGlCQUFPLEVBQVA7QUFDSDs7QUFDRCxlQUFPQSxHQUFQO0FBQ0g7QUFDSjs7QUFDRCxXQUFPLEVBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHdhcm5JRCwgZXJyb3IsIGVycm9ySUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcblxyXG5pbXBvcnQgSURHZW5lcmF0b3IgZnJvbSAnLi9pZC1nZW5lcmF0b3InO1xyXG5pbXBvcnQgeyBFRElUT1IsIERFViwgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmNvbnN0IHRlbXBDSURHZW5lcmF0b3IgPSBuZXcgSURHZW5lcmF0b3IoJ1RtcENJZC4nKTtcclxuXHJcbmNvbnN0IGFsaWFzZXNUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAndW5kZWZpbmVkJyA/ICdfX2FsaWFzZXNfXycgOiBTeW1ib2woJ1tbQWxpYXNlc11dJyk7XHJcbmNvbnN0IGNsYXNzTmFtZVRhZyA9ICdfX2NsYXNzbmFtZV9fJztcclxuY29uc3QgY2xhc3NJZFRhZyA9ICdfX2NpZF9fJztcclxuXHJcbi8qKlxyXG4gKiBDaGVjayB0aGUgb2JqZWN0IHdoZXRoZXIgaXMgbnVtYmVyIG9yIG5vdFxyXG4gKiBJZiBhIG51bWJlciBpcyBjcmVhdGVkIGJ5IHVzaW5nICduZXcgTnVtYmVyKDEwMDg2KScsIHRoZSB0eXBlb2YgaXQgd2lsbCBiZSBcIm9iamVjdFwiLi4uXHJcbiAqIFRoZW4geW91IGNhbiB1c2UgdGhpcyBmdW5jdGlvbiBpZiB5b3UgY2FyZSBhYm91dCB0aGlzIGNhc2UuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1iZXIgKG9iamVjdDogYW55KSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ251bWJlcicgfHwgb2JqZWN0IGluc3RhbmNlb2YgTnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgdGhlIG9iamVjdCB3aGV0aGVyIGlzIHN0cmluZyBvciBub3QuXHJcbiAqIElmIGEgc3RyaW5nIGlzIGNyZWF0ZWQgYnkgdXNpbmcgJ25ldyBTdHJpbmcoXCJibGFibGFcIiknLCB0aGUgdHlwZW9mIGl0IHdpbGwgYmUgXCJvYmplY3RcIi4uLlxyXG4gKiBUaGVuIHlvdSBjYW4gdXNlIHRoaXMgZnVuY3Rpb24gaWYgeW91IGNhcmUgYWJvdXQgdGhpcyBjYXNlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nIChvYmplY3Q6IGFueSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdzdHJpbmcnIHx8IG9iamVjdCBpbnN0YW5jZW9mIFN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIERlZmluZSB2YWx1ZSwganVzdCBoZWxwIHRvIGNhbGwgT2JqZWN0LmRlZmluZVByb3BlcnR5Ljxicj5cclxuICogVGhlIGNvbmZpZ3VyYWJsZSB3aWxsIGJlIHRydWUuXHJcbiAqIEBwYXJhbSBbd3JpdGFibGU9ZmFsc2VdXHJcbiAqIEBwYXJhbSBbZW51bWVyYWJsZT1mYWxzZV1cclxuICovXHJcbmV4cG9ydCBjb25zdCB2YWx1ZSA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XHJcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIHJldHVybiAob2JqZWN0OiBPYmplY3QsIHByb3BlcnR5TmFtZTogc3RyaW5nLCB2YWx1ZV86IGFueSwgd3JpdGFibGU/OiBib29sZWFuLCBlbnVtZXJhYmxlPzogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSB2YWx1ZV87XHJcbiAgICAgICAgZGVzY3JpcHRvci53cml0YWJsZSA9IHdyaXRhYmxlO1xyXG4gICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGVudW1lcmFibGU7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHlOYW1lLCBkZXNjcmlwdG9yKTtcclxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBEZWZpbmUgZ2V0IHNldCBhY2Nlc3NvciwganVzdCBoZWxwIHRvIGNhbGwgT2JqZWN0LmRlZmluZVByb3BlcnR5KC4uLikuXHJcbiAqIEBwYXJhbSBbc2V0dGVyPW51bGxdXHJcbiAqIEBwYXJhbSBbZW51bWVyYWJsZT1mYWxzZV1cclxuICogQHBhcmFtIFtjb25maWd1cmFibGU9ZmFsc2VdXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2V0c2V0ID0gKCgpID0+IHtcclxuICAgIGNvbnN0IGRlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvciA9IHtcclxuICAgICAgICBnZXQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBzZXQ6IHVuZGVmaW5lZCxcclxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gKG9iamVjdDoge30sIHByb3BlcnR5TmFtZTogc3RyaW5nLCBnZXR0ZXI6IEdldHRlciwgc2V0dGVyPzogU2V0dGVyIHwgYm9vbGVhbiwgZW51bWVyYWJsZSA9IGZhbHNlLCBjb25maWd1cmFibGUgPSBmYWxzZSkgPT4ge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGVyID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgZW51bWVyYWJsZSA9IHNldHRlcjtcclxuICAgICAgICAgICAgc2V0dGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXNjcmlwdG9yLmdldCA9IGdldHRlcjtcclxuICAgICAgICBkZXNjcmlwdG9yLnNldCA9IHNldHRlcjtcclxuICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBlbnVtZXJhYmxlO1xyXG4gICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gY29uZmlndXJhYmxlO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5TmFtZSwgZGVzY3JpcHRvcik7XHJcbiAgICAgICAgZGVzY3JpcHRvci5nZXQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZGVzY3JpcHRvci5zZXQgPSB1bmRlZmluZWQ7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIERlZmluZSBnZXQgYWNjZXNzb3IsIGp1c3QgaGVscCB0byBjYWxsIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSguLi4pLlxyXG4gKiBAcGFyYW0gW2VudW1lcmFibGU9ZmFsc2VdXHJcbiAqIEBwYXJhbSBbY29uZmlndXJhYmxlPWZhbHNlXVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldCA9ICgoKSA9PiB7XHJcbiAgICBjb25zdCBkZXNjcmlwdG9yOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSB7XHJcbiAgICAgICAgZ2V0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gKG9iamVjdDogT2JqZWN0LCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgZ2V0dGVyOiBHZXR0ZXIsIGVudW1lcmFibGU/OiBib29sZWFuLCBjb25maWd1cmFibGU/OiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgZGVzY3JpcHRvci5nZXQgPSBnZXR0ZXI7XHJcbiAgICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZW51bWVyYWJsZTtcclxuICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IGNvbmZpZ3VyYWJsZTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eU5hbWUsIGRlc2NyaXB0b3IpO1xyXG4gICAgICAgIGRlc2NyaXB0b3IuZ2V0ID0gdW5kZWZpbmVkO1xyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBEZWZpbmUgc2V0IGFjY2Vzc29yLCBqdXN0IGhlbHAgdG8gY2FsbCBPYmplY3QuZGVmaW5lUHJvcGVydHkoLi4uKS5cclxuICogQHBhcmFtIFtlbnVtZXJhYmxlPWZhbHNlXVxyXG4gKiBAcGFyYW0gW2NvbmZpZ3VyYWJsZT1mYWxzZV1cclxuICovXHJcbmV4cG9ydCBjb25zdCBzZXQgPSAoKCkgPT4ge1xyXG4gICAgY29uc3QgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yID0ge1xyXG4gICAgICAgIHNldDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIChvYmplY3Q6IE9iamVjdCwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHNldHRlcjogU2V0dGVyLCBlbnVtZXJhYmxlPzogYm9vbGVhbiwgY29uZmlndXJhYmxlPzogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gc2V0dGVyO1xyXG4gICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGVudW1lcmFibGU7XHJcbiAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSBjb25maWd1cmFibGU7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHlOYW1lLCBkZXNjcmlwdG9yKTtcclxuICAgICAgICBkZXNjcmlwdG9yLnNldCA9IHVuZGVmaW5lZDtcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEEgc2ltcGxlIHdyYXBwZXIgb2YgYE9iamVjdC5jcmVhdGUobnVsbClgIHdoaWNoIGVuc3VyZXMgdGhlIHJldHVybiBvYmplY3QgaGF2ZSBubyBwcm90b3R5cGUgKGFuZCB0aHVzIG5vIGluaGVyaXRlZCBtZW1iZXJzKS5cclxuICogU28gd2UgY2FuIHNraXAgYGhhc093blByb3BlcnR5YCBjYWxscyBvbiBwcm9wZXJ0eSBsb29rdXBzLlxyXG4gKiBJdCBpcyBhIHdvcnRod2hpbGUgb3B0aW1pemF0aW9uIHRoYW4gdGhlIGB7fWAgbGl0ZXJhbCB3aGVuIGBoYXNPd25Qcm9wZXJ0eWAgY2FsbHMgYXJlIG5lY2Vzc2FyeS5cclxuICogQHpoXHJcbiAqIOivpeaWueazleaYr+WvuSBgT2JqZWN0LmNyZWF0ZShudWxsKWAg55qE566A5Y2V5bCB6KOF44CCXHJcbiAqIGBPYmplY3QuY3JlYXRlKG51bGwpYCDnlKjkuo7liJvlu7rml6AgcHJvdG90eXBlIO+8iOS5n+WwseaXoOe7p+aJv++8ieeahOepuuWvueixoeOAglxyXG4gKiDov5nmoLfmiJHku6zlnKjor6Xlr7nosaHkuIrmn6Xmib7lsZ7mgKfml7bvvIzlsLHkuI3nlKjov5vooYwgYGhhc093blByb3BlcnR5YCDliKTmlq3jgIJcclxuICog5Zyo6ZyA6KaB6aKR57mB5Yik5patIGBoYXNPd25Qcm9wZXJ0eWAg5pe277yM5L2/55So6L+Z5Liq5pa55rOV5oCn6IO95Lya5q+UIGB7fWAg5pu06auY44CCXHJcbiAqXHJcbiAqIEBwYXJhbSBbZm9yY2VEaWN0TW9kZT1mYWxzZV0gQXBwbHkgdGhlIGRlbGV0ZSBvcGVyYXRvciB0byBuZXdseSBjcmVhdGVkIG1hcCBvYmplY3QuXHJcbiAqIFRoaXMgY2F1c2VzIFY4IHRvIHB1dCB0aGUgb2JqZWN0IGluIFwiZGljdGlvbmFyeSBtb2RlXCIgYW5kIGRpc2FibGVzIGNyZWF0aW9uIG9mIGhpZGRlbiBjbGFzc2VzXHJcbiAqIHdoaWNoIGFyZSB2ZXJ5IGV4cGVuc2l2ZSBmb3Igb2JqZWN0cyB0aGF0IGFyZSBjb25zdGFudGx5IGNoYW5naW5nIHNoYXBlLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hcCAoZm9yY2VEaWN0TW9kZT86IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IG1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICBpZiAoZm9yY2VEaWN0TW9kZSkge1xyXG4gICAgICAgIGNvbnN0IElOVkFMSURfSURFTlRJRklFUl8xID0gJy4nO1xyXG4gICAgICAgIGNvbnN0IElOVkFMSURfSURFTlRJRklFUl8yID0gJy8nO1xyXG4gICAgICAgIG1hcFtJTlZBTElEX0lERU5USUZJRVJfMV0gPSB0cnVlO1xyXG4gICAgICAgIG1hcFtJTlZBTElEX0lERU5USUZJRVJfMl0gPSB0cnVlO1xyXG4gICAgICAgIGRlbGV0ZSBtYXBbSU5WQUxJRF9JREVOVElGSUVSXzFdO1xyXG4gICAgICAgIGRlbGV0ZSBtYXBbSU5WQUxJRF9JREVOVElGSUVSXzJdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1hcDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIG9iamVjdCBpcyBqdXN0IGEge30gKGFuZCB3aGljaCBjbGFzcyBuYW1lZCAnT2JqZWN0JyksIGl0IHdpbGwgcmV0dXJuIFwiXCIuXHJcbiAqIChtb2RpZmllZCBmcm9tIDxhIGhyZWY9XCJodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyNDk1MzEvaG93LXRvLWdldC1hLWphdmFzY3JpcHQtb2JqZWN0cy1jbGFzc1wiPnRoZSBjb2RlIGZyb20gdGhpcyBzdGFja292ZXJmbG93IHBvc3Q8L2E+KVxyXG4gKiBAcGFyYW0gb2JqT3JDdG9yIGluc3RhbmNlIG9yIGNvbnN0cnVjdG9yXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lIChvYmpPckN0b3I6IE9iamVjdCB8IEZ1bmN0aW9uKTogc3RyaW5nIHtcclxuICAgIGlmICh0eXBlb2Ygb2JqT3JDdG9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY29uc3QgcHJvdG90eXBlID0gb2JqT3JDdG9yLnByb3RvdHlwZTtcclxuICAgICAgICBpZiAocHJvdG90eXBlICYmIHByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShjbGFzc05hbWVUYWcpICYmIHByb3RvdHlwZVtjbGFzc05hbWVUYWddKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm90b3R5cGVbY2xhc3NOYW1lVGFnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJldHZhbCA9ICcnO1xyXG4gICAgICAgIC8vICBmb3IgYnJvd3NlcnMgd2hpY2ggaGF2ZSBuYW1lIHByb3BlcnR5IGluIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgb2JqZWN0LCBzdWNoIGFzIGNocm9tZVxyXG4gICAgICAgIGlmIChvYmpPckN0b3IubmFtZSkge1xyXG4gICAgICAgICAgICByZXR2YWwgPSBvYmpPckN0b3IubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iak9yQ3Rvci50b1N0cmluZykge1xyXG4gICAgICAgICAgICBsZXQgYXJyO1xyXG4gICAgICAgICAgICBjb25zdCBzdHIgPSBvYmpPckN0b3IudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKHN0ci5jaGFyQXQoMCkgPT09ICdbJykge1xyXG4gICAgICAgICAgICAgICAgLy8gc3RyIGlzIFwiW29iamVjdCBvYmplY3RDbGFzc11cIlxyXG4gICAgICAgICAgICAgICAgYXJyID0gc3RyLm1hdGNoKC9cXFtcXHcrXFxzKihcXHcrKVxcXS8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gc3RyIGlzIGZ1bmN0aW9uIG9iamVjdENsYXNzICgpIHt9IGZvciBJRSBGaXJlZm94XHJcbiAgICAgICAgICAgICAgICBhcnIgPSBzdHIubWF0Y2goL2Z1bmN0aW9uXFxzKihcXHcrKS8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhcnIgJiYgYXJyLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgcmV0dmFsID0gYXJyWzFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXR2YWwgIT09ICdPYmplY3QnID8gcmV0dmFsIDogJyc7XHJcbiAgICB9IGVsc2UgaWYgKG9iak9yQ3RvciAmJiBvYmpPckN0b3IuY29uc3RydWN0b3IpIHtcclxuICAgICAgICByZXR1cm4gZ2V0Q2xhc3NOYW1lKG9iak9yQ3Rvci5jb25zdHJ1Y3Rvcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZWZpbmVzIGEgcG9seWZpbGwgZmllbGQgZm9yIG9ic29sZXRlZCBjb2Rlcy5cclxuICogQHBhcmFtIG9iamVjdCAtIFlvdXJPYmplY3Qgb3IgWW91ckNsYXNzLnByb3RvdHlwZVxyXG4gKiBAcGFyYW0gb2Jzb2xldGVkIC0gXCJPbGRQYXJhbVwiIG9yIFwiWW91ckNsYXNzLk9sZFBhcmFtXCJcclxuICogQHBhcmFtIG5ld0V4cHIgLSBcIk5ld1BhcmFtXCIgb3IgXCJZb3VyQ2xhc3MuTmV3UGFyYW1cIlxyXG4gKiBAcGFyYW0gIFt3cml0YWJsZT1mYWxzZV1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBvYnNvbGV0ZSAob2JqZWN0OiBhbnksIG9ic29sZXRlZDogc3RyaW5nLCBuZXdFeHByOiBzdHJpbmcsIHdyaXRhYmxlPzogYm9vbGVhbikge1xyXG4gICAgY29uc3QgZXh0cmFjdFByb3BOYW1lID0gLyhbXi5dKykkLztcclxuICAgIGNvbnN0IG9sZFByb3AgPSBleHRyYWN0UHJvcE5hbWUuZXhlYyhvYnNvbGV0ZWQpIVswXTtcclxuICAgIGNvbnN0IG5ld1Byb3AgPSBleHRyYWN0UHJvcE5hbWUuZXhlYyhuZXdFeHByKSFbMF07XHJcbiAgICBmdW5jdGlvbiBnZXR0ZXIgKHRoaXM6IGFueSkge1xyXG4gICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgd2FybklEKDU0MDAsIG9ic29sZXRlZCwgbmV3RXhwcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzW25ld1Byb3BdO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGVyICh0aGlzOiBhbnksIHZhbHVlXzogYW55KSB7XHJcbiAgICAgICAgaWYgKERFVikge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTQwMSwgb2Jzb2xldGVkLCBuZXdFeHByKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpc1tuZXdQcm9wXSA9IHZhbHVlXztcclxuICAgIH1cclxuXHJcbiAgICBpZiAod3JpdGFibGUpIHtcclxuICAgICAgICBnZXRzZXQob2JqZWN0LCBvbGRQcm9wLCBnZXR0ZXIsIHNldHRlcik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBnZXQob2JqZWN0LCBvbGRQcm9wLCBnZXR0ZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRGVmaW5lcyBhbGwgcG9seWZpbGwgZmllbGRzIGZvciBvYnNvbGV0ZWQgY29kZXMgY29ycmVzcG9uZGluZyB0byB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHByb3BzLlxyXG4gKiBAbWV0aG9kIG9ic29sZXRlc1xyXG4gKiBAcGFyYW0ge2FueX0gb2JqIC0gWW91ck9iamVjdCBvciBZb3VyQ2xhc3MucHJvdG90eXBlXHJcbiAqIEBwYXJhbSB7YW55fSBvYmpOYW1lIC0gXCJZb3VyT2JqZWN0XCIgb3IgXCJZb3VyQ2xhc3NcIlxyXG4gKiBAcGFyYW0ge09iamVjdH0gcHJvcHNcclxuICogQHBhcmFtIHtCb29sZWFufSBbd3JpdGFibGU9ZmFsc2VdXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gb2Jzb2xldGVzIChvYmosIG9iak5hbWUsIHByb3BzLCB3cml0YWJsZSkge1xyXG4gICAgZm9yIChjb25zdCBvYnNvbGV0ZWQgaW4gcHJvcHMpIHtcclxuICAgICAgICBjb25zdCBuZXdOYW1lID0gcHJvcHNbb2Jzb2xldGVkXTtcclxuICAgICAgICBvYnNvbGV0ZShvYmosIG9iak5hbWUgKyAnLicgKyBvYnNvbGV0ZWQsIG5ld05hbWUsIHdyaXRhYmxlKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgUkVHRVhQX05VTV9PUl9TVFIgPSAvKCVkKXwoJXMpLztcclxuY29uc3QgUkVHRVhQX1NUUiA9IC8lcy87XHJcblxyXG4vKipcclxuICogQSBzdHJpbmcgdG9vbCB0byBjb25zdHJ1Y3QgYSBzdHJpbmcgd2l0aCBmb3JtYXQgc3RyaW5nLlxyXG4gKiBAcGFyYW0gbXNnIC0gQSBKYXZhU2NyaXB0IHN0cmluZyBjb250YWluaW5nIHplcm8gb3IgbW9yZSBzdWJzdGl0dXRpb24gc3RyaW5ncyAoJXMpLlxyXG4gKiBAcGFyYW0gc3Vic3QgLSBKYXZhU2NyaXB0IG9iamVjdHMgd2l0aCB3aGljaCB0byByZXBsYWNlIHN1YnN0aXR1dGlvbiBzdHJpbmdzIHdpdGhpbiBtc2cuXHJcbiAqIFRoaXMgZ2l2ZXMgeW91IGFkZGl0aW9uYWwgY29udHJvbCBvdmVyIHRoZSBmb3JtYXQgb2YgdGhlIG91dHB1dC5cclxuICogQGV4YW1wbGVcclxuICogYGBgXHJcbiAqIGltcG9ydCB7IGpzIH0gZnJvbSAnY2MnO1xyXG4gKiBqcy5mb3JtYXRTdHIoXCJhOiAlcywgYjogJXNcIiwgYSwgYik7XHJcbiAqIGpzLmZvcm1hdFN0cihhLCBiLCBjKTtcclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0U3RyIChtc2c6IHN0cmluZyB8IGFueSwgLi4uc3Vic3Q6IGFueVtdKSB7XHJcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICAgIGlmIChzdWJzdC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gJycgKyBtc2c7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaGFzU3Vic3RpdHV0aW9uID0gdHlwZW9mIG1zZyA9PT0gJ3N0cmluZycgJiYgUkVHRVhQX05VTV9PUl9TVFIudGVzdChtc2cpO1xyXG4gICAgaWYgKGhhc1N1YnN0aXR1dGlvbikge1xyXG4gICAgICAgIGZvciAoY29uc3QgYXJnIG9mIHN1YnN0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZ0V4cFRvVGVzdCA9IHR5cGVvZiBhcmcgPT09ICdudW1iZXInID8gUkVHRVhQX05VTV9PUl9TVFIgOiBSRUdFWFBfU1RSO1xyXG4gICAgICAgICAgICBpZiAocmVnRXhwVG9UZXN0LnRlc3QobXNnKSkge1xyXG4gICAgICAgICAgICAgICAgbXNnID0gbXNnLnJlcGxhY2UocmVnRXhwVG9UZXN0LCBhcmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbXNnICs9ICcgJyArIGFyZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBhcmcgb2Ygc3Vic3QpIHtcclxuICAgICAgICAgICAgbXNnICs9ICcgJyArIGFyZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbXNnO1xyXG59XHJcblxyXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9pc3N1ZXMvMTM4OVxyXG5leHBvcnQgZnVuY3Rpb24gc2hpZnRBcmd1bWVudHMgKCkge1xyXG4gICAgY29uc3QgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICBjb25zdCBhcmdzID0gbmV3IEFycmF5KGxlbik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJncztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBwcm9wZXJ0eSBkZXNjcmlwdG9yIGluIG9iamVjdCBhbmQgYWxsIGl0cyBhbmNlc3RvcnMuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yIChvYmplY3Q6IGFueSwgcHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcclxuICAgIHdoaWxlIChvYmplY3QpIHtcclxuICAgICAgICBjb25zdCBwZCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIGlmIChwZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iamVjdCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmplY3QpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb3B5cHJvcCAobmFtZTogc3RyaW5nLCBzb3VyY2U6IGFueSwgdGFyZ2V0OiBhbnkpIHtcclxuICAgIGNvbnN0IHBkID0gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSk7XHJcbiAgICBpZiAocGQpIHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCBwZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb3B5IGFsbCBwcm9wZXJ0aWVzIG5vdCBkZWZpbmVkIGluIG9iamVjdCBmcm9tIGFyZ3VtZW50c1sxLi4ubl0uXHJcbiAqIEBwYXJhbSBvYmplY3QgT2JqZWN0IHRvIGV4dGVuZCBpdHMgcHJvcGVydGllcy5cclxuICogQHBhcmFtIHNvdXJjZXMgU291cmNlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cclxuICogQHJldHVybiBUaGUgcmVzdWx0IG9iamVjdC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGRvbiAob2JqZWN0PzogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSkge1xyXG4gICAgb2JqZWN0ID0gb2JqZWN0IHx8IHt9O1xyXG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xyXG4gICAgICAgIGlmIChzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDU0MDIsIHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShuYW1lIGluIG9iamVjdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBfY29weXByb3AobmFtZSwgc291cmNlLCBvYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iamVjdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvcHkgYWxsIHByb3BlcnRpZXMgZnJvbSBhcmd1bWVudHNbMS4uLm5dIHRvIG9iamVjdC5cclxuICogQHJldHVybiBUaGUgcmVzdWx0IG9iamVjdC5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBtaXhpbiAob2JqZWN0PzogYW55LCAuLi5zb3VyY2VzOiBhbnlbXSkge1xyXG4gICAgb2JqZWN0ID0gb2JqZWN0IHx8IHt9O1xyXG4gICAgZm9yIChjb25zdCBzb3VyY2Ugb2Ygc291cmNlcykge1xyXG4gICAgICAgIGlmIChzb3VyY2UpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDU0MDMsIHNvdXJjZSk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBfY29weXByb3AobmFtZSwgc291cmNlLCBvYmplY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9iamVjdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlcml2ZSB0aGUgY2xhc3MgZnJvbSB0aGUgc3VwcGxpZWQgYmFzZSBjbGFzcy5cclxuICogQm90aCBjbGFzc2VzIGFyZSBqdXN0IG5hdGl2ZSBqYXZhc2NyaXB0IGNvbnN0cnVjdG9ycywgbm90IGNyZWF0ZWQgYnkgYENsYXNzYCwgc29cclxuICogdXN1YWxseSB5b3Ugd2lsbCB3YW50IHRvIGluaGVyaXQgdXNpbmcgW1tDbGFzc11dIGluc3RlYWQuXHJcbiAqIEBwYXJhbSBiYXNlIFRoZSBiYXNlY2xhc3MgdG8gaW5oZXJpdC5cclxuICogQHJldHVybiBUaGUgcmVzdWx0IGNsYXNzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCAoY2xzOiBGdW5jdGlvbiwgYmFzZTogRnVuY3Rpb24pIHtcclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBpZiAoIWJhc2UpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCg1NDA0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNscykge1xyXG4gICAgICAgICAgICBlcnJvcklEKDU0MDUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhjbHMucHJvdG90eXBlKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoNTQwNik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBwIGluIGJhc2UpIHsgaWYgKGJhc2UuaGFzT3duUHJvcGVydHkocCkpIHsgY2xzW3BdID0gYmFzZVtwXTsgfSB9XHJcbiAgICBjbHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlLnByb3RvdHlwZSwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBjbHMsXHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGNscztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBzdXBlciBjbGFzcy5cclxuICogQHBhcmFtIGNvbnN0cnVjdG9yIFRoZSBjb25zdHJ1Y3RvciBvZiBzdWJjbGFzcy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTdXBlciAoY29uc3RydWN0b3I6IEZ1bmN0aW9uKSB7XHJcbiAgICBjb25zdCBwcm90byA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTsgLy8gYmluZGVkIGZ1bmN0aW9uIGRvIG5vdCBoYXZlIHByb3RvdHlwZVxyXG4gICAgY29uc3QgZHVuZGVyUHJvdG8gPSBwcm90byAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xyXG4gICAgcmV0dXJuIGR1bmRlclByb3RvICYmIGR1bmRlclByb3RvLmNvbnN0cnVjdG9yO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIHdoZXRoZXIgc3ViY2xhc3MgaXMgY2hpbGQgb2Ygc3VwZXJjbGFzcyBvciBlcXVhbHMgdG8gc3VwZXJjbGFzcy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NoaWxkQ2xhc3NPZiAoc3ViY2xhc3M6IEZ1bmN0aW9uLCBzdXBlcmNsYXNzOiBGdW5jdGlvbikge1xyXG4gICAgaWYgKHN1YmNsYXNzICYmIHN1cGVyY2xhc3MpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHN1YmNsYXNzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdXBlcmNsYXNzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCgzNjI1LCBzdXBlcmNsYXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdWJjbGFzcyA9PT0gc3VwZXJjbGFzcykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICg7IDspIHtcclxuICAgICAgICAgICAgc3ViY2xhc3MgPSBnZXRTdXBlcihzdWJjbGFzcyk7XHJcbiAgICAgICAgICAgIGlmICghc3ViY2xhc3MpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc3ViY2xhc3MgPT09IHN1cGVyY2xhc3MpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlcyBhbGwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGZyb20gb2JqZWN0LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyIChvYmplY3Q6IHt9KSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3QpKSB7XHJcbiAgICAgICAgZGVsZXRlIG9iamVjdFtrZXldO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1RlbXBDbGFzc0lkIChpZCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpZCAhPT0gJ3N0cmluZycgfHwgaWQuc3RhcnRzV2l0aCh0ZW1wQ0lER2VuZXJhdG9yLnByZWZpeCk7XHJcbn1cclxuXHJcbi8vIGlkIOazqOWGjFxyXG5leHBvcnQgY29uc3QgX2lkVG9DbGFzcyA9IHt9O1xyXG5leHBvcnQgY29uc3QgX25hbWVUb0NsYXNzID0ge307XHJcblxyXG4vKipcclxuICogUmVnaXN0ZXIgdGhlIGNsYXNzIGJ5IHNwZWNpZmllZCBpZCwgaWYgaXRzIGNsYXNzbmFtZSBpcyBub3QgZGVmaW5lZCwgdGhlIGNsYXNzIG5hbWUgd2lsbCBhbHNvIGJlIHNldC5cclxuICogQG1ldGhvZCBfc2V0Q2xhc3NJZFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NJZFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9zZXRDbGFzc0lkIChpZCwgY29uc3RydWN0b3IpIHtcclxuICAgIGNvbnN0IHRhYmxlID0gX2lkVG9DbGFzcztcclxuICAgIC8vIGRlcmVnaXN0ZXIgb2xkXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlLmhhc093blByb3BlcnR5KGNsYXNzSWRUYWcpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRhYmxlW2NvbnN0cnVjdG9yLnByb3RvdHlwZVtjbGFzc0lkVGFnXV07XHJcbiAgICB9XHJcbiAgICB2YWx1ZShjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIGNsYXNzSWRUYWcsIGlkKTtcclxuICAgIC8vIHJlZ2lzdGVyIGNsYXNzXHJcbiAgICBpZiAoaWQpIHtcclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkID0gdGFibGVbaWRdO1xyXG4gICAgICAgIGlmIChyZWdpc3RlcmVkICYmIHJlZ2lzdGVyZWQgIT09IGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSAnQSBDbGFzcyBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoZSBzYW1lICcgKyBjbGFzc0lkVGFnICsgJyA6IFwiJyArIGlkICsgJ1wiLic7XHJcbiAgICAgICAgICAgIGlmIChURVNUKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgKz0gJyAoVGhpcyBtYXkgYmUgY2F1c2VkIGJ5IGVycm9yIG9mIHVuaXQgdGVzdC4pIFxcXHJcbklmIHlvdSBkb250IG5lZWQgc2VyaWFsaXphdGlvbiwgeW91IGNhbiBzZXQgY2xhc3MgaWQgdG8gXCJcIi4gWW91IGNhbiBhbHNvIGNhbGwgXFxcclxuanMudW5yZWdpc3RlckNsYXNzIHRvIHJlbW92ZSB0aGUgaWQgb2YgdW51c2VkIGNsYXNzJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlcnJvcihlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGFibGVbaWRdID0gY29uc3RydWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIChpZCA9PT0gXCJcIikge1xyXG4gICAgICAgIC8vICAgIGNvbnNvbGUudHJhY2UoXCJcIiwgdGFibGUgPT09IF9uYW1lVG9DbGFzcyk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkb1NldENsYXNzTmFtZSAoaWQsIGNvbnN0cnVjdG9yKSB7XHJcbiAgICBjb25zdCB0YWJsZSA9IF9uYW1lVG9DbGFzcztcclxuICAgIC8vIGRlcmVnaXN0ZXIgb2xkXHJcbiAgICBpZiAoY29uc3RydWN0b3IucHJvdG90eXBlLmhhc093blByb3BlcnR5KGNsYXNzTmFtZVRhZykpIHtcclxuICAgICAgICBkZWxldGUgdGFibGVbY29uc3RydWN0b3IucHJvdG90eXBlW2NsYXNzTmFtZVRhZ11dO1xyXG4gICAgfVxyXG4gICAgdmFsdWUoY29uc3RydWN0b3IucHJvdG90eXBlLCBjbGFzc05hbWVUYWcsIGlkKTtcclxuICAgIC8vIHJlZ2lzdGVyIGNsYXNzXHJcbiAgICBpZiAoaWQpIHtcclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkID0gdGFibGVbaWRdO1xyXG4gICAgICAgIGlmIChyZWdpc3RlcmVkICYmIHJlZ2lzdGVyZWQgIT09IGNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSAnQSBDbGFzcyBhbHJlYWR5IGV4aXN0cyB3aXRoIHRoZSBzYW1lICcgKyBjbGFzc05hbWVUYWcgKyAnIDogXCInICsgaWQgKyAnXCIuJztcclxuICAgICAgICAgICAgaWYgKFRFU1QpIHtcclxuICAgICAgICAgICAgICAgIGVyciArPSAnIChUaGlzIG1heSBiZSBjYXVzZWQgYnkgZXJyb3Igb2YgdW5pdCB0ZXN0LikgXFxcclxuSWYgeW91IGRvbnQgbmVlZCBzZXJpYWxpemF0aW9uLCB5b3UgY2FuIHNldCBjbGFzcyBpZCB0byBcIlwiLiBZb3UgY2FuIGFsc28gY2FsbCBcXFxyXG5qcy51bnJlZ2lzdGVyQ2xhc3MgdG8gcmVtb3ZlIHRoZSBpZCBvZiB1bnVzZWQgY2xhc3MnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVycm9yKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0YWJsZVtpZF0gPSBjb25zdHJ1Y3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaWYgKGlkID09PSBcIlwiKSB7XHJcbiAgICAgICAgLy8gICAgY29uc29sZS50cmFjZShcIlwiLCB0YWJsZSA9PT0gX25hbWVUb0NsYXNzKTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlciB0aGUgY2xhc3MgYnkgc3BlY2lmaWVkIG5hbWUgbWFudWFsbHlcclxuICogQG1ldGhvZCBzZXRDbGFzc05hbWVcclxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNldENsYXNzTmFtZSAoY2xhc3NOYW1lLCBjb25zdHJ1Y3Rvcikge1xyXG4gICAgZG9TZXRDbGFzc05hbWUoY2xhc3NOYW1lLCBjb25zdHJ1Y3Rvcik7XHJcbiAgICAvLyBhdXRvIHNldCBjbGFzcyBpZFxyXG4gICAgaWYgKCFjb25zdHJ1Y3Rvci5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoY2xhc3NJZFRhZykpIHtcclxuICAgICAgICBjb25zdCBpZCA9IGNsYXNzTmFtZSB8fCB0ZW1wQ0lER2VuZXJhdG9yLmdldE5ld0lkKCk7XHJcbiAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgIF9zZXRDbGFzc0lkKGlkLCBjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEB6aFxyXG4gKiDkuLrnsbvorr7nva7liKvlkI3jgIJcclxuICog5b2TIGBzZXRDbGFzc0FsaWFzKHRhcmdldCwgYWxpYXMpYCDlkI7vvIxcclxuICogYGFsaWFzYCDlsIbkvZzkuLrnsbsgYHRhcmdldGDnmoTigJzljZXlkJEgSUTigJ0g5ZKM4oCc5Y2V5ZCR5ZCN56ew4oCd44CCXHJcbiAqIOWboOatpO+8jGBfZ2V0Q2xhc3NCeUlkKGFsaWFzKWAg5ZKMIGBnZXRDbGFzc0J5TmFtZShhbGlhcylgIOmDveS8muW+l+WIsCBgdGFyZ2V0YOOAglxyXG4gKiDov5nnp43mmKDlsITmmK/ljZXlkJHnmoTvvIzmhI/lkbPnnYAgYGdldENsYXNzTmFtZSh0YXJnZXQpYCDlkowgYF9nZXRDbGFzc0lkKHRhcmdldClgIOWwhuS4jeS8muaYryBgYWxpYXNg44CCXHJcbiAqIEBwYXJhbSB0YXJnZXQgQ29uc3RydWN0b3Igb2YgdGFyZ2V0IGNsYXNzLlxyXG4gKiBAcGFyYW0gYWxpYXMgQWxpYXMgdG8gc2V0LiBUaGUgbmFtZSBzaGFsbCBub3QgaGF2ZSBiZWVuIHNldCBhcyBjbGFzcyBuYW1lIG9yIGFsaWFzIG9mIGFub3RoZXIgY2xhc3MuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2xhc3NBbGlhcyAodGFyZ2V0OiBGdW5jdGlvbiwgYWxpYXM6IHN0cmluZykge1xyXG4gICAgY29uc3QgbmFtZVJlZ2lzdHJ5ID0gX25hbWVUb0NsYXNzW2FsaWFzXTtcclxuICAgIGNvbnN0IGlkUmVnaXN0cnkgPSBfaWRUb0NsYXNzW2FsaWFzXTtcclxuICAgIGxldCBvayA9IHRydWU7XHJcbiAgICBpZiAobmFtZVJlZ2lzdHJ5ICYmIG5hbWVSZWdpc3RyeSAhPT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgZXJyb3IoYFwiJHthbGlhc31cIiBoYXMgYWxyZWFkeSBiZWVuIHNldCBhcyBuYW1lIG9yIGFsaWFzIG9mIGFub3RoZXIgY2xhc3MuYCk7XHJcbiAgICAgICAgb2sgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChpZFJlZ2lzdHJ5ICYmIGlkUmVnaXN0cnkgIT09IHRhcmdldCkge1xyXG4gICAgICAgIGVycm9yKGBcIiR7YWxpYXN9XCIgaGFzIGFscmVhZHkgYmVlbiBzZXQgYXMgaWQgb3IgYWxpYXMgb2YgYW5vdGhlciBjbGFzcy5gKTtcclxuICAgICAgICBvayA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKG9rKSB7XHJcbiAgICAgICAgbGV0IGNsYXNzQWxpYXNlcyA9IHRhcmdldFthbGlhc2VzVGFnXTtcclxuICAgICAgICBpZiAoIWNsYXNzQWxpYXNlcykge1xyXG4gICAgICAgICAgICBjbGFzc0FsaWFzZXMgPSBbXTtcclxuICAgICAgICAgICAgdGFyZ2V0W2FsaWFzZXNUYWddID0gY2xhc3NBbGlhc2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGFzc0FsaWFzZXMucHVzaChhbGlhcyk7XHJcbiAgICAgICAgX25hbWVUb0NsYXNzW2FsaWFzXSA9IHRhcmdldDtcclxuICAgICAgICBfaWRUb0NsYXNzW2FsaWFzXSA9IHRhcmdldDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVucmVnaXN0ZXIgYSBjbGFzcyBmcm9tIGZpcmViYWxsLlxyXG4gKlxyXG4gKiBJZiB5b3UgZG9udCBuZWVkIGEgcmVnaXN0ZXJlZCBjbGFzcyBhbnltb3JlLCB5b3Ugc2hvdWxkIHVucmVnaXN0ZXIgdGhlIGNsYXNzIHNvIHRoYXQgRmlyZWJhbGwgd2lsbCBub3Qga2VlcCBpdHMgcmVmZXJlbmNlIGFueW1vcmUuXHJcbiAqIFBsZWFzZSBub3RlIHRoYXQgaXRzIHN0aWxsIHlvdXIgcmVzcG9uc2liaWxpdHkgdG8gZnJlZSBvdGhlciByZWZlcmVuY2VzIHRvIHRoZSBjbGFzcy5cclxuICpcclxuICogQG1ldGhvZCB1bnJlZ2lzdGVyQ2xhc3NcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gLi4uY29uc3RydWN0b3IgLSB0aGUgY2xhc3MgeW91IHdpbGwgd2FudCB0byB1bnJlZ2lzdGVyLCBhbnkgbnVtYmVyIG9mIGNsYXNzZXMgY2FuIGJlIGFkZGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdW5yZWdpc3RlckNsYXNzICguLi5jb25zdHJ1Y3RvcnM6IEZ1bmN0aW9uW10pIHtcclxuICAgIGZvciAoY29uc3QgY29uc3RydWN0b3Igb2YgY29uc3RydWN0b3JzKSB7XHJcbiAgICAgICAgY29uc3QgcCA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcclxuICAgICAgICBjb25zdCBjbGFzc0lkID0gcFtjbGFzc0lkVGFnXTtcclxuICAgICAgICBpZiAoY2xhc3NJZCkge1xyXG4gICAgICAgICAgICBkZWxldGUgX2lkVG9DbGFzc1tjbGFzc0lkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY2xhc3NuYW1lID0gcFtjbGFzc05hbWVUYWddO1xyXG4gICAgICAgIGlmIChjbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgZGVsZXRlIF9uYW1lVG9DbGFzc1tjbGFzc25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhbGlhc2VzID0gcFthbGlhc2VzVGFnXTtcclxuICAgICAgICBpZiAoYWxpYXNlcykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpQWxpYXMgPSAwOyBpQWxpYXMgPCBhbGlhc2VzLmxlbmd0aDsgKytpQWxpYXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFsaWFzID0gYWxpYXNlc1tpQWxpYXNdO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIF9uYW1lVG9DbGFzc1thbGlhc107XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgX2lkVG9DbGFzc1thbGlhc107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHJlZ2lzdGVyZWQgY2xhc3MgYnkgaWRcclxuICogQG1ldGhvZCBfZ2V0Q2xhc3NCeUlkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc0lkXHJcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRDbGFzc0J5SWQgKGNsYXNzSWQpIHtcclxuICAgIHJldHVybiBfaWRUb0NsYXNzW2NsYXNzSWRdO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSByZWdpc3RlcmVkIGNsYXNzIGJ5IG5hbWVcclxuICogQG1ldGhvZCBnZXRDbGFzc0J5TmFtZVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NuYW1lXHJcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzQnlOYW1lIChjbGFzc25hbWUpIHtcclxuICAgIHJldHVybiBfbmFtZVRvQ2xhc3NbY2xhc3NuYW1lXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBjbGFzcyBpZCBvZiB0aGUgb2JqZWN0XHJcbiAqIEBtZXRob2QgX2dldENsYXNzSWRcclxuICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IG9iaiAtIGluc3RhbmNlIG9yIGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2FsbG93VGVtcElkID0gdHJ1ZV0gICAtIGNhbiByZXR1cm4gdGVtcCBpZCBpbiBlZGl0b3JcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9nZXRDbGFzc0lkIChvYmosIGFsbG93VGVtcElkPzogQm9vbGVhbikge1xyXG4gICAgYWxsb3dUZW1wSWQgPSAodHlwZW9mIGFsbG93VGVtcElkICE9PSAndW5kZWZpbmVkJyA/IGFsbG93VGVtcElkIDogdHJ1ZSk7XHJcblxyXG4gICAgbGV0IHJlcztcclxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIG9iai5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoY2xhc3NJZFRhZykpIHtcclxuICAgICAgICByZXMgPSBvYmoucHJvdG90eXBlW2NsYXNzSWRUYWddO1xyXG4gICAgICAgIGlmICghYWxsb3dUZW1wSWQgJiYgKERFViB8fCBFRElUT1IpICYmIGlzVGVtcENsYXNzSWQocmVzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBpZiAob2JqICYmIG9iai5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIGNvbnN0IHByb3RvdHlwZSA9IG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XHJcbiAgICAgICAgaWYgKHByb3RvdHlwZSAmJiBwcm90b3R5cGUuaGFzT3duUHJvcGVydHkoY2xhc3NJZFRhZykpIHtcclxuICAgICAgICAgICAgcmVzID0gb2JqW2NsYXNzSWRUYWddO1xyXG4gICAgICAgICAgICBpZiAoIWFsbG93VGVtcElkICYmIChERVYgfHwgRURJVE9SKSAmJiBpc1RlbXBDbGFzc0lkKHJlcykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAnJztcclxufSJdfQ==