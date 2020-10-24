(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./array.js", "./id-generator.js", "./js-typed.js", "./pool.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./array.js"), require("./id-generator.js"), require("./js-typed.js"), require("./pool.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.array, global.idGenerator, global.jsTyped, global.pool, global.defaultConstants, global.globalExports);
    global.js = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, jsarray, _idGenerator, _jsTyped, _pool, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    array: true,
    js: true,
    IDGenerator: true,
    Pool: true
  };
  Object.defineProperty(_exports, "IDGenerator", {
    enumerable: true,
    get: function () {
      return _idGenerator.default;
    }
  });
  Object.defineProperty(_exports, "Pool", {
    enumerable: true,
    get: function () {
      return _pool.default;
    }
  });
  _exports.js = _exports.array = void 0;
  jsarray = _interopRequireWildcard(jsarray);
  _idGenerator = _interopRequireDefault(_idGenerator);
  Object.keys(_jsTyped).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _jsTyped[key];
      }
    });
  });
  _pool = _interopRequireDefault(_pool);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /*
   Copyright (c) 2008-2010 Ricardo Quesada
   Copyright (c) 2011-2012 cocos2d-x.org
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos2d-x.org
  
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
  
   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.
  
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
  */
  var array = jsarray;
  _exports.array = array;
  var js = {
    IDGenerator: _idGenerator.default,
    Pool: _pool.default,
    array: jsarray,
    isNumber: _jsTyped.isNumber,
    isString: _jsTyped.isString,
    getPropertyDescriptor: _jsTyped.getPropertyDescriptor,
    addon: _jsTyped.addon,
    mixin: _jsTyped.mixin,
    extend: _jsTyped.extend,
    getSuper: _jsTyped.getSuper,
    isChildClassOf: _jsTyped.isChildClassOf,
    clear: _jsTyped.clear,
    value: _jsTyped.value,
    getset: _jsTyped.getset,
    get: _jsTyped.get,
    set: _jsTyped.set,
    unregisterClass: _jsTyped.unregisterClass,
    getClassName: _jsTyped.getClassName,
    setClassName: _jsTyped.setClassName,
    setClassAlias: _jsTyped.setClassAlias,
    getClassByName: _jsTyped.getClassByName,
    _getClassId: _jsTyped._getClassId,
    _setClassId: _jsTyped._setClassId,
    _getClassById: _jsTyped._getClassById,
    obsolete: _jsTyped.obsolete,
    obsoletes: _jsTyped.obsoletes,
    formatStr: _jsTyped.formatStr,
    shiftArguments: _jsTyped.shiftArguments,
    createMap: _jsTyped.createMap
  };
  /**
   * This module provides some JavaScript utilities.
   * All members can be accessed with "cc.js".
   */

  _exports.js = js;
  _globalExports.legacyCC.js = js;

  if (_defaultConstants.EDITOR) {
    _globalExports.legacyCC.js.getset(_globalExports.legacyCC.js, '_registeredClassIds', function () {
      var dump = {};

      for (var id in _jsTyped._idToClass) {
        if (!(id in _jsTyped._idToClass)) {
          continue;
        }

        dump[id] = _jsTyped._idToClass[id];
      }

      return dump;
    }, function (item) {
      (0, _jsTyped.clear)(_jsTyped._idToClass);

      for (var id in item) {
        if (!(id in item)) {
          continue;
        }

        _jsTyped._idToClass[id] = item[id];
      }
    });

    _globalExports.legacyCC.js.getset(_globalExports.legacyCC.js, '_registeredClassNames', function () {
      var dump = {};

      for (var id in _jsTyped._nameToClass) {
        if (!(id in _jsTyped._nameToClass)) {
          continue;
        }

        dump[id] = _jsTyped._nameToClass[id];
      }

      return dump;
    }, function (item) {
      (0, _jsTyped.clear)(_jsTyped._nameToClass);

      for (var id in item) {
        if (!(id in item)) {
          continue;
        }

        _jsTyped._nameToClass[id] = item[id];
      }
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvanMudHMiXSwibmFtZXMiOlsiYXJyYXkiLCJqc2FycmF5IiwianMiLCJJREdlbmVyYXRvciIsIlBvb2wiLCJpc051bWJlciIsImlzU3RyaW5nIiwiZ2V0UHJvcGVydHlEZXNjcmlwdG9yIiwiYWRkb24iLCJtaXhpbiIsImV4dGVuZCIsImdldFN1cGVyIiwiaXNDaGlsZENsYXNzT2YiLCJjbGVhciIsInZhbHVlIiwiZ2V0c2V0IiwiZ2V0Iiwic2V0IiwidW5yZWdpc3RlckNsYXNzIiwiZ2V0Q2xhc3NOYW1lIiwic2V0Q2xhc3NOYW1lIiwic2V0Q2xhc3NBbGlhcyIsImdldENsYXNzQnlOYW1lIiwiX2dldENsYXNzSWQiLCJfc2V0Q2xhc3NJZCIsIl9nZXRDbGFzc0J5SWQiLCJvYnNvbGV0ZSIsIm9ic29sZXRlcyIsImZvcm1hdFN0ciIsInNoaWZ0QXJndW1lbnRzIiwiY3JlYXRlTWFwIiwibGVnYWN5Q0MiLCJFRElUT1IiLCJkdW1wIiwiaWQiLCJfaWRUb0NsYXNzIiwiaXRlbSIsIl9uYW1lVG9DbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0VBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7QUFsRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUVPLE1BQU1BLEtBQUssR0FBR0MsT0FBZDs7QUFFQSxNQUFNQyxFQUFFLEdBQUc7QUFDZEMsSUFBQUEsV0FBVyxFQUFYQSxvQkFEYztBQUVkQyxJQUFBQSxJQUFJLEVBQUpBLGFBRmM7QUFHZEosSUFBQUEsS0FBSyxFQUFFQyxPQUhPO0FBSWRJLElBQUFBLFFBQVEsRUFBUkEsaUJBSmM7QUFLZEMsSUFBQUEsUUFBUSxFQUFSQSxpQkFMYztBQU1kQyxJQUFBQSxxQkFBcUIsRUFBckJBLDhCQU5jO0FBT2RDLElBQUFBLEtBQUssRUFBTEEsY0FQYztBQVFkQyxJQUFBQSxLQUFLLEVBQUxBLGNBUmM7QUFTZEMsSUFBQUEsTUFBTSxFQUFOQSxlQVRjO0FBVWRDLElBQUFBLFFBQVEsRUFBUkEsaUJBVmM7QUFXZEMsSUFBQUEsY0FBYyxFQUFkQSx1QkFYYztBQVlkQyxJQUFBQSxLQUFLLEVBQUxBLGNBWmM7QUFhZEMsSUFBQUEsS0FBSyxFQUFMQSxjQWJjO0FBY2RDLElBQUFBLE1BQU0sRUFBTkEsZUFkYztBQWVkQyxJQUFBQSxHQUFHLEVBQUhBLFlBZmM7QUFnQmRDLElBQUFBLEdBQUcsRUFBSEEsWUFoQmM7QUFpQmRDLElBQUFBLGVBQWUsRUFBZkEsd0JBakJjO0FBa0JkQyxJQUFBQSxZQUFZLEVBQVpBLHFCQWxCYztBQW1CZEMsSUFBQUEsWUFBWSxFQUFaQSxxQkFuQmM7QUFvQmRDLElBQUFBLGFBQWEsRUFBYkEsc0JBcEJjO0FBcUJkQyxJQUFBQSxjQUFjLEVBQWRBLHVCQXJCYztBQXNCZEMsSUFBQUEsV0FBVyxFQUFYQSxvQkF0QmM7QUF1QmRDLElBQUFBLFdBQVcsRUFBWEEsb0JBdkJjO0FBd0JkQyxJQUFBQSxhQUFhLEVBQWJBLHNCQXhCYztBQXlCZEMsSUFBQUEsUUFBUSxFQUFSQSxpQkF6QmM7QUEwQmRDLElBQUFBLFNBQVMsRUFBVEEsa0JBMUJjO0FBMkJkQyxJQUFBQSxTQUFTLEVBQVRBLGtCQTNCYztBQTRCZEMsSUFBQUEsY0FBYyxFQUFkQSx1QkE1QmM7QUE2QmRDLElBQUFBLFNBQVMsRUFBVEE7QUE3QmMsR0FBWDtBQWdDUDs7Ozs7O0FBSUFDLDBCQUFTN0IsRUFBVCxHQUFjQSxFQUFkOztBQUVBLE1BQUk4Qix3QkFBSixFQUFZO0FBQ1JELDRCQUFTN0IsRUFBVCxDQUFZYSxNQUFaLENBQW1CZ0Isd0JBQVM3QixFQUE1QixFQUFnQyxxQkFBaEMsRUFBdUQsWUFBTTtBQUNyRCxVQUFNK0IsSUFBSSxHQUFHLEVBQWI7O0FBQ0EsV0FBSyxJQUFNQyxFQUFYLElBQWlCQyxtQkFBakIsRUFBNkI7QUFDekIsWUFBSSxFQUFFRCxFQUFFLElBQUlDLG1CQUFSLENBQUosRUFBeUI7QUFDckI7QUFDSDs7QUFDREYsUUFBQUEsSUFBSSxDQUFDQyxFQUFELENBQUosR0FBV0Msb0JBQVdELEVBQVgsQ0FBWDtBQUNIOztBQUNELGFBQU9ELElBQVA7QUFDSCxLQVRMLEVBVUksVUFBQ0csSUFBRCxFQUFVO0FBQ04sMEJBQU1ELG1CQUFOOztBQUNBLFdBQUssSUFBTUQsRUFBWCxJQUFpQkUsSUFBakIsRUFBdUI7QUFDbkIsWUFBSSxFQUFFRixFQUFFLElBQUlFLElBQVIsQ0FBSixFQUFtQjtBQUNmO0FBQ0g7O0FBQ0RELDRCQUFXRCxFQUFYLElBQWlCRSxJQUFJLENBQUNGLEVBQUQsQ0FBckI7QUFDSDtBQUNKLEtBbEJMOztBQW9CQUgsNEJBQVM3QixFQUFULENBQVlhLE1BQVosQ0FBbUJnQix3QkFBUzdCLEVBQTVCLEVBQWdDLHVCQUFoQyxFQUNJLFlBQU07QUFDRixVQUFNK0IsSUFBSSxHQUFHLEVBQWI7O0FBQ0EsV0FBSyxJQUFNQyxFQUFYLElBQWlCRyxxQkFBakIsRUFBK0I7QUFDM0IsWUFBSSxFQUFFSCxFQUFFLElBQUlHLHFCQUFSLENBQUosRUFBMkI7QUFDdkI7QUFDSDs7QUFDREosUUFBQUEsSUFBSSxDQUFDQyxFQUFELENBQUosR0FBV0csc0JBQWFILEVBQWIsQ0FBWDtBQUNIOztBQUNELGFBQU9ELElBQVA7QUFDSCxLQVZMLEVBV0ksVUFBQ0csSUFBRCxFQUFVO0FBQ04sMEJBQU1DLHFCQUFOOztBQUNBLFdBQUssSUFBTUgsRUFBWCxJQUFpQkUsSUFBakIsRUFBdUI7QUFDbkIsWUFBSSxFQUFFRixFQUFFLElBQUlFLElBQVIsQ0FBSixFQUFtQjtBQUNmO0FBQ0g7O0FBQ0RDLDhCQUFhSCxFQUFiLElBQW1CRSxJQUFJLENBQUNGLEVBQUQsQ0FBdkI7QUFDSDtBQUNKLEtBbkJMO0FBcUJIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbmltcG9ydCAqIGFzIGpzYXJyYXkgZnJvbSAnLi9hcnJheSc7XHJcbmltcG9ydCBJREdlbmVyYXRvciBmcm9tICcuL2lkLWdlbmVyYXRvcic7XHJcbmltcG9ydCB7XHJcbiAgICBfZ2V0Q2xhc3NCeUlkLFxyXG4gICAgX2dldENsYXNzSWQsXHJcbiAgICBfc2V0Q2xhc3NJZCxcclxuICAgIGFkZG9uLFxyXG4gICAgY2xlYXIsXHJcbiAgICBjcmVhdGVNYXAsXHJcbiAgICBleHRlbmQsXHJcbiAgICBmb3JtYXRTdHIsXHJcbiAgICBnZXQsXHJcbiAgICBnZXRDbGFzc0J5TmFtZSxcclxuICAgIGdldENsYXNzTmFtZSxcclxuICAgIGdldFByb3BlcnR5RGVzY3JpcHRvcixcclxuICAgIGdldHNldCxcclxuICAgIGdldFN1cGVyLFxyXG4gICAgaXNDaGlsZENsYXNzT2YsXHJcbiAgICBpc051bWJlcixcclxuICAgIGlzU3RyaW5nLFxyXG4gICAgbWl4aW4sXHJcbiAgICBvYnNvbGV0ZSxcclxuICAgIG9ic29sZXRlcyxcclxuICAgIHNldCxcclxuICAgIHNldENsYXNzTmFtZSxcclxuICAgIHNldENsYXNzQWxpYXMsXHJcbiAgICBzaGlmdEFyZ3VtZW50cyxcclxuICAgIHVucmVnaXN0ZXJDbGFzcyxcclxuICAgIHZhbHVlLFxyXG59IGZyb20gJy4vanMtdHlwZWQnO1xyXG5pbXBvcnQgUG9vbCBmcm9tICcuL3Bvb2wnO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIF9pZFRvQ2xhc3MsXHJcbiAgICBfbmFtZVRvQ2xhc3MsXHJcbn0gZnJvbSAnLi9qcy10eXBlZCc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9qcy10eXBlZCc7XHJcbmV4cG9ydCB7ZGVmYXVsdCBhcyBJREdlbmVyYXRvcn0gZnJvbSAnLi9pZC1nZW5lcmF0b3InO1xyXG5leHBvcnQge2RlZmF1bHQgYXMgUG9vbH0gZnJvbSAnLi9wb29sJztcclxuZXhwb3J0IGNvbnN0IGFycmF5ID0ganNhcnJheTtcclxuXHJcbmV4cG9ydCBjb25zdCBqcyA9IHsgICAgXHJcbiAgICBJREdlbmVyYXRvcixcclxuICAgIFBvb2wsXHJcbiAgICBhcnJheToganNhcnJheSxcclxuICAgIGlzTnVtYmVyLFxyXG4gICAgaXNTdHJpbmcsXHJcbiAgICBnZXRQcm9wZXJ0eURlc2NyaXB0b3IsXHJcbiAgICBhZGRvbixcclxuICAgIG1peGluLFxyXG4gICAgZXh0ZW5kLFxyXG4gICAgZ2V0U3VwZXIsXHJcbiAgICBpc0NoaWxkQ2xhc3NPZixcclxuICAgIGNsZWFyLFxyXG4gICAgdmFsdWUsXHJcbiAgICBnZXRzZXQsXHJcbiAgICBnZXQsXHJcbiAgICBzZXQsXHJcbiAgICB1bnJlZ2lzdGVyQ2xhc3MsXHJcbiAgICBnZXRDbGFzc05hbWUsXHJcbiAgICBzZXRDbGFzc05hbWUsXHJcbiAgICBzZXRDbGFzc0FsaWFzLFxyXG4gICAgZ2V0Q2xhc3NCeU5hbWUsXHJcbiAgICBfZ2V0Q2xhc3NJZCxcclxuICAgIF9zZXRDbGFzc0lkLFxyXG4gICAgX2dldENsYXNzQnlJZCxcclxuICAgIG9ic29sZXRlLFxyXG4gICAgb2Jzb2xldGVzLFxyXG4gICAgZm9ybWF0U3RyLFxyXG4gICAgc2hpZnRBcmd1bWVudHMsXHJcbiAgICBjcmVhdGVNYXAsXHJcbn07XHJcblxyXG4vKipcclxuICogVGhpcyBtb2R1bGUgcHJvdmlkZXMgc29tZSBKYXZhU2NyaXB0IHV0aWxpdGllcy5cclxuICogQWxsIG1lbWJlcnMgY2FuIGJlIGFjY2Vzc2VkIHdpdGggXCJjYy5qc1wiLlxyXG4gKi9cclxubGVnYWN5Q0MuanMgPSBqcztcclxuXHJcbmlmIChFRElUT1IpIHtcclxuICAgIGxlZ2FjeUNDLmpzLmdldHNldChsZWdhY3lDQy5qcywgJ19yZWdpc3RlcmVkQ2xhc3NJZHMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGR1bXAgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpZCBpbiBfaWRUb0NsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShpZCBpbiBfaWRUb0NsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZHVtcFtpZF0gPSBfaWRUb0NsYXNzW2lkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZHVtcDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGNsZWFyKF9pZFRvQ2xhc3MpO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGlkIGluIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmICghKGlkIGluIGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfaWRUb0NsYXNzW2lkXSA9IGl0ZW1baWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICk7XHJcbiAgICBsZWdhY3lDQy5qcy5nZXRzZXQobGVnYWN5Q0MuanMsICdfcmVnaXN0ZXJlZENsYXNzTmFtZXMnLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZHVtcCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGlkIGluIF9uYW1lVG9DbGFzcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEoaWQgaW4gX25hbWVUb0NsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZHVtcFtpZF0gPSBfbmFtZVRvQ2xhc3NbaWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkdW1wO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgY2xlYXIoX25hbWVUb0NsYXNzKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpZCBpbiBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShpZCBpbiBpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX25hbWVUb0NsYXNzW2lkXSA9IGl0ZW1baWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICk7XHJcbn1cclxuIl19