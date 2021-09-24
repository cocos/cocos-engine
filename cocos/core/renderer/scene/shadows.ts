/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { JSB } from 'internal:constants';
import { Material } from '../../assets/material';
import { Sphere } from '../../geometry';
import { Color, Mat4, Vec3, Vec2 } from '../../math';
import { legacyCC } from '../../global-exports';
import { Enum } from '../../value-types';
import { ShadowsInfo } from '../../scene-graph/scene-globals';
import { IMacroPatch } from '../core/pass';
import { NativeShadow } from './native-scene';
import { Shader } from '../../gfx';

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

const SHADOW_TYPE_NONE = ShadowType.ShadowMap + 1;

export class Shadows {
    /**
     * @en MAX_FAR. This is shadow camera max far.
     * @zh 阴影相机的最远视距。
     */
    public static readonly MAX_FAR: number = 2000.0;

    /**
     * @en EXPANSION_RATIO. This is shadow boundingBox Coefficient of expansion.
     * @zh 阴影包围盒扩大系数。
     */
    public static readonly COEFFICIENT_OF_EXPANSION: number = 2.0 * Math.sqrt(3.0);

    /**
     * @en Whether activate planar shadow.
     * @zh 是否启用平面阴影？
     */
    get enabled (): boolean {
        return this._enabled;
    }

    set enabled (val: boolean) {
        this._setEnable(val);
        this.activate();
    }

    /**
     * @en The normal of the plane which receives shadow.
     * @zh 阴影接收平面的法线。
     */
    get normal (): Vec3 {
        return this._normal;
    }

    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
        if (JSB) {
            this._nativeObj!.normal = this._normal;
        }
    }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离。
     */
    get distance (): number {
        return this._distance;
    }

    set distance (val: number) {
        this._distance = val;
        if (JSB) {
            this._nativeObj!.distance = val;
        }
    }

    /**
     * @en Shadow color.
     * @zh 阴影颜色。
     */
    get shadowColor (): Color {
        return this._shadowColor;
    }

    set shadowColor (color: Color) {
        this._shadowColor = color;
        if (JSB) {
            this._nativeObj!.color = color;
        }
    }

    /**
     * @en get or set shadow invisible Occlusion Range.
     * @zh 控制潜在遮挡体产生的范围。
     */
    public get invisibleOcclusionRange (): number {
        return this._invisibleOcclusionRange;
    }
    public set invisibleOcclusionRange (val: number) {
        this._invisibleOcclusionRange = val;
        if (JSB) {
            this._nativeObj!.invisibleOcclusionRange = val;
        }
    }

    /**
     * @en get or set shadow distance.
     * @zh 控制阴影的可视范围。
     */
    public get shadowDistance (): number {
        return this._shadowDistance;
    }
    public set shadowDistance (val: number) {
        this._shadowDistance = val;
        if (JSB) {
            this._nativeObj!.shadowDistance = val;
        }
    }

    /**
     * @en Shadow type.
     * @zh 阴影类型。
     */
    get type (): number {
        return this._type;
    }
    set type (val: number) {
        this._setType(val);
        this.activate();
    }

    /**
     * @en get or set shadow camera near.
     * @zh 获取或者设置阴影相机近裁剪面。
     */
    public get near (): number {
        return this._near;
    }
    public set near (val: number) {
        this._near = val;
        if (JSB) {
            this._nativeObj!.nearValue = val;
        }
    }

    /**
     * @en get or set shadow camera far.
     * @zh 获取或者设置阴影相机远裁剪面。
     */
    public get far (): number {
        return this._far;
    }
    public set far (val: number) {
        this._far = val;
        if (JSB) {
            this._nativeObj!.farValue = val;
        }
    }

    /**
     * @en get or set shadow camera orthoSize.
     * @zh 获取或者设置阴影相机正交大小。
     */
    public get orthoSize (): number {
        return this._orthoSize;
    }
    public set orthoSize (val: number) {
        this._orthoSize = val;
        if (JSB) {
            this._nativeObj!.orthoSize = val;
        }
    }

    /**
     * @en get or set shadow camera orthoSize.
     * @zh 获取或者设置阴影纹理大小。
     */
    public get size (): Vec2 {
        return this._size;
    }
    public set size (val: Vec2) {
        this._size.set(val);
        if (JSB) {
            this._nativeObj!.size = val;
        }
    }

    /**
     * @en get or set shadow pcf.
     * @zh 获取或者设置阴影pcf等级。
     */
    public get pcf (): number {
        return this._pcf;
    }
    public set pcf (val: number) {
        this._pcf = val;
        if (JSB) {
            this._nativeObj!.pcfType = val;
        }
    }

    /**
     * @en shadow Map size has been modified.
     * @zh 阴影贴图大小是否被修改。
     */
    public get shadowMapDirty (): boolean {
        return this._shadowMapDirty;
    }
    public set shadowMapDirty (val: boolean) {
        this._shadowMapDirty = val;
        if (JSB) {
            this._nativeObj!.shadowMapDirty = val;
        }
    }

    /**
     * @en get or set shadow bias.
     * @zh 获取或者设置阴影偏移量。
     */
    public get bias (): number {
        return this._bias;
    }
    public set bias (val: number) {
        this._bias = val;
        if (JSB) {
            this._nativeObj!.bias = val;
        }
    }

    /**
     * @en get or set normal bias.
     * @zh 设置或者获取法线偏移。
     */
    public get normalBias (): number {
        return this._normalBias;
    }
    public set normalBias (val: number) {
        this._normalBias = val;
        if (JSB) {
            this._nativeObj!.normalBias = val;
        }
    }

    /**
     * @en get or set shadow saturation.
     * @zh 设置或者获取阴影饱和度。
     */
    public get saturation (): number {
        return this._saturation;
    }
    public set saturation (val: number) {
        this._saturation = val;
        if (JSB) {
            this._nativeObj!.saturation = val;
        }
    }

    /**
     * @en get or set fixed area shadow
     * @zh 是否是固定区域阴影
     */
    public get fixedArea (): boolean {
        return this._fixedArea;
    }
    public set fixedArea (val: boolean) {
        this._fixedArea = val;
        if (JSB) {
            this._nativeObj!.fixedArea = val;
        }
    }

    public get matLight () {
        return this._matLight;
    }

    public get material (): Material {
        return this._material!;
    }

    public get instancingMaterial (): Material {
        return this._instancingMaterial!;
    }

    /**
     * @en The bounding sphere of the shadow map.
     * @zh 用于计算固定区域阴影 Shadow map 的场景包围球.
     */
    public fixedSphere: Sphere = new Sphere(0.0, 0.0, 0.0, 0.01);

    /**
     * @en get or set shadow max received.
     * @zh 阴影接收的最大灯光数量。
     */
    public maxReceived = 4;

    // local set
    public firstSetCSM = false;
    public shadowCameraFar = 0;
    public matShadowView = new Mat4();
    public matShadowProj = new Mat4();
    public matShadowViewProj = new Mat4();

    protected _normal = new Vec3(0, 1, 0);
    protected _shadowColor = new Color(0, 0, 0, 76);
    protected _matLight = new Mat4();
    protected _material: Material | null = null;
    protected _instancingMaterial: Material | null = null;
    protected _size: Vec2 = new Vec2(512, 512);
    protected _enabled = false;
    protected _distance = 0;
    protected _type = SHADOW_TYPE_NONE;
    protected _near = 0.1;
    protected _far = 10;
    protected _invisibleOcclusionRange = 200;
    protected _shadowDistance = 100;
    protected _orthoSize = 1;
    protected _pcf = 0;
    protected _shadowMapDirty = false;
    protected _bias = 0;
    protected _normalBias = 0;
    protected _fixedArea = false;
    protected _saturation = 0.75;
    protected declare _nativeObj: NativeShadow | null;

    get native (): NativeShadow {
        return this._nativeObj!;
    }

    constructor () {
        if (JSB) {
            this._nativeObj = new NativeShadow();
        }
    }

    public getPlanarShader (patches: IMacroPatch[] | null): Shader | null {
        if (!this._material) {
            this._material = new Material();
            this._material.initialize({ effectName: 'planar-shadow' });
            if (JSB) {
                this._nativeObj!.planarPass = this._material.passes[0].native;
            }
        }

        return this._material.passes[0].getShaderVariant(patches);
    }

    public getPlanarInstanceShader (patches: IMacroPatch[] | null): Shader | null {
        if (!this._instancingMaterial) {
            this._instancingMaterial = new Material();
            this._instancingMaterial.initialize({ effectName: 'planar-shadow', defines: { USE_INSTANCING: true } });
            if (JSB) {
                this._nativeObj!.instancePass = this._instancingMaterial.passes[0].native;
            }
        }

        return this._instancingMaterial.passes[0].getShaderVariant(patches);
    }

    private _setEnable (val: boolean) {
        this._enabled = val;
        if (JSB) {
            this._nativeObj!.enabled = val;
            if (!val) this._setType(SHADOW_TYPE_NONE);
        }
    }

    private _setType (val) {
        this._type = this.enabled ? val : SHADOW_TYPE_NONE;
        if (JSB) {
            this._nativeObj!.shadowType = this._type;
        }
    }

    public initialize (shadowsInfo: ShadowsInfo) {
        this.near = shadowsInfo.near;
        this.far = shadowsInfo.far;
        this.invisibleOcclusionRange = shadowsInfo.invisibleOcclusionRange;
        this.shadowDistance = shadowsInfo.shadowDistance;
        this.orthoSize = shadowsInfo.orthoSize;
        this.size = shadowsInfo.size;
        this.pcf = shadowsInfo.pcf;
        this.normal = shadowsInfo.normal;
        this.distance = shadowsInfo.distance;
        this.shadowColor = shadowsInfo.shadowColor;
        this.bias = shadowsInfo.bias;
        this.normalBias = shadowsInfo.normalBias;
        this.maxReceived = shadowsInfo.maxReceived;
        this.fixedArea = shadowsInfo.fixedArea;
        this._setEnable(shadowsInfo.enabled);
        this._setType(shadowsInfo.type);
        this.saturation = shadowsInfo.saturation;
    }

    public activate () {
        if (this.enabled) {
            if (this.type === ShadowType.ShadowMap) {
                this._updatePipeline();
            } else {
                this._updatePlanarInfo();
            }
        } else {
            const root = legacyCC.director.root;
            const pipeline = root.pipeline;
            pipeline.macros.CC_ENABLE_DIR_SHADOW = 0;
            root.onGlobalPipelineStateChanged();
        }
    }

    protected _updatePlanarInfo () {
        if (!this._material) {
            this._material = new Material();
            this._material.initialize({ effectName: 'planar-shadow' });
            if (JSB) {
                this._nativeObj!.planarPass = this._material.passes[0].native;
            }
        }
        if (!this._instancingMaterial) {
            this._instancingMaterial = new Material();
            this._instancingMaterial.initialize({ effectName: 'planar-shadow', defines: { USE_INSTANCING: true } });
            if (JSB) {
                this._nativeObj!.instancePass = this._instancingMaterial.passes[0].native;
            }
        }

        const root = legacyCC.director.root;
        const pipeline = root.pipeline;
        pipeline.macros.CC_ENABLE_DIR_SHADOW = 0;
        root.onGlobalPipelineStateChanged();
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root;
        const pipeline = root.pipeline;
        pipeline.macros.CC_ENABLE_DIR_SHADOW = 1;
        root.onGlobalPipelineStateChanged();
    }

    protected _destroy () {
        if (JSB) {
            this._nativeObj = null;
        }
    }

    public destroy () {
        this._destroy();
        if (this._material) {
            this._material.destroy();
        }

        if (this._instancingMaterial) {
            this._instancingMaterial.destroy();
        }
        this.fixedSphere.destroy();
    }
}

legacyCC.Shadows = Shadows;
