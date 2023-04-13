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

import { ccclass, range, serializable, tooltip, type } from 'cc.decorator';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { FloatExpression } from '../expression/float-expression';
import { lerp, Vec3 } from '../../core';
import { RandomStream } from '../random-stream';
import { ParticleVec3ArrayParameter } from '../particle-parameter';

const tempVelocity = new Vec3();
const requiredParameter = BuiltinParticleParameterFlags.POSITION | BuiltinParticleParameterFlags.VELOCITY | BuiltinParticleParameterFlags.START_DIR;

@ccclass('cc.AddSpeedInInitialDirectionModule')
@ParticleModule.register('AddSpeedInInitialDirection', ModuleExecStage.SPAWN | ModuleExecStage.UPDATE, [ParameterName.VELOCITY], [ParameterName.START_DIR])
export class AddSpeedInInitialDirectionModule extends ParticleModule {
    /**
      * @zh 粒子初始速度。
      */
    @type(FloatExpression)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:particle_system.startSpeed')
    public speed = new FloatExpression(5);

    private _randomOffset = 0;

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._randomOffset = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredBuiltinParameters(requiredParameter);
        if (this.speed.mode === FloatExpression.Mode.CURVE || this.speed.mode === FloatExpression.Mode.TWO_CURVES) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
        }
        if (this.speed.mode === FloatExpression.Mode.TWO_CURVES || this.speed.mode === FloatExpression.Mode.TWO_CONSTANTS) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (context.executionStage !== ModuleExecStage.UPDATE) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const velocity = context.executionStage === ModuleExecStage.SPAWN ? particles.baseVelocity : particles.velocity;

        const { startDir } = particles;
        const mode = this.speed.mode;
        const randomOffset = this._randomOffset;
        if (mode === FloatExpression.Mode.CONSTANT) {
            const constant = this.speed.constant;
            ParticleVec3ArrayParameter.scaleAndAdd(velocity, velocity, startDir, constant, fromIndex, toIndex);
        } else if (mode ===  FloatExpression.Mode.TWO_CONSTANTS) {
            const { constantMin, constantMax } = this.speed;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + randomOffset));
                startDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                velocity.addVec3At(tempVelocity, i);
            }
        } else if (mode ===  FloatExpression.Mode.CURVE) {
            const { spline, multiplier } = this.speed;
            const normalizedTime = context.executionStage === ModuleExecStage.SPAWN
                ? particles.spawnNormalizedTime.data : particles.normalizedAliveTime.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = spline.evaluate(normalizedTime[i]) * multiplier;
                startDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                velocity.addVec3At(tempVelocity, i);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.speed;
            const randomSeed = particles.randomSeed.data;
            const normalizedTime = context.executionStage === ModuleExecStage.SPAWN
                ? particles.spawnNormalizedTime.data : particles.normalizedAliveTime.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                const time = normalizedTime[i];
                const curveStartSpeed = lerp(splineMin.evaluate(time),
                    splineMax.evaluate(time), RandomStream.getFloat(randomSeed[i] + randomOffset)) * multiplier;
                startDir.getVec3At(tempVelocity, i);
                Vec3.multiplyScalar(tempVelocity, tempVelocity, curveStartSpeed);
                velocity.addVec3At(tempVelocity, i);
            }
        }
    }
}
