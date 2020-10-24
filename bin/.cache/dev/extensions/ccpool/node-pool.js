(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../cocos/core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../cocos/core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.nodePool = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.NodePool = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en
   *  `NodePool` is the cache pool designed for node type.<br/>
   *  It can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
   *
   * It's recommended to create `NodePool` instances by node type, the type corresponds to node type in game design, not the class,
   * for example, a prefab is a specific node type. <br/>
   * When you create a node pool, you can pass a Component which contains `unuse`, `reuse` functions to control the content of node.<br/>
   *
   * Some common use case is :<br/>
   *      1. Bullets in game (die very soon, massive creation and recreation, no side effect on other objects)<br/>
   *      2. Blocks in candy crash (massive creation and recreation)<br/>
   *      etc...
   * @zh
   * `NodePool` 是用于管理节点对象的对象缓存池。<br/>
   * 它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁<br/>
   * 以前 cocos2d-x 中的 pool 和新的节点事件注册系统不兼容，因此请使用 `NodePool` 来代替。
   *
   * 新的 NodePool 需要实例化之后才能使用，每种不同的节点对象池需要一个不同的对象池实例，这里的种类对应于游戏中的节点设计，一个 prefab 相当于一个种类的节点。<br/>
   * 在创建缓冲池时，可以传入一个包含 unuse, reuse 函数的组件类型用于节点的回收和复用逻辑。<br/>
   *
   * 一些常见的用例是：<br/>
   *      1.在游戏中的子弹（死亡很快，频繁创建，对其他对象无副作用）<br/>
   *      2.糖果粉碎传奇中的木块（频繁创建）。
   *      等等....
   */
  var NodePool = /*#__PURE__*/function () {
    /**
     * @en The pool handler component, it could be the class name or the constructor.
     * @zh 缓冲池处理组件，用于节点的回收和复用逻辑，这个属性可以是组件类名或组件的构造函数。
     */

    /**
     * @en
     * Constructor for creating a pool for a specific node template (usually a prefab).
     * You can pass a component (type or name) argument for handling event for reusing and recycling node.
     * @zh
     * 使用构造函数来创建一个节点专用的对象池，您可以传递一个组件类型或名称，用于处理节点回收和复用时的事件逻辑。
     * @param poolHandlerComp @en The constructor or the class name of the component to control the unuse/reuse logic. @zh 处理节点回收和复用事件逻辑的组件类型或名称。
     * @example
     * import { NodePool, Prefab } from 'cc';
     *  properties: {
     *      template: Prefab
     *     },
     *     onLoad () {
     *       // MyTemplateHandler is a component with 'unuse' and 'reuse' to handle events when node is reused or recycled.
     *       this.myPool = new NodePool('MyTemplateHandler');
     *     }
     *  }
     */
    function NodePool(poolHandlerComp) {
      _classCallCheck(this, NodePool);

      this.poolHandlerComp = void 0;
      this._pool = void 0;
      this.poolHandlerComp = poolHandlerComp;
      this._pool = [];
    }
    /**
     * @en The current available size in the pool
     * @zh 获取当前缓冲池的可用对象数量
     */


    _createClass(NodePool, [{
      key: "size",
      value: function size() {
        return this._pool.length;
      }
      /**
       * @en Destroy all cached nodes in the pool
       * @zh 销毁对象池中缓存的所有节点
       */

    }, {
      key: "clear",
      value: function clear() {
        var count = this._pool.length;

        for (var i = 0; i < count; ++i) {
          this._pool[i].destroy();
        }

        this._pool.length = 0;
      }
      /**
       * @en Put a new Node into the pool.
       * It will automatically remove the node from its parent without cleanup.
       * It will also invoke unuse method of the poolHandlerComp if exist.
       * @zh 向缓冲池中存入一个不再需要的节点对象。
       * 这个函数会自动将目标节点从父节点上移除，但是不会进行 cleanup 操作。
       * 这个函数会调用 poolHandlerComp 的 unuse 函数，如果组件和函数都存在的话。
       * @example
       * import { instantiate } from 'cc';
       * const myNode = instantiate(this.template);
       * this.myPool.put(myNode);
       */

    }, {
      key: "put",
      value: function put(obj) {
        if (obj && this._pool.indexOf(obj) === -1) {
          // Remove from parent, but don't cleanup
          obj.removeFromParent(); // Invoke pool handler
          // @ts-ignore

          var handler = this.poolHandlerComp ? obj.getComponent(this.poolHandlerComp) : null;

          if (handler && handler.unuse) {
            handler.unuse();
          }

          this._pool.push(obj);
        }
      }
      /**
       * @en Get a obj from pool, if no available object in pool, null will be returned.
       * This function will invoke the reuse function of poolHandlerComp if exist.
       * @zh 获取对象池中的对象，如果对象池没有可用对象，则返回空。
       * 这个函数会调用 poolHandlerComp 的 reuse 函数，如果组件和函数都存在的话。
       * @param args - 向 poolHandlerComp 中的 'reuse' 函数传递的参数
       * @example
       *   let newNode = this.myPool.get();
       */

    }, {
      key: "get",
      value: function get() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var last = this._pool.length - 1;

        if (last < 0) {
          return null;
        } else {
          // Pop the last object in pool
          var obj = this._pool[last];
          this._pool.length = last; // Invoke pool handler
          // @ts-ignore

          var handler = this.poolHandlerComp ? obj.getComponent(this.poolHandlerComp) : null;

          if (handler && handler.reuse) {
            handler.reuse(arguments);
          }

          return obj;
        }
      }
    }]);

    return NodePool;
  }();

  _exports.NodePool = NodePool;
  _globalExports.legacyCC.NodePool = NodePool;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2V4dGVuc2lvbnMvY2Nwb29sL25vZGUtcG9vbC50cyJdLCJuYW1lcyI6WyJOb2RlUG9vbCIsInBvb2xIYW5kbGVyQ29tcCIsIl9wb29sIiwibGVuZ3RoIiwiY291bnQiLCJpIiwiZGVzdHJveSIsIm9iaiIsImluZGV4T2YiLCJyZW1vdmVGcm9tUGFyZW50IiwiaGFuZGxlciIsImdldENvbXBvbmVudCIsInVudXNlIiwicHVzaCIsImFyZ3MiLCJsYXN0IiwicmV1c2UiLCJhcmd1bWVudHMiLCJsZWdhY3lDQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Q0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BMEJhQSxRO0FBRVQ7Ozs7O0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxzQkFBYUMsZUFBYixFQUE0RTtBQUFBOztBQUFBLFdBckJyRUEsZUFxQnFFO0FBQUEsV0FwQnBFQyxLQW9Cb0U7QUFDeEUsV0FBS0QsZUFBTCxHQUF1QkEsZUFBdkI7QUFDQSxXQUFLQyxLQUFMLEdBQWEsRUFBYjtBQUNIO0FBRUQ7Ozs7Ozs7OzZCQUllO0FBQ1gsZUFBTyxLQUFLQSxLQUFMLENBQVdDLE1BQWxCO0FBQ0g7QUFFRDs7Ozs7Ozs4QkFJZ0I7QUFDWixZQUFNQyxLQUFLLEdBQUcsS0FBS0YsS0FBTCxDQUFXQyxNQUF6Qjs7QUFDQSxhQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELEtBQXBCLEVBQTJCLEVBQUVDLENBQTdCLEVBQWdDO0FBQzVCLGVBQUtILEtBQUwsQ0FBV0csQ0FBWCxFQUFjQyxPQUFkO0FBQ0g7O0FBQ0QsYUFBS0osS0FBTCxDQUFXQyxNQUFYLEdBQW9CLENBQXBCO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OzBCQVlZSSxHLEVBQVc7QUFDbkIsWUFBSUEsR0FBRyxJQUFJLEtBQUtMLEtBQUwsQ0FBV00sT0FBWCxDQUFtQkQsR0FBbkIsTUFBNEIsQ0FBQyxDQUF4QyxFQUEyQztBQUN2QztBQUNBQSxVQUFBQSxHQUFHLENBQUNFLGdCQUFKLEdBRnVDLENBSXZDO0FBQ0E7O0FBQ0EsY0FBTUMsT0FBTyxHQUFHLEtBQUtULGVBQUwsR0FBdUJNLEdBQUcsQ0FBQ0ksWUFBSixDQUFpQixLQUFLVixlQUF0QixDQUF2QixHQUFnRSxJQUFoRjs7QUFDQSxjQUFJUyxPQUFPLElBQUlBLE9BQU8sQ0FBQ0UsS0FBdkIsRUFBOEI7QUFDMUJGLFlBQUFBLE9BQU8sQ0FBQ0UsS0FBUjtBQUNIOztBQUVELGVBQUtWLEtBQUwsQ0FBV1csSUFBWCxDQUFnQk4sR0FBaEI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7Ozs0QkFTeUM7QUFBQSwwQ0FBMUJPLElBQTBCO0FBQTFCQSxVQUFBQSxJQUEwQjtBQUFBOztBQUNyQyxZQUFNQyxJQUFJLEdBQUcsS0FBS2IsS0FBTCxDQUFXQyxNQUFYLEdBQW9CLENBQWpDOztBQUNBLFlBQUlZLElBQUksR0FBRyxDQUFYLEVBQWM7QUFDVixpQkFBTyxJQUFQO0FBQ0gsU0FGRCxNQUdLO0FBQ0Q7QUFDQSxjQUFNUixHQUFHLEdBQUcsS0FBS0wsS0FBTCxDQUFXYSxJQUFYLENBQVo7QUFDQSxlQUFLYixLQUFMLENBQVdDLE1BQVgsR0FBb0JZLElBQXBCLENBSEMsQ0FLRDtBQUNBOztBQUNBLGNBQU1MLE9BQU8sR0FBRyxLQUFLVCxlQUFMLEdBQXVCTSxHQUFHLENBQUNJLFlBQUosQ0FBaUIsS0FBS1YsZUFBdEIsQ0FBdkIsR0FBZ0UsSUFBaEY7O0FBQ0EsY0FBSVMsT0FBTyxJQUFJQSxPQUFPLENBQUNNLEtBQXZCLEVBQThCO0FBQzFCTixZQUFBQSxPQUFPLENBQUNNLEtBQVIsQ0FBY0MsU0FBZDtBQUNIOztBQUNELGlCQUFPVixHQUFQO0FBQ0g7QUFDSjs7Ozs7OztBQUdMVywwQkFBU2xCLFFBQVQsR0FBb0JBLFFBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb2Nvcy9jb3JlL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvY29zL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbnR5cGUgQ29uc3RydWN0b3I8VCA9IHt9PiA9IG5ldyguLi5hcmdzOiBhbnlbXSkgPT4gVDtcclxuXHJcbmludGVyZmFjZSBJUG9vbEhhbmRsZXJDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgdW51c2UgKCk6IHZvaWQ7XHJcblxyXG4gICAgcmV1c2UgKGFyZ3M6IGFueSk6IHZvaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogIGBOb2RlUG9vbGAgaXMgdGhlIGNhY2hlIHBvb2wgZGVzaWduZWQgZm9yIG5vZGUgdHlwZS48YnIvPlxyXG4gKiAgSXQgY2FuIGhlbHBzIHlvdSB0byBpbXByb3ZlIHlvdXIgZ2FtZSBwZXJmb3JtYW5jZSBmb3Igb2JqZWN0cyB3aGljaCBuZWVkIGZyZXF1ZW50IHJlbGVhc2UgYW5kIHJlY3JlYXRlIG9wZXJhdGlvbnM8YnIvPlxyXG4gKlxyXG4gKiBJdCdzIHJlY29tbWVuZGVkIHRvIGNyZWF0ZSBgTm9kZVBvb2xgIGluc3RhbmNlcyBieSBub2RlIHR5cGUsIHRoZSB0eXBlIGNvcnJlc3BvbmRzIHRvIG5vZGUgdHlwZSBpbiBnYW1lIGRlc2lnbiwgbm90IHRoZSBjbGFzcyxcclxuICogZm9yIGV4YW1wbGUsIGEgcHJlZmFiIGlzIGEgc3BlY2lmaWMgbm9kZSB0eXBlLiA8YnIvPlxyXG4gKiBXaGVuIHlvdSBjcmVhdGUgYSBub2RlIHBvb2wsIHlvdSBjYW4gcGFzcyBhIENvbXBvbmVudCB3aGljaCBjb250YWlucyBgdW51c2VgLCBgcmV1c2VgIGZ1bmN0aW9ucyB0byBjb250cm9sIHRoZSBjb250ZW50IG9mIG5vZGUuPGJyLz5cclxuICpcclxuICogU29tZSBjb21tb24gdXNlIGNhc2UgaXMgOjxici8+XHJcbiAqICAgICAgMS4gQnVsbGV0cyBpbiBnYW1lIChkaWUgdmVyeSBzb29uLCBtYXNzaXZlIGNyZWF0aW9uIGFuZCByZWNyZWF0aW9uLCBubyBzaWRlIGVmZmVjdCBvbiBvdGhlciBvYmplY3RzKTxici8+XHJcbiAqICAgICAgMi4gQmxvY2tzIGluIGNhbmR5IGNyYXNoIChtYXNzaXZlIGNyZWF0aW9uIGFuZCByZWNyZWF0aW9uKTxici8+XHJcbiAqICAgICAgZXRjLi4uXHJcbiAqIEB6aFxyXG4gKiBgTm9kZVBvb2xgIOaYr+eUqOS6jueuoeeQhuiKgueCueWvueixoeeahOWvueixoee8k+WtmOaxoOOAgjxici8+XHJcbiAqIOWug+WPr+S7peW4ruWKqeaCqOaPkOmrmOa4uOaIj+aAp+iDve+8jOmAgueUqOS6juS8mOWMluWvueixoeeahOWPjeWkjeWIm+W7uuWSjOmUgOavgTxici8+XHJcbiAqIOS7peWJjSBjb2NvczJkLXgg5Lit55qEIHBvb2wg5ZKM5paw55qE6IqC54K55LqL5Lu25rOo5YaM57O757uf5LiN5YW85a6577yM5Zug5q2k6K+35L2/55SoIGBOb2RlUG9vbGAg5p2l5Luj5pu/44CCXHJcbiAqXHJcbiAqIOaWsOeahCBOb2RlUG9vbCDpnIDopoHlrp7kvovljJbkuYvlkI7miY3og73kvb/nlKjvvIzmr4/np43kuI3lkIznmoToioLngrnlr7nosaHmsaDpnIDopoHkuIDkuKrkuI3lkIznmoTlr7nosaHmsaDlrp7kvovvvIzov5nph4znmoTnp43nsbvlr7nlupTkuo7muLjmiI/kuK3nmoToioLngrnorr7orqHvvIzkuIDkuKogcHJlZmFiIOebuOW9k+S6juS4gOS4quenjeexu+eahOiKgueCueOAgjxici8+XHJcbiAqIOWcqOWIm+W7uue8k+WGsuaxoOaXtu+8jOWPr+S7peS8oOWFpeS4gOS4quWMheWQqyB1bnVzZSwgcmV1c2Ug5Ye95pWw55qE57uE5Lu257G75Z6L55So5LqO6IqC54K555qE5Zue5pS25ZKM5aSN55So6YC76L6R44CCPGJyLz5cclxuICpcclxuICog5LiA5Lqb5bi46KeB55qE55So5L6L5piv77yaPGJyLz5cclxuICogICAgICAxLuWcqOa4uOaIj+S4reeahOWtkOW8ue+8iOatu+S6oeW+iOW/q++8jOmikee5geWIm+W7uu+8jOWvueWFtuS7luWvueixoeaXoOWJr+S9nOeUqO+8iTxici8+XHJcbiAqICAgICAgMi7ns5bmnpznsonnoo7kvKDlpYfkuK3nmoTmnKjlnZfvvIjpopHnuYHliJvlu7rvvInjgIJcclxuICogICAgICDnrYnnrYkuLi4uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTm9kZVBvb2wge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBwb29sIGhhbmRsZXIgY29tcG9uZW50LCBpdCBjb3VsZCBiZSB0aGUgY2xhc3MgbmFtZSBvciB0aGUgY29uc3RydWN0b3IuXHJcbiAgICAgKiBAemgg57yT5Yay5rGg5aSE55CG57uE5Lu277yM55So5LqO6IqC54K555qE5Zue5pS25ZKM5aSN55So6YC76L6R77yM6L+Z5Liq5bGe5oCn5Y+v5Lul5piv57uE5Lu257G75ZCN5oiW57uE5Lu255qE5p6E6YCg5Ye95pWw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb29sSGFuZGxlckNvbXA/OiBDb25zdHJ1Y3RvcjxJUG9vbEhhbmRsZXJDb21wb25lbnQ+IHwgc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfcG9vbDogTm9kZVtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb25zdHJ1Y3RvciBmb3IgY3JlYXRpbmcgYSBwb29sIGZvciBhIHNwZWNpZmljIG5vZGUgdGVtcGxhdGUgKHVzdWFsbHkgYSBwcmVmYWIpLlxyXG4gICAgICogWW91IGNhbiBwYXNzIGEgY29tcG9uZW50ICh0eXBlIG9yIG5hbWUpIGFyZ3VtZW50IGZvciBoYW5kbGluZyBldmVudCBmb3IgcmV1c2luZyBhbmQgcmVjeWNsaW5nIG5vZGUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS9v+eUqOaehOmAoOWHveaVsOadpeWIm+W7uuS4gOS4quiKgueCueS4k+eUqOeahOWvueixoeaxoO+8jOaCqOWPr+S7peS8oOmAkuS4gOS4que7hOS7tuexu+Wei+aIluWQjeensO+8jOeUqOS6juWkhOeQhuiKgueCueWbnuaUtuWSjOWkjeeUqOaXtueahOS6i+S7tumAu+i+keOAglxyXG4gICAgICogQHBhcmFtIHBvb2xIYW5kbGVyQ29tcCBAZW4gVGhlIGNvbnN0cnVjdG9yIG9yIHRoZSBjbGFzcyBuYW1lIG9mIHRoZSBjb21wb25lbnQgdG8gY29udHJvbCB0aGUgdW51c2UvcmV1c2UgbG9naWMuIEB6aCDlpITnkIboioLngrnlm57mlLblkozlpI3nlKjkuovku7bpgLvovpHnmoTnu4Tku7bnsbvlnovmiJblkI3np7DjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBpbXBvcnQgeyBOb2RlUG9vbCwgUHJlZmFiIH0gZnJvbSAnY2MnO1xyXG4gICAgICogIHByb3BlcnRpZXM6IHtcclxuICAgICAqICAgICAgdGVtcGxhdGU6IFByZWZhYlxyXG4gICAgICogICAgIH0sXHJcbiAgICAgKiAgICAgb25Mb2FkICgpIHtcclxuICAgICAqICAgICAgIC8vIE15VGVtcGxhdGVIYW5kbGVyIGlzIGEgY29tcG9uZW50IHdpdGggJ3VudXNlJyBhbmQgJ3JldXNlJyB0byBoYW5kbGUgZXZlbnRzIHdoZW4gbm9kZSBpcyByZXVzZWQgb3IgcmVjeWNsZWQuXHJcbiAgICAgKiAgICAgICB0aGlzLm15UG9vbCA9IG5ldyBOb2RlUG9vbCgnTXlUZW1wbGF0ZUhhbmRsZXInKTtcclxuICAgICAqICAgICB9XHJcbiAgICAgKiAgfVxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAocG9vbEhhbmRsZXJDb21wPzogQ29uc3RydWN0b3I8SVBvb2xIYW5kbGVyQ29tcG9uZW50PiB8IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucG9vbEhhbmRsZXJDb21wID0gcG9vbEhhbmRsZXJDb21wO1xyXG4gICAgICAgIHRoaXMuX3Bvb2wgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgY3VycmVudCBhdmFpbGFibGUgc2l6ZSBpbiB0aGUgcG9vbFxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjee8k+WGsuaxoOeahOWPr+eUqOWvueixoeaVsOmHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvb2wubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERlc3Ryb3kgYWxsIGNhY2hlZCBub2RlcyBpbiB0aGUgcG9vbFxyXG4gICAgICogQHpoIOmUgOavgeWvueixoeaxoOS4ree8k+WtmOeahOaJgOacieiKgueCuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5fcG9vbC5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2xbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wb29sLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHV0IGEgbmV3IE5vZGUgaW50byB0aGUgcG9vbC5cclxuICAgICAqIEl0IHdpbGwgYXV0b21hdGljYWxseSByZW1vdmUgdGhlIG5vZGUgZnJvbSBpdHMgcGFyZW50IHdpdGhvdXQgY2xlYW51cC5cclxuICAgICAqIEl0IHdpbGwgYWxzbyBpbnZva2UgdW51c2UgbWV0aG9kIG9mIHRoZSBwb29sSGFuZGxlckNvbXAgaWYgZXhpc3QuXHJcbiAgICAgKiBAemgg5ZCR57yT5Yay5rGg5Lit5a2Y5YWl5LiA5Liq5LiN5YaN6ZyA6KaB55qE6IqC54K55a+56LGh44CCXHJcbiAgICAgKiDov5nkuKrlh73mlbDkvJroh6rliqjlsIbnm67moIfoioLngrnku47niLboioLngrnkuIrnp7vpmaTvvIzkvYbmmK/kuI3kvJrov5vooYwgY2xlYW51cCDmk43kvZzjgIJcclxuICAgICAqIOi/meS4quWHveaVsOS8muiwg+eUqCBwb29sSGFuZGxlckNvbXAg55qEIHVudXNlIOWHveaVsO+8jOWmguaenOe7hOS7tuWSjOWHveaVsOmDveWtmOWcqOeahOivneOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGltcG9ydCB7IGluc3RhbnRpYXRlIH0gZnJvbSAnY2MnO1xyXG4gICAgICogY29uc3QgbXlOb2RlID0gaW5zdGFudGlhdGUodGhpcy50ZW1wbGF0ZSk7XHJcbiAgICAgKiB0aGlzLm15UG9vbC5wdXQobXlOb2RlKTtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHB1dCAob2JqOiBOb2RlKSB7XHJcbiAgICAgICAgaWYgKG9iaiAmJiB0aGlzLl9wb29sLmluZGV4T2Yob2JqKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGZyb20gcGFyZW50LCBidXQgZG9uJ3QgY2xlYW51cFxyXG4gICAgICAgICAgICBvYmoucmVtb3ZlRnJvbVBhcmVudCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gSW52b2tlIHBvb2wgaGFuZGxlclxyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSB0aGlzLnBvb2xIYW5kbGVyQ29tcCA/IG9iai5nZXRDb21wb25lbnQodGhpcy5wb29sSGFuZGxlckNvbXApIDogbnVsbDtcclxuICAgICAgICAgICAgaWYgKGhhbmRsZXIgJiYgaGFuZGxlci51bnVzZSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlci51bnVzZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9wb29sLnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGEgb2JqIGZyb20gcG9vbCwgaWYgbm8gYXZhaWxhYmxlIG9iamVjdCBpbiBwb29sLCBudWxsIHdpbGwgYmUgcmV0dXJuZWQuXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgaW52b2tlIHRoZSByZXVzZSBmdW5jdGlvbiBvZiBwb29sSGFuZGxlckNvbXAgaWYgZXhpc3QuXHJcbiAgICAgKiBAemgg6I635Y+W5a+56LGh5rGg5Lit55qE5a+56LGh77yM5aaC5p6c5a+56LGh5rGg5rKh5pyJ5Y+v55So5a+56LGh77yM5YiZ6L+U5Zue56m644CCXHJcbiAgICAgKiDov5nkuKrlh73mlbDkvJrosIPnlKggcG9vbEhhbmRsZXJDb21wIOeahCByZXVzZSDlh73mlbDvvIzlpoLmnpznu4Tku7blkozlh73mlbDpg73lrZjlnKjnmoTor53jgIJcclxuICAgICAqIEBwYXJhbSBhcmdzIC0g5ZCRIHBvb2xIYW5kbGVyQ29tcCDkuK3nmoQgJ3JldXNlJyDlh73mlbDkvKDpgJLnmoTlj4LmlbBcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAgIGxldCBuZXdOb2RlID0gdGhpcy5teVBvb2wuZ2V0KCk7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgKC4uLmFyZ3M6IGFueVtdKTogTm9kZSB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLl9wb29sLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgaWYgKGxhc3QgPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gUG9wIHRoZSBsYXN0IG9iamVjdCBpbiBwb29sXHJcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IHRoaXMuX3Bvb2xbbGFzdF07XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2wubGVuZ3RoID0gbGFzdDtcclxuXHJcbiAgICAgICAgICAgIC8vIEludm9rZSBwb29sIGhhbmRsZXJcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5wb29sSGFuZGxlckNvbXAgPyBvYmouZ2V0Q29tcG9uZW50KHRoaXMucG9vbEhhbmRsZXJDb21wKSA6IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChoYW5kbGVyICYmIGhhbmRsZXIucmV1c2UpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXIucmV1c2UoYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuTm9kZVBvb2wgPSBOb2RlUG9vbDtcclxuIl19