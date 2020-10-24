(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../3d/builtin/init.js", "../../assets/texture-base.js", "../../data/decorators/index.js", "../../gfx/define.js", "../../renderer/core/pass.js", "../../renderer/core/pass-utils.js", "../../renderer/core/sampler-lib.js", "../../platform/debug.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../3d/builtin/init.js"), require("../../assets/texture-base.js"), require("../../data/decorators/index.js"), require("../../gfx/define.js"), require("../../renderer/core/pass.js"), require("../../renderer/core/pass-utils.js"), require("../../renderer/core/sampler-lib.js"), require("../../platform/debug.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.init, global.textureBase, global.index, global.define, global.pass, global.passUtils, global.samplerLib, global.debug, global.globalExports);
    global.uniform = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _init, _textureBase, _index, _define, _pass, _passUtils, _samplerLib, _debug, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UniformProxyFactory = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * Value proxy factory for setting uniform on material target.
   * @zh
   * 用于设置材质目标上指定 Uniform 的曲线值代理工厂。
   */
  var UniformProxyFactory = (_dec = (0, _index.ccclass)('cc.animation.UniformProxyFactory'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    /**
     * @en Pass index.
     * @zh Pass 索引。
     */

    /**
     * @en Uniform name.
     * @zh Uniform 名称。
     */

    /**
     * @en
     * Specify the aimed channel of the uniform.
     * Use this when you're aiming at a single channel of the uniform instead of who uniform.
     * For example, only green(1) channel of a color uniform.
     * @zh
     * 指定目标 Uniform 的通道。
     * 当你希望设置 Uniform 单独的通道而非整个 Uniform 时应该当使用此字段。
     * 例如，仅设置颜色 Uniform 的红色通道。
     */
    function UniformProxyFactory(uniformName, passIndex) {
      _classCallCheck(this, UniformProxyFactory);

      _initializerDefineProperty(this, "passIndex", _descriptor, this);

      _initializerDefineProperty(this, "uniformName", _descriptor2, this);

      _initializerDefineProperty(this, "channelIndex", _descriptor3, this);

      this.passIndex = passIndex || 0;
      this.uniformName = uniformName || '';
    }

    _createClass(UniformProxyFactory, [{
      key: "forTarget",
      value: function forTarget(target) {
        var pass = target.passes[this.passIndex];
        var handle = pass.getHandle(this.uniformName);

        if (!handle) {
          throw new Error("Material \"".concat(target.name, "\" has no uniform \"").concat(this.uniformName, "\""));
        }

        var propertyType = _pass.Pass.getPropertyTypeFromHandle(handle);

        if (propertyType === _passUtils.PropertyType.UBO) {
          var realHandle = this.channelIndex === undefined ? handle : pass.getHandle(this.uniformName, this.channelIndex, _define.GFXType.FLOAT);

          if (!realHandle) {
            throw new Error("Uniform \"".concat(this.uniformName, " (in material ").concat(target.name, ") has no channel ").concat(this.channelIndex, "\""));
          }

          if (isUniformArray(pass, this.uniformName)) {
            return {
              set: function set(value) {
                pass.setUniformArray(realHandle, value);
              }
            };
          } else {
            return {
              set: function set(value) {
                pass.setUniform(realHandle, value);
              }
            };
          }
        } else if (propertyType === _passUtils.PropertyType.SAMPLER) {
          var binding = _pass.Pass.getBindingFromHandle(handle);

          var prop = pass.properties[this.uniformName];
          var texName = prop && prop.value ? prop.value + '-texture' : (0, _passUtils.getDefaultFromType)(prop.type);

          var dftTex = _init.builtinResMgr.get(texName);

          if (!dftTex) {
            (0, _debug.warn)("Illegal texture default value: ".concat(texName, "."));
            dftTex = _init.builtinResMgr.get('default-texture');
          }

          return {
            set: function set(value) {
              if (!value) {
                value = dftTex;
              }

              var texture = value.getGFXTexture();

              if (!texture || !texture.width || !texture.height) {
                return;
              }

              pass.bindTexture(binding, texture);

              if (value instanceof _textureBase.TextureBase) {
                pass.bindSampler(binding, _samplerLib.samplerLib.getSampler(_globalExports.legacyCC.game._gfxDevice, value.getSamplerHash()));
              }
            }
          };
        } else {
          throw new Error("Animations are not available for uniforms with property type ".concat(propertyType, "."));
        }
      }
    }]);

    return UniformProxyFactory;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "passIndex", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "uniformName", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "channelIndex", [_index.float], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return undefined;
    }
  })), _class2)) || _class);
  _exports.UniformProxyFactory = UniformProxyFactory;

  function isUniformArray(pass, name) {
    var _iterator = _createForOfIteratorHelper(pass.shaderInfo.blocks),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var block = _step.value;

        var _iterator2 = _createForOfIteratorHelper(block.members),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var uniform = _step2.value;

            if (uniform.name === name) {
              return uniform.count > 1;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return false;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3ZhbHVlLXByb3h5LWZhY3Rvcmllcy91bmlmb3JtLnRzIl0sIm5hbWVzIjpbIlVuaWZvcm1Qcm94eUZhY3RvcnkiLCJ1bmlmb3JtTmFtZSIsInBhc3NJbmRleCIsInRhcmdldCIsInBhc3MiLCJwYXNzZXMiLCJoYW5kbGUiLCJnZXRIYW5kbGUiLCJFcnJvciIsIm5hbWUiLCJwcm9wZXJ0eVR5cGUiLCJQYXNzIiwiZ2V0UHJvcGVydHlUeXBlRnJvbUhhbmRsZSIsIlByb3BlcnR5VHlwZSIsIlVCTyIsInJlYWxIYW5kbGUiLCJjaGFubmVsSW5kZXgiLCJ1bmRlZmluZWQiLCJHRlhUeXBlIiwiRkxPQVQiLCJpc1VuaWZvcm1BcnJheSIsInNldCIsInZhbHVlIiwic2V0VW5pZm9ybUFycmF5Iiwic2V0VW5pZm9ybSIsIlNBTVBMRVIiLCJiaW5kaW5nIiwiZ2V0QmluZGluZ0Zyb21IYW5kbGUiLCJwcm9wIiwicHJvcGVydGllcyIsInRleE5hbWUiLCJ0eXBlIiwiZGZ0VGV4IiwiYnVpbHRpblJlc01nciIsImdldCIsInRleHR1cmUiLCJnZXRHRlhUZXh0dXJlIiwid2lkdGgiLCJoZWlnaHQiLCJiaW5kVGV4dHVyZSIsIlRleHR1cmVCYXNlIiwiYmluZFNhbXBsZXIiLCJzYW1wbGVyTGliIiwiZ2V0U2FtcGxlciIsImxlZ2FjeUNDIiwiZ2FtZSIsIl9nZnhEZXZpY2UiLCJnZXRTYW1wbGVySGFzaCIsInNlcmlhbGl6YWJsZSIsImZsb2F0Iiwic2hhZGVySW5mbyIsImJsb2NrcyIsImJsb2NrIiwibWVtYmVycyIsInVuaWZvcm0iLCJjb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQTs7Ozs7O01BT2FBLG1CLFdBRFosb0JBQVEsa0NBQVIsQztBQUVHOzs7OztBQU9BOzs7OztBQU9BOzs7Ozs7Ozs7O0FBYUEsaUNB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bUMsV0FBTCxDQUFpQmIsT0FBakIsRUFBMEJTLE9BQTFCOztBQUNBLGtCQUFJYixLQUFLLFlBQVlrQix3QkFBckIsRUFBa0M7QUFDOUJwQyxnQkFBQUEsSUFBSSxDQUFDcUMsV0FBTCxDQUFpQmYsT0FBakIsRUFBMEJnQix1QkFBV0MsVUFBWCxDQUFzQkMsd0JBQVNDLElBQVQsQ0FBY0MsVUFBcEMsRUFBZ0R4QixLQUFLLENBQUN5QixjQUFOLEVBQWhELENBQTFCO0FBQ0g7QUFDSjtBQVRFLFdBQVA7QUFXSCxTQXBCTSxNQW9CQTtBQUNILGdCQUFNLElBQUl2QyxLQUFKLHdFQUEwRUUsWUFBMUUsT0FBTjtBQUNIO0FBQ0o7Ozs7eUZBNUVBc0MsbUI7Ozs7O2FBQzBCLEM7O2tGQU0xQkEsbUI7Ozs7O2FBQzRCLEU7O21GQVk1QkMsWTs7Ozs7YUFDeUNoQyxTOzs7OztBQTBEOUMsV0FBU0csY0FBVCxDQUF5QmhCLElBQXpCLEVBQXFDSyxJQUFyQyxFQUFtRDtBQUFBLCtDQUMzQkwsSUFBSSxDQUFDOEMsVUFBTCxDQUFnQkMsTUFEVztBQUFBOztBQUFBO0FBQy9DLDBEQUE0QztBQUFBLFlBQWpDQyxLQUFpQzs7QUFBQSxvREFDbEJBLEtBQUssQ0FBQ0MsT0FEWTtBQUFBOztBQUFBO0FBQ3hDLGlFQUFxQztBQUFBLGdCQUExQkMsT0FBMEI7O0FBQ2pDLGdCQUFJQSxPQUFPLENBQUM3QyxJQUFSLEtBQWlCQSxJQUFyQixFQUEyQjtBQUN2QixxQkFBTzZDLE9BQU8sQ0FBQ0MsS0FBUixHQUFnQixDQUF2QjtBQUNIO0FBQ0o7QUFMdUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU0zQztBQVA4QztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVEvQyxXQUFPLEtBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgYnVpbHRpblJlc01nciB9IGZyb20gJy4uLy4uLzNkL2J1aWx0aW4vaW5pdCc7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgU3ByaXRlRnJhbWUgfSBmcm9tICcuLi8uLi9hc3NldHMvc3ByaXRlLWZyYW1lJztcclxuaW1wb3J0IHsgVGV4dHVyZUJhc2UgfSBmcm9tICcuLi8uLi9hc3NldHMvdGV4dHVyZS1iYXNlJztcclxuaW1wb3J0IHsgY2NjbGFzcywgZmxvYXQsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IEdGWFR5cGUgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgUGFzcyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvcGFzcyc7XHJcbmltcG9ydCB7IGdldERlZmF1bHRGcm9tVHlwZSwgUHJvcGVydHlUeXBlIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9wYXNzLXV0aWxzJztcclxuaW1wb3J0IHsgc2FtcGxlckxpYiB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvc2FtcGxlci1saWInO1xyXG5pbXBvcnQgeyBJVmFsdWVQcm94eSwgSVZhbHVlUHJveHlGYWN0b3J5IH0gZnJvbSAnLi4vdmFsdWUtcHJveHknO1xyXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi4vLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVmFsdWUgcHJveHkgZmFjdG9yeSBmb3Igc2V0dGluZyB1bmlmb3JtIG9uIG1hdGVyaWFsIHRhcmdldC5cclxuICogQHpoXHJcbiAqIOeUqOS6juiuvue9ruadkOi0qOebruagh+S4iuaMh+WumiBVbmlmb3JtIOeahOabsue6v+WAvOS7o+eQhuW3peWOguOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLmFuaW1hdGlvbi5Vbmlmb3JtUHJveHlGYWN0b3J5JylcclxuZXhwb3J0IGNsYXNzIFVuaWZvcm1Qcm94eUZhY3RvcnkgaW1wbGVtZW50cyBJVmFsdWVQcm94eUZhY3Rvcnkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGFzcyBpbmRleC5cclxuICAgICAqIEB6aCBQYXNzIOe0ouW8leOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgcGFzc0luZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFVuaWZvcm0gbmFtZS5cclxuICAgICAqIEB6aCBVbmlmb3JtIOWQjeensOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgdW5pZm9ybU5hbWU6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTcGVjaWZ5IHRoZSBhaW1lZCBjaGFubmVsIG9mIHRoZSB1bmlmb3JtLlxyXG4gICAgICogVXNlIHRoaXMgd2hlbiB5b3UncmUgYWltaW5nIGF0IGEgc2luZ2xlIGNoYW5uZWwgb2YgdGhlIHVuaWZvcm0gaW5zdGVhZCBvZiB3aG8gdW5pZm9ybS5cclxuICAgICAqIEZvciBleGFtcGxlLCBvbmx5IGdyZWVuKDEpIGNoYW5uZWwgb2YgYSBjb2xvciB1bmlmb3JtLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmjIflrprnm67moIcgVW5pZm9ybSDnmoTpgJrpgZPjgIJcclxuICAgICAqIOW9k+S9oOW4jOacm+iuvue9riBVbmlmb3JtIOWNleeLrOeahOmAmumBk+iAjOmdnuaVtOS4qiBVbmlmb3JtIOaXtuW6lOivpeW9k+S9v+eUqOatpOWtl+auteOAglxyXG4gICAgICog5L6L5aaC77yM5LuF6K6+572u6aKc6ImyIFVuaWZvcm0g55qE57qi6Imy6YCa6YGT44CCXHJcbiAgICAgKi9cclxuICAgIEBmbG9hdFxyXG4gICAgcHVibGljIGNoYW5uZWxJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh1bmlmb3JtTmFtZT86IHN0cmluZywgcGFzc0luZGV4PzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wYXNzSW5kZXggPSBwYXNzSW5kZXggfHwgMDtcclxuICAgICAgICB0aGlzLnVuaWZvcm1OYW1lID0gdW5pZm9ybU5hbWUgfHwgJyc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZvclRhcmdldCAodGFyZ2V0OiBNYXRlcmlhbCk6IElWYWx1ZVByb3h5IHtcclxuICAgICAgICBjb25zdCBwYXNzID0gdGFyZ2V0LnBhc3Nlc1t0aGlzLnBhc3NJbmRleF07XHJcbiAgICAgICAgY29uc3QgaGFuZGxlID0gcGFzcy5nZXRIYW5kbGUodGhpcy51bmlmb3JtTmFtZSk7XHJcbiAgICAgICAgaWYgKCFoYW5kbGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXRlcmlhbCBcIiR7dGFyZ2V0Lm5hbWV9XCIgaGFzIG5vIHVuaWZvcm0gXCIke3RoaXMudW5pZm9ybU5hbWV9XCJgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcHJvcGVydHlUeXBlID0gUGFzcy5nZXRQcm9wZXJ0eVR5cGVGcm9tSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5VHlwZSA9PT0gUHJvcGVydHlUeXBlLlVCTykge1xyXG4gICAgICAgICAgICBjb25zdCByZWFsSGFuZGxlID0gdGhpcy5jaGFubmVsSW5kZXggPT09IHVuZGVmaW5lZCA/IGhhbmRsZSA6IHBhc3MuZ2V0SGFuZGxlKHRoaXMudW5pZm9ybU5hbWUsIHRoaXMuY2hhbm5lbEluZGV4LCBHRlhUeXBlLkZMT0FUKTtcclxuICAgICAgICAgICAgaWYgKCFyZWFsSGFuZGxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuaWZvcm0gXCIke3RoaXMudW5pZm9ybU5hbWV9IChpbiBtYXRlcmlhbCAke3RhcmdldC5uYW1lfSkgaGFzIG5vIGNoYW5uZWwgJHt0aGlzLmNoYW5uZWxJbmRleH1cImApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc1VuaWZvcm1BcnJheShwYXNzLCB0aGlzLnVuaWZvcm1OYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3Muc2V0VW5pZm9ybUFycmF5KHJlYWxIYW5kbGUsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0OiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzLnNldFVuaWZvcm0ocmVhbEhhbmRsZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eVR5cGUgPT09IFByb3BlcnR5VHlwZS5TQU1QTEVSKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpbmRpbmcgPSBQYXNzLmdldEJpbmRpbmdGcm9tSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3AgPSBwYXNzLnByb3BlcnRpZXNbdGhpcy51bmlmb3JtTmFtZV07XHJcbiAgICAgICAgICAgIGNvbnN0IHRleE5hbWUgPSBwcm9wICYmIHByb3AudmFsdWUgPyBwcm9wLnZhbHVlICsgJy10ZXh0dXJlJyA6IGdldERlZmF1bHRGcm9tVHlwZShwcm9wLnR5cGUpIGFzIHN0cmluZztcclxuICAgICAgICAgICAgbGV0IGRmdFRleCA9IGJ1aWx0aW5SZXNNZ3IuZ2V0PFRleHR1cmVCYXNlPih0ZXhOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFkZnRUZXgpIHtcclxuICAgICAgICAgICAgICAgIHdhcm4oYElsbGVnYWwgdGV4dHVyZSBkZWZhdWx0IHZhbHVlOiAke3RleE5hbWV9LmApO1xyXG4gICAgICAgICAgICAgICAgZGZ0VGV4ID0gYnVpbHRpblJlc01nci5nZXQ8VGV4dHVyZUJhc2U+KCdkZWZhdWx0LXRleHR1cmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2V0OiAodmFsdWU6IFRleHR1cmVCYXNlIHwgU3ByaXRlRnJhbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7IHZhbHVlID0gZGZ0VGV4OyB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dHVyZSA9IHZhbHVlLmdldEdGWFRleHR1cmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRleHR1cmUgfHwgIXRleHR1cmUud2lkdGggfHwgIXRleHR1cmUuaGVpZ2h0KSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhc3MuYmluZFRleHR1cmUoYmluZGluZywgdGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgVGV4dHVyZUJhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzcy5iaW5kU2FtcGxlcihiaW5kaW5nLCBzYW1wbGVyTGliLmdldFNhbXBsZXIobGVnYWN5Q0MuZ2FtZS5fZ2Z4RGV2aWNlLCB2YWx1ZS5nZXRTYW1wbGVySGFzaCgpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFuaW1hdGlvbnMgYXJlIG5vdCBhdmFpbGFibGUgZm9yIHVuaWZvcm1zIHdpdGggcHJvcGVydHkgdHlwZSAke3Byb3BlcnR5VHlwZX0uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1VuaWZvcm1BcnJheSAocGFzczogUGFzcywgbmFtZTogc3RyaW5nKSB7XHJcbiAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHBhc3Muc2hhZGVySW5mby5ibG9ja3MpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHVuaWZvcm0gb2YgYmxvY2subWVtYmVycykge1xyXG4gICAgICAgICAgICBpZiAodW5pZm9ybS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5pZm9ybS5jb3VudCA+IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuIl19