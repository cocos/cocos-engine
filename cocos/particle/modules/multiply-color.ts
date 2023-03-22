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
import { Color, pseudoRandom } from '../../core/math';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { GradientRange } from '../gradient-range';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const COLOR_OVERTIME_RAND_OFFSET = 91041;
const tempColor = new Color();
const tempColor2 = new Color();
const tempColor3 = new Color();

@ccclass('cc.MultiplyColor')
@ParticleModule.register('MultiplyColor', ModuleExecStage.UPDATE, 21)
export class MultiplyColorModule extends ParticleModule {
    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(1)
    public color = new GradientRange();

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex } = context;
        const { color } = particles;
        if (this.color.mode === GradientRange.Mode.Color) {
            const constantColor = this.color.color;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(constantColor, i);
            }
        } else if (this.color.mode === GradientRange.Mode.Gradient) {
            const gradient = this.color.gradient;
            const { normalizedAliveTime } = particles;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(gradient.evaluate(tempColor, normalizedAliveTime[i]), i);
            }
        } else if (this.color.mode === GradientRange.Mode.RandomColor) {
            const gradient = this.color.gradient;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(gradient.randomColor(tempColor), i);
            }
        } else if (this.color.mode === GradientRange.Mode.TwoColors) {
            const { colorMax, colorMin } = this.color;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                color.multiplyColorAt(Color.lerp(tempColor, colorMin,
                    colorMax, pseudoRandom(randomSeed[i] + COLOR_OVERTIME_RAND_OFFSET)), i);
            }
        } else {
            const { gradientMin, gradientMax } = this.color;
            const normalizedAliveTime = particles.normalizedAliveTime.data;
            const randomSeed = particles.randomSeed.data;
            for (let i = fromIndex; i < toIndex; i++) {
                const time = normalizedAliveTime[i];
                color.multiplyColorAt(Color.lerp(tempColor,
                    gradientMin.evaluate(tempColor2, time),
                    gradientMax.evaluate(tempColor3, time),
                    pseudoRandom(randomSeed[i] + COLOR_OVERTIME_RAND_OFFSET)), i);
            }
        }
    }
}
