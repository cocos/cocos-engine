(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../platform/debug.js", "../../utils/js.js", "../../utils/misc.js", "../../default-constants.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../platform/debug.js"), require("../../utils/js.js"), require("../../utils/misc.js"), require("../../default-constants.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.js, global.misc, global.defaultConstants, global.globalExports);
    global.attribute = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _js, _misc, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createAttrsSingle = createAttrsSingle;
  _exports.createAttrs = createAttrs;
  _exports.attr = attr;
  _exports.getClassAttrs = getClassAttrs;
  _exports.getClassAttrsProto = getClassAttrsProto;
  _exports.setClassAttr = setClassAttr;
  _exports.getTypeChecker = getTypeChecker;
  _exports.getObjTypeChecker = getObjTypeChecker;
  _exports.CCString = _exports.CCBoolean = _exports.CCFloat = _exports.CCInteger = _exports.PrimitiveType = _exports.DELIMETER = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var DELIMETER = '$_$';
  _exports.DELIMETER = DELIMETER;

  function createAttrsSingle(owner, ownerConstructor, superAttrs) {
    var AttrsCtor;

    if (_defaultConstants.DEV && _defaultConstants.SUPPORT_JIT) {
      var ctorName = ownerConstructor.name;

      if (owner === ownerConstructor) {
        ctorName += '_ATTRS';
      } else {
        ctorName += '_ATTRS_INSTANCE';
      }

      AttrsCtor = Function('return (function ' + ctorName + '(){});')();
    } else {
      AttrsCtor = function AttrsCtor() {};
    }

    if (superAttrs) {
      (0, _js.extend)(AttrsCtor, superAttrs.constructor);
    }

    var attrs = new AttrsCtor();
    (0, _js.value)(owner, '__attrs__', attrs);
    return attrs;
  }
  /**
   * @param subclass Should not have '__attrs__'.
   */


  function createAttrs(subclass) {
    var superClass;

    var chains = _globalExports.legacyCC.Class.getInheritanceChain(subclass);

    for (var i = chains.length - 1; i >= 0; i--) {
      var cls = chains[i];

      var attrs = cls.hasOwnProperty('__attrs__') && cls.__attrs__;

      if (!attrs) {
        superClass = chains[i + 1];
        createAttrsSingle(cls, cls, superClass && superClass.__attrs__);
      }
    }

    superClass = chains[0];
    createAttrsSingle(subclass, subclass, superClass && superClass.__attrs__);
    return subclass.__attrs__;
  } // /**
  //  * @class Class
  //  */

  /**
   * Tag the class with any meta attributes, then return all current attributes assigned to it.
   * This function holds only the attributes, not their implementations.
   * @param constructor The class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
   * @param propertyName The name of property or function, used to retrieve the attributes.
   * @param [newAttributes] The attribute table to mark, new attributes will merged with existed attributes.
   * Attribute whose key starts with '_' will be ignored.
   * @private
   */


  function attr(constructor, propertyName, newAttributes) {
    var attrs, setter;

    if (typeof constructor === 'function') {
      // Attributes shared between instances.
      attrs = getClassAttrs(constructor);
      setter = attrs.constructor.prototype;
    } else {
      // Attributes in instance.
      var instance = constructor;
      attrs = instance.__attrs__;

      if (!attrs) {
        constructor = instance.constructor;
        var clsAttrs = getClassAttrs(constructor);
        attrs = createAttrsSingle(instance, constructor, clsAttrs);
      }

      setter = attrs;
    }

    if (typeof newAttributes === 'undefined') {
      // Get.
      var prefix = propertyName + DELIMETER;
      var ret = {};

      for (var key in attrs) {
        if (key.startsWith(prefix)) {
          ret[key.slice(prefix.length)] = attrs[key];
        }
      }

      return ret;
    } else {
      // Set.
      if (_typeof(newAttributes) === 'object') {
        for (var _key in newAttributes) {
          if (_key.charCodeAt(0) !== 95
          /* _ */
          ) {
              setter[propertyName + DELIMETER + _key] = newAttributes[_key];
            }
        }
      } else if (_defaultConstants.DEV) {
        (0, _debug.errorID)(3629);
      }
    }
  }
  /**
   * Returns a readonly meta object.
   */


  function getClassAttrs(constructor) {
    return constructor.hasOwnProperty('__attrs__') && constructor.__attrs__ || createAttrs(constructor);
  }
  /**
   * Returns a writable meta object, used to set multi attributes.
   */


  function getClassAttrsProto(constructor) {
    return getClassAttrs(constructor).constructor.prototype;
  }

  function setClassAttr(ctor, propName, key, value) {
    var proto = getClassAttrsProto(ctor);
    proto[propName + DELIMETER + key] = value;
  }

  var PrimitiveType = /*#__PURE__*/function () {
    function PrimitiveType(name, defaultValue) {
      _classCallCheck(this, PrimitiveType);

      this.name = void 0;
      this["default"] = void 0;
      this.name = name;
      this["default"] = defaultValue;
    }

    _createClass(PrimitiveType, [{
      key: "toString",
      value: function toString() {
        return this.name;
      }
    }]);

    return PrimitiveType;
  }();
  /**
   * 指定编辑器以整数形式对待该属性或数组元素。
   * 例如：
   * ```ts
   * import { CCInteger, _decorator } from "Cocos3D";
   *
   * // 在 cc 类定义中:
   *
   * \@_decorator.property({type: CCInteger})
   * count = 0;
   *
   * \@_decorator.property({type: [CCInteger]})
   * array = [];
   * ```
   */


  _exports.PrimitiveType = PrimitiveType;
  var CCInteger = new PrimitiveType('Integer', 0);
  _exports.CCInteger = CCInteger;
  _globalExports.legacyCC.Integer = CCInteger;
  _globalExports.legacyCC.CCInteger = CCInteger;
  /**
   * 指定编辑器以浮点数形式对待该属性或数组元素。
   * 例如：
   * ```ts
   * import { CCFloat, _decorator } from "Cocos3D";
   *
   * // 在 cc 类定义中:
   *
   * \@_decorator.property({type: CCFloat})
   * x = 0;
   *
   * \@_decorator.property({type: [CCFloat]})
   * array = [];
   * ```
   */

  var CCFloat = new PrimitiveType('Float', 0.0);
  _exports.CCFloat = CCFloat;
  _globalExports.legacyCC.Float = CCFloat;
  _globalExports.legacyCC.CCFloat = CCFloat;

  if (_defaultConstants.EDITOR) {
    (0, _js.get)(_globalExports.legacyCC, 'Number', function () {
      (0, _debug.warnID)(3603);
      return CCFloat;
    });
  }
  /**
   * 指定编辑器以布尔值形式对待该属性或数组元素。
   * 例如：
   * ```ts
   * import { CCBoolean, _decorator } from "Cocos3D";
   *
   * // 在 cc 类定义中:
   *
   * \@_decorator.property({type: CCBoolean})
   * isTrue = false;
   *
   * \@_decorator.property({type: [CCBoolean]})
   * array = [];
   * ```
   */


  var CCBoolean = new PrimitiveType('Boolean', false);
  _exports.CCBoolean = CCBoolean;
  _globalExports.legacyCC.Boolean = CCBoolean;
  _globalExports.legacyCC.CCBoolean = CCBoolean;
  /**
   * 指定编辑器以字符串形式对待该属性或数组元素。
   * 例如：
   * ```ts
   * import { CCString, _decorator } from "Cocos3D";
   *
   * // 在 cc 类定义中:
   *
   * \@_decorator.property({type: CCString})
   * name = '';
   *
   * \@_decorator.property({type: [CCString]})
   * array = [];
   * ```
   */

  var CCString = new PrimitiveType('String', '');
  _exports.CCString = CCString;
  _globalExports.legacyCC.String = CCString;
  _globalExports.legacyCC.CCString = CCString;
  /*
  BuiltinAttributes: {
      default: defaultValue,
      _canUsedInSetter: false, (default false) (NYI)
  }
  Getter or Setter: {
      hasGetter: true,
      hasSetter: true,
  }
  Callbacks: {
      _onAfterProp: function (constructor, propName) {},
      _onAfterGetter: function (constructor, propName) {}, (NYI)
      _onAfterSetter: function (constructor, propName) {}, (NYI)
  }
   */

  function getTypeChecker(type, attributeName) {
    return function (constructor, mainPropertyName) {
      var propInfo = '"' + (0, _js.getClassName)(constructor) + '.' + mainPropertyName + '"';
      var mainPropAttrs = attr(constructor, mainPropertyName);

      if (!mainPropAttrs.saveUrlAsAsset) {
        var mainPropAttrsType = mainPropAttrs.type;

        if (mainPropAttrsType === CCInteger || mainPropAttrsType === CCFloat) {
          mainPropAttrsType = 'Number';
        } else if (mainPropAttrsType === CCString || mainPropAttrsType === CCBoolean) {
          mainPropAttrsType = mainPropAttrsType.toString();
        }

        if (mainPropAttrsType !== type) {
          (0, _debug.warnID)(3604, propInfo);
          return;
        }
      }

      if (!mainPropAttrs.hasOwnProperty('default')) {
        return;
      }

      var defaultVal = mainPropAttrs["default"];

      if (typeof defaultVal === 'undefined') {
        return;
      }

      var isContainer = Array.isArray(defaultVal) || (0, _misc.isPlainEmptyObj_DEV)(defaultVal);

      if (isContainer) {
        return;
      }

      var defaultType = _typeof(defaultVal);

      var type_lowerCase = type.toLowerCase();

      if (defaultType === type_lowerCase) {
        if (!mainPropAttrs.saveUrlAsAsset) {
          if (type_lowerCase === 'object') {
            if (defaultVal && !(defaultVal instanceof mainPropAttrs.ctor)) {
              (0, _debug.warnID)(3605, propInfo, (0, _js.getClassName)(mainPropAttrs.ctor));
            } else {
              return;
            }
          } else if (type !== 'Number') {
            (0, _debug.warnID)(3606, attributeName, propInfo, type);
          }
        }
      } else if (defaultType !== 'function') {
        if (type === CCString["default"] && defaultVal == null) {
          if (!(0, _js.isChildClassOf)(mainPropAttrs.ctor, _globalExports.legacyCC.RawAsset)) {
            (0, _debug.warnID)(3607, propInfo);
          }
        } else {
          (0, _debug.warnID)(3611, attributeName, propInfo, defaultType);
        }
      } else {
        return;
      }

      delete mainPropAttrs.type;
    };
  }

  function getObjTypeChecker(typeCtor) {
    return function (classCtor, mainPropName) {
      getTypeChecker('Object', 'type')(classCtor, mainPropName); // check ValueType

      var defaultDef = getClassAttrs(classCtor)[mainPropName + DELIMETER + 'default'];

      var defaultVal = _globalExports.legacyCC.Class.getDefault(defaultDef);

      if (!Array.isArray(defaultVal) && (0, _js.isChildClassOf)(typeCtor, _globalExports.legacyCC.ValueType)) {
        var typename = (0, _js.getClassName)(typeCtor);
        var info = (0, _js.formatStr)('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.', (0, _js.getClassName)(classCtor), mainPropName, typename);

        if (defaultDef) {
          (0, _debug.log)(info);
        } else {
          (0, _debug.warnID)(3612, info, typename, (0, _js.getClassName)(classCtor), mainPropName, typename);
        }
      }
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9hdHRyaWJ1dGUudHMiXSwibmFtZXMiOlsiREVMSU1FVEVSIiwiY3JlYXRlQXR0cnNTaW5nbGUiLCJvd25lciIsIm93bmVyQ29uc3RydWN0b3IiLCJzdXBlckF0dHJzIiwiQXR0cnNDdG9yIiwiREVWIiwiU1VQUE9SVF9KSVQiLCJjdG9yTmFtZSIsIm5hbWUiLCJGdW5jdGlvbiIsImNvbnN0cnVjdG9yIiwiYXR0cnMiLCJjcmVhdGVBdHRycyIsInN1YmNsYXNzIiwic3VwZXJDbGFzcyIsImNoYWlucyIsImxlZ2FjeUNDIiwiQ2xhc3MiLCJnZXRJbmhlcml0YW5jZUNoYWluIiwiaSIsImxlbmd0aCIsImNscyIsImhhc093blByb3BlcnR5IiwiX19hdHRyc19fIiwiYXR0ciIsInByb3BlcnR5TmFtZSIsIm5ld0F0dHJpYnV0ZXMiLCJzZXR0ZXIiLCJnZXRDbGFzc0F0dHJzIiwicHJvdG90eXBlIiwiaW5zdGFuY2UiLCJjbHNBdHRycyIsInByZWZpeCIsInJldCIsImtleSIsInN0YXJ0c1dpdGgiLCJzbGljZSIsImNoYXJDb2RlQXQiLCJnZXRDbGFzc0F0dHJzUHJvdG8iLCJzZXRDbGFzc0F0dHIiLCJjdG9yIiwicHJvcE5hbWUiLCJ2YWx1ZSIsInByb3RvIiwiUHJpbWl0aXZlVHlwZSIsImRlZmF1bHRWYWx1ZSIsIkNDSW50ZWdlciIsIkludGVnZXIiLCJDQ0Zsb2F0IiwiRmxvYXQiLCJFRElUT1IiLCJDQ0Jvb2xlYW4iLCJCb29sZWFuIiwiQ0NTdHJpbmciLCJTdHJpbmciLCJnZXRUeXBlQ2hlY2tlciIsInR5cGUiLCJhdHRyaWJ1dGVOYW1lIiwibWFpblByb3BlcnR5TmFtZSIsInByb3BJbmZvIiwibWFpblByb3BBdHRycyIsInNhdmVVcmxBc0Fzc2V0IiwibWFpblByb3BBdHRyc1R5cGUiLCJ0b1N0cmluZyIsImRlZmF1bHRWYWwiLCJpc0NvbnRhaW5lciIsIkFycmF5IiwiaXNBcnJheSIsImRlZmF1bHRUeXBlIiwidHlwZV9sb3dlckNhc2UiLCJ0b0xvd2VyQ2FzZSIsIlJhd0Fzc2V0IiwiZ2V0T2JqVHlwZUNoZWNrZXIiLCJ0eXBlQ3RvciIsImNsYXNzQ3RvciIsIm1haW5Qcm9wTmFtZSIsImRlZmF1bHREZWYiLCJnZXREZWZhdWx0IiwiVmFsdWVUeXBlIiwidHlwZW5hbWUiLCJpbmZvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ08sTUFBTUEsU0FBUyxHQUFHLEtBQWxCOzs7QUFFQSxXQUFTQyxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBMkNDLGdCQUEzQyxFQUF1RUMsVUFBdkUsRUFBeUY7QUFDNUYsUUFBSUMsU0FBSjs7QUFDQSxRQUFJQyx5QkFBT0MsNkJBQVgsRUFBd0I7QUFDcEIsVUFBSUMsUUFBUSxHQUFHTCxnQkFBZ0IsQ0FBQ00sSUFBaEM7O0FBQ0EsVUFBSVAsS0FBSyxLQUFLQyxnQkFBZCxFQUFnQztBQUM1QkssUUFBQUEsUUFBUSxJQUFJLFFBQVo7QUFDSCxPQUZELE1BR0s7QUFDREEsUUFBQUEsUUFBUSxJQUFJLGlCQUFaO0FBQ0g7O0FBQ0RILE1BQUFBLFNBQVMsR0FBR0ssUUFBUSxDQUFDLHNCQUFzQkYsUUFBdEIsR0FBaUMsUUFBbEMsQ0FBUixFQUFaO0FBQ0gsS0FURCxNQVVLO0FBQ0RILE1BQUFBLFNBQVMsR0FBRyxxQkFBWSxDQUFHLENBQTNCO0FBQ0g7O0FBQ0QsUUFBSUQsVUFBSixFQUFnQjtBQUNaLHNCQUFPQyxTQUFQLEVBQWtCRCxVQUFVLENBQUNPLFdBQTdCO0FBQ0g7O0FBQ0QsUUFBTUMsS0FBSyxHQUFHLElBQUlQLFNBQUosRUFBZDtBQUNBLG1CQUFNSCxLQUFOLEVBQWEsV0FBYixFQUEwQlUsS0FBMUI7QUFDQSxXQUFPQSxLQUFQO0FBQ0g7QUFFRDs7Ozs7QUFHTyxXQUFTQyxXQUFULENBQXNCQyxRQUF0QixFQUFxQztBQUN4QyxRQUFJQyxVQUFKOztBQUNBLFFBQU1DLE1BQWEsR0FBR0Msd0JBQVNDLEtBQVQsQ0FBZUMsbUJBQWYsQ0FBbUNMLFFBQW5DLENBQXRCOztBQUNBLFNBQUssSUFBSU0sQ0FBQyxHQUFHSixNQUFNLENBQUNLLE1BQVAsR0FBZ0IsQ0FBN0IsRUFBZ0NELENBQUMsSUFBSSxDQUFyQyxFQUF3Q0EsQ0FBQyxFQUF6QyxFQUE2QztBQUN6QyxVQUFNRSxHQUFHLEdBQUdOLE1BQU0sQ0FBQ0ksQ0FBRCxDQUFsQjs7QUFDQSxVQUFNUixLQUFLLEdBQUdVLEdBQUcsQ0FBQ0MsY0FBSixDQUFtQixXQUFuQixLQUFtQ0QsR0FBRyxDQUFDRSxTQUFyRDs7QUFDQSxVQUFJLENBQUNaLEtBQUwsRUFBWTtBQUNSRyxRQUFBQSxVQUFVLEdBQUdDLE1BQU0sQ0FBQ0ksQ0FBQyxHQUFHLENBQUwsQ0FBbkI7QUFDQW5CLFFBQUFBLGlCQUFpQixDQUFDcUIsR0FBRCxFQUFNQSxHQUFOLEVBQVdQLFVBQVUsSUFBSUEsVUFBVSxDQUFDUyxTQUFwQyxDQUFqQjtBQUNIO0FBQ0o7O0FBQ0RULElBQUFBLFVBQVUsR0FBR0MsTUFBTSxDQUFDLENBQUQsQ0FBbkI7QUFDQWYsSUFBQUEsaUJBQWlCLENBQUNhLFFBQUQsRUFBV0EsUUFBWCxFQUFxQkMsVUFBVSxJQUFJQSxVQUFVLENBQUNTLFNBQTlDLENBQWpCO0FBQ0EsV0FBT1YsUUFBUSxDQUFDVSxTQUFoQjtBQUNILEcsQ0FFRDtBQUNBO0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7O0FBYU8sV0FBU0MsSUFBVCxDQUFlZCxXQUFmLEVBQWlDZSxZQUFqQyxFQUF1REMsYUFBdkQsRUFBK0U7QUFDbEYsUUFBSWYsS0FBSixFQUFnQmdCLE1BQWhCOztBQUNBLFFBQUksT0FBT2pCLFdBQVAsS0FBdUIsVUFBM0IsRUFBdUM7QUFDbkM7QUFDQUMsTUFBQUEsS0FBSyxHQUFHaUIsYUFBYSxDQUFDbEIsV0FBRCxDQUFyQjtBQUNBaUIsTUFBQUEsTUFBTSxHQUFHaEIsS0FBSyxDQUFDRCxXQUFOLENBQWtCbUIsU0FBM0I7QUFDSCxLQUpELE1BSU87QUFDSDtBQUNBLFVBQU1DLFFBQVEsR0FBR3BCLFdBQWpCO0FBQ0FDLE1BQUFBLEtBQUssR0FBR21CLFFBQVEsQ0FBQ1AsU0FBakI7O0FBQ0EsVUFBSSxDQUFDWixLQUFMLEVBQVk7QUFDUkQsUUFBQUEsV0FBVyxHQUFHb0IsUUFBUSxDQUFDcEIsV0FBdkI7QUFDQSxZQUFNcUIsUUFBUSxHQUFHSCxhQUFhLENBQUNsQixXQUFELENBQTlCO0FBQ0FDLFFBQUFBLEtBQUssR0FBR1gsaUJBQWlCLENBQUM4QixRQUFELEVBQVdwQixXQUFYLEVBQXdCcUIsUUFBeEIsQ0FBekI7QUFDSDs7QUFDREosTUFBQUEsTUFBTSxHQUFHaEIsS0FBVDtBQUNIOztBQUVELFFBQUksT0FBT2UsYUFBUCxLQUF5QixXQUE3QixFQUEwQztBQUN0QztBQUNBLFVBQU1NLE1BQU0sR0FBR1AsWUFBWSxHQUFHMUIsU0FBOUI7QUFDQSxVQUFNa0MsR0FBRyxHQUFHLEVBQVo7O0FBQ0EsV0FBSyxJQUFNQyxHQUFYLElBQWtCdkIsS0FBbEIsRUFBeUI7QUFDckIsWUFBSXVCLEdBQUcsQ0FBQ0MsVUFBSixDQUFlSCxNQUFmLENBQUosRUFBNEI7QUFDeEJDLFVBQUFBLEdBQUcsQ0FBQ0MsR0FBRyxDQUFDRSxLQUFKLENBQVVKLE1BQU0sQ0FBQ1osTUFBakIsQ0FBRCxDQUFILEdBQWdDVCxLQUFLLENBQUN1QixHQUFELENBQXJDO0FBQ0g7QUFDSjs7QUFDRCxhQUFPRCxHQUFQO0FBQ0gsS0FWRCxNQVVPO0FBQ0g7QUFDQSxVQUFJLFFBQU9QLGFBQVAsTUFBeUIsUUFBN0IsRUFBdUM7QUFDbkMsYUFBSyxJQUFNUSxJQUFYLElBQWtCUixhQUFsQixFQUFpQztBQUM3QixjQUFJUSxJQUFHLENBQUNHLFVBQUosQ0FBZSxDQUFmLE1BQXNCO0FBQUc7QUFBN0IsWUFBc0M7QUFDbENWLGNBQUFBLE1BQU0sQ0FBQ0YsWUFBWSxHQUFHMUIsU0FBZixHQUEyQm1DLElBQTVCLENBQU4sR0FBeUNSLGFBQWEsQ0FBQ1EsSUFBRCxDQUF0RDtBQUNIO0FBQ0o7QUFDSixPQU5ELE1BT0ssSUFBSTdCLHFCQUFKLEVBQVM7QUFDViw0QkFBUSxJQUFSO0FBQ0g7QUFDSjtBQUNKO0FBRUQ7Ozs7O0FBR08sV0FBU3VCLGFBQVQsQ0FBd0JsQixXQUF4QixFQUEwQztBQUM3QyxXQUFRQSxXQUFXLENBQUNZLGNBQVosQ0FBMkIsV0FBM0IsS0FBMkNaLFdBQVcsQ0FBQ2EsU0FBeEQsSUFBc0VYLFdBQVcsQ0FBQ0YsV0FBRCxDQUF4RjtBQUNIO0FBRUQ7Ozs7O0FBR08sV0FBUzRCLGtCQUFULENBQTZCNUIsV0FBN0IsRUFBb0Q7QUFDdkQsV0FBT2tCLGFBQWEsQ0FBQ2xCLFdBQUQsQ0FBYixDQUEyQkEsV0FBM0IsQ0FBdUNtQixTQUE5QztBQUNIOztBQUVNLFdBQVNVLFlBQVQsQ0FBdUJDLElBQXZCLEVBQTZCQyxRQUE3QixFQUF1Q1AsR0FBdkMsRUFBNENRLEtBQTVDLEVBQW1EO0FBQ3RELFFBQU1DLEtBQUssR0FBR0wsa0JBQWtCLENBQUNFLElBQUQsQ0FBaEM7QUFDQUcsSUFBQUEsS0FBSyxDQUFDRixRQUFRLEdBQUcxQyxTQUFYLEdBQXVCbUMsR0FBeEIsQ0FBTCxHQUFvQ1EsS0FBcEM7QUFDSDs7TUFFWUUsYTtBQUtULDJCQUFhcEMsSUFBYixFQUEyQnFDLFlBQTNCLEVBQTRDO0FBQUE7O0FBQUEsV0FKckNyQyxJQUlxQztBQUFBO0FBQ3hDLFdBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNBLHdCQUFlcUMsWUFBZjtBQUNIOzs7O2lDQUVrQjtBQUNmLGVBQU8sS0FBS3JDLElBQVo7QUFDSDs7Ozs7QUFHTDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZU8sTUFBTXNDLFNBQVMsR0FBRyxJQUFJRixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLENBQWxCOztBQUNQNUIsMEJBQVMrQixPQUFULEdBQW1CRCxTQUFuQjtBQUNBOUIsMEJBQVM4QixTQUFULEdBQXFCQSxTQUFyQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZU8sTUFBTUUsT0FBTyxHQUFHLElBQUlKLGFBQUosQ0FBa0IsT0FBbEIsRUFBMkIsR0FBM0IsQ0FBaEI7O0FBQ1A1QiwwQkFBU2lDLEtBQVQsR0FBaUJELE9BQWpCO0FBQ0FoQywwQkFBU2dDLE9BQVQsR0FBbUJBLE9BQW5COztBQUVBLE1BQUlFLHdCQUFKLEVBQVk7QUFDUixpQkFBSWxDLHVCQUFKLEVBQWMsUUFBZCxFQUF3QixZQUFZO0FBQ2hDLHlCQUFPLElBQVA7QUFDQSxhQUFPZ0MsT0FBUDtBQUNILEtBSEQ7QUFJSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztBQWVPLE1BQU1HLFNBQVMsR0FBRyxJQUFJUCxhQUFKLENBQWtCLFNBQWxCLEVBQTZCLEtBQTdCLENBQWxCOztBQUNQNUIsMEJBQVNvQyxPQUFULEdBQW1CRCxTQUFuQjtBQUNBbkMsMEJBQVNtQyxTQUFULEdBQXFCQSxTQUFyQjtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZU8sTUFBTUUsUUFBUSxHQUFHLElBQUlULGFBQUosQ0FBa0IsUUFBbEIsRUFBNEIsRUFBNUIsQ0FBakI7O0FBQ1A1QiwwQkFBU3NDLE1BQVQsR0FBa0JELFFBQWxCO0FBQ0FyQywwQkFBU3FDLFFBQVQsR0FBb0JBLFFBQXBCO0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQk8sV0FBU0UsY0FBVCxDQUF5QkMsSUFBekIsRUFBdUNDLGFBQXZDLEVBQThEO0FBQ2pFLFdBQU8sVUFBVS9DLFdBQVYsRUFBaUNnRCxnQkFBakMsRUFBMkQ7QUFDOUQsVUFBTUMsUUFBUSxHQUFHLE1BQU0sc0JBQWFqRCxXQUFiLENBQU4sR0FBa0MsR0FBbEMsR0FBd0NnRCxnQkFBeEMsR0FBMkQsR0FBNUU7QUFDQSxVQUFNRSxhQUFhLEdBQUdwQyxJQUFJLENBQUNkLFdBQUQsRUFBY2dELGdCQUFkLENBQTFCOztBQUNBLFVBQUksQ0FBQ0UsYUFBYSxDQUFDQyxjQUFuQixFQUFtQztBQUMvQixZQUFJQyxpQkFBaUIsR0FBR0YsYUFBYSxDQUFDSixJQUF0Qzs7QUFDQSxZQUFJTSxpQkFBaUIsS0FBS2hCLFNBQXRCLElBQW1DZ0IsaUJBQWlCLEtBQUtkLE9BQTdELEVBQXNFO0FBQ2xFYyxVQUFBQSxpQkFBaUIsR0FBRyxRQUFwQjtBQUNILFNBRkQsTUFFTyxJQUFJQSxpQkFBaUIsS0FBS1QsUUFBdEIsSUFBa0NTLGlCQUFpQixLQUFLWCxTQUE1RCxFQUF1RTtBQUMxRVcsVUFBQUEsaUJBQWlCLEdBQUdBLGlCQUFpQixDQUFDQyxRQUFsQixFQUFwQjtBQUNIOztBQUNELFlBQUlELGlCQUFpQixLQUFLTixJQUExQixFQUFnQztBQUM1Qiw2QkFBTyxJQUFQLEVBQWFHLFFBQWI7QUFDQTtBQUNIO0FBQ0o7O0FBQ0QsVUFBSSxDQUFDQyxhQUFhLENBQUN0QyxjQUFkLENBQTZCLFNBQTdCLENBQUwsRUFBOEM7QUFDMUM7QUFDSDs7QUFDRCxVQUFNMEMsVUFBVSxHQUFHSixhQUFhLFdBQWhDOztBQUNBLFVBQUksT0FBT0ksVUFBUCxLQUFzQixXQUExQixFQUF1QztBQUNuQztBQUNIOztBQUNELFVBQU1DLFdBQVcsR0FBR0MsS0FBSyxDQUFDQyxPQUFOLENBQWNILFVBQWQsS0FBNkIsK0JBQW9CQSxVQUFwQixDQUFqRDs7QUFDQSxVQUFJQyxXQUFKLEVBQWlCO0FBQ2I7QUFDSDs7QUFDRCxVQUFNRyxXQUFXLFdBQVVKLFVBQVYsQ0FBakI7O0FBQ0EsVUFBTUssY0FBYyxHQUFHYixJQUFJLENBQUNjLFdBQUwsRUFBdkI7O0FBQ0EsVUFBSUYsV0FBVyxLQUFLQyxjQUFwQixFQUFvQztBQUNoQyxZQUFJLENBQUNULGFBQWEsQ0FBQ0MsY0FBbkIsRUFBbUM7QUFDL0IsY0FBSVEsY0FBYyxLQUFLLFFBQXZCLEVBQWlDO0FBQzdCLGdCQUFJTCxVQUFVLElBQUksRUFBRUEsVUFBVSxZQUFZSixhQUFhLENBQUNwQixJQUF0QyxDQUFsQixFQUErRDtBQUMzRCxpQ0FBTyxJQUFQLEVBQWFtQixRQUFiLEVBQXVCLHNCQUFhQyxhQUFhLENBQUNwQixJQUEzQixDQUF2QjtBQUNILGFBRkQsTUFFTztBQUNIO0FBQ0g7QUFDSixXQU5ELE1BTU8sSUFBSWdCLElBQUksS0FBSyxRQUFiLEVBQXVCO0FBQzFCLCtCQUFPLElBQVAsRUFBYUMsYUFBYixFQUE0QkUsUUFBNUIsRUFBc0NILElBQXRDO0FBQ0g7QUFDSjtBQUNKLE9BWkQsTUFZTyxJQUFJWSxXQUFXLEtBQUssVUFBcEIsRUFBZ0M7QUFDbkMsWUFBSVosSUFBSSxLQUFLSCxRQUFRLFdBQWpCLElBQTZCVyxVQUFVLElBQUksSUFBL0MsRUFBcUQ7QUFDakQsY0FBSSxDQUFDLHdCQUFlSixhQUFhLENBQUNwQixJQUE3QixFQUFtQ3hCLHdCQUFTdUQsUUFBNUMsQ0FBTCxFQUE0RDtBQUN4RCwrQkFBTyxJQUFQLEVBQWFaLFFBQWI7QUFDSDtBQUNKLFNBSkQsTUFJTztBQUNILDZCQUFPLElBQVAsRUFBYUYsYUFBYixFQUE0QkUsUUFBNUIsRUFBc0NTLFdBQXRDO0FBQ0g7QUFDSixPQVJNLE1BU0Y7QUFDRDtBQUNIOztBQUNELGFBQU9SLGFBQWEsQ0FBQ0osSUFBckI7QUFDSCxLQXJERDtBQXNESDs7QUFFTSxXQUFTZ0IsaUJBQVQsQ0FBNEJDLFFBQTVCLEVBQXNDO0FBQ3pDLFdBQU8sVUFBVUMsU0FBVixFQUFxQkMsWUFBckIsRUFBbUM7QUFDdENwQixNQUFBQSxjQUFjLENBQUMsUUFBRCxFQUFXLE1BQVgsQ0FBZCxDQUFpQ21CLFNBQWpDLEVBQTRDQyxZQUE1QyxFQURzQyxDQUV0Qzs7QUFDQSxVQUFNQyxVQUFVLEdBQUdoRCxhQUFhLENBQUM4QyxTQUFELENBQWIsQ0FBeUJDLFlBQVksR0FBRzVFLFNBQWYsR0FBMkIsU0FBcEQsQ0FBbkI7O0FBQ0EsVUFBTWlFLFVBQVUsR0FBR2hELHdCQUFTQyxLQUFULENBQWU0RCxVQUFmLENBQTBCRCxVQUExQixDQUFuQjs7QUFDQSxVQUFJLENBQUNWLEtBQUssQ0FBQ0MsT0FBTixDQUFjSCxVQUFkLENBQUQsSUFBOEIsd0JBQWVTLFFBQWYsRUFBeUJ6RCx3QkFBUzhELFNBQWxDLENBQWxDLEVBQWdGO0FBQzVFLFlBQU1DLFFBQVEsR0FBRyxzQkFBYU4sUUFBYixDQUFqQjtBQUNBLFlBQU1PLElBQUksR0FBRyxtQkFBVSxvRkFBVixFQUNiLHNCQUFhTixTQUFiLENBRGEsRUFDWUMsWUFEWixFQUMwQkksUUFEMUIsQ0FBYjs7QUFFQSxZQUFJSCxVQUFKLEVBQWdCO0FBQ1osMEJBQUlJLElBQUo7QUFDSCxTQUZELE1BR0s7QUFDRCw2QkFBTyxJQUFQLEVBQWFBLElBQWIsRUFBbUJELFFBQW5CLEVBQTZCLHNCQUFhTCxTQUFiLENBQTdCLEVBQXNEQyxZQUF0RCxFQUFvRUksUUFBcEU7QUFDSDtBQUNKO0FBQ0osS0FoQkQ7QUFpQkgiLCJzb3VyY2VzQ29udGVudCI6WyLvu78vKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvbmx5LWFycm93LWZ1bmN0aW9uc1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvbmUtdmFyaWFibGUtcGVyLWRlY2xhcmF0aW9uXHJcblxyXG5pbXBvcnQgeyBlcnJvcklELCBsb2csIHdhcm5JRCB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgZXh0ZW5kLCBmb3JtYXRTdHIsIGdldCwgZ2V0Q2xhc3NOYW1lLCBpc0NoaWxkQ2xhc3NPZiwgdmFsdWUgfSBmcm9tICcuLi8uLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IGlzUGxhaW5FbXB0eU9ial9ERVYgfSBmcm9tICcuLi8uLi91dGlscy9taXNjJztcclxuaW1wb3J0IHsgRURJVE9SLCBERVYsIFNVUFBPUlRfSklUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5leHBvcnQgY29uc3QgREVMSU1FVEVSID0gJyRfJCc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXR0cnNTaW5nbGUgKG93bmVyOiBPYmplY3QsIG93bmVyQ29uc3RydWN0b3I6IEZ1bmN0aW9uLCBzdXBlckF0dHJzPzogYW55KSB7XHJcbiAgICBsZXQgQXR0cnNDdG9yO1xyXG4gICAgaWYgKERFViAmJiBTVVBQT1JUX0pJVCkge1xyXG4gICAgICAgIGxldCBjdG9yTmFtZSA9IG93bmVyQ29uc3RydWN0b3IubmFtZTtcclxuICAgICAgICBpZiAob3duZXIgPT09IG93bmVyQ29uc3RydWN0b3IpIHtcclxuICAgICAgICAgICAgY3Rvck5hbWUgKz0gJ19BVFRSUyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjdG9yTmFtZSArPSAnX0FUVFJTX0lOU1RBTkNFJztcclxuICAgICAgICB9XHJcbiAgICAgICAgQXR0cnNDdG9yID0gRnVuY3Rpb24oJ3JldHVybiAoZnVuY3Rpb24gJyArIGN0b3JOYW1lICsgJygpe30pOycpKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBBdHRyc0N0b3IgPSBmdW5jdGlvbiAoKSB7IH07XHJcbiAgICB9XHJcbiAgICBpZiAoc3VwZXJBdHRycykge1xyXG4gICAgICAgIGV4dGVuZChBdHRyc0N0b3IsIHN1cGVyQXR0cnMuY29uc3RydWN0b3IpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgYXR0cnMgPSBuZXcgQXR0cnNDdG9yKCk7XHJcbiAgICB2YWx1ZShvd25lciwgJ19fYXR0cnNfXycsIGF0dHJzKTtcclxuICAgIHJldHVybiBhdHRycztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSBzdWJjbGFzcyBTaG91bGQgbm90IGhhdmUgJ19fYXR0cnNfXycuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXR0cnMgKHN1YmNsYXNzOiBhbnkpIHtcclxuICAgIGxldCBzdXBlckNsYXNzOiBhbnk7XHJcbiAgICBjb25zdCBjaGFpbnM6IGFueVtdID0gbGVnYWN5Q0MuQ2xhc3MuZ2V0SW5oZXJpdGFuY2VDaGFpbihzdWJjbGFzcyk7XHJcbiAgICBmb3IgKGxldCBpID0gY2hhaW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgY29uc3QgY2xzID0gY2hhaW5zW2ldO1xyXG4gICAgICAgIGNvbnN0IGF0dHJzID0gY2xzLmhhc093blByb3BlcnR5KCdfX2F0dHJzX18nKSAmJiBjbHMuX19hdHRyc19fO1xyXG4gICAgICAgIGlmICghYXR0cnMpIHtcclxuICAgICAgICAgICAgc3VwZXJDbGFzcyA9IGNoYWluc1tpICsgMV07XHJcbiAgICAgICAgICAgIGNyZWF0ZUF0dHJzU2luZ2xlKGNscywgY2xzLCBzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MuX19hdHRyc19fKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzdXBlckNsYXNzID0gY2hhaW5zWzBdO1xyXG4gICAgY3JlYXRlQXR0cnNTaW5nbGUoc3ViY2xhc3MsIHN1YmNsYXNzLCBzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MuX19hdHRyc19fKTtcclxuICAgIHJldHVybiBzdWJjbGFzcy5fX2F0dHJzX187XHJcbn1cclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBAY2xhc3MgQ2xhc3NcclxuLy8gICovXHJcbi8qKlxyXG4gKiBUYWcgdGhlIGNsYXNzIHdpdGggYW55IG1ldGEgYXR0cmlidXRlcywgdGhlbiByZXR1cm4gYWxsIGN1cnJlbnQgYXR0cmlidXRlcyBhc3NpZ25lZCB0byBpdC5cclxuICogVGhpcyBmdW5jdGlvbiBob2xkcyBvbmx5IHRoZSBhdHRyaWJ1dGVzLCBub3QgdGhlaXIgaW1wbGVtZW50YXRpb25zLlxyXG4gKiBAcGFyYW0gY29uc3RydWN0b3IgVGhlIGNsYXNzIG9yIGluc3RhbmNlLiBJZiBpbnN0YW5jZSwgdGhlIGF0dHJpYnV0ZSB3aWxsIGJlIGR5bmFtaWMgYW5kIG9ubHkgYXZhaWxhYmxlIGZvciB0aGUgc3BlY2lmaWVkIGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lIFRoZSBuYW1lIG9mIHByb3BlcnR5IG9yIGZ1bmN0aW9uLCB1c2VkIHRvIHJldHJpZXZlIHRoZSBhdHRyaWJ1dGVzLlxyXG4gKiBAcGFyYW0gW25ld0F0dHJpYnV0ZXNdIFRoZSBhdHRyaWJ1dGUgdGFibGUgdG8gbWFyaywgbmV3IGF0dHJpYnV0ZXMgd2lsbCBtZXJnZWQgd2l0aCBleGlzdGVkIGF0dHJpYnV0ZXMuXHJcbiAqIEF0dHJpYnV0ZSB3aG9zZSBrZXkgc3RhcnRzIHdpdGggJ18nIHdpbGwgYmUgaWdub3JlZC5cclxuICogQHByaXZhdGVcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhdHRyIChjb25zdHJ1Y3RvcjogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHsgW3Byb3BlcnR5TmFtZTogc3RyaW5nXTogYW55OyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF0dHIgKGNvbnN0cnVjdG9yOiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nLCBuZXdBdHRyaWJ1dGVzOiBPYmplY3QpOiB2b2lkO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGF0dHIgKGNvbnN0cnVjdG9yOiBhbnksIHByb3BlcnR5TmFtZTogc3RyaW5nLCBuZXdBdHRyaWJ1dGVzPzogT2JqZWN0KSB7XHJcbiAgICBsZXQgYXR0cnM6IGFueSwgc2V0dGVyOiBhbnk7XHJcbiAgICBpZiAodHlwZW9mIGNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLy8gQXR0cmlidXRlcyBzaGFyZWQgYmV0d2VlbiBpbnN0YW5jZXMuXHJcbiAgICAgICAgYXR0cnMgPSBnZXRDbGFzc0F0dHJzKGNvbnN0cnVjdG9yKTtcclxuICAgICAgICBzZXR0ZXIgPSBhdHRycy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEF0dHJpYnV0ZXMgaW4gaW5zdGFuY2UuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb25zdHJ1Y3RvcjtcclxuICAgICAgICBhdHRycyA9IGluc3RhbmNlLl9fYXR0cnNfXztcclxuICAgICAgICBpZiAoIWF0dHJzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yID0gaW5zdGFuY2UuY29uc3RydWN0b3I7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsc0F0dHJzID0gZ2V0Q2xhc3NBdHRycyhjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgICAgIGF0dHJzID0gY3JlYXRlQXR0cnNTaW5nbGUoaW5zdGFuY2UsIGNvbnN0cnVjdG9yLCBjbHNBdHRycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldHRlciA9IGF0dHJzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgbmV3QXR0cmlidXRlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyBHZXQuXHJcbiAgICAgICAgY29uc3QgcHJlZml4ID0gcHJvcGVydHlOYW1lICsgREVMSU1FVEVSO1xyXG4gICAgICAgIGNvbnN0IHJldCA9IHt9O1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChwcmVmaXgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXRba2V5LnNsaWNlKHByZWZpeC5sZW5ndGgpXSA9IGF0dHJzW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gU2V0LlxyXG4gICAgICAgIGlmICh0eXBlb2YgbmV3QXR0cmlidXRlcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbmV3QXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5jaGFyQ29kZUF0KDApICE9PSA5NSAvKiBfICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0dGVyW3Byb3BlcnR5TmFtZSArIERFTElNRVRFUiArIGtleV0gPSBuZXdBdHRyaWJ1dGVzW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoREVWKSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMzYyOSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIHJlYWRvbmx5IG1ldGEgb2JqZWN0LlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzQXR0cnMgKGNvbnN0cnVjdG9yOiBhbnkpIHtcclxuICAgIHJldHVybiAoY29uc3RydWN0b3IuaGFzT3duUHJvcGVydHkoJ19fYXR0cnNfXycpICYmIGNvbnN0cnVjdG9yLl9fYXR0cnNfXykgfHwgY3JlYXRlQXR0cnMoY29uc3RydWN0b3IpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIHdyaXRhYmxlIG1ldGEgb2JqZWN0LCB1c2VkIHRvIHNldCBtdWx0aSBhdHRyaWJ1dGVzLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzQXR0cnNQcm90byAoY29uc3RydWN0b3I6IEZ1bmN0aW9uKSB7XHJcbiAgICByZXR1cm4gZ2V0Q2xhc3NBdHRycyhjb25zdHJ1Y3RvcikuY29uc3RydWN0b3IucHJvdG90eXBlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2xhc3NBdHRyIChjdG9yLCBwcm9wTmFtZSwga2V5LCB2YWx1ZSkge1xyXG4gICAgY29uc3QgcHJvdG8gPSBnZXRDbGFzc0F0dHJzUHJvdG8oY3Rvcik7XHJcbiAgICBwcm90b1twcm9wTmFtZSArIERFTElNRVRFUiArIGtleV0gPSB2YWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFByaW1pdGl2ZVR5cGU8VD4ge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgZGVmYXVsdDogVDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAobmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IFQpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdCA9IGRlZmF1bHRWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmjIflrprnvJbovpHlmajku6XmlbTmlbDlvaLlvI/lr7nlvoXor6XlsZ7mgKfmiJbmlbDnu4TlhYPntKDjgIJcclxuICog5L6L5aaC77yaXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IENDSW50ZWdlciwgX2RlY29yYXRvciB9IGZyb20gXCJDb2NvczNEXCI7XHJcbiAqXHJcbiAqIC8vIOWcqCBjYyDnsbvlrprkuYnkuK06XHJcbiAqXHJcbiAqIFxcQF9kZWNvcmF0b3IucHJvcGVydHkoe3R5cGU6IENDSW50ZWdlcn0pXHJcbiAqIGNvdW50ID0gMDtcclxuICpcclxuICogXFxAX2RlY29yYXRvci5wcm9wZXJ0eSh7dHlwZTogW0NDSW50ZWdlcl19KVxyXG4gKiBhcnJheSA9IFtdO1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjb25zdCBDQ0ludGVnZXIgPSBuZXcgUHJpbWl0aXZlVHlwZSgnSW50ZWdlcicsIDApO1xyXG5sZWdhY3lDQy5JbnRlZ2VyID0gQ0NJbnRlZ2VyO1xyXG5sZWdhY3lDQy5DQ0ludGVnZXIgPSBDQ0ludGVnZXI7XHJcblxyXG4vKipcclxuICog5oyH5a6a57yW6L6R5Zmo5Lul5rWu54K55pWw5b2i5byP5a+55b6F6K+l5bGe5oCn5oiW5pWw57uE5YWD57Sg44CCXHJcbiAqIOS+i+Wmgu+8mlxyXG4gKiBgYGB0c1xyXG4gKiBpbXBvcnQgeyBDQ0Zsb2F0LCBfZGVjb3JhdG9yIH0gZnJvbSBcIkNvY29zM0RcIjtcclxuICpcclxuICogLy8g5ZyoIGNjIOexu+WumuS5ieS4rTpcclxuICpcclxuICogXFxAX2RlY29yYXRvci5wcm9wZXJ0eSh7dHlwZTogQ0NGbG9hdH0pXHJcbiAqIHggPSAwO1xyXG4gKlxyXG4gKiBcXEBfZGVjb3JhdG9yLnByb3BlcnR5KHt0eXBlOiBbQ0NGbG9hdF19KVxyXG4gKiBhcnJheSA9IFtdO1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjb25zdCBDQ0Zsb2F0ID0gbmV3IFByaW1pdGl2ZVR5cGUoJ0Zsb2F0JywgMC4wKTtcclxubGVnYWN5Q0MuRmxvYXQgPSBDQ0Zsb2F0O1xyXG5sZWdhY3lDQy5DQ0Zsb2F0ID0gQ0NGbG9hdDtcclxuXHJcbmlmIChFRElUT1IpIHtcclxuICAgIGdldChsZWdhY3lDQywgJ051bWJlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3YXJuSUQoMzYwMyk7XHJcbiAgICAgICAgcmV0dXJuIENDRmxvYXQ7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIOaMh+Wumue8lui+keWZqOS7peW4g+WwlOWAvOW9ouW8j+WvueW+heivpeWxnuaAp+aIluaVsOe7hOWFg+e0oOOAglxyXG4gKiDkvovlpoLvvJpcclxuICogYGBgdHNcclxuICogaW1wb3J0IHsgQ0NCb29sZWFuLCBfZGVjb3JhdG9yIH0gZnJvbSBcIkNvY29zM0RcIjtcclxuICpcclxuICogLy8g5ZyoIGNjIOexu+WumuS5ieS4rTpcclxuICpcclxuICogXFxAX2RlY29yYXRvci5wcm9wZXJ0eSh7dHlwZTogQ0NCb29sZWFufSlcclxuICogaXNUcnVlID0gZmFsc2U7XHJcbiAqXHJcbiAqIFxcQF9kZWNvcmF0b3IucHJvcGVydHkoe3R5cGU6IFtDQ0Jvb2xlYW5dfSlcclxuICogYXJyYXkgPSBbXTtcclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQ0NCb29sZWFuID0gbmV3IFByaW1pdGl2ZVR5cGUoJ0Jvb2xlYW4nLCBmYWxzZSk7XHJcbmxlZ2FjeUNDLkJvb2xlYW4gPSBDQ0Jvb2xlYW47XHJcbmxlZ2FjeUNDLkNDQm9vbGVhbiA9IENDQm9vbGVhbjtcclxuXHJcbi8qKlxyXG4gKiDmjIflrprnvJbovpHlmajku6XlrZfnrKbkuLLlvaLlvI/lr7nlvoXor6XlsZ7mgKfmiJbmlbDnu4TlhYPntKDjgIJcclxuICog5L6L5aaC77yaXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IENDU3RyaW5nLCBfZGVjb3JhdG9yIH0gZnJvbSBcIkNvY29zM0RcIjtcclxuICpcclxuICogLy8g5ZyoIGNjIOexu+WumuS5ieS4rTpcclxuICpcclxuICogXFxAX2RlY29yYXRvci5wcm9wZXJ0eSh7dHlwZTogQ0NTdHJpbmd9KVxyXG4gKiBuYW1lID0gJyc7XHJcbiAqXHJcbiAqIFxcQF9kZWNvcmF0b3IucHJvcGVydHkoe3R5cGU6IFtDQ1N0cmluZ119KVxyXG4gKiBhcnJheSA9IFtdO1xyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjb25zdCBDQ1N0cmluZyA9IG5ldyBQcmltaXRpdmVUeXBlKCdTdHJpbmcnLCAnJyk7XHJcbmxlZ2FjeUNDLlN0cmluZyA9IENDU3RyaW5nO1xyXG5sZWdhY3lDQy5DQ1N0cmluZyA9IENDU3RyaW5nO1xyXG5cclxuLypcclxuQnVpbHRpbkF0dHJpYnV0ZXM6IHtcclxuICAgIGRlZmF1bHQ6IGRlZmF1bHRWYWx1ZSxcclxuICAgIF9jYW5Vc2VkSW5TZXR0ZXI6IGZhbHNlLCAoZGVmYXVsdCBmYWxzZSkgKE5ZSSlcclxufVxyXG5HZXR0ZXIgb3IgU2V0dGVyOiB7XHJcbiAgICBoYXNHZXR0ZXI6IHRydWUsXHJcbiAgICBoYXNTZXR0ZXI6IHRydWUsXHJcbn1cclxuQ2FsbGJhY2tzOiB7XHJcbiAgICBfb25BZnRlclByb3A6IGZ1bmN0aW9uIChjb25zdHJ1Y3RvciwgcHJvcE5hbWUpIHt9LFxyXG4gICAgX29uQWZ0ZXJHZXR0ZXI6IGZ1bmN0aW9uIChjb25zdHJ1Y3RvciwgcHJvcE5hbWUpIHt9LCAoTllJKVxyXG4gICAgX29uQWZ0ZXJTZXR0ZXI6IGZ1bmN0aW9uIChjb25zdHJ1Y3RvciwgcHJvcE5hbWUpIHt9LCAoTllJKVxyXG59XHJcbiAqL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVDaGVja2VyICh0eXBlOiBzdHJpbmcsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjb25zdHJ1Y3RvcjogRnVuY3Rpb24sIG1haW5Qcm9wZXJ0eU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHByb3BJbmZvID0gJ1wiJyArIGdldENsYXNzTmFtZShjb25zdHJ1Y3RvcikgKyAnLicgKyBtYWluUHJvcGVydHlOYW1lICsgJ1wiJztcclxuICAgICAgICBjb25zdCBtYWluUHJvcEF0dHJzID0gYXR0cihjb25zdHJ1Y3RvciwgbWFpblByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKCFtYWluUHJvcEF0dHJzLnNhdmVVcmxBc0Fzc2V0KSB7XHJcbiAgICAgICAgICAgIGxldCBtYWluUHJvcEF0dHJzVHlwZSA9IG1haW5Qcm9wQXR0cnMudHlwZTtcclxuICAgICAgICAgICAgaWYgKG1haW5Qcm9wQXR0cnNUeXBlID09PSBDQ0ludGVnZXIgfHwgbWFpblByb3BBdHRyc1R5cGUgPT09IENDRmxvYXQpIHtcclxuICAgICAgICAgICAgICAgIG1haW5Qcm9wQXR0cnNUeXBlID0gJ051bWJlcic7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWFpblByb3BBdHRyc1R5cGUgPT09IENDU3RyaW5nIHx8IG1haW5Qcm9wQXR0cnNUeXBlID09PSBDQ0Jvb2xlYW4pIHtcclxuICAgICAgICAgICAgICAgIG1haW5Qcm9wQXR0cnNUeXBlID0gbWFpblByb3BBdHRyc1R5cGUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWFpblByb3BBdHRyc1R5cGUgIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCgzNjA0LCBwcm9wSW5mbyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFtYWluUHJvcEF0dHJzLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkZWZhdWx0VmFsID0gbWFpblByb3BBdHRycy5kZWZhdWx0O1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFZhbCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpc0NvbnRhaW5lciA9IEFycmF5LmlzQXJyYXkoZGVmYXVsdFZhbCkgfHwgaXNQbGFpbkVtcHR5T2JqX0RFVihkZWZhdWx0VmFsKTtcclxuICAgICAgICBpZiAoaXNDb250YWluZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkZWZhdWx0VHlwZSA9IHR5cGVvZiBkZWZhdWx0VmFsO1xyXG4gICAgICAgIGNvbnN0IHR5cGVfbG93ZXJDYXNlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChkZWZhdWx0VHlwZSA9PT0gdHlwZV9sb3dlckNhc2UpIHtcclxuICAgICAgICAgICAgaWYgKCFtYWluUHJvcEF0dHJzLnNhdmVVcmxBc0Fzc2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZV9sb3dlckNhc2UgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWwgJiYgIShkZWZhdWx0VmFsIGluc3RhbmNlb2YgbWFpblByb3BBdHRycy5jdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuSUQoMzYwNSwgcHJvcEluZm8sIGdldENsYXNzTmFtZShtYWluUHJvcEF0dHJzLmN0b3IpKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlICE9PSAnTnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhcm5JRCgzNjA2LCBhdHRyaWJ1dGVOYW1lLCBwcm9wSW5mbywgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGRlZmF1bHRUeXBlICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlID09PSBDQ1N0cmluZy5kZWZhdWx0ICYmIGRlZmF1bHRWYWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0NoaWxkQ2xhc3NPZihtYWluUHJvcEF0dHJzLmN0b3IsIGxlZ2FjeUNDLlJhd0Fzc2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhcm5JRCgzNjA3LCBwcm9wSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoMzYxMSwgYXR0cmlidXRlTmFtZSwgcHJvcEluZm8sIGRlZmF1bHRUeXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgbWFpblByb3BBdHRycy50eXBlO1xyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE9ialR5cGVDaGVja2VyICh0eXBlQ3Rvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjbGFzc0N0b3IsIG1haW5Qcm9wTmFtZSkge1xyXG4gICAgICAgIGdldFR5cGVDaGVja2VyKCdPYmplY3QnLCAndHlwZScpKGNsYXNzQ3RvciwgbWFpblByb3BOYW1lKTtcclxuICAgICAgICAvLyBjaGVjayBWYWx1ZVR5cGVcclxuICAgICAgICBjb25zdCBkZWZhdWx0RGVmID0gZ2V0Q2xhc3NBdHRycyhjbGFzc0N0b3IpW21haW5Qcm9wTmFtZSArIERFTElNRVRFUiArICdkZWZhdWx0J107XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdFZhbCA9IGxlZ2FjeUNDLkNsYXNzLmdldERlZmF1bHQoZGVmYXVsdERlZik7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGRlZmF1bHRWYWwpICYmIGlzQ2hpbGRDbGFzc09mKHR5cGVDdG9yLCBsZWdhY3lDQy5WYWx1ZVR5cGUpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVuYW1lID0gZ2V0Q2xhc3NOYW1lKHR5cGVDdG9yKTtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IGZvcm1hdFN0cignTm8gbmVlZCB0byBzcGVjaWZ5IHRoZSBcInR5cGVcIiBvZiBcIiVzLiVzXCIgYmVjYXVzZSAlcyBpcyBhIGNoaWxkIGNsYXNzIG9mIFZhbHVlVHlwZS4nLFxyXG4gICAgICAgICAgICBnZXRDbGFzc05hbWUoY2xhc3NDdG9yKSwgbWFpblByb3BOYW1lLCB0eXBlbmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChkZWZhdWx0RGVmKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coaW5mbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoMzYxMiwgaW5mbywgdHlwZW5hbWUsIGdldENsYXNzTmFtZShjbGFzc0N0b3IpLCBtYWluUHJvcE5hbWUsIHR5cGVuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuIl19