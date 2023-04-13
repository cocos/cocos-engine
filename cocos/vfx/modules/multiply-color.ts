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

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { Color } from '../../core/math';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ColorExpression } from '../expression/color-expression';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleEmitterState, ParticleExecContext } from '../particle-base';
import { RandomStream } from '../random-stream';

const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();

@ccclass('cc.MultiplyColor')
@ParticleModule.register('MultiplyColor', ModuleExecStage.UPDATE | ModuleExecStage.SPAWN, [], [BuiltinParticleParameterName.NORMALIZED_ALIVE_TIME])
export class MultiplyColorModule extends ParticleModule {
    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(ColorExpression)
    @serializable
    @displayOrder(1)
    public color = new ColorExpression();

    private _randomOffset = 0;

    public onPlay (params: ParticleEmitterParams, state: ParticleEmitterState) {
        this._randomOffset = state.rand.getUInt32();
    }

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.COLOR);
        if (this.color.mode === ColorExpression.Mode.TWO_GRADIENTS || this.color.mode === ColorExpression.Mode.TWO_CONSTANTS || this.color.mode === ColorExpression.Mode.RANDOM_COLOR) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.RANDOM_SEED);
        }
        if (this.color.mode === ColorExpression.Mode.TWO_GRADIENTS || this.color.mode === ColorExpression.Mode.GRADIENT) {
            if (context.executionStage === ModuleExecStage.UPDATE) {
                context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.NORMALIZED_ALIVE_TIME);
            } else {
                context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.SPAWN_NORMALIZED_TIME);
            }
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const color = context.executionStage === ModuleExecStage.UPDATE ? particles.color : particles.baseColor;
        const randomOffset = this._randomOffset;
        if (this.color.mode === ColorExpression.Mode.CONSTANT) {
            const colorVal = this.color.color;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(colorVal, i);
            }
        } else if (this.color.mode === ColorExpression.Mode.TWO_CONSTANTS) {
            const { colorMin, colorMax } = this.color;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(Color.lerp(tempColor, colorMin, colorMax, RandomStream.getFloat(randomSeed[i] + randomOffset)), i);
            }
        } else if (this.color.mode === ColorExpression.Mode.GRADIENT) {
            const gradient = this.color.gradient;
            const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(gradient.evaluate(tempColor, normalizedTime[i]), i);
            }
        } else if (this.color.mode === ColorExpression.Mode.TWO_GRADIENTS) {
            const { gradientMin, gradientMax } = this.color;
            const normalizedTime = context.executionStage === ModuleExecStage.UPDATE ? particles.normalizedAliveTime.data : particles.spawnNormalizedTime.data;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                const time = normalizedTime[i];
                color.multiplyColorAt(Color.lerp(tempColor,
                    gradientMin.evaluate(tempColor2, time),
                    gradientMax.evaluate(tempColor3, time),
                    RandomStream.getFloat(randomSeed[i] + randomOffset)), i);
            }
        } else {
            const randomSeed = particles.randomSeed.data;
            const gradient = this.color.gradient;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(gradient.evaluate(tempColor, RandomStream.getFloat(randomSeed[i] + randomOffset)), i);
            }
        }
    }
}
