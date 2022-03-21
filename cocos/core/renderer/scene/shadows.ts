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

/**
 * @zh 级联阴影贴图层级。
 * @en The CSM shadow level
 * @enum Shadows.CSMLevel
 */
export const CSMLevel = Enum({
    /**
     * @zh 1 个层级
     * @en level 1
     * @readonly
     */
    level_1: 1,

    /**
     * @zh 2 个层级
     * @en level 2
     * @readonly
     */
    level_2: 2,

    /**
     * @zh 3 个层级
     * @en level 3
     * @readonly
     */
    level_3: 3,

    /**
     * @zh 4 个层级
     * @en level 4
     * @readonly
     */
    level_4: 4,
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

    protected _enabled = false;
    protected _type = SHADOW_TYPE_NONE;
    protected _distance = 0;
    protected _normal = new Vec3(0, 1, 0);
    protected _shadowColor = new Color(0, 0, 0, 76);
    protected _size: Vec2 = new Vec2(512, 512);
    protected _shadowMapDirty = false;

    protected _matLight = new Mat4();
    protected _material: Material | null = null;
    protected _instancingMaterial: Material | null = null;

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
        this._setEnable(shadowsInfo.enabled);
        this._setType(shadowsInfo.type);

        this.normal = shadowsInfo.planeDirection;
        this.distance = shadowsInfo.planeHeight;
        this.shadowColor = shadowsInfo.shadowColor;
        this.maxReceived = shadowsInfo.maxReceived;
        this.size = shadowsInfo.size;
    }

    public activate () {
        if (this.enabled) {
            if (this.type === ShadowType.Planar) {
                this._updatePlanarInfo();
            }
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
