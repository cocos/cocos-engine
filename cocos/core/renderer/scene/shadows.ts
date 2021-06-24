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

import { Material } from '../../assets/material';
import { Sphere } from '../../geometry';
import { Color, Mat4, Vec3, Vec2 } from '../../math';
import { legacyCC } from '../../global-exports';
import { Enum } from '../../value-types';
import { ShadowsPool, NULL_HANDLE, ShadowsView, ShadowsHandle, ShaderHandle } from '../core/memory-pools';
import { ShadowsInfo } from '../../scene-graph/scene-globals';
import { IMacroPatch } from '../core/pass';

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
 * @enum Shadows.ShadowType
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
        if (ShadowsPool.get(this._handle, ShadowsView.ENABLE)) { return true; }
        return false;
    }

    set enabled (val: boolean) {
        ShadowsPool.set(this._handle, ShadowsView.ENABLE, val ? 1 : 0);
        if (!val) ShadowsPool.set(this._handle, ShadowsView.TYPE, SHADOW_TYPE_NONE);
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
        ShadowsPool.setVec3(this._handle, ShadowsView.NORMAL, this._normal);
    }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离。
     */
    get distance (): number {
        return ShadowsPool.get(this._handle, ShadowsView.DISTANCE);
    }

    set distance (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.DISTANCE, val);
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
        ShadowsPool.setVec4(this._handle, ShadowsView.COLOR, color);
    }

    /**
     * @en Shadow type.
     * @zh 阴影类型。
     */
    get type (): number {
        return ShadowsPool.get(this._handle, ShadowsView.TYPE);
    }
    set type (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.TYPE, this.enabled ? val : SHADOW_TYPE_NONE);
        this.activate();
    }

    /**
     * @en get or set shadow camera near.
     * @zh 获取或者设置阴影相机近裁剪面。
     */
    public get near (): number {
        return ShadowsPool.get(this._handle, ShadowsView.NEAR);
    }
    public set near (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.NEAR, val);
    }

    /**
     * @en get or set shadow camera far.
     * @zh 获取或者设置阴影相机远裁剪面。
     */
    public get far (): number {
        return ShadowsPool.get(this._handle, ShadowsView.FAR);
    }
    public set far (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.FAR, val);
    }

    /**
     * @en get or set shadow camera aspect.
     * @zh 获取或者设置阴影相机的宽高比。
     */
    public get aspect (): number {
        return ShadowsPool.get(this._handle, ShadowsView.ASPECT);
    }
    public set aspect (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.ASPECT, val);
    }

    /**
     * @en get or set shadow camera orthoSize.
     * @zh 获取或者设置阴影相机正交大小。
     */
    public get orthoSize (): number {
        return ShadowsPool.get(this._handle, ShadowsView.ORTHO_SIZE);
    }
    public set orthoSize (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.ORTHO_SIZE, val);
    }

    /**
     * @en get or set shadow camera orthoSize.
     * @zh 获取或者设置阴影纹理大小。
     */
    public get size (): Vec2 {
        return this._size;
    }
    public set size (val: Vec2) {
        this._size = val;
        ShadowsPool.setVec2(this._handle, ShadowsView.SIZE, this._size);
    }

    /**
     * @en get or set shadow pcf.
     * @zh 获取或者设置阴影pcf等级。
     */
    public get pcf (): number {
        return ShadowsPool.get(this._handle, ShadowsView.PCF_TYPE);
    }
    public set pcf (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.PCF_TYPE, val);
    }

    /**
     * @en shadow Map size has been modified.
     * @zh 阴影贴图大小是否被修改。
     */
    public get shadowMapDirty (): boolean {
        if (ShadowsPool.get(this._handle, ShadowsView.SHADOW_MAP_DIRTY)) { return true; }
        return false;
    }
    public set shadowMapDirty (val: boolean) {
        ShadowsPool.set(this._handle, ShadowsView.SHADOW_MAP_DIRTY, val ? 1 : 0);
    }

    /**
     * @en get or set shadow bias.
     * @zh 获取或者设置阴影偏移量。
     */
    public get bias (): number {
        return ShadowsPool.get(this._handle, ShadowsView.BIAS);
    }
    public set bias (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.BIAS, val);
    }

    /**
     * @en on or off packing depth.
     * @zh 打开或者关闭深度压缩。
     */
    public get packing (): boolean {
        if (ShadowsPool.get(this._handle, ShadowsView.PACKING)) { return true; }
        return false;
    }
    public set packing (val: boolean) {
        ShadowsPool.set(this._handle, ShadowsView.PACKING, val ? 1 : 0);
    }

    /**
     * @en on or off linear depth.
     * @zh 打开或者关闭线性深度。
     */
    public get linear (): boolean {
        if (ShadowsPool.get(this._handle, ShadowsView.LINEAR)) { return true; }
        return false;
    }
    public set linear (val: boolean) {
        ShadowsPool.set(this._handle, ShadowsView.LINEAR, val ? 1 : 0);
    }

    /**
     * @en on or off Self-shadowing.
     * @zh 打开或者关闭自阴影。
     */
    public get selfShadow (): boolean {
        if (ShadowsPool.get(this._handle, ShadowsView.SELF_SHADOW)) { return true; }
        return false;
    }
    public set selfShadow (val: boolean) {
        ShadowsPool.set(this._handle, ShadowsView.SELF_SHADOW, val ? 1 : 0);
    }

    /**
     * @en get or set normal bias.
     * @zh 设置或者获取法线偏移。
     */
    public get normalBias (): number {
        return ShadowsPool.get(this._handle, ShadowsView.NORMAL_BIAS);
    }
    public set normalBias (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.NORMAL_BIAS, val);
    }

    /**
     * @en get or set shadow auto control.
     * @zh 获取或者设置阴影是否自动控制。
     */
    public get autoAdapt (): boolean {
        if (ShadowsPool.get(this._handle, ShadowsView.AUTO_ADAPT)) { return true; }
        return false;
    }
    public set autoAdapt (val: boolean) {
        ShadowsPool.set(this._handle, ShadowsView.AUTO_ADAPT, val ? 1 : 0);
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

    public get handle () : ShadowsHandle {
        return this._handle;
    }

    /**
     * @en The bounding sphere of the shadow map.
     * @zh 用于计算阴影 Shadow map 的场景包围球.
     */
    public sphere: Sphere = new Sphere(0.0, 0.0, 0.0, 0.01);

    /**
     * @en get or set shadow max received.
     * @zh 阴影接收的最大灯光数量。
     */
    public maxReceived = 4;

    protected _normal = new Vec3(0, 1, 0);
    protected _shadowColor = new Color(0, 0, 0, 76);
    protected _matLight = new Mat4();
    protected _material: Material | null = null;
    protected _instancingMaterial: Material | null = null;
    protected _size: Vec2 = new Vec2(512, 512);
    protected _handle: ShadowsHandle = NULL_HANDLE;

    constructor () {
        this._handle = ShadowsPool.alloc();
    }

    public getPlanarShader (patches: IMacroPatch[] | null): ShaderHandle {
        if (!this._material) {
            this._material = new Material();
            this._material.initialize({ effectName: 'planar-shadow' });
            ShadowsPool.set(this._handle, ShadowsView.PLANAR_PASS, this._material.passes[0].handle);
        }

        return this._material.passes[0].getShaderVariant(patches);
    }

    public getPlanarInstanceShader (patches: IMacroPatch[] | null): ShaderHandle {
        if (!this._instancingMaterial) {
            this._instancingMaterial = new Material();
            this._instancingMaterial.initialize({ effectName: 'planar-shadow', defines: { USE_INSTANCING: true } });
            ShadowsPool.set(this._handle, ShadowsView.INSTANCE_PASS, this._instancingMaterial.passes[0].handle);
        }

        return this._instancingMaterial.passes[0].getShaderVariant(patches);
    }

    public initialize (shadowsInfo: ShadowsInfo) {
        ShadowsPool.set(this._handle, ShadowsView.TYPE, shadowsInfo.enabled ? shadowsInfo.type : SHADOW_TYPE_NONE);
        ShadowsPool.set(this._handle, ShadowsView.NEAR, shadowsInfo.near);
        ShadowsPool.set(this._handle, ShadowsView.FAR, shadowsInfo.far);
        ShadowsPool.set(this._handle, ShadowsView.ASPECT, shadowsInfo.aspect);
        ShadowsPool.set(this._handle, ShadowsView.ORTHO_SIZE, shadowsInfo.orthoSize);
        this._size = shadowsInfo.shadowMapSize;
        ShadowsPool.setVec2(this._handle, ShadowsView.SIZE, this._size);
        ShadowsPool.set(this._handle, ShadowsView.PCF_TYPE, shadowsInfo.pcf);
        Vec3.copy(this._normal, shadowsInfo.normal);
        ShadowsPool.setVec3(this._handle, ShadowsView.NORMAL, this._normal);
        ShadowsPool.set(this._handle, ShadowsView.DISTANCE, shadowsInfo.distance);
        this._shadowColor.set(shadowsInfo.shadowColor);
        ShadowsPool.setVec4(this._handle, ShadowsView.COLOR, this._shadowColor);
        ShadowsPool.set(this._handle, ShadowsView.BIAS, shadowsInfo.bias);
        ShadowsPool.set(this._handle, ShadowsView.PACKING, shadowsInfo.packing ? 1 : 0);
        ShadowsPool.set(this._handle, ShadowsView.LINEAR, shadowsInfo.linear ? 1 : 0);
        ShadowsPool.set(this._handle, ShadowsView.SELF_SHADOW, shadowsInfo.selfShadow ? 1 : 0);
        ShadowsPool.set(this._handle, ShadowsView.NORMAL_BIAS, shadowsInfo.normalBias);
        ShadowsPool.set(this._handle, ShadowsView.ENABLE, shadowsInfo.enabled ? 1 : 0);
        this.maxReceived = shadowsInfo.maxReceived;
        ShadowsPool.set(this._handle, ShadowsView.AUTO_ADAPT, shadowsInfo.autoAdapt ? 1 : 0);
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
            pipeline.macros.CC_RECEIVE_SHADOW = 0;
            root.onGlobalPipelineStateChanged();
        }
    }

    protected _updatePlanarInfo () {
        if (!this._material) {
            this._material = new Material();
            this._material.initialize({ effectName: 'planar-shadow' });
            ShadowsPool.set(this._handle, ShadowsView.PLANAR_PASS, this._material.passes[0].handle);
        }
        if (!this._instancingMaterial) {
            this._instancingMaterial = new Material();
            this._instancingMaterial.initialize({ effectName: 'planar-shadow', defines: { USE_INSTANCING: true } });
            ShadowsPool.set(this._handle, ShadowsView.INSTANCE_PASS, this._instancingMaterial.passes[0].handle);
        }

        const root = legacyCC.director.root;
        const pipeline = root.pipeline;
        pipeline.macros.CC_RECEIVE_SHADOW = 0;
        root.onGlobalPipelineStateChanged();
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root;
        const pipeline = root.pipeline;
        pipeline.macros.CC_RECEIVE_SHADOW = 1;
        root.onGlobalPipelineStateChanged();
    }

    public destroy () {
        if (this._material) {
            this._material.destroy();
        }

        if (this._instancingMaterial) {
            this._instancingMaterial.destroy();
        }

        if (this._handle) {
            ShadowsPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }

        this.sphere.destroy();
    }
}

legacyCC.Shadows = Shadows;
