(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./node-event-processor.js", "./base-node.js", "./node.js", "./scene.js", "./layers.js", "./find.js", "./private-node.js", "./node-activator.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./node-event-processor.js"), require("./base-node.js"), require("./node.js"), require("./scene.js"), require("./layers.js"), require("./find.js"), require("./private-node.js"), require("./node-activator.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.nodeEventProcessor, global.baseNode, global.node, global.scene, global.layers, global.find, global.privateNode, global.nodeActivator, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _nodeEventProcessor, _baseNode, _node, _scene, _layers, _find, _privateNode, _nodeActivator, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "BaseNode", {
    enumerable: true,
    get: function () {
      return _baseNode.BaseNode;
    }
  });
  Object.defineProperty(_exports, "Node", {
    enumerable: true,
    get: function () {
      return _node.Node;
    }
  });
  Object.defineProperty(_exports, "Scene", {
    enumerable: true,
    get: function () {
      return _scene.Scene;
    }
  });
  Object.defineProperty(_exports, "Layers", {
    enumerable: true,
    get: function () {
      return _layers.Layers;
    }
  });
  Object.defineProperty(_exports, "find", {
    enumerable: true,
    get: function () {
      return _find.find;
    }
  });
  Object.defineProperty(_exports, "PrivateNode", {
    enumerable: true,
    get: function () {
      return _privateNode.PrivateNode;
    }
  });
  Object.defineProperty(_exports, "NodeActivator", {
    enumerable: true,
    get: function () {
      return _nodeActivator.default;
    }
  });
  _nodeActivator = _interopRequireDefault(_nodeActivator);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=