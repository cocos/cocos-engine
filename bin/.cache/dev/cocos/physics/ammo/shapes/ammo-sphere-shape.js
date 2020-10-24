(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-shape.js", "../ammo-util.js", "../ammo-enum.js", "../ammo-const.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-shape.js"), require("../ammo-util.js"), require("../ammo-enum.js"), require("../ammo-const.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoShape, global.ammoUtil, global.ammoEnum, global.ammoConst);
    global.ammoSphereShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _ammoUtil, _ammoEnum, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoSphereShape = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

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

  var v3_0 = _ammoConst.CC_V3_0;

  var AmmoSphereShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoSphereShape, _AmmoShape);

    _createClass(AmmoSphereShape, [{
      key: "setRadius",
      value: function setRadius(radius) {
        this.impl.setUnscaledRadius(radius);
        this.updateCompoundTransform();
      }
    }, {
      key: "impl",
      get: function get() {
        return this._btShape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }]);

    function AmmoSphereShape() {
      var _this;

      _classCallCheck(this, AmmoSphereShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoSphereShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE));
      _this._btShape = new _ammoInstantiated.default.btSphereShape(0.5);
      return _this;
    }

    _createClass(AmmoSphereShape, [{
      key: "onComponentSet",
      value: function onComponentSet() {
        this.setRadius(this.collider.radius);
        this.setScale();
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoSphereShape.prototype), "setScale", this).call(this);

        var ws = this._collider.node.worldScale;
        var absX = Math.abs(ws.x);
        var absY = Math.abs(ws.y);
        var absZ = Math.abs(ws.z);
        var max_sp = Math.max(Math.max(absX, absY), absZ);
        v3_0.set(max_sp, max_sp, max_sp);
        (0, _ammoUtil.cocos2AmmoVec3)(this.scale, v3_0);

        this._btShape.setLocalScaling(this.scale);

        this.updateCompoundTransform();
      }
    }]);

    return AmmoSphereShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoSphereShape = AmmoSphereShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1zcGhlcmUtc2hhcGUudHMiXSwibmFtZXMiOlsidjNfMCIsIkNDX1YzXzAiLCJBbW1vU3BoZXJlU2hhcGUiLCJyYWRpdXMiLCJpbXBsIiwic2V0VW5zY2FsZWRSYWRpdXMiLCJ1cGRhdGVDb21wb3VuZFRyYW5zZm9ybSIsIl9idFNoYXBlIiwiX2NvbGxpZGVyIiwiQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyIsIlNQSEVSRV9TSEFQRV9QUk9YWVRZUEUiLCJBbW1vIiwiYnRTcGhlcmVTaGFwZSIsInNldFJhZGl1cyIsImNvbGxpZGVyIiwic2V0U2NhbGUiLCJ3cyIsIm5vZGUiLCJ3b3JsZFNjYWxlIiwiYWJzWCIsIk1hdGgiLCJhYnMiLCJ4IiwiYWJzWSIsInkiLCJhYnNaIiwieiIsIm1heF9zcCIsIm1heCIsInNldCIsInNjYWxlIiwic2V0TG9jYWxTY2FsaW5nIiwiQW1tb1NoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQSxNQUFNQSxJQUFJLEdBQUdDLGtCQUFiOztNQUVhQyxlOzs7OztnQ0FFRUMsTSxFQUFnQjtBQUN2QixhQUFLQyxJQUFMLENBQVVDLGlCQUFWLENBQTRCRixNQUE1QjtBQUNBLGFBQUtHLHVCQUFMO0FBQ0g7OzswQkFFVztBQUNSLGVBQU8sS0FBS0MsUUFBWjtBQUNIOzs7MEJBRWU7QUFDWixlQUFPLEtBQUtDLFNBQVo7QUFDSDs7O0FBRUQsK0JBQWU7QUFBQTs7QUFBQTs7QUFDWCwyRkFBTUMsb0NBQTBCQyxzQkFBaEM7QUFDQSxZQUFLSCxRQUFMLEdBQWdCLElBQUlJLDBCQUFLQyxhQUFULENBQXVCLEdBQXZCLENBQWhCO0FBRlc7QUFHZDs7Ozt1Q0FFaUI7QUFDZCxhQUFLQyxTQUFMLENBQWUsS0FBS0MsUUFBTCxDQUFjWCxNQUE3QjtBQUNBLGFBQUtZLFFBQUw7QUFDSDs7O2lDQUVXO0FBQ1I7O0FBQ0EsWUFBTUMsRUFBRSxHQUFHLEtBQUtSLFNBQUwsQ0FBZVMsSUFBZixDQUFvQkMsVUFBL0I7QUFDQSxZQUFNQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTTCxFQUFFLENBQUNNLENBQVosQ0FBYjtBQUNBLFlBQU1DLElBQUksR0FBR0gsSUFBSSxDQUFDQyxHQUFMLENBQVNMLEVBQUUsQ0FBQ1EsQ0FBWixDQUFiO0FBQ0EsWUFBTUMsSUFBSSxHQUFHTCxJQUFJLENBQUNDLEdBQUwsQ0FBU0wsRUFBRSxDQUFDVSxDQUFaLENBQWI7QUFDQSxZQUFNQyxNQUFNLEdBQUdQLElBQUksQ0FBQ1EsR0FBTCxDQUFTUixJQUFJLENBQUNRLEdBQUwsQ0FBU1QsSUFBVCxFQUFlSSxJQUFmLENBQVQsRUFBK0JFLElBQS9CLENBQWY7QUFDQXpCLFFBQUFBLElBQUksQ0FBQzZCLEdBQUwsQ0FBU0YsTUFBVCxFQUFpQkEsTUFBakIsRUFBeUJBLE1BQXpCO0FBQ0Esc0NBQWUsS0FBS0csS0FBcEIsRUFBMkI5QixJQUEzQjs7QUFDQSxhQUFLTyxRQUFMLENBQWN3QixlQUFkLENBQThCLEtBQUtELEtBQW5DOztBQUNBLGFBQUt4Qix1QkFBTDtBQUNIOzs7O0lBcENnQzBCLG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFtbW8gZnJvbSAnLi4vYW1tby1pbnN0YW50aWF0ZWQnO1xyXG5pbXBvcnQgeyBBbW1vU2hhcGUgfSBmcm9tIFwiLi9hbW1vLXNoYXBlXCI7XHJcbmltcG9ydCB7IFNwaGVyZUNvbGxpZGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IGNvY29zMkFtbW9WZWMzIH0gZnJvbSAnLi4vYW1tby11dGlsJztcclxuaW1wb3J0IHsgQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyB9IGZyb20gJy4uL2FtbW8tZW51bSc7XHJcbmltcG9ydCB7IElTcGhlcmVTaGFwZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgQ0NfVjNfMCB9IGZyb20gJy4uL2FtbW8tY29uc3QnO1xyXG5cclxuY29uc3QgdjNfMCA9IENDX1YzXzA7XHJcblxyXG5leHBvcnQgY2xhc3MgQW1tb1NwaGVyZVNoYXBlIGV4dGVuZHMgQW1tb1NoYXBlIGltcGxlbWVudHMgSVNwaGVyZVNoYXBlIHtcclxuXHJcbiAgICBzZXRSYWRpdXMgKHJhZGl1czogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pbXBsLnNldFVuc2NhbGVkUmFkaXVzKHJhZGl1cyk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb3VuZFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYnRTaGFwZSBhcyBBbW1vLmJ0U3BoZXJlU2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgU3BoZXJlQ29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKEFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMuU1BIRVJFX1NIQVBFX1BST1hZVFlQRSk7XHJcbiAgICAgICAgdGhpcy5fYnRTaGFwZSA9IG5ldyBBbW1vLmJ0U3BoZXJlU2hhcGUoMC41KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNvbXBvbmVudFNldCAoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRSYWRpdXModGhpcy5jb2xsaWRlci5yYWRpdXMpO1xyXG4gICAgICAgIHRoaXMuc2V0U2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0U2NhbGUoKTtcclxuICAgICAgICBjb25zdCB3cyA9IHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZTtcclxuICAgICAgICBjb25zdCBhYnNYID0gTWF0aC5hYnMod3MueCk7XHJcbiAgICAgICAgY29uc3QgYWJzWSA9IE1hdGguYWJzKHdzLnkpO1xyXG4gICAgICAgIGNvbnN0IGFic1ogPSBNYXRoLmFicyh3cy56KTtcclxuICAgICAgICBjb25zdCBtYXhfc3AgPSBNYXRoLm1heChNYXRoLm1heChhYnNYLCBhYnNZKSwgYWJzWik7XHJcbiAgICAgICAgdjNfMC5zZXQobWF4X3NwLCBtYXhfc3AsIG1heF9zcCk7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5zY2FsZSwgdjNfMCk7XHJcbiAgICAgICAgdGhpcy5fYnRTaGFwZS5zZXRMb2NhbFNjYWxpbmcodGhpcy5zY2FsZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb3VuZFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==