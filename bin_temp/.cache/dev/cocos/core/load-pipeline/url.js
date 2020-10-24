(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../default-constants.js", "../global-exports.js", "../platform/debug.js", "../utils/path.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"), require("../utils/path.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.globalExports, global.debug, global.path);
    global.url = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _globalExports, _debug, _path) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

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
   * @category loader
   */

  /**
   * @class url
   * @static
   */
  var url = {
    /**
     * The base url of raw assets.
     * @private
     * @readOnly
     */
    _rawAssets: '',
    normalize: function normalize(url) {
      if (url) {
        if (url.charCodeAt(0) === 46 && url.charCodeAt(1) === 47) {
          // strip './'
          url = url.slice(2);
        } else if (url.charCodeAt(0) === 47) {
          // strip '/'
          url = url.slice(1);
        }
      }

      return url;
    },

    /**
     * Returns the url of raw assets, you will only need this if the raw asset is inside the "resources" folder.
     *
     * @method raw
     * @param {String} url
     * @return {String}
     * @example {@link cocos/core/platform/url/raw.js}
     */
    raw: function raw(url) {
      if (_defaultConstants.EDITOR && !this._rawAssets) {
        (0, _debug.errorID)(7000);
        return '';
      }

      url = this.normalize(url);

      if (!url.startsWith('resources/')) {
        (0, _debug.errorID)(_defaultConstants.EDITOR ? 7001 : 7002, url);
      } else {
        // Compatible with versions lower than 1.10
        var uuid = _globalExports.legacyCC.loader._getResUuid(url.slice(10), _globalExports.legacyCC.Asset, null, true);

        if (uuid) {
          return _globalExports.legacyCC.AssetLibrary.getLibUrlNoExt(uuid, true) + (0, _path.extname)(url);
        }
      }

      return this._rawAssets + url;
    },
    _init: function _init(assets) {
      this._rawAssets = (0, _path.stripSep)(assets) + '/';
    }
  };
  _globalExports.legacyCC.url = url;
  var _default = url;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS91cmwudHMiXSwibmFtZXMiOlsidXJsIiwiX3Jhd0Fzc2V0cyIsIm5vcm1hbGl6ZSIsImNoYXJDb2RlQXQiLCJzbGljZSIsInJhdyIsIkVESVRPUiIsInN0YXJ0c1dpdGgiLCJ1dWlkIiwibGVnYWN5Q0MiLCJsb2FkZXIiLCJfZ2V0UmVzVXVpZCIsIkFzc2V0IiwiQXNzZXRMaWJyYXJ5IiwiZ2V0TGliVXJsTm9FeHQiLCJfaW5pdCIsImFzc2V0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7QUFTQTs7OztBQUlBLE1BQUlBLEdBQUcsR0FBRztBQUVOOzs7OztBQUtBQyxJQUFBQSxVQUFVLEVBQUUsRUFQTjtBQVNOQyxJQUFBQSxTQUFTLEVBQUUsbUJBQVVGLEdBQVYsRUFBZTtBQUN0QixVQUFJQSxHQUFKLEVBQVM7QUFDTCxZQUFJQSxHQUFHLENBQUNHLFVBQUosQ0FBZSxDQUFmLE1BQXNCLEVBQXRCLElBQTRCSCxHQUFHLENBQUNHLFVBQUosQ0FBZSxDQUFmLE1BQXNCLEVBQXRELEVBQTBEO0FBQ3REO0FBQ0FILFVBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDSSxLQUFKLENBQVUsQ0FBVixDQUFOO0FBQ0gsU0FIRCxNQUlLLElBQUlKLEdBQUcsQ0FBQ0csVUFBSixDQUFlLENBQWYsTUFBc0IsRUFBMUIsRUFBOEI7QUFDL0I7QUFDQUgsVUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNJLEtBQUosQ0FBVSxDQUFWLENBQU47QUFDSDtBQUNKOztBQUNELGFBQU9KLEdBQVA7QUFDSCxLQXJCSzs7QUF1Qk47Ozs7Ozs7O0FBUUFLLElBQUFBLEdBQUcsRUFBRSxhQUFVTCxHQUFWLEVBQWU7QUFDaEIsVUFBSU0sNEJBQVUsQ0FBQyxLQUFLTCxVQUFwQixFQUFnQztBQUM1Qiw0QkFBUSxJQUFSO0FBQ0EsZUFBTyxFQUFQO0FBQ0g7O0FBRURELE1BQUFBLEdBQUcsR0FBRyxLQUFLRSxTQUFMLENBQWVGLEdBQWYsQ0FBTjs7QUFFQSxVQUFLLENBQUNBLEdBQUcsQ0FBQ08sVUFBSixDQUFlLFlBQWYsQ0FBTixFQUFxQztBQUNqQyw0QkFBUUQsMkJBQVMsSUFBVCxHQUFnQixJQUF4QixFQUE4Qk4sR0FBOUI7QUFDSCxPQUZELE1BR0s7QUFDRDtBQUNBLFlBQUlRLElBQUksR0FBR0Msd0JBQVNDLE1BQVQsQ0FBZ0JDLFdBQWhCLENBQTRCWCxHQUFHLENBQUNJLEtBQUosQ0FBVSxFQUFWLENBQTVCLEVBQTJDSyx3QkFBU0csS0FBcEQsRUFBMkQsSUFBM0QsRUFBaUUsSUFBakUsQ0FBWDs7QUFDQSxZQUFJSixJQUFKLEVBQVU7QUFDTixpQkFBT0Msd0JBQVNJLFlBQVQsQ0FBc0JDLGNBQXRCLENBQXFDTixJQUFyQyxFQUEyQyxJQUEzQyxJQUFtRCxtQkFBUVIsR0FBUixDQUExRDtBQUNIO0FBQ0o7O0FBRUQsYUFBTyxLQUFLQyxVQUFMLEdBQWtCRCxHQUF6QjtBQUNILEtBbkRLO0FBcUROZSxJQUFBQSxLQUFLLEVBQUUsZUFBVUMsTUFBVixFQUFrQjtBQUNyQixXQUFLZixVQUFMLEdBQWtCLG9CQUFTZSxNQUFULElBQW1CLEdBQXJDO0FBQ0g7QUF2REssR0FBVjtBQTBEQVAsMEJBQVNULEdBQVQsR0FBZUEsR0FBZjtpQkFFZUEsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGxvYWRlclxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBlcnJvcklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBleHRuYW1lLCBzdHJpcFNlcCB9IGZyb20gJy4uL3V0aWxzL3BhdGgnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyB1cmxcclxuICogQHN0YXRpY1xyXG4gKi9cclxubGV0IHVybCA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBiYXNlIHVybCBvZiByYXcgYXNzZXRzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZWFkT25seVxyXG4gICAgICovXHJcbiAgICBfcmF3QXNzZXRzOiAnJyxcclxuXHJcbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uICh1cmwpIHtcclxuICAgICAgICBpZiAodXJsKSB7XHJcbiAgICAgICAgICAgIGlmICh1cmwuY2hhckNvZGVBdCgwKSA9PT0gNDYgJiYgdXJsLmNoYXJDb2RlQXQoMSkgPT09IDQ3KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzdHJpcCAnLi8nXHJcbiAgICAgICAgICAgICAgICB1cmwgPSB1cmwuc2xpY2UoMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodXJsLmNoYXJDb2RlQXQoMCkgPT09IDQ3KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzdHJpcCAnLydcclxuICAgICAgICAgICAgICAgIHVybCA9IHVybC5zbGljZSgxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHVybCBvZiByYXcgYXNzZXRzLCB5b3Ugd2lsbCBvbmx5IG5lZWQgdGhpcyBpZiB0aGUgcmF3IGFzc2V0IGlzIGluc2lkZSB0aGUgXCJyZXNvdXJjZXNcIiBmb2xkZXIuXHJcbiAgICAgKlxyXG4gICAgICogQG1ldGhvZCByYXdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqIEBleGFtcGxlIHtAbGluayBjb2Nvcy9jb3JlL3BsYXRmb3JtL3VybC9yYXcuanN9XHJcbiAgICAgKi9cclxuICAgIHJhdzogZnVuY3Rpb24gKHVybCkge1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgIXRoaXMuX3Jhd0Fzc2V0cykge1xyXG4gICAgICAgICAgICBlcnJvcklEKDcwMDApO1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cmwgPSB0aGlzLm5vcm1hbGl6ZSh1cmwpO1xyXG5cclxuICAgICAgICBpZiAoICF1cmwuc3RhcnRzV2l0aCgncmVzb3VyY2VzLycpICkge1xyXG4gICAgICAgICAgICBlcnJvcklEKEVESVRPUiA/IDcwMDEgOiA3MDAyLCB1cmwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gQ29tcGF0aWJsZSB3aXRoIHZlcnNpb25zIGxvd2VyIHRoYW4gMS4xMFxyXG4gICAgICAgICAgICB2YXIgdXVpZCA9IGxlZ2FjeUNDLmxvYWRlci5fZ2V0UmVzVXVpZCh1cmwuc2xpY2UoMTApLCBsZWdhY3lDQy5Bc3NldCwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVnYWN5Q0MuQXNzZXRMaWJyYXJ5LmdldExpYlVybE5vRXh0KHV1aWQsIHRydWUpICsgZXh0bmFtZSh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmF3QXNzZXRzICsgdXJsO1xyXG4gICAgfSxcclxuXHJcbiAgICBfaW5pdDogZnVuY3Rpb24gKGFzc2V0cykge1xyXG4gICAgICAgIHRoaXMuX3Jhd0Fzc2V0cyA9IHN0cmlwU2VwKGFzc2V0cykgKyAnLyc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLnVybCA9IHVybDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHVybDtcclxuIl19