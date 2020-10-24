(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "./collider.js", "../../../../core/index.js", "../../../../core/default-constants.js", "../../physics-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("./collider.js"), require("../../../../core/index.js"), require("../../../../core/default-constants.js"), require("../../physics-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.collider, global.index, global.defaultConstants, global.physicsEnum);
    global.meshCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _collider, _index2, _defaultConstants, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MeshCollider = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

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
   * Triangle mesh collider component.
   * @zh
   * 三角网格碰撞器。
   */
  var MeshCollider = (_dec = (0, _index.ccclass)('cc.MeshCollider'), _dec2 = (0, _index.help)('i18n:cc.MeshCollider'), _dec3 = (0, _index.menu)('Physics/MeshCollider'), _dec4 = (0, _index.type)(_index2.Mesh), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Collider) {
    _inherits(MeshCollider, _Collider);

    _createClass(MeshCollider, [{
      key: "mesh",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the mesh assets referenced by this collider.
       * @zh
       * 获取或设置此碰撞体引用的网格资源.
       */
      get: function get() {
        return this._mesh;
      },
      set: function set(value) {
        this._mesh = value;
        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) this.shape.setMesh(this._mesh);
      }
      /**
       * @en
       * Gets or sets whether the collider replaces the mesh with a convex shape.
       * @zh
       * 获取或设置此碰撞体是否用凸形状代替网格.
       */

    }, {
      key: "convex",
      get: function get() {
        return this._convex;
      },
      set: function set(value) {
        this._convex = value;
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

    function MeshCollider() {
      var _this;

      _classCallCheck(this, MeshCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MeshCollider).call(this, _physicsEnum.EColliderType.MESH));

      _initializerDefineProperty(_this, "_mesh", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_convex", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    return MeshCollider;
  }(_collider.Collider), _temp), (_applyDecoratedDescriptor(_class2.prototype, "mesh", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "mesh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "convex", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "convex"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_mesh", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_convex", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.MeshCollider = MeshCollider;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL21lc2gtY29sbGlkZXIudHMiXSwibmFtZXMiOlsiTWVzaENvbGxpZGVyIiwiTWVzaCIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX21lc2giLCJ2YWx1ZSIsIkVESVRPUiIsIlRFU1QiLCJzaGFwZSIsInNldE1lc2giLCJfY29udmV4IiwiX3NoYXBlIiwiRUNvbGxpZGVyVHlwZSIsIk1FU0giLCJDb2xsaWRlciIsImVkaXRhYmxlIiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7Ozs7TUFVYUEsWSxXQUpaLG9CQUFRLGlCQUFSLEMsVUFDQSxpQkFBSyxzQkFBTCxDLFVBQ0EsaUJBQUssc0JBQUwsQyxVQVlJLGlCQUFLQyxZQUFMLEMsa0RBWEpDLHdCOzs7OztBQUdHOztBQUVBOzs7Ozs7MEJBT1k7QUFDUixlQUFPLEtBQUtDLEtBQVo7QUFDSCxPO3dCQUVTQyxLLEVBQU87QUFDYixhQUFLRCxLQUFMLEdBQWFDLEtBQWI7QUFDQSxZQUFJLENBQUNDLHdCQUFELElBQVcsQ0FBQ0Msc0JBQWhCLEVBQXNCLEtBQUtDLEtBQUwsQ0FBV0MsT0FBWCxDQUFtQixLQUFLTCxLQUF4QjtBQUN6QjtBQUVEOzs7Ozs7Ozs7MEJBT2M7QUFDVixlQUFPLEtBQUtNLE9BQVo7QUFDSCxPO3dCQUVXTCxLLEVBQU87QUFDZixhQUFLSyxPQUFMLEdBQWVMLEtBQWY7QUFDSDtBQUVEOzs7Ozs7Ozs7MEJBTWE7QUFDVCxlQUFPLEtBQUtNLE1BQVo7QUFDSCxPLENBRUQ7Ozs7QUFRQSw0QkFBZTtBQUFBOztBQUFBOztBQUNYLHdGQUFNQywyQkFBY0MsSUFBcEI7O0FBRFc7O0FBQUE7O0FBQUE7QUFFZDs7O0lBdkQ2QkMsa0Isa05BMEI3QkMsZSwwSkFxQkFDLG1COzs7OzthQUM0QixJOzs4RUFFNUJBLG1COzs7OzthQUMwQixLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGNjY2xhc3MsXHJcbiAgICBoZWxwLFxyXG4gICAgZXhlY3V0ZUluRWRpdE1vZGUsXHJcbiAgICBtZW51LFxyXG4gICAgdHlwZSxcclxuICAgIGVkaXRhYmxlLFxyXG4gICAgc2VyaWFsaXphYmxlLFxyXG59IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENvbGxpZGVyIH0gZnJvbSAnLi9jb2xsaWRlcic7XHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgSVRyaW1lc2hTaGFwZSB9IGZyb20gJy4uLy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgRURJVE9SLCBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgRUNvbGxpZGVyVHlwZSB9IGZyb20gJy4uLy4uL3BoeXNpY3MtZW51bSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRyaWFuZ2xlIG1lc2ggY29sbGlkZXIgY29tcG9uZW50LlxyXG4gKiBAemhcclxuICog5LiJ6KeS572R5qC856Kw5pKe5Zmo44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuTWVzaENvbGxpZGVyJylcclxuQGhlbHAoJ2kxOG46Y2MuTWVzaENvbGxpZGVyJylcclxuQG1lbnUoJ1BoeXNpY3MvTWVzaENvbGxpZGVyJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBNZXNoQ29sbGlkZXIgZXh0ZW5kcyBDb2xsaWRlciB7XHJcblxyXG4gICAgLy8vIFBVQkxJQyBQUk9QRVJUWSBHRVRURVJcXFNFVFRFUiAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBtZXNoIGFzc2V0cyByZWZlcmVuY2VkIGJ5IHRoaXMgY29sbGlkZXIuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruatpOeisOaSnuS9k+W8leeUqOeahOe9keagvOi1hOa6kC5cclxuICAgICAqL1xyXG4gICAgQHR5cGUoTWVzaClcclxuICAgIGdldCBtZXNoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWVzaDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWVzaCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9tZXNoID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHRoaXMuc2hhcGUuc2V0TWVzaCh0aGlzLl9tZXNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgdGhlIGNvbGxpZGVyIHJlcGxhY2VzIHRoZSBtZXNoIHdpdGggYSBjb252ZXggc2hhcGUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruatpOeisOaSnuS9k+aYr+WQpueUqOWHuOW9oueKtuS7o+abv+e9keagvC5cclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgY29udmV4ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udmV4O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb252ZXggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fY29udmV4ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHdyYXBwZXIgb2JqZWN0LCB0aHJvdWdoIHdoaWNoIHRoZSBsb3dMZXZlbCBpbnN0YW5jZSBjYW4gYmUgYWNjZXNzZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluWwgeijheWvueixoe+8jOmAmui/h+atpOWvueixoeWPr+S7peiuv+mXruWIsOW6leWxguWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgc2hhcGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZSBhcyBJVHJpbWVzaFNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLyBQUklWQVRFIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX21lc2g6IE1lc2ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9jb252ZXg6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoRUNvbGxpZGVyVHlwZS5NRVNIKTtcclxuICAgIH1cclxufVxyXG4iXX0=