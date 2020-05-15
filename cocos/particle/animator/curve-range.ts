/**
 * @hidden
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { lerp } from '../../core/math';
import { Enum } from '../../core/value-types';
import { AnimationCurve } from '../../core/geometry';
import { Texture2D, ImageAsset } from '../../core';
import { PixelFormat, Filter, WrapMode } from '../../core/assets/asset-enum';
import { EDITOR } from 'internal:constants';

const SerializableTable = EDITOR && [
    [ 'mode', 'constant', 'multiplier' ],
    [ 'mode', 'curve', 'multiplier' ],
    [ 'mode', 'curveMin', 'curveMax', 'multiplier' ],
    [ 'mode', 'constantMin', 'constantMax', 'multiplier']
];

export const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3,
});
/**
 * @en The curve range of target value.
 * @zh 目标值的曲线范围
 * @class CurveRange
 */
@ccclass('cc.CurveRange')
export default class CurveRange  {

    public static Mode = Mode;

    /**
     * @en Curve type.
     * @zh 曲线类型。
     * @property {Mode} mode
     */
    @property({
        type: Mode,
    })
    public mode = Mode.Constant;

    /**
     * @en The curve to use when mode is Curve.
     * @zh 当 mode 为 Curve 时，使用的曲线。
     * @property {AnimationCurve} curve
     */
    @property({
        type: AnimationCurve,
    })
    public curve = new AnimationCurve();

    /**
     * @en The lower limit of the curve to use when mode is TwoCurves
     * @zh 当 mode 为 TwoCurves 时，使用的曲线下限。
     * @property {AnimationCurve} curveMin
     */
    @property({
        type: AnimationCurve,
    })
    public curveMin = new AnimationCurve();
    /**
     * @en The upper limit of the curve to use when mode is TwoCurves
     * @zh 当 mode 为 TwoCurves 时，使用的曲线上限。
     * @property {AnimationCurve} curveMax
     */
    @property({
        type: AnimationCurve,
    })
    public curveMax = new AnimationCurve();

    /**
     * @en When mode is Constant, the value of the curve.
     * @zh 当 mode 为 Constant 时，曲线的值。
     * @property {Number} constant
     */
    @property
    public constant = 0;

    /**
     * @en The lower limit of the curve to use when mode is TwoConstants
     * @zh 当 mode 为 TwoConstants 时，曲线的下限。
     * @property {Number} constantMin
     */
    @property
    public constantMin = 0;

    /**
     * @en The upper limit of the curve to use when mode is TwoConstants
     * @zh 当 mode 为 TwoConstants 时，曲线的上限。
     * @property {Number} constantMax
     */
    @property
    public constantMax = 0;

    /**
     * @en Coefficients applied to curve interpolation.
     * @zh 应用于曲线插值的系数。
     * @property {Number} multiplier
     */
    @property
    public multiplier = 1;

    constructor () {

    }

    public evaluate (time: number, rndRatio: number) {
        switch (this.mode) {
            case Mode.Constant:
                return this.constant;
            case Mode.Curve:
                return this.curve.evaluate(time) * this.multiplier;
            case Mode.TwoCurves:
                return lerp(this.curveMin.evaluate(time), this.curveMax.evaluate(time), rndRatio) * this.multiplier;
            case Mode.TwoConstants:
                return lerp(this.constantMin, this.constantMax, rndRatio);
        }
    }

    public getMax (): number {
        switch (this.mode) {
            case Mode.Constant:
                return this.constant;
            case Mode.Curve:
                return this.multiplier;
            case Mode.TwoConstants:
                return this.constantMax;
            case Mode.TwoCurves:
                return this.multiplier;
        }
        return 0;
    }

    public _onBeforeSerialize (props) {
        return SerializableTable[this.mode];
    }
}

function evaluateCurve (cr: CurveRange, time: number, index: number) {
    switch (cr.mode) {
        case Mode.Constant:
            return cr.constant;
        case Mode.Curve:
            return cr.curve.evaluate(time) * cr.multiplier;
        case Mode.TwoCurves:
            return index === 0 ? cr.curveMin.evaluate(time) * cr.multiplier : cr.curveMax.evaluate(time) * cr.multiplier;
        case Mode.TwoConstants:
            return index === 0 ? cr.constantMin : cr.constantMax;
        default:
            return 0;
    }
}

function evaluateHeight (cr: CurveRange) {
    switch (cr.mode) {
        case Mode.TwoConstants:
            return 2;
        case Mode.TwoCurves:
            return 2;
        default:
            return 1;
    }
}

function packTexture (data, width, height) {
    const image = new ImageAsset({
        width,
        height,
        _data: data,
        _compressed: false,
        format: PixelFormat.RGBA32F,
    });

    const texture = new Texture2D();
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setMipFilter(Filter.NONE);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    texture.image = image;

    return texture;
}

export function packCurveRangeZ (samples:number, cr: CurveRange, discrete?: boolean) {
    const height = evaluateHeight(cr);
    const data = new Float32Array(samples * height * 4);
    const interval = 1.0 / (samples - 1);
    let sum = 0;
    let average = 0;
    let offset = 0;

    for (let h = 0; h < height; h++) {
        sum = 0;
        for (let j = 0; j < samples; j++) {
            const value = evaluateCurve(cr, interval * j, h);
            if (discrete) {
                average = value;
            } else {
                sum += value;
                average = sum / (j + 1);
            }
            data[offset + 2] = value;
            offset += 4;
        }
    }
    return packTexture(data, samples, height);
}
export function packCurveRangeN (samples:number, cr: CurveRange, discrete?: boolean) {
    const height = evaluateHeight(cr);
    const data = new Float32Array(samples * height * 4);
    const interval = 1.0 / (samples - 1);
    let sum = 0;
    let average = 0;
    let offset = 0;
    for (let h = 0; h < height; h++) {
        sum = 0;
        for (let j = 0; j < samples; j++) {
            const value = evaluateCurve(cr, interval * j, h);
            if (discrete) {
                average = value;
            } else {
                sum += value;
                average = sum / (j + 1);
            }
            data[offset] = average;
            data[offset + 1] = average;
            data[offset + 2] = average;
            offset += 4;
        }
    }
    return packTexture(data, samples, height);
}

export function packCurveRangeXY (samples: number, x: CurveRange, y: CurveRange, discrete?: boolean) {
    const height = Math.max(evaluateHeight(x), evaluateHeight(y));
    const data = new Float32Array(samples * height * 4);
    const curves: CurveRange[] = [x, y];
    const interval = 1.0 / (samples - 1);

    for (let h = 0; h < height; h++) {
        for (let i = 0; i < 2; i++) {
            const cr = curves[i];
            let sum = 0;
            let average = 0;
            for (let j = 0; j < samples; j++) {
                const value = evaluateCurve(cr, interval * j, h);
                if (discrete) {
                    average = value;
                } else {
                    sum += value;
                    average = sum / (j + 1);
                }
                data[j * 4 + i] = average;
            }
        }
    }
    return packTexture(data, samples, height);
}

export function packCurveRangeXYZ (samples: number, x: CurveRange, y: CurveRange, z: CurveRange, discrete?: boolean) {
    const height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z));
    const data = new Float32Array(samples * height * 4);
    const curves: CurveRange[] = [x, y, z];
    const interval = 1.0 / (samples - 1);

    for (let h = 0; h < height; h++) {
        for (let i = 0; i < 3; i++) {
            const cr = curves[i];
            let sum = 0;
            let average = 0;
            for (let j = 0; j < samples; j++) {
                const value = evaluateCurve(cr, interval * j, h);
                if (discrete) {
                    average = value;
                } else {
                    sum += value;
                    average = sum / (j + 1);
                }
                data[j * 4 + i] = average;
            }
        }
    }
    return packTexture(data, samples, height);
}

export function packCurveRangeXYZW (samples: number, x: CurveRange, y: CurveRange, z: CurveRange, w: CurveRange, discrete?: boolean) {
    const height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z), evaluateHeight(w));
    const data = new Float32Array(samples * height * 4);
    const curves: CurveRange[] = [x, y, z, w];
    const interval = 1.0 / (samples - 1);

    for (let h = 0; h < height; h++) {
        for (let i = 0; i < 4; i++) {
            const cr = curves[i];
            let sum = 0;
            let average = 0;
            for (let j = 0; j < samples; j++) {
                const value = evaluateCurve(cr, interval * j, h);
                if (discrete) {
                    average = value;
                } else {
                    sum += value;
                    average = sum / (j + 1);
                }
                data[j * 4 + i] = average;
            }
        }
    }
    return packTexture(data, samples, height);
}
