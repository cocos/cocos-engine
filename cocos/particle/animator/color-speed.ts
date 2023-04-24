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

import { EPSILON, Vec2, Vec3, pseudoRandom, CCFloat, Color } from '../../core';
import { ccclass, displayOrder, serializable, type } from '../../core/data/decorators';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import GradientRange from './gradient-range';

const velo = new Vec3();
const scaleOffset = new Vec2();
const range = new Vec2();

const COLOR_RND_SEED = 234120;

function saturate (val: number, min = 0.0, max = 1.0) {
    return Math.min(Math.max(val, min), max);
}

function inverseLerp (offset: Vec2, v: number) {
    return saturate(v * offset.x + offset.y);
}

function inverseLerpOffset (out: Vec2, range: Vec2) {
    const delta = range.y - range.x;
    const scale = Math.abs(delta) > EPSILON ? 1.0 / delta : range.x;
    out.set(scale, -range.x * scale);
}

@ccclass('cc.ColorSpeedModule')
export class ColorSpeedModule extends ParticleModuleBase {
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

    @type(GradientRange)
    @serializable
    @displayOrder(1)
    public color = new GradientRange();

    @type(CCFloat)
    @serializable
    @displayOrder(2)
    public rangeX = 0.0;

    @type(CCFloat)
    @serializable
    @displayOrder(3)
    public rangeY = 1.0;

    public name: string = PARTICLE_MODULE_NAME.COLORSPEED;

    constructor () {
        super();
        this.needUpdate = true;
    }

    public update (ps, space, worldTransform) {
        this.color.bake();
    }

    public animate (p: Particle, dt: number): void {
        velo.set(p.velocity.x + p.animatedVelocity.x, p.velocity.y + p.animatedVelocity.y, p.velocity.z + p.animatedVelocity.z);
        const linearVelocity = velo.length();

        range.set(this.rangeX, this.rangeY);
        inverseLerpOffset(scaleOffset, range);
        const time = inverseLerp(scaleOffset, linearVelocity);
        const rnd = pseudoRandom(p.randomSeed + COLOR_RND_SEED);

        const value: Color = this.color.evaluate(time, rnd);
        p.animatedColor.set(value);
    }
}
