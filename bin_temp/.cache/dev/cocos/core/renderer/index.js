(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils.js", "./config.js", "./core/constants.js", "./core/pass-utils.js", "./core/pass.js", "./core/program-lib.js", "./core/sampler-lib.js", "./core/texture-buffer-pool.js", "./core/material-instance.js", "./core/pass-instance.js", "./models/index.js", "./scene/index.js", "./scene/deprecated.js", "./ui/render-data.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils.js"), require("./config.js"), require("./core/constants.js"), require("./core/pass-utils.js"), require("./core/pass.js"), require("./core/program-lib.js"), require("./core/sampler-lib.js"), require("./core/texture-buffer-pool.js"), require("./core/material-instance.js"), require("./core/pass-instance.js"), require("./models/index.js"), require("./scene/index.js"), require("./scene/deprecated.js"), require("./ui/render-data.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.config, global.constants, global.passUtils, global.pass, global.programLib, global.samplerLib, global.textureBufferPool, global.materialInstance, global.passInstance, global.index, global.index, global.deprecated, global.renderData);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _config, _constants, _passUtils, _pass, _programLib, _samplerLib, _textureBufferPool, _materialInstance, _passInstance, models, scene, _deprecated, _renderData) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    addStage: true,
    createIA: true,
    models: true,
    scene: true
  };
  Object.defineProperty(_exports, "createIA", {
    enumerable: true,
    get: function () {
      return _utils.createIA;
    }
  });
  _exports.scene = _exports.models = _exports.addStage = void 0;
  _config = _interopRequireDefault(_config);
  Object.keys(_constants).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _constants[key];
      }
    });
  });
  Object.keys(_passUtils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _passUtils[key];
      }
    });
  });
  Object.keys(_pass).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _pass[key];
      }
    });
  });
  Object.keys(_programLib).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _programLib[key];
      }
    });
  });
  Object.keys(_samplerLib).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _samplerLib[key];
      }
    });
  });
  Object.keys(_textureBufferPool).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _textureBufferPool[key];
      }
    });
  });
  Object.keys(_materialInstance).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _materialInstance[key];
      }
    });
  });
  Object.keys(_passInstance).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _passInstance[key];
      }
    });
  });
  models = _interopRequireWildcard(models);
  _exports.models = models;
  scene = _interopRequireWildcard(scene);
  _exports.scene = scene;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var addStage = _config.default.addStage;
  _exports.addStage = addStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvaW5kZXgudHMiXSwibmFtZXMiOlsiYWRkU3RhZ2UiLCJjb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7O0FBVkEsTUFBTUEsUUFBUSxHQUFHQyxnQkFBT0QsUUFBeEIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBjcmVhdGVJQSB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcclxuXHJcbmNvbnN0IGFkZFN0YWdlID0gY29uZmlnLmFkZFN0YWdlO1xyXG5leHBvcnQgeyBhZGRTdGFnZSB9O1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9jb3JlL2NvbnN0YW50cyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY29yZS9wYXNzLXV0aWxzJztcclxuZXhwb3J0ICogZnJvbSAnLi9jb3JlL3Bhc3MnO1xyXG5leHBvcnQgKiBmcm9tICcuL2NvcmUvcHJvZ3JhbS1saWInO1xyXG5leHBvcnQgKiBmcm9tICcuL2NvcmUvc2FtcGxlci1saWInO1xyXG5leHBvcnQgKiBmcm9tICcuL2NvcmUvdGV4dHVyZS1idWZmZXItcG9vbCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY29yZS9tYXRlcmlhbC1pbnN0YW5jZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY29yZS9wYXNzLWluc3RhbmNlJztcclxuXHJcbmltcG9ydCAqIGFzIG1vZGVscyBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCAqIGFzIHNjZW5lIGZyb20gJy4vc2NlbmUnO1xyXG5leHBvcnQgeyBzY2VuZSwgbW9kZWxzIH07XHJcblxyXG5pbXBvcnQgJy4vc2NlbmUvZGVwcmVjYXRlZCc7XHJcbmltcG9ydCAnLi91aS9yZW5kZXItZGF0YSc7XHJcbiJdfQ==