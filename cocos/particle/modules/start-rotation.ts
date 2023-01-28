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

import { ccclass, displayOrder, formerlySerializedAs, radian, range, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';
import { lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';

@ccclass('cc.StartRotationModule')
export class StartRotationModule extends ParticleModule {
    @serializable
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotation3D')
    public startRotation3D = false;

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationX')
    @visible(function (this: StartRotationModule): boolean { return this.startRotation3D; })
    public startRotationX = new CurveRange();

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationY')
    @visible(function (this: StartRotationModule): boolean { return this.startRotation3D; })
    public startRotationY = new CurveRange();

    /**
      * @zh 粒子初始旋转角度。
      */
    @type(CurveRange)
    @formerlySerializedAs('startRotation')
    @range([-1, 1])
    @radian
    @displayOrder(12)
    @tooltip('i18n:particle_system.startRotationZ')
    public startRotationZ = new CurveRange();

    public get name (): string {
        return 'StartRotationModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.INITIALIZE;
    }

    public get updatePriority (): number {
        return 1;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const { newParticleIndexStart, newParticleIndexEnd, normalizedTimeInCycle } = particleUpdateContext;
        const { rotationX, rotationY, rotationZ } = particles;
        if (this.startRotation3D) {
            switch (this.startRotationX.mode) {
            case CurveRange.Mode.Constant:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    rotationX[i] = this.startRotationX.constant;
                    rotationY[i] = this.startRotationY.constant;
                    rotationZ[i] = this.startRotationZ.constant;
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotationX[i] = lerp(this.startRotationX.constantMin, this.startRotationX.constantMax, rand);
                    rotationY[i] = lerp(this.startRotationY.constantMin, this.startRotationY.constantMax, rand);
                    rotationZ[i] = lerp(this.startRotationZ.constantMin, this.startRotationZ.constantMax, rand);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    rotationX[i] = this.startRotationX.spline.evaluate(normalizedTimeInCycle) * this.startRotationX.multiplier;
                    rotationY[i] = this.startRotationY.spline.evaluate(normalizedTimeInCycle) * this.startRotationY.multiplier;
                    rotationZ[i] = this.startRotationZ.spline.evaluate(normalizedTimeInCycle) * this.startRotationZ.multiplier;
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotationX[i] = lerp(this.startRotationX.splineMin.evaluate(normalizedTimeInCycle), this.startRotationX.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startRotationX.multiplier;
                    rotationY[i] = lerp(this.startRotationY.splineMin.evaluate(normalizedTimeInCycle), this.startRotationY.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startRotationY.multiplier;
                    rotationZ[i] = lerp(this.startRotationZ.splineMin.evaluate(normalizedTimeInCycle), this.startRotationZ.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startRotationZ.multiplier;
                }
                break;
            default:
            }
        } else {
            switch (this.startRotationZ.mode) {
            case CurveRange.Mode.Constant:
                // eslint-disable-next-line no-case-declarations
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    rotationZ[i] = this.startRotationZ.constant;
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotationZ[i] = lerp(this.startRotationZ.constantMin, this.startRotationZ.constantMax, rand);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    rotationZ[i] = this.startRotationZ.spline.evaluate(normalizedTimeInCycle) * this.startRotationZ.multiplier;
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    rotationZ[i] = lerp(this.startRotationZ.splineMin.evaluate(normalizedTimeInCycle), this.startRotationZ.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startRotationZ.multiplier;
                }
                break;
            default:
            }
        }
    }
}
