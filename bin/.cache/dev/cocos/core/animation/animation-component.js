(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../components/component.js", "../data/decorators/index.js", "../event/eventify.js", "../platform/debug.js", "../utils/array.js", "../utils/js-typed.js", "./animation-clip.js", "./animation-state.js", "./cross-fade.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../components/component.js"), require("../data/decorators/index.js"), require("../event/eventify.js"), require("../platform/debug.js"), require("../utils/array.js"), require("../utils/js-typed.js"), require("./animation-clip.js"), require("./animation-state.js"), require("./cross-fade.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.eventify, global.debug, global.array, global.jsTyped, global.animationClip, global.animationState, global.crossFade, global.defaultConstants, global.globalExports);
    global.animationComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _eventify, _debug, ArrayUtils, _jsTyped, _animationClip, _animationState, _crossFade, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Animation = void 0;
  ArrayUtils = _interopRequireWildcard(ArrayUtils);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Animation component governs a group of animation states to control playback of the states.
   * For convenient, it stores a group of animation clips.
   * Each of those clips would have an associated animation state uniquely created.
   * Animation component is eventful, it dispatch a serials playback status events.
   * See [[EventType]].
   * @zh
   * 动画组件管理一组动画状态，控制它们的播放。
   * 为了方便，动画组件还存储了一组动画剪辑。
   * 每个剪辑都会独自创建一个关联的动画状态对象。
   * 动画组件具有事件特性，它会派发一系列播放状态相关的事件。
   * 参考 [[EventType]]
   */
  var Animation = (_dec = (0, _index.ccclass)('cc.Animation'), _dec2 = (0, _index.help)('i18n:cc.Animation'), _dec3 = (0, _index.executionOrder)(99), _dec4 = (0, _index.menu)('Components/Animation'), _dec5 = (0, _index.type)([_animationClip.AnimationClip]), _dec6 = (0, _index.tooltip)('此动画组件管理的动画剪辑'), _dec7 = (0, _index.type)(_animationClip.AnimationClip), _dec8 = (0, _index.tooltip)('默认动画剪辑'), _dec9 = (0, _index.tooltip)('是否在动画组件开始运行时自动播放默认动画剪辑'), _dec10 = (0, _index.type)([_animationClip.AnimationClip]), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Eventify) {
    _inherits(Animation, _Eventify);

    function Animation() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Animation);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Animation)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "playOnLoad", _descriptor, _assertThisInitialized(_this));

      _this._crossFade = new _crossFade.CrossFade();
      _this._nameToState = (0, _jsTyped.createMap)(true);

      _initializerDefineProperty(_this, "_clips", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_defaultClip", _descriptor3, _assertThisInitialized(_this));

      _this._hasBeenPlayed = false;
      return _this;
    }

    _createClass(Animation, [{
      key: "onLoad",
      value: function onLoad() {
        this.clips = this._clips;

        for (var stateName in this._nameToState) {
          var state = this._nameToState[stateName];
          state.initialize(this.node);
        }
      }
    }, {
      key: "start",
      value: function start() {
        if ((!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) && this.playOnLoad && !this._hasBeenPlayed && this._defaultClip) {
          this.crossFade(this._defaultClip.name, 0);
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._crossFade.resume();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._crossFade.pause();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._crossFade.stop();

        for (var name in this._nameToState) {
          var state = this._nameToState[name];
          state.destroy();
        }

        this._nameToState = (0, _jsTyped.createMap)(true);
      }
      /**
       * @en
       * Switch to play specified animation state, without fading.
       * @zh
       * 立即切换到指定动画状态。
       * @param name The name of the animation to be played, if absent, the default clip will be played
       */

    }, {
      key: "play",
      value: function play(name) {
        this._hasBeenPlayed = true;

        if (!name) {
          if (!this._defaultClip) {
            return;
          } else {
            name = this._defaultClip.name;
          }
        }

        this.crossFade(name, 0);
      }
      /**
       * @en
       * Smoothly switch to play specified animation state.
       * @zn
       * 平滑地切换到指定动画状态。
       * @param name The name of the animation to switch to
       * @param duration The duration of the cross fade, default value is 0.3s
       */

    }, {
      key: "crossFade",
      value: function crossFade(name) {
        var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.3;
        this._hasBeenPlayed = true;
        var state = this._nameToState[name];

        if (state) {
          this._crossFade.play();

          this._crossFade.crossFade(state, duration);
        }
      }
      /**
       * @en
       * Pause all animation states and all switching.
       * @zh
       * 暂停所有动画状态，并暂停所有切换。
       */

    }, {
      key: "pause",
      value: function pause() {
        this._crossFade.pause();
      }
      /**
       * @en
       * Resume all animation states and all switching.
       * @zh
       * 恢复所有动画状态，并恢复所有切换。
       */

    }, {
      key: "resume",
      value: function resume() {
        this._crossFade.resume();
      }
      /**
       * @en
       * Stop all animation states and all switching.
       * @zh
       * 停止所有动画状态，并停止所有切换。
       */

    }, {
      key: "stop",
      value: function stop() {
        this._crossFade.stop();
      }
      /**
       * @en
       * Get specified animation state.
       * @zh
       * 获取指定的动画状态。
       * @deprecated please use [[getState]]
       */

    }, {
      key: "getAnimationState",
      value: function getAnimationState(name) {
        return this.getState(name);
      }
      /**
       * @en
       * Get specified animation state.
       * @zh
       * 获取指定的动画状态。
       * @param name The name of the animation
       * @returns If no animation found, return null, otherwise the correspond animation state is returned
       */

    }, {
      key: "getState",
      value: function getState(name) {
        var state = this._nameToState[name];

        if (state && !state.curveLoaded) {
          state.initialize(this.node);
        }

        return state || null;
      }
      /**
       * @en
       * Creates a state for specified clip.
       * If there is already a clip with same name, the existing animation state will be stopped and overridden.
       * @zh
       * 使用指定的动画剪辑创建一个动画状态。
       * 若指定名称的动画状态已存在，已存在的动画状态将先被设为停止并被覆盖。
       * @param clip The animation clip
       * @param name The animation state name, if absent, the default clip's name will be used
       * @returns The animation state created
       */

    }, {
      key: "createState",
      value: function createState(clip, name) {
        name = name || clip.name;
        this.removeState(name);
        return this._doCreateState(clip, name);
      }
      /**
       * @en
       * Stops and removes specified clip.
       * @zh
       * 停止并移除指定的动画状态。
       * @param name The name of the animation state
       */

    }, {
      key: "removeState",
      value: function removeState(name) {
        var state = this._nameToState[name];

        if (state) {
          state.allowLastFrameEvent(false);
          state.stop();
          delete this._nameToState[name];
        }
      }
      /**
       * 添加一个动画剪辑到 `this.clips`中并以此剪辑创建动画状态。
       * @deprecated please use [[createState]]
       * @param clip The animation clip
       * @param name The animation state name, if absent, the default clip's name will be used
       * @returns The created animation state
       */

    }, {
      key: "addClip",
      value: function addClip(clip, name) {
        if (!ArrayUtils.contains(this._clips, clip)) {
          this._clips.push(clip);
        }

        return this.createState(clip, name);
      }
      /**
       * @en
       * Remove clip from the animation list. This will remove the clip and any animation states based on it.<br>
       * If there are animation states depend on the clip are playing or clip is defaultClip, it will not delete the clip.<br>
       * But if force is true, then will always remove the clip and any animation states based on it. If clip is defaultClip, defaultClip will be reset to null
       * @zh
       * 从动画列表中移除指定的动画剪辑，<br/>
       * 如果依赖于 clip 的 AnimationState 正在播放或者 clip 是 defaultClip 的话，默认是不会删除 clip 的。<br/>
       * 但是如果 force 参数为 true，则会强制停止该动画，然后移除该动画剪辑和相关的动画。这时候如果 clip 是 defaultClip，defaultClip 将会被重置为 null。<br/>
       * @deprecated please use [[removeState]]
       * @param force - If force is true, then will always remove the clip and any animation states based on it.
       */

    }, {
      key: "removeClip",
      value: function removeClip(clip, force) {
        var removalState;

        for (var name in this._nameToState) {
          var state = this._nameToState[name];
          var stateClip = state.clip;

          if (stateClip === clip) {
            removalState = state;
            break;
          }
        }

        if (clip === this._defaultClip) {
          if (force) {
            this._defaultClip = null;
          } else {
            if (!_defaultConstants.TEST) {
              (0, _debug.warnID)(3902);
            }

            return;
          }
        }

        if (removalState && removalState.isPlaying) {
          if (force) {
            removalState.stop();
          } else {
            if (!_defaultConstants.TEST) {
              (0, _debug.warnID)(3903);
            }

            return;
          }
        }

        this._clips = this._clips.filter(function (item) {
          return item !== clip;
        });

        if (removalState) {
          delete this._nameToState[removalState.name];
        }
      }
      /**
       * @en
       * Register animation event callback.<bg>
       * The event arguments will provide the AnimationState which emit the event.<bg>
       * When play an animation, will auto register the event callback to the AnimationState,<bg>
       * and unregister the event callback from the AnimationState when animation stopped.
       * @zh
       * 注册动画事件回调。<bg>
       * 回调的事件里将会附上发送事件的 AnimationState。<bg>
       * 当播放一个动画时，会自动将事件注册到对应的 AnimationState 上，停止播放时会将事件从这个 AnimationState 上取消注册。
       * @param type The event type to listen to
       * @param callback The callback when event triggered
       * @param target The callee when invoke the callback, could be absent
       * @return The registered callback
       * @example
       * ```ts
       * onPlay: function (type, state) {
       *     // callback
       * }
       *
       * // register event to all animation
       * animation.on('play', this.onPlay, this);
       * ```
       */

    }, {
      key: "on",
      value: function on(type, callback, thisArg, once) {
        var ret = _get(_getPrototypeOf(Animation.prototype), "on", this).call(this, type, callback, thisArg, once);

        if (type === _animationState.EventType.LASTFRAME) {
          this._syncAllowLastFrameEvent();
        }

        return ret;
      }
    }, {
      key: "once",
      value: function once(type, callback, thisArg) {
        var ret = _get(_getPrototypeOf(Animation.prototype), "once", this).call(this, type, callback, thisArg);

        if (type === _animationState.EventType.LASTFRAME) {
          this._syncAllowLastFrameEvent();
        }

        return ret;
      }
      /**
       * @en
       * Unregister animation event callback.
       * @zh
       * 取消注册动画事件回调。
       * @param {String} type The event type to unregister
       * @param {Function} callback The callback to unregister
       * @param {Object} target The callee of the callback, could be absent
       * @example
       * ```ts
       * // unregister event to all animation
       * animation.off('play', this.onPlay, this);
       * ```
       */

    }, {
      key: "off",
      value: function off(type, callback, thisArg) {
        _get(_getPrototypeOf(Animation.prototype), "off", this).call(this, type, callback, thisArg);

        if (type === _animationState.EventType.LASTFRAME) {
          this._syncDisallowLastFrameEvent();
        }
      }
    }, {
      key: "_createState",
      value: function _createState(clip, name) {
        return new _animationState.AnimationState(clip, name);
      }
    }, {
      key: "_doCreateState",
      value: function _doCreateState(clip, name) {
        var state = this._createState(clip, name);

        state._setEventTarget(this);

        state.allowLastFrameEvent(this.hasEventListener(_animationState.EventType.LASTFRAME));

        if (this.node) {
          state.initialize(this.node);
        }

        this._nameToState[state.name] = state;
        return state;
      }
    }, {
      key: "_getStateByNameOrDefaultClip",
      value: function _getStateByNameOrDefaultClip(name) {
        if (!name) {
          if (!this._defaultClip) {
            return null;
          } else {
            name = this._defaultClip.name;
          }
        }

        var state = this._nameToState[name];

        if (state) {
          return state;
        } else {
          return null;
        }
      }
    }, {
      key: "_removeStateOfAutomaticClip",
      value: function _removeStateOfAutomaticClip(clip) {
        // tslint:disable-next-line:forin
        for (var name in this._nameToState) {
          var state = this._nameToState[name];

          if (equalClips(clip, state.clip)) {
            state.stop();
            delete this._nameToState[name];
          }
        }
      }
    }, {
      key: "_syncAllowLastFrameEvent",
      value: function _syncAllowLastFrameEvent() {
        if (this.hasEventListener(_animationState.EventType.LASTFRAME)) {
          for (var stateName in this._nameToState) {
            this._nameToState[stateName].allowLastFrameEvent(true);
          }
        }
      }
    }, {
      key: "_syncDisallowLastFrameEvent",
      value: function _syncDisallowLastFrameEvent() {
        if (!this.hasEventListener(_animationState.EventType.LASTFRAME)) {
          for (var stateName in this._nameToState) {
            this._nameToState[stateName].allowLastFrameEvent(false);
          }
        }
      }
    }, {
      key: "clips",

      /**
       * @en
       * Gets or sets clips this component governs.
       * When set, associated animation state of each existing clip will be stopped.
       * If the existing default clip is not in the set of new clips, default clip will be reset to null.
       * @zh
       * 获取或设置此组件管理的剪辑。
       * 设置时，已有剪辑关联的动画状态将被停止；若默认剪辑不在新的动画剪辑中，将被重置为空。
       */
      get: function get() {
        return this._clips;
      },
      set: function set(value) {
        var _this2 = this;

        if (this._crossFade) {
          this._crossFade.clear();
        } // Remove state for old automatic clips.


        var _iterator = _createForOfIteratorHelper(this._clips),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var clip = _step.value;

            if (clip) {
              this._removeStateOfAutomaticClip(clip);
            }
          } // Create state for new clips.

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var _iterator2 = _createForOfIteratorHelper(value),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _clip = _step2.value;

            if (_clip) {
              this.createState(_clip);
            }
          } // Default clip should be in the list of automatic clips.

        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var newDefaultClip = value.find(function (clip) {
          return equalClips(clip, _this2._defaultClip);
        });

        if (newDefaultClip) {
          this._defaultClip = newDefaultClip;
        } else {
          this._defaultClip = null;
        }

        this._clips = value;
      }
      /**
       * @en
       * Gets or sets the default clip.
       * @en
       * 获取或设置默认剪辑。
       * 设置时，若指定的剪辑不在 `this.clips` 中则会被自动添加至 `this.clips`。
       * @see [[playOnLoad]]
       */

    }, {
      key: "defaultClip",
      get: function get() {
        return this._defaultClip;
      },
      set: function set(value) {
        this._defaultClip = value;

        if (!value) {
          return;
        }

        var isBoundedDefaultClip = this._clips.findIndex(function (clip) {
          return equalClips(clip, value);
        }) >= 0;

        if (!isBoundedDefaultClip) {
          this._clips.push(value);

          this.createState(value);
        }
      }
    }]);

    return Animation;
  }((0, _eventify.Eventify)(_component.Component)), _class3.EventType = _animationState.EventType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "clips", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "clips"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "defaultClip", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "defaultClip"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "playOnLoad", [_index.serializable, _dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_clips", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_defaultClip", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.Animation = Animation;

  function equalClips(clip1, clip2) {
    if (clip1 === clip2) {
      return true;
    }

    return !!clip1 && !!clip2 && (clip1.name === clip2.name || clip1._uuid === clip2._uuid);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2FuaW1hdGlvbi1jb21wb25lbnQudHMiXSwibmFtZXMiOlsiQW5pbWF0aW9uIiwiQW5pbWF0aW9uQ2xpcCIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2Nyb3NzRmFkZSIsIkNyb3NzRmFkZSIsIl9uYW1lVG9TdGF0ZSIsIl9oYXNCZWVuUGxheWVkIiwiY2xpcHMiLCJfY2xpcHMiLCJzdGF0ZU5hbWUiLCJzdGF0ZSIsImluaXRpYWxpemUiLCJub2RlIiwiRURJVE9SIiwibGVnYWN5Q0MiLCJHQU1FX1ZJRVciLCJwbGF5T25Mb2FkIiwiX2RlZmF1bHRDbGlwIiwiY3Jvc3NGYWRlIiwibmFtZSIsInJlc3VtZSIsInBhdXNlIiwic3RvcCIsImRlc3Ryb3kiLCJkdXJhdGlvbiIsInBsYXkiLCJnZXRTdGF0ZSIsImN1cnZlTG9hZGVkIiwiY2xpcCIsInJlbW92ZVN0YXRlIiwiX2RvQ3JlYXRlU3RhdGUiLCJhbGxvd0xhc3RGcmFtZUV2ZW50IiwiQXJyYXlVdGlscyIsImNvbnRhaW5zIiwicHVzaCIsImNyZWF0ZVN0YXRlIiwiZm9yY2UiLCJyZW1vdmFsU3RhdGUiLCJzdGF0ZUNsaXAiLCJURVNUIiwiaXNQbGF5aW5nIiwiZmlsdGVyIiwiaXRlbSIsInR5cGUiLCJjYWxsYmFjayIsInRoaXNBcmciLCJvbmNlIiwicmV0IiwiRXZlbnRUeXBlIiwiTEFTVEZSQU1FIiwiX3N5bmNBbGxvd0xhc3RGcmFtZUV2ZW50IiwiX3N5bmNEaXNhbGxvd0xhc3RGcmFtZUV2ZW50IiwiQW5pbWF0aW9uU3RhdGUiLCJfY3JlYXRlU3RhdGUiLCJfc2V0RXZlbnRUYXJnZXQiLCJoYXNFdmVudExpc3RlbmVyIiwiZXF1YWxDbGlwcyIsInZhbHVlIiwiY2xlYXIiLCJfcmVtb3ZlU3RhdGVPZkF1dG9tYXRpY0NsaXAiLCJuZXdEZWZhdWx0Q2xpcCIsImZpbmQiLCJpc0JvdW5kZWREZWZhdWx0Q2xpcCIsImZpbmRJbmRleCIsIkNvbXBvbmVudCIsInNlcmlhbGl6YWJsZSIsImNsaXAxIiwiY2xpcDIiLCJfdXVpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDQTs7Ozs7Ozs7Ozs7Ozs7TUFtQmFBLFMsV0FMWixvQkFBUSxjQUFSLEMsVUFDQSxpQkFBSyxtQkFBTCxDLFVBQ0EsMkJBQWUsRUFBZixDLFVBRUEsaUJBQUssc0JBQUwsQyxVQVdJLGlCQUFLLENBQUNDLDRCQUFELENBQUwsQyxVQUNBLG9CQUFRLGNBQVIsQyxVQXdDQSxpQkFBS0EsNEJBQUwsQyxVQUNBLG9CQUFRLFFBQVIsQyxVQTRCQSxvQkFBUSx3QkFBUixDLFdBT0EsaUJBQUssQ0FBQ0EsNEJBQUQsQ0FBTCxDLGtEQXpGSkMsd0I7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQXFGYUMsVSxHQUFhLElBQUlDLG9CQUFKLEU7WUFFYkMsWSxHQUErQyx3QkFBVSxJQUFWLEM7Ozs7OztZQVdqREMsYyxHQUFpQixLOzs7Ozs7K0JBRVI7QUFDYixhQUFLQyxLQUFMLEdBQWEsS0FBS0MsTUFBbEI7O0FBQ0EsYUFBSyxJQUFNQyxTQUFYLElBQXdCLEtBQUtKLFlBQTdCLEVBQTJDO0FBQ3ZDLGNBQU1LLEtBQUssR0FBRyxLQUFLTCxZQUFMLENBQWtCSSxTQUFsQixDQUFkO0FBQ0FDLFVBQUFBLEtBQUssQ0FBQ0MsVUFBTixDQUFpQixLQUFLQyxJQUF0QjtBQUNIO0FBQ0o7Ozs4QkFFZTtBQUNaLFlBQUksQ0FBQyxDQUFDQyx3QkFBRCxJQUFXQyx3QkFBU0MsU0FBckIsS0FBb0MsS0FBS0MsVUFBTCxJQUFtQixDQUFDLEtBQUtWLGNBQTdELElBQWdGLEtBQUtXLFlBQXpGLEVBQXVHO0FBQ25HLGVBQUtDLFNBQUwsQ0FBZSxLQUFLRCxZQUFMLENBQWtCRSxJQUFqQyxFQUF1QyxDQUF2QztBQUNIO0FBQ0o7OztpQ0FFa0I7QUFDZixhQUFLaEIsVUFBTCxDQUFnQmlCLE1BQWhC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RCxLQUFkO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7MEJBVW1CO0FBQ2YsZUFBTyxLQUFLeEMsWUFBWjtBQUNILE87d0JBRWdCd0MsSyxFQUFPO0FBQ3BCLGFBQUt4QyxZQUFMLEdBQW9Cd0MsS0FBcEI7O0FBQ0EsWUFBSSxDQUFDQSxLQUFMLEVBQVk7QUFDUjtBQUNIOztBQUNELFlBQU1LLG9CQUFvQixHQUFHLEtBQUt0RCxNQUFMLENBQVl1RCxTQUFaLENBQXNCLFVBQUNuQyxJQUFEO0FBQUEsaUJBQVU0QixVQUFVLENBQUM1QixJQUFELEVBQU82QixLQUFQLENBQXBCO0FBQUEsU0FBdEIsS0FBNEQsQ0FBekY7O0FBQ0EsWUFBSSxDQUFDSyxvQkFBTCxFQUEyQjtBQUN2QixlQUFLdEQsTUFBTCxDQUFZMEIsSUFBWixDQUFpQnVCLEtBQWpCOztBQUNBLGVBQUt0QixXQUFMLENBQWlCc0IsS0FBakI7QUFDSDtBQUNKOzs7O0lBbkUwQix3QkFBU08sb0JBQVQsQyxXQXFFYmhCLFMsR0FBWUEseUIsK1lBVXpCaUIsbUI7Ozs7O2FBRW1CLEs7Ozs7Ozs7YUFPeUIsRTs7bUZBRTVDQSxtQjs7Ozs7YUFDOEMsSTs7Ozs7QUE2Vm5ELFdBQVNULFVBQVQsQ0FBcUJVLEtBQXJCLEVBQWtEQyxLQUFsRCxFQUErRTtBQUMzRSxRQUFJRCxLQUFLLEtBQUtDLEtBQWQsRUFBcUI7QUFDakIsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsV0FBTyxDQUFDLENBQUNELEtBQUYsSUFBVyxDQUFDLENBQUNDLEtBQWIsS0FBdUJELEtBQUssQ0FBQy9DLElBQU4sS0FBZWdELEtBQUssQ0FBQ2hELElBQXJCLElBQTZCK0MsS0FBSyxDQUFDRSxLQUFOLEtBQWdCRCxLQUFLLENBQUNDLEtBQTFFLENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYW5pbWF0aW9uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBleGVjdXRlSW5FZGl0TW9kZSwgZXhlY3V0aW9uT3JkZXIsIGhlbHAsIG1lbnUsIHRvb2x0aXAsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IEV2ZW50aWZ5IH0gZnJvbSAnLi4vZXZlbnQvZXZlbnRpZnknO1xyXG5pbXBvcnQgeyB3YXJuSUQgfSBmcm9tICcuLi9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCAqIGFzIEFycmF5VXRpbHMgZnJvbSAnLi4vdXRpbHMvYXJyYXknO1xyXG5pbXBvcnQgeyBjcmVhdGVNYXAgfSBmcm9tICcuLi91dGlscy9qcy10eXBlZCc7XHJcbmltcG9ydCB7IEFuaW1hdGlvbkNsaXAgfSBmcm9tICcuL2FuaW1hdGlvbi1jbGlwJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uU3RhdGUsIEV2ZW50VHlwZSB9IGZyb20gJy4vYW5pbWF0aW9uLXN0YXRlJztcclxuaW1wb3J0IHsgQ3Jvc3NGYWRlIH0gZnJvbSAnLi9jcm9zcy1mYWRlJztcclxuaW1wb3J0IHsgRURJVE9SLCBURVNUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEFuaW1hdGlvbiBjb21wb25lbnQgZ292ZXJucyBhIGdyb3VwIG9mIGFuaW1hdGlvbiBzdGF0ZXMgdG8gY29udHJvbCBwbGF5YmFjayBvZiB0aGUgc3RhdGVzLlxyXG4gKiBGb3IgY29udmVuaWVudCwgaXQgc3RvcmVzIGEgZ3JvdXAgb2YgYW5pbWF0aW9uIGNsaXBzLlxyXG4gKiBFYWNoIG9mIHRob3NlIGNsaXBzIHdvdWxkIGhhdmUgYW4gYXNzb2NpYXRlZCBhbmltYXRpb24gc3RhdGUgdW5pcXVlbHkgY3JlYXRlZC5cclxuICogQW5pbWF0aW9uIGNvbXBvbmVudCBpcyBldmVudGZ1bCwgaXQgZGlzcGF0Y2ggYSBzZXJpYWxzIHBsYXliYWNrIHN0YXR1cyBldmVudHMuXHJcbiAqIFNlZSBbW0V2ZW50VHlwZV1dLlxyXG4gKiBAemhcclxuICog5Yqo55S757uE5Lu2566h55CG5LiA57uE5Yqo55S754q25oCB77yM5o6n5Yi25a6D5Lus55qE5pKt5pS+44CCXHJcbiAqIOS4uuS6huaWueS+v++8jOWKqOeUu+e7hOS7tui/mOWtmOWCqOS6huS4gOe7hOWKqOeUu+WJqui+keOAglxyXG4gKiDmr4/kuKrliarovpHpg73kvJrni6zoh6rliJvlu7rkuIDkuKrlhbPogZTnmoTliqjnlLvnirbmgIHlr7nosaHjgIJcclxuICog5Yqo55S757uE5Lu25YW35pyJ5LqL5Lu254m55oCn77yM5a6D5Lya5rS+5Y+R5LiA57O75YiX5pKt5pS+54q25oCB55u45YWz55qE5LqL5Lu244CCXHJcbiAqIOWPguiAgyBbW0V2ZW50VHlwZV1dXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQW5pbWF0aW9uJylcclxuQGhlbHAoJ2kxOG46Y2MuQW5pbWF0aW9uJylcclxuQGV4ZWN1dGlvbk9yZGVyKDk5KVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuQG1lbnUoJ0NvbXBvbmVudHMvQW5pbWF0aW9uJylcclxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiBleHRlbmRzIEV2ZW50aWZ5KENvbXBvbmVudCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyBjbGlwcyB0aGlzIGNvbXBvbmVudCBnb3Zlcm5zLlxyXG4gICAgICogV2hlbiBzZXQsIGFzc29jaWF0ZWQgYW5pbWF0aW9uIHN0YXRlIG9mIGVhY2ggZXhpc3RpbmcgY2xpcCB3aWxsIGJlIHN0b3BwZWQuXHJcbiAgICAgKiBJZiB0aGUgZXhpc3RpbmcgZGVmYXVsdCBjbGlwIGlzIG5vdCBpbiB0aGUgc2V0IG9mIG5ldyBjbGlwcywgZGVmYXVsdCBjbGlwIHdpbGwgYmUgcmVzZXQgdG8gbnVsbC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u5q2k57uE5Lu2566h55CG55qE5Ymq6L6R44CCXHJcbiAgICAgKiDorr7nva7ml7bvvIzlt7LmnInliarovpHlhbPogZTnmoTliqjnlLvnirbmgIHlsIbooqvlgZzmraLvvJvoi6Xpu5jorqTliarovpHkuI3lnKjmlrDnmoTliqjnlLvliarovpHkuK3vvIzlsIbooqvph43nva7kuLrnqbrjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoW0FuaW1hdGlvbkNsaXBdKVxyXG4gICAgQHRvb2x0aXAoJ+atpOWKqOeUu+e7hOS7tueuoeeQhueahOWKqOeUu+WJqui+kScpXHJcbiAgICBnZXQgY2xpcHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGlwcztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgY2xpcHMgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Nyb3NzRmFkZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jcm9zc0ZhZGUuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUmVtb3ZlIHN0YXRlIGZvciBvbGQgYXV0b21hdGljIGNsaXBzLlxyXG4gICAgICAgIGZvciAoY29uc3QgY2xpcCBvZiB0aGlzLl9jbGlwcykge1xyXG4gICAgICAgICAgICBpZiAoY2xpcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlU3RhdGVPZkF1dG9tYXRpY0NsaXAoY2xpcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ3JlYXRlIHN0YXRlIGZvciBuZXcgY2xpcHMuXHJcbiAgICAgICAgZm9yIChjb25zdCBjbGlwIG9mIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChjbGlwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVN0YXRlKGNsaXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIERlZmF1bHQgY2xpcCBzaG91bGQgYmUgaW4gdGhlIGxpc3Qgb2YgYXV0b21hdGljIGNsaXBzLlxyXG4gICAgICAgIGNvbnN0IG5ld0RlZmF1bHRDbGlwID0gdmFsdWUuZmluZCgoY2xpcCkgPT4gZXF1YWxDbGlwcyhjbGlwLCB0aGlzLl9kZWZhdWx0Q2xpcCkpO1xyXG4gICAgICAgIGlmIChuZXdEZWZhdWx0Q2xpcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0Q2xpcCA9IG5ld0RlZmF1bHRDbGlwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRDbGlwID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NsaXBzID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgZGVmYXVsdCBjbGlwLlxyXG4gICAgICogQGVuXHJcbiAgICAgKiDojrflj5bmiJborr7nva7pu5jorqTliarovpHjgIJcclxuICAgICAqIOiuvue9ruaXtu+8jOiLpeaMh+WumueahOWJqui+keS4jeWcqCBgdGhpcy5jbGlwc2Ag5Lit5YiZ5Lya6KKr6Ieq5Yqo5re75Yqg6IezIGB0aGlzLmNsaXBzYOOAglxyXG4gICAgICogQHNlZSBbW3BsYXlPbkxvYWRdXVxyXG4gICAgICovXHJcbiAgICBAdHlwZShBbmltYXRpb25DbGlwKVxyXG4gICAgQHRvb2x0aXAoJ+m7mOiupOWKqOeUu+WJqui+kScpXHJcbiAgICBnZXQgZGVmYXVsdENsaXAgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZhdWx0Q2xpcDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZGVmYXVsdENsaXAgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZGVmYXVsdENsaXAgPSB2YWx1ZTtcclxuICAgICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaXNCb3VuZGVkRGVmYXVsdENsaXAgPSB0aGlzLl9jbGlwcy5maW5kSW5kZXgoKGNsaXApID0+IGVxdWFsQ2xpcHMoY2xpcCwgdmFsdWUpKSA+PSAwO1xyXG4gICAgICAgIGlmICghaXNCb3VuZGVkRGVmYXVsdENsaXApIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xpcHMucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU3RhdGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIEV2ZW50VHlwZSA9IEV2ZW50VHlwZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciB0aGUgZGVmYXVsdCBjbGlwIHNob3VsZCBnZXQgaW50byBwbGF5aW5nIHdoZW4gdGhpcyBjb21wb25lbnRzIHN0YXJ0cy5cclxuICAgICAqIE5vdGUsIHRoaXMgZmllbGQgdGFrZXMgbm8gZWZmZWN0IGlmIGBjcm9zc0ZhZGUoKWAgb3IgYHBsYXkoKWAgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSB0aGlzIGNvbXBvbmVudCBzdGFydHMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaYr+WQpuWcqOe7hOS7tuW8gOWni+i/kOihjOaXtuiHquWKqOaSreaUvum7mOiupOWJqui+keOAglxyXG4gICAgICog5rOo5oSP77yM6Iul5Zyo57uE5Lu25byA5aeL6L+Q6KGM5YmN6LCD55So5LqGIGBjcm9zc0ZhZGVgIOaIliBgcGxheSgpYO+8jOatpOWtl+auteWwhuS4jeS8mueUn+aViOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAdG9vbHRpcCgn5piv5ZCm5Zyo5Yqo55S757uE5Lu25byA5aeL6L+Q6KGM5pe26Ieq5Yqo5pKt5pS+6buY6K6k5Yqo55S75Ymq6L6RJylcclxuICAgIHB1YmxpYyBwbGF5T25Mb2FkID0gZmFsc2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcm9zc0ZhZGUgPSBuZXcgQ3Jvc3NGYWRlKCk7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9uYW1lVG9TdGF0ZTogUmVjb3JkPHN0cmluZywgQW5pbWF0aW9uU3RhdGU+ID0gY3JlYXRlTWFwKHRydWUpO1xyXG5cclxuICAgIEB0eXBlKFtBbmltYXRpb25DbGlwXSlcclxuICAgIHByb3RlY3RlZCBfY2xpcHM6IChBbmltYXRpb25DbGlwIHwgbnVsbClbXSA9IFtdO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZGVmYXVsdENsaXA6IEFuaW1hdGlvbkNsaXAgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgaWYgYGNyb3NzRmFkZSgpYCBvciBgcGxheSgpYCBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlIHRoaXMgY29tcG9uZW50IHN0YXJ0cy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfaGFzQmVlblBsYXllZCA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBvbkxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuY2xpcHMgPSB0aGlzLl9jbGlwcztcclxuICAgICAgICBmb3IgKGNvbnN0IHN0YXRlTmFtZSBpbiB0aGlzLl9uYW1lVG9TdGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX25hbWVUb1N0YXRlW3N0YXRlTmFtZV07XHJcbiAgICAgICAgICAgIHN0YXRlLmluaXRpYWxpemUodGhpcy5ub2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0ICgpIHtcclxuICAgICAgICBpZiAoKCFFRElUT1IgfHwgbGVnYWN5Q0MuR0FNRV9WSUVXKSAmJiAodGhpcy5wbGF5T25Mb2FkICYmICF0aGlzLl9oYXNCZWVuUGxheWVkKSAmJiB0aGlzLl9kZWZhdWx0Q2xpcCkge1xyXG4gICAgICAgICAgICB0aGlzLmNyb3NzRmFkZSh0aGlzLl9kZWZhdWx0Q2xpcC5uYW1lLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9jcm9zc0ZhZGUucmVzdW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fY3Jvc3NGYWRlLnBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fY3Jvc3NGYWRlLnN0b3AoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5fbmFtZVRvU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9uYW1lVG9TdGF0ZVtuYW1lXTtcclxuICAgICAgICAgICAgc3RhdGUuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9uYW1lVG9TdGF0ZSA9IGNyZWF0ZU1hcCh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3dpdGNoIHRvIHBsYXkgc3BlY2lmaWVkIGFuaW1hdGlvbiBzdGF0ZSwgd2l0aG91dCBmYWRpbmcuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOeri+WNs+WIh+aNouWIsOaMh+WumuWKqOeUu+eKtuaAgeOAglxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIGFuaW1hdGlvbiB0byBiZSBwbGF5ZWQsIGlmIGFic2VudCwgdGhlIGRlZmF1bHQgY2xpcCB3aWxsIGJlIHBsYXllZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGxheSAobmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX2hhc0JlZW5QbGF5ZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmICghbmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RlZmF1bHRDbGlwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gdGhpcy5fZGVmYXVsdENsaXAubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyb3NzRmFkZShuYW1lLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU21vb3RobHkgc3dpdGNoIHRvIHBsYXkgc3BlY2lmaWVkIGFuaW1hdGlvbiBzdGF0ZS5cclxuICAgICAqIEB6blxyXG4gICAgICog5bmz5ruR5Zyw5YiH5o2i5Yiw5oyH5a6a5Yqo55S754q25oCB44CCXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgYW5pbWF0aW9uIHRvIHN3aXRjaCB0b1xyXG4gICAgICogQHBhcmFtIGR1cmF0aW9uIFRoZSBkdXJhdGlvbiBvZiB0aGUgY3Jvc3MgZmFkZSwgZGVmYXVsdCB2YWx1ZSBpcyAwLjNzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjcm9zc0ZhZGUgKG5hbWU6IHN0cmluZywgZHVyYXRpb24gPSAwLjMpIHtcclxuICAgICAgICB0aGlzLl9oYXNCZWVuUGxheWVkID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX25hbWVUb1N0YXRlW25hbWVdO1xyXG4gICAgICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jcm9zc0ZhZGUucGxheSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jcm9zc0ZhZGUuY3Jvc3NGYWRlKHN0YXRlLCBkdXJhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQYXVzZSBhbGwgYW5pbWF0aW9uIHN0YXRlcyBhbmQgYWxsIHN3aXRjaGluZy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5pqC5YGc5omA5pyJ5Yqo55S754q25oCB77yM5bm25pqC5YGc5omA5pyJ5YiH5o2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fY3Jvc3NGYWRlLnBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlc3VtZSBhbGwgYW5pbWF0aW9uIHN0YXRlcyBhbmQgYWxsIHN3aXRjaGluZy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5oGi5aSN5omA5pyJ5Yqo55S754q25oCB77yM5bm25oGi5aSN5omA5pyJ5YiH5o2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXN1bWUgKCkge1xyXG4gICAgICAgIHRoaXMuX2Nyb3NzRmFkZS5yZXN1bWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3RvcCBhbGwgYW5pbWF0aW9uIHN0YXRlcyBhbmQgYWxsIHN3aXRjaGluZy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YGc5q2i5omA5pyJ5Yqo55S754q25oCB77yM5bm25YGc5q2i5omA5pyJ5YiH5o2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdG9wICgpIHtcclxuICAgICAgICB0aGlzLl9jcm9zc0ZhZGUuc3RvcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgc3BlY2lmaWVkIGFuaW1hdGlvbiBzdGF0ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oyH5a6a55qE5Yqo55S754q25oCB44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBwbGVhc2UgdXNlIFtbZ2V0U3RhdGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QW5pbWF0aW9uU3RhdGUgKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgc3BlY2lmaWVkIGFuaW1hdGlvbiBzdGF0ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oyH5a6a55qE5Yqo55S754q25oCB44CCXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgYW5pbWF0aW9uXHJcbiAgICAgKiBAcmV0dXJucyBJZiBubyBhbmltYXRpb24gZm91bmQsIHJldHVybiBudWxsLCBvdGhlcndpc2UgdGhlIGNvcnJlc3BvbmQgYW5pbWF0aW9uIHN0YXRlIGlzIHJldHVybmVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTdGF0ZSAobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9uYW1lVG9TdGF0ZVtuYW1lXTtcclxuICAgICAgICBpZiAoc3RhdGUgJiYgIXN0YXRlLmN1cnZlTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHN0YXRlLmluaXRpYWxpemUodGhpcy5ub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlIHx8IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENyZWF0ZXMgYSBzdGF0ZSBmb3Igc3BlY2lmaWVkIGNsaXAuXHJcbiAgICAgKiBJZiB0aGVyZSBpcyBhbHJlYWR5IGEgY2xpcCB3aXRoIHNhbWUgbmFtZSwgdGhlIGV4aXN0aW5nIGFuaW1hdGlvbiBzdGF0ZSB3aWxsIGJlIHN0b3BwZWQgYW5kIG92ZXJyaWRkZW4uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS9v+eUqOaMh+WumueahOWKqOeUu+WJqui+keWIm+W7uuS4gOS4quWKqOeUu+eKtuaAgeOAglxyXG4gICAgICog6Iul5oyH5a6a5ZCN56ew55qE5Yqo55S754q25oCB5bey5a2Y5Zyo77yM5bey5a2Y5Zyo55qE5Yqo55S754q25oCB5bCG5YWI6KKr6K6+5Li65YGc5q2i5bm26KKr6KaG55uW44CCXHJcbiAgICAgKiBAcGFyYW0gY2xpcCBUaGUgYW5pbWF0aW9uIGNsaXBcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBhbmltYXRpb24gc3RhdGUgbmFtZSwgaWYgYWJzZW50LCB0aGUgZGVmYXVsdCBjbGlwJ3MgbmFtZSB3aWxsIGJlIHVzZWRcclxuICAgICAqIEByZXR1cm5zIFRoZSBhbmltYXRpb24gc3RhdGUgY3JlYXRlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlU3RhdGUgKGNsaXA6IEFuaW1hdGlvbkNsaXAsIG5hbWU/OiBzdHJpbmcpIHtcclxuICAgICAgICBuYW1lID0gbmFtZSB8fCBjbGlwLm5hbWU7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTdGF0ZShuYW1lKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvQ3JlYXRlU3RhdGUoY2xpcCwgbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFN0b3BzIGFuZCByZW1vdmVzIHNwZWNpZmllZCBjbGlwLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlgZzmraLlubbnp7vpmaTmjIflrprnmoTliqjnlLvnirbmgIHjgIJcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBhbmltYXRpb24gc3RhdGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZVN0YXRlIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX25hbWVUb1N0YXRlW25hbWVdO1xyXG4gICAgICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICAgICAgICBzdGF0ZS5hbGxvd0xhc3RGcmFtZUV2ZW50KGZhbHNlKTtcclxuICAgICAgICAgICAgc3RhdGUuc3RvcCgpO1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbmFtZVRvU3RhdGVbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg5LiA5Liq5Yqo55S75Ymq6L6R5YiwIGB0aGlzLmNsaXBzYOS4reW5tuS7peatpOWJqui+keWIm+W7uuWKqOeUu+eKtuaAgeOAglxyXG4gICAgICogQGRlcHJlY2F0ZWQgcGxlYXNlIHVzZSBbW2NyZWF0ZVN0YXRlXV1cclxuICAgICAqIEBwYXJhbSBjbGlwIFRoZSBhbmltYXRpb24gY2xpcFxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIGFuaW1hdGlvbiBzdGF0ZSBuYW1lLCBpZiBhYnNlbnQsIHRoZSBkZWZhdWx0IGNsaXAncyBuYW1lIHdpbGwgYmUgdXNlZFxyXG4gICAgICogQHJldHVybnMgVGhlIGNyZWF0ZWQgYW5pbWF0aW9uIHN0YXRlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDbGlwIChjbGlwOiBBbmltYXRpb25DbGlwLCBuYW1lPzogc3RyaW5nKTogQW5pbWF0aW9uU3RhdGUge1xyXG4gICAgICAgIGlmICghQXJyYXlVdGlscy5jb250YWlucyh0aGlzLl9jbGlwcywgY2xpcCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xpcHMucHVzaChjbGlwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU3RhdGUoY2xpcCwgbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlbW92ZSBjbGlwIGZyb20gdGhlIGFuaW1hdGlvbiBsaXN0LiBUaGlzIHdpbGwgcmVtb3ZlIHRoZSBjbGlwIGFuZCBhbnkgYW5pbWF0aW9uIHN0YXRlcyBiYXNlZCBvbiBpdC48YnI+XHJcbiAgICAgKiBJZiB0aGVyZSBhcmUgYW5pbWF0aW9uIHN0YXRlcyBkZXBlbmQgb24gdGhlIGNsaXAgYXJlIHBsYXlpbmcgb3IgY2xpcCBpcyBkZWZhdWx0Q2xpcCwgaXQgd2lsbCBub3QgZGVsZXRlIHRoZSBjbGlwLjxicj5cclxuICAgICAqIEJ1dCBpZiBmb3JjZSBpcyB0cnVlLCB0aGVuIHdpbGwgYWx3YXlzIHJlbW92ZSB0aGUgY2xpcCBhbmQgYW55IGFuaW1hdGlvbiBzdGF0ZXMgYmFzZWQgb24gaXQuIElmIGNsaXAgaXMgZGVmYXVsdENsaXAsIGRlZmF1bHRDbGlwIHdpbGwgYmUgcmVzZXQgdG8gbnVsbFxyXG4gICAgICogQHpoXHJcbiAgICAgKiDku47liqjnlLvliJfooajkuK3np7vpmaTmjIflrprnmoTliqjnlLvliarovpHvvIw8YnIvPlxyXG4gICAgICog5aaC5p6c5L6d6LWW5LqOIGNsaXAg55qEIEFuaW1hdGlvblN0YXRlIOato+WcqOaSreaUvuaIluiAhSBjbGlwIOaYryBkZWZhdWx0Q2xpcCDnmoTor53vvIzpu5jorqTmmK/kuI3kvJrliKDpmaQgY2xpcCDnmoTjgII8YnIvPlxyXG4gICAgICog5L2G5piv5aaC5p6cIGZvcmNlIOWPguaVsOS4uiB0cnVl77yM5YiZ5Lya5by65Yi25YGc5q2i6K+l5Yqo55S777yM54S25ZCO56e76Zmk6K+l5Yqo55S75Ymq6L6R5ZKM55u45YWz55qE5Yqo55S744CC6L+Z5pe25YCZ5aaC5p6cIGNsaXAg5pivIGRlZmF1bHRDbGlw77yMZGVmYXVsdENsaXAg5bCG5Lya6KKr6YeN572u5Li6IG51bGzjgII8YnIvPlxyXG4gICAgICogQGRlcHJlY2F0ZWQgcGxlYXNlIHVzZSBbW3JlbW92ZVN0YXRlXV1cclxuICAgICAqIEBwYXJhbSBmb3JjZSAtIElmIGZvcmNlIGlzIHRydWUsIHRoZW4gd2lsbCBhbHdheXMgcmVtb3ZlIHRoZSBjbGlwIGFuZCBhbnkgYW5pbWF0aW9uIHN0YXRlcyBiYXNlZCBvbiBpdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUNsaXAgKGNsaXA6IEFuaW1hdGlvbkNsaXAsIGZvcmNlPzogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCByZW1vdmFsU3RhdGU6IEFuaW1hdGlvblN0YXRlIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLl9uYW1lVG9TdGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX25hbWVUb1N0YXRlW25hbWVdO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZUNsaXAgPSBzdGF0ZS5jbGlwO1xyXG4gICAgICAgICAgICBpZiAoc3RhdGVDbGlwID09PSBjbGlwKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmFsU3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2xpcCA9PT0gdGhpcy5fZGVmYXVsdENsaXApIHtcclxuICAgICAgICAgICAgaWYgKGZvcmNlKSB7IHRoaXMuX2RlZmF1bHRDbGlwID0gbnVsbDsgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghVEVTVCkgeyB3YXJuSUQoMzkwMik7IH1cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlbW92YWxTdGF0ZSAmJiByZW1vdmFsU3RhdGUuaXNQbGF5aW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChmb3JjZSkgeyByZW1vdmFsU3RhdGUuc3RvcCgpOyB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFURVNUKSB7IHdhcm5JRCgzOTAzKTsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jbGlwcyA9IHRoaXMuX2NsaXBzLmZpbHRlcigoaXRlbSkgPT4gaXRlbSAhPT0gY2xpcCk7XHJcblxyXG4gICAgICAgIGlmIChyZW1vdmFsU3RhdGUpIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX25hbWVUb1N0YXRlW3JlbW92YWxTdGF0ZS5uYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlZ2lzdGVyIGFuaW1hdGlvbiBldmVudCBjYWxsYmFjay48Ymc+XHJcbiAgICAgKiBUaGUgZXZlbnQgYXJndW1lbnRzIHdpbGwgcHJvdmlkZSB0aGUgQW5pbWF0aW9uU3RhdGUgd2hpY2ggZW1pdCB0aGUgZXZlbnQuPGJnPlxyXG4gICAgICogV2hlbiBwbGF5IGFuIGFuaW1hdGlvbiwgd2lsbCBhdXRvIHJlZ2lzdGVyIHRoZSBldmVudCBjYWxsYmFjayB0byB0aGUgQW5pbWF0aW9uU3RhdGUsPGJnPlxyXG4gICAgICogYW5kIHVucmVnaXN0ZXIgdGhlIGV2ZW50IGNhbGxiYWNrIGZyb20gdGhlIEFuaW1hdGlvblN0YXRlIHdoZW4gYW5pbWF0aW9uIHN0b3BwZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOazqOWGjOWKqOeUu+S6i+S7tuWbnuiwg+OAgjxiZz5cclxuICAgICAqIOWbnuiwg+eahOS6i+S7tumHjOWwhuS8mumZhOS4iuWPkemAgeS6i+S7tueahCBBbmltYXRpb25TdGF0ZeOAgjxiZz5cclxuICAgICAqIOW9k+aSreaUvuS4gOS4quWKqOeUu+aXtu+8jOS8muiHquWKqOWwhuS6i+S7tuazqOWGjOWIsOWvueW6lOeahCBBbmltYXRpb25TdGF0ZSDkuIrvvIzlgZzmraLmkq3mlL7ml7bkvJrlsIbkuovku7bku47ov5nkuKogQW5pbWF0aW9uU3RhdGUg5LiK5Y+W5raI5rOo5YaM44CCXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBUaGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gdG9cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgd2hlbiBldmVudCB0cmlnZ2VyZWRcclxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIGNhbGxlZSB3aGVuIGludm9rZSB0aGUgY2FsbGJhY2ssIGNvdWxkIGJlIGFic2VudFxyXG4gICAgICogQHJldHVybiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFja1xyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBvblBsYXk6IGZ1bmN0aW9uICh0eXBlLCBzdGF0ZSkge1xyXG4gICAgICogICAgIC8vIGNhbGxiYWNrXHJcbiAgICAgKiB9XHJcbiAgICAgKlxyXG4gICAgICogLy8gcmVnaXN0ZXIgZXZlbnQgdG8gYWxsIGFuaW1hdGlvblxyXG4gICAgICogYW5pbWF0aW9uLm9uKCdwbGF5JywgdGhpcy5vblBsYXksIHRoaXMpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbjxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4gKHR5cGU6IEV2ZW50VHlwZSwgY2FsbGJhY2s6IFRGdW5jdGlvbiwgdGhpc0FyZz86IGFueSwgb25jZT86IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCByZXQgPSBzdXBlci5vbih0eXBlLCBjYWxsYmFjaywgdGhpc0FyZywgb25jZSk7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09IEV2ZW50VHlwZS5MQVNURlJBTUUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3luY0FsbG93TGFzdEZyYW1lRXZlbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25jZTxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4gKHR5cGU6IEV2ZW50VHlwZSwgY2FsbGJhY2s6IFRGdW5jdGlvbiwgdGhpc0FyZz86IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHJldCA9IHN1cGVyLm9uY2UodHlwZSwgY2FsbGJhY2ssIHRoaXNBcmcpO1xyXG4gICAgICAgIGlmICh0eXBlID09PSBFdmVudFR5cGUuTEFTVEZSQU1FKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N5bmNBbGxvd0xhc3RGcmFtZUV2ZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFVucmVnaXN0ZXIgYW5pbWF0aW9uIGV2ZW50IGNhbGxiYWNrLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlj5bmtojms6jlhozliqjnlLvkuovku7blm57osIPjgIJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBldmVudCB0eXBlIHRvIHVucmVnaXN0ZXJcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byB1bnJlZ2lzdGVyXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IFRoZSBjYWxsZWUgb2YgdGhlIGNhbGxiYWNrLCBjb3VsZCBiZSBhYnNlbnRcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gdW5yZWdpc3RlciBldmVudCB0byBhbGwgYW5pbWF0aW9uXHJcbiAgICAgKiBhbmltYXRpb24ub2ZmKCdwbGF5JywgdGhpcy5vblBsYXksIHRoaXMpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvZmYgKHR5cGU6IEV2ZW50VHlwZSwgY2FsbGJhY2s/OiBGdW5jdGlvbiwgdGhpc0FyZz86IGFueSkge1xyXG4gICAgICAgIHN1cGVyLm9mZih0eXBlLCBjYWxsYmFjaywgdGhpc0FyZyk7XHJcbiAgICAgICAgaWYgKHR5cGUgPT09IEV2ZW50VHlwZS5MQVNURlJBTUUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3luY0Rpc2FsbG93TGFzdEZyYW1lRXZlbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVTdGF0ZSAoY2xpcDogQW5pbWF0aW9uQ2xpcCwgbmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uU3RhdGUoY2xpcCwgbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kb0NyZWF0ZVN0YXRlIChjbGlwOiBBbmltYXRpb25DbGlwLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2NyZWF0ZVN0YXRlKGNsaXAsIG5hbWUpO1xyXG4gICAgICAgIHN0YXRlLl9zZXRFdmVudFRhcmdldCh0aGlzKTtcclxuICAgICAgICBzdGF0ZS5hbGxvd0xhc3RGcmFtZUV2ZW50KHRoaXMuaGFzRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTEFTVEZSQU1FKSk7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZSkge1xyXG4gICAgICAgICAgICBzdGF0ZS5pbml0aWFsaXplKHRoaXMubm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX25hbWVUb1N0YXRlW3N0YXRlLm5hbWVdID0gc3RhdGU7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFN0YXRlQnlOYW1lT3JEZWZhdWx0Q2xpcCAobmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIGlmICghbmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RlZmF1bHRDbGlwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSB0aGlzLl9kZWZhdWx0Q2xpcC5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fbmFtZVRvU3RhdGVbbmFtZV07XHJcbiAgICAgICAgaWYgKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVtb3ZlU3RhdGVPZkF1dG9tYXRpY0NsaXAgKGNsaXA6IEFuaW1hdGlvbkNsaXApIHtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Zm9yaW5cclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5fbmFtZVRvU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9uYW1lVG9TdGF0ZVtuYW1lXTtcclxuICAgICAgICAgICAgaWYgKGVxdWFsQ2xpcHMoY2xpcCwgc3RhdGUuY2xpcCkpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnN0b3AoKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9uYW1lVG9TdGF0ZVtuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zeW5jQWxsb3dMYXN0RnJhbWVFdmVudCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTEFTVEZSQU1FKSkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHN0YXRlTmFtZSBpbiB0aGlzLl9uYW1lVG9TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZVRvU3RhdGVbc3RhdGVOYW1lXS5hbGxvd0xhc3RGcmFtZUV2ZW50KHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3N5bmNEaXNhbGxvd0xhc3RGcmFtZUV2ZW50ICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuTEFTVEZSQU1FKSkge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHN0YXRlTmFtZSBpbiB0aGlzLl9uYW1lVG9TdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZVRvU3RhdGVbc3RhdGVOYW1lXS5hbGxvd0xhc3RGcmFtZUV2ZW50KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIEFuaW1hdGlvbiB7XHJcbiAgICBleHBvcnQgdHlwZSBFdmVudFR5cGUgPSBFbnVtQWxpYXM8dHlwZW9mIEV2ZW50VHlwZT47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGVxdWFsQ2xpcHMgKGNsaXAxOiBBbmltYXRpb25DbGlwIHwgbnVsbCwgY2xpcDI6IEFuaW1hdGlvbkNsaXAgfCBudWxsKSB7XHJcbiAgICBpZiAoY2xpcDEgPT09IGNsaXAyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gISFjbGlwMSAmJiAhIWNsaXAyICYmIChjbGlwMS5uYW1lID09PSBjbGlwMi5uYW1lIHx8IGNsaXAxLl91dWlkID09PSBjbGlwMi5fdXVpZCk7XHJcbn1cclxuIl19