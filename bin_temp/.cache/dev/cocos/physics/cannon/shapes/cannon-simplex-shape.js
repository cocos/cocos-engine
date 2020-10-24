(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../../core/math/index.js", "../cannon-util.js", "./cannon-shape.js", "../../../../exports/physics-framework.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../../core/math/index.js"), require("../cannon-util.js"), require("./cannon-shape.js"), require("../../../../exports/physics-framework.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.index, global.cannonUtil, global.cannonShape, global.physicsFramework);
    global.cannonSimplexShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index, _cannonUtil, _cannonShape, _physicsFramework) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonSimplexShape = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var CannonSimplexShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonSimplexShape, _CannonShape);

    function CannonSimplexShape() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, CannonSimplexShape);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CannonSimplexShape)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.VERTICES = [];
      return _this;
    }

    _createClass(CannonSimplexShape, [{
      key: "setShapeType",
      value: function setShapeType(v) {
        if (this._isBinding) {//TODO: change the type after init
        }
      }
    }, {
      key: "setVertices",
      value: function setVertices(v) {
        var length = this.VERTICES.length;

        if (length == 4) {
          var ws = this._collider.node.worldScale;

          for (var i = 0; i < length; i++) {
            _index.Vec3.multiply(this.VERTICES[i], ws, v[i]);
          }

          var impl = this.impl;
          impl.computeNormals();
          impl.computeEdges();
          impl.updateBoundingSphereRadius();
        } else {// TODO: add to center
          // const impl = this.impl as CANNON.Particle;
        }

        if (this._index != -1) {
          (0, _cannonUtil.commitShapeUpdates)(this._body);
        }
      }
    }, {
      key: "onComponentSet",
      value: function onComponentSet() {
        var type = this.collider.shapeType;

        if (type == _physicsFramework.SimplexCollider.ESimplexType.TETRAHEDRON) {
          for (var i = 0; i < 4; i++) {
            this.VERTICES[i] = new _cannon.default.Vec3(0, 0, 0);
          }

          this._shape = createTetra(this.VERTICES);
        } else {
          if (type != _physicsFramework.SimplexCollider.ESimplexType.VERTEX) {// WARN
          }

          this._shape = new _cannon.default.Particle();
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonSimplexShape.prototype), "onLoad", this).call(this);

        this.collider.updateVertices();
      }
    }, {
      key: "setScale",
      value: function setScale(scale) {
        _get(_getPrototypeOf(CannonSimplexShape.prototype), "setScale", this).call(this, scale);

        this.collider.updateVertices();
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }, {
      key: "impl",
      get: function get() {
        return this._shape;
      }
    }]);

    return CannonSimplexShape;
  }(_cannonShape.CannonShape);

  _exports.CannonSimplexShape = CannonSimplexShape;

  var createTetra = function () {
    var faces = [[0, 3, 2], // -x
    [0, 1, 3], // -y
    [0, 2, 1], // -z
    [1, 2, 3] // +xyz
    ];
    return function (verts) {
      return new _cannon.default.ConvexPolyhedron(verts, faces);
    };
  }();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tc2ltcGxleC1zaGFwZS50cyJdLCJuYW1lcyI6WyJDYW5ub25TaW1wbGV4U2hhcGUiLCJWRVJUSUNFUyIsInYiLCJfaXNCaW5kaW5nIiwibGVuZ3RoIiwid3MiLCJfY29sbGlkZXIiLCJub2RlIiwid29ybGRTY2FsZSIsImkiLCJWZWMzIiwibXVsdGlwbHkiLCJpbXBsIiwiY29tcHV0ZU5vcm1hbHMiLCJjb21wdXRlRWRnZXMiLCJ1cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cyIsIl9pbmRleCIsIl9ib2R5IiwidHlwZSIsImNvbGxpZGVyIiwic2hhcGVUeXBlIiwiU2ltcGxleENvbGxpZGVyIiwiRVNpbXBsZXhUeXBlIiwiVEVUUkFIRURST04iLCJDQU5OT04iLCJfc2hhcGUiLCJjcmVhdGVUZXRyYSIsIlZFUlRFWCIsIlBhcnRpY2xlIiwidXBkYXRlVmVydGljZXMiLCJzY2FsZSIsIkNhbm5vblNoYXBlIiwiZmFjZXMiLCJ2ZXJ0cyIsIkNvbnZleFBvbHloZWRyb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVFhQSxrQjs7Ozs7Ozs7Ozs7Ozs7O1lBb0NBQyxRLEdBQTBCLEU7Ozs7OzttQ0FsQ3JCQyxDLEVBQWlDO0FBQzNDLFlBQUksS0FBS0MsVUFBVCxFQUFxQixDQUNqQjtBQUNIO0FBQ0o7OztrQ0FFWUQsQyxFQUFnQjtBQUN6QixZQUFNRSxNQUFNLEdBQUcsS0FBS0gsUUFBTCxDQUFjRyxNQUE3Qjs7QUFDQSxZQUFJQSxNQUFNLElBQUksQ0FBZCxFQUFpQjtBQUNiLGNBQU1DLEVBQUUsR0FBRyxLQUFLQyxTQUFMLENBQWVDLElBQWYsQ0FBb0JDLFVBQS9COztBQUNBLGVBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0wsTUFBcEIsRUFBNEJLLENBQUMsRUFBN0IsRUFBaUM7QUFDN0JDLHdCQUFLQyxRQUFMLENBQWMsS0FBS1YsUUFBTCxDQUFjUSxDQUFkLENBQWQsRUFBZ0NKLEVBQWhDLEVBQW9DSCxDQUFDLENBQUNPLENBQUQsQ0FBckM7QUFDSDs7QUFDRCxjQUFNRyxJQUFJLEdBQUcsS0FBS0EsSUFBbEI7QUFDQUEsVUFBQUEsSUFBSSxDQUFDQyxjQUFMO0FBQ0FELFVBQUFBLElBQUksQ0FBQ0UsWUFBTDtBQUNBRixVQUFBQSxJQUFJLENBQUNHLDBCQUFMO0FBQ0gsU0FURCxNQVNPLENBQ0g7QUFDQTtBQUNIOztBQUNELFlBQUksS0FBS0MsTUFBTCxJQUFlLENBQUMsQ0FBcEIsRUFBdUI7QUFDbkIsOENBQW1CLEtBQUtDLEtBQXhCO0FBQ0g7QUFDSjs7O3VDQVkyQjtBQUN4QixZQUFNQyxJQUFJLEdBQUcsS0FBS0MsUUFBTCxDQUFjQyxTQUEzQjs7QUFDQSxZQUFJRixJQUFJLElBQUlHLGtDQUFnQkMsWUFBaEIsQ0FBNkJDLFdBQXpDLEVBQXNEO0FBQ2xELGVBQUssSUFBSWQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QkEsQ0FBQyxFQUF4QixFQUE0QjtBQUN4QixpQkFBS1IsUUFBTCxDQUFjUSxDQUFkLElBQW1CLElBQUllLGdCQUFPZCxJQUFYLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQW5CO0FBQ0g7O0FBQ0QsZUFBS2UsTUFBTCxHQUFjQyxXQUFXLENBQUMsS0FBS3pCLFFBQU4sQ0FBekI7QUFDSCxTQUxELE1BS087QUFDSCxjQUFJaUIsSUFBSSxJQUFJRyxrQ0FBZ0JDLFlBQWhCLENBQTZCSyxNQUF6QyxFQUFpRCxDQUM3QztBQUNIOztBQUNELGVBQUtGLE1BQUwsR0FBYyxJQUFJRCxnQkFBT0ksUUFBWCxFQUFkO0FBQ0g7QUFDSjs7OytCQUVTO0FBQ047O0FBQ0EsYUFBS1QsUUFBTCxDQUFjVSxjQUFkO0FBQ0g7OzsrQkFFU0MsSyxFQUF3QjtBQUM5Qix5RkFBZUEsS0FBZjs7QUFDQSxhQUFLWCxRQUFMLENBQWNVLGNBQWQ7QUFDSDs7OzBCQWpDZTtBQUNaLGVBQU8sS0FBS3ZCLFNBQVo7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLbUIsTUFBWjtBQUNIOzs7O0lBbENtQ00sd0I7Ozs7QUFrRXhDLE1BQU1MLFdBQVcsR0FBSSxZQUFZO0FBQzdCLFFBQU1NLEtBQUssR0FBRyxDQUNWLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBRFUsRUFDQztBQUNYLEtBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBRlUsRUFFQztBQUNYLEtBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBSFUsRUFHQztBQUNYLEtBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBSlUsQ0FJQztBQUpELEtBQWQ7QUFNQSxXQUFPLFVBQVVDLEtBQVYsRUFBZ0M7QUFDbkMsYUFBTyxJQUFJVCxnQkFBT1UsZ0JBQVgsQ0FBNEJELEtBQTVCLEVBQW1DRCxLQUFuQyxDQUFQO0FBQ0gsS0FGRDtBQUdILEdBVm1CLEVBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcyB9IGZyb20gJy4uL2Nhbm5vbi11dGlsJztcclxuaW1wb3J0IHsgQ2Fubm9uU2hhcGUgfSBmcm9tICcuL2Nhbm5vbi1zaGFwZSc7XHJcbmltcG9ydCB7IElTaW1wbGV4U2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IFNpbXBsZXhDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbm5vblNpbXBsZXhTaGFwZSBleHRlbmRzIENhbm5vblNoYXBlIGltcGxlbWVudHMgSVNpbXBsZXhTaGFwZSB7XHJcblxyXG4gICAgc2V0U2hhcGVUeXBlICh2OiBTaW1wbGV4Q29sbGlkZXIuRVNpbXBsZXhUeXBlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzQmluZGluZykge1xyXG4gICAgICAgICAgICAvL1RPRE86IGNoYW5nZSB0aGUgdHlwZSBhZnRlciBpbml0XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFZlcnRpY2VzICh2OiBJVmVjM0xpa2VbXSkge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuVkVSVElDRVMubGVuZ3RoO1xyXG4gICAgICAgIGlmIChsZW5ndGggPT0gNCkge1xyXG4gICAgICAgICAgICBjb25zdCB3cyA9IHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgVmVjMy5tdWx0aXBseSh0aGlzLlZFUlRJQ0VTW2ldLCB3cywgdltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW1wbCA9IHRoaXMuaW1wbCBhcyBDQU5OT04uQ29udmV4UG9seWhlZHJvbjtcclxuICAgICAgICAgICAgaW1wbC5jb21wdXRlTm9ybWFscygpO1xyXG4gICAgICAgICAgICBpbXBsLmNvbXB1dGVFZGdlcygpO1xyXG4gICAgICAgICAgICBpbXBsLnVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogYWRkIHRvIGNlbnRlclxyXG4gICAgICAgICAgICAvLyBjb25zdCBpbXBsID0gdGhpcy5pbXBsIGFzIENBTk5PTi5QYXJ0aWNsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgU2ltcGxleENvbGxpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGUgYXMgQ0FOTk9OLlBhcnRpY2xlIHwgQ0FOTk9OLkNvbnZleFBvbHloZWRyb247XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgVkVSVElDRVM6IENBTk5PTi5WZWMzW10gPSBbXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgb25Db21wb25lbnRTZXQgKCkge1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmNvbGxpZGVyLnNoYXBlVHlwZTtcclxuICAgICAgICBpZiAodHlwZSA9PSBTaW1wbGV4Q29sbGlkZXIuRVNpbXBsZXhUeXBlLlRFVFJBSEVEUk9OKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlZFUlRJQ0VTW2ldID0gbmV3IENBTk5PTi5WZWMzKDAsIDAsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlID0gY3JlYXRlVGV0cmEodGhpcy5WRVJUSUNFUyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHR5cGUgIT0gU2ltcGxleENvbGxpZGVyLkVTaW1wbGV4VHlwZS5WRVJURVgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdBUk5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZSA9IG5ldyBDQU5OT04uUGFydGljbGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuICAgICAgICBzdXBlci5vbkxvYWQoKTtcclxuICAgICAgICB0aGlzLmNvbGxpZGVyLnVwZGF0ZVZlcnRpY2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2NhbGUgKHNjYWxlOiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5zZXRTY2FsZShzY2FsZSk7XHJcbiAgICAgICAgdGhpcy5jb2xsaWRlci51cGRhdGVWZXJ0aWNlcygpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbmNvbnN0IGNyZWF0ZVRldHJhID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGZhY2VzID0gW1xyXG4gICAgICAgIFswLCAzLCAyXSwgLy8gLXhcclxuICAgICAgICBbMCwgMSwgM10sIC8vIC15XHJcbiAgICAgICAgWzAsIDIsIDFdLCAvLyAtelxyXG4gICAgICAgIFsxLCAyLCAzXSwgLy8gK3h5elxyXG4gICAgXTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodmVydHM6IENBTk5PTi5WZWMzW10pIHtcclxuICAgICAgICByZXR1cm4gbmV3IENBTk5PTi5Db252ZXhQb2x5aGVkcm9uKHZlcnRzLCBmYWNlcyk7XHJcbiAgICB9XHJcbn0pKCk7Il19