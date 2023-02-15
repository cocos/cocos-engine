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
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { GradientRange } from '../gradient-range';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';

const COLOR_OVERTIME_RAND_OFFSET = 91041;
const tempColor2 = new Color();

@ccclass('cc.ColorOverLifetimeModule')
export class ColorOverLifetimeModule extends ParticleModule {
    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(1)
    public color = new GradientRange();

    public get name (): string {
        return 'ColorModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.POST_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext) {
        const count = particles.count;
        if (this.color.mode === GradientRange.Mode.Color) {
            const color = this.color.color;
            for (let i = 0; i < count; i++) {
                particles.multipleColorAt(color, i);
            }
        } else if (this.color.mode === GradientRange.Mode.Gradient) {
            const color = this.color.gradient;
            const { normalizedAliveTime } = particles;
            for (let i = 0; i < count; i++) {
                particles.multipleColorAt(color.evaluate(normalizedAliveTime[i]), i);
            }
        } else if (this.color.mode === GradientRange.Mode.RandomColor) {
            const color = this.color.gradient;
            for (let i = 0; i < count; i++) {
                particles.multipleColorAt(color.randomColor(), i);
            }
        } else if (this.color.mode === GradientRange.Mode.TwoColors) {
            const { colorMax, colorMin } = this.color;
            const { randomSeed } = particles;
            for (let i = 0; i < count; i++) {
                particles.multipleColorAt(Color.lerp(tempColor2, colorMin,
                    colorMax, pseudoRandom(randomSeed[i] + COLOR_OVERTIME_RAND_OFFSET)), i);
            }
        } else {
            const { gradientMin, gradientMax } = this.color;
            const { randomSeed, normalizedAliveTime } = particles;
            for (let i = 0; i < count; i++) {
                particles.multipleColorAt(Color.lerp(tempColor2,
                    gradientMin.evaluate(normalizedAliveTime[i]),
                    gradientMax.evaluate(normalizedAliveTime[i]),
                    pseudoRandom(randomSeed[i] + COLOR_OVERTIME_RAND_OFFSET)), i);
            }
        }
    }
}
