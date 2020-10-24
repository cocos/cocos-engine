(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/index.js", "./actions/action-interval.js", "../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/index.js"), require("./actions/action-interval.js"), require("../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.actionInterval, global.globalExports);
    global.tweenAction = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _actionInterval, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TweenAction = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /** adapter */
  function TweenEasinAdapter(easingName) {
    var initialChar = easingName.charAt(0);

    if (/[A-Z]/.test(initialChar)) {
      easingName = easingName.replace(initialChar, initialChar.toLowerCase());
      var arr = easingName.split('-');

      if (arr.length == 2) {
        var str0 = arr[0];

        if (str0 == 'linear') {
          easingName = 'linear';
        } else {
          var str1 = arr[1];

          switch (str0) {
            case 'quadratic':
              easingName = 'quad' + str1;
              break;

            case 'quartic':
              easingName = 'quart' + str1;
              break;

            case 'quintic':
              easingName = 'quint' + str1;
              break;

            case 'sinusoidal':
              easingName = 'sine' + str1;
              break;

            case 'exponential':
              easingName = 'expo' + str1;
              break;

            case 'circular':
              easingName = 'circ' + str1;
              break;

            default:
              easingName = str0 + str1;
              break;
          }
        }
      }
    }

    return easingName;
  }
  /** checker */


  function TweenOptionChecker(opts) {
    var header = ' [Tween:] ';
    var message = ' option is not support in v' + _globalExports.legacyCC.ENGINE_VERSION;

    if (opts['delay']) {
      (0, _index.warn)(header + 'delay' + message);
    }

    if (opts['repeat']) {
      (0, _index.warn)(header + 'repeat' + message);
    }

    if (opts['repeatDelay']) {
      (0, _index.warn)(header + 'repeatDelay' + message);
    }

    if (opts['interpolation']) {
      (0, _index.warn)(header + 'interpolation' + message);
    }

    if (opts['onStop']) {
      (0, _index.warn)(header + 'onStop' + message);
    }
  }

  var TweenAction = /*#__PURE__*/function (_ActionInterval) {
    _inherits(TweenAction, _ActionInterval);

    function TweenAction(duration, props, opts) {
      var _this;

      _classCallCheck(this, TweenAction);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TweenAction).call(this));
      _this._opts = void 0;
      _this._props = void 0;
      _this._originProps = void 0;

      if (opts == null) {
        opts = Object.create(null);
      } else {
        /** checker */
        TweenOptionChecker(opts);
        /** adapter */

        if (opts.easing && typeof opts.easing === 'string') {
          opts.easing = TweenEasinAdapter(opts.easing);
        } // global easing or progress used for this action


        if (!opts.progress) {
          opts.progress = _this.progress;
        }

        if (opts.easing && typeof opts.easing === 'string') {
          var easingName = opts.easing;
          opts.easing = _index.easing[easingName];

          if (!opts.easing) {
            (0, _index.warnID)(1031, easingName);
          }
        }
      }

      _this._opts = opts;
      _this._props = Object.create(null);

      for (var name in props) {
        var value = props[name]; // property may have custom easing or progress function

        var _easing = void 0,
            progress = void 0;

        if (value.value !== undefined && (value.easing || value.progress)) {
          if (typeof value.easing === 'string') {
            _easing = _easing[value.easing];
            !_easing && (0, _index.warnID)(1031, value.easing);
          } else {
            _easing = value.easing;
          }

          progress = value.progress;
          value = value.value;
        }

        var prop = Object.create(null);
        prop.value = value;
        prop.easing = _easing;
        prop.progress = progress;
        _this._props[name] = prop;
      }

      _this._originProps = props;

      _this.initWithDuration(duration);

      return _this;
    }

    _createClass(TweenAction, [{
      key: "clone",
      value: function clone() {
        var action = new TweenAction(this._duration, this._originProps, this._opts);

        this._cloneDecoration(action);

        return action;
      }
    }, {
      key: "startWithTarget",
      value: function startWithTarget(target) {
        _actionInterval.ActionInterval.prototype.startWithTarget.call(this, target);

        var relative = !!this._opts.relative;
        var props = this._props;

        for (var property in props) {
          var _t = target[property];

          if (_t === undefined) {
            continue;
          }

          var prop = props[property];
          var value = prop.value;

          if (typeof _t === "number") {
            prop.start = _t;
            prop.current = _t;
            prop.end = relative ? _t + value : value;
          } else if (_typeof(_t) === "object") {
            if (prop.start == null) {
              prop.start = {};
              prop.current = {};
              prop.end = {};
            }

            for (var k in value) {
              prop.start[k] = _t[k];
              prop.current[k] = _t[k];
              prop.end[k] = relative ? _t[k] + value[k] : value[k];
            }
          }
        }

        if (this._opts.onStart) {
          this._opts.onStart(this.target);
        }
      }
    }, {
      key: "update",
      value: function update(t) {
        var target = this.target;
        if (!target) return;
        var props = this._props;
        var opts = this._opts;
        var easingTime = t;
        if (opts.easing) easingTime = opts.easing(t);
        var progress = opts.progress;

        for (var name in props) {
          var prop = props[name];
          var time = prop.easing ? prop.easing(t) : easingTime;
          var interpolation = prop.progress ? prop.progress : progress;
          var start = prop.start;
          var end = prop.end;

          if (typeof start === 'number') {
            prop.current = interpolation(start, end, prop.current, time);
          } else if (_typeof(start) === 'object') {
            // const value = prop.value;
            for (var k in start) {
              // if (value[k].easing) {
              //     time = value[k].easing(t);
              // }
              // if (value[k].progress) {
              //     interpolation = value[k].easing(t);
              // }
              prop.current[k] = interpolation(start[k], end[k], prop.current[k], time);
            }
          }

          target[name] = prop.current;
        }

        if (opts.onUpdate) {
          opts.onUpdate(this.target, t);
        }

        if (t == 1 && opts.onComplete) {
          opts.onComplete(this.target);
        }
      }
    }, {
      key: "progress",
      value: function progress(start, end, current, t) {
        return current = start + (end - start) * t;
      }
    }]);

    return TweenAction;
  }(_actionInterval.ActionInterval);

  _exports.TweenAction = TweenAction;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL3R3ZWVuLWFjdGlvbi50cyJdLCJuYW1lcyI6WyJUd2VlbkVhc2luQWRhcHRlciIsImVhc2luZ05hbWUiLCJpbml0aWFsQ2hhciIsImNoYXJBdCIsInRlc3QiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJhcnIiLCJzcGxpdCIsImxlbmd0aCIsInN0cjAiLCJzdHIxIiwiVHdlZW5PcHRpb25DaGVja2VyIiwib3B0cyIsImhlYWRlciIsIm1lc3NhZ2UiLCJsZWdhY3lDQyIsIkVOR0lORV9WRVJTSU9OIiwiVHdlZW5BY3Rpb24iLCJkdXJhdGlvbiIsInByb3BzIiwiX29wdHMiLCJfcHJvcHMiLCJfb3JpZ2luUHJvcHMiLCJPYmplY3QiLCJjcmVhdGUiLCJlYXNpbmciLCJwcm9ncmVzcyIsIm5hbWUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInByb3AiLCJpbml0V2l0aER1cmF0aW9uIiwiYWN0aW9uIiwiX2R1cmF0aW9uIiwiX2Nsb25lRGVjb3JhdGlvbiIsInRhcmdldCIsIkFjdGlvbkludGVydmFsIiwicHJvdG90eXBlIiwic3RhcnRXaXRoVGFyZ2V0IiwiY2FsbCIsInJlbGF0aXZlIiwicHJvcGVydHkiLCJfdCIsInN0YXJ0IiwiY3VycmVudCIsImVuZCIsImsiLCJvblN0YXJ0IiwidCIsImVhc2luZ1RpbWUiLCJ0aW1lIiwiaW50ZXJwb2xhdGlvbiIsIm9uVXBkYXRlIiwib25Db21wbGV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTQTtBQUNBLFdBQVNBLGlCQUFULENBQTRCQyxVQUE1QixFQUFnRDtBQUM1QyxRQUFJQyxXQUFXLEdBQUdELFVBQVUsQ0FBQ0UsTUFBWCxDQUFrQixDQUFsQixDQUFsQjs7QUFDQSxRQUFJLFFBQVFDLElBQVIsQ0FBYUYsV0FBYixDQUFKLEVBQStCO0FBQzNCRCxNQUFBQSxVQUFVLEdBQUdBLFVBQVUs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Q0FBRCxDQUFkLEVBQW1CaEIsSUFBSSxDQUFDYyxPQUFMLENBQWFFLENBQWIsQ0FBbkIsRUFBb0NJLElBQXBDLENBQS9CO0FBQ0g7QUFDSjs7QUFFRGYsVUFBQUEsTUFBTSxDQUFDUixJQUFELENBQU4sR0FBZUcsSUFBSSxDQUFDYyxPQUFwQjtBQUNIOztBQUNELFlBQUloQyxJQUFJLENBQUN3QyxRQUFULEVBQW1CO0FBQUV4QyxVQUFBQSxJQUFJLENBQUN3QyxRQUFMLENBQWMsS0FBS2pCLE1BQW5CLEVBQTJCYSxDQUEzQjtBQUFnQzs7QUFDckQsWUFBSUEsQ0FBQyxJQUFJLENBQUwsSUFBVXBDLElBQUksQ0FBQ3lDLFVBQW5CLEVBQStCO0FBQUV6QyxVQUFBQSxJQUFJLENBQUN5QyxVQUFMLENBQWdCLEtBQUtsQixNQUFyQjtBQUErQjtBQUNuRTs7OytCQUVTUSxLLEVBQVlFLEcsRUFBVUQsTyxFQUFjSSxDLEVBQVc7QUFDckQsZUFBT0osT0FBTyxHQUFHRCxLQUFLLEdBQUcsQ0FBQ0UsR0FBRyxHQUFHRixLQUFQLElBQWdCSyxDQUF6QztBQUNIOzs7O0lBMUk0QlosOEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IHdhcm5JRCwgd2FybiwgZWFzaW5nIH0gZnJvbSAnLi4vY29yZSc7XHJcbmltcG9ydCB7IEFjdGlvbkludGVydmFsIH0gZnJvbSAnLi9hY3Rpb25zL2FjdGlvbi1pbnRlcnZhbCc7XHJcbmltcG9ydCB7IElUd2Vlbk9wdGlvbiB9IGZyb20gJy4vZXhwb3J0LWFwaSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKiogYWRhcHRlciAqL1xyXG5mdW5jdGlvbiBUd2VlbkVhc2luQWRhcHRlciAoZWFzaW5nTmFtZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgaW5pdGlhbENoYXIgPSBlYXNpbmdOYW1lLmNoYXJBdCgwKTtcclxuICAgIGlmICgvW0EtWl0vLnRlc3QoaW5pdGlhbENoYXIpKSB7XHJcbiAgICAgICAgZWFzaW5nTmFtZSA9IGVhc2luZ05hbWUucmVwbGFjZShpbml0aWFsQ2hhciwgaW5pdGlhbENoYXIudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgY29uc3QgYXJyID0gZWFzaW5nTmFtZS5zcGxpdCgnLScpO1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09IDIpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RyMCA9IGFyclswXTtcclxuICAgICAgICAgICAgaWYgKHN0cjAgPT0gJ2xpbmVhcicpIHtcclxuICAgICAgICAgICAgICAgIGVhc2luZ05hbWUgPSAnbGluZWFyJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0cjEgPSBhcnJbMV07XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0cjApIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdxdWFkcmF0aWMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmdOYW1lID0gJ3F1YWQnICsgc3RyMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncXVhcnRpYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZ05hbWUgPSAncXVhcnQnICsgc3RyMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncXVpbnRpYyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZ05hbWUgPSAncXVpbnQnICsgc3RyMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2ludXNvaWRhbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZ05hbWUgPSAnc2luZScgKyBzdHIxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdleHBvbmVudGlhbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZ05hbWUgPSAnZXhwbycgKyBzdHIxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdjaXJjdWxhcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZ05hbWUgPSAnY2lyYycgKyBzdHIxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmdOYW1lID0gc3RyMCArIHN0cjE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVhc2luZ05hbWU7XHJcbn1cclxuXHJcbi8qKiBjaGVja2VyICovXHJcbmZ1bmN0aW9uIFR3ZWVuT3B0aW9uQ2hlY2tlciAob3B0czogSVR3ZWVuT3B0aW9uKSB7XHJcbiAgICBjb25zdCBoZWFkZXIgPSAnIFtUd2VlbjpdICc7XHJcbiAgICBjb25zdCBtZXNzYWdlID0gJyBvcHRpb24gaXMgbm90IHN1cHBvcnQgaW4gdicgKyBsZWdhY3lDQy5FTkdJTkVfVkVSU0lPTjtcclxuICAgIGlmIChvcHRzWydkZWxheSddKSB7XHJcbiAgICAgICAgd2FybihoZWFkZXIgKyAnZGVsYXknICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0c1sncmVwZWF0J10pIHtcclxuICAgICAgICB3YXJuKGhlYWRlciArICdyZXBlYXQnICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0c1sncmVwZWF0RGVsYXknXSkge1xyXG4gICAgICAgIHdhcm4oaGVhZGVyICsgJ3JlcGVhdERlbGF5JyArIG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdHNbJ2ludGVycG9sYXRpb24nXSkge1xyXG4gICAgICAgIHdhcm4oaGVhZGVyICsgJ2ludGVycG9sYXRpb24nICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0c1snb25TdG9wJ10pIHtcclxuICAgICAgICB3YXJuKGhlYWRlciArICdvblN0b3AnICsgbWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUd2VlbkFjdGlvbiBleHRlbmRzIEFjdGlvbkludGVydmFsIHtcclxuICAgIHByaXZhdGUgX29wdHM6IGFueTtcclxuICAgIHByaXZhdGUgX3Byb3BzOiBhbnk7XHJcbiAgICBwcml2YXRlIF9vcmlnaW5Qcm9wczogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkdXJhdGlvbjogbnVtYmVyLCBwcm9wczogYW55LCBvcHRzPzogSVR3ZWVuT3B0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAob3B0cyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9wdHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qKiBjaGVja2VyICovXHJcbiAgICAgICAgICAgIFR3ZWVuT3B0aW9uQ2hlY2tlcihvcHRzKTtcclxuXHJcbiAgICAgICAgICAgIC8qKiBhZGFwdGVyICovXHJcbiAgICAgICAgICAgIGlmIChvcHRzLmVhc2luZyAmJiB0eXBlb2Ygb3B0cy5lYXNpbmcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRzLmVhc2luZyA9IFR3ZWVuRWFzaW5BZGFwdGVyKG9wdHMuZWFzaW5nKSBhcyBhbnk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGdsb2JhbCBlYXNpbmcgb3IgcHJvZ3Jlc3MgdXNlZCBmb3IgdGhpcyBhY3Rpb25cclxuICAgICAgICAgICAgaWYgKCFvcHRzLnByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRzLnByb2dyZXNzID0gdGhpcy5wcm9ncmVzcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob3B0cy5lYXNpbmcgJiYgdHlwZW9mIG9wdHMuZWFzaW5nID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVhc2luZ05hbWUgPSBvcHRzLmVhc2luZyBhcyBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICBvcHRzLmVhc2luZyA9IGVhc2luZ1tlYXNpbmdOYW1lXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdHMuZWFzaW5nKSB7IHdhcm5JRCgxMDMxLCBlYXNpbmdOYW1lKTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XHJcbiAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBwcm9wcykge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBwcm9wc1tuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIC8vIHByb3BlcnR5IG1heSBoYXZlIGN1c3RvbSBlYXNpbmcgb3IgcHJvZ3Jlc3MgZnVuY3Rpb25cclxuICAgICAgICAgICAgbGV0IGVhc2luZywgcHJvZ3Jlc3M7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS52YWx1ZSAhPT0gdW5kZWZpbmVkICYmICh2YWx1ZS5lYXNpbmcgfHwgdmFsdWUucHJvZ3Jlc3MpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlLmVhc2luZyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBlYXNpbmdbdmFsdWUuZWFzaW5nXTtcclxuICAgICAgICAgICAgICAgICAgICAhZWFzaW5nICYmIHdhcm5JRCgxMDMxLCB2YWx1ZS5lYXNpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gdmFsdWUuZWFzaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3MgPSB2YWx1ZS5wcm9ncmVzcztcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBwcm9wID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgICAgICAgICAgcHJvcC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBwcm9wLmVhc2luZyA9IGVhc2luZztcclxuICAgICAgICAgICAgcHJvcC5wcm9ncmVzcyA9IHByb2dyZXNzO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wc1tuYW1lXSA9IHByb3A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9vcmlnaW5Qcm9wcyA9IHByb3BzO1xyXG4gICAgICAgIHRoaXMuaW5pdFdpdGhEdXJhdGlvbihkdXJhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvbmUgKCkge1xyXG4gICAgICAgIHZhciBhY3Rpb24gPSBuZXcgVHdlZW5BY3Rpb24odGhpcy5fZHVyYXRpb24sIHRoaXMuX29yaWdpblByb3BzLCB0aGlzLl9vcHRzKTtcclxuICAgICAgICB0aGlzLl9jbG9uZURlY29yYXRpb24oYWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0V2l0aFRhcmdldCAodGFyZ2V0OiB7fSkge1xyXG4gICAgICAgIEFjdGlvbkludGVydmFsLnByb3RvdHlwZS5zdGFydFdpdGhUYXJnZXQuY2FsbCh0aGlzLCB0YXJnZXQpO1xyXG5cclxuICAgICAgICBjb25zdCByZWxhdGl2ZSA9ICEhdGhpcy5fb3B0cy5yZWxhdGl2ZTtcclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMuX3Byb3BzO1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHByb3BzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IF90OiBhbnkgPSB0YXJnZXRbcHJvcGVydHldO1xyXG4gICAgICAgICAgICBpZiAoX3QgPT09IHVuZGVmaW5lZCkgeyBjb250aW51ZTsgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJvcDogYW55ID0gcHJvcHNbcHJvcGVydHldO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHByb3AudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgX3QgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgIHByb3Auc3RhcnQgPSBfdDtcclxuICAgICAgICAgICAgICAgIHByb3AuY3VycmVudCA9IF90O1xyXG4gICAgICAgICAgICAgICAgcHJvcC5lbmQgPSByZWxhdGl2ZSA/IF90ICsgdmFsdWUgOiB2YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgX3QgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wLnN0YXJ0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLnN0YXJ0ID0ge307IHByb3AuY3VycmVudCA9IHt9OyBwcm9wLmVuZCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLnN0YXJ0W2tdID0gX3Rba107XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5jdXJyZW50W2tdID0gX3Rba107XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5lbmRba10gPSByZWxhdGl2ZSA/IF90W2tdICsgdmFsdWVba10gOiB2YWx1ZVtrXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fb3B0cy5vblN0YXJ0KSB7IHRoaXMuX29wdHMub25TdGFydCh0aGlzLnRhcmdldCk7IH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUgKHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMudGFyZ2V0O1xyXG4gICAgICAgIGlmICghdGFyZ2V0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5fcHJvcHM7XHJcbiAgICAgICAgY29uc3Qgb3B0cyA9IHRoaXMuX29wdHM7XHJcblxyXG4gICAgICAgIGxldCBlYXNpbmdUaW1lID0gdDtcclxuICAgICAgICBpZiAob3B0cy5lYXNpbmcpIGVhc2luZ1RpbWUgPSBvcHRzLmVhc2luZyh0KTtcclxuXHJcbiAgICAgICAgbGV0IHByb2dyZXNzID0gb3B0cy5wcm9ncmVzcztcclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gcHJvcHMpIHtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSBwcm9wc1tuYW1lXTtcclxuICAgICAgICAgICAgbGV0IHRpbWUgPSBwcm9wLmVhc2luZyA/IHByb3AuZWFzaW5nKHQpIDogZWFzaW5nVGltZTtcclxuICAgICAgICAgICAgbGV0IGludGVycG9sYXRpb24gPSBwcm9wLnByb2dyZXNzID8gcHJvcC5wcm9ncmVzcyA6IHByb2dyZXNzO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBwcm9wLnN0YXJ0O1xyXG4gICAgICAgICAgICBjb25zdCBlbmQgPSBwcm9wLmVuZDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgICAgIHByb3AuY3VycmVudCA9IGludGVycG9sYXRpb24oc3RhcnQsIGVuZCwgcHJvcC5jdXJyZW50LCB0aW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdvYmplY3QnKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY29uc3QgdmFsdWUgPSBwcm9wLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrIGluIHN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHZhbHVlW2tdLmVhc2luZykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICB0aW1lID0gdmFsdWVba10uZWFzaW5nKHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAodmFsdWVba10ucHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgaW50ZXJwb2xhdGlvbiA9IHZhbHVlW2tdLmVhc2luZyh0KTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5jdXJyZW50W2tdID0gaW50ZXJwb2xhdGlvbihzdGFydFtrXSwgZW5kW2tdLCBwcm9wLmN1cnJlbnRba10sIHRpbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBwcm9wLmN1cnJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvcHRzLm9uVXBkYXRlKSB7IG9wdHMub25VcGRhdGUodGhpcy50YXJnZXQsIHQpOyB9XHJcbiAgICAgICAgaWYgKHQgPT0gMSAmJiBvcHRzLm9uQ29tcGxldGUpIHsgb3B0cy5vbkNvbXBsZXRlKHRoaXMudGFyZ2V0KTsgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb2dyZXNzIChzdGFydDogYW55LCBlbmQ6IGFueSwgY3VycmVudDogYW55LCB0OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudCA9IHN0YXJ0ICsgKGVuZCAtIHN0YXJ0KSAqIHQ7XHJcbiAgICB9XHJcbn0iXX0=