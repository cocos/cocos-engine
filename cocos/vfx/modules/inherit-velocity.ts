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

import { ccclass, tooltip, displayOrder, range, type, serializable, visible } from 'cc.decorator';
import { Enum } from '../../core';
import { lerp, Mat4, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { FloatExpression } from '../expression/float-expression';
import { RandomStream } from '../random-stream';

const tempVelocity = new Vec3();
const requiredParameters = BuiltinParticleParameterFlags.POSITION | BuiltinParticleParameterFlags.VELOCITY;
@ccclass('cc.InheritVelocityModule')
@ParticleModule.register('InheritVelocity', ModuleExecStage.UPDATE | ModuleExecStage.SPAWN, [BuiltinParticleParameterName.VELOCITY])
export class InheritVelocityModule extends ParticleModule {
    @type(FloatExpression)
    @visible(true)
    @serializable
    public scale = new FloatExpression();

    private _randomOffset = 0;

    public onPlay (params: ParticleEmitterParams, states: ParticleEmitterState) {
        this._randomOffset = states.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (this.scale.mode === FloatExpression.Mode.TWO_CONSTANTS || this.scale.mode === FloatExpression.Mode.TWO_CURVES) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (this.scale.mode === FloatExpression.Mode.TWO_CURVES || this.scale.mode === FloatExpression.Mode.CURVE) {
            if (context.executionStage !== ModuleExecStage.SPAWN) {
                context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME);
            } else {
                context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
            }
        }
        context.markRequiredBuiltinParameters(requiredParameters);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex, emitterVelocityInEmittingSpace: initialVelocity } = context;
        const velocity = context.executionStage === ModuleExecStage.SPAWN ? particles.baseVelocity : particles.velocity;
        const randomOffset = this._randomOffset;
        if (this.scale.mode === FloatExpression.Mode.CONSTANT) {
            Vec3.multiplyScalar(tempVelocity, initialVelocity, this.scale.constant);
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.addVec3At(tempVelocity, i);
            }
        } else if (this.scale.mode === FloatExpression.Mode.TWO_CONSTANTS) {
            const { constantMin, constantMax } = this.scale;
            const seed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                Vec3.multiplyScalar(tempVelocity, initialVelocity, lerp(constantMin, constantMax, RandomStream.getFloat(seed[i] + randomOffset)));
                velocity.addVec3At(tempVelocity, i);
            }
        } else if (this.scale.mode === FloatExpression.Mode.CURVE) {
            const { spline, multiplier } = this.scale;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            for (let i = fromIndex; i < toIndex; i++) {
                Vec3.multiplyScalar(tempVelocity, initialVelocity, spline.evaluate(normalizedAliveTime[i]) * multiplier);
                velocity.addVec3At(tempVelocity, i);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.scale;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            const seed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                const time = normalizedAliveTime[i];
                Vec3.multiplyScalar(tempVelocity, initialVelocity, lerp(splineMin.evaluate(time), splineMax.evaluate(time), RandomStream.getFloat(seed[i] + randomOffset)) * multiplier);
                velocity.addVec3At(tempVelocity, i);
            }
        }
    }
}
