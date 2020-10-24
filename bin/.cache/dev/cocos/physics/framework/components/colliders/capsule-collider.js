(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "./collider.js", "../../../../core/default-constants.js", "../../physics-enum.js", "../../../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("./collider.js"), require("../../../../core/default-constants.js"), require("../../physics-enum.js"), require("../../../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.collider, global.defaultConstants, global.physicsEnum, global.index);
    global.capsuleCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _collider, _defaultConstants, _physicsEnum, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CapsuleCollider = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

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
   * Capsule collider component.
   * @zh
   * 胶囊体碰撞器。
   */
  var CapsuleCollider = (_dec = (0, _index.ccclass)('cc.CapsuleCollider'), _dec2 = (0, _index.help)('i18n:cc.CapsuleCollider'), _dec3 = (0, _index.menu)('Physics/CapsuleCollider'), _dec4 = (0, _index.tooltip)('本地坐标系下胶囊体上的球的半径'), _dec5 = (0, _index.tooltip)('本地坐标系下胶囊体上的圆柱体的高度'), _dec6 = (0, _index.type)(_physicsEnum.EAxisDirection), _dec7 = (0, _index.tooltip)("本地坐标系下胶囊体的朝向"), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(CapsuleCollider, _Collider);

    _createClass(CapsuleCollider, [{
      key: "radius",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the radius of the sphere on the capsule body, in local space.
       * @zh
       * 获取或设置胶囊体在本地坐标系下的球半径。
       */
      get: function get() {
        return this._radius;
      },
      set: function set(value) {
        if (value < 0) value = 0;
        this._radius = value;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setRadius(value);
        }
      }
      /**
       * @en
       * Gets or sets the cylinder on the capsule body is at the corresponding axial height, in local space.
       * @zh
       * 获取或设置在本地坐标系下的胶囊体上圆柱体的高度。
       */

    }, {
      key: "cylinderHeight",
      get: function get() {
        return this._cylinderHeight;
      },
      set: function set(value) {
        if (value < 0) value = 0;
        this._cylinderHeight = value;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setCylinderHeight(value);
        }
      }
      /**
       * @en
       * Gets or sets the capsule direction, in local space.
       * @zh
       * 获取或设置在本地坐标系下胶囊体的方向。
       */

    }, {
      key: "direction",
      get: function get() {
        return this._direction;
      },
      set: function set(value) {
        value = Math.floor(value);
        if (value < _physicsEnum.EAxisDirection.X_AXIS || value > _physicsEnum.EAxisDirection.Z_AXIS) return;
        this._direction = value;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setDirection(value);
        }
      }
      /**
       * @en
       * Gets or sets the capsule height, in local space, with the minimum value being the diameter of the sphere.
       * @zh
       * 获取或设置在本地坐标系下胶囊体的高度，最小值为球的直径。
       */

    }, {
      key: "height",
      get: function get() {
        return this._radius * 2 + this._cylinderHeight;
      },
      set: function set(value) {
        var ch = value - this._radius * 2;
        if (ch < 0) ch = 0;
        this.cylinderHeight = ch;
      }
      /**
       * @en
       * Gets the capsule body is at the corresponding axial height, in world space.
       * @zh
       * 获取胶囊体在世界坐标系下相应胶囊体朝向上的高度，只读属性。
       */

    }, {
      key: "worldHeight",
      get: function get() {
        return this._radius * 2 * this._getRadiusScale() + this._cylinderHeight * this._getHeightScale();
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

    function CapsuleCollider() {
      var _this;

      _classCallCheck(this, CapsuleCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CapsuleCollider).call(this, _physicsEnum.EColliderType.CAPSULE));

      _initializerDefineProperty(_this, "_radius", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_cylinderHeight", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_direction", _descriptor3, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(CapsuleCollider, [{
      key: "_getRadiusScale",
      value: function _getRadiusScale() {
        if (this.node == null) return 1;
        var ws = this.node.worldScale;
        if (this._direction == _physicsEnum.EAxisDirection.Y_AXIS) return Math.abs((0, _index2.absMax)(ws.x, ws.z));else if (this._direction == _physicsEnum.EAxisDirection.X_AXIS) return Math.abs((0, _index2.absMax)(ws.y, ws.z));else return Math.abs((0, _index2.absMax)(ws.x, ws.y));
      }
    }, {
      key: "_getHeightScale",
      value: function _getHeightScale() {
        if (this.node == null) return 1;
        var ws = this.node.worldScale;
        if (this._direction == _physicsEnum.EAxisDirection.Y_AXIS) return Math.abs(ws.y);else if (this._direction == _physicsEnum.EAxisDirection.X_AXIS) return Math.abs(ws.x);else return Math.abs(ws.z);
      }
    }]);

    return CapsuleCollider;
  }(_collider.Collider), _temp), (_applyDecoratedDescriptor(_class2.prototype, "radius", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "radius"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cylinderHeight", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "cylinderHeight"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "direction"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_radius", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.5;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_cylinderHeight", [_index.serializable], {
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
  _exports.CapsuleCollider = CapsuleCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL2NhcHN1bGUtY29sbGlkZXIudHMiXSwibmFtZXMiOlsiQ2Fwc3VsZUNvbGxpZGVyIiwiRUF4aXNEaXJlY3Rpb24iLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9yYWRpdXMiLCJ2YWx1ZSIsIkVESVRPUiIsIlRFU1QiLCJzaGFwZSIsInNldFJhZGl1cyIsIl9jeWxpbmRlckhlaWdodCIsInNldEN5bGluZGVySGVpZ2h0IiwiX2RpcmVjdGlvbiIsIk1hdGgiLCJmbG9vciIsIlhfQVhJUyIsIlpfQVhJUyIsInNldERpcmVjdGlvbiIsImNoIiwiY3lsaW5kZXJIZWlnaHQiLCJfZ2V0UmFkaXVzU2NhbGUiLCJfZ2V0SGVpZ2h0U2NhbGUiLCJfc2hhcGUiLCJFQ29sbGlkZXJUeXBlIiwiQ0FQU1VMRSIsIm5vZGUiLCJ3cyIsIndvcmxkU2NhbGUiLCJZX0FYSVMiLCJhYnMiLCJ4IiwieiIsInkiLCJDb2xsaWRlciIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7O01BVWFBLGUsV0FKWixvQkFBUSxvQkFBUixDLFVBQ0EsaUJBQUsseUJBQUwsQyxVQUNBLGlCQUFLLHlCQUFMLEMsVUFXSSxvQkFBUSxpQkFBUixDLFVBbUJBLG9CQUFRLG1CQUFSLEMsVUFtQkEsaUJBQUtDLDJCQUFMLEMsVUFDQSxvQkFBUSxjQUFSLEMsa0RBakRKQyx3Qjs7Ozs7QUFFRzs7QUFFQTs7Ozs7OzBCQU9xQjtBQUNqQixlQUFPLEtBQUtDLE9BQVo7QUFDSCxPO3dCQUVrQkMsSyxFQUFPO0FBQ3RCLFlBQUlBLEtBQUssR0FBRyxDQUFaLEVBQWVBLEtBQUssR0FBRyxDQUFSO0FBQ2YsYUFBS0QsT0FBTCxHQUFlQyxLQUFmOztBQUNBLFlBQUksQ0FBQ0Msd0JBQUQsSUFBVyxDQUFDQyxzQkFBaEIsRUFBc0I7QUFDbEIsZUFBS0MsS0FBTCxDQUFXQyxTQUFYLENBQXFCSixLQUFyQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQU82QjtBQUN6QixlQUFPLEtBQUtLLGVBQVo7QUFDSCxPO3dCQUUwQkwsSyxFQUFPO0FBQzlCLFlBQUlBLEtBQUssR0FBRyxDQUFaLEVBQWVBLEtBQUssR0FBRyxDQUFSO0FBQ2YsYUFBS0ssZUFBTCxHQUF1QkwsS0FBdkI7O0FBQ0EsWUFBSSxDQUFDQyx3QkFBRCxJQUFXLENBQUNDLHNCQUFoQixFQUFzQjtBQUNsQixlQUFLQyxLQUFMLENBQVdHLGlCQUFYLENBQTZCTixLQUE3QjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQVF3QjtBQUNwQixlQUFPLEtBQUtPLFVBQVo7QUFDSCxPO3dCQUVxQlAsSyxFQUF1QjtBQUN6Q0EsUUFBQUEsS0FBSyxHQUFHUSxJQUFJLENBQUNDLEtBQUwsQ0FBV1QsS0FBWCxDQUFSO0FBQ0EsWUFBSUEsS0FBSyxHQUFHSCw0QkFBZWEsTUFBdkIsSUFBaUNWLEtBQUssR0FBR0gsNEJBQWVjLE1BQTVELEVBQW9FO0FBQ3BFLGFBQUtKLFVBQUwsR0FBa0JQLEtBQWxCOztBQUNBLFlBQUksQ0FBQ0Msd0JBQUQsSUFBVyxDQUFDQyxzQkFBaEIsRUFBc0I7QUFDbEIsZUFBS0MsS0FBTCxDQUFXUyxZQUFYLENBQXdCWixLQUF4QjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQU1xQjtBQUNqQixlQUFPLEtBQUtELE9BQUwsR0FBZSxDQUFmLEdBQW1CLEtBQUtNLGVBQS9CO0FBQ0gsTzt3QkFFa0JMLEssRUFBTztBQUN0QixZQUFJYSxFQUFFLEdBQUdiLEtBQUssR0FBRyxLQUFLRCxPQUFMLEdBQWUsQ0FBaEM7QUFDQSxZQUFJYyxFQUFFLEdBQUcsQ0FBVCxFQUFZQSxFQUFFLEdBQUcsQ0FBTDtBQUNaLGFBQUtDLGNBQUwsR0FBc0JELEVBQXRCO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQU0wQjtBQUN0QixlQUFPLEtBQUtkLE9BQUwsR0FBZSxDQUFmLEdBQW1CLEtBQUtnQixlQUFMLEVBQW5CLEdBQTRDLEtBQUtWLGVBQUwsR0FBdUIsS0FBS1csZUFBTCxFQUExRTtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFNb0I7QUFDaEIsZUFBTyxLQUFLQyxNQUFaO0FBQ0gsTyxDQUVEOzs7O0FBV0EsK0JBQWU7QUFBQTs7QUFBQTs7QUFDWCwyRkFBTUMsMkJBQWNDLE9BQXBCOztBQURXOztBQUFBOztBQUFBOztBQUFBO0FBRWQ7Ozs7d0NBRTBCO0FBQ3ZCLFlBQUksS0FBS0MsSUFBTCxJQUFhLElBQWpCLEVBQXVCLE9BQU8sQ0FBUDtBQUN2QixZQUFNQyxFQUFFLEdBQUcsS0FBS0QsSUFBTCxDQUFVRSxVQUFyQjtBQUNBLFlBQUksS0FBS2YsVUFBTCxJQUFtQlYsNEJBQWUwQixNQUF0QyxFQUNJLE9BQU9mLElBQUksQ0FBQ2dCLEdBQUwsQ0FBUyxvQkFBT0gsRUFBRSxDQUFDSSxDQUFWLEVBQWFKLEVBQUUsQ0FBQ0ssQ0FBaEIsQ0FBVCxDQUFQLENBREosS0FFSyxJQUFJLEtBQUtuQixVQUFMLElBQW1CViw0QkFBZWEsTUFBdEMsRUFDRCxPQUFPRixJQUFJLENBQUNnQixHQUFMLENBQVMsb0JBQU9ILEVBQUUsQ0FBQ00sQ0FBVixFQUFhTixFQUFFLENBQUNLLENBQWhCLENBQVQsQ0FBUCxDQURDLEtBR0QsT0FBT2xCLElBQUksQ0FBQ2dCLEdBQUwsQ0FBUyxvQkFBT0gsRUFBRSxDQUFDSSxDQUFWLEVBQWFKLEVBQUUsQ0FBQ00sQ0FBaEIsQ0FBVCxDQUFQO0FBQ1A7Ozt3Q0FFMEI7QUFDdkIsWUFBSSxLQUFLUCxJQUFMLElBQWEsSUFBakIsRUFBdUIsT0FBTyxDQUFQO0FBQ3ZCLFlBQU1DLEVBQUUsR0FBRyxLQUFLRCxJQUFMLENBQVVFLFVBQXJCO0FBQ0EsWUFBSSxLQUFLZixVQUFMLElBQW1CViw0QkFBZTBCLE1BQXRDLEVBQ0ksT0FBT2YsSUFBSSxDQUFDZ0IsR0FBTCxDQUFTSCxFQUFFLENBQUNNLENBQVosQ0FBUCxDQURKLEtBRUssSUFBSSxLQUFLcEIsVUFBTCxJQUFtQlYsNEJBQWVhLE1BQXRDLEVBQ0QsT0FBT0YsSUFBSSxDQUFDZ0IsR0FBTCxDQUFTSCxFQUFFLENBQUNJLENBQVosQ0FBUCxDQURDLEtBR0QsT0FBT2pCLElBQUksQ0FBQ2dCLEdBQUwsQ0FBU0gsRUFBRSxDQUFDSyxDQUFaLENBQVA7QUFDUDs7OztJQXJJZ0NFLGtCLHNpQkFvR2hDQyxtQjs7Ozs7YUFDaUIsRzs7c0ZBRWpCQSxtQjs7Ozs7YUFDeUIsQzs7aUZBRXpCQSxtQjs7Ozs7YUFDb0JoQyw0QkFBZTBCLE0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgY2NjbGFzcyxcclxuICAgIGhlbHAsXHJcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcclxuICAgIG1lbnUsXHJcbiAgICB0b29sdGlwLFxyXG4gICAgdHlwZSxcclxuICAgIHNlcmlhbGl6YWJsZSxcclxufSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xsaWRlciB9IGZyb20gJy4vY29sbGlkZXInO1xyXG5pbXBvcnQgeyBJQ2Fwc3VsZVNoYXBlIH0gZnJvbSAnLi4vLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBFRElUT1IsIFRFU1QgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBFQXhpc0RpcmVjdGlvbiwgRUNvbGxpZGVyVHlwZSB9IGZyb20gJy4uLy4uL3BoeXNpY3MtZW51bSc7XHJcbmltcG9ydCB7IGFic01heCB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBDYXBzdWxlIGNvbGxpZGVyIGNvbXBvbmVudC5cclxuICogQHpoXHJcbiAqIOiDtuWbiuS9k+eisOaSnuWZqOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkNhcHN1bGVDb2xsaWRlcicpXHJcbkBoZWxwKCdpMThuOmNjLkNhcHN1bGVDb2xsaWRlcicpXHJcbkBtZW51KCdQaHlzaWNzL0NhcHN1bGVDb2xsaWRlcicpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgQ2Fwc3VsZUNvbGxpZGVyIGV4dGVuZHMgQ29sbGlkZXIge1xyXG4gICAgLy8vIFBVQkxJQyBQUk9QRVJUWSBHRVRURVJcXFNFVFRFUiAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSByYWRpdXMgb2YgdGhlIHNwaGVyZSBvbiB0aGUgY2Fwc3VsZSBib2R5LCBpbiBsb2NhbCBzcGFjZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u6IO25ZuK5L2T5Zyo5pys5Zyw5Z2Q5qCH57O75LiL55qE55CD5Y2K5b6E44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCfmnKzlnLDlnZDmoIfns7vkuIvog7blm4rkvZPkuIrnmoTnkIPnmoTljYrlvoQnKVxyXG4gICAgcHVibGljIGdldCByYWRpdXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByYWRpdXMgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAwO1xyXG4gICAgICAgIHRoaXMuX3JhZGl1cyA9IHZhbHVlO1xyXG4gICAgICAgIGlmICghRURJVE9SICYmICFURVNUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUuc2V0UmFkaXVzKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgY3lsaW5kZXIgb24gdGhlIGNhcHN1bGUgYm9keSBpcyBhdCB0aGUgY29ycmVzcG9uZGluZyBheGlhbCBoZWlnaHQsIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7lnKjmnKzlnLDlnZDmoIfns7vkuIvnmoTog7blm4rkvZPkuIrlnIbmn7HkvZPnmoTpq5jluqbjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+acrOWcsOWdkOagh+ezu+S4i+iDtuWbiuS9k+S4iueahOWchuafseS9k+eahOmrmOW6picpXHJcbiAgICBwdWJsaWMgZ2V0IGN5bGluZGVySGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3lsaW5kZXJIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjeWxpbmRlckhlaWdodCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDA7XHJcbiAgICAgICAgdGhpcy5fY3lsaW5kZXJIZWlnaHQgPSB2YWx1ZTtcclxuICAgICAgICBpZiAoIUVESVRPUiAmJiAhVEVTVCkge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnNldEN5bGluZGVySGVpZ2h0KHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgY2Fwc3VsZSBkaXJlY3Rpb24sIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7lnKjmnKzlnLDlnZDmoIfns7vkuIvog7blm4rkvZPnmoTmlrnlkJHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoRUF4aXNEaXJlY3Rpb24pXHJcbiAgICBAdG9vbHRpcChcIuacrOWcsOWdkOagh+ezu+S4i+iDtuWbiuS9k+eahOacneWQkVwiKVxyXG4gICAgcHVibGljIGdldCBkaXJlY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBkaXJlY3Rpb24gKHZhbHVlOiBFQXhpc0RpcmVjdGlvbikge1xyXG4gICAgICAgIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgRUF4aXNEaXJlY3Rpb24uWF9BWElTIHx8IHZhbHVlID4gRUF4aXNEaXJlY3Rpb24uWl9BWElTKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXREaXJlY3Rpb24odmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBjYXBzdWxlIGhlaWdodCwgaW4gbG9jYWwgc3BhY2UsIHdpdGggdGhlIG1pbmltdW0gdmFsdWUgYmVpbmcgdGhlIGRpYW1ldGVyIG9mIHRoZSBzcGhlcmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruWcqOacrOWcsOWdkOagh+ezu+S4i+iDtuWbiuS9k+eahOmrmOW6pu+8jOacgOWwj+WAvOS4uueQg+eahOebtOW+hOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGhlaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhZGl1cyAqIDIgKyB0aGlzLl9jeWxpbmRlckhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGhlaWdodCAodmFsdWUpIHtcclxuICAgICAgICBsZXQgY2ggPSB2YWx1ZSAtIHRoaXMuX3JhZGl1cyAqIDI7XHJcbiAgICAgICAgaWYgKGNoIDwgMCkgY2ggPSAwO1xyXG4gICAgICAgIHRoaXMuY3lsaW5kZXJIZWlnaHQgPSBjaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgY2Fwc3VsZSBib2R5IGlzIGF0IHRoZSBjb3JyZXNwb25kaW5nIGF4aWFsIGhlaWdodCwgaW4gd29ybGQgc3BhY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluiDtuWbiuS9k+WcqOS4lueVjOWdkOagh+ezu+S4i+ebuOW6lOiDtuWbiuS9k+acneWQkeS4iueahOmrmOW6pu+8jOWPquivu+WxnuaAp+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkSGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzICogMiAqIHRoaXMuX2dldFJhZGl1c1NjYWxlKCkgKyB0aGlzLl9jeWxpbmRlckhlaWdodCAqIHRoaXMuX2dldEhlaWdodFNjYWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHdyYXBwZXIgb2JqZWN0LCB0aHJvdWdoIHdoaWNoIHRoZSBsb3dMZXZlbCBpbnN0YW5jZSBjYW4gYmUgYWNjZXNzZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluWwgeijheWvueixoe+8jOmAmui/h+atpOWvueixoeWPr+S7peiuv+mXruWIsOW6leWxguWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNoYXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGUgYXMgSUNhcHN1bGVTaGFwZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8gUFJJVkFURSBQUk9QRVJUWSAvLy9cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9yYWRpdXMgPSAwLjU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfY3lsaW5kZXJIZWlnaHQgPSAxO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2RpcmVjdGlvbiA9IEVBeGlzRGlyZWN0aW9uLllfQVhJUztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRUNvbGxpZGVyVHlwZS5DQVBTVUxFKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRSYWRpdXNTY2FsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZSA9PSBudWxsKSByZXR1cm4gMTtcclxuICAgICAgICBjb25zdCB3cyA9IHRoaXMubm9kZS53b3JsZFNjYWxlO1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gRUF4aXNEaXJlY3Rpb24uWV9BWElTKVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoYWJzTWF4KHdzLngsIHdzLnopKTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gRUF4aXNEaXJlY3Rpb24uWF9BWElTKVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoYWJzTWF4KHdzLnksIHdzLnopKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhhYnNNYXgod3MueCwgd3MueSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEhlaWdodFNjYWxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5ub2RlID09IG51bGwpIHJldHVybiAxO1xyXG4gICAgICAgIGNvbnN0IHdzID0gdGhpcy5ub2RlLndvcmxkU2NhbGU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PSBFQXhpc0RpcmVjdGlvbi5ZX0FYSVMpXHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh3cy55KTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24gPT0gRUF4aXNEaXJlY3Rpb24uWF9BWElTKVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMod3MueCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMod3Mueik7XHJcbiAgICB9XHJcbn1cclxuIl19