(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./event.js", "./event-target.js", "./eventify.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./event.js"), require("./event-target.js"), require("./eventify.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.event, global.eventTarget, global.eventify);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _event, _eventTarget, _eventify) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "Event", {
    enumerable: true,
    get: function () {
      return _event.default;
    }
  });
  Object.defineProperty(_exports, "EventTarget", {
    enumerable: true,
    get: function () {
      return _eventTarget.EventTarget;
    }
  });
  Object.defineProperty(_exports, "Eventify", {
    enumerable: true,
    get: function () {
      return _eventify.Eventify;
    }
  });
  _event = _interopRequireDefault(_event);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=