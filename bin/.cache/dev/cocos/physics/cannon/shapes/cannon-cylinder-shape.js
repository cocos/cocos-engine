(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "./cannon-shape.js", "../../framework/physics-enum.js", "../cannon-util.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("./cannon-shape.js"), require("../../framework/physics-enum.js"), require("../cannon-util.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.cannonShape, global.physicsEnum, global.cannonUtil);
    global.cannonCylinderShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _cannonShape, _physicsEnum, _cannonUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonCylinderShape = void 0;
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

  var CannonCylinderShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonCylinderShape, _CannonShape);

    _createClass(CannonCylinderShape, [{
      key: "setRadius",
      value: function setRadius(v) {
        this.updateProperties(this.collider.radius, this.collider.height, _cannon.default['CC_CONFIG']['numSegmentsCylinder'], this.collider.direction, this.collider.node.worldScale);
        if (this._index != -1) (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }, {
      key: "setHeight",
      value: function setHeight(v) {
        this.updateProperties(this.collider.radius, this.collider.height, _cannon.default['CC_CONFIG']['numSegmentsCylinder'], this.collider.direction, this.collider.node.worldScale);
        if (this._index != -1) (0, _cannonUtil.commitShapeUpdates)(this._body);
      }
    }, {
      key: "setDirection",
      value: function setDirection(v) {
        this.updateProperties(this.collider.radius, this.collider.height, _cannon.default['CC_CONFIG']['numSegmentsCylinder'], this.collider.direction, this.collider.node.worldScale);
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

    function CannonCylinderShape() {
      var _this;

      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _physicsEnum.EAxisDirection.Y_AXIS;

      _classCallCheck(this, CannonCylinderShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CannonCylinderShape).call(this));
      _this._shape = new _cannon.default.Cylinder(radius, radius, height, _cannon.default['CC_CONFIG']['numSegmentsCylinder'], direction == _physicsEnum.EAxisDirection.Y_AXIS);
      return _this;
    }

    _createClass(CannonCylinderShape, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonCylinderShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "setScale",
      value: function setScale(scale) {
        _get(_getPrototypeOf(CannonCylinderShape.prototype), "setScale", this).call(this, scale);

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
          var bf = [1];
          var tf = [0];

          for (var i = 0; i < N; i++) {
            var x = wr * cos(theta * i);
            var z = wr * sin(theta * i);
            vertices.push(new _cannon.default.Vec3(x, hH, z));
            vertices.push(new _cannon.default.Vec3(x, -hH, z));

            if (i < N - 1) {
              indices.push([2 * i + 2, 2 * i + 3, 2 * i + 1, 2 * i]);
              tf.push(2 * i + 2);
              bf.push(2 * i + 3);
            } else {
              indices.push([0, 1, 2 * i + 1, 2 * i]);
            }

            if (N % 2 === 1 || i < N / 2) {
              axes.push(new _cannon.default.Vec3(cos(theta * (i + 0.5)), 0, sin(theta * (i + 0.5))));
            }
          }

          indices.push(bf);
          var temp = [];

          for (var i = 0; i < tf.length; i++) {
            temp.push(tf[tf.length - i - 1]);
          }

          indices.push(temp);
          axes.push(new _cannon.default.Vec3(0, 1, 0));
        } else if (direction == 2) {
          var _bf = [0];
          var _tf = [1];

          for (var i = 0; i < N; i++) {
            var _x = wr * cos(theta * i);

            var y = wr * sin(theta * i);
            vertices.push(new _cannon.default.Vec3(_x, y, hH));
            vertices.push(new _cannon.default.Vec3(_x, y, -hH));

            if (i < N - 1) {
              indices.push([2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2]);

              _bf.push(2 * i + 2);

              _tf.push(2 * i + 3);
            } else {
              indices.push([2 * i, 2 * i + 1, 0, 1]);
            }

            if (N % 2 === 1 || i < N / 2) {
              axes.push(new _cannon.default.Vec3(cos(theta * (i + 0.5)), sin(theta * (i + 0.5)), 0));
            }
          }

          indices.push(_bf);
          var temp = [];

          for (var i = 0; i < _tf.length; i++) {
            temp.push(_tf[_tf.length - i - 1]);
          }

          indices.push(temp);
          axes.push(new _cannon.default.Vec3(0, 0, 1));
        } else {
          var _bf2 = [0];
          var _tf2 = [1];

          for (var i = 0; i < N; i++) {
            var _y = wr * cos(theta * i);

            var _z = wr * sin(theta * i);

            vertices.push(new _cannon.default.Vec3(hH, _y, _z));
            vertices.push(new _cannon.default.Vec3(-hH, _y, _z));

            if (i < N - 1) {
              indices.push([2 * i, 2 * i + 1, 2 * i + 3, 2 * i + 2]);

              _bf2.push(2 * i + 2);

              _tf2.push(2 * i + 3);
            } else {
              indices.push([2 * i, 2 * i + 1, 0, 1]);
            }

            if (N % 2 === 1 || i < N / 2) {
              axes.push(new _cannon.default.Vec3(0, cos(theta * (i + 0.5)), sin(theta * (i + 0.5))));
            }
          }

          indices.push(_bf2);
          var temp = [];

          for (var i = 0; i < _tf2.length; i++) {
            temp.push(_tf2[_tf2.length - i - 1]);
          }

          indices.push(temp);
          axes.push(new _cannon.default.Vec3(1, 0, 0));
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

    return CannonCylinderShape;
  }(_cannonShape.CannonShape);

  _exports.CannonCylinderShape = CannonCylinderShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tY3lsaW5kZXItc2hhcGUudHMiXSwibmFtZXMiOlsiQ2Fubm9uQ3lsaW5kZXJTaGFwZSIsInYiLCJ1cGRhdGVQcm9wZXJ0aWVzIiwiY29sbGlkZXIiLCJyYWRpdXMiLCJoZWlnaHQiLCJDQU5OT04iLCJkaXJlY3Rpb24iLCJub2RlIiwid29ybGRTY2FsZSIsIl9pbmRleCIsIl9ib2R5IiwiX2NvbGxpZGVyIiwiX3NoYXBlIiwiRUF4aXNEaXJlY3Rpb24iLCJZX0FYSVMiLCJDeWxpbmRlciIsInNldFJhZGl1cyIsInNjYWxlIiwibnVtU2VnbWVudHMiLCJ3aCIsIndyIiwiY29zIiwiTWF0aCIsInNpbiIsImFicyIsIm1heCIsInkiLCJ4IiwieiIsIk4iLCJoSCIsInZlcnRpY2VzIiwiaW5kaWNlcyIsImF4ZXMiLCJ0aGV0YSIsIlBJIiwiYmYiLCJ0ZiIsImkiLCJwdXNoIiwiVmVjMyIsInRlbXAiLCJsZW5ndGgiLCJpbXBsIiwiZmFjZXMiLCJ1bmlxdWVBeGVzIiwid29ybGRWZXJ0aWNlc05lZWRzVXBkYXRlIiwid29ybGRGYWNlTm9ybWFsc05lZWRzVXBkYXRlIiwiY29tcHV0ZU5vcm1hbHMiLCJjb21wdXRlRWRnZXMiLCJ1cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cyIsIkNhbm5vblNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFTYUEsbUI7Ozs7O2dDQVVFQyxDLEVBQVc7QUFDbEIsYUFBS0MsZ0JBQUwsQ0FDSSxLQUFLQyxRQUFMLENBQWNDLE1BRGxCLEVBRUksS0FBS0QsUUFBTCxDQUFjRSxNQUZsQixFQUdJQyxnQkFBTyxXQUFQLEVBQW9CLHFCQUFwQixDQUhKLEVBSUksS0FBS0gsUUFBTCxDQUFjSSxTQUpsQixFQUtJLEtBQUtKLFFBQUwsQ0FBY0ssSUFBZCxDQUFt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LHdCQUFWLEdBQXFDLElBQXJDO0FBQ0EsYUFBS0gsSUFBTCxDQUFVSSwyQkFBVixHQUF3QyxJQUF4QztBQUNBLGFBQUtKLElBQUwsQ0FBVUssY0FBVjtBQUNBLGFBQUtMLElBQUwsQ0FBVU0sWUFBVjtBQUNBLGFBQUtOLElBQUwsQ0FBVU8sMEJBQVY7QUFDSDs7OztJQWxMb0NDLHdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IENhbm5vblNoYXBlIH0gZnJvbSAnLi9jYW5ub24tc2hhcGUnO1xyXG5pbXBvcnQgeyBJQ3lsaW5kZXJTaGFwZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgQ3lsaW5kZXJDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBFQXhpc0RpcmVjdGlvbiB9IGZyb20gJy4uLy4uL2ZyYW1ld29yay9waHlzaWNzLWVudW0nO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBjb21taXRTaGFwZVVwZGF0ZXMgfSBmcm9tICcuLi9jYW5ub24tdXRpbCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2Fubm9uQ3lsaW5kZXJTaGFwZSBleHRlbmRzIENhbm5vblNoYXBlIGltcGxlbWVudHMgSUN5bGluZGVyU2hhcGUge1xyXG5cclxuICAgIGdldCBjb2xsaWRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGVyIGFzIEN5bGluZGVyQ29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGltcGwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBDQU5OT04uQ3lsaW5kZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UmFkaXVzICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgQ0FOTk9OWydDQ19DT05GSUcnXVsnbnVtU2VnbWVudHNDeWxpbmRlciddLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmRpcmVjdGlvbixcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5ub2RlLndvcmxkU2NhbGVcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5kZXggIT0gLTEpIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRIZWlnaHQgKHY6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllcyhcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5yYWRpdXMsXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIuaGVpZ2h0LFxyXG4gICAgICAgICAgICBDQU5OT05bJ0NDX0NPTkZJRyddWydudW1TZWdtZW50c0N5bGluZGVyJ10sXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIuZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleCAhPSAtMSkgY29tbWl0U2hhcGVVcGRhdGVzKHRoaXMuX2JvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERpcmVjdGlvbiAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLnJhZGl1cyxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5oZWlnaHQsXHJcbiAgICAgICAgICAgIENBTk5PTlsnQ0NfQ09ORklHJ11bJ251bVNlZ21lbnRzQ3lsaW5kZXInXSxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIubm9kZS53b3JsZFNjYWxlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ICE9IC0xKSBjb21taXRTaGFwZVVwZGF0ZXModGhpcy5fYm9keSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHJhZGl1cyA9IDAuNSwgaGVpZ2h0ID0gMiwgZGlyZWN0aW9uID0gRUF4aXNEaXJlY3Rpb24uWV9BWElTKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9zaGFwZSA9IG5ldyBDQU5OT04uQ3lsaW5kZXIocmFkaXVzLCByYWRpdXMsIGhlaWdodCwgQ0FOTk9OWydDQ19DT05GSUcnXVsnbnVtU2VnbWVudHNDeWxpbmRlciddLCBkaXJlY3Rpb24gPT0gRUF4aXNEaXJlY3Rpb24uWV9BWElTKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UmFkaXVzKHRoaXMuY29sbGlkZXIucmFkaXVzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZSAoc2NhbGU6IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5zZXRTY2FsZShzY2FsZSk7XHJcbiAgICAgICAgdGhpcy5zZXRSYWRpdXModGhpcy5jb2xsaWRlci5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb3BlcnRpZXMgKHJhZGl1czogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgbnVtU2VnbWVudHM6IG51bWJlciwgZGlyZWN0aW9uOiBudW1iZXIsIHNjYWxlOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBsZXQgd2ggPSBoZWlnaHQ7XHJcbiAgICAgICAgbGV0IHdyID0gcmFkaXVzO1xyXG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zO1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luO1xyXG4gICAgICAgIGNvbnN0IGFicyA9IE1hdGguYWJzO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4O1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gMSkge1xyXG4gICAgICAgICAgICB3aCA9IGFicyhzY2FsZS55KSAqIGhlaWdodDtcclxuICAgICAgICAgICAgd3IgPSBtYXgoYWJzKHNjYWxlLngpLCBhYnMoc2NhbGUueikpICogcmFkaXVzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IDIpIHtcclxuICAgICAgICAgICAgd2ggPSBhYnMoc2NhbGUueikgKiBoZWlnaHQ7XHJcbiAgICAgICAgICAgIHdyID0gbWF4KGFicyhzY2FsZS54KSwgYWJzKHNjYWxlLnkpKSAqIHJhZGl1cztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aCA9IGFicyhzY2FsZS54KSAqIGhlaWdodDtcclxuICAgICAgICAgICAgd3IgPSBtYXgoYWJzKHNjYWxlLnkpLCBhYnMoc2NhbGUueikpICogcmFkaXVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBOID0gbnVtU2VnbWVudHM7XHJcbiAgICAgICAgY29uc3QgaEggPSB3aCAvIDI7XHJcbiAgICAgICAgY29uc3QgdmVydGljZXM6IENBTk5PTi5WZWMzW10gPSBbXTtcclxuICAgICAgICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXVtdID0gW107XHJcbiAgICAgICAgY29uc3QgYXhlczogQ0FOTk9OLlZlYzNbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoZXRhID0gTWF0aC5QSSAqIDIgLyBOO1xyXG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBiZiA9IFsxXTtcclxuICAgICAgICAgICAgY29uc3QgdGYgPSBbMF07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gd3IgKiBjb3ModGhldGEgKiBpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHogPSB3ciAqIHNpbih0aGV0YSAqIGkpO1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoeCwgaEgsIHopKTtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLnB1c2gobmV3IENBTk5PTi5WZWMzKHgsIC1oSCwgeikpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgTiAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goWzIgKiBpICsgMiwgMiAqIGkgKyAzLCAyICogaSArIDEsIDIgKiBpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGYucHVzaCgyICogaSArIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJmLnB1c2goMiAqIGkgKyAzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKFswLCAxLCAyICogaSArIDEsIDIgKiBpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE4gJSAyID09PSAxIHx8IGkgPCBOIC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoY29zKHRoZXRhICogKGkgKyAwLjUpKSwgMCwgc2luKHRoZXRhICogKGkgKyAwLjUpKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGljZXMucHVzaChiZik7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2godGZbdGYubGVuZ3RoIC0gaSAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2godGVtcCk7XHJcbiAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoMCwgMSwgMCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IDIpIHtcclxuICAgICAgICAgICAgY29uc3QgYmYgPSBbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHRmID0gWzFdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHdyICogY29zKHRoZXRhICogaSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gd3IgKiBzaW4odGhldGEgKiBpKTtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLnB1c2gobmV3IENBTk5PTi5WZWMzKHgsIHksIGhIKSk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKG5ldyBDQU5OT04uVmVjMyh4LCB5LCAtaEgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IE4gLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKFsyICogaSwgMiAqIGkgKyAxLCAyICogaSArIDMsIDIgKiBpICsgMl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJmLnB1c2goMiAqIGkgKyAyKTtcclxuICAgICAgICAgICAgICAgICAgICB0Zi5wdXNoKDIgKiBpICsgMyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChbMiAqIGksIDIgKiBpICsgMSwgMCwgMV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChOICUgMiA9PT0gMSB8fCBpIDwgTiAvIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBheGVzLnB1c2gobmV3IENBTk5PTi5WZWMzKGNvcyh0aGV0YSAqIChpICsgMC41KSksIHNpbih0aGV0YSAqIChpICsgMC41KSksIDApKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2goYmYpO1xyXG4gICAgICAgICAgICB2YXIgdGVtcDogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0Zi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGVtcC5wdXNoKHRmW3RmLmxlbmd0aCAtIGkgLSAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5kaWNlcy5wdXNoKHRlbXApO1xyXG4gICAgICAgICAgICBheGVzLnB1c2gobmV3IENBTk5PTi5WZWMzKDAsIDAsIDEpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBiZiA9IFswXTtcclxuICAgICAgICAgICAgY29uc3QgdGYgPSBbMV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gd3IgKiBjb3ModGhldGEgKiBpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHogPSB3ciAqIHNpbih0aGV0YSAqIGkpO1xyXG4gICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoaEgsIHksIHopKTtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLnB1c2gobmV3IENBTk5PTi5WZWMzKC1oSCwgeSwgeikpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpIDwgTiAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goWzIgKiBpLCAyICogaSArIDEsIDIgKiBpICsgMywgMiAqIGkgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmYucHVzaCgyICogaSArIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRmLnB1c2goMiAqIGkgKyAzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKFsyICogaSwgMiAqIGkgKyAxLCAwLCAxXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKE4gJSAyID09PSAxIHx8IGkgPCBOIC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoMCwgY29zKHRoZXRhICogKGkgKyAwLjUpKSwgc2luKHRoZXRhICogKGkgKyAwLjUpKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGljZXMucHVzaChiZik7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRmLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wLnB1c2godGZbdGYubGVuZ3RoIC0gaSAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRpY2VzLnB1c2godGVtcCk7XHJcbiAgICAgICAgICAgIGF4ZXMucHVzaChuZXcgQ0FOTk9OLlZlYzMoMSwgMCwgMCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbXBsLnZlcnRpY2VzID0gdmVydGljZXM7XHJcbiAgICAgICAgdGhpcy5pbXBsLmZhY2VzID0gaW5kaWNlcztcclxuICAgICAgICB0aGlzLmltcGwudW5pcXVlQXhlcyA9IGF4ZXM7XHJcbiAgICAgICAgdGhpcy5pbXBsLndvcmxkVmVydGljZXNOZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pbXBsLndvcmxkRmFjZU5vcm1hbHNOZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pbXBsLmNvbXB1dGVOb3JtYWxzKCk7XHJcbiAgICAgICAgdGhpcy5pbXBsLmNvbXB1dGVFZGdlcygpO1xyXG4gICAgICAgIHRoaXMuaW1wbC51cGRhdGVCb3VuZGluZ1NwaGVyZVJhZGl1cygpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=