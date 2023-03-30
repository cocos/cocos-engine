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
import { GradientRange } from '../gradient-range';
import { BuiltinParticleParameter, BuiltinParticleParameterName, ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { assert } from '../../core';
import { RandNumGen } from '../rand-num-gen';

const COLOR_OVERTIME_RAND_OFFSET = 91041;
const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();

@ccclass('cc.MultiplyColor')
@ParticleModule.register('MultiplyColor', ModuleExecStage.UPDATE, [], [BuiltinParticleParameterName.NORMALIZED_ALIVE_TIME])
export class MultiplyColorModule extends ParticleModule {
    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(1)
    public color = new GradientRange();

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        assert(this.color.mode === GradientRange.Mode.Gradient || this.color.mode === GradientRange.Mode.TwoGradients, 'Color mode must be Gradient or TwoGradients');
        context.markRequiredParameter(BuiltinParticleParameter.COLOR);
        context.markRequiredParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
        if (this.color.mode === GradientRange.Mode.TwoGradients || this.color.mode === GradientRange.Mode.Color) {
            context.markRequiredParameter(BuiltinParticleParameter.RANDOM_SEED);
        }
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const { color } = particles;
        if (this.color.mode === GradientRange.Mode.Gradient) {
            const gradient = this.color.gradient;
            const { normalizedAliveTime } = particles;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(gradient.evaluate(tempColor, normalizedAliveTime[i]), i);
            }
        } else if (this.color.mode === GradientRange.Mode.TwoGradients) {
            const { gradientMin, gradientMax } = this.color;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                const time = normalizedAliveTime[i];
                color.multiplyColorAt(Color.lerp(tempColor,
                    gradientMin.evaluate(tempColor2, time),
                    gradientMax.evaluate(tempColor3, time),
                    RandNumGen.getFloat(randomSeed[i] + COLOR_OVERTIME_RAND_OFFSET)), i);
            }
        }
    }
}
