(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/components/component.js", "../core/data/decorators/index.js", "../core/math/index.js", "./assets/clip.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/components/component.js"), require("../core/data/decorators/index.js"), require("../core/math/index.js"), require("./assets/clip.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.index, global.clip);
    global.audioSource = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _index2, _clip) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AudioSource = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * A representation of a single audio source, <br>
   * contains basic functionalities like play, pause and stop.
   * @zh
   * 音频组件，代表单个音源，提供播放、暂停、停止等基本功能。
   */
  var AudioSource = (_dec = (0, _index.ccclass)('cc.AudioSource'), _dec2 = (0, _index.help)('i18n:cc.AudioSource'), _dec3 = (0, _index.menu)('Components/AudioSource'), _dec4 = (0, _index.type)(_clip.AudioClip), _dec5 = (0, _index.type)(_clip.AudioClip), _dec6 = (0, _index.tooltip)('i18n:audio.clip'), _dec7 = (0, _index.tooltip)('i18n:audio.loop'), _dec8 = (0, _index.tooltip)('i18n:audio.playOnAwake'), _dec9 = (0, _index.range)([0.0, 1.0]), _dec10 = (0, _index.tooltip)('i18n:audio.volume'), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(AudioSource, _Component);

    function AudioSource() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, AudioSource);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AudioSource)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_clip", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_loop", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_playOnAwake", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_volume", _descriptor4, _assertThisInitialized(_this));

      _this._cachedCurrentTime = 0;
      return _this;
    }

    _createClass(AudioSource, [{
      key: "onLoad",
      value: function onLoad() {
        this._syncStates();

        if (this._playOnAwake) {
          this.play();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.pause();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this.stop();
      }
      /**
       * @en
       * Play the clip.<br>
       * Restart if already playing.<br>
       * Resume if paused.
       * @zh
       * 开始播放。<br>
       * 如果音频处于正在播放状态，将会重新开始播放音频。<br>
       * 如果音频处于暂停状态，则会继续播放音频。
       */

    }, {
      key: "play",
      value: function play() {
        if (!this._clip) {
          return;
        }

        if (this.playing) {
          this.currentTime = 0;
        } else {
          this._clip.play();
        }
      }
      /**
       * @en
       * Pause the clip.
       * @zh
       * 暂停播放。
       */

    }, {
      key: "pause",
      value: function pause() {
        if (!this._clip) {
          return;
        }

        this._clip.pause();
      }
      /**
       * @en
       * Stop the clip.
       * @zh
       * 停止播放。
       */

    }, {
      key: "stop",
      value: function stop() {
        if (!this._clip) {
          return;
        }

        this._clip.stop();
      }
      /**
       * @en
       * Plays an AudioClip, and scales volume by volumeScale.<br>
       * Note: for multiple playback on the same clip, the actual behavior is platform-specific.<br>
       * Re-start style fallback will be used if the underlying platform doesn't support it.
       * @zh
       * 以指定音量播放一个音频一次。<br>
       * 注意，对同一个音频片段，不同平台多重播放效果存在差异。<br>
       * 对不支持的平台，如前一次尚未播完，则会立即重新播放。
       * @param clip The audio clip to be played.
       * @param volumeScale volume scaling factor wrt. current value.
       */

    }, {
      key: "playOneShot",
      value: function playOneShot(clip) {
        var volumeScale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        clip.playOneShot(this._volume * volumeScale);
      }
    }, {
      key: "_syncStates",
      value: function _syncStates() {
        if (!this._clip) {
          return;
        }

        this._clip.setCurrentTime(this._cachedCurrentTime);

        this._clip.setLoop(this._loop);

        this._clip.setVolume(this._volume, true);

        this._volume = this._clip.getVolume();
      }
      /**
       * @en
       * Set current playback time, in seconds.
       * @zh
       * 以秒为单位设置当前播放时间。
       * @param num playback time to jump to.
       */

    }, {
      key: "clip",

      /**
       * @en
       * The default AudioClip to be played for this audio source.
       * @zh
       * 设定要播放的音频。
       */
      set: function set(val) {
        this._clip = val;

        this._syncStates();
      },
      get: function get() {
        return this._clip;
      }
      /**
       * @en
       * Is looping enabled for this audio source?
       * @zh
       * 是否循环播放音频？
       */

    }, {
      key: "loop",
      set: function set(val) {
        this._loop = val;

        if (this._clip) {
          this._clip.setLoop(val);
        }
      },
      get: function get() {
        return this._loop;
      }
      /**
       * @en
       * Is the autoplay enabled? <br>
       * Note that for most platform autoplay will only start <br>
       * after a user gesture is received, according to the latest autoplay policy: <br>
       * https://www.chromium.org/audio-video/autoplay
       * @zh
       * 是否启用自动播放。 <br>
       * 请注意，根据最新的自动播放策略，现在对大多数平台，自动播放只会在第一次收到用户输入后生效。 <br>
       * 参考：https://www.chromium.org/audio-video/autoplay
       */

    }, {
      key: "playOnAwake",
      set: function set(val) {
        this._playOnAwake = val;
      },
      get: function get() {
        return this._playOnAwake;
      }
      /**
       * @en
       * The volume of this audio source (0.0 to 1.0).<br>
       * Note: Volume control may be ineffective on some platforms.
       * @zh
       * 音频的音量（大小范围为 0.0 到 1.0）。<br>
       * 请注意，在某些平台上，音量控制可能不起效。<br>
       */

    }, {
      key: "volume",
      set: function set(val) {
        if (isNaN(val)) {
          console.warn('illegal audio volume!');
          return;
        }

        val = (0, _index2.clamp)(val, 0, 1);

        if (this._clip) {
          this._clip.setVolume(val); // on some platform volume control may not be available


          this._volume = this._clip.getVolume();
        } else {
          this._volume = val;
        }
      },
      get: function get() {
        return this._volume;
      }
    }, {
      key: "currentTime",
      set: function set(num) {
        if (isNaN(num)) {
          console.warn('illegal audio time!');
          return;
        }

        num = (0, _index2.clamp)(num, 0, this.duration);
        this._cachedCurrentTime = num;

        if (!this._clip) {
          return;
        }

        this._clip.setCurrentTime(this._cachedCurrentTime);
      }
      /**
       * @en
       * Get the current playback time, in seconds.
       * @zh
       * 以秒为单位获取当前播放时间。
       */
      ,
      get: function get() {
        if (!this._clip) {
          return this._cachedCurrentTime;
        }

        return this._clip.getCurrentTime();
      }
      /**
       * @en
       * Get the audio duration, in seconds.
       * @zh
       * 获取以秒为单位的音频总时长。
       */

    }, {
      key: "duration",
      get: function get() {
        if (!this._clip) {
          return 0;
        }

        return this._clip.getDuration();
      }
      /**
       * @en
       * Get current audio state.
       * @zh
       * 获取当前音频状态。
       */

    }, {
      key: "state",
      get: function get() {
        if (!this._clip) {
          return _clip.AudioClip.PlayingState.INITIALIZING;
        }

        return this._clip.state;
      }
      /**
       * @en
       * Is the audio currently playing?
       * @zh
       * 当前音频是否正在播放？
       */

    }, {
      key: "playing",
      get: function get() {
        return this.state === _clip.AudioClip.PlayingState.PLAYING;
      }
    }]);

    return AudioSource;
  }(_component.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_clip", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_loop", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_playOnAwake", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_volume", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "clip", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "clip"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "loop", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "loop"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "playOnAwake", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "playOnAwake"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "volume", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "volume"), _class2.prototype)), _class2)) || _class) || _class) || _class);
  _exports.AudioSource = AudioSource;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2F1ZGlvL2F1ZGlvLXNvdXJjZS50cyJdLCJuYW1lcyI6WyJBdWRpb1NvdXJjZSIsIkF1ZGlvQ2xpcCIsIl9jYWNoZWRDdXJyZW50VGltZSIsIl9zeW5jU3RhdGVzIiwiX3BsYXlPbkF3YWtlIiwicGxheSIsInBhdXNlIiwic3RvcCIsIl9jbGlwIiwicGxheWluZyIsImN1cnJlbnRUaW1lIiwiY2xpcCIsInZvbHVtZVNjYWxlIiwicGxheU9uZVNob3QiLCJfdm9sdW1lIiwic2V0Q3VycmVudFRpbWUiLCJzZXRMb29wIiwiX2xvb3AiLCJzZXRWb2x1bWUiLCJnZXRWb2x1bWUiLCJ2YWwiLCJpc05hTiIsImNvbnNvbGUiLCJ3YXJuIiwibnVtIiwiZHVyYXRpb24iLCJnZXRDdXJyZW50VGltZSIsImdldER1cmF0aW9uIiwiUGxheWluZ1N0YXRlIiwiSU5JVElBTElaSU5HIiwic3RhdGUiLCJQTEFZSU5HIiwiQ29tcG9uZW50Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBOzs7Ozs7O01BVWFBLFcsV0FIWixvQkFBUSxnQkFBUixDLFVBQ0EsaUJBQUsscUJBQUwsQyxVQUNBLGlCQUFLLHdCQUFMLEMsVUFFSSxpQkFBS0MsZUFBTCxDLFVBaUJBLGlCQUFLQSxlQUFMLEMsVUFDQSxvQkFBUSxpQkFBUixDLFVBZUEsb0JBQVEsaUJBQVIsQyxVQW9CQSxvQkFBUSx3QkFBUixDLFVBZ0JBLGtCQUFNLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBTixDLFdBQ0Esb0JBQVEsbUJBQVIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBN0RPQyxrQixHQUFxQixDOzs7Ozs7K0JBNkVaO0FBQ2IsYUFBS0MsV0FBTDs7QUFDQSxZQUFJLEtBQUtDLFlBQVQsRUFBdUI7QUFBRSxlQUFLQyxJQUFMO0FBQWM7QUFDMUM7OztrQ0FF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QixHQUExQjs7QUFDQSxZQUFJLENBQUMsS0FBS2hCLEtBQVYsRUFBaUI7QUFBRTtBQUFTOztBQUM1QixhQUFLQSxLQUFMLENBQVdPLGNBQVgsQ0FBMEIsS0FBS2Isa0JBQS9CO0FBQ0g7QUFFRDs7Ozs7OzswQkFNbUI7QUFDZixZQUFJLENBQUMsS0FBS00sS0FBVixFQUFpQjtBQUFFLGlCQUFPLEtBQUtOLGtCQUFaO0FBQWlDOztBQUNwRCxlQUFPLEtBQUtNLEtBQUwsQ0FBV2tCLGNBQVgsRUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFNZ0I7QUFDWixZQUFJLENBQUMsS0FBS2xCLEtBQVYsRUFBaUI7QUFBRSxpQkFBTyxDQUFQO0FBQVc7O0FBQzlCLGVBQU8sS0FBS0EsS0FBTCxDQUFXbUIsV0FBWCxFQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQU1hO0FBQ1QsWUFBSSxDQUFDLEtBQUtuQixLQUFWLEVBQWlCO0FBQUUsaUJBQU9QLGdCQUFVMkIsWUFBVixDQUF1QkMsWUFBOUI7QUFBNkM7O0FBQ2hFLGVBQU8sS0FBS3JCLEtBQUwsQ0FBV3NCLEtBQWxCO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQU1lO0FBQ1gsZUFBTyxLQUFLQSxLQUFMLEtBQWU3QixnQkFBVTJCLFlBQVYsQ0FBdUJHLE9BQTdDO0FBQ0g7Ozs7SUExTjRCQyxvQjs7Ozs7YUFFTyxJOzs0RUFDbkNDLG1COzs7OzthQUNpQixLOzttRkFDakJBLG1COzs7OzthQUN3QixJOzs4RUFDeEJBLG1COzs7OzthQUNtQixDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29tcG9uZW50L2F1ZGlvXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29yZS9jb21wb25lbnRzL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIG1lbnUsIHRvb2x0aXAsIHR5cGUsIHJhbmdlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IEF1ZGlvQ2xpcCB9IGZyb20gJy4vYXNzZXRzL2NsaXAnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGEgc2luZ2xlIGF1ZGlvIHNvdXJjZSwgPGJyPlxyXG4gKiBjb250YWlucyBiYXNpYyBmdW5jdGlvbmFsaXRpZXMgbGlrZSBwbGF5LCBwYXVzZSBhbmQgc3RvcC5cclxuICogQHpoXHJcbiAqIOmfs+mikee7hOS7tu+8jOS7o+ihqOWNleS4qumfs+a6kO+8jOaPkOS+m+aSreaUvuOAgeaaguWBnOOAgeWBnOatouetieWfuuacrOWKn+iDveOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkF1ZGlvU291cmNlJylcclxuQGhlbHAoJ2kxOG46Y2MuQXVkaW9Tb3VyY2UnKVxyXG5AbWVudSgnQ29tcG9uZW50cy9BdWRpb1NvdXJjZScpXHJcbmV4cG9ydCBjbGFzcyBBdWRpb1NvdXJjZSBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICBAdHlwZShBdWRpb0NsaXApXHJcbiAgICBwcm90ZWN0ZWQgX2NsaXA6IEF1ZGlvQ2xpcCB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9sb29wID0gZmFsc2U7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3BsYXlPbkF3YWtlID0gdHJ1ZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdm9sdW1lID0gMTtcclxuXHJcbiAgICBwcml2YXRlIF9jYWNoZWRDdXJyZW50VGltZSA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBkZWZhdWx0IEF1ZGlvQ2xpcCB0byBiZSBwbGF5ZWQgZm9yIHRoaXMgYXVkaW8gc291cmNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7lrpropoHmkq3mlL7nmoTpn7PpopHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQXVkaW9DbGlwKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46YXVkaW8uY2xpcCcpXHJcbiAgICBzZXQgY2xpcCAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fY2xpcCA9IHZhbDtcclxuICAgICAgICB0aGlzLl9zeW5jU3RhdGVzKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgY2xpcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaXA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElzIGxvb3BpbmcgZW5hYmxlZCBmb3IgdGhpcyBhdWRpbyBzb3VyY2U/XHJcbiAgICAgKiBAemhcclxuICAgICAqIOaYr+WQpuW+queOr+aSreaUvumfs+mike+8n1xyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgnaTE4bjphdWRpby5sb29wJylcclxuICAgIHNldCBsb29wICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9sb29wID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9jbGlwKSB7IHRoaXMuX2NsaXAuc2V0TG9vcCh2YWwpOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgbG9vcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvb3A7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElzIHRoZSBhdXRvcGxheSBlbmFibGVkPyA8YnI+XHJcbiAgICAgKiBOb3RlIHRoYXQgZm9yIG1vc3QgcGxhdGZvcm0gYXV0b3BsYXkgd2lsbCBvbmx5IHN0YXJ0IDxicj5cclxuICAgICAqIGFmdGVyIGEgdXNlciBnZXN0dXJlIGlzIHJlY2VpdmVkLCBhY2NvcmRpbmcgdG8gdGhlIGxhdGVzdCBhdXRvcGxheSBwb2xpY3k6IDxicj5cclxuICAgICAqIGh0dHBzOi8vd3d3LmNocm9taXVtLm9yZy9hdWRpby12aWRlby9hdXRvcGxheVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblkK/nlKjoh6rliqjmkq3mlL7jgIIgPGJyPlxyXG4gICAgICog6K+35rOo5oSP77yM5qC55o2u5pyA5paw55qE6Ieq5Yqo5pKt5pS+562W55Wl77yM546w5Zyo5a+55aSn5aSa5pWw5bmz5Y+w77yM6Ieq5Yqo5pKt5pS+5Y+q5Lya5Zyo56ys5LiA5qyh5pS25Yiw55So5oi36L6T5YWl5ZCO55Sf5pWI44CCIDxicj5cclxuICAgICAqIOWPguiAg++8mmh0dHBzOi8vd3d3LmNocm9taXVtLm9yZy9hdWRpby12aWRlby9hdXRvcGxheVxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgnaTE4bjphdWRpby5wbGF5T25Bd2FrZScpXHJcbiAgICBzZXQgcGxheU9uQXdha2UgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3BsYXlPbkF3YWtlID0gdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IHBsYXlPbkF3YWtlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGxheU9uQXdha2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB2b2x1bWUgb2YgdGhpcyBhdWRpbyBzb3VyY2UgKDAuMCB0byAxLjApLjxicj5cclxuICAgICAqIE5vdGU6IFZvbHVtZSBjb250cm9sIG1heSBiZSBpbmVmZmVjdGl2ZSBvbiBzb21lIHBsYXRmb3Jtcy5cclxuICAgICAqIEB6aFxyXG4gICAgICog6Z+z6aKR55qE6Z+z6YeP77yI5aSn5bCP6IyD5Zu05Li6IDAuMCDliLAgMS4w77yJ44CCPGJyPlxyXG4gICAgICog6K+35rOo5oSP77yM5Zyo5p+Q5Lqb5bmz5Y+w5LiK77yM6Z+z6YeP5o6n5Yi25Y+v6IO95LiN6LW35pWI44CCPGJyPlxyXG4gICAgICovXHJcbiAgICBAcmFuZ2UoWzAuMCwgMS4wXSlcclxuICAgIEB0b29sdGlwKCdpMThuOmF1ZGlvLnZvbHVtZScpXHJcbiAgICBzZXQgdm9sdW1lICh2YWwpIHtcclxuICAgICAgICBpZiAoaXNOYU4odmFsKSkgeyBjb25zb2xlLndhcm4oJ2lsbGVnYWwgYXVkaW8gdm9sdW1lIScpOyByZXR1cm47IH1cclxuICAgICAgICB2YWwgPSBjbGFtcCh2YWwsIDAsIDEpO1xyXG4gICAgICAgIGlmICh0aGlzLl9jbGlwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NsaXAuc2V0Vm9sdW1lKHZhbCk7XHJcbiAgICAgICAgICAgIC8vIG9uIHNvbWUgcGxhdGZvcm0gdm9sdW1lIGNvbnRyb2wgbWF5IG5vdCBiZSBhdmFpbGFibGVcclxuICAgICAgICAgICAgdGhpcy5fdm9sdW1lID0gdGhpcy5fY2xpcC5nZXRWb2x1bWUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl92b2x1bWUgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0IHZvbHVtZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICB0aGlzLl9zeW5jU3RhdGVzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BsYXlPbkF3YWtlKSB7IHRoaXMucGxheSgpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5wYXVzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQbGF5IHRoZSBjbGlwLjxicj5cclxuICAgICAqIFJlc3RhcnQgaWYgYWxyZWFkeSBwbGF5aW5nLjxicj5cclxuICAgICAqIFJlc3VtZSBpZiBwYXVzZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW8gOWni+aSreaUvuOAgjxicj5cclxuICAgICAqIOWmguaenOmfs+mikeWkhOS6juato+WcqOaSreaUvueKtuaAge+8jOWwhuS8mumHjeaWsOW8gOWni+aSreaUvumfs+mikeOAgjxicj5cclxuICAgICAqIOWmguaenOmfs+mikeWkhOS6juaaguWBnOeKtuaAge+8jOWImeS8mue7p+e7reaSreaUvumfs+mikeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGxheSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jbGlwKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmICh0aGlzLnBsYXlpbmcpIHsgdGhpcy5jdXJyZW50VGltZSA9IDA7IH1cclxuICAgICAgICBlbHNlIHsgdGhpcy5fY2xpcC5wbGF5KCk7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUGF1c2UgdGhlIGNsaXAuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaaguWBnOaSreaUvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGF1c2UgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY2xpcCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9jbGlwLnBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFN0b3AgdGhlIGNsaXAuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWBnOatouaSreaUvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RvcCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jbGlwKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX2NsaXAuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQbGF5cyBhbiBBdWRpb0NsaXAsIGFuZCBzY2FsZXMgdm9sdW1lIGJ5IHZvbHVtZVNjYWxlLjxicj5cclxuICAgICAqIE5vdGU6IGZvciBtdWx0aXBsZSBwbGF5YmFjayBvbiB0aGUgc2FtZSBjbGlwLCB0aGUgYWN0dWFsIGJlaGF2aW9yIGlzIHBsYXRmb3JtLXNwZWNpZmljLjxicj5cclxuICAgICAqIFJlLXN0YXJ0IHN0eWxlIGZhbGxiYWNrIHdpbGwgYmUgdXNlZCBpZiB0aGUgdW5kZXJseWluZyBwbGF0Zm9ybSBkb2Vzbid0IHN1cHBvcnQgaXQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS7peaMh+Wumumfs+mHj+aSreaUvuS4gOS4qumfs+mikeS4gOasoeOAgjxicj5cclxuICAgICAqIOazqOaEj++8jOWvueWQjOS4gOS4qumfs+mikeeJh+aute+8jOS4jeWQjOW5s+WPsOWkmumHjeaSreaUvuaViOaenOWtmOWcqOW3ruW8guOAgjxicj5cclxuICAgICAqIOWvueS4jeaUr+aMgeeahOW5s+WPsO+8jOWmguWJjeS4gOasoeWwmuacquaSreWujO+8jOWImeS8mueri+WNs+mHjeaWsOaSreaUvuOAglxyXG4gICAgICogQHBhcmFtIGNsaXAgVGhlIGF1ZGlvIGNsaXAgdG8gYmUgcGxheWVkLlxyXG4gICAgICogQHBhcmFtIHZvbHVtZVNjYWxlIHZvbHVtZSBzY2FsaW5nIGZhY3RvciB3cnQuIGN1cnJlbnQgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwbGF5T25lU2hvdCAoY2xpcDogQXVkaW9DbGlwLCB2b2x1bWVTY2FsZSA9IDEpIHtcclxuICAgICAgICBjbGlwLnBsYXlPbmVTaG90KHRoaXMuX3ZvbHVtZSAqIHZvbHVtZVNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3N5bmNTdGF0ZXMgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY2xpcCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9jbGlwLnNldEN1cnJlbnRUaW1lKHRoaXMuX2NhY2hlZEN1cnJlbnRUaW1lKTtcclxuICAgICAgICB0aGlzLl9jbGlwLnNldExvb3AodGhpcy5fbG9vcCk7XHJcbiAgICAgICAgdGhpcy5fY2xpcC5zZXRWb2x1bWUodGhpcy5fdm9sdW1lLCB0cnVlKTtcclxuICAgICAgICB0aGlzLl92b2x1bWUgPSB0aGlzLl9jbGlwLmdldFZvbHVtZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXQgY3VycmVudCBwbGF5YmFjayB0aW1lLCBpbiBzZWNvbmRzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDku6Xnp5LkuLrljZXkvY3orr7nva7lvZPliY3mkq3mlL7ml7bpl7TjgIJcclxuICAgICAqIEBwYXJhbSBudW0gcGxheWJhY2sgdGltZSB0byBqdW1wIHRvLlxyXG4gICAgICovXHJcbiAgICBzZXQgY3VycmVudFRpbWUgKG51bTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGlzTmFOKG51bSkpIHsgY29uc29sZS53YXJuKCdpbGxlZ2FsIGF1ZGlvIHRpbWUhJyk7IHJldHVybjsgfVxyXG4gICAgICAgIG51bSA9IGNsYW1wKG51bSwgMCwgdGhpcy5kdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy5fY2FjaGVkQ3VycmVudFRpbWUgPSBudW07XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jbGlwKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX2NsaXAuc2V0Q3VycmVudFRpbWUodGhpcy5fY2FjaGVkQ3VycmVudFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcGxheWJhY2sgdGltZSwgaW4gc2Vjb25kcy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Lul56eS5Li65Y2V5L2N6I635Y+W5b2T5YmN5pKt5pS+5pe26Ze044CCXHJcbiAgICAgKi9cclxuICAgIGdldCBjdXJyZW50VGltZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jbGlwKSB7IHJldHVybiB0aGlzLl9jYWNoZWRDdXJyZW50VGltZTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGlwLmdldEN1cnJlbnRUaW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCB0aGUgYXVkaW8gZHVyYXRpb24sIGluIHNlY29uZHMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluS7peenkuS4uuWNleS9jeeahOmfs+mikeaAu+aXtumVv+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgZHVyYXRpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY2xpcCkgeyByZXR1cm4gMDsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGlwLmdldER1cmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCBjdXJyZW50IGF1ZGlvIHN0YXRlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvZPliY3pn7PpopHnirbmgIHjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHN0YXRlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NsaXApIHsgcmV0dXJuIEF1ZGlvQ2xpcC5QbGF5aW5nU3RhdGUuSU5JVElBTElaSU5HOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaXAuc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElzIHRoZSBhdWRpbyBjdXJyZW50bHkgcGxheWluZz9cclxuICAgICAqIEB6aFxyXG4gICAgICog5b2T5YmN6Z+z6aKR5piv5ZCm5q2j5Zyo5pKt5pS+77yfXHJcbiAgICAgKi9cclxuICAgIGdldCBwbGF5aW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQXVkaW9DbGlwLlBsYXlpbmdTdGF0ZS5QTEFZSU5HO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==