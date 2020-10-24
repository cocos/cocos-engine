(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-shape.js", "../ammo-enum.js", "../../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-shape.js"), require("../ammo-enum.js"), require("../../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoShape, global.ammoEnum, global.index);
    global.ammoConeShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _ammoEnum, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoConeShape = void 0;
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

  var AmmoConeShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoConeShape, _AmmoShape);

    _createClass(AmmoConeShape, [{
      key: "setHeight",
      value: function setHeight(v) {
        this.updateProperties(this.collider.radius, this.collider.height, this.collider.direction, this._collider.node.worldScale);
      }
    }, {
      key: "setDirection",
      value: function setDirection(v) {
        this.updateProperties(this.collider.radius, this.collider.height, this.collider.direction, this._collider.node.worldScale);
      }
    }, {
      key: "setRadius",
      value: function setRadius(v) {
        this.updateProperties(this.collider.radius, this.collider.height, this.collider.direction, this._collider.node.worldScale);
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

    function AmmoConeShape() {
      var _this;

      _classCallCheck(this, AmmoConeShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoConeShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.CONE_SHAPE_PROXYTYPE));
      _this._btShape = new _ammoInstantiated.default.btConeShape(0.5, 1);
      return _this;
    }

    _createClass(AmmoConeShape, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(AmmoConeShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoConeShape.prototype), "setScale", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "updateProperties",
      value: function updateProperties(radius, height, direction, scale) {
        var ws = scale;
        var upAxis = direction;

        if (upAxis == 1) {
          var wh = height * Math.abs(ws.y);
          var wr = radius * Math.abs((0, _index.absMax)(ws.x, ws.z));
          this.impl.setRadius(wr);
          this.impl.setHeight(wh);
        } else if (upAxis == 0) {
          var _wh = height * Math.abs(ws.x);

          var _wr = radius * Math.abs((0, _index.absMax)(ws.y, ws.z));

          this.impl.setRadius(_wr);
          this.impl.setHeight(_wh);
        } else {
          var _wh2 = height * Math.abs(ws.z);

          var _wr2 = radius * Math.abs((0, _index.absMax)(ws.x, ws.y));

          this.impl.setRadius(_wr2);
          this.impl.setHeight(_wh2);
        }

        this.impl.setConeUpIndex(upAxis);
        this.scale.setValue(1, 1, 1);
        this.impl.setLocalScaling(this.scale);
        this.updateCompoundTransform();
      }
    }]);

    return AmmoConeShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoConeShape = AmmoConeShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1jb25lLXNoYXBlLnRzIl0sIm5hbWVzIjpbIkFtbW9Db25lU2hhcGUiLCJ2IiwidXBkYXRlUHJvcGVydGllcyIsImNvbGxpZGVyIiwicmFkaXVzIiwiaGVpZ2h0IiwiZGlyZWN0aW9uIiwiX2NvbGxpZGVyIiwibm9kZSIsIndvcmxkU2NhbGUiLCJfYnRTaGFwZSIsIkFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMiLCJDT05FX1NIQVBFX1BST1hZVFlQRSIsIkFtbW8iLCJidENvbmVTaGFwZSIsInNldFJhZGl1cyIsInNjYWxlIiwid3MiLCJ1cEF4aXMiLCJ3aCIsIk1hdGgiLCJhYnMiLCJ5Iiwid3IiLCJ4IiwieiIsImltcGwiLCJzZXRIZWlnaHQiLCJzZXRDb25lVXBJbmRleCIsInNldFZhbHVlIiwic2V0TG9jYWxTY2FsaW5nIiwidXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0iLCJBbW1vU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVFhQSxhOzs7OztnQ0FFRUMsQyxFQUFXO0FBQ2xCLGFBQUtDLGdCQUFMLENBQ0ksS0FBS0MsUUFBTCxDQUFjQyxNQURsQixFQUVJLEtBQUtELFFBQUwsQ0FBY0UsTUFGbEIsRUFHSSxLQUFLRixRQUFMLENBQWNHLFNBSGxCLEVBSUksS0FBS0MsU0FBTCxDQUFlQyxJQUFmLENBQW9CQyxVQUp4QjtBQU1IOzs7bUNBRWFSLEMsRUFBVztBQUNyQixhQUFLQyxnQkFBTCxDQUNJLEtBQUtDLFFBQUwsQ0FBY0MsTUFEbEIsRUFFSSxLQUFLRCxRQUFMLENBQWNFLE1BRmxCLEVBR0ksS0FBS0YsUUFBTCxDQUFjRyxTQUhsQixFQUlJLEtBQUtDLFNBQUwsQ0FBZUMsSUFBZixDQUFvQkMsVUFKeEI7QUFNSDs7O2dDQUVVUixDLEVBQVc7QUFDbEIsYUFBS0MsZ0JBQUwsQ0FDSSxLQUFLQyxRQUFMLENBQWNDLE1BRGxCLEVBRUksS0FBS0QsUUFBTCxDQUFjRSxNQUZsQixFQUdJLEtBQUtGLFFBQUwsQ0FBY0csU0FIbEIsRUFJSSxLQUFLQyxTQUFMLENBQWVDLElBQWYsQ0FBb0JDLFVBSnhCO0FBTUg7OzswQkFFVztBQUNSLGVBQU8sS0FBS0MsUUFBWjtBQUNIOzs7MEJBRWU7QUFDWixlQUFPLEtBQUtILFNBQVo7QUFDSDs7O0FBRUQsNkJBQWU7QUFBQTs7QUFBQTs7QUFDWCx5RkFBTUksb0NBQTBCQyxvQkFBaEM7QUFDQSxZQUFLRixRQUFMLEdBQWdCLElBQUlHLDBCQUFLQyxXQUFULENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQWhCO0FBRlc7QUFHZDs7OzsrQkFFUztBQUNOOztBQUNBLGFBQUtDLFNBQUwsQ0FBZSxLQUFLWixRQUFMLENBQWNDLE1BQTdCO0FBQ0g7OztpQ0FFVztBQUNSOztBQUNBLGFBQUtXLFNBQUwsQ0FBZSxLQUFLWixRQUFMLENBQWNDLE1BQTdCO0FBQ0g7Ozt1Q0FFaUJBLE0sRUFBZ0JDLE0sRUFBZ0JDLFMsRUFBbUJVLEssRUFBa0I7QUFDbkYsWUFBTUMsRUFBRSxHQUFHRCxLQUFYO0FBQ0EsWUFBTUUsTUFBTSxHQUFHWixTQUFmOztBQUNBLFlBQUlZLE1BQU0sSUFBSSxDQUFkLEVBQWlCO0FBQ2IsY0FBTUMsRUFBRSxHQUFHZCxNQUFNLEdBQUdlLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixFQUFFLENBQUNLLENBQVosQ0FBcEI7QUFDQSxjQUFNQyxFQUFFLEdBQUduQixNQUFNLEdBQUdnQixJQUFJLENBQUNDLEdBQUwsQ0FBUyxtQkFBT0osRUFBRSxDQUFDTyxDQUFWLEVBQWFQLEVBQUUsQ0FBQ1EsQ0FBaEIsQ0FBVCxDQUFwQjtBQUNBLGVBQUtDLElBQUwsQ0FBVVgsU0FBVixDQUFvQlEsRUFBcEI7QUFDQSxlQUFLRyxJQUFMLENBQVVDLFNBQVYsQ0FBb0JSLEVBQXBCO0FBQ0gsU0FMRCxNQUtPLElBQUlELE1BQU0sSUFBSSxDQUFkLEVBQWlCO0FBQ3BCLGNBQU1DLEdBQUUsR0FBR2QsTUFBTSxHQUFHZSxJQUFJLENBQUNDLEdBQUwsQ0FBU0osRUFBRSxDQUFDTyxDQUFaLENBQXBCOztBQUNBLGNBQU1ELEdBQUUsR0FBR25CLE1BQU0sR0FBR2dCLElBQUksQ0FBQ0MsR0FBTCxDQUFTLG1CQUFPSixFQUFFLENBQUNLLENBQVYsRUFBYUwsRUFBRSxDQUFDUSxDQUFoQixDQUFULENBQXBCOztBQUNBLGVBQUtDLElBQUwsQ0FBVVgsU0FBVixDQUFvQlEsR0FBcEI7QUFDQSxlQUFLRyxJQUFMLENBQVVDLFNBQVYsQ0FBb0JSLEdBQXBCO0FBQ0gsU0FMTSxNQUtBO0FBQ0gsY0FBTUEsSUFBRSxHQUFHZCxNQUFNLEdBQUdlLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixFQUFFLENBQUNRLENBQVosQ0FBcEI7O0FBQ0EsY0FBTUYsSUFBRSxHQUFHbkIsTUFBTSxHQUFHZ0IsSUFBSSxDQUFDQyxHQUFMLENBQVMsbUJBQU9KLEVBQUUsQ0FBQ08sQ0FBVixFQUFhUCxFQUFFLENBQUNLLENBQWhCLENBQVQsQ0FBcEI7O0FBQ0EsZUFBS0ksSUFBTCxDQUFVWCxTQUFWLENBQW9CUSxJQUFwQjtBQUNBLGVBQUtHLElBQUwsQ0FBVUMsU0FBVixDQUFvQlIsSUFBcEI7QUFDSDs7QUFDRCxhQUFLTyxJQUFMLENBQVVFLGNBQVYsQ0FBeUJWLE1BQXpCO0FBQ0EsYUFBS0YsS0FBTCxDQUFXYSxRQUFYLENBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLENBQTFCO0FBQ0EsYUFBS0gsSUFBTCxDQUFVSSxlQUFWLENBQTBCLEtBQUtkLEtBQS9CO0FBQ0EsYUFBS2UsdUJBQUw7QUFDSDs7OztJQTNFOEJDLG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFtbW8gZnJvbSAnLi4vYW1tby1pbnN0YW50aWF0ZWQnO1xyXG5pbXBvcnQgeyBBbW1vU2hhcGUgfSBmcm9tIFwiLi9hbW1vLXNoYXBlXCI7XHJcbmltcG9ydCB7IENvbmVDb2xsaWRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzIH0gZnJvbSAnLi4vYW1tby1lbnVtJztcclxuaW1wb3J0IHsgSUN5bGluZGVyU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IGFic01heCB9IGZyb20gJy4uLy4uLy4uL2NvcmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtbW9Db25lU2hhcGUgZXh0ZW5kcyBBbW1vU2hhcGUgaW1wbGVtZW50cyBJQ3lsaW5kZXJTaGFwZSB7XHJcblxyXG4gICAgc2V0SGVpZ2h0ICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGlyZWN0aW9uICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UmFkaXVzICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGltcGwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9idFNoYXBlIGFzIEFtbW8uYnRDb25lU2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpZGVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIgYXMgQ29uZUNvbGxpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzLkNPTkVfU0hBUEVfUFJPWFlUWVBFKTtcclxuICAgICAgICB0aGlzLl9idFNoYXBlID0gbmV3IEFtbW8uYnRDb25lU2hhcGUoMC41LCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UmFkaXVzKHRoaXMuY29sbGlkZXIucmFkaXVzKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0U2NhbGUoKTtcclxuICAgICAgICB0aGlzLnNldFJhZGl1cyh0aGlzLmNvbGxpZGVyLnJhZGl1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUHJvcGVydGllcyAocmFkaXVzOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkaXJlY3Rpb246IG51bWJlciwgc2NhbGU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHdzID0gc2NhbGU7XHJcbiAgICAgICAgY29uc3QgdXBBeGlzID0gZGlyZWN0aW9uO1xyXG4gICAgICAgIGlmICh1cEF4aXMgPT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCB3aCA9IGhlaWdodCAqIE1hdGguYWJzKHdzLnkpO1xyXG4gICAgICAgICAgICBjb25zdCB3ciA9IHJhZGl1cyAqIE1hdGguYWJzKGFic01heCh3cy54LCB3cy56KSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC5zZXRSYWRpdXMod3IpO1xyXG4gICAgICAgICAgICB0aGlzLmltcGwuc2V0SGVpZ2h0KHdoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHVwQXhpcyA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoID0gaGVpZ2h0ICogTWF0aC5hYnMod3MueCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHdyID0gcmFkaXVzICogTWF0aC5hYnMoYWJzTWF4KHdzLnksIHdzLnopKTtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnNldFJhZGl1cyh3cik7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC5zZXRIZWlnaHQod2gpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdoID0gaGVpZ2h0ICogTWF0aC5hYnMod3Mueik7XHJcbiAgICAgICAgICAgIGNvbnN0IHdyID0gcmFkaXVzICogTWF0aC5hYnMoYWJzTWF4KHdzLngsIHdzLnkpKTtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnNldFJhZGl1cyh3cik7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC5zZXRIZWlnaHQod2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltcGwuc2V0Q29uZVVwSW5kZXgodXBBeGlzKTtcclxuICAgICAgICB0aGlzLnNjYWxlLnNldFZhbHVlKDEsIDEsIDEpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5zZXRMb2NhbFNjYWxpbmcodGhpcy5zY2FsZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDb21wb3VuZFRyYW5zZm9ybSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=