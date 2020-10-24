(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "../utils/js.js", "../assets/texture-2d.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("../utils/js.js"), require("../assets/texture-2d.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.js, global.texture2d);
    global.unpackers = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _js, _texture2d) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TextureUnpacker = _exports.JsonUnpacker = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var JsonUnpacker = /*#__PURE__*/function () {
    function JsonUnpacker() {
      _classCallCheck(this, JsonUnpacker);

      this.jsons = {};
    }

    _createClass(JsonUnpacker, [{
      key: "load",

      /*
       * @param {String[]} indices
       * @param {Object[]} packedJson
       */
      value: function load(indices, packedJson) {
        if (packedJson.length !== indices.length) {
          (0, _debug.errorID)(4915);
        }

        for (var i = 0; i < indices.length; i++) {
          var key = indices[i];
          var json = packedJson[i];
          this.jsons[key] = json;
        }
      }
    }, {
      key: "retrieve",
      value: function retrieve(key) {
        return this.jsons[key] || null;
      }
    }]);

    return JsonUnpacker;
  }();

  _exports.JsonUnpacker = JsonUnpacker;

  var TextureUnpacker = /*#__PURE__*/function () {
    function TextureUnpacker() {
      _classCallCheck(this, TextureUnpacker);

      this.contents = {};
    }

    _createClass(TextureUnpacker, [{
      key: "load",

      /*
       * @param {String[]} indices
       * @param {Object[]} packedJson
       */
      value: function load(indices, packedJson) {
        var datas = packedJson.data;

        if (datas.length !== indices.length) {
          (0, _debug.errorID)(4915);
        }

        for (var i = 0; i < indices.length; i++) {
          this.contents[indices[i]] = {
            base: datas[i][0],
            mipmaps: datas[i][1]
          };
        }
      }
    }, {
      key: "retrieve",
      value: function retrieve(key) {
        var content = this.contents[key];

        if (content) {
          return {
            __type__: _js.js._getClassId(_texture2d.Texture2D),
            content: content
          };
        } else {
          return null;
        }
      }
    }]);

    return TextureUnpacker;
  }();

  _exports.TextureUnpacker = TextureUnpacker;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS91bnBhY2tlcnMudHMiXSwibmFtZXMiOlsiSnNvblVucGFja2VyIiwianNvbnMiLCJpbmRpY2VzIiwicGFja2VkSnNvbiIsImxlbmd0aCIsImkiLCJrZXkiLCJqc29uIiwiVGV4dHVyZVVucGFja2VyIiwiY29udGVudHMiLCJkYXRhcyIsImRhdGEiLCJiYXNlIiwibWlwbWFwcyIsImNvbnRlbnQiLCJfX3R5cGVfXyIsImpzIiwiX2dldENsYXNzSWQiLCJUZXh0dXJlMkQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Ba0NhQSxZOzs7O1dBQ0ZDLEssR0FBUSxFOzs7Ozs7QUFFZjs7OzsyQkFJTUMsTyxFQUFTQyxVLEVBQVk7QUFDdkIsWUFBSUEsVUFBVSxDQUFDQyxNQUFYLEtBQXNCRixPQUFPLENBQUNFLE1BQWxDLEVBQTBDO0FBQ3RDLDhCQUFRLElBQVI7QUFDSDs7QUFDRCxhQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdILE9BQU8sQ0FBQ0UsTUFBNUIsRUFBb0NDLENBQUMsRUFBckMsRUFBeUM7QUFDckMsY0FBSUMsR0FBRyxHQUFHSixPQUFPLENBQUNHLENBQUQsQ0FBakI7QUFDQSxjQUFJRSxJQUFJLEdBQUdKLFVBQVUsQ0FBQ0UsQ0FBRCxDQUFyQjtBQUNBLGVBQUtKLEtBQUwsQ0FBV0ssR0FBWCxJQUFrQkMsSUFBbEI7QUFDSDtBQUNKOzs7K0JBRVNELEcsRUFBSztBQUNYLGVBQU8sS0FBS0wsS0FBTCxDQUFXSyxHQUFYLEtBQW1CLElBQTFCO0FBQ0g7Ozs7Ozs7O01BSVFFLGU7Ozs7V0FDRkMsUSxHQUFXLEU7Ozs7OztBQUVsQjs7OzsyQkFJTVAsTyxFQUFTQyxVLEVBQVk7QUFDdkIsWUFBSU8sS0FBSyxHQUFHUCxVQUFVLENBQUNRLElBQXZCOztBQUNBLFlBQUlELEtBQUssQ0FBQ04sTUFBTixLQUFpQkYsT0FBTyxDQUFDRSxNQUE3QixFQUFxQztBQUNqQyw4QkFBUSxJQUFSO0FBQ0g7O0FBQ0QsYUFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSCxPQUFPLENBQUNFLE1BQTVCLEVBQW9DQyxDQUFDLEVBQXJDLEVBQXlDO0FBQ3JDLGVBQUtJLFFBQUwsQ0FBY1AsT0FBTyxDQUFDRyxDQUFELENBQXJCLElBQTRCO0FBQUNPLFlBQUFBLElBQUksRUFBRUYsS0FBSyxDQUFDTCxDQUFELENBQUwsQ0FBUyxDQUFULENBQVA7QUFBb0JRLFlBQUFBLE9BQU8sRUFBRUgsS0FBSyxDQUFDTCxDQUFELENBQUwsQ0FBUyxDQUFUO0FBQTdCLFdBQTVCO0FBQ0g7QUFDSjs7OytCQUVTQyxHLEVBQUs7QUFDWCxZQUFJUSxPQUFPLEdBQUcsS0FBS0wsUUFBTCxDQUFjSCxHQUFkLENBQWQ7O0FBQ0EsWUFBSVEsT0FBSixFQUFhO0FBQ1QsaUJBQU87QUFDSEMsWUFBQUEsUUFBUSxFQUFFQyxPQUFHQyxXQUFILENBQWVDLG9CQUFmLENBRFA7QUFFSEosWUFBQUEsT0FBTyxFQUFFQTtBQUZOLFdBQVA7QUFJSCxTQUxELE1BTUs7QUFDRCxpQkFBTyxJQUFQO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZXJyb3JJRCB9IGZyb20gXCIuLi9wbGF0Zm9ybS9kZWJ1Z1wiO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gXCIuLi91dGlscy9qc1wiO1xyXG5pbXBvcnQgeyBUZXh0dXJlMkQgfSBmcm9tIFwiLi4vYXNzZXRzL3RleHR1cmUtMmRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uVW5wYWNrZXIge1xyXG4gICAgcHVibGljIGpzb25zID0ge307XHJcblxyXG4gICAgLypcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nW119IGluZGljZXNcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0W119IHBhY2tlZEpzb25cclxuICAgICAqL1xyXG4gICAgbG9hZCAoaW5kaWNlcywgcGFja2VkSnNvbikge1xyXG4gICAgICAgIGlmIChwYWNrZWRKc29uLmxlbmd0aCAhPT0gaW5kaWNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCg0OTE1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXkgPSBpbmRpY2VzW2ldO1xyXG4gICAgICAgICAgICBsZXQganNvbiA9IHBhY2tlZEpzb25baV07XHJcbiAgICAgICAgICAgIHRoaXMuanNvbnNba2V5XSA9IGpzb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHJpZXZlIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5qc29uc1trZXldIHx8IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dHVyZVVucGFja2VyIHtcclxuICAgIHB1YmxpYyBjb250ZW50cyA9IHt9O1xyXG5cclxuICAgIC8qXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBpbmRpY2VzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBwYWNrZWRKc29uXHJcbiAgICAgKi9cclxuICAgIGxvYWQgKGluZGljZXMsIHBhY2tlZEpzb24pIHtcclxuICAgICAgICBsZXQgZGF0YXMgPSBwYWNrZWRKc29uLmRhdGE7XHJcbiAgICAgICAgaWYgKGRhdGFzLmxlbmd0aCAhPT0gaW5kaWNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZXJyb3JJRCg0OTE1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudHNbaW5kaWNlc1tpXV0gPSB7YmFzZTogZGF0YXNbaV1bMF0sIG1pcG1hcHM6IGRhdGFzW2ldWzFdfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0cmlldmUgKGtleSkge1xyXG4gICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5jb250ZW50c1trZXldO1xyXG4gICAgICAgIGlmIChjb250ZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBfX3R5cGVfXzoganMuX2dldENsYXNzSWQoVGV4dHVyZTJEKSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==