(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/global-exports.js", "../core/math/index.js", "../core/platform/index.js", "../core/components/ui-base/index.js", "../core/utils/misc.js", "./video-player-enums.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/global-exports.js"), require("../core/math/index.js"), require("../core/platform/index.js"), require("../core/components/ui-base/index.js"), require("../core/utils/misc.js"), require("./video-player-enums.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.index, global.index, global.index, global.misc, global.videoPlayerEnums);
    global.videoPlayerImplWeb = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _index, _index2, _index3, _misc, _videoPlayerEnums) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VideoPlayerImpl = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var game = _globalExports.legacyCC.game,
      Game = _globalExports.legacyCC.Game,
      view = _globalExports.legacyCC.view,
      screen = _globalExports.legacyCC.screen,
      visibleRect = _globalExports.legacyCC.visibleRect,
      GFXClearFlag = _globalExports.legacyCC.GFXClearFlag;
  var MIN_ZINDEX = -Math.pow(2, 15);

  var _mat4_temp = (0, _index.mat4)();
  /**
   * @category component/video
   */


  var VideoPlayerImpl = /*#__PURE__*/function () {
    function VideoPlayerImpl(component) {
      var _this = this;

      _classCallCheck(this, VideoPlayerImpl);

      this._eventList = new Map();
      this._state = _videoPlayerEnums.EventType.NONE;
      this._video = void 0;
      this._onHide = void 0;
      this._onShow = void 0;
      this._interrupted = false;
      this._loaded = false;
      this._loadedMeta = false;
      this._ignorePause = false;
      this._waitingFullscreen = false;
      this._fullScreenOnAwake = false;
      this._playing = false;
      this._cachedCurrentTime = -1;
      this._keepAspectRatio = false;
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
      this._clearFlag = void 0;
      this._loadedMetadataCb = void 0;
      this._canplayCb = void 0;
      this._playCb = void 0;
      this._pauseCb = void 0;
      this._playingCb = void 0;
      this._endedCb = void 0;
      this._errorCb = void 0;
      this._clickCb = void 0;
      this._videoComponent = component;
      this._uiTrans = component.node.getComponent(_index3.UITransform);

      this._onHide = function () {
        if (!_this.video || _this._state !== _videoPlayerEnums.EventType.PLAYING) {
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

        _this.enable();

        if (_this._keepAspectRatio) {
          _this.syncTrans(e.target.videoWidth, e.target.videoHeight);
        }

        if (_this._waitingFullscreen) {
          _this._waitingFullscreen = false;

          _this._toggleFullscreen(true);
        }

        _this._dispatchEvent(_videoPlayerEnums.EventType.META_LOADED);
      };

      this._canplayCb = function (e) {
        if (_this._loaded) {
          return;
        }

        switch (e.target.readyState) {
          case _videoPlayerEnums.READY_STATE.HAVE_METADATA:
          case _videoPlayerEnums.READY_STATE.HAVE_ENOUGH_DATA:
            {
              _this._loaded = true;

              _this._dispatchEvent(_videoPlayerEnums.EventType.READY_TO_PLAY);

              break;
            }
        }
      };

      this._playCb = function (e) {
        _this._dispatchEvent(_videoPlayerEnums.EventType.PLAYING);
      };

      this._pauseCb = function (e) {
        _this._playing = false;

        if (_this._ignorePause) {
          _this._ignorePause = false;
        } else {
          _this._dispatchEvent(_videoPlayerEnums.EventType.PAUSED);
        }
      };

      this._playingCb = function (e) {
        _this._playing = true;

        _this._dispatchEvent(_videoPlayerEnums.EventType.PLAYING);
      };

      this._endedCb = function (e) {
        _this._dispatchEvent(_videoPlayerEnums.EventType.COMPLETED);
      };

      this._clickCb = function (e) {
        _this._dispatchEvent(_videoPlayerEnums.EventType.CLICKED);
      };

      this._errorCb = function (e) {
        _this._dispatchEvent(_videoPlayerEnums.EventType.ERROR);

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

        if (!video || video.readyState !== _videoPlayerEnums.READY_STATE.HAVE_ENOUGH_DATA) {
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
        var _this3 = this;

        if (this.video) {
          var promise = this.video.play(); // the play API can only be initiated by user gesture.

          if (window.Promise && promise instanceof Promise) {
            promise["catch"](function (error) {// Auto-play was prevented
              // Show a UI element to let the user manually start playback
            }).then(function () {
              // calibration time
              if (_this3._cachedCurrentTime !== -1 && _this3.video.currentTime !== _this3._cachedCurrentTime) {
                _this3.video.currentTime = _this3._cachedCurrentTime;
                _this3._cachedCurrentTime = -1;
              }
            });
          }
        }
      }
    }, {
      key: "pause",
      value: function pause() {
        if (this.video) {
          this.video.pause();
          this._cachedCurrentTime = this.video.currentTime;
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        var _this4 = this;

        if (this.video) {
          this._ignorePause = true;
          this.video.currentTime = 0;
          this.video.pause();
          setTimeout(function () {
            _this4._ignorePause = false;

            _this4._dispatchEvent(_videoPlayerEnums.EventType.STOPPED);
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
      key: "syncKeepAspectRatio",
      value: function syncKeepAspectRatio(enabled) {
        this._keepAspectRatio = enabled;

        if (enabled && this._loadedMeta) {
          this.syncTrans(this._video.videoWidth, this._video.videoHeight);
        }
      }
    }, {
      key: "removeDom",
      value: function removeDom() {
        var video = this._video;

        if ((0, _misc.contains)(game.container, video)) {
          game.container.removeChild(video);

          this._removeEvent();
        }

        this._cachedCurrentTime = 0;
        this._playing = false;
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
          // play remote clip
          var source = document.createElement("source");
          source.src = url;
          video.appendChild(source);
        } else {
          // play local clip
          this.enable();

          if (this._keepAspectRatio) {
            this.syncTrans(video.videoWidth, video.videoHeight);
          }
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
        video.removeEventListener('click', this._clickCb);
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
        video.addEventListener('click', this._clickCb);
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
      key: "getUICanvas",
      value: function getUICanvas() {
        if (!this._uiTrans || !this._uiTrans._canvas) {
          return null;
        }

        return this._uiTrans._canvas;
      }
    }, {
      key: "syncMatrix",
      value: function syncMatrix() {
        if (!this._video || this._video.style.visibility === 'hidden' || !this._videoComponent) return;
        var canvas = this.getUICanvas();

        if (!canvas) {
          return;
        }

        var camera = canvas.camera;

        if (!camera) {
          return;
        }

        if (screen.fullScreen()) {
          return;
        } // use stayOnBottom


        if (this._dirty) {
          this._dirty = false;

          if (this._stayOnBottom) {
            this._clearColorA = canvas.color.a;
            this._clearFlag = canvas.clearFlag;
            canvas.color.a = 0;
            canvas.clearFlag = GFXClearFlag.ALL;
          } else {
            if (this._clearFlag) {
              canvas.color.a = this._clearColorA;
              canvas.clearFlag = this._clearFlag;
              this._clearColorA = -1;
              this._clearFlag = null;
            }
          }
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

        if (!this._keepAspectRatio) {
          this.syncSize(this._w, this._h);
        }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3ZpZGVvL3ZpZGVvLXBsYXllci1pbXBsLXdlYi50cyJdLCJuYW1lcyI6WyJnYW1lIiwibGVnYWN5Q0MiLCJHYW1lIiwidmlldyIsInNjcmVlbiIsInZpc2libGVSZWN0IiwiR0ZYQ2xlYXJGbGFnIiwiTUlOX1pJTkRFWCIsIk1hdGgiLCJwb3ciLCJfbWF0NF90ZW1wIiwiVmlkZW9QbGF5ZXJJbXBsIiwiY29tcG9uZW50IiwiX2V2ZW50TGlzdCIsIk1hcCIsIl9zdGF0ZSIsIkV2ZW50VHlwZSIsIk5PTkUiLCJfdmlkZW8iLCJfb25IaWRlIiwiX29uU2hvdyIsIl9pbnRlcnJ1cHRlZCIsIl9sb2FkZWQiLCJfbG9hZGVkTWV0YSIsIl9pZ25vcmVQYXVzZSIsIl93YWl0aW5nRnVsbHNjcmVlbiIsIl9mdWxsU2NyZWVuT25Bd2FrZSIsIl9wbGF5aW5nIiwiX2NhY2hlZEN1cnJlbnRUaW1lIiwiX2tlZXBBc3BlY3RSYXRpbyIsIl92aWRlb0NvbXBvbmVudCIsIl91aVRyYW5zIiwiX3N0YXlPbkJvdHRvbSIsIl9kaXJ0eSIsIl9mb3JjZVVwZGF0ZSIsIl93IiwiX2giLCJfbTAwIiwiX20wMSIsIl9tMDQiLCJfbTA1IiwiX20xMiIsIl9tMTMiLCJfY2xlYXJDb2xvckEiLCJfY2xlYXJGbGFnIiwiX2xvYWRlZE1ldGFkYXRhQ2IiLCJfY2FucGxheUNiIiwiX3BsYXlDYiIsIl9wYXVzZUNiIiwiX3BsYXlpbmdDYiIsIl9lbmRlZENiIiwiX2Vycm9yQ2IiLCJfY2xpY2tDYiIsIm5vZGUiLCJnZXRDb21wb25lbnQiLCJVSVRyYW5zZm9ybSIsInZpZGVvIiwiUExBWUlORyIsInBhdXNlIiwicGxheSIsIm9uIiwiRVZFTlRfSElERSIsIkVWRU5UX1NIT1ciLCJlIiwiZW5hYmxlIiwic3luY1RyYW5zIiwidGFyZ2V0IiwidmlkZW9XaWR0aCIsInZpZGVvSGVpZ2h0IiwiX3RvZ2dsZUZ1bGxzY3JlZW4iLCJfZGlzcGF0Y2hFdmVudCIsIk1FVEFfTE9BREVEIiwicmVhZHlTdGF0ZSIsIlJFQURZX1NUQVRFIiwiSEFWRV9NRVRBREFUQSIsIkhBVkVfRU5PVUdIX0RBVEEiLCJSRUFEWV9UT19QTEFZIiwiUEFVU0VEIiwiQ09NUExFVEVEIiwiQ0xJQ0tFRCIsIkVSUk9SIiwiZXJyb3JPYmoiLCJlcnJvciIsImNvZGUiLCJtZXNzYWdlIiwiZW5hYmxlZCIsInN5cyIsIm9zIiwiT1NfSU9TIiwiaXNCcm93c2VyIiwid2Via2l0RW50ZXJGdWxsc2NyZWVuIiwid2Via2l0RXhpdEZ1bGxzY3JlZW4iLCJ3ZWJraXREaXNwbGF5aW5nRnVsbHNjcmVlbiIsInN1cHBvcnRzRnVsbFNjcmVlbiIsInN5bmNNYXRyaXgiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9JRSIsInN0eWxlIiwidHJhbnNmb3JtIiwic2V0QXR0cmlidXRlIiwicmVxdWVzdEZ1bGxTY3JlZW4iLCJkb2N1bWVudCIsImZ1bGxzY3JlZW5FbGVtZW50IiwibXNGdWxsc2NyZWVuRWxlbWVudCIsInJlbW92ZUF0dHJpYnV0ZSIsImV4aXRGdWxsU2NyZWVuIiwia2V5IiwiY2FsbGJhY2siLCJnZXQiLCJjYWxsIiwid2lkdGgiLCJoZWlnaHQiLCJwcm9taXNlIiwid2luZG93IiwiUHJvbWlzZSIsInRoZW4iLCJjdXJyZW50VGltZSIsInNldFRpbWVvdXQiLCJTVE9QUEVEIiwiY2xpcCIsInJlbW92ZURvbSIsImFwcGVuZERvbSIsIl9uYXRpdmVBc3NldCIsInVybCIsImNyZWF0ZUVsZW1lbnQiLCJjb250YWluZXIiLCJyZW1vdmVDaGlsZCIsIl9yZW1vdmVFdmVudCIsImNsYXNzTmFtZSIsInZpc2liaWxpdHkiLCJwb3NpdGlvbiIsImJvdHRvbSIsImxlZnQiLCJfYmluZEV2ZW50IiwiYXBwZW5kQ2hpbGQiLCJzb3VyY2UiLCJzcmMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsZWFyIiwib2ZmIiwidyIsImgiLCJfY2FudmFzIiwiY2FudmFzIiwiZ2V0VUlDYW52YXMiLCJjYW1lcmEiLCJmdWxsU2NyZWVuIiwiY29sb3IiLCJhIiwiY2xlYXJGbGFnIiwiQUxMIiwiZ2V0V29ybGRNYXRyaXgiLCJ1cGRhdGUiLCJ3b3JsZE1hdHJpeFRvU2NyZWVuIiwiY29udGVudFNpemUiLCJtMDAiLCJtMDEiLCJtMDQiLCJtMDUiLCJtMTIiLCJtMTMiLCJkcHIiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsInNjYWxlWCIsInNjYWxlWSIsInN4IiwiYiIsImMiLCJzeSIsInN5bmNTaXplIiwiYW5jaG9yUG9pbnQiLCJ4IiwieSIsImFwcHgiLCJhcHB5Iiwib2Zmc2V0WCIsInBhZGRpbmdMZWZ0IiwicGFyc2VJbnQiLCJvZmZzZXRZIiwicGFkZGluZ0JvdHRvbSIsInR4IiwidHkiLCJtYXRyaXgiLCJpbnRlcm5hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQ1FBLEksR0FBd0RDLHVCLENBQXhERCxJO01BQU1FLEksR0FBa0RELHVCLENBQWxEQyxJO01BQU1DLEksR0FBNENGLHVCLENBQTVDRSxJO01BQU1DLE0sR0FBc0NILHVCLENBQXRDRyxNO01BQVFDLFcsR0FBOEJKLHVCLENBQTlCSSxXO01BQWFDLFksR0FBaUJMLHVCLENBQWpCSyxZO0FBRS9DLE1BQU1DLFVBQVUsR0FBRyxDQUFDQyxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVksRUFBWixDQUFwQjs7QUFFQSxNQUFJQyxVQUFVLEdBQUcsa0JBQWpCO0FBRUE7Ozs7O01BSWFDLGU7QUFnRFQsNkJBQWFDLFNBQWIsRUFBd0I7QUFBQTs7QUFBQTs7QUFBQSxXQTlDZEMsVUE4Q2MsR0E5Q3NCLElBQUlDLEdBQUosRUE4Q3RCO0FBQUEsV0E3Q2RDLE1BNkNjLEdBN0NMQyw0QkFBVUMsSUE2Q0w7QUFBQSxXQTVDZEMsTUE0Q2M7QUFBQSxXQTFDZEMsT0EwQ2M7QUFBQSxXQXpDZEMsT0F5Q2M7QUFBQSxXQXhDZEMsWUF3Q2MsR0F4Q0MsS0F3Q0Q7QUFBQSxXQXRD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Ozs7MEJBRWdCO0FBQ2IsZUFBTyxLQUFLVCxVQUFaO0FBQ0g7OzswQkFFWTtBQUNULGVBQU8sS0FBS0ssTUFBWjtBQUNIOzs7MEJBRVk7QUFDVCxlQUFPLEtBQUtILE1BQVo7QUFDSDs7Ozs7OztBQXlTTGQsMEJBQVN1TCxRQUFULENBQWtCN0ssZUFBbEIsR0FBb0NBLGVBQXBDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDIwIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbmltcG9ydCB7bGVnYWN5Q0N9IGZyb20gJy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQge21hdDR9IGZyb20gXCIuLi9jb3JlL21hdGhcIjtcclxuaW1wb3J0IHtlcnJvciwgc3lzfSBmcm9tIFwiLi4vY29yZS9wbGF0Zm9ybVwiO1xyXG5pbXBvcnQge1VJVHJhbnNmb3JtfSBmcm9tIFwiLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2VcIjtcclxuaW1wb3J0IHtWaWRlb1BsYXllcn0gZnJvbSBcIi4vdmlkZW8tcGxheWVyXCI7XHJcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uL2NvcmUvdXRpbHMvbWlzYyc7XHJcbmltcG9ydCB7RXZlbnRUeXBlLCBSRUFEWV9TVEFURX0gZnJvbSAnLi92aWRlby1wbGF5ZXItZW51bXMnO1xyXG5cclxuY29uc3QgeyBnYW1lLCBHYW1lLCB2aWV3LCBzY3JlZW4sIHZpc2libGVSZWN0LCBHRlhDbGVhckZsYWcgfSA9IGxlZ2FjeUNDO1xyXG5cclxuY29uc3QgTUlOX1pJTkRFWCA9IC1NYXRoLnBvdygyLCAxNSk7XHJcblxyXG5sZXQgX21hdDRfdGVtcCA9IG1hdDQoKTtcclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29tcG9uZW50L3ZpZGVvXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVySW1wbCB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9ldmVudExpc3Q6IE1hcDxudW1iZXIsIEZ1bmN0aW9uPiA9IG5ldyBNYXA8bnVtYmVyLCBGdW5jdGlvbj4oKTtcclxuICAgIHByb3RlY3RlZCBfc3RhdGUgPSBFdmVudFR5cGUuTk9ORTtcclxuICAgIHByb3RlY3RlZCBfdmlkZW86IGFueTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uSGlkZTogRnVuY3Rpb247XHJcbiAgICBwcm90ZWN0ZWQgX29uU2hvdzogRnVuY3Rpb247XHJcbiAgICBwcm90ZWN0ZWQgX2ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9sb2FkZWQgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfbG9hZGVkTWV0YSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9pZ25vcmVQYXVzZSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF93YWl0aW5nRnVsbHNjcmVlbiA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9mdWxsU2NyZWVuT25Bd2FrZSA9IGZhbHNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcGxheWluZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9jYWNoZWRDdXJyZW50VGltZSA9IC0xO1xyXG5cclxuICAgIHByb3RlY3RlZCBfa2VlcEFzcGVjdFJhdGlvID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF92aWRlb0NvbXBvbmVudDogVmlkZW9QbGF5ZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfdWlUcmFuczogVUlUcmFuc2Zvcm0gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3N0YXlPbkJvdHRvbSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9kaXJ0eSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9mb3JjZVVwZGF0ZSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF93ID0gMDtcclxuICAgIHByb3RlY3RlZCBfaCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wMCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wMSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wNCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20wNSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20xMiA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX20xMyA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jbGVhckNvbG9yQSA9IC0xO1xyXG4gICAgcHJvdGVjdGVkIF9jbGVhckZsYWc7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9sb2FkZWRNZXRhZGF0YUNiOiAoZSkgPT4gdm9pZDtcclxuICAgIHByb3RlY3RlZCBfY2FucGxheUNiOiAoZSkgPT4gdm9pZDtcclxuICAgIHByb3RlY3RlZCBfcGxheUNiOiAoZSkgPT4gdm9pZDtcclxuICAgIHByb3RlY3RlZCBfcGF1c2VDYjogKGUpID0+IHZvaWQ7XHJcbiAgICBwcm90ZWN0ZWQgX3BsYXlpbmdDYjogKGUpID0+IHZvaWQ7XHJcbiAgICBwcm90ZWN0ZWQgX2VuZGVkQ2I6IChlKSA9PiB2b2lkO1xyXG4gICAgcHJvdGVjdGVkIF9lcnJvckNiOiAoZSkgPT4gdm9pZDtcclxuICAgIHByb3RlY3RlZCBfY2xpY2tDYjogKGUpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGNvbXBvbmVudCkge1xyXG4gICAgICAgIHRoaXMuX3ZpZGVvQ29tcG9uZW50ID0gY29tcG9uZW50O1xyXG4gICAgICAgIHRoaXMuX3VpVHJhbnMgPSBjb21wb25lbnQubm9kZS5nZXRDb21wb25lbnQoVUlUcmFuc2Zvcm0pO1xyXG4gICAgICAgIHRoaXMuX29uSGlkZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpZGVvIHx8IHRoaXMuX3N0YXRlICE9PSBFdmVudFR5cGUuUExBWUlORykgeyByZXR1cm47IH1cclxuICAgICAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9vblNob3cgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faW50ZXJydXB0ZWQgfHwgIXRoaXMudmlkZW8pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyogaGFuZGxlIGhpZGUgJiBzaG93ICovXHJcbiAgICAgICAgZ2FtZS5vbihHYW1lLkVWRU5UX0hJREUsIHRoaXMuX29uSGlkZSk7XHJcbiAgICAgICAgZ2FtZS5vbihHYW1lLkVWRU5UX1NIT1csIHRoaXMuX29uU2hvdyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvYWRlZE1ldGFkYXRhQ2IgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9mb3JjZVVwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvYWRlZE1ldGEgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fa2VlcEFzcGVjdFJhdGlvKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN5bmNUcmFucyhlLnRhcmdldC52aWRlb1dpZHRoLCBlLnRhcmdldC52aWRlb0hlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3dhaXRpbmdGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YWl0aW5nRnVsbHNjcmVlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdG9nZ2xlRnVsbHNjcmVlbih0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5NRVRBX0xPQURFRCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FucGxheUNiID0gKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZS50YXJnZXQucmVhZHlTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBSRUFEWV9TVEFURS5IQVZFX01FVEFEQVRBOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBSRUFEWV9TVEFURS5IQVZFX0VOT1VHSF9EQVRBOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5SRUFEWV9UT19QTEFZKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3BsYXlDYiA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLlBMQVlJTkcpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3BhdXNlQ2IgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pZ25vcmVQYXVzZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faWdub3JlUGF1c2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLlBBVVNFRCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9wbGF5aW5nQ2IgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuUExBWUlORyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fZW5kZWRDYiA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLkNPTVBMRVRFRCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2xpY2tDYiA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLkNMSUNLRUQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2Vycm9yQ2IgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5FUlJPUik7XHJcbiAgICAgICAgICAgIGxldCBlcnJvck9iaiA9IGUudGFyZ2V0LmVycm9yO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JPYmopIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKFwiRXJyb3IgXCIgKyBlcnJvck9iai5jb2RlICsgXCI7IGRldGFpbHM6IFwiICsgZXJyb3JPYmoubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIF90b2dnbGVGdWxsc2NyZWVuIChlbmFibGVkKSB7XHJcbiAgICAgICAgbGV0IHZpZGVvID0gdGhpcy5fdmlkZW87XHJcbiAgICAgICAgaWYgKCF2aWRlbyB8fCB2aWRlby5yZWFkeVN0YXRlICE9PSBSRUFEWV9TVEFURS5IQVZFX0VOT1VHSF9EQVRBKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzeXMub3MgPT09IHN5cy5PU19JT1MgJiYgc3lzLmlzQnJvd3Nlcikge1xyXG4gICAgICAgICAgICBpZiAoZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgdmlkZW8ud2Via2l0RW50ZXJGdWxsc2NyZWVuICYmIHZpZGVvLndlYmtpdEVudGVyRnVsbHNjcmVlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmlkZW8ud2Via2l0RXhpdEZ1bGxzY3JlZW4gJiYgdmlkZW8ud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9mdWxsU2NyZWVuT25Bd2FrZSA9IHZpZGVvLndlYmtpdERpc3BsYXlpbmdGdWxsc2NyZWVuO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB2aWRlbyBkb2VzIG5vdCBzdXBwb3J0IG5hdGl2ZSBmdWxsLXNjcmVlbiBwbGF5YmFjayxcclxuICAgICAgICAvLyBjaGFuZ2UgdG8gc2V0dGluZyB0aGUgdmlkZW8gc2l6ZSB0byBmdWxsIHNjcmVlbi5cclxuICAgICAgICBpZiAoIXNjcmVlbi5zdXBwb3J0c0Z1bGxTY3JlZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fZnVsbFNjcmVlbk9uQXdha2UgPSBlbmFibGVkO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3JjZVVwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3luY01hdHJpeCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAvLyBmaXggSUUgZnVsbCBzY3JlZW4gY29udGVudCBpcyBub3QgY2VudGVyZWRcclxuICAgICAgICAgICAgaWYgKHN5cy5icm93c2VyVHlwZSA9PT0gc3lzLkJST1dTRVJfVFlQRV9JRSkge1xyXG4gICAgICAgICAgICAgICAgdmlkZW8uc3R5bGUudHJhbnNmb3JtID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gTW9uaXRvciB2aWRlbyBlbnRyeSBhbmQgZXhpdCBmdWxsLXNjcmVlbiBldmVudHNcclxuICAgICAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwieDUtdmlkZW8tcGxheWVyLWZ1bGxzY3JlZW5cIiwgJ3RydWUnKTtcclxuICAgICAgICAgICAgc2NyZWVuLnJlcXVlc3RGdWxsU2NyZWVuKHZpZGVvLCAoZG9jdW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBmdWxsc2NyZWVuRWxlbWVudCA9IHN5cy5icm93c2VyVHlwZSA9PT0gc3lzLkJST1dTRVJfVFlQRV9JRSA/IGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQgOiBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxTY3JlZW5PbkF3YWtlID0gKGZ1bGxzY3JlZW5FbGVtZW50ID09PSB2aWRlbyk7XHJcbiAgICAgICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxTY3JlZW5PbkF3YWtlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZpZGVvLnJlbW92ZUF0dHJpYnV0ZShcIng1LXZpZGVvLXBsYXllci1mdWxsc2NyZWVuXCIpO1xyXG4gICAgICAgICAgICBzY3JlZW4uZXhpdEZ1bGxTY3JlZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZ1bGxTY3JlZW5PbkF3YWtlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZnVsbFNjcmVlbk9uQXdha2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYWRlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRlZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZXZlbnRMaXN0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRMaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2aWRlbyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZpZGVvO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzdGF0ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGlzcGF0Y2hFdmVudCAoa2V5KSB7XHJcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gdGhpcy5fZXZlbnRMaXN0LmdldChrZXkpO1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IGtleTtcclxuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN5bmNUcmFucyAod2lkdGgsIGhlaWdodCkge1xyXG4gICAgICAgIGlmICh0aGlzLl91aVRyYW5zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpVHJhbnMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5fdWlUcmFucy5oZWlnaHQgPSBoZWlnaHRcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBsYXkgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZpZGVvKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlID0gdGhpcy52aWRlby5wbGF5KCk7XHJcbiAgICAgICAgICAgIC8vIHRoZSBwbGF5IEFQSSBjYW4gb25seSBiZSBpbml0aWF0ZWQgYnkgdXNlciBnZXN0dXJlLlxyXG4gICAgICAgICAgICBpZiAod2luZG93LlByb21pc2UgJiYgcHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEF1dG8tcGxheSB3YXMgcHJldmVudGVkXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2hvdyBhIFVJIGVsZW1lbnQgdG8gbGV0IHRoZSB1c2VyIG1hbnVhbGx5IHN0YXJ0IHBsYXliYWNrXHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjYWxpYnJhdGlvbiB0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlZEN1cnJlbnRUaW1lICE9PSAtMSAmJiB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lICE9PSB0aGlzLl9jYWNoZWRDdXJyZW50VGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lID0gdGhpcy5fY2FjaGVkQ3VycmVudFRpbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlZEN1cnJlbnRUaW1lID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBhdXNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy52aWRlbykge1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlZEN1cnJlbnRUaW1lID0gdGhpcy52aWRlby5jdXJyZW50VGltZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0b3AgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZpZGVvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZVBhdXNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pZ25vcmVQYXVzZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuU1RPUFBFRCk7XHJcbiAgICAgICAgICAgIH0sIDApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jQ2xpcCAoY2xpcCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRG9tKCk7XHJcbiAgICAgICAgaWYgKCFjbGlwKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuYXBwZW5kRG9tKGNsaXAuX25hdGl2ZUFzc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3luY1VSTCAodXJsKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVEb20oKTtcclxuICAgICAgICBpZiAoIXVybCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLmFwcGVuZERvbShkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpLCB1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzeW5jRnVsbFNjcmVlbk9uQXdha2UgKGVuYWJsZWQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2xvYWRlZE1ldGEgJiYgZW5hYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl93YWl0aW5nRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl90b2dnbGVGdWxsc2NyZWVuKGVuYWJsZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3luY1N0YXlPbkJvdHRvbSAoZW5hYmxlZCkge1xyXG4gICAgICAgIGlmICh0aGlzLl92aWRlbykge1xyXG4gICAgICAgICAgICB0aGlzLl92aWRlby5zdHlsZVsnei1pbmRleCddID0gZW5hYmxlZCA/IE1JTl9aSU5ERVggOiAwO1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF5T25Cb3R0b20gPSBlbmFibGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN5bmNLZWVwQXNwZWN0UmF0aW8gKGVuYWJsZWQpIHtcclxuICAgICAgICB0aGlzLl9rZWVwQXNwZWN0UmF0aW8gPSBlbmFibGVkO1xyXG4gICAgICAgIGlmIChlbmFibGVkICYmIHRoaXMuX2xvYWRlZE1ldGEpIHtcclxuICAgICAgICAgICAgdGhpcy5zeW5jVHJhbnModGhpcy5fdmlkZW8udmlkZW9XaWR0aCwgdGhpcy5fdmlkZW8udmlkZW9IZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlRG9tICgpIHtcclxuICAgICAgICBsZXQgdmlkZW8gPSB0aGlzLl92aWRlbztcclxuICAgICAgICBpZiAoY29udGFpbnMoZ2FtZS5jb250YWluZXIsIHZpZGVvKSkge1xyXG4gICAgICAgICAgICBnYW1lLmNvbnRhaW5lci5yZW1vdmVDaGlsZCh2aWRlbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhY2hlZEN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fbG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fdmlkZW8gPSBudWxsO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwZW5kRG9tICh2aWRlbywgdXJsPykge1xyXG4gICAgICAgIHRoaXMuX3ZpZGVvID0gdmlkZW87XHJcbiAgICAgICAgdmlkZW8uY2xhc3NOYW1lID0gXCJjb2Nvc1ZpZGVvXCI7XHJcbiAgICAgICAgdmlkZW8uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICAgIHZpZGVvLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHZpZGVvLnN0eWxlLmJvdHRvbSA9IFwiMHB4XCI7XHJcbiAgICAgICAgdmlkZW8uc3R5bGUubGVmdCA9IFwiMHB4XCI7XHJcbiAgICAgICAgLy8gdmlkZW8uc3R5bGVbJ29iamVjdC1maXQnXSA9ICdub25lJztcclxuICAgICAgICB2aWRlby5zdHlsZVsndHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XHJcbiAgICAgICAgdmlkZW8uc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbiddID0gJzBweCAxMDAlIDBweCc7XHJcbiAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKCdwcmVsb2FkJywgJ2F1dG8nKTtcclxuICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoJ3dlYmtpdC1wbGF5c2lubGluZScsICcnKTtcclxuICAgICAgICAvLyBUaGlzIHg1LXBsYXlzaW5saW5lIHRhZyBtdXN0IGJlIGFkZGVkLCBvdGhlcndpc2UgdGhlIHBsYXksIHBhdXNlIGV2ZW50cyB3aWxsIG9ubHkgZmlyZSBvbmNlLCBpbiB0aGUgcXEgYnJvd3Nlci5cclxuICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJ4NS1wbGF5c2lubGluZVwiLCAnJyk7XHJcbiAgICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKCdwbGF5c2lubGluZScsICcnKTtcclxuICAgICAgICB0aGlzLl9iaW5kRXZlbnQoKTtcclxuICAgICAgICBnYW1lLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XHJcbiAgICAgICAgaWYgKHVybCkge1xyXG4gICAgICAgICAgICAvLyBwbGF5IHJlbW90ZSBjbGlwXHJcbiAgICAgICAgICAgIGxldCBzb3VyY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic291cmNlXCIpO1xyXG4gICAgICAgICAgICBzb3VyY2Uuc3JjID0gdXJsO1xyXG4gICAgICAgICAgICB2aWRlby5hcHBlbmRDaGlsZChzb3VyY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcGxheSBsb2NhbCBjbGlwXHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9rZWVwQXNwZWN0UmF0aW8pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3luY1RyYW5zKHZpZGVvLnZpZGVvV2lkdGgsIHZpZGVvLnZpZGVvSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3JlbW92ZUV2ZW50ICgpIHtcclxuICAgICAgICBsZXQgdmlkZW8gPSB0aGlzLl92aWRlbztcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsIHRoaXMuX2xvYWRlZE1ldGFkYXRhQ2IpO1xyXG4gICAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCB0aGlzLl9jYW5wbGF5Q2IpO1xyXG4gICAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgdGhpcy5fY2FucGxheUNiKTtcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdwbGF5JywgdGhpcy5fcGxheUNiKTtcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdwYXVzZScsIHRoaXMuX3BhdXNlQ2IpO1xyXG4gICAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCB0aGlzLl9wbGF5aW5nQ2IpO1xyXG4gICAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY2xpY2tDYik7XHJcbiAgICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignZW5kZWQnLCB0aGlzLl9lbmRlZENiKTtcclxuICAgICAgICB2aWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIHRoaXMuX2Vycm9yQ2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfYmluZEV2ZW50ICgpIHtcclxuICAgICAgICBsZXQgdmlkZW8gPSB0aGlzLl92aWRlbztcclxuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsIHRoaXMuX2xvYWRlZE1ldGFkYXRhQ2IpO1xyXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCB0aGlzLl9jYW5wbGF5Q2IpO1xyXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgdGhpcy5fY2FucGxheUNiKTtcclxuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgdGhpcy5fcGxheUNiKTtcclxuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdwYXVzZScsIHRoaXMuX3BhdXNlQ2IpO1xyXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCB0aGlzLl9wbGF5aW5nQ2IpO1xyXG4gICAgICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY2xpY2tDYik7XHJcbiAgICAgICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCB0aGlzLl9lbmRlZENiKTtcclxuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHRoaXMuX2Vycm9yQ2IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbmFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl92aWRlbykge1xyXG4gICAgICAgICAgICB0aGlzLl92aWRlby5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZpZGVvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZGVvLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ucGF1c2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRG9tKCk7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMaXN0LmNsZWFyKCk7XHJcbiAgICAgICAgZ2FtZS5vZmYoR2FtZS5FVkVOVF9ISURFLCB0aGlzLl9vbkhpZGUpO1xyXG4gICAgICAgIGdhbWUub2ZmKEdhbWUuRVZFTlRfU0hPVywgdGhpcy5fb25TaG93KTtcclxuICAgIH1cclxuXHJcbiAgICBzeW5jU2l6ZSAodywgaCkge1xyXG4gICAgICAgIGxldCB2aWRlbyA9IHRoaXMuX3ZpZGVvO1xyXG4gICAgICAgIGlmICghdmlkZW8pIHJldHVybjtcclxuXHJcbiAgICAgICAgdmlkZW8uc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcclxuICAgICAgICB2aWRlby5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICBnZXRVSUNhbnZhcyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl91aVRyYW5zIHx8ICF0aGlzLl91aVRyYW5zLl9jYW52YXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl91aVRyYW5zLl9jYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN5bmNNYXRyaXggKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fdmlkZW8gfHwgdGhpcy5fdmlkZW8uc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicgfHwgIXRoaXMuX3ZpZGVvQ29tcG9uZW50KSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuZ2V0VUlDYW52YXMoKTtcclxuICAgICAgICBpZiAoIWNhbnZhcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IGNhbnZhcy5jYW1lcmE7XHJcbiAgICAgICAgaWYgKCFjYW1lcmEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNjcmVlbi5mdWxsU2NyZWVuKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXNlIHN0YXlPbkJvdHRvbVxyXG4gICAgICAgIGlmICh0aGlzLl9kaXJ0eSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RheU9uQm90dG9tKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGVhckNvbG9yQSA9IGNhbnZhcy5jb2xvci5hO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xlYXJGbGFnID0gY2FudmFzLmNsZWFyRmxhZztcclxuICAgICAgICAgICAgICAgIGNhbnZhcy5jb2xvci5hID0gMDtcclxuICAgICAgICAgICAgICAgIGNhbnZhcy5jbGVhckZsYWcgPSBHRlhDbGVhckZsYWcuQUxMO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NsZWFyRmxhZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5jb2xvci5hID0gdGhpcy5fY2xlYXJDb2xvckE7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmNsZWFyRmxhZyA9IHRoaXMuX2NsZWFyRmxhZztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbGVhckNvbG9yQSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyRmxhZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZGVvQ29tcG9uZW50Lm5vZGUuZ2V0V29ybGRNYXRyaXgoX21hdDRfdGVtcCk7XHJcbiAgICAgICAgY2FtZXJhLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICBjYW1lcmEud29ybGRNYXRyaXhUb1NjcmVlbihfbWF0NF90ZW1wLCBfbWF0NF90ZW1wLCBnYW1lLmNhbnZhcy53aWR0aCwgZ2FtZS5jYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgbGV0IHdpZHRoID0gMCwgaGVpZ2h0ID0gMDtcclxuICAgICAgICBpZiAodGhpcy5fZnVsbFNjcmVlbk9uQXdha2UpIHtcclxuICAgICAgICAgICAgd2lkdGggPSB2aXNpYmxlUmVjdC53aWR0aDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdmlzaWJsZVJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2lkdGggPSB0aGlzLl91aVRyYW5zIS5jb250ZW50U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5fdWlUcmFucyEuY29udGVudFNpemUuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9mb3JjZVVwZGF0ZSAmJlxyXG4gICAgICAgICAgICB0aGlzLl9tMDAgPT09IF9tYXQ0X3RlbXAubTAwICYmIHRoaXMuX20wMSA9PT0gX21hdDRfdGVtcC5tMDEgJiZcclxuICAgICAgICAgICAgdGhpcy5fbTA0ID09PSBfbWF0NF90ZW1wLm0wNCAmJiB0aGlzLl9tMDUgPT09IF9tYXQ0X3RlbXAubTA1ICYmXHJcbiAgICAgICAgICAgIHRoaXMuX20xMiA9PT0gX21hdDRfdGVtcC5tMTIgJiYgdGhpcy5fbTEzID09PSBfbWF0NF90ZW1wLm0xMyAmJlxyXG4gICAgICAgICAgICB0aGlzLl93ID09PSB3aWR0aCAmJiB0aGlzLl9oID09PSBoZWlnaHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIG1hdHJpeCBjYWNoZVxyXG4gICAgICAgIHRoaXMuX20wMCA9IF9tYXQ0X3RlbXAubTAwO1xyXG4gICAgICAgIHRoaXMuX20wMSA9IF9tYXQ0X3RlbXAubTAxO1xyXG4gICAgICAgIHRoaXMuX20wNCA9IF9tYXQ0X3RlbXAubTA0O1xyXG4gICAgICAgIHRoaXMuX20wNSA9IF9tYXQ0X3RlbXAubTA1O1xyXG4gICAgICAgIHRoaXMuX20xMiA9IF9tYXQ0X3RlbXAubTEyO1xyXG4gICAgICAgIHRoaXMuX20xMyA9IF9tYXQ0X3RlbXAubTEzO1xyXG4gICAgICAgIHRoaXMuX3cgPSB3aWR0aDtcclxuICAgICAgICB0aGlzLl9oID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgZHByID0gdmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICBsZXQgc2NhbGVYID0gMSAvIGRwcjtcclxuICAgICAgICBsZXQgc2NhbGVZID0gMSAvIGRwcjtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRhaW5lciA9IGdhbWUuY29udGFpbmVyO1xyXG4gICAgICAgIGxldCBzeCA9IF9tYXQ0X3RlbXAubTAwICogc2NhbGVYLCBiID0gX21hdDRfdGVtcC5tMDEsIGMgPSBfbWF0NF90ZW1wLm0wNCwgc3kgPSBfbWF0NF90ZW1wLm0wNSAqIHNjYWxlWTtcclxuXHJcbiAgICAgICAgbGV0IHcsIGg7XHJcbiAgICAgICAgdyA9IHRoaXMuX3cgKiBzY2FsZVg7XHJcbiAgICAgICAgaCA9IHRoaXMuX2ggKiBzY2FsZVk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9rZWVwQXNwZWN0UmF0aW8pIHtcclxuICAgICAgICAgICAgdGhpcy5zeW5jU2l6ZSh0aGlzLl93LCB0aGlzLl9oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5fdWlUcmFucyEuYW5jaG9yUG9pbnQ7XHJcbiAgICAgICAgbGV0IGFwcHggPSAodyAqIF9tYXQ0X3RlbXAubTAwKSAqIHg7XHJcbiAgICAgICAgbGV0IGFwcHkgPSAoaCAqIF9tYXQ0X3RlbXAubTA1KSAqIHk7XHJcblxyXG4gICAgICAgIGxldCBvZmZzZXRYID0gY29udGFpbmVyICYmIGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nTGVmdCA/IHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nTGVmdCkgOiAwO1xyXG4gICAgICAgIGxldCBvZmZzZXRZID0gY29udGFpbmVyICYmIGNvbnRhaW5lci5zdHlsZS5wYWRkaW5nQm90dG9tID8gcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlLnBhZGRpbmdCb3R0b20pIDogMDtcclxuICAgICAgICBsZXQgdHggPSBfbWF0NF90ZW1wLm0xMiAqIHNjYWxlWCAtIGFwcHggKyBvZmZzZXRYLCB0eSA9IF9tYXQ0X3RlbXAubTEzICogc2NhbGVZIC0gYXBweSArIG9mZnNldFk7XHJcblxyXG4gICAgICAgIGxldCBtYXRyaXggPSBcIm1hdHJpeChcIiArIHN4ICsgXCIsXCIgKyAtYiArIFwiLFwiICsgLWMgKyBcIixcIiArIHN5ICsgXCIsXCIgKyB0eCArIFwiLFwiICsgLXR5ICsgXCIpXCI7XHJcbiAgICAgICAgdGhpcy5fdmlkZW8uc3R5bGVbJ3RyYW5zZm9ybSddID0gbWF0cml4O1xyXG4gICAgICAgIHRoaXMuX3ZpZGVvLnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gbWF0cml4O1xyXG4gICAgICAgIC8vIHZpZGVvIHN0eWxlIHdvdWxkIGNoYW5nZSB3aGVuIGVudGVyIGZ1bGxzY3JlZW4gb24gSUVcclxuICAgICAgICAvLyB0aGVyZSBpcyBubyB3YXkgdG8gYWRkIGZ1bGxzY3JlZW5jaGFuZ2UgZXZlbnQgbGlzdGVuZXJzIG9uIElFIHNvIHRoYXQgd2UgY2FuIHJlc3RvcmUgdGhlIGNhY2hlZCB2aWRlbyBzdHlsZVxyXG4gICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgIT09IHN5cy5CUk9XU0VSX1RZUEVfSUUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLmludGVybmFsLlZpZGVvUGxheWVySW1wbCA9IFZpZGVvUGxheWVySW1wbDtcclxuIl19