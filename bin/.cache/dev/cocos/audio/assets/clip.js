(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/asset.js", "../../core/data/decorators/index.js", "../../core/value-types/index.js", "./player.js", "./player-dom.js", "./player-web.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/asset.js"), require("../../core/data/decorators/index.js"), require("../../core/value-types/index.js"), require("./player.js"), require("./player-dom.js"), require("./player-web.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.asset, global.index, global.index, global.player, global.playerDom, global.playerWeb, global.globalExports);
    global.clip = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _asset, _index, _index2, _player, _playerDom, _playerWeb, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AudioClip = _exports.AudioType = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var AudioType = (0, _index2.Enum)({
    WEB_AUDIO: 0,
    DOM_AUDIO: 1,
    JSB_AUDIO: 2,
    UNKNOWN_AUDIO: 3
  });
  /**
   * @en
   * The audio clip asset. <br>
   * 'started' event is emitted once the audio began to play. <br>
   * 'ended' event is emitted once the audio stopped. <br>
   * Low-level platform-specific details are handled independently inside each clip.
   * @zh
   * 音频片段资源。<br>
   * 每当音频片段实际开始播放时，会发出 'started' 事件；<br>
   * 每当音频片段自然结束播放时，会发出 'ended' 事件。<br>
   * 每个片段独立处理自己依赖的平台相关的底层细节。
   */

  _exports.AudioType = AudioType;
  var AudioClip = (_dec = (0, _index.ccclass)('cc.AudioClip'), _dec2 = (0, _index.type)(AudioType), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Asset) {
    _inherits(AudioClip, _Asset);

    // we serialize this because it's unavailable at runtime on some platforms
    function AudioClip() {
      var _this;

      _classCallCheck(this, AudioClip);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AudioClip).call(this));

      _initializerDefineProperty(_this, "_duration", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_loadMode", _descriptor2, _assertThisInitialized(_this));

      _this._audio = null;
      _this._player = null;
      _this.loaded = false;
      return _this;
    }

    _createClass(AudioClip, [{
      key: "destroy",
      value: function destroy() {
        if (this._player) {
          this._player.destroy();
        }

        return _get(_getPrototypeOf(AudioClip.prototype), "destroy", this).call(this);
      }
    }, {
      key: "play",
      value: function play() {
        if (this._player) {
          this._player.play();
        }
      }
    }, {
      key: "pause",
      value: function pause() {
        if (this._player) {
          this._player.pause();
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        if (this._player) {
          this._player.stop();
        }
      }
    }, {
      key: "playOneShot",
      value: function playOneShot(volume) {
        if (this._player) {
          this._player.playOneShot(volume);
        }
      }
    }, {
      key: "setCurrentTime",
      value: function setCurrentTime(val) {
        if (this._player) {
          this._player.setCurrentTime(val);
        }
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        if (this._player) {
          return this._player.getCurrentTime();
        }

        return 0;
      }
    }, {
      key: "getDuration",
      value: function getDuration() {
        if (this._player) {
          return this._player.getDuration();
        }

        return this._duration;
      }
    }, {
      key: "setVolume",
      value: function setVolume(val, immediate) {
        if (this._player) {
          this._player.setVolume(val, immediate || false);
        }
      }
    }, {
      key: "getVolume",
      value: function getVolume() {
        if (this._player) {
          return this._player.getVolume();
        }

        return 1;
      }
    }, {
      key: "setLoop",
      value: function setLoop(val) {
        if (this._player) {
          this._player.setLoop(val);
        }
      }
    }, {
      key: "getLoop",
      value: function getLoop() {
        if (this._player) {
          return this._player.getLoop();
        }

        return false;
      }
    }, {
      key: "_getPlayer",
      value: function _getPlayer(clip) {
        var ctor;

        if (typeof AudioBuffer !== 'undefined' && clip instanceof AudioBuffer) {
          ctor = _playerWeb.AudioPlayerWeb;
          this._loadMode = AudioType.WEB_AUDIO;
        } else {
          ctor = _playerDom.AudioPlayerDOM;
          this._loadMode = AudioType.DOM_AUDIO;
        }

        return ctor;
      }
    }, {
      key: "_nativeAsset",
      set: function set(clip) {
        this._audio = clip;

        if (clip) {
          var ctor = this._getPlayer(clip);

          this._player = new ctor({
            clip: clip,
            duration: this._duration,
            eventTarget: this
          });
          this.loaded = true;
          this.emit('load');
        } else {
          this._player = null;
          this._loadMode = AudioType.UNKNOWN_AUDIO;
          this._duration = 0;
          this.loaded = false;
        }
      },
      get: function get() {
        return this._audio;
      }
    }, {
      key: "loadMode",
      get: function get() {
        return this._loadMode;
      }
    }, {
      key: "state",
      get: function get() {
        return this._player ? this._player.getState() : _player.PlayingState.INITIALIZING;
      }
    }]);

    return AudioClip;
  }(_asset.Asset), _class3.PlayingState = _player.PlayingState, _class3.AudioType = AudioType, _class3.preventDeferredLoadDependents = true, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_duration", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_loadMode", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return AudioType.UNKNOWN_AUDIO;
    }
  })), _class2)) || _class);
  _exports.AudioClip = AudioClip;
  _globalExports.legacyCC.AudioClip = AudioClip;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2F1ZGlvL2Fzc2V0cy9jbGlwLnRzIl0sIm5hbWVzIjpbIkF1ZGlvVHlwZSIsIldFQl9BVURJTyIsIkRPTV9BVURJTyIsIkpTQl9BVURJTyIsIlVOS05PV05fQVVESU8iLCJBdWRpb0NsaXAiLCJfYXVkaW8iLCJfcGxheWVyIiwibG9hZGVkIiwiZGVzdHJveSIsInBsYXkiLCJwYXVzZSIsInN0b3AiLCJ2b2x1bWUiLCJwbGF5T25lU2hvdCIsInZhbCIsInNldEN1cnJlbnRUaW1lIiwiZ2V0Q3VycmVudFRpbWUiLCJnZXREdXJhdGlvbiIsIl9kdXJhdGlvbiIsImltbWVkaWF0ZSIsInNldFZvbHVtZSIsImdldFZvbHVtZSIsInNldExvb3AiLCJnZXRMb29wIiwiY2xpcCIsImN0b3IiLCJBdWRpb0J1ZmZlciIsIkF1ZGlvUGxheWVyV2ViIiwiX2xvYWRNb2RlIiwiQXVkaW9QbGF5ZXJET00iLCJfZ2V0UGxheWVyIiwiZHVyYXRpb24iLCJldmVudFRhcmdldCIsImVtaXQiLCJnZXRTdGF0ZSIsIlBsYXlpbmdTdGF0ZSIsIklOSVRJQUxJWklORyIsIkFzc2V0IiwicHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHMiLCJzZXJpYWxpemFibGUiLCJsZWdhY3lDQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ08sTUFBTUEsU0FBUyxHQUFHLGtCQUFLO0FBQzFCQyxJQUFBQSxTQUFTLEVBQUUsQ0FEZTtBQUUxQkMsSUFBQUEsU0FBUyxFQUFFLENBRmU7QUFHMUJDLElBQUFBLFNBQVMsRUFBRSxDQUhlO0FBSTFCQyxJQUFBQSxhQUFhLEVBQUU7QUFKVyxHQUFMLENBQWxCO0FBT1A7Ozs7Ozs7Ozs7Ozs7O01BYWFDLFMsV0FEWixvQkFBUSxjQUFSLEMsVUFVSSxpQkFBS0wsU0FBTCxDOzs7QUFGd0I7QUFRekIseUJBQWU7QUFBQTs7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TUFBTCxHQUFjLElBQWQ7QUFDQSxlQUFLMEIsSUFBTCxDQUFVLE1BQVY7QUFDSCxTQUxELE1BS087QUFDSCxlQUFLM0IsT0FBTCxHQUFlLElBQWY7QUFDQSxlQUFLc0IsU0FBTCxHQUFpQjdCLFNBQVMsQ0FBQ0ksYUFBM0I7QUFDQSxlQUFLZSxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsZUFBS1gsTUFBTCxHQUFjLEtBQWQ7QUFDSDtBQUNKLE87MEJBRW1CO0FBQ2hCLGVBQU8sS0FBS0YsTUFBWjtBQUNIOzs7MEJBRWU7QUFDWixlQUFPLEtBQUt1QixTQUFaO0FBQ0g7OzswQkFFWTtBQUNULGVBQU8sS0FBS3RCLE9BQUwsR0FBZSxLQUFLQSxPQUFMLENBQWE0QixRQUFiLEVBQWYsR0FBeUNDLHFCQUFhQyxZQUE3RDtBQUNIOzs7O0lBbEQwQkMsWSxXQUViRixZLEdBQWVBLG9CLFVBQ2ZwQyxTLEdBQVlBLFMsVUFDWnVDLDZCLEdBQWdDLEksb0ZBRTdDQyxtQjs7Ozs7YUFDcUIsQzs7Ozs7OzthQUdBeEMsU0FBUyxDQUFDSSxhOzs7O0FBbUVwQ3FDLDBCQUFTcEMsU0FBVCxHQUFxQkEsU0FBckIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb21wb25lbnQvYXVkaW9cclxuICovXHJcblxyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4uLy4uL2NvcmUvYXNzZXRzL2Fzc2V0JztcclxuaW1wb3J0IHsgY2NjbGFzcywgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBBdWRpb1BsYXllciwgUGxheWluZ1N0YXRlIH0gZnJvbSAnLi9wbGF5ZXInO1xyXG5pbXBvcnQgeyBBdWRpb1BsYXllckRPTSB9IGZyb20gJy4vcGxheWVyLWRvbSc7XHJcbmltcG9ydCB7IEF1ZGlvUGxheWVyV2ViIH0gZnJvbSAnLi9wbGF5ZXItd2ViJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmV4cG9ydCBjb25zdCBBdWRpb1R5cGUgPSBFbnVtKHtcclxuICAgIFdFQl9BVURJTzogMCxcclxuICAgIERPTV9BVURJTzogMSxcclxuICAgIEpTQl9BVURJTzogMixcclxuICAgIFVOS05PV05fQVVESU86IDMsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgYXVkaW8gY2xpcCBhc3NldC4gPGJyPlxyXG4gKiAnc3RhcnRlZCcgZXZlbnQgaXMgZW1pdHRlZCBvbmNlIHRoZSBhdWRpbyBiZWdhbiB0byBwbGF5LiA8YnI+XHJcbiAqICdlbmRlZCcgZXZlbnQgaXMgZW1pdHRlZCBvbmNlIHRoZSBhdWRpbyBzdG9wcGVkLiA8YnI+XHJcbiAqIExvdy1sZXZlbCBwbGF0Zm9ybS1zcGVjaWZpYyBkZXRhaWxzIGFyZSBoYW5kbGVkIGluZGVwZW5kZW50bHkgaW5zaWRlIGVhY2ggY2xpcC5cclxuICogQHpoXHJcbiAqIOmfs+mikeeJh+autei1hOa6kOOAgjxicj5cclxuICog5q+P5b2T6Z+z6aKR54mH5q615a6e6ZmF5byA5aeL5pKt5pS+5pe277yM5Lya5Y+R5Ye6ICdzdGFydGVkJyDkuovku7bvvJs8YnI+XHJcbiAqIOavj+W9k+mfs+mikeeJh+auteiHqueEtue7k+adn+aSreaUvuaXtu+8jOS8muWPkeWHuiAnZW5kZWQnIOS6i+S7tuOAgjxicj5cclxuICog5q+P5Liq54mH5q6154us56uL5aSE55CG6Ieq5bex5L6d6LWW55qE5bmz5Y+w55u45YWz55qE5bqV5bGC57uG6IqC44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQXVkaW9DbGlwJylcclxuZXhwb3J0IGNsYXNzIEF1ZGlvQ2xpcCBleHRlbmRzIEFzc2V0IHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIFBsYXlpbmdTdGF0ZSA9IFBsYXlpbmdTdGF0ZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgQXVkaW9UeXBlID0gQXVkaW9UeXBlO1xyXG4gICAgcHVibGljIHN0YXRpYyBwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cyA9IHRydWU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9kdXJhdGlvbiA9IDA7IC8vIHdlIHNlcmlhbGl6ZSB0aGlzIGJlY2F1c2UgaXQncyB1bmF2YWlsYWJsZSBhdCBydW50aW1lIG9uIHNvbWUgcGxhdGZvcm1zXHJcblxyXG4gICAgQHR5cGUoQXVkaW9UeXBlKVxyXG4gICAgcHJvdGVjdGVkIF9sb2FkTW9kZSA9IEF1ZGlvVHlwZS5VTktOT1dOX0FVRElPO1xyXG5cclxuICAgIHByb3RlY3RlZCBfYXVkaW86IGFueSA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3BsYXllcjogQXVkaW9QbGF5ZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGxheWVyKSB7IHRoaXMuX3BsYXllci5kZXN0cm95KCk7IH1cclxuICAgICAgICByZXR1cm4gc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBfbmF0aXZlQXNzZXQgKGNsaXA6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2F1ZGlvID0gY2xpcDtcclxuICAgICAgICBpZiAoY2xpcCkge1xyXG4gICAgICAgICAgICBjb25zdCBjdG9yID0gdGhpcy5fZ2V0UGxheWVyKGNsaXApO1xyXG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIgPSBuZXcgY3Rvcih7IGNsaXAsIGR1cmF0aW9uOiB0aGlzLl9kdXJhdGlvbiwgZXZlbnRUYXJnZXQ6IHRoaXMgfSk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcGxheWVyID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGUgPSBBdWRpb1R5cGUuVU5LTk9XTl9BVURJTztcclxuICAgICAgICAgICAgdGhpcy5fZHVyYXRpb24gPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgX25hdGl2ZUFzc2V0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW87XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGxvYWRNb2RlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZE1vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0YXRlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGxheWVyID8gdGhpcy5fcGxheWVyLmdldFN0YXRlKCkgOiBQbGF5aW5nU3RhdGUuSU5JVElBTElaSU5HO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwbGF5ICgpIHsgaWYgKHRoaXMuX3BsYXllcikgeyB0aGlzLl9wbGF5ZXIucGxheSgpOyB9IH1cclxuICAgIHB1YmxpYyBwYXVzZSAoKSB7IGlmICh0aGlzLl9wbGF5ZXIpIHsgdGhpcy5fcGxheWVyLnBhdXNlKCk7IH0gfVxyXG4gICAgcHVibGljIHN0b3AgKCkgeyBpZiAodGhpcy5fcGxheWVyKSB7IHRoaXMuX3BsYXllci5zdG9wKCk7IH0gfVxyXG4gICAgcHVibGljIHBsYXlPbmVTaG90ICh2b2x1bWU6IG51bWJlcikgeyBpZiAodGhpcy5fcGxheWVyKSB7IHRoaXMuX3BsYXllci5wbGF5T25lU2hvdCh2b2x1bWUpOyB9IH1cclxuICAgIHB1YmxpYyBzZXRDdXJyZW50VGltZSAodmFsOiBudW1iZXIpIHsgaWYgKHRoaXMuX3BsYXllcikgeyB0aGlzLl9wbGF5ZXIuc2V0Q3VycmVudFRpbWUodmFsKTsgfSB9XHJcbiAgICBwdWJsaWMgZ2V0Q3VycmVudFRpbWUgKCkgeyBpZiAodGhpcy5fcGxheWVyKSB7IHJldHVybiB0aGlzLl9wbGF5ZXIuZ2V0Q3VycmVudFRpbWUoKTsgfSByZXR1cm4gMDsgfVxyXG4gICAgcHVibGljIGdldER1cmF0aW9uICgpIHsgaWYgKHRoaXMuX3BsYXllcikgeyByZXR1cm4gdGhpcy5fcGxheWVyLmdldER1cmF0aW9uKCk7IH0gcmV0dXJuIHRoaXMuX2R1cmF0aW9uOyB9XHJcbiAgICBwdWJsaWMgc2V0Vm9sdW1lICh2YWw6IG51bWJlciwgaW1tZWRpYXRlPzogYm9vbGVhbikgeyBpZiAodGhpcy5fcGxheWVyKSB7IHRoaXMuX3BsYXllci5zZXRWb2x1bWUodmFsLCBpbW1lZGlhdGUgfHwgZmFsc2UpOyB9IH1cclxuICAgIHB1YmxpYyBnZXRWb2x1bWUgKCkgeyBpZiAodGhpcy5fcGxheWVyKSB7IHJldHVybiB0aGlzLl9wbGF5ZXIuZ2V0Vm9sdW1lKCk7IH0gcmV0dXJuIDE7IH1cclxuICAgIHB1YmxpYyBzZXRMb29wICh2YWw6IGJvb2xlYW4pIHsgaWYgKHRoaXMuX3BsYXllcikgeyB0aGlzLl9wbGF5ZXIuc2V0TG9vcCh2YWwpOyB9IH1cclxuICAgIHB1YmxpYyBnZXRMb29wICgpIHsgaWYgKHRoaXMuX3BsYXllcikgeyByZXR1cm4gdGhpcy5fcGxheWVyLmdldExvb3AoKTsgfSByZXR1cm4gZmFsc2U7IH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRQbGF5ZXIgKGNsaXA6IGFueSkge1xyXG4gICAgICAgIGxldCBjdG9yOiBhbnk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBBdWRpb0J1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgY2xpcCBpbnN0YW5jZW9mIEF1ZGlvQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGN0b3IgPSBBdWRpb1BsYXllcldlYjtcclxuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGUgPSBBdWRpb1R5cGUuV0VCX0FVRElPO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN0b3IgPSBBdWRpb1BsYXllckRPTTtcclxuICAgICAgICAgICAgdGhpcy5fbG9hZE1vZGUgPSBBdWRpb1R5cGUuRE9NX0FVRElPO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3RvcjtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuQXVkaW9DbGlwID0gQXVkaW9DbGlwO1xyXG4iXX0=