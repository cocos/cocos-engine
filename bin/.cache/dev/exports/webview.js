(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../cocos/webview/webview.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../cocos/webview/webview.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webview);
    global.webview = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _webview) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "WebView", {
    enumerable: true,
    get: function () {
      return _webview.WebView;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=