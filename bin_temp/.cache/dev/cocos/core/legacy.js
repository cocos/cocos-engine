(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./platform/debug.js", "./utils/path.js", "./global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./platform/debug.js"), require("./utils/path.js"), require("./global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.debug, global.path, global.globalExports);
    global.legacy = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (debug, _path, _globalExports) {
  "use strict";

  debug = _interopRequireWildcard(debug);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /**
   * @hidden
   */
  // import Pipeline from './load-pipeline/pipeline';
  // import Url from './load-pipeline/url';
  // cc.Pipeline = Pipeline;
  // cc.url = Url;
  // cc.AssetLibrary = AssetLibrary;
  // CCDebug.js
  _globalExports.legacyCC.log = debug.log;
  _globalExports.legacyCC.warn = debug.warn;
  _globalExports.legacyCC.error = debug.error;
  _globalExports.legacyCC.assert = debug.assert;
  _globalExports.legacyCC._throw = debug._throw;
  _globalExports.legacyCC.logID = debug.logID;
  _globalExports.legacyCC.warnID = debug.warnID;
  _globalExports.legacyCC.errorID = debug.errorID;
  _globalExports.legacyCC.assertID = debug.assertID;
  _globalExports.legacyCC.debug = debug; // path.js

  _globalExports.legacyCC.path = {
    join: _path.join,
    extname: _path.extname,
    mainFileName: _path.mainFileName,
    basename: _path.basename,
    dirname: _path.dirname,
    changeExtname: _path.changeExtname,
    changeBasename: _path.changeBasename,
    _normalize: _path._normalize,
    stripSep: _path.stripSep,

    get sep() {
      return (0, _path.getSeperator)();
    }

  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbGVnYWN5LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwibG9nIiwiZGVidWciLCJ3YXJuIiwiZXJyb3IiLCJhc3NlcnQiLCJfdGhyb3ciLCJsb2dJRCIsIndhcm5JRCIsImVycm9ySUQiLCJhc3NlcnRJRCIsInBhdGgiLCJqb2luIiwiZXh0bmFtZSIsIm1haW5GaWxlTmFtZSIsImJhc2VuYW1lIiwiZGlybmFtZSIsImNoYW5nZUV4dG5hbWUiLCJjaGFuZ2VCYXNlbmFtZSIsIl9ub3JtYWxpemUiLCJzdHJpcFNlcCIsInNlcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQU9BO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBQSwwQkFBU0MsR0FBVCxHQUFlQyxLQUFLLENBQUNELEdBQXJCO0FBQ0FELDBCQUFTRyxJQUFULEdBQWdCRCxLQUFLLENBQUNDLElBQXRCO0FBQ0FILDBCQUFTSSxLQUFULEdBQWlCRixLQUFLLENBQUNFLEtBQXZCO0FBQ0FKLDBCQUFTSyxNQUFULEdBQWtCSCxLQUFLLENBQUNHLE1BQXhCO0FBQ0FMLDBCQUFTTSxNQUFULEdBQWtCSixLQUFLLENBQUNJLE1BQXhCO0FBQ0FOLDBCQUFTTyxLQUFULEdBQWlCTCxLQUFLLENBQUNLLEtBQXZCO0FBQ0FQLDBCQUFTUSxNQUFULEdBQWtCTixLQUFLLENBQUNNLE1BQXhCO0FBQ0FSLDBCQUFTUyxPQUFULEdBQW1CUCxLQUFLLENBQUNPLE9BQXpCO0FBQ0FULDBCQUFTVSxRQUFULEdBQW9CUixLQUFLLENBQUNRLFFBQTFCO0FBQ0FWLDBCQUFTRSxLQUFULEdBQWlCQSxLQUFqQixDLENBRUE7O0FBQ0FGLDBCQUFTVyxJQUFULEdBQWdCO0FBQ1pDLElBQUFBLElBQUksRUFBSkEsVUFEWTtBQUVaQyxJQUFBQSxPQUFPLEVBQVBBLGFBRlk7QUFHWkMsSUFBQUEsWUFBWSxFQUFaQSxrQkFIWTtBQUlaQyxJQUFBQSxRQUFRLEVBQVJBLGNBSlk7QUFLWkMsSUFBQUEsT0FBTyxFQUFQQSxhQUxZO0FBTVpDLElBQUFBLGFBQWEsRUFBYkEsbUJBTlk7QUFPWkMsSUFBQUEsY0FBYyxFQUFkQSxvQkFQWTtBQVFaQyxJQUFBQSxVQUFVLEVBQVZBLGdCQVJZO0FBU1pDLElBQUFBLFFBQVEsRUFBUkEsY0FUWTs7QUFVWixRQUFJQyxHQUFKLEdBQVc7QUFDUCxhQUFPLHlCQUFQO0FBQ0g7O0FBWlcsR0FBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIGRlYnVnIGZyb20gJy4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBfbm9ybWFsaXplLCBiYXNlbmFtZSwgY2hhbmdlQmFzZW5hbWUsIGNoYW5nZUV4dG5hbWUsIGRpcm5hbWUsIGV4dG5hbWUsIGdldFNlcGVyYXRvciwgam9pbiwgbWFpbkZpbGVOYW1lLCBzdHJpcFNlcCB9IGZyb20gJy4vdXRpbHMvcGF0aCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi9nbG9iYWwtZXhwb3J0cyc7XHJcbi8vIGltcG9ydCBQaXBlbGluZSBmcm9tICcuL2xvYWQtcGlwZWxpbmUvcGlwZWxpbmUnO1xyXG4vLyBpbXBvcnQgVXJsIGZyb20gJy4vbG9hZC1waXBlbGluZS91cmwnO1xyXG5cclxuLy8gY2MuUGlwZWxpbmUgPSBQaXBlbGluZTtcclxuLy8gY2MudXJsID0gVXJsO1xyXG4vLyBjYy5Bc3NldExpYnJhcnkgPSBBc3NldExpYnJhcnk7XHJcblxyXG4vLyBDQ0RlYnVnLmpzXHJcbmxlZ2FjeUNDLmxvZyA9IGRlYnVnLmxvZztcclxubGVnYWN5Q0Mud2FybiA9IGRlYnVnLndhcm47XHJcbmxlZ2FjeUNDLmVycm9yID0gZGVidWcuZXJyb3I7XHJcbmxlZ2FjeUNDLmFzc2VydCA9IGRlYnVnLmFzc2VydDtcclxubGVnYWN5Q0MuX3Rocm93ID0gZGVidWcuX3Rocm93O1xyXG5sZWdhY3lDQy5sb2dJRCA9IGRlYnVnLmxvZ0lEO1xyXG5sZWdhY3lDQy53YXJuSUQgPSBkZWJ1Zy53YXJuSUQ7XHJcbmxlZ2FjeUNDLmVycm9ySUQgPSBkZWJ1Zy5lcnJvcklEO1xyXG5sZWdhY3lDQy5hc3NlcnRJRCA9IGRlYnVnLmFzc2VydElEO1xyXG5sZWdhY3lDQy5kZWJ1ZyA9IGRlYnVnO1xyXG5cclxuLy8gcGF0aC5qc1xyXG5sZWdhY3lDQy5wYXRoID0ge1xyXG4gICAgam9pbixcclxuICAgIGV4dG5hbWUsXHJcbiAgICBtYWluRmlsZU5hbWUsXHJcbiAgICBiYXNlbmFtZSxcclxuICAgIGRpcm5hbWUsXHJcbiAgICBjaGFuZ2VFeHRuYW1lLFxyXG4gICAgY2hhbmdlQmFzZW5hbWUsXHJcbiAgICBfbm9ybWFsaXplLFxyXG4gICAgc3RyaXBTZXAsXHJcbiAgICBnZXQgc2VwICgpIHtcclxuICAgICAgICByZXR1cm4gZ2V0U2VwZXJhdG9yKCk7XHJcbiAgICB9LFxyXG59O1xyXG4iXX0=