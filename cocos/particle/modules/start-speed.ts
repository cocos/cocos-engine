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
import { lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';

const velocity = new Vec3();

@ccclass('cc.StartSpeedModule')
export class StartSpeedModule extends ParticleModule {
    /**
      * @zh 粒子初始速度。
      */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(11)
    @tooltip('i18n:particle_system.startSpeed')
    public startSpeed = new CurveRange();

    public get name (): string {
        return 'StartSpeedModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.INITIALIZE;
    }

    public get updatePriority (): number {
        return 1;
    }

    constructor () {
        super();
        this.startSpeed.constant = 5;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const { newParticleIndexStart, newParticleIndexEnd, normalizedTimeInCycle, worldRotation, simulationSpace } = particleUpdateContext;
        if (simulationSpace === Space.WORLD) {
            switch (this.startSpeed.mode) {
            case CurveRange.Mode.Constant:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const curveStartSpeed = this.startSpeed.constant;
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    Vec3.transformQuat(velocity, velocity, worldRotation);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.constantMin, this.startSpeed.constantMax, rand);
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    Vec3.transformQuat(velocity, velocity, worldRotation);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const curveStartSpeed = this.startSpeed.spline.evaluate(normalizedTimeInCycle) * this.startSpeed.multiplier;
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    Vec3.transformQuat(velocity, velocity, worldRotation);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.splineMin.evaluate(normalizedTimeInCycle), this.startSpeed.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSpeed.multiplier;
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    Vec3.transformQuat(velocity, velocity, worldRotation);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            default:
            }
        } else {
            switch (this.startSpeed.mode) {
            case CurveRange.Mode.Constant:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const curveStartSpeed = this.startSpeed.constant;
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.constantMin, this.startSpeed.constantMax, rand);
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const curveStartSpeed = this.startSpeed.spline.evaluate(normalizedTimeInCycle) * this.startSpeed.multiplier;
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.splineMin.evaluate(normalizedTimeInCycle), this.startSpeed.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSpeed.multiplier;
                    particles.getVelocityAt(velocity, i);
                    Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            default:
            }
        }
    }
}
