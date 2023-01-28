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
import { Space } from '../enum';

@ccclass('cc.StartSizeModule')
export class StartSizeModule extends ParticleModule {
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
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public startSizeY = new CurveRange();

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(10)
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public startSizeZ = new CurveRange();

    public get name (): string {
        return 'StartSizeModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.INITIALIZE;
    }

    public get updatePriority (): number {
        return 1;
    }

    constructor () {
        super();
        this.startSizeX.constant = 1;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const { newParticleIndexStart, newParticleIndexEnd, normalizedTimeInCycle } = particleUpdateContext;
        const { startSizeX, startSizeY, startSizeZ, sizeX, sizeY, sizeZ } = particles;
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
    }
}
