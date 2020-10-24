(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./skeletal-animation-utils.js", "./skinning-model.js", "./baked-skinning-model.js", "./morph-model.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./skeletal-animation-utils.js"), require("./skinning-model.js"), require("./baked-skinning-model.js"), require("./morph-model.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.skeletalAnimationUtils, global.skinningModel, global.bakedSkinningModel, global.morphModel);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _skeletalAnimationUtils, _skinningModel, _bakedSkinningModel, _morphModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_skeletalAnimationUtils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _skeletalAnimationUtils[key];
      }
    });
  });
  Object.keys(_skinningModel).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _skinningModel[key];
      }
    });
  });
  Object.keys(_bakedSkinningModel).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _bakedSkinningModel[key];
      }
    });
  });
  Object.keys(_morphModel).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _morphModel[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvbW9kZWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5leHBvcnQgKiBmcm9tICcuL3NrZWxldGFsLWFuaW1hdGlvbi11dGlscyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc2tpbm5pbmctbW9kZWwnO1xyXG5leHBvcnQgKiBmcm9tICcuL2Jha2VkLXNraW5uaW5nLW1vZGVsJztcclxuZXhwb3J0ICogZnJvbSAnLi9tb3JwaC1tb2RlbCc7Il19