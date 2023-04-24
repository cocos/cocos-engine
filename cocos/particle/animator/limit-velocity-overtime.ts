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

import { ccclass, tooltip, displayOrder, range, type, serializable, visible } from 'cc.decorator';
import { lerp, pseudoRandom, Vec3, Mat4, Quat } from '../../core/math';
import { Space, ModuleRandSeed } from '../enum';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import CurveRange from './curve-range';
import { calculateTransform } from '../particle-general-function';
import { CCBoolean, CCFloat } from '../../core';
import { ParticleSystem } from '../particle-system';

const LIMIT_VELOCITY_RAND_OFFSET = ModuleRandSeed.LIMIT;
const LIMIT_DRAG_RAND_OFFSET = LIMIT_VELOCITY_RAND_OFFSET + 1;

const animatedVelocity = new Vec3();
const magVel = new Vec3();
const normalizedVel = new Vec3();

@ccclass('cc.LimitVelocityOvertimeModule')
export default class LimitVelocityOvertimeModule extends ParticleModuleBase {
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
     * @zh X 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(4)
    @tooltip('i18n:limitVelocityOvertimeModule.limitX')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return this.separateAxes;
    })
    public limitX = new CurveRange();

    /**
     * @zh Y 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(5)
    @tooltip('i18n:limitVelocityOvertimeModule.limitY')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return this.separateAxes;
    })
    public limitY = new CurveRange();

    /**
     * @zh Z 轴方向上的速度下限。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(6)
    @tooltip('i18n:limitVelocityOvertimeModule.limitZ')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return this.separateAxes;
    })
    public limitZ = new CurveRange();

    /**
     * @zh 速度下限。
     */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @displayOrder(3)
    @tooltip('i18n:limitVelocityOvertimeModule.limit')
    @visible(function (this: LimitVelocityOvertimeModule): boolean {
        return !this.separateAxes;
    })
    public limit = new CurveRange();

    /**
     * @zh 当前速度与速度下限的插值。
     */
    @serializable
    @displayOrder(7)
    @tooltip('i18n:limitVelocityOvertimeModule.dampen')
    public dampen = 3;

    /**
     * @zh 是否三个轴分开限制。
     */
    @serializable
    @displayOrder(2)
    @tooltip('i18n:limitVelocityOvertimeModule.separateAxes')
    public separateAxes = false;

    /**
     * @zh 计算速度下限时采用的坐标系 [[Space]]。
     */
    @type(Space)
    @serializable
    @displayOrder(1)
    @tooltip('i18n:limitVelocityOvertimeModule.space')
    public space = Space.Local;

    @type(CurveRange)
    @serializable
    @displayOrder(8)
    public drag = new CurveRange();

    @type(CCFloat)
    @serializable
    @displayOrder(9)
    public sizeFactor = 1.0;

    @type(CCBoolean)
    @serializable
    @displayOrder(10)
    public multiplyDragByParticleSize = false;

    @type(CCBoolean)
    @serializable
    @displayOrder(11)
    public multiplyDragByParticleVelocity = false;

    public name = PARTICLE_MODULE_NAME.LIMIT;
    private rotation: Quat;
    private invRot: Quat;
    private needTransform: boolean;

    constructor () {
        super();
        this.rotation = new Quat();
        this.invRot = new Quat();
        this.needTransform = false;
        this.needUpdate = true;
    }

    public update (ps:ParticleSystem, space: number, worldTransform: Mat4) {
        this.needTransform = calculateTransform(space, this.space, worldTransform, this.rotation);
    }

    private applyDrag (p: Particle, dt: number, velNormalized: Vec3, velMag: number) {
        if (this.drag.getMaxAbs() === 0.0) {
            return;
        }
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        const dragCoefficient = this.drag.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_DRAG_RAND_OFFSET));
        let maxDimension = p.size.x > p.size.y ? p.size.x : p.size.y;
        maxDimension = maxDimension > p.size.z ? maxDimension : p.size.z;
        maxDimension *= 0.5;
        maxDimension *= this.sizeFactor;
        const circleArea = (Math.PI * maxDimension * maxDimension);

        let dragN = dragCoefficient;
        dragN *= this.multiplyDragByParticleSize ? circleArea : 1.0;
        dragN *= this.multiplyDragByParticleVelocity ? velMag * velMag : 1.0;

        let mag = velMag - dragN * dt;
        mag = mag < 0 ? 0 : mag;

        magVel.set(velNormalized.x * mag, velNormalized.y * mag, velNormalized.z * mag);
    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;

        animatedVelocity.set(p.animatedVelocity);
        magVel.set(p.velocity.x + animatedVelocity.x, p.velocity.y + animatedVelocity.y, p.velocity.z + animatedVelocity.z);

        if (this.separateAxes) {
            const limitX = this.limitX.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET));
            const limitY = this.limitY.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET));
            const limitZ = this.limitZ.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET));

            if (this.needTransform) {
                Vec3.transformQuat(magVel, magVel, this.rotation);
            }
            Vec3.set(magVel,
                dampenBeyondLimit(magVel.x, limitX, this.dampen),
                dampenBeyondLimit(magVel.y, limitY, this.dampen),
                dampenBeyondLimit(magVel.z, limitZ, this.dampen));

            Vec3.normalize(normalizedVel, magVel);
            const velLen = magVel.length();
            this.applyDrag(p, dt, normalizedVel, velLen);

            magVel.set(magVel.x - animatedVelocity.x, magVel.y - animatedVelocity.y, magVel.z - animatedVelocity.z);

            if (this.needTransform) {
                Quat.invert(this.invRot, this.rotation);
                Vec3.transformQuat(magVel, magVel, this.invRot);
            }
        } else {
            const lmt = this.limit.evaluate(normalizedTime, pseudoRandom(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET));
            let velLen = magVel.length();
            Vec3.normalize(normalizedVel, magVel);

            const damped = dampenBeyondLimit(velLen, lmt, this.dampen);
            magVel.set(normalizedVel.x * damped, normalizedVel.y * damped, normalizedVel.z * damped);

            Vec3.normalize(normalizedVel, magVel);
            velLen = magVel.length();
            this.applyDrag(p, dt, normalizedVel, velLen);

            magVel.set(magVel.x - animatedVelocity.x, magVel.y - animatedVelocity.y, magVel.z - animatedVelocity.z);
        }
        p.velocity.set(magVel);
    }
}

function dampenBeyondLimit (vel: number, limit: number, dampen: number) {
    const sgn = Math.sign(vel);
    let abs = Math.abs(vel);
    if (abs > limit) {
        abs = lerp(abs, limit, dampen);
    }
    return abs * sgn;
}
