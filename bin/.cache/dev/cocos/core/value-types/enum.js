(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js", "../data/utils/asserts.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"), require("../data/utils/asserts.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.defaultConstants, global.globalExports, global.debug, global.asserts);
    global._enum = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _js, _defaultConstants, _globalExports, _debug, _asserts) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Enum = Enum;
  _exports.ccenum = ccenum;

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
   * @category core/value-types
   */

  /**
   * @en
   * Define an enum type. <br/>
   * If a enum item has a value of -1, it will be given an Integer number according to it's order in the list.<br/>
   * Otherwise it will use the value specified by user who writes the enum definition.
   *
   * @zh
   * 定义一个枚举类型。<br/>
   * 用户可以把枚举值设为任意的整数，如果设为 -1，系统将会分配为上一个枚举值 + 1。
   *
   * @param obj - a JavaScript literal object containing enum names and values, or a TypeScript enum type
   * @return the defined enum type
   */
  function Enum(obj) {
    if ('__enums__' in obj) {
      return obj;
    }

    (0, _js.value)(obj, '__enums__', null, true);
    return Enum.update(obj);
  }
  /**
   * @en
   * Update the enum object properties.
   * @zh
   * 更新枚举对象的属性列表。
   * @param obj 
   */


  Enum.update = function (obj) {
    var lastIndex = -1;
    var keys = Object.keys(obj); // tslint:disable-next-line: prefer-for-of

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = obj[key];

      if (val === -1) {
        val = ++lastIndex;
        obj[key] = val;
      } else {
        if (typeof val === 'number') {
          lastIndex = val;
        } else if (typeof val === 'string' && Number.isInteger(parseFloat(key))) {
          continue;
        }
      }

      var reverseKey = '' + val;

      if (key !== reverseKey) {
        if ((_defaultConstants.EDITOR || _defaultConstants.TEST) && reverseKey in obj && obj[reverseKey] !== key) {
          (0, _debug.errorID)(7100, reverseKey);
          continue;
        }

        (0, _js.value)(obj, reverseKey, key);
      }
    } // auto update list if __enums__ is array


    if (Array.isArray(obj['__enums__'])) {
      updateList(obj);
    }

    return obj;
  };

  (function (_Enum) {})(Enum || (_exports.Enum = Enum = {}));

  /**
   * Determines if the object is an enum type.
   * @param enumType The object to judge.
   */
  Enum.isEnum = function (enumType) {
    return enumType && enumType.hasOwnProperty('__enums__');
  };

  function assertIsEnum(enumType) {
    (0, _asserts.assertIsTrue)(enumType.hasOwnProperty('__enums__'));
  }
  /**
   * Get the enumerators from the enum type.
   * @param enumType An enum type.
   */


  Enum.getList = function (enumType) {
    assertIsEnum(enumType);

    if (enumType.__enums__) {
      return enumType.__enums__;
    }

    return updateList(enumType);
  };
  /**
   * Update the enumerators from the enum type.
   * @param enumType - the enum type defined from cc.Enum
   * @return {Object[]}
   */


  function updateList(enumType) {
    assertIsEnum(enumType);
    var enums = enumType.__enums__ || [];
    enums.length = 0; // tslint:disable-next-line: forin

    for (var _name in enumType) {
      var v = enumType[_name];

      if (Number.isInteger(v)) {
        enums.push({
          name: _name,
          value: v
        });
      }
    }

    enums.sort(function (a, b) {
      return a.value - b.value;
    });
    enumType.__enums__ = enums;
    return enums;
  }

  ;

  if (_defaultConstants.DEV) {
    // check key order in object literal
    var _TestEnum = Enum({
      ZERO: -1,
      ONE: -1,
      TWO: -1,
      THREE: -1
    });

    if (_TestEnum.ZERO !== 0 || _TestEnum.ONE !== 1 || _TestEnum.THREE !== 3) {
      (0, _debug.errorID)(7101);
    }
  }
  /**
   * Make the enum type `enumType` as enumeration so that Creator may identify, operate on it.
   * Formally, as a result of invocation on this function with enum type `enumType`:
   * - `Enum.isEnum(enumType)` returns `true`;
   * - `Enum.getList(enumType)` returns the enumerators of `enumType`.
   * @param enumType An enum type, eg, a kind of type with similar semantic defined by TypeScript.
   */


  function ccenum(enumType) {
    if (!('__enums__' in enumType)) {
      (0, _js.value)(enumType, '__enums__', null, true);
    }
  }

  _globalExports.legacyCC.Enum = Enum;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdmFsdWUtdHlwZXMvZW51bS50cyJdLCJuYW1lcyI6WyJFbnVtIiwib2JqIiwidXBkYXRlIiwibGFzdEluZGV4Iiwia2V5cyIsIk9iamVjdCIsImkiLCJsZW5ndGgiLCJrZXkiLCJ2YWwiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJwYXJzZUZsb2F0IiwicmV2ZXJzZUtleSIsIkVESVRPUiIsIlRFU1QiLCJBcnJheSIsImlzQXJyYXkiLCJ1cGRhdGVMaXN0IiwiaXNFbnVtIiwiZW51bVR5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImFzc2VydElzRW51bSIsImdldExpc3QiLCJfX2VudW1zX18iLCJlbnVtcyIsIm5hbWUiLCJ2IiwicHVzaCIsInZhbHVlIiwic29ydCIsImEiLCJiIiwiREVWIiwiX1Rlc3RFbnVtIiwiWkVSTyIsIk9ORSIsIlRXTyIsIlRIUkVFIiwiY2NlbnVtIiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7OztBQVVBOzs7Ozs7Ozs7Ozs7O0FBYU8sV0FBU0EsSUFBVCxDQUFrQkMsR0FBbEIsRUFBNkI7QUFDaEMsUUFBSSxlQUFlQSxHQUFuQixFQUF3QjtBQUNwQixhQUFPQSxHQUFQO0FBQ0g7O0FBQ0QsbUJBQU1BLEdBQU4sRUFBVyxXQUFYLEVBQXdCLElBQXhCLEVBQThCLElBQTlCO0FBQ0EsV0FBT0QsSUFBSSxDQUFDRSxNQUFMLENBQVlELEdBQVosQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztBQU9BRCxFQUFBQSxJQUFJLENBQUNFLE1BQUwsR0FBYyxVQUFLRCxHQUFMLEVBQW1CO0FBQzdCLFFBQUlFLFNBQWlCLEdBQUcsQ0FBQyxDQUF6QjtBQUNBLFFBQU1DLElBQWMsR0FBR0MsTUFBTSxDQUFDRCxJQUFQLENBQVlILEdBQVosQ0FBdkIsQ0FGNkIsQ0FJN0I7O0FBQ0EsU0FB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TixDQUFXLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGFBQVVELENBQUMsQ0FBQ0YsS0FBRixHQUFVRyxDQUFDLENBQUNILEtBQXRCO0FBQUEsS0FBWDtBQUNBVCxJQUFBQSxRQUFRLENBQUNJLFNBQVQsR0FBcUJDLEtBQXJCO0FBQ0EsV0FBT0EsS0FBUDtBQUNIOztBQUFBOztBQUVELE1BQUlRLHFCQUFKLEVBQVM7QUFDTDtBQUNBLFFBQU1DLFNBQVMsR0FBR2xDLElBQUksQ0FBQztBQUNuQm1DLE1BQUFBLElBQUksRUFBRSxDQUFDLENBRFk7QUFFbkJDLE1BQUFBLEdBQUcsRUFBRSxDQUFDLENBRmE7QUFHbkJDLE1BQUFBLEdBQUcsRUFBRSxDQUFDLENBSGE7QUFJbkJDLE1BQUFBLEtBQUssRUFBRSxDQUFDO0FBSlcsS0FBRCxDQUF0Qjs7QUFNQSxRQUFJSixTQUFTLENBQUNDLElBQVYsS0FBbUIsQ0FBbkIsSUFBd0JELFNBQVMsQ0FBQ0UsR0FBVixLQUFrQixDQUExQyxJQUErQ0YsU0FBUyxDQUFDSSxLQUFWLEtBQW9CLENBQXZFLEVBQTBFO0FBQ3RFLDBCQUFRLElBQVI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OztBQU9PLFdBQVNDLE1BQVQsQ0FBbUNuQixRQUFuQyxFQUFvRDtBQUN2RCxRQUFJLEVBQUUsZUFBZUEsUUFBakIsQ0FBSixFQUFnQztBQUM1QixxQkFBTUEsUUFBTixFQUFnQixXQUFoQixFQUE2QixJQUE3QixFQUFtQyxJQUFuQztBQUNIO0FBQ0o7O0FBRURvQiwwQkFBU3hDLElBQVQsR0FBZ0JBLElBQWhCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL3ZhbHVlLXR5cGVzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdmFsdWUgfSBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IEVESVRPUiwgVEVTVCwgREVWIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IGVycm9ySUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IGFzc2VydElzVHJ1ZSB9IGZyb20gJy4uL2RhdGEvdXRpbHMvYXNzZXJ0cyc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIERlZmluZSBhbiBlbnVtIHR5cGUuIDxici8+XHJcbiAqIElmIGEgZW51bSBpdGVtIGhhcyBhIHZhbHVlIG9mIC0xLCBpdCB3aWxsIGJlIGdpdmVuIGFuIEludGVnZXIgbnVtYmVyIGFjY29yZGluZyB0byBpdCdzIG9yZGVyIGluIHRoZSBsaXN0Ljxici8+XHJcbiAqIE90aGVyd2lzZSBpdCB3aWxsIHVzZSB0aGUgdmFsdWUgc3BlY2lmaWVkIGJ5IHVzZXIgd2hvIHdyaXRlcyB0aGUgZW51bSBkZWZpbml0aW9uLlxyXG4gKlxyXG4gKiBAemhcclxuICog5a6a5LmJ5LiA5Liq5p6a5Li+57G75Z6L44CCPGJyLz5cclxuICog55So5oi35Y+v5Lul5oqK5p6a5Li+5YC86K6+5Li65Lu75oSP55qE5pW05pWw77yM5aaC5p6c6K6+5Li6IC0x77yM57O757uf5bCG5Lya5YiG6YWN5Li65LiK5LiA5Liq5p6a5Li+5YC8ICsgMeOAglxyXG4gKlxyXG4gKiBAcGFyYW0gb2JqIC0gYSBKYXZhU2NyaXB0IGxpdGVyYWwgb2JqZWN0IGNvbnRhaW5pbmcgZW51bSBuYW1lcyBhbmQgdmFsdWVzLCBvciBhIFR5cGVTY3JpcHQgZW51bSB0eXBlXHJcbiAqIEByZXR1cm4gdGhlIGRlZmluZWQgZW51bSB0eXBlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gRW51bTxUPiAob2JqOiBUKTogVCB7XHJcbiAgICBpZiAoJ19fZW51bXNfXycgaW4gb2JqKSB7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIHZhbHVlKG9iaiwgJ19fZW51bXNfXycsIG51bGwsIHRydWUpO1xyXG4gICAgcmV0dXJuIEVudW0udXBkYXRlKG9iaik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVXBkYXRlIHRoZSBlbnVtIG9iamVjdCBwcm9wZXJ0aWVzLlxyXG4gKiBAemhcclxuICog5pu05paw5p6a5Li+5a+56LGh55qE5bGe5oCn5YiX6KGo44CCXHJcbiAqIEBwYXJhbSBvYmogXHJcbiAqL1xyXG5FbnVtLnVwZGF0ZSA9IDxUPiAob2JqOiBUKTogVCA9PiB7XHJcbiAgICBsZXQgbGFzdEluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMob2JqKTtcclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgbGV0IHZhbCA9IG9ialtrZXldO1xyXG4gICAgICAgIGlmICh2YWwgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHZhbCA9ICsrbGFzdEluZGV4O1xyXG4gICAgICAgICAgICBvYmpba2V5XSA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIE51bWJlci5pc0ludGVnZXIocGFyc2VGbG9hdChrZXkpKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmV2ZXJzZUtleTogc3RyaW5nID0gJycgKyB2YWw7XHJcbiAgICAgICAgaWYgKGtleSAhPT0gcmV2ZXJzZUtleSkge1xyXG4gICAgICAgICAgICBpZiAoKEVESVRPUiB8fCBURVNUKSAmJiByZXZlcnNlS2V5IGluIG9iaiAmJiBvYmpbcmV2ZXJzZUtleV0gIT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCg3MTAwLCByZXZlcnNlS2V5KTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlKG9iaiwgcmV2ZXJzZUtleSwga2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBhdXRvIHVwZGF0ZSBsaXN0IGlmIF9fZW51bXNfXyBpcyBhcnJheVxyXG4gICAgaWYoQXJyYXkuaXNBcnJheShvYmpbJ19fZW51bXNfXyddKSkge1xyXG4gICAgICAgIHVwZGF0ZUxpc3Qob2JqKTtcclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBFbnVtIHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRW51bWVyYXRvcjxFbnVtVD4ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBlbnVtZXJhdG9yLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5hbWU6IGtleW9mIEVudW1UO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgdmFsdWUgb2YgdGhlIG51bWVyYXRvci5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YWx1ZTogRW51bVRbdHlwZW9mIG5hbWVdO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRW51bUV4dHJhczxFbnVtVD4ge1xyXG4gICAgX19lbnVtc19fOiBudWxsIHwgRW51bS5FbnVtZXJhdG9yPEVudW1UPltdO1xyXG59XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiB0aGUgb2JqZWN0IGlzIGFuIGVudW0gdHlwZS5cclxuICogQHBhcmFtIGVudW1UeXBlIFRoZSBvYmplY3QgdG8ganVkZ2UuXHJcbiAqL1xyXG5FbnVtLmlzRW51bSA9IDxFbnVtVCBleHRlbmRzIHt9PihlbnVtVHlwZTogRW51bVQpID0+IHtcclxuICAgIHJldHVybiBlbnVtVHlwZSAmJiBlbnVtVHlwZS5oYXNPd25Qcm9wZXJ0eSgnX19lbnVtc19fJyk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBhc3NlcnRJc0VudW0gPEVudW1UIGV4dGVuZHMge30+KGVudW1UeXBlOiBFbnVtVCk6IGFzc2VydHMgZW51bVR5cGUgaXMgRW51bVQgJiBFbnVtRXh0cmFzPEVudW1UPiB7XHJcbiAgICBhc3NlcnRJc1RydWUoZW51bVR5cGUuaGFzT3duUHJvcGVydHkoJ19fZW51bXNfXycpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgZW51bWVyYXRvcnMgZnJvbSB0aGUgZW51bSB0eXBlLlxyXG4gKiBAcGFyYW0gZW51bVR5cGUgQW4gZW51bSB0eXBlLlxyXG4gKi9cclxuRW51bS5nZXRMaXN0ID0gPEVudW1UIGV4dGVuZHMge30+KGVudW1UeXBlOiBFbnVtVCk6IHJlYWRvbmx5IEVudW0uRW51bWVyYXRvcjxFbnVtVD5bXSA9PiB7XHJcbiAgICBhc3NlcnRJc0VudW0oZW51bVR5cGUpO1xyXG5cclxuICAgIGlmIChlbnVtVHlwZS5fX2VudW1zX18pIHtcclxuICAgICAgICByZXR1cm4gZW51bVR5cGUuX19lbnVtc19fO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB1cGRhdGVMaXN0KGVudW1UeXBlIGFzIEVudW1UKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgdGhlIGVudW1lcmF0b3JzIGZyb20gdGhlIGVudW0gdHlwZS5cclxuICogQHBhcmFtIGVudW1UeXBlIC0gdGhlIGVudW0gdHlwZSBkZWZpbmVkIGZyb20gY2MuRW51bVxyXG4gKiBAcmV0dXJuIHtPYmplY3RbXX1cclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpc3Q8RW51bVQgZXh0ZW5kcyB7fT4oZW51bVR5cGU6IEVudW1UKTogcmVhZG9ubHkgRW51bS5FbnVtZXJhdG9yPEVudW1UPltdIHtcclxuICAgIGFzc2VydElzRW51bShlbnVtVHlwZSk7XHJcbiAgICBjb25zdCBlbnVtczogYW55W10gPSBlbnVtVHlwZS5fX2VudW1zX18gfHwgW107XHJcbiAgICBlbnVtcy5sZW5ndGggPSAwO1xyXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBmb3JpblxyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIGVudW1UeXBlKSB7XHJcbiAgICAgICAgY29uc3QgdiA9IGVudW1UeXBlW25hbWVdO1xyXG4gICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHYpKSB7XHJcbiAgICAgICAgICAgIGVudW1zLnB1c2goeyBuYW1lLCB2YWx1ZTogdiB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbnVtcy5zb3J0KChhLCBiKSA9PiBhLnZhbHVlIC0gYi52YWx1ZSk7XHJcbiAgICBlbnVtVHlwZS5fX2VudW1zX18gPSBlbnVtcztcclxuICAgIHJldHVybiBlbnVtcztcclxufTtcclxuXHJcbmlmIChERVYpIHtcclxuICAgIC8vIGNoZWNrIGtleSBvcmRlciBpbiBvYmplY3QgbGl0ZXJhbFxyXG4gICAgY29uc3QgX1Rlc3RFbnVtID0gRW51bSh7XHJcbiAgICAgICAgWkVSTzogLTEsXHJcbiAgICAgICAgT05FOiAtMSxcclxuICAgICAgICBUV086IC0xLFxyXG4gICAgICAgIFRIUkVFOiAtMSxcclxuICAgIH0pO1xyXG4gICAgaWYgKF9UZXN0RW51bS5aRVJPICE9PSAwIHx8IF9UZXN0RW51bS5PTkUgIT09IDEgfHwgX1Rlc3RFbnVtLlRIUkVFICE9PSAzKSB7XHJcbiAgICAgICAgZXJyb3JJRCg3MTAxKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ha2UgdGhlIGVudW0gdHlwZSBgZW51bVR5cGVgIGFzIGVudW1lcmF0aW9uIHNvIHRoYXQgQ3JlYXRvciBtYXkgaWRlbnRpZnksIG9wZXJhdGUgb24gaXQuXHJcbiAqIEZvcm1hbGx5LCBhcyBhIHJlc3VsdCBvZiBpbnZvY2F0aW9uIG9uIHRoaXMgZnVuY3Rpb24gd2l0aCBlbnVtIHR5cGUgYGVudW1UeXBlYDpcclxuICogLSBgRW51bS5pc0VudW0oZW51bVR5cGUpYCByZXR1cm5zIGB0cnVlYDtcclxuICogLSBgRW51bS5nZXRMaXN0KGVudW1UeXBlKWAgcmV0dXJucyB0aGUgZW51bWVyYXRvcnMgb2YgYGVudW1UeXBlYC5cclxuICogQHBhcmFtIGVudW1UeXBlIEFuIGVudW0gdHlwZSwgZWcsIGEga2luZCBvZiB0eXBlIHdpdGggc2ltaWxhciBzZW1hbnRpYyBkZWZpbmVkIGJ5IFR5cGVTY3JpcHQuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2NlbnVtPEVudW1UIGV4dGVuZHMge30+IChlbnVtVHlwZTogRW51bVQpIHtcclxuICAgIGlmICghKCdfX2VudW1zX18nIGluIGVudW1UeXBlKSkge1xyXG4gICAgICAgIHZhbHVlKGVudW1UeXBlLCAnX19lbnVtc19fJywgbnVsbCwgdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLkVudW0gPSBFbnVtO1xyXG4iXX0=