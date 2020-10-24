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
    global.sphereCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _collider, _defaultConstants, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SphereCollider = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _temp;

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
   * Sphere collider component.
   * @zh
   * 球碰撞器。
   */
  var SphereCollider = (_dec = (0, _index.ccclass)('cc.SphereCollider'), _dec2 = (0, _index.help)('i18n:cc.SphereCollider'), _dec3 = (0, _index.menu)('Physics/SphereCollider'), _dec4 = (0, _index.tooltip)('球的半径'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(SphereCollider, _Collider);

    _createClass(SphereCollider, [{
      key: "radius",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the radius of the sphere.
       * @zh
       * 获取或设置球的半径。
       */
      get: function get() {
        return this._radius;
      },
      set: function set(value) {
        this._radius = value;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setRadius(this._radius);
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

    function SphereCollider() {
      var _this;

      _classCallCheck(this, SphereCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SphereCollider).call(this, _physicsEnum.EColliderType.SPHERE));

      _initializerDefineProperty(_this, "_radius", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    return SphereCollider;
  }(_collider.Collider), _temp), (_applyDecoratedDescriptor(_class2.prototype, "radius", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "radius"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_radius", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.5;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.SphereCollider = SphereCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL3NwaGVyZS1jb2xsaWRlci50cyJdLCJuYW1lcyI6WyJTcGhlcmVDb2xsaWRlciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX3JhZGl1cyIsInZhbHVlIiwiRURJVE9SIiwiVEVTVCIsInNoYXBlIiwic2V0UmFkaXVzIiwiX3NoYXBlIiwiRUNvbGxpZGVyVHlwZSIsIlNQSEVSRSIsIkNvbGxpZGVyIiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBOzs7Ozs7TUFVYUEsYyxXQUpaLG9CQUFRLG1CQUFSLEMsVUFDQSxpQkFBSyx3QkFBTCxDLFVBQ0EsaUJBQUssd0JBQUwsQyxVQVlJLG9CQUFRLE1BQVIsQyxrREFYSkMsd0I7Ozs7O0FBR0c7O0FBRUE7Ozs7OzswQkFPcUI7QUFDakIsZUFBTyxLQUFLQyxPQUFaO0FBQ0gsTzt3QkFFa0JDLEssRUFBTztBQUN0QixhQUFLRCxPQUFMLEdBQWVDLEtBQWY7O0FBQ0EsWUFBSSxDQUFDQyx3QkFBRCxJQUFXLENBQUNDLHNCQUFoQixFQUFzQjtBQUNsQixlQUFLQyxLQUFMLENBQVdDLFNBQVgsQ0FBcUIsS0FBS0wsT0FBMUI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OzswQkFNb0I7QUFDaEIsZUFBTyxLQUFLTSxNQUFaO0FBQ0gsTyxDQUVEOzs7O0FBS0EsOEJBQWU7QUFBQTs7QUFBQTs7QUFDWCwwRkFBTUMsMkJBQWNDLE1BQXBCOztBQURXOztBQUFBO0FBRWQ7OztJQXZDK0JDLGtCLHFPQWtDL0JDLG1COzs7OzthQUN5QixHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGNjY2xhc3MsXHJcbiAgICBoZWxwLFxyXG4gICAgZXhlY3V0ZUluRWRpdE1vZGUsXHJcbiAgICBtZW51LFxyXG4gICAgdG9vbHRpcCxcclxuICAgIHNlcmlhbGl6YWJsZSxcclxufSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xsaWRlciB9IGZyb20gJy4vY29sbGlkZXInO1xyXG5pbXBvcnQgeyBJU3BoZXJlU2hhcGUgfSBmcm9tICcuLi8uLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IEVESVRPUiwgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IEVDb2xsaWRlclR5cGUgfSBmcm9tICcuLi8uLi9waHlzaWNzLWVudW0nO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBTcGhlcmUgY29sbGlkZXIgY29tcG9uZW50LlxyXG4gKiBAemhcclxuICog55CD56Kw5pKe5Zmo44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU3BoZXJlQ29sbGlkZXInKVxyXG5AaGVscCgnaTE4bjpjYy5TcGhlcmVDb2xsaWRlcicpXHJcbkBtZW51KCdQaHlzaWNzL1NwaGVyZUNvbGxpZGVyJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBTcGhlcmVDb2xsaWRlciBleHRlbmRzIENvbGxpZGVyIHtcclxuXHJcbiAgICAvLy8gUFVCTElDIFBST1BFUlRZIEdFVFRFUlxcU0VUVEVSIC8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHJhZGl1cyBvZiB0aGUgc3BoZXJlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7nkIPnmoTljYrlvoTjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ+eQg+eahOWNiuW+hCcpXHJcbiAgICBwdWJsaWMgZ2V0IHJhZGl1cyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhZGl1cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJhZGl1cyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9yYWRpdXMgPSB2YWx1ZTtcclxuICAgICAgICBpZiAoIUVESVRPUiAmJiAhVEVTVCkge1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnNldFJhZGl1cyh0aGlzLl9yYWRpdXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgd3JhcHBlciBvYmplY3QsIHRocm91Z2ggd2hpY2ggdGhlIGxvd0xldmVsIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5bCB6KOF5a+56LGh77yM6YCa6L+H5q2k5a+56LGh5Y+v5Lul6K6/6Zeu5Yiw5bqV5bGC5a6e5L6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2hhcGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBJU3BoZXJlU2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIFBSSVZBVEUgUFJPUEVSVFkgLy8vXHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfcmFkaXVzOiBudW1iZXIgPSAwLjU7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKEVDb2xsaWRlclR5cGUuU1BIRVJFKTtcclxuICAgIH1cclxufVxyXG4iXX0=