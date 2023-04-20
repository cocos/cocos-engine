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

import { ccclass, displayOrder, serializable, tooltip, type } from 'cc.decorator';
import { VFXModule, ModuleExecStage, ModuleExecStageFlags } from '../vfx-module';
import { BuiltinParticleParameterFlags, BuiltinParticleParameterName as ParameterName, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext, VFXEmitterParams, VFXEmitterState } from '../base';
import { ColorExpression } from '../expressions/color';
import { Color } from '../../core';
import { RandomStream } from '../random-stream';

const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();

const COLOR_RAND_SEED = 1767123;

@ccclass('cc.SetColorModule')
@VFXModule.register('SetColor', ModuleExecStageFlags.SPAWN, [ParameterName.COLOR], [ParameterName.NORMALIZED_ALIVE_TIME])
export class SetColorModule extends VFXModule {
    /**
      * @zh 粒子初始颜色。
      */
    @type(ColorExpression)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:particle_system.baseColor')
    public color = new ColorExpression();

    private _rand = new RandomStream();

    public onPlay (params: VFXEmitterParams, state: VFXEmitterState) {
        this._rand.seed = state.randomStream.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: VFXEmitterParams, context: ModuleExecContext) {
        particles.markRequiredParameters(BuiltinParticleParameterFlags.COLOR);
        if (context.executionStage === ModuleExecStage.SPAWN) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.BASE_COLOR);
        }
        if (this.color.mode === ColorExpression.Mode.GRADIENT || this.color.mode === ColorExpression.Mode.TWO_GRADIENTS) {
            if (context.executionStage === ModuleExecStage.SPAWN) {
                particles.markRequiredParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
            } else {
                particles.markRequiredParameters(BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME);
            }
        }
        if (this.color.mode === ColorExpression.Mode.TWO_CONSTANTS || this.color.mode === ColorExpression.Mode.TWO_GRADIENTS || this.color.mode === ColorExpression.Mode.RANDOM_COLOR) {
            particles.markRequiredParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const color = context.executionStage === ModuleExecStage.SPAWN ? particles.baseColor.data : particles.color.data;
        const { fromIndex, toIndex } = context;
        if (this.color.mode === ColorExpression.Mode.CONSTANT) {
            const colorNum = Color.toUint32(this.color.color);
            for (let i = fromIndex; i < toIndex; i++) {
                color[i] = colorNum;
            }
        } else if (this.color.mode === ColorExpression.Mode.GRADIENT) {
            const { gradient } = this.color;
            const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
            for (let i = fromIndex, num = 0; i < toIndex; i++, num++) {
                color[i] = Color.toUint32(gradient.evaluate(tempColor, normalizedTime[i]));
            }
        } else if (this.color.mode === ColorExpression.Mode.TWO_CONSTANTS) {
            const { colorMin, colorMax } = this.color;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                color[i] = Color.toUint32(Color.lerp(tempColor, colorMin, colorMax, RandomStream.getFloat(randomSeed[i] + COLOR_RAND_SEED)));
            }
        } else if (this.color.mode === ColorExpression.Mode.TWO_GRADIENTS) {
            const { gradientMin, gradientMax } = this.color;
            const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex, num = 0; i < toIndex; i++, num++) {
                const time = normalizedTime[i];
                color[i] = Color.toUint32(Color.lerp(tempColor,
                    gradientMin.evaluate(tempColor2, time), gradientMax.evaluate(tempColor3, time), RandomStream.getFloat(randomSeed[i] + COLOR_RAND_SEED)));
            }
        } else {
            const { gradient } = this.color;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; ++i) {
                color[i] = Color.toUint32(gradient.evaluate(tempColor, RandomStream.getFloat(randomSeed[i] + COLOR_RAND_SEED)));
            }
        }
    }
}
