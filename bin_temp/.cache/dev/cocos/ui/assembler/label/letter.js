(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/utils/js.js", "../utils.js", "./bmfont.js", "./letter-font.js", "../../../core/math/color.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/utils/js.js"), require("../utils.js"), require("./bmfont.js"), require("./letter-font.js"), require("../../../core/math/color.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.utils, global.bmfont, global.letterFont, global.color);
    global.letter = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _js, _utils, _bmfont, _letterFont, _color) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.letter = void 0;

  /*
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
   https://www.cocos.com/
  
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
   * @category ui-assembler
   */
  var WHITE = new _color.Color(255, 255, 255, 255);
  /**
   * letter 组装器
   * 可通过 `UI.letter` 获取该组装器。
   */

  var letter = {
    createData: function createData(comp) {
      return comp.requestRenderData();
    },
    fillBuffers: function fillBuffers(comp, renderer) {
      if (!comp.renderData) {
        return;
      }

      var node = comp.node;
      WHITE.a = comp.color.a;
      (0, _utils.fillMeshVertices3D)(node, renderer, comp.renderData, WHITE);
    },
    appendQuad: _bmfont.bmfont.appendQuad
  };
  _exports.letter = letter;
  (0, _js.addon)(letter, _letterFont.letterFont);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9sYWJlbC9sZXR0ZXIudHMiXSwibmFtZXMiOlsiV0hJVEUiLCJDb2xvciIsImxldHRlciIsImNyZWF0ZURhdGEiLCJjb21wIiwicmVxdWVzdFJlbmRlckRhdGEiLCJmaWxsQnVmZmVycyIsInJlbmRlcmVyIiwicmVuZGVyRGF0YSIsIm5vZGUiLCJhIiwiY29sb3IiLCJhcHBlbmRRdWFkIiwiYm1mb250IiwibGV0dGVyRm9udCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O0FBWUEsTUFBTUEsS0FBSyxHQUFHLElBQUlDLFlBQUosQ0FBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixHQUFwQixFQUF5QixHQUF6QixDQUFkO0FBRUE7Ozs7O0FBSU8sTUFBTUMsTUFBTSxHQUFHO0FBQ2xCQyxJQUFBQSxVQURrQixzQkFDTkMsSUFETSxFQUNPO0FBQ3JCLGFBQU9BLElBQUksQ0FBQ0MsaUJBQUwsRUFBUDtBQUNILEtBSGlCO0FBS2xCQyxJQUFBQSxXQUxrQix1QkFLTEYsSUFMSyxFQUtRRyxRQUxSLEVBS3NCO0FBQ3BDLFVBQUksQ0FBQ0gsSUFBSSxDQUFDSSxVQUFWLEVBQXFCO0FBQ2pCO0FBQ0g7O0FBRUQsVUFBTUMsSUFBSSxHQUFHTCxJQUFJLENBQUNLLElBQWxCO0FBQ0FULE1BQUFBLEtBQUssQ0FBQ1UsQ0FBTixHQUFVTixJQUFJLENBQUNPLEtBQUwsQ0FBV0QsQ0FBckI7QUFDQSxxQ0FBbUJELElBQW5CLEVBQXlCRixRQUF6QixFQUFtQ0gsSUFBSSxDQUFDSSxVQUF4QyxFQUFvRFIsS0FBcEQ7QUFDSCxLQWJpQjtBQWVsQlksSUFBQUEsVUFBVSxFQUFFQyxlQUFPRDtBQWZELEdBQWY7O0FBa0JQLGlCQUFNVixNQUFOLEVBQWNZLHNCQUFkIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWktYXNzZW1ibGVyXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgYWRkb24gfSBmcm9tICcuLi8uLi8uLi9jb3JlL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgVUkgfSBmcm9tICcuLi8uLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpJztcclxuaW1wb3J0IHsgTGFiZWwgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2xhYmVsJztcclxuaW1wb3J0IHsgZmlsbE1lc2hWZXJ0aWNlczNEIH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBibWZvbnQgfSBmcm9tICcuL2JtZm9udCc7XHJcbmltcG9ydCB7IGxldHRlckZvbnR9IGZyb20gJy4vbGV0dGVyLWZvbnQnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC9jb2xvcic7XHJcblxyXG5jb25zdCBXSElURSA9IG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAyNTUpO1xyXG5cclxuLyoqXHJcbiAqIGxldHRlciDnu4Too4XlmahcclxuICog5Y+v6YCa6L+HIGBVSS5sZXR0ZXJgIOiOt+WPluivpee7hOijheWZqOOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGxldHRlciA9IHtcclxuICAgIGNyZWF0ZURhdGEgKGNvbXA6IExhYmVsKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbXAucmVxdWVzdFJlbmRlckRhdGEoKTtcclxuICAgIH0sXHJcblxyXG4gICAgZmlsbEJ1ZmZlcnMgKGNvbXA6IExhYmVsLCByZW5kZXJlcjogVUkpIHtcclxuICAgICAgICBpZiAoIWNvbXAucmVuZGVyRGF0YSl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5vZGUgPSBjb21wLm5vZGU7XHJcbiAgICAgICAgV0hJVEUuYSA9IGNvbXAuY29sb3IuYTtcclxuICAgICAgICBmaWxsTWVzaFZlcnRpY2VzM0Qobm9kZSwgcmVuZGVyZXIsIGNvbXAucmVuZGVyRGF0YSwgV0hJVEUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhcHBlbmRRdWFkOiBibWZvbnQuYXBwZW5kUXVhZCxcclxufTtcclxuXHJcbmFkZG9uKGxldHRlciwgbGV0dGVyRm9udCk7XHJcbiJdfQ==