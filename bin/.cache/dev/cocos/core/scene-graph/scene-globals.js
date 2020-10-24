(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../assets/texture-cube.js", "../data/decorators/index.js", "../data/utils/attribute.js", "../math/index.js", "../renderer/scene/ambient.js", "../renderer/scene/shadows.js", "../renderer/scene/fog.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../assets/texture-cube.js"), require("../data/decorators/index.js"), require("../data/utils/attribute.js"), require("../math/index.js"), require("../renderer/scene/ambient.js"), require("../renderer/scene/shadows.js"), require("../renderer/scene/fog.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.textureCube, global.index, global.attribute, global.index, global.ambient, global.shadows, global.fog, global.globalExports);
    global.sceneGlobals = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _textureCube, _index, _attribute, _index2, _ambient, _shadows, _fog, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SceneGlobals = _exports.ShadowsInfo = _exports.FogInfo = _exports.SkyboxInfo = _exports.AmbientInfo = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _dec3, _dec4, _dec5, _class4, _class5, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp2, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _class7, _class8, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _class9, _temp3, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _class10, _class11, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _temp4, _dec49, _dec50, _class13, _class14, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _temp5;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var _up = new _index2.Vec3(0, 1, 0);

  var _v3 = new _index2.Vec3();

  var _qt = new _index2.Quat();
  /**
   * @en Environment lighting information in the Scene
   * @zh 场景的环境光照相关信息
   */


  var AmbientInfo = (_dec = (0, _index.ccclass)('cc.AmbientInfo'), _dec2 = (0, _index.type)(_attribute.CCFloat), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function AmbientInfo() {
      _classCallCheck(this, AmbientInfo);

      _initializerDefineProperty(this, "_skyColor", _descriptor, this);

      _initializerDefineProperty(this, "_skyIllum", _descriptor2, this);

      _initializerDefineProperty(this, "_groundAlbedo", _descriptor3, this);

      this._resource = null;
    }

    _createClass(AmbientInfo, [{
      key: "activate",
      value: function activate(resource) {
        this._resource = resource;
        this._resource.skyColor = this._skyColor;
        this._resource.skyIllum = this._skyIllum;
        this._resource.groundAlbedo = this._groundAlbedo;
      }
    }, {
      key: "skyColor",

      /**
       * @en Sky color
       * @zh 天空颜色
       */
      set: function set(val) {
        this._skyColor.set(val);

        if (this._resource) {
          this._resource.skyColor = this._skyColor;
        }
      },
      get: function get() {
        return this._skyColor;
      }
      /**
       * @en Sky illuminance
       * @zh 天空亮度
       */

    }, {
      key: "skyIllum",
      set: function set(val) {
        this._skyIllum = val;

        if (this._resource) {
          this._resource.skyIllum = this.skyIllum;
        }
      },
      get: function get() {
        return this._skyIllum;
      }
      /**
       * @en Ground color
       * @zh 地面颜色
       */

    }, {
      key: "groundAlbedo",
      set: function set(val) {
        this._groundAlbedo.set(val); // only RGB channels are used, alpha channel are intensionally left unchanged here


        if (this._resource) {
          this._resource.groundAlbedo = this._groundAlbedo;
        }
      },
      get: function get() {
        return this._groundAlbedo;
      }
    }]);

    return AmbientInfo;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_skyColor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Color(51, 128, 204, 1.0);
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_skyIllum", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _ambient.Ambient.SKY_ILLUM;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_groundAlbedo", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Color(51, 51, 51, 255);
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "skyColor", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "skyColor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "skyIllum", [_index.editable, _dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "skyIllum"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "groundAlbedo", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "groundAlbedo"), _class2.prototype)), _class2)) || _class);
  _exports.AmbientInfo = AmbientInfo;
  _globalExports.legacyCC.AmbientInfo = AmbientInfo;
  /**
   * @en Skybox related information
   * @zh 天空盒相关信息
   */

  var SkyboxInfo = (_dec3 = (0, _index.ccclass)('cc.SkyboxInfo'), _dec4 = (0, _index.type)(_textureCube.TextureCube), _dec5 = (0, _index.type)(_textureCube.TextureCube), _dec3(_class4 = (_class5 = (_temp2 = /*#__PURE__*/function () {
    function SkyboxInfo() {
      _classCallCheck(this, SkyboxInfo);

      _initializerDefineProperty(this, "_envmap", _descriptor4, this);

      _initializerDefineProperty(this, "_isRGBE", _descriptor5, this);

      _initializerDefineProperty(this, "_enabled", _descriptor6, this);

      _initializerDefineProperty(this, "_useIBL", _descriptor7, this);

      this._resource = null;
    }

    _createClass(SkyboxInfo, [{
      key: "activate",
      value: function activate(resource) {
        this._resource = resource;

        this._resource.activate(); // update global DS first


        this._resource.enabled = this._enabled;
        this._resource.isRGBE = this._isRGBE;
        this._resource.envmap = this._envmap;
        this._resource.useIBL = this._useIBL;
      }
    }, {
      key: "enabled",

      /**
       * @en Whether activate skybox in the scene
       * @zh 是否启用天空盒？
       */
      set: function set(val) {
        this._enabled = val;

        if (this._resource) {
          this._resource.enabled = this._enabled;
        }
      },
      get: function get() {
        return this._enabled;
      }
      /**
       * @en Whether use environment lighting
       * @zh 是否启用环境光照？
       */

    }, {
      key: "useIBL",
      set: function set(val) {
        this._useIBL = val;

        if (this._resource) {
          this._resource.useIBL = this._useIBL;
        }
      },
      get: function get() {
        return this._useIBL;
      }
      /**
       * @en The texture cube used for the skybox
       * @zh 使用的立方体贴图
       */

    }, {
      key: "envmap",
      set: function set(val) {
        this._envmap = val;

        if (this._resource) {
          this._resource.envmap = this._envmap;
        }
      },
      get: function get() {
        return this._envmap;
      }
      /**
       * @en Whether enable RGBE data support in skybox shader
       * @zh 是否需要开启 shader 内的 RGBE 数据支持？
       */

    }, {
      key: "isRGBE",
      set: function set(val) {
        this._isRGBE = val;

        if (this._resource) {
          this._resource.isRGBE = this._isRGBE;
        }
      },
      get: function get() {
        return this._isRGBE;
      }
    }]);

    return SkyboxInfo;
  }(), _temp2), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "_envmap", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "_isRGBE", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "_enabled", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "_useIBL", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class5.prototype, "enabled", [_index.editable], Object.getOwnPropertyDescriptor(_class5.prototype, "enabled"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "useIBL", [_index.editable], Object.getOwnPropertyDescriptor(_class5.prototype, "useIBL"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "envmap", [_index.editable, _dec5], Object.getOwnPropertyDescriptor(_class5.prototype, "envmap"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "isRGBE", [_index.editable], Object.getOwnPropertyDescriptor(_class5.prototype, "isRGBE"), _class5.prototype)), _class5)) || _class4);
  _exports.SkyboxInfo = SkyboxInfo;
  _globalExports.legacyCC.SkyboxInfo = SkyboxInfo;
  /**
   * @zh 全局雾相关信息
   * @en Global fog info
   */

  var FogInfo = (_dec6 = (0, _index.ccclass)('cc.FogInfo'), _dec7 = (0, _index.type)(_fog.FogType), _dec8 = (0, _index.type)(_attribute.CCFloat), _dec9 = (0, _index.range)([0, 1]), _dec10 = (0, _index.rangeStep)(0.01), _dec11 = (0, _index.displayOrder)(3), _dec12 = (0, _index.visible)(function () {
    return this._type !== _fog.FogType.LAYERED && this._type !== _fog.FogType.LINEAR;
  }), _dec13 = (0, _index.type)(_attribute.CCFloat), _dec14 = (0, _index.rangeStep)(0.1), _dec15 = (0, _index.displayOrder)(4), _dec16 = (0, _index.visible)(function () {
    return this._type === _fog.FogType.LINEAR;
  }), _dec17 = (0, _index.type)(_attribute.CCFloat), _dec18 = (0, _index.rangeStep)(0.1), _dec19 = (0, _index.displayOrder)(5), _dec20 = (0, _index.visible)(function () {
    return this._type === _fog.FogType.LINEAR;
  }), _dec21 = (0, _index.type)(_attribute.CCFloat), _dec22 = (0, _index.rangeStep)(0.1), _dec23 = (0, _index.displayOrder)(6), _dec24 = (0, _index.visible)(function () {
    return this._type !== _fog.FogType.LINEAR;
  }), _dec25 = (0, _index.type)(_attribute.CCFloat), _dec26 = (0, _index.rangeStep)(0.1), _dec27 = (0, _index.displayOrder)(7), _dec28 = (0, _index.visible)(function () {
    return this._type === _fog.FogType.LAYERED;
  }), _dec29 = (0, _index.type)(_attribute.CCFloat), _dec30 = (0, _index.rangeStep)(0.1), _dec31 = (0, _index.displayOrder)(8), _dec32 = (0, _index.visible)(function () {
    return this._type === _fog.FogType.LAYERED;
  }), _dec6(_class7 = (_class8 = (_temp3 = _class9 = /*#__PURE__*/function () {
    function FogInfo() {
      _classCallCheck(this, FogInfo);

      _initializerDefineProperty(this, "_type", _descriptor8, this);

      _initializerDefineProperty(this, "_fogColor", _descriptor9, this);

      _initializerDefineProperty(this, "_enabled", _descriptor10, this);

      _initializerDefineProperty(this, "_fogDensity", _descriptor11, this);

      _initializerDefineProperty(this, "_fogStart", _descriptor12, this);

      _initializerDefineProperty(this, "_fogEnd", _descriptor13, this);

      _initializerDefineProperty(this, "_fogAtten", _descriptor14, this);

      _initializerDefineProperty(this, "_fogTop", _descriptor15, this);

      _initializerDefineProperty(this, "_fogRange", _descriptor16, this);

      this._resource = null;
    }

    _createClass(FogInfo, [{
      key: "activate",
      value: function activate(resource) {
        this._resource = resource;
        this._resource.enabled = this._enabled;
        this._resource.fogColor = this._fogColor;
        this._resource.type = this._type;
        this._resource.fogDensity = this._fogDensity;
        this._resource.fogStart = this._fogStart;
        this._resource.fogEnd = this._fogEnd;
        this._resource.fogAtten = this._fogAtten;
        this._resource.fogTop = this._fogTop;
        this._resource.fogRange = this._fogRange;
      }
    }, {
      key: "enabled",

      /**
       * @zh 是否启用全局雾效
       * @en Enable global fog
       */
      set: function set(val) {
        this._enabled = val;

        if (this._resource) {
          this._resource.enabled = val;
        }
      },
      get: function get() {
        return this._enabled;
      }
      /**
       * @zh 全局雾颜色
       * @en Global fog color
       */

    }, {
      key: "fogColor",
      set: function set(val) {
        this._fogColor.set(val);

        if (this._resource) {
          this._resource.fogColor = this._fogColor;
        }
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

        if (this._resource) {
          this._resource.type = val;
        }
      }
      /**
       * @zh 全局雾浓度
       * @en Global fog density
       */

    }, {
      key: "fogDensity",
      get: function get() {
        return this._fogDensity;
      },
      set: function set(val) {
        this._fogDensity = val;

        if (this._resource) {
          this._resource.fogDensity = val;
        }
      }
      /**
       * @zh 雾效起始位置，只适用于线性雾
       * @en Global fog start position, only for linear fog
       */

    }, {
      key: "fogStart",
      get: function get() {
        return this._fogStart;
      },
      set: function set(val) {
        this._fogStart = val;

        if (this._resource) {
          this._resource.fogStart = val;
        }
      }
      /**
       * @zh 雾效结束位置，只适用于线性雾
       * @en Global fog end position, only for linear fog
       */

    }, {
      key: "fogEnd",
      get: function get() {
        return this._fogEnd;
      },
      set: function set(val) {
        this._fogEnd = val;

        if (this._resource) {
          this._resource.fogEnd = val;
        }
      }
      /**
       * @zh 雾效衰减
       * @en Global fog attenuation
       */

    }, {
      key: "fogAtten",
      get: function get() {
        return this._fogAtten;
      },
      set: function set(val) {
        this._fogAtten = val;

        if (this._resource) {
          this._resource.fogAtten = val;
        }
      }
      /**
       * @zh 雾效顶部范围，只适用于层级雾
       * @en Global fog top range, only for layered fog
       */

    }, {
      key: "fogTop",
      get: function get() {
        return this._fogTop;
      },
      set: function set(val) {
        this._fogTop = val;

        if (this._resource) {
          this._resource.fogTop = val;
        }
      }
      /**
       * @zh 雾效范围，只适用于层级雾
       * @en Global fog range, only for layered fog
       */

    }, {
      key: "fogRange",
      get: function get() {
        return this._fogRange;
      },
      set: function set(val) {
        this._fogRange = val;

        if (this._resource) {
          this._resource.fogRange = val;
        }
      }
    }]);

    return FogInfo;
  }(), _class9.FogType = _fog.FogType, _temp3), (_descriptor8 = _applyDecoratedDescriptor(_class8.prototype, "_type", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _fog.FogType.LINEAR;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class8.prototype, "_fogColor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Color('#C8C8C8');
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class8.prototype, "_enabled", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class8.prototype, "_fogDensity", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.3;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class8.prototype, "_fogStart", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.5;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class8.prototype, "_fogEnd", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 300;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class8.prototype, "_fogAtten", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 5;
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class8.prototype, "_fogTop", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1.5;
    }
  }), _descriptor16 = _applyDecoratedDescriptor(_class8.prototype, "_fogRange", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1.2;
    }
  }), _applyDecoratedDescriptor(_class8.prototype, "enabled", [_index.editable], Object.getOwnPropertyDescriptor(_class8.prototype, "enabled"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "fogColor", [_index.editable], Object.getOwnPropertyDescriptor(_class8.prototype, "fogColor"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "type", [_index.editable, _dec7], Object.getOwnPropertyDescriptor(_class8.prototype, "type"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "fogDensity", [_dec8, _dec9, _dec10, _index.slide, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class8.prototype, "fogDensity"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "fogStart", [_dec13, _dec14, _dec15, _dec16], Object.getOwnPropertyDescriptor(_class8.prototype, "fogStart"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "fogEnd", [_dec17, _dec18, _dec19, _dec20], Object.getOwnPropertyDescriptor(_class8.prototype, "fogEnd"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "fogAtten", [_dec21, _dec22, _dec23, _dec24], Object.getOwnPropertyDescriptor(_class8.prototype, "fogAtten"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "fogTop", [_dec25, _dec26, _dec27, _dec28], Object.getOwnPropertyDescriptor(_class8.prototype, "fogTop"), _class8.prototype), _applyDecoratedDescriptor(_class8.prototype, "fogRange", [_dec29, _dec30, _dec31, _dec32], Object.getOwnPropertyDescriptor(_class8.prototype, "fogRange"), _class8.prototype)), _class8)) || _class7);
  /**
   * @en Scene level planar shadow related information
   * @zh 平面阴影相关信息
   */

  _exports.FogInfo = FogInfo;
  var ShadowsInfo = (_dec33 = (0, _index.ccclass)('cc.ShadowsInfo'), _dec34 = (0, _index.type)(_shadows.ShadowType), _dec35 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.Planar;
  }), _dec36 = (0, _index.type)(_attribute.CCFloat), _dec37 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.Planar;
  }), _dec38 = (0, _index.type)(_shadows.PCFType), _dec39 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.ShadowMap;
  }), _dec40 = (0, _index.type)(_attribute.CCFloat), _dec41 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.ShadowMap;
  }), _dec42 = (0, _index.type)(_attribute.CCFloat), _dec43 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.ShadowMap;
  }), _dec44 = (0, _index.type)(_attribute.CCFloat), _dec45 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.ShadowMap;
  }), _dec46 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.ShadowMap;
  }), _dec47 = (0, _index.type)(_attribute.CCFloat), _dec48 = (0, _index.visible)(function () {
    return this._type === _shadows.ShadowType.ShadowMap;
  }), _dec33(_class10 = (_class11 = (_temp4 = /*#__PURE__*/function () {
    function ShadowsInfo() {
      _classCallCheck(this, ShadowsInfo);

      _initializerDefineProperty(this, "_type", _descriptor17, this);

      _initializerDefineProperty(this, "_enabled", _descriptor18, this);

      _initializerDefineProperty(this, "_normal", _descriptor19, this);

      _initializerDefineProperty(this, "_distance", _descriptor20, this);

      _initializerDefineProperty(this, "_shadowColor", _descriptor21, this);

      _initializerDefineProperty(this, "_pcf", _descriptor22, this);

      _initializerDefineProperty(this, "_near", _descriptor23, this);

      _initializerDefineProperty(this, "_far", _descriptor24, this);

      _initializerDefineProperty(this, "_aspect", _descriptor25, this);

      _initializerDefineProperty(this, "_orthoSize", _descriptor26, this);

      _initializerDefineProperty(this, "_size", _descriptor27, this);

      this._resource = null;
    }

    _createClass(ShadowsInfo, [{
      key: "setPlaneFromNode",

      /**
       * @en Set plane which receives shadow with the given node's world transformation
       * @zh 根据指定节点的世界变换设置阴影接收平面的信息
       * @param node The node for setting up the plane
       */
      value: function setPlaneFromNode(node) {
        node.getWorldRotation(_qt);
        this.normal = _index2.Vec3.transformQuat(_v3, _up, _qt);
        node.getWorldPosition(_v3);
        this.distance = _index2.Vec3.dot(this._normal, _v3);
      }
    }, {
      key: "activate",
      value: function activate(resource) {
        this._resource = resource;
        this._resource.type = this._type;
        this._resource.near = this._near;
        this._resource.far = this._far;
        this._resource.orthoSize = this._orthoSize;
        this._resource.size = this._size;
        this._resource.normal = this._normal;
        this._resource.distance = this._distance;
        this._resource.shadowColor = this._shadowColor;
        this._resource.enabled = this._enabled;
      }
    }, {
      key: "enabled",

      /**
       * @en Whether activate planar shadow
       * @zh 是否启用平面阴影？
       */
      set: function set(val) {
        this._enabled = val;

        if (this._resource) {
          this._resource.enabled = val;
        }
      },
      get: function get() {
        return this._enabled;
      }
    }, {
      key: "type",
      set: function set(val) {
        this._type = val;

        if (this._resource) {
          this._resource.type = val;
        }
      },
      get: function get() {
        return this._type;
      }
      /**
       * @en Shadow color
       * @zh 阴影颜色
       */

    }, {
      key: "shadowColor",
      set: function set(val) {
        this._shadowColor.set(val);

        if (this._resource) {
          this._resource.shadowColor = val;
        }
      },
      get: function get() {
        return this._shadowColor;
      }
      /**
       * @en The normal of the plane which receives shadow
       * @zh 阴影接收平面的法线
       */

    }, {
      key: "normal",
      set: function set(val) {
        _index2.Vec3.copy(this._normal, val);

        if (this._resource) {
          this._resource.normal = val;
        }
      },
      get: function get() {
        return this._normal;
      }
      /**
       * @en The distance from coordinate origin to the receiving plane.
       * @zh 阴影接收平面与原点的距离
       */

    }, {
      key: "distance",
      set: function set(val) {
        this._distance = val;

        if (this._resource) {
          this._resource.distance = val;
        }
      },
      get: function get() {
        return this._distance;
      }
      /**
       * @en The normal of the plane which receives shadow
       * @zh 阴影接收平面的法线
       */

    }, {
      key: "pcf",
      set: function set(val) {
        this._pcf = val;

        if (this._resource) {
          this._resource.pcf = val;
        }
      },
      get: function get() {
        return this._pcf;
      }
      /**
       * @en get or set shadow camera near
       * @zh 获取或者设置阴影相机近裁剪面
       */

    }, {
      key: "near",
      set: function set(val) {
        this._near = val;

        if (this._resource) {
          this._resource.near = val;
        }
      },
      get: function get() {
        return this._near;
      }
      /**
       * @en get or set shadow camera far
       * @zh 获取或者设置阴影相机远裁剪面
       */

    }, {
      key: "far",
      set: function set(val) {
        this._far = val;

        if (this._resource) {
          this._resource.far = val;
        }
      },
      get: function get() {
        return this._far;
      }
      /**
       * @en get or set shadow camera orthoSize
       * @zh 获取或者设置阴影相机正交大小
       */

    }, {
      key: "orthoSize",
      set: function set(val) {
        this._orthoSize = val;

        if (this._resource) {
          this._resource.orthoSize = val;
        }
      },
      get: function get() {
        return this._orthoSize;
      }
      /**
       * @en get or set shadow camera orthoSize
       * @zh 获取或者设置阴影纹理大小
       */

    }, {
      key: "shadowMapSize",
      set: function set(val) {
        this._size.set(val);

        if (this._resource) {
          this._resource.size = val;
        }
      },
      get: function get() {
        return this._size;
      }
      /**
       * @en get or set shadow camera orthoSize
       * @zh 获取或者设置阴影纹理大小
       */

    }, {
      key: "aspect",
      set: function set(val) {
        this._aspect = val;

        if (this._resource) {
          this._resource.aspect = val;
        }
      },
      get: function get() {
        return this._aspect;
      }
    }]);

    return ShadowsInfo;
  }(), _temp4), (_descriptor17 = _applyDecoratedDescriptor(_class11.prototype, "_type", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _shadows.ShadowType.Planar;
    }
  }), _descriptor18 = _applyDecoratedDescriptor(_class11.prototype, "_enabled", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor19 = _applyDecoratedDescriptor(_class11.prototype, "_normal", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(0, 1, 0);
    }
  }), _descriptor20 = _applyDecoratedDescriptor(_class11.prototype, "_distance", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor21 = _applyDecoratedDescriptor(_class11.prototype, "_shadowColor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Color(0, 0, 0, 76);
    }
  }), _descriptor22 = _applyDecoratedDescriptor(_class11.prototype, "_pcf", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _shadows.PCFType.HARD;
    }
  }), _descriptor23 = _applyDecoratedDescriptor(_class11.prototype, "_near", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor24 = _applyDecoratedDescriptor(_class11.prototype, "_far", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 30;
    }
  }), _descriptor25 = _applyDecoratedDescriptor(_class11.prototype, "_aspect", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor26 = _applyDecoratedDescriptor(_class11.prototype, "_orthoSize", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 5;
    }
  }), _descriptor27 = _applyDecoratedDescriptor(_class11.prototype, "_size", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec2(512, 512);
    }
  }), _applyDecoratedDescriptor(_class11.prototype, "enabled", [_index.editable], Object.getOwnPropertyDescriptor(_class11.prototype, "enabled"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "type", [_index.editable, _dec34], Object.getOwnPropertyDescriptor(_class11.prototype, "type"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "shadowColor", [_index.editable], Object.getOwnPropertyDescriptor(_class11.prototype, "shadowColor"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "normal", [_dec35], Object.getOwnPropertyDescriptor(_class11.prototype, "normal"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "distance", [_dec36, _dec37], Object.getOwnPropertyDescriptor(_class11.prototype, "distance"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "pcf", [_dec38, _dec39], Object.getOwnPropertyDescriptor(_class11.prototype, "pcf"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "near", [_dec40, _dec41], Object.getOwnPropertyDescriptor(_class11.prototype, "near"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "far", [_dec42, _dec43], Object.getOwnPropertyDescriptor(_class11.prototype, "far"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "orthoSize", [_dec44, _dec45], Object.getOwnPropertyDescriptor(_class11.prototype, "orthoSize"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "shadowMapSize", [_dec46], Object.getOwnPropertyDescriptor(_class11.prototype, "shadowMapSize"), _class11.prototype), _applyDecoratedDescriptor(_class11.prototype, "aspect", [_dec47, _dec48], Object.getOwnPropertyDescriptor(_class11.prototype, "aspect"), _class11.prototype)), _class11)) || _class10);
  _exports.ShadowsInfo = ShadowsInfo;
  _globalExports.legacyCC.ShadowsInfo = ShadowsInfo;
  /**
   * @en All scene related global parameters, it affects all content in the corresponding scene
   * @zh 各类场景级别的渲染参数，将影响全场景的所有物体
   */

  var SceneGlobals = (_dec49 = (0, _index.ccclass)('cc.SceneGlobals'), _dec50 = (0, _index.type)(SkyboxInfo), _dec49(_class13 = (_class14 = (_temp5 = /*#__PURE__*/function () {
    function SceneGlobals() {
      _classCallCheck(this, SceneGlobals);

      _initializerDefineProperty(this, "ambient", _descriptor28, this);

      _initializerDefineProperty(this, "shadows", _descriptor29, this);

      _initializerDefineProperty(this, "_skybox", _descriptor30, this);

      _initializerDefineProperty(this, "fog", _descriptor31, this);
    }

    _createClass(SceneGlobals, [{
      key: "activate",
      value: function activate() {
        var pipeline = _globalExports.legacyCC.director.root.pipeline;
        this.ambient.activate(pipeline.ambient);
        this.skybox.activate(pipeline.skybox);
        this.shadows.activate(pipeline.shadows);
        this.fog.activate(pipeline.fog);
      }
    }, {
      key: "skybox",

      /**
       * @en Skybox related information
       * @zh 天空盒相关信息
       */
      get: function get() {
        return this._skybox;
      },
      set: function set(value) {
        this._skybox = value;
      }
    }]);

    return SceneGlobals;
  }(), _temp5), (_descriptor28 = _applyDecoratedDescriptor(_class14.prototype, "ambient", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new AmbientInfo();
    }
  }), _descriptor29 = _applyDecoratedDescriptor(_class14.prototype, "shadows", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new ShadowsInfo();
    }
  }), _descriptor30 = _applyDecoratedDescriptor(_class14.prototype, "_skybox", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new SkyboxInfo();
    }
  }), _descriptor31 = _applyDecoratedDescriptor(_class14.prototype, "fog", [_index.editable, _index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new FogInfo();
    }
  }), _applyDecoratedDescriptor(_class14.prototype, "skybox", [_index.editable, _dec50], Object.getOwnPropertyDescriptor(_class14.prototype, "skybox"), _class14.prototype)), _class14)) || _class13);
  _exports.SceneGlobals = SceneGlobals;
  _globalExports.legacyCC.SceneGlobals = SceneGlobals;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvc2NlbmUtZ2xvYmFscy50cyJdLCJuYW1lcyI6WyJfdXAiLCJWZWMzIiwiX3YzIiwiX3F0IiwiUXVhdCIsIkFtYmllbnRJbmZvIiwiQ0NGbG9hdCIsIl9yZXNvdXJjZSIsInJlc291cmNlIiwic2t5Q29sb3IiLCJfc2t5Q29sb3IiLCJza3lJbGx1bSIsIl9za3lJbGx1bSIsImdyb3VuZEFsYmVkbyIsIl9ncm91bmRBbGJlZG8iLCJ2YWwiLCJzZXQiLCJzZXJpYWxpemFibGUiLCJDb2xvciIsIkFtYmllbnQiLCJTS1lfSUxMVU0iLCJlZGl0YWJsZSIsImxlZ2FjeUNDIiwiU2t5Ym94SW5mbyIsIlRleHR1cmVDdWJlIiwiYWN0aXZhdGUiLCJlbmFibGVkIiwiX2VuYWJsZWQiLCJpc1JHQkUiLCJfaXNSR0JFIiwiZW52bWFwIiwiX2Vudm1hcCIsInVzZUlCTCIsIl91c2VJQkwiLCJGb2dJbmZvIiwiRm9nVHlwZSIsIl90eXBlIiwiTEFZRVJFRCIsIkxJTkVBUiIsImZvZ0NvbG9yIiwiX2ZvZ0NvbG9yIiwidHlwZSIsImZvZ0RlbnNpdHkiLCJfZm9nRGVuc2l0eSIsImZvZ1N0YXJ0IiwiX2ZvZ1N0YXJ0IiwiZm9nRW5kIiwiX2ZvZ0VuZCIsImZvZ0F0dGVuIiwiX2ZvZ0F0dGVuIiwiZm9nVG9wIiwiX2ZvZ1RvcCIsImZvZ1JhbmdlIiwiX2ZvZ1JhbmdlIiwic2xpZGUiLCJTaGFkb3dzSW5mbyIsIlNoYWRvd1R5cGUiLCJQbGFuYXIiLCJQQ0ZUeXBlIiwiU2hhZG93TWFwIiwibm9kZSIsImdldFdvcmxkUm90YXRpb24iLCJub3JtYWwiLCJ0cmFuc2Zvcm1RdWF0IiwiZ2V0V29ybGRQb3NpdGlvbiIsImRpc3RhbmNlIiwiZG90IiwiX25vcm1hbCIsIm5lYXIiLCJfbmVhciIsImZhciIsIl9mYXIiLCJvcnRob1NpemUiLCJfb3J0aG9TaXplIiwic2l6ZSIsIl9zaXplIiwiX2Rpc3RhbmNlIiwic2hhZG93Q29sb3IiLCJfc2hhZG93Q29sb3IiLCJjb3B5IiwiX3BjZiIsInBjZiIsIl9hc3BlY3QiLCJhc3BlY3QiLCJIQVJEIiwiVmVjMiIsIlNjZW5lR2xvYmFscyIsInBpcGVsaW5lIiwiZGlyZWN0b3IiLCJyb290IiwiYW1iaWVudCIsInNreWJveCIsInNoYWRvd3MiLCJmb2ciLCJfc2t5Ym94IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQ0EsTUFBTUEsR0FBRyxHQUFHLElBQUlDLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBWjs7QUFDQSxNQUFNQyxHQUFHLEdBQUcsSUFBSUQsWUFBSixFQUFaOztBQUNBLE1BQU1FLEdBQUcsR0FBRyxJQUFJQyxZQUFKLEVBQVo7QUFFQTs7Ozs7O01BS2FDLFcsV0FEWixvQkFBUSxnQkFBUixDLFVBNkJJLGlCQUFLQyxrQkFBTCxDOzs7Ozs7Ozs7O1dBcEJTQyxTLEdBQTRCLEk7Ozs7OytCQTJDckJDLFEsRUFBbUI7QUFDaEMsYUFBS0QsU0FBTCxHQUFpQkMsUUFBakI7QUFDQSxhQUFLRCxTQUFMLENBQWVFLFFBQWYsR0FBMEIsS0FBS0MsU0FBL0I7QUFDQSxhQUFLSCxTQUFMLENBQWVJLFFBQWYsR0FBMEIsS0FBS0MsU0FBL0I7QUFDQSxhQUFLTCxTQUFMLENBQWVNLFlBQWYsR0FBOEIsS0FBS0MsYUFBbkM7QUFDSDs7OztBQTlDRDs7Ozt3QkFLY0MsRyxFQUFZO0FBQ3RCLGFBQUtMLFNBQUwsQ0FBZU0sR0FBZixDQUFtQkQsR0FBbkI7O0FBQ0EsWUFBSSxLQUFLUixTQUFULEVBQW9CO0FBQUUsZUFBS0EsU0FBTCxDQUFlRSxRQUFmLEdBQTBCLEtBQUtDLFNBQS9CO0FBQTJDO0FBQ3BFLE87MEJBQ2U7QUFDWixlQUFPLEtBQUtBLFNBQVo7QUFDSDtBQUVEOzs7Ozs7O3dCQU1jSyxHLEVBQWE7QUFDdkIsYUFBS0gsU0FBTCxHQUFpQkcsR0FBakI7O0FBQ0Es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Qjs7Ozs7YUFDdUIsSUFBSW9FLFlBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxDOztnRUFRdkJoRSxlLCtJQVNBQSxlLDJKQWNBQSxlOztBQWdKTEMsMEJBQVNpQyxXQUFULEdBQXVCQSxXQUF2QjtBQUVBOzs7OztNQUthK0IsWSxhQURaLG9CQUFRLGlCQUFSLEMsV0EyQkksaUJBQUsvRCxVQUFMLEM7Ozs7Ozs7Ozs7Ozs7OztpQ0FRa0I7QUFDZixZQUFNZ0UsUUFBUSxHQUFHakUsd0JBQVNrRSxRQUFULENBQWtCQyxJQUFsQixDQUF1QkYsUUFBeEM7QUFDQSxhQUFLRyxPQUFMLENBQWFqRSxRQUFiLENBQXNCOEQsUUFBUSxDQUFDRyxPQUEvQjtBQUNBLGFBQUtDLE1BQUwsQ0FBWWxFLFFBQVosQ0FBcUI4RCxRQUFRLENBQUNJLE1BQTlCO0FBQ0EsYUFBS0MsT0FBTCxDQUFhbkUsUUFBYixDQUFzQjhELFFBQVEsQ0FBQ0ssT0FBL0I7QUFDQSxhQUFLQyxHQUFMLENBQVNwRSxRQUFULENBQWtCOEQsUUFBUSxDQUFDTSxHQUEzQjtBQUNIOzs7O0FBbkJEOzs7OzBCQU1jO0FBQ1YsZUFBTyxLQUFLQyxPQUFaO0FBQ0gsTzt3QkFDV0MsSyxFQUFPO0FBQ2YsYUFBS0QsT0FBTCxHQUFlQyxLQUFmO0FBQ0g7Ozs7MkZBM0JBOUUsbUIsRUFDQUksZTs7Ozs7YUFDZ0IsSUFBSWhCLFdBQUosRTs7Z0ZBS2hCWSxtQixFQUNBSSxlOzs7OzthQUNnQixJQUFJa0MsV0FBSixFOztnRkFDaEJ0QyxtQjs7Ozs7YUFDZ0IsSUFBSU0sVUFBSixFOzs0RUFDaEJGLGUsRUFDQUosbUI7Ozs7O2FBQ1ksSUFBSWlCLE9BQUosRTs7K0RBTVpiLGU7O0FBaUJMQywwQkFBU2dFLFlBQVQsR0FBd0JBLFlBQXhCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHNjZW5lLWdyYXBoXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgVGV4dHVyZUN1YmUgfSBmcm9tICcuLi9hc3NldHMvdGV4dHVyZS1jdWJlJztcclxuaW1wb3J0IHsgY2NjbGFzcywgdmlzaWJsZSwgdHlwZSwgZGlzcGxheU9yZGVyLCBzbGlkZSwgcmFuZ2UsIHJhbmdlU3RlcCwgZWRpdGFibGUsIHNlcmlhbGl6YWJsZX0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ0NCb29sZWFuLCBDQ0Zsb2F0IH0gZnJvbSAnLi4vZGF0YS91dGlscy9hdHRyaWJ1dGUnO1xyXG5pbXBvcnQgeyBDb2xvciwgUXVhdCwgVmVjMywgVmVjMiB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBBbWJpZW50IH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvYW1iaWVudCc7XHJcbmltcG9ydCB7IFNoYWRvd3MsIFNoYWRvd1R5cGUsIFBDRlR5cGUgfSBmcm9tICcuLi9yZW5kZXJlci9zY2VuZS9zaGFkb3dzJztcclxuaW1wb3J0IHsgU2t5Ym94IH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvc2t5Ym94JztcclxuaW1wb3J0IHsgRm9nLCBGb2dUeXBlIH0gZnJvbSAnLi4vcmVuZGVyZXIvc2NlbmUvZm9nJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4vbm9kZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgX3VwID0gbmV3IFZlYzMoMCwgMSwgMCk7XHJcbmNvbnN0IF92MyA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF9xdCA9IG5ldyBRdWF0KCk7XHJcblxyXG4vKipcclxuICogQGVuIEVudmlyb25tZW50IGxpZ2h0aW5nIGluZm9ybWF0aW9uIGluIHRoZSBTY2VuZVxyXG4gKiBAemgg5Zy65pmv55qE546v5aKD5YWJ54Wn55u45YWz5L+h5oGvXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQW1iaWVudEluZm8nKVxyXG5leHBvcnQgY2xhc3MgQW1iaWVudEluZm8ge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9za3lDb2xvciA9IG5ldyBDb2xvcig1MSwgMTI4LCAyMDQsIDEuMCk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3NreUlsbHVtID0gQW1iaWVudC5TS1lfSUxMVU07XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2dyb3VuZEFsYmVkbyA9IG5ldyBDb2xvcig1MSwgNTEsIDUxLCAyNTUpO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcmVzb3VyY2U6IEFtYmllbnQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTa3kgY29sb3JcclxuICAgICAqIEB6aCDlpKnnqbrpopzoibJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgc2t5Q29sb3IgKHZhbDogQ29sb3IpIHtcclxuICAgICAgICB0aGlzLl9za3lDb2xvci5zZXQodmFsKTtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2Uuc2t5Q29sb3IgPSB0aGlzLl9za3lDb2xvcjsgfVxyXG4gICAgfVxyXG4gICAgZ2V0IHNreUNvbG9yICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2t5Q29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2t5IGlsbHVtaW5hbmNlXHJcbiAgICAgKiBAemgg5aSp56m65Lqu5bqmXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgQHR5cGUoQ0NGbG9hdClcclxuICAgIHNldCBza3lJbGx1bSAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9za3lJbGx1bSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2Uuc2t5SWxsdW0gPSB0aGlzLnNreUlsbHVtOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgc2t5SWxsdW0gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9za3lJbGx1bTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHcm91bmQgY29sb3JcclxuICAgICAqIEB6aCDlnLDpnaLpopzoibJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgZ3JvdW5kQWxiZWRvICh2YWw6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5fZ3JvdW5kQWxiZWRvLnNldCh2YWwpO1xyXG4gICAgICAgIC8vIG9ubHkgUkdCIGNoYW5uZWxzIGFyZSB1c2VkLCBhbHBoYSBjaGFubmVsIGFyZSBpbnRlbnNpb25hbGx5IGxlZnQgdW5jaGFuZ2VkIGhlcmVcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UuZ3JvdW5kQWxiZWRvID0gdGhpcy5fZ3JvdW5kQWxiZWRvOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgZ3JvdW5kQWxiZWRvICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3JvdW5kQWxiZWRvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAocmVzb3VyY2U6IEFtYmllbnQpIHtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZSA9IHJlc291cmNlO1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlLnNreUNvbG9yID0gdGhpcy5fc2t5Q29sb3I7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2Uuc2t5SWxsdW0gPSB0aGlzLl9za3lJbGx1bTtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5ncm91bmRBbGJlZG8gPSB0aGlzLl9ncm91bmRBbGJlZG87XHJcbiAgICB9XHJcbn1cclxubGVnYWN5Q0MuQW1iaWVudEluZm8gPSBBbWJpZW50SW5mbztcclxuXHJcbi8qKlxyXG4gKiBAZW4gU2t5Ym94IHJlbGF0ZWQgaW5mb3JtYXRpb25cclxuICogQHpoIOWkqeepuuebkuebuOWFs+S/oeaBr1xyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlNreWJveEluZm8nKVxyXG5leHBvcnQgY2xhc3MgU2t5Ym94SW5mbyB7XHJcbiAgICBAdHlwZShUZXh0dXJlQ3ViZSlcclxuICAgIHByb3RlY3RlZCBfZW52bWFwOiBUZXh0dXJlQ3ViZSB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9pc1JHQkUgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF91c2VJQkwgPSBmYWxzZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3Jlc291cmNlOiBTa3lib3ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXaGV0aGVyIGFjdGl2YXRlIHNreWJveCBpbiB0aGUgc2NlbmVcclxuICAgICAqIEB6aCDmmK/lkKblkK/nlKjlpKnnqbrnm5LvvJ9cclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgZW5hYmxlZCAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UuZW5hYmxlZCA9IHRoaXMuX2VuYWJsZWQ7IH1cclxuICAgIH1cclxuICAgIGdldCBlbmFibGVkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXaGV0aGVyIHVzZSBlbnZpcm9ubWVudCBsaWdodGluZ1xyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOeOr+Wig+WFieeFp++8n1xyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHNldCB1c2VJQkwgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3VzZUlCTCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UudXNlSUJMID0gdGhpcy5fdXNlSUJMOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgdXNlSUJMICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlSUJMO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0ZXh0dXJlIGN1YmUgdXNlZCBmb3IgdGhlIHNreWJveFxyXG4gICAgICogQHpoIOS9v+eUqOeahOeri+aWueS9k+i0tOWbvlxyXG4gICAgICovXHJcbiAgICBcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgQHR5cGUoVGV4dHVyZUN1YmUpXHJcbiAgICBzZXQgZW52bWFwICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9lbnZtYXAgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlKSB7IHRoaXMuX3Jlc291cmNlLmVudm1hcCA9IHRoaXMuX2Vudm1hcDsgfVxyXG4gICAgfVxyXG4gICAgZ2V0IGVudm1hcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Vudm1hcDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXaGV0aGVyIGVuYWJsZSBSR0JFIGRhdGEgc3VwcG9ydCBpbiBza3lib3ggc2hhZGVyXHJcbiAgICAgKiBAemgg5piv5ZCm6ZyA6KaB5byA5ZCvIHNoYWRlciDlhoXnmoQgUkdCRSDmlbDmja7mlK/mjIHvvJ9cclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgaXNSR0JFICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9pc1JHQkUgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlKSB7IHRoaXMuX3Jlc291cmNlLmlzUkdCRSA9IHRoaXMuX2lzUkdCRTsgfVxyXG4gICAgfVxyXG4gICAgZ2V0IGlzUkdCRSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUkdCRTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0aXZhdGUgKHJlc291cmNlOiBTa3lib3gpIHtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZSA9IHJlc291cmNlO1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlLmFjdGl2YXRlKCk7IC8vIHVwZGF0ZSBnbG9iYWwgRFMgZmlyc3RcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5lbmFibGVkID0gdGhpcy5fZW5hYmxlZDtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5pc1JHQkUgPSB0aGlzLl9pc1JHQkU7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2UuZW52bWFwID0gdGhpcy5fZW52bWFwO1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlLnVzZUlCTCA9IHRoaXMuX3VzZUlCTDtcclxuICAgIH1cclxufVxyXG5sZWdhY3lDQy5Ta3lib3hJbmZvID0gU2t5Ym94SW5mbztcclxuXHJcbi8qKlxyXG4gKiBAemgg5YWo5bGA6Zu+55u45YWz5L+h5oGvXHJcbiAqIEBlbiBHbG9iYWwgZm9nIGluZm9cclxuICovXHJcbkBjY2NsYXNzKCdjYy5Gb2dJbmZvJylcclxuZXhwb3J0IGNsYXNzIEZvZ0luZm8ge1xyXG4gICAgcHVibGljIHN0YXRpYyBGb2dUeXBlID0gRm9nVHlwZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdHlwZSA9IEZvZ1R5cGUuTElORUFSO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9mb2dDb2xvciA9IG5ldyBDb2xvcignI0M4QzhDOCcpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9lbmFibGVkID0gZmFsc2U7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZvZ0RlbnNpdHkgPSAwLjM7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZvZ1N0YXJ0ID0gMC41O1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9mb2dFbmQgPSAzMDA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZvZ0F0dGVuID0gNTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZm9nVG9wID0gMS41O1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9mb2dSYW5nZSA9IDEuMjtcclxuICAgIHByb3RlY3RlZCBfcmVzb3VyY2U6IEZvZyB8IG51bGwgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5piv5ZCm5ZCv55So5YWo5bGA6Zu+5pWIXHJcbiAgICAgKiBAZW4gRW5hYmxlIGdsb2JhbCBmb2dcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgZW5hYmxlZCAodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UuZW5hYmxlZCA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBlbmFibGVkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlhajlsYDpm77popzoibJcclxuICAgICAqIEBlbiBHbG9iYWwgZm9nIGNvbG9yXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgc2V0IGZvZ0NvbG9yICh2YWw6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5fZm9nQ29sb3Iuc2V0KHZhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlKSB7IHRoaXMuX3Jlc291cmNlLmZvZ0NvbG9yID0gdGhpcy5fZm9nQ29sb3I7IH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgZm9nQ29sb3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb2dDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlhajlsYDpm77nsbvlnotcclxuICAgICAqIEBlbiBHbG9iYWwgZm9nIHR5cGVcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBAdHlwZShGb2dUeXBlKVxyXG4gICAgZ2V0IHR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0eXBlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS50eXBlID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5YWo5bGA6Zu+5rWT5bqmXHJcbiAgICAgKiBAZW4gR2xvYmFsIGZvZyBkZW5zaXR5XHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENDRmxvYXQpXHJcbiAgICBAcmFuZ2UoWzAsIDFdKVxyXG4gICAgQHJhbmdlU3RlcCgwLjAxKVxyXG4gICAgQHNsaWRlXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogRm9nSW5mbykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlICE9PSBGb2dUeXBlLkxBWUVSRUQgJiYgdGhpcy5fdHlwZSAhPT0gRm9nVHlwZS5MSU5FQVI7XHJcbiAgICB9KVxyXG4gICAgZ2V0IGZvZ0RlbnNpdHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb2dEZW5zaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb2dEZW5zaXR5ICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9mb2dEZW5zaXR5ID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS5mb2dEZW5zaXR5ID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6Zu+5pWI6LW35aeL5L2N572u77yM5Y+q6YCC55So5LqO57q/5oCn6Zu+XHJcbiAgICAgKiBAZW4gR2xvYmFsIGZvZyBzdGFydCBwb3NpdGlvbiwgb25seSBmb3IgbGluZWFyIGZvZ1xyXG4gICAgICovXHJcbiAgICBAdHlwZShDQ0Zsb2F0KVxyXG4gICAgQHJhbmdlU3RlcCgwLjEpXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogRm9nSW5mbykgeyByZXR1cm4gdGhpcy5fdHlwZSA9PT0gRm9nVHlwZS5MSU5FQVI7IH0pXHJcbiAgICBnZXQgZm9nU3RhcnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb2dTdGFydDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZm9nU3RhcnQgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2ZvZ1N0YXJ0ID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS5mb2dTdGFydCA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmbvuaViOe7k+adn+S9jee9ru+8jOWPqumAgueUqOS6jue6v+aAp+mbvlxyXG4gICAgICogQGVuIEdsb2JhbCBmb2cgZW5kIHBvc2l0aW9uLCBvbmx5IGZvciBsaW5lYXIgZm9nXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENDRmxvYXQpXHJcbiAgICBAcmFuZ2VTdGVwKDAuMSlcclxuICAgIEBkaXNwbGF5T3JkZXIoNSlcclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBGb2dJbmZvKSB7ICByZXR1cm4gdGhpcy5fdHlwZSA9PT0gRm9nVHlwZS5MSU5FQVI7IH0pXHJcbiAgICBnZXQgZm9nRW5kICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9nRW5kO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmb2dFbmQgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2ZvZ0VuZCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UuZm9nRW5kID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6Zu+5pWI6KGw5YePXHJcbiAgICAgKiBAZW4gR2xvYmFsIGZvZyBhdHRlbnVhdGlvblxyXG4gICAgICovXHJcbiAgICBAdHlwZShDQ0Zsb2F0KVxyXG4gICAgQHJhbmdlU3RlcCgwLjEpXHJcbiAgICBAZGlzcGxheU9yZGVyKDYpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogRm9nSW5mbykgeyByZXR1cm4gdGhpcy5fdHlwZSAhPT0gRm9nVHlwZS5MSU5FQVI7IH0pXHJcbiAgICBnZXQgZm9nQXR0ZW4gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb2dBdHRlbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZm9nQXR0ZW4gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2ZvZ0F0dGVuID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS5mb2dBdHRlbiA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmbvuaViOmhtumDqOiMg+WbtO+8jOWPqumAgueUqOS6juWxgue6p+mbvlxyXG4gICAgICogQGVuIEdsb2JhbCBmb2cgdG9wIHJhbmdlLCBvbmx5IGZvciBsYXllcmVkIGZvZ1xyXG4gICAgICovXHJcbiAgICBAdHlwZShDQ0Zsb2F0KVxyXG4gICAgQHJhbmdlU3RlcCgwLjEpXHJcbiAgICBAZGlzcGxheU9yZGVyKDcpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogRm9nSW5mbykgeyByZXR1cm4gdGhpcy5fdHlwZSA9PT0gRm9nVHlwZS5MQVlFUkVEOyB9KVxyXG4gICAgZ2V0IGZvZ1RvcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvZ1RvcDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZm9nVG9wICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9mb2dUb3AgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlKSB7IHRoaXMuX3Jlc291cmNlLmZvZ1RvcCA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmbvuaViOiMg+WbtO+8jOWPqumAgueUqOS6juWxgue6p+mbvlxyXG4gICAgICogQGVuIEdsb2JhbCBmb2cgcmFuZ2UsIG9ubHkgZm9yIGxheWVyZWQgZm9nXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENDRmxvYXQpXHJcbiAgICBAcmFuZ2VTdGVwKDAuMSlcclxuICAgIEBkaXNwbGF5T3JkZXIoOClcclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBGb2dJbmZvKSB7IHJldHVybiB0aGlzLl90eXBlID09PSBGb2dUeXBlLkxBWUVSRUQ7IH0pXHJcbiAgICBnZXQgZm9nUmFuZ2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mb2dSYW5nZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZm9nUmFuZ2UgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2ZvZ1JhbmdlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS5mb2dSYW5nZSA9IHZhbDsgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAocmVzb3VyY2U6IEZvZykge1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlID0gcmVzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2UuZW5hYmxlZCA9IHRoaXMuX2VuYWJsZWQ7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2UuZm9nQ29sb3IgPSB0aGlzLl9mb2dDb2xvcjtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS50eXBlID0gdGhpcy5fdHlwZTtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5mb2dEZW5zaXR5ID0gdGhpcy5fZm9nRGVuc2l0eTtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5mb2dTdGFydCA9IHRoaXMuX2ZvZ1N0YXJ0O1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlLmZvZ0VuZCA9IHRoaXMuX2ZvZ0VuZDtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5mb2dBdHRlbiA9IHRoaXMuX2ZvZ0F0dGVuO1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlLmZvZ1RvcCA9IHRoaXMuX2ZvZ1RvcDtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5mb2dSYW5nZSA9IHRoaXMuX2ZvZ1JhbmdlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIFNjZW5lIGxldmVsIHBsYW5hciBzaGFkb3cgcmVsYXRlZCBpbmZvcm1hdGlvblxyXG4gKiBAemgg5bmz6Z2i6Zi05b2x55u45YWz5L+h5oGvXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuU2hhZG93c0luZm8nKVxyXG5leHBvcnQgY2xhc3MgU2hhZG93c0luZm8ge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF90eXBlID0gU2hhZG93VHlwZS5QbGFuYXI7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2VuYWJsZWQgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbm9ybWFsID0gbmV3IFZlYzMoMCwgMSwgMCk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2Rpc3RhbmNlID0gMDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfc2hhZG93Q29sb3IgPSBuZXcgQ29sb3IoMCwgMCwgMCwgNzYpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9wY2YgPSBQQ0ZUeXBlLkhBUkQ7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX25lYXI6IG51bWJlciA9IDE7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2ZhcjogbnVtYmVyID0gMzA7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2FzcGVjdDogbnVtYmVyID0gMTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfb3J0aG9TaXplOiBudW1iZXIgPSA1O1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zaXplOiBWZWMyID0gbmV3IFZlYzIoNTEyLCA1MTIpO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcmVzb3VyY2U6IFNoYWRvd3MgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXaGV0aGVyIGFjdGl2YXRlIHBsYW5hciBzaGFkb3dcclxuICAgICAqIEB6aCDmmK/lkKblkK/nlKjlubPpnaLpmLTlvbHvvJ9cclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgZW5hYmxlZCAodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UuZW5hYmxlZCA9IHZhbDsgfVxyXG4gICAgfVxyXG4gICAgZ2V0IGVuYWJsZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgQHR5cGUoU2hhZG93VHlwZSlcclxuICAgIHNldCB0eXBlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS50eXBlID0gdmFsOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgdHlwZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2hhZG93IGNvbG9yXHJcbiAgICAgKiBAemgg6Zi05b2x6aKc6ImyXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgc2V0IHNoYWRvd0NvbG9yICh2YWw6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhZG93Q29sb3Iuc2V0KHZhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlKSB7IHRoaXMuX3Jlc291cmNlLnNoYWRvd0NvbG9yID0gdmFsOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgc2hhZG93Q29sb3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dDb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbm9ybWFsIG9mIHRoZSBwbGFuZSB3aGljaCByZWNlaXZlcyBzaGFkb3dcclxuICAgICAqIEB6aCDpmLTlvbHmjqXmlLblubPpnaLnmoTms5Xnur9cclxuICAgICAqL1xyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFNoYWRvd3NJbmZvKSB7IHJldHVybiB0aGlzLl90eXBlID09PSBTaGFkb3dUeXBlLlBsYW5hcjsgfSlcclxuICAgIHNldCBub3JtYWwgKHZhbDogVmVjMykge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9ub3JtYWwsIHZhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Jlc291cmNlKSB7IHRoaXMuX3Jlc291cmNlLm5vcm1hbCA9IHZhbDsgfVxyXG4gICAgfVxyXG4gICAgZ2V0IG5vcm1hbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vcm1hbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZGlzdGFuY2UgZnJvbSBjb29yZGluYXRlIG9yaWdpbiB0byB0aGUgcmVjZWl2aW5nIHBsYW5lLlxyXG4gICAgICogQHpoIOmYtOW9seaOpeaUtuW5s+mdouS4juWOn+eCueeahOi3neemu1xyXG4gICAgICovXHJcbiAgICBAdHlwZShDQ0Zsb2F0KVxyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFNoYWRvd3NJbmZvKSB7IHJldHVybiB0aGlzLl90eXBlID09PSBTaGFkb3dUeXBlLlBsYW5hcjsgfSlcclxuICAgIHNldCBkaXN0YW5jZSAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kaXN0YW5jZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UuZGlzdGFuY2UgPSB2YWw7IH1cclxuICAgIH1cclxuICAgIGdldCBkaXN0YW5jZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBub3JtYWwgb2YgdGhlIHBsYW5lIHdoaWNoIHJlY2VpdmVzIHNoYWRvd1xyXG4gICAgICogQHpoIOmYtOW9seaOpeaUtuW5s+mdoueahOazlee6v1xyXG4gICAgICovXHJcbiAgICBAdHlwZShQQ0ZUeXBlKVxyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFNoYWRvd3NJbmZvKSB7IHJldHVybiB0aGlzLl90eXBlID09PSBTaGFkb3dUeXBlLlNoYWRvd01hcDsgfSlcclxuICAgIHNldCBwY2YgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3BjZiA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UucGNmID0gdmFsOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgcGNmICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGNmO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBvciBzZXQgc2hhZG93IGNhbWVyYSBuZWFyXHJcbiAgICAgKiBAemgg6I635Y+W5oiW6ICF6K6+572u6Zi05b2x55u45py66L+R6KOB5Ymq6Z2iXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENDRmxvYXQpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogU2hhZG93c0luZm8pIHsgcmV0dXJuIHRoaXMuX3R5cGUgPT09IFNoYWRvd1R5cGUuU2hhZG93TWFwOyB9KVxyXG4gICAgc2V0IG5lYXIgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbmVhciA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UubmVhciA9IHZhbDsgfVxyXG4gICAgfVxyXG4gICAgZ2V0IG5lYXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBvciBzZXQgc2hhZG93IGNhbWVyYSBmYXJcclxuICAgICAqIEB6aCDojrflj5bmiJbogIXorr7nva7pmLTlvbHnm7jmnLrov5zoo4HliarpnaJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ0NGbG9hdClcclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBTaGFkb3dzSW5mbykgeyByZXR1cm4gdGhpcy5fdHlwZSA9PT0gU2hhZG93VHlwZS5TaGFkb3dNYXA7IH0pXHJcbiAgICBzZXQgZmFyICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZhciA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2UuZmFyID0gdmFsOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgZmFyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmFyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBvciBzZXQgc2hhZG93IGNhbWVyYSBvcnRob1NpemVcclxuICAgICAqIEB6aCDojrflj5bmiJbogIXorr7nva7pmLTlvbHnm7jmnLrmraPkuqTlpKflsI9cclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ0NGbG9hdClcclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBTaGFkb3dzSW5mbykgeyByZXR1cm4gdGhpcy5fdHlwZSA9PT0gU2hhZG93VHlwZS5TaGFkb3dNYXA7IH0pXHJcbiAgICBzZXQgb3J0aG9TaXplICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX29ydGhvU2l6ZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fcmVzb3VyY2UpIHsgdGhpcy5fcmVzb3VyY2Uub3J0aG9TaXplID0gdmFsOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgb3J0aG9TaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3J0aG9TaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBvciBzZXQgc2hhZG93IGNhbWVyYSBvcnRob1NpemVcclxuICAgICAqIEB6aCDojrflj5bmiJbogIXorr7nva7pmLTlvbHnurnnkIblpKflsI9cclxuICAgICAqL1xyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFNoYWRvd3NJbmZvKSB7IHJldHVybiB0aGlzLl90eXBlID09PSBTaGFkb3dUeXBlLlNoYWRvd01hcDsgfSlcclxuICAgIHNldCBzaGFkb3dNYXBTaXplICh2YWw6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLl9zaXplLnNldCh2YWwpO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS5zaXplID0gdmFsOyB9XHJcbiAgICB9XHJcbiAgICBnZXQgc2hhZG93TWFwU2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IG9yIHNldCBzaGFkb3cgY2FtZXJhIG9ydGhvU2l6ZVxyXG4gICAgICogQHpoIOiOt+WPluaIluiAheiuvue9rumYtOW9see6ueeQhuWkp+Wwj1xyXG4gICAgICovXHJcbiAgICBAdHlwZShDQ0Zsb2F0KVxyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFNoYWRvd3NJbmZvKSB7IHJldHVybiB0aGlzLl90eXBlID09PSBTaGFkb3dUeXBlLlNoYWRvd01hcDsgfSlcclxuICAgIHNldCBhc3BlY3QgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fYXNwZWN0ID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvdXJjZSkgeyB0aGlzLl9yZXNvdXJjZS5hc3BlY3QgPSB2YWw7IH1cclxuICAgIH1cclxuICAgIGdldCBhc3BlY3QgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hc3BlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHBsYW5lIHdoaWNoIHJlY2VpdmVzIHNoYWRvdyB3aXRoIHRoZSBnaXZlbiBub2RlJ3Mgd29ybGQgdHJhbnNmb3JtYXRpb25cclxuICAgICAqIEB6aCDmoLnmja7mjIflrproioLngrnnmoTkuJbnlYzlj5jmjaLorr7nva7pmLTlvbHmjqXmlLblubPpnaLnmoTkv6Hmga9cclxuICAgICAqIEBwYXJhbSBub2RlIFRoZSBub2RlIGZvciBzZXR0aW5nIHVwIHRoZSBwbGFuZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0UGxhbmVGcm9tTm9kZSAobm9kZTogTm9kZSkge1xyXG4gICAgICAgIG5vZGUuZ2V0V29ybGRSb3RhdGlvbihfcXQpO1xyXG4gICAgICAgIHRoaXMubm9ybWFsID0gVmVjMy50cmFuc2Zvcm1RdWF0KF92MywgX3VwLCBfcXQpO1xyXG4gICAgICAgIG5vZGUuZ2V0V29ybGRQb3NpdGlvbihfdjMpO1xyXG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSBWZWMzLmRvdCh0aGlzLl9ub3JtYWwsIF92Myk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2YXRlIChyZXNvdXJjZTogU2hhZG93cykge1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlID0gcmVzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2UudHlwZSA9IHRoaXMuX3R5cGU7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2UubmVhciA9IHRoaXMuX25lYXI7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2UuZmFyID0gdGhpcy5fZmFyO1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlLm9ydGhvU2l6ZSA9IHRoaXMuX29ydGhvU2l6ZTtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5zaXplID0gdGhpcy5fc2l6ZTtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5ub3JtYWwgPSB0aGlzLl9ub3JtYWw7XHJcbiAgICAgICAgdGhpcy5fcmVzb3VyY2UuZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZTtcclxuICAgICAgICB0aGlzLl9yZXNvdXJjZS5zaGFkb3dDb2xvciA9IHRoaXMuX3NoYWRvd0NvbG9yO1xyXG4gICAgICAgIHRoaXMuX3Jlc291cmNlLmVuYWJsZWQgPSB0aGlzLl9lbmFibGVkO1xyXG4gICAgfVxyXG59XHJcbmxlZ2FjeUNDLlNoYWRvd3NJbmZvID0gU2hhZG93c0luZm87XHJcblxyXG4vKipcclxuICogQGVuIEFsbCBzY2VuZSByZWxhdGVkIGdsb2JhbCBwYXJhbWV0ZXJzLCBpdCBhZmZlY3RzIGFsbCBjb250ZW50IGluIHRoZSBjb3JyZXNwb25kaW5nIHNjZW5lXHJcbiAqIEB6aCDlkITnsbvlnLrmma/nuqfliKvnmoTmuLLmn5Plj4LmlbDvvIzlsIblvbHlk43lhajlnLrmma/nmoTmiYDmnInniankvZNcclxuICovXHJcbkBjY2NsYXNzKCdjYy5TY2VuZUdsb2JhbHMnKVxyXG5leHBvcnQgY2xhc3MgU2NlbmVHbG9iYWxzIHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBlbnZpcm9ubWVudCBsaWdodCBpbmZvcm1hdGlvblxyXG4gICAgICogQHpoIOWcuuaZr+eahOeOr+Wig+WFieeFp+ebuOWFs+S/oeaBr1xyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBhbWJpZW50ID0gbmV3IEFtYmllbnRJbmZvKCk7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTY2VuZSBsZXZlbCBwbGFuYXIgc2hhZG93IHJlbGF0ZWQgaW5mb3JtYXRpb25cclxuICAgICAqIEB6aCDlubPpnaLpmLTlvbHnm7jlhbPkv6Hmga9cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgc2hhZG93cyA9IG5ldyBTaGFkb3dzSW5mbygpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHVibGljIF9za3lib3ggPSBuZXcgU2t5Ym94SW5mbygpO1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgZm9nID0gbmV3IEZvZ0luZm8oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTa3lib3ggcmVsYXRlZCBpbmZvcm1hdGlvblxyXG4gICAgICogQHpoIOWkqeepuuebkuebuOWFs+S/oeaBr1xyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIEB0eXBlKFNreWJveEluZm8pXHJcbiAgICBnZXQgc2t5Ym94ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2t5Ym94O1xyXG4gICAgfVxyXG4gICAgc2V0IHNreWJveCAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9za3lib3ggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0aXZhdGUgKCkge1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5waXBlbGluZTtcclxuICAgICAgICB0aGlzLmFtYmllbnQuYWN0aXZhdGUocGlwZWxpbmUuYW1iaWVudCk7XHJcbiAgICAgICAgdGhpcy5za3lib3guYWN0aXZhdGUocGlwZWxpbmUuc2t5Ym94KTtcclxuICAgICAgICB0aGlzLnNoYWRvd3MuYWN0aXZhdGUocGlwZWxpbmUuc2hhZG93cyk7XHJcbiAgICAgICAgdGhpcy5mb2cuYWN0aXZhdGUocGlwZWxpbmUuZm9nKTtcclxuICAgIH1cclxufVxyXG5sZWdhY3lDQy5TY2VuZUdsb2JhbHMgPSBTY2VuZUdsb2JhbHM7XHJcbiJdfQ==