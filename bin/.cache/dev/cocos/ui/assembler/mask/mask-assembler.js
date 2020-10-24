(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../components/mask.js", "../../../core/renderer/ui/stencil-manager.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../components/mask.js"), require("../../../core/renderer/ui/stencil-manager.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mask, global.stencilManager);
    global.maskAssembler = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _mask, _stencilManager2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.maskEndAssembler = _exports.maskAssembler = void 0;

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
   * @category ui-assembler
   */
  var _stencilManager = _stencilManager2.StencilManager.sharedManager;
  var maskAssembler = {
    createData: function createData(mask) {
      var renderData = mask.requestRenderData();
      renderData.dataLength = 4;
      renderData.vertexCount = 4;
      renderData.indicesCount = 6;
      return renderData;
    },
    updateRenderData: function updateRenderData(mask) {
      var renderData = mask.renderData;

      if (renderData) {
        if (renderData.vertDirty) {
          if (this.updateVertexData) {
            this.updateVertexData(mask);
          }
        }
      }
    },
    updateVertexData: function updateVertexData(mask) {
      var renderData = mask.renderData;

      if (!renderData) {
        return;
      }

      var uiTrans = mask.node._uiProps.uiTransformComp;
      var dataList = renderData.data;
      var cw = uiTrans.width;
      var ch = uiTrans.height;
      var appX = uiTrans.anchorX * cw;
      var appY = uiTrans.anchorY * ch;
      var l = 0;
      var b = 0;
      var r = 0;
      var t = 0; // if (sprite.trim) {

      l = -appX;
      b = -appY;
      r = cw - appX;
      t = ch - appY;
      dataList[0].x = l;
      dataList[0].y = b;
      dataList[3].x = r;
      dataList[3].y = t;
      renderData.vertDirty = false;
    },
    fillBuffers: function fillBuffers(mask, renderer) {
      _stencilManager.pushMask(mask);

      _stencilManager.clear();

      mask.clearGraphics.updateAssembler(renderer);

      _stencilManager.enterLevel();

      mask.graphics.updateAssembler(renderer);

      _stencilManager.enableMask();
    }
  };
  _exports.maskAssembler = maskAssembler;
  var maskEndAssembler = {
    fillBuffers: function fillBuffers(mask, ui) {
      _stencilManager.exitMask();
    }
  };
  _exports.maskEndAssembler = maskEndAssembler;
  var StartAssembler = {
    getAssembler: function getAssembler() {
      return maskAssembler;
    }
  };
  var PostAssembler = {
    getAssembler: function getAssembler() {
      return maskEndAssembler;
    }
  };
  _mask.Mask.Assembler = StartAssembler;
  _mask.Mask.PostAssembler = PostAssembler;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2Fzc2VtYmxlci9tYXNrL21hc2stYXNzZW1ibGVyLnRzIl0sIm5hbWVzIjpbIl9zdGVuY2lsTWFuYWdlciIsIlN0ZW5jaWxNYW5hZ2VyIiwic2hhcmVkTWFuYWdlciIsIm1hc2tBc3NlbWJsZXIiLCJjcmVhdGVEYXRhIiwibWFzayIsInJlbmRlckRhdGEiLCJyZXF1ZXN0UmVuZGVyRGF0YSIsImRhdGFMZW5ndGgiLCJ2ZXJ0ZXhDb3VudCIsImluZGljZXNDb3VudCIsInVwZGF0ZVJlbmRlckRhdGEiLCJ2ZXJ0RGlydHkiLCJ1cGRhdGVWZXJ0ZXhEYXRhIiwidWlUcmFucyIsIm5vZGUiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsImRhdGFMaXN0IiwiZGF0YSIsImN3Iiwid2lkdGgiLCJjaCIsImhlaWdodCIsImFwcFgiLCJhbmNob3JYIiwiYXBwWSIsImFuY2hvclkiLCJsIiwiYiIsInIiLCJ0IiwieCIsInkiLCJmaWxsQnVmZmVycyIsInJlbmRlcmVyIiwicHVzaE1hc2siLCJjbGVhciIsImNsZWFyR3JhcGhpY3MiLCJ1cGRhdGVBc3NlbWJsZXIiLCJlbnRlckxldmVsIiwiZ3JhcGhpY3MiLCJlbmFibGVNYXNrIiwibWFza0VuZEFzc2VtYmxlciIsInVpIiwiZXhpdE1hc2siLCJTdGFydEFzc2VtYmxlciIsImdldEFzc2VtYmxlciIsIlBvc3RBc3NlbWJsZXIiLCJNYXNrIiwiQXNzZW1ibGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7QUFVQSxNQUFNQSxlQUFlLEdBQUdDLGdDQUFlQyxhQUF2QztBQUVPLE1BQU1DLGFBQXlCLEdBQUc7QUFDckNDLElBQUFBLFVBRHFDLHNCQUN6QkMsSUFEeUIsRUFDYjtBQUNwQixVQUFNQyxVQUFVLEdBQUdELElBQUksQ0FBQ0UsaUJBQUwsRUFBbkI7QUFDQUQs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WUFEc0MsMEJBQ3RCO0FBQ1osYUFBTzVDLGFBQVA7QUFDSDtBQUhxQyxHQUExQztBQU1BLE1BQU02QyxhQUFnQyxHQUFHO0FBQ3JDRCxJQUFBQSxZQURxQywwQkFDckI7QUFDWixhQUFPSixnQkFBUDtBQUNIO0FBSG9DLEdBQXpDO0FBTUFNLGFBQUtDLFNBQUwsR0FBaUJKLGNBQWpCO0FBQ0FHLGFBQUtELGFBQUwsR0FBcUJBLGFBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpLWFzc2VtYmxlclxyXG4gKi9cclxuXHJcbmltcG9ydCB7IElSZW5kZXJEYXRhLCBSZW5kZXJEYXRhIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9yZW5kZXJlci91aS9yZW5kZXItZGF0YSc7XHJcbmltcG9ydCB7IFVJIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9yZW5kZXJlci91aS91aSc7XHJcbmltcG9ydCB7IE1hc2sgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL21hc2snO1xyXG5pbXBvcnQgeyBJQXNzZW1ibGVyLCBJQXNzZW1ibGVyTWFuYWdlciB9IGZyb20gJy4uLy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvYmFzZSc7XHJcbmltcG9ydCB7IFN0ZW5jaWxNYW5hZ2VyIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9yZW5kZXJlci91aS9zdGVuY2lsLW1hbmFnZXInO1xyXG5cclxuY29uc3QgX3N0ZW5jaWxNYW5hZ2VyID0gU3RlbmNpbE1hbmFnZXIuc2hhcmVkTWFuYWdlciE7XHJcblxyXG5leHBvcnQgY29uc3QgbWFza0Fzc2VtYmxlcjogSUFzc2VtYmxlciA9IHtcclxuICAgIGNyZWF0ZURhdGEgKG1hc2s6IE1hc2spIHtcclxuICAgICAgICBjb25zdCByZW5kZXJEYXRhID0gbWFzay5yZXF1ZXN0UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgIHJlbmRlckRhdGEhLmRhdGFMZW5ndGggPSA0O1xyXG4gICAgICAgIHJlbmRlckRhdGEhLnZlcnRleENvdW50ID0gNDtcclxuICAgICAgICByZW5kZXJEYXRhIS5pbmRpY2VzQ291bnQgPSA2O1xyXG4gICAgICAgIHJldHVybiByZW5kZXJEYXRhIGFzIFJlbmRlckRhdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwZGF0ZVJlbmRlckRhdGEgKG1hc2s6IE1hc2spe1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckRhdGEgPSBtYXNrLnJlbmRlckRhdGE7XHJcbiAgICAgICAgaWYgKHJlbmRlckRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHJlbmRlckRhdGEudmVydERpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51cGRhdGVWZXJ0ZXhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0ZXhEYXRhKG1hc2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXhEYXRhIChtYXNrOiBNYXNrKSB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyRGF0YTogUmVuZGVyRGF0YSB8IG51bGwgPSBtYXNrLnJlbmRlckRhdGE7XHJcbiAgICAgICAgaWYgKCFyZW5kZXJEYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHVpVHJhbnMgPSBtYXNrLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICBjb25zdCBkYXRhTGlzdDogSVJlbmRlckRhdGFbXSA9IHJlbmRlckRhdGEuZGF0YTtcclxuICAgICAgICBjb25zdCBjdyA9IHVpVHJhbnMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgY2ggPSB1aVRyYW5zLmhlaWdodDtcclxuICAgICAgICBjb25zdCBhcHBYID0gdWlUcmFucy5hbmNob3JYICogY3c7XHJcbiAgICAgICAgY29uc3QgYXBwWSA9IHVpVHJhbnMuYW5jaG9yWSAqIGNoO1xyXG4gICAgICAgIGxldCBsID0gMDtcclxuICAgICAgICBsZXQgYiA9IDA7XHJcbiAgICAgICAgbGV0IHIgPSAwO1xyXG4gICAgICAgIGxldCB0ID0gMDtcclxuICAgICAgICAvLyBpZiAoc3ByaXRlLnRyaW0pIHtcclxuICAgICAgICBsID0gLWFwcFg7XHJcbiAgICAgICAgYiA9IC1hcHBZO1xyXG4gICAgICAgIHIgPSBjdyAtIGFwcFg7XHJcbiAgICAgICAgdCA9IGNoIC0gYXBwWTtcclxuICAgICAgICBkYXRhTGlzdFswXS54ID0gbDtcclxuICAgICAgICBkYXRhTGlzdFswXS55ID0gYjtcclxuICAgICAgICBkYXRhTGlzdFszXS54ID0gcjtcclxuICAgICAgICBkYXRhTGlzdFszXS55ID0gdDtcclxuXHJcbiAgICAgICAgcmVuZGVyRGF0YS52ZXJ0RGlydHkgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgZmlsbEJ1ZmZlcnMgKG1hc2s6IE1hc2ssIHJlbmRlcmVyOiBVSSkge1xyXG4gICAgICAgIF9zdGVuY2lsTWFuYWdlci5wdXNoTWFzayhtYXNrKTtcclxuXHJcbiAgICAgICAgX3N0ZW5jaWxNYW5hZ2VyLmNsZWFyKCk7XHJcbiAgICAgICAgbWFzay5jbGVhckdyYXBoaWNzIS51cGRhdGVBc3NlbWJsZXIocmVuZGVyZXIpO1xyXG5cclxuICAgICAgICBfc3RlbmNpbE1hbmFnZXIuZW50ZXJMZXZlbCgpO1xyXG4gICAgICAgIG1hc2suZ3JhcGhpY3MhLnVwZGF0ZUFzc2VtYmxlcihyZW5kZXJlcik7XHJcblxyXG4gICAgICAgIF9zdGVuY2lsTWFuYWdlci5lbmFibGVNYXNrKCk7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IG1hc2tFbmRBc3NlbWJsZXI6IElBc3NlbWJsZXIgPSB7XHJcbiAgICBmaWxsQnVmZmVycyAobWFzazogTWFzaywgdWk6IFVJKSB7XHJcbiAgICAgICAgX3N0ZW5jaWxNYW5hZ2VyLmV4aXRNYXNrKCk7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuY29uc3QgU3RhcnRBc3NlbWJsZXI6IElBc3NlbWJsZXJNYW5hZ2VyID0ge1xyXG4gICAgZ2V0QXNzZW1ibGVyICgpIHtcclxuICAgICAgICByZXR1cm4gbWFza0Fzc2VtYmxlcjtcclxuICAgIH0sXHJcbn07XHJcblxyXG5jb25zdCBQb3N0QXNzZW1ibGVyOiBJQXNzZW1ibGVyTWFuYWdlciA9IHtcclxuICAgIGdldEFzc2VtYmxlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG1hc2tFbmRBc3NlbWJsZXI7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuTWFzay5Bc3NlbWJsZXIgPSBTdGFydEFzc2VtYmxlcjtcclxuTWFzay5Qb3N0QXNzZW1ibGVyID0gUG9zdEFzc2VtYmxlcjtcclxuIl19