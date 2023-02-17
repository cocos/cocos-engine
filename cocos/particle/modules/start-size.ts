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
import { InitializationModule, ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';
import { GradientRange } from '../gradient-range';
import { Color, lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';

@ccclass('cc.StartSizeModule')
export class StartSizeModule extends InitializationModule {
    @serializable
    @tooltip('i18n:particle_system.startSize3D')
    public startSize3D = false;

    /**
      * @zh 粒子初始大小。
      */
    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public startSizeX = new CurveRange(1);

    @range([0, 1])
    @type(CurveRange)
    @tooltip('i18n:particle_system.startSizeX')
    @visible(function (this: StartSizeModule): boolean { return !this.startSize3D; })
    public get startSize () {
        return this.startSizeX;
    }

    public set startSize (val) {
        this.startSizeX = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeY')
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public get startSizeY () {
        if (!this._startSizeY) {
            this._startSizeY = new CurveRange(1);
        }
        return this._startSizeY;
    }

    public set startSizeY (val) {
        this._startSizeY = val;
    }

    /**
      * @zh 粒子初始大小。
      */
    @type(CurveRange)
    @range([0, 1])
    @tooltip('i18n:particle_system.startSizeZ')
    @visible(function (this: StartSizeModule): boolean { return this.startSize3D; })
    public get startSizeZ () {
        if (!this._startSizeZ) {
            this._startSizeZ = new CurveRange(1);
        }
        return this._startSizeZ;
    }

    public set startSizeZ (val) {
        this._startSizeZ = val;
    }

    public get name (): string {
        return 'StartSizeModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.INITIALIZE;
    }

    public get updatePriority (): number {
        return 1;
    }

    @serializable
    private _startSizeY: CurveRange | null = null;
    @serializable
    private _startSizeZ: CurveRange | null = null;

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, t: number) {
        const normalizedTimeInCycle = t / params.duration;
        const { startSizeX, startSizeY, startSizeZ, sizeX, sizeY, sizeZ } = particles;
        if (this.startSize3D) {
            if (this.startSizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.startSizeX.constant;
                const constantY = this.startSizeY.constant;
                const constantZ = this.startSizeZ.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    sizeX[i] = startSizeX[i] = constantX;
                    sizeY[i] = startSizeY[i] = constantY;
                    sizeZ[i] = startSizeZ[i] = constantZ;
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.startSizeX;
                const { constantMin: yMin, constantMax: yMax } = this.startSizeY;
                const { constantMin: zMin, constantMax: zMax } = this.startSizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeX[i] = startSizeX[i] = lerp(xMin, xMax, rand);
                    sizeY[i] = startSizeY[i] = lerp(yMin, yMax, rand);
                    sizeZ[i] = startSizeZ[i] = lerp(zMin, zMax, rand);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.startSizeX;
                const { spline: yCurve, multiplier: yMultiplier } = this.startSizeY;
                const { spline: zCurve, multiplier: zMultiplier } = this.startSizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    sizeX[i] = startSizeX[i] = xCurve.evaluate(normalizedTimeInCycle) * xMultiplier;
                    sizeY[i] = startSizeY[i] = yCurve.evaluate(normalizedTimeInCycle) * yMultiplier;
                    sizeZ[i] = startSizeZ[i] = zCurve.evaluate(normalizedTimeInCycle) * zMultiplier;
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.startSizeX;
                const { splineMin: yMin, splineMax: yMax, multiplier: yMultiplier } = this.startSizeY;
                const { splineMin: zMin, splineMax: zMax, multiplier: zMultiplier } = this.startSizeZ;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeX[i] = startSizeX[i] = lerp(xMin.evaluate(normalizedTimeInCycle), xMax.evaluate(normalizedTimeInCycle), rand) * xMultiplier;
                    sizeY[i] = startSizeY[i] = lerp(yMin.evaluate(normalizedTimeInCycle), yMax.evaluate(normalizedTimeInCycle), rand) * yMultiplier;
                    sizeZ[i] = startSizeZ[i] = lerp(zMin.evaluate(normalizedTimeInCycle), zMax.evaluate(normalizedTimeInCycle), rand) * zMultiplier;
                }
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (this.startSizeX.mode === CurveRange.Mode.Constant) {
                const constantX = this.startSizeX.constant;
                for (let i = fromIndex; i < toIndex; ++i) {
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = constantX;
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.TwoConstants) {
                const { constantMin: xMin, constantMax: xMax } = this.startSizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = lerp(xMin, xMax, rand);
                }
            } else if (this.startSizeX.mode === CurveRange.Mode.Curve) {
                const { spline: xCurve, multiplier: xMultiplier } = this.startSizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = xCurve.evaluate(normalizedTimeInCycle) * xMultiplier;
                }
            } else {
                const { splineMin: xMin, splineMax: xMax, multiplier: xMultiplier } = this.startSizeX;
                for (let i = fromIndex; i < toIndex; ++i) {
                    const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                    sizeY[i] = startSizeY[i] = sizeX[i] = startSizeX[i] = lerp(xMin.evaluate(normalizedTimeInCycle), xMax.evaluate(normalizedTimeInCycle), rand) * xMultiplier;
                }
            }
        }
    }

    protected needsFilterSerialization () {
        return true;
    }

    protected getSerializedProps () {
        if (!this.startSize3D) {
            return ['startSize3D', 'startSizeX'];
        } else {
            return ['startSize3D', 'startSizeX', '_startSizeZ', '_startSizeZ'];
        }
    }
}
