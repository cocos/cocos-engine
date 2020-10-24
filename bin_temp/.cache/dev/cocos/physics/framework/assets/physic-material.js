(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/assets/asset.js", "../../../core/data/decorators/index.js", "../../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/assets/asset.js"), require("../../../core/data/decorators/index.js"), require("../../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.asset, global.index, global.index);
    global.physicMaterial = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _asset, _index, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PhysicMaterial = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Physics materials.
   * @zh
   * 物理材质。
   */
  var PhysicMaterial = (_dec = (0, _index.ccclass)('cc.PhysicMaterial'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Asset) {
    _inherits(PhysicMaterial, _Asset);

    _createClass(PhysicMaterial, [{
      key: "friction",

      /**
       * @en
       * Gets all physics material instances.
       * @zh
       * 获取所有的物理材质实例。
       */

      /**
       * @en
       * Friction for this material.
       * @zh
       * 此材质的摩擦系数。
       */
      get: function get() {
        return this._friction;
      },
      set: function set(value) {
        if (!_index2.math.equals(this._friction, value)) {
          this._friction = value;
          this.emit('physics_material_update');
        }
      }
      /**
       * @en
       * Rolling friction for this material.
       * @zh
       * 此材质的滚动摩擦系数。
       */

    }, {
      key: "rollingFriction",
      get: function get() {
        return this._rollingFriction;
      },
      set: function set(value) {
        if (!_index2.math.equals(this._rollingFriction, value)) {
          this._rollingFriction = value;
          this.emit('physics_material_update');
        }
      }
      /**
       * @en
       * Spinning friction for this material.
       * @zh
       * 此材质的自旋摩擦系数。
       */

    }, {
      key: "spinningFriction",
      get: function get() {
        return this._spinningFriction;
      },
      set: function set(value) {
        if (!_index2.math.equals(this._spinningFriction, value)) {
          this._spinningFriction = value;
          this.emit('physics_material_update');
        }
      }
      /**
       * @en
       * Restitution for this material.
       * @zh
       * 此材质的回弹系数。
       */

    }, {
      key: "restitution",
      get: function get() {
        return this._restitution;
      },
      set: function set(value) {
        if (!_index2.math.equals(this._restitution, value)) {
          this._restitution = value;
          this.emit('physics_material_update');
        }
      }
    }]);

    function PhysicMaterial() {
      var _this;

      _classCallCheck(this, PhysicMaterial);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PhysicMaterial).call(this));

      _initializerDefineProperty(_this, "_friction", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_rollingFriction", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_spinningFriction", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_restitution", _descriptor4, _assertThisInitialized(_this));

      PhysicMaterial.allMaterials.push(_assertThisInitialized(_this));

      if (_this._uuid == '') {
        _this._uuid = 'pm_' + PhysicMaterial._idCounter++;
      }

      return _this;
    }
    /**
     * @en
     * clone.
     * @zh
     * 克隆。
     */


    _createClass(PhysicMaterial, [{
      key: "clone",
      value: function clone() {
        var c = new PhysicMaterial();
        c._friction = this._friction;
        c._restitution = this._restitution;
        c._rollingFriction = this._rollingFriction;
        c._spinningFriction = this._spinningFriction;
        return c;
      }
      /**
       * @en
       * destroy.
       * @zh
       * 销毁。
       * @return 是否成功
       */

    }, {
      key: "destroy",
      value: function destroy() {
        if (_get(_getPrototypeOf(PhysicMaterial.prototype), "destroy", this).call(this)) {
          var idx = PhysicMaterial.allMaterials.indexOf(this);

          if (idx >= 0) {
            PhysicMaterial.allMaterials.splice(idx, 1);
          }

          return true;
        } else {
          return false;
        }
      }
    }]);

    return PhysicMaterial;
  }(_asset.Asset), _class3.allMaterials = [], _class3._idCounter = 0, _temp), (_applyDecoratedDescriptor(_class2.prototype, "friction", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "friction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "rollingFriction", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "rollingFriction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spinningFriction", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "spinningFriction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "restitution", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "restitution"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_friction", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.5;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_rollingFriction", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_spinningFriction", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_restitution", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  })), _class2)) || _class);
  _exports.PhysicMaterial = PhysicMaterial;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2Fzc2V0cy9waHlzaWMtbWF0ZXJpYWwudHMiXSwibmFtZXMiOlsiUGh5c2ljTWF0ZXJpYWwiLCJfZnJpY3Rpb24iLCJ2YWx1ZSIsIm1hdGgiLCJlcXVhbHMiLCJlbWl0IiwiX3JvbGxpbmdGcmljdGlvbiIsIl9zcGlubmluZ0ZyaWN0aW9uIiwiX3Jlc3RpdHV0aW9uIiwiYWxsTWF0ZXJpYWxzIiwicHVzaCIsIl91dWlkIiwiX2lkQ291bnRlciIsImMiLCJpZHgiLCJpbmRleE9mIiwic3BsaWNlIiwiQXNzZXQiLCJlZGl0YWJsZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7O01BT2FBLGMsV0FEWixvQkFBUSxtQkFBUixDOzs7Ozs7QUFHRzs7Ozs7OztBQVFBOzs7Ozs7MEJBT2dCO0FBQ1osZUFBTyxLQUFLQyxTQUFaO0FBQ0gsTzt3QkFFYUMsSyxFQUFPO0FBQ2pCLFlBQUksQ0FBQ0MsYUFBS0MsTUFBTCxDQUFZLEtBQUtILFNBQWpCLEVBQTRCQyxLQUE1QixDQUFMLEVBQXlDO0FBQ3JDLGVBQUtELFNBQUwsR0FBaUJDLEtBQWpCO0FBQ0EsZUFBS0csSUFBTCxDQUFVLHlCQUFWO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7MEJBT3VCO0FBQ25CLGVBQU8sS0FBS0MsZ0JBQVo7QUFDSCxPO3dCQUVvQkosSyxFQUFPO0FBQ3hCLFlBQUksQ0FBQ0MsYUFBS0MsTUFBTCxDQUFZLEtBQUtFLGdCQUFqQixFQUFtQ0osS0FBbkMsQ0FBTCxFQUFnRDtBQUM1QyxlQUFLSSxnQkFBTCxHQUF3QkosS0FBeEI7QUFDQSxlQUFLRyxJQUFMLENBQVUseUJBQVY7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OzswQkFPd0I7QUFDcEIsZUFBTyxLQUFLRSxpQkFBWjtBQUNILE87d0JBRXFCTCxLLEVBQU87QUFDekIsWUFBSSxDQUFDQyxhQUFLQyxNQUFMLENBQVksS0FBS0csaUJBQWpCLEVBQW9DTCxLQUFwQyxDQUFMLEVBQWlEO0FBQzdDLGVBQUtLLGlCQUFMLEdBQXlCTCxLQUF6QjtBQUNBLGVBQUtHLElBQUwsQ0FBVSx5QkFBVjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQU9tQjtBQUNmLGVBQU8sS0FBS0csWUFBWjtBQUNILE87d0JBRWdCTixLLEVBQU87QUFDcEIsWUFBSSxDQUFDQyxhQUFLQyxNQUFMLENBQVksS0FBS0ksWUFBakIsRUFBK0JOLEtBQS9CLENBQUwsRUFBNEM7QUFDeEMsZUFBS00sWUFBTCxHQUFvQk4sS0FBcEI7QUFDQSxlQUFLRyxJQUFMLENBQVUseUJBQVY7QUFDSDtBQUNKOzs7QUFnQkQsOEJBQWU7QUFBQTs7QUFBQTs7QUFDWDs7QUFEVzs7QUFBQTs7QUFBQTs7QUFBQTs7QUFFWEwsTUFBQUEsY0FBYyxDQUFDUyxZQUFmLENBQTRCQyxJQUE1Qjs7QUFDQSxVQUFJLE1BQUtDLEtBQUwsSUFBYyxFQUFsQixFQUFzQjtBQUNsQixjQUFLQSxLQUFMLEdBQWEsUUFBUVgsY0FBYyxDQUFDWSxVQUFmLEVBQXJCO0FBQ0g7O0FBTFU7QUFNZDtBQUVEOzs7Ozs7Ozs7OzhCQU1nQjtBQUNaLFlBQUlDLENBQUMsR0FBRyxJQUFJYixjQUFKLEVBQVI7QUFDQWEsUUFBQUEsQ0FBQyxDQUFDWixTQUFGLEdBQWMsS0FBS0EsU0FBbkI7QUFDQVksUUFBQUEsQ0FBQyxDQUFDTCxZQUFGLEdBQWlCLEtBQUtBLFlBQXRCO0FBQ0FLLFFBQUFBLENBQUMsQ0FBQ1AsZ0JBQUYsR0FBcUIsS0FBS0EsZ0JBQTFCO0FBQ0FPLFFBQUFBLENBQUMsQ0FBQ04saUJBQUYsR0FBc0IsS0FBS0EsaUJBQTNCO0FBQ0EsZUFBT00sQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Z0NBTzJCO0FBQ3ZCLHlGQUFxQjtBQUNqQixjQUFJQyxHQUFHLEdBQUdkLGNBQWMsQ0FBQ1MsWUFBZixDQUE0Qk0sT0FBNUIsQ0FBb0MsSUFBcEMsQ0FBVjs7QUFDQSxjQUFJRCxHQUFHLElBQUksQ0FBWCxFQUFjO0FBQ1ZkLFlBQUFBLGNBQWMsQ0FBQ1MsWUFBZixDQUE0Qk8sTUFBNUIsQ0FBbUNGLEdBQW5DLEVBQXdDLENBQXhDO0FBQ0g7O0FBQ0QsaUJBQU8sSUFBUDtBQUNILFNBTkQsTUFNTztBQUNILGlCQUFPLEtBQVA7QUFDSDtBQUNKOzs7O0lBeEkrQkcsWSxXQVF6QlIsWSxHQUFpQyxFLFVBMEV6QkcsVSxHQUFxQixDLHFFQWxFbkNNLGUsd0pBa0JBQSxlLGdLQWtCQUEsZSw0SkFrQkFBLGUsbUtBY0FDLG1COzs7OzthQUNtQixHOzt1RkFFbkJBLG1COzs7OzthQUMwQixHOzt3RkFFMUJBLG1COzs7OzthQUMyQixHOzttRkFFM0JBLG1COzs7OzthQUNzQixHIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8vIEB0cy1jaGVja1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2Fzc2V0cy9hc3NldCc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGVkaXRhYmxlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBtYXRoIH0gZnJvbSAnLi4vLi4vLi4vY29yZSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFBoeXNpY3MgbWF0ZXJpYWxzLlxyXG4gKiBAemhcclxuICog54mp55CG5p2Q6LSo44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuUGh5c2ljTWF0ZXJpYWwnKVxyXG5leHBvcnQgY2xhc3MgUGh5c2ljTWF0ZXJpYWwgZXh0ZW5kcyBBc3NldCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgYWxsIHBoeXNpY3MgbWF0ZXJpYWwgaW5zdGFuY2VzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiYDmnInnmoTniannkIbmnZDotKjlrp7kvovjgIJcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFsbE1hdGVyaWFsczogUGh5c2ljTWF0ZXJpYWxbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBGcmljdGlvbiBmb3IgdGhpcyBtYXRlcmlhbC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5q2k5p2Q6LSo55qE5pGp5pOm57O75pWw44CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGZyaWN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZnJpY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZyaWN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICghbWF0aC5lcXVhbHModGhpcy5fZnJpY3Rpb24sIHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mcmljdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSb2xsaW5nIGZyaWN0aW9uIGZvciB0aGlzIG1hdGVyaWFsLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmraTmnZDotKjnmoTmu5rliqjmkanmk6bns7vmlbDjgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgcm9sbGluZ0ZyaWN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9sbGluZ0ZyaWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByb2xsaW5nRnJpY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCFtYXRoLmVxdWFscyh0aGlzLl9yb2xsaW5nRnJpY3Rpb24sIHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yb2xsaW5nRnJpY3Rpb24gPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3Bpbm5pbmcgZnJpY3Rpb24gZm9yIHRoaXMgbWF0ZXJpYWwuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOatpOadkOi0qOeahOiHquaXi+aRqeaTpuezu+aVsOOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBzcGlubmluZ0ZyaWN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3Bpbm5pbmdGcmljdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3Bpbm5pbmdGcmljdGlvbiAodmFsdWUpIHtcclxuICAgICAgICBpZiAoIW1hdGguZXF1YWxzKHRoaXMuX3NwaW5uaW5nRnJpY3Rpb24sIHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zcGlubmluZ0ZyaWN0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncGh5c2ljc19tYXRlcmlhbF91cGRhdGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlc3RpdHV0aW9uIGZvciB0aGlzIG1hdGVyaWFsLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmraTmnZDotKjnmoTlm57lvLnns7vmlbDjgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgcmVzdGl0dXRpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZXN0aXR1dGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcmVzdGl0dXRpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCFtYXRoLmVxdWFscyh0aGlzLl9yZXN0aXR1dGlvbiwgdmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc3RpdHV0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncGh5c2ljc19tYXRlcmlhbF91cGRhdGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2lkQ291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9mcmljdGlvbiA9IDAuNTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9yb2xsaW5nRnJpY3Rpb24gPSAwLjE7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfc3Bpbm5pbmdGcmljdGlvbiA9IDAuMTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9yZXN0aXR1dGlvbiA9IDAuMTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBQaHlzaWNNYXRlcmlhbC5hbGxNYXRlcmlhbHMucHVzaCh0aGlzKTtcclxuICAgICAgICBpZiAodGhpcy5fdXVpZCA9PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLl91dWlkID0gJ3BtXycgKyBQaHlzaWNNYXRlcmlhbC5faWRDb3VudGVyKys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjbG9uZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWL6ZqG44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9uZSAoKSB7XHJcbiAgICAgICAgbGV0IGMgPSBuZXcgUGh5c2ljTWF0ZXJpYWwoKTtcclxuICAgICAgICBjLl9mcmljdGlvbiA9IHRoaXMuX2ZyaWN0aW9uO1xyXG4gICAgICAgIGMuX3Jlc3RpdHV0aW9uID0gdGhpcy5fcmVzdGl0dXRpb247XHJcbiAgICAgICAgYy5fcm9sbGluZ0ZyaWN0aW9uID0gdGhpcy5fcm9sbGluZ0ZyaWN0aW9uO1xyXG4gICAgICAgIGMuX3NwaW5uaW5nRnJpY3Rpb24gPSB0aGlzLl9zcGlubmluZ0ZyaWN0aW9uO1xyXG4gICAgICAgIHJldHVybiBjO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBkZXN0cm95LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplIDmr4HjgIJcclxuICAgICAqIEByZXR1cm4g5piv5ZCm5oiQ5YqfXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoc3VwZXIuZGVzdHJveSgpKSB7XHJcbiAgICAgICAgICAgIGxldCBpZHggPSBQaHlzaWNNYXRlcmlhbC5hbGxNYXRlcmlhbHMuaW5kZXhPZih0aGlzKTtcclxuICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBQaHlzaWNNYXRlcmlhbC5hbGxNYXRlcmlhbHMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iXX0=