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
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';
import { approx, EPSILON, lerp, pseudoRandom, Quat, Vec3 } from '../../core/math';
import { Space } from '../enum';

const GRAVITY_RAND_OFFSET = 238818;
@ccclass('cc.GravityModule')
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

    public get name (): string {
        return 'GravityModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.PRE_UPDATE;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const { simulationSpace, deltaTime, worldRotation } = particleUpdateContext;
        const { count, normalizedAliveTime, randomSeed, velocityY } = particles;
        const deltaVelocity = 9.8 * deltaTime;
        if (simulationSpace === Space.LOCAL) {
            const invRotation = Quat.conjugate(new Quat(), worldRotation);
            const deltaVelocity = 9.8 * deltaTime;
            const gravity = new Vec3();
            const gravityInLocalSpace = new Vec3();
            switch (this.gravityModifier.mode) {
            case CurveRange.Mode.Constant: {
                for (let i = 0; i < count; i++) {
                    gravity.y = -this.gravityModifier.constant * deltaVelocity;
                    Vec3.transformQuat(gravityInLocalSpace, gravity, invRotation);
                    particles.addVelocityAt(gravityInLocalSpace, i);
                }
                break;
            }
            case CurveRange.Mode.Curve: {
                for (let i = 0; i < count; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    gravity.y = -this.gravityModifier.spline.evaluate(normalizedTime) * this.gravityModifier.multiplier * deltaVelocity;
                    Vec3.transformQuat(gravityInLocalSpace, gravity, invRotation);
                    particles.addVelocityAt(gravityInLocalSpace, i);
                }
                break;
            }
            case CurveRange.Mode.TwoConstants: {
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i] + GRAVITY_RAND_OFFSET;
                    gravity.y = -lerp(this.gravityModifier.constantMin, this.gravityModifier.constantMax, pseudoRandom(seed)) * deltaVelocity;
                    Vec3.transformQuat(gravityInLocalSpace, gravity, invRotation);
                    particles.addVelocityAt(gravityInLocalSpace, i);
                }
                break;
            }
            case CurveRange.Mode.TwoCurves: {
                for (let i = 0; i < count; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    const seed = randomSeed[i] + GRAVITY_RAND_OFFSET;
                    gravity.y = -lerp(this.gravityModifier.splineMin.evaluate(normalizedTime), this.gravityModifier.splineMax.evaluate(normalizedTime), pseudoRandom(seed)) * this.gravityModifier.multiplier * deltaVelocity;
                    Vec3.transformQuat(gravityInLocalSpace, gravity, invRotation);
                    particles.addVelocityAt(gravityInLocalSpace, i);
                }
                break;
            }
            default:
            }
        } else {
            switch (this.gravityModifier.mode) {
            case CurveRange.Mode.Constant: {
                for (let i = 0; i < count; i++) {
                    velocityY[i] -= this.gravityModifier.constant * deltaVelocity;
                }
                break;
            }
            case CurveRange.Mode.Curve: {
                for (let i = 0; i < count; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    velocityY[i] -= this.gravityModifier.spline.evaluate(normalizedTime) * this.gravityModifier.multiplier * deltaVelocity;
                }
                break;
            }
            case CurveRange.Mode.TwoConstants: {
                for (let i = 0; i < count; i++) {
                    const seed = randomSeed[i] + GRAVITY_RAND_OFFSET;
                    velocityY[i] -= lerp(this.gravityModifier.constantMin, this.gravityModifier.constantMax, pseudoRandom(seed)) * deltaVelocity;
                }
                break;
            }
            case CurveRange.Mode.TwoCurves: {
                for (let i = 0; i < count; i++) {
                    const normalizedTime = normalizedAliveTime[i];
                    const seed = randomSeed[i] + GRAVITY_RAND_OFFSET;
                    velocityY[i] -= lerp(this.gravityModifier.splineMin.evaluate(normalizedTime), this.gravityModifier.splineMax.evaluate(normalizedTime), pseudoRandom(seed)) * this.gravityModifier.multiplier * deltaVelocity;
                }
                break;
            }
            default:
            }
        }
    }
}
