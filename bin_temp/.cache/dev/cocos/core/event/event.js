(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.event = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * 事件相关
   * @category event
   */

  /**
   * @en
   * Base class of all kinds of events.
   *
   * @zh
   * 所有事件对象的基类，包含事件相关基本信息。
   */
  var Event = /*#__PURE__*/function () {
    // Event types

    /**
     * @en
     * Code for event without type.
     *
     * @zh
     * 没有类型的事件。
     */

    /**
     * @en
     * The type code of Touch event.
     *
     * @zh
     * 触摸事件类型。
     */

    /**
     * @en
     * The type code of Mouse event.
     *
     * @zh
     * 鼠标事件类型。
     */

    /**
     * @en
     * The type code of Keyboard event.
     *
     * @zh
     * 键盘事件类型。
     */

    /**
     * @en
     * The type code of Acceleration event.
     *
     * @zh
     * 加速器事件类型。
     */
    // Event phases

    /**
     * @en
     * Events not currently dispatched are in this phase.
     *
     * @zh
     * 尚未派发事件阶段。
     */

    /**
     * @en
     * The capturing phase comprises the journey from the root to the last node before the event target's node
     * [markdown](http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
     *
     * @zh
     * 捕获阶段，包括事件目标节点之前从根节点到最后一个节点的过程。
     */

    /**
     * @en
     * The target phase comprises only the event target node
     * [markdown] (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
     *
     * @zh
     * 目标阶段仅包括事件目标节点。
     */

    /**
     * @en
     * The bubbling phase comprises any subsequent nodes encountered on the return trip to the root of the hierarchy
     * [markdown] (http://www.w3.org/TR/DOM-Level-3-Events/#event-flow)
     *
     * @zh
     * 冒泡阶段， 包括回程遇到到层次根节点的任何后续节点。
     */

    /**
     * @en
     * The name of the event (case-sensitive), e.g. "click", "fire", or "submit".
     *
     * @zh
     * 事件类型。
     */

    /**
     * @en
     * Indicate whether the event bubbles up through the hierarchy or not.
     *
     * @zh
     * 表示该事件是否进行冒泡。
     */

    /**
     * @en
     * A reference to the target to which the event was originally dispatched.
     *
     * @zh
     * 最初事件触发的目标。
     */

    /**
     * @en
     * A reference to the currently registered target for the event.
     *
     * @zh
     * 当前目标。
     */

    /**
     * @en
     * Indicates which phase of the event flow is currently being evaluated.
     * Returns an integer value represented by 4 constants:
     *  - Event.NONE = 0
     *  - Event.CAPTURING_PHASE = 1
     *  - Event.AT_TARGET = 2
     *  - Event.BUBBLING_PHASE = 3
     * The phases are explained in the [section 3.1, Event dispatch and DOM event flow]
     * [markdown](http://www.w3.org/TR/DOM-Level-3-Events/#event-flow), of the DOM Level 3 Events specification.
     *
     * @zh
     * 事件阶段。
     */

    /**
     * @en
     * Stops propagation for current event.
     *
     * @zh
     * 停止传递当前事件。
     */

    /**
     * @en
     * Stops propagation for current event immediately,
     * the event won't even be dispatched to the listeners attached in the current target.
     *
     * @zh
     * 立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标。
     */

    /**
     * @param type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
     * @param bubbles - A boolean indicating whether the event bubbles up through the tree or not
     */
    function Event(type, bubbles) {
      _classCallCheck(this, Event);

      this.type = void 0;
      this.bubbles = void 0;
      this.target = null;
      this.currentTarget = null;
      this.eventPhase = 0;
      this.propagationStopped = false;
      this.propagationImmediateStopped = false;
      this.type = type;
      this.bubbles = !!bubbles;
    }
    /**
     * @en
     * Reset the event for being stored in the object pool.
     *
     * @zh
     * 重置事件对象以便在对象池中存储。
     */


    _createClass(Event, [{
      key: "unuse",
      value: function unuse() {
        this.type = Event.NO_TYPE;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = Event.NONE;
        this.propagationStopped = false;
        this.propagationImmediateStopped = false;
      }
      /**
       * @en
       * Reinitialize the event for being used again after retrieved from the object pool.
       * @zh
       * 重新初始化让对象池中取出的事件可再次使用。
       * @param type - The name of the event (case-sensitive), e.g. "click", "fire", or "submit"
       * @param bubbles - A boolean indicating whether the event bubbles up through the tree or not
       */

    }, {
      key: "reuse",
      value: function reuse(type, bubbles) {
        this.type = type;
        this.bubbles = bubbles || false;
      } // /**
      //  * @en Stops propagation for current event.
      //  * @zh 停止传递当前事件。
      //  */
      // public stopPropagation () {
      //     this.propagationStopped = true;
      // }
      // /**
      //  * @en Stops propagation for current event immediately,
      //  * the event won't even be dispatched to the listeners attached in the current target.
      //  * @zh 立即停止当前事件的传递，事件甚至不会被分派到所连接的当前目标。
      //  */
      // public stopPropagationImmediate () {
      //     this.propagationImmediateStopped = true;
      // }

      /**
       * @en
       * Checks whether the event has been stopped.
       *
       * @zh
       * 检查该事件是否已经停止传递。
       */

    }, {
      key: "isStopped",
      value: function isStopped() {
        return this.propagationStopped || this.propagationImmediateStopped;
      }
      /**
       * @en
       * Gets current target of the event                                                            <br/>
       * note: It only be available when the event listener is associated with node.                <br/>
       * It returns 0 when the listener is associated with fixed priority.
       * @zh
       * 获取当前目标节点
       * @returns - The target with which the event associates.
       */

    }, {
      key: "getCurrentTarget",
      value: function getCurrentTarget() {
        return this.currentTarget;
      }
      /**
       * @en
       * Gets the event type.
       * @zh
       * 获取事件类型。
       */

    }, {
      key: "getType",
      value: function getType() {
        return this.type;
      }
    }]);

    return Event;
  }();
  /* tslint:disable:no-string-literal */


  _exports.default = Event;
  Event.NO_TYPE = 'no_type';
  Event.TOUCH = 'touch';
  Event.MOUSE = 'mouse';
  Event.KEYBOARD = 'keyboard';
  Event.ACCELERATION = 'acceleration';
  Event.NONE = 0;
  Event.CAPTURING_PHASE = 1;
  Event.AT_TARGET = 2;
  Event.BUBBLING_PHASE = 3;
  _globalExports.legacyCC.Event = Event;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZXZlbnQvZXZlbnQudHMiXSwibmFtZXMiOlsiRXZlbnQiLCJ0eXBlIiwiYnViYmxlcyIsInRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJldmVudFBoYXNlIiwicHJvcGFnYXRpb25TdG9wcGVkIiwicHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkIiwiTk9fVFlQRSIsIk5PTkUiLCJUT1VDSCIsIk1PVVNFIiwiS0VZQk9BUkQiLCJBQ0NFTEVSQVRJT04iLCJDQVBUVVJJTkdfUEhBU0UiLCJBVF9UQVJHRVQiLCJCVUJCTElOR19QSEFTRSIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQTs7Ozs7QUFLQTs7Ozs7OztNQU9xQkEsSztBQUNqQjs7QUFFQTs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7QUFRQTs7Ozs7OztBQVNBOztBQUVBOzs7Ozs7OztBQVNBOzs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7OztBQVVBOzs7Ozs7OztBQVNBOzs7Ozs7OztBQVNBOzs7Ozs7OztBQVNBOzs7Ozs7OztBQVNBOzs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7Ozs7Ozs7O0FBU0E7Ozs7Ozs7OztBQVVBOzs7O0FBSUEsbUJBQWFDLElBQWIsRUFBMkJDLE9BQTNCLEVBQThDO0FBQUE7O0FBQUEsV0FwRXZDRCxJQW9FdUM7QUFBQSxXQTNEdkNDLE9BMkR1QztBQUFBLFdBbER2Q0MsTUFrRHVDLEdBbERmLElBa0RlO0FBQUEsV0F6Q3ZDQyxhQXlDdUMsR0F6Q1IsSUF5Q1E7QUFBQSxXQXpCdkNDLFVBeUJ1QyxHQXpCMUIsQ0F5QjBCO0FBQUEsV0FoQnZDQyxrQkFnQnVDLEdBaEJsQixLQWdCa0I7QUFBQSxXQU52Q0MsMkJBTXVDLEdBTlQsS0FNUztBQUMxQyxXQUFLTixJQUFMLEdBQVlBLElBQVo7QUFDQSxXQUFLQyxPQUFMLEdBQWUsQ0FBQyxDQUFDQSxPQUFqQjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OzhCQU9nQjtBQUNaLGFBQUtELElBQUwsR0FBWUQsS0FBSyxDQUFDUSxPQUFsQjtBQUNBLGFBQUtMLE1BQUwsR0FBYyxJQUFkO0FBQ0EsYUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JMLEtBQUssQ0FBQ1MsSUFBeEI7QUFDQSxhQUFLSCxrQkFBTCxHQUEwQixLQUExQjtBQUNBLGFBQUtDLDJCQUFMLEdBQW1DLEtBQW5DO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7NEJBUWNOLEksRUFBY0MsTyxFQUFtQjtBQUMzQyxhQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLQyxPQUFMLEdBQWVBLE9BQU8sSUFBSSxLQUExQjtBQUNILE8sQ0FFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7a0NBT29CO0FBQ2hCLGVBQU8sS0FBS0ksa0JBQUwsSUFBMkIsS0FBS0MsMkJBQXZDO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7O3lDQVMyQjtBQUN2QixlQUFPLEtBQUtILGFBQVo7QUFDSDtBQUVEOzs7Ozs7Ozs7Z0NBTWtCO0FBQ2QsZUFBTyxLQUFLSCxJQUFaO0FBQ0g7Ozs7O0FBR0w7Ozs7QUF2UHFCRCxFQUFBQSxLLENBVUhRLE8sR0FBVSxTO0FBVlBSLEVBQUFBLEssQ0FtQkhVLEssR0FBUSxPO0FBbkJMVixFQUFBQSxLLENBMkJIVyxLLEdBQVEsTztBQTNCTFgsRUFBQUEsSyxDQW1DSFksUSxHQUFXLFU7QUFuQ1JaLEVBQUFBLEssQ0EyQ0hhLFksR0FBZSxjO0FBM0NaYixFQUFBQSxLLENBc0RIUyxJLEdBQU8sQztBQXRESlQsRUFBQUEsSyxDQWdFSGMsZSxHQUFrQixDO0FBaEVmZCxFQUFBQSxLLENBMEVIZSxTLEdBQVksQztBQTFFVGYsRUFBQUEsSyxDQW9GSGdCLGMsR0FBaUIsQztBQW9LbkNDLDBCQUFTakIsS0FBVCxHQUFpQkEsS0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiDkuovku7bnm7jlhbNcclxuICogQGNhdGVnb3J5IGV2ZW50XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBCYXNlIGNsYXNzIG9mIGFsbCBraW5kcyBvZiBldmVudHMuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDmiYDmnInkuovku7blr7nosaHnmoTln7rnsbvvvIzljIXlkKvkuovku7bnm7jlhbPln7rmnKzkv6Hmga/jgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50IHtcclxuICAgIC8vIEV2ZW50IHR5cGVzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvZGUgZm9yIGV2ZW50IHdpdGhvdXQgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOayoeacieexu+Wei+eahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIE5PX1RZUEUgPSAnbm9fdHlwZSc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB0eXBlIGNvZGUgb2YgVG91Y2ggZXZlbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDop6bmkbjkuovku7bnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBUT1VDSCA9ICd0b3VjaCc7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHR5cGUgY29kZSBvZiBNb3VzZSBldmVudC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOm8oOagh+S6i+S7tuexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIE1PVVNFID0gJ21vdXNlJztcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgdHlwZSBjb2RlIG9mIEtleWJvYXJkIGV2ZW50LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6ZSu55uY5LqL5Lu257G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgS0VZQk9BUkQgPSAna2V5Ym9hcmQnO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB0eXBlIGNvZGUgb2YgQWNjZWxlcmF0aW9uIGV2ZW50LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yqg6YCf5Zmo5LqL5Lu257G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgQUNDRUxFUkFUSU9OID0gJ2FjY2VsZXJhdGlvbic7XHJcblxyXG4gICAgLy8gRXZlbnQgcGhhc2VzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEV2ZW50cyBub3QgY3VycmVudGx5IGRpc3BhdGNoZWQgYXJlIGluIHRoaXMgcGhhc2UuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsJrmnKrmtL7lj5Hkuovku7bpmLbmrrXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBOT05FID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGNhcHR1cmluZyBwaGFzZSBjb21wcmlzZXMgdGhlIGpvdXJuZXkgZnJvbSB0aGUgcm9vdCB0byB0aGUgbGFzdCBub2RlIGJlZm9yZSB0aGUgZXZlbnQgdGFyZ2V0J3Mgbm9kZVxyXG4gICAgICogW21hcmtkb3duXShodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1FdmVudHMvI2V2ZW50LWZsb3cpXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmjZXojrfpmLbmrrXvvIzljIXmi6zkuovku7bnm67moIfoioLngrnkuYvliY3ku47moLnoioLngrnliLDmnIDlkI7kuIDkuKroioLngrnnmoTov4fnqIvjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBDQVBUVVJJTkdfUEhBU0UgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgdGFyZ2V0IHBoYXNlIGNvbXByaXNlcyBvbmx5IHRoZSBldmVudCB0YXJnZXQgbm9kZVxyXG4gICAgICogW21hcmtkb3duXSAoaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLyNldmVudC1mbG93KVxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog55uu5qCH6Zi25q615LuF5YyF5ous5LqL5Lu255uu5qCH6IqC54K544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgQVRfVEFSR0VUID0gMjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGJ1YmJsaW5nIHBoYXNlIGNvbXByaXNlcyBhbnkgc3Vic2VxdWVudCBub2RlcyBlbmNvdW50ZXJlZCBvbiB0aGUgcmV0dXJuIHRyaXAgdG8gdGhlIHJvb3Qgb2YgdGhlIGhpZXJhcmNoeVxyXG4gICAgICogW21hcmtkb3duXSAoaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLyNldmVudC1mbG93KVxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5YaS5rOh6Zi25q6177yMIOWMheaLrOWbnueoi+mBh+WIsOWIsOWxguasoeagueiKgueCueeahOS7u+S9leWQjue7reiKgueCueOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEJVQkJMSU5HX1BIQVNFID0gMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGV2ZW50IChjYXNlLXNlbnNpdGl2ZSksIGUuZy4gXCJjbGlja1wiLCBcImZpcmVcIiwgb3IgXCJzdWJtaXRcIi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS6i+S7tuexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJbmRpY2F0ZSB3aGV0aGVyIHRoZSBldmVudCBidWJibGVzIHVwIHRocm91Z2ggdGhlIGhpZXJhcmNoeSBvciBub3QuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDooajnpLror6Xkuovku7bmmK/lkKbov5vooYzlhpLms6HjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGJ1YmJsZXM6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSB0YXJnZXQgdG8gd2hpY2ggdGhlIGV2ZW50IHdhcyBvcmlnaW5hbGx5IGRpc3BhdGNoZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmnIDliJ3kuovku7bop6blj5HnmoTnm67moIfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRhcmdldDogT2JqZWN0IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgcmVnaXN0ZXJlZCB0YXJnZXQgZm9yIHRoZSBldmVudC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjeebruagh+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3VycmVudFRhcmdldDogT2JqZWN0IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEluZGljYXRlcyB3aGljaCBwaGFzZSBvZiB0aGUgZXZlbnQgZmxvdyBpcyBjdXJyZW50bHkgYmVpbmcgZXZhbHVhdGVkLlxyXG4gICAgICogUmV0dXJucyBhbiBpbnRlZ2VyIHZhbHVlIHJlcHJlc2VudGVkIGJ5IDQgY29uc3RhbnRzOlxyXG4gICAgICogIC0gRXZlbnQuTk9ORSA9IDBcclxuICAgICAqICAtIEV2ZW50LkNBUFRVUklOR19QSEFTRSA9IDFcclxuICAgICAqICAtIEV2ZW50LkFUX1RBUkdFVCA9IDJcclxuICAgICAqICAtIEV2ZW50LkJVQkJMSU5HX1BIQVNFID0gM1xyXG4gICAgICogVGhlIHBoYXNlcyBhcmUgZXhwbGFpbmVkIGluIHRoZSBbc2VjdGlvbiAzLjEsIEV2ZW50IGRpc3BhdGNoIGFuZCBET00gZXZlbnQgZmxvd11cclxuICAgICAqIFttYXJrZG93bl0oaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtRXZlbnRzLyNldmVudC1mbG93KSwgb2YgdGhlIERPTSBMZXZlbCAzIEV2ZW50cyBzcGVjaWZpY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5LqL5Lu26Zi25q6144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBldmVudFBoYXNlID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3RvcHMgcHJvcGFnYXRpb24gZm9yIGN1cnJlbnQgZXZlbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlgZzmraLkvKDpgJLlvZPliY3kuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb3BhZ2F0aW9uU3RvcHBlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTdG9wcyBwcm9wYWdhdGlvbiBmb3IgY3VycmVudCBldmVudCBpbW1lZGlhdGVseSxcclxuICAgICAqIHRoZSBldmVudCB3b24ndCBldmVuIGJlIGRpc3BhdGNoZWQgdG8gdGhlIGxpc3RlbmVycyBhdHRhY2hlZCBpbiB0aGUgY3VycmVudCB0YXJnZXQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnq4vljbPlgZzmraLlvZPliY3kuovku7bnmoTkvKDpgJLvvIzkuovku7bnlJroh7PkuI3kvJrooqvliIbmtL7liLDmiYDov57mjqXnmoTlvZPliY3nm67moIfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHByb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgKGNhc2Utc2Vuc2l0aXZlKSwgZS5nLiBcImNsaWNrXCIsIFwiZmlyZVwiLCBvciBcInN1Ym1pdFwiXHJcbiAgICAgKiBAcGFyYW0gYnViYmxlcyAtIEEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdGhyb3VnaCB0aGUgdHJlZSBvciBub3RcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKHR5cGU6IHN0cmluZywgYnViYmxlcz86IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuYnViYmxlcyA9ICEhYnViYmxlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVzZXQgdGhlIGV2ZW50IGZvciBiZWluZyBzdG9yZWQgaW4gdGhlIG9iamVjdCBwb29sLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6YeN572u5LqL5Lu25a+56LGh5Lul5L6/5Zyo5a+56LGh5rGg5Lit5a2Y5YKo44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bnVzZSAoKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gRXZlbnQuTk9fVFlQRTtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmV2ZW50UGhhc2UgPSBFdmVudC5OT05FO1xyXG4gICAgICAgIHRoaXMucHJvcGFnYXRpb25TdG9wcGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcm9wYWdhdGlvbkltbWVkaWF0ZVN0b3BwZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVpbml0aWFsaXplIHRoZSBldmVudCBmb3IgYmVpbmcgdXNlZCBhZ2FpbiBhZnRlciByZXRyaWV2ZWQgZnJvbSB0aGUgb2JqZWN0IHBvb2wuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmHjeaWsOWIneWni+WMluiuqeWvueixoeaxoOS4reWPluWHuueahOS6i+S7tuWPr+WGjeasoeS9v+eUqOOAglxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgKGNhc2Utc2Vuc2l0aXZlKSwgZS5nLiBcImNsaWNrXCIsIFwiZmlyZVwiLCBvciBcInN1Ym1pdFwiXHJcbiAgICAgKiBAcGFyYW0gYnViYmxlcyAtIEEgYm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGV2ZW50IGJ1YmJsZXMgdXAgdGhyb3VnaCB0aGUgdHJlZSBvciBub3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJldXNlICh0eXBlOiBzdHJpbmcsIGJ1YmJsZXM/OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmJ1YmJsZXMgPSBidWJibGVzIHx8IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC8qKlxyXG4gICAgLy8gICogQGVuIFN0b3BzIHByb3BhZ2F0aW9uIGZvciBjdXJyZW50IGV2ZW50LlxyXG4gICAgLy8gICogQHpoIOWBnOatouS8oOmAkuW9k+WJjeS6i+S7tuOAglxyXG4gICAgLy8gICovXHJcbiAgICAvLyBwdWJsaWMgc3RvcFByb3BhZ2F0aW9uICgpIHtcclxuICAgIC8vICAgICB0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gLyoqXHJcbiAgICAvLyAgKiBAZW4gU3RvcHMgcHJvcGFnYXRpb24gZm9yIGN1cnJlbnQgZXZlbnQgaW1tZWRpYXRlbHksXHJcbiAgICAvLyAgKiB0aGUgZXZlbnQgd29uJ3QgZXZlbiBiZSBkaXNwYXRjaGVkIHRvIHRoZSBsaXN0ZW5lcnMgYXR0YWNoZWQgaW4gdGhlIGN1cnJlbnQgdGFyZ2V0LlxyXG4gICAgLy8gICogQHpoIOeri+WNs+WBnOatouW9k+WJjeS6i+S7tueahOS8oOmAku+8jOS6i+S7tueUmuiHs+S4jeS8muiiq+WIhua0vuWIsOaJgOi/nuaOpeeahOW9k+WJjeebruagh+OAglxyXG4gICAgLy8gICovXHJcbiAgICAvLyBwdWJsaWMgc3RvcFByb3BhZ2F0aW9uSW1tZWRpYXRlICgpIHtcclxuICAgIC8vICAgICB0aGlzLnByb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCA9IHRydWU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENoZWNrcyB3aGV0aGVyIHRoZSBldmVudCBoYXMgYmVlbiBzdG9wcGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5qOA5p+l6K+l5LqL5Lu25piv5ZCm5bey57uP5YGc5q2i5Lyg6YCS44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc1N0b3BwZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZCB8fCB0aGlzLnByb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBjdXJyZW50IHRhcmdldCBvZiB0aGUgZXZlbnQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxyXG4gICAgICogbm90ZTogSXQgb25seSBiZSBhdmFpbGFibGUgd2hlbiB0aGUgZXZlbnQgbGlzdGVuZXIgaXMgYXNzb2NpYXRlZCB3aXRoIG5vZGUuICAgICAgICAgICAgICAgIDxici8+XHJcbiAgICAgKiBJdCByZXR1cm5zIDAgd2hlbiB0aGUgbGlzdGVuZXIgaXMgYXNzb2NpYXRlZCB3aXRoIGZpeGVkIHByaW9yaXR5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvZPliY3nm67moIfoioLngrlcclxuICAgICAqIEByZXR1cm5zIC0gVGhlIHRhcmdldCB3aXRoIHdoaWNoIHRoZSBldmVudCBhc3NvY2lhdGVzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q3VycmVudFRhcmdldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgZXZlbnQgdHlwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5LqL5Lu257G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRUeXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1zdHJpbmctbGl0ZXJhbCAqL1xyXG5sZWdhY3lDQy5FdmVudCA9IEV2ZW50O1xyXG4iXX0=