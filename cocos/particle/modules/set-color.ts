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
import { BuiltinParticleParameter, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleExecContext, ParticleEmitterParams, ParticleEmitterState } from '../particle-base';
import { GradientRange } from '../gradient-range';
import { clamp01, Color, lerp, Vec3 } from '../../core/math';
import { RandNumGen } from '../rand-num-gen';

const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();

const COLOR_RAND_SEED = 1767123;

@ccclass('cc.SetColorModule')
@ParticleModule.register('SetColor', ModuleExecStage.SPAWN, [ParameterName.COLOR], [ParameterName.NORMALIZED_ALIVE_TIME])
export class SetColorModule extends ParticleModule {
    /**
      * @zh 粒子初始颜色。
      */
    @type(GradientRange)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:particle_system.baseColor')
    public color = new GradientRange();

    private _rand = new RandNumGen();

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._rand.seed = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredParameter(BuiltinParticleParameter.COLOR);
        context.markRequiredParameter(BuiltinParticleParameter.BASE_COLOR);
        if (this.color.mode === GradientRange.Mode.Gradient || this.color.mode === GradientRange.Mode.TwoGradients) {
            if (context.executionStage === ModuleExecStage.SPAWN) {
                context.markRequiredParameter(BuiltinParticleParameter.SPAWN_TIME_RATIO);
            } else {
                context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
            }
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const color = context.executionStage === ModuleExecStage.SPAWN ? particles.baseColor.data : particles.color.data;
        const { fromIndex, toIndex, emitterNormalizedTime: normalizedT, emitterNormalizedPrevTime: normalizedPrevT } = context;
        const rand = this._rand;
        if (this.color.mode === GradientRange.Mode.Color) {
            const colorNum = Color.toUint32(this.color.color);
            for (let i = fromIndex; i < toIndex; i++) {
                color[i] = colorNum;
            }
        } else if (this.color.mode === GradientRange.Mode.Gradient) {
            const { gradient } = this.color;
            if (context.executionStage === ModuleExecStage.SPAWN) {
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex, num = 0; i < toIndex; i++, num++) {
                    color[i] = Color.toUint32(gradient.evaluate(tempColor, lerp(normalizedT, normalizedPrevT, spawnTime[i])));
                }
            } else {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                for (let i = fromIndex, num = 0; i < toIndex; i++, num++) {
                    color[i] = Color.toUint32(gradient.evaluate(tempColor, normalizedAliveTime[i]));
                }
            }
        } else if (this.color.mode === GradientRange.Mode.TwoColors) {
            const { colorMin, colorMax } = this.color;
            if (context.executionStage === ModuleExecStage.SPAWN) {
                for (let i = fromIndex; i < toIndex; i++) {
                    color[i] = Color.toUint32(Color.lerp(tempColor, colorMin, colorMax, rand.getFloat()));
                }
            } else {
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex; i < toIndex; i++) {
                    color[i] = Color.toUint32(Color.lerp(tempColor, colorMin, colorMax, RandNumGen.getFloat(randomSeed[i] + COLOR_RAND_SEED)));
                }
            }
        } else if (this.color.mode === GradientRange.Mode.TwoGradients) {
            const { gradientMin, gradientMax } = this.color;
            if (context.executionStage === ModuleExecStage.SPAWN) {
                const spawnTime = particles.spawnTimeRatio.data;
                for (let i = fromIndex, num = 0; i < toIndex; i++, num++) {
                    const time = lerp(normalizedT, normalizedPrevT, spawnTime[i]);
                    color[i] = Color.toUint32(Color.lerp(tempColor,
                        gradientMin.evaluate(tempColor2, time), gradientMax.evaluate(tempColor3, time), rand.getFloat()));
                }
            } else {
                const normalizedAliveTime = particles.normalizedAliveTime.data;
                const randomSeed = particles.randomSeed.data;
                for (let i = fromIndex, num = 0; i < toIndex; i++, num++) {
                    const time = normalizedAliveTime[i];
                    color[i] = Color.toUint32(Color.lerp(tempColor,
                        gradientMin.evaluate(tempColor2, time), gradientMax.evaluate(tempColor3, time), RandNumGen.getFloat(randomSeed[i] + COLOR_RAND_SEED)));
                }
            }
        } else {
            const { gradient } = this.color;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                color[i] = Color.toUint32(gradient.evaluate(tempColor, RandNumGen.getFloat(randomSeed[i] + COLOR_RAND_SEED)));
            }
        }
    }
}
