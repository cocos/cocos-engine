(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "../platform/debug.js", "./pipeline.js", "./pack-downloader.js", "./binary-downloader.js", "./text-downloader.js", "./utils.js", "../../audio/audio-downloader.js", "../../video/video-downloader.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("../platform/debug.js"), require("./pipeline.js"), require("./pack-downloader.js"), require("./binary-downloader.js"), require("./text-downloader.js"), require("./utils.js"), require("../../audio/audio-downloader.js"), require("../../video/video-downloader.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.debug, global.pipeline, global.packDownloader, global.binaryDownloader, global.textDownloader, global.utils, global.audioDownloader, global.videoDownloader, global.globalExports);
    global.downloader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _js, debug, _pipeline, PackDownloader, _binaryDownloader, _textDownloader, _utils, _audioDownloader, _videoDownloader, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  debug = _interopRequireWildcard(debug);
  PackDownloader = _interopRequireWildcard(PackDownloader);
  _binaryDownloader = _interopRequireDefault(_binaryDownloader);
  _textDownloader = _interopRequireDefault(_textDownloader);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function skip() {
    return null;
  }

  function downloadScript(item, callback, isAsync) {
    var url = item.url,
        d = document,
        s = document.createElement('script');
    s.async = !!isAsync;
    s.src = (0, _utils.urlAppendTimestamp)(url);

    function loadHandler() {
      if (s.parentNode) s.parentNode.removeChild(s);
      s.removeEventListener('load', loadHandler, false);
      s.removeEventListener('error', errorHandler, false);
      callback(null, url);
    }

    function errorHandler() {
      if (s.parentNode) s.parentNode.removeChild(s);
      s.removeEventListener('load', loadHandler, false);
      s.removeEventListener('error', errorHandler, false);
      callback(new Error(debug.getError(4928, url)));
    }

    s.addEventListener('load', loadHandler, false);
    s.addEventListener('error', errorHandler, false);
    d.body.appendChild(s);
  }

  function downloadImage(item, callback, isCrossOrigin, img) {
    if (isCrossOrigin === undefined) {
      isCrossOrigin = true;
    }

    var url = (0, _utils.urlAppendTimestamp)(item.url);
    img = img || new Image();

    if (isCrossOrigin && window.location.protocol !== 'file:') {
      img.crossOrigin = 'anonymous';
    } else {
      img.crossOrigin = null;
    }

    function loadCallback() {
      img.removeEventListener('load', loadCallback);
      img.removeEventListener('error', errorCallback);
      img.id = item.id;
      callback(null, img);
    }

    function errorCallback() {
      img.removeEventListener('load', loadCallback);
      img.removeEventListener('error', errorCallback); // Retry without crossOrigin mark if crossOrigin loading fails
      // Do not retry if protocol is https, even if the image is loaded, cross origin image isn't renderable.

      if (window.location.protocol !== 'https:' && img.crossOrigin && img.crossOrigin.toLowerCase() === 'anonymous') {
        downloadImage(item, callback, false, img);
      } else {
        callback(new Error(debug.getError(4930, url)));
      }
    }

    if (img.complete && img.naturalWidth > 0 && img.src === url) {
      return img;
    } else {
      img.addEventListener('load', loadCallback);
      img.addEventListener('error', errorCallback);
      img.src = url;
    }
  }

  function downloadUuid(item, callback) {
    var result = PackDownloader.load(item, callback);

    if (result === undefined) {
      // @ts-ignore
      return this.extMap['json'](item, callback);
    }

    return result || undefined;
  }

  var defaultMap = {
    // JS
    'js': downloadScript,
    // Images
    'png': downloadImage,
    'jpg': downloadImage,
    'bmp': downloadImage,
    'jpeg': downloadImage,
    'gif': downloadImage,
    'ico': downloadImage,
    'tiff': downloadImage,
    'webp': downloadImage,
    'image': downloadImage,
    'pvr': _binaryDownloader.default,
    'pkm': _binaryDownloader.default,
    'astc': _binaryDownloader.default,
    // Audio
    'mp3': _audioDownloader.downloadAudio,
    'ogg': _audioDownloader.downloadAudio,
    'wav': _audioDownloader.downloadAudio,
    'm4a': _audioDownloader.downloadAudio,
    // Video
    'mp4': _videoDownloader.downloadVideo,
    // Txt
    'txt': _textDownloader.default,
    'xml': _textDownloader.default,
    'vsh': _textDownloader.default,
    'fsh': _textDownloader.default,
    'atlas': _textDownloader.default,
    'tmx': _textDownloader.default,
    'tsx': _textDownloader.default,
    'json': _textDownloader.default,
    'ExportJson': _textDownloader.default,
    'plist': _textDownloader.default,
    'fnt': _textDownloader.default,
    // Font
    'font': skip,
    'eot': skip,
    'ttf': skip,
    'woff': skip,
    'svg': skip,
    'ttc': skip,
    // Deserializer
    'uuid': downloadUuid,
    // Binary
    'binary': _binaryDownloader.default,
    'bin': _binaryDownloader.default,
    'default': _textDownloader.default
  };
  var ID = 'Downloader';

  /**
   * @en The downloader pipe in {{loader}}, it can download several types of files:
   * 1. Text
   * 2. Image
   * 3. Script
   * 4. Audio
   * 5. Binary
   * All unknown type will be downloaded as plain text.
   * You can pass custom supported types in the {{loader.addDownloadHandlers}}.
   * @zh {{loader}} 中的下载管线，可以下载下列类型的文件：
   * 1. Text
   * 2. Image
   * 3. Script
   * 4. Audio
   * 5. Binary
   * 所有未知类型会被当做文本来下载，也可以通过 {{loader.addDownloadHandlers}} 来定制下载行为
   */
  var Downloader = /*#__PURE__*/function () {
    function Downloader(extMap) {
      _classCallCheck(this, Downloader);

      this.id = ID;
      this.async = true;
      this.pipeline = null;
      this.extMap = void 0;
      this._curConcurrent = 0;
      this._loadQueue = [];
      this._subPackages = {};
      this.extMap = (0, _js.mixin)(extMap, defaultMap);
    }
    /**
     * @en Set sub package configurations, only available in certain platforms
     * @zh 设置子包配置，只在部分平台支持
     * @param subPackages
     */


    _createClass(Downloader, [{
      key: "setSubPackages",
      value: function setSubPackages(subPackages) {
        this._subPackages = subPackages;
      }
      /**
       * @en Add custom supported types handler or modify existing type handler.
       * @zh 添加自定义支持的类型处理程序或修改现有的类型处理程序。
       * @param extMap Custom supported types with corresponded handler
       */

    }, {
      key: "addHandlers",
      value: function addHandlers(extMap) {
        (0, _js.mixin)(this.extMap, extMap);
      }
    }, {
      key: "_handleLoadQueue",
      value: function _handleLoadQueue() {
        while (this._curConcurrent < _globalExports.legacyCC.macro.DOWNLOAD_MAX_CONCURRENT) {
          var nextOne = this._loadQueue.shift();

          if (!nextOne) {
            break;
          }

          var syncRet = this.handle(nextOne.item, nextOne.callback);

          if (syncRet !== undefined) {
            if (syncRet instanceof Error) {
              nextOne.callback(syncRet);
            } else {
              nextOne.callback(null, syncRet);
            }
          }
        }
      }
    }, {
      key: "handle",
      value: function handle(item, callback) {
        var self = this;
        var downloadFunc = this.extMap[item.type] || this.extMap['default'];
        var syncRet = undefined;

        if (this._curConcurrent < _globalExports.legacyCC.macro.DOWNLOAD_MAX_CONCURRENT) {
          this._curConcurrent++;
          syncRet = downloadFunc.call(this, item, function (err, result) {
            self._curConcurrent = Math.max(0, self._curConcurrent - 1);

            self._handleLoadQueue();

            callback && callback(err, result);
          });

          if (syncRet !== undefined) {
            this._curConcurrent = Math.max(0, this._curConcurrent - 1);

            this._handleLoadQueue();

            return syncRet;
          }
        } else if (item.ignoreMaxConcurrency) {
          syncRet = downloadFunc.call(this, item, callback);

          if (syncRet !== undefined) {
            return syncRet;
          }
        } else {
          this._loadQueue.push({
            item: item,
            callback: callback
          });
        }
      }
      /**
       * @en Load sub package with name.
       * @zh 通过子包名加载子包代码。
       * @param name - Sub package name
       * @param completeCallback -  Callback invoked when sub package loaded
       * @param {Error} completeCallback.error - error information
       */

    }, {
      key: "loadSubpackage",
      value: function loadSubpackage(name, completeCallback) {
        var pac = this._subPackages[name];

        if (pac) {
          if (pac.loaded) {
            if (completeCallback) completeCallback();
          } else {
            downloadScript({
              url: pac.path
            }, function (err) {
              if (!err) {
                pac.loaded = true;
              }

              if (completeCallback) completeCallback(err);
            });
          }
        } else if (completeCallback) {
          completeCallback(new Error("Can't find subpackage ".concat(name)));
        }
      }
    }]);

    return Downloader;
  }(); // @ts-ignore


  _exports.default = Downloader;
  Downloader.ID = ID;
  Downloader.PackDownloader = PackDownloader;
  _pipeline.Pipeline.Downloader = Downloader;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9kb3dubG9hZGVyLnRzIl0sIm5hbWVzIjpbInNraXAiLCJkb3dubG9hZFNjcmlwdCIsIml0ZW0iLCJjYWxsYmFjayIsImlzQXN5bmMiLCJ1cmwiLCJkIiwiZG9jdW1lbnQiLCJzIiwiY3JlYXRlRWxlbWVudCIsImFzeW5jIiwic3JjIiwibG9hZEhhbmRsZXIiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZXJyb3JIYW5kbGVyIiwiRXJyb3IiLCJkZWJ1ZyIsImdldEVycm9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImRvd25sb2FkSW1hZ2UiLCJpc0Nyb3NzT3JpZ2luIiwiaW1nIiwidW5kZWZpbmVkIiwiSW1hZ2UiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByb3RvY29sIiwiY3Jvc3NPcmlnaW4iLCJsb2FkQ2FsbGJhY2siLCJlcnJvckNhbGxiYWNrIiwiaWQiLCJ0b0xvd2VyQ2FzZSIsImNvbXBsZXRlIiwibmF0dXJhbFdpZHRoIiwiZG93bmxvYWRVdWlkIiwicmVzdWx0IiwiUGFja0Rvd25sb2FkZXIiLCJsb2FkIiwiZXh0TWFwIiwiZGVmYXVsdE1hcCIsImRvd25sb2FkQmluYXJ5IiwiZG93bmxvYWRBdWRpbyIsImRvd25sb2FkVmlkZW8iLCJkb3dubG9hZFRleHQiLCJJRCIsIkRvd25sb2FkZXIiLCJwaXBlbGluZSIsIl9jdXJDb25jdXJyZW50IiwiX2xvYWRRdWV1ZSIsIl9zdWJQYWNrYWdlcyIsInN1YlBhY2thZ2VzIiwibGVnYWN5Q0MiLCJtYWNybyIsIkRPV05MT0FEX01BWF9DT05DVVJSRU5UIiwibmV4dE9uZSIsInNoaWZ0Iiwic3luY1JldCIsImhhbmRsZSIsInNlbGYiLCJkb3dubG9hZEZ1bmMiLCJ0eXBlIiwiY2FsbCIsImVyciIsIk1hdGgiLCJtYXgiLCJfaGFuZGxlTG9hZFF1ZXVlIiwiaWdub3JlTWF4Q29uY3VycmVuY3kiLCJwdXNoIiwibmFtZSIsImNvbXBsZXRlQ2FsbGJhY2siLCJwYWMiLCJsb2FkZWQiLCJwYXRoIiwiUGlwZWxpbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQSxXQUFTQSxJQUFULEdBQWlCO0FBQ2IsV0FBTyxJQUFQO0FBQ0g7O0FBRUQsV0FBU0MsY0FBVCxDQUF5QkMsSUFBekIsRUFBK0JDLFFBQS9CLEVBQXlDQyxPQUF6QyxFQUFtRDtBQUMvQyxRQUFJQyxHQUFHLEdBQUdILElBQUksQ0FBQ0csR0FBZjtBQUFBLFFBQ0lDLENBQUMsR0FBR0MsUUFEUjtBQUFBLFFBRUlDLENBQUMsR0FBR0QsUUFBUSxDQUFDRSxhQUFULENBQXVCLFFBQXZCLENBRlI7QUFHQUQsSUFBQUEsQ0FBQyxDQUFDRSxLQUFGLEdBQVUsQ0FBQyxDQUFDTixPQUFaO0FBQ0FJLElBQUFBLENBQUMsQ0FBQ0csR0FBRixHQUFRLCtCQUFtQk4sR0FBbkIsQ0FBUjs7QUFDQSxhQUFTTyxXQUFULEdBQXdCO0FBQ3BCLFVBQUlKLENBQUMsQ0FBQ0ssVUFBTixFQUNJTCxDQUFDLENBQUNLLFVBQUYsQ0FBYUMsV0FBYixDQUF5Qk4sQ0FBekI7QUFDSkEsTUFBQUEsQ0FBQyxDQUFDTyxtQkFBRixDQUFzQixNQUF0QixFQUE4QkgsV0FBOUIsRUFBMkMsS0FBM0M7QUFDQUosTUFBQUEsQ0FBQyxDQUFDTyxtQkFBRixDQUFzQixPQUF0QixFQUErQkMsWUFBL0IsRUFBNkMsS0FBN0M7QUFDQWIsTUFBQUEsUUFBUSxDQUFDLElBQUQsRUFBT0UsR0FBUCxDQUFSO0FBQ0g7O0FBQ0QsYUFBU1csWUFBVCxHQUF3QjtBQUNwQixVQUFJUixDQUFDLENBQUNLLFVBQU4sRUFDSUwsQ0FBQyxDQUFDSyxVQUFGLENBQWFDLFdBQWIsQ0FBeUJOLENBQXpCO0FBQ0pBLE1BQUFBLENBQUMsQ0FBQ08sbUJBQUYsQ0FBc0IsTUFBdEIsRUFBOEJILFdB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QThHNUJxQyxxQkFBUzVCLFVBQVQsR0FBc0JBLFVBQXRCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgbG9hZGVyXHJcbiAqL1xyXG5cclxuaW1wb3J0IHttaXhpbn0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgKiBhcyBkZWJ1ZyBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IFBpcGVsaW5lLCBJUGlwZSB9IGZyb20gJy4vcGlwZWxpbmUnO1xyXG5pbXBvcnQgKiBhcyBQYWNrRG93bmxvYWRlciBmcm9tICcuL3BhY2stZG93bmxvYWRlcic7XHJcbmltcG9ydCBkb3dubG9hZEJpbmFyeSBmcm9tICcuL2JpbmFyeS1kb3dubG9hZGVyJztcclxuaW1wb3J0IGRvd25sb2FkVGV4dCBmcm9tICcuL3RleHQtZG93bmxvYWRlcic7XHJcbmltcG9ydCB7dXJsQXBwZW5kVGltZXN0YW1wfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgZG93bmxvYWRBdWRpbyB9IGZyb20gJy4uLy4uL2F1ZGlvL2F1ZGlvLWRvd25sb2FkZXInO1xyXG5pbXBvcnQgeyBkb3dubG9hZFZpZGVvIH0gZnJvbSBcIi4uLy4uL3ZpZGVvL3ZpZGVvLWRvd25sb2FkZXJcIjtcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5mdW5jdGlvbiBza2lwICgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkb3dubG9hZFNjcmlwdCAoaXRlbSwgY2FsbGJhY2ssIGlzQXN5bmM/KSB7XHJcbiAgICBsZXQgdXJsID0gaXRlbS51cmwsXHJcbiAgICAgICAgZCA9IGRvY3VtZW50LFxyXG4gICAgICAgIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIHMuYXN5bmMgPSAhIWlzQXN5bmM7XHJcbiAgICBzLnNyYyA9IHVybEFwcGVuZFRpbWVzdGFtcCh1cmwpO1xyXG4gICAgZnVuY3Rpb24gbG9hZEhhbmRsZXIgKCkge1xyXG4gICAgICAgIGlmIChzLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgIHMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzKTtcclxuICAgICAgICBzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgIHMucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvckhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB1cmwpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZXJyb3JIYW5kbGVyKCkge1xyXG4gICAgICAgIGlmIChzLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgIHMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzKTtcclxuICAgICAgICBzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgIHMucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvckhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkyOCwgdXJsKSkpO1xyXG4gICAgfVxyXG4gICAgcy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIHMuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvckhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGQuYm9keS5hcHBlbmRDaGlsZChzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZG93bmxvYWRJbWFnZSAoaXRlbSwgY2FsbGJhY2ssIGlzQ3Jvc3NPcmlnaW4sIGltZykge1xyXG4gICAgaWYgKGlzQ3Jvc3NPcmlnaW4gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlzQ3Jvc3NPcmlnaW4gPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB1cmwgPSB1cmxBcHBlbmRUaW1lc3RhbXAoaXRlbS51cmwpO1xyXG4gICAgaW1nID0gaW1nIHx8IG5ldyBJbWFnZSgpO1xyXG4gICAgaWYgKGlzQ3Jvc3NPcmlnaW4gJiYgd2luZG93LmxvY2F0aW9uLnByb3RvY29sICE9PSAnZmlsZTonKSB7XHJcbiAgICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpbWcuY3Jvc3NPcmlnaW4gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRDYWxsYmFjayAoKSB7XHJcbiAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkQ2FsbGJhY2spO1xyXG4gICAgICAgIGltZy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICBpbWcuaWQgPSBpdGVtLmlkO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGltZyk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBlcnJvckNhbGxiYWNrICgpIHtcclxuICAgICAgICBpbWcucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRDYWxsYmFjayk7XHJcbiAgICAgICAgaW1nLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JDYWxsYmFjayk7XHJcblxyXG4gICAgICAgIC8vIFJldHJ5IHdpdGhvdXQgY3Jvc3NPcmlnaW4gbWFyayBpZiBjcm9zc09yaWdpbiBsb2FkaW5nIGZhaWxzXHJcbiAgICAgICAgLy8gRG8gbm90IHJldHJ5IGlmIHByb3RvY29sIGlzIGh0dHBzLCBldmVuIGlmIHRoZSBpbWFnZSBpcyBsb2FkZWQsIGNyb3NzIG9yaWdpbiBpbWFnZSBpc24ndCByZW5kZXJhYmxlLlxyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgIT09ICdodHRwczonICYmIGltZy5jcm9zc09yaWdpbiAmJiBpbWcuY3Jvc3NPcmlnaW4udG9Mb3dlckNhc2UoKSA9PT0gJ2Fub255bW91cycpIHtcclxuICAgICAgICAgICAgZG93bmxvYWRJbWFnZShpdGVtLCBjYWxsYmFjaywgZmFsc2UsIGltZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkzMCwgdXJsKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggPiAwICYmIGltZy5zcmMgPT09IHVybCkge1xyXG4gICAgICAgIHJldHVybiBpbWc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRDYWxsYmFjayk7XHJcbiAgICAgICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3JDYWxsYmFjayk7XHJcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZG93bmxvYWRVdWlkIChpdGVtLCBjYWxsYmFjaykge1xyXG4gICAgbGV0IHJlc3VsdCA9IFBhY2tEb3dubG9hZGVyLmxvYWQoaXRlbSwgY2FsbGJhY2spO1xyXG4gICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHJldHVybiB0aGlzLmV4dE1hcFsnanNvbiddKGl0ZW0sIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQgfHwgdW5kZWZpbmVkO1xyXG59XHJcblxyXG5cclxubGV0IGRlZmF1bHRNYXAgPSB7XHJcbiAgICAvLyBKU1xyXG4gICAgJ2pzJyA6IGRvd25sb2FkU2NyaXB0LFxyXG5cclxuICAgIC8vIEltYWdlc1xyXG4gICAgJ3BuZycgOiBkb3dubG9hZEltYWdlLFxyXG4gICAgJ2pwZycgOiBkb3dubG9hZEltYWdlLFxyXG4gICAgJ2JtcCcgOiBkb3dubG9hZEltYWdlLFxyXG4gICAgJ2pwZWcnIDogZG93bmxvYWRJbWFnZSxcclxuICAgICdnaWYnIDogZG93bmxvYWRJbWFnZSxcclxuICAgICdpY28nIDogZG93bmxvYWRJbWFnZSxcclxuICAgICd0aWZmJyA6IGRvd25sb2FkSW1hZ2UsXHJcbiAgICAnd2VicCcgOiBkb3dubG9hZEltYWdlLFxyXG4gICAgJ2ltYWdlJyA6IGRvd25sb2FkSW1hZ2UsXHJcbiAgICAncHZyJzogZG93bmxvYWRCaW5hcnksXHJcbiAgICAncGttJzogZG93bmxvYWRCaW5hcnksXHJcbiAgICAnYXN0Yyc6IGRvd25sb2FkQmluYXJ5LFxyXG5cclxuICAgIC8vIEF1ZGlvXHJcbiAgICAnbXAzJyA6IGRvd25sb2FkQXVkaW8sXHJcbiAgICAnb2dnJyA6IGRvd25sb2FkQXVkaW8sXHJcbiAgICAnd2F2JyA6IGRvd25sb2FkQXVkaW8sXHJcbiAgICAnbTRhJyA6IGRvd25sb2FkQXVkaW8sXHJcblxyXG4gICAgLy8gVmlkZW9cclxuICAgICdtcDQnIDogZG93bmxvYWRWaWRlbyxcclxuXHJcbiAgICAvLyBUeHRcclxuICAgICd0eHQnIDogZG93bmxvYWRUZXh0LFxyXG4gICAgJ3htbCcgOiBkb3dubG9hZFRleHQsXHJcbiAgICAndnNoJyA6IGRvd25sb2FkVGV4dCxcclxuICAgICdmc2gnIDogZG93bmxvYWRUZXh0LFxyXG4gICAgJ2F0bGFzJyA6IGRvd25sb2FkVGV4dCxcclxuXHJcbiAgICAndG14JyA6IGRvd25sb2FkVGV4dCxcclxuICAgICd0c3gnIDogZG93bmxvYWRUZXh0LFxyXG5cclxuICAgICdqc29uJyA6IGRvd25sb2FkVGV4dCxcclxuICAgICdFeHBvcnRKc29uJyA6IGRvd25sb2FkVGV4dCxcclxuICAgICdwbGlzdCcgOiBkb3dubG9hZFRleHQsXHJcblxyXG4gICAgJ2ZudCcgOiBkb3dubG9hZFRleHQsXHJcblxyXG4gICAgLy8gRm9udFxyXG4gICAgJ2ZvbnQnIDogc2tpcCxcclxuICAgICdlb3QnIDogc2tpcCxcclxuICAgICd0dGYnIDogc2tpcCxcclxuICAgICd3b2ZmJyA6IHNraXAsXHJcbiAgICAnc3ZnJyA6IHNraXAsXHJcbiAgICAndHRjJyA6IHNraXAsXHJcblxyXG4gICAgLy8gRGVzZXJpYWxpemVyXHJcbiAgICAndXVpZCcgOiBkb3dubG9hZFV1aWQsXHJcblxyXG4gICAgLy8gQmluYXJ5XHJcbiAgICAnYmluYXJ5JyA6IGRvd25sb2FkQmluYXJ5LFxyXG4gICAgJ2Jpbic6IGRvd25sb2FkQmluYXJ5LFxyXG5cclxuICAgICdkZWZhdWx0JyA6IGRvd25sb2FkVGV4dFxyXG59O1xyXG5cclxuY29uc3QgSUQgPSAnRG93bmxvYWRlcic7XHJcblxyXG5pbnRlcmZhY2UgSURvd25sb2FkSXRlbSB7XHJcbiAgICBpdGVtO1xyXG4gICAgY2FsbGJhY2s7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIGRvd25sb2FkZXIgcGlwZSBpbiB7e2xvYWRlcn19LCBpdCBjYW4gZG93bmxvYWQgc2V2ZXJhbCB0eXBlcyBvZiBmaWxlczpcclxuICogMS4gVGV4dFxyXG4gKiAyLiBJbWFnZVxyXG4gKiAzLiBTY3JpcHRcclxuICogNC4gQXVkaW9cclxuICogNS4gQmluYXJ5XHJcbiAqIEFsbCB1bmtub3duIHR5cGUgd2lsbCBiZSBkb3dubG9hZGVkIGFzIHBsYWluIHRleHQuXHJcbiAqIFlvdSBjYW4gcGFzcyBjdXN0b20gc3VwcG9ydGVkIHR5cGVzIGluIHRoZSB7e2xvYWRlci5hZGREb3dubG9hZEhhbmRsZXJzfX0uXHJcbiAqIEB6aCB7e2xvYWRlcn19IOS4reeahOS4i+i9veeuoee6v++8jOWPr+S7peS4i+i9veS4i+WIl+exu+Wei+eahOaWh+S7tu+8mlxyXG4gKiAxLiBUZXh0XHJcbiAqIDIuIEltYWdlXHJcbiAqIDMuIFNjcmlwdFxyXG4gKiA0LiBBdWRpb1xyXG4gKiA1LiBCaW5hcnlcclxuICog5omA5pyJ5pyq55+l57G75Z6L5Lya6KKr5b2T5YGa5paH5pys5p2l5LiL6L2977yM5Lmf5Y+v5Lul6YCa6L+HIHt7bG9hZGVyLmFkZERvd25sb2FkSGFuZGxlcnN9fSDmnaXlrprliLbkuIvovb3ooYzkuLpcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkZXIgaW1wbGVtZW50cyBJUGlwZSB7XHJcbiAgICBzdGF0aWMgSUQgPSBJRDtcclxuICAgIHN0YXRpYyBQYWNrRG93bmxvYWRlciA9IFBhY2tEb3dubG9hZGVyO1xyXG5cclxuICAgIHB1YmxpYyBpZDogc3RyaW5nID0gSUQ7XHJcbiAgICBwdWJsaWMgYXN5bmM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHBpcGVsaW5lOiBQaXBlbGluZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBleHRNYXA6IG9iamVjdDtcclxuICAgIHByaXZhdGUgX2N1ckNvbmN1cnJlbnQgPSAwO1xyXG4gICAgcHJpdmF0ZSBfbG9hZFF1ZXVlOiBBcnJheTxJRG93bmxvYWRJdGVtPiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc3ViUGFja2FnZXMgPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZXh0TWFwPykge1xyXG4gICAgICAgIHRoaXMuZXh0TWFwID0gbWl4aW4oZXh0TWFwLCBkZWZhdWx0TWFwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgc3ViIHBhY2thZ2UgY29uZmlndXJhdGlvbnMsIG9ubHkgYXZhaWxhYmxlIGluIGNlcnRhaW4gcGxhdGZvcm1zXHJcbiAgICAgKiBAemgg6K6+572u5a2Q5YyF6YWN572u77yM5Y+q5Zyo6YOo5YiG5bmz5Y+w5pSv5oyBXHJcbiAgICAgKiBAcGFyYW0gc3ViUGFja2FnZXNcclxuICAgICAqL1xyXG4gICAgc2V0U3ViUGFja2FnZXMgKHN1YlBhY2thZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5fc3ViUGFja2FnZXMgPSBzdWJQYWNrYWdlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGQgY3VzdG9tIHN1cHBvcnRlZCB0eXBlcyBoYW5kbGVyIG9yIG1vZGlmeSBleGlzdGluZyB0eXBlIGhhbmRsZXIuXHJcbiAgICAgKiBAemgg5re75Yqg6Ieq5a6a5LmJ5pSv5oyB55qE57G75Z6L5aSE55CG56iL5bqP5oiW5L+u5pS5546w5pyJ55qE57G75Z6L5aSE55CG56iL5bqP44CCXHJcbiAgICAgKiBAcGFyYW0gZXh0TWFwIEN1c3RvbSBzdXBwb3J0ZWQgdHlwZXMgd2l0aCBjb3JyZXNwb25kZWQgaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBhZGRIYW5kbGVycyAoZXh0TWFwOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj4pIHtcclxuICAgICAgICBtaXhpbih0aGlzLmV4dE1hcCwgZXh0TWFwKTtcclxuICAgIH1cclxuXHJcbiAgICBfaGFuZGxlTG9hZFF1ZXVlICgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5fY3VyQ29uY3VycmVudCA8IGxlZ2FjeUNDLm1hY3JvLkRPV05MT0FEX01BWF9DT05DVVJSRU5UKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXh0T25lID0gdGhpcy5fbG9hZFF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGlmICghbmV4dE9uZSkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHN5bmNSZXQgPSB0aGlzLmhhbmRsZShuZXh0T25lLml0ZW0sIG5leHRPbmUuY2FsbGJhY2spIGFzIGFueTtcclxuICAgICAgICAgICAgaWYgKHN5bmNSZXQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN5bmNSZXQgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRPbmUuY2FsbGJhY2soc3luY1JldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0T25lLmNhbGxiYWNrKG51bGwsIHN5bmNSZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZSAoaXRlbSwgY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGRvd25sb2FkRnVuYyA9IHRoaXMuZXh0TWFwW2l0ZW0udHlwZV0gfHwgdGhpcy5leHRNYXBbJ2RlZmF1bHQnXTtcclxuICAgICAgICBsZXQgc3luY1JldCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5fY3VyQ29uY3VycmVudCA8IGxlZ2FjeUNDLm1hY3JvLkRPV05MT0FEX01BWF9DT05DVVJSRU5UKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1ckNvbmN1cnJlbnQrKztcclxuICAgICAgICAgICAgc3luY1JldCA9IGRvd25sb2FkRnVuYy5jYWxsKHRoaXMsIGl0ZW0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5fY3VyQ29uY3VycmVudCA9IE1hdGgubWF4KDAsIHNlbGYuX2N1ckNvbmN1cnJlbnQgLSAxKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2hhbmRsZUxvYWRRdWV1ZSgpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHN5bmNSZXQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyQ29uY3VycmVudCA9IE1hdGgubWF4KDAsIHRoaXMuX2N1ckNvbmN1cnJlbnQgLSAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZUxvYWRRdWV1ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN5bmNSZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXRlbS5pZ25vcmVNYXhDb25jdXJyZW5jeSkge1xyXG4gICAgICAgICAgICBzeW5jUmV0ID0gZG93bmxvYWRGdW5jLmNhbGwodGhpcywgaXRlbSwgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICBpZiAoc3luY1JldCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3luY1JldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9hZFF1ZXVlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaXRlbTogaXRlbSxcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTG9hZCBzdWIgcGFja2FnZSB3aXRoIG5hbWUuXHJcbiAgICAgKiBAemgg6YCa6L+H5a2Q5YyF5ZCN5Yqg6L295a2Q5YyF5Luj56CB44CCXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFN1YiBwYWNrYWdlIG5hbWVcclxuICAgICAqIEBwYXJhbSBjb21wbGV0ZUNhbGxiYWNrIC0gIENhbGxiYWNrIGludm9rZWQgd2hlbiBzdWIgcGFja2FnZSBsb2FkZWRcclxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGNvbXBsZXRlQ2FsbGJhY2suZXJyb3IgLSBlcnJvciBpbmZvcm1hdGlvblxyXG4gICAgICovXHJcbiAgICBsb2FkU3VicGFja2FnZSAobmFtZTogc3RyaW5nLCBjb21wbGV0ZUNhbGxiYWNrPzogRnVuY3Rpb24pIHtcclxuICAgICAgICBsZXQgcGFjID0gdGhpcy5fc3ViUGFja2FnZXNbbmFtZV07XHJcbiAgICAgICAgaWYgKHBhYykge1xyXG4gICAgICAgICAgICBpZiAocGFjLmxvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlQ2FsbGJhY2spIGNvbXBsZXRlQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvd25sb2FkU2NyaXB0KHt1cmw6IHBhYy5wYXRofSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhYy5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjaykgY29tcGxldGVDYWxsYmFjayhlcnIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29tcGxldGVDYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjb21wbGV0ZUNhbGxiYWNrKG5ldyBFcnJvcihgQ2FuJ3QgZmluZCBzdWJwYWNrYWdlICR7bmFtZX1gKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBAdHMtaWdub3JlXHJcblBpcGVsaW5lLkRvd25sb2FkZXIgPSBEb3dubG9hZGVyO1xyXG4iXX0=