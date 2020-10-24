(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.globalExports);
    global.requiringFrame = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.push = push;
  _exports.pop = pop;
  _exports.peek = peek;

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
   *
   */
  var requiringFrames = []; // the requiring frame infos

  function push(module, uuid, script, importMeta) {
    if (script === undefined) {
      script = uuid;
      uuid = '';
    }

    requiringFrames.push({
      uuid: uuid,
      script: script,
      module: module,
      exports: module.exports,
      // original exports
      beh: null,
      importMeta: importMeta
    });
  }

  function pop() {
    var frameInfo = requiringFrames.pop(); // check exports

    var module = frameInfo.module;
    var exports = module.exports;

    if (exports === frameInfo.exports) {
      // tslint:disable-next-line: forin
      for (var anykey in exports) {
        // exported
        return;
      } // auto export component


      module.exports = exports = frameInfo.cls;
    }
  }

  function peek() {
    return requiringFrames[requiringFrames.length - 1];
  }

  _globalExports.legacyCC._RF = {
    push: push,
    pop: pop,
    peek: peek
  };

  if (_defaultConstants.EDITOR) {
    _globalExports.legacyCC._RF.reset = function () {
      requiringFrames = [];
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9yZXF1aXJpbmctZnJhbWUudHMiXSwibmFtZXMiOlsicmVxdWlyaW5nRnJhbWVzIiwicHVzaCIsIm1vZHVsZSIsInV1aWQiLCJzY3JpcHQiLCJpbXBvcnRNZXRhIiwidW5kZWZpbmVkIiwiZXhwb3J0cyIsImJlaCIsInBvcCIsImZyYW1lSW5mbyIsImFueWtleSIsImNscyIsInBlZWsiLCJsZW5ndGgiLCJsZWdhY3lDQyIsIl9SRiIsIkVESVRPUiIsInJlc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJBOzs7QUFHQSxNQUFJQSxlQUFvQixHQUFHLEVBQTNCLEMsQ0FBZ0M7O0FBRXpCLFdBQVNDLElBQVQsQ0FBZUMsTUFBZixFQUF1QkMsSUFBdkIsRUFBcUNDLE1BQXJDLEVBQTZDQyxVQUE3QyxFQUEwRDtBQUM3RCxRQUFJRCxNQUFNLEtBQUtFLFNBQWYsRUFBMEI7QUFDdEJGLE1BQUFBLE1BQU0sR0FBR0QsSUFBVDtBQUNBQSxNQUFBQSxJQUFJLEdBQUcsRUFBUDtBQUNIOztBQUNESCxJQUFBQSxlQUFlLENBQUNDLElBQWhCLENBQXFCO0FBQ2pCRSxNQUFBQSxJQUFJLEVBQUpBLElBRGlCO0FBRWpCQyxNQUFBQSxNQUFNLEVBQU5BLE1BRmlCO0FBR2pCRixNQUFBQSxNQUFNLEVBQU5BLE1BSGlCO0FBSWpCSyxNQUFBQSxPQUFPLEVBQUVMLE1BQU0sQ0FBQ0ssT0FKQztBQUlXO0FBQzVCQyxNQUFBQSxHQUFHLEVBQUUsSUFMWTtBQU1qQkgsTUFBQUEsVUFBVSxFQUFWQTtBQU5pQixLQUFyQjtBQVFIOztBQUVNLFdBQVNJLEdBQVQsR0FBZ0I7QUFDbkIsUUFBTUMsU0FBUyxHQUFHVixlQUFlLENBQUNTLEdBQWhCLEVBQWxCLENBRG1CLENBRW5COztBQUNBLFFBQU1QLE1BQU0sR0FBR1EsU0FBUyxDQUFDUixNQUF6QjtBQUNBLFFBQUlLLE9BQU8sR0FBR0wsTUFBTSxDQUFDSyxPQUFyQjs7QUFDQSxRQUFJQSxPQUFPLEtBQUtHLFNBQVMsQ0FBQ0gsT0FBMUIsRUFBbUM7QUFDL0I7QUFDQSxXQUFLLElBQU1JLE1BQVgsSUFBcUJKLE9BQXJCLEVBQThCO0FBQzFCO0FBQ0E7QUFDSCxPQUw4QixDQU0vQjs7O0FBQ0FMLE1BQUFBLE1BQU0sQ0FBQ0ssT0FBUCxHQUFpQkEsT0FBTyxHQUFHRyxTQUFTLENBQUNFLEdBQXJDO0FBQ0g7QUFDSjs7QUFFTSxXQUFTQyxJQUFULEdBQWlCO0FBQ3BCLFdBQU9iLGVBQWUsQ0FBQ0EsZUFBZSxDQUFDYyxNQUFoQixHQUF5QixDQUExQixDQUF0QjtBQUNIOztBQUVEQywwQkFBU0MsR0FBVCxHQUFlO0FBQ1hmLElBQUFBLElBQUksRUFBSkEsSUFEVztBQUVYUSxJQUFBQSxHQUFHLEVBQUhBLEdBRlc7QUFHWEksSUFBQUEsSUFBSSxFQUFKQTtBQUhXLEdBQWY7O0FBTUEsTUFBSUksd0JBQUosRUFBWTtBQUNSRiw0QkFBU0MsR0FBVCxDQUFhRSxLQUFiLEdBQXFCLFlBQU07QUFDdkJsQixNQUFBQSxlQUFlLEdBQUcsRUFBbEI7QUFDSCxLQUZEO0FBR0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKlxyXG4gKi9cclxubGV0IHJlcXVpcmluZ0ZyYW1lczogYW55ID0gW107ICAvLyB0aGUgcmVxdWlyaW5nIGZyYW1lIGluZm9zXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHVzaCAobW9kdWxlLCB1dWlkOiBzdHJpbmcsIHNjcmlwdCwgaW1wb3J0TWV0YT8pIHtcclxuICAgIGlmIChzY3JpcHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHNjcmlwdCA9IHV1aWQ7XHJcbiAgICAgICAgdXVpZCA9ICcnO1xyXG4gICAgfVxyXG4gICAgcmVxdWlyaW5nRnJhbWVzLnB1c2goe1xyXG4gICAgICAgIHV1aWQsXHJcbiAgICAgICAgc2NyaXB0LFxyXG4gICAgICAgIG1vZHVsZSxcclxuICAgICAgICBleHBvcnRzOiBtb2R1bGUuZXhwb3J0cywgICAgLy8gb3JpZ2luYWwgZXhwb3J0c1xyXG4gICAgICAgIGJlaDogbnVsbCxcclxuICAgICAgICBpbXBvcnRNZXRhLFxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwb3AgKCkge1xyXG4gICAgY29uc3QgZnJhbWVJbmZvID0gcmVxdWlyaW5nRnJhbWVzLnBvcCgpO1xyXG4gICAgLy8gY2hlY2sgZXhwb3J0c1xyXG4gICAgY29uc3QgbW9kdWxlID0gZnJhbWVJbmZvLm1vZHVsZTtcclxuICAgIGxldCBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XHJcbiAgICBpZiAoZXhwb3J0cyA9PT0gZnJhbWVJbmZvLmV4cG9ydHMpIHtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGZvcmluXHJcbiAgICAgICAgZm9yIChjb25zdCBhbnlrZXkgaW4gZXhwb3J0cykge1xyXG4gICAgICAgICAgICAvLyBleHBvcnRlZFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGF1dG8gZXhwb3J0IGNvbXBvbmVudFxyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZyYW1lSW5mby5jbHM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwZWVrICgpIHtcclxuICAgIHJldHVybiByZXF1aXJpbmdGcmFtZXNbcmVxdWlyaW5nRnJhbWVzLmxlbmd0aCAtIDFdO1xyXG59XHJcblxyXG5sZWdhY3lDQy5fUkYgPSB7XHJcbiAgICBwdXNoLFxyXG4gICAgcG9wLFxyXG4gICAgcGVlayxcclxufTtcclxuXHJcbmlmIChFRElUT1IpIHtcclxuICAgIGxlZ2FjeUNDLl9SRi5yZXNldCA9ICgpID0+IHtcclxuICAgICAgICByZXF1aXJpbmdGcmFtZXMgPSBbXTtcclxuICAgIH07XHJcbn1cclxuIl19