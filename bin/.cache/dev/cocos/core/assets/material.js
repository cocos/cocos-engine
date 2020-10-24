(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../3d/builtin/init.js", "../gfx/texture.js", "../renderer/core/pass-utils.js", "../renderer/core/pass.js", "../global-exports.js", "./asset.js", "./effect-asset.js", "./sprite-frame.js", "./texture-base.js", "./render-texture.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../3d/builtin/init.js"), require("../gfx/texture.js"), require("../renderer/core/pass-utils.js"), require("../renderer/core/pass.js"), require("../global-exports.js"), require("./asset.js"), require("./effect-asset.js"), require("./sprite-frame.js"), require("./texture-base.js"), require("./render-texture.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.init, global.texture, global.passUtils, global.pass, global.globalExports, global.asset, global.effectAsset, global.spriteFrame, global.textureBase, global.renderTexture);
    global.material = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _init, _texture, _passUtils, _pass2, _globalExports, _asset, _effectAsset, _spriteFrame, _textureBase, _renderTexture) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Material = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * The material asset, specifies in details how a model is drawn on screen.
   * @zh
   * 材质资源类，包含模型绘制方式的全部细节描述。
   */
  var Material = (_dec = (0, _index.ccclass)('cc.Material'), _dec2 = (0, _index.type)(_effectAsset.EffectAsset), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(Material, _Asset);

    _createClass(Material, [{
      key: "effectAsset",

      /**
       * @en The current [[EffectAsset]].
       * @zh 当前使用的 [[EffectAsset]] 资源。
       */
      get: function get() {
        return this._effectAsset;
      }
      /**
       * @en Name of the current [[EffectAsset]].
       * @zh 当前使用的 [[EffectAsset]] 资源名。
       */

    }, {
      key: "effectName",
      get: function get() {
        return this._effectAsset ? this._effectAsset.name : '';
      }
      /**
       * @en The current technique index.
       * @zh 当前的 technique 索引。
       */

    }, {
      key: "technique",
      get: function get() {
        return this._techIdx;
      }
      /**
       * @en The passes defined in this material.
       * @zh 当前正在使用的 pass 数组。
       */

    }, {
      key: "passes",
      get: function get() {
        return this._passes;
      }
      /**
       * @en The hash value of this material.
       * @zh 材质的 hash。
       */

    }, {
      key: "hash",
      get: function get() {
        return this._hash;
      }
    }, {
      key: "parent",
      get: function get() {
        return null;
      }
    }, {
      key: "owner",
      get: function get() {
        return null;
      }
    }], [{
      key: "getHash",
      value: function getHash(material) {
        var hash = 0;

        var _iterator = _createForOfIteratorHelper(material.passes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var pass = _step.value;
            hash ^= pass.hash;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return hash;
      }
    }]);

    function Material() {
      var _this;

      _classCallCheck(this, Material);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Material).call(this));

      _initializerDefineProperty(_this, "_effectAsset", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_techIdx", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_defines", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_states", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_props", _descriptor5, _assertThisInitialized(_this));

      _this._passes = [];
      _this._hash = 0;
      _this.loaded = false;
      return _this;
    }
    /**
     * @en Initialize this material with the given information.
     * @zh 根据所给信息初始化这个材质，初始化正常结束后材质即可立即用于渲染。
     * @param info Material description info.
     */


    _createClass(Material, [{
      key: "initialize",
      value: function initialize(info) {
        if (!this._defines) {
          this._defines = [];
        }

        if (!this._states) {
          this._states = [];
        }

        if (!this._props) {
          this._props = [];
        }

        if (info.technique !== undefined) {
          this._techIdx = info.technique;
        }

        if (info.effectAsset) {
          this._effectAsset = info.effectAsset;
        } else if (info.effectName) {
          this._effectAsset = _effectAsset.EffectAsset.get(info.effectName);
        }

        if (info.defines) {
          this._prepareInfo(info.defines, this._defines);
        }

        if (info.states) {
          this._prepareInfo(info.states, this._states);
        }

        this._update();
      }
    }, {
      key: "reset",
      value: function reset(info) {
        // to be consistent with other assets
        this.initialize(info);
      }
      /**
       * @en
       * Destroy the material definitively.<br>
       * Cannot re-initialize after destroy.<br>
       * For re-initialize purposes, call [[Material.initialize]] directly.
       * @zh
       * 彻底销毁材质，注意销毁后无法重新初始化。<br>
       * 如需重新初始化材质，不必先调用 destroy。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this._doDestroy();

        return _get(_getPrototypeOf(Material.prototype), "destroy", this).call(this);
      }
      /**
       * @en Recompile the shader with the specified macro overrides. Allowed only on material instances.
       * @zh 使用指定预处理宏重新编译当前 pass（数组）中的 shader。只允许对材质实例执行。
       * @param overrides The shader macro override values.
       * @param passIdx The pass to apply to. Will apply to all passes if not specified.
       */

    }, {
      key: "recompileShaders",
      value: function recompileShaders(overrides, passIdx) {
        console.warn('Shaders in material asset \'' + this.name + '\' cannot be modified at runtime, please instantiate the material first.');
      }
      /**
       * @en Override the passes with the specified pipeline states. Allowed only on material instances.
       * @zh 使用指定管线状态重载当前的 pass（数组）。只允许对材质实例执行。
       * @param overrides The pipeline state override values.
       * @param passIdx The pass to apply to. Will apply to all passes if not specified.
       */

    }, {
      key: "overridePipelineStates",
      value: function overridePipelineStates(overrides, passIdx) {
        console.warn('Pipeline states in material asset \'' + this.name + '\' cannot be modified at runtime, please instantiate the material first.');
      }
      /**
       * @en Callback function after material is loaded in [[Loader]]. Initialize the resources automatically.
       * @zh 通过 [[Loader]] 加载完成时的回调，将自动初始化材质资源。
       */

    }, {
      key: "onLoaded",
      value: function onLoaded() {
        this._update();

        this.loaded = true;
        this.emit('load');
      }
      /**
       * @en Reset all the uniforms to the default value specified in [[EffectAsset]].
       * @zh 重置材质的所有 uniform 参数数据为 [[EffectAsset]] 中的默认初始值。
       * @param clearPasses Will the rendering data be cleared too?
       */

    }, {
      key: "resetUniforms",
      value: function resetUniforms() {
        var clearPasses = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this._props.length = this._passes.length;

        for (var i = 0; i < this._props.length; i++) {
          this._props[i] = {};
        }

        if (!clearPasses) {
          return;
        }

        var _iterator2 = _createForOfIteratorHelper(this._passes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var pass = _step2.value;
            pass.resetUBOs();
            pass.resetTextures();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      /**
       * @en
       * Convenient property setter provided for quick material setup.<br>
       * [[Pass.setUniform]] should be used instead if you need to do per-frame uniform update.
       * @zh
       * 设置材质 uniform 参数的统一入口。<br>
       * 注意如果需要每帧更新 uniform，建议使用 [[Pass.setUniform]] 以获得更好的性能。
       * @param name The target uniform name.
       * @param val The target value.
       * @param passIdx The pass to apply to. Will apply to all passes if not specified.
       */

    }, {
      key: "setProperty",
      value: function setProperty(name, val, passIdx) {
        var success = false;

        if (passIdx === undefined) {
          // try set property for all applicable passes
          var passes = this._passes;
          var len = passes.length;

          for (var i = 0; i < len; i++) {
            var pass = passes[i];

            if (this._uploadProperty(pass, name, val)) {
              this._props[pass.propertyIndex][name] = val;
              success = true;
            }
          }
        } else {
          if (passIdx >= this._passes.length) {
            console.warn("illegal pass index: ".concat(passIdx, "."));
            return;
          }

          var _pass = this._passes[passIdx];

          if (this._uploadProperty(_pass, name, val)) {
            this._props[_pass.propertyIndex][name] = val;
            success = true;
          }
        }

        if (!success) {
          console.warn("illegal property name: ".concat(name, "."));
          return;
        }
      }
      /**
       * @en
       * Get the specified uniform value for this material.<br>
       * Note that only uniforms set through [[Material.setProperty]] can be acquired here.<br>
       * For the complete rendering data, use [[Pass.getUniform]] instead.
       * @zh
       * 获取当前材质的指定 uniform 参数的值。<br>
       * 注意只有通过 [[Material.setProperty]] 函数设置的参数才能从此函数取出，<br>
       * 如需取出完整的渲染数据，请使用 [[Pass.getUniform]]。
       * @param name The property or uniform name.
       * @param passIdx The target pass index. If not specified, return the first found value in all passes.
       */

    }, {
      key: "getProperty",
      value: function getProperty(name, passIdx) {
        if (passIdx === undefined) {
          // try get property in all possible passes
          var propsArray = this._props;
          var len = propsArray.length;

          for (var i = 0; i < len; i++) {
            var props = propsArray[i];

            for (var p in props) {
              if (p === name) {
                return props[p];
              }
            }
          }
        } else {
          if (passIdx >= this._props.length) {
            console.warn("illegal pass index: ".concat(passIdx, "."));
            return null;
          }

          var _props = this._props[this._passes[passIdx].propertyIndex];

          for (var _p in _props) {
            if (_p === name) {
              return _props[_p];
            }
          }
        }

        return null;
      }
      /**
       * @en Copy the target material.
       * @zh 复制目标材质到当前实例。
       * @param mat The material to be copied.
       */

    }, {
      key: "copy",
      value: function copy(mat) {
        this._techIdx = mat._techIdx;
        this._props.length = mat._props.length;

        for (var i = 0; i < mat._props.length; i++) {
          this._props[i] = Object.assign({}, mat._props[i]);
        }

        this._defines.length = mat._defines.length;

        for (var _i = 0; _i < mat._defines.length; _i++) {
          this._defines[_i] = Object.assign({}, mat._defines[_i]);
        }

        this._states.length = mat._states.length;

        for (var _i2 = 0; _i2 < mat._states.length; _i2++) {
          this._states[_i2] = Object.assign({}, mat._states[_i2]);
        }

        this._effectAsset = mat._effectAsset;

        this._update();
      }
    }, {
      key: "_prepareInfo",
      value: function _prepareInfo(patch, cur) {
        if (!Array.isArray(patch)) {
          // fill all the passes if not specified
          var len = this._effectAsset ? this._effectAsset.techniques[this._techIdx].passes.length : 1;
          patch = Array(len).fill(patch);
        }

        for (var i = 0; i < patch.length; ++i) {
          Object.assign(cur[i] || (cur[i] = {}), patch[i]);
        }
      }
    }, {
      key: "_createPasses",
      value: function _createPasses() {
        var tech = this._effectAsset.techniques[this._techIdx || 0];

        if (!tech) {
          return [];
        }

        var passNum = tech.passes.length;
        var passes = [];

        for (var k = 0; k < passNum; ++k) {
          var passInfo = tech.passes[k];
          var propIdx = passInfo.passIndex = k;
          var defines = passInfo.defines = this._defines[propIdx] || (this._defines[propIdx] = {});
          var states = passInfo.stateOverrides = this._states[propIdx] || (this._states[propIdx] = {});

          if (passInfo.propertyIndex !== undefined) {
            Object.assign(defines, this._defines[passInfo.propertyIndex]);
            Object.assign(states, this._states[passInfo.propertyIndex]);
          }

          if (passInfo.embeddedMacros !== undefined) {
            Object.assign(defines, passInfo.embeddedMacros);
          }

          if (passInfo["switch"] && !defines[passInfo["switch"]]) {
            continue;
          }

          var pass = new _pass2.Pass(_globalExports.legacyCC.director.root);
          pass.initialize(passInfo);
          passes.push(pass);
        }

        return passes;
      }
    }, {
      key: "_update",
      value: function _update() {
        var _this2 = this;

        var keepProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (this._effectAsset) {
          if (this._passes && this._passes.length) {
            var _iterator3 = _createForOfIteratorHelper(this._passes),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var pass = _step3.value;
                pass.destroy();
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }

          this._passes = this._createPasses(); // handle property values

          var totalPasses = this._effectAsset.techniques[this._techIdx].passes.length;
          this._props.length = totalPasses;

          if (keepProps) {
            this._passes.forEach(function (pass, i) {
              var props = _this2._props[i];

              if (!props) {
                props = _this2._props[i] = {};
              }

              props = _this2._props[pass.propertyIndex];

              for (var p in props) {
                _this2._uploadProperty(pass, p, props[p]);
              }
            });
          } else {
            for (var i = 0; i < this._props.length; i++) {
              this._props[i] = {};
            }
          }
        } else {
          // ugly yellow indicating missing effect
          var missing = _init.builtinResMgr.get('missing-effect-material');

          if (missing) {
            this._passes = missing._passes.slice();
          }
        }

        this._hash = Material.getHash(this);
      }
    }, {
      key: "_uploadProperty",
      value: function _uploadProperty(pass, name, val) {
        var handle = pass.getHandle(name);

        if (!handle) {
          return false;
        }

        var propertyType = _pass2.Pass.getPropertyTypeFromHandle(handle);

        if (propertyType === _passUtils.PropertyType.UBO) {
          if (Array.isArray(val)) {
            pass.setUniformArray(handle, val);
          } else if (val !== null) {
            pass.setUniform(handle, val);
          } else {
            pass.resetUniform(name);
          }
        } else if (propertyType === _passUtils.PropertyType.SAMPLER) {
          var binding = _pass2.Pass.getBindingFromHandle(handle);

          if (Array.isArray(val)) {
            for (var i = 0; i < val.length; i++) {
              this._bindTexture(pass, binding, val[i], i);
            }
          } else if (val) {
            this._bindTexture(pass, binding, val);
          } else {
            pass.resetTexture(name);
          }
        }

        return true;
      }
    }, {
      key: "_bindTexture",
      value: function _bindTexture(pass, binding, val, index) {
        if (val instanceof _texture.GFXTexture) {
          pass.bindTexture(binding, val, index);
        } else if (val instanceof _textureBase.TextureBase || val instanceof _spriteFrame.SpriteFrame || val instanceof _renderTexture.RenderTexture) {
          var texture = val.getGFXTexture();

          if (!texture || !texture.width || !texture.height) {
            // console.warn(`material '${this._uuid}' received incomplete texture asset '${val._uuid}'`);
            return false;
          }

          pass.bindTexture(binding, texture, index);
          pass.bindSampler(binding, val.getGFXSampler(), index);
        }
      }
    }, {
      key: "_doDestroy",
      value: function _doDestroy() {
        if (this._passes && this._passes.length) {
          var _iterator4 = _createForOfIteratorHelper(this._passes),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var pass = _step4.value;
              pass.destroy();
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
        }

        this._effectAsset = null;
        this._passes.length = 0;
        this._props.length = 0;
        this._defines.length = 0;
        this._states.length = 0;
      }
    }]);

    return Material;
  }(_asset.Asset), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_effectAsset", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_techIdx", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_defines", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_states", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_props", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.Material = Material;
  _globalExports.legacyCC.Material = Material;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL21hdGVyaWFsLnRzIl0sIm5hbWVzIjpbIk1hdGVyaWFsIiwiRWZmZWN0QXNzZXQiLCJfZWZmZWN0QXNzZXQiLCJuYW1lIiwiX3RlY2hJZHgiLCJfcGFzc2VzIiwiX2hhc2giLCJtYXRlcmlhbCIsImhhc2giLCJwYXNzZXMiLCJwYXNzIiwibG9hZGVkIiwiaW5mbyIsIl9kZWZpbmVzIiwiX3N0YXRlcyIsIl9wcm9wcyIsInRlY2huaXF1ZSIsInVuZGVmaW5lZCIsImVmZmVjdEFzc2V0IiwiZWZmZWN0TmFtZSIsImdldCIsImRlZmluZXMiLCJfcHJlcGFyZUluZm8iLCJzdGF0ZXMiLCJfdXBkYXRlIiwiaW5pdGlhbGl6ZSIsIl9kb0Rlc3Ryb3kiLCJvdmVycmlkZXMiLCJwYXNzSWR4IiwiY29uc29sZSIsIndhcm4iLCJlbWl0IiwiY2xlYXJQYXNzZXMiLCJsZW5ndGgiLCJpIiwicmVzZXRVQk9zIiwicmVzZXRUZXh0dXJlcyIsInZhbCIsInN1Y2Nlc3MiLCJsZW4iLCJfdXBsb2FkUHJvcGVydHkiLCJwcm9wZXJ0eUluZGV4IiwicHJvcHNBcnJheSIsInByb3BzIiwicCIsIm1hdCIsIk9iamVjdCIsImFzc2lnbiIsInBhdGNoIiwiY3VyIiwiQXJyYXkiLCJpc0FycmF5IiwidGVjaG5pcXVlcyIsImZpbGwiLCJ0ZWNoIiwicGFzc051bSIsImsiLCJwYXNzSW5mbyIsInByb3BJZHgiLCJwYXNzSW5kZXgiLCJzdGF0ZU92ZXJyaWRlcyIsImVtYmVkZGVkTWFjcm9zIiwiUGFzcyIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290IiwicHVzaCIsImtlZXBQcm9wcyIsImRlc3Ryb3kiLCJfY3JlYXRlUGFzc2VzIiwidG90YWxQYXNzZXMiLCJmb3JFYWNoIiwibWlzc2luZyIsImJ1aWx0aW5SZXNNZ3IiLCJzbGljZSIsImdldEhhc2giLCJoYW5kbGUiLCJnZXRIYW5kbGUiLCJwcm9wZXJ0eVR5cGUiLCJnZXRQcm9wZXJ0eVR5cGVGcm9tSGFuZGxlIiwiUHJvcGVydHlUeXBlIiwiVUJPIiwic2V0VW5pZm9ybUFycmF5Iiwic2V0VW5pZm9ybSIsInJlc2V0VW5pZm9ybSIsIlNBTVBMRVIiLCJiaW5kaW5nIiwiZ2V0QmluZGluZ0Zyb21IYW5kbGUiLCJfYmluZFRleHR1cmUiLCJyZXNldFRleHR1cmUiLCJpbmRleCIsIkdGWFRleHR1cmUiLCJiaW5kVGV4dHVyZSIsIlRleHR1cmVCYXNlIiwiU3ByaXRlRnJhbWUiLCJSZW5kZXJUZXh0dXJlIiwidGV4dHVyZSIsImdldEdGWFRleHR1cmUiLCJ3aWR0aCIsImhlaWdodCIsImJpbmRTYW1wbGVyIiwiZ2V0R0ZYU2FtcGxlciIsIkFzc2V0Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBGQTs7Ozs7O01BT2FBLFEsV0FEWixvQkFBUSxhQUFSLEMsVUFXSSxpQkFBS0Msd0JBQUwsQzs7Ozs7O0FBY0Q7Ozs7MEJBSW1CO0FBQ2YsZUFBTyxLQUFLQyxZQUFaO0FBQ0g7QUFFRDs7Ozs7OzswQkFJa0I7QUFDZCxlQUFPLEtBQUtBLFlBQUwsR0FBb0IsS0FBS0EsWUFBTCxDQUFrQkMsSUFBdEMsR0FBNkMsRUFBcEQ7QUFDSDtBQUVEOzs7Ozs7OzBCQUlpQjtBQUNiLGVBQU8sS0FBS0MsUUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSWM7QUFDVixlQUFPLEtBQUtDLE9BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlZO0FBQ1IsZUFBTyxLQUFLQyxLQUFaO0FBQ0g7OzswQkFFOEI7QUFDM0IsZUFBTyxJQUFQO0FBQ0g7OzswQkFFd0M7QUFDckMsZUFBTyxJQUFQO0FBQ0g7Ozs4QkFwRXNCQyxRLEVBQW9CO0FBQ3ZDLFlBQUlDLElBQUksR0FBRyxDQUFYOztBQUR1QyxtREFFcEJELFFBQVEsQ0FBQ0UsTUFGVztBQUFBOztBQUFBO0FBRXZDLDhEQUFvQztB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b250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiDmnZDotKjns7vnu5/nmoTnm7jlhbPlhoXlrrlcclxuICogQGNhdGVnb3J5IG1hdGVyaWFsXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgYnVpbHRpblJlc01nciB9IGZyb20gJy4uLzNkL2J1aWx0aW4vaW5pdCc7XHJcbmltcG9ydCB7IFJlbmRlcmFibGVDb21wb25lbnQgfSBmcm9tICcuLi8zZC9mcmFtZXdvcmsvcmVuZGVyYWJsZS1jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlIH0gZnJvbSAnLi4vZ2Z4L3RleHR1cmUnO1xyXG5pbXBvcnQgeyBNYWNyb1JlY29yZCwgTWF0ZXJpYWxQcm9wZXJ0eSwgUHJvcGVydHlUeXBlIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9wYXNzLXV0aWxzJztcclxuaW1wb3J0IHsgSVBhc3NJbmZvRnVsbCwgUGFzcywgUGFzc092ZXJyaWRlcyB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvcGFzcyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4vYXNzZXQnO1xyXG5pbXBvcnQgeyBFZmZlY3RBc3NldCB9IGZyb20gJy4vZWZmZWN0LWFzc2V0JztcclxuaW1wb3J0IHsgU3ByaXRlRnJhbWUgfSBmcm9tICcuL3Nwcml0ZS1mcmFtZSc7XHJcbmltcG9ydCB7IFRleHR1cmVCYXNlIH0gZnJvbSAnLi90ZXh0dXJlLWJhc2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJUZXh0dXJlIH0gZnJvbSAnLi9yZW5kZXItdGV4dHVyZSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBiYXNpYyBpbmZvcyBmb3IgbWF0ZXJpYWwgaW5pdGlhbGl6YXRpb24uXHJcbiAqIEB6aFxyXG4gKiDnlKjmnaXliJ3lp4vljJbmnZDotKjnmoTln7rmnKzkv6Hmga/jgIJcclxuICovXHJcbmludGVyZmFjZSBJTWF0ZXJpYWxJbmZvIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgRWZmZWN0QXNzZXQgdG8gdXNlLiBNdXN0IHByb3ZpZGUgaWYgYGVmZmVjdE5hbWVgIGlzIG5vdCBzcGVjaWZpZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi/meS4quadkOi0qOWwhuS9v+eUqOeahCBFZmZlY3RBc3NldO+8jOebtOaOpeaPkOS+m+i1hOa6kOW8leeUqO+8jOWSjCBgZWZmZWN0TmFtZWAg6Iez5bCR6KaB5oyH5a6a5LiA5Liq44CCXHJcbiAgICAgKi9cclxuICAgIGVmZmVjdEFzc2V0PzogRWZmZWN0QXNzZXQgfCBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBFZmZlY3RBc3NldCB0byB1c2UuIE11c3QgcHJvdmlkZSBpZiBgZWZmZWN0QXNzZXRgIGlzIG5vdCBzcGVjaWZpZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi/meS4quadkOi0qOWwhuS9v+eUqOeahCBFZmZlY3RBc3NldO+8jOmAmui/hyBlZmZlY3Qg5ZCN5oyH5a6a77yM5ZKMIGBlZmZlY3RBc3NldGAg6Iez5bCR6KaB5oyH5a6a5LiA5Liq44CCXHJcbiAgICAgKi9cclxuICAgIGVmZmVjdE5hbWU/OiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGluZGV4IG9mIHRoZSB0ZWNobmlxdWUgdG8gdXNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDov5nkuKrmnZDotKjlsIbkvb/nlKjnrKzlh6DkuKogdGVjaG5pcXVl77yM6buY6K6k5Li6IDDjgIJcclxuICAgICAqL1xyXG4gICAgdGVjaG5pcXVlPzogbnVtYmVyO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBzaGFkZXIgbWFjcm8gZGVmaW5pdGlvbnMuIERlZmF1bHQgdG8gMCBvciB0aGUgc3BlY2lmaWVkIHZhbHVlIGluIFtbRWZmZWN0QXNzZXRdXS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6L+Z5Liq5p2Q6LSo5a6a5LmJ55qE6aKE5aSE55CG5a6P77yM6buY6K6k5YWo5Li6IDDvvIzmiJYgW1tFZmZlY3RBc3NldF1dIOS4reeahOaMh+WumuWAvOOAglxyXG4gICAgICovXHJcbiAgICBkZWZpbmVzPzogTWFjcm9SZWNvcmQgfCBNYWNyb1JlY29yZFtdO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBvdmVycmlkZSB2YWx1ZXMgb24gdG9wIG9mIHRoZSBwaXBlbGluZSBzdGF0ZXMgc3BlY2lmaWVkIGluIFtbRWZmZWN0QXNzZXRdXS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6L+Z5Liq5p2Q6LSo55qE6Ieq5a6a5LmJ566h57q/54q25oCB77yM5bCG6KaG55uWIGVmZmVjdCDkuK3nmoTlsZ7mgKfjgII8YnI+XHJcbiAgICAgKiDms6jmhI/lnKjlj6/og73nmoTmg4XlhrXkuIvor7flsL3ph4/lsJHnmoToh6rlrprkuYnnrqHnur/nirbmgIHvvIzku6Xlh4/lsI/lr7nmuLLmn5PmlYjnjofnmoTlvbHlk43jgIJcclxuICAgICAqL1xyXG4gICAgc3RhdGVzPzogUGFzc092ZXJyaWRlcyB8IFBhc3NPdmVycmlkZXNbXTtcclxufVxyXG5cclxudHlwZSBNYXRlcmlhbFByb3BlcnR5RnVsbCA9IE1hdGVyaWFsUHJvcGVydHkgfCBUZXh0dXJlQmFzZSB8IFNwcml0ZUZyYW1lIHwgUmVuZGVyVGV4dHVyZSB8IEdGWFRleHR1cmUgfCBudWxsO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgbWF0ZXJpYWwgYXNzZXQsIHNwZWNpZmllcyBpbiBkZXRhaWxzIGhvdyBhIG1vZGVsIGlzIGRyYXduIG9uIHNjcmVlbi5cclxuICogQHpoXHJcbiAqIOadkOi0qOi1hOa6kOexu++8jOWMheWQq+aooeWei+e7mOWItuaWueW8j+eahOWFqOmDqOe7huiKguaPj+i/sOOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLk1hdGVyaWFsJylcclxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsIGV4dGVuZHMgQXNzZXQge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGFzaCAobWF0ZXJpYWw6IE1hdGVyaWFsKSB7XHJcbiAgICAgICAgbGV0IGhhc2ggPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgcGFzcyBvZiBtYXRlcmlhbC5wYXNzZXMpIHtcclxuICAgICAgICAgICAgaGFzaCBePSBwYXNzLmhhc2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoYXNoO1xyXG4gICAgfVxyXG5cclxuICAgIEB0eXBlKEVmZmVjdEFzc2V0KVxyXG4gICAgcHJvdGVjdGVkIF9lZmZlY3RBc3NldDogRWZmZWN0QXNzZXQgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdGVjaElkeCA9IDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2RlZmluZXM6IE1hY3JvUmVjb3JkW10gPSBbXTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfc3RhdGVzOiBQYXNzT3ZlcnJpZGVzW10gPSBbXTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcHJvcHM6IFJlY29yZDxzdHJpbmcsIE1hdGVyaWFsUHJvcGVydHlGdWxsIHwgTWF0ZXJpYWxQcm9wZXJ0eUZ1bGxbXT5bXSA9IFtdO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcGFzc2VzOiBQYXNzW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfaGFzaCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGN1cnJlbnQgW1tFZmZlY3RBc3NldF1dLlxyXG4gICAgICogQHpoIOW9k+WJjeS9v+eUqOeahCBbW0VmZmVjdEFzc2V0XV0g6LWE5rqQ44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBlZmZlY3RBc3NldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdEFzc2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5hbWUgb2YgdGhlIGN1cnJlbnQgW1tFZmZlY3RBc3NldF1dLlxyXG4gICAgICogQHpoIOW9k+WJjeS9v+eUqOeahCBbW0VmZmVjdEFzc2V0XV0g6LWE5rqQ5ZCN44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBlZmZlY3ROYW1lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWZmZWN0QXNzZXQgPyB0aGlzLl9lZmZlY3RBc3NldC5uYW1lIDogJyc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGN1cnJlbnQgdGVjaG5pcXVlIGluZGV4LlxyXG4gICAgICogQHpoIOW9k+WJjeeahCB0ZWNobmlxdWUg57Si5byV44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB0ZWNobmlxdWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZWNoSWR4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBwYXNzZXMgZGVmaW5lZCBpbiB0aGlzIG1hdGVyaWFsLlxyXG4gICAgICogQHpoIOW9k+WJjeato+WcqOS9v+eUqOeahCBwYXNzIOaVsOe7hOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgcGFzc2VzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFzc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBoYXNoIHZhbHVlIG9mIHRoaXMgbWF0ZXJpYWwuXHJcbiAgICAgKiBAemgg5p2Q6LSo55qEIGhhc2jjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGhhc2ggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJlbnQgKCk6IE1hdGVyaWFsIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG93bmVyICgpOiBSZW5kZXJhYmxlQ29tcG9uZW50IHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbml0aWFsaXplIHRoaXMgbWF0ZXJpYWwgd2l0aCB0aGUgZ2l2ZW4gaW5mb3JtYXRpb24uXHJcbiAgICAgKiBAemgg5qC55o2u5omA57uZ5L+h5oGv5Yid5aeL5YyW6L+Z5Liq5p2Q6LSo77yM5Yid5aeL5YyW5q2j5bi457uT5p2f5ZCO5p2Q6LSo5Y2z5Y+v56uL5Y2z55So5LqO5riy5p+T44CCXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBNYXRlcmlhbCBkZXNjcmlwdGlvbiBpbmZvLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSU1hdGVyaWFsSW5mbykge1xyXG4gICAgICAgIGlmICghdGhpcy5fZGVmaW5lcykgeyB0aGlzLl9kZWZpbmVzID0gW107IH1cclxuICAgICAgICBpZiAoIXRoaXMuX3N0YXRlcykgeyB0aGlzLl9zdGF0ZXMgPSBbXTsgfVxyXG4gICAgICAgIGlmICghdGhpcy5fcHJvcHMpIHsgdGhpcy5fcHJvcHMgPSBbXTsgfVxyXG4gICAgICAgIGlmIChpbmZvLnRlY2huaXF1ZSAhPT0gdW5kZWZpbmVkKSB7IHRoaXMuX3RlY2hJZHggPSBpbmZvLnRlY2huaXF1ZTsgfVxyXG4gICAgICAgIGlmIChpbmZvLmVmZmVjdEFzc2V0KSB7IHRoaXMuX2VmZmVjdEFzc2V0ID0gaW5mby5lZmZlY3RBc3NldDsgfVxyXG4gICAgICAgIGVsc2UgaWYgKGluZm8uZWZmZWN0TmFtZSkgeyB0aGlzLl9lZmZlY3RBc3NldCA9IEVmZmVjdEFzc2V0LmdldChpbmZvLmVmZmVjdE5hbWUpOyB9XHJcbiAgICAgICAgaWYgKGluZm8uZGVmaW5lcykgeyB0aGlzLl9wcmVwYXJlSW5mbyhpbmZvLmRlZmluZXMsIHRoaXMuX2RlZmluZXMpOyB9XHJcbiAgICAgICAgaWYgKGluZm8uc3RhdGVzKSB7IHRoaXMuX3ByZXBhcmVJbmZvKGluZm8uc3RhdGVzLCB0aGlzLl9zdGF0ZXMpOyB9XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVzZXQgKGluZm86IElNYXRlcmlhbEluZm8pIHsgLy8gdG8gYmUgY29uc2lzdGVudCB3aXRoIG90aGVyIGFzc2V0c1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShpbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRGVzdHJveSB0aGUgbWF0ZXJpYWwgZGVmaW5pdGl2ZWx5Ljxicj5cclxuICAgICAqIENhbm5vdCByZS1pbml0aWFsaXplIGFmdGVyIGRlc3Ryb3kuPGJyPlxyXG4gICAgICogRm9yIHJlLWluaXRpYWxpemUgcHVycG9zZXMsIGNhbGwgW1tNYXRlcmlhbC5pbml0aWFsaXplXV0gZGlyZWN0bHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9u+W6lemUgOavgeadkOi0qO+8jOazqOaEj+mUgOavgeWQjuaXoOazlemHjeaWsOWIneWni+WMluOAgjxicj5cclxuICAgICAqIOWmgumcgOmHjeaWsOWIneWni+WMluadkOi0qO+8jOS4jeW/heWFiOiwg+eUqCBkZXN0cm9544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9kb0Rlc3Ryb3koKTtcclxuICAgICAgICByZXR1cm4gc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlY29tcGlsZSB0aGUgc2hhZGVyIHdpdGggdGhlIHNwZWNpZmllZCBtYWNybyBvdmVycmlkZXMuIEFsbG93ZWQgb25seSBvbiBtYXRlcmlhbCBpbnN0YW5jZXMuXHJcbiAgICAgKiBAemgg5L2/55So5oyH5a6a6aKE5aSE55CG5a6P6YeN5paw57yW6K+R5b2T5YmNIHBhc3PvvIjmlbDnu4TvvInkuK3nmoQgc2hhZGVy44CC5Y+q5YWB6K645a+55p2Q6LSo5a6e5L6L5omn6KGM44CCXHJcbiAgICAgKiBAcGFyYW0gb3ZlcnJpZGVzIFRoZSBzaGFkZXIgbWFjcm8gb3ZlcnJpZGUgdmFsdWVzLlxyXG4gICAgICogQHBhcmFtIHBhc3NJZHggVGhlIHBhc3MgdG8gYXBwbHkgdG8uIFdpbGwgYXBwbHkgdG8gYWxsIHBhc3NlcyBpZiBub3Qgc3BlY2lmaWVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVjb21waWxlU2hhZGVycyAob3ZlcnJpZGVzOiBNYWNyb1JlY29yZCwgcGFzc0lkeD86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignU2hhZGVycyBpbiBtYXRlcmlhbCBhc3NldCBcXCcnICsgdGhpcy5uYW1lICsgJ1xcJyBjYW5ub3QgYmUgbW9kaWZpZWQgYXQgcnVudGltZSwgcGxlYXNlIGluc3RhbnRpYXRlIHRoZSBtYXRlcmlhbCBmaXJzdC4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPdmVycmlkZSB0aGUgcGFzc2VzIHdpdGggdGhlIHNwZWNpZmllZCBwaXBlbGluZSBzdGF0ZXMuIEFsbG93ZWQgb25seSBvbiBtYXRlcmlhbCBpbnN0YW5jZXMuXHJcbiAgICAgKiBAemgg5L2/55So5oyH5a6a566h57q/54q25oCB6YeN6L295b2T5YmN55qEIHBhc3PvvIjmlbDnu4TvvInjgILlj6rlhYHorrjlr7nmnZDotKjlrp7kvovmiafooYzjgIJcclxuICAgICAqIEBwYXJhbSBvdmVycmlkZXMgVGhlIHBpcGVsaW5lIHN0YXRlIG92ZXJyaWRlIHZhbHVlcy5cclxuICAgICAqIEBwYXJhbSBwYXNzSWR4IFRoZSBwYXNzIHRvIGFwcGx5IHRvLiBXaWxsIGFwcGx5IHRvIGFsbCBwYXNzZXMgaWYgbm90IHNwZWNpZmllZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIG92ZXJyaWRlUGlwZWxpbmVTdGF0ZXMgKG92ZXJyaWRlczogUGFzc092ZXJyaWRlcywgcGFzc0lkeD86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignUGlwZWxpbmUgc3RhdGVzIGluIG1hdGVyaWFsIGFzc2V0IFxcJycgKyB0aGlzLm5hbWUgKyAnXFwnIGNhbm5vdCBiZSBtb2RpZmllZCBhdCBydW50aW1lLCBwbGVhc2UgaW5zdGFudGlhdGUgdGhlIG1hdGVyaWFsIGZpcnN0LicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIG1hdGVyaWFsIGlzIGxvYWRlZCBpbiBbW0xvYWRlcl1dLiBJbml0aWFsaXplIHRoZSByZXNvdXJjZXMgYXV0b21hdGljYWxseS5cclxuICAgICAqIEB6aCDpgJrov4cgW1tMb2FkZXJdXSDliqDovb3lrozmiJDml7bnmoTlm57osIPvvIzlsIboh6rliqjliJ3lp4vljJbmnZDotKjotYTmupDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uTG9hZGVkICgpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGUoKTtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzZXQgYWxsIHRoZSB1bmlmb3JtcyB0byB0aGUgZGVmYXVsdCB2YWx1ZSBzcGVjaWZpZWQgaW4gW1tFZmZlY3RBc3NldF1dLlxyXG4gICAgICogQHpoIOmHjee9ruadkOi0qOeahOaJgOaciSB1bmlmb3JtIOWPguaVsOaVsOaNruS4uiBbW0VmZmVjdEFzc2V0XV0g5Lit55qE6buY6K6k5Yid5aeL5YC844CCXHJcbiAgICAgKiBAcGFyYW0gY2xlYXJQYXNzZXMgV2lsbCB0aGUgcmVuZGVyaW5nIGRhdGEgYmUgY2xlYXJlZCB0b28/XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNldFVuaWZvcm1zIChjbGVhclBhc3NlcyA9IHRydWUpIHtcclxuICAgICAgICB0aGlzLl9wcm9wcy5sZW5ndGggPSB0aGlzLl9wYXNzZXMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcHJvcHMubGVuZ3RoOyBpKyspIHsgdGhpcy5fcHJvcHNbaV0gPSB7fTsgfVxyXG4gICAgICAgIGlmICghY2xlYXJQYXNzZXMpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgZm9yIChjb25zdCBwYXNzIG9mIHRoaXMuX3Bhc3Nlcykge1xyXG4gICAgICAgICAgICBwYXNzLnJlc2V0VUJPcygpO1xyXG4gICAgICAgICAgICBwYXNzLnJlc2V0VGV4dHVyZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvbnZlbmllbnQgcHJvcGVydHkgc2V0dGVyIHByb3ZpZGVkIGZvciBxdWljayBtYXRlcmlhbCBzZXR1cC48YnI+XHJcbiAgICAgKiBbW1Bhc3Muc2V0VW5pZm9ybV1dIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgaWYgeW91IG5lZWQgdG8gZG8gcGVyLWZyYW1lIHVuaWZvcm0gdXBkYXRlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7mnZDotKggdW5pZm9ybSDlj4LmlbDnmoTnu5/kuIDlhaXlj6PjgII8YnI+XHJcbiAgICAgKiDms6jmhI/lpoLmnpzpnIDopoHmr4/luKfmm7TmlrAgdW5pZm9ybe+8jOW7uuiuruS9v+eUqCBbW1Bhc3Muc2V0VW5pZm9ybV1dIOS7peiOt+W+l+abtOWlveeahOaAp+iDveOAglxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIHRhcmdldCB1bmlmb3JtIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gdmFsIFRoZSB0YXJnZXQgdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0gcGFzc0lkeCBUaGUgcGFzcyB0byBhcHBseSB0by4gV2lsbCBhcHBseSB0byBhbGwgcGFzc2VzIGlmIG5vdCBzcGVjaWZpZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRQcm9wZXJ0eSAobmFtZTogc3RyaW5nLCB2YWw6IE1hdGVyaWFsUHJvcGVydHlGdWxsIHwgTWF0ZXJpYWxQcm9wZXJ0eUZ1bGxbXSwgcGFzc0lkeD86IG51bWJlcikge1xyXG4gICAgICAgIGxldCBzdWNjZXNzID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHBhc3NJZHggPT09IHVuZGVmaW5lZCkgeyAvLyB0cnkgc2V0IHByb3BlcnR5IGZvciBhbGwgYXBwbGljYWJsZSBwYXNzZXNcclxuICAgICAgICAgICAgY29uc3QgcGFzc2VzID0gdGhpcy5fcGFzc2VzO1xyXG4gICAgICAgICAgICBjb25zdCBsZW4gPSBwYXNzZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzID0gcGFzc2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3VwbG9hZFByb3BlcnR5KHBhc3MsIG5hbWUsIHZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm9wc1twYXNzLnByb3BlcnR5SW5kZXhdW25hbWVdID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHBhc3NJZHggPj0gdGhpcy5fcGFzc2VzLmxlbmd0aCkgeyBjb25zb2xlLndhcm4oYGlsbGVnYWwgcGFzcyBpbmRleDogJHtwYXNzSWR4fS5gKTsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3MgPSB0aGlzLl9wYXNzZXNbcGFzc0lkeF07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91cGxvYWRQcm9wZXJ0eShwYXNzLCBuYW1lLCB2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9wc1twYXNzLnByb3BlcnR5SW5kZXhdW25hbWVdID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgc3VjY2VzcyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgaWxsZWdhbCBwcm9wZXJ0eSBuYW1lOiAke25hbWV9LmApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgdGhlIHNwZWNpZmllZCB1bmlmb3JtIHZhbHVlIGZvciB0aGlzIG1hdGVyaWFsLjxicj5cclxuICAgICAqIE5vdGUgdGhhdCBvbmx5IHVuaWZvcm1zIHNldCB0aHJvdWdoIFtbTWF0ZXJpYWwuc2V0UHJvcGVydHldXSBjYW4gYmUgYWNxdWlyZWQgaGVyZS48YnI+XHJcbiAgICAgKiBGb3IgdGhlIGNvbXBsZXRlIHJlbmRlcmluZyBkYXRhLCB1c2UgW1tQYXNzLmdldFVuaWZvcm1dXSBpbnN0ZWFkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvZPliY3mnZDotKjnmoTmjIflrpogdW5pZm9ybSDlj4LmlbDnmoTlgLzjgII8YnI+XHJcbiAgICAgKiDms6jmhI/lj6rmnInpgJrov4cgW1tNYXRlcmlhbC5zZXRQcm9wZXJ0eV1dIOWHveaVsOiuvue9rueahOWPguaVsOaJjeiDveS7juatpOWHveaVsOWPluWHuu+8jDxicj5cclxuICAgICAqIOWmgumcgOWPluWHuuWujOaVtOeahOa4suafk+aVsOaNru+8jOivt+S9v+eUqCBbW1Bhc3MuZ2V0VW5pZm9ybV1d44CCXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgcHJvcGVydHkgb3IgdW5pZm9ybSBuYW1lLlxyXG4gICAgICogQHBhcmFtIHBhc3NJZHggVGhlIHRhcmdldCBwYXNzIGluZGV4LiBJZiBub3Qgc3BlY2lmaWVkLCByZXR1cm4gdGhlIGZpcnN0IGZvdW5kIHZhbHVlIGluIGFsbCBwYXNzZXMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRQcm9wZXJ0eSAobmFtZTogc3RyaW5nLCBwYXNzSWR4PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHBhc3NJZHggPT09IHVuZGVmaW5lZCkgeyAvLyB0cnkgZ2V0IHByb3BlcnR5IGluIGFsbCBwb3NzaWJsZSBwYXNzZXNcclxuICAgICAgICAgICAgY29uc3QgcHJvcHNBcnJheSA9IHRoaXMuX3Byb3BzO1xyXG4gICAgICAgICAgICBjb25zdCBsZW4gPSBwcm9wc0FycmF5Lmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvcHMgPSBwcm9wc0FycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwIGluIHByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAgPT09IG5hbWUpIHsgcmV0dXJuIHByb3BzW3BdOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocGFzc0lkeCA+PSB0aGlzLl9wcm9wcy5sZW5ndGgpIHsgY29uc29sZS53YXJuKGBpbGxlZ2FsIHBhc3MgaW5kZXg6ICR7cGFzc0lkeH0uYCk7IHJldHVybiBudWxsOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5fcHJvcHNbdGhpcy5fcGFzc2VzW3Bhc3NJZHhdLnByb3BlcnR5SW5kZXhdO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHAgaW4gcHJvcHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwID09PSBuYW1lKSB7IHJldHVybiBwcm9wc1twXTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENvcHkgdGhlIHRhcmdldCBtYXRlcmlhbC5cclxuICAgICAqIEB6aCDlpI3liLbnm67moIfmnZDotKjliLDlvZPliY3lrp7kvovjgIJcclxuICAgICAqIEBwYXJhbSBtYXQgVGhlIG1hdGVyaWFsIHRvIGJlIGNvcGllZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHkgKG1hdDogTWF0ZXJpYWwpIHtcclxuICAgICAgICB0aGlzLl90ZWNoSWR4ID0gbWF0Ll90ZWNoSWR4O1xyXG4gICAgICAgIHRoaXMuX3Byb3BzLmxlbmd0aCA9IG1hdC5fcHJvcHMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Ll9wcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wc1tpXSA9IE9iamVjdC5hc3NpZ24oe30sIG1hdC5fcHJvcHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kZWZpbmVzLmxlbmd0aCA9IG1hdC5fZGVmaW5lcy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQuX2RlZmluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmaW5lc1tpXSA9IE9iamVjdC5hc3NpZ24oe30sIG1hdC5fZGVmaW5lc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3N0YXRlcy5sZW5ndGggPSBtYXQuX3N0YXRlcy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXQuX3N0YXRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZXNbaV0gPSBPYmplY3QuYXNzaWduKHt9LCBtYXQuX3N0YXRlc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2VmZmVjdEFzc2V0ID0gbWF0Ll9lZmZlY3RBc3NldDtcclxuICAgICAgICB0aGlzLl91cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3ByZXBhcmVJbmZvIChwYXRjaDogb2JqZWN0IHwgb2JqZWN0W10sIGN1cjogb2JqZWN0W10pIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocGF0Y2gpKSB7IC8vIGZpbGwgYWxsIHRoZSBwYXNzZXMgaWYgbm90IHNwZWNpZmllZFxyXG4gICAgICAgICAgICBjb25zdCBsZW4gPSB0aGlzLl9lZmZlY3RBc3NldCA/IHRoaXMuX2VmZmVjdEFzc2V0LnRlY2huaXF1ZXNbdGhpcy5fdGVjaElkeF0ucGFzc2VzLmxlbmd0aCA6IDE7XHJcbiAgICAgICAgICAgIHBhdGNoID0gQXJyYXkobGVuKS5maWxsKHBhdGNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAocGF0Y2ggYXMgb2JqZWN0W10pLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oY3VyW2ldIHx8IChjdXJbaV0gPSB7fSksIHBhdGNoW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVQYXNzZXMgKCkge1xyXG4gICAgICAgIGNvbnN0IHRlY2ggPSB0aGlzLl9lZmZlY3RBc3NldCEudGVjaG5pcXVlc1t0aGlzLl90ZWNoSWR4IHx8IDBdO1xyXG4gICAgICAgIGlmICghdGVjaCkgeyByZXR1cm4gW107IH1cclxuICAgICAgICBjb25zdCBwYXNzTnVtID0gdGVjaC5wYXNzZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHBhc3NlczogUGFzc1tdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBwYXNzTnVtOyArK2spIHtcclxuICAgICAgICAgICAgY29uc3QgcGFzc0luZm8gPSB0ZWNoLnBhc3Nlc1trXSBhcyBJUGFzc0luZm9GdWxsO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wSWR4ID0gcGFzc0luZm8ucGFzc0luZGV4ID0gaztcclxuICAgICAgICAgICAgY29uc3QgZGVmaW5lcyA9IHBhc3NJbmZvLmRlZmluZXMgPSB0aGlzLl9kZWZpbmVzW3Byb3BJZHhdIHx8ICh0aGlzLl9kZWZpbmVzW3Byb3BJZHhdID0ge30pO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZXMgPSBwYXNzSW5mby5zdGF0ZU92ZXJyaWRlcyA9IHRoaXMuX3N0YXRlc1twcm9wSWR4XSB8fCAodGhpcy5fc3RhdGVzW3Byb3BJZHhdID0ge30pO1xyXG4gICAgICAgICAgICBpZiAocGFzc0luZm8ucHJvcGVydHlJbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGRlZmluZXMsIHRoaXMuX2RlZmluZXNbcGFzc0luZm8ucHJvcGVydHlJbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzdGF0ZXMsIHRoaXMuX3N0YXRlc1twYXNzSW5mby5wcm9wZXJ0eUluZGV4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhc3NJbmZvLmVtYmVkZGVkTWFjcm9zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZGVmaW5lcywgcGFzc0luZm8uZW1iZWRkZWRNYWNyb3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXNzSW5mby5zd2l0Y2ggJiYgIWRlZmluZXNbcGFzc0luZm8uc3dpdGNoXSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBjb25zdCBwYXNzID0gbmV3IFBhc3MobGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCk7XHJcbiAgICAgICAgICAgIHBhc3MuaW5pdGlhbGl6ZShwYXNzSW5mbyk7XHJcbiAgICAgICAgICAgIHBhc3Nlcy5wdXNoKHBhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFzc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlIChrZWVwUHJvcHM6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VmZmVjdEFzc2V0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXNzZXMgJiYgdGhpcy5fcGFzc2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXNzIG9mIHRoaXMuX3Bhc3Nlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhc3MuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3Bhc3NlcyA9IHRoaXMuX2NyZWF0ZVBhc3NlcygpO1xyXG4gICAgICAgICAgICAvLyBoYW5kbGUgcHJvcGVydHkgdmFsdWVzXHJcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsUGFzc2VzID0gdGhpcy5fZWZmZWN0QXNzZXQudGVjaG5pcXVlc1t0aGlzLl90ZWNoSWR4XS5wYXNzZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9wcy5sZW5ndGggPSB0b3RhbFBhc3NlcztcclxuICAgICAgICAgICAgaWYgKGtlZXBQcm9wcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFzc2VzLmZvckVhY2goKHBhc3MsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLl9wcm9wc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByb3BzKSB7IHByb3BzID0gdGhpcy5fcHJvcHNbaV0gPSB7fTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzID0gdGhpcy5fcHJvcHNbcGFzcy5wcm9wZXJ0eUluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHAgaW4gcHJvcHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBsb2FkUHJvcGVydHkocGFzcywgcCwgcHJvcHNbcF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9wcm9wcy5sZW5ndGg7IGkrKykgeyB0aGlzLl9wcm9wc1tpXSA9IHt9OyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgeyAvLyB1Z2x5IHllbGxvdyBpbmRpY2F0aW5nIG1pc3NpbmcgZWZmZWN0XHJcbiAgICAgICAgICAgIGNvbnN0IG1pc3NpbmcgPSBidWlsdGluUmVzTWdyLmdldDxNYXRlcmlhbD4oJ21pc3NpbmctZWZmZWN0LW1hdGVyaWFsJyk7XHJcbiAgICAgICAgICAgIGlmIChtaXNzaW5nKSB7IHRoaXMuX3Bhc3NlcyA9IG1pc3NpbmcuX3Bhc3Nlcy5zbGljZSgpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2hhc2ggPSBNYXRlcmlhbC5nZXRIYXNoKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBsb2FkUHJvcGVydHkgKHBhc3M6IFBhc3MsIG5hbWU6IHN0cmluZywgdmFsOiBNYXRlcmlhbFByb3BlcnR5RnVsbCB8IE1hdGVyaWFsUHJvcGVydHlGdWxsW10pIHtcclxuICAgICAgICBjb25zdCBoYW5kbGUgPSBwYXNzLmdldEhhbmRsZShuYW1lKTtcclxuICAgICAgICBpZiAoIWhhbmRsZSkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBjb25zdCBwcm9wZXJ0eVR5cGUgPSBQYXNzLmdldFByb3BlcnR5VHlwZUZyb21IYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICBpZiAocHJvcGVydHlUeXBlID09PSBQcm9wZXJ0eVR5cGUuVUJPKSB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcclxuICAgICAgICAgICAgICAgIHBhc3Muc2V0VW5pZm9ybUFycmF5KGhhbmRsZSwgdmFsIGFzIE1hdGVyaWFsUHJvcGVydHlbXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBwYXNzLnNldFVuaWZvcm0oaGFuZGxlLCB2YWwgYXMgTWF0ZXJpYWxQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYXNzLnJlc2V0VW5pZm9ybShuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlUeXBlID09PSBQcm9wZXJ0eVR5cGUuU0FNUExFUikge1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JpbmRUZXh0dXJlKHBhc3MsIGJpbmRpbmcsIHZhbFtpXSwgaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iaW5kVGV4dHVyZShwYXNzLCBiaW5kaW5nLCB2YWwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFzcy5yZXNldFRleHR1cmUobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9iaW5kVGV4dHVyZSAocGFzczogUGFzcywgYmluZGluZzogbnVtYmVyLCB2YWw6IE1hdGVyaWFsUHJvcGVydHlGdWxsLCBpbmRleD86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBHRlhUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIHBhc3MuYmluZFRleHR1cmUoYmluZGluZywgdmFsLCBpbmRleCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWwgaW5zdGFuY2VvZiBUZXh0dXJlQmFzZSB8fCB2YWwgaW5zdGFuY2VvZiBTcHJpdGVGcmFtZSB8fCB2YWwgaW5zdGFuY2VvZiBSZW5kZXJUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRleHR1cmU6IEdGWFRleHR1cmUgfCBudWxsID0gdmFsLmdldEdGWFRleHR1cmUoKTtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0dXJlIHx8ICF0ZXh0dXJlLndpZHRoIHx8ICF0ZXh0dXJlLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS53YXJuKGBtYXRlcmlhbCAnJHt0aGlzLl91dWlkfScgcmVjZWl2ZWQgaW5jb21wbGV0ZSB0ZXh0dXJlIGFzc2V0ICcke3ZhbC5fdXVpZH0nYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGFzcy5iaW5kVGV4dHVyZShiaW5kaW5nLCB0ZXh0dXJlLCBpbmRleCk7XHJcbiAgICAgICAgICAgIHBhc3MuYmluZFNhbXBsZXIoYmluZGluZywgdmFsLmdldEdGWFNhbXBsZXIoKSwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RvRGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bhc3NlcyAmJiB0aGlzLl9wYXNzZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcGFzcyBvZiB0aGlzLl9wYXNzZXMpIHtcclxuICAgICAgICAgICAgICAgIHBhc3MuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2VmZmVjdEFzc2V0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9wYXNzZXMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9wcm9wcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2RlZmluZXMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9zdGF0ZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuTWF0ZXJpYWwgPSBNYXRlcmlhbDtcclxuIl19