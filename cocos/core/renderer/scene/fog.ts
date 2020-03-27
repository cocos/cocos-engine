import { RenderScene } from './render-scene';
import { Enum } from '../../value-types';

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

export class Fog {
    protected _enabled = false;
    protected _fogColor = Float32Array.from([0.6, 0.6, 0.6, 1.0]);
    protected _fogDensity = 0.3;
    protected _type = FogType.LINEAR;
    protected _fogStart = 0;
    protected _fogEnd = 300;
    protected _fogAtten = 5;
    protected _fogTop = 1.5;
    protected _fogRange = 1.2;
    protected _scene: RenderScene;
    
    private _currType = 0;
    /**
     * @zh
     * 当前雾化类型。
     * @returns {FogType}
     * 返回当前全局雾类型
     * - 0:不使用雾化
     * - 1:使用线性雾
     * - 2:使用指数雾
     * - 3:使用指数平方雾
     * - 4:使用层叠雾
     * @en
     * The current global fog type.
     * @returns {FogType}
     * Returns the current global fog type
     * - 0:Disable global Fog
     * - 1:Linear fog
     * - 2:Exponential fog
     * - 3:Exponential square fog
     * - 4:Layered fog
    */
    get currType() {
        return this._currType;
    }

    constructor (scene: RenderScene) {
        this._scene = scene;
    }

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

    set type(val: any) {
        this._type = val;
        if (!this.enabled) {
            return;
        }
        this._currType = val + 1;
        this._updatePipeline();
    }

    get type() {
        return this._type;
    }

    set fogColor (val: Float32Array) {
        this._fogColor = val;
    }

    get fogColor (): Float32Array {
        return this._fogColor;
    }

    get fogDensity () {
        return this._fogDensity;
    }

    set fogDensity (val) {
        this._fogDensity = val;
    }

    get fogStart() {
        return this._fogStart;
    }

    protected _updatePipeline () {
        const value = this._currType;
        const pipeline = this._scene!.root.pipeline;
        if (pipeline.macros.CC_USE_FOG === value) { return; }
        pipeline.macros.CC_USE_FOG = value;
        this._scene!.onGlobalPipelineStateChanged();
    }

    set fogStart(val) {
        this._fogStart = val;
    }

    get fogEnd() {
        return this._fogEnd;
    }

    set fogEnd(val) {
        this._fogEnd = val;
    }

    get fogAtten() {
        return this._fogAtten;
    }

    set fogAtten(val) {
        this._fogAtten = val;
    }

    get fogTop() {
        return this._fogTop;
    }

    set fogTop(val) {
        this._fogTop = val;
    }

    get fogRange() {
        return this._fogRange;
    }

    set fogRange(val) {
        this._fogRange = val;
    }
}