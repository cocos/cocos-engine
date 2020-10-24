(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.particle = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ParticleModuleBase = _exports.PARTICLE_MODULE_PROPERTY = _exports.PARTICLE_MODULE_ORDER = _exports.PARTICLE_MODULE_NAME = _exports.Particle = void 0;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Particle = // uint
  function Particle(particleSystem) {
    _classCallCheck(this, Particle);

    this.particleSystem = void 0;
    this.position = void 0;
    this.velocity = void 0;
    this.animatedVelocity = void 0;
    this.ultimateVelocity = void 0;
    this.angularVelocity = void 0;
    this.axisOfRotation = void 0;
    this.rotation = void 0;
    this.startSize = void 0;
    this.size = void 0;
    this.startColor = void 0;
    this.color = void 0;
    this.randomSeed = void 0;
    this.remainingLifetime = void 0;
    this.startLifetime = void 0;
    this.emitAccumulator0 = void 0;
    this.emitAccumulator1 = void 0;
    this.frameIndex = void 0;
    this.startRow = void 0;
    this.particleSystem = particleSystem;
    this.position = new _index.Vec3(0, 0, 0);
    this.velocity = new _index.Vec3(0, 0, 0);
    this.animatedVelocity = new _index.Vec3(0, 0, 0);
    this.ultimateVelocity = new _index.Vec3(0, 0, 0);
    this.angularVelocity = new _index.Vec3(0, 0, 0);
    this.axisOfRotation = new _index.Vec3(0, 0, 0);
    this.rotation = new _index.Vec3(0, 0, 0);
    this.startSize = new _index.Vec3(0, 0, 0);
    this.size = new _index.Vec3(0, 0, 0);
    this.startColor = _index.Color.WHITE.clone();
    this.color = _index.Color.WHITE.clone();
    this.randomSeed = 0; // uint

    this.remainingLifetime = 0.0;
    this.startLifetime = 0.0;
    this.emitAccumulator0 = 0.0;
    this.emitAccumulator1 = 0.0;
    this.frameIndex = 0.0;
    this.startRow = 0;
  };

  _exports.Particle = Particle;
  var PARTICLE_MODULE_NAME = {
    COLOR: 'colorModule',
    FORCE: 'forceModule',
    LIMIT: 'limitModule',
    ROTATION: 'rotationModule',
    SIZE: 'sizeModule',
    VELOCITY: 'velocityModule',
    TEXTURE: 'textureModule'
  };
  _exports.PARTICLE_MODULE_NAME = PARTICLE_MODULE_NAME;
  var PARTICLE_MODULE_ORDER = ['sizeModule', 'colorModule', 'forceModule', 'velocityModule', 'limitModule', 'rotationModule', 'textureModule'];
  _exports.PARTICLE_MODULE_ORDER = PARTICLE_MODULE_ORDER;
  var PARTICLE_MODULE_PROPERTY = ['_colorOverLifetimeModule', '_shapeModule', '_sizeOvertimeModule', '_velocityOvertimeModule', '_forceOvertimeModule', '_limitVelocityOvertimeModule', '_rotationOvertimeModule', '_textureAnimationModule', '_trailModule'];
  _exports.PARTICLE_MODULE_PROPERTY = PARTICLE_MODULE_PROPERTY;

  var ParticleModuleBase = /*#__PURE__*/function () {
    function ParticleModuleBase() {
      _classCallCheck(this, ParticleModuleBase);

      this.target = null;
      this.needUpdate = false;
      this.needAnimate = true;
      this.name = void 0;
    }

    _createClass(ParticleModuleBase, [{
      key: "bindTarget",
      value: function bindTarget(target) {
        this.target = target;
      }
    }, {
      key: "update",
      value: function update(space, trans) {}
    }]);

    return ParticleModuleBase;
  }();

  _exports.ParticleModuleBase = ParticleModuleBase;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3BhcnRpY2xlLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlIiwicGFydGljbGVTeXN0ZW0iLCJwb3NpdGlvbiIsInZlbG9jaXR5IiwiYW5pbWF0ZWRWZWxvY2l0eSIsInVsdGltYXRlVmVsb2NpdHkiLCJhbmd1bGFyVmVsb2NpdHkiLCJheGlzT2ZSb3RhdGlvbiIsInJvdGF0aW9uIiwic3RhcnRTaXplIiwic2l6ZSIsInN0YXJ0Q29sb3IiLCJjb2xvciIsInJhbmRvbVNlZWQiLCJyZW1haW5pbmdMaWZldGltZSIsInN0YXJ0TGlmZXRpbWUiLCJlbWl0QWNjdW11bGF0b3IwIiwiZW1pdEFjY3VtdWxhdG9yMSIsImZyYW1lSW5kZXgiLCJzdGFydFJvdyIsIlZlYzMiLCJDb2xvciIsIldISVRFIiwiY2xvbmUiLCJQQVJUSUNMRV9NT0RVTEVfTkFNRSIsIkNPTE9SIiwiRk9SQ0UiLCJMSU1JVCIsIlJPVEFUSU9OIiwiU0laRSIsIlZFTE9DSVRZIiwiVEVYVFVSRSIsIlBBUlRJQ0xFX01PRFVMRV9PUkRFUiIsIlBBUlRJQ0xFX01PRFVMRV9QUk9QRVJUWSIsIlBhcnRpY2xlTW9kdWxlQmFzZSIsInRhcmdldCIsIm5lZWRVcGRhdGUiLCJuZWVkQW5pbWF0ZSIsIm5hbWUiLCJzcGFjZSIsInRyYW5zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVFhQSxRLEdBYWtCO0FBUTNCLG9CQUFhQyxjQUFiLEVBQWtDO0FBQUE7O0FBQUEsU0FwQjNCQSxjQW9CMkI7QUFBQSxTQW5CM0JDLFFBbUIyQjtBQUFBLFNBbEIzQkMsUUFrQjJCO0FBQUEsU0FqQjNCQyxnQkFpQjJCO0FBQUEsU0FoQjNCQyxnQkFnQjJCO0FBQUEsU0FmM0JDLGVBZTJCO0FBQUEsU0FkM0JDLGNBYzJCO0FBQUEsU0FiM0JDLFFBYTJCO0FBQUEsU0FaM0JDLFNBWTJCO0FBQUEsU0FYM0JDLElBVzJCO0FB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b250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ29sb3IsIFZlYzMsIE1hdDQgfSBmcm9tICcuLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZVN5c3RlbSB9IGZyb20gJy4vcGFydGljbGUtc3lzdGVtJztcclxuaW1wb3J0IHsgSVBhcnRpY2xlU3lzdGVtUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyL3BhcnRpY2xlLXN5c3RlbS1yZW5kZXJlci1iYXNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWNsZSB7XHJcbiAgICBwdWJsaWMgcGFydGljbGVTeXN0ZW06IFBhcnRpY2xlU3lzdGVtO1xyXG4gICAgcHVibGljIHBvc2l0aW9uOiBWZWMzO1xyXG4gICAgcHVibGljIHZlbG9jaXR5OiBWZWMzO1xyXG4gICAgcHVibGljIGFuaW1hdGVkVmVsb2NpdHk6IFZlYzM7XHJcbiAgICBwdWJsaWMgdWx0aW1hdGVWZWxvY2l0eTogVmVjMztcclxuICAgIHB1YmxpYyBhbmd1bGFyVmVsb2NpdHk6IFZlYzM7XHJcbiAgICBwdWJsaWMgYXhpc09mUm90YXRpb246IFZlYzM7XHJcbiAgICBwdWJsaWMgcm90YXRpb246IFZlYzM7XHJcbiAgICBwdWJsaWMgc3RhcnRTaXplOiBWZWMzO1xyXG4gICAgcHVibGljIHNpemU6IFZlYzM7XHJcbiAgICBwdWJsaWMgc3RhcnRDb2xvcjogQ29sb3I7XHJcbiAgICBwdWJsaWMgY29sb3I6IENvbG9yO1xyXG4gICAgcHVibGljIHJhbmRvbVNlZWQ6IG51bWJlcjsgLy8gdWludFxyXG4gICAgcHVibGljIHJlbWFpbmluZ0xpZmV0aW1lOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgc3RhcnRMaWZldGltZTogbnVtYmVyO1xyXG4gICAgcHVibGljIGVtaXRBY2N1bXVsYXRvcjA6IG51bWJlcjtcclxuICAgIHB1YmxpYyBlbWl0QWNjdW11bGF0b3IxOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZnJhbWVJbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIHN0YXJ0Um93OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHBhcnRpY2xlU3lzdGVtOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gcGFydGljbGVTeXN0ZW07XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLmFuaW1hdGVkVmVsb2NpdHkgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLnVsdGltYXRlVmVsb2NpdHkgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLmFuZ3VsYXJWZWxvY2l0eSA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgICAgIHRoaXMuYXhpc09mUm90YXRpb24gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5zdGFydFNpemUgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLnNpemUgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB0aGlzLnN0YXJ0Q29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG4gICAgICAgIHRoaXMucmFuZG9tU2VlZCA9IDA7IC8vIHVpbnRcclxuICAgICAgICB0aGlzLnJlbWFpbmluZ0xpZmV0aW1lID0gMC4wO1xyXG4gICAgICAgIHRoaXMuc3RhcnRMaWZldGltZSA9IDAuMDtcclxuICAgICAgICB0aGlzLmVtaXRBY2N1bXVsYXRvcjAgPSAwLjA7XHJcbiAgICAgICAgdGhpcy5lbWl0QWNjdW11bGF0b3IxID0gMC4wO1xyXG4gICAgICAgIHRoaXMuZnJhbWVJbmRleCA9IDAuMDtcclxuICAgICAgICB0aGlzLnN0YXJ0Um93ID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBBUlRJQ0xFX01PRFVMRV9OQU1FID0ge1xyXG4gICAgQ09MT1I6ICdjb2xvck1vZHVsZScsXHJcbiAgICBGT1JDRTogJ2ZvcmNlTW9kdWxlJyxcclxuICAgIExJTUlUOiAnbGltaXRNb2R1bGUnLFxyXG4gICAgUk9UQVRJT046ICdyb3RhdGlvbk1vZHVsZScsXHJcbiAgICBTSVpFOiAnc2l6ZU1vZHVsZScsXHJcbiAgICBWRUxPQ0lUWTogJ3ZlbG9jaXR5TW9kdWxlJyxcclxuICAgIFRFWFRVUkU6ICd0ZXh0dXJlTW9kdWxlJ1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFBBUlRJQ0xFX01PRFVMRV9PUkRFUiA9IFtcclxuICAgICdzaXplTW9kdWxlJyxcclxuICAgICdjb2xvck1vZHVsZScsXHJcbiAgICAnZm9yY2VNb2R1bGUnLFxyXG4gICAgJ3ZlbG9jaXR5TW9kdWxlJyxcclxuICAgICdsaW1pdE1vZHVsZScsXHJcbiAgICAncm90YXRpb25Nb2R1bGUnLFxyXG4gICAgJ3RleHR1cmVNb2R1bGUnXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgUEFSVElDTEVfTU9EVUxFX1BST1BFUlRZID0gW1xyXG4gICAgJ19jb2xvck92ZXJMaWZldGltZU1vZHVsZScsXHJcbiAgICAnX3NoYXBlTW9kdWxlJyxcclxuICAgICdfc2l6ZU92ZXJ0aW1lTW9kdWxlJyxcclxuICAgICdfdmVsb2NpdHlPdmVydGltZU1vZHVsZScsXHJcbiAgICAnX2ZvcmNlT3ZlcnRpbWVNb2R1bGUnLFxyXG4gICAgJ19saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUnLFxyXG4gICAgJ19yb3RhdGlvbk92ZXJ0aW1lTW9kdWxlJyxcclxuICAgICdfdGV4dHVyZUFuaW1hdGlvbk1vZHVsZScsXHJcbiAgICAnX3RyYWlsTW9kdWxlJ1xyXG5dO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFydGljbGVNb2R1bGUge1xyXG4gICAgdGFyZ2V0OiBJUGFydGljbGVTeXN0ZW1SZW5kZXJlciB8IG51bGw7XHJcbiAgICBuZWVkVXBkYXRlOiBCb29sZWFuO1xyXG4gICAgbmVlZEFuaW1hdGU6IEJvb2xlYW47XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBiaW5kVGFyZ2V0ICh0YXJnZXQ6IGFueSk6IHZvaWQ7XHJcbiAgICB1cGRhdGUgKHNwYWNlOiBudW1iZXIsIHRyYW5zOiBNYXQ0KTogdm9pZDtcclxuICAgIGFuaW1hdGUgKHA6IFBhcnRpY2xlLCBkdD86IG51bWJlcik6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBQYXJ0aWNsZU1vZHVsZUJhc2UgaW1wbGVtZW50cyBJUGFydGljbGVNb2R1bGV7XHJcbiAgICBwdWJsaWMgdGFyZ2V0OklQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbmVlZFVwZGF0ZTogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG5lZWRBbmltYXRlOiBCb29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBwdWJsaWMgYmluZFRhcmdldCAodGFyZ2V0OiBJUGFydGljbGVTeXN0ZW1SZW5kZXJlcikge1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKHNwYWNlOiBudW1iZXIsIHRyYW5zOiBNYXQ0KSB7fVxyXG4gICAgcHVibGljIGFic3RyYWN0IG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBhbmltYXRlIChwOiBQYXJ0aWNsZSwgZHQ/OiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiJdfQ==