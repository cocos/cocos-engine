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

import { Enum } from '../../value-types';
import { Color } from '../../math';
import { legacyCC } from '../../global-exports';
import { FogInfo } from '../../scene-graph/scene-globals';

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

const FOG_TYPE_NONE = FogType.LAYERED + 1;

export class Fog {
    /**
     * @zh 是否启用全局雾效
     * @en Enable global fog
     */
    set enabled (val: boolean) {
        this._enabled = val;
        if (!val) this._type = FOG_TYPE_NONE;
        val ? this.activate() : this._updatePipeline();
    }

    get enabled (): boolean {
        return this._enabled;
    }

    /**
     * @zh 全局雾颜色
     * @en Global fog color
     */
    set fogColor (val: Color) {
        this._fogColor.set(val);
        Color.toArray(this._colorArray, this._fogColor);
    }

    get fogColor () {
        return this._fogColor;
    }

    /**
     * @zh 当前雾化类型。
     * @en The current global fog type.
     * @returns {FogType}
     * Returns the current global fog type
     * - -1:Disable global Fog
     * - 0:Linear fog
     * - 1:Exponential fog
     * - 2:Exponential square fog
     * - 3:Layered fog
     */
    get type (): number {
        return this._type;
    }
    set type (val: number) {
        this._type = this.enabled ? val : FOG_TYPE_NONE;
        if (this.enabled) this._updatePipeline();
    }

    /**
     * @zh 全局雾浓度
     * @en Global fog density
     */
    get fogDensity (): number {
        return this._fogDensity;
    }

    set fogDensity (val: number) {
        this._fogDensity = val;
    }
    /**
     * @zh 雾效起始位置，只适用于线性雾
     * @en Global fog start position, only for linear fog
     */
    get fogStart (): number {
        return this._fogStart;
    }

    set fogStart (val: number) {
        this._fogStart = val;
    }

    /**
     * @zh 雾效结束位置，只适用于线性雾
     * @en Global fog end position, only for linear fog
     */
    get fogEnd (): number {
        return this._fogEnd;
    }

    set fogEnd (val: number) {
        this._fogEnd = val;
    }

    /**
     * @zh 雾效衰减
     * @en Global fog attenuation
     */
    get fogAtten (): number {
        return this._fogAtten;
    }

    set fogAtten (val: number) {
        this._fogAtten = val;
    }

    /**
     * @zh 雾效顶部范围，只适用于层级雾
     * @en Global fog top range, only for layered fog
     */
    get fogTop (): number {
        return this._fogTop;
    }

    set fogTop (val: number) {
        this._fogTop = val;
    }

    /**
     * @zh 雾效范围，只适用于层级雾
     * @en Global fog range, only for layered fog
     */
    get fogRange (): number {
        return this._fogRange;
    }

    set fogRange (val: number) {
        this._fogRange = val;
    }
    get colorArray (): Float32Array {
        return this._colorArray;
    }
    protected _fogColor = new Color('#C8C8C8');
    protected _colorArray: Float32Array = new Float32Array([0.2, 0.2, 0.2, 1.0]);
    protected _enabled = false;
    protected _type = 0;
    protected _fogDensity = 0.3;
    protected _fogStart = 0.5;
    protected _fogEnd = 300;
    protected _fogAtten = 5;
    protected _fogTop = 1.5;
    protected _fogRange = 1.2;

    public initialize (fogInfo : FogInfo) {
        this.fogColor = fogInfo.fogColor;
        this._enabled = fogInfo.enabled;
        this._type = this.enabled ? fogInfo.type : FOG_TYPE_NONE;
        this.fogDensity = fogInfo.fogDensity;
        this.fogStart = fogInfo.fogStart;
        this.fogEnd = fogInfo.fogEnd;
        this.fogAtten = fogInfo.fogAtten;
        this.fogTop = fogInfo.fogTop;
        this.fogRange = fogInfo.fogRange;
    }

    public activate () {
        this._updatePipeline();
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root;
        const value = this.enabled ? this.type : FOG_TYPE_NONE;
        const pipeline = root.pipeline;
        if (pipeline.macros.CC_USE_FOG === value) { return; }
        pipeline.macros.CC_USE_FOG = value;
        root.onGlobalPipelineStateChanged();
    }
}

legacyCC.Fog = Fog;
