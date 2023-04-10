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

import { ccclass, displayOrder, range, serializable, tooltip, type } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';
import { approx, EPSILON, lerp, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';
import { RandomStream } from '../random-stream';

const gravity = new Vec3();
const requiredParameters = BuiltinParticleParameterFlags.POSITION | BuiltinParticleParameterFlags.BASE_VELOCITY | BuiltinParticleParameterFlags.VELOCITY;
@ccclass('cc.GravityModule')
@ParticleModule.register('Gravity', ModuleExecStage.UPDATE, [BuiltinParticleParameterName.VELOCITY])
export class GravityModule extends ParticleModule {
    /**
     * @zh 粒子受重力影响的重力系数。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(13)
    @tooltip('i18n:particle_system.gravityModifier')
    public gravityModifier = new CurveRange();

    private _randomOffset = 0;

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._randomOffset = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredBuiltinParameters(requiredParameters);
        if (this.gravityModifier.mode === CurveRange.Mode.Curve || this.gravityModifier.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME);
        }
        if (this.gravityModifier.mode === CurveRange.Mode.TwoConstants || this.gravityModifier.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { rotationIfNeedTransform } = context;
        const { velocity, baseVelocity } = particles;
        const { fromIndex, toIndex, deltaTime } = context;
        const randomOffset = this._randomOffset;
        const deltaVelocity = 9.8 * deltaTime;
        if (params.simulationSpace === Space.LOCAL) {
            const invRotation = rotationIfNeedTransform;
            if (this.gravityModifier.mode === CurveRange.Mode.Constant) {
                Vec3.set(gravity, 0, -this.gravityModifier.constant * deltaVelocity, 0);
                Vec3.transformQuat(gravity, gravity, invRotation);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(gravity, i);
                    baseVelocity.addVec3At(gravity, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.Curve) {
                const { spline } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.set(gravity, 0, -spline.evaluate(normalizedAliveTime[i]) * multiplier, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                    baseVelocity.addVec3At(gravity, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.TwoConstants) {
                const randomSeed = particles.randomSeed.data;
                const { constantMin, constantMax } = this.gravityModifier;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.set(gravity, 0, -lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + randomOffset)) * deltaVelocity, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                    baseVelocity.addVec3At(gravity, i);
                }
            } else {
                const { splineMin, splineMax } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    Vec3.set(gravity, 0, -lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(randomSeed[i] + randomOffset)) * multiplier, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                    baseVelocity.addVec3At(gravity, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.gravityModifier.mode === CurveRange.Mode.Constant) {
                const multiplier = this.gravityModifier.constant * deltaVelocity;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addYAt(-multiplier, i);
                    baseVelocity.addYAt(-multiplier, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.Curve) {
                const { spline } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const gravity = -spline.evaluate(normalizedAliveTime[i]) * multiplier;
                    velocity.addYAt(gravity, i);
                    baseVelocity.addYAt(gravity, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.TwoConstants) {
                const randomSeed = particles.randomSeed.data;
                const { constantMin, constantMax } = this.gravityModifier;
                for (let i = fromIndex; i < toIndex; i++) {
                    const gravity = -lerp(constantMin, constantMax, RandomStream.getFloat(randomSeed[i] + randomOffset)) * deltaVelocity;
                    velocity.addYAt(gravity, i);
                    baseVelocity.addYAt(gravity, i);
                }
            } else {
                const { splineMin, splineMax } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    const gravity = -lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(randomSeed[i] + randomOffset)) * multiplier;
                    velocity.addYAt(gravity, i);
                    baseVelocity.addYAt(gravity, i);
                }
            }
        }
    }
}
