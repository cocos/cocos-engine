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
    global.cannonHingeConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _cannonConstraint, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonHingeConstraint = void 0;
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

  var CannonHingeConstraint = /*#__PURE__*/function (_CannonConstraint) {
    _inherits(CannonHingeConstraint, _CannonConstraint);

    function CannonHingeConstraint() {
      _classCallCheck(this, CannonHingeConstraint);

      return _possibleConstructorReturn(this, _getPrototypeOf(CannonHingeConstraint).apply(this, arguments));
    }

    _createClass(CannonHingeConstraint, [{
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
      key: "setAxisA",
      value: function setAxisA(v) {
        _index.Vec3.copy(this.impl.axisA, v);

        _index.Vec3.copy(this.impl.equations[3].axisA, v);

        _index.Vec3.copy(this.impl.equations[4].axisA, v);
      }
    }, {
      key: "setAxisB",
      value: function setAxisB(v) {
        _index.Vec3.copy(this.impl.axisB, v);

        _index.Vec3.copy(this.impl.equations[3].axisB, v);

        _index.Vec3.copy(this.impl.equations[4].axisB, v);
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

          this._impl = new _cannon.default.HingeConstraint(bodyA, bodyB);
          this.setPivotA(this.constraint.pivotA);
          this.setPivotB(this.constraint.pivotB);
          this.setAxisA(this.constraint.axisA);
          this.setAxisB(this.constraint.axisB);
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

    return CannonHingeConstraint;
  }(_cannonConstraint.CannonConstraint);

  _exports.CannonHingeConstraint = CannonHingeConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2NvbnN0cmFpbnRzL2Nhbm5vbi1oaW5nZS1jb25zdHJhaW50LnRzIl0sIm5hbWVzIjpbInYzXzAiLCJWZWMzIiwidjNfMSIsIkNhbm5vbkhpbmdlQ29uc3RyYWludCIsInYiLCJtdWx0aXBseSIsIl9jb20iLCJub2RlIiwid29ybGRTY2FsZSIsImNvcHkiLCJpbXBsIiwicGl2b3RBIiwiY2IiLCJjb25zdHJhaW50IiwiY29ubmVjdGVkQm9keSIsImFkZCIsIndvcmxkUG9zaXRpb24iLCJwaXZvdEIiLCJheGlzQSIsImVxdWF0aW9ucyIsImF4aXNCIiwiX3JpZ2lkQm9keSIsImJvZHlBIiwiYm9keSIsImJvZHlCIiwiQ0FOTk9OIiwiV29ybGQiLCJfaW1wbCIsIkhpbmdlQ29uc3RyYWludCIsInNldFBpdm90QSIsInNldFBpdm90QiIsInNldEF4aXNBIiwic2V0QXhpc0IiLCJDYW5ub25Db25zdHJhaW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLE1BQU1BLElBQUksR0FBRyxJQUFJQyxXQUFKLEVBQWI7QUFDQSxNQUFNQyxJQUFJLEdBQUcsSUFBSUQsV0FBSixFQUFiOztNQUVhRSxxQjs7Ozs7Ozs7Ozs7Z0NBVUVDLEMsRUFBb0I7QUFDM0JILG9CQUFLSSxRQUFMLENBQWNMLElBQWQsRUFBb0JJLENBQXBCLEVBQXVCLEtBQUtFLElBQUwsQ0FBVUMsSUFBVixDQUFlQyxVQUF0Qzs7QUFDQVAsb0JBQUtRLElBQUwsQ0FBVSxLQUFLQyxJQUFMLENBQVVDLE1BQXBCLEVBQTRCWCxJQUE1QjtBQUNIOzs7Z0NBRVVJLEMsRUFBb0I7QUFDM0JILG9CQUFLUSxJQUFMLENBQVVULElBQVYsRUFBZ0JJLENBQWhCOztBQUNBLFlBQU1RLEVBQUUsR0FBRyxLQUFLQyxVQUFMLENBQWdCQyxhQUEzQjs7QUFDQSxZQUFJRixFQUFKLEVBQVE7QUFDSlgsc0JBQUtJLFFBQUwsQ0FBY0wsSUFBZCxFQUFvQkEsSUFBcEIsRUFBMEJZLEVBQUUsQ0FBQ0wsSUFBSCxDQUFRQyxVQUFsQztBQUNILFNBRkQsTUFFTztBQUNIUCxzQkFBS2MsR0FBTCxDQUFTZixJQUFULEVBQWVBLElBQWYsRUFBcUIsS0FBS00sSUFBTCxDQUFVQyxJQUFWLENBQWVTLGFBQXBDOztBQUNBZixzQkFBS0ksUUFBTCxDQUFjSCxJQUFkLEVBQW9CLEtBQUtXLFVBQUwsQ0FBZ0JGLE1BQXBDLEVBQTRDLEtBQUtMLElBQUwsQ0FBVUMsSUFBVixDQUFlQyxVQUEzRDs7QUFDQVAsc0JBQUtjLEdBQUwsQ0FBU2YsSUFBVCxFQUFlQSxJQUFmLEVBQXFCRSxJQUFyQjtBQUNIOztBQUNERCxvQkFBS1EsSUFBTCxDQUFVLEtBQUtDLElBQUwsQ0FBVU8sTUFBcEIsRUFBNEJqQixJQUE1QjtBQUNIOzs7K0JBRVNJLEMsRUFBb0I7QUFDMUJILG9CQUFLUSxJQUFMLENBQVUsS0FBS0MsSUFBTCxDQUFVUSxLQUFwQixFQUEyQmQsQ0FBM0I7O0FBQ0FILG9CQUFLUSxJQUFMLENBQVcsS0FBS0MsSUFBTCxDQUFVUyxTQUFWLENBQW9CLENBQXBCLENBQUQsQ0FBK0NELEtBQXpELEVBQWdFZCxDQUFoRTs7QUFDQUgsb0JBQUtRLElBQUwsQ0FBVyxLQUFLQyxJQUFMLENBQVVTLFNBQVYsQ0FBb0IsQ0FBcEIsQ0FBRCxDQUErQ0QsS0FBekQsRUFBZ0VkLENBQWhFO0FBQ0g7OzsrQkFFU0EsQyxFQUFvQjtBQUMxQkgsb0JBQUtRLElBQUwsQ0FBVSxLQUFLQyxJQUFMLENBQVVVLEtBQXBCLEVBQTJCaEIsQ0FBM0I7O0FBQ0FILG9CQUFLUSxJQUFMLENBQVcsS0FBS0MsSUFBTCxDQUFVUyxTQUFWLENBQW9CLENBQXBCLENBQUQsQ0FBK0NDLEtBQXpELEVBQWdFaEIsQ0FBaEU7O0FBQ0FILG9CQUFLUSxJQUFMLENBQVcsS0FBS0MsSUFBTCxDQUFVUyxTQUFWLENBQW9CLENBQXBCLENBQUQsQ0FBK0NDLEtBQXpELEVBQWdFaEIsQ0FBaEU7QUFDSDs7O3VDQUVpQjtBQUNkLFlBQUksS0FBS2lCLFVBQVQsRUFBcUI7QUFDakIsY0FBTUMsS0FBSyxHQUFJLEtBQUtELFVBQUwsQ0FBZ0JFLElBQWpCLENBQTBDYixJQUF4RDtBQUNBLGNBQU1FLEVBQUUsR0FBRyxLQUFLQyxVQUFMLENBQWdCQyxhQUEzQjtBQUNBLGNBQUlVLEtBQWtCLEdBQUdDLGdCQUFPQyxLQUFQLENBQWEsWUFBYixDQUF6Qjs7QUFDQSxjQUFJZCxFQUFKLEVBQVE7QUFDSlksWUFBQUEsS0FBSyxHQUFJWixFQUFFLENBQUNXLElBQUosQ0FBNkJiLElBQXJDO0FBQ0g7O0FBQ0QsZUFBS2lCLEtBQUwsR0FBYSxJQUFJRixnQkFBT0csZUFBWCxDQUEyQk4sS0FBM0IsRUFBa0NFLEtBQWxDLENBQWI7QUFDQSxlQUFLSyxTQUFMLENBQWUsS0FBS2hCLFVBQUwsQ0FBZ0JGLE1BQS9CO0FBQ0EsZUFBS21CLFNBQUwsQ0FBZSxLQUFLakIsVUFBTCxDQUFnQkksTUFBL0I7QUFDQSxlQUFLYyxRQUFMLENBQWMsS0FBS2xCLFVBQUwsQ0FBZ0JLLEtBQTlCO0FBQ0EsZUFBS2MsUUFBTCxDQUFjLEtBQUtuQixVQUFMLENBQWdCTyxLQUE5QjtBQUNIO0FBQ0o7OzswQkFwRGtCO0FBQ2YsZUFBTyxLQUFLTyxLQUFaO0FBQ0g7OzswQkFFd0I7QUFDckIsZUFBTyxLQUFLckIsSUFBWjtBQUNIOzs7O0lBUnNDMkIsa0MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IENBTk5PTiwgeyBSb3RhdGlvbmFsRXF1YXRpb24gfSBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgQ2Fubm9uQ29uc3RyYWludCB9IGZyb20gJy4vY2Fubm9uLWNvbnN0cmFpbnQnO1xyXG5pbXBvcnQgeyBJSGluZ2VDb25zdHJhaW50IH0gZnJvbSAnLi4vLi4vc3BlYy9pLXBoeXNpY3MtY29uc3RyYWludCc7XHJcbmltcG9ydCB7IEhpbmdlQ29uc3RyYWludCB9IGZyb20gJy4uLy4uL2ZyYW1ld29yayc7XHJcbmltcG9ydCB7IENhbm5vblJpZ2lkQm9keSB9IGZyb20gJy4uL2Nhbm5vbi1yaWdpZC1ib2R5JztcclxuaW1wb3J0IHsgSVZlYzNMaWtlLCBWZWMzIH0gZnJvbSAnLi4vLi4vLi4vY29yZSc7XHJcblxyXG5jb25zdCB2M18wID0gbmV3IFZlYzMoKTtcclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2Fubm9uSGluZ2VDb25zdHJhaW50IGV4dGVuZHMgQ2Fubm9uQ29uc3RyYWludCBpbXBsZW1lbnRzIElIaW5nZUNvbnN0cmFpbnQge1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaW1wbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwgYXMgQ0FOTk9OLkhpbmdlQ29uc3RyYWludDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbnN0cmFpbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb20gYXMgSGluZ2VDb25zdHJhaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBpdm90QSAodjogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseSh2M18wLCB2LCB0aGlzLl9jb20ubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICBWZWMzLmNvcHkodGhpcy5pbXBsLnBpdm90QSwgdjNfMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UGl2b3RCICh2OiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBWZWMzLmNvcHkodjNfMCwgdik7XHJcbiAgICAgICAgY29uc3QgY2IgPSB0aGlzLmNvbnN0cmFpbnQuY29ubmVjdGVkQm9keTtcclxuICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgVmVjMy5tdWx0aXBseSh2M18wLCB2M18wLCBjYi5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMuYWRkKHYzXzAsIHYzXzAsIHRoaXMuX2NvbS5ub2RlLndvcmxkUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBWZWMzLm11bHRpcGx5KHYzXzEsIHRoaXMuY29uc3RyYWludC5waXZvdEEsIHRoaXMuX2NvbS5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgICAgICBWZWMzLmFkZCh2M18wLCB2M18wLCB2M18xKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuaW1wbC5waXZvdEIsIHYzXzApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEF4aXNBICh2OiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBWZWMzLmNvcHkodGhpcy5pbXBsLmF4aXNBLCB2KTtcclxuICAgICAgICBWZWMzLmNvcHkoKHRoaXMuaW1wbC5lcXVhdGlvbnNbM10gYXMgUm90YXRpb25hbEVxdWF0aW9uKS5heGlzQSwgdik7XHJcbiAgICAgICAgVmVjMy5jb3B5KCh0aGlzLmltcGwuZXF1YXRpb25zWzRdIGFzIFJvdGF0aW9uYWxFcXVhdGlvbikuYXhpc0EsIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEF4aXNCICh2OiBJVmVjM0xpa2UpOiB2b2lkIHtcclxuICAgICAgICBWZWMzLmNvcHkodGhpcy5pbXBsLmF4aXNCLCB2KTtcclxuICAgICAgICBWZWMzLmNvcHkoKHRoaXMuaW1wbC5lcXVhdGlvbnNbM10gYXMgUm90YXRpb25hbEVxdWF0aW9uKS5heGlzQiwgdik7XHJcbiAgICAgICAgVmVjMy5jb3B5KCh0aGlzLmltcGwuZXF1YXRpb25zWzRdIGFzIFJvdGF0aW9uYWxFcXVhdGlvbikuYXhpc0IsIHYpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29tcG9uZW50U2V0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmlnaWRCb2R5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlBID0gKHRoaXMuX3JpZ2lkQm9keS5ib2R5IGFzIENhbm5vblJpZ2lkQm9keSkuaW1wbDtcclxuICAgICAgICAgICAgY29uc3QgY2IgPSB0aGlzLmNvbnN0cmFpbnQuY29ubmVjdGVkQm9keTtcclxuICAgICAgICAgICAgbGV0IGJvZHlCOiBDQU5OT04uQm9keSA9IENBTk5PTi5Xb3JsZFsnc3RhdGljQm9keSddO1xyXG4gICAgICAgICAgICBpZiAoY2IpIHtcclxuICAgICAgICAgICAgICAgIGJvZHlCID0gKGNiLmJvZHkgYXMgQ2Fubm9uUmlnaWRCb2R5KS5pbXBsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwgPSBuZXcgQ0FOTk9OLkhpbmdlQ29uc3RyYWludChib2R5QSwgYm9keUIpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFBpdm90QSh0aGlzLmNvbnN0cmFpbnQucGl2b3RBKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRQaXZvdEIodGhpcy5jb25zdHJhaW50LnBpdm90Qik7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QXhpc0EodGhpcy5jb25zdHJhaW50LmF4aXNBKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRBeGlzQih0aGlzLmNvbnN0cmFpbnQuYXhpc0IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=