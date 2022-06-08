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

import {
    displayName,
    editable,
    formerlySerializedAs,
    range,
    readOnly,
    serializable,
    tooltip,
    type,
    visible
// @ts-ignore
} from 'cc.decorator';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { CCFloat, CCInteger } from '../data';
import { TextureCube } from '../assets/texture-cube';
import { Enum } from '../value-types';
import { ccclass, displayOrder, rangeMin, rangeStep, slide } from '../data/decorators';
import { EnvironmentLightingType } from '../renderer/scene';
import { Material } from '../assets/material';

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

// @ts-ignore
export const AmbientInfo = jsb.AmbientInfo;
legacyCC.AmbientInfo = AmbientInfo;

// @ts-ignore
export const SkyboxInfo = jsb.SkyboxInfo;
legacyCC.SkyboxInfo = SkyboxInfo;


// @ts-ignore
export const FogInfo = jsb.FogInfo;
legacyCC.FogInfo = FogInfo;

// @ts-ignore
export const ShadowsInfo = jsb.ShadowsInfo;
legacyCC.ShadowsInfo = ShadowsInfo;

// @ts-ignore
export const OctreeInfo = jsb.OctreeInfo;
legacyCC.OctreeInfo = OctreeInfo;

// @ts-ignore
export const SceneGlobals = jsb.SceneGlobals;
legacyCC.SceneGlobals = SceneGlobals;

(function () {
    const sceneGlobalsProto: any = SceneGlobals.prototype;

    sceneGlobalsProto._ctor = function () {
        this._ambientRef = null;
        this._shadowsRef = null;
        this._skyboxRef = null;
        this._fogRef = null;
        this._octreeRef = null;
    };

    Object.defineProperty(sceneGlobalsProto, 'ambient', {
        enumerable: true,
        configurable: true,
        get () {
            return this._ambientRef;
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
            return this._shadowsRef;
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
            return this._skyboxRef;
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
            return this._skyboxRef;
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
            return this._fogRef;
        },
        set (v) {
            this._fogRef = v;
            this.setFogInfo(v);
        },
    });

    Object.defineProperty(sceneGlobalsProto, 'octree', {
        enumerable: true,
        configurable: true,
        get () {
            return this._octreeRef;
        },
        set (v) {
            this._octreeRef = v;
            this.setOctreeInfo(v);
        },
    });
})();

// handle meta data, it is generated automatically

const SceneGlobalsProto = SceneGlobals.prototype;
editable(SceneGlobalsProto, 'ambient');
serializable(SceneGlobalsProto, 'ambient');
editable(SceneGlobalsProto, 'shadows');
serializable(SceneGlobalsProto, 'shadows');
serializable(SceneGlobalsProto, '_skybox');
serializable(SceneGlobalsProto, 'fog');
editable(SceneGlobalsProto, 'fog');
type(SkyboxInfo)(SceneGlobalsProto, 'skybox');
editable(SceneGlobalsProto, 'skybox');
serializable(SceneGlobalsProto, 'octree');
editable(SceneGlobalsProto, 'octree');
ccclass('cc.SceneGlobals')(SceneGlobals);

const OctreeInfoProto = OctreeInfo.prototype;
serializable(OctreeInfoProto, '_enabled');
serializable(OctreeInfoProto, '_minPos');
serializable(OctreeInfoProto, '_maxPos');
serializable(OctreeInfoProto, '_depth');
tooltip('i18n:octree_culling.enabled')(OctreeInfoProto, 'enabled');
editable(OctreeInfoProto, 'enabled');
displayName('World MinPos')(OctreeInfoProto, 'minPos');
tooltip('i18n:octree_culling.minPos')(OctreeInfoProto, 'minPos');
editable(OctreeInfoProto, 'minPos');
displayName('World MaxPos')(OctreeInfoProto, 'maxPos');
tooltip('i18n:octree_culling.maxPos')(OctreeInfoProto, 'maxPos');
editable(OctreeInfoProto, 'maxPos');
tooltip('i18n:octree_culling.depth')(OctreeInfoProto, 'depth');
type(CCInteger)(OctreeInfoProto, 'depth');
slide(OctreeInfoProto, 'depth');
range([4, 12, 1])(OctreeInfoProto, 'depth');
editable(OctreeInfoProto, 'depth');
ccclass('cc.OctreeInfo')(OctreeInfo);

const ShadowsInfoProto = ShadowsInfo.prototype;
serializable(ShadowsInfoProto, '_enabled');
serializable(ShadowsInfoProto, '_type');
serializable(ShadowsInfoProto, '_normal');
serializable(ShadowsInfoProto, '_distance');
serializable(ShadowsInfoProto, '_shadowColor');
serializable(ShadowsInfoProto, '_maxReceived');
serializable(ShadowsInfoProto, '_size');
tooltip('i18n:shadow.enabled')(ShadowsInfoProto, 'enabled');
editable(ShadowsInfoProto, 'enabled');
type(ShadowType)(ShadowsInfoProto, 'type');
editable(ShadowsInfoProto, 'type');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'shadowColor');
tooltip('i18n:shadow.planeDirection')(ShadowsInfoProto, 'planeDirection');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'planeDirection');
tooltip('i18n:shadow.planeHeight')(ShadowsInfoProto, 'planeHeight');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'planeHeight');
type(CCFloat)(ShadowsInfoProto, 'planeHeight');
editable(ShadowsInfoProto, 'planeHeight');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'maxReceived');
tooltip('i18n:shadow.maxReceived')(ShadowsInfoProto, 'maxReceived');
type(CCInteger)(ShadowsInfoProto, 'maxReceived');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'shadowMapSize');
tooltip('i18n:shadow.shadowMapSize')(ShadowsInfoProto, 'shadowMapSize');
type(ShadowSize)(ShadowsInfoProto, 'shadowMapSize');
ccclass('cc.ShadowsInfo')(ShadowsInfo);

const FogInfoProto = FogInfo.prototype;
serializable(FogInfoProto, '_type');
serializable(FogInfoProto, '_fogColor');
serializable(FogInfoProto, '_enabled');
serializable(FogInfoProto, '_fogDensity');
serializable(FogInfoProto, '_fogStart');
serializable(FogInfoProto, '_fogEnd');
serializable(FogInfoProto, '_fogAtten');
serializable(FogInfoProto, '_fogTop');
serializable(FogInfoProto, '_fogRange');
serializable(FogInfoProto, '_accurate');
displayOrder(0)(FogInfoProto, 'enabled');
tooltip('i18n:fog.enabled')(FogInfoProto, 'enabled');
editable(FogInfoProto, 'enabled');
displayOrder(0)(FogInfoProto, 'accurate');
tooltip('i18n:fog.accurate')(FogInfoProto, 'accurate');
editable(FogInfoProto, 'accurate');
tooltip('i18n:fog.fogColor')(FogInfoProto, 'fogColor');
editable(FogInfoProto, 'fogColor');
tooltip('i18n:fog.type')(FogInfoProto, 'type');
displayOrder(1)(FogInfoProto, 'type');
type(FogType)(FogInfoProto, 'type');
editable(FogInfoProto, 'type');
tooltip('i18n:fog.fogDensity')(FogInfoProto, 'fogDensity');
slide(FogInfoProto, 'fogDensity');
rangeStep(0.01)(FogInfoProto, 'fogDensity');
range([0, 1])(FogInfoProto, 'fogDensity');
type(CCFloat)(FogInfoProto, 'fogDensity');
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogDensity');
tooltip('i18n:fog.fogStart')(FogInfoProto, 'fogStart');
rangeStep(0.01)(FogInfoProto, 'fogStart');
type(CCFloat)(FogInfoProto, 'fogStart');
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogStart');
tooltip('i18n:fog.fogEnd')(FogInfoProto, 'fogEnd');
rangeStep(0.01)(FogInfoProto, 'fogEnd');
type(CCFloat)(FogInfoProto, 'fogEnd');
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogEnd');
tooltip('i18n:fog.fogAtten')(FogInfoProto, 'fogAtten');
rangeStep(0.01)(FogInfoProto, 'fogAtten');
rangeMin(0.01)(FogInfoProto, 'fogAtten');
type(CCFloat)(FogInfoProto, 'fogAtten');
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogAtten');
tooltip('i18n:fog.fogTop')(FogInfoProto, 'fogTop');
rangeStep(0.01)(FogInfoProto, 'fogTop');
type(CCFloat)(FogInfoProto, 'fogTop');
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogTop');
tooltip('i18n:fog.fogRange')(FogInfoProto, 'fogRange');
rangeStep(0.01)(FogInfoProto, 'fogRange');
type(CCFloat)(FogInfoProto, 'fogRange');
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogRange');
ccclass('cc.FogInfo')(FogInfo);

const SkyboxInfoProto = SkyboxInfo.prototype;
serializable(SkyboxInfoProto, '_envLightingType');
formerlySerializedAs('_envmap')(SkyboxInfoProto, '_envmapHDR');
type(TextureCube)(SkyboxInfoProto, '_envmapHDR');
serializable(SkyboxInfoProto, '_envmapHDR');
type(TextureCube)(SkyboxInfoProto, '_envmapLDR');
serializable(SkyboxInfoProto, '_envmapLDR');
type(TextureCube)(SkyboxInfoProto, '_diffuseMapHDR');
serializable(SkyboxInfoProto, '_diffuseMapHDR');
type(TextureCube)(SkyboxInfoProto, '_diffuseMapLDR');
serializable(SkyboxInfoProto, '_diffuseMapLDR');
serializable(SkyboxInfoProto, '_enabled');
serializable(SkyboxInfoProto, '_useHDR');
type(Material)(SkyboxInfoProto, '_editableMaterial');
serializable(SkyboxInfoProto, '_editableMaterial');
tooltip('i18n:skybox.enabled')(SkyboxInfoProto, 'enabled');
editable(SkyboxInfoProto, 'enabled');
tooltip('i18n:skybox.EnvironmentLightingType')(SkyboxInfoProto, 'envLightingType');
type(EnvironmentLightingType)(SkyboxInfoProto, 'envLightingType');
editable(SkyboxInfoProto, 'envLightingType');
tooltip('i18n:skybox.useHDR')(SkyboxInfoProto, 'useHDR');
editable(SkyboxInfoProto, 'useHDR');
tooltip('i18n:skybox.envmap')(SkyboxInfoProto, 'envmap');
type(TextureCube)(SkyboxInfoProto, 'envmap');
editable(SkyboxInfoProto, 'envmap');
displayOrder(100)(SkyboxInfoProto, 'diffuseMap');
type(TextureCube)(SkyboxInfoProto, 'diffuseMap');
readOnly(SkyboxInfoProto, 'diffuseMap');
editable(SkyboxInfoProto, 'diffuseMap');
visible(function (this) { /* Need to copy source code */ })(SkyboxInfoProto, 'diffuseMap');
tooltip('i18n:skybox.material')(SkyboxInfoProto, 'skyboxMaterial');
type(Material)(SkyboxInfoProto, 'skyboxMaterial');
editable(SkyboxInfoProto, 'skyboxMaterial');
ccclass('cc.SkyboxInfo')(SkyboxInfo);

const AmbientInfoProto = AmbientInfo.prototype;
formerlySerializedAs('_skyColor')(AmbientInfoProto, '_skyColorHDR');
serializable(AmbientInfoProto, '_skyColorHDR');
formerlySerializedAs('_skyIllum')(AmbientInfoProto, '_skyIllumHDR');
serializable(AmbientInfoProto, '_skyIllumHDR');
formerlySerializedAs('_groundAlbedo')(AmbientInfoProto, '_groundAlbedoHDR');
serializable(AmbientInfoProto, '_groundAlbedoHDR');
serializable(AmbientInfoProto, '_skyColorLDR');
serializable(AmbientInfoProto, '_skyIllumLDR');
serializable(AmbientInfoProto, '_groundAlbedoLDR');
tooltip('i18n:ambient.skyLightingColor')(AmbientInfoProto, 'skyLightingColor');
editable(AmbientInfoProto, 'skyLightingColor');
visible(() => { /* Need to copy source code */ })(AmbientInfoProto, 'skyLightingColor');
tooltip('i18n:ambient.skyIllum')(AmbientInfoProto, 'skyIllum');
type(CCFloat)(AmbientInfoProto, 'skyIllum');
editable(AmbientInfoProto, 'skyIllum');
tooltip('i18n:ambient.groundLightingColor')(AmbientInfoProto, 'groundLightingColor');
editable(AmbientInfoProto, 'groundLightingColor');
visible(() => { /* Need to copy source code */ })(AmbientInfoProto, 'groundLightingColor');
ccclass('cc.AmbientInfo')(AmbientInfo);
