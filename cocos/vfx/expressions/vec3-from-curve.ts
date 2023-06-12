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
import { RealCurve, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { E_NORMALIZED_LOOP_AGE } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { BindingFloatExpression } from './binding-float';
import { ConstantVec3Expression } from './constant-vec3';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

const ratio = new Vec3();

@ccclass('cc.Vec3FromCurveExpression')
export class Vec3FromCurveExpression extends Vec3Expression {
    @type(RealCurve)
    @serializable
    public x = new RealCurve();

    @type(RealCurve)
    @serializable
    public y = new RealCurve();

    @type(RealCurve)
    @serializable
    public z = new RealCurve();

    @type(Vec3Expression)
    @serializable
    public scale: Vec3Expression = new ConstantVec3Expression(1, 1, 1);

    @type(FloatExpression)
    @serializable
    public curveIndex: FloatExpression = new BindingFloatExpression(E_NORMALIZED_LOOP_AGE);

    public get isConstant (): boolean {
        return false;
    }

    constructor (x?: RealCurve, y?: RealCurve, z?: RealCurve) {
        super();
        if (x) {
            this.x = x;
        }
        if (y) {
            this.y = y;
        }
        if (z) {
            this.z = z;
        }
    }

    public tick (parameterMap: VFXParameterMap) {
        this.curveIndex.tick(parameterMap);
        this.scale.tick(parameterMap);
    }

    public bind (parameterMap: VFXParameterMap) {
        this.curveIndex.bind(parameterMap);
        this.scale.bind(parameterMap);
    }

    public evaluate (index: number, out: Vec3) {
        this.scale.evaluate(index, ratio);
        const time = this.curveIndex.evaluate(index);
        out.x = this.x.evaluate(time) * ratio.x;
        out.y = this.y.evaluate(time) * ratio.y;
        out.z = this.z.evaluate(time) * ratio.z;
        return out;
    }

    public evaluateSingle (out: Vec3): Vec3 {
        this.scale.evaluateSingle(ratio);
        const time = this.curveIndex.evaluateSingle();
        out.x = this.x.evaluate(time) * ratio.x;
        out.y = this.y.evaluate(time) * ratio.y;
        out.z = this.z.evaluate(time) * ratio.z;
        return out;
    }
}
