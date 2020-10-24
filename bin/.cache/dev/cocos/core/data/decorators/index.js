(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./ccclass.js", "./component.js", "./serializable.js", "./editable.js", "./type.js", "./override.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./ccclass.js"), require("./component.js"), require("./serializable.js"), require("./editable.js"), require("./type.js"), require("./override.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ccclass, global.component, global.serializable, global.editable, global.type, global.override);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ccclass, _component, _serializable, _editable, _type, _override) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    ccclass: true,
    override: true
  };
  Object.defineProperty(_exports, "ccclass", {
    enumerable: true,
    get: function () {
      return _ccclass.ccclass;
    }
  });
  Object.defineProperty(_exports, "override", {
    enumerable: true,
    get: function () {
      return _override.override;
    }
  });
  Object.keys(_component).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _component[key];
      }
    });
  });
  Object.keys(_serializable).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _serializable[key];
      }
    });
  });
  Object.keys(_editable).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _editable[key];
      }
    });
  });
  Object.keys(_type).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _type[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5leHBvcnQgeyBjY2NsYXNzIH0gZnJvbSAnLi9jY2NsYXNzJztcclxuZXhwb3J0ICogZnJvbSAnLi9jb21wb25lbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3NlcmlhbGl6YWJsZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZWRpdGFibGUnO1xyXG5leHBvcnQgKiBmcm9tICcuL3R5cGUnO1xyXG5leHBvcnQgeyBvdmVycmlkZSB9IGZyb20gJy4vb3ZlcnJpZGUnOyJdfQ==