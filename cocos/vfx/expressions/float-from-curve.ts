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
import { RealCurve } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { BindingFloatExpression } from './binding-float';
import { E_NORMALIZED_LOOP_AGE } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

@ccclass('cc.FloatFromCurveExpression')
export class FloatFromCurveExpression extends FloatExpression {
    @type(RealCurve)
    @serializable
    public curve = new RealCurve();

    @type(FloatExpression)
    @serializable
    public scale: FloatExpression = new ConstantFloatExpression(1);

    @type(FloatExpression)
    @serializable
    public curveIndex: FloatExpression = new BindingFloatExpression(E_NORMALIZED_LOOP_AGE);

    public get isConstant (): boolean {
        return this.curveIndex.isConstant && this.scale.isConstant;
    }

    constructor (curve?: RealCurve) {
        super();
        if (curve) {
            this.curve = curve;
        }
    }

    public tick (parameterMap: VFXParameterMap) {
        this.scale.tick(parameterMap);
        this.curveIndex.tick(parameterMap);
    }

    public bind (parameterMap: VFXParameterMap) {
        this.curveIndex.bind(parameterMap);
        this.scale.bind(parameterMap);
    }

    public evaluate (index: number): number {
        return this.curve.evaluate(this.curveIndex.evaluate(index)) * this.scale.evaluate(index);
    }

    public evaluateSingle (): number {
        return this.curve.evaluate(this.curveIndex.evaluateSingle()) * this.scale.evaluateSingle();
    }
}
