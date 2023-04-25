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
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { VFXEmitterState, ModuleExecContext } from '../base';
import { FloatExpression } from '../expressions/float';
import { lerp, Vec3 } from '../../core';
import { Space } from '../enum';
import { RandomStream } from '../random-stream';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

const gravity = new Vec3();
const requiredParameters = BuiltinParticleParameterFlags.POSITION | BuiltinParticleParameterFlags.BASE_VELOCITY | BuiltinParticleParameterFlags.VELOCITY;
@ccclass('cc.GravityModule')
@VFXModule.register('Gravity', ModuleExecStageFlags.UPDATE, [BuiltinParticleParameterName.VELOCITY])
export class GravityModule extends VFXModule {
    /**
     * @zh 粒子受重力影响的重力系数。
     */
    @type(Vec3Expression)
    @serializable
    @range([-1, 1])
    @displayOrder(13)
    @tooltip('i18n:particle_system.gravityModifier')
    public gravity: Vec3Expression = new ConstantVec3Expression();

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameters(requiredParameters);
        this.gravity.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const { velocity, baseVelocity } = particles;
        const { fromIndex, toIndex, deltaTime } = context;
        const deltaVelocity = 9.8 * deltaTime;
        if (params.simulationSpace === Space.LOCAL) {
            const invRotation = rotationIfNeedTransform;
            if (this.gravityModifier.mode === FloatExpression.Mode.CONSTANT) {
                Vec3.set(gravity, 0, -this.gravityModifier.constant * deltaVelocity, 0);
                Vec3.transformQuat(gravity, gravity, invRotation);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(gravity, i);
                    baseVelocity.addVec3At(gravity, i);
                }
            } else if (this.gravityModifier.mode === FloatExpression.Mode.CURVE) {
                const { spline } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                const normalizedAge = particles.normalizedAge.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.set(gravity, 0, -spline.evaluate(normalizedAge[i]) * multiplier, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                    baseVelocity.addVec3At(gravity, i);
                }
            } else if (this.gravityModifier.mode === FloatExpression.Mode.TWO_CONSTANTS) {
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
                const normalizedAge = particles.normalizedAge.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAge[i];
                    Vec3.set(gravity, 0, -lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(randomSeed[i] + randomOffset)) * multiplier, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                    baseVelocity.addVec3At(gravity, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.gravityModifier.mode === FloatExpression.Mode.CONSTANT) {
                const multiplier = this.gravityModifier.constant * deltaVelocity;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addYAt(-multiplier, i);
                    baseVelocity.addYAt(-multiplier, i);
                }
            } else if (this.gravityModifier.mode === FloatExpression.Mode.CURVE) {
                const { spline } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                const normalizedAge = particles.normalizedAge.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const gravity = -spline.evaluate(normalizedAge[i]) * multiplier;
                    velocity.addYAt(gravity, i);
                    baseVelocity.addYAt(gravity, i);
                }
            } else if (this.gravityModifier.mode === FloatExpression.Mode.TWO_CONSTANTS) {
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
                const normalizedAge = particles.normalizedAge.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAge[i];
                    const gravity = -lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), RandomStream.getFloat(randomSeed[i] + randomOffset)) * multiplier;
                    velocity.addYAt(gravity, i);
                    baseVelocity.addYAt(gravity, i);
                }
            }
        }
    }
}
