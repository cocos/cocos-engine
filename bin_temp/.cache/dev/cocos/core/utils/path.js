(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.path = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.join = join;
  _exports.extname = extname;
  _exports.mainFileName = mainFileName;
  _exports.basename = basename;
  _exports.dirname = dirname;
  _exports.changeExtname = changeExtname;
  _exports.changeBasename = changeBasename;
  _exports._normalize = _normalize;
  _exports.stripSep = stripSep;
  _exports.getSeperator = getSeperator;

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
  var EXTNAME_RE = /(\.[^\.\/\?\\]*)(\?.*)?$/;
  var DIRNAME_RE = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/;
  var NORMALIZE_RE = /[^\.\/]+\/\.\.\//;
  /**
   * @en Join strings to be a path.
   * @zh 拼接字符串为路径。
   * @example {@link cocos/core/utils/CCPath/join.js}
   */

  function join() {
    var result = '';

    for (var _len = arguments.length, segments = new Array(_len), _key = 0; _key < _len; _key++) {
      segments[_key] = arguments[_key];
    }

    for (var _i = 0, _segments = segments; _i < _segments.length; _i++) {
      var segment = _segments[_i];
      result = (result + (result === '' ? '' : '/') + segment).replace(/(\/|\\\\)$/, '');
    }

    return result;
  }
  /**
   * @en Get the ext name of a path including '.', like '.png'.
   * @zh 返回 Path 的扩展名，包括 '.'，例如 '.png'。
   * @example {@link cocos/core/utils/CCPath/extname.js}
   */


  function extname(path) {
    var temp = EXTNAME_RE.exec(path);
    return temp ? temp[1] : '';
  }
  /**
   * @en Get the main name of a file name.
   * @zh 获取文件名的主名称。
   * @deprecated
   */


  function mainFileName(fileName) {
    if (fileName) {
      var idx = fileName.lastIndexOf('.');

      if (idx !== -1) {
        return fileName.substring(0, idx);
      }
    }

    return fileName;
  }
  /**
   * @en Get the file name of a file path.
   * @zh 获取文件路径的文件名。
   * @example {@link cocos/core/utils/CCPath/basename.js}
   */


  function basename(path, extName) {
    var index = path.indexOf('?');

    if (index > 0) {
      path = path.substring(0, index);
    }

    var reg = /(\/|\\)([^\/\\]+)$/g;
    var result = reg.exec(path.replace(/(\/|\\)$/, ''));

    if (!result) {
      return '';
    }

    var baseName = result[2];

    if (extName && path.substring(path.length - extName.length).toLowerCase() === extName.toLowerCase()) {
      return baseName.substring(0, baseName.length - extName.length);
    }

    return baseName;
  }
  /**
   * @en Get dirname of a file path.
   * @zh 获取文件路径的目录名。
   * @example {@link cocos/core/utils/CCPath/dirname.js}
   */


  function dirname(path) {
    var temp = DIRNAME_RE.exec(path);
    return temp ? temp[2] : '';
  }
  /**
   * @en Change extname of a file path.
   * @zh 更改文件路径的扩展名。
   * @example {@link cocos/core/utils/CCPath/changeExtname.js}
   */


  function changeExtname(path, extName) {
    extName = extName || '';
    var index = path.indexOf('?');
    var tempStr = '';

    if (index > 0) {
      tempStr = path.substring(index);
      path = path.substring(0, index);
    }

    index = path.lastIndexOf('.');

    if (index < 0) {
      return path + extName + tempStr;
    }

    return path.substring(0, index) + extName + tempStr;
  }
  /**
   * @en Change file name of a file path.
   * @zh 更改文件路径的文件名。
   * @example {@link cocos/core/utils/CCPath/changeBasename.js}
   */


  function changeBasename(path, baseName, isSameExt) {
    if (baseName.indexOf('.') === 0) {
      return changeExtname(path, baseName);
    }

    var index = path.indexOf('?');
    var tempStr = '';
    var ext = isSameExt ? extname(path) : '';

    if (index > 0) {
      tempStr = path.substring(index);
      path = path.substring(0, index);
    }

    index = path.lastIndexOf('/');
    index = index <= 0 ? 0 : index + 1;
    return path.substring(0, index) + baseName + ext + tempStr;
  } // todo make public after verification


  function _normalize(url) {
    var oldUrl = url = String(url); // removing all ../

    do {
      oldUrl = url;
      url = url.replace(NORMALIZE_RE, '');
    } while (oldUrl.length !== url.length);

    return url;
  }

  function stripSep(path) {
    return path.replace(/[\/\\]$/, '');
  }

  function getSeperator() {
    return _globalExports.legacyCC.sys.os === _globalExports.legacyCC.sys.OS_WINDOWS ? '\\' : '/';
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvcGF0aC50cyJdLCJuYW1lcyI6WyJFWFROQU1FX1JFIiwiRElSTkFNRV9SRSIsIk5PUk1BTElaRV9SRSIsImpvaW4iLCJyZXN1bHQiLCJzZWdtZW50cyIsInNlZ21lbnQiLCJyZXBsYWNlIiwiZXh0bmFtZSIsInBhdGgiLCJ0ZW1wIiwiZXhlYyIsIm1haW5GaWxlTmFtZSIsImZpbGVOYW1lIiwiaWR4IiwibGFzdEluZGV4T2YiLCJzdWJzdHJpbmciLCJiYXNlbmFtZSIsImV4dE5hbWUiLCJpbmRleCIsImluZGV4T2YiLCJyZWciLCJiYXNlTmFtZSIsImxlbmd0aCIsInRvTG93ZXJDYXNlIiwiZGlybmFtZSIsImNoYW5nZUV4dG5hbWUiLCJ0ZW1wU3RyIiwiY2hhbmdlQmFzZW5hbWUiLCJpc1NhbWVFeHQiLCJleHQiLCJfbm9ybWFsaXplIiwidXJsIiwib2xkVXJsIiwiU3RyaW5nIiwic3RyaXBTZXAiLCJnZXRTZXBlcmF0b3IiLCJsZWdhY3lDQyIsInN5cyIsIm9zIiwiT1NfV0lORE9XUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxNQUFNQSxVQUFVLEdBQUcsMEJBQW5CO0FBQ0EsTUFBTUMsVUFBVSxHQUFHLGdDQUFuQjtBQUNBLE1BQU1DLFlBQVksR0FBRyxrQkFBckI7QUFFQTs7Ozs7O0FBS08sV0FBU0MsSUFBVCxHQUFzQztBQUN6QyxRQUFJQyxNQUFNLEdBQUcsRUFBYjs7QUFEeUMsc0NBQXBCQyxRQUFvQjtBQUFwQkEsTUFBQUEsUUFBb0I7QUFBQTs7QUFFekMsaUNBQXNCQSxRQUF0QiwrQkFBZ0M7QUFBM0IsVUFBTUMsT0FBTyxnQkFBYjtBQUNERixNQUFBQSxNQUFNLEdBQUcsQ0FBQ0EsTUFBTSxJQUFJQSxNQUFNLEtBQUssRUFBWCxHQUFnQixFQUFoQixHQUFxQixHQUF6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RixHQUFELENBQXpCLENBRDZCLENBRzdCOztBQUNBLE9BQUc7QUFDQ0MsTUFBQUEsTUFBTSxHQUFHRCxHQUFUO0FBQ0FBLE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDekIsT0FBSixDQUFZTCxZQUFaLEVBQTBCLEVBQTFCLENBQU47QUFDSCxLQUhELFFBR1MrQixNQUFNLENBQUNWLE1BQVAsS0FBa0JTLEdBQUcsQ0FBQ1QsTUFIL0I7O0FBSUEsV0FBT1MsR0FBUDtBQUNIOztBQUVNLFdBQVNHLFFBQVQsQ0FBbUIxQixJQUFuQixFQUFpQztBQUNwQyxXQUFPQSxJQUFJLENBQUNGLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLEVBQXhCLENBQVA7QUFDSDs7QUFFTSxXQUFTNkIsWUFBVCxHQUF5QjtBQUM1QixXQUFPQyx3QkFBU0MsR0FBVCxDQUFhQyxFQUFiLEtBQW9CRix3QkFBU0MsR0FBVCxDQUFhRSxVQUFqQyxHQUE4QyxJQUE5QyxHQUFxRCxHQUE1RDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBFWFROQU1FX1JFID0gLyhcXC5bXlxcLlxcL1xcP1xcXFxdKikoXFw/LiopPyQvO1xyXG5jb25zdCBESVJOQU1FX1JFID0gLygoLiopKFxcL3xcXFxcfFxcXFxcXFxcKSk/KC4qP1xcLi4qJCk/LztcclxuY29uc3QgTk9STUFMSVpFX1JFID0gL1teXFwuXFwvXStcXC9cXC5cXC5cXC8vO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBKb2luIHN0cmluZ3MgdG8gYmUgYSBwYXRoLlxyXG4gKiBAemgg5ou85o6l5a2X56ym5Liy5Li66Lev5b6E44CCXHJcbiAqIEBleGFtcGxlIHtAbGluayBjb2Nvcy9jb3JlL3V0aWxzL0NDUGF0aC9qb2luLmpzfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGpvaW4gKC4uLnNlZ21lbnRzOiBzdHJpbmdbXSkge1xyXG4gICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgZm9yIChjb25zdCBzZWdtZW50IG9mIHNlZ21lbnRzKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gKHJlc3VsdCArIChyZXN1bHQgPT09ICcnID8gJycgOiAnLycpICsgc2VnbWVudCkucmVwbGFjZSgvKFxcL3xcXFxcXFxcXCkkLywgJycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBHZXQgdGhlIGV4dCBuYW1lIG9mIGEgcGF0aCBpbmNsdWRpbmcgJy4nLCBsaWtlICcucG5nJy5cclxuICogQHpoIOi/lOWbniBQYXRoIOeahOaJqeWxleWQje+8jOWMheaLrCAnLifvvIzkvovlpoIgJy5wbmcn44CCXHJcbiAqIEBleGFtcGxlIHtAbGluayBjb2Nvcy9jb3JlL3V0aWxzL0NDUGF0aC9leHRuYW1lLmpzfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGV4dG5hbWUgKHBhdGg6IHN0cmluZykge1xyXG4gICAgY29uc3QgdGVtcCA9IEVYVE5BTUVfUkUuZXhlYyhwYXRoKTtcclxuICAgIHJldHVybiB0ZW1wID8gdGVtcFsxXSA6ICcnO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdldCB0aGUgbWFpbiBuYW1lIG9mIGEgZmlsZSBuYW1lLlxyXG4gKiBAemgg6I635Y+W5paH5Lu25ZCN55qE5Li75ZCN56ew44CCXHJcbiAqIEBkZXByZWNhdGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWFpbkZpbGVOYW1lIChmaWxlTmFtZTogc3RyaW5nKSB7XHJcbiAgICBpZiAoZmlsZU5hbWUpIHtcclxuICAgICAgICBjb25zdCBpZHggPSBmaWxlTmFtZS5sYXN0SW5kZXhPZignLicpO1xyXG4gICAgICAgIGlmIChpZHggIT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlTmFtZS5zdWJzdHJpbmcoMCwgaWR4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmlsZU5hbWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR2V0IHRoZSBmaWxlIG5hbWUgb2YgYSBmaWxlIHBhdGguXHJcbiAqIEB6aCDojrflj5bmlofku7bot6/lvoTnmoTmlofku7blkI3jgIJcclxuICogQGV4YW1wbGUge0BsaW5rIGNvY29zL2NvcmUvdXRpbHMvQ0NQYXRoL2Jhc2VuYW1lLmpzfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGJhc2VuYW1lIChwYXRoOiBzdHJpbmcsIGV4dE5hbWU/OiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGF0aC5pbmRleE9mKCc/Jyk7XHJcbiAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDAsIGluZGV4KTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlZyA9IC8oXFwvfFxcXFwpKFteXFwvXFxcXF0rKSQvZztcclxuICAgIGNvbnN0IHJlc3VsdCA9IHJlZy5leGVjKHBhdGgucmVwbGFjZSgvKFxcL3xcXFxcKSQvLCAnJykpO1xyXG4gICAgaWYgKCFyZXN1bHQpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBiYXNlTmFtZSA9IHJlc3VsdFsyXTtcclxuICAgIGlmIChleHROYW1lICYmIHBhdGguc3Vic3RyaW5nKHBhdGgubGVuZ3RoIC0gZXh0TmFtZS5sZW5ndGgpLnRvTG93ZXJDYXNlKCkgPT09IGV4dE5hbWUudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgIHJldHVybiBiYXNlTmFtZS5zdWJzdHJpbmcoMCwgYmFzZU5hbWUubGVuZ3RoIC0gZXh0TmFtZS5sZW5ndGgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJhc2VOYW1lO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdldCBkaXJuYW1lIG9mIGEgZmlsZSBwYXRoLlxyXG4gKiBAemgg6I635Y+W5paH5Lu26Lev5b6E55qE55uu5b2V5ZCN44CCXHJcbiAqIEBleGFtcGxlIHtAbGluayBjb2Nvcy9jb3JlL3V0aWxzL0NDUGF0aC9kaXJuYW1lLmpzfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRpcm5hbWUgKHBhdGg6IHN0cmluZykge1xyXG4gICAgY29uc3QgdGVtcCA9IERJUk5BTUVfUkUuZXhlYyhwYXRoKTtcclxuICAgIHJldHVybiB0ZW1wID8gdGVtcFsyXSA6ICcnO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIENoYW5nZSBleHRuYW1lIG9mIGEgZmlsZSBwYXRoLlxyXG4gKiBAemgg5pu05pS55paH5Lu26Lev5b6E55qE5omp5bGV5ZCN44CCXHJcbiAqIEBleGFtcGxlIHtAbGluayBjb2Nvcy9jb3JlL3V0aWxzL0NDUGF0aC9jaGFuZ2VFeHRuYW1lLmpzfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZUV4dG5hbWUgKHBhdGg6IHN0cmluZywgZXh0TmFtZT86IHN0cmluZykge1xyXG4gICAgZXh0TmFtZSA9IGV4dE5hbWUgfHwgJyc7XHJcbiAgICBsZXQgaW5kZXggPSBwYXRoLmluZGV4T2YoJz8nKTtcclxuICAgIGxldCB0ZW1wU3RyID0gJyc7XHJcbiAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgdGVtcFN0ciA9IHBhdGguc3Vic3RyaW5nKGluZGV4KTtcclxuICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMCwgaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcuJyk7XHJcbiAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhdGggKyBleHROYW1lICsgdGVtcFN0cjtcclxuICAgIH1cclxuICAgIHJldHVybiBwYXRoLnN1YnN0cmluZygwLCBpbmRleCkgKyBleHROYW1lICsgdGVtcFN0cjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBDaGFuZ2UgZmlsZSBuYW1lIG9mIGEgZmlsZSBwYXRoLlxyXG4gKiBAemgg5pu05pS55paH5Lu26Lev5b6E55qE5paH5Lu25ZCN44CCXHJcbiAqIEBleGFtcGxlIHtAbGluayBjb2Nvcy9jb3JlL3V0aWxzL0NDUGF0aC9jaGFuZ2VCYXNlbmFtZS5qc31cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VCYXNlbmFtZSAocGF0aDogc3RyaW5nLCBiYXNlTmFtZTogc3RyaW5nLCBpc1NhbWVFeHQ/OiBib29sZWFuKSB7XHJcbiAgICBpZiAoYmFzZU5hbWUuaW5kZXhPZignLicpID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUV4dG5hbWUocGF0aCwgYmFzZU5hbWUpO1xyXG4gICAgfVxyXG4gICAgbGV0IGluZGV4ID0gcGF0aC5pbmRleE9mKCc/Jyk7XHJcbiAgICBsZXQgdGVtcFN0ciA9ICcnO1xyXG4gICAgY29uc3QgZXh0ID0gaXNTYW1lRXh0ID8gZXh0bmFtZShwYXRoKSA6ICcnO1xyXG4gICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgIHRlbXBTdHIgPSBwYXRoLnN1YnN0cmluZyhpbmRleCk7XHJcbiAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDAsIGluZGV4KTtcclxuICAgIH1cclxuICAgIGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgaW5kZXggPSBpbmRleCA8PSAwID8gMCA6IGluZGV4ICsgMTtcclxuICAgIHJldHVybiBwYXRoLnN1YnN0cmluZygwLCBpbmRleCkgKyBiYXNlTmFtZSArIGV4dCArIHRlbXBTdHI7XHJcbn1cclxuXHJcbi8vIHRvZG8gbWFrZSBwdWJsaWMgYWZ0ZXIgdmVyaWZpY2F0aW9uXHJcbmV4cG9ydCBmdW5jdGlvbiBfbm9ybWFsaXplICh1cmwpIHtcclxuICAgIGxldCBvbGRVcmwgPSB1cmwgPSBTdHJpbmcodXJsKTtcclxuXHJcbiAgICAvLyByZW1vdmluZyBhbGwgLi4vXHJcbiAgICBkbyB7XHJcbiAgICAgICAgb2xkVXJsID0gdXJsO1xyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKE5PUk1BTElaRV9SRSwgJycpO1xyXG4gICAgfSB3aGlsZSAob2xkVXJsLmxlbmd0aCAhPT0gdXJsLmxlbmd0aCk7XHJcbiAgICByZXR1cm4gdXJsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RyaXBTZXAgKHBhdGg6IHN0cmluZykge1xyXG4gICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvW1xcL1xcXFxdJC8sICcnKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlcGVyYXRvciAoKSB7XHJcbiAgICByZXR1cm4gbGVnYWN5Q0Muc3lzLm9zID09PSBsZWdhY3lDQy5zeXMuT1NfV0lORE9XUyA/ICdcXFxcJyA6ICcvJztcclxufVxyXG4iXX0=