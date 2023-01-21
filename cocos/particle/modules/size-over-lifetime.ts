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

import { ccclass, tooltip, displayOrder, type, serializable, range, visible } from 'cc.decorator';
import { lerp, pseudoRandom, Vec3 } from '../../core/math';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { CurveRange } from '../curve-range';
import { ModuleRandSeed } from '../enum';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';

const SIZE_OVERTIME_RAND_OFFSET = ModuleRandSeed.SIZE;

@ccclass('cc.SizeOverLifetimeModule')
export class SizeOverLifetimeModule extends ParticleModule {
    /**
     * @zh 决定是否在每个轴上独立控制粒子大小。
     */
    @serializable
    @displayOrder(1)
    @tooltip('i18n:sizeOvertimeModule.separateAxes')
    public separateAxes = false;

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中的大小变化。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(2)
    @tooltip('i18n:sizeOvertimeModule.size')
    @visible(function (this: SizeOverLifetimeModule): boolean { return !this.separateAxes; })
    public size = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(3)
    @tooltip('i18n:sizeOvertimeModule.x')
    @visible(function (this: SizeOverLifetimeModule): boolean { return this.separateAxes; })
    public x = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(4)
    @tooltip('i18n:sizeOvertimeModule.y')
    @visible(function (this: SizeOverLifetimeModule): boolean { return this.separateAxes; })
    public y = new CurveRange();

    /**
     * @zh 定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化。
     */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(5)
    @tooltip('i18n:sizeOvertimeModule.z')
    @visible(function (this: SizeOverLifetimeModule): boolean { return this.separateAxes; })
    public z = new CurveRange();

    public get name (): string {
        return 'SizeModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.PRE_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    public update (particles: ParticleSOAData, context: ParticleUpdateContext) {
        const { count, normalizedAliveTime, randomSeed } = particles;
        const size = new Vec3();
        if (!this.separateAxes) {
            switch (this.size.mode) {
            case CurveRange.Mode.Constant:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    particles.setSizeAt(size.multiplyScalar(this.size.constant), i);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    particles.setSizeAt(size.multiplyScalar(this.size.spline.evaluate(normalizedAliveTime[i]) * this.size.multiplier), i);
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    particles.setSizeAt(size.multiplyScalar(lerp(this.size.constantMin, this.size.constantMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET))), i);
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    const currentLife = normalizedAliveTime[i];
                    particles.setSizeAt(size.multiplyScalar(lerp(this.size.splineMin.evaluate(currentLife),
                        this.size.splineMax.evaluate(currentLife),
                        pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * this.size.multiplier), i);
                }
                break;
            default:
            }
        } else {
            switch (this.size.mode) {
            case CurveRange.Mode.Constant:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    particles.setSizeAt(size.multiply3f(this.x.constant, this.y.constant, this.z.constant), i);
                }
                break;
            case CurveRange.Mode.Curve:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    const currentLife = normalizedAliveTime[i];
                    particles.setSizeAt(size.multiply3f(this.x.spline.evaluate(currentLife) * this.x.multiplier,
                        this.y.spline.evaluate(currentLife) * this.y.multiplier,
                        this.z.spline.evaluate(currentLife) * this.z.multiplier), i);
                }
                break;
            case CurveRange.Mode.TwoConstants:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    particles.setSizeAt(size.multiply3f(
                        lerp(this.x.constantMin, this.x.constantMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                        lerp(this.y.constantMin, this.y.constantMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                        lerp(this.z.constantMin, this.z.constantMax, pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)),
                    ), i);
                }
                break;
            case CurveRange.Mode.TwoCurves:
                for (let i = 0; i < count; i++) {
                    particles.getStartSizeAt(size, i);
                    const currentLife = normalizedAliveTime[i];
                    particles.setSizeAt(size.multiply3f(
                        lerp(this.x.splineMin.evaluate(currentLife), this.x.splineMax.evaluate(currentLife), pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * this.x.multiplier,
                        lerp(this.y.splineMin.evaluate(currentLife), this.y.splineMax.evaluate(currentLife), pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * this.y.multiplier,
                        lerp(this.z.splineMin.evaluate(currentLife), this.z.splineMax.evaluate(currentLife), pseudoRandom(randomSeed[i] + SIZE_OVERTIME_RAND_OFFSET)) * this.z.multiplier,
                    ), i);
                }
                break;
            default:
            }
        }
    }
}
