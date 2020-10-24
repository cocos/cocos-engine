(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/decode-uuid.js", "./pipeline.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/decode-uuid.js"), require("./pipeline.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.decodeUuid, global.pipeline);
    global.subpackagePipe = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _decodeUuid, _pipeline) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SubPackPipe = void 0;
  _decodeUuid = _interopRequireDefault(_decodeUuid);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ID = 'SubPackPipe';
  var UuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-@]{8,}).*/;

  function getUuidFromURL(url) {
    var matches = url.match(UuidRegex);

    if (matches) {
      return matches[1];
    }

    return "";
  }

  var _uuidToSubPack = Object.create(null);

  var SubPackPipe = /*#__PURE__*/function () {
    function SubPackPipe(subpackage) {
      _classCallCheck(this, SubPackPipe);

      this.id = ID;
      this.async = false;
      this.pipeline = null;

      var _loop = function _loop(packName) {
        var pack = subpackage[packName];
        pack.uuids && pack.uuids.forEach(function (val) {
          var uuid = (0, _decodeUuid.default)(val);
          var uuids = uuid.split('@').map(function (name) {
            return encodeURIComponent(name);
          });
          uuid = uuids.join('@');
          _uuidToSubPack[uuid] = pack.path;
        });
      };

      for (var packName in subpackage) {
        _loop(packName);
      }
    }

    _createClass(SubPackPipe, [{
      key: "handle",
      value: function handle(item) {
        item.url = this.transformURL(item.url);
        return null;
      }
    }, {
      key: "transformURL",
      value: function transformURL(url) {
        var uuid = getUuidFromURL(url);

        if (uuid) {
          var subpackage = _uuidToSubPack[uuid];

          if (subpackage) {
            // only replace url of native assets
            return url.replace('res/raw-assets/', subpackage + 'raw-assets/');
          }
        }

        return url;
      }
    }]);

    return SubPackPipe;
  }(); // @ts-ignore


  _exports.SubPackPipe = SubPackPipe;
  SubPackPipe.ID = ID;
  _pipeline.Pipeline.SubPackPipe = SubPackPipe;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9zdWJwYWNrYWdlLXBpcGUudHMiXSwibmFtZXMiOlsiSUQiLCJVdWlkUmVnZXgiLCJnZXRVdWlkRnJvbVVSTCIsInVybCIsIm1hdGNoZXMiLCJtYXRjaCIsIl91dWlkVG9TdWJQYWNrIiwiT2JqZWN0IiwiY3JlYXRlIiwiU3ViUGFja1BpcGUiLCJzdWJwYWNrYWdlIiwiaWQiLCJhc3luYyIsInBpcGVsaW5lIiwicGFja05hbWUiLCJwYWNrIiwidXVpZHMiLCJmb3JFYWNoIiwidmFsIiwidXVpZCIsInNwbGl0IiwibWFwIiwibmFtZSIsImVuY29kZVVSSUNvbXBvbmVudCIsImpvaW4iLCJwYXRoIiwiaXRlbSIsInRyYW5zZm9ybVVSTCIsInJlcGxhY2UiLCJQaXBlbGluZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsTUFBTUEsRUFBRSxHQUFHLGFBQVg7QUFDQSxNQUFNQyxTQUFTLEdBQUcsaURBQWxCOztBQUVBLFdBQVNDLGNBQVQsQ0FBd0JDLEdBQXhCLEVBQTZCO0FBQ3pCLFFBQUlDLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxLQUFKLENBQVVKLFNBQVYsQ0FBZDs7QUFDQSxRQUFJRyxPQUFKLEVBQWE7QUFDVCxhQUFPQSxPQUFPLENBQUMsQ0FBRCxDQUFkO0FBQ0g7O0FBQ0QsV0FBTyxFQUFQO0FBQ0g7O0FBRUQsTUFBSUUsY0FBYyxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFkLENBQXJCOztNQUVhQyxXO0FBS1QseUJBQWFDLFVBQWIsRUFBeUI7QUFBQTs7QUFBQSxXQUhsQkMsRUFHa0IsR0FIYlgsRUFHYTtBQUFBLFdBRmxCWSxLQUVrQixHQUZWLEtBRVU7QUFBQSxXQURsQkMsUUFDa0IsR0FEUCxJQUNPOztBQUFBLGlDQUNaQyxRQURZO0FBRWpCLFlBQUlDLElBQUksR0FBR0wsVUFBVSxDQUFDSSxRQUFELENBQXJCO0FBQ0FDLFFBQUFBLElBQUksQ0FBQ0MsS0FBTCxJQUFjRCxJQUFJLENBQUNDLEtBQUwsQ0FBV0MsT0FBWCxDQUFtQixVQUFVQyxHQUFWLEVBQWU7QUFDNUMsY0FBSUMsSUFBSSxHQUFHLHlCQUFXRCxHQUFYLENBQVg7QUFDQSxjQUFNRixLQUFLLEdBQUdHLElBQUksQ0FBQ0MsS0FBTCxDQUFXLEdBQVgsRUFBZ0JDLEdBQWhCLENBQW9CLFVBQUNDLElBQUQsRUFBVTtBQUN4QyxtQkFBT0Msa0JBQWtCLENBQUNELElBQUQsQ0FBekI7QUFDSCxXQUZhLENBQWQ7QUFHQUgsVUFBQUEsSUFBSSxHQUFHSCxLQUFLLENBQUNRLElBQU4sQ0FBVyxHQUFYLENBQVA7QUFDQWxCLFVBQUFBLGNBQWMsQ0FBQ2EsSUFBRCxDQUFkLEdBQXVCSixJQUFJLENBQUNVLElBQTVCO0FBQ0gsU0FQYSxDQUFkO0FBSGlCOztBQUNyQixXQUFLLElBQUlYLFFBQVQsSUFBcUJKLFVBQXJCLEVBQWlDO0FBQUEsY0FBeEJJLFFBQXdCO0FBVWhDO0FBQ0o7Ozs7NkJBRU9ZLEksRUFBTTtBQUNWQSxRQUFBQSxJQUFJLENBQUN2QixHQUFMLEdBQVcsS0FBS3dCLFlBQUwsQ0FBa0JELElBQUksQ0FBQ3ZCLEdBQXZCLENBQVg7QUFDQSxlQUFPLElBQVA7QUFDSDs7O21DQUVhQSxHLEVBQUs7QUFDZixZQUFJZ0IsSUFBSSxHQUFHakIsY0FBYyxDQUFDQyxHQUFELENBQXpCOztBQUNBLFlBQUlnQixJQUFKLEVBQVU7QUFDTixjQUFJVCxVQUFVLEdBQUdKLGNBQWMsQ0FBQ2EsSUFBRCxDQUEvQjs7QUFDQSxjQUFJVCxVQUFKLEVBQWdCO0FBQ1o7QUFDQSxtQkFBT1AsR0FBRyxDQUFDeUIsT0FBSixDQUFZLGlCQUFaLEVBQStCbEIsVUFBVSxHQUFHLGFBQTVDLENBQVA7QUFDSDtBQUNKOztBQUNELGVBQU9QLEdBQVA7QUFDSDs7OztPQUdMOzs7O0FBckNhTSxFQUFBQSxXLENBQ0ZULEUsR0FBS0EsRTtBQXFDaEI2QixxQkFBU3BCLFdBQVQsR0FBdUJBLFdBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY29kZVV1aWQgZnJvbSAnLi4vdXRpbHMvZGVjb2RlLXV1aWQnO1xyXG5pbXBvcnQgeyBQaXBlbGluZSwgSVBpcGUgfSBmcm9tICcuL3BpcGVsaW5lJztcclxuXHJcbmNvbnN0IElEID0gJ1N1YlBhY2tQaXBlJztcclxuY29uc3QgVXVpZFJlZ2V4ID0gLy4qWy9cXFxcXVswLTlhLWZBLUZdezJ9Wy9cXFxcXShbMC05YS1mQS1GLUBdezgsfSkuKi87XHJcblxyXG5mdW5jdGlvbiBnZXRVdWlkRnJvbVVSTCh1cmwpIHtcclxuICAgIGxldCBtYXRjaGVzID0gdXJsLm1hdGNoKFV1aWRSZWdleCk7XHJcbiAgICBpZiAobWF0Y2hlcykge1xyXG4gICAgICAgIHJldHVybiBtYXRjaGVzWzFdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFwiXCI7XHJcbn1cclxuXHJcbmxldCBfdXVpZFRvU3ViUGFjayA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcblxyXG5leHBvcnQgY2xhc3MgU3ViUGFja1BpcGUgaW1wbGVtZW50cyBJUGlwZSB7XHJcbiAgICBzdGF0aWMgSUQgPSBJRDtcclxuICAgIHB1YmxpYyBpZCA9IElEO1xyXG4gICAgcHVibGljIGFzeW5jID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgcGlwZWxpbmUgPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IgKHN1YnBhY2thZ2UpIHtcclxuICAgICAgICBmb3IgKGxldCBwYWNrTmFtZSBpbiBzdWJwYWNrYWdlKSB7XHJcbiAgICAgICAgICAgIGxldCBwYWNrID0gc3VicGFja2FnZVtwYWNrTmFtZV07XHJcbiAgICAgICAgICAgIHBhY2sudXVpZHMgJiYgcGFjay51dWlkcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgIGxldCB1dWlkID0gZGVjb2RlVXVpZCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXVpZHMgPSB1dWlkLnNwbGl0KCdAJykubWFwKChuYW1lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChuYW1lKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdXVpZCA9IHV1aWRzLmpvaW4oJ0AnKTtcclxuICAgICAgICAgICAgICAgIF91dWlkVG9TdWJQYWNrW3V1aWRdID0gcGFjay5wYXRoO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlIChpdGVtKSB7XHJcbiAgICAgICAgaXRlbS51cmwgPSB0aGlzLnRyYW5zZm9ybVVSTChpdGVtLnVybCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNmb3JtVVJMICh1cmwpIHtcclxuICAgICAgICBsZXQgdXVpZCA9IGdldFV1aWRGcm9tVVJMKHVybCk7XHJcbiAgICAgICAgaWYgKHV1aWQpIHtcclxuICAgICAgICAgICAgbGV0IHN1YnBhY2thZ2UgPSBfdXVpZFRvU3ViUGFja1t1dWlkXTtcclxuICAgICAgICAgICAgaWYgKHN1YnBhY2thZ2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIG9ubHkgcmVwbGFjZSB1cmwgb2YgbmF0aXZlIGFzc2V0c1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybC5yZXBsYWNlKCdyZXMvcmF3LWFzc2V0cy8nLCBzdWJwYWNrYWdlICsgJ3Jhdy1hc3NldHMvJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQHRzLWlnbm9yZVxyXG5QaXBlbGluZS5TdWJQYWNrUGlwZSA9IFN1YlBhY2tQaXBlO1xyXG4iXX0=