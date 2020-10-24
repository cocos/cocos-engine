(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/utils.js", "../utils/array.js", "./playable.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/utils.js"), require("../utils/array.js"), require("./playable.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.array, global.playable, global.globalExports);
    global.crossFade = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _array, _playable, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CrossFade = void 0;

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

  var CrossFade = /*#__PURE__*/function (_Playable) {
    _inherits(CrossFade, _Playable);

    function CrossFade() {
      var _this;

      _classCallCheck(this, CrossFade);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(CrossFade).call(this));
      _this._managedStates = [];
      _this._fadings = [];
      return _this;
    }

    _createClass(CrossFade, [{
      key: "update",
      value: function update(deltaTime) {
        if (this.isMotionless) {
          return;
        } // Set all state's weight to 0.


        for (var iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
          var state = this._managedStates[iManagedState].state;

          if (state) {
            state.weight = 0;
          }
        } // Allocate weights.


        var absoluteWeight = 1.0;
        var deadFadingBegin = this._fadings.length;

        for (var iFading = 0; iFading < this._fadings.length; ++iFading) {
          var fading = this._fadings[iFading];
          fading.easeTime += deltaTime; // We should properly handle the case of
          // `fading.easeTime === 0 && fading.easeDuration === 0`, which yields `NaN`.

          var relativeWeight = fading.easeDuration === 0 ? 1 : (0, _utils.clamp01)(fading.easeTime / fading.easeDuration);
          var weight = relativeWeight * absoluteWeight;
          absoluteWeight = absoluteWeight * (1.0 - relativeWeight);

          if (fading.target.state) {
            fading.target.state.weight += weight;
          }

          if (fading.easeTime >= fading.easeDuration) {
            deadFadingBegin = iFading + 1;
            fading.easeTime = fading.easeDuration;
            break;
          }
        } // Kill fadings having no lifetime.


        if (deadFadingBegin !== this._fadings.length) {
          for (var iDeadFading = deadFadingBegin; iDeadFading < this._fadings.length; ++iDeadFading) {
            var deadFading = this._fadings[iDeadFading];
            --deadFading.target.reference;

            if (deadFading.target.reference <= 0) {
              if (deadFading.target.state) {
                deadFading.target.state.stop();
              }

              (0, _array.remove)(this._managedStates, deadFading.target);
            }
          }

          this._fadings.splice(deadFadingBegin);
        }

        for (var _iManagedState = 0; _iManagedState < this._managedStates.length; ++_iManagedState) {
          var _state = this._managedStates[_iManagedState].state;

          if (_state && _state.isMotionless) {
            _state.sample();
          }
        }
      }
      /**
       * 在指定时间内将从当前动画状态切换到指定的动画状态。
       * @param state 指定的动画状态。
       * @param duration 切换时间。
       */

    }, {
      key: "crossFade",
      value: function crossFade(state, duration) {
        var _target$state;

        if (this._managedStates.length === 0) {
          // If we are cross fade from a "initial" pose,
          // we do not use the duration.
          // It's meaning-less and may get a bad visual effect.
          duration = 0;
        }

        if (duration === 0) {
          this.clear();
        }

        var target = this._managedStates.find(function (weightedState) {
          return weightedState.state === state;
        });

        if (!target) {
          target = {
            state: state,
            reference: 0
          };

          if (state) {
            state.play();
          }

          this._managedStates.push(target);
        } else if ((_target$state = target.state) === null || _target$state === void 0 ? void 0 : _target$state.isMotionless) {
          target.state.play();
        }

        ++target.reference;

        this._fadings.unshift({
          easeDuration: duration,
          easeTime: 0,
          target: target
        });
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
          var state = this._managedStates[iManagedState].state;

          if (state) {
            state.stop();
          }
        }

        this._managedStates.length = 0;
        this._fadings.length = 0;
      }
    }, {
      key: "onPlay",
      value: function onPlay() {
        _get(_getPrototypeOf(CrossFade.prototype), "onPlay", this).call(this);

        _globalExports.legacyCC.director.getAnimationManager().addCrossFade(this);
      }
      /**
       * 停止我们淡入淡出的所有动画状态并停止淡入淡出。
       */

    }, {
      key: "onPause",
      value: function onPause() {
        _get(_getPrototypeOf(CrossFade.prototype), "onPause", this).call(this);

        _globalExports.legacyCC.director.getAnimationManager().removeCrossFade(this);

        for (var iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
          var state = this._managedStates[iManagedState].state;

          if (state) {
            state.pause();
          }
        }
      }
      /**
       * 恢复我们淡入淡出的所有动画状态并继续淡入淡出。
       */

    }, {
      key: "onResume",
      value: function onResume() {
        _get(_getPrototypeOf(CrossFade.prototype), "onResume", this).call(this);

        _globalExports.legacyCC.director.getAnimationManager().addCrossFade(this);

        for (var iManagedState = 0; iManagedState < this._managedStates.length; ++iManagedState) {
          var state = this._managedStates[iManagedState].state;

          if (state) {
            state.resume();
          }
        }
      }
      /**
       * 停止所有淡入淡出的动画状态。
       */

    }, {
      key: "onStop",
      value: function onStop() {
        _get(_getPrototypeOf(CrossFade.prototype), "onStop", this).call(this);

        _globalExports.legacyCC.director.getAnimationManager().removeCrossFade(this);

        this.clear();
      }
    }]);

    return CrossFade;
  }(_playable.Playable);

  _exports.CrossFade = CrossFade;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2Nyb3NzLWZhZGUudHMiXSwibmFtZXMiOlsiQ3Jvc3NGYWRlIiwiX21hbmFnZWRTdGF0ZXMiLCJfZmFkaW5ncyIsImRlbHRhVGltZSIsImlzTW90aW9ubGVzcyIsImlNYW5hZ2VkU3RhdGUiLCJsZW5ndGgiLCJzdGF0ZSIsIndlaWdodCIsImFic29sdXRlV2VpZ2h0IiwiZGVhZEZhZGluZ0JlZ2luIiwiaUZhZGluZyIsImZhZGluZyIsImVhc2VUaW1lIiwicmVsYXRpdmVXZWlnaHQiLCJlYXNlRHVyYXRpb24iLCJ0YXJnZXQiLCJpRGVhZEZhZGluZyIsImRlYWRGYWRpbmciLCJyZWZlcmVuY2UiLCJzdG9wIiwic3BsaWNlIiwic2FtcGxlIiwiZHVyYXRpb24iLCJjbGVhciIsImZpbmQiLCJ3ZWlnaHRlZFN0YXRlIiwicGxheSIsInB1c2giLCJ1bnNoaWZ0IiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsImdldEFuaW1hdGlvbk1hbmFnZXIiLCJhZGRDcm9zc0ZhZGUiLCJyZW1vdmVDcm9zc0ZhZGUiLCJwYXVzZSIsInJlc3VtZSIsIlBsYXlhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFxQmFBLFM7OztBQUlULHlCQUFlO0FBQUE7O0FBQUE7O0FBQ1g7QUFEVyxZQUhFQyxjQUdGLEdBSG9DLEVBR3BDO0FBQUEsWUFGRUMsUUFFRixHQUZ3QixFQUV4QjtBQUFBO0FBRWQ7Ozs7NkJBRWNDLFMsRUFBbUI7QUFDOUIsWUFBSSxLQUFLQyxZQUFULEVBQXVCO0FBQ25CO0FBQ0gsU0FINkIsQ0FLOUI7OztBQUNBLGFBQUssSUFBSUMsYUFBYSxHQUFHLENBQXpCLEVBQTRCQSxhQUFhLEdBQUcsS0FBS0osY0FBTCxDQUFvQkssTUFBaEUsRUFBd0UsRUFBRUQsYUFBMUUsRUFBeUY7QUFDckYsY0FBTUUsS0FBSyxHQUFHLEtBQUtOLGNBQUwsQ0FBb0JJLGFBQXBCLEVBQW1DRSxLQUFqRDs7QUFDQSxjQUFJQSxLQUFKLEVBQVc7QUFDUEEsWUFBQUEsS0FBSyxDQUFDQyxNQUFOLEdBQWUsQ0FBZjtBQUNIO0FBQ0osU0FYNkIsQ0FhOUI7OztBQUNBLFlBQUlDLGNBQWMsR0FBRyxHQUFyQjtBQUNBLFlBQUlDLGVBQWUsR0FBRyxLQUFLUixRQUFMLENBQWNJLE1BQXBDOztBQUNBLGFBQUssSUFBSUssT0FBTyxHQUFHLENBQW5CLEVBQXNCQSxPQUFPLEdBQUcsS0FBS1QsUUFBTCxDQUFjSSxNQUE5QyxFQUFzRCxFQUFFSyxPQUF4RCxFQUFpRTtBQUM3RCxjQUFNQyxNQUFNLEdBQUcsS0FBS1YsUUFBTCxDQUFjUyxPQUFkLENBQWY7QUFDQUMsVUFBQUEsTUFBTSxDQUFDQyxRQUFQLElBQW1CVixTQUFuQixDQUY2RCxDQUc3RDtBQUNBOztBQUNBLGNBQU1XLGNBQWMsR0FBR0YsTUFBTSxDQUFDRyxZQUFQLEtBQXdCLENBQXhCLEdBQTRCLENBQTVCLEdBQWdDLG9CQUFRSCxNQUFNLENBQUNDLFFBQVAsR0FBa0JELE1BQU0sQ0FBQ0csWUFBakMsQ0FBdkQ7QUFDQSxjQUFNUCxNQUFNLEdBQUdNLGNBQWMsR0FBR0wsY0FBaEM7QUFDQUEsVUFBQUEsY0FBYyxHQUFHQSxjQUFjLElBQUksTUFBTUssY0FBVixDQUEvQjs7QUFDQSxjQUFJRixNQUFNLENBQUNJLE1BQVAsQ0FBY1QsS0FBbEIsRUFBeUI7QUFDckJLLFlBQUFBLE1BQU0sQ0FBQ0ksTUFBUCxDQUFjVCxLQUFkLENBQW9CQyxNQUFwQixJQUE4QkEsTUFBOUI7QUFDSDs7QUFDRCxjQUFJSSxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0csWUFBOUIsRUFBNEM7QUFDeENMLFlBQUFBLGVBQWUsR0FBR0MsT0FBTyxHQUFHLENBQTVCO0FBQ0FDLFlBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxHQUFrQkQsTUFBTSxDQUFDRyxZQUF6QjtBQUNBO0FBQ0g7QUFDSixTQWhDNkIsQ0FrQzlCOzs7QUFDQSxZQUFJTCxlQUFlLEtBQUssS0FBS1IsUUFBTCxDQUFjSSxNQUF0QyxFQUE4QztBQUMxQyxlQUFLLElBQUlXLFdBQVcsR0FBR1AsZUFBdkIsRUFBd0NPLFdBQVcsR0FBRyxLQUFLZixRQUFMLENBQWNJLE1BQXBFLEVBQTRFLEVBQUVXLFdBQTlFLEVBQTJGO0FBQ3ZGLGdCQUFNQyxVQUFVLEdBQUcsS0FBS2hCLFFBQUwsQ0FBY2UsV0FBZCxDQUFuQjtBQUNBLGNBQUVDLFVBQVUsQ0FBQ0YsTUFBWCxDQUFrQkcsU0FBcEI7O0FBQ0EsZ0JBQUlELFVBQVUsQ0FBQ0YsTUFBWCxDQUFrQkcsU0FBbEIsSUFBK0IsQ0FBbkMsRUFBc0M7QUFDbEMsa0JBQUlELFVBQVUsQ0FBQ0YsTUFBWCxDQUFrQlQsS0FBdEIsRUFBNkI7QUFDekJXLGdCQUFBQSxVQUFVLENBQUNGLE1BQVgsQ0FBa0JULEtBQWxCLENBQXdCYSxJQUF4QjtBQUNIOztBQUNELGlDQUFPLEtBQUtuQixjQUFaLEVBQTRCaUIsVUFBVSxDQUFDRixNQUF2QztBQUNIO0FBQ0o7O0FBQ0QsZUFBS2QsUUFBTCxDQUFjbUIsTUFBZCxDQUFxQlgsZUFBckI7QUFDSDs7QUFFRCxhQUFLLElBQUlMLGNBQWEsR0FBRyxDQUF6QixFQUE0QkEsY0FBYSxHQUFHLEtBQUtKLGNBQUwsQ0FBb0JLLE1BQWhFLEVBQXdFLEVBQUVELGNBQTFFLEVBQXlGO0FBQ3JGLGNBQU1FLE1BQUssR0FBRyxLQUFLTixjQUFMLENBQW9CSSxjQUFwQixFQUFtQ0UsS0FBakQ7O0FBQ0EsY0FBSUEsTUFBSyxJQUFJQSxNQUFLLENBQUNILFlBQW5CLEVBQWlDO0FBQzdCRyxZQUFBQSxNQUFLLENBQUNlLE1BQU47QUFDSDtBQUNKO0FBQ0o7QUFFRDs7Ozs7Ozs7Z0NBS2tCZixLLEVBQThCZ0IsUSxFQUFrQjtBQUFBOztBQUM5RCxZQUFJLEtBQUt0QixjQUFMLENBQW9CSyxNQUFwQixLQUErQixDQUFuQyxFQUFzQztBQUNsQztBQUNBO0FBQ0E7QUFDQWlCLFVBQUFBLFFBQVEsR0FBRyxDQUFYO0FBQ0g7O0FBRUQsWUFBSUEsUUFBUSxLQUFLLENBQWpCLEVBQW9CO0FBQ2hCLGVBQUtDLEtBQUw7QUFDSDs7QUFDRCxZQUFJUixNQUFNLEdBQUcsS0FBS2YsY0FBTCxDQUFvQndCLElBQXBCLENBQXlCLFVBQUNDLGFBQUQ7QUFBQSxpQkFBbUJBLGFBQWEsQ0FBQ25CLEtBQWQsS0FBd0JBLEtBQTNDO0FBQUEsU0FBekIsQ0FBYjs7QUFDQSxZQUFJLENBQUNTLE1BQUwsRUFBYTtBQUNUQSxVQUFBQSxNQUFNLEdBQUc7QUFBRVQsWUFBQUEsS0FBSyxFQUFMQSxLQUFGO0FBQVNZLFlBQUFBLFNBQVMsRUFBRTtBQUFwQixXQUFUOztBQUNBLGNBQUlaLEtBQUosRUFBVztBQUNQQSxZQUFBQSxLQUFLLENBQUNvQixJQUFOO0FBQ0g7O0FBQ0QsZUFBSzFCLGNBQUwsQ0FBb0IyQixJQUFwQixDQUF5QlosTUFBekI7QUFDSCxTQU5ELE1BTU8scUJBQUlBLE1BQU0sQ0FBQ1QsS0FBWCxrREFBSSxjQUFjSCxZQUFsQixFQUFnQztBQUNuQ1ksVUFBQUEsTUFBTSxDQUFDVCxLQUFQLENBQWFvQixJQUFiO0FBQ0g7O0FBQ0QsVUFBRVgsTUFBTSxDQUFDRyxTQUFUOztBQUNBLGFBQUtqQixRQUFMLENBQWMyQixPQUFkLENBQXNCO0FBQ2xCZCxVQUFBQSxZQUFZLEVBQUVRLFFBREk7QUFFbEJWLFVBQUFBLFFBQVEsRUFBRSxDQUZRO0FBR2xCRyxVQUFBQSxNQUFNLEVBQU5BO0FBSGtCLFNBQXRCO0FBS0g7Ozs4QkFFZTtBQUNaLGFBQUssSUFBSVgsYUFBYSxHQUFHLENBQXpCLEVBQTRCQSxhQUFhLEdBQUcsS0FBS0osY0FBTCxDQUFvQkssTUFBaEUsRUFBd0UsRUFBRUQsYUFBMUUsRUFBeUY7QUFDckYsY0FBTUUsS0FBSyxHQUFHLEtBQUtOLGNBQUwsQ0FBb0JJLGFBQXBCLEVBQW1DRSxLQUFqRDs7QUFDQSxjQUFJQSxLQUFKLEVBQVc7QUFDUEEsWUFBQUEsS0FBSyxDQUFDYSxJQUFOO0FBQ0g7QUFDSjs7QUFDRCxhQUFLbkIsY0FBTCxDQUFvQkssTUFBcEIsR0FBNkIsQ0FBN0I7QUFDQSxhQUFLSixRQUFMLENBQWNJLE1BQWQsR0FBdUIsQ0FBdkI7QUFDSDs7OytCQUVtQjtBQUNoQjs7QUFDQXdCLGdDQUFTQyxRQUFULENBQWtCQyxtQkFBbEIsR0FBd0NDLFlBQXhDLENBQXFELElBQXJEO0FBQ0g7QUFFRDs7Ozs7O2dDQUdxQjtBQUNqQjs7QUFDQUgsZ0NBQVNDLFFBQVQsQ0FBa0JDLG1CQUFsQixHQUF3Q0UsZUFBeEMsQ0FBd0QsSUFBeEQ7O0FBQ0EsYUFBSyxJQUFJN0IsYUFBYSxHQUFHLENBQXpCLEVBQTRCQSxhQUFhLEdBQUcsS0FBS0osY0FBTCxDQUFvQkssTUFBaEUsRUFBd0UsRUFBRUQsYUFBMUUsRUFBeUY7QUFDckYsY0FBTUUsS0FBSyxHQUFHLEtBQUtOLGNBQUwsQ0FBb0JJLGFBQXBCLEVBQW1DRSxLQUFqRDs7QUFDQSxjQUFJQSxLQUFKLEVBQVc7QUFDUEEsWUFBQUEsS0FBSyxDQUFDNEIsS0FBTjtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7aUNBR3NCO0FBQ2xCOztBQUNBTCxnQ0FBU0MsUUFBVCxDQUFrQkMsbUJBQWxCLEdBQXdDQyxZQUF4QyxDQUFxRCxJQUFyRDs7QUFDQSxhQUFLLElBQUk1QixhQUFhLEdBQUcsQ0FBekIsRUFBNEJBLGFBQWEsR0FBRyxLQUFLSixjQUFMLENBQW9CSyxNQUFoRSxFQUF3RSxFQUFFRCxhQUExRSxFQUF5RjtBQUNyRixjQUFNRSxLQUFLLEdBQUcsS0FBS04sY0FBTCxDQUFvQkksYUFBcEIsRUFBbUNFLEtBQWpEOztBQUNBLGNBQUlBLEtBQUosRUFBVztBQUNQQSxZQUFBQSxLQUFLLENBQUM2QixNQUFOO0FBQ0g7QUFDSjtBQUNKO0FBRUQ7Ozs7OzsrQkFHb0I7QUFDaEI7O0FBQ0FOLGdDQUFTQyxRQUFULENBQWtCQyxtQkFBbEIsR0FBd0NFLGVBQXhDLENBQXdELElBQXhEOztBQUNBLGFBQUtWLEtBQUw7QUFDSDs7OztJQXRKMEJhLGtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBhbmltYXRpb25cclxuICovXHJcblxyXG5pbXBvcnQgeyBjbGFtcDAxIH0gZnJvbSAnLi4vbWF0aC91dGlscyc7XHJcbmltcG9ydCB7IHJlbW92ZSB9IGZyb20gJy4uL3V0aWxzL2FycmF5JztcclxuaW1wb3J0IHsgQW5pbWF0aW9uU3RhdGUgfSBmcm9tICcuL2FuaW1hdGlvbi1zdGF0ZSc7XHJcbmltcG9ydCB7IFBsYXlhYmxlIH0gZnJvbSAnLi9wbGF5YWJsZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuaW50ZXJmYWNlIElNYW5hZ2VkU3RhdGUge1xyXG4gICAgc3RhdGU6IEFuaW1hdGlvblN0YXRlIHwgbnVsbDtcclxuICAgIHJlZmVyZW5jZTogbnVtYmVyO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSUZhZGluZyB7XHJcbiAgICB0YXJnZXQ6IElNYW5hZ2VkU3RhdGU7XHJcbiAgICBlYXNlVGltZTogbnVtYmVyO1xyXG4gICAgZWFzZUR1cmF0aW9uOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcm9zc0ZhZGUgZXh0ZW5kcyBQbGF5YWJsZSB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9tYW5hZ2VkU3RhdGVzOiBJTWFuYWdlZFN0YXRlW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2ZhZGluZ3M6IElGYWRpbmdbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKGRlbHRhVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNNb3Rpb25sZXNzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBhbGwgc3RhdGUncyB3ZWlnaHQgdG8gMC5cclxuICAgICAgICBmb3IgKGxldCBpTWFuYWdlZFN0YXRlID0gMDsgaU1hbmFnZWRTdGF0ZSA8IHRoaXMuX21hbmFnZWRTdGF0ZXMubGVuZ3RoOyArK2lNYW5hZ2VkU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9tYW5hZ2VkU3RhdGVzW2lNYW5hZ2VkU3RhdGVdLnN0YXRlO1xyXG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLndlaWdodCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFsbG9jYXRlIHdlaWdodHMuXHJcbiAgICAgICAgbGV0IGFic29sdXRlV2VpZ2h0ID0gMS4wO1xyXG4gICAgICAgIGxldCBkZWFkRmFkaW5nQmVnaW4gPSB0aGlzLl9mYWRpbmdzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpRmFkaW5nID0gMDsgaUZhZGluZyA8IHRoaXMuX2ZhZGluZ3MubGVuZ3RoOyArK2lGYWRpbmcpIHtcclxuICAgICAgICAgICAgY29uc3QgZmFkaW5nID0gdGhpcy5fZmFkaW5nc1tpRmFkaW5nXTtcclxuICAgICAgICAgICAgZmFkaW5nLmVhc2VUaW1lICs9IGRlbHRhVGltZTtcclxuICAgICAgICAgICAgLy8gV2Ugc2hvdWxkIHByb3Blcmx5IGhhbmRsZSB0aGUgY2FzZSBvZlxyXG4gICAgICAgICAgICAvLyBgZmFkaW5nLmVhc2VUaW1lID09PSAwICYmIGZhZGluZy5lYXNlRHVyYXRpb24gPT09IDBgLCB3aGljaCB5aWVsZHMgYE5hTmAuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlV2VpZ2h0ID0gZmFkaW5nLmVhc2VEdXJhdGlvbiA9PT0gMCA/IDEgOiBjbGFtcDAxKGZhZGluZy5lYXNlVGltZSAvIGZhZGluZy5lYXNlRHVyYXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCB3ZWlnaHQgPSByZWxhdGl2ZVdlaWdodCAqIGFic29sdXRlV2VpZ2h0O1xyXG4gICAgICAgICAgICBhYnNvbHV0ZVdlaWdodCA9IGFic29sdXRlV2VpZ2h0ICogKDEuMCAtIHJlbGF0aXZlV2VpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKGZhZGluZy50YXJnZXQuc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGZhZGluZy50YXJnZXQuc3RhdGUud2VpZ2h0ICs9IHdlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmFkaW5nLmVhc2VUaW1lID49IGZhZGluZy5lYXNlRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGRlYWRGYWRpbmdCZWdpbiA9IGlGYWRpbmcgKyAxO1xyXG4gICAgICAgICAgICAgICAgZmFkaW5nLmVhc2VUaW1lID0gZmFkaW5nLmVhc2VEdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBLaWxsIGZhZGluZ3MgaGF2aW5nIG5vIGxpZmV0aW1lLlxyXG4gICAgICAgIGlmIChkZWFkRmFkaW5nQmVnaW4gIT09IHRoaXMuX2ZhZGluZ3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlEZWFkRmFkaW5nID0gZGVhZEZhZGluZ0JlZ2luOyBpRGVhZEZhZGluZyA8IHRoaXMuX2ZhZGluZ3MubGVuZ3RoOyArK2lEZWFkRmFkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWFkRmFkaW5nID0gdGhpcy5fZmFkaW5nc1tpRGVhZEZhZGluZ107XHJcbiAgICAgICAgICAgICAgICAtLWRlYWRGYWRpbmcudGFyZ2V0LnJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgIGlmIChkZWFkRmFkaW5nLnRhcmdldC5yZWZlcmVuY2UgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWFkRmFkaW5nLnRhcmdldC5zdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFkRmFkaW5nLnRhcmdldC5zdGF0ZS5zdG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZSh0aGlzLl9tYW5hZ2VkU3RhdGVzLCBkZWFkRmFkaW5nLnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZmFkaW5ncy5zcGxpY2UoZGVhZEZhZGluZ0JlZ2luKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGlNYW5hZ2VkU3RhdGUgPSAwOyBpTWFuYWdlZFN0YXRlIDwgdGhpcy5fbWFuYWdlZFN0YXRlcy5sZW5ndGg7ICsraU1hbmFnZWRTdGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX21hbmFnZWRTdGF0ZXNbaU1hbmFnZWRTdGF0ZV0uc3RhdGU7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5pc01vdGlvbmxlc3MpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnNhbXBsZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Zyo5oyH5a6a5pe26Ze05YaF5bCG5LuO5b2T5YmN5Yqo55S754q25oCB5YiH5o2i5Yiw5oyH5a6a55qE5Yqo55S754q25oCB44CCXHJcbiAgICAgKiBAcGFyYW0gc3RhdGUg5oyH5a6a55qE5Yqo55S754q25oCB44CCXHJcbiAgICAgKiBAcGFyYW0gZHVyYXRpb24g5YiH5o2i5pe26Ze044CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjcm9zc0ZhZGUgKHN0YXRlOiBBbmltYXRpb25TdGF0ZSB8IG51bGwsIGR1cmF0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fbWFuYWdlZFN0YXRlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlIGNyb3NzIGZhZGUgZnJvbSBhIFwiaW5pdGlhbFwiIHBvc2UsXHJcbiAgICAgICAgICAgIC8vIHdlIGRvIG5vdCB1c2UgdGhlIGR1cmF0aW9uLlxyXG4gICAgICAgICAgICAvLyBJdCdzIG1lYW5pbmctbGVzcyBhbmQgbWF5IGdldCBhIGJhZCB2aXN1YWwgZWZmZWN0LlxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZHVyYXRpb24gPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gdGhpcy5fbWFuYWdlZFN0YXRlcy5maW5kKCh3ZWlnaHRlZFN0YXRlKSA9PiB3ZWlnaHRlZFN0YXRlLnN0YXRlID09PSBzdGF0ZSk7XHJcbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0ID0geyBzdGF0ZSwgcmVmZXJlbmNlOiAwIH07XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUucGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX21hbmFnZWRTdGF0ZXMucHVzaCh0YXJnZXQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnN0YXRlPy5pc01vdGlvbmxlc3MpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LnN0YXRlLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKyt0YXJnZXQucmVmZXJlbmNlO1xyXG4gICAgICAgIHRoaXMuX2ZhZGluZ3MudW5zaGlmdCh7XHJcbiAgICAgICAgICAgIGVhc2VEdXJhdGlvbjogZHVyYXRpb24sXHJcbiAgICAgICAgICAgIGVhc2VUaW1lOiAwLFxyXG4gICAgICAgICAgICB0YXJnZXQsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpTWFuYWdlZFN0YXRlID0gMDsgaU1hbmFnZWRTdGF0ZSA8IHRoaXMuX21hbmFnZWRTdGF0ZXMubGVuZ3RoOyArK2lNYW5hZ2VkU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9tYW5hZ2VkU3RhdGVzW2lNYW5hZ2VkU3RhdGVdLnN0YXRlO1xyXG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnN0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9tYW5hZ2VkU3RhdGVzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fZmFkaW5ncy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvblBsYXkgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uUGxheSgpO1xyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5hZGRDcm9zc0ZhZGUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlgZzmraLmiJHku6zmt6HlhaXmt6Hlh7rnmoTmiYDmnInliqjnlLvnirbmgIHlubblgZzmraLmt6HlhaXmt6Hlh7rjgIJcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIG9uUGF1c2UgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uUGF1c2UoKTtcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5nZXRBbmltYXRpb25NYW5hZ2VyKCkucmVtb3ZlQ3Jvc3NGYWRlKHRoaXMpO1xyXG4gICAgICAgIGZvciAobGV0IGlNYW5hZ2VkU3RhdGUgPSAwOyBpTWFuYWdlZFN0YXRlIDwgdGhpcy5fbWFuYWdlZFN0YXRlcy5sZW5ndGg7ICsraU1hbmFnZWRTdGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX21hbmFnZWRTdGF0ZXNbaU1hbmFnZWRTdGF0ZV0uc3RhdGU7XHJcbiAgICAgICAgICAgIGlmIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUucGF1c2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaBouWkjeaIkeS7rOa3oeWFpea3oeWHuueahOaJgOacieWKqOeUu+eKtuaAgeW5tue7p+e7rea3oeWFpea3oeWHuuOAglxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgb25SZXN1bWUgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uUmVzdW1lKCk7XHJcbiAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuZ2V0QW5pbWF0aW9uTWFuYWdlcigpLmFkZENyb3NzRmFkZSh0aGlzKTtcclxuICAgICAgICBmb3IgKGxldCBpTWFuYWdlZFN0YXRlID0gMDsgaU1hbmFnZWRTdGF0ZSA8IHRoaXMuX21hbmFnZWRTdGF0ZXMubGVuZ3RoOyArK2lNYW5hZ2VkU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9tYW5hZ2VkU3RhdGVzW2lNYW5hZ2VkU3RhdGVdLnN0YXRlO1xyXG4gICAgICAgICAgICBpZiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnJlc3VtZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YGc5q2i5omA5pyJ5reh5YWl5reh5Ye655qE5Yqo55S754q25oCB44CCXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBvblN0b3AgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uU3RvcCgpO1xyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLmdldEFuaW1hdGlvbk1hbmFnZXIoKS5yZW1vdmVDcm9zc0ZhZGUodGhpcyk7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==