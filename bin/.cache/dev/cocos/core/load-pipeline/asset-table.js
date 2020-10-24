(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/misc.js", "../utils/js.js", "./url.js", "../platform/debug.js", "../utils/path.js", "../assets/sprite-frame.js", "../assets/sprite-atlas.js", "../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/misc.js"), require("../utils/js.js"), require("./url.js"), require("../platform/debug.js"), require("../utils/path.js"), require("../assets/sprite-frame.js"), require("../assets/sprite-atlas.js"), require("../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.misc, global.js, global.url, global.debug, global.path, global.spriteFrame, global.spriteAtlas, global.defaultConstants);
    global.assetTable = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _misc, _js, _url, _debug, _path, _spriteFrame, _spriteAtlas, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AssetTable = void 0;
  _url = _interopRequireDefault(_url);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Entry = function Entry(uuid, type) {
    _classCallCheck(this, Entry);

    this.uuid = void 0;
    this.type = void 0;
    this.uuid = uuid;
    this.type = type;
  };

  function isMatchByWord(path, test) {
    if (path.length > test.length) {
      var nextAscii = path.charCodeAt(test.length);
      return nextAscii === 47; // '/'
    }

    return true;
  }
  /*
   * @en AssetTable is used to find asset's uuid by url.
   * @zh AssetTable 用于查找资源的 uuid 和 url。
   */


  var AssetTable = /*#__PURE__*/function () {
    function AssetTable() {
      _classCallCheck(this, AssetTable);

      this._pathToUuid = void 0;
      this._pathToUuid = (0, _js.createMap)(true);
    }
    /**
     * Retrieve the asset uuid with the asset path and type
     */


    _createClass(AssetTable, [{
      key: "getUuid",
      value: function getUuid(path, type) {
        path = _url.default.normalize(path);
        var item = this._pathToUuid[path];

        if (item) {
          if (Array.isArray(item)) {
            if (type) {
              for (var i = 0; i < item.length; i++) {
                var entry = item[i];

                if ((0, _js.isChildClassOf)(entry.type, type)) {
                  return entry.uuid;
                }
              } // not found


              if (_defaultConstants.DEBUG && (0, _js.isChildClassOf)(type, _spriteFrame.SpriteFrame)) {
                for (var _i = 0; _i < item.length; _i++) {
                  var _entry = item[_i];

                  if ((0, _js.isChildClassOf)(_entry.type, _spriteAtlas.SpriteAtlas)) {
                    // not support sprite frame in atlas
                    (0, _debug.errorID)(4932, path);
                    break;
                  }
                }
              }
            } else {
              return item[0].uuid;
            }
          } else if (!type || (0, _js.isChildClassOf)(item.type, type)) {
            return item.uuid;
          } else if (_defaultConstants.DEBUG && (0, _js.isChildClassOf)(type, _spriteFrame.SpriteFrame) && (0, _js.isChildClassOf)(item.type, _spriteAtlas.SpriteAtlas)) {
            // not support sprite frame in atlas
            (0, _debug.errorID)(4932, path);
          }
        }

        return '';
      }
      /**
       * Retrieve an uuid array with the asset path and type
       */

    }, {
      key: "getUuidArray",
      value: function getUuidArray(path, type, out_urls) {
        path = _url.default.normalize(path);

        if (path[path.length - 1] === '/') {
          path = path.slice(0, -1);
        }

        var path2uuid = this._pathToUuid;
        var uuids = [];

        var _foundAtlasUrl;

        for (var p in path2uuid) {
          if (p.startsWith(path) && isMatchByWord(p, path) || !path) {
            var item = path2uuid[p];

            if (Array.isArray(item)) {
              for (var i = 0; i < item.length; i++) {
                var entry = item[i];

                if (!type || (0, _js.isChildClassOf)(entry.type, type)) {
                  uuids.push(entry.uuid);

                  if (out_urls) {
                    out_urls.push(p);
                  }
                } else if (_defaultConstants.DEBUG && entry.type === _spriteAtlas.SpriteAtlas) {
                  _foundAtlasUrl = p;
                }
              }
            } else {
              if (!type || (0, _js.isChildClassOf)(item.type, type)) {
                uuids.push(item.uuid);

                if (out_urls) {
                  out_urls.push(p);
                }
              } else if (_defaultConstants.DEBUG && item.type === _spriteAtlas.SpriteAtlas) {
                _foundAtlasUrl = p;
              }
            }
          }
        }

        if (_defaultConstants.DEBUG && uuids.length === 0 && _foundAtlasUrl && (0, _js.isChildClassOf)(type, _spriteFrame.SpriteFrame)) {
          // not support sprite frame in atlas
          (0, _debug.errorID)(4932, _foundAtlasUrl);
        }

        return uuids;
      } // /**
      //  * @en Returns all asset paths in the table.
      //  * @zh 返回表中的所有资源路径。
      //  * @method getAllPaths
      //  * @return {string[]}
      //  */
      // getAllPaths () {
      //     return Object.keys(this._pathToUuid);
      // }

      /**
       * @en Add an asset entry with path as key and asset uuid & type as value to the table
       * @zh 以路径为 key，uuid 和资源类型为值添加到表中。
       * @param path - the path of the asset, should NOT include filename extensions.
       * @param uuid - The uuid of the asset
       * @param type - Constructor of the asset
       * @param isMainAsset
       * @private
       */

    }, {
      key: "add",
      value: function add(path, uuid, type, isMainAsset) {
        // remove extname
        // (can not use path.slice because length of extname maybe 0)
        isMainAsset && (path = path.substring(0, path.length - (0, _path.extname)(path).length));
        var newEntry = new Entry(uuid, type);
        (0, _misc.pushToMap)(this._pathToUuid, path, newEntry, isMainAsset);
      }
    }, {
      key: "_getInfo_DEBUG",
      value: function _getInfo_DEBUG(uuid, out_info) {
        var path2uuid = this._pathToUuid;
        var paths = Object.keys(path2uuid);

        for (var p = 0; p < paths.length; ++p) {
          var path = paths[p];
          var item = path2uuid[path];

          if (Array.isArray(item)) {
            for (var i = 0; i < item.length; i++) {
              var entry = item[i];

              if (entry.uuid === uuid) {
                out_info.path = path;
                out_info.type = entry.type;
                return true;
              }
            }
          } else if (item.uuid === uuid) {
            out_info.path = path;
            out_info.type = item.type;
            return true;
          }
        }

        return false;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._pathToUuid = (0, _js.createMap)(true);
      }
    }]);

    return AssetTable;
  }();

  _exports.AssetTable = AssetTable;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9hc3NldC10YWJsZS50cyJdLCJuYW1lcyI6WyJFbnRyeSIsInV1aWQiLCJ0eXBlIiwiaXNNYXRjaEJ5V29yZCIsInBhdGgiLCJ0ZXN0IiwibGVuZ3RoIiwibmV4dEFzY2lpIiwiY2hhckNvZGVBdCIsIkFzc2V0VGFibGUiLCJfcGF0aFRvVXVpZCIsInVybCIsIm5vcm1hbGl6ZSIsIml0ZW0iLCJBcnJheSIsImlzQXJyYXkiLCJpIiwiZW50cnkiLCJERUJVRyIsIlNwcml0ZUZyYW1lIiwiU3ByaXRlQXRsYXMiLCJvdXRfdXJscyIsInNsaWNlIiwicGF0aDJ1dWlkIiwidXVpZHMiLCJfZm91bmRBdGxhc1VybCIsInAiLCJzdGFydHNXaXRoIiwicHVzaCIsImlzTWFpbkFzc2V0Iiwic3Vic3RyaW5nIiwibmV3RW50cnkiLCJvdXRfaW5mbyIsInBhdGhzIiwiT2JqZWN0Iiwia2V5cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFzQ01BLEssR0FHRixlQUFhQyxJQUFiLEVBQW1CQyxJQUFuQixFQUF5QjtBQUFBOztBQUFBLFNBRmxCRCxJQUVrQjtBQUFBLFNBRGxCQyxJQUNrQjtBQUNyQixTQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDSCxHOztBQUdMLFdBQVNDLGFBQVQsQ0FBd0JDLElBQXhCLEVBQThCQyxJQUE5QixFQUFvQztBQUNoQyxRQUFJRCxJQUFJLENBQUNFLE1BQUwsR0FBY0QsSUFBSSxDQUFDQyxNQUF2QixFQUErQjtBQUMzQixVQUFJQyxTQUFTLEdBQUdILElBQUksQ0FBQ0ksVUFBTCxDQUFnQkgsSUFBSSxDQUFDQyxNQUFyQixDQUFoQjtBQUNBLGFBQVFDLFNBQVMsS0FBSyxFQUF0QixDQUYyQixDQUVBO0FBQzlCOztBQUNELFdBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7OztN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Qjs7QUFDQSxrQkFBSUMsS0FBSyxDQUFDaEIsSUFBTixLQUFlQSxJQUFuQixFQUF5QjtBQUNyQitCLGdCQUFBQSxRQUFRLENBQUM1QixJQUFULEdBQWdCQSxJQUFoQjtBQUNBNEIsZ0JBQUFBLFFBQVEsQ0FBQzlCLElBQVQsR0FBZ0JlLEtBQUssQ0FBQ2YsSUFBdEI7QUFDQSx1QkFBTyxJQUFQO0FBQ0g7QUFDSjtBQUNKLFdBVEQsTUFVSyxJQUFJVyxJQUFJLENBQUNaLElBQUwsS0FBY0EsSUFBbEIsRUFBd0I7QUFDekIrQixZQUFBQSxRQUFRLENBQUM1QixJQUFULEdBQWdCQSxJQUFoQjtBQUNBNEIsWUFBQUEsUUFBUSxDQUFDOUIsSUFBVCxHQUFnQlcsSUFBSSxDQUFDWCxJQUFyQjtBQUNBLG1CQUFPLElBQVA7QUFDSDtBQUNKOztBQUNELGVBQU8sS0FBUDtBQUNIOzs7OEJBRVE7QUFDTCxhQUFLUSxXQUFMLEdBQW1CLG1CQUFVLElBQVYsQ0FBbkI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQge3B1c2hUb01hcH0gZnJvbSAnLi4vdXRpbHMvbWlzYyc7XHJcbmltcG9ydCB7Y3JlYXRlTWFwLCBpc0NoaWxkQ2xhc3NPZn0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgdXJsIGZyb20gJy4vdXJsJztcclxuaW1wb3J0IHsgZXJyb3JJRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgZXh0bmFtZSB9IGZyb20gJy4uL3V0aWxzL3BhdGgnO1xyXG5pbXBvcnQgeyBTcHJpdGVGcmFtZSB9IGZyb20gJy4uL2Fzc2V0cy9zcHJpdGUtZnJhbWUnO1xyXG5pbXBvcnQgeyBTcHJpdGVBdGxhcyB9IGZyb20gJy4uL2Fzc2V0cy9zcHJpdGUtYXRsYXMnO1xyXG5pbXBvcnQgeyBERUJVRyB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcblxyXG5jbGFzcyBFbnRyeSB7XHJcbiAgICBwdWJsaWMgdXVpZDogc3RyaW5nO1xyXG4gICAgcHVibGljIHR5cGU7XHJcbiAgICBjb25zdHJ1Y3RvciAodXVpZCwgdHlwZSkge1xyXG4gICAgICAgIHRoaXMudXVpZCA9IHV1aWQ7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNNYXRjaEJ5V29yZCAocGF0aCwgdGVzdCkge1xyXG4gICAgaWYgKHBhdGgubGVuZ3RoID4gdGVzdC5sZW5ndGgpIHtcclxuICAgICAgICBsZXQgbmV4dEFzY2lpID0gcGF0aC5jaGFyQ29kZUF0KHRlc3QubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gKG5leHRBc2NpaSA9PT0gNDcpOyAvLyAnLydcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKlxyXG4gKiBAZW4gQXNzZXRUYWJsZSBpcyB1c2VkIHRvIGZpbmQgYXNzZXQncyB1dWlkIGJ5IHVybC5cclxuICogQHpoIEFzc2V0VGFibGUg55So5LqO5p+l5om+6LWE5rqQ55qEIHV1aWQg5ZKMIHVybOOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFzc2V0VGFibGUge1xyXG4gICAgcHJpdmF0ZSBfcGF0aFRvVXVpZDogTWFwPHN0cmluZywgRW50cnk+IHwgTWFwPHN0cmluZywgQXJyYXk8RW50cnk+PjtcclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9wYXRoVG9VdWlkID0gY3JlYXRlTWFwKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgdGhlIGFzc2V0IHV1aWQgd2l0aCB0aGUgYXNzZXQgcGF0aCBhbmQgdHlwZVxyXG4gICAgICovXHJcbiAgICBnZXRVdWlkIChwYXRoOiBzdHJpbmcsIHR5cGU6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgcGF0aCA9IHVybC5ub3JtYWxpemUocGF0aCk7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9wYXRoVG9VdWlkW3BhdGhdO1xyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW50cnkgPSBpdGVtW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDaGlsZENsYXNzT2YoZW50cnkudHlwZSwgdHlwZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeS51dWlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCBmb3VuZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChERUJVRyAmJiBpc0NoaWxkQ2xhc3NPZih0eXBlLCBTcHJpdGVGcmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW50cnkgPSBpdGVtW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ2hpbGRDbGFzc09mKGVudHJ5LnR5cGUsIFNwcml0ZUF0bGFzKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdCBzdXBwb3J0IHNwcml0ZSBmcmFtZSBpbiBhdGxhc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ySUQoNDkzMiwgcGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVswXS51dWlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCF0eXBlIHx8IGlzQ2hpbGRDbGFzc09mKGl0ZW0udHlwZSwgdHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnV1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoREVCVUcgJiYgaXNDaGlsZENsYXNzT2YodHlwZSwgU3ByaXRlRnJhbWUpICYmIGlzQ2hpbGRDbGFzc09mKGl0ZW0udHlwZSwgU3ByaXRlQXRsYXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBub3Qgc3VwcG9ydCBzcHJpdGUgZnJhbWUgaW4gYXRsYXNcclxuICAgICAgICAgICAgICAgIGVycm9ySUQoNDkzMiwgcGF0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgYW4gdXVpZCBhcnJheSB3aXRoIHRoZSBhc3NldCBwYXRoIGFuZCB0eXBlXHJcbiAgICAgKi9cclxuICAgIGdldFV1aWRBcnJheSAocGF0aDogc3RyaW5nLCB0eXBlOiBGdW5jdGlvbiwgb3V0X3VybHM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgcGF0aCA9IHVybC5ub3JtYWxpemUocGF0aCk7XHJcbiAgICAgICAgaWYgKHBhdGhbcGF0aC5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBhdGgydXVpZCA9IHRoaXMuX3BhdGhUb1V1aWQ7XHJcbiAgICAgICAgbGV0IHV1aWRzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgbGV0IF9mb3VuZEF0bGFzVXJsO1xyXG4gICAgICAgIGZvciAobGV0IHAgaW4gcGF0aDJ1dWlkKSB7XHJcbiAgICAgICAgICAgIGlmICgocC5zdGFydHNXaXRoKHBhdGgpICYmIGlzTWF0Y2hCeVdvcmQocCwgcGF0aCkpIHx8ICFwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHBhdGgydXVpZFtwXTtcclxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbnRyeSA9IGl0ZW1baV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSB8fCBpc0NoaWxkQ2xhc3NPZihlbnRyeS50eXBlLCB0eXBlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXVpZHMucHVzaChlbnRyeS51dWlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdXRfdXJscykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dF91cmxzLnB1c2gocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoREVCVUcgJiYgZW50cnkudHlwZSA9PT0gU3ByaXRlQXRsYXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mb3VuZEF0bGFzVXJsID0gcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSB8fCBpc0NoaWxkQ2xhc3NPZihpdGVtLnR5cGUsIHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV1aWRzLnB1c2goaXRlbS51dWlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG91dF91cmxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRfdXJscy5wdXNoKHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKERFQlVHICYmIGl0ZW0udHlwZSA9PT0gU3ByaXRlQXRsYXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2ZvdW5kQXRsYXNVcmwgPSBwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoREVCVUcgJiYgdXVpZHMubGVuZ3RoID09PSAwICYmIF9mb3VuZEF0bGFzVXJsICYmIGlzQ2hpbGRDbGFzc09mKHR5cGUsIFNwcml0ZUZyYW1lKSkge1xyXG4gICAgICAgICAgICAvLyBub3Qgc3VwcG9ydCBzcHJpdGUgZnJhbWUgaW4gYXRsYXNcclxuICAgICAgICAgICAgZXJyb3JJRCg0OTMyLCBfZm91bmRBdGxhc1VybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1dWlkcztcclxuICAgIH1cclxuXHJcbiAgICAvLyAvKipcclxuICAgIC8vICAqIEBlbiBSZXR1cm5zIGFsbCBhc3NldCBwYXRocyBpbiB0aGUgdGFibGUuXHJcbiAgICAvLyAgKiBAemgg6L+U5Zue6KGo5Lit55qE5omA5pyJ6LWE5rqQ6Lev5b6E44CCXHJcbiAgICAvLyAgKiBAbWV0aG9kIGdldEFsbFBhdGhzXHJcbiAgICAvLyAgKiBAcmV0dXJuIHtzdHJpbmdbXX1cclxuICAgIC8vICAqL1xyXG4gICAgLy8gZ2V0QWxsUGF0aHMgKCkge1xyXG4gICAgLy8gICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9wYXRoVG9VdWlkKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGQgYW4gYXNzZXQgZW50cnkgd2l0aCBwYXRoIGFzIGtleSBhbmQgYXNzZXQgdXVpZCAmIHR5cGUgYXMgdmFsdWUgdG8gdGhlIHRhYmxlXHJcbiAgICAgKiBAemgg5Lul6Lev5b6E5Li6IGtlee+8jHV1aWQg5ZKM6LWE5rqQ57G75Z6L5Li65YC85re75Yqg5Yiw6KGo5Lit44CCXHJcbiAgICAgKiBAcGFyYW0gcGF0aCAtIHRoZSBwYXRoIG9mIHRoZSBhc3NldCwgc2hvdWxkIE5PVCBpbmNsdWRlIGZpbGVuYW1lIGV4dGVuc2lvbnMuXHJcbiAgICAgKiBAcGFyYW0gdXVpZCAtIFRoZSB1dWlkIG9mIHRoZSBhc3NldFxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBDb25zdHJ1Y3RvciBvZiB0aGUgYXNzZXRcclxuICAgICAqIEBwYXJhbSBpc01haW5Bc3NldFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgYWRkIChwYXRoOiBzdHJpbmcsIHV1aWQ6IHN0cmluZywgdHlwZTogRnVuY3Rpb24sIGlzTWFpbkFzc2V0OiBib29sZWFuKSB7XHJcbiAgICAgICAgLy8gcmVtb3ZlIGV4dG5hbWVcclxuICAgICAgICAvLyAoY2FuIG5vdCB1c2UgcGF0aC5zbGljZSBiZWNhdXNlIGxlbmd0aCBvZiBleHRuYW1lIG1heWJlIDApXHJcbiAgICAgICAgaXNNYWluQXNzZXQgJiYgKHBhdGggPSBwYXRoLnN1YnN0cmluZygwLCBwYXRoLmxlbmd0aCAtIGV4dG5hbWUocGF0aCkubGVuZ3RoKSk7XHJcbiAgICAgICAgbGV0IG5ld0VudHJ5ID0gbmV3IEVudHJ5KHV1aWQsIHR5cGUpO1xyXG4gICAgICAgIHB1c2hUb01hcCh0aGlzLl9wYXRoVG9VdWlkLCBwYXRoLCBuZXdFbnRyeSwgaXNNYWluQXNzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIF9nZXRJbmZvX0RFQlVHICh1dWlkLCBvdXRfaW5mbykge1xyXG4gICAgICAgIGxldCBwYXRoMnV1aWQgPSB0aGlzLl9wYXRoVG9VdWlkO1xyXG4gICAgICAgIGxldCBwYXRocyA9IE9iamVjdC5rZXlzKHBhdGgydXVpZCk7XHJcbiAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBwYXRocy5sZW5ndGg7ICsrcCkge1xyXG4gICAgICAgICAgICBsZXQgcGF0aCA9IHBhdGhzW3BdO1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHBhdGgydXVpZFtwYXRoXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbnRyeSA9IGl0ZW1baV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LnV1aWQgPT09IHV1aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0X2luZm8ucGF0aCA9IHBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dF9pbmZvLnR5cGUgPSBlbnRyeS50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXRlbS51dWlkID09PSB1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRfaW5mby5wYXRoID0gcGF0aDtcclxuICAgICAgICAgICAgICAgIG91dF9pbmZvLnR5cGUgPSBpdGVtLnR5cGU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQgKCkge1xyXG4gICAgICAgIHRoaXMuX3BhdGhUb1V1aWQgPSBjcmVhdGVNYXAodHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIl19