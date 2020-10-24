(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../scene-graph/find.js", "./ppm.js", "./read-mesh.js", "./create-mesh.js", "./buffer.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../scene-graph/find.js"), require("./ppm.js"), require("./read-mesh.js"), require("./create-mesh.js"), require("./buffer.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.find, global.ppm, global.readMesh, global.createMesh, global.buffer);
    global.utils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _find, _ppm, _readMesh, _createMesh, _buffer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "find", {
    enumerable: true,
    get: function () {
      return _find.find;
    }
  });
  Object.defineProperty(_exports, "toPPM", {
    enumerable: true,
    get: function () {
      return _ppm.toPPM;
    }
  });
  Object.defineProperty(_exports, "readMesh", {
    enumerable: true,
    get: function () {
      return _readMesh.readMesh;
    }
  });
  Object.defineProperty(_exports, "createMesh", {
    enumerable: true,
    get: function () {
      return _createMesh.createMesh;
    }
  });
  Object.defineProperty(_exports, "readBuffer", {
    enumerable: true,
    get: function () {
      return _buffer.readBuffer;
    }
  });
  Object.defineProperty(_exports, "writeBuffer", {
    enumerable: true,
    get: function () {
      return _buffer.writeBuffer;
    }
  });
  Object.defineProperty(_exports, "mapBuffer", {
    enumerable: true,
    get: function () {
      return _buffer.mapBuffer;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=