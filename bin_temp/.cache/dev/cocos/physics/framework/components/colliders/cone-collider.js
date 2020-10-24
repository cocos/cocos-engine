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
    global.coneCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _collider, _defaultConstants, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ConeCollider = void 0;

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
   * Cone collider component.
   * @zh
   * 圆锥体碰撞器。
   */
  var ConeCollider = (_dec = (0, _index.ccclass)('cc.ConeCollider'), _dec2 = (0, _index.help)('i18n:cc.ConeCollider'), _dec3 = (0, _index.menu)('Physics/ConeCollider(beta)'), _dec4 = (0, _index.tooltip)('圆锥体上圆面的半径'), _dec5 = (0, _index.tooltip)('圆锥体在相应轴向的高度'), _dec6 = (0, _index.type)(_physicsEnum.EAxisDirection), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(ConeCollider, _Collider);

    _createClass(ConeCollider, [{
      key: "radius",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the radius of the circle on the cone body, in local space.
       * @zh
       * 获取或设置圆锥体上圆面半径。
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
       * Gets or sets the cone body is at the corresponding axial height, in local space.
       * @zh
       * 获取或设置圆锥体在相应轴向的高度。
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
       * Gets or sets the cone direction, in local space.
       * @zh
       * 获取或设置在圆锥体本地空间上的方向。
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

    function ConeCollider() {
      var _this;

      _classCallCheck(this, ConeCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ConeCollider).call(this, _physicsEnum.EColliderType.CONE));

      _initializerDefineProperty(_this, "_radius", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_height", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_direction", _descriptor3, _assertThisInitialized(_this));

      return _this;
    }

    return ConeCollider;
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
      return 1;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_direction", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _physicsEnum.EAxisDirection.Y_AXIS;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.ConeCollider = ConeCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL2NvbmUtY29sbGlkZXIudHMiXSwibmFtZXMiOlsiQ29uZUNvbGxpZGVyIiwiRUF4aXNEaXJlY3Rpb24iLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9yYWRpdXMiLCJ2YWx1ZSIsIkVESVRPUiIsIlRFU1QiLCJzaGFwZSIsInNldFJhZGl1cyIsIl9oZWlnaHQiLCJzZXRIZWlnaHQiLCJfZGlyZWN0aW9uIiwiWF9BWElTIiwiWl9BWElTIiwic2V0RGlyZWN0aW9uIiwiX3NoYXBlIiwiRUNvbGxpZGVyVHlwZSIsIkNPTkUiLCJDb2xsaWRlciIsInNlcmlhbGl6YWJsZSIsIllfQVhJUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7Ozs7O01BVWFBLFksV0FKWixvQkFBUSxpQkFBUixDLFVBQ0EsaUJBQUssc0JBQUwsQyxVQUNBLGlCQUFLLDRCQUFMLEMsVUFXSSxvQkFBUSxXQUFSLEMsVUFvQkEsb0JBQVEsYUFBUixDLFVBb0JBLGlCQUFLQywyQkFBTCxDLGtEQWxESkMsd0I7Ozs7O0FBRUc7O0FBRUE7Ozs7OzswQkFPcUI7QUFDakIsZUFBTyxLQUFLQyxPQUFaO0FBQ0gsTzt3QkFFa0JDLEssRUFBTztBQUN0QixZQUFJLEtBQUtELE9BQUwsSUFBZ0JDLEtBQXBCLEVBQTJCO0FBQzNCLFlBQUlBLEtBQUssR0FBRyxDQUFaLEVBQWVBLEtBQUssR0FBRyxDQUFSO0FBQ2YsYUFBS0QsT0FBTCxHQUFlQyxLQUFmOztBQUNBLFlBQUksQ0FBQ0Msd0JBQUQsSUFBVyxDQUFDQyxzQkFBaEIsRUFBc0I7QUFDbEIsZUFBS0MsS0FBTCxDQUFXQyxTQUFYLENBQXFCSixLQUFyQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQU9xQjtBQUNqQixlQUFPLEtBQUtLLE9BQVo7QUFDSCxPO3dCQUVrQkwsSyxFQUFPO0FBQ3RCLFlBQUksS0FBS0ssT0FBTCxJQUFnQkwsS0FBcEIsRUFBMkI7QUFDM0IsWUFBSUEsS0FBSyxHQUFHLENBQVosRUFBZUEsS0FBSyxHQUFHLENBQVI7QUFDZixhQUFLSyxPQUFMLEdBQWVMLEtBQWY7O0FBQ0EsWUFBSSxDQUFDQyx3QkFBRCxJQUFXLENBQUNDLHNCQUFoQixFQUFzQjtBQUNsQixlQUFLQyxLQUFMLENBQVdHLFNBQVgsQ0FBcUJOLEtBQXJCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7MEJBT3dCO0FBQ3BCLGVBQU8sS0FBS08sVUFBWjtBQUNILE87d0JBRXFCUCxLLEVBQXVCO0FBQ3pDLFlBQUksS0FBS08sVUFBTCxJQUFtQlAsS0FBdkIsRUFBOEI7QUFDOUIsWUFBSUEsS0FBSyxHQUFHSCw0QkFBZVcsTUFBdkIsSUFBaUNSLEtBQUssR0FBR0gsNEJBQWVZLE1BQTVELEVBQW9FO0FBQ3BFLGFBQUtGLFVBQUwsR0FBa0JQLEtBQWxCOztBQUNBLFlBQUksQ0FBQ0Msd0JBQUQsSUFBVyxDQUFDQyxzQkFBaEIsRUFBc0I7QUFDbEIsZUFBS0MsS0FBTCxDQUFXTyxZQUFYLENBQXdCVixLQUF4QjtBQUNIO0FBQ0o7OzswQkFFbUI7QUFDaEIsZUFBTyxLQUFLVyxNQUFaO0FBQ0gsTyxDQUVEOzs7O0FBV0EsNEJBQWU7QUFBQTs7QUFBQTs7QUFDWCx3RkFBTUMsMkJBQWNDLElBQXBCOztBQURXOztBQUFBOztBQUFBOztBQUFBO0FBRWQ7OztJQWhGNkJDLGtCLCtnQkFxRTdCQyxtQjs7Ozs7YUFDaUIsRzs7OEVBRWpCQSxtQjs7Ozs7YUFDaUIsQzs7aUZBRWpCQSxtQjs7Ozs7YUFDb0JsQiw0QkFBZW1CLE0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgY2NjbGFzcyxcclxuICAgIGhlbHAsXHJcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcclxuICAgIG1lbnUsXHJcbiAgICB0b29sdGlwLFxyXG4gICAgdHlwZSxcclxuICAgIHNlcmlhbGl6YWJsZSxcclxufSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xsaWRlciB9IGZyb20gJy4vY29sbGlkZXInO1xyXG5pbXBvcnQgeyBJQ29uZVNoYXBlIH0gZnJvbSAnLi4vLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBFRElUT1IsIFRFU1QgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBFQXhpc0RpcmVjdGlvbiwgRUNvbGxpZGVyVHlwZSB9IGZyb20gJy4uLy4uL3BoeXNpY3MtZW51bSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIENvbmUgY29sbGlkZXIgY29tcG9uZW50LlxyXG4gKiBAemhcclxuICog5ZyG6ZSl5L2T56Kw5pKe5Zmo44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQ29uZUNvbGxpZGVyJylcclxuQGhlbHAoJ2kxOG46Y2MuQ29uZUNvbGxpZGVyJylcclxuQG1lbnUoJ1BoeXNpY3MvQ29uZUNvbGxpZGVyKGJldGEpJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBDb25lQ29sbGlkZXIgZXh0ZW5kcyBDb2xsaWRlciB7XHJcbiAgICAvLy8gUFVCTElDIFBST1BFUlRZIEdFVFRFUlxcU0VUVEVSIC8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHJhZGl1cyBvZiB0aGUgY2lyY2xlIG9uIHRoZSBjb25lIGJvZHksIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7lnIbplKXkvZPkuIrlnIbpnaLljYrlvoTjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+WchumUpeS9k+S4iuWchumdoueahOWNiuW+hCcpXHJcbiAgICBwdWJsaWMgZ2V0IHJhZGl1cyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhZGl1cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJhZGl1cyAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmFkaXVzID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAwO1xyXG4gICAgICAgIHRoaXMuX3JhZGl1cyA9IHZhbHVlO1xyXG4gICAgICAgIGlmICghRURJVE9SICYmICFURVNUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUuc2V0UmFkaXVzKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgY29uZSBib2R5IGlzIGF0IHRoZSBjb3JyZXNwb25kaW5nIGF4aWFsIGhlaWdodCwgaW4gbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruWchumUpeS9k+WcqOebuOW6lOi9tOWQkeeahOmrmOW6puOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgn5ZyG6ZSl5L2T5Zyo55u45bqU6L205ZCR55qE6auY5bqmJylcclxuICAgIHB1YmxpYyBnZXQgaGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgaGVpZ2h0ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9oZWlnaHQgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXRIZWlnaHQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBjb25lIGRpcmVjdGlvbiwgaW4gbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruWcqOWchumUpeS9k+acrOWcsOepuumXtOS4iueahOaWueWQkeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShFQXhpc0RpcmVjdGlvbilcclxuICAgIHB1YmxpYyBnZXQgZGlyZWN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGlyZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZGlyZWN0aW9uICh2YWx1ZTogRUF4aXNEaXJlY3Rpb24pIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgRUF4aXNEaXJlY3Rpb24uWF9BWElTIHx8IHZhbHVlID4gRUF4aXNEaXJlY3Rpb24uWl9BWElTKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXREaXJlY3Rpb24odmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNoYXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGUgYXMgSUNvbmVTaGFwZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8gUFJJVkFURSBQUk9QRVJUWSAvLy9cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9yYWRpdXMgPSAwLjU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaGVpZ2h0ID0gMTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9kaXJlY3Rpb24gPSBFQXhpc0RpcmVjdGlvbi5ZX0FYSVM7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKEVDb2xsaWRlclR5cGUuQ09ORSk7XHJcbiAgICB9XHJcbn1cclxuIl19