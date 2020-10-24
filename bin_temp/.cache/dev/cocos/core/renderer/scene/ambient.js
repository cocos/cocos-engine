(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../math/index.js", "../core/memory-pools.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../math/index.js"), require("../core/memory-pools.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.memoryPools, global.globalExports);
    global.ambient = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _memoryPools, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Ambient = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var Ambient = /*#__PURE__*/function () {
    _createClass(Ambient, [{
      key: "colorArray",
      get: function get() {
        return this._colorArray;
      }
    }, {
      key: "albedoArray",
      get: function get() {
        return this._albedoArray;
      }
      /**
       * @en Enable ambient
       * @zh 是否开启环境光
       */

    }, {
      key: "enabled",
      set: function set(val) {
        _memoryPools.AmbientPool.set(this._handle, _memoryPools.AmbientView.ENABLE, val ? 1 : 0);

        this.activate();
      },
      get: function get() {
        return _memoryPools.AmbientPool.get(this._handle, _memoryPools.AmbientView.ENABLE);
      }
      /**
       * @en Sky color
       * @zh 天空颜色
       */

    }, {
      key: "skyColor",
      get: function get() {
        return this._skyColor;
      },
      set: function set(color) {
        this._skyColor = color;

        _index.Color.toArray(this._colorArray, this._skyColor);

        _memoryPools.AmbientPool.setVec4(this._handle, _memoryPools.AmbientView.SKY_COLOR, this._skyColor);
      }
      /**
       * @en Sky illuminance
       * @zh 天空亮度
       */

    }, {
      key: "skyIllum",
      get: function get() {
        return _memoryPools.AmbientPool.get(this._handle, _memoryPools.AmbientView.ILLUM);
      },
      set: function set(illum) {
        _memoryPools.AmbientPool.set(this._handle, _memoryPools.AmbientView.ILLUM, illum);
      }
      /**
       * @en Ground color
       * @zh 地面颜色
       */

    }, {
      key: "groundAlbedo",
      get: function get() {
        return this._groundAlbedo;
      },
      set: function set(color) {
        this._groundAlbedo = color;

        _index.Vec3.toArray(this._albedoArray, this._groundAlbedo);

        _memoryPools.AmbientPool.setVec4(this._handle, _memoryPools.AmbientView.GROUND_ALBEDO, this._groundAlbedo);
      }
    }, {
      key: "handle",
      get: function get() {
        return this._handle;
      }
    }]);

    function Ambient() {
      _classCallCheck(this, Ambient);

      this._skyColor = new _index.Color(51, 128, 204, 1.0);
      this._groundAlbedo = new _index.Color(51, 51, 51, 255);
      this._albedoArray = Float32Array.from([0.2, 0.2, 0.2, 1.0]);
      this._colorArray = Float32Array.from([0.2, 0.5, 0.8, 1.0]);
      this._handle = _memoryPools.NULL_HANDLE;
      this._handle = _memoryPools.AmbientPool.alloc();
    }

    _createClass(Ambient, [{
      key: "activate",
      value: function activate() {
        _index.Color.toArray(this._colorArray, this._skyColor);

        _index.Vec3.toArray(this._albedoArray, this._groundAlbedo);

        _memoryPools.AmbientPool.setVec4(this._handle, _memoryPools.AmbientView.SKY_COLOR, this._skyColor);

        _memoryPools.AmbientPool.setVec4(this._handle, _memoryPools.AmbientView.GROUND_ALBEDO, this._groundAlbedo);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._handle) {
          _memoryPools.AmbientPool.free(this._handle);

          this._handle = _memoryPools.NULL_HANDLE;
        }
      }
    }]);

    return Ambient;
  }();

  _exports.Ambient = Ambient;
  Ambient.SUN_ILLUM = 65000.0;
  Ambient.SKY_ILLUM = 20000.0;
  _globalExports.legacyCC.Ambient = Ambient;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvYW1iaWVudC50cyJdLCJuYW1lcyI6WyJBbWJpZW50IiwiX2NvbG9yQXJyYXkiLCJfYWxiZWRvQXJyYXkiLCJ2YWwiLCJBbWJpZW50UG9vbCIsInNldCIsIl9oYW5kbGUiLCJBbWJpZW50VmlldyIsIkVOQUJMRSIsImFjdGl2YXRlIiwiZ2V0IiwiX3NreUNvbG9yIiwiY29sb3IiLCJDb2xvciIsInRvQXJyYXkiLCJzZXRWZWM0IiwiU0tZX0NPTE9SIiwiSUxMVU0iLCJpbGx1bSIsIl9ncm91bmRBbGJlZG8iLCJWZWMzIiwiR1JPVU5EX0FMQkVETyIsIkZsb2F0MzJBcnJheSIsImZyb20iLCJOVUxMX0hBTkRMRSIsImFsbG9jIiwiZnJlZSIsIlNVTl9JTExVTSIsIlNLWV9JTExVTSIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUlhQSxPOzs7MEJBSXVCO0FBQzVCLGVBQU8sS0FBS0MsV0FBWjtBQUNIOzs7MEJBRWdDO0FBQzdCLGVBQU8sS0FBS0MsWUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7d0JBSWFDLEcsRUFBYztBQUN2QkMsaUNBQVlDLEdBQVosQ0FBZ0IsS0FBS0MsT0FBckIsRUFBOEJDLHlCQUFZQyxNQUExQyxFQUFrREwsR0FBRyxHQUFHLENBQUgsR0FBTyxDQUE1RDs7QUFDQSxhQUFLTSxRQUFMO0FBQ0gsTzswQkFDdUI7QUFDcEIsZUFBT0wseUJBQVlNLEdBQVosQ0FBZ0IsS0FBS0osT0FBckIsRUFBOEJDLHlCQUFZQyxNQUExQyxDQUFQO0FBQ0g7QUFDRDs7Ozs7OzswQkFJdUI7QUFDbkIsZUFBTyxLQUFLRyxTQUFaO0FBQ0gsTzt3QkFFYUMsSyxFQUFjO0FBQ3hCLGFBQUtELFNBQUwsR0FBaUJDLEtBQWpCOztBQUNBQyxxQkFBTUMsT0FBTixDQUFjLEtBQUtiLFdBQW5CLEVBQWdDLEtBQUtVLFNBQXJDOztBQUNBUCxpQ0FBWVcsT0FBWixDQUFvQixLQUFLVCxPQUF6QixFQUFrQ0MseUJBQVlTLFNBQTlDLEVBQXlELEtBQUtMLFNBQTlEO0FBQ0g7QUFFRDs7Ozs7OzswQkFJd0I7QUFDcEIsZUFBT1AseUJBQVlNLEdBQVosQ0FBZ0IsS0FBS0osT0FBckIsRUFBOEJDLHlCQUFZVSxLQUExQyxDQUFQO0FBQ0gsTzt3QkFFYUMsSyxFQUFlO0FBQ3pCZCxpQ0FBWUMsR0FBWixDQUFnQixLQUFLQyxPQUFyQixFQUE4QkMseUJBQVlVLEtBQTFDLEVBQWlEQyxLQUFqRDtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSTJCO0FBQ3ZCLGVBQU8sS0FBS0MsYUFBWjtBQUNILE87d0JBRWlCUCxLLEVBQWM7QUFDNUIsYUFBS08sYUFBTCxHQUFxQlAsS0FBckI7O0FBQ0FRLG9CQUFLTixPQUFMLENBQWEsS0FBS1osWUFBbEIsRUFBZ0MsS0FBS2lCLGFBQXJDOztBQUNBZixpQ0FBWVcsT0FBWixDQUFvQixLQUFLVCxPQUF6QixFQUFrQ0MseUJBQVljLGFBQTlDLEVBQTZELEtBQUtGLGFBQWxFO0FBQ0g7OzswQkFPNkI7QUFDMUIsZUFBTyxLQUFLYixPQUFaO0FBQ0g7OztBQUVELHVCQUFlO0FBQUE7O0FBQUEsV0FWTEssU0FVSyxHQVZPLElBQUlFLFlBQUosQ0FBVSxFQUFWLEVBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QixHQUF4QixDQVVQO0FBQUEsV0FUTE0sYUFTSyxHQVRXLElBQUlOLFlBQUosQ0FBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQixHQUF0QixDQVNYO0FBQUEsV0FSTFgsWUFRSyxHQVJVb0IsWUFBWSxDQUFDQyxJQUFiLENBQWtCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLENBQWxCLENBUVY7QUFBQSxXQVBMdEIsV0FPSyxHQVBTcUIsWUFBWSxDQUFDQyxJQUFiLENBQWtCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLENBQWxCLENBT1Q7QUFBQSxXQU5MakIsT0FNSyxHQU5vQmtCLHdCQU1wQjtBQUNYLFdBQUtsQixPQUFMLEdBQWVGLHlCQUFZcUIsS0FBWixFQUFmO0FBQ0g7Ozs7aUNBRWtCO0FBQ2ZaLHFCQUFNQyxPQUFOLENBQWMsS0FBS2IsV0FBbkIsRUFBZ0MsS0FBS1UsU0FBckM7O0FBQ0FTLG9CQUFLTixPQUFMLENBQWEsS0FBS1osWUFBbEIsRUFBZ0MsS0FBS2lCLGFBQXJDOztBQUNBZixpQ0FBWVcsT0FBWixDQUFvQixLQUFLVCxPQUF6QixFQUFrQ0MseUJBQVlTLFNBQTlDLEVBQXlELEtBQUtMLFNBQTlEOztBQUNBUCxpQ0FBWVcsT0FBWixDQUFvQixLQUFLVCxPQUF6QixFQUFrQ0MseUJBQVljLGFBQTlDLEVBQTZELEtBQUtGLGFBQWxFO0FBQ0g7OztnQ0FFaUI7QUFDZCxZQUFJLEtBQUtiLE9BQVQsRUFBa0I7QUFDZEYsbUNBQVlzQixJQUFaLENBQWlCLEtBQUtwQixPQUF0Qjs7QUFDQSxlQUFLQSxPQUFMLEdBQWVrQix3QkFBZjtBQUNIO0FBQ0o7Ozs7Ozs7QUF4RlF4QixFQUFBQSxPLENBQ0syQixTLEdBQVksTztBQURqQjNCLEVBQUFBLE8sQ0FFSzRCLFMsR0FBWSxPO0FBeUY5QkMsMEJBQVM3QixPQUFULEdBQW1CQSxPQUFuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbG9yLCBWZWMzIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IEFtYmllbnRQb29sLCBOVUxMX0hBTkRMRSwgQW1iaWVudFZpZXcsIEFtYmllbnRIYW5kbGUgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFtYmllbnQge1xyXG4gICAgcHVibGljIHN0YXRpYyBTVU5fSUxMVU0gPSA2NTAwMC4wO1xyXG4gICAgcHVibGljIHN0YXRpYyBTS1lfSUxMVU0gPSAyMDAwMC4wO1xyXG5cclxuICAgIGdldCBjb2xvckFycmF5ICgpOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvckFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhbGJlZG9BcnJheSAoKTogRmxvYXQzMkFycmF5IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWxiZWRvQXJyYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRW5hYmxlIGFtYmllbnRcclxuICAgICAqIEB6aCDmmK/lkKblvIDlkK/njq/looPlhYlcclxuICAgICAqL1xyXG4gICAgc2V0IGVuYWJsZWQgKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIEFtYmllbnRQb29sLnNldCh0aGlzLl9oYW5kbGUsIEFtYmllbnRWaWV3LkVOQUJMRSwgdmFsID8gMSA6IDApO1xyXG4gICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcclxuICAgIH1cclxuICAgIGdldCBlbmFibGVkICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gQW1iaWVudFBvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgQW1iaWVudFZpZXcuRU5BQkxFKSBhcyB1bmtub3duIGFzIGJvb2xlYW47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTa3kgY29sb3JcclxuICAgICAqIEB6aCDlpKnnqbrpopzoibJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNreUNvbG9yICgpOiBDb2xvciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NreUNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBza3lDb2xvciAoY29sb3I6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5fc2t5Q29sb3IgPSBjb2xvcjtcclxuICAgICAgICBDb2xvci50b0FycmF5KHRoaXMuX2NvbG9yQXJyYXksIHRoaXMuX3NreUNvbG9yKTtcclxuICAgICAgICBBbWJpZW50UG9vbC5zZXRWZWM0KHRoaXMuX2hhbmRsZSwgQW1iaWVudFZpZXcuU0tZX0NPTE9SLCB0aGlzLl9za3lDb2xvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2t5IGlsbHVtaW5hbmNlXHJcbiAgICAgKiBAemgg5aSp56m65Lqu5bqmXHJcbiAgICAgKi9cclxuICAgIGdldCBza3lJbGx1bSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gQW1iaWVudFBvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgQW1iaWVudFZpZXcuSUxMVU0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBza3lJbGx1bSAoaWxsdW06IG51bWJlcikge1xyXG4gICAgICAgIEFtYmllbnRQb29sLnNldCh0aGlzLl9oYW5kbGUsIEFtYmllbnRWaWV3LklMTFVNLCBpbGx1bSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR3JvdW5kIGNvbG9yXHJcbiAgICAgKiBAemgg5Zyw6Z2i6aKc6ImyXHJcbiAgICAgKi9cclxuICAgIGdldCBncm91bmRBbGJlZG8gKCk6IENvbG9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3JvdW5kQWxiZWRvO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBncm91bmRBbGJlZG8gKGNvbG9yOiBDb2xvcikge1xyXG4gICAgICAgIHRoaXMuX2dyb3VuZEFsYmVkbyA9IGNvbG9yO1xyXG4gICAgICAgIFZlYzMudG9BcnJheSh0aGlzLl9hbGJlZG9BcnJheSwgdGhpcy5fZ3JvdW5kQWxiZWRvKTtcclxuICAgICAgICBBbWJpZW50UG9vbC5zZXRWZWM0KHRoaXMuX2hhbmRsZSwgQW1iaWVudFZpZXcuR1JPVU5EX0FMQkVETywgdGhpcy5fZ3JvdW5kQWxiZWRvKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBfc2t5Q29sb3IgPSBuZXcgQ29sb3IoNTEsIDEyOCwgMjA0LCAxLjApO1xyXG4gICAgcHJvdGVjdGVkIF9ncm91bmRBbGJlZG8gPSBuZXcgQ29sb3IoNTEsIDUxLCA1MSwgMjU1KTtcclxuICAgIHByb3RlY3RlZCBfYWxiZWRvQXJyYXkgPSBGbG9hdDMyQXJyYXkuZnJvbShbMC4yLCAwLjIsIDAuMiwgMS4wXSk7XHJcbiAgICBwcm90ZWN0ZWQgX2NvbG9yQXJyYXkgPSBGbG9hdDMyQXJyYXkuZnJvbShbMC4yLCAwLjUsIDAuOCwgMS4wXSk7XHJcbiAgICBwcm90ZWN0ZWQgX2hhbmRsZTogQW1iaWVudEhhbmRsZSA9IE5VTExfSEFORExFO1xyXG5cclxuICAgIGdldCBoYW5kbGUgKCkgOiBBbWJpZW50SGFuZGxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9oYW5kbGUgPSBBbWJpZW50UG9vbC5hbGxvYygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAoKSB7XHJcbiAgICAgICAgQ29sb3IudG9BcnJheSh0aGlzLl9jb2xvckFycmF5LCB0aGlzLl9za3lDb2xvcik7XHJcbiAgICAgICAgVmVjMy50b0FycmF5KHRoaXMuX2FsYmVkb0FycmF5LCB0aGlzLl9ncm91bmRBbGJlZG8pO1xyXG4gICAgICAgIEFtYmllbnRQb29sLnNldFZlYzQodGhpcy5faGFuZGxlLCBBbWJpZW50Vmlldy5TS1lfQ09MT1IsIHRoaXMuX3NreUNvbG9yKTtcclxuICAgICAgICBBbWJpZW50UG9vbC5zZXRWZWM0KHRoaXMuX2hhbmRsZSwgQW1iaWVudFZpZXcuR1JPVU5EX0FMQkVETywgdGhpcy5fZ3JvdW5kQWxiZWRvKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZSkge1xyXG4gICAgICAgICAgICBBbWJpZW50UG9vbC5mcmVlKHRoaXMuX2hhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuQW1iaWVudCA9IEFtYmllbnQ7XHJcbiJdfQ==