(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-shape.js", "../ammo-enum.js", "../../../core/index.js", "../ammo-util.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-shape.js"), require("../ammo-enum.js"), require("../../../core/index.js"), require("../ammo-util.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoShape, global.ammoEnum, global.index, global.ammoUtil);
    global.ammoCylinderShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoShape, _ammoEnum, _index, _ammoUtil) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoCylinderShape = void 0;
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

  var AmmoCylinderShape = /*#__PURE__*/function (_AmmoShape) {
    _inherits(AmmoCylinderShape, _AmmoShape);

    _createClass(AmmoCylinderShape, [{
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

    function AmmoCylinderShape() {
      var _this;

      _classCallCheck(this, AmmoCylinderShape);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AmmoCylinderShape).call(this, _ammoEnum.AmmoBroadphaseNativeTypes.CYLINDER_SHAPE_PROXYTYPE));
      _this.halfExtents = void 0;
      _this.halfExtents = new _ammoInstantiated.default.btVector3(0.5, 1, 0.5);
      _this._btShape = new _ammoInstantiated.default.btCylinderShape(_this.halfExtents);
      return _this;
    }

    _createClass(AmmoCylinderShape, [{
      key: "onLoad",
      value: function onLoad() {
        _get(_getPrototypeOf(AmmoCylinderShape.prototype), "onLoad", this).call(this);

        this.setRadius(this.collider.radius);
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _ammoInstantiated.default.destroy(this.halfExtents);

        (0, _ammoUtil.ammoDeletePtr)(this.halfExtents, _ammoInstantiated.default.btVector3);

        _get(_getPrototypeOf(AmmoCylinderShape.prototype), "onDestroy", this).call(this);
      }
    }, {
      key: "setScale",
      value: function setScale() {
        _get(_getPrototypeOf(AmmoCylinderShape.prototype), "setScale", this).call(this);

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
          var halfH = wh / 2;
          this.impl.updateProp(wr, halfH, upAxis);
        } else if (upAxis == 0) {
          var _wh = height * Math.abs(ws.x);

          var _wr = radius * Math.abs((0, _index.absMax)(ws.y, ws.z));

          var _halfH = _wh / 2;

          this.impl.updateProp(_wr, _halfH, upAxis);
        } else {
          var _wh2 = height * Math.abs(ws.z);

          var _wr2 = radius * Math.abs((0, _index.absMax)(ws.x, ws.y));

          var _halfH2 = _wh2 / 2;

          this.impl.updateProp(_wr2, _halfH2, upAxis);
        }

        this.updateCompoundTransform();
      }
    }]);

    return AmmoCylinderShape;
  }(_ammoShape.AmmoShape);

  _exports.AmmoCylinderShape = AmmoCylinderShape;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1jeWxpbmRlci1zaGFwZS50cyJdLCJuYW1lcyI6WyJBbW1vQ3lsaW5kZXJTaGFwZSIsInYiLCJ1cGRhdGVQcm9wZXJ0aWVzIiwiY29sbGlkZXIiLCJyYWRpdXMiLCJoZWlnaHQiLCJkaXJlY3Rpb24iLCJfY29sbGlkZXIiLCJub2RlIiwid29ybGRTY2FsZSIsIl9idFNoYXBlIiwiQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyIsIkNZTElOREVSX1NIQVBFX1BST1hZVFlQRSIsImhhbGZFeHRlbnRzIiwiQW1tbyIsImJ0VmVjdG9yMyIsImJ0Q3lsaW5kZXJTaGFwZSIsInNldFJhZGl1cyIsImRlc3Ryb3kiLCJzY2FsZSIsIndzIiwidXBBeGlzIiwid2giLCJNYXRoIiwiYWJzIiwieSIsIndyIiwieCIsInoiLCJoYWxmSCIsImltcGwiLCJ1cGRhdGVQcm9wIiwidXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0iLCJBbW1vU2hhcGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNhQSxpQjs7Ozs7Z0NBRUVDLEMsRUFBVztBQUNsQixhQUFLQyxnQkFBTCxDQUNJLEtBQUtDLFFBQUwsQ0FBY0MsTUFEbEIsRUFFSSxLQUFLRCxRQUFMLENBQWNFLE1BRmxCLEVBR0ksS0FBS0YsUUFBTCxDQUFjRyxTQUhsQixFQUlJLEtBQUtDLFNBQUwsQ0FBZUMsSUFBZixDQUFvQkMsVUFKeEI7QUFNSDs7O21DQUVhUixDLEVBQVc7QUFDckIsYUFBS0MsZ0JBQUwsQ0FDSSxLQUFLQyxRQUFMLENBQWNDLE1BRGxCLEVBRUksS0FBS0QsUUFBTCxDQUFjRSxNQUZsQixFQUdJLEtBQUtGLFFBQUwsQ0FBY0csU0FIbEIsRUFJSSxLQUFLQyxTQUFMLENBQWVDLElBQWYsQ0FBb0JDLFVBSnhCO0FBTUg7OztnQ0FFVVIsQyxFQUFXO0FBQ2xCLGFBQUtDLGdCQUFMLENBQ0ksS0FBS0MsUUFBTCxDQUFjQyxNQURsQixFQUVJLEtBQUtELFFBQUwsQ0FBY0UsTUFGbEIsRUFHSSxLQUFLRixRQUFMLENBQWNHLFNBSGxCLEVBSUksS0FBS0MsU0FBTCxDQUFlQyxJQUFmLENBQW9CQyxVQUp4QjtBQU1IOzs7MEJBRVc7QUFDUixlQUFPLEtBQUtDLFFBQVo7QUFDSDs7OzBCQUVlO0FBQ1osZUFBTyxLQUFLSCxTQUFaO0FBQ0g7OztBQUlELGlDQUFlO0FBQUE7O0FBQUE7O0FBQ1gsNkZBQU1JLG9DQUEwQkMsd0JBQWhDO0FBRFcsWUFGTkMsV0FFTTtBQUVYLFlBQUtBLFdBQUwsR0FBbUIsSUFBSUMsMEJBQUtDLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsR0FBM0IsQ0FBbkI7QUFDQSxZQUFLTCxRQUFMLEdBQWdCLElBQUlJLDBCQUFLRSxlQUFULENBQXlCLE1BQUtILFdBQTlCLENBQWhCO0FBSFc7QUFJZDs7OzsrQkFFUztBQUNOOztBQUNBLGFBQUtJLFNBQUwsQ0FBZSxLQUFLZCxRQUFMLENBQWNDLE1BQTdCO0FBQ0g7OztrQ0FFWTtBQUNUVSxrQ0FBS0ksT0FBTCxDQUFhLEtBQUtMLFdBQWxCOztBQUNBLHFDQUFjLEtBQUtBLFdBQW5CLEVBQWdDQywwQkFBS0MsU0FBckM7O0FBQ0E7QUFDSDs7O2lDQUVXO0FBQ1I7O0FBQ0EsYUFBS0UsU0FBTCxDQUFlLEtBQUtkLFFBQUwsQ0FBY0MsTUFBN0I7QUFDSDs7O3VDQUVpQkEsTSxFQUFnQkMsTSxFQUFnQkMsUyxFQUFtQmEsSyxFQUFrQjtBQUNuRixZQUFNQyxFQUFFLEdBQUdELEtBQVg7QUFDQSxZQUFNRSxNQUFNLEdBQUdmLFNBQWY7O0FBQ0EsWUFBSWUsTUFBTSxJQUFJLENBQWQsRUFBaUI7QUFDYixjQUFNQyxFQUFFLEdBQUdqQixNQUFNLEdBQUdrQixJQUFJLENBQUNDLEdBQUwsQ0FBU0osRUFBRSxDQUFDSyxDQUFaLENBQXBCO0FBQ0EsY0FBTUMsRUFBRSxHQUFHdEIsTUFBTSxHQUFHbUIsSUFBSSxDQUFDQyxHQUFMLENBQVMsbUJBQU9KLEVBQUUsQ0FBQ08sQ0FBVixFQUFhUCxFQUFFLENBQUNRLENBQWhCLENBQVQsQ0FBcEI7QUFDQSxjQUFNQyxLQUFLLEdBQUdQLEVBQUUsR0FBRyxDQUFuQjtBQUNBLGVBQUtRLElBQUwsQ0FBVUMsVUFBVixDQUFxQkwsRUFBckIsRUFBeUJHLEtBQXpCLEVBQWdDUixNQUFoQztBQUNILFNBTEQsTUFLTyxJQUFJQSxNQUFNLElBQUksQ0FBZCxFQUFpQjtBQUNwQixjQUFNQyxHQUFFLEdBQUdqQixNQUFNLEdBQUdrQixJQUFJLENBQUNDLEdBQUwsQ0FBU0osRUFBRSxDQUFDTyxDQUFaLENBQXBCOztBQUNBLGNBQU1ELEdBQUUsR0FBR3RCLE1BQU0sR0FBR21CLElBQUksQ0FBQ0MsR0FBTCxDQUFTLG1CQUFPSixFQUFFLENBQUNLLENBQVYsRUFBYUwsRUFBRSxDQUFDUSxDQUFoQixDQUFULENBQXBCOztBQUNBLGNBQU1DLE1BQUssR0FBR1AsR0FBRSxHQUFHLENBQW5COztBQUNBLGVBQUtRLElBQUwsQ0FBVUMsVUFBVixDQUFxQkwsR0FBckIsRUFBeUJHLE1BQXpCLEVBQWdDUixNQUFoQztBQUNILFNBTE0sTUFLQTtBQUNILGNBQU1DLElBQUUsR0FBR2pCLE1BQU0sR0FBR2tCLElBQUksQ0FBQ0MsR0FBTCxDQUFTSixFQUFFLENBQUNRLENBQVosQ0FBcEI7O0FBQ0EsY0FBTUYsSUFBRSxHQUFHdEIsTUFBTSxHQUFHbUIsSUFBSSxDQUFDQyxHQUFMLENBQVMsbUJBQU9KLEVBQUUsQ0FBQ08sQ0FBVixFQUFhUCxFQUFFLENBQUNLLENBQWhCLENBQVQsQ0FBcEI7O0FBQ0EsY0FBTUksT0FBSyxHQUFHUCxJQUFFLEdBQUcsQ0FBbkI7O0FBQ0EsZUFBS1EsSUFBTCxDQUFVQyxVQUFWLENBQXFCTCxJQUFyQixFQUF5QkcsT0FBekIsRUFBZ0NSLE1BQWhDO0FBQ0g7O0FBQ0QsYUFBS1csdUJBQUw7QUFDSDs7OztJQWpGa0NDLG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFtbW8gZnJvbSAnLi4vYW1tby1pbnN0YW50aWF0ZWQnO1xyXG5pbXBvcnQgeyBBbW1vU2hhcGUgfSBmcm9tIFwiLi9hbW1vLXNoYXBlXCI7XHJcbmltcG9ydCB7IEN5bGluZGVyQ29sbGlkZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9leHBvcnRzL3BoeXNpY3MtZnJhbWV3b3JrJztcclxuaW1wb3J0IHsgQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcyB9IGZyb20gJy4uL2FtbW8tZW51bSc7XHJcbmltcG9ydCB7IElDeWxpbmRlclNoYXBlIH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBhYnNNYXggfSBmcm9tICcuLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgYW1tb0RlbGV0ZVB0ciB9IGZyb20gJy4uL2FtbW8tdXRpbCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQW1tb0N5bGluZGVyU2hhcGUgZXh0ZW5kcyBBbW1vU2hhcGUgaW1wbGVtZW50cyBJQ3lsaW5kZXJTaGFwZSB7XHJcblxyXG4gICAgc2V0SGVpZ2h0ICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGlyZWN0aW9uICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UmFkaXVzICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoXHJcbiAgICAgICAgICAgIHRoaXMuY29sbGlkZXIucmFkaXVzLFxyXG4gICAgICAgICAgICB0aGlzLmNvbGxpZGVyLmhlaWdodCxcclxuICAgICAgICAgICAgdGhpcy5jb2xsaWRlci5kaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGltcGwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9idFNoYXBlIGFzIEFtbW8uYnRDeWxpbmRlclNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb2xsaWRlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbGxpZGVyIGFzIEN5bGluZGVyQ29sbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgaGFsZkV4dGVudHM6IEFtbW8uYnRWZWN0b3IzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzLkNZTElOREVSX1NIQVBFX1BST1hZVFlQRSk7XHJcbiAgICAgICAgdGhpcy5oYWxmRXh0ZW50cyA9IG5ldyBBbW1vLmJ0VmVjdG9yMygwLjUsIDEsIDAuNSk7XHJcbiAgICAgICAgdGhpcy5fYnRTaGFwZSA9IG5ldyBBbW1vLmJ0Q3lsaW5kZXJTaGFwZSh0aGlzLmhhbGZFeHRlbnRzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMuc2V0UmFkaXVzKHRoaXMuY29sbGlkZXIucmFkaXVzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIEFtbW8uZGVzdHJveSh0aGlzLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICBhbW1vRGVsZXRlUHRyKHRoaXMuaGFsZkV4dGVudHMsIEFtbW8uYnRWZWN0b3IzKTtcclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTY2FsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0U2NhbGUoKTtcclxuICAgICAgICB0aGlzLnNldFJhZGl1cyh0aGlzLmNvbGxpZGVyLnJhZGl1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUHJvcGVydGllcyAocmFkaXVzOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkaXJlY3Rpb246IG51bWJlciwgc2NhbGU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHdzID0gc2NhbGU7XHJcbiAgICAgICAgY29uc3QgdXBBeGlzID0gZGlyZWN0aW9uO1xyXG4gICAgICAgIGlmICh1cEF4aXMgPT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCB3aCA9IGhlaWdodCAqIE1hdGguYWJzKHdzLnkpO1xyXG4gICAgICAgICAgICBjb25zdCB3ciA9IHJhZGl1cyAqIE1hdGguYWJzKGFic01heCh3cy54LCB3cy56KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbGZIID0gd2ggLyAyO1xyXG4gICAgICAgICAgICB0aGlzLmltcGwudXBkYXRlUHJvcCh3ciwgaGFsZkgsIHVwQXhpcyk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh1cEF4aXMgPT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCB3aCA9IGhlaWdodCAqIE1hdGguYWJzKHdzLngpO1xyXG4gICAgICAgICAgICBjb25zdCB3ciA9IHJhZGl1cyAqIE1hdGguYWJzKGFic01heCh3cy55LCB3cy56KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbGZIID0gd2ggLyAyO1xyXG4gICAgICAgICAgICB0aGlzLmltcGwudXBkYXRlUHJvcCh3ciwgaGFsZkgsIHVwQXhpcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgd2ggPSBoZWlnaHQgKiBNYXRoLmFicyh3cy56KTtcclxuICAgICAgICAgICAgY29uc3Qgd3IgPSByYWRpdXMgKiBNYXRoLmFicyhhYnNNYXgod3MueCwgd3MueSkpO1xyXG4gICAgICAgICAgICBjb25zdCBoYWxmSCA9IHdoIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnVwZGF0ZVByb3Aod3IsIGhhbGZILCB1cEF4aXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbXBvdW5kVHJhbnNmb3JtKCk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==