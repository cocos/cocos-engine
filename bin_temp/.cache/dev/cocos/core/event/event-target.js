(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js", "./eventify.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"), require("./eventify.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.eventify);
    global.eventTarget = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _eventify) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EventTarget = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  var Empty = function Empty() {
    _classCallCheck(this, Empty);
  };

  ;
  /**
   * @en
   * EventTarget is an object to which an event is dispatched when something has occurred.
   * [[Node]]s are the most common event targets, but other objects can be event targets too.
   * If a class cannot extend from EventTarget, it can consider using [[Eventify]].
   *
   * @zh
   * 事件目标是具有注册监听器、派发事件能力的类，[[Node]] 是最常见的事件目标，
   * 但是其他类也可以继承自事件目标以获得管理监听器和派发事件的能力。
   * 如果无法继承自 EventTarget，也可以使用 [[Eventify]]
   */

  var EventTarget = (0, _eventify.Eventify)(Empty);
  _exports.EventTarget = EventTarget;
  _globalExports.legacyCC.EventTarget = EventTarget;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZXZlbnQvZXZlbnQtdGFyZ2V0LnRzIl0sIm5hbWVzIjpbIkVtcHR5IiwiRXZlbnRUYXJnZXQiLCJsZWdhY3lDQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DQTtNQUNNQSxLOzs7O0FBQVE7QUFFZDs7Ozs7Ozs7Ozs7O0FBV08sTUFBTUMsV0FBVyxHQUFHLHdCQUFTRCxLQUFULENBQXBCOztBQUlQRSwwQkFBU0QsV0FBVCxHQUF1QkEsV0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyLvu78vKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGV2ZW50XHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMganMgZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBDYWxsYmFja3NJbnZva2VyIH0gZnJvbSAnLi9jYWxsYmFja3MtaW52b2tlcic7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBFdmVudGlmeSB9IGZyb20gJy4vZXZlbnRpZnknO1xyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHRyYW5lb3VzLWNsYXNzXHJcbmNsYXNzIEVtcHR5IHt9O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBFdmVudFRhcmdldCBpcyBhbiBvYmplY3QgdG8gd2hpY2ggYW4gZXZlbnQgaXMgZGlzcGF0Y2hlZCB3aGVuIHNvbWV0aGluZyBoYXMgb2NjdXJyZWQuXHJcbiAqIFtbTm9kZV1dcyBhcmUgdGhlIG1vc3QgY29tbW9uIGV2ZW50IHRhcmdldHMsIGJ1dCBvdGhlciBvYmplY3RzIGNhbiBiZSBldmVudCB0YXJnZXRzIHRvby5cclxuICogSWYgYSBjbGFzcyBjYW5ub3QgZXh0ZW5kIGZyb20gRXZlbnRUYXJnZXQsIGl0IGNhbiBjb25zaWRlciB1c2luZyBbW0V2ZW50aWZ5XV0uXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDkuovku7bnm67moIfmmK/lhbfmnInms6jlhoznm5HlkKzlmajjgIHmtL7lj5Hkuovku7bog73lipvnmoTnsbvvvIxbW05vZGVdXSDmmK/mnIDluLjop4HnmoTkuovku7bnm67moIfvvIxcclxuICog5L2G5piv5YW25LuW57G75Lmf5Y+v5Lul57un5om/6Ieq5LqL5Lu255uu5qCH5Lul6I635b6X566h55CG55uR5ZCs5Zmo5ZKM5rS+5Y+R5LqL5Lu255qE6IO95Yqb44CCXHJcbiAqIOWmguaenOaXoOazlee7p+aJv+iHqiBFdmVudFRhcmdldO+8jOS5n+WPr+S7peS9v+eUqCBbW0V2ZW50aWZ5XV1cclxuICovXHJcbmV4cG9ydCBjb25zdCBFdmVudFRhcmdldCA9IEV2ZW50aWZ5KEVtcHR5KTtcclxuXHJcbmV4cG9ydCB0eXBlIEV2ZW50VGFyZ2V0ID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBFdmVudFRhcmdldD47XHJcblxyXG5sZWdhY3lDQy5FdmVudFRhcmdldCA9IEV2ZW50VGFyZ2V0O1xyXG4iXX0=