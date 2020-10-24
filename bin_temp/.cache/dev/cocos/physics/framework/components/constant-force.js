(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/data/decorators/index.js", "../../../core/components/component.js", "./rigid-body.js", "../../../core/math/vec3.js", "../../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/data/decorators/index.js"), require("../../../core/components/component.js"), require("./rigid-body.js"), require("../../../core/math/vec3.js"), require("../../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.component, global.rigidBody, global.vec3, global.defaultConstants);
    global.constantForce = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _component, _rigidBody, _vec, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ConstantForce = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * A tool component to help apply force to the rigid body at each frame.
   * @zh
   * 在每帧对一个刚体施加持续的力，依赖 RigidBody 组件。
   */
  var ConstantForce = (_dec = (0, _index.ccclass)('cc.ConstantForce'), _dec2 = (0, _index.help)('i18n:cc.ConstantForce'), _dec3 = (0, _index.requireComponent)(_rigidBody.RigidBody), _dec4 = (0, _index.menu)('Physics/ConstantForce'), _dec5 = (0, _index.displayOrder)(0), _dec6 = (0, _index.tooltip)('世界坐标系下的力'), _dec7 = (0, _index.displayOrder)(1), _dec8 = (0, _index.tooltip)('本地坐标系下的力'), _dec9 = (0, _index.displayOrder)(2), _dec10 = (0, _index.tooltip)('世界坐标系下的扭转力'), _dec11 = (0, _index.displayOrder)(3), _dec12 = (0, _index.tooltip)('本地坐标系下的扭转力'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index.disallowMultiple)(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(ConstantForce, _Component);

    function ConstantForce() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ConstantForce);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ConstantForce)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._rigidBody = null;

      _initializerDefineProperty(_this, "_force", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_localForce", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_torque", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_localTorque", _descriptor4, _assertThisInitialized(_this));

      _this._mask = 0;
      return _this;
    }

    _createClass(ConstantForce, [{
      key: "onLoad",
      value: function onLoad() {
        this._rigidBody = this.node.getComponent(_rigidBody.RigidBody);

        this._maskUpdate(this._force, 1);

        this._maskUpdate(this._localForce, 2);

        this._maskUpdate(this._torque, 4);

        this._maskUpdate(this._localTorque, 8);
      }
    }, {
      key: "lateUpdate",
      value: function lateUpdate(dt) {
        if (!_defaultConstants.EDITOR) {
          if (this._rigidBody != null && this._mask != 0) {
            if (this._mask & 1) this._rigidBody.applyForce(this._force);
            if (this._mask & 2) this._rigidBody.applyLocalForce(this.localForce);
            if (this._mask & 4) this._rigidBody.applyTorque(this._torque);
            if (this._mask & 8) this._rigidBody.applyLocalTorque(this._localTorque);
          }
        }
      }
    }, {
      key: "_maskUpdate",
      value: function _maskUpdate(t, m) {
        if (t.strictEquals(_vec.Vec3.ZERO)) {
          this._mask &= ~m;
        } else {
          this._mask |= m;
        }
      }
    }, {
      key: "force",

      /**
       * @en
       * Gets or sets forces in world coordinates.
       * @zh
       * 获取或设置世界坐标系下的力。
       */
      get: function get() {
        return this._force;
      },
      set: function set(value) {
        _vec.Vec3.copy(this._force, value);

        this._maskUpdate(this._force, 1);
      }
      /**
       * @en
       * Gets or sets the forces in the local coordinate system.
       * @zh
       * 获取或设置本地坐标系下的力。
       */

    }, {
      key: "localForce",
      get: function get() {
        return this._localForce;
      },
      set: function set(value) {
        _vec.Vec3.copy(this._localForce, value);

        this._maskUpdate(this.localForce, 2);
      }
      /**
       * @en
       * Gets or sets the torsional force in world coordinates.
       * @zh
       * 获取或设置世界坐标系下的扭转力。
       */

    }, {
      key: "torque",
      get: function get() {
        return this._torque;
      },
      set: function set(value) {
        _vec.Vec3.copy(this._torque, value);

        this._maskUpdate(this._torque, 4);
      }
      /**
       * @en
       * Gets or sets the torsional force in the local coordinate system.
       * @zh
       * 获取或设置本地坐标系下的扭转力。
       */

    }, {
      key: "localTorque",
      get: function get() {
        return this._localTorque;
      },
      set: function set(value) {
        _vec.Vec3.copy(this._localTorque, value);

        this._maskUpdate(this._localTorque, 8);
      }
    }]);

    return ConstantForce;
  }(_component.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_force", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _vec.Vec3();
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_localForce", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _vec.Vec3();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_torque", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _vec.Vec3();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_localTorque", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _vec.Vec3();
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "force", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "force"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "localForce", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "localForce"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "torque", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "torque"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "localTorque", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "localTorque"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.ConstantForce = ConstantForce;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29uc3RhbnQtZm9yY2UudHMiXSwibmFtZXMiOlsiQ29uc3RhbnRGb3JjZSIsIlJpZ2lkQm9keSIsImRpc2FsbG93TXVsdGlwbGUiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9yaWdpZEJvZHkiLCJfbWFzayIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJfbWFza1VwZGF0ZSIsIl9mb3JjZSIsIl9sb2NhbEZvcmNlIiwiX3RvcnF1ZSIsIl9sb2NhbFRvcnF1ZSIsImR0IiwiRURJVE9SIiwiYXBwbHlGb3JjZSIsImFwcGx5TG9jYWxGb3JjZSIsImxvY2FsRm9yY2UiLCJhcHBseVRvcnF1ZSIsImFwcGx5TG9jYWxUb3JxdWUiLCJ0IiwibSIsInN0cmljdEVxdWFscyIsIlZlYzMiLCJaRVJPIiwidmFsdWUiLCJjb3B5IiwiQ29tcG9uZW50Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7TUFZYUEsYSxXQU5aLG9CQUFRLGtCQUFSLEMsVUFDQSxpQkFBSyx1QkFBTCxDLFVBQ0EsNkJBQWlCQyxvQkFBakIsQyxVQUNBLGlCQUFLLHVCQUFMLEMsVUEyQkkseUJBQWEsQ0FBYixDLFVBQ0Esb0JBQVEsVUFBUixDLFVBZ0JBLHlCQUFhLENBQWIsQyxVQUNBLG9CQUFRLFVBQVIsQyxVQWdCQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxZQUFSLEMsV0FnQkEseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsWUFBUixDLGlFQTlFSkMsdUIsZUFDQUMsd0I7Ozs7Ozs7Ozs7Ozs7OztZQUdXQyxVLEdBQStCLEk7Ozs7Ozs7Ozs7WUFjL0JDLEssR0FBZ0IsQzs7Ozs7OytCQXNFUDtBQUNiLGFBQUtELFVBQUwsR0FBa0IsS0FBS0UsSUFBTCxDQUFVQyxZQUFWLENBQXVCTixvQkFBdkIsQ0FBbEI7O0FBQ0EsYUFBS08sV0FBTCxDQUFpQixLQUFLQyxNQUF0QixFQUE4QixDQUE5Qjs7QUFDQSxhQUFLRCxXQUFMLENBQWlCLEtBQUtFLFdBQXRCLEVBQW1DLENBQW5DOztBQUNBLGFBQUtGLFdBQUwsQ0FBaUIsS0FBS0csT0FBdEIsRUFBK0IsQ0FBL0I7O0FBQ0EsYUFBS0gsV0FBTCxDQUFpQixLQUFLSSxZQUF0QixFQUFvQyxDQUFwQztBQUNIOzs7aUNBRWtCQyxFLEVBQVk7QUFDM0IsWUFBSSxDQUFDQyx3QkFBTCxFQUFhO0FBQ1QsY0FBSSxLQUFLVixVQUFMLElBQW1CLElBQW5CLElBQTJCLEtBQUtDLEtBQUwsSUFBYyxDQUE3QyxFQUFnRDtBQUM1QyxnQkFBSSxLQUFLQSxLQUFMLEdBQWEsQ0FBakIsRUFBb0IsS0FBS0QsVUFBTCxDQUFnQlcsVUFBaEIsQ0FBMkIsS0FBS04sTUFBaEM7QUFDcEIsZ0JBQUksS0FBS0osS0FBTCxHQUFhLENBQWpCLEVBQW9CLEtBQUtELFVBQUwsQ0FBZ0JZLGVBQWhCLENBQWdDLEtBQUtDLFVBQXJDO0FBQ3BCLGdCQUFJLEtBQUtaLEtBQUwsR0FBYSxDQUFqQixFQUFvQixLQUFLRCxVQUFMLENBQWdCYyxXQUFoQixDQUE0QixLQUFLUCxPQUFqQztBQUNwQixnQkFBSSxLQUFLTixLQUFMLEdBQWEsQ0FBakIsRUFBb0IsS0FBS0QsVUFBTCxDQUFnQmUsZ0JBQWhCLENBQWlDLEtBQUtQLFlBQXRDO0FBQ3ZCO0FBQ0o7QUFDSjs7O2tDQUVvQlEsQyxFQUFTQyxDLEVBQVc7QUFDckMsWUFBSUQsQ0FBQyxDQUFDRSxZQUFGLENBQWVDLFVBQUtDLElBQXBCLENBQUosRUFBK0I7QUFDM0IsZUFBS25CLEtBQUwsSUFBYyxDQUFDZ0IsQ0FBZjtBQUNILFNBRkQsTUFFTztBQUNILGVBQUtoQixLQUFMLElBQWNnQixDQUFkO0FBQ0g7QUFDSjs7OztBQTdGRDs7Ozs7OzBCQVFvQjtBQUNoQixlQUFPLEtBQUtaLE1BQVo7QUFDSCxPO3dCQUVpQmdCLEssRUFBYTtBQUMzQkYsa0JBQUtHLElBQUwsQ0FBVSxLQUFLakIsTUFBZixFQUF1QmdCLEtBQXZCOztBQUNBLGFBQUtqQixXQUFMLENBQWlCLEtBQUtDLE1BQXRCLEVBQThCLENBQTlCO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQVF5QjtBQUNyQixlQUFPLEtBQUtDLFdBQVo7QUFDSCxPO3dCQUVzQmUsSyxFQUFhO0FBQ2hDRixrQkFBS0csSUFBTCxDQUFVLEtBQUtoQixXQUFmLEVBQTRCZSxLQUE1Qjs7QUFDQSxhQUFLakIsV0FBTCxDQUFpQixLQUFLUyxVQUF0QixFQUFrQyxDQUFsQztBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFRcUI7QUFDakIsZUFBTyxLQUFLTixPQUFaO0FBQ0gsTzt3QkFFa0JjLEssRUFBYTtBQUM1QkYsa0JBQUtHLElBQUwsQ0FBVSxLQUFLZixPQUFmLEVBQXdCYyxLQUF4Qjs7QUFDQSxhQUFLakIsV0FBTCxDQUFpQixLQUFLRyxPQUF0QixFQUErQixDQUEvQjtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFRMEI7QUFDdEIsZUFBTyxLQUFLQyxZQUFaO0FBQ0gsTzt3QkFFdUJhLEssRUFBYTtBQUNqQ0Ysa0JBQUtHLElBQUwsQ0FBVSxLQUFLZCxZQUFmLEVBQTZCYSxLQUE3Qjs7QUFDQSxhQUFLakIsV0FBTCxDQUFpQixLQUFLSSxZQUF0QixFQUFvQyxDQUFwQztBQUNIOzs7O0lBcEY4QmUsb0Isa0ZBSTlCQyxtQjs7Ozs7YUFDK0IsSUFBSUwsU0FBSixFOztrRkFFL0JLLG1COzs7OzthQUNvQyxJQUFJTCxTQUFKLEU7OzhFQUVwQ0ssbUI7Ozs7O2FBQ2dDLElBQUlMLFNBQUosRTs7bUZBRWhDSyxtQjs7Ozs7YUFDcUMsSUFBSUwsU0FBSixFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGNjY2xhc3MsXHJcbiAgICBoZWxwLFxyXG4gICAgZXhlY3V0ZUluRWRpdE1vZGUsXHJcbiAgICBtZW51LFxyXG4gICAgcmVxdWlyZUNvbXBvbmVudCxcclxuICAgIGRpc2FsbG93TXVsdGlwbGUsXHJcbiAgICB0b29sdGlwLFxyXG4gICAgZGlzcGxheU9yZGVyLFxyXG4gICAgc2VyaWFsaXphYmxlLFxyXG59IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2NvcmUvY29tcG9uZW50cy9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBSaWdpZEJvZHkgfSBmcm9tICcuL3JpZ2lkLWJvZHknO1xyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9tYXRoL3ZlYzMnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBBIHRvb2wgY29tcG9uZW50IHRvIGhlbHAgYXBwbHkgZm9yY2UgdG8gdGhlIHJpZ2lkIGJvZHkgYXQgZWFjaCBmcmFtZS5cclxuICogQHpoXHJcbiAqIOWcqOavj+W4p+WvueS4gOS4quWImuS9k+aWveWKoOaMgee7reeahOWKm++8jOS+nei1liBSaWdpZEJvZHkg57uE5Lu244CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQ29uc3RhbnRGb3JjZScpXHJcbkBoZWxwKCdpMThuOmNjLkNvbnN0YW50Rm9yY2UnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChSaWdpZEJvZHkpXHJcbkBtZW51KCdQaHlzaWNzL0NvbnN0YW50Rm9yY2UnKVxyXG5AZGlzYWxsb3dNdWx0aXBsZVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuZXhwb3J0IGNsYXNzIENvbnN0YW50Rm9yY2UgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgX3JpZ2lkQm9keTogUmlnaWRCb2R5IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZm9yY2U6IFZlYzMgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xvY2FsRm9yY2U6IFZlYzMgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3RvcnF1ZTogVmVjMyA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfbG9jYWxUb3JxdWU6IFZlYzMgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIHByaXZhdGUgX21hc2s6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyBmb3JjZXMgaW4gd29ybGQgY29vcmRpbmF0ZXMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruS4lueVjOWdkOagh+ezu+S4i+eahOWKm+OAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBAdG9vbHRpcCgn5LiW55WM5Z2Q5qCH57O75LiL55qE5YqbJylcclxuICAgIHB1YmxpYyBnZXQgZm9yY2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JjZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGZvcmNlICh2YWx1ZTogVmVjMykge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9mb3JjZSwgdmFsdWUpO1xyXG4gICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fZm9yY2UsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIGZvcmNlcyBpbiB0aGUgbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruacrOWcsOWdkOagh+ezu+S4i+eahOWKm+OAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBAdG9vbHRpcCgn5pys5Zyw5Z2Q5qCH57O75LiL55qE5YqbJylcclxuICAgIHB1YmxpYyBnZXQgbG9jYWxGb3JjZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsRm9yY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBsb2NhbEZvcmNlICh2YWx1ZTogVmVjMykge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9sb2NhbEZvcmNlLCB2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLmxvY2FsRm9yY2UsIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHRvcnNpb25hbCBmb3JjZSBpbiB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u5LiW55WM5Z2Q5qCH57O75LiL55qE5omt6L2s5Yqb44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEB0b29sdGlwKCfkuJbnlYzlnZDmoIfns7vkuIvnmoTmia3ovazlipsnKVxyXG4gICAgcHVibGljIGdldCB0b3JxdWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90b3JxdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0b3JxdWUgKHZhbHVlOiBWZWMzKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3RvcnF1ZSwgdmFsdWUpO1xyXG4gICAgICAgIHRoaXMuX21hc2tVcGRhdGUodGhpcy5fdG9ycXVlLCA0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSB0b3JzaW9uYWwgZm9yY2UgaW4gdGhlIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7mnKzlnLDlnZDmoIfns7vkuIvnmoTmia3ovazlipvjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigzKVxyXG4gICAgQHRvb2x0aXAoJ+acrOWcsOWdkOagh+ezu+S4i+eahOaJrei9rOWKmycpXHJcbiAgICBwdWJsaWMgZ2V0IGxvY2FsVG9ycXVlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxUb3JxdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBsb2NhbFRvcnF1ZSAodmFsdWU6IFZlYzMpIHtcclxuICAgICAgICBWZWMzLmNvcHkodGhpcy5fbG9jYWxUb3JxdWUsIHZhbHVlKTtcclxuICAgICAgICB0aGlzLl9tYXNrVXBkYXRlKHRoaXMuX2xvY2FsVG9ycXVlLCA4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICB0aGlzLl9yaWdpZEJvZHkgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KFJpZ2lkQm9keSk7XHJcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl9mb3JjZSwgMSk7XHJcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl9sb2NhbEZvcmNlLCAyKTtcclxuICAgICAgICB0aGlzLl9tYXNrVXBkYXRlKHRoaXMuX3RvcnF1ZSwgNCk7XHJcbiAgICAgICAgdGhpcy5fbWFza1VwZGF0ZSh0aGlzLl9sb2NhbFRvcnF1ZSwgOCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxhdGVVcGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmlnaWRCb2R5ICE9IG51bGwgJiYgdGhpcy5fbWFzayAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWFzayAmIDEpIHRoaXMuX3JpZ2lkQm9keS5hcHBseUZvcmNlKHRoaXMuX2ZvcmNlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrICYgMikgdGhpcy5fcmlnaWRCb2R5LmFwcGx5TG9jYWxGb3JjZSh0aGlzLmxvY2FsRm9yY2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21hc2sgJiA0KSB0aGlzLl9yaWdpZEJvZHkuYXBwbHlUb3JxdWUodGhpcy5fdG9ycXVlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXNrICYgOCkgdGhpcy5fcmlnaWRCb2R5LmFwcGx5TG9jYWxUb3JxdWUodGhpcy5fbG9jYWxUb3JxdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21hc2tVcGRhdGUgKHQ6IFZlYzMsIG06IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0LnN0cmljdEVxdWFscyhWZWMzLlpFUk8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hc2sgJj0gfm07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFzayB8PSBtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=