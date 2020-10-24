(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/value-types/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/value-types/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.types = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.InputFlag = _exports.InputMode = _exports.KeyboardReturnType = void 0;

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

  /**
   * 键盘的返回键类型。
   * @readonly
   * @enum EditBox.KeyboardReturnType
   */
  var KeyboardReturnType;
  _exports.KeyboardReturnType = KeyboardReturnType;

  (function (KeyboardReturnType) {
    KeyboardReturnType[KeyboardReturnType["DEFAULT"] = 0] = "DEFAULT";
    KeyboardReturnType[KeyboardReturnType["DONE"] = 1] = "DONE";
    KeyboardReturnType[KeyboardReturnType["SEND"] = 2] = "SEND";
    KeyboardReturnType[KeyboardReturnType["SEARCH"] = 3] = "SEARCH";
    KeyboardReturnType[KeyboardReturnType["GO"] = 4] = "GO";
    KeyboardReturnType[KeyboardReturnType["NEXT"] = 5] = "NEXT";
  })(KeyboardReturnType || (_exports.KeyboardReturnType = KeyboardReturnType = {}));

  (0, _index.Enum)(KeyboardReturnType);
  /**
   * 输入模式。
   * @readonly
   * @enum EditBox.InputMode
   */

  var InputMode;
  _exports.InputMode = InputMode;

  (function (InputMode) {
    InputMode[InputMode["ANY"] = 0] = "ANY";
    InputMode[InputMode["EMAIL_ADDR"] = 1] = "EMAIL_ADDR";
    InputMode[InputMode["NUMERIC"] = 2] = "NUMERIC";
    InputMode[InputMode["PHONE_NUMBER"] = 3] = "PHONE_NUMBER";
    InputMode[InputMode["URL"] = 4] = "URL";
    InputMode[InputMode["DECIMAL"] = 5] = "DECIMAL";
    InputMode[InputMode["SINGLE_LINE"] = 6] = "SINGLE_LINE";
  })(InputMode || (_exports.InputMode = InputMode = {}));

  (0, _index.Enum)(InputMode);
  /**
   * 定义了一些用于设置文本显示和文本格式化的标志位。
   * @readonly
   * @enum EditBox.InputFlag
   */

  var InputFlag;
  _exports.InputFlag = InputFlag;

  (function (InputFlag) {
    InputFlag[InputFlag["PASSWORD"] = 0] = "PASSWORD";
    InputFlag[InputFlag["SENSITIVE"] = 1] = "SENSITIVE";
    InputFlag[InputFlag["INITIAL_CAPS_WORD"] = 2] = "INITIAL_CAPS_WORD";
    InputFlag[InputFlag["INITIAL_CAPS_SENTENCE"] = 3] = "INITIAL_CAPS_SENTENCE";
    InputFlag[InputFlag["INITIAL_CAPS_ALL_CHARACTERS"] = 4] = "INITIAL_CAPS_ALL_CHARACTERS";
    InputFlag[InputFlag["DEFAULT"] = 5] = "DEFAULT";
  })(InputFlag || (_exports.InputFlag = InputFlag = {}));

  (0, _index.Enum)(InputFlag);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvZWRpdGJveC90eXBlcy50cyJdLCJuYW1lcyI6WyJLZXlib2FyZFJldHVyblR5cGUiLCJJbnB1dE1vZGUiLCJJbnB1dEZsYWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7Ozs7QUFLQTs7Ozs7TUFLWUEsa0I7OzthQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtLQUFBQSxrQixtQ0FBQUEsa0I7O0FBMEJaLG1CQUFLQSxrQkFBTDtBQUVBOzs7Ozs7TUFLWUMsUzs7O2FBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0tBQUFBLFMsMEJBQUFBLFM7O0FBK0JaLG1CQUFLQSxTQUFMO0FBRUE7Ozs7OztNQUtZQyxTOzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztLQUFBQSxTLDBCQUFBQSxTOztBQTRCWixtQkFBS0EsU0FBTCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBFbnVtIH0gZnJvbSAnLi4vLi4vLi4vY29yZS92YWx1ZS10eXBlcyc7XHJcbi8qKlxyXG4gKiDplK7nm5jnmoTov5Tlm57plK7nsbvlnovjgIJcclxuICogQHJlYWRvbmx5XHJcbiAqIEBlbnVtIEVkaXRCb3guS2V5Ym9hcmRSZXR1cm5UeXBlXHJcbiAqL1xyXG5leHBvcnQgZW51bSBLZXlib2FyZFJldHVyblR5cGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiDpu5jorqTjgIJcclxuICAgICAqL1xyXG4gICAgREVGQVVMVCA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIOWujOaIkOexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBET05FID0gMSxcclxuICAgIC8qKlxyXG4gICAgICog5Y+R6YCB57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIFNFTkQgPSAyLFxyXG4gICAgLyoqXHJcbiAgICAgKiDmkJzntKLnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgU0VBUkNIID0gMyxcclxuICAgIC8qKlxyXG4gICAgICog6Lez6L2s57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIEdPID0gNCxcclxuICAgIC8qKlxyXG4gICAgICog5LiL5LiA5Liq57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIE5FWFQgPSA1LFxyXG59XHJcbkVudW0oS2V5Ym9hcmRSZXR1cm5UeXBlKTtcclxuXHJcbi8qKlxyXG4gKiDovpPlhaXmqKHlvI/jgIJcclxuICogQHJlYWRvbmx5XHJcbiAqIEBlbnVtIEVkaXRCb3guSW5wdXRNb2RlXHJcbiAqL1xyXG5leHBvcnQgZW51bSBJbnB1dE1vZGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjmiLflj6/ku6XovpPlhaXku7vkvZXmlofmnKzvvIzljIXmi6zmjaLooYznrKbjgIJcclxuICAgICAqL1xyXG4gICAgQU5ZID0gMCxcclxuICAgIC8qKlxyXG4gICAgICog5YWB6K6455So5oi36L6T5YWl5LiA5Liq55S15a2Q6YKu5Lu25Zyw5Z2A44CCXHJcbiAgICAgKi9cclxuICAgIEVNQUlMX0FERFIgPSAxLFxyXG4gICAgLyoqXHJcbiAgICAgKiDlhYHorrjnlKjmiLfovpPlhaXkuIDkuKrmlbTmlbDlgLzjgIJcclxuICAgICAqL1xyXG4gICAgTlVNRVJJQyA9IDIsXHJcbiAgICAvKipcclxuICAgICAqIOWFgeiuuOeUqOaIt+i+k+WFpeS4gOS4queUteivneWPt+eggeOAglxyXG4gICAgICovXHJcbiAgICBQSE9ORV9OVU1CRVIgPSAzLFxyXG4gICAgLyoqXHJcbiAgICAgKiDlhYHorrjnlKjmiLfovpPlhaXkuIDkuKogVVJM44CCXHJcbiAgICAgKi9cclxuICAgIFVSTCA9IDQsXHJcbiAgICAvKipcclxuICAgICAqIOWFgeiuuOeUqOaIt+i+k+WFpeS4gOS4quWunuaVsOOAglxyXG4gICAgICovXHJcbiAgICBERUNJTUFMID0gNSxcclxuICAgIC8qKlxyXG4gICAgICog6Zmk5LqG5o2i6KGM56ym5Lul5aSW77yM55So5oi35Y+v5Lul6L6T5YWl5Lu75L2V5paH5pys44CCXHJcbiAgICAgKi9cclxuICAgIFNJTkdMRV9MSU5FID0gNixcclxufVxyXG5cclxuRW51bShJbnB1dE1vZGUpO1xyXG5cclxuLyoqXHJcbiAqIOWumuS5ieS6huS4gOS6m+eUqOS6juiuvue9ruaWh+acrOaYvuekuuWSjOaWh+acrOagvOW8j+WMlueahOagh+W/l+S9jeOAglxyXG4gKiBAcmVhZG9ubHlcclxuICogQGVudW0gRWRpdEJveC5JbnB1dEZsYWdcclxuICovXHJcbmV4cG9ydCBlbnVtIElucHV0RmxhZyB7XHJcbiAgICAvKipcclxuICAgICAqIOihqOaYjui+k+WFpeeahOaWh+acrOaYr+S/neWvhueahOaVsOaNru+8jOS7u+S9leaXtuWAmemDveW6lOivpemakOiXj+i1t+adpe+8jOWug+makOWQq+S6hiBFRElUX0JPWF9JTlBVVF9GTEFHX1NFTlNJVElWReOAglxyXG4gICAgICovXHJcbiAgICBQQVNTV09SRCA9IDAsXHJcbiAgICAvKipcclxuICAgICAqIOihqOaYjui+k+WFpeeahOaWh+acrOaYr+aVj+aEn+aVsOaNru+8jOWug+emgeatouWtmOWCqOWIsOWtl+WFuOaIluihqOmHjOmdou+8jOS5n+S4jeiDveeUqOadpeiHquWKqOihpeWFqOWSjOaPkOekuueUqOaIt+i+k+WFpeOAglxyXG4gICAgICog5LiA5Liq5L+h55So5Y2h5Y+356CB5bCx5piv5LiA5Liq5pWP5oSf5pWw5o2u55qE5L6L5a2Q44CCXHJcbiAgICAgKi9cclxuICAgIFNFTlNJVElWRSA9IDEsXHJcbiAgICAvKipcclxuICAgICAqIOi/meS4quagh+W/l+eUqOadpeaMh+WumuWcqOaWh+acrOe8lui+keeahOaXtuWAme+8jOaYr+WQpuaKiuavj+S4gOS4quWNleivjeeahOmmluWtl+avjeWkp+WGmeOAglxyXG4gICAgICovXHJcbiAgICBJTklUSUFMX0NBUFNfV09SRCA9IDIsXHJcbiAgICAvKipcclxuICAgICAqIOi/meS4quagh+W/l+eUqOadpeaMh+WumuWcqOaWh+acrOe8lui+keaYr+WQpuavj+S4quWPpeWtkOeahOmmluWtl+avjeWkp+WGmeOAglxyXG4gICAgICovXHJcbiAgICBJTklUSUFMX0NBUFNfU0VOVEVOQ0UgPSAzLFxyXG4gICAgLyoqXHJcbiAgICAgKiDoh6rliqjmiorovpPlhaXnmoTmiYDmnInlrZfnrKblpKflhpnjgIJcclxuICAgICAqL1xyXG4gICAgSU5JVElBTF9DQVBTX0FMTF9DSEFSQUNURVJTID0gNCxcclxuICAgIC8qKlxyXG4gICAgICogRG9uJ3QgZG8gYW55dGhpbmcgd2l0aCB0aGUgaW5wdXQgdGV4dC5cclxuICAgICAqL1xyXG4gICAgREVGQVVMVCA9IDUsXHJcbn1cclxuXHJcbkVudW0oSW5wdXRGbGFnKTtcclxuIl19