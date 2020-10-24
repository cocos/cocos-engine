(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "./cannon-constraint.js", "../../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("./cannon-constraint.js"), require("../../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.cannonConstraint, global.index);
    global.cannonPointToPointConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _cannonConstraint, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonPointToPointConstraint = void 0;
  _cannon = _interopRequireDefault(_cannon);

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

  var v3_0 = new _index.Vec3();
  var v3_1 = new _index.Vec3();

  var CannonPointToPointConstraint = /*#__PURE__*/function (_CannonConstraint) {
    _inherits(CannonPointToPointConstraint, _CannonConstraint);

    function CannonPointToPointConstraint() {
      _classCallCheck(this, CannonPointToPointConstraint);

      return _possibleConstructorReturn(this, _getPrototypeOf(CannonPointToPointConstraint).apply(this, arguments));
    }

    _createClass(CannonPointToPointConstraint, [{
      key: "setPivotA",
      value: function setPivotA(v) {
        _index.Vec3.multiply(v3_0, v, this._com.node.worldScale);

        _index.Vec3.copy(this.impl.pivotA, v3_0);
      }
    }, {
      key: "setPivotB",
      value: function setPivotB(v) {
        _index.Vec3.copy(v3_0, v);

        var cb = this.constraint.connectedBody;

        if (cb) {
          _index.Vec3.multiply(v3_0, v3_0, cb.node.worldScale);
        } else {
          _index.Vec3.add(v3_0, v3_0, this._com.node.worldPosition);

          _index.Vec3.multiply(v3_1, this.constraint.pivotA, this._com.node.worldScale);

          _index.Vec3.add(v3_0, v3_0, v3_1);
        }

        _index.Vec3.copy(this.impl.pivotB, v3_0);
      }
    }, {
      key: "onComponentSet",
      value: function onComponentSet() {
        if (this._rigidBody) {
          var bodyA = this._rigidBody.body.impl;
          var cb = this.constraint.connectedBody;
          var bodyB = _cannon.default.World['staticBody'];

          if (cb) {
            bodyB = cb.body.impl;
          }

          this._impl = new _cannon.default.PointToPointConstraint(bodyA, null, bodyB);
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

    return CannonPointToPointConstraint;
  }(_cannonConstraint.CannonConstraint);

  _exports.CannonPointToPointConstraint = CannonPointToPointConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2NvbnN0cmFpbnRzL2Nhbm5vbi1wb2ludC10by1wb2ludC1jb25zdHJhaW50LnRzIl0sIm5hbWVzIjpbInYzXzAiLCJWZWMzIiwidjNfMSIsIkNhbm5vblBvaW50VG9Qb2ludENvbnN0cmFpbnQiLCJ2IiwibXVsdGlwbHkiLCJfY29tIiwibm9kZSIsIndvcmxkU2NhbGUiLCJjb3B5IiwiaW1wbCIsInBpdm90QSIsImNiIiwiY29uc3RyYWludCIsImNvbm5lY3RlZEJvZHkiLCJhZGQiLCJ3b3JsZFBvc2l0aW9uIiwicGl2b3RCIiwiX3JpZ2lkQm9keSIsImJvZHlBIiwiYm9keSIsImJvZHlCIiwiQ0FOTk9OIiwiV29ybGQiLCJfaW1wbCIsIlBvaW50VG9Qb2ludENvbnN0cmFpbnQiLCJzZXRQaXZvdEEiLCJzZXRQaXZvdEIiLCJDYW5ub25Db25zdHJhaW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLE1BQU1BLElBQUksR0FBRyxJQUFJQyxXQUFKLEVBQWI7QUFDQSxNQUFNQyxJQUFJLEdBQUcsSUFBSUQsV0FBSixFQUFiOztNQUVhRSw0Qjs7Ozs7Ozs7Ozs7Z0NBVUVDLEMsRUFBb0I7QUFDM0JILG9CQUFLSSxRQUFMLENBQWNMLElBQWQsRUFBb0JJLENBQXBCLEVBQXVCLEtBQUtFLElBQUwsQ0FBVUMsSUFBVixDQUFlQyxVQUF0Qzs7QUFDQVAsb0JBQUtRLElBQUwsQ0FBVSxLQUFLQyxJQUFMLENBQVVDLE1BQXBCLEVBQTRCWCxJQUE1QjtBQUNIOzs7Z0NBRVVJLEMsRUFBb0I7QUFDM0JILG9CQUFLUSxJQUFMLENBQVVULElBQVYsRUFBZ0JJLENBQWhCOztBQUNBLFlBQU1RLEVBQUUsR0FBRyxLQUFLQyxVQUFMLENBQWdCQyxhQUEzQjs7QUFDQSxZQUFJRixFQUFKLEVBQVE7QUFDSlgsc0JBQUtJLFFBQUwsQ0FBY0wsSUFBZCxFQUFvQkEsSUFBcEIsRUFBMEJZLEVBQUUsQ0FBQ0wsSUFBSCxDQUFRQyxVQUFsQztBQUNILFNBRkQsTUFFTztBQUNIUCxzQkFBS2MsR0FBTCxDQUFTZixJQUFULEVBQWVBLElBQWYsRUFBcUIsS0FBS00sSUFBTCxDQUFVQyxJQUFWLENBQWVTLGFBQXBDOztBQUNBZixzQkFBS0ksUUFBTCxDQUFjSCxJQUFkLEVBQW9CLEtBQUtXLFVBQUwsQ0FBZ0JGLE1BQXBDLEVBQTRDLEtBQUtMLElBQUwsQ0FBVUMsSUFBVixDQUFlQyxVQUEzRDs7QUFDQVAsc0JBQUtjLEdBQUwsQ0FBU2YsSUFBVCxFQUFlQSxJQUFmLEVBQXFCRSxJQUFyQjtBQUNIOztBQUNERCxvQkFBS1EsSUFBTCxDQUFVLEtBQUtDLElBQUwsQ0FBVU8sTUFBcEIsRUFBNEJqQixJQUE1QjtBQUNIOzs7dUNBRWlCO0FBQ2QsWUFBSSxLQUFLa0IsVUFBVCxFQUFxQjtBQUNqQixjQUFNQyxLQUFLLEdBQUksS0FBS0QsVUFBTCxDQUFnQkUsSUFBakIsQ0FBMENWLElBQXhEO0FBQ0EsY0FBTUUsRUFBRSxHQUFHLEtBQUtDLFVBQUwsQ0FBZ0JDLGFBQTNCO0FBQ0EsY0FBSU8sS0FBa0IsR0FBR0MsZ0JBQU9DLEtBQVAsQ0FBYSxZQUFiLENBQXpCOztBQUNBLGNBQUlYLEVBQUosRUFBUTtBQUNKUyxZQUFBQSxLQUFLLEdBQUlULEVBQUUsQ0FBQ1EsSUFBSixDQUE2QlYsSUFBckM7QUFDSDs7QUFDRCxlQUFLYyxLQUFMLEdBQWEsSUFBSUYsZ0JBQU9HLHNCQUFYLENBQWtDTixLQUFsQyxFQUF5QyxJQUF6QyxFQUErQ0UsS0FBL0MsQ0FBYjtBQUNBLGVBQUtLLFNBQUwsQ0FBZSxLQUFLYixVQUFMLENBQWdCRixNQUEvQjtBQUNBLGVBQUtnQixTQUFMLENBQWUsS0FBS2QsVUFBTCxDQUFnQkksTUFBL0I7QUFDSDtBQUNKOzs7MEJBdENrQjtBQUNmLGVBQU8sS0FBS08sS0FBWjtBQUNIOzs7MEJBRXdCO0FBQ3JCLGVBQU8sS0FBS2xCLElBQVo7QUFDSDs7OztJQVI2Q3NCLGtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgQ2Fubm9uQ29uc3RyYWludCB9IGZyb20gJy4vY2Fubm9uLWNvbnN0cmFpbnQnO1xyXG5pbXBvcnQgeyBJUG9pbnRUb1BvaW50Q29uc3RyYWludCB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLWNvbnN0cmFpbnQnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgUG9pbnRUb1BvaW50Q29uc3RyYWludCB9IGZyb20gJy4uLy4uL2ZyYW1ld29yayc7XHJcbmltcG9ydCB7IENhbm5vblJpZ2lkQm9keSB9IGZyb20gJy4uL2Nhbm5vbi1yaWdpZC1ib2R5JztcclxuXHJcbmNvbnN0IHYzXzAgPSBuZXcgVmVjMygpO1xyXG5jb25zdCB2M18xID0gbmV3IFZlYzMoKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBDYW5ub25Qb2ludFRvUG9pbnRDb25zdHJhaW50IGV4dGVuZHMgQ2Fubm9uQ29uc3RyYWludCBpbXBsZW1lbnRzIElQb2ludFRvUG9pbnRDb25zdHJhaW50IHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGltcGwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbXBsIGFzIENBTk5PTi5Qb2ludFRvUG9pbnRDb25zdHJhaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29uc3RyYWludCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbSBhcyBQb2ludFRvUG9pbnRDb25zdHJhaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBpdm90QSAodjogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseSh2M18wLCB2LCB0aGlzLl9jb20ubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICBWZWMzLmNvcHkodGhpcy5pbXBsLnBpdm90QSwgdjNfMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UGl2b3RCICh2OiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBWZWMzLmNvcHkodjNfMCwgdik7XHJcbiAgICAgICAgY29uc3QgY2IgPSB0aGlzLmNvbnN0cmFpbnQuY29ubmVjdGVkQm9keTtcclxuICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgVmVjMy5tdWx0aXBseSh2M18wLCB2M18wLCBjYi5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMuYWRkKHYzXzAsIHYzXzAsIHRoaXMuX2NvbS5ub2RlLndvcmxkUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBWZWMzLm11bHRpcGx5KHYzXzEsIHRoaXMuY29uc3RyYWludC5waXZvdEEsIHRoaXMuX2NvbS5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgICAgICBWZWMzLmFkZCh2M18wLCB2M18wLCB2M18xKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuaW1wbC5waXZvdEIsIHYzXzApO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29tcG9uZW50U2V0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmlnaWRCb2R5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlBID0gKHRoaXMuX3JpZ2lkQm9keS5ib2R5IGFzIENhbm5vblJpZ2lkQm9keSkuaW1wbDtcclxuICAgICAgICAgICAgY29uc3QgY2IgPSB0aGlzLmNvbnN0cmFpbnQuY29ubmVjdGVkQm9keTtcclxuICAgICAgICAgICAgbGV0IGJvZHlCOiBDQU5OT04uQm9keSA9IENBTk5PTi5Xb3JsZFsnc3RhdGljQm9keSddO1xyXG4gICAgICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgICAgIGJvZHlCID0gKGNiLmJvZHkgYXMgQ2Fubm9uUmlnaWRCb2R5KS5pbXBsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwgPSBuZXcgQ0FOTk9OLlBvaW50VG9Qb2ludENvbnN0cmFpbnQoYm9keUEsIG51bGwsIGJvZHlCKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRQaXZvdEEodGhpcy5jb25zdHJhaW50LnBpdm90QSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGl2b3RCKHRoaXMuY29uc3RyYWludC5waXZvdEIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=