(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "../../../../core/math/index.js", "./collider.js", "../../physics-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("../../../../core/math/index.js"), require("./collider.js"), require("../../physics-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.collider, global.physicsEnum);
    global.boxCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _collider, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BoxCollider = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _temp;

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
   * Box collider component.
   * @zh
   * 盒子碰撞器。
   */
  var BoxCollider = (_dec = (0, _index.ccclass)('cc.BoxCollider'), _dec2 = (0, _index.help)('i18n:cc.BoxCollider'), _dec3 = (0, _index.menu)('Physics/BoxCollider'), _dec4 = (0, _index.type)(_index2.Vec3), _dec5 = (0, _index.tooltip)('盒的大小，即长、宽、高'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(BoxCollider, _Collider);

    _createClass(BoxCollider, [{
      key: "size",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the size of the box, in local space.
       * @zh
       * 获取或设置盒的大小。
       */
      get: function get() {
        return this._size;
      },
      set: function set(value) {
        _index2.Vec3.copy(this._size, value);

        if (this._shape) {
          this.shape.setSize(this._size);
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

    function BoxCollider() {
      var _this;

      _classCallCheck(this, BoxCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BoxCollider).call(this, _physicsEnum.EColliderType.BOX));

      _initializerDefineProperty(_this, "_size", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    return BoxCollider;
  }(_collider.Collider), _temp), (_applyDecoratedDescriptor(_class2.prototype, "size", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "size"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_size", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(1, 1, 1);
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.BoxCollider = BoxCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL2JveC1jb2xsaWRlci50cyJdLCJuYW1lcyI6WyJCb3hDb2xsaWRlciIsIlZlYzMiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9zaXplIiwidmFsdWUiLCJjb3B5IiwiX3NoYXBlIiwic2hhcGUiLCJzZXRTaXplIiwiRUNvbGxpZGVyVHlwZSIsIkJPWCIsIkNvbGxpZGVyIiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBOzs7Ozs7TUFVYUEsVyxXQUpaLG9CQUFRLGdCQUFSLEMsVUFDQSxpQkFBSyxxQkFBTCxDLFVBQ0EsaUJBQUsscUJBQUwsQyxVQVlJLGlCQUFLQyxZQUFMLEMsVUFDQSxvQkFBUSxhQUFSLEMsa0RBWkpDLHdCOzs7OztBQUdHOztBQUVBOzs7Ozs7MEJBUW1CO0FBQ2YsZUFBTyxLQUFLQyxLQUFaO0FBQ0gsTzt3QkFFZ0JDLEssRUFBTztBQUNwQkgscUJBQUtJLElBQUwsQ0FBVSxLQUFLRixLQUFmLEVBQXNCQyxLQUF0Qjs7QUFDQSxZQUFJLEtBQUtFLE1BQVQsRUFBaUI7QUFDYixlQUFLQyxLQUFMLENBQVdDLE9BQVgsQ0FBbUIsS0FBS0wsS0FBeEI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OzswQkFNb0I7QUFDaEIsZUFBTyxLQUFLRyxNQUFaO0FBQ0gsTyxDQUVEOzs7O0FBS0EsMkJBQWU7QUFBQTs7QUFBQTs7QUFDWCx1RkFBTUcsMkJBQWNDLEdBQXBCOztBQURXOztBQUFBO0FBRWQ7OztJQXhDNEJDLGtCLHNPQW1DNUJDLG1COzs7OzthQUNxQixJQUFJWCxZQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgY2NjbGFzcyxcclxuICAgIGhlbHAsXHJcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcclxuICAgIG1lbnUsXHJcbiAgICB0b29sdGlwLFxyXG4gICAgdHlwZSxcclxuICAgIHNlcmlhbGl6YWJsZSxcclxufSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgQ29sbGlkZXIgfSBmcm9tICcuL2NvbGxpZGVyJztcclxuaW1wb3J0IHsgSUJveFNoYXBlIH0gZnJvbSAnLi4vLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBFQ29sbGlkZXJUeXBlIH0gZnJvbSAnLi4vLi4vcGh5c2ljcy1lbnVtJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQm94IGNvbGxpZGVyIGNvbXBvbmVudC5cclxuICogQHpoXHJcbiAqIOebkuWtkOeisOaSnuWZqOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkJveENvbGxpZGVyJylcclxuQGhlbHAoJ2kxOG46Y2MuQm94Q29sbGlkZXInKVxyXG5AbWVudSgnUGh5c2ljcy9Cb3hDb2xsaWRlcicpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgQm94Q29sbGlkZXIgZXh0ZW5kcyBDb2xsaWRlciB7XHJcblxyXG4gICAgLy8vIFBVQkxJQyBQUk9QRVJUWSBHRVRURVJcXFNFVFRFUiAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBzaXplIG9mIHRoZSBib3gsIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7nm5LnmoTlpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVmVjMylcclxuICAgIEB0b29sdGlwKCfnm5LnmoTlpKflsI/vvIzljbPplb/jgIHlrr3jgIHpq5gnKVxyXG4gICAgcHVibGljIGdldCBzaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNpemUgKHZhbHVlKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3NpemUsIHZhbHVlKTtcclxuICAgICAgICBpZiAodGhpcy5fc2hhcGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXRTaXplKHRoaXMuX3NpemUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgd3JhcHBlciBvYmplY3QsIHRocm91Z2ggd2hpY2ggdGhlIGxvd0xldmVsIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5bCB6KOF5a+56LGh77yM6YCa6L+H5q2k5a+56LGh5Y+v5Lul6K6/6Zeu5Yiw5bqV5bGC5a6e5L6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2hhcGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBJQm94U2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIFBSSVZBVEUgUFJPUEVSVFkgLy8vXHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfc2l6ZTogVmVjMyA9IG5ldyBWZWMzKDEsIDEsIDEpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihFQ29sbGlkZXJUeXBlLkJPWCk7XHJcbiAgICB9XHJcbn1cclxuIl19