(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/platform/index.js", "../core/components/index.js", "../core/components/ui-base/index.js", "../core/data/decorators/index.js", "../core/math/index.js", "./assets/video-clip.js", "./video-player-impl-web.js", "./video-player-enums.js", "../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/platform/index.js"), require("../core/components/index.js"), require("../core/components/ui-base/index.js"), require("../core/data/decorators/index.js"), require("../core/math/index.js"), require("./assets/video-clip.js"), require("./video-player-impl-web.js"), require("./video-player-enums.js"), require("../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.index, global.videoClip, global.videoPlayerImplWeb, global.videoPlayerEnums, global.defaultConstants);
    global.videoPlayer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _index5, _videoClip, _videoPlayerImplWeb, _videoPlayerEnums, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VideoPlayer = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _class3, _temp;

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
   * VideoPlayer is a component for playing videos, you can use it for showing videos in your game.
   * Because different platforms have different authorization, API and control methods for VideoPlayer component.
   * And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
   * @zh
   * Video 组件，用于在游戏中播放视频。
   * 由于不同平台对于 VideoPlayer 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。
   */
  var VideoPlayer = (_dec = (0, _index4.ccclass)('cc.VideoPlayer'), _dec2 = (0, _index4.help)('i18n:cc.VideoPlayer'), _dec3 = (0, _index4.menu)('Components/VideoPlayer'), _dec4 = (0, _index4.requireComponent)(_index3.UITransform), _dec5 = (0, _index4.type)(_videoClip.VideoClip), _dec6 = (0, _index4.type)(_videoPlayerEnums.ResourceType), _dec7 = (0, _index4.tooltip)('i18n:videoplayer.resourceType'), _dec8 = (0, _index4.tooltip)('i18n:videoplayer.remoteURL'), _dec9 = (0, _index4.type)(_videoClip.VideoClip), _dec10 = (0, _index4.tooltip)('i18n:videoplayer.clip'), _dec11 = (0, _index4.tooltip)('i18n:videoplayer.playOnAwake'), _dec12 = (0, _index4.range)([0.0, 10, 1.0]), _dec13 = (0, _index4.tooltip)('i18n:videoplayer.playbackRate'), _dec14 = (0, _index4.range)([0.0, 1.0, 0.1]), _dec15 = (0, _index4.tooltip)('i18n:videoplayer.volume'), _dec16 = (0, _index4.tooltip)('i18n:videoplayer.mute'), _dec17 = (0, _index4.tooltip)('i18n:videoplayer.loop'), _dec18 = (0, _index4.tooltip)('i18n:videoplayer.keepAspectRatio'), _dec19 = (0, _index4.tooltip)('i18n:videoplayer.fullScreenOnAwake'), _dec20 = (0, _index4.tooltip)('i18n:videoplayer.stayOnBottom'), _dec21 = (0, _index4.type)([_index2.EventHandler]), _dec22 = (0, _index4.displayOrder)(20), _dec23 = (0, _index4.tooltip)('i18n:videoplayer.videoPlayerEvent'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index4.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(VideoPlayer, _Component);

    function VideoPlayer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, VideoPlayer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(VideoPlayer)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_resourceType", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_remoteURL", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_clip", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_playOnAwake", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_volume", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_mute", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_playbackRate", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_loop", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_controls", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fullScreenOnAwake", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_stayOnBottom", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_keepAspectRatio", _descriptor12, _assertThisInitialized(_this));

      _this._impl = void 0;
      _this._cachedCurrentTime = 0;

      _initializerDefineProperty(_this, "videoPlayerEvent", _descriptor13, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(VideoPlayer, [{
      key: "syncSource",
      value: function syncSource() {
        if (!this._impl) {
          return;
        }

        if (this._resourceType === _videoPlayerEnums.ResourceType.REMOTE) {
          this._impl.syncURL(this._remoteURL);
        } else {
          this._impl.syncClip(this._clip);
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        if (_defaultConstants.EDITOR) {
          return;
        }

        this._impl = new _videoPlayerImplWeb.VideoPlayerImpl(this);
        this.syncSource();

        if (this.nativeVideo) {
          this.nativeVideo.loop = this._loop;
          this.nativeVideo.volume = this._volume;
          this.nativeVideo.muted = this._mute;
          this.nativeVideo.playbackRate = this._playbackRate;
          this.nativeVideo.currentTime = this._cachedCurrentTime;
          this.nativeVideo.controls = this._controls;
        }

        this._impl.syncStayOnBottom(this._stayOnBottom);

        this._impl.syncKeepAspectRatio(this._keepAspectRatio);

        this._impl.syncFullScreenOnAwake(this._fullScreenOnAwake); //


        this._impl.eventList.set(_videoPlayerEnums.EventType.META_LOADED, this.onMetaLoaded.bind(this));

        this._impl.eventList.set(_videoPlayerEnums.EventType.READY_TO_PLAY, this.onReadyToPlay.bind(this));

        this._impl.eventList.set(_videoPlayerEnums.EventType.PLAYING, this.onPlaying.bind(this));

        this._impl.eventList.set(_videoPlayerEnums.EventType.PAUSED, this.onPasued.bind(this));

        this._impl.eventList.set(_videoPlayerEnums.EventType.STOPPED, this.onStopped.bind(this));

        this._impl.eventList.set(_videoPlayerEnums.EventType.COMPLETED, this.onCompleted.bind(this));

        this._impl.eventList.set(_videoPlayerEnums.EventType.ERROR, this.onError.bind(this));

        if (this._playOnAwake && this._impl.loaded) {
          this.play();
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._impl) {
          this._impl.enable();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._impl) {
          this._impl.disable();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._impl) {
          this._impl.destroy();

          this._impl = null;
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        if (this._impl) {
          this._impl.syncMatrix();
        }
      }
    }, {
      key: "onMetaLoaded",
      value: function onMetaLoaded() {
        _index2.EventHandler.emitEvents(this.videoPlayerEvent, this, _videoPlayerEnums.EventType.META_LOADED);

        this.node.emit('meta-loaded', this);
      }
    }, {
      key: "onReadyToPlay",
      value: function onReadyToPlay() {
        if (this._playOnAwake && !this.isPlaying) {
          this.play();
        }

        _index2.EventHandler.emitEvents(this.videoPlayerEvent, this, _videoPlayerEnums.EventType.READY_TO_PLAY);

        this.node.emit('ready-to-play', this);
      }
    }, {
      key: "onPlaying",
      value: function onPlaying() {
        _index2.EventHandler.emitEvents(this.videoPlayerEvent, this, _videoPlayerEnums.EventType.PLAYING);

        this.node.emit('playing', this);
      }
    }, {
      key: "onPasued",
      value: function onPasued() {
        _index2.EventHandler.emitEvents(this.videoPlayerEvent, this, _videoPlayerEnums.EventType.PAUSED);

        this.node.emit('paused', this);
      }
    }, {
      key: "onStopped",
      value: function onStopped() {
        _index2.EventHandler.emitEvents(this.videoPlayerEvent, this, _videoPlayerEnums.EventType.STOPPED);

        this.node.emit('stopped', this);
      }
    }, {
      key: "onCompleted",
      value: function onCompleted() {
        _index2.EventHandler.emitEvents(this.videoPlayerEvent, this, _videoPlayerEnums.EventType.COMPLETED);

        this.node.emit('completed', this);
      }
    }, {
      key: "onError",
      value: function onError() {
        _index2.EventHandler.emitEvents(this.videoPlayerEvent, this, _videoPlayerEnums.EventType.ERROR);

        this.node.emit('error', this);
      }
      /**
       * @en
       * Play the clip.<br>
       * Restart if already playing.<br>
       * Resume if paused.
       * @zh
       * 开始播放。<br>
       * 如果视频处于正在播放状态，将会重新开始播放视频。<br>
       * 如果视频处于暂停状态，则会继续播放视频。
       */

    }, {
      key: "play",
      value: function play() {
        if (this._impl) {
          this._impl.play();
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
        if (this._impl) {
          this._impl.pause();
        }
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
        if (this._impl) {
          this._impl.stop();
        }
      }
    }, {
      key: "resourceType",

      /**
       * @en
       * The resource type of video player, REMOTE for remote url and LOCAL for local file path.
       * @zh
       * 视频来源：REMOTE 表示远程视频 URL，LOCAL 表示本地视频地址。
       */
      get: function get() {
        return this._resourceType;
      },
      set: function set(val) {
        if (this._resourceType !== val) {
          this._resourceType = val;
          this.syncSource();
        }
      }
      /**
       * @en
       * The remote URL of video.
       * @zh
       * 远程视频的 URL
       */

    }, {
      key: "remoteURL",
      get: function get() {
        return this._remoteURL;
      },
      set: function set(val) {
        if (this._remoteURL !== val) {
          this._remoteURL = val;
          this.syncSource();
        }
      }
      /**
       * @en
       * The local video clip
       * @zh
       * 本地视频剪辑。
       */

    }, {
      key: "clip",
      get: function get() {
        return this._clip;
      },
      set: function set(val) {
        if (this._clip !== val) {
          this._clip = val;
          this.syncSource();
        }
      }
      /**
       * @en
       * Whether the video start playing automatically after loaded?
       * @zh
       * 视频加载后是否自动开始播放？
       */

    }, {
      key: "playOnAwake",
      get: function get() {
        return this._playOnAwake;
      },
      set: function set(value) {
        this._playOnAwake = value;
      }
      /**
       * @en
       * The Video playback rate
       * @zh
       * 视频播放时的速率（0.0 ~ 10.0）
       */

    }, {
      key: "playbackRate",
      get: function get() {
        return this._playbackRate;
      },
      set: function set(value) {
        this._playbackRate = value;

        if (this.nativeVideo) {
          this.nativeVideo.playbackRate = value;
        }
      }
      /**
       * @en
       * The volume of the video.
       * @zh
       * 视频的音量（0.0 ~ 1.0）
       */

    }, {
      key: "volume",
      get: function get() {
        return this._volume;
      },
      set: function set(value) {
        this._volume = value;

        if (this.nativeVideo) {
          this.nativeVideo.volume = value;
        }
      }
      /**
       * @en
       * Mutes the VideoPlayer. Mute sets the volume=0, Un-Mute restore the original volume.
       * @zh
       * 是否静音视频。静音时设置音量为 0，取消静音是恢复原来的音量。
       */

    }, {
      key: "mute",
      get: function get() {
        return this._mute;
      },
      set: function set(value) {
        this._mute = value;

        if (this.nativeVideo) {
          this.nativeVideo.mute = value;
        }
      }
      /**
       * @en
       * Whether the video should be played again at the end
       * @zh
       * 视频是否应在结束时再次播放
       */

    }, {
      key: "loop",
      get: function get() {
        return this._loop;
      },
      set: function set(value) {
        this._loop = value;

        if (this.nativeVideo) {
          this.nativeVideo.loop = value;
        }
      }
      /**
       * @en
       * Whether keep the aspect ration of the original video.
       * @zh
       * 是否保持视频原来的宽高比
       */

    }, {
      key: "keepAspectRatio",
      get: function get() {
        return this._keepAspectRatio;
      },
      set: function set(value) {
        if (this._keepAspectRatio !== value) {
          this._keepAspectRatio = value;

          if (this._impl) {
            this._impl.syncKeepAspectRatio(value);
          }
        }
      }
      /**
       * @en
       * Whether play video in fullscreen mode.
       * @zh
       * 是否全屏播放视频
       */

    }, {
      key: "fullScreenOnAwake",
      get: function get() {
        if (!_defaultConstants.EDITOR) {
          this._fullScreenOnAwake = this._impl && this._impl.fullScreenOnAwake;
        }

        return this._fullScreenOnAwake;
      },
      set: function set(value) {
        if (this._fullScreenOnAwake !== value) {
          this._fullScreenOnAwake = value;

          if (this._impl) {
            this._impl.syncFullScreenOnAwake(value);
          }
        }
      }
      /**
       * @en
       * Always below the game view (only useful on Web. Note: The specific effects are not guaranteed to be consistent, depending on whether each browser supports or restricts).
       * @zh
       * 永远在游戏视图最底层（这个属性只有在 Web 平台上有效果。注意：具体效果无法保证一致，跟各个浏览器是否支持与限制有关）
       */

    }, {
      key: "stayOnBottom",
      get: function get() {
        return this._stayOnBottom;
      },
      set: function set(value) {
        if (this._stayOnBottom !== value) {
          this._stayOnBottom = value;

          if (this._impl) {
            this._impl.syncStayOnBottom(value);
          }
        }
      }
    }, {
      key: "nativeVideo",

      /**
       * @en
       * Raw video objects for user customization
       * @zh
       * 原始视频对象，用于用户定制
       */
      get: function get() {
        return this._impl && this._impl.video || null;
      }
      /**
       * @en
       * Whether to display the video control bar
       * @zh
       * 是否显示视频控制栏
       */

    }, {
      key: "controls",
      get: function get() {
        return this._controls;
      },
      set: function set(value) {
        this._controls = value;

        if (this.nativeVideo) {
          this.nativeVideo.controls = value;
        }
      }
      /**
       * @en
       * The current playback time of the now playing item in seconds, you could also change the start playback time.
       * @zh
       * 指定视频从什么时间点开始播放，单位是秒，也可以用来获取当前视频播放的时间进度。
       */

    }, {
      key: "currentTime",
      get: function get() {
        if (!this.nativeVideo) {
          return this._cachedCurrentTime;
        }

        return this.nativeVideo.currentTime;
      },
      set: function set(val) {
        if (isNaN(val)) {
          (0, _index.warn)('illegal video time!');
          return;
        }

        val = (0, _index5.clamp)(val, 0, this.duration);
        this._cachedCurrentTime = val;

        if (this.nativeVideo) {
          this.nativeVideo.currentTime = val;
        }
      }
      /**
       * @en
       * Get the audio duration, in seconds.
       * @zh
       * 获取以秒为单位的视频总时长。
       */

    }, {
      key: "duration",
      get: function get() {
        if (!this.nativeVideo) {
          return 0;
        }

        return this.nativeVideo.duration;
      }
      /**
       * @en
       * Get current audio state.
       * @zh
       * 获取当前视频状态。
       */

    }, {
      key: "state",
      get: function get() {
        if (!this._impl) {
          return _videoPlayerEnums.EventType.NONE;
        }

        return this._impl.state;
      }
      /**
       * @en
       * Is the audio currently playing?
       * @zh
       * 当前视频是否正在播放？
       */

    }, {
      key: "isPlaying",
      get: function get() {
        return this.state === _videoPlayerEnums.EventType.PLAYING;
      }
    }]);

    return VideoPlayer;
  }(_index2.Component), _class3.EventType = _videoPlayerEnums.EventType, _class3.ResourceType = _videoPlayerEnums.ResourceType, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_resourceType", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _videoPlayerEnums.ResourceType.LOCAL;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_remoteURL", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_clip", [_dec5, _index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_playOnAwake", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_volume", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1.0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_mute", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_playbackRate", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_loop", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_controls", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_fullScreenOnAwake", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_stayOnBottom", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_keepAspectRatio", [_index4.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "resourceType", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "resourceType"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "remoteURL", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "remoteURL"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clip", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "clip"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "playOnAwake", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "playOnAwake"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "playbackRate", [_index4.slide, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "playbackRate"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "volume", [_index4.slide, _dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "volume"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "mute", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "mute"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "loop", [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "loop"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "keepAspectRatio", [_dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "keepAspectRatio"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fullScreenOnAwake", [_dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "fullScreenOnAwake"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "stayOnBottom", [_dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "stayOnBottom"), _class2.prototype), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "videoPlayerEvent", [_index4.serializable, _dec21, _dec22, _dec23], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.VideoPlayer = VideoPlayer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3ZpZGVvL3ZpZGVvLXBsYXllci50cyJdLCJuYW1lcyI6WyJWaWRlb1BsYXllciIsIlVJVHJhbnNmb3JtIiwiVmlkZW9DbGlwIiwiUmVzb3VyY2VUeXBlIiwiQ29tcG9uZW50RXZlbnRIYW5kbGVyIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfaW1wbCIsIl9jYWNoZWRDdXJyZW50VGltZSIsIl9yZXNvdXJjZVR5cGUiLCJSRU1PVEUiLCJzeW5jVVJMIiwiX3JlbW90ZVVSTCIsInN5bmNDbGlwIiwiX2NsaXAiLCJFRElUT1IiLCJWaWRlb1BsYXllckltcGwiLCJzeW5jU291cmNlIiwibmF0aXZlVmlkZW8iLCJsb29wIiwiX2xvb3AiLCJ2b2x1bWUiLCJfdm9sdW1lIiwibXV0ZWQiLCJfbXV0ZSIsInBsYXliYWNrUmF0ZSIsIl9wbGF5YmFja1JhdGUiLCJjdXJyZW50VGltZSIsImNvbnRyb2xzIiwiX2NvbnRyb2xzIiwic3luY1N0YXlPbkJvdHRvbSIsIl9zdGF5T25Cb3R0b20iLCJzeW5jS2VlcEFzcGVjdFJhdGlvIiwiX2tlZXBBc3BlY3RSYXRpbyIsInN5bmNGdWxsU2NyZWVuT25Bd2FrZSIsIl9mdWxsU2NyZWVuT25Bd2FrZSIsImV2ZW50TGlzdCIsInNldCIsIkV2ZW50VHlwZSIsIk1FVEFfTE9BREVEIiwib25NZXRhTG9hZGVkIiwiYmluZCIsIlJFQURZX1RPX1BMQVkiLCJvblJlYWR5VG9QbGF5IiwiUExBWUlORyIsIm9uUGxheWluZyIsIlBBVVNFRCIsIm9uUGFzdWVkIiwiU1RPUFBFRCIsIm9uU3RvcHBlZCIsIkNPTVBMRVRFRCIsIm9uQ29tcGxldGVkIiwiRVJST1IiLCJvbkVycm9yIiwiX3BsYXlPbkF3YWtlIiwibG9hZGVkIiwicGxheSIsImVuYWJsZSIsImRpc2FibGUiLCJkZXN0cm95IiwiZHQiLCJzeW5jTWF0cml4IiwiZW1pdEV2ZW50cyIsInZpZGVvUGxheWVyRXZlbnQiLCJub2RlIiwiZW1pdCIsImlzUGxheWluZyIsInBhdXNlIiwic3RvcCIsInZhbCIsInZhbHVlIiwibXV0ZSIsImZ1bGxTY3JlZW5PbkF3YWtlIiwidmlkZW8iLCJpc05hTiIsImR1cmF0aW9uIiwiTk9ORSIsInN0YXRlIiwiQ29tcG9uZW50Iiwic2VyaWFsaXphYmxlIiwiTE9DQUwiLCJzbGlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQTs7Ozs7Ozs7O01BY2FBLFcsV0FMWixxQkFBUSxnQkFBUixDLFVBQ0Esa0JBQUsscUJBQUwsQyxVQUNBLGtCQUFLLHdCQUFMLEMsVUFDQSw4QkFBaUJDLG1CQUFqQixDLFVBT0ksa0JBQUtDLG9CQUFMLEMsVUErQkEsa0JBQUtDLDhCQUFMLEMsVUFDQSxxQkFBUSwrQkFBUixDLFVBaUJBLHFCQUFRLDRCQUFSLEMsVUFpQkEsa0JBQUtELG9CQUFMLEMsV0FDQSxxQkFBUSx1QkFBUixDLFdBaUJBLHFCQUFRLDhCQUFSLEMsV0FlQSxtQkFBTSxDQUFDLEdBQUQsRUFBTSxFQUFOLEVBQVUsR0FBVixDQUFOLEMsV0FDQSxxQkFBUSwrQkFBUixDLFdBa0JBLG1CQUFNLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLENBQU4sQyxXQUNBLHFCQUFRLHlCQUFSLEMsV0FpQkEscUJBQVEsdUJBQVIsQyxXQWlCQSxxQkFBUSx1QkFBUixDLFdBaUJBLHFCQUFRLGtDQUFSLEMsV0FtQkEscUJBQVEsb0NBQVIsQyxXQXNCQSxxQkFBUSwrQkFBUixDLFdBdUJBLGtCQUFLLENBQUNFLG9CQUFELENBQUwsQyxXQUNBLDBCQUFhLEVBQWIsQyxXQUNBLHFCQUFRLG1DQUFSLEMsaUVBbFBKQyx5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQTRCYUMsSztZQUNBQyxrQixHQUFxQixDOzs7Ozs7Ozs7bUNBcVNQO0FBQ3BCLFlBQUksQ0FBQyxLQUFLRCxLQUFWLEVBQWlCO0FBQUU7QUFBUzs7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LDRCQUFVTSxPQUFoQztBQUNIOzs7O0lBL1Q0QmtDLGlCLFdBcU9meEMsUyxHQUFZQSwyQixVQUNabEMsWSxHQUFlQSw4Qix3RkFyTzVCMkUsb0I7Ozs7O2FBQ3lCM0UsK0JBQWE0RSxLOztpRkFDdENELG9COzs7OzthQUNzQixFOzttRkFFdEJBLG9COzs7OzthQUNtQyxJOzttRkFDbkNBLG9COzs7OzthQUN3QixJOzs4RUFDeEJBLG9COzs7OzthQUNtQixHOzs0RUFDbkJBLG9COzs7OzthQUNpQixLOztvRkFDakJBLG9COzs7OzthQUN5QixDOzs0RUFDekJBLG9COzs7OzthQUNpQixLOztnRkFDakJBLG9COzs7OzthQUNxQixLOzswRkFDckJBLG9COzs7OzthQUM4QixLOztxRkFDOUJBLG9COzs7OzthQUN5QixLOzt3RkFDekJBLG9COzs7OzthQUM0QixJOztvckJBOEU1QkUsYSxtS0FtQkFBLGEsazhCQW9IQUYsb0I7Ozs7O2FBSWtELEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb21wb25lbnQvdmlkZW9cclxuICovXHJcblxyXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi4vY29yZS9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRIYW5kbGVyIGFzIENvbXBvbmVudEV2ZW50SGFuZGxlciB9IGZyb20gJy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtIH0gZnJvbSAnLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBkaXNwbGF5T3JkZXIsIGV4ZWN1dGVJbkVkaXRNb2RlLCBoZWxwLCBtZW51LCBzbGlkZSwgcmFuZ2UsIHJlcXVpcmVDb21wb25lbnQsIHRvb2x0aXAsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IGNsYW1wIH0gZnJvbSAnLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgVmlkZW9DbGlwIH0gZnJvbSAnLi9hc3NldHMvdmlkZW8tY2xpcCc7XHJcbmltcG9ydCB7IFZpZGVvUGxheWVySW1wbCB9IGZyb20gJy4vdmlkZW8tcGxheWVyLWltcGwtd2ViJztcclxuaW1wb3J0IHsgRXZlbnRUeXBlLCBSZXNvdXJjZVR5cGUgfSBmcm9tICcuL3ZpZGVvLXBsYXllci1lbnVtcyc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFZpZGVvUGxheWVyIGlzIGEgY29tcG9uZW50IGZvciBwbGF5aW5nIHZpZGVvcywgeW91IGNhbiB1c2UgaXQgZm9yIHNob3dpbmcgdmlkZW9zIGluIHlvdXIgZ2FtZS5cclxuICogQmVjYXVzZSBkaWZmZXJlbnQgcGxhdGZvcm1zIGhhdmUgZGlmZmVyZW50IGF1dGhvcml6YXRpb24sIEFQSSBhbmQgY29udHJvbCBtZXRob2RzIGZvciBWaWRlb1BsYXllciBjb21wb25lbnQuXHJcbiAqIEFuZCBoYXZlIG5vdCB5ZXQgZm9ybWVkIGEgdW5pZmllZCBzdGFuZGFyZCwgb25seSBXZWIsIGlPUywgYW5kIEFuZHJvaWQgcGxhdGZvcm1zIGFyZSBjdXJyZW50bHkgc3VwcG9ydGVkLlxyXG4gKiBAemhcclxuICogVmlkZW8g57uE5Lu277yM55So5LqO5Zyo5ri45oiP5Lit5pKt5pS+6KeG6aKR44CCXHJcbiAqIOeUseS6juS4jeWQjOW5s+WPsOWvueS6jiBWaWRlb1BsYXllciDnu4Tku7bnmoTmjojmnYPjgIFBUEnjgIHmjqfliLbmlrnlvI/pg73kuI3lkIzvvIzov5jmsqHmnInlvaLmiJDnu5/kuIDnmoTmoIflh4bvvIzmiYDku6Xnm67liY3lj6rmlK/mjIEgV2Vi44CBaU9TIOWSjCBBbmRyb2lkIOW5s+WPsOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlZpZGVvUGxheWVyJylcclxuQGhlbHAoJ2kxOG46Y2MuVmlkZW9QbGF5ZXInKVxyXG5AbWVudSgnQ29tcG9uZW50cy9WaWRlb1BsYXllcicpXHJcbkByZXF1aXJlQ29tcG9uZW50KFVJVHJhbnNmb3JtKVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuZXhwb3J0IGNsYXNzIFZpZGVvUGxheWVyIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcmVzb3VyY2VUeXBlID0gUmVzb3VyY2VUeXBlLkxPQ0FMO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9yZW1vdGVVUkwgPSAnJztcclxuICAgIEB0eXBlKFZpZGVvQ2xpcClcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY2xpcDogVmlkZW9DbGlwIHwgbnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3BsYXlPbkF3YWtlID0gdHJ1ZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdm9sdW1lID0gMS4wO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9tdXRlID0gZmFsc2U7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3BsYXliYWNrUmF0ZSA9IDE7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2xvb3AgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY29udHJvbHMgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZnVsbFNjcmVlbk9uQXdha2UgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfc3RheU9uQm90dG9tID0gZmFsc2U7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2tlZXBBc3BlY3RSYXRpbyA9IHRydWU7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbXBsOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgX2NhY2hlZEN1cnJlbnRUaW1lID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHJlc291cmNlIHR5cGUgb2YgdmlkZW8gcGxheWVyLCBSRU1PVEUgZm9yIHJlbW90ZSB1cmwgYW5kIExPQ0FMIGZvciBsb2NhbCBmaWxlIHBhdGguXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhumikeadpea6kO+8mlJFTU9URSDooajnpLrov5znqIvop4bpopEgVVJM77yMTE9DQUwg6KGo56S65pys5Zyw6KeG6aKR5Zyw5Z2A44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFJlc291cmNlVHlwZSlcclxuICAgIEB0b29sdGlwKCdpMThuOnZpZGVvcGxheWVyLnJlc291cmNlVHlwZScpXHJcbiAgICBnZXQgcmVzb3VyY2VUeXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VUeXBlO1xyXG4gICAgfVxyXG4gICAgc2V0IHJlc291cmNlVHlwZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlVHlwZSAhPT0gdmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc291cmNlVHlwZSA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy5zeW5jU291cmNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgcmVtb3RlIFVSTCBvZiB2aWRlby5cclxuICAgICAqIEB6aFxyXG4gICAgICog6L+c56iL6KeG6aKR55qEIFVSTFxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgnaTE4bjp2aWRlb3BsYXllci5yZW1vdGVVUkwnKVxyXG4gICAgZ2V0IHJlbW90ZVVSTCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbW90ZVVSTDtcclxuICAgIH1cclxuICAgIHNldCByZW1vdGVVUkwgKHZhbDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbW90ZVVSTCAhPT0gdmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbW90ZVVSTCA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy5zeW5jU291cmNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbG9jYWwgdmlkZW8gY2xpcFxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmnKzlnLDop4bpopHliarovpHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVmlkZW9DbGlwKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46dmlkZW9wbGF5ZXIuY2xpcCcpXHJcbiAgICBnZXQgY2xpcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaXA7XHJcbiAgICB9XHJcbiAgICBzZXQgY2xpcCAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NsaXAgIT09IHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jbGlwID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLnN5bmNTb3VyY2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdGhlIHZpZGVvIHN0YXJ0IHBsYXlpbmcgYXV0b21hdGljYWxseSBhZnRlciBsb2FkZWQ/XHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhumikeWKoOi9veWQjuaYr+WQpuiHquWKqOW8gOWni+aSreaUvu+8n1xyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgnaTE4bjp2aWRlb3BsYXllci5wbGF5T25Bd2FrZScpXHJcbiAgICBnZXQgcGxheU9uQXdha2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXlPbkF3YWtlO1xyXG4gICAgfVxyXG4gICAgc2V0IHBsYXlPbkF3YWtlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fcGxheU9uQXdha2UgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIFZpZGVvIHBsYXliYWNrIHJhdGVcclxuICAgICAqIEB6aFxyXG4gICAgICog6KeG6aKR5pKt5pS+5pe255qE6YCf546H77yIMC4wIH4gMTAuMO+8iVxyXG4gICAgICovXHJcbiAgICBAc2xpZGVcclxuICAgIEByYW5nZShbMC4wLCAxMCwgMS4wXSlcclxuICAgIEB0b29sdGlwKCdpMThuOnZpZGVvcGxheWVyLnBsYXliYWNrUmF0ZScpXHJcbiAgICBnZXQgcGxheWJhY2tSYXRlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5YmFja1JhdGU7XHJcbiAgICB9XHJcbiAgICBzZXQgcGxheWJhY2tSYXRlKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9wbGF5YmFja1JhdGUgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5uYXRpdmVWaWRlbykge1xyXG4gICAgICAgICAgICB0aGlzLm5hdGl2ZVZpZGVvLnBsYXliYWNrUmF0ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHZvbHVtZSBvZiB0aGUgdmlkZW8uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhumikeeahOmfs+mHj++8iDAuMCB+IDEuMO+8iVxyXG4gICAgICovXHJcbiAgICBAc2xpZGVcclxuICAgIEByYW5nZShbMC4wLCAxLjAsIDAuMV0pXHJcbiAgICBAdG9vbHRpcCgnaTE4bjp2aWRlb3BsYXllci52b2x1bWUnKVxyXG4gICAgZ2V0IHZvbHVtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdm9sdW1lO1xyXG4gICAgfVxyXG4gICAgc2V0IHZvbHVtZSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdm9sdW1lID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMubmF0aXZlVmlkZW8pIHtcclxuICAgICAgICAgICAgdGhpcy5uYXRpdmVWaWRlby52b2x1bWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIE11dGVzIHRoZSBWaWRlb1BsYXllci4gTXV0ZSBzZXRzIHRoZSB2b2x1bWU9MCwgVW4tTXV0ZSByZXN0b3JlIHRoZSBvcmlnaW5hbCB2b2x1bWUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaYr+WQpumdmemfs+inhumikeOAgumdmemfs+aXtuiuvue9rumfs+mHj+S4uiAw77yM5Y+W5raI6Z2Z6Z+z5piv5oGi5aSN5Y6f5p2l55qE6Z+z6YeP44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCdpMThuOnZpZGVvcGxheWVyLm11dGUnKVxyXG4gICAgZ2V0IG11dGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX211dGU7XHJcbiAgICB9XHJcbiAgICBzZXQgbXV0ZSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX211dGUgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5uYXRpdmVWaWRlbykge1xyXG4gICAgICAgICAgICB0aGlzLm5hdGl2ZVZpZGVvLm11dGUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgdGhlIHZpZGVvIHNob3VsZCBiZSBwbGF5ZWQgYWdhaW4gYXQgdGhlIGVuZFxyXG4gICAgICogQHpoXHJcbiAgICAgKiDop4bpopHmmK/lkKblupTlnKjnu5PmnZ/ml7blho3mrKHmkq3mlL5cclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2kxOG46dmlkZW9wbGF5ZXIubG9vcCcpXHJcbiAgICBnZXQgbG9vcCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9vcDtcclxuICAgIH1cclxuICAgIHNldCBsb29wKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbG9vcCA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLm5hdGl2ZVZpZGVvKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF0aXZlVmlkZW8ubG9vcCA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciBrZWVwIHRoZSBhc3BlY3QgcmF0aW9uIG9mIHRoZSBvcmlnaW5hbCB2aWRlby5cclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5L+d5oyB6KeG6aKR5Y6f5p2l55qE5a696auY5q+UXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCdpMThuOnZpZGVvcGxheWVyLmtlZXBBc3BlY3RSYXRpbycpXHJcbiAgICBnZXQga2VlcEFzcGVjdFJhdGlvKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9rZWVwQXNwZWN0UmF0aW87XHJcbiAgICB9XHJcbiAgICBzZXQga2VlcEFzcGVjdFJhdGlvKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2tlZXBBc3BlY3RSYXRpbyAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fa2VlcEFzcGVjdFJhdGlvID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbXBsLnN5bmNLZWVwQXNwZWN0UmF0aW8odmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHBsYXkgdmlkZW8gaW4gZnVsbHNjcmVlbiBtb2RlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblhajlsY/mkq3mlL7op4bpopFcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2kxOG46dmlkZW9wbGF5ZXIuZnVsbFNjcmVlbk9uQXdha2UnKVxyXG4gICAgZ2V0IGZ1bGxTY3JlZW5PbkF3YWtlICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9mdWxsU2NyZWVuT25Bd2FrZSA9IHRoaXMuX2ltcGwgJiYgdGhpcy5faW1wbC5mdWxsU2NyZWVuT25Bd2FrZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bGxTY3JlZW5PbkF3YWtlO1xyXG4gICAgfVxyXG4gICAgc2V0IGZ1bGxTY3JlZW5PbkF3YWtlICh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9mdWxsU2NyZWVuT25Bd2FrZSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZnVsbFNjcmVlbk9uQXdha2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ltcGwuc3luY0Z1bGxTY3JlZW5PbkF3YWtlKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWx3YXlzIGJlbG93IHRoZSBnYW1lIHZpZXcgKG9ubHkgdXNlZnVsIG9uIFdlYi4gTm90ZTogVGhlIHNwZWNpZmljIGVmZmVjdHMgYXJlIG5vdCBndWFyYW50ZWVkIHRvIGJlIGNvbnNpc3RlbnQsIGRlcGVuZGluZyBvbiB3aGV0aGVyIGVhY2ggYnJvd3NlciBzdXBwb3J0cyBvciByZXN0cmljdHMpLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmsLjov5zlnKjmuLjmiI/op4blm77mnIDlupXlsYLvvIjov5nkuKrlsZ7mgKflj6rmnInlnKggV2ViIOW5s+WPsOS4iuacieaViOaenOOAguazqOaEj++8muWFt+S9k+aViOaenOaXoOazleS/neivgeS4gOiHtO+8jOi3n+WQhOS4qua1j+iniOWZqOaYr+WQpuaUr+aMgeS4jumZkOWItuacieWFs++8iVxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgnaTE4bjp2aWRlb3BsYXllci5zdGF5T25Cb3R0b20nKVxyXG4gICAgZ2V0IHN0YXlPbkJvdHRvbSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXlPbkJvdHRvbTtcclxuICAgIH1cclxuICAgIHNldCBzdGF5T25Cb3R0b20gKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YXlPbkJvdHRvbSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RheU9uQm90dG9tID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbXBsLnN5bmNTdGF5T25Cb3R0b20odmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgRXZlbnRUeXBlID0gRXZlbnRUeXBlO1xyXG4gICAgcHVibGljIHN0YXRpYyBSZXNvdXJjZVR5cGUgPSBSZXNvdXJjZVR5cGU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB2aWRlbyBwbGF5ZXIncyBjYWxsYmFjaywgaXQgd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiBjZXJ0YWluIGV2ZW50IG9jY3VycywgbGlrZTogcGxheWluZywgcGF1c2VkLCBzdG9wcGVkIGFuZCBjb21wbGV0ZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhumikeaSreaUvuWbnuiwg+WHveaVsO+8jOivpeWbnuiwg+WHveaVsOS8muWcqOeJueWumuaDheWGteiiq+inpuWPke+8jOavlOWmguaSreaUvuS4re+8jOaaguaXtu+8jOWBnOatouWSjOWujOaIkOaSreaUvuOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAdHlwZShbQ29tcG9uZW50RXZlbnRIYW5kbGVyXSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMjApXHJcbiAgICBAdG9vbHRpcCgnaTE4bjp2aWRlb3BsYXllci52aWRlb1BsYXllckV2ZW50JylcclxuICAgIHB1YmxpYyB2aWRlb1BsYXllckV2ZW50OiBDb21wb25lbnRFdmVudEhhbmRsZXJbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSYXcgdmlkZW8gb2JqZWN0cyBmb3IgdXNlciBjdXN0b21pemF0aW9uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWOn+Wni+inhumikeWvueixoe+8jOeUqOS6jueUqOaIt+WumuWItlxyXG4gICAgICovXHJcbiAgICBnZXQgbmF0aXZlVmlkZW8gKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5faW1wbCAmJiB0aGlzLl9pbXBsLnZpZGVvKSB8fCBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgdGhlIHZpZGVvIGNvbnRyb2wgYmFyXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaYr+WQpuaYvuekuuinhumikeaOp+WItuagj1xyXG4gICAgICovXHJcbiAgICBnZXQgY29udHJvbHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250cm9scztcclxuICAgIH1cclxuICAgIHNldCBjb250cm9scyh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xzID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMubmF0aXZlVmlkZW8pIHtcclxuICAgICAgICAgICAgdGhpcy5uYXRpdmVWaWRlby5jb250cm9scyA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGN1cnJlbnQgcGxheWJhY2sgdGltZSBvZiB0aGUgbm93IHBsYXlpbmcgaXRlbSBpbiBzZWNvbmRzLCB5b3UgY291bGQgYWxzbyBjaGFuZ2UgdGhlIHN0YXJ0IHBsYXliYWNrIHRpbWUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+WumuinhumikeS7juS7gOS5iOaXtumXtOeCueW8gOWni+aSreaUvu+8jOWNleS9jeaYr+enku+8jOS5n+WPr+S7peeUqOadpeiOt+WPluW9k+WJjeinhumikeaSreaUvueahOaXtumXtOi/m+W6puOAglxyXG4gICAgICovXHJcbiAgICBnZXQgY3VycmVudFRpbWUgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5uYXRpdmVWaWRlbykgeyByZXR1cm4gdGhpcy5fY2FjaGVkQ3VycmVudFRpbWU7IH1cclxuICAgICAgICByZXR1cm4gdGhpcy5uYXRpdmVWaWRlby5jdXJyZW50VGltZTtcclxuICAgIH1cclxuICAgIHNldCBjdXJyZW50VGltZSAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaXNOYU4odmFsKSkgeyB3YXJuKCdpbGxlZ2FsIHZpZGVvIHRpbWUhJyk7IHJldHVybjsgfVxyXG4gICAgICAgIHZhbCA9IGNsYW1wKHZhbCwgMCwgdGhpcy5kdXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy5fY2FjaGVkQ3VycmVudFRpbWUgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMubmF0aXZlVmlkZW8pIHtcclxuICAgICAgICAgICAgdGhpcy5uYXRpdmVWaWRlby5jdXJyZW50VGltZSA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCB0aGUgYXVkaW8gZHVyYXRpb24sIGluIHNlY29uZHMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluS7peenkuS4uuWNleS9jeeahOinhumikeaAu+aXtumVv+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgZHVyYXRpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5uYXRpdmVWaWRlbykgeyByZXR1cm4gMDsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5hdGl2ZVZpZGVvLmR1cmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgY3VycmVudCBhdWRpbyBzdGF0ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5b2T5YmN6KeG6aKR54q25oCB44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBzdGF0ZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbXBsKSB7IHJldHVybiBFdmVudFR5cGUuTk9ORTsgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbXBsLnN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJcyB0aGUgYXVkaW8gY3VycmVudGx5IHBsYXlpbmc/XHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjeinhumikeaYr+WQpuato+WcqOaSreaUvu+8n1xyXG4gICAgICovXHJcbiAgICBnZXQgaXNQbGF5aW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gRXZlbnRUeXBlLlBMQVlJTkc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN5bmNTb3VyY2UgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faW1wbCkgeyByZXR1cm47IH1cclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2VUeXBlID09PSBSZXNvdXJjZVR5cGUuUkVNT1RFKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc3luY1VSTCh0aGlzLl9yZW1vdGVVUkwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5faW1wbC5zeW5jQ2xpcCh0aGlzLl9jbGlwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ltcGwgPSBuZXcgVmlkZW9QbGF5ZXJJbXBsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc3luY1NvdXJjZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLm5hdGl2ZVZpZGVvKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmF0aXZlVmlkZW8ubG9vcCA9IHRoaXMuX2xvb3A7XHJcbiAgICAgICAgICAgIHRoaXMubmF0aXZlVmlkZW8udm9sdW1lID0gdGhpcy5fdm9sdW1lO1xyXG4gICAgICAgICAgICB0aGlzLm5hdGl2ZVZpZGVvLm11dGVkID0gdGhpcy5fbXV0ZTtcclxuICAgICAgICAgICAgdGhpcy5uYXRpdmVWaWRlby5wbGF5YmFja1JhdGUgPSB0aGlzLl9wbGF5YmFja1JhdGU7XHJcbiAgICAgICAgICAgIHRoaXMubmF0aXZlVmlkZW8uY3VycmVudFRpbWUgPSB0aGlzLl9jYWNoZWRDdXJyZW50VGltZTtcclxuICAgICAgICAgICAgdGhpcy5uYXRpdmVWaWRlby5jb250cm9scyA9IHRoaXMuX2NvbnRyb2xzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbXBsLnN5bmNTdGF5T25Cb3R0b20odGhpcy5fc3RheU9uQm90dG9tKTtcclxuICAgICAgICB0aGlzLl9pbXBsLnN5bmNLZWVwQXNwZWN0UmF0aW8odGhpcy5fa2VlcEFzcGVjdFJhdGlvKTtcclxuICAgICAgICB0aGlzLl9pbXBsLnN5bmNGdWxsU2NyZWVuT25Bd2FrZSh0aGlzLl9mdWxsU2NyZWVuT25Bd2FrZSk7XHJcbiAgICAgICAgLy9cclxuICAgICAgICB0aGlzLl9pbXBsLmV2ZW50TGlzdC5zZXQoRXZlbnRUeXBlLk1FVEFfTE9BREVELCB0aGlzLm9uTWV0YUxvYWRlZC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9pbXBsLmV2ZW50TGlzdC5zZXQoRXZlbnRUeXBlLlJFQURZX1RPX1BMQVksIHRoaXMub25SZWFkeVRvUGxheS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9pbXBsLmV2ZW50TGlzdC5zZXQoRXZlbnRUeXBlLlBMQVlJTkcsIHRoaXMub25QbGF5aW5nLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX2ltcGwuZXZlbnRMaXN0LnNldChFdmVudFR5cGUuUEFVU0VELCB0aGlzLm9uUGFzdWVkLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX2ltcGwuZXZlbnRMaXN0LnNldChFdmVudFR5cGUuU1RPUFBFRCwgdGhpcy5vblN0b3BwZWQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5faW1wbC5ldmVudExpc3Quc2V0KEV2ZW50VHlwZS5DT01QTEVURUQsIHRoaXMub25Db21wbGV0ZWQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5faW1wbC5ldmVudExpc3Quc2V0KEV2ZW50VHlwZS5FUlJPUiwgdGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGlmICh0aGlzLl9wbGF5T25Bd2FrZSAmJiB0aGlzLl9pbXBsLmxvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuZW5hYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuZGlzYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5faW1wbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLnN5bmNNYXRyaXgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTWV0YUxvYWRlZCAoKSB7XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy52aWRlb1BsYXllckV2ZW50LCB0aGlzLCBFdmVudFR5cGUuTUVUQV9MT0FERUQpO1xyXG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdtZXRhLWxvYWRlZCcsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJlYWR5VG9QbGF5ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcGxheU9uQXdha2UgJiYgIXRoaXMuaXNQbGF5aW5nKSB7IHRoaXMucGxheSgpOyB9XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy52aWRlb1BsYXllckV2ZW50LCB0aGlzLCBFdmVudFR5cGUuUkVBRFlfVE9fUExBWSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3JlYWR5LXRvLXBsYXknLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25QbGF5aW5nICgpIHtcclxuICAgICAgICBDb21wb25lbnRFdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnZpZGVvUGxheWVyRXZlbnQsIHRoaXMsIEV2ZW50VHlwZS5QTEFZSU5HKTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdCgncGxheWluZycsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblBhc3VlZCAoKSB7XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy52aWRlb1BsYXllckV2ZW50LCB0aGlzLCBFdmVudFR5cGUuUEFVU0VEKTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdCgncGF1c2VkJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uU3RvcHBlZCAoKSB7XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy52aWRlb1BsYXllckV2ZW50LCB0aGlzLCBFdmVudFR5cGUuU1RPUFBFRCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3N0b3BwZWQnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Db21wbGV0ZWQgKCkge1xyXG4gICAgICAgIENvbXBvbmVudEV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMudmlkZW9QbGF5ZXJFdmVudCwgdGhpcywgRXZlbnRUeXBlLkNPTVBMRVRFRCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2NvbXBsZXRlZCcsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVycm9yICgpIHtcclxuICAgICAgICBDb21wb25lbnRFdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnZpZGVvUGxheWVyRXZlbnQsIHRoaXMsIEV2ZW50VHlwZS5FUlJPUik7XHJcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2Vycm9yJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFBsYXkgdGhlIGNsaXAuPGJyPlxyXG4gICAgICogUmVzdGFydCBpZiBhbHJlYWR5IHBsYXlpbmcuPGJyPlxyXG4gICAgICogUmVzdW1lIGlmIHBhdXNlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5byA5aeL5pKt5pS+44CCPGJyPlxyXG4gICAgICog5aaC5p6c6KeG6aKR5aSE5LqO5q2j5Zyo5pKt5pS+54q25oCB77yM5bCG5Lya6YeN5paw5byA5aeL5pKt5pS+6KeG6aKR44CCPGJyPlxyXG4gICAgICog5aaC5p6c6KeG6aKR5aSE5LqO5pqC5YGc54q25oCB77yM5YiZ5Lya57un57ut5pKt5pS+6KeG6aKR44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwbGF5ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFBhdXNlIHRoZSBjbGlwLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmoLlgZzmkq3mlL7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhdXNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTdG9wIHRoZSBjbGlwLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlgZzmraLmkq3mlL7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0b3AgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc3RvcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=