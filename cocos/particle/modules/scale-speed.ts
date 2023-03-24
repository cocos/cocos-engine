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

import { lerp, pseudoRandom } from '../../core';
import { ccclass, displayOrder, range, serializable, tooltip, type } from '../../core/data/decorators';
import { CurveRange } from '../curve-range';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const SPEED_MODIFIER_RAND_OFFSET = 388180;

@ccclass('cc.ScaleSpeedModule')
@ParticleModule.register('ScaleSpeed', ModuleExecStage.UPDATE, ['AddVelocity', 'Force', 'Gravity'], ['State', 'Solve'])
export class ScaleSpeedModule extends ParticleModule {
    /**
     * @zh 速度修正系数。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(5)
    @tooltip('i18n:velocityOvertimeModule.speedModifier')
    public scalar = new CurveRange(1);

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (this.scalar.mode === CurveRange.Mode.Curve || this.scalar.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        }
        if (this.scalar.mode === CurveRange.Mode.TwoConstants || this.scalar.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (!particles.hasParameter(BuiltinParticleParameter.VELOCITY)) {
            return;
        }
        const { velocity }  = particles;
        const { fromIndex, toIndex } = context;
        if (this.scalar.mode === CurveRange.Mode.Constant) {
            const constant = this.scalar.constant;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.multiply1fAt(constant, i);
            }
        } else if (this.scalar.mode === CurveRange.Mode.Curve) {
            const { spline, multiplier } = this.scalar;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.multiply1fAt(spline.evaluate(normalizedAliveTime[i]) * multiplier, i);
            }
        } else if (this.scalar.mode === CurveRange.Mode.TwoConstants) {
            const randomSeed = particles.randomSeed.data;
            const { constantMin, constantMax } = this.scalar;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.multiply1fAt(lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + SPEED_MODIFIER_RAND_OFFSET)), i);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.scalar;
            const randomSeed = particles.randomSeed.data;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAliveTime[i];
                velocity.multiply1fAt(lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), pseudoRandom(randomSeed[i] + SPEED_MODIFIER_RAND_OFFSET)) * multiplier, i);
            }
        }
    }
}
