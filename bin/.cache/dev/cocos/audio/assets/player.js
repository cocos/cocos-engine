(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.player = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AudioPlayer = _exports.PlayingState = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @category component/audio
   */
  var PlayingState = {
    INITIALIZING: 0,
    PLAYING: 1,
    STOPPED: 2
  };
  _exports.PlayingState = PlayingState;

  var AudioPlayer = /*#__PURE__*/function () {
    function AudioPlayer(info) {
      var _this = this;

      _classCallCheck(this, AudioPlayer);

      this._state = PlayingState.STOPPED;
      this._duration = 0;
      this._eventTarget = void 0;
      this._onHide = void 0;
      this._onShow = void 0;
      this._interrupted = false;
      this._blocking = false;
      this._duration = info.duration;
      this._eventTarget = info.eventTarget;

      this._onHide = function () {
        _this._blocking = true;

        if (_this._state !== PlayingState.PLAYING) {
          return;
        }

        _this.pause();

        _this._interrupted = true;
      };

      this._onShow = function () {
        _this._blocking = false;

        if (!_this._interrupted) {
          return;
        }

        _this.play();

        _this._interrupted = false;
      };
      /* handle hide & show */


      _globalExports.legacyCC.game.on(_globalExports.legacyCC.Game.EVENT_HIDE, this._onHide);

      _globalExports.legacyCC.game.on(_globalExports.legacyCC.Game.EVENT_SHOW, this._onShow);
    }

    _createClass(AudioPlayer, [{
      key: "getState",
      value: function getState() {
        return this._state;
      }
    }, {
      key: "getDuration",
      value: function getDuration() {
        return this._duration;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _globalExports.legacyCC.game.off(_globalExports.legacyCC.Game.EVENT_HIDE, this._onHide);

        _globalExports.legacyCC.game.off(_globalExports.legacyCC.Game.EVENT_SHOW, this._onShow);
      }
    }]);

    return AudioPlayer;
  }();

  _exports.AudioPlayer = AudioPlayer;
  _globalExports.legacyCC.internal.AudioPlayer = AudioPlayer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2F1ZGlvL2Fzc2V0cy9wbGF5ZXIudHMiXSwibmFtZXMiOlsiUGxheWluZ1N0YXRlIiwiSU5JVElBTElaSU5HIiwiUExBWUlORyIsIlNUT1BQRUQiLCJBdWRpb1BsYXllciIsImluZm8iLCJfc3RhdGUiLCJfZHVyYXRpb24iLCJfZXZlbnRUYXJnZXQiLCJfb25IaWRlIiwiX29uU2hvdyIsIl9pbnRlcnJ1cHRlZCIsIl9ibG9ja2luZyIsImR1cmF0aW9uIiwiZXZlbnRUYXJnZXQiLCJwYXVzZSIsInBsYXkiLCJsZWdhY3lDQyIsImdhbWUiLCJvbiIsIkdhbWUiLCJFVkVOVF9ISURFIiwiRVZFTlRfU0hPVyIsIm9mZiIsImludGVybmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQTs7O0FBSU8sTUFBTUEsWUFBWSxHQUFHO0FBQ3hCQyxJQUFBQSxZQUFZLEVBQUUsQ0FEVTtBQUV4QkMsSUFBQUEsT0FBTyxFQUFFLENBRmU7QUFHeEJDLElBQUFBLE9BQU8sRUFBRTtBQUhlLEdBQXJCOzs7TUFZZUMsVztBQVVsQix5QkFBYUMsSUFBYixFQUErQjtBQUFBOztBQUFBOztBQUFBLFdBVHJCQyxNQVNxQixHQVRaTixZQUFZLENBQUNHLE9BU0Q7QUFBQSxXQVJyQkksU0FRcUIsR0FSVCxDQVFTO0FBQUEsV0FQckJDLFlBT3FCO0FBQUEsV0FMckJDLE9BS3FCO0FBQUEsV0FKckJDLE9BSXFCO0FBQUEsV0FIckJDLFlBR3FCLEdBSE4sS0FHTTtBQUFBLFdBRnJCQyxTQUVxQixHQUZULEtBRVM7QUFDM0IsV0FBS0wsU0FBTCxHQUFpQkYsSUFBSSxDQUFDUSxRQUF0QjtBQUNBLFdBQUtMLFlBQUwsR0FBb0JILElBQUksQ0FBQ1MsV0FBekI7O0FBQ0EsV0FBS0wsT0FBTCxHQUFlLFlBQU07QUFDakIsUUFBQSxLQUFJLENBQUNHLFNBQUwsR0FBaUIsSUFBakI7O0FBQ0EsWUFBSSxLQUFJLENBQUNOLE1BQUwsS0FBZ0JOLFlBQVksQ0FBQ0UsT0FBakMsRUFBMEM7QUFBRTtBQUFTOztBQUNyRCxRQUFBLEtBQUksQ0FBQ2EsS0FBTDs7QUFBYyxRQUFBLEtBQUksQ0FBQ0osWUFBTCxHQUFvQixJQUFwQjtBQUNqQixPQUpEOztBQUtBLFdBQUtELE9BQUwsR0FBZSxZQUFNO0FBQ2pCLFFBQUEsS0FBSSxDQUFDRSxTQUFMLEdBQWlCLEtBQWpCOztBQUNBLFlBQUksQ0FBQyxLQUFJLENBQUNELFlBQVYsRUFBd0I7QUFBRTtBQUFTOztBQUNuQyxRQUFBLEtBQUksQ0FBQ0ssSUFBTDs7QUFBYSxRQUFBLEtBQUksQ0FBQ0wsWUFBTCxHQUFvQixLQUFwQjtBQUNoQixPQUpEO0FBS0E7OztBQUNBTSw4QkFBU0MsSUFBVCxDQUFjQyxFQUFkLENBQWlCRix3QkFBU0csSUFBVCxDQUFjQyxVQUEvQixFQUEyQyxLQUFLWixPQUFoRDs7QUFDQVEsOEJBQVNDLElBQVQsQ0FBY0MsRUFBZCxDQUFpQkYsd0JBQVNHLElBQVQsQ0FBY0UsVUFBL0IsRUFBMkMsS0FBS1osT0FBaEQ7QUFDSDs7OztpQ0FZa0I7QUFBRSxlQUFPLEtBQUtKLE1BQVo7QUFBcUI7OztvQ0FDcEI7QUFBRSxlQUFPLEtBQUtDLFNBQVo7QUFBd0I7OztnQ0FDOUI7QUFDZFUsZ0NBQVNDLElBQVQsQ0FBY0ssR0FBZCxDQUFrQk4sd0JBQVNHLElBQVQsQ0FBY0MsVUFBaEMsRUFBNEMsS0FBS1osT0FBakQ7O0FBQ0FRLGdDQUFTQyxJQUFULENBQWNLLEdBQWQsQ0FBa0JOLHdCQUFTRyxJQUFULENBQWNFLFVBQWhDLEVBQTRDLEtBQUtaLE9BQWpEO0FBQ0g7Ozs7Ozs7QUFHTE8sMEJBQVNPLFFBQVQsQ0FBa0JwQixXQUFsQixHQUFnQ0EsV0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29tcG9uZW50L2F1ZGlvXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IFBsYXlpbmdTdGF0ZSA9IHtcclxuICAgIElOSVRJQUxJWklORzogMCxcclxuICAgIFBMQVlJTkc6IDEsXHJcbiAgICBTVE9QUEVEOiAyLFxyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXVkaW9JbmZvIHtcclxuICAgIGNsaXA6IGFueTtcclxuICAgIGR1cmF0aW9uOiBudW1iZXI7XHJcbiAgICBldmVudFRhcmdldDogYW55O1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQXVkaW9QbGF5ZXIge1xyXG4gICAgcHJvdGVjdGVkIF9zdGF0ZSA9IFBsYXlpbmdTdGF0ZS5TVE9QUEVEO1xyXG4gICAgcHJvdGVjdGVkIF9kdXJhdGlvbiA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2V2ZW50VGFyZ2V0OiBhbnk7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vbkhpZGU6IEZ1bmN0aW9uO1xyXG4gICAgcHJvdGVjdGVkIF9vblNob3c6IEZ1bmN0aW9uO1xyXG4gICAgcHJvdGVjdGVkIF9pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9ibG9ja2luZyA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChpbmZvOiBJQXVkaW9JbmZvKSB7XHJcbiAgICAgICAgdGhpcy5fZHVyYXRpb24gPSBpbmZvLmR1cmF0aW9uO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0ID0gaW5mby5ldmVudFRhcmdldDtcclxuICAgICAgICB0aGlzLl9vbkhpZGUgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jsb2NraW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlICE9PSBQbGF5aW5nU3RhdGUuUExBWUlORykgeyByZXR1cm47IH1cclxuICAgICAgICAgICAgdGhpcy5wYXVzZSgpOyB0aGlzLl9pbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9vblNob3cgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jsb2NraW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faW50ZXJydXB0ZWQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIHRoaXMucGxheSgpOyB0aGlzLl9pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyogaGFuZGxlIGhpZGUgJiBzaG93ICovXHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5vbihsZWdhY3lDQy5HYW1lLkVWRU5UX0hJREUsIHRoaXMuX29uSGlkZSk7XHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5vbihsZWdhY3lDQy5HYW1lLkVWRU5UX1NIT1csIHRoaXMuX29uU2hvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IHBsYXkgKCk6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcGF1c2UgKCk6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc3RvcCAoKTogdm9pZDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBwbGF5T25lU2hvdCAodm9sdW1lOiBudW1iZXIpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldEN1cnJlbnRUaW1lICh2YWw6IG51bWJlcik6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q3VycmVudFRpbWUgKCk6IG51bWJlcjtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRWb2x1bWUgKHZhbDogbnVtYmVyLCBpbW1lZGlhdGU6IGJvb2xlYW4pOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldFZvbHVtZSAoKTogbnVtYmVyO1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldExvb3AgKHZhbDogYm9vbGVhbik6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TG9vcCAoKTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBnZXRTdGF0ZSAoKSB7IHJldHVybiB0aGlzLl9zdGF0ZTsgfVxyXG4gICAgcHVibGljIGdldER1cmF0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2R1cmF0aW9uOyB9XHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5vZmYobGVnYWN5Q0MuR2FtZS5FVkVOVF9ISURFLCB0aGlzLl9vbkhpZGUpO1xyXG4gICAgICAgIGxlZ2FjeUNDLmdhbWUub2ZmKGxlZ2FjeUNDLkdhbWUuRVZFTlRfU0hPVywgdGhpcy5fb25TaG93KTtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuaW50ZXJuYWwuQXVkaW9QbGF5ZXIgPSBBdWRpb1BsYXllcjtcclxuIl19