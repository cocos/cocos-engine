(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js", "./raw-asset.js", "./asset.js", "./prefab.js", "./scripts.js", "./scene-asset.js", "./sprite-frame.js", "./sprite-atlas.js", "./text-asset.js", "./json-asset.js", "./asset-library.js", "./image-asset.js", "./texture-2d.js", "./texture-cube.js", "./ttf-font.js", "./label-atlas.js", "./bitmap-font.js", "./font.js", "./texture-util.js", "./effect-asset.js", "./material.js", "./mesh.js", "./skeleton.js", "./render-texture.js", "./deprecation.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"), require("./raw-asset.js"), require("./asset.js"), require("./prefab.js"), require("./scripts.js"), require("./scene-asset.js"), require("./sprite-frame.js"), require("./sprite-atlas.js"), require("./text-asset.js"), require("./json-asset.js"), require("./asset-library.js"), require("./image-asset.js"), require("./texture-2d.js"), require("./texture-cube.js"), require("./ttf-font.js"), require("./label-atlas.js"), require("./bitmap-font.js"), require("./font.js"), require("./texture-util.js"), require("./effect-asset.js"), require("./material.js"), require("./mesh.js"), require("./skeleton.js"), require("./render-texture.js"), require("./deprecation.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.rawAsset, global.asset, global.prefab, global.scripts, global.sceneAsset, global.spriteFrame, global.spriteAtlas, global.textAsset, global.jsonAsset, global.assetLibrary, global.imageAsset, global.texture2d, global.textureCube, global.ttfFont, global.labelAtlas, global.bitmapFont, global.font, global.textureUtil, global.effectAsset, global.material, global.mesh, global.skeleton, global.renderTexture, global.deprecation);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _rawAsset, _asset, _prefab, _scripts, _sceneAsset, _spriteFrame, _spriteAtlas, _textAsset, _jsonAsset, _assetLibrary, _imageAsset, _texture2d, _textureCube, _ttfFont, _labelAtlas, _bitmapFont, _font, textureUtil, _effectAsset, _material, _mesh, _skeleton, _renderTexture, _deprecation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    RawAsset: true,
    Asset: true,
    Prefab: true,
    SceneAsset: true,
    SpriteAtlas: true,
    TextAsset: true,
    JsonAsset: true,
    AssetLibrary: true,
    ImageAsset: true,
    Texture2D: true,
    TextureCube: true,
    TTFFont: true,
    LabelAtlas: true,
    BitmapFont: true,
    Font: true,
    textureUtil: true,
    EffectAsset: true,
    Material: true,
    Mesh: true,
    RenderingSubMesh: true,
    Skeleton: true,
    RenderTexture: true
  };
  Object.defineProperty(_exports, "RawAsset", {
    enumerable: true,
    get: function () {
      return _rawAsset.RawAsset;
    }
  });
  Object.defineProperty(_exports, "Asset", {
    enumerable: true,
    get: function () {
      return _asset.Asset;
    }
  });
  Object.defineProperty(_exports, "Prefab", {
    enumerable: true,
    get: function () {
      return _prefab.default;
    }
  });
  Object.defineProperty(_exports, "SceneAsset", {
    enumerable: true,
    get: function () {
      return _sceneAsset.default;
    }
  });
  Object.defineProperty(_exports, "SpriteAtlas", {
    enumerable: true,
    get: function () {
      return _spriteAtlas.SpriteAtlas;
    }
  });
  Object.defineProperty(_exports, "TextAsset", {
    enumerable: true,
    get: function () {
      return _textAsset.default;
    }
  });
  Object.defineProperty(_exports, "JsonAsset", {
    enumerable: true,
    get: function () {
      return _jsonAsset.default;
    }
  });
  Object.defineProperty(_exports, "AssetLibrary", {
    enumerable: true,
    get: function () {
      return _assetLibrary.default;
    }
  });
  Object.defineProperty(_exports, "ImageAsset", {
    enumerable: true,
    get: function () {
      return _imageAsset.ImageAsset;
    }
  });
  Object.defineProperty(_exports, "Texture2D", {
    enumerable: true,
    get: function () {
      return _texture2d.Texture2D;
    }
  });
  Object.defineProperty(_exports, "TextureCube", {
    enumerable: true,
    get: function () {
      return _textureCube.TextureCube;
    }
  });
  Object.defineProperty(_exports, "TTFFont", {
    enumerable: true,
    get: function () {
      return _ttfFont.TTFFont;
    }
  });
  Object.defineProperty(_exports, "LabelAtlas", {
    enumerable: true,
    get: function () {
      return _labelAtlas.LabelAtlas;
    }
  });
  Object.defineProperty(_exports, "BitmapFont", {
    enumerable: true,
    get: function () {
      return _bitmapFont.BitmapFont;
    }
  });
  Object.defineProperty(_exports, "Font", {
    enumerable: true,
    get: function () {
      return _font.Font;
    }
  });
  Object.defineProperty(_exports, "EffectAsset", {
    enumerable: true,
    get: function () {
      return _effectAsset.EffectAsset;
    }
  });
  Object.defineProperty(_exports, "Material", {
    enumerable: true,
    get: function () {
      return _material.Material;
    }
  });
  Object.defineProperty(_exports, "Mesh", {
    enumerable: true,
    get: function () {
      return _mesh.Mesh;
    }
  });
  Object.defineProperty(_exports, "RenderingSubMesh", {
    enumerable: true,
    get: function () {
      return _mesh.RenderingSubMesh;
    }
  });
  Object.defineProperty(_exports, "Skeleton", {
    enumerable: true,
    get: function () {
      return _skeleton.Skeleton;
    }
  });
  Object.defineProperty(_exports, "RenderTexture", {
    enumerable: true,
    get: function () {
      return _renderTexture.RenderTexture;
    }
  });
  _exports.textureUtil = void 0;
  _prefab = _interopRequireDefault(_prefab);
  Object.keys(_scripts).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _scripts[key];
      }
    });
  });
  _sceneAsset = _interopRequireDefault(_sceneAsset);
  Object.keys(_spriteFrame).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _spriteFrame[key];
      }
    });
  });
  _textAsset = _interopRequireDefault(_textAsset);
  _jsonAsset = _interopRequireDefault(_jsonAsset);
  _assetLibrary = _interopRequireDefault(_assetLibrary);
  textureUtil = _interopRequireWildcard(textureUtil);
  _exports.textureUtil = textureUtil;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /*
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos.com
  
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated engine source code (the "Software"), a limited,
    worldwide, royalty-free, non-assignable, revocable and non-exclusive license
   to use Cocos Creator solely to develop games on your target platforms. You shall
    not use Cocos Creator software for developing other software or tools that's
    used for developing games. You are not granted to publish, distribute,
    sublicense, and/or sell copies of Cocos Creator.
  
   The software or tools in this License Agreement are licensed, not sold.
   Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
  
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
  */

  /**
   * @hidden
   */
  _globalExports.legacyCC.textureUtil = textureUtil;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL2luZGV4LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwidGV4dHVyZVV0aWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7O0FBbkNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7O0FBc0JBQSwwQkFBU0MsV0FBVCxHQUF1QkEsV0FBdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmV4cG9ydCB7IFJhd0Fzc2V0IH0gZnJvbSAnLi9yYXctYXNzZXQnO1xyXG5leHBvcnQgeyBBc3NldCB9IGZyb20gJy4vYXNzZXQnO1xyXG5leHBvcnQge2RlZmF1bHQgYXMgUHJlZmFifSBmcm9tICcuL3ByZWZhYic7XHJcbmV4cG9ydCAqIGZyb20gJy4vc2NyaXB0cyc7XHJcbmV4cG9ydCB7ZGVmYXVsdCBhcyBTY2VuZUFzc2V0fSBmcm9tICcuL3NjZW5lLWFzc2V0JztcclxuZXhwb3J0ICogZnJvbSAnLi9zcHJpdGUtZnJhbWUnO1xyXG5leHBvcnQgeyBTcHJpdGVBdGxhcyB9IGZyb20gJy4vc3ByaXRlLWF0bGFzJztcclxuZXhwb3J0IHtkZWZhdWx0IGFzIFRleHRBc3NldH0gZnJvbSAnLi90ZXh0LWFzc2V0JztcclxuZXhwb3J0IHtkZWZhdWx0IGFzIEpzb25Bc3NldH0gZnJvbSAnLi9qc29uLWFzc2V0JztcclxuZXhwb3J0IHtkZWZhdWx0IGFzIEFzc2V0TGlicmFyeX0gZnJvbSAnLi9hc3NldC1saWJyYXJ5JztcclxuZXhwb3J0IHsgSW1hZ2VBc3NldCB9IGZyb20gJy4vaW1hZ2UtYXNzZXQnO1xyXG5leHBvcnQgeyBUZXh0dXJlMkQgfSBmcm9tICcuL3RleHR1cmUtMmQnO1xyXG5leHBvcnQgeyBUZXh0dXJlQ3ViZSB9IGZyb20gJy4vdGV4dHVyZS1jdWJlJztcclxuZXhwb3J0IHsgVFRGRm9udCB9IGZyb20gJy4vdHRmLWZvbnQnO1xyXG5leHBvcnQgeyBMYWJlbEF0bGFzIH0gZnJvbSAnLi9sYWJlbC1hdGxhcyc7XHJcbmV4cG9ydCB7IEJpdG1hcEZvbnQgfSBmcm9tICcuL2JpdG1hcC1mb250JztcclxuZXhwb3J0IHsgRm9udCB9IGZyb20gJy4vZm9udCc7XHJcbmltcG9ydCAqIGFzIHRleHR1cmVVdGlsIGZyb20gJy4vdGV4dHVyZS11dGlsJztcclxubGVnYWN5Q0MudGV4dHVyZVV0aWwgPSB0ZXh0dXJlVXRpbDtcclxuZXhwb3J0IHsgdGV4dHVyZVV0aWwgfTtcclxuZXhwb3J0IHsgRWZmZWN0QXNzZXQgfSBmcm9tICcuL2VmZmVjdC1hc3NldCc7XHJcbmV4cG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi9tYXRlcmlhbCc7XHJcbmV4cG9ydCB7IE1lc2gsIFJlbmRlcmluZ1N1Yk1lc2ggfSBmcm9tICcuL21lc2gnO1xyXG5leHBvcnQgeyBTa2VsZXRvbiB9IGZyb20gJy4vc2tlbGV0b24nO1xyXG5leHBvcnQgeyBSZW5kZXJUZXh0dXJlIH0gZnJvbSAnLi9yZW5kZXItdGV4dHVyZSc7XHJcbmltcG9ydCAnLi9kZXByZWNhdGlvbic7XHJcbiJdfQ==