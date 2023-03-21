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
import { ParticleData } from '../particle-data';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { CurveRange } from '../curve-range';
import { approx, EPSILON, lerp, pseudoRandom, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';

const rotation = new Quat();
const gravity = new Vec3();
const GRAVITY_RAND_OFFSET = 238818;
@ccclass('cc.GravityModule')
@ParticleModule.register('Gravity', ModuleExecStage.UPDATE, 5)
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

    public execute (particles: ParticleData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { worldRotation } = context;
        const { velocity } = particles;
        const normalizedAliveTime = particles.normalizedAliveTime.data;
        const randomSeed = particles.randomSeed.data;
        const { fromIndex, toIndex, deltaTime } = context;
        const deltaVelocity = 9.8 * deltaTime;
        if (params.simulationSpace === Space.LOCAL) {
            const invRotation = Quat.conjugate(rotation, worldRotation);
            if (this.gravityModifier.mode === CurveRange.Mode.Constant) {
                Vec3.set(gravity, 0, -this.gravityModifier.constant * deltaVelocity, 0);
                Vec3.transformQuat(gravity, gravity, invRotation);
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.addVec3At(gravity, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.Curve) {
                const { spline } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.set(gravity, 0, -spline.evaluate(normalizedAliveTime[i]) * multiplier, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.gravityModifier;
                for (let i = fromIndex; i < toIndex; i++) {
                    Vec3.set(gravity, 0, -lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + GRAVITY_RAND_OFFSET)) * deltaVelocity, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                }
            } else {
                const { splineMin, splineMax } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    Vec3.set(gravity, 0, -lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), pseudoRandom(randomSeed[i] + GRAVITY_RAND_OFFSET)) * multiplier, 0);
                    Vec3.transformQuat(gravity, gravity, invRotation);
                    velocity.addVec3At(gravity, i);
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.gravityModifier.mode === CurveRange.Mode.Constant) {
                const multiplier = this.gravityModifier.constant * deltaVelocity;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.add3fAt(0, -multiplier, 0, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.Curve) {
                const { spline } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.add3fAt(0, -spline.evaluate(normalizedAliveTime[i]) * multiplier, 0, i);
                }
            } else if (this.gravityModifier.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin, constantMax } = this.gravityModifier;
                for (let i = fromIndex; i < toIndex; i++) {
                    velocity.add3fAt(0, -lerp(constantMin, constantMax, pseudoRandom(randomSeed[i] + GRAVITY_RAND_OFFSET)) * deltaVelocity, 0, i);
                }
            } else {
                const { splineMin, splineMax } = this.gravityModifier;
                const multiplier = this.gravityModifier.multiplier * deltaVelocity;
                for (let i = fromIndex; i < toIndex; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    velocity.add3fAt(0, -lerp(splineMin.evaluate(normalizedTime), splineMax.evaluate(normalizedTime), pseudoRandom(randomSeed[i] + GRAVITY_RAND_OFFSET)) * multiplier, 0, i);
                }
            }
        }
    }
}
