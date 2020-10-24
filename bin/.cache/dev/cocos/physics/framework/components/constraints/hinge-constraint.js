(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "./constraint.js", "../../../../core/index.js", "../../physics-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("./constraint.js"), require("../../../../core/index.js"), require("../../physics-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.constraint, global.index, global.physicsEnum);
    global.hingeConstraint = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _constraint, _index2, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.HingeConstraint = void 0;

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var HingeConstraint = (_dec = (0, _index.ccclass)('cc.HingeConstraint'), _dec2 = (0, _index.help)('i18n:cc.HingeConstraint'), _dec3 = (0, _index.menu)('Physics/HingeConstraint(beta)'), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = (_temp = /*#__PURE__*/function (_Constraint) {
    _inherits(HingeConstraint, _Constraint);

    function HingeConstraint() {
      var _this;

      _classCallCheck(this, HingeConstraint);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HingeConstraint).call(this, _physicsEnum.EConstraintType.HINGE));

      _initializerDefineProperty(_this, "axisA", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "axisB", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "pivotA", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "pivotB", _descriptor4, _assertThisInitialized(_this));

      return _this;
    }

    return HingeConstraint;
  }(_constraint.Constraint), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "axisA", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "axisB", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "pivotA", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "pivotB", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  })), _class2)) || _class) || _class) || _class);
  _exports.HingeConstraint = HingeConstraint;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29uc3RyYWludHMvaGluZ2UtY29uc3RyYWludC50cyJdLCJuYW1lcyI6WyJIaW5nZUNvbnN0cmFpbnQiLCJFQ29uc3RyYWludFR5cGUiLCJISU5HRSIsIkNvbnN0cmFpbnQiLCJzZXJpYWxpemFibGUiLCJlZGl0YWJsZSIsIlZlYzMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWtCYUEsZSxXQUhaLG9CQUFRLG9CQUFSLEMsVUFDQSxpQkFBSyx5QkFBTCxDLFVBQ0EsaUJBQUssK0JBQUwsQzs7O0FBbUJHLCtCQUFlO0FBQUE7O0FBQUE7O0FBQ1gsMkZBQU1DLDZCQUFnQkMsS0FBdEI7O0FBRFc7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFFZDs7O0lBcEJnQ0Msc0IsaUZBRWhDQyxtQixFQUNBQyxlOzs7OzthQUNrQixJQUFJQyxZQUFKLEU7OzRFQUVsQkYsbUIsRUFDQUMsZTs7Ozs7YUFDa0IsSUFBSUMsWUFBSixFOzs2RUFFbEJGLG1CLEVBQ0FDLGU7Ozs7O2FBQ21CLElBQUlDLFlBQUosRTs7NkVBRW5CRixtQixFQUNBQyxlOzs7OzthQUNtQixJQUFJQyxZQUFKLEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgY2NjbGFzcyxcclxuICAgIGhlbHAsXHJcbiAgICBtZW51LFxyXG4gICAgZWRpdGFibGUsXHJcbiAgICBzZXJpYWxpemFibGUsXHJcbn0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ29uc3RyYWludCB9IGZyb20gJy4vY29uc3RyYWludCc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSwgVmVjMyB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBFQ29uc3RyYWludFR5cGUgfSBmcm9tICcuLi8uLi9waHlzaWNzLWVudW0nO1xyXG5cclxuQGNjY2xhc3MoJ2NjLkhpbmdlQ29uc3RyYWludCcpXHJcbkBoZWxwKCdpMThuOmNjLkhpbmdlQ29uc3RyYWludCcpXHJcbkBtZW51KCdQaHlzaWNzL0hpbmdlQ29uc3RyYWludChiZXRhKScpXHJcbmV4cG9ydCBjbGFzcyBIaW5nZUNvbnN0cmFpbnQgZXh0ZW5kcyBDb25zdHJhaW50IHtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGF4aXNBOiBJVmVjM0xpa2UgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgYXhpc0I6IElWZWMzTGlrZSA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwaXZvdEE6IElWZWMzTGlrZSA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwaXZvdEI6IElWZWMzTGlrZSA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKEVDb25zdHJhaW50VHlwZS5ISU5HRSk7XHJcbiAgICB9XHJcbn1cclxuIl19