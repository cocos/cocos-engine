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

import { CCBoolean, EPSILON, Quat, Vec2, Vec3, Mat4, pseudoRandom, Mat3 } from '../../core';
import { ccclass, displayOrder, radian, serializable, type, visible } from '../../core/data/decorators';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';

const velo = new Vec3();
const scaleOffset = new Vec2();
const eular = new Vec3();
const dQuat = new Quat();
const pQuat = new Quat();

const ROTATION_RND_SEED = 165610;

function saturate (val: number, min = 0.0, max = 1.0) {
    return Math.min(Math.max(val, min), max);
}

function mad (arr: number[]) {
    let sum = 0.0;
    for (let i = 0; i < arr.length; ++i) {
        sum += arr[i];
    }
    const mean = sum / arr.length;

    let absSum = 0.0;
    for (let i = 0; i < arr.length; ++i) {
        absSum += Math.abs(arr[i] - mean);
    }
    return absSum / arr.length;
}

function inverseLerp (offset: Vec2, v: number) {
    return saturate(v * offset.x + offset.y);
}

function inverseLerpOffset (out: Vec2, range: Vec2) {
    const delta = range.y - range.x;
    const scale = Math.abs(delta) > EPSILON ? 1.0 / delta : range.x;
    out.set(scale, -range.x * scale);
}

function revertToQuat (output: Quat, input: Vec3) {
    output.set(input.x, input.y, input.z, 0.0);
    let mulFactor = 1.0;
    if (output.x > Particle.INDENTIFY_NEG_QUAT * 0.5) {
        output.x -= Particle.INDENTIFY_NEG_QUAT;
        mulFactor = -1.0;
    }
    output.w = mulFactor * Math.sqrt(Math.abs(1.0 - input.x * input.x - input.y * input.y - input.z * input.z));
    Quat.normalize(output, output);
}

function compressQuat (output: Vec3, input: Quat) {
    Quat.normalize(input, input);
    output.set(input.x, input.y, input.z);
    if (input.w < 0.0) { // Use vec3 to save quat so we need identify negative w
        output.x += Particle.INDENTIFY_NEG_QUAT; // Indentify negative w & revert the quat in shader
    }
}

@ccclass('cc.RotationSpeedModule')
export class RotationSpeedModule extends ParticleModuleBase {
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
    public rotation3D = false;

    @type(CurveRange)
    @serializable
    @radian
    @displayOrder(2)
    @visible(function (this: RotationSpeedModule): boolean { return this.rotation3D; })
    public rotationX = new CurveRange();

    @type(CurveRange)
    @serializable
    @radian
    @displayOrder(3)
    @visible(function (this: RotationSpeedModule): boolean { return this.rotation3D; })
    public rotationY = new CurveRange();

    @type(CurveRange)
    @serializable
    @radian
    @displayOrder(4)
    public rotationZ = new CurveRange();

    public range = new Vec2(0.0, 1.0);

    public name: string = PARTICLE_MODULE_NAME.ROTATIONSPEED;

    constructor () {
        super();
        this.needUpdate = true;
    }

    public update (ps, space, worldTransform) {
        this.rotationX.bake();
        this.rotationY.bake();
        this.rotationZ.bake();
    }

    public animate (p: Particle, dt: number): void {
        velo.set(p.velocity.x + p.animatedVelocity.x, p.velocity.y + p.animatedVelocity.y, p.velocity.z + p.animatedVelocity.z);
        const linearVelocity = velo.length();

        inverseLerpOffset(scaleOffset, this.range);
        const time = inverseLerp(scaleOffset, linearVelocity);

        const rndX = pseudoRandom(p.randomSeed + ROTATION_RND_SEED + 1);
        const rndY = pseudoRandom(p.randomSeed + ROTATION_RND_SEED + 2);
        const rndZ = pseudoRandom(p.randomSeed + ROTATION_RND_SEED + 3);

        const flipPercent = 0.0;
        const rndFlip = pseudoRandom(p.randomSeed + ROTATION_RND_SEED + 10);
        const flip = rndFlip > flipPercent ? -1.0 : 1.0;

        if (this.rotation3D) {
            // eslint-disable-next-line max-len
            eular.set(this.rotationX.evaluate(time, rndX) * flip, this.rotationY.evaluate(time, rndY) * flip, this.rotationZ.evaluate(time, rndZ) * flip);
        } else {
            eular.set(0.0, 0.0, this.rotationZ.evaluate(time, rndZ) * flip);
        }
        Quat.fromEuler(pQuat, p.startEuler.x * Particle.R2D, p.startEuler.y * Particle.R2D, p.startEuler.z * Particle.R2D);
        Quat.normalize(pQuat, pQuat);

        Quat.fromEuler(dQuat, eular.x, eular.y, eular.z);
        Quat.normalize(dQuat, dQuat);

        Quat.multiply(p.localQuat, dQuat, p.localQuat);

        Quat.multiply(pQuat, p.localQuat, pQuat);

        Quat.toEuler(p.rotation, pQuat);
        Vec3.set(p.rotation, p.rotation.x / Particle.R2D, p.rotation.y / Particle.R2D, p.rotation.z / Particle.R2D);
    }
}
