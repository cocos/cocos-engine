import { Enum } from '../../value-types';
import { ccclass, property } from '../../data/class-decorator';
import { Color } from '../../../core/math';
import { CCBoolean, CCFloat } from '../../data/utils/attribute';
import { legacyCC } from '../../global-exports';

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
     * @property LINEAR
     * @readonly
     */
    LINEAR: 0,
    /**
     * @zh
     * 指数雾。
     * @en
     * Exponential fog
     * @property EXP
     * @readonly
     */
    EXP: 1,
    /**
     * @zh
     * 指数平方雾。
     * @en
     * Exponential square fog
     * @property EXP_SQUARED
     * @readonly
     */
    EXP_SQUARED: 2,
    /**
     * @zh
     * 层叠雾。
     * @en
     * Layered fog
     * @property LAYERED
     * @readonly
     */
    LAYERED: 3,
});

@ccclass('cc.Fog')
export class Fog {
    /**
     * @zh 是否启用全局雾效
     * @en Enable global fog
     */
    @property({ type: CCBoolean })
    set enabled (val: boolean) {
        this._enabled = val;
        if (!val) {
            this._currType = 0;
        } else {
            this._currType = this._type + 1;
        }
        this._updatePipeline();
    }

    get enabled () {
        return this._enabled;
    }

    /**
     * @zh 全局雾颜色
     * @en Global fog color
     */
    @property({ type: Color })
    set fogColor (val: Color) {
        this._fogColor.set(val);
        Color.toArray(this._colorArray, this._fogColor);
    }

    get fogColor () {
        return this._fogColor;
    }

    /**
     * @zh 全局雾类型
     * @en Global fog type
     */
    @property({
        type: FogType
    })
    get type () {
        return this._type;
    }

    set type (val) {
        this._type = val;
        if (!this.enabled) {
            return;
        }
        this._currType = val + 1;
        this._updatePipeline();
    }

    /**
     * @zh 全局雾浓度
     * @en Global fog density
     */
    @property({
        type: CCFloat,
        range: [0, 1],
        step: 0.01,
        slide: true,
        visible: function(this: Fog) {
            return this._type !== FogType.LAYERED && this._type !== FogType.LINEAR;
        }
    })
    get fogDensity () {
        return this._fogDensity;
    }

    set fogDensity (val) {
        this._fogDensity = val;
    }

    /**
     * @zh 雾效起始位置，只适用于线性雾
     * @en Global fog start position, only for linear fog
     */
    @property({
        type: CCFloat,
        step: 0.1,
        visible: function(this: Fog) { 
            return this._type === FogType.LINEAR;
        }
    })
    get fogStart () {
        return this._fogStart;
    }

    set fogStart (val) {
        this._fogStart = val;
    }

    /**
     * @zh 雾效结束位置，只适用于线性雾
     * @en Global fog end position, only for linear fog
     */
    @property({
        type: CCFloat,
        step: 0.1,
        visible: function (this: Fog){ 
            return this._type === FogType.LINEAR;
        }
    })
    get fogEnd () {
        return this._fogEnd;
    }

    set fogEnd (val) {
        this._fogEnd = val;
    }

    /**
     * @zh 雾效衰减
     * @en Global fog attenuation
     */
    @property({
        type: CCFloat,
        step: 0.1,
        visible: function (this: Fog){ 
            return this._type !== FogType.LINEAR;
        }
    })
    get fogAtten () {
        return this._fogAtten;
    }

    set fogAtten (val) {
        this._fogAtten = val;
    }

    /**
     * @zh 雾效顶部范围，只适用于层级雾
     * @en Global fog top range, only for layered fog
     */
    @property({
        type: CCFloat,
        step: 0.1,
        visible: function (this: Fog){ 
            return this._type === FogType.LAYERED;
        }
    })
    get fogTop () {
        return this._fogTop;
    }

    set fogTop (val) {
        this._fogTop = val;
    }

    /**
     * @zh 雾效范围，只适用于层级雾
     * @en Global fog range, only for layered fog
     */
    @property({
        type: CCFloat,
        step: 0.1,
        visible: function (this: Fog){ 
            return this._type === FogType.LAYERED;
        }
    })
    get fogRange () {
        return this._fogRange;
    }

    set fogRange (val) {
        this._fogRange = val;
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
    get currType () {
        return this._currType;
    }

    get colorArray (): Float32Array {
        return this._colorArray;
    }

    @property
    protected _type = FogType.LINEAR;
    @property
    protected _fogColor = new Color('#C8C8C8');
    @property
    protected _enabled = false;
    @property
    protected _fogDensity = 0.3;
    @property
    protected _fogStart = 0.5;
    @property
    protected _fogEnd = 300;
    @property
    protected _fogAtten = 5;
    @property
    protected _fogTop = 1.5;
    @property
    protected _fogRange = 1.2;
    private _currType = 0;
    protected _colorArray: Float32Array = new Float32Array([0.2, 0.2, 0.2, 1.0]);

    constructor () {
        Color.toArray(this._colorArray, this._fogColor);
    }

    protected _updatePipeline () {
        const value = this._currType;
        const pipeline = legacyCC.director.root.pipeline;
        if (pipeline.macros.CC_USE_FOG === value) { return; }
        pipeline.macros.CC_USE_FOG = value;
    }
}