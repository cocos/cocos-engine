(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../../core/math/index.js", "./cannon-shape.js", "../../framework/physics-enum.js", "../cannon-util.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../../core/math/index.js"), require("./cannon-shape.js"), require("../../framework/physics-enum.js"), require("../cannon-util.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.index, global.cannonShape, global.physicsEnum, global.cannonUtil);
    global.cannonConeShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index, _cannonShape, _physicsEnum, _cannonUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonConeShape = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var v3_0 = new _index.Vec3();
  var v3_1 = new _index.Vec3();

  var CannonConeShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonConeShape, _CannonShape);

    _createClass(CannonConeShape, [{
      key: "setRadius",
      value: function setRadius(v) {
        this.updateProperties(this.collider.radius, this.collider.height, _cannon.default['CC_CONFIG']['numSegmentsCone'], this.collider.direction, this.collider.node.worldScale);
        if (this._index != -1) (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }, {
      key: "setHeight",
      value: function setHeight(v) {
        this.updateProperties(this.collider.radius, this.collider.height, _cannon.default['CC_CONFIG']['numSegmentsCone'], this.collider.direction, this.collider.node.worldScale);
        if (this._index != -1) (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }, {
      key: "setDirection",
      value: function setDirection(v) {
        this.updateProperties(this.collider.radius, this.collider.height, _cannon.default['CC_CONFIG']['numSegmentsCone'], this.collider.direction, this.collider.node.worldScale);
        if (this._index != -1) (0, _cannonUtil.commitShapeUpdates)(this._body);
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

    function CannonConeShape() {
      var _this;

      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _physicsEnum.EAxisDirection.Y_AXIS;

      _classCallCheck(this, CannonConeShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CannonConeShape).call(this));
      _this._shape = new _cannon.default.Cylinder(0, radius, height, _cannon.default['CC_CONFIG']['numSegmentsCone'], direction == _physicsEnum.EAxisDirection.Y_AXIS);
      return _this;
    }

    _createClass(CannonConeShape, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonConeShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "setScale",
      value: function setScale(scale) {
        _get(_getPrototypeOf(CannonConeShape.prototype), "setScale", this).call(this, scale);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "updateProperties",
      value: function updateProperties(radius, height, numSegments, direction, scale) {
        var wh = height;
        var wr = radius;
        var cos = Math.cos;
        var sin = Math.sin;
        var abs = Math.abs;
        var max = Math.max;

        if (direction == 1) {
          wh = abs(scale.y) * height;
          wr = max(abs(scale.x), abs(scale.z)) * radius;
        } else if (direction == 2) {
          wh = abs(scale.z) * height;
          wr = max(abs(scale.x), abs(scale.y)) * radius;
        } else {
          wh = abs(scale.x) * height;
          wr = max(abs(scale.y), abs(scale.z)) * radius;
        }

        var N = numSegments;
        var hH = wh / 2;
        var vertices = [];
        var indices = [];
        var axes = [];
        var theta = Math.PI * 2 / N;

        if (direction == 1) {
          var bf = [];
          indices.push(bf);
          vertices.push(new _cannon.default.Vec3(0, hH, 0));

          for (var i = 0; i < N; i++) {
            var x = wr * cos(theta * i);
            var z = wr * sin(theta * i);
            vertices.push(new _cannon.default.Vec3(x, -hH, z));
          }

          for (var i = 0; i < N; i++) {
            if (i != 0) bf.push(i);
            var face;

            if (i < N - 1) {
              face = [0, i + 2, i + 1];
            } else {
              face = [0, 1, i + 1];
            }

            indices.push(face);

            _index.Vec3.subtract(v3_0, vertices[0], vertices[face[1]]);

            _index.Vec3.subtract(v3_1, vertices[face[2]], vertices[face[1]]);

            _index.Vec3.cross(v3_0, v3_1, v3_0);

            v3_0.normalize();
            axes.push(new _cannon.default.Vec3(v3_0.x, v3_0.y, v3_0.z));
          }

          axes.push(new _cannon.default.Vec3(0, -1, 0));
        } else if (direction == 2) {
          var _bf = [];
          indices.push(_bf);
          vertices.push(new _cannon.default.Vec3(0, 0, hH));

          for (var i = 0; i < N; i++) {
            var _x = wr * cos(theta * i);

            var y = wr * sin(theta * i);
            vertices.push(new _cannon.default.Vec3(_x, y, -hH));
          }

          for (var i = 0; i < N; i++) {
            if (i != 0) _bf.push(N - i);
            var face;

            if (i < N - 1) {
              face = [0, i + 1, i + 2];
            } else {
              face = [0, i + 1, 1];
            }

            indices.push(face);

            _index.Vec3.subtract(v3_0, vertices[0], vertices[face[1]]);

            _index.Vec3.subtract(v3_1, vertices[face[2]], vertices[face[1]]);

            _index.Vec3.cross(v3_0, v3_0, v3_1);

            v3_0.normalize();
            axes.push(new _cannon.default.Vec3(v3_0.x, v3_0.y, v3_0.z));
          }

          axes.push(new _cannon.default.Vec3(0, 0, -1));
        } else {
          var _bf2 = [];
          indices.push(_bf2);
          vertices.push(new _cannon.default.Vec3(hH, 0, 0));

          for (var i = 0; i < N; i++) {
            var _y = wr * cos(theta * i);

            var _z = wr * sin(theta * i);

            vertices.push(new _cannon.default.Vec3(-hH, _y, _z));
          }

          for (var i = 0; i < N; i++) {
            if (i != 0) _bf2.push(N - i);
            var face;

            if (i < N - 1) {
              face = [0, i + 1, i + 2];
            } else {
              face = [0, i + 1, 1];
            }

            indices.push(face);

            _index.Vec3.subtract(v3_0, vertices[0], vertices[face[1]]);

            _index.Vec3.subtract(v3_1, vertices[face[2]], vertices[face[1]]);

            _index.Vec3.cross(v3_0, v3_0, v3_1);

            v3_0.normalize();
            axes.push(new _cannon.default.Vec3(v3_0.x, v3_0.y, v3_0.z));
          }

          axes.push(new _cannon.default.Vec3(-1, 0, 0));
        }

        this.impl.vertices = vertices;
        this.impl.faces = indices;
        this.impl.uniqueAxes = axes;
        this.impl.worldVerticesNeedsUpdate = true;
        this.impl.worldFaceNormalsNeedsUpdate = true;
        this.impl.computeNormals();
        this.impl.computeEdges();
        this.impl.updateBoundingSphereRadius();
      }
    }]);

    return CannonConeShape;
  }(_cannonShape.CannonShape);

  _exports.CannonConeShape = CannonConeShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tY29uZS1zaGFwZS50cyJdLCJuYW1lcyI6WyJ2M18wIiwiVmVjMyIsInYzXzEiLCJDYW5ub25Db25lU2hhcGUiLCJ2IiwidXBkYXRlUHJvcGVydGllcyIsImNvbGxpZGVyIiwicmFkaXVzIiwiaGVpZ2h0IiwiQ0FOTk9OIiwiZGlyZWN0aW9uIiwibm9kZSIsIndvcmxkU2NhbGUiLCJfaW5kZXgiLCJfYm9keSIsIl9jb2xsaWRlciIsIl9zaGFwZSIsIkVBeGlzRGlyZWN0aW9uIiwiWV9BWElTIiwiQ3lsaW5kZXIiLCJzZXRSYWRpdXMiLCJzY2FsZSIsIm51bVNlZ21lbnRzIiwid2giLCJ3ciIsImNvcyIsIk1hdGgiLCJzaW4iLCJhYnMiLCJtYXgiLCJ5IiwieCIsInoiLCJOIiwiaEgiLCJ2ZXJ0aWNlcyIsImluZGljZXMiLCJheGVzIiwidGhldGEiLCJQSSIsImJmIiwicHVzaCIsImkiLCJmYWNlIiwic3VidHJhY3QiLCJjcm9zcyIsIm5vcm1hbGl6ZSIsImltcGwiLCJmYWNlcyIsInVuaXF1ZUF4ZXMiLCJ3b3JsZFZlcnRpY2VzTmVlZHNVcGRhdGUiLCJ3b3JsZEZhY2VOb3JtYWxzTmVlZHNVcGRhdGUiLCJjb21wdXRlTm9ybWFscyIsImNvbXB1dGVFZGdlcyIsInVwZGF0ZUJvdW5kaW5nU3BoZXJlUmFkaXVzIiwiQ2Fubm9uU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLE1BQU1BLElBQUksR0FBRyxJQUFJQyxXQUFKLEVBQWI7QUFDQSxNQUFNQyxJQUFJLEdBQUcsSUFBSUQsV0FBSixFQUFiOztNQUVhRSxlOzs7OztnQ0FVRUMsQyxFQUFXO0FBQ2xCLGFBQUtDLGdCQUFMLENBQ0ksS0FBS0MsUUFBTCxDQUFjQyxNQURsQixFQUVJLEtBQUtELFFBQUwsQ0FBY0UsTUFG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XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBDYW5ub25TaGFwZSB9IGZyb20gJy4vY2Fubm9uLXNoYXBlJztcclxuaW1wb3J0IHsgSUNvbmVTaGFwZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgQ29uZUNvbGxpZGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IEVBeGlzRGlyZWN0aW9uIH0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrL3BoeXNpY3MtZW51bSc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcyB9IGZyb20gJy4uL2Nhbm5vbi11dGlsJztcclxuXHJcbmNvbnN0IHYzXzAgPSBuZXcgVmVjMygpO1xyXG5jb25zdCB2M18xID0gbmV3IFZlYzMoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW5ub25Db25lU2hhcGUgZXh0ZW5kcyBDYW5ub25TaGFwZSBpbXBsZW1lbnRzIElDb25lU2hhcGUge1xyXG5cclxuICAgIGdldCBjb2xsaWRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGVyIGFzIENvbmVDb2xsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW1wbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIGFzIENBTk5PTi5DeWxpbmRlcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXRSYWRpdXMgKHY6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllcyhcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5yYWRpdXMsXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIuaGVpZ2h0LFxyXG4gICAgICAgICAgICBDQU5OT05bJ0NDX0NPTkZJRyddWydudW1TZWdtZW50c0NvbmUnXSxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIubm9kZS53b3JsZFNjYWxlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ICE9IC0xKSBjb21taXRTaGFwZVVwZGF0ZXModGhpcy5fYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SGVpZ2h0ICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgQ0FOTk9OWydDQ19DT05GSUcnXVsnbnVtU2VnbWVudHNDb25lJ10sXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIuZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleCAhPSAtMSkgY29tbWl0U2hhcGVVcGRhdGVzKHRoaXMuX2JvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERpcmVjdGlvbiAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLnJhZGl1cyxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5oZWlnaHQsXHJcbiAgICAgICAgICAgIENBTk5PTlsnQ0NfQ09ORklHJ11bJ251bVNlZ21lbnRzQ29uZSddLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmRpcmVjdGlvbixcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5ub2RlLndvcmxkU2NhbGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5kZXggIT0gLTEpIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocmFkaXVzID0gMC41LCBoZWlnaHQgPSAxLCBkaXJlY3Rpb24gPSBFQXhpc0RpcmVjdGlvbi5ZX0FYSVMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX3NoYXBlID0gbmV3IENBTk5PTi5DeWxpbmRlcigwLCByYWRpdXMsIGhlaWdodCwgQ0FOTk9OWydDQ19DT05GSUcnXVsnbnVtU2VnbWVudHNDb25lJ10sIGRpcmVjdGlvbiA9PSBFQXhpc0RpcmVjdGlvbi5ZX0FYSVMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcbiAgICAgICAgdGhpcy5zZXRSYWRpdXModGhpcy5jb2xsaWRlci5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlIChzY2FsZTogVmVjMyk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLnNldFNjYWxlKHNjYWxlKTtcclxuICAgICAgICB0aGlzLnNldFJhZGl1cyh0aGlzLmNvbGxpZGVyLnJhZGl1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUHJvcGVydGllcyAocmFkaXVzOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBudW1TZWdtZW50czogbnVtYmVyLCBkaXJlY3Rpb246IG51bWJlciwgc2NhbGU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGxldCB3aCA9IGhlaWdodDtcclxuICAgICAgICBsZXQgd3IgPSByYWRpdXM7XHJcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3M7XHJcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW47XHJcbiAgICAgICAgY29uc3QgYWJzID0gTWF0aC5hYnM7XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXg7XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgIHdoID0gYWJzKHNjYWxlLnkpICogaGVpZ2h0O1xyXG4gICAgICAgICAgICB3ciA9IG1heChhYnMoc2NhbGUueCksIGFicyhzY2FsZS56KSkgKiByYWRpdXM7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT0gMikge1xyXG4gICAgICAgICAgICB3aCA9IGFicyhzY2FsZS56KSAqIGhlaWdodDtcclxuICAgICAgICAgICAgd3IgPSBtYXgoYWJzKHNjYWxlLngpLCBhYnMoc2NhbGUueSkpICogcmFkaXVzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdoID0gYWJzKHNjYWxlLngpICogaGVpZ2h0O1xyXG4gICAgICAgICAgICB3ciA9IG1heChhYnMoc2NhbGUueSksIGFicyhzY2FsZS56KSkgKiByYWRpdXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IE4gPSBudW1TZWdtZW50cztcclxuICAgICAgICBjb25zdCBoSCA9IHdoIC8gMjtcclxuICAgICAgICBjb25zdCB2ZXJ0aWNlczogQ0FOTk9OLlZlYzNbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGluZGljZXM6IG51bWJlcltdW10gPSBbXTtcclxuICAgICAgICBjb25zdCBheGVzOiBDQU5OT04uVmVjM1tdID0gW107XHJcbiAgICAgICAgY29uc3QgdGhldGEgPSBNYXRoLlBJICogMiAvIE47XHJcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJmOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goYmYpO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKG5ldyBDQU5OT04uVmVjMygwLCBoSCwgMCkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHdyICogY29zKHRoZXRhICogaSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB6ID0gd3IgKiBzaW4odGhldGEgKiBpKTtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLnB1c2gobmV3IENBTk5PTi5WZWMzKHgsIC1oSCwgeikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSAwKSBiZi5wdXNoKGkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZhY2U6IG51bWJlcltdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBOIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhY2UgPSBbMCwgaSArIDIsIGkgKyAxXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFjZSA9IFswLCAxLCBpICsgMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZmFjZSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHYzXzAsIHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1tmYWNlWzFdXSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHYzXzEsIHZlcnRpY2VzW2ZhY2VbMl1dLCB2ZXJ0aWNlc1tmYWNlWzFdXSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLmNyb3NzKHYzXzAsIHYzXzEsIHYzXzApO1xyXG4gICAgICAgICAgICAgICAgdjNfMC5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzModjNfMC54LCB2M18wLnksIHYzXzAueikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoMCwgLTEsIDApKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSAyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJmOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goYmYpO1xyXG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKG5ldyBDQU5OT04uVmVjMygwLCAwLCBoSCkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHdyICogY29zKHRoZXRhICogaSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gd3IgKiBzaW4odGhldGEgKiBpKTtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLnB1c2gobmV3IENBTk5PTi5WZWMzKHgsIHksIC1oSCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSAwKSBiZi5wdXNoKE4gLSBpKTtcclxuICAgICAgICAgICAgICAgIHZhciBmYWNlOiBudW1iZXJbXTtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgTiAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmYWNlID0gWzAsIGkgKyAxLCBpICsgMl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhY2UgPSBbMCwgaSArIDEsIDFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGZhY2UpO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh2M18wLCB2ZXJ0aWNlc1swXSwgdmVydGljZXNbZmFjZVsxXV0pO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh2M18xLCB2ZXJ0aWNlc1tmYWNlWzJdXSwgdmVydGljZXNbZmFjZVsxXV0pO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5jcm9zcyh2M18wLCB2M18wLCB2M18xKTtcclxuICAgICAgICAgICAgICAgIHYzXzAubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBheGVzLnB1c2gobmV3IENBTk5PTi5WZWMzKHYzXzAueCwgdjNfMC55LCB2M18wLnopKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBheGVzLnB1c2gobmV3IENBTk5PTi5WZWMzKDAsIDAsIC0xKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYmY6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgICAgIGluZGljZXMucHVzaChiZik7XHJcbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2gobmV3IENBTk5PTi5WZWMzKGhILCAwLCAwKSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gd3IgKiBjb3ModGhldGEgKiBpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHogPSB3ciAqIHNpbih0aGV0YSAqIGkpO1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoLWhILCB5LCB6KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpICE9IDApIGJmLnB1c2goTiAtIGkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZhY2U6IG51bWJlcltdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBOIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhY2UgPSBbMCwgaSArIDEsIGkgKyAyXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFjZSA9IFswLCBpICsgMSwgMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goZmFjZSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHYzXzAsIHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1tmYWNlWzFdXSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHYzXzEsIHZlcnRpY2VzW2ZhY2VbMl1dLCB2ZXJ0aWNlc1tmYWNlWzFdXSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLmNyb3NzKHYzXzAsIHYzXzAsIHYzXzEpO1xyXG4gICAgICAgICAgICAgICAgdjNfMC5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzModjNfMC54LCB2M18wLnksIHYzXzAueikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoLTEsIDAsIDApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW1wbC52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xyXG4gICAgICAgIHRoaXMuaW1wbC5mYWNlcyA9IGluZGljZXM7XHJcbiAgICAgICAgdGhpcy5pbXBsLnVuaXF1ZUF4ZXMgPSBheGVzO1xyXG4gICAgICAgIHRoaXMuaW1wbC53b3JsZFZlcnRpY2VzTmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW1wbC53b3JsZEZhY2VOb3JtYWxzTmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW1wbC5jb21wdXRlTm9ybWFscygpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5jb21wdXRlRWRnZXMoKTtcclxuICAgICAgICB0aGlzLmltcGwudXBkYXRlQm91bmRpbmdTcGhlcmVSYWRpdXMoKTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19