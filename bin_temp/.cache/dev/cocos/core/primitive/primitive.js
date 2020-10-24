(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../3d/misc/utils.js", "../assets/mesh.js", "../data/decorators/index.js", "./index.js", "../value-types/enum.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../3d/misc/utils.js"), require("../assets/mesh.js"), require("../data/decorators/index.js"), require("./index.js"), require("../value-types/enum.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.mesh, global.index, global.index, global._enum, global.globalExports);
    global.primitive = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _mesh, _index, primitives, _enum, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Primitive = void 0;
  primitives = _interopRequireWildcard(primitives);

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

  var PrimitiveType;

  (function (PrimitiveType) {
    PrimitiveType[PrimitiveType["BOX"] = 0] = "BOX";
    PrimitiveType[PrimitiveType["SPHERE"] = 1] = "SPHERE";
    PrimitiveType[PrimitiveType["CYLINDER"] = 2] = "CYLINDER";
    PrimitiveType[PrimitiveType["CONE"] = 3] = "CONE";
    PrimitiveType[PrimitiveType["CAPSULE"] = 4] = "CAPSULE";
    PrimitiveType[PrimitiveType["TORUS"] = 5] = "TORUS";
    PrimitiveType[PrimitiveType["PLANE"] = 6] = "PLANE";
    PrimitiveType[PrimitiveType["QUAD"] = 7] = "QUAD";
  })(PrimitiveType || (PrimitiveType = {}));

  (0, _enum.ccenum)(PrimitiveType);
  /**
   * @en
   * Basic primitive mesh, this can be generate some primitive mesh at runtime.
   * @zh
   * 基础图形网格，可以在运行时构建一些基础的网格。
   */

  var Primitive = (_dec = (0, _index.ccclass)('cc.Primitive'), _dec2 = (0, _index.type)(PrimitiveType), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Mesh) {
    _inherits(Primitive, _Mesh);

    /**
     * @en
     * The type of the primitive mesh, set it before you call onLoaded.
     * @zh
     * 此基础图形网格的类型，请在 onLoaded 调用之前设置。
     */

    /**
     * @en
     * The option for build the primitive mesh, set it before you call onLoaded.
     * @zh
     * 创建此基础图形网格的可选参数，请在 onLoaded 调用之前设置。
     */
    function Primitive() {
      var _this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PrimitiveType.BOX;

      _classCallCheck(this, Primitive);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Primitive).call(this));

      _initializerDefineProperty(_this, "type", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "info", _descriptor2, _assertThisInitialized(_this));

      _this.type = type;
      return _this;
    }
    /**
     * @en
     * Construct the primitive mesh with `type` and `info`.
     * @zh
     * 根据`type`和`info`构建相应的网格。
     */


    _createClass(Primitive, [{
      key: "onLoaded",
      value: function onLoaded() {
        (0, _utils.createMesh)(primitives[PrimitiveType[this.type].toLowerCase()](this.info), this);
      }
    }]);

    return Primitive;
  }(_mesh.Mesh), _class3.PrimitiveType = PrimitiveType, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return PrimitiveType.BOX;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "info", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return {};
    }
  })), _class2)) || _class);
  _exports.Primitive = Primitive;
  _globalExports.legacyCC.Primitive = Primitive;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcHJpbWl0aXZlL3ByaW1pdGl2ZS50cyJdLCJuYW1lcyI6WyJQcmltaXRpdmVUeXBlIiwiUHJpbWl0aXZlIiwidHlwZSIsIkJPWCIsInByaW1pdGl2ZXMiLCJ0b0xvd2VyQ2FzZSIsImluZm8iLCJNZXNoIiwic2VyaWFsaXphYmxlIiwiZWRpdGFibGUiLCJsZWdhY3lDQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BV0tBLGE7O2FBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtLQUFBQSxhLEtBQUFBLGE7O0FBVUwsb0JBQU9BLGFBQVA7QUFFQTs7Ozs7OztNQU9hQyxTLFdBRFosb0JBQVEsY0FBUixDLFVBV0ksaUJBQUtELGFBQUwsQzs7O0FBTkQ7Ozs7Ozs7QUFTQTs7Ozs7O0FBVUEseUJBQXVDO0FBQUE7O0FBQUEsVUFBMUJFLElBQTBCLHVFQUFuQkYsYUFBYSxDQUFDRyxHQUFLOztBQUFBOztBQUNuQzs7QUFEbUM7O0FBQUE7O0FBRW5DLFlBQUtELElBQUwsR0FBWUEsSUFBWjtBQUZtQztBQUd0QztBQUVEOzs7Ozs7Ozs7O2lDQU1tQjtBQUNmLCtCQUFXRSxVQUFVLENBQUNKLGFBQWEsQ0FBQyxLQUFLRSxJQUFOLENBQWIsQ0FBeUJHLFdBQXpCLEVBQUQsQ0FBVixDQUFtRCxLQUFLQyxJQUF4RCxDQUFYLEVBQTBFLElBQTFFO0FBQ0g7Ozs7SUFwQzBCQyxVLFdBRWJQLGEsR0FBZ0JBLGE7Ozs7O2FBU1JBLGFBQWEsQ0FBQ0csRzs7MkVBUW5DSyxtQixFQUNBQyxlOzs7OzthQUNxQyxFOzs7O0FBc0IxQ0MsMEJBQVNULFNBQVQsR0FBcUJBLFNBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSAzZC9wcmltaXRpdmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBjcmVhdGVNZXNoIH0gZnJvbSAnLi4vM2QvbWlzYy91dGlscyc7XHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tICcuLi9hc3NldHMvbWVzaCc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIHR5cGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgKiBhcyBwcmltaXRpdmVzIGZyb20gJy4uL3ByaW1pdGl2ZSc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL2VudW0nO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmVudW0gUHJpbWl0aXZlVHlwZSB7XHJcbiAgICBCT1ggPSAwLFxyXG4gICAgU1BIRVJFID0gMSxcclxuICAgIENZTElOREVSID0gMixcclxuICAgIENPTkUgPSAzLFxyXG4gICAgQ0FQU1VMRSA9IDQsXHJcbiAgICBUT1JVUyA9IDUsXHJcbiAgICBQTEFORSA9IDYsXHJcbiAgICBRVUFEID0gNyxcclxufVxyXG5jY2VudW0oUHJpbWl0aXZlVHlwZSk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEJhc2ljIHByaW1pdGl2ZSBtZXNoLCB0aGlzIGNhbiBiZSBnZW5lcmF0ZSBzb21lIHByaW1pdGl2ZSBtZXNoIGF0IHJ1bnRpbWUuXHJcbiAqIEB6aFxyXG4gKiDln7rnoYDlm77lvaLnvZHmoLzvvIzlj6/ku6XlnKjov5DooYzml7bmnoTlu7rkuIDkupvln7rnoYDnmoTnvZHmoLzjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5QcmltaXRpdmUnKVxyXG5leHBvcnQgY2xhc3MgUHJpbWl0aXZlIGV4dGVuZHMgTWVzaCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBQcmltaXRpdmVUeXBlID0gUHJpbWl0aXZlVHlwZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIHByaW1pdGl2ZSBtZXNoLCBzZXQgaXQgYmVmb3JlIHlvdSBjYWxsIG9uTG9hZGVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmraTln7rnoYDlm77lvaLnvZHmoLznmoTnsbvlnovvvIzor7flnKggb25Mb2FkZWQg6LCD55So5LmL5YmN6K6+572u44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFByaW1pdGl2ZVR5cGUpXHJcbiAgICBwdWJsaWMgdHlwZTogbnVtYmVyID0gUHJpbWl0aXZlVHlwZS5CT1g7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBvcHRpb24gZm9yIGJ1aWxkIHRoZSBwcmltaXRpdmUgbWVzaCwgc2V0IGl0IGJlZm9yZSB5b3UgY2FsbCBvbkxvYWRlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Yib5bu65q2k5Z+656GA5Zu+5b2i572R5qC855qE5Y+v6YCJ5Y+C5pWw77yM6K+35ZyoIG9uTG9hZGVkIOiwg+eUqOS5i+WJjeiuvue9ruOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBpbmZvOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge307XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHR5cGUgPSBQcmltaXRpdmVUeXBlLkJPWCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ29uc3RydWN0IHRoZSBwcmltaXRpdmUgbWVzaCB3aXRoIGB0eXBlYCBhbmQgYGluZm9gLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmoLnmja5gdHlwZWDlkoxgaW5mb2DmnoTlu7rnm7jlupTnmoTnvZHmoLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uTG9hZGVkICgpIHtcclxuICAgICAgICBjcmVhdGVNZXNoKHByaW1pdGl2ZXNbUHJpbWl0aXZlVHlwZVt0aGlzLnR5cGVdLnRvTG93ZXJDYXNlKCldKHRoaXMuaW5mbyksIHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgUHJpbWl0aXZlIHtcclxuICAgIGV4cG9ydCB0eXBlIFByaW1pdGl2ZVR5cGUgPSBFbnVtQWxpYXM8dHlwZW9mIFByaW1pdGl2ZVR5cGU+O1xyXG59XHJcblxyXG5sZWdhY3lDQy5QcmltaXRpdmUgPSBQcmltaXRpdmU7XHJcbiJdfQ==