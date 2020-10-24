(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../platform/debug.js", "../../utils/js.js", "./attribute.js", "../../default-constants.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../platform/debug.js"), require("../../utils/js.js"), require("./attribute.js"), require("../../default-constants.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.js, global.attribute, global.defaultConstants, global.globalExports);
    global.preprocessClass = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, js, _attribute, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getFullFormOfProperty = getFullFormOfProperty;
  _exports.preprocessAttrs = preprocessAttrs;
  _exports.doValidateMethodWithProps_DEV = doValidateMethodWithProps_DEV;
  _exports.validateMethodWithProps = validateMethodWithProps;
  js = _interopRequireWildcard(js);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
  // 增加预处理属性这个步骤的目的是降低 CCClass 的实现难度，将比较稳定的通用逻辑和一些需求比较灵活的属性需求分隔开。
  var SerializableAttrs = {
    url: {
      canUsedInGet: true
    },
    "default": {},
    serializable: {},
    editorOnly: {},
    formerlySerializedAs: {}
  };
  var TYPO_TO_CORRECT_DEV = _defaultConstants.DEV && {
    extend: 'extends',
    property: 'properties',
    "static": 'statics',
    constructor: 'ctor'
  };
  /**
   * 预处理 notify 等扩展属性
   */

  function parseNotify(val, propName, notify, properties) {
    if (val.get || val.set) {
      if (_defaultConstants.DEV) {
        (0, _debug.warnID)(5500);
      }

      return;
    }

    if (val.hasOwnProperty('default')) {
      // 添加新的内部属性，将原来的属性修改为 getter/setter 形式
      // （以 _ 开头将自动设置property 为 visible: false）
      var newKey = '_N$' + propName;

      val.get = function () {
        return this[newKey];
      };

      val.set = function (value) {
        var oldValue = this[newKey];
        this[newKey] = value;
        notify.call(this, oldValue);
      };

      var newValue = {};
      properties[newKey] = newValue; // 将不能用于get方法中的属性移动到newValue中
      // tslint:disable: forin

      for (var attr in SerializableAttrs) {
        var v = SerializableAttrs[attr];

        if (val.hasOwnProperty(attr)) {
          newValue[attr] = val[attr];

          if (!v.canUsedInGet) {
            delete val[attr];
          }
        }
      }
    } else if (_defaultConstants.DEV) {
      (0, _debug.warnID)(5501);
    }
  }
  /**
   * 检查 url
   */


  function checkUrl(val, className, propName, url) {
    if (Array.isArray(url)) {
      if (url.length > 0) {
        url = url[0];
      } else if (_defaultConstants.EDITOR) {
        return (0, _debug.errorID)(5502, className, propName);
      }
    }

    if (_defaultConstants.EDITOR) {
      if (url == null) {
        return (0, _debug.warnID)(5503, className, propName);
      }

      if (typeof url !== 'function' || !js.isChildClassOf(url, _globalExports.legacyCC.RawAsset)) {
        return (0, _debug.errorID)(5504, className, propName);
      }

      if (url === _globalExports.legacyCC.RawAsset) {
        (0, _debug.warn)('Please change the definition of property \'%s\' in class \'%s\'. Starting from v1.10,\n' + 'the use of declaring a property in CCClass as a URL has been deprecated.\n' + 'For example, if property is cc.RawAsset, the previous definition is:\n' + '    %s: cc.RawAsset,\n' + '    // or:\n' + '    %s: {\n' + '      url: cc.RawAsset,\n' + '      default: ""\n' + '    },\n' + '    // and the original method to get url is:\n' + '    `this.%s`\n' + 'Now it should be changed to:\n' + '    %s: {\n' + '      type: cc.Asset,     // use \'type:\' to define Asset object directly\n' + '      default: null,      // object\'s default value is null\n' + '    },\n' + '    // and you must get the url by using:\n' + '    `this.%s.nativeUrl`\n' + '(This helps us to successfully refactor all RawAssets at v2.0, ' + "sorry for the inconvenience. \uD83D\uDE30 )", propName, className, propName, propName, propName, propName, propName);
      } else if (js.isChildClassOf(url, _globalExports.legacyCC.Asset)) {
        return (0, _debug.errorID)(5505, className, propName, _globalExports.legacyCC.js.getClassName(url));
      }

      if (val.type) {
        return (0, _debug.warnID)(5506, className, propName);
      }
    }

    val.type = url;
  }
  /**
   * 解析类型
   */


  function parseType(val, type, className, propName) {
    if (Array.isArray(type)) {
      if ((_defaultConstants.EDITOR || _defaultConstants.TEST) && 'default' in val) {
        if (!_globalExports.legacyCC.Class.isArray(val["default"])) {
          (0, _debug.warnID)(5507, className, propName);
        }
      }

      if (type.length > 0) {
        if (_globalExports.legacyCC.RawAsset.isRawAssetType(type[0])) {
          val.url = type[0];
          delete val.type;
          return;
        } else {
          val.type = type = type[0];
        }
      } else {
        return (0, _debug.errorID)(5508, className, propName);
      }
    }

    if (_defaultConstants.EDITOR || _defaultConstants.TEST) {
      if (typeof type === 'function') {
        if (_globalExports.legacyCC.RawAsset.isRawAssetType(type)) {
          (0, _debug.warnID)(5509, className, propName, js.getClassName(type));
        } else if (type === String) {
          val.type = _globalExports.legacyCC.String;
          (0, _debug.warnID)(3608, "\"".concat(className, ".").concat(propName, "\""));
        } else if (type === Boolean) {
          val.type = _globalExports.legacyCC.Boolean;
          (0, _debug.warnID)(3609, "\"".concat(className, ".").concat(propName, "\""));
        } else if (type === Number) {
          val.type = _globalExports.legacyCC.Float;
          (0, _debug.warnID)(3610, "\"".concat(className, ".").concat(propName, "\""));
        }
      } else {
        switch (type) {
          case 'Number':
            (0, _debug.warnID)(5510, className, propName);
            break;

          case 'String':
            (0, _debug.warn)("The type of \"".concat(className, ".").concat(propName, "\" must be CCString, not \"String\"."));
            break;

          case 'Boolean':
            (0, _debug.warn)("The type of \"".concat(className, ".").concat(propName, "\" must be CCBoolean, not \"Boolean\"."));
            break;

          case 'Float':
            (0, _debug.warn)("The type of \"".concat(className, ".").concat(propName, "\" must be CCFloat, not \"Float\"."));
            break;

          case 'Integer':
            (0, _debug.warn)("The type of \"".concat(className, ".").concat(propName, "\" must be CCInteger, not \"Integer\"."));
            break;

          case null:
            (0, _debug.warnID)(5511, className, propName);
            break;
        }
      }
    }
  }

  function postCheckType(val, type, className, propName) {
    if (_defaultConstants.EDITOR && typeof type === 'function') {
      if (_globalExports.legacyCC.Class._isCCClass(type) && val.serializable !== false && !js._getClassId(type, false)) {
        (0, _debug.warnID)(5512, className, propName, className, propName);
      }
    }
  }

  function getBaseClassWherePropertyDefined_DEV(propName, cls) {
    if (_defaultConstants.DEV) {
      var res;

      for (; cls && cls.__props__ && cls.__props__.indexOf(propName) !== -1; cls = cls.$super) {
        res = cls;
      }

      if (!res) {
        (0, _debug.error)('unknown error');
      }

      return res;
    }
  } // tslint:disable: no-shadowed-variable


  function getFullFormOfProperty(options, propname_dev, classname_dev) {
    var isLiteral = options && options.constructor === Object;

    if (!isLiteral) {
      if (Array.isArray(options) && options.length > 0) {
        var type = options[0];
        return {
          "default": [],
          type: options,
          _short: true
        };
      } else if (typeof options === 'function') {
        var _type = options;

        if (!_globalExports.legacyCC.RawAsset.isRawAssetType(_type)) {
          return {
            "default": js.isChildClassOf(_type, _globalExports.legacyCC.ValueType) ? new _type() : null,
            type: _type,
            _short: true
          };
        }

        return {
          "default": '',
          url: _type,
          _short: true
        };
      } else if (options instanceof _attribute.PrimitiveType) {
        return {
          "default": options["default"],
          _short: true
        };
      } else {
        return {
          "default": options,
          _short: true
        };
      }
    }

    return null;
  }

  function preprocessAttrs(properties, className, cls, es6) {
    for (var propName in properties) {
      var val = properties[propName];
      var fullForm = getFullFormOfProperty(val, propName, className);

      if (fullForm) {
        val = properties[propName] = fullForm;
      }

      if (val) {
        if (_defaultConstants.EDITOR) {
          if ('default' in val) {
            if (val.get) {
              (0, _debug.errorID)(5513, className, propName);
            } else if (val.set) {
              (0, _debug.errorID)(5514, className, propName);
            } else if (_globalExports.legacyCC.Class._isCCClass(val["default"])) {
              val["default"] = null;
              (0, _debug.errorID)(5515, className, propName);
            }
          } else if (!val.get && !val.set) {
            var maybeTypeScript = es6;

            if (!maybeTypeScript) {
              (0, _debug.errorID)(5516, className, propName);
            }
          }
        }

        if (_defaultConstants.DEV && !val.override && cls.__props__.indexOf(propName) !== -1) {
          // check override
          var baseClass = js.getClassName(getBaseClassWherePropertyDefined_DEV(propName, cls));
          (0, _debug.warnID)(5517, className, propName, baseClass, propName);
        }

        var notify = val.notify;

        if (notify) {
          if (_defaultConstants.DEV && es6) {
            (0, _debug.error)('not yet support notify attribute for ES6 Classes');
          } else {
            parseNotify(val, propName, notify, properties);
          }
        }

        if ('type' in val) {
          parseType(val, val.type, className, propName);
        }

        if ('url' in val) {
          checkUrl(val, className, propName, val.url);
        }

        if ('type' in val) {
          postCheckType(val, val.type, className, propName);
        }
      }
    }
  }

  var CALL_SUPER_DESTROY_REG_DEV = /\b\._super\b|destroy.*\.call\s*\(\s*\w+\s*[,|)]/;

  function doValidateMethodWithProps_DEV(func, funcName, className, cls, base) {
    if (cls.__props__ && cls.__props__.indexOf(funcName) >= 0) {
      // find class that defines this method as a property
      var baseClassName = js.getClassName(getBaseClassWherePropertyDefined_DEV(funcName, cls));
      (0, _debug.errorID)(3648, className, funcName, baseClassName);
      return false;
    }

    if (funcName === 'destroy' && js.isChildClassOf(base, _globalExports.legacyCC.Component) && !CALL_SUPER_DESTROY_REG_DEV.test(func)) {
      // tslint:disable-next-line: max-line-length
      (0, _debug.error)("Overwriting '".concat(funcName, "' function in '").concat(className, "' class without calling super is not allowed. Call the super function in '").concat(funcName, "' please."));
    }
  }

  function validateMethodWithProps(func, funcName, className, cls, base) {
    if (_defaultConstants.DEV && funcName === 'constructor') {
      (0, _debug.errorID)(3643, className);
      return false;
    }

    if (typeof func === 'function' || func === null) {
      if (_defaultConstants.DEV) {
        doValidateMethodWithProps_DEV(func, funcName, className, cls, base);
      }
    } else {
      if (_defaultConstants.DEV) {
        if (func === false && base && base.prototype) {
          // check override
          var overrided = base.prototype[funcName];

          if (typeof overrided === 'function') {
            var baseFuc = js.getClassName(base) + '.' + funcName;
            var subFuc = className + '.' + funcName;
            (0, _debug.warnID)(3624, subFuc, baseFuc, subFuc, subFuc);
          }
        }

        var correct = TYPO_TO_CORRECT_DEV[funcName];

        if (correct) {
          (0, _debug.warnID)(3621, className, funcName, correct);
        } else if (func) {
          (0, _debug.errorID)(3622, className, funcName);
        }
      }

      return false;
    }

    return true;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9wcmVwcm9jZXNzLWNsYXNzLnRzIl0sIm5hbWVzIjpbIlNlcmlhbGl6YWJsZUF0dHJzIiwidXJsIiwiY2FuVXNlZEluR2V0Iiwic2VyaWFsaXphYmxlIiwiZWRpdG9yT25seSIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwiVFlQT19UT19DT1JSRUNUX0RFViIsIkRFViIsImV4dGVuZCIsInByb3BlcnR5IiwiY29uc3RydWN0b3IiLCJwYXJzZU5vdGlmeSIsInZhbCIsInByb3BOYW1lIiwibm90aWZ5IiwicHJvcGVydGllcyIsImdldCIsInNldCIsImhhc093blByb3BlcnR5IiwibmV3S2V5IiwidmFsdWUiLCJvbGRWYWx1ZSIsImNhbGwiLCJuZXdWYWx1ZSIsImF0dHIiLCJ2IiwiY2hlY2tVcmwiLCJjbGFzc05hbWUiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJFRElUT1IiLCJqcyIsImlzQ2hpbGRDbGFzc09mIiwibGVnYWN5Q0MiLCJSYXdBc3NldCIsIkFzc2V0IiwiZ2V0Q2xhc3NOYW1lIiwidHlwZSIsInBhcnNlVHlwZSIsIlRFU1QiLCJDbGFzcyIsImlzUmF3QXNzZXRUeXBlIiwiU3RyaW5nIiwiQm9vbGVhbiIsIk51bWJlciIsIkZsb2F0IiwicG9zdENoZWNrVHlwZSIsIl9pc0NDQ2xhc3MiLCJfZ2V0Q2xhc3NJZCIsImdldEJhc2VDbGFzc1doZXJlUHJvcGVydHlEZWZpbmVkX0RFViIsImNscyIsInJlcyIsIl9fcHJvcHNfXyIsImluZGV4T2YiLCIkc3VwZXIiLCJnZXRGdWxsRm9ybU9mUHJvcGVydHkiLCJvcHRpb25zIiwicHJvcG5hbWVfZGV2IiwiY2xhc3NuYW1lX2RldiIsImlzTGl0ZXJhbCIsIk9iamVjdCIsIl9zaG9ydCIsIlZhbHVlVHlwZSIsIlByaW1pdGl2ZVR5cGUiLCJwcmVwcm9jZXNzQXR0cnMiLCJlczYiLCJmdWxsRm9ybSIsIm1heWJlVHlwZVNjcmlwdCIsIm92ZXJyaWRlIiwiYmFzZUNsYXNzIiwiQ0FMTF9TVVBFUl9ERVNUUk9ZX1JFR19ERVYiLCJkb1ZhbGlkYXRlTWV0aG9kV2l0aFByb3BzX0RFViIsImZ1bmMiLCJmdW5jTmFtZSIsImJhc2UiLCJiYXNlQ2xhc3NOYW1lIiwiQ29tcG9uZW50IiwidGVzdCIsInZhbGlkYXRlTWV0aG9kV2l0aFByb3BzIiwicHJvdG90eXBlIiwib3ZlcnJpZGVkIiwiYmFzZUZ1YyIsInN1YkZ1YyIsImNvcnJlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDQTtBQUVBLE1BQU1BLGlCQUFpQixHQUFHO0FBQ3RCQyxJQUFBQSxHQUFHLEVBQUU7QUFDREMsTUFBQUEsWUFBWSxFQUFFO0FBRGIsS0FEaUI7QUFJdEIsZUFBUyxFQUphO0FBS3RCQyxJQUFBQSxZQUFZLEVBQUUsRUFMUTtBQU10QkMsSUFBQUEsVUFBVSxFQUFFLEVBTlU7QUFPdEJDLElBQUFBLG9CQUFvQixFQUFFO0FBUEEsR0FBMUI7QUFVQSxNQUFNQyxtQkFBbUIsR0FBR0MseUJBQU87QUFDL0JDLElBQUFBLE1BQU0sRUFBRSxTQUR1QjtBQUUvQkMsSUFBQUEsUUFBUSxFQUFFLFlBRnFCO0FBRy9CLGNBQVEsU0FIdUI7QUFJL0JDLElBQUFBLFdBQVcsRUFBRTtBQUprQixHQUFuQztBQU9BOzs7O0FBR0EsV0FBU0MsV0FBVCxDQUFzQkMsR0FBdEIsRUFBMkJDLFFBQTNCLEVBQXFDQyxNQUFyQyxFQUE2Q0MsVUFBN0MsRUFBeUQ7QUFDckQsUUFBSUgsR0FBRyxDQUFDSSxHQUFKLElBQVdKLEdBQUcsQ0FBQ0ssR0FBbkIsRUFBd0I7QUFDcEIsVUFBSVYscUJBQUosRUFBUztBQUNMLDJCQUFPLElBQVA7QUFDSDs7QUFDRDtBQUNIOztBQUNELFFBQUlLLEdBQUcsQ0FBQ00sY0FBSixDQUFtQixTQUFuQixDQUFKLEVBQW1DO0FBQy9CO0FBQ0E7QUFDQSxV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Q0MsSUFBRCxFQUFPQyxRQUFQLEVBQWlCL0MsU0FBakIsRUFBNEJ3QixHQUE1QixFQUFpQ3dCLElBQWpDLENBQTdCO0FBQ0g7QUFDSixLQUpELE1BS0s7QUFDRCxVQUFJcEUscUJBQUosRUFBUztBQUNMLFlBQUlrRSxJQUFJLEtBQUssS0FBVCxJQUFrQkUsSUFBbEIsSUFBMEJBLElBQUksQ0FBQ0ssU0FBbkMsRUFBOEM7QUFDMUM7QUFDQSxjQUFNQyxTQUFTLEdBQUdOLElBQUksQ0FBQ0ssU0FBTCxDQUFlTixRQUFmLENBQWxCOztBQUNBLGNBQUksT0FBT08sU0FBUCxLQUFxQixVQUF6QixFQUFxQztBQUNqQyxnQkFBTUMsT0FBTyxHQUFHbEQsRUFBRSxDQUFDSyxZQUFILENBQWdCc0MsSUFBaEIsSUFBd0IsR0FBeEIsR0FBOEJELFFBQTlDO0FBQ0EsZ0JBQU1TLE1BQU0sR0FBR3hELFNBQVMsR0FBRyxHQUFaLEdBQWtCK0MsUUFBakM7QUFDQSwrQkFBTyxJQUFQLEVBQWFTLE1BQWIsRUFBcUJELE9BQXJCLEVBQThCQyxNQUE5QixFQUFzQ0EsTUFBdEM7QUFDSDtBQUNKOztBQUNELFlBQU1DLE9BQU8sR0FBRzlFLG1CQUFtQixDQUFDb0UsUUFBRCxDQUFuQzs7QUFDQSxZQUFJVSxPQUFKLEVBQWE7QUFDVCw2QkFBTyxJQUFQLEVBQWF6RCxTQUFiLEVBQXdCK0MsUUFBeEIsRUFBa0NVLE9BQWxDO0FBQ0gsU0FGRCxNQUdLLElBQUlYLElBQUosRUFBVTtBQUNYLDhCQUFRLElBQVIsRUFBYzlDLFNBQWQsRUFBeUIrQyxRQUF6QjtBQUNIO0FBQ0o7O0FBQ0QsYUFBTyxLQUFQO0FBQ0g7O0FBQ0QsV0FBTyxJQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG5pbXBvcnQgeyBlcnJvciwgZXJyb3JJRCwgd2Fybiwgd2FybklEIH0gZnJvbSAnLi4vLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgKiBhcyBqcyBmcm9tICcuLi8uLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IFByaW1pdGl2ZVR5cGUgfSBmcm9tICcuL2F0dHJpYnV0ZSc7XHJcbmltcG9ydCB7IERFViwgRURJVE9SLCBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vLyDlop7liqDpooTlpITnkIblsZ7mgKfov5nkuKrmraXpqqTnmoTnm67nmoTmmK/pmY3kvY4gQ0NDbGFzcyDnmoTlrp7njrDpmr7luqbvvIzlsIbmr5TovoPnqLPlrprnmoTpgJrnlKjpgLvovpHlkozkuIDkupvpnIDmsYLmr5TovoPngbXmtLvnmoTlsZ7mgKfpnIDmsYLliIbpmpTlvIDjgIJcclxuXHJcbmNvbnN0IFNlcmlhbGl6YWJsZUF0dHJzID0ge1xyXG4gICAgdXJsOiB7XHJcbiAgICAgICAgY2FuVXNlZEluR2V0OiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGRlZmF1bHQ6IHt9LFxyXG4gICAgc2VyaWFsaXphYmxlOiB7fSxcclxuICAgIGVkaXRvck9ubHk6IHt9LFxyXG4gICAgZm9ybWVybHlTZXJpYWxpemVkQXM6IHt9LFxyXG59O1xyXG5cclxuY29uc3QgVFlQT19UT19DT1JSRUNUX0RFViA9IERFViAmJiB7XHJcbiAgICBleHRlbmQ6ICdleHRlbmRzJyxcclxuICAgIHByb3BlcnR5OiAncHJvcGVydGllcycsXHJcbiAgICBzdGF0aWM6ICdzdGF0aWNzJyxcclxuICAgIGNvbnN0cnVjdG9yOiAnY3RvcicsXHJcbn07XHJcblxyXG4vKipcclxuICog6aKE5aSE55CGIG5vdGlmeSDnrYnmianlsZXlsZ7mgKdcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlTm90aWZ5ICh2YWwsIHByb3BOYW1lLCBub3RpZnksIHByb3BlcnRpZXMpIHtcclxuICAgIGlmICh2YWwuZ2V0IHx8IHZhbC5zZXQpIHtcclxuICAgICAgICBpZiAoREVWKSB7XHJcbiAgICAgICAgICAgIHdhcm5JRCg1NTAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpKSB7XHJcbiAgICAgICAgLy8g5re75Yqg5paw55qE5YaF6YOo5bGe5oCn77yM5bCG5Y6f5p2l55qE5bGe5oCn5L+u5pS55Li6IGdldHRlci9zZXR0ZXIg5b2i5byPXHJcbiAgICAgICAgLy8g77yI5LulIF8g5byA5aS05bCG6Ieq5Yqo6K6+572ucHJvcGVydHkg5Li6IHZpc2libGU6IGZhbHNl77yJXHJcbiAgICAgICAgY29uc3QgbmV3S2V5ID0gJ19OJCcgKyBwcm9wTmFtZTtcclxuXHJcbiAgICAgICAgdmFsLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbbmV3S2V5XTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhbC5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzW25ld0tleV07XHJcbiAgICAgICAgICAgIHRoaXNbbmV3S2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBub3RpZnkuY2FsbCh0aGlzLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICBwcm9wZXJ0aWVzW25ld0tleV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAvLyDlsIbkuI3og73nlKjkuo5nZXTmlrnms5XkuK3nmoTlsZ7mgKfnp7vliqjliLBuZXdWYWx1ZeS4rVxyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlOiBmb3JpblxyXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBpbiBTZXJpYWxpemFibGVBdHRycykge1xyXG4gICAgICAgICAgICBjb25zdCB2ID0gU2VyaWFsaXphYmxlQXR0cnNbYXR0cl07XHJcbiAgICAgICAgICAgIGlmICh2YWwuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlW2F0dHJdID0gdmFsW2F0dHJdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2LmNhblVzZWRJbkdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWxbYXR0cl07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChERVYpIHtcclxuICAgICAgICB3YXJuSUQoNTUwMSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmo4Dmn6UgdXJsXHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja1VybCAodmFsLCBjbGFzc05hbWUsIHByb3BOYW1lLCB1cmwpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHVybCkpIHtcclxuICAgICAgICBpZiAodXJsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdXJsID0gdXJsWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVycm9ySUQoNTUwMiwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgIGlmICh1cmwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2FybklEKDU1MDMsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHVybCAhPT0gJ2Z1bmN0aW9uJyB8fCAhanMuaXNDaGlsZENsYXNzT2YodXJsLCBsZWdhY3lDQy5SYXdBc3NldCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVycm9ySUQoNTUwNCwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh1cmwgPT09IGxlZ2FjeUNDLlJhd0Fzc2V0KSB7XHJcbiAgICAgICAgICAgIHdhcm4oJ1BsZWFzZSBjaGFuZ2UgdGhlIGRlZmluaXRpb24gb2YgcHJvcGVydHkgXFwnJXNcXCcgaW4gY2xhc3MgXFwnJXNcXCcuIFN0YXJ0aW5nIGZyb20gdjEuMTAsXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJ3RoZSB1c2Ugb2YgZGVjbGFyaW5nIGEgcHJvcGVydHkgaW4gQ0NDbGFzcyBhcyBhIFVSTCBoYXMgYmVlbiBkZXByZWNhdGVkLlxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICdGb3IgZXhhbXBsZSwgaWYgcHJvcGVydHkgaXMgY2MuUmF3QXNzZXQsIHRoZSBwcmV2aW91cyBkZWZpbml0aW9uIGlzOlxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgJXM6IGNjLlJhd0Fzc2V0LFxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgLy8gb3I6XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyAgICAlczoge1xcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgICB1cmw6IGNjLlJhd0Fzc2V0LFxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgICBkZWZhdWx0OiBcIlwiXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyAgICB9LFxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgLy8gYW5kIHRoZSBvcmlnaW5hbCBtZXRob2QgdG8gZ2V0IHVybCBpczpcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAnICAgIGB0aGlzLiVzYFxcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICdOb3cgaXQgc2hvdWxkIGJlIGNoYW5nZWQgdG86XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyAgICAlczoge1xcbicgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgICAgICB0eXBlOiBjYy5Bc3NldCwgICAgIC8vIHVzZSBcXCd0eXBlOlxcJyB0byBkZWZpbmUgQXNzZXQgb2JqZWN0IGRpcmVjdGx5XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyAgICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gb2JqZWN0XFwncyBkZWZhdWx0IHZhbHVlIGlzIG51bGxcXG4nICtcclxuICAgICAgICAgICAgICAgICAgICAnICAgIH0sXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyAgICAvLyBhbmQgeW91IG11c3QgZ2V0IHRoZSB1cmwgYnkgdXNpbmc6XFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyAgICBgdGhpcy4lcy5uYXRpdmVVcmxgXFxuJyArXHJcbiAgICAgICAgICAgICAgICAgICAgJyhUaGlzIGhlbHBzIHVzIHRvIHN1Y2Nlc3NmdWxseSByZWZhY3RvciBhbGwgUmF3QXNzZXRzIGF0IHYyLjAsICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICdzb3JyeSBmb3IgdGhlIGluY29udmVuaWVuY2UuIFxcdUQ4M0RcXHVERTMwICknLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BOYW1lLCBjbGFzc05hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSwgcHJvcE5hbWUsIHByb3BOYW1lLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGpzLmlzQ2hpbGRDbGFzc09mKHVybCwgbGVnYWN5Q0MuQXNzZXQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlcnJvcklEKDU1MDUsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIGxlZ2FjeUNDLmpzLmdldENsYXNzTmFtZSh1cmwpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbC50eXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3YXJuSUQoNTUwNiwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFsLnR5cGUgPSB1cmw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDop6PmnpDnsbvlnotcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlVHlwZSAodmFsLCB0eXBlLCBjbGFzc05hbWUsIHByb3BOYW1lKSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0eXBlKSkge1xyXG4gICAgICAgIGlmICgoRURJVE9SIHx8IFRFU1QpICYmICdkZWZhdWx0JyBpbiB2YWwpIHtcclxuICAgICAgICAgICAgaWYgKCFsZWdhY3lDQy5DbGFzcy5pc0FycmF5KHZhbC5kZWZhdWx0KSkge1xyXG4gICAgICAgICAgICAgICAgd2FybklEKDU1MDcsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKGxlZ2FjeUNDLlJhd0Fzc2V0LmlzUmF3QXNzZXRUeXBlKHR5cGVbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwudXJsID0gdHlwZVswXTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWwudHlwZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbC50eXBlID0gdHlwZSA9IHR5cGVbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZXJyb3JJRCg1NTA4LCBjbGFzc05hbWUsIHByb3BOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoRURJVE9SIHx8IFRFU1QpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgaWYgKGxlZ2FjeUNDLlJhd0Fzc2V0LmlzUmF3QXNzZXRUeXBlKHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoNTUwOSwgY2xhc3NOYW1lLCBwcm9wTmFtZSwganMuZ2V0Q2xhc3NOYW1lKHR5cGUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSBTdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIHZhbC50eXBlID0gbGVnYWN5Q0MuU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgd2FybklEKDM2MDgsIGBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiYCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gQm9vbGVhbikge1xyXG4gICAgICAgICAgICAgICAgdmFsLnR5cGUgPSBsZWdhY3lDQy5Cb29sZWFuO1xyXG4gICAgICAgICAgICAgICAgd2FybklEKDM2MDksIGBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiYCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwudHlwZSA9IGxlZ2FjeUNDLkZsb2F0O1xyXG4gICAgICAgICAgICAgICAgd2FybklEKDM2MTAsIGBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ051bWJlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybklEKDU1MTAsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnU3RyaW5nJzpcclxuICAgICAgICAgICAgICAgICAgICB3YXJuKGBUaGUgdHlwZSBvZiBcIiR7Y2xhc3NOYW1lfS4ke3Byb3BOYW1lfVwiIG11c3QgYmUgQ0NTdHJpbmcsIG5vdCBcIlN0cmluZ1wiLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnQm9vbGVhbic6XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgVGhlIHR5cGUgb2YgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cIiBtdXN0IGJlIENDQm9vbGVhbiwgbm90IFwiQm9vbGVhblwiLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnRmxvYXQnOlxyXG4gICAgICAgICAgICAgICAgICAgIHdhcm4oYFRoZSB0eXBlIG9mIFwiJHtjbGFzc05hbWV9LiR7cHJvcE5hbWV9XCIgbXVzdCBiZSBDQ0Zsb2F0LCBub3QgXCJGbG9hdFwiLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnSW50ZWdlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybihgVGhlIHR5cGUgb2YgXCIke2NsYXNzTmFtZX0uJHtwcm9wTmFtZX1cIiBtdXN0IGJlIENDSW50ZWdlciwgbm90IFwiSW50ZWdlclwiLmApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBudWxsOlxyXG4gICAgICAgICAgICAgICAgICAgIHdhcm5JRCg1NTExLCBjbGFzc05hbWUsIHByb3BOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcG9zdENoZWNrVHlwZSAodmFsLCB0eXBlLCBjbGFzc05hbWUsIHByb3BOYW1lKSB7XHJcbiAgICBpZiAoRURJVE9SICYmIHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLkNsYXNzLl9pc0NDQ2xhc3ModHlwZSkgJiYgdmFsLnNlcmlhbGl6YWJsZSAhPT0gZmFsc2UgJiYgIWpzLl9nZXRDbGFzc0lkKHR5cGUsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTUxMiwgY2xhc3NOYW1lLCBwcm9wTmFtZSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRCYXNlQ2xhc3NXaGVyZVByb3BlcnR5RGVmaW5lZF9ERVYgKHByb3BOYW1lLCBjbHMpIHtcclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBsZXQgcmVzO1xyXG4gICAgICAgIGZvciAoOyBjbHMgJiYgY2xzLl9fcHJvcHNfXyAmJiBjbHMuX19wcm9wc19fLmluZGV4T2YocHJvcE5hbWUpICE9PSAtMTsgY2xzID0gY2xzLiRzdXBlcikge1xyXG4gICAgICAgICAgICByZXMgPSBjbHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcmVzKSB7XHJcbiAgICAgICAgICAgIGVycm9yKCd1bmtub3duIGVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOiBuby1zaGFkb3dlZC12YXJpYWJsZVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGxGb3JtT2ZQcm9wZXJ0eSAob3B0aW9ucywgcHJvcG5hbWVfZGV2PywgY2xhc3NuYW1lX2Rldj8pIHtcclxuICAgIGNvbnN0IGlzTGl0ZXJhbCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xyXG4gICAgaWYgKCAhaXNMaXRlcmFsICkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMpICYmIG9wdGlvbnMubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IG9wdGlvbnNbMF07XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBbXSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IG9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBfc2hvcnQ6IHRydWUsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gb3B0aW9ucztcclxuICAgICAgICAgICAgaWYgKCFsZWdhY3lDQy5SYXdBc3NldC5pc1Jhd0Fzc2V0VHlwZSh0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBqcy5pc0NoaWxkQ2xhc3NPZih0eXBlLCBsZWdhY3lDQy5WYWx1ZVR5cGUpID8gbmV3IHR5cGUoKSA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBfc2hvcnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAnJyxcclxuICAgICAgICAgICAgICAgIHVybDogdHlwZSxcclxuICAgICAgICAgICAgICAgIF9zaG9ydDogdHJ1ZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgaW5zdGFuY2VvZiBQcmltaXRpdmVUeXBlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBvcHRpb25zLmRlZmF1bHQsXHJcbiAgICAgICAgICAgICAgICBfc2hvcnQ6IHRydWUsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IG9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBfc2hvcnQ6IHRydWUsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcmVwcm9jZXNzQXR0cnMgKHByb3BlcnRpZXMsIGNsYXNzTmFtZSwgY2xzLCBlczYpIHtcclxuICAgIGZvciAoY29uc3QgcHJvcE5hbWUgaW4gcHJvcGVydGllcykge1xyXG4gICAgICAgIGxldCB2YWwgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcclxuICAgICAgICBjb25zdCBmdWxsRm9ybSA9IGdldEZ1bGxGb3JtT2ZQcm9wZXJ0eSh2YWwsIHByb3BOYW1lLCBjbGFzc05hbWUpO1xyXG4gICAgICAgIGlmIChmdWxsRm9ybSkge1xyXG4gICAgICAgICAgICB2YWwgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXSA9IGZ1bGxGb3JtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgICAgIGlmICgnZGVmYXVsdCcgaW4gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5nZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JJRCg1NTEzLCBjbGFzc05hbWUsIHByb3BOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsLnNldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcklEKDU1MTQsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChsZWdhY3lDQy5DbGFzcy5faXNDQ0NsYXNzKHZhbC5kZWZhdWx0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwuZGVmYXVsdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ySUQoNTUxNSwgY2xhc3NOYW1lLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXZhbC5nZXQgJiYgIXZhbC5zZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXliZVR5cGVTY3JpcHQgPSBlczY7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXliZVR5cGVTY3JpcHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JJRCg1NTE2LCBjbGFzc05hbWUsIHByb3BOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKERFViAmJiAhdmFsLm92ZXJyaWRlICYmIGNscy5fX3Byb3BzX18uaW5kZXhPZihwcm9wTmFtZSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBvdmVycmlkZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZUNsYXNzID0ganMuZ2V0Q2xhc3NOYW1lKGdldEJhc2VDbGFzc1doZXJlUHJvcGVydHlEZWZpbmVkX0RFVihwcm9wTmFtZSwgY2xzKSk7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoNTUxNywgY2xhc3NOYW1lLCBwcm9wTmFtZSwgYmFzZUNsYXNzLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgbm90aWZ5ID0gdmFsLm5vdGlmeTtcclxuICAgICAgICAgICAgaWYgKG5vdGlmeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKERFViAmJiBlczYpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcignbm90IHlldCBzdXBwb3J0IG5vdGlmeSBhdHRyaWJ1dGUgZm9yIEVTNiBDbGFzc2VzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZU5vdGlmeSh2YWwsIHByb3BOYW1lLCBub3RpZnksIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJ3R5cGUnIGluIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2VUeXBlKHZhbCwgdmFsLnR5cGUsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJ3VybCcgaW4gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja1VybCh2YWwsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbC51cmwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoJ3R5cGUnIGluIHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcG9zdENoZWNrVHlwZSh2YWwsIHZhbC50eXBlLCBjbGFzc05hbWUsIHByb3BOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgQ0FMTF9TVVBFUl9ERVNUUk9ZX1JFR19ERVYgPSAvXFxiXFwuX3N1cGVyXFxifGRlc3Ryb3kuKlxcLmNhbGxcXHMqXFwoXFxzKlxcdytcXHMqWyx8KV0vO1xyXG5leHBvcnQgZnVuY3Rpb24gZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYgKGZ1bmMsIGZ1bmNOYW1lLCBjbGFzc05hbWUsIGNscywgYmFzZSkge1xyXG4gICAgaWYgKGNscy5fX3Byb3BzX18gJiYgY2xzLl9fcHJvcHNfXy5pbmRleE9mKGZ1bmNOYW1lKSA+PSAwKSB7XHJcbiAgICAgICAgLy8gZmluZCBjbGFzcyB0aGF0IGRlZmluZXMgdGhpcyBtZXRob2QgYXMgYSBwcm9wZXJ0eVxyXG4gICAgICAgIGNvbnN0IGJhc2VDbGFzc05hbWUgPSBqcy5nZXRDbGFzc05hbWUoZ2V0QmFzZUNsYXNzV2hlcmVQcm9wZXJ0eURlZmluZWRfREVWKGZ1bmNOYW1lLCBjbHMpKTtcclxuICAgICAgICBlcnJvcklEKDM2NDgsIGNsYXNzTmFtZSwgZnVuY05hbWUsIGJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChmdW5jTmFtZSA9PT0gJ2Rlc3Ryb3knICYmXHJcbiAgICAgICAganMuaXNDaGlsZENsYXNzT2YoYmFzZSwgbGVnYWN5Q0MuQ29tcG9uZW50KSAmJlxyXG4gICAgICAgICFDQUxMX1NVUEVSX0RFU1RST1lfUkVHX0RFVi50ZXN0KGZ1bmMpXHJcbiAgICApIHtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgIGVycm9yKGBPdmVyd3JpdGluZyAnJHtmdW5jTmFtZX0nIGZ1bmN0aW9uIGluICcke2NsYXNzTmFtZX0nIGNsYXNzIHdpdGhvdXQgY2FsbGluZyBzdXBlciBpcyBub3QgYWxsb3dlZC4gQ2FsbCB0aGUgc3VwZXIgZnVuY3Rpb24gaW4gJyR7ZnVuY05hbWV9JyBwbGVhc2UuYCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU1ldGhvZFdpdGhQcm9wcyAoZnVuYywgZnVuY05hbWUsIGNsYXNzTmFtZSwgY2xzLCBiYXNlKSB7XHJcbiAgICBpZiAoREVWICYmIGZ1bmNOYW1lID09PSAnY29uc3RydWN0b3InKSB7XHJcbiAgICAgICAgZXJyb3JJRCgzNjQzLCBjbGFzc05hbWUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJyB8fCBmdW5jID09PSBudWxsKSB7XHJcbiAgICAgICAgaWYgKERFVikge1xyXG4gICAgICAgICAgICBkb1ZhbGlkYXRlTWV0aG9kV2l0aFByb3BzX0RFVihmdW5jLCBmdW5jTmFtZSwgY2xhc3NOYW1lLCBjbHMsIGJhc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgaWYgKGZ1bmMgPT09IGZhbHNlICYmIGJhc2UgJiYgYmFzZS5wcm90b3R5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIG92ZXJyaWRlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvdmVycmlkZWQgPSBiYXNlLnByb3RvdHlwZVtmdW5jTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG92ZXJyaWRlZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhc2VGdWMgPSBqcy5nZXRDbGFzc05hbWUoYmFzZSkgKyAnLicgKyBmdW5jTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJGdWMgPSBjbGFzc05hbWUgKyAnLicgKyBmdW5jTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuSUQoMzYyNCwgc3ViRnVjLCBiYXNlRnVjLCBzdWJGdWMsIHN1YkZ1Yyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgY29ycmVjdCA9IFRZUE9fVE9fQ09SUkVDVF9ERVZbZnVuY05hbWVdO1xyXG4gICAgICAgICAgICBpZiAoY29ycmVjdCkge1xyXG4gICAgICAgICAgICAgICAgd2FybklEKDM2MjEsIGNsYXNzTmFtZSwgZnVuY05hbWUsIGNvcnJlY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGZ1bmMpIHtcclxuICAgICAgICAgICAgICAgIGVycm9ySUQoMzYyMiwgY2xhc3NOYW1lLCBmdW5jTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuIl19