/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.
 http://www.cocos.com
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { legacyCC } from '../core/global-exports';
import { CCFloat, CCInteger } from '../core/data';
import { TextureCube } from '../asset/assets/texture-cube';
import { Enum } from '../core/value-types';
import { Ambient, EnvironmentLightingType } from '../render-scene/scene';
import { Material } from '../asset/assets/material';
import { Vec2, Vec3, Color, Vec4 } from '../core/math';
import * as decros from '../native-binding/decorators';
import type { Skin } from '../render-scene/scene';
import type {
    AmbientInfo as JsbAmbientInfo,
    SkyboxInfo as JsbSkyboxInfo,
    FogInfo as JsbFogInfo,
    ShadowsInfo as JsbShadowsInfo,
    OctreeInfo as JsbOctreeInfo,
    SceneGlobals as JsbSceneGlobals,
    LightProbeInfo as JsbLightProbeInfo,
} from './scene-globals';
import { ccclass, editable, range, serializable, slide, tooltip, type, visible } from '../core/data/decorators';
import { macro } from '../core';

declare const jsb: any;

export const DEFAULT_WORLD_MIN_POS = new Vec3(-1024.0, -1024.0, -1024.0);
export const DEFAULT_WORLD_MAX_POS = new Vec3(1024.0, 1024.0, 1024.0);
export const DEFAULT_OCTREE_DEPTH = 8;

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

export const AmbientInfo: typeof JsbAmbientInfo = jsb.AmbientInfo;
export type AmbientInfo = JsbAmbientInfo;
legacyCC.AmbientInfo = AmbientInfo;

export const SkyboxInfo: typeof JsbSkyboxInfo = jsb.SkyboxInfo;
export type SkyboxInfo = JsbSkyboxInfo;
legacyCC.SkyboxInfo = SkyboxInfo;


export const FogInfo: typeof JsbFogInfo = jsb.FogInfo;
export type FogInfo = JsbFogInfo;
legacyCC.FogInfo = FogInfo;
FogInfo.FogType = FogType;

export const ShadowsInfo: typeof JsbShadowsInfo = jsb.ShadowsInfo;
export type ShadowsInfo = JsbShadowsInfo;
legacyCC.ShadowsInfo = ShadowsInfo;

export const OctreeInfo: typeof JsbOctreeInfo = jsb.OctreeInfo;
export type OctreeInfo = JsbOctreeInfo;
legacyCC.OctreeInfo = OctreeInfo;

export const LightProbeInfo: typeof JsbLightProbeInfo = jsb.LightProbeInfo;
export type LightProbeInfo = JsbLightProbeInfo;
//legacyCC.LightProbeInfo = LightProbeInfo;

export const SceneGlobals: typeof JsbSceneGlobals = jsb.SceneGlobals;
export type SceneGlobals = JsbSceneGlobals;
legacyCC.SceneGlobals = SceneGlobals;


/**
 * @en Global skin in the render scene.
 * @zh 渲染场景中的全局皮肤后处理设置。
 */
@ccclass('cc.SkinInfo')
export class SkinInfo {
    /**
     * @en Enable skip.
     * @zh 是否开启皮肤后效。
     */
    @editable
    @tooltip('i18n:skin.enabled')
    set enabled (val: boolean) {
        if (this._enabled === val) return;
        this._enabled = val;
        if (val && !macro.ENABLE_FLOAT_OUTPUT) {
            console.warn('Separable-SSS skin filter need float output, please open ENABLE_FLOAT_OUTPUT define...');
        }
        if (this._resource) {
            this._resource.enabled = val;
        }
    }
    get enabled () {
        return this._enabled;
    }

    /**
     * @en Getter/Setter sampler width.
     * @zh 设置或者获取采样宽度。
     */
    @visible(false)
    @editable
    @range([0.0, 0.1, 0.001])
    @slide
    @type(CCFloat)
    @tooltip('i18n:skin.blurRadius')
    set blurRadius (val: number) {
        if ((legacyCC.director.root.pipeline.pipelineSceneData.standardSkinModel === null)) {
            console.warn('Separable-SSS skin filter need set standard model, please check the isGlobalStandardSkinObject option in the MeshRender component.');
            return;
        }
        this._blurRadius = val;
        if (this._resource) { this._resource.blurRadius = val; }
    }
    get blurRadius () {
        return this._blurRadius;
    }

    /**
     * @en Getter/Setter depth unit scale.
     * @zh 设置或者获取深度单位比例。
     */
    @editable
    @range([0.0, 10.0, 0.1])
    @slide
    @type(CCFloat)
    @tooltip('i18n:skin.sssIntensity')
    set sssIntensity (val: number) {
        if ((legacyCC.director.root.pipeline.pipelineSceneData.standardSkinModel === null)) {
            console.warn('Separable-SSS skin filter need set standard model, please check the isGlobalStandardSkinObject option in the MeshRender component.');
            return;
        }
        this._sssIntensity = val;
        if (this._resource) { this._resource.sssIntensity = val; }
    }
    get sssIntensity () { 
        return this._sssIntensity;
    }

    @serializable
    protected _enabled = false;
    @serializable
    protected _blurRadius = 0.01;
    @serializable
    protected _sssIntensity = 5.0;

    protected _resource: Skin | null = null;

    /**
     * @en Activate the skin configuration in the render scene, no need to invoke manually.
     * @zh 在渲染场景中启用八叉树设置，不需要手动调用
     * @param resource The skin configuration object in the render scene
     */
    public activate (resource: Skin) {
        this._resource = resource;
        this._resource.initialize(this as any);
    }
}
legacyCC.SkinInfo = SkinInfo;

(function () {
    const sceneGlobalsProto: any = SceneGlobals.prototype;

    sceneGlobalsProto._ctor = function () {
        this._ambientRef = this.getAmbientInfo();
        this._shadowsRef = this.getShadowsInfo();
        this._skyboxRef = this.getSkyboxInfo();
        this._fogRef = this.getFogInfo();
        this._octreeRef = this.getOctreeInfo();
        this._lightProbeRef = this.getLightProbeInfo();
    };

    Object.defineProperty(sceneGlobalsProto, 'ambient', {
        enumerable: true,
        configurable: true,
        get() {
            return this._ambientRef;
        },
        set(v) {
            this._ambientRef = v;
            this.setAmbientInfo(v);
        },
    });

    Object.defineProperty(sceneGlobalsProto, 'shadows', {
        enumerable: true,
        configurable: true,
        get() {
            return this._shadowsRef;
        },
        set(v) {
            this._shadowsRef = v;
            this.setShadowsInfo(v);
        },
    });

    Object.defineProperty(sceneGlobalsProto, '_skybox', {
        enumerable: true,
        configurable: true,
        get() {
            return this._skyboxRef;
        },
        set(v) {
            this._skyboxRef = v;
            this.setSkyboxInfo(v);
        },
    });

    Object.defineProperty(sceneGlobalsProto, 'skybox', {
        enumerable: true,
        configurable: true,
        get() {
            return this._skyboxRef;
        },
        set(v) {
            this._skyboxRef = v;
            this.setSkyboxInfo(v);
        },
    });

    Object.defineProperty(sceneGlobalsProto, 'fog', {
        enumerable: true,
        configurable: true,
        get() {
            return this._fogRef;
        },
        set(v) {
            this._fogRef = v;
            this.setFogInfo(v);
        },
    });

    Object.defineProperty(sceneGlobalsProto, 'octree', {
        enumerable: true,
        configurable: true,
        get() {
            return this._octreeRef;
        },
        set(v) {
            this._octreeRef = v;
            this.setOctreeInfo(v);
        },
    });

    Object.defineProperty(sceneGlobalsProto, 'lightProbeInfo', {
        enumerable: true,
        configurable: true,
        get() {
            return this._lightProbeRef;
        },
        set(v) {
            this._lightProbeRef = v;
            this.setLightProbeInfo(v);
        },
    });
})();



// handle meta data, it is generated automatically

decros.patch_cc_SceneGlobals({SceneGlobals, AmbientInfo, SkyboxInfo, FogInfo, ShadowsInfo, LightProbeInfo, OctreeInfo, SkinInfo});

decros.patch_cc_OctreeInfo({OctreeInfo, CCInteger, Vec3, DEFAULT_WORLD_MAX_POS, DEFAULT_WORLD_MIN_POS, DEFAULT_OCTREE_DEPTH});

decros.patch_cc_ShadowsInfo({ShadowsInfo, ShadowType, CCFloat, CCInteger, ShadowSize, Vec3, Color, Vec2});

decros.patch_cc_FogInfo({FogInfo, FogType, CCFloat, Color});

decros.patch_cc_SkyboxInfo({SkyboxInfo, EnvironmentLightingType, TextureCube, CCFloat, Material });

decros.patch_cc_AmbientInfo({AmbientInfo, Vec4, Ambient, CCFloat, legacyCC});

decros.patch_cc_LightProbeInfo({LightProbeInfo, CCFloat, CCInteger});