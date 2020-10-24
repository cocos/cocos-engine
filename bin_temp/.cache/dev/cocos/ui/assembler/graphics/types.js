(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/value-types/enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/value-types/enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._enum);
    global.types = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _enum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PointFlags = _exports.LineJoin = _exports.LineCap = void 0;

  /*
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos.com
  
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated engine source code (the "Software"), a limited,
    worldwide, royalty-free, non-assignable, revocable and non-exclusive license
   to use Cocos Creator solely to develop games on your target platforms. You shall
    not use Cocos Creator software for developing other software or tools that's
    used for developing games. You are not granted to publish, distribute,
    sublicense, and/or sell copies of Cocos Creator.
  
   The software or tools in this License Agreement are licensed, not sold.
   Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
  
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
  */

  /**
   * @en Enum for LineCap.
   * @zh 线段末端属性
   * @enum Graphics.LineCap
   */
  var LineCap;
  _exports.LineCap = LineCap;

  (function (LineCap) {
    LineCap[LineCap["BUTT"] = 0] = "BUTT";
    LineCap[LineCap["ROUND"] = 1] = "ROUND";
    LineCap[LineCap["SQUARE"] = 2] = "SQUARE";
  })(LineCap || (_exports.LineCap = LineCap = {}));

  (0, _enum.ccenum)(LineCap);
  /**
   * @en Enum for LineJoin.
   * @zh 线段拐角属性
   * @enum Graphics.LineJoin
   */

  var LineJoin;
  _exports.LineJoin = LineJoin;

  (function (LineJoin) {
    LineJoin[LineJoin["BEVEL"] = 0] = "BEVEL";
    LineJoin[LineJoin["ROUND"] = 1] = "ROUND";
    LineJoin[LineJoin["MITER"] = 2] = "MITER";
  })(LineJoin || (_exports.LineJoin = LineJoin = {}));

  (0, _enum.ccenum)(LineJoin); // PointFlags

  var PointFlags;
  _exports.PointFlags = PointFlags;

  (function (PointFlags) {
    PointFlags[PointFlags["PT_CORNER"] = 1] = "PT_CORNER";
    PointFlags[PointFlags["PT_LEFT"] = 2] = "PT_LEFT";
    PointFlags[PointFlags["PT_BEVEL"] = 4] = "PT_BEVEL";
    PointFlags[PointFlags["PT_INNERBEVEL"] = 8] = "PT_INNERBEVEL";
  })(PointFlags || (_exports.PointFlags = PointFlags = {}));

  (0, _enum.ccenum)(PointFlags);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9ncmFwaGljcy90eXBlcy50cyJdLCJuYW1lcyI6WyJMaW5lQ2FwIiwiTGluZUpvaW4iLCJQb2ludEZsYWdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQTs7Ozs7TUFLWUEsTzs7O2FBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87S0FBQUEsTyx3QkFBQUEsTzs7QUFvQlosb0JBQU9BLE9BQVA7QUFFQTs7Ozs7O01BS1lDLFE7OzthQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtBQUFBQSxJQUFBQSxRLENBQUFBLFE7QUFBQUEsSUFBQUEsUSxDQUFBQSxRO0tBQUFBLFEseUJBQUFBLFE7O0FBc0JaLG9CQUFPQSxRQUFQLEUsQ0FFQTs7TUFDWUMsVTs7O2FBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0tBQUFBLFUsMkJBQUFBLFU7O0FBT1osb0JBQU9BLFVBQVAiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG5pbXBvcnQgeyBjY2VudW0gfSBmcm9tICcuLi8uLi8uLi9jb3JlL3ZhbHVlLXR5cGVzL2VudW0nO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciBMaW5lQ2FwLlxyXG4gKiBAemgg57q/5q615pyr56uv5bGe5oCnXHJcbiAqIEBlbnVtIEdyYXBoaWNzLkxpbmVDYXBcclxuICovXHJcbmV4cG9ydCBlbnVtIExpbmVDYXAge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGVuZHMgb2YgbGluZXMgYXJlIHNxdWFyZWQgb2ZmIGF0IHRoZSBlbmRwb2ludHMuXHJcbiAgICAgKiBAemgg57q/5q615pyr56uv5Lul5pa55b2i57uT5p2f44CCXHJcbiAgICAgKi9cclxuICAgIEJVVFQgPSAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBlbmRzIG9mIGxpbmVzIGFyZSByb3VuZGVkLlxyXG4gICAgICogQHpoIOe6v+auteacq+err+S7peWchuW9oue7k+adn+OAglxyXG4gICAgICovXHJcbiAgICBST1VORCA9IDEsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGVuZHMgb2YgbGluZXMgYXJlIHNxdWFyZWQgb2ZmIGJ5IGFkZGluZyBhIGJveCB3aXRoIGFuIGVxdWFsIHdpZHRoIGFuZCBoYWxmIHRoZSBoZWlnaHQgb2YgdGhlIGxpbmUncyB0aGlja25lc3MuXHJcbiAgICAgKiBAemgg57q/5q615pyr56uv5Lul5pa55b2i57uT5p2f77yM5L2G5piv5aKe5Yqg5LqG5LiA5Liq5a695bqm5ZKM57q/5q6155u45ZCM77yM6auY5bqm5piv57q/5q615Y6a5bqm5LiA5Y2K55qE55+p5b2i5Yy65Z+f44CCXHJcbiAgICAgKi9cclxuICAgIFNRVUFSRSA9IDIsXHJcbn1cclxuXHJcbmNjZW51bShMaW5lQ2FwKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgTGluZUpvaW4uXHJcbiAqIEB6aCDnur/mrrXmi5Dop5LlsZ7mgKdcclxuICogQGVudW0gR3JhcGhpY3MuTGluZUpvaW5cclxuICovXHJcbmV4cG9ydCBlbnVtIExpbmVKb2luIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEZpbGxzIGFuIGFkZGl0aW9uYWwgdHJpYW5ndWxhciBhcmVhIGJldHdlZW4gdGhlIGNvbW1vbiBlbmRwb2ludCBvZiBjb25uZWN0ZWQgc2VnbWVudHMsIGFuZCB0aGUgc2VwYXJhdGUgb3V0c2lkZSByZWN0YW5ndWxhciBjb3JuZXJzIG9mIGVhY2ggc2VnbWVudC5cclxuICAgICAqIEB6aCDlnKjnm7jov57pg6jliIbnmoTmnKvnq6/loavlhYXkuIDkuKrpop3lpJbnmoTku6XkuInop5LlvaLkuLrlupXnmoTljLrln5/vvIwg5q+P5Liq6YOo5YiG6YO95pyJ5ZCE6Ieq54us56uL55qE55+p5b2i5ouQ6KeS44CCXHJcbiAgICAgKi9cclxuICAgIEJFVkVMID0gMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSb3VuZHMgb2ZmIHRoZSBjb3JuZXJzIG9mIGEgc2hhcGUgYnkgZmlsbGluZyBhbiBhZGRpdGlvbmFsIHNlY3RvciBvZiBkaXNjIGNlbnRlcmVkIGF0IHRoZSBjb21tb24gZW5kcG9pbnQgb2YgY29ubmVjdGVkIHNlZ21lbnRzLlxyXG4gICAgICogVGhlIHJhZGl1cyBmb3IgdGhlc2Ugcm91bmRlZCBjb3JuZXJzIGlzIGVxdWFsIHRvIHRoZSBsaW5lIHdpZHRoLlxyXG4gICAgICogQHpoIOmAmui/h+Whq+WFheS4gOS4qumineWklueahO+8jOWchuW/g+WcqOebuOi/numDqOWIhuacq+err+eahOaJh+W9ou+8jOe7mOWItuaLkOinkueahOW9oueKtuOAgiDlnIbop5LnmoTljYrlvoTmmK/nur/mrrXnmoTlrr3luqbjgIJcclxuICAgICAqL1xyXG4gICAgUk9VTkQgPSAxLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENvbm5lY3RlZCBzZWdtZW50cyBhcmUgam9pbmVkIGJ5IGV4dGVuZGluZyB0aGVpciBvdXRzaWRlIGVkZ2VzIHRvIGNvbm5lY3QgYXQgYSBzaW5nbGUgcG9pbnQsXHJcbiAgICAgKiB3aXRoIHRoZSBlZmZlY3Qgb2YgZmlsbGluZyBhbiBhZGRpdGlvbmFsIGxvemVuZ2Utc2hhcGVkIGFyZWEuXHJcbiAgICAgKiBAemgg6YCa6L+H5bu25Ly455u46L+e6YOo5YiG55qE5aSW6L6557yY77yM5L2/5YW255u45Lqk5LqO5LiA54K577yM5b2i5oiQ5LiA5Liq6aKd5aSW55qE6I+x5b2i5Yy65Z+f44CCXHJcbiAgICAgKi9cclxuICAgIE1JVEVSID0gMixcclxufVxyXG5cclxuY2NlbnVtKExpbmVKb2luKTtcclxuXHJcbi8vIFBvaW50RmxhZ3NcclxuZXhwb3J0IGVudW0gUG9pbnRGbGFncyB7XHJcbiAgICBQVF9DT1JORVIgPSAweDAxLFxyXG4gICAgUFRfTEVGVCA9IDB4MDIsXHJcbiAgICBQVF9CRVZFTCA9IDB4MDQsXHJcbiAgICBQVF9JTk5FUkJFVkVMID0gMHgwOCxcclxufVxyXG5cclxuY2NlbnVtKFBvaW50RmxhZ3MpO1xyXG4iXX0=