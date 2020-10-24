(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.mutableForwardIterator = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
   * @class js.array.MutableForwardIterator
   * @example
   * ```
   * import { js } from 'cc';
   * var array = [0, 1, 2, 3, 4];
   * var iterator = new js.array.MutableForwardIterator(array);
   * for (iterator.i = 0; iterator.i < array.length; ++iterator.i) {
   *     var item = array[iterator.i];
   *     ...
   * }
   * ```
   */
  var MutableForwardIterator = /*#__PURE__*/function () {
    function MutableForwardIterator(array) {
      _classCallCheck(this, MutableForwardIterator);

      this.i = 0;
      this.array = array;
    }

    _createClass(MutableForwardIterator, [{
      key: "remove",
      value: function remove(value) {
        var index = this.array.indexOf(value);

        if (index >= 0) {
          this.removeAt(index);
        }
      }
    }, {
      key: "removeAt",
      value: function removeAt(i) {
        this.array.splice(i, 1);

        if (i <= this.i) {
          --this.i;
        }
      }
    }, {
      key: "fastRemove",
      value: function fastRemove(value) {
        var index = this.array.indexOf(value);

        if (index >= 0) {
          this.fastRemoveAt(index);
        }
      }
    }, {
      key: "fastRemoveAt",
      value: function fastRemoveAt(i) {
        var array = this.array;
        array[i] = array[array.length - 1];
        --array.length;

        if (i <= this.i) {
          --this.i;
        }
      }
    }, {
      key: "push",
      value: function push(item) {
        this.array.push(item);
      }
    }, {
      key: "length",
      get: function get() {
        return this.array.length;
      },
      set: function set(value) {
        this.array.length = value;

        if (this.i >= value) {
          this.i = value - 1;
        }
      }
    }]);

    return MutableForwardIterator;
  }();

  _exports.default = MutableForwardIterator;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvbXV0YWJsZS1mb3J3YXJkLWl0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbIk11dGFibGVGb3J3YXJkSXRlcmF0b3IiLCJhcnJheSIsImkiLCJ2YWx1ZSIsImluZGV4IiwiaW5kZXhPZiIsInJlbW92ZUF0Iiwic3BsaWNlIiwiZmFzdFJlbW92ZUF0IiwibGVuZ3RoIiwiaXRlbSIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7Ozs7Ozs7Ozs7O01BYXFCQSxzQjtBQUdqQixvQ0FBb0JDLEtBQXBCLEVBQWdDO0FBQUE7O0FBQUEsV0FGekJDLENBRXlCLEdBRnJCLENBRXFCO0FBQUEsV0FBWkQsS0FBWSxHQUFaQSxLQUFZO0FBQy9COzs7OzZCQWFjRSxLLEVBQVU7QUFDckIsWUFBTUMsS0FBSyxHQUFHLEtBQUtILEtBQUwsQ0FBV0ksT0FBWCxDQUFtQkYsS0FBbkIsQ0FBZDs7QUFDQSxZQUFJQyxLQUFLLElBQUksQ0FBYixFQUFnQjtBQUNaLGVBQUtFLFFBQUwsQ0FBY0YsS0FBZDtBQUNIO0FBQ0o7OzsrQkFFZ0JGLEMsRUFBVztBQUN4QixhQUFLRCxLQUFMLENBQVdNLE1BQVgsQ0FBa0JMLENBQWxCLEVBQXFCLENBQXJCOztBQUVBLFlBQUlBLENBQUMsSUFBSSxLQUFLQSxDQUFkLEVBQWlCO0FBQ2IsWUFBRSxLQUFLQSxDQUFQO0FBQ0g7QUFDSjs7O2lDQUVrQkMsSyxFQUFVO0FBQ3pCLFlBQU1DLEtBQUssR0FBRyxLQUFLSCxLQUFMLENBQVdJLE9BQVgsQ0FBbUJGLEtBQW5CLENBQWQ7O0FBQ0EsWUFBSUMsS0FBSyxJQUFJLENBQWIsRUFBZ0I7QUFDWixlQUFLSSxZQUFMLENBQWtCSixLQUFsQjtBQUNIO0FBQ0o7OzttQ0FFb0JGLEMsRUFBVztBQUM1QixZQUFNRCxLQUFLLEdBQUcsS0FBS0EsS0FBbkI7QUFDQUEsUUFBQUEsS0FBSyxDQUFDQyxDQUFELENBQUwsR0FBV0QsS0FBSyxDQUFDQSxLQUFLLENBQUNRLE1BQU4sR0FBZSxDQUFoQixDQUFoQjtBQUNBLFVBQUVSLEtBQUssQ0FBQ1EsTUFBUjs7QUFFQSxZQUFJUCxDQUFDLElBQUksS0FBS0EsQ0FBZCxFQUFpQjtBQUNiLFlBQUUsS0FBS0EsQ0FBUDtBQUNIO0FBQ0o7OzsyQkFFWVEsSSxFQUFTO0FBQ2xCLGFBQUtULEtBQUwsQ0FBV1UsSUFBWCxDQUFnQkQsSUFBaEI7QUFDSDs7OzBCQTdDYTtBQUNWLGVBQU8sS0FBS1QsS0FBTCxDQUFXUSxNQUFsQjtBQUNILE87d0JBRVdOLEssRUFBZTtBQUN2QixhQUFLRixLQUFMLENBQVdRLE1BQVgsR0FBb0JOLEtBQXBCOztBQUNBLFlBQUksS0FBS0QsQ0FBTCxJQUFVQyxLQUFkLEVBQXFCO0FBQ2pCLGVBQUtELENBQUwsR0FBU0MsS0FBSyxHQUFHLENBQWpCO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBqcy5hcnJheS5NdXRhYmxlRm9yd2FyZEl0ZXJhdG9yXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYFxyXG4gKiBpbXBvcnQgeyBqcyB9IGZyb20gJ2NjJztcclxuICogdmFyIGFycmF5ID0gWzAsIDEsIDIsIDMsIDRdO1xyXG4gKiB2YXIgaXRlcmF0b3IgPSBuZXcganMuYXJyYXkuTXV0YWJsZUZvcndhcmRJdGVyYXRvcihhcnJheSk7XHJcbiAqIGZvciAoaXRlcmF0b3IuaSA9IDA7IGl0ZXJhdG9yLmkgPCBhcnJheS5sZW5ndGg7ICsraXRlcmF0b3IuaSkge1xyXG4gKiAgICAgdmFyIGl0ZW0gPSBhcnJheVtpdGVyYXRvci5pXTtcclxuICogICAgIC4uLlxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXV0YWJsZUZvcndhcmRJdGVyYXRvcjxUPiB7XHJcbiAgICBwdWJsaWMgaSA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHB1YmxpYyBhcnJheTogVFtdKSB7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxlbmd0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBsZW5ndGggKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFycmF5Lmxlbmd0aCA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmkgPj0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5pID0gdmFsdWUgLSAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlICh2YWx1ZTogVCkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hcnJheS5pbmRleE9mKHZhbHVlKTtcclxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0KGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUF0IChpOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmFycmF5LnNwbGljZShpLCAxKTtcclxuXHJcbiAgICAgICAgaWYgKGkgPD0gdGhpcy5pKSB7XHJcbiAgICAgICAgICAgIC0tdGhpcy5pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmFzdFJlbW92ZSAodmFsdWU6IFQpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYXJyYXkuaW5kZXhPZih2YWx1ZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5mYXN0UmVtb3ZlQXQoaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmFzdFJlbW92ZUF0IChpOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuYXJyYXk7XHJcbiAgICAgICAgYXJyYXlbaV0gPSBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcclxuICAgICAgICAtLWFycmF5Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKGkgPD0gdGhpcy5pKSB7XHJcbiAgICAgICAgICAgIC0tdGhpcy5pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcHVzaCAoaXRlbTogVCkge1xyXG4gICAgICAgIHRoaXMuYXJyYXkucHVzaChpdGVtKTtcclxuICAgIH1cclxufVxyXG4iXX0=