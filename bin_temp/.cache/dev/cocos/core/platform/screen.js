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
    global.screen = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.screen = void 0;

  /*
   Copyright (c) 2008-2010 Ricardo Quesada
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
   * @category core
   */

  /**
   * @en The screen API provides an easy way for web content to be presented using the user's entire screen.
   * It's designed for web platforms and some mobile browsers don't provide such behavior, e.g. Safari
   * @zh screen 单例对象提供简单的方法来尝试让 Web 内容进入全屏模式。这是 Web 平台特有的行为，在部分浏览器上并不支持这样的功能。
   */
  var screen = {
    _supportsFullScreen: false,
    _onfullscreenchange: null,
    _onfullscreenerror: null,
    // the pre fullscreenchange function
    _preOnFullScreenError: null,
    _preOnTouch: null,
    _touchEvent: '',
    _fn: null,
    // Function mapping for cross browser support
    _fnMap: [['requestFullscreen', 'exitFullscreen', 'fullscreenchange', 'fullscreenEnabled', 'fullscreenElement'], ['requestFullScreen', 'exitFullScreen', 'fullScreenchange', 'fullScreenEnabled', 'fullScreenElement'], ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitIsFullScreen', 'webkitCurrentFullScreenElement'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozfullscreenchange', 'mozFullScreen', 'mozFullScreenElement'], ['msRequestFullscreen', 'msExitFullscreen', 'MSFullscreenChange', 'msFullscreenEnabled', 'msFullscreenElement']],

    /**
     * @en Initialization
     * @zh 初始化函数
     */
    init: function init() {
      this._fn = {};
      var i,
          l,
          val,
          map = this._fnMap,
          valL;

      for (i = 0, l = map.length; i < l; i++) {
        val = map[i];

        if (val && typeof document[val[1]] !== 'undefined') {
          for (i = 0, valL = val.length; i < valL; i++) {
            this._fn[map[0][i]] = val[i];
          }

          break;
        }
      }

      this._supportsFullScreen = this._fn.requestFullscreen !== undefined;
      this._touchEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
    },

    /**
     * @en Whether it supports full screen？
     * @zh 是否支持全屏？
     * @returns {Boolean}
     */
    get supportsFullScreen() {
      return this._supportsFullScreen;
    },

    /**
     * @en Return true if it's in full screen state now.
     * @zh 当前是否处在全屏状态下
     * @returns {Boolean}
     */
    fullScreen: function fullScreen() {
      if (!this._supportsFullScreen) {
        return false;
      } else if (document[this._fn.fullscreenElement] === undefined || document[this._fn.fullscreenElement] === null) {
        return false;
      } else {
        return true;
      }
    },

    /**
     * @en Request to enter full screen mode with the given element.
     * Many browser forbid to enter full screen mode without an user intended interaction.
     * For simplify the process, you can try to use {{autoFullScreen}} which will try to enter full screen mode during the next user touch event.
     * @zh 尝试使当前节点进入全屏模式，很多浏览器不允许程序触发这样的行为，必须在一个用户交互回调中才会生效。
     * 如果希望更简单一些，可以尝试用 {{autoFullScreen}} 来自动监听用户触摸事件并在下一次触摸事件中尝试进入全屏模式。
     * @param element The element to request full screen state
     * @param onFullScreenChange callback function when full screen state changed
     * @param onFullScreenError callback function when full screen error
     * @return {Promise|undefined}
     */
    requestFullScreen: function requestFullScreen(element, onFullScreenChange, onFullScreenError) {
      if (!this._supportsFullScreen) {
        return;
      }

      element = element || document.documentElement;

      if (onFullScreenChange) {
        var eventName = this._fn.fullscreenchange;

        if (this._onfullscreenchange) {
          document.removeEventListener(eventName, this._onfullscreenchange);
        }

        this._onfullscreenchange = onFullScreenChange;
        document.addEventListener(eventName, onFullScreenChange, false);
      }

      if (onFullScreenError) {
        var _eventName = this._fn.fullscreenerror;

        if (this._onfullscreenerror) {
          document.removeEventListener(_eventName, this._onfullscreenerror);
        }

        this._onfullscreenerror = onFullScreenError;
        document.addEventListener(_eventName, onFullScreenError, {
          once: true
        });
      }

      var requestPromise = element[this._fn.requestFullscreen](); // the requestFullscreen API can only be initiated by user gesture.


      if (window.Promise && requestPromise instanceof Promise) {
        requestPromise["catch"](function (err) {// do nothing ...
        });
      }

      return requestPromise;
    },

    /**
     * @en Exit the full mode.
     * @zh 退出全屏模式
     * @return {Promise|undefined}
     */
    exitFullScreen: function exitFullScreen() {
      var requestPromise;

      if (this.fullScreen()) {
        requestPromise = document[this._fn.exitFullscreen]();
        requestPromise["catch"](function (err) {// do nothing ...
        });
      }

      return requestPromise;
    },

    /**
     * @en Automatically request full screen during the next touch/click event
     * @zh 自动监听触摸、鼠标事件并在下一次事件触发时尝试进入全屏模式
     * @param element The element to request full screen state
     * @param onFullScreenChange callback function when full screen state changed
     */
    autoFullScreen: function autoFullScreen(element, onFullScreenChange) {
      element = element || document.body;

      this._ensureFullScreen(element, onFullScreenChange);

      this.requestFullScreen(element, onFullScreenChange);
    },
    disableAutoFullScreen: function disableAutoFullScreen(element) {
      if (this._preOnTouch) {
        var touchTarget = _globalExports.legacyCC.game.canvas || element;
        var touchEventName = this._touchEvent;
        touchTarget.removeEventListener(touchEventName, this._preOnTouch);
        this._preOnTouch = null;
      }
    },
    // Register touch event if request full screen failed
    _ensureFullScreen: function _ensureFullScreen(element, onFullScreenChange) {
      var _this = this;

      var touchTarget = _globalExports.legacyCC.game.canvas || element;
      var fullScreenErrorEventName = this._fn.fullscreenerror;
      var touchEventName = this._touchEvent;

      var onFullScreenError = function onFullScreenError() {
        _this._preOnFullScreenError = null; // handle touch event listener

        var onTouch = function onTouch() {
          _this._preOnTouch = null;

          _this.requestFullScreen(element, onFullScreenChange);
        };

        if (_this._preOnTouch) {
          touchTarget.removeEventListener(touchEventName, _this._preOnTouch);
        }

        _this._preOnTouch = onTouch;
        touchTarget.addEventListener(touchEventName, _this._preOnTouch, {
          once: true
        });
      }; // handle full screen error


      if (this._preOnFullScreenError) {
        element.removeEventListener(fullScreenErrorEventName, this._preOnFullScreenError);
      }

      this._preOnFullScreenError = onFullScreenError;
      element.addEventListener(fullScreenErrorEventName, onFullScreenError, {
        once: true
      });
    }
  };
  _exports.screen = screen;
  screen.init();
  _globalExports.legacyCC.screen = screen;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vc2NyZWVuLnRzIl0sIm5hbWVzIjpbInNjcmVlbiIsIl9zdXBwb3J0c0Z1bGxTY3JlZW4iLCJfb25mdWxsc2NyZWVuY2hhbmdlIiwiX29uZnVsbHNjcmVlbmVycm9yIiwiX3ByZU9uRnVsbFNjcmVlbkVycm9yIiwiX3ByZU9uVG91Y2giLCJfdG91Y2hFdmVudCIsIl9mbiIsIl9mbk1hcCIsImluaXQiLCJpIiwibCIsInZhbCIsIm1hcCIsInZhbEwiLCJsZW5ndGgiLCJkb2N1bWVudCIsInJlcXVlc3RGdWxsc2NyZWVuIiwidW5kZWZpbmVkIiwid2luZG93Iiwic3VwcG9ydHNGdWxsU2NyZWVuIiwiZnVsbFNjcmVlbiIsImZ1bGxzY3JlZW5FbGVtZW50IiwicmVxdWVzdEZ1bGxTY3JlZW4iLCJlbGVtZW50Iiwib25GdWxsU2NyZWVuQ2hhbmdlIiwib25GdWxsU2NyZWVuRXJyb3IiLCJkb2N1bWVudEVsZW1lbnQiLCJldmVudE5hbWUiLCJmdWxsc2NyZWVuY2hhbmdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJmdWxsc2NyZWVuZXJyb3IiLCJvbmNlIiwicmVxdWVzdFByb21pc2UiLCJQcm9taXNlIiwiZXJyIiwiZXhpdEZ1bGxTY3JlZW4iLCJleGl0RnVsbHNjcmVlbiIsImF1dG9GdWxsU2NyZWVuIiwiYm9keSIsIl9lbnN1cmVGdWxsU2NyZWVuIiwiZGlzYWJsZUF1dG9GdWxsU2NyZWVuIiwidG91Y2hUYXJnZXQiLCJsZWdhY3lDQyIsImdhbWUiLCJjYW52YXMiLCJ0b3VjaEV2ZW50TmFtZSIsImZ1bGxTY3JlZW5FcnJvckV2ZW50TmFtZSIsIm9uVG91Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7OztBQU1BOzs7OztBQUtBLE1BQU1BLE1BQU0sR0FB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MjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuIFRoZSBzY3JlZW4gQVBJIHByb3ZpZGVzIGFuIGVhc3kgd2F5IGZvciB3ZWIgY29udGVudCB0byBiZSBwcmVzZW50ZWQgdXNpbmcgdGhlIHVzZXIncyBlbnRpcmUgc2NyZWVuLlxyXG4gKiBJdCdzIGRlc2lnbmVkIGZvciB3ZWIgcGxhdGZvcm1zIGFuZCBzb21lIG1vYmlsZSBicm93c2VycyBkb24ndCBwcm92aWRlIHN1Y2ggYmVoYXZpb3IsIGUuZy4gU2FmYXJpXHJcbiAqIEB6aCBzY3JlZW4g5Y2V5L6L5a+56LGh5o+Q5L6b566A5Y2V55qE5pa55rOV5p2l5bCd6K+V6K6pIFdlYiDlhoXlrrnov5vlhaXlhajlsY/mqKHlvI/jgILov5nmmK8gV2ViIOW5s+WPsOeJueacieeahOihjOS4uu+8jOWcqOmDqOWIhua1j+iniOWZqOS4iuW5tuS4jeaUr+aMgei/meagt+eahOWKn+iDveOAglxyXG4gKi9cclxuY29uc3Qgc2NyZWVuID0ge1xyXG4gICAgX3N1cHBvcnRzRnVsbFNjcmVlbjogZmFsc2UsXHJcbiAgICBfb25mdWxsc2NyZWVuY2hhbmdlOiBudWxsIGFzIGFueSxcclxuICAgIF9vbmZ1bGxzY3JlZW5lcnJvcjogbnVsbCBhcyBhbnksXHJcbiAgICAvLyB0aGUgcHJlIGZ1bGxzY3JlZW5jaGFuZ2UgZnVuY3Rpb25cclxuICAgIF9wcmVPbkZ1bGxTY3JlZW5FcnJvcjogbnVsbCBhcyBhbnksXHJcbiAgICBfcHJlT25Ub3VjaDogbnVsbCBhcyBhbnksXHJcbiAgICBfdG91Y2hFdmVudDogJycsXHJcbiAgICBfZm46IG51bGwgYXMgYW55LFxyXG4gICAgLy8gRnVuY3Rpb24gbWFwcGluZyBmb3IgY3Jvc3MgYnJvd3NlciBzdXBwb3J0XHJcbiAgICBfZm5NYXA6IFtcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgICdyZXF1ZXN0RnVsbHNjcmVlbicsXHJcbiAgICAgICAgICAgICdleGl0RnVsbHNjcmVlbicsXHJcbiAgICAgICAgICAgICdmdWxsc2NyZWVuY2hhbmdlJyxcclxuICAgICAgICAgICAgJ2Z1bGxzY3JlZW5FbmFibGVkJyxcclxuICAgICAgICAgICAgJ2Z1bGxzY3JlZW5FbGVtZW50JyxcclxuICAgICAgICBdLFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgJ3JlcXVlc3RGdWxsU2NyZWVuJyxcclxuICAgICAgICAgICAgJ2V4aXRGdWxsU2NyZWVuJyxcclxuICAgICAgICAgICAgJ2Z1bGxTY3JlZW5jaGFuZ2UnLFxyXG4gICAgICAgICAgICAnZnVsbFNjcmVlbkVuYWJsZWQnLFxyXG4gICAgICAgICAgICAnZnVsbFNjcmVlbkVsZW1lbnQnLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAnd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4nLFxyXG4gICAgICAgICAgICAnd2Via2l0Q2FuY2VsRnVsbFNjcmVlbicsXHJcbiAgICAgICAgICAgICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJyxcclxuICAgICAgICAgICAgJ3dlYmtpdElzRnVsbFNjcmVlbicsXHJcbiAgICAgICAgICAgICd3ZWJraXRDdXJyZW50RnVsbFNjcmVlbkVsZW1lbnQnLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAnbW96UmVxdWVzdEZ1bGxTY3JlZW4nLFxyXG4gICAgICAgICAgICAnbW96Q2FuY2VsRnVsbFNjcmVlbicsXHJcbiAgICAgICAgICAgICdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcclxuICAgICAgICAgICAgJ21vekZ1bGxTY3JlZW4nLFxyXG4gICAgICAgICAgICAnbW96RnVsbFNjcmVlbkVsZW1lbnQnLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICAnbXNSZXF1ZXN0RnVsbHNjcmVlbicsXHJcbiAgICAgICAgICAgICdtc0V4aXRGdWxsc2NyZWVuJyxcclxuICAgICAgICAgICAgJ01TRnVsbHNjcmVlbkNoYW5nZScsXHJcbiAgICAgICAgICAgICdtc0Z1bGxzY3JlZW5FbmFibGVkJyxcclxuICAgICAgICAgICAgJ21zRnVsbHNjcmVlbkVsZW1lbnQnLFxyXG4gICAgICAgIF1cclxuICAgIF0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5pdGlhbGl6YXRpb25cclxuICAgICAqIEB6aCDliJ3lp4vljJblh73mlbBcclxuICAgICAqL1xyXG4gICAgaW5pdCAoKSB7XHJcbiAgICAgICAgdGhpcy5fZm4gPSB7fTtcclxuICAgICAgICBsZXQgaSwgbCwgdmFsLCBtYXAgPSB0aGlzLl9mbk1hcCwgdmFsTDtcclxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gbWFwLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICB2YWwgPSBtYXBbaV07XHJcbiAgICAgICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiBkb2N1bWVudFt2YWxbMV1dICE9PSAndW5kZWZpbmVkJykpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIHZhbEwgPSB2YWwubGVuZ3RoOyBpIDwgdmFsTDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm5bbWFwWzBdW2ldXSA9IHZhbFtpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zdXBwb3J0c0Z1bGxTY3JlZW4gPSAodGhpcy5fZm4ucmVxdWVzdEZ1bGxzY3JlZW4gIT09IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hFdmVudCA9ICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpID8gJ3RvdWNoc3RhcnQnIDogJ21vdXNlZG93bic7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgaXQgc3VwcG9ydHMgZnVsbCBzY3JlZW7vvJ9cclxuICAgICAqIEB6aCDmmK/lkKbmlK/mjIHlhajlsY/vvJ9cclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICBnZXQgc3VwcG9ydHNGdWxsU2NyZWVuICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3VwcG9ydHNGdWxsU2NyZWVuO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm4gdHJ1ZSBpZiBpdCdzIGluIGZ1bGwgc2NyZWVuIHN0YXRlIG5vdy5cclxuICAgICAqIEB6aCDlvZPliY3mmK/lkKblpITlnKjlhajlsY/nirbmgIHkuItcclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICBmdWxsU2NyZWVuICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N1cHBvcnRzRnVsbFNjcmVlbikgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBlbHNlIGlmIChkb2N1bWVudFt0aGlzLl9mbi5mdWxsc2NyZWVuRWxlbWVudF0gPT09IHVuZGVmaW5lZCB8fCBkb2N1bWVudFt0aGlzLl9mbi5mdWxsc2NyZWVuRWxlbWVudF0gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXF1ZXN0IHRvIGVudGVyIGZ1bGwgc2NyZWVuIG1vZGUgd2l0aCB0aGUgZ2l2ZW4gZWxlbWVudC5cclxuICAgICAqIE1hbnkgYnJvd3NlciBmb3JiaWQgdG8gZW50ZXIgZnVsbCBzY3JlZW4gbW9kZSB3aXRob3V0IGFuIHVzZXIgaW50ZW5kZWQgaW50ZXJhY3Rpb24uXHJcbiAgICAgKiBGb3Igc2ltcGxpZnkgdGhlIHByb2Nlc3MsIHlvdSBjYW4gdHJ5IHRvIHVzZSB7e2F1dG9GdWxsU2NyZWVufX0gd2hpY2ggd2lsbCB0cnkgdG8gZW50ZXIgZnVsbCBzY3JlZW4gbW9kZSBkdXJpbmcgdGhlIG5leHQgdXNlciB0b3VjaCBldmVudC5cclxuICAgICAqIEB6aCDlsJ3or5Xkvb/lvZPliY3oioLngrnov5vlhaXlhajlsY/mqKHlvI/vvIzlvojlpJrmtY/op4jlmajkuI3lhYHorrjnqIvluo/op6blj5Hov5nmoLfnmoTooYzkuLrvvIzlv4XpobvlnKjkuIDkuKrnlKjmiLfkuqTkupLlm57osIPkuK3miY3kvJrnlJ/mlYjjgIJcclxuICAgICAqIOWmguaenOW4jOacm+abtOeugOWNleS4gOS6m++8jOWPr+S7peWwneivleeUqCB7e2F1dG9GdWxsU2NyZWVufX0g5p2l6Ieq5Yqo55uR5ZCs55So5oi36Kem5pG45LqL5Lu25bm25Zyo5LiL5LiA5qyh6Kem5pG45LqL5Lu25Lit5bCd6K+V6L+b5YWl5YWo5bGP5qih5byP44CCXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCB0byByZXF1ZXN0IGZ1bGwgc2NyZWVuIHN0YXRlXHJcbiAgICAgKiBAcGFyYW0gb25GdWxsU2NyZWVuQ2hhbmdlIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gZnVsbCBzY3JlZW4gc3RhdGUgY2hhbmdlZFxyXG4gICAgICogQHBhcmFtIG9uRnVsbFNjcmVlbkVycm9yIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gZnVsbCBzY3JlZW4gZXJyb3JcclxuICAgICAqIEByZXR1cm4ge1Byb21pc2V8dW5kZWZpbmVkfVxyXG4gICAgICovXHJcbiAgICByZXF1ZXN0RnVsbFNjcmVlbiAoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZT86ICh0aGlzOiBEb2N1bWVudCwgZXY6IGFueSkgPT4gYW55LCBvbkZ1bGxTY3JlZW5FcnJvcj86ICh0aGlzOiBEb2N1bWVudCwgZXY6IGFueSkgPT4gYW55KTogUHJvbWlzZTxhbnk+IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N1cHBvcnRzRnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmIChvbkZ1bGxTY3JlZW5DaGFuZ2UpIHtcclxuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gdGhpcy5fZm4uZnVsbHNjcmVlbmNoYW5nZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29uZnVsbHNjcmVlbmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uZnVsbHNjcmVlbmNoYW5nZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fb25mdWxsc2NyZWVuY2hhbmdlID0gb25GdWxsU2NyZWVuQ2hhbmdlO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb25GdWxsU2NyZWVuQ2hhbmdlLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob25GdWxsU2NyZWVuRXJyb3IpIHtcclxuICAgICAgICAgICAgbGV0IGV2ZW50TmFtZSA9IHRoaXMuX2ZuLmZ1bGxzY3JlZW5lcnJvcjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29uZnVsbHNjcmVlbmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25mdWxsc2NyZWVuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX29uZnVsbHNjcmVlbmVycm9yID0gb25GdWxsU2NyZWVuRXJyb3I7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvbkZ1bGxTY3JlZW5FcnJvciwgeyBvbmNlOiB0cnVlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHJlcXVlc3RQcm9taXNlID0gZWxlbWVudFt0aGlzLl9mbi5yZXF1ZXN0RnVsbHNjcmVlbl0oKTtcclxuICAgICAgICAvLyB0aGUgcmVxdWVzdEZ1bGxzY3JlZW4gQVBJIGNhbiBvbmx5IGJlIGluaXRpYXRlZCBieSB1c2VyIGdlc3R1cmUuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5Qcm9taXNlICYmIHJlcXVlc3RQcm9taXNlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xyXG4gICAgICAgICAgICByZXF1ZXN0UHJvbWlzZS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZyAuLi5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRXhpdCB0aGUgZnVsbCBtb2RlLlxyXG4gICAgICogQHpoIOmAgOWHuuWFqOWxj+aooeW8j1xyXG4gICAgICogQHJldHVybiB7UHJvbWlzZXx1bmRlZmluZWR9XHJcbiAgICAgKi9cclxuICAgIGV4aXRGdWxsU2NyZWVuICgpOiBQcm9taXNlPGFueT4gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCByZXF1ZXN0UHJvbWlzZTtcclxuICAgICAgICBpZiAodGhpcy5mdWxsU2NyZWVuKCkpIHtcclxuICAgICAgICAgICAgcmVxdWVzdFByb21pc2UgPSBkb2N1bWVudFt0aGlzLl9mbi5leGl0RnVsbHNjcmVlbl0oKTtcclxuICAgICAgICAgICAgcmVxdWVzdFByb21pc2UuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLi4uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVxdWVzdFByb21pc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEF1dG9tYXRpY2FsbHkgcmVxdWVzdCBmdWxsIHNjcmVlbiBkdXJpbmcgdGhlIG5leHQgdG91Y2gvY2xpY2sgZXZlbnRcclxuICAgICAqIEB6aCDoh6rliqjnm5HlkKzop6bmkbjjgIHpvKDmoIfkuovku7blubblnKjkuIvkuIDmrKHkuovku7bop6blj5Hml7blsJ3or5Xov5vlhaXlhajlsY/mqKHlvI9cclxuICAgICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIHJlcXVlc3QgZnVsbCBzY3JlZW4gc3RhdGVcclxuICAgICAqIEBwYXJhbSBvbkZ1bGxTY3JlZW5DaGFuZ2UgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBmdWxsIHNjcmVlbiBzdGF0ZSBjaGFuZ2VkXHJcbiAgICAgKi9cclxuICAgIGF1dG9GdWxsU2NyZWVuIChlbGVtZW50OiBIVE1MRWxlbWVudCwgb25GdWxsU2NyZWVuQ2hhbmdlOiAodGhpczogRG9jdW1lbnQsIGV2OiBhbnkpID0+IGFueSkge1xyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Vuc3VyZUZ1bGxTY3JlZW4oZWxlbWVudCwgb25GdWxsU2NyZWVuQ2hhbmdlKTtcclxuICAgICAgICB0aGlzLnJlcXVlc3RGdWxsU2NyZWVuKGVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGRpc2FibGVBdXRvRnVsbFNjcmVlbiAoZWxlbWVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wcmVPblRvdWNoKSB7XHJcbiAgICAgICAgICAgIGxldCB0b3VjaFRhcmdldCA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzIHx8IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxldCB0b3VjaEV2ZW50TmFtZSA9IHRoaXMuX3RvdWNoRXZlbnQ7XHJcbiAgICAgICAgICAgIHRvdWNoVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodG91Y2hFdmVudE5hbWUsIHRoaXMuX3ByZU9uVG91Y2gpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcmVPblRvdWNoID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFJlZ2lzdGVyIHRvdWNoIGV2ZW50IGlmIHJlcXVlc3QgZnVsbCBzY3JlZW4gZmFpbGVkXHJcbiAgICBfZW5zdXJlRnVsbFNjcmVlbiAoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9uRnVsbFNjcmVlbkNoYW5nZTogKHRoaXM6IERvY3VtZW50LCBldjogYW55KSA9PiBhbnkpIHtcclxuICAgICAgICBsZXQgdG91Y2hUYXJnZXQgPSBsZWdhY3lDQy5nYW1lLmNhbnZhcyB8fCBlbGVtZW50O1xyXG4gICAgICAgIGxldCBmdWxsU2NyZWVuRXJyb3JFdmVudE5hbWUgPSB0aGlzLl9mbi5mdWxsc2NyZWVuZXJyb3I7XHJcbiAgICAgICAgbGV0IHRvdWNoRXZlbnROYW1lID0gdGhpcy5fdG91Y2hFdmVudDtcclxuXHJcbiAgICAgICAgbGV0IG9uRnVsbFNjcmVlbkVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9wcmVPbkZ1bGxTY3JlZW5FcnJvciA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBoYW5kbGUgdG91Y2ggZXZlbnQgbGlzdGVuZXJcclxuICAgICAgICAgICAgbGV0IG9uVG91Y2ggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVPblRvdWNoID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdEZ1bGxTY3JlZW4oZWxlbWVudCwgb25GdWxsU2NyZWVuQ2hhbmdlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3ByZU9uVG91Y2gpIHtcclxuICAgICAgICAgICAgICAgIHRvdWNoVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodG91Y2hFdmVudE5hbWUsIHRoaXMuX3ByZU9uVG91Y2gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3ByZU9uVG91Y2ggPSBvblRvdWNoO1xyXG4gICAgICAgICAgICB0b3VjaFRhcmdldC5hZGRFdmVudExpc3RlbmVyKHRvdWNoRXZlbnROYW1lLCB0aGlzLl9wcmVPblRvdWNoLCB7IG9uY2U6IHRydWUgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gaGFuZGxlIGZ1bGwgc2NyZWVuIGVycm9yXHJcbiAgICAgICAgaWYgKHRoaXMuX3ByZU9uRnVsbFNjcmVlbkVycm9yKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihmdWxsU2NyZWVuRXJyb3JFdmVudE5hbWUsIHRoaXMuX3ByZU9uRnVsbFNjcmVlbkVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJlT25GdWxsU2NyZWVuRXJyb3IgPSBvbkZ1bGxTY3JlZW5FcnJvcjtcclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZnVsbFNjcmVlbkVycm9yRXZlbnROYW1lLCBvbkZ1bGxTY3JlZW5FcnJvciwgeyBvbmNlOiB0cnVlIH0pO1xyXG4gICAgfSxcclxufTtcclxuc2NyZWVuLmluaXQoKTtcclxuXHJcbmxlZ2FjeUNDLnNjcmVlbiA9IHNjcmVlbjtcclxuXHJcbmV4cG9ydCB7IHNjcmVlbiB9O1xyXG4iXX0=