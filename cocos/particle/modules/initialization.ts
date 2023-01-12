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
import { GradientRange } from '../gradient-range';
import { Color, lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { particleEmitZAxis } from '../particle-general-function';
import { Space } from '../enum';

@ccclass('cc.InitializationModule')
export class InitializationModule extends ParticleModule {
    /**
     * @zh 粒子初始颜色。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:particle_system.startColor')
    public startColor = new GradientRange();

    @serializable
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSize3D')
    public startSize3D = false;

    /**
     * @zh 粒子初始大小。
     */
    @formerlySerializedAs('startSize')
    @range([0, 1])
    @type(CurveRange)
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeX')
    public startSizeX = new CurveRange();

    /**
     * @zh 粒子初始大小。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeY')
    @visible(function (this: InitializationModule): boolean { return this.startSize3D; })
    public startSizeY = new CurveRange();

    /**
     * @zh 粒子初始大小。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: InitializationModule): boolean { return this.startSize3D; })
    public startSizeZ = new CurveRange();

    /**
     * @zh 粒子初始速度。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(11)
    @tooltip('i18n:particle_system.startSpeed')
    public startSpeed = new CurveRange();

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
    @visible(function (this: InitializationModule): boolean { return this.startRotation3D; })
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
    @visible(function (this: InitializationModule): boolean { return this.startRotation3D; })
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
    @visible(function (this: InitializationModule): boolean { return this.startRotation3D; })
    public startRotationZ = new CurveRange();

    /**
     * @zh 粒子生命周期。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(7)
    @tooltip('i18n:particle_system.startLifetime')
    public startLifetime = new CurveRange();

    public get name (): string {
        return 'InitializationModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.INITIALIZE;
    }

    constructor () {
        super();
        this.startLifetime.constant = 5;
        this.startSizeX.constant = 1;
        this.startSpeed.constant = 5;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const { newParticleIndexStart, newParticleIndexEnd, normalizedTimeInCycle, worldRotation, simulationSpace } = particleUpdateContext;
        const { randomSeed, invStartLifeTime, rotationX, rotationY, rotationZ, startSizeX, startSizeY, startSizeZ, sizeX, sizeY, sizeZ, startColor, color } = particles;
        const velocity = new Vec3();
        if (simulationSpace === Space.WORLD) {
            switch (this.startSpeed.mode) {
            case CurveRange.Mode.Constant:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const curveStartSpeed = this.startSpeed.constant;
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
                    Vec3.transformQuat(velocity, velocity, worldRotation);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.constantMin, this.startSpeed.constantMax, rand);
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
                    Vec3.transformQuat(velocity, velocity, worldRotation);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = this.startSpeed.spline.evaluate(normalizedTimeInCycle) * this.startSpeed.multiplier;
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
                    Vec3.transformQuat(velocity, velocity, worldRotation);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.splineMin.evaluate(normalizedTimeInCycle), this.startSpeed.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSpeed.multiplier;
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
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
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.constantMin, this.startSpeed.constantMax, rand);
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const curveStartSpeed = this.startSpeed.spline.evaluate(normalizedTimeInCycle) * this.startSpeed.multiplier;
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    const curveStartSpeed = lerp(this.startSpeed.splineMin.evaluate(normalizedTimeInCycle), this.startSpeed.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSpeed.multiplier;
                    Vec3.multiplyScalar(velocity, particleEmitZAxis, curveStartSpeed);
                    particles.setVelocityAt(velocity, i);
                }
                break;
            default:
            }
        }
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
                    rotationZ[i] = lerp(this.startRotationZ.splineMin.evaluate(normalizedTimeInCycle), this.startRotationZ.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startLifetime.multiplier;
                }
                break;
            default:
            }
        }

        switch (this.startLifetime.mode) {
        case CurveRange.Mode.Constant:
            // eslint-disable-next-line no-case-declarations
            const lifeTime = 1 / this.startLifetime.constant;
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                invStartLifeTime[i] = lifeTime;
            }
            break;
        case CurveRange.Mode.TwoConstants:
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                invStartLifeTime[i] = 1 / lerp(this.startLifetime.constantMin, this.startLifetime.constantMax, rand);
            }
            break;
        case CurveRange.Mode.Curve:
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                invStartLifeTime[i] = 1 / (this.startLifetime.spline.evaluate(normalizedTimeInCycle) * this.startLifetime.multiplier);
            }
            break;
        case CurveRange.Mode.TwoCurves:
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                invStartLifeTime[i] = 1 / (lerp(this.startLifetime.splineMin.evaluate(normalizedTimeInCycle), this.startLifetime.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startLifetime.multiplier);
            }
            break;
        default:
        }
        for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
            randomSeed[i] = randomRangeInt(0, 233280);
        }
        if (this.startSize3D) {
            switch (this.startSizeX.mode) {
            case CurveRange.Mode.Constant:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    sizeX[i] = startSizeX[i] = this.startSizeX.constant;
                    sizeY[i] = startSizeY[i] = this.startSizeY.constant;
                    sizeZ[i] = startSizeZ[i] = this.startSizeZ.constant;
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeX[i] = startSizeX[i] = lerp(this.startSizeX.constantMin, this.startSizeX.constantMax, rand);
                    sizeY[i] = startSizeY[i] = lerp(this.startSizeY.constantMin, this.startSizeY.constantMax, rand);
                    sizeZ[i] = startSizeZ[i] = lerp(this.startSizeZ.constantMin, this.startSizeZ.constantMax, rand);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    sizeX[i] = startSizeX[i] = this.startSizeX.spline.evaluate(normalizedTimeInCycle) * this.startSizeX.multiplier;
                    sizeY[i] = startSizeY[i] = this.startSizeY.spline.evaluate(normalizedTimeInCycle) * this.startSizeY.multiplier;
                    sizeZ[i] = startSizeZ[i] = this.startSizeZ.spline.evaluate(normalizedTimeInCycle) * this.startSizeZ.multiplier;
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeX[i] = startSizeX[i] = lerp(this.startSizeX.splineMin.evaluate(normalizedTimeInCycle), this.startSizeX.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSizeX.multiplier;
                    sizeY[i] = startSizeY[i] = lerp(this.startSizeY.splineMin.evaluate(normalizedTimeInCycle), this.startSizeY.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSizeY.multiplier;
                    sizeZ[i] = startSizeZ[i] = lerp(this.startSizeZ.splineMin.evaluate(normalizedTimeInCycle), this.startSizeZ.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSizeZ.multiplier;
                }
                break;
            default:
            }
        } else {
            switch (this.startSizeX.mode) {
            case CurveRange.Mode.Constant:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = this.startSizeX.constant;
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = lerp(this.startSizeX.constantMin, this.startSizeX.constantMax, rand);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = this.startSizeX.spline.evaluate(normalizedTimeInCycle) * this.startSizeX.multiplier;
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = lerp(this.startSizeX.splineMin.evaluate(normalizedTimeInCycle), this.startSizeX.splineMax.evaluate(normalizedTimeInCycle), rand) * this.startSizeX.multiplier;
                }
                break;
            default:
            }
        }
        const tempColor = new Color();
        switch (this.startColor.mode) {
        case GradientRange.Mode.Color:
            // eslint-disable-next-line no-case-declarations
            const colorNum = Color.toUint32(this.startColor.color);
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                color[i] = startColor[i] = colorNum;
            }
            break;
        case GradientRange.Mode.Gradient:
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                color[i] = startColor[i] = Color.toUint32(this.startColor.gradient.evaluate(normalizedTimeInCycle));
            }
            break;
        case GradientRange.Mode.TwoColors:
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                color[i] = startColor[i] = Color.toUint32(Color.lerp(tempColor, this.startColor.colorMin, this.startColor.colorMax, rand));
            }
            break;
        case GradientRange.Mode.TwoGradients:
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                color[i] = startColor[i] = Color.toUint32(Color.lerp(tempColor, this.startColor.gradientMin.evaluate(normalizedTimeInCycle), this.startColor.gradientMax.evaluate(normalizedTimeInCycle), rand));
            }
            break;
        case GradientRange.Mode.RandomColor:
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                color[i] = startColor[i] = Color.toUint32(this.startColor.gradient.randomColor());
            }
            break;
        default:
        }
    }
}
