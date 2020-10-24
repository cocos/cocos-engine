(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug);
    global.playable = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Playable = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Playable = /*#__PURE__*/function () {
    function Playable() {
      _classCallCheck(this, Playable);

      this._isPlaying = false;
      this._isPaused = false;
      this._stepOnce = false;
    }

    _createClass(Playable, [{
      key: "play",

      /**
       * @en Play this animation.
       * @zh 播放动画。
       */
      value: function play() {
        if (this._isPlaying) {
          if (this._isPaused) {
            this._isPaused = false;
            this.onResume();
          } else {
            this.onError((0, _debug.getError)(3912));
          }
        } else {
          this._isPlaying = true;
          this.onPlay();
        }
      }
      /**
       * @en Stop this animation.
       * @zh 停止动画播放。
       */

    }, {
      key: "stop",
      value: function stop() {
        if (this._isPlaying) {
          this._isPlaying = false;
          this.onStop(); // need reset pause flag after onStop

          this._isPaused = false;
        }
      }
      /**
       * @en Pause this animation.
       * @zh 暂停动画。
       */

    }, {
      key: "pause",
      value: function pause() {
        if (this._isPlaying && !this._isPaused) {
          this._isPaused = true;
          this.onPause();
        }
      }
      /**
       * @en Resume this animation.
       * @zh 重新播放动画。
       */

    }, {
      key: "resume",
      value: function resume() {
        if (this._isPlaying && this._isPaused) {
          this._isPaused = false;
          this.onResume();
        }
      }
      /**
       * @en Perform a single frame step.
       * @zh 执行一帧动画。
       */

    }, {
      key: "step",
      value: function step() {
        this.pause();
        this._stepOnce = true;

        if (!this._isPlaying) {
          this.play();
        }
      }
    }, {
      key: "update",
      value: function update(deltaTime) {}
    }, {
      key: "onPlay",
      value: function onPlay() {}
    }, {
      key: "onPause",
      value: function onPause() {}
    }, {
      key: "onResume",
      value: function onResume() {}
    }, {
      key: "onStop",
      value: function onStop() {}
    }, {
      key: "onError",
      value: function onError(message) {}
    }, {
      key: "isPlaying",

      /**
       * @en Whether if this `Playable` is in playing.
       * @zh 该 `Playable` 是否正在播放状态。
       * @default false
       */
      get: function get() {
        return this._isPlaying;
      }
      /**
       * @en Whether if this `Playable` has been paused. This can be true even if in edit mode(isPlaying == false).
       * @zh 该 `Playable` 是否已被暂停。
       * @default false
       */

    }, {
      key: "isPaused",
      get: function get() {
        return this._isPaused;
      }
      /**
       * @en Whether if this `Playable` has been paused or stopped.
       * @zh 该 `Playable` 是否已被暂停或停止。
       */

    }, {
      key: "isMotionless",
      get: function get() {
        return !this.isPlaying || this.isPaused;
      }
    }]);

    return Playable;
  }();

  _exports.Playable = Playable;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3BsYXlhYmxlLnRzIl0sIm5hbWVzIjpbIlBsYXlhYmxlIiwiX2lzUGxheWluZyIsIl9pc1BhdXNlZCIsIl9zdGVwT25jZSIsIm9uUmVzdW1lIiwib25FcnJvciIsIm9uUGxheSIsIm9uU3RvcCIsIm9uUGF1c2UiLCJwYXVzZSIsInBsYXkiLCJkZWx0YVRpbWUiLCJtZXNzYWdlIiwiaXNQbGF5aW5nIiwiaXNQYXVzZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BTWFBLFE7Ozs7V0E0QkRDLFUsR0FBYSxLO1dBQ2JDLFMsR0FBWSxLO1dBQ1pDLFMsR0FBWSxLOzs7Ozs7QUFFcEI7Ozs7NkJBSWU7QUFDWCxZQUFJLEtBQUtGLFVBQVQsRUFBcUI7QUFDakIsY0FBSSxLQUFLQyxTQUFULEVBQW9CO0FBQ2hCLGlCQUFLQSxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsaUJBQUtFLFFBQUw7QUFDSCxXQUhELE1BR087QUFDSCxpQkFBS0MsT0FBTCxDQUFhLHFCQUFTLElBQVQsQ0FBYjtBQUNIO0FBQ0osU0FQRCxNQU9PO0FBQ0gsZUFBS0osVUFBTCxHQUFrQixJQUFsQjtBQUNBLGVBQUtLLE1BQUw7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7NkJBSWU7QUFDWCxZQUFJLEtBQUtMLFVBQVQsRUFBcUI7QUFDakIsZUFBS0EsVUFBTCxHQUFrQixLQUFsQjtBQUNBLGVBQUtNLE1BQUwsR0FGaUIsQ0FJakI7O0FBQ0EsZUFBS0wsU0FBTCxHQUFpQixLQUFqQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs4QkFJZ0I7QUFDWixZQUFJLEtBQUtELFVBQUwsSUFBbUIsQ0FBQyxLQUFLQyxTQUE3QixFQUF3QztBQUNwQyxlQUFLQSxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsZUFBS00sT0FBTDtBQUNIO0FBQ0o7QUFFRDs7Ozs7OzsrQkFJaUI7QUFDYixZQUFJLEtBQUtQLFVBQUwsSUFBbUIsS0FBS0MsU0FBNUIsRUFBdUM7QUFDbkMsZUFBS0EsU0FBTCxHQUFpQixLQUFqQjtBQUNBLGVBQUtFLFFBQUw7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7NkJBSWU7QUFDWCxhQUFLSyxLQUFMO0FBQ0EsYUFBS04sU0FBTCxHQUFpQixJQUFqQjs7QUFDQSxZQUFJLENBQUMsS0FBS0YsVUFBVixFQUFzQjtBQUNsQixlQUFLUyxJQUFMO0FBQ0g7QUFDSjs7OzZCQUVjQyxTLEVBQW1CLENBRWpDOzs7K0JBRW1CLENBRW5COzs7Z0NBRW9CLENBRXBCOzs7aUNBRXFCLENBRXJCOzs7K0JBRW1CLENBRW5COzs7OEJBRWtCQyxPLEVBQWlCLENBRW5DOzs7O0FBdEhEOzs7OzswQkFLaUI7QUFDYixlQUFPLEtBQUtYLFVBQVo7QUFDSDtBQUVEOzs7Ozs7OzswQkFLZ0I7QUFDWixlQUFPLEtBQUtDLFNBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlvQjtBQUNoQixlQUFPLENBQUMsS0FBS1csU0FBTixJQUFtQixLQUFLQyxRQUEvQjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBhbmltYXRpb25cclxuICovXHJcblxyXG5pbXBvcnQgeyBnZXRFcnJvciB9IGZyb20gJy4uL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQbGF5YWJsZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2hldGhlciBpZiB0aGlzIGBQbGF5YWJsZWAgaXMgaW4gcGxheWluZy5cclxuICAgICAqIEB6aCDor6UgYFBsYXlhYmxlYCDmmK/lkKbmraPlnKjmkq3mlL7nirbmgIHjgIJcclxuICAgICAqIEBkZWZhdWx0IGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGdldCBpc1BsYXlpbmcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1BsYXlpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2hldGhlciBpZiB0aGlzIGBQbGF5YWJsZWAgaGFzIGJlZW4gcGF1c2VkLiBUaGlzIGNhbiBiZSB0cnVlIGV2ZW4gaWYgaW4gZWRpdCBtb2RlKGlzUGxheWluZyA9PSBmYWxzZSkuXHJcbiAgICAgKiBAemgg6K+lIGBQbGF5YWJsZWAg5piv5ZCm5bey6KKr5pqC5YGc44CCXHJcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxyXG4gICAgICovXHJcbiAgICBnZXQgaXNQYXVzZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1BhdXNlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXaGV0aGVyIGlmIHRoaXMgYFBsYXlhYmxlYCBoYXMgYmVlbiBwYXVzZWQgb3Igc3RvcHBlZC5cclxuICAgICAqIEB6aCDor6UgYFBsYXlhYmxlYCDmmK/lkKblt7LooqvmmoLlgZzmiJblgZzmraLjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGlzTW90aW9ubGVzcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzUGxheWluZyB8fCB0aGlzLmlzUGF1c2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzUGxheWluZyA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfaXNQYXVzZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3N0ZXBPbmNlID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxheSB0aGlzIGFuaW1hdGlvbi5cclxuICAgICAqIEB6aCDmkq3mlL7liqjnlLvjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBsYXkgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc1BsYXlpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzUGF1c2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc3VtZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKGdldEVycm9yKDM5MTIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUGxheWluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMub25QbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFN0b3AgdGhpcyBhbmltYXRpb24uXHJcbiAgICAgKiBAemgg5YGc5q2i5Yqo55S75pKt5pS+44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdG9wICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNQbGF5aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm9uU3RvcCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gbmVlZCByZXNldCBwYXVzZSBmbGFnIGFmdGVyIG9uU3RvcFxyXG4gICAgICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQYXVzZSB0aGlzIGFuaW1hdGlvbi5cclxuICAgICAqIEB6aCDmmoLlgZzliqjnlLvjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBhdXNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNQbGF5aW5nICYmICF0aGlzLl9pc1BhdXNlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMub25QYXVzZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXN1bWUgdGhpcyBhbmltYXRpb24uXHJcbiAgICAgKiBAemgg6YeN5paw5pKt5pS+5Yqo55S744CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXN1bWUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pc1BsYXlpbmcgJiYgdGhpcy5faXNQYXVzZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vblJlc3VtZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQZXJmb3JtIGEgc2luZ2xlIGZyYW1lIHN0ZXAuXHJcbiAgICAgKiBAemgg5omn6KGM5LiA5bin5Yqo55S744CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGVwICgpIHtcclxuICAgICAgICB0aGlzLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy5fc3RlcE9uY2UgPSB0cnVlO1xyXG4gICAgICAgIGlmICghdGhpcy5faXNQbGF5aW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlIChkZWx0YVRpbWU6IG51bWJlcikge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25QbGF5ICgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uUGF1c2UgKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25SZXN1bWUgKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25TdG9wICgpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uRXJyb3IgKG1lc3NhZ2U6IHN0cmluZykge1xyXG5cclxuICAgIH1cclxufVxyXG4iXX0=