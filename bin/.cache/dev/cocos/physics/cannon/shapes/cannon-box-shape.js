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
    global.cannonBoxShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index, _cannonUtil, _cannonShape) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonBoxShape = void 0;
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

  var CannonBoxShape = /*#__PURE__*/function (_CannonShape) {
    _inherits(CannonBoxShape, _CannonShape);

    _createClass(CannonBoxShape, [{
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

    function CannonBoxShape() {
      var _this;

      _classCallCheck(this, CannonBoxShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CannonBoxShape).call(this));
      _this.HALF_EXTENT = void 0;
      _this.HALF_EXTENT = new _cannon.default.Vec3(0.5, 0.5, 0.5);
      _this._shape = new _cannon.default.Box(_this.HALF_EXTENT.clone());
      return _this;
    }

    _createClass(CannonBoxShape, [{
      key: "setSize",
      value: function setSize(v) {
        _index.Vec3.multiplyScalar(this.HALF_EXTENT, v, 0.5);

        var ws = this.collider.node.worldScale;
        this.impl.halfExtents.x = this.HALF_EXTENT.x * Math.abs(ws.x);
        this.impl.halfExtents.y = this.HALF_EXTENT.y * Math.abs(ws.y);
        this.impl.halfExtents.z = this.HALF_EXTENT.z * Math.abs(ws.z);
        this.impl.updateConvexPolyhedronRepresentation();

        if (this._index != -1) {
          (0, _cannonUtil.commitShapeUpdates)(this._body);
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(CannonBoxShape.prototype), "onLoad", this).call(this);

        this.setSize(this.collider.size);
      }
    }, {
      key: "setScale",
      value: function setScale(scale) {
        _get(_getPrototypeOf(CannonBoxShape.prototype), "setScale", this).call(this, scale);

        this.setSize(this.collider.size);
      }
    }]);

    return CannonBoxShape;
  }(_cannonShape.CannonShape);

  _exports.CannonBoxShape = CannonBoxShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tYm94LXNoYXBlLnRzIl0sIm5hbWVzIjpbIkNhbm5vbkJveFNoYXBlIiwiX2NvbGxpZGVyIiwiX3NoYXBlIiwiSEFMRl9FWFRFTlQiLCJDQU5OT04iLCJWZWMzIiwiQm94IiwiY2xvbmUiLCJ2IiwibXVsdGlwbHlTY2FsYXIiLCJ3cyIsImNvbGxpZGVyIiwibm9kZSIsIndvcmxkU2NhbGUiLCJpbXBsIiwiaGFsZkV4dGVudHMiLCJ4IiwiTWF0aCIsImFicyIsInkiLCJ6IiwidXBkYXRlQ29udmV4UG9seWhlZHJvblJlcHJlc2VudGF0aW9uIiwiX2luZGV4IiwiX2JvZHkiLCJzZXRTaXplIiwic2l6ZSIsInNjYWxlIiwiQ2Fubm9uU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVFhQSxjOzs7OzswQkFFYztBQUNuQixlQUFPLEtBQUtDLFNBQVo7QUFDSDs7OzBCQUVrQjtBQUNmLGVBQU8sS0FBS0MsTUFBWjtBQUNIOzs7QUFHRCw4QkFBZTtBQUFBOztBQUFBOztBQUNYO0FBRFcsWUFETkMsV0FDTTtBQUVYLFlBQUtBLFdBQUwsR0FBbUIsSUFBSUMsZ0JBQU9DLElBQVgsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsQ0FBbkI7QUFDQSxZQUFLSCxNQUFMLEdBQWMsSUFBSUUsZ0JBQU9FLEdBQVgsQ0FBZSxNQUFLSCxXQUFMLENBQWlCSSxLQUFqQixFQUFmLENBQWQ7QUFIVztBQUlkOzs7OzhCQUVRQyxDLEVBQWM7QUFDbkJILG9CQUFLSSxjQUFMLENBQW9CLEtBQUtOLFdBQXpCLEVBQXNDSyxDQUF0QyxFQUF5QyxHQUF6Qzs7QUFDQSxZQUFNRSxFQUFFLEdBQUcsS0FBS0MsUUFBTCxDQUFjQyxJQUFkLENBQW1CQyxVQUE5QjtBQUNBLGFBQUtDLElBQUwsQ0FBVUMsV0FBVixDQUFzQkMsQ0FBdEIsR0FBMEIsS0FBS2IsV0FBTCxDQUFpQmEsQ0FBakIsR0FBcUJDLElBQUksQ0FBQ0MsR0FBTCxDQUFTUixFQUFFLENBQUNNLENBQVosQ0FBL0M7QUFDQSxhQUFLRixJQUFMLENBQVVDLFdBQVYsQ0FBc0JJLENBQXRCLEdBQTBCLEtBQUtoQixXQUFMLENBQWlCZ0IsQ0FBakIsR0FBcUJGLElBQUksQ0FBQ0MsR0FBTCxDQUFTUixFQUFFLENBQUNTLENBQVosQ0FBL0M7QUFDQSxhQUFLTCxJQUFMLENBQVVDLFdBQVYsQ0FBc0JLLENBQXRCLEdBQTBCLEtBQUtqQixXQUFMLENBQWlCaUIsQ0FBakIsR0FBcUJILElBQUksQ0FBQ0MsR0FBTCxDQUFTUixFQUFFLENBQUNVLENBQVosQ0FBL0M7QUFDQSxhQUFLTixJQUFMLENBQVVPLG9DQUFWOztBQUNBLFlBQUksS0FBS0MsTUFBTCxJQUFlLENBQUMsQ0FBcEIsRUFBdUI7QUFDbkIsOENBQW1CLEtBQUtDLEtBQXhCO0FBQ0g7QUFDSjs7OytCQUVTO0FBQ047O0FBQ0EsYUFBS0MsT0FBTCxDQUFhLEtBQUtiLFFBQUwsQ0FBY2MsSUFBM0I7QUFDSDs7OytCQUVTQyxLLEVBQW1CO0FBQ3pCLHFGQUFlQSxLQUFmOztBQUNBLGFBQUtGLE9BQUwsQ0FBYSxLQUFLYixRQUFMLENBQWNjLElBQTNCO0FBQ0g7Ozs7SUFyQytCRSx3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDQU5OT04gZnJvbSAnQGNvY29zL2Nhbm5vbic7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBjb21taXRTaGFwZVVwZGF0ZXMgfSBmcm9tICcuLi9jYW5ub24tdXRpbCc7XHJcbmltcG9ydCB7IENhbm5vblNoYXBlIH0gZnJvbSAnLi9jYW5ub24tc2hhcGUnO1xyXG5pbXBvcnQgeyBJQm94U2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IEJveENvbGxpZGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2Fubm9uQm94U2hhcGUgZXh0ZW5kcyBDYW5ub25TaGFwZSBpbXBsZW1lbnRzIElCb3hTaGFwZSB7XHJcblxyXG4gICAgcHVibGljIGdldCBjb2xsaWRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGVyIGFzIEJveENvbGxpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaW1wbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIGFzIENBTk5PTi5Cb3g7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgSEFMRl9FWFRFTlQ6IENBTk5PTi5WZWMzO1xyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5IQUxGX0VYVEVOVCA9IG5ldyBDQU5OT04uVmVjMygwLjUsIDAuNSwgMC41KTtcclxuICAgICAgICB0aGlzLl9zaGFwZSA9IG5ldyBDQU5OT04uQm94KHRoaXMuSEFMRl9FWFRFTlQuY2xvbmUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2l6ZSAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcih0aGlzLkhBTEZfRVhURU5ULCB2LCAwLjUpO1xyXG4gICAgICAgIGNvbnN0IHdzID0gdGhpcy5jb2xsaWRlci5ub2RlLndvcmxkU2NhbGU7XHJcbiAgICAgICAgdGhpcy5pbXBsLmhhbGZFeHRlbnRzLnggPSB0aGlzLkhBTEZfRVhURU5ULnggKiBNYXRoLmFicyh3cy54KTtcclxuICAgICAgICB0aGlzLmltcGwuaGFsZkV4dGVudHMueSA9IHRoaXMuSEFMRl9FWFRFTlQueSAqIE1hdGguYWJzKHdzLnkpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5oYWxmRXh0ZW50cy56ID0gdGhpcy5IQUxGX0VYVEVOVC56ICogTWF0aC5hYnMod3Mueik7XHJcbiAgICAgICAgdGhpcy5pbXBsLnVwZGF0ZUNvbnZleFBvbHloZWRyb25SZXByZXNlbnRhdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICBjb21taXRTaGFwZVVwZGF0ZXModGhpcy5fYm9keSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcbiAgICAgICAgdGhpcy5zZXRTaXplKHRoaXMuY29sbGlkZXIuc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2NhbGUgKHNjYWxlOiBWZWMzKTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIuc2V0U2NhbGUoc2NhbGUpO1xyXG4gICAgICAgIHRoaXMuc2V0U2l6ZSh0aGlzLmNvbGxpZGVyLnNpemUpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==