import { Enum } from '../../value-types';
import { Color } from '../../../core/math';
import { legacyCC } from '../../global-exports';
import { FogPool, NULL_HANDLE, FogView, FogHandle } from '../core/memory-pools';

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

export class Fog {
    /**
     * @zh 是否启用全局雾效
     * @en Enable global fog
     */
    set enabled (val: boolean) {
        FogPool.set(this._handle, FogView.ENABLE, val ? 1 : 0);
        FogPool.set(this._handle, FogView.TYPE, val ? this._type + 1 : 0);
        val ? this.activate() : this._updatePipeline();
    }

    get enabled (): boolean {
        return FogPool.get(this._handle, FogView.ENABLE) as unknown as boolean;
    }

    /**
     * @zh 全局雾颜色
     * @en Global fog color
     */
    set fogColor (val: Color) {
        this._fogColor.set(val);
        Color.toArray(this._colorArray, this._fogColor);
        FogPool.setVec4(this._handle, FogView.COLOR, this._fogColor);
    }

    get fogColor () {
        return this._fogColor;
    }

    /**
     * @zh 全局雾类型
     * @en Global fog type
     */
    get type (): number {
        return this._type;
    }

    set type (val: number) {
        this._type = val;
        if (this.enabled) this._updatePipeline();
        FogPool.set(this._handle, FogView.TYPE, this.enabled ? this._type + 1 : 0);
    }

    /**
     * @zh 全局雾浓度
     * @en Global fog density
     */
    get fogDensity (): number {
        return FogPool.get(this._handle, FogView.DENSITY);
    }

    set fogDensity (val: number) {
        FogPool.set(this._handle, FogView.DENSITY, val);
    }

    /**
     * @zh 雾效起始位置，只适用于线性雾
     * @en Global fog start position, only for linear fog
     */
    get fogStart (): number {
        return FogPool.get(this._handle, FogView.START);
    }

    set fogStart (val: number) {
        FogPool.set(this._handle, FogView.START, val);
    }

    /**
     * @zh 雾效结束位置，只适用于线性雾
     * @en Global fog end position, only for linear fog
     */
    get fogEnd (): number {
        return FogPool.get(this._handle, FogView.END);
    }

    set fogEnd (val: number) {
        FogPool.set(this._handle, FogView.END, val);
    }

    /**
     * @zh 雾效衰减
     * @en Global fog attenuation
     */
    get fogAtten (): number {
        return FogPool.get(this._handle, FogView.ATTEN);
    }

    set fogAtten (val: number) {
        FogPool.set(this._handle, FogView.ATTEN, val);
    }

    /**
     * @zh 雾效顶部范围，只适用于层级雾
     * @en Global fog top range, only for layered fog
     */
    get fogTop (): number {
        return FogPool.get(this._handle, FogView.TOP);
    }

    set fogTop (val: number) {
        FogPool.set(this._handle, FogView.TOP, val);
    }

    /**
     * @zh 雾效范围，只适用于层级雾
     * @en Global fog range, only for layered fog
     */
    get fogRange (): number {
        return FogPool.get(this._handle, FogView.RANGE);
    }

    set fogRange (val: number) {
        FogPool.set(this._handle, FogView.RANGE, val);
    }
    /**
     * @zh 当前雾化类型。
     * @en The current global fog type.
     * @returns {FogType}
     * Returns the current global fog type
     * - 0:Disable global Fog
     * - 1:Linear fog
     * - 2:Exponential fog
     * - 3:Exponential square fog
     * - 4:Layered fog
     */
    get currType (): number {
        return FogPool.get(this._handle, FogView.TYPE);
    }

    get colorArray (): Float32Array {
        return this._colorArray;
    }

    protected _type = FogType.LINEAR;
    protected _fogColor = new Color('#C8C8C8');
    protected _colorArray: Float32Array = new Float32Array([0.2, 0.2, 0.2, 1.0]);
    protected _handle: FogHandle = NULL_HANDLE;

    constructor () {
        this._handle = FogPool.alloc();
    }

    public activate () {
        Color.toArray(this._colorArray, this._fogColor);
        FogPool.setVec4(this._handle, FogView.COLOR, this._fogColor);
        FogPool.set(this._handle, FogView.TYPE, this.enabled ? this._type + 1 : 0);
        this._updatePipeline();
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root
        const value = this.currType;
        const pipeline = root.pipeline;
        if (pipeline.macros.CC_USE_FOG === value) { return; }
        pipeline.macros.CC_USE_FOG = value;
        root.onGlobalPipelineStateChanged();
    }

    public destroy () {
        if (this._handle) {
            FogPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }
}

legacyCC.Fog = Fog;
