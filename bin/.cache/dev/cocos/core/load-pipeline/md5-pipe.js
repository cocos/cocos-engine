(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./pipeline.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./pipeline.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pipeline, global.globalExports);
    global.md5Pipe = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pipeline, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var ID = 'MD5Pipe';
  var ExtnameRegex = /(\.[^.\n\\/]*)$/;
  var UuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-@]{8,}).*/;

  function getUuidFromURL(url) {
    var matches = url.match(UuidRegex);

    if (matches) {
      return matches[1];
    }

    return "";
  }
  /**
   * @en The md5 pipe in {{loader}}, it can transform the url to the real url with md5 suffix
   * @zh {{loader}} 中的 md5 管道，可以将资源 url 转换到包含 md5 后缀版本
   */


  var MD5Pipe = /*#__PURE__*/function () {
    function MD5Pipe(md5AssetsMap, md5NativeAssetsMap, libraryBase) {
      _classCallCheck(this, MD5Pipe);

      this.id = ID;
      this.async = false;
      this.pipeline = null;
      this.md5AssetsMap = void 0;
      this.md5NativeAssetsMap = void 0;
      this.libraryBase = void 0;
      this.id = ID;
      this.async = false;
      this.pipeline = null;
      this.md5AssetsMap = md5AssetsMap;
      this.md5NativeAssetsMap = md5NativeAssetsMap;
      this.libraryBase = libraryBase;
    }

    _createClass(MD5Pipe, [{
      key: "handle",
      value: function handle(item) {
        var hashPatchInFolder = false; // HACK: explicitly use folder md5 for ttf files

        if (item.type === 'ttf') {
          hashPatchInFolder = true;
        }

        item.url = this.transformURL(item.url, hashPatchInFolder);
        return item;
      }
      /**
       * @en Transform an url to the real url with md5 suffix
       * @zh 将一个 url 转换到包含 md5 后缀版本
       * @param url The url to be parsed
       * @param hashPatchInFolder NA
       */

    }, {
      key: "transformURL",
      value: function transformURL(url, hashPatchInFolder) {
        var uuid = getUuidFromURL(url);

        if (uuid) {
          var isNativeAsset = !url.match(this.libraryBase);
          var map = isNativeAsset ? this.md5NativeAssetsMap : this.md5AssetsMap;
          var hashValue = map[uuid];

          if (hashValue) {
            if (hashPatchInFolder) {
              var dirname = _globalExports.legacyCC.path.dirname(url);

              var basename = _globalExports.legacyCC.path.basename(url);

              url = "".concat(dirname, ".").concat(hashValue, "/").concat(basename);
            } else {
              var matched = false;
              url = url.replace(ExtnameRegex, function (match, p1) {
                matched = true;
                return "." + hashValue + p1;
              });

              if (!matched) {
                url = url + "." + hashValue;
              }
            }
          }
        }

        return url;
      }
    }]);

    return MD5Pipe;
  }(); // @ts-ignore


  _exports.default = MD5Pipe;
  MD5Pipe.ID = ID;
  _pipeline.Pipeline.MD5Pipe = MD5Pipe;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9tZDUtcGlwZS50cyJdLCJuYW1lcyI6WyJJRCIsIkV4dG5hbWVSZWdleCIsIlV1aWRSZWdleCIsImdldFV1aWRGcm9tVVJMIiwidXJsIiwibWF0Y2hlcyIsIm1hdGNoIiwiTUQ1UGlwZSIsIm1kNUFzc2V0c01hcCIsIm1kNU5hdGl2ZUFzc2V0c01hcCIsImxpYnJhcnlCYXNlIiwiaWQiLCJhc3luYyIsInBpcGVsaW5lIiwiaXRlbSIsImhhc2hQYXRjaEluRm9sZGVyIiwidHlwZSIsInRyYW5zZm9ybVVSTCIsInV1aWQiLCJpc05hdGl2ZUFzc2V0IiwibWFwIiwiaGFzaFZhbHVlIiwiZGlybmFtZSIsImxlZ2FjeUNDIiwicGF0aCIsImJhc2VuYW1lIiwibWF0Y2hlZCIsInJlcGxhY2UiLCJwMSIsIlBpcGVsaW5lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlDQSxNQUFNQSxFQUFFLEdBQUcsU0FBWDtBQUNBLE1BQU1DLFlBQVksR0FBRyxpQkFBckI7QUFDQSxNQUFNQyxTQUFTLEdBQUcsaURBQWxCOztBQUVBLFdBQVNDLGNBQVQsQ0FBeUJDLEdBQXpCLEVBQThCO0FBQzFCLFFBQUlDLE9BQU8sR0FBR0QsR0FBRyxDQUFDRSxLQUFKLENBQVVKLFNBQVYsQ0FBZDs7QUFDQSxRQUFJRyxPQUFKLEVBQWE7QUFDVCxhQUFPQSxPQUFPLENBQUMsQ0FBRCxDQUFkO0FBQ0g7O0FBQ0QsV0FBTyxFQUFQO0FBQ0g7QUFFRDs7Ozs7O01BSXFCRSxPO0FBVWpCLHFCQUFhQyxZQUFiLEVBQTJCQyxrQkFBM0IsRUFBK0NDLFdBQS9DLEVBQTREO0FBQUE7O0FBQUEsV0FQckRDLEVBT3FELEdBUGhEWCxFQU9nRDtBQUFBLFdBTnJEWSxLQU1xRCxHQU43QyxLQU02QztBQUFBLFdBTHJEQyxRQUtxRCxHQUwxQyxJQUswQztBQUFBLFdBSnJETCxZQUlxRDtBQUFBLFdBSHJEQyxrQkFHcUQ7QUFBQSxXQUZyREMsV0FFcUQ7QUFDeEQsV0FBS0MsRUFBTCxHQUFVWCxFQUFWO0FBQ0EsV0FBS1ksS0FBTCxHQUFhLEtBQWI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsV0FBS0wsWUFBTCxHQUFvQkEsWUFBcEI7QUFDQSxXQUFLQyxrQkFBTCxHQUEwQkEsa0JBQTFCO0FBQ0EsV0FBS0MsV0FBTCxHQUFtQkEsV0FBbkI7QUFDSDs7Ozs2QkFFT0ksSSxFQUFNO0FBQ1YsWUFBSUMsaUJBQWlCLEdBQUcsS0FBeEIsQ0FEVSxDQUVWOztBQUNBLFlBQUlELElBQUksQ0FBQ0UsSUFBTCxLQUFjLEtBQWxCLEVBQXlCO0FBQ3JCRCxVQUFBQSxpQkFBaUIsR0FBRyxJQUFwQjtBQUNIOztBQUNERCxRQUFBQSxJQUFJLENBQUNWLEdBQUwsR0FBVyxLQUFLYSxZQUFMLENBQWtCSCxJQUFJLENBQUNWLEdBQXZCLEVBQTRCVyxpQkFBNUIsQ0FBWDtBQUNBLGVBQU9ELElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7bUNBTWNWLEcsRUFBS1csaUIsRUFBNkI7QUFDNUMsWUFBSUcsSUFBSSxHQUFHZixjQUFjLENBQUNDLEdBQUQsQ0FBekI7O0FBQ0EsWUFBSWMsSUFBSixFQUFVO0FBQ04sY0FBSUMsYUFBYSxHQUFHLENBQUNmLEdBQUcsQ0FBQ0UsS0FBSixDQUFVLEtBQUtJLFdBQWYsQ0FBckI7QUFDQSxjQUFJVSxHQUFHLEdBQUdELGFBQWEsR0FBRyxLQUFLVixrQkFBUixHQUE2QixLQUFLRCxZQUF6RDtBQUNBLGNBQUlhLFNBQVMsR0FBR0QsR0FBRyxDQUFDRixJQUFELENBQW5COztBQUNBLGNBQUlHLFNBQUosRUFBZTtBQUNYLGdCQUFJTixpQkFBSixFQUF1QjtBQUNuQixrQkFBSU8sT0FBTyxHQUFHQyx3QkFBU0MsSUFBVCxDQUFjRixPQUFkLENBQXNCbEIsR0FBdEIsQ0FBZDs7QUFDQSxrQkFBSXFCLFFBQVEsR0FBR0Ysd0JBQVNDLElBQVQsQ0FBY0MsUUFBZCxDQUF1QnJCLEdBQXZCLENBQWY7O0FBQ0FBLGNBQUFBLEdBQUcsYUFBTWtCLE9BQU4sY0FBaUJELFNBQWpCLGNBQThCSSxRQUE5QixDQUFIO0FBQ0gsYUFKRCxNQUlPO0FBQ0gsa0JBQUlDLE9BQU8sR0FBRyxLQUFkO0FBQ0F0QixjQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ3VCLE9BQUosQ0FBWTFCLFlBQVosRUFBMkIsVUFBU0ssS0FBVCxFQUFnQnNCLEVBQWhCLEVBQW9CO0FBQ2pERixnQkFBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSx1QkFBTyxNQUFNTCxTQUFOLEdBQWtCTyxFQUF6QjtBQUNILGVBSEssQ0FBTjs7QUFJQSxrQkFBSSxDQUFDRixPQUFMLEVBQWM7QUFDVnRCLGdCQUFBQSxHQUFHLEdBQUdBLEdBQUcsR0FBRyxHQUFOLEdBQVlpQixTQUFsQjtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUNELGVBQU9qQixHQUFQO0FBQ0g7Ozs7T0FHTDs7OztBQTlEcUJHLEVBQUFBLE8sQ0FDVlAsRSxHQUFLQSxFO0FBOERoQjZCLHFCQUFTdEIsT0FBVCxHQUFtQkEsT0FBbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgbG9hZGVyXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgUGlwZWxpbmUsIElQaXBlIH0gZnJvbSAnLi9waXBlbGluZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgSUQgPSAnTUQ1UGlwZSc7XHJcbmNvbnN0IEV4dG5hbWVSZWdleCA9IC8oXFwuW14uXFxuXFxcXC9dKikkLztcclxuY29uc3QgVXVpZFJlZ2V4ID0gLy4qWy9cXFxcXVswLTlhLWZBLUZdezJ9Wy9cXFxcXShbMC05YS1mQS1GLUBdezgsfSkuKi87XHJcblxyXG5mdW5jdGlvbiBnZXRVdWlkRnJvbVVSTCAodXJsKSB7XHJcbiAgICBsZXQgbWF0Y2hlcyA9IHVybC5tYXRjaChVdWlkUmVnZXgpO1xyXG4gICAgaWYgKG1hdGNoZXMpIHtcclxuICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXTtcclxuICAgIH1cclxuICAgIHJldHVybiBcIlwiO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIFRoZSBtZDUgcGlwZSBpbiB7e2xvYWRlcn19LCBpdCBjYW4gdHJhbnNmb3JtIHRoZSB1cmwgdG8gdGhlIHJlYWwgdXJsIHdpdGggbWQ1IHN1ZmZpeFxyXG4gKiBAemgge3tsb2FkZXJ9fSDkuK3nmoQgbWQ1IOeuoemBk++8jOWPr+S7peWwhui1hOa6kCB1cmwg6L2s5o2i5Yiw5YyF5ZCrIG1kNSDlkI7nvIDniYjmnKxcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1ENVBpcGUgaW1wbGVtZW50cyBJUGlwZSB7XHJcbiAgICBzdGF0aWMgSUQgPSBJRDtcclxuXHJcbiAgICBwdWJsaWMgaWQgPSBJRDtcclxuICAgIHB1YmxpYyBhc3luYyA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBpcGVsaW5lID0gbnVsbDtcclxuICAgIHB1YmxpYyBtZDVBc3NldHNNYXA7XHJcbiAgICBwdWJsaWMgbWQ1TmF0aXZlQXNzZXRzTWFwO1xyXG4gICAgcHVibGljIGxpYnJhcnlCYXNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChtZDVBc3NldHNNYXAsIG1kNU5hdGl2ZUFzc2V0c01hcCwgbGlicmFyeUJhc2UpIHtcclxuICAgICAgICB0aGlzLmlkID0gSUQ7XHJcbiAgICAgICAgdGhpcy5hc3luYyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubWQ1QXNzZXRzTWFwID0gbWQ1QXNzZXRzTWFwO1xyXG4gICAgICAgIHRoaXMubWQ1TmF0aXZlQXNzZXRzTWFwID0gbWQ1TmF0aXZlQXNzZXRzTWFwO1xyXG4gICAgICAgIHRoaXMubGlicmFyeUJhc2UgPSBsaWJyYXJ5QmFzZTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGUgKGl0ZW0pIHtcclxuICAgICAgICBsZXQgaGFzaFBhdGNoSW5Gb2xkZXIgPSBmYWxzZTtcclxuICAgICAgICAvLyBIQUNLOiBleHBsaWNpdGx5IHVzZSBmb2xkZXIgbWQ1IGZvciB0dGYgZmlsZXNcclxuICAgICAgICBpZiAoaXRlbS50eXBlID09PSAndHRmJykge1xyXG4gICAgICAgICAgICBoYXNoUGF0Y2hJbkZvbGRlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGl0ZW0udXJsID0gdGhpcy50cmFuc2Zvcm1VUkwoaXRlbS51cmwsIGhhc2hQYXRjaEluRm9sZGVyKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUcmFuc2Zvcm0gYW4gdXJsIHRvIHRoZSByZWFsIHVybCB3aXRoIG1kNSBzdWZmaXhcclxuICAgICAqIEB6aCDlsIbkuIDkuKogdXJsIOi9rOaNouWIsOWMheWQqyBtZDUg5ZCO57yA54mI5pysXHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSB1cmwgdG8gYmUgcGFyc2VkXHJcbiAgICAgKiBAcGFyYW0gaGFzaFBhdGNoSW5Gb2xkZXIgTkFcclxuICAgICAqL1xyXG4gICAgdHJhbnNmb3JtVVJMICh1cmwsIGhhc2hQYXRjaEluRm9sZGVyPzogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCB1dWlkID0gZ2V0VXVpZEZyb21VUkwodXJsKTtcclxuICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICBsZXQgaXNOYXRpdmVBc3NldCA9ICF1cmwubWF0Y2godGhpcy5saWJyYXJ5QmFzZSk7XHJcbiAgICAgICAgICAgIGxldCBtYXAgPSBpc05hdGl2ZUFzc2V0ID8gdGhpcy5tZDVOYXRpdmVBc3NldHNNYXAgOiB0aGlzLm1kNUFzc2V0c01hcDtcclxuICAgICAgICAgICAgbGV0IGhhc2hWYWx1ZSA9IG1hcFt1dWlkXTtcclxuICAgICAgICAgICAgaWYgKGhhc2hWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhhc2hQYXRjaEluRm9sZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpcm5hbWUgPSBsZWdhY3lDQy5wYXRoLmRpcm5hbWUodXJsKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmFzZW5hbWUgPSBsZWdhY3lDQy5wYXRoLmJhc2VuYW1lKHVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsID0gYCR7ZGlybmFtZX0uJHtoYXNoVmFsdWV9LyR7YmFzZW5hbWV9YDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZShFeHRuYW1lUmVnZXgsIChmdW5jdGlvbihtYXRjaCwgcDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIi5cIiArIGhhc2hWYWx1ZSArIHAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW1hdGNoZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gdXJsICsgXCIuXCIgKyBoYXNoVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIEB0cy1pZ25vcmVcclxuUGlwZWxpbmUuTUQ1UGlwZSA9IE1ENVBpcGU7Il19