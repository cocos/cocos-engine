/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { pseudoRandom } from '../../core';
import { Particle, PARTICLE_MODULE_NAME, ParticleModuleBase } from '../particle';
import GradientRange from './gradient-range';
import { ModuleRandSeed } from '../enum';
import { isGradientTwoValues } from '../particle-general-function';

const COLOR_OVERTIME_RAND_OFFSET = ModuleRandSeed.COLOR;

@ccclass('cc.ColorOvertimeModule')
export default class ColorOvertimeModule extends ParticleModuleBase {
    @serializable
    _enable = false;
    /**
     * @zh 是否启用。
     */
    @displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
    }

    /**
     * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
     */
    @type(GradientRange)
    @serializable
    @displayOrder(1)
    public color = new GradientRange();
    public name = PARTICLE_MODULE_NAME.COLOR;

    public animate (particle: Particle) {
        particle.color.set(particle.startColor);
        const rand = isGradientTwoValues(this.color) ? pseudoRandom(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET) : 0;
        particle.color.multiply(this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, rand));
    }
}
