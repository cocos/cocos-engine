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
    global.visibleRect = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /*
   Copyright (c) 2011-2012 cocos2d-x.org
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos2d-x.org
  
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
  
   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.
  
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

  /**
   * `visibleRect` is a singleton object which defines the actual visible rect of the current view,
   * it should represent the same rect as `view.getViewportRect()`
   */
  var visibleRect = {
    /**
     * Top left coordinate of the screen related to the game scene.
     */
    topLeft: _globalExports.legacyCC.v2(0, 0),

    /**
     * Top right coordinate of the screen related to the game scene.
     */
    topRight: _globalExports.legacyCC.v2(0, 0),

    /**
     * Top center coordinate of the screen related to the game scene.
     */
    top: _globalExports.legacyCC.v2(0, 0),

    /**
     * Bottom left coordinate of the screen related to the game scene.
     */
    bottomLeft: _globalExports.legacyCC.v2(0, 0),

    /**
     * Bottom right coordinate of the screen related to the game scene.
     */
    bottomRight: _globalExports.legacyCC.v2(0, 0),

    /**
     * Bottom center coordinate of the screen related to the game scene.
     */
    bottom: _globalExports.legacyCC.v2(0, 0),

    /**
     * Center coordinate of the screen related to the game scene.
     */
    center: _globalExports.legacyCC.v2(0, 0),

    /**
     * Left center coordinate of the screen related to the game scene.
     */
    left: _globalExports.legacyCC.v2(0, 0),

    /**
     * Right center coordinate of the screen related to the game scene.
     */
    right: _globalExports.legacyCC.v2(0, 0),

    /**
     * Width of the screen.
     */
    width: 0,

    /**
     * Height of the screen.
     */
    height: 0,

    /**
     * initialize
     */
    init: function init(visibleRect_) {
      var w = this.width = visibleRect_.width;
      var h = this.height = visibleRect_.height;
      var l = visibleRect_.x;
      var b = visibleRect_.y;
      var t = b + h;
      var r = l + w; // top

      this.topLeft.x = l;
      this.topLeft.y = t;
      this.topRight.x = r;
      this.topRight.y = t;
      this.top.x = l + w / 2;
      this.top.y = t; // bottom

      this.bottomLeft.x = l;
      this.bottomLeft.y = b;
      this.bottomRight.x = r;
      this.bottomRight.y = b;
      this.bottom.x = l + w / 2;
      this.bottom.y = b; // center

      this.center.x = l + w / 2;
      this.center.y = b + h / 2; // left

      this.left.x = l;
      this.left.y = b + h / 2; // right

      this.right.x = r;
      this.right.y = b + h / 2;
    }
  };
  _globalExports.legacyCC.visibleRect = visibleRect;
  var _default = visibleRect;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vdmlzaWJsZS1yZWN0LnRzIl0sIm5hbWVzIjpbInZpc2libGVSZWN0IiwidG9wTGVmdCIsImxlZ2FjeUNDIiwidjIiLCJ0b3BSaWdodCIsInRvcCIsImJvdHRvbUxlZnQiLCJib3R0b21SaWdodCIsImJvdHRvbSIsImNlbnRlciIsImxlZnQiLCJyaWdodCIsIndpZHRoIiwiaGVpZ2h0IiwiaW5pdCIsInZpc2libGVSZWN0XyIsInciLCJoIiwibCIsIngiLCJiIiwieSIsInQiLCJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7OztBQU9BOzs7O0FBSUEsTUFBTUEsV0FBVyxHQUFHO0FBQ2hCOzs7QUFHQUMsSUFBQUEsT0FBTyxFQUFFQyx3QkFBU0MsRUFBVCxDQUFZLENBQVosRUFBZSxDQUFmLENBSk87O0FBTWhCOzs7QUFHQUMsSUFBQUEsUUFBUSxFQUFFRix3QkFBU0MsRUFBVCxDQUFZLENBQVosRUFBZSxDQUFmLENBVE07O0FBV2hCOzs7QUFHQUUsSUFBQUEsR0FBRyxFQUFFSCx3QkFBU0MsRUFBVCxDQUFZLENBQVosRUFBZSxDQUFmLENBZFc7O0FBZ0JoQjs7O0FBR0FHLElBQUFBLFVBQVUsRUFBRUosd0JBQVNDLEVBQVQsQ0FBWSxDQUFaLEVBQWUsQ0FBZixDQW5CSTs7QUFxQmhCOzs7QUFHQUksSUFBQUEsV0FBVyxFQUFFTCx3QkFBU0MsRUFBVCxDQUFZLENBQVosRUFBZSxDQUFmLENBeEJHOztBQTBCaEI7OztBQUdBSyxJQUFBQSxNQUFNLEVBQUVOLHdCQUFTQyxFQUFULENBQVksQ0FBWixFQUFlLENBQWYsQ0E3QlE7O0FBK0JoQjs7O0FBR0FNLElBQUFBLE1BQU0sRUFBRVAsd0JBQVNDLEVBQVQsQ0FBWSxDQUFaLEVBQWUsQ0FBZixDQWxDUTs7QUFvQ2hCOzs7QUFHQU8sSUFBQUEsSUFBSSxFQUFFUix3QkFBU0MsRUFBVCxDQUFZLENBQVosRUFBZSxDQUFmLENBdkNVOztBQXlDaEI7OztBQUdBUSxJQUFBQSxLQUFLLEVBQUVULHdCQUFTQyxFQUFULENBQVksQ0FBWixFQUFlLENBQWYsQ0E1Q1M7O0FBOENoQjs7O0FBR0FTLElBQUFBLEtBQUssRUFBRSxDQWpEUzs7QUFtRGhCOzs7QUFHQUMsSUFBQUEsTUFBTSxFQUFFLENBdERROztBQXdEaEI7OztBQUdBQyxJQUFBQSxJQTNEZ0IsZ0JBMkRWQyxZQTNEVSxFQTJEVTtBQUV0QixVQUFNQyxDQUFDLEdBQUcsS0FBS0osS0FBTCxHQUFhRyxZQUFZLENBQUNILEtBQXBDO0FBQ0EsVUFBTUssQ0FBQyxHQUFHLEtBQUtKLE1BQUwsR0FBY0UsWUFBWSxDQUFDRixNQUFyQztBQUNBLFVBQU1LLENBQUMsR0FBR0gsWUFBWSxDQUFDSSxDQUF2QjtBQUNBLFVBQU1DLENBQUMsR0FBR0wsWUFBWSxDQUFDTSxDQUF2QjtBQUNBLFVBQU1DLENBQUMsR0FBR0YsQ0FBQyxHQUFHSCxDQUFkO0FBQ0EsVUFBTU0sQ0FBQyxHQUFHTCxDQUFDLEdBQUdGLENBQWQsQ0FQc0IsQ0FTdEI7O0FBQ0EsV0FBS2YsT0FBTCxDQUFha0IsQ0FBYixHQUFpQkQsQ0FBakI7QUFDQSxXQUFLakIsT0FBTCxDQUFhb0IsQ0FBYixHQUFpQkMsQ0FBakI7QUFDQSxXQUFLbEIsUUFBTCxDQUFjZSxDQUFkLEdBQWtCSSxDQUFsQjtBQUNBLFdBQUtuQixRQUFMLENBQWNpQixDQUFkLEdBQWtCQyxDQUFsQjtBQUNBLFdBQUtqQixHQUFMLENBQVNjLENBQVQsR0FBYUQsQ0FBQyxHQUFHRixDQUFDLEdBQUcsQ0FBckI7QUFDQSxXQUFLWCxHQUFMLENBQVNnQixDQUFULEdBQWFDLENBQWIsQ0Fmc0IsQ0FpQnRCOztBQUNBLFdBQUtoQixVQUFMLENBQWdCYSxDQUFoQixHQUFvQkQsQ0FBcEI7QUFDQSxXQUFLWixVQUFMLENBQWdCZSxDQUFoQixHQUFvQkQsQ0FBcEI7QUFDQSxXQUFLYixXQUFMLENBQWlCWSxDQUFqQixHQUFxQkksQ0FBckI7QUFDQSxXQUFLaEIsV0FBTCxDQUFpQmMsQ0FBakIsR0FBcUJELENBQXJCO0FBQ0EsV0FBS1osTUFBTCxDQUFZVyxDQUFaLEdBQWdCRCxDQUFDLEdBQUdGLENBQUMsR0FBRyxDQUF4QjtBQUNBLFdBQUtSLE1BQUwsQ0FBWWEsQ0FBWixHQUFnQkQsQ0FBaEIsQ0F2QnNCLENBeUJ0Qjs7QUFDQSxXQUFLWCxNQUFMLENBQVlVLENBQVosR0FBZ0JELENBQUMsR0FBR0YsQ0FBQyxHQUFHLENBQXhCO0FBQ0EsV0FBS1AsTUFBTCxDQUFZWSxDQUFaLEdBQWdCRCxDQUFDLEdBQUdILENBQUMsR0FBRyxDQUF4QixDQTNCc0IsQ0E2QnRCOztBQUNBLFdBQUtQLElBQUwsQ0FBVVMsQ0FBVixHQUFjRCxDQUFkO0FBQ0EsV0FBS1IsSUFBTCxDQUFVVyxDQUFWLEdBQWNELENBQUMsR0FBR0gsQ0FBQyxHQUFHLENBQXRCLENBL0JzQixDQWlDdEI7O0FBQ0EsV0FBS04sS0FBTCxDQUFXUSxDQUFYLEdBQWVJLENBQWY7QUFDQSxXQUFLWixLQUFMLENBQVdVLENBQVgsR0FBZUQsQ0FBQyxHQUFHSCxDQUFDLEdBQUcsQ0FBdkI7QUFDSDtBQS9GZSxHQUFwQjtBQWtHQWYsMEJBQVNGLFdBQVQsR0FBdUJBLFdBQXZCO2lCQUNlQSxXIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMS0yMDEyIGNvY29zMmQteC5vcmdcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFJlY3QgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogYHZpc2libGVSZWN0YCBpcyBhIHNpbmdsZXRvbiBvYmplY3Qgd2hpY2ggZGVmaW5lcyB0aGUgYWN0dWFsIHZpc2libGUgcmVjdCBvZiB0aGUgY3VycmVudCB2aWV3LFxyXG4gKiBpdCBzaG91bGQgcmVwcmVzZW50IHRoZSBzYW1lIHJlY3QgYXMgYHZpZXcuZ2V0Vmlld3BvcnRSZWN0KClgXHJcbiAqL1xyXG5jb25zdCB2aXNpYmxlUmVjdCA9IHtcclxuICAgIC8qKlxyXG4gICAgICogVG9wIGxlZnQgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIHRvcExlZnQ6IGxlZ2FjeUNDLnYyKDAsIDApLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVG9wIHJpZ2h0IGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICB0b3BSaWdodDogbGVnYWN5Q0MudjIoMCwgMCksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUb3AgY2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICB0b3A6IGxlZ2FjeUNDLnYyKDAsIDApLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQm90dG9tIGxlZnQgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGJvdHRvbUxlZnQ6IGxlZ2FjeUNDLnYyKDAsIDApLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQm90dG9tIHJpZ2h0IGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBib3R0b21SaWdodDogbGVnYWN5Q0MudjIoMCwgMCksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCb3R0b20gY2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBib3R0b206IGxlZ2FjeUNDLnYyKDAsIDApLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICBjZW50ZXI6IGxlZ2FjeUNDLnYyKDAsIDApLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGVmdCBjZW50ZXIgY29vcmRpbmF0ZSBvZiB0aGUgc2NyZWVuIHJlbGF0ZWQgdG8gdGhlIGdhbWUgc2NlbmUuXHJcbiAgICAgKi9cclxuICAgIGxlZnQ6IGxlZ2FjeUNDLnYyKDAsIDApLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmlnaHQgY2VudGVyIGNvb3JkaW5hdGUgb2YgdGhlIHNjcmVlbiByZWxhdGVkIHRvIHRoZSBnYW1lIHNjZW5lLlxyXG4gICAgICovXHJcbiAgICByaWdodDogbGVnYWN5Q0MudjIoMCwgMCksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaWR0aCBvZiB0aGUgc2NyZWVuLlxyXG4gICAgICovXHJcbiAgICB3aWR0aDogMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEhlaWdodCBvZiB0aGUgc2NyZWVuLlxyXG4gICAgICovXHJcbiAgICBoZWlnaHQ6IDAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpbml0aWFsaXplXHJcbiAgICAgKi9cclxuICAgIGluaXQgKHZpc2libGVSZWN0XzogUmVjdCkge1xyXG5cclxuICAgICAgICBjb25zdCB3ID0gdGhpcy53aWR0aCA9IHZpc2libGVSZWN0Xy53aWR0aDtcclxuICAgICAgICBjb25zdCBoID0gdGhpcy5oZWlnaHQgPSB2aXNpYmxlUmVjdF8uaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGwgPSB2aXNpYmxlUmVjdF8ueDtcclxuICAgICAgICBjb25zdCBiID0gdmlzaWJsZVJlY3RfLnk7XHJcbiAgICAgICAgY29uc3QgdCA9IGIgKyBoO1xyXG4gICAgICAgIGNvbnN0IHIgPSBsICsgdztcclxuXHJcbiAgICAgICAgLy8gdG9wXHJcbiAgICAgICAgdGhpcy50b3BMZWZ0LnggPSBsO1xyXG4gICAgICAgIHRoaXMudG9wTGVmdC55ID0gdDtcclxuICAgICAgICB0aGlzLnRvcFJpZ2h0LnggPSByO1xyXG4gICAgICAgIHRoaXMudG9wUmlnaHQueSA9IHQ7XHJcbiAgICAgICAgdGhpcy50b3AueCA9IGwgKyB3IC8gMjtcclxuICAgICAgICB0aGlzLnRvcC55ID0gdDtcclxuXHJcbiAgICAgICAgLy8gYm90dG9tXHJcbiAgICAgICAgdGhpcy5ib3R0b21MZWZ0LnggPSBsO1xyXG4gICAgICAgIHRoaXMuYm90dG9tTGVmdC55ID0gYjtcclxuICAgICAgICB0aGlzLmJvdHRvbVJpZ2h0LnggPSByO1xyXG4gICAgICAgIHRoaXMuYm90dG9tUmlnaHQueSA9IGI7XHJcbiAgICAgICAgdGhpcy5ib3R0b20ueCA9IGwgKyB3IC8gMjtcclxuICAgICAgICB0aGlzLmJvdHRvbS55ID0gYjtcclxuXHJcbiAgICAgICAgLy8gY2VudGVyXHJcbiAgICAgICAgdGhpcy5jZW50ZXIueCA9IGwgKyB3IC8gMjtcclxuICAgICAgICB0aGlzLmNlbnRlci55ID0gYiArIGggLyAyO1xyXG5cclxuICAgICAgICAvLyBsZWZ0XHJcbiAgICAgICAgdGhpcy5sZWZ0LnggPSBsO1xyXG4gICAgICAgIHRoaXMubGVmdC55ID0gYiArIGggLyAyO1xyXG5cclxuICAgICAgICAvLyByaWdodFxyXG4gICAgICAgIHRoaXMucmlnaHQueCA9IHI7XHJcbiAgICAgICAgdGhpcy5yaWdodC55ID0gYiArIGggLyAyO1xyXG4gICAgfSxcclxufTtcclxuXHJcbmxlZ2FjeUNDLnZpc2libGVSZWN0ID0gdmlzaWJsZVJlY3Q7XHJcbmV4cG9ydCBkZWZhdWx0IHZpc2libGVSZWN0O1xyXG4iXX0=