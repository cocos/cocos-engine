(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../cocos/core/global-exports.js", "../predefine.js", "../cocos/core/legacy.js", "../cocos/core/index.js", "../cocos/core/renderer/index.js", "../extensions/ccpool/node-pool.js", "../cocos/core/primitive/index.js", "../cocos/core/primitive/primitive.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../cocos/core/global-exports.js"), require("../predefine.js"), require("../cocos/core/legacy.js"), require("../cocos/core/index.js"), require("../cocos/core/renderer/index.js"), require("../extensions/ccpool/node-pool.js"), require("../cocos/core/primitive/index.js"), require("../cocos/core/primitive/primitive.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.predefine, global.legacy, global.index, global.index, global.nodePool, global.index, global.primitive);
    global.base = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _predefine, _legacy, _index, renderer, _nodePool, primitives, _primitive) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    cclegacy: true,
    renderer: true,
    primitives: true
  };
  Object.defineProperty(_exports, "cclegacy", {
    enumerable: true,
    get: function () {
      return _globalExports.legacyCC;
    }
  });
  _exports.primitives = _exports.renderer = void 0;
  Object.keys(_index).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index[key];
      }
    });
  });
  renderer = _interopRequireWildcard(renderer);
  _exports.renderer = renderer;
  Object.keys(_nodePool).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _nodePool[key];
      }
    });
  });
  primitives = _interopRequireWildcard(primitives);
  _exports.primitives = primitives;
  Object.keys(_primitive).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _primitive[key];
      }
    });
  });

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /**
   * @hidden
   */
  // has to import predefines first
  // tslint:disable-next-line: ordered-imports
  // LOAD ENGINE CORE
  _globalExports.legacyCC.renderer = renderer;
  _globalExports.legacyCC.primitives = primitives;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2V4cG9ydHMvYmFzZS50cyJdLCJuYW1lcyI6WyJsZWdhY3lDQyIsInJlbmRlcmVyIiwicHJpbWl0aXZlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7QUFTQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7O0FBMUJBOzs7QUFLQTtBQUdBO0FBR0E7QUFJQUEsMEJBQVNDLFFBQVQsR0FBb0JBLFFBQXBCO0FBVUFELDBCQUFTRSxVQUFULEdBQXNCQSxVQUF0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9jb2Nvcy9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuLy8gaGFzIHRvIGltcG9ydCBwcmVkZWZpbmVzIGZpcnN0XHJcbmltcG9ydCAnLi4vcHJlZGVmaW5lJztcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogb3JkZXJlZC1pbXBvcnRzXHJcbmltcG9ydCAnLi4vY29jb3MvY29yZS9sZWdhY3knO1xyXG5cclxuLy8gTE9BRCBFTkdJTkUgQ09SRVxyXG5leHBvcnQgKiBmcm9tICcuLi9jb2Nvcy9jb3JlJztcclxuaW1wb3J0ICogYXMgcmVuZGVyZXIgZnJvbSAnLi4vY29jb3MvY29yZS9yZW5kZXJlcic7XHJcbmV4cG9ydCB7IHJlbmRlcmVyIH07XHJcbmxlZ2FjeUNDLnJlbmRlcmVyID0gcmVuZGVyZXI7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuLi9leHRlbnNpb25zL2NjcG9vbC9ub2RlLXBvb2wnO1xyXG5cclxuZXhwb3J0IHsgbGVnYWN5Q0MgYXMgY2NsZWdhY3kgfTtcclxuXHJcbmltcG9ydCAqIGFzIHByaW1pdGl2ZXMgZnJvbSAnLi4vY29jb3MvY29yZS9wcmltaXRpdmUnO1xyXG5leHBvcnQge1xyXG4gICAgcHJpbWl0aXZlcyxcclxufTtcclxubGVnYWN5Q0MucHJpbWl0aXZlcyA9IHByaW1pdGl2ZXM7XHJcbmV4cG9ydCAqIGZyb20gJy4uL2NvY29zL2NvcmUvcHJpbWl0aXZlL3ByaW1pdGl2ZSc7XHJcbiJdfQ==