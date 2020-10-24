(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/math/utils.js", "./player.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/math/utils.js"), require("./player.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.player, global.globalExports);
    global.playerDom = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _player, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AudioPlayerDOM = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var AudioPlayerDOM = /*#__PURE__*/function (_AudioPlayer) {
    _inherits(AudioPlayerDOM, _AudioPlayer);

    function AudioPlayerDOM(info) {
      var _this;

      _classCallCheck(this, AudioPlayerDOM);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AudioPlayerDOM).call(this, info));
      _this._volume = 1;
      _this._loop = false;
      _this._oneShotOngoing = false;
      _this._audio = void 0;
      _this._cbRegistered = false;
      _this._remove_cb = void 0;
      _this._post_play = void 0;
      _this._on_gesture = void 0;
      _this._post_gesture = void 0;
      _this._audio = info.clip;

      _this._remove_cb = function () {
        if (!_this._cbRegistered) {
          return;
        }

        _globalExports.legacyCC.game.canvas.removeEventListener('touchend', _this._on_gesture);

        _globalExports.legacyCC.game.canvas.removeEventListener('mouseup', _this._on_gesture);

        _this._cbRegistered = false;
      };

      _this._post_play = function () {
        _this._state = _player.PlayingState.PLAYING;

        _this._eventTarget.emit('started');

        _this._remove_cb(); // should remove callbacks after any success play

      };

      _this._post_gesture = function () {
        if (_this._interrupted) {
          _this._post_play();

          _this._interrupted = false;
        } else {
          _this._audio.pause();

          _this._audio.currentTime = 0;
        }
      };

      _this._on_gesture = function () {
        if (!_this._audio) {
          return;
        }

        var promise = _this._audio.play();

        if (!promise) {
          // Chrome50/Firefox53 below
          // delay eval here to yield uniform behavior with other platforms
          _this._state = _player.PlayingState.PLAYING;

          _globalExports.legacyCC.director.once(_globalExports.legacyCC.Director.EVENT_AFTER_UPDATE, _this._post_gesture);

          return;
        }

        promise.then(_this._post_gesture);

        _this._remove_cb();
      };

      _this._audio.volume = _this._volume;
      _this._audio.loop = _this._loop; // callback on audio ended

      _this._audio.addEventListener('ended', function () {
        if (_this._oneShotOngoing) {
          return;
        }

        _this._state = _player.PlayingState.STOPPED;
        _this._audio.currentTime = 0;

        _this._eventTarget.emit('ended');
      });
      /* play & stop immediately after receiving a gesture so that
         we can freely invoke play() outside event listeners later */


      _globalExports.legacyCC.game.canvas.addEventListener('touchend', _this._on_gesture);

      _globalExports.legacyCC.game.canvas.addEventListener('mouseup', _this._on_gesture);

      _this._cbRegistered = true;
      return _this;
    }

    _createClass(AudioPlayerDOM, [{
      key: "play",
      value: function play() {
        var _this2 = this;

        if (!this._audio || this._state === _player.PlayingState.PLAYING) {
          return;
        }

        if (this._blocking) {
          this._interrupted = true;
          return;
        }

        var promise = this._audio.play();

        if (!promise) {
          // delay eval here to yield uniform behavior with other platforms
          this._state = _player.PlayingState.PLAYING;

          _globalExports.legacyCC.director.once(_globalExports.legacyCC.Director.EVENT_AFTER_UPDATE, this._post_play);

          return;
        }

        promise.then(this._post_play)["catch"](function () {
          _this2._interrupted = true;
        });
      }
    }, {
      key: "pause",
      value: function pause() {
        if (!this._audio) {
          return;
        }

        this._interrupted = false;

        if (this._state !== _player.PlayingState.PLAYING) {
          return;
        }

        this._audio.pause();

        this._state = _player.PlayingState.STOPPED;
        this._oneShotOngoing = false;
      }
    }, {
      key: "stop",
      value: function stop() {
        if (!this._audio) {
          return;
        }

        this._audio.currentTime = 0;
        this._interrupted = false;

        if (this._state !== _player.PlayingState.PLAYING) {
          return;
        }

        this._audio.pause();

        this._state = _player.PlayingState.STOPPED;
        this._oneShotOngoing = false;
      }
    }, {
      key: "playOneShot",
      value: function playOneShot() {
        var _this3 = this;

        var volume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        /* HTMLMediaElement doesn't support multiple playback at the
           same time so here we fall back to re-start style approach */
        var clip = this._audio;

        if (!clip) {
          return;
        }

        clip.currentTime = 0;
        clip.volume = volume;

        if (this._oneShotOngoing) {
          return;
        }

        clip.loop = false;
        this._oneShotOngoing = true;
        clip.play().then(function () {
          clip.addEventListener('ended', function () {
            clip.currentTime = 0;
            clip.volume = _this3._volume;
            clip.loop = _this3._loop;
            _this3._oneShotOngoing = false;
          }, {
            once: true
          });
        })["catch"](function () {
          _this3._oneShotOngoing = false;
        });
      }
    }, {
      key: "setCurrentTime",
      value: function setCurrentTime(val) {
        if (!this._audio) {
          return;
        }

        this._audio.currentTime = (0, _utils.clamp)(val, 0, this._duration);
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        return this._audio ? this._audio.currentTime : 0;
      }
    }, {
      key: "setVolume",
      value: function setVolume(val, immediate) {
        this._volume = val;
        /* note this won't work for ios devices, for there
           is just no way to set HTMLMediaElement's volume */

        if (this._audio) {
          this._audio.volume = val;
        }
      }
    }, {
      key: "getVolume",
      value: function getVolume() {
        if (this._audio) {
          return this._audio.volume;
        }

        return this._volume;
      }
    }, {
      key: "setLoop",
      value: function setLoop(val) {
        this._loop = val;

        if (this._audio) {
          this._audio.loop = val;
        }
      }
    }, {
      key: "getLoop",
      value: function getLoop() {
        return this._loop;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._audio) {
          this._audio.src = '';
        }

        _get(_getPrototypeOf(AudioPlayerDOM.prototype), "destroy", this).call(this);
      }
    }]);

    return AudioPlayerDOM;
  }(_player.AudioPlayer);

  _exports.AudioPlayerDOM = AudioPlayerDOM;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2F1ZGlvL2Fzc2V0cy9wbGF5ZXItZG9tLnRzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyRE9NIiwiaW5mbyIsIl92b2x1bWUiLCJfbG9vcCIsIl9vbmVTaG90T25nb2luZyIsIl9hdWRpbyIsIl9jYlJlZ2lzdGVyZWQiLCJfcmVtb3ZlX2NiIiwiX3Bvc3RfcGxheSIsIl9vbl9nZXN0dXJlIiwiX3Bvc3RfZ2VzdHVyZSIsImNsaXAiLCJsZWdhY3lDQyIsImdhbWUiLCJjYW52YXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3N0YXRlIiwiUGxheWluZ1N0YXRlIiwiUExBWUlORyIsIl9ldmVudFRhcmdldCIsImVtaXQiLCJfaW50ZXJydXB0ZWQiLCJwYXVzZSIsImN1cnJlbnRUaW1lIiwicHJvbWlzZSIsInBsYXkiLCJkaXJlY3RvciIsIm9uY2UiLCJEaXJlY3RvciIsIkVWRU5UX0FGVEVSX1VQREFURSIsInRoZW4iLCJ2b2x1bWUiLCJsb29wIiwiYWRkRXZlbnRMaXN0ZW5lciIsIlNUT1BQRUQiLCJfYmxvY2tpbmciLCJ2YWwiLCJfZHVyYXRpb24iLCJpbW1lZGlhdGUiLCJzcmMiLCJBdWRpb1BsYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BaUNhQSxjOzs7QUFZVCw0QkFBYUMsSUFBYixFQUErQjtBQUFBOztBQUFBOztBQUMzQiwwRkFBTUEsSUFBTjtBQUQyQixZQVhyQkMsT0FXcUIsR0FYWCxDQVdXO0FBQUEsWUFWckJDLEtBVXFCLEdBVmIsS0FVYTtBQUFBLFlBVHJCQyxlQVNxQixHQVRILEtBU0c7QUFBQSxZQVJyQkMsTUFRcUI7QUFBQSxZQVByQkMsYUFPcUIsR0FQTCxLQU9LO0FBQUEsWUFMdkJDLFVBS3VCO0FBQUEsWUFKdkJDLFVBSXVCO0FBQUEsWUFIdkJDLFdBR3VCO0FBQUEsWUFGdkJDLGFBRXVCO0FBRTNCLFlBQUtM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RUFBaUI7QUFBRSxlQUFLQSxNQUFMLENBQVkwQixNQUFaLEdBQXFCSyxHQUFyQjtBQUEyQjtBQUNqRDs7O2tDQUVtQjtBQUNoQixZQUFJLEtBQUsvQixNQUFULEVBQWlCO0FBQUUsaUJBQU8sS0FBS0EsTUFBTCxDQUFZMEIsTUFBbkI7QUFBNEI7O0FBQy9DLGVBQU8sS0FBSzdCLE9BQVo7QUFDSDs7OzhCQUVla0MsRyxFQUFjO0FBQzFCLGFBQUtqQyxLQUFMLEdBQWFpQyxHQUFiOztBQUNBLFlBQUksS0FBSy9CLE1BQVQsRUFBaUI7QUFBRSxlQUFLQSxNQUFMLENBQVkyQixJQUFaLEdBQW1CSSxHQUFuQjtBQUF5QjtBQUMvQzs7O2dDQUVpQjtBQUNkLGVBQU8sS0FBS2pDLEtBQVo7QUFDSDs7O2dDQUVpQjtBQUNkLFlBQUksS0FBS0UsTUFBVCxFQUFpQjtBQUFFLGVBQUtBLE1BQUwsQ0FBWWtDLEdBQVosR0FBa0IsRUFBbEI7QUFBdUI7O0FBQzFDO0FBQ0g7Ozs7SUFuSitCQyxtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudC9hdWRpb1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNsYW1wIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoL3V0aWxzJztcclxuaW1wb3J0IHsgQXVkaW9QbGF5ZXIsIElBdWRpb0luZm8sIFBsYXlpbmdTdGF0ZSB9IGZyb20gJy4vcGxheWVyJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBdWRpb1BsYXllckRPTSBleHRlbmRzIEF1ZGlvUGxheWVyIHtcclxuICAgIHByb3RlY3RlZCBfdm9sdW1lID0gMTtcclxuICAgIHByb3RlY3RlZCBfbG9vcCA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9vbmVTaG90T25nb2luZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9hdWRpbzogSFRNTEF1ZGlvRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCBfY2JSZWdpc3RlcmVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVtb3ZlX2NiOiAoKSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBfcG9zdF9wbGF5OiAoKSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBfb25fZ2VzdHVyZTogKCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgX3Bvc3RfZ2VzdHVyZTogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoaW5mbzogSUF1ZGlvSW5mbykge1xyXG4gICAgICAgIHN1cGVyKGluZm8pO1xyXG4gICAgICAgIHRoaXMuX2F1ZGlvID0gaW5mby5jbGlwO1xyXG5cclxuICAgICAgICB0aGlzLl9yZW1vdmVfY2IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fY2JSZWdpc3RlcmVkKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuX29uX2dlc3R1cmUpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25fZ2VzdHVyZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NiUmVnaXN0ZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RfcGxheSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQuZW1pdCgnc3RhcnRlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVfY2IoKTsgLy8gc2hvdWxkIHJlbW92ZSBjYWxsYmFja3MgYWZ0ZXIgYW55IHN1Y2Nlc3MgcGxheVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3RfZ2VzdHVyZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ludGVycnVwdGVkKSB7IHRoaXMuX3Bvc3RfcGxheSgpOyB0aGlzLl9pbnRlcnJ1cHRlZCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9hdWRpbyEucGF1c2UoKTsgdGhpcy5fYXVkaW8hLmN1cnJlbnRUaW1lID0gMDsgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX29uX2dlc3R1cmUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fYXVkaW8pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLl9hdWRpby5wbGF5KCk7XHJcbiAgICAgICAgICAgIGlmICghcHJvbWlzZSkgeyAvLyBDaHJvbWU1MC9GaXJlZm94NTMgYmVsb3dcclxuICAgICAgICAgICAgICAgIC8vIGRlbGF5IGV2YWwgaGVyZSB0byB5aWVsZCB1bmlmb3JtIGJlaGF2aW9yIHdpdGggb3RoZXIgcGxhdGZvcm1zXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QTEFZSU5HO1xyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub25jZShsZWdhY3lDQy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIHRoaXMuX3Bvc3RfZ2VzdHVyZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvbWlzZS50aGVuKHRoaXMuX3Bvc3RfZ2VzdHVyZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZV9jYigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2F1ZGlvLnZvbHVtZSA9IHRoaXMuX3ZvbHVtZTtcclxuICAgICAgICB0aGlzLl9hdWRpby5sb29wID0gdGhpcy5fbG9vcDtcclxuICAgICAgICAvLyBjYWxsYmFjayBvbiBhdWRpbyBlbmRlZFxyXG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb25lU2hvdE9uZ29pbmcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gUGxheWluZ1N0YXRlLlNUT1BQRUQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1ZGlvIS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0LmVtaXQoJ2VuZGVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLyogcGxheSAmIHN0b3AgaW1tZWRpYXRlbHkgYWZ0ZXIgcmVjZWl2aW5nIGEgZ2VzdHVyZSBzbyB0aGF0XHJcbiAgICAgICAgICAgd2UgY2FuIGZyZWVseSBpbnZva2UgcGxheSgpIG91dHNpZGUgZXZlbnQgbGlzdGVuZXJzIGxhdGVyICovXHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9vbl9nZXN0dXJlKTtcclxuICAgICAgICBsZWdhY3lDQy5nYW1lLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25fZ2VzdHVyZSk7XHJcbiAgICAgICAgdGhpcy5fY2JSZWdpc3RlcmVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGxheSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hdWRpbyB8fCB0aGlzLl9zdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Jsb2NraW5nKSB7IHRoaXMuX2ludGVycnVwdGVkID0gdHJ1ZTsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IHRoaXMuX2F1ZGlvLnBsYXkoKTtcclxuICAgICAgICBpZiAoIXByb21pc2UpIHtcclxuICAgICAgICAgICAgLy8gZGVsYXkgZXZhbCBoZXJlIHRvIHlpZWxkIHVuaWZvcm0gYmVoYXZpb3Igd2l0aCBvdGhlciBwbGF0Zm9ybXNcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBQbGF5aW5nU3RhdGUuUExBWUlORztcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub25jZShsZWdhY3lDQy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIHRoaXMuX3Bvc3RfcGxheSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKHRoaXMuX3Bvc3RfcGxheSkuY2F0Y2goKCkgPT4geyB0aGlzLl9pbnRlcnJ1cHRlZCA9IHRydWU7IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwYXVzZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hdWRpbykgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fYXVkaW8ucGF1c2UoKTtcclxuICAgICAgICB0aGlzLl9zdGF0ZSA9IFBsYXlpbmdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgIHRoaXMuX29uZVNob3RPbmdvaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0b3AgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fYXVkaW8pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fYXVkaW8uY3VycmVudFRpbWUgPSAwOyB0aGlzLl9pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZSAhPT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fYXVkaW8ucGF1c2UoKTtcclxuICAgICAgICB0aGlzLl9zdGF0ZSA9IFBsYXlpbmdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgIHRoaXMuX29uZVNob3RPbmdvaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBsYXlPbmVTaG90ICh2b2x1bWUgPSAxKSB7XHJcbiAgICAgICAgLyogSFRNTE1lZGlhRWxlbWVudCBkb2Vzbid0IHN1cHBvcnQgbXVsdGlwbGUgcGxheWJhY2sgYXQgdGhlXHJcbiAgICAgICAgICAgc2FtZSB0aW1lIHNvIGhlcmUgd2UgZmFsbCBiYWNrIHRvIHJlLXN0YXJ0IHN0eWxlIGFwcHJvYWNoICovXHJcbiAgICAgICAgY29uc3QgY2xpcCA9IHRoaXMuX2F1ZGlvO1xyXG4gICAgICAgIGlmICghY2xpcCkgeyByZXR1cm47IH1cclxuICAgICAgICBjbGlwLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICBjbGlwLnZvbHVtZSA9IHZvbHVtZTtcclxuICAgICAgICBpZiAodGhpcy5fb25lU2hvdE9uZ29pbmcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY2xpcC5sb29wID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb25lU2hvdE9uZ29pbmcgPSB0cnVlO1xyXG4gICAgICAgIGNsaXAucGxheSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICBjbGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2xpcC5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBjbGlwLnZvbHVtZSA9IHRoaXMuX3ZvbHVtZTtcclxuICAgICAgICAgICAgICAgIGNsaXAubG9vcCA9IHRoaXMuX2xvb3A7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbmVTaG90T25nb2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LCB7IG9uY2U6IHRydWUgfSk7XHJcbiAgICAgICAgfSkuY2F0Y2goKCkgPT4geyB0aGlzLl9vbmVTaG90T25nb2luZyA9IGZhbHNlOyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q3VycmVudFRpbWUgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hdWRpbykgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9hdWRpby5jdXJyZW50VGltZSA9IGNsYW1wKHZhbCwgMCwgdGhpcy5fZHVyYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdXJyZW50VGltZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1ZGlvID8gdGhpcy5fYXVkaW8uY3VycmVudFRpbWUgOiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRWb2x1bWUgKHZhbDogbnVtYmVyLCBpbW1lZGlhdGU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl92b2x1bWUgPSB2YWw7XHJcbiAgICAgICAgLyogbm90ZSB0aGlzIHdvbid0IHdvcmsgZm9yIGlvcyBkZXZpY2VzLCBmb3IgdGhlcmVcclxuICAgICAgICAgICBpcyBqdXN0IG5vIHdheSB0byBzZXQgSFRNTE1lZGlhRWxlbWVudCdzIHZvbHVtZSAqL1xyXG4gICAgICAgIGlmICh0aGlzLl9hdWRpbykgeyB0aGlzLl9hdWRpby52b2x1bWUgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Vm9sdW1lICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXVkaW8pIHsgcmV0dXJuIHRoaXMuX2F1ZGlvLnZvbHVtZTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl92b2x1bWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldExvb3AgKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2xvb3AgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2F1ZGlvKSB7IHRoaXMuX2F1ZGlvLmxvb3AgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TG9vcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvb3A7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9hdWRpbykgeyB0aGlzLl9hdWRpby5zcmMgPSAnJzsgfVxyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxufVxyXG4iXX0=