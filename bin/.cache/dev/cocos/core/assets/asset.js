(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../data/decorators/property.js", "../event/index.js", "./raw-asset.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../data/decorators/property.js"), require("../event/index.js"), require("./raw-asset.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.property, global.index, global.rawAsset, global.globalExports, global.debug);
    global.asset = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _property, _index2, _rawAsset, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Asset = void 0;

  var _dec, _class, _class2, _descriptor, _class3, _temp;

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
   * Base class for handling assets used in Creator.<br/>
   *
   * You may want to override:<br/>
   * - createNode<br/>
   * - getset functions of _nativeAsset<br/>
   * - `Object._serialize`<br/>
   * - `Object._deserialize`<br/>
   * @zh
   * Creator 中的资源基类。<br/>
   *
   * 您可能需要重写：<br/>
   * - createNode <br/>
   * - _nativeAsset 的 getset 方法<br/>
   * - `Object._serialize`<br/>
   * - `Object._deserialize`<br/>
   *
   * @class Asset
   * @extends RawAsset
   */
  var Asset = (_dec = (0, _index.ccclass)('cc.Asset'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Eventify) {
    _inherits(Asset, _Eventify);

    function Asset() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Asset);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Asset)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.loaded = true;

      _initializerDefineProperty(_this, "_native", _descriptor, _assertThisInitialized(_this));

      _this._file = null;
      return _this;
    }

    _createClass(Asset, [{
      key: "toString",

      /**
       * @en
       * Returns the string representation of the object.<br>
       * The `Asset` object overrides the `toString()` method of the `Object` object.<br>
       * JavaScript calls the toString() method automatically<br>
       * when an asset is to be represented as a text value or when a texture is referred to in a string concatenation.<br>
       * <br>
       * For assets of the native type, it will return `this.nativeUrl`.<br>
       * Otherwise, an empty string is returned.<br>
       * This method may be overwritten by subclasses.
       * @zh
       * 返回对象的字符串表示形式。<br>
       * `Asset` 对象将会重写 `Object` 对象的 `toString()` 方法。<br>
       * 当资源要表示为文本值时或在字符串连接时引用时，<br>
       * JavaScript 会自动调用 toString() 方法。<br>
       * <br>
       * 对于原始类型的资源，它将返回`this.nativeUrl`。<br>
       * 否则，返回空字符串。<br>
       * 子类可能会覆盖此方法。
       * @method toString
       * @return {String}
       */
      value: function toString() {
        return this.nativeUrl;
      }
      /**
       * 应 AssetDB 要求提供这个方法。
       * 返回一个序列化后的对象
       *
       * @method serialize
       * @return {String}
       * @private
       */

    }, {
      key: "serialize",
      value: function serialize() {}
      /**
       * @en
       * Set native file name for this asset.
       * @zh
       * 为此资源设置原始文件名。
       * @seealso nativeUrl
       *
       * @param filename
       * @param inLibrary
       * @private
       */

    }, {
      key: "_setRawAsset",
      value: function _setRawAsset(filename) {
        var inLibrary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (inLibrary !== false) {
          this._native = filename || '';
        } else {
          this._native = '/' + filename; // simply use '/' to tag location where is not in the library
        }
      }
      /**
       * @en
       * Create a new node using this asset in the scene.<br/>
       * If this type of asset dont have its corresponding node type, this method should be null.
       * @zh
       * 使用该资源在场景中创建一个新节点。<br/>
       * 如果这类资源没有相应的节点类型，该方法应该是空的。
       */

    }, {
      key: "nativeUrl",

      /**
       * @en
       * Returns the url of this asset's native object, if none it will returns an empty string.
       * @zh
       * 返回该资源对应的目标平台资源的 URL，如果没有将返回一个空字符串。
       * @readOnly
       */
      get: function get() {
        if (this._native) {
          var name = this._native;

          if (name.charCodeAt(0) === 47) {
            // '/'
            // remove library tag
            // not imported in library, just created on-the-fly
            return name.slice(1);
          }

          if (_globalExports.legacyCC.AssetLibrary) {
            var base = _globalExports.legacyCC.AssetLibrary.getLibUrlNoExt(this._uuid, true);

            if (name.charCodeAt(0) === 46) {
              // '.'
              // imported in dir where json exist
              return base + name;
            } else {
              // imported in an independent dir
              return base + '/' + name;
            }
          } else {
            (0, _debug.errorID)(6400);
          }
        }

        return '';
      }
      /**
       * @en
       * The underlying native asset of this asset if one is available.<br>
       * This property can be used to access additional details or functionality releated to the asset.<br>
       * This property will be initialized by the loader if `_native` is available.
       * @zh
       * 此资源的基础资源（如果有）。 此属性可用于访问与资源相关的其他详细信息或功能。<br>
       * 如果`_native`可用，则此属性将由加载器初始化。
       * @default null
       * @private
       */

    }, {
      key: "_nativeAsset",
      get: function get() {
        return this._file;
      },
      set: function set(obj) {
        this._file = obj;
      }
    }], [{
      key: "deserialize",

      /**
       * 应 AssetDB 要求提供这个方法。
       * @method deserialize
       * @param {String} data
       * @return {Asset}
       */
      value: function deserialize(data) {
        return _globalExports.legacyCC.deserialize(data);
      }
      /**
       * @en
       * Whether the asset is loaded or not
       * @zh
       * 该资源是否已经成功加载。
       */

    }]);

    return Asset;
  }((0, _index2.Eventify)(_rawAsset.RawAsset)), _class3.preventDeferredLoadDependents = false, _class3.preventPreloadNativeObject = false, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_native", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "_nativeAsset", [_property.property], Object.getOwnPropertyDescriptor(_class2.prototype, "_nativeAsset"), _class2.prototype)), _class2)) || _class);
  /**
   * @param error - null or the error info
   * @param node - the created node or null
   */

  _exports.Asset = Asset;
  // @ts-ignore
  Asset.prototype.createNode = null;
  _globalExports.legacyCC.Asset = Asset;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL2Fzc2V0LnRzIl0sIm5hbWVzIjpbIkFzc2V0IiwibG9hZGVkIiwiX2ZpbGUiLCJuYXRpdmVVcmwiLCJmaWxlbmFtZSIsImluTGlicmFyeSIsIl9uYXRpdmUiLCJuYW1lIiwiY2hhckNvZGVBdCIsInNsaWNlIiwibGVnYWN5Q0MiLCJBc3NldExpYnJhcnkiLCJiYXNlIiwiZ2V0TGliVXJsTm9FeHQiLCJfdXVpZCIsIm9iaiIsImRhdGEiLCJkZXNlcmlhbGl6ZSIsIlJhd0Fzc2V0IiwicHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHMiLCJwcmV2ZW50UHJlbG9hZE5hdGl2ZU9iamVjdCIsInNlcmlhbGl6YWJsZSIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiY3JlYXRlTm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bc0JhQSxLLFdBRFosb0JBQVEsVUFBUixDOzs7Ozs7Ozs7Ozs7Ozs7WUFpQ1VDLE0sR0FBUyxJOzs7O1lBWVJDLEssR0FBYSxJOzs7Ozs7O0FBc0RyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQ0FzQm1CO0FBQ2YsZUFBTyxLQUFLQyxTQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7a0NBUW9CLENBQUc7QUFFdkI7Ozs7Ozs7Ozs7Ozs7O21DQVdxQkMsUSxFQUE2QztBQUFBLFlBQTNCQyxTQUEyQix1RUFBTixJQUFNOztBQUM5RCxZQUFJQSxTQUFTLEtBQUssS0FBbEIsRUFBeUI7QUFDckIsZUFBS0MsT0FBTCxHQUFlRixRQUFRLElBQUksRUFBM0I7QUFDSCxTQUZELE1BR0s7QUFDRCxlQUFLRSxPQUFMLEdBQWUsTUFBTUYsUUFBckIsQ0FEQyxDQUMrQjtBQUNuQztBQUNKO0FBRUQ7Ozs7Ozs7Ozs7OztBQTVHQTs7Ozs7OzswQkFPaUI7QUFDYixZQUFJLEtBQUtFLE9BQVQsRUFBa0I7QUFDZCxjQUFNQyxJQUFJLEdBQUcsS0FBS0QsT0FBbEI7O0FBQ0EsY0FBSUMsSUFBSSxDQUFDQyxVQUFMLENBQWdCLENBQWhCLE1BQXVCLEVBQTNCLEVBQStCO0FBQUs7QUFDaEM7QUFDQTtBQUNBLG1CQUFPRCxJQUFJLENBQUNFLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDSDs7QUFDRCxjQUFJQyx3QkFBU0MsWUFBYixFQUEyQjtBQUN2QixnQkFBTUMsSUFBSSxHQUFHRix3QkFBU0MsWUFBVCxDQUFzQkUsY0FBdEIsQ0FBcUMsS0FBS0MsS0FBMUMsRUFBaUQsSUFBakQsQ0FBYjs7QUFDQSxnQkFBSVAsSUFBSSxDQUFDQyxVQUFMLENBQWdCLENBQWhCLE1BQXVCLEVBQTNCLEVBQStCO0FBQUc7QUFDOUI7QUFDQSxxQkFBT0ksSUFBSSxHQUFHTCxJQUFkO0FBQ0gsYUFIRCxNQUlLO0FBQ0Q7QUFDQSxxQkFBT0ssSUFBSSxHQUFHLEdBQVAsR0FBYUwsSUFBcEI7QUFDSDtBQUNKLFdBVkQsTUFXSztBQUNELGdDQUFRLElBQVI7QUFDSDtBQUNKOztBQUNELGVBQU8sRUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OzBCQVl5QjtBQUNyQixlQUFPLEtBQUtMLEtBQVo7QUFDSCxPO3dCQUNpQmEsRyxFQUFLO0FBQ25CLGFBQUtiLEtBQUwsR0FBYWEsR0FBYjtBQUNIOzs7O0FBaEZEOzs7Ozs7a0NBTTJCQyxJLEVBQU07QUFDN0IsZUFBT04sd0JBQVNPLFdBQVQsQ0FBcUJELElBQXJCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O0lBMUJ1QixzQkFBU0Usa0JBQVQsQyxXQU9UQyw2QixHQUFnQyxLLFVBT2hDQywwQixHQUE2QixLLGtGQTJCMUNDLG1COzs7OzthQUN3QixFOztvRUFnRHhCQyxrQjtBQTJFTDs7Ozs7O0FBTUE7QUFDQXRCLEVBQUFBLEtBQUssQ0FBQ3VCLFNBQU4sQ0FBZ0JDLFVBQWhCLEdBQTZCLElBQTdCO0FBRUFkLDBCQUFTVixLQUFULEdBQWlCQSxLQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYXNzZXRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBwcm9wZXJ0eSB9IGZyb20gJy4uL2RhdGEvZGVjb3JhdG9ycy9wcm9wZXJ0eSc7XHJcbmltcG9ydCB7IEV2ZW50aWZ5IH0gZnJvbSAnLi4vZXZlbnQnO1xyXG5pbXBvcnQgeyBSYXdBc3NldCB9IGZyb20gJy4vcmF3LWFzc2V0JztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IGVycm9ySUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEJhc2UgY2xhc3MgZm9yIGhhbmRsaW5nIGFzc2V0cyB1c2VkIGluIENyZWF0b3IuPGJyLz5cclxuICpcclxuICogWW91IG1heSB3YW50IHRvIG92ZXJyaWRlOjxici8+XHJcbiAqIC0gY3JlYXRlTm9kZTxici8+XHJcbiAqIC0gZ2V0c2V0IGZ1bmN0aW9ucyBvZiBfbmF0aXZlQXNzZXQ8YnIvPlxyXG4gKiAtIGBPYmplY3QuX3NlcmlhbGl6ZWA8YnIvPlxyXG4gKiAtIGBPYmplY3QuX2Rlc2VyaWFsaXplYDxici8+XHJcbiAqIEB6aFxyXG4gKiBDcmVhdG9yIOS4reeahOi1hOa6kOWfuuexu+OAgjxici8+XHJcbiAqXHJcbiAqIOaCqOWPr+iDvemcgOimgemHjeWGme+8mjxici8+XHJcbiAqIC0gY3JlYXRlTm9kZSA8YnIvPlxyXG4gKiAtIF9uYXRpdmVBc3NldCDnmoQgZ2V0c2V0IOaWueazlTxici8+XHJcbiAqIC0gYE9iamVjdC5fc2VyaWFsaXplYDxici8+XHJcbiAqIC0gYE9iamVjdC5fZGVzZXJpYWxpemVgPGJyLz5cclxuICpcclxuICogQGNsYXNzIEFzc2V0XHJcbiAqIEBleHRlbmRzIFJhd0Fzc2V0XHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQXNzZXQnKVxyXG5leHBvcnQgY2xhc3MgQXNzZXQgZXh0ZW5kcyBFdmVudGlmeShSYXdBc3NldCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEluZGljYXRlcyB3aGV0aGVyIGl0cyBkZXBlbmRlbnQgcmF3IGFzc2V0cyBjYW4gc3VwcG9ydCBkZWZlcnJlZCBsb2FkIGlmIHRoZSBvd25lciBzY2VuZSAob3IgcHJlZmFiKSBpcyBtYXJrZWQgYXMgYGFzeW5jTG9hZEFzc2V0c2AuXHJcbiAgICAgKiBAemgg5b2T5Zy65pmv5oiWIFByZWZhYiDooqvmoIforrDkuLogYGFzeW5jTG9hZEFzc2V0c2DvvIznpoHmraLlu7bov5/liqDovb3or6XotYTmupDmiYDkvp3otZbnmoTlhbblroMgUmF3QXNzZXTjgIJcclxuICAgICAqIEBkZWZhdWx0IGZhbHNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHMgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbmRpY2F0ZXMgd2hldGhlciBpdHMgbmF0aXZlIG9iamVjdCBzaG91bGQgYmUgcHJlbG9hZGVkIGZyb20gbmF0aXZlIHVybC5cclxuICAgICAqIEB6aCDnpoHmraLpooTliqDovb3ljp/nlJ/lr7nosaHjgIJcclxuICAgICAqIEBkZWZhdWx0IGZhbHNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcHJldmVudFByZWxvYWROYXRpdmVPYmplY3QgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW6lCBBc3NldERCIOimgeaxguaPkOS+m+i/meS4quaWueazleOAglxyXG4gICAgICogQG1ldGhvZCBkZXNlcmlhbGl6ZVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcclxuICAgICAqIEByZXR1cm4ge0Fzc2V0fVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlc2VyaWFsaXplIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGxlZ2FjeUNDLmRlc2VyaWFsaXplKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBhc3NldCBpcyBsb2FkZWQgb3Igbm90XHJcbiAgICAgKiBAemhcclxuICAgICAqIOivpei1hOa6kOaYr+WQpuW3sue7j+aIkOWKn+WKoOi9veOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2VyaWFsaXphYmxlIHVybCBmb3IgbmF0aXZlIGFzc2V0LiBGb3IgaW50ZXJuYWwgdXNhZ2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOeUqOS6juacrOacuui1hOS6p+eahOWPr+W6j+WIl+WMllVSTOOAguS+m+WGhemDqOS9v+eUqOOAglxyXG4gICAgICogQGRlZmF1bHQgXCJcIlxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgX25hdGl2ZTogc3RyaW5nID0gJyc7XHJcblxyXG4gICAgcHJpdmF0ZSBfZmlsZTogYW55ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmV0dXJucyB0aGUgdXJsIG9mIHRoaXMgYXNzZXQncyBuYXRpdmUgb2JqZWN0LCBpZiBub25lIGl0IHdpbGwgcmV0dXJucyBhbiBlbXB0eSBzdHJpbmcuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi/lOWbnuivpei1hOa6kOWvueW6lOeahOebruagh+W5s+WPsOi1hOa6kOeahCBVUkzvvIzlpoLmnpzmsqHmnInlsIbov5Tlm57kuIDkuKrnqbrlrZfnrKbkuLLjgIJcclxuICAgICAqIEByZWFkT25seVxyXG4gICAgICovXHJcbiAgICBnZXQgbmF0aXZlVXJsICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbmF0aXZlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9uYXRpdmU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lLmNoYXJDb2RlQXQoMCkgPT09IDQ3KSB7ICAgIC8vICcvJ1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGxpYnJhcnkgdGFnXHJcbiAgICAgICAgICAgICAgICAvLyBub3QgaW1wb3J0ZWQgaW4gbGlicmFyeSwganVzdCBjcmVhdGVkIG9uLXRoZS1mbHlcclxuICAgICAgICAgICAgICAgIHJldHVybiBuYW1lLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsZWdhY3lDQy5Bc3NldExpYnJhcnkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2UgPSBsZWdhY3lDQy5Bc3NldExpYnJhcnkuZ2V0TGliVXJsTm9FeHQodGhpcy5fdXVpZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5jaGFyQ29kZUF0KDApID09PSA0NikgeyAgLy8gJy4nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaW1wb3J0ZWQgaW4gZGlyIHdoZXJlIGpzb24gZXhpc3RcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzZSArIG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpbXBvcnRlZCBpbiBhbiBpbmRlcGVuZGVudCBkaXJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmFzZSArICcvJyArIG5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDY0MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHVuZGVybHlpbmcgbmF0aXZlIGFzc2V0IG9mIHRoaXMgYXNzZXQgaWYgb25lIGlzIGF2YWlsYWJsZS48YnI+XHJcbiAgICAgKiBUaGlzIHByb3BlcnR5IGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBhZGRpdGlvbmFsIGRldGFpbHMgb3IgZnVuY3Rpb25hbGl0eSByZWxlYXRlZCB0byB0aGUgYXNzZXQuPGJyPlxyXG4gICAgICogVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIGluaXRpYWxpemVkIGJ5IHRoZSBsb2FkZXIgaWYgYF9uYXRpdmVgIGlzIGF2YWlsYWJsZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5q2k6LWE5rqQ55qE5Z+656GA6LWE5rqQ77yI5aaC5p6c5pyJ77yJ44CCIOatpOWxnuaAp+WPr+eUqOS6juiuv+mXruS4jui1hOa6kOebuOWFs+eahOWFtuS7luivpue7huS/oeaBr+aIluWKn+iDveOAgjxicj5cclxuICAgICAqIOWmguaenGBfbmF0aXZlYOWPr+eUqO+8jOWImeatpOWxnuaAp+WwhueUseWKoOi9veWZqOWIneWni+WMluOAglxyXG4gICAgICogQGRlZmF1bHQgbnVsbFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICBnZXQgX25hdGl2ZUFzc2V0ICgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maWxlO1xyXG4gICAgfVxyXG4gICAgc2V0IF9uYXRpdmVBc3NldCAob2JqKSB7XHJcbiAgICAgICAgdGhpcy5fZmlsZSA9IG9iajtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3QuPGJyPlxyXG4gICAgICogVGhlIGBBc3NldGAgb2JqZWN0IG92ZXJyaWRlcyB0aGUgYHRvU3RyaW5nKClgIG1ldGhvZCBvZiB0aGUgYE9iamVjdGAgb2JqZWN0Ljxicj5cclxuICAgICAqIEphdmFTY3JpcHQgY2FsbHMgdGhlIHRvU3RyaW5nKCkgbWV0aG9kIGF1dG9tYXRpY2FsbHk8YnI+XHJcbiAgICAgKiB3aGVuIGFuIGFzc2V0IGlzIHRvIGJlIHJlcHJlc2VudGVkIGFzIGEgdGV4dCB2YWx1ZSBvciB3aGVuIGEgdGV4dHVyZSBpcyByZWZlcnJlZCB0byBpbiBhIHN0cmluZyBjb25jYXRlbmF0aW9uLjxicj5cclxuICAgICAqIDxicj5cclxuICAgICAqIEZvciBhc3NldHMgb2YgdGhlIG5hdGl2ZSB0eXBlLCBpdCB3aWxsIHJldHVybiBgdGhpcy5uYXRpdmVVcmxgLjxicj5cclxuICAgICAqIE90aGVyd2lzZSwgYW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkLjxicj5cclxuICAgICAqIFRoaXMgbWV0aG9kIG1heSBiZSBvdmVyd3JpdHRlbiBieSBzdWJjbGFzc2VzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDov5Tlm57lr7nosaHnmoTlrZfnrKbkuLLooajnpLrlvaLlvI/jgII8YnI+XHJcbiAgICAgKiBgQXNzZXRgIOWvueixoeWwhuS8mumHjeWGmSBgT2JqZWN0YCDlr7nosaHnmoQgYHRvU3RyaW5nKClgIOaWueazleOAgjxicj5cclxuICAgICAqIOW9k+i1hOa6kOimgeihqOekuuS4uuaWh+acrOWAvOaXtuaIluWcqOWtl+espuS4sui/nuaOpeaXtuW8leeUqOaXtu+8jDxicj5cclxuICAgICAqIEphdmFTY3JpcHQg5Lya6Ieq5Yqo6LCD55SoIHRvU3RyaW5nKCkg5pa55rOV44CCPGJyPlxyXG4gICAgICogPGJyPlxyXG4gICAgICog5a+55LqO5Y6f5aeL57G75Z6L55qE6LWE5rqQ77yM5a6D5bCG6L+U5ZueYHRoaXMubmF0aXZlVXJsYOOAgjxicj5cclxuwqDCoMKgwqDCoCog5ZCm5YiZ77yM6L+U5Zue56m65a2X56ym5Liy44CCPGJyPlxyXG7CoMKgwqDCoMKgKiDlrZDnsbvlj6/og73kvJropobnm5bmraTmlrnms5XjgIJcclxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYXRpdmVVcmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlupQgQXNzZXREQiDopoHmsYLmj5Dkvpvov5nkuKrmlrnms5XjgIJcclxuICAgICAqIOi/lOWbnuS4gOS4quW6j+WIl+WMluWQjueahOWvueixoVxyXG4gICAgICpcclxuICAgICAqIEBtZXRob2Qgc2VyaWFsaXplXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VyaWFsaXplICgpIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXQgbmF0aXZlIGZpbGUgbmFtZSBmb3IgdGhpcyBhc3NldC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Li65q2k6LWE5rqQ6K6+572u5Y6f5aeL5paH5Lu25ZCN44CCXHJcbiAgICAgKiBAc2VlYWxzbyBuYXRpdmVVcmxcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZmlsZW5hbWVcclxuICAgICAqIEBwYXJhbSBpbkxpYnJhcnlcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfc2V0UmF3QXNzZXQgKGZpbGVuYW1lOiBzdHJpbmcsIGluTGlicmFyeTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAoaW5MaWJyYXJ5ICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9uYXRpdmUgPSBmaWxlbmFtZSB8fCAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25hdGl2ZSA9ICcvJyArIGZpbGVuYW1lOyAgLy8gc2ltcGx5IHVzZSAnLycgdG8gdGFnIGxvY2F0aW9uIHdoZXJlIGlzIG5vdCBpbiB0aGUgbGlicmFyeVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ3JlYXRlIGEgbmV3IG5vZGUgdXNpbmcgdGhpcyBhc3NldCBpbiB0aGUgc2NlbmUuPGJyLz5cclxuICAgICAqIElmIHRoaXMgdHlwZSBvZiBhc3NldCBkb250IGhhdmUgaXRzIGNvcnJlc3BvbmRpbmcgbm9kZSB0eXBlLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgbnVsbC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5L2/55So6K+l6LWE5rqQ5Zyo5Zy65pmv5Lit5Yib5bu65LiA5Liq5paw6IqC54K544CCPGJyLz5cclxuICAgICAqIOWmguaenOi/meexu+i1hOa6kOayoeacieebuOW6lOeahOiKgueCueexu+Wei++8jOivpeaWueazleW6lOivpeaYr+epuueahOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlTm9kZT8gKGNhbGxiYWNrOiBDcmVhdGVOb2RlQ2FsbGJhY2spOiB2b2lkO1xyXG59XHJcblxyXG4vKipcclxuICogQHBhcmFtIGVycm9yIC0gbnVsbCBvciB0aGUgZXJyb3IgaW5mb1xyXG4gKiBAcGFyYW0gbm9kZSAtIHRoZSBjcmVhdGVkIG5vZGUgb3IgbnVsbFxyXG4gKi9cclxudHlwZSBDcmVhdGVOb2RlQ2FsbGJhY2sgPSAoZXJyb3I6IEVycm9yIHwgbnVsbCwgbm9kZTogTm9kZSkgPT4gdm9pZDtcclxuXHJcbi8vIEB0cy1pZ25vcmVcclxuQXNzZXQucHJvdG90eXBlLmNyZWF0ZU5vZGUgPSBudWxsO1xyXG5cclxubGVnYWN5Q0MuQXNzZXQgPSBBc3NldDtcclxuIl19