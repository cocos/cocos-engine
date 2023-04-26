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

import { ccclass, displayOrder, range, serializable, tooltip, type } from 'cc.decorator';
import { lerp } from '../../core';
import { FloatExpression } from '../expressions/float';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { VFXEmitterParams, ModuleExecContext } from '../base';
import { RandomStream } from '../random-stream';

const SPEED_MODIFIER_RAND_OFFSET = 388180;

@ccclass('cc.ScaleSpeedModule')
@VFXModule.register('ScaleSpeed', ModuleExecStageFlags.UPDATE, [BuiltinParticleParameterName.VELOCITY], [BuiltinParticleParameterName.VELOCITY])
export class ScaleSpeedModule extends VFXModule {
    /**
     * @zh 速度修正系数。
     */
    @type(FloatExpression)
    @serializable
    @range([-1, 1])
    @displayOrder(5)
    @tooltip('i18n:velocityOvertimeModule.speedModifier')
    public scalar = new FloatExpression(1);

    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        if (this.scalar.mode === FloatExpression.Mode.CURVE || this.scalar.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_AGE);
        }
        if (this.scalar.mode === FloatExpression.Mode.TWO_CONSTANTS || this.scalar.mode === FloatExpression.Mode.TWO_CURVES) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (!particles.hasParameter(BuiltinParticleParameter.VELOCITY)) {
            return;
        }
        const { velocity }  = particles;
        const { fromIndex, toIndex } = context;
        if (this.scalar.mode === FloatExpression.Mode.CONSTANT) {
            const constant = this.scalar.constant;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.multiply1fAt(constant, i);
            }
        } else if (this.scalar.mode === FloatExpression.Mode.CURVE) {
            const { spline, multiplier } = this.scalar;
            const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.multiply1fAt(spline.evaluate(normalizedAge[i]) * multiplier, i);
            }
        } else if (this.scalar.mode === FloatExpression.Mode.TWO_CONSTANTS) {
            const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
            const { constantMin, constantMax } = this.scalar;
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.multiply1fAt(lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + SPEED_MODIFIER_RAND_OFFSET)), i);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.scalar;
            const randomSeed = particles.getUint32Parameter(RANDOM_SEED).data;
            const normalizedAge = particles.getFloatParameter(NORMALIZED_AGE).data;
            for (let i = fromIndex; i < toIndex; i++) {
                const normalizedTime = normalizedAge[i];
                velocity.multiply1fAt(lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(randomSeed[i] + SPEED_MODIFIER_RAND_OFFSET)) * multiplier, i);
            }
        }
    }
}
