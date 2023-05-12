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
import { ModuleExecContext } from '../base';
import { NORMALIZED_AGE, ParticleDataSet, SPAWN_NORMALIZED_TIME } from '../particle-data-set';
import { ModuleExecStage } from '../vfx-module';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

@ccclass('cc.FloatFromCurveExpression')
export class FloatFromCurveExpression extends FloatExpression {
    @type(RealCurve)
    @serializable
    public curve = new RealCurve();

    @type(FloatExpression)
    @serializable
    public scale: FloatExpression = new ConstantFloatExpression(1);

    public curveIndex: FloatExpression = new ConstantFloatExpression(0);

    public get isConstant (): boolean {
        return this.curveIndex.isConstant && this.scale.isConstant;
    }

    private declare _time: Float32Array;

    constructor (curve?: RealCurve) {
        super();
        if (curve) {
            this.curve = curve;
        }
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(context.executionStage === ModuleExecStage.UPDATE
            ? NORMALIZED_AGE : SPAWN_NORMALIZED_TIME);
        this.scale.tick(particles, emitter, user, context);
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this._time = context.executionStage === ModuleExecStage.UPDATE ? particles.getFloatParameter(NORMALIZED_AGE).data : particles.getFloatParameter(SPAWN_NORMALIZED_TIME).data;
        this.scale.bind(particles, emitter, user, context);
    }

    public evaluate (index: number): number {
        return this.curve.evaluate(this._time[index]) * this.scale.evaluate(index);
    }

    public evaluateSingle (): number {
        return this.curve.evaluate(time) * this.scale.evaluateSingle();
    }
}
