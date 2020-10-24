(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/index.js", "../../gfx/define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/index.js"), require("../../gfx/define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define);
    global.uiVertexFormat = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getAttributeFormatBytes = getAttributeFormatBytes;
  _exports.getAttributeStride = getAttributeStride;
  _exports.vfmtPosUvColor = _exports.vfmt = void 0;

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
   * @category ui
   */
  var vfmt = [new _index.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), new _index.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA32F)];
  _exports.vfmt = vfmt;
  var vfmtPosUvColor = [new _index.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), new _index.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RG32F), new _index.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA32F)];
  _exports.vfmtPosUvColor = vfmtPosUvColor;

  function getAttributeFormatBytes(attrs) {
    var count = 0;

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var info = _define.GFXFormatInfos[attr.format];
      count += info.count;
    }

    return count;
  }

  function getAttributeStride(attrs) {
    var count = 0;

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      var info = _define.GFXFormatInfos[attr.format];
      count += info.size;
    }

    return count;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvdWktdmVydGV4LWZvcm1hdC50cyJdLCJuYW1lcyI6WyJ2Zm10IiwiR0ZYQXR0cmlidXRlIiwiR0ZYQXR0cmlidXRlTmFtZSIsIkFUVFJfUE9TSVRJT04iLCJHRlhGb3JtYXQiLCJSR0IzMkYiLCJBVFRSX0NPTE9SIiwiUkdCQTMyRiIsInZmbXRQb3NVdkNvbG9yIiwiQVRUUl9URVhfQ09PUkQiLCJSRzMyRiIsImdldEF0dHJpYnV0ZUZvcm1hdEJ5dGVzIiwiYXR0cnMiLCJjb3VudCIsImkiLCJsZW5ndGgiLCJhdHRyIiwiaW5mbyIsIkdGWEZvcm1hdEluZm9zIiwiZm9ybWF0IiwiZ2V0QXR0cmlidXRlU3RyaWRlIiwic2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBOzs7QUFLTyxNQUFNQSxJQUFJLEdBQUcsQ0FDaEIsSUFBSUMsbUJBQUosQ0FBaUJDLHlCQUFpQkMsYUFBbEMsRUFBaURDLGtCQUFVQyxNQUEzRCxDQURnQixFQUVoQixJQUFJSixtQkFBSixDQUFpQkMseUJBQWlCSSxVQUFsQyxFQUE4Q0Ysa0JBQVVHLE9BQXhELENBRmdCLENBQWI7O0FBS0EsTUFBTUMsY0FBYyxHQUFHLENBQzFCLElBQUlQLG1CQUFKLENBQWlCQyx5QkFBaUJDLGFBQWxDLEVBQWlEQyxrQkFBVUMsTUFBM0QsQ0FEMEIsRUFFMUIsSUFBSUosbUJBQUosQ0FBaUJDLHlCQUFpQk8sY0FBbEMsRUFBa0RMLGtCQUFVTSxLQUE1RCxDQUYwQixFQUcxQixJQUFJVCxtQkFBSixDQUFpQkMseUJBQWlCSSxVQUFsQyxFQUE4Q0Ysa0JBQVVHLE9BQXhELENBSDBCLENBQXZCOzs7QUFNQSxXQUFTSSx1QkFBVCxDQUFrQ0MsS0FBbEMsRUFBeUQ7QUFDNUQsUUFBSUMsS0FBSyxHQUFHLENBQVo7O0FBQ0EsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixLQUFLLENBQUNHLE1BQTFCLEVBQWtDRCxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLFVBQU1FLElBQUksR0FBR0osS0FBSyxDQUFDRSxDQUFELENBQWxCO0FBQ0EsVUFBTUcsSUFBSSxHQUFHQyx1QkFBZUYsSUFBSSxDQUFDRyxNQUFwQixDQUFiO0FBQ0FOLE1BQUFBLEtBQUssSUFBSUksSUFBSSxDQUFDSixLQUFkO0FBQ0g7O0FBRUQsV0FBT0EsS0FBUDtBQUNIOztBQUVNLFdBQVNPLGtCQUFULENBQTZCUixLQUE3QixFQUFvRDtBQUN2RCxRQUFJQyxLQUFLLEdBQUcsQ0FBWjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLEtBQUssQ0FBQ0csTUFBMUIsRUFBa0NELENBQUMsRUFBbkMsRUFBdUM7QUFDbkMsVUFBTUUsSUFBSSxHQUFHSixLQUFLLENBQUNFLENBQUQsQ0FBbEI7QUFDQSxVQUFNRyxJQUFJLEdBQUdDLHVCQUFlRixJQUFJLENBQUNHLE1BQXBCLENBQWI7QUFDQU4sTUFBQUEsS0FBSyxJQUFJSSxJQUFJLENBQUNJLElBQWQ7QUFDSDs7QUFFRCxXQUFPUixLQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHRlhBdHRyaWJ1dGUgfSBmcm9tICcuLi8uLi9nZngnO1xyXG4vKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcbmltcG9ydCB7IEdGWEF0dHJpYnV0ZU5hbWUsIEdGWEZvcm1hdCwgR0ZYRm9ybWF0SW5mb3MgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuXHJcbmV4cG9ydCBjb25zdCB2Zm10ID0gW1xyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04sIEdGWEZvcm1hdC5SR0IzMkYpLFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IsIEdGWEZvcm1hdC5SR0JBMzJGKSxcclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCB2Zm10UG9zVXZDb2xvciA9IFtcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OLCBHRlhGb3JtYXQuUkdCMzJGKSxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRCwgR0ZYRm9ybWF0LlJHMzJGKSxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX0NPTE9SLCBHRlhGb3JtYXQuUkdCQTMyRiksXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXR0cmlidXRlRm9ybWF0Qnl0ZXMgKGF0dHJzOiBHRlhBdHRyaWJ1dGVbXSkge1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBhdHRyID0gYXR0cnNbaV07XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2F0dHIuZm9ybWF0XTtcclxuICAgICAgICBjb3VudCArPSBpbmZvLmNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjb3VudDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0dHJpYnV0ZVN0cmlkZSAoYXR0cnM6IEdGWEF0dHJpYnV0ZVtdKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGF0dHIgPSBhdHRyc1tpXTtcclxuICAgICAgICBjb25zdCBpbmZvID0gR0ZYRm9ybWF0SW5mb3NbYXR0ci5mb3JtYXRdO1xyXG4gICAgICAgIGNvdW50ICs9IGluZm8uc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY291bnQ7XHJcbn1cclxuIl19