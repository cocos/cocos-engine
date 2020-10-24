(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/index.js", "../../core/data/decorators/index.js", "../enum.js", "./particle-system-renderer-cpu.js", "./particle-system-renderer-gpu.js", "../../core/director.js", "../../core/gfx/device.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/index.js"), require("../../core/data/decorators/index.js"), require("../enum.js"), require("./particle-system-renderer-cpu.js"), require("./particle-system-renderer-gpu.js"), require("../../core/director.js"), require("../../core/gfx/device.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global._enum, global.particleSystemRendererCpu, global.particleSystemRendererGpu, global.director, global.device, global.globalExports);
    global.particleSystemRendererData = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _enum, _particleSystemRendererCpu, _particleSystemRendererGpu, _director, _device, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _particleSystemRendererCpu = _interopRequireDefault(_particleSystemRendererCpu);
  _particleSystemRendererGpu = _interopRequireDefault(_particleSystemRendererGpu);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function isSupportGPUParticle() {
    var device = _director.director.root.device;

    if (device.maxVertexTextureUnits >= 8 && device.hasFeature(_device.GFXFeature.TEXTURE_FLOAT)) {
      return true;
    }

    _globalExports.legacyCC.warn('Maybe the device has restrictions on vertex textures or does not support float textures.');

    return false;
  }

  var ParticleSystemRenderer = (_dec = (0, _index2.ccclass)('cc.ParticleSystemRenderer'), _dec2 = (0, _index2.type)(_enum.RenderMode), _dec3 = (0, _index2.displayOrder)(0), _dec4 = (0, _index2.tooltip)('设定粒子生成模式'), _dec5 = (0, _index2.displayOrder)(1), _dec6 = (0, _index2.tooltip)('在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸'), _dec7 = (0, _index2.displayOrder)(2), _dec8 = (0, _index2.tooltip)('在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸'), _dec9 = (0, _index2.type)(_enum.RenderMode), _dec10 = (0, _index2.type)(_index.Mesh), _dec11 = (0, _index2.displayOrder)(7), _dec12 = (0, _index2.tooltip)('粒子发射的模型'), _dec13 = (0, _index2.type)(_index.Material), _dec14 = (0, _index2.displayOrder)(8), _dec15 = (0, _index2.tooltip)('粒子使用的材质'), _dec16 = (0, _index2.type)(_index.Material), _dec17 = (0, _index2.displayOrder)(9), _dec18 = (0, _index2.tooltip)('拖尾使用的材质'), _dec19 = (0, _index2.displayOrder)(10), _dec20 = (0, _index2.tooltip)('是否启用GPU粒子'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function ParticleSystemRenderer() {
      _classCallCheck(this, ParticleSystemRenderer);

      _initializerDefineProperty(this, "_renderMode", _descriptor, this);

      _initializerDefineProperty(this, "_velocityScale", _descriptor2, this);

      _initializerDefineProperty(this, "_lengthScale", _descriptor3, this);

      _initializerDefineProperty(this, "_mesh", _descriptor4, this);

      _initializerDefineProperty(this, "_mainTexture", _descriptor5, this);

      _initializerDefineProperty(this, "_useGPU", _descriptor6, this);

      this._particleSystem = null;
    }

    _createClass(ParticleSystemRenderer, [{
      key: "onInit",
      // ParticleSystem
      value: function onInit(ps) {
        this._particleSystem = ps;
        var useGPU = this._useGPU && isSupportGPUParticle();
        this._particleSystem.processor = useGPU ? new _particleSystemRendererGpu.default(this) : new _particleSystemRendererCpu.default(this);

        this._particleSystem.processor.onInit(ps);
      }
    }, {
      key: "_switchProcessor",
      value: function _switchProcessor() {
        if (this._particleSystem.processor) {
          this._particleSystem.processor.detachFromScene();

          this._particleSystem.processor.clear();

          this._particleSystem.processor = null;
        }

        this._particleSystem.processor = this._useGPU ? new _particleSystemRendererGpu.default(this) : new _particleSystemRendererCpu.default(this);

        this._particleSystem.processor.onInit(this._particleSystem);

        this._particleSystem.processor.onEnable();

        this._particleSystem.bindModule();
      }
    }, {
      key: "renderMode",

      /**
       * @zh 设定粒子生成模式。
       */
      get: function get() {
        return this._renderMode;
      },
      set: function set(val) {
        if (this._renderMode === val) {
          return;
        }

        this._renderMode = val;

        this._particleSystem.processor.updateRenderMode();
      }
      /**
       * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按速度大小进行拉伸。
       */

    }, {
      key: "velocityScale",
      get: function get() {
        return this._velocityScale;
      },
      set: function set(val) {
        this._velocityScale = val;

        this._particleSystem.processor.updateMaterialParams(); // this._updateModel();

      }
      /**
       * @zh 在粒子生成方式为 StrecthedBillboard 时,对粒子在运动方向上按粒子大小进行拉伸。
       */

    }, {
      key: "lengthScale",
      get: function get() {
        return this._lengthScale;
      },
      set: function set(val) {
        this._lengthScale = val;

        this._particleSystem.processor.updateMaterialParams(); // this._updateModel();

      }
    }, {
      key: "mesh",

      /**
       * @zh 粒子发射的模型。
       */
      get: function get() {
        return this._mesh;
      },
      set: function set(val) {
        this._mesh = val;

        this._particleSystem.processor.setVertexAttributes();
      }
      /**
       * @zh 粒子使用的材质。
       */

    }, {
      key: "particleMaterial",
      get: function get() {
        if (!this._particleSystem) {
          return null;
        }

        return this._particleSystem.getMaterial(0);
      },
      set: function set(val) {
        this._particleSystem.setMaterial(val, 0);
      }
      /**
       * @zh 拖尾使用的材质。
       */

    }, {
      key: "trailMaterial",
      get: function get() {
        if (!this._particleSystem) {
          return null;
        }

        return this._particleSystem.getMaterial(1);
      },
      set: function set(val) {
        this._particleSystem.setMaterial(val, 1);
      }
    }, {
      key: "mainTexture",
      get: function get() {
        return this._mainTexture;
      },
      set: function set(val) {
        this._mainTexture = val;
      }
    }, {
      key: "useGPU",
      get: function get() {
        return this._useGPU;
      },
      set: function set(val) {
        if (this._useGPU === val) {
          return;
        }

        if (!isSupportGPUParticle()) {
          this._useGPU = false;
        } else {
          this._useGPU = val;
        }

        this._switchProcessor();
      }
    }]);

    return ParticleSystemRenderer;
  }(), _temp), (_applyDecoratedDescriptor(_class2.prototype, "renderMode", [_dec2, _dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "renderMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "velocityScale", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "velocityScale"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "lengthScale", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "lengthScale"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_renderMode", [_dec9, _index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.RenderMode.Billboard;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_velocityScale", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_lengthScale", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_mesh", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "mesh", [_dec10, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "mesh"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "particleMaterial", [_dec13, _dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "particleMaterial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "trailMaterial", [_dec16, _dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "trailMaterial"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_mainTexture", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_useGPU", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "useGPU", [_dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "useGPU"), _class2.prototype)), _class2)) || _class);
  _exports.default = ParticleSystemRenderer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3JlbmRlcmVyL3BhcnRpY2xlLXN5c3RlbS1yZW5kZXJlci1kYXRhLnRzIl0sIm5hbWVzIjpbImlzU3VwcG9ydEdQVVBhcnRpY2xlIiwiZGV2aWNlIiwiZGlyZWN0b3IiLCJyb290IiwibWF4VmVydGV4VGV4dHVyZVVuaXRzIiwiaGFzRmVhdHVyZSIsIkdGWEZlYXR1cmUiLCJURVhUVVJFX0ZMT0FUIiwibGVnYWN5Q0MiLCJ3YXJuIiwiUGFydGljbGVTeXN0ZW1SZW5kZXJlciIsIlJlbmRlck1vZGUiLCJNZXNoIiwiTWF0ZXJpYWwiLCJfcGFydGljbGVTeXN0ZW0iLCJwcyIsInVzZUdQVSIsIl91c2VHUFUiLCJwcm9jZXNzb3IiLCJQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyR1BVIiwiUGFydGljbGVTeXN0ZW1SZW5kZXJlckNQVSIsIm9uSW5pdCIsImRldGFjaEZyb21TY2VuZSIsImNsZWFyIiwib25FbmFibGUiLCJiaW5kTW9kdWxlIiwiX3JlbmRlck1vZGUiLCJ2YWwiLCJ1cGRhdGVSZW5kZXJNb2RlIiwiX3ZlbG9jaXR5U2NhbGUiLCJ1cGRhdGVNYXRlcmlhbFBhcmFtcyIsIl9sZW5ndGhTY2FsZSIsIl9tZXNoIiwic2V0VmVydGV4QXR0cmlidXRlcyIsImdldE1hdGVyaWFsIiwic2V0TWF0ZXJpYWwiLCJfbWFpblRleHR1cmUiLCJfc3dpdGNoUHJvY2Vzc29yIiwic2VyaWFsaXphYmxlIiwiQmlsbGJvYXJkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLFdBQVNBLG9CQUFULEdBQWlDO0FBQzdCLFFBQU1DLE1BQWlCLEdBQUdDLG1CQUFTQyxJQUFULENBQWVGLE1BQXpDOztBQUNBLFFBQUlBLE1BQU0sQ0FBQ0cscUJBQVAsSUFBZ0MsQ0FBaEMsSUFBcUNILE1BQU0sQ0FBQ0ksVUFBUCxDQUFrQkMsbUJBQVdDLGFBQTdCLENB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QzRCLEk7OzBsQkFtRDVCQSxvQjs7Ozs7YUFDd0MsSTs7OEVBVXhDQSxvQjs7Ozs7YUFDMEIsSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGVyaWFsLCBNZXNoLCBUZXh0dXJlMkQgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cyc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUmVuZGVyTW9kZX0gZnJvbSAnLi4vZW51bSc7XHJcbmltcG9ydCBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyQ1BVIGZyb20gJy4vcGFydGljbGUtc3lzdGVtLXJlbmRlcmVyLWNwdSc7XHJcbmltcG9ydCBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyR1BVIGZyb20gJy4vcGFydGljbGUtc3lzdGVtLXJlbmRlcmVyLWdwdSc7XHJcbmltcG9ydCB7IGRpcmVjdG9yIH0gZnJvbSAnLi4vLi4vY29yZS9kaXJlY3Rvcic7XHJcbmltcG9ydCB7IEdGWERldmljZSwgR0ZYRmVhdHVyZSB9IGZyb20gJy4uLy4uL2NvcmUvZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5mdW5jdGlvbiBpc1N1cHBvcnRHUFVQYXJ0aWNsZSAoKSB7XHJcbiAgICBjb25zdCBkZXZpY2U6IEdGWERldmljZSA9IGRpcmVjdG9yLnJvb3QhLmRldmljZTtcclxuICAgIGlmIChkZXZpY2UubWF4VmVydGV4VGV4dHVyZVVuaXRzID49IDggJiYgZGV2aWNlLmhhc0ZlYXR1cmUoR0ZYRmVhdHVyZS5URVhUVVJFX0ZMT0FUKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGxlZ2FjeUNDLndhcm4oJ01heWJlIHRoZSBkZXZpY2UgaGFzIHJlc3RyaWN0aW9ucyBvbiB2ZXJ0ZXggdGV4dHVyZXMgb3IgZG9lcyBub3Qgc3VwcG9ydCBmbG9hdCB0ZXh0dXJlcy4nKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuQGNjY2xhc3MoJ2NjLlBhcnRpY2xlU3lzdGVtUmVuZGVyZXInKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyIHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuvuWumueykuWtkOeUn+aIkOaooeW8j+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShSZW5kZXJNb2RlKVxyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgQHRvb2x0aXAoJ+iuvuWumueykuWtkOeUn+aIkOaooeW8jycpXHJcbiAgICBwdWJsaWMgZ2V0IHJlbmRlck1vZGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJNb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcmVuZGVyTW9kZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlck1vZGUgPT09IHZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3JlbmRlck1vZGUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ucHJvY2Vzc29yLnVwZGF0ZVJlbmRlck1vZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlnKjnspLlrZDnlJ/miJDmlrnlvI/kuLogU3RyZWN0aGVkQmlsbGJvYXJkIOaXtizlr7nnspLlrZDlnKjov5DliqjmlrnlkJHkuIrmjInpgJ/luqblpKflsI/ov5vooYzmi4nkvLjjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ+WcqOeykuWtkOeUn+aIkOaWueW8j+S4uiBTdHJlY3RoZWRCaWxsYm9hcmQg5pe2LOWvueeykuWtkOWcqOi/kOWKqOaWueWQkeS4iuaMiemAn+W6puWkp+Wwj+i/m+ihjOaLieS8uCcpXHJcbiAgICBwdWJsaWMgZ2V0IHZlbG9jaXR5U2NhbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZWxvY2l0eVNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdmVsb2NpdHlTY2FsZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fdmVsb2NpdHlTY2FsZSA9IHZhbDtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5wcm9jZXNzb3IudXBkYXRlTWF0ZXJpYWxQYXJhbXMoKTtcclxuICAgICAgICAvLyB0aGlzLl91cGRhdGVNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOeykuWtkOeUn+aIkOaWueW8j+S4uiBTdHJlY3RoZWRCaWxsYm9hcmQg5pe2LOWvueeykuWtkOWcqOi/kOWKqOaWueWQkeS4iuaMieeykuWtkOWkp+Wwj+i/m+ihjOaLieS8uOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDIpXHJcbiAgICBAdG9vbHRpcCgn5Zyo57KS5a2Q55Sf5oiQ5pa55byP5Li6IFN0cmVjdGhlZEJpbGxib2FyZCDml7Ys5a+557KS5a2Q5Zyo6L+Q5Yqo5pa55ZCR5LiK5oyJ57KS5a2Q5aSn5bCP6L+b6KGM5ouJ5Ly4JylcclxuICAgIHB1YmxpYyBnZXQgbGVuZ3RoU2NhbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sZW5ndGhTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGxlbmd0aFNjYWxlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9sZW5ndGhTY2FsZSA9IHZhbDtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5wcm9jZXNzb3IudXBkYXRlTWF0ZXJpYWxQYXJhbXMoKTtcclxuICAgICAgICAvLyB0aGlzLl91cGRhdGVNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIEB0eXBlKFJlbmRlck1vZGUpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9yZW5kZXJNb2RlID0gUmVuZGVyTW9kZS5CaWxsYm9hcmQ7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfdmVsb2NpdHlTY2FsZSA9IDE7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfbGVuZ3RoU2NhbGUgPSAxO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX21lc2g6IE1lc2ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDlj5HlsITnmoTmqKHlnovjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTWVzaClcclxuICAgIEBkaXNwbGF5T3JkZXIoNylcclxuICAgIEB0b29sdGlwKCfnspLlrZDlj5HlsITnmoTmqKHlnosnKVxyXG4gICAgcHVibGljIGdldCBtZXNoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWVzaDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG1lc2ggKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX21lc2ggPSB2YWw7XHJcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ucHJvY2Vzc29yLnNldFZlcnRleEF0dHJpYnV0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDkvb/nlKjnmoTmnZDotKjjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTWF0ZXJpYWwpXHJcbiAgICBAZGlzcGxheU9yZGVyKDgpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5L2/55So55qE5p2Q6LSoJylcclxuICAgIHB1YmxpYyBnZXQgcGFydGljbGVNYXRlcmlhbCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRpY2xlU3lzdGVtLmdldE1hdGVyaWFsKDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcGFydGljbGVNYXRlcmlhbCAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0uc2V0TWF0ZXJpYWwodmFsLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmi5blsL7kvb/nlKjnmoTmnZDotKjjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTWF0ZXJpYWwpXHJcbiAgICBAZGlzcGxheU9yZGVyKDkpXHJcbiAgICBAdG9vbHRpcCgn5ouW5bC+5L2/55So55qE5p2Q6LSoJylcclxuICAgIHB1YmxpYyBnZXQgdHJhaWxNYXRlcmlhbCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRpY2xlU3lzdGVtLmdldE1hdGVyaWFsKDEpITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRyYWlsTWF0ZXJpYWwgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnNldE1hdGVyaWFsKHZhbCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfbWFpblRleHR1cmU6IFRleHR1cmUyRCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgbWFpblRleHR1cmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYWluVGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG1haW5UZXh0dXJlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9tYWluVGV4dHVyZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF91c2VHUFU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBAZGlzcGxheU9yZGVyKDEwKVxyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuWQr+eUqEdQVeeykuWtkCcpXHJcbiAgICBwdWJsaWMgZ2V0IHVzZUdQVSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZUdQVTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHVzZUdQVSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3VzZUdQVSA9PT0gdmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNTdXBwb3J0R1BVUGFydGljbGUoKSkge1xyXG4gICAgICAgICAgICB0aGlzLl91c2VHUFUgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl91c2VHUFUgPSB2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zd2l0Y2hQcm9jZXNzb3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wYXJ0aWNsZVN5c3RlbTogYW55ID0gbnVsbCE7IC8vIFBhcnRpY2xlU3lzdGVtXHJcblxyXG4gICAgb25Jbml0IChwczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0gPSBwcztcclxuICAgICAgICBjb25zdCB1c2VHUFUgPSB0aGlzLl91c2VHUFUgJiYgaXNTdXBwb3J0R1BVUGFydGljbGUoKTtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5wcm9jZXNzb3IgPSB1c2VHUFUgPyBuZXcgUGFydGljbGVTeXN0ZW1SZW5kZXJlckdQVSh0aGlzKSA6IG5ldyBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyQ1BVKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnByb2Nlc3Nvci5vbkluaXQocHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3N3aXRjaFByb2Nlc3NvciAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnByb2Nlc3Nvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5wcm9jZXNzb3IuZGV0YWNoRnJvbVNjZW5lKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlU3lzdGVtLnByb2Nlc3Nvci5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5wcm9jZXNzb3IgPSBudWxsITtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ucHJvY2Vzc29yID0gdGhpcy5fdXNlR1BVID8gbmV3IFBhcnRpY2xlU3lzdGVtUmVuZGVyZXJHUFUodGhpcykgOiBuZXcgUGFydGljbGVTeXN0ZW1SZW5kZXJlckNQVSh0aGlzKTtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5wcm9jZXNzb3Iub25Jbml0KHRoaXMuX3BhcnRpY2xlU3lzdGVtKTtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5wcm9jZXNzb3Iub25FbmFibGUoKTtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5iaW5kTW9kdWxlKCk7XHJcbiAgICB9XHJcbn1cclxuIl19