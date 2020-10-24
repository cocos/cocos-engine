(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/assets/index.js", "../../components/index.js", "./bmfont.js", "./font-utils.js", "./letter.js", "./ttf.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/assets/index.js"), require("../../components/index.js"), require("./bmfont.js"), require("./font-utils.js"), require("./letter.js"), require("./ttf.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.bmfont, global.fontUtils, global.letter, global.ttf);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _bmfont, _fontUtils, _letter, _ttf) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "bmfont", {
    enumerable: true,
    get: function () {
      return _bmfont.bmfont;
    }
  });
  Object.defineProperty(_exports, "CanvasPool", {
    enumerable: true,
    get: function () {
      return _fontUtils.CanvasPool;
    }
  });
  Object.defineProperty(_exports, "letter", {
    enumerable: true,
    get: function () {
      return _letter.letter;
    }
  });
  Object.defineProperty(_exports, "ttf", {
    enumerable: true,
    get: function () {
      return _ttf.ttf;
    }
  });
  _exports.labelAssembler = void 0;

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
   * @category ui-assembler
   */
  var labelAssembler = {
    getAssembler: function getAssembler(comp) {
      var assembler = _ttf.ttf;

      if (comp.font instanceof _index.BitmapFont) {
        assembler = _bmfont.bmfont;
      } else if (comp.cacheMode === _index2.Label.CacheMode.CHAR) {
        assembler = _letter.letter;
      }

      return assembler;
    } // Skip invalid labels (without own _assembler)
    // updateRenderData(label) {
    //     return label.__allocedDatas;
    // }

  };
  _exports.labelAssembler = labelAssembler;
  _index2.Label.Assembler = labelAssembler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9sYWJlbC9pbmRleC50cyJdLCJuYW1lcyI6WyJsYWJlbEFzc2VtYmxlciIsImdldEFzc2VtYmxlciIsImNvbXAiLCJhc3NlbWJsZXIiLCJ0dGYiLCJmb250IiwiQml0bWFwRm9udCIsImJtZm9udCIsImNhY2hlTW9kZSIsIkxhYmVsIiwiQ2FjaGVNb2RlIiwiQ0hBUiIsImxldHRlciIsIkFzc2VtYmxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O0FBWUEsTUFBTUEsY0FBaUMsR0FBRztBQUN0Q0MsSUFBQUEsWUFEc0Msd0JBQ3hCQyxJQUR3QixFQUNYO0FBQ3ZCLFVBQUlDLFNBQVMsR0FBR0MsUUFBaEI7O0FBRUEsVUFBSUYsSUFBSSxDQUFDRyxJQUFMLFlBQXFCQyxpQkFBekIsRUFBcUM7QUFDakNILFFBQUFBLFNBQVMsR0FBR0ksY0FBWjtBQUNILE9BRkQsTUFFTSxJQUFJTCxJQUFJLENBQUNNLFNBQUwsS0FBbUJDLGNBQU1DLFNBQU4sQ0FBZ0JDLElBQXZDLEVBQTRDO0FBQzlDUixRQUFBQSxTQUFTLEdBQUdTLGNBQVo7QUFDSDs7QUFFRCxhQUFPVCxTQUFQO0FBQ0gsS0FYcUMsQ0FhdEM7QUFDQTtBQUNBO0FBQ0E7O0FBaEJzQyxHQUExQzs7QUEyQkFNLGdCQUFNSSxTQUFOLEdBQWtCYixjQUFsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aS1hc3NlbWJsZXJcclxuICovXHJcblxyXG5pbXBvcnQgeyBCaXRtYXBGb250IH0gZnJvbSAnLi4vLi4vLi4vY29yZS9hc3NldHMnO1xyXG5pbXBvcnQgeyBMYWJlbCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgeyBJQXNzZW1ibGVyTWFuYWdlciB9IGZyb20gJy4uLy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvYmFzZSc7XHJcbmltcG9ydCB7IGJtZm9udCB9IGZyb20gJy4vYm1mb250JztcclxuaW1wb3J0IHsgQ2FudmFzUG9vbCB9IGZyb20gJy4vZm9udC11dGlscyc7XHJcbmltcG9ydCB7IGxldHRlciB9IGZyb20gJy4vbGV0dGVyJztcclxuaW1wb3J0IHsgdHRmIH0gZnJvbSAnLi90dGYnO1xyXG5cclxuY29uc3QgbGFiZWxBc3NlbWJsZXI6IElBc3NlbWJsZXJNYW5hZ2VyID0ge1xyXG4gICAgZ2V0QXNzZW1ibGVyIChjb21wOiBMYWJlbCkge1xyXG4gICAgICAgIGxldCBhc3NlbWJsZXIgPSB0dGY7XHJcblxyXG4gICAgICAgIGlmIChjb21wLmZvbnQgaW5zdGFuY2VvZiBCaXRtYXBGb250KSB7XHJcbiAgICAgICAgICAgIGFzc2VtYmxlciA9IGJtZm9udDtcclxuICAgICAgICB9ZWxzZSBpZiAoY29tcC5jYWNoZU1vZGUgPT09IExhYmVsLkNhY2hlTW9kZS5DSEFSKXtcclxuICAgICAgICAgICAgYXNzZW1ibGVyID0gbGV0dGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFzc2VtYmxlcjtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gU2tpcCBpbnZhbGlkIGxhYmVscyAod2l0aG91dCBvd24gX2Fzc2VtYmxlcilcclxuICAgIC8vIHVwZGF0ZVJlbmRlckRhdGEobGFiZWwpIHtcclxuICAgIC8vICAgICByZXR1cm4gbGFiZWwuX19hbGxvY2VkRGF0YXM7XHJcbiAgICAvLyB9XHJcbn07XHJcblxyXG5leHBvcnQge1xyXG4gICAgbGFiZWxBc3NlbWJsZXIsXHJcbiAgICB0dGYsXHJcbiAgICBibWZvbnQsXHJcbiAgICBsZXR0ZXIsXHJcbiAgICBDYW52YXNQb29sLFxyXG59O1xyXG5cclxuTGFiZWwuQXNzZW1ibGVyID0gbGFiZWxBc3NlbWJsZXI7XHJcbiJdfQ==