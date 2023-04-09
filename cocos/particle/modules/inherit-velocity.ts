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
import { calculateTransform } from '../particle-general-function';
import { BuiltinParticleParameter, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';
import { RandomStream } from '../random-stream';

const INHERIT_VELOCITY_RAND = 718231;

const tempVelocity = new Vec3();
@ccclass('cc.InheritVelocityModule')
@ParticleModule.register('InheritVelocity', ModuleExecStage.UPDATE | ModuleExecStage.SPAWN, [BuiltinParticleParameterName.VELOCITY])
export class InheritVelocityModule extends ParticleModule {
    @type(CurveRange)
    @visible(true)
    @serializable
    public scale = new CurveRange();

    private _rand = new RandomStream();

    public onPlay (params: ParticleEmitterParams, states: ParticleEmitterState) {
        this._rand.seed = states.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (this.scale.mode === CurveRange.Mode.TwoConstants || this.scale.mode === CurveRange.Mode.TwoCurves) {
            if (context.executionStage !== ModuleExecStage.SPAWN) {
                context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
            }
        }
        if (this.scale.mode === CurveRange.Mode.TwoCurves || this.scale.mode === CurveRange.Mode.Curve) {
            if (context.executionStage !== ModuleExecStage.SPAWN) {
                context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
            } else {
                context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
            }
        }
        context.markRequiredParameter(BuiltinParticleParameter.POSITION);
        if (context.executionStage !== ModuleExecStage.SPAWN) {
            context.markRequiredParameter(BuiltinParticleParameter.VELOCITY);
        } else {
            context.markRequiredParameter(BuiltinParticleParameter.BASE_VELOCITY);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex, emitterVelocityInEmittingSpace: initialVelocity,
            emitterNormalizedTime: normalizedT, emitterNormalizedPrevTime: normalizedPrevT } = context;
        const velocity = context.executionStage === ModuleExecStage.SPAWN ? particles.baseVelocity : particles.velocity;
        const rand = this._rand;
        if (this.scale.mode === CurveRange.Mode.Constant) {
            Vec3.multiplyScalar(tempVelocity, initialVelocity, this.scale.constant);
            for (let i = fromIndex; i < toIndex; i++) {
                velocity.addVec3At(tempVelocity, i);
            }
        } else if (this.scale.mode === CurveRange.Mode.TwoConstants) {
            const { constantMin, constantMax } = this.scale;
            if (context.executionStage === ModuleExecStage.SPAWN) {
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.multiplyScalar(tempVelocity, initialVelocity, lerp(constantMin, constantMax, rand.getFloat()));
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const seed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.multiplyScalar(tempVelocity, initialVelocity, lerp(constantMin, constantMax, RandomStream.getFloat(seed[i] + INHERIT_VELOCITY_RAND)));
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        } else if (this.scale.mode === CurveRange.Mode.Curve) {
            const { spline, multiplier } = this.scale;
            if (context.executionStage === ModuleExecStage.SPAWN) {
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.multiplyScalar(tempVelocity, initialVelocity, spline.evaluate(lerp(normalizedT, normalizedPrevT, spawnTime[i])) * multiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.multiplyScalar(tempVelocity, initialVelocity, spline.evaluate(normalizedAliveTime[i]) * multiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.scale;
            if (context.executionStage === ModuleExecStage.SPAWN) {
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    Vec3.multiplyScalar(tempVelocity, initialVelocity, lerp(splineMin.evaluate(time), splineMax.evaluate(time), rand.getFloat()) * multiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            } else {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const seed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const time = normalizedAliveTime[i];
                    Vec3.multiplyScalar(tempVelocity, initialVelocity, lerp(splineMin.evaluate(time), splineMax.evaluate(time), RandomStream.getFloat(seed[i] + INHERIT_VELOCITY_RAND)) * multiplier);
                    velocity.addVec3At(tempVelocity, i);
                }
            }
        }
    }
}
