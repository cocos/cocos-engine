(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./animation/easing.js", "./assets/material.js", "./gfx/buffer.js", "./gfx/input-assembler.js", "./gfx/texture.js", "./math/utils.js", "./default-constants.js", "./platform/sys.js", "./gfx/index.js", "./pipeline/index.js", "./global-exports.js", "./renderer/core/memory-pools.js", "./pipeline/define.js", "./gfx/define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./animation/easing.js"), require("./assets/material.js"), require("./gfx/buffer.js"), require("./gfx/input-assembler.js"), require("./gfx/texture.js"), require("./math/utils.js"), require("./default-constants.js"), require("./platform/sys.js"), require("./gfx/index.js"), require("./pipeline/index.js"), require("./global-exports.js"), require("./renderer/core/memory-pools.js"), require("./pipeline/define.js"), require("./gfx/define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.easing, global.material, global.buffer, global.inputAssembler, global.texture, global.utils, global.defaultConstants, global.sys, global.index, global.index, global.globalExports, global.memoryPools, global.define, global.define);
    global.splashScreen = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, easing, _material, _buffer, _inputAssembler, _texture, _utils, _defaultConstants, _sys, _index, _index2, _globalExports, _memoryPools, _define, _define2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SplashScreen = void 0;
  easing = _interopRequireWildcard(easing);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var SplashScreen = /*#__PURE__*/function () {
    _createClass(SplashScreen, [{
      key: "main",
      value: function main(root) {
        if (root == null) return console.error('RENDER ROOT IS NULL.');

        if (window._CCSettings && window._CCSettings.splashScreen) {
          this.setting = window._CCSettings.splashScreen;
          this.setting.totalTime = this.setting.totalTime != null ? this.setting.totalTime : 3000;
          this.setting.base64src = this.setting.base64src || '';
          this.setting.effect = this.setting.effect || 'FADE-INOUT';
          this.setting.clearColor = this.setting.clearColor || new _define2.GFXColor(0.88, 0.88, 0.88, 1);
          this.setting.displayRatio = this.setting.displayRatio != null ? this.setting.displayRatio : 0.4;
          this.setting.displayWatermark = this.setting.displayWatermark != null ? this.setting.displayWatermark : true;
        } else {
          this.setting = {
            totalTime: 3000,
            base64src: '',
            effect: 'FADE-INOUT',
            clearColor: new _define2.GFXColor(0.88, 0.88, 0.88, 1),
            displayRatio: 0.4,
            displayWatermark: true
          };
        }

        if (this.setting.base64src === '' || this.setting.totalTime <= 0) {
          if (this.callBack) {
            this.callBack();
          }

          this.callBack = null;
          this.setting = null;
          this._directCall = true;
          return;
        } else {
          _globalExports.legacyCC.view.enableRetina(true);

          var designRes = window._CCSettings.designResolution;

          if (designRes) {
            _globalExports.legacyCC.view.setDesignResolutionSize(designRes.width, designRes.height, designRes.policy);
          } else {
            _globalExports.legacyCC.view.setDesignResolutionSize(960, 640, 4);
          }

          this.root = root;
          this.device = root.device;

          _globalExports.legacyCC.game.once(_globalExports.legacyCC.Game.EVENT_GAME_INITED, function () {
            _globalExports.legacyCC.director._lateUpdate = performance.now();
          }, _globalExports.legacyCC.director);

          this.callBack = null;
          this.cancelAnimate = false;
          this.startTime = -1;
          this.clearColors = [this.setting.clearColor];
          this.screenWidth = this.device.width;
          this.screenHeight = this.device.height;
          this.image = new Image();
          this.image.onload = this.init.bind(this);
          this.image.src = this.setting.base64src;
        }
      }
    }, {
      key: "setOnFinish",
      value: function setOnFinish(cb) {
        if (this._directCall) {
          if (cb) {
            SplashScreen._ins = null;
            return cb();
          }
        }

        this.callBack = cb;
      }
    }, {
      key: "_tryToStart",
      value: function _tryToStart() {
        if (this._splashFinish && this._loadFinish) {
          if (this.callBack) {
            this.callBack();
            this.hide();
          }
        }
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;

        // adapt for native mac & ios
        if (_defaultConstants.JSB) {
          if (_sys.sys.os === _globalExports.legacyCC.sys.OS_OSX || _sys.sys.os === _globalExports.legacyCC.sys.OS_IOS) {
            var width = screen.width * devicePixelRatio;
            var height = screen.height * devicePixelRatio;
            this.device.resize(width, height);
            this.screenWidth = this.device.width;
            this.screenHeight = this.device.height;
          }
        } // TODO: hack for cocosPlay & XIAOMI cause on landscape canvas value is wrong


        if (_defaultConstants.COCOSPLAY || _defaultConstants.XIAOMI) {
          if (window._CCSettings.orientation === 'landscape' && this.device.width < this.device.height) {
            var _width = this.device.height;
            var _height = this.device.width;
            this.device.resize(_width, _height);
            this.screenWidth = this.device.width;
            this.screenHeight = this.device.height;
          }
        }

        this.initCMD();
        this.initIA();
        this.initPSO();

        if (this.setting.displayWatermark) {
          this.initText();
        }

        var animate = function animate(time) {
          if (_this.cancelAnimate) {
            return;
          }

          if (_this.startTime < 0) {
            _this.startTime = time;
          }

          var elapsedTime = time - _this.startTime;
          /** update uniform */

          var PERCENT = (0, _utils.clamp01)(elapsedTime / _this.setting.totalTime);
          var u_p = easing.cubicOut(PERCENT);
          if (_this.setting.effect === 'NONE') u_p = 1.0;

          _this.material.setProperty('u_precent', u_p);

          _this.material.passes[0].update();

          if (_this.setting.displayWatermark && _this.textMaterial) {
            _this.textMaterial.setProperty('u_precent', u_p);

            _this.textMaterial.passes[0].update();
          }

          _this.frame(time);

          if (elapsedTime > _this.setting.totalTime) {
            _this.splashFinish = true;
          }

          requestAnimationFrame(animate);
        };

        this.handle = requestAnimationFrame(animate);
      }
    }, {
      key: "hide",
      value: function hide() {
        cancelAnimationFrame(this.handle);
        this.cancelAnimate = true; // here delay destroy：because ios immediately destroy input assmebler will crash & native renderer will mess.

        setTimeout(this.destroy.bind(this));
      }
    }, {
      key: "frame",
      value: function frame(time) {
        if (this.cancelAnimate) return; // TODO: hack for cocosPlay & XIAOMI cause on landscape canvas value is wrong

        if (_defaultConstants.COCOSPLAY || _defaultConstants.XIAOMI) {
          if (window._CCSettings.orientation === 'landscape' && this.device.width < this.device.height) {
            var width = this.device.height;
            var height = this.device.width;
            this.device.resize(width, height);
            this.screenWidth = this.device.width;
            this.screenHeight = this.device.height;
          }
        }

        var device = this.device;
        device.acquire(); // record command

        var cmdBuff = this.cmdBuff;
        var framebuffer = this.framebuffer;
        var renderArea = this.renderArea;
        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer.renderPass, framebuffer, renderArea, this.clearColors, 1.0, 0);
        var hPass = this.material.passes[0].handle;

        var pso = _index2.PipelineStateManager.getOrCreatePipelineState(device, hPass, this.shader, framebuffer.renderPass, this.assmebler);

        cmdBuff.bindPipelineState(pso);
        cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, _memoryPools.DSPool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DESCRIPTOR_SET)));
        cmdBuff.bindInputAssembler(this.assmebler);
        cmdBuff.draw(this.assmebler);

        if (this.setting.displayWatermark && this.textShader && this.textAssmebler) {
          var hPassText = this.textMaterial.passes[0].handle;

          var psoWatermark = _index2.PipelineStateManager.getOrCreatePipelineState(device, hPassText, this.textShader, framebuffer.renderPass, this.textAssmebler);

          cmdBuff.bindPipelineState(psoWatermark);
          cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, _memoryPools.DSPool.get(_memoryPools.PassPool.get(hPassText, _memoryPools.PassView.DESCRIPTOR_SET)));
          cmdBuff.bindInputAssembler(this.textAssmebler);
          cmdBuff.draw(this.textAssmebler);
        }

        cmdBuff.endRenderPass();
        cmdBuff.end();
        device.queue.submit([cmdBuff]);
        device.present();
      }
    }, {
      key: "initText",
      value: function initText() {
        /** texure */
        this.textImg = document.createElement('canvas');
        this.textImg.width = 330;
        this.textImg.height = 30;
        this.textImg.style.width = "".concat(this.textImg.width);
        this.textImg.style.height = "".concat(this.textImg.height);
        var ctx = this.textImg.getContext('2d');
        ctx.font = "".concat(18, "px Arial");
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = '`#424242`';
        var text = 'Powered by Cocos Creator 3D';
        var textMetrics = ctx.measureText(text);
        ctx.fillText(text, (330 - textMetrics.width) / 2, 6);
        this.textRegion = new _define2.GFXBufferTextureCopy();
        this.textRegion.texExtent.width = this.textImg.width;
        this.textRegion.texExtent.height = this.textImg.height;
        this.textRegion.texExtent.depth = 1;
        this.textTexture = this.device.createTexture(new _texture.GFXTextureInfo(_define2.GFXTextureType.TEX2D, _define2.GFXTextureUsageBit.SAMPLED | _define2.GFXTextureUsageBit.TRANSFER_DST, _define2.GFXFormat.RGBA8, this.textImg.width, this.textImg.height));
        this.device.copyTexImagesToTexture([this.textImg], this.textTexture, [this.textRegion]);
        /** PSO */

        this.textMaterial = new _material.Material();
        this.textMaterial.initialize({
          effectName: 'util/splash-screen'
        });
        var pass = this.textMaterial.passes[0];
        var binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding, this.textTexture);
        this.textShader = _memoryPools.ShaderPool.get(pass.getShaderVariant());

        _memoryPools.DSPool.get(_memoryPools.PassPool.get(pass.handle, _memoryPools.PassView.DESCRIPTOR_SET)).update();
        /** Assembler */
        // create vertex buffer


        var vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        var vbSize = vbStride * 4;
        this.textVB = this.device.createBuffer(new _buffer.GFXBufferInfo(_define2.GFXBufferUsageBit.VERTEX | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE, vbSize, vbStride));
        var verts = new Float32Array(4 * 4);
        var w = -this.textImg.width / 2;
        var h = -this.textImg.height / 2;

        if (this.screenWidth < this.screenHeight) {
          w = -this.screenWidth / 2 * 0.5;
          h = w / (this.textImg.width / this.textImg.height);
        } else {
          w = -this.screenHeight / 2 * 0.5;
          h = w / (this.textImg.width / this.textImg.height);
        }

        var n = 0;
        verts[n++] = w;
        verts[n++] = h;
        verts[n++] = 0.0;
        verts[n++] = 1.0;
        verts[n++] = -w;
        verts[n++] = h;
        verts[n++] = 1.0;
        verts[n++] = 1.0;
        verts[n++] = w;
        verts[n++] = -h;
        verts[n++] = 0.0;
        verts[n++] = 0.0;
        verts[n++] = -w;
        verts[n++] = -h;
        verts[n++] = 1.0;
        verts[n++] = 0.0; // translate to bottom

        for (var i = 0; i < verts.length; i += 4) {
          verts[i] = verts[i] + this.screenWidth / 2;
          verts[i + 1] = verts[i + 1] + this.screenHeight * 0.1;
        } // transform to clipspace


        var ySign = this.device.screenSpaceSignY;

        for (var _i = 0; _i < verts.length; _i += 4) {
          verts[_i] = verts[_i] / this.screenWidth * 2 - 1;
          verts[_i + 1] = (verts[_i + 1] / this.screenHeight * 2 - 1) * ySign;
        }

        this.textVB.update(verts); // create index buffer

        var ibStride = Uint16Array.BYTES_PER_ELEMENT;
        var ibSize = ibStride * 6;
        this.textIB = this.device.createBuffer(new _buffer.GFXBufferInfo(_define2.GFXBufferUsageBit.INDEX | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE, ibSize, ibStride));
        var indices = new Uint16Array(6);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 1;
        indices[4] = 3;
        indices[5] = 2;
        this.textIB.update(indices);
        var attributes = [new _inputAssembler.GFXAttribute('a_position', _define2.GFXFormat.RG32F), new _inputAssembler.GFXAttribute('a_texCoord', _define2.GFXFormat.RG32F)];
        var textIAInfo = new _inputAssembler.GFXInputAssemblerInfo(attributes, [this.textVB], this.textIB);
        this.textAssmebler = this.device.createInputAssembler(textIAInfo);
      }
    }, {
      key: "initCMD",
      value: function initCMD() {
        var device = this.device;
        this.renderArea = new _define2.GFXRect(0, 0, device.width, device.height);
        this.framebuffer = this.root.mainWindow.framebuffer;
        this.cmdBuff = device.commandBuffer;
      }
    }, {
      key: "initIA",
      value: function initIA() {
        var device = this.device; // create vertex buffer

        var vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        var vbSize = vbStride * 4;
        this.vertexBuffers = device.createBuffer(new _buffer.GFXBufferInfo(_define2.GFXBufferUsageBit.VERTEX | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE, vbSize, vbStride));
        var verts = new Float32Array(4 * 4);
        var w = -this.image.width / 2;
        var h = -this.image.height / 2;

        if (this.screenWidth < this.screenHeight) {
          w = -this.screenWidth / 2 * this.setting.displayRatio;
          h = w / (this.image.width / this.image.height);
        } else {
          w = -this.screenHeight / 2 * this.setting.displayRatio;
          h = w / (this.image.width / this.image.height);
        }

        var n = 0;
        verts[n++] = w;
        verts[n++] = h;
        verts[n++] = 0.0;
        verts[n++] = 1.0;
        verts[n++] = -w;
        verts[n++] = h;
        verts[n++] = 1.0;
        verts[n++] = 1.0;
        verts[n++] = w;
        verts[n++] = -h;
        verts[n++] = 0.0;
        verts[n++] = 0;
        verts[n++] = -w;
        verts[n++] = -h;
        verts[n++] = 1.0;
        verts[n++] = 0; // translate to center

        for (var i = 0; i < verts.length; i += 4) {
          verts[i] = verts[i] + this.screenWidth / 2;
          verts[i + 1] = verts[i + 1] + this.screenHeight / 2;
        } // transform to clipspace


        var ySign = device.screenSpaceSignY;

        for (var _i2 = 0; _i2 < verts.length; _i2 += 4) {
          verts[_i2] = verts[_i2] / this.screenWidth * 2 - 1;
          verts[_i2 + 1] = (verts[_i2 + 1] / this.screenHeight * 2 - 1) * ySign;
        }

        this.vertexBuffers.update(verts); // create index buffer

        var ibStride = Uint16Array.BYTES_PER_ELEMENT;
        var ibSize = ibStride * 6;
        this.indicesBuffers = device.createBuffer(new _buffer.GFXBufferInfo(_define2.GFXBufferUsageBit.INDEX | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE, ibSize, ibStride));
        var indices = new Uint16Array(6);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 1;
        indices[4] = 3;
        indices[5] = 2;
        this.indicesBuffers.update(indices);
        var attributes = [new _inputAssembler.GFXAttribute('a_position', _define2.GFXFormat.RG32F), new _inputAssembler.GFXAttribute('a_texCoord', _define2.GFXFormat.RG32F)];
        var IAInfo = new _inputAssembler.GFXInputAssemblerInfo(attributes, [this.vertexBuffers], this.indicesBuffers);
        this.assmebler = device.createInputAssembler(IAInfo);
      }
    }, {
      key: "initPSO",
      value: function initPSO() {
        var device = this.device;
        this.material = new _material.Material();
        this.material.initialize({
          effectName: 'util/splash-screen'
        });
        var samplerInfo = new _index.GFXSamplerInfo();
        samplerInfo.addressU = _define2.GFXAddress.CLAMP;
        samplerInfo.addressV = _define2.GFXAddress.CLAMP;
        this.sampler = device.createSampler(samplerInfo);
        this.texture = device.createTexture(new _texture.GFXTextureInfo(_define2.GFXTextureType.TEX2D, _define2.GFXTextureUsageBit.SAMPLED | _define2.GFXTextureUsageBit.TRANSFER_DST, _define2.GFXFormat.RGBA8, this.image.width, this.image.height));
        var pass = this.material.passes[0];
        var binding = pass.getBinding('mainTexture');
        pass.bindTexture(binding, this.texture);
        this.shader = _memoryPools.ShaderPool.get(pass.getShaderVariant());

        var descriptorSet = _memoryPools.DSPool.get(_memoryPools.PassPool.get(pass.handle, _memoryPools.PassView.DESCRIPTOR_SET));

        descriptorSet.bindSampler(binding, this.sampler);
        descriptorSet.update();
        this.region = new _define2.GFXBufferTextureCopy();
        this.region.texExtent.width = this.image.width;
        this.region.texExtent.height = this.image.height;
        this.region.texExtent.depth = 1;
        device.copyTexImagesToTexture([this.image], this.texture, [this.region]);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.callBack = null;
        this.clearColors = null;
        this.device = null;
        this.image = null;
        this.framebuffer = null;
        this.renderArea = null;
        this.region = null;
        this.cmdBuff = null;
        this.shader = null;
        this.material.destroy();
        this.material = null;
        this.texture.destroy();
        this.texture = null;
        this.assmebler.destroy();
        this.assmebler = null;
        this.vertexBuffers.destroy();
        this.vertexBuffers = null;
        this.indicesBuffers.destroy();
        this.indicesBuffers = null;
        this.sampler.destroy();
        this.sampler = null;
        /** text */

        if (this.setting.displayWatermark && this.textImg) {
          this.textImg = null;
          this.textRegion = null;
          this.textShader = null;
          this.textMaterial.destroy();
          this.textMaterial = null;
          this.textTexture.destroy();
          this.textTexture = null;
          this.textAssmebler.destroy();
          this.textAssmebler = null;
          this.textVB.destroy();
          this.textVB = null;
          this.textIB.destroy();
          this.textIB = null;
        }

        this.setting = null;
        SplashScreen._ins = null;
      }
    }, {
      key: "splashFinish",
      set: function set(v) {
        this._splashFinish = v;

        this._tryToStart();
      }
    }, {
      key: "loadFinish",
      set: function set(v) {
        this._loadFinish = v;

        this._tryToStart();
      }
    }], [{
      key: "instance",
      get: function get() {
        if (SplashScreen._ins == null) {
          SplashScreen._ins = new SplashScreen();
        }

        return SplashScreen._ins;
      }
    }]);

    function SplashScreen() {
      _classCallCheck(this, SplashScreen);

      this.handle = 0;
      this.callBack = null;
      this.cancelAnimate = false;
      this.startTime = -1;
      this._splashFinish = false;
      this._loadFinish = false;
      this._directCall = false;
    }

    return SplashScreen;
  }();

  _exports.SplashScreen = SplashScreen;
  SplashScreen._ins = void 0;
  _globalExports.legacyCC.internal.SplashScreen = SplashScreen;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc3BsYXNoLXNjcmVlbi50cyJdLCJuYW1lcyI6WyJTcGxhc2hTY3JlZW4iLCJyb290IiwiY29uc29sZSIsImVycm9yIiwid2luZG93IiwiX0NDU2V0dGluZ3MiLCJzcGxhc2hTY3JlZW4iLCJzZXR0aW5nIiwidG90YWxUaW1lIiwiYmFzZTY0c3JjIiwiZWZmZWN0IiwiY2xlYXJDb2xvciIsIkdGWENvbG9yIiwiZGlzcGxheVJhdGlvIiwiZGlzcGxheVdhdGVybWFyayIsImNhbGxCYWNrIiwiX2RpcmVjdENhbGwiLCJsZWdhY3lDQyIsInZpZXciLCJlbmFibGVSZXRpbmEiLCJkZXNpZ25SZXMiLCJkZXNpZ25SZXNvbHV0aW9uIiwic2V0RGVzaWduUmVzb2x1dGlvblNpemUiLCJ3aWR0aCIsImhlaWdodCIsInBvbGljeSIsImRldmljZSIsImdhbWUiLCJvbmNlIiwiR2FtZSIsIkVWRU5UX0dBTUVfSU5JVEVEIiwiZGlyZWN0b3IiLCJfbGF0ZVVwZGF0ZSIsInBlcmZvcm1hbmNlIiwibm93IiwiY2FuY2VsQW5pbWF0ZSIsInN0YXJ0VGltZSIsImNsZWFyQ29sb3JzIiwic2NyZWVuV2lkdGgiLCJzY3JlZW5IZWlnaHQiLCJpbWFnZSIsIkltYWdlIiwib25sb2FkIiwiaW5pdCIsImJpbmQiLCJzcmMiLCJjYiIsIl9pbnMiLCJfc3BsYXNoRmluaXNoIiwiX2xvYWRGaW5pc2giLCJoaWRlIiwiSlNCIiwic3lzIiwib3MiLCJPU19PU1giLCJPU19JT1MiLCJzY3JlZW4iLCJkZXZpY2VQaXhlbFJhdGlvIiwicmVzaXplIiwiQ09DT1NQTEFZIiwiWElBT01JIiwib3JpZW50YXRpb24iLCJpbml0Q01EIiwiaW5pdElBIiwiaW5pdFBTTyIsImluaXRUZXh0IiwiYW5pbWF0ZSIsInRpbWUiLCJlbGFwc2VkVGltZSIsIlBFUkNFTlQiLCJ1X3AiLCJlYXNpbmciLCJjdWJpY091dCIsIm1hdGVyaWFsIiwic2V0UHJvcGVydHkiLCJwYXNzZXMiLCJ1cGRhdGUiLCJ0ZXh0TWF0ZXJpYWwiLCJmcmFtZSIsInNwbGFzaEZpbmlzaCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImhhbmRsZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwic2V0VGltZW91dCIsImRlc3Ryb3kiLCJhY3F1aXJlIiwiY21kQnVmZiIsImZyYW1lYnVmZmVyIiwicmVuZGVyQXJlYSIsImJlZ2luIiwiYmVnaW5SZW5kZXJQYXNzIiwicmVuZGVyUGFzcyIsImhQYXNzIiwicHNvIiwiUGlwZWxpbmVTdGF0ZU1hbmFnZXIiLCJnZXRPckNyZWF0ZVBpcGVsaW5lU3RhdGUiLCJzaGFkZXIiLCJhc3NtZWJsZXIiLCJiaW5kUGlwZWxpbmVTdGF0ZSIsImJpbmREZXNjcmlwdG9yU2V0IiwiU2V0SW5kZXgiLCJNQVRFUklBTCIsIkRTUG9vbCIsImdldCIsIlBhc3NQb29sIiwiUGFzc1ZpZXciLCJERVNDUklQVE9SX1NFVCIsImJpbmRJbnB1dEFzc2VtYmxlciIsImRyYXciLCJ0ZXh0U2hhZGVyIiwidGV4dEFzc21lYmxlciIsImhQYXNzVGV4dCIsInBzb1dhdGVybWFyayIsImVuZFJlbmRlclBhc3MiLCJlbmQiLCJxdWV1ZSIsInN1Ym1pdCIsInByZXNlbnQiLCJ0ZXh0SW1nIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJjdHgiLCJnZXRDb250ZXh0IiwiZm9udCIsInRleHRCYXNlbGluZSIsInRleHRBbGlnbiIsImZpbGxTdHlsZSIsInRleHQiLCJ0ZXh0TWV0cmljcyIsIm1lYXN1cmVUZXh0IiwiZmlsbFRleHQiLCJ0ZXh0UmVnaW9uIiwiR0ZYQnVmZmVyVGV4dHVyZUNvcHkiLCJ0ZXhFeHRlbnQiLCJkZXB0aCIsInRleHRUZXh0dXJlIiwiY3JlYXRlVGV4dHVyZSIsIkdGWFRleHR1cmVJbmZvIiwiR0ZYVGV4dHVyZVR5cGUiLCJURVgyRCIsIkdGWFRleHR1cmVVc2FnZUJpdCIsIlNBTVBMRUQiLCJUUkFOU0ZFUl9EU1QiLCJHRlhGb3JtYXQiLCJSR0JBOCIsImNvcHlUZXhJbWFnZXNUb1RleHR1cmUiLCJNYXRlcmlhbCIsImluaXRpYWxpemUiLCJlZmZlY3ROYW1lIiwicGFzcyIsImJpbmRpbmciLCJnZXRCaW5kaW5nIiwiYmluZFRleHR1cmUiLCJTaGFkZXJQb29sIiwiZ2V0U2hhZGVyVmFyaWFudCIsInZiU3RyaWRlIiwiRmxvYXQzMkFycmF5IiwiQllURVNfUEVSX0VMRU1FTlQiLCJ2YlNpemUiLCJ0ZXh0VkIiLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJWRVJURVgiLCJHRlhNZW1vcnlVc2FnZUJpdCIsIkhPU1QiLCJERVZJQ0UiLCJ2ZXJ0cyIsInciLCJoIiwibiIsImkiLCJsZW5ndGgiLCJ5U2lnbiIsInNjcmVlblNwYWNlU2lnblkiLCJpYlN0cmlkZSIsIlVpbnQxNkFycmF5IiwiaWJTaXplIiwidGV4dElCIiwiSU5ERVgiLCJpbmRpY2VzIiwiYXR0cmlidXRlcyIsIkdGWEF0dHJpYnV0ZSIsIlJHMzJGIiwidGV4dElBSW5mbyIsIkdGWElucHV0QXNzZW1ibGVySW5mbyIsImNyZWF0ZUlucHV0QXNzZW1ibGVyIiwiR0ZYUmVjdCIsIm1haW5XaW5kb3ciLCJjb21tYW5kQnVmZmVyIiwidmVydGV4QnVmZmVycyIsImluZGljZXNCdWZmZXJzIiwiSUFJbmZvIiwic2FtcGxlckluZm8iLCJHRlhTYW1wbGVySW5mbyIsImFkZHJlc3NVIiwiR0ZYQWRkcmVzcyIsIkNMQU1QIiwiYWRkcmVzc1YiLCJzYW1wbGVyIiwiY3JlYXRlU2FtcGxlciIsInRleHR1cmUiLCJkZXNjcmlwdG9yU2V0IiwiYmluZFNhbXBsZXIiLCJyZWdpb24iLCJ2IiwiX3RyeVRvU3RhcnQiLCJpbnRlcm5hbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXFDYUEsWTs7OzJCQWdESUMsSSxFQUFZO0FBQ3JCLFlBQUlBLElBQUksSUFBSSxJQUFaLEVBQWtCLE9BQU9DLE9B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O0FBQ2xDLGFBQUs5SixhQUFMLEdBQXFCOEosQ0FBckI7O0FBQ0EsYUFBS0MsV0FBTDtBQUNIOzs7d0JBQ3NCRCxDLEVBQVk7QUFDL0IsYUFBSzdKLFdBQUwsR0FBbUI2SixDQUFuQjs7QUFDQSxhQUFLQyxXQUFMO0FBQ0g7OzswQkFzZ0I2QjtBQUMxQixZQUFJL00sWUFBWSxDQUFDK0MsSUFBYixJQUFxQixJQUF6QixFQUErQjtBQUMzQi9DLFVBQUFBLFlBQVksQ0FBQytDLElBQWIsR0FBb0IsSUFBSS9DLFlBQUosRUFBcEI7QUFDSDs7QUFDRCxlQUFPQSxZQUFZLENBQUMrQyxJQUFwQjtBQUNIOzs7QUFFRCw0QkFBdUI7QUFBQTs7QUFBQSxXQTNnQmZrQyxNQTJnQmUsR0EzZ0JFLENBMmdCRjtBQUFBLFdBMWdCZmxFLFFBMGdCZSxHQTFnQmEsSUEwZ0JiO0FBQUEsV0F6Z0Jmb0IsYUF5Z0JlLEdBemdCVSxLQXlnQlY7QUFBQSxXQXhnQmZDLFNBd2dCZSxHQXhnQkssQ0FBQyxDQXdnQk47QUFBQSxXQXRmZlksYUFzZmUsR0F0ZlUsS0FzZlY7QUFBQSxXQXJmZkMsV0FxZmUsR0FyZlEsS0FxZlI7QUFBQSxXQXBmZmpDLFdBb2ZlLEdBcGZRLEtBb2ZSO0FBQUc7Ozs7OztBQXJoQmpCaEIsRUFBQUEsWSxDQTRnQk0rQyxJO0FBWW5COUIsMEJBQVMrTCxRQUFULENBQWtCaE4sWUFBbEIsR0FBaUNBLFlBQWpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBlYXNpbmcgZnJvbSAnLi9hbmltYXRpb24vZWFzaW5nJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuL2Fzc2V0cy9tYXRlcmlhbCc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlciwgR0ZYQnVmZmVySW5mbyB9IGZyb20gJy4vZ2Z4L2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIgfSBmcm9tICcuL2dmeC9jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEdGWEZyYW1lYnVmZmVyIH0gZnJvbSAnLi9nZngvZnJhbWVidWZmZXInO1xyXG5pbXBvcnQgeyBHRlhJbnB1dEFzc2VtYmxlciwgR0ZYSW5wdXRBc3NlbWJsZXJJbmZvLCBHRlhBdHRyaWJ1dGUgfSBmcm9tICcuL2dmeC9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlLCBHRlhUZXh0dXJlSW5mbyB9IGZyb20gJy4vZ2Z4L3RleHR1cmUnO1xyXG5pbXBvcnQgeyBjbGFtcDAxIH0gZnJvbSAnLi9tYXRoL3V0aWxzJztcclxuaW1wb3J0IHsgQ09DT1NQTEFZLCBYSUFPTUksIEpTQiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IHN5cyB9IGZyb20gJy4vcGxhdGZvcm0vc3lzJztcclxuaW1wb3J0IHsgR0ZYU2FtcGxlciwgR0ZYU2FtcGxlckluZm8sIEdGWFNoYWRlciB9IGZyb20gJy4vZ2Z4JztcclxuaW1wb3J0IHsgUGlwZWxpbmVTdGF0ZU1hbmFnZXIgfSBmcm9tICcuL3BpcGVsaW5lJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgUm9vdCB9IGZyb20gJy4vcm9vdCc7XHJcbmltcG9ydCB7IERTUG9vbCwgU2hhZGVyUG9vbCwgUGFzc1Bvb2wsIFBhc3NWaWV3IH0gZnJvbSAnLi9yZW5kZXJlci9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IFNldEluZGV4IH0gZnJvbSAnLi9waXBlbGluZS9kZWZpbmUnO1xyXG5pbXBvcnQge1xyXG4gICAgR0ZYQnVmZmVyVGV4dHVyZUNvcHksIEdGWEJ1ZmZlclVzYWdlQml0LCBHRlhGb3JtYXQsXHJcbiAgICBHRlhNZW1vcnlVc2FnZUJpdCwgR0ZYVGV4dHVyZVR5cGUsIEdGWFRleHR1cmVVc2FnZUJpdCwgR0ZYUmVjdCwgR0ZYQ29sb3IsIEdGWEFkZHJlc3NcclxufSBmcm9tICcuL2dmeC9kZWZpbmUnO1xyXG5cclxuZXhwb3J0IHR5cGUgU3BsYXNoRWZmZWN0VHlwZSA9ICdOT05FJyB8ICdGQURFLUlOT1VUJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNwbGFzaFNldHRpbmcge1xyXG4gICAgcmVhZG9ubHkgdG90YWxUaW1lOiBudW1iZXI7XHJcbiAgICByZWFkb25seSBiYXNlNjRzcmM6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGVmZmVjdDogU3BsYXNoRWZmZWN0VHlwZTtcclxuICAgIHJlYWRvbmx5IGNsZWFyQ29sb3I6IEdGWENvbG9yO1xyXG4gICAgcmVhZG9ubHkgZGlzcGxheVJhdGlvOiBudW1iZXI7XHJcbiAgICByZWFkb25seSBkaXNwbGF5V2F0ZXJtYXJrOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3BsYXNoU2NyZWVuIHtcclxuICAgIHByaXZhdGUgc2V0IHNwbGFzaEZpbmlzaCAodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3NwbGFzaEZpbmlzaCA9IHY7XHJcbiAgICAgICAgdGhpcy5fdHJ5VG9TdGFydCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBsb2FkRmluaXNoICh2OiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fbG9hZEZpbmlzaCA9IHY7XHJcbiAgICAgICAgdGhpcy5fdHJ5VG9TdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBjYWxsQmFjazogRnVuY3Rpb24gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2FuY2VsQW5pbWF0ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzdGFydFRpbWU6IG51bWJlciA9IC0xO1xyXG4gICAgcHJpdmF0ZSBzZXR0aW5nITogSVNwbGFzaFNldHRpbmc7XHJcbiAgICBwcml2YXRlIGltYWdlITogVGV4SW1hZ2VTb3VyY2U7XHJcbiAgICBwcml2YXRlIHJvb3QhOiBSb290O1xyXG4gICAgcHJpdmF0ZSBkZXZpY2UhOiBHRlhEZXZpY2U7XHJcbiAgICBwcml2YXRlIHNhbXBsZXIhOiBHRlhTYW1wbGVyO1xyXG4gICAgcHJpdmF0ZSBjbWRCdWZmITogR0ZYQ29tbWFuZEJ1ZmZlcjtcclxuICAgIHByaXZhdGUgYXNzbWVibGVyITogR0ZYSW5wdXRBc3NlbWJsZXI7XHJcbiAgICBwcml2YXRlIHZlcnRleEJ1ZmZlcnMhOiBHRlhCdWZmZXI7XHJcbiAgICBwcml2YXRlIGluZGljZXNCdWZmZXJzITogR0ZYQnVmZmVyO1xyXG4gICAgcHJpdmF0ZSBzaGFkZXIhOiBHRlhTaGFkZXI7XHJcbiAgICBwcml2YXRlIGZyYW1lYnVmZmVyITogR0ZYRnJhbWVidWZmZXI7XHJcbiAgICBwcml2YXRlIHJlbmRlckFyZWEhOiBHRlhSZWN0O1xyXG4gICAgcHJpdmF0ZSByZWdpb24hOiBHRlhCdWZmZXJUZXh0dXJlQ29weTtcclxuICAgIHByaXZhdGUgbWF0ZXJpYWwhOiBNYXRlcmlhbDtcclxuICAgIHByaXZhdGUgdGV4dHVyZSE6IEdGWFRleHR1cmU7XHJcbiAgICBwcml2YXRlIGNsZWFyQ29sb3JzITogR0ZYQ29sb3JbXTtcclxuXHJcbiAgICBwcml2YXRlIF9zcGxhc2hGaW5pc2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX2xvYWRGaW5pc2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX2RpcmVjdENhbGw6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKiogdGV4dCAqL1xyXG4gICAgcHJpdmF0ZSB0ZXh0SW1nITogVGV4SW1hZ2VTb3VyY2U7XHJcbiAgICBwcml2YXRlIHRleHRSZWdpb24hOiBHRlhCdWZmZXJUZXh0dXJlQ29weTtcclxuICAgIHByaXZhdGUgdGV4dFRleHR1cmUhOiBHRlhUZXh0dXJlO1xyXG4gICAgcHJpdmF0ZSB0ZXh0VkIhOiBHRlhCdWZmZXI7XHJcbiAgICBwcml2YXRlIHRleHRJQiE6IEdGWEJ1ZmZlcjtcclxuICAgIHByaXZhdGUgdGV4dEFzc21lYmxlciE6IEdGWElucHV0QXNzZW1ibGVyO1xyXG4gICAgcHJpdmF0ZSB0ZXh0TWF0ZXJpYWwhOiBNYXRlcmlhbDtcclxuICAgIHByaXZhdGUgdGV4dFNoYWRlciE6IEdGWFNoYWRlcjtcclxuXHJcbiAgICBwcml2YXRlIHNjcmVlbldpZHRoITogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBzY3JlZW5IZWlnaHQhOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIG1haW4gKHJvb3Q6IFJvb3QpIHtcclxuICAgICAgICBpZiAocm9vdCA9PSBudWxsKSByZXR1cm4gY29uc29sZS5lcnJvcignUkVOREVSIFJPT1QgSVMgTlVMTC4nKTtcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5fQ0NTZXR0aW5ncyAmJiB3aW5kb3cuX0NDU2V0dGluZ3Muc3BsYXNoU2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZyA9IHdpbmRvdy5fQ0NTZXR0aW5ncy5zcGxhc2hTY3JlZW47XHJcbiAgICAgICAgICAgICh0aGlzLnNldHRpbmcudG90YWxUaW1lIGFzIG51bWJlcikgPSB0aGlzLnNldHRpbmcudG90YWxUaW1lICE9IG51bGwgPyB0aGlzLnNldHRpbmcudG90YWxUaW1lIDogMzAwMDtcclxuICAgICAgICAgICAgKHRoaXMuc2V0dGluZy5iYXNlNjRzcmMgYXMgc3RyaW5nKSA9IHRoaXMuc2V0dGluZy5iYXNlNjRzcmMgfHwgJyc7XHJcbiAgICAgICAgICAgICh0aGlzLnNldHRpbmcuZWZmZWN0IGFzIFNwbGFzaEVmZmVjdFR5cGUpID0gdGhpcy5zZXR0aW5nLmVmZmVjdCB8fCAnRkFERS1JTk9VVCc7XHJcbiAgICAgICAgICAgICh0aGlzLnNldHRpbmcuY2xlYXJDb2xvciBhcyBHRlhDb2xvcikgPSB0aGlzLnNldHRpbmcuY2xlYXJDb2xvciB8fCBuZXcgR0ZYQ29sb3IoMC44OCwgMC44OCwgMC44OCwgMSk7XHJcbiAgICAgICAgICAgICh0aGlzLnNldHRpbmcuZGlzcGxheVJhdGlvIGFzIG51bWJlcikgPSB0aGlzLnNldHRpbmcuZGlzcGxheVJhdGlvICE9IG51bGwgPyB0aGlzLnNldHRpbmcuZGlzcGxheVJhdGlvIDogMC40O1xyXG4gICAgICAgICAgICAodGhpcy5zZXR0aW5nLmRpc3BsYXlXYXRlcm1hcmsgYXMgYm9vbGVhbikgPSB0aGlzLnNldHRpbmcuZGlzcGxheVdhdGVybWFyayAhPSBudWxsID8gdGhpcy5zZXR0aW5nLmRpc3BsYXlXYXRlcm1hcmsgOiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZyA9IHtcclxuICAgICAgICAgICAgICAgIHRvdGFsVGltZTogMzAwMCxcclxuICAgICAgICAgICAgICAgIGJhc2U2NHNyYzogJycsXHJcbiAgICAgICAgICAgICAgICBlZmZlY3Q6ICdGQURFLUlOT1VUJyxcclxuICAgICAgICAgICAgICAgIGNsZWFyQ29sb3I6IG5ldyBHRlhDb2xvcigwLjg4LCAwLjg4LCAwLjg4LCAxKSxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlSYXRpbzogMC40LFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheVdhdGVybWFyazogdHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZy5iYXNlNjRzcmMgPT09ICcnIHx8IHRoaXMuc2V0dGluZy50b3RhbFRpbWUgPD0gMCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsQmFjaykgeyB0aGlzLmNhbGxCYWNrKCk7IH1cclxuICAgICAgICAgICAgdGhpcy5jYWxsQmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgICh0aGlzLnNldHRpbmcgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdENhbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGVnYWN5Q0Mudmlldy5lbmFibGVSZXRpbmEodHJ1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlc2lnblJlcyA9IHdpbmRvdy5fQ0NTZXR0aW5ncy5kZXNpZ25SZXNvbHV0aW9uO1xyXG4gICAgICAgICAgICBpZiAoZGVzaWduUmVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy52aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKGRlc2lnblJlcy53aWR0aCwgZGVzaWduUmVzLmhlaWdodCwgZGVzaWduUmVzLnBvbGljeSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy52aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKDk2MCwgNjQwLCA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgICAgICB0aGlzLmRldmljZSA9IHJvb3QuZGV2aWNlO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLm9uY2UobGVnYWN5Q0MuR2FtZS5FVkVOVF9HQU1FX0lOSVRFRCwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IuX2xhdGVVcGRhdGUgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgfSwgbGVnYWN5Q0MuZGlyZWN0b3IpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYWxsQmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsQW5pbWF0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IC0xO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyQ29sb3JzID0gW3RoaXMuc2V0dGluZy5jbGVhckNvbG9yXTtcclxuICAgICAgICAgICAgdGhpcy5zY3JlZW5XaWR0aCA9IHRoaXMuZGV2aWNlLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnNjcmVlbkhlaWdodCA9IHRoaXMuZGV2aWNlLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5vbmxvYWQgPSB0aGlzLmluaXQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5zcmMgPSB0aGlzLnNldHRpbmcuYmFzZTY0c3JjO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0T25GaW5pc2ggKGNiOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3RDYWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChjYikge1xyXG4gICAgICAgICAgICAgICAgU3BsYXNoU2NyZWVuLl9pbnMgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYWxsQmFjayA9IGNiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3RyeVRvU3RhcnQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zcGxhc2hGaW5pc2ggJiYgdGhpcy5fbG9hZEZpbmlzaCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsQmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsQmFjaygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0ICgpIHtcclxuICAgICAgICAvLyBhZGFwdCBmb3IgbmF0aXZlIG1hYyAmIGlvc1xyXG4gICAgICAgIGlmIChKU0IpIHtcclxuICAgICAgICAgICAgaWYgKHN5cy5vcyA9PT0gbGVnYWN5Q0Muc3lzLk9TX09TWCB8fCBzeXMub3MgPT09IGxlZ2FjeUNDLnN5cy5PU19JT1MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gc2NyZWVuLndpZHRoICogZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHNjcmVlbi5oZWlnaHQgKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXZpY2UucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JlZW5XaWR0aCA9IHRoaXMuZGV2aWNlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JlZW5IZWlnaHQgPSB0aGlzLmRldmljZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IGhhY2sgZm9yIGNvY29zUGxheSAmIFhJQU9NSSBjYXVzZSBvbiBsYW5kc2NhcGUgY2FudmFzIHZhbHVlIGlzIHdyb25nXHJcbiAgICAgICAgaWYgKENPQ09TUExBWSB8fCBYSUFPTUkpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5fQ0NTZXR0aW5ncy5vcmllbnRhdGlvbiA9PT0gJ2xhbmRzY2FwZScgJiYgdGhpcy5kZXZpY2Uud2lkdGggPCB0aGlzLmRldmljZS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5kZXZpY2UuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5kZXZpY2Uud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRldmljZS5yZXNpemUod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbldpZHRoID0gdGhpcy5kZXZpY2Uud2lkdGg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmVlbkhlaWdodCA9IHRoaXMuZGV2aWNlLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0Q01EKCk7XHJcbiAgICAgICAgdGhpcy5pbml0SUEoKTtcclxuICAgICAgICB0aGlzLmluaXRQU08oKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZy5kaXNwbGF5V2F0ZXJtYXJrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFRleHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFuaW1hdGUgPSAodGltZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbmNlbEFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnRUaW1lIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVsYXBzZWRUaW1lID0gdGltZSAtIHRoaXMuc3RhcnRUaW1lO1xyXG5cclxuICAgICAgICAgICAgLyoqIHVwZGF0ZSB1bmlmb3JtICovXHJcbiAgICAgICAgICAgIGNvbnN0IFBFUkNFTlQgPSBjbGFtcDAxKGVsYXBzZWRUaW1lIC8gdGhpcy5zZXR0aW5nLnRvdGFsVGltZSk7XHJcbiAgICAgICAgICAgIGxldCB1X3AgPSBlYXNpbmcuY3ViaWNPdXQoUEVSQ0VOVCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmcuZWZmZWN0ID09PSAnTk9ORScpIHVfcCA9IDEuMDtcclxuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbC5zZXRQcm9wZXJ0eSgndV9wcmVjZW50JywgdV9wKTtcclxuICAgICAgICAgICAgdGhpcy5tYXRlcmlhbC5wYXNzZXNbMF0udXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5nLmRpc3BsYXlXYXRlcm1hcmsgJiYgdGhpcy50ZXh0TWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dE1hdGVyaWFsLnNldFByb3BlcnR5KCd1X3ByZWNlbnQnLCB1X3ApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TWF0ZXJpYWwucGFzc2VzWzBdLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZyYW1lKHRpbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsYXBzZWRUaW1lID4gdGhpcy5zZXR0aW5nLnRvdGFsVGltZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGxhc2hGaW5pc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhpZGUgKCkge1xyXG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuaGFuZGxlKTtcclxuICAgICAgICB0aGlzLmNhbmNlbEFuaW1hdGUgPSB0cnVlO1xyXG4gICAgICAgIC8vIGhlcmUgZGVsYXkgZGVzdHJvee+8mmJlY2F1c2UgaW9zIGltbWVkaWF0ZWx5IGRlc3Ryb3kgaW5wdXQgYXNzbWVibGVyIHdpbGwgY3Jhc2ggJiBuYXRpdmUgcmVuZGVyZXIgd2lsbCBtZXNzLlxyXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5kZXN0cm95LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZnJhbWUgKHRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbmNlbEFuaW1hdGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogaGFjayBmb3IgY29jb3NQbGF5ICYgWElBT01JIGNhdXNlIG9uIGxhbmRzY2FwZSBjYW52YXMgdmFsdWUgaXMgd3JvbmdcclxuICAgICAgICBpZiAoQ09DT1NQTEFZIHx8IFhJQU9NSSkge1xyXG4gICAgICAgICAgICBpZiAod2luZG93Ll9DQ1NldHRpbmdzLm9yaWVudGF0aW9uID09PSAnbGFuZHNjYXBlJyAmJiB0aGlzLmRldmljZS53aWR0aCA8IHRoaXMuZGV2aWNlLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmRldmljZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmRldmljZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGV2aWNlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuV2lkdGggPSB0aGlzLmRldmljZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2NyZWVuSGVpZ2h0ID0gdGhpcy5kZXZpY2UuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLmRldmljZTtcclxuICAgICAgICBkZXZpY2UuYWNxdWlyZSgpO1xyXG5cclxuICAgICAgICAvLyByZWNvcmQgY29tbWFuZFxyXG4gICAgICAgIGNvbnN0IGNtZEJ1ZmYgPSB0aGlzLmNtZEJ1ZmY7XHJcbiAgICAgICAgY29uc3QgZnJhbWVidWZmZXIgPSB0aGlzLmZyYW1lYnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckFyZWEgPSB0aGlzLnJlbmRlckFyZWE7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuYmVnaW4oKTtcclxuICAgICAgICBjbWRCdWZmLmJlZ2luUmVuZGVyUGFzcyhmcmFtZWJ1ZmZlci5yZW5kZXJQYXNzLCBmcmFtZWJ1ZmZlciwgcmVuZGVyQXJlYSxcclxuICAgICAgICAgICAgdGhpcy5jbGVhckNvbG9ycywgMS4wLCAwKTtcclxuXHJcbiAgICAgICAgY29uc3QgaFBhc3MgPSB0aGlzLm1hdGVyaWFsLnBhc3Nlc1swXS5oYW5kbGU7XHJcbiAgICAgICAgY29uc3QgcHNvID0gUGlwZWxpbmVTdGF0ZU1hbmFnZXIuZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlKGRldmljZSwgaFBhc3MsIHRoaXMuc2hhZGVyLCBmcmFtZWJ1ZmZlci5yZW5kZXJQYXNzLCB0aGlzLmFzc21lYmxlcik7XHJcbiAgICAgICAgY21kQnVmZi5iaW5kUGlwZWxpbmVTdGF0ZShwc28pO1xyXG4gICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTUFURVJJQUwsIERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpKTtcclxuICAgICAgICBjbWRCdWZmLmJpbmRJbnB1dEFzc2VtYmxlcih0aGlzLmFzc21lYmxlcik7XHJcbiAgICAgICAgY21kQnVmZi5kcmF3KHRoaXMuYXNzbWVibGVyKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZy5kaXNwbGF5V2F0ZXJtYXJrICYmIHRoaXMudGV4dFNoYWRlciAmJiB0aGlzLnRleHRBc3NtZWJsZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaFBhc3NUZXh0ID0gdGhpcy50ZXh0TWF0ZXJpYWwucGFzc2VzWzBdLmhhbmRsZTtcclxuICAgICAgICAgICAgY29uc3QgcHNvV2F0ZXJtYXJrID0gUGlwZWxpbmVTdGF0ZU1hbmFnZXIuZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlKGRldmljZSwgaFBhc3NUZXh0LCB0aGlzLnRleHRTaGFkZXIsIGZyYW1lYnVmZmVyLnJlbmRlclBhc3MsIHRoaXMudGV4dEFzc21lYmxlcik7XHJcbiAgICAgICAgICAgIGNtZEJ1ZmYuYmluZFBpcGVsaW5lU3RhdGUocHNvV2F0ZXJtYXJrKTtcclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5NQVRFUklBTCwgRFNQb29sLmdldChQYXNzUG9vbC5nZXQoaFBhc3NUZXh0LCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpKTtcclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kSW5wdXRBc3NlbWJsZXIodGhpcy50ZXh0QXNzbWVibGVyKTtcclxuICAgICAgICAgICAgY21kQnVmZi5kcmF3KHRoaXMudGV4dEFzc21lYmxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbWRCdWZmLmVuZFJlbmRlclBhc3MoKTtcclxuICAgICAgICBjbWRCdWZmLmVuZCgpO1xyXG5cclxuICAgICAgICBkZXZpY2UucXVldWUuc3VibWl0KFtjbWRCdWZmXSk7XHJcbiAgICAgICAgZGV2aWNlLnByZXNlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRUZXh0ICgpIHtcclxuICAgICAgICAvKiogdGV4dXJlICovXHJcbiAgICAgICAgdGhpcy50ZXh0SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy50ZXh0SW1nLndpZHRoID0gMzMwO1xyXG4gICAgICAgIHRoaXMudGV4dEltZy5oZWlnaHQgPSAzMDtcclxuICAgICAgICB0aGlzLnRleHRJbWcuc3R5bGUud2lkdGggPSBgJHt0aGlzLnRleHRJbWcud2lkdGh9YDtcclxuICAgICAgICB0aGlzLnRleHRJbWcuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy50ZXh0SW1nLmhlaWdodH1gO1xyXG5cclxuICAgICAgICBjb25zdCBjdHggPSB0aGlzLnRleHRJbWcuZ2V0Q29udGV4dCgnMmQnKSE7XHJcbiAgICAgICAgY3R4LmZvbnQgPSBgJHsxOH1weCBBcmlhbGBcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ3RvcCc7XHJcbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2AjNDI0MjQyYCc7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9ICdQb3dlcmVkIGJ5IENvY29zIENyZWF0b3IgM0QnO1xyXG4gICAgICAgIGNvbnN0IHRleHRNZXRyaWNzID0gY3R4Lm1lYXN1cmVUZXh0KHRleHQpO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0ZXh0LCAoMzMwIC0gdGV4dE1ldHJpY3Mud2lkdGgpIC8gMiwgNik7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dFJlZ2lvbiA9IG5ldyBHRlhCdWZmZXJUZXh0dXJlQ29weSgpO1xyXG4gICAgICAgIHRoaXMudGV4dFJlZ2lvbi50ZXhFeHRlbnQud2lkdGggPSB0aGlzLnRleHRJbWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy50ZXh0UmVnaW9uLnRleEV4dGVudC5oZWlnaHQgPSB0aGlzLnRleHRJbWcuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMudGV4dFJlZ2lvbi50ZXhFeHRlbnQuZGVwdGggPSAxO1xyXG5cclxuICAgICAgICB0aGlzLnRleHRUZXh0dXJlID0gdGhpcy5kZXZpY2UuY3JlYXRlVGV4dHVyZShuZXcgR0ZYVGV4dHVyZUluZm8oXHJcbiAgICAgICAgICAgIEdGWFRleHR1cmVUeXBlLlRFWDJELFxyXG4gICAgICAgICAgICBHRlhUZXh0dXJlVXNhZ2VCaXQuU0FNUExFRCB8IEdGWFRleHR1cmVVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWEZvcm1hdC5SR0JBOCxcclxuICAgICAgICAgICAgdGhpcy50ZXh0SW1nLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnRleHRJbWcuaGVpZ2h0LFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICB0aGlzLmRldmljZS5jb3B5VGV4SW1hZ2VzVG9UZXh0dXJlKFt0aGlzLnRleHRJbWddLCB0aGlzLnRleHRUZXh0dXJlLCBbdGhpcy50ZXh0UmVnaW9uXSk7XHJcblxyXG5cclxuICAgICAgICAvKiogUFNPICovXHJcbiAgICAgICAgdGhpcy50ZXh0TWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoKTtcclxuICAgICAgICB0aGlzLnRleHRNYXRlcmlhbC5pbml0aWFsaXplKHsgZWZmZWN0TmFtZTogJ3V0aWwvc3BsYXNoLXNjcmVlbicgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhc3MgPSB0aGlzLnRleHRNYXRlcmlhbC5wYXNzZXNbMF07XHJcbiAgICAgICAgY29uc3QgYmluZGluZyA9IHBhc3MuZ2V0QmluZGluZygnbWFpblRleHR1cmUnKTtcclxuICAgICAgICBwYXNzLmJpbmRUZXh0dXJlKGJpbmRpbmcsIHRoaXMudGV4dFRleHR1cmUhKTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0U2hhZGVyID0gU2hhZGVyUG9vbC5nZXQocGFzcy5nZXRTaGFkZXJWYXJpYW50KCkpO1xyXG4gICAgICAgIERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KHBhc3MuaGFuZGxlLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAvKiogQXNzZW1ibGVyICovXHJcbiAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBidWZmZXJcclxuICAgICAgICBjb25zdCB2YlN0cmlkZSA9IEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIDQ7XHJcbiAgICAgICAgY29uc3QgdmJTaXplID0gdmJTdHJpZGUgKiA0O1xyXG4gICAgICAgIHRoaXMudGV4dFZCID0gdGhpcy5kZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5WRVJURVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIHZiU2l6ZSxcclxuICAgICAgICAgICAgdmJTdHJpZGUsXHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZlcnRzID0gbmV3IEZsb2F0MzJBcnJheSg0ICogNCk7XHJcbiAgICAgICAgbGV0IHcgPSAtdGhpcy50ZXh0SW1nLndpZHRoIC8gMjtcclxuICAgICAgICBsZXQgaCA9IC10aGlzLnRleHRJbWchLmhlaWdodCAvIDI7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NyZWVuV2lkdGggPCB0aGlzLnNjcmVlbkhlaWdodCkge1xyXG4gICAgICAgICAgICB3ID0gLXRoaXMuc2NyZWVuV2lkdGggLyAyICogMC41O1xyXG4gICAgICAgICAgICBoID0gdyAvICh0aGlzLnRleHRJbWcud2lkdGggLyB0aGlzLnRleHRJbWcuaGVpZ2h0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3ID0gLXRoaXMuc2NyZWVuSGVpZ2h0IC8gMiAqIDAuNTtcclxuICAgICAgICAgICAgaCA9IHcgLyAodGhpcy50ZXh0SW1nLndpZHRoIC8gdGhpcy50ZXh0SW1nLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuID0gMDtcclxuICAgICAgICB2ZXJ0c1tuKytdID0gdzsgdmVydHNbbisrXSA9IGg7IHZlcnRzW24rK10gPSAwLjA7IHZlcnRzW24rK10gPSAxLjA7XHJcbiAgICAgICAgdmVydHNbbisrXSA9IC13OyB2ZXJ0c1tuKytdID0gaDsgdmVydHNbbisrXSA9IDEuMDsgdmVydHNbbisrXSA9IDEuMDtcclxuICAgICAgICB2ZXJ0c1tuKytdID0gdzsgdmVydHNbbisrXSA9IC1oOyB2ZXJ0c1tuKytdID0gMC4wOyB2ZXJ0c1tuKytdID0gMC4wO1xyXG4gICAgICAgIHZlcnRzW24rK10gPSAtdzsgdmVydHNbbisrXSA9IC1oOyB2ZXJ0c1tuKytdID0gMS4wOyB2ZXJ0c1tuKytdID0gMC4wO1xyXG5cclxuICAgICAgICAvLyB0cmFuc2xhdGUgdG8gYm90dG9tXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0cy5sZW5ndGg7IGkgKz0gNCkge1xyXG4gICAgICAgICAgICB2ZXJ0c1tpXSA9IHZlcnRzW2ldICsgdGhpcy5zY3JlZW5XaWR0aCAvIDI7XHJcbiAgICAgICAgICAgIHZlcnRzW2kgKyAxXSA9IHZlcnRzW2kgKyAxXSArIHRoaXMuc2NyZWVuSGVpZ2h0ICogMC4xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRvIGNsaXBzcGFjZVxyXG4gICAgICAgIGNvbnN0IHlTaWduID0gdGhpcy5kZXZpY2Uuc2NyZWVuU3BhY2VTaWduWTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRzLmxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgICAgICAgIHZlcnRzW2ldID0gdmVydHNbaV0gLyB0aGlzLnNjcmVlbldpZHRoICogMiAtIDE7XHJcbiAgICAgICAgICAgIHZlcnRzW2kgKyAxXSA9ICh2ZXJ0c1tpICsgMV0gLyB0aGlzLnNjcmVlbkhlaWdodCAqIDIgLSAxKSAqIHlTaWduO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50ZXh0VkIudXBkYXRlKHZlcnRzKTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIGluZGV4IGJ1ZmZlclxyXG4gICAgICAgIGNvbnN0IGliU3RyaWRlID0gVWludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQ7XHJcbiAgICAgICAgY29uc3QgaWJTaXplID0gaWJTdHJpZGUgKiA2O1xyXG5cclxuICAgICAgICB0aGlzLnRleHRJQiA9IHRoaXMuZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ERVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIGliU2l6ZSxcclxuICAgICAgICAgICAgaWJTdHJpZGUsXHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGljZXMgPSBuZXcgVWludDE2QXJyYXkoNik7XHJcbiAgICAgICAgaW5kaWNlc1swXSA9IDA7IGluZGljZXNbMV0gPSAxOyBpbmRpY2VzWzJdID0gMjtcclxuICAgICAgICBpbmRpY2VzWzNdID0gMTsgaW5kaWNlc1s0XSA9IDM7IGluZGljZXNbNV0gPSAyO1xyXG4gICAgICAgIHRoaXMudGV4dElCLnVwZGF0ZShpbmRpY2VzKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10gPSBbXHJcbiAgICAgICAgICAgIG5ldyBHRlhBdHRyaWJ1dGUoJ2FfcG9zaXRpb24nLCBHRlhGb3JtYXQuUkczMkYpLFxyXG4gICAgICAgICAgICBuZXcgR0ZYQXR0cmlidXRlKCdhX3RleENvb3JkJywgR0ZYRm9ybWF0LlJHMzJGKSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBjb25zdCB0ZXh0SUFJbmZvID0gbmV3IEdGWElucHV0QXNzZW1ibGVySW5mbyhhdHRyaWJ1dGVzLCBbdGhpcy50ZXh0VkJdLCB0aGlzLnRleHRJQik7XHJcbiAgICAgICAgdGhpcy50ZXh0QXNzbWVibGVyID0gdGhpcy5kZXZpY2UuY3JlYXRlSW5wdXRBc3NlbWJsZXIodGV4dElBSW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0Q01EICgpIHtcclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLmRldmljZSBhcyBHRlhEZXZpY2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJBcmVhID0gbmV3IEdGWFJlY3QoMCwgMCwgZGV2aWNlLndpZHRoLCBkZXZpY2UuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLmZyYW1lYnVmZmVyID0gdGhpcy5yb290Lm1haW5XaW5kb3chLmZyYW1lYnVmZmVyO1xyXG5cclxuICAgICAgICB0aGlzLmNtZEJ1ZmYgPSBkZXZpY2UuY29tbWFuZEJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRJQSAoKSB7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gdGhpcy5kZXZpY2UgYXMgR0ZYRGV2aWNlO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgdmVydGV4IGJ1ZmZlclxyXG4gICAgICAgIGNvbnN0IHZiU3RyaWRlID0gRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5UICogNDtcclxuICAgICAgICBjb25zdCB2YlNpemUgPSB2YlN0cmlkZSAqIDQ7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVkVSVEVYIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICB2YlNpemUsXHJcbiAgICAgICAgICAgIHZiU3RyaWRlLFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0cyA9IG5ldyBGbG9hdDMyQXJyYXkoNCAqIDQpO1xyXG4gICAgICAgIGxldCB3ID0gLXRoaXMuaW1hZ2Uud2lkdGggLyAyO1xyXG4gICAgICAgIGxldCBoID0gLXRoaXMuaW1hZ2UhLmhlaWdodCAvIDI7XHJcbiAgICAgICAgaWYgKHRoaXMuc2NyZWVuV2lkdGggPCB0aGlzLnNjcmVlbkhlaWdodCkge1xyXG4gICAgICAgICAgICB3ID0gLXRoaXMuc2NyZWVuV2lkdGggLyAyICogdGhpcy5zZXR0aW5nLmRpc3BsYXlSYXRpbztcclxuICAgICAgICAgICAgaCA9IHcgLyAodGhpcy5pbWFnZS53aWR0aCAvIHRoaXMuaW1hZ2UuaGVpZ2h0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3ID0gLXRoaXMuc2NyZWVuSGVpZ2h0IC8gMiAqIHRoaXMuc2V0dGluZy5kaXNwbGF5UmF0aW87XHJcbiAgICAgICAgICAgIGggPSB3IC8gKHRoaXMuaW1hZ2Uud2lkdGggLyB0aGlzLmltYWdlLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuID0gMDtcclxuICAgICAgICB2ZXJ0c1tuKytdID0gdzsgdmVydHNbbisrXSA9IGg7IHZlcnRzW24rK10gPSAwLjA7IHZlcnRzW24rK10gPSAxLjA7XHJcbiAgICAgICAgdmVydHNbbisrXSA9IC13OyB2ZXJ0c1tuKytdID0gaDsgdmVydHNbbisrXSA9IDEuMDsgdmVydHNbbisrXSA9IDEuMDtcclxuICAgICAgICB2ZXJ0c1tuKytdID0gdzsgdmVydHNbbisrXSA9IC1oOyB2ZXJ0c1tuKytdID0gMC4wOyB2ZXJ0c1tuKytdID0gMDtcclxuICAgICAgICB2ZXJ0c1tuKytdID0gLXc7IHZlcnRzW24rK10gPSAtaDsgdmVydHNbbisrXSA9IDEuMDsgdmVydHNbbisrXSA9IDA7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byBjZW50ZXJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRzLmxlbmd0aDsgaSArPSA0KSB7XHJcbiAgICAgICAgICAgIHZlcnRzW2ldID0gdmVydHNbaV0gKyB0aGlzLnNjcmVlbldpZHRoIC8gMjtcclxuICAgICAgICAgICAgdmVydHNbaSArIDFdID0gdmVydHNbaSArIDFdICsgdGhpcy5zY3JlZW5IZWlnaHQgLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRvIGNsaXBzcGFjZVxyXG4gICAgICAgIGNvbnN0IHlTaWduID0gZGV2aWNlLnNjcmVlblNwYWNlU2lnblk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0cy5sZW5ndGg7IGkgKz0gNCkge1xyXG4gICAgICAgICAgICB2ZXJ0c1tpXSA9IHZlcnRzW2ldIC8gdGhpcy5zY3JlZW5XaWR0aCAqIDIgLSAxO1xyXG4gICAgICAgICAgICB2ZXJ0c1tpICsgMV0gPSAodmVydHNbaSArIDFdIC8gdGhpcy5zY3JlZW5IZWlnaHQgKiAyIC0gMSkgKiB5U2lnbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4QnVmZmVycy51cGRhdGUodmVydHMpO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgaW5kZXggYnVmZmVyXHJcbiAgICAgICAgY29uc3QgaWJTdHJpZGUgPSBVaW50MTZBcnJheS5CWVRFU19QRVJfRUxFTUVOVDtcclxuICAgICAgICBjb25zdCBpYlNpemUgPSBpYlN0cmlkZSAqIDY7XHJcblxyXG4gICAgICAgIHRoaXMuaW5kaWNlc0J1ZmZlcnMgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5JTkRFWCB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgaWJTaXplLFxyXG4gICAgICAgICAgICBpYlN0cmlkZSxcclxuICAgICAgICApKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kaWNlcyA9IG5ldyBVaW50MTZBcnJheSg2KTtcclxuICAgICAgICBpbmRpY2VzWzBdID0gMDsgaW5kaWNlc1sxXSA9IDE7IGluZGljZXNbMl0gPSAyO1xyXG4gICAgICAgIGluZGljZXNbM10gPSAxOyBpbmRpY2VzWzRdID0gMzsgaW5kaWNlc1s1XSA9IDI7XHJcbiAgICAgICAgdGhpcy5pbmRpY2VzQnVmZmVycy51cGRhdGUoaW5kaWNlcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXM6IEdGWEF0dHJpYnV0ZVtdID0gW1xyXG4gICAgICAgICAgICBuZXcgR0ZYQXR0cmlidXRlKCdhX3Bvc2l0aW9uJywgR0ZYRm9ybWF0LlJHMzJGKSxcclxuICAgICAgICAgICAgbmV3IEdGWEF0dHJpYnV0ZSgnYV90ZXhDb29yZCcsIEdGWEZvcm1hdC5SRzMyRiksXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgY29uc3QgSUFJbmZvID0gbmV3IEdGWElucHV0QXNzZW1ibGVySW5mbyhhdHRyaWJ1dGVzLCBbdGhpcy52ZXJ0ZXhCdWZmZXJzXSwgdGhpcy5pbmRpY2VzQnVmZmVycyk7XHJcbiAgICAgICAgdGhpcy5hc3NtZWJsZXIgPSBkZXZpY2UuY3JlYXRlSW5wdXRBc3NlbWJsZXIoSUFJbmZvKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRQU08gKCkge1xyXG5cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLmRldmljZSBhcyBHRlhEZXZpY2U7XHJcblxyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoKTtcclxuICAgICAgICB0aGlzLm1hdGVyaWFsLmluaXRpYWxpemUoeyBlZmZlY3ROYW1lOiAndXRpbC9zcGxhc2gtc2NyZWVuJyB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2FtcGxlckluZm8gPSBuZXcgR0ZYU2FtcGxlckluZm8oKTtcclxuICAgICAgICBzYW1wbGVySW5mby5hZGRyZXNzVSA9IEdGWEFkZHJlc3MuQ0xBTVA7XHJcbiAgICAgICAgc2FtcGxlckluZm8uYWRkcmVzc1YgPSBHRlhBZGRyZXNzLkNMQU1QO1xyXG4gICAgICAgIHRoaXMuc2FtcGxlciA9IGRldmljZS5jcmVhdGVTYW1wbGVyKHNhbXBsZXJJbmZvKTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gZGV2aWNlLmNyZWF0ZVRleHR1cmUobmV3IEdGWFRleHR1cmVJbmZvKFxyXG4gICAgICAgICAgICBHRlhUZXh0dXJlVHlwZS5URVgyRCxcclxuICAgICAgICAgICAgR0ZYVGV4dHVyZVVzYWdlQml0LlNBTVBMRUQgfCBHRlhUZXh0dXJlVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhGb3JtYXQuUkdCQTgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICBjb25zdCBwYXNzID0gdGhpcy5tYXRlcmlhbC5wYXNzZXNbMF07XHJcbiAgICAgICAgY29uc3QgYmluZGluZyA9IHBhc3MuZ2V0QmluZGluZygnbWFpblRleHR1cmUnKTtcclxuICAgICAgICBwYXNzLmJpbmRUZXh0dXJlKGJpbmRpbmcsIHRoaXMudGV4dHVyZSEpO1xyXG5cclxuICAgICAgICB0aGlzLnNoYWRlciA9IFNoYWRlclBvb2wuZ2V0KHBhc3MuZ2V0U2hhZGVyVmFyaWFudCgpKTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdG9yU2V0ID0gRFNQb29sLmdldChQYXNzUG9vbC5nZXQocGFzcy5oYW5kbGUsIFBhc3NWaWV3LkRFU0NSSVBUT1JfU0VUKSk7XHJcbiAgICAgICAgZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihiaW5kaW5nISwgdGhpcy5zYW1wbGVyKTtcclxuICAgICAgICBkZXNjcmlwdG9yU2V0LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnJlZ2lvbiA9IG5ldyBHRlhCdWZmZXJUZXh0dXJlQ29weSgpO1xyXG4gICAgICAgIHRoaXMucmVnaW9uLnRleEV4dGVudC53aWR0aCA9IHRoaXMuaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5yZWdpb24udGV4RXh0ZW50LmhlaWdodCA9IHRoaXMuaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMucmVnaW9uLnRleEV4dGVudC5kZXB0aCA9IDE7XHJcbiAgICAgICAgZGV2aWNlLmNvcHlUZXhJbWFnZXNUb1RleHR1cmUoW3RoaXMuaW1hZ2UhXSwgdGhpcy50ZXh0dXJlLCBbdGhpcy5yZWdpb25dKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuY2FsbEJhY2sgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2xlYXJDb2xvcnMgPSBudWxsITtcclxuICAgICAgICB0aGlzLmRldmljZSA9IG51bGwhO1xyXG4gICAgICAgIHRoaXMuaW1hZ2UgPSBudWxsITtcclxuICAgICAgICB0aGlzLmZyYW1lYnVmZmVyID0gbnVsbCE7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJBcmVhID0gbnVsbCE7XHJcbiAgICAgICAgdGhpcy5yZWdpb24gPSBudWxsITtcclxuXHJcbiAgICAgICAgdGhpcy5jbWRCdWZmID0gbnVsbCE7XHJcblxyXG4gICAgICAgIHRoaXMuc2hhZGVyID0gbnVsbCE7XHJcblxyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMubWF0ZXJpYWwgPSBudWxsITtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0dXJlLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnRleHR1cmUgPSBudWxsITtcclxuXHJcbiAgICAgICAgdGhpcy5hc3NtZWJsZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuYXNzbWVibGVyID0gbnVsbCE7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4QnVmZmVycy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gbnVsbCE7XHJcblxyXG4gICAgICAgIHRoaXMuaW5kaWNlc0J1ZmZlcnMuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuaW5kaWNlc0J1ZmZlcnMgPSBudWxsITtcclxuXHJcbiAgICAgICAgdGhpcy5zYW1wbGVyLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnNhbXBsZXIgPSBudWxsITtcclxuXHJcbiAgICAgICAgLyoqIHRleHQgKi9cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5nLmRpc3BsYXlXYXRlcm1hcmsgJiYgdGhpcy50ZXh0SW1nKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dEltZyA9IG51bGwhO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRSZWdpb24gPSBudWxsITtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGV4dFNoYWRlciA9IG51bGwhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50ZXh0TWF0ZXJpYWwuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRNYXRlcmlhbCA9IG51bGwhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50ZXh0VGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dFRleHR1cmUgPSBudWxsITtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGV4dEFzc21lYmxlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dEFzc21lYmxlciA9IG51bGwhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50ZXh0VkIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRWQiA9IG51bGwhO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50ZXh0SUIuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRJQiA9IG51bGwhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nID0gbnVsbCE7XHJcbiAgICAgICAgU3BsYXNoU2NyZWVuLl9pbnMgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnM6IFNwbGFzaFNjcmVlbiB8IG51bGw7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgaW5zdGFuY2UgKCkge1xyXG4gICAgICAgIGlmIChTcGxhc2hTY3JlZW4uX2lucyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIFNwbGFzaFNjcmVlbi5faW5zID0gbmV3IFNwbGFzaFNjcmVlbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gU3BsYXNoU2NyZWVuLl9pbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvciAoKSB7IH07XHJcbn1cclxuXHJcbmxlZ2FjeUNDLmludGVybmFsLlNwbGFzaFNjcmVlbiA9IFNwbGFzaFNjcmVlbjtcclxuIl19