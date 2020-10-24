(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./assets/clip.js", "./audio-downloader.js", "./audio-source.js", "../core/global-exports.js", "../core/utils/js.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./assets/clip.js"), require("./audio-downloader.js"), require("./audio-source.js"), require("../core/global-exports.js"), require("../core/utils/js.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.clip, global.audioDownloader, global.audioSource, global.globalExports, global.js);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _clip, _audioDownloader, _audioSource, _globalExports, _js) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "AudioClip", {
    enumerable: true,
    get: function () {
      return _clip.AudioClip;
    }
  });
  Object.defineProperty(_exports, "AudioSource", {
    enumerable: true,
    get: function () {
      return _audioSource.AudioSource;
    }
  });
  Object.defineProperty(_exports, "AudioSourceComponent", {
    enumerable: true,
    get: function () {
      return _audioSource.AudioSource;
    }
  });
  _globalExports.legacyCC.AudioSourceComponent = _audioSource.AudioSource;

  _js.js.setClassAlias(_audioSource.AudioSource, 'cc.AudioSourceComponent');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2F1ZGlvL2luZGV4LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwiQXVkaW9Tb3VyY2VDb21wb25lbnQiLCJBdWRpb1NvdXJjZSIsImpzIiwic2V0Q2xhc3NBbGlhcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVUFBLDBCQUFTQyxvQkFBVCxHQUFnQ0Msd0JBQWhDOztBQUNBQyxTQUFHQyxhQUFILENBQWlCRix3QkFBakIsRUFBOEIseUJBQTlCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgQXVkaW9DbGlwIH0gZnJvbSAnLi9hc3NldHMvY2xpcCc7XHJcbmltcG9ydCAnLi9hdWRpby1kb3dubG9hZGVyJztcclxuXHJcbmltcG9ydCB7IEF1ZGlvU291cmNlIH0gZnJvbSAnLi9hdWRpby1zb3VyY2UnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gJy4uL2NvcmUvdXRpbHMvanMnO1xyXG5cclxuZXhwb3J0IHsgQXVkaW9Tb3VyY2UgfTtcclxuXHJcbmV4cG9ydCB7IEF1ZGlvU291cmNlIGFzIEF1ZGlvU291cmNlQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLkF1ZGlvU291cmNlQ29tcG9uZW50ID0gQXVkaW9Tb3VyY2U7XHJcbmpzLnNldENsYXNzQWxpYXMoQXVkaW9Tb3VyY2UsICdjYy5BdWRpb1NvdXJjZUNvbXBvbmVudCcpO1xyXG4iXX0=