(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "../../../core/index.js", "./ammo-shape.js", "../ammo-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("../../../core/index.js"), require("./ammo-shape.js"), require("../ammo-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.index, global.ammoShape, global.ammoEnum);
    global.ammoCapsuleShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _index, _ammoShape, _ammoEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoCapsuleShape = void 0;
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

  var AmmoCapsuleShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoCapsuleShape, _AmmoShape);

    _createClass(AmmoCapsuleShape, [{
      key: "setCylinderHeight",
      value: function setCylinderHeight(v) {
        this.updateProperties(this.collider.radius, this.collider.cylinderHeight, this.collider.direction, this._collider.node.worldScale);
      }
    }, {
      key: "setDirection",
      value: function setDirection(v) {
        this.updateProperties(this.collider.radius, this.collider.cylinderHeight, this.collider.direction, this._collider.node.worldScale);
      }
    }, {
      key: "setRadius",
      value: function setRadius(v) {
        this.updateProperties(this.collider.radius, this.collider.cylinderHeight, this.collider.direction, this._collider.node.worldScale);
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

    function AmmoCapsuleShape() {
      var _this;

      _classCallCheck(this, AmmoCapsuleShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoCapsuleShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.CAPSULE_SHAPE_PROXYTYPE));
      _this._btShape = new _ammoInstantiated.default.btCapsuleShape(0.5, 1);
      return _this;
    }

    _createClass(AmmoCapsuleShape, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(AmmoCapsuleShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoCapsuleShape.prototype), "setScale", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "updateProperties",
      value: function updateProperties(radius, height, direction, scale) {
        var ws = scale;
        var upAxis = direction;

        if (upAxis == 1) {
          var wr = radius * Math.abs((0, _index.absMax)(ws.x, ws.z));
          var halfH = height / 2 * Math.abs(ws.y);
          this.impl.updateProp(wr, halfH, upAxis);
        } else if (upAxis == 0) {
          var _wr = radius * Math.abs((0, _index.absMax)(ws.y, ws.z));

          var _halfH = height / 2 * Math.abs(ws.x);

          this.impl.updateProp(_wr, _halfH, upAxis);
        } else {
          var _wr2 = radius * Math.abs((0, _index.absMax)(ws.x, ws.y));

          var _halfH2 = height / 2 * Math.abs(ws.z);

          this.impl.updateProp(_wr2, _halfH2, upAxis);
        }

        this.updateCompoundTransform();
      }
    }]);

    return AmmoCapsuleShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoCapsuleShape = AmmoCapsuleShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1jYXBzdWxlLXNoYXBlLnRzIl0sIm5hbWVzIjpbIkFtbW9DYXBzdWxlU2hhcGUiLCJ2IiwidXBkYXRlUHJvcGVydGllcyIsImNvbGxpZGVyIiwicmFkaXVzIiwiY3lsaW5kZXJIZWlnaHQiLCJkaXJlY3Rpb24iLCJfY29sbGlkZXIiLCJub2RlIiwid29ybGRTY2FsZSIsIl9idFNoYXBlIiwiQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyIsIkNBUFNVTEVfU0hBUEVfUFJPWFlUWVBFIiwiQW1tbyIsImJ0Q2Fwc3VsZVNoYXBlIiwic2V0UmFkaXVzIiwiaGVpZ2h0Iiwic2NhbGUiLCJ3cyIsInVwQXhpcyIsIndyIiwiTWF0aCIsImFicyIsIngiLCJ6IiwiaGFsZkgiLCJ5IiwiaW1wbCIsInVwZGF0ZVByb3AiLCJ1cGRhdGVDb21wb3VuZFRyYW5zZm9ybSIsIkFtbW9TaGFwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BUWFBLGdCOzs7Ozt3Q0FFVUMsQyxFQUFXO0FBQzFCLGFBQUtDLGdCQUFMLENBQ0ksS0FBS0MsUUFBTCxDQUFjQyxNQURsQixFQUVJLEtBQUtELFFBQUwsQ0FBY0UsY0FGbEIsRUFHSSxLQUFLRixRQUFMLENBQWNHLFNBSGxCLEVBSUksS0FBS0MsU0FBTCxDQUFlQyxJQUFmLENBQW9CQyxVQUp4QjtBQU1IOzs7bUNBRWFSLEMsRUFBVztBQUNyQixhQUFLQyxnQkFBTCxDQUNJLEtBQUtDLFFBQUwsQ0FBY0MsTUFEbEIsRUFFSSxLQUFLRCxRQUFMLENBQWNFLGNBRmxCLEVBR0ksS0FBS0YsUUFBTCxDQUFjRyxTQUhsQixFQUlJLEtBQUtDLFNBQUwsQ0FBZUMsSUFBZixDQUFvQkMsVUFKeEI7QUFNSDs7O2dDQUVVUixDLEVBQVc7QUFDbEIsYUFBS0MsZ0JBQUwsQ0FDSSxLQUFLQyxRQUFMLENBQWNDLE1BRGxCLEVBRUksS0FBS0QsUUFBTCxDQUFjRSxjQUZsQixFQUdJLEtBQUtGLFFBQUwsQ0FBY0csU0FIbEIsRUFJSSxLQUFLQyxTQUFMLENBQWVDLElBQWYsQ0FBb0JDLFVBSnhCO0FBTUg7OzswQkFFVztBQUNSLGVBQU8sS0FBS0MsUUFBWjtBQUNIOzs7MEJBRWU7QUFDWixlQUFPLEtBQUtILFNBQVo7QUFDSDs7O0FBRUQsZ0NBQWU7QUFBQTs7QUFBQTs7QUFDWCw0RkFBTUksb0NBQTBCQyx1QkFBaEM7QUFDQSxZQUFLRixRQUFMLEdBQWdCLElBQUlHLDBCQUFLQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLENBQTdCLENBQWhCO0FBRlc7QUFHZDs7OzsrQkFFUztBQUNOOztBQUNBLGFBQUtDLFNBQUwsQ0FBZSxLQUFLWixRQUFMLENBQWNDLE1BQTdCO0FBQ0g7OztpQ0FFVztBQUNSOztBQUNBLGFBQUtXLFNBQUwsQ0FBZSxLQUFLWixRQUFMLENBQWNDLE1BQTdCO0FBQ0g7Ozt1Q0FFaUJBLE0sRUFBZ0JZLE0sRUFBZ0JWLFMsRUFBbUJXLEssRUFBa0I7QUFDbkYsWUFBTUMsRUFBRSxHQUFHRCxLQUFYO0FBQ0EsWUFBTUUsTUFBTSxHQUFHYixTQUFmOztBQUNBLFlBQUlhLE1BQU0sSUFBSSxDQUFkLEVBQWlCO0FBQ2IsY0FBTUMsRUFBRSxHQUFHaEIsTUFBTSxHQUFHaUIsSUFBSSxDQUFDQyxHQUFMLENBQVMsbUJBQU9KLEVBQUUsQ0FBQ0ssQ0FBVixFQUFhTCxFQUFFLENBQUNNLENBQWhCLENBQVQsQ0FBcEI7QUFDQSxjQUFNQyxLQUFLLEdBQUdULE1BQU0sR0FBRyxDQUFULEdBQWFLLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixFQUFFLENBQUNRLENBQVosQ0FBM0I7QUFDQSxlQUFLQyxJQUFMLENBQVVDLFVBQVYsQ0FBcUJSLEVBQXJCLEVBQXlCSyxLQUF6QixFQUFnQ04sTUFBaEM7QUFDSCxTQUpELE1BSU8sSUFBSUEsTUFBTSxJQUFJLENBQWQsRUFBaUI7QUFDcEIsY0FBTUMsR0FBRSxHQUFHaEIsTUFBTSxHQUFHaUIsSUFBSSxDQUFDQyxHQUFMLENBQVMsbUJBQU9KLEVBQUUsQ0FBQ1EsQ0FBVixFQUFhUixFQUFFLENBQUNNLENBQWhCLENBQVQsQ0FBcEI7O0FBQ0EsY0FBTUMsTUFBSyxHQUFHVCxNQUFNLEdBQUcsQ0FBVCxHQUFhSyxJQUFJLENBQUNDLEdBQUwsQ0FBU0osRUFBRSxDQUFDSyxDQUFaLENBQTNCOztBQUNBLGVBQUtJLElBQUwsQ0FBVUMsVUFBVixDQUFxQlIsR0FBckIsRUFBeUJLLE1BQXpCLEVBQWdDTixNQUFoQztBQUNILFNBSk0sTUFJQTtBQUNILGNBQU1DLElBQUUsR0FBR2hCLE1BQU0sR0FBR2lCLElBQUksQ0FBQ0MsR0FBTCxDQUFTLG1CQUFPSixFQUFFLENBQUNLLENBQVYsRUFBYUwsRUFBRSxDQUFDUSxDQUFoQixDQUFULENBQXBCOztBQUNBLGNBQU1ELE9BQUssR0FBR1QsTUFBTSxHQUFHLENBQVQsR0FBYUssSUFBSSxDQUFDQyxHQUFMLENBQVNKLEVBQUUsQ0FBQ00sQ0FBWixDQUEzQjs7QUFDQSxlQUFLRyxJQUFMLENBQVVDLFVBQVYsQ0FBcUJSLElBQXJCLEVBQXlCSyxPQUF6QixFQUFnQ04sTUFBaEM7QUFDSDs7QUFDRCxhQUFLVSx1QkFBTDtBQUNIOzs7O0lBckVpQ0Msb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW1tbyBmcm9tICcuLi9hbW1vLWluc3RhbnRpYXRlZCc7XHJcbmltcG9ydCB7IGFic01heCB9IGZyb20gXCIuLi8uLi8uLi9jb3JlXCI7XHJcbmltcG9ydCB7IEFtbW9TaGFwZSB9IGZyb20gXCIuL2FtbW8tc2hhcGVcIjtcclxuaW1wb3J0IHsgQ2Fwc3VsZUNvbGxpZGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IEFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMgfSBmcm9tICcuLi9hbW1vLWVudW0nO1xyXG5pbXBvcnQgeyBJQ2Fwc3VsZVNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtbW9DYXBzdWxlU2hhcGUgZXh0ZW5kcyBBbW1vU2hhcGUgaW1wbGVtZW50cyBJQ2Fwc3VsZVNoYXBlIHtcclxuXHJcbiAgICBzZXRDeWxpbmRlckhlaWdodCAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLnJhZGl1cyxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5jeWxpbmRlckhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGlyZWN0aW9uICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmN5bGluZGVySGVpZ2h0LFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmRpcmVjdGlvbixcclxuICAgICAgICAgICAgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFNjYWxlXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRSYWRpdXMgKHY6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllcyhcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5yYWRpdXMsXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIuY3lsaW5kZXJIZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIuZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICB0aGlzLl9jb2xsaWRlci5ub2RlLndvcmxkU2NhbGVcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYnRTaGFwZSBhcyBBbW1vLmJ0Q2Fwc3VsZVNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb2xsaWRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGVyIGFzIENhcHN1bGVDb2xsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcy5DQVBTVUxFX1NIQVBFX1BST1hZVFlQRSk7XHJcbiAgICAgICAgdGhpcy5fYnRTaGFwZSA9IG5ldyBBbW1vLmJ0Q2Fwc3VsZVNoYXBlKDAuNSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuICAgICAgICBzdXBlci5vbkxvYWQoKTtcclxuICAgICAgICB0aGlzLnNldFJhZGl1cyh0aGlzLmNvbGxpZGVyLnJhZGl1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2NhbGUgKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFNjYWxlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRSYWRpdXModGhpcy5jb2xsaWRlci5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVByb3BlcnRpZXMgKHJhZGl1czogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgZGlyZWN0aW9uOiBudW1iZXIsIHNjYWxlOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBjb25zdCB3cyA9IHNjYWxlO1xyXG4gICAgICAgIGNvbnN0IHVwQXhpcyA9IGRpcmVjdGlvbjtcclxuICAgICAgICBpZiAodXBBeGlzID09IDEpIHtcclxuICAgICAgICAgICAgY29uc3Qgd3IgPSByYWRpdXMgKiBNYXRoLmFicyhhYnNNYXgod3MueCwgd3MueikpO1xyXG4gICAgICAgICAgICBjb25zdCBoYWxmSCA9IGhlaWdodCAvIDIgKiBNYXRoLmFicyh3cy55KTtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnVwZGF0ZVByb3Aod3IsIGhhbGZILCB1cEF4aXMpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodXBBeGlzID09IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgd3IgPSByYWRpdXMgKiBNYXRoLmFicyhhYnNNYXgod3MueSwgd3MueikpO1xyXG4gICAgICAgICAgICBjb25zdCBoYWxmSCA9IGhlaWdodCAvIDIgKiBNYXRoLmFicyh3cy54KTtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnVwZGF0ZVByb3Aod3IsIGhhbGZILCB1cEF4aXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdyID0gcmFkaXVzICogTWF0aC5hYnMoYWJzTWF4KHdzLngsIHdzLnkpKTtcclxuICAgICAgICAgICAgY29uc3QgaGFsZkggPSBoZWlnaHQgLyAyICogTWF0aC5hYnMod3Mueik7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC51cGRhdGVQcm9wKHdyLCBoYWxmSCwgdXBBeGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb3VuZFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==