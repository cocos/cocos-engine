(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/geometry/index.js", "./builtin-shape.js", "../../framework/util.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/geometry/index.js"), require("./builtin-shape.js"), require("../../framework/util.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.builtinShape, global.util);
    global.builtinSphereShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _builtinShape, _util) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BuiltinSphereShape = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var BuiltinSphereShape = /*#__PURE__*/function (_BuiltinShape) {
    _inherits(BuiltinSphereShape, _BuiltinShape);

    _createClass(BuiltinSphereShape, [{
      key: "setRadius",
      value: function setRadius(radius) {
        this.localSphere.radius = radius;
        var s = (0, _util.maxComponent)(this.collider.node.worldScale);
        this.worldSphere.radius = this.localSphere.radius * s;
      }
    }, {
      key: "localSphere",
      get: function get() {
        return this._localShape;
      }
    }, {
      key: "worldSphere",
      get: function get() {
        return this._worldShape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }]);

    function BuiltinSphereShape() {
      var _this;

      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;

      _classCallCheck(this, BuiltinSphereShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BuiltinSphereShape).call(this));
      _this._localShape = new _index.sphere(0, 0, 0, radius);
      _this._worldShape = new _index.sphere(0, 0, 0, radius);
      return _this;
    }

    _createClass(BuiltinSphereShape, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(BuiltinSphereShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }]);

    return BuiltinSphereShape;
  }(_builtinShape.BuiltinShape);

  _exports.BuiltinSphereShape = BuiltinSphereShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY29jb3Mvc2hhcGVzL2J1aWx0aW4tc3BoZXJlLXNoYXBlLnRzIl0sIm5hbWVzIjpbIkJ1aWx0aW5TcGhlcmVTaGFwZSIsInJhZGl1cyIsImxvY2FsU3BoZXJlIiwicyIsImNvbGxpZGVyIiwibm9kZSIsIndvcmxkU2NhbGUiLCJ3b3JsZFNwaGVyZSIsIl9sb2NhbFNoYXBlIiwiX3dvcmxkU2hhcGUiLCJfY29sbGlkZXIiLCJzcGhlcmUiLCJzZXRSYWRpdXMiLCJCdWlsdGluU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU1hQSxrQjs7Ozs7Z0NBRUVDLE0sRUFBZ0I7QUFDdkIsYUFBS0MsV0FBTCxDQUFpQkQsTUFBakIsR0FBMEJBLE1BQTFCO0FBQ0EsWUFBTUUsQ0FBQyxHQUFHLHdCQUFhLEtBQUtDLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQkMsVUFBaEMsQ0FBVjtBQUNBLGFBQUtDLFdBQUwsQ0FBaUJOLE1BQWpCLEdBQTBCLEtBQUtDLFdBQUwsQ0FBaUJELE1BQWpCLEdBQTBCRSxDQUFwRDtBQUNIOzs7MEJBRWtCO0FBQ2YsZUFBTyxLQUFLSyxXQUFaO0FBQ0g7OzswQkFFa0I7QUFDZixlQUFPLEtBQUtDLFdBQVo7QUFDSDs7OzBCQUVlO0FBQ1osZUFBTyxLQUFLQyxTQUFaO0FBQ0g7OztBQUVELGtDQUEyQjtBQUFBOztBQUFBLFVBQWRULE1BQWMsdUVBQUwsR0FBSzs7QUFBQTs7QUFDdkI7QUFDQSxZQUFLTyxXQUFMLEdBQW1CLElBQUlHLGFBQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQlYsTUFBcEIsQ0FBbkI7QUFDQSxZQUFLUSxXQUFMLEdBQW1CLElBQUlFLGFBQUosQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQlYsTUFBcEIsQ0FBbkI7QUFIdUI7QUFJMUI7Ozs7K0JBRVM7QUFDTjs7QUFDQSxhQUFLVyxTQUFMLENBQWUsS0FBS1IsUUFBTCxDQUFjSCxNQUE3QjtBQUNIOzs7O0lBN0JtQ1ksMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcGhlcmUgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgQnVpbHRpblNoYXBlIH0gZnJvbSAnLi9idWlsdGluLXNoYXBlJztcclxuaW1wb3J0IHsgSVNwaGVyZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBtYXhDb21wb25lbnQgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsvdXRpbCc7XHJcbmltcG9ydCB7IFNwaGVyZUNvbGxpZGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcblxyXG5leHBvcnQgY2xhc3MgQnVpbHRpblNwaGVyZVNoYXBlIGV4dGVuZHMgQnVpbHRpblNoYXBlIGltcGxlbWVudHMgSVNwaGVyZVNoYXBlIHtcclxuXHJcbiAgICBzZXRSYWRpdXMgKHJhZGl1czogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5sb2NhbFNwaGVyZS5yYWRpdXMgPSByYWRpdXM7XHJcbiAgICAgICAgY29uc3QgcyA9IG1heENvbXBvbmVudCh0aGlzLmNvbGxpZGVyLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgdGhpcy53b3JsZFNwaGVyZS5yYWRpdXMgPSB0aGlzLmxvY2FsU3BoZXJlLnJhZGl1cyAqIHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvY2FsU3BoZXJlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxTaGFwZSBhcyBzcGhlcmU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdvcmxkU3BoZXJlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTaGFwZSBhcyBzcGhlcmU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgU3BoZXJlQ29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHJhZGl1cyA9IDAuNSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbG9jYWxTaGFwZSA9IG5ldyBzcGhlcmUoMCwgMCwgMCwgcmFkaXVzKTtcclxuICAgICAgICB0aGlzLl93b3JsZFNoYXBlID0gbmV3IHNwaGVyZSgwLCAwLCAwLCByYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcbiAgICAgICAgdGhpcy5zZXRSYWRpdXModGhpcy5jb2xsaWRlci5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=