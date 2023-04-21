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

import { CCBoolean, EPSILON, Quat, Vec2, Vec3, Mat4, pseudoRandom, Mat3, CCFloat } from '../../core';
import { ccclass, displayOrder, radian, serializable, type, visible } from '../../core/data/decorators';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';

const velo = new Vec3();
const scaleOffset = new Vec2();
const range = new Vec2();

const SIZE_RND_SEED = 175610;

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

@ccclass('cc.SizeSpeedModule')
export class SizeSpeedModule extends ParticleModuleBase {
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

    @type(CCBoolean)
    @serializable
    @displayOrder(1)
    public size3D = false;

    @type(CurveRange)
    @serializable
    @displayOrder(2)
    public sizeX = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(3)
    @visible(function (this: SizeSpeedModule): boolean { return this.size3D; })
    public sizeY = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(4)
    @visible(function (this: SizeSpeedModule): boolean { return this.size3D; })
    public sizeZ = new CurveRange();

    @type(CCFloat)
    @serializable
    @displayOrder(5)
    public rangeX = 0.0;

    @type(CCFloat)
    @serializable
    @displayOrder(6)
    public rangeY = 1.0;

    public name: string = PARTICLE_MODULE_NAME.SIZESPEED;

    constructor () {
        super();
        this.needUpdate = true;
    }

    public update (ps, space, worldTransform) {
        this.sizeX.bake();
        this.sizeY.bake();
        this.sizeZ.bake();
    }

    public animate (p: Particle, dt: number): void {
        velo.set(p.velocity.x + p.animatedVelocity.x, p.velocity.y + p.animatedVelocity.y, p.velocity.z + p.animatedVelocity.z);
        const linearVelocity = velo.length();

        range.set(this.rangeX, this.rangeY);
        inverseLerpOffset(scaleOffset, range);
        const time = inverseLerp(scaleOffset, linearVelocity);

        if (!this.size3D) {
            const rnd = pseudoRandom(p.randomSeed + SIZE_RND_SEED);
            let size = this.sizeX.evaluate(time, rnd);
            size = size > 0.0 ? size : 0.0;
            p.animatedSize.set(size, size, size);
        } else {
            const rndX = pseudoRandom(p.randomSeed + SIZE_RND_SEED + 1);
            const rndY = pseudoRandom(p.randomSeed + SIZE_RND_SEED + 2);
            const rndZ = pseudoRandom(p.randomSeed + SIZE_RND_SEED + 3);

            const sx = this.sizeX.evaluate(time, rndX);
            const sy = this.sizeY.evaluate(time, rndY);
            const sz = this.sizeZ.evaluate(time, rndZ);

            p.animatedSize.set(sx > 0 ? sx : 0, sy > 0 ? sy : 0, sz > 0 ? sz : 0);
        }
    }
}
