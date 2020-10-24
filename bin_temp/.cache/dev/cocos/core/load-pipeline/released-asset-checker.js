(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "../global-exports.js", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("../global-exports.js"), require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.globalExports, global.debug);
    global.releasedAssetChecker = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _js, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _tmpInfo = null;

  function getItemDesc(item) {
    if (item.uuid) {
      if (!_tmpInfo) {
        _tmpInfo = {
          path: "",
          type: null
        };
      }

      if (_globalExports.legacyCC.loader._assetTables.assets._getInfo_DEBUG(item.uuid, _tmpInfo)) {
        _tmpInfo.path = 'resources/' + _tmpInfo.path;
        return "\"".concat(_tmpInfo.path, "\" (type: ").concat((0, _js.getClassName)(_tmpInfo.type), ", uuid: ").concat(item.uuid, ")");
      } else {
        return "\"".concat(item.rawUrl, "\" (").concat(item.uuid, ")");
      }
    } else {
      return "\"".concat(item.rawUrl, "\"");
    }
  }

  function doCheckCouldRelease(releasedKey, refOwnerItem, caches) {
    var loadedAgain = caches[releasedKey];

    if (!loadedAgain) {
      (0, _debug.log)("\"".concat(releasedKey, "\" was released but maybe still referenced by ").concat(getItemDesc(refOwnerItem)));
    }
  } // checks if asset was releasable


  var ReleasedAssetChecker = /*#__PURE__*/function () {
    function ReleasedAssetChecker() {
      _classCallCheck(this, ReleasedAssetChecker);

      this._releasedKeys = void 0;
      this._dirty = void 0;
      // { dependKey: true }
      this._releasedKeys = (0, _js.createMap)(true);
      this._dirty = false;
    } // mark as released for further checking dependencies


    _createClass(ReleasedAssetChecker, [{
      key: "setReleased",
      value: function setReleased(item, releasedKey) {
        this._releasedKeys[releasedKey] = true;
        this._dirty = true;
      } // check dependencies

    }, {
      key: "checkCouldRelease",
      value: function checkCouldRelease(caches) {
        if (!this._dirty) {
          return;
        }

        this._dirty = false;
        var released = this._releasedKeys; // check loader cache

        for (var id in caches) {
          var item = caches[id];

          if (item.alias) {
            item = item.alias;
          }

          var depends = item.dependKeys;

          if (depends) {
            for (var i = 0; i < depends.length; ++i) {
              var depend = depends[i];

              if (released[depend]) {
                doCheckCouldRelease(depend, item, caches);
                delete released[depend];
              }
            }
          }
        } // // check current scene
        // let depends = director.getScene().dependAssets;
        // for (let i = 0; i < depends.length; ++i) {
        //     let depend = depends[i];
        //     if (released[depend]) {
        //         doCheckCouldRelease(depend, item, caches);
        //         delete released[depend];
        //     }
        // }
        // clear released


        (0, _js.clear)(released);
      }
    }]);

    return ReleasedAssetChecker;
  }();

  _exports.default = ReleasedAssetChecker;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9yZWxlYXNlZC1hc3NldC1jaGVja2VyLnRzIl0sIm5hbWVzIjpbIl90bXBJbmZvIiwiZ2V0SXRlbURlc2MiLCJpdGVtIiwidXVpZCIsInBhdGgiLCJ0eXBlIiwibGVnYWN5Q0MiLCJsb2FkZXIiLCJfYXNzZXRUYWJsZXMiLCJhc3NldHMiLCJfZ2V0SW5mb19ERUJVRyIsInJhd1VybCIsImRvQ2hlY2tDb3VsZFJlbGVhc2UiLCJyZWxlYXNlZEtleSIsInJlZk93bmVySXRlbSIsImNhY2hlcyIsImxvYWRlZEFnYWluIiwiUmVsZWFzZWRBc3NldENoZWNrZXIiLCJfcmVsZWFzZWRLZXlzIiwiX2RpcnR5IiwicmVsZWFzZWQiLCJpZCIsImFsaWFzIiwiZGVwZW5kcyIsImRlcGVuZEtleXMiLCJpIiwibGVuZ3RoIiwiZGVwZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtDQSxNQUFJQSxRQUFhLEdBQUcsSUFBcEI7O0FBRUEsV0FBU0MsV0FBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFDeEIsUUFBSUEsSUFBSSxDQUFDQyxJQUFULEVBQWU7QUFDWCxVQUFJLENBQUNILFFBQUwsRUFBZTtBQUNYQSxRQUFBQSxRQUFRLEdBQUc7QUFBRUksVUFBQUEsSUFBSSxFQUFFLEVBQVI7QUFBWUMsVUFBQUEsSUFBSSxFQUFFO0FBQWxCLFNBQVg7QUFDSDs7QUFDRCxVQUFJQyx3QkFBU0MsTUFBVCxDQUFnQkMsWUFBaEIsQ0FBNkJDLE1BQTdCLENBQW9DQyxjQUFwQyxDQUFtRFIsSUFBSSxDQUFDQyxJQUF4RCxFQUE4REgsUUFBOUQsQ0FBSixFQUE2RTtBQUN6RUEsUUFBQUEsUUFBUSxDQUFDSSxJQUFULEdBQWdCLGVBQWVKLFFBQVEsQ0FBQ0ksSUFBeEM7QUFDQSwyQkFBV0osUUFBUSxDQUFDSSxJQUFwQix1QkFBb0Msc0JBQWFKLFFBQVEsQ0FBQ0ssSUFBdEIsQ0FBcEMscUJBQTBFSCxJQUFJLENBQUNDLElBQS9FO0FBQ0gsT0FIRCxNQUlLO0FBQ0QsMkJBQVdELElBQUksQ0FBQ1MsTUFBaEIsaUJBQTRCVCxJQUFJLENBQUNDLElBQWpDO0FBQ0g7QUFDSixLQVhELE1BWUs7QUFDRCx5QkFBV0QsSUFBSSxDQUFDUyxNQUFoQjtBQUNIO0FBQ0o7O0FBRUQsV0FBU0MsbUJBQVQsQ0FBOEJDLFdBQTlCLEVBQTJDQyxZQUEzQyxFQUF5REMsTUFBekQsRUFBaUU7QUFDN0QsUUFBSUMsV0FBVyxHQUFHRCxNQUFNLENBQUNGLFdBQUQsQ0FBeEI7O0FBQ0EsUUFBSSxDQUFDRyxXQUFMLEVBQWtCO0FBQ2Qsa0NBQVFILFdBQVIsMkRBQW1FWixXQUFXLENBQUNhLFlBQUQsQ0FBOUU7QUFDSDtBQUNKLEcsQ0FFRDs7O01BRXFCRyxvQjtBQUdqQixvQ0FBZTtBQUFBOztBQUFBLFdBRlBDLGFBRU87QUFBQSxXQURQQyxNQUNPO0FBQ1g7QUFDQSxXQUFLRCxhQUFMLEdBQXFCLG1CQUFVLElBQVYsQ0FBckI7QUFDQSxXQUFLQyxNQUFMLEdBQWMsS0FBZDtBQUNILEssQ0FFRDs7Ozs7a0NBQ2FqQixJLEVBQU1XLFcsRUFBYTtBQUM1QixhQUFLSyxhQUFMLENBQW1CTCxXQUFuQixJQUFrQyxJQUFsQztBQUNBLGFBQUtNLE1BQUwsR0FBYyxJQUFkO0FBQ0gsTyxDQUVEOzs7O3dDQUNtQkosTSxFQUFRO0FBQ3ZCLFlBQUksQ0FBQyxLQUFLSSxNQUFWLEVBQWtCO0FBQ2Q7QUFDSDs7QUFDRCxhQUFLQSxNQUFMLEdBQWMsS0FBZDtBQUVBLFlBQUlDLFFBQVEsR0FBRyxLQUFLRixhQUFwQixDQU51QixDQVF2Qjs7QUFDQSxhQUFLLElBQUlHLEVBQVQsSUFBZU4sTUFBZixFQUF1QjtBQUNuQixjQUFJYixJQUFJLEdBQUdhLE1BQU0sQ0FBQ00sRUFBRCxDQUFqQjs7QUFDQSxjQUFJbkIsSUFBSSxDQUFDb0IsS0FBVCxFQUFnQjtBQUNacEIsWUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNvQixLQUFaO0FBQ0g7O0FBQ0QsY0FBSUMsT0FBTyxHQUFHckIsSUFBSSxDQUFDc0IsVUFBbkI7O0FBQ0EsY0FBSUQsT0FBSixFQUFhO0FBQ1QsaUJBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsT0FBTyxDQUFDRyxNQUE1QixFQUFvQyxFQUFFRCxDQUF0QyxFQUF5QztBQUNyQyxrQkFBSUUsTUFBTSxHQUFHSixPQUFPLENBQUNFLENBQUQsQ0FBcEI7O0FBQ0Esa0JBQUlMLFFBQVEsQ0FBQ08sTUFBRCxDQUFaLEVBQXNCO0FBQ2xCZixnQkFBQUEsbUJBQW1CLENBQUNlLE1BQUQsRUFBU3pCLElBQVQsRUFBZWEsTUFBZixDQUFuQjtBQUNBLHVCQUFPSyxRQUFRLENBQUNPLE1BQUQsQ0FBZjtBQUNIO0FBQ0o7QUFDSjtBQUNKLFNBeEJzQixDQTBCdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7OztBQUNBLHVCQUFNUCxRQUFOO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQge2NyZWF0ZU1hcCwgZ2V0Q2xhc3NOYW1lLCBjbGVhcn0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5cclxubGV0IF90bXBJbmZvOiBhbnkgPSBudWxsO1xyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbURlc2MgKGl0ZW0pIHtcclxuICAgIGlmIChpdGVtLnV1aWQpIHtcclxuICAgICAgICBpZiAoIV90bXBJbmZvKSB7XHJcbiAgICAgICAgICAgIF90bXBJbmZvID0geyBwYXRoOiBcIlwiLCB0eXBlOiBudWxsIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsZWdhY3lDQy5sb2FkZXIuX2Fzc2V0VGFibGVzLmFzc2V0cy5fZ2V0SW5mb19ERUJVRyhpdGVtLnV1aWQsIF90bXBJbmZvKSkge1xyXG4gICAgICAgICAgICBfdG1wSW5mby5wYXRoID0gJ3Jlc291cmNlcy8nICsgX3RtcEluZm8ucGF0aDtcclxuICAgICAgICAgICAgcmV0dXJuIGBcIiR7X3RtcEluZm8ucGF0aH1cIiAodHlwZTogJHtnZXRDbGFzc05hbWUoX3RtcEluZm8udHlwZSl9LCB1dWlkOiAke2l0ZW0udXVpZH0pYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgXCIke2l0ZW0ucmF3VXJsfVwiICgke2l0ZW0udXVpZH0pYDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYFwiJHtpdGVtLnJhd1VybH1cImA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRvQ2hlY2tDb3VsZFJlbGVhc2UgKHJlbGVhc2VkS2V5LCByZWZPd25lckl0ZW0sIGNhY2hlcykge1xyXG4gICAgdmFyIGxvYWRlZEFnYWluID0gY2FjaGVzW3JlbGVhc2VkS2V5XTtcclxuICAgIGlmICghbG9hZGVkQWdhaW4pIHtcclxuICAgICAgICBsb2coYFwiJHtyZWxlYXNlZEtleX1cIiB3YXMgcmVsZWFzZWQgYnV0IG1heWJlIHN0aWxsIHJlZmVyZW5jZWQgYnkgJHtnZXRJdGVtRGVzYyhyZWZPd25lckl0ZW0pfWApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBjaGVja3MgaWYgYXNzZXQgd2FzIHJlbGVhc2FibGVcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbGVhc2VkQXNzZXRDaGVja2VyIHtcclxuICAgIHByaXZhdGUgX3JlbGVhc2VkS2V5cztcclxuICAgIHByaXZhdGUgX2RpcnR5O1xyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIC8vIHsgZGVwZW5kS2V5OiB0cnVlIH1cclxuICAgICAgICB0aGlzLl9yZWxlYXNlZEtleXMgPSBjcmVhdGVNYXAodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5fZGlydHkgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBtYXJrIGFzIHJlbGVhc2VkIGZvciBmdXJ0aGVyIGNoZWNraW5nIGRlcGVuZGVuY2llc1xyXG4gICAgc2V0UmVsZWFzZWQgKGl0ZW0sIHJlbGVhc2VkS2V5KSB7XHJcbiAgICAgICAgdGhpcy5fcmVsZWFzZWRLZXlzW3JlbGVhc2VkS2V5XSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrIGRlcGVuZGVuY2llc1xyXG4gICAgY2hlY2tDb3VsZFJlbGVhc2UgKGNhY2hlcykge1xyXG4gICAgICAgIGlmICghdGhpcy5fZGlydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgICAgICB2YXIgcmVsZWFzZWQgPSB0aGlzLl9yZWxlYXNlZEtleXM7XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGxvYWRlciBjYWNoZVxyXG4gICAgICAgIGZvciAobGV0IGlkIGluIGNhY2hlcykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNhY2hlc1tpZF07XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmFsaWFzKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS5hbGlhcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZGVwZW5kcyA9IGl0ZW0uZGVwZW5kS2V5cztcclxuICAgICAgICAgICAgaWYgKGRlcGVuZHMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVwZW5kcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXBlbmQgPSBkZXBlbmRzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxlYXNlZFtkZXBlbmRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvQ2hlY2tDb3VsZFJlbGVhc2UoZGVwZW5kLCBpdGVtLCBjYWNoZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVsZWFzZWRbZGVwZW5kXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIC8vIGNoZWNrIGN1cnJlbnQgc2NlbmVcclxuICAgICAgICAvLyBsZXQgZGVwZW5kcyA9IGRpcmVjdG9yLmdldFNjZW5lKCkuZGVwZW5kQXNzZXRzO1xyXG4gICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgZGVwZW5kcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIC8vICAgICBsZXQgZGVwZW5kID0gZGVwZW5kc1tpXTtcclxuICAgICAgICAvLyAgICAgaWYgKHJlbGVhc2VkW2RlcGVuZF0pIHtcclxuICAgICAgICAvLyAgICAgICAgIGRvQ2hlY2tDb3VsZFJlbGVhc2UoZGVwZW5kLCBpdGVtLCBjYWNoZXMpO1xyXG4gICAgICAgIC8vICAgICAgICAgZGVsZXRlIHJlbGVhc2VkW2RlcGVuZF07XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vIGNsZWFyIHJlbGVhc2VkXHJcbiAgICAgICAgY2xlYXIocmVsZWFzZWQpO1xyXG4gICAgfVxyXG59Il19