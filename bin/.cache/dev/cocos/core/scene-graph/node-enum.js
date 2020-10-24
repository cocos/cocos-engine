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
    global.nodeEnum = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TransformBit = _exports.NodeSpace = void 0;

  /*
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
   * @category scene-graph
   */

  /**
   * @en Node's coordinate space
   * @zh 节点的坐标空间
   */
  var NodeSpace;
  /**
   * @en Bit masks for node's transformation
   * @zh 节点的空间变换位标记
   */

  _exports.NodeSpace = NodeSpace;

  (function (NodeSpace) {
    NodeSpace[NodeSpace["LOCAL"] = 0] = "LOCAL";
    NodeSpace[NodeSpace["WORLD"] = 1] = "WORLD";
  })(NodeSpace || (_exports.NodeSpace = NodeSpace = {}));

  var TransformBit;
  _exports.TransformBit = TransformBit;

  (function (TransformBit) {
    TransformBit[TransformBit["NONE"] = 0] = "NONE";
    TransformBit[TransformBit["POSITION"] = 1] = "POSITION";
    TransformBit[TransformBit["ROTATION"] = 2] = "ROTATION";
    TransformBit[TransformBit["SCALE"] = 4] = "SCALE";
    TransformBit[TransformBit["RS"] = TransformBit.ROTATION | TransformBit.SCALE] = "RS";
    TransformBit[TransformBit["TRS"] = TransformBit.POSITION | TransformBit.ROTATION | TransformBit.SCALE] = "TRS";
    TransformBit[TransformBit["TRS_MASK"] = ~TransformBit.TRS] = "TRS_MASK";
  })(TransformBit || (_exports.TransformBit = TransformBit = {}));

  _globalExports.legacyCC.internal.TransformBit = TransformBit;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS1lbnVtLnRzIl0sIm5hbWVzIjpbIk5vZGVTcGFjZSIsIlRyYW5zZm9ybUJpdCIsIlJPVEFUSU9OIiwiU0NBTEUiLCJQT1NJVElPTiIsIlRSUyIsImxlZ2FjeUNDIiwiaW50ZXJuYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkE7Ozs7QUFJQTs7OztNQUlZQSxTO0FBS1o7Ozs7Ozs7YUFMWUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0tBQUFBLFMsMEJBQUFBLFM7O01BU0FDLFk7OzthQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFksU0F5QkhBLFlBQVksQ0FBQ0MsUUFBYixHQUF3QkQsWUFBWSxDQUFDRSxLO0FBekJsQ0YsSUFBQUEsWSxDQUFBQSxZLFVBOEJGQSxZQUFZLENBQUNHLFFBQWIsR0FBd0JILFlBQVksQ0FBQ0MsUUFBckMsR0FBZ0RELFlBQVksQ0FBQ0UsSztBQTlCM0RGLElBQUFBLFksQ0FBQUEsWSxlQStCRyxDQUFDQSxZQUFZLENBQUNJLEc7S0EvQmpCSixZLDZCQUFBQSxZOztBQWtDWkssMEJBQVNDLFFBQVQsQ0FBa0JOLFlBQWxCLEdBQWlDQSxZQUFqQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBzY2VuZS1ncmFwaFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAZW4gTm9kZSdzIGNvb3JkaW5hdGUgc3BhY2VcclxuICogQHpoIOiKgueCueeahOWdkOagh+epuumXtFxyXG4gKi9cclxuZXhwb3J0IGVudW0gTm9kZVNwYWNlIHtcclxuICAgIExPQ0FMLFxyXG4gICAgV09STEQsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gQml0IG1hc2tzIGZvciBub2RlJ3MgdHJhbnNmb3JtYXRpb25cclxuICogQHpoIOiKgueCueeahOepuumXtOWPmOaNouS9jeagh+iusFxyXG4gKi9cclxuZXhwb3J0IGVudW0gVHJhbnNmb3JtQml0IHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDml6DmlLnlj5hcclxuICAgICAqL1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6IqC54K55L2N572u5pS55Y+YXHJcbiAgICAgKi9cclxuICAgIFBPU0lUSU9OID0gKDEgPDwgMCksXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6IqC54K55peL6L2sXHJcbiAgICAgKi9cclxuICAgIFJPVEFUSU9OID0gKDEgPDwgMSksXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6IqC54K557yp5pS+XHJcbiAgICAgKi9cclxuICAgIFNDQUxFID0gKDEgPDwgMiksXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6IqC54K55peL6L2s5Y+K57yp5pS+XHJcbiAgICAgKi9cclxuICAgIFJTID0gVHJhbnNmb3JtQml0LlJPVEFUSU9OIHwgVHJhbnNmb3JtQml0LlNDQUxFLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiKgueCueW5s+enu++8jOaXi+i9rOWPiue8qeaUvlxyXG4gICAgICovXHJcbiAgICBUUlMgPSBUcmFuc2Zvcm1CaXQuUE9TSVRJT04gfCBUcmFuc2Zvcm1CaXQuUk9UQVRJT04gfCBUcmFuc2Zvcm1CaXQuU0NBTEUsXHJcbiAgICBUUlNfTUFTSyA9IH5UcmFuc2Zvcm1CaXQuVFJTLFxyXG59XHJcblxyXG5sZWdhY3lDQy5pbnRlcm5hbC5UcmFuc2Zvcm1CaXQgPSBUcmFuc2Zvcm1CaXQ7XHJcbiJdfQ==