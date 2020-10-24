(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "./collider.js", "../../../../core/default-constants.js", "../../../../terrain/terrain-asset.js", "../../physics-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("./collider.js"), require("../../../../core/default-constants.js"), require("../../../../terrain/terrain-asset.js"), require("../../physics-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.collider, global.defaultConstants, global.terrainAsset, global.physicsEnum);
    global.terrainCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _collider, _defaultConstants, _terrainAsset, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TerrainCollider = void 0;

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
   * Terrain collider component.
   * @zh
   * 地形碰撞器。
   */
  var TerrainCollider = (_dec = (0, _index.ccclass)('cc.TerrainCollider'), _dec2 = (0, _index.help)('i18n:cc.TerrainCollider'), _dec3 = (0, _index.menu)('Physics/TerrainCollider(beta)'), _dec4 = (0, _index.type)(_terrainAsset.TerrainAsset), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(TerrainCollider, _Collider);

    _createClass(TerrainCollider, [{
      key: "terrain",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the terrain assets referenced by this collider.
       * @zh
       * 获取或设置此碰撞体引用的网格资源.
       */
      get: function get() {
        return this._terrain;
      },
      set: function set(value) {
        this._terrain = value;
        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) this.shape.setTerrain(this._terrain);
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

    function TerrainCollider() {
      var _this;

      _classCallCheck(this, TerrainCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TerrainCollider).call(this, _physicsEnum.EColliderType.TERRAIN));

      _initializerDefineProperty(_this, "_terrain", _descriptor, _assertThisInitialized(_this));

      return _this;
    }

    return TerrainCollider;
  }(_collider.Collider), _temp), (_applyDecoratedDescriptor(_class2.prototype, "terrain", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "terrain"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_terrain", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.TerrainCollider = TerrainCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL3RlcnJhaW4tY29sbGlkZXIudHMiXSwibmFtZXMiOlsiVGVycmFpbkNvbGxpZGVyIiwiVGVycmFpbkFzc2V0IiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfdGVycmFpbiIsInZhbHVlIiwiRURJVE9SIiwiVEVTVCIsInNoYXBlIiwic2V0VGVycmFpbiIsIl9zaGFwZSIsIkVDb2xsaWRlclR5cGUiLCJURVJSQUlOIiwiQ29sbGlkZXIiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7Ozs7OztNQVVhQSxlLFdBSlosb0JBQVEsb0JBQVIsQyxVQUNBLGlCQUFLLHlCQUFMLEMsVUFDQSxpQkFBSywrQkFBTCxDLFVBWUksaUJBQUtDLDBCQUFMLEMsa0RBWEpDLHdCOzs7OztBQUdHOztBQUVBOzs7Ozs7MEJBT2U7QUFDWCxlQUFPLEtBQUtDLFFBQVo7QUFDSCxPO3dCQUVZQyxLLEVBQU87QUFDaEIsYUFBS0QsUUFBTCxHQUFnQkMsS0FBaEI7QUFDQSxZQUFJLENBQUNDLHdCQUFELElBQVcsQ0FBQ0Msc0JBQWhCLEVBQXNCLEtBQUtDLEtBQUwsQ0FBV0MsVUFBWCxDQUFzQixLQUFLTCxRQUEzQjtBQUN6QjtBQUVEOzs7Ozs7Ozs7MEJBTWE7QUFDVCxlQUFPLEtBQUtNLE1BQVo7QUFDSCxPLENBRUQ7Ozs7QUFLQSwrQkFBZTtBQUFBOztBQUFBOztBQUNYLDJGQUFNQywyQkFBY0MsT0FBcEI7O0FBRFc7O0FBQUE7QUFFZDs7O0lBckNnQ0Msa0Isd09BZ0NoQ0MsbUI7Ozs7O2FBQ3dDLEkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBoeXNpY3NcclxuICovXHJcblxyXG5pbXBvcnQge1xyXG4gICAgY2NjbGFzcyxcclxuICAgIGhlbHAsXHJcbiAgICBleGVjdXRlSW5FZGl0TW9kZSxcclxuICAgIG1lbnUsXHJcbiAgICB0eXBlLFxyXG4gICAgc2VyaWFsaXphYmxlLFxyXG59IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENvbGxpZGVyIH0gZnJvbSAnLi9jb2xsaWRlcic7XHJcbmltcG9ydCB7IElUZXJyYWluU2hhcGUgfSBmcm9tICcuLi8uLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IElUZXJyYWluQXNzZXQgfSBmcm9tICcuLi8uLi8uLi9zcGVjL2ktZXh0ZXJuYWwnO1xyXG5pbXBvcnQgeyBFRElUT1IsIFRFU1QgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBUZXJyYWluQXNzZXQgfSBmcm9tICcuLi8uLi8uLi8uLi90ZXJyYWluL3RlcnJhaW4tYXNzZXQnO1xyXG5pbXBvcnQgeyBFQ29sbGlkZXJUeXBlIH0gZnJvbSAnLi4vLi4vcGh5c2ljcy1lbnVtJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGVycmFpbiBjb2xsaWRlciBjb21wb25lbnQuXHJcbiAqIEB6aFxyXG4gKiDlnLDlvaLnorDmkp7lmajjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5UZXJyYWluQ29sbGlkZXInKVxyXG5AaGVscCgnaTE4bjpjYy5UZXJyYWluQ29sbGlkZXInKVxyXG5AbWVudSgnUGh5c2ljcy9UZXJyYWluQ29sbGlkZXIoYmV0YSknKVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuZXhwb3J0IGNsYXNzIFRlcnJhaW5Db2xsaWRlciBleHRlbmRzIENvbGxpZGVyIHtcclxuXHJcbiAgICAvLy8gUFVCTElDIFBST1BFUlRZIEdFVFRFUlxcU0VUVEVSIC8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHRlcnJhaW4gYXNzZXRzIHJlZmVyZW5jZWQgYnkgdGhpcyBjb2xsaWRlci5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u5q2k56Kw5pKe5L2T5byV55So55qE572R5qC86LWE5rqQLlxyXG4gICAgICovXHJcbiAgICBAdHlwZShUZXJyYWluQXNzZXQpXHJcbiAgICBnZXQgdGVycmFpbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlcnJhaW47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRlcnJhaW4gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fdGVycmFpbiA9IHZhbHVlO1xyXG4gICAgICAgIGlmICghRURJVE9SICYmICFURVNUKSB0aGlzLnNoYXBlLnNldFRlcnJhaW4odGhpcy5fdGVycmFpbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHdyYXBwZXIgb2JqZWN0LCB0aHJvdWdoIHdoaWNoIHRoZSBsb3dMZXZlbCBpbnN0YW5jZSBjYW4gYmUgYWNjZXNzZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluWwgeijheWvueixoe+8jOmAmui/h+atpOWvueixoeWPr+S7peiuv+mXruWIsOW6leWxguWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgc2hhcGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBJVGVycmFpblNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLyBQUklWQVRFIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3RlcnJhaW46IElUZXJyYWluQXNzZXQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRUNvbGxpZGVyVHlwZS5URVJSQUlOKTtcclxuICAgIH1cclxufVxyXG4iXX0=