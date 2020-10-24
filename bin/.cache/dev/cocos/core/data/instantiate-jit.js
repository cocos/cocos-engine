(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "./class.js", "./object.js", "./utils/attribute.js", "./utils/compiler.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("./class.js"), require("./object.js"), require("./utils/attribute.js"), require("./utils/compiler.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global._class, global.object, global.attribute, global.compiler, global.defaultConstants, global.globalExports);
    global.instantiateJit = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, js, _class, _object, Attr, _compiler, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.equalsToDefault = equalsToDefault;
  _exports.compile = compile;
  js = _interopRequireWildcard(js);
  Attr = _interopRequireWildcard(Attr);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // @ts-ignore
  var Destroyed = _object.CCObject.Flags.Destroyed; // @ts-ignore

  var PersistentMask = _object.CCObject.Flags.PersistentMask;
  var DEFAULT = Attr.DELIMETER + 'default';
  var IDENTIFIER_RE = _class.CCClass.IDENTIFIER_RE;
  var VAR = 'var ';
  var LOCAL_OBJ = 'o';
  var LOCAL_TEMP_OBJ = 't';
  var LOCAL_ARRAY = 'a';
  var LINE_INDEX_OF_NEW_OBJ = 0;
  var DEFAULT_MODULE_CACHE = {
    'cc.ClickEvent': false,
    'cc.PrefabInfo': false
  };
  var escapeForJS = _class.CCClass.escapeForJS; // HELPER CLASSES
  // ('foo', 'bar')
  // -> 'var foo = bar;'

  var Declaration = /*#__PURE__*/function () {
    function Declaration(varName, expression) {
      _classCallCheck(this, Declaration);

      this.varName = void 0;
      this.expression = void 0;
      this.varName = varName;
      this.expression = expression;
    }

    _createClass(Declaration, [{
      key: "toString",
      value: function toString() {
        return VAR + this.varName + '=' + this.expression + ';';
      }
    }]);

    return Declaration;
  }(); // ('a =', 'var b = x')
  // -> 'var b = a = x';
  // ('a =', 'x')
  // -> 'a = x';


  function mergeDeclaration(statement, expression) {
    if (expression instanceof Declaration) {
      return new Declaration(expression.varName, statement + expression.expression);
    } else {
      return statement + expression;
    }
  } // ('a', ['var b = x', 'b.foo = bar'])
  // -> 'var b = a = x;'
  // -> 'b.foo = bar;'
  // ('a', 'var b = x')
  // -> 'var b = a = x;'
  // ('a', 'x')
  // -> 'a = x;'


  function writeAssignment(codeArray, statement, expression) {
    if (Array.isArray(expression)) {
      expression[0] = mergeDeclaration(statement, expression[0]);
      codeArray.push(expression);
    } else {
      codeArray.push(mergeDeclaration(statement, expression) + ';');
    }
  } // ('foo', 'bar')
  // -> 'targetExpression.foo = bar'
  // ('foo1', 'bar1')
  // ('foo2', 'bar2')
  // -> 't = targetExpression;'
  // -> 't.foo1 = bar1;'
  // -> 't.foo2 = bar2;'


  var Assignments = /*#__PURE__*/function () {
    function Assignments(targetExpression) {
      _classCallCheck(this, Assignments);

      this._exps = void 0;
      this._targetExp = void 0;
      this._exps = [];
      this._targetExp = targetExpression;
    }

    _createClass(Assignments, [{
      key: "append",
      value: function append(key, expression) {
        this._exps.push([key, expression]);
      }
    }, {
      key: "writeCode",
      value: function writeCode(codeArray) {
        var targetVar;

        if (this._exps.length > 1) {
          codeArray.push(LOCAL_TEMP_OBJ + '=' + this._targetExp + ';');
          targetVar = LOCAL_TEMP_OBJ;
        } else if (this._exps.length === 1) {
          targetVar = this._targetExp;
        } else {
          return;
        } // tslint:disable: prefer-for-of


        for (var i = 0; i < this._exps.length; i++) {
          var pair = this._exps[i];
          writeAssignment(codeArray, targetVar + getPropAccessor(pair[0]) + '=', pair[1]);
        }
      }
    }]);

    return Assignments;
  }();

  Assignments.pool = void 0;
  Assignments.pool = new js.Pool(function (obj) {
    obj._exps.length = 0;
    obj._targetExp = null;
  }, 1); // @ts-ignore

  Assignments.pool.get = function (targetExpression) {
    var cache = this._get() || new Assignments();
    cache._targetExp = targetExpression;
    return cache;
  }; // HELPER FUNCTIONS


  function getPropAccessor(key) {
    return IDENTIFIER_RE.test(key) ? '.' + key : '[' + escapeForJS(key) + ']';
  } //

  /*
   * Variables:
   * {Object[]} O - objs list
   * {Function[]} F - constructor list
   * {Node} [R] - specify an instantiated prefabRoot that all references to prefabRoot in prefab will redirect to
   * {Object} o - current creating object
   */


  var Parser = /*#__PURE__*/function () {
    /*
    * @method constructor
    * @param {Object} obj - the object to parse
    * @param {Node} [parent]
    */
    function Parser(obj, parent) {
      _classCallCheck(this, Parser);

      this.parent = void 0;
      this.objsToClear_iN$t = void 0;
      this.codeArray = void 0;
      this.objs = void 0;
      this.funcs = void 0;
      this.funcModuleCache = void 0;
      this.globalVariables = void 0;
      this.globalVariableId = void 0;
      this.localVariableId = void 0;
      this.result = void 0;
      this.parent = parent;
      this.objsToClear_iN$t = []; // used to reset _iN$t variable

      this.codeArray = []; // datas for generated code

      this.objs = [];
      this.funcs = [];
      this.funcModuleCache = js.createMap();
      js.mixin(this.funcModuleCache, DEFAULT_MODULE_CACHE); // {String[]} - variable names for circular references,
      //              not really global, just local variables shared between sub functions

      this.globalVariables = []; // incremental id for new global variables

      this.globalVariableId = 0; // incremental id for new local variables

      this.localVariableId = 0; // generate codeArray
      // if (Array.isArray(obj)) {
      //    this.codeArray.push(this.instantiateArray(obj));
      // }
      // else {

      this.codeArray.push(VAR + LOCAL_OBJ + ',' + LOCAL_TEMP_OBJ + ';', 'if(R){', LOCAL_OBJ + '=R;', '}else{', LOCAL_OBJ + '=R=new ' + this.getFuncModule(obj.constructor, true) + '();', '}');
      obj._iN$t = {
        globalVar: 'R'
      };
      this.objsToClear_iN$t.push(obj);
      this.enumerateObject(this.codeArray, obj); // }
      // generate code

      var globalVariablesDeclaration;

      if (this.globalVariables.length > 0) {
        globalVariablesDeclaration = VAR + this.globalVariables.join(',') + ';';
      }

      var code = (0, _compiler.flattenCodeArray)(['return (function(R){', globalVariablesDeclaration || [], this.codeArray, 'return o;', '})']); // generate method and bind with objs

      this.result = Function('O', 'F', code)(this.objs, this.funcs); // if (TEST && !isPhantomJS) {
      //     console.log(code);
      // }
      // cleanup

      for (var i = 0, len = this.objsToClear_iN$t.length; i < len; ++i) {
        this.objsToClear_iN$t[i]._iN$t = null;
      }

      this.objsToClear_iN$t.length = 0;
    }

    _createClass(Parser, [{
      key: "getFuncModule",
      value: function getFuncModule(func, usedInNew) {
        var clsName = js.getClassName(func);

        if (clsName) {
          var cache = this.funcModuleCache[clsName];

          if (cache) {
            return cache;
          } else if (cache === undefined) {
            var clsNameIsModule = clsName.indexOf('.') !== -1;

            if (clsNameIsModule) {
              try {
                // ensure is module
                clsNameIsModule = func === Function('return ' + clsName)();

                if (clsNameIsModule) {
                  this.funcModuleCache[clsName] = clsName;
                  return clsName;
                }
              } catch (e) {}
            }
          }
        }

        var index = this.funcs.indexOf(func);

        if (index < 0) {
          index = this.funcs.length;
          this.funcs.push(func);
        }

        var res = 'F[' + index + ']';

        if (usedInNew) {
          res = '(' + res + ')';
        }

        this.funcModuleCache[clsName] = res;
        return res;
      }
    }, {
      key: "getObjRef",
      value: function getObjRef(obj) {
        var index = this.objs.indexOf(obj);

        if (index < 0) {
          index = this.objs.length;
          this.objs.push(obj);
        }

        return 'O[' + index + ']';
      }
    }, {
      key: "setValueType",
      value: function setValueType(codeArray, defaultValue, srcValue, targetExpression) {
        // @ts-ignore
        var assignments = Assignments.pool.get(targetExpression);
        var fastDefinedProps = defaultValue.constructor.__props__;

        if (!fastDefinedProps) {
          fastDefinedProps = Object.keys(defaultValue);
        }

        for (var i = 0; i < fastDefinedProps.length; i++) {
          var propName = fastDefinedProps[i];
          var prop = srcValue[propName];

          if (defaultValue[propName] === prop) {
            continue;
          }

          var expression = this.enumerateField(srcValue, propName, prop);
          assignments.append(propName, expression);
        }

        assignments.writeCode(codeArray);
        Assignments.pool.put(assignments);
      }
    }, {
      key: "enumerateCCClass",
      value: function enumerateCCClass(codeArray, obj, klass) {
        var props = klass.__values__;
        var attrs = Attr.getClassAttrs(klass);

        for (var p = 0; p < props.length; p++) {
          var key = props[p];
          var val = obj[key];
          var defaultValue = attrs[key + DEFAULT];

          if (equalsToDefault(defaultValue, val)) {
            continue;
          }

          if (_typeof(val) === 'object' && val instanceof _globalExports.legacyCC.ValueType) {
            defaultValue = _class.CCClass.getDefault(defaultValue);

            if (defaultValue && defaultValue.constructor === val.constructor) {
              // fast case
              var targetExpression = LOCAL_OBJ + getPropAccessor(key);
              this.setValueType(codeArray, defaultValue, val, targetExpression);
              continue;
            }
          }

          this.setObjProp(codeArray, obj, key, val);
        }
      }
    }, {
      key: "instantiateArray",
      value: function instantiateArray(value) {
        if (value.length === 0) {
          return '[]';
        }

        var arrayVar = LOCAL_ARRAY + ++this.localVariableId;
        var declaration = new Declaration(arrayVar, 'new Array(' + value.length + ')');
        var codeArray = [declaration]; // assign a _iN$t flag to indicate that this object has been parsed.

        value._iN$t = {
          globalVar: '',
          // the name of declared global variable used to access this object
          source: codeArray // the source code array for this object

        };
        this.objsToClear_iN$t.push(value);

        for (var i = 0; i < value.length; ++i) {
          var statement = arrayVar + '[' + i + ']=';
          var expression = this.enumerateField(value, i, value[i]);
          writeAssignment(codeArray, statement, expression);
        }

        return codeArray;
      }
    }, {
      key: "enumerateField",
      value: function enumerateField(obj, key, value) {
        if (_typeof(value) === 'object' && value) {
          var _iN$t = value._iN$t;

          if (_iN$t) {
            // parsed
            var globalVar = _iN$t.globalVar;

            if (!globalVar) {
              // declare a global var
              globalVar = _iN$t.globalVar = 'v' + ++this.globalVariableId;
              this.globalVariables.push(globalVar); // insert assignment statement to assign to global var

              var line = _iN$t.source[LINE_INDEX_OF_NEW_OBJ];
              _iN$t.source[LINE_INDEX_OF_NEW_OBJ] = mergeDeclaration(globalVar + '=', line); // if (typeof line ==='string' && line.startsWith(VAR)) {
              //     // var o=xxx -> var o=global=xxx
              //     var LEN_OF_VAR_O = 5;
              //     _iN$t.source[LINE_INDEX_OF_NEW_OBJ] = line.slice(0, LEN_OF_VAR_O) + '=' + globalVar + line.slice(LEN_OF_VAR_O);
              // }
            }

            return globalVar;
          } else if (Array.isArray(value)) {
            return this.instantiateArray(value);
          } else {
            return this.instantiateObj(value);
          }
        } else if (typeof value === 'function') {
          return this.getFuncModule(value);
        } else if (typeof value === 'string') {
          return escapeForJS(value);
        } else {
          if (key === '_objFlags' && obj instanceof _object.CCObject) {
            value &= PersistentMask;
          }

          return value;
        }
      }
    }, {
      key: "setObjProp",
      value: function setObjProp(codeArray, obj, key, value) {
        var statement = LOCAL_OBJ + getPropAccessor(key) + '=';
        var expression = this.enumerateField(obj, key, value);
        writeAssignment(codeArray, statement, expression);
      } // codeArray - the source code array for this object

    }, {
      key: "enumerateObject",
      value: function enumerateObject(codeArray, obj) {
        var klass = obj.constructor;

        if (_globalExports.legacyCC.Class._isCCClass(klass)) {
          this.enumerateCCClass(codeArray, obj, klass);
        } else {
          // primitive javascript object
          for (var key in obj) {
            if (!obj.hasOwnProperty(key) || key.charCodeAt(0) === 95 && key.charCodeAt(1) === 95 && // starts with "__"
            key !== '__type__') {
              continue;
            }

            var value = obj[key];

            if (_typeof(value) === 'object' && value && value === obj._iN$t) {
              continue;
            }

            this.setObjProp(codeArray, obj, key, value);
          }
        }
      }
    }, {
      key: "instantiateObj",
      value: function instantiateObj(obj) {
        if (obj instanceof _globalExports.legacyCC.ValueType) {
          return _class.CCClass.getNewValueTypeCode(obj);
        }

        if (obj instanceof _globalExports.legacyCC.Asset) {
          // register to asset list and just return the reference.
          return this.getObjRef(obj);
        }

        if (obj._objFlags & Destroyed) {
          // the same as cc.isValid(obj)
          return null;
        }

        var createCode;
        var ctor = obj.constructor;

        if (_globalExports.legacyCC.Class._isCCClass(ctor)) {
          if (this.parent) {
            if (this.parent instanceof _globalExports.legacyCC.Component) {
              if (obj instanceof _globalExports.legacyCC._BaseNode || obj instanceof _globalExports.legacyCC.Component) {
                return this.getObjRef(obj);
              }
            } else if (this.parent instanceof _globalExports.legacyCC._BaseNode) {
              if (obj instanceof _globalExports.legacyCC._BaseNode) {
                if (!obj.isChildOf(this.parent)) {
                  // should not clone other nodes if not descendant
                  return this.getObjRef(obj);
                }
              } else if (obj instanceof _globalExports.legacyCC.Component) {
                if (!obj.node.isChildOf(this.parent)) {
                  // should not clone other component if not descendant
                  return this.getObjRef(obj);
                }
              }
            }
          }

          createCode = new Declaration(LOCAL_OBJ, 'new ' + this.getFuncModule(ctor, true) + '()');
        } else if (ctor === Object) {
          createCode = new Declaration(LOCAL_OBJ, '{}');
        } else if (!ctor) {
          createCode = new Declaration(LOCAL_OBJ, 'Object.create(null)');
        } else {
          // do not clone unknown type
          return this.getObjRef(obj);
        }

        var codeArray = [createCode]; // assign a _iN$t flag to indicate that this object has been parsed.

        obj._iN$t = {
          globalVar: '',
          // the name of declared global variable used to access this object
          source: codeArray // the source code array for this object
          // propName: '',     // the propName this object defined in its source code,
          //                  // if defined, use LOCAL_OBJ.propName to access the obj, else just use o

        };
        this.objsToClear_iN$t.push(obj);
        this.enumerateObject(codeArray, obj);
        return ['(function(){', codeArray, 'return o;})();'];
      }
    }]);

    return Parser;
  }();

  function equalsToDefault(def, value) {
    if (typeof def === 'function') {
      try {
        def = def();
      } catch (e) {
        return false;
      }
    }

    if (def === value) {
      return true;
    }

    if (def && value) {
      if (def instanceof _globalExports.legacyCC.ValueType && def.equals(value)) {
        return true;
      }

      if (Array.isArray(def) && Array.isArray(value) || def.constructor === Object && value.constructor === Object) {
        try {
          return Array.isArray(def) && Array.isArray(value) && def.length === 0 && value.length === 0;
        } catch (e) {}
      }
    }

    return false;
  }

  function compile(node) {
    var root = node instanceof _globalExports.legacyCC._BaseNode && node;
    var parser = new Parser(node, root);
    return parser.result;
  }

  if (_defaultConstants.TEST) {
    _globalExports.legacyCC._Test.IntantiateJit = {
      equalsToDefault: equalsToDefault,
      compile: compile
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9pbnN0YW50aWF0ZS1qaXQudHMiXSwibmFtZXMiOlsiRGVzdHJveWVkIiwiQ0NPYmplY3QiLCJGbGFncyIsIlBlcnNpc3RlbnRNYXNrIiwiREVGQVVMVCIsIkF0dHIiLCJERUxJTUVURVIiLCJJREVOVElGSUVSX1JFIiwiQ0NDbGFzcyIsIlZBUiIsIkxPQ0FMX09CSiIsIkxPQ0FMX1RFTVBfT0JKIiwiTE9DQUxfQVJSQVkiLCJMSU5FX0lOREVYX09GX05FV19PQkoiLCJERUZBVUxUX01PRFVMRV9DQUNIRSIsImVzY2FwZUZvckpTIiwiRGVjbGFyYXRpb24iLCJ2YXJOYW1lIiwiZXhwcmVzc2lvbiIsIm1lcmdlRGVjbGFyYXRpb24iLCJzdGF0ZW1lbnQiLCJ3cml0ZUFzc2lnbm1lbnQiLCJjb2RlQXJyYXkiLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIiwiQXNzaWdubWVudHMiLCJ0YXJnZXRFeHByZXNzaW9uIiwiX2V4cHMiLCJfdGFyZ2V0RXhwIiwia2V5IiwidGFyZ2V0VmFyIiwibGVuZ3RoIiwiaSIsInBhaXIiLCJnZXRQcm9wQWNjZXNzb3IiLCJwb29sIiwianMiLCJQb29sIiwib2JqIiwiZ2V0IiwiY2FjaGUiLCJfZ2V0IiwidGVzdCIsIlBhcnNlciIsInBhcmVudCIsIm9ianNUb0NsZWFyX2lOJHQiLCJvYmpzIiwiZnVuY3MiLCJmdW5jTW9kdWxlQ2FjaGUiLCJnbG9iYWxWYXJpYWJsZXMiLCJnbG9iYWxWYXJpYWJsZUlkIiwibG9jYWxWYXJpYWJsZUlkIiwicmVzdWx0IiwiY3JlYXRlTWFwIiwibWl4aW4iLCJnZXRGdW5jTW9kdWxlIiwiY29uc3RydWN0b3IiLCJfaU4kdCIsImdsb2JhbFZhciIsImVudW1lcmF0ZU9iamVjdCIsImdsb2JhbFZhcmlhYmxlc0RlY2xhcmF0aW9uIiwiam9pbiIsImNvZGUiLCJGdW5jdGlvbiIsImxlbiIsImZ1bmMiLCJ1c2VkSW5OZXciLCJjbHNOYW1lIiwiZ2V0Q2xhc3NOYW1lIiwidW5kZWZpbmVkIiwiY2xzTmFtZUlzTW9kdWxlIiwiaW5kZXhPZiIsImUiLCJpbmRleCIsInJlcyIsImRlZmF1bHRWYWx1ZSIsInNyY1ZhbHVlIiwiYXNzaWdubWVudHMiLCJmYXN0RGVmaW5lZFByb3BzIiwiX19wcm9wc19fIiwiT2JqZWN0Iiwia2V5cyIsInByb3BOYW1lIiwicHJvcCIsImVudW1lcmF0ZUZpZWxkIiwiYXBwZW5kIiwid3JpdGVDb2RlIiwicHV0Iiwia2xhc3MiLCJwcm9wcyIsIl9fdmFsdWVzX18iLCJhdHRycyIsImdldENsYXNzQXR0cnMiLCJwIiwidmFsIiwiZXF1YWxzVG9EZWZhdWx0IiwibGVnYWN5Q0MiLCJWYWx1ZVR5cGUiLCJnZXREZWZhdWx0Iiwic2V0VmFsdWVUeXBlIiwic2V0T2JqUHJvcCIsInZhbHVlIiwiYXJyYXlWYXIiLCJkZWNsYXJhdGlvbiIsInNvdXJjZSIsImxpbmUiLCJpbnN0YW50aWF0ZUFycmF5IiwiaW5zdGFudGlhdGVPYmoiLCJDbGFzcyIsIl9pc0NDQ2xhc3MiLCJlbnVtZXJhdGVDQ0NsYXNzIiwiaGFzT3duUHJvcGVydHkiLCJjaGFyQ29kZUF0IiwiZ2V0TmV3VmFsdWVUeXBlQ29kZSIsIkFzc2V0IiwiZ2V0T2JqUmVmIiwiX29iakZsYWdzIiwiY3JlYXRlQ29kZSIsImN0b3IiLCJDb21wb25lbnQiLCJfQmFzZU5vZGUiLCJpc0NoaWxkT2YiLCJub2RlIiwiZGVmIiwiZXF1YWxzIiwiY29tcGlsZSIsInJvb3QiLCJwYXJzZXIiLCJURVNUIiwiX1Rlc3QiLCJJbnRhbnRpYXRlSml0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQTtBQUNBLE1BQU1BLFNBQVMsR0FBR0MsaUJBQVNDLEtBQVQsQ0FBZUYsU0FBakMsQyxDQUNBOztBQUNBLE1BQU1HLGNBQWMsR0FBR0YsaUJBQVNDLEtBQVQsQ0FBZUMsY0FBdEM7QUFDQSxNQUFNQyxPQUFPLEdBQUdDLElBQUks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O0FBRU0sV0FBU3FELE9BQVQsQ0FBa0JILElBQWxCLEVBQXdCO0FBQzNCLFFBQU1JLElBQUksR0FBSUosSUFBSSxZQUFZMUIsd0JBQVN3QixTQUExQixJQUF3Q0UsSUFBckQ7QUFDQSxRQUFNSyxNQUFNLEdBQUcsSUFBSXBGLE1BQUosQ0FBVytFLElBQVgsRUFBaUJJLElBQWpCLENBQWY7QUFDQSxXQUFPQyxNQUFNLENBQUMzRSxNQUFkO0FBQ0g7O0FBRUQsTUFBSTRFLHNCQUFKLEVBQVU7QUFDTmhDLDRCQUFTaUMsS0FBVCxDQUFlQyxhQUFmLEdBQStCO0FBQzNCbkMsTUFBQUEsZUFBZSxFQUFmQSxlQUQyQjtBQUUzQjhCLE1BQUFBLE9BQU8sRUFBUEE7QUFGMkIsS0FBL0I7QUFJSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuLy8gU29tZSBoZWxwZXIgbWV0aG9kcyBmb3IgY29tcGlsZSBpbnN0YW50aWF0aW9uIGNvZGVcclxuXHJcbmltcG9ydCAqIGFzIGpzIGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgQ0NDbGFzcyB9IGZyb20gJy4vY2xhc3MnO1xyXG5pbXBvcnQgeyBDQ09iamVjdCB9IGZyb20gJy4vb2JqZWN0JztcclxuaW1wb3J0ICogYXMgQXR0ciBmcm9tICcuL3V0aWxzL2F0dHJpYnV0ZSc7XHJcbmltcG9ydCB7ZmxhdHRlbkNvZGVBcnJheX0gZnJvbSAnLi91dGlscy9jb21waWxlcic7XHJcbmltcG9ydCB7IFRFU1QgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8vIEB0cy1pZ25vcmVcclxuY29uc3QgRGVzdHJveWVkID0gQ0NPYmplY3QuRmxhZ3MuRGVzdHJveWVkO1xyXG4vLyBAdHMtaWdub3JlXHJcbmNvbnN0IFBlcnNpc3RlbnRNYXNrID0gQ0NPYmplY3QuRmxhZ3MuUGVyc2lzdGVudE1hc2s7XHJcbmNvbnN0IERFRkFVTFQgPSBBdHRyLkRFTElNRVRFUiArICdkZWZhdWx0JztcclxuY29uc3QgSURFTlRJRklFUl9SRSA9IENDQ2xhc3MuSURFTlRJRklFUl9SRTtcclxuXHJcbmNvbnN0IFZBUiA9ICd2YXIgJztcclxuY29uc3QgTE9DQUxfT0JKID0gJ28nO1xyXG5jb25zdCBMT0NBTF9URU1QX09CSiA9ICd0JztcclxuY29uc3QgTE9DQUxfQVJSQVkgPSAnYSc7XHJcbmNvbnN0IExJTkVfSU5ERVhfT0ZfTkVXX09CSiA9IDA7XHJcblxyXG5jb25zdCBERUZBVUxUX01PRFVMRV9DQUNIRSA9IHtcclxuICAgICdjYy5DbGlja0V2ZW50JzogZmFsc2UsXHJcbiAgICAnY2MuUHJlZmFiSW5mbyc6IGZhbHNlLFxyXG59O1xyXG5cclxuY29uc3QgZXNjYXBlRm9ySlMgPSBDQ0NsYXNzLmVzY2FwZUZvckpTO1xyXG5cclxuLy8gSEVMUEVSIENMQVNTRVNcclxuXHJcbi8vICgnZm9vJywgJ2JhcicpXHJcbi8vIC0+ICd2YXIgZm9vID0gYmFyOydcclxuY2xhc3MgRGVjbGFyYXRpb24ge1xyXG4gICAgcHVibGljIHZhck5hbWU6IGFueTtcclxuICAgIHB1YmxpYyBleHByZXNzaW9uOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHZhck5hbWUsIGV4cHJlc3Npb24pIHtcclxuICAgICAgICB0aGlzLnZhck5hbWUgPSB2YXJOYW1lO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gVkFSICsgdGhpcy52YXJOYW1lICsgJz0nICsgdGhpcy5leHByZXNzaW9uICsgJzsnO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyAoJ2EgPScsICd2YXIgYiA9IHgnKVxyXG4vLyAtPiAndmFyIGIgPSBhID0geCc7XHJcbi8vICgnYSA9JywgJ3gnKVxyXG4vLyAtPiAnYSA9IHgnO1xyXG5mdW5jdGlvbiBtZXJnZURlY2xhcmF0aW9uIChzdGF0ZW1lbnQsIGV4cHJlc3Npb24pIHtcclxuICAgIGlmIChleHByZXNzaW9uIGluc3RhbmNlb2YgRGVjbGFyYXRpb24pIHtcclxuICAgICAgICByZXR1cm4gbmV3IERlY2xhcmF0aW9uKGV4cHJlc3Npb24udmFyTmFtZSwgc3RhdGVtZW50ICsgZXhwcmVzc2lvbi5leHByZXNzaW9uKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZW1lbnQgKyBleHByZXNzaW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyAoJ2EnLCBbJ3ZhciBiID0geCcsICdiLmZvbyA9IGJhciddKVxyXG4vLyAtPiAndmFyIGIgPSBhID0geDsnXHJcbi8vIC0+ICdiLmZvbyA9IGJhcjsnXHJcbi8vICgnYScsICd2YXIgYiA9IHgnKVxyXG4vLyAtPiAndmFyIGIgPSBhID0geDsnXHJcbi8vICgnYScsICd4JylcclxuLy8gLT4gJ2EgPSB4OydcclxuZnVuY3Rpb24gd3JpdGVBc3NpZ25tZW50IChjb2RlQXJyYXksIHN0YXRlbWVudCwgZXhwcmVzc2lvbikge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXhwcmVzc2lvbikpIHtcclxuICAgICAgICBleHByZXNzaW9uWzBdID0gbWVyZ2VEZWNsYXJhdGlvbihzdGF0ZW1lbnQsIGV4cHJlc3Npb25bMF0pO1xyXG4gICAgICAgIGNvZGVBcnJheS5wdXNoKGV4cHJlc3Npb24pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29kZUFycmF5LnB1c2gobWVyZ2VEZWNsYXJhdGlvbihzdGF0ZW1lbnQsIGV4cHJlc3Npb24pICsgJzsnKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gKCdmb28nLCAnYmFyJylcclxuLy8gLT4gJ3RhcmdldEV4cHJlc3Npb24uZm9vID0gYmFyJ1xyXG4vLyAoJ2ZvbzEnLCAnYmFyMScpXHJcbi8vICgnZm9vMicsICdiYXIyJylcclxuLy8gLT4gJ3QgPSB0YXJnZXRFeHByZXNzaW9uOydcclxuLy8gLT4gJ3QuZm9vMSA9IGJhcjE7J1xyXG4vLyAtPiAndC5mb28yID0gYmFyMjsnXHJcbmNsYXNzIEFzc2lnbm1lbnRzIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgcG9vbDoganMuUG9vbDx7fT47XHJcblxyXG4gICAgcHJpdmF0ZSBfZXhwczogYW55W107XHJcbiAgICBwcml2YXRlIF90YXJnZXRFeHA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAodGFyZ2V0RXhwcmVzc2lvbj8pIHtcclxuICAgICAgICB0aGlzLl9leHBzID0gW107XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0RXhwID0gdGFyZ2V0RXhwcmVzc2lvbjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhcHBlbmQgKGtleSwgZXhwcmVzc2lvbikge1xyXG4gICAgICAgIHRoaXMuX2V4cHMucHVzaChba2V5LCBleHByZXNzaW9uXSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgd3JpdGVDb2RlIChjb2RlQXJyYXkpIHtcclxuICAgICAgICBsZXQgdGFyZ2V0VmFyO1xyXG4gICAgICAgIGlmICh0aGlzLl9leHBzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgY29kZUFycmF5LnB1c2goTE9DQUxfVEVNUF9PQkogKyAnPScgKyB0aGlzLl90YXJnZXRFeHAgKyAnOycpO1xyXG4gICAgICAgICAgICB0YXJnZXRWYXIgPSBMT0NBTF9URU1QX09CSjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fZXhwcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGFyZ2V0VmFyID0gdGhpcy5fdGFyZ2V0RXhwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZTogcHJlZmVyLWZvci1vZlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZXhwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwYWlyID0gdGhpcy5fZXhwc1tpXTtcclxuICAgICAgICAgICAgd3JpdGVBc3NpZ25tZW50KGNvZGVBcnJheSwgdGFyZ2V0VmFyICsgZ2V0UHJvcEFjY2Vzc29yKHBhaXJbMF0pICsgJz0nLCBwYWlyWzFdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbkFzc2lnbm1lbnRzLnBvb2wgPSBuZXcganMuUG9vbCgob2JqOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouX2V4cHMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouX3RhcmdldEV4cCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxKTtcclxuLy8gQHRzLWlnbm9yZVxyXG5Bc3NpZ25tZW50cy5wb29sLmdldCA9IGZ1bmN0aW9uICh0YXJnZXRFeHByZXNzaW9uKSB7XHJcbiAgICBjb25zdCBjYWNoZTogYW55ID0gdGhpcy5fZ2V0KCkgfHwgbmV3IEFzc2lnbm1lbnRzKCk7XHJcbiAgICBjYWNoZS5fdGFyZ2V0RXhwID0gdGFyZ2V0RXhwcmVzc2lvbjtcclxuICAgIHJldHVybiBjYWNoZTtcclxufTtcclxuXHJcbi8vIEhFTFBFUiBGVU5DVElPTlNcclxuXHJcbmZ1bmN0aW9uIGdldFByb3BBY2Nlc3NvciAoa2V5KSB7XHJcbiAgICByZXR1cm4gSURFTlRJRklFUl9SRS50ZXN0KGtleSkgPyAoJy4nICsga2V5KSA6ICgnWycgKyBlc2NhcGVGb3JKUyhrZXkpICsgJ10nKTtcclxufVxyXG5cclxuLy9cclxuXHJcbi8qXHJcbiAqIFZhcmlhYmxlczpcclxuICoge09iamVjdFtdfSBPIC0gb2JqcyBsaXN0XHJcbiAqIHtGdW5jdGlvbltdfSBGIC0gY29uc3RydWN0b3IgbGlzdFxyXG4gKiB7Tm9kZX0gW1JdIC0gc3BlY2lmeSBhbiBpbnN0YW50aWF0ZWQgcHJlZmFiUm9vdCB0aGF0IGFsbCByZWZlcmVuY2VzIHRvIHByZWZhYlJvb3QgaW4gcHJlZmFiIHdpbGwgcmVkaXJlY3QgdG9cclxuICoge09iamVjdH0gbyAtIGN1cnJlbnQgY3JlYXRpbmcgb2JqZWN0XHJcbiAqL1xyXG5jbGFzcyBQYXJzZXIge1xyXG4gICAgcHVibGljIHBhcmVudDogYW55O1xyXG4gICAgcHVibGljIG9ianNUb0NsZWFyX2lOJHQ6IGFueVtdO1xyXG4gICAgcHVibGljIGNvZGVBcnJheTogYW55W107XHJcbiAgICBwdWJsaWMgb2JqczogYW55W107XHJcbiAgICBwdWJsaWMgZnVuY3M6IGFueVtdO1xyXG4gICAgcHVibGljIGZ1bmNNb2R1bGVDYWNoZTogYW55O1xyXG4gICAgcHVibGljIGdsb2JhbFZhcmlhYmxlczogYW55W107XHJcbiAgICBwdWJsaWMgZ2xvYmFsVmFyaWFibGVJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIGxvY2FsVmFyaWFibGVJZDogbnVtYmVyO1xyXG4gICAgcHVibGljIHJlc3VsdDogYW55O1xyXG4gICAgLypcclxuICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxyXG4gICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIC0gdGhlIG9iamVjdCB0byBwYXJzZVxyXG4gICAgKiBAcGFyYW0ge05vZGV9IFtwYXJlbnRdXHJcbiAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG9iaiwgcGFyZW50KSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcblxyXG4gICAgICAgIHRoaXMub2Jqc1RvQ2xlYXJfaU4kdCA9IFtdOyAgIC8vIHVzZWQgdG8gcmVzZXQgX2lOJHQgdmFyaWFibGVcclxuICAgICAgICB0aGlzLmNvZGVBcnJheSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBkYXRhcyBmb3IgZ2VuZXJhdGVkIGNvZGVcclxuICAgICAgICB0aGlzLm9ianMgPSBbXTtcclxuICAgICAgICB0aGlzLmZ1bmNzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZnVuY01vZHVsZUNhY2hlID0ganMuY3JlYXRlTWFwKCk7XHJcbiAgICAgICAganMubWl4aW4odGhpcy5mdW5jTW9kdWxlQ2FjaGUsIERFRkFVTFRfTU9EVUxFX0NBQ0hFKTtcclxuXHJcbiAgICAgICAgLy8ge1N0cmluZ1tdfSAtIHZhcmlhYmxlIG5hbWVzIGZvciBjaXJjdWxhciByZWZlcmVuY2VzLFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICBub3QgcmVhbGx5IGdsb2JhbCwganVzdCBsb2NhbCB2YXJpYWJsZXMgc2hhcmVkIGJldHdlZW4gc3ViIGZ1bmN0aW9uc1xyXG4gICAgICAgIHRoaXMuZ2xvYmFsVmFyaWFibGVzID0gW107XHJcbiAgICAgICAgLy8gaW5jcmVtZW50YWwgaWQgZm9yIG5ldyBnbG9iYWwgdmFyaWFibGVzXHJcbiAgICAgICAgdGhpcy5nbG9iYWxWYXJpYWJsZUlkID0gMDtcclxuICAgICAgICAvLyBpbmNyZW1lbnRhbCBpZCBmb3IgbmV3IGxvY2FsIHZhcmlhYmxlc1xyXG4gICAgICAgIHRoaXMubG9jYWxWYXJpYWJsZUlkID0gMDtcclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgY29kZUFycmF5XHJcbiAgICAgICAgLy8gaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xyXG4gICAgICAgIC8vICAgIHRoaXMuY29kZUFycmF5LnB1c2godGhpcy5pbnN0YW50aWF0ZUFycmF5KG9iaikpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvZGVBcnJheS5wdXNoKFZBUiArIExPQ0FMX09CSiArICcsJyArIExPQ0FMX1RFTVBfT0JKICsgJzsnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnaWYoUil7JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMT0NBTF9PQkogKyAnPVI7JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ31lbHNleycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTE9DQUxfT0JKICsgJz1SPW5ldyAnICsgdGhpcy5nZXRGdW5jTW9kdWxlKG9iai5jb25zdHJ1Y3RvciwgdHJ1ZSkgKyAnKCk7JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ30nKTtcclxuICAgICAgICBvYmouX2lOJHQgPSB7IGdsb2JhbFZhcjogJ1InIH07XHJcbiAgICAgICAgdGhpcy5vYmpzVG9DbGVhcl9pTiR0LnB1c2gob2JqKTtcclxuICAgICAgICB0aGlzLmVudW1lcmF0ZU9iamVjdCh0aGlzLmNvZGVBcnJheSwgb2JqKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIGNvZGVcclxuICAgICAgICBsZXQgZ2xvYmFsVmFyaWFibGVzRGVjbGFyYXRpb247XHJcbiAgICAgICAgaWYgKHRoaXMuZ2xvYmFsVmFyaWFibGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZ2xvYmFsVmFyaWFibGVzRGVjbGFyYXRpb24gPSBWQVIgKyB0aGlzLmdsb2JhbFZhcmlhYmxlcy5qb2luKCcsJykgKyAnOyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBmbGF0dGVuQ29kZUFycmF5KFsncmV0dXJuIChmdW5jdGlvbihSKXsnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsVmFyaWFibGVzRGVjbGFyYXRpb24gfHwgW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvZGVBcnJheSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdyZXR1cm4gbzsnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnfSknXSk7XHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIG1ldGhvZCBhbmQgYmluZCB3aXRoIG9ianNcclxuICAgICAgICB0aGlzLnJlc3VsdCA9IEZ1bmN0aW9uKCdPJywgJ0YnLCBjb2RlKSh0aGlzLm9ianMsIHRoaXMuZnVuY3MpO1xyXG5cclxuICAgICAgICAvLyBpZiAoVEVTVCAmJiAhaXNQaGFudG9tSlMpIHtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coY29kZSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyBjbGVhbnVwXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMub2Jqc1RvQ2xlYXJfaU4kdC5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLm9ianNUb0NsZWFyX2lOJHRbaV0uX2lOJHQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9ianNUb0NsZWFyX2lOJHQubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RnVuY01vZHVsZSAoZnVuYywgdXNlZEluTmV3Pykge1xyXG4gICAgICAgIGNvbnN0IGNsc05hbWUgPSBqcy5nZXRDbGFzc05hbWUoZnVuYyk7XHJcbiAgICAgICAgaWYgKGNsc05hbWUpIHtcclxuICAgICAgICAgICAgY29uc3QgY2FjaGUgPSB0aGlzLmZ1bmNNb2R1bGVDYWNoZVtjbHNOYW1lXTtcclxuICAgICAgICAgICAgaWYgKGNhY2hlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2FjaGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsc05hbWVJc01vZHVsZSA9IGNsc05hbWUuaW5kZXhPZignLicpICE9PSAtMTtcclxuICAgICAgICAgICAgICAgIGlmIChjbHNOYW1lSXNNb2R1bGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgaXMgbW9kdWxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsc05hbWVJc01vZHVsZSA9IChmdW5jID09PSBGdW5jdGlvbigncmV0dXJuICcgKyBjbHNOYW1lKSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNsc05hbWVJc01vZHVsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jTW9kdWxlQ2FjaGVbY2xzTmFtZV0gPSBjbHNOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNsc05hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5mdW5jcy5pbmRleE9mKGZ1bmMpO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmZ1bmNzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5mdW5jcy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzID0gJ0ZbJyArIGluZGV4ICsgJ10nO1xyXG4gICAgICAgIGlmICh1c2VkSW5OZXcpIHtcclxuICAgICAgICAgICAgcmVzID0gJygnICsgcmVzICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZ1bmNNb2R1bGVDYWNoZVtjbHNOYW1lXSA9IHJlcztcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRPYmpSZWYgKG9iaikge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMub2Jqcy5pbmRleE9mKG9iaik7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMub2Jqcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMub2Jqcy5wdXNoKG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnT1snICsgaW5kZXggKyAnXSc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZhbHVlVHlwZSAoY29kZUFycmF5LCBkZWZhdWx0VmFsdWUsIHNyY1ZhbHVlLCB0YXJnZXRFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGNvbnN0IGFzc2lnbm1lbnRzOiBhbnkgPSBBc3NpZ25tZW50cy5wb29sLmdldCEodGFyZ2V0RXhwcmVzc2lvbik7XHJcbiAgICAgICAgbGV0IGZhc3REZWZpbmVkUHJvcHMgPSBkZWZhdWx0VmFsdWUuY29uc3RydWN0b3IuX19wcm9wc19fO1xyXG4gICAgICAgIGlmICghZmFzdERlZmluZWRQcm9wcykge1xyXG4gICAgICAgICAgICBmYXN0RGVmaW5lZFByb3BzID0gT2JqZWN0LmtleXMoZGVmYXVsdFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmYXN0RGVmaW5lZFByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BOYW1lID0gZmFzdERlZmluZWRQcm9wc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgcHJvcCA9IHNyY1ZhbHVlW3Byb3BOYW1lXTtcclxuICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZVtwcm9wTmFtZV0gPT09IHByb3ApIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLmVudW1lcmF0ZUZpZWxkKHNyY1ZhbHVlLCBwcm9wTmFtZSwgcHJvcCk7XHJcbiAgICAgICAgICAgIGFzc2lnbm1lbnRzLmFwcGVuZChwcm9wTmFtZSwgZXhwcmVzc2lvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFzc2lnbm1lbnRzLndyaXRlQ29kZShjb2RlQXJyYXkpO1xyXG4gICAgICAgIEFzc2lnbm1lbnRzLnBvb2wucHV0KGFzc2lnbm1lbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW51bWVyYXRlQ0NDbGFzcyAoY29kZUFycmF5LCBvYmosIGtsYXNzKSB7XHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSBrbGFzcy5fX3ZhbHVlc19fO1xyXG4gICAgICAgIGNvbnN0IGF0dHJzID0gQXR0ci5nZXRDbGFzc0F0dHJzKGtsYXNzKTtcclxuICAgICAgICBmb3IgKGxldCBwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHByb3BzW3BdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWwgPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgbGV0IGRlZmF1bHRWYWx1ZSA9IGF0dHJzW2tleSArIERFRkFVTFRdO1xyXG4gICAgICAgICAgICBpZiAoZXF1YWxzVG9EZWZhdWx0KGRlZmF1bHRWYWx1ZSwgdmFsKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmIHZhbCBpbnN0YW5jZW9mIGxlZ2FjeUNDLlZhbHVlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlID0gQ0NDbGFzcy5nZXREZWZhdWx0KGRlZmF1bHRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGVmYXVsdFZhbHVlICYmIGRlZmF1bHRWYWx1ZS5jb25zdHJ1Y3RvciA9PT0gdmFsLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZmFzdCBjYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0RXhwcmVzc2lvbiA9IExPQ0FMX09CSiArIGdldFByb3BBY2Nlc3NvcihrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVUeXBlKGNvZGVBcnJheSwgZGVmYXVsdFZhbHVlLCB2YWwsIHRhcmdldEV4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0T2JqUHJvcChjb2RlQXJyYXksIG9iaiwga2V5LCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5zdGFudGlhdGVBcnJheSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnW10nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXJyYXlWYXIgPSBMT0NBTF9BUlJBWSArICgrK3RoaXMubG9jYWxWYXJpYWJsZUlkKTtcclxuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbiA9IG5ldyBEZWNsYXJhdGlvbihhcnJheVZhciwgJ25ldyBBcnJheSgnICsgdmFsdWUubGVuZ3RoICsgJyknKTtcclxuICAgICAgICBjb25zdCBjb2RlQXJyYXkgPSBbZGVjbGFyYXRpb25dO1xyXG5cclxuICAgICAgICAvLyBhc3NpZ24gYSBfaU4kdCBmbGFnIHRvIGluZGljYXRlIHRoYXQgdGhpcyBvYmplY3QgaGFzIGJlZW4gcGFyc2VkLlxyXG4gICAgICAgIHZhbHVlLl9pTiR0ID0ge1xyXG4gICAgICAgICAgICBnbG9iYWxWYXI6ICcnLCAgICAgIC8vIHRoZSBuYW1lIG9mIGRlY2xhcmVkIGdsb2JhbCB2YXJpYWJsZSB1c2VkIHRvIGFjY2VzcyB0aGlzIG9iamVjdFxyXG4gICAgICAgICAgICBzb3VyY2U6IGNvZGVBcnJheSwgIC8vIHRoZSBzb3VyY2UgY29kZSBhcnJheSBmb3IgdGhpcyBvYmplY3RcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMub2Jqc1RvQ2xlYXJfaU4kdC5wdXNoKHZhbHVlKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnQgPSBhcnJheVZhciArICdbJyArIGkgKyAnXT0nO1xyXG4gICAgICAgICAgICBjb25zdCBleHByZXNzaW9uID0gdGhpcy5lbnVtZXJhdGVGaWVsZCh2YWx1ZSwgaSwgdmFsdWVbaV0pO1xyXG4gICAgICAgICAgICB3cml0ZUFzc2lnbm1lbnQoY29kZUFycmF5LCBzdGF0ZW1lbnQsIGV4cHJlc3Npb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29kZUFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnVtZXJhdGVGaWVsZCAob2JqLCBrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUpIHtcclxuICAgICAgICAgICAgY29uc3QgX2lOJHQgPSB2YWx1ZS5faU4kdDtcclxuICAgICAgICAgICAgaWYgKF9pTiR0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwYXJzZWRcclxuICAgICAgICAgICAgICAgIGxldCBnbG9iYWxWYXIgPSBfaU4kdC5nbG9iYWxWYXI7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWdsb2JhbFZhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRlY2xhcmUgYSBnbG9iYWwgdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsVmFyID0gX2lOJHQuZ2xvYmFsVmFyID0gJ3YnICsgKCsrdGhpcy5nbG9iYWxWYXJpYWJsZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdsb2JhbFZhcmlhYmxlcy5wdXNoKGdsb2JhbFZhcik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zZXJ0IGFzc2lnbm1lbnQgc3RhdGVtZW50IHRvIGFzc2lnbiB0byBnbG9iYWwgdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZSA9IF9pTiR0LnNvdXJjZVtMSU5FX0lOREVYX09GX05FV19PQkpdO1xyXG4gICAgICAgICAgICAgICAgICAgIF9pTiR0LnNvdXJjZVtMSU5FX0lOREVYX09GX05FV19PQkpdID0gbWVyZ2VEZWNsYXJhdGlvbihnbG9iYWxWYXIgKyAnPScsIGxpbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmICh0eXBlb2YgbGluZSA9PT0nc3RyaW5nJyAmJiBsaW5lLnN0YXJ0c1dpdGgoVkFSKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAvLyB2YXIgbz14eHggLT4gdmFyIG89Z2xvYmFsPXh4eFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgTEVOX09GX1ZBUl9PID0gNTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgX2lOJHQuc291cmNlW0xJTkVfSU5ERVhfT0ZfTkVXX09CSl0gPSBsaW5lLnNsaWNlKDAsIExFTl9PRl9WQVJfTykgKyAnPScgKyBnbG9iYWxWYXIgKyBsaW5lLnNsaWNlKExFTl9PRl9WQVJfTyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbFZhcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVBcnJheSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZU9iaih2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEZ1bmNNb2R1bGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlc2NhcGVGb3JKUyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnX29iakZsYWdzJyAmJiAob2JqIGluc3RhbmNlb2YgQ0NPYmplY3QpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSAmPSBQZXJzaXN0ZW50TWFzaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRPYmpQcm9wIChjb2RlQXJyYXksIG9iaiwga2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlbWVudCA9IExPQ0FMX09CSiArIGdldFByb3BBY2Nlc3NvcihrZXkpICsgJz0nO1xyXG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLmVudW1lcmF0ZUZpZWxkKG9iaiwga2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgd3JpdGVBc3NpZ25tZW50KGNvZGVBcnJheSwgc3RhdGVtZW50LCBleHByZXNzaW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb2RlQXJyYXkgLSB0aGUgc291cmNlIGNvZGUgYXJyYXkgZm9yIHRoaXMgb2JqZWN0XHJcbiAgICBwdWJsaWMgZW51bWVyYXRlT2JqZWN0IChjb2RlQXJyYXksIG9iaikge1xyXG4gICAgICAgIGNvbnN0IGtsYXNzID0gb2JqLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgIGlmIChsZWdhY3lDQy5DbGFzcy5faXNDQ0NsYXNzKGtsYXNzKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVudW1lcmF0ZUNDQ2xhc3MoY29kZUFycmF5LCBvYmosIGtsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHByaW1pdGl2ZSBqYXZhc2NyaXB0IG9iamVjdFxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAoa2V5LmNoYXJDb2RlQXQoMCkgPT09IDk1ICYmIGtleS5jaGFyQ29kZUF0KDEpID09PSA5NSAmJiAgIC8vIHN0YXJ0cyB3aXRoIFwiX19cIlxyXG4gICAgICAgICAgICAgICAgICAgIGtleSAhPT0gJ19fdHlwZV9fJylcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlID09PSBvYmouX2lOJHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0T2JqUHJvcChjb2RlQXJyYXksIG9iaiwga2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluc3RhbnRpYXRlT2JqIChvYmopIHtcclxuICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgbGVnYWN5Q0MuVmFsdWVUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDQ0NsYXNzLmdldE5ld1ZhbHVlVHlwZUNvZGUob2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIGxlZ2FjeUNDLkFzc2V0KSB7XHJcbiAgICAgICAgICAgIC8vIHJlZ2lzdGVyIHRvIGFzc2V0IGxpc3QgYW5kIGp1c3QgcmV0dXJuIHRoZSByZWZlcmVuY2UuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE9ialJlZihvYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JqLl9vYmpGbGFncyAmIERlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICAvLyB0aGUgc2FtZSBhcyBjYy5pc1ZhbGlkKG9iailcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY3JlYXRlQ29kZTtcclxuICAgICAgICBjb25zdCBjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgIGlmIChsZWdhY3lDQy5DbGFzcy5faXNDQ0NsYXNzKGN0b3IpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgbGVnYWN5Q0MuQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIGxlZ2FjeUNDLl9CYXNlTm9kZSB8fCBvYmogaW5zdGFuY2VvZiBsZWdhY3lDQy5Db21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T2JqUmVmKG9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBsZWdhY3lDQy5fQmFzZU5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb2JqLmlzQ2hpbGRPZih0aGlzLnBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBub3QgY2xvbmUgb3RoZXIgbm9kZXMgaWYgbm90IGRlc2NlbmRhbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE9ialJlZihvYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIGxlZ2FjeUNDLkNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5ub2RlLmlzQ2hpbGRPZih0aGlzLnBhcmVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3VsZCBub3QgY2xvbmUgb3RoZXIgY29tcG9uZW50IGlmIG5vdCBkZXNjZW5kYW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRPYmpSZWYob2JqKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjcmVhdGVDb2RlID0gbmV3IERlY2xhcmF0aW9uKExPQ0FMX09CSiwgJ25ldyAnICsgdGhpcy5nZXRGdW5jTW9kdWxlKGN0b3IsIHRydWUpICsgJygpJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGN0b3IgPT09IE9iamVjdCkge1xyXG4gICAgICAgICAgICBjcmVhdGVDb2RlID0gbmV3IERlY2xhcmF0aW9uKExPQ0FMX09CSiwgJ3t9Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKCFjdG9yKSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNvZGUgPSBuZXcgRGVjbGFyYXRpb24oTE9DQUxfT0JKLCAnT2JqZWN0LmNyZWF0ZShudWxsKScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gZG8gbm90IGNsb25lIHVua25vd24gdHlwZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRPYmpSZWYob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvZGVBcnJheSA9IFtjcmVhdGVDb2RlXTtcclxuXHJcbiAgICAgICAgLy8gYXNzaWduIGEgX2lOJHQgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IHRoaXMgb2JqZWN0IGhhcyBiZWVuIHBhcnNlZC5cclxuICAgICAgICBvYmouX2lOJHQgPSB7XHJcbiAgICAgICAgICAgIGdsb2JhbFZhcjogJycsICAgICAgLy8gdGhlIG5hbWUgb2YgZGVjbGFyZWQgZ2xvYmFsIHZhcmlhYmxlIHVzZWQgdG8gYWNjZXNzIHRoaXMgb2JqZWN0XHJcbiAgICAgICAgICAgIHNvdXJjZTogY29kZUFycmF5LCAgLy8gdGhlIHNvdXJjZSBjb2RlIGFycmF5IGZvciB0aGlzIG9iamVjdFxyXG4gICAgICAgICAgICAvLyBwcm9wTmFtZTogJycsICAgICAvLyB0aGUgcHJvcE5hbWUgdGhpcyBvYmplY3QgZGVmaW5lZCBpbiBpdHMgc291cmNlIGNvZGUsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgLy8gaWYgZGVmaW5lZCwgdXNlIExPQ0FMX09CSi5wcm9wTmFtZSB0byBhY2Nlc3MgdGhlIG9iaiwgZWxzZSBqdXN0IHVzZSBvXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9ianNUb0NsZWFyX2lOJHQucHVzaChvYmopO1xyXG5cclxuICAgICAgICB0aGlzLmVudW1lcmF0ZU9iamVjdChjb2RlQXJyYXksIG9iaik7XHJcbiAgICAgICAgcmV0dXJuIFsnKGZ1bmN0aW9uKCl7JyxcclxuICAgICAgICAgICAgICAgICAgICBjb2RlQXJyYXksXHJcbiAgICAgICAgICAgICAgICAncmV0dXJuIG87fSkoKTsnXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsc1RvRGVmYXVsdCAoZGVmLCB2YWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBkZWYgPSBkZWYoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChkZWYgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVmICYmIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGRlZiBpbnN0YW5jZW9mIGxlZ2FjeUNDLlZhbHVlVHlwZSAmJiBkZWYuZXF1YWxzKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChBcnJheS5pc0FycmF5KGRlZikgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHx8XHJcbiAgICAgICAgICAgIChkZWYuY29uc3RydWN0b3IgPT09IE9iamVjdCAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZGVmKSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiBkZWYubGVuZ3RoID09PSAwICYmIHZhbHVlLmxlbmd0aCA9PT0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZSAobm9kZSkge1xyXG4gICAgY29uc3Qgcm9vdCA9IChub2RlIGluc3RhbmNlb2YgbGVnYWN5Q0MuX0Jhc2VOb2RlKSAmJiBub2RlO1xyXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihub2RlLCByb290KTtcclxuICAgIHJldHVybiBwYXJzZXIucmVzdWx0O1xyXG59XHJcblxyXG5pZiAoVEVTVCkge1xyXG4gICAgbGVnYWN5Q0MuX1Rlc3QuSW50YW50aWF0ZUppdCA9IHtcclxuICAgICAgICBlcXVhbHNUb0RlZmF1bHQsXHJcbiAgICAgICAgY29tcGlsZSxcclxuICAgIH07XHJcbn1cclxuIl19