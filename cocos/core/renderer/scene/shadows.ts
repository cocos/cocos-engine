
import { Material } from '../../assets/material';
import { sphere } from '../../geometry';
import { Color, Mat4, Quat, Vec3, Vec2, Vec4 } from '../../math';
import { UBOShadow } from '../../pipeline/define';
import { GFXDescriptorSet } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { ForwardPipeline } from '../../pipeline';
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
        return this._enabled;
    }

    set enabled (val: boolean) {
        if (this._enabled === val) {
            return;
        }
        this._enabled = val;
        this.dirty = true;
        ShadowsPool.set(this._handle, ShadowsView.ENABLE, this._enabled ? 1 : 0);
        this._enabled ? this.activate() : this._updatePipeline();
    }

    /**
     * @en The normal of the plane which receives shadow
     * @zh 阴影接收平面的法线
     */
    get normal () {
        return this._normal;
    }

    set normal (val: Vec3) {
        Vec3.copy(this._normal, val);
        this.dirty = true;
        ShadowsPool.set(this._handle, ShadowsView.NORMAL, this._normal);
    }

    /**
     * @en The distance from coordinate origin to the receiving plane.
     * @zh 阴影接收平面与原点的距离
     */
    get distance () {
        return this._distance;
    }

    set distance (val: number) {
        this._distance = val;
        this.dirty = true;
        ShadowsPool.set(this._handle, ShadowsView.DISTANCE, this._distance);
    }

    /**
     * @en Shadow color
     * @zh 阴影颜色
     */
    get shadowColor () {
        return this._shadowColor;
    }

    set shadowColor (color: Color) {
        this._shadowColor = color;
        this.dirty = true;
    }

    /**
     * @en Shadow type
     * @zh 阴影类型
     */
    get type () {
        return this._enabled ? this._type : -1;
    }

    set type (val) {
        this._type = val;
        ShadowsPool.set(this._handle, ShadowsView.TYPE, this._enabled ? this._type : -1);
        this._updatePipeline();
        this._updatePlanarInfo();
    }

    /**
     * @en get or set shadow camera near
     * @zh 获取或者设置阴影相机近裁剪面
     */
    public get near () {
        return this._near;
    }
    public set near (val) {
        this._near = val;
        ShadowsPool.set(this._handle, ShadowsView.NEAR, this._near);
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置阴影相机远裁剪面
     */
    public get far () {
        return this._far;
    }
    public set far (val) {
        this._far = val;
        ShadowsPool.set(this._handle, ShadowsView.FAR, this._far);
    }

    /**
     * @en get or set shadow camera aspect
     * @zh 获取或者设置阴影相机的宽高比
     */
    public get aspect () {
        return this._aspect;
    }
    public set aspect (val) {
        this._aspect = val;
        ShadowsPool.set(this._handle, ShadowsView.ASPECT, this._aspect);
    }

    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影相机正交大小
     */
    public get orthoSize () {
        return this._orthoSize;
    }
    public set orthoSize (val) {
        this._orthoSize = val;
        ShadowsPool.set(this._handle, ShadowsView.ORTHO_SIZE, this._orthoSize);
    }

    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影纹理大小
     */
    public get size () {
        return this._size;
    }
    public set size (val) {
        this._size = val;
        ShadowsPool.set(this._handle, ShadowsView.SIZE, this._size);
    }

    /**
     * @en get or set shadow pcf
     * @zh 获取或者设置阴影pcf等级
     */
    public get pcf () {
        return this._pcf;
    }
    public set pcf (val) {
        this._pcf = val;
        ShadowsPool.set(this._handle, ShadowsView.PCF_TYPE, this._pcf);
    }

    public get matLight () {
        return this._matLight;
    }
    public get data () {
        return this._data;
    }

    /**
     * @zh
     * 场景包围球
     */
    public get sphere () {
        return this._sphere;
    }
    public get dirty () {
        return this._dirty;
    }
    public set dirty (val) {
        this._dirty = val;
        ShadowsPool.set(this._handle, ShadowsView.DIRTY, this._dirty ? 1 : 0);
    }

    public get material () {
        return this._material;
    }

    public get instancingMaterial () {
        return this._instancingMaterial;
    }

    protected _enabled: boolean = false;
    protected _type = ShadowType.Planar;
    protected _normal = new Vec3(0, 1, 0);
    protected _distance = 0;
    protected _shadowColor = new Color(0, 0, 0, 76);
    protected _matLight = new Mat4();
    protected _data = Float32Array.from([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // matLightPlaneProj
        0.0, 0.0, 0.0, 0.3, // shadowColor
    ]);
    protected _material: Material | null = null;
    protected _instancingMaterial: Material | null = null;
    protected _dirty: boolean = true;
    protected _near: number = 1;
    protected _far: number = 30;
    protected _aspect: number = 1;
    protected _orthoSize: number = 1;
    protected _size: Vec2 = new Vec2(512, 512);
    protected _pcf = PCFType.HARD;
    protected _handle: ShadowsHandle = NULL_HANDLE;
    protected _sphere: sphere = new sphere(0.0, 0.0, 0.0, 0.01);
    
    constructor () {
        this._handle = ShadowsPool.alloc();
    }

    public activate () {
        this.dirty = true;
        if (this._type === ShadowType.ShadowMap) {
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
        const enable = this._enabled && this._type === ShadowType.ShadowMap;
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
    }
}
