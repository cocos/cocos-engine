(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../value-types/index.js", "../../math/index.js", "../../global-exports.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../value-types/index.js"), require("../../math/index.js"), require("../../global-exports.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.globalExports, global.memoryPools);
    global.fog = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _globalExports, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Fog = _exports.FogType = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @zh
   * 全局雾类型。
   * @en
   * The global fog type
   * @static
   * @enum FogInfo.FogType
   */
  var FogType = (0, _index.Enum)({
    /**
     * @zh
     * 线性雾。
     * @en
     * Linear fog
     * @readonly
     */
    LINEAR: 0,

    /**
     * @zh
     * 指数雾。
     * @en
     * Exponential fog
     * @readonly
     */
    EXP: 1,

    /**
     * @zh
     * 指数平方雾。
     * @en
     * Exponential square fog
     * @readonly
     */
    EXP_SQUARED: 2,

    /**
     * @zh
     * 层叠雾。
     * @en
     * Layered fog
     * @readonly
     */
    LAYERED: 3
  });
  _exports.FogType = FogType;

  var Fog = /*#__PURE__*/function () {
    _createClass(Fog, [{
      key: "enabled",

      /**
       * @zh 是否启用全局雾效
       * @en Enable global fog
       */
      set: function set(val) {
        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.ENABLE, val ? 1 : 0);

        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.TYPE, val ? this._type + 1 : 0);

        val ? this.activate() : this._updatePipeline();
      },
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.ENABLE);
      }
      /**
       * @zh 全局雾颜色
       * @en Global fog color
       */

    }, {
      key: "fogColor",
      set: function set(val) {
        this._fogColor.set(val);

        _index2.Color.toArray(this._colorArray, this._fogColor);

        _memoryPools.FogPool.setVec4(this._handle, _memoryPools.FogView.COLOR, this._fogColor);
      },
      get: function get() {
        return this._fogColor;
      }
      /**
       * @zh 全局雾类型
       * @en Global fog type
       */

    }, {
      key: "type",
      get: function get() {
        return this._type;
      },
      set: function set(val) {
        this._type = val;
        if (this.enabled) this._updatePipeline();

        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.TYPE, this.enabled ? this._type + 1 : 0);
      }
      /**
       * @zh 全局雾浓度
       * @en Global fog density
       */

    }, {
      key: "fogDensity",
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.DENSITY);
      },
      set: function set(val) {
        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.DENSITY, val);
      }
      /**
       * @zh 雾效起始位置，只适用于线性雾
       * @en Global fog start position, only for linear fog
       */

    }, {
      key: "fogStart",
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.START);
      },
      set: function set(val) {
        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.START, val);
      }
      /**
       * @zh 雾效结束位置，只适用于线性雾
       * @en Global fog end position, only for linear fog
       */

    }, {
      key: "fogEnd",
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.END);
      },
      set: function set(val) {
        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.END, val);
      }
      /**
       * @zh 雾效衰减
       * @en Global fog attenuation
       */

    }, {
      key: "fogAtten",
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.ATTEN);
      },
      set: function set(val) {
        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.ATTEN, val);
      }
      /**
       * @zh 雾效顶部范围，只适用于层级雾
       * @en Global fog top range, only for layered fog
       */

    }, {
      key: "fogTop",
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.TOP);
      },
      set: function set(val) {
        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.TOP, val);
      }
      /**
       * @zh 雾效范围，只适用于层级雾
       * @en Global fog range, only for layered fog
       */

    }, {
      key: "fogRange",
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.RANGE);
      },
      set: function set(val) {
        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.RANGE, val);
      }
      /**
       * @zh 当前雾化类型。
       * @en The current global fog type.
       * @returns {FogType}
       * Returns the current global fog type
       * - 0:Disable global Fog
       * - 1:Linear fog
       * - 2:Exponential fog
       * - 3:Exponential square fog
       * - 4:Layered fog
       */

    }, {
      key: "currType",
      get: function get() {
        return _memoryPools.FogPool.get(this._handle, _memoryPools.FogView.TYPE);
      }
    }, {
      key: "colorArray",
      get: function get() {
        return this._colorArray;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._handle;
      }
    }]);

    function Fog() {
      _classCallCheck(this, Fog);

      this._type = FogType.LINEAR;
      this._fogColor = new _index2.Color('#C8C8C8');
      this._colorArray = new Float32Array([0.2, 0.2, 0.2, 1.0]);
      this._handle = _memoryPools.NULL_HANDLE;
      this._handle = _memoryPools.FogPool.alloc();
    }

    _createClass(Fog, [{
      key: "activate",
      value: function activate() {
        _index2.Color.toArray(this._colorArray, this._fogColor);

        _memoryPools.FogPool.setVec4(this._handle, _memoryPools.FogView.COLOR, this._fogColor);

        _memoryPools.FogPool.set(this._handle, _memoryPools.FogView.TYPE, this.enabled ? this._type + 1 : 0);

        this._updatePipeline();
      }
    }, {
      key: "_updatePipeline",
      value: function _updatePipeline() {
        var root = _globalExports.legacyCC.director.root;
        var value = this.currType;
        var pipeline = root.pipeline;

        if (pipeline.macros.CC_USE_FOG === value) {
          return;
        }

        pipeline.macros.CC_USE_FOG = value;
        root.onGlobalPipelineStateChanged();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._handle) {
          _memoryPools.FogPool.free(this._handle);

          this._handle = _memoryPools.NULL_HANDLE;
        }
      }
    }]);

    return Fog;
  }();

  _exports.Fog = Fog;
  _globalExports.legacyCC.Fog = Fog;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvZm9nLnRzIl0sIm5hbWVzIjpbIkZvZ1R5cGUiLCJMSU5FQVIiLCJFWFAiLCJFWFBfU1FVQVJFRCIsIkxBWUVSRUQiLCJGb2ciLCJ2YWwiLCJGb2dQb29sIiwic2V0IiwiX2hhbmRsZSIsIkZvZ1ZpZXciLCJFTkFCTEUiLCJUWVBFIiwiX3R5cGUiLCJhY3RpdmF0ZSIsIl91cGRhdGVQaXBlbGluZSIsImdldCIsIl9mb2dDb2xvciIsIkNvbG9yIiwidG9BcnJheSIsIl9jb2xvckFycmF5Iiwic2V0VmVjNCIsIkNPTE9SIiwiZW5hYmxlZCIsIkRFTlNJVFkiLCJTVEFSVCIsIkVORCIsIkFUVEVOIiwiVE9QIiwiUkFOR0UiLCJGbG9hdDMyQXJyYXkiLCJOVUxMX0hBTkRMRSIsImFsbG9jIiwicm9vdCIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJ2YWx1ZSIsImN1cnJUeXBlIiwicGlwZWxpbmUiLCJtYWNyb3MiLCJDQ19VU0VfRk9HIiwib25HbG9iYWxQaXBlbGluZVN0YXRlQ2hhbmdlZCIsImZyZWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0E7Ozs7Ozs7O0FBUU8sTUFBTUEsT0FBTyxHQUFHLGlCQUFLO0FBQ3hCOzs7Ozs7O0FBT0FDLElBQUFBLE1BQU0sRUFBRSxDQVJnQjs7QUFTeEI7Ozs7Ozs7QUFPQUMsSUFBQUEsR0FBRyxFQUFFLENBaEJtQjs7QUFpQnhCOzs7Ozs7O0FBT0FDLElBQUFBLFdBQVcsRUFBRSxDQXhCVzs7QUF5QnhCOzs7Ozs7O0FBT0FDLElBQUFBLE9BQU8sRUFBRTtBQWhDZSxHQUFMLENBQWhCOzs7TUFtQ01DLEc7Ozs7QUFDVDs7Ozt3QkFJYUMsRyxFQUFjO0FBQ3ZCQyw2QkFBUUMsR0FBUixDQUFZLEtBQUtDLE9BQWpCLEVBQTBCQyxxQkFBUUMsTUFBbEMsRUFBMENMLEdBQUcsR0FBRyxDQUFILEdBQU8sQ0FBcEQ7O0FBQ0FDLDZCQUFRQyxHQUFSLENBQVksS0FBS0MsT0FBakIsRUFBMEJDLHFCQUFRRSxJQUFsQyxFQUF3Q04sR0FBRyxHQUFHLEtBQUtPLEtBQUwsR0FBYSxDQUFoQixHQUFvQixDQUEvRDs7QUFDQVAsUUFBQUEsR0FBRyxHQUFHLEtBQUtRLFFBQUwsRUFBSCxHQUFxQixLQUFLQyxlQUFMLEVBQXhCO0FBQ0gsTzswQkFFdUI7QUFDcEIsZUFBT1IscUJBQVFTLEdBQVIsQ0FBWSxLQUFLUCxPQUFqQixFQUEwQkMscUJBQVFDLE1BQWxDLENBQVA7QUFDSDtBQUVEOzs7Ozs7O3dCQUljTCxHLEVBQVk7QUFDdEIsYUFBS1csU0FBTCxDQUFlVCxHQUFmLENBQW1CRixHQUFuQjs7QUFDQVksc0JBQU1DLE9BQU4sQ0FBYyxLQUFLQyxXQUFuQixFQUFnQyxLQUFLSCxTQUFyQzs7QUFDQVYsNkJBQVFjLE9BQVIsQ0FBZ0IsS0FBS1osT0FBckIsRUFBOEJDLHFCQUFRWSxLQUF0QyxFQUE2QyxLQUFLTCxTQUFsRDtBQUNILE87MEJBRWU7QUFDWixlQUFPLEtBQUtBLFNBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlvQjtBQUNoQixlQUFPLEtBQUtKLEtBQVo7QUFDSCxPO3dCQUVTUCxHLEVBQWE7QUFDbkIsYUFBS08sS0FBTCxHQUFhUCxHQUFiO0FBQ0EsWUFBSSxLQUFLaUIsT0FBVCxFQUFrQixLQUFLUixlQUFMOztBQUNsQlIsNkJBQVFDLEdBQVIsQ0FBWSxLQUFLQyxPQUFqQixFQUEwQkMscUJBQVFFLElBQWxDLEVBQXdDLEtBQUtXLE9BQUwsR0FBZSxLQUFLVixLQUFMLEdBQWEsQ0FBNUIsR0FBZ0MsQ0FBeEU7QUFDSDtBQUVEOzs7Ozs7OzBCQUkwQjtBQUN0QixlQUFPTixxQkFBUVMsR0FBUixDQUFZLEtBQUtQLE9BQWpCLEVBQTBCQyxxQkFBUWMsT0FBbEMsQ0FBUDtBQUNILE87d0JBRWVsQixHLEVBQWE7QUFDekJDLDZCQUFRQyxHQUFSLENBQVksS0FBS0MsT0FBakIsRUFBMEJDLHFCQUFRYyxPQUFsQyxFQUEyQ2xCLEdBQTNDO0FBQ0g7QUFFRDs7Ozs7OzswQkFJd0I7QUFDcEIsZUFBT0MscUJBQVFTLEdBQVIsQ0FBWSxLQUFLUCxPQUFqQixFQUEwQkMscUJBQVFlLEtBQWxDLENBQVA7QUFDSCxPO3dCQUVhbkIsRyxFQUFhO0FBQ3ZCQyw2QkFBUUMsR0FBUixDQUFZLEtBQUtDLE9BQWpCLEVBQTBCQyxxQkFBUWUsS0FBbEMsRUFBeUNuQixHQUF6QztBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXNCO0FBQ2xCLGVBQU9DLHFCQUFRUyxHQUFSLENBQVksS0FBS1AsT0FBakIsRUFBMEJDLHFCQUFRZ0IsR0FBbEMsQ0FBUDtBQUNILE87d0JBRVdwQixHLEVBQWE7QUFDckJDLDZCQUFRQyxHQUFSLENBQVksS0FBS0MsT0FBakIsRUFBMEJDLHFCQUFRZ0IsR0FBbEMsRUFBdUNwQixHQUF2QztBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXdCO0FBQ3BCLGVBQU9DLHFCQUFRUyxHQUFSLENBQVksS0FBS1AsT0FBakIsRUFBMEJDLHFCQUFRaUIsS0FBbEMsQ0FBUDtBQUNILE87d0JBRWFyQixHLEVBQWE7QUFDdkJDLDZCQUFRQyxHQUFSLENBQVksS0FBS0MsT0FBakIsRUFBMEJDLHFCQUFRaUIsS0FBbEMsRUFBeUNyQixHQUF6QztBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXNCO0FBQ2xCLGVBQU9DLHFCQUFRUyxHQUFSLENBQVksS0FBS1AsT0FBakIsRUFBMEJDLHFCQUFRa0IsR0FBbEMsQ0FBUDtBQUNILE87d0JBRVd0QixHLEVBQWE7QUFDckJDLDZCQUFRQyxHQUFSLENBQVksS0FBS0MsT0FBakIsRUFBMEJDLHFCQUFRa0IsR0FBbEMsRUFBdUN0QixHQUF2QztBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXdCO0FBQ3BCLGVBQU9DLHFCQUFRUyxHQUFSLENBQVksS0FBS1AsT0FBakIsRUFBMEJDLHFCQUFRbUIsS0FBbEMsQ0FBUDtBQUNILE87d0JBRWF2QixHLEVBQWE7QUFDdkJDLDZCQUFRQyxHQUFSLENBQVksS0FBS0MsT0FBakIsRUFBMEJDLHFCQUFRbUIsS0FBbEMsRUFBeUN2QixHQUF6QztBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7OzBCQVd3QjtBQUNwQixlQUFPQyxxQkFBUVMsR0FBUixDQUFZLEtBQUtQLE9BQWpCLEVBQTBCQyxxQkFBUUUsSUFBbEMsQ0FBUDtBQUNIOzs7MEJBRStCO0FBQzVCLGVBQU8sS0FBS1EsV0FBWjtBQUNIOzs7MEJBT3lCO0FBQ3RCLGVBQU8sS0FBS1gsT0FBWjtBQUNIOzs7QUFFRCxtQkFBZTtBQUFBOztBQUFBLFdBVExJLEtBU0ssR0FUR2IsT0FBTyxDQUFDQyxNQVNYO0FBQUEsV0FSTGdCLFNBUUssR0FSTyxJQUFJQyxhQUFKLENBQVUsU0FBVixDQVFQO0FBQUEsV0FQTEUsV0FPSyxHQVB1QixJQUFJVSxZQUFKLENBQWlCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLENBQWpCLENBT3ZCO0FBQUEsV0FOTHJCLE9BTUssR0FOZ0JzQix3QkFNaEI7QUFDWCxXQUFLdEIsT0FBTCxHQUFlRixxQkFBUXlCLEtBQVIsRUFBZjtBQUNIOzs7O2lDQUVrQjtBQUNmZCxzQkFBTUMsT0FBTixDQUFjLEtBQUtDLFdBQW5CLEVBQWdDLEtBQUtILFNBQXJDOztBQUNBViw2QkFBUWMsT0FBUixDQUFnQixLQUFLWixPQUFyQixFQUE4QkMscUJBQVFZLEtBQXRDLEVBQTZDLEtBQUtMLFNBQWxEOztBQUNBViw2QkFBUUMsR0FBUixDQUFZLEtBQUtDLE9BQWpCLEVBQTBCQyxxQkFBUUUsSUFBbEMsRUFBd0MsS0FBS1csT0FBTCxHQUFlLEtBQUtWLEtBQUwsR0FBYSxDQUE1QixHQUFnQyxDQUF4RTs7QUFDQSxhQUFLRSxlQUFMO0FBQ0g7Ozt3Q0FFNEI7QUFDekIsWUFBTWtCLElBQUksR0FBR0Msd0JBQVNDLFFBQVQsQ0FBa0JGLElBQS9CO0FBQ0EsWUFBTUcsS0FBSyxHQUFHLEtBQUtDLFFBQW5CO0FBQ0EsWUFBTUMsUUFBUSxHQUFHTCxJQUFJLENBQUNLLFFBQXRCOztBQUNBLFlBQUlBLFFBQVEsQ0FBQ0MsTUFBVCxDQUFnQkMsVUFBaEIsS0FBK0JKLEtBQW5DLEVBQTBDO0FBQUU7QUFBUzs7QUFDckRFLFFBQUFBLFFBQVEsQ0FBQ0MsTUFBVCxDQUFnQkMsVUFBaEIsR0FBNkJKLEtBQTdCO0FBQ0FILFFBQUFBLElBQUksQ0FBQ1EsNEJBQUw7QUFDSDs7O2dDQUVpQjtBQUNkLFlBQUksS0FBS2hDLE9BQVQsRUFBa0I7QUFDZEYsK0JBQVFtQyxJQUFSLENBQWEsS0FBS2pDLE9BQWxCOztBQUNBLGVBQUtBLE9BQUwsR0FBZXNCLHdCQUFmO0FBQ0g7QUFDSjs7Ozs7OztBQUdMRywwQkFBUzdCLEdBQVQsR0FBZUEsR0FBZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVudW0gfSBmcm9tICcuLi8uLi92YWx1ZS10eXBlcyc7XHJcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IEZvZ1Bvb2wsIE5VTExfSEFORExFLCBGb2dWaWV3LCBGb2dIYW5kbGUgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOWFqOWxgOmbvuexu+Wei+OAglxyXG4gKiBAZW5cclxuICogVGhlIGdsb2JhbCBmb2cgdHlwZVxyXG4gKiBAc3RhdGljXHJcbiAqIEBlbnVtIEZvZ0luZm8uRm9nVHlwZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEZvZ1R5cGUgPSBFbnVtKHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnur/mgKfpm77jgIJcclxuICAgICAqIEBlblxyXG4gICAgICogTGluZWFyIGZvZ1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIExJTkVBUjogMCxcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmjIfmlbDpm77jgIJcclxuICAgICAqIEBlblxyXG4gICAgICogRXhwb25lbnRpYWwgZm9nXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgRVhQOiAxLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+aVsOW5s+aWuembvuOAglxyXG4gICAgICogQGVuXHJcbiAgICAgKiBFeHBvbmVudGlhbCBzcXVhcmUgZm9nXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgRVhQX1NRVUFSRUQ6IDIsXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5bGC5Y+g6Zu+44CCXHJcbiAgICAgKiBAZW5cclxuICAgICAqIExheWVyZWQgZm9nXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgTEFZRVJFRDogMyxcclxufSk7XHJcblxyXG5leHBvcnQgY2xhc3MgRm9nIHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOWFqOWxgOmbvuaViFxyXG4gICAgICogQGVuIEVuYWJsZSBnbG9iYWwgZm9nXHJcbiAgICAgKi9cclxuICAgIHNldCBlbmFibGVkICh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBGb2dQb29sLnNldCh0aGlzLl9oYW5kbGUsIEZvZ1ZpZXcuRU5BQkxFLCB2YWwgPyAxIDogMCk7XHJcbiAgICAgICAgRm9nUG9vbC5zZXQodGhpcy5faGFuZGxlLCBGb2dWaWV3LlRZUEUsIHZhbCA/IHRoaXMuX3R5cGUgKyAxIDogMCk7XHJcbiAgICAgICAgdmFsID8gdGhpcy5hY3RpdmF0ZSgpIDogdGhpcy5fdXBkYXRlUGlwZWxpbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZW5hYmxlZCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIEZvZ1Bvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgRm9nVmlldy5FTkFCTEUpIGFzIHVua25vd24gYXMgYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlhajlsYDpm77popzoibJcclxuICAgICAqIEBlbiBHbG9iYWwgZm9nIGNvbG9yXHJcbiAgICAgKi9cclxuICAgIHNldCBmb2dDb2xvciAodmFsOiBDb2xvcikge1xyXG4gICAgICAgIHRoaXMuX2ZvZ0NvbG9yLnNldCh2YWwpO1xyXG4gICAgICAgIENvbG9yLnRvQXJyYXkodGhpcy5fY29sb3JBcnJheSwgdGhpcy5fZm9nQ29sb3IpO1xyXG4gICAgICAgIEZvZ1Bvb2wuc2V0VmVjNCh0aGlzLl9oYW5kbGUsIEZvZ1ZpZXcuQ09MT1IsIHRoaXMuX2ZvZ0NvbG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZm9nQ29sb3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb2dDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlhajlsYDpm77nsbvlnotcclxuICAgICAqIEBlbiBHbG9iYWwgZm9nIHR5cGVcclxuICAgICAqL1xyXG4gICAgZ2V0IHR5cGUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHR5cGUgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5lbmFibGVkKSB0aGlzLl91cGRhdGVQaXBlbGluZSgpO1xyXG4gICAgICAgIEZvZ1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgRm9nVmlldy5UWVBFLCB0aGlzLmVuYWJsZWQgPyB0aGlzLl90eXBlICsgMSA6IDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWFqOWxgOmbvua1k+W6plxyXG4gICAgICogQGVuIEdsb2JhbCBmb2cgZGVuc2l0eVxyXG4gICAgICovXHJcbiAgICBnZXQgZm9nRGVuc2l0eSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gRm9nUG9vbC5nZXQodGhpcy5faGFuZGxlLCBGb2dWaWV3LkRFTlNJVFkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb2dEZW5zaXR5ICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIEZvZ1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgRm9nVmlldy5ERU5TSVRZLCB2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmbvuaViOi1t+Wni+S9jee9ru+8jOWPqumAgueUqOS6jue6v+aAp+mbvlxyXG4gICAgICogQGVuIEdsb2JhbCBmb2cgc3RhcnQgcG9zaXRpb24sIG9ubHkgZm9yIGxpbmVhciBmb2dcclxuICAgICAqL1xyXG4gICAgZ2V0IGZvZ1N0YXJ0ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBGb2dQb29sLmdldCh0aGlzLl9oYW5kbGUsIEZvZ1ZpZXcuU1RBUlQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb2dTdGFydCAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBGb2dQb29sLnNldCh0aGlzLl9oYW5kbGUsIEZvZ1ZpZXcuU1RBUlQsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6Zu+5pWI57uT5p2f5L2N572u77yM5Y+q6YCC55So5LqO57q/5oCn6Zu+XHJcbiAgICAgKiBAZW4gR2xvYmFsIGZvZyBlbmQgcG9zaXRpb24sIG9ubHkgZm9yIGxpbmVhciBmb2dcclxuICAgICAqL1xyXG4gICAgZ2V0IGZvZ0VuZCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gRm9nUG9vbC5nZXQodGhpcy5faGFuZGxlLCBGb2dWaWV3LkVORCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvZ0VuZCAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBGb2dQb29sLnNldCh0aGlzLl9oYW5kbGUsIEZvZ1ZpZXcuRU5ELCB2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmbvuaViOihsOWHj1xyXG4gICAgICogQGVuIEdsb2JhbCBmb2cgYXR0ZW51YXRpb25cclxuICAgICAqL1xyXG4gICAgZ2V0IGZvZ0F0dGVuICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBGb2dQb29sLmdldCh0aGlzLl9oYW5kbGUsIEZvZ1ZpZXcuQVRURU4pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb2dBdHRlbiAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBGb2dQb29sLnNldCh0aGlzLl9oYW5kbGUsIEZvZ1ZpZXcuQVRURU4sIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6Zu+5pWI6aG26YOo6IyD5Zu077yM5Y+q6YCC55So5LqO5bGC57qn6Zu+XHJcbiAgICAgKiBAZW4gR2xvYmFsIGZvZyB0b3AgcmFuZ2UsIG9ubHkgZm9yIGxheWVyZWQgZm9nXHJcbiAgICAgKi9cclxuICAgIGdldCBmb2dUb3AgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIEZvZ1Bvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgRm9nVmlldy5UT1ApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb2dUb3AgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgRm9nUG9vbC5zZXQodGhpcy5faGFuZGxlLCBGb2dWaWV3LlRPUCwgdmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpm77mlYjojIPlm7TvvIzlj6rpgILnlKjkuo7lsYLnuqfpm75cclxuICAgICAqIEBlbiBHbG9iYWwgZm9nIHJhbmdlLCBvbmx5IGZvciBsYXllcmVkIGZvZ1xyXG4gICAgICovXHJcbiAgICBnZXQgZm9nUmFuZ2UgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIEZvZ1Bvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgRm9nVmlldy5SQU5HRSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGZvZ1JhbmdlICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIEZvZ1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgRm9nVmlldy5SQU5HRSwgdmFsKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW9k+WJjembvuWMluexu+Wei+OAglxyXG4gICAgICogQGVuIFRoZSBjdXJyZW50IGdsb2JhbCBmb2cgdHlwZS5cclxuICAgICAqIEByZXR1cm5zIHtGb2dUeXBlfVxyXG4gICAgICogUmV0dXJucyB0aGUgY3VycmVudCBnbG9iYWwgZm9nIHR5cGVcclxuICAgICAqIC0gMDpEaXNhYmxlIGdsb2JhbCBGb2dcclxuICAgICAqIC0gMTpMaW5lYXIgZm9nXHJcbiAgICAgKiAtIDI6RXhwb25lbnRpYWwgZm9nXHJcbiAgICAgKiAtIDM6RXhwb25lbnRpYWwgc3F1YXJlIGZvZ1xyXG4gICAgICogLSA0OkxheWVyZWQgZm9nXHJcbiAgICAgKi9cclxuICAgIGdldCBjdXJyVHlwZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gRm9nUG9vbC5nZXQodGhpcy5faGFuZGxlLCBGb2dWaWV3LlRZUEUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb2xvckFycmF5ICgpOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvckFycmF5O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdHlwZSA9IEZvZ1R5cGUuTElORUFSO1xyXG4gICAgcHJvdGVjdGVkIF9mb2dDb2xvciA9IG5ldyBDb2xvcignI0M4QzhDOCcpO1xyXG4gICAgcHJvdGVjdGVkIF9jb2xvckFycmF5OiBGbG9hdDMyQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KFswLjIsIDAuMiwgMC4yLCAxLjBdKTtcclxuICAgIHByb3RlY3RlZCBfaGFuZGxlOiBGb2dIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuXHJcbiAgICBnZXQgaGFuZGxlICgpIDogRm9nSGFuZGxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9oYW5kbGUgPSBGb2dQb29sLmFsbG9jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2YXRlICgpIHtcclxuICAgICAgICBDb2xvci50b0FycmF5KHRoaXMuX2NvbG9yQXJyYXksIHRoaXMuX2ZvZ0NvbG9yKTtcclxuICAgICAgICBGb2dQb29sLnNldFZlYzQodGhpcy5faGFuZGxlLCBGb2dWaWV3LkNPTE9SLCB0aGlzLl9mb2dDb2xvcik7XHJcbiAgICAgICAgRm9nUG9vbC5zZXQodGhpcy5faGFuZGxlLCBGb2dWaWV3LlRZUEUsIHRoaXMuZW5hYmxlZCA/IHRoaXMuX3R5cGUgKyAxIDogMCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUGlwZWxpbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVBpcGVsaW5lICgpIHtcclxuICAgICAgICBjb25zdCByb290ID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdFxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jdXJyVHlwZTtcclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IHJvb3QucGlwZWxpbmU7XHJcbiAgICAgICAgaWYgKHBpcGVsaW5lLm1hY3Jvcy5DQ19VU0VfRk9HID09PSB2YWx1ZSkgeyByZXR1cm47IH1cclxuICAgICAgICBwaXBlbGluZS5tYWNyb3MuQ0NfVVNFX0ZPRyA9IHZhbHVlO1xyXG4gICAgICAgIHJvb3Qub25HbG9iYWxQaXBlbGluZVN0YXRlQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faGFuZGxlKSB7XHJcbiAgICAgICAgICAgIEZvZ1Bvb2wuZnJlZSh0aGlzLl9oYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmxlZ2FjeUNDLkZvZyA9IEZvZztcclxuIl19