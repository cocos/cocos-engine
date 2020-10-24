(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./assembler/index.js", "../core/renderer/ui/mesh-buffer.js", "../core/renderer/ui/ui-vertex-format.js", "../core/renderer/ui/stencil-manager.js", "../core/global-exports.js", "./components/index.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./assembler/index.js"), require("../core/renderer/ui/mesh-buffer.js"), require("../core/renderer/ui/ui-vertex-format.js"), require("../core/renderer/ui/stencil-manager.js"), require("../core/global-exports.js"), require("./components/index.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.meshBuffer, global.uiVertexFormat, global.stencilManager, global.globalExports, global.index, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _meshBuffer, UIVertexFormat, _stencilManager, _globalExports, _index2, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    CanvasPool: true,
    graphicsAssembler: true,
    labelAssembler: true,
    spriteAssembler: true,
    MeshBuffer: true,
    UIVertexFormat: true,
    StencilManager: true
  };
  Object.defineProperty(_exports, "CanvasPool", {
    enumerable: true,
    get: function () {
      return _index.CanvasPool;
    }
  });
  Object.defineProperty(_exports, "graphicsAssembler", {
    enumerable: true,
    get: function () {
      return _index.graphicsAssembler;
    }
  });
  Object.defineProperty(_exports, "labelAssembler", {
    enumerable: true,
    get: function () {
      return _index.labelAssembler;
    }
  });
  Object.defineProperty(_exports, "spriteAssembler", {
    enumerable: true,
    get: function () {
      return _index.spriteAssembler;
    }
  });
  Object.defineProperty(_exports, "MeshBuffer", {
    enumerable: true,
    get: function () {
      return _meshBuffer.MeshBuffer;
    }
  });
  Object.defineProperty(_exports, "StencilManager", {
    enumerable: true,
    get: function () {
      return _stencilManager.StencilManager;
    }
  });
  _exports.UIVertexFormat = void 0;
  UIVertexFormat = _interopRequireWildcard(UIVertexFormat);
  _exports.UIVertexFormat = UIVertexFormat;
  Object.keys(_index2).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index2[key];
      }
    });
  });
  Object.keys(_deprecated).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _deprecated[key];
      }
    });
  });

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /**
   * @hidden
   */
  _globalExports.legacyCC.UI = {
    MeshBuffer: _meshBuffer.MeshBuffer,
    UIVertexFormat: UIVertexFormat,
    // barFilled,
    // radialFilled,
    // simple,
    // sliced,
    // ttf,
    // bmfont,
    // letter,
    // mask,
    // maskEnd,
    // graphics,
    spriteAssembler: _index.spriteAssembler,
    graphicsAssembler: _index.graphicsAssembler,
    labelAssembler: _index.labelAssembler
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2luZGV4LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwiVUkiLCJNZXNoQnVmZmVyIiwiVUlWZXJ0ZXhGb3JtYXQiLCJzcHJpdGVBc3NlbWJsZXIiLCJncmFwaGljc0Fzc2VtYmxlciIsImxhYmVsQXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7O0FBM0JBOzs7QUFpREFBLDBCQUFTQyxFQUFULEdBQWM7QUFDVkMsSUFBQUEsVUFBVSxFQUFWQSxzQkFEVTtBQUVWQyxJQUFBQSxjQUFjLEVBQWRBLGNBRlU7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQyxJQUFBQSxlQUFlLEVBQWZBLHNCQWJVO0FBY1ZDLElBQUFBLGlCQUFpQixFQUFqQkEsd0JBZFU7QUFlVkMsSUFBQUEsY0FBYyxFQUFkQTtBQWZVLEdBQWQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7XHJcbiAgICBiYXJGaWxsZWQsXHJcbiAgICBibWZvbnQsXHJcbiAgICBDYW52YXNQb29sLFxyXG4gICAgZ3JhcGhpY3MsXHJcbiAgICBncmFwaGljc0Fzc2VtYmxlcixcclxuICAgIGxhYmVsQXNzZW1ibGVyLFxyXG4gICAgbGV0dGVyLFxyXG4gICAgbWFzayxcclxuICAgIG1hc2tFbmQsXHJcbiAgICByYWRpYWxGaWxsZWQsXHJcbiAgICBzaW1wbGUsXHJcbiAgICBzbGljZWQsXHJcbiAgICBzcHJpdGVBc3NlbWJsZXIsXHJcbiAgICB0dGYsXHJcbn0gZnJvbSAnLi9hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBNZXNoQnVmZmVyIH0gZnJvbSAnLi4vY29yZS9yZW5kZXJlci91aS9tZXNoLWJ1ZmZlcic7XHJcbmltcG9ydCAqIGFzIFVJVmVydGV4Rm9ybWF0IGZyb20gJy4uL2NvcmUvcmVuZGVyZXIvdWkvdWktdmVydGV4LWZvcm1hdCc7XHJcbmltcG9ydCB7IFN0ZW5jaWxNYW5hZ2VyIH0gZnJvbSAnLi4vY29yZS9yZW5kZXJlci91aS9zdGVuY2lsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9jb21wb25lbnRzJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vZGVwcmVjYXRlZCc7XHJcblxyXG5leHBvcnQge1xyXG4gICAgTWVzaEJ1ZmZlcixcclxuICAgIFVJVmVydGV4Rm9ybWF0LFxyXG4gICAgU3RlbmNpbE1hbmFnZXIsXHJcbiAgICBDYW52YXNQb29sLFxyXG4gICAgLy8gYmFyRmlsbGVkLFxyXG4gICAgLy8gcmFkaWFsRmlsbGVkLFxyXG4gICAgLy8gc2ltcGxlLFxyXG4gICAgLy8gc2xpY2VkLFxyXG4gICAgLy8gdHRmLFxyXG4gICAgLy8gYm1mb250LFxyXG4gICAgLy8gbGV0dGVyLFxyXG4gICAgLy8gbWFzayxcclxuICAgIC8vIG1hc2tFbmQsXHJcbiAgICBzcHJpdGVBc3NlbWJsZXIsXHJcbiAgICAvLyBncmFwaGljcyxcclxuICAgIGxhYmVsQXNzZW1ibGVyLFxyXG4gICAgZ3JhcGhpY3NBc3NlbWJsZXIsXHJcbn07XHJcblxyXG5sZWdhY3lDQy5VSSA9IHtcclxuICAgIE1lc2hCdWZmZXIsXHJcbiAgICBVSVZlcnRleEZvcm1hdCxcclxuICAgIC8vIGJhckZpbGxlZCxcclxuICAgIC8vIHJhZGlhbEZpbGxlZCxcclxuICAgIC8vIHNpbXBsZSxcclxuICAgIC8vIHNsaWNlZCxcclxuICAgIC8vIHR0ZixcclxuICAgIC8vIGJtZm9udCxcclxuICAgIC8vIGxldHRlcixcclxuICAgIC8vIG1hc2ssXHJcbiAgICAvLyBtYXNrRW5kLFxyXG4gICAgLy8gZ3JhcGhpY3MsXHJcbiAgICBzcHJpdGVBc3NlbWJsZXIsXHJcbiAgICBncmFwaGljc0Fzc2VtYmxlcixcclxuICAgIGxhYmVsQXNzZW1ibGVyLFxyXG59OyJdfQ==