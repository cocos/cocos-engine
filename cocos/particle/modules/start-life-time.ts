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
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { CurveRange } from '../curve-range';
import { GradientRange } from '../gradient-range';
import { Color, lerp, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';
import { RandNumGen } from '../rand-num-gen';

@ccclass('cc.StartLifeTimeModule')
@ParticleModule.register('StartLifeTime', ModuleExecStage.SPAWN)
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

    private _rand = new RandNumGen();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.INV_START_LIFETIME);
        if (this.startLifetime.mode === CurveRange.Mode.Curve || this.startLifetime.mode === CurveRange.Mode.TwoCurves) {
            context.markRequiredParameter(BuiltinParticleParameter.SPAWN_NORMALIZED_TIME);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const invStartLifeTime = particles.invStartLifeTime.data;
        const { fromIndex, toIndex } = context;
        if (this.startLifetime.mode === CurveRange.Mode.Constant) {
            const lifeTime = 1 / this.startLifetime.constant;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = lifeTime;
            }
        } else if (this.startLifetime.mode ===  CurveRange.Mode.TwoConstants) {
            const { constantMin, constantMax } = this.startLifetime;
            const rand = this._rand;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = 1 / lerp(constantMin, constantMax, rand.getFloat());
            }
        } else if (this.startLifetime.mode ===  CurveRange.Mode.Curve) {
            const { spline, multiplier } = this.startLifetime;
            const spawnTime = particles.spawnNormalizedTime.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = 1 / (spline.evaluate(spawnTime[i]) * multiplier);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.startLifetime;
            const spawnTime = particles.spawnNormalizedTime.data;
            const rand = this._rand;
            for (let i = fromIndex; i < toIndex; ++i) {
                const normalizedT = spawnTime[i];
                invStartLifeTime[i] = 1 / (lerp(splineMin.evaluate(normalizedT), splineMax.evaluate(normalizedT), rand.getFloat()) * multiplier);
            }
        }
    }
}
