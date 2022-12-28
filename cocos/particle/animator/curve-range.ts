/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { lerp, RealCurve, CCClass, geometry, Enum } from '../../core';
import { PixelFormat, Filter, WrapMode } from '../../asset/assets/asset-enum';
import { Texture2D, ImageAsset } from '../../asset/assets';

const setClassAttr = CCClass.Attr.setClassAttr;

const SerializableTable = [
    ['mode', 'constant', 'multiplier'],
    ['mode', 'spline', 'multiplier'],
    ['mode', 'splineMin', 'splineMax', 'multiplier'],
    ['mode', 'constantMin', 'constantMax', 'multiplier'],
] as const;

export const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3,
});
// TODO: can not remove ccclass for now, we need ccclass specified deserialization to handle deserialization of RealCurve
@ccclass('cc.CurveRange')
export default class CurveRange  {
    public static Mode = Mode;

    /**
     * @zh 当mode为Curve时，spline创建1个RealCurve，当mode为TwoCurves时，splineMax创建1个RealCurve,splineMin创建一个RealCurve
     */
    set mode (mode:number) {
        this._mode = mode;
        switch (mode) {
        case Mode.Constant:
            break;
        case Mode.TwoConstants:
            break;
        case Mode.Curve:
            if (!this.spline) this.spline = geometry.constructLegacyCurveAndConvert();
            break;
        case Mode.TwoCurves:
            if (!this.splineMax) this.splineMax = geometry.constructLegacyCurveAndConvert();
            if (!this.splineMin) this.splineMin = geometry.constructLegacyCurveAndConvert();
            break;
        default:
            break;
        }
    }
    get mode () {
        return this._mode;
    }
    /**
     * @zh 当mode为Curve时，使用的曲线。
     */
    public declare spline:RealCurve;

    /**
     * @zh 当mode为TwoCurves时，使用的曲线下限。
     */
    public declare splineMin:RealCurve;

    /**
     * @zh 当mode为TwoCurves时，使用的曲线上限。
     */
    public declare splineMax:RealCurve;

    /**
     * @zh 当mode为Curve时，使用的曲线。
     * @deprecated Since V3.3. Use `spline` instead.
     */
    get curve () {
        return this._curve ??= new geometry.AnimationCurve(this.spline);
    }

    set curve (value) {
        this._curve = value;
        this.spline = value._internalCurve;
    }

    /**
     * @zh 当mode为TwoCurves时，使用的曲线下限。
     * @deprecated Since V3.3. Use `splineMin` instead.
     */
    get curveMin () {
        return this._curveMin ??= new geometry.AnimationCurve(this.splineMin);
    }

    set curveMin (value) {
        this._curveMin = value;
        this.splineMin = value._internalCurve;
    }

    /**
     * @zh 当mode为TwoCurves时，使用的曲线上限。
     * @deprecated Since V3.3. Use `splineMax` instead.
     */
    get curveMax () {
        return this._curveMax ??= new geometry.AnimationCurve(this.splineMax);
    }

    set curveMax (value) {
        this._curveMax = value;
        this.splineMax = value._internalCurve;
    }

    /**
     * @zh 当mode为Constant时，曲线的值。
     */
    public constant = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的上限。
     */
    public constantMin = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的下限。
     */
    public constantMax = 0;

    /**
     * @zh 应用于曲线插值的系数。
     */
    public multiplier = 1;

    /**
     * @zh 曲线类型[[Mode]]。
     */
    private _mode = Mode.Constant;

    constructor () {
        /* Only create RealCurves in Editor, in order to show the Splines in Editor,
        in RunTime the RealCurves will only be created when it is in Curve mode*/
        if (EDITOR) {
            this.spline = geometry.constructLegacyCurveAndConvert();
            this.splineMin = geometry.constructLegacyCurveAndConvert();
            this.splineMax = geometry.constructLegacyCurveAndConvert();
        }
    }

    public evaluate (time: number, rndRatio: number) {
        switch (this.mode) {
        default:
        case Mode.Constant:
            return this.constant;
        case Mode.Curve:
            return this.spline.evaluate(time) * this.multiplier;
        case Mode.TwoCurves:
            return lerp(this.splineMin.evaluate(time), this.splineMax.evaluate(time), rndRatio) * this.multiplier;
        case Mode.TwoConstants:
            return lerp(this.constantMin, this.constantMax, rndRatio);
        }
    }

    public getMax (): number {
        switch (this.mode) {
        default:
        case Mode.Constant:
            return this.constant;
        case Mode.Curve:
            return this.multiplier;
        case Mode.TwoConstants:
            return this.constantMax;
        case Mode.TwoCurves:
            return this.multiplier;
        }
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _onBeforeSerialize (props) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return SerializableTable[this.mode];
    }

    private declare _curve: geometry.AnimationCurve | undefined;
    private declare _curveMin: geometry.AnimationCurve | undefined;
    private declare _curveMax: geometry.AnimationCurve | undefined;
}

CCClass.fastDefine('cc.CurveRange', CurveRange, {
    multiplier: 1,
    constantMax: 0,
    constantMin: 0,
    constant: 0,
    mode: Mode.Constant,
    splineMax: Object.freeze(geometry.constructLegacyCurveAndConvert()),
    splineMin: Object.freeze(geometry.constructLegacyCurveAndConvert()),
    spline: Object.freeze(geometry.constructLegacyCurveAndConvert()),
});

setClassAttr(CurveRange, 'multiplier', 'visible', true);
setClassAttr(CurveRange, 'constantMax', 'visible', true);
setClassAttr(CurveRange, 'constantMin', 'visible', true);
setClassAttr(CurveRange, 'constant', 'visible', true);
setClassAttr(CurveRange, 'mode', 'type', 'Enum');
setClassAttr(CurveRange, 'mode', 'enumList', Enum.getList(Mode));
setClassAttr(CurveRange, 'mode', 'visible', true);
setClassAttr(CurveRange, 'splineMax', 'type', 'Object');
setClassAttr(CurveRange, 'splineMax', 'ctor', RealCurve);
setClassAttr(CurveRange, 'splineMax', 'visible', true);
setClassAttr(CurveRange, 'splineMin', 'type', 'Object');
setClassAttr(CurveRange, 'splineMin', 'ctor', RealCurve);
setClassAttr(CurveRange, 'splineMin', 'visible', true);
setClassAttr(CurveRange, 'spline', 'type', 'Object');
setClassAttr(CurveRange, 'spline', 'ctor', RealCurve);
setClassAttr(CurveRange, 'spline', 'visible', true);

function evaluateCurve (cr: CurveRange, time: number, index: number) {
    switch (cr.mode) {
    case Mode.Constant:
        return cr.constant;
    case Mode.Curve:
        return cr.spline.evaluate(time) * cr.multiplier;
    case Mode.TwoCurves:
        return index === 0 ? cr.splineMin.evaluate(time) * cr.multiplier : cr.splineMax.evaluate(time) * cr.multiplier;
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

function updateTexture (tex: Texture2D | null, data, width, height): Texture2D {
    if (tex === null || width !== tex.width || height !== tex.height) {
        if (tex) {
            tex.destroy();
        }
        tex = packTexture(data, width, height);
    } else {
        tex.uploadData(data);
    }
    return tex;
}

export function packCurveRangeZ (tex: Texture2D | null, data: Float32Array | null, samples:number, cr: CurveRange, discrete?: boolean) {
    const height = evaluateHeight(cr);
    const len = samples * height * 4;
    if (data === null || data.length !== len) {
        data = new Float32Array(samples * height * 4);
    }
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
    return { texture: updateTexture(tex, data, samples, height), texdata: data };
}
export function packCurveRangeN (tex: Texture2D | null, data: Float32Array | null, samples:number, cr: CurveRange, discrete?: boolean) {
    const height = evaluateHeight(cr);
    const len = samples * height * 4;
    if (data === null || data.length !== len) {
        data = new Float32Array(samples * height * 4);
    }
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
    return { texture: updateTexture(tex, data, samples, height), texdata: data };
}

// eslint-disable-next-line max-len
export function packCurveRangeXY (tex: Texture2D | null, data: Float32Array | null, samples: number, x: CurveRange, y: CurveRange, discrete?: boolean) {
    const height = Math.max(evaluateHeight(x), evaluateHeight(y));
    const len = samples * height * 4;
    if (data === null || data.length !== len) {
        data = new Float32Array(samples * height * 4);
    }
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
                data[((h * samples) + j) * 4 + i] = average;
            }
        }
    }
    return { texture: updateTexture(tex, data, samples, height), texdata: data };
}

// eslint-disable-next-line max-len
export function packCurveRangeXYZ (tex: Texture2D | null, data: Float32Array | null, samples: number, x: CurveRange, y: CurveRange, z: CurveRange, discrete?: boolean) {
    const height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z));
    const len = samples * height * 4;
    if (data === null || data.length !== len) {
        data = new Float32Array(samples * height * 4);
    }
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
                data[((h * samples) + j) * 4 + i] = average;
            }
        }
    }
    return { texture: updateTexture(tex, data, samples, height), texdata: data };
}

// eslint-disable-next-line max-len
export function packCurveRangeXYZW (tex: Texture2D | null, data: Float32Array | null, samples: number, x: CurveRange, y: CurveRange, z: CurveRange, w: CurveRange, discrete?: boolean) {
    const height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z), evaluateHeight(w));
    const len = samples * height * 4;
    if (data === null || data.length !== len) {
        data = new Float32Array(samples * height * 4);
    }
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
                data[((h * samples) + j) * 4 + i] = average;
            }
        }
    }
    return { texture: updateTexture(tex, data, samples, height), texdata: data };
}
