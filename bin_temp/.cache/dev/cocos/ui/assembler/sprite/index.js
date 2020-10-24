(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../components/index.js", "./bar-filled.js", "./radial-filled.js", "./simple.js", "./sliced.js", "./tiled.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../components/index.js"), require("./bar-filled.js"), require("./radial-filled.js"), require("./simple.js"), require("./sliced.js"), require("./tiled.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.barFilled, global.radialFilled, global.simple, global.sliced, global.tiled);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _barFilled, _radialFilled, _simple, _sliced, _tiled) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "barFilled", {
    enumerable: true,
    get: function () {
      return _barFilled.barFilled;
    }
  });
  Object.defineProperty(_exports, "radialFilled", {
    enumerable: true,
    get: function () {
      return _radialFilled.radialFilled;
    }
  });
  Object.defineProperty(_exports, "simple", {
    enumerable: true,
    get: function () {
      return _simple.simple;
    }
  });
  Object.defineProperty(_exports, "sliced", {
    enumerable: true,
    get: function () {
      return _sliced.sliced;
    }
  });
  _exports.spriteAssembler = void 0;

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
   * @hidden
   */
  var SpriteType = _index.Sprite.Type;
  var FillType = _index.Sprite.FillType; // Inline all type switch to avoid jit deoptimization during inlined function change

  var spriteAssembler = {
    getAssembler: function getAssembler(spriteComp) {
      var util = _simple.simple;
      var comp = spriteComp;

      switch (comp.type) {
        case SpriteType.SLICED:
          util = _sliced.sliced;
          break;

        case SpriteType.TILED:
          util = _tiled.tilled;
          break;

        case SpriteType.FILLED:
          if (comp.fillType === FillType.RADIAL) {
            util = _radialFilled.radialFilled;
          } else {
            util = _barFilled.barFilled;
          }

          break;
        // case SpriteType.MESH:
        //     util = meshRenderUtil;
        //     break;
      }

      return util;
    } // Skip invalid sprites (without own _assembler)
    // updateRenderData (sprite) {
    //     return sprite.__allocedDatas;
    // },

  };
  _exports.spriteAssembler = spriteAssembler;
  _index.Sprite.Assembler = spriteAssembler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9zcHJpdGUvaW5kZXgudHMiXSwibmFtZXMiOlsiU3ByaXRlVHlwZSIsIlNwcml0ZSIsIlR5cGUiLCJGaWxsVHlwZSIsInNwcml0ZUFzc2VtYmxlciIsImdldEFzc2VtYmxlciIsInNwcml0ZUNvbXAiLCJ1dGlsIiwic2ltcGxlIiwiY29tcCIsInR5cGUiLCJTTElDRUQiLCJzbGljZWQiLCJUSUxFRCIsInRpbGxlZCIsIkZJTExFRCIsImZpbGxUeXBlIiwiUkFESUFMIiwicmFkaWFsRmlsbGVkIiwiYmFyRmlsbGVkIiwiQXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7QUFhQSxNQUFNQSxVQUFVLEdBQUdDLGNBQU9DLElBQTFCO0FBQ0EsTUFBTUMsUUFBUSxHQUFHRixjQUFPRSxRQUF4QixDLENBRUE7O0FBRUEsTUFBTUMsZUFBa0MsR0FBRztBQUN2Q0MsSUFBQUEsWUFEdUMsd0JBQ3pCQyxVQUR5QixFQUNDO0FBQ3BDLFVBQUlDLElBQUksR0FBR0MsY0FBWDtBQUVBLFVBQU1DLElBQUksR0FBR0gsVUFBYjs7QUFDQSxjQUFRRyxJQUFJLENBQUNDLElBQWI7QUFDSSxhQUFLVixVQUFVLENBQUNXLE1BQWhCO0FBQ0lKLFVBQUFBLElBQUksR0FBR0ssY0FBUDtBQUNBOztBQUNKLGFBQUtaLFVBQVUsQ0FBQ2EsS0FBaEI7QUFDSU4sVUFBQUEsSUFBSSxHQUFHTyxhQUFQO0FBQ0E7O0FBQ0osYUFBS2QsVUFBVSxDQUFDZSxNQUFoQjtBQUNJLGNBQUlOLElBQUksQ0FBQ08sUUFBTCxLQUFrQmIsUUFBUSxDQUFDYyxNQUEvQixFQUF1QztBQUNuQ1YsWUFBQUEsSUFBSSxHQUFHVywwQkFBUDtBQUNILFdBRkQsTUFFTztBQUNIWCxZQUFBQSxJQUFJLEdBQUdZLG9CQUFQO0FBQ0g7O0FBQ0Q7QUFDSjtBQUNBO0FBQ0E7QUFoQko7O0FBbUJBLGFBQU9aLElBQVA7QUFDSCxLQXpCc0MsQ0EyQnZDO0FBQ0E7QUFDQTtBQUNBOztBQTlCdUMsR0FBM0M7O0FBaUNBTixnQkFBT21CLFNBQVAsR0FBbUJoQixlQUFuQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBVSVJlbmRlcmFibGUgfSBmcm9tICcuLi8uLi8uLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZS91aS1yZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgSUFzc2VtYmxlck1hbmFnZXIgfSBmcm9tICcuLi8uLi8uLi9jb3JlL3JlbmRlcmVyL3VpL2Jhc2UnO1xyXG5pbXBvcnQgeyBTcHJpdGUgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgYmFyRmlsbGVkIH0gZnJvbSAnLi9iYXItZmlsbGVkJztcclxuaW1wb3J0IHsgcmFkaWFsRmlsbGVkIH0gZnJvbSAnLi9yYWRpYWwtZmlsbGVkJztcclxuaW1wb3J0IHsgc2ltcGxlIH0gZnJvbSAnLi9zaW1wbGUnO1xyXG5pbXBvcnQgeyBzbGljZWQgfSBmcm9tICcuL3NsaWNlZCc7XHJcbmltcG9ydCB7IHRpbGxlZCB9IGZyb20gJy4vdGlsZWQnO1xyXG5cclxuY29uc3QgU3ByaXRlVHlwZSA9IFNwcml0ZS5UeXBlO1xyXG5jb25zdCBGaWxsVHlwZSA9IFNwcml0ZS5GaWxsVHlwZTtcclxuXHJcbi8vIElubGluZSBhbGwgdHlwZSBzd2l0Y2ggdG8gYXZvaWQgaml0IGRlb3B0aW1pemF0aW9uIGR1cmluZyBpbmxpbmVkIGZ1bmN0aW9uIGNoYW5nZVxyXG5cclxuY29uc3Qgc3ByaXRlQXNzZW1ibGVyOiBJQXNzZW1ibGVyTWFuYWdlciA9IHtcclxuICAgIGdldEFzc2VtYmxlciAoc3ByaXRlQ29tcDogVUlSZW5kZXJhYmxlKSB7XHJcbiAgICAgICAgbGV0IHV0aWwgPSBzaW1wbGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbXAgPSBzcHJpdGVDb21wIGFzIFNwcml0ZTtcclxuICAgICAgICBzd2l0Y2ggKGNvbXAudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIFNwcml0ZVR5cGUuU0xJQ0VEOlxyXG4gICAgICAgICAgICAgICAgdXRpbCA9IHNsaWNlZDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFNwcml0ZVR5cGUuVElMRUQ6XHJcbiAgICAgICAgICAgICAgICB1dGlsID0gdGlsbGVkO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU3ByaXRlVHlwZS5GSUxMRUQ6XHJcbiAgICAgICAgICAgICAgICBpZiAoY29tcC5maWxsVHlwZSA9PT0gRmlsbFR5cGUuUkFESUFMKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbCA9IHJhZGlhbEZpbGxlZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbCA9IGJhckZpbGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyBjYXNlIFNwcml0ZVR5cGUuTUVTSDpcclxuICAgICAgICAgICAgLy8gICAgIHV0aWwgPSBtZXNoUmVuZGVyVXRpbDtcclxuICAgICAgICAgICAgLy8gICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHV0aWw7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFNraXAgaW52YWxpZCBzcHJpdGVzICh3aXRob3V0IG93biBfYXNzZW1ibGVyKVxyXG4gICAgLy8gdXBkYXRlUmVuZGVyRGF0YSAoc3ByaXRlKSB7XHJcbiAgICAvLyAgICAgcmV0dXJuIHNwcml0ZS5fX2FsbG9jZWREYXRhcztcclxuICAgIC8vIH0sXHJcbn07XHJcblxyXG5TcHJpdGUuQXNzZW1ibGVyID0gc3ByaXRlQXNzZW1ibGVyO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIHNwcml0ZUFzc2VtYmxlcixcclxuICAgIHNpbXBsZSxcclxuICAgIHNsaWNlZCxcclxuICAgIGJhckZpbGxlZCxcclxuICAgIHJhZGlhbEZpbGxlZCxcclxufTtcclxuIl19