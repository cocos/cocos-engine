(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/path.js", "../platform/debug.js", "./pipeline.js", "./loading-items.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/path.js"), require("../platform/debug.js"), require("./pipeline.js"), require("./loading-items.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.path, global.debug, global.pipeline, global.loadingItems, global.defaultConstants, global.globalExports);
    global.assetLoader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _path, debug, _pipeline, _loadingItems, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  debug = _interopRequireWildcard(debug);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ID = 'AssetLoader';
  var reusedArray = [];
  /**
   * @en The load pipe in {{loader}} to load an asset with its uuid, it will recursively load its dependencies.
   * @zh {{loader}} 加载管线中的资源加载管道，用来通过 uuid 加载 asset 资源及其依赖
   */

  var AssetLoader = /*#__PURE__*/function () {
    function AssetLoader() {
      _classCallCheck(this, AssetLoader);

      this.id = ID;
      this.async = true;
      this.pipeline = null;
    }

    _createClass(AssetLoader, [{
      key: "handle",
      value: function handle(item, callback) {
        var _this = this;

        var uuid = item.uuid;

        if (!uuid) {
          return item.content || null;
        }

        _globalExports.legacyCC.AssetLibrary.queryAssetInfo(uuid, function (error, url, isRawAsset) {
          if (error) {
            callback(error);
          } else {
            item.url = item.rawUrl = url;
            item.isRawAsset = isRawAsset;

            if (isRawAsset) {
              var ext = (0, _path.extname)(url).toLowerCase();

              if (!ext) {
                callback(new Error(debug.getError(4931, uuid, url)));
                return;
              }

              ext = ext.substr(1);

              var queue = _loadingItems.LoadingItems.getQueue(item);

              reusedArray[0] = {
                queueId: item.queueId,
                id: url,
                url: url,
                type: ext,
                error: null,
                alias: item,
                complete: true
              };

              if (_defaultConstants.EDITOR && _this.pipeline) {
                _this.pipeline._cache[url] = reusedArray[0];
              }

              queue && queue.append(reusedArray); // Dispatch to other raw type downloader

              item.type = ext;
              callback(null, item.content);
            } else {
              item.type = 'uuid';
              callback(null, item.content);
            }
          }
        });
      }
    }]);

    return AssetLoader;
  }(); // @ts-ignore


  _exports.default = AssetLoader;
  AssetLoader.ID = ID;
  _pipeline.Pipeline.AssetLoader = AssetLoader;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9hc3NldC1sb2FkZXIudHMiXSwibmFtZXMiOlsiSUQiLCJyZXVzZWRBcnJheSIsIkFzc2V0TG9hZGVyIiwiaWQiLCJhc3luYyIsInBpcGVsaW5lIiwiaXRlbSIsImNhbGxiYWNrIiwidXVpZCIsImNvbnRlbnQiLCJsZWdhY3lDQyIsIkFzc2V0TGlicmFyeSIsInF1ZXJ5QXNzZXRJbmZvIiwiZXJyb3IiLCJ1cmwiLCJpc1Jhd0Fzc2V0IiwicmF3VXJsIiwiZXh0IiwidG9Mb3dlckNhc2UiLCJFcnJvciIsImRlYnVnIiwiZ2V0RXJyb3IiLCJzdWJzdHIiLCJxdWV1ZSIsIkxvYWRpbmdJdGVtcyIsImdldFF1ZXVlIiwicXVldWVJZCIsInR5cGUiLCJhbGlhcyIsImNvbXBsZXRlIiwiRURJVE9SIiwiX2NhY2hlIiwiYXBwZW5kIiwiUGlwZWxpbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ0EsTUFBTUEsRUFBRSxHQUFHLGFBQVg7QUFDQSxNQUFJQyxXQUFzQixHQUFHLEVBQTdCO0FBRUE7Ozs7O01BSXFCQyxXOzs7O1dBRVZDLEUsR0FBWUgsRTtXQUNaSSxLLEdBQWdCLEk7V0FDaEJDLFEsR0FBMkIsSTs7Ozs7NkJBRTFCQyxJLEVBQU1DLFEsRUFBVTtBQUFBOztBQUNwQixZQUFJQyxJQUFJLEdBQUdGLElBQUksQ0FBQ0UsSUFBaEI7O0FBQ0EsWUFBSSxDQUFDQSxJQUFMLEVBQVc7QUFDUCxpQkFBT0YsSUFBSSxDQUFDRyxPQUFMLElBQWdCLElBQXZCO0FBQ0g7O0FBRURDLGdDQUFTQyxZQUFULENBQXNCQyxjQUF0QixDQUFxQ0osSUFBckMsRUFBMkMsVUFBQ0ssS0FBRCxFQUFRQyxHQUFSLEVBQWFDLFVBQWIsRUFBNEI7QUFDbkUsY0FBSUYsS0FBSixFQUFXO0FBQ1BOLFlBQUFBLFFBQVEsQ0FBQ00sS0FBRCxDQUFSO0FBQ0gsV0FGRCxNQUdLO0FBQ0RQLFlBQUFBLElBQUksQ0FBQ1EsR0FBTCxHQUFXUixJQUFJLENBQUNVLE1BQUwsR0FBY0YsR0FBekI7QUFDQVIsWUFBQUEsSUFBSSxDQUFDUyxVQUFMLEdBQWtCQSxVQUFsQjs7QUFDQSxnQkFBSUEsVUFBSixFQUFnQjtBQUNaLGtCQUFJRSxHQUFHLEdBQUcsbUJBQVFILEdBQVIsRUFBYUksV0FBYixFQUFWOztBQUNBLGtCQUFJLENBQUNELEdBQUwsRUFBVTtBQUNOVixnQkFBQUEsUUFBUSxDQUFDLElBQUlZLEtBQUosQ0FBVUMsS0FBSyxDQUFDQyxRQUFOLENBQWUsSUFBZixFQUFxQmIsSUFBckIsRUFBMkJNLEdBQTNCLENBQVYsQ0FBRCxDQUFSO0FBQ0E7QUFDSDs7QUFDREcsY0FBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNLLE1BQUosQ0FBVyxDQUFYLENBQU47O0FBQ0Esa0JBQUlDLEtBQUssR0FBR0MsMkJBQWFDLFFBQWIsQ0FBc0JuQixJQUF0QixDQUFaOztBQUNBTCxjQUFBQSxXQUFXLENBQUMsQ0FBRCxDQUFYLEdBQWlCO0FBQ2J5QixnQkFBQUEsT0FBTyxFQUFFcEIsSUFBSSxDQUFDb0IsT0FERDtBQUVidkIsZ0JBQUFBLEVBQUUsRUFBRVcsR0FGUztBQUdiQSxnQkFBQUEsR0FBRyxFQUFFQSxHQUhRO0FBSWJhLGdCQUFBQSxJQUFJLEVBQUVWLEdBSk87QUFLYkosZ0JBQUFBLEtBQUssRUFBRSxJQUxNO0FBTWJlLGdCQUFBQSxLQUFLLEVBQUV0QixJQU5NO0FBT2J1QixnQkFBQUEsUUFBUSxFQUFFO0FBUEcsZUFBakI7O0FBU0Esa0JBQUlDLDRCQUFVLEtBQUksQ0FBQ3pCLFFBQW5CLEVBQTZCO0FBQ3pCLGdCQUFBLEtBQUksQ0FBQ0EsUUFBTCxDQUFjMEIsTUFBZCxDQUFxQmpCLEdBQXJCLElBQTRCYixXQUFXLENBQUMsQ0FBRCxDQUF2QztBQUNIOztBQUNEc0IsY0FBQUEsS0FBSyxJQUFJQSxLQUFLLENBQUNTLE1BQU4sQ0FBYS9CLFdBQWIsQ0FBVCxDQXBCWSxDQXFCWjs7QUFDQUssY0FBQUEsSUFBSSxDQUFDcUIsSUFBTCxHQUFZVixHQUFaO0FBQ0FWLGNBQUFBLFFBQVEsQ0FBQyxJQUFELEVBQU9ELElBQUksQ0FBQ0csT0FBWixDQUFSO0FBQ0gsYUF4QkQsTUF5Qks7QUFDREgsY0FBQUEsSUFBSSxDQUFDcUIsSUFBTCxHQUFZLE1BQVo7QUFDQXBCLGNBQUFBLFFBQVEsQ0FBQyxJQUFELEVBQU9ELElBQUksQ0FBQ0csT0FBWixDQUFSO0FBQ0g7QUFDSjtBQUNKLFNBckNEO0FBc0NIOzs7O09BR0w7Ozs7QUFyRHFCUCxFQUFBQSxXLENBQ1ZGLEUsR0FBS0EsRTtBQXFEaEJpQyxxQkFBUy9CLFdBQVQsR0FBdUJBLFdBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGxvYWRlclxyXG4gKi9cclxuXHJcbmltcG9ydCB7ZXh0bmFtZX0gZnJvbSAnLi4vdXRpbHMvcGF0aCc7XHJcbmltcG9ydCAqIGFzIGRlYnVnIGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgUGlwZWxpbmUsIElQaXBlIH0gZnJvbSAnLi9waXBlbGluZSc7XHJcbmltcG9ydCB7IExvYWRpbmdJdGVtcyB9IGZyb20gJy4vbG9hZGluZy1pdGVtcyc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgSUQgPSAnQXNzZXRMb2FkZXInO1xyXG5sZXQgcmV1c2VkQXJyYXk6QXJyYXk8YW55PiA9IFtdO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgbG9hZCBwaXBlIGluIHt7bG9hZGVyfX0gdG8gbG9hZCBhbiBhc3NldCB3aXRoIGl0cyB1dWlkLCBpdCB3aWxsIHJlY3Vyc2l2ZWx5IGxvYWQgaXRzIGRlcGVuZGVuY2llcy5cclxuICogQHpoIHt7bG9hZGVyfX0g5Yqg6L29566h57q/5Lit55qE6LWE5rqQ5Yqg6L29566h6YGT77yM55So5p2l6YCa6L+HIHV1aWQg5Yqg6L29IGFzc2V0IOi1hOa6kOWPiuWFtuS+nei1llxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXNzZXRMb2FkZXIgaW1wbGVtZW50cyBJUGlwZSB7XHJcbiAgICBzdGF0aWMgSUQgPSBJRDtcclxuICAgIHB1YmxpYyBpZDpzdHJpbmcgPSBJRDtcclxuICAgIHB1YmxpYyBhc3luYzpib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBwaXBlbGluZTpQaXBlbGluZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGhhbmRsZSAoaXRlbSwgY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgdXVpZCA9IGl0ZW0udXVpZDtcclxuICAgICAgICBpZiAoIXV1aWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY29udGVudCB8fCBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGVnYWN5Q0MuQXNzZXRMaWJyYXJ5LnF1ZXJ5QXNzZXRJbmZvKHV1aWQsIChlcnJvciwgdXJsLCBpc1Jhd0Fzc2V0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS51cmwgPSBpdGVtLnJhd1VybCA9IHVybDtcclxuICAgICAgICAgICAgICAgIGl0ZW0uaXNSYXdBc3NldCA9IGlzUmF3QXNzZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSYXdBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBleHQgPSBleHRuYW1lKHVybCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoNDkzMSwgdXVpZCwgdXJsKSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGV4dCA9IGV4dC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHF1ZXVlID0gTG9hZGluZ0l0ZW1zLmdldFF1ZXVlKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldXNlZEFycmF5WzBdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZUlkOiBpdGVtLnF1ZXVlSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlhczogaXRlbSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFRElUT1IgJiYgdGhpcy5waXBlbGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBpcGVsaW5lLl9jYWNoZVt1cmxdID0gcmV1c2VkQXJyYXlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlICYmIHF1ZXVlLmFwcGVuZChyZXVzZWRBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGF0Y2ggdG8gb3RoZXIgcmF3IHR5cGUgZG93bmxvYWRlclxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udHlwZSA9IGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBpdGVtLmNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50eXBlID0gJ3V1aWQnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0uY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQHRzLWlnbm9yZVxyXG5QaXBlbGluZS5Bc3NldExvYWRlciA9IEFzc2V0TG9hZGVyOyJdfQ==