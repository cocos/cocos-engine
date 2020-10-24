(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./system.js", "./missing-script.js", "./component-event-handler.js", "./component.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./system.js"), require("./missing-script.js"), require("./component-event-handler.js"), require("./component.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.system, global.missingScript, global.componentEventHandler, global.component);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _system, _missingScript, _componentEventHandler, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "System", {
    enumerable: true,
    get: function () {
      return _system.default;
    }
  });
  Object.defineProperty(_exports, "MissingScript", {
    enumerable: true,
    get: function () {
      return _missingScript.default;
    }
  });
  Object.defineProperty(_exports, "EventHandler", {
    enumerable: true,
    get: function () {
      return _componentEventHandler.EventHandler;
    }
  });
  Object.defineProperty(_exports, "Component", {
    enumerable: true,
    get: function () {
      return _component.Component;
    }
  });
  _system = _interopRequireDefault(_system);
  _missingScript = _interopRequireDefault(_missingScript);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=