(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.defaultConstants, global.globalExports, global.debug);
    global.bitmask = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _js, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BitMask = BitMask;
  _exports.ccbitmask = ccbitmask;

  /*
   Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.
  
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
   * @category core/value-types
   */
  function BitMask(obj) {
    if ('__bitmask__' in obj) {
      return obj;
    }

    (0, _js.value)(obj, '__bitmask__', null, true);
    var lastIndex = -1;
    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = obj[key];

      if (val === -1) {
        val = ++lastIndex;
        obj[key] = val;
      } else {
        if (typeof val === 'number') {
          lastIndex = val;
        } else if (typeof val === 'string' && Number.isInteger(parseFloat(key))) {
          continue;
        }
      }

      var reverseKey = '' + val;

      if (key !== reverseKey) {
        if ((_defaultConstants.EDITOR || _defaultConstants.TEST) && reverseKey in obj && obj[reverseKey] !== key) {
          (0, _debug.errorID)(7100, reverseKey);
          continue;
        }

        (0, _js.value)(obj, reverseKey, key);
      }
    }

    return obj;
  }

  BitMask.isBitMask = function (BitMaskType) {
    return BitMaskType && BitMaskType.hasOwnProperty('__bitmask__');
  };

  BitMask.getList = function (BitMaskDef) {
    if (BitMaskDef.__bitmask__) {
      return BitMaskDef.__bitmask__;
    }

    var bitlist = BitMaskDef.__bitmask__ = []; // tslint:disable-next-line: forin

    for (var name in BitMaskDef) {
      var v = BitMaskDef[name];

      if (Number.isInteger(v)) {
        bitlist.push({
          name: name,
          value: v
        });
      }
    }

    bitlist.sort(function (a, b) {
      return a.value - b.value;
    });
    return bitlist;
  };

  function ccbitmask(bitmaskx) {
    if ('__bitmask__' in bitmaskx) {
      return;
    }

    (0, _js.value)(bitmaskx, '__bitmask__', null, true);
  }

  _globalExports.legacyCC.BitMask = BitMask;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdmFsdWUtdHlwZXMvYml0bWFzay50cyJdLCJuYW1lcyI6WyJCaXRNYXNrIiwib2JqIiwibGFzdEluZGV4Iiwia2V5cyIsIk9iamVjdCIsImkiLCJsZW5ndGgiLCJrZXkiLCJ2YWwiLCJOdW1iZXIiLCJpc0ludGVnZXIiLCJwYXJzZUZsb2F0IiwicmV2ZXJzZUtleSIsIkVESVRPUiIsIlRFU1QiLCJpc0JpdE1hc2siLCJCaXRNYXNrVHlwZSIsImhhc093blByb3BlcnR5IiwiZ2V0TGlzdCIsIkJpdE1hc2tEZWYiLCJfX2JpdG1hc2tfXyIsImJpdGxpc3QiLCJuYW1lIiwidiIsInB1c2giLCJ2YWx1ZSIsInNvcnQiLCJhIiwiYiIsImNjYml0bWFzayIsImJpdG1hc2t4IiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7QUFTTyxXQUFTQSxPQUFULENBQXFCQyxHQUFyQixFQUFnQztBQUNuQyxRQUFJLGlCQUFpQkEsR0FBckIsRUFBMEI7QUFDdEIsYUFBT0EsR0FBUDtBQUNIOztBQUNELG1CQUFNQSxHQUFOLEVBQVcsYUFBWCxFQUEwQixJQUExQixFQUFnQyxJQUFoQztBQUVBLFFBQUlDLFNBQWlCLEdBQUcsQ0FBQyxDQUF6QjtBQUNBLFFBQU1DLElBQWMsR0FBR0MsTUFBTSxDQUFDRCxJQUFQLENBQVlGLEdBQVosQ0FBdkI7O0FBRUEsU0FBSyxJQUFJSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixJQUFJLENBQUNHLE1BQXpCLEVBQWlDRCxDQUFDLEVBQWxDLEVBQXNDO0FBQ2xDLFVBQU1FLEdBQUcsR0FBR0osSUFBSSxDQUFDRSxDQUFELENBQWhCO0FBQ0EsVUFBSUcsR0FBRyxHQUFHUCxHQUFHLENBQUNNLEdBQUQsQ0FBYjs7QUFDQSxVQUFJQyxHQUFHLEtBQUssQ0FBQyxDQUFiLEVBQWdCO0FBQ1pBLFFBQUFBLEdBQUcsR0FBRyxFQUFFTixTQUFSO0FBQ0FELFFBQUFBLEdBQUcsQ0FBQ00sR0FBRCxDQUFILEdBQVdDLEdBQVg7QUFDSCxPQUhELE1BSUs7QUFDRCxZQUFJLE9BQU9BLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUN6Qk4sVUFBQUEsU0FBUyxHQUFHTSxHQUFaO0FBQ0gsU0FGRCxNQUdLLElBQUksT0FBT0EsR0FBUCxLQUFlLFFBQWYsSUFBMkJDLE1BQU0sQ0FBQ0MsU0FBUCxDQUFpQkMsVUFBVSxDQUFDSixHQUFELENBQTNCLENBQS9CLEVBQWtFO0FBQ25FO0FBQ0g7QUFDSjs7QUFDRCxVQUFNSyxVQUFrQixHQUFHLEtBQUtKLEdBQWhDOztBQUNBLFVBQUlELEdBQUcsS0FBS0ssVUFBWixFQUF3QjtBQUNwQixZQUFJLENBQUNDLDRCQUFVQyxzQkFBWCxLQUFvQkYsVUFBVSxJQUFJWCxHQUFsQyxJQUF5Q0EsR0FBRyxDQUFDVyxVQUFELENBQUgsS0FBb0JMLEdBQWpFLEVBQXNFO0FBQ2xFLDhCQUFRLElBQVIsRUFBY0ssVUFBZDtBQUNBO0FBQ0g7O0FBQ0QsdUJBQU1YLEdBQU4sRUFBV1csVUFBWCxFQUF1QkwsR0FBdkI7QUFDSDtBQUNKOztBQUNELFdBQU9OLEdBQVA7QUFDSDs7QUFFREQsRUFBQUEsT0FBTyxDQUFDZSxTQUFSLEdBQW9CLFVBQUNDLFdBQUQsRUFBaUI7QUFDakMsV0FBT0EsV0FBVyxJQUFJQSxXQUFXLENBQUNDLGNBQVosQ0FBMkIsYUFBM0IsQ0FBdEI7QUFDSCxHQUZEOztBQUlBakIsRUFBQUEsT0FBTyxDQUFDa0IsT0FBUixHQUFrQixVQUFDQyxVQUFELEVBQWdCO0FBQzlCLFFBQUlBLFVBQVUsQ0FBQ0MsV0FBZixFQUE0QjtBQUN4QixhQUFPRCxVQUFVLENBQUNDLFdBQWxCO0FBQ0g7O0FBRUQsUUFBTUMsT0FBYyxHQUFHRixVQUFVLENBQUNDLFdBQVgsR0FBeUIsRUFBaEQsQ0FMOEIsQ0FNOUI7O0FBQ0EsU0FBSyxJQUFNRSxJQUFYLElBQW1CSCxVQUFuQixFQUErQjtBQUMzQixVQUFNSSxDQUFDLEdBQUdKLFVBQVUsQ0FBQ0csSUFBRCxDQUFwQjs7QUFDQSxVQUFJYixNQUFNLENBQUNDLFNBQVAsQ0FBaUJhLENBQWpCLENBQUosRUFBeUI7QUFDckJGLFFBQUFBLE9BQU8sQ0FBQ0csSUFBUixDQUFhO0FBQUVGLFVBQUFBLElBQUksRUFBSkEsSUFBRjtBQUFRRyxVQUFBQSxLQUFLLEVBQUVGO0FBQWYsU0FBYjtBQUNIO0FBQ0o7O0FBQ0RGLElBQUFBLE9BQU8sQ0FBQ0ssSUFBUixDQUFhLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGFBQVVELENBQUMsQ0FBQ0YsS0FBRixHQUFVRyxDQUFDLENBQUNILEtBQXRCO0FBQUEsS0FBYjtBQUNBLFdBQU9KLE9BQVA7QUFDSCxHQWZEOztBQWlCTyxXQUFTUSxTQUFULENBQW9CQyxRQUFwQixFQUE4QjtBQUNqQyxRQUFJLGlCQUFpQkEsUUFBckIsRUFBK0I7QUFDM0I7QUFDSDs7QUFDRCxtQkFBTUEsUUFBTixFQUFnQixhQUFoQixFQUErQixJQUEvQixFQUFxQyxJQUFyQztBQUNIOztBQUVEQywwQkFBUy9CLE9BQVQsR0FBbUJBLE9BQW5CIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL3ZhbHVlLXR5cGVzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgdmFsdWUgfSBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IEVESVRPUiwgVEVTVCB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBlcnJvcklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEJpdE1hc2s8VD4gKG9iajogVCk6IFQge1xyXG4gICAgaWYgKCdfX2JpdG1hc2tfXycgaW4gb2JqKSB7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIHZhbHVlKG9iaiwgJ19fYml0bWFza19fJywgbnVsbCwgdHJ1ZSk7XHJcblxyXG4gICAgbGV0IGxhc3RJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICBjb25zdCBrZXlzOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKG9iaik7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcclxuICAgICAgICBsZXQgdmFsID0gb2JqW2tleV07XHJcbiAgICAgICAgaWYgKHZhbCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdmFsID0gKytsYXN0SW5kZXg7XHJcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgTnVtYmVyLmlzSW50ZWdlcihwYXJzZUZsb2F0KGtleSkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXZlcnNlS2V5OiBzdHJpbmcgPSAnJyArIHZhbDtcclxuICAgICAgICBpZiAoa2V5ICE9PSByZXZlcnNlS2V5KSB7XHJcbiAgICAgICAgICAgIGlmICgoRURJVE9SIHx8IFRFU1QpICYmIHJldmVyc2VLZXkgaW4gb2JqICYmIG9ialtyZXZlcnNlS2V5XSAhPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDcxMDAsIHJldmVyc2VLZXkpO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWUob2JqLCByZXZlcnNlS2V5LCBrZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbkJpdE1hc2suaXNCaXRNYXNrID0gKEJpdE1hc2tUeXBlKSA9PiB7XHJcbiAgICByZXR1cm4gQml0TWFza1R5cGUgJiYgQml0TWFza1R5cGUuaGFzT3duUHJvcGVydHkoJ19fYml0bWFza19fJyk7XHJcbn07XHJcblxyXG5CaXRNYXNrLmdldExpc3QgPSAoQml0TWFza0RlZikgPT4ge1xyXG4gICAgaWYgKEJpdE1hc2tEZWYuX19iaXRtYXNrX18pIHtcclxuICAgICAgICByZXR1cm4gQml0TWFza0RlZi5fX2JpdG1hc2tfXztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBiaXRsaXN0OiBhbnlbXSA9IEJpdE1hc2tEZWYuX19iaXRtYXNrX18gPSBbXTtcclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBCaXRNYXNrRGVmKSB7XHJcbiAgICAgICAgY29uc3QgdiA9IEJpdE1hc2tEZWZbbmFtZV07XHJcbiAgICAgICAgaWYgKE51bWJlci5pc0ludGVnZXIodikpIHtcclxuICAgICAgICAgICAgYml0bGlzdC5wdXNoKHsgbmFtZSwgdmFsdWU6IHYgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYml0bGlzdC5zb3J0KChhLCBiKSA9PiBhLnZhbHVlIC0gYi52YWx1ZSk7XHJcbiAgICByZXR1cm4gYml0bGlzdDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjY2JpdG1hc2sgKGJpdG1hc2t4KSB7XHJcbiAgICBpZiAoJ19fYml0bWFza19fJyBpbiBiaXRtYXNreCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhbHVlKGJpdG1hc2t4LCAnX19iaXRtYXNrX18nLCBudWxsLCB0cnVlKTtcclxufVxyXG5cclxubGVnYWN5Q0MuQml0TWFzayA9IEJpdE1hc2s7XHJcbiJdfQ==