(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "../load-pipeline/CCLoader.js", "./image-asset.js", "../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("../load-pipeline/CCLoader.js"), require("./image-asset.js"), require("../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.CCLoader, global.imageAsset, global.defaultConstants);
    global.textureUtil = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _CCLoader, _imageAsset, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.loadImage = loadImage;
  _exports.cacheImage = cacheImage;
  _exports.postLoadImage = postLoadImage;

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
   * @category asset
   */

  /**
   * 加载指定的图像资源。
   * @param url 图像资源的链接。
   * @param callback 回调函数。
   * @param target 回调函数的 `this` 参数。
   * @returns 图像资源，返回时可能还未完成加载；加载完成或失败时会调用回调函数。
   */
  function loadImage(url, callback, target) {
    (0, _debug.assertID)(!!url, 3103);

    var imageAsset = _CCLoader.loader.getRes(url);

    if (imageAsset) {
      if (imageAsset.loaded) {
        if (callback) {
          callback.call(target, null, imageAsset);
        }

        return imageAsset;
      } else {
        imageAsset.once('load', function () {
          if (callback) {
            callback.call(target, null, imageAsset);
          }
        }, target);
        return imageAsset;
      }
    } else {
      imageAsset = new _imageAsset.ImageAsset();

      _CCLoader.loader.load({
        url: url,
        imageAsset: imageAsset
      }, function (err, asset) {
        if (err) {
          if (callback) {
            callback.call(target, err || new Error('Unknown error'));
          }

          return imageAsset;
        }

        if (callback) {
          callback.call(target, null, asset);
        }
      });

      return imageAsset;
    }
  }
  /**
   * 缓存指定的图像源，为它指定链接。此后，可以通过该链接直接加载它。
   * @param url 指定的链接。
   * @param image 缓存的图像源。
   */


  function cacheImage(url, image) {
    if (url && image) {
      var imageAsset = new _imageAsset.ImageAsset(image);
      var item = {
        id: url,
        url: url,
        // real download url, maybe changed
        error: null,
        content: imageAsset,
        complete: false
      };

      _CCLoader.loader.flowOut(item);

      return imageAsset;
    }
  }
  /**
   * 尝试加载图像资源的实际数据。
   * @param imageAsset 图像资源。
   * @param callback 回调函数。
   */


  function postLoadImage(imageAsset, callback) {
    if (imageAsset.loaded) {
      if (callback) {
        callback();
      }

      return;
    }

    if (!imageAsset.nativeUrl) {
      if (callback) {
        callback();
      }

      return;
    } // load image


    _CCLoader.loader.load({
      url: imageAsset.nativeUrl,
      // For image, we should skip loader otherwise it will load a new ImageAsset
      skips: imageAsset.isCompressed ? undefined : ['Loader']
    }, function (err, image) {
      if (image) {
        if (_defaultConstants.DEBUG && image instanceof _imageAsset.ImageAsset) {
          return (0, _debug.error)('internal error: loader handle pipe must be skipped');
        }

        if (!imageAsset.loaded) {
          imageAsset._nativeAsset = image;
        }
      }

      if (callback) {
        callback(err);
      }
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3RleHR1cmUtdXRpbC50cyJdLCJuYW1lcyI6WyJsb2FkSW1hZ2UiLCJ1cmwiLCJjYWxsYmFjayIsInRhcmdldCIsImltYWdlQXNzZXQiLCJsb2FkZXIiLCJnZXRSZXMiLCJsb2FkZWQiLCJjYWxsIiwib25jZSIsIkltYWdlQXNzZXQiLCJsb2FkIiwiZXJyIiwiYXNzZXQiLCJFcnJvciIsImNhY2hlSW1hZ2UiLCJpbWFnZSIsIml0ZW0iLCJpZCIsImVycm9yIiwiY29udGVudCIsImNvbXBsZXRlIiwiZmxvd091dCIsInBvc3RMb2FkSW1hZ2UiLCJuYXRpdmVVcmwiLCJza2lwcyIsImlzQ29tcHJlc3NlZCIsInVuZGVmaW5lZCIsIkRFQlVHIiwiX25hdGl2ZUFzc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOzs7O0FBZ0JBOzs7Ozs7O0FBT08sV0FBU0EsU0FBVCxDQUFzQ0MsR0FBdEMsRUFBbURDLFFBQW5ELEVBQW9GQyxNQUFwRixFQUFnRztBQUNuRyx5QkFBUyxDQUFDLENBQUNGLEdBQVgsRUFBZ0IsSUFBaEI7O0FBRUEsUUFBSUcsVUFBVSxHQUFHQyxpQkFBT0MsTUFBUCxDQUEwQkwsR0FBMUIsQ0FBakI7O0FBQ0EsUUFBSUcsVUFBSixFQUFnQjtBQUNaLFVBQUlBLFVBQVUsQ0FBQ0csTUFBZixFQUF1QjtBQUNuQixZQUFJTCxRQUFKLEVBQWE7QUFDVEEsVUFBQUEsUUFBUSxDQUFDTSxJQUFULENBQWNMLE1BQWQsRUFBc0IsSUFBdEIsRUFBNEJDLFVBQTVCO0FBQ0g7O0FBQ0QsZUFBT0EsVUFBUDtBQUNILE9BTEQsTUFLTztBQUNIQSxRQUFBQSxVQUFVLENBQUNLLElBQVgsQ0FBZ0IsTUFBaEIsRUFBd0IsWUFBTTtBQUMxQixjQUFJUCxRQUFKLEVBQWM7QUFDVkEsWUFBQUEsUUFBUSxDQUFDTSxJQUFULENBQWNMLE1BQWQsRUFBc0IsSUFBdEIsRUFBNEJDLFVBQTVCO0FBQ0g7QUFDSixTQUpELEVBSUdELE1BSkg7QUFLQSxlQUFPQyxVQUFQO0FBQ0g7QUFDSixLQWRELE1BY087QUFDSEEsTUFBQUEsVUFBVSxHQUFHLElBQUlNLHNCQUFKLEVBQWI7O0FBQ0FMLHVCQUFPTSxJQUFQLENBQVk7QUFBQ1YsUUFBQUEsR0FBRyxFQUFIQSxHQUFEO0FBQU1HLFFBQUFBLFVBQVUsRUFBVkE7QUFBTixPQUFaLEVBQStCLFVBQUNRLEdBQUQsRUFBTUMsS0FBTixFQUFnQjtBQUMzQyxZQUFJRCxHQUFKLEVBQVM7QUFDTCxjQUFJVixRQUFKLEVBQWM7QUFDVkEsWUFBQUEsUUFBUSxDQUFDTSxJQUFULENBQWNMLE1BQWQsRUFBc0JTLEdBQUcsSUFBSSxJQUFJRSxLQUFKLENBQVUsZUFBVixDQUE3QjtBQUNIOztBQUNELGlCQUFPVixVQUFQO0FBQ0g7O0FBQ0QsWUFBSUYsUUFBSixFQUFjO0FBQ1ZBLFVBQUFBLFFBQVEsQ0FBQ00sSUFBVCxDQUFjTCxNQUFkLEVBQXNCLElBQXRCLEVBQTRCVSxLQUE1QjtBQUNIO0FBQ0osT0FWRDs7QUFXQSxhQUFPVCxVQUFQO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7O0FBS08sV0FBU1csVUFBVCxDQUFxQmQsR0FBckIsRUFBa0NlLEtBQWxDLEVBQXNEO0FBQ3pELFFBQUlmLEdBQUcsSUFBSWUsS0FBWCxFQUFrQjtBQUNkLFVBQU1aLFVBQVUsR0FBRyxJQUFJTSxzQkFBSixDQUFlTSxLQUFmLENBQW5CO0FBQ0EsVUFBTUMsSUFBSSxHQUFHO0FBQ1RDLFFBQUFBLEVBQUUsRUFBRWpCLEdBREs7QUFFVEEsUUFBQUEsR0FBRyxFQUFIQSxHQUZTO0FBRUo7QUFDTGtCLFFBQUFBLEtBQUssRUFBRSxJQUhFO0FBSVRDLFFBQUFBLE9BQU8sRUFBRWhCLFVBSkE7QUFLVGlCLFFBQUFBLFFBQVEsRUFBRTtBQUxELE9BQWI7O0FBT0FoQix1QkFBT2lCLE9BQVAsQ0FBZUwsSUFBZjs7QUFDQSxhQUFPYixVQUFQO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7O0FBS08sV0FBU21CLGFBQVQsQ0FBd0JuQixVQUF4QixFQUFnREYsUUFBaEQsRUFBcUU7QUFDeEUsUUFBSUUsVUFBVSxDQUFDRyxNQUFmLEVBQXVCO0FBQ25CLFVBQUlMLFFBQUosRUFBYztBQUNWQSxRQUFBQSxRQUFRO0FBQ1g7O0FBQ0Q7QUFDSDs7QUFDRCxRQUFJLENBQUNFLFVBQVUsQ0FBQ29CLFNBQWhCLEVBQTJCO0FBQ3ZCLFVBQUl0QixRQUFKLEVBQWM7QUFDVkEsUUFBQUEsUUFBUTtBQUNYOztBQUNEO0FBQ0gsS0FadUUsQ0FheEU7OztBQUNBRyxxQkFBT00sSUFBUCxDQUFZO0FBQ1JWLE1BQUFBLEdBQUcsRUFBRUcsVUFBVSxDQUFDb0IsU0FEUjtBQUVSO0FBQ0FDLE1BQUFBLEtBQUssRUFBRXJCLFVBQVUsQ0FBQ3NCLFlBQVgsR0FBMEJDLFNBQTFCLEdBQXNDLENBQUMsUUFBRDtBQUhyQyxLQUFaLEVBSUcsVUFBQ2YsR0FBRCxFQUFNSSxLQUFOLEVBQWdCO0FBQ2YsVUFBSUEsS0FBSixFQUFXO0FBQ1AsWUFBSVksMkJBQVNaLEtBQUssWUFBWU4sc0JBQTlCLEVBQTBDO0FBQ3RDLGlCQUFPLGtCQUFNLG9EQUFOLENBQVA7QUFDSDs7QUFDRCxZQUFJLENBQUNOLFVBQVUsQ0FBQ0csTUFBaEIsRUFBd0I7QUFDcEJILFVBQUFBLFVBQVUsQ0FBQ3lCLFlBQVgsR0FBMEJiLEtBQTFCO0FBQ0g7QUFDSjs7QUFDRCxVQUFJZCxRQUFKLEVBQWM7QUFDVkEsUUFBQUEsUUFBUSxDQUFDVSxHQUFELENBQVI7QUFDSDtBQUNKLEtBaEJEO0FBaUJIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGFzc2V0XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgYXNzZXJ0SUQsIGVycm9yIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBsb2FkZXIgfSBmcm9tICcuLi9sb2FkLXBpcGVsaW5lL0NDTG9hZGVyJztcclxuaW1wb3J0IHsgSW1hZ2VBc3NldCwgSW1hZ2VTb3VyY2UgfSBmcm9tICcuL2ltYWdlLWFzc2V0JztcclxuaW1wb3J0IHsgREVCVUcgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBJSXRlbSB9IGZyb20gJy4uL2xvYWQtcGlwZWxpbmUvbG9hZGluZy1pdGVtcyc7XHJcblxyXG5leHBvcnQgdHlwZSBMb2FkSW1hZ2VDYWxsYmFjazxUPiA9IChcclxuICAgIHRoaXM6IFQgfCB1bmRlZmluZWQsXHJcbiAgICBlcnJvcjogRXJyb3IgfCBudWxsIHwgdW5kZWZpbmVkLFxyXG4gICAgYXNzZXQ/OiBJbWFnZUFzc2V0LFxyXG4gICAgKSA9PiB2b2lkO1xyXG5cclxuLyoqXHJcbiAqIOWKoOi9veaMh+WumueahOWbvuWDj+i1hOa6kOOAglxyXG4gKiBAcGFyYW0gdXJsIOWbvuWDj+i1hOa6kOeahOmTvuaOpeOAglxyXG4gKiBAcGFyYW0gY2FsbGJhY2sg5Zue6LCD5Ye95pWw44CCXHJcbiAqIEBwYXJhbSB0YXJnZXQg5Zue6LCD5Ye95pWw55qEIGB0aGlzYCDlj4LmlbDjgIJcclxuICogQHJldHVybnMg5Zu+5YOP6LWE5rqQ77yM6L+U5Zue5pe25Y+v6IO96L+Y5pyq5a6M5oiQ5Yqg6L2977yb5Yqg6L295a6M5oiQ5oiW5aSx6LSl5pe25Lya6LCD55So5Zue6LCD5Ye95pWw44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbG9hZEltYWdlPFQgZXh0ZW5kcyBvYmplY3Q+ICh1cmw6IHN0cmluZywgY2FsbGJhY2s/OiBMb2FkSW1hZ2VDYWxsYmFjazxUPiwgdGFyZ2V0PzogVCkge1xyXG4gICAgYXNzZXJ0SUQoISF1cmwsIDMxMDMpO1xyXG5cclxuICAgIGxldCBpbWFnZUFzc2V0ID0gbG9hZGVyLmdldFJlczxJbWFnZUFzc2V0Pih1cmwpO1xyXG4gICAgaWYgKGltYWdlQXNzZXQpIHtcclxuICAgICAgICBpZiAoaW1hZ2VBc3NldC5sb2FkZWQpIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKXtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGFyZ2V0LCBudWxsLCBpbWFnZUFzc2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW1hZ2VBc3NldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbWFnZUFzc2V0Lm9uY2UoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRhcmdldCwgbnVsbCwgaW1hZ2VBc3NldCEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0YXJnZXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gaW1hZ2VBc3NldDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGltYWdlQXNzZXQgPSBuZXcgSW1hZ2VBc3NldCgpO1xyXG4gICAgICAgIGxvYWRlci5sb2FkKHt1cmwsIGltYWdlQXNzZXR9LCAoZXJyLCBhc3NldCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRhcmdldCwgZXJyIHx8IG5ldyBFcnJvcignVW5rbm93biBlcnJvcicpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZUFzc2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0YXJnZXQsIG51bGwsIGFzc2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBpbWFnZUFzc2V0O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog57yT5a2Y5oyH5a6a55qE5Zu+5YOP5rqQ77yM5Li65a6D5oyH5a6a6ZO+5o6l44CC5q2k5ZCO77yM5Y+v5Lul6YCa6L+H6K+l6ZO+5o6l55u05o6l5Yqg6L295a6D44CCXHJcbiAqIEBwYXJhbSB1cmwg5oyH5a6a55qE6ZO+5o6l44CCXHJcbiAqIEBwYXJhbSBpbWFnZSDnvJPlrZjnmoTlm77lg4/mupDjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjYWNoZUltYWdlICh1cmw6IHN0cmluZywgaW1hZ2U6IEltYWdlU291cmNlKSB7XHJcbiAgICBpZiAodXJsICYmIGltYWdlKSB7XHJcbiAgICAgICAgY29uc3QgaW1hZ2VBc3NldCA9IG5ldyBJbWFnZUFzc2V0KGltYWdlKTtcclxuICAgICAgICBjb25zdCBpdGVtID0ge1xyXG4gICAgICAgICAgICBpZDogdXJsLFxyXG4gICAgICAgICAgICB1cmwsIC8vIHJlYWwgZG93bmxvYWQgdXJsLCBtYXliZSBjaGFuZ2VkXHJcbiAgICAgICAgICAgIGVycm9yOiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZW50OiBpbWFnZUFzc2V0LFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsb2FkZXIuZmxvd091dChpdGVtIGFzIElJdGVtKTtcclxuICAgICAgICByZXR1cm4gaW1hZ2VBc3NldDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWwneivleWKoOi9veWbvuWDj+i1hOa6kOeahOWunumZheaVsOaNruOAglxyXG4gKiBAcGFyYW0gaW1hZ2VBc3NldCDlm77lg4/otYTmupDjgIJcclxuICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg+WHveaVsOOAglxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHBvc3RMb2FkSW1hZ2UgKGltYWdlQXNzZXQ6IEltYWdlQXNzZXQsIGNhbGxiYWNrPzogRnVuY3Rpb24pIHtcclxuICAgIGlmIChpbWFnZUFzc2V0LmxvYWRlZCkge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoIWltYWdlQXNzZXQubmF0aXZlVXJsKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIGxvYWQgaW1hZ2VcclxuICAgIGxvYWRlci5sb2FkKHtcclxuICAgICAgICB1cmw6IGltYWdlQXNzZXQubmF0aXZlVXJsLFxyXG4gICAgICAgIC8vIEZvciBpbWFnZSwgd2Ugc2hvdWxkIHNraXAgbG9hZGVyIG90aGVyd2lzZSBpdCB3aWxsIGxvYWQgYSBuZXcgSW1hZ2VBc3NldFxyXG4gICAgICAgIHNraXBzOiBpbWFnZUFzc2V0LmlzQ29tcHJlc3NlZCA/IHVuZGVmaW5lZCA6IFsnTG9hZGVyJ10sXHJcbiAgICB9LCAoZXJyLCBpbWFnZSkgPT4ge1xyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgICBpZiAoREVCVUcgJiYgaW1hZ2UgaW5zdGFuY2VvZiBJbWFnZUFzc2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3IoJ2ludGVybmFsIGVycm9yOiBsb2FkZXIgaGFuZGxlIHBpcGUgbXVzdCBiZSBza2lwcGVkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFpbWFnZUFzc2V0LmxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VBc3NldC5fbmF0aXZlQXNzZXQgPSBpbWFnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4iXX0=