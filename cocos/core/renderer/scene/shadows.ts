
import { Material } from '../../assets/material';
import { sphere } from '../../geometry';
import { Color, Mat4, Vec3, Vec2 } from '../../math';
import { legacyCC } from '../../global-exports';
import { Enum } from '../../value-types';
import { ShadowsPool, NULL_HANDLE, ShadowsView, ShadowsHandle } from '../core/memory-pools';

/**
 * @zh 阴影类型。
 * @en The shadow type
 * @static
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
})

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
     * @zh x5 次采样
     * @en x5 times
     * @readonly
     */
    FILTER_X5: 1,

    /**
     * @zh x9 次采样
     * @en x9 times
     * @readonly
     */
    FILTER_X9: 2,

    /**
     * @zh x25 次采样
     * @en x25 times
     * @readonly
     */
    FILTER_X25: 3,
})

export class Shadows {
    /**
     * @en Whether activate planar shadow
     * @zh 是否启用平面阴影？
     */
    get enabled (): boolean {
        return ShadowsPool.get(this._handle, ShadowsView.ENABLE) as unknown as boolean;
    }

    set enabled (val: boolean) {
        this.dirty = true;
        ShadowsPool.set(this._handle, ShadowsView.ENABLE, val ? 1 : 0);
        val ? this.activate() : this._updatePipeline();
    }

    /**
     * @en The normal of the plane which receives shadow
     * @zh 阴影接收平面的法线
     */
    get normal (): Vec3 {
        return this._normal;
    }

    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
        this.dirty = true;
        ShadowsPool.setVec3(this._handle, ShadowsView.NORMAL, this._normal);
    }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离
     */
    get distance (): number {
        return ShadowsPool.get(this._handle, ShadowsView.DISTANCE);
    }

    set distance (val: number) {
        this.dirty = true;
        ShadowsPool.set(this._handle, ShadowsView.DISTANCE, val);
    }

    /**
     * @en Shadow color
     * @zh 阴影颜色
     */
    get shadowColor (): Color {
        return this._shadowColor;
    }

    set shadowColor (color: Color) {
        this._shadowColor = color;
        this.dirty = true;
        ShadowsPool.setVec4(this._handle, ShadowsView.COLOR, color);
    }

    /**
     * @en Shadow type
     * @zh 阴影类型
     */
    get type (): number {
        return ShadowsPool.get(this._handle, ShadowsView.TYPE);
    }

    set type (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.TYPE, this.enabled ? val : -1);
        this._updatePipeline();
        this._updatePlanarInfo();
    }

    /**
     * @en get or set shadow camera near
     * @zh 获取或者设置阴影相机近裁剪面
     */
    public get near (): number {
        return ShadowsPool.get(this._handle, ShadowsView.NEAR);
    }
    public set near (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.NEAR, val);
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置阴影相机远裁剪面
     */
    public get far (): number {
        return ShadowsPool.get(this._handle, ShadowsView.FAR);
    }
    public set far (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.FAR, val);
    }

    /**
     * @en get or set shadow camera aspect
     * @zh 获取或者设置阴影相机的宽高比
     */
    public get aspect (): number {
        return ShadowsPool.get(this._handle, ShadowsView.ASPECT);
    }
    public set aspect (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.ASPECT, val);
    }

    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影相机正交大小
     */
    public get orthoSize (): number {
        return ShadowsPool.get(this._handle, ShadowsView.ORTHO_SIZE);
    }
    public set orthoSize (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.ORTHO_SIZE, val);
    }

    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影纹理大小
     */
    public get size (): Vec2 {
        return this._size;
    }
    public set size (val: Vec2) {
        this._size = val;
        ShadowsPool.setVec2(this._handle, ShadowsView.SIZE, this._size);
    }

    /**
     * @en get or set shadow pcf
     * @zh 获取或者设置阴影pcf等级
     */
    public get pcf (): number {
        return ShadowsPool.get(this._handle, ShadowsView.PCF_TYPE);
    }
    public set pcf (val: number) {
        ShadowsPool.set(this._handle, ShadowsView.PCF_TYPE, val);
    }

    public get matLight () {
        return this._matLight;
    }

    /**
     * @zh
     * 场景包围球
     */
    public get sphere (): sphere {
        return this._sphere;
    }
    public get dirty (): boolean {
        return ShadowsPool.get(this._handle, ShadowsView.DIRTY) as unknown as boolean;
    }
    public set dirty (val: boolean) {
        ShadowsPool.set(this._handle, ShadowsView.DIRTY, val ? 1 : 0);
    }

    public get material (): Material | null {
        return this._material;
    }

    public get instancingMaterial (): Material | null {
        return this._instancingMaterial;
    }

    protected _normal = new Vec3(0, 1, 0);
    protected _shadowColor = new Color(0, 0, 0, 76);
    protected _matLight = new Mat4();
    protected _material: Material | null = null;
    protected _instancingMaterial: Material | null = null;
    protected _size: Vec2 = new Vec2(512, 512);
    protected _handle: ShadowsHandle = NULL_HANDLE;
    protected _sphere: sphere = new sphere(0.0, 0.0, 0.0, 0.01);

    constructor () {
        this._handle = ShadowsPool.alloc();
    }

    public activate () {
        this.dirty = true;
        if (this.type === ShadowType.ShadowMap) {
            this._updatePipeline();
        } else {
            this._updatePlanarInfo();
        }
    }

    protected _updatePlanarInfo () {
        if (!this._material) {
            this._material = new Material();
            this._material.initialize({ effectName: 'pipeline/planar-shadow' });
            ShadowsPool.set(this._handle, ShadowsView.PLANAR_PASS, this._material.passes[0].handle);
        }
        if (!this._instancingMaterial) {
            this._instancingMaterial = new Material();
            this._instancingMaterial.initialize({ effectName: 'pipeline/planar-shadow', defines: { USE_INSTANCING: true } });
            ShadowsPool.set(this._handle, ShadowsView.INSTANCE_PASS, this._instancingMaterial.passes[0].handle);
        }
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root
        const pipeline = root.pipeline;
        const enable = this.enabled && this.type === ShadowType.ShadowMap;
        if (pipeline.macros.CC_RECEIVE_SHADOW === enable) { return; }
        pipeline.macros.CC_RECEIVE_SHADOW = enable;
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
    }
}

legacyCC.Shadows = Shadows;
