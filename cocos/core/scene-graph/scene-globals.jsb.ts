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
FogInfo.FogType = FogType;

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
const skyboxDescriptor = Object.getOwnPropertyDescriptor(SceneGlobalsProto, 'skybox');
type(SkyboxInfo)(SceneGlobalsProto, 'skybox', skyboxDescriptor);
editable(SceneGlobalsProto, 'skybox', skyboxDescriptor);
serializable(SceneGlobalsProto, 'octree');
editable(SceneGlobalsProto, 'octree');
ccclass('cc.SceneGlobals')(SceneGlobals);

const OctreeInfoProto = OctreeInfo.prototype;
serializable(OctreeInfoProto, '_enabled');
serializable(OctreeInfoProto, '_minPos');
serializable(OctreeInfoProto, '_maxPos');
serializable(OctreeInfoProto, '_depth');
const enabledDescriptor = Object.getOwnPropertyDescriptor(OctreeInfoProto, 'enabled');
tooltip('i18n:octree_culling.enabled')(OctreeInfoProto, 'enabled', enabledDescriptor);
editable(OctreeInfoProto, 'enabled', enabledDescriptor);
const minPosDescriptor = Object.getOwnPropertyDescriptor(OctreeInfoProto, 'minPos');
displayName('World MinPos')(OctreeInfoProto, 'minPos', minPosDescriptor);
tooltip('i18n:octree_culling.minPos')(OctreeInfoProto, 'minPos', minPosDescriptor);
editable(OctreeInfoProto, 'minPos', minPosDescriptor);
const maxPosDescriptor = Object.getOwnPropertyDescriptor(OctreeInfoProto, 'maxPos');
displayName('World MaxPos')(OctreeInfoProto, 'maxPos', maxPosDescriptor);
tooltip('i18n:octree_culling.maxPos')(OctreeInfoProto, 'maxPos', maxPosDescriptor);
editable(OctreeInfoProto, 'maxPos', maxPosDescriptor);
const depthDescriptor = Object.getOwnPropertyDescriptor(OctreeInfoProto, 'depth');
tooltip('i18n:octree_culling.depth')(OctreeInfoProto, 'depth', depthDescriptor);
type(CCInteger)(OctreeInfoProto, 'depth', depthDescriptor);
slide(OctreeInfoProto, 'depth', depthDescriptor);
range([4, 12, 1])(OctreeInfoProto, 'depth', depthDescriptor);
editable(OctreeInfoProto, 'depth', depthDescriptor);
ccclass('cc.OctreeInfo')(OctreeInfo);

const ShadowsInfoProto = ShadowsInfo.prototype;
serializable(ShadowsInfoProto, '_enabled');
serializable(ShadowsInfoProto, '_type');
serializable(ShadowsInfoProto, '_normal');
serializable(ShadowsInfoProto, '_distance');
serializable(ShadowsInfoProto, '_shadowColor');
serializable(ShadowsInfoProto, '_maxReceived');
serializable(ShadowsInfoProto, '_size');
const shadowEnabledDescriptor = Object.getOwnPropertyDescriptor(ShadowsInfoProto, 'enabled');
tooltip('i18n:shadow.enabled')(ShadowsInfoProto, 'enabled', shadowEnabledDescriptor);
editable(ShadowsInfoProto, 'enabled', shadowEnabledDescriptor);
const typeDescriptor = Object.getOwnPropertyDescriptor(ShadowsInfoProto, 'type');
type(ShadowType)(ShadowsInfoProto, 'type', typeDescriptor);
editable(ShadowsInfoProto, 'type', typeDescriptor);
const shadowColorDescriptor = Object.getOwnPropertyDescriptor(ShadowsInfoProto, 'shadowColor');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'shadowColor', shadowColorDescriptor);
const planeDirectionDescriptor = Object.getOwnPropertyDescriptor(ShadowsInfoProto, 'planeDirection');
tooltip('i18n:shadow.planeDirection')(ShadowsInfoProto, 'planeDirection', planeDirectionDescriptor);
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'planeDirection', planeDirectionDescriptor);
const planeHeightDescriptor = Object.getOwnPropertyDescriptor(ShadowsInfoProto, 'planeHeight');
tooltip('i18n:shadow.planeHeight')(ShadowsInfoProto, 'planeHeight', planeHeightDescriptor);
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'planeHeight', planeHeightDescriptor);
type(CCFloat)(ShadowsInfoProto, 'planeHeight', planeHeightDescriptor);
editable(ShadowsInfoProto, 'planeHeight', planeHeightDescriptor);
const maxReceivedDescriptor = Object.getOwnPropertyDescriptor(ShadowsInfoProto, 'maxReceived');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'maxReceived', maxReceivedDescriptor);
tooltip('i18n:shadow.maxReceived')(ShadowsInfoProto, 'maxReceived', maxReceivedDescriptor);
type(CCInteger)(ShadowsInfoProto, 'maxReceived', maxReceivedDescriptor);
const shadowMapSizeDescriptor = Object.getOwnPropertyDescriptor(ShadowsInfoProto, 'shadowMapSize');
visible(function (this) { /* Need to copy source code */ })(ShadowsInfoProto, 'shadowMapSize', shadowMapSizeDescriptor);
tooltip('i18n:shadow.shadowMapSize')(ShadowsInfoProto, 'shadowMapSize', shadowMapSizeDescriptor);
type(ShadowSize)(ShadowsInfoProto, 'shadowMapSize', shadowMapSizeDescriptor);
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
const fogEnabledDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'enabled');
displayOrder(0)(FogInfoProto, 'enabled', fogEnabledDescriptor);
tooltip('i18n:fog.enabled')(FogInfoProto, 'enabled', fogEnabledDescriptor);
editable(FogInfoProto, 'enabled', fogEnabledDescriptor);
const accurateDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'accurate');
displayOrder(0)(FogInfoProto, 'accurate', accurateDescriptor);
tooltip('i18n:fog.accurate')(FogInfoProto, 'accurate', accurateDescriptor);
editable(FogInfoProto, 'accurate', accurateDescriptor);
const fogColorDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'fogColor');
tooltip('i18n:fog.fogColor')(FogInfoProto, 'fogColor', fogColorDescriptor);
editable(FogInfoProto, 'fogColor', fogColorDescriptor);
const fogTypeDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'type');
tooltip('i18n:fog.type')(FogInfoProto, 'type', fogTypeDescriptor);
displayOrder(1)(FogInfoProto, 'type', fogTypeDescriptor);
type(FogType)(FogInfoProto, 'type', fogTypeDescriptor);
editable(FogInfoProto, 'type', fogTypeDescriptor);
const fogDensityDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'fogDensity');
tooltip('i18n:fog.fogDensity')(FogInfoProto, 'fogDensity', fogDensityDescriptor);
slide(FogInfoProto, 'fogDensity', fogDensityDescriptor);
rangeStep(0.01)(FogInfoProto, 'fogDensity', fogDensityDescriptor);
range([0, 1])(FogInfoProto, 'fogDensity', fogDensityDescriptor);
type(CCFloat)(FogInfoProto, 'fogDensity', fogDensityDescriptor);
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogDensity', fogDensityDescriptor);
const fogStartDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'fogStart');
tooltip('i18n:fog.fogStart')(FogInfoProto, 'fogStart', fogStartDescriptor);
rangeStep(0.01)(FogInfoProto, 'fogStart', fogStartDescriptor);
type(CCFloat)(FogInfoProto, 'fogStart', fogStartDescriptor);
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogStart', fogStartDescriptor);
const fogEndDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'fogEnd');
tooltip('i18n:fog.fogEnd')(FogInfoProto, 'fogEnd', fogEndDescriptor);
rangeStep(0.01)(FogInfoProto, 'fogEnd', fogEndDescriptor);
type(CCFloat)(FogInfoProto, 'fogEnd', fogEndDescriptor);
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogEnd', fogEndDescriptor);
const fogAttenDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'fogAtten');
tooltip('i18n:fog.fogAtten')(FogInfoProto, 'fogAtten', fogAttenDescriptor);
rangeStep(0.01)(FogInfoProto, 'fogAtten', fogAttenDescriptor);
rangeMin(0.01)(FogInfoProto, 'fogAtten', fogAttenDescriptor);
type(CCFloat)(FogInfoProto, 'fogAtten', fogAttenDescriptor);
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogAtten', fogAttenDescriptor);
const fogTopDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'fogTop');
tooltip('i18n:fog.fogTop')(FogInfoProto, 'fogTop', fogTopDescriptor);
rangeStep(0.01)(FogInfoProto, 'fogTop', fogTopDescriptor);
type(CCFloat)(FogInfoProto, 'fogTop', fogTopDescriptor);
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogTop', fogTopDescriptor);
const fogRangeDescriptor = Object.getOwnPropertyDescriptor(FogInfoProto, 'fogRange');
tooltip('i18n:fog.fogRange')(FogInfoProto, 'fogRange', fogRangeDescriptor);
rangeStep(0.01)(FogInfoProto, 'fogRange', fogRangeDescriptor);
type(CCFloat)(FogInfoProto, 'fogRange', fogRangeDescriptor);
visible(function (this) { /* Need to copy source code */ })(FogInfoProto, 'fogRange', fogRangeDescriptor);
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
type(TextureCube)(SkyboxInfoProto, '_reflectionHDR');
serializable(SkyboxInfoProto, '_reflectionHDR');
type(TextureCube)(SkyboxInfoProto, '_reflectionLDR');
serializable(SkyboxInfoProto, '_reflectionLDR');
const skyboxEnabledDescriptor = Object.getOwnPropertyDescriptor(SkyboxInfoProto, 'enabled');
tooltip('i18n:skybox.enabled')(SkyboxInfoProto, 'enabled', skyboxEnabledDescriptor);
editable(SkyboxInfoProto, 'enabled', skyboxEnabledDescriptor);
const envLightingTypeDescriptor = Object.getOwnPropertyDescriptor(SkyboxInfoProto, 'envLightingType');
tooltip('i18n:skybox.EnvironmentLightingType')(SkyboxInfoProto, 'envLightingType', envLightingTypeDescriptor);
type(EnvironmentLightingType)(SkyboxInfoProto, 'envLightingType', envLightingTypeDescriptor);
editable(SkyboxInfoProto, 'envLightingType', envLightingTypeDescriptor);
const useHDRDescriptor = Object.getOwnPropertyDescriptor(SkyboxInfoProto, 'useHDR');
tooltip('i18n:skybox.useHDR')(SkyboxInfoProto, 'useHDR', useHDRDescriptor);
editable(SkyboxInfoProto, 'useHDR', useHDRDescriptor);
const envmapDescriptor = Object.getOwnPropertyDescriptor(SkyboxInfoProto, 'envmap');
tooltip('i18n:skybox.envmap')(SkyboxInfoProto, 'envmap', envmapDescriptor);
type(TextureCube)(SkyboxInfoProto, 'envmap', envmapDescriptor);
editable(SkyboxInfoProto, 'envmap', envmapDescriptor);
const diffuseMapDescriptor = Object.getOwnPropertyDescriptor(SkyboxInfoProto, 'diffuseMap');
displayOrder(100)(SkyboxInfoProto, 'diffuseMap', diffuseMapDescriptor);
type(TextureCube)(SkyboxInfoProto, 'diffuseMap', diffuseMapDescriptor);
readOnly(SkyboxInfoProto, 'diffuseMap', diffuseMapDescriptor);
editable(SkyboxInfoProto, 'diffuseMap', diffuseMapDescriptor);
visible(function (this) { /* Need to copy source code */ })(SkyboxInfoProto, 'diffuseMap', diffuseMapDescriptor);
const skyboxMaterialDescriptor = Object.getOwnPropertyDescriptor(SkyboxInfoProto, 'skyboxMaterial');
tooltip('i18n:skybox.material')(SkyboxInfoProto, 'skyboxMaterial', skyboxMaterialDescriptor);
type(Material)(SkyboxInfoProto, 'skyboxMaterial', skyboxMaterialDescriptor);
editable(SkyboxInfoProto, 'skyboxMaterial', skyboxMaterialDescriptor);
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
const skyLightingColorDescriptor = Object.getOwnPropertyDescriptor(AmbientInfoProto, 'skyLightingColor');
tooltip('i18n:ambient.skyLightingColor')(AmbientInfoProto, 'skyLightingColor', skyLightingColorDescriptor);
editable(AmbientInfoProto, 'skyLightingColor', skyLightingColorDescriptor);
visible(() => { /* Need to copy source code */ })(AmbientInfoProto, 'skyLightingColor', skyLightingColorDescriptor);
const skyIllumDescriptor = Object.getOwnPropertyDescriptor(AmbientInfoProto, 'skyIllum');
tooltip('i18n:ambient.skyIllum')(AmbientInfoProto, 'skyIllum', skyIllumDescriptor);
type(CCFloat)(AmbientInfoProto, 'skyIllum', skyIllumDescriptor);
editable(AmbientInfoProto, 'skyIllum', skyIllumDescriptor);
const groundLightingColorDescriptor = Object.getOwnPropertyDescriptor(AmbientInfoProto, 'groundLightingColor');
tooltip('i18n:ambient.groundLightingColor')(AmbientInfoProto, 'groundLightingColor', groundLightingColorDescriptor);
editable(AmbientInfoProto, 'groundLightingColor', groundLightingColorDescriptor);
visible(() => { /* Need to copy source code */ })(AmbientInfoProto, 'groundLightingColor', groundLightingColorDescriptor);
ccclass('cc.AmbientInfo')(AmbientInfo);
