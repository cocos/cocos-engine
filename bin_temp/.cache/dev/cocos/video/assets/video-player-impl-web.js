(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/global-exports.js", "../../core/math/index.js", "../../core/platform/index.js", "../../core/components/ui-base/index.js", "../../core/utils/misc.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/global-exports.js"), require("../../core/math/index.js"), require("../../core/platform/index.js"), require("../../core/components/ui-base/index.js"), require("../../core/utils/misc.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.index, global.index, global.index, global.misc);
    global.videoPlayerImplWeb = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _index, _index2, _index3, _misc) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VideoPlayerImpl = _exports.EventType = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var game = _globalExports.legacyCC.game,
      Game = _globalExports.legacyCC.Game,
      view = _globalExports.legacyCC.view,
      screen = _globalExports.legacyCC.screen,
      visibleRect = _globalExports.legacyCC.visibleRect;
  var MIN_ZINDEX = -Math.pow(2, 15);

  var _mat4_temp = (0, _index.mat4)();

  var READY_STATE = {
    HAVE_NOTHING: 0,
    // 没有关于音频/视频是否就绪的信息
    HAVE_METADATA: 1,
    // 关于音频/视频就绪的元数据
    HAVE_CURRENT_DATA: 2,
    // 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
    HAVE_FUTURE_DATA: 3,
    // 当前及至少下一帧的数据是可用的
    HAVE_ENOUGH_DATA: 4 // 可用数据足以开始播放

  };
  var EventType;
  _exports.EventType = EventType;

  (function (EventType) {
    EventType[EventType["NONE"] = 0] = "NONE";
    EventType[EventType["PLAYING"] = 1] = "PLAYING";
    EventType[EventType["PAUSED"] = 2] = "PAUSED";
    EventType[EventType["STOPPED"] = 3] = "STOPPED";
    EventType[EventType["COMPLETED"] = 4] = "COMPLETED";
    EventType[EventType["META_LOADED"] = 5] = "META_LOADED";
    EventType[EventType["READY_TO_PLAY"] = 6] = "READY_TO_PLAY";
    EventType[EventType["ERROR"] = 7] = "ERROR";
  })(EventType || (_exports.EventType = EventType = {}));

  /**
   * @category component/video
   */
  var VideoPlayerImpl = /*#__PURE__*/function () {
    function VideoPlayerImpl(component) {
      var _this = this;

      _classCallCheck(this, VideoPlayerImpl);

      this._eventList = new Map();
      this._state = EventType.NONE;
      this._video = void 0;
      this._onHide = void 0;
      this._onShow = void 0;
      this._interrupted = false;
      this._loaded = false;
      this._loadedMeta = false;
      this._ignorePause = false;
      this._waitingFullscreen = false;
      this._fullScreenOnAwake = false;
      this._videoComponent = null;
      this._uiTrans = null;
      this._stayOnBottom = false;
      this._dirty = false;
      this._forceUpdate = false;
      this._w = 0;
      this._h = 0;
      this._m00 = 0;
      this._m01 = 0;
      this._m04 = 0;
      this._m05 = 0;
      this._m12 = 0;
      this._m13 = 0;
      this._clearColorA = -1;
      this._loadedMetadataCb = void 0;
      this._canplayCb = void 0;
      this._playCb = void 0;
      this._pauseCb = void 0;
      this._playingCb = void 0;
      this._endedCb = void 0;
      this._errorCb = void 0;
      this._videoComponent = component;
      this._uiTrans = component.node.getComponent(_index3.UITransform);

      this._onHide = function () {
        if (!_this.video || _this._state !== EventType.PLAYING) {
          return;
        }

        _this.video.pause();

        _this._interrupted = true;
      };

      this._onShow = function () {
        if (!_this._interrupted || !_this.video) {
          return;
        }

        _this.video.play();

        _this._interrupted = false;
      };
      /* handle hide & show */


      game.on(Game.EVENT_HIDE, this._onHide);
      game.on(Game.EVENT_SHOW, this._onShow);

      this._loadedMetadataCb = function (e) {
        _this._forceUpdate = true;
        _this._loadedMeta = true;

        _this.syncTrans(e.target.videoWidth, e.target.videoHeight);

        if (_this._waitingFullscreen) {
          _this._waitingFullscreen = false;

          _this._toggleFullscreen(true);
        }

        _this._dispatchEvent(EventType.META_LOADED);
      };

      this._canplayCb = function (e) {
        if (_this._loaded) {
          return;
        }

        switch (e.target.readyState) {
          case READY_STATE.HAVE_METADATA:
          case READY_STATE.HAVE_ENOUGH_DATA:
            {
              _this._loaded = true;

              _this._dispatchEvent(EventType.READY_TO_PLAY);

              break;
            }
        }
      };

      this._playCb = function (e) {
        _this._dispatchEvent(EventType.PLAYING);
      };

      this._pauseCb = function (e) {
        if (_this._ignorePause) {
          _this._ignorePause = false;
        } else {
          _this._dispatchEvent(EventType.PAUSED);
        }
      };

      this._playingCb = function (e) {
        _this._dispatchEvent(EventType.PLAYING);
      };

      this._endedCb = function (e) {
        _this._dispatchEvent(EventType.COMPLETED);
      };

      this._errorCb = function (e) {
        _this._dispatchEvent(EventType.ERROR);

        var errorObj = e.target.error;

        if (errorObj) {
          (0, _index2.error)("Error " + errorObj.code + "; details: " + errorObj.message);
        }
      };
    }

    _createClass(VideoPlayerImpl, [{
      key: "_toggleFullscreen",
      value: function _toggleFullscreen(enabled) {
        var _this2 = this;

        var video = this._video;

        if (!video || video.readyState !== READY_STATE.HAVE_ENOUGH_DATA) {
          return;
        }

        if (_index2.sys.os === _index2.sys.OS_IOS && _index2.sys.isBrowser) {
          if (enabled) {
            video.webkitEnterFullscreen && video.webkitEnterFullscreen();
          } else {
            video.webkitExitFullscreen && video.webkitExitFullscreen();
          }

          this._fullScreenOnAwake = video.webkitDisplayingFullscreen;
          return;
        } // If video does not support native full-screen playback,
        // change to setting the video size to full screen.


        if (!screen.supportsFullScreen) {
          this._fullScreenOnAwake = enabled;
          this._forceUpdate = true;
          this.syncMatrix();
          return;
        }

        if (enabled) {
          // fix IE full screen content is not centered
          if (_index2.sys.browserType === _index2.sys.BROWSER_TYPE_IE) {
            video.style.transform = '';
          } // Monitor video entry and exit full-screen events


          video.setAttribute("x5-video-player-fullscreen", 'true');
          screen.requestFullScreen(video, function (document) {
            var fullscreenElement = _index2.sys.browserType === _index2.sys.BROWSER_TYPE_IE ? document.msFullscreenElement : document.fullscreenElement;
            _this2._fullScreenOnAwake = fullscreenElement === video;
          }, function () {
            _this2._fullScreenOnAwake = false;
          });
        } else {
          video.removeAttribute("x5-video-player-fullscreen");
          screen.exitFullScreen();
        }
      }
    }, {
      key: "_dispatchEvent",
      value: function _dispatchEvent(key) {
        var callback = this._eventList.get(key);

        if (callback) {
          this._state = key;
          callback.call(this);
        }
      }
    }, {
      key: "syncTrans",
      value: function syncTrans(width, height) {
        if (this._uiTrans) {
          this._uiTrans.width = width;
          this._uiTrans.height = height;
        }
      }
    }, {
      key: "play",
      value: function play() {
        if (this.video) {
          var promise = this.video.play(); // the play API can only be initiated by user gesture.

          if (window.Promise && promise instanceof Promise) {
            promise["catch"](function (error) {// Auto-play was prevented
              // Show a UI element to let the user manually start playback
            }).then(function () {// Auto-play started
            });
          }
        }
      }
    }, {
      key: "pause",
      value: function pause() {
        if (this.video) {
          this.video.pause();
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        var _this3 = this;

        if (this.video) {
          this._ignorePause = true;
          this.video.currentTime = 0;
          this.video.pause();
          setTimeout(function () {
            _this3._ignorePause = false;

            _this3._dispatchEvent(EventType.STOPPED);
          }, 0);
        }
      }
    }, {
      key: "syncClip",
      value: function syncClip(clip) {
        this.removeDom();

        if (!clip) {
          return;
        }

        this.appendDom(clip._nativeAsset);
      }
    }, {
      key: "syncURL",
      value: function syncURL(url) {
        this.removeDom();

        if (!url) {
          return;
        }

        this.appendDom(document.createElement('video'), url);
      }
    }, {
      key: "syncFullScreenOnAwake",
      value: function syncFullScreenOnAwake(enabled) {
        if (!this._loadedMeta && enabled) {
          this._waitingFullscreen = true;
        } else {
          this._toggleFullscreen(enabled);
        }
      }
    }, {
      key: "syncStayOnBottom",
      value: function syncStayOnBottom(enabled) {
        if (this._video) {
          this._video.style['z-index'] = enabled ? MIN_ZINDEX : 0;
          this._stayOnBottom = enabled;
        }

        this._dirty = true;
      }
    }, {
      key: "removeDom",
      value: function removeDom() {
        var video = this._video;

        if ((0, _misc.contains)(game.container, video)) {
          game.container.removeChild(video);

          this._removeEvent();
        }

        this._loaded = false;
        this._video = null;
      }
    }, {
      key: "appendDom",
      value: function appendDom(video, url) {
        this._video = video;
        video.className = "cocosVideo";
        video.style.visibility = 'hidden';
        video.style.position = "absolute";
        video.style.bottom = "0px";
        video.style.left = "0px"; // video.style['object-fit'] = 'none';

        video.style['transform-origin'] = '0px 100% 0px';
        video.style['-webkit-transform-origin'] = '0px 100% 0px';
        video.setAttribute('preload', 'auto');
        video.setAttribute('webkit-playsinline', ''); // This x5-playsinline tag must be added, otherwise the play, pause events will only fire once, in the qq browser.

        video.setAttribute("x5-playsinline", '');
        video.setAttribute('playsinline', '');

        this._bindEvent();

        game.container.appendChild(video);

        if (url) {
          var source = document.createElement("source");
          source.src = url;
          video.appendChild(source);
        } else {
          this.syncTrans(video.videoWidth, video.videoHeight);
        }
      }
    }, {
      key: "_removeEvent",
      value: function _removeEvent() {
        var video = this._video;
        video.removeEventListener('loadedmetadata', this._loadedMetadataCb);
        video.removeEventListener('canplay', this._canplayCb);
        video.removeEventListener('canplaythrough', this._canplayCb);
        video.removeEventListener('play', this._playCb);
        video.removeEventListener('pause', this._pauseCb);
        video.removeEventListener('playing', this._playingCb);
        video.removeEventListener('ended', this._endedCb);
        video.removeEventListener('error', this._errorCb);
      }
    }, {
      key: "_bindEvent",
      value: function _bindEvent() {
        var video = this._video;
        video.addEventListener('loadedmetadata', this._loadedMetadataCb);
        video.addEventListener('canplay', this._canplayCb);
        video.addEventListener('canplaythrough', this._canplayCb);
        video.addEventListener('play', this._playCb);
        video.addEventListener('pause', this._pauseCb);
        video.addEventListener('playing', this._playingCb);
        video.addEventListener('ended', this._endedCb);
        video.addEventListener('error', this._errorCb);
      }
    }, {
      key: "enable",
      value: function enable() {
        if (this._video) {
          this._video.style.visibility = 'visible';
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        if (this._video) {
          this._video.style.visibility = 'hidden';

          this._video.pause();
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.removeDom();

        this._eventList.clear();

        game.off(Game.EVENT_HIDE, this._onHide);
        game.off(Game.EVENT_SHOW, this._onShow);
      }
    }, {
      key: "syncSize",
      value: function syncSize(w, h) {
        var video = this._video;
        if (!video) return;
        video.style.width = w + 'px';
        video.style.height = h + 'px';
      }
    }, {
      key: "getUICamera",
      value: function getUICamera() {
        if (!this._uiTrans || !this._uiTrans._canvas) {
          return null;
        }

        return this._uiTrans._canvas.camera;
      }
    }, {
      key: "syncMatrix",
      value: function syncMatrix() {
        if (!this._video || this._video.style.visibility === 'hidden' || !this._videoComponent) return;
        var camera = this.getUICamera();

        if (!camera) {
          return;
        }

        if (screen.fullScreen()) {
          return;
        } // use stayOnBottom


        if (this._dirty) {
          this._dirty = false;
          var clearColor = camera.clearColor;

          if (this._clearColorA === -1) {
            this._clearColorA = clearColor.a;
          }

          clearColor.a = this._stayOnBottom ? 0 : this._clearColorA;
          camera.clearColor = clearColor;
        }

        this._videoComponent.node.getWorldMatrix(_mat4_temp);

        camera.update(true);
        camera.worldMatrixToScreen(_mat4_temp, _mat4_temp, game.canvas.width, game.canvas.height);
        var width = 0,
            height = 0;

        if (this._fullScreenOnAwake) {
          width = visibleRect.width;
          height = visibleRect.height;
        } else {
          width = this._uiTrans.contentSize.width;
          height = this._uiTrans.contentSize.height;
        }

        if (!this._forceUpdate && this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 && this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 && this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 && this._w === width && this._h === height) {
          return;
        } // update matrix cache


        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = width;
        this._h = height;
        var dpr = view._devicePixelRatio;
        var scaleX = 1 / dpr;
        var scaleY = 1 / dpr;
        var container = game.container;
        var sx = _mat4_temp.m00 * scaleX,
            b = _mat4_temp.m01,
            c = _mat4_temp.m04,
            sy = _mat4_temp.m05 * scaleY;
        var w, h;
        w = this._w * scaleX;
        h = this._h * scaleY;
        this.syncSize(this._w, this._h);
        var _anchorPoint = this._uiTrans.anchorPoint,
            x = _anchorPoint.x,
            y = _anchorPoint.y;
        var appx = w * _mat4_temp.m00 * x;
        var appy = h * _mat4_temp.m05 * y;
        var offsetX = container && container.style.paddingLeft ? parseInt(container.style.paddingLeft) : 0;
        var offsetY = container && container.style.paddingBottom ? parseInt(container.style.paddingBottom) : 0;
        var tx = _mat4_temp.m12 * scaleX - appx + offsetX,
            ty = _mat4_temp.m13 * scaleY - appy + offsetY;
        var matrix = "matrix(" + sx + "," + -b + "," + -c + "," + sy + "," + tx + "," + -ty + ")";
        this._video.style['transform'] = matrix;
        this._video.style['-webkit-transform'] = matrix; // video style would change when enter fullscreen on IE
        // there is no way to add fullscreenchange event listeners on IE so that we can restore the cached video style

        if (_index2.sys.browserType !== _index2.sys.BROWSER_TYPE_IE) {
          this._forceUpdate = false;
        }
      }
    }, {
      key: "fullScreenOnAwake",
      get: function get() {
        return this._fullScreenOnAwake;
      }
    }, {
      key: "loaded",
      get: function get() {
        return this._loaded;
      }
    }, {
      key: "eventList",
      get: function get() {
        return this._eventList;
      }
    }, {
      key: "video",
      get: function get() {
        return this._video;
      }
    }, {
      key: "state",
      get: function get() {
        return this._state;
      }
    }]);

    return VideoPlayerImpl;
  }();

  _exports.VideoPlayerImpl = VideoPlayerImpl;
  _globalExports.legacyCC.internal.VideoPlayerImpl = VideoPlayerImpl;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3ZpZGVvL2Fzc2V0cy92aWRlby1wbGF5ZXItaW1wbC13ZWIudHMiXSwibmFtZXMiOlsiZ2FtZSIsImxlZ2FjeUNDIiwiR2FtZSIsInZpZXciLCJzY3JlZW4iLCJ2aXNpYmxlUmVjdCIsIk1JTl9aSU5ERVgiLCJNYXRoIiwicG93IiwiX21hdDRfdGVtcCIsIlJFQURZX1NUQVRFIiwiSEFWRV9OT1RISU5HIiwiSEFWRV9NRVRBREFUQSIsIkhBVkVfQ1VSUkVOVF9EQVRBIiwiSEFWRV9GVVRVUkVfREFUQSIsIkhBVkVfRU5PVUdIX0RBVEEiLCJFdmVudFR5cGUiLCJWaWRlb1BsYXllckltcGwiLCJjb21wb25lbnQiLCJfZXZlbnRMaXN0IiwiTWFwIiwiX3N0YXRlIiwiTk9ORSIsIl92aWRlbyIsIl9vbkhpZGUiLCJfb25TaG93IiwiX2ludGVycnVwdGVkIiwiX2xvYWRlZCIsIl9sb2FkZWRNZXRhIiwiX2lnbm9yZVBhdXNlIiwiX3dhaXRpbmdGdWxsc2NyZWVuIiwiX2Z1bGxTY3JlZW5PbkF3YWtlIiwiX3ZpZGVvQ29tcG9uZW50IiwiX3VpVHJhbnMiLCJfc3RheU9uQm90dG9tIiwiX2RpcnR5IiwiX2ZvcmNlVXBkYXRlIiwiX3ciLCJfaCIsIl9tMDAiLCJfbTAxIiwiX20wNCIsIl9tMDUiLCJfbTEyIiwiX20xMyIsIl9jbGVhckNvbG9yQSIsIl9sb2FkZWRNZXRhZGF0YUNiIiwiX2NhbnBsYXlDYiIsIl9wbGF5Q2IiLCJfcGF1c2VDYiIsIl9wbGF5aW5nQ2IiLCJfZW5kZWRDYiIsIl9lcnJvckNiIiwibm9kZSIsImdldENvbXBvbmVudCIsIlVJVHJhbnNmb3JtIiwidmlkZW8iLCJQTEFZSU5HIiwicGF1c2UiLCJwbGF5Iiwib24iLCJFVkVOVF9ISURFIiwiRVZFTlRfU0hPVyIsImUiLCJzeW5jVHJhbnMiLCJ0YXJnZXQiLCJ2aWRlb1dpZHRoIiwidmlkZW9IZWlnaHQiLCJfdG9nZ2xlRnVsbHNjcmVlbiIsIl9kaXNwYXRjaEV2ZW50IiwiTUVUQV9MT0FERUQiLCJyZWFkeVN0YXRlIiwiUkVBRFlfVE9fUExBWSIsIlBBVVNFRCIsIkNPTVBMRVRFRCIsIkVSUk9SIiwiZXJyb3JPYmoiLCJlcnJvciIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlZCIsInN5cyIsIm9zIiwiT1NfSU9TIiwiaXNCcm93c2VyIiwid2Via2l0RW50ZXJGdWxsc2NyZWVuIiwid2Via2l0RXhpdEZ1bGxzY3JlZW4iLCJ3ZWJraXREaXNwbGF5aW5nRnVsbHNjcmVlbiIsInN1cHBvcnRzRnVsbFNjcmVlbiIsInN5bmNNYXRyaXgiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9JRSIsInN0eWxlIiwidHJhbnNmb3JtIiwic2V0QXR0cmlidXRlIiwicmVxdWVzdEZ1bGxTY3JlZW4iLCJkb2N1bWVudCIsImZ1bGxzY3JlZW5FbGVtZW50IiwibXNGdWxsc2NyZWVuRWxlbWVudCIsInJlbW92ZUF0dHJpYnV0ZSIsImV4aXRGdWxsU2NyZWVuIiwia2V5IiwiY2FsbGJhY2siLCJnZXQiLCJjYWxsIiwid2lkdGgiLCJoZWlnaHQiLCJwcm9taXNlIiwid2luZG93IiwiUHJvbWlzZSIsInRoZW4iLCJjdXJyZW50VGltZSIsInNldFRpbWVvdXQiLCJTVE9QUEVEIiwiY2xpcCIsInJlbW92ZURvbSIsImFwcGVuZERvbSIsIl9uYXRpdmVBc3NldCIsInVybCIsImNyZWF0ZUVsZW1lbnQiLCJjb250YWluZXIiLCJyZW1vdmVDaGlsZCIsIl9yZW1vdmVFdmVudCIsImNsYXNzTmFtZSIsInZpc2liaWxpdHkiLCJwb3NpdGlvbiIsImJvdHRvbSIsImxlZnQiLCJfYmluZEV2ZW50IiwiYXBwZW5kQ2hpbGQiLCJzb3VyY2UiLCJzcmMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsZWFyIiwib2ZmIiwidyIsImgiLCJfY2FudmFzIiwiY2FtZXJhIiwiZ2V0VUlDYW1lcmEiLCJmdWxsU2NyZWVuIiwiY2xlYXJDb2xvciIsImEiLCJnZXRXb3JsZE1hdHJpeCIsInVwZGF0ZSIsIndvcmxkTWF0cml4VG9TY3JlZW4iLCJjYW52YXMiLCJjb250ZW50U2l6ZSIsIm0wMCIsIm0wMSIsIm0wNCIsIm0wNSIsIm0xMiIsIm0xMyIsImRwciIsIl9kZXZpY2VQaXhlbFJhdGlvIiwic2NhbGVYIiwic2NhbGVZIiwic3giLCJiIiwiYyIsInN5Iiwic3luY1NpemUiLCJhbmNob3JQb2ludCIsIngiLCJ5IiwiYXBweCIsImFwcHkiLCJvZmZzZXRYIiwicGFkZGluZ0xlZnQiLCJwYXJzZUludCIsIm9mZnNldFkiLCJwYWRkaW5nQm90dG9tIiwidHgiLCJ0eSIsIm1hdHJpeCIsImludGVybmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWdDUUEsSSxHQUEwQ0MsdUIsQ0FBMUNELEk7TUFBTUUsSSxHQUFvQ0QsdUIsQ0FBcENDLEk7TUFBTUMsSSxHQUE4QkYsdUIsQ0FBOUJFLEk7TUFBTUMsTSxHQUF3QkgsdUIsQ0FBeEJHLE07TUFBUUMsVyxHQUFnQkosdUIsQ0FBaEJJLFc7QUFFbEMsTUFBTUMsVUFBVSxHQUFHLENBQUNDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFaLENBQXBCOztBQUVBLE1BQUlDLFVBQVUsR0FBRyxrQkFBakI7O0FBRUEsTUFBTUMsV0FBVyxHQUFHO0FBQ2hCQyxJQUFBQSxZQUFZLEVBQUUsQ0FERTtBQUNNO0FBQ3RCQyxJQUFBQSxhQUFhLEVBQUUsQ0FGQztBQUVNO0FBQ3RCQyxJQUFBQSxpQkFBaUIsRUFBRSxDQUhIO0FBR007QUFDdEJDLElBQUFBLGdCQUFnQixFQUFFLENBSkY7QUFJTTtBQUN0QkMsSUFBQUEsZ0JBQWdCLEVBQUUsQ0FMRixDQUtNOztBQUxOLEdBQXBCO01BUVlDLFM7OzthQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFB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VCxDQUFrQmhLLGVBQWxCLEdBQW9DQSxlQUFwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAyMCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBtYXQ0IH0gZnJvbSBcIi4uLy4uL2NvcmUvbWF0aFwiO1xyXG5pbXBvcnQgeyBlcnJvciwgc3lzIH0gZnJvbSBcIi4uLy4uL2NvcmUvcGxhdGZvcm1cIjtcclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tIFwiLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2VcIjtcclxuaW1wb3J0IHsgVmlkZW9QbGF5ZXIgfSBmcm9tIFwiLi4vdmlkZW8tcGxheWVyXCI7XHJcbmltcG9ydCB7IGNvbnRhaW5zIH0gZnJvbSAnLi4vLi4vY29yZS91dGlscy9taXNjJztcclxuXHJcbmNvbnN0IHsgZ2FtZSwgR2FtZSwgdmlldywgc2NyZWVuLCB2aXNpYmxlUmVjdCB9ID0gbGVnYWN5Q0M7XHJcblxyXG5jb25zdCBNSU5fWklOREVYID0gLU1hdGgucG93KDIsIDE1KTtcclxuXHJcbmxldCBfbWF0NF90ZW1wID0gbWF0NCgpO1xyXG5cclxuY29uc3QgUkVBRFlfU1RBVEUgPSB7XHJcbiAgICBIQVZFX05PVEhJTkc6IDAsICAgICAgLy8g5rKh5pyJ5YWz5LqO6Z+z6aKRL+inhumikeaYr+WQpuWwsee7queahOS/oeaBr1xyXG4gICAgSEFWRV9NRVRBREFUQTogMSwgICAgIC8vIOWFs+S6jumfs+mikS/op4bpopHlsLHnu6rnmoTlhYPmlbDmja5cclxuICAgIEhBVkVfQ1VSUkVOVF9EQVRBOiAyLCAvLyDlhbPkuo7lvZPliY3mkq3mlL7kvY3nva7nmoTmlbDmja7mmK/lj6/nlKjnmoTvvIzkvYbmsqHmnInotrPlpJ/nmoTmlbDmja7mnaXmkq3mlL7kuIvkuIDluKcv5q+r56eSXHJcbiAgICBIQVZFX0ZVVFVSRV9EQVRBOiAzLCAgLy8g5b2T5YmN5Y+K6Iez5bCR5LiL5LiA5bin55qE5pWw5o2u5piv5Y+v55So55qEXHJcbiAgICBIQVZFX0VOT1VHSF9EQVRBOiA0ICAgLy8g5Y+v55So5pWw5o2u6Laz5Lul5byA5aeL5pKt5pS+XHJcbn07XHJcblxyXG5leHBvcnQgZW51bSBFdmVudFR5cGUge1xyXG4gICAgTk9ORSwgICAgICAgICAgIC8vLSDml6BcclxuICAgIFBMQVlJTkcsICAgICAgICAvLy0g6KeG6aKR5pKt5pS+5LitXHJcbiAgICBQQVVTRUQsICAgICAgICAgLy8tIOinhumikeaaguWBnOS4rVxyXG4gICAgU1RPUFBFRCwgICAgICAgIC8vLSDop4bpopHlgZzmraLkuK1cclxuICAgIENPTVBMRVRFRCwgICAgICAvLy0g6KeG6aKR5pKt5pS+5a6M5q+VXHJcbiAgICBNRVRBX0xPQURFRCwgICAgLy8tIOinhumikeWFg+aVsOaNruWKoOi9veWujOavlVxyXG4gICAgUkVBRFlfVE9fUExBWSwgIC8vLSDop4bpopHliqDovb3lrozmr5Xlj6/mkq3mlL5cclxuICAgIEVSUk9SLCAgICAgICAgICAvLy0g6KeG6aKR6ZSZ6K+vXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29tcG9uZW50L3ZpZGVvXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVySW1wbCB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9ldmVudExpc3Q6IE1hcDxudW1iZXIsIEZ1bmN0aW9uPiA9IG5ldyBNYXA8bnVtYmVyLCBGdW5jdGlvbj4oKTtcclxuICAgIHByb3RlY3RlZCBfc3RhdGUgPSBFdmVudFR5cGUuTk9ORTtcclxuICAgIHByb3RlY3RlZCBfdmlkZW86IGFueTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uSGlkZTogRnVuY3Rpb247XHJcbiAgICBwcm90ZWN0ZWQgX29uU2hvdzogRnVuY3Rpb247XHJcbiAgICBwcm90ZWN0ZWQgX2ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9sb2FkZWQgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfbG9hZGVkTWV0YSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9pZ25vcmVQYXVzZSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF93YWl0aW5nRnVsbHNjcmVlbiA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9mdWxsU2NyZWVuT25Bd2FrZSA9IGZhbHNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdmlkZW9Db21wb25lbnQ6IFZpZGVvUGxheWVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3VpVHJhbnM6IFVJVHJhbnNmb3JtIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zdGF5T25Cb3R0b20gPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfZGlydHkgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfZm9yY2VVcGRhdGUgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfdyA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2ggPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tMDAgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tMDEgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tMDQgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tMDUgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tMTIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9tMTMgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBfY2xlYXJDb2xvckEgPSAtMTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2xvYWRlZE1ldGFkYXRhQ2I6IChlKSA9PiB2b2lkO1xyXG4gICAgcHJvdGVjdGVkIF9jYW5wbGF5Q2I6IChlKSA9PiB2b2lkO1xyXG4gICAgcHJvdGVjdGVkIF9wbGF5Q2I6IChlKSA9PiB2b2lkO1xyXG4gICAgcHJvdGVjdGVkIF9wYXVzZUNiOiAoZSkgPT4gdm9pZDtcclxuICAgIHByb3RlY3RlZCBfcGxheWluZ0NiOiAoZSkgPT4gdm9pZDtcclxuICAgIHByb3RlY3RlZCBfZW5kZWRDYjogKGUpID0+IHZvaWQ7XHJcbiAgICBwcm90ZWN0ZWQgX2Vycm9yQ2I6IChlKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLl92aWRlb0NvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuICAgICAgICB0aGlzLl91aVRyYW5zID0gY29tcG9uZW50Lm5vZGUuZ2V0Q29tcG9uZW50KFVJVHJhbnNmb3JtKTtcclxuICAgICAgICB0aGlzLl9vbkhpZGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52aWRlbyB8fCB0aGlzLl9zdGF0ZSAhPT0gRXZlbnRUeXBlLlBMQVlJTkcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKTtcclxuICAgICAgICAgICAgdGhpcy5faW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fb25TaG93ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2ludGVycnVwdGVkIHx8ICF0aGlzLnZpZGVvKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5faW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8qIGhhbmRsZSBoaWRlICYgc2hvdyAqL1xyXG4gICAgICAgIGdhbWUub24oR2FtZS5FVkVOVF9ISURFLCB0aGlzLl9vbkhpZGUpO1xyXG4gICAgICAgIGdhbWUub24oR2FtZS5FVkVOVF9TSE9XLCB0aGlzLl9vblNob3cpO1xyXG5cclxuICAgICAgICB0aGlzLl9sb2FkZWRNZXRhZGF0YUNiID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9sb2FkZWRNZXRhID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5zeW5jVHJhbnMoZS50YXJnZXQudmlkZW9XaWR0aCwgZS50YXJnZXQudmlkZW9IZWlnaHQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fd2FpdGluZ0Z1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dhaXRpbmdGdWxsc2NyZWVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90b2dnbGVGdWxsc2NyZWVuKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLk1FVEFfTE9BREVEKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9jYW5wbGF5Q2IgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3dpdGNoIChlLnRhcmdldC5yZWFkeVN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJFQURZX1NUQVRFLkhBVkVfTUVUQURBVEE6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJFQURZX1NUQVRFLkhBVkVfRU5PVUdIX0RBVEE6IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLlJFQURZX1RPX1BMQVkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fcGxheUNiID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuUExBWUlORyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fcGF1c2VDYiA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZ25vcmVQYXVzZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faWdub3JlUGF1c2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLlBBVVNFRCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9wbGF5aW5nQ2IgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5QTEFZSU5HKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9lbmRlZENiID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuQ09NUExFVEVEKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9lcnJvckNiID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuRVJST1IpO1xyXG4gICAgICAgICAgICBsZXQgZXJyb3JPYmogPSBlLnRhcmdldC5lcnJvcjtcclxuICAgICAgICAgICAgaWYgKGVycm9yT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihcIkVycm9yIFwiICsgZXJyb3JPYmouY29kZSArIFwiOyBkZXRhaWxzOiBcIiArIGVycm9yT2JqLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBfdG9nZ2xlRnVsbHNjcmVlbiAoZW5hYmxlZCkge1xyXG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xyXG4gICAgICAgIGlmICghdmlkZW8gfHwgdmlkZW8ucmVhZHlTdGF0ZSAhPT0gUkVBRFlfU1RBVEUuSEFWRV9FTk9VR0hfREFUQSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3lzLm9zID09PSBzeXMuT1NfSU9TICYmIHN5cy5pc0Jyb3dzZXIpIHtcclxuICAgICAgICAgICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIHZpZGVvLndlYmtpdEVudGVyRnVsbHNjcmVlbiAmJiB2aWRlby53ZWJraXRFbnRlckZ1bGxzY3JlZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZpZGVvLndlYmtpdEV4aXRGdWxsc2NyZWVuICYmIHZpZGVvLndlYmtpdEV4aXRGdWxsc2NyZWVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZnVsbFNjcmVlbk9uQXdha2UgPSB2aWRlby53ZWJraXREaXNwbGF5aW5nRnVsbHNjcmVlbjtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdmlkZW8gZG9lcyBub3Qgc3VwcG9ydCBuYXRpdmUgZnVsbC1zY3JlZW4gcGxheWJhY2ssXHJcbiAgICAgICAgLy8gY2hhbmdlIHRvIHNldHRpbmcgdGhlIHZpZGVvIHNpemUgdG8gZnVsbCBzY3JlZW4uXHJcbiAgICAgICAgaWYgKCFzY3JlZW4uc3VwcG9ydHNGdWxsU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Z1bGxTY3JlZW5PbkF3YWtlID0gZW5hYmxlZDtcclxuICAgICAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnN5bmNNYXRyaXgoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgICAgICAgLy8gZml4IElFIGZ1bGwgc2NyZWVuIGNvbnRlbnQgaXMgbm90IGNlbnRlcmVkXHJcbiAgICAgICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfSUUpIHtcclxuICAgICAgICAgICAgICAgIHZpZGVvLnN0eWxlLnRyYW5zZm9ybSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIE1vbml0b3IgdmlkZW8gZW50cnkgYW5kIGV4aXQgZnVsbC1zY3JlZW4gZXZlbnRzXHJcbiAgICAgICAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcIng1LXZpZGVvLXBsYXllci1mdWxsc2NyZWVuXCIsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIHNjcmVlbi5yZXF1ZXN0RnVsbFNjcmVlbih2aWRlbywgKGRvY3VtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnVsbHNjcmVlbkVsZW1lbnQgPSBzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfSUUgPyBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50IDogZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsU2NyZWVuT25Bd2FrZSA9IChmdWxsc2NyZWVuRWxlbWVudCA9PT0gdmlkZW8pO1xyXG4gICAgICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsU2NyZWVuT25Bd2FrZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2aWRlby5yZW1vdmVBdHRyaWJ1dGUoXCJ4NS12aWRlby1wbGF5ZXItZnVsbHNjcmVlblwiKTtcclxuICAgICAgICAgICAgc2NyZWVuLmV4aXRGdWxsU2NyZWVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBmdWxsU2NyZWVuT25Bd2FrZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bGxTY3JlZW5PbkF3YWtlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2FkZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGV2ZW50TGlzdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50TGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlkZW8gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92aWRlbztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc3RhdGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2Rpc3BhdGNoRXZlbnQgKGtleSkge1xyXG4gICAgICAgIGxldCBjYWxsYmFjayA9IHRoaXMuX2V2ZW50TGlzdC5nZXQoa2V5KTtcclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBrZXk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBzeW5jVHJhbnMgKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICBpZiAodGhpcy5fdWlUcmFucykge1xyXG4gICAgICAgICAgICB0aGlzLl91aVRyYW5zLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpVHJhbnMuaGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbGF5ICgpIHtcclxuICAgICAgICBpZiAodGhpcy52aWRlbykge1xyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IHRoaXMudmlkZW8ucGxheSgpO1xyXG4gICAgICAgICAgICAvLyB0aGUgcGxheSBBUEkgY2FuIG9ubHkgYmUgaW5pdGlhdGVkIGJ5IHVzZXIgZ2VzdHVyZS5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5Qcm9taXNlICYmIHByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBdXRvLXBsYXkgd2FzIHByZXZlbnRlZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3cgYSBVSSBlbGVtZW50IHRvIGxldCB0aGUgdXNlciBtYW51YWxseSBzdGFydCBwbGF5YmFja1xyXG4gICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQXV0by1wbGF5IHN0YXJ0ZWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwYXVzZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlkZW8pIHtcclxuICAgICAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RvcCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlkZW8pIHtcclxuICAgICAgICAgICAgdGhpcy5faWdub3JlUGF1c2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lnbm9yZVBhdXNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5TVE9QUEVEKTtcclxuICAgICAgICAgICAgfSwgMClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN5bmNDbGlwIChjbGlwKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVEb20oKTtcclxuICAgICAgICBpZiAoIWNsaXApIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5hcHBlbmREb20oY2xpcC5fbmF0aXZlQXNzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jVVJMICh1cmwpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZURvbSgpO1xyXG4gICAgICAgIGlmICghdXJsKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuYXBwZW5kRG9tKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyksIHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN5bmNGdWxsU2NyZWVuT25Bd2FrZSAoZW5hYmxlZCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbG9hZGVkTWV0YSAmJiBlbmFibGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dhaXRpbmdGdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvZ2dsZUZ1bGxzY3JlZW4oZW5hYmxlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jU3RheU9uQm90dG9tIChlbmFibGVkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZpZGVvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZGVvLnN0eWxlWyd6LWluZGV4J10gPSBlbmFibGVkID8gTUlOX1pJTkRFWCA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXlPbkJvdHRvbSA9IGVuYWJsZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlRG9tICgpIHtcclxuICAgICAgICBsZXQgdmlkZW8gPSB0aGlzLl92aWRlbztcclxuICAgICAgICBpZiAoY29udGFpbnMoZ2FtZS5jb250YWluZXIsIHZpZGVvKSkge1xyXG4gICAgICAgICAgICBnYW1lLmNvbnRhaW5lci5yZW1vdmVDaGlsZCh2aWRlbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3ZpZGVvID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kRG9tICh2aWRlbywgdXJsPykge1xyXG4gICAgICAgIHRoaXMuX3ZpZGVvID0gdmlkZW87XHJcbiAgICAgICAgdmlkZW8uY2xhc3NOYW1lID0gXCJjb2Nvc1ZpZGVvXCI7XHJcbiAgICAgICAgdmlkZW8uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgIHZpZGVvLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHZpZGVvLnN0eWxlLmJvdHRvbSA9IFwiMHB4XCI7XHJcbiAgICAgICAgdmlkZW8uc3R5bGUubGVmdCA9IFwiMHB4XCI7XHJcbiAgICAgICAgLy8gdmlkZW8uc3R5bGVbJ29iamVjdC1maXQnXSA9ICdub25lJztcclxuICAgICAgICB2aWRlby5zdHlsZVsndHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XHJcbiAgICAgICAgdmlkZW8uc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XHJcbiAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKCdwcmVsb2FkJywgJ2F1dG8nKTtcclxuICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoJ3dlYmtpdC1wbGF5c2lubGluZScsICcnKTtcclxuICAgICAgICAvLyBUaGlzIHg1LXBsYXlzaW5saW5lIHRhZyBtdXN0IGJlIGFkZGVkLCBvdGhlcndpc2UgdGhlIHBsYXksIHBhdXNlIGV2ZW50cyB3aWxsIG9ubHkgZmlyZSBvbmNlLCBpbiB0aGUgcXEgYnJvd3Nlci5cclxuICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJ4NS1wbGF5c2lubGluZVwiLCAnJyk7XHJcbiAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKCdwbGF5c2lubGluZScsICcnKTtcclxuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoKTtcclxuICAgICAgICBnYW1lLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XHJcbiAgICAgICAgaWYgKHVybCkge1xyXG4gICAgICAgICAgICBsZXQgc291cmNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNvdXJjZVwiKTtcclxuICAgICAgICAgICAgc291cmNlLnNyYyA9IHVybDtcclxuICAgICAgICAgICAgdmlkZW8uYXBwZW5kQ2hpbGQoc291cmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3luY1RyYW5zKHZpZGVvLnZpZGVvV2lkdGgsIHZpZGVvLnZpZGVvSGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9yZW1vdmVFdmVudCAoKSB7XHJcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW87XHJcbiAgICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCB0aGlzLl9sb2FkZWRNZXRhZGF0YUNiKTtcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgdGhpcy5fY2FucGxheUNiKTtcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIHRoaXMuX2NhbnBsYXlDYik7XHJcbiAgICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGxheScsIHRoaXMuX3BsYXlDYik7XHJcbiAgICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGF1c2UnLCB0aGlzLl9wYXVzZUNiKTtcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgdGhpcy5fcGxheWluZ0NiKTtcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdlbmRlZCcsIHRoaXMuX2VuZGVkQ2IpO1xyXG4gICAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5fZXJyb3JDYik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9iaW5kRXZlbnQgKCkge1xyXG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xyXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgdGhpcy5fbG9hZGVkTWV0YWRhdGFDYik7XHJcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsIHRoaXMuX2NhbnBsYXlDYik7XHJcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCB0aGlzLl9jYW5wbGF5Q2IpO1xyXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXknLCB0aGlzLl9wbGF5Q2IpO1xyXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgdGhpcy5fcGF1c2VDYik7XHJcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIHRoaXMuX3BsYXlpbmdDYik7XHJcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCB0aGlzLl9lbmRlZENiKTtcclxuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHRoaXMuX2Vycm9yQ2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbmFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl92aWRlbykge1xyXG4gICAgICAgICAgICB0aGlzLl92aWRlby5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZpZGVvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZGVvLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRG9tKCk7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmNsZWFyKCk7XHJcbiAgICAgICAgZ2FtZS5vZmYoR2FtZS5FVkVOVF9ISURFLCB0aGlzLl9vbkhpZGUpO1xyXG4gICAgICAgIGdhbWUub2ZmKEdhbWUuRVZFTlRfU0hPVywgdGhpcy5fb25TaG93KTtcclxuICAgIH1cclxuXHJcbiAgICBzeW5jU2l6ZSAodywgaCkge1xyXG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xyXG4gICAgICAgIGlmICghdmlkZW8pIHJldHVybjtcclxuXHJcbiAgICAgICAgdmlkZW8uc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcclxuICAgICAgICB2aWRlby5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICBnZXRVSUNhbWVyYSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl91aVRyYW5zIHx8ICF0aGlzLl91aVRyYW5zLl9jYW52YXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl91aVRyYW5zLl9jYW52YXMuY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jTWF0cml4ICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3ZpZGVvIHx8IHRoaXMuX3ZpZGVvLnN0eWxlLnZpc2liaWxpdHkgPT09ICdoaWRkZW4nIHx8ICF0aGlzLl92aWRlb0NvbXBvbmVudCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLmdldFVJQ2FtZXJhKCk7XHJcbiAgICAgICAgaWYgKCFjYW1lcmEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNjcmVlbi5mdWxsU2NyZWVuKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXNlIHN0YXlPbkJvdHRvbVxyXG4gICAgICAgIGlmICh0aGlzLl9kaXJ0eSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgY2xlYXJDb2xvciA9IGNhbWVyYS5jbGVhckNvbG9yO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2xlYXJDb2xvckEgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGVhckNvbG9yQSA9IGNsZWFyQ29sb3IuYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbGVhckNvbG9yLmEgPSB0aGlzLl9zdGF5T25Cb3R0b20gPyAwIDogdGhpcy5fY2xlYXJDb2xvckE7XHJcbiAgICAgICAgICAgIGNhbWVyYS5jbGVhckNvbG9yID0gY2xlYXJDb2xvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZGVvQ29tcG9uZW50Lm5vZGUuZ2V0V29ybGRNYXRyaXgoX21hdDRfdGVtcCk7XHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICBjYW1lcmEud29ybGRNYXRyaXhUb1NjcmVlbihfbWF0NF90ZW1wLCBfbWF0NF90ZW1wLCBnYW1lLmNhbnZhcy53aWR0aCwgZ2FtZS5jYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gMCwgaGVpZ2h0ID0gMDtcclxuICAgICAgICBpZiAodGhpcy5fZnVsbFNjcmVlbk9uQXdha2UpIHtcclxuICAgICAgICAgICAgd2lkdGggPSB2aXNpYmxlUmVjdC53aWR0aDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdmlzaWJsZVJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLl91aVRyYW5zIS5jb250ZW50U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5fdWlUcmFucyEuY29udGVudFNpemUuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9mb3JjZVVwZGF0ZSAmJlxyXG4gICAgICAgICAgICB0aGlzLl9tMDAgPT09IF9tYXQ0X3RlbXAubTAwICYmIHRoaXMuX20wMSA9PT0gX21hdDRfdGVtcC5tMDEgJiZcclxuICAgICAgICAgICAgdGhpcy5fbTA0ID09PSBfbWF0NF90ZW1wLm0wNCAmJiB0aGlzLl9tMDUgPT09IF9tYXQ0X3RlbXAubTA1ICYmXHJcbiAgICAgICAgICAgIHRoaXMuX20xMiA9PT0gX21hdDRfdGVtcC5tMTIgJiYgdGhpcy5fbTEzID09PSBfbWF0NF90ZW1wLm0xMyAmJlxyXG4gICAgICAgICAgICB0aGlzLl93ID09PSB3aWR0aCAmJiB0aGlzLl9oID09PSBoZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIG1hdHJpeCBjYWNoZVxyXG4gICAgICAgIHRoaXMuX20wMCA9IF9tYXQ0X3RlbXAubTAwO1xyXG4gICAgICAgIHRoaXMuX20wMSA9IF9tYXQ0X3RlbXAubTAxO1xyXG4gICAgICAgIHRoaXMuX20wNCA9IF9tYXQ0X3RlbXAubTA0O1xyXG4gICAgICAgIHRoaXMuX20wNSA9IF9tYXQ0X3RlbXAubTA1O1xyXG4gICAgICAgIHRoaXMuX20xMiA9IF9tYXQ0X3RlbXAubTEyO1xyXG4gICAgICAgIHRoaXMuX20xMyA9IF9tYXQ0X3RlbXAubTEzO1xyXG4gICAgICAgIHRoaXMuX3cgPSB3aWR0aDtcclxuICAgICAgICB0aGlzLl9oID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgZHByID0gdmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICBsZXQgc2NhbGVYID0gMSAvIGRwcjtcclxuICAgICAgICBsZXQgc2NhbGVZID0gMSAvIGRwcjtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGdhbWUuY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzeCA9IF9tYXQ0X3RlbXAubTAwICogc2NhbGVYLCBiID0gX21hdDRfdGVtcC5tMDEsIGMgPSBfbWF0NF90ZW1wLm0wNCwgc3kgPSBfbWF0NF90ZW1wLm0wNSAqIHNjYWxlWTtcclxuXHJcbiAgICAgICAgbGV0IHcsIGg7XHJcbiAgICAgICAgdyA9IHRoaXMuX3cgKiBzY2FsZVg7XHJcbiAgICAgICAgaCA9IHRoaXMuX2ggKiBzY2FsZVk7XHJcbiAgICAgICAgdGhpcy5zeW5jU2l6ZSh0aGlzLl93LCB0aGlzLl9oKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLl91aVRyYW5zIS5hbmNob3JQb2ludDtcclxuICAgICAgICBsZXQgYXBweCA9ICh3ICogX21hdDRfdGVtcC5tMDApICogeDtcclxuICAgICAgICBsZXQgYXBweSA9IChoICogX21hdDRfdGVtcC5tMDUpICogeTtcclxuXHJcbiAgICAgICAgbGV0IG9mZnNldFggPSBjb250YWluZXIgJiYgY29udGFpbmVyLnN0eWxlLnBhZGRpbmdMZWZ0ID8gcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlLnBhZGRpbmdMZWZ0KSA6IDA7XHJcbiAgICAgICAgbGV0IG9mZnNldFkgPSBjb250YWluZXIgJiYgY29udGFpbmVyLnN0eWxlLnBhZGRpbmdCb3R0b20gPyBwYXJzZUludChjb250YWluZXIuc3R5bGUucGFkZGluZ0JvdHRvbSkgOiAwO1xyXG4gICAgICAgIGxldCB0eCA9IF9tYXQ0X3RlbXAubTEyICogc2NhbGVYIC0gYXBweCArIG9mZnNldFgsIHR5ID0gX21hdDRfdGVtcC5tMTMgKiBzY2FsZVkgLSBhcHB5ICsgb2Zmc2V0WTtcclxuXHJcbiAgICAgICAgbGV0IG1hdHJpeCA9IFwibWF0cml4KFwiICsgc3ggKyBcIixcIiArIC1iICsgXCIsXCIgKyAtYyArIFwiLFwiICsgc3kgKyBcIixcIiArIHR4ICsgXCIsXCIgKyAtdHkgKyBcIilcIjtcclxuICAgICAgICB0aGlzLl92aWRlby5zdHlsZVsndHJhbnNmb3JtJ10gPSBtYXRyaXg7XHJcbiAgICAgICAgdGhpcy5fdmlkZW8uc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSBtYXRyaXg7XHJcbiAgICAgICAgLy8gdmlkZW8gc3R5bGUgd291bGQgY2hhbmdlIHdoZW4gZW50ZXIgZnVsbHNjcmVlbiBvbiBJRVxyXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIHdheSB0byBhZGQgZnVsbHNjcmVlbmNoYW5nZSBldmVudCBsaXN0ZW5lcnMgb24gSUUgc28gdGhhdCB3ZSBjYW4gcmVzdG9yZSB0aGUgY2FjaGVkIHZpZGVvIHN0eWxlXHJcbiAgICAgICAgaWYgKHN5cy5icm93c2VyVHlwZSAhPT0gc3lzLkJST1dTRVJfVFlQRV9JRSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mb3JjZVVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuaW50ZXJuYWwuVmlkZW9QbGF5ZXJJbXBsID0gVmlkZW9QbGF5ZXJJbXBsO1xyXG4iXX0=