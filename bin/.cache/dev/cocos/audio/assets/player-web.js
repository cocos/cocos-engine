(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/math/utils.js", "../../core/platform/sys.js", "./player.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/math/utils.js"), require("../../core/platform/sys.js"), require("./player.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.sys, global.player, global.globalExports);
    global.playerWeb = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _sys, _player, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AudioPlayerWeb = void 0;

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

  var audioSupport = _sys.sys.__audioSupport;

  var AudioPlayerWeb = /*#__PURE__*/function (_AudioPlayer) {
    _inherits(AudioPlayerWeb, _AudioPlayer);

    function AudioPlayerWeb(info) {
      var _this;

      _classCallCheck(this, AudioPlayerWeb);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AudioPlayerWeb).call(this, info));
      _this._startTime = 0;
      _this._offset = 0;
      _this._volume = 1;
      _this._loop = false;
      _this._currentTimer = 0;
      _this._audio = void 0;
      _this._context = void 0;
      _this._sourceNode = void 0;
      _this._gainNode = void 0;
      _this._startInvoked = false;
      _this._onEndedCB = void 0;
      _this._onGestureCB = void 0;
      _this._onGestureProceedCB = void 0;
      _this._audio = info.clip;
      _this._context = audioSupport.context;
      _this._sourceNode = _this._context.createBufferSource();
      _this._gainNode = _this._context.createGain();

      _this._gainNode.connect(_this._context.destination);

      _this._onEndedCB = _this._onEnded.bind(_assertThisInitialized(_this));
      _this._onGestureCB = _this._onGesture.bind(_assertThisInitialized(_this));
      _this._onGestureProceedCB = _this._onGestureProceed.bind(_assertThisInitialized(_this)); // Chrome41/Firefox40 below don't have resume

      if (_this._context.state !== 'running' && _this._context.resume) {
        _globalExports.legacyCC.game.canvas.addEventListener('touchend', _this._onGestureCB);

        _globalExports.legacyCC.game.canvas.addEventListener('mouseup', _this._onGestureCB);
      }

      return _this;
    }

    _createClass(AudioPlayerWeb, [{
      key: "play",
      value: function play() {
        if (!this._audio || this._state === _player.PlayingState.PLAYING) {
          return;
        }

        if (this._blocking || this._context.state !== 'running') {
          this._interrupted = true;

          if (this._context.state === 'interrupted' && this._context.resume) {
            this._onGesture();
          }

          return;
        }

        this._doPlay();
      }
    }, {
      key: "pause",
      value: function pause() {
        this._interrupted = false;

        if (this._state !== _player.PlayingState.PLAYING) {
          return;
        }

        this._doStop();

        this._offset += this._context.currentTime - this._startTime;
        this._state = _player.PlayingState.STOPPED;
        clearInterval(this._currentTimer);
      }
    }, {
      key: "stop",
      value: function stop() {
        this._offset = 0;
        this._interrupted = false;

        if (this._state !== _player.PlayingState.PLAYING) {
          return;
        }

        this._doStop();

        this._state = _player.PlayingState.STOPPED;
        clearInterval(this._currentTimer);
      }
    }, {
      key: "playOneShot",
      value: function playOneShot() {
        var volume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        if (!this._audio) {
          return;
        }

        var gainNode = this._context.createGain();

        gainNode.connect(this._context.destination);
        gainNode.gain.value = volume;

        var sourceNode = this._context.createBufferSource();

        sourceNode.buffer = this._audio;
        sourceNode.loop = false;
        sourceNode.connect(gainNode);
        sourceNode.start();
      }
    }, {
      key: "setCurrentTime",
      value: function setCurrentTime(val) {
        // throws InvalidState Error on some device if we don't do the clamp here
        // the serialized duration may not be accurate, use the actual duration first
        this._offset = (0, _utils.clamp)(val, 0, this._audio && this._audio.duration || this._duration);

        if (this._state !== _player.PlayingState.PLAYING) {
          return;
        }

        this._doStop();

        this._doPlay();
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        if (this._state !== _player.PlayingState.PLAYING) {
          return this._offset;
        }

        return this._context.currentTime - this._startTime + this._offset;
      }
    }, {
      key: "setVolume",
      value: function setVolume(val, immediate) {
        this._volume = val;

        if (!immediate && this._gainNode.gain.setTargetAtTime) {
          this._gainNode.gain.setTargetAtTime(val, this._context.currentTime, 0.01);
        } else {
          this._gainNode.gain.value = val;
        }
      }
    }, {
      key: "getVolume",
      value: function getVolume() {
        return this._volume;
      }
    }, {
      key: "setLoop",
      value: function setLoop(val) {
        this._loop = val;
        this._sourceNode.loop = val;
      }
    }, {
      key: "getLoop",
      value: function getLoop() {
        return this._loop;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(AudioPlayerWeb.prototype), "destroy", this).call(this);
      }
    }, {
      key: "_doPlay",
      value: function _doPlay() {
        var _this2 = this;

        this._state = _player.PlayingState.PLAYING;
        this._sourceNode = this._context.createBufferSource();
        this._sourceNode.buffer = this._audio;
        this._sourceNode.loop = this._loop;

        this._sourceNode.connect(this._gainNode);

        this._startTime = this._context.currentTime;
        this._startInvoked = false; // delay eval here to yield uniform behavior with other platforms

        _globalExports.legacyCC.director.once(_globalExports.legacyCC.Director.EVENT_AFTER_UPDATE, this._playAndEmit, this);
        /* still not supported by all platforms *
        this._sourceNode.onended = this._onEnded;
        /* doing it manually for now */


        clearInterval(this._currentTimer);
        this._currentTimer = window.setInterval(function () {
          _this2._onEnded();

          clearInterval(_this2._currentTimer);

          if (_this2._sourceNode.loop) {
            _this2._currentTimer = window.setInterval(_this2._onEndedCB, _this2._audio.duration * 1000);
          }
        }, (this._audio.duration - this._offset) * 1000);
      }
    }, {
      key: "_doStop",
      value: function _doStop() {
        // stop can only be called after play
        if (this._startInvoked) {
          this._sourceNode.stop();
        } else {
          _globalExports.legacyCC.director.off(_globalExports.legacyCC.Director.EVENT_AFTER_UPDATE, this._playAndEmit, this);
        }
      }
    }, {
      key: "_playAndEmit",
      value: function _playAndEmit() {
        this._sourceNode.start(0, this._offset);

        this._eventTarget.emit('started');

        this._startInvoked = true;
      }
    }, {
      key: "_onEnded",
      value: function _onEnded() {
        this._offset = 0;
        this._startTime = this._context.currentTime;

        if (this._sourceNode.loop) {
          return;
        }

        this._eventTarget.emit('ended');

        this._state = _player.PlayingState.STOPPED;
      }
    }, {
      key: "_onGestureProceed",
      value: function _onGestureProceed() {
        if (this._interrupted) {
          this._doPlay();

          this._interrupted = false;
        }

        _globalExports.legacyCC.game.canvas.removeEventListener('touchend', this._onGestureCB);

        _globalExports.legacyCC.game.canvas.removeEventListener('mouseup', this._onGestureCB);
      }
    }, {
      key: "_onGesture",
      value: function _onGesture() {
        if (this._context.state !== 'running') {
          this._context.resume().then(this._onGestureProceedCB);
        } else {
          this._onGestureProceed();
        }
      }
    }]);

    return AudioPlayerWeb;
  }(_player.AudioPlayer);

  _exports.AudioPlayerWeb = AudioPlayerWeb;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2F1ZGlvL2Fzc2V0cy9wbGF5ZXItd2ViLnRzIl0sIm5hbWVzIjpbImF1ZGlvU3VwcG9ydCIsInN5cyIsIl9fYXVkaW9TdXBwb3J0IiwiQXVkaW9QbGF5ZXJXZWIiLCJpbmZvIiwiX3N0YXJ0VGltZSIsIl9vZmZzZXQiLCJfdm9sdW1lIiwiX2xvb3AiLCJfY3VycmVudFRpbWVyIiwiX2F1ZGlvIiwiX2NvbnRleHQiLCJfc291cmNlTm9kZSIsIl9nYWluTm9kZSIsIl9zdGFydEludm9rZWQiLCJfb25FbmRlZENCIiwiX29uR2VzdHVyZUNCIiwiX29uR2VzdHVyZVByb2NlZWRDQiIsImNsaXAiLCJjb250ZXh0IiwiY3JlYXRlQnVmZmVyU291cmNlIiwiY3JlYXRlR2FpbiIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsIl9vbkVuZGVkIiwiYmluZCIsIl9vbkdlc3R1cmUiLCJfb25HZXN0dXJlUHJvY2VlZCIsInN0YXRlIiwicmVzdW1lIiwibGVnYWN5Q0MiLCJnYW1lIiwiY2FudmFzIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9zdGF0ZSIsIlBsYXlpbmdTdGF0ZSIsIlBMQVlJTkciLCJfYmxvY2tpbmciLCJfaW50ZXJydXB0ZWQiLCJfZG9QbGF5IiwiX2RvU3RvcCIsImN1cnJlbnRUaW1lIiwiU1RPUFBFRCIsImNsZWFySW50ZXJ2YWwiLCJ2b2x1bWUiLCJnYWluTm9kZSIsImdhaW4iLCJ2YWx1ZSIsInNvdXJjZU5vZGUiLCJidWZmZXIiLCJsb29wIiwic3RhcnQiLCJ2YWwiLCJkdXJhdGlvbiIsIl9kdXJhdGlvbiIsImltbWVkaWF0ZSIsInNldFRhcmdldEF0VGltZSIsImRpcmVjdG9yIiwib25jZSIsIkRpcmVjdG9yIiwiRVZFTlRfQUZURVJfVVBEQVRFIiwiX3BsYXlBbmRFbWl0Iiwid2luZG93Iiwic2V0SW50ZXJ2YWwiLCJzdG9wIiwib2ZmIiwiX2V2ZW50VGFyZ2V0IiwiZW1pdCIsInJlbW92ZUV2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QUFsQixDQUF1QixTQUF2Qjs7QUFDQSxhQUFLckQsYUFBTCxHQUFxQixJQUFyQjtBQUNIOzs7aUNBRW1CO0FBQ2hCLGFBQUtSLE9BQUwsR0FBZSxDQUFmO0FBQ0EsYUFBS0QsVUFBTCxHQUFrQixLQUFLTSxRQUFMLENBQWM4QixXQUFoQzs7QUFDQSxZQUFJLEtBQUs3QixXQUFMLENBQWlCc0MsSUFBckIsRUFBMkI7QUFBRTtBQUFTOztBQUN0QyxhQUFLZ0IsWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsT0FBdkI7O0FBQ0EsYUFBS2pDLE1BQUwsR0FBY0MscUJBQWFPLE9BQTNCO0FBQ0g7OzswQ0FFNEI7QUFDekIsWUFBSSxLQUFLSixZQUFULEVBQXVCO0FBQUUsZUFBS0MsT0FBTDs7QUFBZ0IsZUFBS0QsWUFBTCxHQUFvQixLQUFwQjtBQUE0Qjs7QUFDckVSLGdDQUFTQyxJQUFULENBQWNDLE1BQWQsQ0FBcUJvQyxtQkFBckIsQ0FBeUMsVUFBekMsRUFBcUQsS0FBS3BELFlBQTFEOztBQUNBYyxnQ0FBU0MsSUFBVCxDQUFjQyxNQUFkLENBQXFCb0MsbUJBQXJCLENBQXlDLFNBQXpDLEVBQW9ELEtBQUtwRCxZQUF6RDtBQUNIOzs7bUNBRXFCO0FBQ2xCLFlBQUksS0FBS0wsUUFBTCxDQUFjaUIsS0FBZCxLQUF3QixTQUE1QixFQUF1QztBQUNuQyxlQUFLakIsUUFBTCxDQUFja0IsTUFBZCxHQUF1QndDLElBQXZCLENBQTRCLEtBQUtwRCxtQkFBakM7QUFDSCxTQUZELE1BRU87QUFDSCxlQUFLVSxpQkFBTDtBQUNIO0FBQ0o7Ozs7SUExSytCMkMsbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb21wb25lbnQvYXVkaW9cclxuICovXHJcblxyXG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aC91dGlscyc7XHJcbmltcG9ydCB7IHN5cyB9IGZyb20gJy4uLy4uL2NvcmUvcGxhdGZvcm0vc3lzJztcclxuaW1wb3J0IHsgQXVkaW9QbGF5ZXIsIElBdWRpb0luZm8sIFBsYXlpbmdTdGF0ZSB9IGZyb20gJy4vcGxheWVyJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IGF1ZGlvU3VwcG9ydCA9IHN5cy5fX2F1ZGlvU3VwcG9ydDtcclxuXHJcbmV4cG9ydCBjbGFzcyBBdWRpb1BsYXllcldlYiBleHRlbmRzIEF1ZGlvUGxheWVyIHtcclxuICAgIHByb3RlY3RlZCBfc3RhcnRUaW1lID0gMDtcclxuICAgIHByb3RlY3RlZCBfb2Zmc2V0ID0gMDtcclxuICAgIHByb3RlY3RlZCBfdm9sdW1lID0gMTtcclxuICAgIHByb3RlY3RlZCBfbG9vcCA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9jdXJyZW50VGltZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9hdWRpbzogQXVkaW9CdWZmZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY29udGV4dDogQXVkaW9Db250ZXh0O1xyXG4gICAgcHJpdmF0ZSBfc291cmNlTm9kZTogQXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xyXG4gICAgcHJpdmF0ZSBfZ2Fpbk5vZGU6IEdhaW5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBfc3RhcnRJbnZva2VkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfb25FbmRlZENCOiAoKSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBfb25HZXN0dXJlQ0I6ICgpID0+IHZvaWQ7XHJcbiAgICBwcml2YXRlIF9vbkdlc3R1cmVQcm9jZWVkQ0I6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGluZm86IElBdWRpb0luZm8pIHtcclxuICAgICAgICBzdXBlcihpbmZvKTtcclxuICAgICAgICB0aGlzLl9hdWRpbyA9IGluZm8uY2xpcDtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IGF1ZGlvU3VwcG9ydC5jb250ZXh0O1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZU5vZGUgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgIHRoaXMuX2dhaW5Ob2RlID0gdGhpcy5fY29udGV4dC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgdGhpcy5fZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLl9jb250ZXh0LmRlc3RpbmF0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5fb25FbmRlZENCID0gdGhpcy5fb25FbmRlZC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX29uR2VzdHVyZUNCID0gdGhpcy5fb25HZXN0dXJlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fb25HZXN0dXJlUHJvY2VlZENCID0gdGhpcy5fb25HZXN0dXJlUHJvY2VlZC5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICAvLyBDaHJvbWU0MS9GaXJlZm94NDAgYmVsb3cgZG9uJ3QgaGF2ZSByZXN1bWVcclxuICAgICAgICBpZiAodGhpcy5fY29udGV4dC5zdGF0ZSAhPT0gJ3J1bm5pbmcnICYmIHRoaXMuX2NvbnRleHQucmVzdW1lKSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5fb25HZXN0dXJlQ0IpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fb25HZXN0dXJlQ0IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGxheSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hdWRpbyB8fCB0aGlzLl9zdGF0ZSA9PT0gUGxheWluZ1N0YXRlLlBMQVlJTkcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2Jsb2NraW5nIHx8IHRoaXMuX2NvbnRleHQuc3RhdGUgIT09ICdydW5uaW5nJykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb250ZXh0LnN0YXRlIGFzIHN0cmluZyA9PT0gJ2ludGVycnVwdGVkJyAmJiB0aGlzLl9jb250ZXh0LnJlc3VtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25HZXN0dXJlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kb1BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcGF1c2UgKCkge1xyXG4gICAgICAgIHRoaXMuX2ludGVycnVwdGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlICE9PSBQbGF5aW5nU3RhdGUuUExBWUlORykgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9kb1N0b3AoKTtcclxuICAgICAgICB0aGlzLl9vZmZzZXQgKz0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcclxuICAgICAgICB0aGlzLl9zdGF0ZSA9IFBsYXlpbmdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fY3VycmVudFRpbWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RvcCAoKSB7XHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gMDsgdGhpcy5faW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdGUgIT09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX2RvU3RvcCgpO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gUGxheWluZ1N0YXRlLlNUT1BQRUQ7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9jdXJyZW50VGltZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbGF5T25lU2hvdCAodm9sdW1lID0gMSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fYXVkaW8pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgZ2Fpbk5vZGUgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUdhaW4oKTtcclxuICAgICAgICBnYWluTm9kZS5jb25uZWN0KHRoaXMuX2NvbnRleHQuZGVzdGluYXRpb24pO1xyXG4gICAgICAgIGdhaW5Ob2RlLmdhaW4udmFsdWUgPSB2b2x1bWU7XHJcbiAgICAgICAgY29uc3Qgc291cmNlTm9kZSA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgc291cmNlTm9kZS5idWZmZXIgPSB0aGlzLl9hdWRpbztcclxuICAgICAgICBzb3VyY2VOb2RlLmxvb3AgPSBmYWxzZTtcclxuICAgICAgICBzb3VyY2VOb2RlLmNvbm5lY3QoZ2Fpbk5vZGUpO1xyXG4gICAgICAgIHNvdXJjZU5vZGUuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q3VycmVudFRpbWUgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gdGhyb3dzIEludmFsaWRTdGF0ZSBFcnJvciBvbiBzb21lIGRldmljZSBpZiB3ZSBkb24ndCBkbyB0aGUgY2xhbXAgaGVyZVxyXG4gICAgICAgIC8vIHRoZSBzZXJpYWxpemVkIGR1cmF0aW9uIG1heSBub3QgYmUgYWNjdXJhdGUsIHVzZSB0aGUgYWN0dWFsIGR1cmF0aW9uIGZpcnN0XHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gY2xhbXAodmFsLCAwLCB0aGlzLl9hdWRpbyAmJiB0aGlzLl9hdWRpby5kdXJhdGlvbiB8fCB0aGlzLl9kdXJhdGlvbik7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlICE9PSBQbGF5aW5nU3RhdGUuUExBWUlORykgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9kb1N0b3AoKTsgdGhpcy5fZG9QbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEN1cnJlbnRUaW1lICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdGUgIT09IFBsYXlpbmdTdGF0ZS5QTEFZSU5HKSB7IHJldHVybiB0aGlzLl9vZmZzZXQ7IH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuX3N0YXJ0VGltZSArIHRoaXMuX29mZnNldDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Vm9sdW1lICh2YWw6IG51bWJlciwgaW1tZWRpYXRlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fdm9sdW1lID0gdmFsO1xyXG4gICAgICAgIGlmICghaW1tZWRpYXRlICYmIHRoaXMuX2dhaW5Ob2RlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2dhaW5Ob2RlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKHZhbCwgdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSwgMC4wMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFZvbHVtZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TG9vcCAodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fbG9vcCA9IHZhbDtcclxuICAgICAgICB0aGlzLl9zb3VyY2VOb2RlLmxvb3AgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldExvb3AgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb29wO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHsgc3VwZXIuZGVzdHJveSgpOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZG9QbGF5ICgpIHtcclxuICAgICAgICB0aGlzLl9zdGF0ZSA9IFBsYXlpbmdTdGF0ZS5QTEFZSU5HO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZU5vZGUgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZU5vZGUuYnVmZmVyID0gdGhpcy5fYXVkaW87XHJcbiAgICAgICAgdGhpcy5fc291cmNlTm9kZS5sb29wID0gdGhpcy5fbG9vcDtcclxuICAgICAgICB0aGlzLl9zb3VyY2VOb2RlLmNvbm5lY3QodGhpcy5fZ2Fpbk5vZGUpO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHRoaXMuX2NvbnRleHQuY3VycmVudFRpbWU7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRJbnZva2VkID0gZmFsc2U7XHJcbiAgICAgICAgLy8gZGVsYXkgZXZhbCBoZXJlIHRvIHlpZWxkIHVuaWZvcm0gYmVoYXZpb3Igd2l0aCBvdGhlciBwbGF0Zm9ybXNcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5vbmNlKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgdGhpcy5fcGxheUFuZEVtaXQsIHRoaXMpO1xyXG4gICAgICAgIC8qIHN0aWxsIG5vdCBzdXBwb3J0ZWQgYnkgYWxsIHBsYXRmb3JtcyAqXHJcbiAgICAgICAgdGhpcy5fc291cmNlTm9kZS5vbmVuZGVkID0gdGhpcy5fb25FbmRlZDtcclxuICAgICAgICAvKiBkb2luZyBpdCBtYW51YWxseSBmb3Igbm93ICovXHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9jdXJyZW50VGltZXIpO1xyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRUaW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uRW5kZWQoKTtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9jdXJyZW50VGltZXIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc291cmNlTm9kZS5sb29wKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50VGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5fb25FbmRlZENCLCB0aGlzLl9hdWRpby5kdXJhdGlvbiAqIDEwMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgKHRoaXMuX2F1ZGlvLmR1cmF0aW9uIC0gdGhpcy5fb2Zmc2V0KSAqIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2RvU3RvcCAoKSB7XHJcbiAgICAgICAgLy8gc3RvcCBjYW4gb25seSBiZSBjYWxsZWQgYWZ0ZXIgcGxheVxyXG4gICAgICAgIGlmICh0aGlzLl9zdGFydEludm9rZWQpIHsgdGhpcy5fc291cmNlTm9kZS5zdG9wKCk7IH1cclxuICAgICAgICBlbHNlIHsgbGVnYWN5Q0MuZGlyZWN0b3Iub2ZmKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgdGhpcy5fcGxheUFuZEVtaXQsIHRoaXMpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcGxheUFuZEVtaXQgKCkge1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZU5vZGUuc3RhcnQoMCwgdGhpcy5fb2Zmc2V0KTtcclxuICAgICAgICB0aGlzLl9ldmVudFRhcmdldC5lbWl0KCdzdGFydGVkJyk7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRJbnZva2VkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9vbkVuZGVkICgpIHtcclxuICAgICAgICB0aGlzLl9vZmZzZXQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHRoaXMuX2NvbnRleHQuY3VycmVudFRpbWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NvdXJjZU5vZGUubG9vcCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9ldmVudFRhcmdldC5lbWl0KCdlbmRlZCcpO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gUGxheWluZ1N0YXRlLlNUT1BQRUQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25HZXN0dXJlUHJvY2VlZCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ludGVycnVwdGVkKSB7IHRoaXMuX2RvUGxheSgpOyB0aGlzLl9pbnRlcnJ1cHRlZCA9IGZhbHNlOyB9XHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9vbkdlc3R1cmVDQik7XHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX29uR2VzdHVyZUNCKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9vbkdlc3R1cmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZXh0LnN0YXRlICE9PSAncnVubmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5yZXN1bWUoKS50aGVuKHRoaXMuX29uR2VzdHVyZVByb2NlZWRDQik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fb25HZXN0dXJlUHJvY2VlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=