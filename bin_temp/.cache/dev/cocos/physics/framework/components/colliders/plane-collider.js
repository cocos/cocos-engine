(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "../../../../core/math/index.js", "./collider.js", "../../../../core/default-constants.js", "../../physics-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("../../../../core/math/index.js"), require("./collider.js"), require("../../../../core/default-constants.js"), require("../../physics-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.collider, global.defaultConstants, global.physicsEnum);
    global.planeCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _collider, _defaultConstants, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PlaneCollider = void 0;

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

  /**
   * @en
   * Plane collider component.
   * @zh
   * 静态平面碰撞器。
   */
  var PlaneCollider = (_dec = (0, _index.ccclass)('cc.PlaneCollider'), _dec2 = (0, _index.help)('i18n:cc.PlaneCollider'), _dec3 = (0, _index.menu)('Physics/PlaneCollider(beta)'), _dec4 = (0, _index.type)(_index2.Vec3), _dec5 = (0, _index.tooltip)('平面的法线'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(PlaneCollider, _Collider);

    _createClass(PlaneCollider, [{
      key: "normal",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the normal of the plane, in local space.
       * @zh
       * 获取或设置平面在本地坐标系下的法线。
       */
      get: function get() {
        return this._normal;
      },
      set: function set(value) {
        _index2.Vec3.copy(this._normal, value);

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setNormal(this._normal);
        }
      }
      /**
       * @en
       * Gets or sets the value of the plane moving along the normal, in local space.
       * @zh
       * 获取或设置平面在本地坐标系下沿着法线移动的数值。
       */

    }, {
      key: "constant",
      get: function get() {
        return this._constant;
      },
      set: function set(v) {
        this._constant = v;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setConstant(this._constant);
        }
      }
      /**
       * @en
       * Gets the wrapper object, through which the lowLevel instance can be accessed.
       * @zh
       * 获取封装对象，通过此对象可以访问到底层实例。
       */

    }, {
      key: "shape",
      get: function get() {
        return this._shape;
      } /// PRIVATE PROPERTY ///

    }]);

    function PlaneCollider() {
      var _this;

      _classCallCheck(this, PlaneCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PlaneCollider).call(this, _physicsEnum.EColliderType.PLANE));

      _initializerDefineProperty(_this, "_normal", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_constant", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    return PlaneCollider;
  }(_collider.Collider), _temp), (_applyDecoratedDescriptor(_class2.prototype, "normal", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "normal"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "constant", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "constant"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_normal", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(0, 1, 0);
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_constant", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.PlaneCollider = PlaneCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL3BsYW5lLWNvbGxpZGVyLnRzIl0sIm5hbWVzIjpbIlBsYW5lQ29sbGlkZXIiLCJWZWMzIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfbm9ybWFsIiwidmFsdWUiLCJjb3B5IiwiRURJVE9SIiwiVEVTVCIsInNoYXBlIiwic2V0Tm9ybWFsIiwiX2NvbnN0YW50IiwidiIsInNldENvbnN0YW50IiwiX3NoYXBlIiwiRUNvbGxpZGVyVHlwZSIsIlBMQU5FIiwiQ29sbGlkZXIiLCJlZGl0YWJsZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7Ozs7O01BVWFBLGEsV0FKWixvQkFBUSxrQkFBUixDLFVBQ0EsaUJBQUssdUJBQUwsQyxVQUNBLGlCQUFLLDZCQUFMLEMsVUFZSSxpQkFBS0MsWUFBTCxDLFVBQ0Esb0JBQVEsT0FBUixDLGtEQVpKQyx3Qjs7Ozs7QUFHRzs7QUFFQTs7Ozs7OzBCQVFxQjtBQUNqQixlQUFPLEtBQUtDLE9BQVo7QUFDSCxPO3dCQUVrQkMsSyxFQUFPO0FBQ3RCSCxxQkFBS0ksSUFBTCxDQUFVLEtBQUtGLE9BQWYsRUFBd0JDLEtBQXhCOztBQUNBLFlBQUksQ0FBQ0Usd0JBQUQsSUFBVyxDQUFDQyxzQkFBaEIsRUFBc0I7QUFDbEIsZUFBS0MsS0FBTCxDQUFXQyxTQUFYLENBQXFCLEtBQUtOLE9BQTFCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7MEJBT3VCO0FBQ25CLGVBQU8sS0FBS08sU0FBWjtBQUNILE87d0JBRW9CQyxDLEVBQVc7QUFDNUIsYUFBS0QsU0FBTCxHQUFpQkMsQ0FBakI7O0FBQ0EsWUFBSSxDQUFDTCx3QkFBRCxJQUFXLENBQUNDLHNCQUFoQixFQUFzQjtBQUNsQixlQUFLQyxLQUFMLENBQVdJLFdBQVgsQ0FBdUIsS0FBS0YsU0FBNUI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OzswQkFNb0I7QUFDaEIsZUFBTyxLQUFLRyxNQUFaO0FBQ0gsTyxDQUVEOzs7O0FBUUEsNkJBQWU7QUFBQTs7QUFBQTs7QUFDWCx5RkFBTUMsMkJBQWNDLEtBQXBCOztBQURXOztBQUFBOztBQUFBO0FBRWQ7OztJQTdEOEJDLGtCLCtOQTZCOUJDLGUsOEpBd0JBQyxtQjs7Ozs7YUFDaUIsSUFBSWpCLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQzs7Z0ZBRWpCaUIsbUI7Ozs7O2FBQ21CLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgY2NjbGFzcyxcclxuICAgIGhlbHAsXHJcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcclxuICAgIG1lbnUsXHJcbiAgICB0b29sdGlwLFxyXG4gICAgdHlwZSxcclxuICAgIGVkaXRhYmxlLFxyXG4gICAgc2VyaWFsaXphYmxlLFxyXG59IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBDb2xsaWRlciB9IGZyb20gJy4vY29sbGlkZXInO1xyXG5pbXBvcnQgeyBJUGxhbmVTaGFwZSB9IGZyb20gJy4uLy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgRURJVE9SLCBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgRUNvbGxpZGVyVHlwZSB9IGZyb20gJy4uLy4uL3BoeXNpY3MtZW51bSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFBsYW5lIGNvbGxpZGVyIGNvbXBvbmVudC5cclxuICogQHpoXHJcbiAqIOmdmeaAgeW5s+mdoueisOaSnuWZqOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlBsYW5lQ29sbGlkZXInKVxyXG5AaGVscCgnaTE4bjpjYy5QbGFuZUNvbGxpZGVyJylcclxuQG1lbnUoJ1BoeXNpY3MvUGxhbmVDb2xsaWRlcihiZXRhKScpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgUGxhbmVDb2xsaWRlciBleHRlbmRzIENvbGxpZGVyIHtcclxuXHJcbiAgICAvLy8gUFVCTElDIFBST1BFUlRZIEdFVFRFUlxcU0VUVEVSIC8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIG5vcm1hbCBvZiB0aGUgcGxhbmUsIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7lubPpnaLlnKjmnKzlnLDlnZDmoIfns7vkuIvnmoTms5Xnur/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVmVjMylcclxuICAgIEB0b29sdGlwKCflubPpnaLnmoTms5Xnur8nKVxyXG4gICAgcHVibGljIGdldCBub3JtYWwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub3JtYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBub3JtYWwgKHZhbHVlKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX25vcm1hbCwgdmFsdWUpO1xyXG4gICAgICAgIGlmICghRURJVE9SICYmICFURVNUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUuc2V0Tm9ybWFsKHRoaXMuX25vcm1hbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHZhbHVlIG9mIHRoZSBwbGFuZSBtb3ZpbmcgYWxvbmcgdGhlIG5vcm1hbCwgaW4gbG9jYWwgc3BhY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruW5s+mdouWcqOacrOWcsOWdkOagh+ezu+S4i+ayv+edgOazlee6v+enu+WKqOeahOaVsOWAvOOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBnZXQgY29uc3RhbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25zdGFudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNvbnN0YW50ICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jb25zdGFudCA9IHY7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXRDb25zdGFudCh0aGlzLl9jb25zdGFudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSB3cmFwcGVyIG9iamVjdCwgdGhyb3VnaCB3aGljaCB0aGUgbG93TGV2ZWwgaW5zdGFuY2UgY2FuIGJlIGFjY2Vzc2VkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blsIHoo4Xlr7nosaHvvIzpgJrov4fmraTlr7nosaHlj6/ku6Xorr/pl67liLDlupXlsYLlrp7kvovjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzaGFwZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIGFzIElQbGFuZVNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLyBQUklWQVRFIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX25vcm1hbCA9IG5ldyBWZWMzKDAsIDEsIDApO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2NvbnN0YW50ID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRUNvbGxpZGVyVHlwZS5QTEFORSk7XHJcbiAgICB9XHJcbn1cclxuIl19