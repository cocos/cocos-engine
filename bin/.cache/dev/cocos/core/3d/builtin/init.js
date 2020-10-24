(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/image-asset.js", "../../assets/sprite-frame.js", "../../assets/texture-2d.js", "../../assets/texture-cube.js", "./effects.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/image-asset.js"), require("../../assets/sprite-frame.js"), require("../../assets/texture-2d.js"), require("../../assets/texture-cube.js"), require("./effects.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.imageAsset, global.spriteFrame, global.texture2d, global.textureCube, global.effects, global.globalExports);
    global.init = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _imageAsset, _spriteFrame, _texture2d, _textureCube, _effects, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.builtinResMgr = void 0;
  _effects = _interopRequireDefault(_effects);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BuiltinResMgr = /*#__PURE__*/function () {
    function BuiltinResMgr() {
      _classCallCheck(this, BuiltinResMgr);

      this._device = null;
      this._resources = {};
    }

    _createClass(BuiltinResMgr, [{
      key: "initBuiltinRes",
      // this should be called after renderer initialized
      value: function initBuiltinRes(device) {
        this._device = device;
        var resources = this._resources;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var imgAsset = new _imageAsset.ImageAsset(canvas);
        var l = canvas.width = canvas.height = 2; // ============================
        // builtin textures
        // ============================
        // black texture

        context.fillStyle = '#000';
        context.fillRect(0, 0, l, l);
        var blackTexture = new _texture2d.Texture2D();
        blackTexture._uuid = 'black-texture';
        blackTexture.image = imgAsset;
        resources[blackTexture._uuid] = blackTexture; // empty texture

        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, l, l);
        var emptyBuffer = new Uint8Array(4 * 4);

        for (var i = 0; i < emptyBuffer.length; ++i) {
          emptyBuffer[i] = 0;
        }

        var emptyTexture = new _texture2d.Texture2D();
        emptyTexture._uuid = 'empty-texture';
        emptyTexture.image = imgAsset;
        emptyTexture.uploadData(emptyBuffer);
        resources[emptyTexture._uuid] = emptyTexture; // black texture

        var blackCubeTexture = new _textureCube.TextureCube();
        blackCubeTexture._uuid = 'black-cube-texture';
        blackCubeTexture.setMipFilter(_textureCube.TextureCube.Filter.LINEAR);
        blackCubeTexture.image = {
          front: new _imageAsset.ImageAsset(canvas),
          back: new _imageAsset.ImageAsset(canvas),
          left: new _imageAsset.ImageAsset(canvas),
          right: new _imageAsset.ImageAsset(canvas),
          top: new _imageAsset.ImageAsset(canvas),
          bottom: new _imageAsset.ImageAsset(canvas)
        };
        resources[blackCubeTexture._uuid] = blackCubeTexture; // grey texture

        context.fillStyle = '#777';
        context.fillRect(0, 0, l, l);
        var greyTexture = new _texture2d.Texture2D();
        greyTexture._uuid = 'grey-texture';
        greyTexture.image = imgAsset;
        resources[greyTexture._uuid] = greyTexture; // white texture

        context.fillStyle = '#fff';
        context.fillRect(0, 0, l, l);
        var whiteTexture = new _texture2d.Texture2D();
        whiteTexture._uuid = 'white-texture';
        whiteTexture.image = imgAsset;
        resources[whiteTexture._uuid] = whiteTexture; // white cube texture

        var whiteCubeTexture = new _textureCube.TextureCube();
        whiteCubeTexture._uuid = 'white-cube-texture';
        whiteCubeTexture.setMipFilter(_textureCube.TextureCube.Filter.LINEAR);
        whiteCubeTexture.image = {
          front: new _imageAsset.ImageAsset(canvas),
          back: new _imageAsset.ImageAsset(canvas),
          left: new _imageAsset.ImageAsset(canvas),
          right: new _imageAsset.ImageAsset(canvas),
          top: new _imageAsset.ImageAsset(canvas),
          bottom: new _imageAsset.ImageAsset(canvas)
        };
        resources[whiteCubeTexture._uuid] = whiteCubeTexture; // normal texture

        context.fillStyle = '#7f7fff';
        context.fillRect(0, 0, l, l);
        var normalTexture = new _texture2d.Texture2D();
        normalTexture._uuid = 'normal-texture';
        normalTexture.image = imgAsset;
        resources[normalTexture._uuid] = normalTexture; // default texture

        canvas.width = canvas.height = 16;
        context.fillStyle = '#ddd';
        context.fillRect(0, 0, 16, 16);
        context.fillStyle = '#555';
        context.fillRect(0, 0, 8, 8);
        context.fillStyle = '#555';
        context.fillRect(8, 8, 8, 8);
        var defaultTexture = new _texture2d.Texture2D();
        defaultTexture._uuid = 'default-texture';
        defaultTexture.image = imgAsset;
        resources[defaultTexture._uuid] = defaultTexture; // default cube texture

        var defaultCubeTexture = new _textureCube.TextureCube();
        defaultCubeTexture.setMipFilter(_textureCube.TextureCube.Filter.LINEAR);
        defaultCubeTexture._uuid = 'default-cube-texture';
        defaultCubeTexture.image = {
          front: new _imageAsset.ImageAsset(canvas),
          back: new _imageAsset.ImageAsset(canvas),
          left: new _imageAsset.ImageAsset(canvas),
          right: new _imageAsset.ImageAsset(canvas),
          top: new _imageAsset.ImageAsset(canvas),
          bottom: new _imageAsset.ImageAsset(canvas)
        };
        resources[defaultCubeTexture._uuid] = defaultCubeTexture;
        var spriteFrame = new _spriteFrame.SpriteFrame();
        var texture = imgAsset._texture;
        spriteFrame.texture = texture;
        spriteFrame._uuid = 'default-spriteframe';
        resources[spriteFrame._uuid] = spriteFrame; // builtin effects

        _effects.default.forEach(function (e) {
          var effect = Object.assign(new _globalExports.legacyCC.EffectAsset(), e);
          effect.onLoaded();
        }); // standard material


        var standardMtl = new _globalExports.legacyCC.Material();
        standardMtl._uuid = 'standard-material';
        standardMtl.initialize({
          effectName: 'builtin-standard'
        });
        resources[standardMtl._uuid] = standardMtl; // material indicating missing effect (yellow)

        var missingEfxMtl = new _globalExports.legacyCC.Material();
        missingEfxMtl._uuid = 'missing-effect-material';
        missingEfxMtl.initialize({
          effectName: 'builtin-unlit',
          defines: {
            USE_COLOR: true
          }
        });
        missingEfxMtl.setProperty('mainColor', _globalExports.legacyCC.color('#ffff00'));
        resources[missingEfxMtl._uuid] = missingEfxMtl; // material indicating missing material (purple)

        var missingMtl = new _globalExports.legacyCC.Material();
        missingMtl._uuid = 'missing-material';
        missingMtl.initialize({
          effectName: 'builtin-unlit',
          defines: {
            USE_COLOR: true
          }
        });
        missingMtl.setProperty('mainColor', _globalExports.legacyCC.color('#ff00ff'));
        resources[missingMtl._uuid] = missingMtl; // sprite material

        var spriteMtl = new _globalExports.legacyCC.Material();
        spriteMtl._uuid = 'ui-base-material';
        spriteMtl.initialize({
          defines: {
            USE_TEXTURE: false
          },
          effectName: 'builtin-sprite'
        });
        resources[spriteMtl._uuid] = spriteMtl; // sprite material

        var spriteColorMtl = new _globalExports.legacyCC.Material();
        spriteColorMtl._uuid = 'ui-sprite-material';
        spriteColorMtl.initialize({
          defines: {
            USE_TEXTURE: true,
            CC_USE_EMBEDDED_ALPHA: false,
            IS_GRAY: false
          },
          effectName: 'builtin-sprite'
        });
        resources[spriteColorMtl._uuid] = spriteColorMtl; // sprite gray material

        var spriteGrayMtl = new _globalExports.legacyCC.Material();
        spriteGrayMtl._uuid = 'ui-sprite-gray-material';
        spriteGrayMtl.initialize({
          defines: {
            USE_TEXTURE: true,
            CC_USE_EMBEDDED_ALPHA: false,
            IS_GRAY: true
          },
          effectName: 'builtin-sprite'
        });
        resources[spriteGrayMtl._uuid] = spriteGrayMtl; // sprite alpha material

        var spriteAlphaMtl = new _globalExports.legacyCC.Material();
        spriteAlphaMtl._uuid = 'ui-sprite-alpha-sep-material';
        spriteAlphaMtl.initialize({
          defines: {
            USE_TEXTURE: true,
            CC_USE_EMBEDDED_ALPHA: true,
            IS_GRAY: false
          },
          effectName: 'builtin-sprite'
        });
        resources[spriteAlphaMtl._uuid] = spriteAlphaMtl; // sprite alpha & gray material

        var spriteAlphaGrayMtl = new _globalExports.legacyCC.Material();
        spriteAlphaGrayMtl._uuid = 'ui-sprite-gray-alpha-sep-material';
        spriteAlphaGrayMtl.initialize({
          defines: {
            USE_TEXTURE: true,
            CC_USE_EMBEDDED_ALPHA: true,
            IS_GRAY: true
          },
          effectName: 'builtin-sprite'
        });
        resources[spriteAlphaGrayMtl._uuid] = spriteAlphaGrayMtl; // ui graphics material

        var defaultGraphicsMtl = new _globalExports.legacyCC.Material();
        defaultGraphicsMtl._uuid = 'ui-graphics-material';
        defaultGraphicsMtl.initialize({
          effectName: 'builtin-graphics'
        });
        resources[defaultGraphicsMtl._uuid] = defaultGraphicsMtl; // default particle material

        var defaultParticleMtl = new _globalExports.legacyCC.Material();
        defaultParticleMtl._uuid = 'default-particle-material';
        defaultParticleMtl.initialize({
          effectName: 'builtin-particle'
        });
        resources[defaultParticleMtl._uuid] = defaultParticleMtl; // default particle gpu material

        var defaultParticleGPUMtl = new _globalExports.legacyCC.Material();
        defaultParticleGPUMtl._uuid = 'default-particle-gpu-material';
        defaultParticleGPUMtl.initialize({
          effectName: 'builtin-particle-gpu'
        });
        resources[defaultParticleGPUMtl._uuid] = defaultParticleGPUMtl; // default particle material

        var defaultTrailMtl = new _globalExports.legacyCC.Material();
        defaultTrailMtl._uuid = 'default-trail-material';
        defaultTrailMtl.initialize({
          effectName: 'builtin-particle-trail'
        });
        resources[defaultTrailMtl._uuid] = defaultTrailMtl; // default particle material

        var defaultBillboardMtl = new _globalExports.legacyCC.Material();
        defaultBillboardMtl._uuid = 'default-billboard-material';
        defaultBillboardMtl.initialize({
          effectName: 'builtin-billboard'
        });
        resources[defaultBillboardMtl._uuid] = defaultBillboardMtl;
      }
    }, {
      key: "get",
      value: function get(uuid) {
        return this._resources[uuid];
      }
    }]);

    return BuiltinResMgr;
  }();

  var builtinResMgr = _globalExports.legacyCC.builtinResMgr = new BuiltinResMgr();
  _exports.builtinResMgr = builtinResMgr;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvYnVpbHRpbi9pbml0LnRzIl0sIm5hbWVzIjpbIkJ1aWx0aW5SZXNNZ3IiLCJfZGV2aWNlIiwiX3Jlc291cmNlcyIsImRldmljZSIsInJlc291cmNlcyIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwiaW1nQXNzZXQiLCJJbWFnZUFzc2V0IiwibCIsIndpZHRoIiwiaGVpZ2h0IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJibGFja1RleHR1cmUiLCJUZXh0dXJlMkQiLCJfdXVpZCIsImltYWdlIiwiZW1wdHlCdWZmZXIiLCJVaW50OEFycmF5IiwiaSIsImxlbmd0aCIsImVtcHR5VGV4dHVyZSIsInVwbG9hZERhdGEiLCJibGFja0N1YmVUZXh0dXJlIiwiVGV4dHVyZUN1YmUiLCJzZXRNaXBGaWx0ZXIiLCJGaWx0ZXIiLCJMSU5FQVIiLCJmcm9udCIsImJhY2siLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJncmV5VGV4dHVyZSIsIndoaXRlVGV4dHVyZSIsIndoaXRlQ3ViZVRleHR1cmUiLCJub3JtYWxUZXh0dXJlIiwiZGVmYXVsdFRleHR1cmUiLCJkZWZhdWx0Q3ViZVRleHR1cmUiLCJzcHJpdGVGcmFtZSIsIlNwcml0ZUZyYW1lIiwidGV4dHVyZSIsIl90ZXh0dXJlIiwiZWZmZWN0cyIsImZvckVhY2giLCJlIiwiZWZmZWN0IiwiT2JqZWN0IiwiYXNzaWduIiwibGVnYWN5Q0MiLCJFZmZlY3RBc3NldCIsIm9uTG9hZGVkIiwic3RhbmRhcmRNdGwiLCJNYXRlcmlhbCIsImluaXRpYWxpemUiLCJlZmZlY3ROYW1lIiwibWlzc2luZ0VmeE10bCIsImRlZmluZXMiLCJVU0VfQ09MT1IiLCJzZXRQcm9wZXJ0eSIsImNvbG9yIiwibWlzc2luZ010bCIsInNwcml0ZU10bCIsIlVTRV9URVhUVVJFIiwic3ByaXRlQ29sb3JNdGwiLCJDQ19VU0VfRU1CRURERURfQUxQSEEiLCJJU19HUkFZIiwic3ByaXRlR3JheU10bCIsInNwcml0ZUFscGhhTXRsIiwic3ByaXRlQWxwaGFHcmF5TXRsIiwiZGVmYXVsdEdyYXBoaWNzTXRsIiwiZGVmYXVsdFBhcnRpY2xlTXRsIiwiZGVmYXVsdFBhcnRpY2xlR1BVTXRsIiwiZGVmYXVsdFRyYWlsTXRsIiwiZGVmYXVsdEJpbGxib2FyZE10bCIsInV1aWQiLCJidWlsdGluUmVzTWdyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQVNNQSxhOzs7O1dBQ1FDLE8sR0FBNEIsSTtXQUM1QkMsVSxHQUFvQyxFOzs7OztBQUU5QztxQ0FDdUJDLE0sRUFBbUI7QUFDdEMsYUFBS0YsT0FBTCxHQUFlRSxNQUFmO0FBQ0EsWUFBTUMsU0FBUyxHQUFHLEtBQUtGLFVBQXZCO0FBQ0EsWUFBTUcsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUNBLFlBQU1DLE9BQU8sR0FBR0gsTUFBTSxDQUFDSSxVQUFQLENBQWtCLElBQWxCLENBQWhCO0FBQ0EsWUFBTUMsUUFBUSxHQUFHLElBQUlDLHNCQUFKLENBQWVOLE1BQWYsQ0FBakI7QUFDQSxZQUFNTyxDQUFDLEdBQUdQLE1BQU0sQ0FBQ1EsS0FBUCxHQUFlUixNQUFNLENBQUNTLE1BQVAsR0FBZ0IsQ0FBekMsQ0FOc0MsQ0FRdEM7QUFDQTtBQUNBO0FBRUE7O0FBQ0FOLFFBQUFBLE9BQU8sQ0FBQ08sU0FBUixHQUFvQixNQUFwQjtBQUNBUCxRQUFBQSxPQUFPLENBQUNRLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUJKLENBQXZCLEVBQTBCQSxDQUExQjtBQUNBLFlBQU1LLFlBQVksR0FBRyxJQUFJQyxvQkFBSixFQUFyQjtBQUNBRCxRQUFBQSxZQUFZLENBQUNFLEtBQWIsR0FBcUIsZUFBckI7QUFDQUYsUUFBQUEsWUFBWSxDQUFDRyxLQUFiLEdBQXFCVixRQUFyQjtBQUNB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QUFtQixDQUFDcEIsVUFBcEIsQ0FBK0I7QUFBRUMsVUFBQUEsVUFBVSxFQUFFO0FBQWQsU0FBL0I7QUFDQXhELFFBQUFBLFNBQVMsQ0FBQzJFLG1CQUFtQixDQUFDNUQsS0FBckIsQ0FBVCxHQUF1QzRELG1CQUF2QztBQUNIOzs7MEJBRTRCQyxJLEVBQWM7QUFDdkMsZUFBTyxLQUFLOUUsVUFBTCxDQUFnQjhFLElBQWhCLENBQVA7QUFDSDs7Ozs7O0FBR0wsTUFBTUMsYUFBYSxHQUFHM0Isd0JBQVMyQixhQUFULEdBQXlCLElBQUlqRixhQUFKLEVBQS9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuLi8uLi9hc3NldHMvYXNzZXQnO1xyXG5pbXBvcnQgeyBJbWFnZUFzc2V0IH0gZnJvbSAnLi4vLi4vYXNzZXRzL2ltYWdlLWFzc2V0JztcclxuaW1wb3J0IHsgU3ByaXRlRnJhbWUgfSBmcm9tICcuLi8uLi9hc3NldHMvc3ByaXRlLWZyYW1lJztcclxuaW1wb3J0IHsgVGV4dHVyZTJEIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3RleHR1cmUtMmQnO1xyXG5pbXBvcnQgeyBUZXh0dXJlQ3ViZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy90ZXh0dXJlLWN1YmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuLi8uLi9nZngvZGV2aWNlJztcclxuaW1wb3J0IGVmZmVjdHMgZnJvbSAnLi9lZmZlY3RzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jbGFzcyBCdWlsdGluUmVzTWdyIHtcclxuICAgIHByb3RlY3RlZCBfZGV2aWNlOiBHRlhEZXZpY2UgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfcmVzb3VyY2VzOiBSZWNvcmQ8c3RyaW5nLCBBc3NldD4gPSB7fTtcclxuXHJcbiAgICAvLyB0aGlzIHNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgcmVuZGVyZXIgaW5pdGlhbGl6ZWRcclxuICAgIHB1YmxpYyBpbml0QnVpbHRpblJlcyAoZGV2aWNlOiBHRlhEZXZpY2UpIHtcclxuICAgICAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICAgICAgY29uc3QgcmVzb3VyY2VzID0gdGhpcy5fcmVzb3VyY2VzO1xyXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSE7XHJcbiAgICAgICAgY29uc3QgaW1nQXNzZXQgPSBuZXcgSW1hZ2VBc3NldChjYW52YXMpO1xyXG4gICAgICAgIGNvbnN0IGwgPSBjYW52YXMud2lkdGggPSBjYW52YXMuaGVpZ2h0ID0gMjtcclxuXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICAgIC8vIGJ1aWx0aW4gdGV4dHVyZXNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIC8vIGJsYWNrIHRleHR1cmVcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwJztcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGwsIGwpO1xyXG4gICAgICAgIGNvbnN0IGJsYWNrVGV4dHVyZSA9IG5ldyBUZXh0dXJlMkQoKTtcclxuICAgICAgICBibGFja1RleHR1cmUuX3V1aWQgPSAnYmxhY2stdGV4dHVyZSc7XHJcbiAgICAgICAgYmxhY2tUZXh0dXJlLmltYWdlID0gaW1nQXNzZXQ7XHJcbiAgICAgICAgcmVzb3VyY2VzW2JsYWNrVGV4dHVyZS5fdXVpZF0gPSBibGFja1RleHR1cmU7XHJcblxyXG4gICAgICAgIC8vIGVtcHR5IHRleHR1cmVcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLDApJztcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGwsIGwpO1xyXG4gICAgICAgIGNvbnN0IGVtcHR5QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoNCAqIDQpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW1wdHlCdWZmZXIubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgZW1wdHlCdWZmZXJbaV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBlbXB0eVRleHR1cmUgPSBuZXcgVGV4dHVyZTJEKCk7XHJcbiAgICAgICAgZW1wdHlUZXh0dXJlLl91dWlkID0gJ2VtcHR5LXRleHR1cmUnO1xyXG4gICAgICAgIGVtcHR5VGV4dHVyZS5pbWFnZSA9IGltZ0Fzc2V0O1xyXG4gICAgICAgIGVtcHR5VGV4dHVyZS51cGxvYWREYXRhKGVtcHR5QnVmZmVyKTtcclxuICAgICAgICByZXNvdXJjZXNbZW1wdHlUZXh0dXJlLl91dWlkXSA9IGVtcHR5VGV4dHVyZTtcclxuXHJcbiAgICAgICAgLy8gYmxhY2sgdGV4dHVyZVxyXG4gICAgICAgIGNvbnN0IGJsYWNrQ3ViZVRleHR1cmUgPSBuZXcgVGV4dHVyZUN1YmUoKTtcclxuICAgICAgICBibGFja0N1YmVUZXh0dXJlLl91dWlkID0gJ2JsYWNrLWN1YmUtdGV4dHVyZSc7XHJcbiAgICAgICAgYmxhY2tDdWJlVGV4dHVyZS5zZXRNaXBGaWx0ZXIoVGV4dHVyZUN1YmUuRmlsdGVyLkxJTkVBUik7XHJcbiAgICAgICAgYmxhY2tDdWJlVGV4dHVyZS5pbWFnZSA9IHtcclxuICAgICAgICAgICAgZnJvbnQ6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIGJhY2s6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIGxlZnQ6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIHJpZ2h0OiBuZXcgSW1hZ2VBc3NldChjYW52YXMpLFxyXG4gICAgICAgICAgICB0b3A6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIGJvdHRvbTogbmV3IEltYWdlQXNzZXQoY2FudmFzKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlc291cmNlc1tibGFja0N1YmVUZXh0dXJlLl91dWlkXSA9IGJsYWNrQ3ViZVRleHR1cmU7XHJcblxyXG4gICAgICAgIC8vIGdyZXkgdGV4dHVyZVxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyM3NzcnO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgbCwgbCk7XHJcbiAgICAgICAgY29uc3QgZ3JleVRleHR1cmUgPSBuZXcgVGV4dHVyZTJEKCk7XHJcbiAgICAgICAgZ3JleVRleHR1cmUuX3V1aWQgPSAnZ3JleS10ZXh0dXJlJztcclxuICAgICAgICBncmV5VGV4dHVyZS5pbWFnZSA9IGltZ0Fzc2V0O1xyXG4gICAgICAgIHJlc291cmNlc1tncmV5VGV4dHVyZS5fdXVpZF0gPSBncmV5VGV4dHVyZTtcclxuXHJcbiAgICAgICAgLy8gd2hpdGUgdGV4dHVyZVxyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgbCwgbCk7XHJcbiAgICAgICAgY29uc3Qgd2hpdGVUZXh0dXJlID0gbmV3IFRleHR1cmUyRCgpO1xyXG4gICAgICAgIHdoaXRlVGV4dHVyZS5fdXVpZCA9ICd3aGl0ZS10ZXh0dXJlJztcclxuICAgICAgICB3aGl0ZVRleHR1cmUuaW1hZ2UgPSBpbWdBc3NldDtcclxuICAgICAgICByZXNvdXJjZXNbd2hpdGVUZXh0dXJlLl91dWlkXSA9IHdoaXRlVGV4dHVyZTtcclxuXHJcbiAgICAgICAgLy8gd2hpdGUgY3ViZSB0ZXh0dXJlXHJcbiAgICAgICAgY29uc3Qgd2hpdGVDdWJlVGV4dHVyZSA9IG5ldyBUZXh0dXJlQ3ViZSgpO1xyXG4gICAgICAgIHdoaXRlQ3ViZVRleHR1cmUuX3V1aWQgPSAnd2hpdGUtY3ViZS10ZXh0dXJlJztcclxuICAgICAgICB3aGl0ZUN1YmVUZXh0dXJlLnNldE1pcEZpbHRlcihUZXh0dXJlQ3ViZS5GaWx0ZXIuTElORUFSKTtcclxuICAgICAgICB3aGl0ZUN1YmVUZXh0dXJlLmltYWdlID0ge1xyXG4gICAgICAgICAgICBmcm9udDogbmV3IEltYWdlQXNzZXQoY2FudmFzKSxcclxuICAgICAgICAgICAgYmFjazogbmV3IEltYWdlQXNzZXQoY2FudmFzKSxcclxuICAgICAgICAgICAgbGVmdDogbmV3IEltYWdlQXNzZXQoY2FudmFzKSxcclxuICAgICAgICAgICAgcmlnaHQ6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIHRvcDogbmV3IEltYWdlQXNzZXQoY2FudmFzKSxcclxuICAgICAgICAgICAgYm90dG9tOiBuZXcgSW1hZ2VBc3NldChjYW52YXMpLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzb3VyY2VzW3doaXRlQ3ViZVRleHR1cmUuX3V1aWRdID0gd2hpdGVDdWJlVGV4dHVyZTtcclxuXHJcbiAgICAgICAgLy8gbm9ybWFsIHRleHR1cmVcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjN2Y3ZmZmJztcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGwsIGwpO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbFRleHR1cmUgPSBuZXcgVGV4dHVyZTJEKCk7XHJcbiAgICAgICAgbm9ybWFsVGV4dHVyZS5fdXVpZCA9ICdub3JtYWwtdGV4dHVyZSc7XHJcbiAgICAgICAgbm9ybWFsVGV4dHVyZS5pbWFnZSA9IGltZ0Fzc2V0O1xyXG4gICAgICAgIHJlc291cmNlc1tub3JtYWxUZXh0dXJlLl91dWlkXSA9IG5vcm1hbFRleHR1cmU7XHJcblxyXG4gICAgICAgIC8vIGRlZmF1bHQgdGV4dHVyZVxyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhcy5oZWlnaHQgPSAxNjtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjZGRkJztcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIDE2LCAxNik7XHJcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzU1NSc7XHJcbiAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCA4LCA4KTtcclxuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjNTU1JztcclxuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDgsIDgsIDgsIDgpO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRUZXh0dXJlID0gbmV3IFRleHR1cmUyRCgpO1xyXG4gICAgICAgIGRlZmF1bHRUZXh0dXJlLl91dWlkID0gJ2RlZmF1bHQtdGV4dHVyZSc7XHJcbiAgICAgICAgZGVmYXVsdFRleHR1cmUuaW1hZ2UgPSBpbWdBc3NldDtcclxuICAgICAgICByZXNvdXJjZXNbZGVmYXVsdFRleHR1cmUuX3V1aWRdID0gZGVmYXVsdFRleHR1cmU7XHJcblxyXG4gICAgICAgIC8vIGRlZmF1bHQgY3ViZSB0ZXh0dXJlXHJcbiAgICAgICAgY29uc3QgZGVmYXVsdEN1YmVUZXh0dXJlID0gbmV3IFRleHR1cmVDdWJlKCk7XHJcbiAgICAgICAgZGVmYXVsdEN1YmVUZXh0dXJlLnNldE1pcEZpbHRlcihUZXh0dXJlQ3ViZS5GaWx0ZXIuTElORUFSKTtcclxuICAgICAgICBkZWZhdWx0Q3ViZVRleHR1cmUuX3V1aWQgPSAnZGVmYXVsdC1jdWJlLXRleHR1cmUnO1xyXG4gICAgICAgIGRlZmF1bHRDdWJlVGV4dHVyZS5pbWFnZSA9IHtcclxuICAgICAgICAgICAgZnJvbnQ6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIGJhY2s6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIGxlZnQ6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIHJpZ2h0OiBuZXcgSW1hZ2VBc3NldChjYW52YXMpLFxyXG4gICAgICAgICAgICB0b3A6IG5ldyBJbWFnZUFzc2V0KGNhbnZhcyksXHJcbiAgICAgICAgICAgIGJvdHRvbTogbmV3IEltYWdlQXNzZXQoY2FudmFzKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlc291cmNlc1tkZWZhdWx0Q3ViZVRleHR1cmUuX3V1aWRdID0gZGVmYXVsdEN1YmVUZXh0dXJlO1xyXG5cclxuICAgICAgICBjb25zdCBzcHJpdGVGcmFtZSA9IG5ldyBTcHJpdGVGcmFtZSgpO1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSBpbWdBc3NldC5fdGV4dHVyZTtcclxuICAgICAgICBzcHJpdGVGcmFtZS50ZXh0dXJlID0gdGV4dHVyZTtcclxuICAgICAgICBzcHJpdGVGcmFtZS5fdXVpZCA9ICdkZWZhdWx0LXNwcml0ZWZyYW1lJztcclxuICAgICAgICByZXNvdXJjZXNbc3ByaXRlRnJhbWUuX3V1aWRdID0gc3ByaXRlRnJhbWU7XHJcblxyXG4gICAgICAgIC8vIGJ1aWx0aW4gZWZmZWN0c1xyXG4gICAgICAgIGVmZmVjdHMuZm9yRWFjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlZmZlY3QgPSBPYmplY3QuYXNzaWduKG5ldyBsZWdhY3lDQy5FZmZlY3RBc3NldCgpLCBlKTtcclxuICAgICAgICAgICAgZWZmZWN0Lm9uTG9hZGVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHN0YW5kYXJkIG1hdGVyaWFsXHJcbiAgICAgICAgY29uc3Qgc3RhbmRhcmRNdGwgPSBuZXcgbGVnYWN5Q0MuTWF0ZXJpYWwoKTtcclxuICAgICAgICBzdGFuZGFyZE10bC5fdXVpZCA9ICdzdGFuZGFyZC1tYXRlcmlhbCc7XHJcbiAgICAgICAgc3RhbmRhcmRNdGwuaW5pdGlhbGl6ZSh7XHJcbiAgICAgICAgICAgIGVmZmVjdE5hbWU6ICdidWlsdGluLXN0YW5kYXJkJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXNvdXJjZXNbc3RhbmRhcmRNdGwuX3V1aWRdID0gc3RhbmRhcmRNdGw7XHJcblxyXG4gICAgICAgIC8vIG1hdGVyaWFsIGluZGljYXRpbmcgbWlzc2luZyBlZmZlY3QgKHllbGxvdylcclxuICAgICAgICBjb25zdCBtaXNzaW5nRWZ4TXRsID0gbmV3IGxlZ2FjeUNDLk1hdGVyaWFsKCk7XHJcbiAgICAgICAgbWlzc2luZ0VmeE10bC5fdXVpZCA9ICdtaXNzaW5nLWVmZmVjdC1tYXRlcmlhbCc7XHJcbiAgICAgICAgbWlzc2luZ0VmeE10bC5pbml0aWFsaXplKHtcclxuICAgICAgICAgICAgZWZmZWN0TmFtZTogJ2J1aWx0aW4tdW5saXQnLFxyXG4gICAgICAgICAgICBkZWZpbmVzOiB7IFVTRV9DT0xPUjogdHJ1ZSB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1pc3NpbmdFZnhNdGwuc2V0UHJvcGVydHkoJ21haW5Db2xvcicsIGxlZ2FjeUNDLmNvbG9yKCcjZmZmZjAwJykpO1xyXG4gICAgICAgIHJlc291cmNlc1ttaXNzaW5nRWZ4TXRsLl91dWlkXSA9IG1pc3NpbmdFZnhNdGw7XHJcblxyXG4gICAgICAgIC8vIG1hdGVyaWFsIGluZGljYXRpbmcgbWlzc2luZyBtYXRlcmlhbCAocHVycGxlKVxyXG4gICAgICAgIGNvbnN0IG1pc3NpbmdNdGwgPSBuZXcgbGVnYWN5Q0MuTWF0ZXJpYWwoKTtcclxuICAgICAgICBtaXNzaW5nTXRsLl91dWlkID0gJ21pc3NpbmctbWF0ZXJpYWwnO1xyXG4gICAgICAgIG1pc3NpbmdNdGwuaW5pdGlhbGl6ZSh7XHJcbiAgICAgICAgICAgIGVmZmVjdE5hbWU6ICdidWlsdGluLXVubGl0JyxcclxuICAgICAgICAgICAgZGVmaW5lczogeyBVU0VfQ09MT1I6IHRydWUgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBtaXNzaW5nTXRsLnNldFByb3BlcnR5KCdtYWluQ29sb3InLCBsZWdhY3lDQy5jb2xvcignI2ZmMDBmZicpKTtcclxuICAgICAgICByZXNvdXJjZXNbbWlzc2luZ010bC5fdXVpZF0gPSBtaXNzaW5nTXRsO1xyXG5cclxuICAgICAgICAvLyBzcHJpdGUgbWF0ZXJpYWxcclxuICAgICAgICBjb25zdCBzcHJpdGVNdGwgPSBuZXcgbGVnYWN5Q0MuTWF0ZXJpYWwoKTtcclxuICAgICAgICBzcHJpdGVNdGwuX3V1aWQgPSAndWktYmFzZS1tYXRlcmlhbCc7XHJcbiAgICAgICAgc3ByaXRlTXRsLmluaXRpYWxpemUoeyBkZWZpbmVzOiB7IFVTRV9URVhUVVJFOiBmYWxzZSB9LCBlZmZlY3ROYW1lOiAnYnVpbHRpbi1zcHJpdGUnIH0pO1xyXG4gICAgICAgIHJlc291cmNlc1tzcHJpdGVNdGwuX3V1aWRdID0gc3ByaXRlTXRsO1xyXG5cclxuICAgICAgICAvLyBzcHJpdGUgbWF0ZXJpYWxcclxuICAgICAgICBjb25zdCBzcHJpdGVDb2xvck10bCA9IG5ldyBsZWdhY3lDQy5NYXRlcmlhbCgpO1xyXG4gICAgICAgIHNwcml0ZUNvbG9yTXRsLl91dWlkID0gJ3VpLXNwcml0ZS1tYXRlcmlhbCc7XHJcbiAgICAgICAgc3ByaXRlQ29sb3JNdGwuaW5pdGlhbGl6ZSh7IGRlZmluZXM6IHsgVVNFX1RFWFRVUkU6IHRydWUsIENDX1VTRV9FTUJFRERFRF9BTFBIQTogZmFsc2UsIElTX0dSQVk6IGZhbHNlIH0sIGVmZmVjdE5hbWU6ICdidWlsdGluLXNwcml0ZScgfSk7XHJcbiAgICAgICAgcmVzb3VyY2VzW3Nwcml0ZUNvbG9yTXRsLl91dWlkXSA9IHNwcml0ZUNvbG9yTXRsO1xyXG5cclxuICAgICAgICAvLyBzcHJpdGUgZ3JheSBtYXRlcmlhbFxyXG4gICAgICAgIGNvbnN0IHNwcml0ZUdyYXlNdGwgPSBuZXcgbGVnYWN5Q0MuTWF0ZXJpYWwoKTtcclxuICAgICAgICBzcHJpdGVHcmF5TXRsLl91dWlkID0gJ3VpLXNwcml0ZS1ncmF5LW1hdGVyaWFsJztcclxuICAgICAgICBzcHJpdGVHcmF5TXRsLmluaXRpYWxpemUoeyBkZWZpbmVzOiB7IFVTRV9URVhUVVJFOiB0cnVlLCBDQ19VU0VfRU1CRURERURfQUxQSEE6IGZhbHNlLCBJU19HUkFZOiB0cnVlIH0sIGVmZmVjdE5hbWU6ICdidWlsdGluLXNwcml0ZScgfSk7XHJcbiAgICAgICAgcmVzb3VyY2VzW3Nwcml0ZUdyYXlNdGwuX3V1aWRdID0gc3ByaXRlR3JheU10bDtcclxuXHJcbiAgICAgICAgLy8gc3ByaXRlIGFscGhhIG1hdGVyaWFsXHJcbiAgICAgICAgY29uc3Qgc3ByaXRlQWxwaGFNdGwgPSBuZXcgbGVnYWN5Q0MuTWF0ZXJpYWwoKTtcclxuICAgICAgICBzcHJpdGVBbHBoYU10bC5fdXVpZCA9ICd1aS1zcHJpdGUtYWxwaGEtc2VwLW1hdGVyaWFsJztcclxuICAgICAgICBzcHJpdGVBbHBoYU10bC5pbml0aWFsaXplKHsgZGVmaW5lczogeyBVU0VfVEVYVFVSRTogdHJ1ZSwgQ0NfVVNFX0VNQkVEREVEX0FMUEhBOiB0cnVlLCBJU19HUkFZOiBmYWxzZSB9LCBlZmZlY3ROYW1lOiAnYnVpbHRpbi1zcHJpdGUnIH0pO1xyXG4gICAgICAgIHJlc291cmNlc1tzcHJpdGVBbHBoYU10bC5fdXVpZF0gPSBzcHJpdGVBbHBoYU10bDtcclxuXHJcbiAgICAgICAgLy8gc3ByaXRlIGFscGhhICYgZ3JheSBtYXRlcmlhbFxyXG4gICAgICAgIGNvbnN0IHNwcml0ZUFscGhhR3JheU10bCA9IG5ldyBsZWdhY3lDQy5NYXRlcmlhbCgpO1xyXG4gICAgICAgIHNwcml0ZUFscGhhR3JheU10bC5fdXVpZCA9ICd1aS1zcHJpdGUtZ3JheS1hbHBoYS1zZXAtbWF0ZXJpYWwnO1xyXG4gICAgICAgIHNwcml0ZUFscGhhR3JheU10bC5pbml0aWFsaXplKHsgZGVmaW5lczogeyBVU0VfVEVYVFVSRTogdHJ1ZSwgQ0NfVVNFX0VNQkVEREVEX0FMUEhBOiB0cnVlLCBJU19HUkFZOiB0cnVlIH0sIGVmZmVjdE5hbWU6ICdidWlsdGluLXNwcml0ZScgfSk7XHJcbiAgICAgICAgcmVzb3VyY2VzW3Nwcml0ZUFscGhhR3JheU10bC5fdXVpZF0gPSBzcHJpdGVBbHBoYUdyYXlNdGw7XHJcblxyXG4gICAgICAgIC8vIHVpIGdyYXBoaWNzIG1hdGVyaWFsXHJcbiAgICAgICAgY29uc3QgZGVmYXVsdEdyYXBoaWNzTXRsID0gbmV3IGxlZ2FjeUNDLk1hdGVyaWFsKCk7XHJcbiAgICAgICAgZGVmYXVsdEdyYXBoaWNzTXRsLl91dWlkID0gJ3VpLWdyYXBoaWNzLW1hdGVyaWFsJztcclxuICAgICAgICBkZWZhdWx0R3JhcGhpY3NNdGwuaW5pdGlhbGl6ZSh7IGVmZmVjdE5hbWU6ICdidWlsdGluLWdyYXBoaWNzJyB9KTtcclxuICAgICAgICByZXNvdXJjZXNbZGVmYXVsdEdyYXBoaWNzTXRsLl91dWlkXSA9IGRlZmF1bHRHcmFwaGljc010bDtcclxuXHJcbiAgICAgICAgLy8gZGVmYXVsdCBwYXJ0aWNsZSBtYXRlcmlhbFxyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRQYXJ0aWNsZU10bCA9IG5ldyBsZWdhY3lDQy5NYXRlcmlhbCgpO1xyXG4gICAgICAgIGRlZmF1bHRQYXJ0aWNsZU10bC5fdXVpZCA9ICdkZWZhdWx0LXBhcnRpY2xlLW1hdGVyaWFsJztcclxuICAgICAgICBkZWZhdWx0UGFydGljbGVNdGwuaW5pdGlhbGl6ZSh7IGVmZmVjdE5hbWU6ICdidWlsdGluLXBhcnRpY2xlJyB9KTtcclxuICAgICAgICByZXNvdXJjZXNbZGVmYXVsdFBhcnRpY2xlTXRsLl91dWlkXSA9IGRlZmF1bHRQYXJ0aWNsZU10bDtcclxuXHJcbiAgICAgICAgLy8gZGVmYXVsdCBwYXJ0aWNsZSBncHUgbWF0ZXJpYWxcclxuICAgICAgICBjb25zdCBkZWZhdWx0UGFydGljbGVHUFVNdGwgPSBuZXcgbGVnYWN5Q0MuTWF0ZXJpYWwoKTtcclxuICAgICAgICBkZWZhdWx0UGFydGljbGVHUFVNdGwuX3V1aWQgPSAnZGVmYXVsdC1wYXJ0aWNsZS1ncHUtbWF0ZXJpYWwnO1xyXG4gICAgICAgIGRlZmF1bHRQYXJ0aWNsZUdQVU10bC5pbml0aWFsaXplKHsgZWZmZWN0TmFtZTogJ2J1aWx0aW4tcGFydGljbGUtZ3B1JyB9KTtcclxuICAgICAgICByZXNvdXJjZXNbZGVmYXVsdFBhcnRpY2xlR1BVTXRsLl91dWlkXSA9IGRlZmF1bHRQYXJ0aWNsZUdQVU10bDtcclxuXHJcbiAgICAgICAgLy8gZGVmYXVsdCBwYXJ0aWNsZSBtYXRlcmlhbFxyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRUcmFpbE10bCA9IG5ldyBsZWdhY3lDQy5NYXRlcmlhbCgpO1xyXG4gICAgICAgIGRlZmF1bHRUcmFpbE10bC5fdXVpZCA9ICdkZWZhdWx0LXRyYWlsLW1hdGVyaWFsJztcclxuICAgICAgICBkZWZhdWx0VHJhaWxNdGwuaW5pdGlhbGl6ZSh7IGVmZmVjdE5hbWU6ICdidWlsdGluLXBhcnRpY2xlLXRyYWlsJyB9KTtcclxuICAgICAgICByZXNvdXJjZXNbZGVmYXVsdFRyYWlsTXRsLl91dWlkXSA9IGRlZmF1bHRUcmFpbE10bDtcclxuXHJcbiAgICAgICAgLy8gZGVmYXVsdCBwYXJ0aWNsZSBtYXRlcmlhbFxyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRCaWxsYm9hcmRNdGwgPSBuZXcgbGVnYWN5Q0MuTWF0ZXJpYWwoKTtcclxuICAgICAgICBkZWZhdWx0QmlsbGJvYXJkTXRsLl91dWlkID0gJ2RlZmF1bHQtYmlsbGJvYXJkLW1hdGVyaWFsJztcclxuICAgICAgICBkZWZhdWx0QmlsbGJvYXJkTXRsLmluaXRpYWxpemUoeyBlZmZlY3ROYW1lOiAnYnVpbHRpbi1iaWxsYm9hcmQnIH0pO1xyXG4gICAgICAgIHJlc291cmNlc1tkZWZhdWx0QmlsbGJvYXJkTXRsLl91dWlkXSA9IGRlZmF1bHRCaWxsYm9hcmRNdGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldDxUIGV4dGVuZHMgQXNzZXQ+ICh1dWlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb3VyY2VzW3V1aWRdIGFzIFQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGJ1aWx0aW5SZXNNZ3IgPSBsZWdhY3lDQy5idWlsdGluUmVzTWdyID0gbmV3IEJ1aWx0aW5SZXNNZ3IoKTtcclxuZXhwb3J0IHsgYnVpbHRpblJlc01nciB9O1xyXG4iXX0=