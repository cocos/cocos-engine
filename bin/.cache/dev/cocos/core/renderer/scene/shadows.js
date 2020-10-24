(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/material.js", "../../geometry/index.js", "../../math/index.js", "../../global-exports.js", "../../value-types/index.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/material.js"), require("../../geometry/index.js"), require("../../math/index.js"), require("../../global-exports.js"), require("../../value-types/index.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.material, global.index, global.index, global.globalExports, global.index, global.memoryPools);
    global.shadows = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _material, _index, _index2, _globalExports, _index3, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Shadows = _exports.PCFType = _exports.ShadowType = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @zh 阴影类型。
   * @en The shadow type
   * @static
   * @enum Shadows.ShadowType
   */
  var ShadowType = (0, _index3.Enum)({
    /**
     * @zh 平面阴影。
     * @en Planar shadow
     * @property Planar
     * @readonly
     */
    Planar: 0,

    /**
     * @zh 阴影贴图。
     * @en Shadow type
     * @property ShadowMap
     * @readonly
     */
    ShadowMap: 1
  });
  /**
   * @zh pcf阴影等级。
   * @en The pcf type
   * @static
   * @enum Shadows.ShadowType
   */

  _exports.ShadowType = ShadowType;
  var PCFType = (0, _index3.Enum)({
    /**
     * @zh x1 次采样
     * @en x1 times
     * @readonly
     */
    HARD: 0,

    /**
     * @zh x5 次采样
     * @en x5 times
     * @readonly
     */
    FILTER_X5: 1,

    /**
     * @zh x9 次采样
     * @en x9 times
     * @readonly
     */
    FILTER_X9: 2,

    /**
     * @zh x25 次采样
     * @en x25 times
     * @readonly
     */
    FILTER_X25: 3
  });
  _exports.PCFType = PCFType;

  var Shadows = /*#__PURE__*/function () {
    _createClass(Shadows, [{
      key: "enabled",

      /**
       * @en Whether activate planar shadow
       * @zh 是否启用平面阴影？
       */
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.ENABLE);
      },
      set: function set(val) {
        this.dirty = true;

        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.ENABLE, val ? 1 : 0);

        val ? this.activate() : this._updatePipeline();
      }
      /**
       * @en The normal of the plane which receives shadow
       * @zh 阴影接收平面的法线
       */

    }, {
      key: "normal",
      get: function get() {
        return this._normal;
      },
      set: function set(val) {
        _index2.Vec3.copy(this._normal, val);

        this.dirty = true;

        _memoryPools.ShadowsPool.setVec3(this._handle, _memoryPools.ShadowsView.NORMAL, this._normal);
      }
      /**
       * @en The distance from coordinate origin to the receiving plane.
       * @zh 阴影接收平面与原点的距离
       */

    }, {
      key: "distance",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.DISTANCE);
      },
      set: function set(val) {
        this.dirty = true;

        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.DISTANCE, val);
      }
      /**
       * @en Shadow color
       * @zh 阴影颜色
       */

    }, {
      key: "shadowColor",
      get: function get() {
        return this._shadowColor;
      },
      set: function set(color) {
        this._shadowColor = color;
        this.dirty = true;

        _memoryPools.ShadowsPool.setVec4(this._handle, _memoryPools.ShadowsView.COLOR, color);
      }
      /**
       * @en Shadow type
       * @zh 阴影类型
       */

    }, {
      key: "type",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.TYPE);
      },
      set: function set(val) {
        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.TYPE, this.enabled ? val : -1);

        this._updatePipeline();

        this._updatePlanarInfo();
      }
      /**
       * @en get or set shadow camera near
       * @zh 获取或者设置阴影相机近裁剪面
       */

    }, {
      key: "near",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.NEAR);
      },
      set: function set(val) {
        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.NEAR, val);
      }
      /**
       * @en get or set shadow camera far
       * @zh 获取或者设置阴影相机远裁剪面
       */

    }, {
      key: "far",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.FAR);
      },
      set: function set(val) {
        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.FAR, val);
      }
      /**
       * @en get or set shadow camera aspect
       * @zh 获取或者设置阴影相机的宽高比
       */

    }, {
      key: "aspect",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.ASPECT);
      },
      set: function set(val) {
        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.ASPECT, val);
      }
      /**
       * @en get or set shadow camera orthoSize
       * @zh 获取或者设置阴影相机正交大小
       */

    }, {
      key: "orthoSize",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.ORTHO_SIZE);
      },
      set: function set(val) {
        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.ORTHO_SIZE, val);
      }
      /**
       * @en get or set shadow camera orthoSize
       * @zh 获取或者设置阴影纹理大小
       */

    }, {
      key: "size",
      get: function get() {
        return this._size;
      },
      set: function set(val) {
        this._size = val;

        _memoryPools.ShadowsPool.setVec2(this._handle, _memoryPools.ShadowsView.SIZE, this._size);
      }
      /**
       * @en get or set shadow pcf
       * @zh 获取或者设置阴影pcf等级
       */

    }, {
      key: "pcf",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.PCF_TYPE);
      },
      set: function set(val) {
        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.PCF_TYPE, val);
      }
    }, {
      key: "matLight",
      get: function get() {
        return this._matLight;
      }
      /**
       * @zh
       * 场景包围球
       */

    }, {
      key: "sphere",
      get: function get() {
        return this._sphere;
      }
    }, {
      key: "dirty",
      get: function get() {
        return _memoryPools.ShadowsPool.get(this._handle, _memoryPools.ShadowsView.DIRTY);
      },
      set: function set(val) {
        _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.DIRTY, val ? 1 : 0);
      }
    }, {
      key: "material",
      get: function get() {
        return this._material;
      }
    }, {
      key: "instancingMaterial",
      get: function get() {
        return this._instancingMaterial;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._handle;
      }
    }]);

    function Shadows() {
      _classCallCheck(this, Shadows);

      this._normal = new _index2.Vec3(0, 1, 0);
      this._shadowColor = new _index2.Color(0, 0, 0, 76);
      this._matLight = new _index2.Mat4();
      this._material = null;
      this._instancingMaterial = null;
      this._size = new _index2.Vec2(512, 512);
      this._handle = _memoryPools.NULL_HANDLE;
      this._sphere = new _index.sphere(0.0, 0.0, 0.0, 0.01);
      this._handle = _memoryPools.ShadowsPool.alloc();
    }

    _createClass(Shadows, [{
      key: "activate",
      value: function activate() {
        this.dirty = true;

        if (this.type === ShadowType.ShadowMap) {
          this._updatePipeline();
        } else {
          this._updatePlanarInfo();
        }
      }
    }, {
      key: "_updatePlanarInfo",
      value: function _updatePlanarInfo() {
        if (!this._material) {
          this._material = new _material.Material();

          this._material.initialize({
            effectName: 'pipeline/planar-shadow'
          });

          _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.PLANAR_PASS, this._material.passes[0].handle);
        }

        if (!this._instancingMaterial) {
          this._instancingMaterial = new _material.Material();

          this._instancingMaterial.initialize({
            effectName: 'pipeline/planar-shadow',
            defines: {
              USE_INSTANCING: true
            }
          });

          _memoryPools.ShadowsPool.set(this._handle, _memoryPools.ShadowsView.INSTANCE_PASS, this._instancingMaterial.passes[0].handle);
        }
      }
    }, {
      key: "_updatePipeline",
      value: function _updatePipeline() {
        var root = _globalExports.legacyCC.director.root;
        var pipeline = root.pipeline;
        var enable = this.enabled && this.type === ShadowType.ShadowMap;

        if (pipeline.macros.CC_RECEIVE_SHADOW === enable) {
          return;
        }

        pipeline.macros.CC_RECEIVE_SHADOW = enable;
        root.onGlobalPipelineStateChanged();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._material) {
          this._material.destroy();
        }

        if (this._instancingMaterial) {
          this._instancingMaterial.destroy();
        }

        if (this._handle) {
          _memoryPools.ShadowsPool.free(this._handle);

          this._handle = _memoryPools.NULL_HANDLE;
        }
      }
    }]);

    return Shadows;
  }();

  _exports.Shadows = Shadows;
  _globalExports.legacyCC.Shadows = Shadows;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvc2hhZG93cy50cyJdLCJuYW1lcyI6WyJTaGFkb3dUeXBlIiwiUGxhbmFyIiwiU2hhZG93TWFwIiwiUENGVHlwZSIsIkhBUkQiLCJGSUxURVJfWDUiLCJGSUxURVJfWDkiLCJGSUxURVJfWDI1IiwiU2hhZG93cyIsIlNoYWRvd3NQb29sIiwiZ2V0IiwiX2hhbmRsZSIsIlNoYWRvd3NWaWV3IiwiRU5BQkxFIiwidmFsIiwiZGlydHkiLCJzZXQiLCJhY3RpdmF0ZSIsIl91cGRhdGVQaXBlbGluZSIsIl9ub3JtYWwiLCJWZWMzIiwiY29weSIsInNldFZlYzMiLCJOT1JNQUwiLCJESVNUQU5DRSIsIl9zaGFkb3dDb2xvciIsImNvbG9yIiwic2V0VmVjNCIsIkNPTE9SIiwiVFlQRSIsImVuYWJsZWQiLCJfdXBkYXRlUGxhbmFySW5mbyIsIk5FQVIiLCJGQVIiLCJBU1BFQ1QiLCJPUlRIT19TSVpFIiwiX3NpemUiLCJzZXRWZWMyIiwiU0laRSIsIlBDRl9UWVBFIiwiX21hdExpZ2h0IiwiX3NwaGVyZSIsIkRJUlRZIiwiX21hdGVyaWFsIiwiX2luc3RhbmNpbmdNYXRlcmlhbCIsIkNvbG9yIiwiTWF0NCIsIlZlYzIiLCJOVUxMX0hBTkRMRSIsInNwaGVyZSIsImFsbG9jIiwidHlwZSIsIk1hdGVyaWFsIiwiaW5pdGlhbGl6ZSIsImVmZmVjdE5hbWUiLCJQTEFOQVJfUEFTUyIsInBhc3NlcyIsImhhbmRsZSIsImRlZmluZXMiLCJVU0VfSU5TVEFOQ0lORyIsIklOU1RBTkNFX1BBU1MiLCJyb290IiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInBpcGVsaW5lIiwiZW5hYmxlIiwibWFjcm9zIiwiQ0NfUkVDRUlWRV9TSEFET1ciLCJvbkdsb2JhbFBpcGVsaW5lU3RhdGVDaGFuZ2VkIiwiZGVzdHJveSIsImZyZWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q0UsTUFBVCxDQUFnQkMsaUJBQWhCLEdBQW9DRixNQUFwQztBQUNBSixRQUFBQSxJQUFJLENBQUNPLDRCQUFMO0FBQ0g7OztnQ0FFaUI7QUFDZCxZQUFJLEtBQUt6QixTQUFULEVBQW9CO0FBQ2hCLGVBQUtBLFNBQUwsQ0FBZTBCLE9BQWY7QUFDSDs7QUFFRCxZQUFJLEtBQUt6QixtQkFBVCxFQUE4QjtBQUMxQixlQUFLQSxtQkFBTCxDQUF5QnlCLE9BQXpCO0FBQ0g7O0FBRUQsWUFBSSxLQUFLMUQsT0FBVCxFQUFrQjtBQUNkRixtQ0FBWTZELElBQVosQ0FBaUIsS0FBSzNELE9BQXRCOztBQUNBLGVBQUtBLE9BQUwsR0FBZXFDLHdCQUFmO0FBQ0g7QUFDSjs7Ozs7OztBQUdMYywwQkFBU3RELE9BQVQsR0FBbUJBLE9BQW5CIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgc3BoZXJlIH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBDb2xvciwgTWF0NCwgVmVjMywgVmVjMiB9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzJztcclxuaW1wb3J0IHsgU2hhZG93c1Bvb2wsIE5VTExfSEFORExFLCBTaGFkb3dzVmlldywgU2hhZG93c0hhbmRsZSB9IGZyb20gJy4uL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuXHJcbi8qKlxyXG4gKiBAemgg6Zi05b2x57G75Z6L44CCXHJcbiAqIEBlbiBUaGUgc2hhZG93IHR5cGVcclxuICogQHN0YXRpY1xyXG4gKiBAZW51bSBTaGFkb3dzLlNoYWRvd1R5cGVcclxuICovXHJcbmV4cG9ydCBjb25zdCBTaGFkb3dUeXBlID0gRW51bSh7XHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlubPpnaLpmLTlvbHjgIJcclxuICAgICAqIEBlbiBQbGFuYXIgc2hhZG93XHJcbiAgICAgKiBAcHJvcGVydHkgUGxhbmFyXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgUGxhbmFyOiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmYtOW9sei0tOWbvuOAglxyXG4gICAgICogQGVuIFNoYWRvdyB0eXBlXHJcbiAgICAgKiBAcHJvcGVydHkgU2hhZG93TWFwXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgU2hhZG93TWFwOiAxLFxyXG59KVxyXG5cclxuLyoqXHJcbiAqIEB6aCBwY2bpmLTlvbHnrYnnuqfjgIJcclxuICogQGVuIFRoZSBwY2YgdHlwZVxyXG4gKiBAc3RhdGljXHJcbiAqIEBlbnVtIFNoYWRvd3MuU2hhZG93VHlwZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFBDRlR5cGUgPSBFbnVtKHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIHgxIOasoemHh+agt1xyXG4gICAgICogQGVuIHgxIHRpbWVzXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgSEFSRDogMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCB4NSDmrKHph4fmoLdcclxuICAgICAqIEBlbiB4NSB0aW1lc1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIEZJTFRFUl9YNTogMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCB4OSDmrKHph4fmoLdcclxuICAgICAqIEBlbiB4OSB0aW1lc1xyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIEZJTFRFUl9YOTogMixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCB4MjUg5qyh6YeH5qC3XHJcbiAgICAgKiBAZW4geDI1IHRpbWVzXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgRklMVEVSX1gyNTogMyxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBTaGFkb3dzIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgYWN0aXZhdGUgcGxhbmFyIHNoYWRvd1xyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOW5s+mdoumYtOW9se+8n1xyXG4gICAgICovXHJcbiAgICBnZXQgZW5hYmxlZCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIFNoYWRvd3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3LkVOQUJMRSkgYXMgdW5rbm93biBhcyBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBlbmFibGVkICh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICBTaGFkb3dzUG9vbC5zZXQodGhpcy5faGFuZGxlLCBTaGFkb3dzVmlldy5FTkFCTEUsIHZhbCA/IDEgOiAwKTtcclxuICAgICAgICB2YWwgPyB0aGlzLmFjdGl2YXRlKCkgOiB0aGlzLl91cGRhdGVQaXBlbGluZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBub3JtYWwgb2YgdGhlIHBsYW5lIHdoaWNoIHJlY2VpdmVzIHNoYWRvd1xyXG4gICAgICogQHpoIOmYtOW9seaOpeaUtuW5s+mdoueahOazlee6v1xyXG4gICAgICovXHJcbiAgICBnZXQgbm9ybWFsICgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9ybWFsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBub3JtYWwgKHZhbDogVmVjMykge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9ub3JtYWwsIHZhbCk7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0VmVjMyh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3Lk5PUk1BTCwgdGhpcy5fbm9ybWFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZGlzdGFuY2UgZnJvbSBjb29yZGluYXRlIG9yaWdpbiB0byB0aGUgcmVjZWl2aW5nIHBsYW5lLlxyXG4gICAgICogQHpoIOmYtOW9seaOpeaUtuW5s+mdouS4juWOn+eCueeahOi3neemu1xyXG4gICAgICovXHJcbiAgICBnZXQgZGlzdGFuY2UgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFNoYWRvd3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3LkRJU1RBTkNFKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZGlzdGFuY2UgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgU2hhZG93c1ZpZXcuRElTVEFOQ0UsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2hhZG93IGNvbG9yXHJcbiAgICAgKiBAemgg6Zi05b2x6aKc6ImyXHJcbiAgICAgKi9cclxuICAgIGdldCBzaGFkb3dDb2xvciAoKTogQ29sb3Ige1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2hhZG93Q29sb3IgKGNvbG9yOiBDb2xvcikge1xyXG4gICAgICAgIHRoaXMuX3NoYWRvd0NvbG9yID0gY29sb3I7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0VmVjNCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3LkNPTE9SLCBjb2xvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2hhZG93IHR5cGVcclxuICAgICAqIEB6aCDpmLTlvbHnsbvlnotcclxuICAgICAqL1xyXG4gICAgZ2V0IHR5cGUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFNoYWRvd3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3LlRZUEUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0eXBlICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIFNoYWRvd3NQb29sLnNldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3LlRZUEUsIHRoaXMuZW5hYmxlZCA/IHZhbCA6IC0xKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVQaXBlbGluZSgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVBsYW5hckluZm8oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgb3Igc2V0IHNoYWRvdyBjYW1lcmEgbmVhclxyXG4gICAgICogQHpoIOiOt+WPluaIluiAheiuvue9rumYtOW9seebuOacuui/keijgeWJqumdolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IG5lYXIgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFNoYWRvd3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3Lk5FQVIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBuZWFyICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIFNoYWRvd3NQb29sLnNldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3Lk5FQVIsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IG9yIHNldCBzaGFkb3cgY2FtZXJhIGZhclxyXG4gICAgICogQHpoIOiOt+WPluaIluiAheiuvue9rumYtOW9seebuOacuui/nOijgeWJqumdolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGZhciAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gU2hhZG93c1Bvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgU2hhZG93c1ZpZXcuRkFSKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgZmFyICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIFNoYWRvd3NQb29sLnNldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3LkZBUiwgdmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgb3Igc2V0IHNoYWRvdyBjYW1lcmEgYXNwZWN0XHJcbiAgICAgKiBAemgg6I635Y+W5oiW6ICF6K6+572u6Zi05b2x55u45py655qE5a696auY5q+UXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgYXNwZWN0ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBTaGFkb3dzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBTaGFkb3dzVmlldy5BU1BFQ1QpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBhc3BlY3QgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgU2hhZG93c1ZpZXcuQVNQRUNULCB2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBvciBzZXQgc2hhZG93IGNhbWVyYSBvcnRob1NpemVcclxuICAgICAqIEB6aCDojrflj5bmiJbogIXorr7nva7pmLTlvbHnm7jmnLrmraPkuqTlpKflsI9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBvcnRob1NpemUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIFNoYWRvd3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3Lk9SVEhPX1NJWkUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBvcnRob1NpemUgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgU2hhZG93c1ZpZXcuT1JUSE9fU0laRSwgdmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgb3Igc2V0IHNoYWRvdyBjYW1lcmEgb3J0aG9TaXplXHJcbiAgICAgKiBAemgg6I635Y+W5oiW6ICF6K6+572u6Zi05b2x57q555CG5aSn5bCPXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2l6ZSAoKTogVmVjMiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHNpemUgKHZhbDogVmVjMikge1xyXG4gICAgICAgIHRoaXMuX3NpemUgPSB2YWw7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0VmVjMih0aGlzLl9oYW5kbGUsIFNoYWRvd3NWaWV3LlNJWkUsIHRoaXMuX3NpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBvciBzZXQgc2hhZG93IHBjZlxyXG4gICAgICogQHpoIOiOt+WPluaIluiAheiuvue9rumYtOW9sXBjZuetiee6p1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHBjZiAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gU2hhZG93c1Bvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgU2hhZG93c1ZpZXcuUENGX1RZUEUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBwY2YgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgU2hhZG93c1ZpZXcuUENGX1RZUEUsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYXRMaWdodCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdExpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlnLrmma/ljIXlm7TnkINcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzcGhlcmUgKCk6IHNwaGVyZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NwaGVyZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZGlydHkgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBTaGFkb3dzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBTaGFkb3dzVmlldy5ESVJUWSkgYXMgdW5rbm93biBhcyBib29sZWFuO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBkaXJ0eSAodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgU2hhZG93c1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgU2hhZG93c1ZpZXcuRElSVFksIHZhbCA/IDEgOiAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hdGVyaWFsICgpOiBNYXRlcmlhbCB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGluc3RhbmNpbmdNYXRlcmlhbCAoKTogTWF0ZXJpYWwgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2luZ01hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfbm9ybWFsID0gbmV3IFZlYzMoMCwgMSwgMCk7XHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRvd0NvbG9yID0gbmV3IENvbG9yKDAsIDAsIDAsIDc2KTtcclxuICAgIHByb3RlY3RlZCBfbWF0TGlnaHQgPSBuZXcgTWF0NCgpO1xyXG4gICAgcHJvdGVjdGVkIF9tYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfaW5zdGFuY2luZ01hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9zaXplOiBWZWMyID0gbmV3IFZlYzIoNTEyLCA1MTIpO1xyXG4gICAgcHJvdGVjdGVkIF9oYW5kbGU6IFNoYWRvd3NIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuICAgIHByb3RlY3RlZCBfc3BoZXJlOiBzcGhlcmUgPSBuZXcgc3BoZXJlKDAuMCwgMC4wLCAwLjAsIDAuMDEpO1xyXG5cclxuICAgIGdldCBoYW5kbGUgKCkgOiBTaGFkb3dzSGFuZGxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9oYW5kbGUgPSBTaGFkb3dzUG9vbC5hbGxvYygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gU2hhZG93VHlwZS5TaGFkb3dNYXApIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGlwZWxpbmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQbGFuYXJJbmZvKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlUGxhbmFySW5mbyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tYXRlcmlhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5pbml0aWFsaXplKHsgZWZmZWN0TmFtZTogJ3BpcGVsaW5lL3BsYW5hci1zaGFkb3cnIH0pO1xyXG4gICAgICAgICAgICBTaGFkb3dzUG9vbC5zZXQodGhpcy5faGFuZGxlLCBTaGFkb3dzVmlldy5QTEFOQVJfUEFTUywgdGhpcy5fbWF0ZXJpYWwucGFzc2VzWzBdLmhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5faW5zdGFuY2luZ01hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNpbmdNYXRlcmlhbCA9IG5ldyBNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jaW5nTWF0ZXJpYWwuaW5pdGlhbGl6ZSh7IGVmZmVjdE5hbWU6ICdwaXBlbGluZS9wbGFuYXItc2hhZG93JywgZGVmaW5lczogeyBVU0VfSU5TVEFOQ0lORzogdHJ1ZSB9IH0pO1xyXG4gICAgICAgICAgICBTaGFkb3dzUG9vbC5zZXQodGhpcy5faGFuZGxlLCBTaGFkb3dzVmlldy5JTlNUQU5DRV9QQVNTLCB0aGlzLl9pbnN0YW5jaW5nTWF0ZXJpYWwucGFzc2VzWzBdLmhhbmRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlUGlwZWxpbmUgKCkge1xyXG4gICAgICAgIGNvbnN0IHJvb3QgPSBsZWdhY3lDQy5kaXJlY3Rvci5yb290XHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSByb290LnBpcGVsaW5lO1xyXG4gICAgICAgIGNvbnN0IGVuYWJsZSA9IHRoaXMuZW5hYmxlZCAmJiB0aGlzLnR5cGUgPT09IFNoYWRvd1R5cGUuU2hhZG93TWFwO1xyXG4gICAgICAgIGlmIChwaXBlbGluZS5tYWNyb3MuQ0NfUkVDRUlWRV9TSEFET1cgPT09IGVuYWJsZSkgeyByZXR1cm47IH1cclxuICAgICAgICBwaXBlbGluZS5tYWNyb3MuQ0NfUkVDRUlWRV9TSEFET1cgPSBlbmFibGU7XHJcbiAgICAgICAgcm9vdC5vbkdsb2JhbFBpcGVsaW5lU3RhdGVDaGFuZ2VkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5zdGFuY2luZ01hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNpbmdNYXRlcmlhbC5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5faGFuZGxlKSB7XHJcbiAgICAgICAgICAgIFNoYWRvd3NQb29sLmZyZWUodGhpcy5faGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5TaGFkb3dzID0gU2hhZG93cztcclxuIl19