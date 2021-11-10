/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
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

import { ccclass, editable, serializable, type } from 'cc.decorator';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { Color, Vec2, Vec3 } from '../math';
import { CCFloat } from '../data';
import { TextureCube } from '../assets/texture-cube';
import { Enum } from '../value-types';

/**
 * @zh
 * 全局雾类型。
 * @en
 * The global fog type
 * @static
 * @enum FogInfo.FogType
 */
export const FogType = Enum({
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
    LAYERED: 3,
});

/**
 * @zh 阴影贴图分辨率。
 * @en The shadow map size.
 * @static
 * @enum Shadows.ShadowSize
 */
export const ShadowSize = Enum({
    /**
     * @zh 分辨率 256 * 256。
     * @en shadow resolution 256 * 256.
     * @readonly
     */
    Low_256x256: 256,

    /**
     * @zh 分辨率 512 * 512。
     * @en shadow resolution 512 * 512.
     * @readonly
     */
    Medium_512x512: 512,

    /**
     * @zh 分辨率 1024 * 1024。
     * @en shadow resolution 1024 * 1024.
     * @readonly
     */
    High_1024x1024: 1024,

    /**
     * @zh 分辨率 2048 * 2048。
     * @en shadow resolution 2048 * 2048.
     * @readonly
     */
    Ultra_2048x2048: 2048,
});

/**
 * @zh 阴影类型。
 * @en The shadow type
 * @enum Shadows.ShadowType
 */
export const ShadowType = Enum({
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
    ShadowMap: 1,
});

/**
 * @zh pcf阴影等级。
 * @en The pcf type
 * @static
 * @enum Shadows.PCFType
 */
export const PCFType = Enum({
    /**
     * @zh x1 次采样
     * @en x1 times
     * @readonly
     */
    HARD: 0,

    /**
     * @zh 软阴影
     * @en soft shadow
     * @readonly
     */
    SOFT: 1,

    /**
     * @zh 软阴影
     * @en soft shadow
     * @readonly
     */
    SOFT_2X: 2,
});

/**
 * @en Environment lighting information in the Scene
 * @zh 场景的环境光照相关信息
 */
export const AmbientInfo = jsb.AmbientInfo;
legacyCC.AmbientInfo = AmbientInfo;
const ambientInfoProto: any = AmbientInfo.prototype;
const ambientInfoDecorator = ccclass('cc.AmbientInfo');
const _class2$w = AmbientInfo;
const _descriptor$q = _applyDecoratedDescriptor(_class2$w.prototype, '_skyColor', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Color(51, 128, 204, 1.0);
    },
});

const _descriptor2$j = _applyDecoratedDescriptor(_class2$w.prototype, '_skyIllum', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 20000.0; // cjh FIXME: Ambient.SKY_ILLUM;
    },
});

const _descriptor3$d = _applyDecoratedDescriptor(_class2$w.prototype, '_groundAlbedo', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Color(51, 51, 51, 255);
    },
});

const _dec2$j = type(CCFloat);

_applyDecoratedDescriptor(_class2$w.prototype, 'skyColor', [editable], Object.getOwnPropertyDescriptor(_class2$w.prototype, 'skyColor'), _class2$w.prototype);
_applyDecoratedDescriptor(_class2$w.prototype, 'skyIllum', [editable, _dec2$j], Object.getOwnPropertyDescriptor(_class2$w.prototype, 'skyIllum'), _class2$w.prototype);
_applyDecoratedDescriptor(_class2$w.prototype, 'groundAlbedo', [editable], Object.getOwnPropertyDescriptor(_class2$w.prototype, 'groundAlbedo'), _class2$w.prototype);

ambientInfoProto._ctor = function () {
    // _initializerDefineProperty(this, "_skyColor", _descriptor$q, this);
    // _initializerDefineProperty(this, "_skyIllum", _descriptor2$j, this);
    // _initializerDefineProperty(this, "_groundAlbedo", _descriptor3$d, this);
};

ambientInfoDecorator(AmbientInfo);

/**
 * @en Skybox related information
 * @zh 天空盒相关信息
 */
export const SkyboxInfo = jsb.SkyboxInfo;
legacyCC.SkyboxInfo = SkyboxInfo;
const skyboxInfoProto: any = SkyboxInfo.prototype;
const skyboxInfoDecorator = ccclass('cc.SkyboxInfo');
const _dec4$9 = type(TextureCube);
const _dec5$6 = type(TextureCube);
const _class5$3 = SkyboxInfo;
const _descriptor4$b = _applyDecoratedDescriptor(_class5$3.prototype, '_envmap', [_dec4$9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return null;
    },
});

const _descriptor5$8 = _applyDecoratedDescriptor(_class5$3.prototype, '_isRGBE', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});

const _descriptor6$3 = _applyDecoratedDescriptor(_class5$3.prototype, '_enabled', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});

const _descriptor7$3 = _applyDecoratedDescriptor(_class5$3.prototype, '_useIBL', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});

_applyDecoratedDescriptor(_class5$3.prototype, 'enabled', [editable], Object.getOwnPropertyDescriptor(_class5$3.prototype, 'enabled'), _class5$3.prototype);
_applyDecoratedDescriptor(_class5$3.prototype, 'useIBL', [editable], Object.getOwnPropertyDescriptor(_class5$3.prototype, 'useIBL'), _class5$3.prototype);
// cjh _applyDecoratedDescriptor(_class5$3.prototype, "envmap", [editable, _dec5$6], Object.getOwnPropertyDescriptor(_class5$3.prototype, "envmap"), _class5$3.prototype);
_applyDecoratedDescriptor(_class5$3.prototype, 'isRGBE', [editable], Object.getOwnPropertyDescriptor(_class5$3.prototype, 'isRGBE'), _class5$3.prototype);

skyboxInfoProto._ctor = function () {
    // _initializerDefineProperty(this, "_envmap", _descriptor4$b, this);
    // _initializerDefineProperty(this, "_isRGBE", _descriptor5$8, this);
    // _initializerDefineProperty(this, "_enabled", _descriptor6$3, this);
    // _initializerDefineProperty(this, "_useIBL", _descriptor7$3, this);
};

skyboxInfoDecorator(SkyboxInfo);

/**
 * @zh 全局雾相关信息
 * @en Global fog info
 */
export const FogInfo = jsb.FogInfo;
legacyCC.FogInfo = FogInfo;
const fogInfoProto: any = FogInfo.prototype;
const fogInfoDecorator = ccclass('cc.FogInfo');
const _class8$1 = FogInfo;
const _descriptor8$3 = _applyDecoratedDescriptor(_class8$1.prototype, '_type', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return FogType.LINEAR;
    },
});
const _descriptor9$2 = _applyDecoratedDescriptor(_class8$1.prototype, '_fogColor', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Color('#C8C8C8');
    },
});
const _descriptor10$2 = _applyDecoratedDescriptor(_class8$1.prototype, '_enabled', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});

const _descriptor11$1 = _applyDecoratedDescriptor(_class8$1.prototype, '_fogDensity', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0.3;
    },
});
const _descriptor12$1 = _applyDecoratedDescriptor(_class8$1.prototype, '_fogStart', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0.5;
    },
});
const _descriptor13$1 = _applyDecoratedDescriptor(_class8$1.prototype, '_fogEnd', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 300;
    },
});
const _descriptor14$1 = _applyDecoratedDescriptor(_class8$1.prototype, '_fogAtten', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 5;
    },
});
const _descriptor15$1 = _applyDecoratedDescriptor(_class8$1.prototype, '_fogTop', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 1.5;
    },
});
const _descriptor16$1 = _applyDecoratedDescriptor(_class8$1.prototype, '_fogRange', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 1.2;
    },
});

// , _dec8$1 = visible(), _dec9$1 = type(CCFloat), _dec10$1 = range(), _dec11$1 = rangeStep(), _dec12$1 = displayOrder(), _dec13$1 = visible(), _dec14$1 = type(CCFloat), _dec15$1 = rangeStep(), _dec16$1 = displayOrder(), _dec17$1 = visible(), _dec18$1 = type(CCFloat), _dec19$1 = rangeStep(), _dec20$1 = displayOrder(), _dec21$1 = visible(), _dec22$1 = type(CCFloat), _dec23$1 = rangeMin(), _dec24$1 = rangeStep(), _dec25$1 = displayOrder(), _dec26$1 = visible(), _dec27$1 = type(CCFloat), _dec28$1 = rangeStep(), _dec29$1 = displayOrder(), _dec30$1 = visible(), _dec31$1 = type(CCFloat), _dec32 = rangeStep(), _dec33 = displayOrder()

// _applyDecoratedDescriptor(_class8$1.prototype, "enabled", [editable], Object.getOwnPropertyDescriptor(_class8$1.prototype, "enabled"), _class8$1.prototype);
// _applyDecoratedDescriptor(_class8$1.prototype, "fogColor", [editable], Object.getOwnPropertyDescriptor(_class8$1.prototype, "fogColor"), _class8$1.prototype);
// _applyDecoratedDescriptor(_class8$1.prototype, "type", [editable, _dec7$1], Object.getOwnPropertyDescriptor(_class8$1.prototype, "type"), _class8$1.prototype);
// _applyDecoratedDescriptor(_class8$1.prototype, "fogDensity", [_dec8$1, _dec9$1, _dec10$1, _dec11$1, slide, _dec12$1], Object.getOwnPropertyDescriptor(_class8$1.prototype, "fogDensity"), _class8$1.prototype);
// _applyDecoratedDescriptor(_class8$1.prototype, "fogStart", [_dec13$1, _dec14$1, _dec15$1, _dec16$1], Object.getOwnPropertyDescriptor(_class8$1.prototype, "fogStart"), _class8$1.prototype);
// _applyDecoratedDescriptor(_class8$1.prototype, "fogEnd", [_dec17$1, _dec18$1, _dec19$1, _dec20$1], Object.getOwnPropertyDescriptor(_class8$1.prototype, "fogEnd"), _class8$1.prototype);
// _applyDecoratedDescriptor(_class8$1.prototype, "fogAtten", [_dec21$1, _dec22$1, _dec23$1, _dec24$1, _dec25$1], Object.getOwnPropertyDescriptor(_class8$1.prototype, "fogAtten"), _class8$1.prototype);
// _applyDecoratedDescriptor(_class8$1.prototype, "fogTop", [_dec26$1, _dec27$1, _dec28$1, _dec29$1], Object.getOwnPropertyDescriptor(_class8$1.prototype, "fogTop"), _class8$1.prototype), _applyDecoratedDescriptor(_class8$1.prototype, "fogRange", [_dec30$1, _dec31$1, _dec32, _dec33], Object.getOwnPropertyDescriptor(_class8$1.prototype, "fogRange"), _class8$1.prototype)), _class8$1)) || _class7$1);

fogInfoDecorator(FogInfo);

/**
 * @en Scene level planar shadow related information
 * @zh 平面阴影相关信息
 */
export const ShadowsInfo = jsb.ShadowsInfo;
legacyCC.ShadowsInfo = ShadowsInfo;
const shadowInfoDecorator = ccclass('cc.ShadowsInfo');

// Object.defineProperty(ShadowsInfo.prototype, '_shadowColor', {
//     configurable: true,
//     enumerable: true,
//     get ()  {
//         return new Color(this._shadowColorInternal.r, this._shadowColorInternal.g, this._shadowColorInternal.b, this._shadowColorInternal.a);
//     },
//     set (val) {
//         this._shadowColorInternal = val;
//     },
// });

// Object.defineProperty(ShadowsInfo.prototype, 'shadowColor', {
//     configurable: true,
//     enumerable: true,
//     get () {
//         return new Color(this.shadowColorInternal.r, this.shadowColorInternal.g, this.shadowColorInternal.b, this.shadowColorInternal.a);
//     },
//     set (val) {
//         this.shadowColorInternal = val;
//     },
// });

const _class11$1 = ShadowsInfo;
const _descriptor17$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_type', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return ShadowType.Planar;
    },
});
const _descriptor18$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_enabled', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});

const _descriptor19$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_normal', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Vec3(0, 1, 0);
    },
});

const _descriptor20$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_distance', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0;
    },
});

const _descriptor21$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_shadowColor', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Color(0, 0, 0, 76);
    },
});
const _descriptor22$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_autoAdapt', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return true;
    },
});
const _descriptor23$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_pcf', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return PCFType.HARD;
    },
});
const _descriptor24$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_bias', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0.00001;
    },
});
const _descriptor25$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_normalBias', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0.0;
    },
});
const _descriptor26$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_near', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 1;
    },
});
const _descriptor27$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_far', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 30;
    },
});
const _descriptor28$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_orthoSize', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 5;
    },
});
const _descriptor29$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_maxReceived', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 4;
    },
});
const _descriptor30$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_size', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new Vec2(512, 512);
    },
});
const _descriptor31$1 = _applyDecoratedDescriptor(_class11$1.prototype, '_saturation', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0.75;
    },
});
// _applyDecoratedDescriptor(_class11$1.prototype, "enabled", [editable], Object.getOwnPropertyDescriptor(_class11$1.prototype, "enabled"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "type", [editable, _dec35], Object.getOwnPropertyDescriptor(_class11$1.prototype, "type"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "shadowColor", [_dec36], Object.getOwnPropertyDescriptor(_class11$1.prototype, "shadowColor"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "normal", [_dec37], Object.getOwnPropertyDescriptor(_class11$1.prototype, "normal"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "distance", [_dec38, _dec39], Object.getOwnPropertyDescriptor(_class11$1.prototype, "distance"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "saturation", [editable, _dec40, slide, _dec41, _dec42], Object.getOwnPropertyDescriptor(_class11$1.prototype, "saturation"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "pcf", [_dec43, _dec44], Object.getOwnPropertyDescriptor(_class11$1.prototype, "pcf"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "maxReceived", [_dec45, _dec46], Object.getOwnPropertyDescriptor(_class11$1.prototype, "maxReceived"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "bias", [_dec47, _dec48], Object.getOwnPropertyDescriptor(_class11$1.prototype, "bias"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "normalBias", [_dec49, _dec50], Object.getOwnPropertyDescriptor(_class11$1.prototype, "normalBias"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "shadowMapSize", [_dec51, _dec52], Object.getOwnPropertyDescriptor(_class11$1.prototype, "shadowMapSize"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "autoAdapt", [_dec53, _dec54], Object.getOwnPropertyDescriptor(_class11$1.prototype, "autoAdapt"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "near", [_dec55, _dec56], Object.getOwnPropertyDescriptor(_class11$1.prototype, "near"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "far", [_dec57, _dec58], Object.getOwnPropertyDescriptor(_class11$1.prototype, "far"), _class11$1.prototype);
// _applyDecoratedDescriptor(_class11$1.prototype, "orthoSize", [_dec59, _dec60], Object.getOwnPropertyDescriptor(_class11$1.prototype, "orthoSize"), _class11$1.prototype);

shadowInfoDecorator(ShadowsInfo);

/**
 * @en All scene related global parameters, it affects all content in the corresponding scene
 * @zh 各类场景级别的渲染参数，将影响全场景的所有物体
 */
export const SceneGlobals = jsb.SceneGlobals;
legacyCC.SceneGlobals = SceneGlobals;
const sceneGlobalsProto: any = SceneGlobals.prototype;
const sceneGlobalsDecorator = ccclass('cc.SceneGlobals');

sceneGlobalsProto._ctor = function () {
    this._ambientRef = null;
    this._shadowsRef = null;
    this._skyboxRef = null;
    this._fogRef = null;
};

Object.defineProperty(sceneGlobalsProto, 'ambient', {
    enumerable: true,
    configurable: true,
    get () {
        return this.getAmbientInfo();
    },
    set (v) {
        this._ambientRef = v;
        this.setAmbientInfo(v);
    },
});

Object.defineProperty(sceneGlobalsProto, 'shadows', {
    enumerable: true,
    configurable: true,
    get () {
        return this.getShadowsInfo();
    },
    set (v) {
        this._shadowsRef = v;
        this.setShadowsInfo(v);
    },
});

Object.defineProperty(sceneGlobalsProto, '_skybox', {
    enumerable: true,
    configurable: true,
    get () {
        return this.getSkyboxInfo();
    },
    set (v) {
        this._skyboxRef = v;
        this.setSkyboxInfo(v);
    },
});

Object.defineProperty(sceneGlobalsProto, 'skybox', {
    enumerable: true,
    configurable: true,
    get () {
        return this.getSkyboxInfo();
    },
    set (v) {
        this._skyboxRef = v;
        this.setSkyboxInfo(v);
    },
});

Object.defineProperty(sceneGlobalsProto, 'fog', {
    enumerable: true,
    configurable: true,
    get () {
        return this.getFogInfo();
    },
    set (v) {
        this._fogRef = v;
        this.setFogInfo(v);
    },
});

const _class14$1 = SceneGlobals;
const _descriptor32$1 = _applyDecoratedDescriptor(_class14$1.prototype, 'ambient', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new AmbientInfo();
    },
});
const _descriptor33$1 = _applyDecoratedDescriptor(_class14$1.prototype, 'shadows', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new ShadowsInfo();
    },
});
const _descriptor34$1 = _applyDecoratedDescriptor(_class14$1.prototype, '_skybox', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new SkyboxInfo();
    },
});
const _descriptor35$1 = _applyDecoratedDescriptor(_class14$1.prototype, 'fog', [editable, serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return new FogInfo();
    },
});

// _applyDecoratedDescriptor(_class14$1.prototype, "skybox", [editable, _dec62], Object.getOwnPropertyDescriptor(_class14$1.prototype, "skybox"), _class14$1.prototype);

sceneGlobalsDecorator(SceneGlobals);
