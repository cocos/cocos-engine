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
    global.simplexCollider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _collider, _defaultConstants, _physicsEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SimplexCollider = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

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
   * Simplex collider, support point, line, triangle, tetrahedron.
   * @zh
   * 单纯形碰撞器，支持点、线、三角形、四面体。
   */
  var SimplexCollider = (_dec = (0, _index.ccclass)('cc.SimplexCollider'), _dec2 = (0, _index.help)('i18n:cc.SimplexCollider'), _dec3 = (0, _index.menu)('Physics/SimplexCollider'), _dec4 = (0, _index.type)(_physicsEnum.ESimplexType), _dec5 = (0, _index.visible)(function () {
    return this._shapeType > 1;
  }), _dec6 = (0, _index.visible)(function () {
    return this._shapeType > 2;
  }), _dec7 = (0, _index.visible)(function () {
    return this._shapeType > 3;
  }), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Collider) {
    _inherits(SimplexCollider, _Collider);

    _createClass(SimplexCollider, [{
      key: "shapeType",
      /// PUBLIC PROPERTY GETTER\SETTER ///
      get: function get() {
        return this._shapeType;
      },
      set: function set(v) {
        this._shapeType = v;

        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setShapeType(v);
        }
      }
    }, {
      key: "vertex0",
      get: function get() {
        return this._vertices[0];
      },
      set: function set(v) {
        _index2.Vec3.copy(this._vertices[0], v);

        this.updateVertices();
      }
    }, {
      key: "vertex1",
      get: function get() {
        return this._vertices[1];
      },
      set: function set(v) {
        _index2.Vec3.copy(this._vertices[1], v);

        this.updateVertices();
      }
    }, {
      key: "vertex2",
      get: function get() {
        return this._vertices[2];
      },
      set: function set(v) {
        _index2.Vec3.copy(this._vertices[2], v);

        this.updateVertices();
      }
    }, {
      key: "vertex3",
      get: function get() {
        return this._vertices[3];
      },
      set: function set(v) {
        _index2.Vec3.copy(this._vertices[3], v);

        this.updateVertices();
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
      }
    }, {
      key: "vertices",
      get: function get() {
        return this._vertices;
      } /// PRIVATE PROPERTY ///

    }]);

    function SimplexCollider() {
      var _this;

      _classCallCheck(this, SimplexCollider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SimplexCollider).call(this, _physicsEnum.EColliderType.SIMPLEX));

      _initializerDefineProperty(_this, "_shapeType", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_vertices", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(SimplexCollider, [{
      key: "updateVertices",
      value: function updateVertices() {
        if (!_defaultConstants.EDITOR && !_defaultConstants.TEST) {
          this.shape.setVertices(this._vertices);
        }
      }
    }]);

    return SimplexCollider;
  }(_collider.Collider), _class3.ESimplexType = _physicsEnum.ESimplexType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "shapeType", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "shapeType"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "vertex0", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "vertex0"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "vertex1", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "vertex1"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "vertex2", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "vertex2"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "vertex3", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "vertex3"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_shapeType", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _physicsEnum.ESimplexType.TETRAHEDRON;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_vertices", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [new _index2.Vec3(0, 0, 0), new _index2.Vec3(0, 0, 1), new _index2.Vec3(1, 0, 0), new _index2.Vec3(0, 1, 0)];
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.SimplexCollider = SimplexCollider;

  (function (_SimplexCollider) {})(SimplexCollider || (_exports.SimplexCollider = SimplexCollider = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL3NpbXBsZXgtY29sbGlkZXIudHMiXSwibmFtZXMiOlsiU2ltcGxleENvbGxpZGVyIiwiRVNpbXBsZXhUeXBlIiwiX3NoYXBlVHlwZSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwidiIsIkVESVRPUiIsIlRFU1QiLCJzaGFwZSIsInNldFNoYXBlVHlwZSIsIl92ZXJ0aWNlcyIsIlZlYzMiLCJjb3B5IiwidXBkYXRlVmVydGljZXMiLCJfc2hhcGUiLCJFQ29sbGlkZXJUeXBlIiwiU0lNUExFWCIsInNldFZlcnRpY2VzIiwiQ29sbGlkZXIiLCJlZGl0YWJsZSIsInNlcmlhbGl6YWJsZSIsIlRFVFJBSEVEUk9OIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBOzs7Ozs7TUFVYUEsZSxXQUpaLG9CQUFRLG9CQUFSLEMsVUFDQSxpQkFBSyx5QkFBTCxDLFVBQ0EsaUJBQUsseUJBQUwsQyxVQVFJLGlCQUFLQyx5QkFBTCxDLFVBc0JBLG9CQUFRLFlBQWlDO0FBQUUsV0FBTyxLQUFLQyxVQUFMLEdBQWtCLENBQXpCO0FBQTZCLEdBQXhFLEMsVUFVQSxvQkFBUSxZQUFpQztBQUFFLFdBQU8sS0FBS0EsVUFBTCxHQUFrQixDQUF6QjtBQUE2QixHQUF4RSxDLFVBVUEsb0JBQVEsWUFBaUM7QUFBRSxXQUFPLEtBQUtBLFVBQUwsR0FBa0IsQ0FBekI7QUFBNkIsR0FBeEUsQyxrREFqREpDLHdCOzs7OztBQUtHOzBCQUdpQjtBQUNiLGVBQU8sS0FBS0QsVUFBWjtBQUNILE87d0JBRWNFLEMsRUFBRztBQUNkLGFBQUtGLFVBQUwsR0FBa0JFLENBQWxCOztBQUNBLFlBQUksQ0FBQ0Msd0JBQUQsSUFBVyxDQUFDQyxzQkFBaEIsRUFBc0I7QUFDbEIsZUFBS0MsS0FBTCxDQUFXQyxZQUFYLENBQXdCSixDQUF4QjtBQUNIO0FBQ0o7OzswQkFHYztBQUNYLGVBQU8sS0FBS0ssU0FBTCxDQUFlLENBQWYsQ0FBUDtBQUNILE87d0JBRVlMLEMsRUFBYztBQUN2Qk0scUJBQUtDLElBQUwsQ0FBVSxLQUFLRixTQUFMLENBQWUsQ0FBZixDQUFWLEVBQTZCTCxDQUE3Qjs7QUFDQSxhQUFLUSxjQUFMO0FBQ0g7OzswQkFHYztBQUNYLGVBQU8sS0FBS0gsU0FBTCxDQUFlLENBQWYsQ0FBUDtBQUNILE87d0JBRVlMLEMsRUFBYztBQUN2Qk0scUJBQUtDLElBQUwsQ0FBVSxLQUFLRixTQUFMLENBQWUsQ0FBZixDQUFWLEVBQTZCTCxDQUE3Qjs7QUFDQSxhQUFLUSxjQUFMO0FBQ0g7OzswQkFHYztBQUNYLGVBQU8sS0FBS0gsU0FBTCxDQUFlLENBQWYsQ0FBUDtBQUNILE87d0JBRVlMLEMsRUFBYztBQUN2Qk0scUJBQUtDLElBQUwsQ0FBVSxLQUFLRixTQUFMLENBQWUsQ0FBZixDQUFWLEVBQTZCTCxDQUE3Qjs7QUFDQSxhQUFLUSxjQUFMO0FBQ0g7OzswQkFHYztBQUNYLGVBQU8sS0FBS0gsU0FBTCxDQUFlLENBQWYsQ0FBUDtBQUNILE87d0JBRVlMLEMsRUFBYztBQUN2Qk0scUJBQUtDLElBQUwsQ0FBVSxLQUFLRixTQUFMLENBQWUsQ0FBZixDQUFWLEVBQTZCTCxDQUE3Qjs7QUFDQSxhQUFLUSxjQUFMO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQU1vQjtBQUNoQixlQUFPLEtBQUtDLE1BQVo7QUFDSDs7OzBCQUVlO0FBQ1osZUFBTyxLQUFLSixTQUFaO0FBQ0gsTyxDQUVEOzs7O0FBYUEsK0JBQWU7QUFBQTs7QUFBQTs7QUFDWCwyRkFBTUssMkJBQWNDLE9BQXBCOztBQURXOztBQUFBOztBQUFBO0FBRWQ7Ozs7dUNBRWlCO0FBQ2QsWUFBSSxDQUFDVix3QkFBRCxJQUFXLENBQUNDLHNCQUFoQixFQUFzQjtBQUNsQixlQUFLQyxLQUFMLENBQVdTLFdBQVgsQ0FBdUIsS0FBS1AsU0FBNUI7QUFDSDtBQUNKOzs7O0lBN0ZnQ1Esa0IsV0FFakJoQixZLEdBQWVBLHlCLDROQWdCOUJpQixlLDRsQkF3REFDLG1COzs7OzthQUNrQ2xCLDBCQUFhbUIsVzs7Z0ZBRS9DRCxtQjs7Ozs7YUFDZ0MsQ0FDN0IsSUFBSVQsWUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUQ2QixFQUU3QixJQUFJQSxZQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBRjZCLEVBRzdCLElBQUlBLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FINkIsRUFJN0IsSUFBSUEsWUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUo2QixDOzs7OzttQ0FtQnBCVixlLGdDQUFBQSxlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGNjY2xhc3MsXHJcbiAgICBoZWxwLFxyXG4gICAgZXhlY3V0ZUluRWRpdE1vZGUsXHJcbiAgICBtZW51LFxyXG4gICAgdmlzaWJsZSxcclxuICAgIHR5cGUsXHJcbiAgICBlZGl0YWJsZSxcclxuICAgIHNlcmlhbGl6YWJsZSxcclxufSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgQ29sbGlkZXIgfSBmcm9tICcuL2NvbGxpZGVyJztcclxuaW1wb3J0IHsgSVNpbXBsZXhTaGFwZSB9IGZyb20gJy4uLy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgRURJVE9SLCBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgRVNpbXBsZXhUeXBlLCBFQ29sbGlkZXJUeXBlIH0gZnJvbSAnLi4vLi4vcGh5c2ljcy1lbnVtJztcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9tYXRoL3R5cGUtZGVmaW5lJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogU2ltcGxleCBjb2xsaWRlciwgc3VwcG9ydCBwb2ludCwgbGluZSwgdHJpYW5nbGUsIHRldHJhaGVkcm9uLlxyXG4gKiBAemhcclxuICog5Y2V57qv5b2i56Kw5pKe5Zmo77yM5pSv5oyB54K544CB57q/44CB5LiJ6KeS5b2i44CB5Zub6Z2i5L2T44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU2ltcGxleENvbGxpZGVyJylcclxuQGhlbHAoJ2kxOG46Y2MuU2ltcGxleENvbGxpZGVyJylcclxuQG1lbnUoJ1BoeXNpY3MvU2ltcGxleENvbGxpZGVyJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBTaW1wbGV4Q29sbGlkZXIgZXh0ZW5kcyBDb2xsaWRlciB7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IEVTaW1wbGV4VHlwZSA9IEVTaW1wbGV4VHlwZTtcclxuXHJcbiAgICAvLy8gUFVCTElDIFBST1BFUlRZIEdFVFRFUlxcU0VUVEVSIC8vL1xyXG5cclxuICAgIEB0eXBlKEVTaW1wbGV4VHlwZSlcclxuICAgIGdldCBzaGFwZVR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZVR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNoYXBlVHlwZSAodikge1xyXG4gICAgICAgIHRoaXMuX3NoYXBlVHlwZSA9IHY7XHJcbiAgICAgICAgaWYgKCFFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5zZXRTaGFwZVR5cGUodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IHZlcnRleDAgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNlc1swXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmVydGV4MCAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3ZlcnRpY2VzWzBdLCB2KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZlcnRpY2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFNpbXBsZXhDb2xsaWRlcikgeyByZXR1cm4gdGhpcy5fc2hhcGVUeXBlID4gMTsgfSlcclxuICAgIGdldCB2ZXJ0ZXgxICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljZXNbMV07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZlcnRleDEgKHY6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl92ZXJ0aWNlc1sxXSwgdik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWZXJ0aWNlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBTaW1wbGV4Q29sbGlkZXIpIHsgcmV0dXJuIHRoaXMuX3NoYXBlVHlwZSA+IDI7IH0pXHJcbiAgICBnZXQgdmVydGV4MiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2VzWzJdO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2ZXJ0ZXgyICh2OiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBWZWMzLmNvcHkodGhpcy5fdmVydGljZXNbMl0sIHYpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmVydGljZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogU2ltcGxleENvbGxpZGVyKSB7IHJldHVybiB0aGlzLl9zaGFwZVR5cGUgPiAzOyB9KVxyXG4gICAgZ2V0IHZlcnRleDMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNlc1szXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdmVydGV4MyAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3ZlcnRpY2VzWzNdLCB2KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZlcnRpY2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHdyYXBwZXIgb2JqZWN0LCB0aHJvdWdoIHdoaWNoIHRoZSBsb3dMZXZlbCBpbnN0YW5jZSBjYW4gYmUgYWNjZXNzZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluWwgeijheWvueixoe+8jOmAmui/h+atpOWvueixoeWPr+S7peiuv+mXruWIsOW6leWxguWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNoYXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGUgYXMgSVNpbXBsZXhTaGFwZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmVydGljZXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZXJ0aWNlc1xyXG4gICAgfVxyXG5cclxuICAgIC8vLyBQUklWQVRFIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3NoYXBlVHlwZTogRVNpbXBsZXhUeXBlID0gRVNpbXBsZXhUeXBlLlRFVFJBSEVEUk9OO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3ZlcnRpY2VzOiBJVmVjM0xpa2VbXSA9IFtcclxuICAgICAgICBuZXcgVmVjMygwLCAwLCAwKSxcclxuICAgICAgICBuZXcgVmVjMygwLCAwLCAxKSxcclxuICAgICAgICBuZXcgVmVjMygxLCAwLCAwKSxcclxuICAgICAgICBuZXcgVmVjMygwLCAxLCAwKSxcclxuICAgIF07XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKEVDb2xsaWRlclR5cGUuU0lNUExFWCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmVydGljZXMgKCkge1xyXG4gICAgICAgIGlmICghRURJVE9SICYmICFURVNUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUuc2V0VmVydGljZXModGhpcy5fdmVydGljZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgU2ltcGxleENvbGxpZGVyIHtcclxuICAgIGV4cG9ydCB0eXBlIEVTaW1wbGV4VHlwZSA9IEVudW1BbGlhczx0eXBlb2YgRVNpbXBsZXhUeXBlPjtcclxufVxyXG4iXX0=