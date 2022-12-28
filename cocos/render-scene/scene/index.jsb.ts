/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
import { Vec3, Enum, cclegacy } from '../../core';

export type Ambient = jsb.Ambient;
export const Ambient = jsb.Ambient;
cclegacy.Ambient = Ambient;

export const LODData = jsb.LODData;
export const LODGroup = jsb.LODGroup;

/**
 * Light related.
 */

// Color temperature (in Kelvin) to RGB
export function ColorTemperatureToRGB (rgb: Vec3, kelvin: number) {
    if (kelvin < 1000.0) {
        kelvin = 1000.0;
    } else if (kelvin > 15000.0) {
        kelvin = 15000.0;
    }

    // Approximate Planckian locus in CIE 1960 UCS
    const kSqr = kelvin * kelvin;
    const u = (0.860117757 + 1.54118254e-4 * kelvin + 1.28641212e-7 * kSqr) / (1.0 + 8.42420235e-4 * kelvin + 7.08145163e-7 * kSqr);
    const v = (0.317398726 + 4.22806245e-5 * kelvin + 4.20481691e-8 * kSqr) / (1.0 - 2.89741816e-5 * kelvin + 1.61456053e-7 * kSqr);

    const d = (2.0 * u - 8.0 * v + 4.0);
    const x = (3.0 * u) / d;
    const y = (2.0 * v) / d;
    const z = (1.0 - x) - y;

    const X = (1.0 / y) * x;
    const Z = (1.0 / y) * z;

    // XYZ to RGB with BT.709 primaries
    rgb.x =  3.2404542 * X + -1.5371385 + -0.4985314 * Z;
    rgb.y = -0.9692660 * X +  1.8760108 +  0.0415560 * Z;
    rgb.z =  0.0556434 * X + -0.2040259 +  1.0572252 * Z;
}

export enum LightType {
    DIRECTIONAL,
    SPHERE,
    SPOT,
    UNKNOWN,
}

export const nt2lm = (size: number) => 4 * Math.PI * Math.PI * size * size;
export const Light = jsb.Light;
export type Light = jsb.Light;
cclegacy.Light = jsb.Light;

export const DirectionalLight = jsb.DirectionalLight;
export type DirectionalLight = jsb.DirectionalLight;
cclegacy.DirectionalLight = jsb.DirectionalLight;

export const SpotLight = jsb.SpotLight;
export type SpotLight = jsb.SpotLight;
cclegacy.SpotLight = jsb.SpotLight;

export const SphereLight = jsb.SphereLight;
export type SphereLight = jsb.SphereLight;
cclegacy.SphereLight = jsb.SphereLight;

/**
 * Fog related.
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
export const FogInfo = jsb.FogInfo;
export type FogInfo = jsb.FogInfo;
export const Fog = jsb.Fog;
export type Fog = jsb.Fog;
cclegacy.Fog = Fog;

/**
 * Shadows related.
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
export const PCFType = Enum({
    /**
     * @zh x1 次采样
     * @en x1 times
     * @readonly
     */
    HARD: 0,

    /**
     * @zh x4 次采样
     * @en x4 times
     * @readonly
     */
    SOFT: 1,

    /**
     * @zh x9 次采样
     * @en x9 times
     * @readonly
     */
    SOFT_2X: 2,
});
export const CSMLevel = Enum({
    /**
     * @zh 1 个层级
     * @en level 1
     * @readonly
     */
    LEVEL_1: 1,

    /**
     * @zh 2 个层级
     * @en level 2
     * @readonly
     */
    LEVEL_2: 2,

    /**
     * @zh 3 个层级
     * @en level 3
     * @readonly
     */
    LEVEL_3: 3,

    /**
     * @zh 4 个层级
     * @en level 4
     * @readonly
     */
    LEVEL_4: 4,
});
/**
 * @zh 级联阴影性能优化模式。
 * @en The CSM performance optimization mode
 * @enum Shadows.CSMOptimizationMode
 */
 export const CSMOptimizationMode = Enum({
    /**
     * @zh 没有性能优化
     * @en has no performance optimization
     * @readonly
     */
    NONE: 1,

    /**
     * @zh 2 个层级
     * @en level 2
     * @readonly
     */
    RemoveDuplicates: 2,

    /**
      * @zh 3 个层级
      * @en level 3
      * @readonly
      */
    DisableRotaitonFix: 3,
});
export const EnvironmentLightingType = Enum({
    /**
     * @zh
     * 半球漫反射
     * @en
     * hemisphere diffuse
     * @readonly
     */
    HEMISPHERE_DIFFUSE: 0,
    /**
     * @zh
     * 半球漫反射和环境反射
     * @en
     * hemisphere diffuse and Environment reflection
     * @readonly
     */
    AUTOGEN_HEMISPHERE_DIFFUSE_WITH_REFLECTION: 1,
    /**
     * @zh
     * 漫反射卷积图和环境反射
     * @en
     * diffuse convolution map and environment reflection
     * @readonly
     */
    DIFFUSEMAP_WITH_REFLECTION: 2,
});
export const ShadowsInfo = jsb.ShadowsInfo;
export type ShadowsInfo = jsb.ShadowsInfo;
export const Shadows = jsb.Shadows;
export type Shadows = jsb.Shadows;
cclegacy.Shadows = Shadows;

export const Skybox = jsb.Skybox;
export type Skybox = jsb.Skybox;
cclegacy.Skybox = Skybox;

export * from './model';
export * from './submodel';
export * from './camera';
export * from './reflection-probe';
