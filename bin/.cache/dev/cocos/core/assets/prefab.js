(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../data/instantiate-jit.js", "../utils/js.js", "../value-types/index.js", "./asset.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../data/instantiate-jit.js"), require("../utils/js.js"), require("../value-types/index.js"), require("./asset.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.instantiateJit, global.js, global.index, global.asset, global.defaultConstants, global.globalExports, global.debug);
    global.prefab = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _instantiateJit, _js, _index2, _asset, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

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
   * Prefab 创建实例所用的优化策略，配合 [[optimizationPolicy]] 使用。
   *
   * @enum Prefab.OptimizationPolicy
   * @since 1.10.0
   */
  var OptimizationPolicy = (0, _index2.Enum)({
    /**
     * 根据创建次数自动调整优化策略。初次创建实例时，行为等同 SINGLE_INSTANCE，多次创建后将自动采用 MULTI_INSTANCE。
     */
    AUTO: 0,

    /**
     * 优化单次创建性能。<br>
     * 该选项会跳过针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般只会创建一个实例时，请选择此项。
     */
    SINGLE_INSTANCE: 1,

    /**
     * 优化多次创建性能。<br>
     * 该选项会启用针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般会创建多个实例时，请选择此项。如果该 prefab 在场景中的节点启用了自动关联，并且在场景中有多份实例，也建议选择此项。
     */
    MULTI_INSTANCE: 2
  });
  /**
   * @en Class for prefab handling.
   * @zh 预制资源类。
   */

  var Prefab = (_dec = (0, _index.ccclass)('cc.Prefab'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Asset) {
    _inherits(Prefab, _Asset);

    /**
     * @zh
     * 设置实例化这个 prefab 时所用的优化策略。根据使用情况设置为合适的值，能优化该 prefab 实例化所用的时间。
     * @en
     * Indicates the optimization policy for instantiating this prefab.
     * Set to a suitable value based on usage, can optimize the time it takes to instantiate this prefab.
     *
     * @default Prefab.OptimizationPolicy.AUTO
     * @since 1.10.0
     * @example
     * ```ts
     * import { Prefab } from 'cc';
     * prefab.optimizationPolicy = Prefab.OptimizationPolicy.MULTI_INSTANCE;
     * ```
     */

    /**
     * @en Indicates the raw assets of this prefab can be load after prefab loaded.
     * @zh 指示该 Prefab 依赖的资源可否在 Prefab 加载后再延迟加载。
     * @default false
     */
    function Prefab() {
      var _this;

      _classCallCheck(this, Prefab);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Prefab).call(this));
      /**
       * Cache function to optimize instance creaton.
       */

      _initializerDefineProperty(_this, "data", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "optimizationPolicy", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "asyncLoadAssets", _descriptor3, _assertThisInitialized(_this));

      _this._createFunction = void 0;
      _this._instantiatedTimes = void 0;
      _this._createFunction = null;
      _this._instantiatedTimes = 0;
      return _this;
    }

    _createClass(Prefab, [{
      key: "createNode",
      value: function createNode(cb) {
        var node = _globalExports.legacyCC.instantiate(this);

        node.name = this.name;
        cb(null, node);
      }
      /**
       * @en
       * Dynamically translation prefab data into minimized code.<br/>
       * This method will be called automatically before the first time the prefab being instantiated,<br/>
       * but you can re-call to refresh the create function once you modified the original prefab data in script.
       * @zh
       * 将预制数据动态转换为最小化代码。<br/>
       * 此方法将在第一次实例化预制件之前自动调用，<br/>
       * 但是您可以在脚本中修改原始预制数据后重新调用以刷新创建功能。
       */

    }, {
      key: "compileCreateFunction",
      value: function compileCreateFunction() {
        this._createFunction = (0, _instantiateJit.compile)(this.data);
      } // just instantiate, will not initialize the Node, this will be called during Node's initialization.
      // @param {Node} [rootToRedirect] - specify an instantiated prefabRoot that all references to prefabRoot in prefab
      //                                  will redirect to

    }, {
      key: "_doInstantiate",
      value: function _doInstantiate(rootToRedirect) {
        if (this.data._prefab) {
          // prefab asset is always synced
          this.data._prefab._synced = true;
        } else {
          // temp guard code
          (0, _debug.warnID)(3700);
        }

        if (!this._createFunction) {
          this.compileCreateFunction();
        }

        return this._createFunction(rootToRedirect); // this.data._instantiate();
      }
    }, {
      key: "_instantiate",
      value: function _instantiate() {
        var node;
        var useJit = false;

        if (_defaultConstants.SUPPORT_JIT) {
          if (this.optimizationPolicy === OptimizationPolicy.SINGLE_INSTANCE) {
            useJit = false;
          } else if (this.optimizationPolicy === OptimizationPolicy.MULTI_INSTANCE) {
            useJit = true;
          } else {
            // auto
            useJit = this._instantiatedTimes + 1 >= Prefab.OptimizationPolicyThreshold;
          }
        }

        if (useJit) {
          // instantiate node
          node = this._doInstantiate(); // initialize node

          this.data._instantiate(node);
        } else {
          // prefab asset is always synced
          this.data._prefab._synced = true; // instantiate node

          node = this.data._instantiate();
        }

        ++this._instantiatedTimes;
        return node;
      }
    }]);

    return Prefab;
  }(_asset.Asset), _class3.OptimizationPolicy = OptimizationPolicy, _class3.OptimizationPolicyThreshold = 3, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "data", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "optimizationPolicy", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return OptimizationPolicy.AUTO;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "asyncLoadAssets", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class);
  _exports.default = Prefab;
  _globalExports.legacyCC.Prefab = Prefab;

  if (_defaultConstants.ALIPAY || _defaultConstants.RUNTIME_BASED) {
    _globalExports.legacyCC._Prefab = Prefab;
  } else {
    (0, _js.obsolete)(_globalExports.legacyCC, 'cc._Prefab', 'Prefab');
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3ByZWZhYi50cyJdLCJuYW1lcyI6WyJPcHRpbWl6YXRpb25Qb2xpY3kiLCJBVVRPIiwiU0lOR0xFX0lOU1RBTkNFIiwiTVVMVElfSU5TVEFOQ0UiLCJQcmVmYWIiLCJfY3JlYXRlRnVuY3Rpb24iLCJfaW5zdGFudGlhdGVkVGltZXMiLCJjYiIsIm5vZGUiLCJsZWdhY3lDQyIsImluc3RhbnRpYXRlIiwibmFtZSIsImRhdGEiLCJyb290VG9SZWRpcmVjdCIsIl9wcmVmYWIiLCJfc3luY2VkIiwiY29tcGlsZUNyZWF0ZUZ1bmN0aW9uIiwidXNlSml0IiwiU1VQUE9SVF9KSVQiLCJvcHRpbWl6YXRpb25Qb2xpY3kiLCJPcHRpbWl6YXRpb25Qb2xpY3lUaHJlc2hvbGQiLCJfZG9JbnN0YW50aWF0ZSIsIl9pbnN0YW50aWF0ZSIsIkFzc2V0Iiwic2VyaWFsaXphYmxlIiwiZWRpdGFibGUiLCJBTElQQVkiLCJSVU5USU1FX0JBU0VEIiwiX1ByZWZhYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQTs7Ozs7O0FBTUEsTUFBTUEsa0JBQWtCLEdBQUcsa0JBQUs7QUFDNUI7OztBQUdBQyxJQUFBQSxJQUFJLEVBQUUsQ0FKc0I7O0FBSzVCOzs7O0FBSUFDLElBQUFBLGVBQWUsRUFBRSxDQVRXOztBQVU1Qjs7OztBQUlBQyxJQUFBQSxjQUFjLEVBQUU7QUFkWSxHQUFMLENBQTNCO0FBaUJBOzs7OztNQUtxQkMsTSxXQURwQixvQkFBUSxXQUFSLEM7OztBQVdHOzs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7OztBQVdBLHNCQUFlO0FBQUE7O0FBQUE7O0FBQ1g7QUFDQTs7OztBQUZXOztBQUFBOztBQUFBOztBQUFBLFlBRlBDLGVBRU87QUFBQSxZQURQQyxrQkFDTztBQUtYLFlBQUtELGVBQUwsR0FBdUIsSUFBdkI7QUFFQSxZQUFLQyxrQkFBTCxHQUEwQixDQUExQjtBQVBXO0FBUWQ7Ozs7aUNBRWtCQyxFLEVBQW9CO0FBQ25DLFlBQU1DLElBQUksR0FBR0Msd0JBQVNDLFdBQVQsQ0FBcUIsSUFBckIsQ0FBYjs7QUFDQUYsUUFBQUEsSUFBSSxDQUFDRyxJQUFMLEdBQVksS0FBS0EsSUFBakI7QUFDQUosUUFBQUEsRUFBRSxDQUFDLElBQUQsRUFBT0MsSUFBUCxDQUFGO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs4Q0FVc0M7QUFDbEMsYUFBS0gsZUFBTCxHQUF1Qiw2QkFBUSxLQUFLTyxJQUFiLENBQXZCO0FBQ0gsTyxDQUVEO0FBQ0E7QUFDQTs7OztxQ0FDd0JDLGMsRUFBc0I7QUFDMUMsWUFBSSxLQUFLRCxJQUFMLENBQVVFLE9BQWQsRUFBdUI7QUFDbkI7QUFDQSxlQUFLRixJQUFMLENBQVVFLE9BQVYsQ0FBa0JDLE9BQWxCLEdBQTRCLElBQTVCO0FBQ0gsU0FIRCxNQUlLO0FBQ0Q7QUFDQSw2QkFBTyxJQUFQO0FBQ0g7O0FBQ0QsWUFBSSxDQUFDLEtBQUtWLGVBQVYsRUFBMkI7QUFDdkIsZUFBS1cscUJBQUw7QUFDSDs7QUFDRCxlQUFPLEtBQUtYLGVBQUwsQ0FBc0JRLGNBQXRCLENBQVAsQ0FaMEMsQ0FZSztBQUNsRDs7O3FDQUV1QjtBQUNwQixZQUFJTCxJQUFKO0FBQ0EsWUFBSVMsTUFBZSxHQUFHLEtBQXRCOztBQUNBLFlBQUlDLDZCQUFKLEVBQWlCO0FBQ2IsY0FBSSxLQUFLQyxrQkFBTCxLQUE0Qm5CLGtCQUFrQixDQUFDRSxlQUFuRCxFQUFvRTtBQUNoRWUsWUFBQUEsTUFBTSxHQUFHLEtBQVQ7QUFDSCxXQUZELE1BR0ssSUFBSSxLQUFLRSxrQkFBTCxLQUE0Qm5CLGtCQUFrQixDQUFDRyxjQUFuRCxFQUFtRTtBQUNwRWMsWUFBQUEsTUFBTSxHQUFHLElBQVQ7QUFDSCxXQUZJLE1BR0E7QUFDRDtBQUNBQSxZQUFBQSxNQUFNLEdBQUksS0FBS1gsa0JBQUwsR0FBMEIsQ0FBM0IsSUFBaUNGLE1BQU0sQ0FBQ2dCLDJCQUFqRDtBQUNIO0FBQ0o7O0FBQ0QsWUFBSUgsTUFBSixFQUFZO0FBQ1I7QUFDQVQsVUFBQUEsSUFBSSxHQUFHLEtBQUthLGNBQUwsRUFBUCxDQUZRLENBR1I7O0FBQ0EsZUFBS1QsSUFBTCxDQUFVVSxZQUFWLENBQXVCZCxJQUF2QjtBQUNILFNBTEQsTUFNSztBQUNEO0FBQ0EsZUFBS0ksSUFBTCxDQUFVRSxPQUFWLENBQWtCQyxPQUFsQixHQUE0QixJQUE1QixDQUZDLENBR0Q7O0FBQ0FQLFVBQUFBLElBQUksR0FBRyxLQUFLSSxJQUFMLENBQVVVLFlBQVYsRUFBUDtBQUNIOztBQUNELFVBQUUsS0FBS2hCLGtCQUFQO0FBRUEsZUFBT0UsSUFBUDtBQUNIOzs7O0lBdEgrQmUsWSxXQUVsQnZCLGtCLEdBQXFCQSxrQixVQUVyQm9CLDJCLEdBQThCLEMsK0VBRTNDSSxtQixFQUNBQyxlOzs7OzthQUNrQixJOzt5RkFpQmxCRCxtQixFQUNBQyxlOzs7OzthQUMyQnpCLGtCQUFrQixDQUFDQyxJOztzRkFPOUN1QixtQixFQUNBQyxlOzs7OzthQUNpQyxLOzs7O0FBcUZ0Q2hCLDBCQUFTTCxNQUFULEdBQWtCQSxNQUFsQjs7QUFDQSxNQUFJc0IsNEJBQVVDLCtCQUFkLEVBQTZCO0FBQ3pCbEIsNEJBQVNtQixPQUFULEdBQW1CeEIsTUFBbkI7QUFDSCxHQUZELE1BRU87QUFDSCxzQkFBU0ssdUJBQVQsRUFBbUIsWUFBbkIsRUFBaUMsUUFBakM7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYXNzZXRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBzZXJpYWxpemFibGUsIGVkaXRhYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgY29tcGlsZSB9IGZyb20gJy4uL2RhdGEvaW5zdGFudGlhdGUtaml0JztcclxuaW1wb3J0IHsgb2Jzb2xldGUgfSBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IEVudW0gfSBmcm9tICcuLi92YWx1ZS10eXBlcyc7XHJcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnLi9hc3NldCc7XHJcbmltcG9ydCB7IFNVUFBPUlRfSklULCBBTElQQVksIFJVTlRJTUVfQkFTRUQgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgd2FybklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5cclxuLyoqXHJcbiAqIFByZWZhYiDliJvlu7rlrp7kvovmiYDnlKjnmoTkvJjljJbnrZbnlaXvvIzphY3lkIggW1tvcHRpbWl6YXRpb25Qb2xpY3ldXSDkvb/nlKjjgIJcclxuICpcclxuICogQGVudW0gUHJlZmFiLk9wdGltaXphdGlvblBvbGljeVxyXG4gKiBAc2luY2UgMS4xMC4wXHJcbiAqL1xyXG5jb25zdCBPcHRpbWl6YXRpb25Qb2xpY3kgPSBFbnVtKHtcclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u5Yib5bu65qyh5pWw6Ieq5Yqo6LCD5pW05LyY5YyW562W55Wl44CC5Yid5qyh5Yib5bu65a6e5L6L5pe277yM6KGM5Li6562J5ZCMIFNJTkdMRV9JTlNUQU5DRe+8jOWkmuasoeWIm+W7uuWQjuWwhuiHquWKqOmHh+eUqCBNVUxUSV9JTlNUQU5DReOAglxyXG4gICAgICovXHJcbiAgICBBVVRPOiAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiDkvJjljJbljZXmrKHliJvlu7rmgKfog73jgII8YnI+XHJcbiAgICAgKiDor6XpgInpobnkvJrot7Pov4fpkojlr7nov5nkuKogcHJlZmFiIOeahOS7o+eggeeUn+aIkOS8mOWMluaTjeS9nOOAguW9k+ivpSBwcmVmYWIg5Yqg6L295ZCO77yM5LiA6Iis5Y+q5Lya5Yib5bu65LiA5Liq5a6e5L6L5pe277yM6K+36YCJ5oup5q2k6aG544CCXHJcbiAgICAgKi9cclxuICAgIFNJTkdMRV9JTlNUQU5DRTogMSxcclxuICAgIC8qKlxyXG4gICAgICog5LyY5YyW5aSa5qyh5Yib5bu65oCn6IO944CCPGJyPlxyXG4gICAgICog6K+l6YCJ6aG55Lya5ZCv55So6ZKI5a+56L+Z5LiqIHByZWZhYiDnmoTku6PnoIHnlJ/miJDkvJjljJbmk43kvZzjgILlvZPor6UgcHJlZmFiIOWKoOi9veWQju+8jOS4gOiIrOS8muWIm+W7uuWkmuS4quWunuS+i+aXtu+8jOivt+mAieaLqeatpOmhueOAguWmguaenOivpSBwcmVmYWIg5Zyo5Zy65pmv5Lit55qE6IqC54K55ZCv55So5LqG6Ieq5Yqo5YWz6IGU77yM5bm25LiU5Zyo5Zy65pmv5Lit5pyJ5aSa5Lu95a6e5L6L77yM5Lmf5bu66K6u6YCJ5oup5q2k6aG544CCXHJcbiAgICAgKi9cclxuICAgIE1VTFRJX0lOU1RBTkNFOiAyLFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gQ2xhc3MgZm9yIHByZWZhYiBoYW5kbGluZy5cclxuICogQHpoIOmihOWItui1hOa6kOexu+OAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlByZWZhYicpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZWZhYiBleHRlbmRzIEFzc2V0IHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIE9wdGltaXphdGlvblBvbGljeSA9IE9wdGltaXphdGlvblBvbGljeTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIE9wdGltaXphdGlvblBvbGljeVRocmVzaG9sZCA9IDM7XHJcbiAgICBcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIGRhdGE6IGFueSA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruWunuS+i+WMlui/meS4qiBwcmVmYWIg5pe25omA55So55qE5LyY5YyW562W55Wl44CC5qC55o2u5L2/55So5oOF5Ya16K6+572u5Li65ZCI6YCC55qE5YC877yM6IO95LyY5YyW6K+lIHByZWZhYiDlrp7kvovljJbmiYDnlKjnmoTml7bpl7TjgIJcclxuICAgICAqIEBlblxyXG4gICAgICogSW5kaWNhdGVzIHRoZSBvcHRpbWl6YXRpb24gcG9saWN5IGZvciBpbnN0YW50aWF0aW5nIHRoaXMgcHJlZmFiLlxyXG4gICAgICogU2V0IHRvIGEgc3VpdGFibGUgdmFsdWUgYmFzZWQgb24gdXNhZ2UsIGNhbiBvcHRpbWl6ZSB0aGUgdGltZSBpdCB0YWtlcyB0byBpbnN0YW50aWF0ZSB0aGlzIHByZWZhYi5cclxuICAgICAqXHJcbiAgICAgKiBAZGVmYXVsdCBQcmVmYWIuT3B0aW1pemF0aW9uUG9saWN5LkFVVE9cclxuICAgICAqIEBzaW5jZSAxLjEwLjBcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgUHJlZmFiIH0gZnJvbSAnY2MnO1xyXG4gICAgICogcHJlZmFiLm9wdGltaXphdGlvblBvbGljeSA9IFByZWZhYi5PcHRpbWl6YXRpb25Qb2xpY3kuTVVMVElfSU5TVEFOQ0U7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgb3B0aW1pemF0aW9uUG9saWN5ID0gT3B0aW1pemF0aW9uUG9saWN5LkFVVE87XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5kaWNhdGVzIHRoZSByYXcgYXNzZXRzIG9mIHRoaXMgcHJlZmFiIGNhbiBiZSBsb2FkIGFmdGVyIHByZWZhYiBsb2FkZWQuXHJcbiAgICAgKiBAemgg5oyH56S66K+lIFByZWZhYiDkvp3otZbnmoTotYTmupDlj6/lkKblnKggUHJlZmFiIOWKoOi9veWQjuWGjeW7tui/n+WKoOi9veOAglxyXG4gICAgICogQGRlZmF1bHQgZmFsc2VcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgYXN5bmNMb2FkQXNzZXRzOiBCb29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlRnVuY3Rpb246IEZ1bmN0aW9uIHwgbnVsbDtcclxuICAgIHByaXZhdGUgX2luc3RhbnRpYXRlZFRpbWVzOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWNoZSBmdW5jdGlvbiB0byBvcHRpbWl6ZSBpbnN0YW5jZSBjcmVhdG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2NyZWF0ZUZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5faW5zdGFudGlhdGVkVGltZXMgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVOb2RlIChjYjogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBub2RlID0gbGVnYWN5Q0MuaW5zdGFudGlhdGUodGhpcyk7XHJcbiAgICAgICAgbm9kZS5uYW1lID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGNiKG51bGwsIG5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBEeW5hbWljYWxseSB0cmFuc2xhdGlvbiBwcmVmYWIgZGF0YSBpbnRvIG1pbmltaXplZCBjb2RlLjxici8+XHJcbiAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBhdXRvbWF0aWNhbGx5IGJlZm9yZSB0aGUgZmlyc3QgdGltZSB0aGUgcHJlZmFiIGJlaW5nIGluc3RhbnRpYXRlZCw8YnIvPlxyXG4gICAgICogYnV0IHlvdSBjYW4gcmUtY2FsbCB0byByZWZyZXNoIHRoZSBjcmVhdGUgZnVuY3Rpb24gb25jZSB5b3UgbW9kaWZpZWQgdGhlIG9yaWdpbmFsIHByZWZhYiBkYXRhIGluIHNjcmlwdC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5bCG6aKE5Yi25pWw5o2u5Yqo5oCB6L2s5o2i5Li65pyA5bCP5YyW5Luj56CB44CCPGJyLz5cclxuwqDCoMKgwqDCoCog5q2k5pa55rOV5bCG5Zyo56ys5LiA5qyh5a6e5L6L5YyW6aKE5Yi25Lu25LmL5YmN6Ieq5Yqo6LCD55So77yMPGJyLz5cclxuwqDCoMKgwqDCoCog5L2G5piv5oKo5Y+v5Lul5Zyo6ISa5pys5Lit5L+u5pS55Y6f5aeL6aKE5Yi25pWw5o2u5ZCO6YeN5paw6LCD55So5Lul5Yi35paw5Yib5bu65Yqf6IO944CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb21waWxlQ3JlYXRlRnVuY3Rpb24gKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NyZWF0ZUZ1bmN0aW9uID0gY29tcGlsZSh0aGlzLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGp1c3QgaW5zdGFudGlhdGUsIHdpbGwgbm90IGluaXRpYWxpemUgdGhlIE5vZGUsIHRoaXMgd2lsbCBiZSBjYWxsZWQgZHVyaW5nIE5vZGUncyBpbml0aWFsaXphdGlvbi5cclxuICAgIC8vIEBwYXJhbSB7Tm9kZX0gW3Jvb3RUb1JlZGlyZWN0XSAtIHNwZWNpZnkgYW4gaW5zdGFudGlhdGVkIHByZWZhYlJvb3QgdGhhdCBhbGwgcmVmZXJlbmNlcyB0byBwcmVmYWJSb290IGluIHByZWZhYlxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lsbCByZWRpcmVjdCB0b1xyXG4gICAgcHJpdmF0ZSBfZG9JbnN0YW50aWF0ZSAocm9vdFRvUmVkaXJlY3Q/OiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLl9wcmVmYWIpIHtcclxuICAgICAgICAgICAgLy8gcHJlZmFiIGFzc2V0IGlzIGFsd2F5cyBzeW5jZWRcclxuICAgICAgICAgICAgdGhpcy5kYXRhLl9wcmVmYWIuX3N5bmNlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0ZW1wIGd1YXJkIGNvZGVcclxuICAgICAgICAgICAgd2FybklEKDM3MDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX2NyZWF0ZUZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcGlsZUNyZWF0ZUZ1bmN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGdW5jdGlvbiEocm9vdFRvUmVkaXJlY3QpOyAgLy8gdGhpcy5kYXRhLl9pbnN0YW50aWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2luc3RhbnRpYXRlICgpIHtcclxuICAgICAgICBsZXQgbm9kZTtcclxuICAgICAgICBsZXQgdXNlSml0OiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKFNVUFBPUlRfSklUKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGltaXphdGlvblBvbGljeSA9PT0gT3B0aW1pemF0aW9uUG9saWN5LlNJTkdMRV9JTlNUQU5DRSkge1xyXG4gICAgICAgICAgICAgICAgdXNlSml0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5vcHRpbWl6YXRpb25Qb2xpY3kgPT09IE9wdGltaXphdGlvblBvbGljeS5NVUxUSV9JTlNUQU5DRSkge1xyXG4gICAgICAgICAgICAgICAgdXNlSml0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGF1dG9cclxuICAgICAgICAgICAgICAgIHVzZUppdCA9ICh0aGlzLl9pbnN0YW50aWF0ZWRUaW1lcyArIDEpID49IFByZWZhYi5PcHRpbWl6YXRpb25Qb2xpY3lUaHJlc2hvbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVzZUppdCkge1xyXG4gICAgICAgICAgICAvLyBpbnN0YW50aWF0ZSBub2RlXHJcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLl9kb0luc3RhbnRpYXRlKCk7XHJcbiAgICAgICAgICAgIC8vIGluaXRpYWxpemUgbm9kZVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEuX2luc3RhbnRpYXRlKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcHJlZmFiIGFzc2V0IGlzIGFsd2F5cyBzeW5jZWRcclxuICAgICAgICAgICAgdGhpcy5kYXRhLl9wcmVmYWIuX3N5bmNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vIGluc3RhbnRpYXRlIG5vZGVcclxuICAgICAgICAgICAgbm9kZSA9IHRoaXMuZGF0YS5faW5zdGFudGlhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKyt0aGlzLl9pbnN0YW50aWF0ZWRUaW1lcztcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLlByZWZhYiA9IFByZWZhYjtcclxuaWYgKEFMSVBBWSB8fCBSVU5USU1FX0JBU0VEKSB7XHJcbiAgICBsZWdhY3lDQy5fUHJlZmFiID0gUHJlZmFiO1xyXG59IGVsc2Uge1xyXG4gICAgb2Jzb2xldGUobGVnYWN5Q0MsICdjYy5fUHJlZmFiJywgJ1ByZWZhYicpO1xyXG59XHJcbiJdfQ==