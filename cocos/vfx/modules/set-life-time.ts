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

import { ccclass, displayOrder, range, serializable, tooltip, type } from 'cc.decorator';
import { ParticleModule, ModuleExecStageFlags } from '../particle-module';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { FloatExpression } from '../expressions/float';
import { lerp } from '../../core';
import { RandomStream } from '../random-stream';

@ccclass('cc.SetLifeTimeModule')
@ParticleModule.register('SetLifeTime', ModuleExecStageFlags.SPAWN)
export class SetLifeTimeModule extends ParticleModule {
    /**
      * @zh 粒子生命周期。
      */
    @type(FloatExpression)
    @serializable
    @range([0, 1])
    @displayOrder(7)
    @tooltip('i18n:particle_system.startLifetime')
    public lifetime = new FloatExpression(5);

    private _rand = new RandomStream();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = Math.imul(state.randomStream.getUInt32(), state.randomStream.getUInt32());
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.INV_START_LIFETIME);
        if (this.lifetime.mode === FloatExpression.Mode.CURVE || this.lifetime.mode === FloatExpression.Mode.TWO_CURVES) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const invStartLifeTime = particles.invStartLifeTime.data;
        const { fromIndex, toIndex } = context;
        if (this.lifetime.mode === FloatExpression.Mode.CONSTANT) {
            const lifeTime = 1 / this.lifetime.constant;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = lifeTime;
            }
        } else if (this.lifetime.mode ===  FloatExpression.Mode.TWO_CONSTANTS) {
            const { constantMin, constantMax } = this.lifetime;
            const rand = this._rand;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = 1 / lerp(constantMin, constantMax, rand.getFloat());
            }
        } else if (this.lifetime.mode ===  FloatExpression.Mode.CURVE) {
            const { spline, multiplier } = this.lifetime;
            const spawnTime = particles.spawnNormalizedTime.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                invStartLifeTime[i] = 1 / (spline.evaluate(spawnTime[i]) * multiplier);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.lifetime;
            const spawnTime = particles.spawnNormalizedTime.data;
            const rand = this._rand;
            for (let i = fromIndex; i < toIndex; ++i) {
                const time = spawnTime[i];
                invStartLifeTime[i] = 1 / (lerp(splineMin.evaluate(time), splineMax.evaluate(time), rand.getFloat()) * multiplier);
            }
        }
    }
}
