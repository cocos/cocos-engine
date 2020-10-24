(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../cocos/video/assets/video-clip.js", "../cocos/video/video-downloader.js", "../cocos/video/video-player.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../cocos/video/assets/video-clip.js"), require("../cocos/video/video-downloader.js"), require("../cocos/video/video-player.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.videoClip, global.videoDownloader, global.videoPlayer);
    global.video = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _videoClip, _videoDownloader, _videoPlayer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "VideoClip", {
    enumerable: true,
    get: function () {
      return _videoClip.VideoClip;
    }
  });
  Object.defineProperty(_exports, "VideoPlayer", {
    enumerable: true,
    get: function () {
      return _videoPlayer.VideoPlayer;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=