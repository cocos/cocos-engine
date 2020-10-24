(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./decorators/ccclass.js", "./decorators/property.js", "./decorators/component.js", "./decorators/editable.js", "./decorators/type.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./decorators/ccclass.js"), require("./decorators/property.js"), require("./decorators/component.js"), require("./decorators/editable.js"), require("./decorators/type.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ccclass, global.property, global.component, global.editable, global.type);
    global.classDecorator = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ccclass, _property, _component, _editable, _type) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "ccclass", {
    enumerable: true,
    get: function () {
      return _ccclass.ccclass;
    }
  });
  Object.defineProperty(_exports, "property", {
    enumerable: true,
    get: function () {
      return _property.property;
    }
  });
  Object.defineProperty(_exports, "requireComponent", {
    enumerable: true,
    get: function () {
      return _component.requireComponent;
    }
  });
  Object.defineProperty(_exports, "executionOrder", {
    enumerable: true,
    get: function () {
      return _component.executionOrder;
    }
  });
  Object.defineProperty(_exports, "disallowMultiple", {
    enumerable: true,
    get: function () {
      return _component.disallowMultiple;
    }
  });
  Object.defineProperty(_exports, "executeInEditMode", {
    enumerable: true,
    get: function () {
      return _editable.executeInEditMode;
    }
  });
  Object.defineProperty(_exports, "menu", {
    enumerable: true,
    get: function () {
      return _editable.menu;
    }
  });
  Object.defineProperty(_exports, "playOnFocus", {
    enumerable: true,
    get: function () {
      return _editable.playOnFocus;
    }
  });
  Object.defineProperty(_exports, "inspector", {
    enumerable: true,
    get: function () {
      return _editable.inspector;
    }
  });
  Object.defineProperty(_exports, "icon", {
    enumerable: true,
    get: function () {
      return _editable.icon;
    }
  });
  Object.defineProperty(_exports, "help", {
    enumerable: true,
    get: function () {
      return _editable.help;
    }
  });
  Object.defineProperty(_exports, "type", {
    enumerable: true,
    get: function () {
      return _type.type;
    }
  });
  Object.defineProperty(_exports, "integer", {
    enumerable: true,
    get: function () {
      return _type.integer;
    }
  });
  Object.defineProperty(_exports, "float", {
    enumerable: true,
    get: function () {
      return _type.float;
    }
  });
  Object.defineProperty(_exports, "boolean", {
    enumerable: true,
    get: function () {
      return _type.boolean;
    }
  });
  Object.defineProperty(_exports, "string", {
    enumerable: true,
    get: function () {
      return _type.string;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=