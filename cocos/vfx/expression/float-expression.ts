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

import { ccclass, type, serializable, editable, formerlySerializedAs } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { approx, lerp } from '../../core/math';
import { Enum } from '../../core/value-types';
import { constructLegacyCurveAndConvert } from '../../core/geometry/curve';
import { RealCurve, CCClass, RealKeyframeValue } from '../../core';

const setClassAttr = CCClass.Attr.setClassAttr;

export enum FloatExpressionMode {
    CONSTANT,
    CURVE,
    TWO_CURVES,
    TWO_CONSTANTS,
}
// TODO: can not remove ccclass for now, we need ccclass specified deserialization to handle deserialization of RealCurve
@ccclass('cc.FloatExpression')
export class FloatExpression  {
    public static Mode = FloatExpressionMode;

    /**
     * @zh 曲线类型[[Mode]]。
     */
    public get mode () {
        return this._mode;
    }

    public set mode (val) {
        if (val !== this._mode) {
            switch (val) {
            case FloatExpressionMode.TWO_CURVES:
            case FloatExpressionMode.CURVE:
                if (approx(this.multiplier, 0)) { this.multiplier = 1; }
                break;
            default:
                break;
            }
            this._mode = val;
        }
    }

    /**
     * @zh 当mode为Curve时，使用的曲线。
     */
    public get spline () {
        if (!this._spline) {
            this._spline = constructLegacyCurveAndConvert();
        }
        return this._spline;
    }

    public set spline (val) {
        this._spline = val;
    }

    public get splineMin () {
        if (!this._splineMin) {
            this._splineMin = constructLegacyCurveAndConvert();
        }
        return this._splineMin;
    }

    public set splineMin (val) {
        this._splineMin = val;
    }

    /**
     * @zh 当mode为TwoCurves时，使用的曲线上限。
     */
    public get splineMax () {
        return this.spline;
    }

    public set splineMax (val) {
        this.spline = val;
    }

    /**
     * @zh 当mode为TwoConstants时，曲线的上限。
     */
    public get constantMax () {
        return this.constant;
    }

    public set constantMax (val) {
        this.constant = val;
    }

    /**
     * @zh 应用于曲线插值的系数。
     */
    public get multiplier () {
        return this.constant;
    }

    public set multiplier (val) {
        this.constant = val;
    }

    /**
     * @zh 当mode为Constant时，曲线的值。
     */
    public constant = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的下限。
     */
    public constantMin = 0;

    private _mode = FloatExpressionMode.CONSTANT;
    private _spline: RealCurve | null = null;
    private _splineMin: RealCurve | null = null;

    constructor ();
    constructor (scalar: number);
    constructor (scalar: number, minScaler: number);
    constructor (scalar: number, spline: RealCurve);
    constructor (scalar: number, spline: RealCurve, minSpline: RealCurve)
    constructor (scalar = 0, splineOrMinScalar?: RealCurve | number, minSpline?: RealCurve) {
        this.constant = scalar;
        if (typeof splineOrMinScalar === 'number') {
            this.mode = FloatExpressionMode.TWO_CONSTANTS;
            this.constantMin = splineOrMinScalar;
        } else if (typeof splineOrMinScalar === 'object') {
            this.spline = splineOrMinScalar;
            if (typeof minSpline === 'object') {
                this.mode = FloatExpressionMode.TWO_CURVES;
                this.splineMin = minSpline;
            } else {
                this.mode = FloatExpressionMode.CURVE;
            }
        }
    }

    public evaluate (time: number, rndRatio: number) {
        switch (this.mode) {
        default:
        case FloatExpressionMode.CONSTANT:
            return this.constant;
        case FloatExpressionMode.CURVE:
            return this.spline.evaluate(time) * this.multiplier;
        case FloatExpressionMode.TWO_CURVES:
            return lerp(this.splineMin.evaluate(time), this.splineMax.evaluate(time), rndRatio) * this.multiplier;
        case FloatExpressionMode.TWO_CONSTANTS:
            return lerp(this.constantMin, this.constantMax, rndRatio);
        }
    }

    public getScalar (): number {
        return this.constant;
    }

    protected _onBeforeSerialize (props) {
        switch (this._mode) {
        case FloatExpressionMode.CONSTANT:
            return ['mode', 'constant'];
        case FloatExpressionMode.CURVE:
            return ['mode', 'spline', 'multiplier'];
        case FloatExpressionMode.TWO_CURVES:
            return ['mode', 'splineMin', 'splineMax', 'multiplier'];
        case FloatExpressionMode.TWO_CONSTANTS:
            return ['mode', 'constantMin', 'constantMax'];
        default:
            return [];
        }
    }
}

CCClass.fastDefine('cc.FloatExpression', FloatExpression, {
    multiplier: 0,
    constant: 0,
    constantMin: 0,
    constantMax: 0,
    mode: FloatExpressionMode.CONSTANT,
    spline: null,
    splineMin: null,
    splineMax: null,
});

setClassAttr(FloatExpression, 'multiplier', 'visible', true);
setClassAttr(FloatExpression, 'multiplier', 'hasSetter', true);
setClassAttr(FloatExpression, 'multiplier', 'hasGetter', true);
setClassAttr(FloatExpression, 'constantMax', 'visible', true);
setClassAttr(FloatExpression, 'constantMax', 'hasSetter', true);
setClassAttr(FloatExpression, 'constantMax', 'hasGetter', true);
setClassAttr(FloatExpression, 'constantMin', 'visible', true);
setClassAttr(FloatExpression, 'constant', 'visible', true);
setClassAttr(FloatExpression, 'mode', 'type', 'Enum');
setClassAttr(FloatExpression, 'mode', 'enumList', Enum.getList(Enum(FloatExpressionMode)));
setClassAttr(FloatExpression, 'mode', 'visible', true);
setClassAttr(FloatExpression, 'mode', 'hasSetter', true);
setClassAttr(FloatExpression, 'mode', 'hasGetter', true);
setClassAttr(FloatExpression, 'splineMax', 'type', 'Object');
setClassAttr(FloatExpression, 'splineMax', 'ctor', RealCurve);
setClassAttr(FloatExpression, 'splineMax', 'visible', true);
setClassAttr(FloatExpression, 'splineMax', 'hasGetter', true);
setClassAttr(FloatExpression, 'splineMax', 'hasSetter', true);
setClassAttr(FloatExpression, 'splineMin', 'type', 'Object');
setClassAttr(FloatExpression, 'splineMin', 'ctor', RealCurve);
setClassAttr(FloatExpression, 'splineMin', 'visible', true);
setClassAttr(FloatExpression, 'splineMin', 'hasGetter', true);
setClassAttr(FloatExpression, 'splineMin', 'hasSetter', true);
setClassAttr(FloatExpression, 'spline', 'type', 'Object');
setClassAttr(FloatExpression, 'spline', 'ctor', RealCurve);
setClassAttr(FloatExpression, 'spline', 'visible', true);
setClassAttr(FloatExpression, 'spline', 'hasGetter', true);
setClassAttr(FloatExpression, 'spline', 'hasSetter', true);

export function createRealCurve (keyframes: Iterable<[number,  number | Partial<RealKeyframeValue>]>) {
    const curve = new RealCurve();
    curve.assignSorted(keyframes);
    return curve;
}
