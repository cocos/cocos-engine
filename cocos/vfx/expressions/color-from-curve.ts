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
import { Color, Gradient, serializable } from '../../core';
import { ccclass, type } from '../../core/data/decorators';
import { ContextDataSet, ParticleDataSet, EmitterDataSet, UserDataSet } from '../data-set';
import { ColorExpression } from './color';
import { FloatExpression } from './float';
import { BindingFloatExpression } from './binding-float';
import { E_NORMALIZED_LOOP_AGE } from '../define';

@ccclass('cc.ColorFromCurveExpression')
export class ColorFromCurveExpression extends ColorExpression {
    @type(Gradient)
    @serializable
    public curve = new Gradient();

    @type(FloatExpression)
    @serializable
    public curveIndex: FloatExpression = new BindingFloatExpression(E_NORMALIZED_LOOP_AGE);

    public get isConstant (): boolean {
        return this.curveIndex.isConstant;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        this.curveIndex.tick(particles, emitter, user, context);
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        this.curveIndex.bind(particles, emitter, user, context);
    }

    public evaluateSingle (out: Color) {
        this.curve.evaluateFast(out, this.curveIndex.evaluateSingle());
        return out;
    }

    public evaluate (index: number, out: Color) {
        this.curve.evaluateFast(out, this.curveIndex.evaluate(index));
        return out;
    }
}
