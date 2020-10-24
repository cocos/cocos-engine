(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../components/index.js", "./graphics-assembler.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../components/index.js"), require("./graphics-assembler.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.graphicsAssembler);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _graphicsAssembler) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "graphics", {
    enumerable: true,
    get: function () {
      return _graphicsAssembler.graphicsAssembler;
    }
  });
  _exports.graphicsAssembler = void 0;

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
  var graphicsAssemblerManager = {
    getAssembler: function getAssembler(sprite) {
      return _graphicsAssembler.graphicsAssembler;
    }
  };
  _exports.graphicsAssembler = graphicsAssemblerManager;
  _index.Graphics.Assembler = graphicsAssemblerManager;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9ncmFwaGljcy93ZWJnbC9pbmRleC50cyJdLCJuYW1lcyI6WyJncmFwaGljc0Fzc2VtYmxlck1hbmFnZXIiLCJnZXRBc3NlbWJsZXIiLCJzcHJpdGUiLCJncmFwaGljcyIsIkdyYXBoaWNzIiwiQXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsTUFBTUEsd0JBQTJDLEdBQUc7QUFDaERDLElBQUFBLFlBRGdELHdCQUNsQ0MsTUFEa0MsRUFDWjtBQUNoQyxhQUFPQyxvQ0FBUDtBQUNIO0FBSCtDLEdBQXBEOztBQU1BQyxrQkFBU0MsU0FBVCxHQUFxQkwsd0JBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG5pbXBvcnQgeyBVSVJlbmRlcmFibGUgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZS91aS1yZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgSUFzc2VtYmxlck1hbmFnZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL3JlbmRlcmVyL3VpL2Jhc2UnO1xyXG5pbXBvcnQgeyBHcmFwaGljcyB9IGZyb20gJy4uLy4uLy4uL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgeyBncmFwaGljc0Fzc2VtYmxlciBhcyBncmFwaGljcyB9IGZyb20gJy4vZ3JhcGhpY3MtYXNzZW1ibGVyJztcclxuXHJcbmNvbnN0IGdyYXBoaWNzQXNzZW1ibGVyTWFuYWdlcjogSUFzc2VtYmxlck1hbmFnZXIgPSB7XHJcbiAgICBnZXRBc3NlbWJsZXIgKHNwcml0ZTogVUlSZW5kZXJhYmxlKSB7XHJcbiAgICAgICAgcmV0dXJuIGdyYXBoaWNzO1xyXG4gICAgfSxcclxufTtcclxuXHJcbkdyYXBoaWNzLkFzc2VtYmxlciA9IGdyYXBoaWNzQXNzZW1ibGVyTWFuYWdlcjtcclxuZXhwb3J0IHtcclxuICAgIGdyYXBoaWNzLFxyXG4gICAgZ3JhcGhpY3NBc3NlbWJsZXJNYW5hZ2VyIGFzIGdyYXBoaWNzQXNzZW1ibGVyLFxyXG59O1xyXG4iXX0=