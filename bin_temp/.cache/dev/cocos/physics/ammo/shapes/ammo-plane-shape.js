(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-shape.js", "../ammo-util.js", "../ammo-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-shape.js"), require("../ammo-util.js"), require("../ammo-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoShape, global.ammoUtil, global.ammoEnum);
    global.ammoPlaneShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _ammoUtil, _ammoEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoPlaneShape = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  var AmmoPlaneShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoPlaneShape, _AmmoShape);

    _createClass(AmmoPlaneShape, [{
      key: "setNormal",
      value: function setNormal(v) {
        (0, _ammoUtil.cocos2AmmoVec3)(this.impl.getPlaneNormal(), v);
        this.updateCompoundTransform();
      }
    }, {
      key: "setConstant",
      value: function setConstant(v) {
        this.impl.setPlaneConstant(v);
        this.updateCompoundTransform();
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoPlaneShape.prototype), "setScale", this).call(this);

        (0, _ammoUtil.cocos2AmmoVec3)(this.scale, this._collider.node.worldScale);

        this._btShape.setLocalScaling(this.scale);

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

    function AmmoPlaneShape() {
      var _this;

      _classCallCheck(this, AmmoPlaneShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoPlaneShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.STATIC_PLANE_PROXYTYPE));
      _this.NORMAL = void 0;
      _this.NORMAL = new _ammoInstantiated.default.btVector3(0, 1, 0);
      _this._btShape = new _ammoInstantiated.default.btStaticPlaneShape(_this.NORMAL, 0);
      return _this;
    }

    _createClass(AmmoPlaneShape, [{
      key: "onComponentSet",
      value: function onComponentSet() {
        (0, _ammoUtil.cocos2AmmoVec3)(this.impl.getPlaneNormal(), this.collider.normal);
        this.impl.setPlaneConstant(this.collider.constant);
        this.setScale();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(AmmoPlaneShape.prototype), "onDestroy", this).call(this);

        _ammoInstantiated.default.destroy(this.NORMAL);

        (0, _ammoUtil.ammoDeletePtr)(this.NORMAL, _ammoInstantiated.default.btVector3);
        this.NORMAL = null;
      }
    }]);

    return AmmoPlaneShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoPlaneShape = AmmoPlaneShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1wbGFuZS1zaGFwZS50cyJdLCJuYW1lcyI6WyJBbW1vUGxhbmVTaGFwZSIsInYiLCJpbXBsIiwiZ2V0UGxhbmVOb3JtYWwiLCJ1cGRhdGVDb21wb3VuZFRyYW5zZm9ybSIsInNldFBsYW5lQ29uc3RhbnQiLCJzY2FsZSIsIl9jb2xsaWRlciIsIm5vZGUiLCJ3b3JsZFNjYWxlIiwiX2J0U2hhcGUiLCJzZXRMb2NhbFNjYWxpbmciLCJBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzIiwiU1RBVElDX1BMQU5FX1BST1hZVFlQRSIsIk5PUk1BTCIsIkFtbW8iLCJidFZlY3RvcjMiLCJidFN0YXRpY1BsYW5lU2hhcGUiLCJjb2xsaWRlciIsIm5vcm1hbCIsImNvbnN0YW50Iiwic2V0U2NhbGUiLCJkZXN0cm95IiwiQW1tb1NoYXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFRYUEsYzs7Ozs7Z0NBRUVDLEMsRUFBYztBQUNyQixzQ0FBZSxLQUFLQyxJQUFMLENBQVVDLGNBQVYsRUFBZixFQUEyQ0YsQ0FBM0M7QUFDQSxhQUFLRyx1QkFBTDtBQUNIOzs7a0NBRVlILEMsRUFBVztBQUNwQixhQUFLQyxJQUFMLENBQVVHLGdCQUFWLENBQTJCSixDQUEzQjtBQUNBLGFBQUtHLHVCQUFMO0FBQ0g7OztpQ0FFVztBQUNSOztBQUNBLHNDQUFlLEtBQUtFLEtBQXBCLEVBQTJCLEtBQUtDLFNBQUwsQ0FBZUMsSUFBZixDQUFvQkMsVUFBL0M7O0FBQ0EsYUFBS0MsUUFBTCxDQUFjQyxlQUFkLENBQThCLEtBQUtMLEtBQW5DOztBQUNBLGFBQUtGLHVCQUFMO0FBQ0g7OzswQkFFVztBQUNSLGVBQU8sS0FBS00sUUFBWjtBQUNIOzs7MEJBRWU7QUFDWixlQUFPLEtBQUtILFNBQVo7QUFDSDs7O0FBSUQsOEJBQWU7QUFBQTs7QUFBQTs7QUFDWCwwRkFBTUssb0NBQTBCQyxzQkFBaEM7QUFEVyxZQUZOQyxNQUVNO0FBRVgsWUFBS0EsTUFBTCxHQUFjLElBQUlDLDBCQUFLQyxTQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQWQ7QUFDQSxZQUFLTixRQUFMLEdBQWdCLElBQUlLLDBCQUFLRSxrQkFBVCxDQUE0QixNQUFLSCxNQUFqQyxFQUF5QyxDQUF6QyxDQUFoQjtBQUhXO0FBSWQ7Ozs7dUNBRWlCO0FBQ2Qsc0NBQWUsS0FBS1osSUFBTCxDQUFVQyxjQUFWLEVBQWYsRUFBMkMsS0FBS2UsUUFBTCxDQUFjQyxNQUF6RDtBQUNBLGFBQUtqQixJQUFMLENBQVVHLGdCQUFWLENBQTJCLEtBQUthLFFBQUwsQ0FBY0UsUUFBekM7QUFDQSxhQUFLQyxRQUFMO0FBQ0g7OztrQ0FFWTtBQUNUOztBQUNBTixrQ0FBS08sT0FBTCxDQUFhLEtBQUtSLE1BQWxCOztBQUNBLHFDQUFjLEtBQUtBLE1BQW5CLEVBQTJCQywwQkFBS0MsU0FBaEM7QUFDQyxhQUFLRixNQUFOLEdBQXVCLElBQXZCO0FBQ0g7Ozs7SUE5QytCUyxvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBbW1vIGZyb20gJy4uL2FtbW8taW5zdGFudGlhdGVkJztcclxuaW1wb3J0IHsgQW1tb1NoYXBlIH0gZnJvbSBcIi4vYW1tby1zaGFwZVwiO1xyXG5pbXBvcnQgeyBQbGFuZUNvbGxpZGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IGNvY29zMkFtbW9WZWMzLCBhbW1vRGVsZXRlUHRyIH0gZnJvbSAnLi4vYW1tby11dGlsJztcclxuaW1wb3J0IHsgQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyB9IGZyb20gJy4uL2FtbW8tZW51bSc7XHJcbmltcG9ydCB7IElQbGFuZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtbW9QbGFuZVNoYXBlIGV4dGVuZHMgQW1tb1NoYXBlIGltcGxlbWVudHMgSVBsYW5lU2hhcGUge1xyXG5cclxuICAgIHNldE5vcm1hbCAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5pbXBsLmdldFBsYW5lTm9ybWFsKCksIHYpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb25zdGFudCAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pbXBsLnNldFBsYW5lQ29uc3RhbnQodik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb3VuZFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlICgpIHtcclxuICAgICAgICBzdXBlci5zZXRTY2FsZSgpO1xyXG4gICAgICAgIGNvY29zMkFtbW9WZWMzKHRoaXMuc2NhbGUsIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgdGhpcy5fYnRTaGFwZS5zZXRMb2NhbFNjYWxpbmcodGhpcy5zY2FsZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb3VuZFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYnRTaGFwZSBhcyBBbW1vLmJ0U3RhdGljUGxhbmVTaGFwZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY29sbGlkZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xsaWRlciBhcyBQbGFuZUNvbGxpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IE5PUk1BTDogQW1tby5idFZlY3RvcjM7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKEFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMuU1RBVElDX1BMQU5FX1BST1hZVFlQRSk7XHJcbiAgICAgICAgdGhpcy5OT1JNQUwgPSBuZXcgQW1tby5idFZlY3RvcjMoMCwgMSwgMCk7XHJcbiAgICAgICAgdGhpcy5fYnRTaGFwZSA9IG5ldyBBbW1vLmJ0U3RhdGljUGxhbmVTaGFwZSh0aGlzLk5PUk1BTCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db21wb25lbnRTZXQgKCkge1xyXG4gICAgICAgIGNvY29zMkFtbW9WZWMzKHRoaXMuaW1wbC5nZXRQbGFuZU5vcm1hbCgpLCB0aGlzLmNvbGxpZGVyLm5vcm1hbCk7XHJcbiAgICAgICAgdGhpcy5pbXBsLnNldFBsYW5lQ29uc3RhbnQodGhpcy5jb2xsaWRlci5jb25zdGFudCk7XHJcbiAgICAgICAgdGhpcy5zZXRTY2FsZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25EZXN0cm95KCk7XHJcbiAgICAgICAgQW1tby5kZXN0cm95KHRoaXMuTk9STUFMKTtcclxuICAgICAgICBhbW1vRGVsZXRlUHRyKHRoaXMuTk9STUFMLCBBbW1vLmJ0VmVjdG9yMyk7XHJcbiAgICAgICAgKHRoaXMuTk9STUFMIGFzIGFueSkgPSBudWxsO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=