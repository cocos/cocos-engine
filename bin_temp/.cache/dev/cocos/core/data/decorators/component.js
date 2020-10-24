(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "./utils.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("./utils.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.utils);
    global.component = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.disallowMultiple = _exports.executionOrder = _exports.requireComponent = void 0;

  /**
   * @category decorator
   */

  /**
   * @en Declare that the current component relies on another type of component. 
   * If the required component doesn't exist, the engine will create a new empty instance of the required component and add to the node.
   * @zh 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
   * @param requiredComponent The required component type
   * @example
   * ```ts
   * import {_decorator, Sprite, Component} from cc;
   * import {ccclass, requireComponent} from _decorator;
   *
   * @ccclass
   * @requireComponent(Sprite)
   * class SpriteCtrl extends Component {
   *     // ...
   * }
   * ```
   */
  var requireComponent = (0, _utils.makeEditorClassDecoratorFn)('requireComponent');
  /**
   * @en Set the component priority, it decides at which order the life cycle functions of components will be invoked. Smaller priority get invoked before larger priority.
   * This will affect `onLoad`, `onEnable`, `start`, `update` and `lateUpdate`, but `onDisable` and `onDestroy` won't be affected.
   * @zh 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
   * @param priority - The execution order of life cycle methods for Component. Smaller priority get invoked before larger priority.
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, executionOrder} = _decorator;
   *
   * @ccclass
   * @executionOrder(1)
   * class CameraCtrl extends Component {
   *     // ...
   * }
   * ```
   */

  _exports.requireComponent = requireComponent;
  var executionOrder = (0, _utils.makeEditorClassDecoratorFn)('executionOrder');
  /**
   * @en Forbid add multiple instances of the component to the same node.
   * @zh 防止多个相同类型（或子类型）的组件被添加到同一个节点。
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass, disallowMultiple} = _decorator;
   *
   * @ccclass
   * @disallowMultiple
   * class CameraCtrl extends Component {
   *     // ...
   * }
   * ```
   */

  _exports.executionOrder = executionOrder;
  var disallowMultiple = _defaultConstants.DEV ? _utils.emptySmartClassDecorator : (0, _utils.makeSmartEditorClassDecorator)('disallowMultiple');
  _exports.disallowMultiple = disallowMultiple;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL2NvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJyZXF1aXJlQ29tcG9uZW50IiwiZXhlY3V0aW9uT3JkZXIiLCJkaXNhbGxvd011bHRpcGxlIiwiREVWIiwiZW1wdHlTbWFydENsYXNzRGVjb3JhdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJPLE1BQU1BLGdCQUFpRSxHQUFHLHVDQUEyQixrQkFBM0IsQ0FBMUU7QUFFUDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCTyxNQUFNQyxjQUFvRCxHQUFHLHVDQUEyQixnQkFBM0IsQ0FBN0Q7QUFFUDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlTyxNQUFNQyxnQkFBc0UsR0FDL0VDLHdCQUFNQywrQkFBTixHQUFpQywwQ0FBOEIsa0JBQTlCLENBRDlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBkZWNvcmF0b3JcclxuICovXHJcblxyXG5pbXBvcnQgeyBERVYgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBtYWtlRWRpdG9yQ2xhc3NEZWNvcmF0b3JGbiwgbWFrZVNtYXJ0RWRpdG9yQ2xhc3NEZWNvcmF0b3IsIGVtcHR5U21hcnRDbGFzc0RlY29yYXRvciB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBEZWNsYXJlIHRoYXQgdGhlIGN1cnJlbnQgY29tcG9uZW50IHJlbGllcyBvbiBhbm90aGVyIHR5cGUgb2YgY29tcG9uZW50LiBcclxuICogSWYgdGhlIHJlcXVpcmVkIGNvbXBvbmVudCBkb2Vzbid0IGV4aXN0LCB0aGUgZW5naW5lIHdpbGwgY3JlYXRlIGEgbmV3IGVtcHR5IGluc3RhbmNlIG9mIHRoZSByZXF1aXJlZCBjb21wb25lbnQgYW5kIGFkZCB0byB0aGUgbm9kZS5cclxuICogQHpoIOS4uuWjsOaYjuS4uiBDQ0NsYXNzIOeahOe7hOS7tua3u+WKoOS+nei1lueahOWFtuWug+e7hOS7tuOAguW9k+e7hOS7tua3u+WKoOWIsOiKgueCueS4iuaXtu+8jOWmguaenOS+nei1lueahOe7hOS7tuS4jeWtmOWcqO+8jOW8leaTjuWwhuS8muiHquWKqOWwhuS+nei1lue7hOS7tua3u+WKoOWIsOWQjOS4gOS4quiKgueCue+8jOmYsuatouiEmuacrOWHuumUmeOAguivpeiuvue9ruWcqOi/kOihjOaXtuWQjOagt+acieaViOOAglxyXG4gKiBAcGFyYW0gcmVxdWlyZWRDb21wb25lbnQgVGhlIHJlcXVpcmVkIGNvbXBvbmVudCB0eXBlXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7X2RlY29yYXRvciwgU3ByaXRlLCBDb21wb25lbnR9IGZyb20gY2M7XHJcbiAqIGltcG9ydCB7Y2NjbGFzcywgcmVxdWlyZUNvbXBvbmVudH0gZnJvbSBfZGVjb3JhdG9yO1xyXG4gKlxyXG4gKiBAY2NjbGFzc1xyXG4gKiBAcmVxdWlyZUNvbXBvbmVudChTcHJpdGUpXHJcbiAqIGNsYXNzIFNwcml0ZUN0cmwgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gKiAgICAgLy8gLi4uXHJcbiAqIH1cclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgcmVxdWlyZUNvbXBvbmVudDogKHJlcXVpcmVkQ29tcG9uZW50OiBGdW5jdGlvbikgPT4gQ2xhc3NEZWNvcmF0b3IgPSBtYWtlRWRpdG9yQ2xhc3NEZWNvcmF0b3JGbigncmVxdWlyZUNvbXBvbmVudCcpO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBTZXQgdGhlIGNvbXBvbmVudCBwcmlvcml0eSwgaXQgZGVjaWRlcyBhdCB3aGljaCBvcmRlciB0aGUgbGlmZSBjeWNsZSBmdW5jdGlvbnMgb2YgY29tcG9uZW50cyB3aWxsIGJlIGludm9rZWQuIFNtYWxsZXIgcHJpb3JpdHkgZ2V0IGludm9rZWQgYmVmb3JlIGxhcmdlciBwcmlvcml0eS5cclxuICogVGhpcyB3aWxsIGFmZmVjdCBgb25Mb2FkYCwgYG9uRW5hYmxlYCwgYHN0YXJ0YCwgYHVwZGF0ZWAgYW5kIGBsYXRlVXBkYXRlYCwgYnV0IGBvbkRpc2FibGVgIGFuZCBgb25EZXN0cm95YCB3b24ndCBiZSBhZmZlY3RlZC5cclxuICogQHpoIOiuvue9ruiEmuacrOeUn+WRveWRqOacn+aWueazleiwg+eUqOeahOS8mOWFiOe6p+OAguS8mOWFiOe6p+Wwj+S6jiAwIOeahOe7hOS7tuWwhuS8muS8mOWFiOaJp+ihjO+8jOS8mOWFiOe6p+Wkp+S6jiAwIOeahOe7hOS7tuWwhuS8muW7tuWQjuaJp+ihjOOAguS8mOWFiOe6p+S7heS8muW9seWTjSBvbkxvYWQsIG9uRW5hYmxlLCBzdGFydCwgdXBkYXRlIOWSjCBsYXRlVXBkYXRl77yM6ICMIG9uRGlzYWJsZSDlkowgb25EZXN0cm95IOS4jeWPl+W9seWTjeOAglxyXG4gKiBAcGFyYW0gcHJpb3JpdHkgLSBUaGUgZXhlY3V0aW9uIG9yZGVyIG9mIGxpZmUgY3ljbGUgbWV0aG9kcyBmb3IgQ29tcG9uZW50LiBTbWFsbGVyIHByaW9yaXR5IGdldCBpbnZva2VkIGJlZm9yZSBsYXJnZXIgcHJpb3JpdHkuXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IF9kZWNvcmF0b3IsIENvbXBvbmVudCB9IGZyb20gJ2NjJztcclxuICogY29uc3Qge2NjY2xhc3MsIGV4ZWN1dGlvbk9yZGVyfSA9IF9kZWNvcmF0b3I7XHJcbiAqXHJcbiAqIEBjY2NsYXNzXHJcbiAqIEBleGVjdXRpb25PcmRlcigxKVxyXG4gKiBjbGFzcyBDYW1lcmFDdHJsIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICogICAgIC8vIC4uLlxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGV4ZWN1dGlvbk9yZGVyOiAocHJpb3JpdHk6IG51bWJlcikgPT4gQ2xhc3NEZWNvcmF0b3IgPSBtYWtlRWRpdG9yQ2xhc3NEZWNvcmF0b3JGbignZXhlY3V0aW9uT3JkZXInKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRm9yYmlkIGFkZCBtdWx0aXBsZSBpbnN0YW5jZXMgb2YgdGhlIGNvbXBvbmVudCB0byB0aGUgc2FtZSBub2RlLlxyXG4gKiBAemgg6Ziy5q2i5aSa5Liq55u45ZCM57G75Z6L77yI5oiW5a2Q57G75Z6L77yJ55qE57uE5Lu26KKr5re75Yqg5Yiw5ZCM5LiA5Liq6IqC54K544CCXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYHRzXHJcbiAqIGltcG9ydCB7IF9kZWNvcmF0b3IsIENvbXBvbmVudCB9IGZyb20gJ2NjJztcclxuICogY29uc3Qge2NjY2xhc3MsIGRpc2FsbG93TXVsdGlwbGV9ID0gX2RlY29yYXRvcjtcclxuICpcclxuICogQGNjY2xhc3NcclxuICogQGRpc2FsbG93TXVsdGlwbGVcclxuICogY2xhc3MgQ2FtZXJhQ3RybCBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAqICAgICAvLyAuLi5cclxuICogfVxyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjb25zdCBkaXNhbGxvd011bHRpcGxlOiBDbGFzc0RlY29yYXRvciAmICgoeWVzPzogYm9vbGVhbikgPT4gQ2xhc3NEZWNvcmF0b3IpID1cclxuICAgIERFViA/IGVtcHR5U21hcnRDbGFzc0RlY29yYXRvciA6IG1ha2VTbWFydEVkaXRvckNsYXNzRGVjb3JhdG9yKCdkaXNhbGxvd011bHRpcGxlJyk7Il19