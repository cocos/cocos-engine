(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./sys.js", "./macro.js", "./visible-rect.js", "./view.js", "./event-manager/index.js", "./debug.js", "./screen.js", "./SubContextView.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./sys.js"), require("./macro.js"), require("./visible-rect.js"), require("./view.js"), require("./event-manager/index.js"), require("./debug.js"), require("./screen.js"), require("./SubContextView.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.sys, global.macro, global.visibleRect, global.view, global.index, global.debug, global.screen, global.SubContextView);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _sys, _macro, _visibleRect, _view, _index, _debug, _screen, _SubContextView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    log: true,
    error: true,
    warn: true,
    assert: true,
    logID: true,
    errorID: true,
    warnID: true,
    assertID: true,
    isDisplayStats: true,
    setDisplayStats: true,
    screen: true,
    SubContextView: true
  };
  Object.defineProperty(_exports, "log", {
    enumerable: true,
    get: function () {
      return _debug.log;
    }
  });
  Object.defineProperty(_exports, "error", {
    enumerable: true,
    get: function () {
      return _debug.error;
    }
  });
  Object.defineProperty(_exports, "warn", {
    enumerable: true,
    get: function () {
      return _debug.warn;
    }
  });
  Object.defineProperty(_exports, "assert", {
    enumerable: true,
    get: function () {
      return _debug.assert;
    }
  });
  Object.defineProperty(_exports, "logID", {
    enumerable: true,
    get: function () {
      return _debug.logID;
    }
  });
  Object.defineProperty(_exports, "errorID", {
    enumerable: true,
    get: function () {
      return _debug.errorID;
    }
  });
  Object.defineProperty(_exports, "warnID", {
    enumerable: true,
    get: function () {
      return _debug.warnID;
    }
  });
  Object.defineProperty(_exports, "assertID", {
    enumerable: true,
    get: function () {
      return _debug.assertID;
    }
  });
  Object.defineProperty(_exports, "isDisplayStats", {
    enumerable: true,
    get: function () {
      return _debug.isDisplayStats;
    }
  });
  Object.defineProperty(_exports, "setDisplayStats", {
    enumerable: true,
    get: function () {
      return _debug.setDisplayStats;
    }
  });
  Object.defineProperty(_exports, "screen", {
    enumerable: true,
    get: function () {
      return _screen.screen;
    }
  });
  Object.defineProperty(_exports, "SubContextView", {
    enumerable: true,
    get: function () {
      return _SubContextView.SubContextView;
    }
  });
  Object.keys(_sys).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _sys[key];
      }
    });
  });
  Object.keys(_macro).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _macro[key];
      }
    });
  });
  Object.keys(_visibleRect).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _visibleRect[key];
      }
    });
  });
  Object.keys(_view).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _view[key];
      }
    });
  });
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
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5leHBvcnQgKiBmcm9tICcuL3N5cyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbWFjcm8nO1xyXG5leHBvcnQgKiBmcm9tICcuL3Zpc2libGUtcmVjdCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdmlldyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXZlbnQtbWFuYWdlcic7XHJcbmV4cG9ydCB7XHJcbiAgICBsb2csXHJcbiAgICBlcnJvcixcclxuICAgIHdhcm4sXHJcbiAgICBhc3NlcnQsXHJcbiAgICBsb2dJRCxcclxuICAgIGVycm9ySUQsXHJcbiAgICB3YXJuSUQsXHJcbiAgICBhc3NlcnRJRCxcclxuICAgIGlzRGlzcGxheVN0YXRzLFxyXG4gICAgc2V0RGlzcGxheVN0YXRzLFxyXG59IGZyb20gJy4vZGVidWcnO1xyXG5cclxuZXhwb3J0IHsgc2NyZWVuIH0gZnJvbSAnLi9zY3JlZW4nO1xyXG5leHBvcnQgeyBTdWJDb250ZXh0VmlldyB9IGZyb20gJy4vU3ViQ29udGV4dFZpZXcnO1xyXG4iXX0=