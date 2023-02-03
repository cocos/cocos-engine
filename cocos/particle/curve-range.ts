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
import { approx, lerp } from '../core/math';
import { Enum } from '../core/value-types';
import { constructLegacyCurveAndConvert } from '../core/geometry/curve';
import { RealCurve, CCClass } from '../core';

const setClassAttr = CCClass.Attr.setClassAttr;

const SerializableTable = [
    ['_mode', 'constant'],
    ['_mode', '_spline', 'constant'],
    ['_mode', '_splineMin', '_spline', 'constant'],
    ['_mode', 'constantMin', 'constant'],
] as const;

export const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3,
});
// TODO: can not remove ccclass for now, we need ccclass specified deserialization to handle deserialization of RealCurve
@ccclass('cc.CurveRange')
export class CurveRange  {
    public static Mode = Mode;

    /**
     * @zh 曲线类型[[Mode]]。
     */
    public get mode () {
        return this._mode;
    }

    public set mode (val) {
        if (val !== this._mode) {
            switch (val) {
            case Mode.TwoCurves:
            case Mode.Curve:
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

    private _mode = Mode.Constant;
    private _spline: RealCurve | null = null;
    private _splineMin: RealCurve | null = null;

    constructor () {

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
        return this.constant;
    }

    protected _onBeforeSerialize (props) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return SerializableTable[this.mode];
    }
}

CCClass.fastDefine('cc.CurveRange', CurveRange, {
    constantMin: 0,
    constant: 0,
    _mode: Mode.Constant,
    _splineMin: null,
    _spline: null,
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
