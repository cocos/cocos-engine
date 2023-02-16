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
import { InitializationModule, ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleEmitterContext, ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';
import { GradientRange } from '../gradient-range';
import { Color, lerp, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';

const tempColor = new Color();

@ccclass('cc.StartColorModule')
export class StartColorModule extends InitializationModule {
    /**
      * @zh 粒子初始颜色。
      */
    @type(GradientRange)
    @serializable
    @displayOrder(8)
    @tooltip('i18n:particle_system.startColor')
    public startColor = new GradientRange();

    public get name (): string {
        return 'StartColorModule';
    }

    public get updatePriority (): number {
        return 1;
    }

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext) {
        const { newParticleIndexStart, newParticleIndexEnd, normalizedTimeInCycle } = context;
        const { startColor, color } = particles;
        if (this.startColor.mode === GradientRange.Mode.Color) {
            const colorNum = Color.toUint32(this.startColor.color);
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                color[i] = startColor[i] = colorNum;
            }
        } else if (this.startColor.mode === GradientRange.Mode.Gradient) {
            const { gradient } = this.startColor;
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                color[i] = startColor[i] = Color.toUint32(gradient.evaluate(normalizedTimeInCycle));
            }
        } else if (this.startColor.mode === GradientRange.Mode.TwoColors) {
            const { colorMin, colorMax } = this.startColor;
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                color[i] = startColor[i] = Color.toUint32(Color.lerp(tempColor, colorMin, colorMax, rand));
            }
        } else if (this.startColor.mode === GradientRange.Mode.TwoGradients) {
            const { gradientMin, gradientMax } = this.startColor;
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                color[i] = startColor[i] = Color.toUint32(Color.lerp(tempColor, gradientMin.evaluate(normalizedTimeInCycle), gradientMax.evaluate(normalizedTimeInCycle), rand));
            }
        } else {
            const { gradient } = this.startColor;
            for (let i = newParticleIndexStart; i < newParticleIndexEnd; ++i) {
                color[i] = startColor[i] = Color.toUint32(gradient.randomColor());
            }
        }
    }
}
