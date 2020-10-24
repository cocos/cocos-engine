(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../scene-graph/node.js", "./bound-target.js", "./playable.js", "./types.js", "../default-constants.js", "./target-path.js", "./skeletal-animation-blending.js", "../global-exports.js", "../value-types/enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../scene-graph/node.js"), require("./bound-target.js"), require("./playable.js"), require("./types.js"), require("../default-constants.js"), require("./target-path.js"), require("./skeletal-animation-blending.js"), require("../global-exports.js"), require("../value-types/enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.node, global.boundTarget, global.playable, global.types, global.defaultConstants, global.targetPath, global.skeletalAnimationBlending, global.globalExports, global._enum);
    global.animationState = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _node, _boundTarget, _playable, _types, _defaultConstants, _targetPath, _skeletalAnimationBlending, _globalExports, _enum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AnimationState = _exports.ICurveInstance = _exports.EventType = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en The event type supported by Animation
   * @zh Animation 支持的事件类型。
   */
  var EventType;
  _exports.EventType = EventType;

  (function (EventType) {
    EventType["PLAY"] = "play";
    EventType["STOP"] = "stop";
    EventType["PAUSE"] = "pause";
    EventType["RESUME"] = "resume";
    EventType["LASTFRAME"] = "lastframe";
    EventType["FINISHED"] = "finished";
  })(EventType || (_exports.EventType = EventType = {}));

  (0, _enum.ccenum)(EventType);

  var ICurveInstance = /*#__PURE__*/function () {
    function ICurveInstance(runtimeCurve, target, boundTarget) {
      _classCallCheck(this, ICurveInstance);

      this.commonTargetIndex = void 0;
      this._curve = void 0;
      this._boundTarget = void 0;
      this._rootTargetProperty = void 0;
      this._curveDetail = void 0;
      this._curve = runtimeCurve.curve;
      this._curveDetail = runtimeCurve;
      this._boundTarget = boundTarget;
    }

    _createClass(ICurveInstance, [{
      key: "applySample",
      value: function applySample(ratio, index, lerpRequired, samplerResultCache, weight) {
        if (this._curve.empty()) {
          return;
        }

        var value;

        if (!this._curve.hasLerp() || !lerpRequired) {
          value = this._curve.valueAt(index);
        } else {
          value = this._curve.valueBetween(ratio, samplerResultCache.from, samplerResultCache.fromRatio, samplerResultCache.to, samplerResultCache.toRatio);
        }

        this._setValue(value, weight);
      }
    }, {
      key: "_setValue",
      value: function _setValue(value, weight) {
        this._boundTarget.setValue(value);
      }
    }, {
      key: "propertyName",
      get: function get() {
        return this._rootTargetProperty || '';
      }
    }, {
      key: "curveDetail",
      get: function get() {
        return this._curveDetail;
      }
    }]);

    return ICurveInstance;
  }();
  /**
   * The curves in ISamplerSharedGroup share a same keys.
   */


  _exports.ICurveInstance = ICurveInstance;

  function makeSamplerSharedGroup(sampler) {
    return {
      sampler: sampler,
      curves: [],
      samplerResultCache: {
        from: 0,
        fromRatio: 0,
        to: 0,
        toRatio: 0
      }
    };
  }

  var InvalidIndex = -1;
  /**
   * @en
   * The AnimationState gives full control over animation playback process.
   * In most cases the Animation Component is sufficient and easier to use. Use the AnimationState if you need full control.
   * @zh
   * AnimationState 完全控制动画播放过程。<br/>
   * 大多数情况下 动画组件 是足够和易于使用的。如果您需要更多的动画控制接口，请使用 AnimationState。
   *
   */

  var AnimationState = /*#__PURE__*/function (_Playable) {
    _inherits(AnimationState, _Playable);

    _createClass(AnimationState, [{
      key: "clip",

      /**
       * @en The clip that is being played by this animation state.
       * @zh 此动画状态正在播放的剪辑。
       */
      get: function get() {
        return this._clip;
      }
      /**
       * @en The name of the playing animation.
       * @zh 动画的名字。
       */

    }, {
      key: "name",
      get: function get() {
        return this._name;
      }
    }, {
      key: "length",
      get: function get() {
        return this.duration;
      }
      /**
       * @en
       * Wrapping mode of the playing animation.
       * Notice : dynamic change wrapMode will reset time and repeatCount property
       * @zh
       * 动画循环方式。
       * 需要注意的是，动态修改 wrapMode 时，会重置 time 以及 repeatCount。
       * @default: WrapMode.Normal
       */

    }, {
      key: "wrapMode",
      get: function get() {
        return this._wrapMode;
      },
      set: function set(value) {
        this._wrapMode = value;

        if (_defaultConstants.EDITOR) {
          return;
        } // dynamic change wrapMode will need reset time to 0


        this.time = 0;

        if (value & _types.WrapModeMask.Loop) {
          this.repeatCount = Infinity;
        } else {
          this.repeatCount = 1;
        }
      }
      /**
       * @en The animation's iteration count property.
       *
       * A real number greater than or equal to zero (including positive infinity) representing the number of times
       * to repeat the animation node.
       *
       * Values less than zero and NaN values are treated as the value 1.0 for the purpose of timing model
       * calculations.
       *
       * @zh 迭代次数，指动画播放多少次后结束, normalize time。 如 2.5（2次半）。
       *
       * @default 1
       */

    }, {
      key: "repeatCount",
      get: function get() {
        return this._repeatCount;
      },
      set: function set(value) {
        this._repeatCount = value;
        var shouldWrap = this._wrapMode & _types.WrapModeMask.ShouldWrap;
        var reverse = (this.wrapMode & _types.WrapModeMask.Reverse) === _types.WrapModeMask.Reverse;

        if (value === Infinity && !shouldWrap && !reverse) {
          this._process = this.simpleProcess;
        } else {
          this._process = this.process;
        }
      }
      /**
       * @en The start delay which represents the number of seconds from an animation's start time to the start of
       * the active interval.
       * @zh 延迟多少秒播放。
       * @default 0
       */

    }, {
      key: "delay",
      get: function get() {
        return this._delay;
      },
      set: function set(value) {
        this._delayTime = this._delay = value;
      } // http://www.w3.org/TR/web-animations/#idl-def-AnimationTiming

      /**
       * @en The iteration duration of this animation in seconds. (length)
       * @zh 单次动画的持续时间，秒。（动画长度）
       * @readOnly
       */

    }]);

    function AnimationState(clip) {
      var _this;

      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      _classCallCheck(this, AnimationState);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AnimationState).call(this));
      _this.duration = 1;
      _this.speed = 1;
      _this.time = 0;
      _this.weight = 0;
      _this.frameRate = 0;
      _this._wrapMode = _types.WrapMode.Normal;
      _this._repeatCount = 1;
      _this._currentFramePlayed = false;
      _this._delay = 0;
      _this._delayTime = 0;
      _this._wrappedInfo = new _types.WrappedInfo();
      _this._lastWrapInfo = null;
      _this._lastWrapInfoEvent = null;
      _this._process = _this.process;
      _this._target = null;
      _this._targetNode = null;
      _this._clip = void 0;
      _this._name = void 0;
      _this._lastIterations = void 0;
      _this._samplerSharedGroups = [];
      _this._commonTargetStatuses = [];
      _this._curveLoaded = false;
      _this._ignoreIndex = InvalidIndex;
      _this._blendStateBuffer = null;
      _this._blendStateWriters = [];
      _this._allowLastFrame = false;
      _this._clip = clip;
      _this._name = name || clip && clip.name;
      return _this;
    }

    _createClass(AnimationState, [{
      key: "initialize",
      value: function initialize(root, propertyCurves) {
        var _legacyCC$director$ge,
            _legacyCC$director$ge2,
            _this2 = this;

        if (this._curveLoaded) {
          return;
        }

        this._curveLoaded = true;

        this._destroyBlendStateWriters();

        this._samplerSharedGroups.length = 0;
        this._blendStateBuffer = (_legacyCC$director$ge = (_legacyCC$director$ge2 = _globalExports.legacyCC.director.getAnimationManager()) === null || _legacyCC$director$ge2 === void 0 ? void 0 : _legacyCC$director$ge2.blendState) !== null && _legacyCC$director$ge !== void 0 ? _legacyCC$director$ge : null;
        this._targetNode = root;
        var clip = this._clip;
        this.duration = clip.duration;
        this.speed = clip.speed;
        this.wrapMode = clip.wrapMode;
        this.frameRate = clip.sample;

        if ((this.wrapMode & _types.WrapModeMask.Loop) === _types.WrapModeMask.Loop) {
          this.repeatCount = Infinity;
        } else {
          this.repeatCount = 1;
        }
        /**
         * Create the bound target. Especially optimized for skeletal case.
         */


        var createBoundTargetOptimized = function createBoundTargetOptimized(createFn, rootTarget, path, valueAdapter, isConstant) {
          if (!isTargetingTRS(path) || !_this2._blendStateBuffer) {
            return createFn(rootTarget, path, valueAdapter);
          } else {
            var targetNode = _targetPath.evaluatePath.apply(void 0, [rootTarget].concat(_toConsumableArray(path.slice(0, path.length - 1))));

            if (targetNode !== null && targetNode instanceof _node.Node) {
              var propertyName = path[path.length - 1];
              var blendStateWriter = (0, _skeletalAnimationBlending.createBlendStateWriter)(_this2._blendStateBuffer, targetNode, propertyName, _this2, isConstant);

              _this2._blendStateWriters.push(blendStateWriter);

              return createFn(rootTarget, [], blendStateWriter);
            }
          }

          return null;
        };

        this._commonTargetStatuses = clip.commonTargets.map(function (commonTarget, index) {
          var target = createBoundTargetOptimized(_boundTarget.createBufferedTarget, root, commonTarget.modifiers, commonTarget.valueAdapter, false);

          if (target === null) {
            return null;
          } else {
            return {
              target: target,
              changed: false
            };
          }
        });

        if (!propertyCurves) {
          propertyCurves = clip.getPropertyCurves();
        }

        var _loop = function _loop(iPropertyCurve) {
          var propertyCurve = propertyCurves[iPropertyCurve];

          var samplerSharedGroup = _this2._samplerSharedGroups.find(function (value) {
            return value.sampler === propertyCurve.sampler;
          });

          if (!samplerSharedGroup) {
            samplerSharedGroup = makeSamplerSharedGroup(propertyCurve.sampler);

            _this2._samplerSharedGroups.push(samplerSharedGroup);
          }

          var rootTarget = void 0;

          if (typeof propertyCurve.commonTarget === 'undefined') {
            rootTarget = root;
          } else {
            var commonTargetStatus = _this2._commonTargetStatuses[propertyCurve.commonTarget];

            if (!commonTargetStatus) {
              return "continue";
            }

            rootTarget = commonTargetStatus.target.peek();
          }

          var boundTarget = createBoundTargetOptimized(_boundTarget.createBoundTarget, rootTarget, propertyCurve.modifiers, propertyCurve.valueAdapter, propertyCurve.curve.constant());

          if (boundTarget === null) {// warn(`Failed to bind "${root.name}" to curve in clip ${clip.name}: ${err}`);
          } else {
            var curveInstance = new ICurveInstance(propertyCurve, rootTarget, boundTarget);
            curveInstance.commonTargetIndex = propertyCurve.commonTarget;
            samplerSharedGroup.curves.push(curveInstance);
          }
        };

        for (var iPropertyCurve = 0; iPropertyCurve < propertyCurves.length; ++iPropertyCurve) {
          var _ret = _loop(iPropertyCurve);

          if (_ret === "continue") continue;
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._destroyBlendStateWriters();
      }
      /**
       * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
       * To process animation events, use `Animation` instead.
       */

    }, {
      key: "emit",
      value: function emit() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _globalExports.legacyCC.director.getAnimationManager().pushDelayEvent(this._emit, this, args);
      }
      /**
       * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
       * To process animation events, use `Animation` instead.
       */

    }, {
      key: "on",
      value: function on(type, callback, target) {
        if (this._target && this._target.isValid) {
          return this._target.on(type, callback, target);
        } else {
          return null;
        }
      }
      /**
       * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
       * To process animation events, use `Animation` instead.
       */

    }, {
      key: "once",
      value: function once(type, callback, target) {
        if (this._target && this._target.isValid) {
          return this._target.once(type, callback, target);
        } else {
          return null;
        }
      }
      /**
       * @deprecated Since V1.1.1, animation states were no longer defined as event targets.
       * To process animation events, use `Animation` instead.
       */

    }, {
      key: "off",
      value: function off(type, callback, target) {
        if (this._target && this._target.isValid) {
          this._target.off(type, callback, target);
        }
      }
      /**
       * @zh
       * 是否允许触发 `LastFrame` 事件。
       * @en
       * Whether `LastFrame` should be triggered.
       * @param allowed True if the last frame events may be triggered.
       */

    }, {
      key: "allowLastFrameEvent",
      value: function allowLastFrameEvent(allowed) {
        this._allowLastFrame = allowed;
      }
    }, {
      key: "_setEventTarget",
      value: function _setEventTarget(target) {
        this._target = target;
      }
    }, {
      key: "setTime",
      value: function setTime(time) {
        this._currentFramePlayed = false;
        this.time = time || 0;

        if (!_defaultConstants.EDITOR) {
          this._lastWrapInfoEvent = null;
          this._ignoreIndex = InvalidIndex;
          var info = this.getWrappedInfo(time, this._wrappedInfo);
          var direction = info.direction;

          var frameIndex = this._clip.getEventGroupIndexAtRatio(info.ratio); // only ignore when time not on a frame index


          if (frameIndex < 0) {
            frameIndex = ~frameIndex - 1; // if direction is inverse, then increase index

            if (direction < 0) {
              frameIndex += 1;
            }

            this._ignoreIndex = frameIndex;
          }
        }
      }
    }, {
      key: "update",
      value: function update(delta) {
        // calculate delay time
        if (this._delayTime > 0) {
          this._delayTime -= delta;

          if (this._delayTime > 0) {
            // still waiting
            return;
          }
        } // make first frame perfect
        // var playPerfectFirstFrame = (this.time === 0);


        if (this._currentFramePlayed) {
          this.time += delta * this.speed;
        } else {
          this._currentFramePlayed = true;
        }

        this._process();
      }
    }, {
      key: "_needReverse",
      value: function _needReverse(currentIterations) {
        var wrapMode = this.wrapMode;
        var needReverse = false;

        if ((wrapMode & _types.WrapModeMask.PingPong) === _types.WrapModeMask.PingPong) {
          var isEnd = currentIterations - (currentIterations | 0) === 0;

          if (isEnd && currentIterations > 0) {
            currentIterations -= 1;
          }

          var isOddIteration = currentIterations & 1;

          if (isOddIteration) {
            needReverse = !needReverse;
          }
        }

        if ((wrapMode & _types.WrapModeMask.Reverse) === _types.WrapModeMask.Reverse) {
          needReverse = !needReverse;
        }

        return needReverse;
      }
    }, {
      key: "getWrappedInfo",
      value: function getWrappedInfo(time, info) {
        info = info || new _types.WrappedInfo();
        var stopped = false;
        var duration = this.duration;
        var repeatCount = this.repeatCount;
        var currentIterations = time > 0 ? time / duration : -(time / duration);

        if (currentIterations >= repeatCount) {
          currentIterations = repeatCount;
          stopped = true;
          var tempRatio = repeatCount - (repeatCount | 0);

          if (tempRatio === 0) {
            tempRatio = 1; // 如果播放过，动画不复位
          }

          time = tempRatio * duration * (time > 0 ? 1 : -1);
        }

        if (time > duration) {
          var tempTime = time % duration;
          time = tempTime === 0 ? duration : tempTime;
        } else if (time < 0) {
          time = time % duration;

          if (time !== 0) {
            time += duration;
          }
        }

        var needReverse = false;
        var shouldWrap = this._wrapMode & _types.WrapModeMask.ShouldWrap;

        if (shouldWrap) {
          needReverse = this._needReverse(currentIterations);
        }

        var direction = needReverse ? -1 : 1;

        if (this.speed < 0) {
          direction *= -1;
        } // calculate wrapped time


        if (shouldWrap && needReverse) {
          time = duration - time;
        }

        info.ratio = time / duration;
        info.time = time;
        info.direction = direction;
        info.stopped = stopped;
        info.iterations = currentIterations;
        return info;
      }
    }, {
      key: "sample",
      value: function sample() {
        var info = this.getWrappedInfo(this.time, this._wrappedInfo);

        this._sampleCurves(info.ratio);

        if (!_defaultConstants.EDITOR) {
          this._sampleEvents(info);
        }

        return info;
      }
    }, {
      key: "process",
      value: function process() {
        // sample
        var info = this.sample();

        if (this._allowLastFrame) {
          var lastInfo;

          if (!this._lastWrapInfo) {
            lastInfo = this._lastWrapInfo = new _types.WrappedInfo(info);
          } else {
            lastInfo = this._lastWrapInfo;
          }

          if (this.repeatCount > 1 && (info.iterations | 0) > (lastInfo.iterations | 0)) {
            this.emit(EventType.LASTFRAME, this);
          }

          lastInfo.set(info);
        }

        if (info.stopped) {
          this.stop();
          this.emit(EventType.FINISHED, this);
        }
      }
    }, {
      key: "simpleProcess",
      value: function simpleProcess() {
        var duration = this.duration;
        var time = this.time % duration;

        if (time < 0) {
          time += duration;
        }

        var ratio = time / duration;

        this._sampleCurves(ratio);

        if (!_defaultConstants.EDITOR) {
          if (this._clip.hasEvents()) {
            this._sampleEvents(this.getWrappedInfo(this.time, this._wrappedInfo));
          }
        }

        if (this._allowLastFrame) {
          if (this._lastIterations === undefined) {
            this._lastIterations = ratio;
          }

          if (this.time > 0 && this._lastIterations > ratio || this.time < 0 && this._lastIterations < ratio) {
            this.emit(EventType.LASTFRAME, this);
          }

          this._lastIterations = ratio;
        }
      }
    }, {
      key: "cache",
      value: function cache(frames) {}
    }, {
      key: "onPlay",
      value: function onPlay() {
        this.setTime(0);
        this._delayTime = this._delay;

        this._onReplayOrResume();

        this.emit(EventType.PLAY, this);
      }
    }, {
      key: "onStop",
      value: function onStop() {
        if (!this.isPaused) {
          this._onPauseOrStop();
        }

        this.emit(EventType.STOP, this);
      }
    }, {
      key: "onResume",
      value: function onResume() {
        this._onReplayOrResume();

        this.emit(EventType.RESUME, this);
      }
    }, {
      key: "onPause",
      value: function onPause() {
        this._onPauseOrStop();

        this.emit(EventType.PAUSE, this);
      }
    }, {
      key: "_sampleCurves",
      value: function _sampleCurves(ratio) {
        // Before we sample, we pull values of common targets.
        for (var iCommonTarget = 0; iCommonTarget < this._commonTargetStatuses.length; ++iCommonTarget) {
          var commonTargetStatus = this._commonTargetStatuses[iCommonTarget];

          if (!commonTargetStatus) {
            continue;
          }

          commonTargetStatus.target.pull();
          commonTargetStatus.changed = false;
        }

        for (var iSamplerSharedGroup = 0, szSamplerSharedGroup = this._samplerSharedGroups.length; iSamplerSharedGroup < szSamplerSharedGroup; ++iSamplerSharedGroup) {
          var samplerSharedGroup = this._samplerSharedGroups[iSamplerSharedGroup];
          var sampler = samplerSharedGroup.sampler;
          var samplerResultCache = samplerSharedGroup.samplerResultCache;
          var index = 0;
          var lerpRequired = false;

          if (!sampler) {
            index = 0;
          } else {
            index = sampler.sample(ratio);

            if (index < 0) {
              index = ~index;

              if (index <= 0) {
                index = 0;
              } else if (index >= sampler.ratios.length) {
                index = sampler.ratios.length - 1;
              } else {
                lerpRequired = true;
                samplerResultCache.from = index - 1;
                samplerResultCache.fromRatio = sampler.ratios[samplerResultCache.from];
                samplerResultCache.to = index;
                samplerResultCache.toRatio = sampler.ratios[samplerResultCache.to];
                index = samplerResultCache.from;
              }
            }
          }

          for (var iCurveInstance = 0, szCurves = samplerSharedGroup.curves.length; iCurveInstance < szCurves; ++iCurveInstance) {
            var curveInstance = samplerSharedGroup.curves[iCurveInstance];
            curveInstance.applySample(ratio, index, lerpRequired, samplerResultCache, this.weight);

            if (curveInstance.commonTargetIndex !== undefined) {
              var _commonTargetStatus = this._commonTargetStatuses[curveInstance.commonTargetIndex];

              if (_commonTargetStatus) {
                _commonTargetStatus.changed = true;
              }
            }
          }
        } // After sample, we push values of common targets.


        for (var _iCommonTarget = 0; _iCommonTarget < this._commonTargetStatuses.length; ++_iCommonTarget) {
          var _commonTargetStatus2 = this._commonTargetStatuses[_iCommonTarget];

          if (!_commonTargetStatus2) {
            continue;
          }

          if (_commonTargetStatus2.changed) {
            _commonTargetStatus2.target.push();
          }
        }
      }
    }, {
      key: "_sampleEvents",
      value: function _sampleEvents(wrapInfo) {
        var length = this._clip.eventGroups.length;
        var direction = wrapInfo.direction;

        var eventIndex = this._clip.getEventGroupIndexAtRatio(wrapInfo.ratio);

        if (eventIndex < 0) {
          eventIndex = ~eventIndex - 1; // If direction is inverse, increase index.

          if (direction < 0) {
            eventIndex += 1;
          }
        }

        if (this._ignoreIndex !== eventIndex) {
          this._ignoreIndex = InvalidIndex;
        }

        wrapInfo.frameIndex = eventIndex;

        if (!this._lastWrapInfoEvent) {
          this._fireEvent(eventIndex);

          this._lastWrapInfoEvent = new _types.WrappedInfo(wrapInfo);
          return;
        }

        var wrapMode = this.wrapMode;
        var currentIterations = wrapIterations(wrapInfo.iterations);
        var lastWrappedInfo = this._lastWrapInfoEvent;
        var lastIterations = wrapIterations(lastWrappedInfo.iterations);
        var lastIndex = lastWrappedInfo.frameIndex;
        var lastDirection = lastWrappedInfo.direction;
        var iterationsChanged = lastIterations !== -1 && currentIterations !== lastIterations;

        if (lastIndex === eventIndex && iterationsChanged && length === 1) {
          this._fireEvent(0);
        } else if (lastIndex !== eventIndex || iterationsChanged) {
          direction = lastDirection;

          do {
            if (lastIndex !== eventIndex) {
              if (direction === -1 && lastIndex === 0 && eventIndex > 0) {
                if ((wrapMode & _types.WrapModeMask.PingPong) === _types.WrapModeMask.PingPong) {
                  direction *= -1;
                } else {
                  lastIndex = length;
                }

                lastIterations++;
              } else if (direction === 1 && lastIndex === length - 1 && eventIndex < length - 1) {
                if ((wrapMode & _types.WrapModeMask.PingPong) === _types.WrapModeMask.PingPong) {
                  direction *= -1;
                } else {
                  lastIndex = -1;
                }

                lastIterations++;
              }

              if (lastIndex === eventIndex) {
                break;
              }

              if (lastIterations > currentIterations) {
                break;
              }
            }

            lastIndex += direction;

            _globalExports.legacyCC.director.getAnimationManager().pushDelayEvent(this._fireEvent, this, [lastIndex]);
          } while (lastIndex !== eventIndex && lastIndex > -1 && lastIndex < length);
        }

        this._lastWrapInfoEvent.set(wrapInfo);
      }
    }, {
      key: "_emit",
      value: function _emit(type, state) {
        if (this._target && this._target.isValid) {
          this._target.emit(type, type, state);
        }
      }
    }, {
      key: "_fireEvent",
      value: function _fireEvent(index) {
        if (!this._targetNode || !this._targetNode.isValid) {
          return;
        }

        var eventGroups = this._clip.eventGroups;

        if (index < 0 || index >= eventGroups.length || this._ignoreIndex === index) {
          return;
        }

        var eventGroup = eventGroups[index];
        var components = this._targetNode.components;

        var _iterator = _createForOfIteratorHelper(eventGroup.events),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var event = _step.value;
            var functionName = event.functionName;

            var _iterator2 = _createForOfIteratorHelper(components),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var component = _step2.value;
                var fx = component[functionName];

                if (typeof fx === 'function') {
                  fx.apply(component, event.parameters);
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "_onReplayOrResume",
      value: function _onReplayOrResume() {
        _globalExports.legacyCC.director.getAnimationManager().addAnimation(this);
      }
    }, {
      key: "_onPauseOrStop",
      value: function _onPauseOrStop() {
        _globalExports.legacyCC.director.getAnimationManager().removeAnimation(this);
      }
    }, {
      key: "_destroyBlendStateWriters",
      value: function _destroyBlendStateWriters() {
        for (var iBlendStateWriter = 0; iBlendStateWriter < this._blendStateWriters.length; ++iBlendStateWriter) {
          this._blendStateWriters[iBlendStateWriter].destroy();
        }

        this._blendStateWriters.length = 0;
      }
    }, {
      key: "curveLoaded",
      get: function get() {
        return this._curveLoaded;
      }
    }]);

    return AnimationState;
  }(_playable.Playable);

  _exports.AnimationState = AnimationState;

  function isTargetingTRS(path) {
    var prs;

    if (path.length === 1 && typeof path[0] === 'string') {
      prs = path[0];
    } else if (path.length > 1) {
      for (var i = 0; i < path.length - 1; ++i) {
        if (!(path[i] instanceof _targetPath.HierarchyPath)) {
          return false;
        }
      }

      prs = path[path.length - 1];
    }

    switch (prs) {
      case 'position':
      case 'scale':
      case 'rotation':
      case 'eulerAngles':
        return true;

      default:
        return false;
    }
  }

  function wrapIterations(iterations) {
    if (iterations - (iterations | 0) === 0) {
      iterations -= 1;
    }

    return iterations | 0;
  }

  _globalExports.legacyCC.AnimationState = AnimationState;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2FuaW1hdGlvbi1zdGF0ZS50cyJdLCJuYW1lcyI6WyJFdmVudFR5cGUiLCJJQ3VydmVJbnN0YW5jZSIsInJ1bnRpbWVDdXJ2ZSIsInRhcmdldCIsImJvdW5kVGFyZ2V0IiwiY29tbW9uVGFyZ2V0SW5kZXgiLCJfY3VydmUiLCJfYm91bmRUYXJnZXQiLCJfcm9vdFRhcmdldFByb3BlcnR5IiwiX2N1cnZlRGV0YWlsIiwiY3VydmUiLCJyYXRpbyIsImluZGV4IiwibGVycFJlcXVpcmVkIiwic2FtcGxlclJlc3VsdENhY2hlIiwid2VpZ2h0IiwiZW1wdHkiLCJ2YWx1ZSIsImhhc0xlcnAiLCJ2YWx1ZUF0IiwidmFsdWVCZXR3ZWVuIiwiZnJvbSIsImZyb21SYXRpbyIsInRvIiwidG9SYXRpbyIsIl9zZXRWYWx1ZSIsInNldFZhbHVlIiwibWFrZVNhbXBsZXJTaGFyZWRHcm91cCIsInNhbXBsZXIiLCJjdXJ2ZXMiLCJJbnZhbGlkSW5kZXgiLCJBbmltYXRpb25TdGF0ZSIsIl9jbGlwIiwiX25hbWUiLCJkdXJhdGlvbiIsIl93cmFwTW9kZSIsIkVESVRPUiIsInRpbWUiLCJXcmFwTW9kZU1hc2siLCJMb29wIiwicmVwZWF0Q291bnQiLCJJbmZpbml0eSIsIl9yZXBlYXRDb3VudCIsInNob3VsZFdyYXAiLCJTaG91bGRXcmFwIiwicmV2ZXJzZSIsIndyYXBNb2RlIiwiUmV2ZXJzZSIsIl9wcm9jZXNzIiwic2ltcGxlUHJvY2VzcyIsInByb2Nlc3MiLCJfZGVsYXkiLCJfZGVsYXlUaW1lIiwiY2xpcCIsIm5hbWUiLCJzcGVlZCIsImZyYW1lUmF0ZSIsIldyYXBNb2RlIiwiTm9ybWFsIiwiX2N1cnJlbnRGcmFtZVBsYXllZCIsIl93cmFwcGVkSW5mbyIsIldyYXBwZWRJbmZvIiwiX2xhc3RXcmFwSW5mbyIsIl9sYXN0V3JhcEluZm9FdmVudCIsIl90YXJnZXQiLCJfdGFyZ2V0Tm9kZSIsIl9sYXN0SXRlcmF0aW9ucyIsIl9zYW1wbGVyU2hhcmVkR3JvdXBzIiwiX2NvbW1vblRhcmdldFN0YXR1c2VzIiwiX2N1cnZlTG9hZGVkIiwiX2lnbm9yZUluZGV4IiwiX2JsZW5kU3RhdGVCdWZmZXIiLCJfYmxlbmRTdGF0ZVdyaXRlcnMiLCJfYWxsb3dMYXN0RnJhbWUiLCJyb290IiwicHJvcGVydHlDdXJ2ZXMiLCJfZGVzdHJveUJsZW5kU3RhdGVXcml0ZXJzIiwibGVuZ3RoIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsImdldEFuaW1hdGlvbk1hbmFnZXIiLCJibGVuZFN0YXRlIiwic2FtcGxlIiwiY3JlYXRlQm91bmRUYXJnZXRPcHRpbWl6ZWQiLCJjcmVhdGVGbiIsInJvb3RUYXJnZXQiLCJwYXRoIiwidmFsdWVBZGFwdGVyIiwiaXNDb25zdGFudCIsImlzVGFyZ2V0aW5nVFJTIiwidGFyZ2V0Tm9kZSIsImV2YWx1YXRlUGF0aCIsInNsaWNlIiwiTm9kZSIsInByb3BlcnR5TmFtZSIsImJsZW5kU3RhdGVXcml0ZXIiLCJwdXNoIiwiY29tbW9uVGFyZ2V0cyIsIm1hcCIsImNvbW1vblRhcmdldCIsImNyZWF0ZUJ1ZmZlcmVkVGFyZ2V0IiwibW9kaWZpZXJzIiwiY2hhbmdlZCIsImdldFByb3BlcnR5Q3VydmVzIiwiaVByb3BlcnR5Q3VydmUiLCJwcm9wZXJ0eUN1cnZlIiwic2FtcGxlclNoYXJlZEdyb3VwIiwiZmluZCIsImNvbW1vblRhcmdldFN0YXR1cyIsInBlZWsiLCJjcmVhdGVCb3VuZFRhcmdldCIsImNvbnN0YW50IiwiY3VydmVJbnN0YW5jZSIsImFyZ3MiLCJwdXNoRGVsYXlFdmVudCIsIl9lbWl0IiwidHlwZSIsImNhbGxiYWNrIiwiaXNWYWxpZCIsIm9uIiwib25jZSIsIm9mZiIsImFsbG93ZWQiLCJpbmZvIiwiZ2V0V3JhcHBlZEluZm8iLCJkaXJlY3Rpb24iLCJmcmFtZUluZGV4IiwiZ2V0RXZlbnRHcm91cEluZGV4QXRSYXRpbyIsImRlbHRhIiwiY3VycmVudEl0ZXJhdGlvbnMiLCJuZWVkUmV2ZXJzZSIsIlBpbmdQb25nIiwiaXNFbmQiLCJpc09kZEl0ZXJhdGlvbiIsInN0b3BwZWQiLCJ0ZW1wUmF0aW8iLCJ0ZW1wVGltZSIsIl9uZWVkUmV2ZXJzZSIsIml0ZXJhdGlvbnMiLCJfc2FtcGxlQ3VydmVzIiwiX3NhbXBsZUV2ZW50cyIsImxhc3RJbmZvIiwiZW1pdCIsIkxBU1RGUkFNRSIsInNldCIsInN0b3AiLCJGSU5JU0hFRCIsImhhc0V2ZW50cyIsInVuZGVmaW5lZCIsImZyYW1lcyIsInNldFRpbWUiLCJfb25SZXBsYXlPclJlc3VtZSIsIlBMQVkiLCJpc1BhdXNlZCIsIl9vblBhdXNlT3JTdG9wIiwiU1RPUCIsIlJFU1VNRSIsIlBBVVNFIiwiaUNvbW1vblRhcmdldCIsInB1bGwiLCJpU2FtcGxlclNoYXJlZEdyb3VwIiwic3pTYW1wbGVyU2hhcmVkR3JvdXAiLCJyYXRpb3MiLCJpQ3VydmVJbnN0YW5jZSIsInN6Q3VydmVzIiwiYXBwbHlTYW1wbGUiLCJ3cmFwSW5mbyIsImV2ZW50R3JvdXBzIiwiZXZlbnRJbmRleCIsIl9maXJlRXZlbnQiLCJ3cmFwSXRlcmF0aW9ucyIsImxhc3RXcmFwcGVkSW5mbyIsImxhc3RJdGVyYXRpb25zIiwibGFzdEluZGV4IiwibGFzdERpcmVjdGlvbiIsIml0ZXJhdGlvbnNDaGFuZ2VkIiwic3RhdGUiLCJldmVudEdyb3VwIiwiY29tcG9uZW50cyIsImV2ZW50cyIsImV2ZW50IiwiZnVuY3Rpb25OYW1lIiwiY29tcG9uZW50IiwiZngiLCJhcHBseSIsInBhcmFtZXRlcnMiLCJhZGRBbmltYXRpb24iLCJyZW1vdmVBbmltYXRpb24iLCJpQmxlbmRTdGF0ZVdyaXRlciIsImRlc3Ryb3kiLCJQbGF5YWJsZSIsInBycyIsImkiLCJIaWVyYXJjaHlQYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMENBOzs7O01BSVlBLFM7OzthQUFBQSxTO0FBQUFBLElBQUFB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LENBQWQ7QUFDSDs7QUFDRCxXQUFPQSxVQUFVLEdBQUcsQ0FBcEI7QUFDSDs7QUFFRDVELDBCQUFTL0MsY0FBVCxHQUEwQkEsY0FBMUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGFuaW1hdGlvblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi9zY2VuZS1ncmFwaC9ub2RlJztcclxuaW1wb3J0IHsgQW5pbWF0aW9uQ2xpcCwgSVJ1bnRpbWVDdXJ2ZSB9IGZyb20gJy4vYW5pbWF0aW9uLWNsaXAnO1xyXG5pbXBvcnQgeyBBbmltQ3VydmUsIFJhdGlvU2FtcGxlciB9IGZyb20gJy4vYW5pbWF0aW9uLWN1cnZlJztcclxuaW1wb3J0IHsgY3JlYXRlQm91bmRUYXJnZXQsIGNyZWF0ZUJ1ZmZlcmVkVGFyZ2V0LCBJQnVmZmVyZWRUYXJnZXQsIElCb3VuZFRhcmdldCB9IGZyb20gJy4vYm91bmQtdGFyZ2V0JztcclxuaW1wb3J0IHsgUGxheWFibGUgfSBmcm9tICcuL3BsYXlhYmxlJztcclxuaW1wb3J0IHsgV3JhcE1vZGUsIFdyYXBNb2RlTWFzaywgV3JhcHBlZEluZm8gfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgSGllcmFyY2h5UGF0aCwgZXZhbHVhdGVQYXRoLCBUYXJnZXRQYXRoIH0gZnJvbSAnLi90YXJnZXQtcGF0aCc7XHJcbmltcG9ydCB7IEJsZW5kU3RhdGVCdWZmZXIsIGNyZWF0ZUJsZW5kU3RhdGVXcml0ZXIsIElCbGVuZFN0YXRlV3JpdGVyIH0gZnJvbSAnLi9za2VsZXRhbC1hbmltYXRpb24tYmxlbmRpbmcnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgY2NlbnVtIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IElWYWx1ZVByb3h5RmFjdG9yeSB9IGZyb20gJy4vdmFsdWUtcHJveHknO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgZXZlbnQgdHlwZSBzdXBwb3J0ZWQgYnkgQW5pbWF0aW9uXHJcbiAqIEB6aCBBbmltYXRpb24g5pSv5oyB55qE5LqL5Lu257G75Z6L44CCXHJcbiAqL1xyXG5leHBvcnQgZW51bSBFdmVudFR5cGUge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRW1pdCB3aGVuIGJlZ2luIHBsYXlpbmcgYW5pbWF0aW9uXHJcbiAgICAgKiBAemgg5byA5aeL5pKt5pS+5pe26Kem5Y+R44CCXHJcbiAgICAgKi9cclxuICAgIFBMQVkgPSAncGxheScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFbWl0IHdoZW4gc3RvcCBwbGF5aW5nIGFuaW1hdGlvblxyXG4gICAgICogQHpoIOWBnOatouaSreaUvuaXtuinpuWPkeOAglxyXG4gICAgICovXHJcbiAgICBTVE9QID0gJ3N0b3AnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRW1pdCB3aGVuIHBhdXNlIGFuaW1hdGlvblxyXG4gICAgICogQHpoIOaaguWBnOaSreaUvuaXtuinpuWPkeOAglxyXG4gICAgICovXHJcbiAgICBQQVVTRSA9ICdwYXVzZScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFbWl0IHdoZW4gcmVzdW1lIGFuaW1hdGlvblxyXG4gICAgICogQHpoIOaBouWkjeaSreaUvuaXtuinpuWPkeOAglxyXG4gICAgICovXHJcbiAgICBSRVNVTUUgPSAncmVzdW1lJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJZiBhbmltYXRpb24gcmVwZWF0IGNvdW50IGlzIGxhcmdlciB0aGFuIDEsIGVtaXQgd2hlbiBhbmltYXRpb24gcGxheSB0byB0aGUgbGFzdCBmcmFtZS5cclxuICAgICAqIEB6aCDlgYflpoLliqjnlLvlvqrnjq/mrKHmlbDlpKfkuo4gMe+8jOW9k+WKqOeUu+aSreaUvuWIsOacgOWQjuS4gOW4p+aXtuinpuWPkeOAglxyXG4gICAgICovXHJcbiAgICBMQVNURlJBTUUgPSAnbGFzdGZyYW1lJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUcmlnZ2VyZWQgd2hlbiBmaW5pc2ggcGxheWluZyBhbmltYXRpb24uXHJcbiAgICAgKiBAemgg5Yqo55S75a6M5oiQ5pKt5pS+5pe26Kem5Y+R44CCXHJcbiAgICAgKi9cclxuICAgIEZJTklTSEVEID0gJ2ZpbmlzaGVkJyxcclxufVxyXG5jY2VudW0oRXZlbnRUeXBlKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBJQ3VydmVJbnN0YW5jZSB7XHJcbiAgICBwdWJsaWMgY29tbW9uVGFyZ2V0SW5kZXg/OiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfY3VydmU6IEFuaW1DdXJ2ZTtcclxuICAgIHByaXZhdGUgX2JvdW5kVGFyZ2V0OiBJQm91bmRUYXJnZXQ7XHJcbiAgICBwcml2YXRlIF9yb290VGFyZ2V0UHJvcGVydHk/OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9jdXJ2ZURldGFpbDogT21pdDxJUnVudGltZUN1cnZlLCAnc2FtcGxlcic+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBydW50aW1lQ3VydmU6IE9taXQ8SVJ1bnRpbWVDdXJ2ZSwgJ3NhbXBsZXInPixcclxuICAgICAgICB0YXJnZXQ6IGFueSxcclxuICAgICAgICBib3VuZFRhcmdldDogSUJvdW5kVGFyZ2V0KSB7XHJcbiAgICAgICAgdGhpcy5fY3VydmUgPSBydW50aW1lQ3VydmUuY3VydmU7XHJcbiAgICAgICAgdGhpcy5fY3VydmVEZXRhaWwgPSBydW50aW1lQ3VydmU7XHJcblxyXG4gICAgICAgIHRoaXMuX2JvdW5kVGFyZ2V0ID0gYm91bmRUYXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFwcGx5U2FtcGxlIChyYXRpbzogbnVtYmVyLCBpbmRleDogbnVtYmVyLCBsZXJwUmVxdWlyZWQ6IGJvb2xlYW4sIHNhbXBsZXJSZXN1bHRDYWNoZSwgd2VpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fY3VydmUuZW1wdHkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2YWx1ZTogYW55O1xyXG4gICAgICAgIGlmICghdGhpcy5fY3VydmUuaGFzTGVycCgpIHx8ICFsZXJwUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9jdXJ2ZS52YWx1ZUF0KGluZGV4KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2N1cnZlLnZhbHVlQmV0d2VlbihcclxuICAgICAgICAgICAgICAgIHJhdGlvLFxyXG4gICAgICAgICAgICAgICAgc2FtcGxlclJlc3VsdENhY2hlLmZyb20sXHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyUmVzdWx0Q2FjaGUuZnJvbVJhdGlvLFxyXG4gICAgICAgICAgICAgICAgc2FtcGxlclJlc3VsdENhY2hlLnRvLFxyXG4gICAgICAgICAgICAgICAgc2FtcGxlclJlc3VsdENhY2hlLnRvUmF0aW8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zZXRWYWx1ZSh2YWx1ZSwgd2VpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zZXRWYWx1ZSAodmFsdWU6IGFueSwgd2VpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9ib3VuZFRhcmdldC5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHByb3BlcnR5TmFtZSAoKSB7IHJldHVybiB0aGlzLl9yb290VGFyZ2V0UHJvcGVydHkgfHwgJyc7IH1cclxuXHJcbiAgICBnZXQgY3VydmVEZXRhaWwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZURldGFpbDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRoZSBjdXJ2ZXMgaW4gSVNhbXBsZXJTaGFyZWRHcm91cCBzaGFyZSBhIHNhbWUga2V5cy5cclxuICovXHJcbmludGVyZmFjZSBJU2FtcGxlclNoYXJlZEdyb3VwIHtcclxuICAgIHNhbXBsZXI6IFJhdGlvU2FtcGxlciB8IG51bGw7XHJcbiAgICBjdXJ2ZXM6IElDdXJ2ZUluc3RhbmNlW107XHJcbiAgICBzYW1wbGVyUmVzdWx0Q2FjaGU6IHtcclxuICAgICAgICBmcm9tOiBudW1iZXI7XHJcbiAgICAgICAgZnJvbVJhdGlvOiBudW1iZXI7XHJcbiAgICAgICAgdG86IG51bWJlcjtcclxuICAgICAgICB0b1JhdGlvOiBudW1iZXI7XHJcbiAgICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlU2FtcGxlclNoYXJlZEdyb3VwIChzYW1wbGVyOiBSYXRpb1NhbXBsZXIgfCBudWxsKTogSVNhbXBsZXJTaGFyZWRHcm91cCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNhbXBsZXIsXHJcbiAgICAgICAgY3VydmVzOiBbXSxcclxuICAgICAgICBzYW1wbGVyUmVzdWx0Q2FjaGU6IHtcclxuICAgICAgICAgICAgZnJvbTogMCxcclxuICAgICAgICAgICAgZnJvbVJhdGlvOiAwLFxyXG4gICAgICAgICAgICB0bzogMCxcclxuICAgICAgICAgICAgdG9SYXRpbzogMCxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxufVxyXG5cclxuY29uc3QgSW52YWxpZEluZGV4ID0gLTE7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBBbmltYXRpb25TdGF0ZSBnaXZlcyBmdWxsIGNvbnRyb2wgb3ZlciBhbmltYXRpb24gcGxheWJhY2sgcHJvY2Vzcy5cclxuICogSW4gbW9zdCBjYXNlcyB0aGUgQW5pbWF0aW9uIENvbXBvbmVudCBpcyBzdWZmaWNpZW50IGFuZCBlYXNpZXIgdG8gdXNlLiBVc2UgdGhlIEFuaW1hdGlvblN0YXRlIGlmIHlvdSBuZWVkIGZ1bGwgY29udHJvbC5cclxuICogQHpoXHJcbiAqIEFuaW1hdGlvblN0YXRlIOWujOWFqOaOp+WItuWKqOeUu+aSreaUvui/h+eoi+OAgjxici8+XHJcbiAqIOWkp+WkmuaVsOaDheWGteS4iyDliqjnlLvnu4Tku7Yg5piv6Laz5aSf5ZKM5piT5LqO5L2/55So55qE44CC5aaC5p6c5oKo6ZyA6KaB5pu05aSa55qE5Yqo55S75o6n5Yi25o6l5Y+j77yM6K+35L2/55SoIEFuaW1hdGlvblN0YXRl44CCXHJcbiAqXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uU3RhdGUgZXh0ZW5kcyBQbGF5YWJsZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGNsaXAgdGhhdCBpcyBiZWluZyBwbGF5ZWQgYnkgdGhpcyBhbmltYXRpb24gc3RhdGUuXHJcbiAgICAgKiBAemgg5q2k5Yqo55S754q25oCB5q2j5Zyo5pKt5pS+55qE5Ymq6L6R44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBjbGlwICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY2xpcDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbmFtZSBvZiB0aGUgcGxheWluZyBhbmltYXRpb24uXHJcbiAgICAgKiBAemgg5Yqo55S755qE5ZCN5a2X44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBuYW1lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbGVuZ3RoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kdXJhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV3JhcHBpbmcgbW9kZSBvZiB0aGUgcGxheWluZyBhbmltYXRpb24uXHJcbiAgICAgKiBOb3RpY2UgOiBkeW5hbWljIGNoYW5nZSB3cmFwTW9kZSB3aWxsIHJlc2V0IHRpbWUgYW5kIHJlcGVhdENvdW50IHByb3BlcnR5XHJcbiAgICAgKiBAemhcclxuICAgICAqIOWKqOeUu+W+queOr+aWueW8j+OAglxyXG4gICAgICog6ZyA6KaB5rOo5oSP55qE5piv77yM5Yqo5oCB5L+u5pS5IHdyYXBNb2RlIOaXtu+8jOS8mumHjee9riB0aW1lIOS7peWPiiByZXBlYXRDb3VudOOAglxyXG4gICAgICogQGRlZmF1bHQ6IFdyYXBNb2RlLk5vcm1hbFxyXG4gICAgICovXHJcbiAgICBnZXQgd3JhcE1vZGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93cmFwTW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd3JhcE1vZGUgKHZhbHVlOiBXcmFwTW9kZSkge1xyXG4gICAgICAgIHRoaXMuX3dyYXBNb2RlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmIChFRElUT1IpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIC8vIGR5bmFtaWMgY2hhbmdlIHdyYXBNb2RlIHdpbGwgbmVlZCByZXNldCB0aW1lIHRvIDBcclxuICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgJiBXcmFwTW9kZU1hc2suTG9vcCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlcGVhdENvdW50ID0gSW5maW5pdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlcGVhdENvdW50ID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGFuaW1hdGlvbidzIGl0ZXJhdGlvbiBjb3VudCBwcm9wZXJ0eS5cclxuICAgICAqXHJcbiAgICAgKiBBIHJlYWwgbnVtYmVyIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvIChpbmNsdWRpbmcgcG9zaXRpdmUgaW5maW5pdHkpIHJlcHJlc2VudGluZyB0aGUgbnVtYmVyIG9mIHRpbWVzXHJcbiAgICAgKiB0byByZXBlYXQgdGhlIGFuaW1hdGlvbiBub2RlLlxyXG4gICAgICpcclxuICAgICAqIFZhbHVlcyBsZXNzIHRoYW4gemVybyBhbmQgTmFOIHZhbHVlcyBhcmUgdHJlYXRlZCBhcyB0aGUgdmFsdWUgMS4wIGZvciB0aGUgcHVycG9zZSBvZiB0aW1pbmcgbW9kZWxcclxuICAgICAqIGNhbGN1bGF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBAemgg6L+t5Luj5qyh5pWw77yM5oyH5Yqo55S75pKt5pS+5aSa5bCR5qyh5ZCO57uT5p2fLCBub3JtYWxpemUgdGltZeOAgiDlpoIgMi4177yIMuasoeWNiu+8ieOAglxyXG4gICAgICpcclxuICAgICAqIEBkZWZhdWx0IDFcclxuICAgICAqL1xyXG4gICAgZ2V0IHJlcGVhdENvdW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVwZWF0Q291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJlcGVhdENvdW50ICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcmVwZWF0Q291bnQgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hvdWxkV3JhcCA9IHRoaXMuX3dyYXBNb2RlICYgV3JhcE1vZGVNYXNrLlNob3VsZFdyYXA7XHJcbiAgICAgICAgY29uc3QgcmV2ZXJzZSA9ICh0aGlzLndyYXBNb2RlICYgV3JhcE1vZGVNYXNrLlJldmVyc2UpID09PSBXcmFwTW9kZU1hc2suUmV2ZXJzZTtcclxuICAgICAgICBpZiAodmFsdWUgPT09IEluZmluaXR5ICYmICFzaG91bGRXcmFwICYmICFyZXZlcnNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3MgPSB0aGlzLnNpbXBsZVByb2Nlc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9jZXNzID0gdGhpcy5wcm9jZXNzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc3RhcnQgZGVsYXkgd2hpY2ggcmVwcmVzZW50cyB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBhbiBhbmltYXRpb24ncyBzdGFydCB0aW1lIHRvIHRoZSBzdGFydCBvZlxyXG4gICAgICogdGhlIGFjdGl2ZSBpbnRlcnZhbC5cclxuICAgICAqIEB6aCDlu7bov5/lpJrlsJHnp5Lmkq3mlL7jgIJcclxuICAgICAqIEBkZWZhdWx0IDBcclxuICAgICAqL1xyXG4gICAgZ2V0IGRlbGF5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGVsYXk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGRlbGF5ICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsYXlUaW1lID0gdGhpcy5fZGVsYXkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi93ZWItYW5pbWF0aW9ucy8jaWRsLWRlZi1BbmltYXRpb25UaW1pbmdcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaXRlcmF0aW9uIGR1cmF0aW9uIG9mIHRoaXMgYW5pbWF0aW9uIGluIHNlY29uZHMuIChsZW5ndGgpXHJcbiAgICAgKiBAemgg5Y2V5qyh5Yqo55S755qE5oyB57ut5pe26Ze077yM56eS44CC77yI5Yqo55S76ZW/5bqm77yJXHJcbiAgICAgKiBAcmVhZE9ubHlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGR1cmF0aW9uID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYW5pbWF0aW9uJ3MgcGxheWJhY2sgc3BlZWQuIDEgaXMgbm9ybWFsIHBsYXliYWNrIHNwZWVkLlxyXG4gICAgICogQHpoIOaSreaUvumAn+eOh+OAglxyXG4gICAgICogQGRlZmF1bHQ6IDEuMFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3BlZWQgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBjdXJyZW50IHRpbWUgb2YgdGhpcyBhbmltYXRpb24gaW4gc2Vjb25kcy5cclxuICAgICAqIEB6aCDliqjnlLvlvZPliY3nmoTml7bpl7TvvIznp5LjgIJcclxuICAgICAqIEBkZWZhdWx0IDBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRpbWUgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHdlaWdodC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHdlaWdodCA9IDA7XHJcblxyXG4gICAgcHVibGljIGZyYW1lUmF0ZSA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF93cmFwTW9kZSA9IFdyYXBNb2RlLk5vcm1hbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlcGVhdENvdW50ID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hcmsgd2hldGhlciB0aGUgY3VycmVudCBmcmFtZSBpcyBwbGF5ZWQuXHJcbiAgICAgKiBXaGVuIHNldCBuZXcgdGltZSB0byBhbmltYXRpb24gc3RhdGUsIHdlIHNob3VsZCBlbnN1cmUgdGhlIGZyYW1lIGF0IHRoZSBzcGVjaWZpZWQgdGltZSBiZWluZyBwbGF5ZWQgYXQgbmV4dCB1cGRhdGUuXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBfY3VycmVudEZyYW1lUGxheWVkID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX2RlbGF5ID0gMDtcclxuICAgIHByb3RlY3RlZCBfZGVsYXlUaW1lID0gMDtcclxuICAgIHByb3RlY3RlZCBfd3JhcHBlZEluZm8gPSBuZXcgV3JhcHBlZEluZm8oKTtcclxuICAgIHByb3RlY3RlZCBfbGFzdFdyYXBJbmZvOiBXcmFwcGVkSW5mbyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9sYXN0V3JhcEluZm9FdmVudDogV3JhcHBlZEluZm8gfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfcHJvY2VzcyA9IHRoaXMucHJvY2VzcztcclxuICAgIHByb3RlY3RlZCBfdGFyZ2V0OiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3RhcmdldE5vZGU6IE5vZGUgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfY2xpcDogQW5pbWF0aW9uQ2xpcDtcclxuICAgIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIF9sYXN0SXRlcmF0aW9ucz86IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBfc2FtcGxlclNoYXJlZEdyb3VwczogSVNhbXBsZXJTaGFyZWRHcm91cFtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXkgYmUgYG51bGxgIGR1ZSB0byBmYWlsZWQgdG8gaW5pdGlhbGl6ZS5cclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIF9jb21tb25UYXJnZXRTdGF0dXNlczogKG51bGwgfCB7XHJcbiAgICAgICAgdGFyZ2V0OiBJQnVmZmVyZWRUYXJnZXQ7XHJcbiAgICAgICAgY2hhbmdlZDogYm9vbGVhbjtcclxuICAgIH0pW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfY3VydmVMb2FkZWQgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfaWdub3JlSW5kZXggPSBJbnZhbGlkSW5kZXg7XHJcbiAgICBwcml2YXRlIF9ibGVuZFN0YXRlQnVmZmVyOiBCbGVuZFN0YXRlQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9ibGVuZFN0YXRlV3JpdGVyczogSUJsZW5kU3RhdGVXcml0ZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfYWxsb3dMYXN0RnJhbWUgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoY2xpcDogQW5pbWF0aW9uQ2xpcCwgbmFtZSA9ICcnKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGlwID0gY2xpcDtcclxuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZSB8fCAoY2xpcCAmJiBjbGlwLm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJ2ZUxvYWRlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnZlTG9hZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChyb290OiBOb2RlLCBwcm9wZXJ0eUN1cnZlcz86IHJlYWRvbmx5IElSdW50aW1lQ3VydmVbXSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jdXJ2ZUxvYWRlZCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9jdXJ2ZUxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZGVzdHJveUJsZW5kU3RhdGVXcml0ZXJzKCk7XHJcbiAgICAgICAgdGhpcy5fc2FtcGxlclNoYXJlZEdyb3Vwcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2JsZW5kU3RhdGVCdWZmZXIgPSBsZWdhY3lDQy5kaXJlY3Rvci5nZXRBbmltYXRpb25NYW5hZ2VyKCk/LmJsZW5kU3RhdGUgPz8gbnVsbDtcclxuICAgICAgICB0aGlzLl90YXJnZXROb2RlID0gcm9vdDtcclxuICAgICAgICBjb25zdCBjbGlwID0gdGhpcy5fY2xpcDtcclxuXHJcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGNsaXAuZHVyYXRpb247XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IGNsaXAuc3BlZWQ7XHJcbiAgICAgICAgdGhpcy53cmFwTW9kZSA9IGNsaXAud3JhcE1vZGU7XHJcbiAgICAgICAgdGhpcy5mcmFtZVJhdGUgPSBjbGlwLnNhbXBsZTtcclxuXHJcbiAgICAgICAgaWYgKCh0aGlzLndyYXBNb2RlICYgV3JhcE1vZGVNYXNrLkxvb3ApID09PSBXcmFwTW9kZU1hc2suTG9vcCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlcGVhdENvdW50ID0gSW5maW5pdHk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZXBlYXRDb3VudCA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgdGhlIGJvdW5kIHRhcmdldC4gRXNwZWNpYWxseSBvcHRpbWl6ZWQgZm9yIHNrZWxldGFsIGNhc2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgY3JlYXRlQm91bmRUYXJnZXRPcHRpbWl6ZWQgPSA8Qm91bmRUYXJnZXRUIGV4dGVuZHMgSUJvdW5kVGFyZ2V0PihcclxuICAgICAgICAgICAgY3JlYXRlRm46ICguLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBjcmVhdGVCb3VuZFRhcmdldD4pID0+IEJvdW5kVGFyZ2V0VCB8IG51bGwsXHJcbiAgICAgICAgICAgIHJvb3RUYXJnZXQ6IGFueSxcclxuICAgICAgICAgICAgcGF0aDogVGFyZ2V0UGF0aFtdLFxyXG4gICAgICAgICAgICB2YWx1ZUFkYXB0ZXI6IElWYWx1ZVByb3h5RmFjdG9yeSB8IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgaXNDb25zdGFudDogYm9vbGVhbixcclxuICAgICAgICApOiBCb3VuZFRhcmdldFQgfCBudWxsID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpc1RhcmdldGluZ1RSUyhwYXRoKSB8fCAhdGhpcy5fYmxlbmRTdGF0ZUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUZuKHJvb3RUYXJnZXQsIHBhdGgsIHZhbHVlQWRhcHRlcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gZXZhbHVhdGVQYXRoKHJvb3RUYXJnZXQsIC4uLnBhdGguc2xpY2UoMCwgcGF0aC5sZW5ndGggLSAxKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Tm9kZSAhPT0gbnVsbCAmJiB0YXJnZXROb2RlIGluc3RhbmNlb2YgTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXSBhcyAncG9zaXRpb24nIHwgJ3JvdGF0aW9uJyB8ICdzY2FsZScgfCAnZXVsZXJBbmdsZXMnO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsZW5kU3RhdGVXcml0ZXIgPSBjcmVhdGVCbGVuZFN0YXRlV3JpdGVyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ibGVuZFN0YXRlQnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXROb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29uc3RhbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ibGVuZFN0YXRlV3JpdGVycy5wdXNoKGJsZW5kU3RhdGVXcml0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVGbihyb290VGFyZ2V0LCBbXSwgYmxlbmRTdGF0ZVdyaXRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29tbW9uVGFyZ2V0U3RhdHVzZXMgPSBjbGlwLmNvbW1vblRhcmdldHMubWFwKChjb21tb25UYXJnZXQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGNyZWF0ZUJvdW5kVGFyZ2V0T3B0aW1pemVkKFxyXG4gICAgICAgICAgICAgICAgY3JlYXRlQnVmZmVyZWRUYXJnZXQsXHJcbiAgICAgICAgICAgICAgICByb290LFxyXG4gICAgICAgICAgICAgICAgY29tbW9uVGFyZ2V0Lm1vZGlmaWVycyxcclxuICAgICAgICAgICAgICAgIGNvbW1vblRhcmdldC52YWx1ZUFkYXB0ZXIsXHJcbiAgICAgICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0eUN1cnZlcykge1xyXG4gICAgICAgICAgICBwcm9wZXJ0eUN1cnZlcyA9IGNsaXAuZ2V0UHJvcGVydHlDdXJ2ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaVByb3BlcnR5Q3VydmUgPSAwOyBpUHJvcGVydHlDdXJ2ZSA8IHByb3BlcnR5Q3VydmVzLmxlbmd0aDsgKytpUHJvcGVydHlDdXJ2ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eUN1cnZlID0gcHJvcGVydHlDdXJ2ZXNbaVByb3BlcnR5Q3VydmVdO1xyXG4gICAgICAgICAgICBsZXQgc2FtcGxlclNoYXJlZEdyb3VwID0gdGhpcy5fc2FtcGxlclNoYXJlZEdyb3Vwcy5maW5kKCh2YWx1ZSkgPT4gdmFsdWUuc2FtcGxlciA9PT0gcHJvcGVydHlDdXJ2ZS5zYW1wbGVyKTtcclxuICAgICAgICAgICAgaWYgKCFzYW1wbGVyU2hhcmVkR3JvdXApIHtcclxuICAgICAgICAgICAgICAgIHNhbXBsZXJTaGFyZWRHcm91cCA9IG1ha2VTYW1wbGVyU2hhcmVkR3JvdXAocHJvcGVydHlDdXJ2ZS5zYW1wbGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NhbXBsZXJTaGFyZWRHcm91cHMucHVzaChzYW1wbGVyU2hhcmVkR3JvdXApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgcm9vdFRhcmdldDogYW55O1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnR5Q3VydmUuY29tbW9uVGFyZ2V0ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgcm9vdFRhcmdldCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tb25UYXJnZXRTdGF0dXMgPSB0aGlzLl9jb21tb25UYXJnZXRTdGF0dXNlc1twcm9wZXJ0eUN1cnZlLmNvbW1vblRhcmdldF07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbW1vblRhcmdldFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcm9vdFRhcmdldCA9IGNvbW1vblRhcmdldFN0YXR1cy50YXJnZXQucGVlaygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib3VuZFRhcmdldCA9IGNyZWF0ZUJvdW5kVGFyZ2V0T3B0aW1pemVkKFxyXG4gICAgICAgICAgICAgICAgY3JlYXRlQm91bmRUYXJnZXQsXHJcbiAgICAgICAgICAgICAgICByb290VGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlDdXJ2ZS5tb2RpZmllcnMsXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eUN1cnZlLnZhbHVlQWRhcHRlcixcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5Q3VydmUuY3VydmUuY29uc3RhbnQoKSxcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChib3VuZFRhcmdldCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gd2FybihgRmFpbGVkIHRvIGJpbmQgXCIke3Jvb3QubmFtZX1cIiB0byBjdXJ2ZSBpbiBjbGlwICR7Y2xpcC5uYW1lfTogJHtlcnJ9YCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJ2ZUluc3RhbmNlID0gbmV3IElDdXJ2ZUluc3RhbmNlKFxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5Q3VydmUsXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdFRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICBib3VuZFRhcmdldCxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBjdXJ2ZUluc3RhbmNlLmNvbW1vblRhcmdldEluZGV4ID0gcHJvcGVydHlDdXJ2ZS5jb21tb25UYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyU2hhcmVkR3JvdXAuY3VydmVzLnB1c2goY3VydmVJbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX2Rlc3Ryb3lCbGVuZFN0YXRlV3JpdGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgU2luY2UgVjEuMS4xLCBhbmltYXRpb24gc3RhdGVzIHdlcmUgbm8gbG9uZ2VyIGRlZmluZWQgYXMgZXZlbnQgdGFyZ2V0cy5cclxuICAgICAqIFRvIHByb2Nlc3MgYW5pbWF0aW9uIGV2ZW50cywgdXNlIGBBbmltYXRpb25gIGluc3RlYWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbWl0ICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5wdXNoRGVsYXlFdmVudCh0aGlzLl9lbWl0LCB0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBkZXByZWNhdGVkIFNpbmNlIFYxLjEuMSwgYW5pbWF0aW9uIHN0YXRlcyB3ZXJlIG5vIGxvbmdlciBkZWZpbmVkIGFzIGV2ZW50IHRhcmdldHMuXHJcbiAgICAgKiBUbyBwcm9jZXNzIGFuaW1hdGlvbiBldmVudHMsIHVzZSBgQW5pbWF0aW9uYCBpbnN0ZWFkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb24gKHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0ICYmIHRoaXMuX3RhcmdldC5pc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQub24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgU2luY2UgVjEuMS4xLCBhbmltYXRpb24gc3RhdGVzIHdlcmUgbm8gbG9uZ2VyIGRlZmluZWQgYXMgZXZlbnQgdGFyZ2V0cy5cclxuICAgICAqIFRvIHByb2Nlc3MgYW5pbWF0aW9uIGV2ZW50cywgdXNlIGBBbmltYXRpb25gIGluc3RlYWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbmNlICh0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgdGFyZ2V0PzogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldCAmJiB0aGlzLl90YXJnZXQuaXNWYWxpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0Lm9uY2UodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgU2luY2UgVjEuMS4xLCBhbmltYXRpb24gc3RhdGVzIHdlcmUgbm8gbG9uZ2VyIGRlZmluZWQgYXMgZXZlbnQgdGFyZ2V0cy5cclxuICAgICAqIFRvIHByb2Nlc3MgYW5pbWF0aW9uIGV2ZW50cywgdXNlIGBBbmltYXRpb25gIGluc3RlYWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvZmYgKHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0ICYmIHRoaXMuX3RhcmdldC5pc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldC5vZmYodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblhYHorrjop6blj5EgYExhc3RGcmFtZWAg5LqL5Lu244CCXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZXRoZXIgYExhc3RGcmFtZWAgc2hvdWxkIGJlIHRyaWdnZXJlZC5cclxuICAgICAqIEBwYXJhbSBhbGxvd2VkIFRydWUgaWYgdGhlIGxhc3QgZnJhbWUgZXZlbnRzIG1heSBiZSB0cmlnZ2VyZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhbGxvd0xhc3RGcmFtZUV2ZW50IChhbGxvd2VkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fYWxsb3dMYXN0RnJhbWUgPSBhbGxvd2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfc2V0RXZlbnRUYXJnZXQgKHRhcmdldCkge1xyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VGltZSAodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudEZyYW1lUGxheWVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50aW1lID0gdGltZSB8fCAwO1xyXG5cclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0V3JhcEluZm9FdmVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZUluZGV4ID0gSW52YWxpZEluZGV4O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuZ2V0V3JhcHBlZEluZm8odGltZSwgdGhpcy5fd3JhcHBlZEluZm8pO1xyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBpbmZvLmRpcmVjdGlvbjtcclxuICAgICAgICAgICAgbGV0IGZyYW1lSW5kZXggPSB0aGlzLl9jbGlwLmdldEV2ZW50R3JvdXBJbmRleEF0UmF0aW8oaW5mby5yYXRpbyk7XHJcblxyXG4gICAgICAgICAgICAvLyBvbmx5IGlnbm9yZSB3aGVuIHRpbWUgbm90IG9uIGEgZnJhbWUgaW5kZXhcclxuICAgICAgICAgICAgaWYgKGZyYW1lSW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBmcmFtZUluZGV4ID0gfmZyYW1lSW5kZXggLSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIGRpcmVjdGlvbiBpcyBpbnZlcnNlLCB0aGVuIGluY3JlYXNlIGluZGV4XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uIDwgMCkgeyBmcmFtZUluZGV4ICs9IDE7IH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pZ25vcmVJbmRleCA9IGZyYW1lSW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoZGVsdGE6IG51bWJlcikge1xyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBkZWxheSB0aW1lXHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9kZWxheVRpbWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbGF5VGltZSAtPSBkZWx0YTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGF5VGltZSA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8vIHN0aWxsIHdhaXRpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWFrZSBmaXJzdCBmcmFtZSBwZXJmZWN0XHJcblxyXG4gICAgICAgIC8vIHZhciBwbGF5UGVyZmVjdEZpcnN0RnJhbWUgPSAodGhpcy50aW1lID09PSAwKTtcclxuICAgICAgICBpZiAodGhpcy5fY3VycmVudEZyYW1lUGxheWVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZSArPSAoZGVsdGEgKiB0aGlzLnNwZWVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRGcmFtZVBsYXllZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9uZWVkUmV2ZXJzZSAoY3VycmVudEl0ZXJhdGlvbnM6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHdyYXBNb2RlID0gdGhpcy53cmFwTW9kZTtcclxuICAgICAgICBsZXQgbmVlZFJldmVyc2UgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCh3cmFwTW9kZSAmIFdyYXBNb2RlTWFzay5QaW5nUG9uZykgPT09IFdyYXBNb2RlTWFzay5QaW5nUG9uZykge1xyXG4gICAgICAgICAgICBjb25zdCBpc0VuZCA9IGN1cnJlbnRJdGVyYXRpb25zIC0gKGN1cnJlbnRJdGVyYXRpb25zIHwgMCkgPT09IDA7XHJcbiAgICAgICAgICAgIGlmIChpc0VuZCAmJiAoY3VycmVudEl0ZXJhdGlvbnMgPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZXJhdGlvbnMgLT0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNPZGRJdGVyYXRpb24gPSBjdXJyZW50SXRlcmF0aW9ucyAmIDE7XHJcbiAgICAgICAgICAgIGlmIChpc09kZEl0ZXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgbmVlZFJldmVyc2UgPSAhbmVlZFJldmVyc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCh3cmFwTW9kZSAmIFdyYXBNb2RlTWFzay5SZXZlcnNlKSA9PT0gV3JhcE1vZGVNYXNrLlJldmVyc2UpIHtcclxuICAgICAgICAgICAgbmVlZFJldmVyc2UgPSAhbmVlZFJldmVyc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZWVkUmV2ZXJzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0V3JhcHBlZEluZm8gKHRpbWU6IG51bWJlciwgaW5mbz86IFdyYXBwZWRJbmZvKSB7XHJcbiAgICAgICAgaW5mbyA9IGluZm8gfHwgbmV3IFdyYXBwZWRJbmZvKCk7XHJcblxyXG4gICAgICAgIGxldCBzdG9wcGVkID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xyXG4gICAgICAgIGNvbnN0IHJlcGVhdENvdW50ID0gdGhpcy5yZXBlYXRDb3VudDtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRJdGVyYXRpb25zID0gdGltZSA+IDAgPyAodGltZSAvIGR1cmF0aW9uKSA6IC0odGltZSAvIGR1cmF0aW9uKTtcclxuICAgICAgICBpZiAoY3VycmVudEl0ZXJhdGlvbnMgPj0gcmVwZWF0Q291bnQpIHtcclxuICAgICAgICAgICAgY3VycmVudEl0ZXJhdGlvbnMgPSByZXBlYXRDb3VudDtcclxuXHJcbiAgICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgdGVtcFJhdGlvID0gcmVwZWF0Q291bnQgLSAocmVwZWF0Q291bnQgfCAwKTtcclxuICAgICAgICAgICAgaWYgKHRlbXBSYXRpbyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGVtcFJhdGlvID0gMTsgIC8vIOWmguaenOaSreaUvui/h++8jOWKqOeUu+S4jeWkjeS9jVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRpbWUgPSB0ZW1wUmF0aW8gKiBkdXJhdGlvbiAqICh0aW1lID4gMCA/IDEgOiAtMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGltZSA+IGR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBUaW1lID0gdGltZSAlIGR1cmF0aW9uO1xyXG4gICAgICAgICAgICB0aW1lID0gdGVtcFRpbWUgPT09IDAgPyBkdXJhdGlvbiA6IHRlbXBUaW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aW1lIDwgMCkge1xyXG4gICAgICAgICAgICB0aW1lID0gdGltZSAlIGR1cmF0aW9uO1xyXG4gICAgICAgICAgICBpZiAodGltZSAhPT0gMCkgeyB0aW1lICs9IGR1cmF0aW9uOyB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbmVlZFJldmVyc2UgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBzaG91bGRXcmFwID0gdGhpcy5fd3JhcE1vZGUgJiBXcmFwTW9kZU1hc2suU2hvdWxkV3JhcDtcclxuICAgICAgICBpZiAoc2hvdWxkV3JhcCkge1xyXG4gICAgICAgICAgICBuZWVkUmV2ZXJzZSA9IHRoaXMuX25lZWRSZXZlcnNlKGN1cnJlbnRJdGVyYXRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBuZWVkUmV2ZXJzZSA/IC0xIDogMTtcclxuICAgICAgICBpZiAodGhpcy5zcGVlZCA8IDApIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uICo9IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHdyYXBwZWQgdGltZVxyXG4gICAgICAgIGlmIChzaG91bGRXcmFwICYmIG5lZWRSZXZlcnNlKSB7XHJcbiAgICAgICAgICAgIHRpbWUgPSBkdXJhdGlvbiAtIHRpbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbmZvLnJhdGlvID0gdGltZSAvIGR1cmF0aW9uO1xyXG4gICAgICAgIGluZm8udGltZSA9IHRpbWU7XHJcbiAgICAgICAgaW5mby5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XHJcbiAgICAgICAgaW5mby5zdG9wcGVkID0gc3RvcHBlZDtcclxuICAgICAgICBpbmZvLml0ZXJhdGlvbnMgPSBjdXJyZW50SXRlcmF0aW9ucztcclxuXHJcbiAgICAgICAgcmV0dXJuIGluZm87XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNhbXBsZSAoKSB7XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuZ2V0V3JhcHBlZEluZm8odGhpcy50aW1lLCB0aGlzLl93cmFwcGVkSW5mbyk7XHJcbiAgICAgICAgdGhpcy5fc2FtcGxlQ3VydmVzKGluZm8ucmF0aW8pO1xyXG4gICAgICAgIGlmICghRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NhbXBsZUV2ZW50cyhpbmZvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluZm87XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByb2Nlc3MgKCkge1xyXG4gICAgICAgIC8vIHNhbXBsZVxyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLnNhbXBsZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fYWxsb3dMYXN0RnJhbWUpIHtcclxuICAgICAgICAgICAgbGV0IGxhc3RJbmZvO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xhc3RXcmFwSW5mbykge1xyXG4gICAgICAgICAgICAgICAgbGFzdEluZm8gPSB0aGlzLl9sYXN0V3JhcEluZm8gPSBuZXcgV3JhcHBlZEluZm8oaW5mbyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0SW5mbyA9IHRoaXMuX2xhc3RXcmFwSW5mbztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucmVwZWF0Q291bnQgPiAxICYmICgoaW5mby5pdGVyYXRpb25zIHwgMCkgPiAobGFzdEluZm8uaXRlcmF0aW9ucyB8IDApKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5MQVNURlJBTUUsIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsYXN0SW5mby5zZXQoaW5mbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5mby5zdG9wcGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLkZJTklTSEVELCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNpbXBsZVByb2Nlc3MgKCkge1xyXG4gICAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcclxuICAgICAgICBsZXQgdGltZSA9IHRoaXMudGltZSAlIGR1cmF0aW9uO1xyXG4gICAgICAgIGlmICh0aW1lIDwgMCkgeyB0aW1lICs9IGR1cmF0aW9uOyB9XHJcbiAgICAgICAgY29uc3QgcmF0aW8gPSB0aW1lIC8gZHVyYXRpb247XHJcbiAgICAgICAgdGhpcy5fc2FtcGxlQ3VydmVzKHJhdGlvKTtcclxuXHJcbiAgICAgICAgaWYgKCFFRElUT1IpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NsaXAuaGFzRXZlbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NhbXBsZUV2ZW50cyh0aGlzLmdldFdyYXBwZWRJbmZvKHRoaXMudGltZSwgdGhpcy5fd3JhcHBlZEluZm8pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2FsbG93TGFzdEZyYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0SXRlcmF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0SXRlcmF0aW9ucyA9IHJhdGlvO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKHRoaXMudGltZSA+IDAgJiYgdGhpcy5fbGFzdEl0ZXJhdGlvbnMgPiByYXRpbykgfHwgKHRoaXMudGltZSA8IDAgJiYgdGhpcy5fbGFzdEl0ZXJhdGlvbnMgPCByYXRpbykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuTEFTVEZSQU1FLCB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fbGFzdEl0ZXJhdGlvbnMgPSByYXRpbztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhY2hlIChmcmFtZXM6IG51bWJlcikge1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblBsYXkgKCkge1xyXG4gICAgICAgIHRoaXMuc2V0VGltZSgwKTtcclxuICAgICAgICB0aGlzLl9kZWxheVRpbWUgPSB0aGlzLl9kZWxheTtcclxuICAgICAgICB0aGlzLl9vblJlcGxheU9yUmVzdW1lKCk7XHJcbiAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5QTEFZLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25TdG9wICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNQYXVzZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25QYXVzZU9yU3RvcCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNUT1AsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblJlc3VtZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fb25SZXBsYXlPclJlc3VtZSgpO1xyXG4gICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUkVTVU1FLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25QYXVzZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fb25QYXVzZU9yU3RvcCgpO1xyXG4gICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUEFVU0UsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfc2FtcGxlQ3VydmVzIChyYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gQmVmb3JlIHdlIHNhbXBsZSwgd2UgcHVsbCB2YWx1ZXMgb2YgY29tbW9uIHRhcmdldHMuXHJcbiAgICAgICAgZm9yIChsZXQgaUNvbW1vblRhcmdldCA9IDA7IGlDb21tb25UYXJnZXQgPCB0aGlzLl9jb21tb25UYXJnZXRTdGF0dXNlcy5sZW5ndGg7ICsraUNvbW1vblRhcmdldCkge1xyXG4gICAgICAgICAgICBjb25zdCBjb21tb25UYXJnZXRTdGF0dXMgPSB0aGlzLl9jb21tb25UYXJnZXRTdGF0dXNlc1tpQ29tbW9uVGFyZ2V0XTtcclxuICAgICAgICAgICAgaWYgKCFjb21tb25UYXJnZXRTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbW1vblRhcmdldFN0YXR1cy50YXJnZXQucHVsbCgpO1xyXG4gICAgICAgICAgICBjb21tb25UYXJnZXRTdGF0dXMuY2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaVNhbXBsZXJTaGFyZWRHcm91cCA9IDAsIHN6U2FtcGxlclNoYXJlZEdyb3VwID0gdGhpcy5fc2FtcGxlclNoYXJlZEdyb3Vwcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlTYW1wbGVyU2hhcmVkR3JvdXAgPCBzelNhbXBsZXJTaGFyZWRHcm91cDsgKytpU2FtcGxlclNoYXJlZEdyb3VwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNhbXBsZXJTaGFyZWRHcm91cCA9IHRoaXMuX3NhbXBsZXJTaGFyZWRHcm91cHNbaVNhbXBsZXJTaGFyZWRHcm91cF07XHJcbiAgICAgICAgICAgIGNvbnN0IHNhbXBsZXIgPSBzYW1wbGVyU2hhcmVkR3JvdXAuc2FtcGxlcjtcclxuICAgICAgICAgICAgY29uc3QgeyBzYW1wbGVyUmVzdWx0Q2FjaGUgfSA9IHNhbXBsZXJTaGFyZWRHcm91cDtcclxuICAgICAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBsZXQgbGVycFJlcXVpcmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghc2FtcGxlcikge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBzYW1wbGVyLnNhbXBsZShyYXRpbyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB+aW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4IDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPj0gc2FtcGxlci5yYXRpb3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gc2FtcGxlci5yYXRpb3MubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXJwUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzYW1wbGVyUmVzdWx0Q2FjaGUuZnJvbSA9IGluZGV4IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2FtcGxlclJlc3VsdENhY2hlLmZyb21SYXRpbyA9IHNhbXBsZXIucmF0aW9zW3NhbXBsZXJSZXN1bHRDYWNoZS5mcm9tXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2FtcGxlclJlc3VsdENhY2hlLnRvID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhbXBsZXJSZXN1bHRDYWNoZS50b1JhdGlvID0gc2FtcGxlci5yYXRpb3Nbc2FtcGxlclJlc3VsdENhY2hlLnRvXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBzYW1wbGVyUmVzdWx0Q2FjaGUuZnJvbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGlDdXJ2ZUluc3RhbmNlID0gMCwgc3pDdXJ2ZXMgPSBzYW1wbGVyU2hhcmVkR3JvdXAuY3VydmVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGlDdXJ2ZUluc3RhbmNlIDwgc3pDdXJ2ZXM7ICsraUN1cnZlSW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlSW5zdGFuY2UgPSBzYW1wbGVyU2hhcmVkR3JvdXAuY3VydmVzW2lDdXJ2ZUluc3RhbmNlXTtcclxuICAgICAgICAgICAgICAgIGN1cnZlSW5zdGFuY2UuYXBwbHlTYW1wbGUocmF0aW8sIGluZGV4LCBsZXJwUmVxdWlyZWQsIHNhbXBsZXJSZXN1bHRDYWNoZSwgdGhpcy53ZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnZlSW5zdGFuY2UuY29tbW9uVGFyZ2V0SW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1vblRhcmdldFN0YXR1cyA9IHRoaXMuX2NvbW1vblRhcmdldFN0YXR1c2VzW2N1cnZlSW5zdGFuY2UuY29tbW9uVGFyZ2V0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tb25UYXJnZXRTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbW9uVGFyZ2V0U3RhdHVzLmNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWZ0ZXIgc2FtcGxlLCB3ZSBwdXNoIHZhbHVlcyBvZiBjb21tb24gdGFyZ2V0cy5cclxuICAgICAgICBmb3IgKGxldCBpQ29tbW9uVGFyZ2V0ID0gMDsgaUNvbW1vblRhcmdldCA8IHRoaXMuX2NvbW1vblRhcmdldFN0YXR1c2VzLmxlbmd0aDsgKytpQ29tbW9uVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1vblRhcmdldFN0YXR1cyA9IHRoaXMuX2NvbW1vblRhcmdldFN0YXR1c2VzW2lDb21tb25UYXJnZXRdO1xyXG4gICAgICAgICAgICBpZiAoIWNvbW1vblRhcmdldFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbW1vblRhcmdldFN0YXR1cy5jaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tb25UYXJnZXRTdGF0dXMudGFyZ2V0LnB1c2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zYW1wbGVFdmVudHMgKHdyYXBJbmZvOiBXcmFwcGVkSW5mbykge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuX2NsaXAuZXZlbnRHcm91cHMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSB3cmFwSW5mby5kaXJlY3Rpb247XHJcbiAgICAgICAgbGV0IGV2ZW50SW5kZXggPSB0aGlzLl9jbGlwLmdldEV2ZW50R3JvdXBJbmRleEF0UmF0aW8od3JhcEluZm8ucmF0aW8pO1xyXG4gICAgICAgIGlmIChldmVudEluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICBldmVudEluZGV4ID0gfmV2ZW50SW5kZXggLSAxO1xyXG4gICAgICAgICAgICAvLyBJZiBkaXJlY3Rpb24gaXMgaW52ZXJzZSwgaW5jcmVhc2UgaW5kZXguXHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudEluZGV4ICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pZ25vcmVJbmRleCAhPT0gZXZlbnRJbmRleCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pZ25vcmVJbmRleCA9IEludmFsaWRJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdyYXBJbmZvLmZyYW1lSW5kZXggPSBldmVudEluZGV4O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2xhc3RXcmFwSW5mb0V2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpcmVFdmVudChldmVudEluZGV4KTtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdFdyYXBJbmZvRXZlbnQgPSBuZXcgV3JhcHBlZEluZm8od3JhcEluZm8pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3cmFwTW9kZSA9IHRoaXMud3JhcE1vZGU7XHJcbiAgICAgICAgY29uc3QgY3VycmVudEl0ZXJhdGlvbnMgPSB3cmFwSXRlcmF0aW9ucyh3cmFwSW5mby5pdGVyYXRpb25zKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFzdFdyYXBwZWRJbmZvID0gdGhpcy5fbGFzdFdyYXBJbmZvRXZlbnQ7XHJcbiAgICAgICAgbGV0IGxhc3RJdGVyYXRpb25zID0gd3JhcEl0ZXJhdGlvbnMobGFzdFdyYXBwZWRJbmZvLml0ZXJhdGlvbnMpO1xyXG4gICAgICAgIGxldCBsYXN0SW5kZXggPSBsYXN0V3JhcHBlZEluZm8uZnJhbWVJbmRleDtcclxuICAgICAgICBjb25zdCBsYXN0RGlyZWN0aW9uID0gbGFzdFdyYXBwZWRJbmZvLmRpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgY29uc3QgaXRlcmF0aW9uc0NoYW5nZWQgPSBsYXN0SXRlcmF0aW9ucyAhPT0gLTEgJiYgY3VycmVudEl0ZXJhdGlvbnMgIT09IGxhc3RJdGVyYXRpb25zO1xyXG5cclxuICAgICAgICBpZiAobGFzdEluZGV4ID09PSBldmVudEluZGV4ICYmIGl0ZXJhdGlvbnNDaGFuZ2VkICYmIGxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9maXJlRXZlbnQoMCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0SW5kZXggIT09IGV2ZW50SW5kZXggfHwgaXRlcmF0aW9uc0NoYW5nZWQpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gbGFzdERpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXN0SW5kZXggIT09IGV2ZW50SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAtMSAmJiBsYXN0SW5kZXggPT09IDAgJiYgZXZlbnRJbmRleCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCh3cmFwTW9kZSAmIFdyYXBNb2RlTWFzay5QaW5nUG9uZykgPT09IFdyYXBNb2RlTWFzay5QaW5nUG9uZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uICo9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gbGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RJdGVyYXRpb25zKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IDEgJiYgbGFzdEluZGV4ID09PSBsZW5ndGggLSAxICYmIGV2ZW50SW5kZXggPCBsZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgod3JhcE1vZGUgJiBXcmFwTW9kZU1hc2suUGluZ1BvbmcpID09PSBXcmFwTW9kZU1hc2suUGluZ1BvbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbiAqPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RJdGVyYXRpb25zKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEluZGV4ID09PSBldmVudEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdEl0ZXJhdGlvbnMgPiBjdXJyZW50SXRlcmF0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ICs9IGRpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5nZXRBbmltYXRpb25NYW5hZ2VyKCkucHVzaERlbGF5RXZlbnQodGhpcy5fZmlyZUV2ZW50LCB0aGlzLCBbbGFzdEluZGV4XSk7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKGxhc3RJbmRleCAhPT0gZXZlbnRJbmRleCAmJiBsYXN0SW5kZXggPiAtMSAmJiBsYXN0SW5kZXggPCBsZW5ndGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbGFzdFdyYXBJbmZvRXZlbnQuc2V0KHdyYXBJbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9lbWl0ICh0eXBlLCBzdGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXQgJiYgdGhpcy5fdGFyZ2V0LmlzVmFsaWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0LmVtaXQodHlwZSwgdHlwZSwgc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9maXJlRXZlbnQgKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3RhcmdldE5vZGUgfHwgIXRoaXMuX3RhcmdldE5vZGUuaXNWYWxpZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB7IGV2ZW50R3JvdXBzIH0gPSB0aGlzLl9jbGlwO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gZXZlbnRHcm91cHMubGVuZ3RoIHx8IHRoaXMuX2lnbm9yZUluZGV4ID09PSBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBldmVudEdyb3VwID0gZXZlbnRHcm91cHNbaW5kZXhdO1xyXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSB0aGlzLl90YXJnZXROb2RlLmNvbXBvbmVudHM7XHJcbiAgICAgICAgZm9yIChjb25zdCBldmVudCBvZiBldmVudEdyb3VwLmV2ZW50cykge1xyXG4gICAgICAgICAgICBjb25zdCB7IGZ1bmN0aW9uTmFtZSB9ID0gZXZlbnQ7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbXBvbmVudHMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZ4ID0gY29tcG9uZW50W2Z1bmN0aW9uTmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ4ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnguYXBwbHkoY29tcG9uZW50LCBldmVudC5wYXJhbWV0ZXJzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9vblJlcGxheU9yUmVzdW1lICgpIHtcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5nZXRBbmltYXRpb25NYW5hZ2VyKCkuYWRkQW5pbWF0aW9uKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29uUGF1c2VPclN0b3AgKCkge1xyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5yZW1vdmVBbmltYXRpb24odGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGVzdHJveUJsZW5kU3RhdGVXcml0ZXJzICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpQmxlbmRTdGF0ZVdyaXRlciA9IDA7IGlCbGVuZFN0YXRlV3JpdGVyIDwgdGhpcy5fYmxlbmRTdGF0ZVdyaXRlcnMubGVuZ3RoOyArK2lCbGVuZFN0YXRlV3JpdGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JsZW5kU3RhdGVXcml0ZXJzW2lCbGVuZFN0YXRlV3JpdGVyXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2JsZW5kU3RhdGVXcml0ZXJzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVGFyZ2V0aW5nVFJTIChwYXRoOiBUYXJnZXRQYXRoW10pIHtcclxuICAgIGxldCBwcnM6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgcGF0aFswXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBwcnMgPSBwYXRoWzBdO1xyXG4gICAgfSBlbHNlIGlmIChwYXRoLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMTsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmICghKHBhdGhbaV0gaW5zdGFuY2VvZiBIaWVyYXJjaHlQYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBycyA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXSBhcyBzdHJpbmc7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKHBycykge1xyXG4gICAgICAgIGNhc2UgJ3Bvc2l0aW9uJzpcclxuICAgICAgICBjYXNlICdzY2FsZSc6XHJcbiAgICAgICAgY2FzZSAncm90YXRpb24nOlxyXG4gICAgICAgIGNhc2UgJ2V1bGVyQW5nbGVzJzpcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB3cmFwSXRlcmF0aW9ucyAoaXRlcmF0aW9uczogbnVtYmVyKSB7XHJcbiAgICBpZiAoaXRlcmF0aW9ucyAtIChpdGVyYXRpb25zIHwgMCkgPT09IDApIHtcclxuICAgICAgICBpdGVyYXRpb25zIC09IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaXRlcmF0aW9ucyB8IDA7XHJcbn1cclxuXHJcbmxlZ2FjeUNDLkFuaW1hdGlvblN0YXRlID0gQW5pbWF0aW9uU3RhdGU7XHJcbiJdfQ==