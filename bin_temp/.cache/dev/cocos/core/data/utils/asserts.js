(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants);
    global.asserts = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.assertIsNonNullable = assertIsNonNullable;
  _exports.assertIsTrue = assertIsTrue;

  /*
   Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.
  
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
   * Asserts that the expression is non-nullable, i.e. is neither `null` nor `undefined`.
   * @param expr Testing expression.
   * @param message Optional message.
   */
  function assertIsNonNullable(expr, message) {
    assertIsTrue(!(expr === null || expr === undefined), message);
  }
  /**
   * Asserts that the expression evaluated to `true`.
   * @param expr Testing expression.
   * @param message Optional message.
   */


  function assertIsTrue(expr, message) {
    if (_defaultConstants.DEBUG && !expr) {
      throw new Error("Assertion failed: ".concat(message !== null && message !== void 0 ? message : '<no-message>'));
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9hc3NlcnRzLnRzIl0sIm5hbWVzIjpbImFzc2VydElzTm9uTnVsbGFibGUiLCJleHByIiwibWVzc2FnZSIsImFzc2VydElzVHJ1ZSIsInVuZGVmaW5lZCIsIkRFQlVHIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBOzs7OztBQUtPLFdBQVNBLG1CQUFULENBQWlDQyxJQUFqQyxFQUEwQ0MsT0FBMUMsRUFBNEY7QUFDL0ZDLElBQUFBLFlBQVksQ0FBQyxFQUFFRixJQUFJLEtBQUssSUFBVCxJQUFpQkEsSUFBSSxLQUFLRyxTQUE1QixDQUFELEVBQXlDRixPQUF6QyxDQUFaO0FBQ0g7QUFFRDs7Ozs7OztBQUtPLFdBQVNDLFlBQVQsQ0FBdUJGLElBQXZCLEVBQXNDQyxPQUF0QyxFQUF3RDtBQUMzRCxRQUFJRywyQkFBUyxDQUFDSixJQUFkLEVBQW9CO0FBQ2hCLFlBQU0sSUFBSUssS0FBSiw2QkFBK0JKLE9BQS9CLGFBQStCQSxPQUEvQixjQUErQkEsT0FBL0IsR0FBMEMsY0FBMUMsRUFBTjtBQUNIO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDIwIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuaW1wb3J0IHsgREVCVUcgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5cclxuLyoqXHJcbiAqIEFzc2VydHMgdGhhdCB0aGUgZXhwcmVzc2lvbiBpcyBub24tbnVsbGFibGUsIGkuZS4gaXMgbmVpdGhlciBgbnVsbGAgbm9yIGB1bmRlZmluZWRgLlxyXG4gKiBAcGFyYW0gZXhwciBUZXN0aW5nIGV4cHJlc3Npb24uXHJcbiAqIEBwYXJhbSBtZXNzYWdlIE9wdGlvbmFsIG1lc3NhZ2UuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0SXNOb25OdWxsYWJsZTxUPiAoZXhwcjogVCwgbWVzc2FnZT86IHN0cmluZyk6IGFzc2VydHMgZXhwciBpcyBOb25OdWxsYWJsZTxUPiB7XHJcbiAgICBhc3NlcnRJc1RydWUoIShleHByID09PSBudWxsIHx8IGV4cHIgPT09IHVuZGVmaW5lZCksIG1lc3NhZ2UpO1xyXG59XHJcblxyXG4vKipcclxuICogQXNzZXJ0cyB0aGF0IHRoZSBleHByZXNzaW9uIGV2YWx1YXRlZCB0byBgdHJ1ZWAuXHJcbiAqIEBwYXJhbSBleHByIFRlc3RpbmcgZXhwcmVzc2lvbi5cclxuICogQHBhcmFtIG1lc3NhZ2UgT3B0aW9uYWwgbWVzc2FnZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRJc1RydWUgKGV4cHI6IGJvb2xlYW4sIG1lc3NhZ2U/OiBzdHJpbmcpIHtcclxuICAgIGlmIChERUJVRyAmJiAhZXhwcikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXJ0aW9uIGZhaWxlZDogJHttZXNzYWdlID8/ICc8bm8tbWVzc2FnZT4nfWApO1xyXG4gICAgfVxyXG59Il19