(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "./ammo-constraint.js", "../../../core/index.js", "../ammo-util.js", "../ammo-const.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("./ammo-constraint.js"), require("../../../core/index.js"), require("../ammo-util.js"), require("../ammo-const.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.ammoConstraint, global.index, global.ammoUtil, global.ammoConst);
    global.ammoPointToPointConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoConstraint, _index, _ammoUtil, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoPointToPointConstraint = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var AmmoPointToPointConstraint = /*#__PURE__*/function (_AmmoConstraint) {
    _inherits(AmmoPointToPointConstraint, _AmmoConstraint);

    function AmmoPointToPointConstraint() {
      _classCallCheck(this, AmmoPointToPointConstraint);

      return _possibleConstructorReturn(this, _getPrototypeOf(AmmoPointToPointConstraint).apply(this, arguments));
    }

    _createClass(AmmoPointToPointConstraint, [{
      key: "setPivotA",
      value: function setPivotA(v) {
        if (this._pivotA) {
          _index.Vec3.multiply(_ammoConst.CC_V3_0, v, this._com.node.worldScale);

          (0, _ammoUtil.cocos2AmmoVec3)(this._pivotA, _ammoConst.CC_V3_0);
          this.impl.setPivotA(this._pivotA);
        }
      }
    }, {
      key: "setPivotB",
      value: function setPivotB(v) {
        _index.Vec3.copy(_ammoConst.CC_V3_0, v);

        var cb = this._com.connectedBody;

        if (cb) {
          _index.Vec3.multiply(_ammoConst.CC_V3_0, v, cb.node.worldScale);
        } else {
          _index.Vec3.add(_ammoConst.CC_V3_0, _ammoConst.CC_V3_0, this._com.node.worldPosition);

          _index.Vec3.multiply(_ammoConst.CC_V3_1, this.constraint.pivotA, this._com.node.worldScale);

          _index.Vec3.add(_ammoConst.CC_V3_0, _ammoConst.CC_V3_0, _ammoConst.CC_V3_1);
        }

        (0, _ammoUtil.cocos2AmmoVec3)(this._pivotB, _ammoConst.CC_V3_0);
        this.impl.setPivotB(this._pivotB);
      }
    }, {
      key: "onComponentSet",
      value: function onComponentSet() {
        if (this._rigidBody) {
          var bodyA = this._rigidBody.body.impl;
          var cb = this.constraint.connectedBody;
          var bodyB;

          if (cb) {
            bodyB = cb.body.impl;
          }

          this._pivotA = new _ammoInstantiated.default.btVector3();
          this._pivotB = new _ammoInstantiated.default.btVector3();

          if (bodyB) {
            this._impl = new _ammoInstantiated.default.btPoint2PointConstraint(bodyA, bodyB, this._pivotA, this._pivotB);
          } else {
            this._impl = new _ammoInstantiated.default.btPoint2PointConstraint(bodyA, this._pivotA);
          }

          this.setPivotA(this.constraint.pivotA);
          this.setPivotB(this.constraint.pivotB);
        }
      }
    }, {
      key: "impl",
      get: function get() {
        return this._impl;
      }
    }, {
      key: "constraint",
      get: function get() {
        return this._com;
      }
    }]);

    return AmmoPointToPointConstraint;
  }(_ammoConstraint.AmmoConstraint);

  _exports.AmmoPointToPointConstraint = AmmoPointToPointConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9jb25zdHJhaW50cy9hbW1vLXBvaW50LXRvLXBvaW50LWNvbnN0cmFpbnQudHMiXSwibmFtZXMiOlsiQW1tb1BvaW50VG9Qb2ludENvbnN0cmFpbnQiLCJ2IiwiX3Bpdm90QSIsIlZlYzMiLCJtdWx0aXBseSIsIkNDX1YzXzAiLCJfY29tIiwibm9kZSIsIndvcmxkU2NhbGUiLCJpbXBsIiwic2V0UGl2b3RBIiwiY29weSIsImNiIiwiY29ubmVjdGVkQm9keSIsImFkZCIsIndvcmxkUG9zaXRpb24iLCJDQ19WM18xIiwiY29uc3RyYWludCIsInBpdm90QSIsIl9waXZvdEIiLCJzZXRQaXZvdEIiLCJfcmlnaWRCb2R5IiwiYm9keUEiLCJib2R5IiwiYm9keUIiLCJBbW1vIiwiYnRWZWN0b3IzIiwiX2ltcGwiLCJidFBvaW50MlBvaW50Q29uc3RyYWludCIsInBpdm90QiIsIkFtbW9Db25zdHJhaW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNhQSwwQjs7Ozs7Ozs7Ozs7Z0NBRUVDLEMsRUFBb0I7QUFDM0IsWUFBSSxLQUFLQyxPQUFULEVBQWtCO0FBQ2RDLHNCQUFLQyxRQUFMLENBQWNDLGtCQUFkLEVBQXVCSixDQUF2QixFQUEwQixLQUFLSyxJQUFMLENBQVVDLElBQVYsQ0FBZUMsVUFBekM7O0FBQ0Esd0NBQWUsS0FBS04sT0FBcEIsRUFBNkJHLGtCQUE3QjtBQUNBLGVBQUtJLElBQUwsQ0FBVUMsU0FBVixDQUFvQixLQUFLUixPQUF6QjtBQUNIO0FBQ0o7OztnQ0FFVUQsQyxFQUFvQjtBQUMzQkUsb0JBQUtRLElBQUwsQ0FBVU4sa0JBQVYsRUFBbUJKLENBQW5COztBQUNBLFlBQU1XLEVBQUUsR0FBRyxLQUFLTixJQUFMLENBQVVPLGFBQXJCOztBQUNBLFlBQUlELEVBQUosRUFBUTtBQUNKVCxzQkFBS0MsUUFBTCxDQUFjQyxrQkFBZCxFQUF1QkosQ0FBdkIsRUFBMEJXLEVBQUUsQ0FBQ0wsSUFBSCxDQUFRQyxVQUFsQztBQUNILFNBRkQsTUFFTztBQUNITCxzQkFBS1csR0FBTCxDQUFTVCxrQkFBVCxFQUFrQkEsa0JBQWxCLEVBQTJCLEtBQUtDLElBQUwsQ0FBVUMsSUFBVixDQUFlUSxhQUExQzs7QUFDQVosc0JBQUtDLFFBQUwsQ0FBY1ksa0JBQWQsRUFBdUIsS0FBS0MsVUFBTCxDQUFnQkMsTUFBdkMsRUFBK0MsS0FBS1osSUFBTCxDQUFVQyxJQUFWLENBQWVDLFVBQTlEOztBQUNBTCxzQkFBS1csR0FBTCxDQUFTVCxrQkFBVCxFQUFrQkEsa0JBQWxCLEVBQTJCVyxrQkFBM0I7QUFDSDs7QUFDRCxzQ0FBZSxLQUFLRyxPQUFwQixFQUE2QmQsa0JBQTdCO0FBQ0EsYUFBS0ksSUFBTCxDQUFVVyxTQUFWLENBQW9CLEtBQUtELE9BQXpCO0FBQ0g7Ozt1Q0FhaUI7QUFDZCxZQUFJLEtBQUtFLFVBQVQsRUFBcUI7QUFDakIsY0FBTUMsS0FBSyxHQUFJLEtBQUtELFVBQUwsQ0FBZ0JFLElBQWpCLENBQXdDZCxJQUF0RDtBQUNBLGNBQU1HLEVBQUUsR0FBRyxLQUFLSyxVQUFMLENBQWdCSixhQUEzQjtBQUNBLGNBQUlXLEtBQUo7O0FBQ0EsY0FBSVosRUFBSixFQUFRO0FBQ0pZLFlBQUFBLEtBQUssR0FBSVosRUFBRSxDQUFDVyxJQUFKLENBQTJCZCxJQUFuQztBQUNIOztBQUNELGVBQUtQLE9BQUwsR0FBZSxJQUFJdUIsMEJBQUtDLFNBQVQsRUFBZjtBQUNBLGVBQUtQLE9BQUwsR0FBZSxJQUFJTSwwQkFBS0MsU0FBVCxFQUFmOztBQUNBLGNBQUlGLEtBQUosRUFBVztBQUNQLGlCQUFLRyxLQUFMLEdBQWEsSUFBSUYsMEJBQUtHLHVCQUFULENBQWlDTixLQUFqQyxFQUF3Q0UsS0FBeEMsRUFBK0MsS0FBS3RCLE9BQXBELEVBQTZELEtBQUtpQixPQUFsRSxDQUFiO0FBQ0gsV0FGRCxNQUVPO0FBQ0gsaUJBQUtRLEtBQUwsR0FBYSxJQUFJRiwwQkFBS0csdUJBQVQsQ0FBaUNOLEtBQWpDLEVBQXdDLEtBQUtwQixPQUE3QyxDQUFiO0FBQ0g7O0FBQ0QsZUFBS1EsU0FBTCxDQUFlLEtBQUtPLFVBQUwsQ0FBZ0JDLE1BQS9CO0FBQ0EsZUFBS0UsU0FBTCxDQUFlLEtBQUtILFVBQUwsQ0FBZ0JZLE1BQS9CO0FBQ0g7QUFDSjs7OzBCQTdCeUM7QUFDdEMsZUFBTyxLQUFLRixLQUFaO0FBQ0g7OzswQkFFeUM7QUFDdEMsZUFBTyxLQUFLckIsSUFBWjtBQUNIOzs7O0lBOUIyQ3dCLDhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFtbW8gZnJvbSAnLi4vYW1tby1pbnN0YW50aWF0ZWQnO1xyXG5pbXBvcnQgeyBBbW1vQ29uc3RyYWludCB9IGZyb20gXCIuL2FtbW8tY29uc3RyYWludFwiO1xyXG5pbXBvcnQgeyBJUG9pbnRUb1BvaW50Q29uc3RyYWludCB9IGZyb20gXCIuLi8uLi9zcGVjL2ktcGh5c2ljcy1jb25zdHJhaW50XCI7XHJcbmltcG9ydCB7IElWZWMzTGlrZSwgVmVjMyB9IGZyb20gXCIuLi8uLi8uLi9jb3JlXCI7XHJcbmltcG9ydCB7IFBvaW50VG9Qb2ludENvbnN0cmFpbnQgfSBmcm9tIFwiLi4vLi4vZnJhbWV3b3JrXCI7XHJcbmltcG9ydCB7IEFtbW9SaWdpZEJvZHkgfSBmcm9tIFwiLi4vYW1tby1yaWdpZC1ib2R5XCI7XHJcbmltcG9ydCB7IGNvY29zMkFtbW9WZWMzIH0gZnJvbSBcIi4uL2FtbW8tdXRpbFwiO1xyXG5pbXBvcnQgeyBDQ19WM18wLCBDQ19WM18xIH0gZnJvbSAnLi4vYW1tby1jb25zdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgQW1tb1BvaW50VG9Qb2ludENvbnN0cmFpbnQgZXh0ZW5kcyBBbW1vQ29uc3RyYWludCBpbXBsZW1lbnRzIElQb2ludFRvUG9pbnRDb25zdHJhaW50IHtcclxuXHJcbiAgICBzZXRQaXZvdEEgKHY6IElWZWMzTGlrZSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9waXZvdEEpIHtcclxuICAgICAgICAgICAgVmVjMy5tdWx0aXBseShDQ19WM18wLCB2LCB0aGlzLl9jb20ubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5fcGl2b3RBLCBDQ19WM18wKTtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnNldFBpdm90QSh0aGlzLl9waXZvdEEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRQaXZvdEIgKHY6IElWZWMzTGlrZSk6IHZvaWQge1xyXG4gICAgICAgIFZlYzMuY29weShDQ19WM18wLCB2KTtcclxuICAgICAgICBjb25zdCBjYiA9IHRoaXMuX2NvbS5jb25uZWN0ZWRCb2R5O1xyXG4gICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgICBWZWMzLm11bHRpcGx5KENDX1YzXzAsIHYsIGNiLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVmVjMy5hZGQoQ0NfVjNfMCwgQ0NfVjNfMCwgdGhpcy5fY29tLm5vZGUud29ybGRQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIFZlYzMubXVsdGlwbHkoQ0NfVjNfMSwgdGhpcy5jb25zdHJhaW50LnBpdm90QSwgdGhpcy5fY29tLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgICAgIFZlYzMuYWRkKENDX1YzXzAsIENDX1YzXzAsIENDX1YzXzEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLl9waXZvdEIsIENDX1YzXzApO1xyXG4gICAgICAgIHRoaXMuaW1wbC5zZXRQaXZvdEIodGhpcy5fcGl2b3RCKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW1wbCAoKTogQW1tby5idFBvaW50MlBvaW50Q29uc3RyYWludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwgYXMgQW1tby5idFBvaW50MlBvaW50Q29uc3RyYWludDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY29uc3RyYWludCAoKTogUG9pbnRUb1BvaW50Q29uc3RyYWludCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbSBhcyBQb2ludFRvUG9pbnRDb25zdHJhaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bpdm90QSE6IEFtbW8uYnRWZWN0b3IzO1xyXG4gICAgcHJpdmF0ZSBfcGl2b3RCITogQW1tby5idFZlY3RvcjM7XHJcblxyXG4gICAgb25Db21wb25lbnRTZXQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yaWdpZEJvZHkpIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keUEgPSAodGhpcy5fcmlnaWRCb2R5LmJvZHkgYXMgQW1tb1JpZ2lkQm9keSkuaW1wbDtcclxuICAgICAgICAgICAgY29uc3QgY2IgPSB0aGlzLmNvbnN0cmFpbnQuY29ubmVjdGVkQm9keTtcclxuICAgICAgICAgICAgbGV0IGJvZHlCOiBBbW1vLmJ0UmlnaWRCb2R5IHwgdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgICAgIGJvZHlCID0gKGNiLmJvZHkgYXMgQW1tb1JpZ2lkQm9keSkuaW1wbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9waXZvdEEgPSBuZXcgQW1tby5idFZlY3RvcjMoKTtcclxuICAgICAgICAgICAgdGhpcy5fcGl2b3RCID0gbmV3IEFtbW8uYnRWZWN0b3IzKCk7XHJcbiAgICAgICAgICAgIGlmIChib2R5Qikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW1wbCA9IG5ldyBBbW1vLmJ0UG9pbnQyUG9pbnRDb25zdHJhaW50KGJvZHlBLCBib2R5QiwgdGhpcy5fcGl2b3RBLCB0aGlzLl9waXZvdEIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW1wbCA9IG5ldyBBbW1vLmJ0UG9pbnQyUG9pbnRDb25zdHJhaW50KGJvZHlBLCB0aGlzLl9waXZvdEEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGl2b3RBKHRoaXMuY29uc3RyYWludC5waXZvdEEpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFBpdm90Qih0aGlzLmNvbnN0cmFpbnQucGl2b3RCKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19