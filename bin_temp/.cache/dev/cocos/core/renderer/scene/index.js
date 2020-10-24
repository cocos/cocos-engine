(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./ambient.js", "./camera.js", "./deprecated.js", "./directional-light.js", "./light.js", "./model.js", "./shadows.js", "./render-scene.js", "./skybox.js", "./sphere-light.js", "./spot-light.js", "./submodel.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./ambient.js"), require("./camera.js"), require("./deprecated.js"), require("./directional-light.js"), require("./light.js"), require("./model.js"), require("./shadows.js"), require("./render-scene.js"), require("./skybox.js"), require("./sphere-light.js"), require("./spot-light.js"), require("./submodel.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ambient, global.camera, global.deprecated, global.directionalLight, global.light, global.model, global.shadows, global.renderScene, global.skybox, global.sphereLight, global.spotLight, global.submodel);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ambient, _camera, _deprecated, _directionalLight, _light, _model, _shadows, _renderScene, _skybox, _sphereLight, _spotLight, _submodel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_ambient).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _ambient[key];
      }
    });
  });
  Object.keys(_camera).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _camera[key];
      }
    });
  });
  Object.keys(_deprecated).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _deprecated[key];
      }
    });
  });
  Object.keys(_directionalLight).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _directionalLight[key];
      }
    });
  });
  Object.keys(_light).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _light[key];
      }
    });
  });
  Object.keys(_model).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _model[key];
      }
    });
  });
  Object.keys(_shadows).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _shadows[key];
      }
    });
  });
  Object.keys(_renderScene).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _renderScene[key];
      }
    });
  });
  Object.keys(_skybox).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _skybox[key];
      }
    });
  });
  Object.keys(_sphereLight).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _sphereLight[key];
      }
    });
  });
  Object.keys(_spotLight).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _spotLight[key];
      }
    });
  });
  Object.keys(_submodel).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _submodel[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9hbWJpZW50JztcclxuZXhwb3J0ICogZnJvbSAnLi9jYW1lcmEnO1xyXG5leHBvcnQgKiBmcm9tICcuL2RlcHJlY2F0ZWQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2RpcmVjdGlvbmFsLWxpZ2h0JztcclxuZXhwb3J0ICogZnJvbSAnLi9saWdodCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbW9kZWwnO1xyXG5leHBvcnQgKiBmcm9tICcuL3NoYWRvd3MnO1xyXG5leHBvcnQgKiBmcm9tICcuL3JlbmRlci1zY2VuZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc2t5Ym94JztcclxuZXhwb3J0ICogZnJvbSAnLi9zcGhlcmUtbGlnaHQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3Nwb3QtbGlnaHQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3N1Ym1vZGVsJzsiXX0=