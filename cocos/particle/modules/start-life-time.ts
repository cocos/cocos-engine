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
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleData } from '../particle-data';
import { ParticleExecContext, ParticleEmitterParams } from '../particle-base';
import { CurveRange } from '../curve-range';
import { GradientRange } from '../gradient-range';
import { Color, lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';

@ccclass('cc.StartLifeTimeModule')
@ParticleModule.register('StartLifeTime', ModuleExecStage.SPAWN, 1)
export class StartLifeTimeModule extends ParticleModule {
    /**
      * @zh 粒子生命周期。
      */
    @type(CurveRange)
    @serializable
    @range([0, 1])
    @displayOrder(7)
    @tooltip('i18n:particle_system.startLifetime')
    public startLifetime = new CurveRange(5);

    public execute (particles: ParticleData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { invStartLifeTime } = particles;
        const { fromIndex, toIndex, normalizedTimeInCycle } = context;
        if (this.startLifetime.mode === CurveRange.Mode.Constant) {
            const lifeTime = 1 / this.startLifetime.constant;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = lifeTime;
            }
        } else if (this.startLifetime.mode ===  CurveRange.Mode.TwoConstants) {
            const { constantMin, constantMax } = this.startLifetime;
            for (let i = fromIndex; i < toIndex; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                invStartLifeTime[i] = 1 / lerp(constantMin, constantMax, rand);
            }
        } else if (this.startLifetime.mode ===  CurveRange.Mode.Curve) {
            const { spline, multiplier } = this.startLifetime;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = 1 / (spline.evaluate(normalizedTimeInCycle) * multiplier);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.startLifetime;
            for (let i = fromIndex; i < toIndex; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                invStartLifeTime[i] = 1 / (lerp(splineMin.evaluate(normalizedTimeInCycle), splineMax.evaluate(normalizedTimeInCycle), rand) * multiplier);
            }
        }
    }
}
