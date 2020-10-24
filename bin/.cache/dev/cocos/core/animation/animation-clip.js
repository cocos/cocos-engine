(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../default-constants.js", "../assets/asset.js", "../data/decorators/index.js", "../data/utils/compact-value-type-array.js", "../platform/debug.js", "../utils/binary-search.js", "../utils/murmurhash2_gc.js", "./animation-curve.js", "./skeletal-animation-data-hub.js", "./target-path.js", "./types.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../default-constants.js"), require("../assets/asset.js"), require("../data/decorators/index.js"), require("../data/utils/compact-value-type-array.js"), require("../platform/debug.js"), require("../utils/binary-search.js"), require("../utils/murmurhash2_gc.js"), require("./animation-curve.js"), require("./skeletal-animation-data-hub.js"), require("./target-path.js"), require("./types.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.asset, global.index, global.compactValueTypeArray, global.debug, global.binarySearch, global.murmurhash2_gc, global.animationCurve, global.skeletalAnimationDataHub, global.targetPath, global.types, global.globalExports);
    global.animationClip = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _asset, _index, _compactValueTypeArray, _debug, _binarySearch, _murmurhash2_gc, _animationCurve, _skeletalAnimationDataHub, _targetPath, _types, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AnimationClip = void 0;
  _binarySearch = _interopRequireDefault(_binarySearch);

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _class3, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @zh 动画剪辑表示一段使用动画编辑器编辑的关键帧动画或是外部美术工具生产的骨骼动画。
   * 它的数据主要被分为几层：轨道、关键帧和曲线。
   * @en The animation clip represents a sequence of key frame animation created with the animation editor or skeletal animation other DCC tools.
   * The data is divided in different levels: tracks, key frames, curves.
   */
  var AnimationClip = (_dec = (0, _index.ccclass)('cc.AnimationClip'), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Asset) {
    _inherits(AnimationClip, _Asset);

    function AnimationClip() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, AnimationClip);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(AnimationClip)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "sample", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "speed", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "wrapMode", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "events", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_duration", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_keys", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_stepness", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_curves", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_commonTargets", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_hash", _descriptor10, _assertThisInitialized(_this));

      _this.frameRate = 0;
      _this._ratioSamplers = [];
      _this._runtimeCurves = void 0;
      _this._runtimeEvents = void 0;
      _this._data = null;
      return _this;
    }

    _createClass(AnimationClip, [{
      key: "onLoaded",
      value: function onLoaded() {
        this.frameRate = this.sample;

        this._decodeCVTAs();
      }
    }, {
      key: "getPropertyCurves",
      value: function getPropertyCurves() {
        if (!this._runtimeCurves) {
          this._createPropertyCurves();
        }

        return this._runtimeCurves;
      }
      /**
       * @zh 提交事件数据的修改。
       * 当你修改了 `this.events` 时，必须调用 `this.updateEventDatas()` 使修改生效。
       * @en
       * Commit event data update.
       * You should call this function after you changed the `events` data to take effect.
       * @internal
       */

    }, {
      key: "updateEventDatas",
      value: function updateEventDatas() {
        delete this._runtimeEvents;
      }
      /**
       * @en Gets the event group shall be processed at specified ratio.
       * @zh 获取事件组应按指定比例处理。
       * @param ratio The ratio.
       * @internal
       */

    }, {
      key: "getEventGroupIndexAtRatio",
      value: function getEventGroupIndexAtRatio(ratio) {
        if (!this._runtimeEvents) {
          this._createRuntimeEvents();
        }

        var result = (0, _binarySearch.default)(this._runtimeEvents.ratios, ratio);
        return result;
      }
      /**
       * @zh 返回本动画是否包含事件数据。
       * @en Returns if this animation contains event data.
       * @protected
       */

    }, {
      key: "hasEvents",
      value: function hasEvents() {
        return this.events.length !== 0;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _globalExports.legacyCC.director.root.dataPoolManager.releaseAnimationClip(this);

        _skeletalAnimationDataHub.SkelAnimDataHub.destroy(this);

        return _get(_getPrototypeOf(AnimationClip.prototype), "destroy", this).call(this);
      }
    }, {
      key: "_createPropertyCurves",
      value: function _createPropertyCurves() {
        var _this2 = this;

        this._ratioSamplers = this._keys.map(function (keys) {
          return new _animationCurve.RatioSampler(keys.map(function (key) {
            return key / _this2._duration;
          }));
        });
        this._runtimeCurves = this._curves.map(function (targetCurve) {
          return {
            curve: new _animationCurve.AnimCurve(targetCurve.data, _this2._duration),
            modifiers: targetCurve.modifiers,
            valueAdapter: targetCurve.valueAdapter,
            sampler: _this2._ratioSamplers[targetCurve.data.keys],
            commonTarget: targetCurve.commonTarget
          };
        });

        this._applyStepness();
      }
    }, {
      key: "_createRuntimeEvents",
      value: function _createRuntimeEvents() {
        var _this3 = this;

        if (_defaultConstants.EDITOR) {
          return;
        }

        var ratios = [];
        var eventGroups = [];
        var events = this.events.sort(function (a, b) {
          return a.frame - b.frame;
        });

        var _iterator = _createForOfIteratorHelper(events),
            _step;

        try {
          var _loop = function _loop() {
            var eventData = _step.value;
            var ratio = eventData.frame / _this3._duration;
            var i = ratios.findIndex(function (r) {
              return r === ratio;
            });

            if (i < 0) {
              i = ratios.length;
              ratios.push(ratio);
              eventGroups.push({
                events: []
              });
            }

            eventGroups[i].events.push({
              functionName: eventData.func,
              parameters: eventData.params
            });
          };

          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._runtimeEvents = {
          ratios: ratios,
          eventGroups: eventGroups
        };
      }
    }, {
      key: "_applyStepness",
      value: function _applyStepness() {
        if (!this._runtimeCurves) {
          return;
        } // for (const propertyCurve of this._propertyCurves) {
        //     propertyCurve.curve.stepfy(this._stepness);
        // }

      }
    }, {
      key: "_decodeCVTAs",
      value: function _decodeCVTAs() {
        var binaryBuffer = ArrayBuffer.isView(this._nativeAsset) ? this._nativeAsset.buffer : this._nativeAsset;

        if (!binaryBuffer) {
          return;
        }

        var maybeCompressedKeys = this._keys;

        for (var iKey = 0; iKey < maybeCompressedKeys.length; ++iKey) {
          var keys = maybeCompressedKeys[iKey];

          if (keys instanceof _compactValueTypeArray.CompactValueTypeArray) {
            maybeCompressedKeys[iKey] = keys.decompress(binaryBuffer);
          }
        }

        for (var iCurve = 0; iCurve < this._curves.length; ++iCurve) {
          var curve = this._curves[iCurve];

          if (curve.data.values instanceof _compactValueTypeArray.CompactValueTypeArray) {
            curve.data.values = curve.data.values.decompress(binaryBuffer);
          }
        }
      }
    }, {
      key: "duration",

      /**
       * @zh 动画的周期。
       * @en Animation duration.
       */
      get: function get() {
        return this._duration;
      },
      set: function set(value) {
        this._duration = value;
      }
      /**
       * @zh 曲线可引用的所有时间轴。
       * @en Frame keys referenced by curves.
       */

    }, {
      key: "keys",
      get: function get() {
        return this._keys;
      },
      set: function set(value) {
        this._keys = value;
      }
      /**
       * @protected
       */

    }, {
      key: "eventGroups",
      get: function get() {
        if (!this._runtimeEvents) {
          this._createRuntimeEvents();
        }

        return this._runtimeEvents.eventGroups;
      }
      /**
       * @protected
       */

    }, {
      key: "stepness",
      get: function get() {
        return this._stepness;
      }
      /**
       * @protected
       */
      ,
      set: function set(value) {
        this._stepness = value;

        this._applyStepness();
      }
    }, {
      key: "hash",
      get: function get() {
        // hashes should already be computed offline, but if not, make one
        if (this._hash) {
          return this._hash;
        }

        var data = this._nativeAsset;
        var buffer = new Uint8Array(ArrayBuffer.isView(data) ? data.buffer : data);
        return this._hash = (0, _murmurhash2_gc.murmurhash2_32_gc)(buffer, 666);
      }
    }, {
      key: "curves",
      get: function get() {
        return this._curves;
      },
      set: function set(value) {
        this._curves = value;
        delete this._runtimeCurves;
      }
      /**
       * 此动画的数据。
       */

    }, {
      key: "data",
      get: function get() {
        return this._data;
      }
    }, {
      key: "commonTargets",
      get: function get() {
        return this._commonTargets;
      },
      set: function set(value) {
        this._commonTargets = value;
      }
    }], [{
      key: "createWithSpriteFrames",

      /**
       * @en Crate clip with a set of sprite frames
       * @zh 使用一组序列帧图片来创建动画剪辑
       * @example
       * ```
       * import { AnimationClip } from 'cc';
       * const clip = AnimationClip.createWithSpriteFrames(spriteFrames, 10);
       * ```
       */
      value: function createWithSpriteFrames(spriteFrames, sample) {
        if (!Array.isArray(spriteFrames)) {
          (0, _debug.errorID)(3905);
          return null;
        }

        var clip = new AnimationClip();
        clip.sample = sample || clip.sample;
        clip.duration = spriteFrames.length / clip.sample;
        var step = 1 / clip.sample;
        var keys = new Array(spriteFrames.length);
        var values = new Array(keys.length);

        for (var i = 0; i < spriteFrames.length; i++) {
          keys[i] = i * step;
          values[i] = spriteFrames[i];
        }

        clip.keys = [keys];
        clip.curves = [{
          modifiers: [new _targetPath.ComponentPath('cc.Sprite'), 'spriteFrame'],
          data: {
            keys: 0,
            values: values
          }
        }];
        return clip;
      }
      /**
       * @zh 动画帧率，单位为帧/秒。注意此属性仅用于编辑器动画编辑。
       * @en Animation frame rate: frames per second.
       * Note this property is only used for animation editing in Editor.
       */

    }]);

    return AnimationClip;
  }(_asset.Asset), _class3.preventDeferredLoadDependents = true, _class3.WrapMode = _types.WrapMode, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sample", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 60;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "speed", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "wrapMode", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _types.WrapMode.Normal;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "events", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_duration", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_keys", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_stepness", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_curves", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_commonTargets", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_hash", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class);
  _exports.AnimationClip = AnimationClip;
  _globalExports.legacyCC.AnimationClip = AnimationClip;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2FuaW1hdGlvbi1jbGlwLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbkNsaXAiLCJmcmFtZVJhdGUiLCJfcmF0aW9TYW1wbGVycyIsIl9ydW50aW1lQ3VydmVzIiwiX3J1bnRpbWVFdmVudHMiLCJfZGF0YSIsInNhbXBsZSIsIl9kZWNvZGVDVlRBcyIsIl9jcmVhdGVQcm9wZXJ0eUN1cnZlcyIsInJhdGlvIiwiX2NyZWF0ZVJ1bnRpbWVFdmVudHMiLCJyZXN1bHQiLCJyYXRpb3MiLCJldmVudHMiLCJsZW5ndGgiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwicm9vdCIsImRhdGFQb29sTWFuYWdlciIsInJlbGVhc2VBbmltYXRpb25DbGlwIiwiU2tlbEFuaW1EYXRhSHViIiwiZGVzdHJveSIsIl9rZXlzIiwibWFwIiwia2V5cyIsIlJhdGlvU2FtcGxlciIsImtleSIsIl9kdXJhdGlvbiIsIl9jdXJ2ZXMiLCJ0YXJnZXRDdXJ2ZSIsImN1cnZlIiwiQW5pbUN1cnZlIiwiZGF0YSIsIm1vZGlmaWVycyIsInZhbHVlQWRhcHRlciIsInNhbXBsZXIiLCJjb21tb25UYXJnZXQiLCJfYXBwbHlTdGVwbmVzcyIsIkVESVRPUiIsImV2ZW50R3JvdXBzIiwic29ydCIsImEiLCJiIiwiZnJhbWUiLCJldmVudERhdGEiLCJpIiwiZmluZEluZGV4IiwiciIsInB1c2giLCJmdW5jdGlvbk5hbWUiLCJmdW5jIiwicGFyYW1ldGVycyIsInBhcmFtcyIsImJpbmFyeUJ1ZmZlciIsIkFycmF5QnVmZmVyIiwiaXNWaWV3IiwiX25hdGl2ZUFzc2V0IiwiYnVmZmVyIiwibWF5YmVDb21wcmVzc2VkS2V5cyIsImlLZXkiLCJDb21wYWN0VmFsdWVUeXBlQXJyYXkiLCJkZWNvbXByZXNzIiwiaUN1cnZlIiwidmFsdWVzIiwidmFsdWUiLCJfc3RlcG5lc3MiLCJfaGFzaCIsIlVpbnQ4QXJyYXkiLCJfY29tbW9uVGFyZ2V0cyIsInNwcml0ZUZyYW1lcyIsIkFycmF5IiwiaXNBcnJheSIsImNsaXAiLCJkdXJhdGlvbiIsInN0ZXAiLCJjdXJ2ZXMiLCJDb21wb25lbnRQYXRoIiwiQXNzZXQiLCJwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cyIsIldyYXBNb2RlIiwiQW5pbWF0aW9uV3JhcE1vZGUiLCJzZXJpYWxpemFibGUiLCJOb3JtYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUZBOzs7Ozs7TUFPYUEsYSxXQURaLG9CQUFRLGtCQUFSLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQThGV0MsUyxHQUFZLEM7WUFDWkMsYyxHQUFpQyxFO1lBQ2pDQyxjO1lBQ0FDLGM7WUFLQUMsSyxHQUEyQixJOzs7Ozs7aUNBbUZoQjtBQUNmLGFBQUtKLFNBQUwsR0FBaUIsS0FBS0ssTUFBdEI7O0FBQ0EsYUFBS0MsWUFBTDtBQUNIOzs7MENBRXFEO0FBQ2xELFlBQUksQ0FBQyxLQUFLSixjQUFWLEVBQTBCO0FBQ3RCLGVBQUtLLHFCQUFMO0FBQ0g7O0FBQ0QsZUFBTyxLQUFLTCxjQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7eUNBUTJCO0FBQ3ZCLGVBQU8sS0FBS0MsY0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7OztnREFNa0NLLEssRUFBdUI7QUFDckQsWUFBSSxDQUFDLEtBQUtMLGNBQVYsRUFBMEI7QUFDdEIsZUFBS00sb0JBQUw7QUFDSDs7QUFDRCxZQUFNQyxNQUFNLEdBQUcsMkJBQW9CLEtBQUtQLGNBQUwsQ0FBcUJRLE1BQXpDLEVBQWlESCxLQUFqRCxDQUFmO0FBQ0EsZUFBT0UsTUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7O2tDQUtvQjtBQUNoQixlQUFPLEtBQUtFLE1BQUwsQ0FBWUMsTUFBWixLQUF1QixDQUE5QjtBQUNIOzs7Z0NBRWlCO0FBQ2JDLGdDQUFTQyxRQUFULENBQWtCQyxJQUFsQixDQUF1QkMs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O0FBQ0g7QUFFRDs7Ozs7Ozs7O0lBOUMrQkssWSxXQUNqQkMsNkIsR0FBZ0MsSSxVQUVoQ0MsUSxHQUFXQyxlLGlGQWdEeEJDLG1COzs7OzthQUNlLEU7OzRFQU1mQSxtQjs7Ozs7YUFDYyxDOzsrRUFNZEEsbUI7Ozs7O2FBQ2lCRCxnQkFBa0JFLE07OzZFQU1uQ0QsbUI7Ozs7O2FBQ3VDLEU7O2dGQUV2Q0EsbUI7Ozs7O2FBQ21CLEM7OzRFQUVuQkEsbUI7Ozs7O2FBQzJCLEU7O2dGQUUzQkEsbUI7Ozs7O2FBQ21CLEM7OzhFQUVuQkEsbUI7Ozs7O2FBQ3lDLEU7O3FGQUV6Q0EsbUI7Ozs7O2FBQ3VELEU7OzZFQUV2REEsbUI7Ozs7O2FBQ2UsQzs7OztBQW1PcEJsRSwwQkFBU2YsYUFBVCxHQUF5QkEsYUFBekIiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBhbmltYXRpb25cclxuICovXHJcblxyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4uL2Fzc2V0cy9hc3NldCc7XHJcbmltcG9ydCB7IFNwcml0ZUZyYW1lIH0gZnJvbSAnLi4vYXNzZXRzL3Nwcml0ZS1mcmFtZSc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IENvbXBhY3RWYWx1ZVR5cGVBcnJheSB9IGZyb20gJy4uL2RhdGEvdXRpbHMvY29tcGFjdC12YWx1ZS10eXBlLWFycmF5JztcclxuaW1wb3J0IHsgZXJyb3JJRCB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgRGF0YVBvb2xNYW5hZ2VyIH0gZnJvbSAnLi4vcmVuZGVyZXIvZGF0YS1wb29sLW1hbmFnZXInO1xyXG5pbXBvcnQgYmluYXJ5U2VhcmNoRXBzaWxvbiBmcm9tICcuLi91dGlscy9iaW5hcnktc2VhcmNoJztcclxuaW1wb3J0IHsgbXVybXVyaGFzaDJfMzJfZ2MgfSBmcm9tICcuLi91dGlscy9tdXJtdXJoYXNoMl9nYyc7XHJcbmltcG9ydCB7IEFuaW1DdXJ2ZSwgSVByb3BlcnR5Q3VydmVEYXRhLCBSYXRpb1NhbXBsZXIgfSBmcm9tICcuL2FuaW1hdGlvbi1jdXJ2ZSc7XHJcbmltcG9ydCB7IFNrZWxBbmltRGF0YUh1YiB9IGZyb20gJy4vc2tlbGV0YWwtYW5pbWF0aW9uLWRhdGEtaHViJztcclxuaW1wb3J0IHsgQ29tcG9uZW50UGF0aCwgSGllcmFyY2h5UGF0aCwgVGFyZ2V0UGF0aCB9IGZyb20gJy4vdGFyZ2V0LXBhdGgnO1xyXG5pbXBvcnQgeyBXcmFwTW9kZSBhcyBBbmltYXRpb25XcmFwTW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBJVmFsdWVQcm94eUZhY3RvcnkgfSBmcm9tICcuL3ZhbHVlLXByb3h5JztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElPYmplY3RDdXJ2ZURhdGEge1xyXG4gICAgW3Byb3BlcnR5TmFtZTogc3RyaW5nXTogSVByb3BlcnR5Q3VydmVEYXRhO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDb21wb25lbnRzQ3VydmVEYXRhIHtcclxuICAgIFtjb21wb25lbnROYW1lOiBzdHJpbmddOiBJT2JqZWN0Q3VydmVEYXRhO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElOb2RlQ3VydmVEYXRhIHtcclxuICAgIHByb3BzPzogSU9iamVjdEN1cnZlRGF0YTtcclxuICAgIGNvbXBzPzogSUNvbXBvbmVudHNDdXJ2ZURhdGE7XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIElSdW50aW1lQ3VydmUgPSBQaWNrPEFuaW1hdGlvbkNsaXAuSUN1cnZlLCAnbW9kaWZpZXJzJyB8ICd2YWx1ZUFkYXB0ZXInIHwgJ2NvbW1vblRhcmdldCc+ICYge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlsZ7mgKfmm7Lnur/jgIJcclxuICAgICAqL1xyXG4gICAgY3VydmU6IEFuaW1DdXJ2ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOabsue6v+mHh+agt+WZqOOAglxyXG4gICAgICovXHJcbiAgICBzYW1wbGVyOiBSYXRpb1NhbXBsZXIgfCBudWxsO1xyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQW5pbWF0aW9uRXZlbnQge1xyXG4gICAgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XHJcbiAgICBwYXJhbWV0ZXJzOiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQW5pbWF0aW9uRXZlbnRHcm91cCB7XHJcbiAgICBldmVudHM6IElBbmltYXRpb25FdmVudFtdO1xyXG59XHJcblxyXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgQW5pbWF0aW9uQ2xpcCB7XHJcbiAgICBleHBvcnQgdHlwZSBQcm9wZXJ0eUN1cnZlRGF0YSA9IElQcm9wZXJ0eUN1cnZlRGF0YTtcclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElDdXJ2ZSB7XHJcbiAgICAgICAgY29tbW9uVGFyZ2V0PzogbnVtYmVyO1xyXG4gICAgICAgIG1vZGlmaWVyczogVGFyZ2V0UGF0aFtdO1xyXG4gICAgICAgIHZhbHVlQWRhcHRlcj86IElWYWx1ZVByb3h5RmFjdG9yeTtcclxuICAgICAgICBkYXRhOiBQcm9wZXJ0eUN1cnZlRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElDb21tb25UYXJnZXQge1xyXG4gICAgICAgIG1vZGlmaWVyczogVGFyZ2V0UGF0aFtdO1xyXG4gICAgICAgIHZhbHVlQWRhcHRlcj86IElWYWx1ZVByb3h5RmFjdG9yeTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElFdmVudCB7XHJcbiAgICAgICAgZnJhbWU6IG51bWJlcjtcclxuICAgICAgICBmdW5jOiBzdHJpbmc7XHJcbiAgICAgICAgcGFyYW1zOiBzdHJpbmdbXTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIF9pbXBsIHtcclxuICAgICAgICB0eXBlIE1heWJlQ29tcGFjdEN1cnZlID0gT21pdDxBbmltYXRpb25DbGlwLklDdXJ2ZSwgJ2RhdGEnPiAmIHtcclxuICAgICAgICAgICAgZGF0YTogT21pdDxBbmltYXRpb25DbGlwLlByb3BlcnR5Q3VydmVEYXRhLCAndmFsdWVzJz4gJiB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IGFueVtdIHwgQ29tcGFjdFZhbHVlVHlwZUFycmF5O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHR5cGUgTWF5YmVDb21wYWN0S2V5cyA9IEFycmF5PG51bWJlcltdIHwgQ29tcGFjdFZhbHVlVHlwZUFycmF5PjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEB6aCDliqjnlLvliarovpHooajnpLrkuIDmrrXkvb/nlKjliqjnlLvnvJbovpHlmajnvJbovpHnmoTlhbPplK7luKfliqjnlLvmiJbmmK/lpJbpg6jnvo7mnK/lt6XlhbfnlJ/kuqfnmoTpqqjpqrzliqjnlLvjgIJcclxuICog5a6D55qE5pWw5o2u5Li76KaB6KKr5YiG5Li65Yeg5bGC77ya6L2o6YGT44CB5YWz6ZSu5bin5ZKM5puy57q/44CCXHJcbiAqIEBlbiBUaGUgYW5pbWF0aW9uIGNsaXAgcmVwcmVzZW50cyBhIHNlcXVlbmNlIG9mIGtleSBmcmFtZSBhbmltYXRpb24gY3JlYXRlZCB3aXRoIHRoZSBhbmltYXRpb24gZWRpdG9yIG9yIHNrZWxldGFsIGFuaW1hdGlvbiBvdGhlciBEQ0MgdG9vbHMuXHJcbiAqIFRoZSBkYXRhIGlzIGRpdmlkZWQgaW4gZGlmZmVyZW50IGxldmVsczogdHJhY2tzLCBrZXkgZnJhbWVzLCBjdXJ2ZXMuXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQW5pbWF0aW9uQ2xpcCcpXHJcbmV4cG9ydCBjbGFzcyBBbmltYXRpb25DbGlwIGV4dGVuZHMgQXNzZXQge1xyXG4gICAgcHVibGljIHN0YXRpYyBwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cyA9IHRydWU7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBXcmFwTW9kZSA9IEFuaW1hdGlvbldyYXBNb2RlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENyYXRlIGNsaXAgd2l0aCBhIHNldCBvZiBzcHJpdGUgZnJhbWVzXHJcbiAgICAgKiBAemgg5L2/55So5LiA57uE5bqP5YiX5bin5Zu+54mH5p2l5Yib5bu65Yqo55S75Ymq6L6RXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgXHJcbiAgICAgKiBpbXBvcnQgeyBBbmltYXRpb25DbGlwIH0gZnJvbSAnY2MnO1xyXG4gICAgICogY29uc3QgY2xpcCA9IEFuaW1hdGlvbkNsaXAuY3JlYXRlV2l0aFNwcml0ZUZyYW1lcyhzcHJpdGVGcmFtZXMsIDEwKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVdpdGhTcHJpdGVGcmFtZXMgKHNwcml0ZUZyYW1lczogU3ByaXRlRnJhbWVbXSwgc2FtcGxlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoc3ByaXRlRnJhbWVzKSkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDM5MDUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsaXAgPSBuZXcgQW5pbWF0aW9uQ2xpcCgpO1xyXG4gICAgICAgIGNsaXAuc2FtcGxlID0gc2FtcGxlIHx8IGNsaXAuc2FtcGxlO1xyXG5cclxuICAgICAgICBjbGlwLmR1cmF0aW9uID0gc3ByaXRlRnJhbWVzLmxlbmd0aCAvIGNsaXAuc2FtcGxlO1xyXG4gICAgICAgIGNvbnN0IHN0ZXAgPSAxIC8gY2xpcC5zYW1wbGU7XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IG5ldyBBcnJheTxudW1iZXI+KHNwcml0ZUZyYW1lcy5sZW5ndGgpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBBcnJheTxTcHJpdGVGcmFtZT4oa2V5cy5sZW5ndGgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ByaXRlRnJhbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGtleXNbaV0gPSBpICogc3RlcDtcclxuICAgICAgICAgICAgdmFsdWVzW2ldID0gc3ByaXRlRnJhbWVzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGlwLmtleXMgPSBba2V5c107XHJcbiAgICAgICAgY2xpcC5jdXJ2ZXMgPSBbe1xyXG4gICAgICAgICAgICBtb2RpZmllcnM6IFtcclxuICAgICAgICAgICAgICAgIG5ldyBDb21wb25lbnRQYXRoKCdjYy5TcHJpdGUnKSxcclxuICAgICAgICAgICAgICAgICdzcHJpdGVGcmFtZScsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGtleXM6IDAsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfV07XHJcblxyXG4gICAgICAgIHJldHVybiBjbGlwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWKqOeUu+W4p+eOh++8jOWNleS9jeS4uuW4py/np5LjgILms6jmhI/mraTlsZ7mgKfku4XnlKjkuo7nvJbovpHlmajliqjnlLvnvJbovpHjgIJcclxuICAgICAqIEBlbiBBbmltYXRpb24gZnJhbWUgcmF0ZTogZnJhbWVzIHBlciBzZWNvbmQuXHJcbiAgICAgKiBOb3RlIHRoaXMgcHJvcGVydHkgaXMgb25seSB1c2VkIGZvciBhbmltYXRpb24gZWRpdGluZyBpbiBFZGl0b3IuXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBzYW1wbGUgPSA2MDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliqjnlLvnmoTmkq3mlL7pgJ/luqbjgIJcclxuICAgICAqIEBlbiBBbmltYXRpb24gcGxheWJhY2sgc3BlZWQuXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBzcGVlZCA9IDE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yqo55S755qE5b6q546v5qih5byP44CCXHJcbiAgICAgKiBAZW4gQW5pbWF0aW9uIGxvb3AgbW9kZS5cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHVibGljIHdyYXBNb2RlID0gQW5pbWF0aW9uV3JhcE1vZGUuTm9ybWFsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWKqOeUu+WMheWQq+eahOS6i+S7tuaVsOaNruOAglxyXG4gICAgICogQGVuIEFzc29jaWF0ZWQgZXZlbnQgZGF0YS5cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHVibGljIGV2ZW50czogQW5pbWF0aW9uQ2xpcC5JRXZlbnRbXSA9IFtdO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2R1cmF0aW9uID0gMDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9rZXlzOiBudW1iZXJbXVtdID0gW107XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfc3RlcG5lc3MgPSAwO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2N1cnZlczogQW5pbWF0aW9uQ2xpcC5JQ3VydmVbXSA9IFtdO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2NvbW1vblRhcmdldHM6IEFuaW1hdGlvbkNsaXAuSUNvbW1vblRhcmdldFtdID0gW107XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaGFzaCA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBmcmFtZVJhdGUgPSAwO1xyXG4gICAgcHJpdmF0ZSBfcmF0aW9TYW1wbGVyczogUmF0aW9TYW1wbGVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3J1bnRpbWVDdXJ2ZXM/OiBJUnVudGltZUN1cnZlW107XHJcbiAgICBwcml2YXRlIF9ydW50aW1lRXZlbnRzPzoge1xyXG4gICAgICAgIHJhdGlvczogbnVtYmVyW107XHJcbiAgICAgICAgZXZlbnRHcm91cHM6IElBbmltYXRpb25FdmVudEdyb3VwW107XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgX2RhdGE6IFVpbnQ4QXJyYXkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliqjnlLvnmoTlkajmnJ/jgIJcclxuICAgICAqIEBlbiBBbmltYXRpb24gZHVyYXRpb24uXHJcbiAgICAgKi9cclxuICAgIGdldCBkdXJhdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBkdXJhdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOabsue6v+WPr+W8leeUqOeahOaJgOacieaXtumXtOi9tOOAglxyXG4gICAgICogQGVuIEZyYW1lIGtleXMgcmVmZXJlbmNlZCBieSBjdXJ2ZXMuXHJcbiAgICAgKi9cclxuICAgIGdldCBrZXlzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fa2V5cztcclxuICAgIH1cclxuXHJcbiAgICBzZXQga2V5cyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9rZXlzID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGdldCBldmVudEdyb3VwcyAoKTogcmVhZG9ubHkgSUFuaW1hdGlvbkV2ZW50R3JvdXBbXSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9ydW50aW1lRXZlbnRzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVJ1bnRpbWVFdmVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1bnRpbWVFdmVudHMhLmV2ZW50R3JvdXBzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBnZXQgc3RlcG5lc3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwbmVzcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgc2V0IHN0ZXBuZXNzICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3N0ZXBuZXNzID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fYXBwbHlTdGVwbmVzcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoYXNoICgpIHtcclxuICAgICAgICAvLyBoYXNoZXMgc2hvdWxkIGFscmVhZHkgYmUgY29tcHV0ZWQgb2ZmbGluZSwgYnV0IGlmIG5vdCwgbWFrZSBvbmVcclxuICAgICAgICBpZiAodGhpcy5faGFzaCkgeyByZXR1cm4gdGhpcy5faGFzaDsgfVxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9uYXRpdmVBc3NldDtcclxuICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDhBcnJheShBcnJheUJ1ZmZlci5pc1ZpZXcoZGF0YSkgPyBkYXRhLmJ1ZmZlciA6IGRhdGEpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNoID0gbXVybXVyaGFzaDJfMzJfZ2MoYnVmZmVyLCA2NjYpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJ2ZXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJ2ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGN1cnZlcyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9jdXJ2ZXMgPSB2YWx1ZTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcnVudGltZUN1cnZlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOatpOWKqOeUu+eahOaVsOaNruOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZGF0YSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbW1vblRhcmdldHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21tb25UYXJnZXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb21tb25UYXJnZXRzICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2NvbW1vblRhcmdldHMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkZWQgKCkge1xyXG4gICAgICAgIHRoaXMuZnJhbWVSYXRlID0gdGhpcy5zYW1wbGU7XHJcbiAgICAgICAgdGhpcy5fZGVjb2RlQ1ZUQXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UHJvcGVydHlDdXJ2ZXMgKCk6IHJlYWRvbmx5IElSdW50aW1lQ3VydmVbXSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9ydW50aW1lQ3VydmVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVByb3BlcnR5Q3VydmVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9ydW50aW1lQ3VydmVzITtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmj5DkuqTkuovku7bmlbDmja7nmoTkv67mlLnjgIJcclxuICAgICAqIOW9k+S9oOS/ruaUueS6hiBgdGhpcy5ldmVudHNgIOaXtu+8jOW/hemhu+iwg+eUqCBgdGhpcy51cGRhdGVFdmVudERhdGFzKClgIOS9v+S/ruaUueeUn+aViOOAglxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb21taXQgZXZlbnQgZGF0YSB1cGRhdGUuXHJcbiAgICAgKiBZb3Ugc2hvdWxkIGNhbGwgdGhpcyBmdW5jdGlvbiBhZnRlciB5b3UgY2hhbmdlZCB0aGUgYGV2ZW50c2AgZGF0YSB0byB0YWtlIGVmZmVjdC5cclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlRXZlbnREYXRhcyAoKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3J1bnRpbWVFdmVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0cyB0aGUgZXZlbnQgZ3JvdXAgc2hhbGwgYmUgcHJvY2Vzc2VkIGF0IHNwZWNpZmllZCByYXRpby5cclxuICAgICAqIEB6aCDojrflj5bkuovku7bnu4TlupTmjInmjIflrprmr5TkvovlpITnkIbjgIJcclxuICAgICAqIEBwYXJhbSByYXRpbyBUaGUgcmF0aW8uXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEV2ZW50R3JvdXBJbmRleEF0UmF0aW8gKHJhdGlvOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICghdGhpcy5fcnVudGltZUV2ZW50cykge1xyXG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVSdW50aW1lRXZlbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGJpbmFyeVNlYXJjaEVwc2lsb24odGhpcy5fcnVudGltZUV2ZW50cyEucmF0aW9zLCByYXRpbyk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDov5Tlm57mnKzliqjnlLvmmK/lkKbljIXlkKvkuovku7bmlbDmja7jgIJcclxuICAgICAqIEBlbiBSZXR1cm5zIGlmIHRoaXMgYW5pbWF0aW9uIGNvbnRhaW5zIGV2ZW50IGRhdGEuXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoYXNFdmVudHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50cy5sZW5ndGggIT09IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIChsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRhdGFQb29sTWFuYWdlciBhcyBEYXRhUG9vbE1hbmFnZXIpLnJlbGVhc2VBbmltYXRpb25DbGlwKHRoaXMpO1xyXG4gICAgICAgIFNrZWxBbmltRGF0YUh1Yi5kZXN0cm95KHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVQcm9wZXJ0eUN1cnZlcyAoKSB7XHJcbiAgICAgICAgdGhpcy5fcmF0aW9TYW1wbGVycyA9IHRoaXMuX2tleXMubWFwKFxyXG4gICAgICAgICAgICAoa2V5cykgPT4gbmV3IFJhdGlvU2FtcGxlcihcclxuICAgICAgICAgICAgICAgIGtleXMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgIChrZXkpID0+IGtleSAvIHRoaXMuX2R1cmF0aW9uKSkpO1xyXG5cclxuICAgICAgICB0aGlzLl9ydW50aW1lQ3VydmVzID0gdGhpcy5fY3VydmVzLm1hcCgodGFyZ2V0Q3VydmUpOiBJUnVudGltZUN1cnZlID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGN1cnZlOiBuZXcgQW5pbUN1cnZlKHRhcmdldEN1cnZlLmRhdGEsIHRoaXMuX2R1cmF0aW9uKSxcclxuICAgICAgICAgICAgICAgIG1vZGlmaWVyczogdGFyZ2V0Q3VydmUubW9kaWZpZXJzLFxyXG4gICAgICAgICAgICAgICAgdmFsdWVBZGFwdGVyOiB0YXJnZXRDdXJ2ZS52YWx1ZUFkYXB0ZXIsXHJcbiAgICAgICAgICAgICAgICBzYW1wbGVyOiB0aGlzLl9yYXRpb1NhbXBsZXJzW3RhcmdldEN1cnZlLmRhdGEua2V5c10sXHJcbiAgICAgICAgICAgICAgICBjb21tb25UYXJnZXQ6IHRhcmdldEN1cnZlLmNvbW1vblRhcmdldCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fYXBwbHlTdGVwbmVzcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY3JlYXRlUnVudGltZUV2ZW50cyAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByYXRpb3M6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgY29uc3QgZXZlbnRHcm91cHM6IElBbmltYXRpb25FdmVudEdyb3VwW10gPSBbXTtcclxuICAgICAgICBjb25zdCBldmVudHMgPSB0aGlzLmV2ZW50cy5zb3J0KChhLCBiKSA9PiBhLmZyYW1lIC0gYi5mcmFtZSk7XHJcbiAgICAgICAgZm9yIChjb25zdCBldmVudERhdGEgb2YgZXZlbnRzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhdGlvID0gZXZlbnREYXRhLmZyYW1lIC8gdGhpcy5fZHVyYXRpb247XHJcbiAgICAgICAgICAgIGxldCBpID0gcmF0aW9zLmZpbmRJbmRleCgocikgPT4gciA9PT0gcmF0aW8pO1xyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGkgPSByYXRpb3MubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgcmF0aW9zLnB1c2gocmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgZXZlbnRHcm91cHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiBbXSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50R3JvdXBzW2ldLmV2ZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZXZlbnREYXRhLmZ1bmMsXHJcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBldmVudERhdGEucGFyYW1zLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3J1bnRpbWVFdmVudHMgPSB7XHJcbiAgICAgICAgICAgIHJhdGlvcyxcclxuICAgICAgICAgICAgZXZlbnRHcm91cHMsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2FwcGx5U3RlcG5lc3MgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcnVudGltZUN1cnZlcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciAoY29uc3QgcHJvcGVydHlDdXJ2ZSBvZiB0aGlzLl9wcm9wZXJ0eUN1cnZlcykge1xyXG4gICAgICAgIC8vICAgICBwcm9wZXJ0eUN1cnZlLmN1cnZlLnN0ZXBmeSh0aGlzLl9zdGVwbmVzcyk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2RlY29kZUNWVEFzICgpIHtcclxuICAgICAgICBjb25zdCBiaW5hcnlCdWZmZXI6IEFycmF5QnVmZmVyID0gQXJyYXlCdWZmZXIuaXNWaWV3KHRoaXMuX25hdGl2ZUFzc2V0KSA/IHRoaXMuX25hdGl2ZUFzc2V0LmJ1ZmZlciA6IHRoaXMuX25hdGl2ZUFzc2V0O1xyXG4gICAgICAgIGlmICghYmluYXJ5QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1heWJlQ29tcHJlc3NlZEtleXMgPSB0aGlzLl9rZXlzIGFzIEFuaW1hdGlvbkNsaXAuX2ltcGwuTWF5YmVDb21wYWN0S2V5cztcclxuICAgICAgICBmb3IgKGxldCBpS2V5ID0gMDsgaUtleSA8IG1heWJlQ29tcHJlc3NlZEtleXMubGVuZ3RoOyArK2lLZXkpIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5cyA9IG1heWJlQ29tcHJlc3NlZEtleXNbaUtleV07XHJcbiAgICAgICAgICAgIGlmIChrZXlzIGluc3RhbmNlb2YgQ29tcGFjdFZhbHVlVHlwZUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBtYXliZUNvbXByZXNzZWRLZXlzW2lLZXldID0ga2V5cy5kZWNvbXByZXNzKGJpbmFyeUJ1ZmZlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlDdXJ2ZSA9IDA7IGlDdXJ2ZSA8IHRoaXMuX2N1cnZlcy5sZW5ndGg7ICsraUN1cnZlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnZlID0gdGhpcy5fY3VydmVzW2lDdXJ2ZV0gYXMgQW5pbWF0aW9uQ2xpcC5faW1wbC5NYXliZUNvbXBhY3RDdXJ2ZTtcclxuICAgICAgICAgICAgaWYgKGN1cnZlLmRhdGEudmFsdWVzIGluc3RhbmNlb2YgQ29tcGFjdFZhbHVlVHlwZUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBjdXJ2ZS5kYXRhLnZhbHVlcyA9IGN1cnZlLmRhdGEudmFsdWVzLmRlY29tcHJlc3MoYmluYXJ5QnVmZmVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuQW5pbWF0aW9uQ2xpcCA9IEFuaW1hdGlvbkNsaXA7XHJcbiJdfQ==