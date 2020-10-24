(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "./collider.js", "../../../../core/default-constants.js", "../../physics-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("./collider.js"), require("../../../../core/default-constants.js"), require("../../physics-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.collider, global.defaultConstants, global.physicsEnum);
    global.cylinderCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _collider, _defaultConstants, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CylinderCollider = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

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

  /**
   * @en
   * Cylinder collider component.
   * @zh
   * 圆柱体碰撞器。
   */
  var CylinderCollider = (_dec = (0, _index.ccclass)('cc.CylinderCollider'), _dec2 = (0, _index.help)('i18n:cc.CylinderCollider'), _dec3 = (0, _index.menu)('Physics/CylinderCollider'), _dec4 = (0, _index.tooltip)('圆柱体上圆面的半径'), _dec5 = (0, _index.tooltip)('圆柱体在相应轴向的高度'), _dec6 = (0, _index.type)(_physicsEnum.EAxisDirection), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(CylinderCollider, _Collider);

    _createClass(CylinderCollider, [{
      key: "radius",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the radius of the circle on the cylinder body, in local space.
       * @zh
       * 获取或设置圆柱体上圆面半径。
       */
      get: function get() {
        return this._radius;
      },
      set: function set(value) {
        if (this._radius == value) return;
        if (value < 0) value = 0;
        this._radius = value;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setRadius(value);
        }
      }
      /**
       * @en
       * Gets or sets the cylinder body is at the corresponding axial height, in local space.
       * @zh
       * 获取或设置圆柱体在相应轴向的高度。
       */

    }, {
      key: "height",
      get: function get() {
        return this._height;
      },
      set: function set(value) {
        if (this._height == value) return;
        if (value < 0) value = 0;
        this._height = value;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setHeight(value);
        }
      }
      /**
       * @en
       * Gets or sets the cylinder direction, in local space.
       * @zh
       * 获取或设置在圆柱体本地空间上的方向。
       */

    }, {
      key: "direction",
      get: function get() {
        return this._direction;
      },
      set: function set(value) {
        if (this._direction == value) return;
        if (value < _physicsEnum.EAxisDirection.X_AXIS || value > _physicsEnum.EAxisDirection.Z_AXIS) return;
        this._direction = value;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setDirection(value);
        }
      }
    }, {
      key: "shape",
      get: function get() {
        return this._shape;
      } /// PRIVATE PROPERTY ///

    }]);

    function CylinderCollider() {
      var _this;

      _classCallCheck(this, CylinderCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CylinderCollider).call(this, _physicsEnum.EColliderType.CYLINDER));

      _initializerDefineProperty(_this, "_radius", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_height", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_direction", _descriptor3, _assertThisInitialized(_this));

      return _this;
    }

    return CylinderCollider;
  }(_collider.Collider), _temp), (_applyDecoratedDescriptor(_class2.prototype, "radius", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "radius"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "height", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "height"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "direction"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_radius", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.5;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_height", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 2;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_direction", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _physicsEnum.EAxisDirection.Y_AXIS;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.CylinderCollider = CylinderCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL2N5bGluZGVyLWNvbGxpZGVyLnRzIl0sIm5hbWVzIjpbIkN5bGluZGVyQ29sbGlkZXIiLCJFQXhpc0RpcmVjdGlvbiIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX3JhZGl1cyIsInZhbHVlIiwiRURJVE9SIiwiVEVTVCIsInNoYXBlIiwic2V0UmFkaXVzIiwiX2hlaWdodCIsInNldEhlaWdodCIsIl9kaXJlY3Rpb24iLCJYX0FYSVMiLCJaX0FYSVMiLCJzZXREaXJlY3Rpb24iLCJfc2hhcGUiLCJFQ29sbGlkZXJUeXBlIiwiQ1lMSU5ERVIiLCJDb2xsaWRlciIsInNlcmlhbGl6YWJsZSIsIllfQVhJUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7Ozs7O01BVWFBLGdCLFdBSlosb0JBQVEscUJBQVIsQyxVQUNBLGlCQUFLLDBCQUFMLEMsVUFDQSxpQkFBSywwQkFBTCxDLFVBV0ksb0JBQVEsV0FBUixDLFVBb0JBLG9CQUFRLGFBQVIsQyxVQW9CQSxpQkFBS0MsMkJBQUwsQyxrREFsREpDLHdCOzs7OztBQUVHOztBQUVBOzs7Ozs7MEJBT3FCO0FBQ2pCLGVBQU8sS0FBS0MsT0FBWjtBQUNILE87d0JBRWtCQyxLLEVBQU87QUFDdEIsWUFBSSxLQUFLRCxPQUFMLElBQWdCQyxLQUFwQixFQUEyQjtBQUMzQixZQUFJQSxLQUFLLEdBQUcsQ0FBWixFQUFlQSxLQUFLLEdBQUcsQ0FBUjtBQUNmLGFBQUtELE9BQUwsR0FBZUMsS0FBZjs7QUFDQSxZQUFJLENBQUNDLHdCQUFELElBQVcsQ0FBQ0Msc0JBQWhCLEVBQXNCO0FBQ2xCLGVBQUtDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQkosS0FBckI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OzswQkFPcUI7QUFDakIsZUFBTyxLQUFLSyxPQUFaO0FBQ0gsTzt3QkFFa0JMLEssRUFBTztBQUN0QixZQUFJLEtBQUtLLE9BQUwsSUFBZ0JMLEtBQXBCLEVBQTJCO0FBQzNCLFlBQUlBLEtBQUssR0FBRyxDQUFaLEVBQWVBLEtBQUssR0FBRyxDQUFSO0FBQ2YsYUFBS0ssT0FBTCxHQUFlTCxLQUFmOztBQUNBLFlBQUksQ0FBQ0Msd0JBQUQsSUFBVyxDQUFDQyxzQkFBaEIsRUFBc0I7QUFDbEIsZUFBS0MsS0FBTCxDQUFXRyxTQUFYLENBQXFCTixLQUFyQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQU93QjtBQUNwQixlQUFPLEtBQUtPLFVBQVo7QUFDSCxPO3dCQUVxQlAsSyxFQUF1QjtBQUN6QyxZQUFJLEtBQUtPLFVBQUwsSUFBbUJQLEtBQXZCLEVBQThCO0FBQzlCLFlBQUlBLEtBQUssR0FBR0gsNEJBQWVXLE1BQXZCLElBQWlDUixLQUFLLEdBQUdILDRCQUFlWSxNQUE1RCxFQUFvRTtBQUNwRSxhQUFLRixVQUFMLEdBQWtCUCxLQUFsQjs7QUFDQSxZQUFJLENBQUNDLHdCQUFELElBQVcsQ0FBQ0Msc0JBQWhCLEVBQXNCO0FBQ2xCLGVBQUtDLEtBQUwsQ0FBV08sWUFBWCxDQUF3QlYsS0FBeEI7QUFDSDtBQUNKOzs7MEJBRW1CO0FBQ2hCLGVBQU8sS0FBS1csTUFBWjtBQUNILE8sQ0FFRDs7OztBQVdBLGdDQUFlO0FBQUE7O0FBQUE7O0FBQ1gsNEZBQU1DLDJCQUFjQyxRQUFwQjs7QUFEVzs7QUFBQTs7QUFBQTs7QUFBQTtBQUVkOzs7SUFoRmlDQyxrQiwrZ0JBcUVqQ0MsbUI7Ozs7O2FBQ2lCLEc7OzhFQUVqQkEsbUI7Ozs7O2FBQ2lCLEM7O2lGQUVqQkEsbUI7Ozs7O2FBQ29CbEIsNEJBQWVtQixNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGNjY2xhc3MsXHJcbiAgICBoZWxwLFxyXG4gICAgZXhlY3V0ZUluRWRpdE1vZGUsXHJcbiAgICBtZW51LFxyXG4gICAgdG9vbHRpcCxcclxuICAgIHR5cGUsXHJcbiAgICBzZXJpYWxpemFibGUsXHJcbn0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ29sbGlkZXIgfSBmcm9tICcuL2NvbGxpZGVyJztcclxuaW1wb3J0IHsgSUN5bGluZGVyU2hhcGUgfSBmcm9tICcuLi8uLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IEVESVRPUiwgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IEVBeGlzRGlyZWN0aW9uLCBFQ29sbGlkZXJUeXBlIH0gZnJvbSAnLi4vLi4vcGh5c2ljcy1lbnVtJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQ3lsaW5kZXIgY29sbGlkZXIgY29tcG9uZW50LlxyXG4gKiBAemhcclxuICog5ZyG5p+x5L2T56Kw5pKe5Zmo44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQ3lsaW5kZXJDb2xsaWRlcicpXHJcbkBoZWxwKCdpMThuOmNjLkN5bGluZGVyQ29sbGlkZXInKVxyXG5AbWVudSgnUGh5c2ljcy9DeWxpbmRlckNvbGxpZGVyJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBDeWxpbmRlckNvbGxpZGVyIGV4dGVuZHMgQ29sbGlkZXIge1xyXG4gICAgLy8vIFBVQkxJQyBQUk9QRVJUWSBHRVRURVJcXFNFVFRFUiAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSByYWRpdXMgb2YgdGhlIGNpcmNsZSBvbiB0aGUgY3lsaW5kZXIgYm9keSwgaW4gbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruWchuafseS9k+S4iuWchumdouWNiuW+hOOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5ZyG5p+x5L2T5LiK5ZyG6Z2i55qE5Y2K5b6EJylcclxuICAgIHB1YmxpYyBnZXQgcmFkaXVzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcmFkaXVzICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yYWRpdXMgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5fcmFkaXVzID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXRSYWRpdXModmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBjeWxpbmRlciBib2R5IGlzIGF0IHRoZSBjb3JyZXNwb25kaW5nIGF4aWFsIGhlaWdodCwgaW4gbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruWchuafseS9k+WcqOebuOW6lOi9tOWQkeeahOmrmOW6puOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5ZyG5p+x5L2T5Zyo55u45bqU6L205ZCR55qE6auY5bqmJylcclxuICAgIHB1YmxpYyBnZXQgaGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9oZWlnaHQgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXRIZWlnaHQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBjeWxpbmRlciBkaXJlY3Rpb24sIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7lnKjlnIbmn7HkvZPmnKzlnLDnqbrpl7TkuIrnmoTmlrnlkJHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoRUF4aXNEaXJlY3Rpb24pXHJcbiAgICBwdWJsaWMgZ2V0IGRpcmVjdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGRpcmVjdGlvbiAodmFsdWU6IEVBeGlzRGlyZWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IEVBeGlzRGlyZWN0aW9uLlhfQVhJUyB8fCB2YWx1ZSA+IEVBeGlzRGlyZWN0aW9uLlpfQVhJUykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIGlmICghRURJVE9SICYmICFURVNUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUuc2V0RGlyZWN0aW9uKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzaGFwZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIGFzIElDeWxpbmRlclNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLyBQUklWQVRFIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3JhZGl1cyA9IDAuNTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9oZWlnaHQgPSAyO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2RpcmVjdGlvbiA9IEVBeGlzRGlyZWN0aW9uLllfQVhJUztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRUNvbGxpZGVyVHlwZS5DWUxJTkRFUik7XHJcbiAgICB9XHJcbn1cclxuIl19