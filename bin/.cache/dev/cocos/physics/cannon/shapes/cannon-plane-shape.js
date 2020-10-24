(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../../core/math/index.js", "../cannon-util.js", "./cannon-shape.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../../core/math/index.js"), require("../cannon-util.js"), require("./cannon-shape.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.index, global.cannonUtil, global.cannonShape);
    global.cannonPlaneShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index, _cannonUtil, _cannonShape) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonPlaneShape = void 0;
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

  var CannonPlaneShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonPlaneShape, _CannonShape);

    _createClass(CannonPlaneShape, [{
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

    function CannonPlaneShape() {
      var _this;

      _classCallCheck(this, CannonPlaneShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CannonPlaneShape).call(this));
      _this._shape = new _cannon.default.Plane();
      return _this;
    }

    _createClass(CannonPlaneShape, [{
      key: "setNormal",
      value: function setNormal(v) {
        _index.Quat.rotationTo(this._orient, _index.Vec3.UNIT_Z, v);

        if (this._index != -1) {
          (0, _cannonUtil.commitShapeUpdates)(this._body);
        }
      }
    }, {
      key: "setConstant",
      value: function setConstant(v) {
        _index.Vec3.scaleAndAdd(this._offset, this._collider.center, this.collider.normal, v);
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonPlaneShape.prototype), "onLoad", this).call(this);

        this.setConstant(this.collider.constant);
        this.setNormal(this.collider.normal);
      }
    }, {
      key: "_setCenter",
      value: function _setCenter(v) {
        _get(_getPrototypeOf(CannonPlaneShape.prototype), "_setCenter", this).call(this, v);

        this.setConstant(this.collider.constant);
      }
    }]);

    return CannonPlaneShape;
  }(_cannonShape.CannonShape);

  _exports.CannonPlaneShape = CannonPlaneShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tcGxhbmUtc2hhcGUudHMiXSwibmFtZXMiOlsiQ2Fubm9uUGxhbmVTaGFwZSIsIl9jb2xsaWRlciIsIl9zaGFwZSIsIkNBTk5PTiIsIlBsYW5lIiwidiIsIlF1YXQiLCJyb3RhdGlvblRvIiwiX29yaWVudCIsIlZlYzMiLCJVTklUX1oiLCJfaW5kZXgiLCJfYm9keSIsInNjYWxlQW5kQWRkIiwiX29mZnNldCIsImNlbnRlciIsImNvbGxpZGVyIiwibm9ybWFsIiwic2V0Q29uc3RhbnQiLCJjb25zdGFudCIsInNldE5vcm1hbCIsIkNhbm5vblNoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFRYUEsZ0I7Ozs7OzBCQUVjO0FBQ25CLGVBQU8sS0FBS0MsU0FBWjtBQUNIOzs7MEJBRWtCO0FBQ2YsZUFBTyxLQUFLQyxNQUFaO0FBQ0g7OztBQUVELGdDQUFlO0FBQUE7O0FBQUE7O0FBQ1g7QUFDQSxZQUFLQSxNQUFMLEdBQWMsSUFBSUMsZ0JBQU9DLEtBQVgsRUFBZDtBQUZXO0FBR2Q7Ozs7Z0NBRVVDLEMsRUFBYztBQUNyQkMsb0JBQUtDLFVBQUwsQ0FBZ0IsS0FBS0MsT0FBckIsRUFBOEJDLFlBQUtDLE1BQW5DLEVBQTJDTCxDQUEzQzs7QUFDQSxZQUFJLEtBQUtNLE1BQUwsSUFBZSxDQUFDLENBQXBCLEVBQXVCO0FBQ25CLDhDQUFtQixLQUFLQyxLQUF4QjtBQUNIO0FBQ0o7OztrQ0FFWVAsQyxFQUFXO0FBQ3BCSSxvQkFBS0ksV0FBTCxDQUFpQixLQUFLQyxPQUF0QixFQUErQixLQUFLYixTQUFMLENBQWVjLE1BQTlDLEVBQXNELEtBQUtDLFFBQUwsQ0FBY0MsTUFBcEUsRUFBNEVaLENBQTVFO0FBQ0g7OzsrQkFFUztBQUNOOztBQUNBLGFBQUthLFdBQUwsQ0FBaUIsS0FBS0YsUUFBTCxDQUFjRyxRQUEvQjtBQUNBLGFBQUtDLFNBQUwsQ0FBZSxLQUFLSixRQUFMLENBQWNDLE1BQTdCO0FBQ0g7OztpQ0FFV1osQyxFQUFjO0FBQ3RCLHlGQUFpQkEsQ0FBakI7O0FBQ0EsYUFBS2EsV0FBTCxDQUFpQixLQUFLRixRQUFMLENBQWNHLFFBQS9CO0FBQ0g7Ozs7SUFuQ2lDRSx3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDQU5OT04gZnJvbSAnQGNvY29zL2Nhbm5vbic7XHJcbmltcG9ydCB7IFZlYzMsIFF1YXQgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBjb21taXRTaGFwZVVwZGF0ZXMgfSBmcm9tICcuLi9jYW5ub24tdXRpbCc7XHJcbmltcG9ydCB7IENhbm5vblNoYXBlIH0gZnJvbSAnLi9jYW5ub24tc2hhcGUnO1xyXG5pbXBvcnQgeyBJUGxhbmVTaGFwZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9tYXRoL3R5cGUtZGVmaW5lJztcclxuaW1wb3J0IHsgUGxhbmVDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENhbm5vblBsYW5lU2hhcGUgZXh0ZW5kcyBDYW5ub25TaGFwZSBpbXBsZW1lbnRzIElQbGFuZVNoYXBlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgUGxhbmVDb2xsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGltcGwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBDQU5OT04uUGxhbmU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fc2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Tm9ybWFsICh2OiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBRdWF0LnJvdGF0aW9uVG8odGhpcy5fb3JpZW50LCBWZWMzLlVOSVRfWiwgdik7XHJcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29uc3RhbnQgKHY6IG51bWJlcikge1xyXG4gICAgICAgIFZlYzMuc2NhbGVBbmRBZGQodGhpcy5fb2Zmc2V0LCB0aGlzLl9jb2xsaWRlci5jZW50ZXIsIHRoaXMuY29sbGlkZXIubm9ybWFsLCB2KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0Q29uc3RhbnQodGhpcy5jb2xsaWRlci5jb25zdGFudCk7XHJcbiAgICAgICAgdGhpcy5zZXROb3JtYWwodGhpcy5jb2xsaWRlci5ub3JtYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIF9zZXRDZW50ZXIgKHY6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIHN1cGVyLl9zZXRDZW50ZXIodik7XHJcbiAgICAgICAgdGhpcy5zZXRDb25zdGFudCh0aGlzLmNvbGxpZGVyLmNvbnN0YW50KTtcclxuICAgIH1cclxufVxyXG4iXX0=