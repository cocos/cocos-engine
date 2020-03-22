/**
 * @hidden
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { lerp } from '../../core/math';
import { Enum } from '../../core/value-types';
import { AnimationCurve } from '../../core/geometry';
import { Texture2D } from '../../core';
import { PixelFormat, Filter, WrapMode } from '../../core/assets/asset-enum';
import { EDITOR } from 'internal:constants';

const SerializableTable = EDITOR && [
    [ "mode", "constant", "multiplier" ],
    [ "mode", "curve", "multiplier" ],
    [ "mode", "curveMin", "curveMax", "multiplier" ],
    [ "mode", "constantMin", "constantMax", "multiplier"]
];

export const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3,
});

@ccclass('cc.CurveRange')
export default class CurveRange  {

    public static Mode = Mode;

    /**
     * @zh 曲线类型[[Mode]]。
     */
    @property({
        type: Mode,
    })
    public mode = Mode.Constant;

    /**
     * @zh 当mode为Curve时，使用的曲线。
     */
    @property({
        type: AnimationCurve,
    })
    public curve = new AnimationCurve();

    /**
     * @zh 当mode为TwoCurves时，使用的曲线下限。
     */
    @property({
        type: AnimationCurve,
    })
    public curveMin = new AnimationCurve();

    /**
     * @zh 当mode为TwoCurves时，使用的曲线上限。
     */
    @property({
        type: AnimationCurve,
    })
    public curveMax = new AnimationCurve();

    /**
     * @zh 当mode为Constant时，曲线的值。
     */
    @property
    public constant = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的上限。
     */
    @property
    public constantMin = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的下限。
     */
    @property
    public constantMax = 0;

    /**
     * @zh 应用于曲线插值的系数。
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
            return cr.curve.evaluate(time);
        case Mode.TwoCurves:
            return index === 0 ? cr.curveMin.evaluate(time) : cr.curveMax.evaluate(time);
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

export function packCurveRangeZ (samples:number, cr: CurveRange) {
    let height = evaluateHeight(cr);
    let data = new Float32Array(samples * height * 4);
    let interval = 1.0 / (samples - 1);
    let sum = 0, average = 0, offset = 0;

    for (let h = 0; h < height; h++) {
        sum = 0;
        for (let j = 0; j < samples; j++) {
            let value = evaluateCurve(cr, interval * j, h);
            sum += value;
            average = sum / (j + 1);
            data[offset + 2] = average;
            offset += 4;
        }
    }
    
    let texture = new Texture2D();
    texture.create(samples, height, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    texture.uploadData(data);

    return texture;
}
export function packCurveRangeN (samples:number, cr: CurveRange) {
    let height = evaluateHeight(cr);
    let data = new Float32Array(samples * height * 4);
    let interval = 1.0 / (samples - 1);
    let sum = 0, average = 0, offset = 0;
    
    for (let h = 0; h < height; h++) {
        sum = 0;
        for (let j = 0; j < samples; j++) {
            let value = evaluateCurve(cr, interval * j, h);
            sum += value;
            average = sum / (j + 1);
            data[offset] = average;
            data[offset + 1] = average;
            data[offset + 2] = average;
            offset += 4;
        }
    }
    
    let texture = new Texture2D();
    texture.create(samples, height, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    texture.uploadData(data);

    return texture;
}

export function packCurveRangeXY (samples: number, x: CurveRange, y: CurveRange) {
    let height = Math.max(evaluateHeight(x), evaluateHeight(y));
    let data = new Float32Array(samples * height * 4);
    let curves: CurveRange[] = [x, y];

    let interval = 1.0 / (samples - 1);

    for (let h = 0; h < height; h++) {
        for (let i = 0; i < 2; i++) {
            let cr = curves[i];
            let sum = 0, average = 0;
            for (let j = 0; j < samples; j++) {
                let value = evaluateCurve(cr, interval * j, h);
                sum += value;
                average = sum / (j + 1);
                data[j * 4 + i] = average;
            }
        }
    }

    let texture = new Texture2D();
    texture.create(samples, height, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    texture.uploadData(data);

    return texture;
}

export function packCurveRangeXYZ (samples: number, x: CurveRange, y: CurveRange, z: CurveRange) {
    let height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z));
    let data = new Float32Array(samples * height * 4);
    let curves: CurveRange[] = [x, y, z];

    let interval = 1.0 / (samples - 1);

    for (let h = 0; h < height; h++) {
        for (let i = 0; i < 3; i++) {
            let cr = curves[i];
            let sum = 0, average = 0;
            for (let j = 0; j < samples; j++) {
                let value = evaluateCurve(cr, interval * j, h);
                sum += value;
                average = sum / (j + 1);
                data[j * 4 + i] = average;
            }
        }
    }

    let texture = new Texture2D();
    texture.create(samples, height, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    texture.uploadData(data);

    return texture;
}

export function packCurveRangeXYZW (samples: number, x: CurveRange, y: CurveRange, z: CurveRange, w: CurveRange) {
    let height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z), evaluateHeight(w));
    let data = new Float32Array(samples * height * 4);
    let curves: CurveRange[] = [x, y, z, w];

    let interval = 1.0 / (samples - 1);

    for (let h = 0; h < height; h++) {
        for (let i = 0; i < 4; i++) {
            let cr = curves[i];
            let sum = 0, average = 0;
            for (let j = 0; j < samples; j++) {
                let value = evaluateCurve(cr, interval * j, h);
                sum += value;
                average = sum / (j + 1);
                data[j * 4 + i] = average;
            }
        }
    }

    let texture = new Texture2D();
    texture.create(samples, height, PixelFormat.RGBA32F);
    texture.setFilters(Filter.NEAREST, Filter.NEAREST);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    texture.uploadData(data);

    return texture;
}


