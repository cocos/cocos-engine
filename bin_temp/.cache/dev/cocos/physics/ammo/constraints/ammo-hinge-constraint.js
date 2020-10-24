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
    global.ammoHingeConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _ammoConstraint, _index, _ammoUtil, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoHingeConstraint = void 0;
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

  var AmmoHingeConstraint = /*#__PURE__*/function (_AmmoConstraint) {
    _inherits(AmmoHingeConstraint, _AmmoConstraint);

    function AmmoHingeConstraint() {
      _classCallCheck(this, AmmoHingeConstraint);

      return _possibleConstructorReturn(this, _getPrototypeOf(AmmoHingeConstraint).apply(this, arguments));
    }

    _createClass(AmmoHingeConstraint, [{
      key: "setPivotA",
      value: function setPivotA(v) {
        if (this._pivotA) {
          _index.Vec3.multiply(_ammoConst.CC_V3_0, v, this._com.node.worldScale);

          (0, _ammoUtil.cocos2AmmoVec3)(this._pivotA, _ammoConst.CC_V3_0); // this.impl.setPivotA(this._pivotA);
        }
      }
    }, {
      key: "setPivotB",
      value: function setPivotB(v) {
        if (this._pivotB) {
          _index.Vec3.copy(_ammoConst.CC_V3_0, v);

          var cb = this._com.connectedBody;

          if (cb) {
            _index.Vec3.multiply(_ammoConst.CC_V3_0, v, cb.node.worldScale);
          }

          (0, _ammoUtil.cocos2AmmoVec3)(this._pivotB, _ammoConst.CC_V3_0); // this.impl.setPivotB(this._pivotB);
        }
      }
    }, {
      key: "setAxisA",
      value: function setAxisA(v) {}
    }, {
      key: "setAxisB",
      value: function setAxisB(v) {}
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
          this.setPivotA(this.constraint.pivotA);
          this.setPivotB(this.constraint.pivotB);
          this._axisA = new _ammoInstantiated.default.btVector3();
          this._axisB = new _ammoInstantiated.default.btVector3();
          (0, _ammoUtil.cocos2AmmoVec3)(this._axisA, this.constraint.axisA);
          (0, _ammoUtil.cocos2AmmoVec3)(this._axisB, this.constraint.axisB);

          if (bodyB) {
            this._impl = new _ammoInstantiated.default.btHingeConstraint(bodyA, bodyB, this._pivotA, this._pivotB, this._axisA, this._axisB);
          } else {
            var quat = new _index.Quat();

            _index.Quat.rotationTo(quat, _index.Vec3.UNIT_Z, this.constraint.axisA);

            var qa = new _ammoInstantiated.default.btQuaternion(quat.x, quat.y, quat.z, quat.w);
            var rbAFrame = new _ammoInstantiated.default.btTransform();
            rbAFrame.setIdentity();
            rbAFrame.setOrigin(this._pivotA);
            rbAFrame.setRotation(qa);
            this._impl = new _ammoInstantiated.default.btHingeConstraint(bodyA, rbAFrame);
          }
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

    return AmmoHingeConstraint;
  }(_ammoConstraint.AmmoConstraint);

  _exports.AmmoHingeConstraint = AmmoHingeConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9jb25zdHJhaW50cy9hbW1vLWhpbmdlLWNvbnN0cmFpbnQudHMiXSwibmFtZXMiOlsiQW1tb0hpbmdlQ29uc3RyYWludCIsInYiLCJfcGl2b3RBIiwiVmVjMyIsIm11bHRpcGx5IiwiQ0NfVjNfMCIsIl9jb20iLCJub2RlIiwid29ybGRTY2FsZSIsIl9waXZvdEIiLCJjb3B5IiwiY2IiLCJjb25uZWN0ZWRCb2R5IiwiX3JpZ2lkQm9keSIsImJvZHlBIiwiYm9keSIsImltcGwiLCJjb25zdHJhaW50IiwiYm9keUIiLCJBbW1vIiwiYnRWZWN0b3IzIiwic2V0UGl2b3RBIiwicGl2b3RBIiwic2V0UGl2b3RCIiwicGl2b3RCIiwiX2F4aXNBIiwiX2F4aXNCIiwiYXhpc0EiLCJheGlzQiIsIl9pbXBsIiwiYnRIaW5nZUNvbnN0cmFpbnQiLCJxdWF0IiwiUXVhdCIsInJvdGF0aW9uVG8iLCJVTklUX1oiLCJxYSIsImJ0UXVhdGVybmlvbiIsIngiLCJ5IiwieiIsInciLCJyYkFGcmFtZSIsImJ0VHJhbnNmb3JtIiwic2V0SWRlbnRpdHkiLCJzZXRPcmlnaW4iLCJzZXRSb3RhdGlvbiIsIkFtbW9Db25zdHJhaW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNhQSxtQjs7Ozs7Ozs7Ozs7Z0NBRUVDLEMsRUFBb0I7QUFDM0IsWUFBSSxLQUFLQyxPQUFULEVBQWtCO0FBQ2RDLHNCQUFLQyxRQUFMLENBQWNDLGtCQUFkLEVBQXVCSixDQUF2QixFQUEwQixLQUFLSyxJQUFMLENBQVVDLElBQVYsQ0FBZUMsVUFBekM7O0FBQ0Esd0NBQWUsS0FBS04sT0FBcEIsRUFBNkJHLGtCQUE3QixFQUZjLENBR2Q7QUFDSDtBQUNKOzs7Z0NBRVVKLEMsRUFBb0I7QUFDM0IsWUFBSSxLQUFLUSxPQUFULEVBQWtCO0FBQ2ROLHNCQUFLTyxJQUFMLENBQVVMLGtCQUFWLEVBQW1CSixDQUFuQjs7QUFDQSxjQUFNVSxFQUFFLEdBQUcsS0FBS0wsSUFBTCxDQUFVTSxhQUFyQjs7QUFDQSxjQUFJRCxFQUFKLEVBQVE7QUFDSlIsd0JBQUtDLFFBQUwsQ0FBY0Msa0JBQWQsRUFBdUJKLENBQXZCLEVBQTBCVSxFQUFFLENBQUNKLElBQUgsQ0FBUUMsVUFBbEM7QUFDSDs7QUFDRCx3Q0FBZSxLQUFLQyxPQUFwQixFQUE2Qkosa0JBQTdCLEVBTmMsQ0FPZDtBQUNIO0FBQ0o7OzsrQkFFU0osQyxFQUFjLENBRXZCOzs7K0JBRVNBLEMsRUFBYyxDQUV2Qjs7O3VDQWVpQjtBQUNkLFlBQUksS0FBS1ksVUFBVCxFQUFxQjtBQUNqQixjQUFNQyxLQUFLLEdBQUksS0FBS0QsVUFBTCxDQUFnQkUsSUFBakIsQ0FBd0NDLElBQXREO0FBQ0EsY0FBTUwsRUFBRSxHQUFHLEtBQUtNLFVBQUwsQ0FBZ0JMLGFBQTNCO0FBQ0EsY0FBSU0sS0FBSjs7QUFDQSxjQUFJUCxFQUFKLEVBQVE7QUFDSk8sWUFBQUEsS0FBSyxHQUFJUCxFQUFFLENBQUNJLElBQUosQ0FBMkJDLElBQW5DO0FBQ0g7O0FBQ0QsZUFBS2QsT0FBTCxHQUFlLElBQUlpQiwwQkFBS0MsU0FBVCxFQUFmO0FBQ0EsZUFBS1gsT0FBTCxHQUFlLElBQUlVLDBCQUFLQyxTQUFULEVBQWY7QUFDQSxlQUFLQyxTQUFMLENBQWUsS0FBS0osVUFBTCxDQUFnQkssTUFBL0I7QUFDQSxlQUFLQyxTQUFMLENBQWUsS0FBS04sVUFBTCxDQUFnQk8sTUFBL0I7QUFDQSxlQUFLQyxNQUFMLEdBQWMsSUFBSU4sMEJBQUtDLFNBQVQsRUFBZDtBQUNBLGVBQUtNLE1BQUwsR0FBYyxJQUFJUCwwQkFBS0MsU0FBVCxFQUFkO0FBQ0Esd0NBQWUsS0FBS0ssTUFBcEIsRUFBNEIsS0FBS1IsVUFBTCxDQUFnQlUsS0FBNUM7QUFDQSx3Q0FBZSxLQUFLRCxNQUFwQixFQUE0QixLQUFLVCxVQUFMLENBQWdCVyxLQUE1Qzs7QUFDQSxjQUFJVixLQUFKLEVBQVc7QUFDUCxpQkFBS1csS0FBTCxHQUFhLElBQUlWLDBCQUFLVyxpQkFBVCxDQUEyQmhCLEtBQTNCLEVBQWtDSSxLQUFsQyxFQUF5QyxLQUFLaEIsT0FBOUMsRUFBdUQsS0FBS08sT0FBNUQsRUFBcUUsS0FBS2dCLE1BQTFFLEVBQWtGLEtBQUtDLE1BQXZGLENBQWI7QUFDSCxXQUZELE1BRU87QUFDSCxnQkFBTUssSUFBSSxHQUFHLElBQUlDLFdBQUosRUFBYjs7QUFDQUEsd0JBQUtDLFVBQUwsQ0FBZ0JGLElBQWhCLEVBQXNCNUIsWUFBSytCLE1BQTNCLEVBQW1DLEtBQUtqQixVQUFMLENBQWdCVSxLQUFuRDs7QUFDQSxnQkFBTVEsRUFBRSxHQUFHLElBQUloQiwwQkFBS2lCLFlBQVQsQ0FBc0JMLElBQUksQ0FBQ00sQ0FBM0IsRUFBOEJOLElBQUksQ0FBQ08sQ0FBbkMsRUFBc0NQLElBQUksQ0FBQ1EsQ0FBM0MsRUFBOENSLElBQUksQ0FBQ1MsQ0FBbkQsQ0FBWDtBQUNBLGdCQUFNQyxRQUFRLEdBQUcsSUFBSXRCLDBCQUFLdUIsV0FBVCxFQUFqQjtBQUNBRCxZQUFBQSxRQUFRLENBQUNFLFdBQVQ7QUFDQUYsWUFBQUEsUUFBUSxDQUFDRyxTQUFULENBQW1CLEtBQUsxQyxPQUF4QjtBQUNBdUMsWUFBQUEsUUFBUSxDQUFDSSxXQUFULENBQXFCVixFQUFyQjtBQUNBLGlCQUFLTixLQUFMLEdBQWEsSUFBSVYsMEJBQUtXLGlCQUFULENBQTJCaEIsS0FBM0IsRUFBa0MyQixRQUFsQyxDQUFiO0FBQ0g7QUFDSjtBQUNKOzs7MEJBMUNtQztBQUNoQyxlQUFPLEtBQUtaLEtBQVo7QUFDSDs7OzBCQUVrQztBQUMvQixlQUFPLEtBQUt2QixJQUFaO0FBQ0g7Ozs7SUFwQ29Dd0MsOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW1tbyBmcm9tICcuLi9hbW1vLWluc3RhbnRpYXRlZCc7XHJcbmltcG9ydCB7IEFtbW9Db25zdHJhaW50IH0gZnJvbSBcIi4vYW1tby1jb25zdHJhaW50XCI7XHJcbmltcG9ydCB7IElIaW5nZUNvbnN0cmFpbnQgfSBmcm9tIFwiLi4vLi4vc3BlYy9pLXBoeXNpY3MtY29uc3RyYWludFwiO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UsIFF1YXQsIFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgY29jb3MyQW1tb1ZlYzMgfSBmcm9tICcuLi9hbW1vLXV0aWwnO1xyXG5pbXBvcnQgeyBIaW5nZUNvbnN0cmFpbnQgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBBbW1vUmlnaWRCb2R5IH0gZnJvbSAnLi4vYW1tby1yaWdpZC1ib2R5JztcclxuaW1wb3J0IHsgQ0NfVjNfMCB9IGZyb20gJy4uL2FtbW8tY29uc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtbW9IaW5nZUNvbnN0cmFpbnQgZXh0ZW5kcyBBbW1vQ29uc3RyYWludCBpbXBsZW1lbnRzIElIaW5nZUNvbnN0cmFpbnQge1xyXG5cclxuICAgIHNldFBpdm90QSAodjogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bpdm90QSkge1xyXG4gICAgICAgICAgICBWZWMzLm11bHRpcGx5KENDX1YzXzAsIHYsIHRoaXMuX2NvbS5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLl9waXZvdEEsIENDX1YzXzApO1xyXG4gICAgICAgICAgICAvLyB0aGlzLmltcGwuc2V0UGl2b3RBKHRoaXMuX3Bpdm90QSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFBpdm90QiAodjogSVZlYzNMaWtlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bpdm90Qikge1xyXG4gICAgICAgICAgICBWZWMzLmNvcHkoQ0NfVjNfMCwgdik7XHJcbiAgICAgICAgICAgIGNvbnN0IGNiID0gdGhpcy5fY29tLmNvbm5lY3RlZEJvZHk7XHJcbiAgICAgICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgICAgICAgVmVjMy5tdWx0aXBseShDQ19WM18wLCB2LCBjYi5ub2RlLndvcmxkU2NhbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9WZWMzKHRoaXMuX3Bpdm90QiwgQ0NfVjNfMCk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuaW1wbC5zZXRQaXZvdEIodGhpcy5fcGl2b3RCKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QXhpc0EgKHY6IElWZWMzTGlrZSkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXRBeGlzQiAodjogSVZlYzNMaWtlKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpOiBBbW1vLmJ0SGluZ2VDb25zdHJhaW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW1wbCBhcyBBbW1vLmJ0SGluZ2VDb25zdHJhaW50O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb25zdHJhaW50ICgpOiBIaW5nZUNvbnN0cmFpbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb20gYXMgSGluZ2VDb25zdHJhaW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Bpdm90QSE6IEFtbW8uYnRWZWN0b3IzO1xyXG4gICAgcHJpdmF0ZSBfcGl2b3RCITogQW1tby5idFZlY3RvcjM7XHJcbiAgICBwcml2YXRlIF9heGlzQSE6IEFtbW8uYnRWZWN0b3IzO1xyXG4gICAgcHJpdmF0ZSBfYXhpc0IhOiBBbW1vLmJ0VmVjdG9yMztcclxuXHJcbiAgICBvbkNvbXBvbmVudFNldCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JpZ2lkQm9keSkge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5QSA9ICh0aGlzLl9yaWdpZEJvZHkuYm9keSBhcyBBbW1vUmlnaWRCb2R5KS5pbXBsO1xyXG4gICAgICAgICAgICBjb25zdCBjYiA9IHRoaXMuY29uc3RyYWludC5jb25uZWN0ZWRCb2R5O1xyXG4gICAgICAgICAgICBsZXQgYm9keUI6IEFtbW8uYnRSaWdpZEJvZHkgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgICAgICAgYm9keUIgPSAoY2IuYm9keSBhcyBBbW1vUmlnaWRCb2R5KS5pbXBsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3Bpdm90QSA9IG5ldyBBbW1vLmJ0VmVjdG9yMygpO1xyXG4gICAgICAgICAgICB0aGlzLl9waXZvdEIgPSBuZXcgQW1tby5idFZlY3RvcjMoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRQaXZvdEEodGhpcy5jb25zdHJhaW50LnBpdm90QSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UGl2b3RCKHRoaXMuY29uc3RyYWludC5waXZvdEIpO1xyXG4gICAgICAgICAgICB0aGlzLl9heGlzQSA9IG5ldyBBbW1vLmJ0VmVjdG9yMygpO1xyXG4gICAgICAgICAgICB0aGlzLl9heGlzQiA9IG5ldyBBbW1vLmJ0VmVjdG9yMygpO1xyXG4gICAgICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLl9heGlzQSwgdGhpcy5jb25zdHJhaW50LmF4aXNBKTtcclxuICAgICAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5fYXhpc0IsIHRoaXMuY29uc3RyYWludC5heGlzQik7XHJcbiAgICAgICAgICAgIGlmIChib2R5Qikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW1wbCA9IG5ldyBBbW1vLmJ0SGluZ2VDb25zdHJhaW50KGJvZHlBLCBib2R5QiwgdGhpcy5fcGl2b3RBLCB0aGlzLl9waXZvdEIsIHRoaXMuX2F4aXNBLCB0aGlzLl9heGlzQik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBxdWF0ID0gbmV3IFF1YXQoKTtcclxuICAgICAgICAgICAgICAgIFF1YXQucm90YXRpb25UbyhxdWF0LCBWZWMzLlVOSVRfWiwgdGhpcy5jb25zdHJhaW50LmF4aXNBKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHFhID0gbmV3IEFtbW8uYnRRdWF0ZXJuaW9uKHF1YXQueCwgcXVhdC55LCBxdWF0LnosIHF1YXQudyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYkFGcmFtZSA9IG5ldyBBbW1vLmJ0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgICAgICByYkFGcmFtZS5zZXRJZGVudGl0eSgpO1xyXG4gICAgICAgICAgICAgICAgcmJBRnJhbWUuc2V0T3JpZ2luKHRoaXMuX3Bpdm90QSk7XHJcbiAgICAgICAgICAgICAgICByYkFGcmFtZS5zZXRSb3RhdGlvbihxYSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbXBsID0gbmV3IEFtbW8uYnRIaW5nZUNvbnN0cmFpbnQoYm9keUEsIHJiQUZyYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=