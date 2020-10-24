(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./exports/base.js", "./exports/gfx-webgl.js", "./exports/gfx-webgl2.js", "./exports/audio.js", "./exports/video.js", "./exports/webview.js", "./exports/particle.js", "./exports/ui.js", "./exports/tween.js", "./exports/terrain.js", "./exports/physics-framework.js", "./exports/physics-builtin.js", "./exports/physics-cannon.js", "./exports/physics-ammo.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./exports/base.js"), require("./exports/gfx-webgl.js"), require("./exports/gfx-webgl2.js"), require("./exports/audio.js"), require("./exports/video.js"), require("./exports/webview.js"), require("./exports/particle.js"), require("./exports/ui.js"), require("./exports/tween.js"), require("./exports/terrain.js"), require("./exports/physics-framework.js"), require("./exports/physics-builtin.js"), require("./exports/physics-cannon.js"), require("./exports/physics-ammo.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.base, global.gfxWebgl, global.gfxWebgl2, global.audio, global.video, global.webview, global.particle, global.ui, global.tween, global.terrain, global.physicsFramework, global.physicsBuiltin, global.physicsCannon, global.physicsAmmo);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _base, _gfxWebgl, _gfxWebgl2, _audio, _video, _webview, _particle, _ui, _tween, _terrain, _physicsFramework, _physicsBuiltin, _physicsCannon, _physicsAmmo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_base).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _base[key];
      }
    });
  });
  Object.keys(_gfxWebgl).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _gfxWebgl[key];
      }
    });
  });
  Object.keys(_gfxWebgl2).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _gfxWebgl2[key];
      }
    });
  });
  Object.keys(_audio).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _audio[key];
      }
    });
  });
  Object.keys(_video).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _video[key];
      }
    });
  });
  Object.keys(_webview).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _webview[key];
      }
    });
  });
  Object.keys(_particle).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _particle[key];
      }
    });
  });
  Object.keys(_ui).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _ui[key];
      }
    });
  });
  Object.keys(_tween).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _tween[key];
      }
    });
  });
  Object.keys(_terrain).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _terrain[key];
      }
    });
  });
  Object.keys(_physicsFramework).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _physicsFramework[key];
      }
    });
  });
  Object.keys(_physicsBuiltin).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _physicsBuiltin[key];
      }
    });
  });
  Object.keys(_physicsCannon).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _physicsCannon[key];
      }
    });
  });
  Object.keys(_physicsAmmo).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _physicsAmmo[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9leHBvcnRzL2Jhc2UnO1xyXG5leHBvcnQgKiBmcm9tICcuL2V4cG9ydHMvZ2Z4LXdlYmdsJztcclxuZXhwb3J0ICogZnJvbSAnLi9leHBvcnRzL2dmeC13ZWJnbDInO1xyXG5leHBvcnQgKiBmcm9tICcuL2V4cG9ydHMvYXVkaW8nO1xyXG5leHBvcnQgKiBmcm9tICcuL2V4cG9ydHMvdmlkZW8nO1xyXG5leHBvcnQgKiBmcm9tICcuL2V4cG9ydHMvd2Vidmlldyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0cy9wYXJ0aWNsZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0cy91aSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0cy90d2Vlbic7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0cy90ZXJyYWluJztcclxuZXhwb3J0ICogZnJvbSAnLi9leHBvcnRzL3BoeXNpY3MtZnJhbWV3b3JrJztcclxuZXhwb3J0ICogZnJvbSAnLi9leHBvcnRzL3BoeXNpY3MtYnVpbHRpbic7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0cy9waHlzaWNzLWNhbm5vbic7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXhwb3J0cy9waHlzaWNzLWFtbW8nO1xyXG4iXX0=