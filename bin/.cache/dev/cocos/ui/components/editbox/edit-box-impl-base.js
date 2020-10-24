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
    global.editBoxImplBase = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.EditBoxImplBase = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /*
   Copyright (c) 2011-2012 cocos2d-x.org
   Copyright (c) 2012 James Chen
   Copyright (c) 2013-2016 Chukong Technologies Inc.
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
   * @hidden
   */
  var EditBoxImplBase = /*#__PURE__*/function () {
    function EditBoxImplBase() {
      _classCallCheck(this, EditBoxImplBase);

      this._editing = false;
      this._delegate = null;
    }

    _createClass(EditBoxImplBase, [{
      key: "init",
      value: function init(delegate) {}
    }, {
      key: "onEnable",
      value: function onEnable() {}
    }, {
      key: "update",
      value: function update() {}
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._editing) {
          this.endEditing();
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this._delegate = null;
      }
    }, {
      key: "setTabIndex",
      value: function setTabIndex(index) {}
    }, {
      key: "setSize",
      value: function setSize(width, height) {}
    }, {
      key: "setFocus",
      value: function setFocus(value) {
        if (value) {
          this.beginEditing();
        } else {
          this.endEditing();
        }
      }
    }, {
      key: "isFocused",
      value: function isFocused() {
        return this._editing;
      }
    }, {
      key: "beginEditing",
      value: function beginEditing() {}
    }, {
      key: "endEditing",
      value: function endEditing() {}
    }]);

    return EditBoxImplBase;
  }();

  _exports.EditBoxImplBase = EditBoxImplBase;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvZWRpdGJveC9lZGl0LWJveC1pbXBsLWJhc2UudHMiXSwibmFtZXMiOlsiRWRpdEJveEltcGxCYXNlIiwiX2VkaXRpbmciLCJfZGVsZWdhdGUiLCJkZWxlZ2F0ZSIsImVuZEVkaXRpbmciLCJpbmRleCIsIndpZHRoIiwiaGVpZ2h0IiwidmFsdWUiLCJiZWdpbkVkaXRpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7OztNQU1hQSxlOzs7O1dBQ0ZDLFEsR0FBVyxLO1dBQ1hDLFMsR0FBNEIsSTs7Ozs7MkJBRXRCQyxRLEVBQW1CLENBQUU7OztpQ0FFZixDQUFFOzs7K0JBRUosQ0FBRzs7O2tDQUVBO0FBQ2hCLFlBQUksS0FBS0YsUUFBVCxFQUFtQjtBQUNmLGVBQUtHLFVBQUw7QUFDSDtBQUNKOzs7OEJBRWU7QUFDWixhQUFLRixTQUFMLEdBQWlCLElBQWpCO0FBQ0g7OztrQ0FFbUJHLEssRUFBZSxDQUFFOzs7OEJBRXJCQyxLLEVBQWVDLE0sRUFBZ0IsQ0FBRTs7OytCQUVoQ0MsSyxFQUFPO0FBQ3BCLFlBQUlBLEtBQUosRUFBVztBQUNQLGVBQUtDLFlBQUw7QUFDSCxTQUZELE1BR0s7QUFDRCxlQUFLTCxVQUFMO0FBQ0g7QUFDSjs7O2tDQUVtQjtBQUNoQixlQUFPLEtBQUtILFFBQVo7QUFDSDs7O3FDQUVzQixDQUFFOzs7bUNBRUosQ0FBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTIgSmFtZXMgQ2hlblxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBFZGl0Qm94IH0gZnJvbSAnLi9lZGl0LWJveCc7XHJcblxyXG5leHBvcnQgY2xhc3MgRWRpdEJveEltcGxCYXNlIHtcclxuICAgIHB1YmxpYyBfZWRpdGluZyA9IGZhbHNlO1xyXG4gICAgcHVibGljIF9kZWxlZ2F0ZTogRWRpdEJveCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0IChkZWxlZ2F0ZTogRWRpdEJveCkge31cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUgKCkge31cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHsgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lZGl0aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRWRpdGluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VGFiSW5kZXggKGluZGV4OiBudW1iZXIpIHt9XHJcblxyXG4gICAgcHVibGljIHNldFNpemUgKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7fVxyXG5cclxuICAgIHB1YmxpYyBzZXRGb2N1cyAodmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5iZWdpbkVkaXRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRWRpdGluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNGb2N1c2VkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWRpdGluZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmVnaW5FZGl0aW5nICgpIHt9XHJcblxyXG4gICAgcHVibGljIGVuZEVkaXRpbmcgKCkge31cclxufVxyXG4iXX0=