(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.physicsSelector = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.select = select;
  _exports.physicsEngineId = _exports.WRAPPER = void 0;
  var WRAPPER;
  _exports.WRAPPER = WRAPPER;
  var physicsEngineId;
  _exports.physicsEngineId = physicsEngineId;

  function select(id, wrapper) {
    _exports.physicsEngineId = physicsEngineId = id;
    _globalExports.legacyCC._global['CC_PHYSICS_BUILTIN'] = id == 'builtin';
    _globalExports.legacyCC._global['CC_PHYSICS_CANNON'] = id == "cannon.js";
    _globalExports.legacyCC._global['CC_PHYSICS_AMMO'] = id == "ammo.js";
    _exports.WRAPPER = WRAPPER = wrapper;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL3BoeXNpY3Mtc2VsZWN0b3IudHMiXSwibmFtZXMiOlsiV1JBUFBFUiIsInBoeXNpY3NFbmdpbmVJZCIsInNlbGVjdCIsImlkIiwid3JhcHBlciIsImxlZ2FjeUNDIiwiX2dsb2JhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQk8sTUFBSUEsT0FBSjs7QUFFQSxNQUFJQyxlQUFKOzs7QUFFQSxXQUFTQyxNQUFULENBQWlCQyxFQUFqQixFQUF1Q0MsT0FBdkMsRUFBdUU7QUFDMUUsK0JBQUFILGVBQWUsR0FBR0UsRUFBbEI7QUFDQUUsNEJBQVNDLE9BQVQsQ0FBaUIsb0JBQWpCLElBQXlDSCxFQUFFLElBQUksU0FBL0M7QUFDQUUsNEJBQVNDLE9BQVQsQ0FBaUIsbUJBQWpCLElBQXdDSCxFQUFFLElBQUksV0FBOUM7QUFDQUUsNEJBQVNDLE9BQVQsQ0FBaUIsaUJBQWpCLElBQXNDSCxFQUFFLElBQUksU0FBNUM7QUFFQSx1QkFBQUgsT0FBTyxHQUFHSSxPQUFWO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcbmludGVyZmFjZSBJUGh5c2ljc1dyYXBwZXJPYmplY3Qge1xyXG4gICAgUGh5c2ljc1dvcmxkOiBhbnksXHJcbiAgICBSaWdpZEJvZHk/OiBhbnksXHJcblxyXG4gICAgQm94U2hhcGU6IGFueSxcclxuICAgIFNwaGVyZVNoYXBlOiBhbnksXHJcbiAgICBDYXBzdWxlU2hhcGU/OiBhbnksXHJcbiAgICBUcmltZXNoU2hhcGU/OiBhbnksXHJcbiAgICBDeWxpbmRlclNoYXBlPzogYW55LFxyXG4gICAgQ29uZVNoYXBlPzogYW55LFxyXG4gICAgVGVycmFpblNoYXBlPzogYW55LFxyXG4gICAgU2ltcGxleFNoYXBlPzogYW55LFxyXG4gICAgUGxhbmVTaGFwZT86IGFueSxcclxuXHJcbiAgICBQb2ludFRvUG9pbnRDb25zdHJhaW50PzogYW55LFxyXG4gICAgSGluZ2VDb25zdHJhaW50PzogYW55LFxyXG4gICAgQ29uZVR3aXN0Q29uc3RyYWludD86IGFueSxcclxufVxyXG5cclxudHlwZSBJUGh5c2ljc0VuZ2luZUlkID0gJ2J1aWx0aW4nIHwgJ2Nhbm5vbi5qcycgfCAnYW1tby5qcycgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcblxyXG5leHBvcnQgbGV0IFdSQVBQRVI6IElQaHlzaWNzV3JhcHBlck9iamVjdDtcclxuXHJcbmV4cG9ydCBsZXQgcGh5c2ljc0VuZ2luZUlkOiBJUGh5c2ljc0VuZ2luZUlkO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdCAoaWQ6IElQaHlzaWNzRW5naW5lSWQsIHdyYXBwZXI6IElQaHlzaWNzV3JhcHBlck9iamVjdCkge1xyXG4gICAgcGh5c2ljc0VuZ2luZUlkID0gaWQ7XHJcbiAgICBsZWdhY3lDQy5fZ2xvYmFsWydDQ19QSFlTSUNTX0JVSUxUSU4nXSA9IGlkID09ICdidWlsdGluJztcclxuICAgIGxlZ2FjeUNDLl9nbG9iYWxbJ0NDX1BIWVNJQ1NfQ0FOTk9OJ10gPSBpZCA9PSBcImNhbm5vbi5qc1wiO1xyXG4gICAgbGVnYWN5Q0MuX2dsb2JhbFsnQ0NfUEhZU0lDU19BTU1PJ10gPSBpZCA9PSBcImFtbW8uanNcIjtcclxuICAgIFxyXG4gICAgV1JBUFBFUiA9IHdyYXBwZXI7XHJcbn1cclxuIl19