(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "./constraint.js", "../../../../core/index.js", "../../physics-enum.js", "../../../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("./constraint.js"), require("../../../../core/index.js"), require("../../physics-enum.js"), require("../../../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.constraint, global.index, global.physicsEnum, global.defaultConstants);
    global.pointToPointConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _constraint, _index2, _physicsEnum, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PointToPointConstraint = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var PointToPointConstraint = (_dec = (0, _index.ccclass)('cc.PointToPointConstraint'), _dec2 = (0, _index.help)('i18n:cc.PointToPointConstraint'), _dec3 = (0, _index.menu)('Physics/PointToPointConstraint(beta)'), _dec4 = (0, _index.type)(_index2.Vec3), _dec5 = (0, _index.type)(_index2.Vec3), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = (_temp = /*#__PURE__*/function (_Constraint) {
    _inherits(PointToPointConstraint, _Constraint);

    _createClass(PointToPointConstraint, [{
      key: "pivotA",
      get: function get() {
        return this._pivotA;
      },
      set: function set(v) {
        _index2.Vec3.copy(this._pivotA, v);

        if (!_defaultConstants.EDITOR) {
          this.constraint.setPivotA(this._pivotA);
        }
      }
    }, {
      key: "pivotB",
      get: function get() {
        return this._pivotB;
      },
      set: function set(v) {
        _index2.Vec3.copy(this._pivotB, v);

        if (!_defaultConstants.EDITOR) {
          this.constraint.setPivotB(this._pivotB);
        }
      }
    }, {
      key: "constraint",
      get: function get() {
        return this._constraint;
      }
    }]);

    function PointToPointConstraint() {
      var _this;

      _classCallCheck(this, PointToPointConstraint);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PointToPointConstraint).call(this, _physicsEnum.EConstraintType.POINT_TO_POINT));

      _initializerDefineProperty(_this, "_pivotA", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_pivotB", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    return PointToPointConstraint;
  }(_constraint.Constraint), _temp), (_applyDecoratedDescriptor(_class2.prototype, "pivotA", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "pivotA"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "pivotB", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "pivotB"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_pivotA", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_pivotB", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  })), _class2)) || _class) || _class) || _class);
  _exports.PointToPointConstraint = PointToPointConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29uc3RyYWludHMvcG9pbnQtdG8tcG9pbnQtY29uc3RyYWludC50cyJdLCJuYW1lcyI6WyJQb2ludFRvUG9pbnRDb25zdHJhaW50IiwiVmVjMyIsIl9waXZvdEEiLCJ2IiwiY29weSIsIkVESVRPUiIsImNvbnN0cmFpbnQiLCJzZXRQaXZvdEEiLCJfcGl2b3RCIiwic2V0UGl2b3RCIiwiX2NvbnN0cmFpbnQiLCJFQ29uc3RyYWludFR5cGUiLCJQT0lOVF9UT19QT0lOVCIsIkNvbnN0cmFpbnQiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFxQmFBLHNCLFdBSFosb0JBQVEsMkJBQVIsQyxVQUNBLGlCQUFLLGdDQUFMLEMsVUFDQSxpQkFBSyxzQ0FBTCxDLFVBR0ksaUJBQUtDLFlBQUwsQyxVQVlBLGlCQUFLQSxZQUFMLEM7Ozs7OzBCQVhhO0FBQ1YsZUFBTyxLQUFLQyxPQUFaO0FBQ0gsTzt3QkFFV0MsQyxFQUFjO0FBQ3RCRixxQkFBS0csSUFBTCxDQUFVLEtBQUtGLE9BQWYsRUFBd0JDLENBQXhCOztBQUNBLFlBQUksQ0FBQ0Usd0JBQUwsRUFBYTtBQUNULGVBQUtDLFVBQUwsQ0FBZ0JDLFNBQWhCLENBQTBCLEtBQUtMLE9BQS9CO0FBQ0g7QUFDSjs7OzBCQUdhO0FBQ1YsZUFBTyxLQUFLTSxPQUFaO0FBQ0gsTzt3QkFFV0wsQyxFQUFjO0FBQ3RCRixxQkFBS0csSUFBTCxDQUFVLEtBQUtJLE9BQWYsRUFBd0JMLENBQXhCOztBQUNBLFlBQUksQ0FBQ0Usd0JBQUwsRUFBYTtBQUNULGVBQUtDLFVBQUwsQ0FBZ0JHLFNBQWhCLENBQTBCLEtBQUtELE9BQS9CO0FBQ0g7QUFDSjs7OzBCQUUwQztBQUN2QyxlQUFPLEtBQUtFLFdBQVo7QUFDSDs7O0FBUUQsc0NBQWU7QUFBQTs7QUFBQTs7QUFDWCxrR0FBTUMsNkJBQWdCQyxjQUF0Qjs7QUFEVzs7QUFBQTs7QUFBQTtBQUVkOzs7SUF0Q3VDQyxzQix1WEE4QnZDQyxtQjs7Ozs7YUFDZ0MsSUFBSWIsWUFBSixFOzs4RUFFaENhLG1COzs7OzthQUNnQyxJQUFJYixZQUFKLEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgY2NjbGFzcyxcclxuICAgIGhlbHAsXHJcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcclxuICAgIG1lbnUsXHJcbiAgICB0eXBlLFxyXG4gICAgc2VyaWFsaXphYmxlLFxyXG59IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENvbnN0cmFpbnQgfSBmcm9tICcuL2NvbnN0cmFpbnQnO1xyXG5pbXBvcnQgeyBWZWMzLCBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgRUNvbnN0cmFpbnRUeXBlIH0gZnJvbSAnLi4vLi4vcGh5c2ljcy1lbnVtJztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgSVBvaW50VG9Qb2ludENvbnN0cmFpbnQgfSBmcm9tICcuLi8uLi8uLi9zcGVjL2ktcGh5c2ljcy1jb25zdHJhaW50JztcclxuXHJcbkBjY2NsYXNzKCdjYy5Qb2ludFRvUG9pbnRDb25zdHJhaW50JylcclxuQGhlbHAoJ2kxOG46Y2MuUG9pbnRUb1BvaW50Q29uc3RyYWludCcpXHJcbkBtZW51KCdQaHlzaWNzL1BvaW50VG9Qb2ludENvbnN0cmFpbnQoYmV0YSknKVxyXG5leHBvcnQgY2xhc3MgUG9pbnRUb1BvaW50Q29uc3RyYWludCBleHRlbmRzIENvbnN0cmFpbnQge1xyXG5cclxuICAgIEB0eXBlKFZlYzMpXHJcbiAgICBnZXQgcGl2b3RBICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGl2b3RBO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwaXZvdEEgKHY6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9waXZvdEEsIHYpO1xyXG4gICAgICAgIGlmICghRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RyYWludC5zZXRQaXZvdEEodGhpcy5fcGl2b3RBKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQHR5cGUoVmVjMylcclxuICAgIGdldCBwaXZvdEIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9waXZvdEI7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBpdm90QiAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3Bpdm90Qiwgdik7XHJcbiAgICAgICAgaWYgKCFFRElUT1IpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJhaW50LnNldFBpdm90Qih0aGlzLl9waXZvdEIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY29uc3RyYWludCAoKTogSVBvaW50VG9Qb2ludENvbnN0cmFpbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25zdHJhaW50IGFzIElQb2ludFRvUG9pbnRDb25zdHJhaW50O1xyXG4gICAgfVxyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3Bpdm90QTogVmVjMyA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcGl2b3RCOiBWZWMzID0gbmV3IFZlYzMoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRUNvbnN0cmFpbnRUeXBlLlBPSU5UX1RPX1BPSU5UKTtcclxuICAgIH1cclxufVxyXG5cclxuIl19